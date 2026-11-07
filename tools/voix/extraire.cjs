/* Extrait les phrases de la voix off (segments du résumé animé + question flash) des leçons Studio.
   Usage : node tools/voix/extraire.cjs <niveau|slug|tout> [...]   →   JSON sur la sortie standard : [{ slug, items: ['phrase', …] }]
   Exemple : node tools/voix/extraire.cjs 5e > /tmp/phrases.json */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..', '..'), read = f => fs.readFileSync(path.resolve(root, f), 'utf8');
const P = {}; P.window = P; vm.createContext(P); vm.runInContext(read('assets/studio/programme.js'), P);
const want = process.argv.slice(2); if (!want.length) { console.error('Usage : extraire.cjs <5e|6e|4e|3e|slug|tout> [...]'); process.exit(1); }
const out = [];
for (const [niv, themes] of Object.entries(P.PROGRAMME)) for (const th of themes) for (const l of th.les) {
  if (!l.ready) continue;
  if (!(want.includes('tout') || want.includes(niv) || want.includes(l.slug))) continue;
  const c = {}; c.window = c; let L = null;
  c.Studio = { s() { return {}; }, attr() {}, fmt: x => x, kit: {}, start(x) { L = x; } }; c.document = {}; vm.createContext(c);
  for (const k of [].concat(l.kit || [])) vm.runInContext(read('assets/studio/kits/' + k + '.js'), c);
  vm.runInContext(read('assets/studio/lecons/' + l.slug + '.js'), c);
  const R = L && L.resume; if (!R) continue;
  const items = (R.segs || []).map(s => s.say).filter(Boolean);
  [].concat(R.question || []).forEach(q => { if (q && q.q) items.push('Question flash. ' + q.q); });
  out.push({ slug: l.slug, items });
}
process.stdout.write(JSON.stringify(out));
