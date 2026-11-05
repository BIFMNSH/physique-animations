/* Livre vivant · 4e · Sources et récepteurs de lumière.
   Moment essentiel : banc source – objet – œil ; on voit un objet seulement si la lumière de la source arrive à l'objet qui la diffuse jusqu'à l'œil.
   Chapitre 2 : source primaire (produit sa lumière) et objet diffusant (ne fait que renvoyer). Qualitatif. */
(function () {
  'use strict';
  var V = window.Vivant;
  var vu = V.lois.objetVu = function (primaire, source) { return primaire ? true : !!source; };
  function oeil(c, P, x, y, col) { P.circ(c, x, y, 16, col, 2.4, P.col.paper); P.circ(c, x, y, 6, P.col.ink, 1.6, '#3B5BDB'); }
  function ray(c, P, x1, y1, x2, y2) { P.line(c, x1, y1, x2, y2, '#D4A017', 2); P.arrow(c, x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.55, x2, y2, '#D4A017', 2); }
  function sceneBanc(c, X) {
    var P = X.P, s = X.S[0].v, on = s.src === 'on';
    P.circ(c, 60, 110, 16, P.col.ink, 2.4, on ? '#FFE066' : P.col.paper); P.txt(c, 'lampe', 60, 140, 12, P.col.ink, 'center', 800);
    P.circ(c, 190, 110, 18, P.col.ink, 2.4, '#7FB069'); P.txt(c, 'objet', 190, 140, 12, P.col.ink, 'center', 800);
    oeil(c, P, 310, 110, P.col.ink); P.txt(c, 'œil', 310, 140, 12, P.col.ink, 'center', 800);
    if (on) { ray(c, P, 78, 104, 172, 104); ray(c, P, 208, 104, 294, 104); }
    P.txt(c, on ? 'on voit l’objet' : 'noir : on ne voit pas l’objet', 190, 40, 14, on ? P.col.ok : P.col.hot, 'center', 800);
  }
  function sceneDeux(c, X) {
    var P = X.P, jour = X.S[0].v.jour === 'oui';
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, prim = s.v.obj === 'lampe', v = vu(prim, jour), x0 = 30 + k * 185; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0 + 35, 110, 18, P.col.ink, 2.4, prim ? '#FFE066' : '#C9A27A'); oeil(c, P, x0 + 135, 110, col);
      if (prim) { ray(c, P, x0 + 55, 108, x0 + 117, 108); } else if (jour) { P.arrow(c, x0 + 35, 50, x0 + 35, 88, '#D4A017', 2); ray(c, P, x0 + 55, 108, x0 + 117, 108); }
      P.txt(c, prim ? 'lampe allumée' : 'livre', x0 + 35, 148, 12, col, 'center', 800); P.txt(c, v ? 'vu' : 'pas vu', x0 + 85, 190, 14, v ? P.col.ok : P.col.hot, 'center', 800); P.txt(c, s.nom, x0 + 85, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'sources-recepteurs', defiTitre: 'Sources et récepteurs de lumière : le défi',
    chap: [
      { titre: 'Voir un objet', labTitre: 'Source, objet, œil', cur: 'Pourquoi ne voit-on rien dans une pièce sans fenêtre quand on éteint la lumière ?',
        paras: ['Pour voir un objet, la lumière doit arriver dans notre œil, qui est le récepteur.', 'Un objet non lumineux est vu parce qu’il diffuse la lumière reçue d’une source.'],
        loi: { t: 'On voit un objet si sa lumière arrive à l’œil', s: 'source → objet (diffuse) → œil' }, note: 'Allume ou éteins la lampe : les flèches jaunes montrent le trajet de la lumière.',
        predis: { q: 'La lampe est éteinte, il fait nuit. On voit l’objet ?', opts: ['non', 'oui', 'oui, avec les yeux fermés'], a: 0, rep: 'Non : aucune lumière n’arrive à l’œil.' },
        verif: { q: 'le récepteur de lumière qui permet de voir est…', o: ['l’œil', 'la lampe', 'l’objet'], a: 0, e: 'L’œil.' },
        lab: { w: 380, h: 230, alt: 'Lampe, objet et œil sur un banc', scene: sceneBanc, live: false, notrace: true, sit: [{ nom: '', vars: {} }], choices: [{ id: 'src', label: 'Lampe', opts: [['off', 'Éteinte'], ['on', 'Allumée']], val: 'on' }],
          read: function (v) { return v.src === 'on' ? ['<b>La lumière va de la lampe à l’objet, puis à l’œil</b>'] : ['<b>Pas de lumière : on ne voit pas l’objet</b>']; }, sound: function (v) { return v.src === 'on' ? 420 : 160; } } },
      { titre: 'Source ou objet diffusant', labTitre: 'Lampe et livre', cur: 'Pourquoi voit-on une lampe allumée mais un livre seulement avec de la lumière ?',
        paras: ['Une source primaire produit sa lumière : le Soleil, une lampe allumée.', 'Un objet diffusant, comme un livre, ne produit pas de lumière : on le voit seulement s’il est éclairé.'],
        loi: { t: 'Source primaire : produit sa lumière', s: 'objet diffusant : renvoie la lumière reçue' }, note: 'Éteins la lumière du jour : la lampe reste vue, pas le livre.',
        predis: { q: 'Dans le noir complet, on voit encore…', opts: ['une lampe allumée', 'un livre', 'un mur'], a: 0, rep: 'Une lampe allumée : c’est une source primaire.' },
        verif: { q: 'le Soleil est…', o: ['une source primaire', 'un objet diffusant', 'un récepteur'], a: 0, e: 'Il produit sa lumière.' },
        lab: { w: 380, h: 230, alt: 'Une lampe allumée et un livre, vus avec ou sans lumière du jour', scene: sceneDeux, live: false, notrace: true, sit: [{ nom: 'Lampe', vars: { obj: 'lampe' } }, { nom: 'Livre', vars: { obj: 'livre' } }], choices: [{ id: 'jour', label: 'Lumière du jour', opts: [['non', 'Non'], ['oui', 'Oui']], val: 'oui' }],
          read: function (v) { return [vu(v.obj === 'lampe', v.jour === 'oui') ? 'On le voit' : 'On ne le voit pas']; }, sound: function (v) { return vu(v.obj === 'lampe', v.jour === 'oui') ? 400 : 160; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu éteins la lampe. Que se passe-t-il pour l’objet ?', o: ['On ne le voit plus', 'On le voit mieux', 'Il devient une source'], a: 0, e: 'Plus de lumière diffusée vers l’œil.' },
        { type: 'qcm', q: 'Dans la nuit, Kofi voit une lampe allumée au loin mais pas le mur. Pourquoi ?', o: ['La lampe produit sa lumière', 'Le mur est trop lourd', 'Les yeux ferment'], a: 0, e: 'Source primaire contre objet diffusant non éclairé.' }
      ];
    }
  });
})();
