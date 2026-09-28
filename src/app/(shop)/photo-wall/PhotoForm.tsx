'use client';
import { useEffect, useState } from 'react';
import { PHOTO_PRODUCT, PHOTO_THEMES, cleanEventName, getPhotoTheme } from '@/lib/photo-config';
import { money } from '@/lib/money';
import { PhotoPreview } from '@/components/PhotoPreview';
import { PayLater } from '@/components/PayLater';
import { ROOT_DOMAIN } from '@/lib/domain';

const PREVIEW_FONTS = `https://fonts.googleapis.com/css2?${PHOTO_THEMES.map((t) => t.google).join('&')}&display=swap`;
const toSlug = (s: string) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);

export function PhotoForm() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [email, setEmail] = useState('');
  const [themeId, setThemeId] = useState(PHOTO_THEMES[0].id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('look');
    if (t && getPhotoTheme(t)) setThemeId(t);
  }, []);
  useEffect(() => { if (!slugEdited) setSlug(toSlug(name)); }, [name, slugEdited]);

  const theme = getPhotoTheme(themeId)!;
  const preview = cleanEventName(name) ?? "Sam's 40th";

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cleanEventName(name)) return setError('Enter an event name (2–40 letters or numbers).');
    setBusy(true);
    try {
      const res = await fetch('/api/checkout-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, email, theme: themeId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setBusy(false);
    }
  }

  return (
    <div className="builder">
      <link rel="stylesheet" href={PREVIEW_FONTS} precedence="default" />
      <div className="stack">
        <div className="tv-frame"><div className="tv-frame-screen"><PhotoPreview theme={theme} name={preview} /></div></div>
        <div className="look-tiles" role="radiogroup" aria-label="Look">
          {PHOTO_THEMES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={t.id === themeId} className="look-tile" onClick={() => setThemeId(t.id)}
              style={{ background: t.vars['--bg'], color: t.vars['--ink'] }}>
              <span className="look-dot" style={{ background: t.vars['--accent'] }} />
              <span style={{ fontFamily: `"${t.fonts.display}", Georgia, serif` }}>{t.name}</span>
            </button>
          ))}
        </div>
        <ul className="ticks">
          <li>Guests scan a QR code and add photos straight from their phone. No app, no sign-up</li>
          <li>Every photo plays on your TV as a live slideshow, newest first</li>
          <li>One shared album guests can browse, and you can download every photo in one go</li>
          <li>Remove any photo, close uploads, and change the wording from your private host page</li>
        </ul>
      </div>

      <form className="stack" onSubmit={buy} noValidate>
        <div>
          <h3 style={{ fontSize: 30 }}>{PHOTO_PRODUCT.name}</h3>
          <p className="muted">{PHOTO_PRODUCT.blurb}</p>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{money(PHOTO_PRODUCT.price)} <span className="muted small" style={{ fontWeight: 600 }}>one-time, no subscription</span></div>
          <PayLater amount={PHOTO_PRODUCT.price} />
        </div>

        <div className="field">
          <label htmlFor="ev-name">Event name</label>
          <input id="ev-name" placeholder="e.g. Sam's 40th" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} required />
          <span className="hint">Shown on the TV, the QR cards and guests' phones.</span>
        </div>

        <div className="field">
          <label htmlFor="ev-slug">Web address</label>
          <div className="slug-row">
            <input id="ev-slug" value={slug} maxLength={30} placeholder="sams-40th" autoCapitalize="off" spellCheck={false}
              onChange={(e) => { setSlugEdited(true); setSlug(toSlug(e.target.value)); }} />
            <span>.{ROOT_DOMAIN}</span>
          </div>
          <span className="hint">If it's taken, we add a number to the end.</span>
        </div>

        <div className="field">
          <label htmlFor="look">Look</label>
          <select id="look" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {PHOTO_THEMES.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.tagline}</option>)}
          </select>
          <span className="hint">Your look is set once you buy.</span>
        </div>

        <div className="field">
          <label htmlFor="ph-email">Your email</label>
          <input id="ph-email" type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} required />
          <span className="hint">We send the TV link, QR cards, your private host link and the setup guide here.</span>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-accent" type="submit" disabled={busy}>
          {busy ? 'Opening secure checkout…' : `Buy now · ${money(PHOTO_PRODUCT.price)}`}
        </button>
        <p className="muted small" style={{ textAlign: 'center', margin: 0 }}>
          Secure payment by Stripe. Your album is online for {PHOTO_PRODUCT.monthsLive} months, then the photos are deleted.
        </p>
      </form>
    </div>
  );
}
