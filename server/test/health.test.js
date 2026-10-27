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
