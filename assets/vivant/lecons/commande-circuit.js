/* Livre vivant · 6e · Électricité · Commande d'un circuit électrique.
   Moment essentiel : ouvrir et fermer l'interrupteur ; la lampe est commandée où qu'il soit placé dans la boucle. Qualitatif, aucune valeur chiffrée. */
(function () {
  'use strict';
  var V = window.Vivant, E = V.elec;
  var allume = V.lois.circuitCommande = function (k) { return +k === 1; };
  function scene(c, X) {
    E.pose(c, X, function (s) {
      var v = s.v, on = allume(v.k), g = v.pos === 'g', P = V.P;
      if (g) {
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 72]], on, X.t, X.anim); E.fil(c, [[20, 48], [20, 34], [85, 34]], on, X.t, X.anim);
        E.fil(c, [[115, 34], [180, 34], [180, 84], [118, 84], [118, 96]], on, X.t, X.anim);
        E.inter(c, 20, 48, 72, on); P.txt(c, 'interrupteur', 38, 60, 11, P.col.soft, 'left');
      } else {
        E.fil(c, [[82, 96], [82, 84], [20, 84], [20, 34], [85, 34]], on, X.t, X.anim); E.fil(c, [[115, 34], [180, 34], [180, 48]], on, X.t, X.anim);
        E.fil(c, [[180, 72], [180, 84], [118, 84], [118, 96]], on, X.t, X.anim);
        E.inter(c, 180, 48, 72, on); P.txt(c, 'interrupteur', 162, 60, 11, P.col.soft, 'right');
      }
      E.lampe(c, 100, 34, on); E.pile(c, false);
    });
  }
  function lig(v) { return allume(v.k) ? ['<b>Interrupteur fermé : la boucle est fermée, la lampe brille</b>'] : ['<b>Interrupteur ouvert : la boucle est ouverte, la lampe est éteinte</b>']; }
  var base = { w: 380, h: 270, scene: scene, live: true, notrace: true, read: lig, sound: function (v) { return allume(v.k) ? 523 : 0; } };
  var k = { id: 'k', label: 'Interrupteur', opts: [['1', 'Fermé'], ['0', 'Ouvert']], val: '1' };
  V.add({
    slug: 'commande-circuit', defiTitre: 'Commande d’un circuit : le défi',
    chap: [
      { titre: 'Ouvrir, fermer', labTitre: 'L’interrupteur commande la lampe', cur: 'Comment la lumière du salon s’éteint-elle d’un seul geste ?',
        paras: ['Un interrupteur commande un circuit : fermé, il laisse passer le courant ; ouvert, il coupe la boucle.', 'On le représente par un schéma normalisé : une lame qui touche la borne (fermé) ou s’en écarte (ouvert).'],
        loi: { t: 'Interrupteur fermé : le courant circule', s: 'interrupteur ouvert : la boucle est coupée' }, note: 'Appuie sur « Fermé » puis « Ouvert » : la lampe et les points du courant suivent.',
        predis: { q: 'L’interrupteur est ouvert. La lampe…', opts: ['brille', 'est éteinte', 'clignote'], a: 1, rep: 'Elle est éteinte : l’interrupteur ouvert coupe la boucle, le courant ne circule plus.' },
        verif: { q: 'un interrupteur ouvert…', o: ['laisse passer le courant', 'coupe le circuit', 'allume la lampe'], a: 1, e: 'Ouvert, il coupe la boucle.' },
        lab: Object.assign({}, base, { alt: 'Circuit avec pile, lampe et interrupteur ouvert ou fermé', choices: [k], sit: [{ nom: '', vars: { pos: 'd' } }] }) },
      { titre: 'Où le placer ?', labTitre: 'Interrupteur à droite ou à gauche', cur: 'Faut-il mettre l’interrupteur tout près de la lampe ?',
        paras: ['Dans une boucle simple, l’interrupteur peut être placé n’importe où : il commande la lampe de la même façon.', 'Ce qui compte : il fait partie de la boucle, en série avec la pile et la lampe.'],
        loi: { t: 'Dans la boucle, sa place ne change rien', s: 'ouvert n’importe où, il coupe tout le circuit' }, note: 'Compare en alternance : l’interrupteur change de côté, l’effet sur la lampe reste le même.',
        predis: { q: 'On déplace l’interrupteur de l’autre côté de la lampe. La lampe est commandée…', opts: ['toujours', 'plus du tout', 'seulement à droite'], a: 0, rep: 'Toujours : il est resté dans la boucle, il la coupe où qu’il soit.' },
        verif: { q: 'pour commander la lampe, l’interrupteur doit être placé…', o: ['dans la boucle', 'hors du circuit', 'collé à la lampe'], a: 0, e: 'Il doit faire partie de la boucle.' },
        lab: Object.assign({}, base, { alt: 'Deux circuits : interrupteur à droite et interrupteur à gauche', choices: [k], sit: [{ nom: 'À droite', vars: { pos: 'd' } }, { nom: 'À gauche', vars: { pos: 'g' } }],
          read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, on = allume(l.k == null ? 1 : l.k);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as laissé l’interrupteur ' + (on ? 'fermé' : 'ouvert') + '. Que fait la lampe ?', o: ['Elle brille', 'Elle est éteinte'], a: on ? 0 : 1, e: on ? 'Fermé, l’interrupteur ferme la boucle : le courant circule.' : 'Ouvert, l’interrupteur coupe la boucle : plus de courant.' },
        { type: 'qcm', q: 'Où peut-on placer l’interrupteur pour commander la lampe ?', o: ['Seulement juste à côté de la lampe', 'N’importe où dans la boucle', 'En dehors de la boucle'], a: 1, e: 'Dans une boucle simple, il commande la lampe où qu’il soit, tant qu’il fait partie de la boucle.' }
      ];
    }
  });
})();
