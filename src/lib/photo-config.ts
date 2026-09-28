// ─────────────────────────────────────────────────────────────
// PHOTO WALL — the grown-up party product.
// Guests scan a QR code and add photos from their phone. Photos
// land in a shared gallery and play on the TV as a live slideshow.
// One-time payment, one event, its own web address.
// ─────────────────────────────────────────────────────────────

export const PHOTO_PRODUCT = {
  id: 'photo-wall',
  name: 'Party Photo Wall',
  price: 3900, // cents — PLACEHOLDER
  blurb: 'Guests scan a QR code and add their photos from their phone. Every photo lands in one shared album and plays on the TV as a live slideshow. Download them all after.',
  monthsLive: 6,       // how long the album stays online (then photos are deleted)
  maxPhotos: 1500,     // per event
  maxBytes: 4_000_000, // per upload request (full + thumbnail); phones shrink photos before sending
};

export type PhotoTheme = {
  id: string;
  name: string;
  tagline: string;
  mode: 'light' | 'dark';
  fonts: { display: string; body: string };
  google: string;
  vars: Record<string, string>;
};

// Four fixed, tested looks. Locked in at purchase, like the storybook themes.
export const PHOTO_THEMES: PhotoTheme[] = [
  {
    id: 'champagne', name: 'Champagne', tagline: 'Art-deco gold frames on black, for a night to remember', mode: 'dark',
    fonts: { display: 'Cormorant Garamond', body: 'Jost' },
    google: 'family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600',
    vars: { '--bg': '#15120E', '--surface': '#221D17', '--ink': '#F6EEDF', '--muted': '#CBBFA8', '--line': '#3A3228', '--accent': '#D9B46A', '--accent-ink': '#15120E' },
  },
  {
    id: 'garden', name: 'Garden Party', tagline: 'Prints drop onto a sage table among leafy bushes, for daytime do’s', mode: 'light',
    fonts: { display: 'DM Serif Display', body: 'Karla' },
    google: 'family=DM+Serif+Display&family=Karla:wght@400;500;700',
    vars: { '--bg': '#F1F4EC', '--surface': '#FFFFFF', '--ink': '#1F2A22', '--muted': '#4F5E53', '--line': '#D5DDCF', '--accent': '#3F6B4F', '--accent-ink': '#FFFFFF' },
  },
  {
    id: 'neon', name: 'Neon Night', tagline: 'Glowing pink and cyan frames, for the dance floor', mode: 'dark',
    fonts: { display: 'Unbounded', body: 'Manrope' },
    google: 'family=Unbounded:wght@600;800&family=Manrope:wght@400;600;700',
    vars: { '--bg': '#0E0B1A', '--surface': '#1A1530', '--ink': '#F4F1FF', '--muted': '#B8B0D8', '--line': '#2E2750', '--accent': '#FF4FA3', '--accent-ink': '#0E0B1A' },
  },
  {
    // id stays 'gallery' so parties already bought keep working.
    id: 'gallery', name: 'Beige Pastel', tagline: 'Warm beige with soft pastel touches, calm and pretty', mode: 'light',
    fonts: { display: 'Fraunces', body: 'Nunito Sans' },
    google: 'family=Fraunces:wght@400;600&family=Nunito+Sans:wght@400;600;700',
    vars: { '--bg': '#EADFD0', '--surface': '#F7EFE6', '--ink': '#4A3F35', '--muted': '#8A7B6B', '--line': '#DDD0BF', '--accent': '#C99A86', '--accent-ink': '#FFFFFF' },
  },
];
export const getPhotoTheme = (id: string) => PHOTO_THEMES.find((t) => t.id === id);

export function photoThemeCss(t: PhotoTheme): string {
  const vars = { ...t.vars, '--display': `"${t.fonts.display}", Georgia, serif`, '--body': `"${t.fonts.body}", system-ui, sans-serif` };
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}`;
}
export const photoFontsHref = (t: PhotoTheme) => `https://fonts.googleapis.com/css2?${t.google}&display=swap`;

// Wording the host can change on /host (defaults live in public/photo-app/photo.js).
export const PHOTO_TEXT_LIMITS: Record<string, number> = {
  title: 80, intro: 240, qrLabel: 60, addButton: 30, thanks: 120, cardTitle: 80, cardText: 240, emptyTv: 120,
};

// Only real images, and only what we can show in a browser.
export function sniffImage(buf: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

// Event names are freer than kids' names: "Sam & Alex's 40th", "Mum's 60th!"
export function cleanEventName(raw: unknown): string | null {
  const name = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 40) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N} '’&.,!?#-]*$/u.test(name)) return null;
  return name;
}
