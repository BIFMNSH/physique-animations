// Environnement de test : base Postgres locale, SMS capturés, période gratuite terminée.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ||= 'postgres://pgtest@127.0.0.1:5544/nl_test';
process.env.BETTER_AUTH_SECRET = 'test-secret-test-secret-test-secret-1234';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.FREE_UNTIL = process.env.FREE_UNTIL || '2020-01-01';

export const SITE = 'https://lab.nohaba.com';
let n = 0;
const RUN = Math.floor(Math.random() * 200) + 20, RUN2 = Math.floor(Math.random() * 200) + 20; // IP simulées différentes à chaque exécution
export async function boot() {
  const { migrate } = await import('../src/db.js');
  const { authOptions } = await import('../src/auth.js');
  await migrate(authOptions);
  const { createApp } = await import('../src/app.js');
  const sms = await import('../src/sms.js');
  const app = createApp();
  const { q, pool } = await import('../src/db.js');

  // Crée un utilisateur par SMS (code lu dans la boîte d'envoi simulée) et renvoie un client HTTP.
  async function login(phone) {
    const ip = `10.${RUN}.${RUN2}.${(++n % 250) + 1}`;
    const h = { 'content-type': 'application/json', origin: SITE, 'x-forwarded-for': ip };
    const s = await app.request('/api/auth/phone-number/send-otp', { method: 'POST', headers: h, body: JSON.stringify({ phoneNumber: phone }) });
    if (s.status !== 200) throw new Error('send-otp ' + s.status + ' ' + (await s.text()));
    await new Promise((r) => setTimeout(r, 30));
    const code = sms.outbox.filter((m) => m.to === phone).at(-1).text.match(/\d{6}/)[0];
    const v = await app.request('/api/auth/phone-number/verify', { method: 'POST', headers: h, body: JSON.stringify({ phoneNumber: phone, code }) });
    if (v.status !== 200) throw new Error('verify ' + v.status + ' ' + (await v.text()));
    const cookie = v.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
    const call = (path, { method = 'GET', body, origin = SITE, noCookie } = {}) => app.request(path, {
      method, headers: { 'content-type': 'application/json', ...(origin ? { origin } : {}), ...(noCookie ? {} : { cookie }), 'x-forwarded-for': ip },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { call, cookie };
  }
  return { app, login, q, pool, sms };
}
const BASE = String(Date.now()).slice(-6); // stable pendant tout le test, différent à chaque exécution
export const phoneFor = (i) => `+22507${BASE}${String(i).padStart(2, '0')}`;
