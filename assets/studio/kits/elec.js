/* Kit électricité commun aux leçons de circuits (5e) : piles, lampes, fils animés, interrupteur, moteur, appareils de mesure. */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt;
  var GID = 0;
  function glow(G, col) { var id = 'ek' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.4, 'stop-color': col, 'stop-opacity': 0.35 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function v(U) { return fmt(U, U % 1 ? 1 : 0) + ' V'; }

  /* pile plate (ou générateur), horizontale : borne + à droite (ou à gauche si flip) */
  function battery(G, x, y, o) {
    o = o || {}; var w = o.w || 96, h = o.h || 46, g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    s('ellipse', { cx: 0, cy: h / 2 + 4, rx: w / 2 + 8, ry: 7, fill: '#05080F', opacity: 0.4 }, g);
    var body = s('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 7, fill: o.gen ? '#2A3346' : '#1F2B44', stroke: '#5B6680', 'stroke-width': 2 }, g);
    s('rect', { x: -w / 2 + 5, y: h / 2 - 9, width: w - 10, height: 3, rx: 1.5, fill: '#FFFFFF', opacity: 0.12 }, g);
    var band = s('rect', { x: -w / 2, y: -h / 2, width: w, height: 12, rx: 6, fill: o.col || '#FFB547' }, g);
    var lab = s('text', { x: 0, y: 12, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#EEF2F8' }, g);
    var pl = s('text', { 'font-size': 18, 'font-weight': 900, fill: '#FF8A80', 'text-anchor': 'middle' }, g), mi = s('text', { 'font-size': 20, 'font-weight': 900, fill: '#80B8FF', 'text-anchor': 'middle' }, g);
    var tp = s('rect', { y: -6, width: 10, height: 12, rx: 2, fill: '#D9B44A', stroke: '#8A6D12', 'stroke-width': 1 }, g), tm = s('rect', { y: -4, width: 8, height: 8, rx: 2, fill: '#D9B44A', stroke: '#8A6D12', 'stroke-width': 1 }, g);
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
    s('rect', { x: -r * 0.3, y: -r * 0.66, width: r * 0.6, height: r * 0.12, rx: 2, fill: '#2A2F38' }, g); /* douille vide, visible quand l'ampoule est dévissée */
    var bulb = s('g', {}, g);
    s('rect', { x: -r * 0.4, y: -r * 0.6 - r * 0.5, width: r * 0.8, height: r * 0.5, rx: 3, fill: '#8D96A8', stroke: '#6B7480', 'stroke-width': 1.2 }, bulb);
    var glass = s('circle', { cy: by, r: rg, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2.5 }, bulb);
    var f = rg / r, fg = s('g', { transform: 'translate(0 ' + by + ') scale(' + f + ')' }, bulb);
    var fil = s('path', { d: 'M' + (-r * 0.45) + ' ' + (r * 0.5) + ' L' + (-r * 0.3) + ' ' + (-r * 0.15) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' l' + (r * 0.15) + ' ' + (-r * 0.2) + ' l' + (r * 0.15) + ' ' + (r * 0.2) + ' L' + (r * 0.45) + ' ' + (r * 0.5), fill: 'none', stroke: '#8D96A8', 'stroke-width': 2 / f, 'stroke-linejoin': 'round' }, fg);
    var brk = s('path', { d: 'M-4 -6 l3 4 M4 -6 l-3 4', stroke: '#FF5A4E', 'stroke-width': 2.5, opacity: 0, transform: 'translate(0 ' + by + ')' }, bulb);
    var lab = o.label ? s('text', { x: 0, y: by - rg - 8, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label }, g) : null;
    function set(b, broken) {
      b = Math.max(0, b || 0); var k = Math.min(1, b);
      halo.setAttribute('opacity', broken ? 0 : Math.min(1, b * 0.9)); halo.setAttribute('r', r * (2.4 + 2.4 * Math.min(1.6, b)));
      glass.setAttribute('fill', broken ? '#3A2F2F' : b > 0.05 ? 'rgb(' + Math.round(42 + 213 * k) + ',' + Math.round(51 + 190 * k) + ',' + Math.round(70 + 110 * k * (b > 1.2 ? 1.3 : 1)) + ')' : '#2A3346');
      fil.setAttribute('stroke', broken ? '#5B6680' : b > 0.05 ? (b > 1.2 ? '#FFFFFF' : '#FFF2B0') : '#8D96A8'); fil.setAttribute('stroke-dasharray', broken ? '14 6 40' : 'none');
      brk.setAttribute('opacity', broken ? 1 : 0);
    }
    set(0);
    function unscrew(on) { bulb.style.display = on ? 'none' : ''; halo.style.display = on ? 'none' : ''; }
    return { g: g, set: set, lab: lab, r: r, unscrew: unscrew, contacts: [[x - r, y], [x + r, y]] };
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

  /* câble de laboratoire : gaine colorée, fiches aux extrémités, coins arrondis ; le chemin reste décrit en M/H/V/L (Z pour une boucle).
     Une surcouche animée montre le courant. o.col : couleur ; o.plugs === false : sans fiches. */
  var WIRE_COLS = ['#D9423B', '#2B2F38'], WIRE_N = 0;
  function parsePath(d) {
    var tk = String(d).match(/[MHVLZ]|-?\d*\.?\d+/g) || [], i = 0, subs = [], cur = null, x = 0, y = 0, cmd = '';
    while (i < tk.length) {
      var t = tk[i];
      if (/[MHVLZ]/.test(t)) { cmd = t; i++; if (cmd === 'Z') { if (cur) cur.closed = true; continue; } }
      else if (cmd === 'M') cmd = 'L';
      if (cmd === 'M' || cmd === 'L') { x = +tk[i]; y = +tk[i + 1]; i += 2; } else if (cmd === 'H') { x = +tk[i]; i++; } else if (cmd === 'V') { y = +tk[i]; i++; } else { i++; continue; }
      if (cmd === 'M' || !cur) { cur = { pts: [], closed: false }; subs.push(cur); }
      cur.pts.push([x, y]);
    }
    return subs.filter(function (u) { return u.pts.length > 1; });
  }
  function roundPath(subs, R) {
    return subs.map(function (u) {
      var P = u.pts, n = P.length, out = '', i;
      function at(a, b, dist) { var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [a[0] + dx / L * dist, a[1] + dy / L * dist]; }
      function seg(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
      function corner(i) { var p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], r = Math.min(R, seg(p0, p1) / 2, seg(p1, p2) / 2), A = at(p1, p0, r), B = at(p1, p2, r); return { A: A, B: B, p: p1 }; }
      if (u.closed) { var c0 = corner(0); out = 'M' + c0.B[0] + ' ' + c0.B[1]; for (i = 1; i <= n; i++) { var c = corner(i % n); out += ' L' + c.A[0] + ' ' + c.A[1] + ' Q' + c.p[0] + ' ' + c.p[1] + ' ' + c.B[0] + ' ' + c.B[1]; } return out + ' Z'; }
      out = 'M' + P[0][0] + ' ' + P[0][1];
      for (i = 1; i < n - 1; i++) { var k = corner(i); out += ' L' + k.A[0] + ' ' + k.A[1] + ' Q' + k.p[0] + ' ' + k.p[1] + ' ' + k.B[0] + ' ' + k.B[1]; }
      return out + ' L' + P[n - 1][0] + ' ' + P[n - 1][1];
    }).join(' ');
  }
  function wire(G, d, o) {
    o = o || {}; var col = o.col || WIRE_COLS[WIRE_N++ % 2], w = o.w || 5, R = o.round == null ? 16 : o.round;
    var out = s('path', { fill: 'none', stroke: '#0A0F1A', 'stroke-opacity': 0.55, 'stroke-width': w + 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', transform: 'translate(1.5 3)' }, G);
    var base = s('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, G);
    var shine = s('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-opacity': 0.22, 'stroke-width': 1.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', transform: 'translate(0 -1.2)' }, G);
    var fl = s('path', { fill: 'none', stroke: '#FFE29A', 'stroke-width': w - 1.5, 'stroke-dasharray': '3 15', 'stroke-linecap': 'round', opacity: 0 }, G);
    var pg = s('g', {}, G);
    function plug(pt, from) {
      var dx = pt[0] - from[0], dy = pt[1] - from[1], a = Math.atan2(dy, dx) * 180 / Math.PI;
      var g = s('g', { transform: 'translate(' + pt[0] + ' ' + pt[1] + ') rotate(' + a + ')' }, pg);
      s('rect', { x: -15, y: -5.5, width: 14, height: 11, rx: 3, fill: col, stroke: '#0A0F1A', 'stroke-opacity': 0.5, 'stroke-width': 1 }, g);
      s('rect', { x: -9, y: -5.5, width: 2.2, height: 11, fill: '#FFFFFF', opacity: 0.25 }, g);
      s('rect', { x: -2, y: -2.6, width: 7, height: 5.2, rx: 1.5, fill: '#D9B44A', stroke: '#8A6D12', 'stroke-width': 0.8 }, g);
    }
    function draw(dd) {
      if (/[CQ]/.test(dd)) {
        /* câble courbe (un seul tracé M … C …) : pas d'arrondi, fiches orientées selon les tangentes aux extrémités */
        out.setAttribute('d', dd); base.setAttribute('d', dd); shine.setAttribute('d', dd); fl.setAttribute('d', dd); pg.innerHTML = '';
        var n = String(dd).match(/-?\d*\.?\d+/g).map(Number), m = n.length;
        if (o.plugs !== false && m >= 8) { plug([n[0], n[1]], [n[2], n[3]]); plug([n[m - 2], n[m - 1]], [n[m - 4], n[m - 3]]); }
        return;
      }
      var subs = parsePath(dd), dr = R > 0 ? roundPath(subs, R) : dd;
      out.setAttribute('d', dr); base.setAttribute('d', dr); shine.setAttribute('d', dr); fl.setAttribute('d', dr);
      pg.innerHTML = '';
      if (o.plugs !== false) subs.forEach(function (u) { if (u.closed) return; var P = u.pts, n = P.length; plug(P[0], P[1]); plug(P[n - 1], P[n - 2]); });
    }
    draw(d);
    return { base: base, fl: fl, flow: function (I, T) { fl.setAttribute('opacity', I > 0.01 ? Math.min(1, 0.4 + I) : 0); fl.setAttribute('stroke-dashoffset', -(T * 60 * Math.min(2, 0.4 + I))); }, set: draw };
  }

  /* câble entre deux douilles : il part de chaque douille horizontalement (dA, dB = ±1) puis se courbe. */
  function cable(G, A, dA, B, dB, o) {
    var d = Math.hypot(B[0] - A[0], B[1] - A[1]), k = (o && o.k) || Math.max(34, Math.min(80, d * 0.4)), r = function (v) { return Math.round(v * 10) / 10; };
    return wire(G, 'M' + r(A[0]) + ' ' + r(A[1]) + ' C' + r(A[0] + dA * k) + ' ' + r(A[1]) + ' ' + r(B[0] + dB * k) + ' ' + r(B[1]) + ' ' + r(B[0]) + ' ' + r(B[1]), o);
  }
  /* positions régulières sur une ellipse, dans le sens des aiguilles d'une montre, la première en haut */
  function ring(m, cx, cy, rx, ry) { var P = []; for (var i = 0; i < m; i++) { var a = (-90 + i * 360 / m) * Math.PI / 180; P.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return P; }
  /* boucle de modules à deux douilles : le premier (pile) sort par la droite (+) et revient par la gauche (−) ;
     pour les autres, on choisit la douille d'entrée qui rend les câbles les plus courts. mods[i] = { L: [x, y], R: [x, y] }.
     Renvoie les câbles { a, da, b, db, i } (i = module de départ) et la douille d'entrée de chaque module. */
  function chain(mods) {
    var m = mods.length, best = null, mask, i;
    for (mask = 0; mask < (1 << (m - 1)); mask++) {
      var inJ = ['L'], cost = 0; for (i = 1; i < m; i++) inJ.push((mask >> (i - 1)) & 1 ? 'R' : 'L');
      for (i = 0; i < m; i++) { var oj = i === 0 ? 'R' : inJ[i] === 'L' ? 'R' : 'L', a = mods[i][oj], b = mods[(i + 1) % m][inJ[(i + 1) % m]]; var da = oj === 'L' ? -1 : 1, db = inJ[(i + 1) % m] === 'L' ? -1 : 1; cost += Math.hypot(a[0] - b[0], a[1] - b[1]) + ((b[0] - a[0]) * da < -4 ? 120 : 0) + ((a[0] - b[0]) * db < -4 ? 120 : 0); }
      if (!best || cost < best.cost) best = { cost: cost, inJ: inJ };
    }
    var out = []; for (i = 0; i < m; i++) { var oj2 = i === 0 ? 'R' : best.inJ[i] === 'L' ? 'R' : 'L', j = (i + 1) % m, ij = best.inJ[j]; out.push({ a: mods[i][oj2], da: oj2 === 'L' ? -1 : 1, b: mods[j][ij], db: ij === 'L' ? -1 : 1, i: i }); }
    return { cables: out, inJ: best.inJ };
  }

  /* module interrupteur sur socle : deux douilles en (x1, y) et (x2, y) ; la lame pivote autour de la douille de gauche */
  function switchK(G, x1, y, x2, o) {
    o = o || {}; var g = s('g', { style: 'cursor:pointer', role: 'button', 'aria-label': 'Interrupteur : cliquer pour ouvrir ou fermer' }, G), closed = !!o.closed;
    s('ellipse', { cx: (x1 + x2) / 2, cy: y + 18, rx: (x2 - x1) / 2 + 26, ry: 6, fill: '#05080F', opacity: 0.35 }, g);
    s('rect', { x: x1 - 20, y: y - 15, width: x2 - x1 + 40, height: 32, rx: 6, fill: '#C9D2E3' }, g);
    s('rect', { x: x1 - 20, y: y - 15, width: x2 - x1 + 40, height: 28, rx: 6, fill: '#EEF2FA', stroke: '#9FB0C4', 'stroke-width': 1.5 }, g);
    s('rect', { x: x1 - 15, y: y - 11, width: x2 - x1 + 30, height: 4, rx: 2, fill: '#FFFFFF', opacity: 0.8 }, g);
    [x1, x2].forEach(function (cx) { s('circle', { cx: cx, cy: y, r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, g); s('circle', { cx: cx, cy: y, r: 2.8, fill: '#2A2F38' }, g); });
    var lev = s('line', { x1: x1, y1: y, stroke: '#B98A16', 'stroke-width': 5, 'stroke-linecap': 'round' }, g), knob = s('circle', { r: 6.5, fill: '#2A2F38', stroke: '#0A0F1A', 'stroke-width': 1 }, g);
    s('rect', { x: x1 - 24, y: y - 48, width: x2 - x1 + 48, height: 74, fill: 'transparent' }, g);
    var lab = s('text', { x: (x1 + x2) / 2, y: y + 33, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label || 'K' }, g);
    function set(c) { closed = c; var L = x2 - x1, a = c ? 0 : -32 * Math.PI / 180, ex = x1 + L * Math.cos(a), ey = y + L * Math.sin(a); attr(lev, { x2: ex, y2: ey }); attr(knob, { cx: ex, cy: ey }); }
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
  /* bouton-poussoir sur socle : deux douilles, bouton rouge ; ne ferme le circuit que pendant l'appui */
  function poussoir(G, x1, y, x2, o) {
    o = o || {}; var g = s('g', { style: 'cursor:pointer;touch-action:none', role: 'button', 'aria-label': 'Bouton-poussoir : maintenir appuyé pour fermer le circuit' }, G), mx = (x1 + x2) / 2;
    s('ellipse', { cx: mx, cy: y + 18, rx: (x2 - x1) / 2 + 26, ry: 6, fill: '#05080F', opacity: 0.35 }, g);
    s('rect', { x: x1 - 20, y: y - 15, width: x2 - x1 + 40, height: 32, rx: 6, fill: '#C9D2E3' }, g);
    s('rect', { x: x1 - 20, y: y - 15, width: x2 - x1 + 40, height: 28, rx: 6, fill: '#EEF2FA', stroke: '#9FB0C4', 'stroke-width': 1.5 }, g);
    [x1, x2].forEach(function (cx) { s('circle', { cx: cx, cy: y, r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, g); s('circle', { cx: cx, cy: y, r: 2.8, fill: '#2A2F38' }, g); });
    var strip = s('rect', { x: mx - 12, y: y - 2, width: 24, height: 4, rx: 2, fill: '#B98A16' }, g);
    var cap = s('g', {}, g); s('rect', { x: mx - 4, y: y - 22, width: 8, height: 14, fill: '#9FB0C4' }, cap); s('rect', { x: mx - 13, y: y - 32, width: 26, height: 12, rx: 5, fill: '#E5484D', stroke: '#8C1D22', 'stroke-width': 1.5 }, cap);
    s('rect', { x: x1 - 24, y: y - 50, width: x2 - x1 + 48, height: 76, fill: 'transparent' }, g);
    s('text', { x: mx, y: y + 33, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label || 'poussoir' }, g);
    function set(p) { cap.setAttribute('transform', 'translate(0 ' + (p ? 8 : 0) + ')'); strip.setAttribute('fill', p ? '#FFC94D' : '#B98A16'); }
    g.addEventListener('pointerdown', function (e) { try { g.setPointerCapture(e.pointerId); } catch (_) {} o.onDown && o.onDown(); });
    g.addEventListener('pointerup', function () { o.onUp && o.onUp(); }); g.addEventListener('pointerleave', function () { o.onUp && o.onUp(); });
    set(false);
    return { g: g, set: set };
  }
  /* commutateur (va-et-vient) sur socle : borne commune et deux sorties a (haut) et b (bas) ; flip = commune à droite */
  function vav(G, cx, cy, o) {
    o = o || {}; var f = o.flip ? -1 : 1, g = s('g', { style: 'cursor:pointer', role: 'button', 'aria-label': 'Commutateur va-et-vient : cliquer pour changer de position' }, G);
    var C = [cx - 32 * f, cy], A = [cx + 32 * f, cy - 17], B = [cx + 32 * f, cy + 17];
    s('ellipse', { cx: cx, cy: cy + 40, rx: 58, ry: 6, fill: '#05080F', opacity: 0.35 }, g);
    s('rect', { x: cx - 50, y: cy - 34, width: 100, height: 72, rx: 7, fill: '#C9D2E3' }, g);
    s('rect', { x: cx - 50, y: cy - 34, width: 100, height: 68, rx: 7, fill: '#EEF2FA', stroke: '#9FB0C4', 'stroke-width': 1.5 }, g);
    [C, A, B].forEach(function (p) { s('circle', { cx: p[0], cy: p[1], r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, g); s('circle', { cx: p[0], cy: p[1], r: 2.8, fill: '#2A2F38' }, g); });
    var lev = s('line', { x1: C[0], y1: C[1], stroke: '#B98A16', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    s('text', { x: cx, y: cy + 56, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: o.label || '' }, g);
    s('rect', { x: cx - 54, y: cy - 38, width: 108, height: 80, fill: 'transparent' }, g);
    function set(pos) { var q = pos === 'a' ? A : B; attr(lev, { x2: C[0] + (q[0] - C[0]) * 0.9, y2: C[1] + (q[1] - C[1]) * 0.9 }); }
    g.addEventListener('click', function () { o.onToggle && o.onToggle(); });
    set('a');
    return { g: g, set: set, C: C, A: A, B: B };
  }
  /* symboles normalisés pour les schémas (fond clair). kind : 'G' pile/générateur, 'L' lampe, 'K' interrupteur.
     Pile : trait long fin = borne +, trait court épais = borne −. Le dessin se tourne avec le fil :
     vert=false → fil horizontal (plaques verticales, + à gauche) ; vert=true → fil vertical (plaques horizontales, + en haut). */
  function sym(G2, kind, x, y, o) {
    o = o || {}; var ink = o.ink || '#1E2430', bg = o.bg || '#F7F4EA', g = s('g', {}, G2);
    if (kind === 'L') { s('circle', { cx: x, cy: y, r: 11, fill: o.on ? '#FFE9A8' : bg, stroke: ink, 'stroke-width': 2 }, g); s('path', { d: 'M' + (x - 7.8) + ' ' + (y - 7.8) + 'l15.6 15.6M' + (x + 7.8) + ' ' + (y - 7.8) + 'l-15.6 15.6', stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'G') {
      if (o.vert) {
        s('rect', { x: x - 14, y: y - 10, width: 28, height: 20, fill: bg }, g);
        s('line', { x1: x - 14, y1: y - 5, x2: x + 14, y2: y - 5, stroke: ink, 'stroke-width': 2 }, g);
        s('line', { x1: x - 8, y1: y + 5, x2: x + 8, y2: y + 5, stroke: ink, 'stroke-width': 5 }, g);
        s('text', { x: x + 18, y: y - 2, 'font-size': 12, 'font-weight': 900, fill: ink, text: '+' }, g);
        s('text', { x: x + 18, y: y + 12, 'font-size': 12, 'font-weight': 900, fill: ink, text: '−' }, g);
      } else {
        var f = o.flip ? -1 : 1;
        s('rect', { x: x - 10, y: y - 14, width: 20, height: 28, fill: bg }, g);
        s('line', { x1: x - 5 * f, y1: y - 14, x2: x - 5 * f, y2: y + 14, stroke: ink, 'stroke-width': 2 }, g);
        s('line', { x1: x + 5 * f, y1: y - 8, x2: x + 5 * f, y2: y + 8, stroke: ink, 'stroke-width': 5 }, g);
        if (!o.nolabel) { s('text', { x: x - 14 * f - (f < 0 ? 7 : 0), y: y - 17, 'font-size': 12, 'font-weight': 900, fill: ink, text: '+' }, g); s('text', { x: x + 8 * f - (f < 0 ? 7 : 0), y: y - 17, 'font-size': 12, 'font-weight': 900, fill: ink, text: '−' }, g); }
      }
    }
    if (kind === 'K') { s('rect', { x: x - 14, y: y - 10, width: 28, height: 14, fill: bg }, g); s('circle', { cx: x - 12, cy: y, r: 2.5, fill: ink }, g); s('circle', { cx: x + 12, cy: y, r: 2.5, fill: ink }, g); s('line', { x1: x - 12, y1: y, x2: x + 12, y2: o.closed ? y : y - 10, stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'P') { s('rect', { x: x - 14, y: y - 18, width: 28, height: 22, fill: bg }, g); s('circle', { cx: x - 12, cy: y, r: 2.5, fill: ink }, g); s('circle', { cx: x + 12, cy: y, r: 2.5, fill: ink }, g); s('line', { x1: x - 12, y1: o.closed ? y : y - 3, x2: x + 12, y2: o.closed ? y : y - 3, stroke: ink, 'stroke-width': 2 }, g); s('path', { d: 'M' + x + ' ' + (o.closed ? y - 1 : y - 4) + 'V' + (y - 14) + 'M' + (x - 6) + ' ' + (y - 14) + 'H' + (x + 6), stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'V') { var f = o.flip ? -1 : 1, q = o.pos === 'b' ? 9 : -9; s('rect', { x: x - 16, y: y - 14, width: 32, height: 28, fill: bg }, g); [[x - 14 * f, y], [x + 14 * f, y - 9], [x + 14 * f, y + 9]].forEach(function (c) { s('circle', { cx: c[0], cy: c[1], r: 2.5, fill: ink }, g); }); s('line', { x1: x - 14 * f, y1: y, x2: x + 14 * f - 3 * f, y2: y + q * 0.85, stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'F') { s('rect', { x: x - 14, y: y - 6, width: 28, height: 12, fill: bg, stroke: ink, 'stroke-width': 2 }, g); if (o.blown) s('path', { d: 'M' + (x - 14) + ' ' + y + 'H' + (x - 4) + 'M' + (x + 4) + ' ' + y + 'H' + (x + 14), stroke: ink, 'stroke-width': 2 }, g); else s('line', { x1: x - 14, y1: y, x2: x + 14, y2: y, stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'D') { s('rect', { x: x - 16, y: y - 14, width: 32, height: 20, fill: bg }, g); s('circle', { cx: x - 13, cy: y, r: 2.5, fill: ink }, g); s('circle', { cx: x + 13, cy: y, r: 2.5, fill: ink }, g); s('line', { x1: x - 13, y1: y, x2: x + 13, y2: o.closed ? y : y - 11, stroke: ink, 'stroke-width': 2 }, g); var bx = o.closed ? x + 1 : x + 6, by = o.closed ? y - 2 : y - 6; s('path', { d: 'M' + (bx - 3) + ' ' + (by - 3) + 'l6 6M' + (bx + 3) + ' ' + (by - 3) + 'l-6 6', stroke: ink, 'stroke-width': 2 }, g); }
    if (kind === 'M') { s('circle', { cx: x, cy: y, r: 11, fill: o.on ? '#C9F0DA' : bg, stroke: ink, 'stroke-width': 2 }, g); s('text', { x: x, y: y + 4.5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: ink, text: 'M' }, g); }
    return g;
  }
  window.ElecKit = { poussoir: poussoir, vav: vav, sym: sym, cable: cable, ring: ring, chain: chain, glow: glow, battery: battery, lamp: lamp, motor: motor, wire: wire, switchK: switchK, meter: meter, dot: dot, lampState: lampState, v: v, multimeter: multimeter, lead: lead, CALS: CALS };
})();
