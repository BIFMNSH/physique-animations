/* Livre vivant · 5e · Électricité · Association de piles en série.
   Moment essentiel : on ajoute des piles de 1,5 V bout à bout ; la tension totale est la somme des tensions, une pile retournée se retranche.
   Lampe de tension nominale 4,5 V (choix de conception ; seuil de grillage 1,5 × la tension nominale). Le sens du courant est celui du signe de U. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec, fr = V.fr, UP = 1.5, UN = 4.5;
  var total = V.lois.pilesSerie = function (n, inv) { return n * UP - (inv ? 2 * UP : 0); };
  var f = function (x) { return fr(x, x % 1 ? 1 : 0); };
  function eq(n, inv) {
    var t = '', i; for (i = 0; i < n; i++) { var neg = inv && i === n - 1; t += (i ? (neg ? ' − ' : ' + ') : (neg ? '− ' : '')) + f(UP) + ' V'; }
    return t + ' = ' + f(total(n, inv)) + ' V';
  }
  function bloc(c, P, v, nom, col) {
    var n = +v.n, inv = v.sens === 'inv', U = total(n, inv), e = V.lois.etatLampe(U, UN), W = 54, x0 = 190 - n * W / 2 + 4, i;
    for (i = 0; i < n; i++) {
      var x = x0 + i * W, rev = inv && i === n - 1;
      P.rect(c, x, 9, 44, 26, col, 2.2, P.col.fill); P.rect(c, rev ? x - 5 : x + 44, 17, 5, 10, col, 2, P.col.paper);
      P.txt(c, f(UP) + ' V', x + 22, 22, 11, P.col.ink, 'center', 800); P.txt(c, '+', rev ? x - 3 : x + 47, 6, 13, P.col.b, 'center', 800);
      if (rev) P.txt(c, '↺', x + 22, 3, 11, P.col.hot, 'center', 800);
    }
    var xl = x0, xr = x0 + (n - 1) * W + 49, on = Math.abs(U) > 0.05 && e.k !== 'grillee', up = [[xr, 22], [xr + 14, 22], [xr + 14, 104], [204, 104]], dn = [[176, 104], [xl - 14, 104], [xl - 14, 22], [xl, 22]];
    var a1 = U >= 0 ? up : up.slice().reverse(), a2 = U >= 0 ? dn : dn.slice().reverse();
    E.fil(c, a1, on, V.X.t, V.X.anim); E.fil(c, a2, on, V.X.t, V.X.anim);
    E.lampe(c, 190, 104, e.a, e.k === 'grillee', 14); P.txt(c, 'lampe ' + f(UN) + ' V', 190, 56, 11, P.col.soft, 'center');
    if (nom) P.txt(c, nom, 190, -11, 12, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1; V.X = X;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, sc = two ? 0.9 : 1.3, oy = two ? 14 + k * 128 : 54;
      c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1; E.cadre(c, 190 * (1 - sc), oy, sc, function () { bloc(c, P, s.v, s.nom, col); }); c.restore();
    });
  }
  function lig(v) {
    var n = +v.n, inv = v.sens === 'inv', U = total(n, inv), e = V.lois.etatLampe(U, UN);
    var t = { eteinte: 'Tension nulle : la lampe est éteinte.', faible: 'Sous-tension (' + f(Math.abs(U)) + ' V < ' + f(UN) + ' V) : la lampe brille faiblement.', normale: 'Tension nominale : la lampe brille normalement.', surtension: 'Surtension : la lampe brille trop fort.', grillee: 'Surtension : la lampe a grillé.' }[e.k];
    return ['<b>U = ' + eq(n, inv) + '</b>', t];
  }
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, sound: function (v) { return 150 + 60 * Math.abs(total(+v.n, v.sens === 'inv')); } };
  var nI = { id: 'n', label: 'Nombre de piles', min: 1, max: 4, step: 1, val: 3, unit: '', dec: 0 };
  V.add({
    slug: 'piles-serie', defiTitre: 'Piles en série : le défi',
    chap: [
      { titre: 'Les tensions s’ajoutent', labTitre: 'Ajouter des piles de 1,5 V', cur: 'Awa a besoin de 4,5 V pour sa radio : comment les obtenir avec des piles de 1,5 V ?',
        paras: ['Associer des piles en série, c’est les mettre bout à bout : la borne + d’une pile touche la borne − de la suivante.', 'La tension de l’association est la somme des tensions des piles.'],
        loi: { t: 'U = U₁ + U₂ + U₃ + …', s: 'trois piles de 1,5 V donnent 4,5 V' }, note: 'Change le nombre de piles : l’addition s’écrit toute seule sous le dessin.',
        predis: { q: 'On associe en série deux piles de 1,5 V. La tension obtenue est…', opts: ['1,5 V', '3 V', '0 V'], a: 1, rep: '1,5 V + 1,5 V = 3 V : les tensions s’ajoutent.' },
        verif: { q: 'trois piles de 1,5 V en série donnent…', o: ['1,5 V', '3 V', '4,5 V'], a: 2, e: '1,5 + 1,5 + 1,5 = 4,5 V.' },
        lab: Object.assign({}, base, { alt: 'Des piles de 1,5 V bout à bout reliées à une lampe 4,5 V', read: lig, sit: [{ nom: '', vars: { sens: 'meme' } }], inputs: [nI] }) },
      { titre: 'Une pile à l’envers', labTitre: 'Même sens contre pile retournée', cur: 'Pourquoi la lampe de la radio reste-t-elle faible quand une pile est à l’envers ?',
        paras: ['Si une pile est retournée, sa tension se retranche : elle s’oppose aux autres.', 'Avec trois piles de 1,5 V dont une retournée : 1,5 + 1,5 − 1,5 = 1,5 V seulement.'],
        loi: { t: 'Pile retournée : sa tension se retranche', s: 'U = 1,5 V + 1,5 V − 1,5 V = 1,5 V' }, note: 'Compare en alternance : même nombre de piles, mais une est retournée dans la deuxième situation.',
        predis: { q: 'Trois piles de 1,5 V sont en série, mais l’une est retournée. La tension est…', opts: ['4,5 V', '1,5 V', '0 V'], a: 1, rep: '1,5 + 1,5 − 1,5 = 1,5 V : la pile retournée se retranche.' },
        verif: { q: 'deux piles de 1,5 V en série, l’une retournée, donnent…', o: ['3 V', '1,5 V', '0 V'], a: 2, e: '1,5 − 1,5 = 0 V.' },
        lab: Object.assign({}, base, { alt: 'Deux associations : toutes les piles dans le même sens, ou la dernière retournée', read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sit: [{ nom: 'Même sens', vars: { sens: 'meme' } }, { nom: 'Dernière retournée', vars: { sens: 'inv' } }], inputs: [nI] }) }
    ],
    manches: function (LV) {
      var n = LV[0] && LV[0].n != null ? +LV[0].n : 3, U = total(n, false);
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as mis ' + n + ' pile' + (n > 1 ? 's' : '') + ' de 1,5 V en série, toutes dans le même sens. Quelle est la tension de l’association ?', ans: U, tol: 0.05, unit: 'V', e: 'U = ' + eq(n, false) + '.' },
        { type: 'qcm', q: 'On associe en série une pile de 4,5 V et une pile de 1,5 V, dans le même sens. La tension totale est…', o: ['3 V', '6 V', '4,5 V'], a: 1, e: '4,5 V + 1,5 V = 6 V.' }
      ];
    }
  });
})();
