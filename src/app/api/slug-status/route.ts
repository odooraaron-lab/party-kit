import { db } from '@/lib/db';
import { baseSlug, isValidSlug } from '@/lib/slug';

export const dynamic = 'force-dynamic';

/** For QR Buddy's name check: is <s>.myqr.co.nz already a party (or reserved)? Answers only yes or no. */
export async function GET(req: Request) {
  const s = (new URL(req.url).searchParams.get('s') ?? '').toLowerCase();
  if (!isValidSlug(s)) return Response.json({ taken: true });
  const reserved = baseSlug(s) !== s;
  const taken = reserved || !!(await db().bySlug(s));
  return Response.json({ taken }, { headers: { 'cache-control': 'no-store' } });
}
