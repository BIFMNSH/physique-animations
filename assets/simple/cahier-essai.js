/* Cahier de labo (essai) : « La tension aux bornes de deux lampes en série » (5e), en neuf moments.
   Une feuille à carreaux se remplit au fil des moments ; le laboratoire (voltmètre sur le montage et sur le schéma) est au moment 4.
   Modèle : pile 4,5 V, lampes assimilées à des résistances constantes (L1 20 Ω, L2 40 Ω). Les valeurs sont celles de la simulation.
   Progression dans « pc-cahier-tension » ; rien n'est envoyé. */
(function () {
  'use strict';
  var UG = 4.5, R1 = 20, R2 = 40, CLE = 'pc-cahier-tension', INK = '#243049', OR = '#F97316', BL = '#0B6FA8';
  function r2(x) { return Math.round(x * 100) / 100; }
  /* tension en volts aux bornes de G (pile), L1, L2 ou K selon l'état de l'interrupteur */
  function tension(d, ferme) {
    if (d === 'G') return UG;
    if (d === 'K') return ferme ? 0 : UG;
    if (!ferme) return 0;
    return r2((d === 'L1' ? R1 : R2) * UG / (R1 + R2));
  }
  function fv(x) { return String(x).replace('.', ',') + ' V'; }
  window.NohobaCahierTension = { tension: tension, fv: fv, UG: UG };

  var A = window.NohobaAtelier, esc = A.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function num(s) { var v = parseFloat(String(s).replace(',', '.').replace(/[^0-9.\-]/g, '')); return isNaN(v) ? null : v; }

  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var HYP = ['Chaque lampe a 4,5 V à ses bornes, comme la pile.', 'Chaque lampe a la moitié de la tension de la pile.', 'Les deux lampes n’ont pas la même tension.'];
  var NOMS = { G: 'la pile', L1: 'la lampe L1', L2: 'la lampe L2', K: 'l’interrupteur K' };
  var G2 = [
    { q: 'Quelle grandeur cherche-t-on à mesurer ?', o: ['la tension', 'l’intensité', 'la température'], b: 0, h: 'Relis la situation : elle parle de ce que le voltmètre indiquera.' },
    { q: 'Avec quel appareil ?', o: ['un voltmètre', 'un ampèremètre', 'un thermomètre'], b: 0, h: 'Un ampèremètre mesure l’intensité, un thermomètre la température.' },
    { q: 'Comment le brancher aux bornes d’une lampe ?', o: ['en série, dans le circuit', 'en dérivation, aux bornes de la lampe'], b: 1, h: 'Pour un ampèremètre, on coupe le circuit. Un voltmètre se branche sans rien couper.' }
  ];
  var U1 = tension('L1', true), U2 = tension('L2', true), UK = tension('K', false);
  var DEFI = [
    { t: 'n', q: 'En série, U(G) = 9 V et U(L1) = 3,5 V. Combien vaut U(L2), en volts ?', r: 5.5, u: 'V', e: 'U(L2) = 9 V − 3,5 V = 5,5 V.' },
    { t: 'c', q: 'Ton interrupteur K est ouvert. Que lit le voltmètre à ses bornes ?', c: ['0 V', fv(UK), fv(U1)], b: 1, e: 'Aux bornes d’un interrupteur ouvert, on lit la tension de la pile : ' + fv(UK) + '.' },
    { t: 'c', q: 'Dans ton tableau, quelle lampe a la plus grande tension à ses bornes ?', c: ['L1', 'L2', 'Les deux sont égales'], b: 1, e: 'U(L2) = ' + fv(U2) + ' est plus grande que U(L1) = ' + fv(U1) + '.' },
    { t: 'c', q: 'Deux lampes sont en dérivation sur une pile de 4,5 V. Quelle tension a-t-on aux bornes de chaque lampe ?', c: ['2,25 V', '4,5 V', '9 V'], b: 1, e: 'En dérivation, les tensions sont égales : 4,5 V.' },
    { t: 'c', q: 'Le voltmètre affiche −4,5 V. Que s’est-il passé ?', c: ['La pile est vide', 'Les fils du voltmètre sont inversés', 'Le circuit est ouvert'], b: 1, e: 'La borne COM est du côté + de la pile : les fils sont inversés.' },
    { t: 'n', q: 'Convertis : 250 mV = … V', r: 0.25, u: 'V', e: '1 V = 1 000 mV, donc 250 mV = 250 ÷ 1 000 = 0,25 V.' }
  ];
  var CRIT = ['J’ai écrit mes trois mesures.', 'J’ai écrit que la tension de la pile est égale à U1 + U2.', 'J’ai dit que les deux lampes n’ont pas la même tension.', 'J’ai écrit l’unité, le volt (V).'];

  /* ---------- état ---------- */
  function neuf() { return { m: 1, nom: '', mat: [0, 0, 0], hyp: null, car: '', mes: {}, somme: 0, egal: 0, jug: null, bilan: '', crit: [0, 0, 0, 0], rep: [], fini: false }; }
  function lire() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE));
      if (v && typeof v === 'object' && typeof v.m === 'number' && v.mat && v.mes && v.crit && v.rep) { v.m = Math.min(9, Math.max(1, Math.round(v.m))); return v; }
    } catch (e) {}
    return neuf();
  }
  var S = neuf(), L = { dip: null, ferme: true }, premier = true, profOn = false;
  function sauve() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {} }
  function fait() { return S.mes.G != null && S.mes.L1 != null && S.mes.L2 != null; }
  function score() { return S.rep.reduce(function (a, b) { return a + b; }, 0); }
  function etoiles() { var s = score(); return s >= 5 ? 3 : s >= 3 ? 2 : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

  /* ---------- dessins ---------- */
  var TERM = { G: [[233, 34], [207, 34]], L1: [[354, 189], [370, 208]], L2: [[220, 308], [204, 289]], K: [[134, 289], [86, 289]] };
  var HALO = { G: '<rect x="170" y="6" width="100" height="180" rx="16"/>', L1: '<circle cx="370" cy="150" r="60"/>', L2: '<circle cx="220" cy="250" r="60"/>', K: '<rect x="68" y="268" width="84" height="42" rx="14"/>' };
  function lead(a, b, col) {
    var d = 'M' + a[0] + ' ' + a[1] + ' C' + a[0] + ' ' + (a[1] - 70) + ' ' + b[0] + ' ' + (b[1] + 70) + ' ' + b[0] + ' ' + b[1];
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="8" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="4.5" stroke-linecap="round"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="7.5" fill="' + col + '" stroke="#fff" stroke-width="2.5"/>';
  }
  function boitier(v) {
    return '<rect x="120" y="380" width="200" height="72" rx="12" fill="#2B3345" stroke="#1B2540" stroke-width="2"/>'
      + '<circle cx="160" cy="380" r="8" fill="' + OR + '" stroke="#fff" stroke-width="2"/><circle cx="280" cy="380" r="8" fill="' + BL + '" stroke="#fff" stroke-width="2"/>'
      + A.T(160, 400, 'V', 13, '#fff', 800) + A.T(280, 400, 'COM', 13, '#fff', 800)
      + '<rect x="150" y="406" width="140" height="32" rx="6" fill="#10241C" stroke="#2C5A47"/>' + A.T(220, 430, v == null ? '— V' : fv(v), 22, '#B9F6CE', 800) + A.T(220, 449, 'Voltmètre', 11, '#C9D2E0', 700);
  }
  function montage(dip, ferme) {
    var v = dip ? tension(dip, ferme) : null, s = '';
    if (dip) s += '<g fill="' + OR + '" fill-opacity=".14" stroke="' + OR + '" stroke-width="2.5" stroke-dasharray="6 5">' + HALO[dip] + '</g>';
    s += A.fil('M233 34 H310 V189 H354', '#C03A2E') + A.fil('M207 34 H50 V289 H86', INK) + A.fil('M370 208 V325 H220 V308', INK) + A.fil('M204 289 H134', INK);
    s += A.pile45(180, 76, 1) + A.interrupteur(110, 289, ferme) + A.lampe(370, 150, ferme) + A.lampe(220, 250, ferme);
    s += A.broches([[233, 34], [207, 34], [354, 189], [370, 208], [220, 308], [204, 289], [134, 289], [86, 289]]);
    s += A.T(418, 214, 'L1', 16, INK, 800) + A.T(288, 256, 'L2', 16, INK, 800) + A.T(110, 324, 'K', 16, INK, 800);
    s += boitier(v);
    if (dip) s += lead([160, 380], TERM[dip][0], OR) + lead([280, 380], TERM[dip][1], BL);
    else s += '<path d="M160 380 C160 346 128 340 118 326" fill="none" stroke="' + OR + '" stroke-width="4.5" stroke-linecap="round"/><circle cx="118" cy="326" r="7.5" fill="' + OR + '" stroke="#fff" stroke-width="2.5"/><path d="M280 380 C280 346 312 340 322 326" fill="none" stroke="' + BL + '" stroke-width="4.5" stroke-linecap="round"/><circle cx="322" cy="326" r="7.5" fill="' + BL + '" stroke="#fff" stroke-width="2.5"/>';
    return A.svg(s, '0 0 440 462', 'Montage : pile de 4,5 V, interrupteur ' + (ferme ? 'fermé' : 'ouvert') + ' et lampes L1 et L2 en série. ' + (dip ? 'Le voltmètre est branché aux bornes de ' + NOMS[dip] + ' et indique ' + fv(v) + '.' : 'Le voltmètre n’est pas encore branché.'));
  }
  var PV = {
    G: { v: [[260, 40], [260, -8], [237, -8]], c: [[180, 40], [180, -8], [203, -8]], o: [220, -8], h: [220, 40, 30] },
    L1: { v: [[340, 62], [400, 62], [400, 83]], c: [[340, 138], [400, 138], [400, 117]], o: [400, 100], h: [340, 100, 30] },
    L2: { v: [[275, 160], [275, 205], [237, 205]], c: [[165, 160], [165, 205], [203, 205]], o: [220, 205], h: [220, 160, 30] },
    K: { v: [[100, 138], [44, 138], [44, 117]], c: [[100, 62], [44, 62], [44, 83]], o: [44, 100], h: [100, 100, 32] }
  };
  function poly(p, col) { return '<path d="M' + p.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L') + '" fill="none" stroke="' + col + '" stroke-width="3.5" stroke-linejoin="round"/><circle cx="' + p[0][0] + '" cy="' + p[0][1] + '" r="5" fill="' + col + '"/>'; }
  function schema(dip, ferme) {
    var nom = dip ? ' Le voltmètre est branché en dérivation aux bornes de ' + NOMS[dip] + '.' : '';
    var s = A.schema({ cotes: { droite: 'lampe', bas: 'lampe', gauche: ferme ? 'interFerme' : 'interOuvert' }, legende: '', label: 'Schéma normalisé : pile, lampes L1 et L2 et interrupteur K en série.' + nom }), x = '';
    if (dip) {
      var p = PV[dip];
      x += '<circle cx="' + p.h[0] + '" cy="' + p.h[1] + '" r="' + p.h[2] + '" fill="' + OR + '" fill-opacity=".14" stroke="' + OR + '" stroke-width="2.5" stroke-dasharray="6 5"/>';
      x += poly(p.v, OR) + poly(p.c, BL) + '<circle cx="' + p.o[0] + '" cy="' + p.o[1] + '" r="17" fill="#fff" stroke="' + INK + '" stroke-width="2.5"/>' + A.T(p.o[0], p.o[1] + 6, 'V', 17, INK, 800);
    }
    x += A.T(316, 105, 'L1', 15, INK, 800, 'end') + A.T(220, 131, 'L2', 15, INK, 800) + A.T(124, 105, 'K', 15, INK, 800, 'start');
    return s.replace('viewBox="0 0 440 200"', dip ? 'viewBox="0 -40 440 270"' : 'viewBox="0 8 440 180"').replace('</svg>', x + '</svg>');
  }

  /* ---------- gabarits ---------- */
  function btn(id, txt, dis) { return '<button type="button" class="sp-btn mo-go" id="' + id + '"' + (dis ? ' disabled' : '') + '>' + txt + '</button>'; }
  function ch(id, opts, sel, nom, cls) {
    return '<div class="ch ' + (cls || '') + '" data-ch="' + id + '" role="group" aria-label="' + esc(nom || '') + '">' + opts.map(function (o, i) { return '<button type="button" data-i="' + i + '" aria-pressed="' + (sel === i) + '">' + o + '</button>'; }).join('') + '</div>';
  }
  var LIGNES = [['G', 'Pile'], ['L1', 'Lampe L1'], ['L2', 'Lampe L2'], ['Kouv', 'Interrupteur K ouvert']];
  function tableau(recap) {
    return '<table class="tb"><caption class="sr">Tensions mesurées avec le voltmètre</caption><thead><tr><th scope="col">Aux bornes de</th><th scope="col">Tension U</th></tr></thead><tbody>'
      + LIGNES.filter(function (l) { return !recap || S.mes[l[0]] != null; }).map(function (l) { var v = S.mes[l[0]]; return '<tr data-k="' + l[0] + '"><th scope="row">' + l[1] + '</th><td>' + (v == null ? '<span class="vide">' + (l[0] === 'Kouv' ? 'facultatif' : 'à mesurer') + '</span>' : fv(v)) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function verdict() {
    var a = fv(S.mes.L1 == null ? U1 : S.mes.L1), b = fv(S.mes.L2 == null ? U2 : S.mes.L2), mes = 'U(L1) = ' + a + ' et U(L2) = ' + b;
    if (S.hyp === 0) return { ok: false, txt: 'Aucune lampe n’a 4,5 V : ' + mes + '.' };
    if (S.hyp === 1) return { ok: false, txt: 'Les lampes n’ont pas la moitié chacune : ' + mes + '. Les deux valeurs sont différentes.' };
    return { ok: true, txt: mes + ' : les tensions sont bien différentes. Et leur somme donne la tension de la pile.' };
  }
  function entree(m, etat, corps) {
    return '<section class="en ' + etat + (m === 4 ? ' lab-en' : '') + '" id="m' + m + '" aria-labelledby="t' + m + '"><span class="no" aria-hidden="true">' + m + '</span><h2 id="t' + m + '"><span class="sr">Moment ' + m + ' sur 9 : </span>' + TITRES[m - 1] + '</h2>' + corps + '</section>';
  }

  /* ---------- moments en cours ---------- */
  function actif(m) {
    var h = '';
    if (m === 1) {
      h = '<p class="mo-big">Au TP, Awa et Kofi montent un circuit en série : une pile de 4,5 V, un interrupteur et deux lampes différentes, L1 et L2.</p>'
        + '<blockquote class="mo-quote"><b>Kofi</b><span>« Comme pour l’intensité, c’est pareil partout : chaque lampe aura 4,5 V. »</span></blockquote>'
        + '<blockquote class="mo-quote"><b>Awa</b><span>« Je n’en suis pas sûre. Mesurons avec un voltmètre. »</span></blockquote>'
        + '<div class="fig">' + schema(null, true) + '</div>'
        + '<p class="pb"><b>Question :</b> quelle tension le voltmètre indiquera-t-il aux bornes de chaque lampe ?</p>' + btn('c1', 'Je me mets au travail');
    } else if (m === 2) {
      h = '<p class="mo-lead">Avant de mesurer, je prépare mon matériel.</p>' + G2.map(function (g, k) {
        return '<div class="g2" data-g="' + k + '"><p><b>' + (k + 1) + '. ' + g.q + '</b></p>' + ch('g' + k, g.o, null, g.q, g.o.length < 3 ? 'deux' : '') + '<p class="ex" aria-live="polite"></p></div>';
      }).join('') + '<p class="mo-msg" id="m2msg" aria-live="polite"></p>' + btn('c2', 'Continuer', true);
    } else if (m === 3) {
      h = '<p class="mo-lead">Avant de mesurer, je dis ce que je pense qu’il va se passer. Je peux me tromper : c’est le but d’une hypothèse.</p>'
        + ch('hyp', HYP, S.hyp, 'Mon hypothèse')
        + '<div class="mo-field"><label for="car">Je pense ça parce que… (facultatif)</label><textarea id="car" rows="2">' + esc(S.car) + '</textarea></div>' + btn('c3', 'Je valide mon hypothèse', S.hyp == null);
    } else if (m === 4) {
      h = '<ol class="mo-steps consigne"><li>Touche un dipôle : le voltmètre se branche à ses bornes.</li><li>Lis la tension : elle s’écrit dans ton tableau.</li><li>Mesure la pile, L1 et L2 (interrupteur fermé). Puis K, interrupteur ouvert, si tu veux.</li></ol>' + labo() + btn('c4', 'J’ai mes mesures', true);
    } else if (m === 5) {
      h = '<p class="mo-lead">Voici ton tableau. Je calcule avec mes propres mesures.</p>' + tableau(true)
        + '<form class="num" id="f5"><label for="som">U(L1) + U(L2) =</label><input id="som" inputmode="decimal" autocomplete="off"><span>V</span><button class="sp-btn">Vérifier</button></form><p class="ex" id="x5a" aria-live="polite"></p>'
        + '<p><b>U(L1) et U(L2) sont-elles égales ?</b></p>' + ch('egal', ['Oui, égales', 'Non, différentes'], null, 'Comparer U(L1) et U(L2)', 'deux') + '<p class="ex" id="x5b" aria-live="polite"></p>' + btn('c5', 'Continuer', true);
    } else if (m === 6) {
      h = '<blockquote class="mo-quote"><b>Mon hypothèse</b><span>' + esc(HYP[S.hyp == null ? 2 : S.hyp]) + (S.car.trim() ? ' Parce que ' + esc(S.car.trim()) : '') + '</span></blockquote>'
        + '<p class="mo-lead">Je relis mes mesures : ' + 'U(L1) = ' + fv(S.mes.L1 == null ? U1 : S.mes.L1) + ', U(L2) = ' + fv(S.mes.L2 == null ? U2 : S.mes.L2) + '.</p>'
        + '<p><b>Mon hypothèse est…</b></p>' + ch('jug', ['confirmée', 'à corriger'], S.jug, 'Mon jugement', 'deux') + '<div id="v6" aria-live="polite"></div>' + btn('c6', 'Continuer', S.jug == null);
    } else if (m === 7) {
      h = '<p class="mo-lead">J’écris mon bilan en deux ou trois phrases : ce que j’ai mesuré, ce que j’ai compris.</p>'
        + '<div class="mo-field"><label for="bilan">Mon bilan</label><textarea id="bilan" rows="5" placeholder="Quand deux lampes sont en série, la tension…">' + esc(S.bilan) + '</textarea></div>'
        + '<button type="button" class="sp-btn ghost" id="ajmes">Ajouter mes mesures</button><p class="mo-msg" id="m7msg" aria-live="polite"></p>' + btn('c7', 'Continuer', S.bilan.trim().length < 25);
    } else if (m === 8) {
      h = '<div class="mo-crit sci"><b>Bilan scientifique</b><p>Dans un circuit en série, la tension aux bornes de la pile est égale à la somme des tensions aux bornes des lampes.</p><p class="loi">U = U1 + U2</p><p>Deux lampes différentes n’ont pas forcément la même tension. Le voltmètre se branche en dérivation, aux bornes du dipôle, et la tension s’exprime en volts (V).</p></div>'
        + '<blockquote class="mo-quote"><b>Mon bilan</b><span>' + esc(S.bilan) + '</span></blockquote>'
        + '<fieldset class="chk" style="border:0;padding:0;margin:0"><legend><b>Je compare : mon bilan contient-il…</b></legend>' + CRIT.map(function (c, i) { return '<label><input type="checkbox" data-c="' + i + '"' + (S.crit[i] ? ' checked' : '') + '><span>' + c + '</span></label>'; }).join('') + '</fieldset>'
        + '<p class="mo-msg" id="m8msg" aria-live="polite"></p>' + btn('c8', 'Passer au défi');
    } else {
      h = defiHtml();
    }
    return entree(m, 'actif', h);
  }
  function labo() {
    return '<div class="lab" id="lab"><div class="lab-ctl"><div class="ecran"><small id="lb-lib">Voltmètre non branché</small><output id="lb-val">— V</output></div>'
      + '<div class="dips" role="group" aria-label="Brancher le voltmètre aux bornes de">' + [['G', 'Pile'], ['L1', 'L1'], ['L2', 'L2'], ['K', 'K']].map(function (d) { return '<button type="button" data-d="' + d[0] + '" aria-pressed="false" aria-label="Brancher le voltmètre aux bornes de ' + NOMS[d[0]] + '">' + d[1] + '</button>'; }).join('') + '</div>'
      + '<button type="button" class="sp-btn ghost" id="lb-k">Ouvrir l’interrupteur</button><p class="mo-msg msgl" id="lb-msg" aria-live="polite"></p></div>'
      + '<div class="lab-fig"><figure><div id="lb-m"></div><figcaption>Montage</figcaption></figure><figure><div id="lb-s"></div><figcaption>Schéma normalisé</figcaption></figure></div>'
      + '<p class="leg msgl"><i style="background:' + OR + '"></i>fil orange : borne V (côté +) &nbsp; <i style="background:' + BL + '"></i>fil bleu : borne COM (côté −)</p>'
      + '<div id="lb-t"></div></div>';
  }
  function defiHtml() {
    var i = S.rep.length, q = DEFI[i];
    var corps = q.t === 'c' ? ch('dq', q.c, null, 'Réponses possibles') : '<form class="num" id="dn"><label class="sr" for="dv">Ta réponse en ' + q.u + '</label><input id="dv" inputmode="decimal" autocomplete="off"><span>' + q.u + '</span><button class="sp-btn">Valider</button></form>';
    return '<p class="sp-note">Manche ' + (i + 1) + ' sur ' + DEFI.length + ' · seul ou en équipe : on peut en discuter avant de répondre</p><p class="mo-big">' + q.q + '</p>' + corps + '<div id="dx" aria-live="polite"></div>';
  }

  /* ---------- moments terminés ---------- */
  function recap(m) {
    var h = '';
    if (m === 1) h = '<p class="rec">Kofi pense que chaque lampe aura 4,5 V. Awa n’en est pas sûre. <b>Question :</b> quelle tension aux bornes de chaque lampe ?</p>';
    else if (m === 2) h = '<p class="rec">On mesure <b>la tension</b> avec <b>un voltmètre</b>, branché <b>en dérivation</b> aux bornes de la lampe.</p>';
    else if (m === 3) h = '<p class="rec"><b>Mon hypothèse :</b> ' + esc(HYP[S.hyp == null ? 0 : S.hyp]) + (S.car.trim() ? '<br>Parce que ' + esc(S.car.trim()) : '') + '</p>';
    else if (m === 4) h = tableau(true);
    else if (m === 5) h = '<p class="rec">' + fv(S.mes.L1) + ' + ' + fv(S.mes.L2) + ' = <b>' + fv(UG) + '</b>, la tension de la pile. U(L1) et U(L2) sont différentes.</p>';
    else if (m === 6) { var v = verdict(); h = '<p class="rec"><b>Hypothèse ' + (v.ok ? 'confirmée' : 'à corriger') + '.</b> ' + v.txt + '</p>'; }
    else if (m === 7) h = '<blockquote class="mo-quote"><b>Mon bilan</b><span>' + esc(S.bilan) + '</span></blockquote>';
    else if (m === 8) h = '<p class="rec">Mon bilan comparé au bilan scientifique : ' + S.crit.reduce(function (a, b) { return a + (b ? 1 : 0); }, 0) + ' critère(s) sur ' + CRIT.length + '.</p>';
    else h = '<p class="rec"><b>Défi terminé :</b> ' + score() + ' manches réussies sur ' + DEFI.length + '.</p><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p>';
    return entree(m, 'fait', h);
  }
  function fin() {
    return '<section class="fin" id="fin"><h2>Mon cahier est terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p><b>À retenir :</b> en série, la tension de la pile est égale à la somme des tensions aux bornes des lampes. Le voltmètre se branche en dérivation.</p><button type="button" class="sp-btn mo-go" id="imp2">Imprimer mon cahier</button><button type="button" class="sp-btn ghost" id="again">Recommencer le cahier</button></section>';
  }

  /* ---------- affichage ---------- */
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function rendre(defile) {
    var h = '', m;
    for (m = 1; m <= S.m; m++) h += (m === S.m && !(m === 9 && S.fini)) ? actif(m) : recap(m);
    if (S.fini) h += fin();
    $('#cb').innerHTML = h;
    $$('#cb-bar').forEach(function (b) { b.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { return '<i' + (i <= S.m ? ' class="on"' : '') + '></i>'; }).join(''); b.setAttribute('aria-label', 'Moment ' + S.m + ' sur 9'); });
    $('#cb-count').textContent = 'Moment ' + S.m + ' sur 9';
    $('#cb-prof').hidden = !(S.m === 4);
    if (profOn && S.m !== 4) prof(false);
    if (!S.fini) lier(S.m); else { var ag = $('#again'); if (ag) ag.onclick = recommencer; var im = $('#imp2'); if (im) im.onclick = function () { window.print(); }; }
    if (defile && !premier || (defile && S.m > 1)) { var el = S.fini ? $('#fin') : $('#m' + S.m); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: calme() ? 'auto' : 'smooth' }); }
    premier = false;
  }
  function suite(m) { S.m = m + 1; sauve(); rendre(true); }
  function recommencer() { var nom = S.nom; S = neuf(); S.nom = nom; L = { dip: null, ferme: true }; sauve(); rendre(false); window.scrollTo && window.scrollTo(0, 0); }

  function lier(m) {
    var r = $('#m' + m), c;
    if (m === 1) $('#c1').onclick = function () { suite(1); };
    else if (m === 2) {
      c = $('#c2');
      $$('.g2', r).forEach(function (bl) {
        var k = +bl.dataset.g, g = G2[k], gr = $('.ch', bl), ex = $('.ex', bl);
        function ok() { $$('button', gr).forEach(function (b, j) { b.disabled = true; if (j === g.b) b.classList.add('bon'); }); ex.innerHTML = '<b>Oui.</b>'; }
        if (S.mat[k]) ok();
        gr.onclick = function (e) {
          var b = e.target.closest('button'); if (!b || b.disabled) return;
          var j = +b.dataset.i; $$('button', gr).forEach(function (x) { x.classList.remove('faux'); });
          if (j === g.b) { S.mat[k] = 1; sauve(); ok(); } else { b.classList.add('faux'); ex.textContent = 'Pas encore. ' + g.h; }
          var tous = S.mat.every(Boolean); c.disabled = !tous; $('#m2msg').textContent = tous ? 'Mon matériel est prêt.' : '';
        };
      });
      c.disabled = !S.mat.every(Boolean); c.onclick = function () { suite(2); };
    } else if (m === 3) {
      $('[data-ch="hyp"]', r).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.hyp = +b.dataset.i; $$('[data-ch="hyp"] button', r).forEach(function (x, j) { x.setAttribute('aria-pressed', j === S.hyp); }); $('#c3').disabled = false; sauve(); };
      $('#car').oninput = function () { S.car = this.value; sauve(); };
      $('#c3').onclick = function () { suite(3); };
    } else if (m === 4) {
      var rd = $('#c4');
      $$('.dips button', r).forEach(function (b) { b.onclick = function () { L.dip = b.dataset.d; peint(); }; });
      $('#lb-k').onclick = function () { L.ferme = !L.ferme; peint(); };
      rd.onclick = function () { suite(4); };
      peint();
    } else if (m === 5) {
      c = $('#c5');
      function ok5() { c.disabled = !(S.somme && S.egal); }
      $('#f5').onsubmit = function (e) {
        e.preventDefault(); var v = num($('#som').value), ex = $('#x5a');
        if (v != null && Math.abs(v - UG) < 0.001) { S.somme = 1; sauve(); ex.innerHTML = '<b>Exact.</b> ' + fv(S.mes.L1) + ' + ' + fv(S.mes.L2) + ' = ' + fv(UG) + ', c’est la tension de la pile.<br><span class="loi">U(G) = U(L1) + U(L2)</span>'; ok5(); }
        else ex.textContent = 'Pas encore. Additionne les deux tensions de ton tableau, en volts.';
      };
      $('[data-ch="egal"]', r).onclick = function (e) {
        var b = e.target.closest('button'); if (!b) return; var j = +b.dataset.i, ex = $('#x5b');
        if (j === 1) { S.egal = 1; sauve(); $$('[data-ch="egal"] button', r).forEach(function (x, k) { x.disabled = true; x.setAttribute('aria-pressed', k === 1); if (k === 1) x.classList.add('bon'); }); ex.innerHTML = '<b>Non.</b> ' + fv(S.mes.L1) + ' et ' + fv(S.mes.L2) + ' sont différentes.'; ok5(); }
        else { b.classList.add('faux'); ex.textContent = 'Compare les deux valeurs de ton tableau.'; }
      };
      if (S.somme) { $('#som').value = String(UG).replace('.', ','); $('#x5a').innerHTML = '<b>Exact.</b>'; }
      if (S.egal) { var bb = $$('[data-ch="egal"] button', r)[1]; bb.classList.add('bon'); $$('[data-ch="egal"] button', r).forEach(function (x) { x.disabled = true; }); }
      ok5(); c.onclick = function () { suite(5); };
    } else if (m === 6) {
      function montre() {
        var v = verdict(), bon = (S.jug === 0) === v.ok;
        $('#v6').innerHTML = '<div class="mo-crit' + (v.ok ? ' sci' : '') + '"><b>Verdict : hypothèse ' + (v.ok ? 'confirmée' : 'à corriger') + '.</b><p>' + v.txt + '</p><p>' + (bon ? 'Ton jugement est juste.' : 'Relis tes mesures : ton jugement n’est pas le bon.') + '</p></div>';
      }
      if (S.jug != null) { montre(); $$('[data-ch="jug"] button', r).forEach(function (x, j) { x.setAttribute('aria-pressed', j === S.jug); }); }
      $('[data-ch="jug"]', r).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.jug = +b.dataset.i; $$('[data-ch="jug"] button', r).forEach(function (x, j) { x.setAttribute('aria-pressed', j === S.jug); }); sauve(); montre(); $('#c6').disabled = false; };
      $('#c6').onclick = function () { suite(6); };
    } else if (m === 7) {
      var ta = $('#bilan'), c7 = $('#c7');
      function maj7() { S.bilan = ta.value; sauve(); var okk = ta.value.trim().length >= 25; c7.disabled = !okk; $('#m7msg').textContent = okk ? '' : 'Écris au moins une ou deux phrases pour continuer.'; }
      ta.oninput = maj7;
      $('#ajmes').onclick = function () { ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + 'U(G) = ' + fv(S.mes.G == null ? UG : S.mes.G) + ' ; U(L1) = ' + fv(S.mes.L1 == null ? U1 : S.mes.L1) + ' ; U(L2) = ' + fv(S.mes.L2 == null ? U2 : S.mes.L2) + '. '; maj7(); ta.focus(); };
      c7.onclick = function () { suite(7); };
    } else if (m === 8) {
      $$('.chk input', r).forEach(function (x) { x.onchange = function () { S.crit[+x.dataset.c] = x.checked ? 1 : 0; sauve(); var n = S.crit.reduce(function (a, b) { return a + b; }, 0); $('#m8msg').textContent = n + ' critère(s) sur ' + CRIT.length + '.'; }; });
      $('#c8').onclick = function () { suite(8); };
    } else liedefi(r);
  }

  /* laboratoire */
  function peint() {
    var d = L.dip, v = d ? tension(d, L.ferme) : null, msg;
    if (d) {
      if (d === 'G') S.mes.G = v;
      else if (d === 'K') { if (!L.ferme) S.mes.Kouv = v; }
      else if (L.ferme) S.mes[d] = v;
      sauve();
    }
    $('#lb-val').textContent = d ? fv(v) : '— V';
    $('#lb-lib').textContent = d ? 'Voltmètre aux bornes de ' + NOMS[d] : 'Voltmètre non branché';
    $$('.dips button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.d === d); });
    $('#lb-k').textContent = L.ferme ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur';
    if (!d) msg = 'Touche un dipôle pour brancher le voltmètre à ses bornes.';
    else if ((d === 'L1' || d === 'L2') && !L.ferme) msg = 'Interrupteur ouvert : 0 V, mesure non retenue. Ferme l’interrupteur pour mesurer la lampe.';
    else if (d === 'K' && L.ferme) msg = 'Interrupteur fermé : 0 V, mesure non retenue. Ouvre-le pour mesurer la tension à ses bornes.';
    else if (fait()) msg = 'Les trois mesures sont faites. Tu peux continuer' + (S.mes.Kouv == null ? ', ou mesurer K interrupteur ouvert.' : '.');
    else msg = 'Mesure écrite dans ton tableau.';
    $('#lb-msg').textContent = msg;
    $('#lb-m').innerHTML = montage(d, L.ferme); $('#lb-s').innerHTML = schema(d, L.ferme); $('#lb-t').innerHTML = tableau(false);
    $('#c4').disabled = !fait();
  }

  /* défi */
  function liedefi(r) {
    var i = S.rep.length, q = DEFI[i], zone = $('#dx', r);
    function fini(ok) {
      zone.innerHTML = '<div class="mo-crit' + (ok ? ' sci' : '') + '"><p><b>' + (ok ? 'Exact.' : 'Pas encore.') + '</b> ' + q.e + '</p></div><button type="button" class="sp-btn mo-go" id="dsv">' + (i + 1 < DEFI.length ? 'Manche suivante' : 'Voir mes étoiles') + '</button>';
      var b = $('#dsv', r); b.focus();
      b.onclick = function () { S.rep.push(ok ? 1 : 0); if (S.rep.length === DEFI.length) S.fini = true; sauve(); rendre(S.fini); };
    }
    var g = $('[data-ch="dq"]', r);
    if (g) g.onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var k = +b.dataset.i; $$('button', g).forEach(function (x, j) { x.disabled = true; if (j === q.b) x.classList.add('bon'); else if (j === k) x.classList.add('faux'); }); fini(k === q.b); };
    var f = $('#dn', r);
    if (f) f.onsubmit = function (e) { e.preventDefault(); var v = num($('#dv', r).value); if (v == null) return; $('#dv', r).disabled = true; $('button', f).disabled = true; fini(Math.abs(v - q.r) < 1e-9); };
  }

  /* mode enseignant, thème, impression, identité */
  function prof(on) {
    profOn = on; document.body.classList.toggle('prof', on);
    $('#cb-prof').textContent = on ? 'Quitter le mode enseignant' : 'Mode enseignant';
    if (on) { var l = $('#lab'); if (l && l.scrollIntoView) l.scrollIntoView({ block: 'start' }); }
  }
  function init() {
    if (!$('#cb')) return;
    S = lire();
    if (window.NohobaSimple) window.NohobaSimple.bindTheme();
    var nom = $('#nom'); nom.value = S.nom || ''; nom.oninput = function () { S.nom = nom.value; sauve(); };
    try { $('#cb-date').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}
    $('#cb-imp').onclick = function () { window.print(); };
    $('#cb-prof').onclick = function () { prof(!profOn); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && profOn) prof(false); });
    rendre(S.m > 1);
  }
  init();
})();
