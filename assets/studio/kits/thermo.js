/* Kit « dilatation » (5e) : thermomètre, bec Bunsen, loupe sur les particules (solide, liquide, gaz) */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt;
  var GID = 0;
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function glow(G, col) { var id = 'th' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); k = Math.max(0, Math.min(1, k)); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }
  /* couleur d’un métal chauffé (rougeoie au-delà de ~500 °C) */
  function hotMetal(base, T) { return T < 450 ? base : mixc(base.length === 7 ? base : '#9AA6BC', '#FF5A2E', Math.min(1, (T - 450) / 400)); }
  /* thermomètre vertical */
  function thermometer(G, x, y, h, min, max) {
    var g = s('g', {}, G); s('rect', { x: x - 9, y: y, width: 18, height: h, rx: 9, fill: '#EEF2F8', stroke: '#C9D2E3', 'stroke-width': 2 }, g); s('circle', { cx: x, cy: y + h + 10, r: 15, fill: '#E5484D', stroke: '#C9D2E3', 'stroke-width': 2 }, g);
    var col = s('rect', { x: x - 4, width: 8, rx: 4, fill: '#E5484D' }, g);
    var ticks = 5; for (var i = 0; i <= ticks; i++) { var yy = y + h - 8 - (h - 16) * i / ticks, v = min + (max - min) * i / ticks; s('line', { x1: x + 10, x2: x + 18, y1: yy, y2: yy, stroke: '#7D89A3', 'stroke-width': 1.5 }, g); s('text', { x: x + 22, y: yy + 4, 'font-size': 10, fill: '#A9B4C7', text: Math.round(v) }, g); }
    var lab = s('text', { x: x, y: y - 10, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, g);
    return { g: g, set: function (T) { var k = Math.max(0, Math.min(1, (T - min) / (max - min))), top = y + h - 8 - (h - 16) * k; attr(col, { y: top, height: y + h + 4 - top }); lab.textContent = Math.round(T) + ' °C'; } };
  }
  function burner(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    s('rect', { x: -9, y: -50, width: 18, height: 50, rx: 3, fill: '#9AA6BC' }, g); s('rect', { x: -28, y: -6, width: 56, height: 12, rx: 4, fill: '#5B6680' }, g);
    var f = s('g', {}, g); s('path', { d: 'M0 -52 q18 -24 0 -62 q-18 38 0 62z', fill: '#4FC3FF', opacity: 0.9 }, f); s('path', { d: 'M0 -54 q8 -12 0 -32 q-8 20 0 32z', fill: '#E8F4FF' }, f);
    return { g: g, set: function (k, T) { f.style.display = k > 0.02 ? '' : 'none'; f.setAttribute('transform', 'scale(' + (0.5 + 0.5 * k) * (1 + 0.04 * Math.sin((T || 0) * 20)) + ')'); } };
  }
  /* loupe sur les particules : kind = 'solide' | 'liquide' | 'gaz' ; k = agitation (0 froid → 1 chaud) */
  function particles(G, x, y, w, h, kind, col) {
    var g = s('g', {}, G), cp = 'tp' + (GID++), cl = s('clipPath', { id: cp }, s('defs', {}, G)); s('rect', { x: x, y: y, width: w, height: h, rx: 14 }, cl);
    s('rect', { x: x, y: y, width: w, height: h, rx: 14, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, g);
    var inner = s('g', { 'clip-path': 'url(#' + cp + ')' }, g), P = [], n = kind === 'gaz' ? 18 : 40;
    for (var i = 0; i < n; i++) P.push(s('circle', { r: kind === 'gaz' ? 7 : 8, fill: col || '#9FD7FF', stroke: '#0006', 'stroke-width': 1 }, inner));
    var frame = s('rect', { fill: 'none', stroke: '#FFC773', 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0.6 }, inner);
    var cap = s('text', { x: x + w / 2, y: y + h - 8, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7' }, g);
    return { g: g, set: function (k, T, scale) {
      scale = scale || 1; var cx = x + w / 2, cy = y + h / 2 - 6;
      if (kind === 'solide') { var cols = 8, rows = 5, sp = 17 * scale, a = 1.2 + 4 * k; P.forEach(function (p, i) { if (i >= cols * rows) { p.style.display = 'none'; return; } var c = i % cols, r = Math.floor(i / cols); attr(p, { cx: cx + (c - (cols - 1) / 2) * sp + Math.sin(T * 9 + i * 1.7) * a, cy: cy + (r - (rows - 1) / 2) * sp + Math.cos(T * 8 + i * 2.3) * a }); }); attr(frame, { x: cx - cols / 2 * sp, y: cy - rows / 2 * sp, width: cols * sp, height: rows * sp }); }
      else if (kind === 'liquide') { var R = 1 + 0.12 * k * scale; P.forEach(function (p, i) { var bx = (rnd(i, 1) - 0.5) * (w - 40) * 0.9 * R, by = (rnd(i, 2) - 0.2) * (h - 50) * 0.75 * R; attr(p, { cx: cx + bx + Math.sin(T * (1.2 + 2 * k) + i) * (5 + 8 * k), cy: cy + by * 0.7 + 10 + Math.cos(T * (1 + 2 * k) + i * 1.3) * (4 + 6 * k) }); }); attr(frame, { x: cx - (w - 40) * 0.47 * R, y: cy - 34 * R, width: (w - 40) * 0.94 * R, height: 90 * R }); }
      else { var sp2 = 0.4 + 1.2 * k; P.forEach(function (p, i) { var u = (rnd(i, 3) + T * sp2 * (0.05 + rnd(i, 4) * 0.08)) % 2, v = (rnd(i, 5) + T * sp2 * (0.04 + rnd(i, 6) * 0.07)) % 2; u = u > 1 ? 2 - u : u; v = v > 1 ? 2 - v : v; var ww = (w - 30) * (0.6 + 0.4 * scale), hh = (h - 40) * (0.6 + 0.4 * scale); attr(p, { cx: cx - ww / 2 + u * ww, cy: cy - hh / 2 + v * hh }); }); attr(frame, { x: cx - (w - 30) * (0.6 + 0.4 * scale) / 2 - 8, y: cy - (h - 40) * (0.6 + 0.4 * scale) / 2 - 8, width: (w - 30) * (0.6 + 0.4 * scale) + 16, height: (h - 40) * (0.6 + 0.4 * scale) + 16 }); }
      cap.textContent = k < 0.3 ? 'particules peu agitées' : k < 0.7 ? 'particules plus agitées, plus espacées' : 'particules très agitées, très espacées';
    } };
  }
  window.ThermoKit = { rnd: rnd, glow: glow, mixc: mixc, hotMetal: hotMetal, thermometer: thermometer, burner: burner, particles: particles };
})();
