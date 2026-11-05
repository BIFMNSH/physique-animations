/* Livre vivant · 3e · Solutions acides et basiques.
   Moment essentiel : pH et ions : acide (plus d'ions H₃O⁺), neutre (autant), basique (plus d'ions HO⁻) ; bleu de bromothymol : jaune, vert, bleu. Comptes de particules qualitatifs.
   Chapitre 2 : dilution par 10 : le pH d'un acide augmente de 1, celui d'une base diminue de 1 (acide de départ pH 2, base de départ pH 12 : valeurs choisies). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var nature = V.lois.natureSolution = function (p) { return p < 7 ? 'acide' : p > 7 ? 'basique' : 'neutre'; };
  var dilue = V.lois.phDilue = function (p0, k) { return p0 < 7 ? Math.min(7, p0 + k) : Math.max(7, p0 - k); };
  var nions = V.lois.nbIons = function (p) { return { H3O: Math.max(1, Math.round((7 - p) * 1.3) + 1), HO: Math.max(1, Math.round((p - 7) * 1.3) + 1) }; };
  var bbt = function (p) { return p < 6 ? ['jaune', '#F4D03F'] : p > 7.6 ? ['bleu', '#3B82F6'] : ['vert', '#7DBB4A']; };
  function becher(c, P, x, y, p, col, nom) {
    var n = nions(p), i, bt = bbt(p); P.poly(c, [[x, y], [x + 6, y + 110], [x + 114, y + 110], [x + 120, y]], col, 2.6); c.fillStyle = bt[1]; c.globalAlpha *= 0.45; c.fillRect(x + 4, y + 24, 112, 84); c.globalAlpha /= 0.45;
    for (i = 0; i < n.H3O; i++) { P.circ(c, x + 14 + (i * 19) % 92, y + 38 + (i * 13) % 54, 5, P.col.b, 1.2, '#FFD6D6'); } for (i = 0; i < n.HO; i++) { P.circ(c, x + 20 + (i * 23) % 84, y + 46 + (i * 17) % 46, 5, P.col.a, 1.2, '#D6E4FF'); }
    P.txt(c, 'pH ' + fr(p, 0) + ' · ' + nature(p), x + 60, y + 128, 13, col, 'center', 800); P.txt(c, 'BBT : ' + bt[0], x + 60, y + 146, 11, P.col.soft, 'center', 800); if (nom) P.txt(c, nom, x + 60, y - 14, 12, col, 'center', 800);
  }
  function sceneS(c, X) { var P = X.P; becher(c, P, 120, 50, +X.S[0].v.p, P.col.ink, ''); P.txt(c, 'rouge : H₃O⁺ · bleu : HO⁻', 180, 24, 11, P.col.soft, 'center'); }
  function sceneD(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, p = dilue(+s.v.p0, +s.v.k); c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      becher(c, P, 35 + k * 185, 55, p, col, s.nom); c.restore();
    });
  }
  V.add({
    slug: 'solutions-acides-basiques', defiTitre: 'Les solutions acides et basiques : le défi',
    chap: [
      { titre: 'Acide, neutre, basique', labTitre: 'Les ions et le pH', cur: 'Pourquoi le jus de citron pique-t-il alors que l’eau de chaux est savonneuse ?',
        paras: ['Une solution acide contient plus d’ions H₃O⁺ que d’ions HO⁻ (pH inférieur à 7). Une solution basique, l’inverse (pH supérieur à 7).', 'Une solution neutre en contient autant (pH 7). Le bleu de bromothymol est jaune en milieu acide, vert en neutre, bleu en basique.'],
        loi: { t: 'pH < 7 : plus de H₃O⁺ · pH > 7 : plus de HO⁻', s: 'BBT : jaune · vert · bleu' }, note: 'Nombres de particules dessinés qualitativement.',
        predis: { q: 'Une solution a un pH de 3. Elle contient plus d’ions…', opts: ['H₃O⁺', 'HO⁻', 'autant des deux'], a: 0, rep: 'H₃O⁺ : solution acide.' },
        verif: { q: 'le BBT est bleu dans une solution…', o: ['basique', 'acide', 'neutre'], a: 0, e: 'Basique.' },
        lab: { w: 360, h: 260, alt: 'Bécher avec ions H₃O⁺ et HO⁻ selon le pH', scene: sceneS, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'p', label: 'pH', min: 0, max: 14, step: 1, val: 3, unit: '', dec: 0 }],
          read: function (v) { var p = +v.p; return ['<b>pH ' + fr(p, 0) + ' : solution ' + nature(p) + '</b>', 'BBT : ' + bbt(p)[0] + '.']; }, sound: function (v) { return 150 + 25 * +v.p; } } },
      { titre: 'Diluer', labTitre: 'Ajouter de l’eau', cur: 'Pourquoi un acide dilué pique-t-il moins ?',
        paras: ['Diluer une solution, c’est y ajouter de l’eau. Une dilution par 10 fait augmenter de 1 le pH d’un acide et diminuer de 1 celui d’une base.', 'Le pH se rapproche de 7 sans jamais le dépasser.'],
        loi: { t: 'Dilution ×10 : acide pH + 1 · base pH − 1', s: 'on se rapproche de 7' }, note: 'Acide de départ pH 2, base de départ pH 12 (valeurs choisies).',
        predis: { q: 'On dilue 10 fois un acide de pH 2. Son pH devient…', opts: ['3', '1', '7'], a: 0, rep: '3 : le pH augmente de 1.' },
        verif: { q: 'diluer une base fait…', o: ['diminuer son pH', 'augmenter son pH', 'ne rien changer'], a: 0, e: 'Le pH diminue et se rapproche de 7.' },
        lab: { w: 380, h: 250, alt: 'Acide et base dilués', scene: sceneD, live: false, notrace: true, sit: [{ nom: 'Acide', vars: { p0: 2 } }, { nom: 'Base', vars: { p0: 12 } }], inputs: [{ id: 'k', label: 'Dilutions par 10', min: 0, max: 3, step: 1, val: 1, unit: '', dec: 0 }],
          read: function (v) { return ['pH ' + fr(dilue(+v.p0, +v.k), 0) + ' après ' + fr(+v.k, 0) + ' dilution(s) par 10']; }, sound: function (v) { return 150 + 25 * dilue(+v.p0, +v.k); } } }
    ],
    manches: function (LV) {
      var k = LV[1] && LV[1].k != null ? +LV[1].k : 1;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, l’acide de pH 2 est dilué ' + fr(k, 0) + ' fois par 10. Quel est son pH ?', ans: dilue(2, k), tol: 0.1, unit: '', e: 'pH = 2 + ' + fr(k, 0) + ' = ' + fr(dilue(2, k), 0) + '.' },
        { type: 'qcm', q: 'Un pH de 11 correspond à une solution…', o: ['basique', 'acide', 'neutre'], a: 0, e: 'pH supérieur à 7.' }
      ];
    }
  });
})();
