import Link from 'next/link';
import { MobileBuyBar } from '@/components/MobileBuyBar';
import { THEMES } from '@/lib/story';
import { APPS } from '@/lib/listings';
import { money } from '@/lib/money';
import { loadCasts } from '@/lib/cast';
import { BRAND } from '@/lib/brand';
import { PartyScene } from '@/components/PartyScene';
import { ThemePreview } from '@/components/ThemePreview';
import { ShopGrid } from '@/components/ShopGrid';
import { LatestReviews } from '@/components/Reviews';
import { SignupForm } from '@/components/SignupForm';
import { LogoMark } from '@/components/Logo';
import { pageMeta, JsonLd, organizationLd, faqLd, SITE } from '@/lib/seo';
import { GUIDES } from '@/lib/guides';
import { BRAND as B } from '@/lib/brand';

export const metadata = pageMeta(
  '/',
  `${B.name}: Party Photos on the TV, QR Code Photo Sharing & Kids Party Ideas`,
  'Put party photos on any TV, at home or at a bar or function venue. Guests scan a QR code and photos pop up live. 21sts, weddings, work Christmas parties, kids parties. NZ.',
  { title: { absolute: `${B.name}: Party Photos on the TV, QR Code Photo Sharing & Kids Party Ideas` } },
);

const FAQ: [string, string][] = [
  ['What are the “Instant” products?', 'Party apps that are ready the moment you pay: your own web address, a link for the TV, and everything else by email. Nothing to post, nothing to install.'],
  ['Do guests need to download an app?', 'No. For the storybook and photo wall, guests point their phone camera at a QR code and a page opens. That’s it.'],
  ['Can I use it at a bar, restaurant or function venue?', 'Yes. Open your link on the venue’s TV (any TV with a web browser, Chromecast or streaming stick). No laptop, USB stick or AV hire needed. Check with the venue when you book.'],
  ['What do I need on the day?', 'A TV with a web browser (most smart TVs have one), or a laptop plugged into the TV. Casting from a laptop works too. And Wi-Fi.'],
  ['Is it a subscription?', 'No. Every product is a one-time payment.'],
  ['Can I change my theme after buying?', 'Themes are made for your party when you buy, so pick the one you love. You can preview every theme first.'],
];

const COMPARE: { id: string; best: string; guests: string; keep: string }[] = [
  { id: 'story', best: 'Kids’ birthdays', guests: 'Scan and write a birthday message', keep: 'A printable storybook PDF of every message' },
  { id: 'photos', best: 'Grown-up parties and big nights', guests: 'Scan and add their photos', keep: 'Every photo, in one zip' },
  { id: 'slideshow', best: 'Milestones, anniversaries, farewells', guests: 'Just watch. You upload ahead of time', keep: 'Your slideshow, playing for two months' },
];

