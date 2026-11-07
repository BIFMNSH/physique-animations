/* Livre vivant · 6e · Mesures · La masse.
   Moment essentiel : balance de Roberval ; on ajoute des masses marquées jusqu'à l'équilibre : la masse de l'objet égale celle des masses marquées.
   Masses des objets indicatives (citron 100 g, pomme 150 g, mangue 400 g). L'inclinaison du fléau est un choix de dessin, nulle exactement à l'équilibre. 1 kg = 1 000 g. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var OBJ = { citron: ['citron', 100, '#C7D84A'], pomme: ['pomme', 150, '#D64545'], mangue: ['mangue', 400, '#E6A23C'] };
  var inc = V.lois.inclinaisonBalance = function (mo, mm) { return Math.max(-1, Math.min(1, (mo - mm) / 60)) * 12; };
  function balance(c, P, cx, cy, sc, o, mm, col, nom) {
    var th = inc(OBJ[o][1], mm) * Math.PI / 180, L = 105, sx = Math.cos(th) * L, sy = Math.sin(th) * L, xl = cx - sx, yl = cy + sy, xr = cx + sx, yr = cy - sy, eq = Math.abs(th) < 1e-9;
    c.save(); c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy);
    P.line(c, cx, cy + 6, cx, cy + 110, col, 4); P.rect(c, cx - 30, cy + 110, 60, 10, col, 2.4, P.col.fill); P.line(c, xl, yl, xr, yr, col, 4); P.circ(c, cx, cy, 5, col, 2, P.col.paper);
    P.poly(c, [[cx, cy - 20], [cx - 3, cy - 6], [cx + 3, cy - 6]], P.col.soft, 1.6, P.col.soft, true);
    [[xl, yl], [xr, yr]].forEach(function (p, k) { P.line(c, p[0], p[1], p[0], p[1] + 50, P.col.soft, 1.6); P.line(c, p[0] - 30, p[1] + 50, p[0] + 30, p[1] + 50, col, 3.2); });
    P.circ(c, xl, yl + 50 - 15, 15, P.col.ink, 2.2, OBJ[o][2]);
    var n = Math.max(0, Math.round(mm / 50)), i; for (i = 0; i < n && i < 10; i++) P.rect(c, xr - 11, yr + 50 - 6 - i * 6, 22, 5, P.col.ink, 1.4, '#B8B2A3');
    P.txt(c, mm > 0 ? fr(mm, 0) + ' g' : '0 g', xr, yr + 66, 12, P.col.ink, 'center', 800); P.txt(c, OBJ[o][0], xl, yl + 66, 12, P.col.ink, 'center', 800);
    if (eq) P.txt(c, 'équilibre', cx, cy - 34, 13, P.col.ok, 'center', 800);
    c.restore(); if (nom) P.txt(c, nom, cx, 14, 12, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      balance(c, P, two ? 95 + 190 * k : 190, two ? 90 : 95, two ? 0.62 : 1.05, s.v.obj, +s.v.mm, col, two ? s.nom : ''); c.restore();
    });
  }
  function lig(v) {
    var mo = OBJ[v.obj][1], mm = +v.mm;
    if (mm === mo) return ['<b>Équilibre : m = ' + fr(mo, 0) + ' g = ' + fr(mo / 1000, 3) + ' kg</b>', 'La masse du ' + OBJ[v.obj][0] + ' égale celle des masses marquées (1 kg = 1 000 g).'];
    return ['<b>' + (mo > mm ? 'Le plateau de l’objet descend : il est plus lourd' : 'Le plateau des masses descend : l’objet est plus léger') + '</b>', 'Modifie les masses marquées jusqu’à l’équilibre.'];
  }
  var mmI = { id: 'mm', label: 'Masses marquées', min: 0, max: 500, step: 10, val: 50, unit: 'g', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, live: false, notrace: true, read: lig, sound: function (v) { return 200 + 0.5 * +v.mm; } };
  V.add({
    slug: 'masse', defiTitre: 'La masse : le défi',
    chap: [
      { titre: 'Chercher l’équilibre', labTitre: 'La balance de Roberval', cur: 'Comment le marchand de mangues pèse-t-il sa marchandise ?',
        paras: ['La masse d’un objet se mesure avec une balance, en grammes (g) ou en kilogrammes (kg). 1 kg = 1 000 g.', 'Avec une balance de Roberval, on ajoute des masses marquées jusqu’à l’équilibre : la masse de l’objet est celle des masses marquées.'],
        loi: { t: 'À l’équilibre : masse de l’objet = masses marquées', s: '1 kg = 1 000 g' }, note: 'Ajoute des masses marquées : le plateau le plus lourd descend. Masses d’objets indicatives.',
        predis: { q: 'Le plateau de l’objet descend. L’objet est…', opts: ['plus lourd que les masses marquées', 'plus léger que les masses marquées', 'de même masse'], a: 0, rep: 'Plus lourd : le plateau le plus chargé descend. À l’équilibre, les deux masses sont égales.' },
        verif: { q: '1 kg vaut…', o: ['10 g', '100 g', '1 000 g'], a: 2, e: '1 kg = 1 000 g.' },
        lab: Object.assign({}, base, { alt: 'Balance de Roberval avec un objet et des masses marquées', sit: [{ nom: '', vars: {} }], choices: [{ id: 'obj', label: 'Objet', opts: [['citron', 'Citron'], ['pomme', 'Pomme'], ['mangue', 'Mangue']], val: 'pomme' }], inputs: [mmI] }) },
      { titre: 'Deux pesées', labTitre: 'Citron et mangue', cur: 'Pourquoi faut-il plus de masses marquées pour peser une mangue qu’un citron ?',
        paras: ['Plus l’objet est lourd, plus il faut de masses marquées pour équilibrer la balance.', 'On additionne les masses marquées pour obtenir la masse de l’objet.'],
        loi: { t: 'Masse = somme des masses marquées', s: 'à l’équilibre de la balance' }, note: 'Compare en alternance : règle chaque balance à l’équilibre.',
        predis: { q: 'À l’équilibre, on a posé 100 g + 50 g de masses marquées. La masse de l’objet est…', opts: ['50 g', '150 g', '100 g'], a: 1, rep: 'On additionne : 100 g + 50 g = 150 g.' },
        verif: { q: 'une mangue de 400 g, c’est…', o: ['0,4 kg', '4 kg', '40 kg'], a: 0, e: '400 g = 0,4 kg.' },
        lab: Object.assign({}, base, { alt: 'Deux balances : un citron et une mangue', sit: [{ nom: 'Citron', vars: { obj: 'citron' } }, { nom: 'Mangue', vars: { obj: 'mangue' } }], inputs: [Object.assign({}, mmI, { per: true, val: [50, 300] })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, o = OBJ[l.obj] ? l.obj : 'pomme', mo = OBJ[o][1];
      return [
        { type: 'calcul', q: 'Dans le laboratoire, tu as pesé un objet de ' + fr(mo, 0) + ' g. Exprime sa masse en kilogrammes.', ans: mo / 1000, tol: 0.0006, unit: 'kg', e: fr(mo, 0) + ' g = ' + fr(mo / 1000, 3) + ' kg.' },
        { type: 'qcm', q: 'La balance est à l’équilibre avec 200 g + 20 g de masses marquées. La masse de l’objet est…', o: ['180 g', '220 g', '200 g'], a: 1, e: '200 g + 20 g = 220 g.' }
      ];
    }
  });
})();
