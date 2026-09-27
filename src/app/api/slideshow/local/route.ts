import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ownedSlideshow, totals } from '@/lib/slideshow';
import { storeLocalFile, usingBlob } from '@/lib/photos';
import { partyUrl } from '@/lib/urls';
import { SLIDESHOW_PRODUCT as P } from '@/lib/slideshow-config';

// LOCAL TESTING ONLY (no Blob storage connected): uploads go through the server into .data/uploads.
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' };

export async function POST(req: Request) {
  if (usingBlob()) return NextResponse.json({ error: 'Not available' }, { status: 404 });
  const form = await req.formData();
  const f = await ownedSlideshow(form.get('slug'), form.get('key'));
  if (!f) return NextResponse.json({ error: 'This upload link is not valid.' }, { status: 403 });
  const file = form.get('file'), thumb = form.get('thumb');
  if (!(file instanceof Blob) || !(thumb instanceof Blob) || !EXT[file.type]) return NextResponse.json({ error: 'That file type is not supported.' }, { status: 415 });
  const t = await totals(f.party.slug);
  if (t.count >= P.maxItems || t.bytes + file.size > P.maxTotalBytes) return NextResponse.json({ error: 'Your slideshow is full.' }, { status: 409 });
  const id = crypto.randomUUID();
  const url = await storeLocalFile(f.party.slug, `${id}.${EXT[file.type]}`, new Uint8Array(await file.arrayBuffer()));
  const thumbUrl = await storeLocalFile(f.party.slug, `${id}-thumb.jpg`, new Uint8Array(await thumb.arrayBuffer()));
  const kind = file.type.startsWith('video/') ? 'video' : 'image';
  await db().addPhoto(f.party.slug, { id, url, thumbUrl, from: '', bytes: file.size, createdAt: Date.now(), kind });
  return NextResponse.json({ id, thumbUrl: partyUrl(f.party.slug) + thumbUrl, kind, bytes: file.size }, { status: 201 });
}
