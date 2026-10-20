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
  const own = await q('select plan, ends_at from pass where user_id=$1 and ends_at>now() order by ends_at desc limit 1', [userId]);
  if (own.rows[0]) return { level: 'pass', plan: own.rows[0].plan, until: own.rows[0].ends_at };
  const viaClass = await q(
    `select max(p.ends_at) as ends_at from class_member m join classe c on c.id=m.class_id
     join pass p on p.user_id=c.owner_id and p.plan='prof' and p.ends_at>now() where m.user_id=$1`, [userId]);
  if (viaClass.rows[0]?.ends_at) return { level: 'classe', until: viaClass.rows[0].ends_at };
  return { level: 'aucun', until: null };
}
