/* Livre vivant · 5e · Mesure de grandeurs physiques · Intensité du courant électrique.
   Moment essentiel : l'ampèremètre, en série, affiche la même intensité où qu'on le place dans la boucle (lampe 6 V : 0,10 A = 100 mA).
   Chapitre 2 : en dérivation, I = I₁ + I₂ (0,15 A + 0,10 A = 0,25 A). Valeurs prises dans les leçons Studio ; un ampèremètre mal branché en dérivation court-circuite la lampe. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec, fr = V.fr, I0 = 0.10, I1 = 0.15, I2 = 0.10;
  var f2 = function (x) { return fr(x, 2); };
  var nodes = V.lois.noeud = function (l2) { return I1 + (+l2 === 0 ? 0 : I2); };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, P = V.P;
      if (v.mes) {
        var l2 = +v.l2 !== 0, mes = v.mes, val = mes === 'I1' ? I1 : mes === 'I2' ? (l2 ? I2 : 0) : nodes(v.l2), t = f2(val) + ' A';
        var pos = mes === 'I1' ? [50, 28] : mes === 'I2' ? [50, 62] : [50, 84];
        E.fil(c, mes === 'I' ? [[82, 96], [82, 84], [63, 84]] : [[82, 96], [82, 84], [20, 84], [20, 62]], true, X.t, X.anim);
        if (mes === 'I') E.fil(c, [[37, 84], [20, 84], [20, 62]], true, X.t, X.anim);
        if (mes === 'I') E.meter(c, 50, 84, 'A', P.col.b);
        E.fil(c, [[20, 62], [20, 28]], true, X.t, X.anim);
        [[28, 'I1', true], [62, 'I2', l2]].forEach(function (r) {
          var y = r[0], on = r[2], here = mes === r[1];
          if (here) { E.fil(c, [[20, y], [37, y]], on, X.t, X.anim); E.meter(c, 50, y, 'A', P.col.b); E.fil(c, [[63, y], [87, y]], on, X.t, X.anim); } else E.fil(c, [[20, y], [87, y]], on, X.t, X.anim);
          E.fil(c, [[113, y], [180, y]], on, X.t, X.anim);
        });
        E.fil(c, [[180, 28], [180, 62]], true, X.t, X.anim); E.fil(c, [[180, 62], [180, 84], [118, 84], [118, 96]], true, X.t, X.anim);
        E.lampe(c, 100, 28, 1, false, 12); E.lampe(c, 100, 62, l2 ? 1 : 0, false, 12); E.pile(c, false, '6 V');
        P.txt(c, 'L1 ' + f2(I1) + ' A', 150, 14, 10, P.col.soft, 'center'); P.txt(c, l2 ? 'L2 ' + f2(I2) + ' A' : 'L2 dévissée', 150, 78, 10, l2 ? P.col.soft : P.col.hot, 'center');
        P.txt(c, t, mes === 'I' ? 36 : pos[0] + 1, mes === 'I' ? 102 : pos[1] - 16, 11, P.col.b, 'center', 800);
      } else {
        var p = v.pos, der = p === 'der', txt = der ? 'trop fort !' : f2(I0) + ' A';
        if (der) {
          E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], true, X.t, X.anim, true); E.fil(c, [[115, 34], [180, 34], [180, 84], [118, 84], [118, 96]], true, X.t, X.anim, true);
          P.poly(c, [[85, 34], [85, 64], [87, 64]], P.col.b, 2.2); P.poly(c, [[115, 34], [115, 64], [113, 64]], P.col.b, 2.2); E.meter(c, 100, 64, 'A', P.col.b); P.txt(c, txt, 126, 64, 12, P.col.hot, 'left', 800);
        } else if (p === 'plus') {
          E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 73]], true, X.t, X.anim); E.meter(c, 20, 60, 'A', P.col.b); E.fil(c, [[20, 47], [20, 34], [85, 34]], true, X.t, X.anim); E.fil(c, [[115, 34], [180, 34], [180, 84], [118, 84], [118, 96]], true, X.t, X.anim); P.txt(c, txt, 36, 60, 12, P.col.b, 'left', 800);
        } else {
          E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], true, X.t, X.anim); E.fil(c, [[115, 34], [180, 34], [180, 47]], true, X.t, X.anim); E.meter(c, 180, 60, 'A', P.col.b); E.fil(c, [[180, 73], [180, 84], [118, 84], [118, 96]], true, X.t, X.anim); P.txt(c, txt, 164, 60, 12, P.col.b, 'right', 800);
        }
        E.lampe(c, 100, 34, der ? 0 : 1); E.pile(c, false, '6 V');
      }
    });
  }
  function lig(v) {
    if (v.mes) {
      var l2 = +v.l2 !== 0;
      if (v.mes === 'I1') return ['<b>I₁ = ' + f2(I1) + ' A</b>', 'Intensité dans la branche de L1.'];
      if (v.mes === 'I2') return l2 ? ['<b>I₂ = ' + f2(I2) + ' A</b>', 'Intensité dans la branche de L2.'] : ['<b>L2 dévissée : I₂ = 0 A</b>'];
      return l2 ? ['<b>I = I₁ + I₂ = ' + f2(I1) + ' A + ' + f2(I2) + ' A = ' + f2(nodes(1)) + ' A</b>', 'Dans la branche principale, les courants des branches s’additionnent.'] : ['<b>L2 dévissée : I = I₁ = ' + f2(I1) + ' A</b>', 'La branche de L1 n’est pas modifiée.'];
    }
    if (v.pos === 'der') return ['<b>Ampèremètre en dérivation : la lampe est court-circuitée</b>', 'Lecture beaucoup trop forte : danger pour l’appareil. Un ampèremètre se branche en série.'];
    return ['<b>I = ' + f2(I0) + ' A = ' + fr(I0 * 1000, 0) + ' mA</b>', 'En série, la même valeur partout dans la boucle (1 A = 1 000 mA).'];
  }
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, read: lig, sound: function (v) { return v.mes ? 200 + 400 * (v.mes === 'I1' ? I1 : v.mes === 'I2' ? I2 : nodes(v.l2)) : (v.pos === 'der' ? 120 : 200 + 400 * I0); } };
  V.add({
    slug: 'intensite', defiTitre: 'L’intensité : le défi',
    chap: [
      { titre: 'Ampèremètre en série', labTitre: 'Où placer l’ampèremètre ?', cur: 'Si on place l’ampèremètre avant ou après la lampe, lit-on la même chose ?',
        paras: ['L’intensité du courant se mesure avec un ampèremètre, en ampères (A) ou en milliampères (mA). Il se branche en série, dans la boucle.', 'Dans un circuit en série, l’intensité est la même en tout point de la boucle.'],
        loi: { t: 'Ampèremètre : en série', s: 'en série, l’intensité est la même partout · 1 A = 1 000 mA' }, note: 'Déplace l’ampèremètre côté + puis côté − : la lecture ne change pas. En dérivation, c’est un court-circuit !',
        predis: { q: 'On déplace l’ampèremètre de l’autre côté de la lampe, dans la même boucle. La valeur lue…', opts: ['augmente', 'diminue', 'ne change pas'], a: 2, rep: 'Elle ne change pas : en série, le même courant traverse tous les éléments de la boucle.' },
        verif: { q: 'un ampèremètre se branche…', o: ['en dérivation', 'en série', 'aux bornes de la pile'], a: 1, e: 'Il doit être traversé par le courant : en série.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec un ampèremètre que l’on place avant la lampe, après la lampe ou en dérivation', sit: [{ nom: '', vars: {} }], choices: [{ id: 'pos', label: 'Ampèremètre', opts: [['plus', 'Côté +'], ['moins', 'Côté −'], ['der', 'En dérivation (mal)']], val: 'plus' }] }) },
      { titre: 'En dérivation', labTitre: 'Mesurer I₁ et I principale', cur: 'Pourquoi le fusible de la maison supporte-t-il plus que chaque lampe ?',
        paras: ['Dans un circuit en dérivation, l’intensité dans la branche principale est la somme des intensités dans les branches : I = I₁ + I₂.', 'Dévisser une lampe ne change pas le courant dans l’autre branche.'],
        loi: { t: 'I = I₁ + I₂', s: 'additivité des intensités en dérivation' }, note: 'Compare en alternance : branche L1 et branche principale. Dévisse L2 et regarde.',
        predis: { q: 'En dérivation, I₁ = 0,15 A et I₂ = 0,10 A. L’intensité principale vaut…', opts: ['0,05 A', '0,15 A', '0,25 A'], a: 2, rep: 'I = I₁ + I₂ = 0,15 + 0,10 = 0,25 A.' },
        verif: { q: 'on dévisse L2 : le courant dans la branche de L1…', o: ['change', 'ne change pas', 'devient nul'], a: 1, e: 'Les branches sont indépendantes.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits en dérivation : ampèremètre dans la branche de L1, puis dans la branche principale', sit: [{ nom: 'Branche L1', vars: { mes: 'I1' } }, { nom: 'Branche principale', vars: { mes: 'I' } }], choices: [{ id: 'l2', label: 'Lampe L2', opts: [['1', 'Vissée'], ['0', 'Dévissée']], val: '1' }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l2 = LV[1] && LV[1].l2 != null ? +LV[1].l2 : 1, I = nodes(l2);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as déplacé l’ampèremètre dans la boucle en série. Comparée à l’autre côté de la lampe, la valeur lue (0,10 A) est…', o: ['la même', 'plus grande', 'plus petite'], a: 0, e: 'En série, l’intensité est la même partout dans la boucle.' },
        { type: 'calcul', q: 'En dérivation, I₁ = 0,15 A' + (l2 ? ' et I₂ = 0,10 A' : ' et la lampe L2 est dévissée') + '. Quelle est l’intensité dans la branche principale ?', ans: I, tol: 0.005, unit: 'A', e: l2 ? 'I = 0,15 + 0,10 = 0,25 A.' : 'Seule la branche de L1 conduit : I = 0,15 A.' }
      ];
    }
  });
})();
