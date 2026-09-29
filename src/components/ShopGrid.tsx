import Link from 'next/link';
import { LISTINGS, type Listing, type AppListing, type StockListing } from '@/lib/listings';
import { money } from '@/lib/money';
import { THEMES } from '@/lib/story';
import { PHOTO_THEMES } from '@/lib/photo-config';
import type { CastArt } from '@/lib/cast';
import { ThemePreview } from './ThemePreview';
import { PhotoPreview } from './PhotoPreview';
import { ProductImage } from './ProductImage';

// The shop: instant apps mixed in with stock listings. Apps are wider and
// marked "Instant" so they stand out without being walled off from the rest.
export function ShopGrid({ casts, listings = LISTINGS }: { casts: Record<string, CastArt>; listings?: Listing[] }) {
  return (
    <div className={`shop-grid${listings.every((l) => l.kind === 'app') ? ' apps-only' : ''}`}>
      {listings.map((l) => (l.kind === 'app' ? <AppTile key={l.id} l={l} casts={casts} /> : <StockTile key={l.id} l={l} />))}
    </div>
  );
}

function AppScreen({ id, casts }: { id: 'story' | 'photos' | 'slideshow'; casts: Record<string, CastArt> }) {
  if (id === 'story') { const t = THEMES.find((x) => x.id === 'safari') ?? THEMES[0]; return <ThemePreview theme={t} art={casts[t.id]} name="Ari" />; }
  if (id === 'photos') return <PhotoPreview theme={PHOTO_THEMES[0]} name="Sam's 40th" />;
  return <div className="ss-preview"><span>Happy 50th, Dad</span></div>;
}

function AppTile({ l, casts }: { l: AppListing; casts: Record<string, CastArt> }) {
  return (
    <Link href={l.href} className="tile tile-app">
      <div className="tile-visual tile-visual-app">
        <div className="mini-tv"><AppScreen id={l.id} casts={casts} /></div>
      </div>
      <div className="tile-body">
        <div className="tile-badges"><span className="badge-instant">Instant</span><span className="badge-soft">{l.tag}</span></div>
        <h3>{l.name}</h3>
        <p>{l.blurb}</p>
        <div className="tile-foot"><b>{money(l.price)}</b><span className="tile-cta">See how it works</span></div>
      </div>
    </Link>
  );
}

function StockTile({ l }: { l: StockListing }) {
  const label = l.status === 'sold-out' ? 'Sold out' : 'Coming soon';
  const body = (
    <>
      <div className="tile-visual"><ProductImage listing={l} /><span className="badge-status">{label}</span></div>
      <div className="tile-body">
        <h3>{l.name}</h3>
        <p>{l.blurb}</p>
        <div className="tile-foot"><b>{money(l.price)}</b></div>
      </div>
    </>
  );
  return <Link href={`/products/${l.id}`} className="tile tile-stock">{body}</Link>;
}
