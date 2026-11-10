/* Livre vivant · 6e · Propriétés physiques de la matière · Les gaz.
   Moment essentiel : on pousse le piston d'une seringue d'air ; le volume diminue, le nombre de particules reste 20, elles se serrent et s'agitent dans tout le volume.
   Chapitre 2 : la même seringue remplie d'eau ne se comprime pas. Volume initial 100 mL, graduation du piston : choix de conception (V = 100 − 0,7 × poussée, en %). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, N = 20;
  var volume = V.lois.volumeSeringue = function (mat, p) { return mat === 'eau' ? 100 : 100 - 0.7 * p; };
  function factory() {
    var parts = [];
    return function scene(c, X) {
      var P = X.P, S = X.S, two = S.length > 1, x0 = 44;
      S.forEach(function (s, k) {
        var v = s.v, p = +v.p, eau = v.mat === 'eau', vol = volume(v.mat, p), L = vol * 2, cy = two ? 70 + k * 120 : 125, y0 = cy - 28;
        var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, dim = X.act >= 0 && X.act !== s.i, i;
        c.save(); c.globalAlpha = dim ? 0.35 : 1;
        P.rect(c, x0 - 14, cy - 6, 14, 12, col, 2.2, P.col.paper);
        if (eau) { c.fillStyle = 'rgba(80,150,230,.35)'; c.fillRect(x0, y0, L, 56); }
        P.rect(c, x0, y0, 200, 56, col, 2.6);
        for (i = 1; i <= 5; i++) { var tx = x0 + i * 40; P.line(c, tx, y0, tx, y0 - 5, P.col.soft, 1.3); P.txt(c, String(i * 20), tx, y0 - 12, 10, P.col.soft, 'center'); }
        P.rect(c, x0 + L, y0 + 2, 6, 52, col, 2.2, P.col.fill); P.line(c, x0 + L + 6, cy, x0 + L + 50, cy, col, 3.2); P.rect(c, x0 + L + 50, cy - 14, 8, 28, col, 2.2, P.col.fill);
        var al = 8 + p * 0.55; P.arrow(c, x0 + L + 62 + al, cy, x0 + L + 62, cy, P.col.b, 2.6); P.txt(c, 'poussée', x0 + L + 62 + al / 2, cy + 16, 10, P.col.b, 'center', 800);
        if (!parts[k]) parts[k] = V.sim.cree(N, { x: x0, y: y0, w: 200, h: 56 }, 11 + k);
        var arr = parts[k];
        arr.forEach(function (q, j) {
          if (eau) { q.x = x0 + 10 + (j % 10) * (L - 20) / 9 + Math.sin(X.t / 140 + j) * 1.2; q.y = cy - 10 + Math.floor(j / 10) * 20 + Math.cos(X.t / 170 + j * 1.3) * 1.2; }
          else V.sim.pas([q], { x: x0, y: y0, w: L, h: 56 }, X.anim ? 2.3 : 0, 1, 4);
          P.circ(c, q.x, q.y, 4, col, 1.6, eau ? 'rgba(120,180,255,.7)' : 'rgba(255,255,255,.65)');
        });
        if (two && s.nom) P.txt(c, s.nom, x0 + 4, cy + 44, 12, col, 'left', 800);
        c.restore();
      });
    };
  }
  function lig(v) {
    var eau = v.mat === 'eau', vol = volume(v.mat, +v.p);
    if (eau) return ['<b>V = 100 mL : le liquide ne se comprime pas</b>', 'Le piston ne bouge pas · toujours ' + N + ' particules.'];
    return ['<b>V = ' + fr(vol, vol % 1 ? 1 : 0) + ' mL' + (vol < 100 ? ' : le gaz est comprimé' : ' : volume de départ') + '</b>', 'Toujours ' + N + ' particules : plus serrées, pas plus petites.'];
  }
  var p = { id: 'p', label: 'Poussée sur le piston', min: 0, max: 100, step: 10, val: 40, unit: '%', dec: 0 };
  var base = { w: 380, h: 270, live: true, notrace: true, sound: function (v) { return v.mat === 'eau' ? 120 : 200 + 4 * +v.p; }, inputs: [p] };
  V.add({
    slug: 'les-gaz', defiTitre: 'Les gaz : le défi',
    chap: [
      { titre: 'Comprimer un gaz', labTitre: 'Pousser le piston d’une seringue d’air', cur: 'Pourquoi le ballon de foot gonflé est-il dur sous le doigt ?',
        paras: ['Un gaz n’a ni forme propre ni volume propre : il occupe tout le volume disponible.', 'Un gaz est compressible : on peut diminuer son volume. Les particules restent aussi nombreuses, elles sont seulement plus serrées.'],
        loi: { t: 'Un gaz est compressible', s: 'il occupe tout le volume qu’on lui offre' }, note: 'Pousse le piston : le volume diminue, mais il y a toujours 20 particules.',
        predis: { q: 'On pousse le piston d’une seringue qui contient de l’air. Les particules d’air…', opts: ['deviennent plus petites', 'restent aussi nombreuses : elles sont plus serrées', 'disparaissent'], a: 1, rep: 'Elles restent aussi nombreuses et de même taille : elles ont seulement moins de place.' },
        verif: { q: 'un gaz occupe…', o: ['une partie du récipient', 'tout le volume disponible', 'un volume fixe'], a: 1, e: 'Un gaz se répartit dans tout le volume offert.' },
        lab: Object.assign({}, base, { scene: factory(), alt: 'Seringue d’air dont on pousse le piston, particules qui se serrent', read: lig, sit: [{ nom: '', vars: { mat: 'air' } }] }) },
      { titre: 'Air ou eau ?', labTitre: 'Même seringue, air puis eau', cur: 'Pourquoi un pneu se gonfle-t-il, alors qu’on ne peut pas « gonfler » une bouteille d’eau ?',
        paras: ['Un liquide est pratiquement incompressible : son volume ne diminue pas quand on le comprime.', 'Les particules d’un liquide sont déjà serrées ; celles d’un gaz sont éloignées, donc on peut les rapprocher.'],
        loi: { t: 'Gaz : compressible · liquide : incompressible', s: 'les particules d’un gaz sont éloignées les unes des autres' }, note: 'Compare en alternance : même poussée, deux contenus.',
        predis: { q: 'Même seringue, remplie d’eau : on pousse le piston. Le volume…', opts: ['diminue beaucoup', 'ne change presque pas', 'double'], a: 1, rep: 'Il ne change presque pas : on ne peut pas comprimer un liquide.' },
        verif: { q: 'on peut comprimer…', o: ['un gaz', 'un liquide', 'un solide'], a: 0, e: 'Seul un gaz est compressible.' },
        lab: Object.assign({}, base, { scene: factory(), alt: 'Deux seringues : l’une d’air, l’autre d’eau', read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sit: [{ nom: 'Air', vars: { mat: 'air' } }, { nom: 'Eau', vars: { mat: 'eau' } }] }) }
    ],
    manches: function (LV) {
      var pp = LV[0] && LV[0].p != null ? +LV[0].p : 40, plus = pp > 0;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as poussé le piston à ' + pp + ' %. Le volume d’air est devenu…', o: ['plus petit que 100 mL', 'égal à 100 mL', 'plus grand que 100 mL'], a: plus ? 0 : 1, e: plus ? 'Un gaz est compressible : son volume diminue quand on pousse le piston.' : 'Sans poussée, le volume reste 100 mL.' },
        { type: 'qcm', q: 'Pendant qu’on comprime l’air, le nombre de particules dans la seringue…', o: ['diminue', 'reste le même', 'augmente'], a: 1, e: 'Les particules ne disparaissent pas : elles sont plus serrées.' }
      ];
    }
  });
})();
