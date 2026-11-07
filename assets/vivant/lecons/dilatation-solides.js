/* Livre vivant · 5e · Propriétés physiques de la matière · Dilatation des solides.
   Moment essentiel : une boule métallique chauffée ne passe plus dans l'anneau ; les particules s'écartent (elles gardent leur nombre et leur taille).
   Programme de 5e qualitatif : l'échelle de chauffage est en pourcentage, non à l'échelle ; l'écart entre boule et anneau est exagéré pour la lisibilité. Chauffage par le professeur. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, X0 = 20;
  var rayon = V.lois.rayonBoule = function (x) { return 20 + 0.05 * x; };
  var passe = V.lois.bouleTraverse = function (x) { return rayon(x) <= 22; };
  var dL = V.lois.allongementPont = function (x) { return 0.14 * x; };
  var fleche = V.lois.fleche = function (dl, L) { return 2 / Math.PI * Math.sqrt(Math.max(0, dl) * L); };
  function boule(c, X, s) {
    var P = X.P, x = +s.v.x, r = rayon(x), ok = passe(x), cx = 120, cy = 190, hot = Math.max(0, Math.min(1, (x - X0) / 80)), cold = Math.max(0, Math.min(1, (X0 - x) / 20));
    P.rect(c, cx - 22 - 16, cy - 10, 16, 20, P.col.ink, 2.4, P.col.fill); P.rect(c, cx + 22, cy - 10, 16, 20, P.col.ink, 2.4, P.col.fill); P.txt(c, 'anneau', cx, cy + 42, 12, P.col.soft, 'center');
    var by = ok ? cy + 4 : cy - 10 - r;
    P.line(c, cx, 30, cx, by - r, P.col.soft, 2);
    if (x > X0 + 5) { c.fillStyle = 'rgba(255,140,60,' + (0.12 + 0.3 * hot).toFixed(2) + ')'; c.beginPath(); c.arc(cx, by, r + 9, 0, 6.2832); c.fill(); }
    P.circ(c, cx, by, r, P.col.ink, 2.6, 'rgb(' + Math.round(150 + 95 * hot - 40 * cold) + ',' + Math.round(160 - 60 * hot + 30 * cold) + ',' + Math.round(175 - 100 * hot + 70 * cold) + ')');
    P.txt(c, x > X0 + 5 ? 'chauffage (professeur)' : x < X0 - 5 ? 'refroidie' : 'à la température ambiante', cx, 62, 11, P.col.soft, 'center');
    P.txt(c, ok ? 'elle passe' : 'elle ne passe plus', cx, 252, 13, ok ? P.col.ok : P.col.hot, 'center', 800);
    var d = 20 + x * 0.12, ox = 240, oy = 60, i, j; P.txt(c, 'particules du métal', 300, 38, 12, P.col.soft, 'center');
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) { var am = 0.6 + x * 0.03, t = X.anim ? X.t : 0; P.circ(c, ox + i * d + Math.sin(t / 90 + i * 2 + j) * am, oy + 12 + j * d + Math.cos(t / 100 + j * 3 + i) * am, 5, P.col.ink, 1.6, P.col.paper); }
    P.txt(c, '16 particules, toujours', 300, oy + 20 + 3 * d + 12, 11, P.col.soft, 'center');
  }
  function pont(c, X, s, k, two) {
    var P = X.P, x = +s.v.x, joint = s.v.joint !== 'non', L = 240, g0 = joint ? 14 : 0, d = dL(x), top = two ? 60 + k * 130 : 140, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, xl = 40, xr = xl + L + g0;
    P.rect(c, 14, top, xl - 14, 30, P.col.ink, 2.2, P.col.fill); P.rect(c, xr, top, 380 - xr - 14, 30, P.col.ink, 2.2, P.col.fill);
    var A = joint ? 0 : fleche(d, L), len = joint ? L + d : L, pts = [], q;
    for (q = 0; q <= 24; q++) { var t = q / 24; pts.push([xl + len * t, top + 2 - A * Math.sin(Math.PI * t)]); }
    P.poly(c, pts.concat([[xl + len, top + 14], [xl, top + 14]]), col, 2.6, 'rgba(160,150,130,.5)', true);
    if (joint) P.txt(c, d < g0 - 0.5 ? 'joint de dilatation' : 'joint refermé', xl + L + g0 / 2, top + 48, 11, P.col.soft, 'center');
    if (!joint && A > 3) P.txt(c, 'la route se soulève !', xl + L / 2, top - A - 12, 12, P.col.hot, 'center', 800);
    if (two && s.nom) P.txt(c, s.nom, 100, top + 48, 12, col, 'center', 800);
  }
  function scene(c, X) { var two = X.S.length > 1; X.S.forEach(function (s, k) { c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1; if (s.v.pont) pont(c, X, s, k, two); else boule(c, X, s); c.restore(); }); }
  function lig(v) {
    var x = +v.x;
    if (v.pont) { var A = fleche(dL(x), 240); return v.joint === 'non' ? [A > 3 ? '<b>La barre se dilate et se soulève</b>' : '<b>À froid, rien ne gêne</b>', 'Pas de place pour s’allonger : la dilatation déforme la route.'] : ['<b>La barre s’allonge dans le joint</b>', 'Le joint laisse de la place à la dilatation.']; }
    var t = passe(x) ? 'La boule passe dans l’anneau' : 'La boule ne passe plus dans l’anneau';
    return [x > X0 ? '<b>Chauffée : le solide se dilate. ' + t + '</b>' : x < X0 ? '<b>Refroidi : le solide se contracte. ' + t + '</b>' : '<b>À la température ambiante. ' + t + '</b>', 'Les particules s’écartent ; elles ne grossissent pas et il y en a toujours 16.'];
  }
  var x1 = { id: 'x', label: 'Chauffage', min: 0, max: 100, step: 5, val: 20, unit: '%', dec: 0 };
  var base = { w: 380, h: 270, live: true, notrace: true, read: lig, inputs: [x1], sound: function (v) { return 150 + 5 * +v.x; }, scene: scene };
  V.add({
    slug: 'dilatation-solides', defiTitre: 'Dilatation des solides : le défi',
    chap: [
      { titre: 'La boule et l’anneau', labTitre: 'Chauffer la boule, puis la refroidir', cur: 'Pourquoi une boule qui passait dans un anneau ne passe-t-elle plus une fois chauffée ?',
        paras: ['Un solide chauffé se dilate : ses dimensions augmentent, sans que sa masse change.', 'Dans le métal, les particules ne grossissent pas : elles vibrent plus fort et s’écartent un peu.'],
        loi: { t: 'Chauffé, un solide se dilate', s: 'refroidi, il se contracte · ses particules ne grossissent pas' }, note: 'Avance le chauffage : la boule grandit, les particules s’écartent. Dessin exagéré, non à l’échelle.',
        predis: { q: 'La boule chauffée est plus grande parce que ses particules…', opts: ['grossissent', 's’écartent un peu', 'se multiplient'], a: 1, rep: 'Elles s’écartent : il y en a toujours le même nombre et elles gardent la même taille.' },
        verif: { q: 'on refroidit un solide : il…', o: ['se dilate', 'se contracte', 'ne change pas'], a: 1, e: 'Refroidi, il se contracte.' },
        lab: Object.assign({}, base, { alt: 'Boule métallique, anneau et particules du métal', sit: [{ nom: '', vars: {} }] }) },
      { titre: 'Le joint de dilatation', labTitre: 'Une route avec et sans joint', cur: 'Pourquoi voit-on des fentes dans les ponts et sur les voies ferrées ?',
        paras: ['L’été, les ponts et les rails s’allongent. On laisse des joints de dilatation pour leur laisser la place.', 'Sans joint, la dilatation, bloquée, peut déformer et casser la structure.'],
        loi: { t: 'Il faut laisser la place de se dilater', s: 'joints de dilatation : ponts, rails, routes' }, note: 'Compare en alternance avec et sans joint, en montant le chauffage.',
        predis: { q: 'Un pont sans joint de dilatation chauffe en plein soleil. La structure…', opts: ['reste intacte', 'peut se déformer', 'rétrécit'], a: 1, rep: 'Elle ne peut pas s’allonger : elle se déforme, voire se casse.' },
        verif: { q: 'un joint de dilatation sert à…', o: ['décorer le pont', 'laisser la place à la dilatation', 'refroidir le pont'], a: 1, e: 'Il laisse la place de s’allonger.' },
        lab: Object.assign({}, base, { alt: 'Deux barres de route : avec joint de dilatation et sans joint', sit: [{ nom: 'Avec joint', vars: { pont: 1, joint: 'oui' } }, { nom: 'Sans joint', vars: { pont: 1, joint: 'non' } }], inputs: [Object.assign({}, x1, { val: 80, label: 'Chaleur' })] }) }
    ],
    manches: function (LV) {
      var x = LV[0] && LV[0].x != null ? +LV[0].x : 20, ok = passe(x);
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as réglé le chauffage à ' + x + ' %. La boule métallique…', o: ['passe dans l’anneau', 'ne passe plus dans l’anneau'], a: ok ? 0 : 1, e: ok ? 'Pas assez dilatée : elle passe encore.' : 'Chauffée, elle s’est dilatée : elle ne passe plus.' },
        { type: 'qcm', q: 'Quand on chauffe un solide, que deviennent ses particules ?', o: ['Elles grossissent', 'Elles s’écartent un peu', 'Elles disparaissent'], a: 1, e: 'Elles s’écartent : leur taille et leur nombre ne changent pas.' }
      ];
    }
  });
})();
