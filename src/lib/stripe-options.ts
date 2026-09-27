// ─────────────────────────────────────────────────────────────
// STRIPE CHECKOUT OPTIONS — switch features on/off here.
//
// Payment METHODS (card, Apple Pay, Google Pay, Afterpay, Klarna,
// Link…) are NOT set in code. Turn them on/off in the Stripe
// Dashboard → Settings → Payment methods. Stripe then shows each
// customer only the ones they're eligible for.
// ─────────────────────────────────────────────────────────────

export const STRIPE_OPTIONS = {
  // Lets customers type a discount code (create codes in Dashboard → Product catalogue → Coupons).
  promotionCodes: true,

  // Email Stripe's own receipt as well as ours. Turn on in Dashboard →
  // Settings → Customer emails ("Successful payments"). Nothing to do here.

  // Creates a proper tax invoice PDF for each order. Stripe charges a small
  // extra fee per invoice for this, so it's off until you want it.
  taxInvoices: false,

  // Saves customers in Stripe so repeat buyers show up as one person.
  saveCustomers: true,

  // Require ticking "I agree to the terms". Needs your Terms URL set in
  // Dashboard → Settings → Public details first, or checkout will error.
  requireTerms: false,

  // How long a checkout page stays open (minutes). Stripe allows 30 min–24 h.
  // Keep ≥ 180 so Afterpay customers have time to finish signing up.
  sessionMinutes: 24 * 60,

  // Buy-now-pay-later messaging shown under prices ("or 4 payments of…").
  // Only shows if NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set AND the method
  // is switched on in the Dashboard.
  payLaterMessaging: ['afterpay_clearpay', 'klarna'] as ('afterpay_clearpay' | 'klarna')[],

  // Text shown on the Stripe page.
  text: {
    shipping: 'We ship from New Zealand. Rural addresses must choose rural delivery in the cart.',
    submit: 'Printables are emailed as soon as payment goes through.',
  },
};
