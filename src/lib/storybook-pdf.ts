import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import * as fontkit from 'fontkit';
import type { Note, Settings } from './db';
import type { Theme } from './story';
import { ORDINALS } from './story';
import { loadCasts, type CastArt } from './cast';
import { BRAND } from './brand';

// ─────────────────────────────────────────────────────────────
// THE PRINTABLE STORYBOOK
// Every message from the party, laid out like the TV: an open book on
// each page, in the party's theme, with its animals, colours and fonts.
// A4 landscape, all vector (text, art, shapes), so it prints sharp at any
// size. Fonts are embedded (files in party-app/fonts, SIL Open Font Licence).
// ─────────────────────────────────────────────────────────────

const W = 841.89, H = 595.28; // A4 landscape, points
const INK = '#3B2A4A';
const FONT_DIR = path.join(process.cwd(), 'party-app', 'fonts');

type Role = 'display' | 'story' | 'italic' | 'bold' | 'ui';
const THEME_FONTS: Record<string, Record<Exclude<Role, 'ui'>, string>> = {
  farm: { display: 'Grandstander_800ExtraBold', story: 'Alegreya_400Regular', italic: 'Alegreya_400Regular_Italic', bold: 'Alegreya_700Bold' },
  dino: { display: 'LuckiestGuy_400Regular', story: 'Nunito_600SemiBold', italic: 'Nunito_600SemiBold_Italic', bold: 'Nunito_800ExtraBold' },
  ocean: { display: 'Fredoka_700Bold', story: 'Quicksand_500Medium', italic: 'Quicksand_500Medium', bold: 'Quicksand_700Bold' },
  safari: { display: 'Baloo2_800ExtraBold', story: 'Nunito_600SemiBold', italic: 'Nunito_600SemiBold_Italic', bold: 'Nunito_800ExtraBold' },
  woodland: { display: 'PlayfairDisplay_800ExtraBold', story: 'Lora_400Regular', italic: 'Lora_400Regular_Italic', bold: 'Lora_700Bold' },
};
// If a font lacks a character (e.g. a macron), the next one in line is used.
const FALLBACK: Record<Role, string[]> = {
  display: ['Nunito_800ExtraBold'], story: ['Nunito_600SemiBold'], italic: ['Nunito_600SemiBold_Italic'],
  bold: ['Nunito_800ExtraBold'], ui: ['Nunito_700Bold'],
};
const KIND = {
  wish: { ring: '#FFE39A', ribbon: '#F2B43C', fallback: 'A birthday wish' },
  advice: { ring: '#BDEBD6', ribbon: '#5DBB8E', fallback: 'Words of wisdom' },
  guess: { ring: '#E1D6FB', ribbon: '#9C84C8', fallback: "I bet this year you'll" },
  today: { ring: '#FFD2DC', ribbon: '#EE7C98', fallback: 'A party memory' },
} as const;

const fontCache = new Map<string, { file: string; fk: fontkit.Font }>();
function font(name: string) {
  if (!fontCache.has(name)) {
    const file = path.join(FONT_DIR, `${name}.ttf`);
    fontCache.set(name, { file, fk: fontkit.create(fs.readFileSync(file)) as fontkit.Font });
  }
  return fontCache.get(name)!;
}

export type StorybookInput = {
  theme: Theme;
  settings: Settings;
  notes: Note[];
  age: number;
  createdAt: string;
};

