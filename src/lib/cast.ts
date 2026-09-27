import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { THEMES } from './story';

// Reads each theme's animal artwork from the TV app's own files, so the shop's
// previews always show exactly what the TV will show. Runs at build time (shop pages)
// and at request time (the printable storybook PDF).
export type CastArt = { COW: string; DOG: string; CAT: string; HUMPTY: string; SHEEP: string; BIRD: string; DISHSPOON: string; ICONS: Record<string, string>; wall: [string, string, string, string] };

let cache: Record<string, CastArt> | null = null;

export function loadCasts(): Record<string, CastArt> {
  if (cache) return cache;
  const dir = path.join(process.cwd(), 'public', 'party-app');
  const read = (f: string) => fs.readFileSync(path.join(dir, f), 'utf8');
  const out: Record<string, CastArt> = {};
  for (const t of THEMES) {
    const ctx = vm.createContext({ window: {}, document: {} }) as { window: { N18: Record<string, unknown> }; N18?: unknown };
    vm.runInContext(read('shared.js'), ctx);
    const N = ctx.window.N18;
    ctx.N18 = N;
    let wall: CastArt['wall'] = ['#F4E4CB', '#D9745A', '#CF6A50', '#DB7B61'];
    N.wallColours = (...a: string[]) => { wall = a as CastArt['wall']; };
    if (t.cast !== 'farm') vm.runInContext(read(`cast-${t.cast}.js`), ctx);
    out[t.id] = {
      COW: N.COW as string, DOG: N.DOG as string, CAT: N.CAT as string, HUMPTY: N.HUMPTY as string,
      SHEEP: N.SHEEP as string, BIRD: N.BIRD as string, DISHSPOON: N.DISHSPOON as string,
      ICONS: N.ICONS as Record<string, string>, wall,
    };
  }
  return (cache = out);
}
