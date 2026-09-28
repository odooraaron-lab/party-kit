import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMeta, JsonLd, productLd, breadcrumbLd } from '@/lib/seo';
import { STOCK, getStock, findListing, listingHref } from '@/lib/listings';
import { money } from '@/lib/money';
import { ProductArt } from '@/components/ProductArt';
import { SignupForm } from '@/components/SignupForm';
import { ReviewsSection, RatingBadge } from '@/components/Reviews';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return STOCK.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getStock((await params).id);
  return p ? pageMeta(`/products/${p.id}`, `${p.name}: ${p.category} for Kids Parties NZ`, p.blurb) : {};
}

export default async function StockProductPage({ params }: Props) {
  const p = getStock((await params).id);
  if (!p) notFound();
  const soldOut = p.status === 'sold-out';
  const related = p.related.map(findListing).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLd data={[
        productLd({ name: p.name, description: p.blurb, path: `/products/${p.id}`, price: p.price, category: p.category, available: soldOut ? 'OutOfStock' : 'PreOrder' }),
        breadcrumbLd([{ name: 'Shop', path: '/products' }, { name: p.name, path: `/products/${p.id}` }]),
      ]} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/products">Shop</Link><span aria-hidden="true">/</span><span>{p.category}</span>
      </nav>

      <section className="sp-hero">
        <div className="sp-art">
          <ProductArt kind={p.art} bg={p.bg} />
          <span className="badge-status">{soldOut ? 'Sold out' : 'Coming soon'}</span>
        </div>
        <div className="sp-info">
          <span className="ps-tag">{p.category}</span>
          <h1>{p.name}</h1>
          <RatingBadge product={p.id} />
          <div className="sp-price">{money(p.price)}</div>
          <p className="sp-status"><span className="dot" aria-hidden="true" />{soldOut ? 'Sold out. More on the way.' : 'Coming soon. Be first in line.'}</p>
          <p className="sp-desc">{p.description}</p>
          <div className="sp-notify">
            <b>Tell me when it’s {soldOut ? 'back' : 'here'}</b>
            <SignupForm topic={`restock:${p.id}`} button="Notify me" note="One email when it’s available. Nothing else." />
          </div>
        </div>
      </section>

      <section className="section sp-columns">
        <div>
          <h2>What’s included</h2>
          <ul className="ticks">{p.includes.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
        <div>
          <h2>Details</h2>
          <dl className="sp-details">
            {p.details.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section">
        <h2>Pairs well with</h2>
        <div className="related">
          {related.map((r) => (
            <Link key={r.id} href={listingHref(r)} className="related-card">
              {r.kind === 'stock' ? <ProductArt kind={r.art} bg={r.bg} /> : <div className="related-app"><span className="badge-instant">Instant</span><span>Ready the moment you pay</span></div>}
              <div className="related-body"><b>{r.name}</b><span className="muted small">{money(r.price)}{r.kind === 'stock' ? (r.status === 'sold-out' ? ' · Sold out' : ' · Coming soon') : ''}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <ReviewsSection product={p.id} productName={p.name} />
    </>
  );
}
