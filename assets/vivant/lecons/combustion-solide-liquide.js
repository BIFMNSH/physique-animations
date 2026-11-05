/* Livre vivant · 6e · Combustion d'un solide ou d'un liquide.
   Moment essentiel : triangle du feu (combustible, dioxygène, chaleur) : il suffit d'en retirer un pour éteindre.
   Chapitre 2 : feu d'huile : jamais d'eau, on étouffe avec un couvercle. Simulation uniquement ; toute flamme réelle est guidée par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant;
  function flamme(c, x, y, s) { c.fillStyle = 'rgba(255,150,30,.92)'; c.beginPath(); c.ellipse(x, y, 10 * s, 18 * s, 0, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(255,225,90,.95)'; c.beginPath(); c.ellipse(x, y + 5 * s, 5 * s, 9 * s, 0, 0, 6.2832); c.fill(); }
  function sceneTri(c, X) {
    var P = X.P, v = X.S[0].v, A = [[180, 40], [80, 190], [280, 190]], k, noms = ['combustible', 'dioxygène', 'chaleur'], ids = ['comb', 'oxy', 'chal'], feu = true;
    ids.forEach(function (d) { if (v[d] !== 'oui') feu = false; });
    P.poly(c, [A[0], A[1], A[2], A[0]], feu ? P.col.hot : P.col.soft, 3);
    for (k = 0; k < 3; k++) { var on = v[ids[k]] === 'oui'; P.circ(c, A[k][0], A[k][1], 14, on ? P.col.ok : P.col.hot, 2.4, on ? '#D8F3DC' : '#FDE2E2'); P.txt(c, on ? '✓' : '✕', A[k][0], A[k][1], 14, on ? P.col.ok : P.col.hot, 'center', 800); P.txt(c, noms[k], A[k][0], k === 0 ? A[k][1] - 24 : A[k][1] + 26, 12, P.col.ink, 'center', 800); }
    if (feu) flamme(c, 180, 130, 1.4); else P.txt(c, 'pas de feu', 180, 140, 14, P.col.soft, 'center', 800);
  }
  var MOY = { eau: 'de l’eau', couv: 'un couvercle', rien: 'rien' };
  function sceneFeu(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, o = s.v.moy, danger = s.v.prod === 'huile' && o === 'eau', eteint = o === 'couv' || (o === 'eau' && s.v.prod === 'papier'), x0 = two ? 95 + 190 * k : 180; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.poly(c, [[x0 - 50, 130], [x0 - 40, 190], [x0 + 40, 190], [x0 + 50, 130]], col, 2.6, s.v.prod === 'huile' ? '#F2D27A' : '#EFE6D0');
      if (o === 'couv') P.rect(c, x0 - 56, 118, 112, 12, P.col.ink, 2.4, '#B8B2A3');
      else if (!eteint) flamme(c, x0, 105, danger ? 2.1 : 1.2);
      if (o === 'eau') for (var i = 0; i < 4; i++) P.circ(c, x0 - 30 + i * 20, 50 + (i % 2) * 14, 4, P.col.a, 1.6, 'rgba(80,150,230,.5)');
      if (danger) P.txt(c, 'DANGER : projections', x0, 40, 12, P.col.hot, 'center', 800);
      P.txt(c, s.v.prod === 'huile' ? 'huile' : 'papier', x0, 210, 12, col, 'center', 800); if (two) P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  var oui = [['oui', 'Présent'], ['non', 'Retiré']];
  V.add({
    slug: 'combustion-solide-liquide', defiTitre: 'La combustion d’un solide ou d’un liquide : le défi',
    chap: [
      { titre: 'Le triangle du feu', labTitre: 'Trois conditions pour un feu', cur: 'Comment les pompiers éteignent-ils un feu de brousse ou de maison ?',
        paras: ['Pour brûler, il faut un combustible, du dioxygène et de la chaleur : c’est le triangle du feu.', 'Si on retire un seul des trois, le feu s’éteint.'],
        loi: { t: 'Feu = combustible + dioxygène + chaleur', s: 'retirer un seul des trois éteint le feu' }, note: 'Simulation : retire un côté du triangle. Toute flamme réelle est faite avec le professeur.',
        predis: { q: 'Pour éteindre un feu, il suffit de retirer…', opts: ['un des trois éléments', 'les trois à la fois', 'rien'], a: 0, rep: 'Un seul suffit : combustible, dioxygène ou chaleur.' },
        verif: { q: 'on étouffe un feu en privant le feu de…', o: ['dioxygène', 'combustible', 'chaleur'], a: 0, e: 'Un couvercle ou une couverture prive le feu de dioxygène.' },
        lab: { w: 360, h: 250, alt: 'Triangle du feu : combustible, dioxygène, chaleur', scene: sceneTri, live: false, notrace: true, sit: [{ nom: '', vars: {} }],
          choices: [{ id: 'comb', label: 'Combustible', opts: oui, val: 'oui' }, { id: 'oxy', label: 'Dioxygène', opts: oui, val: 'oui' }, { id: 'chal', label: 'Chaleur', opts: oui, val: 'oui' }],
          read: function (v) { var f = v.comb === 'oui' && v.oxy === 'oui' && v.chal === 'oui'; return f ? ['<b>Les trois sont présents : le feu brûle</b>'] : ['<b>Il en manque un : le feu est éteint</b>', 'Retirer un seul élément suffit.']; }, sound: function (v) { return v.comb === 'oui' && v.oxy === 'oui' && v.chal === 'oui' ? 400 : 180; } } },
      { titre: 'Un feu d’huile', labTitre: 'Papier ou huile : comment éteindre ?', cur: 'Pourquoi ne jette-t-on jamais d’eau sur de l’huile qui brûle ?',
        paras: ['L’eau éteint un feu de papier, mais sur de l’huile enflammée elle provoque des projections dangereuses.', 'Un feu d’huile s’éteint en le couvrant avec un couvercle : on le prive de dioxygène.'],
        loi: { t: 'Feu d’huile : jamais d’eau', s: 'couvercle : on prive le feu de dioxygène' }, note: 'Simulation uniquement : essaie les deux moyens sur chaque feu.',
        predis: { q: 'Une casserole d’huile prend feu. On…', opts: ['met un couvercle', 'verse de l’eau', 'souffle dessus'], a: 0, rep: 'Un couvercle : l’eau est dangereuse sur l’huile.' },
        verif: { q: 'sur de l’huile qui brûle, l’eau…', o: ['provoque des projections dangereuses', 'éteint le feu', 'ne change rien'], a: 0, e: 'Elle provoque des projections de gouttes brûlantes.' },
        lab: { w: 380, h: 250, alt: 'Un feu de papier et un feu d’huile', scene: sceneFeu, live: false, notrace: true,
          sit: [{ nom: 'Feu de papier', vars: { prod: 'papier' } }, { nom: 'Feu d’huile', vars: { prod: 'huile' } }],
          choices: [{ id: 'moy', label: 'Moyen d’extinction', opts: [['rien', 'Rien'], ['eau', 'Eau'], ['couv', 'Couvercle']], val: 'rien', per: true }],
          read: function (v) { var d = v.prod === 'huile' && v.moy === 'eau'; return [d ? 'DANGER : eau sur huile, projections' : (v.moy === 'couv' || (v.moy === 'eau' && v.prod === 'papier')) ? 'Feu éteint avec ' + MOY[v.moy] : 'Le feu brûle encore']; }, sound: function (v) { return v.prod === 'huile' && v.moy === 'eau' ? 120 : 300; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as retiré un des trois éléments du triangle. Que devient le feu ?', o: ['Il s’éteint', 'Il grandit', 'Il ne change pas'], a: 0, e: 'Il manque une condition : le feu s’éteint.' },
        { type: 'qcm', q: 'Un feu d’huile dans la cuisine d’Awa. Que fait-elle ?', o: ['Elle couvre avec un couvercle', 'Elle jette de l’eau', 'Elle verse du sable mouillé'], a: 0, e: 'Le couvercle prive le feu de dioxygène ; l’eau est dangereuse.' }
      ];
    }
  });
})();
