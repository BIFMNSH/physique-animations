/* Livre vivant · 5e · Propriétés physiques de la matière · Dilatation des liquides.
   Moment essentiel : on chauffe le liquide d'un thermomètre ; il monte dans le tube parce que son volume augmente, avec toujours 14 particules de même taille.
   Qualitatif : chauffage en pourcentage (non à l'échelle) ; l'alcool se dilate davantage que l'eau (coefficients du dessin non chiffrés). */
(function () {
  'use strict';
  var V = window.Vivant, X0 = 20;
  var haut = V.lois.niveauLiquideDil = function (x, k) { return 30 + k * 1.1 * x; };
  function thermo(c, P, cx, x, k, col, anim) {
    var h = haut(x, k), bulb = 210;
    P.circ(c, cx, bulb, 17, P.col.ink, 2.6, P.col.paper); P.rect(c, cx - 6, 36, 12, 172, P.col.ink, 2.4, P.col.paper);
    c.fillStyle = col; c.beginPath(); c.arc(cx, bulb, 14, 0, 6.2832); c.fill(); c.fillRect(cx - 3, 205 - h, 6, h);
    P.line(c, cx - 6, 205 - 30, cx + 6, 205 - 30, P.col.soft, 1.3); P.txt(c, 'niveau départ', cx + 12, 205 - 30, 10, P.col.soft, 'left');
  }
  function scene(c, X) {
    var P = X.P, S = X.S, two = S.length > 1, i;
    S.forEach(function (s, k) {
      var x = +s.v.x, kk = +s.v.k, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, cx = two ? 95 + 190 * k : 110;
      c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1; thermo(c, P, cx, x, kk, s.v.liq === 'eau' ? '#3B82F6' : '#D64545', X.anim);
      P.txt(c, x > X0 + 5 ? 'chauffé' : x < X0 - 5 ? 'refroidi' : 'ambiante', cx, 252, 12, P.col.soft, 'center');
      if (two) P.txt(c, s.nom, cx, 20, 13, col, 'center', 800); c.restore();
    });
    if (!two) {
      var s0 = S[0], x0 = +s0.v.x, hh = 50 + 0.9 * x0, bx = 210, by = 215 - hh;
      var st = scene.parts || (scene.parts = V.sim.cree(14, { x: bx, y: 40, w: 130, h: 175 }, 9));
      P.rect(c, bx, by, 130, hh, P.col.ink, 2.4, 'rgba(214,69,69,.10)'); V.sim.pas(st, { x: bx, y: by, w: 130, h: hh }, X.anim ? 0.9 + x0 * 0.01 : 0, 1, 5);
      st.forEach(function (p) { P.circ(c, p.x, p.y, 4.5, P.col.ink, 1.6, 'rgba(214,69,69,.65)'); });
      P.txt(c, '14 particules, toujours', bx + 65, 232, 11, P.col.soft, 'center'); P.txt(c, 'volume du liquide', bx + 65, 28, 12, P.col.soft, 'center');
    }
  }
  function lig(v) {
    var x = +v.x, t = x > X0 ? 'Chauffé : le volume du liquide augmente, il monte dans le tube.' : x < X0 ? 'Refroidi : le volume diminue, le niveau descend.' : 'À la température ambiante : niveau de départ.';
    return v.liq ? ['<b>' + t + '</b>'] : ['<b>' + t + '</b>', 'Les particules s’écartent ; elles ne grossissent pas, la masse ne change pas.'];
  }
  var x1 = { id: 'x', label: 'Chauffage', min: 0, max: 100, step: 5, val: 60, unit: '%', dec: 0 };
  var base = { w: 380, h: 270, live: true, notrace: true, read: lig, inputs: [x1], sound: function (v) { return 150 + 5 * +v.x; }, scene: scene };
  V.add({
    slug: 'dilatation-liquides', defiTitre: 'Dilatation des liquides : le défi',
    chap: [
      { titre: 'Le thermomètre', labTitre: 'Chauffer le liquide d’un thermomètre', cur: 'Pourquoi le liquide monte-t-il dans le tube d’un thermomètre ?',
        paras: ['Un liquide chauffé se dilate : son volume augmente. Comme le tube est étroit, il monte beaucoup.', 'Sa masse ne change pas : les particules s’écartent, elles ne grossissent pas.'],
        loi: { t: 'Chauffé, un liquide se dilate', s: 'volume plus grand, masse inchangée' }, note: 'Avance le chauffage : le niveau monte, les particules gardent leur taille. Dessin non à l’échelle.',
        predis: { q: 'Le liquide d’un thermomètre monte quand on le chauffe parce que…', opts: ['il y a plus de liquide', 'son volume augmente', 'le verre rétrécit'], a: 1, rep: 'Son volume augmente : même quantité de liquide, mais plus de place occupée.' },
        verif: { q: 'quand un liquide se dilate, sa masse…', o: ['augmente', 'reste la même', 'diminue'], a: 1, e: 'La masse se conserve.' },
        lab: Object.assign({}, base, { alt: 'Thermomètre dont le liquide monte et particules du liquide', sit: [{ nom: '', vars: { k: 1, liq: 0 } }] }) },
      { titre: 'Alcool ou eau ?', labTitre: 'Deux liquides, un même chauffage', cur: 'Pourquoi met-on de l’alcool coloré dans beaucoup de thermomètres ?',
        paras: ['Tous les liquides ne se dilatent pas autant : l’alcool se dilate plus que l’eau pour un même chauffage.', 'C’est pourquoi il monte plus visiblement dans le tube.'],
        loi: { t: 'Chaque liquide se dilate à sa façon', s: 'l’alcool se dilate davantage que l’eau' }, note: 'Compare en alternance : même chauffage, deux liquides.',
        predis: { q: 'Même chauffage pour de l’eau et de l’alcool dans deux tubes identiques. Le niveau monte…', opts: ['pareil', 'plus pour l’alcool', 'plus pour l’eau'], a: 1, rep: 'Plus pour l’alcool : il se dilate davantage que l’eau.' },
        verif: { q: 'tous les liquides se dilatent…', o: ['exactement de la même façon', 'chacun à sa façon', 'jamais'], a: 1, e: 'Chaque liquide a sa dilatation.' },
        lab: Object.assign({}, base, { alt: 'Deux thermomètres : alcool et eau', sit: [{ nom: 'Alcool', vars: { k: 1, liq: 'alcool' } }, { nom: 'Eau', vars: { k: 0.4, liq: 'eau' } }] }) }
    ],
    manches: function (LV) {
      var x = LV[0] && LV[0].x != null ? +LV[0].x : 60, a = x > X0 ? 0 : x < X0 ? 1 : 2;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé le chauffage à ' + x + ' % (20 % = température ambiante). Le niveau du liquide…', o: ['monte', 'descend', 'reste au niveau de départ'], a: a, e: a === 0 ? 'Chauffé, le liquide se dilate : son volume augmente.' : a === 1 ? 'Refroidi, le liquide se contracte : son niveau descend.' : 'À la température ambiante, il reste au niveau de départ.' },
        { type: 'qcm', q: 'Quand on chauffe un liquide, sa masse…', o: ['augmente', 'reste la même', 'diminue'], a: 1, e: 'Sa masse ne change pas : seul son volume augmente.' }
      ];
    }
  });
})();
