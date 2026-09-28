import { siteUrl } from '@/lib/stripe';
import { BRAND } from '@/lib/brand';
import { findParty } from '@/lib/party';
import { readTvCookie, clearTvCookie, tvUrl } from '@/lib/tv-pairing';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// The short address typed on the TV (<shop>/tv). Shows a code; once the host enters it,
// the TV moves to the party. Plain old JavaScript on purpose: TV browsers are often old.
export async function GET(req: Request) {
  const saved = readTvCookie(req);
  if (saved) {
    const found = await findParty(saved).catch(() => null);
    if (found && !found.expired && !found.disabled) {
      return new Response(null, { status: 302, headers: { Location: tvUrl(found.party), 'Cache-Control': 'no-store' } });
    }
  }
  const shop = esc(siteUrl().replace(/^https?:\/\//, ''));
  const html = `<!doctype html>
<html lang="en-NZ"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Connect this TV - ${esc(BRAND.name)}</title>
<style>
html,body{margin:0;height:100%;background:#2E2140;color:#FFFDF6;font-family:Nunito,'Segoe UI',Verdana,sans-serif}
.box{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:86vw}
h1{font-size:4vw;margin:0 0 3vh}
p{font-size:2.4vw;line-height:1.4;margin:0 0 2vh;opacity:.92}
#code{font-size:12vw;font-weight:800;letter-spacing:1.5vw;margin:3vh 0;color:#F6C445}
.small{font-size:1.8vw;opacity:.7}
</style></head><body>
<div class="box">
  <h1>Connect this TV to your party</h1>
  <p>On your phone, open your <b>host page</b> (or upload page) from your ${esc(BRAND.name)} email and tap <b>Connect a TV</b>. Enter this code:</p>
  <div id="code">&middot;&middot;&middot; &middot;&middot;&middot;</div>
  <p class="small" id="note">This page will change by itself once it's connected. Address: ${shop}/tv</p>
</div>
<script>
(function () {
  var codeEl = document.getElementById('code'), note = document.getElementById('note');
  var device = null, timer = null;
  function req(method, url, done) {
    var x = new XMLHttpRequest();
    x.open(method, url, true);
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      var data = null;
      try { data = JSON.parse(x.responseText); } catch (e) {}
      done(x.status === 200 ? data : null);
    };
    x.send();
  }
  function start() {
    clearInterval(timer);
    req('POST', '/api/tv/pair', function (d) {
      if (!d) { note.textContent = 'Reconnecting...'; setTimeout(start, 5000); return; }
      device = d.device;
      codeEl.textContent = d.code.slice(0, 3) + ' ' + d.code.slice(3);
      timer = setInterval(check, 3000);
    });
  }
  function check() {
    req('GET', '/api/tv/pair?d=' + encodeURIComponent(device), function (d) {
      if (!d) return;
      if (d.status === 'paired') { clearInterval(timer); note.textContent = 'Connected! Starting...'; location.replace(d.url); }
      else if (d.status === 'expired') start();
    });
  }
  start();
})();
</script>
</body></html>`;
  const headers: Record<string, string> = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if (saved) headers['Set-Cookie'] = clearTvCookie();
  return new Response(html, { headers });
}
