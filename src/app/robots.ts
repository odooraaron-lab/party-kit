import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { SITE } from '@/lib/seo';
import { ROOT_DOMAIN } from '@/lib/domain';

// Party sites (ari.myqr.co.nz) are private: keep every subdomain out of search engines.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get('host') || '').split(':')[0].toLowerCase();
  const isMain = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host.endsWith('.vercel.app') || host === 'localhost';
  if (!isMain) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/upload/', '/success', '/cart', '/party/', '/p/', '/tv'] },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
