import test from 'node:test';
import assert from 'node:assert/strict';
import { boot } from './helpers.js';

const T = await boot();
test.after(() => T.pool.end());
const SITE = 'https://lab.nohaba.com';
const RUN = Math.floor(Math.random() * 200) + 20;
let n = 0;
const call = (path, body, cookie) => T.app.request(path, {
  method: body === undefined ? 'GET' : 'POST',
  headers: { 'content-type': 'application/json', origin: SITE, 'x-forwarded-for': `10.${RUN}.7.${++n % 250 + 1}`, ...(cookie ? { cookie } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});
const email = `eleve${Date.now()}@example.com`;

test('providers annonce la connexion par e-mail', async () => {
  const p = await (await call('/api/providers')).json();
  assert.equal(p.providers.email, true);
});

test('créer un compte avec e-mail, se connecter, profil, mauvais mot de passe refusé', async () => {
  let r = await call('/api/auth/sign-up/email', { email, password: 'motdepasse1', name: 'Awa' });
  assert.equal(r.status, 200);
  r = await call('/api/auth/sign-up/email', { email: `x${email}`, password: 'court', name: 'Awa' });
  assert.equal(r.status, 400, 'mot de passe trop court refusé');
  r = await call('/api/auth/sign-in/email', { email, password: 'mauvais-mot-de-passe' });
  assert.equal(r.status, 401);
  r = await call('/api/auth/sign-in/email', { email, password: 'motdepasse1' });
  assert.equal(r.status, 200);
  const cookie = r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  const me = await (await call('/api/me', undefined, cookie)).json();
  assert.ok(me.user.id && me.user.name === 'Awa');
  r = await call('/api/me/profile', { role: 'eleve', classe: '5e', displayName: 'Awa' }, cookie);
  assert.equal(r.status, 200);
});

test('mot de passe oublié : la demande répond 200 même pour une adresse inconnue', async () => {
  assert.equal((await call('/api/auth/request-password-reset', { email, redirectTo: `${SITE}/connexion/?reset=1` })).status, 200);
  assert.equal((await call('/api/auth/request-password-reset', { email: 'inconnu@example.com', redirectTo: `${SITE}/connexion/?reset=1` })).status, 200);
});
