/* Livre vivant · 4e · Lumière blanche.
   Moment essentiel : un prisme décompose la lumière blanche en lumières colorées (dispersion) ; une lumière d'une seule couleur (laser) n'est pas décomposée.
   Chapitre 2 : disque de Newton : tournant vite, les couleurs se recomposent en blanc. Seuil de vitesse (70 %) : choix de dessin. */
(function () {
  'use strict';
  var V = window.Vivant;
  var COUL = ['#E23B3B', '#F28C28', '#F4D03F', '#4CAF50', '#3B82F6', '#4B3FBF', '#8E44AD'];
  var disperse = V.lois.disperse = function (src) { return src === 'blanche'; };
  var recompose = V.lois.recompose = function (v) { return +v >= 70; };
  function sceneP(c, X) {
    var P = X.P, b = disperse(X.S[0].v.src), i;
    P.poly(c, [[170, 70], [150, 170], [230, 170], [170, 70]], P.col.ink, 2.6, 'rgba(190,225,255,.5)');
    P.arrow(c, 30, 140, 168, 128, b ? '#B8B2A3' : '#E23B3B', 3);
    if (b) for (i = 0; i < 7; i++) { c.strokeStyle = COUL[i]; c.lineWidth = 3; c.beginPath(); c.moveTo(205, 120 + i * 0.5); c.lineTo(340, 100 + i * 14); c.stroke(); }
    else { c.strokeStyle = '#E23B3B'; c.lineWidth = 3; c.beginPath(); c.moveTo(205, 120); c.lineTo(340, 150); c.stroke(); }
    P.txt(c, b ? 'lumière blanche' : 'laser rouge', 80, 160, 12, P.col.ink, 'center', 800);
    P.txt(c, b ? 'spectre : du rouge au violet' : 'une seule couleur : pas de décomposition', 190, 30, 13, b ? P.col.ok : P.col.a, 'center', 800);
  }
  function sceneD(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, v = +s.v.vit, x0 = 100 + k * 190, y0 = 120, r = 55, i; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      var rec = recompose(v);
      for (i = 0; i < 7; i++) { c.fillStyle = rec ? '#EDEDED' : COUL[i]; c.beginPath(); c.moveTo(x0, y0); c.arc(x0, y0, r, i * 6.2832 / 7, (i + 1) * 6.2832 / 7); c.closePath(); c.fill(); }
      P.circ(c, x0, y0, r, col, 2.4, null); P.txt(c, rec ? 'blanc' : 'colorié', x0, y0 + r + 18, 13, rec ? P.col.ok : P.col.ink, 'center', 800); P.txt(c, s.nom, x0, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'lumiere-blanche', defiTitre: 'La lumière blanche : le défi',
    chap: [
      { titre: 'Le prisme', labTitre: 'Décomposer la lumière', cur: 'Comment se forme un arc-en-ciel ?',
        paras: ['Un prisme décompose la lumière blanche en lumières de couleurs différentes : c’est le spectre, du rouge au violet.', 'Une lumière d’une seule couleur, comme celle d’un laser, n’est pas décomposée.'],
        loi: { t: 'Lumière blanche = lumières colorées', s: 'le prisme les sépare : spectre' }, note: 'Change de source : blanche ou laser rouge.',
        predis: { q: 'Un laser rouge traverse un prisme. On obtient…', opts: ['un seul faisceau rouge', 'un arc-en-ciel', 'du blanc'], a: 0, rep: 'Un seul faisceau : la lumière d’un laser est d’une seule couleur.' },
        verif: { q: 'le prisme décompose la lumière…', o: ['blanche', 'du laser', 'aucune'], a: 0, e: 'La lumière blanche.' },
        lab: { w: 380, h: 220, alt: 'Un prisme décompose la lumière blanche', scene: sceneP, live: false, notrace: true, sit: [{ nom: '', vars: {} }], choices: [{ id: 'src', label: 'Source', opts: [['blanche', 'Lumière blanche'], ['laser', 'Laser rouge']], val: 'blanche' }],
          read: function (v) { return disperse(v.src) ? ['<b>Spectre : sept couleurs du rouge au violet</b>'] : ['<b>Pas de décomposition</b>', 'Une seule couleur.']; }, sound: function (v) { return disperse(v.src) ? 440 : 200; } } },
      { titre: 'Recomposer le blanc', labTitre: 'Le disque de Newton', cur: 'Comment refaire du blanc avec des couleurs ?',
        paras: ['Un disque coloré qui tourne vite paraît blanc : les couleurs se mélangent dans l’œil.', 'On recompose ainsi la lumière blanche.'],
        loi: { t: 'Couleurs mélangées : lumière blanche', s: 'disque de Newton qui tourne vite' }, note: 'Compare un disque lent et un disque rapide.',
        predis: { q: 'Un disque de Newton qui tourne très vite paraît…', opts: ['blanc', 'noir', 'rouge'], a: 0, rep: 'Blanc.' },
        verif: { q: 'lumière blanche recomposée : on mélange…', o: ['toutes les couleurs du spectre', 'une seule couleur', 'du noir'], a: 0, e: 'Toutes les couleurs.' },
        lab: { w: 380, h: 220, alt: 'Deux disques de Newton, un lent et un rapide', scene: sceneD, live: false, notrace: true, sit: [{ nom: 'Disque A', vars: {} }, { nom: 'Disque B', vars: {} }], inputs: [{ id: 'vit', label: 'Vitesse de rotation', min: 0, max: 100, step: 10, val: [20, 90], per: true, unit: '%', dec: 0 }],
          read: function (v) { return [recompose(+v.vit) ? 'Tourne vite : le disque paraît blanc' : 'Tourne lentement : couleurs visibles']; }, sound: function (v) { return 150 + 3 * +v.vit; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, on envoie la lumière blanche dans le prisme. Qu’observe-t-on ?', o: ['Un spectre de couleurs', 'Un point noir', 'Une seule couleur'], a: 0, e: 'Dispersion : spectre.' },
        { type: 'qcm', q: 'Pour faire paraître blanc un disque de Newton, on le fait…', o: ['tourner vite', 'tourner lentement', 'rester immobile'], a: 0, e: 'Les couleurs se recomposent.' }
      ];
    }
  });
})();