export async function renderStorybookPdf(input: StorybookInput): Promise<Buffer> {
  const { theme, settings, notes } = input;
  const art: CastArt = loadCasts()[theme.id];
  const v = theme.vars;
  const dark = theme.mode === 'dark';
  const fonts = THEME_FONTS[theme.id] ?? THEME_FONTS.farm;
  const fontFor = (role: Role) => (role === 'ui' ? 'Nunito_700Bold' : fonts[role]);

  const name = (settings.name || '').trim() || 'the birthday star';
  const birthday = (ORDINALS[input.age] ? ORDINALS[input.age] + ' ' : '') + 'birthday';
  const words = (key: string, fallback: string) =>
    ((settings.text?.[key] || '').trim() || fallback).replace(/\{name\}/g, name).replace(/\{birthday\}/g, birthday);
  const title = words('tvTitle', 'A storybook for {name}');
  const signOff = words('signOff', 'With love from');
  const when = new Date(input.createdAt).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' });

  const doc = new PDFDocument({
    size: [W, H], margin: 0, autoFirstPage: false, compress: true,
    info: { Title: title, Author: `Everyone at ${name}'s ${birthday} party`, Creator: BRAND.name, Subject: 'A printable birthday storybook' },
  });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((ok) => doc.on('end', () => ok(Buffer.concat(chunks))));

  // Drops characters no font can draw (emoji and the like), then uses the theme's
  // font if it covers the rest, or the fallback if it doesn't (e.g. a macron in Fredoka).
  function useFont(role: Role, text: string) {
    const chain = [fontFor(role), ...FALLBACK[role]];
    const has = (n: string, c: string) => /\s/.test(c) || font(n).fk.hasGlyphForCodePoint(c.codePointAt(0)!);
    const kept = [...text].filter((c) => /[\u200d\ufe0f]/.test(c) ? false : chain.some((n) => has(n, c)));
    const clean = kept.join('').replace(/[ \t]{2,}/g, ' ').replace(/ +\n/g, '\n').trim();
    const pick = chain.find((n) => kept.every((c) => has(n, c))) ?? chain[chain.length - 1];
    doc.font(font(pick).file);
    return clean;
  }
  // A little heart, drawn (not typed) so every font gets one.
  function heart(x: number, y: number, size: number, color: string) {
    const s = size / 16;
    doc.path(`M${x} ${y + 5 * s} C ${x} ${y + 1 * s} ${x - 7 * s} ${y - 1 * s} ${x - 7 * s} ${y + 4 * s} C ${x - 7 * s} ${y + 8 * s} ${x - 2 * s} ${y + 11 * s} ${x} ${y + 13 * s} C ${x + 2 * s} ${y + 11 * s} ${x + 7 * s} ${y + 8 * s} ${x + 7 * s} ${y + 4 * s} C ${x + 7 * s} ${y - 1 * s} ${x} ${y + 1 * s} ${x} ${y + 5 * s} Z`).fill(color);
  }
  function text(role: Role, str: string, x: number, y: number, opts: PDFKit.Mixins.TextOptions & { size: number; color: string }) {
    const s = useFont(role, str);
    doc.fontSize(opts.size).fillColor(opts.color).text(s, x, y, opts);
    return s;
  }
  // Largest size (down to min) at which the text fits the box.
  function fit(role: Role, str: string, width: number, height: number, max: number, min: number) {
    const s = useFont(role, str);
    let size = max;
    for (; size > min; size -= 1) {
      doc.fontSize(size);
      if (doc.heightOfString(s, { width, align: 'center', lineGap: size * 0.18 }) <= height) break;
    }
    return { s, size };
  }
  const svg = (markup: string, x: number, y: number, w: number, h: number) =>
    SVGtoPDF(doc, markup, x, y, { width: w, height: h, preserveAspectRatio: 'xMidYMid meet', assumePt: false });

  // ── Scenery shared by the cover and back page ──
  function sky() {
    const g = doc.linearGradient(0, 0, 0, H);
    g.stop(0, v['--sky-high']).stop(0.65, v['--sky']);
    doc.rect(0, 0, W, H).fill(g);
    if (dark) {
      const pts = [[60, 50], [150, 110], [260, 40], [420, 70], [560, 30], [690, 95], [780, 45], [120, 200], [720, 190], [330, 150]];
      pts.forEach(([x, y], i) => doc.circle(x, y, i % 3 ? 1.6 : 2.4).fill('#FFF3C4'));
    }
    const cloud = (x: number, y: number, s: number) => {
      doc.fillColor(v['--cloud']).fillOpacity(dark ? 0.55 : 0.95);
      doc.ellipse(x, y, 46 * s, 16 * s).fill(); doc.ellipse(x - 22 * s, y + 4 * s, 26 * s, 12 * s).fill(); doc.ellipse(x + 26 * s, y + 5 * s, 28 * s, 11 * s).fill();
      doc.fillOpacity(1);
    };
    cloud(110, 80, 1.1); cloud(W - 150, 120, 0.9);
  }
  function hills() {
    doc.path(`M0 ${H - 130} C 180 ${H - 200} 330 ${H - 190} 470 ${H - 150} C 610 ${H - 110} 720 ${H - 180} ${W} ${H - 160} L ${W} ${H} L 0 ${H} Z`).fill(v['--hill-back']);
    doc.path(`M0 ${H - 70} C 200 ${H - 120} 400 ${H - 95} 560 ${H - 75} C 690 ${H - 60} 770 ${H - 95} ${W} ${H - 90} L ${W} ${H} L 0 ${H} Z`).fill(v['--hill-front']);
  }
  function moon(x: number, y: number, r: number) {
    doc.circle(x, y, r + 14).fillOpacity(0.25).fill('#FFF3C4').fillOpacity(1);
    doc.circle(x, y, r).lineWidth(3).fillAndStroke('#FBE7A1', INK);
    doc.circle(x - r * 0.35, y - r * 0.2, r * 0.16).fillOpacity(0.35).fill('#E9C96A');
    doc.circle(x + r * 0.3, y + r * 0.3, r * 0.1).fill('#E9C96A').fillOpacity(1);
  }

  // ── Cover ──
  doc.addPage();
  sky();
  moon(W - 140, 140, 60);
  svg(art.COW, W - 262, 62, 180, 127);
  hills();
  {
    const t = fit('display', title, 470, 170, 60, 26);
    doc.fontSize(t.size).fillColor(v['--ink']).text(t.s, 60, 110, { width: 470, align: 'left', lineGap: t.size * 0.05 });
    const sub = `Messages from everyone at ${name}’s ${birthday} party`;
    const y = doc.y + 12;
    text('italic', sub, 60, y, { width: 480, size: 19, color: v['--ink-soft'] });
    text('ui', `${when}  ·  ${notes.length} ${notes.length === 1 ? 'page' : 'pages'}`, 60, doc.y + 10, { width: 480, size: 13, color: v['--ink-soft'] });
  }
  svg(art.DOG, 70, H - 190, 120, 120);
  svg(art.CAT, 200, H - 200, 116, 125);
  svg(art.DISHSPOON, 350, H - 150, 150, 100);
  svg(art.SHEEP, W - 330, H - 205, 170, 135);
  svg(art.HUMPTY, W - 140, H - 245, 100, 133);

  // ── One open-book spread per message ──
  const peekers = [art.DOG, art.CAT, art.SHEEP, art.DISHSPOON, art.HUMPTY];
  const BX = 56, BY = 54, BW = W - 112, BH = H - 128, MID = W / 2;
  notes.forEach((n, i) => {
    doc.addPage();
    doc.rect(0, 0, W, H).fill(v['--sky']);
    doc.path(`M0 ${H - 40} C 250 ${H - 70} 560 ${H - 55} ${W} ${H - 62} L ${W} ${H} L 0 ${H} Z`).fill(v['--hill-front']);

    // book: shadow, cover edge, pages
    doc.roundedRect(BX + 6, BY + 10, BW, BH, 18).fill(INK);
    doc.roundedRect(BX - 6, BY - 6, BW + 12, BH + 12, 20).fill('#2C3E7A');
    doc.roundedRect(BX, BY, BW, BH, 12).fill(v['--paper'] ?? '#FFFDF6');
    doc.roundedRect(BX + 8, BY + 8, BW - 16, BH - 16, 8).dash(3, { space: 4 }).lineWidth(1.2).stroke('#E4CFA0').undash();
    const spine = doc.linearGradient(MID - 26, 0, MID + 26, 0);
    spine.stop(0, '#FFFDF6', 0).stop(0.5, '#D9C9A6', 0.9).stop(1, '#FFFDF6', 0);
    doc.rect(MID - 26, BY, 52, BH).fill(spine);
    [[BX - 6, BY - 6], [BX + BW + 6, BY - 6], [BX - 6, BY + BH + 6], [BX + BW + 6, BY + BH + 6]].forEach(([x, y]) => {
      doc.save().translate(x, y).rotate(45).rect(-9, -9, 18, 18).fill('#F2B43C').restore();
    });

    // left page: the type of message
    const k = (n.kind in KIND ? n.kind : 'wish') as keyof typeof KIND;
    const label = words(`${k}_label`, KIND[k].fallback);
    text('ui', `Page ${i + 1} of ${notes.length}`, BX + 34, BY + 28, { size: 12, color: '#8B7FA0', width: 200 });
    const cx = BX + BW / 4, cy = BY + BH * 0.42;
    doc.circle(cx, cy, 76).lineWidth(4).fillAndStroke('#FFFFFF', INK);
    doc.circle(cx, cy, 64).fill(KIND[k].ring);
    doc.circle(cx, cy, 58).dash(4, { space: 5 }).lineWidth(1.6).stroke('#FFFFFF').undash();
    if (art.ICONS[k]) svg(art.ICONS[k], cx - 48, cy - 48, 96, 96);
    [[cx - 92, cy - 70, 9], [cx + 84, cy - 84, 7], [cx + 92, cy + 56, 10], [cx - 86, cy + 64, 6]].forEach(([x, y, r]) =>
      doc.path(`M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3} Z`).fill('#F2C94C'));
    const ribbonW = 230, ribbonY = cy + 100;
    doc.path(`M${cx - ribbonW / 2 - 16} ${ribbonY} L${cx + ribbonW / 2 + 16} ${ribbonY} L${cx + ribbonW / 2} ${ribbonY + 21} L${cx + ribbonW / 2 + 16} ${ribbonY + 42} L${cx - ribbonW / 2 - 16} ${ribbonY + 42} L${cx - ribbonW / 2} ${ribbonY + 21} Z`)
      .lineWidth(3).fillAndStroke(KIND[k].ribbon, INK);
    const lab = fit('display', label, ribbonW - 20, 30, 20, 11);
    doc.fontSize(lab.size).fillColor(INK).text(lab.s, cx - ribbonW / 2 + 10, ribbonY + 21 - lab.size * 0.62, { width: ribbonW - 20, align: 'center', lineBreak: false });

    // right page: the message
    const RX = MID + 40, RW = BW / 2 - 84, top = BY + 50, boxH = BH - 190;
    const msg = fit('story', n.text, RW, boxH, 34, 12);
    doc.fontSize(msg.size);
    const h = doc.heightOfString(msg.s, { width: RW, align: 'center', lineGap: msg.size * 0.18 });
    doc.fillColor(INK).text(msg.s, RX, top + Math.max(0, (boxH - h) / 2), { width: RW, align: 'center', lineGap: msg.size * 0.18 });
    const fy = BY + BH - 128, fx = RX + RW / 2;
    doc.path(`M${fx - 90} ${fy} C ${fx - 60} ${fy - 8} ${fx - 40} ${fy + 8} ${fx - 16} ${fy}`).lineWidth(2.4).stroke('#5DBB8E');
    doc.path(`M${fx + 16} ${fy} C ${fx + 40} ${fy - 8} ${fx + 60} ${fy + 8} ${fx + 90} ${fy}`).stroke('#5DBB8E');
    doc.path(`M${fx} ${fy - 9} L${fx + 7} ${fy} L${fx} ${fy + 9} L${fx - 7} ${fy} Z`).lineWidth(2).fillAndStroke('#8FD3B6', INK);
    text('italic', signOff, RX, fy + 18, { width: RW, align: 'center', size: 16, color: '#6B5C80' });
    const from = (n.from || '').trim() || 'A guest';
    const nameFit = fit('bold', from, RW - 60, 34, 24, 13);
    doc.fontSize(nameFit.size).fillColor(INK).text(nameFit.s, RX + 30, fy + 42, { width: RW - 60, align: 'center', lineBreak: false });
    const nw = Math.min(doc.widthOfString(nameFit.s), RW - 60);
    heart(fx - nw / 2 - 16, fy + 42 + nameFit.size * 0.2, nameFit.size * 0.8, '#E0607E');
    heart(fx + nw / 2 + 16, fy + 42 + nameFit.size * 0.2, nameFit.size * 0.8, '#E0607E');
    text('italic', `~ ${i + 1} ~`, RX, BY + BH - 32, { width: RW, align: 'right', size: 12, color: '#9A8FAE' });

    // a character from the theme peeking in at the bottom
    const p = peekers[i % peekers.length];
    if (i % 2 === 0) svg(p, 8, H - 104, 96, 96); else svg(p, W - 108, H - 104, 96, 96);
  });

  // ── Back page ──
  doc.addPage();
  sky();
  hills();
  svg(art.BIRD, W / 2 - 90, 70, 180, 167);
  text('display', 'The end', 0, 262, { width: W, align: 'center', size: 54, color: v['--ink'] });
  text('italic', notes.length
    ? `Thank you to everyone who wrote a page for ${name}.`
    : `The pages are still waiting to be written.`, 80, doc.y + 6, { width: W - 160, align: 'center', size: 20, color: v['--ink-soft'] });
  svg(art.DOG, 90, H - 180, 110, 110);
  svg(art.HUMPTY, W - 190, H - 230, 100, 133);
  text('ui', `Made with ${BRAND.name}`, 0, H - 30, { width: W, align: 'center', size: 10, color: dark ? '#E9E4F5' : '#3B2A4A' });

  doc.end();
  return done;
}
