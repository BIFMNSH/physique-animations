/* 4e · Optique · Leçon : Propagation de la lumière */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit;
  var PX = 5, X0 = 70, YC = 220;          // 5 px par cm ; source en X0 ; axe à YC
  var GID = 0;
  function glow(G, col) { var id = 'pg' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }

  /* ombre et pénombre (y vers le haut) : demi-hauteurs sur l'écran */
  function shadow(a, r, L1, L2) { var k = L1 / L2; return { U: (r - a * (1 - k)) / k, P: (r + a * (1 - k)) / k, apex: a > r ? L1 * a / (a - r) : Infinity }; }

  function Lab(G, o) {
    var st = Object.assign({ a: 0, r: 5, L1: 40, L2: 120, smoke: true }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: 'var(--scene)' }, G);
    s('rect', { x: 30, y: 420, width: 800, height: 12, rx: 6, fill: 'var(--scene2)', stroke: 'var(--scene-line)' }, G);
    for (var c = 0; c <= 150; c += 10) { var gx = X0 + c * PX; s('line', { x1: gx, x2: gx, y1: 420, y2: c % 50 ? 426 : 432, stroke: 'var(--scene-muted)' }, G); if (c % 20 === 0) s('text', { x: gx, y: 450, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--scene-muted)', text: c + ' cm' }, G); }
    var beam = s('path', { fill: '#FFE29A', opacity: 0.16 }, G);
    var pen = s('path', { fill: '#8A93A6', opacity: 0.45 }, G), umb = s('path', { fill: 'var(--scene)', stroke: 'var(--scene-muted)', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, G);
    var edges = s('g', {}, G);
    var srcG = s('g', {}, G), srcGlow = s('circle', { cx: X0, cy: YC, r: 60, fill: glow(G, '#FFE29A') }, srcG), srcB = s('rect', { x: X0 - 8, rx: 6, width: 16, fill: '#FFE680', stroke: 'var(--scene-text)', 'stroke-width': 2 }, srcG);
    var obj = s('g', {}, G), ball = s('circle', { fill: '#E5484D' }, obj), ballS = s('path', { fill: '#000', opacity: 0.45 }, obj), objHit = s('rect', { width: 60, height: 120, fill: 'transparent', style: 'cursor:ew-resize;touch-action:none' }, obj);
    s('line', { y1: 0, y2: 0, stroke: 'var(--scene-muted)', 'stroke-width': 3 }, obj);
    var objStand = s('line', { stroke: 'var(--scene-muted)', 'stroke-width': 3 }, G);
    var scr = s('g', {}, G), scrR = s('rect', { y: YC - 180, width: 10, height: 360, rx: 3, fill: '#F4F1EA', stroke: '#B8B2A4', 'stroke-width': 2 }, scr), scrHit = s('rect', { y: YC - 190, width: 50, height: 380, fill: 'transparent', style: 'cursor:ew-resize;touch-action:none' }, scr);
    var scrStand = s('line', { y1: YC + 180, y2: 420, stroke: 'var(--scene-muted)', 'stroke-width': 3 }, scr);
    var labs = s('g', {}, G), lU = s('text', { 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-text)' }, labs), lP = s('text', { 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-muted)' }, labs), lO = s('text', { 'font-size': 13, 'font-weight': 800, fill: '#FF9A9A' }, labs);
    // écran vu de face
    s('rect', { x: 120, y: 20, width: 150, height: 150, rx: 12, fill: '#F4F1EA', stroke: 'var(--scene-line)' }, G);
    var fP = s('circle', { cx: 195, cy: 95, fill: '#9AA0AC' }, G), fU = s('circle', { cx: 195, cy: 95, fill: '#141821' }, G);
    s('text', { x: 195, y: 186, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'l’écran vu de face' }, G);
    function svgX(e) { var sv = G.ownerSVGElement, p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(G.getScreenCTM().inverse()).x; }
    function dragger(el, set) { var on = false; el.addEventListener('pointerdown', function (e) { on = true; try { el.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); }); el.addEventListener('pointermove', function (e) { if (on) { set((svgX(e) - X0) / PX); o.onDrag && o.onDrag(); } }); el.addEventListener('pointerup', function () { on = false; }); }
    dragger(objHit, function (v) { st.L1 = clamp(Math.round(v), 15, st.L2 - 10); });
    dragger(scrHit, function (v) { st.L2 = clamp(Math.round(v), st.L1 + 10, 150); });
    function Y(v) { return YC - v * PX; }
    function step() {
      var a = st.a, r = st.r, L1 = st.L1, L2 = st.L2, sh = shadow(a, r, L1, L2), xo = X0 + L1 * PX, xe = X0 + L2 * PX;
      attr(srcB, { y: YC - Math.max(a, 1.2) * PX, height: Math.max(a, 1.2) * 2 * PX }); srcGlow.setAttribute('r', 50 + a * 6);
      ball.setAttribute('cx', xo); ball.setAttribute('cy', YC); ball.setAttribute('r', r * PX);
      ballS.setAttribute('d', 'M' + xo + ' ' + (YC - r * PX) + 'A' + r * PX + ' ' + r * PX + ' 0 0 1 ' + xo + ' ' + (YC + r * PX) + 'Z');
      attr(objHit, { x: xo - 30, y: YC - 60 });
      attr(objStand, { x1: xo, x2: xo, y1: YC + r * PX, y2: 420 });
      scr.setAttribute('transform', 'translate(' + xe + ' 0)'); scrHit.setAttribute('x', -20);
      // faisceau total (limité à l'écran)
      var spread = 36;
      beam.setAttribute('d', 'M' + X0 + ' ' + Y(a) + 'L' + xe + ' ' + Y(spread) + 'L' + xe + ' ' + Y(-spread) + 'L' + X0 + ' ' + Y(-a) + 'Z');
      beam.setAttribute('opacity', st.smoke ? 0.28 : 0.08);
      var Pn = Math.min(sh.P, spread), Un = clamp(sh.U, 0, spread);
      pen.setAttribute('d', a > 0 ? 'M' + xo + ' ' + Y(r) + 'L' + xe + ' ' + Y(Pn) + 'L' + xe + ' ' + Y(-Pn) + 'L' + xo + ' ' + Y(-r) + 'Z' : '');
      if (sh.U > 0) umb.setAttribute('d', 'M' + xo + ' ' + Y(r) + 'L' + xe + ' ' + Y(Un) + 'L' + xe + ' ' + Y(-Un) + 'L' + xo + ' ' + Y(-r) + 'Z');
      else { var ax = X0 + sh.apex * PX; umb.setAttribute('d', 'M' + xo + ' ' + Y(r) + 'L' + ax + ' ' + YC + 'L' + xo + ' ' + Y(-r) + 'Z'); }
      edges.innerHTML = '';
      [[a, r], [-a, -r], [a, -r], [-a, r]].forEach(function (p, i) {
        if (a === 0 && i > 1) return;
        var x1 = X0, y1 = p[0], x2 = xo, y2 = p[1], k = (xe - x1) / (x2 - x1), y3 = y1 + (y2 - y1) * k;
        s('line', { x1: x1, y1: Y(y1), x2: xe, y2: Y(y3), stroke: i < 2 ? '#FFB547' : '#C4B5FD', 'stroke-width': S.settings.proj ? 2.6 : 1.6, opacity: 0.9 }, edges);
      });
      var diam = Math.max(0, 2 * sh.U), pdiam = 2 * sh.P;
      attr(lU, { x: xe + 18, y: YC + 4, text: sh.U > 0 ? 'ombre : ' + fmt(diam, 1) + ' cm' : 'pas d’ombre complète' });
      attr(lP, { x: xe + 18, y: YC + 22, text: a > 0 ? 'pénombre : ' + fmt(pdiam, 1) + ' cm' : '' });
      attr(lO, { x: xo + 8, y: YC + r * PX + 18, text: 'ombre propre' });
      lU.style.display = xe > 720 ? 'none' : ''; lP.style.display = xe > 720 ? 'none' : '';
      var sc = 60 / 36; fU.setAttribute('r', Math.min(70, Math.max(0, sh.U) * sc)); fP.setAttribute('r', a > 0 ? Math.min(74, sh.P * sc) : 0);
      return { diam: diam, pdiam: a > 0 ? pdiam : 0 };
    }
    return { st: st, step: step, shadow: function () { return shadow(st.a, st.r, st.L1, st.L2); } };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'En ligne droite' }, { t: 14, title: 'Rayons et faisceaux' }, { t: 27, title: 'Ombre propre, ombre portée' }, { t: 40, title: 'La pénombre' }, { t: 52, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g1 = s('g', {}, G), g2 = s('g', {}, G), g3 = s('g', { transform: 'translate(10 52)' }, G), g4 = s('g', {}, G);
    // ch1 : trois cartons percés
    var lamp1 = s('circle', { cx: 100, cy: 230, r: 60, fill: glow(g1, '#FFE29A') }, g1); s('rect', { x: 92, y: 214, width: 16, height: 32, rx: 6, fill: '#FFE680', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g1);
    var cards = [0, 1, 2].map(function (i) { var c = s('g', {}, g1); s('rect', { x: -10, y: -90, width: 20, height: 180, rx: 3, fill: '#C8A27A', stroke: '#8B6A45', 'stroke-width': 2 }, c); s('circle', { r: 6, fill: '#05080F' }, c); return c; });
    var beam1 = s('path', { stroke: '#FFE29A', 'stroke-width': 6, opacity: 0.85, 'stroke-linecap': 'round' }, g1), eye1 = s('g', { transform: 'translate(790 230) scale(-1 1)' }, g1);
    s('path', { d: 'M-40 0 Q0 -32 40 0 Q0 32 -40 0Z', fill: '#FDFBF4', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, eye1); s('circle', { cx: -14, r: 13, fill: '#6B4A2E' }, eye1);
    // ch2 : faisceaux
    var fb = s('g', {}, g2);
    // ch3/4 : banc d'ombre
    var lab = Lab(g3, { a: 0, r: 6, L1: 50, L2: 130 }), st = lab.st;
    var cardsF = K.cards(g4, [
      ['La lumière se propage en <b>ligne droite</b>', 'dans un milieu homogène et transparent (air, eau, verre).', 'var(--amber)'],
      ['On la représente par des <b>rayons</b>', 'un faisceau peut être divergent, parallèle ou convergent.', 'var(--blue)'],
      ['Un objet opaque éclairé a une <b>ombre propre</b> et une <b>ombre portée</b>', 'avec une source étendue, il y a aussi une pénombre.', 'var(--green)']], [52.2, 56.8, 61.4]);
    function render(t) {
      tg.begin();
      if (K.group(g1, t, -1, 14.2)) {
        var off = t < 6 ? 0 : t < 10 ? 40 * K.k(t, 6.2, 0.8) : 40 * (1 - K.k(t, 10.2, 0.8));
        cards.forEach(function (c, i) { c.setAttribute('transform', 'translate(' + (280 + i * 160) + ' ' + (230 + (i === 1 ? off : 0)) + ')'); });
        var through = off < 3;
        beam1.setAttribute('d', through ? 'M108 230 H750' : 'M108 230 H' + 440);
        tg.show(t, 2, 5.8, 450, 380, 'Trous alignés : l’œil voit la lampe') || tg.show(t, 6.8, 9.8, 450, 380, 'Un carton décalé : la lumière est arrêtée');
      }
      if (K.group(g2, t, 14, 27.2)) {
        fb.innerHTML = '';
        var x0 = 60, mid = t < 18.4 ? 0 : t < 22.6 ? 1 : 2;
        var titles = ['Faisceau divergent : il s’ouvre', 'Faisceau parallèle : rayons du Soleil', 'Faisceau convergent : avec une loupe'];
        for (var i = -3; i <= 3; i++) {
          var y = 230 + i * 26, d;
          if (mid === 0) d = 'M120 230 L820 ' + (230 + i * 50);
          else if (mid === 1) d = 'M60 ' + y + ' L820 ' + y;
          else d = 'M60 ' + y + ' L420 ' + y + ' L820 ' + (230 - i * 26 * 1.1);
          s('path', { d: d, stroke: '#FFE29A', 'stroke-width': 2.4, opacity: 0.9, fill: 'none' }, fb);
          var pts = d.split(/[ML ]/).filter(Boolean).map(Number), L = pts.length, ax = pts[L - 4] + (pts[L - 2] - pts[L - 4]) * 0.5, ay = pts[L - 3] + (pts[L - 1] - pts[L - 3]) * 0.5;
          s('path', { d: K.arrow(ax - 10, ay - (pts[L - 1] - pts[L - 3]) / (pts[L - 2] - pts[L - 4]) * 10, ax, ay, 1.2, 6, 10), fill: '#FFE29A' }, fb);
        }
        if (mid === 0) s('circle', { cx: 120, cy: 230, r: 14, fill: '#FFE680' }, fb);
        if (mid === 2) s('path', { d: 'M420 140 Q444 230 420 320 Q396 230 420 140Z', fill: 'var(--blue)', 'fill-opacity': 0.35, stroke: 'var(--blue)', 'stroke-width': 2 }, fb);
        tg.show(t, 14.6, 26.6, 450, 70, titles[mid]);
      }
      if (K.group(g3, t, 27, 52.2)) {
        st.a = t < 40 ? 0 : 4 * K.k(t, 41, 2); st.r = 6; st.L1 = t < 33 ? 55 : t < 39 ? 55 - 15 * K.k(t, 33.5, 2) : 40; st.L2 = 120;
        lab.step();
        tg.show(t, 28, 32.8, 560, 40, 'Partie non éclairée : ombre propre') || tg.show(t, 33.4, 39.6, 560, 40, 'Sur l’écran : ombre portée') || tg.show(t, 43, 51.6, 560, 40, 'Source étendue : ombre + pénombre');
      }
      K.group(g4, t, 51.8, 99); cardsF(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : trois cartons percés alignés, des faisceaux divergent, parallèle et convergent, puis une balle éclairée qui projette son ombre et une pénombre sur un écran',
    duration: 66, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Trois cartons percés sont alignés devant une lampe : l’œil voit la lumière à travers les trois trous.', sub: 'Trous <b>alignés</b> : la lumière passe et arrive à l’œil.' },
      { t: 6.2, d: 7.6, say: 'Décalons un carton : la lumière est arrêtée. Elle ne peut pas contourner l’obstacle : elle se propage en ligne droite.', sub: 'Un carton décalé arrête la lumière : elle va en <b>ligne droite</b>.' },
      { t: 14, d: 4.2, say: 'On représente le trajet de la lumière par un rayon : une droite avec une flèche.', sub: 'On dessine des <b>rayons</b> : une droite fléchée.' },
      { t: 18.4, d: 4.2, say: 'Un faisceau qui s’ouvre est divergent. Les rayons du Soleil forment un faisceau parallèle.', sub: 'Faisceau <b>divergent</b>, faisceau <b>parallèle</b>…' },
      { t: 22.6, d: 4.4, say: 'Une loupe rend le faisceau convergent : les rayons se rapprochent.', sub: '…et faisceau <b>convergent</b> avec une loupe.' },
      { t: 27, d: 6, say: 'Une balle éclairée par une petite lampe : sa partie non éclairée est son ombre propre.', sub: 'La partie non éclairée de la balle : son <b>ombre propre</b>.' },
      { t: 33.2, d: 6.8, say: 'Sur l’écran, la zone où la lumière n’arrive pas est l’ombre portée. Plus la balle est près de la lampe, plus l’ombre est grande.', sub: 'Sur l’écran : l’<b>ombre portée</b>. Balle plus près de la lampe → ombre plus <b>grande</b>.' },
      { t: 40.2, d: 6, say: 'Avec une source étendue, comme une grosse lampe, une zone ne reçoit qu’une partie de la lumière : c’est la pénombre.', sub: 'Source <b>étendue</b> : il apparaît une <b>pénombre</b> autour de l’ombre.' },
      { t: 46.4, d: 5.4, say: 'L’ombre et la pénombre expliquent aussi les éclipses du Soleil et de la Lune.', sub: 'Ombre et pénombre expliquent les <b>éclipses</b>.' },
      { t: 52, d: 4.6, say: 'À retenir : la lumière se propage en ligne droite.', sub: 'La lumière se propage en <b>ligne droite</b>.' },
      { t: 56.8, d: 4.4, say: 'On la représente par des rayons, qui forment des faisceaux.', sub: 'On la représente par des <b>rayons</b>.' },
      { t: 61.4, d: 4.6, say: 'Un objet opaque éclairé possède une ombre propre et une ombre portée.', sub: '<b>Ombre propre</b> et <b>ombre portée</b>.' }
    ],
    learn: [
      { t: 12, ch: 1, html: 'Propagation <b>rectiligne</b> de la lumière.' },
      { t: 25, ch: 2, html: 'Faisceaux <b>divergent</b>, <b>parallèle</b>, <b>convergent</b>.' },
      { t: 38, ch: 3, html: '<b>Ombre propre</b> (sur l’objet), <b>ombre portée</b> (sur l’écran).' },
      { t: 48, ch: 4, html: 'Source étendue → <b>pénombre</b>.' }
    ],
    question: { q: 'Pourquoi un carton décalé arrête-t-il la lumière ?', o: ['Parce que la lumière se propage en ligne droite', 'Parce que le carton est transparent', 'Parce que la lampe s’éteint', 'Parce que l’œil est fermé'], a: 0, e: 'La lumière ne contourne pas les obstacles : elle va en ligne droite.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Banc gradué : une source de lumière ponctuelle ou étendue, une balle opaque et un écran ; l’ombre et la pénombre sur l’écran',
    steps: [
      'Avec une source ponctuelle, déplace la balle (glisse-la) puis l’écran : comment varie la taille de l’ombre portée ?',
      'Vérifie la règle : diamètre de l’ombre ÷ diamètre de la balle = distance source–écran ÷ distance source–balle.',
      'Agrandis la source (source étendue) : que voit-on autour de l’ombre ?',
      'Relève plusieurs mesures dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onDrag: function () { sL1.set(st.L1); sL2.set(st.L2); } }), st = lab.st, c = api.c, rows = [];
      var sA = c.slider({ label: 'Taille de la source (0 = ponctuelle)', min: 0, max: 15, step: 1, value: 0, unit: 'cm', onInput: function (v) { st.a = v / 2; } });
      var sR = c.slider({ label: 'Diamètre de la balle', min: 4, max: 20, step: 1, value: 10, unit: 'cm', onInput: function (v) { st.r = v / 2; } });
      var sL1 = c.slider({ label: 'Distance source – balle', min: 15, max: 140, step: 1, value: 40, unit: 'cm', onInput: function (v) { st.L1 = Math.min(v, st.L2 - 10); } });
      var sL2 = c.slider({ label: 'Distance source – écran', min: 25, max: 150, step: 1, value: 120, unit: 'cm', onInput: function (v) { st.L2 = Math.max(v, st.L1 + 10); } });
      var tS = c.toggle({ label: 'Fumée (pour voir le faisceau)', value: true, onChange: function (v) { st.smoke = v; } });
      var ro = api.readouts([{ k: 'o', label: 'Ombre portée' }, { k: 'p', label: 'Pénombre' }, { k: 'r', label: 'Ombre ÷ balle' }, { k: 'l', label: 'L₂ ÷ L₁' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.o.set(fmt(last.diam, 1) + ' cm'); ro.p.set(st.a > 0 ? fmt(last.pdiam, 1) + ' cm' : 'aucune'); ro.r.set(fmt(last.diam / (2 * st.r), 2)); ro.l.set(fmt(st.L2 / st.L1, 2)); });
      var M = api.measure; M.innerHTML = '<h3>Mesures de l’ombre</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), msg = api.h('div', { class: 'msg' }, M), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (last.diam > 72) { msg.className = 'msg warn'; msg.textContent = 'L’ombre est plus grande que l’écran : rapproche l’écran ou éloigne la balle.'; return; } var d = Math.round((last.diam + (S.prof.level === 'dec' ? 0 : S.gauss() * 0.2)) * 10) / 10; rows.push({ a: st.a * 2, b: st.r * 2, L1: st.L1, L2: st.L2, o: d }); msg.className = 'msg ok'; msg.textContent = 'Ombre de ' + fmt(d, 1) + ' cm relevée.'; api.sound('ok'); paint(); if (rows.length >= 3) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Source</th><th>Balle</th><th>L₁</th><th>L₂</th><th>Ombre</th><th>Ombre ÷ balle</th><th>L₂ ÷ L₁</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + (r.a ? r.a + ' cm' : 'ponct.') + '</td><td>' + r.b + '</td><td>' + r.L1 + '</td><td>' + r.L2 + '</td><td>' + fmt(r.o, 1) + '</td><td>' + fmt(r.o / r.b, 2) + '</td><td>' + fmt(r.L2 / r.L1, 2) + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure (distances en cm).</div>';
        api.chart.innerHTML = '<h3>Ombre ÷ balle en fonction de L₂ ÷ L₁</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'L₂ ÷ L₁', ylabel: 'ombre ÷ balle', xmin: 0, xmax: 8, xstep: 1, ymin: 0, ymax: 8, ystep: 1, series: [{ color: 'var(--amber)', pts: rows.filter(function (r) { return !r.a; }).map(function (r) { return [r.L2 / r.L1, r.o / r.b]; }), fit: true }] });
      }
      paint();
      api.onReset(function () { Object.assign(st, { a: 0, r: 5, L1: 40, L2: 120, smoke: true }); sA.set(0); sR.set(10); sL1.set(40); sL2.set(120); tS.set(true); rows = []; paint(); });
      api.say('Glisse la balle ou l’écran le long du banc, ou utilise les curseurs.');
      return { bilan: function () {
        var p = rows.filter(function (r) { return !r.a; });
        if (p.length < 2) return '<p>Avec une source ponctuelle, relève au moins 2 mesures.</p>';
        return '<p>Les points sont alignés sur une droite de pente 1 : <b>ombre ÷ balle = L₂ ÷ L₁</b>. C’est une conséquence de la <b>propagation rectiligne</b> de la lumière (théorème de Thalès).</p><p>Plus la balle est proche de la source, plus son ombre est grande. Une source étendue donne une <b>pénombre</b> autour de l’ombre.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Source, balle et écran' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var res = {}; api.loop(function () { res = lab.step(); }); lab.res = function () { return res; }; return lab; }
  var DEFI = {
    title: 'Le défi des ombres',
    intro: 'Rayons, faisceaux, ombre et pénombre : place la balle et l’écran au millimètre près !',
    missions: [
      { title: 'Ombre géante', text: 'Obtiens une ombre portée de <span style="color:var(--amber)">30 cm</span> (± 1 cm) avec la balle de 10 cm. L’écran est fixé à 120 cm.', lumi: 'L’ombre est 3 fois plus grande que la balle si l’écran est 3 fois plus loin que la balle…', hint: 'L₂ ÷ L₁ = 3 → L₁ = 120 ÷ 3 = 40 cm.',
        build: function (api) { var lab = mini(api, { a: 0, r: 5, L1: 80, L2: 120 }); var sl = api.c.slider({ label: 'Distance source – balle', min: 15, max: 110, step: 1, value: 80, unit: 'cm', onInput: function (v) { lab.st.L1 = v; } }); return function () { var d = lab.res().diam; return Math.abs(d - 30) <= 1 ? { ok: true, msg: 'Ombre de ' + fmt(d, 1) + ' cm : balle à ' + lab.st.L1 + ' cm.' } : { ok: false, msg: 'Ombre de ' + fmt(d, 1) + ' cm.' }; }; },
        e: 'Ombre ÷ balle = L₂ ÷ L₁ : 30 ÷ 10 = 120 ÷ 40.' },
      { type: 'qcm', title: 'Faisceau du Soleil', text: 'Les rayons du Soleil qui arrivent sur Terre forment un faisceau…', o: ['divergent', 'convergent', 'parallèle', 'circulaire'], a: 2, hint: 'Le Soleil est très, très loin.', e: 'Le Soleil est si loin que ses rayons arrivent pratiquement parallèles.' },
      { title: 'Pénombre interdite', text: 'Fais disparaître <span style="color:var(--amber)">complètement</span> la pénombre autour de l’ombre.', lumi: 'La pénombre vient de la taille de la source…', hint: 'Une source ponctuelle ne donne pas de pénombre.',
        build: function (api) { var lab = mini(api, { a: 6, r: 5, L1: 40, L2: 120 }); api.c.slider({ label: 'Taille de la source', min: 0, max: 15, step: 1, value: 12, unit: 'cm', onInput: function (v) { lab.st.a = v / 2; } }); return function () { return lab.st.a === 0 ? { ok: true, msg: 'Source ponctuelle : il ne reste que l’ombre.' } : { ok: false, msg: 'Il y a encore une pénombre.' }; }; },
        e: 'La pénombre n’existe qu’avec une source étendue.' },
      { type: 'qcm', title: 'Calcul éclair', text: 'Une balle de 8 cm est à 50 cm d’une lampe ponctuelle ; l’écran est à 150 cm de la lampe. L’ombre mesure :', o: ['8 cm', '16 cm', '24 cm', '150 cm'], a: 2, hint: 'L₂ ÷ L₁ = 150 ÷ 50.', e: 'Ombre = 8 × 150 ÷ 50 = 24 cm.' },
      { type: 'qcm', title: 'Preuve', text: 'Quelle expérience montre que la lumière se propage en ligne droite ?', o: ['Les cartons percés alignés', 'Faire bouillir de l’eau', 'Allumer une lampe', 'Mesurer une masse'], a: 0, hint: 'Repense au chapitre 1.', e: 'La lumière ne traverse les trois trous que s’ils sont alignés.' }
    ]
  };

  S.start({
    id: '4e-propagation-lumiere', level: '4e', theme: 'Optique', title: 'Propagation de la lumière', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Dans un milieu <b>homogène et transparent</b> (air, eau, verre), la lumière se propage en <b>ligne droite</b> : c’est la propagation rectiligne. Dans le vide et dans l’air, sa vitesse est d’environ <b>300 000 km/s</b>.',
      'On représente le trajet de la lumière par un <b>rayon lumineux</b> : une droite munie d’une flèche. Un ensemble de rayons forme un <b>faisceau</b> : divergent, parallèle ou convergent.',
      'Un objet opaque éclairé possède une <b>ombre propre</b> (sa partie non éclairée) et donne sur un écran une <b>ombre portée</b>.',
      'Avec une source ponctuelle : <b>diamètre de l’ombre ÷ diamètre de l’objet = distance source–écran ÷ distance source–objet</b>.',
      'Avec une source <b>étendue</b>, une zone ne reçoit qu’une partie de la lumière : c’est la <b>pénombre</b>. Ombre et pénombre expliquent les éclipses.'
    ],
    quiz: [
      { q: 'Dans l’air, la lumière se propage :', o: ['en ligne droite', 'en zigzag', 'en cercle', 'au hasard'], a: 0, e: 'Propagation rectiligne dans un milieu homogène et transparent.' },
      { q: 'Un faisceau dont les rayons s’écartent est :', o: ['parallèle', 'convergent', 'divergent', 'opaque'], a: 2, e: 'Il diverge.' },
      { q: 'La partie non éclairée d’une balle est :', o: ['l’ombre portée', 'l’ombre propre', 'la pénombre', 'un rayon'], a: 1, e: 'C’est son ombre propre.' },
      { q: 'Pour obtenir une pénombre, il faut :', o: ['une source ponctuelle', 'une source étendue', 'un objet transparent', 'aucune source'], a: 1, e: 'Seule une source étendue donne une pénombre.' },
      { q: 'On rapproche la balle de la lampe ponctuelle (écran fixe). L’ombre portée :', o: ['grandit', 'rétrécit', 'ne change pas', 'disparaît'], a: 0, e: 'L₂ ÷ L₁ augmente : l’ombre grandit.' }
    ]
  });
})();
