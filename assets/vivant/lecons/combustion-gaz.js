/* Livre vivant · 6e · Combustion d'un gaz.
   Moment essentiel : on règle l'arrivée d'air d'un brûleur ; avec assez d'air la flamme est bleue (combustion complète), sans assez d'air elle est jaune, fait de la suie et du monoxyde de carbone.
   Seuil 50 % d'air et baisse du dioxygène en pièce fermée : choix de conception, pas des mesures. Simulation ; toute flamme réelle est guidée par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var etat = V.lois.flammeGaz = function (air) { return +air >= 50 ? { k: 'bleue', complete: true } : { k: 'jaune', complete: false }; };
  function flamme(c, x, y, s, bleu) {
    c.fillStyle = bleu ? 'rgba(60,120,255,.9)' : 'rgba(255,170,40,.92)'; c.beginPath(); c.ellipse(x, y, 11 * s, 22 * s, 0, 0, 6.2832); c.fill();
    c.fillStyle = bleu ? 'rgba(170,210,255,.95)' : 'rgba(255,230,110,.95)'; c.beginPath(); c.ellipse(x, y + 6 * s, 5 * s, 11 * s, 0, 0, 6.2832); c.fill();
  }
  function scene(c, X) {
    var P = X.P, a = +X.S[0].v.air, e = etat(a), x = 180;
    P.rect(c, x - 12, 170, 24, 50, P.col.ink, 2.6, P.col.fill); P.rect(c, x - 20, 214, 40, 10, P.col.ink, 2.2, P.col.paper);
    P.rect(c, x - 22, 196, 8 + a * 0.2, 10, P.col.a, 1.6, '#CFE6FF'); P.txt(c, 'air', x - 36, 201, 11, P.col.a, 'right', 800);
    flamme(c, x, 150, e.complete ? 1.3 : 1.6, e.complete);
    if (!e.complete) { P.rect(c, 130, 60, 100, 12, P.col.ink, 2.2, '#9A9486'); for (var i = 0; i < 6; i++) P.circ(c, 140 + i * 17, 78 + (i % 2) * 6, 3 + (i % 3), null, 0, '#2A2A2A'); P.txt(c, 'suie (casserole noircie)', x, 46, 11, P.col.ink, 'center', 800); }
    P.txt(c, e.complete ? 'flamme bleue : combustion complète' : 'flamme jaune : combustion incomplète', x, 242, 12, e.complete ? P.col.ok : P.col.hot, 'center', 800);
  }
  var O2n = function (p) { return Math.max(0, 100 - p * 0.9); };
  function sceneSalle(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, ferme = s.v.salle === 'fermee', d = +s.v.d, o = ferme ? O2n(d) : 100, x0 = two ? 20 + 185 * k : 110, comp = o >= 50; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0, 50, 150, 150, col, 2.6, P.col.paper); if (!ferme) { P.line(c, x0 + 150, 80, x0 + 175, 70, P.col.a, 2); P.txt(c, 'aération', x0 + 150, 62, 10, P.col.a, 'center'); }
      flamme(c, x0 + 75, 168, 0.9, comp); P.rect(c, x0 + 60, 178, 30, 12, P.col.ink, 2, P.col.fill);
      P.rect(c, x0 + 10, 60, 14, 80, P.col.soft, 1.6, P.col.paper); c.fillStyle = 'rgba(80,150,230,.55)'; c.fillRect(x0 + 11, 140 - 78 * o / 100, 12, 78 * o / 100); P.txt(c, 'O₂', x0 + 17, 152, 10, P.col.a, 'center', 800);
      if (!comp) P.txt(c, 'CO !', x0 + 105, 100, 14, P.col.hot, 'center', 800);
      P.txt(c, ferme ? 'pièce fermée' : 'pièce aérée', x0 + 75, 216, 12, col, 'center', 800); if (two) P.txt(c, s.nom, x0 + 75, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'combustion-gaz', defiTitre: 'La combustion d’un gaz : le défi',
    chap: [
      { titre: 'Flamme bleue ou jaune', labTitre: 'Régler l’arrivée d’air', cur: 'Pourquoi la casserole de Kofi est-elle noire quand la flamme du réchaud est jaune ?',
        paras: ['Un gaz comme le butane brûle avec le dioxygène de l’air. Avec assez d’air, la flamme est bleue : la combustion est complète.', 'Avec trop peu d’air, la flamme est jaune : la combustion est incomplète. Elle dépose de la suie et produit du monoxyde de carbone, un gaz dangereux.'],
        loi: { t: 'Assez d’air : flamme bleue, combustion complète', s: 'peu d’air : flamme jaune, suie et monoxyde de carbone' }, note: 'Simulation. Seuil d’air fixé à 50 % pour le dessin. Toute flamme réelle est allumée par le professeur.',
        predis: { q: 'La flamme du réchaud est jaune et la casserole noircit. Il manque…', opts: ['de l’air (du dioxygène)', 'de l’eau', 'du sel'], a: 0, rep: 'De l’air : la combustion est incomplète, d’où la suie.' },
        verif: { q: 'une flamme bleue signifie…', o: ['combustion complète', 'combustion incomplète', 'pas de combustion'], a: 0, e: 'Combustion complète.' },
        lab: { w: 360, h: 260, alt: 'Brûleur à gaz avec flamme bleue ou jaune', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'air', label: 'Arrivée d’air', min: 0, max: 100, step: 10, val: 20, unit: '%', dec: 0 }],
          read: function (v) { return etat(v.air).complete ? ['<b>Flamme bleue : combustion complète</b>', 'Assez de dioxygène.'] : ['<b>Flamme jaune : combustion incomplète</b>', 'Suie et monoxyde de carbone : ouvrir davantage l’arrivée d’air.']; }, sound: function (v) { return 180 + 3 * +v.air; } } },
      { titre: 'Dans une pièce fermée', labTitre: 'Pièce aérée ou fermée', cur: 'Pourquoi faut-il aérer la cuisine quand le gaz est allumé ?',
        paras: ['Dans une pièce fermée, la flamme consomme peu à peu le dioxygène.', 'Quand il en reste trop peu, la combustion devient incomplète : le monoxyde de carbone, invisible et sans odeur, apparaît.'],
        loi: { t: 'Pièce fermée : le dioxygène diminue', s: 'puis combustion incomplète : monoxyde de carbone' }, note: 'Avance la durée : le niveau de O₂ baisse seulement dans la pièce fermée (courbe de dessin).',
        predis: { q: 'Pour brûler du gaz sans danger dans une pièce, il faut…', opts: ['aérer', 'fermer les fenêtres', 'boucher les portes'], a: 0, rep: 'Aérer : le dioxygène se renouvelle.' },
        verif: { q: 'le monoxyde de carbone est…', o: ['invisible et sans odeur', 'bleu', 'piquant'], a: 0, e: 'On ne le voit pas et on ne le sent pas : il est très dangereux.' },
        lab: { w: 380, h: 250, alt: 'Deux pièces : l’une aérée, l’autre fermée, avec une flamme de gaz', scene: sceneSalle, live: false, notrace: true, sit: [{ nom: 'Pièce aérée', vars: { salle: 'aeree' } }, { nom: 'Pièce fermée', vars: { salle: 'fermee' } }], inputs: [{ id: 'd', label: 'Durée', min: 0, max: 100, step: 10, val: 80, unit: '%', dec: 0 }],
          read: function (v) { var o = v.salle === 'fermee' ? O2n(+v.d) : 100; return [o >= 50 ? 'Assez de O₂ : combustion complète' : 'Trop peu de O₂ : monoxyde de carbone']; }, sound: function (v) { return 150 + 2 * +v.d; } } }
    ],
    manches: function (LV) {
      var a = LV[0] && LV[0].air != null ? +LV[0].air : 20, c = etat(a).complete;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé l’arrivée d’air à ' + fr(a, 0) + ' %. La combustion est…', o: ['complète (flamme bleue)', 'incomplète (flamme jaune)'], a: c ? 0 : 1, e: c ? 'Assez d’air : flamme bleue.' : 'Pas assez d’air : flamme jaune, suie, monoxyde de carbone.' },
        { type: 'qcm', q: 'Un réchaud brûle dans une chambre fermée. Quel est le danger ?', o: ['Le monoxyde de carbone', 'La vapeur d’eau', 'Le diazote'], a: 0, e: 'Combustion incomplète : monoxyde de carbone, invisible et inodore.' }
      ];
    }
  });
})();
