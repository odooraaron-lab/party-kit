import Link from 'next/link';
import { GUIDES } from '@/lib/guides';
import { pageMeta, JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata = pageMeta(
  '/ideas',
  'Party Ideas: Kids Parties, QR Photo Sharing & Party TV Screens',
  'Easy party ideas from NZ: kids birthday party ideas, QR code photo sharing, party TV screens and slideshows, and what to put in a kids party pack.',
);

export default function IdeasPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Party ideas', path: '/ideas' }])} />
      <section className="section guide-index">
        <span className="guide-kicker">Party ideas</span>
        <h1>Party ideas that get everyone involved</h1>
        <p className="muted guide-lede">Simple, practical ideas for kids’ birthdays, big birthdays and everything in between, from parents in New Zealand.</p>
        <div className="guide-grid">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/ideas/${g.slug}`} className="guide-card">
              <span className="guide-kicker">{g.kicker}</span>
              <h2>{g.h1}</h2>
              <p className="muted">{g.description}</p>
              <span className="guide-more">Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
