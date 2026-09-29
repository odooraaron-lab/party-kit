'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Phones only: a bar that slides up once you scroll past the hero, so buying is always one tap away.
 * `hideOn` (a CSS selector, e.g. "#order") hides it while that section is on screen.
 */
export function MobileBuyBar({ title, note, href, label, hideOn }: { title: string; note: string; href: string; label: string; hideOn?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 160;
      const el = hideOn ? document.querySelector(hideOn) : null;
      const r = el?.getBoundingClientRect();
      const covering = !!r && r.top < window.innerHeight * 0.5 && r.bottom > 0;
      setOn(window.scrollY > 520 && !nearEnd && !covering);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [hideOn]);
  return (
    <div className={`m-buybar${on ? ' on' : ''}`} aria-hidden={!on}>
      <div><b>{title}</b><small>{note}</small></div>
      <Link className="btn" href={href} tabIndex={on ? 0 : -1}>{label}</Link>
    </div>
  );
}
