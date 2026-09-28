import { newPairing, pairingStatus, tvUrl, tvCookie } from '@/lib/tv-pairing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: unknown, extra: Record<string, string> = {}) =>
  Response.json(data, { headers: { 'Cache-Control': 'no-store', ...extra } });

/** The TV asks for a code to show. */
export async function POST() {
  return json(await newPairing());
}

/** The TV checks whether the host has typed its code in yet. */
export async function GET(req: Request) {
  const device = new URL(req.url).searchParams.get('d') || '';
  const s = device ? await pairingStatus(device) : 'expired';
  if (s === 'expired' || s === 'waiting') return json({ status: s });
  return json({ status: 'paired', url: tvUrl(s) }, { 'Set-Cookie': tvCookie(s.slug) });
}
