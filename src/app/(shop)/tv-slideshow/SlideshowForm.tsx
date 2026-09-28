'use client';
import { useEffect, useState } from 'react';
import { SLIDESHOW_PRODUCT as P, cleanTitle, toSlug } from '@/lib/slideshow-config';
import { money } from '@/lib/money';
import { PayLater } from '@/components/PayLater';
import { ROOT_DOMAIN } from '@/lib/domain';

export function SlideshowForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (!slugEdited) setSlug(toSlug(title)); }, [title, slugEdited]);
  const preview = cleanTitle(title) ?? 'Happy 50th, Dad';

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!cleanTitle(title)) return setError('Enter a slideshow title (2–50 letters or numbers).');
    setBusy(true);
    try {
      const res = await fetch('/api/checkout-slideshow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, slug, email }) });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch (err) { setError(err instanceof Error ? err.message : 'Checkout failed'); setBusy(false); }
  }

  return (
    <div className="builder">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" precedence="default" />
      <div className="stack">
        <div className="tv-frame" aria-hidden="true">
          <div className="tv-frame-screen">
            <div className="ss-preview"><span>{preview}</span></div>
          </div>
        </div>
        <ol className="steps steps-compact">
          <li><b>Pay and pick your address</b><span>e.g. {slug || 'happy-50th-dad'}.{ROOT_DOMAIN}</span></li>
          <li><b>Upload photos and videos</b><span>Straight after paying, from your phone or computer.</span></li>
          <li><b>Open it on the TV</b><span>It plays on a loop. Click once for sound.</span></li>
        </ol>
      </div>

      <form className="stack" onSubmit={buy} noValidate>
        <div>
          <h3 style={{ fontSize: 30 }}>{P.name}</h3>
          <p className="muted">{P.blurb}</p>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{money(P.price)} <span className="muted small" style={{ fontWeight: 600 }}>one-time</span></div>
          <PayLater amount={P.price} />
        </div>
        <div className="field">
          <label htmlFor="ss-title">Slideshow title</label>
          <input id="ss-title" placeholder="e.g. Happy 50th, Dad" value={title} maxLength={50} onChange={(e) => setTitle(e.target.value)} required />
          <span className="hint">Shown on the TV between rounds of the slideshow.</span>
        </div>
        <div className="field">
          <label htmlFor="ss-slug">Web address</label>
          <div className="slug-row">
            <input id="ss-slug" value={slug} maxLength={30} placeholder="happy-50th-dad" autoCapitalize="off" spellCheck={false}
              onChange={(e) => { setSlugEdited(true); setSlug(toSlug(e.target.value)); }} />
            <span>.{ROOT_DOMAIN}</span>
          </div>
          <span className="hint">If it&rsquo;s taken, we add a number to the end.</span>
        </div>
        <div className="field">
          <label htmlFor="ss-email">Your email</label>
          <input id="ss-email" type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} required />
          <span className="hint">We send your private upload link and the slideshow address here.</span>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-accent" type="submit" disabled={busy}>{busy ? 'Opening secure checkout…' : `Buy now · ${money(P.price)}`}</button>
        <p className="muted small" style={{ textAlign: 'center', margin: 0 }}>
          Up to {P.maxItems} photos and videos. Plays for {P.monthsLive} months, then the files are deleted.
        </p>
      </form>
    </div>
  );
}
