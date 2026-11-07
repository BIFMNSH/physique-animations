/* Livre vivant · 5e · Combustion du soufre.
   Moment essentiel : S + O₂ → SO₂ ; atomes conservés (CPK : S jaune, O rouge). Le dioxyde de soufre est un gaz piquant et irritant.
   Chapitre 2 : précautions : la manipulation se fait uniquement par le professeur, sous hotte. 5 S + 5 O₂ sur le dessin : choix de dessin. */
(function () {
  'use strict';
  var V = window.Vivant;
  var bilan = V.lois.bilanSoufre = function (n) { n = Math.round(n); return { S: 5 - n, O2: 5 - n, SO2: n, atomesS: 5, atomesO: 10 }; };
  var KS = '#E8D12A', KO = '#E23B3B';
  function atome(c, P, x, y, col, r) { P.circ(c, x, y, r || 7, P.col.ink, 1.4, col); }
  function sceneReac(c, X) {
    var P = X.P, n = Math.round(+X.S[0].v.n), i;
    for (i = 0; i < 5; i++) {
      var x = 55 + i * 62;
      if (i < n) { atome(c, P, x - 11, 120, KO); atome(c, P, x, 120, KS, 9); atome(c, P, x + 11, 120, KO); }
      else { atome(c, P, x, 80, KS, 9); atome(c, P, x - 6, 160, KO); atome(c, P, x + 6, 160, KO); }
    }
    P.txt(c, 'S + O₂ → SO₂', 180, 24, 15, P.col.ink, 'center', 800); P.txt(c, 'atomes S : 5 · atomes O : 10 (toujours)', 180, 236, 12, P.col.ok, 'center', 800);
    if (n > 0) P.txt(c, 'flamme bleue · gaz piquant', 180, 205, 12, P.col.a, 'center', 800);
  }
  function sceneSecu(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var h = s.v.lieu === 'hotte', x0 = 20 + k * 185, i; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0, 50, 160, 140, h ? P.col.ok : P.col.hot, 2.8, P.col.paper); c.fillStyle = 'rgba(255,190,40,.9)'; c.beginPath(); c.ellipse(x0 + 80, 160, 8, 15, 0, 0, 6.2832); c.fill();
      if (h) { P.arrow(c, x0 + 80, 100, x0 + 80, 56, P.col.ok, 2.4); P.txt(c, 'gaz aspiré', x0 + 115, 76, 11, P.col.ok, 'left', 800); } else for (i = 0; i < 5; i++) P.txt(c, '~', x0 + 20 + i * 30, 100 + (i % 2) * 18, 16, P.col.hot, 'center', 800);
      P.txt(c, h ? 'sous hotte' : 'à l’air libre', x0 + 80, 40, 12, h ? P.col.ok : P.col.hot, 'center', 800); P.txt(c, h ? 'par le professeur' : 'DANGER : gaz irritant', x0 + 80, 212, 12, h ? P.col.ok : P.col.hot, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'combustion-soufre', defiTitre: 'La combustion du soufre : le défi',
    chap: [
      { titre: 'Soufre et dioxygène', labTitre: 'S + O₂ → SO₂', cur: 'Quel est ce gaz piquant quand on brûle du soufre ?',
        paras: ['Le soufre brûle avec une flamme bleue dans le dioxygène : soufre + dioxygène → dioxyde de soufre.', 'Ce gaz est piquant et irritant. Les atomes se conservent.'],
        loi: { t: 'S + O₂ → SO₂', s: 'gaz piquant · atomes conservés' }, note: 'Avance la réaction : 5 S et 10 O avant comme après.',
        predis: { q: 'Quand le soufre brûle, il se forme…', opts: ['du dioxyde de soufre', 'du dioxyde de carbone', 'de l’eau'], a: 0, rep: 'Du dioxyde de soufre, gaz piquant.' },
        verif: { q: 'dans SO₂, il y a…', o: ['1 S et 2 O', '2 S et 1 O', '1 S et 1 O'], a: 0, e: '1 atome de soufre et 2 atomes d’oxygène.' },
        lab: { w: 360, h: 250, alt: 'Atomes de soufre et molécules de dioxygène se transformant en dioxyde de soufre', scene: sceneReac, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'n', label: 'Avancement', min: 0, max: 5, step: 1, val: 2, unit: 'SO₂', dec: 0 }],
          read: function (v) { var b = bilan(v.n); return ['<b>' + b.S + ' S + ' + b.O2 + ' O₂ → ' + b.SO2 + ' SO₂</b>', 'Atomes : ' + b.atomesS + ' S et ' + b.atomesO + ' O, avant comme après.']; }, sound: function (v) { return 200 + 40 * +v.n; } } },
      { titre: 'Précautions', labTitre: 'Où brûler du soufre ?', cur: 'Pourquoi cette expérience ne se fait-elle jamais seul ?',
        paras: ['Le dioxyde de soufre irrite le nez, la gorge et les yeux.', 'Seul le professeur brûle le soufre, sous hotte, loin des élèves.'],
        loi: { t: 'Soufre : sous hotte, par le professeur', s: 'gaz irritant, jamais à l’air libre' }, note: 'Simulation : compare les deux lieux.',
        predis: { q: 'Le soufre brûle…', opts: ['sous hotte, par le professeur', 'sur ton bureau', 'dans ton sac'], a: 0, rep: 'Sous hotte, par le professeur.' },
        verif: { q: 'le dioxyde de soufre est…', o: ['irritant', 'sans danger', 'sans odeur'], a: 0, e: 'Il est piquant et irritant.' },
        lab: { w: 360, h: 250, alt: 'Combustion du soufre sous hotte ou à l’air libre', scene: sceneSecu, live: false, notrace: true, sit: [{ nom: 'Situation A', vars: {} }, { nom: 'Situation B', vars: {} }], choices: [{ id: 'lieu', label: 'Lieu', opts: [['libre', 'Air libre'], ['hotte', 'Sous hotte']], val: 'libre', per: true }],
          read: function (v) { return [v.lieu === 'hotte' ? 'Sous hotte : le gaz est aspiré' : 'Danger : gaz irritant dans la salle']; }, sound: function (v) { return v.lieu === 'hotte' ? 420 : 140; } } }
    ],
    manches: function (LV) {
      var n = LV[0] && LV[0].n != null ? Math.round(+LV[0].n) : 2;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, ' + n + ' molécules de SO₂ sont formées. Combien d’atomes d’oxygène contiennent-elles ?', ans: 2 * n, tol: 0.1, unit: 'atomes', e: n + ' × 2 = ' + 2 * n + ' atomes d’oxygène.' },
        { type: 'qcm', q: 'Où brûle-t-on du soufre ?', o: ['Sous hotte, par le professeur', 'Dans la classe, tous ensemble', 'Dehors, sans protection'], a: 0, e: 'Le gaz est irritant.' }
      ];
    }
  });
})();
