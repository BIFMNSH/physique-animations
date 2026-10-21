/* Recette des activités du cycle 4 : catalogue, modèle A04, séparation corrigé/trace. */
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
const ctx = { window: {}, Activite: { h() {}, $() {}, esc: s => s, num: x => Number(x).toFixed(1).replace('.', ',') } }; vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
run('assets/activites/catalogue.js'); run('assets/activites/programme.js'); run('assets/activites/visee.js'); run('assets/activites/pedagogie-catalogue.js'); run('assets/activites/fiches/NL-C4-A04.js'); run('assets/activites/fiches/NL-C4-B02.js'); run('assets/activites/fiches/NL-C4-C06.js'); run('assets/activites/fiches/NL-C4-D06.js'); ['A01','C01','D01','D02','A02','C03','D05','C08','B01','B03','B04','B05'].forEach(i => run('assets/activites/fiches/NL-C4-' + i + '.js'));
const A = ctx.window.ACTIVITES; let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
ok(A.length === 48, '48 activités');
ok(new Set(A.map(a => a.id)).size === 48, 'identifiants uniques');
const cnt = {}; A.forEach(a => cnt[a.decision] = (cnt[a.decision] || 0) + 1);
ok(cnt.socle === 32 && cnt.appui === 5 && cnt.reconcevoir === 1 && cnt.creer === 10, 'répartition 32/5/1/10');
A.forEach(a => { ok(/^NL-C4-[A-D]\d\d$/.test(a.id) && a.id[6] === a.theme, a.id + ' thème'); ok(['5e', '4e', '3e'].includes(a.niveau), a.id + ' niveau'); ok(a.objectif.length > 10, a.id + ' objectif'); });
const sims = new Set(fs.readdirSync(path.join(root, 'assets/sim')).map(f => f.replace(/\.js$/, ''))), les = new Set(fs.readdirSync(path.join(root, 'assets/studio/lecons')).map(f => f.replace(/\.js$/, '')));
A.forEach(a => a.ressources.forEach(r => { const [k, v] = r.split(':'); if (k === 'simulation') ok(sims.has(v), r); else if (k === 'lecon') ok(les.has(v), r); else ok(fs.existsSync(path.join(root, v)), r); }));
ok(A.filter(a => a.statut === 'disponible').map(a => a.id).join() === 'NL-C4-A01,NL-C4-A02,NL-C4-A04,NL-C4-B01,NL-C4-B02,NL-C4-B03,NL-C4-B04,NL-C4-B05,NL-C4-C01,NL-C4-C03,NL-C4-C06,NL-C4-C08,NL-C4-D01,NL-C4-D02,NL-C4-D05,NL-C4-D06', 'seize activités disponibles');
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

