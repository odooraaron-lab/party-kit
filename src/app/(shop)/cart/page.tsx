'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { PayLater } from '@/components/PayLater';
import { getTheme } from '@/lib/catalog';
import { money } from '@/lib/money';
import { ZONES, RURAL_FEE, FREE_STANDARD_OVER, quoteShipping, type ZoneId } from '@/lib/shipping';

export default function CartPage() {
  const { items, lines, setQty, remove } = useCart();
  const [zone, setZone] = useState<ZoneId>('akl');
  const [rural, setRural] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const physical = lines.some((l) => l.product.kind === 'pack');
  const shipping = physical ? quoteShipping({ subtotal, zone, rural, express: false }) : 0;

  async function checkout() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, zone, rural }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="section stack" style={{ alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: 40 }}>Your cart is empty</h1>
        <p className="muted">Start with a party pack, then add printables or the guest app.</p>
        <Link href="/shop" className="btn btn-accent">Shop party packs</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="stack">
        <h1 style={{ fontSize: 40 }}>Your cart</h1>
        {lines.map((l) => (
          <div key={l.key} className="box line">
            <div className="dot" style={{ background: getTheme(l.themeId)?.swatch }} />
            <div className="grow">
              <b>{l.product.name}</b>
              <div className="muted" style={{ fontSize: 14 }}>
                {l.themeName}{l.guests ? ` · ${l.guests} guests` : ' · digital'}
              </div>
              <div className="stepper" style={{ gap: 8, marginTop: 6 }}>
                <button aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                <output>{l.qty}</output>
                <button aria-label="Increase quantity" onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                <button className="linkbtn" onClick={() => remove(l.key)}>Remove</button>
              </div>
            </div>
            <b>{money(l.total)}</b>
          </div>
        ))}
      </div>

      <div className="stack">
        {physical && (
          <div className="box stack" style={{ gap: 14 }}>
            <b style={{ fontSize: 18 }}>Shipping</b>
            <div>
              <div className="label" style={{ fontSize: 14 }}>Delivering to</div>
              <div className="chips">
                {ZONES.map((z) => (
                  <button key={z.id} className="chip" aria-pressed={z.id === zone} onClick={() => setZone(z.id)}>{z.name}</button>
                ))}
              </div>
            </div>
            <label className="check">
              <input type="checkbox" checked={rural} onChange={(e) => setRural(e.target.checked)} />
              <span style={{ flex: 1 }}>Rural delivery address</span>
              <span className="muted">+{money(RURAL_FEE)}</span>
            </label>
            <div>
              <div className="bar"><div style={{ width: `${Math.min(100, (subtotal / FREE_STANDARD_OVER) * 100)}%` }} /></div>
              <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
                {subtotal >= FREE_STANDARD_OVER
                  ? 'Free standard shipping unlocked'
                  : `Add ${money(FREE_STANDARD_OVER - subtotal)} more for free standard shipping`}
              </div>
            </div>
            <div className="muted" style={{ fontSize: 14 }}>Choose standard or express on the next page.</div>
          </div>
        )}

        <div className="totals">
          <div className="row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="row"><span>Shipping</span><span>{physical ? (shipping ? `from ${money(shipping)}` : 'Free') : 'None — digital only'}</span></div>
          <div className="row grand"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
          <div className="muted" style={{ fontSize: 13 }}>NZD. [GST NOTE]</div>
          <PayLater amount={subtotal + shipping} />
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-accent" onClick={checkout} disabled={busy}>
          {busy ? 'Opening secure checkout…' : 'Checkout'}
        </button>
        <p className="muted" style={{ fontSize: 13, textAlign: 'center', margin: 0 }}>Card, Apple Pay, Google Pay and pay-later options, processed securely by Stripe. Have a discount code? Enter it on the next page.</p>
      </div>
    </div>
  );
}
