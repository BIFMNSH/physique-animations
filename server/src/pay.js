import { randomBytes } from 'node:crypto';
import { cfg } from './config.js';
import { pool, q } from './db.js';
import { MONTHS, priceOf } from './plans.js';

const API = 'https://api-checkout.cinetpay.com/v2';
const clean = (t) => t.replace(/[#/$_&]/g, ' ');

export const newTxId = () => 'NL' + Date.now().toString(36).toUpperCase() + randomBytes(4).toString('hex').toUpperCase();

export async function startPayment(user, { plan, period }) {
  const amount = priceOf(plan, period);
  if (!amount) throw Object.assign(new Error('Pass inconnu'), { status: 400 });
  if (cfg.payMode === 'off') throw Object.assign(new Error('Paiement indisponible pour le moment'), { status: 503 });
  const tx = newTxId();
  await q('insert into payment(tx_id,user_id,plan,period,amount,provider) values($1,$2,$3,$4,$5,$6)', [tx, user.id, plan, period, amount, cfg.payMode]);
  if (cfg.payMode === 'mock') return { tx, amount, currency: 'XOF', mock: true };
  const body = {
    apikey: cfg.cinetpay.apiKey, site_id: cfg.cinetpay.siteId, transaction_id: tx, amount, currency: 'XOF',
    description: clean(`NOHOBA-Lab pass ${plan} ${period}`), notify_url: `${cfg.apiUrl}/api/pay/notify`,
    return_url: `${cfg.siteUrl}/abonnement/?tx=${tx}`, channels: 'MOBILE_MONEY', lang: 'fr', metadata: user.id.slice(0, 40),
    customer_id: user.id.slice(0, 40),
  };
  const r = await fetch(`${API}/payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (j.code !== '201' || !j.data?.payment_url) {
    await q("update payment set status='refused', raw=$2, updated_at=now() where tx_id=$1", [tx, JSON.stringify(j)]);
    throw Object.assign(new Error('Le paiement n’a pas pu démarrer'), { status: 502 });
  }
  return { tx, amount, currency: 'XOF', paymentUrl: j.data.payment_url };
}

// Notification CinetPay : elle ne dit JAMAIS la vérité à elle seule. On interroge CinetPay
// (/payment/check) et on compare montant, devise et transaction avec notre propre enregistrement.
export async function settle(txId, siteIdFromNotif) {
  const { rows } = await q('select * from payment where tx_id=$1', [txId]);
  const pay = rows[0];
  if (!pay) return { ok: false, reason: 'inconnue' };
  if (pay.status === 'accepted') return { ok: true, already: true };
  if (cfg.payMode !== 'cinetpay') return { ok: false, reason: 'mode' };
  if (siteIdFromNotif && String(siteIdFromNotif) !== String(cfg.cinetpay.siteId)) return { ok: false, reason: 'site' };
  const r = await fetch(`${API}/payment/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apikey: cfg.cinetpay.apiKey, site_id: cfg.cinetpay.siteId, transaction_id: txId }) });
  const j = await r.json().catch(() => ({}));
  const st = j?.data?.status;
  if (st === 'ACCEPTED') {
    if (Number(j.data.amount) !== pay.amount || j.data.currency !== pay.currency) { await q("update payment set raw=$2, updated_at=now() where tx_id=$1", [txId, JSON.stringify({ mismatch: j })]); return { ok: false, reason: 'montant' }; }
    await grant(txId, j);
    return { ok: true };
  }
  if (st === 'REFUSED') { await q("update payment set status='refused', raw=$2, updated_at=now() where tx_id=$1 and status='pending'", [txId, JSON.stringify(j)]); return { ok: false, reason: 'refuse' }; }
  return { ok: false, reason: 'attente' }; // WAITING_FOR_CUSTOMER : pas un échec
}

// Marque le paiement accepté et crée le pass, une seule fois (idempotent grâce à tx_id unique).
export async function grant(txId, raw = null) {
  const c = await pool.connect();
  try {
    await c.query('begin');
    const { rows } = await c.query("update payment set status='accepted', raw=coalesce($2::jsonb, raw), updated_at=now() where tx_id=$1 and status<>'accepted' returning user_id, plan, period", [txId, raw ? JSON.stringify(raw) : null]);
    if (rows[0]) {
      const { user_id, plan, period } = rows[0];
      // Un renouvellement s'ajoute à la fin du pass en cours.
      const cur = await c.query('select max(ends_at) as e from pass where user_id=$1 and plan=$2 and ends_at>now()', [user_id, plan]);
      const start = cur.rows[0].e || new Date();
      await c.query("insert into pass(user_id,plan,starts_at,ends_at,tx_id) values($1,$2,$3::timestamptz,$3::timestamptz + ($4 || ' month')::interval,$5)", [user_id, plan, start, String(MONTHS[period]), txId]);
    }
    await c.query('commit');
  } catch (e) { await c.query('rollback'); throw e; } finally { c.release(); }
}
