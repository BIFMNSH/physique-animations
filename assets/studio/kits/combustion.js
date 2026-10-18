/* Kit chimie des combustions (5e) : flacon, têt à combustion, bec Bunsen, tube à essais, visionneuse moléculaire (couleurs CPK). */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt;
  var GID = 0;
  var CPK = { H: ['#FFFFFF', '#B9C2CF', 13], C: ['#3A3A3A', '#0E0E0E', 20], N: ['#4C6BFF', '#1E2FA8', 19], O: ['#F0454B', '#9E1A1F', 18], S: ['#FFD84A', '#B38C00', 24], Ca: ['#7FD39B', '#2E8A55', 22] };
  function glow(G, col, op) { var id = 'cb' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': op == null ? 0.95 : op }, gr); s('stop', { offset: 0.45, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function grads(G) { var d = s('defs', {}, G), o = {}; Object.keys(CPK).forEach(function (e) { var id = 'cp' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, d); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': e === 'H' ? 1 : 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': CPK[e][0] }, gr); s('stop', { offset: 1, 'stop-color': CPK[e][1] }, gr); o[e] = 'url(#' + id + ')'; }); return o; }
  function rich(t, str, fs) { while (t.firstChild) t.removeChild(t.firstChild); var re = /_\{([^}]*)\}/g, i = 0, m, off = 0; function put(x, d, sm) { if (!x) return; var a = { text: x }; if (d !== off) a.dy = d - off; if (sm) a['font-size'] = fs * 0.62; s('tspan', a, t); off = d; } while ((m = re.exec(str))) { put(str.slice(i, m.index), 0); put(m[1], fs * 0.25, true); i = re.lastIndex; } put(str.slice(i), 0); if (off) put('​', 0); }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }

  /* flacon (bocal) à large col : contenu gazeux teinté, liquide au fond éventuel */
  function flask(G, x, y, o) {
    o = o || {}; var w = o.w || 150, h = o.h || 220, g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    var path = 'M' + (-w / 2 + 26) + ' 0 V18 Q' + (-w / 2) + ' 34 ' + (-w / 2) + ' 70 V' + (h - 14) + ' q0 14 14 14 H' + (w / 2 - 14) + ' q14 0 14 -14 V70 Q' + (w / 2) + ' 34 ' + (w / 2 - 26) + ' 18 V0';
    var gas = s('path', { d: path + 'Z', fill: '#9FD7FF', opacity: 0.08 }, g);
    var cp = 'fk' + (GID++), cl = s('clipPath', { id: cp }, s('defs', {}, G)); s('path', { d: path + 'Z' }, cl);
    var inner = s('g', { 'clip-path': 'url(#' + cp + ')' }, g), liq = s('rect', { x: -w / 2, width: w, fill: '#DDEFFF', opacity: 0 }, inner), fume = s('g', {}, inner), F = [];
    for (var i = 0; i < 16; i++) F.push(s('circle', { r: 10 + rnd(i, 1) * 14, fill: '#E6E9EF', opacity: 0 }, fume));
    s('path', { d: path, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3, opacity: 0.9 }, g);
    var lab = s('text', { x: 0, y: h + 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, g);
    return { g: g, w: w, h: h, x: x, y: y, inner: inner,
      set: function (op) { op = op || {}; gas.setAttribute('fill', op.gas || '#9FD7FF'); gas.setAttribute('opacity', op.gasOp == null ? 0.08 : op.gasOp); lab.textContent = op.label || '';
        var lh = op.liq || 0; attr(liq, { y: h - lh, height: lh, fill: op.liqCol || '#DDEFFF', opacity: lh ? (op.liqOp || 0.7) : 0 });
        var fm = op.fume || 0, T = op.T || 0; F.forEach(function (c, k) { var ph = (rnd(k, 2) + T * 0.05) % 1; attr(c, { cx: -w / 2 + 20 + rnd(k, 3) * (w - 40) + Math.sin(T + k) * 6, cy: 40 + ph * (h - 60), opacity: fm * 0.35, fill: op.fumeCol || '#E6E9EF' }); }); } };
  }
  /* têt à combustion : tige + coupelle ; draw(g) dessine le contenu de la coupelle */
  function spoon(G) {
    var g = s('g', {}, G); s('line', { x1: 0, y1: -170, x2: 0, y2: 0, stroke: '#9AA6BC', 'stroke-width': 4 }, g); s('rect', { x: -26, y: -150, width: 52, height: 8, rx: 3, fill: '#5B6680' }, g);
    s('path', { d: 'M-18 -2 Q0 16 18 -2 Z', fill: '#7D89A3', stroke: '#C9D2E3', 'stroke-width': 2 }, g);
    var cont = s('g', {}, g);
    return { g: g, cont: cont, at: function (x, y) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); } };
  }
  function burner(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    s('rect', { x: -9, y: -60, width: 18, height: 60, rx: 3, fill: '#9AA6BC' }, g); s('rect', { x: -30, y: -6, width: 60, height: 12, rx: 4, fill: '#5B6680' }, g);
    var f = s('g', {}, g); s('path', { d: 'M0 -62 q20 -26 0 -70 q-20 44 0 70z', fill: '#4FC3FF', opacity: 0.9 }, f); s('path', { d: 'M0 -64 q9 -14 0 -36 q-9 22 0 36z', fill: '#E8F4FF' }, f);
    return { g: g, set: function (on, T) { f.style.display = on ? '' : 'none'; if (on) f.setAttribute('transform', 'scale(' + (1 + 0.04 * Math.sin((T || 0) * 20)) + ' 1)'); } };
  }
  /* tube à essais avec liquide (couleur) et précipité laiteux */
  function tube(G, x, y, o) {
    o = o || {}; var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), w = o.w || 36, h = o.h || 130;
    var liq = s('path', {}, g), milk = s('path', { fill: '#F4F6FA' }, g);
    s('path', { d: 'M' + (-w / 2) + ' 0 V' + (h - w / 2) + ' a' + (w / 2) + ' ' + (w / 2) + ' 0 0 0 ' + w + ' 0 V0', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 2.5 }, g);
    var lab = s('text', { x: 0, y: h + 22, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#A9B4C7' }, g);
    return { g: g, set: function (col, lvl, milkK, label, op) { var yl = h - (h - 10) * lvl, d = 'M' + (-w / 2 + 2) + ' ' + yl + ' V' + (h - w / 2) + ' a' + (w / 2 - 2) + ' ' + (w / 2 - 2) + ' 0 0 0 ' + (w - 4) + ' 0 V' + yl + 'Z'; liq.setAttribute('d', d); liq.setAttribute('fill', col); liq.setAttribute('opacity', op || 0.7); milk.setAttribute('d', d); milk.setAttribute('opacity', (milkK || 0) * 0.85); lab.textContent = label || ''; } };
  }
  /* visionneuse moléculaire : atomes qui passent d’une position « réactifs » à une position « produits » */
  function molView(G, x, y, w, h, GR) {
    var g = s('g', {}, G); s('rect', { x: x, y: y, width: w, height: h, rx: 16, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, g);
    s('text', { x: x + 16, y: y + 22, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES MOLÉCULES' }, g);
    var at = s('g', {}, g), eq = s('text', { x: x + w / 2, y: y + h - 14, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#FFC773' }, g), arrow = s('text', { x: x + w / 2, y: y + h / 2 + 6, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#7D89A3' }, g);
    var P = [], key = '';
    return { g: g, set: function (atoms, p, eqStr) {
      var k = atoms.map(function (a) { return a.e; }).join();
      if (k !== key) { key = k; while (at.firstChild) at.removeChild(at.firstChild); P = atoms.map(function (a) { var c = s('g', {}, at); s('circle', { r: CPK[a.e][2], fill: GR[a.e], stroke: '#0006', 'stroke-width': 1 }, c); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: a.e === 'H' || a.e === 'S' ? '#1A1F28' : '#FFF', text: a.e }, c); return c; }); }
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      atoms.forEach(function (a, i) { var X = x + w / 2 + a.a[0] + (a.b[0] - a.a[0]) * e, Y = y + h / 2 + a.a[1] + (a.b[1] - a.a[1]) * e; P[i].setAttribute('transform', 'translate(' + X.toFixed(1) + ' ' + Y.toFixed(1) + ')'); });
      rich(eq, eqStr || '', 17); arrow.textContent = '';
    } };
  }
  window.CombKit = { glow: glow, grads: grads, rich: rich, rnd: rnd, flask: flask, spoon: spoon, burner: burner, tube: tube, molView: molView, CPK: CPK };
})();
