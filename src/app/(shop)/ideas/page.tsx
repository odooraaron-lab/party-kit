import Link from 'next/link';
import { GUIDES, CATEGORIES } from '@/lib/guides';
import { pageMeta, JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata = pageMeta(
  '/ideas',
  'Party Ideas: 21sts, Work Christmas Parties, Kids Parties & QR Photos',
  'Party ideas from NZ: photos on the TV at bars and function venues, 21sts, weddings, work Christmas parties, kids birthday ideas and QR code photo sharing.',
);

export default function IdeasPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Party ideas', path: '/ideas' }])} />
      <section className="section guide-index">
        <span className="guide-kicker">Party ideas</span>
        <h1>Party ideas that get everyone involved</h1>
        <p className="muted guide-lede">Simple, practical ideas for kids’ birthdays, 21sts, work dos and everything in between, from parents in New Zealand.</p>
        {CATEGORIES.map((c) => (
          <div key={c.id} className="guide-cat">
            <h2 className="guide-cat-title">{c.name}</h2>
            <p className="muted">{c.blurb}</p>
            <div className="guide-grid">
              {GUIDES.filter((g) => g.category === c.id).map((g) => (
                <Link key={g.slug} href={`/ideas/${g.slug}`} className="guide-card">
                  <span className="guide-kicker">{g.kicker}</span>
                  <h3>{g.h1}</h3>
                  <p className="muted">{g.description}</p>
                  <span className="guide-more">Read the guide →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
