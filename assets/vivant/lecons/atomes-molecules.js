/* Livre vivant · 5e · Mélanges et réactions chimiques · Atomes et molécules.
   Moment essentiel : on choisit une molécule et un nombre de molécules ; les atomes sont dessinés en couleurs CPK (H blanc, C gris, O rouge)
   et le dénombrement des atomes est calculé à partir de la formule. Les tailles des atomes sont schématiques. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var COL = { H: '#FFFFFF', C: '#909090', O: '#FF0D0D', N: '#3050F8' }, RAY = { H: 7, C: 12, O: 11, N: 11 }, NOMA = { H: 'hydrogène', C: 'carbone', O: 'oxygène' };
  var MOL = {
    H2: { n: 'dihydrogène', f: 'H₂', at: { H: 2 }, g: [['H', -9, 0], ['H', 9, 0]], b: [[0, 1]] },
    O2: { n: 'dioxygène', f: 'O₂', at: { O: 2 }, g: [['O', -12, 0], ['O', 12, 0]], b: [[0, 1]] },
    H2O: { n: 'eau', f: 'H₂O', at: { H: 2, O: 1 }, g: [['O', 0, -6], ['H', -16, 10], ['H', 16, 10]], b: [[0, 1], [0, 2]] },
    CO2: { n: 'dioxyde de carbone', f: 'CO₂', at: { C: 1, O: 2 }, g: [['C', 0, 0], ['O', -24, 0], ['O', 24, 0]], b: [[0, 1], [0, 2]] },
    CH4: { n: 'méthane', f: 'CH₄', at: { C: 1, H: 4 }, g: [['C', 0, 0], ['H', -16, -14], ['H', 16, -14], ['H', -16, 14], ['H', 16, 14]], b: [[0, 1], [0, 2], [0, 3], [0, 4]] }
  };
  var total = V.lois.atomesTotal = function (m, n) { var t = {}, k; for (k in MOL[m].at) t[k] = MOL[m].at[k] * n; return t; };
  var nb = function (t) { var s = 0, k; for (k in t) s += t[k]; return s; };
  function molecule(c, P, m, cx, cy, k) {
    var M = MOL[m], i; c.save(); c.translate(cx, cy); c.scale(k, k);
    M.b.forEach(function (b) { P.line(c, M.g[b[0]][1], M.g[b[0]][2], M.g[b[1]][1], M.g[b[1]][2], P.col.soft, 4); });
    M.g.forEach(function (a) { P.circ(c, a[1], a[2], RAY[a[0]], P.col.ink, 2, COL[a[0]]); });
    c.restore();
  }
  function scene(c, X) {
    var P = X.P, S = X.S, two = S.length > 1;
    S.forEach(function (s, k) {
      var m = s.v.m, n = +s.v.n, t = total(m, n), col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, i, el;
      c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      var oy = two ? 10 + k * 128 : 0, pos = [];
      for (i = 0; i < n; i++) pos.push(two ? [52 + i * 64, oy + 62] : [70 + (i % 2) * 100, 80 + Math.floor(i / 2) * 100]);
      pos.forEach(function (p) { molecule(c, P, m, p[0], p[1], two ? 1 : 1.5); });
      var tx = two ? 290 : 255, ty = two ? oy + 40 : 70, j = 0;
      if (two) P.txt(c, s.nom, 8, oy + 8, 12, col, 'left', 800);
      P.txt(c, n + ' ' + MOL[m].f, tx, ty - 22, 15, col, 'left', 800);
      for (el in t) { P.circ(c, tx + 7, ty + 6 + j * 24, 7, P.col.ink, 1.8, COL[el]); P.txt(c, t[el] + ' ' + el, tx + 20, ty + 6 + j * 24, 14, P.col.ink, 'left', 800); j++; }
      c.restore();
    });
  }
  function lig(v) {
    var M = MOL[v.m], n = +v.n, t = total(v.m, n), parts = [], el;
    for (el in t) parts.push(t[el] + ' atome' + (t[el] > 1 ? 's' : '') + ' ' + el);
    var kind = Object.keys(M.at).length === 1 ? 'corps pur simple (atomes identiques)' : 'corps pur composé (atomes différents)';
    return ['<b>' + n + ' ' + M.f + ' : ' + parts.join(' + ') + ' = ' + nb(t) + ' atomes</b>', M.n.charAt(0).toUpperCase() + M.n.slice(1) + ' : ' + kind + '.'];
  }
  var nI = { id: 'n', label: 'Nombre de molécules', min: 1, max: 4, step: 1, val: 2, unit: '', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, live: false, notrace: true, read: lig, inputs: [nI], sound: function (v) { return 200 + 40 * nb(total(v.m, +v.n)) / 4; } };
  V.add({
    slug: 'atomes-molecules', defiTitre: 'Atomes et molécules : le défi',
    chap: [
      { titre: 'Compter les atomes', labTitre: 'Construire des molécules', cur: 'Que veut dire le petit 2 dans H₂O ?',
        paras: ['Une molécule est un assemblage d’atomes. Sa formule dit lesquels : dans H₂O, il y a 2 atomes d’hydrogène (H) et 1 atome d’oxygène (O).', 'On représente les atomes par des boules de couleur : hydrogène blanc, carbone gris, oxygène rouge.'],
        loi: { t: 'H₂O = 2 atomes H + 1 atome O', s: 'le petit nombre indique les atomes de l’élément qui précède' }, note: 'Choisis une molécule et le nombre de copies : les atomes se comptent tout seuls.',
        predis: { q: 'Dans la formule H₂O, que signifie le petit 2 ?', opts: ['2 atomes d’hydrogène', '2 molécules d’eau', '2 atomes d’oxygène'], a: 0, rep: 'Le 2 se rapporte à H : une molécule d’eau a 2 atomes d’hydrogène et 1 atome d’oxygène.' },
        verif: { q: 'une molécule de CO₂ contient…', o: ['1 atome C et 2 atomes O', '2 atomes C et 1 atome O', '3 atomes C'], a: 0, e: '1 atome de carbone et 2 atomes d’oxygène.' },
        lab: Object.assign({}, base, { alt: 'Molécules en boules de couleur et comptage des atomes', sit: [{ nom: '', vars: {} }], choices: [{ id: 'm', label: 'Molécule', opts: [['H2', 'H₂'], ['O2', 'O₂'], ['H2O', 'H₂O'], ['CO2', 'CO₂'], ['CH4', 'CH₄']], val: 'H2O' }] }) },
      { titre: 'Simple ou composé', labTitre: 'Dioxygène et eau côte à côte', cur: 'Pourquoi l’oxygène de l’air n’est-il pas la même chose que l’eau ?',
        paras: ['Un corps pur simple n’a qu’une sorte d’atomes (O₂, H₂) ; un corps pur composé en a plusieurs (H₂O, CO₂).', 'Avec les mêmes atomes assemblés autrement, on obtient d’autres corps purs.'],
        loi: { t: 'Simple : une sorte d’atomes', s: 'composé : plusieurs sortes d’atomes' }, note: 'Compare en alternance : même nombre de molécules, des atomes de natures différentes.',
        predis: { q: 'La molécule de dioxygène O₂ est…', opts: ['un corps pur simple', 'un corps pur composé', 'un mélange'], a: 0, rep: 'Un corps pur simple : elle ne contient que des atomes d’oxygène.' },
        verif: { q: 'H₂O est…', o: ['un corps pur simple', 'un corps pur composé', 'un atome'], a: 1, e: 'Deux sortes d’atomes : un corps pur composé.' },
        lab: Object.assign({}, base, { alt: 'Molécules de dioxygène et d’eau comparées', sit: [{ nom: 'Dioxygène', vars: { m: 'O2' } }, { nom: 'Eau', vars: { m: 'H2O' } }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, m = MOL[l.m] ? l.m : 'H2O', n = l.n != null ? +l.n : 2, tot = nb(total(m, n));
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as pris ' + n + ' molécule' + (n > 1 ? 's' : '') + ' de ' + MOL[m].f + '. Combien d’atomes y a-t-il en tout ?', ans: tot, tol: 0.1, unit: 'atomes', e: MOL[m].f + ' compte ' + nb(MOL[m].at) + ' atome' + (nb(MOL[m].at) > 1 ? 's' : '') + ' : ' + nb(MOL[m].at) + ' × ' + n + ' = ' + tot + '.' },
        { type: 'qcm', q: 'Quelle molécule est un corps pur composé ?', o: ['O₂', 'H₂', 'CO₂'], a: 2, e: 'CO₂ contient deux sortes d’atomes (C et O).' }
      ];
    }
  });
})();
