/* Livre vivant · 3e · Réduction des oxydes.
   Moment essentiel : l'oxyde de cuivre (noir) chauffé avec du carbone donne du cuivre (rouge) et du dioxyde de carbone (eau de chaux troublée) : CuO + C → Cu + CO₂ (équation non équilibrée affichée en bilan simplifié).
   Chapitre 2 : l'oxyde perd son oxygène (réduction), le carbone en gagne (oxydation). Manipulation par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant;
  var ROLE = V.lois.roleRedox = function (esp) { return esp === 'CuO' ? 'perd de l’oxygène : il est réduit' : 'gagne de l’oxygène : il est oxydé'; };
  var etat = V.lois.etatReduction = function (p) { return { cuivre: p > 0, co2: p > 0, oxydeRestant: p < 100 }; };
  function sceneR(c, X) {
    var P = X.P, p = +X.S[0].v.p, e = etat(p), m = p / 100;
    var r = Math.round(40 + 175 * m), g = Math.round(40 + 40 * m), b = Math.round(40 + 0 * m);
    P.poly(c, [[110, 100], [110, 150], [190, 150], [190, 100]], P.col.ink, 2.6, 'rgb(' + r + ',' + g + ',' + b + ')');
    P.poly(c, [[190, 110], [250, 70], [250, 190]], P.col.soft, 1.6); P.poly(c, [[250, 140], [250, 190], [310, 190], [310, 140]], P.col.ink, 2.4, e.co2 ? 'rgba(235,235,235,.95)' : 'rgba(190,220,240,.5)');
    P.txt(c, e.co2 ? 'eau de chaux troublée : CO₂' : 'eau de chaux limpide', 245, 212, 11, e.co2 ? P.col.hot : P.col.ok, 'center', 800); P.txt(c, 'oxyde de cuivre + carbone', 130, 82, 11, P.col.ink, 'center', 800);
    P.txt(c, e.cuivre ? (e.oxydeRestant ? 'noir et rouge mélangés' : 'cuivre rouge') : 'noir : oxyde de cuivre', 150, 175, 12, P.col.ink, 'center', 800); P.txt(c, 'CuO + C → Cu + CO₂', 180, 28, 14, P.col.ink, 'center', 800);
  }
  function sceneO(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var esp = s.v.esp, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 95 + k * 190, perd = esp === 'CuO'; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0, 100, 28, col, 2.6, perd ? '#555' : '#444B55'); P.txt(c, esp, x0, 100, 14, '#fff', 'center', 800); P.circ(c, perd ? x0 + 44 : x0 - 44, 70, 8, P.col.ink, 1.6, '#E23B3B'); P.arrow(c, perd ? x0 + 30 : x0 - 60, 70, perd ? x0 + 70 : x0 - 24, 70, P.col.hot, 2);
      P.txt(c, perd ? 'perd O' : 'gagne O', x0, 150, 13, P.col.hot, 'center', 800); P.txt(c, perd ? 'réduction' : 'oxydation', x0, 172, 13, P.col.ok, 'center', 800); P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'reduction-oxydes', defiTitre: 'La réduction des oxydes : le défi',
    chap: [
      { titre: 'Du noir au rouge', labTitre: 'Oxyde de cuivre et carbone', cur: 'Comment retrouve-t-on le cuivre à partir de son oxyde noir ?',
        paras: ['On chauffe de l’oxyde de cuivre noir avec du carbone : il se forme du cuivre rouge et du dioxyde de carbone.', 'Le dioxyde de carbone se reconnaît à l’eau de chaux qui se trouble.'],
        loi: { t: 'Oxyde de cuivre + carbone → cuivre + CO₂', s: 'le noir devient rouge' }, note: 'Avance la réaction. Chauffage et manipulation : le professeur.',
        predis: { q: 'Le mélange noir devient rouge. On a obtenu…', opts: ['du cuivre', 'du carbone', 'de l’eau'], a: 0, rep: 'Du cuivre.' },
        verif: { q: 'le gaz qui trouble l’eau de chaux est…', o: ['le dioxyde de carbone', 'le dihydrogène', 'le diazote'], a: 0, e: 'Le dioxyde de carbone.' },
        lab: { w: 360, h: 240, alt: 'Oxyde de cuivre noir qui devient cuivre rouge avec du gaz dans l’eau de chaux', scene: sceneR, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'p', label: 'Avancement', min: 0, max: 100, step: 10, val: 50, unit: '%', dec: 0 }],
          read: function (v) { var e = etat(+v.p); return e.oxydeRestant ? [e.cuivre ? '<b>Cuivre rouge et CO₂ en formation</b>' : '<b>Pas encore de réaction</b>'] : ['<b>Tout l’oxyde est transformé en cuivre</b>']; }, sound: function (v) { return 180 + 2 * +v.p; } } },
      { titre: 'Réduction et oxydation', labTitre: 'Qui perd, qui gagne l’oxygène ?', cur: 'Pourquoi dit-on que les deux se produisent en même temps ?',
        paras: ['Dans la réaction, l’oxyde de cuivre perd de l’oxygène : il est réduit.', 'Le carbone gagne cet oxygène : il est oxydé. Les deux transformations sont simultanées.'],
        loi: { t: 'Perd de l’oxygène : réduction', s: 'gagne de l’oxygène : oxydation' }, note: 'Choisis l’espèce pour chaque situation.',
        predis: { q: 'Le carbone gagne de l’oxygène. Il est…', opts: ['oxydé', 'réduit', 'inchangé'], a: 0, rep: 'Oxydé.' },
        verif: { q: 'l’oxyde de cuivre est…', o: ['réduit', 'oxydé', 'inchangé'], a: 0, e: 'Il perd son oxygène.' },
        lab: { w: 380, h: 220, alt: 'Transfert d’oxygène de l’oxyde de cuivre vers le carbone', scene: sceneO, live: false, notrace: true, sit: [{ nom: 'Espèce A', vars: {} }, { nom: 'Espèce B', vars: {} }], choices: [{ id: 'esp', label: 'Espèce', opts: [['CuO', 'CuO'], ['C', 'C']], val: 'CuO', per: true }],
          read: function (v) { return [v.esp + ' ' + ROLE(v.esp)]; }, sound: function (v) { return v.esp === 'CuO' ? 300 : 400; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, l’oxyde de cuivre noir se transforme en…', o: ['cuivre rouge', 'carbone noir', 'eau'], a: 0, e: 'Cuivre rouge.' },
        { type: 'qcm', q: 'Dans CuO + C → Cu + CO₂, le carbone est…', o: ['oxydé', 'réduit', 'ni l’un ni l’autre'], a: 0, e: 'Il gagne de l’oxygène.' }
      ];
    }
  });
})();
