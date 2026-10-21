// Extrait des fiches publiques (assets/activites/fiches) les éléments réservés à l'enseignant → server/private/activites/<id>.json
// Usage : node scripts/export-corriges.mjs   (depuis server/)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
const dir = new URL('../../assets/activites/fiches/', import.meta.url), out = new URL('../private/activites/', import.meta.url);
for (const f of readdirSync(dir).filter((x) => /^NL-C4-[A-D]\d\d\.js$/.test(x))) {
  const ctx = { window: {}, Activite: { h() {}, $() {}, esc: (s) => s, num: (x) => String(x) } }; vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL(f, dir), 'utf8'), ctx);
  const F = Object.values(ctx.window).find((v) => v && v.id && v.prof);
  if (!F) { console.error('ignoré', f); continue; }
  const j = { id: F.id, version: F.version, titre: F.titre, critere: F.critere, prof: F.prof, transfert: { reponse: F.transfert.rep, explication: F.transfert.expl }, synthese: F.synthese };
  writeFileSync(new URL(`${F.id}.json`, out), JSON.stringify(j, null, 1) + '\n'); console.log('écrit', F.id);
}
