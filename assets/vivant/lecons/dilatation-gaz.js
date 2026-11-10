/* Livre vivant · 5e · Propriétés physiques de la matière · Dilatation des gaz.
   Moment essentiel : curseur de température ; le ballon de baudruche gonfle, les particules gardent leur nombre et leur taille mais s'agitent plus vite.
   Programme de 5e qualitatif : aucune valeur de volume n'est affichée ; la courbe n'a pas de graduation. Chauffage par le professeur (plaque, pas de flamme). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, T0 = 20;
  var rayon = V.lois.rayonBallon = function (T) { return 22 + (T - T0) * 0.3; };
  function factory() {
    var parts = null, N = 16, FC = { x: 100, y: 178, r: 46 };
    return function scene(c, X) {
      var P = X.P, s = X.S[0], T = +s.v.T, rb = rayon(T), by = 118 - rb * 0.75, ag = Math.sqrt((T + 273) / (T0 + 273));
      if (!parts) parts = V.sim.cree(N, { x: FC.x - 28, y: FC.y - 28, w: 56, h: 56 }, 5);
      var hot = Math.max(0, Math.min(1, (T - 20) / 80)), cold = Math.max(0, Math.min(1, (20 - T) / 20));
      c.fillStyle = 'rgba(' + Math.round(120 + 120 * hot) + ',' + Math.round(180 - 70 * hot) + ',' + Math.round(240 - 190 * hot) + ',.28)'; c.beginPath(); c.arc(FC.x, FC.y, FC.r + 14, 0, 6.2832); c.fill(); P.circ(c, FC.x, FC.y, FC.r + 14, P.col.soft, 1.3);
      P.rect(c, FC.x - 54, FC.y + FC.r + 18, 108, 9, P.col.ink, 1.6, T > 20 ? '#FF9B5C' : T < 20 ? '#8CC8FF' : '#C9BFA6');
      P.txt(c, T > 20 ? 'chauffage (professeur)' : T < 20 ? 'bain froid' : 'bain à 20 °C', FC.x, FC.y + FC.r + 40, 11, P.col.soft, 'center');
      P.circ(c, FC.x, FC.y, FC.r, P.col.ink, 2.6, 'rgba(160,200,255,.10)'); P.rect(c, FC.x - 8, 118, 16, 30, P.col.ink, 2.4, P.col.paper);
      c.beginPath(); c.arc(FC.x, by, rb, 0, 6.2832); c.fillStyle = 'rgba(214,69,69,.82)'; c.fill(); c.strokeStyle = '#8A2020'; c.lineWidth = 2.2; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(FC.x - rb * 0.35, by - rb * 0.35, rb * 0.18, rb * 0.3, -0.6, 0, 6.2832); c.fill();
      var sp = X.anim ? 0.8 * ag * 1.6 : 0;
      parts.forEach(function (p) {
        var ox = p.x, oy = p.y; V.sim.pas([p], { x: FC.x - 60, y: by - rb, w: 120, h: FC.y + FC.r - (by - rb) }, sp, 1, 3);
        var inF = Math.hypot(p.x - FC.x, p.y - FC.y) <= FC.r - 4, inB = Math.hypot(p.x - FC.x, p.y - by) <= rb - 4, inN = Math.abs(p.x - FC.x) <= 6 && p.y > by && p.y < FC.y;
        if (!(inF || inB || inN)) { p.x = ox; p.y = oy; p.a += Math.PI * (0.7 + Math.random() * 0.6); }
        P.circ(c, p.x, p.y, 3.2, P.col.a, 1.6, '#DCEBFF');
      });
      var gx0 = 232, gy0 = 236, gw = 130, gh = 190; P.axes(c, gx0, gy0, gx0 + gw + 8, gy0 - gh - 6, 'température', 'volume');
      var pts = [], q; for (q = 0; q <= 100; q += 5) pts.push([gx0 + q * gw / 100, gy0 - 20 - ((q + 273) / 293 - 0.9) / 0.4 * (gh - 40)]);
      c.save(); c.setLineDash([3, 4]); P.line(c, gx0 + T0 * gw / 100, gy0, gx0 + T0 * gw / 100, gy0 - gh + 30, P.col.soft, 1); c.restore(); P.txt(c, '20 °C', gx0 + T0 * gw / 100, gy0 + 14, 11, P.col.soft, 'center');
      X.pen(pts, s); var px = gx0 + T * gw / 100, py = gy0 - 20 - ((T + 273) / 293 - 0.9) / 0.4 * (gh - 40); P.circ(c, px, py, 5.5, P.col.ink, 2, P.col.paper);
      P.txt(c, 'Particules : ' + N, 60, 14, 12, P.col.soft, 'center', 800);
    };
  }
  function sceneBarres(c, X) {
    var P = X.P, dT = +X.S[0].v.dT, base = 226, cols = [[70, 'Gaz', 1.9, '#7DB8FF'], [190, 'Liquide', 0.6, '#E8A33D'], [310, 'Solide', 0.08, '#8C8C8C']];
    cols.forEach(function (k) { var h0 = 60, h = h0 + dT * k[2]; P.rect(c, k[0] - 22, base - 200, 44, 200, P.col.soft, 1.4); c.fillStyle = k[3]; c.globalAlpha = 0.8; c.fillRect(k[0] - 20, base - h, 40, h); c.globalAlpha = 1; P.line(c, k[0] - 26, base - h0, k[0] + 26, base - h0, P.col.ink, 1.4); P.txt(c, k[1], k[0], base + 16, 14, P.col.ink, 'center', 800); P.arrow(c, k[0] + 30, base - h0, k[0] + 30, base - h + 2, P.col.hot, 1.8); });
    P.txt(c, 'départ', 40, base - 60 - 8, 11, P.col.soft, 'center'); P.txt(c, 'Même échauffement pour les trois (schéma qualitatif)', 190, 14, 12, P.col.soft, 'center');
  }
  function lig(v) { var T = +v.T; var w = T > 20 ? 'plus gonflé qu’à 20 °C : le gaz s’est dilaté' : T < 20 ? 'moins gonflé qu’à 20 °C : le gaz s’est contracté' : 'gonflé comme au départ (20 °C)'; return ['<b>À ' + T + ' °C, le ballon est ' + w + '.</b>', 'Particules : 16 (le nombre ne change pas) · taille : inchangée · agitation : ' + (T > 20 ? 'plus rapide' : T < 20 ? 'plus lente' : 'normale')]; }
  V.add({
    slug: 'dilatation-gaz', defiTitre: 'Dilatation des gaz : le défi',
    chap: [
      { titre: 'Le ballon qui gonfle', labTitre: 'Chauffer un gaz', cur: 'Pourquoi le ballon gonfle-t-il dans l’eau chaude ?',
        paras: ['Quand on chauffe un gaz qui peut changer de volume (ballon souple, piston), son volume augmente : il se dilate. Refroidi, il se contracte.', 'À l’échelle des particules : chauffées, elles s’agitent plus vite et occupent plus de place.'],
        loi: { t: 'Gaz chauffé → volume ↑', s: 'les particules sont plus agitées, pas plus grosses' }, note: 'Compte les particules à 20 °C puis à 80 °C : leur nombre ne change pas.',
        predis: { q: 'Le gaz chauffé occupe plus de place. Pourquoi ?', opts: ['Les particules grossissent', 'Les particules s’agitent plus et s’écartent', 'De nouvelles particules apparaissent'], a: 1, rep: 'Les particules gardent la même taille et le même nombre : elles vont plus vite et s’écartent les unes des autres.' },
        verif: { q: 'un gaz refroidi…', o: ['se dilate', 'se contracte', 'explose'], a: 1, e: 'Son volume diminue : il se contracte.' },
        lab: { w: 380, h: 270, alt: 'Ballon de verre surmonté d’une baudruche qui gonfle quand on chauffe, avec les particules de gaz', scene: factory(), read: lig, sound: function (v) { return 180 + 4 * (+v.T); }, live: true, inputs: [{ id: 'T', label: 'Température', min: 0, max: 100, step: 5, val: 20, unit: '°C', dec: 0 }] } },
      { titre: 'Gaz, liquide, solide', labTitre: 'Qui se dilate le plus ?', cur: 'Pour un même échauffement, qui se dilate le plus ?',
        paras: ['Les gaz se dilatent beaucoup plus que les liquides, qui se dilatent plus que les solides.', 'Dans un récipient rigide et fermé, le gaz ne peut pas se dilater : sa pression augmente, ce qui peut faire éclater le récipient.'],
        loi: { t: 'gaz > liquides > solides', s: 'ordre de dilatation pour un même échauffement' }, note: 'Les barres sont un schéma : elles montrent l’ordre, pas des valeurs.',
        predis: { q: 'Pourquoi ne faut-il pas chauffer un aérosol ?', opts: ['Il se vide', 'Le gaz ne peut pas se dilater : la pression le fait éclater', 'Il devient froid'], a: 1, rep: 'Le gaz enfermé ne peut pas augmenter de volume : sa pression monte et peut faire éclater la boîte.' },
        verif: { q: 'qui se dilate le moins ?', o: ['l’air', 'l’alcool', 'le fer'], a: 2, e: 'Les solides se dilatent le moins.' },
        lab: { w: 380, h: 270, alt: 'Trois colonnes : gaz, liquide et solide chauffés de la même façon', scene: sceneBarres, notrace: true, read: function () { return ['<b>Même échauffement : le gaz se dilate le plus, puis le liquide, puis le solide.</b>', 'Les barres montrent l’ordre, pas les valeurs.']; }, sound: function (v) { return 200 + 5 * (+v.dT); }, inputs: [{ id: 'dT', label: 'Échauffement', min: 0, max: 80, step: 5, val: 40, unit: '°C', dec: 0 }] } }
    ],
    manches: function (LV) {
      var T = LV[0] && LV[0].T != null ? +LV[0].T : 20, a = T > 20 ? 0 : T < 20 ? 1 : 2;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé la température à ' + T + ' °C. Par rapport à 20 °C, le ballon est…', o: ['plus gonflé', 'moins gonflé', 'gonflé comme au départ'], a: a, e: 'Plus la température est élevée, plus le gaz se dilate : au-dessus de 20 °C le ballon gonfle, en dessous il se dégonfle.' },
        { type: 'qcm', q: 'Quand on chauffe le gaz, le nombre de particules dans le ballon…', o: ['augmente', 'ne change pas', 'diminue'], a: 1, e: 'Les particules ne se créent pas et ne disparaissent pas : elles s’agitent plus vite et s’écartent.' }
      ];
    }
  });
})();
