import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getStock } from '@/lib/listings';
import { rateLimited, validEmail, clean } from '@/lib/guard';

// POST { email, topic } — topic is "news" or "restock:<product id>"
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true });
  if (rateLimited(req, 'signup', 20)) return NextResponse.json({ error: 'Too many sign-ups from here. Try again later.' }, { status: 429 });
  const email = clean(b.email, 200);
  const topic = clean(b.topic, 60);
  if (!validEmail(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  const ok = topic === 'news' || (topic.startsWith('restock:') && getStock(topic.slice(8)));
  if (!ok) return NextResponse.json({ error: 'Unknown list.' }, { status: 400 });
  const added = await db().addSignup(email, topic);
  return NextResponse.json({ ok: true, already: !added });
}
