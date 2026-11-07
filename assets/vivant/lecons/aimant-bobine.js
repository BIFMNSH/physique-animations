/* Livre vivant · 4e · Aimant et bobine.
   Moment essentiel : on déplace un aimant près d'une bobine reliée à un voltmètre ; une tension apparaît seulement pendant le mouvement, son signe change avec le sens.
   Chapitre 2 : le pôle (nord/sud) tourné vers la bobine inverse le signe. Qualitatif : valeurs en unités arbitraires, pas de loi chiffrée. */
(function () {
  'use strict';
  var V = window.Vivant;
  var tens = V.lois.tensionInduite = function (v, pole) { return (pole === 'S' ? -1 : 1) * (+v); };
  function bobine(c, P, x, y, col) { for (var i = 0; i < 6; i++) { P.circ(c, x + i * 9, y, 18, col, 2, null); } }
  function aiguille(c, P, x, y, u, col) {
    P.circ(c, x, y, 28, col, 2.4, P.col.paper); P.line(c, x, y, x + Math.max(-1, Math.min(1, u / 5)) * 22, y - 16, P.col.hot, 2.6); P.circ(c, x, y, 3, P.col.ink, 1.4, P.col.ink); P.txt(c, 'V', x, y + 20, 11, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, v = +s.v.v, pole = s.v.pole || 'N', u = tens(v, pole), x0 = two ? 15 + k * 185 : 70, oy = two ? 100 : 120, mx = x0 + 10 - Math.sign(v) * Math.min(Math.abs(v), 5) * 3; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      bobine(c, P, x0 + 70, oy, col); P.rect(c, mx, oy - 12, 50, 24, P.col.ink, 2.4, P.col.fill);
      P.rect(c, mx + 25, oy - 12, 25, 24, P.col.ink, 2.4, pole === 'N' ? '#E8A0A0' : '#A0B8E8'); P.rect(c, mx, oy - 12, 25, 24, P.col.ink, 2.4, pole === 'N' ? '#A0B8E8' : '#E8A0A0');
      P.txt(c, pole === 'N' ? 'S N' : 'N S', mx + 25, oy, 12, P.col.ink, 'center', 800);
      if (v !== 0) P.arrow(c, mx + 8, oy - 24, mx + 8 + Math.sign(v) * 30, oy - 24, P.col.ok, 2.2);
      aiguille(c, P, x0 + 85, oy + 70, u, col); P.txt(c, u === 0 ? 'U = 0' : 'U ' + (u > 0 ? '> 0' : '< 0'), x0 + 85, oy + 112, 12, u === 0 ? P.col.soft : P.col.hot, 'center', 800); if (two) P.txt(c, s.nom, x0 + 85, 14, 12, col, 'center', 800); c.restore();
    });
  }
  function lig(v) { var u = tens(+v.v, v.pole || 'N'); return u === 0 ? ['<b>Aimant immobile : aucune tension</b>'] : ['<b>Aimant en mouvement : tension ' + (u > 0 ? 'positive' : 'négative') + '</b>', 'Plus il va vite, plus la tension est grande.']; }
  var inp = { id: 'v', label: 'Mouvement de l’aimant', min: -5, max: 5, step: 1, val: 0, unit: '', dec: 0 };
  V.add({
    slug: 'aimant-bobine', defiTitre: 'L’aimant et la bobine : le défi',
    chap: [
      { titre: 'Une tension qui apparaît', labTitre: 'Déplacer l’aimant', cur: 'Comment fait la dynamo d’un vélo pour allumer la lampe ?',
        paras: ['Quand on déplace un aimant près d’une bobine, une tension apparaît aux bornes de la bobine.', 'Si l’aimant est immobile, il n’y a pas de tension. Si on inverse le sens du mouvement, le signe de la tension s’inverse.'],
        loi: { t: 'Aimant en mouvement : tension aux bornes de la bobine', s: 'aimant immobile : pas de tension' }, note: 'Curseur vers la droite : l’aimant avance ; vers la gauche : il recule. Unités arbitraires.',
        predis: { q: 'L’aimant est immobile près de la bobine. Le voltmètre indique…', opts: ['0', 'une tension positive', 'une tension négative'], a: 0, rep: '0 : il faut un mouvement.' },
        verif: { q: 'on inverse le sens du mouvement : le signe de la tension…', o: ['s’inverse', 'reste le même', 'devient nul'], a: 0, e: 'Il s’inverse.' },
        lab: { w: 380, h: 240, alt: 'Aimant déplacé près d’une bobine reliée à un voltmètre', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: { pole: 'N' } }], inputs: [inp], read: lig, sound: function (v) { return 220 + 40 * Math.abs(+v.v); } } },
      { titre: 'Pôle nord, pôle sud', labTitre: 'Inverser l’aimant', cur: 'Que change-t-on en retournant l’aimant ?',
        paras: ['Quand on retourne l’aimant, le pôle tourné vers la bobine change : le signe de la tension s’inverse.', 'Le sens de déplacement et le pôle jouent chacun sur le signe.'],
        loi: { t: 'Changer de pôle : signe inversé', s: 'même mouvement, tension opposée' }, note: 'Même mouvement pour les deux : compare les signes.',
        predis: { q: 'On retourne l’aimant, sans changer le mouvement. La tension…', opts: ['change de signe', 'garde le signe', 'devient nulle'], a: 0, rep: 'Elle change de signe.' },
        verif: { q: 'la bobine ne détecte pas…', o: ['un aimant immobile', 'un aimant qui bouge', 'un aimant retourné'], a: 0, e: 'Il faut un mouvement.' },
        lab: { w: 380, h: 240, alt: 'Deux aimants face à une bobine, pôle nord et pôle sud', scene: scene, live: false, notrace: true, sit: [{ nom: 'Pôle nord', vars: { pole: 'N' } }, { nom: 'Pôle sud', vars: { pole: 'S' } }], inputs: [Object.assign({}, inp, { val: 3 })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sound: function (v) { return 220 + 40 * Math.abs(+v.v); } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, l’aimant ne bouge pas. Que lit-on sur le voltmètre ?', o: ['0 V', 'une tension positive', 'une tension négative'], a: 0, e: 'Pas de mouvement, pas de tension.' },
        { type: 'qcm', q: 'Kofi retourne l’aimant et le déplace pareil. La tension…', o: ['change de signe', 'ne change pas', 'disparaît'], a: 0, e: 'Le pôle change : le signe s’inverse.' }
      ];
    }
  });
})();
