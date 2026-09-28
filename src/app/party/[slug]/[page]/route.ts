import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { findParty } from '@/lib/party';
import { themeCss, themeFontsHref } from '@/lib/story';
import { photoThemeCss, photoFontsHref } from '@/lib/photos';
import { beaconTag } from '@/lib/hq';
import { siteUrl } from '@/lib/stripe';

// "Connect a TV" box on the host page: the host types the code shown at <shop>/tv.
function connectTv(slug: string, storageKey: string, boxClass: string) {
  const shop = siteUrl().replace(/^https?:\/\//, '');
  return `
<div class="${boxClass}" id="connect-tv">
  <h2>Connect a TV</h2>
  <p class="hint">On the TV's web browser go to <b>${shop}/tv</b>. It shows a 6-digit code; type it here.</p>
  <div style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
    <input class="field" id="tv-code" inputmode="numeric" autocomplete="off" maxlength="7" placeholder="123 456" style="max-width:10rem">
    <button class="btn btn-soft" id="tv-connect" type="button">Connect</button>
  </div>
  <div class="status" id="tv-status" role="status"></div>
</div>
<script>
(function(){
  var btn=document.getElementById('tv-connect'), input=document.getElementById('tv-code'), out=document.getElementById('tv-status');
  function go(){
    var key=''; try{ key=localStorage.getItem(${JSON.stringify(storageKey)})||''; }catch(e){}
    out.textContent='Connecting...';
    fetch('/api/tv/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:${JSON.stringify(slug)},key:key,code:input.value})})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
      .then(function(x){ out.textContent = x.ok ? 'Connected! The TV will switch over in a few seconds.' : (x.j.error||'That didn\u2019t work.'); if(x.ok) input.value=''; })
      .catch(function(){ out.textContent='Couldn\u2019t reach the server. Try again.'; });
  }
  btn.addEventListener('click',go);
  input.addEventListener('keydown',function(e){ if(e.key==='Enter') go(); });
})();
</script>`;
}

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

const respond = (body: string, status = 200) =>
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
  if (!PAGES.has(page)) return respond(simplePage('Page not found', 'Check the link and try again.'), 404);

  const found = await findParty(slug);
  if (!found) return respond(simplePage('Party not found', "We couldn't find this party. Check the link in your email."), 404);
  if (found.expired) {
    return respond(simplePage(`${found.party.childName}'s party has finished`, 'This party page is no longer online. Thanks for celebrating!'), 410);
  }
  if (found.disabled) return respond(simplePage('This page is paused', 'Please get in touch with us if you think this is a mistake.'), 403);
  const html = (body: string, status = 200) => respond(body.replace('</head>', beaconTag(found.party.product, slug, page === 'tv' || found.party.product === 'slideshow') + '</head>'), status);

  // The TV slideshow is a single screen: the address itself plays it.
  if (found.party.product === 'slideshow') {
    if (page !== 'index' && page !== 'tv') return html(simplePage('Page not found', 'Check the link and try again.'), 404);
    return html(await template('slideshow', 'tv'));
  }

  if (found.party.product === 'photos') {
    const t = found.photoTheme;
    let photosHtml = await template('photos', page);
    if (page === 'host') photosHtml = photosHtml.replace('<div id="tools" class="stack hidden">', `<div id="tools" class="stack hidden">${connectTv(slug, 'pw-host', 'card')}`);
    const out = photosHtml
      .replace(/<html lang="en">/, `<html lang="en-NZ" data-theme="${t.mode}" data-look="${t.id}">`)
      .replace('</head>', `<link rel="stylesheet" href="${photoFontsHref(t)}">\n<style>${photoThemeCss(t)}</style>\n` +
        (page === 'host' ? `<script>window.PW_THEME=${JSON.stringify({ name: t.name })}</script>\n` : '') + '</head>');
    return html(out);
  }

  const { theme } = found;
  // Host page shows which theme was bought.
  const options = page === 'host' ? `<script>window.PARTY_THEME=${JSON.stringify({ name: theme.name, tagline: theme.tagline })}</script>\n` : '';
  let storyHtml = await template('story', page);
  if (page === 'host') storyHtml = storyHtml.replace('<div id="tools" class="hidden">', `<div id="tools" class="hidden">${connectTv(slug, 'n18-host', 'section')}`);
  const out = storyHtml
    .replace(/<html lang="en">/, `<html lang="en-NZ" data-theme="${theme.mode}" data-look="${theme.id}">`)
    .replace(/(href|src)="\/(style\.css|shared\.js|sound\.js)"/g, '$1="/party-app/$2"')
    // The theme's animal cast replaces the default artwork right after the shared script loads.
    .replace('<script src="/party-app/shared.js"></script>', (m) => theme.cast === 'farm' ? m : `${m}\n<script src="/party-app/cast-${theme.cast}.js"></script>`)
    .replace('</head>', `<link rel="stylesheet" href="${themeFontsHref(theme)}">\n<style>${themeCss(theme)}</style>\n${options}</head>`);
  return html(out);
}
