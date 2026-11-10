/* Livre vivant · 3e · Mécanique · Masse et poids d'un corps.
   Moment essentiel : curseur de masse, dynamomètre qui s'étire, droite P = f(m) dessinée au stylo lumineux. Le son suit le poids (sonification). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var poids = V.lois.poids = function (m, g) { return m * g; };
  function gt(g) { return fr(g, g % 1 ? 1 : 0); }
  /* dynamomètre : tube gradué de 0 à 100 N, tige qui sort, masse suspendue */
  function dyna(c, P, x, s, m, g, k) {
    var Pn = poids(m, g), col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, tw = 26 * k, yp = 28 + Math.min(100, Pn);
    P.line(c, x, 6, x, 16, P.col.soft, 2); P.circ(c, x, 20, 5, P.col.soft, 2);
    P.rect(c, x - tw / 2, 26, tw, 108, col, 2.4, P.col.fill);
    for (var i = 0; i <= 5; i++) { var y = 28 + i * 20; P.line(c, x - tw / 2, y, x - tw / 2 + 7, y, P.col.soft, 1.3); if (k === 1) P.txt(c, String(i * 20), x + tw / 2 + 4, y, 10, P.col.soft, 'left'); }
    P.poly(c, [[x - tw / 2 - 5, yp], [x - tw / 2 + 1, yp - 4], [x - tw / 2 + 1, yp + 4]], col, 1.5, col, true);
    var yb = 134 + Pn * 0.45; P.line(c, x, 128, x, yb, P.col.soft, 2.4);
    var bw = (46 + m * 3.2) * (k === 1 ? 1 : 0.85), bh = 20 + m * 2.6; P.rect(c, x - bw / 2, yb, bw, bh, col, 2.2, P.col.paper); P.txt(c, fr(m, 1) + ' kg', x, yb + bh / 2, 11, col, 'center', 800);
    if (s.nom) P.txt(c, s.nom, x, 262, 13, col, 'center', 800);
    if (k === 1) P.txt(c, 'N', x + tw / 2 + 4, 20, 11, P.col.soft, 'left');
  }
  function scene(c, X) {
    var P = X.P, S = X.S, two = S.length > 1, m = +S[0].v.m;
    if (two) { dyna(c, P, 50, S[0], m, +S[0].v.g, 0.8); dyna(c, P, 130, S[1], m, +S[1].v.g, 0.8); } else dyna(c, P, 80, S[0], m, +S[0].v.g, 1);
    var gx0 = 200, gy0 = 236, gw = 160, gh = 190; P.axes(c, gx0, gy0, gx0 + gw + 8, gy0 - gh - 6, 'm (kg)', 'P (N)');
    for (var i = 0; i <= 10; i += 5) { var xx = gx0 + i * gw / 10; P.line(c, xx, gy0, xx, gy0 + 4, P.col.soft, 1.3); P.txt(c, String(i), xx, gy0 + 14, 11, P.col.soft, 'center'); }
    for (var j = 0; j <= 100; j += 50) { var yy = gy0 - j * gh / 100; P.line(c, gx0 - 4, yy, gx0, yy, P.col.soft, 1.3); P.txt(c, String(j), gx0 - 7, yy, 11, P.col.soft, 'right'); }
    S.forEach(function (s) {
      var g = +s.v.g, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, pts = [], q;
      for (q = 0; q <= 10; q++) pts.push([gx0 + q * gw / 10, gy0 - poids(q, g) * gh / 100]);
      X.pen(pts, s);
      var px = gx0 + m * gw / 10, py = gy0 - poids(m, g) * gh / 100, dim = X.act >= 0 && X.act !== s.i;
      c.save(); c.globalAlpha = dim ? 0.3 : 1; P.line(c, px, gy0, px, py, col, 1.2); P.line(c, gx0, py, px, py, col, 1.2); P.circ(c, px, py, 5.5, col, 2, P.col.paper); c.restore();
    });
  }
  var base = { w: 380, h: 270, alt: 'Dynamomètre qui s’étire et droite du poids en fonction de la masse', scene: scene, sound: function (v) { return 180 + 5 * poids(+v.m, +v.g); },
    inputs: [{ id: 'm', label: 'Masse m', min: 0, max: 10, step: 0.5, val: 2, unit: 'kg', dec: 1 }] };
  function lig(v, s) { var m = +v.m, g = +v.g; return ['<b>P = m × g = ' + fr(m, 1) + ' kg × ' + gt(g) + ' N/kg = ' + fr(poids(m, g), g % 1 ? 1 : 0) + ' N</b>']; }
  V.add({
    slug: 'masse-poids', defiTitre: 'Masse, poids, dynamomètre : le défi',
    chap: [
      { titre: 'Du kilogramme au newton', labTitre: 'Le dynamomètre et la droite P = f(m)', cur: 'Un même objet pèse-t-il autant partout ?',
        paras: ['La masse m dit combien de matière contient l’objet : on la mesure avec une balance, en kilogrammes (kg).', 'Le poids P est la force avec laquelle la Terre attire l’objet : on le mesure avec un dynamomètre, en newtons (N).'],
        loi: { t: 'P = m × g', s: 'g ≈ 9,8 N/kg sur Terre (arrondi à 10) · g ≈ 1,6 N/kg sur la Lune' }, note: 'Bouge le curseur : le dynamomètre s’étire, la droite se dessine et le son monte avec le poids.',
        predis: { q: 'Un sac a une masse de 5 kg sur Terre. On l’emporte sur la Lune. Que devient sa masse ?', opts: ['Elle diminue', 'Elle ne change pas', 'Elle augmente'], a: 1, rep: 'La masse ne dépend pas du lieu : 5 kg sur Terre, 5 kg sur la Lune. C’est le poids qui change.' },
        verif: { q: 'le poids d’un corps se mesure avec…', o: ['une balance', 'un dynamomètre', 'une éprouvette'], a: 1, e: 'Le poids est une force : on le mesure avec un dynamomètre.' },
        lab: Object.assign({}, base, { choices: [{ id: 'g', label: 'Lieu', opts: [['10', 'Terre'], ['1.6', 'Lune']], val: '10' }], read: lig }) },
      { titre: 'Terre ou Lune ?', labTitre: 'Même masse, deux lieux', cur: 'Sur la Lune, tout paraît plus léger. Pourquoi ?',
        paras: ['g est l’intensité de la pesanteur : plus g est petit, plus le poids est petit pour une même masse.', 'La représentation graphique de P en fonction de m est une droite qui passe par l’origine : P et m sont proportionnels.'],
        loi: { t: 'P et m sont proportionnels', s: 'le coefficient directeur de la droite est g' }, note: 'Appuie sur « Comparer en alternance » : la masse ne bouge pas, le poids oui.',
        predis: { q: 'Même masse, deux lieux : quelle droite est la plus inclinée ?', opts: ['Celle de la Terre', 'Celle de la Lune', 'Les deux pareilles'], a: 0, rep: 'Celle de la Terre : g est plus grand, donc P grandit plus vite quand m augmente.' },
        verif: { q: 'le poids est appliqué…', o: ['au point de contact', 'au centre de gravité G', 'au bout du fil'], a: 1, e: 'Au centre de gravité G, verticalement vers le bas.' },
        lab: Object.assign({}, base, { sit: [{ nom: 'Terre', vars: { g: 10 } }, { nom: 'Lune', vars: { g: 1.6 } }], read: lig }) }
    ],
    manches: function (LV) {
      var m = LV[0] && LV[0].m != null ? +LV[0].m : 2, P = poids(m, 10);
      var svg = '<rect x="2" y="2" width="296" height="216" fill="none"/><line x1="150" y1="14" x2="150" y2="70" stroke="#6B604F" stroke-width="3"/><rect x="100" y="70" width="100" height="90" fill="#E7D2A3" stroke="#2A2620" stroke-width="3"/><line x1="100" y1="115" x2="200" y2="115" stroke="#8B7A55" stroke-width="2"/><line x1="40" y1="162" x2="260" y2="162" stroke="#2A2620" stroke-width="3"/>';
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as réglé m = ' + fr(m, 1) + ' kg. Quel est son poids sur la Terre (g = 10 N/kg) ?', ans: P, tol: 0.5, unit: 'N', e: 'P = m × g = ' + fr(m, 1) + ' × 10 = ' + fr(P, 1) + ' N.' },
        { type: 'clic', q: 'Clique sur le point où s’applique le poids de la caisse.', w: 300, h: 220, svg: svg, zones: [{ id: 'fil', x: 130, y: 10, w: 40, h: 56, label: 'le fil' }, { id: 'sommet', x: 100, y: 66, w: 100, h: 20, label: 'le haut de la caisse' }, { id: 'G', x: 120, y: 92, w: 60, h: 46, label: 'le centre de la caisse' }, { id: 'contact', x: 100, y: 146, w: 100, h: 16, label: 'le dessous de la caisse' }], a: 'G', e: 'Le poids s’applique au centre de gravité G de la caisse, verticalement vers le bas.' }
      ];
    }
  });
})();
