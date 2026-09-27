import Stripe from 'stripe';

let client: Stripe | null = null;

// Server-only. Created lazily so builds work without keys.
export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
