import test from 'node:test';
import assert from 'node:assert/strict';
import { clientIp } from '../src/ip.js';
const h = (o) => (k) => o[k];
test('IP réelle de Vercel prioritaire', () => {
  assert.equal(clientIp(h({ 'x-vercel-forwarded-for': '41.202.1.9', 'x-forwarded-for': '76.76.21.1' })), '41.202.1.9');
});
test('repli sur x-forwarded-for, premier élément', () => {
  assert.equal(clientIp(h({ 'x-forwarded-for': '41.202.1.9, 10.0.0.1' })), '41.202.1.9');
});
test('sans en-tête : local', () => assert.equal(clientIp(h({})), 'local'));
