import { existsSync } from 'node:fs';
import path from 'node:path';
import type { StockListing } from '@/lib/listings';
import { ProductArt } from './ProductArt';

// A real product photo if there is one, otherwise the illustration.
// To add a photo, save it as public/images/products/<product id>.jpg (or .webp / .png),
// e.g. balloon-kit.jpg. Use photos of your own products, landscape, about 1200x720.
const EXTS = ['webp', 'jpg', 'jpeg', 'png'];
const cache = new Map<string, string | null>();

export function productPhoto(id: string): string | null {
  if (!cache.has(id) || process.env.NODE_ENV !== 'production') {
    const ext = EXTS.find((e) => existsSync(path.join(process.cwd(), 'public', 'images', 'products', `${id}.${e}`)));
    cache.set(id, ext ? `/images/products/${id}.${ext}` : null);
  }
  return cache.get(id)!;
}

export function ProductImage({ listing }: { listing: Pick<StockListing, 'id' | 'name' | 'art' | 'bg'> }) {
  const photo = productPhoto(listing.id);
  // eslint-disable-next-line @next/next/no-img-element
  return photo ? <img className="product-photo" src={photo} alt={listing.name} loading="lazy" /> : <ProductArt kind={listing.art} bg={listing.bg} />;
}
