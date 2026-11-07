/* Livre vivant · 4e · Phases de la Lune et éclipses.
   Moment essentiel : la Lune tourne autour de la Terre ; la moitié tournée vers le Soleil est éclairée, on en voit une part variable : phases.
   Chapitre 2 : éclipses : alignement Soleil – Lune – Terre (éclipse de Soleil) ou Soleil – Terre – Lune (éclipse de Lune). Durée d'une lunaison ≈ 29,5 jours : valeur arrondie ; échelles non respectées. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var NOM = ['nouvelle Lune', 'premier croissant', 'premier quartier', 'gibbeuse croissante', 'pleine Lune', 'gibbeuse décroissante', 'dernier quartier', 'dernier croissant'];
  var phase = V.lois.phaseLune = function (a) { a = ((+a % 360) + 360) % 360; return { nom: NOM[Math.round(a / 45) % 8], jour: a / 360 * 29.5 }; };
  function disque(c, P, x, y, r, a) {
    var th = a * Math.PI / 180, k = Math.cos(th), droite = Math.sin(th) >= 0;
    P.circ(c, x, y, r, P.col.ink, 2.2, '#3A3A48');
    c.save(); c.beginPath(); c.arc(x, y, r - 1, 0, 6.2832); c.clip(); c.fillStyle = '#F4EFC9'; c.beginPath(); c.arc(x, y, r, droite ? -1.5708 : 1.5708, droite ? 1.5708 : 4.7124); c.closePath(); c.fill();
    c.fillStyle = k > 0 ? '#3A3A48' : '#F4EFC9'; c.beginPath(); c.ellipse(x, y, Math.abs(k) * r, r, 0, 0, 6.2832); c.fill(); c.restore(); P.circ(c, x, y, r, P.col.ink, 2.2, null);
  }
  function scenePhase(c, X) {
    var P = X.P, a = +X.S[0].v.a, cx = 160, cy = 130, R = 70, th = a * Math.PI / 180, mx = cx - R * Math.cos(th), my = cy - R * Math.sin(th), i;
    P.circ(c, 30, cy, 18, P.col.ink, 2.4, '#FFE066'); P.txt(c, 'Soleil', 30, cy + 32, 11, P.col.ink, 'center', 800);
    for (i = -1; i <= 1; i++) P.arrow(c, 56, cy + i * 40, 90, cy + i * 40, '#D4A017', 2);
    P.circ(c, cx, cy, 14, P.col.ink, 2.4, '#8CC8FF'); P.txt(c, 'Terre', cx, cy + 28, 11, P.col.ink, 'center', 800);
    c.save(); c.setLineDash([3, 4]); P.circ(c, cx, cy, R, P.col.soft, 1.2, null); c.restore();
    P.circ(c, mx, my, 8, P.col.ink, 2, '#D9D4C5'); c.save(); c.beginPath(); c.arc(mx, my, 7, 0, 6.2832); c.clip(); c.fillStyle = '#3A3A48'; c.fillRect(mx, my - 8, 8, 16); c.restore();
    disque(c, P, 300, 110, 34, a); P.txt(c, 'vue depuis la Terre', 300, 160, 11, P.col.soft, 'center'); P.txt(c, phase(a).nom, 300, 175, 13, P.col.ink, 'center', 800);
  }
  var ALI = { soleil: 'Éclipse de Soleil : la Lune cache le Soleil', lune: 'Éclipse de Lune : la Terre cache la lumière du Soleil', aucun: 'Pas d’éclipse : pas d’alignement' };
  function sceneEcl(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var p = s.v.pos, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 10 + k * 190, y = 120; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      var sx = x0 + 15, tx = x0 + 105, mx = p === 'soleil' ? x0 + 60 : p === 'lune' ? x0 + 155 : x0 + 70, my = p === 'aucun' ? y - 45 : y;
      P.circ(c, sx, y, 14, col, 2.4, '#FFE066'); P.circ(c, tx, y, 12, col, 2.4, '#8CC8FF'); P.circ(c, mx, my, 7, col, 2, '#D9D4C5');
      P.txt(c, 'S', sx, y + 26, 11, col, 'center', 800); P.txt(c, 'T', tx, y + 26, 11, col, 'center', 800); P.txt(c, 'L', mx, my + 18, 11, col, 'center', 800);
      if (p === 'soleil') P.poly(c, [[mx + 7, y - 7], [tx - 3, y - 2], [tx - 3, y + 2], [mx + 7, y + 7]], P.col.soft, 1.4, 'rgba(60,60,60,.35)');
      if (p === 'lune') P.poly(c, [[tx + 12, y - 12], [mx - 7, y - 5], [mx - 7, y + 5], [tx + 12, y + 12]], P.col.soft, 1.4, 'rgba(60,60,60,.35)');
      P.txt(c, s.nom, x0 + 90, 20, 12, col, 'center', 800); P.txt(c, ALI[p].split(':')[0], x0 + 90, 190, 11, p === 'aucun' ? P.col.soft : P.col.hot, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'phases-eclipses', defiTitre: 'Les phases de la Lune et les éclipses : le défi',
    chap: [
      { titre: 'Les phases de la Lune', labTitre: 'La Lune autour de la Terre', cur: 'Pourquoi la Lune change-t-elle de forme au fil du mois ?',
        paras: ['La Lune ne produit pas de lumière : elle renvoie celle du Soleil. Sa moitié tournée vers le Soleil est éclairée.', 'Selon sa position autour de la Terre, nous voyons une partie différente de cette moitié : ce sont les phases.'],
        loi: { t: 'Phases : partie éclairée vue de la Terre', s: 'la moitié tournée vers le Soleil est toujours éclairée' }, note: 'Fais tourner la Lune. Échelles non respectées. Un tour dure environ 29,5 jours.',
        predis: { q: 'La Lune est entre le Soleil et la Terre. On voit…', opts: ['la nouvelle Lune', 'la pleine Lune', 'un quartier'], a: 0, rep: 'La face éclairée est de l’autre côté : nouvelle Lune.' },
        verif: { q: 'la Lune est éclairée par…', o: ['le Soleil', 'la Terre', 'elle-même'], a: 0, e: 'Le Soleil.' },
        lab: { w: 380, h: 240, alt: 'La Lune sur son orbite et sa phase vue de la Terre', scene: scenePhase, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'a', label: 'Position de la Lune', min: 0, max: 315, step: 45, val: 90, unit: '°', dec: 0 }],
          read: function (v) { var p = phase(+v.a); return ['<b>' + p.nom + '</b>', 'Environ ' + fr(p.jour, 0) + ' jours après la nouvelle Lune.']; }, sound: function (v) { return 200 + 1 * +v.a; } } },
      { titre: 'Les éclipses', labTitre: 'Soleil, Lune, Terre alignés', cur: 'Pourquoi n’y a-t-il pas d’éclipse à chaque nouvelle Lune ?',
        paras: ['Éclipse de Soleil : la Lune est entre le Soleil et la Terre, parfaitement alignés.', 'Éclipse de Lune : la Terre est entre le Soleil et la Lune. Sans alignement, pas d’éclipse.'],
        loi: { t: 'Éclipse : Soleil, Lune et Terre alignés', s: 'Soleil : Lune au milieu · Lune : Terre au milieu' }, note: 'Choisis la position de la Lune.',
        predis: { q: 'Quand la Lune passe devant le Soleil, c’est…', opts: ['une éclipse de Soleil', 'une éclipse de Lune', 'la pleine Lune'], a: 0, rep: 'Une éclipse de Soleil.' },
        verif: { q: 'pour une éclipse de Lune, au milieu il y a…', o: ['la Terre', 'la Lune', 'le Soleil'], a: 0, e: 'La Terre fait de l’ombre à la Lune.' },
        lab: { w: 380, h: 240, alt: 'Alignements Soleil, Lune, Terre', scene: sceneEcl, live: false, notrace: true, sit: [{ nom: 'Situation A', vars: {} }, { nom: 'Situation B', vars: {} }], choices: [{ id: 'pos', label: 'Lune', opts: [['aucun', 'Hors alignement'], ['soleil', 'Entre Soleil et Terre'], ['lune', 'Derrière la Terre']], val: 'aucun', per: true }],
          read: function (v) { return [ALI[v.pos]]; }, sound: function (v) { return v.pos === 'aucun' ? 200 : 400; } } }
    ],
    manches: function (LV) {
      var a = LV[0] && LV[0].a != null ? +LV[0].a : 90, p = phase(a);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as placé la Lune à ' + fr(a, 0) + ' °. Quelle phase vois-tu ?', o: [p.nom, 'nouvelle Lune', 'pleine Lune'].filter(function (x, i, t) { return t.indexOf(x) === i; }), a: 0, e: 'Phase : ' + p.nom + '.' },
        { type: 'qcm', q: 'Éclipse de Soleil : l’ordre des astres est…', o: ['Soleil – Lune – Terre', 'Soleil – Terre – Lune', 'Lune – Soleil – Terre'], a: 0, e: 'La Lune est entre les deux.' }
      ];
    }
  });
})();
