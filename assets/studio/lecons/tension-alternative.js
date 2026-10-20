/* 4e · Courants et tensions alternatifs · Leçon : Production d'une tension alternative */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, ease = S.ease;
  var K_ROT = 2.4e-4;     // Umax = K_ROT × N × n (V), aimant à 2 pôles
  var K_HAND = 0.0042;    // U = −K_HAND × N × dΦ/dt en mode « à la main »
  var DIV = 34;           // taille d'une division de l'oscilloscope (px)

  /* ---------- le montage : aimant, bobine, voltmètre à zéro central, oscilloscope ---------- */
  function rig(G, o) {
    o = o || {};
    var A = { x: 190, y: 235 }, C = { x: 392, y: 235 };
    var r = { A: A, C: C };
    var g = s('g', {}, G);
    // rail (mode main) et moteur (mode rotation)
    r.rail = s('g', {}, g);
    s('rect', { x: 40, y: 286, width: 300, height: 10, rx: 5, fill: 'var(--scene-line)' }, r.rail);
    s('text', { x: 190, y: 316, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--scene-muted)', text: 'fais glisser l’aimant' }, r.rail);
    r.motor = s('g', {}, g);
    s('rect', { x: 150, y: 298, width: 80, height: 32, rx: 8, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, r.motor);
    s('line', { x1: A.x, y1: A.y, x2: A.x, y2: 298, stroke: 'var(--scene-muted)', 'stroke-width': 5 }, r.motor);
    s('text', { x: A.x, y: 319, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'moteur' }, r.motor);
    r.orbit = s('circle', { cx: A.x, cy: A.y, r: 92, fill: 'none', stroke: 'var(--scene-line)', 'stroke-width': 2, 'stroke-dasharray': '4 8' }, g);
    // halo de la bobine (∝ |U|)
    var gd = s('radialGradient', { id: 'glow' + (o.id || '') }, s('defs', {}, g)); s('stop', { offset: 0, 'stop-color': '#FFC773', 'stop-opacity': 0.9 }, gd); s('stop', { offset: 1, 'stop-color': '#FFC773', 'stop-opacity': 0 }, gd);
    r.glow = s('ellipse', { cx: C.x, cy: C.y, rx: 95, ry: 115, fill: 'url(#glow' + (o.id || '') + ')', opacity: 0 }, g);
    // fils
    r.wire = s('path', { d: 'M' + C.x + ' 168V96H470M' + C.x + ' 302V410H300', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, g);
    r.wireOn = s('path', { d: 'M' + C.x + ' 168V96H470M' + C.x + ' 302V410H300', fill: 'none', stroke: '#FFB547', 'stroke-width': 3, 'stroke-dasharray': '6 10', opacity: 0 }, g);
    // bobine
    var cg = s('g', {}, g);
    s('rect', { x: C.x - 34, y: C.y - 62, width: 68, height: 124, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, cg);
    for (var i = 0; i < 11; i++) s('rect', { x: C.x - 38, y: C.y - 56 + i * 10.6, width: 76, height: 7, rx: 3.5, fill: 'var(--copper)' }, cg);
    s('text', { x: C.x, y: C.y + 86, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'bobine' }, cg);
    r.turnsT = s('text', { x: C.x, y: C.y - 72, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--copper)' }, cg);
    // aimant
    r.mag = s('g', {}, g);
    s('rect', { x: 0, y: -23, width: 80, height: 46, rx: 8, fill: 'var(--nord)' }, r.mag);
    s('rect', { x: -80, y: -23, width: 80, height: 46, rx: 8, fill: 'var(--sud)' }, r.mag);
    r.nT = s('text', { x: 40, y: 8, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#fff', text: 'N' }, r.mag);
    r.sT = s('text', { x: -40, y: 8, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#fff', text: 'S' }, r.mag);
    s('circle', { r: 6, fill: 'var(--scene)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, r.mag);
    r.magHit = s('rect', { x: -96, y: -40, width: 192, height: 80, fill: 'transparent' }, r.mag);
    r.grab = s('g', {}, r.mag);
    s('path', { d: 'M-98 -12 L-110 0 L-98 12 M98 -12 L110 0 L98 12', fill: 'none', stroke: 'var(--amber)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, r.grab);
    // voltmètre à zéro central
    var vg = s('g', {}, g), VC = { x: 200, y: 452 };
    r.vg = vg;
    s('path', { d: 'M100 452A100 100 0 0 1 300 452Z', fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, vg);
    for (var v = -10; v <= 10; v += 2) { var a = (v / 10) * 60 * Math.PI / 180, big = v % 10 === 0 || v === 0; s('line', { x1: VC.x + 84 * Math.sin(a), y1: VC.y - 84 * Math.cos(a), x2: VC.x + (big ? 70 : 76) * Math.sin(a), y2: VC.y - (big ? 70 : 76) * Math.cos(a), stroke: 'var(--scene-text)', 'stroke-width': big ? 2 : 1.2 }, vg); if (v % 5 === 0) s('text', { x: VC.x + 60 * Math.sin(a), y: VC.y - 60 * Math.cos(a) + 4, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--scene-muted)', text: (v > 0 ? '+' : '') + v }, vg); }
    s('text', { x: VC.x, y: VC.y - 22, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-text)', text: 'V' }, vg);
    r.needle = s('line', { x1: VC.x, y1: VC.y, x2: VC.x, y2: VC.y - 80, stroke: 'var(--red)', 'stroke-width': 3, 'stroke-linecap': 'round' }, vg);
    s('circle', { cx: VC.x, cy: VC.y, r: 6, fill: 'var(--scene-text)' }, vg);
    r.vT = s('text', { x: 312, y: 446, 'font-size': 15, 'font-weight': 800, fill: 'var(--scene-text)' }, vg);
    // oscilloscope
    var og = s('g', {}, g); r.og = og;
    s('rect', { x: 470, y: 22, width: 376, height: 330, rx: 18, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, og);
    var SX = 488, SY = 44; r.SX = SX; r.SY = SY; r.Y0 = SY + 4 * DIV;
    s('rect', { x: SX, y: SY, width: 10 * DIV, height: 8 * DIV, rx: 6, fill: 'var(--scope)' }, og);
    var grid = ''; for (var gx = 1; gx < 10; gx++) grid += 'M' + (SX + gx * DIV) + ' ' + SY + 'v' + 8 * DIV; for (var gy = 1; gy < 8; gy++) grid += 'M' + SX + ' ' + (SY + gy * DIV) + 'h' + 10 * DIV;
    s('path', { d: grid, stroke: 'var(--scope-grid)', 'stroke-width': 1 }, og);
    var ax = 'M' + SX + ' ' + r.Y0 + 'h' + 10 * DIV + 'M' + (SX + 5 * DIV) + ' ' + SY + 'v' + 8 * DIV, tk = '';
    for (var q = 0; q <= 50; q++) tk += 'M' + (SX + q * DIV / 5) + ' ' + (r.Y0 - 3) + 'v6'; for (q = 0; q <= 40; q++) tk += 'M' + (SX + 5 * DIV - 3) + ' ' + (SY + q * DIV / 5) + 'h6';
    s('path', { d: ax + tk, stroke: 'var(--scope-axis)', 'stroke-width': 1.3 }, og);
    var cp = s('clipPath', { id: 'scClip' + (o.id || '') }, s('defs', {}, og)); s('rect', { x: SX, y: SY, width: 10 * DIV, height: 8 * DIV }, cp);
    var tg = s('g', { 'clip-path': 'url(#scClip' + (o.id || '') + ')' }, og);
    r.traceDim = s('path', { fill: 'none', stroke: 'var(--trace)', 'stroke-width': 2.5, opacity: 0.28, 'stroke-linejoin': 'round' }, tg);
    r.trace = s('path', { fill: 'none', stroke: 'var(--trace)', 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, tg);
    r.spot = s('circle', { r: 6, fill: '#B9FFD6' }, tg);
    r.scT = s('text', { x: 658, y: 340, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-muted)' }, og);
    r.scW = s('text', { x: 658, y: 186, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--amber)' }, og);
    s('text', { x: 836, y: 40, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: 'var(--scene-muted)', 'letter-spacing': '0.08em', text: 'OSCILLOSCOPE' }, og);
    r.slowT = s('text', { x: 658, y: 376, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-muted)' }, g);
    r.g = g;
    return r;
  }
  function setNeedle(r, U) { var a = clamp(U / 10, -1.1, 1.1) * 60 * Math.PI / 180; attr(r.needle, { x2: 200 + 80 * Math.sin(a), y2: 452 - 80 * Math.cos(a) }); attr(r.vT, { text: (U >= 0 ? '+' : '−') + fmt(Math.abs(U), 1) + ' V' }); }
  function setGlow(r, U, ref) { r.glow.setAttribute('opacity', clamp(Math.abs(U) / (ref || 8), 0, 1) * 0.6); r.wireOn.setAttribute('opacity', Math.abs(U) > 0.3 ? 0.9 : 0); }

  /* moteur physique commun à la simulation et au défi */
  function Lab(G, opts) {
    var r = rig(G, opts), st = { mode: opts.mode || 'rot', n: opts.n == null ? 25 : opts.n, N: opts.N || 500, sens: opts.sens || 2, sweep: opts.sweep || 10, th: 0, x: 120, vx: 0, U: 0, hist: [], tReal: 0, dash: 0, maxU: 0 };
    function Umax() { return K_ROT * st.N * st.n; }
    function visRate() { return st.n > 0 ? 0.3 + st.n / 80 * 0.9 : 0; }
    function phi(x) { var d = (r.C.x - 34) - (x + 80); return 1 / (1 + Math.pow(Math.max(0, d) / 70, 2)); }
    var dragging = false, lastX = 0, lastT = 0;
    S.attr(r.magHit, {}); r.magHit.style.cursor = 'grab'; r.magHit.style.touchAction = 'none';
    function svgX(e) { var sv = G.ownerSVGElement, p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(G.getScreenCTM().inverse()).x; }
    r.magHit.addEventListener('pointerdown', function (e) { if (st.mode !== 'hand') return; dragging = true; try { r.magHit.setPointerCapture(e.pointerId); } catch (_) {} lastX = svgX(e); r.grab.style.opacity = 0; e.preventDefault(); });
    r.magHit.addEventListener('pointermove', function (e) { if (!dragging) return; var x = svgX(e); st.x = clamp(st.x + (x - lastX), 60, 262); lastX = x; });
    r.magHit.addEventListener('pointerup', function () { dragging = false; });
    r.magHit.addEventListener('pointercancel', function () { dragging = false; });
    var prevPhi = phi(st.x), prevX = st.x;
    function step(dt) {
      st.tReal += dt;
      if (st.mode === 'rot') {
        var vr = visRate(); st.th += 2 * Math.PI * vr * dt;
        st.U = Umax() * Math.sin(st.th);
      } else {
        var p = phi(st.x), dphi = (p - prevPhi) / Math.max(dt, 1e-3);
        st.U = st.U * 0.55 + 0.45 * (-K_HAND * st.N * dphi * 1.6);
        prevPhi = p; prevX = st.x;
        st.hist.push([st.tReal, st.U]); while (st.hist.length && st.hist[0][0] < st.tReal - 3) st.hist.shift();
      }
      st.maxU = Math.max(st.maxU, Math.abs(st.U));
      draw();
    }
    function draw() {
      var proj = S.settings.proj, sw = proj ? 1.6 : 1;
      r.trace.setAttribute('stroke-width', 3.2 * sw); r.wire.setAttribute('stroke-width', 3 * sw);
      var rot = st.mode === 'rot';
      r.rail.style.display = rot ? 'none' : ''; r.motor.style.display = rot ? '' : 'none'; r.orbit.style.display = rot ? '' : 'none'; r.grab.style.display = rot ? 'none' : '';
      if (rot) r.mag.setAttribute('transform', 'translate(' + r.A.x + ' ' + r.A.y + ') rotate(' + (-st.th * 180 / Math.PI) + ')');
      else r.mag.setAttribute('transform', 'translate(' + st.x + ' ' + r.A.y + ')');
      r.nT.setAttribute('transform', rot ? 'rotate(' + (st.th * 180 / Math.PI) + ' 40 0)' : ''); r.sT.setAttribute('transform', rot ? 'rotate(' + (st.th * 180 / Math.PI) + ' -40 0)' : '');
      r.turnsT.textContent = st.N + ' spires';
      setNeedle(r, st.U); setGlow(r, st.U, 6);
      var sens = st.sens, Y0 = r.Y0, SX = r.SX, d = '', dd = '';
      if (rot) {
        var win = 10 * st.sweep / 1000, n = st.n, Um = Umax(), tEq = n > 0 ? (st.th / (2 * Math.PI)) / n : 0, tSpot = n > 0 ? tEq % win : 0, xs = SX + tSpot / win * 10 * DIV;
        for (var px = 0; px <= 10 * DIV; px += 2) { var tt = px / (10 * DIV) * win, y = Y0 - Um * Math.sin(2 * Math.PI * n * tt) / sens * DIV; d += (px ? 'L' : 'M') + (SX + px) + ' ' + y.toFixed(1); if (SX + px <= xs) dd += (px ? 'L' : 'M') + (SX + px) + ' ' + y.toFixed(1); }
        r.traceDim.setAttribute('d', d); r.trace.setAttribute('d', dd);
        r.spot.setAttribute('cx', xs); r.spot.setAttribute('cy', Y0 - Um * Math.sin(2 * Math.PI * n * tSpot) / sens * DIV);
        r.scT.textContent = 'Sensibilité ' + sens + ' V/div · balayage ' + st.sweep + ' ms/div';
        var vr = visRate();
        r.slowT.textContent = n > 0 ? 'Animation au ralenti : ×1/' + Math.round(n / vr) : 'Moteur arrêté';
        var over = Um / sens > 4.05, few = n > 0 && 1 / n > win;
        r.scW.textContent = over ? 'La courbe sort de l’écran : augmente les V/div' : few ? 'Moins d’une période visible : augmente les ms/div' : n === 0 ? 'Aucune tension : l’aimant ne bouge pas' : '';
      } else {
        var h = st.hist, t1 = st.tReal;
        h.forEach(function (p, i) { var x = SX + 10 * DIV - (t1 - p[0]) / 3 * 10 * DIV, y = Y0 - p[1] / sens * DIV; d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); });
        r.traceDim.setAttribute('d', ''); r.trace.setAttribute('d', d);
        r.spot.setAttribute('cx', SX + 10 * DIV); r.spot.setAttribute('cy', Y0 - st.U / sens * DIV);
        r.scT.textContent = 'Sensibilité ' + sens + ' V/div · défilement 0,3 s/div';
        r.slowT.textContent = 'Temps réel';
        r.scW.textContent = '';
      }
    }
    draw();
    return { r: r, st: st, step: step, draw: draw, Umax: Umax };
  }

  /* ================== RÉSUMÉ VIDÉO ================== */
  function resumeScene(api) {
    var G = api.g, R = rig(G, { id: 'rs' });
    R.rail.style.display = 'none'; R.grab.style.display = 'none';
    // vélo
    var bike = s('g', { opacity: 0 }, G), wheel = s('g', {}, bike);
    s('circle', { cx: 0, cy: 0, r: 120, fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 10 }, wheel);
    for (var k = 0; k < 12; k++) s('line', { x1: 0, y1: 0, x2: 112 * Math.cos(k * Math.PI / 6), y2: 112 * Math.sin(k * Math.PI / 6), stroke: 'var(--scene-muted)', 'stroke-width': 2 }, wheel);
    s('circle', { r: 12, fill: 'var(--scene-text)' }, wheel);
    var dyn = s('g', {}, bike);
    s('rect', { x: -22, y: -44, width: 44, height: 70, rx: 12, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, dyn);
    var dynCap = s('circle', { cx: 0, cy: 34, r: 10, fill: 'var(--scene-muted)' }, dyn);
    s('text', { x: 0, y: -54, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'dynamo' }, dyn);
    var lamp = s('g', {}, bike);
    var lampGlow = s('circle', { cx: 0, cy: 0, r: 60, fill: '#FFE29A', opacity: 0 }, lamp);
    s('path', { d: 'M-18 -14h22l18 -14v56l-18 -14h-22z', fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, lamp);
    var lampFace = s('ellipse', { cx: 22, cy: 0, rx: 6, ry: 26, fill: '#FFE29A', opacity: 0.3 }, lamp);
    var beam = s('path', { d: 'M28 -26 L240 -90 L240 90 L28 26Z', fill: '#FFE29A', opacity: 0 }, lamp);
    s('path', { d: 'M-18 0 C-90 0 -160 -44 -238 -44', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, lamp);
    // centrale hydroélectrique
    var dam = s('g', { opacity: 0 }, G);
    s('path', { d: 'M40 120 L240 120 L300 400 L40 400Z', fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, dam);
    s('path', { d: 'M40 150 L236 150 L236 400 L40 400Z', fill: 'var(--blue)', opacity: 0.35 }, dam);
    s('text', { x: 130, y: 112, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'barrage' }, dam);
    var flow = s('path', { d: 'M236 330 C270 330 300 340 336 340', fill: 'none', stroke: 'var(--blue)', 'stroke-width': 10, 'stroke-dasharray': '26 10', opacity: 0.85 }, dam);
    var turb = s('g', {}, dam);
    for (var b = 0; b < 8; b++) s('path', { d: 'M0 0 Q20 -10 34 -38 L22 -40 Q10 -16 0 0', fill: 'var(--scene-text)', transform: 'rotate(' + b * 45 + ')' }, turb);
    s('circle', { r: 9, fill: 'var(--amber)' }, turb);
    s('text', { x: 370, y: 410, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'turbine' }, dam);
    s('line', { x1: 370, y1: 336, x2: 370, y2: 240, stroke: 'var(--scene-muted)', 'stroke-width': 8 }, dam);
    s('rect', { x: 316, y: 150, width: 108, height: 90, rx: 14, fill: 'var(--scene2)', stroke: 'var(--amber)', 'stroke-width': 3 }, dam);
    var altMag = s('g', {}, dam);
    s('rect', { x: 0, y: -10, width: 34, height: 20, rx: 4, fill: 'var(--nord)' }, altMag); s('rect', { x: -34, y: -10, width: 34, height: 20, rx: 4, fill: 'var(--sud)' }, altMag);
    s('text', { x: 370, y: 140, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: 'var(--amber)', text: 'alternateur' }, dam);
    var line = s('path', { d: 'M424 190 L520 160 L640 160 L760 190', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 2.5 }, dam);
    [520, 640].forEach(function (x) { s('path', { d: 'M' + (x - 16) + ' 330 L' + x + ' 150 L' + (x + 16) + ' 330 M' + (x - 24) + ' 170 H' + (x + 24) + ' M' + (x - 10) + ' 240 H' + (x + 10), fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, dam); });
    var house = s('g', {}, dam);
    s('path', { d: 'M730 260 L780 220 L830 260 V330 H730Z', fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, house);
    var win = s('rect', { x: 768, y: 276, width: 26, height: 26, rx: 3, fill: '#FFE29A', opacity: 0.2 }, house);
    var hz = s('g', { opacity: 0 }, dam);
    s('rect', { x: 560, y: 36, width: 250, height: 84, rx: 18, fill: 'var(--amber)' }, hz);
    s('text', { x: 685, y: 92, 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 800, fill: 'var(--on-amber)', 'font-family': 'Bricolage Grotesque, sans-serif', text: '50 Hz' }, hz);
    var pulse = s('path', { d: 'M480 220 C490 200 500 200 510 220 S530 240 540 220', fill: 'none', stroke: 'var(--trace)', 'stroke-width': 3, opacity: 0 }, dam);
    // cartes « à retenir »
    var cards = s('g', {}, G), CARDS = [
      ['Un aimant qui <b>bouge</b> près d’une bobine', 'crée une tension à ses bornes.', 'var(--amber)'],
      ['Aimant qui <b>tourne</b> → tension <b>alternative</b>', 'elle change de signe à chaque demi-tour.', 'var(--blue)'],
      ['<b>f</b> = nombre de tours par seconde', 'plus il tourne vite : U max et f augmentent.', 'var(--green)']
    ].map(function (c, i) {
      var y = 70 + i * 120, cg = s('g', { opacity: 0 }, cards);
      s('rect', { x: 150, y: y, width: 680, height: 100, rx: 20, fill: 'var(--scene2)', stroke: c[2], 'stroke-width': 3 }, cg);
      s('circle', { cx: 200, cy: y + 50, r: 26, fill: c[2] }, cg);
      s('text', { x: 200, y: y + 60, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 800, fill: 'var(--on-amber)', 'font-family': 'Bricolage Grotesque, sans-serif', text: String(i + 1) }, cg);
      var t1 = s('text', { x: 246, y: y + 44, 'font-size': 24, 'font-weight': 800, fill: 'var(--scene-text)' }, cg); t1.innerHTML = c[0].replace(/<b>/g, '<tspan fill="#FFB547">').replace(/<\/b>/g, '</tspan>');
      s('text', { x: 246, y: y + 76, 'font-size': 18, fill: 'var(--scene-muted)', text: c[1] }, cg);
      return cg;
    });
    // légendes animées
    var tag = s('g', { opacity: 0 }, G), tagR = s('rect', { rx: 18, height: 40, fill: 'var(--amber)' }, tag), tagT = s('text', { 'font-size': 18, 'font-weight': 800, fill: 'var(--on-amber)' }, tag);
    var chapT = s('g', {}, G), chR = s('rect', { x: 24, y: 18, height: 40, rx: 20, fill: 'var(--scene2)' }, chapT), chTx = s('text', { x: 44, y: 44, 'font-size': 17, 'font-weight': 700, fill: 'var(--scene-text)' }, chapT);

    function fade(t, a, b, f) { f = f || 0.6; return clamp(Math.min((t - a) / f, (b - t) / f), 0, 1); }
    function showTag(t, a, b, x, y, txt) { if (t >= a && t <= b) { tag.setAttribute('opacity', fade(t, a, b, 0.4)); tagT.textContent = txt; var w = txt.length * 9.6 + 30; attr(tagR, { x: x - w / 2, y: y - 28, width: w }); attr(tagT, { x: x, y: y - 2, 'text-anchor': 'middle' }); return true; } return false; }
    // angle de l'aimant (intégrale de la vitesse visuelle), pur en fonction de t
    function theta(t) {
      if (t < 18) return 0;
      var a = Math.min(t, 31.4) - 18, th = 2 * Math.PI * 0.6 * a;
      if (t > 31.4) { var b = Math.min(t, 35.5) - 31.4; th += 2 * Math.PI * (0.6 * b + 0.3 * b * b / 2.0); }
      return th;
    }
    function omega(t) { return t < 18 ? 0 : t < 31.4 ? 0.6 : 0.6 + 0.3 * Math.min(t - 31.4, 2); }
    function magX(t) {   // mode « main » du chapitre 1
      if (t < 2) return -160; if (t < 4.6) return -160 + 300 * ease((t - 2) / 2.6);
      if (t < 9.4) return 140; if (t < 12.8) return 140 + 120 * ease((t - 9.4) / 3.4);
      if (t < 13.4) return 260; if (t < 16.6) return 260 - 160 * ease((t - 13.4) / 3.2);
      return 100;
    }
    function render(t) {
      var c1 = t < 17.2, rigOp = fade(t, -1, 35.6, 0.8);
      R.g.setAttribute('opacity', rigOp);
      R.og.setAttribute('opacity', clamp((t - 16.6) / 0.8, 0, 1));
      R.vg.setAttribute('opacity', 1);
      R.motor.style.display = c1 ? 'none' : ''; R.orbit.style.display = c1 ? 'none' : '';
      R.turnsT.textContent = '';
      var U = 0;
      if (c1) {
        var x = magX(t), v = (magX(t + 0.05) - magX(t - 0.05)) / 0.1;
        R.mag.setAttribute('transform', 'translate(' + x + ' ' + R.A.y + ')');
        R.nT.removeAttribute('transform'); R.sT.removeAttribute('transform');
        U = clamp(v / 120 * 6, -9, 9) * (x > 0 ? 1 : 0.2);
      } else {
        var th = theta(t), w = omega(t), Um = 2.2 + w * 7;
        if (t < 18) { var k = ease((t - 17.2) / 0.8), x0 = 100; R.mag.setAttribute('transform', 'translate(' + (x0 + (R.A.x - x0) * k) + ' ' + R.A.y + ')'); }
        else R.mag.setAttribute('transform', 'translate(' + R.A.x + ' ' + R.A.y + ') rotate(' + (-th * 180 / Math.PI) + ')');
        R.nT.setAttribute('transform', 'rotate(' + (th * 180 / Math.PI) + ' 40 0)'); R.sT.setAttribute('transform', 'rotate(' + (th * 180 / Math.PI) + ' -40 0)');
        U = Um * Math.sin(th);
        // oscilloscope : nombre de périodes visibles ∝ vitesse
        var per = 1.5 + (w - 0.6) * 2.5, SX = R.SX, Y0 = R.Y0, cyc = th / (2 * Math.PI), xs = SX + ((cyc % per) / per) * 10 * DIV, d = '', dd = '';
        for (var px = 0; px <= 10 * DIV; px += 2) { var y = Y0 - Um * Math.sin(2 * Math.PI * per * px / (10 * DIV)) / 2.6 * DIV; d += (px ? 'L' : 'M') + (SX + px) + ' ' + y.toFixed(1); if (SX + px <= xs) dd += (px ? 'L' : 'M') + (SX + px) + ' ' + y.toFixed(1); }
        R.traceDim.setAttribute('d', t > 18 ? d : ''); R.trace.setAttribute('d', t > 18 ? dd : '');
        attr(R.spot, { cx: xs, cy: Y0 - Um * Math.sin(2 * Math.PI * cyc) / 2.6 * DIV, opacity: t > 18 ? 1 : 0 });
        R.scT.textContent = 'tension alternative sinusoïdale'; R.scW.textContent = '';
      }
      if (c1) { R.traceDim.setAttribute('d', ''); R.trace.setAttribute('d', ''); R.spot.setAttribute('opacity', 0); }
      setNeedle(R, U); setGlow(R, U, 8);
      R.slowT.textContent = t > 18 && t < 35 ? 'ralenti' : '';
      // légendes
      tag.setAttribute('opacity', 0);
      showTag(t, 5.2, 9, 200, 330, '0 V : l’aimant ne bouge pas') || showTag(t, 9.8, 12.9, 200, 330, 'Il s’approche : U > 0') || showTag(t, 13.6, 16.7, 200, 330, 'Il s’éloigne : U < 0') ||
        showTag(t, 22.4, 27.4, 658, 390, 'Elle change de signe à chaque demi-tour') || showTag(t, 27.8, 31.2, 658, 390, 'Tension alternative sinusoïdale') || showTag(t, 31.6, 34.9, 658, 390, 'Plus vite → plus grande et plus rapide');
      // vélo 35 → 40
      var bo = fade(t, 35.2, 40.3, 0.6); bike.setAttribute('opacity', bo);
      if (bo > 0) {
        var wr = (t - 35) * 2.2;
        wheel.setAttribute('transform', 'translate(300 290) rotate(' + (wr * 180 / Math.PI) + ')');
        dyn.setAttribute('transform', 'translate(300 150)'); dynCap.setAttribute('cy', 26);
        lamp.setAttribute('transform', 'translate(560 180)');
        var li = 0.55 + 0.45 * Math.abs(Math.sin(wr * 6));
        lampGlow.setAttribute('opacity', 0.25 * li); lampFace.setAttribute('opacity', 0.4 + 0.6 * li); beam.setAttribute('opacity', 0.12 * li);
      }
      // centrale 40 → 53
      var dO = fade(t, 40.2, 53.2, 0.7); dam.setAttribute('opacity', dO);
      if (dO > 0) {
        flow.setAttribute('stroke-dashoffset', -t * 80);
        turb.setAttribute('transform', 'translate(370 340) rotate(' + (t * 220) + ')');
        altMag.setAttribute('transform', 'translate(370 195) rotate(' + (-t * 220) + ')');
        line.setAttribute('stroke-dasharray', '8 8'); line.setAttribute('stroke-dashoffset', -t * 60); line.style.stroke = 'var(--amber)';
        win.setAttribute('opacity', 0.4 + 0.6 * clamp((t - 43) / 1.5, 0, 1));
        hz.setAttribute('opacity', clamp((t - 46.6) / 0.6, 0, 1));
        hz.setAttribute('transform', 'translate(' + 0 + ' ' + (8 * (1 - ease(clamp((t - 46.6) / 0.6, 0, 1)))) + ')');
        pulse.setAttribute('opacity', 0);
      }
      // cartes 53 → 68
      CARDS.forEach(function (cg, i) { var a = [53.2, 58.4, 63.4][i], k = clamp((t - a) / 0.6, 0, 1); cg.setAttribute('opacity', k); cg.setAttribute('transform', 'translate(' + (40 * (1 - ease(k))) + ' 0)'); });
      // titre de chapitre
      var ch = t < 17 ? 'Chapitre 1 · Un aimant et une bobine' : t < 35 ? 'Chapitre 2 · L’aimant tourne' : t < 53 ? 'Chapitre 3 · L’alternateur' : 'Chapitre 4 · À retenir';
      chTx.textContent = ch; chR.setAttribute('width', ch.length * 8.6 + 40);
      // caméra : léger zoom sur l'oscilloscope pendant l'explication
      var cam = clamp(Math.min((t - 22) / 1.2, (27.6 - t) / 1.2), 0, 1) * 0.1;
      R.g.setAttribute('transform', 'translate(' + (24 - 700 * cam) + ' ' + (-26 - 190 * cam) + ') scale(' + (1 + cam) + ')');
    }
    return { render: render };
  }

  var RESUME = {
    alt: 'Résumé animé : un aimant devant une bobine, puis un aimant qui tourne avec l’oscilloscope, une dynamo de vélo, une centrale hydroélectrique et le bilan',
    duration: 68,
    chapters: [{ t: 0, title: 'Un aimant et une bobine' }, { t: 17, title: 'L’aimant tourne' }, { t: 35, title: 'L’alternateur' }, { t: 53, title: 'À retenir' }],
    segs: [
      { t: 0, d: 4.6, say: 'Voici une bobine : un long fil de cuivre enroulé. Elle est reliée à un voltmètre.', sub: 'Voici une <b>bobine</b> : un long fil de cuivre enroulé, reliée à un <b>voltmètre</b>.' },
      { t: 4.8, d: 4.2, say: 'L’aimant est immobile devant la bobine : le voltmètre indique zéro volt.', sub: 'L’aimant est <b>immobile</b> : le voltmètre indique <b>0 V</b>.' },
      { t: 9.2, d: 3.8, say: 'Approchons l’aimant : l’aiguille dévie ! Une tension apparaît.', sub: 'On <b>approche</b> l’aimant : l’aiguille dévie, <b>une tension apparaît</b> !' },
      { t: 13.2, d: 3.6, say: 'Éloignons-le : l’aiguille dévie dans l’autre sens.', sub: 'On l’<b>éloigne</b> : l’aiguille dévie <b>dans l’autre sens</b>.' },
      { t: 17, d: 5, say: 'Maintenant, l’aimant tourne devant la bobine. Regarde l’oscilloscope.', sub: 'Maintenant, l’aimant <b>tourne</b>. Regarde l’<b>oscilloscope</b>.' },
      { t: 22.2, d: 5.3, say: 'Le pôle nord, puis le pôle sud passent devant la bobine : la tension change de signe à chaque demi-tour.', sub: 'Pôle nord, puis pôle sud : la tension <b>change de signe</b> à chaque demi-tour.' },
      { t: 27.7, d: 3.5, say: 'On obtient une tension alternative sinusoïdale.', sub: 'C’est une tension <b>alternative sinusoïdale</b>.' },
      { t: 31.4, d: 3.4, say: 'Plus l’aimant tourne vite, plus la tension est grande, et plus elle oscille vite.', sub: 'Plus il tourne <b>vite</b>, plus la tension est <b>grande</b> et <b>rapide</b>.' },
      { t: 35, d: 4.8, say: 'C’est le principe de l’alternateur. Sur un vélo, la dynamo tourne avec la roue et allume la lampe.', sub: 'C’est l’<b>alternateur</b>. Sur un vélo, la <b>dynamo</b> tourne avec la roue et allume la lampe.' },
      { t: 40, d: 6.2, say: 'Dans une centrale, comme au barrage de Soubré, l’eau fait tourner une turbine, qui fait tourner l’aimant d’un énorme alternateur.', sub: 'Dans une centrale, comme au <b>barrage de Soubré</b>, l’eau fait tourner une <b>turbine</b> et l’aimant d’un énorme alternateur.' },
      { t: 46.4, d: 6, say: 'Il tourne cinquante fois par seconde : la tension du secteur a une fréquence de cinquante hertz.', sub: 'Il fait <b>50 tours par seconde</b> : la tension du secteur a une fréquence de <b>50 Hz</b>.' },
      { t: 53, d: 5, say: 'À retenir : un aimant qui bouge près d’une bobine crée une tension.', sub: 'À retenir : un aimant qui <b>bouge</b> près d’une bobine <b>crée une tension</b>.' },
      { t: 58.2, d: 4.8, say: 'Quand il tourne, la tension est alternative : elle change de signe à chaque demi-tour.', sub: 'S’il <b>tourne</b>, la tension est <b>alternative</b> : elle change de signe.' },
      { t: 63.2, d: 4.6, say: 'Sa fréquence est égale au nombre de tours par seconde.', sub: 'Sa <b>fréquence</b> = le nombre de <b>tours par seconde</b>.' }
    ],
    learn: [
      { t: 10, ch: 1, html: 'Un aimant <b>qui bouge</b> près d’une bobine crée une tension.' },
      { t: 28, ch: 2, html: 'S’il <b>tourne</b>, la tension est <b>alternative</b> : elle change de signe.' },
      { t: 33, ch: 2, html: 'Plus il tourne vite, plus la tension est <b>grande</b> et plus elle oscille <b>vite</b>.' },
      { t: 48, ch: 3, html: 'Un <b>alternateur</b> produit la tension du secteur : <b>50 Hz</b>.' }
    ],
    question: { q: 'Un alternateur (aimant à 2 pôles) fait 50 tours par seconde. Quelle est la fréquence de la tension produite ?', o: ['25 Hz', '50 Hz', '100 Hz', '0 Hz'], a: 1, e: 'Un tour = une période : 50 tours par seconde donnent 50 périodes par seconde, soit 50 Hz.' },
    scene: resumeScene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Montage : un aimant (à faire tourner par un moteur ou à déplacer à la main) devant une bobine reliée à un voltmètre à zéro central et à un oscilloscope',
    steps: [
      'Choisis « Aimant à la main » et fais glisser l’aimant vers la bobine, puis éloigne-le. Observe l’aiguille et l’oscilloscope.',
      'Passe en « Aimant qui tourne » et règle la vitesse n du moteur (tours par seconde).',
      'Règle l’oscilloscope (V/div et ms/div) pour bien voir une ou deux périodes. Utilise la loupe pour lire les divisions.',
      'Dans l’onglet Mesures, lis la hauteur d’une crête et la durée d’une période, puis relève. Recommence pour plusieurs vitesses et plusieurs bobines.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { id: 'sim', mode: 'hand', n: 25, N: 500, sens: 2, sweep: 10 }), st = lab.st, rows = [];
      var c = api.c;
      var cM = c.seg({ label: 'L’aimant', value: 'hand', options: [{ v: 'hand', l: 'Aimant à la main' }, { v: 'rot', l: 'Aimant qui tourne' }], onChange: function (v) { st.mode = v; sN.hide(v !== 'rot'); st.hist = []; lab.draw(); api.say(v === 'rot' ? 'Le moteur fait tourner l’aimant : regarde la courbe sur l’oscilloscope.' : 'Attrape l’aimant (flèches orange) et fais-le glisser vers la bobine.'); } });
      var sN = c.slider({ label: 'Vitesse du moteur n', min: 0, max: 80, step: 1, value: st.n, unit: 'tr/s', onInput: function (v) { st.n = v; lab.draw(); } });
      sN.hide(true);
      var cT = c.seg({ label: 'Bobine', value: 500, options: [{ v: 250, l: '250 spires' }, { v: 500, l: '500 spires' }, { v: 1000, l: '1000 spires' }], onChange: function (v) { st.N = v; lab.draw(); } });
      var cS = c.seg({ label: 'Oscilloscope : sensibilité', value: 2, options: [{ v: 1, l: '1 V/div' }, { v: 2, l: '2 V/div' }, { v: 5, l: '5 V/div' }], onChange: function (v) { st.sens = v; lab.draw(); } });
      var cW = c.seg({ label: 'Oscilloscope : balayage', value: 10, options: [{ v: 2, l: '2 ms/div' }, { v: 5, l: '5 ms/div' }, { v: 10, l: '10 ms/div' }, { v: 20, l: '20 ms/div' }], onChange: function (v) { st.sweep = v; lab.draw(); } });
      var ro = api.readouts([{ k: 'n', label: 'Vitesse n' }, { k: 'N', label: 'Bobine' }, { k: 'u', label: 'Tension U (voltmètre)' }, { k: 'x', label: S.prof.level === 'dec' ? 'U max · fréquence f' : 'Lecture' }]);
      var dragNoted = false;
      api.loop(function (dt) {
        lab.step(dt);
        ro.n.set(st.mode === 'rot' ? st.n + ' tr/s' : 'à la main'); ro.N.set(st.N + ' spires'); ro.u.set((st.U >= 0 ? '+' : '−') + fmt(Math.abs(st.U), 1) + ' V');
        ro.x.set(S.prof.level === 'dec' && st.mode === 'rot' && st.n > 0 ? fmt(lab.Umax(), 1) + ' V · ' + st.n + ' Hz' : st.mode === 'rot' ? 'sur l’écran' : '—');
        if (!dragNoted && st.mode === 'hand' && Math.abs(st.U) > 1.5) { dragNoted = true; api.say('L’aiguille dévie : l’aimant en mouvement crée une tension ! Essaie de l’éloigner, puis de l’approcher plus vite.', 'ok'); api.sound('pop'); }
      });

      /* lecture de l'oscilloscope et relevés */
      var M = api.measure; M.innerHTML = '<h3>Je lis l’oscilloscope</h3>';
      var rd = api.h('div', { class: 'read' }, M);
      var l1 = api.h('label', {}, rd, 'Hauteur d’une crête (div)'), i1 = api.h('input', { type: 'number', step: '0.1', min: '0', max: '4', inputmode: 'decimal' }, l1);
      var l2 = api.h('label', {}, rd, 'Durée d’une période (div)'), i2 = api.h('input', { type: 'number', step: '0.1', min: '0', max: '10', inputmode: 'decimal' }, l2);
      var calc = api.h('p', { style: 'margin:8px 0;font-size:13px;color:var(--muted)' }, M, '');
      var br = api.h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, M);
      var bAuto = api.h('button', { class: 'btn sm' }, br, 'Lire pour moi'); var bRec = api.h('button', { class: 'btn sm primary' }, br, 'Vérifier et relever');
      var mmsg = api.h('div', { class: 'msg', 'aria-live': 'polite' }, M);
      var tbl = api.h('div', { style: 'margin-top:10px' }, M);
      function truth() { return { cr: lab.Umax() / st.sens, pe: st.n > 0 ? (1000 / st.n) / st.sweep : Infinity }; }
      function upd() { var a = parseFloat(String(i1.value).replace(',', '.')), b = parseFloat(String(i2.value).replace(',', '.')); calc.innerHTML = 'U max = ' + (isNaN(a) ? '…' : fmt(a, 1)) + ' div × ' + st.sens + ' V/div = <b>' + (isNaN(a) ? '…' : fmt(a * st.sens, 1)) + ' V</b> · T = ' + (isNaN(b) ? '…' : fmt(b, 1)) + ' div × ' + st.sweep + ' ms/div = <b>' + (isNaN(b) ? '…' : fmt(b * st.sweep, 0)) + ' ms</b>'; }
      i1.oninput = upd; i2.oninput = upd; upd();
      function paintAuto() { bAuto.style.display = S.prof.level === 'dec' ? '' : 'none'; }
      paintAuto();
      bAuto.onclick = function () { var tr = truth(); i1.value = fmt(tr.cr, 1).replace(',', '.'); i2.value = fmt(tr.pe, 1).replace(',', '.'); upd(); };
      bRec.onclick = function () {
        if (st.mode !== 'rot' || st.n === 0) { say2('Fais tourner l’aimant (mode « Aimant qui tourne », vitesse non nulle) pour obtenir une courbe stable.', 'warn'); return; }
        var tr = truth();
        if (tr.cr > 4.05) { say2('La courbe sort de l’écran : choisis une sensibilité plus grande (V/div).', 'warn'); return; }
        if (tr.pe > 10) { say2('Il n’y a pas une période entière à l’écran : choisis un balayage plus grand (ms/div).', 'warn'); return; }
        var a = parseFloat(String(i1.value).replace(',', '.')), b = parseFloat(String(i2.value).replace(',', '.'));
        if (isNaN(a) || isNaN(b)) { say2('Écris d’abord tes deux lectures (en divisions). Astuce : utilise la loupe ×3.', 'warn'); return; }
        var tol = S.prof.level === 'exp' ? 0.2 : 0.3;
        var ea = Math.abs(a - tr.cr), eb = Math.abs(b - tr.pe);
        if (ea > tol || eb > tol) { say2((ea > tol ? 'Ta lecture de la crête s’écarte de ' + fmt(ea, 1) + ' div. ' : '') + (eb > tol ? 'Ta lecture de la période s’écarte de ' + fmt(eb, 1) + ' div. ' : '') + 'Compte les grands carreaux, puis les petits traits (1 petit trait = 0,2 div).', 'bad'); api.sound('bad'); return; }
        var Um = a * st.sens, T = b * st.sweep;
        rows.push({ n: st.n, N: st.N, um: Um, T: T, f: 1000 / T });
        say2('Bien lu ! U max = ' + fmt(Um, 1) + ' V, T = ' + fmt(T, 0) + ' ms donc f = 1/T = ' + fmt(1000 / T, 0) + ' Hz.', 'ok'); api.sound('ok');
        i1.value = ''; i2.value = ''; upd(); paint();
        if (rows.length >= 4) api.done();
      };
      function say2(t, cl) { mmsg.className = 'msg ' + (cl || ''); mmsg.innerHTML = t; }
      var cc = api.chart; var chSel = 'f';
      function paint() {
        api.count(rows.length);
        tbl.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>n (tr/s)</th><th>N</th><th>U max (V)</th><th>T (ms)</th><th>f (Hz)</th><th></th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr><td>' + r.n + '</td><td>' + r.N + '</td><td>' + fmt(r.um, 1) + '</td><td>' + fmt(r.T, 0) + '</td><td>' + fmt(r.f, 0) + '</td><td><button data-i="' + i + '" aria-label="Supprimer">×</button></td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure pour l’instant.</div>';
        tbl.querySelectorAll('button[data-i]').forEach(function (b) { b.onclick = function () { rows.splice(+b.dataset.i, 1); paint(); }; });
        cc.innerHTML = '';
        var hd = api.h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px' }, cc, '<h3 style="margin:0">Courbe</h3>');
        var sg = api.h('div', { class: 'seg' }, hd);
        [['f', 'f = g(n)'], ['u', 'U max = g(n)']].forEach(function (o) { var b = api.h('button', { 'aria-pressed': chSel === o[0], style: 'min-height:32px;font-size:12px' }, sg, o[1]); b.onclick = function () { chSel = o[0]; paint(); }; });
        var box = api.h('div', {}, cc);
        if (chSel === 'f') S.chart(box, { xlabel: 'n (tr/s)', ylabel: 'f (Hz)', xmin: 0, xmax: 80, xstep: 20, ymin: 0, ymax: 80, ystep: 20, series: [{ color: 'var(--blue)', pts: rows.map(function (r) { return [r.n, r.f]; }), fit: true }] });
        else S.chart(box, { xlabel: 'n (tr/s)', ylabel: 'U max (V)', xmin: 0, xmax: 80, xstep: 20, ymin: 0, ymax: 16, ystep: 4, series: [250, 500, 1000].map(function (N, i) { return { color: ['var(--green)', 'var(--amber)', 'var(--violet)'][i], pts: rows.filter(function (r) { return r.N === N; }).map(function (r) { return [r.n, r.um]; }), fit: true }; }) });
        if (chSel === 'u') api.h('p', { style: 'margin:6px 0 0;font-size:12px;color:var(--muted)' }, cc, '<span style="color:var(--green)">●</span> 250 spires · <span style="color:var(--amber)">●</span> 500 spires · <span style="color:var(--violet)">●</span> 1000 spires');
      }
      paint();
      api.onReset(function () { st.mode = 'hand'; st.n = 25; st.N = 500; st.sens = 2; st.sweep = 10; st.x = 120; st.hist = []; cM.set('hand'); sN.set(25); sN.hide(true); cT.set(500); cS.set(2); cW.set(10); rows = []; paint(); dragNoted = false; });
      api.say('Attrape l’aimant (flèches orange) et fais-le glisser vers la bobine.');
      return {
        enter: paintAuto,
        bilan: function () {
          if (rows.length < 2) return '<p>Relève au moins 2 mesures dans l’onglet Mesures (vitesses différentes).</p>';
          var k = 0; rows.forEach(function (r) { k += r.f / r.n; }); k /= rows.length;
          var h = '<p>Rapport f ÷ n moyen : <b>' + fmt(k, 2) + '</b> ≈ 1 → <b>la fréquence est égale au nombre de tours par seconde</b>.</p>';
          var byN = {}; rows.forEach(function (r) { (byN[r.N] = byN[r.N] || []).push(r); });
          Object.keys(byN).forEach(function (N) { var rs = byN[N]; if (rs.length >= 2) { var a = 0; rs.forEach(function (r) { a += r.um / r.n; }); a /= rs.length; h += '<p>' + N + ' spires : U max ÷ n ≈ <b>' + fmt(a, 3) + ' V par tr/s</b> → U max est proportionnelle à la vitesse.</p>'; } });
          if (Object.keys(byN).length >= 2) h += '<p>Avec plus de spires, la tension est plus grande pour une même vitesse.</p>';
          return h;
        }
      };
    }
  };

  /* ================== DÉFI ================== */
  function miniLab(api, opts) {
    var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Montage aimant, bobine, voltmètre et oscilloscope' }, api.root);
    var G = api.s('g', {}, sv), lab = Lab(G, opts);
    api.loop(function (dt) { lab.step(dt); });
    return lab;
  }
  var DEFI = {
    title: 'Le défi de l’alternateur',
    intro: 'Cinq missions pour devenir ingénieur d’une centrale : produire une tension, régler la fréquence du secteur et lire l’oscilloscope. Le chrono tourne !',
    missions: [
      { title: 'Première étincelle', text: 'Fais dévier l’aiguille du voltmètre d’au moins <span style="color:var(--amber)">3 V</span> avec l’aimant, puis valide.', lumi: 'Attrape l’aimant par ses flèches orange et fais-le bouger vite vers la bobine !', hint: 'C’est le mouvement qui compte : un aimant immobile ne donne rien. Approche-le d’un coup sec.',
        build: function (api) { var lab = miniLab(api, { id: 'd1', mode: 'hand', N: 500, sens: 2 }); lab.st.maxU = 0; return function () { return lab.st.maxU >= 3 ? { ok: true, msg: 'Le mouvement de l’aimant a créé une tension de ' + fmt(lab.st.maxU, 1) + ' V.' } : { ok: false, msg: 'Pas assez : ' + fmt(lab.st.maxU, 1) + ' V seulement. Plus vite !' }; }; },
        e: 'Un aimant qui bouge près d’une bobine crée une tension.' },
      { type: 'qcm', title: 'L’aimant immobile', text: 'L’aimant reste immobile tout contre la bobine. Que montre le voltmètre ?', o: ['0 V : il faut que l’aimant bouge', 'Une tension constante', 'Une tension alternative', 'La tension maximale'], a: 0, hint: 'Repense au chapitre 1 du résumé…', e: 'Sans mouvement de l’aimant, il n’y a pas de tension.' },
      { title: 'La fréquence du secteur', text: 'Règle le moteur pour produire une tension de fréquence <span style="color:var(--amber)">50 Hz</span>, comme le secteur. Lis l’oscilloscope (5 ms/div) !', lumi: 'Le curseur ne montre pas la vitesse : à toi de lire la période sur l’écran.', hint: '50 Hz → T = 1/50 s = 20 ms. À 5 ms par division, une période doit occuper 4 divisions.',
        build: function (api) {
          var lab = miniLab(api, { id: 'd3', mode: 'rot', n: 20, N: 500, sens: 5, sweep: 5 });
          var sl = api.c.slider({ label: 'Vitesse du moteur', min: 10, max: 80, step: 1, value: 20, fmt: function (v) { return S.prof.level === 'dec' ? v + ' tr/s' : '?'; }, onInput: function (v) { lab.st.n = v; } });
          return function () { var n = lab.st.n; return Math.abs(n - 50) <= 1 ? { ok: true, msg: 'Une période = 4 divisions × 5 ms = 20 ms : f = 50 Hz, l’aimant fait 50 tours par seconde.' } : { ok: false, msg: 'Ta tension est à ' + n + ' Hz. Compte les divisions d’une période : il en faut 4.' }; };
        }, e: 'f = 50 Hz correspond à T = 20 ms : 4 divisions à 5 ms/div.' },
      { title: 'Juste la bonne tension', text: 'Obtiens une tension maximale de <span style="color:var(--amber)">6 V</span> (± 0,3 V) en réglant la bobine et la vitesse.', lumi: 'Plus de spires ou plus de vitesse : la tension grandit. Lis la hauteur d’une crête (2 V/div).', hint: '6 V à 2 V/div : la crête doit monter à 3 divisions. Exemple : 500 spires et 50 tr/s.',
        build: function (api) {
          var lab = miniLab(api, { id: 'd4', mode: 'rot', n: 30, N: 250, sens: 2, sweep: 10 });
          var k = S.prof.level === 'dec';
          api.c.seg({ label: 'Bobine', value: 250, options: [{ v: 250, l: '250 spires' }, { v: 500, l: '500' }, { v: 1000, l: '1000' }], onChange: function (v) { lab.st.N = v; } });
          api.c.slider({ label: 'Vitesse du moteur', min: 10, max: 80, step: 1, value: 30, unit: 'tr/s', onInput: function (v) { lab.st.n = v; } });
          return function () { var u = lab.Umax(); return Math.abs(u - 6) <= 0.3 ? { ok: true, msg: 'U max = ' + fmt(u, 1) + ' V : la crête monte à 3 divisions de 2 V.' } : { ok: false, msg: 'U max = ' + (k ? fmt(u, 1) + ' V' : 'pas encore 6 V') + '. Regarde la hauteur de la crête : il faut 3 divisions.' }; };
        }, e: 'À 2 V/div, 6 V correspondent à 3 divisions ; par exemple 500 spires à 50 tr/s.' },
      { type: 'qcm', title: 'Lecture express', text: 'Une période occupe 4 divisions, avec un balayage de 5 ms/div. Quelle est la fréquence ?', o: ['20 Hz', '50 Hz', '200 Hz', '4 Hz'], a: 1, hint: 'T = 4 × 5 ms. Puis f = 1 / T (avec T en secondes).', e: 'T = 4 × 5 = 20 ms = 0,02 s, donc f = 1 / 0,02 = 50 Hz.' }
    ]
  };

  /* ================== LEÇON ================== */
  S.start({
    inquiry: {"situation": "Une tension varie au cours du temps. Quels indices permettent de la distinguer d’une tension continue ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-tension-alternative', level: '4e', theme: 'Courants et tensions alternatifs', title: 'Production d’une tension alternative', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Quand un aimant <b>bouge</b> près d’une bobine (ou une bobine près d’un aimant), une <b>tension</b> apparaît aux bornes de la bobine. Sans mouvement, pas de tension.',
      'Quand l’aimant <b>tourne</b> devant la bobine, la tension change de signe à chaque demi-tour : c’est une <b>tension alternative</b>. Visualisée à l’oscilloscope, elle est <b>sinusoïdale</b>.',
      'Un <b>alternateur</b> (dynamo de vélo, centrale électrique) produit une tension alternative en faisant tourner un aimant devant des bobines.',
      'Pour un aimant à deux pôles, la <b>fréquence f</b> (en hertz) est égale au <b>nombre de tours par seconde</b>. La tension maximale augmente avec la vitesse et le nombre de spires.',
      'Lecture à l’oscilloscope : <b>U max = nombre de divisions × sensibilité (V/div)</b> ; <b>T = nombre de divisions × balayage (ms/div)</b> ; <b>f = 1 / T</b>.'
    ],
    quiz: [
      { q: 'Que faut-il pour produire une tension avec un aimant et une bobine ?', o: ['Que l’aimant soit très gros', 'Que l’aimant bouge par rapport à la bobine', 'Que la bobine soit chaude', 'Qu’il y ait une pile'], a: 1, e: 'C’est le mouvement relatif de l’aimant et de la bobine qui crée la tension.' },
      { q: 'Une tension alternative est une tension qui…', o: ['reste toujours positive', 'change de signe au cours du temps', 'est toujours nulle', 'augmente sans arrêt'], a: 1, e: 'Elle est tantôt positive, tantôt négative.' },
      { q: 'Un alternateur fait 30 tours par seconde (aimant à 2 pôles). La fréquence de la tension est :', o: ['15 Hz', '30 Hz', '60 Hz', '3 Hz'], a: 1, e: 'f = nombre de tours par seconde = 30 Hz.' },
      { q: 'Sur l’oscilloscope (2 V/div), une crête monte à 2,5 divisions. U max vaut :', o: ['2,5 V', '4,5 V', '5 V', '0,8 V'], a: 2, e: 'U max = 2,5 div × 2 V/div = 5 V.' },
      { q: 'Si l’aimant tourne deux fois plus vite :', o: ['f et U max doublent', 'seule f double', 'rien ne change', 'f est divisée par 2'], a: 0, e: 'La fréquence double, et la tension maximale aussi (elle est proportionnelle à la vitesse).' }
    ]
  });
})();

