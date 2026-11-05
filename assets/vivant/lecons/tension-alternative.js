/* Livre vivant · 4e · Tension alternative.
   Moment essentiel : une pile donne une tension continue (constante) ; le secteur donne une tension alternative qui change de sens et de valeur à chaque instant (période 20 ms, valeur maximale ≈ 311 V).
   Complète « Tension sinusoïdale » : ici seulement la distinction continu/alternatif. 311 V = 220 V × √2 arrondi. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, UM = 311, T = 20;
  var u = V.lois.tensionAlt = function (t) { return UM * Math.sin(2 * Math.PI * t / T); };
  function trace(c, P, x0, y0, w, h, fn, col, t, tmax) {
    P.axes(c, x0, y0, x0 + w + 8, y0 - h - 6, 't', 'U'); var pts = [], q; for (q = 0; q <= tmax; q += 1) pts.push([x0 + q * w / tmax, y0 - h / 2 - fn(q) * h / 2]);
    P.poly(c, pts, col, 2.4); var px = x0 + t * w / tmax; P.circ(c, px, y0 - h / 2 - fn(t) * h / 2, 5, P.col.ink, 2, P.col.paper); c.save(); c.setLineDash([3, 4]); P.line(c, x0, y0 - h / 2, x0 + w, y0 - h / 2, P.col.soft, 1); c.restore();
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, alt = s.v.type === 'alt', t = +s.v.t, x0 = two ? 30 + k * 185 : 60, w = two ? 130 : 240; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      trace(c, P, x0, 215, w, 120, alt ? function (q) { return 0.9 * u(q) / UM; } : function () { return 0.5; }, col, t, 40);
      P.txt(c, alt ? 'tension alternative' : 'tension continue', x0 + w / 2, 30, 12, col, 'center', 800); if (two) P.txt(c, s.nom, x0 + w / 2, 14, 12, col, 'center', 800); c.restore();
    });
  }
  function lig(v) { var alt = v.type === 'alt', val = alt ? u(+v.t) : 4.5; return alt ? ['<b>U = ' + fr(val, 0) + ' V à t = ' + fr(+v.t, 0) + ' ms</b>', val > 0 ? 'Sens positif' : val < 0 ? 'Sens opposé : la tension change de sens' : 'Tension nulle'] : ['<b>U = 4,5 V, toujours le même</b>', 'Continue : ne change ni de sens ni de valeur.']; }
  var tI = { id: 't', label: 'Instant', min: 0, max: 40, step: 5, val: 5, unit: 'ms', dec: 0 };
  V.add({
    slug: 'tension-alternative', defiTitre: 'La tension alternative : le défi',
    chap: [
      { titre: 'Continue ou alternative', labTitre: 'Pile et secteur', cur: 'Pourquoi une pile ne fait-elle pas la même tension que la prise de la maison ?',
        paras: ['Une pile donne une tension continue : toujours le même sens, toujours la même valeur.', 'Le secteur donne une tension alternative : elle change de sens et de valeur, de façon périodique.'],
        loi: { t: 'Continue : constante · alternative : change de sens', s: 'secteur : période 20 ms, maximum ≈ 311 V' }, note: 'Change de source et d’instant. Échelle verticale non graduée.',
        predis: { q: 'La tension d’une pile est…', opts: ['continue', 'alternative', 'nulle'], a: 0, rep: 'Continue.' },
        verif: { q: 'une tension alternative…', o: ['change de sens', 'est constante', 'est toujours positive'], a: 0, e: 'Elle change de sens périodiquement.' },
        lab: { w: 380, h: 240, alt: 'Courbe de tension continue ou alternative en fonction du temps', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [tI], choices: [{ id: 'type', label: 'Source', opts: [['cont', 'Pile'], ['alt', 'Secteur']], val: 'cont' }], read: lig, sound: function (v) { return v.type === 'alt' ? 250 + u(+v.t) / 2 : 300; } } },
      { titre: 'Lire une valeur', labTitre: 'À chaque instant', cur: 'Que vaut la tension du secteur à un instant donné ?',
        paras: ['La tension alternative prend des valeurs positives, nulles et négatives dans la période.', 'On la lit sur la courbe à chaque instant. Maximum ≈ 311 V.'],
        loi: { t: 'Alternative : valeurs positives et négatives', s: 'maximum ≈ 311 V · période 20 ms' }, note: 'Compare pile et secteur au même instant.',
        predis: { q: 'À t = 15 ms (période 20 ms), la tension du secteur est…', opts: ['négative', 'positive', 'nulle'], a: 0, rep: 'Négative : on est dans la seconde moitié de la période (≈ −311 V).' },
        verif: { q: 'une pile donne à tout instant…', o: ['la même tension', 'une tension qui change de signe', 'zéro'], a: 0, e: 'Continue.' },
        lab: { w: 380, h: 240, alt: 'Pile et secteur au même instant', scene: scene, live: false, notrace: true, sit: [{ nom: 'Pile', vars: { type: 'cont' } }, { nom: 'Secteur', vars: { type: 'alt' } }], inputs: [tI], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sound: function (v) { return v.type === 'alt' ? 250 + u(+v.t) / 2 : 300; } } }
    ],
    manches: function (LV) {
      var t = LV[0] && LV[0].t != null ? +LV[0].t : 5, uu = u(t);
      return [
        { type: 'calcul', q: 'Dans le laboratoire, quelle est la tension du secteur à t = ' + fr(t, 0) + ' ms (en V, arrondie à l’unité) ?', ans: Math.round(uu), tol: 2, unit: 'V', e: 'Lecture sur la courbe : ' + fr(uu, 0) + ' V.' },
        { type: 'qcm', q: 'Quelle tension ne change jamais de sens ?', o: ['La tension continue d’une pile', 'La tension du secteur', 'Les deux'], a: 0, e: 'La pile : tension continue.' }
      ];
    }
  });
})();
