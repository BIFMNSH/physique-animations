/* Livre vivant · 4e · Courants et tensions alternatifs · Tension alternative sinusoïdale.
   Moment essentiel : curseurs de fréquence et de tension maximale ; oscilloscope tracé au stylo lumineux et son à la fréquence réglée.
   Balayage fixé à 1 ms/div, sensibilité 2 V/div (choix de conception : 10 divisions en horizontal, 8 en vertical). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, BAL = 1, SENS = 2, SX = 34, SY = 22.5, CX0 = 24, CY = 112;
  var periode = V.lois.periode = function (f) { return 1 / f; };
  var ueff = V.lois.ueff = function (um) { return um / Math.SQRT2; };
  function ms(f) { var t = 1000 * periode(f); return fr(t, t % 1 ? 1 : 0); }
  function scene(c, X) {
    var P = X.P, S = X.S;
    P.rect(c, CX0, CY - 4 * SY, 10 * SX, 8 * SY, P.col.ink, 3, '#10261B');
    c.fillStyle = '#10261B'; c.fillRect(CX0, CY - 4 * SY, 10 * SX, 8 * SY);
    c.strokeStyle = 'rgba(120,220,160,.25)'; c.lineWidth = 1; for (var i = 1; i < 10; i++) { c.beginPath(); c.moveTo(CX0 + i * SX, CY - 4 * SY); c.lineTo(CX0 + i * SX, CY + 4 * SY); c.stroke(); }
    for (var j = 1; j < 8; j++) { c.beginPath(); c.moveTo(CX0, CY - 4 * SY + j * SY); c.lineTo(CX0 + 10 * SX, CY - 4 * SY + j * SY); c.stroke(); }
    c.strokeStyle = 'rgba(160,255,200,.55)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(CX0, CY); c.lineTo(CX0 + 10 * SX, CY); c.stroke();
    P.rect(c, CX0, CY - 4 * SY, 10 * SX, 8 * SY, P.col.ink, 3);
    S.forEach(function (s) {
      var f = +s.v.f, um = +s.v.U, pts = [], x, col = s.cls === 'b' ? '#FFA56B' : s.cls === 'a' ? '#8DB5FF' : '#7CFFB0';
      for (x = 0; x <= 10 * SX; x += 2) pts.push([CX0 + x, CY - (um * Math.sin(2 * Math.PI * f * (x / SX) * BAL / 1000) / SENS) * SY]);
      X.pen(pts, Object.assign({}, s, { pc: col }), null, 3);
    });
    var s = S[X.act >= 0 ? X.act : 0], f = +s.v.f, um = +s.v.U, T = 1000 * periode(f) / BAL, xT = CX0 + T * SX;
    if (xT <= CX0 + 10 * SX + 1) { c.save(); c.setLineDash([4, 3]); c.strokeStyle = '#FFE08A'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xT, CY - 4 * SY); c.lineTo(xT, CY + 4 * SY); c.stroke(); c.setLineDash([]); c.restore(); P.arrow(c, CX0 + 2, CY + 3.4 * SY, xT, CY + 3.4 * SY, '#FFE08A', 1.6); P.txt(c, 'T', (CX0 + xT) / 2, CY + 3.0 * SY, 13, '#FFE08A', 'center', 800); }
    var yp = CY - um / SENS * SY; P.arrow(c, CX0 + 12, CY, CX0 + 12, yp + 3, '#FFE08A', 1.6); P.txt(c, 'U max', CX0 + 20, yp + 8, 12, '#FFE08A', 'left', 800);
    P.txt(c, 'Balayage 1 ms/div · Sensibilité 2 V/div', 200, 222, 13, P.col.soft, 'center', 700);
    P.txt(c, 'Oscilloscope', 200, 246, 14, P.col.ink, 'center', 800);
  }
  function lig(v) { var f = +v.f, um = +v.U; return ['<b>T = 1 ÷ f = 1 ÷ ' + f + ' Hz = ' + fr(periode(f), 4).replace(/0+$/, '') + ' s = ' + ms(f) + ' ms</b>', 'À l’écran : T = ' + ms(f) + ' div × 1 ms/div · U max = ' + fr(um / SENS, 1) + ' div × 2 V/div = ' + fr(um, 0) + ' V', 'U eff = U max ÷ √2 = ' + fr(um, 0) + ' ÷ 1,41 ≈ ' + fr(ueff(um), 1) + ' V']; }
  function lig2(v) { var f = +v.f, um = +v.U; return ['T = 1 ÷ ' + f + ' = ' + ms(f) + ' ms · U max = ' + fr(um, 0) + ' V · U eff ≈ ' + fr(ueff(um), 1) + ' V']; }
  function fin(per, val, id) { return { id: id || 'f', label: 'Fréquence f', min: 100, max: 1000, step: 50, val: val, unit: 'Hz', dec: 0, per: per }; }
  function uin(per, val) { return { id: 'U', label: 'U max', min: 1, max: 8, step: 1, val: val, unit: 'V', dec: 0, per: per }; }
  V.add({
    slug: 'tension-sinusoidale', defiTitre: 'Oscilloscope : le défi',
    chap: [
      { titre: 'Voir et entendre une tension', labTitre: 'Oscilloscope et haut-parleur', cur: 'Peux-tu entendre la forme d’une tension ?',
        paras: ['Une tension alternative change de signe ; celle d’un GBF est sinusoïdale. À l’oscilloscope, on la voit onduler.', 'La période T est la durée d’un motif ; la fréquence f est le nombre de périodes par seconde, en hertz (Hz).'],
        loi: { t: 'f = 1 ÷ T', s: 'T en secondes (s), f en hertz (Hz)' }, note: 'Bouge le curseur de fréquence : le son et le dessin changent en même temps.',
        predis: { q: 'Je double la fréquence de la tension. Que devient la période T ?', opts: ['Elle double', 'Elle est divisée par 2', 'Elle ne change pas'], a: 1, rep: 'T = 1 ÷ f : si f double, T est divisée par 2. Sur l’écran, les motifs sont deux fois plus serrés et le son est plus aigu.' },
        verif: { q: 'une tension de fréquence 25 Hz a une période de…', o: ['0,04 s', '25 s', '0,25 s'], a: 0, e: 'T = 1 ÷ 25 = 0,04 s.' },
        lab: { w: 380, h: 270, alt: 'Écran d’oscilloscope : tension sinusoïdale avec sa période T et sa tension maximale', scene: scene, read: lig, sound: function (v) { return +v.f; }, inputs: [fin(false, 250), uin(false, 4)] } },
      { titre: 'Lire l’oscilloscope', labTitre: 'Deux tensions comparées', cur: 'Comment comparer deux tensions ?',
        paras: ['À l’oscilloscope : T = nombre de divisions × balayage, et U max = nombre de divisions × sensibilité.', 'Un voltmètre en mode alternatif (~) indique la tension efficace : U eff = U max ÷ √2.'],
        loi: { t: 'U eff = U max ÷ √2', s: '≈ 0,71 × U max' }, note: 'En Côte d’Ivoire, le secteur fournit 220 V efficaces à 50 Hz.',
        predis: { q: 'Le secteur donne 220 V efficaces. Sa tension maximale est…', opts: ['220 V', 'environ 311 V', 'environ 156 V'], a: 1, rep: 'U max = 220 × √2 ≈ 311 V : la tension maximale est plus grande que la tension efficace.' },
        verif: { q: 'sur l’oscilloscope (balayage 2 ms/div), une période occupe 5 divisions : T vaut…', o: ['10 ms', '2,5 ms', '7 ms'], a: 0, e: 'T = 5 × 2 = 10 ms.' },
        lab: { w: 380, h: 270, alt: 'Deux tensions sinusoïdales superposées sur l’oscilloscope', scene: scene, read: lig2, sit: [{ nom: 'A' }, { nom: 'B' }], sound: function (v) { return +v.f; }, inputs: [fin(true, [200, 400]), uin(true, [4, 2])] } }
    ],
    manches: function (LV) {
      var f = LV[0] && LV[0].f != null ? +LV[0].f : 250, T = 1000 / f;
      return [
        { type: 'calcul', q: 'Ton oscilloscope affiche f = ' + f + ' Hz. Quelle est la période T, en millisecondes ?', ans: T, tol: 0.06, unit: 'ms', e: 'T = 1 ÷ f = 1 ÷ ' + f + ' = ' + fr(1 / f, 4).replace(/0+$/, '') + ' s = ' + fr(T, T % 1 ? 1 : 0) + ' ms.' },
        { type: 'qcm', q: 'Deux tensions ont la même fréquence : U max = 4 V pour A et 2 V pour B. Laquelle a la plus grande tension efficace ?', o: ['A', 'B', 'Elles sont égales'], a: 0, e: 'U eff = U max ÷ √2 : A a la plus grande tension maximale, donc la plus grande tension efficace (≈ 2,8 V contre ≈ 1,4 V).' }
      ];
    }
  });
})();
