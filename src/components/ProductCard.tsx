import Link from 'next/link';
import { money } from '@/lib/money';

export function ProductCard({ href, name, price, blurb, soldOut }: { href?: string; name: string; price: number; blurb: string; soldOut?: boolean }) {
  const body = (
    <>
      <div className="row"><h3>{name}</h3>{soldOut && <span className="badge">Sold out</span>}</div>
      <span className="price">{money(price)}</span>
      <span className="muted">{blurb}</span>
    </>
  );
  return soldOut || !href ? (
    <div className="card card-soldout" aria-disabled="true">{body}</div>
  ) : (
    <Link href={href} className="card card-live">{body}</Link>
  );
}
