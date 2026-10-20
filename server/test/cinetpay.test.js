import test from 'node:test';
import assert from 'node:assert/strict';
process.env.PAY_MODE = 'cinetpay';
process.env.CINETPAY_API_KEY = 'k'; process.env.CINETPAY_SITE_ID = '123';
const { boot, phoneFor } = await import('./helpers.js');
const T = await boot();
test.after(() => T.pool.end());

let checkAnswer = {};
const calls = [];
globalThis.fetch = async (url, init) => {
  const body = JSON.parse(init.body); calls.push({ url, body });
  if (url.endsWith('/payment')) return Response.json({ code: '201', message: 'CREATED', data: { payment_token: 't', payment_url: 'https://checkout.cinetpay.test/pay/abc' } });
  if (url.endsWith('/payment/check')) return Response.json(checkAnswer[body.transaction_id] || { code: '662', message: 'WAITING_CUSTOMER_PAYMENT', data: { status: 'WAITING_FOR_CUSTOMER' } });
  throw new Error('url inattendue ' + url);
};
const notify = (tx, site = '123') => T.app.request('/api/pay/notify', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ cpm_trans_id: tx, cpm_site_id: site }) });
const passes = async (phone) => (await T.q('select count(*)::int n from pass p join "user" u on u.id=p.user_id where u."phoneNumber"=$1', [phone])).rows[0].n;

test('init : transaction enregistrée, Mobile Money, montant côté serveur', async () => {
  const a = await T.login(phoneFor(50));
  const r = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period: 'mois', amount: 5 } })).json();
  assert.equal(r.paymentUrl, 'https://checkout.cinetpay.test/pay/abc'); assert.equal(r.amount, 1000); // le client ne choisit pas le prix
  const sent = calls.find((c) => c.url.endsWith('/payment')).body;
  assert.equal(sent.channels, 'MOBILE_MONEY'); assert.equal(sent.currency, 'XOF'); assert.equal(sent.amount % 5, 0);
  assert.match(sent.notify_url, /\/api\/pay\/notify$/);
  assert.equal((await T.q('select status from payment where tx_id=$1', [r.tx])).rows[0].status, 'pending');
});

test('notification : vérifiée auprès de CinetPay, pass créé une seule fois', async () => {
  const phone = phoneFor(51); const a = await T.login(phone);
  const { tx } = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period: 'trim' } })).json();
  assert.equal((await notify(tx)).status, 200); // en attente : rien
  assert.equal(await passes(phone), 0);
  checkAnswer[tx] = { code: '00', message: 'SUCCES', data: { status: 'ACCEPTED', amount: '2500', currency: 'XOF' } };
  await notify(tx); await notify(tx); await notify(tx);
  assert.equal(await passes(phone), 1);
  assert.equal((await (await a.call('/api/me')).json()).access.level, 'pass');
});

test('montant différent, mauvais site, transaction inconnue, refus : aucun pass', async () => {
  const phone = phoneFor(52); const a = await T.login(phone);
  const p1 = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'prof', period: 'an' } })).json();
  checkAnswer[p1.tx] = { code: '00', data: { status: 'ACCEPTED', amount: '5', currency: 'XOF' } };
  await notify(p1.tx); assert.equal(await passes(phone), 0);
  const p2 = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'prof', period: 'mois' } })).json();
  checkAnswer[p2.tx] = { code: '00', data: { status: 'ACCEPTED', amount: '2500', currency: 'XOF' } };
  await notify(p2.tx, '999'); assert.equal(await passes(phone), 0);
  assert.equal((await notify('NLFORGED123456')).status, 200); assert.equal(await passes(phone), 0);
  const p3 = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period: 'mois' } })).json();
  checkAnswer[p3.tx] = { code: '627', data: { status: 'REFUSED' } };
  await notify(p3.tx);
  assert.equal((await T.q('select status from payment where tx_id=$1', [p3.tx])).rows[0].status, 'refused');
  assert.equal(await passes(phone), 0);
  assert.equal((await a.call('/api/pay/mock-confirm', { method: 'POST', body: { tx: p3.tx } })).status, 404); // mock désactivé
});

test('renouvellement : la durée s’ajoute à la fin du pass en cours', async () => {
  const phone = phoneFor(53); const a = await T.login(phone);
  for (const period of ['mois', 'mois']) {
    const { tx } = await (await a.call('/api/pay/init', { method: 'POST', body: { plan: 'eleve', period } })).json();
    checkAnswer[tx] = { code: '00', data: { status: 'ACCEPTED', amount: '1000', currency: 'XOF' } }; await notify(tx);
  }
  const days = (await T.q(`select extract(day from max(ends_at)-now())::int d from pass p join "user" u on u.id=p.user_id where u."phoneNumber"=$1`, [phone])).rows[0].d;
  assert.ok(days >= 58 && days <= 62, 'attendu ~2 mois, obtenu ' + days);
});
