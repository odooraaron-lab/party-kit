import { NextResponse } from 'next/server';
import { stripe, siteUrl } from '@/lib/stripe';
import { PHOTO_PRODUCT, cleanEventName, getPhotoTheme } from '@/lib/photos';
import { baseSlug } from '@/lib/slug';
import { STRIPE_OPTIONS as O } from '@/lib/stripe-options';

// POST { name, slug?, email, theme } → Stripe Checkout URL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = cleanEventName(body.name);
    const email = String(body.email ?? '').trim();
    const theme = getPhotoTheme(String(body.theme));
    const slug = body.slug ? baseSlug(String(body.slug)) : '';
    if (!name) throw new Error('Enter an event name (2–40 letters or numbers).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw new Error('Enter a valid email address.');
    if (!theme) throw new Error('Choose a look.');

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'nzd',
          unit_amount: PHOTO_PRODUCT.price,
          product_data: { name: `${PHOTO_PRODUCT.name} · ${name}`, description: `${theme.name} look · online for ${PHOTO_PRODUCT.monthsLive} months` },
        },
      }],
      metadata: { product: 'photos', kind: 'photos', name, slug, theme: theme.id },
      success_url: `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/photo-wall`,
      allow_promotion_codes: O.promotionCodes || undefined,
      customer_creation: O.saveCustomers ? 'always' : 'if_required',
      expires_at: Math.floor(Date.now() / 1000) + Math.min(24 * 60, Math.max(30, O.sessionMinutes)) * 60,
      custom_text: { submit: { message: 'Your photo wall goes live as soon as payment is confirmed. Links arrive by email.' } },
      ...(O.taxInvoices ? { invoice_creation: { enabled: true } } : {}),
      ...(O.requireTerms ? { consent_collection: { terms_of_service: 'required' as const } } : {}),
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('photo checkout error', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Checkout failed' }, { status: 400 });
  }
}
