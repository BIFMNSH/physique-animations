/* Livre vivant · 3e · Électrolyse de l'eau.
   Moment essentiel : le courant décompose l'eau en dihydrogène (volume double) et en dioxygène : 2 H₂O → 2 H₂ + O₂.
   Volumes : 1 mL de O₂ par 10 % de durée (choix de dessin) ; rapport 2:1 H₂/O₂ du modèle. Tests des gaz réservés au professeur. CPK : H blanc, O rouge. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var vol = V.lois.volumesElectrolyse = function (t) { var o = t / 10; return { O2: o, H2: 2 * o }; };
  var bilan = V.lois.bilanElectrolyse = function (n) { return { H2O: n, H2: n, O2: n / 2, atomesH: 2 * n, atomesO: n }; };
  function tube(c, P, x, hv, gaz, col) {
    P.poly(c, [[x, 50], [x, 190], [x + 50, 190], [x + 50, 50]], P.col.ink, 2.4); c.fillStyle = 'rgba(190,220,240,.5)'; c.fillRect(x + 2, 52 + hv * 6.4, 46, 136 - hv * 6.4);
    P.txt(c, gaz + ' : ' + fr(hv, hv % 1 ? 1 : 0) + ' mL', x + 25, 40, 13, col, 'center', 800);
  }
  function sceneE(c, X) {
    var P = X.P, t = +X.S[0].v.t, v = vol(t);
    P.rect(c, 60, 180, 240, 30, P.col.ink, 2.6, 'rgba(190,220,240,.5)'); tube(c, P, 110, 0 + v.H2, 'H₂', P.col.b); tube(c, P, 200, 0 + v.O2, 'O₂', P.col.hot);
    P.circ(c, 135, 210, 4, P.col.ink, 1.5, P.col.ink); P.circ(c, 225, 210, 4, P.col.ink, 1.5, P.col.ink); P.txt(c, '−', 135, 228, 13, P.col.a, 'center', 800); P.txt(c, '+', 225, 228, 13, P.col.b, 'center', 800);
    P.txt(c, 'rapport 2 : 1', 180, 14, 13, P.col.ok, 'center', 800);
  }
  function atome(c, P, x, y, h) { P.circ(c, x, y, h ? 5 : 8, P.col.ink, 1.4, h ? '#F5F5F5' : '#E23B3B'); }
  function sceneB(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var n = +s.v.n, b = bilan(n), col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 20 + k * 185, i; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      for (i = 0; i < n; i++) { atome(c, P, x0 + 20 + (i % 3) * 34, 70 + Math.floor(i / 3) * 34, false); atome(c, P, x0 + 12 + (i % 3) * 34, 80 + Math.floor(i / 3) * 34, true); atome(c, P, x0 + 28 + (i % 3) * 34, 80 + Math.floor(i / 3) * 34, true); }
      P.txt(c, n + ' H₂O', x0 + 60, 160, 12, col, 'center', 800); P.txt(c, '→ ' + b.H2 + ' H₂ + ' + fr(b.O2, 1 * (b.O2 % 1 ? 1 : 0)) + ' O₂', x0 + 60, 180, 12, P.col.hot, 'center', 800); P.txt(c, 'H : ' + b.atomesH + ' · O : ' + b.atomesO, x0 + 60, 200, 12, P.col.ok, 'center', 800); P.txt(c, s.nom, x0 + 60, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'electrolyse-eau', defiTitre: 'L’électrolyse de l’eau : le défi',
    chap: [
      { titre: 'Décomposer l’eau', labTitre: 'Le courant dans l’eau', cur: 'Peut-on casser une molécule d’eau avec de l’électricité ?',
        paras: ['Le passage du courant décompose l’eau en dihydrogène (au pôle −) et en dioxygène (au pôle +).', 'Le volume de dihydrogène est le double de celui du dioxygène.'],
        loi: { t: 'Eau → dihydrogène + dioxygène', s: 'V(H₂) = 2 × V(O₂)' }, note: 'Avance la durée. Tests des gaz faits par le professeur.',
        predis: { q: 'Quel gaz est en plus grand volume ?', opts: ['le dihydrogène', 'le dioxygène', 'ils sont égaux'], a: 0, rep: 'Le dihydrogène : deux fois plus.' },
        verif: { q: 'l’électrolyse de l’eau produit…', o: ['H₂ et O₂', 'CO₂ et H₂O', 'N₂ et O₂'], a: 0, e: 'Dihydrogène et dioxygène.' },
        lab: { w: 360, h: 250, alt: 'Deux tubes recueillant dihydrogène et dioxygène', scene: sceneE, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 't', label: 'Durée', min: 0, max: 100, step: 10, val: 40, unit: '%', dec: 0 }],
          read: function (v) { var x = vol(+v.t); return ['<b>H₂ : ' + fr(x.H2, 0) + ' mL · O₂ : ' + fr(x.O2, 0) + ' mL</b>', 'Rapport 2 : 1.']; }, sound: function (v) { return 180 + 3 * +v.t; } } },
      { titre: 'L’équation', labTitre: '2 H₂O → 2 H₂ + O₂', cur: 'Que deviennent les atomes quand l’eau est décomposée ?',
        paras: ['Les atomes se réarrangent sans disparaître : 2 H₂O donnent 2 H₂ et 1 O₂.', 'Il y a autant d’atomes de chaque sorte avant et après.'],
        loi: { t: '2 H₂O → 2 H₂ + O₂', s: 'les atomes se conservent' }, note: 'Nombre de molécules d’eau décomposées (pair).',
        predis: { q: '4 molécules d’eau sont décomposées. On obtient…', opts: ['4 H₂ et 2 O₂', '2 H₂ et 4 O₂', '4 H₂ et 4 O₂'], a: 0, rep: '4 H₂ et 2 O₂.' },
        verif: { q: '2 H₂O contient… atomes d’oxygène', o: ['2', '4', '1'], a: 0, e: '2 atomes d’oxygène.' },
        lab: { w: 380, h: 230, alt: 'Molécules d’eau décomposées et bilan d’atomes', scene: sceneB, live: false, notrace: true, sit: [{ nom: 'Petit essai', vars: {} }, { nom: 'Grand essai', vars: {} }], inputs: [{ id: 'n', label: 'Molécules d’eau', min: 2, max: 6, step: 2, val: [2, 6], per: true, unit: '', dec: 0 }],
          read: function (v) { var b = bilan(+v.n); return [v.n + ' H₂O → ' + b.H2 + ' H₂ + ' + fr(b.O2, 0) + ' O₂ (H : ' + b.atomesH + ', O : ' + b.atomesO + ')']; }, sound: function (v) { return 150 + 25 * +v.n; } } }
    ],
    manches: function (LV) {
      var t = LV[0] && LV[0].t != null ? +LV[0].t : 40, o = vol(t).O2;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, le dioxygène recueilli est de ' + fr(o, 0) + ' mL. Quel volume de dihydrogène, en mL ?', ans: 2 * o, tol: 0.2, unit: 'mL', e: 'V(H₂) = 2 × ' + fr(o, 0) + ' = ' + fr(2 * o, 0) + ' mL.' },
        { type: 'qcm', q: 'Combien de molécules de H₂ pour 6 molécules d’eau décomposées ?', o: ['6', '3', '12'], a: 0, e: '6 H₂O → 6 H₂ + 3 O₂.' }
      ];
    }
  });
})();
