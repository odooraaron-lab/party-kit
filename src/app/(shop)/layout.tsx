import Link from 'next/link';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { BRAND } from '@/lib/brand';
import { MyqrFamily } from '@/components/MyqrFamily';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo size={36} />
            <p>{BRAND.tagline}. Made in New Zealand.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div><b>Products</b><Link href="/tv-story">Kids storybook</Link><Link href="/photo-wall">Party photo wall</Link><Link href="/tv-slideshow">TV slideshow</Link></div>
            <div><b>Help</b><Link href="/ideas">Party ideas</Link><Link href="/#faq">FAQ</Link><Link href="/contact">Contact us</Link><Link href="/contact#about">About us</Link></div>
            <div><b>Events</b><Link href="/ideas/21st-birthday-photo-slideshow">21sts</Link><Link href="/ideas/wedding-qr-code-photo-sharing">Weddings</Link><Link href="/ideas/work-christmas-party-ideas">Work Christmas parties</Link><Link href="/ideas/corporate-event-photo-sharing">Corporate events</Link><Link href="/ideas/function-venue-photo-wall">For venues</Link></div>
            <div><b>Shop</b><Link href="/products">All products</Link><Link href="/ideas">Party ideas</Link></div>
          </nav>
          <MyqrFamily current="wishcast" />
        </div>
      </footer>
    </>
  );
}
