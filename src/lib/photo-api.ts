import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { downloadZip } from 'client-zip';
import { db, settingsFor, type Settings } from './db';
import { findParty, type LoadedParty } from './party';
import { partyUrl } from './urls';
import { PHOTO_PRODUCT, PHOTO_TEXT_LIMITS, sniffImage, storeImage, deleteImages, readLocalImage } from './photos';

// The photo wall's API, one party at a time (same URL shapes as the storybook app).
//   GET  /api/settings   GET /api/state   GET /api/qr.svg   GET /api/guest-url
//   POST /api/photos     (guests; multipart: full, thumb, from)
//   GET  /api/host-check   PUT /api/settings   DELETE /api/photos/:id   GET /api/download   (host)

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
const err = (error: string, status: number) => json({ error }, status);

export function isHost(req: Request, f: LoadedParty) {
  const given = req.headers.get('x-host-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  const a = Buffer.from(given.trim().toLowerCase());
  const b = Buffer.from(f.party.hostKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// What the pages need to know. Guests never see the host key or the buyer's email.
function publicSettings(f: LoadedParty) {
  const s = settingsFor(f.party);
  return { name: f.party.childName, theme: f.photoTheme.id, text: s.text, gallery: s.gallery, uploads: s.uploads };
}

// 40 photos per phone per 10 minutes (per server instance) — enough for a keen guest, stops floods.
const recent = new Map<string, number[]>();
function rateLimited(key: string, max = 40) {
  const now = Date.now();
  const list = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (list.length >= max) { recent.set(key, list); return true; }
  list.push(now); recent.set(key, list);
  if (recent.size > 5000) recent.clear();
  return false;
}

export async function photoGet(req: Request, f: LoadedParty, route: string) {
  switch (route) {
    case 'guest-url': return json({ url: partyUrl(f.party.slug) + '/' });
    case 'settings': return json(publicSettings(f));
    case 'state': return json({ settings: publicSettings(f), photos: await db().listPhotos(f.party.slug) });
    case 'host-check':
      if (!isHost(req, f)) return err("That host key isn't right.", 401);
      return json({ ok: true });
    case 'qr.svg': {
      const svg = await QRCode.toString(partyUrl(f.party.slug) + '/', { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111111', light: '#FFFFFF' } });
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } });
    }
    case 'download': {
      if (!isHost(req, f)) return err("That host key isn't right.", 401);
      return downloadAll(req, f);
    }
  }
  const file = route.match(/^file\/([\w.-]+)$/);
  if (file) {
    const data = await readLocalImage(f.party.slug, file[1]);
    if (!data) return err('Not found', 404);
    const type = file[1].endsWith('.png') ? 'image/png' : file[1].endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    return new Response(new Uint8Array(data), { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' } });
  }
  return err('Not found', 404);
}

export async function photoPost(req: Request, f: LoadedParty, route: string) {
  if (route !== 'photos') return err('Not found', 404);
  const s = settingsFor(f.party);
  if (s.uploads === 'closed' && !isHost(req, f)) return err('The host has closed uploads for this album.', 403);

  const size = Number(req.headers.get('content-length') ?? 0);
  if (size > PHOTO_PRODUCT.maxBytes + 50_000) return err('That photo is too big. Try again, or pick a different one.', 413);
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(`${f.party.slug}:${ip}`)) return err("That's a lot of photos from one phone. Wait a few minutes and try again.", 429);
  if ((await db().countPhotos(f.party.slug)) >= PHOTO_PRODUCT.maxPhotos) return err('This album is full.', 409);

  const form = await req.formData().catch(() => null);
  const full = form?.get('full');
  const thumb = form?.get('thumb');
  if (!(full instanceof Blob)) return err("That photo didn't come through. Try again.", 400);
  const fullBytes = new Uint8Array(await full.arrayBuffer());
  const thumbBytes = thumb instanceof Blob ? new Uint8Array(await thumb.arrayBuffer()) : fullBytes;
  const fullType = sniffImage(fullBytes);
  const thumbType = sniffImage(thumbBytes);
  if (!fullType || !thumbType) return err("That file isn't a photo we can show. Try a JPEG or PNG.", 415);
  if (fullBytes.length + (thumbBytes === fullBytes ? 0 : thumbBytes.length) > PHOTO_PRODUCT.maxBytes) return err('That photo is too big.', 413);

  const id = crypto.randomUUID();
  const url = await storeImage(f.party.slug, id, fullBytes, fullType);
  const thumbUrl = thumbBytes === fullBytes ? url : await storeImage(f.party.slug, `${id}-thumb`, thumbBytes, thumbType);
  const from = String(form?.get('from') ?? '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 50);
  const photo = { id, url, thumbUrl, from, bytes: fullBytes.length, createdAt: Date.now() };
  await db().addPhoto(f.party.slug, photo);
  return json(photo, 201);
}

export async function photoPut(req: Request, f: LoadedParty, route: string) {
  if (route !== 'settings') return err('Not found', 404);
  if (!isHost(req, f)) return err("That host key isn't right.", 401);
  const b = await req.json().catch(() => ({}));
  const u: Partial<Settings> = {};
  if ('gallery' in b) u.gallery = b.gallery === 'off' ? 'off' : 'on';
  if ('uploads' in b) u.uploads = b.uploads === 'closed' ? 'closed' : 'open';
  if ('text' in b) {
    const text: Record<string, string> = {};
    const given = b.text && typeof b.text === 'object' ? b.text : {};
    for (const [k, v] of Object.entries(given)) {
      if (PHOTO_TEXT_LIMITS[k] && typeof v === 'string') {
        const clean = v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, PHOTO_TEXT_LIMITS[k]);
        if (clean) text[k] = clean;
      }
    }
    u.text = text;
  }
  if (Object.keys(u).length) await db().updateSettings(f.party.slug, u);
  return json(publicSettings((await findParty(f.party.slug))!));
}

export async function photoDelete(req: Request, f: LoadedParty, route: string) {
  const m = route.match(/^photos\/([\w-]+)$/);
  if (!m) return err('Not found', 404);
  if (!isHost(req, f)) return err("That host key isn't right.", 401);
  const gone = await db().removePhoto(f.party.slug, m[1]);
  if (gone) await deleteImages([gone.url, gone.thumbUrl], f.party.slug).catch((e) => console.error('blob delete failed', e));
  return json({ ok: true });
}

// Every photo in one zip, streamed so it works for big albums.
async function downloadAll(_req: Request, f: LoadedParty) {
  const photos = await db().listPhotos(f.party.slug);
  const safe = (s: string) => s.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
  async function* files() {
    let n = 0;
    for (const p of photos) {
      n++;
      const ext = (p.url.match(/\.(jpg|png|webp)/) ?? [, 'jpg'])[1];
      const name = `${String(n).padStart(4, '0')}${p.from ? '-' + safe(p.from) : ''}.${ext}`;
      if (p.url.startsWith('http')) {
        const res = await fetch(p.url).catch(() => null);
        if (res && res.ok) yield { name, lastModified: new Date(p.createdAt), input: res };
      } else {
        const data = await readLocalImage(f.party.slug, p.url.split('/').pop() ?? '');
        if (data) yield { name, lastModified: new Date(p.createdAt), input: data };
      }
    }
  }
  const zipName = `${safe(f.party.childName) || 'party'}-photos.zip`;
  const zip = downloadZip(files());
  return new Response(zip.body, {
    headers: { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="${zipName}"`, 'Cache-Control': 'no-store' },
  });
}
