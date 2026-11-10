/* Livre vivant · 3e · Lentilles convergentes.
   Moment essentiel : une lentille convergente de distance focale f = 10 cm forme l'image d'un objet ; l'objet au-delà du foyer donne une image réelle renversée, entre la lentille et le foyer une image virtuelle droite agrandie.
   Position de l'image calculée avec 1/OA' − 1/OA = 1/f (choix de conception ; relation à confronter au programme) ; grandissement γ = OA'/OA. Dessin à l'échelle 3,5 px par cm. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, F = 10, S = 3.5;
  var image = V.lois.imageLentille = function (d) {
    if (d === F) return { inf: true, nature: 'à l’infini' };
    var dp = d * F / (d - F), g = -dp / d; return { dp: dp, g: g, inf: false, nature: d > F ? 'réelle, renversée' : 'virtuelle, droite' };
  };
  function dessin(c, P, ox, oy, d, col, sc) {
    var im = image(d), xo = ox - d * S * sc, hy = 32 * sc;
    P.line(c, ox - 150 * sc, oy, ox + 150 * sc, oy, P.col.soft, 1.2); P.poly(c, [[ox, oy - 62 * sc], [ox - 7, oy - 52 * sc], [ox + 7, oy - 52 * sc], [ox, oy - 62 * sc]], col, 2.2); P.line(c, ox, oy - 62 * sc, ox, oy + 62 * sc, col, 2.6); P.poly(c, [[ox, oy + 62 * sc], [ox - 7, oy + 52 * sc], [ox + 7, oy + 52 * sc], [ox, oy + 62 * sc]], col, 2.2);
    P.circ(c, ox + F * S * sc, oy, 3, P.col.ink, 1.4, P.col.ink); P.circ(c, ox - F * S * sc, oy, 3, P.col.ink, 1.4, P.col.paper); P.txt(c, 'F′', ox + F * S * sc, oy + 14, 10, P.col.soft, 'center'); P.txt(c, 'F', ox - F * S * sc, oy + 14, 10, P.col.soft, 'center');
    P.arrow(c, xo, oy, xo, oy - hy, P.col.b, 3);
    if (im.inf) { P.line(c, xo, oy - hy, ox, oy - hy, '#D4A017', 1.8); P.line(c, ox, oy - hy, ox + 140 * sc, oy - hy + 0.0 + (hy / (F * S * sc)) * 140 * sc, '#D4A017', 1.8); P.line(c, xo, oy - hy, ox + 140 * sc, oy + (hy / (d * S * sc)) * 140 * sc, '#D4A017', 1.8); P.txt(c, 'image à l’infini', ox + 70 * sc, oy + 50 * sc, 11, P.col.hot, 'center', 800); return; }
    var xi = ox + im.dp * S * sc, yi = oy - hy * im.g, real = d > F, lim = 150 * sc;
    if (xi < ox - lim) xi = ox - lim; if (xi > ox + lim) xi = ox + lim;
    P.line(c, xo, oy - hy, ox, oy - hy, '#D4A017', 1.8); P.line(c, ox, oy - hy, xi, yi, '#D4A017', 1.8); P.line(c, xo, oy - hy, xi, yi, '#D4A017', 1.8);
    if (!real) { c.save(); c.setLineDash([3, 4]); P.line(c, ox, oy - hy, xi, yi, P.col.soft, 1.2); c.restore(); }
    c.save(); if (!real) c.setLineDash([4, 3]); P.arrow(c, xi, oy, xi, yi, P.col.hot, 3); c.restore();
    P.txt(c, 'objet', xo, oy + 14, 10, P.col.b, 'center', 800); P.txt(c, 'image', xi, oy + (yi < oy ? 14 : -hy * 0 - 6), 10, P.col.hot, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, sc = two ? 0.62 : 1; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      dessin(c, P, 190, two ? 60 + k * 100 : 120, +s.v.d, col, sc); if (two) P.txt(c, s.nom, 190, 20 + k * 100, 11, col, 'center', 800); c.restore();
    });
  }
  function lig(v) { var im = image(+v.d); return im.inf ? ['<b>Objet au foyer : l’image est à l’infini</b>'] : ['<b>Image ' + im.nature + '</b>', 'OA′ ≈ ' + fr(im.dp, 1) + ' cm · grandissement ' + fr(im.g, 1)]; }
  var dI = { id: 'd', label: 'Distance objet–lentille', min: 5, max: 40, step: 5, val: 20, unit: 'cm', dec: 0 };
  V.add({
    slug: 'lentilles', defiTitre: 'Les lentilles : le défi',
    chap: [
      { titre: 'Une image par une lentille', labTitre: 'Lentille convergente', cur: 'Comment une loupe agrandit-elle ce qu’on regarde ?',
        paras: ['Une lentille convergente fait converger les rayons vers un point : le foyer image F′. Ici, la distance focale vaut 10 cm.', 'Objet au-delà du foyer : image réelle et renversée. Objet entre la lentille et le foyer : image virtuelle, droite et agrandie (loupe).'],
        loi: { t: 'Objet au-delà de F : image réelle, renversée', s: 'entre lentille et F : image virtuelle, droite' }, note: 'Déplace l’objet. Distance focale 10 cm. Relation de conjugaison à confronter au programme.',
        predis: { q: 'Un objet est entre la lentille et le foyer. L’image est…', opts: ['virtuelle, droite, agrandie', 'réelle, renversée', 'à l’infini'], a: 0, rep: 'Virtuelle, droite et agrandie : c’est l’effet loupe.' },
        verif: { q: 'une lentille convergente fait…', o: ['converger les rayons', 'diverger les rayons', 'arrêter les rayons'], a: 0, e: 'Elle fait converger les rayons.' },
        lab: { w: 380, h: 250, alt: 'Objet, lentille convergente, foyers et image', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [dI], read: lig, sound: function (v) { return 150 + 8 * +v.d; } } },
      { titre: 'Agrandie ou réduite', labTitre: 'Deux distances', cur: 'Pourquoi l’image d’un objet lointain est-elle plus petite ?',
        paras: ['Le grandissement est le rapport de la taille de l’image à celle de l’objet.', 'Objet proche (juste au-delà de F) : image agrandie. Objet lointain : image réduite.'],
        loi: { t: 'Grandissement = taille image ÷ taille objet', s: 'objet loin : image réduite' }, note: 'Compare un objet proche et un objet lointain.',
        predis: { q: 'On éloigne l’objet de la lentille. L’image réelle…', opts: ['rapetisse', 'grandit', 'ne change pas'], a: 0, rep: 'Elle rapetisse et se rapproche du foyer.' },
        verif: { q: 'une image renversée a un grandissement…', o: ['négatif', 'positif', 'nul'], a: 0, e: 'Négatif : elle est à l’envers.' },
        lab: { w: 380, h: 250, alt: 'Deux objets à des distances différentes', scene: scene, live: false, notrace: true, sit: [{ nom: 'Objet proche', vars: {} }, { nom: 'Objet lointain', vars: {} }], inputs: [Object.assign({}, dI, { val: [15, 35], per: true })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '') + (image(+v.d).inf ? '' : ' · γ = ' + fr(image(+v.d).g, 1))]; }, sound: function (v) { return 150 + 8 * +v.d; } } }
    ],
    manches: function (LV) {
      var d = LV[0] && LV[0].d != null ? +LV[0].d : 20, im = image(d);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, l’objet est à ' + fr(d, 0) + ' cm de la lentille (f = 10 cm). L’image est…', o: ['réelle, renversée', 'virtuelle, droite', 'à l’infini'], a: im.inf ? 2 : d > F ? 0 : 1, e: 'Image ' + im.nature + '.' },
        { type: 'calcul', q: 'Objet à 20 cm, f = 10 cm : à quelle distance de la lentille se forme l’image, en cm ?', ans: 20, tol: 0.5, unit: 'cm', e: '1/OA′ = 1/10 + 1/20 → OA′ = 20 cm.' }
      ];
    }
  });
  function ign() {}
})();
