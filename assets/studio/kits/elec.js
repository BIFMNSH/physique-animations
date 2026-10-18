/* Kit électricité commun aux leçons de circuits (5e) : piles, lampes, fils animés, interrupteur, moteur, appareils de mesure. */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt;
  var GID = 0;
  function glow(G, col) { var id = 'ek' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.4, 'stop-color': col, 'stop-opacity': 0.35 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function v(U) { return fmt(U, U % 1 ? 1 : 0) + ' V'; }

  /* pile plate (ou générateur), horizontale : borne + à droite (ou à gauche si flip) */
  function battery(G, x, y, o) {
    o = o || {}; var w = o.w || 96, h = o.h || 46, g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    var body = s('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 7, fill: o.gen ? '#2A3346' : '#1F2B44', stroke: '#5B6680', 'stroke-width': 2 }, g);
    var band = s('rect', { x: -w / 2, y: -h / 2, width: w, height: 12, rx: 6, fill: o.col || '#FFB547' }, g);
    var lab = s('text', { x: 0, y: 12, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#EEF2F8' }, g);
    var pl = s('text', { 'font-size': 18, 'font-weight': 900, fill: '#FF8A80', 'text-anchor': 'middle' }, g), mi = s('text', { 'font-size': 20, 'font-weight': 900, fill: '#80B8FF', 'text-anchor': 'middle' }, g);
    var tp = s('rect', { y: -6, width: 10, height: 12, rx: 2, fill: '#C9D2E3' }, g), tm = s('rect', { y: -4, width: 8, height: 8, rx: 2, fill: '#C9D2E3' }, g);
    var cap = o.caption ? s('text', { x: 0, y: h / 2 + 18, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7', text: o.caption }, g) : null;
    function set(U, flip) {
      lab.textContent = v(U); var sp = flip ? -1 : 1;
      attr(pl, { x: sp * (w / 2 - 14), y: -h / 2 - 6, text: '+' }); attr(mi, { x: -sp * (w / 2 - 14), y: -h / 2 - 5, text: '−' });
      attr(tp, { x: sp > 0 ? w / 2 : -w / 2 - 10 }); attr(tm, { x: sp > 0 ? -w / 2 - 8 : w / 2 });
    }
    set(o.U || 4.5, o.flip);
    return { g: g, set: set, body: body, band: band, cap: cap, w: w, h: h };
  }

  /* lampe à incandescence vue de face : b = éclat (0 → 1 normal → >1 trop fort), broken = filament coupé */
  function lamp(G, x, y, o) {
    o = o || {}; var r = o.r || 22, g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    var halo = s('circle', { r: r * 4.2, fill: glow(G, '#FFD27A'), opacity: 0 }, g);
    var glass = s('circle', { r: r, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2.5 }, g);
    var fil = s('path', { d: 'M' + (-r * 0.45) + ' ' + (r * 0.5) + ' L' + (-r * 0.3) + ' ' + (-r * 0.15) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' L' + (r * 0.45) + ' ' + (r * 0.5), fill: 'none', stroke: '#8D96A8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    var brk = s('path', { d: 'M-4 -6 l3 4 M4 -6 l-3 4', stroke: '#FF5A4E', 'stroke-width': 2.5, opacity: 0 }, g);
    s('rect', { x: -r * 0.55, y: r * 0.85, width: r * 1.1, height: r * 0.7, rx: 3, fill: '#8D96A8' }, g);
    var lab = o.label ? s('text', { x: 0, y: -r - 10, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label }, g) : null;
    function set(b, broken) {
      b = Math.max(0, b || 0); var k = Math.min(1, b);
      halo.setAttribute('opacity', broken ? 0 : Math.min(1, b * 0.9)); halo.setAttribute('r', r * (2.4 + 2.4 * Math.min(1.6, b)));
      glass.setAttribute('fill', broken ? '#3A2F2F' : b > 0.05 ? 'rgb(' + Math.round(42 + 213 * k) + ',' + Math.round(51 + 190 * k) + ',' + Math.round(70 + 110 * k * (b > 1.2 ? 1.3 : 1)) + ')' : '#2A3346');
      fil.setAttribute('stroke', broken ? '#5B6680' : b > 0.05 ? (b > 1.2 ? '#FFFFFF' : '#FFF2B0') : '#8D96A8'); fil.setAttribute('stroke-dasharray', broken ? '14 6 40' : 'none');
      brk.setAttribute('opacity', broken ? 1 : 0);
    }
    set(0);
    return { g: g, set: set, lab: lab, r: r };
  }

  /* moteur avec hélice */
  function motor(G, x, y, o) {
    o = o || {}; var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), ang = 0, dn = o.down ? -1 : 1;
    s('circle', { r: 24, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2.5 }, g);
    s('text', { y: 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#EEF2F8', text: 'M' }, g);
    var hel = s('g', {}, g); s('line', { x1: 0, y1: -24 * dn, x2: 0, y2: -40 * dn, stroke: '#7D89A3', 'stroke-width': 3 }, g);
    var prop = s('g', { transform: 'translate(0 ' + (-44 * dn) + ')' }, g);
    [0, 120, 240].forEach(function (a) { s('path', { d: 'M0 0 q8 -22 0 -36 q-8 14 0 36z', fill: '#4FC3FF', transform: 'rotate(' + a + ')' }, prop); });
    s('circle', { cy: 0, r: 4, fill: '#EEF2F8' }, prop);
    var last = performance.now();
    function set(speed, T) { var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; ang = T != null ? T * speed * 900 : ang + dt * speed * 900; prop.setAttribute('transform', 'translate(0 ' + (-44 * dn) + ') rotate(' + (ang % 360) + ')'); prop.setAttribute('opacity', speed > 1.5 ? 0.6 : 1); }
    return { g: g, set: set };
  }

  /* fil (chemin SVG) + surcouche animée du courant */
  function wire(G, d, o) {
    o = o || {}; var base = s('path', { d: d, fill: 'none', stroke: o.col || '#C9D2E3', 'stroke-width': o.w || 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, G);
    var fl = s('path', { d: d, fill: 'none', stroke: '#FFE29A', 'stroke-width': (o.w || 3.5) - 0.5, 'stroke-dasharray': '3 15', 'stroke-linecap': 'round', opacity: 0 }, G);
    return { base: base, fl: fl, flow: function (I, T) { fl.setAttribute('opacity', I > 0.01 ? Math.min(1, 0.4 + I) : 0); fl.setAttribute('stroke-dashoffset', -(T * 60 * Math.min(2, 0.4 + I))); }, set: function (dd) { base.setAttribute('d', dd); fl.setAttribute('d', dd); } };
  }

  /* interrupteur entre (x1,y) et (x2,y) */
  function switchK(G, x1, y, x2, o) {
    o = o || {}; var g = s('g', { style: 'cursor:pointer' }, G), closed = !!o.closed;
    s('circle', { cx: x1, cy: y, r: 5, fill: '#EEF2F8' }, g); s('circle', { cx: x2, cy: y, r: 5, fill: '#EEF2F8' }, g);
    var lev = s('line', { x1: x1, y1: y, stroke: '#EEF2F8', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    s('rect', { x: x1 - 10, y: y - 44, width: x2 - x1 + 20, height: 60, fill: 'transparent' }, g);
    var lab = s('text', { x: (x1 + x2) / 2, y: y + 26, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label || 'K' }, g);
    function set(c) { closed = c; var L = x2 - x1, a = c ? 0 : -32 * Math.PI / 180; attr(lev, { x2: x1 + L * Math.cos(a), y2: y + L * Math.sin(a) }); }
    g.addEventListener('click', function () { set(!closed); o.onToggle && o.onToggle(closed); });
    set(closed);
    return { g: g, set: set, get closed() { return closed; } };
  }

  /* appareil de mesure (A ou V) : cercle + afficheur numérique */
  function meter(G, x, y, kind, o) {
    o = o || {}; var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), col = kind === 'A' ? '#FFB547' : '#4FC3FF';
    s('circle', { r: 20, fill: '#0F1729', stroke: col, 'stroke-width': 3 }, g);
    s('text', { y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: col, text: kind }, g);
    var dy = o.right ? -14 : o.below ? 32 : -58, dx = o.right ? 72 : 0, box = s('rect', { x: dx - 44, y: dy, width: 88, height: 28, rx: 7, fill: '#071016', stroke: col, 'stroke-width': 1.5 }, g);
    var t = s('text', { x: dx, y: dy + 20, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#9BF0C5', 'font-family': 'ui-monospace,Menlo,monospace' }, g);
    return { g: g, set: function (txt) { t.textContent = txt; }, show: function (b) { g.style.display = b ? '' : 'none'; } };
  }
  function dot(G, x, y) { return s('circle', { cx: x, cy: y, r: 5, fill: '#EEF2F8' }, G); }

  /* état d’une lampe selon la tension reçue U et sa tension nominale Un */
  function lampState(U, Un) {
    var r = Un ? U / Un : 0;
    if (r < 0.25) return { r: r, b: 0, k: 'off', t: 'ne brille pas' };
    if (r < 0.8) return { r: r, b: Math.pow(r, 1.6), k: 'low', t: 'brille faiblement : sous-tension' };
    if (r <= 1.2) return { r: r, b: Math.pow(r, 1.6), k: 'ok', t: 'brille normalement' };
    if (r <= 1.5) return { r: r, b: Math.pow(r, 1.6), k: 'high', t: 'brille trop fort : surtension' };
    return { r: r, b: 2, k: 'burn', t: 'grille : forte surtension' };
  }
  window.ElecKit = { glow: glow, battery: battery, lamp: lamp, motor: motor, wire: wire, switchK: switchK, meter: meter, dot: dot, lampState: lampState, v: v };
})();
