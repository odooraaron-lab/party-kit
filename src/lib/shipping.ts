// ─────────────────────────────────────────────────────────────
// SHIPPING RULES — all PLACEHOLDER numbers. Replace with your
// NZ Post / courier rates. Cents, NZD.
// Used by the cart (to preview) AND the server (to charge), so
// customers can never change what they pay.
// ─────────────────────────────────────────────────────────────

export type ZoneId = 'akl' | 'ni' | 'si';

export const ZONES: { id: ZoneId; name: string; rate: number }[] = [
  { id: 'akl', name: 'Auckland', rate: 800 },
  { id: 'ni', name: 'Rest of North Island', rate: 1000 },
  { id: 'si', name: 'South Island', rate: 1200 },
];

export const RURAL_FEE = 600;
export const EXPRESS_FEE = 800;
export const FREE_STANDARD_OVER = 15000; // free standard shipping at $150+

export const DELIVERY_DAYS = {
  standard: { min: 2, max: 4 },
  express: { min: 1, max: 1 },
};

export function isZone(z: unknown): z is ZoneId {
  return ZONES.some((x) => x.id === z);
}

export function quoteShipping(opts: {
  subtotal: number;
  zone: ZoneId;
  rural: boolean;
  express: boolean;
}): number {
  const zone = ZONES.find((z) => z.id === opts.zone)!;
  const base = opts.subtotal >= FREE_STANDARD_OVER ? 0 : zone.rate;
  return base + (opts.rural ? RURAL_FEE : 0) + (opts.express ? EXPRESS_FEE : 0);
}
