const RESERVED = new Set(['www', 'app', 'api', 'admin', 'mail', 'shop', 'help', 'support', 'blog', 'static', 'assets', 'p', 'tv', 'dev', 'test', 'hq', 'resthome', 'care', 'digitalsignage', 'signage', 'reviews', 'review', 'reviewqr', 'create', 'login', 'buddy', 'buddies']);

// "Poppy-Rose O'Neil" → "poppy-rose-oneil"
export function baseSlug(name: string): string {
  const s = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  return s.length >= 2 && !RESERVED.has(s) ? s : `party-${s || 'kid'}`;
}

// poppy, poppy2, poppy3 …
export function* slugCandidates(name: string) {
  const base = baseSlug(name);
  yield base;
  for (let i = 2; i < 1000; i++) yield `${base}${i}`;
}

export const isValidSlug = (s: string) => /^[a-z0-9](?:[a-z0-9-]{0,40}[a-z0-9])?$/.test(s);
