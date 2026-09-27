import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteImages, deleteLocalFolder } from '@/lib/photos';

// Runs daily (see vercel.json). Deletes the photos of albums that have expired,
// so storage costs don't grow forever. Vercel sends CRON_SECRET as a bearer token.
export async function GET(req: Request) {
  if (process.env.CRON_SECRET && req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const parties = await db().expiredParties(25);
  let photos = 0;
  for (const p of parties) {
    if (p.product === 'photos' || p.product === 'slideshow') {
      const list = await db().listPhotos(p.slug);
      const urls = list.flatMap((x) => [x.url, x.thumbUrl]);
      for (let i = 0; i < urls.length; i += 500) await deleteImages(urls.slice(i, i + 500));
      for (const x of list) await db().removePhoto(p.slug, x.id);
      await deleteLocalFolder(p.slug);
      photos += list.length;
    }
    await db().markCleaned(p.slug);
  }
  return NextResponse.json({ cleaned: parties.length, photos });
}
