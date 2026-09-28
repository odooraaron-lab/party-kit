import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';
import { STOCK } from '@/lib/listings';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly') =>
    ({ url: `${SITE}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page('', 1, 'weekly'),
    page('/tv-story', 0.9, 'weekly'),
    page('/photo-wall', 0.9, 'weekly'),
    page('/tv-slideshow', 0.9, 'weekly'),
    page('/ideas', 0.8, 'weekly'),
    ...GUIDES.map((g) => page(`/ideas/${g.slug}`, 0.7)),
    page('/products', 0.6),
    ...STOCK.map((s) => page(`/products/${s.id}`, 0.4)),
    page('/contact', 0.3),
  ];
}
