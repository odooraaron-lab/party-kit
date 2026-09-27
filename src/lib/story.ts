// ─────────────────────────────────────────────────────────────
// BIRTHDAY STORYBOOK TV — the main automated product.
// Guests scan a QR code on the TV and write a birthday message.
// Each message appears on the TV as a new page in a storybook.
// One party, one day. Parents can download every page afterwards.
// ─────────────────────────────────────────────────────────────

export const STORY_PRODUCT = {
  id: 'tv-story',
  name: 'Birthday Storybook TV',
  price: 2900, // cents — PLACEHOLDER
  blurb: 'Guests scan a QR code and write a birthday message on their phone. Every message pops up on the TV as a new page in a storybook, live during the party.',
  monthsLive: 3, // how long each party site stays online (time to download the storybook)
  minAge: 1,
  maxAge: 12,
  maxNotes: 400,  // per party, stops abuse
};

// ── Video on the storybook page ─────────────────────────────
// Add your video ONE of two ways, then the placeholder disappears:
//  1. File: put it in /public/videos/ (e.g. storybook.mp4, MP4/H.264, ideally under 30 MB)
//     and set src: '/videos/storybook.mp4'. Add a poster image (a still) the same way.
//  2. YouTube: upload it (unlisted is fine) and paste the video ID, e.g. 'dQw4w9WgXcQ'.
export const STORY_VIDEO = {
  src: '',        // e.g. '/videos/storybook.mp4'
  poster: '',     // e.g. '/videos/storybook-poster.jpg'
  youtubeId: '',  // e.g. 'dQw4w9WgXcQ' (used if src is empty)
  captions: '',   // optional subtitles file, e.g. '/videos/storybook.vtt'
  title: 'See it at a real party',
  text: 'Watch guests scan the QR code and their messages land on the TV, page by page.',
};

// ── The five themes ─────────────────────────────────────────
// Each theme is a fixed, tested bundle: an animal cast (public/party-app/cast-*.js),
// colours and fonts. Kept deliberately small so every combination is known to work on TVs.
export type Theme = {
  id: string;
  name: string;
  tagline: string;
  cast: 'farm' | 'dino' | 'ocean' | 'safari' | 'woodland';
  mode: 'light' | 'dark';     // dark themes get twinkling stars on the TV
  fonts: { display: string; story: string };
  google: string;             // Google Fonts families query
  singleWeight?: boolean;     // display font has one weight: don't fake bold
  vars: Record<string, string>; // CSS variables from public/party-app/style.css
};

