import type { CSSProperties } from 'react';
import type { PhotoTheme } from '@/lib/photo-config';

// A sample party photo, drawn so the preview works without any images.
function Scene({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4B183" /><stop offset="0.55" stopColor="#C8627A" /><stop offset="1" stopColor="#4B3A78" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${id})`} />
      {[[60, 50, 26], [320, 40, 18], [250, 90, 32], [120, 120, 14], [360, 150, 22], [30, 190, 16]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FFF6DD" opacity={0.28} />
      ))}
      <path d="M40 260 q30 -90 70 -90 q40 0 70 90z M150 260 q35 -110 85 -110 q50 0 85 110z M280 260 q30 -80 65 -80 q35 0 60 80z" fill="#1B1426" opacity="0.8" />
      <circle cx="110" cy="148" r="24" fill="#1B1426" opacity="0.8" />
      <circle cx="235" cy="122" r="30" fill="#1B1426" opacity="0.8" />
      <circle cx="345" cy="160" r="22" fill="#1B1426" opacity="0.8" />
    </svg>
  );
}

// A miniature of the photo wall on a TV, in a given look. Mirrors the real TV
// (public/photo-app/photo.css, the [data-look] rules): same frame, caption and side panel.
export function PhotoPreview({ theme, name }: { theme: PhotoTheme; name: string }) {
  const style = {
    ...theme.vars,
    '--display': `"${theme.fonts.display}", Georgia, serif`,
    '--body': `"${theme.fonts.body}", system-ui, sans-serif`,
  } as CSSProperties;
  return (
    <div className={`pp pp-${theme.id}`} style={style} role="img" aria-label={`${theme.name} photo wall preview`}>
      <div className="pp-backdrop"><Scene id={`pp-b-${theme.id}`} /></div>
      <div className="pp-stage">
        <figure className="pp-print">
          <div className="pp-img"><Scene id={`pp-f-${theme.id}`} /></div>
          <figcaption className="pp-credit">Photo by Jess</figcaption>
        </figure>
      </div>
      <div className="pp-side">
        <b className="pp-title">{name}</b>
        <div>
          <div className="pp-qr"><span /></div>
          <div className="pp-label">Scan to add your photos</div>
        </div>
        <span className="pp-count">128 photos</span>
      </div>
      <span className="pp-new">New photo</span>
    </div>
  );
}
