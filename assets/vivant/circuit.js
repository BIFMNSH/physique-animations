/* Livre vivant · primitives de dessin d'un circuit (pile, lampe, interrupteur, fusible, fils) en traits de crayon.
   Cadre de 200 × 130 : la boucle part de la borne + de la pile, traverse la lampe en haut, descend à droite et revient à la borne −.
   Les points mobiles sur les fils montrent le sens conventionnel du courant (de + vers −), seulement si le circuit est fermé. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec = {};
  E.W = 200; E.H = 130;
  /* état d'une lampe de tension nominale Un soumise à la tension U : eteinte, faible (sous-tension), normale, surtension, grillee.
     Seuil de grillage = 1,5 × Un : choix de conception, pas une donnée de manuel. */
  V.lois.etatLampe = function (U, Un) {
    var u = Math.abs(U), e = 1e-9;
    if (u < 0.05) return { k: 'eteinte', a: 0 };
    if (u < Un - e) return { k: 'faible', a: u / Un };
    if (u < Un + e) return { k: 'normale', a: 1 };
    if (u < 1.5 * Un - e) return { k: 'surtension', a: 1.25 };
    return { k: 'grillee', a: 0 };
  };
  E.pos = { plus: [82, 96], moins: [118, 96], lampe: [100, 34] };
  function dots(c, pts, t, anim, col) {
    var L = [], tot = 0, i, d;
    for (i = 1; i < pts.length; i++) { d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
    var sp = 16, off = anim ? (t / 28) % sp : 0, s = off;
    for (; s < tot; s += sp) {
      var a = s, k = 0; while (k < L.length - 1 && a > L[k]) { a -= L[k]; k++; }
      var f = L[k] ? a / L[k] : 0; V.P.circ(c, pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f, 2.4, null, 0, col || V.P.col.glow);
    }
  }
  /* fil : trait + points mobiles si le courant circule ; hot = fil qui chauffe */
  E.fil = function (c, pts, on, t, anim, hot) {
    var P = V.P; P.poly(c, pts, hot ? P.col.hot : P.col.ink, hot ? 3.6 : 2.6);
    if (on) { c.save(); dots(c, pts, t, anim); c.restore(); }
  };
  E.cadre = function (c, ox, oy, s, fn) { c.save(); c.translate(ox, oy); c.scale(s, s); fn(); c.restore(); };
  /* disposition commune : un circuit grand, ou deux circuits empilés ; draw(s, k) dessine dans le cadre 200 × 130 */
  E.pose = function (c, X, draw) {
    var P = V.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var sc = two ? 0.84 : 1.5, ox = two ? 106 : 40, oy = two ? 6 + k * 130 : 37, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink;
      c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      E.cadre(c, ox, oy, sc, function () { draw(s, k); });
      if (two && s.nom) P.txt(c, s.nom, ox + 100 * sc, oy + 118, 12, col, 'center', 800);
      c.restore();
    });
  };
  /* pile : label facultatif (tension) à la place du mot « pile » */
  E.pile = function (c, hot, label) {
    var P = V.P; P.rect(c, 62, 102, 76, 18, P.col.ink, 2.4, hot ? '#FFD0B5' : P.col.fill);
    P.rect(c, 78, 96, 8, 6, P.col.ink, 2, P.col.paper); P.rect(c, 114, 96, 8, 6, P.col.ink, 2, P.col.paper);
    P.txt(c, '+', label ? 70 : 82, 111, 13, P.col.b, 'center', 800); P.txt(c, '−', label ? 130 : 118, 111, 13, P.col.a, 'center', 800);
    P.txt(c, label || 'pile', 100, 111, 11, P.col.soft, 'center');
  };
  /* lampe : lit = true/false ou une intensité de 0 à 1 (au-delà de 1 : surtension) ; burn = filament grillé ; r = rayon */
  E.lampe = function (c, x, y, lit, burn, r) {
    var P = V.P, i, R = r || 15, a = lit === true ? 1 : +lit || 0, k = R / 15;
    if (burn) a = 0;
    if (a > 0) for (i = 0; i < 8; i++) { var an = i * Math.PI / 4 + 0.4, l = (4 + 9 * Math.min(a, 1.4)) * k; P.line(c, x + Math.cos(an) * (R + 4 * k), y + Math.sin(an) * (R + 4 * k), x + Math.cos(an) * (R + 4 * k + l), y + Math.sin(an) * (R + 4 * k + l), P.col.glow, 2.4); }
    P.circ(c, x, y, R, P.col.ink, 2.4, a > 0 ? 'rgba(255,224,102,' + (0.3 + 0.65 * Math.min(a, 1)).toFixed(2) + ')' : P.col.paper);
    P.poly(c, [[x - 8 * k, y + 8 * k], [x - 5 * k, y - 4 * k], [x - 2 * k, y + 4 * k], [x + 2 * k, y - 4 * k], [x + 5 * k, y + 4 * k], [x + 8 * k, y - 6 * k]], a > 0 ? '#B45309' : P.col.soft, 1.8);
    if (burn) P.txt(c, '✕', x, y, 14 * k, P.col.hot, 'center', 800);
  };
  /* appareil de mesure : cercle avec sa lettre (V ou A) */
  E.meter = function (c, x, y, lettre, col) { var P = V.P; P.circ(c, x, y, 13, col || P.col.ink, 2.4, P.col.paper); P.txt(c, lettre, x, y, 15, col || P.col.ink, 'center', 800); };
  /* boucle simple sans élément : pile, fils, lampe en haut au centre */
  E.boucle = function (c, on, t, anim) {
    E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], on, t, anim); E.fil(c, [[115, 34], [180, 34], [180, 84], [118, 84], [118, 96]], on, t, anim);
  };
  /* interrupteur : bornes en (x, y0) et (x, y1), lame verticale si fermé */
  E.inter = function (c, x, y0, y1, closed) {
    var P = V.P; P.rect(c, x - 14, y0 - 4, 28, y1 - y0 + 8, P.col.soft, 1.6, P.col.fill);
    P.circ(c, x, y0, 3.2, P.col.ink, 2, P.col.paper); P.circ(c, x, y1, 3.2, P.col.ink, 2, P.col.paper);
    if (closed) P.line(c, x, y1, x, y0 + 2, P.col.ink, 3.2); else P.line(c, x, y1, x + 15, y0 + 8, P.col.ink, 3.2);
  };
  E.fusible = function (c, x, y0, y1, blown) {
    var P = V.P, m = (y0 + y1) / 2; P.rect(c, x - 8, y0, 16, y1 - y0, P.col.ink, 2.2, P.col.paper);
    if (!blown) P.line(c, x, y0 + 2, x, y1 - 2, P.col.ink, 1.6);
    else { P.line(c, x, y0 + 2, x, m - 5, P.col.ink, 1.6); P.line(c, x, m + 5, x, y1 - 2, P.col.ink, 1.6); P.txt(c, '✕', x, m, 11, P.col.hot, 'center', 800); }
  };
  /* pince crocodile (borne d'un objet testé) */
  E.pince = function (c, x, y) { var P = V.P; P.circ(c, x, y, 4.2, P.col.ink, 2, P.col.paper); };
})();
