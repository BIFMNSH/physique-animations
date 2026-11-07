/* Livre vivant · 4e · Propagation de la lumière.
   Moment essentiel : trois fentes alignées : la lumière se propage en ligne droite, elle ne passe que si les trous sont alignés.
   Chapitre 2 : vitesse de la lumière c ≈ 300 000 km/s ; durée = distance ÷ c (Lune 384 400 km ; Soleil 150 millions de km). Valeurs arrondies du programme. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, C = 300000;
  var D = { lune: ['la Lune', 384400], soleil: ['le Soleil', 150000000] };
  var duree = V.lois.dureeLumiere = function (km) { return km / C; };
  var passe = V.lois.lumierePasse = function (dec) { return Math.abs(dec) < 1e-9; };
  function sceneFentes(c, X) {
    var P = X.P, d = +X.S[0].v.dec, ok = passe(d), xs = [120, 190, 260], i, y = 120;
    P.circ(c, 40, y, 14, P.col.ink, 2.4, '#FFE066'); P.txt(c, 'source', 40, y + 28, 11, P.col.ink, 'center', 800);
    xs.forEach(function (x, k) { var hy = k === 1 ? y + d : y; P.line(c, x, 40, x, hy - 8, P.col.ink, 5); P.line(c, x, hy + 8, x, 200, P.col.ink, 5); });
    if (ok) { P.line(c, 54, y, 320, y, '#D4A017', 2.4); P.txt(c, 'écran éclairé', 330, y - 24, 11, P.col.ok, 'center', 800); P.circ(c, 330, y, 10, P.col.ok, 2.4, '#FFF3B0'); }
    else { P.line(c, 54, y, 190, y, '#D4A017', 2.4); P.txt(c, 'écran sombre', 330, y - 24, 11, P.col.hot, 'center', 800); P.circ(c, 330, y, 10, P.col.hot, 2.4, P.col.paper); P.txt(c, '✕', 190, y - 14, 14, P.col.hot, 'center', 800); }
    P.line(c, 330, 60, 330, 190, P.col.soft, 3);
    P.txt(c, ok ? 'trous alignés : ligne droite' : 'trous décalés : la lumière est arrêtée', 185, 24, 13, ok ? P.col.ok : P.col.hot, 'center', 800);
  }
  function sceneVit(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var a = D[s.v.astre], col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 20 + k * 185, t = duree(a[1]); c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0 + 20, 110, 16, col, 2.4, '#8CC8FF'); P.txt(c, 'Terre', x0 + 20, 138, 11, col, 'center', 800);
      P.circ(c, x0 + 140, 110, s.v.astre === 'soleil' ? 18 : 9, col, 2.4, s.v.astre === 'soleil' ? '#FFE066' : '#D9D4C5'); P.txt(c, a[0], x0 + 140, 138, 11, col, 'center', 800);
      P.arrow(c, x0 + 135, 100, x0 + 40, 100, '#D4A017', 2.4); P.txt(c, fr(a[1], 0) + ' km', x0 + 85, 76, 11, col, 'center', 800); P.txt(c, 'durée : ' + (t < 60 ? fr(t, 1) + ' s' : fr(t, 0) + ' s'), x0 + 85, 180, 13, col, 'center', 800);
      P.txt(c, s.nom, x0 + 85, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'propagation-lumiere', defiTitre: 'La propagation de la lumière : le défi',
    chap: [
      { titre: 'En ligne droite', labTitre: 'Trois fentes alignées', cur: 'Pourquoi un rayon de soleil entre-t-il en ligne droite par un trou du toit ?',
        paras: ['Dans un milieu transparent et homogène comme l’air, la lumière se propage en ligne droite.', 'On la représente par un rayon lumineux, une droite fléchée.'],
        loi: { t: 'La lumière se propage en ligne droite', s: 'dans un milieu transparent et homogène' }, note: 'Décale le deuxième trou : l’écran devient sombre.',
        predis: { q: 'Les trois trous ne sont pas alignés. L’écran est…', opts: ['sombre', 'éclairé', 'à moitié éclairé'], a: 0, rep: 'Sombre : la lumière va en ligne droite.' },
        verif: { q: 'dans l’air, la lumière se propage…', o: ['en ligne droite', 'en zigzag', 'en cercle'], a: 0, e: 'En ligne droite.' },
        lab: { w: 380, h: 240, alt: 'Source, trois fentes et écran', scene: sceneFentes, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'dec', label: 'Décalage du trou central', min: -30, max: 30, step: 5, val: 15, unit: 'mm', dec: 0 }],
          read: function (v) { return passe(+v.dec) ? ['<b>Trous alignés : l’écran est éclairé</b>'] : ['<b>Trous décalés : l’écran est sombre</b>', 'Remets le décalage à 0.']; }, sound: function (v) { return passe(+v.dec) ? 420 : 160; } } },
      { titre: 'La vitesse de la lumière', labTitre: 'De la Lune et du Soleil à la Terre', cur: 'Pourquoi voit-on le Soleil tel qu’il était il y a plus de huit minutes ?',
        paras: ['La lumière va très vite : environ 300 000 km/s dans le vide et dans l’air.', 'Durée = distance ÷ vitesse. Soleil : environ 8 min 20 s ; Lune : environ 1,3 s.'],
        loi: { t: 'c ≈ 300 000 km/s', s: 'durée = distance ÷ vitesse' }, note: 'Valeurs arrondies : Terre–Lune 384 400 km, Terre–Soleil 150 millions de km.',
        predis: { q: 'La lumière met environ 1 s pour aller de la Terre à…', opts: ['la Lune', 'le Soleil', 'l’étoile la plus proche'], a: 0, rep: 'À la Lune : environ 1,3 s.' },
        verif: { q: 'la lumière du Soleil arrive en…', o: ['environ 8 minutes', 'environ 1 seconde', 'environ 1 jour'], a: 0, e: '150 millions de km ÷ 300 000 km/s ≈ 500 s.' },
        lab: { w: 380, h: 240, alt: 'Durée de la lumière de la Lune et du Soleil à la Terre', scene: sceneVit, live: false, notrace: true, sit: [{ nom: 'Lune', vars: {} }, { nom: 'Soleil', vars: {} }],
          choices: [{ id: 'astre', label: 'Astre', opts: [['lune', 'Lune'], ['soleil', 'Soleil']], val: 'lune', per: true }],
          read: function (v) { var t = duree(D[v.astre][1]); return [D[v.astre][0] + ' : ' + (t < 60 ? fr(t, 1) + ' s' : fr(t, 0) + ' s (' + fr(t / 60, 1) + ' min)')]; }, sound: function (v) { return v.astre === 'soleil' ? 200 : 380; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'calcul', q: 'Dans le laboratoire, la lumière met combien de secondes, environ, pour aller du Soleil (150 000 000 km) à la Terre, à 300 000 km/s ?', ans: 500, tol: 5, unit: 's', e: '150 000 000 ÷ 300 000 = 500 s, soit 8 min 20 s.' },
        { type: 'qcm', q: 'Les trous sont décalés. Pourquoi l’écran reste-t-il sombre ?', o: ['La lumière se propage en ligne droite', 'La lumière est trop lente', 'Les trous sont trop gros'], a: 0, e: 'En ligne droite : elle est arrêtée.' }
      ];
    }
  });
})();
