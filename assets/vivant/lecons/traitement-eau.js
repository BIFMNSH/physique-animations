/* Livre vivant · 4e · Traitement de l'eau.
   Moment essentiel : de l'eau brute à l'eau potable : décantation (grosses particules), filtration (fines particules), désinfection au chlore (micro-organismes).
   Chapitre 2 : chaque étape a un rôle ; il faut toutes les étapes. Qualitatif, schéma simplifié. */
(function () {
  'use strict';
  var V = window.Vivant;
  var ETAPES = ['eau brute', 'après décantation', 'après filtration', 'après désinfection'];
  var etat = V.lois.etatTraitement = function (n) { n = Math.round(n); return { boue: n < 1 ? 'grosse' : n < 2 ? 'fine' : 'aucune', limpide: n >= 2, germes: n < 3, potable: n >= 3 }; };
  var traite = V.lois.traitement = function (t) { return { limpide: t === 'filtre' || t === 'complet', germes: !(t === 'chlore' || t === 'complet'), potable: t === 'complet' }; };
  function verre(c, P, x, y, e, col, titre) {
    P.poly(c, [[x, y], [x + 8, y + 90], [x + 82, y + 90], [x + 90, y]], col, 2.4); var teinte = !e.limpide ? 'rgba(160,120,70,.55)' : 'rgba(180,215,240,.5)'; c.fillStyle = teinte; c.beginPath(); c.moveTo(x + 4, y + 20); c.lineTo(x + 8, y + 88); c.lineTo(x + 82, y + 88); c.lineTo(x + 86, y + 20); c.closePath(); c.fill();
    var i; if (e.boue === 'grosse') for (i = 0; i < 6; i++) P.circ(c, x + 16 + (i * 13) % 58, y + 32 + (i * 17) % 44, 5, null, 0, '#6B4F2A');
    if (e.germes) for (i = 0; i < 4; i++) P.circ(c, x + 22 + (i * 16) % 50, y + 40 + (i * 19) % 36, 2.4, P.col.hot, 1.2, '#E23B3B');
    P.txt(c, titre, x + 45, y - 12, 11, col, 'center', 800);
  }
  function sceneEt(c, X) {
    var P = X.P, n = Math.round(+X.S[0].v.n), e = etat(n);
    verre(c, P, 135, 60, e, P.col.ink, ETAPES[n]);
    P.txt(c, e.potable ? '✓ eau potable' : 'à ne pas boire', 180, 190, 14, e.potable ? P.col.ok : P.col.hot, 'center', 800);
    P.txt(c, (e.boue !== 'aucune' ? 'particules' : 'sans particules') + (e.germes ? ' · germes présents' : ' · germes détruits'), 180, 212, 11, P.col.soft, 'center', 800);
    [0, 1, 2, 3].forEach(function (k) { P.circ(c, 60 + k * 80, 240, 7, P.col.ink, 1.8, k <= n ? P.col.ok : P.col.paper); });
  }
  function sceneCmp(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, r = traite(s.v.trait), x0 = 30 + k * 185, e = { limpide: r.limpide, germes: r.germes, boue: r.limpide ? 'aucune' : 'grosse' }; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      verre(c, P, x0 + 5, 60, e, col, s.nom); P.txt(c, r.potable ? '✓ potable' : r.limpide ? 'limpide, mais germes' : r.germes ? 'trouble et germes' : 'désinfectée, mais trouble', x0 + 50, 175, 12, r.potable ? P.col.ok : P.col.hot, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'traitement-eau', defiTitre: 'Le traitement de l’eau : le défi',
    chap: [
      { titre: 'Les étapes de la potabilisation', labTitre: 'De l’eau brute à l’eau potable', cur: 'Comment l’eau du fleuve devient-elle l’eau du robinet ?',
        paras: ['La décantation laisse les grosses particules se déposer. La filtration retient les fines particules.', 'La désinfection, avec du chlore, détruit les micro-organismes : l’eau devient potable.'],
        loi: { t: 'Décantation · filtration · désinfection', s: 'eau potable : sans particules ni germes' }, note: 'Avance étape par étape.',
        predis: { q: 'Quelle étape détruit les micro-organismes ?', opts: ['la désinfection', 'la décantation', 'la filtration'], a: 0, rep: 'La désinfection (chlore).' },
        verif: { q: 'la décantation retire…', o: ['les grosses particules', 'les germes', 'le sel'], a: 0, e: 'Les grosses particules se déposent.' },
        lab: { w: 360, h: 260, alt: 'Verre d’eau à chaque étape de traitement', scene: sceneEt, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'n', label: 'Étape', min: 0, max: 3, step: 1, val: 0, unit: '', dec: 0 }],
          read: function (v) { var e = etat(+v.n); return ['<b>' + ETAPES[Math.round(+v.n)] + (e.potable ? ' : eau potable' : '') + '</b>', e.germes ? 'Des germes sont encore présents.' : 'Plus de germes.']; }, sound: function (v) { return 200 + 80 * +v.n; } } },
      { titre: 'Toutes les étapes', labTitre: 'Filtre seul ou chlore seul ?', cur: 'Pourquoi un simple filtre ne rend-il pas l’eau potable ?',
        paras: ['Un filtre rend l’eau limpide mais ne détruit pas tous les germes.', 'Le chlore détruit les germes mais n’enlève pas les particules. Il faut les deux étapes.'],
        loi: { t: 'Filtre : limpide · chlore : sans germes', s: 'il faut toutes les étapes' }, note: 'Compare deux traitements.',
        predis: { q: 'Une eau filtrée mais non désinfectée est…', opts: ['limpide mais peut contenir des germes', 'forcément potable', 'toujours trouble'], a: 0, rep: 'Limpide, mais peut contenir des germes.' },
        verif: { q: 'l’eau potable a subi…', o: ['toutes les étapes', 'seulement un filtre', 'aucune étape'], a: 0, e: 'Toutes les étapes.' },
        lab: { w: 380, h: 240, alt: 'Deux verres d’eau après des traitements différents', scene: sceneCmp, live: false, notrace: true, sit: [{ nom: 'Traitement A', vars: {} }, { nom: 'Traitement B', vars: {} }], choices: [{ id: 'trait', label: 'Traitement', opts: [['filtre', 'Filtre seul'], ['chlore', 'Chlore seul'], ['complet', 'Complet']], val: 'filtre', per: true }],
          read: function (v) { var r = traite(v.trait); return [r.potable ? 'Eau potable' : r.limpide ? 'Limpide mais germes : non potable' : 'Désinfectée mais trouble : non potable']; }, sound: function (v) { return traite(v.trait).potable ? 440 : 160; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, à quelle étape l’eau devient-elle potable ?', o: ['Après la désinfection', 'Après la décantation', 'Avant le traitement'], a: 0, e: 'Après toutes les étapes.' },
        { type: 'qcm', q: 'Awa filtre de l’eau trouble. Peut-elle la boire ?', o: ['Non : il reste des germes possibles', 'Oui : elle est limpide', 'Oui : le filtre désinfecte'], a: 0, e: 'Il faut aussi désinfecter.' }
      ];
    }
  });
})();
