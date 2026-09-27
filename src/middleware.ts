import { NextResponse, type NextRequest } from 'next/server';

// ari.yourdomain/…  →  the storybook app for the party "ari"
//   /            → /party/ari/index   (guests write a note)
//   /tv          → /party/ari/tv
//   /host        → /party/ari/host
//   /card        → /party/ari/card    (printable QR cards)
//   /guide       → /p/ari/guide       (setup guide)
//   /api/…       → /party/ari/api/…
// Works locally too: ari.localhost:3000
const PAGES: Record<string, string> = { '/': 'index', '/tv': 'tv', '/host': 'host', '/card': 'card' };

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0].toLowerCase();
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? '').toLowerCase();

  let sub: string | null = null;
  if (root && host.endsWith(`.${root}`)) sub = host.slice(0, -(root.length + 1));
  else if (host.endsWith('.localhost')) sub = host.slice(0, -'.localhost'.length);

  const { pathname } = req.nextUrl;
  if (!sub || sub === 'www' || sub.includes('.')) {
    // Main site: the internal party routes are only reachable through a subdomain.
    if (pathname.startsWith('/party/') || pathname.startsWith('/p/')) return new NextResponse('Not found', { status: 404 });
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (PAGES[clean]) url.pathname = `/party/${sub}/${PAGES[clean]}`;
  else if (clean === '/guide') url.pathname = `/p/${sub}/guide`;
  else if (clean.startsWith('/api/')) url.pathname = `/party/${sub}${clean}`;
  else if (clean.startsWith('/party-app/') || clean.startsWith('/photo-app/')) return NextResponse.next(); // shared scripts, styles, sounds
  else return new NextResponse('Not found', { status: 404 });
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|robots.txt).*)'],
};
