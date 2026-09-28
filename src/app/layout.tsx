import type { Metadata } from 'next';
import { Grandstander, Nunito } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import { BRAND } from '@/lib/brand';
import { SITE } from '@/lib/seo';
import './globals.css';

// The same hand-lettered display face as the TV storybook, so the shop and the product feel like one thing.
const display = Grandstander({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });
const body = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${BRAND.name}: Party Ideas for the TV, QR Code Photo Sharing & Kids Parties`, template: `%s | ${BRAND.name}` },
  description: 'Instant party ideas for your TV. Guests scan a QR code to share photos or birthday messages that pop up live on screen. Kids parties, big birthdays, NZ.',
  applicationName: BRAND.name,
  keywords: ['kids party ideas', 'kids birthday party NZ', 'party ideas', 'QR code photo sharing', 'party photo wall', 'party TV screen', 'digital signage for parties', 'TV slideshow', 'kids party packs NZ'],
  openGraph: { siteName: BRAND.name, locale: 'en_NZ', type: 'website' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
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
