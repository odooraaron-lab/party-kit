import type { ReactNode } from 'react';

// Illustrated party with the product playing on the TV. The screen area shows
// whatever is passed as children (the real product preview). Swap for real
// photography later; the layout stays the same.
type Pose = 'cheer' | 'wave' | 'phone' | 'drink' | 'point';
type Person = { x: number; s: number; skin: string; shirt: string; hair: string; pose: Pose; hat?: string; long?: boolean };

const INK = '#2E2140';

function Figure({ x, s, skin, shirt, hair, pose, hat, long }: Person) {
  const arm = (d: string) => (<><path d={d} stroke={INK} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={d} stroke={skin} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>);
  const arms: Record<Pose, ReactNode> = {
    cheer: <>{arm('M-28 -140 L-54 -204')}{arm('M28 -140 L54 -204')}</>,
    wave: <>{arm('M-28 -140 L-40 -92')}{arm('M28 -140 L56 -196')}</>,
    phone: <>{arm('M-28 -140 L-40 -92')}{arm('M28 -140 L46 -118 L26 -150')}<rect x="14" y="-176" width="20" height="32" rx="4" fill={INK} /><rect x="17" y="-172" width="14" height="22" rx="2" fill="#AFCBF2" /></>,
    drink: <>{arm('M-28 -140 L-40 -92')}{arm('M28 -140 L52 -150 L50 -170')}<path d="M40 -196 h22 l-4 26 h-14z" fill="#FFE9A8" stroke={INK} strokeWidth="3" /></>,
    point: <>{arm('M-28 -140 L-40 -92')}{arm('M28 -140 L70 -170')}</>,
  };
  return (
    <g transform={`translate(${x} 440) scale(${s})`}>
      <path d="M-14 -80 L-16 0 M14 -80 L16 0" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="-18" cy="0" rx="14" ry="6" fill={INK} /><ellipse cx="18" cy="0" rx="14" ry="6" fill={INK} />
      {long && <path d="M-26 -206 q-10 50 -4 74 h60 q6 -24 -4 -74z" fill={hair} stroke={INK} strokeWidth="4" />}
      <path d="M-36 -76 Q-40 -152 0 -156 Q40 -152 36 -76 Z" fill={shirt} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {arms[pose]}
      <circle cx="0" cy="-182" r="27" fill={skin} stroke={INK} strokeWidth="4" />
      <path d="M-27 -186 q2 -26 27 -26 q25 0 27 26 q-12 -10 -27 -10 q-15 0 -27 10z" fill={hair} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="-9" cy="-180" r="3" fill={INK} /><circle cx="9" cy="-180" r="3" fill={INK} />
      <path d="M-10 -168 q10 10 20 0" fill={pose === 'cheer' ? INK : 'none'} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="-17" cy="-170" r="4" fill="#FF9FB2" opacity="0.8" /><circle cx="17" cy="-170" r="4" fill="#FF9FB2" opacity="0.8" />
      {hat && <><path d="M-16 -204 L0 -250 L16 -204z" fill={hat} stroke={INK} strokeWidth="4" strokeLinejoin="round" /><circle cx="0" cy="-252" r="6" fill="#FFC857" stroke={INK} strokeWidth="3" /></>}
    </g>
  );
}

