/* Livre vivant · 5e · Électricité · Association de lampes électriques.
   Moment essentiel : deux lampes identiques (6 V) sur un générateur 6 V, en série puis en dérivation ; on dévisse une lampe.
   En série : U = U₁ + U₂ (3 V chacune, elles brillent faiblement) ; en dérivation : U₁ = U₂ = U (6 V, normal). */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec;
  var etat = V.lois.associationLampes = function (mont, dev) {
    var d1 = +dev === 1, d2 = +dev === 2;
    if (mont === 'serie') { var on = !d1 && !d2; return { l1: on ? 0.5 : 0, l2: on ? 0.5 : 0, circule: on }; }
    return { l1: d1 ? 0 : 1, l2: d2 ? 0 : 1, circule: !(d1 && d2) };
  };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, e = etat(v.mont, v.dev), P = V.P, d1 = +v.dev === 1, d2 = +v.dev === 2;
      function nm(x, y, t, off) { P.txt(c, t + (off ? ' dévissée' : ''), x, y, 11, off ? P.col.hot : P.col.soft, 'center', 800); }
      if (v.mont === 'serie') {
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [50, 34]], e.circule, X.t, X.anim); E.fil(c, [[80, 34], [120, 34]], e.circule, X.t, X.anim); E.fil(c, [[150, 34], [180, 34], [180, 84], [118, 84], [118, 96]], e.circule, X.t, X.anim);
        E.lampe(c, 65, 34, e.l1); E.lampe(c, 135, 34, e.l2); nm(65, 62, 'L1', d1); nm(135, 62, 'L2', d2);
      } else {
        var a = e.l1 > 0, b = e.l2 > 0;
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 62]], e.circule, X.t, X.anim); E.fil(c, [[20, 62], [20, 28]], a, X.t, X.anim);
        E.fil(c, [[20, 28], [87, 28]], a, X.t, X.anim); E.fil(c, [[113, 28], [180, 28]], a, X.t, X.anim); E.fil(c, [[20, 62], [87, 62]], b, X.t, X.anim); E.fil(c, [[113, 62], [180, 62]], b, X.t, X.anim);
        E.fil(c, [[180, 28], [180, 62]], a, X.t, X.anim); E.fil(c, [[180, 62], [180, 84], [118, 84], [118, 96]], e.circule, X.t, X.anim);
        E.lampe(c, 100, 28, e.l1, false, 12); E.lampe(c, 100, 62, e.l2, false, 12);
        P.txt(c, d1 ? 'L1 dévissée' : 'L1', 48, 28, 11, d1 ? P.col.hot : P.col.soft, 'center', 800); P.txt(c, d2 ? 'L2 dévissée' : 'L2', 48, 62, 11, d2 ? P.col.hot : P.col.soft, 'center', 800);
      }
      E.pile(c, false, '6 V');
    });
  }
  function lig(v) {
    var e = etat(v.mont, v.dev), d = +v.dev;
    if (v.mont === 'serie') return e.circule ? ['<b>En série : U = U₁ + U₂ = 3 V + 3 V = 6 V</b>', 'Le même courant traverse les deux lampes ; elles brillent faiblement.'] : ['<b>Une lampe dévissée : la boucle est ouverte, tout s’éteint</b>', 'En série, il n’y a qu’une seule boucle.'];
    return d ? ['<b>L' + d + ' dévissée : L' + (3 - d) + ' continue de briller (6 V)</b>', 'En dérivation, chaque lampe a sa propre boucle.'] : ['<b>En dérivation : U₁ = U₂ = U = 6 V</b>', 'Chaque lampe reçoit la tension du générateur et brille normalement.'];
  }
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, sound: function (v) { var e = etat(v.mont, v.dev); return e.l1 + e.l2 > 0 ? 300 + 150 * (e.l1 + e.l2) : 0; } };
  var dev = { id: 'dev', label: 'Lampe dévissée', opts: [['0', 'Aucune'], ['1', 'L1'], ['2', 'L2']], val: '0' };
  V.add({
    slug: 'association-lampes', defiTitre: 'Association de lampes : le défi',
    chap: [
      { titre: 'Série ou dérivation', labTitre: 'Deux lampes, un seul générateur', cur: 'Dans une guirlande, pourquoi toutes les lampes s’éteignent-elles quand une est grillée ?',
        paras: ['En série, les lampes sont l’une derrière l’autre dans une seule boucle : si on en dévisse une, tout s’éteint.', 'En dérivation, chaque lampe a sa boucle : dévisser l’une ne change pas l’autre.'],
        loi: { t: 'Série : une seule boucle', s: 'dérivation : une boucle par lampe, les lampes sont indépendantes' }, note: 'Choisis le montage, puis dévisse L1 ou L2 : regarde l’autre lampe.',
        predis: { q: 'Deux lampes sont montées en série. On en dévisse une. L’autre lampe…', opts: ['reste allumée', 's’éteint', 'brille plus fort'], a: 1, rep: 'Elle s’éteint : en série, il n’y a qu’une boucle et elle est ouverte.' },
        verif: { q: 'en dérivation, si on dévisse une lampe…', o: ['les autres s’éteignent', 'les autres restent allumées', 'tout brille plus fort'], a: 1, e: 'Les lampes sont indépendantes.' },
        lab: Object.assign({}, base, { alt: 'Deux lampes montées en série ou en dérivation, avec une lampe qu’on peut dévisser', read: lig, choices: [{ id: 'mont', label: 'Montage', opts: [['serie', 'En série'], ['der', 'En dérivation']], val: 'serie' }, dev] }) },
      { titre: 'Dans la maison', labTitre: 'Série et dérivation côte à côte', cur: 'Pourquoi la télévision reste-t-elle allumée quand on éteint la lampe du salon ?',
        paras: ['Dans une maison, les appareils sont montés en dérivation : chacun reçoit la tension du secteur (220 V) et fonctionne seul.', 'En série, les lampes se partagent la tension : U = U₁ + U₂ ; elles brillent moins.'],
        loi: { t: 'Série : U = U₁ + U₂', s: 'dérivation : U₁ = U₂ = U du générateur' }, note: 'Compare en alternance, avec L1 dévissée : la différence se voit tout de suite.',
        predis: { q: 'Dans une maison, on éteint la lampe du salon : la télévision reste allumée. Les appareils sont…', opts: ['en série', 'en dérivation', 'en court-circuit'], a: 1, rep: 'En dérivation : chaque appareil a sa boucle et reçoit toute la tension du secteur.' },
        verif: { q: 'en série, la tension du générateur…', o: ['se partage entre les lampes', 'est la même sur chaque lampe', 'disparaît'], a: 0, e: 'U = U₁ + U₂.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits : lampes en série et lampes en dérivation, avec L1 dévissée', sit: [{ nom: 'En série', vars: { mont: 'serie' } }, { nom: 'En dérivation', vars: { mont: 'der' } }], choices: [Object.assign({}, dev, { val: '1' })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, mont = l.mont === 'der' ? 'der' : 'serie', d = +l.dev || 0, e = etat(mont, d), a = d === 0 ? 0 : mont === 'serie' ? 2 : 1;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as monté les lampes ' + (mont === 'serie' ? 'en série' : 'en dérivation') + (d ? ' et dévissé L' + d : ' sans rien dévisser') + '. Que font les lampes ?', o: ['Les deux brillent', 'Une seule brille', 'Aucune ne brille'], a: a, e: d === 0 ? 'Rien n’est dévissé : les deux boucles sont fermées.' : mont === 'serie' ? 'En série, une seule boucle : la dévisser éteint tout.' : 'En dérivation, l’autre lampe a sa propre boucle : elle reste allumée.' },
        { type: 'qcm', q: 'Un circuit en série comporte…', o: ['une seule boucle', 'deux boucles', 'autant de boucles que de lampes'], a: 0, e: 'En série, le courant n’a qu’un seul chemin.' }
      ];
    }
  });
})();
