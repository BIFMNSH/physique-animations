/* Livre vivant · 3e · Défauts de l'œil et correction.
   Moment essentiel : l'œil normal forme l'image nette sur la rétine ; myope : image devant la rétine ; hypermétrope : derrière. Des lunettes (lentille divergente ou convergente) ramènent l'image sur la rétine.
   Modèle à décalage entier : défaut (myope −1, hypermétrope +1) + correction (convergente −1, divergente +1) ; image nette si le total est nul. Choix de conception qualitatif. */
(function () {
  'use strict';
  var V = window.Vivant;
  var DEF = { normal: 0, myope: -1, hyper: 1 }, COR = { aucune: 0, conv: -1, div: 1 };
  var decal = V.lois.decalageImage = function (d, c) { return DEF[d] + COR[c]; };
  var net = V.lois.imageNette = function (d, c) { return decal(d, c) === 0; };
  var NOM = { normal: 'œil normal', myope: 'œil myope', hyper: 'œil hypermétrope' }, CN = { aucune: 'sans lunettes', conv: 'lentille convergente', div: 'lentille divergente' };
  function oeil(c, P, x, y, d, cor, col, nom) {
    var dc = decal(d, cor), fx = x + 30 + dc * 24;
    P.circ(c, x, y, 46, col, 2.6, P.col.paper); P.line(c, x + 46, y - 28, x + 46, y + 28, P.col.a, 4); P.txt(c, 'rétine', x + 46, y - 36, 10, P.col.a, 'center', 800);
    P.circ(c, x - 30, y, 3, col, 1.4, col); c.save(); c.beginPath(); c.ellipse(x - 20, y, 6, 22, 0, 0, 6.2832); c.fillStyle = 'rgba(190,220,240,.7)'; c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.restore(); P.txt(c, 'cristallin', x - 20, y - 34, 10, P.col.soft, 'center');
    if (cor !== 'aucune') { c.save(); c.beginPath(); c.ellipse(x - 62, y, cor === 'conv' ? 7 : 3, 24, 0, 0, 6.2832); c.fillStyle = 'rgba(190,220,240,.6)'; c.fill(); c.strokeStyle = P.col.ink; c.lineWidth = 2; c.stroke(); c.restore(); P.txt(c, 'lunettes', x - 62, y + 38, 10, P.col.ink, 'center', 800); }
    var x0 = x - 90; P.line(c, x0, y - 20, x - 20, y - 14, '#D4A017', 1.8); P.line(c, x0, y + 20, x - 20, y + 14, '#D4A017', 1.8);
    P.line(c, x - 20, y - 14, fx, y, '#D4A017', 1.8); P.line(c, x - 20, y + 14, fx, y, '#D4A017', 1.8); if (fx < x + 46) { P.line(c, fx, y, x + 46, y - (46 - (fx - x)) * 0.6, '#D4A017', 1.4); P.line(c, fx, y, x + 46, y + (46 - (fx - x)) * 0.6, '#D4A017', 1.4); } else { c.save(); c.setLineDash([3, 3]); P.line(c, x + 46, y - 6, fx, y, P.col.soft, 1); c.restore(); }
    P.circ(c, fx, y, 4, P.col.hot, 1.6, P.col.hot); P.txt(c, dc === 0 ? 'image nette ✓' : dc < 0 ? 'devant la rétine' : 'derrière la rétine', x, y + 62, 12, dc === 0 ? P.col.ok : P.col.hot, 'center', 800);
    if (nom) P.txt(c, nom, x, y - 58, 12, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      oeil(c, P, two ? 105 + k * 190 : 190, 120, s.v.defaut, s.v.cor, col, two ? s.nom : ''); c.restore();
    });
  }
  function lig(v) { var dc = decal(v.defaut, v.cor); return [NOM[v.defaut] + ', ' + CN[v.cor] + ' : ' + (dc === 0 ? 'image nette sur la rétine' : dc < 0 ? 'image devant la rétine (vision floue)' : 'image derrière la rétine (vision floue)')]; }
  V.add({
    slug: 'defauts-oeil', defiTitre: 'Les défauts de l’œil : le défi',
    chap: [
      { titre: 'Myope ou hypermétrope', labTitre: 'L’image sur la rétine', cur: 'Pourquoi certains élèves doivent-ils s’asseoir devant pour lire le tableau ?',
        paras: ['L’œil forme une image sur la rétine grâce au cristallin, lentille convergente.', 'Œil myope : l’image se forme devant la rétine. Œil hypermétrope : derrière. Dans les deux cas, la vision est floue.'],
        loi: { t: 'Myope : image devant la rétine', s: 'hypermétrope : image derrière la rétine' }, note: 'Change de défaut, sans lunettes.',
        predis: { q: 'L’image se forme devant la rétine. L’œil est…', opts: ['myope', 'hypermétrope', 'normal'], a: 0, rep: 'Myope.' },
        verif: { q: 'le cristallin se comporte comme une lentille…', o: ['convergente', 'divergente', 'plane'], a: 0, e: 'Convergente.' },
        lab: { w: 380, h: 250, alt: 'Œil avec faisceau et image par rapport à la rétine', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: { cor: 'aucune' } }], choices: [{ id: 'defaut', label: 'Œil', opts: [['normal', 'Normal'], ['myope', 'Myope'], ['hyper', 'Hypermétrope']], val: 'myope' }], read: lig, sound: function (v) { return net(v.defaut, v.cor) ? 420 : 160; } } },
      { titre: 'Corriger avec des lunettes', labTitre: 'Convergente ou divergente ?', cur: 'Pourquoi les lunettes d’un myope et d’un hypermétrope ne sont-elles pas identiques ?',
        paras: ['Le myope porte une lentille divergente : elle recule l’image sur la rétine.', 'L’hypermétrope porte une lentille convergente : elle avance l’image sur la rétine.'],
        loi: { t: 'Myope : lentille divergente', s: 'hypermétrope : lentille convergente' }, note: 'Choisis le verre pour chaque situation.',
        predis: { q: 'Pour corriger un œil hypermétrope, on utilise une lentille…', opts: ['convergente', 'divergente', 'plane'], a: 0, rep: 'Convergente.' },
        verif: { q: 'un myope porte une lentille…', o: ['divergente', 'convergente', 'colorée'], a: 0, e: 'Divergente.' },
        lab: { w: 380, h: 250, alt: 'Deux yeux corrigés par des lentilles différentes', scene: scene, live: false, notrace: true, sit: [{ nom: 'Verre A', vars: {} }, { nom: 'Verre B', vars: {} }], choices: [{ id: 'defaut', label: 'Œil', opts: [['myope', 'Myope'], ['hyper', 'Hypermétrope']], val: 'myope' }, { id: 'cor', label: 'Verre', opts: [['aucune', 'Aucun'], ['conv', 'Convergent'], ['div', 'Divergent']], val: 'aucune', per: true }], read: function (v) { return [lig(v)[0]]; }, sound: function (v) { return net(v.defaut, v.cor) ? 420 : 160; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, quel verre corrige un œil myope ?', o: ['Divergent', 'Convergent', 'Aucun'], a: 0, e: 'Une lentille divergente.' },
        { type: 'qcm', q: 'Un œil hypermétrope forme l’image…', o: ['derrière la rétine', 'devant la rétine', 'sur la rétine'], a: 0, e: 'Derrière la rétine.' }
      ];
    }
  });
})();
