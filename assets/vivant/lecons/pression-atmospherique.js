/* Livre vivant · 5e · Mesure de grandeurs physiques · Pression atmosphérique.
   Moment essentiel : les hémisphères de Magdebourg ; on retire l'air de l'intérieur à la pompe, l'air extérieur (1 013 hPa) les presse l'un contre l'autre.
   Pression intérieure = 1 013 hPa × part d'air restant (volume et température constants). Chapitre 2 : P(h) = 1 013 hPa × exp(−h / 8 400 m), valeur approchée
   de l'atmosphère à température constante (choix de conception à confirmer avec le manuel). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, PA = 1013;
  var pint = V.lois.pressionInterieure = function (x) { return PA * (1 - x / 100); };
  var palt = V.lois.pressionAltitude = function (h) { return Math.round(PA * Math.exp(-h / 8400)); };
  var hpa = function (p) { return fr(Math.round(p), 0) + ' hPa'; };
  var parts = null;
  function magdebourg(c, X, s) {
    var P = X.P, x = +s.v.x, cx = 115, cy = 120, R = 52, n = Math.round(24 * (1 - x / 100)), i;
    if (!parts) parts = V.sim.cree(24, { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R }, 4);
    for (i = 0; i < 8; i++) { var a = i * Math.PI / 4 + 0.39; P.arrow(c, cx + Math.cos(a) * (R + 38), cy + Math.sin(a) * (R + 38), cx + Math.cos(a) * (R + 8), cy + Math.sin(a) * (R + 8), P.col.b, 2.6); }
    P.circ(c, cx, cy, R, P.col.ink, 2.8, 'rgba(160,200,255,.14)'); P.line(c, cx, cy - R, cx, cy + R, P.col.soft, 2); P.circ(c, cx - R, cy, 5, P.col.ink, 2, P.col.paper); P.circ(c, cx + R, cy, 5, P.col.ink, 2, P.col.paper);
    parts.slice(0, n).forEach(function (p, j) { var ox = p.x, oy = p.y; V.sim.pas([p], { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R }, X.anim ? 1.8 : 0, 1, 4); if (Math.hypot(p.x - cx, p.y - cy) > R - 5) { p.x = ox; p.y = oy; p.a += Math.PI; } P.circ(c, p.x, p.y, 3.6, P.col.a, 1.6, '#DCEBFF'); });
    P.line(c, cx, cy + R, cx, cy + R + 36, P.col.ink, 3); P.rect(c, cx - 22, cy + R + 36, 44, 22, P.col.ink, 2.4, P.col.fill); P.txt(c, 'pompe', cx, cy + R + 47, 11, P.col.soft, 'center');
    P.txt(c, 'air extérieur : il presse', cx, 24, 12, P.col.b, 'center', 800);
    var bx = 235, by = 225, hmax = 150;
    P.axes(c, bx - 10, by, bx + 140, by - hmax - 16, '', 'P');
    [[PA, 'extérieur', P.col.b], [pint(x), 'intérieur', P.col.a]].forEach(function (b, k) { var h = b[0] / PA * hmax, x0 = bx + 6 + k * 62; P.rect(c, x0, by - h, 40, h, b[2], 2.4, k ? 'rgba(160,200,255,.4)' : 'rgba(255,170,120,.4)'); P.txt(c, hpa(b[0]), x0 + 20, by - h - 10, 11, b[2], 'center', 800); P.txt(c, b[1], x0 + 20, by + 12, 11, P.col.soft, 'center'); });
  }
  function cadran(c, X, s, k) {
    var P = X.P, h = +s.v.h, p = palt(h), cx = 95 + 190 * k, cy = 120, R = 62, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, i;
    var ang = function (v) { return (-210 + (v - 700) / 400 * 240) * Math.PI / 180; };
    c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1; P.circ(c, cx, cy, R, col, 2.8, P.col.paper);
    for (i = 700; i <= 1100; i += 100) { var a = ang(i); P.line(c, cx + Math.cos(a) * (R - 10), cy + Math.sin(a) * (R - 10), cx + Math.cos(a) * (R - 2), cy + Math.sin(a) * (R - 2), P.col.soft, 1.6); P.txt(c, String(i), cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22), 10, P.col.soft, 'center'); }
    var an = ang(p); P.line(c, cx, cy, cx + Math.cos(an) * (R - 14), cy + Math.sin(an) * (R - 14), P.col.b, 3.4); P.circ(c, cx, cy, 4, col, 2, P.col.paper);
    P.txt(c, 'hPa', cx, cy + 26, 11, P.col.soft, 'center'); P.txt(c, hpa(p), cx, cy + R + 22, 15, col, 'center', 800); P.txt(c, 'altitude ' + fr(h, 0) + ' m', cx, cy + R + 42, 12, P.col.soft, 'center'); P.txt(c, s.nom, cx, 22, 13, col, 'center', 800); c.restore();
  }
  function scene(c, X) { if (X.S[0].v.h != null) X.S.forEach(function (s, k) { cadran(c, X, s, k); }); else magdebourg(c, X, X.S[0]); }
  function lig(v) {
    if (v.h != null) return ['<b>À ' + fr(+v.h, 0) + ' m : P ≈ ' + hpa(palt(+v.h)) + '</b>'];
    var x = +v.x, pi = pint(x);
    return ['<b>P extérieure = ' + hpa(PA) + ' · P intérieure = ' + hpa(pi) + '</b>', x > 0 ? 'L’air extérieur presse plus fort : les hémisphères sont serrés l’un contre l’autre.' : 'Pressions égales : rien ne retient les hémisphères.'];
  }
  var x1 = { id: 'x', label: 'Air retiré', min: 0, max: 100, step: 10, val: 50, unit: '%', dec: 0 };
  var hI = { id: 'h', label: 'Altitude', min: 0, max: 2000, step: 250, val: [0, 1500], unit: 'm', dec: 0, per: true };
  V.add({
    slug: 'pression-atmospherique', defiTitre: 'La pression atmosphérique : le défi',
    chap: [
      { titre: 'L’air presse', labTitre: 'Les hémisphères de Magdebourg', cur: 'Pourquoi deux hémisphères vides sont-ils impossibles à séparer ?',
        paras: ['L’air est de la matière : il exerce une force pressante sur toutes les surfaces. Sa pression, la pression atmosphérique, se mesure en hectopascals (hPa) avec un baromètre.', 'Au niveau de la mer, elle vaut environ 1 013 hPa.'],
        loi: { t: 'L’air exerce une pression', s: 'au niveau de la mer : environ 1 013 hPa' }, note: 'Pompe l’air de l’intérieur : les particules disparaissent, la pression intérieure baisse, mais l’air extérieur continue de presser.',
        predis: { q: 'On retire presque tout l’air entre deux hémisphères. Ils tiennent ensemble parce que…', opts: ['ils sont collés', 'l’air extérieur les presse', 'ils sont aimantés'], a: 1, rep: 'L’air extérieur les presse l’un contre l’autre, et presque plus d’air ne pousse de l’intérieur.' },
        verif: { q: 'la pression atmosphérique se mesure avec…', o: ['un thermomètre', 'un baromètre', 'une balance'], a: 1, e: 'Un baromètre, en hPa.' },
        lab: { w: 380, h: 270, alt: 'Deux hémisphères reliés à une pompe, flèches de l’air extérieur et barres de pression', scene: scene, read: lig, live: true, notrace: true, sound: function (v) { return 150 + 5 * +v.x; }, inputs: [x1], sit: [{ nom: '', vars: {} }] } },
      { titre: 'En montagne', labTitre: 'Deux baromètres, deux altitudes', cur: 'Pourquoi a-t-on les oreilles qui se bouchent en montant une montagne ?',
        paras: ['Plus on monte, moins il y a d’air au-dessus de nous : la pression atmosphérique diminue avec l’altitude.', 'À 1 500 m, elle est d’environ 850 hPa, soit nettement moins qu’au niveau de la mer.'],
        loi: { t: 'La pression diminue avec l’altitude', s: 'valeurs approchées : 1 013 hPa à 0 m, environ 850 hPa à 1 500 m' }, note: 'Compare en alternance : change l’altitude de chaque baromètre.',
        predis: { q: 'En montagne, la pression atmosphérique…', opts: ['augmente', 'diminue', 'ne change pas'], a: 1, rep: 'Elle diminue : il y a moins d’air au-dessus de nous.' },
        verif: { q: 'au niveau de la mer, la pression atmosphérique vaut environ…', o: ['1 013 hPa', '100 hPa', '10 000 hPa'], a: 0, e: 'Environ 1 013 hPa.' },
        lab: { w: 380, h: 270, alt: 'Deux baromètres à deux altitudes', scene: scene, read: lig, live: false, notrace: true, sound: function (v) { return 150 + 0.3 * palt(+v.h); }, inputs: [hI], sit: [{ nom: 'Niveau de la mer', vars: {} }, { nom: 'En altitude', vars: {} }] } }
    ],
    manches: function (LV) {
      var x = LV[0] && LV[0].x != null ? +LV[0].x : 50, pi = pint(x);
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as retiré ' + x + ' % de l’air des hémisphères. Il reste ' + (100 - x) + ' % de l’air : quelle est la pression intérieure (1 013 hPa au départ) ?', ans: pi, tol: 2, unit: 'hPa', e: 'P = 1 013 × ' + (100 - x) / 100 + ' ≈ ' + fr(Math.round(pi), 0) + ' hPa.' },
        { type: 'qcm', q: 'Quand on monte en montagne, la pression atmosphérique…', o: ['augmente', 'diminue', 'ne change pas'], a: 1, e: 'Il y a moins d’air au-dessus : la pression diminue.' }
      ];
    }
  });
})();
