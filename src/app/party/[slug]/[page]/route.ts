import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { findParty } from '@/lib/party';
import { themeCss, themeFontsHref } from '@/lib/story';
import { photoThemeCss, photoFontsHref } from '@/lib/photos';

// Serves the storybook app pages for one party. The middleware sends
// ari.yourdomain/ → /party/ari/index, /tv → /party/ari/tv, etc.
const PAGES = new Set(['index', 'tv', 'host', 'card']);
const DIRS = { story: path.join(process.cwd(), 'party-app', 'templates'), photos: path.join(process.cwd(), 'party-app', 'photos'), slideshow: path.join(process.cwd(), 'party-app', 'slideshow') };
const cache = new Map<string, string>();

async function template(product: keyof typeof DIRS, page: string) {
  const key = `${product}/${page}`;
  if (!cache.has(key) || process.env.NODE_ENV !== 'production') {
    cache.set(key, await readFile(path.join(DIRS[product], `${page}.html`), 'utf8'));
  }
  return cache.get(key)!;
}

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
  });

const simplePage = (title: string, text: string) =>
  `<!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#AFCBF2;color:#3B2A4A;font-family:system-ui,sans-serif;text-align:center;padding:24px}h1{font-size:28px;margin:0 0 8px}</style>
</head><body><div><h1>${title}</h1><p>${text}</p></div></body></html>`;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await params;
  if (!PAGES.has(page)) return html(simplePage('Page not found', 'Check the link and try again.'), 404);

  const found = await findParty(slug);
  if (!found) return html(simplePage('Party not found', "We couldn't find this party. Check the link in your email."), 404);
  if (found.expired) {
    return html(simplePage(`${found.party.childName}'s party has finished`, 'This party page is no longer online. Thanks for celebrating!'), 410);
  }

  // The TV slideshow is a single screen: the address itself plays it.
  if (found.party.product === 'slideshow') {
    if (page !== 'index' && page !== 'tv') return html(simplePage('Page not found', 'Check the link and try again.'), 404);
    return html(await template('slideshow', 'tv'));
  }

  if (found.party.product === 'photos') {
    const t = found.photoTheme;
    const out = (await template('photos', page))
      .replace(/<html lang="en">/, `<html lang="en-NZ" data-theme="${t.mode}" data-look="${t.id}">`)
      .replace('</head>', `<link rel="stylesheet" href="${photoFontsHref(t)}">\n<style>${photoThemeCss(t)}</style>\n` +
        (page === 'host' ? `<script>window.PW_THEME=${JSON.stringify({ name: t.name })}</script>\n` : '') + '</head>');
    return html(out);
  }

  const { theme } = found;
  // Host page shows which theme was bought.
  const options = page === 'host' ? `<script>window.PARTY_THEME=${JSON.stringify({ name: theme.name, tagline: theme.tagline })}</script>\n` : '';
  const out = (await template('story', page))
    .replace(/<html lang="en">/, `<html lang="en-NZ" data-theme="${theme.mode}" data-look="${theme.id}">`)
    .replace(/(href|src)="\/(style\.css|shared\.js|sound\.js)"/g, '$1="/party-app/$2"')
    // The theme's animal cast replaces the default artwork right after the shared script loads.
    .replace('<script src="/party-app/shared.js"></script>', (m) => theme.cast === 'farm' ? m : `${m}\n<script src="/party-app/cast-${theme.cast}.js"></script>`)
    .replace('</head>', `<link rel="stylesheet" href="${themeFontsHref(theme)}">\n<style>${themeCss(theme)}</style>\n${options}</head>`);
  return html(out);
}