// lot 2 : A02, C03, D05, C08
const A2 = ctx.window.FICHE_A02, MA = A2.modele_;
ok(MA.affichage(MA.posee('plein', 'eau'), 0) - MA.affichage(MA.posee('vide', 'eau'), 0) === 60, 'A02 : 102 − 42 = 60 g');
ok(MA.affichage(MA.posee('plein', 'eau'), MA.posee('vide', 'eau')) === 60 && MA.affichage(MA.posee('vide', 'eau'), MA.posee('vide', 'eau')) === 0, 'A02 : tare vide → 0 puis 60 g');
ok(MA.posee('plein', 'eau') === 102 && MA.posee('plein', 'huile') - MA.FLACON === 54 && MA.posee('plein', 'alcool') - MA.FLACON === 48, 'A02 : 60 mL, masses différentes');
ok(A2.transfert.rep === 48 && 90 - MA.FLACON === 48, 'A02 transfert 48 g');
ok(A2.diagnostic({ essais: [{ liq: 'Liquide A', vide: 42, plein: 102, tare: 60 }] })[0].includes('même masse'), 'A02 : essai cohérent reconnu');
ok(A2.diagnostic({ essais: [{ liq: 'Liquide A', vol: 60, vide: 42, plein: 102, tare: 60 }, { liq: 'Liquide C', vol: 60, vide: 42, plein: 90, tare: 48 }] }).some(x => /même volume.*pas les mêmes/.test(x)), 'A02 : deux liquides de même volume, masses différentes');
ok(A2.diagnostic({ essais: [{ liq: 'Liquide A', vol: 64, vide: 42, plein: 102, tare: 60 }] }).some(x => /ménisque/.test(x)), 'A02 : lecture de volume faussée repérée');
ok(/ne se correspondent pas/.test(A2.diagnostic({ essais: [{ liq: 'Liquide A', vide: 42, plein: 102, tare: 102 }] })[0]), 'A02 : incohérence repérée');
ok(!/\b(48|54)\b|60 g/.test(JSON.stringify([A2.objectifEleve, A2.protocole, A2.confrontation, A2.retroaction, A2.aides])), 'A02 : aucune réponse dans les textes élève');
const C3 = ctx.window.FICHE_C03, MC3 = C3.modele_;
[[1,1],[1,0],[0,1],[0,0]].forEach(([a, b]) => { const s = MC3.etat('serie', !!a, !!b), d = MC3.etat('deriv', !!a, !!b); ok(s.l1 === s.l2 && s.l1 === !!(a && b), 'C03 série ' + a + b); ok(d.l1 === !!a && d.l2 === !!b, 'C03 dérivation ' + a + b); });
ok(C3.transfert.rep === 'eteintes' && C3.lignes({ essais: [{ montage: 'deriv', s1: false, s2: true, l1: false, l2: true }] })[0][5] === 'allumée', 'C03 transfert et table');
ok(C3.diagnostic({ essais: [{ montage: 'deriv', s1: true, s2: true }] })[0].includes('1 état'), 'C03 diagnostic états manquants');
ok(!/Montage B \(une branche/.test(JSON.stringify(C3.prevision)) , 'C03 prévision neutre');
ok(MC3.etat('serie', true, true, { gril1: true }).l2 === false && MC3.etat('deriv', true, true, { gril1: true }).l2 === true && MC3.etat('deriv', true, true, { gril1: true }).l1 === false, 'C03 lampe grillée : série coupe tout, dérivation isole la lampe');
[['serie', 1, 1], ['serie', 1, 0], ['deriv', 1, 1], ['deriv', 0, 1]].forEach(([m, a, b]) => { const e = MC3.etat(m, !!a, !!b, { g: false }); ok(!e.l1 && !e.l2, 'C03 interrupteur général ouvert : tout éteint ' + m + a + b); });
ok(MC3.nbEtats({ essais: [{ montage: 'serie', s1: true, s2: true }, { montage: 'serie', s1: true, s2: true }, { montage: 'deriv', s1: true, s2: true, gril: true }] }) === 1, 'C03 comptage des états sans défaut');
const D5 = ctx.window.FICHE_D05, MD5 = D5.modele_;
ok(MD5.delai(3.4) === 10 && MD5.delai(6.8) === 20 && MD5.delai(1.7) === 5 && MD5.t2(3.4) === 14, 'D05 : délais 10 / 20 / 5 ms');
ok(Math.abs(3.4 / (MD5.delai(3.4) / 1000) - 340) < 1e-9 && Math.abs(6.8 / (MD5.delai(6.8) / 1000) - 340) < 1e-9, 'D05 : 340 m/s aux deux distances');
ok(D5.transfert.rep === 5, 'D05 transfert 5,0 ms');
ok(MD5.delai(3.4, 'lente') === 9.5 && MD5.delai(1.7, 'lente') === 5.5 && MD5.delai(6.8, 'lente') === 20.5 && MD5.delai(3.4, 'precise') === 10, 'D05 horloge moins précise : 9,5 / 5,5 / 20,5 ms');
const vL = d => d / (MD5.delai(d, 'lente') / 1000), er = d => Math.abs(vL(d) - 340) / 340;
ok(er(1.7) > er(3.4) - 1e-9 && er(3.4) > er(6.8), 'D05 : l’erreur relative diminue quand la distance augmente');
ok(/cohérents/.test(D5.diagnostic({ essais: [{ dist: 3.4, hor: 'lente', t1: 4, t2: 13.5, dl: 0.0095, v: 357.9 }] }).join(' ')) && /horloge moins précise/.test(D5.diagnostic({ essais: [{ dist: 3.4, hor: 'lente', t1: 4, t2: 13.5, dl: 0.0095, v: 357.9 }] }).join(' ')), 'D05 diagnostic horloge moins précise');
const e5 = (o) => D5.diagnostic({ essais: [Object.assign({ dist: 3.4, t1: 4, t2: 14, dl: 0.01, v: 340 }, o)] }).join(' ');
ok(/cohérents/.test(e5({})), 'D05 calcul juste');
ok(/millisecondes/.test(e5({ dl: 10, v: 0.34 })), 'D05 conversion');
ok(/soustraire/.test(e5({ dl: 0.014, v: 242.9 })), 'D05 horodatage seul');
ok(/aller-retour/.test(e5({ v: 680 })), 'D05 aller-retour');
ok(!/340|0,0100|10,0/.test(JSON.stringify([D5.objectifEleve, D5.protocole, D5.confrontation, D5.retroaction, D5.aides])), 'D05 : aucune réponse dans les textes élève');
const C8 = ctx.window.FICHE_C08, M8 = C8.modele_;
ok(M8.energieWh(60, 2) === 120 && M8.energieWh(15, 10) === 150 && M8.energieWh(20, 3) === 60 && C8.transfert.rep === 60, 'C08 : 120 / 150 / 60 Wh');
ok(M8.APP.d.U * M8.APP.d.I === M8.APP.d.P && M8.APP.d.P === 6, 'C08 : 12 V × 0,50 A = 6 W');
ok(M8.enJoules(120) === 432000 && M8.energieWh(60, 4) === 2 * M8.energieWh(60, 2), 'C08 : 120 Wh = 432000 J ; t double → E double');
const e8 = (o) => C8.diagnostic({ essais: [Object.assign({ app: 'a', nom: 'Appareil A', t: 2, P: 60, E: 120 }, o)] }).join(' ');
ok(M8.energieWh(5, 24) === 120 && M8.energieWh(100, 2) === 200 && M8.energieWh(5, 24) > M8.energieWh(100, 2) / 2, 'C08 : veille 120 Wh vs actif 200 Wh'); ok(/cohérentes/.test(e8({})), 'C08 calcul juste'); ok(/durée n’est pas prise/.test(e8({ E: 60 })), 'C08 oubli durée'); ok(/joules/.test(e8({ E: 432000 })), 'C08 joules');
ok(/somme/.test(e8({ app: 'd', nom: 'Récepteur D', t: 2, P: 12.5, E: 25 })), 'C08 somme U+I');
ok(!/consommation de|pas de coût|€|CO2|F CFA/.test(JSON.stringify(C8.synthese)) || /Sans tarif/.test(C8.synthese), 'C08 : pas de coût inventé');
ok(!/\b(120|150|60) Wh|432/.test(JSON.stringify([C8.objectifEleve, C8.protocole, C8.confrontation, C8.retroaction, C8.aides])), 'C08 : aucune réponse dans les textes élève');

// lot 3 : thème B — B01, B03, B04, B05
const B1 = ctx.window.FICHE_B01, M1 = B1.modele_;
ok(M1.xVehicule() === 2 && [0, 2, 4, 6].map(M1.xSol).join() === '2,10,18,26', 'B01 : 2 m constant dans le véhicule ; 2/10/18/26 m au sol');
ok(B1.transfert.rep === 'oui', 'B01 transfert');
const sb1 = { essais: [{ ref: 'sol', t: 0, x: 2, xs: 2.5 }, { ref: 'sol', t: 2, x: 10, xs: 10.5 }, { ref: 'vehicule', t: 0, x: 2, xs: 2.5 }, { ref: 'vehicule', t: 2, x: 2, xs: 2.5 }] };
ok(/ne varie pas.*varie/.test(B1.diagnostic(sb1)[0]) && /manque/.test(B1.diagnostic({ essais: [] })[0]), 'B01 diagnostic');
ok(!/\b(2,0|10|18|26|4 m\/s)\b/.test(JSON.stringify([B1.objectifEleve, B1.protocole, B1.confrontation, B1.retroaction, B1.aides])), 'B01 : aucune réponse dans les textes élève');
const B3 = ctx.window.FICHE_B03, M3 = B3.modele_;
ok(M3.dists(M3.MOB.A.p).join() === '1,1,1' && M3.dists(M3.MOB.B.p).join() === '1,2,3' && M3.dists(M3.MOB.C.p).join() === '3,2,1', 'B03 : distances 1/1/1, 1/2/3, 3/2/1');
ok(M3.nature([1, 1, 1]) === 'uniforme' && M3.nature([1, 2, 3]) === 'accelere' && M3.nature([3, 2, 1]) === 'ralenti', 'B03 natures');
ok(/cohérentes/.test(B3.diagnostic({ essais: [{ mob: 'B', nom: 'Mobile B', d: [1, 2, 3], q: 'accelere' }] })[0]) && /ne correspond pas/.test(B3.diagnostic({ essais: [{ mob: 'B', nom: 'Mobile B', d: [1, 2, 3], q: 'uniforme' }] })[0]) && /soustrayant/.test(B3.diagnostic({ essais: [{ mob: 'B', nom: 'Mobile B', d: [0, 1, 3], q: 'accelere' }] })[0]), 'B03 diagnostic');
ok(B3.transfert.rep === 'oui', 'B03 transfert');
ok(!/accélér|ralenti|uniforme|1,0|2,0|3,0/.test(JSON.stringify([B3.situation, B3.prevision, B3.protocole.slice(0, 3), B3.confrontation, B3.retroaction, B3.aides.slice(0, 2)])), 'B03 : pas de réponse dans les textes élève');
const B4 = ctx.window.FICHE_B04, M4 = B4.modele_;
ok(M4.attendu(90, 'anti') === 180 && M4.attendu(0, 'anti') === 90 && M4.attendu(180, 'anti') === 270 && M4.attendu(270, 'anti') === 0, 'B04 : tangente sens trigo');
ok([0, 45, 90, 135, 180, 225, 270, 315].every(t => M4.attendu(t, 'horaire') === M4.norm(M4.attendu(t, 'anti') + 180)), 'B04 : inversion du sens inverse la flèche');
ok([0, 45, 90, 135, 180, 225, 270, 315].every(t => Math.abs(Math.cos((M4.attendu(t, 'anti') - t) * Math.PI / 180)) < 1e-9), 'B04 : flèche perpendiculaire au rayon');
ok(/tangente et suit/.test(B4.diagnostic({ essais: [{ theta: 90, sens: 'anti', alpha: 180 }] })[0]) && /mauvais sens/.test(B4.diagnostic({ essais: [{ theta: 90, sens: 'anti', alpha: 0 }] })[0]) && /rayon/.test(B4.diagnostic({ essais: [{ theta: 90, sens: 'anti', alpha: 90 }] })[0]), 'B04 diagnostic');
ok(B4.transfert.rep === 'trois' && M4.VAL === 1, 'B04 transfert et valeur constante');
const B5 = ctx.window.FICHE_B05, M5 = B5.modele_;
ok(M5.CAND.find(o => o.k === 'fil').t === 'contact' && M5.CAND.find(o => o.k === 'terre').t === 'distance' && M5.CAND.find(o => o.k === 'aimant').t === 'distance' && M5.CAND.find(o => o.k === 'air').t === 'negligee', 'B05 : natures des actions');
ok(/cohérent/.test(B5.diagnostic({ essais: [{ kind: 'diagramme', v: { fil: 'contact', terre: 'distance', aimant: 'distance', air: 'negligee' } }] })[0]) && /sans la toucher/.test(B5.diagnostic({ essais: [{ kind: 'diagramme', v: { fil: 'contact', terre: 'distance', aimant: 'contact', air: 'negligee' } }] })[0]), 'B05 diagnostic');
ok(B5.lignes({ essais: [{ kind: 'scenario', s: 'fil' }] })[0][2] === 'la masse tombe', 'B05 scénario fil retiré (la masse tombe)');
ok(B5.transfert.rep === 'deux', 'B05 transfert');

// programme du cycle 4 : compétences, objectifs, savoir-faire et évaluation de chaque activité
const PR = ctx.window.PROGRAMME;
ok(Object.keys(PR.competences).length === 6 && PR.niveaux.length === 4 && ['A', 'B', 'C', 'D'].every(k => PR.themes[k].nom === ctx.window.THEMES[k]), 'programme : compétences, niveaux, thèmes alignés avec le catalogue');
ok(PR.competences.demarche.socle === '4' && /Mesurer des grandeurs physiques de manière directe ou indirecte/.test(PR.competences.demarche.cap.mesure), 'programme : libellés officiels');
const dispo = A.filter(a => a.statut === 'disponible');
dispo.forEach(a => {
  const F = ctx.window['FICHE_' + a.id.slice(-3)], P = F.pedagogie; ok(!!P, a.id + ' : pedagogie');
  ok(P.theme === a.theme, a.id + ' : thème cohérent avec le catalogue');
  ok(PR.themes[P.theme].attendus[P.attendu], a.id + ' : attendu de fin de cycle existant');
  ok(P.connaissance.length > 30, a.id + ' : connaissance du programme');
  ok(P.competences.length === 1 && P.competences.every(c => PR.competences[c[0]] && PR.competences[c[0]].cap[c[1]]), a.id + ' : une seule compétence, tirée du programme');
  ok(P.objectifs.length >= 3 && new Set(P.objectifs.map(o => o.id)).size === P.objectifs.length, a.id + ' : au moins trois objectifs distincts');
  P.objectifs.forEach(o => {
    ok(/^Je sais /.test(o.eleve) && !/\d/.test(o.eleve), a.id + ' ' + o.id + ' : énoncé élève sans donnée chiffrée');
    ok(o.savoirFaire.length >= 1 && o.indicateur.length > 15 && o.preuve.length > 3 && o.objectif.length > 15, a.id + ' ' + o.id + ' : savoir-faire, indicateur, preuve');
  });
  ok(P.objectifs.some(o => /Transfert|transfert/.test(o.preuve)) || P.objectifs.some(o => /Tableau|Manipulation|Confrontation|Prévision/.test(o.preuve)), a.id + ' : objectifs reliés à une étape observable');
});

// activités en conception : même cadre (compétences, objectifs, savoir-faire, évaluation)
const PC = ctx.window.PEDAGOGIE_CATALOGUE, conc = A.filter(a => a.statut !== 'disponible');
ok(conc.length === 32 && Object.keys(PC).length === 32 && conc.every(a => PC[a.id]), 'catalogue : 32 activités en conception, toutes renseignées');
conc.forEach(a => { const P = PC[a.id];
  ok(P.theme === a.theme, a.id + ' (conception) : thème'); ok(PR.themes[P.theme].attendus[P.attendu], a.id + ' (conception) : attendu'); ok(P.connaissance.length > 30, a.id + ' (conception) : connaissance');
  ok(P.competences.length === 1 && P.competences.every(c => PR.competences[c[0]] && PR.competences[c[0]].cap[c[1]]), a.id + ' (conception) : une seule compétence du programme');
  ok(P.objectifs.length === 3 && new Set(P.objectifs.map(o => o.id)).size === 3, a.id + ' (conception) : trois objectifs');
  P.objectifs.forEach(o => { ok(/^Je sais /.test(o.eleve) && !/\d/.test(o.eleve), a.id + ' ' + o.id + ' (conception) : énoncé élève'); ok(o.savoirFaire.length >= 1 && o.indicateur.length > 15 && o.preuve.length > 3 && o.objectif.length > 15, a.id + ' ' + o.id + ' (conception) : savoir-faire, indicateur, preuve'); });
});
ok(Object.keys(PC).every(k => !dispo.some(a => a.id === k)), 'aucun doublon entre fiches produites et catalogue en conception');
// lot 4 : A01, C01, D01, D02
const A1 = ctx.window.FICHE_A01, MA1 = A1.modele_;
ok(MA1.FORMES.bloc === 'propre' && MA1.FORMES.eau === 'recipient' && MA1.OCC.air === 'tout' && MA1.COMP.air === 'oui' && MA1.COMP.eau === 'non', 'A01 : modèle des trois états');
ok(MA1.volAffiche('eau', false) === MA1.volAffiche('eau', true) && MA1.volAffiche('air', true) < MA1.volAffiche('air', false), 'A01 : volume du liquide conservé, gaz comprimé');
ok(/cohérentes/.test(A1.diagnostic({ essais: [{ c: 'air', nom: 'L’air', r: 'haut', forme: 'recipient', occ: 'tout', comp: 'oui' }] })[0]) && /compression/.test(A1.diagnostic({ essais: [{ c: 'eau', nom: 'L’eau', r: 'haut', forme: 'recipient', occ: 'bas', comp: 'oui' }] })[0]), 'A01 : diagnostic');
ok(A1.transfert.rep === 'non' && !/grain/.test(JSON.stringify([A1.objectifEleve, A1.protocole, A1.confrontation, A1.retroaction, A1.aides])), 'A01 : transfert, pas de réponse dans les textes élève');
const C1 = ctx.window.FICHE_C01, MC1 = C1.modele_;
ok(MC1.formeSource('pile') === 'chimique' && MC1.formeSource('solaire') === 'rayonnement' && MC1.SORTIE === 'lumth' && MC1.BILAN === 'autant', 'C01 : chaînes pile / solaire');
ok(/cohérentes/.test(C1.diagnostic({ essais: [{ s: 'pile', nom: 'x', a: 'chimique', b: 'lumth', c: 'autant' }, { s: 'solaire', nom: 'y', a: 'rayonnement', b: 'lumth', c: 'autant' }] })[0]) && /bilan/.test(C1.diagnostic({ essais: [{ s: 'pile', nom: 'x', a: 'chimique', b: 'lumth', c: 'plus' }] })[0]) && /un seul montage/.test(C1.diagnostic({ essais: [{ s: 'pile', nom: 'x', a: 'chimique', b: 'lumth', c: 'autant' }] }).join(' ')), 'C01 : diagnostic');
ok(C1.transfert.rep === 'bonne', 'C01 : transfert moteur');
const D1 = ctx.window.FICHE_D01, MD1 = D1.modele_;
ok(MD1.visible('carte', false) === false && MD1.visible('carte', true) && MD1.trajet('carte', true) === 'diffuse' && MD1.trajet('source', true) === 'direct' && MD1.trajet('carte', false) === 'aucun' && MD1.type('carte') === 'diffusant' && MD1.type('source') === 'primaire', 'D01 : modèle visibilité / trajets / types');
ok(/cohérentes/.test(D1.diagnostic({ essais: [{ o: 'carte', on: false, nom: 'c', a: 'non', b: 'aucun', c: 'diffusant' }, { o: 'carte', on: true, nom: 'c', a: 'oui', b: 'diffuse', c: 'diffusant' }] })[0]) && /visibilité/.test(D1.diagnostic({ essais: [{ o: 'carte', on: false, nom: 'c', a: 'oui', b: 'aucun', c: 'diffusant' }] })[0]), 'D01 : diagnostic');
ok(D1.transfert.rep === 'diff', 'D01 : transfert Lune');
const D2 = ctx.window.FICHE_D02, MD2 = D2.modele_;
ok(MD2.ombre(30) === 12 && MD2.ombre(20) === 18 && MD2.ombre(40) === 9 && MD2.ombre(45) === 8 && MD2.rapport(30) === 2 && MD2.rapport(20) === 3, 'D02 : ombre 12 / 18 / 9 / 8 cm, facteurs 2 et 3');
ok(MD2.DIST.every(d => Math.abs(MD2.ombre(d) / MD2.DISQUE - MD2.DE / d) < 0.06), 'D02 : proportion ombre/disque = 60/d');
ok(/cohérents/.test(D2.diagnostic({ essais: [{ d: 30, omb: 12, rap: 2 }, { d: 20, omb: 18, rap: 3 }] }).join(' ')) && /rapport/.test(D2.diagnostic({ essais: [{ d: 30, omb: 12, rap: 5 }] })[0]) && /ombre/.test(D2.diagnostic({ essais: [{ d: 30, omb: 8, rap: 1.33 }] })[0]), 'D02 : diagnostic');
ok(D2.transfert.rep === 'oui' && !/\b30\b|\b12\b/.test(JSON.stringify([D2.objectifEleve, D2.protocole, D2.confrontation, D2.retroaction, D2.aides])), 'D02 : transfert, pas de réponse dans les textes élève');

// compétence visée et sous-compétences (présentation Thème / Chapitre / Compétence visée / être capable de)
const VZ = ctx.window.VISEE;
ok(A.every(a => VZ[a.id]) && Object.keys(VZ).length === 48, 'visée : 48 activités renseignées');
A.forEach(a => { const v = VZ[a.id]; ok(/^[A-ZÉÈÀ][a-zéèêàâîôûç]+(er|ir|re|dre)\b/.test(v.visee) && /\.$/.test(v.visee) && v.capable.length >= 3 && v.capable.length <= 5 && v.capable.every(c => /^[A-ZÉÈÀ]/.test(c) && !/[.;]$/.test(c) && c.length >= 15), a.id + ' : visée à l’infinitif, 3 à 5 sous-compétences'); });
ok(!/\b\d+([,.]\d+)? ?(g|cm|mL|ms|m\/s|W|Wh)\b/.test(JSON.stringify(VZ)), 'visée : aucune valeur de correction');

console.log(n + ' assertions activités passées.');
