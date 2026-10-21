/* Recette des activités du cycle 4 : catalogue, modèle A04, séparation corrigé/trace. */
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
const ctx = { window: {}, Activite: { h() {}, $() {}, esc: s => s, num: x => Number(x).toFixed(1).replace('.', ',') } }; vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
run('assets/activites/catalogue.js'); run('assets/activites/fiches/NL-C4-A04.js'); run('assets/activites/fiches/NL-C4-B02.js'); run('assets/activites/fiches/NL-C4-C06.js'); run('assets/activites/fiches/NL-C4-D06.js');
const A = ctx.window.ACTIVITES; let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
ok(A.length === 48, '48 activités');
ok(new Set(A.map(a => a.id)).size === 48, 'identifiants uniques');
const cnt = {}; A.forEach(a => cnt[a.decision] = (cnt[a.decision] || 0) + 1);
ok(cnt.socle === 32 && cnt.appui === 5 && cnt.reconcevoir === 1 && cnt.creer === 10, 'répartition 32/5/1/10');
A.forEach(a => { ok(/^NL-C4-[A-D]\d\d$/.test(a.id) && a.id[6] === a.theme, a.id + ' thème'); ok(['5e', '4e', '3e'].includes(a.niveau), a.id + ' niveau'); ok(a.objectif.length > 10, a.id + ' objectif'); });
const sims = new Set(fs.readdirSync(path.join(root, 'assets/sim')).map(f => f.replace(/\.js$/, ''))), les = new Set(fs.readdirSync(path.join(root, 'assets/studio/lecons')).map(f => f.replace(/\.js$/, '')));
A.forEach(a => a.ressources.forEach(r => { const [k, v] = r.split(':'); if (k === 'simulation') ok(sims.has(v), r); else if (k === 'lecon') ok(les.has(v), r); else ok(fs.existsSync(path.join(root, v)), r); }));
ok(A.filter(a => a.statut === 'disponible').map(a => a.id).join() === 'NL-C4-A04,NL-C4-B02,NL-C4-C06,NL-C4-D06', 'quatre pilotes disponibles');
// modèle A04 : la masse d'un système fermé ne change pas, 1 à 10 g
const F = ctx.window.FICHE_A04;
for (let s = F.sucreMin; s <= F.sucreMax; s++) { const e = F.essai(s); ok(e.avant === e.apres, 'masse égale pour ' + s + ' g'); ok(e.avant === 145 + s, 'somme des masses ' + s); }
ok(F.essai(5).avant === 150 && F.essai(10).avant === 155, 'valeurs de référence 150 / 155 g');
ok(F.transfert.rep === 'non', 'transfert');
// pas de corrigé dans les champs élève
const eleve = JSON.stringify([F.situation, F.objectifEleve, F.prevision, F.protocole, F.confrontation, F.retroaction, F.aides]);
ok(!/conservation|150|155/i.test(eleve), 'aucune réponse dans les textes élève');
// B02 : mouvement uniforme, indépendant du rendu
const B = ctx.window.FICHE_B02, M = B.modele_;
ok(M.arrivee(M.VA) === 20 && Math.abs(M.arrivee(M.VB) - 25) < 1e-9, 'arrivées à 20 et 25 s');
ok(6 / 12 === M.VA && Math.abs(8 / 20 - M.VB) < 1e-12, 'vitesses relevées 0,50 et 0,40 m/s');
ok(M.pos(M.VA, 10) === 5 && M.pos(M.VB, 10) === 4 && M.pos(M.VA, 99) === M.D, 'x = v × t, bloqué à 10 m');
// le même temps de modèle donne la même position quel que soit le pas de temps (indépendance du taux d'images)
[1, 2, 5, 17, 60].forEach(fps => { let t = 0; for (let k = 0; k < 20 * fps; k++) t += 1 / fps; ok(Math.abs(M.pos(M.VA, t) - 10) < 1e-6, 'pas ' + fps); });
ok(4 + M.arrivee(M.VA) === B.transfert.rep && B.transfert.rep < M.arrivee(M.VB), 'transfert 24 s < 25 s');
const eB = JSON.stringify([B.situation, B.objectifEleve, B.prevision, B.protocole, B.confrontation, B.retroaction, B.aides]);
ok(!/0,50|0,40|25 s|24 s/.test(eB), 'aucune réponse dans les textes élève B02');
const st = { essais: [{ vA: 0.5, vB: 0.4, pA: 20, pB: 25, oA: 20, oB: 25 }] };
ok(B.lignes(st).length === 2 && B.lignes(st)[0].length === B.colonnes.length, 'tableau d / t / v / prévu / observé');
// C06 : additivité en dérivation et limite de 500 mA
const Cc = ctx.window.FICHE_C06, MC = Cc.modele_;
ok(MC.total(['m1', 'm2']) === 300 && MC.total(['m1', 'm2', 'X']) === 450 && MC.total(['m1', 'm2', 'Y']) === 550, 'totaux 300 / 450 / 550 mA');
ok(MC.total(['m1', 'm2', 'X', 'X']) === 600 && Cc.transfert.rep === 600, 'transfert 600 mA');
ok(MC.decision(450) === 'dans la limite' && /hors spécification/.test(MC.decision(550)) && MC.decision(500) === 'dans la limite', 'décision vs limite');
ok(MC.total(['m1', 'm2', 'Y'].filter(k => k !== 'Y')) === 300, 'retrait d’un module restaure la valeur');
ok(!/coupe automatiquement|coupure systématique/i.test(JSON.stringify(Cc)), 'aucune coupure universelle inventée');
ok(Cc.lignes({ essais: [{ cfg: 'défaut : court-circuit', courants: '—', total: null, decision: 'défaut de court-circuit (non simulé)' }] })[0][2] === '—', 'court-circuit non chiffré');
const eC = JSON.stringify([Cc.situation, Cc.objectifEleve, Cc.prevision, Cc.protocole, Cc.confrontation, Cc.retroaction, Cc.aides]);
ok(!/\b(300|450|550|600) mA/.test(eC), 'aucune réponse dans les textes élève C06');
// D06 : écho aller-retour
const Dd = ctx.window.FICHE_D06, MD = Dd.modele_;
ok(Math.abs(MD.delai(0.64) * 1000 - 8) < 1e-9 && Math.abs(MD.delai(1.15) * 1000 - 5) < 1e-9, '0,64 m → 8,0 ms ; 1,15 m → 5,0 ms');
ok(Math.abs(MD.hauteur(0.008) - 0.64) < 1e-12 && Math.abs(MD.hauteur(0.005) - 1.15) < 1e-12, 'relation inverse');
ok(Math.abs(MD.C * 0.008 - 2.72) < 1e-12 && Math.abs(MD.C * 0.008 / 2 - 1.36) < 1e-12, 'trajet 2,72 m ; distance 1,36 m');
let prev = Infinity; for (let hh = MD.HMIN; hh <= MD.HMAX + 1e-9; hh += 0.05) { const t = MD.delai(hh); ok(t < prev, 'monte → écho plus tôt'); prev = t; ok(t > 0, 'délai positif'); }
ok(Dd.transfert.rep === 'tot', 'transfert plus tôt');
const st0 = { essais: [{ origine: 'calcul', ms: 8, d: 0.008, p: 2.72, q: 2.72, e: 0.64 }] };
ok(Dd.diagnostic(st0).some(x => /aller-retour/.test(x)), 'diagnostic facteur deux (2,72 m pris comme distance)');
ok(Dd.diagnostic({ essais: [{ origine: 'calcul', ms: 8, d: 0.008, p: 2.72, q: 1.36, e: 1.36 }] }).some(x => /soustrais/.test(x)), 'diagnostic repère du fond');
ok(Dd.diagnostic({ essais: [{ origine: 'calcul', ms: 8, d: 8, p: 2.72, q: 1.36, e: 0.64 }] }).some(x => /millisecondes/.test(x)), 'diagnostic unités');
ok(Dd.diagnostic({ essais: [{ origine: 'calcul', ms: 8, d: 0.008, p: 2.72, q: 1.36, e: 0.64 }] }).some(x => /cohérentes/.test(x)), 'calcul juste reconnu');
const eD = JSON.stringify([Dd.situation, Dd.objectifEleve, Dd.prevision, Dd.protocole, Dd.retroaction, Dd.aides]);
ok(!/1,36|0,64|0,85|1,15/.test(eD), 'aucune réponse dans les textes élève D06');
console.log(n + ' assertions activités passées.');
