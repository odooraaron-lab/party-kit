import { notFound } from 'next/navigation';
import { findParty } from '@/lib/party';
import { partyUrl } from '@/lib/urls';
import { Expired } from '../Expired';

// Setup guide, linked from the email. Deliberately doesn't show the host key.
export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const found = await findParty((await params).slug);
  if (!found) notFound();
  const { party } = found;
  if (found.expired) return <Expired name={party.childName} />;
  const short = (u: string) => u.replace(/^https?:\/\//, '');
  const tv = partyUrl(party.slug, '/tv');
  if (party.product === 'slideshow') {
    return (
      <div className="guide">
        <h1 className="story-title">Playing {party.childName} on the TV</h1>
        <ol>
          <li><b>Open the address on the TV</b><p>Type <a href={partyUrl(party.slug)}>{short(partyUrl(party.slug))}</a> into your smart TV&rsquo;s web browser, or open it on a laptop connected by HDMI, or cast the browser tab.</p></li>
          <li><b>Full screen and sound</b><p>Press F or use the full-screen button, then click once so the TV is allowed to play sound.</p></li>
          <li><b>Let it play</b><p>It shows your title, then every photo and video in order, then starts again.</p></li>
        </ol>
      </div>
    );
  }
  if (party.product === 'photos') {
    const photoSteps: [string, React.ReactNode][] = [
      ['Before the party: open your host page', <>Use the private host link in your email. Check the event name and change any wording on the TV, guests' phones and the QR cards.</>],
      ['Get the slideshow on the TV', <>Open <a href={tv}>{short(tv)}</a> in your smart TV's web browser, or on a laptop connected by HDMI, or cast the browser tab. Press F or use the full-screen button.</>],
      ['Print the QR cards', <>Open <a href={partyUrl(party.slug, '/card')}>the QR cards</a> and print them. Put them on tables, by the bar and at the door.</>],
      ['Test it', <>Scan the code with your phone, add a photo and watch it appear on the TV. Remove it from your host page if you like.</>],
      ['During the party', <>New photos jump the queue on the TV. From your host page you can remove any photo, hide the album from guests, or close uploads.</>],
      ['After the party: download everything', <>On your host page, tap "Download every photo" to get them all in one zip. The album is deleted on {new Date(party.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}.</>],
    ];
    return (
      <div className="guide">
        <h1 className="story-title">Setting up your photo wall for {party.childName}</h1>
        <ol>{photoSteps.map(([title, body]) => <li key={title}><b>{title}</b><p>{body}</p></li>)}</ol>
        <p className="muted">Guests go to <a href={partyUrl(party.slug)}>{short(partyUrl(party.slug))}</a>.</p>
      </div>
    );
  }
  const steps: [string, React.ReactNode][] = [
    ['Before the party: open your host page', <>Use the private host link in your email. Check the name, and change any wording on the TV, guests' phones and QR cards to suit your party.</>],
    ['Get it on the TV', <>Open <a href={tv}>{short(tv)}</a> in your smart TV's web browser. No smart TV? Open it on a laptop connected by HDMI, or cast the browser tab with Chromecast or AirPlay.</>],
    ['Go full screen and turn the sound on', <>Use the full-screen button at the bottom-left of the TV page (or the TV browser's own full-screen). Press any key or click once so the TV is allowed to play the music box and sound effects. You can change sound from the host page.</>],
    ['Print the QR cards', <>Open <a href={partyUrl(party.slug, '/card')}>the QR cards</a> and print a few for the tables and the door.</>],
    ['Do a test note', <>Scan the code with your phone, write a quick message, watch it appear on the TV, then remove it on your host page.</>],
    ['After the party: download your printable storybook', <>On your host page, tap &ldquo;Download the printable storybook (PDF)&rdquo;. Every message is laid out like it was on the TV, ready to print at home or at a print shop.</>],
  ];
  return (
    <div className="guide">
      <h1 className="story-title">Setting up {party.childName}'s birthday storybook</h1>
      <ol>
        {steps.map(([title, body]) => (
          <li key={title}><b>{title}</b><p>{body}</p></li>
        ))}
      </ol>
      <p className="muted">Guests go to <a href={partyUrl(party.slug)}>{short(partyUrl(party.slug))}</a>. This party site stays online until {new Date(party.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
    </div>
  );
}
