/* Livre vivant · 5e · Électricité · Adaptation d'un générateur à un récepteur.
   Moment essentiel : on règle la tension du générateur ; la lampe 6 V est éteinte, en sous-tension, normale ou en surtension.
   Données : tension nominale 6 V (leçon Studio). Seuil de grillage = 1,5 × tension nominale : choix de conception. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec, fr = V.fr;
  var txt = { eteinte: 'éteinte', faible: 'brille faiblement', normale: 'brille normalement', surtension: 'brille trop fort', grillee: 'a grillé' };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, U = +v.Ug, Un = +v.Un, e = V.lois.etatLampe(U, Un), P = V.P, on = U > 0 && e.k !== 'grillee';
      E.boucle(c, on, X.t, X.anim); E.lampe(c, 100, 34, e.a, e.k === 'grillee'); E.pile(c, false, fr(U, U % 1 ? 1 : 0) + ' V');
      P.txt(c, 'lampe ' + fr(Un, 0) + ' V', 100, 66, 12, P.col.soft, 'center', 800);
    });
  }
  function lig(v) {
    var U = +v.Ug, Un = +v.Un, e = V.lois.etatLampe(U, Un), u = fr(U, U % 1 ? 1 : 0), n = fr(Un, 0);
    var t = { eteinte: '<b>Pas de tension : la lampe est éteinte</b>', faible: '<b>Sous-tension : ' + u + ' V < ' + n + ' V, la lampe brille faiblement</b>', normale: '<b>' + u + ' V = tension nominale : la lampe brille normalement</b>',
      surtension: '<b>Surtension : ' + u + ' V > ' + n + ' V, la lampe brille trop fort</b>', grillee: '<b>Surtension : ' + u + ' V > ' + n + ' V, la lampe a grillé</b>' }[e.k];
    return [t, e.k === 'surtension' ? 'Elle risque de griller si la tension augmente encore.' : e.k === 'grillee' ? 'Le filament a fondu : le circuit est ouvert.' : 'Tension nominale de la lampe : ' + n + ' V.'];
  }
  var Ug = { id: 'Ug', label: 'Tension du générateur', min: 0, max: 12, step: 1.5, val: 3, unit: 'V', dec: 1 };
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, inputs: [Ug], sound: function (v) { return 200 + 25 * +v.Ug; } };
  V.add({
    slug: 'generateur-recepteur', defiTitre: 'Adapter un générateur : le défi',
    chap: [
      { titre: 'La tension nominale', labTitre: 'Une lampe 6 V, quelle pile ?', cur: 'Que risque une lampe sur une pile trop forte ?',
        paras: ['Un récepteur porte sa tension nominale (6 V ici) : celle où il fonctionne normalement.', 'Plus petite : sous-tension, il fonctionne mal. Plus grande : surtension, il peut être abîmé.'],
        loi: { t: 'Tension du générateur = tension nominale', s: 'trop petite : sous-tension · trop grande : surtension' }, note: 'Avance le curseur de 0 à 12 V : regarde la lampe et lis l’état en dessous.',
        predis: { q: 'Lampe 6 V sur un générateur de 9 V : que se passe-t-il ?', opts: ['Elle brille normalement', 'Elle brille faiblement', 'Elle brille trop fort et risque de griller'], a: 2, rep: '9 V est plus grand que 6 V : c’est une surtension, la lampe brille trop fort et peut griller.' },
        verif: { q: 'la tension nominale d’une lampe, c’est…', o: ['la tension de la pile', 'la tension où elle fonctionne normalement', 'son intensité'], a: 1, e: 'C’est la tension indiquée sur la lampe pour un fonctionnement normal.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec un générateur réglable et une lampe 6 V', read: lig, sit: [{ nom: '', vars: { Un: 6 } }] }) },
      { titre: 'Deux lampes, une pile', labTitre: 'Lampe 6 V et lampe 3 V côte à côte', cur: 'Pourquoi ne met-on pas n’importe quelle pile dans n’importe quel appareil ?',
        paras: ['Le même générateur peut convenir à un récepteur et abîmer un autre : tout dépend de leur tension nominale.', 'On choisit le générateur selon le récepteur, jamais l’inverse.'],
        loi: { t: 'On choisit le générateur selon le récepteur', s: 'tension du générateur = tension nominale du récepteur' }, note: 'Compare en alternance : même générateur, deux lampes. Mets 3 V puis 6 V.',
        predis: { q: 'Un générateur de 6 V alimente une lampe 6 V et une lampe 3 V (chacune seule). La lampe 3 V…', opts: ['brille normalement', 'brille trop fort ou grille', 'reste éteinte'], a: 1, rep: '6 V est le double de sa tension nominale : surtension, elle risque de griller.' },
        verif: { q: 'pour une lampe 3 V, on choisit un générateur de…', o: ['3 V', '9 V', '12 V'], a: 0, e: 'Même valeur que la tension nominale.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits : lampe 6 V et lampe 3 V sur le même générateur', sit: [{ nom: 'Lampe 6 V', vars: { Un: 6 } }, { nom: 'Lampe 3 V', vars: { Un: 3 } }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var U = LV[0] && LV[0].Ug != null ? +LV[0].Ug : 3, e = V.lois.etatLampe(U, 6), o = ['est éteinte', 'brille faiblement (sous-tension)', 'brille normalement', 'brille trop fort ou grille (surtension)'], a = { eteinte: 0, faible: 1, normale: 2, surtension: 3, grillee: 3 }[e.k];
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé le générateur à ' + fr(U, U % 1 ? 1 : 0) + ' V pour la lampe 6 V. La lampe…', o: o, a: a, e: 'La tension nominale est 6 V : ' + (e.k === 'normale' ? 'ici la tension est égale, la lampe brille normalement.' : U < 6 ? 'ici la tension est plus petite, c’est une sous-tension.' : 'ici la tension est plus grande, c’est une surtension.') },
        { type: 'qcm', q: 'Quelle pile choisir pour une lampe marquée 4,5 V ?', o: ['Une pile de 1,5 V', 'Une pile de 4,5 V', 'Une pile de 9 V'], a: 1, e: 'On choisit un générateur dont la tension est égale à la tension nominale : 4,5 V.' }
      ];
    }
  });
})();
