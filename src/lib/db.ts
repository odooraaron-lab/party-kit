import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// All customer parties and their guest notes.
// Production: Postgres (Neon, via Vercel). Local with no DATABASE_URL: a JSON file in .data/.

export type Settings = {
  name: string; age: string;
  theme: string;                    // the theme bought (read-only; always the party's style)
  text: Record<string, string>;     // host's custom wording (missing keys = default wording)
  music: string; sfx: string; volume: string; ping: string; soundmode: string; fxgap: string;
  gallery: string; uploads: string; // photo wall: guests see the gallery ('on'/'off'); uploads 'open'/'closed'
};
export const DEFAULT_SETTINGS: Settings = {
  name: '', age: '', theme: 'farm', text: {},
  music: 'on', sfx: 'on', volume: '80', ping: '0', soundmode: 'auto', fxgap: '45',
  gallery: 'on', uploads: 'open',
};

export type Product = 'story' | 'photos' | 'slideshow';

export type Party = {
  slug: string;
  product: Product;   // which app this party runs: TV storybook, photo wall or TV slideshow
  childName: string;
  age: number;
  style: string;      // theme bought at purchase — locked, can't be changed later
  email: string;
  sessionId: string;
  hostKey: string;
  settings: Partial<Settings>; // host-edited values (name, birthday, sound…)
  createdAt: string;
  expiresAt: string;
  disabled?: boolean; // turned off from the admin: guests and TV see a "paused" page
};

export type Note = { id: string; text: string; from: string; kind: string; createdAt: number };
export type Photo = { id: string; url: string; thumbUrl: string; from: string; bytes: number; createdAt: number; kind?: 'image' | 'video' };

export type Review = {
  id: string; product: string; name: string; rating: number; text: string;
  email: string; verified: boolean; status: 'pending' | 'approved' | 'rejected'; createdAt: number;
};
export type PublicReview = Pick<Review, 'id' | 'name' | 'rating' | 'text' | 'verified' | 'createdAt'>;

export class SlugTaken extends Error {}
export class SessionExists extends Error {}

interface Store {
  bySlug(slug: string): Promise<Party | null>;
  bySession(sessionId: string): Promise<Party | null>;
  insert(p: Party): Promise<void>; // throws SlugTaken / SessionExists
  updateSettings(slug: string, patch: Partial<Settings>): Promise<void>;
  setDisabled(slug: string, disabled: boolean): Promise<void>;
  setExpiry(slug: string, expiresAt: string): Promise<void>;
  listNotes(slug: string): Promise<Note[]>;
  countNotes(slug: string): Promise<number>;
  addNote(slug: string, n: Note): Promise<void>;
  removeNote(slug: string, id: string): Promise<void>;
  listPhotos(slug: string): Promise<Photo[]>;
  countPhotos(slug: string): Promise<number>;
  addPhoto(slug: string, p: Photo): Promise<void>;
  removePhoto(slug: string, id: string): Promise<Photo | null>;
  expiredParties(limit: number): Promise<Party[]>;
  markCleaned(slug: string): Promise<void>;
  addReview(r: Review): Promise<void>;
  approvedReviews(product: string | null, limit: number): Promise<(PublicReview & { product: string })[]>;
  setReviewStatus(id: string, status: Review['status']): Promise<Review | null>;
  hasPurchased(email: string, product: string): Promise<boolean>;
  addSignup(email: string, topic: string): Promise<boolean>; // false = already signed up
  // TV pairing codes (see tv-pairing.ts). Codes older than `minutes` count as expired.
  addPairing(code: string, device: string, minutes: number): Promise<boolean>; // false = code in use
  pairingForDevice(device: string, minutes: number): Promise<{ slug: string | null } | null>;
  claimPairing(code: string, slug: string, minutes: number): Promise<boolean>;
}

