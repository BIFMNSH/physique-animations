/* 5e · Mélanges et réactions chimiques · Leçon : Les mélanges */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var WATER = '#5FA8E8';
  var MIX = {
    sable: { n: 'eau + sable', hom: false, ph: 2, gr: { c: '#C8A46A', n: 46, r: 4, settle: 1 }, cloud: 0.08 },
    boue: { n: 'eau boueuse', hom: false, ph: 2, gr: { c: '#8B6B3D', n: 110, r: 1.8, settle: 0.55 }, cloud: 0.55 },
    huile: { n: 'eau + huile', hom: false, ph: 2, oil: true, cloud: 0 },
    sel: { n: 'eau salée', hom: true, ph: 1, sol: 'sel', cloud: 0 },
    sucre: { n: 'eau sucrée', hom: true, ph: 1, sol: 'sucre', cloud: 0 },
    alcool: { n: 'eau + alcool', hom: true, ph: 1, sol: 'alcool', cloud: 0 }
  };
  var TECH = { dec: 'Décantation', fil: 'Filtration', evap: 'Évaporation', dist: 'Distillation', amp: 'Ampoule à décanter' };
  /* résultat : niveau (2 = séparation réussie, 1 = partielle, 0 = échec) et explication */
  function result(m, t) {
    var M = MIX[m];
    if (t === 'dec') return M.oil ? [1, 'L’huile remonte au-dessus de l’eau : 2 couches.', 'Pour les récupérer, utilise l’ampoule à décanter.'] : M.gr ? (M.gr.settle > 0.9 ? [2, 'Le sable tombe au fond : on peut verser l’eau.', 'La décantation sépare les solides lourds.'] : [1, 'Une partie de la boue tombe, l’eau reste trouble.', 'Il faut ensuite filtrer.']) : [0, 'Rien ne se dépose : le mélange est homogène.', 'La décantation ne sépare rien ici.'];
    if (t === 'fil') return M.gr ? [2, 'Le filtre retient les particules :', 'le filtrat est limpide.'] : M.oil ? [0, 'L’huile traverse le filtre avec l’eau.', 'La filtration ne sépare pas deux liquides.'] : [0, 'Le filtrat est limpide… mais toujours ' + (M.sol === 'sel' ? 'salé' : M.sol === 'sucre' ? 'sucré' : 'alcoolisé') + ' !', 'Le corps dissous traverse le filtre.'];
    if (t === 'evap') return M.sol === 'alcool' ? [0, 'L’eau et l’alcool s’évaporent tous les deux.', 'Il ne reste rien dans la capsule.'] : M.oil ? [1, 'L’eau s’évapore, l’huile reste.', 'Mais on perd l’eau.'] : [2, 'L’eau s’évapore, il reste ' + (M.sol === 'sel' ? 'des cristaux de sel' : M.sol === 'sucre' ? 'des cristaux de sucre' : 'le dépôt solide') + '.', 'On récupère le solide, mais on perd l’eau.'];
    if (t === 'dist') return M.oil ? [1, 'L’eau distille, l’huile reste dans le ballon.', ''] : M.sol === 'alcool' ? [2, 'L’alcool bout en premier : on le récupère', 'dans le tube (distillat).'] : [2, 'La vapeur d’eau se condense : eau pure (distillat).', 'Le ' + (M.sol || 'solide') + ' reste dans le ballon.'];
    if (t === 'amp') return M.oil ? [2, 'On fait couler l’eau, on ferme le robinet :', 'l’huile reste dans l’ampoule.'] : [0, 'Tout s’écoule ensemble : une seule phase.', 'L’ampoule sépare deux liquides non miscibles.'];
  }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); k = Math.max(0, Math.min(1, k)); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }
  var GID = 0;
  function glow(G, col) { var id = 'mx' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mix: 'sable', tech: 'dec', p: 0, run: false, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 410, width: 500, height: 36, fill: '#151D2E' }, G);
    var stage = s('g', {}, G), title = s('text', { x: 290, y: 70, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#EEF2F8' }, G);
    var key = '', R = null;
    /* contenu d’un récipient rectangulaire : liquide, trouble, grains, huile, dépôt */
    function vessel(g, x, y0, w, y1, opt) {
      var o2 = { g: s('g', {}, g) }, cp = 'cv' + (GID++), cl = s('clipPath', { id: cp }, s('defs', {}, g)); o2.clip = s('rect', { x: x, y: y0, width: w, height: y1 - y0 }, cl);
      var in2 = s('g', { 'clip-path': 'url(#' + cp + ')' }, o2.g);
      o2.liq = s('rect', { x: x, width: w }, in2); o2.oil = s('rect', { x: x, width: w, fill: '#F2C94C', opacity: 0.85 }, in2);
      o2.dep = s('rect', { x: x, width: w }, in2); o2.gr = []; o2.dr = [];
      for (var i = 0; i < 110; i++) o2.gr.push(s('circle', {}, in2));
      for (i = 0; i < 18; i++) o2.dr.push(s('ellipse', { fill: '#F2C94C', opacity: 0.9 }, in2));
      o2.x = x; o2.w = w; o2.y1 = y1; o2.y0 = y0;
      o2.set = function (M, level, settle, opt3) {
        opt3 = opt3 || {}; var top = y1 - (y1 - y0) * level, liqH = y1 - top;
        var clear = opt3.clear, cloud = clear ? 0 : M.cloud * (1 - (M.gr ? M.gr.settle * settle * 0.6 : 0));
        attr(o2.liq, { y: top, height: Math.max(0, liqH), fill: mixc(WATER, '#8B6B3D', cloud * 1.3), opacity: level > 0.001 ? 0.55 : 0 });
        var oilH = M.oil && !opt3.noOil ? liqH * 0.28 * (opt3.oilOnly ? 3.5 : 1) : 0;
        if (opt3.oilOnly) { attr(o2.oil, { y: y1 - Math.min(liqH, (y1 - y0) * 0.3), height: Math.min(liqH, (y1 - y0) * 0.3) }); } else attr(o2.oil, { y: top, height: settle > 0.6 ? oilH * Math.min(1, (settle - 0.6) / 0.3) : 0 });
        var dropsOn = M.oil && !opt3.noOil && !opt3.oilOnly && settle < 0.9;
        o2.dr.forEach(function (d, i) { d.style.display = dropsOn && level > 0.05 ? '' : 'none'; var yy = top + 8 + rnd(i, 1) * (liqH - 16); yy = yy + (top + 6 - yy) * Math.min(1, settle * 1.4); attr(d, { cx: x + 8 + rnd(i, 2) * (w - 16), cy: yy, rx: 6 + rnd(i, 3) * 6, ry: 4 + rnd(i, 4) * 3 }); });
        var depH = opt3.dep || 0; attr(o2.dep, { y: y1 - depH, height: depH, fill: opt3.depCol || '#C8A46A' });
        o2.gr.forEach(function (c, i) {
          var show = M.gr && !clear && i < M.gr.n && level > 0.02 && !opt3.noGr; c.style.display = show ? '' : 'none'; if (!show) return;
          var sett = Math.min(1, settle * (rnd(i, 5) < M.gr.settle ? 1 : 0.15) * (0.7 + rnd(i, 6) * 0.6));
          var ys = top + 6 + rnd(i, 7) * Math.max(4, liqH - 12), yb = y1 - 3 - rnd(i, 8) * 10;
          attr(c, { cx: x + 5 + rnd(i, 9) * (w - 10), cy: ys + (yb - ys) * sett, r: M.gr.r * (0.7 + rnd(i, 10) * 0.6), fill: M.gr.c });
        });
      };
      return o2;
    }
    function beakerOutline(g, x, y0, w, y1) { s('path', { d: 'M' + (x - 6) + ' ' + y0 + ' V' + y1 + ' q0 6 6 6 H' + (x + w) + ' q6 0 6 -6 V' + y0, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3, opacity: 0.9 }, g); }
    function burner(g, x, y) { s('rect', { x: x - 22, y: y, width: 44, height: 30, rx: 5, fill: '#5B6680' }, g); var f = s('g', {}, g); s('path', { d: 'M' + x + ' ' + (y - 4) + ' q16 -18 0 -40 q-16 22 0 40z', fill: '#4FC3FF' }, f); s('path', { d: 'M' + x + ' ' + (y - 6) + ' q7 -10 0 -22 q-7 12 0 22z', fill: '#E8F4FF' }, f); return f; }
    function crystals(g, x, y, w, n, col) { var a = []; for (var i = 0; i < n; i++) a.push(s('rect', { x: x + rnd(i, 11) * w, y: y - rnd(i, 12) * 8, width: 4 + rnd(i, 13) * 4, height: 4 + rnd(i, 13) * 4, fill: col, transform: 'rotate(45 ' + (x + rnd(i, 11) * w + 3) + ' ' + (y - rnd(i, 12) * 8 + 3) + ')' }, g)); return a; }
    function build() {
      while (stage.firstChild) stage.removeChild(stage.firstChild); R = {};
      var g = stage, t = st.tech;
      if (t === 'dec') { R.v = vessel(g, 210, 150, 160, 396); beakerOutline(g, 210, 140, 160, 396); }
      if (t === 'fil') {
        R.src = vessel(g, 80, 220, 90, 300); beakerOutline(g, 80, 210, 90, 300);
        s('path', { d: 'M230 120 L350 120 L298 220 V250 H282 V220Z', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, g);
        R.fp = s('path', { d: 'M238 124 L342 124 L290 214Z', fill: '#F2EBD3', opacity: 0.9 }, g); R.fl = s('path', { fill: WATER, opacity: 0.55 }, g); R.res = s('path', { fill: '#C8A46A' }, g); R.fo = s('path', { fill: '#F2C94C', opacity: 0.85 }, g);
        R.drop = s('circle', { cx: 290, r: 4, fill: WATER }, g);
        R.v = vessel(g, 240, 300, 100, 396); beakerOutline(g, 240, 290, 100, 396);
        s('text', { x: 290, y: 106, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'entonnoir + papier filtre' }, g); s('text', { x: 400, y: 360, 'font-size': 11, fill: '#A9B4C7', text: 'filtrat' }, g);
      }
      if (t === 'evap') {
        R.v = vessel(g, 192, 238, 196, 288); s('path', { d: 'M190 240 Q290 330 390 240', fill: 'none', stroke: '#DCE3EE', 'stroke-width': 4 }, g);
        var cpe = 'ce' + (GID++), ce = s('clipPath', { id: cpe }, s('defs', {}, g)); s('path', { d: 'M192 242 Q290 328 388 242Z' }, ce); R.v.g.setAttribute('clip-path', 'url(#' + cpe + ')'); R.fire = burner(g, 290, 360); s('path', { d: 'M220 300 L208 392 M360 300 L372 392 M190 300 H390', stroke: '#7D89A3', 'stroke-width': 4 }, g);
        R.cr = crystals(g, 244, 280, 92, 26, '#FFFFFF'); R.steam = [0, 1, 2].map(function () { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2, fill: 'none' }, g); });
        s('text', { x: 290, y: 232, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'capsule' }, g);
      }
      if (t === 'dist') {
        s('circle', { cx: 150, cy: 300, r: 62, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, g); s('path', { d: 'M138 240 V200 H162 V240', fill: '#0F1729', stroke: '#BFE6FF', 'stroke-width': 3 }, g);
        R.v = vessel(g, 92, 250, 116, 360);
        var cpb = 'cb' + (GID++), cb = s('clipPath', { id: cpb }, s('defs', {}, g)); s('circle', { cx: 150, cy: 300, r: 60 }, cb); R.v.g.setAttribute('clip-path', 'url(#' + cpb + ')');
        R.fire = burner(g, 150, 380);
        s('path', { d: 'M162 210 L420 290', stroke: '#BFE6FF', 'stroke-width': 10, 'stroke-linecap': 'round', fill: 'none', opacity: 0.6 }, g);
        s('path', { d: 'M260 228 L380 266', stroke: '#4FC3FF', 'stroke-width': 26, 'stroke-linecap': 'round', opacity: 0.35 }, g); s('text', { x: 320, y: 230, 'text-anchor': 'middle', 'font-size': 11, fill: '#80B8FF', text: 'réfrigérant (eau froide)' }, g);
        R.vap = [0, 1, 2, 3].map(function () { return s('circle', { r: 3, fill: '#E8F4FF' }, g); });
        R.dropD = s('circle', { r: 4, fill: WATER }, g);
        R.v2 = vessel(g, 410, 310, 44, 396); beakerOutline(g, 410, 300, 44, 396);
        s('text', { x: 432, y: 296, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'distillat' }, g);
        R.cr = crystals(g, 112, 356, 76, 20, '#FFFFFF');
      }
      if (t === 'amp') {
        s('path', { d: 'M290 100 C350 100 360 200 300 300 V330 H280 V300 C220 200 230 100 290 100Z', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, g);
        var cpa = 'ca' + (GID++), ca = s('clipPath', { id: cpa }, s('defs', {}, g)); s('path', { d: 'M290 103 C347 103 356 200 298 298 H282 C224 200 233 103 290 103Z' }, ca);
        R.ag = s('g', { 'clip-path': 'url(#' + cpa + ')' }, g); R.aw = s('rect', { x: 220, width: 140, fill: WATER, opacity: 0.6 }, R.ag); R.ao = s('rect', { x: 220, width: 140, fill: '#F2C94C', opacity: 0.85 }, R.ag);
        R.tap = s('rect', { x: 270, y: 312, width: 40, height: 8, rx: 3, fill: '#FFB547' }, g); R.stream = s('rect', { x: 286, y: 332, width: 8, fill: WATER, opacity: 0.6 }, g);
        R.v = vessel(g, 230, 360, 120, 404); beakerOutline(g, 230, 350, 120, 404);
        s('text', { x: 360, y: 110, 'font-size': 11, fill: '#A9B4C7', text: 'ampoule à décanter' }, g);
      }
    }
    /* panneau : loupe et fiche */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 20, y: 48, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'À LA LOUPE' }, P);
    var LX = PX + 140, LY = 128, LR = 70, cpl = 'lp' + (GID++), cll = s('clipPath', { id: cpl }, s('defs', {}, G)); s('circle', { cx: LX, cy: LY, r: LR }, cll);
    s('circle', { cx: LX, cy: LY, r: LR + 6, fill: '#3A4560' }, P); var lp = s('g', { 'clip-path': 'url(#' + cpl + ')' }, P); s('circle', { cx: LX, cy: LY, r: LR, fill: '#0B2440' }, lp);
    var LW = [], LS = [], LO = s('ellipse', { fill: '#F2C94C', opacity: 0.9 }, lp);
    for (var i = 0; i < 70; i++) LW.push(s('circle', { r: 3, fill: '#5FA8E8' }, lp));
    for (i = 0; i < 30; i++) LS.push(s('circle', { r: 3, fill: '#EEF2F8' }, lp));
    var lgr = s('circle', { fill: '#C8A46A' }, lp), lgr2 = s('circle', { fill: '#C8A46A' }, lp);
    var cT = s('text', { x: PX + 140, y: 228, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900 }, P), cS2 = s('text', { x: PX + 140, y: 250, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P);
    s('line', { x1: PX + 20, x2: PX + 260, y1: 268, y2: 268, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var tT = s('text', { x: PX + 20, y: 294, 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, P);
    var vb = s('rect', { x: PX + 20, y: 308, width: 240, height: 38, rx: 19 }, P), vt = s('text', { x: PX + 140, y: 332, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, P);
    var r1 = s('text', { x: PX + 140, y: 376, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P), r2 = s('text', { x: PX + 140, y: 396, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P), r3 = s('text', { x: PX + 140, y: 424, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3' }, P);
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      if (st.t == null && st.run) { st.p = Math.min(1, st.p + dt / 6); if (st.p >= 1) { st.run = false; o.onDone && o.onDone(); } }
      var k = st.tech + st.mix; if (k !== key) { key = k; build(); }
      var M = MIX[st.mix], p = st.p, res = result(st.mix, st.tech);
      title.textContent = TECH[st.tech] + ' · ' + M.n;
      if (st.tech === 'dec') R.v.set(M, 0.8, p);
      if (st.tech === 'fil') {
        var lv = Math.max(0, 0.85 - p); R.src.set(M, lv, 0); var fill = p > 0.02 && p < 0.98;
        R.fl.setAttribute('d', fill ? 'M246 140 L334 140 L290 206Z' : ''); R.fl.setAttribute('fill', M.gr ? mixc(WATER, '#8B6B3D', M.cloud) : WATER);
        R.res.setAttribute('d', M.gr && p > 0.1 ? 'M' + (290 - 30 * p) + ' ' + (206 - 30 * p) + ' L' + (290 + 30 * p) + ' ' + (206 - 30 * p) + ' L290 212Z' : ''); R.res.setAttribute('fill', M.gr ? M.gr.c : '#C8A46A');
        R.fo.setAttribute('d', '');
        R.drop.style.display = fill ? '' : 'none'; R.drop.setAttribute('cy', 254 + ((T * 90) % 40));
        R.v.set(M, 0.75 * p, 1, { clear: true, noOil: !M.oil, noGr: true }); if (M.oil) R.v.set(M, 0.75 * p, 1, { clear: true });
      }
      if (st.tech === 'evap') {
        R.v.set(M, Math.max(0, 0.9 - p * 0.9), 0.4, { noGr: p > 0.4, oilOnly: M.oil && p > 0.6, dep: M.gr && p > 0.7 ? 6 : 0, depCol: M.gr ? M.gr.c : '#C8A46A' });
        R.cr.forEach(function (c, i) { c.style.display = (M.sol === 'sel' || M.sol === 'sucre') && p > 0.75 && i / R.cr.length < (p - 0.75) * 4 ? '' : 'none'; c.setAttribute('fill', M.sol === 'sucre' ? '#FFF6E0' : '#FFFFFF'); });
        R.fire.style.display = st.run || (st.t != null && p > 0 && p < 1) ? '' : 'none';
        R.steam.forEach(function (sm, i) { var ph = ((T * 0.8 + i / 3) % 1); sm.style.display = p > 0.02 && p < 0.95 ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (250 + i * 40) + ' ' + (236 - ph * 60) + ')'); sm.setAttribute('opacity', 1 - ph); });
      }
      if (st.tech === 'dist') {
        R.v.set(M, Math.max(0.12, 0.85 - p * 0.7), 0.4, { noGr: false, dep: M.gr && p > 0.7 ? 8 : 0, depCol: M.gr ? M.gr.c : '#C8A46A' });
        R.v2.set({ cloud: 0 }, 0.85 * p, 1, { clear: true });
        R.cr.forEach(function (c, i) { c.style.display = (M.sol === 'sel' || M.sol === 'sucre') && p > 0.8 && i / R.cr.length < (p - 0.8) * 5 ? '' : 'none'; });
        R.fire.style.display = p > 0 && p < 1 ? '' : 'none';
        R.vap.forEach(function (c, i) { var ph = ((T * 0.9 + i / 4) % 1); c.style.display = p > 0.02 && p < 0.98 ? '' : 'none'; attr(c, { cx: 165 + ph * 250, cy: 211 + ph * 77 }); c.setAttribute('fill', ph > 0.5 ? WATER : '#E8F4FF'); });
        R.dropD.style.display = p > 0.05 && p < 0.98 ? '' : 'none'; attr(R.dropD, { cx: 428, cy: 294 + ((T * 70) % 30) });
      }
      if (st.tech === 'amp') {
        var H = 190, lvT = 120, total = M.oil ? 1 : 1, wLeft = Math.max(0, 1 - p * (M.oil ? 1 : 1)), oilH = M.oil ? 46 : 0, wH = (H - 20 - oilH) * wLeft;
        if (!M.oil) { attr(R.aw, { y: 298 - (H - 20) * wLeft, height: (H - 20) * wLeft, fill: mixc(WATER, '#8B6B3D', M.cloud) }); attr(R.ao, { height: 0 }); }
        else { attr(R.aw, { y: 298 - wH, height: wH, fill: WATER }); attr(R.ao, { y: 298 - wH - oilH, height: oilH }); }
        var flowing = p > 0 && p < 1; R.stream.setAttribute('height', flowing ? 30 : 0); R.tap.setAttribute('fill', flowing ? '#3DD68C' : '#FFB547');
        R.v.set(M.oil ? { cloud: 0 } : M, 0.9 * p, 0, M.oil ? { clear: true } : {});
      }
      // loupe
      var rnd2 = function (i, k2) { return rnd(i, k2 + 20); };
      LW.forEach(function (c, i) { var a = rnd2(i, 1) * 6.283, r = Math.sqrt(rnd2(i, 2)) * LR, jx = Math.sin(T * 2 + i) * 2; attr(c, { cx: LX + r * Math.cos(a) + jx, cy: LY + r * Math.sin(a), r: 3 }); c.style.display = M.oil && r * Math.sin(a) < -15 ? 'none' : ''; });
      LS.forEach(function (c, i) { var on = !!M.sol; c.style.display = on ? '' : 'none'; if (!on) return; var a = rnd2(i, 3) * 6.283, r = Math.sqrt(rnd2(i, 4)) * (LR - 6); attr(c, { cx: LX + r * Math.cos(a) + Math.cos(T * 2 + i) * 2, cy: LY + r * Math.sin(a), r: M.sol === 'sucre' ? 4.5 : 3.5, fill: M.sol === 'sel' ? (i % 2 ? '#EEF2F8' : '#3DD68C') : M.sol === 'sucre' ? '#FFF6E0' : '#FF8A80' }); });
      attr(LO, { cx: LX, cy: LY - 50, rx: M.oil ? 90 : 0, ry: M.oil ? 36 : 0 });
      attr(lgr, { cx: LX - 20, cy: LY + 20, r: M.gr ? (M.gr.r > 3 ? 26 : 10) : 0, fill: M.gr ? M.gr.c : '#000' }); attr(lgr2, { cx: LX + 26, cy: LY - 10, r: M.gr ? (M.gr.r > 3 ? 18 : 8) : 0, fill: M.gr ? M.gr.c : '#000' });
      cT.textContent = M.hom ? 'MÉLANGE HOMOGÈNE' : 'MÉLANGE HÉTÉROGÈNE'; cT.setAttribute('fill', M.hom ? '#4FC3FF' : '#FFB547');
      cS2.textContent = M.hom ? 'on ne distingue qu’une seule phase' : 'on distingue au moins 2 constituants';
      tT.textContent = TECH[st.tech];
      var lvl = p >= 1 ? res[0] : -1;
      vb.setAttribute('fill', lvl < 0 ? '#3A4560' : ['#FF5A4E', '#FFB547', '#3DD68C'][lvl]); vt.setAttribute('fill', lvl < 0 ? '#C9D2E3' : '#0B1220'); vt.textContent = lvl < 0 ? (p > 0 ? 'EN COURS…' : 'PRÊT') : ['ÉCHEC', 'SÉPARATION PARTIELLE', 'SÉPARATION RÉUSSIE'][lvl];
      r1.textContent = p >= 1 ? res[1] : ''; r2.textContent = p >= 1 ? res[2] : ''; r3.textContent = p >= 1 ? '' : 'appuie sur « Lancer »';
      return { mix: st.mix, tech: st.tech, p: p, lvl: lvl, res: res, hom: M.hom };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Homogène ou hétérogène ?' }, { t: 14, title: 'La décantation' }, { t: 26, title: 'La filtration' }, { t: 38, title: 'Les mélanges homogènes' }, { t: 50, title: 'La distillation' }, { t: 60, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['<b>Homogène</b> : une seule phase visible', 'eau salée, eau sucrée. <b>Hétérogène</b> : plusieurs constituants visibles (eau + sable).', 'var(--blue)'],
      ['<b>Décantation</b> et <b>filtration</b>', 'séparent les constituants d’un mélange hétérogène.', '#FFB547'],
      ['<b>Évaporation</b> et <b>distillation</b>', 'récupèrent le corps dissous ou l’eau pure d’un mélange homogène.', '#3DD68C']], [60.2, 64.6, 69]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 60.2)) {
        st.t = t;
        if (t < 14) { st.tech = 'dec'; st.mix = t < 7 ? 'sable' : 'sel'; st.p = 0; }
        else if (t < 26) { st.tech = 'dec'; st.mix = t < 20 ? 'sable' : 'boue'; st.p = t < 20 ? K.k(t, 14.5, 4) : K.k(t, 20.4, 4); }
        else if (t < 38) { st.tech = 'fil'; st.mix = 'boue'; st.p = K.k(t, 27, 8); }
        else if (t < 50) { st.tech = t < 43 ? 'fil' : 'evap'; st.mix = 'sel'; st.p = t < 43 ? K.k(t, 38.4, 3.6) : K.k(t, 43.4, 5.4); }
        else { st.tech = 'dist'; st.mix = 'sel'; st.p = K.k(t, 50.4, 8); }
        lab.step();
        tg.show(t, 1, 6.6, 290, 92, 'Eau + sable : on voit 2 constituants') || tg.show(t, 7.4, 13.6, 290, 92, 'Eau salée : une seule phase') || tg.show(t, 15, 19.6, 290, 92, 'Le sable tombe au fond') || tg.show(t, 21, 25.6, 290, 92, 'La boue se dépose mal : l’eau reste trouble') ||
          tg.show(t, 28, 37.6, 290, 92, 'Le filtre retient la boue : filtrat limpide') || tg.show(t, 39, 42.6, 290, 92, 'Le filtrat est encore salé !') || tg.show(t, 44, 49.6, 290, 92, 'L’eau s’évapore : il reste le sel') || tg.show(t, 51, 59.6, 290, 92, 'La vapeur se condense : eau pure');
      }
      bg.setAttribute('opacity', t > 59.8 ? 1 : 0);
      K.group(g5, t, 59.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un mélange d’eau et de sable et un mélange d’eau salée vus à la loupe, la décantation du sable et de la boue, la filtration de l’eau boueuse, la filtration puis l’évaporation de l’eau salée et enfin sa distillation',
    duration: 74, chapters: CH,
    segs: [
      { t: 0, d: 6.8, say: 'Dans ce bécher, de l’eau et du sable : on distingue bien les deux constituants. C’est un mélange hétérogène.', sub: 'Eau + sable : un mélange <b>hétérogène</b>.' },
      { t: 7, d: 6.8, say: 'Dans l’eau salée, on ne voit qu’une seule phase : le sel est dissous. C’est un mélange homogène.', sub: 'Eau salée : un mélange <b>homogène</b>.' },
      { t: 14, d: 5.8, say: 'Laissons reposer l’eau et le sable : le sable, plus lourd, tombe au fond. C’est la décantation.', sub: 'Au repos, le sable tombe au fond : la <b>décantation</b>.' },
      { t: 20, d: 5.8, say: 'Avec l’eau boueuse, c’est plus difficile : les fines particules restent en suspension.', sub: 'L’eau boueuse reste <b>trouble</b>.' },
      { t: 26, d: 11.6, say: 'Filtrons-la : le papier filtre retient les particules. Le liquide recueilli, le filtrat, est limpide.', sub: 'Le filtre retient les particules : le <b>filtrat</b> est limpide.' },
      { t: 38, d: 4.8, say: 'Et si on filtre l’eau salée ? Le filtrat est toujours salé : le sel dissous traverse le filtre.', sub: 'Filtrée, l’eau salée reste <b>salée</b> !' },
      { t: 43, d: 6.8, say: 'Chauffons-la : l’eau s’évapore et il reste des cristaux de sel. C’est l’évaporation.', sub: 'L’<b>évaporation</b> : il reste les cristaux de sel.' },
      { t: 50, d: 9.6, say: 'Pour récupérer l’eau, on la distille : la vapeur se refroidit et redevient liquide. On obtient de l’eau pure, le distillat.', sub: 'La <b>distillation</b> donne de l’eau pure.' },
      { t: 60, d: 4.4, say: 'À retenir : un mélange peut être homogène ou hétérogène.', sub: 'Mélange homogène ou hétérogène.' },
      { t: 64.6, d: 4.2, say: 'Décantation et filtration séparent les mélanges hétérogènes.', sub: 'Décantation et filtration : mélanges hétérogènes.' },
      { t: 69, d: 5, say: 'Évaporation et distillation séparent les mélanges homogènes.', sub: 'Évaporation et distillation : mélanges homogènes.' }
    ],
    learn: [
      { t: 13, ch: 0, html: '<b>Homogène</b> : une seule phase ; <b>hétérogène</b> : plusieurs constituants visibles.' },
      { t: 25, ch: 1, html: '<b>Décantation</b> : les solides lourds tombent au fond.' },
      { t: 37, ch: 2, html: '<b>Filtration</b> : le filtre retient les particules, filtrat limpide.' },
      { t: 59, ch: 4, html: '<b>Évaporation</b> : récupère le sel ; <b>distillation</b> : récupère l’eau pure.' }
    ],
    question: { q: 'Pour récupérer le sel de l’eau salée, on utilise :', o: ['la filtration', 'la décantation', 'l’évaporation', 'l’ampoule à décanter'], a: 2, e: 'L’eau s’évapore, le sel reste.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Paillasse de séparation : on choisit un mélange (eau et sable, eau boueuse, eau et huile, eau salée, eau sucrée, eau et alcool) et une technique (décantation, filtration, évaporation, distillation, ampoule à décanter) ; une loupe montre le mélange et un verdict indique si la séparation réussit',
    steps: [
      'Choisis un mélange et observe-le à la loupe : est-il homogène ou hétérogène ?',
      'Choisis une technique et appuie sur « Lancer ».',
      'Trouve la meilleure technique pour chaque mélange.',
      'Relève tes résultats dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onDone: function () { api.sound('ok'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Mélange', value: 'sable', options: Object.keys(MIX).map(function (k) { return { v: k, l: MIX[k].n }; }), onChange: function (v) { st.mix = v; st.p = 0; st.run = false; } });
      var cT = c.seg({ label: 'Technique', value: 'dec', options: Object.keys(TECH).map(function (k) { return { v: k, l: TECH[k] }; }), onChange: function (v) { st.tech = v; st.p = 0; st.run = false; } });
      var r1 = c.row(); c.button({ label: 'Lancer', primary: true, into: r1, onClick: function () { if (st.p >= 1) st.p = 0; st.run = true; } }); c.button({ label: 'Agiter / recommencer', sm: true, into: r1, onClick: function () { st.p = 0; st.run = false; } });
      var ro = api.readouts([{ k: 'm', label: 'Mélange' }, { k: 't', label: 'Technique' }, { k: 'r', label: 'Résultat' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.m.set(last.hom ? 'homogène' : 'hétérogène'); ro.t.set(TECH[st.tech].toLowerCase()); ro.r.set(last.lvl < 0 ? (st.p > 0 ? 'en cours' : '—') : ['échec', 'partielle', 'réussie'][last.lvl]); });
      var M = api.measure; M.innerHTML = '<h3>Mes séparations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (last.lvl < 0) { api.say('Termine d’abord la séparation.'); return; } rows.push({ m: MIX[st.mix].n, t: TECH[st.tech], l: last.lvl }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Mélange</th><th>Technique</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.m + '</td><td>' + r.t + '</td><td style="color:' + ['#FF8A80', '#FFC773', '#3DD68C'][r.l] + '">' + ['échec', 'partielle', 'réussie'][r.l] + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune séparation relevée.</div>';
        api.chart.innerHTML = '<h3>Quelle technique ?</h3><table class="mt"><tbody><tr><td>Solide non dissous (sable)</td><td>décantation, filtration</td></tr><tr><td>Fines particules (boue)</td><td>filtration</td></tr><tr><td>Deux liquides non miscibles</td><td>ampoule à décanter</td></tr><tr><td>Solide dissous (sel)</td><td>évaporation, distillation</td></tr><tr><td>Liquides miscibles</td><td>distillation</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mix = 'sable'; st.tech = 'dec'; st.p = 0; st.run = false; cM.set('sable'); cT.set('dec'); rows = []; paint(); });
      api.say('Choisis un mélange, une technique, puis lance !');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 séparations différentes.</p>';
        return '<p>Un mélange est <b>hétérogène</b> si l’on distingue à l’œil nu plusieurs constituants (eau et sable, eau et huile, eau boueuse) ; il est <b>homogène</b> si l’on ne distingue qu’une seule phase (eau salée, eau sucrée, eau et alcool).</p><p>On sépare les mélanges hétérogènes par <b>décantation</b>, <b>filtration</b> ou avec une <b>ampoule à décanter</b> (liquides non miscibles).</p><p>Pour un mélange homogène, la filtration ne suffit pas : on utilise l’<b>évaporation</b> (on récupère le solide dissous) ou la <b>distillation</b> (on récupère le liquide pur).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Séparation d’un mélange' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function techRow(api, lab, list) { api.c.seg({ label: 'Technique', value: lab.st.tech, options: list.map(function (k) { return { v: k, l: TECH[k] }; }), onChange: function (v) { lab.st.tech = v; lab.st.p = 0; lab.st.run = false; } }); api.c.button({ label: 'Lancer', sm: true, onClick: function () { lab.st.p = 0; lab.st.run = true; } }); }
  var DEFI = {
    title: 'Le défi du chimiste',
    intro: 'Sable, boue, huile, sel… À chaque mélange sa technique !',
    missions: [
      { title: 'De l’eau limpide', text: 'Obtiens une <span style="color:#4FC3FF">eau limpide</span> à partir de l’eau boueuse.', lumi: 'Les fines particules ne tombent pas toutes au fond…', hint: 'Il faut retenir les particules.',
        build: function (api) { var lab = mini(api, { mix: 'boue', tech: 'dec' }); techRow(api, lab, ['dec', 'fil', 'amp']); return function () { var r = lab.res(); return r.tech === 'fil' && r.p >= 1 ? { ok: true, msg: 'Le filtre a retenu la boue : filtrat limpide.' } : { ok: false, msg: r.p < 1 ? 'Lance et attends la fin.' : r.res[1] }; }; },
        e: 'La filtration retient les fines particules de boue.' },
      { type: 'qcm', title: 'Classement', text: 'L’eau sucrée est un mélange :', o: ['hétérogène', 'homogène', 'pur', 'impossible'], a: 1, hint: 'Voit-on le sucre une fois dissous ?', e: 'Une seule phase visible : mélange homogène.' },
      { title: 'Le sel de la lagune', text: 'Récupère le <span style="color:#EEF2F8">sel</span> contenu dans l’eau salée.', lumi: 'Le sel ne part ni par décantation, ni par filtration…', hint: 'Fais disparaître l’eau en la chauffant.',
        build: function (api) { var lab = mini(api, { mix: 'sel', tech: 'fil' }); techRow(api, lab, ['dec', 'fil', 'evap']); return function () { var r = lab.res(); return r.tech === 'evap' && r.p >= 1 ? { ok: true, msg: 'Il reste des cristaux de sel !' } : { ok: false, msg: r.p < 1 ? 'Lance et attends la fin.' : r.res[1] }; }; },
        e: 'L’évaporation de l’eau laisse les cristaux de sel.' },
      { title: 'L’huile et l’eau', text: 'Sépare et récupère <b>l’eau</b> et <b>l’huile</b>.', lumi: 'Deux liquides qui ne se mélangent pas…', hint: 'Il existe un instrument avec un robinet.',
        build: function (api) { var lab = mini(api, { mix: 'huile', tech: 'fil' }); techRow(api, lab, ['fil', 'dec', 'amp']); return function () { var r = lab.res(); return r.tech === 'amp' && r.p >= 1 ? { ok: true, msg: 'L’eau est dans le bécher, l’huile dans l’ampoule.' } : { ok: false, msg: r.p < 1 ? 'Lance et attends la fin.' : r.res[1] + ' ' + r.res[2] }; }; },
        e: 'L’ampoule à décanter sépare deux liquides non miscibles.' },
      { type: 'qcm', title: 'Le filtrat salé', text: 'On filtre de l’eau salée. Le filtrat est :', o: ['de l’eau pure', 'toujours salé', 'du sel solide', 'trouble'], a: 1, hint: 'Le sel est dissous.', e: 'Le sel dissous traverse le filtre.' }
    ]
  };

  S.start({
    id: '5e-melanges', level: '5e', theme: 'Mélanges et réactions chimiques', title: 'Les mélanges', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un mélange est <b>hétérogène</b> lorsqu’on distingue à l’œil nu au moins deux constituants (eau et sable, eau et huile, eau boueuse).',
      'Un mélange est <b>homogène</b> lorsqu’on ne distingue qu’une seule phase (eau salée, eau sucrée, eau et alcool).',
      'La <b>décantation</b> (repos) et la <b>filtration</b> séparent les constituants d’un mélange hétérogène ; le liquide recueilli après filtration est le <b>filtrat</b>.',
      'Deux liquides non miscibles (eau et huile) se séparent avec une <b>ampoule à décanter</b>.',
      'L’<b>évaporation</b> permet de récupérer le solide dissous ; la <b>distillation</b> permet de récupérer un liquide pur (le <b>distillat</b>).'
    ],
    quiz: [
      { q: 'L’eau boueuse est un mélange :', o: ['homogène', 'hétérogène', 'pur', 'gazeux'], a: 1, e: 'On voit les particules de terre.' },
      { q: 'La filtration permet de séparer :', o: ['le sel de l’eau', 'les particules solides d’un liquide', 'l’alcool de l’eau', 'deux gaz'], a: 1, e: 'Le filtre retient les particules.' },
      { q: 'L’eau et l’huile sont des liquides :', o: ['miscibles', 'non miscibles', 'identiques', 'solides'], a: 1, e: 'Ils forment deux couches.' },
      { q: 'Le liquide obtenu par distillation s’appelle :', o: ['le filtrat', 'le distillat', 'le dépôt', 'le résidu'], a: 1, e: 'C’est le distillat.' },
      { q: 'Après décantation de l’eau et du sable :', o: ['le sable flotte', 'le sable est au fond', 'le sable est dissous', 'tout s’évapore'], a: 1, e: 'Le sable, plus dense, tombe au fond.' }
    ]
  });
})();
