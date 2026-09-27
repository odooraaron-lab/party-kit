'use client';
import { useState } from 'react';

// Email sign-up: "news" for the newsletter, or "restock:<id>" to hear when a product is back.
export function SignupForm({ topic, button, placeholder = 'Your email', note }: { topic: string; button: string; placeholder?: string; note?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState('sending'); setMsg('');
    const r = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: f.get('email'), topic, website: f.get('website') }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r && r.ok) { setState('done'); setMsg(j.already ? 'You’re already on the list.' : 'Done! We’ll email you.'); }
    else { setState('idle'); setMsg(j.error ?? 'That didn’t work. Try again.'); }
  }
  if (state === 'done') return <p className="signup-done" role="status">{msg}</p>;
  return (
    <form className="signup" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={`su-${topic}`}>Email address</label>
      <input id={`su-${topic}`} name="email" type="email" required autoComplete="email" placeholder={placeholder} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn btn-dark" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Adding…' : button}</button>
      {msg && <p className="error small" role="alert" style={{ flexBasis: '100%', margin: 0 }}>{msg}</p>}
      {note && <p className="muted small" style={{ flexBasis: '100%', margin: 0 }}>{note}</p>}
    </form>
  );
}
