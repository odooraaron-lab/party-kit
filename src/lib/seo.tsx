import type { Metadata } from 'next';
import { BRAND } from './brand';
import { ROOT_DOMAIN } from './domain';

// The shop's public address, for canonical links, the sitemap and structured data.
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || `https://${ROOT_DOMAIN}`).replace(/\/+$/, '');

export const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: `${BRAND.name}: party ideas for the TV` };

/** Page metadata with a canonical link and matching social-share text. */
export function pageMeta(path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: BRAND.name, locale: 'en_NZ', type: 'website', images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
    ...extra,
  };
}

/** Structured data for Google (products, FAQs, the business). */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND.name,
  url: SITE,
  logo: `${SITE}/opengraph-image`,
  areaServed: 'NZ',
  description: 'Instant party apps for the TV: QR code birthday messages, live party photo walls and TV slideshows. Made in New Zealand.',
});

export const faqLd = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export const productLd = (p: { name: string; description: string; path: string; price: number; available?: 'InStock' | 'OutOfStock' | 'PreOrder'; category?: string; image?: string | null }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: p.name,
  description: p.description,
  url: `${SITE}${p.path}`,
  image: `${SITE}${p.image || '/opengraph-image'}`,
  brand: { '@type': 'Brand', name: BRAND.name },
  ...(p.category ? { category: p.category } : {}),
  offers: {
    '@type': 'Offer',
    price: (p.price / 100).toFixed(2),
    priceCurrency: 'NZD',
    availability: `https://schema.org/${p.available ?? 'InStock'}`,
    url: `${SITE}${p.path}`,
    areaServed: 'NZ',
  },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE}${it.path}` })),
});
