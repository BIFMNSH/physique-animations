/* Livre vivant · 3e · Électricité · Le conducteur ohmique.
   Moment essentiel : curseur d'intensité, voltmètre à aiguille, caractéristique U = f(I) tracée au stylo lumineux. Son : hauteur selon la tension. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var tension = V.lois.ohm = function (R, Ima) { return R * Ima / 1000; };
  var BANDES = { 100: ['#7B3F00', '#111111', '#7B3F00'], 220: ['#D62828', '#D62828', '#7B3F00'], 470: ['#E8C400', '#7A1FA2', '#7B3F00'] };
  function resistance(c, P, x, y, R, col) {
    var b = BANDES[R] || BANDES[100]; P.line(c, x - 40, y, x - 22, y, P.col.soft, 2.4); P.line(c, x + 22, y, x + 40, y, P.col.soft, 2.4);
    c.beginPath(); c.moveTo(x - 22, y - 10); c.quadraticCurveTo(x - 28, y, x - 22, y + 10); c.lineTo(x + 22, y + 10); c.quadraticCurveTo(x + 28, y, x + 22, y - 10); c.closePath(); c.fillStyle = '#E8D3A2'; c.fill(); c.strokeStyle = col; c.lineWidth = 2.2; c.stroke();
    b.forEach(function (cl, i) { c.fillStyle = cl; c.fillRect(x - 14 + i * 9, y - 9.5, 5, 19); });
    c.fillStyle = '#C9A44A'; c.fillRect(x + 12, y - 9.5, 4, 19);
    P.txt(c, R + ' Ω', x, y - 22, 13, col, 'center', 800);
  }
  function voltmetre(c, P, x, y, r, U, col) {
    P.circ(c, x, y, r, col, 2.4, P.col.paper); P.txt(c, 'V', x, y + r * 0.45, 14, col, 'center', 800);
    for (var i = 0; i <= 5; i++) { var a = Math.PI * (1.15 - 1.3 * i / 5); P.line(c, x + Math.cos(a) * (r - 7), y - Math.sin(a) * (r - 7), x + Math.cos(a) * (r - 2), y - Math.sin(a) * (r - 2), P.col.soft, 1.3); }
    var an = Math.PI * (1.15 - 1.3 * Math.min(25, U) / 25); P.line(c, x, y + 2, x + Math.cos(an) * (r - 8), y + 2 - Math.sin(an) * (r - 8), P.col.hot, 2.4);
    P.txt(c, fr(U, 1) + ' V', x, y + r + 12, 14, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, S = X.S, two = S.length > 1, I = +S[0].v.I;
    if (two) S.forEach(function (s, k) { var col = s.cls === 'b' ? P.col.b : P.col.a, y = 52 + k * 120; resistance(c, P, 62, y, +s.v.R, col); voltmetre(c, P, 62, y + 52, 30, tension(+s.v.R, I), col); });
    else { var s0 = S[0]; resistance(c, P, 88, 60, +s0.v.R, P.col.ink); voltmetre(c, P, 88, 148, 48, tension(+s0.v.R, I), P.col.ink); P.txt(c, 'I = ' + fr(I, 0) + ' mA', 88, 232, 14, P.col.ink, 'center', 800); }
    var gx0 = 195, gy0 = 236, gw = 165, gh = 190; P.axes(c, gx0, gy0, gx0 + gw + 8, gy0 - gh - 6, 'I (mA)', 'U (V)');
    for (var i = 0; i <= 50; i += 25) { var xx = gx0 + i * gw / 50; P.line(c, xx, gy0, xx, gy0 + 4, P.col.soft, 1.3); P.txt(c, String(i), xx, gy0 + 14, 11, P.col.soft, 'center'); }
    for (var j = 0; j <= 25; j += 5) { var yy = gy0 - j * gh / 25; P.line(c, gx0 - 4, yy, gx0, yy, P.col.soft, 1.3); if (j % 10 === 0 || j === 25) P.txt(c, String(j), gx0 - 7, yy, 11, P.col.soft, 'right'); }
    S.forEach(function (s) {
      var R = +s.v.R, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, U = tension(R, I), pts = [], q;
      for (q = 0; q <= 50; q += 5) pts.push([gx0 + q * gw / 50, gy0 - tension(R, q) * gh / 25]);
      X.pen(pts, s); var px = gx0 + I * gw / 50, py = gy0 - U * gh / 25, dim = X.act >= 0 && X.act !== s.i;
      c.save(); c.globalAlpha = dim ? 0.3 : 1; P.line(c, px, gy0, px, py, col, 1.2); P.line(c, gx0, py, px, py, col, 1.2); P.circ(c, px, py, 5.5, col, 2, P.col.paper); c.restore();
    });
  }
  function lig(v) { var R = +v.R, I = +v.I; return ['<b>U = R × I = ' + R + ' Ω × ' + fr(I / 1000, 3) + ' A = ' + fr(tension(R, I), 1) + ' V</b>', 'La caractéristique est une droite qui passe par l’origine.']; }
  function lig2(v) { var R = +v.R, I = +v.I; return ['U = ' + R + ' × ' + fr(I / 1000, 3) + ' = ' + fr(tension(R, I), 1) + ' V']; }
  var inI = { id: 'I', label: 'Intensité I', min: 0, max: 50, step: 1, val: 30, unit: 'mA', dec: 0 };
  V.add({
    slug: 'conducteur-ohmique', defiTitre: 'Loi d’Ohm : le défi',
    chap: [
      { titre: 'Tension et intensité', labTitre: 'La caractéristique U = f(I)', cur: 'Deux fois plus de courant : deux fois plus de tension ?',
        paras: ['Pour un conducteur ohmique, la tension U à ses bornes est proportionnelle à l’intensité I qui le traverse.', 'Règle I avec le curseur : le voltmètre indique U et le stylo lumineux dessine la caractéristique.'],
        loi: { t: 'U = R × I', s: 'U en volts (V), I en ampères (A), R en ohms (Ω)' }, note: 'Change la résistance : la droite se redresse ou s’incline. Les bandes de couleur donnent R.',
        predis: { q: 'On passe de 3 V à 6 V aux bornes d’un conducteur ohmique de 100 Ω. Que devient sa résistance ?', opts: ['Elle double', 'Elle ne change pas', 'Elle est divisée par 2'], a: 1, rep: 'R = U ÷ I reste 100 Ω : si U double, I double aussi (30 mA puis 60 mA). La résistance est une propriété du conducteur.' },
        verif: { q: 'l’unité de résistance est…', o: ['le volt', 'l’ohm', 'l’ampère'], a: 1, e: 'La résistance se mesure en ohms (Ω).' },
        lab: { w: 380, h: 270, alt: 'Résistance à bandes de couleur, voltmètre et droite de la tension en fonction de l’intensité', scene: scene, read: lig, sound: function (v) { return 150 + 30 * tension(+v.R, +v.I); },
          inputs: [inI], choices: [{ id: 'R', label: 'Résistance', opts: [['100', '100 Ω'], ['220', '220 Ω'], ['470', '470 Ω']], val: '100' }] } },
      { titre: 'Deux résistances', labTitre: 'Quelle droite est la plus inclinée ?', cur: 'Qui a la droite la plus inclinée ?',
        paras: ['Le coefficient directeur de la droite U = f(I), c’est la résistance R.', 'À courant égal, le conducteur de plus grande résistance a la plus grande tension.'],
        loi: { t: 'R = U ÷ I', s: '1 Ω = 1 V ÷ 1 A' }, note: 'Compare 100 Ω et 470 Ω en alternance : une seule intensité, deux tensions.',
        predis: { q: 'Même courant dans deux conducteurs. Lequel a la tension la plus grande ?', opts: ['Celui de 100 Ω', 'Celui de 470 Ω', 'Les deux pareils'], a: 1, rep: 'U = R × I : à même I, le plus grand R donne la plus grande tension.' },
        verif: { q: 'une résistance de 1 kΩ est traversée par 5 mA : la tension vaut…', o: ['5 V', '0,5 V', '200 V'], a: 0, e: 'U = 1 000 Ω × 0,005 A = 5 V.' },
        lab: { w: 380, h: 270, alt: 'Deux résistances comparées : deux droites de pentes différentes', scene: scene, read: lig2, sit: [{ nom: '100 Ω', vars: { R: 100 } }, { nom: '470 Ω', vars: { R: 470 } }], sound: function (v) { return 150 + 30 * tension(+v.R, +v.I); }, inputs: [inI] } }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, I = l.I != null ? +l.I : 30, R = l.R != null ? +l.R : 100, U = tension(R, I);
      return [
        { type: 'calcul', q: 'Tu as réglé I = ' + fr(I, 0) + ' mA avec R = ' + R + ' Ω. Quelle tension lit-on aux bornes du conducteur ?', ans: U, tol: 0.06, unit: 'V', e: 'U = R × I = ' + R + ' × ' + fr(I / 1000, 3) + ' = ' + fr(U, 1) + ' V.' },
        { type: 'qcm', q: 'Pour R = 100 Ω, on mesure 5 V. Quelle intensité traverse le conducteur ?', o: ['50 mA', '0,5 mA', '20 mA', '500 mA'], a: 0, e: 'I = U ÷ R = 5 ÷ 100 = 0,05 A = 50 mA.' }
      ];
    }
  });
})();
