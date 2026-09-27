import { db } from '@/lib/db';
import { checkSig } from '@/lib/guard';
import { productName } from '@/lib/listings';

// One-click approve/reject from the email we send you. The link is signed, so only you can use it.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const id = q.get('id') ?? '', action = q.get('action') ?? '', sig = q.get('sig') ?? '';
  const page = (msg: string, status = 200) => new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;padding:40px;color:#2E2140"><h1 style="font-size:24px">${msg}</h1></body>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
  if (!['approve', 'reject'].includes(action) || !checkSig(sig, id, action)) return page('That link isn’t valid.', 403);
  const r = await db().setReviewStatus(id, action === 'approve' ? 'approved' : 'rejected');
  if (!r) return page('Review not found.', 404);
  return page(action === 'approve' ? `Published: ${r.name}’s review of ${productName(r.product)}.` : `Rejected: ${r.name}’s review.`);
}
