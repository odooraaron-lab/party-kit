import type { Metadata } from 'next';
import { Grandstander, Nunito } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import { BRAND } from '@/lib/brand';
import './globals.css';

// The same hand-lettered display face as the TV storybook, so the shop and the product feel like one thing.
const display = Grandstander({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });
const body = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-body' });

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: 'A birthday storybook on your TV. Guests scan a QR code and write a message, and every message pops up as a new page, live at the party.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
