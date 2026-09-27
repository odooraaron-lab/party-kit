import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ownedSlideshow, registerUpload, totals } from '@/lib/slideshow';
import { deleteImages, usingBlob } from '@/lib/photos';
import { partyUrl } from '@/lib/urls';
import { SLIDESHOW_PRODUCT as P } from '@/lib/slideshow-config';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// GET ?slug&key — what's uploaded so far
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const f = await ownedSlideshow(q.get('slug'), q.get('key'));
  if (!f) return bad('This upload link is not valid, or the slideshow has ended.', 403);
  const t = await totals(f.party.slug);
  return NextResponse.json({
    title: f.party.childName, tvUrl: partyUrl(f.party.slug), mode: usingBlob() ? 'blob' : 'local',
    items: t.items.map(({ id, thumbUrl, kind, bytes }) => ({ id, thumbUrl: absolute(thumbUrl, f.party.slug), kind: kind ?? 'image', bytes })),
    bytes: t.bytes, limits: { maxItems: P.maxItems, maxTotalBytes: P.maxTotalBytes, maxVideoBytes: P.maxVideoBytes, maxVideoSeconds: P.maxVideoSeconds },
    expiresAt: f.party.expiresAt,
  }, { headers: { 'Cache-Control': 'no-store' } });
}

// POST { slug, key, url, thumbUrl, kind } — record a finished upload
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const f = await ownedSlideshow(b.slug, b.key);
  if (!f) return bad('This upload link is not valid.', 403);
  try {
    const item = await registerUpload(f, b);
    return NextResponse.json({ id: item.id, thumbUrl: item.thumbUrl, kind: item.kind, bytes: item.bytes }, { status: 201 });
  } catch (e) { return bad(e instanceof Error ? e.message : 'Upload failed'); }
}

// DELETE { slug, key, id } — take something out again
export async function DELETE(req: Request) {
  const b = await req.json().catch(() => ({}));
  const f = await ownedSlideshow(b.slug, b.key);
  if (!f) return bad('This upload link is not valid.', 403);
  const gone = await db().removePhoto(f.party.slug, String(b.id ?? ''));
  if (gone) await deleteImages([gone.url, gone.thumbUrl], f.party.slug).catch(() => {});
  return NextResponse.json({ ok: true });
}

// Local testing stores files under the party's subdomain; show them via that address.
function absolute(u: string, slug: string) {
  return u.startsWith('http') ? u : partyUrl(slug) + u;
}
