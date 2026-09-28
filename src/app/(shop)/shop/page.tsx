import { BRAND } from '@/lib/brand';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/catalog';
import { money } from '@/lib/money';

export const metadata = { title: 'Shop', alternates: { canonical: '/products' } };

export default function Shop() {
  const packs = PRODUCTS.filter((p) => p.kind === 'pack');
  const digital = PRODUCTS.filter((p) => p.kind === 'digital');
  const Card = ({ p }: { p: (typeof PRODUCTS)[number] }) => (
    <Link href={`/packs/${p.id}`} className="card">
      <h3>{p.name}</h3>
      <span className="price">{money(p.price)}</span>
      <span className="muted">{p.blurb}</span>
    </Link>
  );
  return (
    <>
      <section className="section">
        <h2>Party packs</h2>
        <div className="grid">{packs.map((p) => <Card key={p.id} p={p} />)}</div>
      </section>
      <section className="section" id="printables">
        <h2>Printables &amp; apps</h2>
        <div className="grid">{digital.map((p) => <Card key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}
