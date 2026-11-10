/* Livre vivant · 6e · Propriétés physiques de la matière · Solides et liquides.
   Moment essentiel : on incline un bocal fermé. L'eau prend la forme du bocal mais sa surface libre reste horizontale ; le bloc de bois garde sa forme.
   Le niveau du liquide est calculé pour que l'aire d'eau (le « volume » du dessin) reste constante. Volume affiché : 100 mL, choix de conception. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  function clip(poly, yL) {
    var out = [], n = poly.length, i;
    for (i = 0; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], ia = a[1] >= yL, ib = b[1] >= yL;
      if (ia) out.push(a);
      if (ia !== ib) { var f = (yL - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * f, yL]); }
    }
    return out;
  }
  function aire(p) { var s = 0, i; for (i = 0; i < p.length; i++) { var q = p[(i + 1) % p.length]; s += p[i][0] * q[1] - q[0] * p[i][1]; } return Math.abs(s) / 2; }
  /* niveau yL tel que l'aire de liquide sous yL vaut A : bissection */
  var niveau = V.lois.niveauLiquide = function (poly, A) {
    var lo = Infinity, hi = -Infinity, m, k;
    poly.forEach(function (p) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); });
    for (k = 0; k < 40; k++) { m = (lo + hi) / 2; if (aire(clip(poly, m)) > A) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  function monde(cx, cy, ang, pts) { var a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a); return pts.map(function (p) { return [cx + p[0] * ca - p[1] * sa, cy + p[0] * sa + p[1] * ca]; }); }
  function jar(c, P, cx, cy, v, col, solide, etiq) {
    var w = +v.w, h = +v.h, ang = +v.ang, R = Math.hypot(w, h) / 2;
    var cor = monde(cx, cy, ang, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
    if (!solide) {
      var yL = niveau(cor, +v.A), liq = clip(cor, yL);
      P.poly(c, liq, null, 0, 'rgba(80,150,230,.55)', true);
      c.save(); c.setLineDash([5, 4]); P.line(c, cx - R - 8, yL, cx + R + 8, yL, P.col.a, 1.8); c.restore();
      if (etiq) P.txt(c, 'horizontale', cx + R + 10, yL - 8, 11, P.col.a, 'right', 800);
    } else {
      var bw = w * 0.5, bh = h * 0.34, bl = monde(cx, cy, ang, [[-bw / 2, h / 2 - bh], [bw / 2, h / 2 - bh], [bw / 2, h / 2], [-bw / 2, h / 2]]);
      P.poly(c, bl, col, 2.2, '#C9A86A', true); P.poly(c, monde(cx, cy, ang, [[-bw / 2 + 6, h / 2 - bh + 8], [bw / 2 - 6, h / 2 - bh + 8]]), '#8B6B3C', 1.6);
    }
    P.poly(c, cor, col, 2.6, null, true); P.line(c, cor[0][0], cor[0][1], cor[1][0], cor[1][1], col, 6);
  }
  function scene(c, X) {
    var P = X.P, S = X.S, two = S.length > 1;
    S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, cx = two ? 95 + 190 * k : 190, cy = two ? 120 : 130, dim = X.act >= 0 && X.act !== s.i;
      c.save(); c.globalAlpha = dim ? 0.35 : 1; jar(c, P, cx, cy, s.v, col, s.v.mat === 'sol', !two);
      P.txt(c, s.nom || (s.v.mat === 'sol' ? 'bloc de bois dans un bocal fermé' : 'eau dans un bocal fermé'), cx, two ? 232 : 245, two ? 12 : 12, col, 'center', 800); c.restore();
    });
  }
  function lig(v) {
    var a = +v.ang;
    if (v.mat === 'sol') return ['<b>Le solide garde sa forme</b>', 'Bocal incliné de ' + fr(a, 0) + ' ° : le bloc ne se déforme pas, il a une forme propre.'];
    return ['<b>La surface libre reste horizontale</b>', 'Bocal incliné de ' + fr(a, 0) + ' ° · surface du liquide : 0 ° (horizontale) · V = 100 mL.'];
  }
  var ang = { id: 'ang', label: 'Inclinaison du bocal', min: 0, max: 90, step: 5, val: 30, unit: '°', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, notrace: true, sound: function (v) { return 200 + 4 * +v.ang; } };
  V.add({
    slug: 'solides-liquides', defiTitre: 'Solides et liquides : le défi',
    chap: [
      { titre: 'Forme propre ou non', labTitre: 'Incliner un bocal : l’eau et le bloc', cur: 'Kofi remplit un seau d’eau : pourquoi l’eau prend-elle la forme du seau ?',
        paras: ['Un solide a une forme propre : un bloc de bois reste un bloc, quel que soit le récipient.', 'Un liquide n’a pas de forme propre : il prend la forme du récipient. Sa surface libre au repos est plane et horizontale.'],
        loi: { t: 'Solide : forme propre · liquide : forme du récipient', s: 'la surface libre d’un liquide au repos est horizontale' }, note: 'Incline le bocal avec le curseur : la ligne pointillée montre que l’eau reste horizontale.',
        predis: { q: 'On incline un bocal fermé à moitié rempli d’eau. La surface de l’eau…', opts: ['reste horizontale', 's’incline avec le bocal', 'devient bombée'], a: 0, rep: 'Elle reste horizontale : le liquide s’adapte au récipient mais sa surface libre est toujours plane et horizontale.' },
        verif: { q: 'un solide…', o: ['a une forme propre', 'prend la forme du récipient', 'a une surface horizontale'], a: 0, e: 'Un solide garde sa forme.' },
        lab: Object.assign({}, base, { alt: 'Un bocal fermé qu’on incline, avec de l’eau ou un bloc de bois', read: lig, sit: [{ nom: '', vars: { w: 110, h: 140, A: 6160 } }],
          choices: [{ id: 'mat', label: 'Contenu', opts: [['liq', 'Eau (liquide)'], ['sol', 'Bloc de bois (solide)']], val: 'liq' }], inputs: [ang] }) },
      { titre: 'Même volume, autre forme', labTitre: 'Deux récipients, 100 mL d’eau', cur: 'Pourquoi 100 mL d’eau paraissent-ils plus hauts dans un verre étroit ?',
        paras: ['Le volume d’un liquide se conserve quand on le verse d’un récipient dans un autre.', 'Seule sa forme change : elle épouse celle du récipient, donc le niveau est plus haut dans un récipient étroit.'],
        loi: { t: 'Le volume d’un liquide se conserve', s: '100 mL restent 100 mL, quel que soit le récipient' }, note: 'Compare en alternance : même volume d’eau, deux récipients, et la surface reste horizontale.',
        predis: { q: 'On verse 100 mL d’eau dans un récipient plus large. Le volume d’eau…', opts: ['augmente', 'diminue', 'reste 100 mL'], a: 2, rep: 'Il reste 100 mL : le liquide a changé de forme, pas de volume.' },
        verif: { q: 'on verse 50 mL d’eau dans un autre verre : on obtient…', o: ['moins de 50 mL', '50 mL', 'plus de 50 mL'], a: 1, e: 'Le volume se conserve : 50 mL.' },
        lab: Object.assign({}, base, { alt: 'Deux bocaux contenant le même volume d’eau : un étroit et un large', read: function () { return ['Même volume V = 100 mL : l’eau prend la forme de chaque bocal, surface horizontale.']; },
          sit: [{ nom: 'Bocal étroit', vars: { mat: 'liq', w: 56, h: 120, A: 3000 } }, { nom: 'Bocal large', vars: { mat: 'liq', w: 120, h: 62, A: 3000 } }], inputs: [ang] }) }
    ],
    manches: function (LV) {
      var a = LV[0] && +LV[0].ang > 0 ? +LV[0].ang : 30;
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as incliné le bocal de ' + fr(a, 0) + ' °. Quel angle la surface de l’eau fait-elle avec l’horizontale ?', o: ['0 ° : elle reste horizontale', fr(a, 0) + ' °, comme le bocal', '90 °'], a: 0, e: 'La surface libre d’un liquide au repos est toujours horizontale, même si le bocal est incliné.' },
        { type: 'qcm', q: 'Quelle propriété appartient à un solide ?', o: ['Il a une forme propre', 'Il prend la forme du récipient', 'Il s’écoule'], a: 0, e: 'Un solide garde sa forme ; un liquide prend celle du récipient.' }
      ];
    }
  });
})();