const CASTS: Record<'kids' | 'adults' | 'family', Person[]> = {
  kids: [
    { x: 96, s: 1, skin: '#C98B5E', shirt: '#8FD3B6', hair: '#2E2140', pose: 'phone' },
    { x: 196, s: 0.64, skin: '#F5D6BF', shirt: '#FFC857', hair: '#B5652B', pose: 'cheer', hat: '#C23A64' },
    { x: 300, s: 0.6, skin: '#8D5A3B', shirt: '#AFCBF2', hair: '#2E2140', pose: 'point', hat: '#8FD3B6' },
    { x: 560, s: 0.66, skin: '#F2C7A5', shirt: '#C23A64', hair: '#6B4230', pose: 'cheer', hat: '#FFC857', long: true },
    { x: 690, s: 1, skin: '#F2C7A5', shirt: '#B58BD8', hair: '#8E8E9A', pose: 'wave', long: true },
  ],
  adults: [
    { x: 92, s: 1, skin: '#8D5A3B', shirt: '#C23A64', hair: '#2E2140', pose: 'drink' },
    { x: 206, s: 0.98, skin: '#F2C7A5', shirt: '#2E2140', hair: '#E0B25A', pose: 'phone', long: true },
    { x: 590, s: 1, skin: '#C98B5E', shirt: '#FFC857', hair: '#2E2140', pose: 'cheer' },
    { x: 700, s: 0.96, skin: '#F5D6BF', shirt: '#8FD3B6', hair: '#6B4230', pose: 'drink', long: true },
  ],
  family: [
    { x: 110, s: 1, skin: '#F5D6BF', shirt: '#AFCBF2', hair: '#8E8E9A', pose: 'point' },
    { x: 220, s: 0.95, skin: '#F5D6BF', shirt: '#C23A64', hair: '#B5652B', pose: 'wave', long: true },
    { x: 580, s: 0.62, skin: '#C98B5E', shirt: '#FFC857', hair: '#2E2140', pose: 'cheer', hat: '#8FD3B6' },
    { x: 690, s: 1, skin: '#8D5A3B', shirt: '#8FD3B6', hair: '#2E2140', pose: 'cheer' },
  ],
};

export function PartyScene({ crowd, wall = '#F4F8FE', children, label }: { crowd: keyof typeof CASTS; wall?: string; children: ReactNode; label: string }) {
  return (
    <div className="scene" role="img" aria-label={label}>
      <svg viewBox="0 0 800 480" aria-hidden="true" className="scene-svg">
        <rect width="800" height="480" fill={wall} />
        <rect y="440" width="800" height="40" fill="#E6D9C7" />
        <path d="M0 20 q200 50 400 0 q200 50 400 0" fill="none" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 14 }, (_, i) => {
          const x = 20 + i * 56; const y = 20 + Math.sin(((x % 400) / 400) * Math.PI) * 24;
          return <path key={i} d={`M${x} ${y} h30 l-15 28z`} fill={['#C23A64', '#FFC857', '#AFCBF2', '#8FD3B6', '#B58BD8'][i % 5]} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
        })}
        {[[40, 150, '#C23A64'], [72, 120, '#FFC857'], [760, 130, '#AFCBF2'], [728, 160, '#8FD3B6']].map(([x, y, c], i) => (
          <g key={i}><path d={`M${x} ${(y as number) + 36} q${i % 2 ? 8 : -8} 60 0 120`} stroke={INK} strokeWidth="2" fill="none" /><ellipse cx={x as number} cy={y as number} rx="26" ry="32" fill={c as string} stroke={INK} strokeWidth="3.5" /></g>
        ))}
        <rect x="232" y="72" width="336" height="202" rx="16" fill={INK} />
        <rect x="376" y="274" width="48" height="14" fill={INK} />
        <rect x="300" y="286" width="200" height="10" rx="5" fill={INK} />
        {[[180, 90, '#FFC857'], [620, 80, '#C23A64'], [150, 240, '#AFCBF2'], [650, 250, '#8FD3B6'], [420, 330, '#B58BD8'], [330, 320, '#FFC857'], [500, 350, '#C23A64']].map(([x, y, c], i) => (
          <rect key={i} x={x as number} y={y as number} width="12" height="7" rx="2" fill={c as string} transform={`rotate(${i * 41} ${x} ${y})`} />
        ))}
        {CASTS[crowd].map((p, i) => <Figure key={i} {...p} />)}
      </svg>
      <div className="scene-screen">{children}</div>
    </div>
  );
}
