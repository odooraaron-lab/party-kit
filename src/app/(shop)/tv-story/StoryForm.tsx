'use client';
import { useEffect, useState } from 'react';
import { STORY_PRODUCT, THEMES, cleanName, getTheme } from '@/lib/story';
import type { CastArt } from '@/lib/cast';
import { money } from '@/lib/money';
import { ThemePreview } from '@/components/ThemePreview';
import { PayLater } from '@/components/PayLater';

const ages = Array.from({ length: STORY_PRODUCT.maxAge - STORY_PRODUCT.minAge + 1 }, (_, i) => i + STORY_PRODUCT.minAge);
// Every theme's fonts, so the preview can switch instantly.
const PREVIEW_FONTS = `https://fonts.googleapis.com/css2?${THEMES.map((t) => t.google).join('&')}&display=swap`;

export function StoryForm({ casts }: { casts: Record<string, CastArt> }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(1);
  const [email, setEmail] = useState('');
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Arriving from a theme card (/tv-story?theme=dino) preselects that theme.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('theme');
    if (t && getTheme(t)) setThemeId(t);
  }, []);
  const theme = getTheme(themeId)!;
  const previewName = cleanName(name) ?? 'Ari';

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cleanName(name)) return setError('Enter a first name using letters only (up to 24).');
    setBusy(true);
    try {
      const res = await fetch('/api/checkout-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, email, theme: themeId }),
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
        <ThemePreview theme={theme} art={casts[theme.id]} name={previewName} />
        <div className="theme-tiles" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={t.id === themeId} className="theme-tile" onClick={() => setThemeId(t.id)}>
              <div className="tt-sky" style={{ background: `linear-gradient(${t.vars['--sky-high']}, ${t.vars['--sky']} 60%, ${t.vars['--hill-front']} 60%)` }}>
                <div dangerouslySetInnerHTML={{ __html: casts[t.id].DOG }} />
              </div>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
        <ul className="ticks">
          <li>Guests scan the QR code and write a birthday message for {previewName}</li>
          <li>Each message pops up on the TV as a new storybook page</li>
          <li>Your own party site, with wording you can change from your private host page</li>
          <li>Printable QR cards, a setup guide, and a printable storybook PDF of every message afterwards</li>
        </ul>
      </div>

      <form className="stack" onSubmit={buy} noValidate>
        <div>
          <h3 style={{ fontSize: 30 }}>{STORY_PRODUCT.name}</h3>
          <p className="muted">{STORY_PRODUCT.blurb}</p>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{money(STORY_PRODUCT.price)}</div>
          <PayLater amount={STORY_PRODUCT.price} />
        </div>

        <div className="field">
          <label htmlFor="name">Child's first name</label>
          <input id="name" placeholder="e.g. Ari" value={name} maxLength={24} autoComplete="off" onChange={(e) => setName(e.target.value)} required />
          <span className="hint">This also becomes the party's web address, e.g. {previewName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.[yourdomain]</span>
        </div>

        <div className="field">
          <label htmlFor="age">Age they're turning</label>
          <select id="age" value={age} onChange={(e) => setAge(Number(e.target.value))}>
            {ages.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.tagline}</option>)}
          </select>
          <span className="hint">Your theme is made for your party, so it's set once you buy.</span>
        </div>

        <div className="field">
          <label htmlFor="email">Your email</label>
          <input id="email" type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} required />
          <span className="hint">We send the TV link, QR cards, your private host link and the setup guide here.</span>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-accent" type="submit" disabled={busy}>
          {busy ? 'Opening secure checkout…' : `Buy now · ${money(STORY_PRODUCT.price)}`}
        </button>
        <p className="muted small" style={{ textAlign: 'center', margin: 0 }}>Secure payment by Stripe. Your party site goes live as soon as payment is confirmed.</p>
      </form>
    </div>
  );
}
