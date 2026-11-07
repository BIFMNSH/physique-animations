/* Livre vivant · 3e · Les forces.
   Moment essentiel : une force se représente par un vecteur : point d'application, direction, sens, valeur (en newtons). Échelle du dessin : 1 cm pour 5 N.
   Chapitre 2 : le poids P = m × g, vertical vers le bas ; g = 10 N/kg sur Terre, 1,6 N/kg sur la Lune (valeurs arrondies, cohérentes avec « Masse et poids »). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var G = { terre: 10, lune: 1.6 };
  var poids = V.lois.poidsForce = function (m, astre) { return m * G[astre]; };
  var DIR = { h: [1, 0, 'horizontale'], v: [0, -1, 'verticale'], o: [0.7071, -0.7071, 'oblique'] };
  function sceneF(c, X) {
    var P = X.P, s = X.S[0].v, d = DIR[s.dir], F = +s.F, L = F * 6, x = 120, y = 150;
    P.rect(c, x - 18, y - 18, 36, 36, P.col.ink, 2.6, '#E9DDBB'); P.circ(c, x, y, 4, P.col.ink, 1.6, P.col.ink);
    if (F > 0) P.arrow(c, x, y, x + d[0] * L * (s.sens === 'neg' ? -1 : 1), y + d[1] * L * (s.sens === 'neg' ? -1 : 1), P.col.hot, 3.4);
    P.txt(c, 'point d’application', x, y + 40, 11, P.col.soft, 'center'); P.txt(c, '1 cm pour 5 N', 300, 30, 11, P.col.soft, 'center');
    P.txt(c, 'F = ' + fr(F, 0) + ' N', 300, 60, 14, P.col.hot, 'center', 800);
  }
  function sceneP(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, m = +s.v.m, Pw = poids(m, s.v.astre), x0 = 100 + k * 190, L = Math.min(110, Pw * 4); c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0 - 20, 70, 40, 40, col, 2.6, '#E9DDBB'); P.txt(c, fr(m, 0) + ' kg', x0, 90, 11, P.col.ink, 'center', 800); P.arrow(c, x0, 110, x0, 110 + L, P.col.hot, 3.4);
      P.txt(c, 'P = ' + fr(Pw, 1) + ' N', x0 + 38, 110 + L / 2, 12, P.col.hot, 'left', 800); P.txt(c, s.v.astre === 'terre' ? 'sur la Terre' : 'sur la Lune', x0, 25, 12, col, 'center', 800); P.txt(c, s.nom, x0, 45, 11, col, 'center'); c.restore();
    });
  }
  V.add({
    slug: 'les-forces', defiTitre: 'Les forces : le défi',
    chap: [
      { titre: 'Représenter une force', labTitre: 'Un vecteur force', cur: 'Comment dessine-t-on une poussée sur une caisse ?',
        paras: ['Une force est caractérisée par son point d’application, sa direction, son sens et sa valeur en newtons (N).', 'On la représente par un vecteur : une flèche dont la longueur est proportionnelle à la valeur.'],
        loi: { t: 'Force : point d’application, direction, sens, valeur', s: 'vecteur · valeur en newtons (N)' }, note: 'Échelle : 1 cm pour 5 N. Change la valeur, la direction et le sens.',
        predis: { q: 'La valeur d’une force se mesure en…', opts: ['newtons', 'kilogrammes', 'mètres'], a: 0, rep: 'En newtons (N).' },
        verif: { q: 'avec l’échelle 1 cm pour 5 N, une force de 15 N se dessine…', o: ['3 cm', '5 cm', '15 cm'], a: 0, e: '15 ÷ 5 = 3 cm.' },
        lab: { w: 380, h: 230, alt: 'Vecteur force appliqué à une caisse', scene: sceneF, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'F', label: 'Valeur de la force', min: 0, max: 30, step: 5, val: 15, unit: 'N', dec: 0 }],
          choices: [{ id: 'dir', label: 'Direction', opts: [['h', 'Horizontale'], ['v', 'Verticale'], ['o', 'Oblique']], val: 'h' }, { id: 'sens', label: 'Sens', opts: [['pos', 'Vers le haut ou la droite'], ['neg', 'Vers le bas ou la gauche']], val: 'pos' }],
          read: function (v) { return ['<b>Force ' + DIR[v.dir][2] + ' de ' + fr(+v.F, 0) + ' N</b>', 'Flèche de ' + fr(+v.F / 5, 1) + ' cm (1 cm pour 5 N).']; }, sound: function (v) { return 150 + 8 * +v.F; } } },
      { titre: 'Le poids', labTitre: 'Terre et Lune', cur: 'Pourquoi un astronaute saute-t-il plus haut sur la Lune ?',
        paras: ['Le poids P est la force d’attraction d’un astre sur un objet : P = m × g.', 'Il est vertical, vers le bas. g = 10 N/kg sur Terre, 1,6 N/kg sur la Lune (arrondis).'],
        loi: { t: 'P = m × g', s: 'g = 10 N/kg (Terre) · 1,6 N/kg (Lune)' }, note: 'Même masse, deux astres.',
        predis: { q: 'Un objet est emporté sur la Lune. Sa masse…', opts: ['ne change pas', 'diminue', 'augmente'], a: 0, rep: 'Sa masse ne change pas ; son poids diminue.' },
        verif: { q: 'le poids de 2 kg sur Terre est…', o: ['20 N', '2 N', '12 N'], a: 0, e: '2 × 10 = 20 N.' },
        lab: { w: 380, h: 230, alt: 'Poids d’un objet sur la Terre et sur la Lune', scene: sceneP, live: false, notrace: true, sit: [{ nom: 'Terre', vars: { astre: 'terre' } }, { nom: 'Lune', vars: { astre: 'lune' } }], inputs: [{ id: 'm', label: 'Masse', min: 1, max: 10, step: 1, val: 5, unit: 'kg', dec: 0 }],
          read: function (v) { return ['P = ' + fr(+v.m, 0) + ' × ' + fr(G[v.astre], 1) + ' = ' + fr(poids(+v.m, v.astre), 1) + ' N']; }, sound: function (v) { return 150 + 5 * poids(+v.m, v.astre); } } }
    ],
    manches: function (LV) {
      var m = LV[1] && LV[1].m != null ? +LV[1].m : 5;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, un objet de ' + fr(m, 0) + ' kg. Quel est son poids sur la Terre (g = 10 N/kg) ?', ans: m * 10, tol: 0.5, unit: 'N', e: 'P = ' + fr(m, 0) + ' × 10 = ' + fr(m * 10, 0) + ' N.' },
        { type: 'qcm', q: 'Quelles sont les caractéristiques du poids ?', o: ['Verticale, vers le bas', 'Horizontale, vers la droite', 'Verticale, vers le haut'], a: 0, e: 'Le poids est vertical, vers le bas.' }
      ];
    }
  });
})();
