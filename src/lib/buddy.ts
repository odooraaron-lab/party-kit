// QR Buddy (a separate myQR app) also lives on <name>.myqr.co.nz. This site owns the *.myqr.co.nz
// wildcard, so it forwards buddy names to the buddy app and never gives a buddy's name to a party.
// Env: BUDDY_ORIGIN, the buddy app's own address (https://create.myqr.co.nz). Blank = no buddies.
// Safe for the edge (middleware) and Node.

export const BUDDY_ORIGIN = (process.env.BUDDY_ORIGIN ?? '').replace(/\/+$/, '');

// Per-instance cache, so a party's guests don't wait on the buddy app for every request.
const cache = new Map<string, { buddy: boolean; until: number }>();

/** Is <name> a QR Buddy? Unknown (buddy app down or slow) counts as no, so parties keep working. */
export async function isBuddy(name: string): Promise<boolean> {
  if (!BUDDY_ORIGIN || !/^[a-z0-9-]{1,40}$/.test(name)) return false;
  const hit = cache.get(name);
  if (hit && hit.until > Date.now()) return hit.buddy;
  let buddy = false;
  try {
    const r = await fetch(`${BUDDY_ORIGIN}/api/registry/${name}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) buddy = (await r.json()).buddy === true;
  } catch {
    return hit?.buddy ?? false;
  }
  if (cache.size > 5000) cache.clear();
  cache.set(name, { buddy, until: Date.now() + (buddy ? 10 : 1) * 60_000 });
  return buddy;
}
