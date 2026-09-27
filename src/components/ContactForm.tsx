'use client';
import { useState } from 'react';

const TOPICS = ['An order', 'Help on the day', 'Wholesale or events', 'Something else'];

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setState('sending'); setError('');
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r && r.ok) setState('sent');
    else { setState('idle'); setError(j.error ?? 'That didn’t send. Try again, or email us.'); }
  }
  if (state === 'sent') {
    return <div className="contact-sent" role="status"><h3>Message sent</h3><p className="muted">Thanks! We’ll reply to your email soon.</p></div>;
  }
  return (
    <form className="stack contact-form" onSubmit={submit} noValidate>
      <div className="review-form-row">
        <div className="field"><label htmlFor="c-name">Your name</label><input id="c-name" name="name" autoComplete="name" required maxLength={80} /></div>
        <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" autoComplete="email" required /></div>
      </div>
      <div className="field">
        <label htmlFor="c-topic">What’s it about?</label>
        <select id="c-topic" name="topic" defaultValue={TOPICS[0]}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        <span className="hint">Party today and something’s not working? Choose “Help on the day” and we’ll look at it first.</span>
      </div>
      <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" name="message" rows={6} required maxLength={3000} /></div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-accent" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
