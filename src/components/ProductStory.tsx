import type { ReactNode } from 'react';
import { money } from '@/lib/money';
import { MobileBuyBar } from '@/components/MobileBuyBar';
import { ReviewsSection, RatingBadge } from './Reviews';

export type Stat = { value: string; label: string };
export type Step = { title: string; text: string };
export type Reason = { title: string; text: string };

// The landing layout every instant product shares: the idea, the party scene,
// how it works, why it gets people involved, fun numbers, then the order form.
export function ProductStory(props: {
  tag: string; title: string; pitch: string; price: number; priceNote?: string;
  scene: ReactNode; steps: Step[]; reasons: Reason[]; stats: Stat[]; includes: string[];
  orderTitle: string; children: ReactNode; reviewId: string; productName: string;
  feature?: ReactNode; // optional section right under the hero (e.g. a video)
  afterStats?: ReactNode; // optional section after the numbers (e.g. the printable storybook)
}) {
  return (
    <>
      <section className="ps-hero">
        <div className="ps-hero-copy">
          <span className="ps-tag">{props.tag}</span>
          <h1>{props.title}</h1>
          <RatingBadge product={props.reviewId} />
          <p>{props.pitch}</p>
          <div className="actions">
            <a href="#order" className="btn btn-accent">Make yours · {money(props.price)}</a>
            <a href="#how" className="btn btn-outline">How it works</a>
          </div>
          <p className="muted small">{props.priceNote ?? 'One-time payment. Ready the moment you pay.'}</p>
        </div>
        <div className="ps-hero-scene">{props.scene}</div>
      </section>

      {props.feature}

      <section className="section" id="how">
        <h2>How it works</h2>
        <ol className="steps">
          {props.steps.map((s) => <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>)}
        </ol>
      </section>

      <section className="section">
        <h2>Why it gets everyone involved</h2>
        <div className="reasons m-swipe">
          {props.reasons.map((r) => <div key={r.title} className="reason"><b>{r.title}</b><p>{r.text}</p></div>)}
        </div>
      </section>

      <section className="ps-stats" aria-label="By the numbers">
        {props.stats.map((s) => (
          <div key={s.label} className="ps-stat"><span className="ps-stat-value">{s.value}</span><span className="ps-stat-label">{s.label}</span></div>
        ))}
      </section>

      {props.afterStats}

      <section className="section">
        <h2>What you get</h2>
        <ul className="ticks ps-includes">{props.includes.map((i) => <li key={i}>{i}</li>)}</ul>
      </section>

      <section className="section ps-order" id="order">
        <h2>{props.orderTitle}</h2>
        {props.children}
      </section>

      <ReviewsSection product={props.reviewId} productName={props.productName} />
      <MobileBuyBar title={`${props.productName}`} note={`${money(props.price)} one-time · ready instantly`} href="#order" label={`Make yours`} hideOn="#order" />
    </>
  );
}
