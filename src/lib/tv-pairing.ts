import crypto from 'node:crypto';
import { db, type Party } from './db';
import { findParty } from './party';
import { partyUrl } from './urls';

// Connecting a TV without typing the party address: the TV opens <shop>/tv and
// shows a 6-digit code; the host types it on their host page (or the slideshow's upload page).
const MINUTES = 15;
export const TV_COOKIE = 'wc_tv';

export async function newPairing() {
  const device = crypto.randomBytes(18).toString('base64url');
  for (let i = 0; i < 20; i++) {
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    if (await db().addPairing(code, device, MINUTES)) return { code, device, expiresInSeconds: MINUTES * 60 };
  }
  throw new Error('No free pairing code');
}

/** Where a party's TV should go: the slideshow plays at the address itself, the others at /tv. */
export const tvUrl = (p: Party) => partyUrl(p.slug, p.product === 'slideshow' ? '' : '/tv');

/** 'waiting' until the host enters the code, then the party the TV belongs to. */
export async function pairingStatus(device: string): Promise<'waiting' | 'expired' | Party> {
  const row = await db().pairingForDevice(device, MINUTES);
  if (!row) return 'expired';
  if (!row.slug) return 'waiting';
  const found = await findParty(row.slug);
  return found && !found.expired && !found.disabled ? found.party : 'expired';
}

export async function claimPairing(code: string, slug: string) {
  const clean = code.replace(/\D/g, '');
  return clean.length === 6 && db().claimPairing(clean, slug, MINUTES);
}

/** True if `key` is this party's host key. */
export function isHostKey(p: Party, key: string) {
  const a = Buffer.from(key.trim().toLowerCase());
  const b = Buffer.from(p.hostKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// The TV remembers its party, so <shop>/tv goes straight back to it (after a power cut, say).
export function tvCookie(slug: string) {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  return [`${TV_COOKIE}=${slug}`, 'Path=/', `Max-Age=${60 * 60 * 24 * 180}`, 'HttpOnly', 'SameSite=Lax',
    ...(process.env.NODE_ENV === 'production' ? ['Secure'] : []), ...(root ? [`Domain=${root}`] : [])].join('; ');
}
export const clearTvCookie = () => `${TV_COOKIE}=; Path=/; Max-Age=0${process.env.NEXT_PUBLIC_ROOT_DOMAIN ? `; Domain=${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : ''}`;
export const readTvCookie = (req: Request) =>
  (req.headers.get('cookie') || '').match(/(?:^|;\s*)wc_tv=([a-z0-9-]+)/)?.[1] ?? null;
