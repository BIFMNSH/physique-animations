import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { readFile } from 'node:fs/promises';
import { randomInt } from 'node:crypto';
import { auth, providers } from './auth.js';
import { q } from './db.js';
import { cfg, origins } from './config.js';
import { accessFor, inFreePeriod, coversTheme, themeOfActivity } from './access.js';
import { PLANS } from './plans.js';
import { startPayment, settle, grant } from './pay.js';
import { registerClassement, recordEvents } from './classement.js';

const ROLES = ['eleve', 'enseignant', 'etablissement'];
const LEVELS = ['6e', '5e', '4e', '3e'];
const fail = (c, status, message) => c.json({ error: message }, status);

// Limiteur simple en mémoire, par clé (suffisant pour 1 instance ; Better Auth gère le sien en base).
const hits = new Map();
function tooMany(key, max, windowMs) {
  const now = Date.now(), arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > windowMs) hits.delete(k);
  return arr.length > max;
}
const ipOf = (c) => (c.req.header('x-forwarded-for') || '').split(',')[0].trim() || 'local';

export function createApp() {
  const app = new Hono();
  app.use('*', secureHeaders());
  app.use('/api/*', cors({ origin: (o) => (origins().includes(o) ? o : null), credentials: true, allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], maxAge: 600 }));

  app.get('/health', (c) => c.json({ ok: true }));
  app.all('/api/auth/*', (c) => auth.handler(c.req.raw));

  // Tout le reste exige un corps JSON court et, sauf exceptions, une session.
  app.use('/api/*', async (c, next) => {
    if (c.req.path.startsWith('/api/auth/') || c.req.path === '/api/pay/notify') return next();
    return bodyLimit({ maxSize: 20 * 1024, onError: (cc) => cc.json({ error: 'Requête trop grande' }, 413) })(c, next);
  });
  const PUBLIC = new Set(['/api/providers', '/api/plans', '/api/pay/notify', '/api/classement/consent/confirm', '/api/classement/consent/revoke']);
  app.use('/api/*', async (c, next) => {
    const p = c.req.path;
    if (p.startsWith('/api/auth/') || PUBLIC.has(p)) return next();
    const s = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!s) return fail(c, 401, 'Connexion requise');
    // Protection CSRF des écritures : l'origine doit être connue.
    if (c.req.method !== 'GET') { const o = c.req.header('origin'); if (!o || !origins().includes(o)) return fail(c, 403, 'Origine refusée'); }
    c.set('user', s.user);
    return next();
  });

  app.get('/api/providers', (c) => c.json({ providers: providers(), freeUntil: cfg.freeUntil, free: inFreePeriod(), pay: cfg.payMode !== 'off' }));
  app.get('/api/plans', (c) => c.json({ currency: 'XOF', plans: PLANS, free: inFreePeriod(), freeUntil: cfg.freeUntil }));

  // ---------- Profil ----------
  async function profileOf(id) { return (await q('select role, classe, display_name from app_profile where user_id=$1', [id])).rows[0] || { role: null, classe: null, display_name: null }; }
  app.get('/api/me', async (c) => {
    const u = c.get('user');
    return c.json({ user: { id: u.id, name: u.name, image: u.image || null, phone: u.phoneNumber || null }, profile: await profileOf(u.id), access: await accessFor(u.id) });
  });
  app.post('/api/me/profile', async (c) => {
    const u = c.get('user'); const b = await c.req.json().catch(() => ({}));
    if (!ROLES.includes(b.role)) return fail(c, 400, 'Rôle inconnu');
    if (b.classe != null && !LEVELS.includes(b.classe)) return fail(c, 400, 'Classe inconnue');
    const name = typeof b.displayName === 'string' ? b.displayName.trim().slice(0, 40) : null;
    await q(`insert into app_profile(user_id, role, classe, display_name) values($1,$2,$3,$4)
             on conflict (user_id) do update set role=excluded.role, classe=excluded.classe, display_name=coalesce(excluded.display_name, app_profile.display_name)`, [u.id, b.role, b.classe ?? null, name || null]);
    return c.json({ profile: await profileOf(u.id) });
  });
  // Droit à l'effacement (loi 2013-450) : supprime le compte et tout ce qui s'y rattache.
  app.delete('/api/me', async (c) => { await q('delete from "user" where id=$1', [c.get('user').id]); return c.json({ ok: true }); });

  // ---------- Progression ----------
  app.get('/api/progress', async (c) => {
    const { rows } = await q('select lesson_id, steps, updated_at from progress where user_id=$1', [c.get('user').id]);
    return c.json({ progress: Object.fromEntries(rows.map((r) => [r.lesson_id, r.steps])) });
  });
  app.put('/api/progress', async (c) => {
    const b = await c.req.json().catch(() => ({}));
    if (typeof b.lessonId !== 'string' || !/^[a-z0-9-]{1,60}$/.test(b.lessonId)) return fail(c, 400, 'Leçon invalide');
    const steps = {};
    for (const k of ['resume', 'sim', 'defi', 'quiz']) if (b.steps?.[k] === true) steps[k] = true;
    // On fusionne : une étape terminée ne se « dé-termine » pas.
    await q(`insert into progress(user_id, lesson_id, steps) values($1,$2,$3)
             on conflict (user_id, lesson_id) do update set steps = progress.steps || excluded.steps, updated_at=now()`, [c.get('user').id, b.lessonId, JSON.stringify(steps)]);
    await recordEvents(c.get('user').id, b.lessonId, steps); // les points sont décidés ici, jamais par l'appareil
    return c.json({ ok: true });
  });

  // ---------- Classes ----------
  const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const newCode = () => Array.from({ length: 6 }, () => ALPHA[randomInt(ALPHA.length)]).join('').replace(/^(...)(...)$/, '$1-$2');
  app.post('/api/classes', async (c) => {
    const u = c.get('user'); const p = await profileOf(u.id);
    if (p.role !== 'enseignant' && p.role !== 'etablissement') return fail(c, 403, 'Réservé aux enseignants');
    const b = await c.req.json().catch(() => ({}));
    const name = typeof b.name === 'string' ? b.name.trim().slice(0, 60) : '';
    if (!name || !LEVELS.includes(b.level)) return fail(c, 400, 'Nom et niveau requis');
    if ((await q('select count(*)::int n from classe where owner_id=$1', [u.id])).rows[0].n >= 20) return fail(c, 400, 'Limite de 20 classes atteinte');
    for (let i = 0; i < 5; i++) {
      try { const { rows } = await q('insert into classe(owner_id,name,level,code) values($1,$2,$3,$4) returning id, name, level, code', [u.id, name, b.level, newCode()]); return c.json({ class: rows[0] }, 201); }
      catch (e) { if (e.code !== '23505') throw e; }
    }
    return fail(c, 500, 'Code indisponible, réessaie');
  });
  app.get('/api/classes', async (c) => {
    const u = c.get('user');
    const mine = await q('select c.id, c.name, c.level, c.code, (select count(*)::int from class_member m where m.class_id=c.id) as students from classe c where owner_id=$1 order by c.id', [u.id]);
    const joined = await q('select c.id, c.name, c.level from class_member m join classe c on c.id=m.class_id where m.user_id=$1', [u.id]);
    return c.json({ owned: mine.rows, joined: joined.rows });
  });
  app.post('/api/classes/join', async (c) => {
    const u = c.get('user');
    if (tooMany(`join:${u.id}:${ipOf(c)}`, 8, 60_000)) return fail(c, 429, 'Trop d’essais, attends une minute');
    const b = await c.req.json().catch(() => ({}));
    const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(...)(...)$/, '$1-$2');
    const { rows } = await q('select id, name, level from classe where code=$1', [code]);
    if (!rows[0]) return fail(c, 404, 'Code de classe inconnu');
    await q('insert into class_member(class_id,user_id) values($1,$2) on conflict do nothing', [rows[0].id, u.id]);
    return c.json({ class: rows[0] });
  });
  // L'enseignant voit, pour chaque élève de sa classe, les étapes terminées (jamais de téléphone ni d'e-mail).
  app.get('/api/classes/:id/progress', async (c) => {
    const u = c.get('user'); const id = Number(c.req.param('id'));
    const cl = (await q('select id, name, level from classe where id=$1 and owner_id=$2', [id, u.id])).rows[0];
    if (!cl) return fail(c, 404, 'Classe introuvable');
    const { rows } = await q(
      `select m.user_id, coalesce(p.display_name, u.name) as name,
              coalesce(jsonb_object_agg(g.lesson_id, g.steps) filter (where g.lesson_id is not null), '{}') as progress
       from class_member m join "user" u on u.id=m.user_id left join app_profile p on p.user_id=m.user_id
       left join progress g on g.user_id=m.user_id where m.class_id=$1 group by m.user_id, p.display_name, u.name order by 2`, [id]);
    return c.json({ class: cl, students: rows.map((r, i) => ({ n: i + 1, name: r.name, progress: r.progress })) });
  });
  app.delete('/api/classes/:id/members/:uid', async (c) => {
    const u = c.get('user');
    const r = await q('delete from class_member m using classe c where m.class_id=c.id and c.id=$1 and c.owner_id=$2 and m.user_id=$3', [Number(c.req.param('id')), u.id, c.req.param('uid')]);
    return c.json({ removed: r.rowCount });
  });

  registerClassement(app, { fail, tooMany, ipOf });

  // ---------- Paiement ----------
  app.post('/api/pay/init', async (c) => {
    const u = c.get('user'); const b = await c.req.json().catch(() => ({}));
    if (tooMany(`pay:${u.id}`, 6, 60_000)) return fail(c, 429, 'Trop d’essais');
    try { return c.json(await startPayment(u, { plan: b.plan, period: b.period })); }
    catch (e) { return fail(c, e.status || 500, e.status ? e.message : 'Erreur paiement'); }
  });
  app.get('/api/pay/status/:tx', async (c) => {
    const { rows } = await q('select tx_id, plan, period, amount, status from payment where tx_id=$1 and user_id=$2', [c.req.param('tx'), c.get('user').id]);
    return rows[0] ? c.json(rows[0]) : fail(c, 404, 'Paiement introuvable');
  });
  // Appelée par CinetPay (POST, parfois GET). Toujours 200 : la vérité vient de /payment/check.
  const notify = async (c) => {
    let tx = c.req.query('cpm_trans_id'), site = c.req.query('cpm_site_id');
    if (c.req.method === 'POST') { const f = await c.req.parseBody().catch(() => ({})); tx = f.cpm_trans_id || tx; site = f.cpm_site_id || site; }
    if (typeof tx === 'string' && /^[A-Z0-9]{6,40}$/.test(tx) && !tooMany(`notify:${ipOf(c)}`, 60, 60_000)) {
      try { await settle(tx, site); } catch (e) { console.error('[notify]', e.message); }
    }
    return c.text('OK');
  };
  app.post('/api/pay/notify', notify);
  app.get('/api/pay/notify', notify);
  // Simulation (jamais en production) pour tester le parcours sans CinetPay.
  app.post('/api/pay/mock-confirm', async (c) => {
    if (cfg.prod || cfg.payMode !== 'mock') return fail(c, 404, 'Introuvable');
    const b = await c.req.json().catch(() => ({}));
    const { rows } = await q('select 1 from payment where tx_id=$1 and user_id=$2', [b.tx, c.get('user').id]);
    if (!rows[0]) return fail(c, 404, 'Paiement introuvable');
    await grant(b.tx); return c.json({ ok: true });
  });

  // ---------- Contenu verrouillé côté serveur ----------
  app.get('/api/content/:name', async (c) => {
    const name = c.req.param('name');
    if (!/^[a-z0-9-]{1,60}$/.test(name)) return fail(c, 400, 'Nom invalide');
    const a = await accessFor(c.get('user').id);
    if (a.level === 'aucun') return c.json({ error: 'Pass requis', plans: PLANS }, 402);
    try { return c.body(await readFile(new URL(`../private/${name}.json`, import.meta.url), 'utf8'), 200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' }); }
    catch { return fail(c, 404, 'Contenu introuvable'); }
  });

  // ---------- Activités du cycle 4 : habilitation par thème, corrigé réservé à l'enseignant ----------
  const ACT = /^NL-C4-[A-D]\d\d$/;
  app.get('/api/activites/:id/acces', async (c) => {
    const id = c.req.param('id'); if (!ACT.test(id)) return fail(c, 400, 'Identifiant invalide');
    const a = await accessFor(c.get('user').id), theme = themeOfActivity(id);
    if (!coversTheme(a, theme)) return c.json({ error: 'Pass requis pour ce thème', theme, plans: PLANS }, 402);
    return c.json({ ok: true, id, theme, level: a.level, until: a.until });
  });
  app.get('/api/activites/:id/corrige', async (c) => {
    const id = c.req.param('id'); if (!ACT.test(id)) return fail(c, 400, 'Identifiant invalide');
    const a = await accessFor(c.get('user').id), theme = themeOfActivity(id);
    if (!coversTheme(a, theme)) return c.json({ error: 'Pass requis pour ce thème', theme, plans: PLANS }, 402);
    // Le corrigé est réservé aux enseignants : profil « enseignant » pendant la période gratuite, puis pass enseignant. Jamais un pass élève ni l'accès par une classe.
    const role = (await q('select role from app_profile where user_id=$1', [c.get('user').id])).rows[0]?.role;
    const prof = a.level === 'gratuit' ? role === 'enseignant' : a.level === 'pass' && a.plan === 'prof';
    if (!prof) return fail(c, 403, 'Réservé aux enseignants');
    try { return c.body(await readFile(new URL(`../private/activites/${id}.json`, import.meta.url), 'utf8'), 200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' }); }
    catch { return fail(c, 404, 'Corrigé introuvable'); }
  });

  app.onError((e, c) => { console.error('[erreur]', e); return c.json({ error: 'Erreur serveur' }, 500); });
  app.notFound((c) => c.json({ error: 'Introuvable' }, 404));
  return app;
}
