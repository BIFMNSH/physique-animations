/* Livre vivant · 6e · Électricité · Le circuit électrique.
   Moment essentiel : choisir l'objet testé et le nombre de fils ; la lampe brille seulement si la boucle est fermée ET si l'objet est conducteur.
   Les points mobiles montrent le sens conventionnel du courant (de + vers −). Aucune valeur chiffrée : le programme de 6e est qualitatif. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec;
  var OBJ = {
    clou: { n: 'le clou en fer', c: 1, col: '#9AA6BC' }, piece: { n: 'la pièce de monnaie', c: 1, col: '#C9A86A' }, mine: { n: 'la mine de crayon', c: 1, col: '#3A3A42' },
    plastique: { n: 'la règle en plastique', c: 0, col: '#4FC3FF' }, bois: { n: 'le bâton de bois', c: 0, col: '#A07850' }, gomme: { n: 'la gomme', c: 0, col: '#F2A0B4' }
  };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var ferme = V.lois.circuitFerme = function (fils, obj) { return +fils === 2 && !!(OBJ[obj] && OBJ[obj].c); };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, o = OBJ[v.obj] || OBJ.clou, on = ferme(v.fils, v.obj), P = V.P, two = +v.fils === 2;
      E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], on, X.t, X.anim);
      E.fil(c, [[115, 34], [180, 34], [180, 48]], on, X.t, X.anim);
      if (two) E.fil(c, [[180, 72], [180, 84], [118, 84], [118, 96]], on, X.t, X.anim);
      else { E.fil(c, [[180, 72], [180, 84], [146, 84]], false, 0, false); P.circ(c, 146, 84, 3.2, P.col.ink, 2, P.col.paper); P.txt(c, 'fil manquant', 130, 72, 11, P.col.hot, 'center', 800); }
      P.rect(c, 172, 48, 16, 24, P.col.ink, 2.2, o.col); E.pince(c, 180, 48); E.pince(c, 180, 72);
      P.txt(c, o.n.replace(/^(le|la) /, ''), 164, 60, 11, P.col.soft, 'right');
      E.lampe(c, 100, 34, on); E.pile(c, false);
    });
  }
  function lig(v) {
    var o = OBJ[v.obj] || OBJ.clou, n = cap(o.n);
    if (+v.fils !== 2) return ['<b>Boucle ouverte : le courant ne circule pas</b>', 'Il manque un fil : la lampe reste éteinte.'];
    return o.c ? ['<b>La lampe brille</b>', n + ' est conducteur : il laisse passer le courant.'] : ['<b>La lampe reste éteinte</b>', n + ' est isolant : il ne laisse pas passer le courant.'];
  }
  var ob = ['clou', 'piece', 'mine', 'plastique', 'bois', 'gomme'].map(function (k) { return [k, cap(OBJ[k].n.replace(/^(le|la) /, ''))]; });
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, sound: function (v) { return ferme(v.fils, v.obj) ? 523 : 0; } };
  V.add({
    slug: 'circuit-electrique', defiTitre: 'Le circuit électrique : le défi',
    chap: [
      { titre: 'Fermer la boucle', labTitre: 'Pile, lampe, objet : la lampe brille-t-elle ?', cur: 'Awa veut allumer une lampe avec une pile : que lui faut-il ?',
        paras: ['Un circuit électrique simple comprend un générateur (la pile), un récepteur (la lampe) et des fils de connexion.', 'Le courant circule seulement si la boucle est fermée, et si tous les éléments de la boucle sont conducteurs.'],
        loi: { t: 'Boucle fermée + conducteurs = la lampe brille', s: 'un isolant ou un fil manquant ouvre la boucle' }, note: 'Choisis un objet et le nombre de fils : les points jaunes montrent le sens du courant (de + vers −).',
        predis: { q: 'On relie la pile à la lampe avec un seul fil. La lampe…', opts: ['brille', 'reste éteinte', 'brille faiblement'], a: 1, rep: 'Elle reste éteinte : avec un seul fil la boucle n’est pas fermée, le courant ne peut pas circuler.' },
        verif: { q: 'pour que la lampe brille, la boucle doit être…', o: ['ouverte', 'fermée', 'coupée en deux'], a: 1, e: 'Le courant circule seulement dans une boucle fermée.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec une pile, une lampe et un objet testé entre deux pinces', read: lig,
          choices: [{ id: 'obj', label: 'Objet testé', opts: ob, val: 'clou' }, { id: 'fils', label: 'Fils', opts: [['1', 'Un seul fil'], ['2', 'Deux fils']], val: '2' }] }) },
      { titre: 'Conducteurs et isolants', labTitre: 'Un conducteur et un isolant, côte à côte', cur: 'Pourquoi les fils électriques sont-ils gainés de plastique ?',
        paras: ['Un conducteur laisse passer le courant : les métaux (fer, cuivre), le graphite de la mine de crayon.', 'Un isolant ne le laisse pas passer : plastique, bois, gomme, verre. On gaine les fils de plastique pour se protéger.'],
        loi: { t: 'Métaux et graphite : conducteurs', s: 'plastique, bois, gomme, verre : isolants' }, note: 'Appuie sur « Comparer en alternance » : même circuit, seul l’objet testé change.',
        predis: { q: 'Un clou en fer et une règle en plastique sont placés dans le circuit. Lequel laisse passer le courant ?', opts: ['les deux', 'seulement le clou', 'seulement la règle'], a: 1, rep: 'Le clou en fer est un métal : il conduit. Le plastique est un isolant.' },
        verif: { q: 'la mine d’un crayon est…', o: ['isolante', 'conductrice', 'un générateur'], a: 1, e: 'Le graphite de la mine conduit le courant.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits identiques : l’un avec un clou en fer, l’autre avec une règle en plastique', read: function (v) { var r = lig(v); return [r[0].replace(/<\/?b>/g, '') + ' · ' + r[1]]; },
          sit: [{ nom: 'Clou en fer', vars: { obj: 'clou' } }, { nom: 'Règle plastique', vars: { obj: 'plastique' } }],
          choices: [{ id: 'fils', label: 'Fils', opts: [['1', 'Un seul fil'], ['2', 'Deux fils']], val: '2' }] }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, k = OBJ[l.obj] ? l.obj : 'clou', f = +l.fils === 1 ? 1 : 2, on = ferme(f, k), o = OBJ[k];
      var svg = '<rect x="30" y="150" width="70" height="40" fill="#F0E5CB" stroke="#2A2620" stroke-width="3"/><circle cx="150" cy="40" r="22" fill="#FFFDF6" stroke="#2A2620" stroke-width="3"/><path d="M65 150 L65 40 L128 40" fill="none" stroke="#2A2620" stroke-width="3"/><path d="M172 40 L250 40 L250 170 L100 170" fill="none" stroke="#2A2620" stroke-width="3"/>';
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as testé ' + o.n + ' avec ' + (f === 1 ? 'un seul fil' : 'deux fils') + '. Que fait la lampe ?', o: ['Elle brille', 'Elle reste éteinte'], a: on ? 0 : 1, e: f === 1 ? 'Avec un seul fil, la boucle est ouverte : le courant ne circule pas.' : o.c ? cap(o.n) + ' est conducteur et la boucle est fermée : la lampe brille.' : cap(o.n) + ' est isolant : il ouvre la boucle, la lampe reste éteinte.' },
        { type: 'clic', q: 'Ce circuit ne marche pas. Clique sur l’endroit où il faut ajouter un fil pour fermer la boucle.', w: 300, h: 220, svg: svg, zones: [{ id: 'lampe', x: 125, y: 15, w: 50, h: 50, label: 'la lampe' }, { id: 'pile', x: 25, y: 145, w: 80, h: 50, label: 'la pile' }, { id: 'trou', x: 90, y: 155, w: 20, h: 30, label: 'l’espace entre la pile et le fil' }, { id: 'droite', x: 235, y: 60, w: 30, h: 90, label: 'le fil de droite' }], a: 'trou', e: 'Le fil du bas ne touche pas la pile : en ajoutant un fil à cet endroit, la boucle se ferme.' }
      ];
    }
  });
})();
