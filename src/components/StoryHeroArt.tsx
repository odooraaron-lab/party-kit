import type { Theme } from '@/lib/story';
import type { CastArt } from '@/lib/cast';
import { ThemePreview } from './ThemePreview';

// Storybook hero: a product close-up rather than a party scene (the video below shows the party).
// Reads left to right: the QR table card, a guest writing on their phone, the page landing on the TV.
export function StoryHeroArt({ theme, art, name }: { theme: Theme; art: CastArt; name: string }) {
  return (
    <div className="sh" role="img" aria-label={`A guest writes a birthday wish on their phone and it appears on the TV as a storybook page, in the ${theme.name} theme`}>
      <div className="sh-tv">
        <div className="tv-frame"><div className="tv-frame-screen"><ThemePreview theme={theme} art={art} name={name} /></div></div>
        <span className="sh-toast"><i aria-hidden="true">✦</i> New page from Nana</span>
      </div>

      <svg className="sh-arrow" viewBox="0 0 200 120" aria-hidden="true">
        <path d="M10 110 C 60 110, 120 90, 180 20" fill="none" stroke="#C23A64" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 13" />
        <path d="M166 22 L184 14 L182 34" fill="none" stroke="#C23A64" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="sh-phone">
        <div className="sh-notch" />
        <p className="sh-ph-title">Write a wish for {name}</p>
        <div className="sh-chips"><span className="on">Wish</span><span>Advice</span><span>Guess</span></div>
        <div className="sh-text">Happy birthday {name}! Hope your day is full of lions, cake and big adventures.</div>
        <div className="sh-from">From <b>Nana</b></div>
        <div className="sh-send">Add my page</div>
      </div>

      <div className="sh-card">
        <div className="sh-qr" />
        <b>Scan to write a wish</b>
      </div>

      {[['8%', '12%', '#FFC857'], ['22%', '4%', '#C23A64'], ['93%', '62%', '#AFCBF2'], ['4%', '58%', '#0F766E'], ['60%', '94%', '#FFC857']].map(([l, t, c], i) => (
        <span key={i} className="sh-dot" style={{ left: l, top: t, background: c }} aria-hidden="true" />
      ))}
    </div>
  );
}
