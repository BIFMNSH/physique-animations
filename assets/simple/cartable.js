/* Cartable NOHOBA-Lab (essai), 5e : « La tension aux bornes de deux lampes ».
   Le livre (à gauche) raconte, fait manipuler et donne le bilan ; le cahier de labo (à droite) recueille la pensée de l'élève en neuf moments.
   Chaque mesure faite dans le livre s'envole vers le tableau du cahier. Sur écran étroit, le cahier devient un tiroir.
   Modèle : pile 4,5 V, lampes assimilées à des résistances constantes (L1 20 Ω, L2 40 Ω) ; valeurs de simulation.
   Progression dans « pc-cartable-tension » ; rien n'est envoyé. */
(function () {
  'use strict';
  var UG = 4.5, R1 = 20, R2 = 40, CLE = 'pc-cartable-tension', INK = '#243049', OR = '#F97316', BL = '#0B6FA8';
  function r2(x) { return Math.round(x * 100) / 100; }
  function tension(d, ferme) {
    if (d === 'G') return UG;
    if (d === 'K') return ferme ? 0 : UG;
    if (!ferme) return 0;
    return r2((d === 'L1' ? R1 : R2) * UG / (R1 + R2));
  }
  function fv(x) { return String(x).replace('.', ',') + ' V'; }
  function num(s) { var v = parseFloat(String(s).replace(',', '.').replace(/[^0-9.\-]/g, '')); return isNaN(v) ? null : v; }
  window.NohobaCartable = { tension: tension, fv: fv };

  var A = window.NohobaAtelier, esc = A.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- contenus ---------- */
  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var HYP = ['Chaque lampe a 4,5 V à ses bornes, comme la pile.', 'Chaque lampe a la moitié de la tension de la pile.', 'Les deux lampes n’ont pas la même tension.'];
  var NOMS = { G: 'la pile', L1: 'la lampe L1', L2: 'la lampe L2', K: 'l’interrupteur K' };
  var G2 = [
    { q: 'Quelle grandeur cherche-t-on à mesurer ?', o: ['la tension', 'l’intensité', 'la température'], b: 0, h: 'Relis la question : elle parle de ce que le voltmètre indiquera.' },
    { q: 'Avec quel appareil ?', o: ['un voltmètre', 'un ampèremètre', 'un thermomètre'], b: 0, h: 'Un ampèremètre mesure l’intensité, un thermomètre la température.' },
    { q: 'Comment le brancher aux bornes d’une lampe ?', o: ['en série, dans le circuit', 'en dérivation, aux bornes de la lampe'], b: 1, h: 'Pour un ampèremètre, on coupe le circuit. Un voltmètre se branche sans rien couper.' }
  ];
  var U1 = tension('L1', true), U2 = tension('L2', true), UK = tension('K', false);
  var DEFI = [
    { t: 'n', q: 'En série, U(G) = 9 V et U(L1) = 3,5 V. Combien vaut U(L2), en volts ?', r: 5.5, u: 'V', e: 'U(L2) = 9 V − 3,5 V = 5,5 V.' },
    { t: 'c', q: 'L’interrupteur K est ouvert. Que lit le voltmètre à ses bornes ?', c: ['0 V', fv(UK), fv(U1)], b: 1, e: 'Aux bornes d’un interrupteur ouvert, on lit la tension de la pile : ' + fv(UK) + '.' },
    { t: 'c', q: 'Dans ton cahier, quelle lampe a la plus grande tension à ses bornes ?', c: ['L1', 'L2', 'Les deux sont égales'], b: 1, e: 'U(L2) = ' + fv(U2) + ' est plus grande que U(L1) = ' + fv(U1) + '.' },
    { t: 'c', q: 'Deux lampes sont en dérivation sur une pile de 4,5 V. Quelle tension aux bornes de chaque lampe ?', c: ['2,25 V', '4,5 V', '9 V'], b: 1, e: 'En dérivation, les tensions sont égales : 4,5 V.' },
    { t: 'c', q: 'Le voltmètre affiche −4,5 V. Que s’est-il passé ?', c: ['La pile est vide', 'Les fils du voltmètre sont inversés', 'Le circuit est ouvert'], b: 1, e: 'La borne COM est du côté + de la pile : les fils sont inversés.' },
    { t: 'n', q: 'Convertis : 250 mV = … V', r: 0.25, u: 'V', e: '1 V = 1 000 mV, donc 250 mV = 250 ÷ 1 000 = 0,25 V.' }
  ];
  var CRIT = ['J’ai écrit mes trois mesures.', 'J’ai écrit que la tension de la pile est égale à U1 + U2.', 'J’ai dit que les deux lampes n’ont pas la même tension.', 'J’ai écrit l’unité, le volt (V).'];
  var LIGNES = [['G', 'Pile'], ['L1', 'Lampe L1'], ['L2', 'Lampe L2'], ['Kouv', 'Interrupteur K ouvert']];
  var CHAP = ['La situation', 'Le laboratoire', 'Ce que disent tes mesures', 'Le défi'];
  var SPREADS = [['s1l', 's1r'], ['s2l', 's2r'], ['s3l', 's3r'], ['s4l', 's4r']];
  var SGL = ['s1l', 's1r', 'lab', 's3l', 's3r', 's4r'], SGL2SP = [0, 0, 1, 2, 2, 3], SP2SGL = [0, 2, 3, 5];
  var CH_OF = { s1l: 0, s1r: 0, s2l: 1, s2r: 1, lab: 1, s3l: 2, s3r: 2, s4l: 3, s4r: 3 };
  var MOML = { s1l: 'Moments 1 à 3', s1r: 'Moments 1 à 3', s2l: 'Moments 4 à 6', s2r: 'Moments 4 à 6', lab: 'Moments 4 à 6', s3l: 'Moment 7', s3r: 'Moment 8', s4l: 'Moment 9', s4r: 'Moment 9' };

  /* ---------- état ---------- */
  function neuf() { return { m: 1, nom: '', mat: [0, 0, 0], hyp: null, car: '', mes: {}, somme: 0, egal: 0, jug: null, bilan: '', crit: [0, 0, 0, 0], rep: [], fini: false, pos: 0, vuBilan: 0 }; }
  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE));
      if (v && typeof v === 'object' && typeof v.m === 'number' && v.mat && v.mes && v.crit && v.rep) { v.m = Math.min(9, Math.max(1, Math.round(v.m))); v.pos = Math.min(5, Math.max(0, v.pos | 0)); return v; }
    } catch (e) {}
    return neuf();
  }
  var S = neuf(), L = { dip: null, ferme: true }, L0 = false, mode = 'dbl', busy = false, anim = true, son = true, profOn = false;
  function sauve() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {} }
  function fait() { return S.mes.G != null && S.mes.L1 != null && S.mes.L2 != null; }
  function score() { return S.rep.reduce(function (a, b) { return a + b; }, 0); }
  function etoiles() { var s = score(); return s >= 5 ? 3 : s >= 3 ? 2 : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function spreadDe(m) { return m <= 3 ? 0 : m <= 6 ? 1 : m <= 8 ? 2 : 3; }

  /* ---------- dessins ---------- */
  /* banc : pile en haut, L1 à droite, K à gauche, L2 en bas ; voltmètre au centre, fil orange (borne V) sur la borne + du dipôle, fil bleu (COM) sur la borne − */
  function montage(dip, ferme, sansV) {
    var v = dip ? tension(dip, ferme) : null;
    return A.banc5e({ n: 2, on: ferme, dip: sansV ? null : dip, volt: !sansV, txt: v == null || sansV ? null : fv(v), k1: .5, k2: 1,
      label: 'Montage : pile de 4,5 V, interrupteur ' + (ferme ? 'fermé' : 'ouvert') + ' et lampes L1 et L2 en série' + (ferme ? ', allumées. ' : ', éteintes. ') + (dip ? 'Le voltmètre est branché aux bornes de ' + NOMS[dip] + ' et indique ' + fv(v) + '.' : 'Le voltmètre n’est pas encore branché.') }).svg;
  }
  var PV = {
    G: { v: [[260, 40], [260, -8], [237, -8]], c: [[180, 40], [180, -8], [203, -8]], o: [220, -8], h: [220, 40, 30] },
    L1: { v: [[340, 62], [400, 62], [400, 83]], c: [[340, 138], [400, 138], [400, 117]], o: [400, 100], h: [340, 100, 30] },
    L2: { v: [[275, 160], [275, 205], [237, 205]], c: [[165, 160], [165, 205], [203, 205]], o: [220, 205], h: [220, 160, 30] },
    K: { v: [[100, 138], [44, 138], [44, 117]], c: [[100, 62], [44, 62], [44, 83]], o: [44, 100], h: [100, 100, 32] }
  };
  function poly(p, col) { return '<path d="M' + p.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L') + '" fill="none" stroke="' + col + '" stroke-width="3.5" stroke-linejoin="round"/><circle cx="' + p[0][0] + '" cy="' + p[0][1] + '" r="5" fill="' + col + '"/>'; }
  function schema(dip, ferme) {
    var s = A.schema({ cotes: { droite: 'lampe', bas: 'lampe', gauche: ferme ? 'interFerme' : 'interOuvert' }, legende: '', label: 'Schéma normalisé : pile, lampes L1 et L2 et interrupteur K en série.' + (dip ? ' Le voltmètre est branché en dérivation aux bornes de ' + NOMS[dip] + '.' : '') }), x = '';
    if (dip) {
      var p = PV[dip];
      x += '<circle cx="' + p.h[0] + '" cy="' + p.h[1] + '" r="' + p.h[2] + '" fill="' + OR + '" fill-opacity=".14" stroke="' + OR + '" stroke-width="2.5" stroke-dasharray="6 5"/>';
      x += poly(p.v, OR) + poly(p.c, BL) + '<circle cx="' + p.o[0] + '" cy="' + p.o[1] + '" r="17" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' + A.T(p.o[0], p.o[1] + 6, 'V', 17, INK, 800);
    }
    x += A.T(316, 105, 'L1', 15, INK, 800, 'end') + A.T(220, 131, 'L2', 15, INK, 800) + A.T(124, 105, 'K', 15, INK, 800, 'start');
    return s.replace('viewBox="0 0 440 200"', dip ? 'viewBox="0 -40 440 270"' : 'viewBox="0 8 440 180"').replace('</svg>', x + '</svg>');
  }
  function barres() {
    var a = S.mes.L1 == null ? U1 : S.mes.L1, b = S.mes.L2 == null ? U2 : S.mes.L2, g = S.mes.G == null ? UG : S.mes.G, W = 320, x0 = 88, wa = W * a / g;
    var s = '<svg viewBox="0 0 420 150" role="img" aria-label="Barres : la tension de la pile, ' + fv(g) + ', est égale à ' + fv(a) + ' pour L1 plus ' + fv(b) + ' pour L2.">'
      + A.T(0, 46, 'Pile', 16, 'currentColor', 800, 'start') + '<rect x="' + x0 + '" y="22" width="' + W + '" height="36" rx="8" fill="' + INK + '"/>' + A.T(x0 + W / 2, 46, fv(g), 17, '#fff', 800)
      + A.T(0, 112, 'Lampes', 16, 'currentColor', 800, 'start') + '<rect x="' + x0 + '" y="88" width="' + (wa - 2) + '" height="36" rx="8" fill="' + OR + '"/><rect x="' + (x0 + wa + 2) + '" y="88" width="' + (W - wa - 2) + '" height="36" rx="8" fill="' + BL + '"/>'
      + A.T(x0 + wa / 2, 112, 'L1 ' + fv(a), 15, '#fff', 800) + A.T(x0 + wa + (W - wa) / 2, 112, 'L2 ' + fv(b), 15, '#fff', 800)
      + '<path d="M' + x0 + ' 64 V82 M' + (x0 + W) + ' 64 V82" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/></svg>';
    return '<div class="barres">' + s + '</div>';
  }

  /* ---------- pages du livre ---------- */
  function pop(inner, cls) { return '<div class="stage ' + cls + '"><div class="psh"></div><div class="panel">' + inner + '</div></div>'; }
  function ouvre(txt, extra) { return mode === 'desk' ? '' : '<button type="button" class="go" data-ouvre' + (extra || '') + '>' + txt + '</button>'; }
  function ctl() {
    return '<div class="ecran"><small data-ll>Voltmètre non branché</small><output data-lv>— V</output></div><div class="dips" role="group" aria-label="Brancher le voltmètre aux bornes de">'
      + [['G', 'Pile'], ['L1', 'L1'], ['L2', 'L2'], ['K', 'K']].map(function (d) { return '<button type="button" data-d="' + d[0] + '" aria-pressed="false" aria-label="Brancher le voltmètre aux bornes de ' + NOMS[d[0]] + '">' + d[1] + '</button>'; }).join('')
      + '</div><button type="button" class="btn large" data-ksw>Ouvrir l’interrupteur</button>';
  }
  var LEG = '<p class="leg"><i style="background:' + OR + '"></i>fil orange : borne V, côté + &nbsp; <i style="background:' + BL + '"></i>fil bleu : borne COM, côté −</p>';
  function contenu(id) {
    switch (id) {
      case 's1l': return '<h1>Deux lampes, une seule pile</h1><p class="hook">Au TP, Awa et Kofi branchent en série une pile de 4,5 V, un interrupteur et deux lampes différentes, L1 et L2.</p>'
        + '<div class="bulle k"><b>Kofi</b>« Comme pour l’intensité, c’est pareil partout : chaque lampe aura 4,5 V. »</div><div class="bulle a"><b>Awa</b>« Je n’en suis pas sûre. Mesurons avec un voltmètre. »</div>'
        + '<p class="loi">Quelle tension aux bornes de chaque lampe ?</p><p>La <b class="u">tension</b> se note U. Elle se mesure en volts (V), avec un voltmètre.</p>'
        + '<details class="comp"><summary>Ce que je vais apprendre</summary><p class="th">Thème : Mesure de grandeurs physiques</p><p>Chapitre : La tension électrique</p><p><b>Compétence visée :</b> mesurer une tension avec un voltmètre.</p><p>À la fin de cette partie, je dois être capable de dire que la tension de la pile est égale à la somme des tensions aux bornes des lampes.</p></details>'
        + '<div class="note">' + (mode === 'desk' ? 'Ton cahier de labo est posé à côté du livre : tu y notes tes idées, tes mesures et ton bilan.' : 'Ton cahier de labo est dans le bouton « Mon cahier » : tu y notes tes idées, tes mesures et ton bilan.') + '</div>';
      case 's1r': return '<h2>Le circuit d’Awa et Kofi</h2>' + pop('<div data-m0>' + montage(null, L0, true) + '</div>', 'p-s1')
        + '<button type="button" class="btn large" data-k0>' + (L0 ? 'Ouvrir' : 'Fermer') + ' l’interrupteur</button><div class="fig2" data-s0>' + schema(null, L0) + '</div>' + ouvre('Ouvrir mon cahier');
      case 's2l': return '<h2>Le laboratoire</h2>' + pop('<div data-lmont></div>', 'p-lab') + LEG;
      case 's2r': return '<h2>Branche le voltmètre</h2>' + ctl() + '<div class="fig2" data-lsch></div><p class="lmsg" data-lm aria-live="polite"></p><div class="note">Chaque mesure s’écrit toute seule dans ton cahier.</div>' + ouvre('Mes mesures sont dans mon cahier', ' data-fait hidden');
      case 'lab': return '<h2>Le laboratoire</h2>' + pop('<div data-lmont></div>', 'p-labs') + ctl() + '<div class="fig2 petit" data-lsch></div><p class="lmsg" data-lm aria-live="polite"></p>' + ouvre('Mes mesures sont dans mon cahier', ' data-fait hidden');
      case 's3l': return '<h1>Ce que disent tes mesures</h1><p class="hook">Mets tes trois mesures côte à côte.</p>' + barres()
        + '<p>Les deux barres ont la même longueur : la tension de la pile se partage entre les deux lampes. L2 en reçoit plus que L1.</p>'
        + '<div class="note">Et en dérivation ? Chaque lampe aurait toute la tension de la pile, 4,5 V.</div>' + (S.m === 7 ? ouvre('Écrire mon bilan dans mon cahier') : '');
      case 's3r': return '<h2>Le bilan scientifique</h2><div class="tab"><div class="bs"><p>Dans un circuit en série, la tension aux bornes de la pile est égale à la somme des tensions aux bornes des récepteurs.</p><p class="loi">U = U1 + U2</p><p>Deux lampes différentes n’ont pas forcément la même tension.</p><p>Le voltmètre se branche en dérivation, aux bornes du dipôle : borne V du côté +, borne COM du côté −.</p></div>'
        + '<button type="button" class="lang' + (S.m >= 8 && S.vuBilan ? ' up' : '') + '"' + (S.m >= 8 && !S.vuBilan ? ' data-auto' : '') + ' disabled>Écris d’abord ton bilan dans ton cahier. Cette page s’ouvrira ensuite.</button></div>' + (S.m === 8 ? ouvre('Je compare dans mon cahier') : '');
      case 's4l': return '<h1>Le défi</h1><p class="hook">Six manches, seul ou en équipe. Une erreur ne retire rien : chaque manche t’explique la réponse.</p><p class="stars" aria-label="' + (S.rep.length ? etoiles() : 0) + ' étoiles sur 3">' + stars(S.rep.length ? etoiles() : 0) + '</p><p>Score : ' + score() + ' sur ' + DEFI.length + '.</p><div class="note">Ton score s’écrit dans ton cahier.</div>';
      case 's4r': return defiPage();
    }
    return '';
  }
  function defiPage() {
    if (S.fini) return '<h2>Défi terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p class="hook">' + score() + ' manches réussies sur ' + DEFI.length + '.</p><div class="note">Ton cahier est complet : tu peux l’imprimer.</div>' + ouvre('Voir mon cahier') + '<button type="button" class="btn large" data-again>Recommencer le cartable</button>';
    if (S.m < 9) return '<h2>Le défi</h2><p>Termine d’abord ton cahier.</p>';
    var i = S.rep.length, q = DEFI[i];
    var corps = q.t === 'c' ? '<div class="ch" data-dq role="group" aria-label="Réponses possibles">' + q.c.map(function (o, k) { return '<button type="button" data-i="' + k + '">' + o + '</button>'; }).join('') + '</div>'
      : '<form class="num" data-dn><label class="sr" for="dv">Ta réponse en ' + q.u + '</label><input id="dv" data-dv inputmode="decimal" autocomplete="off"><span>' + q.u + '</span><button class="btn">Valider</button></form>';
    return (mode === 'sgl' && i === 0 ? '<h2>Le défi</h2>' : '') + '<p class="tag"><span>Manche ' + (i + 1) + ' sur ' + DEFI.length + '</span></p><h2>' + q.q + '</h2>' + corps + '<div data-dx aria-live="polite"></div>';
  }
  function tag(id) { var c = CH_OF[id]; return '<div class="tag"><span>Chapitre ' + (c + 1) + ' · ' + CHAP[c] + '</span><span>' + MOML[id] + '</span></div>'; }
  function page(id, side) { return '<div class="page ' + side + '" data-pg="' + id + '">' + tag(id) + contenu(id) + '</div>'; }
  function nu(id, side) { return page(id, side).replace(/ id="[^"]*"/g, ''); }

  /* ---------- cahier ---------- */
  function btn(id, txt, dis) { return '<button type="button" class="bt go" id="' + id + '"' + (dis ? ' disabled' : '') + '>' + txt + '</button>'; }
  function ch(id, opts, sel, nom, cls) { return '<div class="ch ' + (cls || '') + '" data-ch="' + id + '" role="group" aria-label="' + esc(nom || '') + '">' + opts.map(function (o, i) { return '<button type="button" data-i="' + i + '" aria-pressed="' + (sel === i) + '">' + o + '</button>'; }).join('') + '</div>'; }
  function tableau(recap) {
    return '<table class="tb"><caption class="sr">Tensions mesurées avec le voltmètre</caption><thead><tr><th scope="col">Aux bornes de</th><th scope="col">Tension U</th></tr></thead><tbody>'
      + LIGNES.filter(function (l) { return !recap || S.mes[l[0]] != null; }).map(function (l) { var v = S.mes[l[0]]; return '<tr data-k="' + l[0] + '"><th scope="row">' + l[1] + '</th><td>' + (v == null ? '<span class="vide">' + (l[0] === 'Kouv' ? 'facultatif' : 'à mesurer') + '</span>' : fv(v)) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function mesuresTxt() { return 'U(L1) = ' + fv(S.mes.L1 == null ? U1 : S.mes.L1) + ' et U(L2) = ' + fv(S.mes.L2 == null ? U2 : S.mes.L2); }
  function verdict() {
    if (S.hyp === 0) return { ok: false, txt: 'Aucune lampe n’a 4,5 V : ' + mesuresTxt() + '.' };
    if (S.hyp === 1) return { ok: false, txt: 'Les lampes n’ont pas la moitié chacune : ' + mesuresTxt() + '. Les deux valeurs sont différentes.' };
    return { ok: true, txt: mesuresTxt() + ' : les tensions sont bien différentes. Et leur somme donne la tension de la pile.' };
  }
  function entree(m, etat, corps) { return '<section class="en ' + etat + '" id="m' + m + '" aria-labelledby="t' + m + '"><span class="no" aria-hidden="true">' + m + '</span><h2 id="t' + m + '"><span class="sr">Moment ' + m + ' sur 9 : </span>' + TITRES[m - 1] + '</h2>' + corps + '</section>'; }
  var LIVRE = function () { return mode === 'desk' ? 'dans le livre, à gauche' : 'dans le livre'; };
  function actif(m) {
    var h = '';
    if (m === 1) h = '<p class="big">Lis la situation ' + LIVRE() + ', puis allume le circuit d’Awa et Kofi.</p><p class="pb"><b>Question :</b> quelle tension le voltmètre indiquera-t-il aux bornes de chaque lampe ?</p>' + btn('c1', 'Je me mets au travail');
    else if (m === 2) h = '<p class="lead">Avant de mesurer, je prépare mon matériel.</p>' + G2.map(function (g, k) { return '<div class="g2" data-g="' + k + '"><p><b>' + (k + 1) + '. ' + g.q + '</b></p>' + ch('g' + k, g.o, null, g.q, g.o.length < 3 ? 'deux' : '') + '<p class="ex" aria-live="polite"></p></div>'; }).join('') + '<p class="msg" id="m2msg" aria-live="polite"></p>' + btn('c2', 'Continuer', true);
    else if (m === 3) h = '<p class="lead">Je dis ce que je pense qu’il va se passer. Je peux me tromper : c’est le rôle d’une hypothèse.</p>' + ch('hyp', HYP, S.hyp, 'Mon hypothèse') + '<div class="field"><label for="car">Je pense ça parce que… (facultatif)</label><textarea id="car" rows="2">' + esc(S.car) + '</textarea></div>' + btn('c3', 'Je valide et je passe au laboratoire', S.hyp == null);
    else if (m === 4) h = '<p class="lead">Fais les mesures ' + LIVRE() + ' : elles s’écrivent ici toutes seules.</p>' + tableau(false) + btn('c4', 'J’ai mes mesures', !fait());
    else if (m === 5) h = '<p class="lead">Je calcule avec mes propres mesures.</p>' + tableau(true) + '<form class="num" id="f5"><label for="som">U(L1) + U(L2) =</label><input id="som" inputmode="decimal" autocomplete="off"><span>V</span><button class="bt">Vérifier</button></form><p class="ex" id="x5a" aria-live="polite"></p>'
      + '<p><b>U(L1) et U(L2) sont-elles égales ?</b></p>' + ch('egal', ['Oui, égales', 'Non, différentes'], null, 'Comparer U(L1) et U(L2)', 'deux') + '<p class="ex" id="x5b" aria-live="polite"></p>' + btn('c5', 'Continuer', true);
    else if (m === 6) h = '<div class="quote"><b>Mon hypothèse</b><span>' + esc(HYP[S.hyp == null ? 2 : S.hyp]) + (S.car.trim() ? ' Parce que ' + esc(S.car.trim()) : '') + '</span></div><p class="lead">Mes mesures : ' + mesuresTxt() + '.</p><p><b>Mon hypothèse est…</b></p>' + ch('jug', ['confirmée', 'à corriger'], S.jug, 'Mon jugement', 'deux') + '<div id="v6" aria-live="polite"></div>' + btn('c6', 'Continuer', S.jug == null);
    else if (m === 7) h = '<p class="lead">Regarde « Ce que disent tes mesures » ' + LIVRE() + '. Puis j’écris mon bilan en deux ou trois phrases.</p><div class="field"><label for="bilan">Mon bilan</label><textarea id="bilan" rows="5" placeholder="Quand deux lampes sont en série, la tension…">' + esc(S.bilan) + '</textarea></div><button type="button" class="bt ghost" id="ajmes">Ajouter mes mesures</button><p class="msg" id="m7msg" aria-live="polite"></p>' + btn('c7', 'J’ouvre le bilan scientifique', S.bilan.trim().length < 25);
    else if (m === 8) h = '<p class="lead">Le bilan scientifique est ouvert ' + LIVRE() + '. Je le compare au mien.</p><div class="quote"><b>Mon bilan</b><span>' + esc(S.bilan) + '</span></div><fieldset class="chk"><legend>Mon bilan contient-il…</legend>' + CRIT.map(function (c, i) { return '<label><input type="checkbox" data-c="' + i + '"' + (S.crit[i] ? ' checked' : '') + '><span>' + c + '</span></label>'; }).join('') + '</fieldset><p class="msg" id="m8msg" aria-live="polite"></p>' + btn('c8', 'Passer au défi');
    else h = '<p class="lead">Relève le défi ' + LIVRE() + '. Ton score s’écrit ici.</p><p class="rec">Manches jouées : ' + S.rep.length + ' sur ' + DEFI.length + ' · réussies : ' + score() + '</p>';
    return entree(m, 'actif', h);
  }
  function recap(m) {
    var h = '';
    if (m === 1) h = '<p class="rec">Kofi pense que chaque lampe aura 4,5 V. Awa n’en est pas sûre. <b>Question :</b> quelle tension aux bornes de chaque lampe ?</p>';
    else if (m === 2) h = '<p class="rec">On mesure <b>la tension</b> avec <b>un voltmètre</b>, branché <b>en dérivation</b> aux bornes de la lampe.</p>';
    else if (m === 3) h = '<p class="rec"><b>Mon hypothèse :</b> ' + esc(HYP[S.hyp == null ? 0 : S.hyp]) + (S.car.trim() ? '<br>Parce que ' + esc(S.car.trim()) : '') + '</p>';
    else if (m === 4) h = tableau(true);
    else if (m === 5) h = '<p class="rec">' + fv(S.mes.L1 == null ? U1 : S.mes.L1) + ' + ' + fv(S.mes.L2 == null ? U2 : S.mes.L2) + ' = <b>' + fv(UG) + '</b>, la tension de la pile. U(L1) et U(L2) sont différentes.</p>';
    else if (m === 6) { var v = verdict(); h = '<p class="rec"><b>Hypothèse ' + (v.ok ? 'confirmée' : 'à corriger') + '.</b> ' + v.txt + '</p>'; }
    else if (m === 7) h = '<div class="quote"><b>Mon bilan</b><span>' + esc(S.bilan) + '</span></div>';
    else if (m === 8) h = '<p class="rec">Comparé au bilan scientifique : ' + S.crit.reduce(function (a, b) { return a + (b ? 1 : 0); }, 0) + ' critère(s) sur ' + CRIT.length + '.</p>';
    else h = '<p class="rec"><b>Défi :</b> ' + score() + ' manches réussies sur ' + DEFI.length + '.</p>';
    return entree(m, 'fait', h);
  }
  function fin() { return '<section class="fin" id="fin"><h2>Mon cahier est terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p><b>À retenir :</b> en série, la tension de la pile est égale à la somme des tensions aux bornes des lampes : U = U1 + U2. Le voltmètre se branche en dérivation.</p><button type="button" class="bt go" id="imp2">Imprimer mon cahier</button><button type="button" class="bt ghost" id="again2">Recommencer le cartable</button></section>'; }
  function aFaire() { return !S.fini && ([1, 2, 3, 5, 6, 7, 8].indexOf(S.m) >= 0 || (S.m === 4 && fait())); }
  function rendreCahier(defile) {
    var h = '', m;
    for (m = 1; m <= S.m; m++) h += (m === S.m && !(m === 9 && S.fini)) ? actif(m) : recap(m);
    if (S.fini) h += fin();
    var cb = $('#cb'); cb.innerHTML = h;
    $('#cbProg').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { return '<i' + (i <= S.m ? ' class="on"' : '') + '></i>'; }).join('');
    $('#cbProg').setAttribute('aria-label', 'Moment ' + S.m + ' sur 9'); $('#cbCount').textContent = 'Moment ' + S.m + ' sur 9';
    $('#bCahier').classList.toggle('afaire', aFaire());
    if (S.fini) { $('#imp2').onclick = function () { window.print(); }; $('#again2').onclick = recommencer; } else lierCahier(S.m);
    if (defile) { var el = S.fini ? $('#fin') : $('#m' + S.m); if (el) { try { cb.scrollTo({ top: el.offsetTop - 12, behavior: anim ? 'smooth' : 'auto' }); } catch (e) { cb.scrollTop = el.offsetTop - 12; } } }
  }
  function lierCahier(m) {
    var r = $('#m' + m), c;
    if (m === 1) $('#c1').onclick = function () { avance(1); };
    else if (m === 2) {
      c = $('#c2');
      $$('.g2', r).forEach(function (bl) {
        var k = +bl.getAttribute('data-g'), g = G2[k], gr = $('.ch', bl), ex = $('.ex', bl);
        function ok() { $$('button', gr).forEach(function (b, j) { b.disabled = true; if (j === g.b) b.classList.add('bon'); }); ex.innerHTML = '<b>Oui.</b>'; }
        if (S.mat[k]) ok();
        gr.onclick = function (e) {
          var b = e.target.closest('button'); if (!b || b.disabled) return;
          var j = +b.getAttribute('data-i'); $$('button', gr).forEach(function (x) { x.classList.remove('faux'); });
          if (j === g.b) { S.mat[k] = 1; sauve(); ok(); } else { b.classList.add('faux'); ex.textContent = 'Pas encore. ' + g.h; }
          var tous = S.mat.every(Boolean); c.disabled = !tous; $('#m2msg').textContent = tous ? 'Mon matériel est prêt.' : '';
        };
      });
      c.disabled = !S.mat.every(Boolean); c.onclick = function () { avance(2); };
    } else if (m === 3) {
      $('[data-ch="hyp"]', r).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.hyp = +b.getAttribute('data-i'); $$('[data-ch="hyp"] button', r).forEach(function (x, j) { x.setAttribute('aria-pressed', j === S.hyp); }); $('#c3').disabled = false; sauve(); };
      $('#car').oninput = function () { S.car = this.value; sauve(); };
      $('#c3').onclick = function () { avance(3); };
    } else if (m === 4) $('#c4').onclick = function () { avance(4); };
    else if (m === 5) {
      c = $('#c5');
      var ok5 = function () { c.disabled = !(S.somme && S.egal); };
      $('#f5').onsubmit = function (e) {
        e.preventDefault(); var v = num($('#som').value), ex = $('#x5a');
        if (v != null && Math.abs(v - UG) < 0.001) { S.somme = 1; sauve(); ex.innerHTML = '<b>Exact.</b> ' + fv(S.mes.L1) + ' + ' + fv(S.mes.L2) + ' = ' + fv(UG) + ', c’est la tension de la pile.<br><span class="cloi">U(G) = U(L1) + U(L2)</span>'; ok5(); }
        else ex.textContent = 'Pas encore. Additionne les deux tensions des lampes, en volts.';
      };
      $('[data-ch="egal"]', r).onclick = function (e) {
        var b = e.target.closest('button'); if (!b || b.disabled) return; var j = +b.getAttribute('data-i'), ex = $('#x5b');
        if (j === 1) { S.egal = 1; sauve(); $$('[data-ch="egal"] button', r).forEach(function (x, k) { x.disabled = true; x.setAttribute('aria-pressed', k === 1); if (k === 1) x.classList.add('bon'); }); ex.innerHTML = '<b>Non.</b> ' + fv(S.mes.L1) + ' et ' + fv(S.mes.L2) + ' sont différentes.'; ok5(); }
        else { b.classList.add('faux'); ex.textContent = 'Compare les deux valeurs de ton tableau.'; }
      };
      if (S.somme) { $('#som').value = String(UG).replace('.', ','); $('#x5a').innerHTML = '<b>Exact.</b>'; }
      if (S.egal) $$('[data-ch="egal"] button', r).forEach(function (x, k) { x.disabled = true; if (k === 1) x.classList.add('bon'); });
      ok5(); c.onclick = function () { avance(5); };
    } else if (m === 6) {
      var montre = function () { var v = verdict(), bon = (S.jug === 0) === v.ok; $('#v6').innerHTML = '<div class="crit' + (v.ok ? ' sci' : '') + '"><b>Verdict : hypothèse ' + (v.ok ? 'confirmée' : 'à corriger') + '.</b><p>' + v.txt + '</p><p>' + (bon ? 'Ton jugement est juste.' : 'Relis tes mesures : ton jugement n’est pas le bon.') + '</p></div>'; };
      if (S.jug != null) montre();
      $('[data-ch="jug"]', r).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.jug = +b.getAttribute('data-i'); $$('[data-ch="jug"] button', r).forEach(function (x, j) { x.setAttribute('aria-pressed', j === S.jug); }); sauve(); montre(); $('#c6').disabled = false; };
      $('#c6').onclick = function () { avance(6); };
    } else if (m === 7) {
      var ta = $('#bilan'), c7 = $('#c7');
      var maj7 = function () { S.bilan = ta.value; sauve(); var o = ta.value.trim().length >= 25; c7.disabled = !o; $('#m7msg').textContent = o ? '' : 'Écris au moins une ou deux phrases pour continuer.'; };
      ta.oninput = maj7;
      $('#ajmes').onclick = function () { ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + 'U(G) = ' + fv(S.mes.G == null ? UG : S.mes.G) + ' ; ' + mesuresTxt().replace(' et ', ' ; ') + '. '; maj7(); ta.focus(); };
      c7.onclick = function () { avance(7); };
    } else if (m === 8) {
      $$('.chk input', r).forEach(function (x) { x.onchange = function () { S.crit[+x.getAttribute('data-c')] = x.checked ? 1 : 0; sauve(); $('#m8msg').textContent = S.crit.reduce(function (a, b) { return a + b; }, 0) + ' critère(s) sur ' + CRIT.length + '.'; }; });
      $('#c8').onclick = function () { avance(8); };
    }
  }

  /* ---------- progression : le livre suit le cahier ---------- */
  function cible(m) { var t = { 4: [1, 2], 7: [2, 3], 8: [2, 4], 9: [3, 5] }[m]; return t ? (mode === 'sgl' ? t[1] : t[0]) : null; }
  function avance(m) {
    S.m = m + 1; sauve(); rendreCahier(true);
    var t = cible(S.m);
    if (t != null && t !== posCour()) { fermeCahier(); if (anim) setTimeout(function () { aller(t); }, mode === 'desk' ? 250 : 420); else aller(t); }
    else if (t != null) monte();
    else majNav();
  }
  function recommencer() { var nom = S.nom; S = neuf(); S.nom = nom; L = { dip: null, ferme: true }; L0 = false; sauve(); rendreCahier(false); fermeCahier(); aller(0, true); }

  /* ---------- laboratoire ---------- */
  function enregistre() {
    var d = L.dip, v = tension(d, L.ferme), k = null;
    if (d === 'G') k = 'G'; else if (d === 'K') { if (!L.ferme) k = 'Kouv'; } else if (L.ferme) k = d;
    if (k && S.mes[k] !== v) { S.mes[k] = v; sauve(); return k; }
    return null;
  }
  function peintLab() {
    var d = L.dip, v = d ? tension(d, L.ferme) : null, msg;
    $$('[data-lv]').forEach(function (e) { e.textContent = d ? fv(v) : '— V'; });
    $$('[data-ll]').forEach(function (e) { e.textContent = d ? 'Voltmètre aux bornes de ' + NOMS[d] : 'Voltmètre non branché'; });
    $$('[data-d]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-d') === d); });
    $$('[data-ksw]').forEach(function (b) { b.textContent = L.ferme ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur'; });
    if (!d) msg = 'Touche un dipôle pour brancher le voltmètre à ses bornes.';
    else if ((d === 'L1' || d === 'L2') && !L.ferme) msg = 'Interrupteur ouvert : 0 V, mesure non retenue. Ferme l’interrupteur.';
    else if (d === 'K' && L.ferme) msg = 'Interrupteur fermé : 0 V, mesure non retenue. Ouvre-le pour mesurer K.';
    else if (fait()) msg = 'Les trois mesures sont dans ton cahier' + (S.mes.Kouv == null ? '. Tu peux aussi mesurer K ouvert.' : '.');
    else msg = 'Mesure écrite dans ton cahier.';
    $$('[data-lm]').forEach(function (e) { e.textContent = msg; });
    $$('[data-lmont]').forEach(function (e) { e.innerHTML = montage(d, L.ferme); });
    $$('[data-lsch]').forEach(function (e) { e.innerHTML = schema(d, L.ferme); });
    $$('[data-fait]').forEach(function (e) { e.hidden = !fait(); });
  }
  function apresMesure(src) {
    var k = enregistre(); peintLab();
    if (!k) return;
    if (S.m === 4) rendreCahier(false); else rendreCahier(false);
    vole(src, k);
  }
  function lierLab(root) {
    $$('[data-d]', root).forEach(function (b) { b.onclick = function () { L.dip = b.getAttribute('data-d'); clic(); apresMesure(lv(b)); }; });
    $$('[data-ksw]', root).forEach(function (b) { b.onclick = function () { L.ferme = !L.ferme; clic(); if (L.dip) apresMesure(lv(b)); else peintLab(); }; });
  }
  function lv(el) { var p = el.closest('.page,#prof'); return p ? $('[data-lv]', p) : null; }
  function vole(src, k) {
    var visible = mode === 'desk' || $('#cahier').classList.contains('open'), cib = visible ? $('#cb tr[data-k="' + k + '"] td') : $('#bCahier');
    function flash() {
      var td = $('#cb tr[data-k="' + k + '"] td'); if (td) { td.classList.remove('ink'); void td.offsetWidth; td.classList.add('ink'); }
      var bc = $('#bCahier'); if (!visible && bc) { bc.classList.remove('pulse'); void bc.offsetWidth; bc.classList.add('pulse'); }
    }
    if (!cib || !src || !anim || !window.requestAnimationFrame) { flash(); return; }
    if (visible && cib.scrollIntoView) { try { cib.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
    var a = src.getBoundingClientRect(), b = cib.getBoundingClientRect(), e = document.createElement('div');
    e.className = 'vol'; e.textContent = fv(S.mes[k]); e.style.left = a.left + 'px'; e.style.top = a.top + 'px'; document.body.appendChild(e);
    requestAnimationFrame(function () { requestAnimationFrame(function () { e.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - 34) + 'px,' + (b.top + b.height / 2 - a.top - 16) + 'px) scale(.85)'; }); });
    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); flash(); }, 820);
  }

  /* ---------- défi (dans le livre) ---------- */
  function liedefi(r) {
    if (S.fini || S.m < 9) return;
    var i = S.rep.length, q = DEFI[i], zone = $('[data-dx]', r);
    function fini(ok) {
      zone.innerHTML = '<p class="ex"><b>' + (ok ? 'Exact.' : 'Pas encore.') + '</b> ' + q.e + '</p><button type="button" class="go" data-dsv style="width:100%;margin-top:8px">' + (i + 1 < DEFI.length ? 'Manche suivante' : 'Voir mes étoiles') + '</button>';
      var b = $('[data-dsv]', r); b.focus();
      b.onclick = function () { S.rep.push(ok ? 1 : 0); if (S.rep.length === DEFI.length) S.fini = true; sauve(); rendreCahier(S.fini); monte(); };
    }
    var g = $('[data-dq]', r);
    if (g) g.onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var k = +b.getAttribute('data-i'); $$('button', g).forEach(function (x, j) { x.disabled = true; if (j === q.b) x.classList.add('bon'); else if (j === k) x.classList.add('faux'); }); fini(k === q.b); };
    var f = $('[data-dn]', r);
    if (f) f.onsubmit = function (e) { e.preventDefault(); var inp = $('[data-dv]', r), v = num(inp.value); if (v == null) return; inp.disabled = true; $('button', f).disabled = true; fini(Math.abs(v - q.r) < 1e-9); };
  }

  /* ---------- livre : position, montage, retournement ---------- */
  function posCour() { return mode === 'sgl' ? S.pos : SGL2SP[S.pos]; }
  function setPos(t) { S.pos = mode === 'sgl' ? t : SP2SGL[t]; sauve(); }
  function maxPos() { return mode === 'sgl' ? SGL.length - 1 : SPREADS.length - 1; }
  function debloque(t) { return t >= 0 && t <= maxPos() && (mode === 'sgl' ? SGL2SP[t] : t) <= spreadDe(S.m); }
  function vus() { return mode === 'sgl' ? [SGL[S.pos]] : SPREADS[SGL2SP[S.pos]]; }
  function labVisible() { return mode === 'sgl' ? SGL[S.pos] === 'lab' : SGL2SP[S.pos] === 1; }
  function monte() {
    var v = vus();
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(v[0], 'S'); } else { $('#sL').innerHTML = page(v[0], 'L'); $('#sR').innerHTML = page(v[1], 'R'); }
    var bk = $('#book'); bk.classList.toggle('anim', anim);
    lierPages(bk); peintLab();
    $$('.stage', bk).forEach(function (s) { if (!anim) s.classList.add('up'); else setTimeout(function () { s.classList.add('up'); }, 60); });
    var lg = $('.lang[data-auto]', bk);
    if (lg) { var leve = function () { lg.classList.add('up'); S.vuBilan = 1; sauve(); }; if (anim) setTimeout(leve, 650); else leve(); }
    majNav();
  }
  function lierPages(root) {
    $$('[data-k0]', root).forEach(function (b) { b.onclick = function () { L0 = !L0; clic(); $$('[data-m0]').forEach(function (e) { e.innerHTML = montage(null, L0, true); }); $$('[data-s0]').forEach(function (e) { e.innerHTML = schema(null, L0); }); $$('[data-k0]').forEach(function (x) { x.textContent = (L0 ? 'Ouvrir' : 'Fermer') + ' l’interrupteur'; }); }; });
    $$('[data-ouvre]', root).forEach(function (b) { b.onclick = ouvreCahier; });
    $$('[data-again]', root).forEach(function (b) { b.onclick = recommencer; });
    lierLab(root);
    var d = $('[data-pg="s4r"]', root); if (d) liedefi(d);
  }
  function aller(t, direct) {
    if (busy) return;
    var de = posCour();
    if (t === de && !direct) return;
    if (!direct && !debloque(t)) return;
    if (direct || !anim) { setPos(t); monte(); return; }
    busy = true; $$('#book .stage').forEach(function (s) { s.classList.remove('up'); });
    setTimeout(function () { tourne(de, t, function () { setPos(t); busy = false; monte(); }); }, 330);
  }
  function tourne(de, vers, fin) {
    var av = vers > de, sh = $('#sheet'), N = 9, w = 480 / N, i, h = '', f, b;
    if (mode !== 'sgl') {
      var D = SPREADS[de], V = SPREADS[vers];
      f = av ? nu(D[1], 'R') : nu(V[1], 'R'); b = av ? nu(V[0], 'L') : nu(D[0], 'L');
      $('#sL').innerHTML = av ? page(D[0], 'L') : page(V[0], 'L'); $('#sR').innerHTML = av ? page(V[1], 'R') : page(D[1], 'R');
    } else { f = av ? nu(SGL[de], 'S') : nu(SGL[vers], 'S'); b = '<div class="page S"></div>'; $('#sR').innerHTML = page(av ? SGL[vers] : SGL[de], 'S'); }
    function cr(html, k, bk) { return '<div class="fc' + (bk ? ' bk' : '') + '"><div class="in" style="left:' + (bk ? -(N - 1 - k) * w : -k * w) + 'px">' + html + '</div><div class="shade"></div></div>'; }
    for (i = N - 1; i >= 0; i--) h = '<div class="str" style="left:' + (i ? w : 0) + 'px;width:' + (w + 0.6) + 'px">' + cr(f, i) + cr(b, i, true) + h + '</div>';
    sh.innerHTML = h; sh.style.display = 'block';
    var st = $$('.str', sh), sd = $$('.shade', sh);
    function pose(p) {
      var th = av ? -180 * p : -180 * (1 - p), bd = 62 * Math.sin(Math.PI * p) * (av ? 1 : -1), pas = 2 * bd / (N - 1);
      st.forEach(function (e, k) { e.style.transform = 'rotateY(' + (k === 0 ? (th - bd) : pas) + 'deg)'; });
      var o = 0.32 * Math.sin(Math.PI * p); sd.forEach(function (e) { e.style.opacity = o; });
    }
    pose(0); papier();
    var t0 = 0, Du = 850;
    (function s(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / Du, 1), q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; pose(q); if (p < 1) requestAnimationFrame(s); else { sh.style.display = 'none'; sh.innerHTML = ''; fin(); } })(performance.now());
  }

  /* ---------- barre, tiroir, mode enseignant ---------- */
  function majNav() {
    var c = posCour(), ch0 = SGL2SP[S.pos];
    $('#dots').innerHTML = CHAP.map(function (t, i) { var ok = i <= spreadDe(S.m); return '<button type="button" data-c="' + i + '" aria-label="Chapitre ' + (i + 1) + ', ' + t + (ok ? '' : ', pas encore ouvert') + '"' + (ch0 === i ? ' aria-current="step"' : '') + (ok ? '' : ' disabled') + '>' + (i + 1) + '</button>'; }).join('');
    $('#prev').disabled = c === 0; $('#next').disabled = !debloque(c + 1);
    $('#bProf').hidden = !labVisible();
    $('#bCahier').classList.toggle('afaire', aFaire());
  }
  function ouvreCahier() { if (mode === 'desk') return; var c = $('#cahier'); c.classList.add('open'); c.inert = false; $('#bCahier').setAttribute('aria-expanded', 'true'); var el = S.fini ? $('#fin') : $('#m' + S.m); if (el) $('#cb').scrollTop = el.offsetTop - 12; setTimeout(function () { var f = $('#cbFerme'); if (f && f.focus) f.focus(); }, 50); }
  function fermeCahier() { if (mode === 'desk') return; var c = $('#cahier'); if (!c.classList.contains('open')) return; c.classList.remove('open'); c.inert = true; $('#bCahier').setAttribute('aria-expanded', 'false'); }
  function prof(on) {
    var P = $('#prof');
    profOn = on;
    if (on) {
      P.innerHTML = '<button type="button" class="pq" data-pq>Quitter le mode enseignant</button><div class="pg"><div class="pm" data-lmont></div><div class="pc">' + ctl() + '<div class="fig2" data-lsch></div></div></div>';
      P.classList.add('on'); lierLab(P); $('[data-pq]', P).onclick = function () { prof(false); }; peintLab(); $('[data-pq]', P).focus();
    } else { P.classList.remove('on'); P.innerHTML = ''; $('#bProf').focus(); }
  }
  function dec(d) { var c = posCour() + d; if (debloque(c)) aller(c); }
  function libelles() {
    var c = mode === 'sgl';
    $('#prev').textContent = c ? '←' : '← Précédent'; $('#next').textContent = c ? '→' : 'Suivant →';
    $('#bSon').textContent = son ? (c ? 'Son' : 'Son activé') : (c ? 'Muet' : 'Son coupé');
    $('#bAnim').textContent = c ? (anim ? 'Anim.' : 'Figé') : (anim ? 'Animations' : 'Animations arrêtées');
    $('#bProf').textContent = c ? 'Prof' : 'Mode enseignant'; $('#bImp').textContent = c ? 'Imprimer' : 'Imprimer le cahier';
  }
  function ajuste() {
    var W = window.innerWidth, H = window.innerHeight, old = mode;
    mode = W >= 1100 && H >= 560 ? 'desk' : W >= 700 ? 'dbl' : 'sgl';
    var B = document.body; B.classList.toggle('desk', mode === 'desk'); B.classList.toggle('sgl', mode === 'sgl'); B.classList.toggle('anim', anim);
    document.documentElement.style.setProperty('--tilt', mode === 'sgl' ? '0deg' : '10deg');
    var c = $('#cahier');
    if (mode === 'desk') { c.classList.remove('open'); c.inert = false; } else if (!c.classList.contains('open')) c.inert = true;
    var f = $('#fit'), s = $('#scale'), bw = mode === 'sgl' ? 510 : 1000, bh = mode === 'sgl' ? 870 : 905, k = Math.min(f.clientWidth / bw, f.clientHeight / bh) || 0.5;
    s.style.width = (mode === 'sgl' ? 480 : 960) + 'px'; s.style.height = '840px'; s.style.transform = 'scale(' + k + ')';
    return old !== mode;
  }
  /* sons (Web Audio, après un premier geste) */
  var AC = null;
  function audio() { if (!son) return null; try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
  function clic() { var a = audio(); if (!a) return; try { var o = a.createOscillator(), g = a.createGain(); o.frequency.value = 1400; g.gain.setValueAtTime(0.05, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.06); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.07); } catch (e) {} }
  function papier() { var a = AC && son ? AC : null; if (!a) return; try { var n = a.sampleRate * 0.28, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n); var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'highpass'; fl.frequency.value = 1800; g.gain.value = 0.05; s.buffer = b; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(); } catch (e) {} }

  function init() {
    if (!$('#book')) return;
    S = lire(); if (calme()) anim = false;
    var nom = $('#nom'); nom.value = S.nom || ''; nom.oninput = function () { S.nom = nom.value; sauve(); };
    try { $('#cbDate').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}
    ajuste(); libelles(); ajuste();
    if (!debloque(posCour())) setPos(cible(S.m) != null ? cible(S.m) : 0);
    monte(); rendreCahier(S.m > 1);
    $('#bAnim').setAttribute('aria-pressed', anim);
    $('#prev').onclick = function () { dec(-1); }; $('#next').onclick = function () { dec(1); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var c = +b.getAttribute('data-c'); aller(mode === 'sgl' ? SP2SGL[c] : c); };
    $('#bCahier').onclick = function () { if ($('#cahier').classList.contains('open')) fermeCahier(); else ouvreCahier(); };
    $('#cbFerme').onclick = fermeCahier;
    $('#bSon').onclick = function () { son = !son; this.setAttribute('aria-pressed', son); libelles(); };
    $('#bAnim').onclick = function () { anim = !anim; this.setAttribute('aria-pressed', anim); document.body.classList.toggle('anim', anim); libelles(); $('#book').classList.toggle('anim', anim); };
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} };
    $('#bProf').onclick = function () { prof(true); };
    $('#bImp').onclick = function () { window.print(); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (profOn) prof(false); else fermeCahier(); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || profOn) return;
      if (e.key === 'ArrowRight') dec(1); if (e.key === 'ArrowLeft') dec(-1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|TEXTAREA|BUTTON/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) dec(d < 0 ? 1 : -1); x0 = null; }, { passive: true });
    var to;
    window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var chg = ajuste(); libelles(); ajuste(); if (chg && !busy) { monte(); rendreCahier(false); } }, 120); });
  }
  init();
})();
