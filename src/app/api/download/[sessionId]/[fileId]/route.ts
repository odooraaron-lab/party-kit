import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { stripe } from '@/lib/stripe';
import { decodeCart, downloadsFor } from '@/lib/cart';

const DIR = path.join(process.cwd(), 'private-files', 'printables');
const TYPES: Record<string, string> = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.zip': 'application/zip' };

// GET /api/download/<stripe session id>/<file id>
// Only works for paid orders that include that file.
export async function GET(_req: Request, { params }: { params: Promise<{ sessionId: string; fileId: string }> }) {
  const { sessionId, fileId } = await params;
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !/^[a-z0-9-]+$/.test(fileId)) {
    return new Response('Not found', { status: 404 });
  }

  let session;
  try {
    session = await stripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return new Response('Order not found', { status: 404 });
  }
  if (session.payment_status !== 'paid') return new Response('Order not paid', { status: 403 });

  const allowed = downloadsFor(decodeCart(session.metadata?.cart)).some((d) => d.fileId === fileId);
  if (!allowed) return new Response('This file is not part of your order', { status: 403 });

  const name = (await readdir(DIR)).find((f) => path.parse(f).name === fileId);
  if (!name) return new Response('File missing — please contact us and we will email it', { status: 404 });

  const data = await readFile(path.join(DIR, name));
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': TYPES[path.extname(name).toLowerCase()] ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
