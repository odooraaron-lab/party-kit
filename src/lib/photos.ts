import { promises as fs } from 'node:fs';
import path from 'node:path';
import { put, del } from '@vercel/blob';

// Server-only: storage for photo wall images. Everything safe for the browser
// (prices, looks, name rules) lives in photo-config.ts and is re-exported here.
export * from './photo-config';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as const;

// ── Storage: Vercel Blob in production, a local folder when testing ──
const LOCAL_DIR = path.join(process.cwd(), '.data', 'uploads');
export const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function storeImage(slug: string, name: string, data: Uint8Array, type: keyof typeof EXT): Promise<string> {
  const file = `${name}.${EXT[type]}`;
  if (usingBlob()) {
    // Public but unguessable: Blob adds a random suffix to every file name.
    const blob = await put(`photos/${slug}/${file}`, Buffer.from(data), { access: 'public', contentType: type, addRandomSuffix: true });
    return blob.url;
  }
  await fs.mkdir(path.join(LOCAL_DIR, slug), { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, slug, file), data);
  return `/api/file/${file}`; // served per party by the photo API (local testing only)
}

export async function deleteImages(urls: string[], slug?: string) {
  const blobs = urls.filter((u) => u.startsWith('http'));
  if (blobs.length && usingBlob()) await del(blobs);
  if (slug) {
    for (const u of urls.filter((x) => x.startsWith('/api/file/'))) {
      const file = u.split('/').pop() ?? '';
      if (/^[\w-]+\.(jpg|png|webp|mp4|mov|webm)$/.test(file)) await fs.rm(path.join(LOCAL_DIR, slug, file), { force: true }).catch(() => {});
    }
  }
}

// Any file type (the slideshow also stores videos). Local testing only.
export async function storeLocalFile(slug: string, file: string, data: Uint8Array): Promise<string> {
  await fs.mkdir(path.join(LOCAL_DIR, slug), { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, slug, file), data);
  return `/api/file/${file}`;
}

export async function readLocalImage(slug: string, file: string): Promise<Uint8Array | null> {
  if (!/^[\w-]+\.(jpg|png|webp|mp4|mov|webm)$/.test(file)) return null;
  return fs.readFile(path.join(LOCAL_DIR, slug, file)).catch(() => null);
}

export async function deleteLocalFolder(slug: string) {
  await fs.rm(path.join(LOCAL_DIR, slug), { recursive: true, force: true }).catch(() => {});
}

