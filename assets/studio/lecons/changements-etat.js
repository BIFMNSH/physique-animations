/* 6e · Propriétés physiques de la matière · Leçon : Les changements d’état de l’eau */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var QI = 5, QF = 80, QL = 100, QV = 540, QMAX = QI + QF + QL + QV;
  function state(Q) {
    Q = Math.max(0, Math.min(QMAX, Q));
    if (Q < QI) return { T: -10 + Q / QI * 10, ice: 1, vap: 0, k: 'solide' };
    if (Q < QI + QF) return { T: 0, ice: 1 - (Q - QI) / QF, vap: 0, k: 'fusion' };
    if (Q < QI + QF + QL) return { T: Q - QI - QF, ice: 0, vap: 0, k: 'liquide' };
    return { T: 100, ice: 0, vap: (Q - QI - QF - QL) / QV, k: Q >= QMAX ? 'gaz' : 'ebullition' };
  }
  var NAME = { solide: 'eau solide (glace)', fusion: 'fusion : glace + eau liquide', liquide: 'eau liquide', ebullition: 'ébullition : eau liquide + vapeur', gaz: 'vapeur d’eau' };

  function Lab(G, o) {
    var st = Object.assign({ Q: 0, P: 0, plate: false, drops: 0, hist: [], tau: 0, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var plateH = s('rect', { x: 140, y: 406, width: 240, height: 16, rx: 5 }, G), plateG = s('rect', { x: 140, y: 398, width: 240, height: 32, rx: 12, fill: TK.glow(G, '#FF5A2E'), opacity: 0 }, G);
    var frost = s('rect', { x: 140, y: 406, width: 240, height: 16, rx: 5, fill: '#80B8FF', opacity: 0 }, G);
    var liq = s('rect', { x: 184, width: 152, fill: '#4FA8FF', opacity: 0.6 }, G);
    var iceG = s('g', {}, G), ICE = [0, 1, 2, 3, 4, 5].map(function (i) { return s('rect', { rx: 5, fill: '#E8F4FF', opacity: 0.9, stroke: '#BFE6FF', 'stroke-width': 1.5 }, iceG); });
    var bub = s('g', {}, G), BU = []; for (var i = 0; i < 18; i++) BU.push(s('circle', { r: 3 + (i % 3) * 2, fill: 'none', stroke: '#E8F4FF', 'stroke-width': 1.8 }, bub));
    var vap = s('g', {}, G), VP = []; for (i = 0; i < 12; i++) VP.push(s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2.2, fill: 'none' }, vap));
    s('path', { d: 'M180 220 V398 q0 6 6 6 H334 q6 0 6 -6 V220', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, G);
    var th = TK.thermometer(G, 420, 150, 220, -20, 110);
    var cold = s('g', {}, G); s('rect', { x: 150, y: 120, width: 220, height: 16, rx: 4, fill: '#9FD7FF', stroke: '#E8F4FF', 'stroke-width': 2 }, cold); s('text', { x: 260, y: 112, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#80B8FF', text: 'plaque froide' }, cold);
    var DR = []; for (i = 0; i < 14; i++) DR.push(s('ellipse', { cx: 160 + i * 15, cy: 141, rx: 4, ry: 5, fill: '#4FA8FF' }, cold));
    var msg = s('text', { x: 260, y: 82, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, G);
    s('text', { x: 260, y: 440, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3', text: 'plaque chauffante / bac de glace' }, G);
    /* ---------- PANNEAU : courbe + cycle ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 18, y: 44, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'TEMPÉRATURE AU COURS DU TEMPS' }, P);
    var GX = PX + 42, GY = 56, GW = 220, GH = 150;
    function gy(T) { return GY + GH - (T + 20) / 130 * GH; }
    s('rect', { x: GX, y: GY, width: GW, height: GH, fill: '#0B1220' }, P);
    [-20, 0, 50, 100].forEach(function (T) { s('line', { x1: GX, x2: GX + GW, y1: gy(T), y2: gy(T), stroke: T === 0 || T === 100 ? '#3B4E73' : '#1A2540', 'stroke-dasharray': T === 0 || T === 100 ? '4 4' : '' }, P); s('text', { x: GX - 6, y: gy(T) + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#A9B4C7', text: T }, P); });
    s('text', { x: GX + GW, y: GY + GH + 14, 'text-anchor': 'end', 'font-size': 10, fill: '#A9B4C7', text: 'temps →' }, P); s('text', { x: GX - 30, y: GY - 4, 'font-size': 10, fill: '#A9B4C7', text: '°C' }, P);
    var curve = s('path', { fill: 'none', stroke: '#FFC773', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, P), dot = s('circle', { r: 4.5, fill: '#FFC773' }, P);
    var pl1 = s('text', { x: GX + 6, y: gy(0) - 5, 'font-size': 9.5, fill: '#80B8FF', text: 'palier de fusion' }, P), pl2 = s('text', { x: GX + 6, y: gy(100) - 5, 'font-size': 9.5, fill: '#FF8A80', text: 'palier d’ébullition' }, P);
    // cycle des changements d’état
    var CY = s('g', {}, P), BX = { S: [PX + 60, 390], L: [PX + 140, 270], G: [PX + 220, 390] };
    [['S', 'SOLIDE', '#E8F4FF'], ['L', 'LIQUIDE', '#4FA8FF'], ['G', 'GAZ', '#C9D2E3']].forEach(function (b) { s('rect', { x: BX[b[0]][0] - 36, y: BX[b[0]][1] - 14, width: 72, height: 28, rx: 14, fill: '#16223A', stroke: b[2], 'stroke-width': 2 }, CY); s('text', { x: BX[b[0]][0], y: BX[b[0]][1] + 5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: b[2], text: b[1] }, CY); });
    var ARR = { fusion: ['S', 'L', -9, 'fusion'], solid: ['L', 'S', -9, 'solidification'], vapo: ['L', 'G', 9, 'vaporisation'], liq: ['G', 'L', 9, 'liquéfaction'] }, AE = {};
    var LBL = { fusion: [PX + 22, 312, 'start'], solid: [PX + 22, 328, 'start'], vapo: [PX + 258, 312, 'end'], liq: [PX + 258, 328, 'end'] };
    Object.keys(ARR).forEach(function (k) { var a = ARR[k], p = BX[a[0]], q = BX[a[1]], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), nx = -dy / L, ny = dx / L, off = a[2]; var x0 = p[0] + dx * 0.3 + nx * off, y0 = p[1] + dy * 0.3 + ny * off, x1 = p[0] + dx * 0.7 + nx * off, y1 = p[1] + dy * 0.7 + ny * off; AE[k] = { p: s('path', { d: K.arrow(x0, y0, x1, y1, 2.5, 7, 10), fill: '#3B4E73' }, CY), t: s('text', { x: LBL[k][0], y: LBL[k][1], 'text-anchor': LBL[k][2], 'font-size': 10.5, 'font-weight': 800, fill: '#5B6680', text: a[3] }, CY) }; });
    var pState = s('text', { x: PX + 140, y: 240, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8' }, P);
    var last = performance.now(), lastRec = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      if (st.t == null) { st.Q = Math.max(0, Math.min(QMAX, st.Q + st.P * dt)); st.tau += dt; if (st.tau - lastRec > 0.2) { lastRec = st.tau; st.hist.push([st.tau, state(st.Q).T]); if (st.hist.length > 600) st.hist.shift(); } }
      var E = state(st.Q), heating = st.P > 0, cooling = st.P < 0;
      plateH.setAttribute('fill', heating ? '#FF5A2E' : '#5B6680'); plateG.setAttribute('opacity', heating ? 0.8 : 0); frost.setAttribute('opacity', cooling ? 0.9 : 0);
      var lvl = (1 - E.ice) * (1 - E.vap) * 110, top = 400 - Math.max(0, lvl);
      attr(liq, { y: top, height: Math.max(0, lvl) });
      ICE.forEach(function (r, k) { var sz = 34 * Math.sqrt(Math.max(0, E.ice)); r.style.display = E.ice > 0.02 ? '' : 'none'; var x = 196 + (k % 3) * 46, y = (E.ice > 0.6 ? 360 : top - sz * 0.6) - Math.floor(k / 3) * 36; attr(r, { x: x + (34 - sz) / 2, y: Math.min(y, 400 - sz), width: sz, height: sz, transform: 'rotate(' + (k * 13 - 20) + ' ' + (x + 17) + ' ' + (y + 17) + ')' }); });
      var boil = E.k === 'ebullition' && heating; BU.forEach(function (b, k) { var ph = (T * 1.4 + k / BU.length) % 1; b.style.display = boil ? '' : 'none'; attr(b, { cx: 196 + (k * 37) % 128, cy: 398 - ph * Math.max(10, lvl - 6), opacity: 1 - ph * 0.5 }); });
      VP.forEach(function (v, k) { var ph = (T * 0.7 + k / VP.length) % 1, on = (E.k === 'ebullition' && heating) || (E.k === 'liquide' && E.T > 60); v.style.display = on ? '' : 'none'; v.setAttribute('transform', 'translate(' + (200 + (k * 41) % 120) + ' ' + (top - 10 - ph * 120) + ')'); v.setAttribute('opacity', (1 - ph) * (E.k === 'liquide' ? 0.4 : 0.9)); });
      cold.style.display = st.plate ? '' : 'none';
      if (st.plate && boil && st.t == null) st.drops = Math.min(1, st.drops + dt / 4);
      DR.forEach(function (d, k) { d.style.display = st.plate && k / DR.length < st.drops ? '' : 'none'; });
      th.set(E.T);
      msg.textContent = NAME[E.k] + ' · ' + fmt(E.T, 0) + ' °C';
      // courbe
      var H = st.hist, tmax = Math.max(30, H.length ? H[H.length - 1][0] : 1), d = '';
      H.forEach(function (p, k) { d += (k ? 'L' : 'M') + (GX + p[0] / tmax * GW).toFixed(1) + ' ' + gy(p[1]).toFixed(1); }); curve.setAttribute('d', d);
      if (H.length) attr(dot, { cx: GX + H[H.length - 1][0] / tmax * GW, cy: gy(H[H.length - 1][1]) }); dot.style.display = H.length ? '' : 'none';
      // cycle
      var act = E.k === 'fusion' ? (heating ? 'fusion' : cooling ? 'solid' : '') : E.k === 'ebullition' && heating ? 'vapo' : '';
      var liqAct = st.plate && st.drops > 0.02 && boil;
      Object.keys(AE).forEach(function (k) { var on = k === act || (k === 'liq' && liqAct); AE[k].p.setAttribute('fill', on ? '#FFC773' : '#3B4E73'); AE[k].t.setAttribute('fill', on ? '#FFC773' : '#5B6680'); });
      pState.textContent = act ? 'En cours : ' + ARR[act][3] + (liqAct ? ' et liquéfaction' : '') : liqAct ? 'En cours : liquéfaction' : NAME[E.k];
      return { E: E, Q: st.Q, drops: st.drops, act: act };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les trois états de l’eau' }, { t: 11, title: 'La fusion' }, { t: 25, title: 'L’eau se réchauffe' }, { t: 33, title: 'L’ébullition' }, { t: 46, title: 'Le chemin inverse' }, { t: 58, title: 'À retenir' }];
  function Qof(t) { if (t < 12) return 0; if (t < 25) return (QI + QF) * K.k(t, 12, 13); if (t < 33) return QI + QF + QL * K.k(t, 25, 8); if (t < 46) return QI + QF + QL + 220 * K.k(t, 33, 13); return QI + QF + QL + 220; }
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’eau existe sous trois états', '<b>solide</b> (glace), <b>liquide</b>, <b>gazeux</b> (vapeur d’eau).', '#4FA8FF'],
      ['<b>Fusion</b> à 0 °C, <b>ébullition</b> à 100 °C', 'pendant un changement d’état, la température reste <b>constante</b> (palier).', '#FFC773'],
      ['Chemin inverse : <b>liquéfaction</b> et <b>solidification</b>', 'la masse se conserve au cours d’un changement d’état.', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.Q = Qof(t); st.P = t > 12 && t < 52.8 ? 1 : 0; st.plate = t > 47; st.drops = K.k(t, 48, 5);
        st.hist = []; for (var u = 12; u <= Math.min(t, 46); u += 0.25) st.hist.push([u - 12, state(Qof(u)).T]);
        if (t > 52.8) { st.P = -1; st.plate = false; st.Q = QI + QF * (1 - 0.7 * K.k(t, 53, 4)); }
        lab.step();
        tg.show(t, 1, 10.6, 260, 92, 'De la glace à −10 °C') || tg.show(t, 13, 24.6, 260, 92, 'La glace fond : la température reste à 0 °C') || tg.show(t, 26, 32.6, 260, 92, 'Toute la glace a fondu : l’eau chauffe') ||
          tg.show(t, 34, 45.6, 260, 92, 'Elle bout : palier à 100 °C') || tg.show(t, 47, 52.6, 260, 92, 'La vapeur se liquéfie sur la plaque froide') || tg.show(t, 53, 57.6, 260, 92, 'Au froid, l’eau se solidifie à 0 °C');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : des glaçons à −10 °C chauffés dans un bécher fondent à 0 °C, l’eau se réchauffe puis bout à 100 °C ; une courbe de température montre les paliers ; une plaque froide recueille des gouttelettes ; un schéma relie solide, liquide et gaz par les noms des changements d’état',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 5.4, say: 'L’eau peut être solide, comme ces glaçons, liquide, ou gazeuse : c’est la vapeur d’eau.', sub: 'Trois états : <b>solide</b>, <b>liquide</b>, <b>gazeux</b>.' },
      { t: 5.6, d: 5.2, say: 'Mettons des glaçons à moins dix degrés sur une plaque chauffante, avec un thermomètre.', sub: 'Des glaçons à −10 °C, une plaque chauffante.' },
      { t: 11, d: 13.4, say: 'La température monte jusqu’à zéro degré, puis la glace fond : c’est la fusion. Tant qu’il reste de la glace, la température ne bouge plus : c’est un palier.', sub: 'La <b>fusion</b> : palier à <b>0 °C</b>.' },
      { t: 25, d: 7.6, say: 'Toute la glace a fondu : l’eau liquide se réchauffe.', sub: 'L’eau liquide se réchauffe.' },
      { t: 33, d: 12.4, say: 'À cent degrés, l’eau bout : de grosses bulles de vapeur se forment. C’est l’ébullition, une vaporisation. La température reste à cent degrés : deuxième palier.', sub: 'L’<b>ébullition</b> : palier à <b>100 °C</b>.' },
      { t: 46, d: 6.6, say: 'Au contact d’une plaque froide, la vapeur redevient liquide : c’est la liquéfaction.', sub: 'La vapeur redevient liquide : <b>liquéfaction</b>.' },
      { t: 52.8, d: 5.2, say: 'Et au congélateur, l’eau liquide redevient glace à zéro degré : c’est la solidification.', sub: 'L’eau redevient glace : <b>solidification</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : l’eau existe sous trois états.', sub: 'Trois états de l’eau.' },
      { t: 62.6, d: 4.2, say: 'Elle fond à zéro degré et bout à cent degrés ; pendant un changement d’état, la température reste constante.', sub: 'Paliers à 0 °C et 100 °C.' },
      { t: 67, d: 5, say: 'Fusion, vaporisation, liquéfaction et solidification : la masse se conserve.', sub: 'La masse se <b>conserve</b>.' }
    ],
    learn: [
      { t: 10, ch: 0, html: 'Trois états : <b>solide</b>, <b>liquide</b>, <b>gazeux</b>.' },
      { t: 24, ch: 1, html: '<b>Fusion</b> (solide → liquide) : palier à 0 °C.' },
      { t: 45, ch: 3, html: '<b>Ébullition</b> (liquide → gaz) : palier à 100 °C.' },
      { t: 57, ch: 4, html: '<b>Liquéfaction</b> (gaz → liquide), <b>solidification</b> (liquide → solide).' }
    ],
    question: { q: 'Pendant que la glace fond, la température :', o: ['augmente', 'diminue', 'reste à 0 °C', 'monte à 100 °C'], a: 2, e: 'C’est le palier de fusion.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [100, 40, 440, 406] }, { n: 'Graphique', r: [560, 22, 280, 424] }],
    alt: 'Bécher de glaçons sur une plaque chauffante ou un bac de glace, avec un thermomètre, une plaque froide optionnelle, la courbe de température au cours du temps et le schéma des changements d’état',
    steps: [
      'Chauffe la glace et observe la courbe de température : que se passe-t-il à 0 °C ?',
      'Continue à chauffer jusqu’à l’ébullition : que se passe-t-il à 100 °C ?',
      'Place la plaque froide au-dessus de l’eau qui bout.',
      'Refroidis l’eau liquide : à quelle température se solidifie-t-elle ?'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cP = c.seg({ label: 'Plaque', value: 0, options: [{ v: 1, l: 'chauffer' }, { v: 0, l: 'arrêt' }, { v: -1, l: 'refroidir' }], onChange: function (v) { st.P = v * 25; } });
      var tP = c.toggle({ label: 'Plaque froide au-dessus', value: false, onChange: function (v) { st.plate = v; if (!v) st.drops = 0; } });
      var r1 = c.row(); c.button({ label: 'Nouveaux glaçons (−10 °C)', sm: true, into: r1, onClick: function () { st.Q = 0; st.hist = []; st.tau = 0; st.drops = 0; } }); c.button({ label: 'Accélérer ×4', sm: true, into: r1, onClick: function () { st.P = st.P ? Math.sign(st.P) * (Math.abs(st.P) > 30 ? 25 : 100) : 0; } });
      var ro = api.readouts([{ k: 't', label: 'Température' }, { k: 'e', label: 'État' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.t.set(fmt(last.E.T, 0) + ' °C'); ro.e.set(last.E.k === 'fusion' ? 'glace + eau' : last.E.k === 'ebullition' ? 'eau qui bout' : last.E.k); });
      var M = api.measure; M.innerHTML = '<h3>Mes relevés</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever maintenant'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ t: st.tau, T: last.E.T, e: NAME[last.E.k] }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Temps</th><th>T</th><th>État</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + fmt(r.t, 0) + ' s</td><td>' + fmt(r.T, 0) + ' °C</td><td>' + r.e + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Les changements d’état</h3><table class="mt"><tbody><tr><td>Fusion</td><td>solide → liquide (0 °C)</td></tr><tr><td>Solidification</td><td>liquide → solide (0 °C)</td></tr><tr><td>Vaporisation</td><td>liquide → gaz (ébullition à 100 °C)</td></tr><tr><td>Liquéfaction</td><td>gaz → liquide</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.Q = 0; st.P = 0; st.plate = false; st.drops = 0; st.hist = []; st.tau = 0; cP.set(0); tP.set(false); rows = []; paint(); });
      api.say('Allume la plaque pour chauffer les glaçons.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Fais au moins 3 relevés au cours du chauffage.</p>';
        return '<p>L’eau existe sous trois états : <b>solide</b> (glace), <b>liquide</b> et <b>gazeux</b> (vapeur d’eau, invisible).</p><p>La glace fond à <b>0 °C</b> : c’est la <b>fusion</b>. L’eau bout à <b>100 °C</b> (au niveau de la mer) : c’est l’<b>ébullition</b>, une vaporisation. Pendant ces changements d’état, la température reste <b>constante</b> : la courbe présente des <b>paliers</b>.</p><p>Au contact d’une paroi froide, la vapeur se <b>liquéfie</b> ; refroidie, l’eau liquide se <b>solidifie</b> à 0 °C. Au cours d’un changement d’état, la masse se conserve.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Changements d’état de l’eau' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function plate(api, lab) { api.c.seg({ label: 'Plaque', value: 0, options: [{ v: 1, l: 'chauffer' }, { v: 0, l: 'arrêt' }, { v: -1, l: 'refroidir' }], onChange: function (v) { lab.st.P = v * 60; } }); }
  var DEFI = {
    title: 'Le défi de la glace',
    intro: 'Fais fondre, bouillir, condenser… et lis la courbe !',
    missions: [
      { title: 'Glace et eau', text: 'Obtiens un mélange de <b>glace et d’eau liquide</b>, puis arrête la plaque.', lumi: 'Regarde le palier sur la courbe.', hint: 'Chauffe, puis arrête quand les glaçons ont à moitié fondu.',
        build: function (api) { var lab = mini(api, {}); plate(api, lab); return function () { var r = lab.res(); return r.E.k === 'fusion' && r.E.ice > 0.1 && r.E.ice < 0.9 && lab.st.P === 0 ? { ok: true, msg: 'Glace + eau : on est à 0 °C, sur le palier de fusion.' } : { ok: false, msg: r.E.k === 'fusion' ? 'Arrête la plaque pendant la fusion.' : 'État actuel : ' + NAME[r.E.k] + '.' }; }; },
        e: 'Pendant la fusion, glace et eau liquide coexistent à 0 °C.' },
      { type: 'qcm', title: 'Vocabulaire', text: 'Le passage de l’état solide à l’état liquide s’appelle :', o: ['la solidification', 'la fusion', 'la liquéfaction', 'l’ébullition'], a: 1, hint: 'La glace qui fond…', e: 'C’est la fusion.' },
      { title: 'À ébullition', text: 'Fais <span style="color:#FF8A80">bouillir</span> l’eau.', lumi: 'Il faut atteindre le deuxième palier.', hint: 'Chauffe jusqu’à 100 °C.',
        build: function (api) { var lab = mini(api, { Q: 120 }); plate(api, lab); return function () { var r = lab.res(); return r.E.k === 'ebullition' && lab.st.P > 0 ? { ok: true, msg: 'Elle bout à 100 °C !' } : { ok: false, msg: 'Température : ' + fmt(r.E.T, 0) + ' °C.' }; }; },
        e: 'L’eau bout à 100 °C : c’est l’ébullition.' },
      { type: 'qcm', title: 'Le palier', text: 'Pendant l’ébullition, si on continue de chauffer, la température :', o: ['augmente sans cesse', 'reste à 100 °C', 'redescend à 0 °C', 'devient négative'], a: 1, hint: 'Regarde la courbe.', e: 'Elle reste constante : c’est un palier.' },
      { title: 'Gouttelettes', text: 'Fais apparaître des <b>gouttelettes</b> par liquéfaction de la vapeur.', lumi: 'La vapeur doit rencontrer une surface froide.', hint: 'Fais bouillir l’eau et place la plaque froide.',
        build: function (api) { var lab = mini(api, { Q: 180 }); plate(api, lab); api.c.toggle({ label: 'Plaque froide', value: false, onChange: function (v) { lab.st.plate = v; } }); return function () { var r = lab.res(); return r.drops > 0.3 ? { ok: true, msg: 'La vapeur se liquéfie sur la plaque froide.' } : { ok: false, msg: 'Pas encore de gouttelettes.' }; }; },
        e: 'Au contact d’une paroi froide, la vapeur d’eau se liquéfie.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un récipient contient de l’eau que l’on chauffe puis refroidit. Quels changements d’état peut-on prévoir ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-changements-etat', level: '6e', theme: 'Propriétés physiques de la matière', title: 'Les changements d’état de l’eau', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’eau existe sous trois états : <b>solide</b> (glace), <b>liquide</b> et <b>gazeux</b> (vapeur d’eau, invisible).',
      'Les changements d’état : <b>fusion</b> (solide → liquide), <b>solidification</b> (liquide → solide), <b>vaporisation</b> (liquide → gaz), <b>liquéfaction</b> (gaz → liquide).',
      'La glace fond à <b>0 °C</b> ; l’eau bout à <b>100 °C</b> (au niveau de la mer).',
      'Pendant un changement d’état d’un corps pur, la température reste <b>constante</b> : la courbe présente un <b>palier</b>.',
      'Au cours d’un changement d’état, la <b>masse se conserve</b> (le volume, lui, peut changer : la glace occupe plus de place que l’eau liquide).'
    ],
    quiz: [
      { q: 'La vapeur d’eau est :', o: ['solide', 'liquide', 'gazeuse', 'visible'], a: 2, e: 'C’est l’état gazeux, invisible.' },
      { q: 'La solidification est le passage :', o: ['liquide → solide', 'solide → liquide', 'gaz → liquide', 'liquide → gaz'], a: 0, e: 'L’eau devient glace.' },
      { q: 'L’eau pure bout à :', o: ['0 °C', '37 °C', '100 °C', '50 °C'], a: 2, e: 'Au niveau de la mer.' },
      { q: 'La buée sur une vitre froide vient de :', o: ['la fusion', 'la liquéfaction de la vapeur d’eau', 'la solidification', 'l’ébullition'], a: 1, e: 'La vapeur d’eau de l’air se refroidit au contact de la vitre froide et se liquéfie en fines gouttelettes : la buée.' },
      { q: 'Quand la glace fond, sa masse :', o: ['augmente', 'diminue', 'reste la même', 'devient nulle'], a: 2, e: 'La masse se conserve.' }
    ]
  });
})();

