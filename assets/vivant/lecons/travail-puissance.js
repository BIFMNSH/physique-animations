/* Livre vivant · 3e · Travail et puissance.
   Moment essentiel : le travail d'une force constante dans le sens du déplacement W = F × d (en joules) ; la puissance P = W ÷ t (en watts).
   Valeurs de lecture choisies pour des calculs simples ; force dans le sens du déplacement uniquement. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var travail = V.lois.travailForce = function (F, d) { return F * d; };
  var puiss = V.lois.puissanceMoy = function (W, t) { return W / t; };
  function sceneW(c, X) {
    var P = X.P, F = +X.S[0].v.F, d = +X.S[0].v.d, x = 40 + d * 22;
    P.line(c, 30, 170, 340, 170, P.col.ink, 2.6); P.rect(c, x, 130, 40, 40, P.col.ink, 2.6, '#E9DDBB'); if (F > 0) P.arrow(c, x + 40, 150, x + 40 + F * 1.2 + 10, 150, P.col.hot, 3.4);
    P.line(c, 60, 190, 60 + d * 22, 190, P.col.a, 2.4); P.txt(c, 'd = ' + fr(d, 0) + ' m', 60 + d * 11, 206, 12, P.col.a, 'center', 800); P.txt(c, 'F = ' + fr(F, 0) + ' N', x + 20, 118, 12, P.col.hot, 'center', 800);
    P.txt(c, 'W = F × d = ' + fr(travail(F, d), 0) + ' J', 190, 30, 15, P.col.ink, 'center', 800);
  }
  var W0 = 200;
  function sceneP(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var t = +s.v.t, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 95 + k * 190, p = puiss(W0, t); c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0, 110, 34, col, 2.6, P.col.paper); P.line(c, x0, 110, x0 + 24 * Math.sin(t / 30 * 6.28), 110 - 24 * Math.cos(t / 30 * 6.28), P.col.hot, 2.6); P.txt(c, fr(t, 0) + ' s', x0, 160, 13, col, 'center', 800);
      P.txt(c, 'W = 200 J', x0, 40, 12, P.col.ink, 'center', 800); P.txt(c, 'P = ' + fr(p, 0) + ' W', x0, 190, 14, P.col.hot, 'center', 800); P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'travail-puissance', defiTitre: 'Travail et puissance : le défi',
    chap: [
      { titre: 'Le travail d’une force', labTitre: 'Pousser une caisse', cur: 'Pourquoi pousser une caisse sur 10 m fatigue-t-il plus que sur 2 m ?',
        paras: ['Une force constante qui déplace son point d’application dans le sens du mouvement fournit un travail : W = F × d.', 'Le travail s’exprime en joules (J), la force en newtons (N), la distance en mètres (m).'],
        loi: { t: 'W = F × d', s: 'travail en joules · force dans le sens du déplacement' }, note: 'Force dans le sens du déplacement seulement.',
        predis: { q: 'On double la distance, la force reste la même. Le travail…', opts: ['double', 'reste identique', 'est divisé par deux'], a: 0, rep: 'Il double : W = F × d.' },
        verif: { q: 'une force de 20 N déplace un objet de 3 m. Le travail est…', o: ['60 J', '23 J', '17 J'], a: 0, e: '20 × 3 = 60 J.' },
        lab: { w: 380, h: 230, alt: 'Caisse poussée par une force sur une distance', scene: sceneW, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'F', label: 'Force', min: 0, max: 100, step: 10, val: 50, unit: 'N', dec: 0 }, { id: 'd', label: 'Distance', min: 0, max: 10, step: 1, val: 4, unit: 'm', dec: 0 }],
          read: function (v) { return ['<b>W = ' + fr(+v.F, 0) + ' × ' + fr(+v.d, 0) + ' = ' + fr(travail(+v.F, +v.d), 0) + ' J</b>']; }, sound: function (v) { return 150 + travail(+v.F, +v.d) / 3; } } },
      { titre: 'La puissance', labTitre: 'Même travail, durées différentes', cur: 'Pourquoi un moteur plus puissant monte-t-il la charge plus vite ?',
        paras: ['La puissance est le travail fourni par seconde : P = W ÷ t, en watts (W).', 'À travail égal, celui qui met moins de temps a la plus grande puissance.'],
        loi: { t: 'P = W ÷ t', s: 'puissance en watts · 1 W = 1 J/s' }, note: 'Travail fixé : 200 J. Compare deux durées.',
        predis: { q: 'Même travail, durée plus courte. La puissance est…', opts: ['plus grande', 'plus petite', 'identique'], a: 0, rep: 'Plus grande : P = W ÷ t.' },
        verif: { q: '200 J fournis en 10 s, la puissance est…', o: ['20 W', '2 000 W', '210 W'], a: 0, e: '200 ÷ 10 = 20 W.' },
        lab: { w: 380, h: 230, alt: 'Deux chronomètres pour le même travail', scene: sceneP, live: false, notrace: true, sit: [{ nom: 'Moteur A', vars: {} }, { nom: 'Moteur B', vars: {} }], inputs: [{ id: 't', label: 'Durée', min: 5, max: 40, step: 5, val: [10, 20], per: true, unit: 's', dec: 0 }],
          read: function (v) { return ['P = ' + W0 + ' ÷ ' + fr(+v.t, 0) + ' = ' + fr(puiss(W0, +v.t), 0) + ' W']; }, sound: function (v) { return 150 + 8 * puiss(W0, +v.t); } } }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, F = l.F != null ? +l.F : 50, d = l.d != null ? +l.d : 4, t = LV[1] && LV[1].t != null ? +LV[1].t : 10;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, F = ' + fr(F, 0) + ' N sur ' + fr(d, 0) + ' m. Quel travail, en J ?', ans: F * d, tol: 0.5, unit: 'J', e: 'W = ' + fr(F, 0) + ' × ' + fr(d, 0) + ' = ' + fr(F * d, 0) + ' J.' },
        { type: 'calcul', q: 'Kofi fournit 200 J en ' + fr(t, 0) + ' s. Quelle puissance, en W ?', ans: 200 / t, tol: 0.5, unit: 'W', e: '200 ÷ ' + fr(t, 0) + ' = ' + fr(200 / t, 0) + ' W.' }
      ];
    }
  });
})();
