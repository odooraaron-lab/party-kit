import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { LogoMark } from '@/components/Logo';
import { ContactForm } from '@/components/ContactForm';

export const metadata = pageMeta('/contact', 'Contact Us', `Get in touch with ${BRAND.name}, a small New Zealand team making party ideas for the TV.`);

export default function ContactPage() {
  return (
    <>
      <section className="about" id="about">
        <div className="about-copy">
          <span className="ps-tag">About us</span>
          <h1>Parties are about the people. We built the rest.</h1>
          <p>
            {BRAND.name} is a small New Zealand business run by parents. It started when we were planning our
            own kids’ party and went looking for something that would get every guest involved, from the
            grandparents to the littlest ones. We couldn’t find anything that did exactly that, so we made it.
          </p>
          <p>
            We make party ideas that do the work for you: put them on the TV, and guests of every age join in
            without being asked twice. No apps to download, no subscriptions, and nothing to set up on the day.
          </p>
        </div>
        <div className="about-mark" aria-hidden="true"><LogoMark size={180} /></div>
      </section>

      <section className="section">
        <div className="values">
          <div className="value"><b>Simple beats fancy</b><p>Every theme is tested so it just works on the TV. If it isn’t reliable, we don’t sell it.</p></div>
          <div className="value"><b>Everyone joins in</b><p>From Nana to the shyest six-year-old, if they have a phone camera, they’re part of the party.</p></div>
          <div className="value"><b>Kind to the planet</b><p>Digital first, and when packs are back they’ll be compostable or made to reuse.</p></div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-side">
          <h2>Get in touch</h2>
          <p className="muted">Questions before you buy, help with an order, or ideas for something we should make. We read every message.</p>
          <dl className="contact-details">
            <div><dt>Email</dt><dd><a href="mailto:adminmyqr@gmail.com">adminmyqr@gmail.com</a></dd></div>
            <div><dt>We reply</dt><dd>Within one working day</dd></div>
          </dl>
          <p className="muted small">Quick answers are often in our <Link href="/#faq">FAQ</Link>.</p>
        </div>
        <div className="contact-card"><ContactForm /></div>
      </section>
    </>
  );
}
