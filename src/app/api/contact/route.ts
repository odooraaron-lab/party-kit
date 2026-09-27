import { NextResponse } from 'next/server';
import { rateLimited, validEmail, clean } from '@/lib/guard';
import { sendEmail, escapeHtml } from '@/lib/email';

const TOPICS = ['An order', 'Help on the day', 'Wholesale or events', 'Something else'];

// POST { name, email, topic, message, website } → emailed to you, with reply-to set to the sender.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true });
  if (rateLimited(req, 'contact', 5)) return NextResponse.json({ error: 'Too many messages from here. Try again later, or email us.' }, { status: 429 });
  const name = clean(b.name, 80), email = clean(b.email, 200), message = clean(b.message, 3000);
  const topic = TOPICS.includes(b.topic) ? b.topic : 'Something else';
  if (name.length < 2) return NextResponse.json({ error: 'Add your name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Add a valid email so we can reply.' }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ error: 'Add a little more detail to your message.' }, { status: 400 });
  if (!process.env.SHOP_OWNER_EMAIL) {
    console.log('[contact]', { name, email, topic, message });
    return NextResponse.json({ ok: true });
  }
  await sendEmail({
    to: process.env.SHOP_OWNER_EMAIL,
    subject: `Website message: ${topic} — ${name}`,
    replyTo: email,
    html: `<p><b>${escapeHtml(name)}</b> &lt;${escapeHtml(email)}&gt;<br>${escapeHtml(topic)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
  });
  return NextResponse.json({ ok: true });
}
