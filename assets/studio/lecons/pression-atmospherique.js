/* 5e · Mesure de grandeurs physiques · Leçon : Pression atmosphérique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var P0 = 1013;
  function Ph(h) { return 1013.25 * Math.pow(1 - 2.25577e-5 * h, 5.25588); }
  var PLACES = [[0, 'Abidjan (mer)'], [1189, 'mont Tonkoui'], [1752, 'mont Nimba'], [5895, 'Kilimandjaro'], [8849, 'Everest']];
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  var GID = 0;
  function grad(G, a, b) { var id = 'pa' + (GID++), gr = s('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': a }, gr); s('stop', { offset: 1, 'stop-color': b }, gr); return 'url(#' + id + ')'; }

  /* boîte de molécules : densité ∝ pression */
  function molBox(G, x, y, w, h, n) {
    var g = s('g', {}, G), cp = 'mb' + (GID++), cl = s('clipPath', { id: cp }, s('defs', {}, G)); s('rect', { x: x, y: y, width: w, height: h, rx: 10 }, cl);
    var inner = s('g', { 'clip-path': 'url(#' + cp + ')' }, g), M = [];
    for (var i = 0; i < n; i++) M.push(s('circle', { r: 3.2, fill: i % 5 ? '#9FD7FF' : '#FFC773' }, inner));
    return { g: g, set: function (k, T) { var on = Math.round(n * Math.max(0, Math.min(1, k))); M.forEach(function (m, i) { if (i >= on) { m.style.display = 'none'; return; } m.style.display = ''; var u = (rnd(i, 1) + T * (0.05 + rnd(i, 3) * 0.12)) % 2, v = (rnd(i, 2) + T * (0.04 + rnd(i, 4) * 0.1)) % 2; u = u > 1 ? 2 - u : u; v = v > 1 ? 2 - v : v; attr(m, { cx: x + 5 + u * (w - 10), cy: y + 5 + v * (h - 10) }); }); } };
  }
  function arrows(G, cx, cy, rx, ry, n, inward, col) {
    var g = s('g', {}, G), A = [];
    for (var i = 0; i < n; i++) A.push(s('path', { fill: col }, g));
    return { g: g, set: function (L) { A.forEach(function (p, i) { var a = i / n * Math.PI * 2, ex = cx + rx * Math.cos(a), ey = cy + ry * Math.sin(a), ux = Math.cos(a), uy = Math.sin(a), d = inward ? -1 : 1, sx = ex + (inward ? ux * (L + 6) : -ux * 4), sy = ey + (inward ? uy * (L + 6) : -uy * 4); p.setAttribute('d', L < 3 ? '' : K.arrow(sx, sy, sx + d * ux * L, sy + d * uy * L, 3, 6, 9)); }); } };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'alt', h: 0, pump: 0, card: true, rot: 0, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    /* ---------- ALTITUDE ---------- */
    var A = s('g', {}, G), H0 = 420, H1 = 150, HM = 9000;
    function yh(h) { return H0 - (H0 - H1) * h / HM; }
    s('rect', { x: 40, y: 40, width: 500, height: 400, rx: 22, fill: grad(G, '#0B1530', '#1E4A7A') }, A);
    s('path', { d: 'M60 420 L150 ' + yh(1752) + ' L200 ' + yh(1200) + ' L290 ' + yh(5895) + ' L330 ' + yh(4500) + ' L420 ' + yh(8849) + ' L520 420 Z', fill: '#24324F' }, A);
    s('path', { d: 'M290 ' + yh(5895) + ' l-22 40 h18 l8 -10 l10 12 h12z M420 ' + yh(8849) + ' l-30 60 h22 l10 -14 l12 16 h16z', fill: '#E8F0FA' }, A);
    s('rect', { x: 40, y: 410, width: 500, height: 30, rx: 0, fill: '#1D6FA8', opacity: 0.8 }, A);
    for (var k = 0; k <= 9; k++) { var y = yh(k * 1000); s('line', { x1: 70, x2: 78, y1: y, y2: y, stroke: '#7D89A3', 'stroke-width': 1.5 }, A); s('text', { x: 66, y: y + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#7D89A3', text: k * 1000 }, A); }
    s('text', { x: 60, y: 60, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'altitude (m)' }, A);
    PLACES.forEach(function (p) { var y = yh(p[0]); s('circle', { cx: 92, cy: y, r: 3, fill: '#FFC773' }, A); s('text', { x: 98, y: y + 4, 'font-size': 10.5, 'font-weight': 700, fill: '#FFC773', text: p[1] }, A); });
    var bal = s('g', {}, A), balB = s('circle', { fill: '#FF5A4E', stroke: '#FFB3A8', 'stroke-width': 2 }, bal), balS = s('path', { stroke: '#C9D2E3', 'stroke-width': 1.5, fill: 'none' }, bal), balK = s('rect', { width: 16, height: 12, rx: 2, fill: '#C8A46A' }, bal);
    var balL = s('text', { 'font-size': 11, 'font-weight': 800, fill: '#EEF2F8', 'text-anchor': 'middle', text: 'ballon fermé' }, A);
    var hitA = s('rect', { x: 40, y: 40, width: 500, height: 400, fill: 'transparent', style: 'cursor:ns-resize;touch-action:none' }, A), drag = false;
    function pick(e) { var sv = G.ownerSVGElement, p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; p = p.matrixTransform(G.getScreenCTM().inverse()); st.h = Math.max(0, Math.min(HM, Math.round((H0 - p.y) / (H0 - H1) * HM / 50) * 50)); o.onDrag && o.onDrag(st.h); }
    hitA.addEventListener('pointerdown', function (e) { drag = true; try { hitA.setPointerCapture(e.pointerId); } catch (_) {} pick(e); }); hitA.addEventListener('pointermove', function (e) { if (drag) pick(e); }); hitA.addEventListener('pointerup', function () { drag = false; });
    /* ---------- BOUTEILLE ET POMPE ---------- */
    var B = s('g', {}, G), BX = 230, BY = 250;
    s('rect', { x: 40, y: 40, width: 500, height: 400, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, B);
    var outA = arrows(B, BX, BY, 92, 140, 14, true, '#4FC3FF');
    var bot = s('path', { fill: '#9FD7FF', 'fill-opacity': 0.12, stroke: '#BFE6FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, B);
    var inBox = molBox(B, BX - 50, BY - 90, 100, 190, 46);
    var inA = arrows(B, BX, BY, 40, 80, 10, false, '#FFC773');
    s('path', { d: 'M' + BX + ' 96 V70 H420 V150', fill: 'none', stroke: '#7D89A3', 'stroke-width': 8, 'stroke-linecap': 'round' }, B);
    s('rect', { x: 396, y: 150, width: 48, height: 150, rx: 8, fill: '#2A3346', stroke: '#5B6680', 'stroke-width': 2 }, B);
    var piston = s('rect', { x: 400, width: 40, height: 14, rx: 3, fill: '#C9D2E3' }, B), rod = s('rect', { x: 416, width: 8, rx: 2, fill: '#C9D2E3' }, B);
    s('text', { x: 420, y: 322, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'pompe à vide' }, B);
    var bLab = s('text', { x: BX, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, B);
    /* ---------- VERRE RETOURNÉ ---------- */
    var V = s('g', {}, G); s('rect', { x: 40, y: 40, width: 500, height: 400, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, V);
    s('rect', { x: 120, y: 410, width: 340, height: 14, rx: 4, fill: '#3A4560' }, V);
    var glass = s('g', {}, V), gW = s('path', { d: 'M-58 -70 L-48 70 H48 L58 -70Z', fill: '#4FA8FF', opacity: 0.75 }, glass);
    s('path', { d: 'M-62 -84 L-50 74 H50 L62 -84', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3.5 }, glass);
    var cardE = s('rect', { x: -70, y: -90, width: 140, height: 6, rx: 2, fill: '#F2EBD3' }, glass);
    var upArrows = s('g', {}, V), UA = [-40, -14, 14, 40].map(function () { return s('path', { fill: '#4FC3FF' }, upArrows); });
    var drops = s('g', {}, V), D = []; for (var i = 0; i < 24; i++) D.push(s('circle', { r: 4 + rnd(i, 5) * 3, fill: '#4FA8FF' }, drops));
    var vLab = s('text', { x: 290, y: 70, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, V);
    /* ---------- BAROMÈTRE ---------- */
    var PX = 560, R = s('g', {}, G);
    s('rect', { x: PX, y: 24, width: 280, height: 422, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, R);
    var rT = s('text', { x: PX + 20, y: 50, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, R);
    var DX = PX + 140, DY = 150, DR = 92;
    s('circle', { cx: DX, cy: DY, r: DR + 10, fill: '#C9A86A' }, R); s('circle', { cx: DX, cy: DY, r: DR, fill: '#F7F4EA' }, R);
    for (var p = 300; p <= 1100; p += 50) { var a = (-135 + (p - 300) / 800 * 270) * Math.PI / 180, big = p % 100 === 0; s('line', { x1: DX + (DR - (big ? 14 : 8)) * Math.sin(a), y1: DY - (DR - (big ? 14 : 8)) * Math.cos(a), x2: DX + (DR - 2) * Math.sin(a), y2: DY - (DR - 2) * Math.cos(a), stroke: '#3A3426', 'stroke-width': big ? 2 : 1 }, R); if (p % 200 === 100 || p === 1100) s('text', { x: DX + (DR - 28) * Math.sin(a), y: DY - (DR - 28) * Math.cos(a) + 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 800, fill: '#3A3426', text: p }, R); }
    s('text', { x: DX, y: DY + 44, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 800, fill: '#6B624C', text: 'hPa' }, R);
    var a1013 = (-135 + (1013 - 300) / 800 * 270) * Math.PI / 180; s('path', { d: 'M' + (DX + (DR + 2) * Math.sin(a1013)) + ' ' + (DY - (DR + 2) * Math.cos(a1013)) + ' l-5 -9 h10z', fill: '#3DD68C', transform: 'rotate(' + (a1013 * 180 / Math.PI) + ' ' + (DX + (DR + 2) * Math.sin(a1013)) + ' ' + (DY - (DR + 2) * Math.cos(a1013)) + ')' }, R);
    var needle = s('path', { d: 'M' + (DX - 4) + ' ' + DY + ' L' + DX + ' ' + (DY - DR + 16) + ' L' + (DX + 4) + ' ' + DY + 'Z', fill: '#C62828' }, R); s('circle', { cx: DX, cy: DY, r: 7, fill: '#3A3426' }, R);
    var pv = s('text', { x: DX, y: 284, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 900, fill: '#FFC773' }, R);
    var pv2 = s('text', { x: DX, y: 306, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, R);
    s('text', { x: PX + 20, y: 334, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'LOUPE SUR L’AIR' }, R);
    s('rect', { x: PX + 20, y: 342, width: 240, height: 88, rx: 10, fill: '#0A0F1A', stroke: '#2B3A57' }, R);
    var air = molBox(R, PX + 20, 342, 240, 88, 60);
    var last = performance.now(), rotC = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      A.style.display = st.mode === 'alt' ? '' : 'none'; B.style.display = st.mode === 'vide' ? '' : 'none'; V.style.display = st.mode === 'verre' ? '' : 'none';
      var Pout = st.mode === 'alt' ? Ph(st.h) : P0, Pshow = Pout, res = {};
      if (st.mode === 'alt') {
        var r0 = 22, r = r0 * Math.pow(P0 / Pout, 1 / 3), y = yh(st.h);
        attr(balB, { cx: 470, cy: y - r - 26, r: r }); balS.setAttribute('d', 'M470 ' + (y - 26) + ' V' + (y - 6)); attr(balK, { x: 462, y: y - 6 }); attr(balL, { x: 470, y: Math.min(y + 24, 404) });
        rT.textContent = 'BAROMÈTRE · ' + fmt(st.h, 0) + ' m';
        res = { P: Pout, h: st.h };
      } else if (st.mode === 'vide') {
        var Pin = P0 * (1 - 0.92 * st.pump), cr = Math.max(0, (1 - Pin / P0) - 0.25) / 0.75, w = 70 * (1 - 0.55 * cr), bw = 74 * (1 - 0.4 * cr);
        var d = 'M' + (BX - 18) + ' 96 V120 Q' + (BX - w) + ' 140 ' + (BX - w) + ' 180 Q' + (BX - w + 18 * cr) + ' 250 ' + (BX - bw) + ' 330 Q' + (BX - bw) + ' 380 ' + BX + ' 382 Q' + (BX + bw) + ' 380 ' + (BX + bw) + ' 330 Q' + (BX + w - 18 * cr) + ' 250 ' + (BX + w) + ' 180 Q' + (BX + w) + ' 140 ' + (BX + 18) + ' 120 V96Z';
        bot.setAttribute('d', d); inBox.set(Pin / P0, T); outA.set(26); inA.set(26 * Pin / P0);
        var py = 160 + st.pump * 110; attr(piston, { y: py }); attr(rod, { y: 120, height: py - 120 });
        bLab.textContent = 'air à l’intérieur : ' + Math.round(Pin) + ' hPa · dehors : 1 013 hPa';
        rT.textContent = 'MANOMÈTRE (dans la bouteille)'; Pshow = Pin;
        res = { P: Pin, crush: cr };
      } else {
        if (st.t == null) rotC += (st.rot - rotC) * Math.min(1, dt * 4); else rotC = st.rot;
        var ang = rotC * 180, fall = rotC > 0.55 && !st.card;
        glass.setAttribute('transform', 'translate(290 ' + (220 + 40 * rotC) + ') rotate(' + ang + ')');
        cardE.style.display = st.card ? '' : 'none';
        var full = !st.card && rotC > 0.55 ? 0 : 1; gW.setAttribute('opacity', 0.75 * full);
        drops.style.display = !st.card && rotC > 0.5 ? '' : 'none';
        D.forEach(function (c, i) { var ph = ((T * 1.4 + rnd(i, 6)) % 1); attr(c, { cx: 290 - 44 + rnd(i, 7) * 88, cy: 280 + ph * 120, opacity: 1 - ph * 0.7 }); });
        var showUp = st.card && rotC > 0.9; upArrows.style.display = showUp ? '' : 'none';
        UA.forEach(function (pth, i) { var x = 290 + [-40, -14, 14, 40][i]; pth.setAttribute('d', K.arrow(x, 402, x, 362, 3, 7, 10)); });
        vLab.textContent = rotC < 0.1 ? 'Verre plein d’eau' + (st.card ? ', couvert d’une carte' : '') : rotC > 0.9 ? (st.card ? 'L’eau reste : l’air pousse la carte vers le haut !' : 'Sans carte, l’eau tombe.') : '';
        rT.textContent = 'BAROMÈTRE (dans la classe)';
        res = { up: rotC > 0.9, card: st.card, hold: st.card && rotC > 0.9 };
      }
      var a = (-135 + (Math.max(300, Math.min(1100, Pshow)) - 300) / 800 * 270);
      needle.setAttribute('transform', 'rotate(' + a + ' ' + DX + ' ' + DY + ')');
      pv.textContent = fmt(Math.round(Pshow), 0) + ' hPa'; pv2.textContent = st.mode === 'alt' ? (Pshow > 1000 ? 'pression normale au niveau de la mer' : 'l’air se raréfie avec l’altitude') : st.mode === 'vide' ? (Pshow < 500 ? 'presque plus d’air dedans' : 'air intérieur') : 'pression atmosphérique normale';
      air.set(Pshow / P0 * 0.95, T);
      res.Pshow = Pshow; return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’air presse sur tout' }, { t: 12, title: 'Le verre retourné' }, { t: 24, title: 'La bouteille écrasée' }, { t: 36, title: 'Le baromètre' }, { t: 46, title: 'En altitude' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’air exerce une <b>pression</b> sur tout', 'dans toutes les directions : c’est la pression atmosphérique.', 'var(--blue)'],
      ['On la mesure avec un <b>baromètre</b>', 'en hectopascals (hPa) : environ <b>1 013 hPa</b> au niveau de la mer.', '#FFC773'],
      ['Elle <b>diminue avec l’altitude</b>', 'l’air est moins dense en montagne.', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t;
        if (t < 12) { st.mode = 'vide'; st.pump = 0; }
        else if (t < 24) { st.mode = 'verre'; st.card = t < 19.5; st.rot = t < 19.5 ? K.k(t, 14, 2) : 1; }
        else if (t < 36) { st.mode = 'vide'; st.pump = K.k(t, 26, 7); }
        else if (t < 46) { st.mode = 'alt'; st.h = 0; }
        else { st.mode = 'alt'; st.h = t < 50 ? 1752 * K.k(t, 46.4, 2.5) : 1752 + (8849 - 1752) * K.k(t, 51, 4); }
        lab.step();
        tg.show(t, 3, 11.6, 290, 92, 'Les molécules d’air frappent les parois') || tg.show(t, 16.4, 19.2, 290, 92, 'La carte tient : l’air la pousse !') || tg.show(t, 20, 23.6, 290, 92, 'Sans carte, l’eau tombe') ||
          tg.show(t, 27, 35.6, 290, 92, 'Moins d’air dedans : la bouteille s’écrase') || tg.show(t, 37, 45.6, 290, 92, 'Au niveau de la mer : 1 013 hPa') || tg.show(t, 48.6, 50.6, 290, 92, 'Mont Nimba : environ 820 hPa') || tg.show(t, 53, 57.6, 290, 92, 'Everest : environ 315 hPa');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : des molécules d’air dans une bouteille, un verre d’eau couvert d’une carte que l’on retourne, une bouteille qui s’écrase quand on pompe son air, puis un baromètre qui indique 1 013 hPa et une montée en altitude jusqu’au mont Nimba et à l’Everest',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 5.4, say: 'L’air qui nous entoure est fait de milliards de molécules qui s’agitent sans cesse.', sub: 'L’air : des milliards de <b>molécules</b> en mouvement.' },
      { t: 5.6, d: 6.2, say: 'Elles frappent tout ce qu’elles touchent, dans toutes les directions : l’air exerce une pression, la pression atmosphérique.', sub: 'L’air exerce une <b>pression</b> : la pression atmosphérique.' },
      { t: 12, d: 4, say: 'Couvrons un verre plein d’eau avec une carte, et retournons-le.', sub: 'Un verre d’eau, une carte… on retourne !' },
      { t: 16.2, d: 3.4, say: 'L’eau ne tombe pas : l’air pousse la carte vers le haut.', sub: 'L’eau reste : l’air <b>pousse</b> la carte.' },
      { t: 19.8, d: 4, say: 'Sans carte, bien sûr, l’eau tombe.', sub: 'Sans carte, l’eau tombe.' },
      { t: 24, d: 11.4, say: 'Pompons l’air d’une bouteille en plastique : il y a de moins en moins d’air à l’intérieur. L’air extérieur, lui, pousse toujours aussi fort… et la bouteille s’écrase !', sub: 'Moins d’air dedans : la pression de l’air extérieur <b>écrase</b> la bouteille.' },
      { t: 36, d: 9.6, say: 'On mesure la pression atmosphérique avec un baromètre. Au niveau de la mer, à Abidjan, elle vaut environ mille treize hectopascals.', sub: 'Le <b>baromètre</b> : environ <b>1 013 hPa</b> au niveau de la mer.' },
      { t: 46, d: 5, say: 'Montons au sommet du mont Nimba : le baromètre n’indique plus que huit cent vingt hectopascals.', sub: 'Au mont Nimba (1 752 m) : environ <b>820 hPa</b>.' },
      { t: 51.2, d: 6.6, say: 'Au sommet de l’Everest, à peine trois cents. Plus on monte, plus la pression diminue : l’air se raréfie.', sub: 'Plus on monte, plus la pression <b>diminue</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : l’air exerce une pression sur tous les objets.', sub: 'L’air exerce une <b>pression</b>.' },
      { t: 62.6, d: 4.2, say: 'Elle se mesure en hectopascals avec un baromètre.', sub: 'Baromètre, unité : <b>hPa</b>.' },
      { t: 67, d: 5, say: 'Elle diminue quand l’altitude augmente.', sub: 'Elle diminue avec l’<b>altitude</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'L’air exerce une <b>pression</b> dans toutes les directions.' },
      { t: 35, ch: 2, html: 'Moins d’air dedans : la pression extérieure <b>écrase</b> la bouteille.' },
      { t: 45, ch: 3, html: '<b>Baromètre</b> : environ 1 013 hPa au niveau de la mer.' },
      { t: 57, ch: 4, html: 'La pression atmosphérique <b>diminue</b> avec l’altitude.' }
    ],
    question: { q: 'Un baromètre sert à mesurer :', o: ['la température', 'la pression atmosphérique', 'l’humidité', 'la vitesse du vent'], a: 1, e: 'Il indique la pression en hectopascals.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Trois expériences sur la pression atmosphérique : montée en altitude avec un baromètre et un ballon fermé, bouteille dont on pompe l’air, verre d’eau retourné avec ou sans carte ; un baromètre et une loupe sur les molécules d’air à droite',
    steps: [
      'Altitude : fais glisser le ballon vers le haut (ou utilise le curseur) et observe le baromètre et la taille du ballon.',
      'Bouteille : pompe l’air de la bouteille. Pourquoi s’écrase-t-elle ?',
      'Verre : retourne le verre avec, puis sans carte.',
      'Relève la pression à plusieurs altitudes dans l’onglet Mesures.'
    ],
    build: function (api) {
      var sH;
      var lab = Lab(api.g, { onDrag: function (h) { sH && sH.set(h); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'alt', options: [{ v: 'alt', l: 'En altitude' }, { v: 'vide', l: 'Bouteille et pompe' }, { v: 'verre', l: 'Verre retourné' }], onChange: function (v) { st.mode = v; vis(); } });
      sH = c.slider({ label: 'Altitude', min: 0, max: 9000, step: 50, value: 0, unit: 'm', onInput: function (v) { st.h = v; } });
      var rP = c.row(); PLACES.forEach(function (p) { c.button({ label: p[1], sm: true, into: rP, onClick: function () { st.h = p[0]; sH.set(p[0]); } }); });
      var sP = c.slider({ label: 'Air pompé', min: 0, max: 100, step: 5, value: 0, unit: '%', onInput: function (v) { st.pump = v / 100; } });
      var tC = c.toggle({ label: 'Carte sur le verre', value: true, onChange: function (v) { st.card = v; } });
      var bV = c.button({ label: 'Retourner le verre', primary: true, onClick: function () { st.rot = st.rot ? 0 : 1; api.sound('tick'); } });
      function vis() { var m = st.mode; sH.hide(m !== 'alt'); rP.style.display = m === 'alt' ? 'flex' : 'none'; sP.hide(m !== 'vide'); tC.hide(m !== 'verre'); bV.style.display = m === 'verre' ? '' : 'none'; }
      vis();
      var ro = api.readouts([{ k: 'p', label: 'Pression' }, { k: 'x', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.p.set(Math.round(last.Pshow) + ' hPa'); ro.x.set(st.mode === 'alt' ? fmt(st.h, 0) + ' m d’altitude' : st.mode === 'vide' ? (last.crush > 0.1 ? 'la bouteille s’écrase' : 'la bouteille tient') : (last.up ? (last.hold ? 'l’eau reste' : 'l’eau tombe') : 'verre à l’endroit')); });
      var M = api.measure; M.innerHTML = '<h3>Pression et altitude</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever (mode altitude)'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode !== 'alt') { api.say('Passe en mode « En altitude » pour relever.'); return; } rows.push({ h: st.h, p: last.P }); rows.sort(function (a, b) { return a.h - b.h; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Altitude</th><th>Pression</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + fmt(r.h, 0) + ' m</td><td>' + Math.round(r.p) + ' hPa</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Pression en fonction de l’altitude</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'altitude (m)', ylabel: 'pression (hPa)', xmin: 0, xmax: 9000, xstep: 1500, ymin: 0, ymax: 1100, ystep: 250, series: [{ color: '#4FC3FF', pts: rows.map(function (r) { return [r.h, r.p]; }) }] });
      }
      paint();
      api.onReset(function () { st.mode = 'alt'; st.h = 0; st.pump = 0; st.card = true; st.rot = 0; cM.set('alt'); sH.set(0); sP.set(0); tC.set(true); vis(); rows = []; paint(); });
      api.say('Fais monter le ballon et regarde le baromètre.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève la pression à au moins 3 altitudes.</p>';
        return '<p>L’air exerce sur tous les objets une <b>pression</b>, dans toutes les directions : c’est la <b>pression atmosphérique</b>. Elle maintient la carte sous le verre retourné et écrase la bouteille dont on a retiré l’air.</p><p>On la mesure avec un <b>baromètre</b>. Unité usuelle : l’<b>hectopascal</b> (hPa). Au niveau de la mer, elle vaut environ <b>1 013 hPa</b>.</p><p>Elle <b>diminue quand l’altitude augmente</b> : environ 820 hPa au mont Nimba, 315 hPa au sommet de l’Everest. Un ballon fermé gonfle en montant.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Expérience sur la pression atmosphérique' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’alpiniste',
    intro: 'De la lagune aux sommets : la pression n’aura plus de secret pour toi !',
    missions: [
      { title: 'À 820 hPa', text: 'Fais monter le ballon jusqu’à ce que le baromètre indique environ <span style="color:var(--amber)">820 hPa</span>.', lumi: 'Glisse le ballon vers le haut.', hint: 'C’est l’altitude du mont Nimba, environ 1 750 m.',
        build: function (api) { var lab = mini(api, { mode: 'alt', h: 0 }); api.c.slider({ label: 'Altitude', min: 0, max: 9000, step: 50, value: 0, unit: 'm', onInput: function (v) { lab.st.h = v; } }); return function () { var r = lab.res(); return Math.abs(r.P - 820) <= 15 ? { ok: true, msg: Math.round(r.P) + ' hPa à ' + r.h + ' m : tu es au mont Nimba !' } : { ok: false, msg: 'Le baromètre indique ' + Math.round(r.P) + ' hPa.' }; }; },
        e: 'Vers 1 750 m d’altitude, la pression est d’environ 820 hPa.' },
      { type: 'qcm', title: 'Au bord de la mer', text: 'Au niveau de la mer, la pression atmosphérique normale vaut environ :', o: ['100 hPa', '500 hPa', '1 013 hPa', '10 000 hPa'], a: 2, hint: 'Un peu plus de mille.', e: 'Environ 1 013 hPa.' },
      { title: 'Écrase la bouteille', text: 'Pompe l’air pour que la bouteille <span style="color:var(--amber)">s’écrase</span>.', lumi: 'Qui écrase vraiment la bouteille ?', hint: 'Pompe au moins la moitié de l’air.',
        build: function (api) { var lab = mini(api, { mode: 'vide' }); api.c.slider({ label: 'Air pompé', min: 0, max: 100, step: 5, value: 0, unit: '%', onInput: function (v) { lab.st.pump = v / 100; } }); return function () { var r = lab.res(); return r.crush > 0.4 ? { ok: true, msg: 'L’air extérieur pousse plus fort que l’air intérieur : la bouteille s’écrase.' } : { ok: false, msg: 'La bouteille résiste encore.' }; }; },
        e: 'C’est la pression de l’air extérieur qui écrase la bouteille.' },
      { title: 'Le tour de magie', text: 'Retourne le verre <b>sans renverser l’eau</b>.', lumi: 'Un petit morceau de carton peut suffire…', hint: 'Garde la carte, puis retourne.',
        build: function (api) { var lab = mini(api, { mode: 'verre', card: false }); api.c.toggle({ label: 'Carte sur le verre', value: false, onChange: function (v) { lab.st.card = v; } }); api.c.button({ label: 'Retourner le verre', sm: true, onClick: function () { lab.st.rot = lab.st.rot ? 0 : 1; } }); return function () { var r = lab.res(); return r.hold ? { ok: true, msg: 'L’air pousse la carte vers le haut : l’eau reste !' } : { ok: false, msg: r.up ? 'L’eau est tombée !' : 'Le verre n’est pas retourné.' }; }; },
        e: 'La pression atmosphérique pousse la carte vers le haut.' },
      { type: 'qcm', title: 'En montagne', text: 'Quand on monte en altitude, la pression atmosphérique :', o: ['augmente', 'diminue', 'ne change pas', 'devient nulle'], a: 1, hint: 'Regarde le ballon fermé.', e: 'L’air se raréfie : la pression diminue.' }
    ]
  };

  S.start({
    inquiry: {"situation": "L’air autour de nous semble invisible et léger. Quels effets du dispositif permettraient de montrer qu’il exerce une pression ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-pression-atmospherique', level: '5e', theme: 'Mesure de grandeurs physiques', title: 'Pression atmosphérique', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’air qui nous entoure exerce sur tous les objets une <b>pression</b>, dans <b>toutes les directions</b> : c’est la <b>pression atmosphérique</b>.',
      'Expériences : le verre d’eau retourné reste plein grâce à une carte ; une bouteille dont on retire l’air est écrasée par l’air extérieur ; la ventouse colle au mur.',
      'La pression atmosphérique se mesure avec un <b>baromètre</b>. Son unité usuelle est l’<b>hectopascal</b> (hPa) ; on utilise aussi le centimètre de mercure (cmHg).',
      'Au niveau de la mer, la pression atmosphérique normale vaut environ <b>1 013 hPa</b> (76 cmHg).',
      'La pression atmosphérique <b>diminue quand l’altitude augmente</b>.'
    ],
    quiz: [
      { q: 'La pression atmosphérique est due :', o: ['au Soleil', 'à l’air qui nous entoure', 'à l’eau', 'au vent seulement'], a: 1, e: 'Les molécules d’air frappent les objets.' },
      { q: 'L’unité usuelle de la pression atmosphérique :', o: ['le degré', 'l’hectopascal', 'le volt', 'le mètre'], a: 1, e: 'On l’exprime en hectopascals (hPa) : 1 hPa = 100 Pa, et la pression normale vaut environ 1 013 hPa.' },
      { q: 'L’appareil de mesure est :', o: ['le thermomètre', 'le baromètre', 'l’ampèremètre', 'la balance'], a: 1, e: 'Le baromètre mesure la pression atmosphérique ; le thermomètre mesure la température et l’ampèremètre l’intensité.' },
      { q: 'À Abidjan (bord de mer), la pression est voisine de :', o: ['1 013 hPa', '820 hPa', '315 hPa', '0 hPa'], a: 0, e: 'Niveau de la mer.' },
      { q: 'Un ballon fermé monté en altitude :', o: ['dégonfle', 'gonfle', 'ne change pas', 'devient plus lourd'], a: 1, e: 'La pression extérieure diminue.' }
    ]
  });
})();

