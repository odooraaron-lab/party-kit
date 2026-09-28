import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { db, settingsFor, type Settings } from '@/lib/db';
import { findParty, type LoadedParty } from '@/lib/party';
import { partyUrl } from '@/lib/urls';
import { STORY_PRODUCT, ORDINALS, TEXT_LIMITS, KIND_IDS } from '@/lib/story';
import { escapeHtml } from '@/lib/email';
import { photoGet, photoPost, photoPut, photoDelete } from '@/lib/photo-api';
import { slideshowGet } from '@/lib/slideshow';
import { renderStorybookPdf } from '@/lib/storybook-pdf';

// The storybook app's API, one party at a time. The middleware sends
// ari.yourdomain/api/state → /party/ari/api/state.
// Same endpoints as the original Notes app, so its pages work unchanged.

type Ctx = { params: Promise<{ slug: string; path: string[] }> };
const KINDS = ['wish', 'advice', 'guess', 'today'];

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
const err = (error: string, status: number) => json({ error }, status);

async function load(ctx: Ctx) {
  const { slug, path } = await ctx.params;
  const found = await findParty(slug);
  return { found, route: path.join('/') };
}

function isHost(req: Request, found: LoadedParty) {
  const given = req.headers.get('x-host-key') ?? new URL(req.url).searchParams.get('key') ?? '';
  const a = Buffer.from(given.trim().toLowerCase());
  const b = Buffer.from(found.party.hostKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// 6 notes per phone per 10 minutes (per server instance — plenty for a party)
const recent = new Map<string, number[]>();
function rateLimited(key: string) {
  const now = Date.now();
  const list = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (list.length >= 6) { recent.set(key, list); return true; }
  list.push(now); recent.set(key, list);
  if (recent.size > 5000) recent.clear();
  return false;
}

function gone(found: LoadedParty | null) {
  if (!found) return err('This party page does not exist.', 404);
  if (found.expired) return err('This party has finished.', 410);
  if (found.disabled) return err('This party is paused.', 403);
  return null;
}

export async function GET(req: Request, ctx: Ctx) {
  const { found, route } = await load(ctx);
  const stop = gone(found); if (stop) return stop;
  const f = found!;
  if (f.party.product === 'photos') return photoGet(req, f, route);
  if (f.party.product === 'slideshow') return slideshowGet(req, f, route);

  switch (route) {
    case 'guest-url':
      return json({ url: partyUrl(f.party.slug) + '/' });
    case 'settings':
      return json(settingsFor(f.party));
    case 'state':
      return json({ settings: settingsFor(f.party), notes: await db().listNotes(f.party.slug) });
    case 'host-check':
      if (!isHost(req, f)) return err("That host key isn't right.", 401);
      return json({ ok: true, storage: 'postgres' });
    case 'qr.svg': {
      const svg = await QRCode.toString(partyUrl(f.party.slug) + '/', {
        type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1F2F5C', light: '#FFFFFF' },
      });
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } });
    }
    case 'keepsake':
      if (!isHost(req, f)) return err("That host key isn't right.", 401);
      return keepsake(f);
    case 'storybook.pdf': {
      // The printable storybook: every message, styled like the TV, as a PDF.
      if (!isHost(req, f)) return err("That host key isn't right.", 401);
      const s = settingsFor(f.party);
      const pdf = await renderStorybookPdf({ theme: f.theme, settings: s, notes: await db().listNotes(f.party.slug), age: f.party.age, createdAt: f.party.createdAt });
      const file = `storybook-for-${(s.name || 'party').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.pdf`;
      return new Response(new Uint8Array(pdf), {
        headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${file}"`, 'Cache-Control': 'no-store' },
      });
    }
  }
  return err('Not found', 404);
}

