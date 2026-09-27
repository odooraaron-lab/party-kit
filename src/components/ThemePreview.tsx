import type { Theme } from '@/lib/story';
import type { CastArt } from '@/lib/cast';

const brick = ([bg, a, b, c]: CastArt['wall']) => {
  const e = (x: string) => x.replace('#', '%23');
  return `${bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='1.5' y='1.5' width='57' height='12' rx='2' fill='${e(a)}'/%3E%3Crect x='-28.5' y='16.5' width='57' height='12' rx='2' fill='${e(b)}'/%3E%3Crect x='31.5' y='16.5' width='57' height='12' rx='2' fill='${e(c)}'/%3E%3C/svg%3E") 0 0 / 24px 12px`;
};

// A miniature of the TV screen in a theme, using the real cast artwork.
export function ThemePreview({ theme, art, name }: { theme: Theme; art: CastArt; name: string }) {
  const v = theme.vars;
  const display = `"${theme.fonts.display}", sans-serif`;
  const story = `"${theme.fonts.story}", Georgia, serif`;
  return (
    <div className="tp" role="img" aria-label={`${theme.name} theme preview`}
      style={{ background: `linear-gradient(${v['--sky-high']}, ${v['--sky']} 60%)`, color: v['--ink'] }}>
      {theme.mode === 'dark' && (
        <svg className="tp-stars" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          {[[8, 6], [20, 14], [34, 4], [52, 10], [66, 5], [80, 16], [90, 7], [44, 20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.5" fill="#FFF3C4" />)}
        </svg>
      )}
      <div className="tp-title" style={{ fontFamily: display }}>A storybook for {name}</div>
      <div className="tp-moon" />
      <div className="tp-cow" dangerouslySetInnerHTML={{ __html: art.COW }} />
      <svg className="tp-hills" viewBox="0 0 640 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 50 C140 0 260 10 400 40 C520 65 590 20 640 25 V120 H0Z" fill={v['--hill-back']} />
        <path d="M0 85 C160 50 330 70 470 90 C560 102 610 80 640 82 V120 H0Z" fill={v['--hill-front']} />
      </svg>
      <div className="tp-book" style={{ background: v['--paper'] ?? '#FFFDF6' }}>
        <div className="tp-leaf">
          <span className="tp-kind" style={{ fontFamily: display }}>A birthday wish</span>
        </div>
        <div className="tp-leaf tp-right" style={{ fontFamily: story }}>
          Happy birthday! I wish you big adventures and lots of cake.
          <span className="tp-sig">With love from <b>Nana</b></span>
        </div>
      </div>
      <div className="tp-wall" style={{ background: brick(art.wall) }}>
        <div className="tp-sign"><span className="tp-qr" />Scan me</div>
      </div>
      <div className="tp-humpty" dangerouslySetInnerHTML={{ __html: art.HUMPTY }} />
      <div className="tp-dog" dangerouslySetInnerHTML={{ __html: art.DOG }} />
      <div className="tp-cat" dangerouslySetInnerHTML={{ __html: art.CAT }} />
    </div>
  );
}
