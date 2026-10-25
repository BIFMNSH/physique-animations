// Régénère src/lessons.json depuis assets/studio/programme.js (leçons « ready »).
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const src = readFileSync(new URL('../../assets/studio/programme.js', import.meta.url), 'utf8');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(src, ctx);
const out = {};
for (const [classe, themes] of Object.entries(ctx.window.PROGRAMME)) out[classe] = themes.map((t) => ({ theme: t.nm, lessons: t.les.filter((l) => l.ready).map((l) => l.slug) })).filter((t) => t.lessons.length);
writeFileSync(new URL('../src/lessons.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(Object.entries(out).map(([c, t]) => `${c}: ${t.reduce((n, x) => n + x.lessons.length, 0)} leçons`).join(' · '));
