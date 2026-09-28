import crypto from 'node:crypto';
import { head } from '@vercel/blob';
import { db, type Photo } from './db';
import { findParty, type LoadedParty } from './party';
import { SLIDESHOW_PRODUCT as P, IMAGE_TYPES, VIDEO_TYPES } from './slideshow-config';
import { usingBlob, deleteImages, readLocalImage } from './photos';

// Server side of the TV Slideshow: who may upload, what's allowed, and the TV's data.

export async function ownedSlideshow(slug: unknown, key: unknown): Promise<LoadedParty | null> {
  const f = await findParty(String(slug ?? ''));
  if (!f || f.party.product !== 'slideshow' || f.expired || f.disabled) return null;
  const a = Buffer.from(String(key ?? '').trim().toLowerCase());
  const b = Buffer.from(f.party.hostKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? f : null;
}

export async function totals(slug: string) {
  const items = await db().listPhotos(slug);
  return { items, count: items.length, bytes: items.reduce((a, x) => a + x.bytes, 0) };
}

// Checks a file the browser says it uploaded really is ours, then records it.
export async function registerUpload(f: LoadedParty, input: { url: string; thumbUrl: string; kind: string }) {
  const slug = f.party.slug;
  const kind = input.kind === 'video' ? 'video' : 'image';
  const isOurs = (u: string) => {
    try {
      const x = new URL(u);
      return x.protocol === 'https:' && x.hostname.endsWith('.public.blob.vercel-storage.com') && decodeURIComponent(x.pathname).startsWith(`/slideshow/${slug}/`);
    } catch { return false; }
  };
  if (!isOurs(input.url) || !isOurs(input.thumbUrl)) throw new Error('That upload link is not valid.');
  const meta = await head(input.url);
  const allowed = kind === 'video' ? VIDEO_TYPES : IMAGE_TYPES;
  if (!allowed.includes(meta.contentType)) { await deleteImages([input.url, input.thumbUrl]); throw new Error('That file type is not supported.'); }
  const t = await totals(slug);
  if (t.count >= P.maxItems || t.bytes + meta.size > P.maxTotalBytes) {
    await deleteImages([input.url, input.thumbUrl]);
    throw new Error('Your slideshow is full.');
  }
  const item: Photo = { id: crypto.randomUUID(), url: input.url, thumbUrl: input.thumbUrl, from: '', bytes: meta.size, createdAt: Date.now(), kind };
  await db().addPhoto(slug, item);
  return item;
}

// What the TV needs. The upload key and email never leave the server.
export async function slideshowGet(_req: Request, f: LoadedParty, route: string) {
  const json = (d: unknown, status = 200) => Response.json(d, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  if (route === 'state') {
    const items = await db().listPhotos(f.party.slug);
    return json({ title: f.party.childName, imageSeconds: P.imageSeconds, items: items.map(({ id, url, kind }) => ({ id, url, kind: kind ?? 'image' })) });
  }
  const file = route.match(/^file\/([\w.-]+)$/);
  if (file && !usingBlob()) {
    const data = await readLocalImage(f.party.slug, file[1]);
    if (!data) return json({ error: 'Not found' }, 404);
    const ext = file[1].split('.').pop()!;
    const type = ({ jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm' } as Record<string, string>)[ext];
    return new Response(new Uint8Array(data), { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' } });
  }
  return json({ error: 'Not found' }, 404);
}