// ── Postgres ────────────────────────────────────────────────
function postgresStore(url: string): Store {
  const sql = neon(url);
  let ready: Promise<unknown> | null = null;
  const init = () =>
    (ready ??= (async () => {
      await sql`CREATE TABLE IF NOT EXISTS parties (
        slug text PRIMARY KEY,
        child_name text NOT NULL,
        age int NOT NULL,
        style text NOT NULL,
        email text NOT NULL,
        session_id text UNIQUE NOT NULL,
        host_key text NOT NULL,
        settings jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS notes (
        id text PRIMARY KEY,
        party_slug text NOT NULL REFERENCES parties(slug) ON DELETE CASCADE,
        text text NOT NULL,
        from_name text NOT NULL DEFAULT '',
        kind text NOT NULL DEFAULT 'wish',
        created_at bigint NOT NULL
      )`;
      await sql`CREATE INDEX IF NOT EXISTS notes_party_idx ON notes (party_slug, created_at)`;
      await sql`ALTER TABLE parties ADD COLUMN IF NOT EXISTS product text NOT NULL DEFAULT 'story'`;
      await sql`ALTER TABLE parties ADD COLUMN IF NOT EXISTS cleaned boolean NOT NULL DEFAULT false`;
      await sql`ALTER TABLE parties ADD COLUMN IF NOT EXISTS disabled boolean NOT NULL DEFAULT false`;
      await sql`CREATE TABLE IF NOT EXISTS photos (
        id text PRIMARY KEY,
        party_slug text NOT NULL REFERENCES parties(slug) ON DELETE CASCADE,
        url text NOT NULL,
        thumb_url text NOT NULL,
        from_name text NOT NULL DEFAULT '',
        bytes int NOT NULL DEFAULT 0,
        created_at bigint NOT NULL
      )`;
      await sql`CREATE INDEX IF NOT EXISTS photos_party_idx ON photos (party_slug, created_at)`;
      await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'image'`;
      await sql`CREATE TABLE IF NOT EXISTS reviews (
        id text PRIMARY KEY, product text NOT NULL, name text NOT NULL, rating int NOT NULL,
        text text NOT NULL, email text NOT NULL, verified boolean NOT NULL DEFAULT false,
        status text NOT NULL DEFAULT 'pending', created_at bigint NOT NULL
      )`;
      await sql`CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews (product, status, created_at)`;
      await sql`CREATE TABLE IF NOT EXISTS tv_pairings (
        code text PRIMARY KEY, device text UNIQUE NOT NULL, slug text, created_at timestamptz NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS signups (
        email text NOT NULL, topic text NOT NULL, created_at bigint NOT NULL, PRIMARY KEY (email, topic)
      )`;
    })().catch((e) => { ready = null; throw e; }));
  const party = (r: Record<string, unknown> | undefined): Party | null =>
    r
      ? {
          slug: r.slug as string, product: ((r.product as Product) ?? 'story'), childName: r.child_name as string, age: Number(r.age), style: r.style as string,
          email: r.email as string, sessionId: r.session_id as string, hostKey: r.host_key as string,
          settings: (r.settings as Partial<Settings>) ?? {},
          createdAt: new Date(r.created_at as string).toISOString(), expiresAt: new Date(r.expires_at as string).toISOString(),
          disabled: Boolean(r.disabled),
        }
      : null;
  return {
    async bySlug(slug) { await init(); return party((await sql`SELECT * FROM parties WHERE slug = ${slug}`)[0]); },
    async bySession(id) { await init(); return party((await sql`SELECT * FROM parties WHERE session_id = ${id}`)[0]); },
    async insert(p) {
      await init();
      try {
        await sql`INSERT INTO parties (slug, product, child_name, age, style, email, session_id, host_key, settings, created_at, expires_at)
          VALUES (${p.slug}, ${p.product}, ${p.childName}, ${p.age}, ${p.style}, ${p.email}, ${p.sessionId}, ${p.hostKey},
                  ${JSON.stringify(p.settings)}::jsonb, ${p.createdAt}, ${p.expiresAt})`;
      } catch (e) {
        const msg = String((e as Error).message);
        if (msg.includes('session_id')) throw new SessionExists();
        if (msg.includes('duplicate key') || msg.includes('parties_pkey')) throw new SlugTaken();
        throw e;
      }
    },
    async updateSettings(slug, patch) {
      await init();
      await sql`UPDATE parties SET settings = settings || ${JSON.stringify(patch)}::jsonb WHERE slug = ${slug}`;
    },
    async setDisabled(slug, disabled) {
      await init();
      await sql`UPDATE parties SET disabled = ${disabled} WHERE slug = ${slug}`;
    },
    async setExpiry(slug, expiresAt) {
      await init();
      await sql`UPDATE parties SET expires_at = ${expiresAt} WHERE slug = ${slug}`;
    },
    async listNotes(slug) {
      await init();
      const rows = await sql`SELECT id, text, from_name, kind, created_at FROM notes WHERE party_slug = ${slug} ORDER BY created_at ASC`;
      return rows.map((x) => ({ id: x.id, text: x.text, from: x.from_name, kind: x.kind, createdAt: Number(x.created_at) }));
    },
    async countNotes(slug) {
      await init();
      return Number((await sql`SELECT count(*)::int AS n FROM notes WHERE party_slug = ${slug}`)[0].n);
    },
    async addNote(slug, n) {
      await init();
      await sql`INSERT INTO notes (id, party_slug, text, from_name, kind, created_at) VALUES (${n.id}, ${slug}, ${n.text}, ${n.from}, ${n.kind}, ${n.createdAt})`;
    },
    async removeNote(slug, id) {
      await init();
      await sql`DELETE FROM notes WHERE party_slug = ${slug} AND id = ${id}`;
    },
    async listPhotos(slug) {
      await init();
      const rows = await sql`SELECT * FROM photos WHERE party_slug = ${slug} ORDER BY created_at ASC`;
      return rows.map((x) => ({ id: x.id, url: x.url, thumbUrl: x.thumb_url, from: x.from_name, bytes: Number(x.bytes), createdAt: Number(x.created_at), kind: x.kind }));
    },
    async countPhotos(slug) {
      await init();
      return Number((await sql`SELECT count(*)::int AS n FROM photos WHERE party_slug = ${slug}`)[0].n);
    },
    async addPhoto(slug, p) {
      await init();
      await sql`INSERT INTO photos (id, party_slug, url, thumb_url, from_name, bytes, created_at, kind)
        VALUES (${p.id}, ${slug}, ${p.url}, ${p.thumbUrl}, ${p.from}, ${p.bytes}, ${p.createdAt}, ${p.kind ?? 'image'})`;
    },
    async removePhoto(slug, id) {
      await init();
      const rows = await sql`DELETE FROM photos WHERE party_slug = ${slug} AND id = ${id} RETURNING *`;
      const x = rows[0];
      return x ? { id: x.id, url: x.url, thumbUrl: x.thumb_url, from: x.from_name, bytes: Number(x.bytes), createdAt: Number(x.created_at), kind: x.kind } : null;
    },
    async expiredParties(limit) {
      await init();
      const rows = await sql`SELECT * FROM parties WHERE expires_at < now() AND cleaned = false ORDER BY expires_at LIMIT ${limit}`;
      return rows.map((r) => party(r)!);
    },
    async markCleaned(slug) {
      await init();
      await sql`UPDATE parties SET cleaned = true WHERE slug = ${slug}`;
    },
    async addReview(x) {
      await init();
      await sql`INSERT INTO reviews (id, product, name, rating, text, email, verified, status, created_at)
        VALUES (${x.id}, ${x.product}, ${x.name}, ${x.rating}, ${x.text}, ${x.email}, ${x.verified}, ${x.status}, ${x.createdAt})`;
    },
    async approvedReviews(product, limit) {
      await init();
      const rows = product
        ? await sql`SELECT * FROM reviews WHERE status = 'approved' AND product = ${product} ORDER BY created_at DESC LIMIT ${limit}`
        : await sql`SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT ${limit}`;
      return rows.map((x) => ({ id: x.id, product: x.product, name: x.name, rating: Number(x.rating), text: x.text, verified: Boolean(x.verified), createdAt: Number(x.created_at) }));
    },
    async setReviewStatus(id, status) {
      await init();
      const x = (await sql`UPDATE reviews SET status = ${status} WHERE id = ${id} RETURNING *`)[0];
      return x ? { id: x.id, product: x.product, name: x.name, rating: Number(x.rating), text: x.text, email: x.email, verified: Boolean(x.verified), status: x.status, createdAt: Number(x.created_at) } : null;
    },
    async hasPurchased(email, product) {
      await init();
      return (await sql`SELECT 1 FROM parties WHERE lower(email) = lower(${email}) AND product = ${product} LIMIT 1`).length > 0;
    },
    async addSignup(email, topic) {
      await init();
      const rows = await sql`INSERT INTO signups (email, topic, created_at) VALUES (lower(${email}), ${topic}, ${Date.now()}) ON CONFLICT DO NOTHING RETURNING email`;
      return rows.length > 0;
    },
    async addPairing(code, device, minutes) {
      await init();
      await sql`DELETE FROM tv_pairings WHERE created_at < now() - make_interval(mins => ${minutes})`;
      return (await sql`INSERT INTO tv_pairings (code, device) VALUES (${code}, ${device}) ON CONFLICT DO NOTHING RETURNING code`).length > 0;
    },
    async pairingForDevice(device, minutes) {
      await init();
      const r = (await sql`SELECT slug FROM tv_pairings WHERE device = ${device}
        AND (slug IS NOT NULL OR created_at > now() - make_interval(mins => ${minutes}))`)[0];
      return r ? { slug: (r.slug as string | null) ?? null } : null;
    },
    async claimPairing(code, slug, minutes) {
      await init();
      return (await sql`UPDATE tv_pairings SET slug = ${slug}
        WHERE code = ${code} AND slug IS NULL AND created_at > now() - make_interval(mins => ${minutes}) RETURNING code`).length > 0;
    },
  };
}

// ── Local JSON file (development only) ──────────────────────
type Pairing = { code: string; device: string; slug: string | null; createdAt: number };
type FileData = { parties: (Party & { cleaned?: boolean })[]; notes: (Note & { slug: string })[]; photos: (Photo & { slug: string })[]; reviews: Review[]; signups: { email: string; topic: string; createdAt: number }[]; pairings: Pairing[] };
function fileStore(): Store {
  const file = path.join(process.cwd(), '.data', 'store.json');
  const load = async (): Promise<FileData> => {
    const d = JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}'));
    return { parties: (d.parties ?? []).map((p: Party) => ({ ...p, product: p.product ?? 'story' })), notes: d.notes ?? [], photos: d.photos ?? [], reviews: d.reviews ?? [], signups: d.signups ?? [], pairings: d.pairings ?? [] };
  };
  const save = async (d: FileData) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(d, null, 2));
  };
  return {
    async bySlug(slug) { return (await load()).parties.find((p) => p.slug === slug) ?? null; },
    async bySession(id) { return (await load()).parties.find((p) => p.sessionId === id) ?? null; },
    async insert(p) {
      const d = await load();
      if (d.parties.some((x) => x.sessionId === p.sessionId)) throw new SessionExists();
      if (d.parties.some((x) => x.slug === p.slug)) throw new SlugTaken();
      d.parties.push(p);
      await save(d);
    },
    async updateSettings(slug, patch) {
      const d = await load();
      const p = d.parties.find((x) => x.slug === slug);
      if (p) { p.settings = { ...p.settings, ...patch }; await save(d); }
    },
    async setDisabled(slug, disabled) {
      const d = await load();
      const p = d.parties.find((x) => x.slug === slug);
      if (p) { p.disabled = disabled; await save(d); }
    },
    async setExpiry(slug, expiresAt) {
      const d = await load();
      const p = d.parties.find((x) => x.slug === slug);
      if (p) { p.expiresAt = expiresAt; await save(d); }
    },
    async listNotes(slug) {
      return (await load()).notes.filter((n) => n.slug === slug).sort((a, b) => a.createdAt - b.createdAt)
        .map(({ slug: _s, ...n }) => n);
    },
    async countNotes(slug) { return (await load()).notes.filter((n) => n.slug === slug).length; },
    async addNote(slug, n) { const d = await load(); d.notes.push({ ...n, slug }); await save(d); },
    async removeNote(slug, id) {
      const d = await load();
      d.notes = d.notes.filter((n) => !(n.slug === slug && n.id === id));
      await save(d);
    },
    async listPhotos(slug) {
      return (await load()).photos.filter((p) => p.slug === slug).sort((a, b) => a.createdAt - b.createdAt)
        .map(({ slug: _s, ...p }) => p);
    },
    async countPhotos(slug) { return (await load()).photos.filter((p) => p.slug === slug).length; },
    async addPhoto(slug, p) { const d = await load(); d.photos.push({ ...p, slug }); await save(d); },
    async removePhoto(slug, id) {
      const d = await load();
      const found = d.photos.find((p) => p.slug === slug && p.id === id) ?? null;
      d.photos = d.photos.filter((p) => p !== found);
      await save(d);
      return found;
    },
    async expiredParties(limit) {
      return (await load()).parties.filter((p) => !p.cleaned && new Date(p.expiresAt).getTime() < Date.now()).slice(0, limit);
    },
    async markCleaned(slug) {
      const d = await load();
      const p = d.parties.find((x) => x.slug === slug);
      if (p) { p.cleaned = true; await save(d); }
    },
    async addReview(x) { const d = await load(); d.reviews.push(x); await save(d); },
    async approvedReviews(product, limit) {
      return (await load()).reviews.filter((x) => x.status === 'approved' && (!product || x.product === product))
        .sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
        .map(({ id, product: p, name, rating, text, verified, createdAt }) => ({ id, product: p, name, rating, text, verified, createdAt }));
    },
    async setReviewStatus(id, status) {
      const d = await load();
      const x = d.reviews.find((r) => r.id === id);
      if (!x) return null;
      x.status = status; await save(d); return x;
    },
    async hasPurchased(email, product) {
      return (await load()).parties.some((p) => p.email.toLowerCase() === email.toLowerCase() && p.product === product);
    },
    async addSignup(email, topic) {
      const d = await load();
      const e = email.toLowerCase();
      if (d.signups.some((x) => x.email === e && x.topic === topic)) return false;
      d.signups.push({ email: e, topic, createdAt: Date.now() }); await save(d); return true;
    },
    async addPairing(code, device, minutes) {
      const d = await load();
      const cutoff = Date.now() - minutes * 60_000;
      d.pairings = d.pairings.filter((x) => x.createdAt > cutoff);
      if (d.pairings.some((x) => x.code === code)) return false;
      d.pairings.push({ code, device, slug: null, createdAt: Date.now() }); await save(d); return true;
    },
    async pairingForDevice(device, minutes) {
      const x = (await load()).pairings.find((p) => p.device === device);
      if (!x || (!x.slug && x.createdAt < Date.now() - minutes * 60_000)) return null;
      return { slug: x.slug };
    },
    async claimPairing(code, slug, minutes) {
      const d = await load();
      const x = d.pairings.find((p) => p.code === code && !p.slug && p.createdAt > Date.now() - minutes * 60_000);
      if (!x) return false;
      x.slug = slug; await save(d); return true;
    },
  };
}

let store: Store | null = null;
export function db(): Store {
  if (store) return store;
  if (process.env.DATABASE_URL) return (store = postgresStore(process.env.DATABASE_URL));
  if (process.env.VERCEL) throw new Error('DATABASE_URL is not set');
  return (store = fileStore());
}

// Settings as the TV/host/guest pages expect them: defaults ← purchase details ← host edits.
export function settingsFor(p: Party): Settings {
  // The theme is locked to what was bought, whatever is in settings.
  return { ...DEFAULT_SETTINGS, name: p.childName, ...p.settings, theme: p.style, age: String(p.age), text: { ...(p.settings.text ?? {}) } };
}
