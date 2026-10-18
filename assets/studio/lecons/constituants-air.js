/* 6e · Les combustions · Leçon : Les constituants de l’air */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var GAS = { O2: { n: 'dioxygène', c: '#9FD7FF', r: 'rallume', t: 'La bûchette se rallume : dioxygène !' }, N2: { n: 'diazote', c: '#C9D2E3', r: 'eteint', t: 'La bûchette s’éteint : diazote' }, air: { n: 'air', c: '#DDEFFF', r: 'faible', t: 'La bûchette reste incandescente un moment' } };
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function rise(d) { return 0.2 * (1 - Math.exp(-d / 1.1)); }
  var GID = 0;
  function glow(G, col) { var id = 'ca' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.45, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  /* 100 molécules : 78 N2, 21 O2, 1 argon */
  var MOLS = []; (function () { var types = []; for (var i = 0; i < 78; i++) types.push('N2'); for (i = 0; i < 21; i++) types.push('O2'); types.push('Ar'); for (i = types.length - 1; i > 0; i--) { var j = Math.floor(rnd(i, 7) * (i + 1)), tmp = types[i]; types[i] = types[j]; types[j] = tmp; } MOLS = types; })();

  function Lab(G, o) {
    var st = Object.assign({ mode: 'tube', days: 0, gas: 'O2', dip: 0, dipping: false, test2: 0, pick: null, sort: 0, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- ÉPROUVETTE ET PAILLE DE FER ---------- */
    var A = s('g', {}, G), TX = 260, TW = 70, TT = 90, TB = 380;
    s('rect', { x: 110, y: 330, width: 360, height: 76, fill: '#4FA8FF', opacity: 0.5 }, A); s('path', { d: 'M106 296 V404 q0 6 6 6 H468 q6 0 6 -6 V296', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    var wIn = s('rect', { x: TX + 3, width: TW - 6, fill: '#4FA8FF', opacity: 0.6 }, A);
    var wool = s('path', { d: 'M' + (TX + 10) + ' ' + (TT + 26) + ' q12 -20 26 -4 q14 -20 26 4 q8 16 -8 22 q-20 8 -36 0 q-14 -6 -8 -22z', stroke: '#C9D2E3', 'stroke-width': 2 }, A);
    s('path', { d: 'M' + TX + ' ' + (TB + 10) + ' V' + (TT + TW / 2) + ' a' + TW / 2 + ' ' + TW / 2 + ' 0 0 1 ' + TW + ' 0 V' + (TB + 10), fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    for (var k = 0; k <= 5; k++) { var yy = 330 - k * 48; s('line', { x1: TX + TW, x2: TX + TW + 14, y1: yy, y2: yy, stroke: '#7D89A3', 'stroke-width': 1.5 }, A); s('text', { x: TX + TW + 18, y: yy + 4, 'font-size': 11, fill: k === 1 ? '#3DD68C' : '#A9B4C7', 'font-weight': k === 1 ? 900 : 400, text: k + '/5' }, A); }
    var mk = s('path', { stroke: '#3DD68C', 'stroke-width': 3 }, A), mkT = s('text', { 'font-size': 11, 'font-weight': 800, fill: '#3DD68C', 'text-anchor': 'end' }, A);
    var cal = s('g', {}, A); s('rect', { x: 400, y: 70, width: 110, height: 90, rx: 12, fill: '#EEF2F8' }, cal); s('rect', { x: 400, y: 70, width: 110, height: 24, rx: 12, fill: '#E5484D' }, cal); s('rect', { x: 400, y: 84, width: 110, height: 10, fill: '#E5484D' }, cal);
    s('text', { x: 455, y: 87, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#FFF', text: 'DURÉE' }, cal); var calT = s('text', { x: 455, y: 138, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 900, fill: '#1A1F28' }, cal);
    var aMsg = s('text', { x: 290, y: 446 - 12, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, A);
    s('text', { x: TX + TW / 2, y: TT - 10, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3', text: 'paille de fer humide' }, A);
    /* ---------- BÛCHETTE ---------- */
    var B = s('g', {}, G), FL = [[150, 'O2'], [290, 'air'], [430, 'N2']], flasks = FL.map(function (f) { var g = s('g', {}, B); s('path', { d: 'M' + (f[0] - 22) + ' 220 V250 Q' + (f[0] - 60) + ' 270 ' + (f[0] - 60) + ' 310 V392 q0 10 10 10 H' + (f[0] + 50) + ' q10 0 10 -10 V310 Q' + (f[0] + 60) + ' 270 ' + (f[0] + 22) + ' 250 V220', fill: GAS[f[1]].c, 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, g); s('text', { x: f[0], y: 422, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'flacon : ' + GAS[f[1]].n }, g); var sel = s('rect', { x: f[0] - 68, y: 200, width: 136, height: 236, rx: 14, fill: 'none', stroke: '#FFB547', 'stroke-width': 3, opacity: 0 }, g); return sel; });
    var stick = s('g', {}, B); s('line', { x1: 0, y1: -170, x2: 0, y2: 0, stroke: '#C8A46A', 'stroke-width': 6, 'stroke-linecap': 'round' }, stick);
    var tipG = s('circle', { r: 26, fill: glow(G, '#FF7A2E') }, stick), tip = s('circle', { r: 5, fill: '#FF7A2E' }, stick), flame = s('path', { fill: '#FFB547' }, stick), flame2 = s('path', { fill: '#FFF2B0' }, stick);
    var smoke = [0, 1, 2].map(function () { return s('path', { d: 'M0 0 q6 -10 0 -20 q-6 -10 0 -20', stroke: '#9AA6BC', 'stroke-width': 2, fill: 'none' }, stick); });
    var bMsg = s('text', { x: 290, y: 90, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, B);
    /* ---------- COMPOSITION ---------- */
    var C = s('g', {}, G), molsG = s('g', {}, C), ME = [];
    MOLS.forEach(function (ty, i) { var g = s('g', { style: 'cursor:pointer' }, molsG); if (ty === 'Ar') s('circle', { r: 8, fill: '#B9A3E3', stroke: '#0006' }, g); else { var col = ty === 'N2' ? '#4C6BFF' : '#F0454B'; s('circle', { cx: -6, r: 7, fill: col, stroke: '#0006' }, g); s('circle', { cx: 6, r: 7, fill: col, stroke: '#0006' }, g); } g.addEventListener('click', function () { st.pick = ty; o.onPick && o.onPick(ty); }); ME.push(g); });
    var cMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, C);
    var leg = s('g', {}, C); [['N2', '#4C6BFF', 'diazote N₂'], ['O2', '#F0454B', 'dioxygène O₂'], ['Ar', '#B9A3E3', 'autres gaz']].forEach(function (l, k) { s('circle', { cx: 80 + k * 160, cy: 402, r: 7, fill: l[1] }, leg); s('text', { x: 94 + k * 160, y: 406, 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: l[2] }, leg); });
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'COMPOSITION DE L’AIR' }, P);
    var CX = PX + 140, CYc = 160, R1 = 82, R0 = 48;
    function arc(a0, a1, col) { var p = function (a, r) { return [CX + r * Math.cos(a), CYc + r * Math.sin(a)]; }, A0 = p(a0, R1), A1 = p(a1, R1), B1 = p(a1, R0), B0 = p(a0, R0), lg = a1 - a0 > Math.PI ? 1 : 0; return s('path', { d: 'M' + A0 + ' A' + R1 + ' ' + R1 + ' 0 ' + lg + ' 1 ' + A1 + ' L' + B1 + ' A' + R0 + ' ' + R0 + ' 0 ' + lg + ' 0 ' + B0 + 'Z', fill: col }, P); }
    var a = -Math.PI / 2, segs = [[0.78, '#4C6BFF'], [0.21, '#F0454B'], [0.01, '#B9A3E3']].map(function (q) { var e = arc(a, a + q[0] * Math.PI * 2, q[1]); a += q[0] * Math.PI * 2; return e; });
    s('text', { x: CX, y: CYc - 4, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#EEF2F8', text: 'air' }, P); s('text', { x: CX, y: CYc + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'un mélange' }, P);
    [['diazote', '78 % ≈ 4/5', '#80A0FF'], ['dioxygène', '21 % ≈ 1/5', '#FF8A80'], ['autres gaz', '1 %', '#B9A3E3']].forEach(function (r, k) { var y = 274 + k * 26; s('text', { x: PX + 20, y: y, 'font-size': 13, 'font-weight': 800, fill: r[2], text: r[0] }, P); s('text', { x: PX + 260, y: y, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 900, fill: r[2], text: r[1] }, P); });
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 370 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'tube' ? '' : 'none'; B.style.display = st.mode === 'buchette' ? '' : 'none'; C.style.display = st.mode === 'compo' ? '' : 'none';
      if (st.mode === 'tube') {
        var r = rise(st.days), wl = 330 - 0 - r * (TB - TT - 30) * 1 - 0, yTop = 330 - r * (TB - TT - 30) * 1.0;
        var ylev = 330 - r * 240;
        attr(wIn, { y: ylev, height: TB + 10 - ylev }); wool.setAttribute('fill', TK2(st.days));
        attr(mk, { d: 'M' + (TX - 20) + ' ' + ylev + ' h14' }); attr(mkT, { x: TX - 24, y: ylev + 4, text: r > 0.01 ? '+' + fmt(r * 5, 1) + '/5' : '' }); mkT.textContent = r > 0.01 ? 'eau montée : ' + Math.round(r * 100) + ' %' : '';
        calT.textContent = fmt(st.days, st.days % 1 ? 1 : 0) + ' j';
        aMsg.textContent = st.days < 0.2 ? 'Éprouvette d’air retournée sur l’eau' : r < 0.19 ? 'La paille de fer rouille : l’eau monte…' : 'L’eau a remplacé le dioxygène : environ 1/5 du volume';
        pq[0].textContent = 'Le fer qui rouille consomme'; pq[1].textContent = 'le dioxygène de l’air : l’eau prend'; pq[2].textContent = 'sa place, environ 1/5 du volume.';
        res = { r: r, days: st.days };
      } else if (st.mode === 'buchette') {
        var idx = FL.map(function (f) { return f[1]; }).indexOf(st.gas), fx = FL[idx][0];
        flasks.forEach(function (sel, i) { sel.setAttribute('opacity', i === idx ? 1 : 0); });
        if (st.t == null) { if (st.dipping) st.dip = Math.min(1, st.dip + dt / 0.8); else st.dip = Math.max(0, st.dip - dt / 0.8); }
        var sy = 180 + st.dip * 140; stick.setAttribute('transform', 'translate(' + fx + ' ' + sy + ')');
        var inF = st.dip > 0.95, R = GAS[st.gas].r, glowK = !inF ? 0.7 : R === 'rallume' ? 0 : R === 'faible' ? 0.5 : 0, fl = inF && R === 'rallume';
        tipG.setAttribute('opacity', glowK); tip.setAttribute('fill', glowK > 0.1 || fl ? '#FF7A2E' : '#3A3A3A');
        var fk = 1 + 0.1 * Math.sin(T * 20); flame.setAttribute('d', fl ? 'M-8 0 q-6 -18 8 -' + 40 * fk + ' q14 22 8 ' + 40 * fk + 'z' : ''); flame2.setAttribute('d', fl ? 'M-3 0 q-2 -10 3 -' + 20 * fk + ' q5 10 3 ' + 20 * fk + 'z' : '');
        smoke.forEach(function (sm, i) { var ph = ((T * 0.8 + i / 3) % 1); sm.style.display = inF && R === 'eteint' ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (i * 8 - 8) + ' ' + (-6 - ph * 40) + ')'); sm.setAttribute('opacity', 1 - ph); });
        bMsg.style.display = st.t != null ? 'none' : ''; bMsg.textContent = inF ? GAS[st.gas].t : 'Bûchette incandescente au-dessus du flacon';
        pq[0].textContent = 'Le dioxygène entretient'; pq[1].textContent = 'les combustions : c’est le comburant.'; pq[2].textContent = 'Le diazote ne les entretient pas.';
        res = { inF: inF, gas: st.gas, relit: fl };
      } else {
        var cols = 14, sp = 34;
        ME.forEach(function (g, i) {
          var ty = MOLS[i], gx, gy;
          if (st.sort > 0) { var order = ty === 'N2' ? 0 : ty === 'O2' ? 1 : 2, idx2 = MOLS.slice(0, i).filter(function (q) { return q === ty; }).length, base = order === 0 ? 0 : order === 1 ? 78 : 99, j = base + idx2; gx = 70 + (j % cols) * sp; gy = 96 + Math.floor(j / cols) * 38; }
          else { gx = 70 + rnd(i, 1) * 440; gy = 100 + rnd(i, 2) * 270; gx += Math.sin(T * 1.3 + i) * 6; gy += Math.cos(T * 1.1 + i * 1.7) * 6; }
          var k2 = st.sort; if (k2 > 0 && k2 < 1) { var rx = 70 + rnd(i, 1) * 440, ry = 100 + rnd(i, 2) * 270; gx = rx + (gx - rx) * k2; gy = ry + (gy - ry) * k2; }
          g.setAttribute('transform', 'translate(' + gx.toFixed(1) + ' ' + gy.toFixed(1) + ') rotate(' + (rnd(i, 3) * 180 + (st.sort ? 0 : T * 30)) + ')');
          g.setAttribute('opacity', st.pick && st.pick !== ty ? 0.35 : 1);
        });
        cMsg.textContent = st.pick ? (st.pick === 'N2' ? 'Molécule de diazote : 78 sur 100' : st.pick === 'O2' ? 'Molécule de dioxygène : 21 sur 100' : 'Un autre gaz (argon) : 1 sur 100') : st.sort ? '100 molécules d’air rangées : 78 N₂, 21 O₂, 1 autre' : st.t != null ? '100 molécules d’air en mouvement' : '100 molécules d’air : clique sur une molécule';
        pq[0].textContent = 'Sur 100 molécules d’air :'; pq[1].textContent = '78 de diazote, 21 de dioxygène,'; pq[2].textContent = '1 d’un autre gaz.';
        res = { pick: st.pick, sort: st.sort };
      }
      return res;
    }
    function TK2(d) { var k = Math.min(1, d / 3); var a2 = [141, 150, 168], b2 = [168, 98, 46]; return 'rgb(' + a2.map(function (v, i) { return Math.round(v + (b2[i] - v) * k); }).join(',') + ')'; }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’air, un mélange ?' }, { t: 9, title: 'La paille de fer' }, { t: 24, title: 'Le dioxygène' }, { t: 35, title: 'Le diazote' }, { t: 45, title: 'La composition de l’air' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’air est un <b>mélange</b> de gaz', 'environ <b>4/5 de diazote</b> et <b>1/5 de dioxygène</b>, plus un peu d’autres gaz.', '#4C6BFF'],
      ['Le <b>dioxygène</b> entretient les combustions', 'une bûchette incandescente s’y <b>rallume</b>.', '#F0454B'],
      ['Le <b>diazote</b> ne les entretient pas', 'une bûchette incandescente s’y <b>éteint</b>.', '#C9D2E3']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 9) { st.mode = 'compo'; st.sort = 0; st.pick = null; }
        else if (t < 24) { st.mode = 'tube'; st.days = 5 * K.k(t, 10, 11); }
        else if (t < 35) { st.mode = 'buchette'; st.gas = 'O2'; st.dip = K.k(t, 26, 1.5); }
        else if (t < 45) { st.mode = 'buchette'; st.gas = 'N2'; st.dip = K.k(t, 36, 1.5); }
        else { st.mode = 'compo'; st.pick = null; st.sort = K.k(t, 46, 4); }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Que contient l’air ?') || tg.show(t, 11, 23.6, 290, 92, 'Jour ' + Math.floor(st.days) + ' : l’eau monte de ' + Math.round(rise(st.days) * 100) + ' %') ||
          tg.show(t, 28, 34.6, 290, 92, 'Dans le dioxygène, elle se rallume !') || tg.show(t, 38, 44.6, 290, 92, 'Dans le diazote, elle s’éteint') || tg.show(t, 47, 56.6, 290, 92, '78 diazote, 21 dioxygène, 1 autre');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : des molécules d’air en mouvement ; une éprouvette retournée sur l’eau contenant de la paille de fer humide, où l’eau monte d’environ un cinquième en quelques jours ; une bûchette incandescente qui se rallume dans le dioxygène et s’éteint dans le diazote ; enfin les molécules rangées pour montrer 78 % de diazote et 21 % de dioxygène',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'L’air qui nous entoure est invisible. Est-il fait d’un seul gaz, ou d’un mélange de gaz ?', sub: 'L’air : un seul gaz, ou un <b>mélange</b> ?' },
      { t: 9, d: 7, say: 'Plaçons de la paille de fer humide au fond d’une éprouvette, retournée sur une cuve d’eau.', sub: 'De la paille de fer humide dans une éprouvette d’air.' },
      { t: 16.2, d: 7.6, say: 'Jour après jour, le fer rouille et l’eau monte, puis s’arrête : elle occupe environ un cinquième du volume.', sub: 'L’eau monte d’environ <b>1/5</b>.' },
      { t: 24, d: 4.4, say: 'Le fer a consommé un gaz de l’air : le dioxygène.', sub: 'Le fer a consommé le <b>dioxygène</b>.' },
      { t: 28.6, d: 6, say: 'Une bûchette incandescente plongée dans du dioxygène se rallume : le dioxygène entretient les combustions.', sub: 'La bûchette se <b>rallume</b> : le dioxygène entretient les combustions.' },
      { t: 35, d: 10, say: 'Le gaz qui reste dans l’éprouvette est surtout du diazote. Une bûchette incandescente s’y éteint : le diazote n’entretient pas les combustions.', sub: 'Dans le <b>diazote</b>, la bûchette s’<b>éteint</b>.' },
      { t: 45, d: 11.6, say: 'Sur cent molécules d’air, il y a environ soixante-dix-huit molécules de diazote, vingt et une de dioxygène, et une d’un autre gaz.', sub: 'Environ <b>78 %</b> de diazote et <b>21 %</b> de dioxygène.' },
      { t: 57, d: 4.4, say: 'À retenir : l’air est un mélange de gaz.', sub: 'L’air est un <b>mélange</b>.' },
      { t: 61.6, d: 4.2, say: 'Il contient environ quatre cinquièmes de diazote et un cinquième de dioxygène.', sub: '4/5 de diazote, 1/5 de dioxygène.' },
      { t: 66, d: 5, say: 'Le dioxygène entretient les combustions.', sub: 'Le dioxygène entretient les combustions.' }
    ],
    learn: [
      { t: 23, ch: 1, html: 'Le fer qui rouille consomme <b>1/5</b> de l’air : le dioxygène.' },
      { t: 34, ch: 2, html: 'Bûchette incandescente : elle se <b>rallume</b> dans le dioxygène.' },
      { t: 44, ch: 3, html: 'Elle s’<b>éteint</b> dans le diazote.' },
      { t: 56, ch: 4, html: 'Air : <b>78 %</b> diazote, <b>21 %</b> dioxygène, 1 % autres gaz.' }
    ],
    question: { q: 'Le gaz le plus abondant dans l’air est :', o: ['le dioxygène', 'le diazote', 'le dioxyde de carbone', 'la vapeur d’eau'], a: 1, e: 'Environ 78 % de diazote.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Trois activités : une éprouvette d’air retournée sur l’eau avec de la paille de fer humide et un calendrier, une bûchette incandescente plongée dans un flacon de dioxygène, d’air ou de diazote, et 100 molécules d’air que l’on peut trier ; un diagramme de la composition de l’air à droite',
    steps: [
      'Paille de fer : fais passer les jours. De combien l’eau monte-t-elle ?',
      'Bûchette : plonge-la dans chaque flacon. Que se passe-t-il ?',
      'Molécules : clique sur une molécule, puis range-les.',
      'Relève tes observations.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onPick: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'tube', options: [{ v: 'tube', l: 'Paille de fer' }, { v: 'buchette', l: 'Bûchette incandescente' }, { v: 'compo', l: '100 molécules d’air' }], onChange: function (v) { st.mode = v; vis(); } });
      var sD = c.slider({ label: 'Jours écoulés', min: 0, max: 6, step: 0.5, value: 0, unit: 'j', dec: 1, onInput: function (v) { st.days = v; } });
      var cG = c.seg({ label: 'Flacon', value: 'O2', options: [{ v: 'O2', l: 'dioxygène' }, { v: 'air', l: 'air' }, { v: 'N2', l: 'diazote' }], onChange: function (v) { st.gas = v; st.dipping = false; st.dip = 0; } });
      var bP = c.button({ label: 'Plonger / retirer la bûchette', primary: true, onClick: function () { st.dipping = !st.dipping; } });
      var bS = c.button({ label: 'Ranger les molécules', sm: true, onClick: function () { st.sort = st.sort ? 0 : 1; st.pick = null; } });
      function vis() { var m = st.mode; sD.hide(m !== 'tube'); cG.hide(m !== 'buchette'); bP.style.display = m === 'buchette' ? '' : 'none'; bS.style.display = m === 'compo' ? '' : 'none'; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Mesure' }, { k: 'b', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'tube') { ro.a.set('eau montée : ' + Math.round(last.r * 100) + ' %'); ro.b.set(st.days + ' jour(s)'); } else if (st.mode === 'buchette') { ro.a.set(GAS[st.gas].n); ro.b.set(last.inF ? (last.relit ? 'se rallume' : st.gas === 'N2' ? 's’éteint' : 'reste incandescente') : 'au-dessus du flacon'); } else { ro.a.set('78 N₂ · 21 O₂ · 1 autre'); ro.b.set(st.pick ? (st.pick === 'O2' ? 'dioxygène' : st.pick === 'N2' ? 'diazote' : 'autre gaz') : '—'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var o2 = st.mode === 'tube' ? { e: 'paille de fer, ' + st.days + ' j', o: 'eau montée de ' + Math.round(last.r * 100) + ' %' } : st.mode === 'buchette' ? { e: 'bûchette dans ' + GAS[st.gas].n, o: last.inF ? (last.relit ? 'se rallume' : st.gas === 'N2' ? 's’éteint' : 'reste incandescente') : 'pas encore plongée' } : { e: 'molécules', o: '78 diazote, 21 dioxygène, 1 autre' }; rows.push(o2); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Les deux principaux gaz</h3><table class="mt"><thead><tr><th></th><th>Diazote</th><th>Dioxygène</th></tr></thead><tbody><tr><td>Proportion</td><td>78 % (4/5)</td><td>21 % (1/5)</td></tr><tr><td>Bûchette incandescente</td><td>s’éteint</td><td>se rallume</td></tr><tr><td>Combustions</td><td>ne les entretient pas</td><td>les entretient</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { st.mode = 'tube'; st.days = 0; st.gas = 'O2'; st.dip = 0; st.dipping = false; st.pick = null; st.sort = 0; cM.set('tube'); sD.set(0); cG.set('O2'); vis(); rows = []; paint(); });
      api.say('Fais passer les jours avec le curseur.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>L’air est un <b>mélange de gaz</b>. La paille de fer qui rouille consomme un gaz de l’air : l’eau monte d’environ <b>1/5</b> du volume. Ce gaz est le <b>dioxygène</b> : une bûchette incandescente s’y rallume, il <b>entretient les combustions</b>.</p><p>Le gaz restant est surtout du <b>diazote</b> : une bûchette incandescente s’y éteint.</p><p>Composition de l’air : environ <b>78 %</b> de diazote (4/5), <b>21 %</b> de dioxygène (1/5) et 1 % d’autres gaz (argon, dioxyde de carbone, vapeur d’eau…).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Les constituants de l’air' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’air',
    intro: 'Invisible mais pas mystérieux : perce les secrets de l’air !',
    missions: [
      { title: 'Le cinquième', text: 'Fais passer assez de jours pour que l’eau monte d’environ <span style="color:#3DD68C">1/5</span> (au moins 19 %).', lumi: 'La rouille prend du temps…', hint: 'Au moins 3 à 4 jours.',
        build: function (api) { var lab = mini(api, { mode: 'tube' }); api.c.slider({ label: 'Jours', min: 0, max: 6, step: 0.5, value: 0, unit: 'j', dec: 1, onInput: function (v) { lab.st.days = v; } }); return function () { var r = lab.res(); return r.r >= 0.19 ? { ok: true, msg: 'L’eau a pris la place du dioxygène : 1/5 du volume.' } : { ok: false, msg: 'Seulement ' + Math.round(r.r * 100) + ' %.' }; }; },
        e: 'Le dioxygène représente environ 1/5 de l’air.' },
      { type: 'qcm', title: 'Proportion', text: 'Quelle part de l’air est du dioxygène ?', o: ['environ 1/5', 'environ 4/5', 'la moitié', 'tout'], a: 0, hint: 'L’eau est montée de…', e: 'Environ 21 %, soit 1/5.' },
      { title: 'Rallume !', text: 'Fais <span style="color:#FFB547">rallumer</span> la bûchette incandescente.', lumi: 'Quel gaz entretient les combustions ?', hint: 'Le flacon de dioxygène.',
        build: function (api) { var lab = mini(api, { mode: 'buchette', gas: 'N2' }); api.c.seg({ label: 'Flacon', value: 'N2', options: [{ v: 'O2', l: 'dioxygène' }, { v: 'air', l: 'air' }, { v: 'N2', l: 'diazote' }], onChange: function (v) { lab.st.gas = v; lab.st.dip = 0; lab.st.dipping = false; } }); api.c.button({ label: 'Plonger / retirer', sm: true, onClick: function () { lab.st.dipping = !lab.st.dipping; } }); return function () { var r = lab.res(); return r.relit ? { ok: true, msg: 'Elle se rallume : c’est le dioxygène.' } : { ok: false, msg: r.inF ? 'Elle ne se rallume pas ici.' : 'Plonge la bûchette.' }; }; },
        e: 'Le dioxygène rallume une bûchette incandescente.' },
      { type: 'qcm', title: 'Le majoritaire', text: 'Dans le diazote, une bûchette incandescente :', o: ['se rallume', 's’éteint', 'explose', 'devient bleue'], a: 1, hint: 'Il n’entretient pas les combustions.', e: 'Elle s’éteint.' },
      { title: 'Trouve l’oxygène', text: 'Parmi les 100 molécules d’air, <b>clique sur une molécule de dioxygène</b>.', lumi: 'Les boules rouges, ce sont les atomes d’oxygène.', hint: 'Une paire de boules rouges.',
        build: function (api) { var lab = mini(api, { mode: 'compo' }); return function () { var r = lab.res(); return r.pick === 'O2' ? { ok: true, msg: 'Une molécule de dioxygène O₂ !' } : { ok: false, msg: r.pick ? 'Ce n’est pas du dioxygène.' : 'Clique sur une molécule.' }; }; },
        e: 'Le dioxygène O₂ : deux atomes d’oxygène (rouges).' }
    ]
  };

  S.start({
    id: '6e-constituants-air', level: '6e', theme: 'Les combustions', title: 'Les constituants de l’air', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’air est un <b>mélange de gaz</b>.',
      'Il contient environ <b>78 % de diazote</b> (4/5), <b>21 % de dioxygène</b> (1/5) et 1 % d’autres gaz (argon, dioxyde de carbone, vapeur d’eau…).',
      'Le <b>dioxygène</b> entretient les combustions : une bûchette incandescente s’y <b>rallume</b>. Il est aussi indispensable à la respiration.',
      'Le <b>diazote</b> n’entretient pas les combustions : une bûchette incandescente s’y <b>éteint</b>.',
      'Expérience : la paille de fer humide qui rouille dans une éprouvette retournée sur l’eau consomme le dioxygène ; l’eau monte d’environ 1/5 du volume.'
    ],
    quiz: [
      { q: 'L’air est :', o: ['un corps pur', 'un mélange de gaz', 'un liquide', 'du dioxygène pur'], a: 1, e: 'Un mélange.' },
      { q: 'Le diazote représente environ :', o: ['1/5 de l’air', '4/5 de l’air', '1/2 de l’air', '1 % de l’air'], a: 1, e: 'Environ 78 %.' },
      { q: 'Le gaz qui rallume une bûchette incandescente est :', o: ['le diazote', 'le dioxygène', 'l’argon', 'la vapeur d’eau'], a: 1, e: 'Le dioxygène.' },
      { q: 'Dans l’expérience de la paille de fer, l’eau monte car :', o: ['l’eau s’évapore', 'le fer consomme le dioxygène', 'le diazote disparaît', 'il fait chaud'], a: 1, e: 'Le dioxygène est consommé.' },
      { q: 'Sur 100 molécules d’air, combien de dioxygène environ ?', o: ['78', '21', '1', '50'], a: 1, e: 'Environ 21.' }
    ]
  });
})();
