import { pageMeta } from '@/lib/seo';
import { loadCasts } from '@/lib/cast';
import { ShopGrid } from '@/components/ShopGrid';

export const metadata = pageMeta('/products', 'Party Apps for the TV NZ', 'Instant party apps for the TV: a birthday storybook, a live party photo wall and a TV slideshow. Made in New Zealand.');

export default function Products() {
  return (
    <section className="section">
      <div className="shop-head">
        <h1 style={{ fontSize: 44 }}>All products</h1>
        <p className="muted">Instant party apps, ready the moment you pay.</p>
      </div>
      <ShopGrid casts={loadCasts()} />
    </section>
  );
}