export const THEMES: Theme[] = [
  {
    id: 'farm', name: 'Nursery Rhyme Farm', tagline: 'The cow jumps over the moon, the little dog laughs', cast: 'farm', mode: 'light',
    fonts: { display: 'Grandstander', story: 'Alegreya' },
    google: 'family=Grandstander:wght@600;700;800&family=Alegreya:ital,wght@0,400;0,500;0,700;1,400',
    vars: {
      '--sky': '#AFCBF2', '--sky-high': '#8FB4EA', '--line': '#D7E3F6',
      '--hill-back': '#9FD08C', '--hill-front': '#6DB46A', '--cloud': '#FFFFFF', '--bunny': '#FFFFFF',
      '--ink': '#3B2A4A', '--ink-soft': '#5E4C70',
    },
  },
  {
    id: 'dino', name: 'Dino Valley', tagline: 'Leaping dinos, a giggling T-rex and a wobbly dino egg', cast: 'dino', mode: 'light',
    fonts: { display: 'Luckiest Guy', story: 'Nunito' },
    google: 'family=Luckiest+Guy&family=Nunito:wght@600;700;800',
    singleWeight: true,
    vars: {
      '--sky': '#FFE2BD', '--sky-high': '#F7B98A', '--line': '#F6DCC4',
      '--hill-back': '#B9D47A', '--hill-front': '#8DBB5A', '--cloud': '#FFF6EA', '--bunny': '#FFFFFF',
      '--ink': '#3B2A4A', '--ink-soft': '#5E4C70',
    },
  },
  {
    id: 'ocean', name: 'Under the Sea', tagline: 'A leaping dolphin, a giggling crab and a puffed-up pufferfish', cast: 'ocean', mode: 'light',
    fonts: { display: 'Fredoka', story: 'Quicksand' },
    google: 'family=Fredoka:wght@500;600;700&family=Quicksand:wght@500;600;700',
    vars: {
      '--sky': '#BFE7F1', '--sky-high': '#7CC6E0', '--line': '#D5EEF4',
      '--hill-back': '#F3E1A9', '--hill-front': '#E4C680', '--cloud': '#FFFFFF', '--bunny': '#FFFFFF',
      '--ink': '#2F2A4A', '--ink-soft': '#4E4C70', '--paper': '#FFFFFF',
    },
  },
  {
    id: 'safari', name: 'Safari Adventure', tagline: 'A leaping gazelle, a giggling lion cub and a trumpeting elephant', cast: 'safari', mode: 'light',
    fonts: { display: 'Baloo 2', story: 'Nunito' },
    google: 'family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800',
    vars: {
      '--sky': '#FBE3B0', '--sky-high': '#F4C27A', '--line': '#F4E3C2',
      '--hill-back': '#D9B25E', '--hill-front': '#B58A3E', '--cloud': '#FFF8E8', '--bunny': '#FFFFFF',
      '--ink': '#3B2A4A', '--ink-soft': '#5E4C70',
    },
  },
  {
    id: 'woodland', name: 'Woodland Night', tagline: 'A fox over the moon, a giggling bunny and a sleepy owl', cast: 'woodland', mode: 'dark',
    fonts: { display: 'Playfair Display', story: 'Lora' },
    google: 'family=Playfair+Display:wght@700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400',
    vars: {
      '--sky': '#243067', '--sky-high': '#161E4A', '--line': '#3B4A86',
      '--hill-back': '#3E7A55', '--hill-front': '#2C5E43', '--cloud': '#5A67A8', '--bunny': '#E9E4F5',
      '--ink': '#F4EEFF', '--ink-soft': '#CFC4E8', '--paper': '#FFFCF4',
    },
  },
];
export const DEFAULT_THEME = THEMES[0];
export const getTheme = (id: string) => THEMES.find((t) => t.id === id);

// CSS injected into the party pages for the chosen theme.
export function themeCss(t: Theme): string {
  const vars = {
    ...t.vars,
    '--display': `"${t.fonts.display}", "Trebuchet MS", sans-serif`,
    '--story': `"${t.fonts.story}", Georgia, serif`,
  };
  const decls = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
  return `html:root[data-look="${t.id}"]{${decls}${t.singleWeight ? ';font-synthesis-weight:none' : ''}}`;
}
export const themeFontsHref = (t: Theme) => `https://fonts.googleapis.com/css2?${t.google}&display=swap`;

// Wording the host can change on /host (defaults live in public/party-app/shared.js).
export const TEXT_LIMITS: Record<string, number> = {
  tvTitle: 80, qrLabel: 80, signOff: 80, emptyBanner: 80, emptyText: 300,
  guestTitle: 80, guestIntro: 300, sendButton: 40, thanksTitle: 80, thanksText: 300,
  cardTitle: 80, cardText: 300,
  wish_label: 40, wish_ph: 80, advice_label: 40, advice_ph: 80, guess_label: 40, guess_ph: 80, today_label: 40, today_ph: 80,
};
export const KIND_IDS = ['wish', 'advice', 'guess', 'today'];

export const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];

// Input rules shared by the form and the server.
export function cleanName(raw: unknown): string | null {
  const name = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > 24) return null;
  if (!/^[\p{L}][\p{L}' -]*$/u.test(name)) return null;
  return name;
}
