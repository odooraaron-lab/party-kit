import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe, siteUrl } from '@/lib/stripe';
import { decodeCart, downloadsFor } from '@/lib/cart';
import { money } from '@/lib/money';
import { sendEmail, escapeHtml } from '@/lib/email';
import { provisionStory } from '@/lib/provision';

// Stripe calls this after payment. It's the only place an order is
// treated as real — never trust the success page alone.
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, sig ?? '', process.env.STRIPE_WEBHOOK_SECRET ?? '');
  } catch (err) {
    console.error('webhook signature failed', err);
    return new NextResponse('Bad signature', { status: 400 });
  }

  // One Stripe account serves every myQR site (Resthome TV, Digital Signage…), so this webhook also
  // hears about their payments. Only act on checkouts this shop created: an app kind or a cart.
  if (event.type.startsWith('checkout.session.') && !isOurs(event.data.object as Stripe.Checkout.Session)) {
    return NextResponse.json({ received: true, ignored: 'not a Wishcast checkout' });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') {
      if (['story', 'photos', 'slideshow'].includes(session.metadata?.kind ?? '')) {
        try {
          await provisionStory(session);
        } catch (err) {
          // Returning 500 makes Stripe retry later, so a hiccup never loses an order.
          console.error('story provisioning failed', session.id, err);
          return new NextResponse('Provisioning failed', { status: 500 });
        }
      } else {
        await fulfil(session, event.id);
      }
    }
  }

  // Bank-debit style payments can fail after checkout. Cards, Apple Pay, Google Pay,
  // Afterpay and Klarna are confirmed instantly and never land here.
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Your party order payment didn't go through",
        idempotencyKey: `failed-${event.id}`,
        html: `<p>Your bank declined the payment, so the order hasn't been sent. You can order again at <a href="${siteUrl()}/cart">${siteUrl()}</a>.</p>`,
      });
    }
    if (process.env.SHOP_OWNER_EMAIL) {
      await sendEmail({
        to: process.env.SHOP_OWNER_EMAIL,
        subject: `Payment failed — do not ship (${session.id})`,
        idempotencyKey: `failed-owner-${event.id}`,
        html: `<p>The payment for ${escapeHtml(email ?? 'unknown')} failed after checkout. Don't pack this order.</p>`,
      });
    }
  }
  return NextResponse.json({ received: true });
}

const APP_KINDS = ['story', 'photos', 'slideshow'];
function isOurs(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  return APP_KINDS.includes(m.kind ?? '') || Boolean(m.cart);
}

async function fulfil(session: Stripe.Checkout.Session, eventId: string) {
  const lines = decodeCart(session.metadata?.cart);
  const email = session.customer_details?.email;
  const field = (key: string) => session.custom_fields?.find((f) => f.key === key)?.text?.value ?? '';
  const partyDate = field('partydate');
  const childName = field('childname');
  // Newer Stripe API versions moved shipping details; support both.
  const s = session as unknown as {
    collected_information?: { shipping_details?: Stripe.Checkout.Session.CollectedInformation.ShippingDetails | null };
    shipping_details?: { name?: string; address?: Stripe.Address };
  };
  const ship = s.collected_information?.shipping_details ?? s.shipping_details;
  const addr = ship?.address;
  const address = addr ? [addr.line1, addr.line2, addr.city, addr.postal_code].filter(Boolean).join(', ') : '';

  const itemsHtml = lines
    .map((l) => `<li>${l.qty} × ${escapeHtml(l.product.name)} · ${escapeHtml(l.themeName)}${l.guests ? ` · ${l.guests} guests` : ''}</li>`)
    .join('');
  const downloads = downloadsFor(lines);
  const downloadsHtml = downloads.length
    ? `<p>Your printables:</p><ul>${downloads
        .map((d) => `<li><a href="${siteUrl()}/api/download/${session.id}/${d.fileId}">${escapeHtml(d.label)}</a></li>`)
        .join('')}</ul>`
    : '';

  if (email) {
    await sendEmail({
      to: email,
      subject: 'Your party order is confirmed',
      idempotencyKey: `customer-${eventId}`,
      html: `<p>Thanks for your order!</p><ul>${itemsHtml}</ul>${downloadsHtml}${
        address ? `<p>Your box is heading to ${escapeHtml(address)}.</p>` : ''
      }<p>Total paid: ${money(session.amount_total ?? 0)}</p>`,
    });
  }

  if (process.env.SHOP_OWNER_EMAIL) {
    await sendEmail({
      to: process.env.SHOP_OWNER_EMAIL,
      subject: `New order ${money(session.amount_total ?? 0)} — party ${partyDate || 'date not given'}`,
      idempotencyKey: `owner-${eventId}`,
      html: `<p>Subtotal ${money(session.amount_subtotal ?? 0)} · shipping ${money(session.shipping_cost?.amount_total ?? 0)}${
        session.total_details?.amount_discount ? ` · discount −${money(session.total_details.amount_discount)}` : ''
      } · <b>paid ${money(session.amount_total ?? 0)}</b></p><p><b>${escapeHtml(ship?.name ?? session.customer_details?.name ?? '')}</b> · ${escapeHtml(email ?? '')} · ${escapeHtml(
        session.customer_details?.phone ?? ''
      )}</p><p>Party date: ${escapeHtml(partyDate)}<br>Child's name: ${escapeHtml(childName)}<br>Ship to: ${escapeHtml(
        address || '(digital only)'
      )}</p><ul>${itemsHtml}</ul><p>Stripe session: ${session.id}</p>`,
    });
  }
}
