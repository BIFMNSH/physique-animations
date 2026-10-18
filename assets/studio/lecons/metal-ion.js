/* 4e · Les ions · Leçon : Transformation d’un métal en ion et inversement */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  /* texte chimique : ^{…} exposant, _{…} indice */
  function rich(G, x, y, str, fs, col, anchor) { var t = s('text', { x: x, y: y, 'font-size': fs, 'font-weight': 800, fill: col || '#EEF2F8', 'text-anchor': anchor || 'start' }, G); setRich(t, str, fs); return t; }
  function setRich(t, str, fs) {
    while (t.firstChild) t.removeChild(t.firstChild);
    var re = /([\^_])\{([^}]*)\}/g, i = 0, m, off = 0;
    function put(txt, target, small) { if (!txt) return; var a = { text: txt }; if (target !== off) a.dy = target - off; if (small) a['font-size'] = fs * 0.62; s('tspan', a, t); off = target; }
    while ((m = re.exec(str))) { put(str.slice(i, m.index), 0, false); put(m[2], m[1] === '^' ? -fs * 0.42 : fs * 0.25, true); i = re.lastIndex; }
    put(str.slice(i), 0, false); if (off !== 0) put('​', 0, false);
  }
  var IONS = [
    { k: 'Cu', f: 'Cu^{2+}', n: 'ion cuivre II', sol: ['#4A9BFF', 0.5], pp: '#2F6BFF', pn: 'bleu', eq: 'Cu^{2+} + 2 HO^{−} → Cu(HO)_{2}' },
    { k: 'Fe2', f: 'Fe^{2+}', n: 'ion fer II', sol: ['#9BE7A5', 0.32], pp: '#4E8F4A', pn: 'vert', eq: 'Fe^{2+} + 2 HO^{−} → Fe(HO)_{2}' },
    { k: 'Fe3', f: 'Fe^{3+}', n: 'ion fer III', sol: ['#F2B35A', 0.38], pp: '#B5561C', pn: 'rouille', eq: 'Fe^{3+} + 3 HO^{−} → Fe(HO)_{3}' },
    { k: 'Zn', f: 'Zn^{2+}', n: 'ion zinc', sol: ['#CFE8FF', 0.12], pp: '#F2F4F7', pn: 'blanc', eq: 'Zn^{2+} + 2 HO^{−} → Zn(HO)_{2}' },
    { k: 'Al', f: 'Al^{3+}', n: 'ion aluminium', sol: ['#CFE8FF', 0.12], pp: '#F2F4F7', pn: 'blanc', eq: 'Al^{3+} + 3 HO^{−} → Al(HO)_{3}' }
  ];
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }
  function liquid(x, yl, w, yb) { var r = w / 2; return 'M' + x + ' ' + yl + 'H' + (x + w) + 'V' + (yb - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (yb - r) + 'Z'; }
  function tubeOutline(x, y, w, yb) { var r = w / 2; return 'M' + (x - 4) + ' ' + y + 'H' + x + 'V' + (yb - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + (x + w) + ' ' + (yb - r) + 'V' + y + 'H' + (x + w + 4); }
  function precip(G, n, x0, x1, y0, y1, seed) { var a = []; for (var i = 0; i < n; i++) { var u = ((i * 0.6180339 + seed) % 1), v = ((i * 0.4142135 + seed * 1.7) % 1); a.push(s('circle', { cx: x0 + u * (x1 - x0), cy: y0 + Math.pow(v, 0.6) * (y1 - y0), r: 3 + (i % 4) }, G)); } return a; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'acide', p: 0, run: false, soda: 0, sodaOn: false, flame: 0, flameOn: false, popped: false, sel: 0, added: [0, 0, 0, 0, 0], labels: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#080B14' }, G);
    s('rect', { x: 0, y: 430, width: 540, height: 40, fill: '#141B2B' }, G);
    /* ---------- fer + acide ---------- */
    var A = s('g', {}, G), TX = 200, TW = 96, TY = 70, TB = 420, TL = 200;
    var aLiq = s('path', { d: liquid(TX, TL, TW, TB) }, A);
    var wool = s('path', { d: 'M' + (TX + 18) + ' ' + (TB - 30) + ' q10 -26 26 -6 q12 -24 26 2 q8 14 -6 22 q-20 10 -40 0 q-12 -6 -6 -18z', fill: '#8D96A8', stroke: '#C9D2E3', 'stroke-width': 2 }, A);
    var bub = s('g', {}, A), B = [];
    for (var i = 0; i < 18; i++) B.push(s('circle', { r: 2 + (i % 3), fill: 'none', stroke: '#E8F4FF', 'stroke-width': 1.4 }, bub));
    var aP = s('g', {}, A), aPP = precip(aP, 60, TX + 10, TX + TW - 10, TL + 40, TB - 14, 0.13);
    s('path', { d: tubeOutline(TX, TY, TW, TB), fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3, opacity: 0.85 }, A);
    s('text', { x: TX + TW / 2, y: 452, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7', text: 'acide chlorhydrique + fer' }, A);
    var flame = s('g', {}, A); s('rect', { x: -3, y: 0, width: 6, height: 70, rx: 2, fill: '#D9A066' }, flame); s('path', { d: 'M0 -26 q12 14 0 26 q-12 -12 0 -26z', fill: '#FFB547' }, flame); s('path', { d: 'M0 -16 q6 8 0 16 q-6 -8 0 -16z', fill: '#FFF2B0' }, flame);
    var pop = s('g', {}, A); s('path', { d: 'M0 -40 L10 -14 L38 -20 L18 0 L36 22 L8 14 L0 40 L-8 14 L-36 22 L-18 0 L-38 -20 L-10 -14Z', fill: '#FFE29A' }, pop); s('text', { y: 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#7A3B00', text: 'POP !' }, pop);
    /* ---------- fer + ions cuivre ---------- */
    var C = s('g', {}, G), BX = 110, BW = 300, BY = 150, BB = 420;
    var cLiq = s('rect', { x: BX + 4, y: BY + 40, width: BW - 8, height: BB - BY - 44 }, C);
    var nail = s('g', {}, C);
    s('rect', { x: BX + 138, y: 96, width: 24, height: 290, rx: 3, fill: '#9AA6BC' }, nail); s('rect', { x: BX + 126, y: 90, width: 48, height: 12, rx: 4, fill: '#B7C1D3' }, nail); s('path', { d: 'M' + (BX + 138) + ' 386 L' + (BX + 150) + ' 410 L' + (BX + 162) + ' 386Z', fill: '#9AA6BC' }, nail);
    var dep = s('g', {}, C), D = [];
    for (i = 0; i < 46; i++) D.push(s('circle', { cx: BX + 136 + (i % 2 ? 26 : 0) + ((i * 7) % 5) - 2, cy: BY + 50 + ((i * 41) % 200), r: 3 + (i % 3), fill: '#C8622E' }, dep));
    var depL = s('rect', { x: BX + 138, y: BY + 40, width: 24, height: 196, fill: '#C8622E' }, C);
    var cP = s('g', {}, C), cPP = precip(cP, 70, BX + 16, BX + BW - 16, BY + 120, BB - 14, 0.37);
    s('path', { d: 'M' + BX + ' ' + BY + 'V' + (BB - 10) + 'q0 10 10 10 H' + (BX + BW - 10) + 'q10 0 10 -10 V' + BY, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3, opacity: 0.85 }, C);
    s('text', { x: BX + BW / 2, y: 452, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7', text: 'clou de fer dans du sulfate de cuivre' }, C);
    /* ---------- tests à la soude ---------- */
    var T = s('g', {}, G), tubes = [];
    IONS.forEach(function (io, k) {
      var x = 40 + k * 98, g = s('g', {}, T), yl = 230;
      var lq = s('path', { d: liquid(x, yl, 56, 400), fill: io.sol[0], opacity: io.sol[1] + 0.1 }, g);
      var pg = s('g', {}, g), pp = precip(pg, 26, x + 6, x + 50, yl + 30, 392, 0.11 * k + 0.05);
      pp.forEach(function (c) { c.setAttribute('fill', io.pp); });
      var ring = s('path', { d: tubeOutline(x, 120, 56, 400), fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3, opacity: 0.85 }, g);
      var lab = rich(g, x + 28, 452, io.f, 16, '#EEF2F8', 'middle'), q = s('text', { x: x + 28, y: 452, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#EEF2F8', text: String.fromCharCode(65 + k) }, g);
      var sel = s('rect', { x: x - 10, y: 104, width: 76, height: 312, rx: 12, fill: 'none', stroke: '#FFB547', 'stroke-width': 3 }, g);
      tubes.push({ pg: pg, lab: lab, q: q, sel: sel, x: x });
    });
    var drop = s('g', {}, G); s('rect', { x: -7, y: -70, width: 14, height: 54, rx: 4, fill: '#DCE3EE', opacity: 0.9 }, drop); s('path', { d: 'M-7 -16 L0 0 L7 -16Z', fill: '#DCE3EE' }, drop); s('rect', { x: -11, y: -88, width: 22, height: 20, rx: 7, fill: '#3DD68C' }, drop);
    s('text', { x: 0, y: -96, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#3DD68C', text: 'soude' }, drop);
    var dropD = s('circle', { r: 4, fill: '#DCE3EE' }, G);
    /* ---------- loupe atomique ---------- */
    var IX = 560, IY = 26, IW = 280, IH = 260, M = s('g', {}, G);
    s('rect', { x: IX, y: IY, width: IW, height: IH, rx: 18, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, M);
    s('text', { x: IX + 18, y: IY + 26, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES ATOMES' }, M);
    var mG = s('g', {}, M);
    function atom(g, r, fill, txt) { var a = s('g', {}, g); s('circle', { r: r, fill: fill, stroke: '#0008', 'stroke-width': 1.5 }, a); a._t = rich(a, 0, r * 0.32, txt, r * 0.78, '#0B1220', 'middle'); return a; }
    var surf = s('rect', { x: IX + 20, y: IY + 200, width: IW - 40, height: 40, rx: 6, fill: '#8D96A8' }, mG);
    var surfL = s('text', { x: IX + IW / 2, y: IY + 226, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#1A2235', text: 'fer métal' }, mG);
    var mA = atom(mG, 22, '#9AA6BC', 'Fe'), mB = atom(mG, 15, '#FFB547', 'H^{+}'), mB2 = atom(mG, 15, '#FFB547', 'H^{+}'), mC = atom(mG, 22, '#4A9BFF', 'Cu^{2+}');
    var eA = s('circle', { r: 6, fill: '#4FC3FF' }, mG), eB = s('circle', { r: 6, fill: '#4FC3FF' }, mG);
    var h2 = s('g', {}, mG); s('circle', { cx: -9, r: 12, fill: '#E8F4FF' }, h2); s('circle', { cx: 9, r: 12, fill: '#E8F4FF' }, h2); rich(h2, 0, 5, 'H_{2}', 13, '#0B1220', 'middle');
    var hoG = s('g', {}, mG), HO = [0, 1, 2].map(function () { return atom(hoG, 13, '#3DD68C', 'HO^{−}'); });
    var solid = s('rect', { width: 64, height: 40, rx: 8 }, mG), solidT = rich(mG, 0, 0, '', 12, '#0B1220', 'middle');
    var mCap = rich(M, IX + IW / 2, IY + IH - 6, '', 12, '#A9B4C7', 'middle');
    /* équation */
    var Q = s('g', {}, G);
    s('rect', { x: IX, y: 300, width: IW, height: 130, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, Q);
    s('text', { x: IX + 18, y: 326, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'BILAN' }, Q);
    var eq = rich(Q, IX + IW / 2, 368, '', 19, '#FFC773', 'middle'), eq2 = s('text', { x: IX + IW / 2, y: 400, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, Q), eq3 = s('text', { x: IX + IW / 2, y: 418, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, Q);
    var last = performance.now(), lastEq = '', lastCap = '';
    function L(t, a, b) { return Math.max(0, Math.min(1, (t - a) / (b - a))); }
    function at(g, x, y, op) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); g.setAttribute('opacity', op == null ? 1 : op); }

    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      var Tm = st.t != null ? st.t : now / 1000;
      if (st.t == null) {
        if (st.run && st.p < 1) st.p = Math.min(1, st.p + dt / (st.mode === 'acide' ? 12 : 14));
        if (st.sodaOn) st.soda = Math.min(1, st.soda + dt * 1.2);
        if (st.flameOn) st.flame = Math.min(1, st.flame + dt * 1.5);
        if (st.mode === 'tests') st.added = st.added.map(function (v) { return v > 0 && v < 1 ? Math.min(1, v + dt * 1.2) : v; });
      }
      A.style.display = st.mode === 'acide' ? '' : 'none'; C.style.display = st.mode === 'cuivre' ? '' : 'none'; T.style.display = st.mode === 'tests' ? '' : 'none';
      var res = { mode: st.mode, p: st.p }, obs = '', eqs = '', l2 = '', l3 = '', cap = '';
      // compte-gouttes
      var dx = st.mode === 'acide' ? TX + TW / 2 : st.mode === 'cuivre' ? BX + 70 : tubes[st.sel].x + 28, dy = st.mode === 'cuivre' ? 130 : st.mode === 'acide' ? 60 : 110;
      var sk = st.mode === 'tests' ? st.added[st.sel] : st.soda;
      drop.style.display = sk > 0 && sk < 1 ? '' : 'none'; at(drop, dx, dy); dropD.style.display = sk > 0 && sk < 0.6 ? '' : 'none'; attr(dropD, { cx: dx, cy: dy + 6 + (sk * 300 % 60) });
      if (st.mode === 'acide') {
        var p = st.p, rate = st.p < 1 && (st.run || st.t != null) ? 1 - p * 0.85 : 0;
        aLiq.setAttribute('fill', mixc('#CFE8FF', '#9BE7A5', p)); aLiq.setAttribute('opacity', 0.16 + p * 0.2);
        wool.setAttribute('transform', 'translate(' + (TX + 44) * (1 - (1 - p * 0.7)) + ' ' + (TB - 24) * (1 - (1 - p * 0.7)) + ') scale(' + (1 - p * 0.7) + ')');
        B.forEach(function (b, k) { var ph = ((Tm * 0.7 + k * 0.137) % 1), on = rate > 0 && k / B.length < rate; b.style.display = on ? '' : 'none'; attr(b, { cx: TX + 24 + ((k * 23) % 50) + Math.sin(Tm * 3 + k) * 3, cy: TB - 30 - ph * (TB - 30 - TL), opacity: 1 - ph * 0.5 }); });
        var gp = st.soda * (p > 0.15 ? 1 : 0); aP.setAttribute('opacity', gp); aPP.forEach(function (c) { c.setAttribute('fill', '#4E8F4A'); });
        flame.style.display = st.flame > 0 ? '' : 'none'; at(flame, TX + TW / 2 + 70 - st.flame * 70, TY - 34 + (1 - st.flame) * 10);
        var popNow = st.flame > 0.8 && p > 0.08; if (popNow && !st.popped && st.t == null) { st.popped = true; st.popAt = Tm; o.onPop && o.onPop(); }
        var pv = st.popped && Tm - (st.popAt || 0) < 1.6; pop.style.display = pv ? '' : 'none'; if (pv) pop.setAttribute('transform', 'translate(' + (TX + TW / 2) + ' ' + (TY - 40) + ') scale(' + (0.9 + 0.1 * Math.sin(Tm * 20)) + ')');
        obs = p < 0.02 ? 'rien pour l’instant' : st.popped ? 'détonation : dihydrogène !' : gp > 0.5 ? 'précipité vert : ions fer II' : p < 1 ? 'effervescence, le fer disparaît' : 'le fer a disparu, solution vert pâle';
        eqs = 'Fe + 2 H^{+} → Fe^{2+} + H_{2}'; l2 = 'L’atome de fer perd 2 électrons :'; l3 = 'il devient un ion fer II.';
        res.popped = st.popped; res.green = gp > 0.5;
      } else if (st.mode === 'cuivre') {
        var q = st.p;
        cLiq.setAttribute('fill', mixc('#3D8BFF', '#8FD9A0', q)); cLiq.setAttribute('opacity', 0.55 - q * 0.22);
        D.forEach(function (d, k) { d.setAttribute('opacity', k / D.length < q ? 1 : 0); }); depL.setAttribute('opacity', q * 0.8);
        cP.setAttribute('opacity', st.soda); var pc = q < 0.6 ? '#2F6BFF' : '#4E8F4A'; cPP.forEach(function (c) { c.setAttribute('fill', pc); });
        obs = q < 0.02 ? 'solution bleue (ions cuivre II)' : st.soda > 0.5 ? 'précipité ' + (q < 0.6 ? 'bleu : ions cuivre II' : 'vert : ions fer II') : q < 1 ? 'dépôt rouge de cuivre, la solution se décolore' : 'solution verdâtre, clou couvert de cuivre';
        eqs = 'Cu^{2+} + Fe → Cu + Fe^{2+}'; l2 = 'L’ion cuivre II gagne 2 électrons :'; l3 = 'il devient du cuivre métal.';
        res.green = q > 0.9;
      } else {
        tubes.forEach(function (tb, k) { tb.pg.setAttribute('opacity', st.added[k]); tb.lab.style.display = st.labels ? '' : 'none'; tb.q.style.display = st.labels ? 'none' : ''; tb.sel.style.display = k === st.sel ? '' : 'none'; });
        var io = IONS[st.sel]; obs = st.added[st.sel] > 0.5 ? 'précipité ' + io.pn : 'ajoute la soude';
        eqs = st.added[st.sel] > 0.5 ? io.eq : 'ion + soude → ?'; l2 = st.labels || st.added[st.sel] > 0.5 ? 'Précipité ' + io.pn + ' : ' + io.n : 'Ajoute quelques gouttes de soude'; l3 = 'Les ions se reconnaissent à leur précipité.';
        res.sel = st.sel; res.added = st.added.slice();
      }
      // loupe
      var c4 = (Tm % 5) / 5, cx = IX + IW / 2; if (st.t == null && st.mode !== 'tests' && !st.run) c4 = st.p >= 1 ? 0.95 : 0.02;
      [mA, mB, mB2, mC, eA, eB, h2, hoG, solid, solidT].forEach(function (e) { e.style.display = 'none'; });
      surf.style.display = st.mode === 'tests' ? 'none' : ''; surfL.style.display = surf.style.display;
      if (st.mode === 'acide') {
        var f = L(c4, 0.15, 0.45);
        mA.style.display = ''; at(mA, cx - 50, IY + 178 - f * 90); setRich(mA._t, f > 0.5 ? 'Fe^{2+}' : 'Fe', 17); mA.firstChild.setAttribute('fill', f > 0.5 ? '#9BE7A5' : '#9AA6BC');
        var g2 = L(c4, 0.45, 0.7), hh = L(c4, 0.7, 0.85);
        if (c4 < 0.7) { mB.style.display = ''; mB2.style.display = ''; at(mB, cx + 40, IY + 80); at(mB2, cx + 90, IY + 120); }
        if (c4 > 0.2 && c4 < 0.7) { eA.style.display = ''; eB.style.display = ''; at(eA, cx - 50 + (90) * g2, IY + 160 - 80 * g2); at(eB, cx - 50 + 140 * g2, IY + 160 - 40 * g2); }
        if (c4 >= 0.7) { h2.style.display = ''; at(h2, cx + 65, IY + 100 - hh * 50, 1 - hh * 0.3); }
        cap = 'Fe → Fe^{2+} + 2 e^{−}';
      } else if (st.mode === 'cuivre') {
        var a1 = L(c4, 0, 0.35), a2 = L(c4, 0.35, 0.6), a3 = L(c4, 0.6, 0.9);
        mC.style.display = ''; at(mC, cx + 70 - a1 * 70, IY + 60 + a1 * 118); setRich(mC._t, c4 > 0.6 ? 'Cu' : 'Cu^{2+}', 17); mC.firstChild.setAttribute('fill', c4 > 0.6 ? '#D9783F' : '#4A9BFF');
        mA.style.display = ''; at(mA, cx - 60, IY + 178 - a3 * 100); setRich(mA._t, c4 > 0.45 ? 'Fe^{2+}' : 'Fe', 17); mA.firstChild.setAttribute('fill', c4 > 0.45 ? '#9BE7A5' : '#9AA6BC');
        if (c4 > 0.35 && c4 < 0.6) { eA.style.display = ''; eB.style.display = ''; at(eA, cx - 60 + 60 * a2, IY + 178); at(eB, cx - 60 + 60 * a2, IY + 190); }
        cap = 'Cu^{2+} + 2 e^{−} → Cu';
      } else {
        var io2 = IONS[st.sel], nHO = io2.eq.indexOf('3 HO') >= 0 ? 3 : 2, j = L(c4, 0.1, 0.55), sh = c4 > 0.55;
        mA.style.display = sh ? 'none' : ''; at(mA, cx, IY + 120); setRich(mA._t, io2.f, 15); mA.firstChild.setAttribute('fill', io2.sol[0]);
        HO.forEach(function (h, k) { h.style.display = k < nHO && !sh ? '' : 'none'; var ang = k / nHO * Math.PI * 2 - Math.PI / 2, R = 110 - 70 * j; at(h, cx + R * Math.cos(ang), IY + 130 + R * 0.7 * Math.sin(ang)); });
        hoG.style.display = '';
        solid.style.display = sh ? '' : 'none'; solidT.style.display = solid.style.display; attr(solid, { x: cx - 50, y: IY + 100, width: 100, height: 44, fill: io2.pp }); attr(solidT, { x: cx, y: IY + 128 }); setRich(solidT, io2.eq.split('→ ')[1], 15);
        cap = 'les ions HO^{−} de la soude précipitent';
      }
      if (cap !== lastCap) { setRich(mCap, cap, 12); lastCap = cap; }
      if (eqs !== lastEq) { setRich(eq, eqs, 19); lastEq = eqs; }
      eq2.textContent = l2; eq3.textContent = l3;
      res.obs = obs;
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le fer dans l’acide' }, { t: 14, title: 'Identifier ce qui se forme' }, { t: 27, title: 'L’ion cuivre devient métal' }, { t: 43, title: 'Reconnaître les ions' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['<b>Métal → ion</b> : le fer est attaqué par l’acide', 'Fe + 2 H⁺ → Fe²⁺ + H₂ ; l’atome de fer perd 2 électrons.', '#9BE7A5'],
      ['<b>Ion → métal</b> : les ions cuivre II se déposent', 'Cu²⁺ + Fe → Cu + Fe²⁺ ; l’ion gagne 2 électrons.', '#D9783F'],
      ['La <b>soude</b> identifie les ions', 'Cu²⁺ bleu, Fe²⁺ vert, Fe³⁺ rouille, Zn²⁺ et Al³⁺ blancs.', 'var(--blue)']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t;
        if (t < 27) { st.mode = 'acide'; st.p = 0.9 * K.k(t, 3, 14); st.flame = K.k(t, 17, 1.4); st.popped = t > 18.4; st.popAt = 18.4; if (t > 21) st.flame = 0; st.soda = K.k(t, 22, 1.6); }
        else if (t < 43) { st.mode = 'cuivre'; st.p = K.k(t, 28, 11); st.soda = K.k(t, 39.5, 1.6); st.flame = 0; st.popped = false; }
        else { st.mode = 'tests'; st.soda = 0; st.labels = true; var ix = Math.min(4, Math.max(0, Math.floor((t - 43.5) / 2.4))); st.sel = ix; st.added = [0, 1, 2, 3, 4].map(function (k) { return K.k(t, 43.6 + k * 2.4, 1.2); }); }
        lab.step();
        tg.show(t, 4, 13.6, 250, 92, 'Effervescence : un gaz se dégage') || tg.show(t, 18.4, 20.8, 250, 92, 'Le gaz est du dihydrogène') || tg.show(t, 23, 26.6, 250, 92, 'Précipité vert : ions fer II') ||
          tg.show(t, 31, 38.8, 250, 92, 'Dépôt rouge de cuivre, la solution pâlit') || tg.show(t, 40.4, 42.6, 250, 92, 'Précipité vert : ions fer II');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : de la paille de fer dans l’acide chlorhydrique produit des bulles de dihydrogène et des ions fer II ; un clou de fer dans du sulfate de cuivre se couvre de cuivre ; puis cinq tests à la soude donnent des précipités de couleurs différentes, avec une loupe à l’échelle des atomes',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 4, say: 'Mettons un peu de paille de fer dans de l’acide chlorhydrique.', sub: 'Du <b>fer</b> dans de l’<b>acide chlorhydrique</b>…' },
      { t: 4.2, d: 9.4, say: 'Des bulles apparaissent, le fer disparaît peu à peu et la solution devient vert pâle. À l’échelle des atomes, chaque atome de fer perd deux électrons.', sub: 'Effervescence, le fer disparaît : il <b>perd 2 électrons</b>.' },
      { t: 14, d: 3, say: 'Que se forme-t-il ? Approchons une flamme.', sub: 'Approchons une <b>flamme</b>…' },
      { t: 17.4, d: 4.2, say: 'Une petite détonation : le gaz est du dihydrogène.', sub: 'Détonation : c’est du <b>dihydrogène</b> H₂.' },
      { t: 21.8, d: 5, say: 'Ajoutons de la soude : un précipité vert apparaît. La solution contient des ions fer deux.', sub: 'Précipité vert : des <b>ions fer II</b> Fe²⁺.' },
      { t: 27, d: 4, say: 'Faisons l’inverse : plongeons un clou de fer dans une solution bleue de sulfate de cuivre.', sub: 'Un clou de fer dans du <b>sulfate de cuivre</b>…' },
      { t: 31.2, d: 8, say: 'Un dépôt rouge de cuivre recouvre le clou et la solution perd sa couleur bleue : les ions cuivre deux gagnent deux électrons et deviennent du cuivre métal.', sub: 'Dépôt de <b>cuivre</b> : l’ion Cu²⁺ <b>gagne 2 électrons</b>.' },
      { t: 39.4, d: 3.4, say: 'La soude le confirme : il s’est formé des ions fer deux.', sub: 'Le fer, lui, devient des ions <b>Fe²⁺</b>.' },
      { t: 43, d: 12.4, say: 'La soude permet de reconnaître les ions : bleu pour le cuivre deux, vert pour le fer deux, rouille pour le fer trois, blanc pour le zinc et l’aluminium.', sub: 'Cu²⁺ <b>bleu</b>, Fe²⁺ <b>vert</b>, Fe³⁺ <b>rouille</b>, Zn²⁺ et Al³⁺ <b>blancs</b>.' },
      { t: 56, d: 4.4, say: 'À retenir : un métal peut se transformer en ion en perdant des électrons.', sub: 'Métal → ion : <b>perte</b> d’électrons.' },
      { t: 60.6, d: 4.2, say: 'Un ion métallique peut redevenir métal en gagnant des électrons.', sub: 'Ion → métal : <b>gain</b> d’électrons.' },
      { t: 65, d: 5, say: 'Et la soude permet d’identifier les ions grâce à la couleur du précipité.', sub: 'La <b>soude</b> identifie les ions.' }
    ],
    learn: [
      { t: 13, ch: 0, html: 'Le fer réagit avec l’acide : <b>Fe → Fe²⁺</b>, il perd 2 électrons.' },
      { t: 26, ch: 1, html: 'Le gaz est du <b>dihydrogène</b> ; la soude révèle les ions <b>fer II</b>.' },
      { t: 42, ch: 2, html: '<b>Cu²⁺ → Cu</b> : l’ion gagne 2 électrons et devient métal.' },
      { t: 55, ch: 3, html: 'Précipités : Cu²⁺ bleu, Fe²⁺ vert, Fe³⁺ rouille, Zn²⁺/Al³⁺ blancs.' }
    ],
    question: { q: 'Avec la soude, une solution donne un précipité rouille. Elle contient des ions :', o: ['cuivre II', 'fer II', 'fer III', 'zinc'], a: 2, e: 'Précipité rouille : ions fer III Fe³⁺.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Paillasse de chimie : tube d’acide avec du fer, bécher de sulfate de cuivre avec un clou, ou série de tubes à essais pour les tests à la soude ; loupe à l’échelle des atomes et bilan de la réaction',
    steps: [
      'Fer + acide : lance la réaction, puis approche une flamme et ajoute la soude. Qu’observes-tu ?',
      'Clou + sulfate de cuivre : lance la réaction et observe le clou et la couleur de la solution.',
      'Tests : ajoute la soude dans chaque tube et note la couleur du précipité.',
      'Relève tes observations dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onPop: function () { api.sound('ok'); } }), st = lab.st, c = api.c, rows = [];
      function resetExp() { st.p = 0; st.run = false; st.soda = 0; st.sodaOn = false; st.flame = 0; st.flameOn = false; st.popped = false; }
      var cM = c.seg({ label: 'Expérience', value: 'acide', options: [{ v: 'acide', l: 'Fer + acide' }, { v: 'cuivre', l: 'Clou + sulfate de cuivre' }, { v: 'tests', l: 'Tests à la soude' }], onChange: function (v) { st.mode = v; resetExp(); vis(); } });
      var r1 = c.row();
      var bRun = c.button({ label: 'Lancer la réaction', primary: true, sm: true, into: r1, onClick: function () { st.run = !st.run; paintRun(); } });
      var bFl = c.button({ label: 'Approcher une flamme', sm: true, into: r1, onClick: function () { st.flameOn = true; st.flame = 0.01; } });
      var bSo = c.button({ label: 'Ajouter de la soude', sm: true, into: r1, onClick: function () { if (st.mode === 'tests') { if (!st.added[st.sel]) st.added[st.sel] = 0.01; } else { st.sodaOn = true; st.soda = Math.max(st.soda, 0.01); } } });
      var bRe = c.button({ label: 'Recommencer', sm: true, into: r1, onClick: function () { resetExp(); st.added = [0, 0, 0, 0, 0]; paintRun(); } });
      var cT = c.seg({ label: 'Tube', value: 0, options: IONS.map(function (io, k) { return { v: k, l: io.n }; }), onChange: function (v) { st.sel = v; } });
      function paintRun() { bRun.textContent = st.run ? 'Pause' : st.p > 0 ? 'Reprendre' : 'Lancer la réaction'; }
      function vis() { var t = st.mode === 'tests'; bRun.style.display = t ? 'none' : ''; bFl.style.display = st.mode === 'acide' ? '' : 'none'; cT.hide(!t); paintRun(); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Avancement' }, { k: 'o', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.a.set(st.mode === 'tests' ? '—' : Math.round(st.p * 100) + ' %'); ro.o.set(last.obs); if (st.p >= 1 && st.run) { st.run = false; paintRun(); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ a: st.mode === 'acide' ? 'fer + acide' : st.mode === 'cuivre' ? 'clou + sulfate de cuivre' : 'soude + ' + IONS[st.sel].n, r: last.obs }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.a + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>';
        api.chart.innerHTML = '<h3>Tests d’identification à la soude</h3><table class="mt"><thead><tr><th>Ion</th><th>Précipité</th></tr></thead><tbody>' + IONS.map(function (io) { return '<tr><td>' + io.n + '</td><td><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + io.pp + ';margin-right:6px;vertical-align:-1px"></span>' + io.pn + '</td></tr>'; }).join('') + '</tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'acide'; resetExp(); st.added = [0, 0, 0, 0, 0]; st.sel = 0; cM.set('acide'); cT.set(0); vis(); rows = []; paint(); });
      api.say('Lance la réaction entre le fer et l’acide.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p><b>Métal → ion</b> : le fer réagit avec l’acide chlorhydrique. Il se forme du <b>dihydrogène</b> (détonation à la flamme) et des <b>ions fer II</b> (précipité vert avec la soude) : Fe + 2 H<sup>+</sup> → Fe<sup>2+</sup> + H<sub>2</sub>. L’atome de fer a perdu 2 électrons.</p><p><b>Ion → métal</b> : dans le sulfate de cuivre, le clou se couvre de cuivre et la solution se décolore : Cu<sup>2+</sup> + Fe → Cu + Fe<sup>2+</sup>. L’ion cuivre II a gagné 2 électrons.</p><p>La soude identifie les ions : Cu<sup>2+</sup> bleu, Fe<sup>2+</sup> vert, Fe<sup>3+</sup> rouille, Zn<sup>2+</sup> et Al<sup>3+</sup> blancs.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Expérience de chimie' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du chimiste',
    intro: 'Tubes, soude et flamme : mène l’enquête comme un vrai chimiste !',
    missions: [
      { title: 'Le gaz mystère', text: 'Fais réagir le fer avec l’acide, puis <span style="color:var(--amber)">prouve</span> que le gaz est du dihydrogène.', lumi: 'Le dihydrogène a une signature sonore…', hint: 'Lance la réaction, puis approche une flamme.',
        build: function (api) { var lab = mini(api, { mode: 'acide' }); var r = api.c.row(); api.c.button({ label: 'Lancer la réaction', sm: true, into: r, onClick: function () { lab.st.run = true; } }); api.c.button({ label: 'Approcher une flamme', sm: true, into: r, onClick: function () { lab.st.flameOn = true; lab.st.flame = 0.01; } }); return function () { return lab.res().popped ? { ok: true, msg: 'POP ! C’est du dihydrogène.' } : { ok: false, msg: 'Pas de détonation pour l’instant.' }; }; },
        e: 'Le dihydrogène produit une petite détonation au contact d’une flamme.' },
      { title: 'Adieu le bleu', text: 'Laisse agir le clou jusqu’à ce que la solution ait <span style="color:var(--amber)">perdu sa couleur bleue</span>.', lumi: 'Les ions cuivre II sont bleus… où vont-ils ?', hint: 'Lance la réaction et attends la fin.',
        build: function (api) { var lab = mini(api, { mode: 'cuivre' }); var b = api.c.button({ label: 'Lancer la réaction', sm: true, onClick: function () { lab.st.run = true; } }); return function () { return lab.res().green ? { ok: true, msg: 'Les ions Cu²⁺ sont devenus du cuivre sur le clou.' } : { ok: false, msg: 'La solution est encore bleue.' }; }; },
        e: 'Les ions cuivre II gagnent des électrons et se déposent : la couleur bleue disparaît.' },
      { type: 'qcm', title: 'Précipité rouille', text: 'La soude donne un précipité rouille. La solution contient :', o: ['des ions cuivre II', 'des ions fer II', 'des ions fer III', 'des ions zinc'], a: 2, hint: 'Rouille… comme le fer qui a rouillé.', e: 'Précipité rouille : ions fer III Fe³⁺.' },
      { title: 'Enquête', text: 'Les étiquettes ont disparu ! Trouve le tube qui contient des <span style="color:#9BE7A5">ions fer II</span> : teste-le à la soude.', lumi: 'Teste les tubes un par un…', hint: 'Les ions fer II donnent un précipité vert.',
        build: function (api) { var lab = mini(api, { mode: 'tests', labels: false }); api.c.seg({ label: 'Tube', value: 0, options: ['A', 'B', 'C', 'D', 'E'].map(function (l, k) { return { v: k, l: l }; }), onChange: function (v) { lab.st.sel = v; } }); api.c.button({ label: 'Ajouter de la soude', sm: true, onClick: function () { if (!lab.st.added[lab.st.sel]) lab.st.added[lab.st.sel] = 0.01; } }); return function () { var r = lab.res(); return r.sel === 1 && r.added[1] > 0.5 ? { ok: true, msg: 'Tube B : précipité vert, ions fer II !' } : { ok: false, msg: r.added[r.sel] > 0.5 ? 'Ce précipité n’est pas vert.' : 'Teste ce tube avec la soude.' }; }; },
        e: 'Le précipité vert signe la présence d’ions fer II.' },
      { type: 'qcm', title: 'Électrons', text: 'Quand le fer devient l’ion Fe²⁺, l’atome de fer :', o: ['gagne 2 électrons', 'perd 2 électrons', 'perd 2 protons', 'ne change pas'], a: 1, hint: 'Un ion positif a moins d’électrons que de protons.', e: 'Fe → Fe²⁺ + 2 e⁻ : il perd 2 électrons.' }
    ]
  };

  S.start({
    id: '4e-metal-ion', level: '4e', theme: 'Les ions', title: 'Transformation d’un métal en ion et inversement', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le fer réagit avec l’acide chlorhydrique : il se forme du <b>dihydrogène</b> (détonation à la flamme) et des <b>ions fer II</b>. Bilan : Fe + 2 H<sup>+</sup> → Fe<sup>2+</sup> + H<sub>2</sub>.',
      '<b>Métal → ion</b> : l’atome de fer <b>perd 2 électrons</b> et devient l’ion Fe<sup>2+</sup>.',
      'Le fer réagit avec les ions cuivre II : du cuivre se dépose et la solution se décolore. Bilan : Cu<sup>2+</sup> + Fe → Cu + Fe<sup>2+</sup>.',
      '<b>Ion → métal</b> : l’ion Cu<sup>2+</sup> <b>gagne 2 électrons</b> et devient l’atome de cuivre.',
      'Tests à la soude : Cu<sup>2+</sup> → précipité <b>bleu</b> ; Fe<sup>2+</sup> → <b>vert</b> ; Fe<sup>3+</sup> → <b>rouille</b> ; Zn<sup>2+</sup> et Al<sup>3+</sup> → <b>blanc</b>.'
    ],
    quiz: [
      { q: 'Le gaz dégagé par le fer dans l’acide chlorhydrique est :', o: ['le dioxygène', 'le dihydrogène', 'le dioxyde de carbone', 'la vapeur d’eau'], a: 1, e: 'Il produit une détonation à la flamme.' },
      { q: 'La soude donne un précipité bleu avec les ions :', o: ['fer II', 'cuivre II', 'zinc', 'aluminium'], a: 1, e: 'Cu²⁺ + 2 HO⁻ → Cu(HO)₂, bleu.' },
      { q: 'Dans Cu²⁺ + Fe → Cu + Fe²⁺, l’ion cuivre II :', o: ['perd 2 électrons', 'gagne 2 électrons', 'perd 2 protons', 'reste inchangé'], a: 1, e: 'Il devient du cuivre métal.' },
      { q: 'Précipité vert avec la soude :', o: ['ions fer II', 'ions fer III', 'ions cuivre II', 'ions zinc'], a: 0, e: 'Fe(HO)₂ est vert.' },
      { q: 'Un métal qui devient ion :', o: ['gagne des électrons', 'perd des électrons', 'gagne des protons', 'perd des neutrons'], a: 1, e: 'Il devient un ion positif.' }
    ]
  });
})();
