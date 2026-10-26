/* 6e · Les combustions · Leçon : Dangers des combustions */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, C = window.CombKit;
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function shape(w, h) { return 'M0 ' + (-h) + ' C' + w + ' ' + (-h * 0.45) + ' ' + w + ' 0 0 0 C' + (-w) + ' 0 ' + (-w) + ' ' + (-h * 0.45) + ' 0 ' + (-h) + 'Z'; }
  var SC = { bois: { n: 'feu de bois', act: { eau: 'ok', couvrir: 'ok', fermer: 'rien' } }, huile: { n: 'feu d’huile dans la poêle', act: { eau: 'flare', couvrir: 'ok', fermer: 'rien' } }, gaz: { n: 'fuite de gaz enflammée', act: { eau: 'rien', couvrir: 'rien', fermer: 'ok' } } };
  var SIDE = { eau: 'chaleur', couvrir: 'dioxygène', fermer: 'combustible' };
  var MSG = { bois: { eau: 'L’eau refroidit le bois : le feu s’éteint', couvrir: 'Le sable étouffe le feu : plus de dioxygène', fermer: 'Il n’y a pas de gaz à fermer ici' }, huile: { eau: 'DANGER ! L’eau sur l’huile en feu projette une boule de feu', couvrir: 'Le couvercle étouffe le feu : plus de dioxygène', fermer: 'Couper le gaz ne suffit pas : l’huile brûle déjà' }, gaz: { eau: 'L’eau n’arrête pas le gaz qui s’échappe', couvrir: 'Impossible d’étouffer une fuite : ferme le robinet !', fermer: 'Robinet fermé : plus de combustible, le feu s’éteint' } };

  function fire(G, gl, n, w) {
    var g = s('g', {}, G), halo = s('ellipse', { fill: gl }, g), F = [];
    for (var i = 0; i < n; i++) F.push([s('path', { fill: '#FF7A2E' }, g), s('path', { fill: '#FFB547' }, g), s('path', { fill: '#FFE08A' }, g)]);
    return { set: function (x, y, k, T) {
      if (k <= 0.02) { g.style.display = 'none'; return; } g.style.display = '';
      g.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); attr(halo, { cy: -40 * k, rx: w * 1.1 * Math.min(1.6, k), ry: 70 * k, opacity: Math.min(0.9, 0.5 * k) });
      F.forEach(function (f, i) { var dx = (i / (n - 1 || 1) - 0.5) * w, hh = (60 + 40 * rnd(i, 1)) * k * (1 - Math.abs(dx) / w * 0.9) * (1 + 0.12 * Math.sin(T * (9 + i) + i)), ww = (12 + 6 * rnd(i, 2)) * Math.min(1.5, k);
        f.forEach(function (p, j) { var sc = [1, 0.7, 0.4][j]; p.setAttribute('d', shape(ww * sc, hh * sc)); p.setAttribute('transform', 'translate(' + dx + ' 0) skewX(' + 6 * Math.sin(T * 3 + i) + ')'); }); }); } };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'triangle', fuel: true, ox: true, heat: true, f: 1, scen: 'bois', act: null, ap: 0, win: false, co: 0, t: null }, o || {});
    var GL = C.glow(G, '#FF9A3E', 0.8);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- TRIANGLE / FEU DE BOIS ---------- */
    var A = s('g', {}, G); s('rect', { x: 40, y: 380, width: 500, height: 66, fill: '#3A2F28' }, A);
    var logs = s('g', {}, A); [[-1, 0], [1, 0], [0, 1]].forEach(function (l) { s('rect', { x: -70, y: -9, width: 140, height: 18, rx: 9, fill: '#7A4A2A', stroke: '#4A2A16', 'stroke-width': 2, transform: 'translate(290 ' + (372 - l[1] * 10) + ') rotate(' + (l[0] * 18) + ')' }, logs); });
    var fA = fire(A, GL, 7, 90), smA = [0, 1, 2, 3].map(function () { return s('circle', { r: 10, fill: '#5B6478' }, A); });
    var bellA = s('path', { d: 'M180 384 V190 q0 -30 30 -30 H370 q30 0 30 30 V384', fill: '#9FD7FF', 'fill-opacity': 0.1, stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    var match = s('g', {}, A); s('line', { x1: 0, y1: 0, x2: 60, y2: 30, stroke: '#C8A46A', 'stroke-width': 5, 'stroke-linecap': 'round' }, match); s('circle', { r: 6, fill: '#C0392B' }, match); var mFl = s('path', { d: shape(6, 22), fill: '#FFB547' }, match); match.setAttribute('transform', 'translate(380 330)');
    var cool = s('g', {}, A), DRa = []; for (var i = 0; i < 14; i++) DRa.push(s('path', { d: 'M0 -6 q4 6 0 8 q-4 -2 0 -8z', fill: '#6FC3FF' }, cool));
    var aT = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#F4E6D6' }, A);
    /* ---------- ÉTEINDRE ---------- */
    var B = s('g', {}, G); s('rect', { x: 40, y: 380, width: 500, height: 66, fill: '#2A2F3A' }, B);
    var obj = {}; obj.bois = s('g', {}, B); [[-1, 0], [1, 0]].forEach(function (l) { s('rect', { x: -70, y: -9, width: 140, height: 18, rx: 9, fill: '#7A4A2A', stroke: '#4A2A16', 'stroke-width': 2, transform: 'translate(290 372) rotate(' + (l[0] * 18) + ')' }, obj.bois); });
    obj.huile = s('g', {}, B); s('rect', { x: 180, y: 350, width: 220, height: 30, rx: 6, fill: '#C9D2E3' }, obj.huile); s('path', { d: 'M210 320 h140 q0 26 -26 26 h-88 q-26 0 -26 -26z', fill: '#2A2F3A' }, obj.huile); s('rect', { x: 350, y: 318, width: 80, height: 8, rx: 4, fill: '#2A2F3A' }, obj.huile); s('ellipse', { cx: 280, cy: 322, rx: 66, ry: 6, fill: '#E2B23C' }, obj.huile);
    obj.gaz = s('g', {}, B); s('rect', { x: 220, y: 230, width: 100, height: 150, rx: 28, fill: '#2F7D4F' }, obj.gaz); s('text', { x: 270, y: 320, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8', text: 'B12' }, obj.gaz); s('rect', { x: 252, y: 206, width: 36, height: 26, rx: 4, fill: '#9AA6BC' }, obj.gaz); s('rect', { x: 288, y: 212, width: 26, height: 10, fill: '#9AA6BC' }, obj.gaz);
    var valve = s('rect', { x: 260, y: 196, width: 20, height: 10, rx: 3, fill: '#E5484D' }, obj.gaz);
    var fB = fire(B, GL, 6, 90), jet = fire(B, GL, 3, 20);
    var water = s('g', {}, B), DRb = []; for (i = 0; i < 22; i++) DRb.push(s('path', { d: 'M0 -7 q5 7 0 9 q-5 -2 0 -9z', fill: '#6FC3FF' }, water));
    var lid = s('g', {}, B), lidP = s('path', { fill: '#8B95A8', stroke: '#C9D2E3', 'stroke-width': 2 }, lid);
    var ball = s('circle', { fill: C.glow(G, '#FF7A2E', 1) }, B);
    var bT = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, B), bN = s('text', { x: 290, y: 116, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, B);
    /* ---------- MONOXYDE DE CARBONE ---------- */
    var Cg = s('g', {}, G); s('rect', { x: 40, y: 360, width: 500, height: 86, fill: '#3A2F28' }, Cg);
    var winF = s('rect', { x: 420, y: 130, width: 80, height: 120, fill: '#0B1530', stroke: '#C9D2E3', 'stroke-width': 3 }, Cg), winO = s('rect', { x: 423, y: 133, height: 114, fill: '#5FA8E8', opacity: 0.55 }, Cg), winS = s('rect', { y: 133, width: 36, height: 114, fill: '#6B4E36' }, Cg);
    s('text', { x: 460, y: 270, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'fenêtre' }, Cg);
    s('path', { d: 'M200 360 L214 300 H286 L300 360 Z', fill: '#5B4636', stroke: '#8D6E4E', 'stroke-width': 2 }, Cg); var emb = s('ellipse', { cx: 250, cy: 298, rx: 38, ry: 10, fill: C.glow(G, '#FF7A2E'), opacity: 0.9 }, Cg); for (i = 0; i < 5; i++) s('circle', { cx: 226 + i * 12, cy: 298, r: 6, fill: '#2A1A12', stroke: '#FF7A2E', 'stroke-width': 1.2 }, Cg);
    s('text', { x: 250, y: 384, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#E6D3B8', text: 'réchaud à charbon' }, Cg);
    s('rect', { x: 70, y: 300, width: 110, height: 40, rx: 6, fill: '#6E5A8A' }, Cg); s('rect', { x: 70, y: 340, width: 8, height: 20, fill: '#4A3A5E' }, Cg); s('rect', { x: 172, y: 340, width: 8, height: 20, fill: '#4A3A5E' }, Cg); var head = s('circle', { cx: 94, cy: 292, r: 13, fill: '#8D5A3B' }, Cg); s('rect', { x: 104, y: 288, width: 70, height: 16, rx: 8, fill: '#E0C79A' }, Cg);
    var zz = s('text', { x: 108, y: 266, 'font-size': 16, 'font-weight': 900, fill: '#A9B4C7', text: 'z z' }, Cg);
    var coG = s('g', {}, Cg), CO = []; for (i = 0; i < 50; i++) CO.push(s('g', {}, coG)); CO.forEach(function (g) { s('circle', { cx: -5, r: 6, fill: '#4A4A4A', stroke: '#0006' }, g); s('circle', { cx: 5, r: 6, fill: '#F0454B', stroke: '#0006' }, g); });
    var det = s('g', {}, Cg); s('rect', { x: 66, y: 140, width: 150, height: 74, rx: 12, fill: '#EEF2F8' }, det); s('text', { x: 78, y: 160, 'font-size': 11, 'font-weight': 900, fill: '#3A3426', text: 'DÉTECTEUR CO' }, det); var detV = s('text', { x: 78, y: 196, 'font-size': 24, 'font-weight': 900, fill: '#1A1F28' }, det), detL = s('circle', { cx: 196, cy: 156, r: 8 }, det);
    var cT = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#F4E6D6' }, Cg);
    /* ---------- PANNEAU : TRIANGLE DU FEU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'LE TRIANGLE DU FEU' }, P);
    var TA = [PX + 140, 72], TB2 = [PX + 46, 232], TC = [PX + 234, 232];
    function side(p, q, col, lab, lx, ly, rot) { var l = s('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: col, 'stroke-width': 10, 'stroke-linecap': 'round' }, P), t = s('text', { x: lx, y: ly, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: col, text: lab, transform: 'rotate(' + rot + ' ' + lx + ' ' + ly + ')' }, P); return { l: l, t: t }; }
    var sides = { combustible: side(TA, TB2, '#FFB547', 'combustible', PX + 78, 144, -60), 'dioxygène': side(TA, TC, '#80C8FF', 'dioxygène', PX + 202, 144, 60), chaleur: side(TB2, TC, '#FF6B5E', 'chaleur', PX + 140, 256, 0) };
    var tFire = fire(P, GL, 3, 34);
    var pq = [0, 1, 2, 3, 4, 5].map(function (k) { return s('text', { x: PX + 140, y: 296 + k * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', k === 0 ? 800 : 400); }); }
    function sideSet(c, ox, h) { var v = { combustible: c, 'dioxygène': ox, chaleur: h }; Object.keys(sides).forEach(function (k) { sides[k].l.setAttribute('opacity', v[k] ? 1 : 0.18); sides[k].l.setAttribute('stroke-dasharray', v[k] ? '' : '6 10'); sides[k].t.setAttribute('opacity', v[k] ? 1 : 0.35); }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'triangle' ? '' : 'none'; B.style.display = st.mode === 'eteindre' ? '' : 'none'; Cg.style.display = st.mode === 'co' ? '' : 'none';
      if (st.mode === 'triangle') {
        var all = st.fuel && st.ox && st.heat; if (st.t == null) st.f = all ? Math.min(1, st.f + dt / 1.2) : Math.max(0, st.f - dt / 1);
        logs.setAttribute('opacity', st.fuel ? 1 : 0.12); bellA.style.display = st.ox ? 'none' : ''; mFl.style.display = st.heat ? '' : 'none'; cool.style.display = st.heat ? 'none' : '';
        DRa.forEach(function (d, k) { var ph = (T * 1.4 + rnd(k, 1)) % 1; d.setAttribute('transform', 'translate(' + (220 + rnd(k, 2) * 140) + ' ' + (170 + ph * 190) + ')'); d.setAttribute('opacity', 1 - ph * 0.5); });
        fA.set(290, 366, st.f * (0.8 + 0.1 * Math.sin(T * 2)), T);
        smA.forEach(function (c, k) { var ph = (T * 0.4 + k / 4) % 1, on = st.f < 0.6 && st.f > 0.02 || (!all && st.f <= 0.02 && st.fuel); c.style.display = on ? '' : 'none'; attr(c, { cx: 290 + Math.sin(T + k) * 14, cy: 340 - ph * 160, r: 8 + ph * 16, opacity: (1 - ph) * 0.5 }); });
        sideSet(st.fuel, st.ox, st.heat); tFire.set(PX + 140, 214, st.f * 0.55, T);
        aT.textContent = all ? (st.f > 0.9 ? 'Les trois côtés du triangle : le feu brûle' : 'Le feu reprend…') : !st.fuel ? 'Plus de combustible : le feu s’éteint' : !st.ox ? 'Plus de dioxygène : le feu s’éteint' : 'Plus de chaleur (refroidi) : le feu s’éteint';
        pset(['Pour qu’un feu existe, il faut :', 'un combustible (bois, gaz…),', 'un comburant (le dioxygène),', 'une source de chaleur.', 'Pour éteindre un feu,', 'on supprime un côté du triangle.']);
        res = { f: st.f, all: all };
      } else if (st.mode === 'eteindre') {
        var sc = SC[st.scen], R = st.act ? sc.act[st.act] : null;
        if (st.t == null && st.act) st.ap = Math.min(1, st.ap + dt / 2.2);
        Object.keys(obj).forEach(function (k) { obj[k].style.display = k === st.scen ? '' : 'none'; });
        var ap = st.act ? st.ap : 0, k2 = R === 'ok' ? Math.max(0, 1 - Math.max(0, ap - 0.25) / 0.5) : 1, bump = R === 'flare' ? Math.max(0, Math.sin(Math.min(1, ap / 0.6) * Math.PI)) : 0;
        var fx = st.scen === 'gaz' ? 0 : 1; fB.set(st.scen === 'huile' ? 280 : 290, st.scen === 'huile' ? 320 : 366, fx * k2 * (0.9 + 0.1 * Math.sin(T * 2)) * (1 + bump * 1.4), T);
        jet.set(316, 216, st.scen === 'gaz' ? k2 * 0.9 : 0, T); valve.setAttribute('fill', st.act === 'fermer' && ap > 0.3 ? '#3DD68C' : '#E5484D');
        if (st.scen === 'gaz') obj.gaz.lastChild && 0;
        water.style.display = st.act === 'eau' && ap < 0.7 ? '' : 'none'; DRb.forEach(function (d, k) { var ph = (ap * 3 + rnd(k, 1)) % 1; d.setAttribute('transform', 'translate(' + (220 + rnd(k, 2) * 140) + ' ' + (130 + ph * 220) + ')'); });
        var lidY = 120 + Math.min(1, ap / 0.35) * (st.scen === 'huile' ? 186 : st.scen === 'bois' ? 236 : 76);
        lid.style.display = st.act === 'couvrir' ? '' : 'none';
        lidP.setAttribute('d', st.scen === 'huile' ? 'M206 ' + lidY + ' h148 q-8 -18 -74 -18 q-66 0 -74 18z' : st.scen === 'bois' ? 'M200 ' + lidY + ' q90 -40 180 0 v12 h-180z' : 'M220 ' + lidY + ' h100 v-12 h-100z');
        lidP.setAttribute('fill', st.scen === 'bois' ? '#D9C08A' : '#8B95A8');
        attr(ball, { cx: 280, cy: 230, r: 160 * bump, opacity: bump });
        bN.textContent = sc.n; bT.textContent = st.act && ap > 0.3 ? MSG[st.scen][st.act] : 'Comment éteindre ce feu ?'; bT.setAttribute('fill', R === 'flare' && ap > 0.3 ? '#FF8A80' : R === 'ok' && ap > 0.3 ? '#3DD68C' : '#EEF2F8');
        var rm = st.act && R === 'ok' ? SIDE[st.act] : null; sideSet(rm !== 'combustible', rm !== 'dioxygène', rm !== 'chaleur'); tFire.set(PX + 140, 214, k2 * 0.55 * (1 + bump), T);
        pset(['Bons gestes :', 'eau : refroidit (feu de bois, papier)', 'couvercle, linge humide, sable :', 'étouffe (feu d’huile)', 'fermer le robinet de gaz :', 'retire le combustible']);
        res = { scen: st.scen, act: st.act, out: R === 'ok' && ap >= 0.8, flare: R === 'flare' && ap > 0.2 };
      } else {
        if (st.t == null) st.co = st.win ? Math.max(0, st.co - dt * 60) : Math.min(500, st.co + dt * 22);
        var co = st.co; attr(winO, { width: st.win ? 74 : 0 }); attr(winS, { x: st.win ? 382 : 423, width: st.win ? 36 : 74 });
        CO.forEach(function (g, k) { var on = k < co / 10; g.style.display = on ? '' : 'none'; if (on) g.setAttribute('transform', 'translate(' + (70 + rnd(k, 1) * 340 + Math.sin(T * 0.7 + k) * 10).toFixed(1) + ' ' + (90 + rnd(k, 2) * 200 + Math.cos(T * 0.6 + k * 1.3) * 10).toFixed(1) + ') rotate(' + (T * 40 + k * 30) + ')'); });
        detV.textContent = Math.round(co) + ' ppm'; detL.setAttribute('fill', co > 150 ? '#FF3B30' : co > 50 ? '#FFB547' : '#3DD68C'); emb.setAttribute('opacity', 0.7 + 0.25 * Math.sin(T * 3));
        zz.setAttribute('opacity', co > 300 ? 0.2 : 0.4 + 0.4 * Math.sin(T * 2)); head.setAttribute('fill', co > 300 ? '#B07A5B' : '#8D5A3B');
        cT.textContent = st.win ? (co > 50 ? 'Fenêtre ouverte : le CO s’évacue…' : 'Pièce aérée : moins de danger') : co > 300 ? 'DANGER : intoxication ! Sortir, aérer, appeler le 180' : co > 50 ? 'Pièce fermée : le monoxyde de carbone s’accumule' : 'Un réchaud à charbon allumé dans une chambre fermée…';
        cT.setAttribute('fill', co > 300 && !st.win ? '#FF8A80' : '#F4E6D6');
        sideSet(true, !st.win || true, true); tFire.set(PX + 140, 214, 0.4, T);
        pset(['Le monoxyde de carbone (CO)', 'est invisible, sans odeur', 'et mortel. Il vient des', 'combustions incomplètes.', 'Jamais de réchaud dans une', 'pièce fermée : aérer !']);
        res = { co: co, win: st.win };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le feu' }, { t: 8, title: 'Le triangle du feu' }, { t: 22, title: 'Éteindre un feu' }, { t: 34, title: 'Jamais d’eau sur l’huile' }, { t: 42, title: 'Le monoxyde de carbone' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un feu a besoin de <b>trois choses</b>', 'un combustible, du dioxygène et de la chaleur.', '#FFB547'],
      ['Pour l’éteindre, on <b>supprime un côté</b>', 'refroidir, étouffer, ou couper le combustible. Jamais d’eau sur l’huile !', '#80C8FF'],
      ['Le <b>monoxyde de carbone</b> tue', 'jamais de réchaud dans une pièce fermée. Pompiers : <b>180</b>.', '#FF6B5E']], [57.2, 61.4, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 8) { st.mode = 'triangle'; st.fuel = st.ox = st.heat = true; st.f = 1; }
        else if (t < 22) { st.mode = 'triangle'; var ph = t < 12.5 ? 0 : t < 17 ? 1 : 2, p0 = [8.8, 12.5, 17][ph], u = t - p0; st.fuel = ph !== 0 || u < 1; st.ox = ph !== 1 || u < 1; st.heat = ph !== 2 || u < 1; st.fuel = ph === 0 ? u < 1 || u > 3.4 : true; st.ox = ph === 1 ? u < 1 || u > 3.4 : true; st.heat = ph === 2 ? u < 1 || u > 3.4 : true; var off = u >= 1 && u <= 3.4; st.f = off ? Math.max(0, 1 - (u - 1) / 1) : u > 3.4 ? Math.min(1, (u - 3.4) / 1) : 1; }
        else if (t < 34) { st.mode = 'eteindre'; if (t < 28) { st.scen = 'bois'; st.act = 'eau'; st.ap = K.k(t, 23.5, 3); } else { st.scen = 'huile'; st.act = 'couvrir'; st.ap = K.k(t, 29, 3); } }
        else if (t < 42) { st.mode = 'eteindre'; st.scen = 'huile'; st.act = 'eau'; st.ap = K.k(t, 35, 4); }
        else { st.mode = 'co'; st.win = t > 51; st.co = t <= 51 ? Math.min(500, (t - 42) * 52) : Math.max(0, 468 - (t - 51) * 90); }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Que faut-il pour qu’un feu brûle ?') || tg.show(t, 9.2, 12.3, 290, 92, 'Sans combustible…') || tg.show(t, 12.8, 16.8, 290, 92, 'Sans dioxygène…') || tg.show(t, 17.3, 21.6, 290, 92, 'Sans chaleur…') ||
          tg.show(t, 23, 27.8, 290, 92, 'L’eau refroidit le feu de bois') || tg.show(t, 28.6, 33.6, 290, 92, 'Le couvercle étouffe le feu d’huile') || tg.show(t, 36.5, 41.6, 290, 92, 'Eau + huile en feu = DANGER') ||
          tg.show(t, 43, 50.8, 290, 92, 'Le CO s’accumule…') || tg.show(t, 51.4, 56.6, 290, 92, 'On aère !');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un feu de bois et le triangle du feu ; le feu s’éteint quand on retire le bois, quand on le recouvre d’une cloche, puis quand on le refroidit ; l’eau éteint le feu de bois, un couvercle étouffe un feu d’huile, mais de l’eau sur l’huile en feu provoque une boule de feu ; un réchaud à charbon dans une chambre fermée remplit la pièce de monoxyde de carbone, qui s’évacue quand on ouvre la fenêtre',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Le feu nous rend service, mais il peut être très dangereux. Que faut-il pour qu’un feu brûle ?', sub: 'Que faut-il pour qu’un feu <b>brûle</b> ?' },
      { t: 8, d: 13.8, say: 'Il faut trois choses : un combustible, comme le bois ; du dioxygène, le comburant ; et de la chaleur. C’est le triangle du feu. Si l’un des trois manque, le feu s’éteint.', sub: 'Combustible + dioxygène + chaleur : le <b>triangle du feu</b>.' },
      { t: 22, d: 6, say: 'Pour éteindre un feu de bois ou de papier, l’eau le refroidit : on supprime la chaleur.', sub: 'L’eau <b>refroidit</b> : plus de chaleur.' },
      { t: 28.2, d: 5.8, say: 'Sur un feu d’huile dans la poêle, on pose un couvercle : il étouffe le feu en supprimant le dioxygène.', sub: 'Le couvercle <b>étouffe</b> : plus de dioxygène.' },
      { t: 34, d: 8, say: 'Attention : jamais d’eau sur de l’huile en feu ! L’eau se vaporise d’un coup et projette une boule de feu.', sub: '<b>Jamais d’eau</b> sur l’huile en feu !' },
      { t: 42, d: 9, say: 'Un réchaud à charbon allumé dans une chambre fermée produit du monoxyde de carbone. Ce gaz est invisible, sans odeur, et il peut tuer pendant le sommeil.', sub: 'Le <b>monoxyde de carbone</b> : invisible et mortel.' },
      { t: 51, d: 5.8, say: 'Il faut toujours aérer. En cas d’incendie ou d’intoxication, appelle les sapeurs-pompiers au 180.', sub: 'Aérer · Sapeurs-pompiers : <b>180</b>.' },
      { t: 57, d: 4.2, say: 'À retenir : un feu a besoin d’un combustible, de dioxygène et de chaleur.', sub: 'Le triangle du feu.' },
      { t: 61.4, d: 4.4, say: 'Pour l’éteindre, on supprime l’un des trois.', sub: 'Supprimer un côté.' },
      { t: 66, d: 6, say: 'Et jamais de réchaud ou de groupe électrogène dans une pièce fermée.', sub: 'Jamais de réchaud dans une pièce fermée.' }
    ],
    learn: [
      { t: 21, ch: 1, html: 'Triangle du feu : <b>combustible</b>, <b>dioxygène</b>, <b>chaleur</b>.' },
      { t: 33, ch: 2, html: 'Éteindre : refroidir (eau), étouffer (couvercle, sable) ou couper le combustible.' },
      { t: 41, ch: 3, html: '<b>Jamais d’eau</b> sur un feu d’huile ou un appareil électrique.' },
      { t: 56, ch: 4, html: 'Le <b>monoxyde de carbone</b> est invisible et mortel : aérer.' }
    ],
    question: { q: 'Un feu d’huile dans la poêle s’éteint avec :', o: ['un verre d’eau', 'un couvercle', 'un ventilateur', 'du papier'], a: 1, e: 'Le couvercle étouffe le feu.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Feu', r: [40, 250, 500, 196] }, { n: 'Triangle du feu', r: [560, 22, 280, 424] }],
    alt: 'Trois activités : un feu de bois dont on retire le combustible, le dioxygène ou la chaleur ; trois feux (bois, huile, fuite de gaz) à éteindre avec de l’eau, un couvercle ou en fermant le robinet ; une chambre fermée avec un réchaud à charbon, un détecteur de monoxyde de carbone et une fenêtre ; le triangle du feu à droite',
    steps: [
      'Triangle : retire un côté du triangle. Que devient le feu ?',
      'Éteindre : choisis le bon geste pour chaque feu.',
      'Attention au feu d’huile !',
      'Monoxyde de carbone : observe le détecteur, puis aère.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'triangle', options: [{ v: 'triangle', l: 'Triangle du feu' }, { v: 'eteindre', l: 'Éteindre un feu' }, { v: 'co', l: 'Monoxyde de carbone' }], onChange: function (v) { st.mode = v; vis(); } });
      var t1 = c.toggle({ label: 'Combustible (bois)', value: true, onChange: function (v) { st.fuel = v; } }), t2 = c.toggle({ label: 'Dioxygène (air)', value: true, onChange: function (v) { st.ox = v; } }), t3 = c.toggle({ label: 'Chaleur', value: true, onChange: function (v) { st.heat = v; } });
      var cS = c.seg({ label: 'Feu', value: 'bois', options: [{ v: 'bois', l: 'bois' }, { v: 'huile', l: 'huile' }, { v: 'gaz', l: 'fuite de gaz' }], onChange: function (v) { st.scen = v; st.act = null; st.ap = 0; } });
      var rw = c.row(), acts = [['eau', 'Eau'], ['couvrir', 'Couvrir / étouffer'], ['fermer', 'Fermer le gaz']].map(function (a) { return c.button({ label: a[1], sm: true, into: rw, onClick: function () { st.act = a[0]; st.ap = 0; api.sound(SC[st.scen].act[a[0]] === 'flare' ? 'bad' : 'tick'); } }); });
      var bRe = c.button({ label: 'Rallumer le feu', sm: true, onClick: function () { st.act = null; st.ap = 0; } });
      var tW = c.toggle({ label: 'Fenêtre ouverte', value: false, onChange: function (v) { st.win = v; } });
      function vis() { var m = st.mode; [t1, t2, t3].forEach(function (x) { x.hide(m !== 'triangle'); }); cS.hide(m !== 'eteindre'); rw.style.display = bRe.style.display = m === 'eteindre' ? '' : 'none'; tW.hide(m !== 'co'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Situation' }, { k: 'b', label: 'Résultat' }]), last = {};
      function obs() { if (st.mode === 'triangle') return last.all ? 'le feu brûle' : 'le feu s’éteint'; if (st.mode === 'eteindre') return !st.act ? '—' : last.flare ? 'boule de feu : danger !' : last.out ? 'feu éteint' : SC[st.scen].act[st.act] === 'ok' ? 'en cours…' : 'sans effet'; return Math.round(last.co) + ' ppm de CO'; }
      function sit() { if (st.mode === 'triangle') return [st.fuel ? '' : 'sans combustible', st.ox ? '' : 'sans dioxygène', st.heat ? '' : 'sans chaleur'].filter(Boolean).join(', ') || 'feu complet'; if (st.mode === 'eteindre') return SC[st.scen].n + (st.act ? ' + ' + { eau: 'eau', couvrir: 'couvrir', fermer: 'fermer le gaz' }[st.act] : ''); return st.win ? 'fenêtre ouverte' : 'pièce fermée'; }
      api.loop(function () { last = lab.step(); ro.a.set(sit()); ro.b.set(obs()); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ e: sit(), o: obs() }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Situation</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Les bons gestes</h3><table class="mt"><thead><tr><th>Feu</th><th>Bon geste</th><th>Côté supprimé</th></tr></thead><tbody><tr><td>Bois, papier</td><td>eau, sable</td><td>chaleur / dioxygène</td></tr><tr><td>Huile (poêle)</td><td>couvercle, linge humide</td><td>dioxygène</td></tr><tr><td>Fuite de gaz</td><td>fermer le robinet</td><td>combustible</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'triangle', fuel: true, ox: true, heat: true, f: 1, scen: 'bois', act: null, ap: 0, win: false, co: 0 }); cM.set('triangle'); t1.set(true); t2.set(true); t3.set(true); cS.set('bois'); tW.set(false); vis(); rows = []; paint(); });
      api.say('Retire un côté du triangle du feu.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Un feu a besoin d’un <b>combustible</b>, d’un <b>comburant</b> (le dioxygène) et de <b>chaleur</b> : c’est le <b>triangle du feu</b>. Pour l’éteindre, on supprime l’un des trois : refroidir avec de l’eau, étouffer avec un couvercle, du sable ou une couverture, ou couper l’arrivée de combustible (fermer le robinet de gaz).</p><p><b>Jamais d’eau</b> sur un feu d’huile (boule de feu) ni sur un appareil électrique.</p><p>Une combustion incomplète produit du <b>monoxyde de carbone</b>, invisible, sans odeur et mortel : jamais de réchaud à charbon ni de groupe électrogène dans une pièce fermée. Urgence : sapeurs-pompiers <b>180</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Dangers des combustions' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function ext(api, scen) { var lab = mini(api, { mode: 'eteindre', scen: scen }), rw = api.c.row(); [['eau', 'Eau'], ['couvrir', 'Couvrir / étouffer'], ['fermer', 'Fermer le gaz']].forEach(function (a) { api.c.button({ label: a[1], sm: true, into: rw, onClick: function () { lab.st.act = a[0]; lab.st.ap = 0; } }); }); api.c.button({ label: 'Rallumer', sm: true, onClick: function () { lab.st.act = null; lab.st.ap = 0; } }); return lab; }
  var DEFI = {
    title: 'Le défi du pompier',
    intro: 'Tu es de garde à la caserne : éteins chaque feu avec le bon geste !',
    missions: [
      { title: 'Côté combustible', text: 'Éteins le feu de bois en supprimant le <span style="color:#FFB547">combustible</span>.', lumi: 'Quel côté du triangle ?', hint: 'Retire le bois.',
        build: function (api) { var lab = mini(api, { mode: 'triangle' }), st = lab.st; api.c.toggle({ label: 'Combustible (bois)', value: true, onChange: function (v) { st.fuel = v; } }); api.c.toggle({ label: 'Dioxygène (air)', value: true, onChange: function (v) { st.ox = v; } }); api.c.toggle({ label: 'Chaleur', value: true, onChange: function (v) { st.heat = v; } }); return function () { var r = lab.res(); return r.f < 0.05 && !st.fuel && st.ox && st.heat ? { ok: true, msg: 'Plus de combustible : le feu s’éteint.' } : r.f < 0.05 ? { ok: false, msg: 'Le feu est éteint, mais pas en retirant (seulement) le combustible.' } : { ok: false, msg: 'Le feu brûle encore.' }; }; },
        e: 'Sans combustible, pas de feu.' },
      { title: 'Feu d’huile', text: 'La poêle a pris feu ! Éteins-la <b>sans danger</b>.', lumi: 'Attention au mauvais réflexe…', hint: 'Étouffe le feu avec un couvercle.',
        build: function (api) { var lab = ext(api, 'huile'); return function () { var r = lab.res(); return r.out ? { ok: true, msg: 'Le couvercle étouffe le feu d’huile.' } : { ok: false, msg: r.flare ? 'Boule de feu ! Jamais d’eau sur l’huile.' : 'Le feu brûle encore.' }; }; },
        e: 'Le couvercle supprime le dioxygène.' },
      { title: 'Fuite de gaz', text: 'Le gaz brûle à la sortie de la bouteille. Fais le <b>bon geste</b>.', lumi: 'Supprime le combustible.', hint: 'Ferme le robinet.',
        build: function (api) { var lab = ext(api, 'gaz'); return function () { var r = lab.res(); return r.out ? { ok: true, msg: 'Robinet fermé : plus de gaz, plus de feu.' } : { ok: false, msg: 'Le gaz continue de s’échapper.' }; }; },
        e: 'Fermer le robinet supprime le combustible.' },
      { title: 'L’ennemi invisible', text: 'Le détecteur de CO dépasse 150 ppm. <b>Fais redescendre</b> sous 50 ppm.', lumi: 'Que faut-il faire entrer ?', hint: 'Ouvre la fenêtre.',
        build: function (api) { var lab = mini(api, { mode: 'co', co: 260 }); api.c.toggle({ label: 'Fenêtre ouverte', value: false, onChange: function (v) { lab.st.win = v; } }); return function () { var r = lab.res(); return r.co < 50 ? { ok: true, msg: 'Pièce aérée : le monoxyde de carbone s’évacue.' } : { ok: false, msg: Math.round(r.co) + ' ppm : encore trop !' }; }; },
        e: 'Aérer évacue le monoxyde de carbone.' },
      { type: 'qcm', title: 'Urgence', text: 'En Côte d’Ivoire, pour appeler les sapeurs-pompiers, on compose le :', o: ['180', '111', '185', '170'], a: 0, hint: 'Le GSPM.', e: 'Sapeurs-pompiers : 180.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Une famille utilise un appareil à combustion dans une pièce. Quelles conditions peuvent augmenter les risques et quelles protections prévoir ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-dangers-combustions', level: '6e', theme: 'Les combustions', title: 'Dangers des combustions', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un feu a besoin de trois éléments : un <b>combustible</b>, un <b>comburant</b> (le dioxygène) et de la <b>chaleur</b> : c’est le <b>triangle du feu</b>.',
      'Pour éteindre un feu, on supprime l’un des trois : <b>refroidir</b> (eau), <b>étouffer</b> (couvercle, linge humide, sable, couverture) ou <b>couper le combustible</b> (fermer le robinet de gaz).',
      '<b>Jamais d’eau</b> sur un feu d’huile ou sur un appareil électrique.',
      'Une combustion incomplète produit du <b>monoxyde de carbone</b> : gaz invisible, sans odeur et mortel. Jamais de réchaud à charbon ni de groupe électrogène dans une pièce fermée : il faut <b>aérer</b>.',
      'En cas d’incendie ou d’intoxication : sortir, aérer et appeler les sapeurs-pompiers au <b>180</b>.'
    ],
    quiz: [
      { q: 'Les trois côtés du triangle du feu sont :', o: ['eau, air, feu', 'combustible, dioxygène, chaleur', 'bois, gaz, huile', 'fumée, flamme, cendre'], a: 1, e: 'Combustible, comburant, chaleur.' },
      { q: 'Verser de l’eau sur un feu de bois :', o: ['supprime la chaleur', 'supprime le combustible', 'ajoute du dioxygène', 'n’a aucun effet'], a: 0, e: 'L’eau refroidit.' },
      { q: 'Sur un feu d’huile, il ne faut jamais :', o: ['poser un couvercle', 'couper le gaz', 'verser de l’eau', 'poser un linge humide'], a: 2, e: 'L’eau provoque une boule de feu.' },
      { q: 'Le monoxyde de carbone est dangereux car il est :', o: ['coloré et odorant', 'invisible, sans odeur et toxique', 'très lourd', 'inflammable seulement'], a: 1, e: 'On ne le sent pas venir.' },
      { q: 'Un réchaud à charbon dans une chambre fermée :', o: ['est sans danger', 'peut provoquer une intoxication au CO', 'purifie l’air', 'fait baisser le CO'], a: 1, e: 'Il faut aérer.' }
    ]
  });
})();

