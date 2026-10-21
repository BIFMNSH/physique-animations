import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, phoneFor } from './helpers.js';

const T = await boot();
test.after(() => T.pool.end());
const { coversTheme, mergeThemes, themeOfActivity } = await import('../src/access.js');
const j = (r) => r.json();
async function pass(userId, plan, themes = null) {
  await T.q(`insert into pass(user_id, plan, starts_at, ends_at, themes) values ($1,$2, now() - interval '1 day', now() + interval '30 days', $3)`, [userId, plan, themes]);
}
async function user(i, role) {
  const u = await T.login(phoneFor(40 + i)); await u.call('/api/me/profile', { method: 'POST', body: { role } });
  const me = await j(await u.call('/api/me')); return { ...u, id: me.user.id };
}

test('fonctions : thème d’une activité, fusion, couverture', () => {
  assert.equal(themeOfActivity('NL-C4-C06'), 'C'); assert.equal(themeOfActivity('NL-C3-C06'), null); assert.equal(themeOfActivity('x'), null);
  assert.equal(mergeThemes([null, 'A']), null); assert.deepEqual(mergeThemes(['A,C', 'c,D', 'Z']), ['A', 'C', 'D']);
  assert.equal(coversTheme({ level: 'gratuit' }, 'B'), true); assert.equal(coversTheme({ level: 'aucun' }, 'B'), false);
  assert.equal(coversTheme({ level: 'pass', themes: null }, 'B'), true); assert.equal(coversTheme({ level: 'pass', themes: ['A'] }, 'B'), false);
  assert.equal(coversTheme({ level: 'pass', themes: ['A'] }, null), false);
});

test('sans pass : 402 ; identifiant invalide : 400 ; sans session : 401', async () => {
  const u = await user(1, 'eleve');
  const r = await u.call('/api/activites/NL-C4-A04/acces'); assert.equal(r.status, 402); assert.equal((await j(r)).theme, 'A');
  assert.equal((await u.call('/api/activites/..%2Fx/acces')).status, 400);
  assert.equal((await u.call('/api/activites/NL-C4-A04/corrige')).status, 402);
  assert.equal((await T.app.request('/api/activites/NL-C4-A04/acces')).status, 401);
});

test('pass élève limité aux thèmes A et C : accès A et C, refus B ; jamais le corrigé', async () => {
  const u = await user(2, 'eleve'); await pass(u.id, 'eleve', 'A,C');
  assert.equal((await u.call('/api/activites/NL-C4-A04/acces')).status, 200);
  assert.equal((await u.call('/api/activites/NL-C4-C06/acces')).status, 200);
  assert.equal((await u.call('/api/activites/NL-C4-B02/acces')).status, 402);
  assert.equal((await u.call('/api/activites/NL-C4-A04/corrige')).status, 403);
});

test('pass enseignant tous thèmes : corrigé servi, jamais en cache ; thème non couvert refusé', async () => {
  const p = await user(3, 'enseignant'); await pass(p.id, 'prof', null);
  const r = await p.call('/api/activites/NL-C4-D06/corrige'); assert.equal(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
  const c = await j(r); assert.equal(c.id, 'NL-C4-D06'); assert.ok(c.prof.reference.includes('0,64 m')); assert.ok(c.prof.limites.length > 30 && c.prof.differenciation.length > 20); // notes réservées à l'enseignant
  assert.equal((await p.call('/api/activites/NL-C4-A03/corrige')).status, 404); // activité sans corrigé exporté (encore en conception)
  const p2 = await user(4, 'enseignant'); await pass(p2.id, 'prof', 'B');
  assert.equal((await p2.call('/api/activites/NL-C4-B02/corrige')).status, 200);
  assert.equal((await p2.call('/api/activites/NL-C4-D06/corrige')).status, 402);
});

test('élève d’une classe : accès aux thèmes du pass de son enseignant, pas au corrigé', async () => {
  const prof = await user(5, 'enseignant'); await pass(prof.id, 'prof', 'C');
  const { class: cl } = await j(await prof.call('/api/classes', { method: 'POST', body: { name: '4e A', level: '4e' } }));
  const eleve = await user(6, 'eleve'); assert.equal((await eleve.call('/api/classes/join', { method: 'POST', body: { code: cl.code } })).status, 200);
  assert.equal((await eleve.call('/api/activites/NL-C4-C06/acces')).status, 200);
  assert.equal((await eleve.call('/api/activites/NL-C4-A04/acces')).status, 402);
  assert.equal((await eleve.call('/api/activites/NL-C4-C06/corrige')).status, 403);
});

test('les corrigés exportés ne fuient pas dans le front public', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const v = readFileSync(new URL('../../.vercelignore', import.meta.url), 'utf8');
  assert.match(v, /^server\/?$/m);
  assert.ok(existsSync(new URL('../private/activites/NL-C4-A04.json', import.meta.url)));
});
