import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { ownedSlideshow, totals } from '@/lib/slideshow';
import { SLIDESHOW_PRODUCT as P, IMAGE_TYPES, VIDEO_TYPES } from '@/lib/slideshow-config';

// Gives the buyer's browser a short-lived permission to upload one file straight
// to storage (videos are too big to pass through our server).
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { slug, key } = JSON.parse(clientPayload ?? '{}');
        const f = await ownedSlideshow(slug, key);
        if (!f) throw new Error('This upload link is not valid.');
        if (!pathname.startsWith(`slideshow/${f.party.slug}/`)) throw new Error('Bad file name.');
        const t = await totals(f.party.slug);
        if (t.count >= P.maxItems || t.bytes >= P.maxTotalBytes) throw new Error('Your slideshow is full.');
        return {
          allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: Math.min(P.maxVideoBytes, P.maxTotalBytes - t.bytes),
          addRandomSuffix: true,
          validUntil: Date.now() + 60 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload refused' }, { status: 400 });
  }
}
