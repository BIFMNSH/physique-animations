/* 3e · Mécanique · Leçon : Masse et poids d’un corps */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var LIEU = { terre: { n: 'Terre (Abidjan)', g: 9.8, c: '#4FA8FF', sky: '#0F1E36' }, lune: { n: 'Lune', g: 1.6, c: '#C9D2E3', sky: '#07080C' }, mars: { n: 'Mars', g: 3.7, c: '#FF8A5C', sky: '#2A1410' } };
  var OBJ = { mangue: { n: 'mangue', m: 0.3, c: '#FFB547' }, ballon: { n: 'ballon de football', m: 0.45, c: '#EEF2F8' }, riz: { n: 'sachet de riz', m: 1, c: '#E6D3B8' } };
  var NPX = 20; /* dynamomètre : 20 px par newton */
  function Lab(G, o) {
    var st = Object.assign({ mode: 'dynamo', m: 0.3, lieu: 'terre', obj: 'mangue', sc: 1, pts: [], t: null, ext: 0 }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    var sky = s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var ground = s('rect', { x: 40, y: 400, width: 500, height: 46, fill: '#151D2E' }, G), lieuT = s('text', { x: 524, y: 66, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 900 }, G);
    /* ---------- DYNAMOMÈTRE ---------- */
    var D = s('g', {}, G), DX = 180;
    s('path', { d: 'M90 400 V60 H' + (DX + 20), stroke: '#7D89A3', 'stroke-width': 8, fill: 'none' }, D); s('rect', { x: 70, y: 392, width: 80, height: 10, rx: 3, fill: '#5B6478' }, D);
    s('rect', { x: DX - 18, y: 66, width: 36, height: 236, rx: 8, fill: '#E5E9F0', stroke: '#9AA6BC', 'stroke-width': 2 }, D);
    for (var n = 0; n <= 10; n++) { var yy = 86 + n * NPX; s('line', { x1: DX - 18, x2: DX - 6, y1: yy, y2: yy, stroke: '#1A1F28', 'stroke-width': 1.4 }, D); s('text', { x: DX + 16, y: yy + 4, 'text-anchor': 'end', 'font-size': 9.5, 'font-weight': 800, fill: '#1A1F28', text: n }, D); if (n < 10) s('line', { x1: DX - 18, x2: DX - 11, y1: yy + NPX / 2, y2: yy + NPX / 2, stroke: '#1A1F28', 'stroke-width': 0.8 }, D); }
    s('text', { x: DX, y: 318, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#A9B4C7', text: 'N' }, D);
    var spring = s('path', { fill: 'none', stroke: '#7D89A3', 'stroke-width': 2 }, D), ind = s('rect', { x: DX - 20, width: 40, height: 4, fill: '#E5484D' }, D), rod = s('line', { x1: DX, x2: DX, stroke: '#7D89A3', 'stroke-width': 3 }, D), hook = s('path', { fill: 'none', stroke: '#7D89A3', 'stroke-width': 3 }, D);
    var mass = s('g', {}, D), mBody = s('rect', { rx: 4, fill: '#C8A46A', stroke: '#8A6A3A', 'stroke-width': 1.5 }, mass), mLab = s('text', { 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#3A2A10' }, mass);
    var rdBox = s('g', {}, D); s('rect', { x: 260, y: 96, width: 140, height: 56, rx: 12, fill: '#EEF2F8' }, rdBox); s('text', { x: 330, y: 114, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A3426', text: 'DYNAMOMÈTRE : POIDS' }, rdBox); var rdT = s('text', { x: 330, y: 142, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#B4232A' }, rdBox);
    var bal = s('g', {}, D); s('path', { d: 'M300 392 l10 -40 h140 l10 40z', fill: '#2F3646', stroke: '#4A5160', 'stroke-width': 2 }, bal); s('rect', { x: 320, y: 342, width: 120, height: 10, rx: 3, fill: '#C9D2E3' }, bal); s('rect', { x: 330, y: 364, width: 80, height: 22, rx: 4, fill: '#0B1F14' }, bal); var balT = s('text', { x: 404, y: 381, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 900, fill: '#5CFF9D', 'font-family': 'monospace' }, bal);
    var balM = s('rect', { x: 356, width: 48, rx: 4, fill: '#C8A46A', stroke: '#8A6A3A', 'stroke-width': 1.5 }, bal); s('text', { x: 380, y: 412, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'balance : MASSE' }, bal);
    var dMsg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, D);
    /* ---------- VECTEUR POIDS ---------- */
    var V = s('g', {}, G), VX = 230;
    s('path', { d: 'M110 60 H' + (VX + 10), stroke: '#7D89A3', 'stroke-width': 6 }, V); var thread = s('line', { x1: VX, y1: 60, x2: VX, stroke: '#C9D2E3', 'stroke-width': 2 }, V);
    var plumb = s('g', {}, V); s('line', { x1: 430, y1: 60, x2: 430, y2: 340, stroke: '#7D89A3', 'stroke-width': 1.5 }, plumb); s('path', { d: 'M424 340 h12 l-6 16z', fill: '#C8A46A' }, plumb); s('text', { x: 430, y: 376, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'fil à plomb' }, plumb); s('text', { x: 430, y: 390, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: '= la verticale' }, plumb);
    var objs = {}; objs.mangue = s('g', {}, V); s('path', { d: 'M0 -34 q34 0 30 34 q-4 38 -30 40 q-30 -2 -32 -36 q-2 -38 32 -38z', fill: '#FFB547' }, objs.mangue); s('path', { d: 'M-4 -34 q-6 -10 6 -14', stroke: '#2F7D4F', 'stroke-width': 3, fill: 'none' }, objs.mangue);
    objs.ballon = s('g', {}, V); s('circle', { r: 38, fill: '#EEF2F8', stroke: '#1A1F28', 'stroke-width': 2 }, objs.ballon); s('path', { d: 'M0 -12 l11 8 -4 13 h-14 l-4 -13z', fill: '#1A1F28' }, objs.ballon);
    objs.riz = s('g', {}, V); s('path', { d: 'M-34 40 q-8 -50 6 -76 h56 q14 26 6 76z', fill: '#E6D3B8', stroke: '#B79B72', 'stroke-width': 2 }, objs.riz); s('text', { y: 12, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#6B4E36', text: 'RIZ 1 kg' }, objs.riz);
    var Gpt = s('circle', { r: 5, fill: '#E5484D', stroke: '#FFF', 'stroke-width': 1.5 }, V), GT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#FF8A80', text: 'G' }, V);
    var arr = s('path', { stroke: '#E5484D', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, V), head = s('path', { fill: '#E5484D' }, V), arrT = s('text', { 'font-size': 16, 'font-weight': 900, fill: '#FF8A80' }, V);
    var scl = s('g', {}, V), sclL = s('line', { x1: 80, x2: 106, y1: 380, y2: 380, stroke: '#FFC773', 'stroke-width': 4 }, scl), sclT = s('text', { x: 114, y: 384, 'font-size': 12, 'font-weight': 800, fill: '#FFC773' }, scl);
    var vMsg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, V);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var GA = s('g', {}, P), gx0 = PX + 46, gy0 = 236, gw = 210, gh = 160;
    s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'POIDS EN FONCTION DE LA MASSE' }, GA);
    for (var k = 0; k <= 5; k++) { var yg = gy0 - k * gh / 5; s('line', { x1: gx0, x2: gx0 + gw, y1: yg, y2: yg, stroke: '#1E2A44', 'stroke-width': 1 }, GA); s('text', { x: gx0 - 6, y: yg + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#A9B4C7', text: k * 2 }, GA); }
    for (k = 0; k <= 4; k++) { var xg = gx0 + k * gw / 4; s('line', { x1: xg, x2: xg, y1: gy0, y2: gy0 - gh, stroke: '#1E2A44', 'stroke-width': 1 }, GA); s('text', { x: xg, y: gy0 + 14, 'text-anchor': 'middle', 'font-size': 10, fill: '#A9B4C7', text: fmt(k * 0.25, 2) }, GA); }
    s('text', { x: gx0 + gw, y: gy0 + 28, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'm (kg)' }, GA); s('text', { x: gx0 - 4, y: gy0 - gh - 10, 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'P (N)', 'text-anchor': 'middle' }, GA);
    var lineL = s('line', { 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, GA), ptsG = s('g', {}, GA), curP = s('circle', { r: 6, fill: 'none', 'stroke-width': 2.5 }, GA);
    var VA = s('g', {}, P); s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'CARACTÉRISTIQUES DU POIDS' }, VA);
    [['Point d’application', 'le centre de gravité G'], ['Direction', 'la verticale'], ['Sens', 'vers le bas'], ['Valeur', 'P = m × g']].forEach(function (r, k2) { var y = 82 + k2 * 44; s('text', { x: PX + 22, y: y, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: r[0] }, VA); s('text', { x: PX + 22, y: y + 20, 'font-size': 14.5, 'font-weight': 900, fill: '#EEF2F8', text: r[1] }, VA); });
    var form = s('text', { x: PX + 140, y: 284, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#FFC773', text: 'P = m × g' }, P);
    var fl = [0, 1, 2, 3].map(function (k2) { return s('text', { x: PX + 140, y: 314 + k2 * 24, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P); });
    function gpx(m, Pn) { return [gx0 + m / 1 * gw, gy0 - Math.min(10.4, Pn) / 10 * gh]; }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      var L = LIEU[st.lieu]; sky.setAttribute('fill', L.sky); lieuT.textContent = L.n + ' · g = ' + fmt(L.g, 1) + ' N/kg'; lieuT.setAttribute('fill', L.c); lieuT.style.display = st.t != null ? 'none' : '';
      D.style.display = st.mode === 'dynamo' ? '' : 'none'; V.style.display = st.mode === 'vecteur' ? '' : 'none'; GA.style.display = st.mode === 'dynamo' ? '' : 'none'; VA.style.display = st.mode === 'vecteur' ? '' : 'none';
      if (st.mode === 'dynamo') {
        var m = st.m, Pn = m * L.g, over = Pn > 10, tgt = Math.min(10.3, Pn);
        if (st.t == null) st.ext += (tgt - st.ext) * Math.min(1, dt * 6) + Math.sin(T * 9) * 0; else st.ext = tgt;
        var e = st.ext, yi = 86 + e * NPX, coils = 12, top = 74, sp = '';
        for (var c = 0; c <= coils; c++) { var y = top + (yi - top) * c / coils; sp += (c ? 'L' : 'M') + (DX + (c % 2 ? 9 : -9)) + ' ' + y.toFixed(1); }
        spring.setAttribute('d', sp); attr(ind, { y: yi - 2 }); attr(rod, { y1: yi, y2: 306 + e * NPX * 0.18 + (yi - 86) * 0 });
        var hy = Math.max(yi + 30, 312); rod.setAttribute('y2', hy); hook.setAttribute('d', 'M' + DX + ' ' + hy + ' v8 a7 7 0 1 1 -7 7');
        var h = m > 0 ? 14 + Math.sqrt(m) * 40 : 0; mass.style.display = m > 0 ? '' : 'none'; attr(mBody, { x: DX - 26, y: hy + 22, width: 52, height: h }); attr(mLab, { x: DX, y: hy + 26 + h / 2 + 4, text: Math.round(m * 1000) + ' g' });
        rdT.textContent = over ? '> 10 N !' : fmt(Pn, 2) + ' N';
        balT.textContent = Math.round(m * 1000) + ' g'; var bh = m > 0 ? 8 + Math.sqrt(m) * 24 : 0; attr(balM, { y: 342 - bh, height: bh }); balM.style.display = m > 0 ? '' : 'none';
        dMsg.textContent = m === 0 ? 'Accroche une masse au dynamomètre' : over ? 'Trop lourd : dépasse le calibre de 10 N' : 'P = ' + fmt(m, 2) + ' kg × ' + fmt(L.g, 1) + ' N/kg = ' + fmt(Pn, 2) + ' N';
        var a = gpx(0, 0), b = gpx(1, L.g); attr(lineL, { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: L.c });
        while (ptsG.firstChild) ptsG.removeChild(ptsG.firstChild);
        st.pts.forEach(function (q) { var p = gpx(q.m, q.P); s('circle', { cx: p[0], cy: p[1], r: 5, fill: LIEU[q.l].c, stroke: '#0A0F1A', 'stroke-width': 1.5 }, ptsG); });
        var cp = gpx(m, Pn); attr(curP, { cx: cp[0], cy: cp[1], stroke: L.c });
        fl[0].textContent = 'P : poids en newtons (N)'; fl[1].textContent = 'm : masse en kilogrammes (kg)'; fl[2].textContent = 'g = ' + fmt(L.g, 1) + ' N/kg (' + L.n.replace(/ \(.*/, '') + ')'; fl[3].textContent = 'La masse ne dépend pas du lieu.';
        res = { m: m, P: Pn, over: over, lieu: st.lieu };
      } else {
        var O = OBJ[st.obj], Pv = O.m * L.g, cm = 26, len = Pv / st.sc * cm, Gy = 150;
        Object.keys(objs).forEach(function (k2) { objs[k2].style.display = k2 === st.obj ? '' : 'none'; objs[k2].setAttribute('transform', 'translate(' + VX + ' ' + Gy + ')'); });
        thread.setAttribute('y2', Gy - (st.obj === 'ballon' ? 38 : st.obj === 'riz' ? 36 : 34));
        attr(Gpt, { cx: VX, cy: Gy }); attr(GT, { x: VX + 10, y: Gy - 6 });
        var ye = Gy + len; arr.setAttribute('d', 'M' + VX + ' ' + Gy + ' V' + (ye - 10)); head.setAttribute('d', 'M' + (VX - 10) + ' ' + (ye - 14) + ' L' + VX + ' ' + ye + ' L' + (VX + 10) + ' ' + (ye - 14) + 'z');
        attr(arrT, { x: VX + 42, y: (Gy + ye) / 2 + 4, text: 'P = ' + fmt(Pv, 1) + ' N' });
        sclT.textContent = '1 cm ↔ ' + st.sc + ' N';
        vMsg.textContent = 'P = ' + fmt(O.m, 2) + ' × ' + fmt(L.g, 1) + ' = ' + fmt(Pv, 1) + ' N → flèche de ' + fmt(Pv / st.sc, 1) + ' cm';
        fl[0].textContent = 'Le poids est une force :'; fl[1].textContent = 'l’attraction de la Terre (ou de'; fl[2].textContent = 'l’astre) sur l’objet.'; fl[3].textContent = 'On la représente par une flèche.';
        res = { obj: st.obj, P: Pv, len: Pv / st.sc };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Masse ou poids ?' }, { t: 8, title: 'La masse' }, { t: 19, title: 'Le poids' }, { t: 32, title: 'P = m × g' }, { t: 42, title: 'Sur la Lune' }, { t: 50, title: 'Une force, une flèche' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La <b>masse</b> (kg) se mesure avec une <b>balance</b>', 'elle est la même partout : sur Terre comme sur la Lune.', '#5CFF9D'],
      ['Le <b>poids</b> (N) se mesure avec un <b>dynamomètre</b>', 'c’est une force : verticale, vers le bas, appliquée en G.', '#FF8A80'],
      ['<b>P = m × g</b>', 'sur Terre, g ≈ 9,8 N/kg ; sur la Lune, g ≈ 1,6 N/kg.', '#FFC773']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    var P1 = { m: 0.3, P: 2.94, l: 'terre' }, P2 = { m: 0.6, P: 5.88, l: 'terre' }, P3 = { m: 0.9, P: 8.82, l: 'terre' }, P4 = { m: 0.3, P: 0.48, l: 'lune' };
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.mode = 'dynamo'; st.lieu = 'terre'; st.pts = [];
        if (t < 8) { st.m = 0.3 * K.k(t, 1.5, 1); }
        else if (t < 19) { st.m = 0.3; st.lieu = t > 13 ? 'lune' : 'terre'; }
        else if (t < 32) { st.m = t < 24 ? 0.3 : t < 28 ? 0.6 : 0.9; st.pts = t < 24 ? [] : t < 28 ? [P1] : [P1, P2]; }
        else if (t < 42) { st.m = 0.9; st.pts = [P1, P2, P3]; }
        else if (t < 50) { st.m = 0.3; st.lieu = 'lune'; st.pts = [P1, P2, P3, P4]; }
        else { st.mode = 'vecteur'; st.obj = 'mangue'; st.sc = 1; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Mangue de 300 g : masse ou poids ?') || tg.show(t, 9, 12.8, 290, 92, 'Balance : 300 g') || tg.show(t, 13.4, 18.6, 290, 92, 'Sur la Lune : toujours 300 g !') ||
          tg.show(t, 20, 31.6, 290, 92, 'Dynamomètre : ' + fmt(st.m * 9.8, 1) + ' N') || tg.show(t, 33, 41.6, 290, 92, 'Droite : P proportionnel à m') || tg.show(t, 43, 49.6, 290, 92, 'Sur la Lune : 0,5 N seulement') || tg.show(t, 51, 57.6, 290, 92, 'Le poids : une flèche vers le bas');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une masse de 300 g accrochée à un dynamomètre et posée sur une balance ; sur la Lune la balance affiche toujours 300 g mais le dynamomètre moins ; avec 300, 600 puis 900 g sur Terre, le dynamomètre indique 2,9, 5,9 puis 8,8 N, et les points forment une droite ; enfin le poids d’une mangue représenté par une flèche verticale vers le bas partant du centre de gravité',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'On dit souvent qu’une mangue pèse trois cents grammes. Mais parle-t-on de sa masse, ou de son poids ?', sub: 'Masse ou <b>poids</b> ?' },
      { t: 8, d: 10.8, say: 'La masse, c’est la quantité de matière. Elle se mesure avec une balance, en kilogrammes. Sur la Lune, la balance affiche toujours trois cents grammes : la masse ne change pas.', sub: 'La <b>masse</b> ne dépend pas du lieu.' },
      { t: 19, d: 12.8, say: 'Le poids, c’est la force avec laquelle la Terre attire l’objet. Il se mesure avec un dynamomètre, en newtons. Trois cents grammes : deux virgule neuf newtons. Six cents grammes : cinq virgule neuf newtons.', sub: 'Le <b>poids</b> se mesure en <b>newtons</b> (N).' },
      { t: 32, d: 9.8, say: 'Les points sont alignés avec l’origine : le poids est proportionnel à la masse. P égale m fois g. Sur Terre, g vaut environ neuf virgule huit newtons par kilogramme.', sub: '<b>P = m × g</b>, avec g ≈ 9,8 N/kg.' },
      { t: 42, d: 7.8, say: 'Sur la Lune, g ne vaut que un virgule six newtons par kilogramme : la même mangue a un poids six fois plus petit.', sub: 'Sur la Lune : g ≈ <b>1,6 N/kg</b>.' },
      { t: 50, d: 7.8, say: 'Le poids est une force : on le représente par une flèche, verticale, dirigée vers le bas, qui part du centre de gravité.', sub: 'Une flèche verticale, vers le bas, en <b>G</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : la masse se mesure avec une balance, en kilogrammes.', sub: 'Masse : balance, kg.' },
      { t: 62.6, d: 4.2, say: 'Le poids se mesure avec un dynamomètre, en newtons.', sub: 'Poids : dynamomètre, N.' },
      { t: 67, d: 5, say: 'Et P égale m fois g.', sub: 'P = m × g.' }
    ],
    learn: [
      { t: 18, ch: 1, html: 'La <b>masse</b> (kg) est la même sur Terre et sur la Lune.' },
      { t: 31, ch: 2, html: 'Le <b>poids</b> (N) se mesure avec un dynamomètre.' },
      { t: 41, ch: 3, html: '<b>P = m × g</b> ; sur Terre g ≈ 9,8 N/kg.' },
      { t: 57, ch: 5, html: 'Poids : vertical, vers le bas, appliqué au centre de gravité <b>G</b>.' }
    ],
    question: { q: 'Un sac de 2 kg, sur Terre (g = 9,8 N/kg), a un poids de :', o: ['2 N', '19,6 N', '9,8 N', '4,9 N'], a: 1, e: 'P = 2 × 9,8 = 19,6 N.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Un dynamomètre gradué de 0 à 10 newtons auquel on accroche une masse réglable, à côté d’une balance électronique ; on choisit la Terre, la Lune ou Mars ; un graphique du poids en fonction de la masse se construit à droite ; un second mode représente le poids d’une mangue, d’un ballon ou d’un sachet de riz par une flèche à l’échelle',
    steps: [
      'Accroche différentes masses et relève le poids.',
      'Trace le graphique P en fonction de m : que remarques-tu ?',
      'Change de lieu : que deviennent la masse et le poids ?',
      'Représente le poids d’un objet par une flèche.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'dynamo', options: [{ v: 'dynamo', l: 'Mesurer le poids' }, { v: 'vecteur', l: 'Représenter le poids' }], onChange: function (v) { st.mode = v; vis(); } });
      var sM = c.slider({ label: 'Masse accrochée', min: 0, max: 1000, step: 50, value: 300, unit: 'g', dec: 0, onInput: function (v) { st.m = v / 1000; } });
      var cL = c.seg({ label: 'Lieu', value: 'terre', options: [{ v: 'terre', l: 'Terre' }, { v: 'lune', l: 'Lune' }, { v: 'mars', l: 'Mars' }], onChange: function (v) { st.lieu = v; } });
      var cO = c.seg({ label: 'Objet', value: 'mangue', options: [{ v: 'mangue', l: 'mangue' }, { v: 'ballon', l: 'ballon' }, { v: 'riz', l: 'riz 1 kg' }], onChange: function (v) { st.obj = v; } });
      var cS = c.seg({ label: 'Échelle', value: '1', options: [{ v: '1', l: '1 cm ↔ 1 N' }, { v: '2', l: '1 cm ↔ 2 N' }], onChange: function (v) { st.sc = +v; } });
      function vis() { var d = st.mode === 'dynamo'; sM.hide(!d); cO.hide(d); cS.hide(d); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Masse' }, { k: 'b', label: 'Poids' }, { k: 'c', label: 'P / m' }]), last = {};
      api.loop(function () { last = lab.step(); var m = st.mode === 'dynamo' ? st.m : OBJ[st.obj].m; ro.a.set(fmt(m, 2) + ' kg'); ro.b.set(last.over ? '> 10 N' : fmt(last.P, 2) + ' N'); ro.c.set(m > 0 ? fmt(LIEU[st.lieu].g, 1) + ' N/kg' : '—'); });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode === 'dynamo') { if (st.m === 0 || last.over) { api.say(st.m === 0 ? 'Accroche d’abord une masse.' : 'Hors calibre : prends une masse plus petite.'); return; } st.pts.push({ m: st.m, P: last.P, l: st.lieu }); rows.push({ l: LIEU[st.lieu].n.replace(/ \(.*/, ''), m: fmt(st.m, 2), P: fmt(last.P, 2), r: fmt(last.P / st.m, 1) }); } else rows.push({ l: LIEU[st.lieu].n.replace(/ \(.*/, ''), m: fmt(OBJ[st.obj].m, 2), P: fmt(last.P, 2), r: fmt(LIEU[st.lieu].g, 1) }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Lieu</th><th>m (kg)</th><th>P (N)</th><th>P / m (N/kg)</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.l + '</td><td>' + r.m + '</td><td>' + r.P + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Masse et poids</h3><table class="mt"><thead><tr><th></th><th>Masse</th><th>Poids</th></tr></thead><tbody><tr><td>Nature</td><td>quantité de matière</td><td>force (attraction)</td></tr><tr><td>Instrument</td><td>balance</td><td>dynamomètre</td></tr><tr><td>Unité</td><td>kilogramme (kg)</td><td>newton (N)</td></tr><tr><td>Dépend du lieu ?</td><td>non</td><td>oui</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'dynamo', m: 0.3, lieu: 'terre', obj: 'mangue', sc: 1, pts: [] }); cM.set('dynamo'); sM.set(300); cL.set('terre'); cO.set('mangue'); cS.set('1'); vis(); rows = []; paint(); });
      api.say('Accroche une masse et relève le poids.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures.</p>';
        return '<p>La <b>masse</b> m d’un corps se mesure avec une balance, en <b>kilogrammes</b> ; elle ne dépend pas du lieu. Le <b>poids</b> P est la force d’attraction exercée par la Terre (ou l’astre) sur le corps ; il se mesure avec un <b>dynamomètre</b>, en <b>newtons</b>.</p><p>Le rapport P / m est constant en un lieu donné : c’est l’intensité de la pesanteur g. <b>P = m × g</b>, avec g ≈ 9,8 N/kg sur Terre et 1,6 N/kg sur la Lune. La courbe P = f(m) est une droite qui passe par l’origine.</p><p>Caractéristiques du poids : point d’application G (centre de gravité), direction verticale, sens vers le bas, valeur P = m × g.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Masse et poids' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’astronaute',
    intro: 'Pèse, calcule, voyage : de la Terre à la Lune !',
    missions: [
      { title: '4,9 N', text: 'Sur Terre, accroche la masse qui donne un poids de <span style="color:#FF8A80">4,9 N</span>.', lumi: 'm = P / g.', hint: '4,9 / 9,8 = 0,5 kg.',
        build: function (api) { var lab = mini(api, { m: 0 }); api.c.slider({ label: 'Masse', min: 0, max: 1000, step: 50, value: 0, unit: 'g', dec: 0, onInput: function (v) { lab.st.m = v / 1000; } }); return function () { var r = lab.res(); return Math.abs(r.P - 4.9) < 0.01 ? { ok: true, msg: '500 g × 9,8 N/kg = 4,9 N.' } : { ok: false, msg: 'Poids : ' + fmt(r.P, 2) + ' N.' }; }; },
        e: 'm = P / g = 0,5 kg.' },
      { type: 'qcm', title: 'Sur la Lune', text: 'Un astronaute a une masse de 80 kg sur Terre. Sur la Lune, sa masse est :', o: ['80 kg', '13 kg', '128 kg', '0 kg'], a: 0, hint: 'La masse dépend-elle du lieu ?', e: 'La masse ne change pas : 80 kg.' },
      { title: 'Sous 1 N', text: 'Garde 600 g accrochés et trouve un lieu où le poids est <b>inférieur à 1 N</b>.', lumi: 'Où la pesanteur est-elle la plus faible ?', hint: 'Sur la Lune.',
        build: function (api) { var lab = mini(api, { m: 0.6, lieu: 'terre' }); api.c.seg({ label: 'Lieu', value: 'terre', options: [{ v: 'terre', l: 'Terre' }, { v: 'lune', l: 'Lune' }, { v: 'mars', l: 'Mars' }], onChange: function (v) { lab.st.lieu = v; } }); return function () { var r = lab.res(); return r.P < 1 ? { ok: true, msg: 'Sur la Lune : 0,6 × 1,6 = 0,96 N.' } : { ok: false, msg: fmt(r.P, 2) + ' N : encore trop.' }; }; },
        e: 'g Lune ≈ 1,6 N/kg.' },
      { type: 'qcm', title: 'Le sens', text: 'Le poids d’un objet est dirigé :', o: ['vers le haut', 'verticalement vers le bas', 'horizontalement', 'dans tous les sens'], a: 1, hint: 'Regarde le fil à plomb.', e: 'Verticale, vers le bas.' },
      { title: 'À l’échelle', text: 'Représente le poids du <b>sachet de riz</b> par une flèche de <b>moins de 6 cm</b>.', lumi: '9,8 N à 1 cm pour 1 N, c’est long…', hint: 'Choisis l’échelle 1 cm ↔ 2 N.',
        build: function (api) { var lab = mini(api, { mode: 'vecteur', obj: 'mangue' }); api.c.seg({ label: 'Objet', value: 'mangue', options: [{ v: 'mangue', l: 'mangue' }, { v: 'ballon', l: 'ballon' }, { v: 'riz', l: 'riz 1 kg' }], onChange: function (v) { lab.st.obj = v; } }); api.c.seg({ label: 'Échelle', value: '1', options: [{ v: '1', l: '1 cm ↔ 1 N' }, { v: '2', l: '1 cm ↔ 2 N' }], onChange: function (v) { lab.st.sc = +v; } }); return function () { var r = lab.res(); return r.obj === 'riz' && r.len < 6 ? { ok: true, msg: '9,8 N à 1 cm pour 2 N : 4,9 cm.' } : { ok: false, msg: r.obj !== 'riz' ? 'Choisis le sachet de riz.' : 'Flèche de ' + fmt(r.len, 1) + ' cm : trop longue.' }; }; },
        e: 'Longueur = P / échelle = 9,8 / 2 = 4,9 cm.' }
    ]
  };

  S.start({
    id: '3e-masse-poids', level: '3e', theme: 'Mécanique', title: 'Masse et poids d’un corps', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La <b>masse</b> m d’un corps est la quantité de matière qu’il contient. Elle se mesure avec une <b>balance</b> ; son unité légale est le <b>kilogramme (kg)</b>. Elle ne dépend pas du lieu.',
      'Le <b>poids</b> P d’un corps est la force d’attraction que la Terre exerce sur lui. Il se mesure avec un <b>dynamomètre</b> ; son unité est le <b>newton (N)</b>. Il dépend du lieu.',
      'Relation : <b>P = m × g</b> ; g est l’intensité de la pesanteur : g ≈ 9,8 N/kg sur Terre (souvent arrondi à 10 N/kg), g ≈ 1,6 N/kg sur la Lune.',
      'La représentation graphique de P en fonction de m est une <b>droite passant par l’origine</b> : P et m sont proportionnels.',
      'Caractéristiques du poids : point d’application = <b>centre de gravité G</b> ; direction = <b>verticale</b> ; sens = <b>vers le bas</b> ; valeur = m × g.'
    ],
    quiz: [
      { q: 'Le poids d’un corps se mesure avec :', o: ['une balance', 'un dynamomètre', 'une éprouvette', 'un thermomètre'], a: 1, e: 'Un dynamomètre.' },
      { q: 'L’unité de poids est :', o: ['le kilogramme', 'le newton', 'le gramme', 'le N/kg'], a: 1, e: 'Le newton (N).' },
      { q: 'Une masse de 5 kg sur Terre (g = 10 N/kg) a un poids de :', o: ['5 N', '0,5 N', '50 N', '15 N'], a: 2, e: '5 × 10 = 50 N.' },
      { q: 'Quand on va sur la Lune :', o: ['la masse diminue', 'le poids diminue', 'les deux restent égaux', 'le poids augmente'], a: 1, e: 'g est plus faible : le poids diminue, la masse reste la même.' },
      { q: 'Le poids est appliqué :', o: ['au point de contact', 'au centre de gravité', 'au sommet de l’objet', 'au fil'], a: 1, e: 'Au centre de gravité G.' }
    ]
  });
})();
