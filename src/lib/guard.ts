import crypto from 'node:crypto';

// Small shared protections for public forms.

// N requests per IP per window (per server instance — enough to stop floods).
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, bucket: string, max: number, windowMs = 60 * 60 * 1000) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const limited = list.length >= max;
  if (!limited) list.push(now);
  hits.set(key, list);
  if (hits.size > 10000) hits.clear();
  return limited;
}

export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;
export const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max);

// Signed links for the owner's one-click actions (approve a review) — no admin screen needed.
const secret = () => process.env.ADMIN_SECRET || (process.env.VERCEL ? '' : 'local-dev-secret');
export function sign(...parts: string[]) {
  if (!secret()) throw new Error('ADMIN_SECRET is not set');
  return crypto.createHmac('sha256', secret()).update(parts.join('|')).digest('hex').slice(0, 32);
}
export function checkSig(sig: string, ...parts: string[]) {
  try {
    const a = Buffer.from(sign(...parts)), b = Buffer.from(String(sig));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch { return false; }
}
