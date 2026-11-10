/* Livre vivant · 3e · Oxydation de corps purs.
   Moment essentiel : le fer brûle dans le dioxygène et forme un oxyde de fer solide : la masse du solide augmente (10 g de fer donnent environ 13,8 g d'oxyde Fe₃O₄, calcul à partir des masses molaires, valeur arrondie).
   Chapitre 2 : carbone, soufre, magnésium, fer : les produits d'une oxydation sont des oxydes (solides ou gaz). Combustions réelles par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, K = 231.5 / 167.5;
  var masse = V.lois.masseOxyde = function (m0, p) { return m0 + (m0 * K - m0) * p / 100; };
  var CO = { Fe: ['fer', 'oxyde de fer', true], Mg: ['magnésium', 'oxyde de magnésium', true], C: ['carbone', 'dioxyde de carbone', false], S: ['soufre', 'dioxyde de soufre', false] };
  function sceneFe(c, X) {
    var P = X.P, p = +X.S[0].v.p, m = masse(10, p), i;
    P.rect(c, 70, 160, 80, 20, P.col.ink, 2.4, P.col.fill); P.rect(c, 80, 130, 60, 30, P.col.ink, 2.4, p > 0 ? '#6B4F2A' : '#9AA0A8'); if (p > 0 && p < 100) for (i = 0; i < 4; i++) P.circ(c, 95 + i * 16, 124 - (i % 2) * 6, 3, null, 0, '#FFB84D');
    P.rect(c, 200, 120, 100, 50, P.col.ink, 2.4, P.col.paper); P.txt(c, fr(m, 1) + ' g', 250, 145, 16, P.col.hot, 'center', 800); P.txt(c, 'masse du solide', 250, 112, 11, P.col.soft, 'center');
    P.txt(c, 'fer + dioxygène → oxyde de fer', 180, 30, 13, P.col.ink, 'center', 800); P.txt(c, p === 0 ? 'avant : 10,0 g de fer' : p === 100 ? 'après : tout le fer est oxydé' : 'la masse du solide augmente', 180, 215, 12, P.col.ok, 'center', 800);
  }
  function sceneCp(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var d = CO[s.v.co], col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 95 + k * 190; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0 - 30, 90, 60, 40, col, 2.4, d[2] ? '#6B4F2A' : P.col.paper); if (!d[2]) for (var i = 0; i < 4; i++) P.txt(c, '~', x0 - 22 + i * 15, 70 - (i % 2) * 8, 16, P.col.soft, 'center', 800);
      P.txt(c, d[0] + ' + O₂', x0, 50, 12, col, 'center', 800); P.txt(c, '→ ' + d[1], x0, 150, 12, P.col.ink, 'center', 800); P.txt(c, d[2] ? 'solide : masse augmente' : 'gaz : pas de résidu solide', x0, 172, 12, d[2] ? P.col.ok : P.col.a, 'center', 800); P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'oxydation-corps-purs', defiTitre: 'L’oxydation des corps purs : le défi',
    chap: [
      { titre: 'Le fer qui brûle', labTitre: 'La laine d’acier', cur: 'Pourquoi la laine d’acier est-elle plus lourde après avoir brûlé ?',
        paras: ['Le fer brûle dans le dioxygène : il se forme de l’oxyde de fer, un solide.', 'Le solide a gagné les atomes d’oxygène de l’air : sa masse augmente (ici de 10 g à environ 13,8 g).'],
        loi: { t: 'Fer + dioxygène → oxyde de fer', s: 'le solide gagne de la masse (oxygène fixé)' }, note: 'Avance la combustion. Valeur 13,8 g calculée et arrondie. Flamme : le professeur.',
        predis: { q: 'Après la combustion de la laine d’acier, la masse du solide…', opts: ['augmente', 'diminue', 'ne change pas'], a: 0, rep: 'Elle augmente : le fer a fixé de l’oxygène.' },
        verif: { q: 'le produit est…', o: ['un oxyde de fer', 'du fer pur', 'de l’eau'], a: 0, e: 'Un oxyde de fer.' },
        lab: { w: 360, h: 240, alt: 'Laine d’acier qui brûle et masse du solide', scene: sceneFe, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'p', label: 'Avancement', min: 0, max: 100, step: 10, val: 50, unit: '%', dec: 0 }],
          read: function (v) { return ['<b>Masse du solide : ' + fr(masse(10, +v.p), 1) + ' g</b>', +v.p === 0 ? 'Avant la combustion.' : 'Plus lourd qu’au début.']; }, sound: function (v) { return 180 + 2 * +v.p; } } },
      { titre: 'Des oxydes différents', labTitre: 'Solides ou gaz', cur: 'Pourquoi le charbon ne laisse-t-il pas d’oxyde solide ?',
        paras: ['L’oxydation d’un corps pur donne un oxyde. Fer et magnésium donnent des oxydes solides.', 'Carbone et soufre donnent des oxydes gazeux : CO₂ et SO₂.'],
        loi: { t: 'Corps pur + dioxygène → oxyde', s: 'oxyde solide ou gazeux' }, note: 'Compare deux corps purs.',
        predis: { q: 'Le carbone brûle dans le dioxygène. Le produit est…', opts: ['un gaz', 'un solide noir', 'un liquide'], a: 0, rep: 'Un gaz : le dioxyde de carbone.' },
        verif: { q: 'le magnésium brûle : le produit est…', o: ['un oxyde solide', 'un gaz', 'rien'], a: 0, e: 'L’oxyde de magnésium, solide.' },
        lab: { w: 380, h: 220, alt: 'Deux corps purs brûlant dans le dioxygène', scene: sceneCp, live: false, notrace: true, sit: [{ nom: 'Corps A', vars: {} }, { nom: 'Corps B', vars: {} }], choices: [{ id: 'co', label: 'Corps pur', opts: [['Fe', 'Fer'], ['Mg', 'Magnésium'], ['C', 'Carbone'], ['S', 'Soufre']], val: 'Fe', per: true }],
          read: function (v) { return [CO[v.co][0] + ' → ' + CO[v.co][1] + (CO[v.co][2] ? ' (solide)' : ' (gaz)')]; }, sound: function (v) { return CO[v.co][2] ? 300 : 220; } } }
    ],
    manches: function (LV) {
      var p = LV[0] && LV[0].p != null ? +LV[0].p : 50;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, au bout de ' + fr(p, 0) + ' % de la combustion, quelle masse de solide (en g, 1 décimale) ?', ans: masse(10, p), tol: 0.06, unit: 'g', e: 'Valeur lue : ' + fr(masse(10, p), 1) + ' g.' },
        { type: 'qcm', q: 'Pourquoi la masse du solide augmente-t-elle ?', o: ['Le fer fixe de l’oxygène', 'Le fer fabrique du fer', 'L’air devient solide'], a: 0, e: 'Les atomes d’oxygène s’ajoutent.' }
      ];
    }
  });
})();
