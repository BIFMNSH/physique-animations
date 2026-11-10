/* Livre vivant · 6e · Propriétés physiques de la matière · Les changements d'état de l'eau.
   Moment essentiel : curseur « temps de chauffage » ; les particules passent de la grille du solide au désordre du liquide puis du gaz,
   le thermomètre s'arrête à 0 °C et à 100 °C (palier). Simulation qualitative : les durées ne sont pas à l'échelle et aucune valeur n'est inventée
   en dehors de 0 °C et 100 °C. Le chauffage est réalisé par le professeur : le dessin montre une plaque, pas de flamme. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  /* x : avancement de 0 à 100 (en refroidissant, on lit la même chronologie à l'envers) */
  var X0 = [0, 20, 40, 65, 85, 100];
  var etat = V.lois.etatEau = function (x) {
    if (x < 20) return { n: 'solide', k: 0, fs: 1, fg: 0 };
    if (x < 40) return { n: 'fusion', k: 1, fs: 1 - (x - 20) / 20, fg: 0, pal: 0 };
    if (x < 65) return { n: 'liquide', k: 2, fs: 0, fg: 0 };
    if (x < 85) return { n: 'vaporisation', k: 3, fs: 0, fg: (x - 65) / 20, pal: 100 };
    return { n: 'gaz', k: 4, fs: 0, fg: 1 };
  };
  var niveau = V.lois.niveauTemp = function (x) { return x < 20 ? 0.25 * x / 20 : x < 40 ? 0.25 : x < 65 ? 0.25 + 0.5 * (x - 40) / 25 : x < 85 ? 0.75 : 0.75 + 0.25 * (x - 85) / 15; };
  function xr(s) { var t = +s.v.tau; return s.v.sens === 'froid' ? 100 - t : t; }
  function factory() {
    var N = 30, parts = null, last = [];
    return function scene(c, X) {
      var P = X.P, S = X.S, two = S.length > 1, gx0 = 235, gy0 = 236, gw = 130, gh = 190;
      if (!parts) parts = S.map(function (s, k) { var box = { x: 10, y: two ? 10 + k * 128 : 40, w: 112, h: two ? 94 : 160 }; return V.sim.cree(N, box, 7 + k); });
      S.forEach(function (s, k) {
        var x = xr(s), e = etat(x), froid = s.v.sens === 'froid', box = { x: 10, y: two ? 10 + k * 128 : 40, w: 112, h: two ? 94 : 160 }, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink;
        var dim = X.act >= 0 && X.act !== s.i; c.save(); c.globalAlpha = dim ? 0.35 : 1;
        P.rect(c, box.x, box.y, box.w, box.h, col, 2.6, P.col.paper);
        var heat = box.y + box.h + 4; c.fillStyle = froid ? '#8CC8FF' : (x > 5 ? '#FF9B5C' : '#C9BFA6'); c.fillRect(box.x - 4, heat, box.w + 8, 8); P.rect(c, box.x - 4, heat, box.w + 8, 8, P.col.ink, 1.5);
        P.txt(c, froid ? 'refroidissement' : 'chauffage (professeur)', box.x + box.w / 2, heat + 19, 11, P.col.soft, 'center');
        var ag = 0.15 + 0.85 * niveau(x), arr = parts[k], sp = 0.9 + ag * 2.6, ns = Math.round(N * e.fs), ng = Math.round(N * e.fg), cell = Math.min(18, (box.h - 14) / 5);
        var nl = N - ns - ng;
        arr.forEach(function (p, i) {
          var st = i < ng ? 'g' : i < ng + nl ? 'l' : 's'; if (e.k === 1) st = i < nl ? 'l' : 's'; if (e.k === 3) st = i < ng ? 'g' : 'l';
          var idx = N - 1 - i;
          if (st === 's') { var gxp = box.x + 9 + (idx % 6) * 18.5, gyp = box.y + box.h - 9 - Math.floor(idx / 6) * cell; p.x = gxp + Math.sin((X.t / 70) + i) * 1.4 * (0.3 + ag); p.y = gyp + Math.cos((X.t / 83) + i * 1.7) * 1.4 * (0.3 + ag); }
          else { var bx = st === 'g' ? box : { x: box.x, y: box.y + box.h * 0.42, w: box.w, h: box.h * 0.58 }; V.sim.pas([p], bx, X.anim ? sp * (st === 'g' ? 1.7 : 0.8) : 0, 1, 4); if (p.y < bx.y + 4) p.y = bx.y + 4; }
          P.circ(c, p.x, p.y, 4, col, 1.6, st === 'g' ? 'rgba(120,180,255,.25)' : st === 'l' ? 'rgba(80,150,230,.45)' : 'rgba(200,225,255,.9)');
        });
        c.restore();
      });
      if (!two) {
        var tx = 140, ty0 = 30, ty1 = 214, lv = niveau(xr(S[0]));
        P.rect(c, tx, ty0, 10, ty1 - ty0, P.col.ink, 2, P.col.paper); P.circ(c, tx + 5, ty1 + 8, 9, P.col.ink, 2, '#D64545');
        c.fillStyle = '#D64545'; c.fillRect(tx + 2, ty1 - lv * (ty1 - ty0), 6, lv * (ty1 - ty0) + 4);
        [[0.25, '0 °C'], [0.75, '100 °C']].forEach(function (m) { var y = ty1 - m[0] * (ty1 - ty0); P.line(c, tx + 10, y, tx + 18, y, P.col.soft, 1.4); P.txt(c, m[1], tx + 22, y, 12, P.col.soft, 'left', 800); });
      }
      P.axes(c, gx0, gy0, gx0 + gw + 8, gy0 - gh - 6, 'temps', 'T');
      [[0.25, 'palier 0 °C'], [0.75, 'palier 100 °C']].forEach(function (m) { var y = gy0 - m[0] * gh; c.save(); c.setLineDash([3, 4]); P.line(c, gx0, y, gx0 + gw, y, P.col.soft, 1); c.restore(); P.txt(c, m[1], gx0 + gw, y - 8, 11, P.col.soft, 'right'); });
      S.forEach(function (s) {
        var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, pts = [], q, f = s.v.sens === 'froid';
        for (q = 0; q <= 100; q += 2.5) pts.push([gx0 + q * gw / 100, gy0 - niveau(f ? 100 - q : q) * gh]);
        X.pen(pts, s); var tt = +s.v.tau, dim = X.act >= 0 && X.act !== s.i; c.save(); c.globalAlpha = dim ? 0.3 : 1; P.circ(c, gx0 + tt * gw / 100, gy0 - niveau(xr(s)) * gh, 5.5, col, 2, P.col.paper); c.restore();
      });
    };
  }
  function lig(v) {
    var x = xr({ v: v }), e = etat(x), f = v.sens === 'froid', nm = e.n;
    if (f) { if (e.k === 1) nm = 'solidification'; if (e.k === 3) nm = 'liquéfaction'; }
    var d = { solide: 'solide', fusion: 'glace et eau liquide à la fois', liquide: 'liquide', vaporisation: 'eau liquide et vapeur à la fois', gaz: 'gaz (vapeur d’eau, invisible)' }[e.n];
    var t = e.pal != null ? '<b>Palier : la température reste à ' + e.pal + ' °C</b>' : e.k === 0 ? 'La température est inférieure à 0 °C' : e.k === 2 ? 'La température est comprise entre 0 °C et 100 °C' : 'La température est supérieure à 100 °C';
    return ['<b>' + nm.charAt(0).toUpperCase() + nm.slice(1) + ' : ' + d + '</b>', (f && e.pal == null ? t.replace('monte', 'baisse') : t)];
  }
  function lig2(v) { var r = lig(v); return [r[0].replace(/<\/?b>/g, '') + ' · ' + r[1].replace(/<\/?b>/g, '')]; }
  var tau = { id: 'tau', label: 'Temps', min: 0, max: 100, step: 1, val: 0, unit: '%', dec: 0 };
  var snd = function (v) { return 150 + 500 * (0.15 + 0.85 * niveau(xr({ v: v }))); };
  V.add({
    slug: 'changements-etat', defiTitre: 'Les changements d’état : le défi',
    chap: [
      { titre: 'Le palier', labTitre: 'Chauffer de la glace, pas à pas', cur: 'Pourquoi le thermomètre s’arrête-t-il à 0 °C puis à 100 °C ?',
        paras: ['L’eau existe sous trois états : solide (glace), liquide et gazeux (vapeur d’eau, invisible).', 'La glace fond à 0 °C et l’eau bout à 100 °C (au niveau de la mer). Pendant un changement d’état, la température reste constante : c’est un palier.'],
        loi: { t: '0 °C : fusion · 100 °C : ébullition', s: 'pendant le palier, la température ne change pas' }, note: 'Avance le curseur : les particules s’agitent de plus en plus et le son monte. Dessin non à l’échelle : seuls 0 °C et 100 °C sont exacts.',
        predis: { q: 'On chauffe de l’eau qui bout. Pendant l’ébullition, la température…', opts: ['continue de monter', 'reste constante', 'diminue'], a: 1, rep: 'Elle reste à 100 °C : c’est un palier. La chaleur sert à changer l’état de l’eau, pas à faire monter la température.' },
        verif: { q: 'la glace fond à…', o: ['0 °C', '37 °C', '100 °C'], a: 0, e: 'La glace fond à 0 °C.' },
        lab: { w: 380, h: 270, alt: 'Particules d’eau dans un récipient, thermomètre et courbe de température avec deux paliers', scene: factory(), read: lig, sound: snd, live: true, inputs: [tau], choices: [], sit: [{ nom: '', vars: { sens: 'chaud' } }] } },
      { titre: 'Quatre changements d’état', labTitre: 'Chauffer ou refroidir ?', cur: 'Comment s’appellent les changements d’état ?',
        paras: ['Fusion (solide → liquide), solidification (liquide → solide), vaporisation (liquide → gaz), liquéfaction (gaz → liquide).', 'Au cours d’un changement d’état, la masse se conserve ; le volume, lui, peut changer.'],
        loi: { t: 'La masse se conserve', s: 'la glace occupe plus de place que l’eau liquide' }, note: 'Compare « chauffer » et « refroidir » en alternance : même curseur, deux chronologies.',
        predis: { q: 'La buée sur une vitre froide vient de…', opts: ['la fusion', 'la liquéfaction de la vapeur d’eau', 'la solidification'], a: 1, rep: 'La vapeur d’eau de l’air se refroidit au contact de la vitre et se liquéfie en fines gouttelettes.' },
        verif: { q: 'quand la glace fond, sa masse…', o: ['augmente', 'reste la même', 'diminue'], a: 1, e: 'La masse se conserve.' },
        lab: { w: 380, h: 270, alt: 'Deux récipients : l’eau chauffée et l’eau refroidie au même instant', scene: factory(), read: lig2, sound: snd, live: true, inputs: [tau], sit: [{ nom: 'Chauffer', vars: { sens: 'chaud' } }, { nom: 'Refroidir', vars: { sens: 'froid' } }] } }
    ],
    manches: function (LV) {
      var t = LV[0] && LV[0].tau != null ? +LV[0].tau : 0, e = etat(t), o = ['solide', 'fusion (glace et eau liquide)', 'liquide', 'vaporisation (eau et vapeur)', 'gaz'];
      return [
        { type: 'qcm', q: 'Dans le laboratoire, tu as arrêté le curseur à ' + t + ' %. Dans quel état est l’eau à ce moment-là ?', o: o, a: e.k, e: 'Sur la courbe, à ' + t + ' % l’eau est dans l’état « ' + e.n + ' » : solide jusqu’à 20 %, fusion de 20 à 40 %, liquide jusqu’à 65 %, vaporisation de 65 à 85 %, puis gaz.' },
        { type: 'qcm', q: 'Quelle température indique le thermomètre pendant l’ébullition de l’eau ?', o: ['0 °C', '100 °C', 'Elle continue de monter'], a: 1, e: 'Pendant l’ébullition, c’est un palier : la température reste à 100 °C.' }
      ];
    }
  });
})();
