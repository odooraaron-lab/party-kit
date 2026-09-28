import Stripe from 'stripe';

let client: Stripe | null = null;

// Server-only. Created lazily so builds work without keys.
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

// The shop's own address, used for Stripe's return links and emails. Forgiving on purpose:
// a blank value falls back to Vercel's address, and a missing https:// is added.
export const siteUrl = () => {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
    || 'http://localhost:3000';
  return (/^https?:\/\//.test(raw) ? raw : `https://${raw}`).replace(/\/+$/, '');
};
