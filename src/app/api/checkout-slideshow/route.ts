import { NextResponse } from 'next/server';
import { stripe, siteUrl } from '@/lib/stripe';
import { SLIDESHOW_PRODUCT as P, cleanTitle } from '@/lib/slideshow-config';
import { baseSlug } from '@/lib/slug';
import { STRIPE_OPTIONS as O } from '@/lib/stripe-options';

// POST { title, slug, email } → Stripe Checkout URL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = cleanTitle(body.title);
    const email = String(body.email ?? '').trim();
    const slug = baseSlug(String(body.slug || body.title || ''));
    if (!title) throw new Error('Enter a slideshow title (2–50 letters or numbers).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw new Error('Enter a valid email address.');

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'nzd',
          unit_amount: P.price,
          product_data: { name: `${P.name} · ${title}`, description: `Your photos and videos on any TV · online for ${P.monthsLive} months` },
        },
      }],
      metadata: { product: 'slideshow', kind: 'slideshow', name: title, slug },
      success_url: `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/tv-slideshow`,
      allow_promotion_codes: O.promotionCodes || undefined,
      customer_creation: O.saveCustomers ? 'always' : 'if_required',
      expires_at: Math.floor(Date.now() / 1000) + Math.min(24 * 60, Math.max(30, O.sessionMinutes)) * 60,
      custom_text: { submit: { message: 'Straight after paying you can upload your photos and videos.' } },
      ...(O.taxInvoices ? { invoice_creation: { enabled: true } } : {}),
      ...(O.requireTerms ? { consent_collection: { terms_of_service: 'required' as const } } : {}),
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('slideshow checkout error', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Checkout failed' }, { status: 400 });
  }
}
