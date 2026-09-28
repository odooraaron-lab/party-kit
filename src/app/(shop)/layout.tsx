import Link from 'next/link';
import { Header } from '@/components/Header';
import { Logo } from '@/components/Logo';
import { BRAND } from '@/lib/brand';

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
            <div><b>Shop</b><Link href="/products">All products</Link><Link href="/products/party-pack">Party packs</Link><Link href="/products/balloon-kit">Decorations</Link></div>
          </nav>
        </div>
      </footer>
    </>
  );
}
