// ─────────────────────────────────────────────────────────────
// THE CATALOGUE — edit prices, packs, themes and printables here.
// All money is in NZ cents (10000 = $100.00). Prices marked
// PLACEHOLDER are not decided yet.
// ─────────────────────────────────────────────────────────────

export type Theme = { id: string; name: string; swatch: string };

export const THEMES: Theme[] = [
  { id: 'dino', name: 'Dinosaur', swatch: '#D5E3B8' },
  { id: 'unicorn', name: 'Unicorn', swatch: '#E9D5F2' },
  { id: 'space', name: 'Space', swatch: '#C9D4F0' },
  { id: 'sea', name: 'Under the sea', swatch: '#BFE3E8' },
  { id: 'safari', name: 'Safari', swatch: '#F6D9A8' },
  { id: 'first', name: 'First birthday', swatch: '#F9D8CE' },
];

type Base = {
  id: string;        // used in URLs and the cart — never change once live
  code: string;      // 2-letter code stored in Stripe order metadata
  name: string;
  blurb: string;
  price: number;     // cents
  soldOut?: boolean; // shows 'Sold out' and can't be bought
};

// Physical box that gets posted.
export type Pack = Base & {
  kind: 'pack';
  baseGuests: number;       // guests the base price covers
  guestStep: number;        // guests added per "extra" step
  extraStepPrice: number;   // cents per extra step
  maxGuests: number;
  includes: string[];
  bundledDigital: string[]; // digital product ids included free
};

// Emailed download or online service.
export type Digital = Base & {
  kind: 'digital';
  files?: string[];         // file stems in /private-files/printables, "{theme}" is replaced
  includes: string[];
};

export type Product = Pack | Digital;

export const PRODUCTS: Product[] = [
  {
    kind: 'pack', id: 'mini-pack', code: 'pm', soldOut: true, name: 'Mini Pack',
    blurb: 'The table basics, matched to your theme.',
    price: 6000, // PLACEHOLDER
    baseGuests: 10, guestStep: 10, extraStepPrice: 2500 /* PLACEHOLDER */, maxGuests: 50,
    includes: ['Themed plates', 'Cups', 'Napkins'],
    bundledDigital: [],
  },
  {
    kind: 'pack', id: 'party-pack', code: 'pp', soldOut: true, name: 'Party Pack',
    blurb: 'Tableware and decorations for the whole room.',
    price: 10000,
    baseGuests: 10, guestStep: 10, extraStepPrice: 2500 /* PLACEHOLDER */, maxGuests: 50,
    includes: ['Themed plates & cups', 'Cutlery & napkins', 'Decorations'],
    bundledDigital: [],
  },
  {
    kind: 'pack', id: 'deluxe-pack', code: 'pd', soldOut: true, name: 'Deluxe Pack',
    blurb: 'Everything in Party, plus the printable invitation set.',
    price: 16000, // PLACEHOLDER
    baseGuests: 10, guestStep: 10, extraStepPrice: 2500 /* PLACEHOLDER */, maxGuests: 50,
    includes: ['Everything in the Party Pack', 'Printable invitation set'],
    bundledDigital: ['invite-set'],
  },
  {
    kind: 'digital', id: 'invite-set', code: 'di', soldOut: true, name: 'Printable invitation set',
    blurb: 'Invitations, thank-you cards and a welcome sign. Print at home.',
    price: 1200, // PLACEHOLDER
    files: ['invite-{theme}', 'thankyou-{theme}', 'welcome-sign-{theme}'],
    includes: ['Invitation (A5)', 'Thank-you card', 'Welcome sign (A3)'],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getProductByCode = (code: string) => PRODUCTS.find((p) => p.code === code);
export const getTheme = (id: string) => THEMES.find((t) => t.id === id);
export const PACKS = PRODUCTS.filter((p): p is Pack => p.kind === 'pack');
