/* Livre vivant · 5e · Combustion du carbone.
   Moment essentiel : C + O₂ → CO₂ ; on avance la réaction, les atomes se réarrangent sans se perdre (CPK : C gris foncé, O rouge).
   Chapitre 2 : le test à l'eau de chaux : seul le dioxyde de carbone la trouble. Expérience réelle guidée par le professeur. 5 atomes de C et 5 molécules de O₂ sur le dessin : choix de dessin. */
(function () {
  'use strict';
  var V = window.Vivant;
  var bilan = V.lois.bilanCarbone = function (n) { n = Math.round(n); return { C: 5 - n, O2: 5 - n, CO2: n, atomesC: 5, atomesO: 10 }; };
  var KC = '#444B55', KO = '#E23B3B';
  function atome(c, P, x, y, col, r) { P.circ(c, x, y, r || 7, P.col.ink, 1.4, col); }
  function sceneReac(c, X) {
    var P = X.P, n = Math.round(+X.S[0].v.n), i;
    for (i = 0; i < 5; i++) {
      var x = 55 + i * 62, y = 80, y2 = 160;
      if (i < n) { atome(c, P, x - 11, y + 40, KO); atome(c, P, x, y + 40, KC, 8); atome(c, P, x + 11, y + 40, KO); }
      else { atome(c, P, x, y, KC, 8); atome(c, P, x - 6, y2, KO); atome(c, P, x + 6, y2, KO); }
    }
    P.txt(c, 'C + O₂ → CO₂', 180, 24, 15, P.col.ink, 'center', 800);
    P.txt(c, 'atomes C : 5 · atomes O : 10 (toujours)', 180, 236, 12, P.col.ok, 'center', 800);
    P.txt(c, n + ' CO₂ formé' + (n > 1 ? 's' : ''), 180, 210, 13, P.col.ink, 'center', 800);
  }
  function sceneChaux(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, g = s.v.gaz, trouble = g === 'CO2', x0 = 20 + k * 185; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.poly(c, [[x0 + 30, 70], [x0 + 30, 190], [x0 + 130, 190], [x0 + 130, 70]], col, 2.6); c.fillStyle = trouble ? 'rgba(235,235,235,.95)' : 'rgba(190,220,240,.45)'; c.fillRect(x0 + 32, 120, 96, 68);
      P.line(c, x0 + 5, 60, x0 + 80, 150, P.col.soft, 2); P.txt(c, g === 'CO2' ? 'CO₂' : g === 'O2' ? 'O₂' : 'N₂', x0 + 5, 48, 14, P.col.ink, 'center', 800);
      P.txt(c, trouble ? 'troublée (blanche)' : 'limpide', x0 + 80, 210, 12, trouble ? P.col.hot : P.col.ok, 'center', 800); P.txt(c, s.nom, x0 + 80, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'combustion-carbone', defiTitre: 'La combustion du carbone : le défi',
    chap: [
      { titre: 'Carbone et dioxygène', labTitre: 'C + O₂ → CO₂', cur: 'Où va le charbon de bois quand il brûle ?',
        paras: ['Quand le carbone brûle dans le dioxygène, il se forme du dioxyde de carbone : carbone + dioxygène → dioxyde de carbone.', 'Les atomes se réarrangent : leur nombre ne change pas. Il y a toujours 5 atomes de carbone et 10 atomes d’oxygène sur le dessin.'],
        loi: { t: 'C + O₂ → CO₂', s: 'les atomes se conservent' }, note: 'Avance la réaction : on compte les atomes avant et après.',
        predis: { q: 'Quand le carbone brûle, le nombre d’atomes de carbone…', opts: ['ne change pas', 'diminue', 'double'], a: 0, rep: 'Il ne change pas : les atomes se conservent.' },
        verif: { q: 'le carbone brûle et forme…', o: ['du dioxyde de carbone', 'de l’eau', 'du diazote'], a: 0, e: 'C + O₂ → CO₂.' },
        lab: { w: 360, h: 250, alt: 'Atomes de carbone et molécules de dioxygène se transformant en dioxyde de carbone', scene: sceneReac, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'n', label: 'Avancement', min: 0, max: 5, step: 1, val: 2, unit: 'CO₂', dec: 0 }],
          read: function (v) { var b = bilan(v.n); return ['<b>' + b.C + ' C + ' + b.O2 + ' O₂ → ' + b.CO2 + ' CO₂</b>', 'Atomes : ' + b.atomesC + ' C et ' + b.atomesO + ' O, avant comme après.']; }, sound: function (v) { return 200 + 40 * +v.n; } } },
      { titre: 'Le test à l’eau de chaux', labTitre: 'Reconnaître le dioxyde de carbone', cur: 'Comment prouver qu’un gaz est du dioxyde de carbone ?',
        paras: ['L’eau de chaux limpide devient trouble (blanche) en présence de dioxyde de carbone.', 'Le dioxygène et le diazote ne la troublent pas.'],
        loi: { t: 'Eau de chaux troublée : dioxyde de carbone', s: 'test caractéristique du CO₂' }, note: 'Manipulation réelle faite avec le professeur.',
        predis: { q: 'Un gaz trouble l’eau de chaux. C’est…', opts: ['du dioxyde de carbone', 'du dioxygène', 'du diazote'], a: 0, rep: 'Le dioxyde de carbone.' },
        verif: { q: 'l’eau de chaux reste limpide avec…', o: ['le dioxygène', 'le dioxyde de carbone', 'aucun gaz'], a: 0, e: 'Seul le CO₂ la trouble.' },
        lab: { w: 360, h: 250, alt: 'Tube d’eau de chaux dans lequel on fait barboter un gaz', scene: sceneChaux, live: false, notrace: true, sit: [{ nom: 'Tube A', vars: {} }, { nom: 'Tube B', vars: {} }], choices: [{ id: 'gaz', label: 'Gaz', opts: [['O2', 'O₂'], ['N2', 'N₂'], ['CO2', 'CO₂']], val: 'O2', per: true }],
          read: function (v) { return [v.gaz === 'CO2' ? 'Eau de chaux troublée : CO₂' : 'Eau de chaux limpide : pas de CO₂']; }, sound: function (v) { return v.gaz === 'CO2' ? 420 : 200; } } }
    ],
    manches: function (LV) {
      var n = LV[0] && LV[0].n != null ? Math.round(+LV[0].n) : 2;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, ' + n + ' molécules de CO₂ sont formées. Combien d’atomes d’oxygène contiennent-elles ?', ans: 2 * n, tol: 0.1, unit: 'atomes', e: 'Chaque CO₂ contient 2 atomes d’oxygène : ' + n + ' × 2 = ' + 2 * n + '.' },
        { type: 'qcm', q: 'Quel test reconnaît le dioxyde de carbone ?', o: ['L’eau de chaux qui se trouble', 'La flamme qui s’éteint', 'Le papier qui rougit'], a: 0, e: 'L’eau de chaux se trouble.' }
      ];
    }
  });
})();
