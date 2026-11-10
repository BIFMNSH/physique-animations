/* Livre vivant · 3e · Les alcanes.
   Moment essentiel : formule générale CₙH₂ₙ₊₂ ; méthane (n = 1), éthane (2), propane (3), butane (4). Atomes CPK : C gris foncé, H blanc.
   Chapitre 2 : combustion complète (CO₂ + H₂O) et incomplète (CO, suie). Qualitatif pour les équations. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var NOM = ['', 'méthane', 'éthane', 'propane', 'butane'];
  var form = V.lois.formuleAlcane = function (n) { return { C: n, H: 2 * n + 2, nom: NOM[n] }; };
  var sub = function (k) { return String(k).split('').map(function (d) { return '₀₁₂₃₄₅₆₇₈₉'[+d]; }).join(''); };
  var fs = V.lois.ecritureAlcane = function (n) { var f = form(n); return 'C' + (n > 1 ? sub(n) : '') + 'H' + sub(f.H); };
  function sceneM(c, X) {
    var P = X.P, n = Math.round(+X.S[0].v.n), f = form(n), x0 = 180 - (n - 1) * 30, i;
    for (i = 0; i < n; i++) {
      var x = x0 + i * 60, y = 120; if (i > 0) P.line(c, x - 60, y, x, y, P.col.ink, 2.2);
      P.line(c, x, y, x, y - 34, P.col.soft, 1.8); P.line(c, x, y, x, y + 34, P.col.soft, 1.8); P.circ(c, x, y - 40, 7, P.col.ink, 1.4, '#F5F5F5'); P.circ(c, x, y + 40, 7, P.col.ink, 1.4, '#F5F5F5');
      if (i === 0) { P.line(c, x, y, x - 34, y, P.col.soft, 1.8); P.circ(c, x - 40, y, 7, P.col.ink, 1.4, '#F5F5F5'); } if (i === n - 1) { P.line(c, x, y, x + 34, y, P.col.soft, 1.8); P.circ(c, x + 40, y, 7, P.col.ink, 1.4, '#F5F5F5'); }
    }
    for (i = 0; i < n; i++) P.circ(c, x0 + i * 60, 120, 12, P.col.ink, 2.2, '#444B55');
    P.txt(c, f.nom + ' : ' + fs(n), 180, 24, 16, P.col.ink, 'center', 800); P.txt(c, f.C + ' C et ' + f.H + ' H', 180, 220, 13, P.col.ok, 'center', 800);
  }
  var PRO = { ample: ['CO₂ + H₂O', 'combustion complète', true], peu: ['CO + C (suie) + H₂O', 'combustion incomplète', false] };
  function sceneC(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var d = PRO[s.v.air], col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 90 + k * 190; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      c.fillStyle = d[2] ? 'rgba(60,120,255,.9)' : 'rgba(255,170,40,.92)'; c.beginPath(); c.ellipse(x0, 110, 14, 28, 0, 0, 6.2832); c.fill(); P.rect(c, x0 - 18, 138, 36, 14, col, 2.2, P.col.fill);
      P.txt(c, d[2] ? 'flamme bleue' : 'flamme jaune, suie', x0, 70, 11, col, 'center', 800); P.txt(c, 'produits :', x0, 175, 11, P.col.soft, 'center'); P.txt(c, d[0], x0, 193, 12, d[2] ? P.col.ok : P.col.hot, 'center', 800); P.txt(c, s.nom, x0, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'alcanes', defiTitre: 'Les alcanes : le défi',
    chap: [
      { titre: 'Une famille de molécules', labTitre: 'Du méthane au butane', cur: 'Pourquoi le gaz de la cuisinière s’appelle-t-il butane ?',
        paras: ['Les alcanes sont des molécules formées de carbone et d’hydrogène, avec des liaisons simples. Formule générale : CₙH₂ₙ₊₂.', 'Méthane : CH₄ · éthane : C₂H₆ · propane : C₃H₈ · butane : C₄H₁₀.'],
        loi: { t: 'Alcane : CₙH₂ₙ₊₂', s: 'méthane, éthane, propane, butane' }, note: 'Change le nombre d’atomes de carbone n : compte les H.',
        predis: { q: 'Un alcane a 3 atomes de carbone. Il a… atomes d’hydrogène', opts: ['8', '6', '3'], a: 0, rep: '2 × 3 + 2 = 8 : le propane C₃H₈.' },
        verif: { q: 'le butane a pour formule…', o: ['C₄H₁₀', 'C₄H₈', 'C₃H₈'], a: 0, e: 'C₄H₁₀.' },
        lab: { w: 380, h: 240, alt: 'Molécule d’alcane avec atomes de carbone et d’hydrogène', scene: sceneM, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'n', label: 'Atomes de carbone', min: 1, max: 4, step: 1, val: 3, unit: '', dec: 0 }],
          read: function (v) { var f = form(+v.n); return ['<b>' + f.nom + ' : ' + fs(+v.n) + '</b>', f.C + ' C et 2 × ' + f.C + ' + 2 = ' + f.H + ' H']; }, sound: function (v) { return 150 + 60 * +v.n; } } },
      { titre: 'Brûler un alcane', labTitre: 'Complète ou incomplète', cur: 'Pourquoi le gaz mal réglé noircit-il la casserole ?',
        paras: ['Avec assez de dioxygène, un alcane brûle complètement : dioxyde de carbone et eau.', 'Avec trop peu de dioxygène, la combustion est incomplète : monoxyde de carbone et suie.'],
        loi: { t: 'Complète : CO₂ + H₂O', s: 'incomplète : CO, suie' }, note: 'Compare air abondant et air limité. Expérience réelle par le professeur.',
        predis: { q: 'Combustion avec peu d’air : on obtient aussi…', opts: ['du monoxyde de carbone et de la suie', 'seulement du CO₂', 'de l’azote'], a: 0, rep: 'Du monoxyde de carbone et de la suie.' },
        verif: { q: 'les produits d’une combustion complète sont…', o: ['CO₂ et H₂O', 'CO et suie', 'H₂ et O₂'], a: 0, e: 'Dioxyde de carbone et eau.' },
        lab: { w: 380, h: 230, alt: 'Combustion complète et incomplète d’un alcane', scene: sceneC, live: false, notrace: true, sit: [{ nom: 'Situation A', vars: {} }, { nom: 'Situation B', vars: {} }], choices: [{ id: 'air', label: 'Dioxygène', opts: [['ample', 'Abondant'], ['peu', 'Limité']], val: 'ample', per: true }],
          read: function (v) { return [PRO[v.air][1] + ' : ' + PRO[v.air][0]]; }, sound: function (v) { return PRO[v.air][2] ? 420 : 160; } } }
    ],
    manches: function (LV) {
      var n = LV[0] && LV[0].n != null ? Math.round(+LV[0].n) : 3, f = form(n);
      return [
        { type: 'calcul', q: 'Dans le laboratoire, l’alcane a ' + n + ' atome(s) de carbone. Combien d’atomes d’hydrogène ?', ans: f.H, tol: 0.1, unit: 'atomes', e: '2 × ' + n + ' + 2 = ' + f.H + ' (' + f.nom + ').' },
        { type: 'qcm', q: 'Quels produits pour une combustion complète du propane ?', o: ['CO₂ et H₂O', 'CO et suie', 'H₂'], a: 0, e: 'Dioxyde de carbone et eau.' }
      ];
    }
  });
})();
