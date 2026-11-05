/* Livre vivant · 4e · Qualité de l'eau.
   Moment essentiel : lire un test : le pH d'une eau (bandelette) et un test aux ions chlorure (nitrate d'argent : précipité blanc).
   Plage de pH « acceptable » 6,5 à 8,5 : repère indicatif de conception, à confronter à la source officielle. Qualitatif pour les ions. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var nature = V.lois.naturePH = function (p) { return p < 7 ? 'acide' : p > 7 ? 'basique' : 'neutre'; };
  var dansPlage = V.lois.phAcceptable = function (p) { return p >= 6.5 && p <= 8.5; };
  var CH = { distillee: [false, 'eau distillée'], salee: [true, 'eau salée'], robinet: [false, 'eau du robinet (peu d’ions chlorure)'] };
  var COL = ['#E23B3B', '#E8602C', '#F28C28', '#F4D03F', '#C8D93F', '#7DBB4A', '#3F9B5A', '#2E9D8A', '#2F86B8', '#3B5BDB', '#5B48C8', '#7A3FB5', '#8E3A9E', '#9B2E8A', '#6B1F6B'];
  function sceneP(c, X) {
    var P = X.P, p = +X.S[0].v.p, i, w = 20, x0 = 40, y = 130;
    for (i = 0; i < 15; i++) { P.rect(c, x0 + i * w, y, w - 1, 36, null, 0, COL[i]); P.txt(c, String(i), x0 + i * w + w / 2 - 0.5, y + 50, 10, P.col.soft, 'center'); }
    var px = x0 + p * w + w / 2; P.arrow(c, px, y - 30, px, y - 4, P.col.ink, 2.6); P.rect(c, x0 + 6.5 * w, y - 10, 2 * w, 6, P.col.ok, 1, P.col.ok);
    P.txt(c, 'pH ' + fr(p, 1) + ' : ' + nature(p), 180, 34, 14, P.col.ink, 'center', 800); P.txt(c, dansPlage(p) ? '✓ dans la plage acceptable' : '⚠ hors de la plage acceptable', 180, 100, 12, dansPlage(p) ? P.col.ok : P.col.hot, 'center', 800);
    P.txt(c, 'plage acceptable 6,5 – 8,5', 180, 230, 11, P.col.ok, 'center', 800);
  }
  function sceneCl(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var d = CH[s.v.eau], col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 40 + k * 175; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.poly(c, [[x0, 60], [x0, 170], [x0 + 80, 170], [x0 + 80, 60]], col, 2.6); c.fillStyle = d[0] ? 'rgba(240,240,240,.95)' : 'rgba(190,220,240,.45)'; c.fillRect(x0 + 2, 100, 76, 68);
      P.txt(c, d[0] ? 'précipité blanc' : 'rien', x0 + 40, 190, 12, d[0] ? P.col.hot : P.col.ok, 'center', 800); P.txt(c, s.nom, x0 + 40, 24, 12, col, 'center', 800); P.txt(c, 'AgNO₃ ajouté', x0 + 40, 44, 10, P.col.soft, 'center'); c.restore();
    });
  }
  V.add({
    slug: 'qualite-eau', defiTitre: 'La qualité de l’eau : le défi',
    chap: [
      { titre: 'Le pH', labTitre: 'Lire une bandelette', cur: 'Comment sait-on si l’eau d’un puits est acide ou basique ?',
        paras: ['Le pH mesure l’acidité d’une eau : acide sous 7, neutre à 7, basique au-dessus.', 'Une eau potable a un pH proche de la neutralité, ici entre 6,5 et 8,5 (repère indicatif).'],
        loi: { t: 'pH < 7 acide · 7 neutre · > 7 basique', s: 'eau acceptable : pH 6,5 à 8,5 (repère indicatif)' }, note: 'Déplace le pH et regarde la couleur de la bandelette.',
        predis: { q: 'Une eau a un pH de 4. Elle est…', opts: ['acide', 'neutre', 'basique'], a: 0, rep: 'Acide : pH inférieur à 7.' },
        verif: { q: 'l’eau pure a un pH…', o: ['proche de 7', 'proche de 1', 'proche de 14'], a: 0, e: 'Neutre, proche de 7.' },
        lab: { w: 360, h: 250, alt: 'Échelle de couleurs du pH avec une flèche', scene: sceneP, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'p', label: 'pH', min: 0, max: 14, step: 0.5, val: 7, unit: '', dec: 1 }],
          read: function (v) { var p = +v.p; return ['<b>pH ' + fr(p, 1) + ' : eau ' + nature(p) + '</b>', dansPlage(p) ? 'Dans la plage acceptable.' : 'Hors de la plage acceptable.']; }, sound: function (v) { return 150 + 25 * +v.p; } } },
      { titre: 'Les ions chlorure', labTitre: 'Test au nitrate d’argent', cur: 'Comment prouver qu’une eau contient du sel ?',
        paras: ['Le nitrate d’argent forme un précipité blanc avec les ions chlorure.', 'Une eau distillée ne donne rien ; une eau salée donne un précipité blanc.'],
        loi: { t: 'Ions chlorure : précipité blanc', s: 'test au nitrate d’argent' }, note: 'Manipulation guidée par le professeur. Compare deux eaux.',
        predis: { q: 'Le test avec le nitrate d’argent donne un précipité blanc. L’eau contient…', opts: ['des ions chlorure', 'des ions cuivre', 'rien'], a: 0, rep: 'Des ions chlorure.' },
        verif: { q: 'l’eau distillée donne…', o: ['aucun précipité', 'un précipité blanc', 'un précipité bleu'], a: 0, e: 'Elle ne contient pas d’ions chlorure.' },
        lab: { w: 380, h: 230, alt: 'Deux tubes testés au nitrate d’argent', scene: sceneCl, live: false, notrace: true, sit: [{ nom: 'Eau A', vars: {} }, { nom: 'Eau B', vars: {} }], choices: [{ id: 'eau', label: 'Eau', opts: [['distillee', 'Distillée'], ['salee', 'Salée'], ['robinet', 'Robinet']], val: 'distillee', per: true }],
          read: function (v) { return [CH[v.eau][1] + (CH[v.eau][0] ? ' : précipité blanc, ions chlorure' : ' : pas de précipité')]; }, sound: function (v) { return CH[v.eau][0] ? 420 : 200; } } }
    ],
    manches: function (LV) {
      var p = LV[0] && LV[0].p != null ? +LV[0].p : 7;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé un pH de ' + fr(p, 1) + '. L’eau est…', o: ['acide', 'neutre', 'basique'], a: ['acide', 'neutre', 'basique'].indexOf(nature(p)), e: 'pH ' + fr(p, 1) + ' : ' + nature(p) + '.' },
        { type: 'qcm', q: 'Un précipité blanc avec le nitrate d’argent montre la présence…', o: ['d’ions chlorure', 'd’ions fer', 'de dioxygène'], a: 0, e: 'Ions chlorure.' }
      ];
    }
  });
})();
