// ─────────────────────────────────────────────────────────────
// TV SLIDESHOW — the cheap, set-it-up-ahead product.
// Buyer picks a web address and a title, pays, then uploads their
// own photos and videos. The address plays them on a TV. That's it:
// no guests, no host tools. (Safe to import in the browser.)
// ─────────────────────────────────────────────────────────────
export const SLIDESHOW_PRODUCT = {
  id: 'tv-slideshow',
  name: 'TV Slideshow',
  price: 1900, // cents — PLACEHOLDER
  blurb: 'Upload your photos and videos before the party and get your own web address that plays them on any TV. Perfect for birthdays, anniversaries and farewells.',
  monthsLive: 2,                    // then the files are deleted
  maxItems: 150,
  maxVideoBytes: 250 * 1024 * 1024, // per video
  maxImageBytes: 8 * 1024 * 1024,   // per photo, after the browser shrinks it
  maxTotalBytes: 2 * 1024 * 1024 * 1024,
  maxVideoSeconds: 180,
  imageSeconds: 7,
};

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export function cleanTitle(raw: unknown): string | null {
  const t = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (t.length < 2 || t.length > 50) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N} '’&.,!?#:()-]*$/u.test(t)) return null;
  return t;
}

export const toSlug = (s: string) =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
