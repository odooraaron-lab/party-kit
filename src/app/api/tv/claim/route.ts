import { findParty } from '@/lib/party';
import { claimPairing, isHostKey } from '@/lib/tv-pairing';

export const runtime = 'nodejs';

/** The host enters the code shown on the TV. Body: { slug, key, code } (key = host key). */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const found = await findParty(String(b.slug ?? ''));
  if (!found || !isHostKey(found.party, String(b.key ?? ''))) return Response.json({ error: 'Open this from your host link first.' }, { status: 403 });
  if (found.expired || found.disabled) return Response.json({ error: 'This party is no longer live.' }, { status: 410 });
  if (!(await claimPairing(String(b.code ?? ''), found.party.slug))) {
    return Response.json({ error: 'That code didn’t work. Check the numbers on the TV, or refresh the TV page for a new code.' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
