import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, phoneFor, SITE } from './helpers.js';

process.env.PAY_MODE = 'mock';
const T = await boot();
test.after(() => T.pool.end());

const j = async (r) => r.json();

test('public : fournisseurs et plans, pas de /me sans session', async () => {
  const p = await j(await T.app.request('/api/providers'));
  assert.equal(p.providers.sms, true); assert.equal(p.free, false);
  assert.equal((await T.app.request('/api/me')).status, 401);
  assert.equal((await j(await T.app.request('/api/plans'))).plans.eleve.prices.mois, 1000);
});

test('numéro invalide refusé', async () => {
  const r = await T.app.request('/api/auth/phone-number/send-otp', { method: 'POST', headers: { 'content-type': 'application/json', origin: SITE }, body: JSON.stringify({ phoneNumber: '+1555000111' }) });
  assert.notEqual(r.status, 200);
});

test('mauvais code SMS refusé', async () => {
  const phone = phoneFor(1);
  const h = { 'content-type': 'application/json', origin: SITE, 'x-forwarded-for': '10.9.9.9' };
  await T.app.request('/api/auth/phone-number/send-otp', { method: 'POST', headers: h, body: JSON.stringify({ phoneNumber: phone }) });
  const r = await T.app.request('/api/auth/phone-number/verify', { method: 'POST', headers: h, body: JSON.stringify({ phoneNumber: phone, code: '000000' }) });
  assert.notEqual(r.status, 200);
});

test('parcours élève / enseignant : profil, classe, code, progression', async () => {
  const prof = await T.login(phoneFor(10));
  const eleve = await T.login(phoneFor(11));

  assert.equal((await eleve.call('/api/me/profile', { method: 'POST', body: { role: 'roi' } })).status, 400);
  await eleve.call('/api/me/profile', { method: 'POST', body: { role: 'eleve', classe: '5e', displayName: 'Awa' } });
  await prof.call('/api/me/profile', { method: 'POST', body: { role: 'enseignant' } });
  const me = await j(await eleve.call('/api/me'));
  assert.equal(me.profile.role, 'eleve'); assert.equal(me.profile.classe, '5e');

  assert.equal((await eleve.call('/api/classes', { method: 'POST', body: { name: 'X', level: '5e' } })).status, 403);
  const created = await prof.call('/api/classes', { method: 'POST', body: { name: '5e B', level: '5e' } });
  assert.equal(created.status, 201);
  const { class: cl } = await j(created);
  assert.match(cl.code, /^[A-Z0-9]{3}-[A-Z0-9]{3}$/);

  assert.equal((await eleve.call('/api/classes/join', { method: 'POST', body: { code: 'ZZZ-ZZZ' } })).status, 404);
  const joined = await eleve.call('/api/classes/join', { method: 'POST', body: { code: cl.code.replace('-', '').toLowerCase() } });
  assert.equal(joined.status, 200);

  await eleve.call('/api/progress', { method: 'PUT', body: { lessonId: 'vitesse', steps: { sim: true, quiz: true, hack: true } } });
  await eleve.call('/api/progress', { method: 'PUT', body: { lessonId: 'vitesse', steps: { defi: true } } });
  const pr = await j(await eleve.call('/api/progress'));
  assert.deepEqual(pr.progress.vitesse, { sim: true, quiz: true, defi: true }); // fusion, clés inconnues ignorées
  assert.equal((await eleve.call('/api/progress', { method: 'PUT', body: { lessonId: '../x', steps: {} } })).status, 400);

  const view = await j(await prof.call(`/api/classes/${cl.id}/progress`));
  assert.equal(view.students.length, 1); assert.equal(view.students[0].name, 'Awa');
  assert.equal(JSON.stringify(view).includes('+225'), false); // aucune donnée de contact
  assert.equal((await eleve.call(`/api/classes/${cl.id}/progress`)).status, 404); // pas son propre suivi
  assert.equal((await j(await prof.call('/api/classes'))).owned[0].students, 1);
});

test('sécurité : origine inconnue refusée, paiement d’autrui introuvable', async () => {
  const a = await T.login(phoneFor(20)); const b = await T.login(phoneFor(21));
  assert.equal((await a.call('/api/me/profile', { method: 'POST', body: { role: 'eleve' }, origin: 'https://evil.example' })).status, 403);
  assert.equal((await a.call('/api/me/profile', { method: 'POST', body: { role: 'eleve' }, origin: null })).status, 403);
  const pay = await j(await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period: 'mois' } }));
  assert.equal((await b.call('/api/pay/mock-confirm', { method: 'POST', body: { tx: pay.tx } })).status, 404);
  assert.equal((await b.call(`/api/pay/status/${pay.tx}`)).status, 404);
  assert.equal((await a.call('/api/pay/init', { method: 'POST', body: { plan: 'vip', period: 'mois' } })).status, 400);
});

test('contenu verrouillé : refusé sans pass, ouvert avec pass, ouvert via la classe de l’enseignant', async () => {
  const a = await T.login(phoneFor(30));
  assert.equal((await a.call('/api/content/demo')).status, 402);
  const pay = await j(await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period: 'trim' } }));
  assert.equal(pay.amount, 2500);
  assert.equal((await a.call('/api/content/demo')).status, 402); // payé ≠ confirmé
  await a.call('/api/pay/mock-confirm', { method: 'POST', body: { tx: pay.tx } });
  await a.call('/api/pay/mock-confirm', { method: 'POST', body: { tx: pay.tx } }); // idempotent
  assert.equal((await a.call('/api/content/demo')).status, 200);
  assert.equal((await a.call('/api/content/..%2Fpackage')).status === 200, false);
  const me = await j(await a.call('/api/me')); assert.equal(me.access.level, 'pass');
  const n = (await T.q('select count(*)::int n from pass p join "user" u on u.id=p.user_id where u."phoneNumber"=$1', [phoneFor(30)])).rows[0].n;
  assert.equal(n, 1);

  const prof = await T.login(phoneFor(31)); const kid = await T.login(phoneFor(32));
  await prof.call('/api/me/profile', { method: 'POST', body: { role: 'enseignant' } });
  const { class: cl } = await j(await prof.call('/api/classes', { method: 'POST', body: { name: '3e A', level: '3e' } }));
  await kid.call('/api/classes/join', { method: 'POST', body: { code: cl.code } });
  assert.equal((await kid.call('/api/content/demo')).status, 402);
  const pp = await j(await prof.call('/api/pay/init', { method: 'POST', body: { plan: 'prof', period: 'mois' } }));
  await prof.call('/api/pay/mock-confirm', { method: 'POST', body: { tx: pp.tx } });
  assert.equal((await kid.call('/api/content/demo')).status, 200);
  assert.equal((await j(await kid.call('/api/me'))).access.level, 'classe');
});

test('effacement du compte : tout disparaît', async () => {
  const a = await T.login(phoneFor(40));
  await a.call('/api/me/profile', { method: 'POST', body: { role: 'eleve' } });
  await a.call('/api/progress', { method: 'PUT', body: { lessonId: 'ph', steps: { quiz: true } } });
  assert.equal((await a.call('/api/me', { method: 'DELETE' })).status, 200);
  assert.equal((await a.call('/api/me')).status, 401);
  const left = (await T.q('select (select count(*) from "user" where "phoneNumber"=$1)::int u, (select count(*) from progress p where not exists(select 1 from "user" x where x.id=p.user_id))::int o', [phoneFor(40)])).rows[0];
  assert.deepEqual(left, { u: 0, o: 0 });
});
