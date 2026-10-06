// app/api/inbound-webhook/route.ts
// Forwards every email received at @myqr.co.nz (via Resend Receiving) to adminmyqr@gmail.com.
//
// Needs these environment variables in Vercel:
//   RESEND_API_KEY        - a Resend API key with "Full access"
//   RESEND_WEBHOOK_SECRET - the signing secret from the webhook in Resend (starts with whsec_)
//
// Needs the package:  npm install resend   (use a recent version: receiving.forward is new)

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FORWARD_TO = 'adminmyqr@gmail.com';
// Must be an address on a domain you've verified for SENDING in Resend.
const FORWARD_FROM = 'MyQR Inbox <forwarder@myqr.co.nz>';

export async function POST(req: NextRequest) {
  try {
    // Use the raw body: the signature check fails if it's parsed and re-stringified.
    const payload = await req.text();

    const id = req.headers.get('svix-id');
    const timestamp = req.headers.get('svix-timestamp');
    const signature = req.headers.get('svix-signature');
    if (!id || !timestamp || !signature) {
      return new NextResponse('Missing headers', { status: 400 });
    }

    // Throws if the request didn't really come from Resend.
    const event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    });

    if (event.type !== 'email.received') {
      return NextResponse.json({ ignored: event.type });
    }

    // Fetches the original email (body + attachments) and sends it on, unchanged.
    const { data, error } = await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      to: FORWARD_TO,
      from: FORWARD_FROM,
    });

    if (error) {
      console.error('Forward failed:', error);
      // A 500 makes Resend retry the webhook later.
      return new NextResponse(`Forward failed: ${error.message}`, { status: 500 });
    }

    return NextResponse.json({ forwarded: true, data });
  } catch (err) {
    console.error(err);
    return new NextResponse('Invalid webhook', { status: 400 });
  }
}
