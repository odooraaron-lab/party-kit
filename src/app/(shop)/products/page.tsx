import { BRAND } from '@/lib/brand';
import { loadCasts } from '@/lib/cast';
import { ShopGrid } from '@/components/ShopGrid';

export const metadata = { title: `All products — ${BRAND.name}` };

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
