/* Livre vivant · 5e · Mélanges et réactions chimiques · Les mélanges.
   Moment essentiel : on choisit un mélange (eau + sable, eau salée, eau + huile) et une technique (filtration, décantation, évaporation) ; le dessin montre ce qui est séparé ou non.
   Tableau de résultats qualitatif, sans valeur chiffrée. L'évaporation sépare mais perd l'eau (la distillation, qui la récupère, n'est pas traitée). Chauffage par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant;
  var MIX = { sable: { n: 'eau + sable', het: true }, sel: { n: 'eau salée', het: false }, huile: { n: 'eau + huile', het: true } };
  var TECH = { filtration: 'filtration', decantation: 'décantation', evaporation: 'évaporation' };
  var RES = {
    'sable.filtration': ['ok', 'Le sable reste sur le papier filtre, l’eau claire passe.'], 'sable.decantation': ['ok', 'Le sable se dépose au fond : on verse doucement l’eau claire.'], 'sable.evaporation': ['perte', 'L’eau part en vapeur, le sable reste. Mais l’eau est perdue.'],
    'sel.filtration': ['non', 'Le sel dissous traverse le papier filtre avec l’eau.'], 'sel.decantation': ['non', 'Le sel dissous ne se dépose pas.'], 'sel.evaporation': ['perte', 'L’eau part en vapeur, des cristaux de sel restent. Mais l’eau est perdue.'],
    'huile.filtration': ['non', 'L’huile et l’eau traversent ensemble le papier filtre.'], 'huile.decantation': ['ok', 'L’huile flotte sur l’eau : on soutire l’eau par le bas.'], 'huile.evaporation': ['perte', 'L’eau part en vapeur, l’huile reste. L’eau est perdue (et chauffer de l’huile est dangereux).']
  };
  var res = V.lois.resultatMelange = function (m, t) { return RES[m + '.' + t] || ['non', '']; };
  var EAU = 'rgba(80,150,230,.35)', SABLE = '#B08A52', HUILE = 'rgba(240,200,40,.85)';
  function bec(c, P, x, y, w, h, m, etat) { /* etat : 'melange' | 'separe' | 'clair' */
    var sep = etat === 'separe', top = y + h * 0.15, i;
    c.fillStyle = EAU; c.fillRect(x + 1, top, w - 2, h - h * 0.15 - 1);
    if (m === 'huile') { var hy = sep ? top : top + 2, hh = h * 0.28; c.fillStyle = HUILE; c.fillRect(x + 1, hy, w - 2, hh); }
    if (m === 'sable' && etat !== 'clair') for (i = 0; i < 14; i++) { var px = x + 6 + ((i * 37) % (w - 12)), py = sep ? y + h - 6 - (i % 3) * 3 : top + 6 + ((i * 53) % (h * 0.7)); P.circ(c, px, py, 2.2, null, 0, SABLE); }
    if (m === 'sel' && etat !== 'clair') for (i = 0; i < 18; i++) P.circ(c, x + 5 + ((i * 41) % (w - 10)), top + 5 + ((i * 29) % (h * 0.75)), 1.3, null, 0, 'rgba(255,255,255,.9)');
    P.poly(c, [[x, y], [x, y + h], [x + w, y + h], [x + w, y]], V.P.col.ink, 2.4);
  }
  function bloc(c, X, s, nom, col) {
    var P = X.P, m = s.v.m, t = s.v.tech, r = res(m, t), ok = r[0] !== 'non', i;
    bec(c, P, 50, 28, 56, 72, m, 'melange'); P.txt(c, MIX[m].n, 78, 112, 11, P.col.soft, 'center', 800);
    P.arrow(c, 116, 64, 160, 64, P.col.soft, 2.2); P.txt(c, TECH[t], 138, 44, 12, col, 'center', 800);
    if (t === 'filtration') {
      P.poly(c, [[190, 22], [250, 22], [226, 52], [214, 52]], P.col.ink, 2.2, P.col.paper, true); P.line(c, 220, 52, 220, 60, P.col.ink, 2.2);
      if (m === 'sable' && ok) for (i = 0; i < 7; i++) P.circ(c, 208 + (i * 9) % 26, 44 - (i % 3) * 3, 2.2, null, 0, SABLE);
      bec(c, P, 196, 62, 48, 44, m, ok ? 'clair' : 'melange'); P.txt(c, ok ? 'filtrat' : 'rien n’est séparé', 220, 118, 11, ok ? P.col.ok : P.col.hot, 'center', 800);
    } else if (t === 'decantation') {
      bec(c, P, 190, 28, 56, 72, m, ok ? 'separe' : 'melange'); P.txt(c, ok ? 'séparés' : 'rien n’est séparé', 218, 112, 11, ok ? P.col.ok : P.col.hot, 'center', 800);
    } else {
      P.poly(c, [[186, 98], [254, 98], [246, 108], [194, 108]], P.col.ink, 2.2, P.col.paper, true);
      if (m === 'sable') for (i = 0; i < 9; i++) P.circ(c, 206 + (i * 7) % 28, 95 - (i % 3) * 2, 2.4, null, 0, SABLE);
      if (m === 'sel') for (i = 0; i < 8; i++) P.rect(c, 204 + (i * 8) % 30, 92 - (i % 2) * 3, 4, 4, P.col.soft, 1, '#FFFFFF');
      if (m === 'huile') { c.fillStyle = HUILE; c.beginPath(); c.ellipse(220, 96, 26, 4, 0, 0, 6.2832); c.fill(); }
      for (i = 0; i < 3; i++) { var vx = 200 + i * 20; P.poly(c, [[vx, 82], [vx + 5, 72], [vx - 2, 62], [vx + 4, 52]], P.col.soft, 1.6); }
      P.txt(c, 'vapeur d’eau', 220, 40, 11, P.col.soft, 'center'); P.txt(c, 'l’eau est perdue', 220, 122, 11, P.col.hot, 'center', 800);
    }
    if (nom) P.txt(c, nom, 190, 6, 12, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, sc = two ? 0.85 : 1.2, oy = two ? 12 + k * 128 : 52;
      c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1; c.translate(190 - 190 * sc, oy); c.scale(sc, sc); bloc(c, X, s, two ? s.nom : '', col); c.restore();
    });
  }
  function lig(v) {
    var r = res(v.m, v.tech), mm = MIX[v.m], nature = mm.het ? 'Mélange hétérogène : on distingue ses constituants.' : 'Mélange homogène : on ne distingue pas ses constituants.';
    return ['<b>' + (r[0] === 'ok' ? 'Les constituants sont séparés' : r[0] === 'perte' ? 'Séparés, mais l’eau est perdue' : 'Les constituants ne sont pas séparés') + '</b>', r[1] + ' ' + nature];
  }
  var tech = { id: 'tech', label: 'Technique', opts: [['filtration', 'Filtration'], ['decantation', 'Décantation'], ['evaporation', 'Évaporation']], val: 'filtration' };
  var base = { w: 380, h: 270, scene: scene, live: false, notrace: true, read: lig, sound: function (v) { var r = res(v.m, v.tech)[0]; return r === 'ok' ? 523 : r === 'perte' ? 330 : 150; } };
  V.add({
    slug: 'melanges', defiTitre: 'Les mélanges : le défi',
    chap: [
      { titre: 'Choisir la bonne technique', labTitre: 'Un mélange, une technique', cur: 'Comment Awa sépare-t-elle le sable de l’eau de son seau ?',
        paras: ['Dans un mélange hétérogène, on distingue plusieurs constituants ; dans un mélange homogène, on n’en voit qu’un.', 'On choisit la technique selon le mélange : filtration, décantation, évaporation.'],
        loi: { t: 'La technique dépend du mélange', s: 'filtration · décantation · évaporation' }, note: 'Choisis un mélange et une technique : regarde si les constituants sont séparés.',
        predis: { q: 'On filtre de l’eau salée avec un papier filtre. Le sel…', opts: ['reste sur le filtre', 'passe avec l’eau', 'disparaît'], a: 1, rep: 'Il passe avec l’eau : le sel est dissous, il traverse le papier. La filtration ne le sépare pas.' },
        verif: { q: 'l’eau salée est un mélange…', o: ['hétérogène', 'homogène', 'impossible'], a: 1, e: 'On ne distingue pas le sel dans l’eau : mélange homogène.' },
        lab: Object.assign({}, base, { alt: 'Un mélange dans un bécher, une technique de séparation et le résultat', sit: [{ nom: '', vars: {} }],
          choices: [{ id: 'm', label: 'Mélange', opts: [['sable', 'Eau + sable'], ['sel', 'Eau salée'], ['huile', 'Eau + huile']], val: 'sable' }, tech] }) },
      { titre: 'Deux mélanges côte à côte', labTitre: 'Même technique, deux mélanges', cur: 'Pourquoi la même technique ne marche-t-elle pas pour tous les mélanges ?',
        paras: ['La filtration sépare un solide non dissous d’un liquide ; elle ne sépare pas un solide dissous.', 'La décantation sépare des liquides qui ne se mélangent pas, comme l’huile et l’eau.'],
        loi: { t: 'Filtration : solide non dissous', s: 'décantation : liquides non miscibles ou dépôt · évaporation : récupère le solide dissous' }, note: 'Compare en alternance : change de technique et regarde les deux mélanges.',
        predis: { q: 'Pour séparer l’huile de l’eau, on utilise…', opts: ['la décantation', 'la filtration', 'l’évaporation'], a: 0, rep: 'La décantation : l’huile flotte sur l’eau, on les sépare avec une ampoule à décanter.' },
        verif: { q: 'pour récupérer le sel dissous dans l’eau, on utilise…', o: ['la filtration', 'l’évaporation', 'la décantation'], a: 1, e: 'On évapore l’eau : le sel reste.' },
        lab: Object.assign({}, base, { alt: 'Deux mélanges traités par la même technique', sit: [{ nom: 'Eau + sable', vars: { m: 'sable' } }, { nom: 'Eau salée', vars: { m: 'sel' } }], choices: [tech], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, m = MIX[l.m] ? l.m : 'sable', t = TECH[l.tech] ? l.tech : 'filtration', r = res(m, t), a = { ok: 0, non: 1, perte: 2 }[r[0]];
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as traité « ' + MIX[m].n + ' » par ' + TECH[t] + '. Que se passe-t-il ?', o: ['Les constituants sont séparés', 'Ils ne sont pas séparés', 'Ils sont séparés, mais l’eau est perdue'], a: a, e: r[1] },
        { type: 'qcm', q: 'Un mélange dont on ne distingue pas les constituants est…', o: ['hétérogène', 'homogène', 'séparé'], a: 1, e: 'On parle de mélange homogène.' }
      ];
    }
  });
})();
