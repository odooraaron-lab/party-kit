import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { REVIEWABLE, productName } from '@/lib/listings';
import { rateLimited, validEmail, clean, sign } from '@/lib/guard';
import { sendEmail, escapeHtml } from '@/lib/email';
import { siteUrl } from '@/lib/stripe';

// GET ?product=story  → approved reviews and the average rating (no product = latest across the shop)
export async function GET(req: Request) {
  const product = new URL(req.url).searchParams.get('product');
  if (product && !REVIEWABLE.has(product)) return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
  const reviews = await db().approvedReviews(product, product ? 50 : 6);
  const average = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  return NextResponse.json(
    { reviews: reviews.map((r) => ({ ...r, productName: productName(r.product) })), count: reviews.length, average: Math.round(average * 10) / 10 },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  );
}

// POST { product, name, email, rating, text, website } → saved as pending; you approve it by email.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden fields
  if (rateLimited(req, 'review', 5)) return NextResponse.json({ error: 'Too many reviews from here. Try again later.' }, { status: 429 });
  const product = clean(b.product, 40);
  const name = clean(b.name, 40);
  const email = clean(b.email, 200);
  const text = clean(b.text, 1200);
  const rating = Math.round(Number(b.rating));
  if (!REVIEWABLE.has(product)) return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: 'Add your first name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Add a valid email. We won’t show it.' }, { status: 400 });
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Choose a star rating.' }, { status: 400 });
  if (text.length < 10) return NextResponse.json({ error: 'Tell us a little more (at least 10 characters).' }, { status: 400 });

  const verified = ['story', 'photos', 'slideshow'].includes(product) && (await db().hasPurchased(email, product));
  const review = { id: crypto.randomUUID(), product, name, email, rating, text, verified, status: 'pending' as const, createdAt: Date.now() };
  await db().addReview(review);

  if (process.env.SHOP_OWNER_EMAIL) {
    const link = (action: string) => `${siteUrl()}/api/reviews/moderate?id=${review.id}&action=${action}&sig=${sign(review.id, action)}`;
    await sendEmail({
      to: process.env.SHOP_OWNER_EMAIL,
      subject: `New ${rating}-star review for ${productName(product)}`,
      replyTo: email,
      html: `<p><b>${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</b> from ${escapeHtml(name)}${verified ? ' (verified buyer)' : ''}</p>
        <blockquote>${escapeHtml(text).replace(/\n/g, '<br>')}</blockquote>
        <p><a href="${link('approve')}">Approve and publish</a> &nbsp;·&nbsp; <a href="${link('reject')}">Reject</a></p>`,
    }).catch((e) => console.error('review email failed', e));
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
