import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, phoneFor } from './helpers.js';

const T = await boot();
test.after(() => T.pool.end());
const j = (r) => r.json();
const put = (u, lessonId, steps) => u.call('/api/progress', { method: 'PUT', body: { lessonId, steps } });

async function classe(profIdx, ...eleves) {
  const prof = await T.login(phoneFor(profIdx));
  await prof.call('/api/me/profile', { method: 'POST', body: { role: 'enseignant' } });
  const { class: cl } = await j(await prof.call('/api/classes', { method: 'POST', body: { name: '6e T', level: '6e' } }));
  for (const e of eleves) {
    await e.call('/api/me/profile', { method: 'POST', body: { role: 'eleve', classe: '6e', displayName: 'Nom Réel' } });
    await e.call('/api/classes/join', { method: 'POST', body: { code: cl.code } });
  }
  return { prof, cl };
}

test('points : calculés par le serveur, une seule fois par étape, inconnue ignorée', async () => {
  const e = await T.login(phoneFor(40));
  await e.call('/api/me/profile', { method: 'POST', body: { role: 'eleve', classe: '6e' } });
  await put(e, 'volume', { resume: true, sim: true, points: 9999, xp: 9999 });
  await put(e, 'volume', { resume: true, sim: true }); // rejouée : rien de plus
  await put(e, 'inconnue-xyz', { quiz: true }); // leçon hors programme : aucun point
  const me = await j(await e.call('/api/classement/me'));
  assert.equal(me.xp, 30); // resume 10 + sim 20
  assert.equal(me.level.name, 'Observateur');
  assert.match(me.pseudo, /^[A-Za-z]+-[A-Za-z]+-\d{2}$/);
});

test('anti-abus : au plus 6 étapes comptées par minute', async () => {
  const e = await T.login(phoneFor(41));
  await e.call('/api/me/profile', { method: 'POST', body: { role: 'eleve', classe: '6e' } });
  for (const l of ['volume', 'masse']) await put(e, l, { resume: true, sim: true, defi: true, quiz: true });
  const me = await j(await e.call('/api/classement/me'));
  assert.equal(me.xp, 10 + 20 + 20 + 30 + 10 + 20); // 6 événements, pas 8
});

test('pseudo : jamais libre, uniquement dans la liste générée', async () => {
  const e = await T.login(phoneFor(42));
  assert.equal((await e.call('/api/classement/pseudo', { method: 'POST', body: { pseudo: 'Mon Vrai Nom' } })).status, 400);
  const { pseudos } = await j(await e.call('/api/classement/pseudos'));
  assert.equal(pseudos.length, 3);
  const r = await e.call('/api/classement/pseudo', { method: 'POST', body: { pseudo: pseudos[0] } });
  assert.ok([200, 409].includes(r.status));
});

test('participation volontaire, majeur de 15 ans : visible seulement après opt-in', async () => {
  const a = await T.login(phoneFor(43)), b = await T.login(phoneFor(44));
  const { prof, cl } = await classe(45, a, b);
  await put(a, 'volume', { resume: true, sim: true });
  let v = await j(await b.call(`/api/classement/classes/${cl.id}`));
  assert.equal(v.participants, 0); // personne n'a accepté
  assert.equal((await a.call('/api/classement/optin', { method: 'POST', body: { optIn: true } })).status, 400); // âge non indiqué
  assert.equal((await a.call('/api/classement/optin', { method: 'POST', body: { optIn: true, under15: false } })).status, 200);
  v = await j(await b.call(`/api/classement/classes/${cl.id}`));
  assert.equal(v.participants, 1);
  assert.equal(v.top[0].week, 30);
  const txt = JSON.stringify(v);
  assert.ok(!txt.includes('Nom Réel') && !txt.includes(phoneFor(43)) && !txt.includes('user_id')); // aucune donnée perso
  assert.equal((await prof.call(`/api/classement/classes/${cl.id}`)).status, 200); // l'enseignant voit
  await a.call('/api/classement/optin', { method: 'POST', body: { optIn: false } });
  assert.equal((await j(await b.call(`/api/classement/classes/${cl.id}`))).participants, 0);
});

test('accès : une personne étrangère à la classe ne voit rien', async () => {
  const a = await T.login(phoneFor(46)), out = await T.login(phoneFor(47));
  const { cl } = await classe(48, a);
  assert.equal((await out.call(`/api/classement/classes/${cl.id}`)).status, 404);
  assert.equal((await T.app.request(`/api/classement/classes/${cl.id}`)).status, 401);
});

test('moins de 15 ans : accord du parent par SMS, puis retrait possible', async () => {
  const kid = await T.login(phoneFor(49));
  const { cl } = await classe(50, kid);
  const optin = (body) => kid.call('/api/classement/optin', { method: 'POST', body });
  const r = await optin({ optIn: true, under15: true });
  assert.equal(r.status, 403); assert.equal((await j(r)).code, 'consent_required');
  const parent = '+2250701020304';
  assert.equal((await kid.call('/api/classement/consent/request', { method: 'POST', body: { parentPhone: '123' } })).status, 400);
  assert.equal((await kid.call('/api/classement/consent/request', { method: 'POST', body: { parentPhone: parent } })).status, 200);
  await new Promise((r) => setTimeout(r, 30));
  const sms = T.sms.outbox.filter((m) => m.to === parent).at(-1);
  assert.ok(sms, 'SMS au parent');
  const token = sms.text.match(/#([\w-]+)/)[1];
  assert.equal((await optin({ optIn: true })).status, 403); // pas encore confirmé
  const pub = (path, tok, origin = 'https://lab.nohaba.com') => T.app.request(path, { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ token: tok }) });
  assert.equal((await pub('/api/classement/consent/confirm', 'x'.repeat(30))).status, 404);
  assert.equal((await pub('/api/classement/consent/confirm', token, 'https://evil.example')).status, 403);
  assert.equal((await pub('/api/classement/consent/confirm', token)).status, 200);
  assert.equal((await optin({ optIn: true })).status, 200);
  assert.equal((await j(await kid.call(`/api/classement/classes/${cl.id}`))).participants, 1);
  assert.equal((await pub('/api/classement/consent/revoke', token)).status, 200);
  assert.equal((await j(await kid.call(`/api/classement/classes/${cl.id}`))).participants, 0); // retiré aussitôt
});

test('niveaux et badges', async () => {
  const { levelOf, badgesFor } = await import('../src/classement.js');
  assert.equal(levelOf(0).num, 1); assert.equal(levelOf(80).name, 'Expérimentateur'); assert.equal(levelOf(5000).pct, 100);
  const full = { volume: { resume: true, sim: true, defi: true, quiz: true } };
  const b = badgesFor('6e', full);
  assert.ok(b.find((x) => x.id === 'premiere-lecon').got);
  assert.ok(!b.find((x) => x.id === 'classe-6e').got);
  assert.ok(!badgesFor('6e', { volume: { resume: true, sim: true, defi: true } }).find((x) => x.id === 'premiere-lecon').got); // sans quiz : non
});
