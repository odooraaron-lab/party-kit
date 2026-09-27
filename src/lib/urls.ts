import { siteUrl } from './stripe';

type Page = '' | '/tv' | '/host' | '/card' | '/guide';

// With NEXT_PUBLIC_ROOT_DOMAIN=mywebsite.co.nz → https://ari.mywebsite.co.nz/tv
// Locally (no root domain) → http://ari.localhost:3000/tv  (browsers resolve *.localhost)
export function partyUrl(slug: string, page: Page = ''): string {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (root) return `https://${slug}.${root}${page}`;
  const local = new URL(siteUrl());
  return `${local.protocol}//${slug}.localhost${local.port ? ':' + local.port : ''}${page}`;
}
