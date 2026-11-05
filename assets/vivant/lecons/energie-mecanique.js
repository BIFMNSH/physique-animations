/* Livre vivant · 3e · Énergie mécanique.
   Moment essentiel : une bille de 2 kg lâchée de 5 m ; en chute sans frottement, l'énergie potentielle Ep = m g h se transforme en énergie cinétique Ec ; l'énergie mécanique Em = Ec + Ep reste constante (100 J).
   Chapitre 2 : Ec = ½ m v². g = 10 N/kg. Programme à confronter : niveau et notations (Ec, Ep, Em) à confirmer. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, M = 2, H0 = 5, G = 10;
  var ep = V.lois.energiePot = function (m, h) { return m * G * h; };
  var ec = V.lois.energieCin = function (m, v) { return 0.5 * m * v * v; };
  var EM = M * G * H0;
  function barre(c, P, x, y, w, val, max, col, nom) { P.rect(c, x, y, w, 16, P.col.ink, 1.6, P.col.paper); c.fillStyle = col; c.fillRect(x + 1, y + 1, Math.max(0, (w - 2) * val / max), 14); P.txt(c, nom + ' = ' + fr(val, 0) + ' J', x + w + 8, y + 8, 11, P.col.ink, 'left', 800); }
  function sceneChute(c, X) {
    var P = X.P, h = +X.S[0].v.h, e = ep(M, h), k = EM - e, y = 190 - h * 28;
    P.line(c, 30, 195, 150, 195, P.col.ink, 2.6); P.line(c, 90, 50, 90, 195, P.col.soft, 1.2); P.circ(c, 90, y, 12, P.col.ink, 2.4, '#E8A0A0'); P.txt(c, 'h = ' + fr(h, 1) + ' m', 130, y, 11, P.col.ink, 'left', 800);
    barre(c, P, 190, 60, 90, e, EM, '#3B82F6', 'Ep'); barre(c, P, 190, 100, 90, k, EM, '#E23B3B', 'Ec'); barre(c, P, 190, 140, 90, EM, EM, '#7DBB4A', 'Em');
    P.txt(c, 'Em = Ec + Ep reste constante', 260, 185, 11, P.col.ok, 'center', 800);
  }
  function sceneEc(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var m = +s.v.m, v = +s.v.v, E = ec(m, v), col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 95 + k * 190; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0, 100, 10 + 4 * m, col, 2.4, '#E9DDBB'); P.arrow(c, x0 + 20, 100, x0 + 20 + v * 4, 100, P.col.hot, 3); P.txt(c, 'm = ' + fr(m, 0) + ' kg · v = ' + fr(v, 0) + ' m/s', x0, 40, 11, col, 'center', 800);
      P.txt(c, 'Ec = ' + fr(E, 0) + ' J', x0, 170, 15, P.col.hot, 'center', 800); P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'energie-mecanique', defiTitre: 'L’énergie mécanique : le défi',
    chap: [
      { titre: 'Chute sans frottement', labTitre: 'Une bille qui tombe', cur: 'Pourquoi une bille lâchée de plus haut arrive-t-elle plus vite ?',
        paras: ['L’énergie potentielle de position est Ep = m × g × h. L’énergie cinétique est celle du mouvement.', 'Sans frottement, l’énergie mécanique Em = Ec + Ep reste constante : Ep diminue, Ec augmente.'],
        loi: { t: 'Em = Ec + Ep · Ep = m × g × h', s: 'Em constante sans frottement' }, note: 'Bille de 2 kg lâchée de 5 m (Em = 100 J). Fais descendre la bille. g = 10 N/kg.',
        predis: { q: 'La bille descend sans frottement. Son énergie cinétique…', opts: ['augmente', 'diminue', 'reste constante'], a: 0, rep: 'Elle augmente : Ep se transforme en Ec.' },
        verif: { q: 'sans frottement, Em est…', o: ['constante', 'croissante', 'nulle'], a: 0, e: 'Constante.' },
        lab: { w: 380, h: 240, alt: 'Bille qui tombe avec barres d’énergie', scene: sceneChute, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'h', label: 'Hauteur', min: 0, max: 5, step: 0.5, val: 5, unit: 'm', dec: 1 }],
          read: function (v) { var e = ep(M, +v.h); return ['<b>Ep = ' + fr(e, 0) + ' J · Ec = ' + fr(EM - e, 0) + ' J</b>', 'Em = ' + fr(EM, 0) + ' J (constante)']; }, sound: function (v) { return 150 + 5 * (EM - ep(M, +v.h)); } } },
      { titre: 'L’énergie cinétique', labTitre: 'Masse et vitesse', cur: 'Pourquoi un camion lancé est-il plus dangereux qu’un vélo à la même vitesse ?',
        paras: ['L’énergie cinétique d’un objet de masse m et de vitesse v est Ec = ½ × m × v².', 'Elle augmente avec la masse, et beaucoup plus vite avec la vitesse.'],
        loi: { t: 'Ec = ½ × m × v²', s: 'en joules (J) · m en kg · v en m/s' }, note: 'Compare deux masses à la même vitesse.',
        predis: { q: 'On double la vitesse. L’énergie cinétique est multipliée par…', opts: ['4', '2', '8'], a: 0, rep: 'Par 4 : v est au carré.' },
        verif: { q: 'm = 2 kg, v = 5 m/s : Ec =', o: ['25 J', '10 J', '50 J'], a: 0, e: '½ × 2 × 25 = 25 J.' },
        lab: { w: 380, h: 220, alt: 'Deux objets de masses différentes à la même vitesse', scene: sceneEc, live: false, notrace: true, sit: [{ nom: 'Vélo', vars: { m: 2 } }, { nom: 'Camion', vars: { m: 8 } }], inputs: [{ id: 'v', label: 'Vitesse', min: 0, max: 10, step: 1, val: 5, unit: 'm/s', dec: 0 }],
          read: function (v) { return ['Ec = ½ × ' + fr(+v.m, 0) + ' × ' + fr(+v.v, 0) + '² = ' + fr(ec(+v.m, +v.v), 0) + ' J']; }, sound: function (v) { return 150 + 2 * ec(+v.m, +v.v); } } }
    ],
    manches: function (LV) {
      var h = LV[0] && LV[0].h != null ? +LV[0].h : 5, v = LV[1] && LV[1].v != null ? +LV[1].v : 5;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, la bille de 2 kg est à ' + fr(h, 1) + ' m. Quelle est son énergie potentielle, en J (g = 10 N/kg) ?', ans: ep(M, h), tol: 0.5, unit: 'J', e: 'Ep = 2 × 10 × ' + fr(h, 1) + ' = ' + fr(ep(M, h), 0) + ' J.' },
        { type: 'calcul', q: 'Un objet de 2 kg avance à ' + fr(v, 0) + ' m/s. Quelle est son énergie cinétique, en J ?', ans: ec(2, v), tol: 0.5, unit: 'J', e: 'Ec = ½ × 2 × ' + fr(v, 0) + '² = ' + fr(ec(2, v), 0) + ' J.' }
      ];
    }
  });
})();
