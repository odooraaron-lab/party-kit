import { NextResponse } from 'next/server';
import { stripe, siteUrl } from '@/lib/stripe';
import { STORY_PRODUCT, cleanName, getTheme } from '@/lib/story';
import { STRIPE_OPTIONS as O } from '@/lib/stripe-options';

// POST { name, age, email, style } → Stripe Checkout URL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = cleanName(body.name);
    const age = Number(body.age);
    const email = String(body.email ?? '').trim();
    const theme = getTheme(String(body.theme));
    if (!name) throw new Error('Enter a first name using letters only (up to 24).');
    if (!Number.isInteger(age) || age < STORY_PRODUCT.minAge || age > STORY_PRODUCT.maxAge) throw new Error('Choose an age.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw new Error('Enter a valid email address.');
    if (!theme) throw new Error('Choose a theme.');

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'nzd',
          unit_amount: STORY_PRODUCT.price,
          product_data: { name: `${STORY_PRODUCT.name} · ${name}`, description: `${theme.name} theme · turning ${age}` },
        },
      }],
      metadata: { product: 'story', kind: 'story', name, age: String(age), theme: theme.id },
      success_url: `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/tv-story`,
      allow_promotion_codes: O.promotionCodes || undefined,
      customer_creation: O.saveCustomers ? 'always' : 'if_required',
      expires_at: Math.floor(Date.now() / 1000) + Math.min(24 * 60, Math.max(30, O.sessionMinutes)) * 60,
      custom_text: { submit: { message: `${name}'s storybook site goes live as soon as payment is confirmed. Links arrive by email.` } },
      ...(O.taxInvoices ? { invoice_creation: { enabled: true } } : {}),
      ...(O.requireTerms ? { consent_collection: { terms_of_service: 'required' as const } } : {}),
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('story checkout error', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Checkout failed' }, { status: 400 });
  }
}
