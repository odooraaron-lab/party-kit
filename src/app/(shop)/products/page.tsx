import { pageMeta } from '@/lib/seo';
import { loadCasts } from '@/lib/cast';
import { ShopGrid } from '@/components/ShopGrid';

export const metadata = pageMeta('/products', 'Party Supplies & Kids Party Packs NZ', 'Instant party apps for the TV plus kids party packs, decorations, candles and party bag fillers. Made in New Zealand.');

export default function Products() {
  return (
    <section className="section">
      <div className="shop-head">
        <h1 style={{ fontSize: 44 }}>All products</h1>
        <p className="muted">Instant party apps are ready the moment you pay. Packs and decorations are back soon.</p>
      </div>
      <ShopGrid casts={loadCasts()} />
    </section>
  );
}
