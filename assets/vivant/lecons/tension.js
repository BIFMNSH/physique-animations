/* Livre vivant · 5e · Mesure de grandeurs physiques · Tension électrique.
   Moment essentiel : le voltmètre est branché en dérivation aux bornes de la lampe ; il affiche U = nombre de piles × 1,5 V.
   En série, il perturbe le circuit ; bornes inversées, il affiche une valeur négative ; interrupteur ouvert, 0 V aux bornes de la lampe mais la pile garde sa tension. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec, fr = V.fr, UP = 1.5, UN = 6;
  var f = function (x) { return fr(x, x % 1 ? 1 : 0); };
  var lect = V.lois.lectureVoltmetre = function (v) {
    var U = +v.n * UP, neg = v.sens === 'inv', ou = v.ou, ferme = v.k !== '0';
    var val = v.mont === 'ser' ? U : ou === 'lampe' ? (ferme ? U : 0) : U;
    return neg && val ? -val : val;
  };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, P = V.P, U = +v.n * UP, ser = v.mont === 'ser', sw = v.k != null, ferme = v.k !== '0', ou = v.ou || 'lampe', val = lect(v);
      var on = !ser && ferme, e = on ? V.lois.etatLampe(U, UN) : { a: 0 }, txt = (val < 0 ? '−' : '') + f(Math.abs(val)) + ' V';
      if (sw) {
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], on, X.t, X.anim); E.fil(c, [[115, 34], [180, 34], [180, 48]], on, X.t, X.anim);
        E.inter(c, 180, 48, 72, ferme); E.fil(c, [[180, 72], [180, 84], [118, 84], [118, 96]], on, X.t, X.anim);
      } else if (ser) {
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], false); E.fil(c, [[115, 34], [180, 34], [180, 47]], false);
        E.meter(c, 180, 60, 'V', P.col.a); E.fil(c, [[180, 73], [180, 84], [118, 84], [118, 96]], false);
      } else E.boucle(c, true, X.t, X.anim);
      if (!ser) {
        var bas = ou === 'pile';
        P.poly(c, bas ? [[87, 64], [82, 64], [82, 84]] : [[85, 34], [85, 64], [87, 64]], P.col.a, 2.2); P.poly(c, bas ? [[113, 64], [118, 64], [118, 84]] : [[115, 34], [115, 64], [113, 64]], P.col.a, 2.2);
        E.meter(c, 100, 64, 'V', P.col.a); P.txt(c, txt, 126, 64, 12, P.col.a, 'left', 800);
      } else P.txt(c, txt, 166, 60, 12, P.col.a, 'right', 800);
      E.lampe(c, 100, 34, e.a); E.pile(c, false, f(U) + ' V');
    });
  }
  function lig(v) {
    var U = +v.n * UP, val = lect(v), sg = (val < 0 ? '−' : '') + f(Math.abs(val)) + ' V';
    if (v.k != null) {
      var l = v.ou === 'lampe', ferme = v.k !== '0';
      return ['<b>U = ' + sg + (l ? ' aux bornes de la lampe' : ' aux bornes de la pile') + '</b>', l ? (ferme ? 'Interrupteur fermé : le courant circule, la lampe reçoit la tension de la pile.' : 'Interrupteur ouvert : pas de courant, donc pas de tension aux bornes de la lampe.') : (ferme ? 'La pile fournit sa tension au circuit.' : 'Interrupteur ouvert : la pile garde sa tension.')];
    }
    if (v.mont === 'ser') return ['<b>En série : la lampe s’éteint</b>', 'Mauvais branchement : un voltmètre se branche en dérivation, sans couper le circuit.'];
    return val < 0 ? ['<b>U = ' + sg + '</b>', 'Bornes du voltmètre inversées : la valeur est négative.'] : ['<b>U = ' + n(v) + ' × 1,5 V = ' + sg + '</b>', 'Voltmètre en dérivation aux bornes de la lampe.'];
  }
  function n(v) { return fr(+v.n, 0); }
  var nI = { id: 'n', label: 'Nombre de piles', min: 1, max: 4, step: 1, val: 3, unit: '', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, read: lig, inputs: [nI], sound: function (v) { return Math.abs(lect(v)) ? 150 + 60 * Math.abs(lect(v)) : 0; } };
  V.add({
    slug: 'tension', defiTitre: 'La tension : le défi',
    chap: [
      { titre: 'Brancher le voltmètre', labTitre: 'Mesurer la tension aux bornes de la lampe', cur: 'Comment lire « 4,5 V » sur une pile sans rien couper ?',
        paras: ['Le voltmètre mesure la tension, en volts (V). Il se branche en dérivation, aux bornes du dipôle, sans ouvrir le circuit.', 'La borne V va vers le + de la pile : si on les inverse, le voltmètre affiche une valeur négative.'],
        loi: { t: 'Voltmètre : en dérivation', s: 'tension aux bornes d’une lampe, d’une pile ou d’un interrupteur' }, note: 'Change le nombre de piles, puis essaie « En série » et « Inversées » pour voir ce qui change.',
        predis: { q: 'Pour mesurer la tension aux bornes d’une lampe, on branche le voltmètre…', opts: ['en série avec la lampe', 'en dérivation aux bornes de la lampe', 'à la place de la lampe'], a: 1, rep: 'En dérivation : on relie ses bornes à celles de la lampe, sans couper le circuit.' },
        verif: { q: 'le voltmètre affiche −4,5 V : c’est que…', o: ['la lampe est grillée', 'ses bornes sont inversées', 'la pile est vide'], a: 1, e: 'Les bornes du voltmètre sont inversées.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec une lampe et un voltmètre branché en dérivation ou en série', sit: [{ nom: '', vars: {} }], choices: [{ id: 'mont', label: 'Voltmètre', opts: [['der', 'En dérivation'], ['ser', 'En série']], val: 'der' }, { id: 'sens', label: 'Bornes', opts: [['ok', 'Bien placées'], ['inv', 'Inversées']], val: 'ok' }] }) },
      { titre: 'Pile ou lampe ?', labTitre: 'Interrupteur ouvert ou fermé', cur: 'Une pile a-t-elle une tension quand rien n’est branché ?',
        paras: ['La tension aux bornes de la pile existe même sans courant : c’est sa tension nominale.', 'Aux bornes d’une lampe, il n’y a de tension que si le circuit est fermé : interrupteur ouvert, U = 0 V.'],
        loi: { t: 'Pile : tension toujours présente', s: 'lampe : tension seulement si le circuit est fermé' }, note: 'Compare en alternance : ouvre l’interrupteur et regarde les deux voltmètres.',
        predis: { q: 'Interrupteur ouvert : que mesure un voltmètre aux bornes de la lampe ?', opts: ['la tension de la pile', '0 V', 'une valeur négative'], a: 1, rep: '0 V : pas de courant, donc pas de tension aux bornes de la lampe. La pile, elle, garde sa tension.' },
        verif: { q: 'la tension aux bornes d’une pile, interrupteur ouvert…', o: ['est nulle', 'reste présente', 'devient négative'], a: 1, e: 'La pile garde sa tension.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits avec interrupteur : voltmètre aux bornes de la pile et aux bornes de la lampe', sit: [{ nom: 'Aux bornes de la pile', vars: { ou: 'pile', mont: 'der', sens: 'ok' } }, { nom: 'Aux bornes de la lampe', vars: { ou: 'lampe', mont: 'der', sens: 'ok' } }], choices: [{ id: 'k', label: 'Interrupteur', opts: [['1', 'Fermé'], ['0', 'Ouvert']], val: '1' }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '').replace(/ aux bornes de la (lampe|pile)/, '')]; } }) }
    ],
    manches: function (LV) {
      var nn = LV[0] && LV[0].n != null ? +LV[0].n : 3;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as mis ' + nn + ' pile' + (nn > 1 ? 's' : '') + ' de 1,5 V. Quelle tension le voltmètre affiche-t-il aux bornes de la lampe (circuit fermé, bornes bien placées) ?', ans: nn * UP, tol: 0.05, unit: 'V', e: 'U = ' + nn + ' × 1,5 V = ' + f(nn * UP) + ' V.' },
        { type: 'qcm', q: 'L’interrupteur est ouvert. Aux bornes de la lampe, le voltmètre affiche…', o: ['la tension de la pile', '0 V', 'une valeur négative'], a: 1, e: 'Sans courant, il n’y a pas de tension aux bornes de la lampe.' }
      ];
    }
  });
})();
