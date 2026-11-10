/* Livre vivant · 6e · Constituants de l'air.
   Moment essentiel : une bougie brûle sous une cloche posée sur l'eau ; elle s'éteint quand le dioxygène est consommé et l'eau monte d'environ 1/5.
   Chapitre 2 : 1/5 de dioxygène et 4/5 de diazote dans un volume d'air donné. Particules : 20 sur le dessin = 4 O₂ (rouge, CPK) + 16 N₂ (bleu, CPK). Proportions, pas de pourcentages exigés. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var O2 = '#E23B3B', N2 = '#3B5BDB';
  function mol(c, P, x, y, col, tx) { P.circ(c, x - 4, y, 4.5, P.col.ink, 1.2, col); P.circ(c, x + 4, y, 4.5, P.col.ink, 1.2, col); }
  function grille(n, i) { return [((i % 5) + 0.5) / 5, (Math.floor(i / 5) + 0.5) / Math.ceil(n / 5)]; }
  function sceneBougie(c, X) {
    var P = X.P, t = +X.S[0].v.t, jx = 90, jy = 30, jw = 180, jh = 170, eau = 205, i, rise = jh * 0.2 * (t / 100);
    c.fillStyle = 'rgba(80,150,230,.35)'; c.fillRect(30, eau, 300, 45); c.fillRect(jx + 2, eau - rise, jw - 4, rise);
    P.poly(c, [[jx, eau + 6], [jx, jy], [jx + jw, jy], [jx + jw, eau + 6]], P.col.ink, 2.6); P.line(c, 30, eau, jx, eau, P.col.a, 2); P.line(c, jx + jw, eau, 330, eau, P.col.a, 2);
    P.rect(c, 150, 190, 60, 10, P.col.ink, 2, P.col.fill); P.rect(c, 172, 160, 16, 30, P.col.ink, 2, '#F3E9C6');
    if (t < 100) { c.fillStyle = 'rgba(255,190,40,.9)'; c.beginPath(); c.ellipse(180, 150, 6, 11, 0, 0, 6.2832); c.fill(); }
    var no = Math.max(0, Math.ceil(4 * (1 - t / 100))), k;
    for (i = 0; i < 20; i++) { var g = grille(20, i), x = jx + 18 + g[0] * (jw - 36), y = jy + 14 + g[1] * (jh - 28 - rise - 34); if (i < 4 ? i < no : true) mol(c, P, x, y, i < 4 ? O2 : N2); }
    P.txt(c, 'O₂', 300, 40, 12, O2, 'left', 800); P.txt(c, 'N₂', 300, 60, 12, N2, 'left', 800);
    P.txt(c, t >= 100 ? 'bougie éteinte' : 'bougie allumée', 180, 12, 12, t >= 100 ? P.col.hot : P.col.ok, 'center', 800);
  }
  function sceneAir(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, vv = +s.v.V, w = 140, h = 150, x0 = two ? 20 + 185 * k : 110, y0 = 40, i, n = 20; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0, y0, w, h, col, 2.6, P.col.paper);
      for (i = 0; i < n; i++) { var g = grille(n, i); mol(c, P, x0 + 14 + g[0] * (w - 28), y0 + 14 + g[1] * (h - 28), i < 4 ? O2 : N2); }
      P.txt(c, fr(vv, 0) + ' L d’air', x0 + w / 2, y0 + h + 16, 13, col, 'center', 800); if (two) P.txt(c, s.nom, x0 + w / 2, 18, 12, col, 'center', 800); c.restore();
    });
    if (!two) { P.txt(c, 'O₂ (rouge)', 275, 70, 12, O2, 'left', 800); P.txt(c, 'N₂ (bleu)', 275, 92, 12, N2, 'left', 800); }
  }
  V.add({
    slug: 'constituants-air', defiTitre: 'Les constituants de l’air : le défi',
    chap: [
      { titre: 'La bougie sous la cloche', labTitre: 'Une bougie qui s’éteint', cur: 'Pourquoi la bougie s’éteint-elle sous un verre retourné ?',
        paras: ['L’air contient du dioxygène et du diazote. Une bougie brûle grâce au dioxygène.', 'Sous la cloche, le dioxygène est consommé : la bougie s’éteint et l’eau monte d’environ un cinquième.'],
        loi: { t: 'Combustion : consomme du dioxygène', s: 'l’eau monte d’environ 1/5 du volume d’air' }, note: 'Avance le temps : les O₂ (rouge) disparaissent, pas les N₂ (bleu). Expérience guidée par le professeur.',
        predis: { q: 'La bougie s’éteint sous la cloche parce que…', opts: ['le dioxygène est consommé', 'l’air est devenu de l’eau', 'la cloche est trop lourde'], a: 0, rep: 'Le dioxygène est consommé ; le diazote reste.' },
        verif: { q: 'l’eau monte d’environ…', o: ['1/5 du volume d’air', '4/5 du volume d’air', 'tout le volume d’air'], a: 0, e: 'Environ 1/5, la part du dioxygène.' },
        lab: { w: 380, h: 270, alt: 'Bougie sous une cloche posée sur l’eau', scene: sceneBougie, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 't', label: 'Avancement', min: 0, max: 100, step: 5, val: 0, unit: '%', dec: 0 }],
          read: function (v) { var t = +v.t; return t >= 100 ? ['<b>Bougie éteinte : l’eau a monté d’environ 1/5</b>', 'Le dioxygène est consommé, le diazote reste.'] : ['<b>La bougie brûle, le dioxygène diminue</b>', 'L’eau monte peu à peu.']; }, sound: function (v) { return 200 + 2 * +v.t; } } },
      { titre: '1/5 et 4/5', labTitre: 'Dioxygène et diazote dans l’air', cur: 'Combien de dioxygène y a-t-il dans la salle de classe ?',
        paras: ['L’air est un mélange : environ 1/5 de dioxygène et 4/5 de diazote.', 'Dans 5 L d’air, il y a environ 1 L de dioxygène.'],
        loi: { t: 'Air = 1/5 dioxygène + 4/5 diazote', s: 'volume de O₂ ≈ V ÷ 5' }, note: 'Sur le dessin, 4 particules sur 20 sont du dioxygène : 1/5.',
        predis: { q: 'Dans 10 L d’air, le volume de dioxygène est environ…', opts: ['2 L', '5 L', '8 L'], a: 0, rep: '10 L ÷ 5 = 2 L.' },
        verif: { q: 'le gaz le plus abondant dans l’air est…', o: ['le diazote', 'le dioxygène', 'l’eau'], a: 0, e: 'Le diazote : environ 4/5.' },
        lab: { w: 380, h: 270, alt: 'Deux volumes d’air avec dioxygène et diazote', scene: sceneAir, live: false, notrace: true, sit: [{ nom: 'Petit volume', vars: {} }, { nom: 'Grand volume', vars: {} }], inputs: [{ id: 'V', label: 'Volume d’air', min: 5, max: 50, step: 5, val: [5, 25], per: true, unit: 'L', dec: 0 }],
          read: function (v) { var o = +v.V / 5; return ['O₂ ≈ ' + fr(o, 0) + ' L · N₂ ≈ ' + fr(+v.V - o, 0) + ' L']; }, sound: function (v) { return 150 + 4 * +v.V; } } }
    ],
    manches: function (LV) {
      var v = LV[1] && LV[1].V != null ? +LV[1].V : 25;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as réglé ' + fr(v, 0) + ' L d’air. Quel volume de dioxygène contient-il environ ?', ans: v / 5, tol: 0.2, unit: 'L', e: fr(v, 0) + ' L ÷ 5 = ' + fr(v / 5, 0) + ' L de dioxygène.' },
        { type: 'qcm', q: 'Après l’extinction de la bougie sous la cloche, l’eau est montée d’environ…', o: ['1/5', '1/2', 'toute la cloche'], a: 0, e: 'Environ 1/5, ce qui correspond au dioxygène consommé.' }
      ];
    }
  });
})();
