import { getProduct, getProductByCode, getTheme, type Product } from './catalog';

// What the browser stores and sends to the server.
export type CartItem = {
  key: string;        // unique per line
  productId: string;
  themeId: string;
  guests: number;     // 0 for digital items
  qty: number;
};

// A checked, priced line. Only ever built from the catalogue, never
// from prices the browser sends.
export type PricedLine = {
  product: Product;
  themeId: string;
  themeName: string;
  guests: number;
  qty: number;
  unit: number; // cents
  total: number;
};

export function priceItem(item: Pick<CartItem, 'productId' | 'themeId' | 'guests' | 'qty'>, opts: { allowSoldOut?: boolean } = {}): PricedLine | null {
  const product = getProduct(item.productId);
  const theme = getTheme(item.themeId);
  if (!product || !theme || (product.soldOut && !opts.allowSoldOut)) return null;
  const qty = Math.floor(Number(item.qty));
  if (!(qty >= 1 && qty <= 10)) return null;

  let unit = product.price;
  let guests = 0;
  if (product.kind === 'pack') {
    guests = Math.floor(Number(item.guests));
    if (guests < product.baseGuests || guests > product.maxGuests) return null;
    if ((guests - product.baseGuests) % product.guestStep !== 0) return null;
    unit += ((guests - product.baseGuests) / product.guestStep) * product.extraStepPrice;
  }
  return { product, themeId: theme.id, themeName: theme.name, guests, qty, unit, total: unit * qty };
}

export function priceCart(items: unknown): PricedLine[] {
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    throw new Error('Cart is empty or too large');
  }
  return items.map((i) => {
    const line = priceItem(i as CartItem);
    if (!line) throw new Error('Cart has an item that is no longer available');
    return line;
  });
}

export const subtotalOf = (lines: PricedLine[]) => lines.reduce((a, l) => a + l.total, 0);
export const hasPhysical = (lines: PricedLine[]) => lines.some((l) => l.product.kind === 'pack');

// Compact order record for Stripe metadata (500-char limit per value).
// Format: "pp.dino.20.1|di.dino.0.1"
export function encodeCart(lines: PricedLine[]): string {
  return lines.map((l) => [l.product.code, l.themeId, l.guests, l.qty].join('.')).join('|');
}

export function decodeCart(s: string | undefined | null): PricedLine[] {
  if (!s) return [];
  return s.split('|').flatMap((part) => {
    const [code, themeId, guests, qty] = part.split('.');
    const product = getProductByCode(code);
    if (!product) return [];
    const line = priceItem({ productId: product.id, themeId, guests: Number(guests), qty: Number(qty) }, { allowSoldOut: true });
    return line ? [line] : [];
  });
}

// Every downloadable file an order unlocks (bought directly or bundled with a Deluxe pack).
export function downloadsFor(lines: PricedLine[]): { fileId: string; label: string }[] {
  const out = new Map<string, string>();
  const add = (productId: string, themeId: string) => {
    const p = getProduct(productId);
    if (!p || p.kind !== 'digital' || !p.files) return;
    p.files.forEach((stem, i) => {
      out.set(stem.replace('{theme}', themeId), `${p.includes[i] ?? p.name} (${getTheme(themeId)?.name})`);
    });
  };
  for (const l of lines) {
    if (l.product.kind === 'digital') add(l.product.id, l.themeId);
    else l.product.bundledDigital.forEach((id) => add(id, l.themeId));
  }
  return [...out].map(([fileId, label]) => ({ fileId, label }));
}
