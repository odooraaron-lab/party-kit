// Talks to the admin (HQ). Based on Admin-Portal/hq-kit/hq.ts, but this one deployment
// runs three admin products (story, photos, slideshow), so each has its own secret.
// Env: HQ_URL, HQ_SECRET_STORY, HQ_SECRET_PHOTOS, HQ_SECRET_SLIDESHOW
// (copy each secret from Admin → Products → that product).
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Product } from './db';

const PRODUCTS: Product[] = ['story', 'photos', 'slideshow'];
const secretFor = (p: Product) => process.env[`HQ_SECRET_${p.toUpperCase()}`];
const sign = (secret: string, body: string) => createHmac('sha256', secret).update(body).digest('hex');

type HQEvent =
  | { type: 'site.upsert'; slug: string; url?: string; owner_email?: string; owner_name?: string; theme?: string;
      status?: 'live' | 'disabled' | 'expired'; expires_at?: string; storage_bytes?: number; order_id?: string }
  | { type: 'heartbeat'; slug: string }
  | { type: 'event'; name: string; slug?: string; data?: Record<string, unknown> };

/** Report things to the admin. Never throws, so it can't break a checkout or a party page. */
export async function reportToHQ(product: Product, ...events: HQEvent[]) {
  const secret = secretFor(product);
  if (!process.env.HQ_URL || !secret) return;
  const body = JSON.stringify({ ts: Date.now(), events });
  try {
    const res = await fetch(`${process.env.HQ_URL}/api/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-hq-product': product, 'x-hq-signature': sign(secret, body) },
      body,
      cache: 'no-store',
    });
    if (!res.ok) console.error('reportToHQ', res.status, await res.text().catch(() => ''));
  } catch (e) {
    console.error('reportToHQ failed', e);
  }
}

export type HQAction = { product: Product; action: 'disable' | 'enable' | 'extend' | 'resend_email'; slug: string; expires_at?: string };

/** Checks a request really came from the admin, using the secret of the product it names. */
export async function verifyHQRequest(req: Request): Promise<HQAction | null> {
  const raw = await req.text();
  const product = req.headers.get('x-hq-product') as Product | null;
  const secret = product && PRODUCTS.includes(product) ? secretFor(product) : undefined;
  if (!secret) return null;
  const given = Buffer.from(req.headers.get('x-hq-signature') || '', 'hex');
  const expected = Buffer.from(sign(secret, raw), 'hex');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  let body: any;
  try { body = JSON.parse(raw); } catch { return null; }
  if (typeof body.ts !== 'number' || Math.abs(Date.now() - body.ts) > 5 * 60 * 1000) return null;
  if (typeof body.slug !== 'string') return null;
  return { ...body, product };
}

/** <script> tag for the admin's page-view beacon. TV pages also send a check-in every 5 minutes. */
export function beaconTag(product: Product, slug: string, tv: boolean) {
  const hq = process.env.HQ_URL;
  if (!hq) return '';
  return `<script defer src="${hq}/beacon.js" data-product="${product}" data-site="${slug}"${tv ? ' data-heartbeat' : ''}></script>\n`;
}