export async function POST(req: Request, ctx: Ctx) {
  const { found, route } = await load(ctx);
  const stop = gone(found); if (stop) return stop;
  const f = found!;
  if (f.party.product === 'slideshow') return err('Not found', 404);
  if (f.party.product === 'photos') return photoPost(req, f, route);
  if (route !== 'notes') return err('Not found', 404);

  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? '').trim().slice(0, 400);
  const from = String(body.from ?? '').trim().slice(0, 60);
  const kind = KINDS.includes(body.kind) ? body.kind : 'wish';
  if (text.length < 2) return err('Write a little more before sealing your note.', 400);
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(`${f.party.slug}:${ip}`)) return err("That's a lot of notes from one phone. Wait a few minutes and try again.", 429);
  if ((await db().countNotes(f.party.slug)) >= STORY_PRODUCT.maxNotes) return err('This storybook is full.', 409);

  const note = { id: crypto.randomUUID(), text, from, kind, createdAt: Date.now() };
  await db().addNote(f.party.slug, note);
  return json(note, 201);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { found, route } = await load(ctx);
  const stop = gone(found); if (stop) return stop;
  const f = found!;
  if (f.party.product === 'slideshow') return err('Not found', 404);
  if (f.party.product === 'photos') return photoPut(req, f, route);
  if (route !== 'settings') return err('Not found', 404);
  if (!isHost(req, f)) return err("That host key isn't right.", 401);

  const b = await req.json().catch(() => ({}));
  const u: Partial<Settings> = {};
  if ('name' in b) u.name = String(b.name || '').trim().slice(0, 40) || f.party.childName;
  if ('text' in b) {
    // Replaces all custom wording. Unknown keys are ignored; long text is cut to its limit.
    const text: Record<string, string> = {};
    const given = b.text && typeof b.text === 'object' ? b.text : {};
    for (const [k, v] of Object.entries(given)) {
      if (TEXT_LIMITS[k] && typeof v === 'string') {
        const clean = v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, TEXT_LIMITS[k]);
        if (clean) text[k] = clean;
      }
    }
    for (const k of KIND_IDS) if (given[`${k}_off`] === '1') text[`${k}_off`] = '1';
    if (KIND_IDS.every((k) => text[`${k}_off`] === '1')) return err('Keep at least one type of message switched on.', 400);
    u.text = text;
  }
  if ('music' in b) u.music = b.music === 'off' ? 'off' : 'on';
  if ('sfx' in b) u.sfx = b.sfx === 'off' ? 'off' : 'on';
  if ('soundmode' in b) u.soundmode = b.soundmode === 'simple' ? 'simple' : 'auto';
  if ('fxgap' in b) u.fxgap = ['20', '45', '90'].includes(String(b.fxgap)) ? String(b.fxgap) : '45';
  if ('volume' in b) u.volume = String(Math.max(0, Math.min(100, Math.round(Number(b.volume) || 0))));
  if (b.ping) u.ping = String(Date.now()); // "play a test chime on the TV"
  if (Object.keys(u).length) await db().updateSettings(f.party.slug, u);
  const fresh = await findParty(f.party.slug);
  return json(settingsFor(fresh!.party));
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { found, route } = await load(ctx);
  const stop = gone(found); if (stop) return stop;
  const f = found!;
  if (f.party.product === 'slideshow') return err('Not found', 404);
  if (f.party.product === 'photos') return photoDelete(req, f, route);
  const m = route.match(/^notes\/([\w-]+)$/);
  if (!m) return err('Not found', 404);
  if (!isHost(req, f)) return err("That host key isn't right.", 401);
  await db().removeNote(f.party.slug, m[1]);
  return json({ ok: true });
}

// Downloadable storybook of every page, to print or keep.
const DEFAULT_WORDS: Record<string, string> = {
  tvTitle: 'A storybook for {name}', signOff: 'With love from',
  wish_label: 'A birthday wish', advice_label: 'Words of wisdom', guess_label: "I bet this year you'll", today_label: 'A party memory',
};
async function keepsake(f: LoadedParty) {
  const s = settingsFor(f.party);
  const notes = await db().listNotes(f.party.slug);
  const name = s.name || 'the birthday star';
  const birthday = (ORDINALS[f.party.age] ? ORDINALS[f.party.age] + ' ' : '') + 'birthday';
  const word = (k: string) => (s.text[k] || DEFAULT_WORDS[k] || '').replace(/\{name\}/g, name).replace(/\{birthday\}/g, birthday);
  const title = word('tvTitle');
  const dark = f.theme.mode === 'dark';
  const t = f.theme;
  const cards = notes.map((n) => `<article><h3>${escapeHtml(word(`${KIND_IDS.includes(n.kind) ? n.kind : 'wish'}_label`))}</h3><p>${escapeHtml(n.text)}</p><footer>${escapeHtml(word('signOff'))} ${escapeHtml(n.from || 'a guest')}</footer></article>`).join('');
  const day = new Date(f.party.createdAt).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' });
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?${t.google}&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
<style>body{margin:0;background:${f.theme.vars['--sky']};color:${dark ? '#F4EEFF' : '#3B2A4A'};font-family:Nunito,system-ui,sans-serif}main{max-width:52rem;margin:0 auto;padding:3rem 1.5rem}
h1{font-family:"${t.fonts.display}",sans-serif;font-weight:800;font-size:3rem;line-height:1.05;margin:0 0 .5rem}.sub{font-family:"${t.fonts.story}",Georgia,serif;font-size:1.3rem;margin:0 0 2.5rem;opacity:.85}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(20rem,1fr));gap:1.1rem}article{background:#FFFDF6;color:#3B2A4A;border:3px solid #3B2A4A;border-radius:1rem;padding:1.3rem 1.5rem;break-inside:avoid;box-shadow:0 .3rem 0 #3B2A4A}
h3{font-family:"${t.fonts.display}",sans-serif;font-size:1.05rem;margin:0 0 .6rem;color:#A93A57}article p{font-family:"${t.fonts.story}",Georgia,serif;font-size:1.3rem;line-height:1.45;margin:0;white-space:pre-wrap}
footer{font-family:"${t.fonts.story}",Georgia,serif;font-style:italic;text-align:right;margin-top:.9rem;color:#5E4C70}@media print{body{background:#fff;color:#3B2A4A}article{box-shadow:none}}</style></head>
<body><main><h1>${escapeHtml(title)}</h1><p class="sub">Messages from everyone at ${escapeHtml(name)}'s ${birthday} party, ${day}. ${notes.length} ${notes.length === 1 ? 'page' : 'pages'}.</p><div class="grid">${cards}</div></main></body></html>`;
  const file = 'storybook-for-' + (s.name || 'party').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
  return new Response(page, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Disposition': `attachment; filename="${file}"`, 'Cache-Control': 'no-store' },
  });
}
