// Flat illustrations for the stock listings, until real product photos are ready.
export type ArtKind = 'plates' | 'balloons' | 'invite' | 'candles' | 'partybag' | 'banner' | 'cups' | 'props' | 'confetti' | 'toppers';

const INK = '#2E2140';

export function ProductArt({ kind, bg }: { kind: ArtKind; bg: string }) {
  const s = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const art: Record<ArtKind, React.ReactNode> = {
    plates: (<g {...s}>
      <ellipse cx="150" cy="118" rx="84" ry="30" fill="#fff" /><ellipse cx="150" cy="112" rx="84" ry="30" fill="#fff" /><ellipse cx="150" cy="106" rx="84" ry="30" fill="#FFC857" /><ellipse cx="150" cy="106" rx="58" ry="19" fill="#FFE4A0" />
      <path d="M58 60 v70 M50 60 v18 q8 8 16 0 v-18" fill="none" /><path d="M244 60 q14 20 0 44 v26" fill="none" /></g>),
    balloons: (<g {...s}>
      <path d="M110 100 q-6 30 10 60 M150 86 q4 34 -6 74 M192 104 q8 26 -12 56" fill="none" strokeWidth="3" />
      <ellipse cx="110" cy="68" rx="30" ry="36" fill="#C23A64" /><ellipse cx="190" cy="74" rx="28" ry="34" fill="#AFCBF2" /><ellipse cx="150" cy="50" rx="30" ry="36" fill="#FFC857" />
      <path d="M100 52 q6 -10 14 -10" fill="none" stroke="#fff" strokeWidth="5" /></g>),
    invite: (<g {...s}>
      <rect x="82" y="36" width="136" height="110" rx="8" fill="#fff" transform="rotate(-6 150 90)" />
      <rect x="96" y="44" width="126" height="104" rx="8" fill="#FFF4E0" />
      <path d="M118 74 h82 M118 94 h60 M118 114 h72" fill="none" strokeWidth="5" stroke="#C23A64" />
      <circle cx="206" cy="58" r="10" fill="#FFC857" /></g>),
    candles: (<g {...s}>
      <rect x="70" y="118" width="160" height="26" rx="8" fill="#F9D8CE" />
      {[92, 124, 156, 188, 220].map((x, i) => (<g key={x}><rect x={x - 8} y={70} width="16" height="48" rx="3" fill={['#AFCBF2', '#C23A64', '#FFC857', '#8FD3B6', '#B58BD8'][i]} /><path d={`M${x} 70 v-8`} /><path d={`M${x} 48 q8 8 0 14 q-8 -6 0 -14z`} fill="#FFC857" /></g>))}</g>),
    partybag: (<g {...s}>
      <path d="M92 60 h116 l-10 92 h-96z" fill="#8FD3B6" /><path d="M120 60 q0 -28 30 -28 q30 0 30 28" fill="none" />
      <circle cx="132" cy="100" r="9" fill="#FFC857" /><circle cx="166" cy="116" r="7" fill="#C23A64" /><path d="M140 128 l10 -10 10 10" fill="none" /></g>),
    banner: (<g {...s}>
      <path d="M30 40 q120 40 240 0" fill="none" />
      {[0, 1, 2, 3, 4, 5].map((i) => { const x = 46 + i * 40; const y = 48 + Math.sin((i / 5) * Math.PI) * 18; return <path key={i} d={`M${x} ${y} h30 l-15 36z`} fill={['#C23A64', '#FFC857', '#AFCBF2', '#8FD3B6', '#B58BD8', '#F2A65A'][i]} />; })}</g>),
    cups: (<g {...s}>
      {[100, 150, 200].map((x, i) => (<g key={x}><path d={`M${x - 26} 64 h52 l-8 84 h-36z`} fill={['#AFCBF2', '#FFC857', '#F9D8CE'][i]} /><path d={`M${x - 20} 90 h40`} stroke="#fff" strokeWidth="6" /></g>))}
      <path d="M150 64 v-30 l18 -10" fill="none" stroke="#C23A64" strokeWidth="6" /></g>),
    props: (<g {...s}>
      <path d="M70 80 q20 -24 40 0 q20 -24 40 0 q-20 10 -40 0 q-20 10 -40 0z" fill={INK} /><path d="M90 84 v70" fill="none" />
      <circle cx="210" cy="70" r="26" fill="#FFC857" /><path d="M196 62 h8 M216 62 h8 M198 80 q12 10 24 0" fill="none" /><path d="M210 96 v58" fill="none" />
      <path d="M140 110 l14 -26 14 26z" fill="#C23A64" /><path d="M154 110 v44" fill="none" /></g>),
    confetti: (<g {...s}>
      <path d="M110 150 l40 -100 40 100z" fill="#AFCBF2" /><path d="M126 110 h48 M118 130 h64" fill="none" stroke="#fff" strokeWidth="6" />
      {[[80, 40, '#C23A64'], [220, 50, '#FFC857'], [100, 80, '#8FD3B6'], [210, 96, '#B58BD8'], [150, 26, '#F2A65A'], [240, 130, '#C23A64'], [66, 120, '#FFC857']].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width="12" height="7" rx="2" fill={c as string} transform={`rotate(${i * 37} ${x} ${y})`} />)}</g>),
    toppers: (<g {...s}>
      <path d="M80 150 h140 l-12 -40 h-116z" fill="#F9D8CE" /><path d="M92 110 q58 -30 116 0" fill="#fff" />
      {[110, 150, 190].map((x, i) => (<g key={x}><path d={`M${x} 100 v-36`} fill="none" /><path d={`M${x} 44 l6 12 13 2 -10 9 3 13 -12 -7 -12 7 3 -13 -10 -9 13 -2z`} fill={['#FFC857', '#C23A64', '#AFCBF2'][i]} strokeWidth="3" /></g>))}</g>),
  };
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', background: bg }}>
      {art[kind]}
    </svg>
  );
}
