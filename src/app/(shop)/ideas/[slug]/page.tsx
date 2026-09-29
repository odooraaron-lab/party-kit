import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GUIDES, getGuide } from '@/lib/guides';
import { LISTINGS } from '@/lib/listings';
import { money } from '@/lib/money';
import { pageMeta, JsonLd, breadcrumbLd, faqLd, SITE, OG_IMAGE } from '@/lib/seo';
import { BRAND } from '@/lib/brand';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return g ? pageMeta(`/ideas/${g.slug}`, g.title, g.description, { openGraph: { type: 'article', title: g.title, description: g.description, url: `/ideas/${g.slug}`, siteName: BRAND.name, locale: 'en_NZ', images: [OG_IMAGE] } }) : {};
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const product = g.product ? LISTINGS.find((l) => l.kind === 'app' && l.id === g.product) : null;
  const others = [...GUIDES.filter((x) => x.slug !== g.slug && x.category === g.category), ...GUIDES.filter((x) => x.category !== g.category)].slice(0, 4);
  const article = {
    '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, description: g.description,
    url: `${SITE}/ideas/${g.slug}`, image: `${SITE}/opengraph-image`,
    author: { '@type': 'Organization', name: BRAND.name }, publisher: { '@type': 'Organization', name: BRAND.name },
  };

  return (
    <>
      <JsonLd data={[article, faqLd(g.faq), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Party ideas', path: '/ideas' }, { name: g.h1, path: `/ideas/${g.slug}` }])]} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/ideas">Party ideas</Link><span aria-hidden="true">/</span><span>{g.kicker}</span>
      </nav>
      <article className="idea">
        <header>
          <span className="guide-kicker">{g.kicker}</span>
          <h1>{g.h1}</h1>
          <p className="guide-lede">{g.intro}</p>
        </header>

        <div className="guide-body">
          <div>
            {g.sections.map((s) => (
              <section key={s.h2}>
                <h2>{s.h2}</h2>
                {s.body.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && <ul className="guide-list">{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
                {s.cta && <Link className="btn btn-accent btn-sm" href={s.cta.href}>{s.cta.label}</Link>}
              </section>
            ))}

            <section>
              <h2>Questions</h2>
              <div className="faq">
                {g.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
              </div>
            </section>
          </div>

          <aside className="guide-side">
            {product && product.kind === 'app' && (
              <div className="guide-product">
                <span className="badge">Instant</span>
                <h3>{product.name}</h3>
                <p className="muted">{product.blurb}</p>
                <p className="guide-price">{money(product.price)} <span className="muted small">one-time</span></p>
                <Link className="btn btn-accent" href={product.href}>Take a look</Link>
              </div>
            )}
            <div className="guide-more-box">
              <b>More party ideas</b>
              {others.map((o) => <Link key={o.slug} href={`/ideas/${o.slug}`}>{o.h1}</Link>)}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
