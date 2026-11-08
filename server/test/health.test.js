import test from 'node:test';
import assert from 'node:assert/strict';
import { boot } from './helpers.js';
const T = await boot();
test.after(() => T.pool.end());
test('health confirme la connexion PostgreSQL', async () => {
  const r = await T.app.request('/health');
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true, database: 'ready' });
});

test('proxy : slash final et réponses non mises en cache', async () => {
  const r = await T.app.request('/api/providers/');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('cache-control'), /no-store/);
  const session = await T.app.request('/api/auth/get-session/');
  assert.equal(session.status, 200);
  assert.equal(await session.json(), null);
});
