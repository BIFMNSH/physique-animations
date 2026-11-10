/* Livre vivant · 6e · Électricité · Court-circuit et protection des installations électriques.
   Moment essentiel : un fil relie les deux bornes de la lampe. Le courant prend le fil : la lampe s'éteint et le fil chauffe ; avec un fusible,
   le fusible fond et coupe le circuit. Simulation qualitative (aucune valeur chiffrée). Un court-circuit réel est dangereux : jamais seul, toujours avec le professeur. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec;
  var issue = V.lois.courtCircuit = function (fil, fus) { return +fil !== 1 ? 0 : +fus === 1 ? 2 : 1; }; /* 0 : normal, 1 : fil qui chauffe, 2 : fusible fondu */
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, r = issue(v.fil, v.fus), fus = +v.fus === 1, P = V.P, lampOn = r === 0, t = X.t;
      var circule = r !== 2;
      var aval = r === 1;
      E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], circule, t, X.anim, aval);
      if (r === 0) E.fil(c, [[115, 34], [180, 34], [180, 48]], true, t, X.anim);
      else E.fil(c, [[115, 34], [180, 34], [180, 48]], false, t, false, false);
      if (fus) E.fusible(c, 180, 48, 72, r === 2); else if (r === 0) E.fil(c, [[180, 48], [180, 72]], true, t, X.anim);
      if (!fus && r !== 0) E.fil(c, [[180, 48], [180, 72]], false, t, false);
      E.fil(c, [[180, 72], [180, 84], [118, 84], [118, 96]], r === 0, t, X.anim);
      if (+v.fil === 1) { E.fil(c, [[85, 34], [85, 8], [115, 8], [115, 34]], circule && r === 1, t, X.anim, aval); P.txt(c, 'fil', 122, 10, 11, aval ? P.col.hot : P.col.soft, 'left', 800); }
      /* le courant du court-circuit passe par le fil de la lampe puis par le reste de la boucle */
      if (r === 1) { E.fil(c, [[115, 34], [180, 34]], true, t, X.anim, true); E.fil(c, [[180, 34], [180, 84], [118, 84], [118, 96]], true, t, X.anim, true); }
      E.lampe(c, 100, 34, lampOn); E.pile(c, r === 1);
      if (r === 1) P.txt(c, 'fil et pile chauffent', 100, 124, 11, P.col.hot, 'center', 800);
      if (r === 2) P.txt(c, 'fusible fondu : circuit coupé', 100, 124, 11, P.col.ok, 'center', 800);
      if (fus && r !== 2) P.txt(c, 'fusible', 162, 60, 11, P.col.soft, 'right');
    });
  }
  function lig(v) {
    var r = issue(v.fil, v.fus);
    if (r === 0) return ['<b>Pas de court-circuit : la lampe brille</b>', +v.fus === 1 ? 'Le fusible laisse passer ce courant normal.' : 'Le courant traverse la lampe.'];
    if (r === 1) return ['<b>Court-circuit : la lampe s’éteint</b>', 'Le courant passe par le fil : le fil et la pile chauffent. C’est dangereux.'];
    return ['<b>Court-circuit : le fusible fond</b>', 'Le circuit est coupé : plus de courant, l’installation est protégée.'];
  }
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, read: lig, sound: function (v) { var r = issue(v.fil, v.fus); return r === 0 ? 523 : r === 1 ? 150 : 0; } };
  var fil = { id: 'fil', label: 'Fil sur la lampe', opts: [['0', 'Sans fil'], ['1', 'Avec un fil']], val: '0' };
  V.add({
    slug: 'court-circuit', defiTitre: 'Court-circuit et protection : le défi',
    chap: [
      { titre: 'Un fil de trop', labTitre: 'Court-circuiter la lampe (simulation)', cur: 'Pourquoi un fil dénudé qui touche une prise peut-il provoquer un incendie ?',
        paras: ['Il y a court-circuit quand un fil relie directement les deux bornes d’un dipôle ou de la pile : le courant prend ce chemin facile.', 'Le courant devient très fort : les fils et la pile chauffent, avec un risque de brûlure ou d’incendie.'],
        loi: { t: 'Court-circuit : la lampe s’éteint et les fils chauffent', s: 'on ne le fait jamais en vrai : seulement avec le professeur' }, note: 'Simulation : ajoute le fil sur la lampe. Un vrai court-circuit est dangereux, on ne le fait jamais seul.',
        predis: { q: 'On relie les deux bornes de la lampe par un fil. La lampe…', opts: ['brille plus fort', 's’éteint', 'ne change pas'], a: 1, rep: 'Elle s’éteint : le courant prend le chemin du fil. Le fil et la pile risquent de chauffer.' },
        verif: { q: 'un court-circuit est dangereux car…', o: ['la lampe brille trop', 'les fils chauffent', 'la pile se recharge'], a: 1, e: 'Le courant très fort fait chauffer les fils.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec une lampe, un fil sur ses bornes et un fusible ou non', choices: [fil, { id: 'fus', label: 'Fusible', opts: [['0', 'Sans'], ['1', 'Avec']], val: '1' }] }) },
      { titre: 'Le fusible protège', labTitre: 'Sans fusible, avec fusible', cur: 'Pourquoi le courant se coupe-t-il tout seul dans une maison en cas de problème ?',
        paras: ['Un fusible est un fil fin placé dans le circuit : quand le courant devient trop fort, il fond et coupe la boucle.', 'Dans les maisons de Côte d’Ivoire (220 V), un disjoncteur ou un fusible protège l’installation de la même façon.'],
        loi: { t: 'Le fusible fond quand le courant est trop fort', s: 'il coupe le circuit et protège l’installation' }, note: 'Compare en alternance : le même fil de court-circuit, avec et sans fusible.',
        predis: { q: 'On court-circuite un circuit protégé par un fusible. Que se passe-t-il ?', opts: ['le fil rougit', 'le fusible fond et coupe le circuit', 'rien ne change'], a: 1, rep: 'Le fusible fond le premier : le circuit est coupé avant que les fils ne chauffent trop.' },
        verif: { q: 'un fusible…', o: ['fait briller la lampe', 'fond si le courant est trop fort', 'recharge la pile'], a: 1, e: 'Il fond et coupe le circuit.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits court-circuités : sans fusible le fil chauffe, avec fusible le circuit est coupé', sit: [{ nom: 'Sans fusible', vars: { fus: '0' } }, { nom: 'Avec fusible', vars: { fus: '1' } }],
          choices: [Object.assign({}, fil, { val: '1' })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, f = +l.fil === 1 ? 1 : 0, u = +l.fus === 1 ? 1 : 0, r = issue(f, u);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé : ' + (f ? 'fil sur la lampe' : 'pas de fil sur la lampe') + ', ' + (u ? 'avec' : 'sans') + ' fusible. Que se passe-t-il ?', o: ['La lampe brille', 'La lampe est éteinte et le fil chauffe', 'La lampe est éteinte et le fusible fond : le circuit est protégé'], a: r, e: r === 0 ? 'Sans court-circuit, le courant traverse la lampe.' : r === 1 ? 'Sans fusible, le courant très fort passe par le fil qui chauffe : c’est dangereux.' : 'Le fusible fond le premier et coupe le circuit.' },
        { type: 'qcm', q: 'À quoi sert un fusible ?', o: ['À fondre et couper le circuit quand le courant devient trop fort', 'À faire briller la lampe plus fort', 'À recharger la pile'], a: 0, e: 'Le fusible protège l’installation en coupant le circuit.' }
      ];
    }
  });
})();
