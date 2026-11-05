/* Livre vivant · 4e · Métaux et ions.
   Moment essentiel : un test à la soude donne un précipité de couleur caractéristique selon l'ion métallique (Cu²⁺ bleu, Fe²⁺ vert, Fe³⁺ rouille, Zn²⁺ blanc).
   Chapitre 2 : un métal attaqué par un acide libère des ions et du dihydrogène (Fe → Fe²⁺). Avancement en % : choix de dessin. Manipulation par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant;
  var ION = { Cu: ['Cu²⁺', 'bleu', '#6FA8DC'], Fe2: ['Fe²⁺', 'vert', '#6AA84F'], Fe3: ['Fe³⁺', 'rouille (orangé)', '#C0582B'], Zn: ['Zn²⁺', 'blanc', '#F2F2F2'] };
  var test = V.lois.testSoude = function (id) { return ION[id][1]; };
  function sceneTest(c, X) {
    var P = X.P, s = X.S[0].v, d = ION[s.ion];
    P.poly(c, [[150, 60], [150, 190], [210, 190], [210, 60]], P.col.ink, 2.6); c.fillStyle = 'rgba(190,220,240,.45)'; c.fillRect(152, 110, 56, 78); c.fillStyle = d[2]; c.fillRect(152, 160, 56, 28);
    P.arrow(c, 180, 30, 180, 90, P.col.a, 2.2); P.txt(c, 'soude', 215, 40, 12, P.col.a, 'left', 800);
    P.txt(c, 'précipité ' + d[1], 180, 215, 14, P.col.ink, 'center', 800); P.txt(c, 'ion ' + d[0], 180, 20, 13, P.col.ink, 'center', 800);
  }
  function sceneAtt(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var p = +s.v.p, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 25 + k * 185, i; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.poly(c, [[x0, 60], [x0, 190], [x0 + 120, 190], [x0 + 120, 60]], col, 2.6); c.fillStyle = 'rgba(106,168,79,' + (0.08 + 0.4 * p / 100).toFixed(2) + ')'; c.fillRect(x0 + 2, 100, 116, 88);
      P.rect(c, x0 + 45, 120 + p * 0.2, 30, 60 - p * 0.4, col, 2.4, '#9AA0A8');
      for (i = 0; i < Math.round(p / 15); i++) P.circ(c, x0 + 15 + (i * 31) % 90, 175 - (i * 23) % 60, 3, P.col.a, 1.4, null);
      P.txt(c, p === 0 ? 'avant' : p + ' % : Fe → Fe²⁺ + H₂', x0 + 60, 210, 11, col, 'center', 800); P.txt(c, s.nom, x0 + 60, 24, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'metal-ion', defiTitre: 'Métaux et ions : le défi',
    chap: [
      { titre: 'Reconnaître un ion', labTitre: 'Le test à la soude', cur: 'Comment reconnaît-on le cuivre ou le fer dans une solution ?',
        paras: ['On ajoute de la soude dans la solution. Selon l’ion, un précipité de couleur différente apparaît.', 'Cu²⁺ : bleu · Fe²⁺ : vert · Fe³⁺ : rouille · Zn²⁺ : blanc.'],
        loi: { t: 'Test à la soude : précipité coloré', s: 'Cu²⁺ bleu · Fe²⁺ vert · Fe³⁺ rouille · Zn²⁺ blanc' }, note: 'Manipulation réelle guidée par le professeur (soude corrosive, lunettes).',
        predis: { q: 'Un précipité vert apparaît avec la soude. L’ion est…', opts: ['Fe²⁺', 'Cu²⁺', 'Zn²⁺'], a: 0, rep: 'Fe²⁺, ion fer II.' },
        verif: { q: 'le précipité bleu caractérise…', o: ['Cu²⁺', 'Fe³⁺', 'Zn²⁺'], a: 0, e: 'Cu²⁺.' },
        lab: { w: 360, h: 240, alt: 'Tube avec précipité coloré après ajout de soude', scene: sceneTest, live: false, notrace: true, sit: [{ nom: '', vars: {} }], choices: [{ id: 'ion', label: 'Ion testé', opts: [['Cu', 'Cu²⁺'], ['Fe2', 'Fe²⁺'], ['Fe3', 'Fe³⁺'], ['Zn', 'Zn²⁺']], val: 'Cu' }],
          read: function (v) { return ['<b>Précipité ' + test(v.ion) + ' : ion ' + ION[v.ion][0] + '</b>']; }, sound: function (v) { return 250 + 60 * Object.keys(ION).indexOf(v.ion); } } },
      { titre: 'Un métal attaqué', labTitre: 'Fer et acide', cur: 'Où va le fer quand un acide le ronge ?',
        paras: ['Un acide attaque certains métaux : les atomes passent dans la solution sous forme d’ions, et du dihydrogène se dégage.', 'Le métal diminue. On reconnaît ensuite l’ion Fe²⁺ par le précipité vert avec la soude.'],
        loi: { t: 'Fer + acide → ions Fe²⁺ + dihydrogène', s: 'le métal diminue' }, note: 'Compare deux moments. Acide manipulé par le professeur.',
        predis: { q: 'Le fer est attaqué par un acide. Dans la solution, on trouve…', opts: ['des ions Fe²⁺', 'des atomes de fer solides', 'de l’huile'], a: 0, rep: 'Des ions Fe²⁺.' },
        verif: { q: 'le gaz qui se dégage est…', o: ['le dihydrogène', 'le dioxygène', 'le dioxyde de carbone'], a: 0, e: 'Le dihydrogène.' },
        lab: { w: 360, h: 240, alt: 'Morceau de fer dans un acide, ions et bulles', scene: sceneAtt, live: false, notrace: true, sit: [{ nom: 'Début', vars: {} }, { nom: 'Plus tard', vars: {} }], inputs: [{ id: 'p', label: 'Avancement', min: 0, max: 100, step: 10, val: [20, 80], per: true, unit: '%', dec: 0 }],
          read: function (v) { return +v.p === 0 ? ['<b>Avant la réaction</b>'] : ['<b>Le fer devient des ions Fe²⁺</b>', 'Le dihydrogène se dégage.']; }, sound: function (v) { return 180 + 3 * +v.p; } } }
    ],
    manches: function (LV) {
      var ion = LV[0] && ION[LV[0].ion] ? LV[0].ion : 'Cu';
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as testé l’ion ' + ION[ion][0] + ' avec la soude. Quelle couleur de précipité ?', o: [ION[ion][1], 'noir', 'jaune'].filter(function (x, i, t) { return t.indexOf(x) === i; }), a: 0, e: ION[ion][0] + ' : précipité ' + ION[ion][1] + '.' },
        { type: 'qcm', q: 'Quand le fer est attaqué par un acide, le fer…', o: ['diminue et forme des ions', 'augmente', 'reste identique'], a: 0, e: 'Fe → Fe²⁺.' }
      ];
    }
  });
})();
