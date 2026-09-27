import { verifyHQRequest } from '@/lib/hq';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { sendWelcomeEmail, reportSite } from '@/lib/provision';

export const runtime = 'nodejs';

// Buttons on the admin's Sites and Orders pages land here: turn a site off/on,
// change its expiry, or resend the welcome email.
export async function POST(req: Request) {
  const msg = await verifyHQRequest(req);
  if (!msg) return new Response('Unauthorized', { status: 401 });

  const party = await db().bySlug(msg.slug);
  if (!party || party.product !== msg.product) return new Response('No such site', { status: 404 });

  switch (msg.action) {
    case 'disable':
    case 'enable':
      party.disabled = msg.action === 'disable';
      await db().setDisabled(party.slug, party.disabled);
      break;
    case 'extend': {
      const when = new Date(msg.expires_at ?? '');
      if (isNaN(when.getTime())) return new Response('Bad expires_at', { status: 400 });
      party.expiresAt = when.toISOString();
      await db().setExpiry(party.slug, party.expiresAt);
      break;
    }
    case 'resend_email': {
      const paid = await (async () => (await stripe().checkout.sessions.retrieve(party.sessionId)).amount_total ?? 0)()
        .catch(() => 0);
      await sendWelcomeEmail(party, paid, true);
      break;
    }
    default:
      return new Response('Unknown action', { status: 400 });
  }
  await reportSite(party);
  return Response.json({ ok: true, slug: party.slug });
}
