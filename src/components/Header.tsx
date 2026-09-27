'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { Logo } from './Logo';
import { BRAND } from '@/lib/brand';

const LINKS = [
  { href: '/tv-story', label: 'Kids storybook' },
  { href: '/photo-wall', label: 'Photo wall' },
  { href: '/tv-slideshow', label: 'TV slideshow' },
  { href: '/products', label: 'All products' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const onBuilder = ['/tv-story', '/photo-wall', '/tv-slideshow'].includes(pathname) || pathname.startsWith('/upload/');

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="announce">{BRAND.announcement}</div>
      <div className="header-bar">
        <Link href="/" className="logo-link" aria-label={`${BRAND.name} home`}>
          <Logo size={42} />
        </Link>

        <nav className="nav-main" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          {count > 0 && (
            <Link href="/cart" className="cart-link" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
              <span className="cart-count">{count}</span>
            </Link>
          )}
          {!onBuilder && <Link href="/tv-story" className="btn btn-accent btn-sm header-cta">Create a storybook</Link>}
          <button ref={menuBtn} className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l) => <Link key={l.href} href={l.href} className="mobile-link" onClick={() => setOpen(false)}>{l.label}</Link>)}
          {count > 0 && <Link href="/cart" className="mobile-link">Cart ({count})</Link>}
        </nav>
        <Link href="/tv-story" className="btn btn-accent" onClick={() => setOpen(false)}>Create a storybook</Link>
      </div>
    </header>
  );
}
