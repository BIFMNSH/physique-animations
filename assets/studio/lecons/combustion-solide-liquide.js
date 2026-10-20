/* 6e · Les combustions · Leçon : Combustion d’un solide et d’un liquide dans l’air */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, C = window.CombKit;
  var DUR = { 1: 4, 2: 8 }, JAR = { 1: { w: 120, h: 150, n: 'petite cloche' }, 2: { w: 176, h: 230, n: 'grande cloche' } };
  var FUELS = { bougie: { n: 'bougie (paraffine)', e: 'solide', p: 'dioxyde de carbone + eau' }, charbon: { n: 'charbon de bois', e: 'solide', p: 'surtout du dioxyde de carbone' }, alcool: { n: 'lampe à alcool', e: 'liquide', p: 'dioxyde de carbone + eau' }, petrole: { n: 'lampe à pétrole', e: 'liquide', p: 'dioxyde de carbone + eau' } };
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }

  function flame(G, gl) {
    var g = s('g', {}, G), halo = s('ellipse', { fill: gl }, g), out = s('path', { fill: '#FFB547' }, g), mid = s('path', { fill: '#FFE08A' }, g), blue = s('path', { fill: '#4FA8FF', opacity: 0.85 }, g);
    function shape(w, h) { return 'M0 ' + (-h) + ' C' + w + ' ' + (-h * 0.45) + ' ' + w + ' 0 0 0 C' + (-w) + ' 0 ' + (-w) + ' ' + (-h * 0.45) + ' 0 ' + (-h) + 'Z'; }
    return { set: function (x, y, k, T, type) {
      if (k <= 0.02) { g.style.display = 'none'; return; } g.style.display = '';
      var f = 1 + 0.08 * Math.sin(T * 17) + 0.05 * Math.sin(T * 29), w = 9 * k, h = 40 * k * f, bl = type === 'bleue';
      g.setAttribute('transform', 'translate(' + x + ' ' + y + ') skewX(' + (2 * Math.sin(T * 7)) + ')');
      attr(halo, { cy: -h * 0.45, rx: w * 3.2, ry: h * 0.9, opacity: bl ? 0.25 : 0.6 });
      out.setAttribute('d', shape(w, h)); out.setAttribute('fill', bl ? '#7FB8FF' : '#FFB547'); out.setAttribute('opacity', bl ? 0.7 : 1);
      mid.setAttribute('d', shape(w * 0.55, h * 0.62)); mid.setAttribute('fill', bl ? '#CFE6FF' : '#FFE08A');
      blue.setAttribute('d', shape(w * 0.5, h * 0.2)); } };
  }
  function candle(G, x, yb, h) { var g = s('g', {}, G); s('ellipse', { cx: x, cy: yb, rx: 26, ry: 6, fill: '#3A4458' }, g); s('rect', { x: x - 12, y: yb - h, width: 24, height: h, rx: 3, fill: '#F4EBDD' }, g); s('ellipse', { cx: x, cy: yb - h, rx: 12, ry: 3.5, fill: '#FFFDF6' }, g); s('line', { x1: x, y1: yb - h, x2: x, y2: yb - h - 8, stroke: '#2A2A2A', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g); return g; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'cloche', jar: 1, cov: 0, covering: false, el: 0, glass: 0, glassDown: false, buee: 0, lime: 0, pouring: false, shk: 0, fuel: 'bougie', t: null }, o || {});
    var GL = C.glow(G, '#FFB547', 0.7);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 400, width: 500, height: 46, fill: '#151D2E' }, G);
    /* ---------- CLOCHE ---------- */
    var A = s('g', {}, G); s('rect', { x: 170, y: 394, width: 240, height: 8, rx: 3, fill: '#5B6478' }, A);
    candle(A, 290, 394, 90); var fA = flame(A, GL), smA = [0, 1, 2, 3].map(function () { return s('path', { d: 'M0 0 q6 -10 0 -20 q-6 -10 0 -20', stroke: '#9AA6BC', 'stroke-width': 2, fill: 'none' }, A); });
    var bell = s('path', { fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, A), knob = s('circle', { r: 8, fill: '#BFE6FF' }, A);
    var aMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, A);
    var chrono = s('g', {}, A); s('rect', { x: 430, y: 130, width: 92, height: 60, rx: 12, fill: '#EEF2F8' }, chrono); s('text', { x: 476, y: 150, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A3426', text: 'DURÉE' }, chrono); var chT = s('text', { x: 476, y: 180, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#1A1F28' }, chrono);
    /* ---------- PRODUITS ---------- */
    var B = s('g', {}, G); candle(B, 160, 400, 80); var fB = flame(B, GL);
    var glass = s('g', {}, B); s('path', { d: 'M-46 0 V-90 q0 -6 6 -6 H40 q6 0 6 6 V0', fill: '#9FD7FF', 'fill-opacity': 0.06, stroke: '#BFE6FF', 'stroke-width': 3 }, glass);
    var fog = s('rect', { x: -43, y: -93, width: 86, height: 60, fill: '#E6F2FF', opacity: 0 }, glass), drops = s('g', {}, glass), DR = [];
    for (var i = 0; i < 26; i++) DR.push(s('circle', { cx: -38 + rnd(i, 1) * 76, cy: -88 + rnd(i, 2) * 56, r: 1.6 + rnd(i, 3) * 2.4, fill: '#DDF0FF' }, drops));
    s('text', { x: 0, y: -104, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'verre froid et sec' }, glass);
    var fls = [[350, 'air', 'flacon d’air'], [470, 'brule', 'après la bougie']].map(function (f) { var g = s('g', {}, B), x = f[0]; s('path', { d: 'M' + (x - 14) + ' 220 V250 L' + (x - 46) + ' 330 V384 q0 10 10 10 H' + (x + 36) + ' q10 0 10 -10 V330 L' + (x + 14) + ' 250 V220', fill: '#9FD7FF', 'fill-opacity': 0.06, stroke: '#BFE6FF', 'stroke-width': 3 }, g); var liq = s('rect', { x: x - 43, width: 86, fill: '#DDEFFF' }, g); s('text', { x: x, y: 414, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: f[2] }, g); if (f[1] === 'brule') { s('line', { x1: x, y1: 200, x2: x, y2: 330, stroke: '#9AA6BC', 'stroke-width': 2 }, g); s('rect', { x: x - 5, y: 330, width: 10, height: 18, fill: '#F4EBDD' }, g); } var pour = s('path', { stroke: '#DDEFFF', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, g); return { liq: liq, pour: pour, x: x, k: f[1] }; });
    var bMsg = s('text', { x: 290, y: 434, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#C9D2E3' }, B);
    s('text', { x: 410, y: 190, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'test à l’eau de chaux' }, B);
    /* ---------- COMBUSTIBLES ---------- */
    var Cg = s('g', {}, G), FG = {};
    FG.bougie = s('g', {}, Cg); candle(FG.bougie, 290, 394, 110);
    FG.charbon = s('g', {}, Cg); s('path', { d: 'M210 394 L226 320 H354 L370 394 Z', fill: '#4A5160', stroke: '#6B7280', 'stroke-width': 2 }, FG.charbon); s('rect', { x: 268, y: 350, width: 44, height: 30, rx: 4, fill: '#1A1F28' }, FG.charbon);
    var emb = [], embG = s('ellipse', { cx: 290, cy: 316, rx: 66, ry: 18, fill: C.glow(G, '#FF7A2E'), opacity: 0.9 }, FG.charbon); for (i = 0; i < 9; i++) emb.push(s('path', { d: 'M-12 0 q2 -10 10 -10 q6 -6 12 0 q6 2 4 10z', transform: 'translate(' + (236 + i * 13.5) + ' ' + (322 - (i % 2) * 6) + ')', fill: '#2A1A12', stroke: '#FF7A2E', 'stroke-width': 1.5 }, FG.charbon));
    FG.alcool = s('g', {}, Cg); s('path', { d: 'M240 394 q-6 -60 30 -70 h40 q36 10 30 70 z', fill: '#BFE6FF', 'fill-opacity': 0.18, stroke: '#BFE6FF', 'stroke-width': 3 }, FG.alcool); s('path', { d: 'M244 394 q-2 -36 10 -46 h72 q12 10 10 46 z', fill: '#B9DDFF', opacity: 0.45 }, FG.alcool); s('rect', { x: 278, y: 306, width: 24, height: 20, rx: 3, fill: '#9AA6BC' }, FG.alcool); s('line', { x1: 290, y1: 306, x2: 290, y2: 296, stroke: '#EEE', 'stroke-width': 3 }, FG.alcool);
    FG.petrole = s('g', {}, Cg); s('ellipse', { cx: 290, cy: 372, rx: 60, ry: 24, fill: '#C0392B' }, FG.petrole); s('ellipse', { cx: 290, cy: 364, rx: 58, ry: 18, fill: '#E5484D' }, FG.petrole); s('path', { d: 'M262 348 q-8 -56 6 -96 h44 q14 40 6 96z', fill: '#FFF2C8', 'fill-opacity': 0.12, stroke: '#EEF2F8', 'stroke-width': 3 }, FG.petrole); s('path', { d: 'M266 250 h48 M262 346 h56', stroke: '#C0392B', 'stroke-width': 6, 'stroke-linecap': 'round' }, FG.petrole); s('path', { d: 'M250 246 q40 -50 80 0', fill: 'none', stroke: '#9AA6BC', 'stroke-width': 3 }, FG.petrole);
    var fC = flame(Cg, GL), fC2 = flame(Cg, GL), fC3 = flame(Cg, GL);
    var cName = s('text', { x: 290, y: 160, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#EEF2F8' }, Cg), cSt = s('text', { x: 290, y: 186, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800 }, Cg);
    var cMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, Cg);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'BILAN D’UNE COMBUSTION' }, P);
    var eq = [['combustible', '#FFB547', 82], ['+ dioxygène', '#FF8A80', 106], ['↓', '#A9B4C7', 132], ['dioxyde de carbone', '#C9D2E3', 158], ['+ eau', '#80C8FF', 182]].map(function (e) { return s('text', { x: PX + 140, y: e[2], 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: e[1], text: e[0] }, P); });
    s('line', { x1: PX + 24, x2: PX + 256, y1: 202, y2: 202, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var gT = s('text', { x: PX + 20, y: 230, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), gB = s('rect', { x: PX + 20, y: 240, width: 240, height: 16, rx: 8, fill: '#1A2540' }, P), gF = s('rect', { x: PX + 20, y: 240, height: 16, rx: 8, fill: '#FF8A80' }, P), gV = s('text', { x: PX + 260, y: 230, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 900, fill: '#FF8A80' }, P);
    var pq = [0, 1, 2, 3, 4].map(function (k) { return s('text', { x: PX + 140, y: 300 + k * 24, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'cloche' ? '' : 'none'; B.style.display = st.mode === 'produits' ? '' : 'none'; Cg.style.display = st.mode === 'combustibles' ? '' : 'none';
      var gauge = st.mode === 'cloche'; [gT, gB, gF, gV].forEach(function (e) { e.style.display = gauge ? '' : 'none'; });
      eq[4].setAttribute('opacity', st.mode === 'combustibles' && st.fuel === 'charbon' ? 0.3 : 1); eq[0].textContent = st.mode === 'combustibles' ? FUELS[st.fuel].n.replace(/ \(.*\)/, '') : 'combustible';
      if (st.mode === 'cloche') {
        if (st.t == null) { st.cov = st.covering ? Math.min(1, st.cov + dt / 0.8) : Math.max(0, st.cov - dt / 0.8); if (st.cov >= 1) st.el += dt; else if (st.cov <= 0) st.el = 0; }
        var J = JAR[st.jar], dur = DUR[st.jar], covered = st.cov >= 1, out = covered && st.el >= dur, u = covered ? Math.min(1, st.el / dur) : 0;
        var yb = 392, yt = yb - J.h - (1 - st.cov) * 180, x0 = 290 - J.w / 2, r = 26;
        bell.setAttribute('d', 'M' + x0 + ' ' + (yt + J.h) + ' V' + (yt + r) + ' q0 -' + r + ' ' + r + ' -' + r + ' H' + (x0 + J.w - r) + ' q' + r + ' 0 ' + r + ' ' + r + ' V' + (yt + J.h)); attr(knob, { cx: 290, cy: yt - 6 });
        var k = out ? 0 : 1 - 0.75 * u * u; fA.set(290, 296, k, T, 'jaune');
        smA.forEach(function (sm, i) { var ph = (T * 0.7 + i / 4) % 1; sm.style.display = out ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (290 + i * 5 - 8) + ' ' + (294 - ph * 50) + ')'); sm.setAttribute('opacity', (1 - ph) * 0.8); });
        var o2 = 21 - 5 * u; attr(gF, { width: 240 * o2 / 21 }); gV.textContent = fmt(o2, 0) + ' %'; gT.textContent = covered ? 'dioxygène sous la cloche' : 'dioxygène dans l’air';
        chT.textContent = covered ? fmt(Math.min(st.el, dur), 1) + ' s' : '—';
        aMsg.textContent = !covered ? (st.cov > 0 ? 'On pose la ' + J.n + '…' : 'La bougie brûle à l’air libre') : out ? 'La flamme s’éteint après ' + dur + ' s : plus assez de dioxygène' : 'Sous la ' + J.n + ', la flamme faiblit…';
        pset(['La bougie consomme le dioxygène', 'de l’air enfermé.', 'Plus la cloche est grande,', 'plus il y a de dioxygène :', 'la bougie brûle plus longtemps.']);
        res = { covered: covered, out: out, jar: st.jar, el: st.el, dur: dur };
      } else if (st.mode === 'produits') {
        if (st.t == null) { st.glass = st.glassDown ? Math.min(1, st.glass + dt / 0.8) : Math.max(0, st.glass - dt / 0.8); if (st.glass >= 1) st.buee = Math.min(1, st.buee + dt / 3); else if (st.glass <= 0) st.buee = Math.max(0, st.buee - dt / 4); if (st.pouring) { st.lime = Math.min(1, st.lime + dt / 1.2); if (st.lime >= 1) st.shk = Math.min(2.5, st.shk + dt); } }
        fB.set(160, 312, 1, T, 'jaune');
        glass.setAttribute('transform', 'translate(160 ' + (190 + st.glass * 90) + ')');
        fog.setAttribute('opacity', st.buee * 0.35); DR.forEach(function (d, i) { d.setAttribute('opacity', Math.max(0, Math.min(1, st.buee * 1.6 - rnd(i, 4) * 0.6))); });
        var tr = st.lime >= 1 ? Math.min(1, st.shk / 2) : 0, lh = 40 * st.lime;
        fls.forEach(function (f) { attr(f.liq, { y: 394 - lh, height: lh }); var m = f.k === 'brule' ? tr : 0; f.liq.setAttribute('fill', m > 0.05 ? '#F4F6FA' : '#DDEFFF'); f.liq.setAttribute('opacity', 0.35 + 0.6 * m); f.pour.setAttribute('d', 'M' + (f.x + 4) + ' 196 V' + (394 - lh)); f.pour.setAttribute('opacity', st.lime > 0 && st.lime < 1 ? 0.8 : 0);
          f.liq.setAttribute('transform', st.lime >= 1 && st.shk < 2 ? 'translate(' + (2 * Math.sin(T * 30)) + ' 0)' : ''); });
        bMsg.textContent = st.buee > 0.5 && tr > 0.5 ? 'Buée : de l’eau. Eau de chaux troublée : du dioxyde de carbone.' : st.buee > 0.5 ? 'De la buée se forme : la combustion produit de l’eau' : tr > 0.5 ? 'L’eau de chaux se trouble : du dioxyde de carbone !' : st.lime > 0 ? 'On verse l’eau de chaux et on agite…' : 'Quels produits la combustion forme-t-elle ?';
        pset(['Buée sur le verre froid :', 'la combustion produit de l’eau.', 'Eau de chaux troublée :', 'elle produit du dioxyde de carbone.', 'L’air seul ne la trouble pas.']);
        res = { buee: st.buee, trouble: tr };
      } else {
        Object.keys(FG).forEach(function (k2) { FG[k2].style.display = k2 === st.fuel ? '' : 'none'; });
        var F = FUELS[st.fuel]; cName.textContent = F.n; cSt.textContent = 'combustible ' + F.e; cSt.setAttribute('fill', F.e === 'solide' ? '#FFB547' : '#80C8FF');
        if (st.fuel === 'bougie') { fC.set(290, 274, 1.1, T, 'jaune'); fC2.set(0, 0, 0); fC3.set(0, 0, 0); }
        else if (st.fuel === 'charbon') { fC.set(262, 314, 0.35, T, 'jaune'); fC2.set(300, 312, 0.45, T + 1, 'jaune'); fC3.set(326, 316, 0.3, T + 2, 'jaune'); embG.setAttribute('opacity', 0.7 + 0.25 * Math.sin(T * 3)); emb.forEach(function (e, i) { e.setAttribute('stroke-opacity', 0.5 + 0.5 * Math.sin(T * 2 + i)); }); }
        else if (st.fuel === 'alcool') { fC.set(290, 296, 1, T, 'bleue'); fC2.set(0, 0, 0); fC3.set(0, 0, 0); }
        else { fC.set(290, 336, 1.05, T, 'jaune'); fC2.set(0, 0, 0); fC3.set(0, 0, 0); }
        cMsg.textContent = 'Produits : ' + F.p;
        pset(st.fuel === 'charbon' ? ['Le charbon de bois est presque', 'du carbone pur : il rougeoie', 'et produit surtout du', 'dioxyde de carbone.', ''] : F.e === 'liquide' ? ['Un liquide (alcool, pétrole)', 'brûle grâce à une mèche.', 'Il faut toujours :', 'un combustible + du dioxygène', '+ une source de chaleur.'] : ['La paraffine fond, monte', 'dans la mèche et brûle.', 'Il faut toujours :', 'un combustible + du dioxygène', '+ une source de chaleur.']);
        res = { fuel: st.fuel };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La bougie' }, { t: 10, title: 'Sous la cloche' }, { t: 26, title: 'De l’eau' }, { t: 36, title: 'Du dioxyde de carbone' }, { t: 46, title: 'Solides et liquides' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Une combustion a besoin de <b>dioxygène</b>', 'sous une cloche, la bougie s’éteint quand il en manque.', '#FF8A80'],
      ['Elle <b>consomme</b> un combustible et du dioxygène', 'bougie, charbon de bois, alcool, pétrole…', '#FFB547'],
      ['Elle <b>produit</b> du dioxyde de carbone et de l’eau', 'eau de chaux troublée · buée sur un verre froid.', '#80C8FF']], [57.2, 61.4, 65.8]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 10) { st.mode = 'combustibles'; st.fuel = 'bougie'; }
        else if (t < 26) { st.mode = 'cloche'; if (t < 16.4) { st.jar = 1; st.cov = K.k(t, 10.6, 0.9); st.el = Math.max(0, t - 11.5); } else { st.jar = 2; st.cov = K.k(t, 16.6, 0.9); st.el = Math.max(0, t - 17.5); } }
        else if (t < 36) { st.mode = 'produits'; st.glass = K.k(t, 27, 1); st.buee = K.k(t, 28.2, 4); st.lime = 0; st.shk = 0; }
        else if (t < 46) { st.mode = 'produits'; st.glass = 1 - K.k(t, 36, 0.8); st.buee = 1 - K.k(t, 36.8, 2); st.lime = K.k(t, 37.5, 1.5); st.shk = Math.max(0, t - 39.5); }
        else { st.mode = 'combustibles'; st.fuel = t < 49.6 ? 'charbon' : t < 53.2 ? 'alcool' : 'petrole'; }
        lab.step();
        tg.show(t, 1, 9.6, 290, 92, 'De quoi la flamme a-t-elle besoin ?') || tg.show(t, 12, 16.2, 290, 92, 'Petite cloche : éteinte en 4 s') || tg.show(t, 18, 25.6, 290, 92, 'Grande cloche : éteinte en 8 s') ||
          tg.show(t, 29, 35.6, 290, 92, 'De la buée : de l’eau !') || tg.show(t, 40, 45.6, 290, 92, 'L’eau de chaux se trouble') || tg.show(t, 47, 56.6, 290, 92, st.fuel === 'charbon' ? 'Un solide : le charbon de bois' : 'Un liquide : ' + (st.fuel === 'alcool' ? 'l’alcool' : 'le pétrole'));
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une bougie allumée ; une petite puis une grande cloche posées sur la bougie, qui s’éteint après 4 puis 8 secondes ; un verre froid tenu au-dessus de la flamme se couvre de buée ; de l’eau de chaux versée dans un flacon où une bougie a brûlé se trouble, pas dans un flacon d’air ; enfin du charbon de bois, une lampe à alcool et une lampe à pétrole qui brûlent',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 9.6, say: 'Le soir, quand le courant est coupé, on allume une bougie. Mais de quoi la flamme a-t-elle besoin pour brûler ?', sub: 'De quoi la flamme a-t-elle <b>besoin</b> ?' },
      { t: 10, d: 6.2, say: 'Posons une petite cloche sur la bougie : la flamme faiblit, puis s’éteint au bout de quatre secondes.', sub: 'Petite cloche : la bougie s’<b>éteint</b>.' },
      { t: 16.4, d: 9.4, say: 'Sous une grande cloche, elle brûle deux fois plus longtemps. La bougie consomme le dioxygène de l’air enfermé : quand il en manque, elle s’éteint.', sub: 'La combustion <b>consomme le dioxygène</b>.' },
      { t: 26, d: 9.6, say: 'Tenons un verre froid et sec au-dessus de la flamme : de la buée apparaît. La combustion produit de l’eau.', sub: 'Buée : la combustion produit de l’<b>eau</b>.' },
      { t: 36, d: 9.8, say: 'Versons de l’eau de chaux dans un flacon où une bougie a brûlé, et agitons : elle se trouble. La combustion produit du dioxyde de carbone. Dans l’air seul, elle reste limpide.', sub: 'L’eau de chaux se trouble : du <b>dioxyde de carbone</b>.' },
      { t: 46, d: 10.6, say: 'Le charbon de bois du fourneau est un combustible solide. L’alcool et le pétrole de la lampe tempête sont des combustibles liquides. Tous brûlent dans l’air en consommant du dioxygène.', sub: 'Combustibles <b>solides</b> et <b>liquides</b>.' },
      { t: 57, d: 4.2, say: 'À retenir : une combustion a besoin de dioxygène.', sub: 'Il faut du <b>dioxygène</b>.' },
      { t: 61.4, d: 4.2, say: 'Elle consomme un combustible et du dioxygène.', sub: 'Combustible + dioxygène.' },
      { t: 65.8, d: 5.2, say: 'Et elle produit du dioxyde de carbone et de l’eau.', sub: '→ dioxyde de carbone + eau.' }
    ],
    learn: [
      { t: 25, ch: 1, html: 'Sous une cloche, la bougie s’éteint : elle consomme le <b>dioxygène</b>.' },
      { t: 35, ch: 2, html: 'Buée sur un verre froid : il se forme de l’<b>eau</b>.' },
      { t: 45, ch: 3, html: 'Eau de chaux troublée : il se forme du <b>dioxyde de carbone</b>.' },
      { t: 56, ch: 4, html: 'Combustibles solides (bougie, charbon) et liquides (alcool, pétrole).' }
    ],
    question: { q: 'Sous une cloche, la bougie s’éteint car :', o: ['il fait trop chaud', 'il n’y a plus assez de dioxygène', 'la cire est finie', 'il y a trop de vapeur d’eau'], a: 1, e: 'Le dioxygène enfermé est consommé.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Trois activités : une bougie que l’on recouvre d’une petite ou d’une grande cloche avec un chronomètre et la jauge de dioxygène ; un verre froid au-dessus d’une flamme et le test de l’eau de chaux sur deux flacons ; plusieurs combustibles solides et liquides qui brûlent ; le bilan de la combustion à droite',
    steps: [
      'Cloche : recouvre la bougie. Combien de temps brûle-t-elle ?',
      'Compare avec la grande cloche.',
      'Produits : mets le verre froid, puis fais le test de l’eau de chaux.',
      'Combustibles : observe un solide et un liquide.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'cloche', options: [{ v: 'cloche', l: 'Sous la cloche' }, { v: 'produits', l: 'Les produits' }, { v: 'combustibles', l: 'Les combustibles' }], onChange: function (v) { st.mode = v; vis(); } });
      var cJ = c.seg({ label: 'Cloche', value: '1', options: [{ v: '1', l: 'petite' }, { v: '2', l: 'grande' }], onChange: function (v) { st.jar = +v; st.covering = false; st.cov = 0; st.el = 0; } });
      var bJ = c.button({ label: 'Poser / retirer la cloche', primary: true, onClick: function () { st.covering = !st.covering; } });
      var bG = c.button({ label: 'Verre froid au-dessus / retirer', primary: true, onClick: function () { st.glassDown = !st.glassDown; } });
      var bL = c.button({ label: 'Verser l’eau de chaux et agiter', sm: true, onClick: function () { if (st.lime >= 1) { st.lime = 0; st.shk = 0; st.pouring = false; } else st.pouring = true; } });
      var cF = c.seg({ label: 'Combustible', value: 'bougie', options: [{ v: 'bougie', l: 'bougie' }, { v: 'charbon', l: 'charbon de bois' }, { v: 'alcool', l: 'alcool' }, { v: 'petrole', l: 'pétrole' }], onChange: function (v) { st.fuel = v; } });
      function vis() { var m = st.mode; cJ.hide(m !== 'cloche'); bJ.style.display = m === 'cloche' ? '' : 'none'; bG.style.display = bL.style.display = m === 'produits' ? '' : 'none'; cF.hide(m !== 'combustibles'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Mesure' }, { k: 'b', label: 'Observation' }]), last = {};
      function obs() { if (st.mode === 'cloche') return last.covered ? (last.out ? 'éteinte après ' + last.dur + ' s' : 'brûle depuis ' + fmt(last.el, 1) + ' s') : 'brûle à l’air libre'; if (st.mode === 'produits') return (last.buee > 0.5 ? 'buée ' : '') + (last.trouble > 0.5 ? 'eau de chaux troublée' : '') || '—'; return FUELS[st.fuel].e; }
      api.loop(function () { last = lab.step(); ro.a.set(st.mode === 'cloche' ? JAR[st.jar].n : st.mode === 'produits' ? 'produits de la combustion' : FUELS[st.fuel].n); ro.b.set(obs()); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ e: st.mode === 'cloche' ? 'bougie sous la ' + JAR[st.jar].n : st.mode === 'produits' ? 'verre froid / eau de chaux' : FUELS[st.fuel].n, o: obs() }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Mettre en évidence les produits</h3><table class="mt"><thead><tr><th>Produit</th><th>Test</th><th>Résultat</th></tr></thead><tbody><tr><td>Eau</td><td>verre froid et sec</td><td>buée</td></tr><tr><td>Dioxyde de carbone</td><td>eau de chaux</td><td>se trouble</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'cloche', jar: 1, cov: 0, covering: false, el: 0, glass: 0, glassDown: false, buee: 0, lime: 0, pouring: false, shk: 0, fuel: 'bougie' }); cM.set('cloche'); cJ.set('1'); cF.set('bougie'); vis(); rows = []; paint(); });
      api.say('Pose la cloche sur la bougie et observe la flamme.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Une combustion a besoin d’un <b>combustible</b>, de <b>dioxygène</b> (le comburant) et d’une source de chaleur pour démarrer. Sous une cloche, la bougie s’éteint quand le dioxygène enfermé vient à manquer ; plus la cloche est grande, plus elle brûle longtemps.</p><p>La combustion de la bougie, de l’alcool ou du pétrole produit de l’<b>eau</b> (buée sur un verre froid) et du <b>dioxyde de carbone</b> (il trouble l’eau de chaux).</p><p><b>combustible + dioxygène → dioxyde de carbone + eau</b></p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Combustion d’un solide et d’un liquide' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de la flamme',
    intro: 'Bougie, charbon, lampe à pétrole : perce les secrets de la combustion !',
    missions: [
      { title: 'Le plus longtemps', text: 'Recouvre la bougie avec la cloche qui la fera brûler <b>le plus longtemps</b>, et attends qu’elle s’éteigne.', lumi: 'Plus d’air, plus de dioxygène…', hint: 'La grande cloche.',
        build: function (api) { var lab = mini(api, { mode: 'cloche' }), st = lab.st; api.c.seg({ label: 'Cloche', value: '1', options: [{ v: '1', l: 'petite' }, { v: '2', l: 'grande' }], onChange: function (v) { st.jar = +v; st.covering = false; st.cov = 0; st.el = 0; } }); api.c.button({ label: 'Poser / retirer la cloche', sm: true, onClick: function () { st.covering = !st.covering; } }); return function () { var r = lab.res(); return r.out && r.jar === 2 ? { ok: true, msg: 'Éteinte après 8 s : deux fois plus de dioxygène.' } : r.out ? { ok: false, msg: 'Elle s’est éteinte vite : essaie l’autre cloche.' } : { ok: false, msg: r.covered ? 'Attends qu’elle s’éteigne…' : 'Pose une cloche.' }; }; },
        e: 'La grande cloche contient plus de dioxygène.' },
      { type: 'qcm', title: 'Pourquoi ?', text: 'La bougie s’éteint sous la cloche parce que :', o: ['le dioxygène est consommé', 'la mèche est mouillée', 'le diazote brûle', 'la cloche est froide'], a: 0, hint: 'Que consomme une combustion ?', e: 'La combustion consomme le dioxygène.' },
      { title: 'L’eau cachée', text: 'Montre que la combustion de la bougie produit de l’<span style="color:#80C8FF">eau</span>.', lumi: 'Un verre froid au-dessus de la flamme…', hint: 'Pose le verre froid et attends.',
        build: function (api) { var lab = mini(api, { mode: 'produits' }); api.c.button({ label: 'Verre froid au-dessus / retirer', sm: true, onClick: function () { lab.st.glassDown = !lab.st.glassDown; } }); api.c.button({ label: 'Verser l’eau de chaux', sm: true, onClick: function () { lab.st.pouring = true; } }); return function () { var r = lab.res(); return r.buee > 0.8 ? { ok: true, msg: 'De la buée : c’est de l’eau !' } : { ok: false, msg: r.trouble > 0.5 ? 'Ça, c’est le test du dioxyde de carbone.' : 'Pas encore assez de buée.' }; }; },
        e: 'Buée sur un verre froid = eau.' },
      { title: 'Le gaz invisible', text: 'Montre que la combustion produit du <b>dioxyde de carbone</b>.', lumi: 'Quel réactif se trouble ?', hint: 'L’eau de chaux.',
        build: function (api) { var lab = mini(api, { mode: 'produits' }); api.c.button({ label: 'Verre froid au-dessus / retirer', sm: true, onClick: function () { lab.st.glassDown = !lab.st.glassDown; } }); api.c.button({ label: 'Verser l’eau de chaux et agiter', sm: true, onClick: function () { lab.st.pouring = true; } }); return function () { var r = lab.res(); return r.trouble > 0.8 ? { ok: true, msg: 'L’eau de chaux se trouble : du dioxyde de carbone.' } : { ok: false, msg: r.buee > 0.5 ? 'La buée montre l’eau, pas le dioxyde de carbone.' : 'Fais le bon test.' }; }; },
        e: 'Le dioxyde de carbone trouble l’eau de chaux.' },
      { type: 'qcm', title: 'Quel état ?', text: 'Le pétrole d’une lampe tempête est un combustible :', o: ['solide', 'liquide', 'gazeux', 'ce n’est pas un combustible'], a: 1, hint: 'On le verse dans la lampe.', e: 'Le pétrole est un combustible liquide.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On compare la combustion de combustibles solides et liquides. Quelles observations permettent de caractériser les transformations ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-combustion-solide-liquide', level: '6e', theme: 'Les combustions', title: 'Combustion d’un solide et d’un liquide', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une combustion a besoin d’un <b>combustible</b> (bougie, charbon de bois, alcool, pétrole…), de <b>dioxygène</b> (le comburant) et d’une source de chaleur pour démarrer.',
      'Une combustion <b>consomme</b> le combustible et le dioxygène : sous une cloche, la bougie s’éteint quand le dioxygène vient à manquer.',
      'La combustion de la bougie, de l’alcool ou du pétrole produit du <b>dioxyde de carbone</b> et de l’<b>eau</b>.',
      'L’eau se met en évidence par la <b>buée</b> sur un verre froid et sec ; le dioxyde de carbone <b>trouble l’eau de chaux</b>.',
      'Bilan : <b>combustible + dioxygène → dioxyde de carbone + eau</b>.'
    ],
    quiz: [
      { q: 'Le gaz de l’air nécessaire à une combustion est :', o: ['le diazote', 'le dioxygène', 'le dioxyde de carbone', 'la vapeur d’eau'], a: 1, e: 'Le dioxygène est le comburant.' },
      { q: 'Sous une grande cloche, la bougie brûle :', o: ['moins longtemps', 'plus longtemps', 'aussi longtemps', 'indéfiniment'], a: 1, e: 'Il y a plus de dioxygène.' },
      { q: 'Le dioxyde de carbone se reconnaît car il :', o: ['rallume une bûchette', 'trouble l’eau de chaux', 'forme de la buée', 'sent le soufre'], a: 1, e: 'Il trouble l’eau de chaux.' },
      { q: 'La buée sur un verre froid au-dessus d’une flamme montre la formation :', o: ['de dioxygène', 'd’eau', 'de diazote', 'de fumée'], a: 1, e: 'C’est de l’eau.' },
      { q: 'Un combustible solide :', o: ['l’alcool', 'le pétrole', 'le charbon de bois', 'le butane'], a: 2, e: 'Le charbon de bois est solide.' }
    ]
  });
})();

