import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import { decodeCart, downloadsFor } from '@/lib/cart';
import { money } from '@/lib/money';
import { provisionStory, hostLink, uploadLink } from '@/lib/provision';
import { partyUrl } from '@/lib/urls';
import { ClearCart } from './ClearCart';

export const dynamic = 'force-dynamic';

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const session = session_id?.startsWith('cs_')
    ? await stripe().checkout.sessions.retrieve(session_id).catch(() => null)
    : null;

  if (!session || session.payment_status !== 'paid') {
    return (
      <div className="section stack" style={{ alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: 40 }}>We couldn't find a paid order</h1>
        <p className="muted">If you were charged, check your email for a confirmation or contact us.</p>
        <Link href="/" className="btn btn-outline">Back to home</Link>
      </div>
    );
  }

  // Birthday TV story: make sure it's live (the webhook usually beat us here) and show the links.
  if (session.metadata?.kind === 'slideshow') {
    const party = await provisionStory(session).catch((e) => { console.error(e); return null; });
    if (!party) {
      return (
        <div className="section stack" style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 40 }}>Payment received</h1>
          <p className="muted">We&rsquo;re setting up your slideshow now. Your upload link will arrive at {session.customer_details?.email} within a few minutes.</p>
        </div>
      );
    }
    return (
      <div className="section stack" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 44 }}>You&rsquo;re all set. Now add your photos</h1>
        <p className="muted">Your slideshow &ldquo;{party.childName}&rdquo; will play at <b>{partyUrl(party.slug).replace(/^https?:\/\//, '')}</b>. We&rsquo;ve emailed the links to {party.email} too.</p>
        <a className="btn btn-accent" href={uploadLink(party)}>Upload photos and videos</a>
      </div>
    );
  }

  if (session.metadata?.kind === 'story' || session.metadata?.kind === 'photos') {
    const isPhotos = session.metadata?.kind === 'photos';
    const party = await provisionStory(session).catch((e) => { console.error(e); return null; });
    if (!party) {
      return (
        <div className="section stack" style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 40 }}>Payment received</h1>
          <p className="muted">We're setting up the party site now. The links will arrive at {session.customer_details?.email} within a few minutes.</p>
        </div>
      );
    }
    const links: [string, string][] = [
      [isPhotos ? 'Open the slideshow on the TV' : 'Open on the TV', partyUrl(party.slug, '/tv')],
      ['Print the QR cards', partyUrl(party.slug, '/card')],
      ['Your private host page', hostLink(party)],
      ['Setup guide', partyUrl(party.slug, '/guide')],
    ];
    return (
      <div className="section stack" style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 44 }}>{isPhotos ? `${party.childName}: your photo wall is live!` : `${party.childName}'s storybook is live!`}</h1>
        <p className="muted">We've also emailed these links to {party.email}. Keep the host link private — it lets you remove {isPhotos ? 'photos and download them all' : 'notes and download the storybook'}.</p>
        <div className="stack" style={{ gap: 12 }}>
          {links.map(([label, url]) => (
            <a key={url} href={url} className="box link-row" target="_blank" rel="noreferrer">
              <b>{label}</b>
              <span className="muted small">{url.replace(/^https?:\/\//, '')}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  const lines = decodeCart(session.metadata?.cart);
  const downloads = downloadsFor(lines);
  return (
    <div className="section stack" style={{ maxWidth: 640 }}>
      <ClearCart />
      <h1 style={{ fontSize: 44 }}>Party's on!</h1>
      <p className="muted">
        We've emailed a confirmation to {session.customer_details?.email}. Total paid {money(session.amount_total ?? 0)}.
      </p>
      <ul className="ticks">
        {lines.map((l, i) => (
          <li key={i}>{l.qty} × {l.product.name} · {l.themeName}{l.guests ? ` · ${l.guests} guests` : ''}</li>
        ))}
      </ul>
      {downloads.length > 0 && (
        <div className="box stack" style={{ gap: 8 }}>
          <b>Your printables</b>
          {downloads.map((d) => (
            <a key={d.fileId} href={`/api/download/${session.id}/${d.fileId}`}>{d.label}</a>
          ))}
        </div>
      )}
      <Link href="/" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Back to home</Link>
    </div>
  );
}
