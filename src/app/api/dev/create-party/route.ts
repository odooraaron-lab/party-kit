import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { provisionStory, hostLink, uploadLink } from '@/lib/provision';
import { partyUrl } from '@/lib/urls';

// DEVELOPMENT ONLY: creates a story without paying, to test the pages.
// GET /api/dev/create-party?name=Poppy&age=1&style=bush
// Disabled automatically in production.
export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_ROUTES !== 'true') {
    return new NextResponse('Not found', { status: 404 });
  }
  const q = new URL(req.url).searchParams;
  const fake = {
    id: `cs_dev_${Date.now()}`,
    payment_status: 'paid',
    amount_total: 0,
    customer_details: { email: q.get('email') ?? 'test@example.com' },
    metadata: q.get('product') === 'slideshow'
      ? { kind: 'slideshow', name: q.get('name') ?? 'Happy 50th Dad', slug: q.get('slug') ?? '' }
      : q.get('product') === 'photos'
      ? { kind: 'photos', name: q.get('name') ?? "Sam's 40th", slug: q.get('slug') ?? '', theme: q.get('theme') ?? 'champagne' }
      : { kind: 'story', name: q.get('name') ?? 'Poppy', age: q.get('age') ?? '1', theme: q.get('theme') ?? 'farm' },
  } as unknown as Stripe.Checkout.Session;
  const party = await provisionStory(fake);
  return NextResponse.json({ party, upload: party.product === 'slideshow' ? uploadLink(party) : undefined, guest: partyUrl(party.slug), tv: partyUrl(party.slug, '/tv'), host: hostLink(party), card: partyUrl(party.slug, '/card'), guide: partyUrl(party.slug, '/guide') });
}
