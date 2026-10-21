import { q } from './db.js';
import { cfg } from './config.js';

const todayIso = () => new Date().toISOString().slice(0, 10);
export const inFreePeriod = () => todayIso() <= cfg.freeUntil;

// Qui a le droit de voir le contenu premium ?
//  - tout le monde pendant la période gratuite ;
//  - un pass personnel en cours ;
//  - un élève membre d'une classe dont l'enseignant a un pass « prof » en cours.
export async function accessFor(userId) {
  if (inFreePeriod()) return { level: 'gratuit', until: cfg.freeUntil };
  if (!userId) return { level: 'aucun', until: null };
  const own = await q('select plan, ends_at, themes from pass where user_id=$1 and ends_at>now() order by ends_at desc limit 1', [userId]);
  if (own.rows[0]) return { level: 'pass', plan: own.rows[0].plan, until: own.rows[0].ends_at, themes: own.rows[0].themes ?? null };
  const viaClass = await q(
    `select p.ends_at, p.themes from class_member m join classe c on c.id=m.class_id
     join pass p on p.user_id=c.owner_id and p.plan='prof' and p.ends_at>now() where m.user_id=$1`, [userId]);
  if (viaClass.rows[0]) return { level: 'classe', until: viaClass.rows.reduce((m, r) => (r.ends_at > m ? r.ends_at : m), viaClass.rows[0].ends_at), themes: mergeThemes(viaClass.rows.map((r) => r.themes)) };
  return { level: 'aucun', until: null };
}

// Thèmes : « A,C » → ['A','C'] ; NULL → tous. Plusieurs pass : un seul NULL suffit à tout ouvrir.
export const ALL_THEMES = ['A', 'B', 'C', 'D'];
export function mergeThemes(list) {
  if (list.some((t) => t == null)) return null;
  return [...new Set(list.flatMap((t) => String(t).split(',').map((x) => x.trim().toUpperCase()).filter((x) => ALL_THEMES.includes(x))))];
}
// Le thème principal d'une activité (NL-C4-A04 → A) décide de son habilitation ; une ressource partagée n'exige pas un deuxième abonnement.
export const themeOfActivity = (id) => (/^NL-C4-([A-D])\d\d$/.exec(id) || [])[1] || null;
export function coversTheme(a, theme) {
  if (!theme) return false;
  if (a.level === 'gratuit') return true;
  if (a.level === 'aucun') return false;
  return a.themes == null || a.themes.includes(theme);
}
