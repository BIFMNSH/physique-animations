/* 4e · Les ions · Leçon : Atomes et ions */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'];
  var NOM = ['', 'hydrogène', 'hélium', 'lithium', 'béryllium', 'bore', 'carbone', 'azote', 'oxygène', 'fluor', 'néon', 'sodium', 'magnésium', 'aluminium', 'silicium', 'phosphore', 'soufre', 'chlore', 'argon', 'potassium', 'calcium', 'scandium', 'titane', 'vanadium', 'chrome', 'manganèse', 'fer', 'cobalt', 'nickel', 'cuivre', 'zinc'];
  var NN = [0, 0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20, 24, 26, 28, 28, 30, 30, 32, 31, 35, 35];
  var ANION = { 7: 'nitrure', 8: 'oxyde', 9: 'fluorure', 16: 'sulfure', 17: 'chlorure' };
  var COL = { p: '#FF5A4E', n: '#9AA6BC', e: '#4FC3FF', cat: '#FFB547', an: '#3DD68C' };
  function info(Z, E) {
    var q = Z - E, nat = q === 0 ? 'atome' : q > 0 ? 'ion positif' : 'ion négatif';
    var name = q === 0 ? 'atome de ' + NOM[Z] : q > 0 ? 'ion ' + NOM[Z] : (ANION[Z] ? 'ion ' + ANION[Z] : 'ion ' + NOM[Z]);
    var sup = q === 0 ? '' : (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−');
    return { q: q, nat: nat, name: name, sym: SYM[Z], sup: sup, txt: SYM[Z] + sup };
  }
  function formula(G, x, y, sym, sup, fs, col, anchor) {
    var t = s('text', { x: x, y: y, 'font-size': fs, 'font-weight': 800, fill: col || '#EEF2F8', 'text-anchor': anchor || 'start' }, G);
    s('tspan', { text: sym }, t); if (sup) s('tspan', { dy: -fs * 0.42, 'font-size': fs * 0.6, text: sup }, t); return t;
  }
  function setFormula(t, sym, sup, fs) { t.childNodes[0].textContent = sym; if (t.childNodes[1]) t.removeChild(t.childNodes[1]); if (sup) s('tspan', { dy: -fs * 0.42, 'font-size': fs * 0.6, text: sup }, t); }
  var SOL = {
    dist: { l: 'eau distillée', ions: [], mol: 0, tint: '#7FB8FF', k: 0 },
    sucre: { l: 'eau sucrée', ions: [], mol: 14, tint: '#7FB8FF', k: 0 },
    sel: { l: 'eau salée', ions: [['Na', '+', 1], ['Cl', '−', -1]], mol: 0, tint: '#7FB8FF', k: 1 },
    cuivre: { l: 'sulfate de cuivre', ions: [['Cu', '2+', 1], ['SO4', '2−', -1]], mol: 0, tint: '#3D8BFF', k: 0.8 }
  };
  var GID = 0;
  function glow(G, col) { var id = 'ai' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.45, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'atom', Z: 6, N: 6, E: 6, sol: 'sel', on: true, t: null, fx: null, card: true, shown: 1 }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#070A14' }, G);
    /* ---------- ATOME ---------- */
    var A = s('g', {}, G), XC = 290, YC = 235, RINGS = [78, 124, 170], CAP = [2, 8, 20];
    s('circle', { cx: XC, cy: YC, r: 200, fill: glow(G, '#4FC3FF'), opacity: 0.25 }, A);
    var ringE = RINGS.map(function (r) { return s('circle', { cx: XC, cy: YC, r: r, fill: 'none', stroke: '#2B3A57', 'stroke-width': 1.5, 'stroke-dasharray': '4 6' }, A); });
    var nuc = s('g', {}, A), eG = s('g', {}, A), eP = [];
    for (var i = 0; i < 32; i++) { var e = s('g', {}, eG); s('circle', { r: 9, fill: COL.e }, e); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#06263A', text: '−' }, e); eP.push(e); }
    var fly = s('g', {}, A); s('circle', { r: 9, fill: COL.e }, fly); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#06263A', text: '−' }, fly);
    var nucKey = '';
    function drawNuc() {
      var key = st.Z + '/' + st.N + '/' + st.shown; if (key === nucKey) return; nucKey = key;
      while (nuc.firstChild) nuc.removeChild(nuc.firstChild);
      var n = st.Z + st.N, p = 0, q = 0, sc = st.shown;
      for (var j = 0; j < n; j++) {
        var isP = Math.floor((j + 1) * st.Z / n) > p;
        if (isP) p++; else q++;
        var r = 7.2 * Math.sqrt(j + 0.5) * sc, a = j * 2.39996;
        var g = s('g', { transform: 'translate(' + (XC + r * Math.cos(a)) + ' ' + (YC + r * Math.sin(a)) + ')' }, nuc);
        s('circle', { r: 7.5 * sc, fill: isP ? COL.p : COL.n, stroke: '#0008', 'stroke-width': 1 }, g);
        if (isP && sc > 0.6) s('text', { y: 3.6, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A0905', text: '+' }, g);
      }
    }
    var nucL = s('text', { x: XC, y: YC + RINGS[2] + 36, 'text-anchor': 'middle', 'font-size': 12, fill: '#7D89A3', text: 'modèle simplifié : noyau (protons + neutrons) et électrons' }, A);
    // carte d'identité
    var CD = s('g', {}, A), CX = 540;
    s('rect', { x: CX, y: 40, width: 300, height: 390, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, CD);
    s('text', { x: CX + 22, y: 70, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'CARTE D’IDENTITÉ' }, CD);
    s('rect', { x: CX + 22, y: 86, width: 104, height: 104, rx: 14, fill: '#1A2540', stroke: '#3B4E73', 'stroke-width': 2 }, CD);
    var cZ = s('text', { x: CX + 32, y: 106, 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7' }, CD);
    var cF = formula(CD, CX + 74, 160, 'C', '', 44, '#EEF2F8', 'middle');
    var cName = s('text', { x: CX + 142, y: 118, 'font-size': 16, 'font-weight': 800, fill: '#EEF2F8' }, CD);
    var cNat = s('text', { x: CX + 142, y: 146, 'font-size': 14, 'font-weight': 800 }, CD);
    var rows = [['protons', COL.p, '+'], ['électrons', COL.e, '−'], ['neutrons', COL.n, '0']].map(function (r, k) {
      var y = 230 + k * 46; s('circle', { cx: CX + 34, cy: y - 5, r: 10, fill: r[1] }, CD); s('text', { x: CX + 34, y: y - 1, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#0B1220', text: r[2] }, CD);
      s('text', { x: CX + 54, y: y, 'font-size': 15, fill: '#C9D2E3', text: r[0] }, CD); return s('text', { x: CX + 276, y: y, 'text-anchor': 'end', 'font-size': 20, 'font-weight': 800, fill: r[1] }, CD);
    });
    s('line', { x1: CX + 22, x2: CX + 278, y1: 360, y2: 360, stroke: '#2B3A57', 'stroke-width': 2 }, CD);
    s('text', { x: CX + 22, y: 395, 'font-size': 15, fill: '#C9D2E3', text: 'charge totale' }, CD);
    var cQ = s('text', { x: CX + 278, y: 397, 'text-anchor': 'end', 'font-size': 24, 'font-weight': 900 }, CD);
    var cQs = s('text', { x: CX + 22, y: 418, 'font-size': 12, fill: '#7D89A3' }, CD);
    /* ---------- SOLUTION ---------- */
    var B = s('g', {}, G), BX0 = 170, BX1 = 590, BY0 = 170, BY1 = 430, XA = 236, XK = 524;
    var lampG = s('circle', { cx: 380, cy: 100, r: 70, fill: glow(G, '#FFD27A') }, B);
    // fils
    var wire = 'M' + XA + ' 160 V100 H250 M300 100 H352 M408 100 H' + XK + ' V160';
    s('path', { d: wire, fill: 'none', stroke: '#C9D2E3', 'stroke-width': 3 }, B);
    var flow = s('path', { d: 'M' + XK + ' 160 V100 H408 M352 100 H300 M250 100 H' + XA + ' V160', fill: 'none', stroke: '#FFE29A', 'stroke-width': 3, 'stroke-dasharray': '4 16' }, B);
    s('rect', { x: 250, y: 80, width: 50, height: 40, rx: 6, fill: '#2A3346', stroke: '#47546E', 'stroke-width': 2 }, B);
    s('text', { x: 256, y: 76, 'font-size': 14, 'font-weight': 900, fill: '#FF8A80', text: '+' }, B); s('text', { x: 288, y: 76, 'font-size': 16, 'font-weight': 900, fill: '#80B8FF', text: '−' }, B);
    s('text', { x: 275, y: 144, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'générateur' }, B);
    var bulb = s('circle', { cx: 380, cy: 100, r: 22, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2.5 }, B);
    s('path', { d: 'M366 114 L394 86 M366 86 L394 114', stroke: '#C9D2E3', 'stroke-width': 2 }, B);
    s('text', { x: 380, y: 144, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'lampe' }, B);
    var liq = s('rect', { x: BX0 + 4, y: BY0 + 30, width: BX1 - BX0 - 8, height: BY1 - BY0 - 34, fill: '#7FB8FF', opacity: 0.16 }, B);
    s('path', { d: 'M' + BX0 + ' ' + BY0 + ' V' + (BY1 - 12) + ' q0 12 12 12 H' + (BX1 - 12) + ' q12 0 12 -12 V' + BY0, fill: 'none', stroke: '#9FD7FF', 'stroke-width': 3, opacity: 0.8 }, B);
    s('rect', { x: XA - 8, y: 150, width: 16, height: 240, rx: 3, fill: '#5B6680' }, B); s('rect', { x: XK - 8, y: 150, width: 16, height: 240, rx: 3, fill: '#5B6680' }, B);
    s('text', { x: XA, y: 410, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#FF8A80', text: '+' }, B); s('text', { x: XK, y: 410, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#80B8FF', text: '−' }, B);
    var parts = s('g', {}, B), P = [];
    for (i = 0; i < 28; i++) { var pg = s('g', {}, parts), c0 = s('circle', { r: 11 }, pg), t0 = s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#0B1220' }, pg); P.push({ g: pg, c: c0, t: t0, x: BX0 + 30 + ((i * 97) % (BX1 - BX0 - 60)), y: BY0 + 50 + ((i * 53) % (BY1 - BY0 - 80)), ph: i * 1.7 }); }
    var LG = s('g', {}, B), LX = 620;
    s('rect', { x: LX, y: 150, width: 220, height: 280, rx: 16, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, LG);
    var lTitle = s('text', { x: LX + 18, y: 178, 'font-size': 15, 'font-weight': 800, fill: '#EEF2F8' }, LG);
    var lRow = [0, 1, 2].map(function (k) { var y = 216 + k * 40; return { c: s('circle', { cx: LX + 30, cy: y - 5, r: 11 }, LG), s: s('text', { x: LX + 30, y: y - 1, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#0B1220' }, LG), f: formula(LG, LX + 52, y, '', '', 15, '#C9D2E3') }; });
    var lCur = s('text', { x: LX + 18, y: 360, 'font-size': 16, 'font-weight': 800 }, LG);
    var lNote = s('text', { x: LX + 18, y: 386, 'font-size': 12, fill: '#A9B4C7' }, LG), lNote2 = s('text', { x: LX + 18, y: 404, 'font-size': 12, fill: '#A9B4C7' }, LG);
    var last = performance.now();

    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      var T = st.t != null ? st.t : now / 1000;
      A.style.display = st.mode === 'atom' ? '' : 'none'; B.style.display = st.mode === 'sol' ? '' : 'none';
      var I = info(st.Z, st.E), res = { Z: st.Z, N: st.N, E: st.E, info: I };
      if (st.mode === 'atom') {
        drawNuc();
        var left = st.E, k = 0;
        for (var r = 0; r < 3; r++) {
          var n = Math.min(CAP[r], left); left -= n; ringE[r].setAttribute('opacity', n ? 1 : 0.25);
          for (var j = 0; j < n; j++) { var a = j / n * Math.PI * 2 + T * (0.9 - r * 0.22) * (r % 2 ? -1 : 1); eP[k].setAttribute('transform', 'translate(' + (XC + RINGS[r] * Math.cos(a)) + ' ' + (YC + RINGS[r] * Math.sin(a)) + ')'); eP[k].style.display = ''; k++; }
        }
        for (; k < eP.length; k++) eP[k].style.display = 'none';
        if (st.fx) { var d = st.fx.dir > 0 ? 1 - st.fx.p : st.fx.p, R = RINGS[2] + d * 260; fly.setAttribute('transform', 'translate(' + (XC + R * Math.cos(-0.6)) + ' ' + (YC + R * Math.sin(-0.6)) + ')'); fly.setAttribute('opacity', 1 - d * 0.6); fly.style.display = st.fx.p > 0 && st.fx.p < 1 ? '' : 'none'; } else fly.style.display = 'none';
        CD.style.display = st.card ? '' : 'none';
        cZ.textContent = 'Z = ' + st.Z; setFormula(cF, I.sym, I.sup, 44); cName.textContent = I.name; cNat.textContent = I.nat; cNat.setAttribute('fill', I.q === 0 ? '#3DD68C' : I.q > 0 ? COL.cat : '#4FC3FF');
        rows[0].textContent = st.Z; rows[1].textContent = st.E; rows[2].textContent = st.N;
        cQ.textContent = I.q === 0 ? '0' : (I.q > 0 ? '+' : '−') + Math.abs(I.q) + ' e'; cQ.setAttribute('fill', I.q === 0 ? '#3DD68C' : I.q > 0 ? COL.cat : '#4FC3FF');
        cQs.textContent = '(+' + st.Z + ') + (−' + st.E + ') = ' + (I.q > 0 ? '+' : I.q < 0 ? '−' : '') + Math.abs(I.q);
      } else {
        var So = SOL[st.sol], cond = st.on && So.k > 0, cur = st.on ? So.k : 0;
        liq.setAttribute('fill', So.tint); liq.setAttribute('opacity', st.sol === 'cuivre' ? 0.32 : 0.16);
        lampG.setAttribute('opacity', cur); bulb.setAttribute('fill', cur ? '#FFE9A8' : '#2A3346');
        flow.style.display = cond ? '' : 'none'; flow.setAttribute('stroke-dashoffset', -T * 40);
        P.forEach(function (p, i) {
          var kind = null, lab = '';
          if (So.ions.length) { kind = i % 2 ? 1 : 0; } else if (i < So.mol) kind = 2;
          if (kind === null) { p.g.style.display = 'none'; return; } p.g.style.display = '';
          var dir = kind === 0 ? 1 : kind === 1 ? -1 : 0, v = cond ? 38 * cur : 0;
          p.x += dir * v * dt + Math.sin(T * 1.3 + p.ph) * 0.35; p.y += Math.cos(T * 1.1 + p.ph * 1.3) * 0.35;
          if (p.x > XK - 20) p.x = XA + 22; if (p.x < XA + 20) p.x = XK - 22;
          if (p.y < BY0 + 46) p.y = BY0 + 46; if (p.y > BY1 - 20) p.y = BY1 - 20;
          var x = p.x, y = p.y;
          if (st.t != null) { x = XA + 22 + (((p.ph * 60 + dir * T * v) % (XK - XA - 44)) + (XK - XA - 44)) % (XK - XA - 44); y = p.y; }
          p.g.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
          p.c.setAttribute('fill', kind === 0 ? COL.cat : kind === 1 ? COL.an : '#C9D2E3'); p.c.setAttribute('r', kind === 2 ? 9 : 11);
          p.t.textContent = kind === 0 ? '+' : kind === 1 ? '−' : '';
        });
        lTitle.textContent = So.l;
        var L = So.ions.length ? [[COL.cat, '+', So.ions[0]], [COL.an, '−', So.ions[1]]] : So.mol ? [['#C9D2E3', '', ['molécule de sucre', '']]] : [];
        lRow.forEach(function (r, k) { var x = L[k]; [r.c, r.s, r.f].forEach(function (e) { e.style.display = x ? '' : 'none'; }); if (!x) return; r.c.setAttribute('fill', x[0]); r.s.textContent = x[1]; setFormula(r.f, x[2][0], x[2][1], 15); });
        if (!L.length) { lRow[0].f.style.display = ''; setFormula(lRow[0].f, 'molécules d’eau seulement', '', 15); }
        lCur.textContent = cond ? 'La lampe brille : courant' : st.on ? 'La lampe ne brille pas' : 'Circuit ouvert'; lCur.setAttribute('fill', cond ? '#FFC773' : '#A9B4C7');
        lNote.textContent = cond ? 'Ions + vers l’électrode −,' : So.ions.length ? '' : 'Pas d’ions : la solution'; lNote2.textContent = cond ? 'ions − vers l’électrode +.' : So.ions.length ? '' : 'ne conduit pas le courant.';
        res.cond = cond; res.sol = So.l;
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’atome' }, { t: 13, title: 'Un atome est neutre' }, { t: 25, title: 'Les ions' }, { t: 41, title: 'Les ions en solution' }, { t: 54, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { Z: 6, N: 6, E: 0, card: false, shown: 0 }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’atome : un <b>noyau</b> et des <b>électrons</b>', 'le noyau contient des protons (+) et des neutrons ; les électrons (−) tournent autour.', COL.e],
      ['Un atome est <b>électriquement neutre</b>', 'autant de protons que d’électrons.', '#3DD68C'],
      ['Un <b>ion</b> : atome qui a perdu ou gagné des électrons', 'ion positif (Na⁺, Cu²⁺) s’il en perd ; ion négatif (Cl⁻) s’il en gagne.', COL.cat]], [54.2, 58.6, 63]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 54.2)) {
        st.t = t; st.fx = null;
        if (t < 25) { st.mode = 'atom'; st.Z = 6; st.N = 6; st.shown = Math.max(0.05, K.k(t, 0.6, 2)); st.E = Math.round(6 * K.k(t, 4.6, 3)); st.card = t > 13; }
        else if (t < 33) { st.mode = 'atom'; st.Z = 11; st.N = 12; st.shown = 1; st.card = true; var p = K.k(t, 28, 2.4); st.E = p < 0.05 ? 11 : 10; st.fx = { dir: 1, p: p }; }
        else if (t < 41) { st.mode = 'atom'; st.Z = 17; st.N = 18; st.shown = 1; st.card = true; var q = K.k(t, 35, 2.4); st.E = q < 0.98 ? 17 : 18; st.fx = { dir: -1, p: q }; }
        else { st.mode = 'sol'; st.sol = 'sel'; st.on = t > 44; }
        lab.step();
        tg.show(t, 1.4, 4.4, 290, 92, 'Le noyau : protons et neutrons') || tg.show(t, 5, 12.6, 290, 92, 'Les électrons tournent autour du noyau') || tg.show(t, 15, 24.6, 290, 92, '6 protons (+), 6 électrons (−) : neutre') ||
          tg.show(t, 28, 32.6, 290, 92, 'Le sodium perd un électron → Na+') || tg.show(t, 35, 40.6, 290, 92, 'Le chlore gagne un électron → Cl−');
      }
      bg.setAttribute('opacity', t > 53.8 ? 1 : 0);
      K.group(g5, t, 53.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : construction d’un atome de carbone (noyau et électrons), puis un atome de sodium qui perd un électron et un atome de chlore qui en gagne un, et enfin des ions qui se déplacent dans l’eau salée et font briller une lampe',
    duration: 68, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'Toute la matière est faite d’atomes. Au centre de l’atome se trouve le noyau.', sub: 'Au centre de l’atome : le <b>noyau</b>.' },
      { t: 4.6, d: 8, say: 'Le noyau contient des protons, chargés positivement, et des neutrons. Autour, des électrons chargés négativement forment le nuage électronique.', sub: 'Protons (+), neutrons, et <b>électrons</b> (−) autour.' },
      { t: 13, d: 5.6, say: 'Voici un atome de carbone : six protons et six électrons.', sub: 'Carbone : <b>6 protons</b>, <b>6 électrons</b>.' },
      { t: 18.8, d: 6, say: 'Les charges se compensent exactement : un atome est électriquement neutre.', sub: 'Un atome est <b>électriquement neutre</b>.' },
      { t: 25, d: 3, say: 'Mais un atome peut perdre ou gagner des électrons.', sub: 'Un atome peut <b>perdre</b> ou <b>gagner</b> des électrons.' },
      { t: 28.2, d: 6.4, say: 'L’atome de sodium perd un électron : il devient un ion positif, l’ion sodium, noté Na plus.', sub: 'Il perd un électron : <b>ion positif</b> Na⁺.' },
      { t: 34.8, d: 6, say: 'L’atome de chlore gagne un électron : il devient un ion négatif, l’ion chlorure, noté Cl moins.', sub: 'Il gagne un électron : <b>ion négatif</b> Cl⁻.' },
      { t: 41, d: 3.4, say: 'Dans l’eau salée, il y a des ions sodium et des ions chlorure.', sub: 'L’eau salée contient des <b>ions</b>.' },
      { t: 44.6, d: 8.8, say: 'Fermons le circuit : les ions positifs vont vers une électrode, les ions négatifs vers l’autre. Le courant passe : la lampe brille.', sub: 'Les ions se déplacent : la solution <b>conduit le courant</b>.' },
      { t: 54, d: 4.4, say: 'À retenir : un atome a un noyau et des électrons.', sub: 'Un <b>noyau</b> et des <b>électrons</b>.' },
      { t: 58.6, d: 4.2, say: 'Un atome est électriquement neutre.', sub: 'Un atome est <b>neutre</b>.' },
      { t: 63, d: 5, say: 'Un ion est un atome qui a perdu ou gagné un ou plusieurs électrons.', sub: 'Un <b>ion</b> a perdu ou gagné des électrons.' }
    ],
    learn: [
      { t: 12, ch: 0, html: 'Noyau (<b>protons +</b> et neutrons) et <b>électrons −</b>.' },
      { t: 24, ch: 1, html: 'Atome : autant de protons que d’électrons, il est <b>neutre</b>.' },
      { t: 40, ch: 2, html: 'Perte d’électrons : <b>ion positif</b> ; gain : <b>ion négatif</b>.' },
      { t: 53, ch: 3, html: 'Une solution qui contient des <b>ions</b> conduit le courant.' }
    ],
    question: { q: 'Un atome qui gagne 2 électrons devient :', o: ['un ion positif', 'un ion négatif', 'un atome neutre', 'une molécule'], a: 1, e: 'Il a plus d’électrons que de protons : sa charge est négative.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  function stepper(api, label, get, set, min, max, into) {
    var row = api.h('div', { class: 'ctl', style: 'display:flex;align-items:center;gap:10px;margin:6px 0' }, into);
    api.h('div', { style: 'flex:1;font-weight:700' }, row, label);
    var m = api.h('button', { class: 'btn sm', type: 'button', 'aria-label': label + ' moins' }, row, '−'), v = api.h('div', { style: 'min-width:34px;text-align:center;font-weight:800;font-size:1.1em' }, row), p = api.h('button', { class: 'btn sm', type: 'button', 'aria-label': label + ' plus' }, row, '+');
    function paint() { v.textContent = get(); }
    m.onclick = function () { set(Math.max(min, get() - 1)); paint(); api.sound && api.sound('tick'); }; p.onclick = function () { set(Math.min(max, get() + 1)); paint(); api.sound && api.sound('tick'); };
    paint(); return { paint: paint, row: row };
  }
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Atomes', r: [40, 40, 500, 406] }, { n: 'Carte d’identité', r: [560, 22, 280, 424] }],
    alt: 'Constructeur d’atome : noyau de protons et neutrons, électrons en mouvement et carte d’identité ; ou cuve à électrolyse avec une solution, deux électrodes et une lampe',
    steps: [
      'Construis l’atome de ton choix : règle le nombre de protons (il fixe l’élément), de neutrons et d’électrons.',
      'Rends l’atome neutre, puis retire ou ajoute des électrons : quel ion obtiens-tu ?',
      'Mode Solution : teste l’eau distillée, l’eau sucrée, l’eau salée et le sulfate de cuivre.',
      'Relève tes résultats dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'atom', options: [{ v: 'atom', l: 'Construire un atome' }, { v: 'sol', l: 'Solution et courant' }], onChange: function (v) { st.mode = v; vis(); } });
      var host = c.row(); host.style.display = 'block';
      var sp = stepper(api, 'Protons (Z)', function () { return st.Z; }, function (v) { st.Z = v; st.N = NN[v]; sn.paint(); }, 1, 30, host);
      var sn = stepper(api, 'Neutrons', function () { return st.N; }, function (v) { st.N = v; }, 0, 36, host);
      var se = stepper(api, 'Électrons', function () { return st.E; }, function (v) { st.E = v; }, 0, 32, host);
      var rowB = c.row(); c.button({ label: 'Rendre neutre', sm: true, into: rowB, onClick: function () { st.E = st.Z; se.paint(); } });
      [['Na', 11], ['Cl', 17], ['Cu', 29], ['Al', 13]].forEach(function (x) { c.button({ label: x[0], sm: true, into: rowB, onClick: function () { st.Z = x[1]; st.N = NN[x[1]]; st.E = x[1]; sp.paint(); sn.paint(); se.paint(); } }); });
      var cS = c.seg({ label: 'Solution dans la cuve', value: 'sel', options: Object.keys(SOL).map(function (k) { return { v: k, l: SOL[k].l }; }), onChange: function (v) { st.sol = v; } });
      var tK = c.toggle({ label: 'Interrupteur fermé', value: true, onChange: function (v) { st.on = v; } });
      function vis() { var a = st.mode === 'atom'; host.style.display = a ? 'block' : 'none'; rowB.style.display = a ? 'flex' : 'none'; cS.hide(a); tK.hide(a); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Espèce' }, { k: 'q', label: 'Charge' }, { k: 'n', label: 'Nature' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'atom') { ro.a.set(last.info.txt); ro.q.set(last.info.q === 0 ? '0' : (last.info.q > 0 ? '+' : '−') + Math.abs(last.info.q) + ' e'); ro.n.set(last.info.nat); } else { ro.a.set(last.sol); ro.q.set('—'); ro.n.set(last.cond ? 'conductrice' : 'isolante'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes relevés</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () {
        if (st.mode === 'atom') rows.push({ a: last.info.name + ' (' + last.info.txt + ')', r: st.Z + ' p, ' + st.E + ' e, ' + st.N + ' n → ' + last.info.nat });
        else rows.push({ a: last.sol, r: st.on ? (last.cond ? 'la lampe brille' : 'la lampe ne brille pas') : 'circuit ouvert' });
        api.sound('ok'); paint(); if (rows.length >= 4) api.done();
      };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Espèce / solution</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.a + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Quelques ions à connaître</h3><table class="mt"><tbody><tr><td>Na<sup>+</sup></td><td>ion sodium</td></tr><tr><td>Cu<sup>2+</sup></td><td>ion cuivre II</td></tr><tr><td>Fe<sup>2+</sup> / Fe<sup>3+</sup></td><td>ions fer II / fer III</td></tr><tr><td>Al<sup>3+</sup></td><td>ion aluminium</td></tr><tr><td>Cl<sup>−</sup></td><td>ion chlorure</td></tr><tr><td>SO<sub>4</sub><sup>2−</sup></td><td>ion sulfate</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'atom'; st.Z = 6; st.N = 6; st.E = 6; st.sol = 'sel'; st.on = true; cM.set('atom'); cS.set('sel'); tK.set(true); sp.paint(); sn.paint(); se.paint(); vis(); rows = []; paint(); });
      api.say('Ajoute ou retire des électrons et regarde la carte d’identité.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations (atomes, ions et solutions).</p>';
        return '<p>Un atome est formé d’un <b>noyau</b> (protons + et neutrons) et d’<b>électrons</b> (−). Le nombre de protons Z définit l’élément. Avec autant d’électrons que de protons, l’atome est <b>neutre</b>.</p><p>Un atome qui <b>perd</b> des électrons devient un <b>ion positif</b> (Na<sup>+</sup>, Cu<sup>2+</sup>, Al<sup>3+</sup>) ; s’il en <b>gagne</b>, c’est un <b>ion négatif</b> (Cl<sup>−</sup>).</p><p>Les solutions qui contiennent des ions (eau salée, sulfate de cuivre) <b>conduisent le courant</b> : les ions se déplacent. L’eau distillée et l’eau sucrée ne le conduisent pas (ou très peu).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Atome ou solution' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function eRow(api, lab, withP) {
    var row = api.c.row();
    if (withP) { api.c.button({ label: '− proton', sm: true, into: row, onClick: function () { lab.st.Z = Math.max(1, lab.st.Z - 1); lab.st.N = NN[lab.st.Z]; } }); api.c.button({ label: '+ proton', sm: true, into: row, onClick: function () { lab.st.Z = Math.min(30, lab.st.Z + 1); lab.st.N = NN[lab.st.Z]; } }); }
    api.c.button({ label: '− électron', sm: true, into: row, onClick: function () { lab.st.E = Math.max(0, lab.st.E - 1); } }); api.c.button({ label: '+ électron', sm: true, into: row, onClick: function () { lab.st.E = Math.min(32, lab.st.E + 1); } });
  }
  var DEFI = {
    title: 'Le défi des ions',
    intro: 'Protons, électrons, ions… Construis, transforme et fais briller la lampe !',
    missions: [
      { title: 'Atome d’oxygène', text: 'Construis un <span style="color:var(--amber)">atome d’oxygène</span> neutre (Z = 8).', lumi: 'Le nombre de protons fixe l’élément… et la neutralité, c’est autant d’électrons !', hint: '8 protons et 8 électrons.',
        build: function (api) { var lab = mini(api, { Z: 6, N: 6, E: 6 }); eRow(api, lab, true); return function () { var r = lab.res(); return r.Z === 8 && r.E === 8 ? { ok: true, msg: '8 protons, 8 électrons : atome d’oxygène neutre.' } : { ok: false, msg: r.Z !== 8 ? 'Ce n’est pas l’oxygène (Z = ' + r.Z + ').' : 'L’atome n’est pas neutre.' }; }; },
        e: 'Atome d’oxygène : Z = 8, donc 8 protons et 8 électrons.' },
      { type: 'qcm', title: 'Perte d’électrons', text: 'Un atome de cuivre perd 2 électrons. Il devient :', o: ['l’ion Cu²⁻', 'l’ion Cu²⁺', 'un atome neutre', 'l’ion Cu⁺'], a: 1, hint: 'Il lui manque 2 charges négatives…', e: 'Il a 2 protons de plus que d’électrons : ion Cu²⁺.' },
      { title: 'L’ion chlorure', text: 'Transforme l’atome de chlore en <span style="color:var(--blue)">ion chlorure Cl⁻</span>.', lumi: 'Un ion négatif a des électrons en plus.', hint: 'Ajoute un électron.',
        build: function (api) { var lab = mini(api, { Z: 17, N: 18, E: 17 }); eRow(api, lab, false); return function () { var r = lab.res(); return r.E === 18 ? { ok: true, msg: '18 électrons pour 17 protons : Cl⁻.' } : { ok: false, msg: 'On a ' + r.info.txt + '.' }; }; },
        e: 'L’atome de chlore gagne un électron : ion chlorure Cl⁻.' },
      { title: 'Allume la lampe', text: 'Choisis une solution qui fait <span style="color:var(--amber)">briller la lampe</span>.', lumi: 'Pour conduire le courant, il faut des porteurs de charges…', hint: 'Il faut des ions dans la solution.',
        build: function (api) { var lab = mini(api, { mode: 'sol', sol: 'dist' }); api.c.seg({ label: 'Solution', value: 'dist', options: Object.keys(SOL).map(function (k) { return { v: k, l: SOL[k].l }; }), onChange: function (v) { lab.st.sol = v; } }); return function () { return lab.res().cond ? { ok: true, msg: 'Elle contient des ions : le courant passe.' } : { ok: false, msg: 'Pas d’ions : la lampe reste éteinte.' }; }; },
        e: 'L’eau salée et le sulfate de cuivre contiennent des ions : elles conduisent le courant.' },
      { type: 'qcm', title: 'Vrai ou faux ?', text: 'Dans un atome, le nombre de protons est :', o: ['toujours égal au nombre de neutrons', 'égal au nombre d’électrons', 'toujours nul', 'plus grand que le nombre d’électrons'], a: 1, hint: 'Un atome est neutre.', e: 'Autant de protons que d’électrons : l’atome est électriquement neutre.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux représentations possèdent le même noyau mais des nombres d’électrons différents. Ont-elles la même charge électrique ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-atomes-ions', level: '4e', theme: 'Les ions', title: 'Atomes et ions', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un atome est constitué d’un <b>noyau</b> (protons chargés + et neutrons) et d’<b>électrons</b> chargés −, qui se déplacent autour du noyau.',
      'Le nombre de protons, noté <b>Z</b>, caractérise l’élément (carbone Z = 6, sodium Z = 11, cuivre Z = 29…).',
      'Un atome est <b>électriquement neutre</b> : il a autant de protons que d’électrons.',
      'Un <b>ion</b> est un atome (ou groupe d’atomes) qui a perdu ou gagné un ou plusieurs électrons. Perte → <b>ion positif</b> (Na<sup>+</sup>, Cu<sup>2+</sup>, Fe<sup>3+</sup>) ; gain → <b>ion négatif</b> (Cl<sup>−</sup>).',
      'Une solution qui contient des ions <b>conduit le courant électrique</b> : les ions se déplacent.'
    ],
    quiz: [
      { q: 'Les électrons portent une charge :', o: ['positive', 'négative', 'nulle', 'variable'], a: 1, e: 'Les électrons sont chargés négativement.' },
      { q: 'Le noyau contient :', o: ['des électrons', 'des protons et des neutrons', 'des ions', 'rien'], a: 1, e: 'Protons (+) et neutrons (neutres).' },
      { q: 'L’ion Al³⁺ est un atome d’aluminium qui a :', o: ['gagné 3 électrons', 'perdu 3 électrons', 'perdu 3 protons', 'gagné 3 protons'], a: 1, e: 'Charge +3 : il manque 3 électrons.' },
      { q: 'L’ion chlorure Cl⁻ a :', o: ['un électron de plus que l’atome', 'un électron de moins', 'un proton de plus', 'autant d’électrons que de protons'], a: 0, e: 'Il a gagné un électron.' },
      { q: 'Quelle solution conduit le courant ?', o: ['eau distillée', 'eau sucrée', 'eau salée', 'aucune'], a: 2, e: 'L’eau salée contient des ions Na⁺ et Cl⁻.' }
    ]
  });
})();

