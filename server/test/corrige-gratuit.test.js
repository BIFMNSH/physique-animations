// Pendant la gratuité, le rôle « enseignant » se déclare librement : le corrigé n'est servi qu'aux comptes de TEACHER_ALLOW.
process.env.FREE_UNTIL = '2099-12-31';
import test from 'node:test';
import assert from 'node:assert/strict';
import { boot, phoneFor } from './helpers.js';

const OK = phoneFor(90);
process.env.TEACHER_ALLOW = ` ${OK.replace('+', '+ ')} , autre@exemple.fr`;
const T = await boot();
test.after(() => T.pool.end());
const j = (r) => r.json();
async function user(phone, role) { const u = await T.login(phone); await u.call('/api/me/profile', { method: 'POST', body: { role } }); return u; }

test('gratuité : élève et faux enseignant refusés, enseignant de la liste servi', async () => {
  const eleve = await user(phoneFor(91), 'eleve');
  assert.equal((await eleve.call('/api/activites/NL-C4-D06/corrige')).status, 403);
  const faux = await user(phoneFor(92), 'enseignant');   // s'est déclaré enseignant, hors liste
  assert.equal((await faux.call('/api/activites/NL-C4-D06/corrige')).status, 403);
  const vrai = await user(OK, 'enseignant');
  const r = await vrai.call('/api/activites/NL-C4-D06/corrige'); assert.equal(r.status, 200);
  assert.ok((await j(r)).prof.limites.length > 30);
  const horsRole = await T.login(phoneFor(93)); assert.equal((await horsRole.call('/api/activites/NL-C4-D06/corrige')).status, 403);
});
