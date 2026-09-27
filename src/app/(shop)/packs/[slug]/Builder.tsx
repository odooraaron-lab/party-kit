'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProduct, getTheme, THEMES } from '@/lib/catalog';
import { priceItem } from '@/lib/cart';
import { money } from '@/lib/money';
import { useCart } from '@/components/CartProvider';
import { PayLater } from '@/components/PayLater';

export function Builder({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const router = useRouter();
  const search = useSearchParams();
  const { add } = useCart();

  const [themeId, setThemeId] = useState(getTheme(search.get('theme') ?? '')?.id ?? THEMES[0].id);
  const isPack = product.kind === 'pack';
  const [guests, setGuests] = useState(isPack ? product.baseGuests : 0);
  const [invite, setInvite] = useState(false);
  const theme = getTheme(themeId)!;

  const addOns = isPack && product.bundledDigital.length === 0
    ? [
        { id: 'invite-set', on: invite, set: setInvite },
      ].filter((a) => !getProduct(a.id)?.soldOut)
    : [];

  const main = priceItem({ productId, themeId, guests, qty: 1 }) ?? { unit: product.price, total: product.price };
  const total = main.total + addOns.filter((a) => a.on).reduce((s, a) => s + getProduct(a.id)!.price, 0);

  function addToCart() {
    add({ productId, themeId, guests, qty: 1 });
    addOns.filter((a) => a.on).forEach((a) => add({ productId: a.id, themeId, guests: 0, qty: 1 }));
    router.push('/cart');
  }

  return (
    <div className="builder">
      <div className="photo" style={{ background: theme.swatch }}>{theme.name} — product photo</div>
      <div className="stack">
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800 }}>{product.name}</h1>
          <p className="muted">{product.blurb}</p>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{money(main.unit)}</div>
          <PayLater amount={total} />
        </div>

        <div>
          <div className="label">Theme: {theme.name}</div>
          <div className="swatches">
            {THEMES.map((t) => (
              <button key={t.id} className="swatch" style={{ background: t.swatch }} aria-label={t.name}
                aria-pressed={t.id === themeId} onClick={() => setThemeId(t.id)} />
            ))}
          </div>
        </div>

        {isPack && (
          <div className="box row">
            <div>
              <div className="label" style={{ margin: 0 }}>Guests</div>
              <div className="muted" style={{ fontSize: 14 }}>+{money(product.extraStepPrice)} per extra {product.guestStep}</div>
            </div>
            <div className="stepper">
              <button aria-label="Fewer guests" disabled={guests <= product.baseGuests}
                onClick={() => setGuests(guests - product.guestStep)}>−</button>
              <output aria-live="polite">{guests}</output>
              <button aria-label="More guests" disabled={guests >= product.maxGuests}
                onClick={() => setGuests(guests + product.guestStep)}>+</button>
            </div>
          </div>
        )}

        <div>
          <div className="label">What's included</div>
          <ul className="ticks">{product.includes.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>

        {addOns.length > 0 && (
          <div className="stack" style={{ gap: 10 }}>
            <div className="label" style={{ margin: 0 }}>Add-ons</div>
            {addOns.map((a) => {
              const p = getProduct(a.id)!;
              return (
                <label key={a.id} className="box check">
                  <input type="checkbox" checked={a.on} onChange={(e) => a.set(e.target.checked)} />
                  <span style={{ flex: 1 }}><b>{p.name}</b><br /><span className="muted" style={{ fontSize: 14 }}>{p.blurb}</span></span>
                  <b>+{money(p.price)}</b>
                </label>
              );
            })}
          </div>
        )}

        {product.soldOut ? (
          <button className="btn btn-dark" disabled>Sold out</button>
        ) : (
          <button className="btn btn-accent" onClick={addToCart}>Add to cart · {money(total)}</button>
        )}
      </div>
    </div>
  );
}
