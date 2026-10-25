// Classement entre élèves, par classe, via le compte. Principes :
//  - les points sont calculés ICI, à partir d'événements enregistrés par le serveur (jamais envoyés par l'appareil) ;
//  - pseudo généré, jamais libre ; aucun nom, photo, téléphone ni résultat de quiz n'est exposé ;
//  - participation volontaire ; accord d'un parent confirmé par SMS pour les moins de 15 ans ;
//  - visible seulement par les membres de la classe et son enseignant.
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { q } from './db.js';
import { cfg, origins } from './config.js';
import { sendSms } from './sms.js';

export const LESSONS = JSON.parse(readFileSync(new URL('./lessons.json', import.meta.url), 'utf8'));
const KNOWN = new Set(Object.values(LESSONS).flatMap((themes) => themes.flatMap((t) => t.lessons)));
export const isKnownLesson = (id) => KNOWN.has(id);

// Valeurs proposées, à valider avec le professeur.
export const POINTS = { resume: 10, sim: 20, defi: 20, quiz: 30 };
export const LEVELS = [['Observateur', 0], ['Expérimentateur', 80], ['Chercheur', 240], ['Analyste', 480], ['Scientifique', 800]];
// Anti-abus (ingénierie, pas de pédagogie) : au plus 6 étapes comptées par minute et par élève.
export const MAX_EVENTS_PER_MINUTE = 6;
const CASE = `case e.step ${Object.entries(POINTS).map(([k, v]) => `when '${k}' then ${v | 0}`).join(' ')} else 0 end`;

const ADJ = ['Rapide', 'Malin', 'Vif', 'Calme', 'Sur', 'Curieux', 'Joyeux', 'Brillant', 'Agile', 'Fute', 'Patient', 'Audacieux'];
const NOUN = ['Atome', 'Ion', 'Photon', 'Neutron', 'Electron', 'Quark', 'Mole', 'Prisme', 'Aimant', 'Circuit', 'Cristal', 'Plasma', 'Spectre', 'Orbite'];
const PSEUDO_RE = new RegExp(`^(${NOUN.join('|')})-(${ADJ.join('|')})-\\d{2}$`);
export const randomPseudo = () => `${NOUN[randomInt(NOUN.length)]}-${ADJ[randomInt(ADJ.length)]}-${String(randomInt(100)).padStart(2, '0')}`;
export const isPseudoAllowed = (p) => typeof p === 'string' && PSEUDO_RE.test(p);

export function levelOf(xp) {
  let i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][1]) i++;
  const next = LEVELS[i + 1] || null;
  return { num: i + 1, name: LEVELS[i][0], from: LEVELS[i][1], next: next ? next[0] : null, to: next ? next[1] : null, left: next ? next[1] - xp : 0, pct: next ? Math.round(((xp - LEVELS[i][1]) * 100) / (next[1] - LEVELS[i][1])) : 100 };
}

// Badges calculés à partir des étapes réellement enregistrées (réussie = résumé, simulation, défi et quiz).
export function badgesFor(classe, progress) {
  const themes = LESSONS[classe] || [];
  const ok = (id) => { const p = progress[id] || {}; return p.resume === true && p.sim === true && p.defi === true && p.quiz === true; };
  const all = themes.flatMap((t) => t.lessons), done = all.filter(ok).length;
  const defis = Object.values(progress).filter((p) => p && p.defi === true).length;
  const out = [
    { id: 'premiere-lecon', name: 'Première leçon réussie', rule: 'Terminer les activités et réussir le quiz d’une leçon.', cur: Math.min(1, done), max: 1 },
    { id: 'premier-defi', name: 'Premier défi', rule: 'Terminer un défi.', cur: Math.min(1, defis), max: 1 },
  ];
  for (const t of themes) out.push({ id: 'theme-' + t.theme.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: 'Thème ' + t.theme, rule: `Réussir les ${t.lessons.length} leçons du thème ${t.theme}.`, cur: t.lessons.filter(ok).length, max: t.lessons.length });
  out.push({ id: 'classe-' + classe, name: `Classe de ${classe} terminée`, rule: `Réussir toutes les leçons de la classe de ${classe}.`, cur: done, max: all.length });
  return out.map((b) => ({ ...b, got: b.cur >= b.max }));
}

const sha = (s) => createHash('sha256').update(s).digest('hex');
const weekStart = "(date_trunc('week', now() at time zone 'UTC') at time zone 'UTC')";

