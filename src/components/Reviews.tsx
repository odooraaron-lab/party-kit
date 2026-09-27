'use client';
import { useEffect, useState } from 'react';
import { Stars } from './Stars';

type Review = { id: string; name: string; rating: number; text: string; verified: boolean; createdAt: number; productName?: string; product?: string };
type Data = { reviews: Review[]; count: number; average: number };

function useReviews(product: string | null) {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    fetch(`/api/reviews${product ? `?product=${encodeURIComponent(product)}` : ''}`)
      .then((r) => r.json()).then(setData).catch(() => setData({ reviews: [], count: 0, average: 0 }));
  }, [product]);
  return data;
}

const when = (t: number) => new Date(t).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' });

// Small "★ 4.8 (12 reviews)" link for the top of a product page. Hidden until there are reviews.
export function RatingBadge({ product }: { product: string }) {
  const d = useReviews(product);
  if (!d || d.count === 0) return null;
  return (
    <a href="#reviews" className="rating-badge">
      <Stars value={d.average} size={16} /> <b>{d.average.toFixed(1)}</b> <span>({d.count} review{d.count === 1 ? '' : 's'})</span>
    </a>
  );
}

function ReviewCard({ r, showProduct }: { r: Review; showProduct?: boolean }) {
  return (
    <article className="review">
      <Stars value={r.rating} />
      <p className="review-text">{r.text}</p>
      <footer>
        <b>{r.name}</b>
        {r.verified && <span className="verified">Verified buyer</span>}
        <span className="muted small">{showProduct && r.productName ? `${r.productName} · ` : ''}{when(r.createdAt)}</span>
      </footer>
    </article>
  );
}

// The review section at the bottom of every product page.
export function ReviewsSection({ product, productName }: { product: string; productName: string }) {
  const data = useReviews(product);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError('');
    if (!rating) return setError('Choose a star rating.');
    setState('sending');
    const r = await fetch('/api/reviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, rating, name: f.get('name'), email: f.get('email'), text: f.get('text'), website: f.get('website') }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r && r.ok) setState('sent');
    else { setState('idle'); setError(j.error ?? 'That didn’t send. Try again.'); }
  }

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews-head">
        <div>
          <h2 id="reviews-title">Reviews</h2>
          {data && data.count > 0 ? (
            <p className="reviews-summary"><Stars value={data.average} size={22} /> <b>{data.average.toFixed(1)} out of 5</b> <span className="muted">from {data.count} review{data.count === 1 ? '' : 's'}</span></p>
          ) : (
            <p className="muted">{data ? `No reviews of the ${productName} yet. Used it? Be the first to tell other parents how it went.` : 'Loading reviews…'}</p>
          )}
        </div>
        {!open && state !== 'sent' && <button className="btn btn-outline" onClick={() => setOpen(true)}>Write a review</button>}
      </div>

      {state === 'sent' && <p className="review-thanks" role="status">Thank you! Your review will appear here once we’ve checked it, usually within a day.</p>}

      {open && state !== 'sent' && (
        <form className="review-form" onSubmit={submit} noValidate>
          <fieldset className="star-pick">
            <legend>Your rating</legend>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={n <= rating ? 'on' : ''}>
                <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
                <span aria-hidden="true">★</span><span className="sr-only">{n} star{n === 1 ? '' : 's'}</span>
              </label>
            ))}
          </fieldset>
          <div className="review-form-row">
            <div className="field"><label htmlFor={`rv-name-${product}`}>First name</label><input id={`rv-name-${product}`} name="name" maxLength={40} autoComplete="given-name" required /></div>
            <div className="field"><label htmlFor={`rv-email-${product}`}>Email <span className="muted small">(not shown)</span></label><input id={`rv-email-${product}`} name="email" type="email" autoComplete="email" required /></div>
          </div>
          <div className="field"><label htmlFor={`rv-text-${product}`}>Your review</label><textarea id={`rv-text-${product}`} name="text" rows={4} maxLength={1200} required placeholder="How did it go at your party?" /></div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          <p className="muted small" style={{ margin: 0 }}>Use the email you bought with and we’ll mark your review as a verified buyer.</p>
          {error && <p className="error" role="alert">{error}</p>}
          <div className="actions" style={{ marginTop: 0 }}>
            <button className="btn btn-accent" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send review'}</button>
            <button className="btn btn-outline" type="button" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      {data && data.count > 0 && <div className="review-list">{data.reviews.map((r) => <ReviewCard key={r.id} r={r} />)}</div>}
    </section>
  );
}

// Latest reviews across the whole shop, for the homepage. Renders nothing until there are some.
export function LatestReviews() {
  const data = useReviews(null);
  if (!data || data.count === 0) return null;
  return (
    <section className="section" aria-labelledby="latest-reviews">
      <h2 id="latest-reviews">What parents are saying</h2>
      <div className="review-list review-list-grid">{data.reviews.map((r) => <ReviewCard key={r.id} r={r} showProduct />)}</div>
    </section>
  );
}
