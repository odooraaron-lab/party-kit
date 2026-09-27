import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe, siteUrl } from '@/lib/stripe';
import { priceCart, subtotalOf, hasPhysical, encodeCart } from '@/lib/cart';
import { quoteShipping, isZone, ZONES, DELIVERY_DAYS } from '@/lib/shipping';
import { STRIPE_OPTIONS as O } from '@/lib/stripe-options';

// POST { items: CartItem[], zone: 'akl'|'ni'|'si', rural: boolean }
// Re-prices everything from the catalogue, then opens a Stripe Checkout page.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lines = priceCart(body.items);
    const physical = hasPhysical(lines);
    const subtotal = subtotalOf(lines);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency: 'nzd',
        unit_amount: l.unit,
        product_data: {
          name: `${l.product.name} · ${l.themeName}`,
          description: l.product.kind === 'pack' ? `Sized for ${l.guests} guests` : 'Digital — emailed after payment',
        },
      },
    }));

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      success_url: `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/cart`,
      metadata: { cart: encodeCart(lines) },
      custom_fields: [
        { key: 'partydate', label: { type: 'custom', custom: 'Party date (DD/MM/YYYY)' }, type: 'text' },
        { key: 'childname', label: { type: 'custom', custom: "Birthday child's name (for printables)" }, type: 'text', optional: true },
      ],
      // Payment methods come from Dashboard → Settings → Payment methods (no payment_method_types here on purpose).
      allow_promotion_codes: O.promotionCodes || undefined,
      customer_creation: O.saveCustomers ? 'always' : 'if_required',
      expires_at: Math.floor(Date.now() / 1000) + Math.min(24 * 60, Math.max(30, O.sessionMinutes)) * 60,
      custom_text: { submit: { message: O.text.submit } },
      ...(O.taxInvoices ? { invoice_creation: { enabled: true } } : {}),
      ...(O.requireTerms ? { consent_collection: { terms_of_service: 'required' as const } } : {}),
    };

    if (physical) {
      if (!isZone(body.zone)) throw new Error('Choose a delivery region');
      const zone = body.zone;
      const rural = Boolean(body.rural);
      const zoneName = ZONES.find((z) => z.id === zone)!.name;
      const option = (express: boolean): Stripe.Checkout.SessionCreateParams.ShippingOption => {
        const days = express ? DELIVERY_DAYS.express : DELIVERY_DAYS.standard;
        return {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: `${express ? 'Express' : 'Standard'} · ${zoneName}${rural ? ' (rural)' : ''}`,
            fixed_amount: { amount: quoteShipping({ subtotal, zone, rural, express }), currency: 'nzd' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: days.min },
              maximum: { unit: 'business_day', value: days.max },
            },
            metadata: { zone, rural: String(rural) },
          },
        };
      };
      params.shipping_address_collection = { allowed_countries: ['NZ'] };
      params.shipping_options = [option(false), option(true)];
      params.phone_number_collection = { enabled: true };
      params.custom_text = { ...params.custom_text, shipping_address: { message: O.text.shipping } };
    }

    const session = await stripe().checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    console.error('checkout error', err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