export default function Home() {
  const casts = loadCasts();
  const hero = THEMES.find((t) => t.id === 'ocean') ?? THEMES[0];
  return (
    <>
      <section className="home-hero home-hero-compact">
        <div className="home-hero-copy">
          <h1>Party ideas that run themselves.</h1>
          <p>Put the party on the big screen. Guests scan a QR code and their messages and photos pop up on your TV. Ready the moment you pay.</p>
          <div className="actions">
            <a href="#shop" className="btn btn-accent">Shop the party</a>
            <a href="#which" className="btn btn-outline">Which one is for me?</a>
          </div>
        </div>
        <PartyScene crowd="kids" label="Kids and grown-ups cheering at a birthday storybook on the TV">
          <ThemePreview theme={hero} art={casts[hero.id]} name="Ari" />
        </PartyScene>
      </section>

      <ul className="trust" aria-label="Why shop with us">
        <li><b>One-time payment</b><span>No subscriptions</span></li>
        <li><b>No app for guests</b><span>Just their phone camera</span></li>
        <li><b>Ready instantly</b><span>Links by email the moment you pay</span></li>
        <li><b>Secure checkout</b><span>Card, Apple Pay and Google Pay via Stripe</span></li>
        <li><b>Made in New Zealand</b><span>Prices in NZD</span></li>
      </ul>

      <section className="section" id="shop">
        <div className="shop-head">
          <h2>Shop the party</h2>
          <p className="muted">Three instant party apps, ready the moment you pay.</p>
        </div>
        <ShopGrid casts={casts} />
      </section>

      <section className="section" id="which">
        <h2>Which one is right for your party?</h2>
        <div className="compare m-swipe">
          {COMPARE.map((c) => {
            const app = APPS.find((a) => a.id === c.id)!;
            return (
              <div key={c.id} className="compare-card">
                <span className="badge-soft">{app.tag}</span>
                <h3>{app.name}</h3>
                <dl>
                  <div><dt>Best for</dt><dd>{c.best}</dd></div>
                  <div><dt>Guests</dt><dd>{c.guests}</dd></div>
                  <div><dt>You keep</dt><dd>{c.keep}</dd></div>
                </dl>
                <div className="compare-foot"><b>{money(app.price)}</b><Link href={app.href} className="btn btn-dark btn-sm">Take a look</Link></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section venue-band" id="venues">
        <div className="venue-band-in">
          <div>
            <span className="badge-soft">21sts · weddings · work dos</span>
            <h2>Having it at a bar or function venue?</h2>
            <p className="muted">Skip the laptop on a chair, the USB stick the TV won’t read, and the venue’s screen system only staff can run. Your Wishcast link plays on the venue’s TVs from any web browser, and guests add photos with a QR code.</p>
            <div className="venue-links m-chips">
              <Link href="/ideas/display-photos-on-tv-at-venue">Photos on a venue TV</Link>
              <Link href="/ideas/21st-birthday-photo-slideshow">21st ideas</Link>
              <Link href="/ideas/work-christmas-party-ideas">Work Christmas parties</Link>
              <Link href="/ideas/wedding-qr-code-photo-sharing">Weddings</Link>
              <Link href="/ideas/corporate-event-photo-sharing">Corporate events</Link>
            </div>
          </div>
          <Link className="btn btn-accent" href="/photo-wall">See the Party Photo Wall</Link>
        </div>
      </section>

      <section className="section" id="how">
        <h2>From checkout to party in three steps</h2>
        <ol className="steps">
          <li><b>Choose and personalise</b><span>Pick a product, add a name or title, and choose a theme or web address.</span></li>
          <li><b>Get your link straight away</b><span>Your party site goes live the moment you pay. The links, QR cards and a setup guide land in your inbox.</span></li>
          <li><b>Put it on the TV</b><span>Open the link on the TV. Guests scan, and the party fills the screen.</span></li>
        </ol>
      </section>

      <LatestReviews />

      <section className="section home-about">
        <div className="home-about-card">
          <LogoMark size={72} />
          <div>
            <h2>Made by parents in New Zealand</h2>
            <p className="muted">When we hosted our own kids’ party, we couldn’t find anything that got every guest joining in, so we made it. Now we make party ideas that get everyone involved, from Nana to the shyest six-year-old.</p>
            <Link href="/contact#about" className="tile-cta">Read our story</Link>
          </div>
        </div>
        <div className="home-news">
          <h2>Party ideas in your inbox</h2>
          <p className="muted">New themes, party tips and first dibs on new ideas. About once a month.</p>
          <SignupForm topic="news" button="Sign me up" note={`Unsubscribe any time. We never share your email.`} />
        </div>
      </section>

      <section className="section">
        <div className="shop-head"><h2>Party ideas and guides</h2><Link href="/ideas" className="muted">All party ideas →</Link></div>
        <div className="guide-grid m-swipe" style={{ marginTop: 0 }}>
          {['display-photos-on-tv-at-venue', 'kids-birthday-party-ideas', 'qr-code-party-ideas'].map((s) => GUIDES.find((x) => x.slug === s)!).map((g) => (
            <Link key={g.slug} href={`/ideas/${g.slug}`} className="guide-card">
              <span className="guide-kicker">{g.kicker}</span>
              <h3 style={{ fontSize: 22, fontWeight: 800 }}>{g.h1}</h3>
              <span className="guide-more">Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <JsonLd data={[organizationLd(), { '@context': 'https://schema.org', '@type': 'WebSite', name: B.name, url: SITE }, faqLd(FAQ)]} />
      <section className="section" id="faq">
        <h2>Questions parents ask</h2>
        <div className="faq">
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
        <p className="muted" style={{ marginTop: 18 }}>Still wondering? <Link href="/contact">Get in touch</Link> — {BRAND.name} is a small team and we read every message.</p>
      </section>
      <MobileBuyBar title="Party apps from $19" note="One-time · ready the moment you pay" href="#shop" label="Shop now" hideOn="#shop" />
    </>
  );
}
