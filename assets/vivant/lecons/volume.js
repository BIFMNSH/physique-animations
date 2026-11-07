/* Livre vivant · 6e · Mesures · Le volume.
   Moment essentiel : on règle le volume de liquide dans une éprouvette graduée ; on le lit au bas du ménisque, l'œil au niveau de la surface.
   Chapitre 2 : éprouvette (graduation 1 mL) et bécher (graduation 20 mL, indicative) : la précision change. Conversion 1 L = 1 000 mL. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var lectVol = V.lois.lectureVolume = function (v, grad) { return grad === 1 ? { v: Math.round(v), pre: true } : { v: Math.floor(v / grad) * grad, max: Math.floor(v / grad) * grad + grad, pre: false }; };
  function tube(c, P, cx, v, grad, w, col, nom, haut, two) {
    var yb = 215, k = 1.7, ty = yb - v * k, i;
    c.fillStyle = 'rgba(80,150,230,.38)'; c.fillRect(cx - w / 2 + 1.5, ty, w - 3, yb - ty);
    P.poly(c, [[cx - w / 2, 24], [cx - w / 2, yb], [cx + w / 2, yb], [cx + w / 2, 24]], col, 2.6);
    P.poly(c, [[cx - w / 2 + 2, ty - 2], [cx, ty + 3], [cx + w / 2 - 2, ty - 2]], P.col.a, 2);
    for (i = 0; i <= 100; i += grad) { var y = yb - i * k, big = i % 10 === 0 || grad > 1; P.line(c, cx + w / 2, y, cx + w / 2 + (big ? 9 : 4), y, P.col.soft, big ? 1.5 : 1); if (i % 20 === 0) P.txt(c, String(i), cx + w / 2 + 14, y, 10, P.col.soft, 'left'); }
    var ay = haut ? ty - 3 : ty + 3; P.arrow(c, cx - w / 2 - 36, ay, cx - w / 2 - 6, ay, haut ? P.col.hot : P.col.ok, 2.2); P.txt(c, haut ? 'haut' : 'bas', cx - w / 2 - 38, ay - 10, 10, haut ? P.col.hot : P.col.ok, 'center', 800);
    if (nom) P.txt(c, nom, cx, 12, 12, col, 'center', 800); if (!two) P.txt(c, 'mL', cx + w / 2 + 14, 24, 11, P.col.soft, 'left');
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      tube(c, P, two ? 85 + 190 * k : 130, +s.v.V, +s.v.grad, +s.v.larg, col, two ? s.nom : '', s.v.lect === 'haut', two); c.restore();
    });
  }
  function lig(v) {
    var r = lectVol(+v.V, +v.grad), l = r.v / 1000;
    if (v.lect === 'haut') return ['<b>Lecture au haut du ménisque : erreur</b>', 'On lit toujours au bas du ménisque, l’œil au niveau de la surface.'];
    return r.pre ? ['<b>V = ' + fr(r.v, 0) + ' mL = ' + fr(l, l < 0.1 ? 3 : 2) + ' L</b>', 'Lecture au bas du ménisque (1 L = 1 000 mL).'] : ['<b>Entre ' + fr(r.v, 0) + ' mL et ' + fr(r.max, 0) + ' mL</b>', 'Graduation de ' + fr(+v.grad, 0) + ' mL : lecture moins précise.'];
  }
  var Vn = { id: 'V', label: 'Volume de liquide', min: 0, max: 100, step: 1, val: 47, unit: 'mL', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, live: false, notrace: true, read: lig, inputs: [Vn], sound: function (v) { return 150 + 4 * +v.V; } };
  V.add({
    slug: 'volume', defiTitre: 'Le volume : le défi',
    chap: [
      { titre: 'Lire le ménisque', labTitre: 'Une éprouvette graduée', cur: 'Comment Awa mesure-t-elle exactement 50 mL d’eau pour sa recette ?',
        paras: ['Le volume d’un liquide se mesure avec une éprouvette graduée, en millilitres (mL) ou en litres (L). 1 L = 1 000 mL.', 'La surface du liquide est un peu courbée : c’est le ménisque. On lit au bas du ménisque, l’œil au niveau de la surface.'],
        loi: { t: 'Volume : éprouvette, en mL', s: 'on lit au bas du ménisque · 1 L = 1 000 mL' }, note: 'Change le volume, puis essaie « Haut du ménisque » : la flèche montre où lire.',
        predis: { q: 'On lit le volume d’un liquide dans une éprouvette…', opts: ['au bas du ménisque', 'au haut du ménisque', 'n’importe où'], a: 0, rep: 'Au bas du ménisque, l’œil au niveau de la surface.' },
        verif: { q: '1 L vaut…', o: ['10 mL', '100 mL', '1 000 mL'], a: 2, e: '1 L = 1 000 mL.' },
        lab: Object.assign({}, base, { alt: 'Éprouvette graduée avec un liquide et un ménisque', sit: [{ nom: '', vars: { grad: 1, larg: 40 } }], choices: [{ id: 'lect', label: 'Lecture', opts: [['bas', 'Bas du ménisque'], ['haut', 'Haut du ménisque']], val: 'bas' }] }) },
      { titre: 'Choisir le récipient', labTitre: 'Éprouvette et bécher', cur: 'Pourquoi n’utilise-t-on pas un bécher pour mesurer précisément un volume ?',
        paras: ['Une éprouvette étroite à graduations serrées donne une lecture précise.', 'Un bécher, large et peu gradué, ne donne qu’une valeur approchée.'],
        loi: { t: 'Éprouvette : mesure précise', s: 'bécher : valeur approchée' }, note: 'Compare en alternance : même volume, deux récipients.',
        predis: { q: 'Pour mesurer précisément 47 mL d’eau, on choisit…', opts: ['un bécher', 'une éprouvette graduée', 'un verre'], a: 1, rep: 'Une éprouvette graduée : ses graduations sont serrées.' },
        verif: { q: 'un bécher donne…', o: ['une valeur approchée', 'une valeur exacte', 'aucune valeur'], a: 0, e: 'Une valeur approchée.' },
        lab: Object.assign({}, base, { alt: 'Une éprouvette et un bécher contenant le même volume', sit: [{ nom: 'Éprouvette', vars: { grad: 1, larg: 34, lect: 'bas' } }, { nom: 'Bécher', vars: { grad: 20, larg: 70, lect: 'bas' } }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var v = LV[0] && LV[0].V != null ? +LV[0].V : 47;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as réglé ' + fr(v, 0) + ' mL. Exprime ce volume en litres.', ans: v / 1000, tol: 0.0006, unit: 'L', e: fr(v, 0) + ' mL = ' + fr(v / 1000, 3) + ' L (1 L = 1 000 mL).' },
        { type: 'qcm', q: 'Où se place-t-on pour lire le volume dans une éprouvette ?', o: ['L’œil au niveau de la surface, au bas du ménisque', 'D’en haut, au haut du ménisque', 'De loin'], a: 0, e: 'On évite l’erreur de lecture.' }
      ];
    }
  });
})();
