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

  /* module lampe sur socle (comme au laboratoire) : le verre est isolant, il ne reçoit aucun fil.
     Les deux contacts sont les douilles du socle, en (−r, 0) et (+r, 0) : c'est là que chaque fil doit arriver.
     Le symbole normalisé de la lampe est imprimé sur le socle. b = éclat (0 → 1 normal → >1 trop fort), broken = filament coupé */
  function lamp(G, x, y, o) {
    o = o || {}; var r = o.r || 22, rg = r * 0.86, by = -r * 1.5, g = s('g', { transform: 'translate(' + x + ' ' + y + ')', role: 'img', 'aria-label': 'Lampe sur socle : deux douilles, le verre est isolant' }, G);
    var halo = s('circle', { cy: by, r: r * 4.2, fill: glow(G, '#FFD27A'), opacity: 0 }, g);
    /* socle (plaque isolante) et symbole imprimé */
    s('rect', { x: -r - 13, y: -r * 0.6, width: 2 * r + 26, height: r * 1.2, rx: 5, fill: '#E9EEF6', stroke: '#9FB0C4', 'stroke-width': 2 }, g);
    s('path', { d: 'M' + (-r) + ' 0 H' + (-r * 0.42) + ' M' + (r * 0.42) + ' 0 H' + r, stroke: '#3A4660', 'stroke-width': 1.6, fill: 'none' }, g);
    s('circle', { r: r * 0.42, fill: '#fff', stroke: '#3A4660', 'stroke-width': 1.8 }, g);
    s('path', { d: 'M' + (-r * 0.3) + ' ' + (-r * 0.3) + ' L' + (r * 0.3) + ' ' + (r * 0.3) + ' M' + (r * 0.3) + ' ' + (-r * 0.3) + ' L' + (-r * 0.3) + ' ' + (r * 0.3), stroke: '#3A4660', 'stroke-width': 1.8 }, g);
    /* douilles (contacts) */
    [-r, r].forEach(function (dx) { s('circle', { cx: dx, cy: 0, r: 6.5, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, g); s('circle', { cx: dx, cy: 0, r: 2.6, fill: '#2A2F38' }, g); });
    /* culot et ampoule posés sur le socle */
    s('rect', { x: -r * 0.36, y: -r * 0.6 - r * 0.5, width: r * 0.8, height: r * 0.5, rx: 3, fill: '#8D96A8', stroke: '#6B7480', 'stroke-width': 1.2 }, g);
    var glass = s('circle', { cy: by, r: rg, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2.5 }, g);
    var f = rg / r, fg = s('g', { transform: 'translate(0 ' + by + ') scale(' + f + ')' }, g);
    var fil = s('path', { d: 'M' + (-r * 0.45) + ' ' + (r * 0.5) + ' L' + (-r * 0.3) + ' ' + (-r * 0.15) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' L' + (r * 0.45) + ' ' + (r * 0.5), fill: 'none', stroke: '#8D96A8', 'stroke-width': 2 / f, 'stroke-linejoin': 'round' }, fg);
    var brk = s('path', { d: 'M-4 -6 l3 4 M4 -6 l-3 4', stroke: '#FF5A4E', 'stroke-width': 2.5, opacity: 0, transform: 'translate(0 ' + by + ')' }, g);
    var lab = o.label ? s('text', { x: 0, y: by - rg - 8, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label }, g) : null;
    function set(b, broken) {
      b = Math.max(0, b || 0); var k = Math.min(1, b);
      halo.setAttribute('opacity', broken ? 0 : Math.min(1, b * 0.9)); halo.setAttribute('r', r * (2.4 + 2.4 * Math.min(1.6, b)));
      glass.setAttribute('fill', broken ? '#3A2F2F' : b > 0.05 ? 'rgb(' + Math.round(42 + 213 * k) + ',' + Math.round(51 + 190 * k) + ',' + Math.round(70 + 110 * k * (b > 1.2 ? 1.3 : 1)) + ')' : '#2A3346');
      fil.setAttribute('stroke', broken ? '#5B6680' : b > 0.05 ? (b > 1.2 ? '#FFFFFF' : '#FFF2B0') : '#8D96A8'); fil.setAttribute('stroke-dasharray', broken ? '14 6 40' : 'none');
      brk.setAttribute('opacity', broken ? 1 : 0);
    }
    set(0);
    return { g: g, set: set, lab: lab, r: r, contacts: [[x - r, y], [x + r, y]] };
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

  /* multimètre : afficheur, sélecteur rotatif cliquable, 4 bornes (10A, mA, COM, V) */
  var CALS = [
    { k: 'OFF', l: 'OFF', ty: null },
    { k: 'A10', l: '10 A', ty: 'A', max: 10, dec: 2, u: 'A' },
    { k: 'mA200', l: '200 mA', ty: 'A', max: 0.2, dec: 1, u: 'mA', mul: 1000 },
    { k: 'mA20', l: '20 mA', ty: 'A', max: 0.02, dec: 2, u: 'mA', mul: 1000 },
    { k: 'V20', l: '20 V', ty: 'V', max: 20, dec: 2, u: 'V' },
    { k: 'V2', l: '2 V', ty: 'V', max: 2, dec: 3, u: 'V' }
  ];
  function multimeter(G, x, y, o) {
    o = o || {}; var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), cal = o.cal || 'OFF';
    s('rect', { x: -100, y: 0, width: 200, height: 380, rx: 26, fill: '#F2C94C' }, g);
    s('rect', { x: -88, y: 12, width: 176, height: 356, rx: 18, fill: '#22262E' }, g);
    s('rect', { x: -74, y: 28, width: 148, height: 64, rx: 8, fill: '#A9C29A' }, g);
    var lcd = s('text', { x: 64, y: 76, 'text-anchor': 'end', 'font-size': 34, 'font-weight': 700, fill: '#1B2418', 'font-family': 'ui-monospace,Menlo,monospace' }, g);
    var unit = s('text', { x: -66, y: 44, 'font-size': 11, 'font-weight': 800, fill: '#1B2418' }, g);
    var cx = 0, cy = 190, R = 58;
    s('circle', { cx: cx, cy: cy, r: R + 30, fill: '#2C313B' }, g);
    var labs = [], N = CALS.length;
    CALS.forEach(function (c, i) {
      var a = (-150 + i * (300 / (N - 1))) * Math.PI / 180, lx = cx + (R + 18) * Math.sin(a), ly = cy - (R + 18) * Math.cos(a);
      var t = s('text', { x: lx, y: ly + 4, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 800, fill: c.ty === 'A' ? '#FFB547' : c.ty === 'V' ? '#4FC3FF' : '#C9D2E3', text: c.l, style: 'cursor:pointer' }, g);
      t.addEventListener('click', function () { set(c.k); o.onDial && o.onDial(c.k); }); labs.push(t); c.a = a;
    });
    var knob = s('g', { style: 'cursor:pointer' }, g); s('circle', { cx: cx, cy: cy, r: R - 14, fill: '#3A404C', stroke: '#11141A', 'stroke-width': 3 }, knob);
    var ptr = s('rect', { x: cx - 5, y: cy - R + 16, width: 10, height: 30, rx: 4, fill: '#EEF2F8' }, knob);
    knob.addEventListener('click', function () { var i = CALS.map(function (c) { return c.k; }).indexOf(cal); set(CALS[(i + 1) % N].k); o.onDial && o.onDial(cal); });
    var sock = {}; [['10A', -66, '#FF5A4E'], ['mA', -22, '#FF5A4E'], ['COM', 22, '#11141A'], ['V', 66, '#FF5A4E']].forEach(function (b) {
      s('circle', { cx: b[1], cy: 330, r: 13, fill: '#11141A', stroke: b[2] === '#11141A' ? '#7D89A3' : b[2], 'stroke-width': 3 }, g);
      s('text', { x: b[1], y: 308, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 800, fill: '#C9D2E3', text: b[0] }, g);
      sock[b[0]] = { x: x + b[1], y: y + 330 };
    });
    function set(k) { cal = k; var c = CALS.filter(function (z) { return z.k === k; })[0]; knob.setAttribute('transform', 'rotate(' + (c.a * 180 / Math.PI) + ' ' + cx + ' ' + cy + ')'); labs.forEach(function (t, i) { t.setAttribute('text-decoration', CALS[i].k === k ? 'underline' : 'none'); }); }
    function show(val, ty) {
      var c = CALS.filter(function (z) { return z.k === cal; })[0];
      if (!c.ty) { lcd.textContent = ''; unit.textContent = ''; return { st: 'off' }; }
      unit.textContent = c.u;
      if (ty && ty !== c.ty) { lcd.textContent = '0' + (c.dec ? '.' + '0'.repeat(c.dec) : ''); return { st: 'wrongmode', c: c }; }
      if (Math.abs(val) > c.max) { lcd.textContent = '1    '; lcd.setAttribute('text-anchor', 'end'); return { st: 'over', c: c }; }
      var v = val * (c.mul || 1); lcd.textContent = (v < 0 ? '-' : '') + Math.abs(v).toFixed(c.dec); return { st: 'ok', c: c, txt: (v < 0 ? '−' : '') + Math.abs(v).toFixed(c.dec).replace('.', ',') + ' ' + c.u };
    }
    set(cal);
    return { g: g, set: set, show: show, sock: sock, get cal() { return cal; } };
  }
  /* cordon de mesure entre deux points (courbe) */
  function lead(G, col) { var p = s('path', { fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.95 }, G), e = s('circle', { r: 6, fill: col }, G); return { set: function (a, b) { var my = Math.max(a.y, b.y) + 60; p.setAttribute('d', 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + my + ' ' + b.x + ' ' + my + ' ' + b.x + ' ' + b.y); attr(e, { cx: b.x, cy: b.y }); }, show: function (v) { p.style.display = e.style.display = v ? '' : 'none'; } }; }
  window.ElecKit = { glow: glow, battery: battery, lamp: lamp, motor: motor, wire: wire, switchK: switchK, meter: meter, dot: dot, lampState: lampState, v: v, multimeter: multimeter, lead: lead, CALS: CALS };
})();
