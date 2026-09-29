import { BRAND } from '@/lib/brand';

// The mark: a little TV with balloon antennae and an open storybook on screen.
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 54 / 48)} viewBox="0 -6 48 54" aria-hidden="true" className="logo-mark" overflow="visible">
      <path d="M17 12 L12 3" stroke="#2E2140" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 12 L37 2" stroke="#2E2140" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="11.5" cy="3.5" r="3.5" fill="#C23A64" stroke="#2E2140" strokeWidth="2" className="logo-balloon-a" />
      <circle cx="37.5" cy="3" r="3" fill="#FFC857" stroke="#2E2140" strokeWidth="2" className="logo-balloon-b" />
      <rect x="3" y="11" width="42" height="31" rx="9" fill="#AFCBF2" stroke="#2E2140" strokeWidth="3" />
      <path d="M13 24 q5.5 -3 11 0 v10 q-5.5 -3 -11 0z" fill="#FFFDF6" stroke="#2E2140" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M24 24 q5.5 -3 11 0 v10 q-5.5 -3 -11 0z" fill="#FFFDF6" stroke="#2E2140" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M33 14.5 l1.3 2.7 2.9.4 -2.1 2 .5 2.9 -2.6 -1.4 -2.6 1.4 .5 -2.9 -2.1 -2 2.9 -.4z" fill="#FFC857" stroke="#2E2140" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M17 42 l-3 4 M31 42 l3 4" stroke="#2E2140" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Mark + wordmark, with a small "myQR" underneath to tie the family of sites together.
// The wordmark is set in the same hand-lettered face as the TV storybook.
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-text">
        <span className="logo-word" style={{ fontSize: size * 0.72 }}>{BRAND.name}</span>
        <span className="logo-by" style={{ fontSize: Math.max(10, size * 0.27) }}>{BRAND.parent}</span>
      </span>
    </span>
  );
}