async function totals(userIds) {
  if (!userIds.length) return new Map();
  const { rows } = await q(`select e.user_id, coalesce(sum(${CASE}),0)::int total, coalesce(sum(${CASE}) filter (where e.at >= ${weekStart}),0)::int week
    from progress_event e where e.user_id = any($1) group by e.user_id`, [userIds]);
  return new Map(rows.map((r) => [r.user_id, r]));
}

// Enregistre les étapes terminées (appelé par PUT /api/progress). Les points ne viennent que d'ici.
export async function recordEvents(userId, lessonId, steps) {
  if (!isKnownLesson(lessonId)) return 0;
  let added = 0;
  for (const step of Object.keys(POINTS)) {
    if (steps[step] !== true) continue;
    const recent = (await q(`select count(*)::int n from progress_event where user_id=$1 and at > now() - interval '60 seconds'`, [userId])).rows[0].n;
    if (recent >= MAX_EVENTS_PER_MINUTE) break;
    added += (await q('insert into progress_event(user_id, lesson_id, step) values($1,$2,$3) on conflict do nothing', [userId, lessonId, step])).rowCount;
  }
  return added;
}

export function registerClassement(app, { fail, tooMany, ipOf }) {
  const visible = `lp.opt_in and (lp.under15 = false or lp.consent_at is not null)`;
  async function profileRow(uid) {
    let r = (await q('select * from leaderboard_profile where user_id=$1', [uid])).rows[0];
    if (!r) {
      for (let i = 0; i < 8 && !r; i++) {
        try { r = (await q('insert into leaderboard_profile(user_id, pseudo) values($1,$2) on conflict (user_id) do nothing returning *', [uid, randomPseudo()])).rows[0] || (await q('select * from leaderboard_profile where user_id=$1', [uid])).rows[0]; }
        catch (e) { if (e.code !== '23505') throw e; }
      }
    }
    return r;
  }
  const consentState = (r) => (r.under15 === false ? 'inutile' : r.under15 === null ? 'inconnu' : r.consent_at ? 'accorde' : r.consent_hash ? 'en_attente' : 'requis');

  app.get('/api/classement/me', async (c) => {
    const u = c.get('user'), r = await profileRow(u.id);
    const classe = (await q('select classe from app_profile where user_id=$1', [u.id])).rows[0]?.classe || '6e';
    const t = (await totals([u.id])).get(u.id) || { total: 0, week: 0 };
    const prog = Object.fromEntries((await q('select lesson_id, steps from progress where user_id=$1', [u.id])).rows.map((x) => [x.lesson_id, x.steps]));
    return c.json({ pseudo: r.pseudo, optIn: r.opt_in, under15: r.under15, consent: consentState(r), xp: t.total, week: t.week, level: levelOf(t.total), points: POINTS, classe, badges: badgesFor(classe, prog) });
  });

  // Trois pseudos proposés (jamais enregistrés tant que l'élève n'en choisit pas un).
  app.get('/api/classement/pseudos', async (c) => c.json({ pseudos: Array.from({ length: 3 }, randomPseudo) }));
  app.post('/api/classement/pseudo', async (c) => {
    const u = c.get('user'), b = await c.req.json().catch(() => ({}));
    if (!isPseudoAllowed(b.pseudo)) return fail(c, 400, 'Choisis un pseudo dans la liste proposée.');
    await profileRow(u.id);
    try { await q('update leaderboard_profile set pseudo=$2, updated_at=now() where user_id=$1', [u.id, b.pseudo]); }
    catch (e) { if (e.code === '23505') return fail(c, 409, 'Ce pseudo est déjà pris, choisis-en un autre.'); throw e; }
    return c.json({ pseudo: b.pseudo });
  });

  app.post('/api/classement/optin', async (c) => {
    const u = c.get('user'), b = await c.req.json().catch(() => ({}));
    if (typeof b.optIn !== 'boolean') return fail(c, 400, 'Choix invalide');
    let r = await profileRow(u.id);
    if (b.under15 !== undefined) {
      if (typeof b.under15 !== 'boolean') return fail(c, 400, 'Réponse invalide');
      if (r.under15 !== b.under15) { await q('update leaderboard_profile set under15=$2, consent_at=null, consent_hash=null, opt_in=false where user_id=$1', [u.id, b.under15]); r = await profileRow(u.id); }
    }
    if (b.optIn) {
      if (r.under15 === null) return fail(c, 400, 'Indique si tu as 15 ans ou plus.');
      if (r.under15 === true && !r.consent_at) return c.json({ error: 'L’accord d’un parent est nécessaire.', code: 'consent_required' }, 403);
    }
    await q('update leaderboard_profile set opt_in=$2, updated_at=now() where user_id=$1', [u.id, b.optIn]);
    return c.json({ optIn: b.optIn });
  });

  // Demande d'accord : un SMS part chez le parent (son numéro n'est pas conservé).
  app.post('/api/classement/consent/request', async (c) => {
    const u = c.get('user'), b = await c.req.json().catch(() => ({}));
    const r = await profileRow(u.id);
    if (r.under15 !== true) return fail(c, 400, 'Cette demande concerne les moins de 15 ans.');
    const phone = String(b.parentPhone || '').replace(/[\s.-]/g, '');
    if (!cfg.phoneRegex.test(phone)) return fail(c, 400, 'Numéro du parent invalide.');
    if (u.phoneNumber && u.phoneNumber === phone) return fail(c, 400, 'Utilise le numéro d’un parent, pas le tien.');
    if (tooMany(`consent:${u.id}`, 3, 24 * 3600_000)) return fail(c, 429, 'Trop de demandes aujourd’hui.');
    const token = randomBytes(24).toString('base64url');
    await q('update leaderboard_profile set consent_hash=$2, consent_at=null, opt_in=false where user_id=$1', [u.id, sha(token)]);
    await sendSms(phone, `NOHOBA-Lab : votre enfant demande votre accord pour apparaître sous un pseudo (sans nom ni photo) dans le classement de sa classe. Pour répondre : ${cfg.siteUrl}/accord/#${token}`);
    return c.json({ sent: true });
  });

  // Réponse du parent : pas de session, le jeton secret fait foi.
  const parentRoute = (path, fn) => app.post(path, async (c) => {
    const o = c.req.header('origin'); if (!o || !origins().includes(o)) return fail(c, 403, 'Origine refusée');
    if (tooMany(`parent:${ipOf(c)}`, 20, 3600_000)) return fail(c, 429, 'Trop d’essais');
    const b = await c.req.json().catch(() => ({}));
    if (typeof b.token !== 'string' || b.token.length < 20 || b.token.length > 64) return fail(c, 400, 'Lien invalide');
    return fn(c, sha(b.token));
  });
  parentRoute('/api/classement/consent/confirm', async (c, h) => {
    const r = await q('update leaderboard_profile set consent_at=now() where consent_hash=$1 and under15 = true returning user_id', [h]);
    return r.rowCount ? c.json({ ok: true }) : fail(c, 404, 'Lien inconnu ou déjà retiré');
  });
  parentRoute('/api/classement/consent/revoke', async (c, h) => {
    const r = await q('update leaderboard_profile set consent_at=null, opt_in=false where consent_hash=$1 returning user_id', [h]);
    return r.rowCount ? c.json({ ok: true }) : fail(c, 404, 'Lien inconnu');
  });

  // Classement de la semaine d'une classe (membre ou enseignant uniquement).
  app.get('/api/classement/classes/:id', async (c) => {
    const u = c.get('user'), id = Number(c.req.param('id'));
    const cl = (await q('select c.id, c.name, c.level, c.owner_id from classe c where c.id=$1 and (c.owner_id=$2 or exists(select 1 from class_member m where m.class_id=c.id and m.user_id=$2))', [id, u.id])).rows[0];
    if (!cl) return fail(c, 404, 'Classe introuvable');
    const members = (await q('select user_id from class_member where class_id=$1', [id])).rows.map((x) => x.user_id);
    const rows = (await q(`select lp.user_id, lp.pseudo from class_member m join leaderboard_profile lp on lp.user_id=m.user_id where m.class_id=$1 and ${visible}`, [id])).rows;
    const t = await totals(members);
    const list = rows.map((r) => ({ user_id: r.user_id, pseudo: r.pseudo, week: t.get(r.user_id)?.week || 0, level: levelOf(t.get(r.user_id)?.total || 0).name }))
      .sort((a, b) => b.week - a.week || a.pseudo.localeCompare(b.pseudo));
    let rank = 0, prev = null, shown = 0;
    const ranked = list.map((r, i) => { if (r.week !== prev) { rank = i + 1; prev = r.week; } return { ...r, rank }; });
    const classWeek = members.reduce((n, m) => n + (t.get(m)?.week || 0), 0);
    const mine = ranked.find((r) => r.user_id === u.id);
    const strip = (r) => ({ rank: r.rank, pseudo: r.pseudo, level: r.level, week: r.week, me: r.user_id === u.id });
    const top = ranked.slice(0, 10).map(strip);
    return c.json({ class: { id: cl.id, name: cl.name, level: cl.level, students: members.length }, participants: ranked.length, classWeek, top, me: mine && !top.some((x) => x.me) ? strip(mine) : null, meListed: !!mine });
  });
}
