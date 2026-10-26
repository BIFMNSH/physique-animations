/* 3e · Mécanique · Leçon : Travail et puissance mécaniques */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var G10 = 10;
  function arrow(G, col) { var g = s('g', {}, G), l = s('line', { stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), h = s('path', { fill: col }, g); return { g: g, set: function (x1, y1, x2, y2, on) { var a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); g.style.display = on === false || L < 4 ? 'none' : ''; if (L < 4) return; var bx = x2 - Math.cos(a) * 14, by = y2 - Math.sin(a) * 14; attr(l, { x1: x1, y1: y1, x2: bx, y2: by }); h.setAttribute('d', 'M' + x2 + ' ' + y2 + ' L' + (bx + Math.sin(a) * 9) + ' ' + (by - Math.cos(a) * 9) + ' L' + (bx - Math.sin(a) * 9) + ' ' + (by + Math.cos(a) * 9) + 'Z'); } }; }
  function J(x) { var a = Math.abs(x), sg = x < -0.5 ? '−' : ''; return sg + (a >= 1000 ? fmt(a / 1000, 2) + ' kJ' : fmt(a, 0) + ' J'); }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'puits', m: 10, h: 8, dur: 40, u: 0, run: false, F: 50, d: 4, sens: 'moteur', who: '', t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- PUITS ---------- */
    var A = s('g', {}, G), WX = 210, TOP = 150, BOT = 392;
    s('rect', { x: 40, y: 140, width: 500, height: 10, fill: '#3A2F28' }, A); s('rect', { x: 40, y: 150, width: 500, height: 296, fill: '#2A211C' }, A);
    s('rect', { x: WX - 46, y: TOP, width: 92, height: BOT - TOP + 8, fill: '#0B1530' }, A); s('rect', { x: WX - 46, y: BOT - 18, width: 92, height: 26, fill: '#2C5D8F', opacity: 0.8 }, A);
    s('rect', { x: WX - 60, y: TOP - 30, width: 18, height: 30, fill: '#8B8378' }, A); s('rect', { x: WX + 42, y: TOP - 30, width: 18, height: 30, fill: '#8B8378' }, A);
    s('path', { d: 'M' + (WX - 52) + ' ' + (TOP - 30) + ' V60 M' + (WX + 52) + ' ' + (TOP - 30) + ' V60 M' + (WX - 60) + ' 62 H' + (WX + 60), stroke: '#8D6E4E', 'stroke-width': 7 }, A);
    s('circle', { cx: WX, cy: 74, r: 13, fill: '#9AA6BC', stroke: '#5B6478', 'stroke-width': 3 }, A);
    var rope = s('path', { stroke: '#C8A46A', 'stroke-width': 3, fill: 'none' }, A), bucket = s('g', {}, A); s('path', { d: 'M-22 0 h44 l-6 34 h-32z', fill: '#4C6BFF', stroke: '#2B3FA8', 'stroke-width': 2 }, bucket); s('path', { d: 'M-22 0 q22 -26 44 0', fill: 'none', stroke: '#9AA6BC', 'stroke-width': 2 }, bucket); s('rect', { x: -19, y: 3, width: 38, height: 8, fill: '#6FC3FF' }, bucket);
    var person = s('g', {}, A); s('circle', { cx: 0, cy: -84, r: 12, fill: '#8D5A3B' }, person); s('path', { d: 'M0 -72 v40 l-12 32 M0 -32 l12 32 M0 -60 l-22 -6', stroke: '#E6D3B8', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, person); person.setAttribute('transform', 'translate(476 140)');
    var dim = s('g', {}, A), dimL = s('line', { x1: WX + 80, x2: WX + 80, y1: TOP, stroke: '#FFC773', 'stroke-width': 2 }, dim), dimT = s('text', { x: WX + 90, 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, dim);
    var fA = arrow(A, '#5CFF9D'), pA = arrow(A, '#E5484D'), fAT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#5CFF9D' }, A), pAT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#FF8A80' }, A);
    var chr = s('g', {}, A); s('rect', { x: 400, y: 190, width: 120, height: 70, rx: 12, fill: '#EEF2F8' }, chr); var whoT = s('text', { x: 460, y: 210, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#3A3426' }, chr), chT = s('text', { x: 460, y: 244, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#1A1F28' }, chr);
    var aMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#F4E6D6' }, A);
    /* ---------- CHARIOT ---------- */
    var B = s('g', {}, G), X0 = 90, PXM = 60;
    s('rect', { x: 40, y: 330, width: 500, height: 116, fill: '#151D2E' }, B);
    for (var m = 0; m <= 7; m++) { s('line', { x1: X0 + m * PXM, x2: X0 + m * PXM, y1: 330, y2: 342, stroke: '#7D89A3', 'stroke-width': 2 }, B); s('text', { x: X0 + m * PXM, y: 358, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: m + ' m' }, B); }
    var cart = s('g', {}, B); s('rect', { x: -40, y: -56, width: 80, height: 44, rx: 6, fill: '#B07A4A', stroke: '#6B4526', 'stroke-width': 2 }, cart); s('text', { y: -28, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#3A2210', text: 'CIMENT' }, cart); [-24, 24].forEach(function (x) { s('circle', { cx: x, cy: -8, r: 9, fill: '#1A1F28', stroke: '#9AA6BC', 'stroke-width': 2 }, cart); });
    var fB = arrow(B, '#5CFF9D'), fBT = s('text', { 'font-size': 14, 'font-weight': 900 }, B), dB = s('g', {}, B), dBL = s('line', { y1: 380, y2: 380, stroke: '#FFC773', 'stroke-width': 2 }, dB), dBT = s('text', { y: 398, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773' }, dB), vArr = arrow(B, '#9FD7FF'), vT = s('text', { 'font-size': 12, 'font-weight': 800, fill: '#9FD7FF', text: 'déplacement' }, B);
    var bMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'TRAVAIL ET PUISSANCE' }, P);
    var f1 = s('text', { x: PX + 140, y: 84, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#5CFF9D' }, P), f1v = s('text', { x: PX + 140, y: 110, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P);
    var wBig = s('text', { x: PX + 140, y: 152, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: '#EEF2F8' }, P), wLab = s('text', { x: PX + 140, y: 174, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var barB = s('rect', { x: PX + 24, y: 186, width: 232, height: 12, rx: 6, fill: '#1A2540' }, P), barF = s('rect', { x: PX + 24, y: 186, height: 12, rx: 6, fill: '#5CFF9D' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 216, y2: 216, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var f2 = s('text', { x: PX + 140, y: 246, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#FFC773', text: 'P = W / t' }, P), f2v = s('text', { x: PX + 140, y: 272, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P), pBig = s('text', { x: PX + 140, y: 312, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 900, fill: '#FFC773' }, P);
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 352 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var res = {};
      A.style.display = st.mode === 'puits' ? '' : 'none'; B.style.display = st.mode === 'chariot' ? '' : 'none';
      if (st.t == null && st.run) { st.u = Math.min(1, st.u + dt / Math.max(1.5, (st.mode === 'puits' ? st.dur : 20) / 6)); if (st.u >= 1) st.run = false; }
      var u = st.u;
      if (st.mode === 'puits') {
        var Wtot = st.m * G10 * st.h, Wu = Wtot * u, Pw = Wtot / st.dur, yb = BOT - 34 - (BOT - 34 - (TOP - 40)) * u;
        bucket.setAttribute('transform', 'translate(' + WX + ' ' + yb + ')'); rope.setAttribute('d', 'M' + WX + ' ' + (yb - 13) + ' V74 M' + (WX + 13) + ' 74 L454 82');
        var top = TOP - 40, depth = BOT - 34 - top; attr(dimL, { y1: top + 17, y2: BOT - 17 }); attr(dimT, { y: (top + BOT) / 2, text: 'h = ' + st.h + ' m' });
        var Pn = st.m * G10, L = Math.min(110, Pn * 0.8), LF = Math.min(L, yb - 6 - 96); fA.set(WX - 34, yb + 10, WX - 34, yb + 10 - Math.max(30, LF), u > 0 && u < 1); pA.set(WX + 30, yb + 18, WX + 30, yb + 18 + L, true); attr(fAT, { x: WX - 60, y: yb + 30, text: u > 0 && u < 1 ? 'F' : '' }); attr(pAT, { x: WX + 40, y: yb + 30 + L / 2, text: 'poids ' + Pn + ' N' });
        whoT.textContent = st.who || 'CHRONOMÈTRE'; chT.textContent = fmt(u * st.dur, 0) + ' s';
        f1.textContent = 'W = m × g × h'; f1v.textContent = st.m + ' × 10 × ' + st.h + ' = ' + J(Wtot);
        wBig.textContent = J(Wu); wLab.textContent = 'travail fourni pour remonter le seau'; attr(barF, { width: 232 * u }); barF.setAttribute('fill', '#5CFF9D');
        f2v.textContent = J(Wtot) + ' / ' + st.dur + ' s'; pBig.textContent = fmt(Pw, Pw < 10 ? 1 : 0) + ' W';
        aMsg.textContent = u <= 0 ? 'Seau de ' + st.m + ' kg au fond du puits de ' + st.h + ' m' : u < 1 ? 'On remonte le seau…' : 'Seau remonté : W = ' + J(Wtot) + ' en ' + st.dur + ' s';
        pset(['Le poids du seau effectue un', 'travail résistant : − ' + J(Wtot) + '.', 'Plus c’est rapide, plus P est grande.']);
        res = { W: Wtot, Pw: Pw, u: u, m: st.m, h: st.h, dur: st.dur };
      } else {
        var mot = st.sens === 'moteur', dx = st.d * PXM * u, cx = X0 + 40 + dx, W = (mot ? 1 : -1) * st.F * st.d, Wn = W * u;
        cart.setAttribute('transform', 'translate(' + cx + ' 330)');
        var Lf = Math.min(110, st.F * 1.2); if (mot) fB.set(cx - 40 - Lf, 300, cx - 40, 300); else fB.set(cx + 40 + Lf, 300, cx + 40, 300);
        attr(fBT, { x: mot ? cx - 40 - Lf / 2 - 20 : cx + 40 + Lf / 2 - 10, y: 288, text: 'F = ' + st.F + ' N', fill: mot ? '#5CFF9D' : '#FF8A80' }); fB.g.querySelector('line').setAttribute('stroke', mot ? '#5CFF9D' : '#FF6B5E'); fB.g.querySelector('path').setAttribute('fill', mot ? '#5CFF9D' : '#FF6B5E');
        vArr.set(X0 + 40, 230, X0 + 40 + Math.max(30, st.d * PXM), 230); attr(vT, { x: X0 + 40, y: 220 });
        attr(dBL, { x1: X0 + 40, x2: X0 + 40 + st.d * PXM }); attr(dBT, { x: X0 + 40 + st.d * PXM / 2, text: 'd = ' + st.d + ' m' });
        f1.textContent = 'W = F × d'; f1v.textContent = (mot ? '' : '− ') + st.F + ' × ' + st.d + ' = ' + J(W);
        wBig.textContent = J(Wn); wLab.textContent = mot ? 'travail moteur' : 'travail résistant'; attr(barF, { width: 232 * u }); barF.setAttribute('fill', mot ? '#5CFF9D' : '#FF6B5E');
        f2v.textContent = J(Math.abs(W)) + ' / 20 s'; pBig.textContent = fmt(Math.abs(W) / 20, 0) + ' W';
        bMsg.textContent = mot ? 'La force pousse dans le sens du déplacement : travail moteur' : 'Les frottements s’opposent au déplacement : travail résistant';
        pset(['Le travail W s’exprime en joules (J).', 'La puissance P en watts (W).', '1 kW = 1 000 W']);
        res = { W: W, u: u, F: st.F, d: st.d, sens: st.sens };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Au puits' }, { t: 7, title: 'Le travail d’une force' }, { t: 19, title: 'Le travail du poids' }, { t: 31, title: 'La puissance' }, { t: 44, title: 'Moteur ou résistant' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Travail d’une force : <b>W = F × d</b>', 'en joules (J) ; pour le poids : W = m × g × h.', '#5CFF9D'],
      ['Puissance : <b>P = W / t</b>', 'en watts (W) : le même travail, fait plus vite, demande plus de puissance.', '#FFC773'],
      ['Travail <b>moteur</b> ou <b>résistant</b>', 'selon que la force aide ou s’oppose au déplacement.', '#FF8A80']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.who = '';
        if (t < 7) { st.mode = 'puits'; st.m = 10; st.h = 8; st.dur = 40; st.u = 0; }
        else if (t < 19) { st.mode = 'chariot'; st.F = 50; st.d = 4; st.sens = 'moteur'; st.u = K.k(t, 9, 6); }
        else if (t < 31) { st.mode = 'puits'; st.m = 10; st.h = 8; st.dur = 40; st.u = K.k(t, 21, 7); }
        else if (t < 44) { st.mode = 'puits'; st.m = 10; st.h = 8; var kofi = t < 37.5; st.dur = kofi ? 20 : 40; st.who = kofi ? 'KOFI' : 'AYA'; st.u = kofi ? K.k(t, 31.5, 3) : K.k(t, 38, 4.5); }
        else { st.mode = 'chariot'; st.F = 30; st.d = 5; st.sens = 'resistant'; st.u = K.k(t, 45, 6); }
        lab.step();
        tg.show(t, 1, 6.6, 290, 92, 'Remonter un seau : quel effort ?') || tg.show(t, 8, 18.6, 290, 92, '50 N sur 4 m : W = 200 J') || tg.show(t, 20, 30.6, 290, 92, '10 kg × 10 × 8 m = 800 J') ||
          tg.show(t, 32, 37.2, 290, 92, 'Kofi : 800 J en 20 s → 40 W') || tg.show(t, 38, 43.6, 290, 92, 'Aya : 800 J en 40 s → 20 W') || tg.show(t, 45, 56.6, 290, 92, 'Frottements : travail résistant');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un seau d’eau au fond d’un puits de 8 m ; un chariot de ciment poussé avec une force de 50 N sur 4 m, soit un travail de 200 J ; le seau de 10 kg remonté du puits, soit 800 J ; Kofi le remonte en 20 s, puissance 40 W, Aya en 40 s, puissance 20 W ; enfin des frottements qui s’opposent au déplacement d’un chariot, travail résistant',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 6.6, say: 'Au village, on remonte l’eau du puits avec un seau. Comment mesurer l’effort fourni ?', sub: 'Comment mesurer l’<b>effort</b> ?' },
      { t: 7, d: 11.6, say: 'Une force travaille quand son point d’application se déplace dans sa direction. Pousser le chariot avec cinquante newtons sur quatre mètres : le travail vaut F fois d, soit deux cents joules.', sub: '<b>W = F × d</b> = 50 × 4 = 200 J.' },
      { t: 19, d: 11.6, say: 'Pour remonter un seau de dix kilogrammes d’un puits de huit mètres, on travaille contre son poids : m fois g fois h, soit huit cents joules.', sub: 'W = m × g × h = <b>800 J</b>.' },
      { t: 31, d: 6.4, say: 'Kofi remonte le seau en vingt secondes : sa puissance est huit cents divisé par vingt, soit quarante watts.', sub: '<b>P = W / t</b> = 800 / 20 = 40 W.' },
      { t: 37.6, d: 6, say: 'Aya fait le même travail en quarante secondes : sa puissance n’est que de vingt watts.', sub: 'Même travail, plus lentement : 20 W.' },
      { t: 44, d: 12.6, say: 'Quand la force aide le déplacement, son travail est moteur. Les frottements, eux, s’opposent au déplacement : leur travail est résistant, négatif. En remontant le seau, le travail de son poids est aussi résistant.', sub: 'Travail <b>moteur</b> ou <b>résistant</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : le travail d’une force est W égale F fois d, en joules.', sub: 'W = F × d, en joules.' },
      { t: 61.6, d: 4.2, say: 'La puissance est P égale W divisé par t, en watts.', sub: 'P = W / t, en watts.' },
      { t: 66, d: 5, say: 'Le travail est moteur ou résistant selon le sens de la force.', sub: 'Moteur ou résistant.' }
    ],
    learn: [
      { t: 18, ch: 1, html: 'Travail d’une force : <b>W = F × d</b>, en joules (J).' },
      { t: 30, ch: 2, html: 'Travail du poids : <b>W = m × g × h</b>.' },
      { t: 43, ch: 3, html: 'Puissance : <b>P = W / t</b>, en watts (W).' },
      { t: 56, ch: 4, html: 'Une force opposée au déplacement fait un travail <b>résistant</b>.' }
    ],
    question: { q: 'Un moteur fournit 3 000 J en 10 s. Sa puissance est :', o: ['30 000 W', '300 W', '30 W', '3 W'], a: 1, e: 'P = 3 000 / 10 = 300 W.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [40, 40, 500, 406] }, { n: 'Travail', r: [560, 22, 280, 424] }],
    alt: 'Deux activités : un seau d’eau remonté d’un puits dont on règle la masse, la profondeur et la durée, avec le calcul du travail W = m g h et de la puissance P = W / t ; puis un chariot de ciment poussé sur une distance réglable, la force pouvant être motrice ou résistante',
    steps: [
      'Puits : remonte le seau et lis le travail fourni.',
      'Double la profondeur ou la masse : que devient W ?',
      'Change la durée : que devient la puissance ?',
      'Chariot : compare un travail moteur et un travail résistant.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'puits', options: [{ v: 'puits', l: 'Seau au puits' }, { v: 'chariot', l: 'Chariot poussé' }], onChange: function (v) { st.mode = v; st.u = 0; st.run = false; vis(); } });
      function rz() { st.u = 0; st.run = false; }
      var sm = c.slider({ label: 'Masse du seau', min: 5, max: 20, step: 1, value: 10, unit: 'kg', dec: 0, onInput: function (v) { st.m = v; rz(); } });
      var sh = c.slider({ label: 'Profondeur h', min: 2, max: 12, step: 1, value: 8, unit: 'm', dec: 0, onInput: function (v) { st.h = v; rz(); } });
      var st2 = c.slider({ label: 'Durée de la remontée', min: 10, max: 60, step: 5, value: 40, unit: 's', dec: 0, onInput: function (v) { st.dur = v; rz(); } });
      var sF = c.slider({ label: 'Force F', min: 10, max: 80, step: 10, value: 50, unit: 'N', dec: 0, onInput: function (v) { st.F = v; rz(); } });
      var sd = c.slider({ label: 'Distance d', min: 1, max: 6, step: 1, value: 4, unit: 'm', dec: 0, onInput: function (v) { st.d = v; rz(); } });
      var cS = c.seg({ label: 'La force…', value: 'moteur', options: [{ v: 'moteur', l: 'aide le déplacement' }, { v: 'resistant', l: 's’y oppose' }], onChange: function (v) { st.sens = v; rz(); } });
      var bG = c.button({ label: 'Lancer', primary: true, onClick: function () { st.u = 0; st.run = true; api.sound('tick'); } });
      function vis() { var p = st.mode === 'puits'; sm.hide(!p); sh.hide(!p); st2.hide(!p); sF.hide(p); sd.hide(p); cS.hide(p); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Travail' }, { k: 'b', label: 'Puissance' }]), last = {};
      api.loop(function () { last = lab.step(); ro.a.set(J(last.W)); ro.b.set(st.mode === 'puits' ? fmt(last.Pw, 1) + ' W' : (last.W >= 0 ? 'moteur' : 'résistant')); });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push(st.mode === 'puits' ? { e: st.m + ' kg, ' + st.h + ' m, ' + st.dur + ' s', w: J(last.W), p: fmt(last.Pw, 1) + ' W' } : { e: st.F + ' N sur ' + st.d + ' m (' + (st.sens === 'moteur' ? 'moteur' : 'résistant') + ')', w: J(last.W), p: '—' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Situation</th><th>Travail</th><th>Puissance</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.w + '</td><td>' + r.p + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Formules et unités</h3><table class="mt"><thead><tr><th>Grandeur</th><th>Formule</th><th>Unité</th></tr></thead><tbody><tr><td>Travail d’une force</td><td>W = F × d</td><td>joule (J)</td></tr><tr><td>Travail du poids</td><td>W = m × g × h</td><td>joule (J)</td></tr><tr><td>Puissance</td><td>P = W / t</td><td>watt (W)</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'puits', m: 10, h: 8, dur: 40, u: 0, run: false, F: 50, d: 4, sens: 'moteur' }); cM.set('puits'); sm.set(10); sh.set(8); st2.set(40); sF.set(50); sd.set(4); cS.set('moteur'); vis(); rows = []; paint(); });
      api.say('Appuie sur « Lancer » pour remonter le seau.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures.</p>';
        return '<p>Une force <b>travaille</b> lorsque son point d’application se déplace et qu’elle n’est pas perpendiculaire au déplacement (une force perpendiculaire au déplacement, comme le poids d’un chariot sur un sol horizontal, ne travaille pas). Pour une force constante parallèle au déplacement : <b>W = F × d</b>, en <b>joules (J)</b>. Le travail du poids lors d’un déplacement vertical de hauteur h : <b>W = m × g × h</b>.</p><p>Le travail est <b>moteur</b> (positif) si la force est dans le sens du déplacement, <b>résistant</b> (négatif) si elle s’y oppose.</p><p>La <b>puissance</b> mesure la rapidité du travail : <b>P = W / t</b>, en <b>watts (W)</b>. Pour un même travail, plus la durée est courte, plus la puissance est grande.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Travail et puissance' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du chantier',
    intro: 'Seaux, sacs de ciment, chariots : calcule l’effort !',
    missions: [
      { title: '1 200 J', text: 'Règle le puits pour que remonter le seau demande un travail de <span style="color:#5CFF9D">1 200 J</span>.', lumi: 'W = m × 10 × h.', hint: '10 kg et 12 m, ou 15 kg et 8 m…',
        build: function (api) { var lab = mini(api, { m: 5, h: 4 }); api.c.slider({ label: 'Masse', min: 5, max: 20, step: 1, value: 5, unit: 'kg', dec: 0, onInput: function (v) { lab.st.m = v; } }); api.c.slider({ label: 'Profondeur', min: 2, max: 12, step: 1, value: 4, unit: 'm', dec: 0, onInput: function (v) { lab.st.h = v; } }); return function () { var r = lab.res(); return r.W === 1200 ? { ok: true, msg: r.m + ' × 10 × ' + r.h + ' = 1 200 J.' } : { ok: false, msg: 'W = ' + J(r.W) + '.' }; }; },
        e: 'm × h doit valoir 120.' },
      { title: '60 W', text: 'Seau de 10 kg, puits de 9 m : choisis la durée pour une puissance de <b>60 W</b>.', lumi: 't = W / P.', hint: '900 / 60 = 15 s.',
        build: function (api) { var lab = mini(api, { m: 10, h: 9, dur: 40 }); api.c.slider({ label: 'Durée', min: 10, max: 60, step: 5, value: 40, unit: 's', dec: 0, onInput: function (v) { lab.st.dur = v; } }); return function () { var r = lab.res(); return Math.abs(r.Pw - 60) < 0.01 ? { ok: true, msg: '900 J en 15 s : 60 W.' } : { ok: false, msg: 'P = ' + fmt(r.Pw, 1) + ' W.' }; }; },
        e: 't = 900 / 60 = 15 s.' },
      { title: 'Résistant', text: 'Obtiens un travail <span style="color:#FF8A80">résistant</span> de −120 J sur le chariot.', lumi: 'Force opposée au déplacement.', hint: '40 N sur 3 m, ou 20 N sur 6 m…',
        build: function (api) { var lab = mini(api, { mode: 'chariot', F: 10, d: 1 }); api.c.slider({ label: 'Force', min: 10, max: 80, step: 10, value: 10, unit: 'N', dec: 0, onInput: function (v) { lab.st.F = v; } }); api.c.slider({ label: 'Distance', min: 1, max: 6, step: 1, value: 1, unit: 'm', dec: 0, onInput: function (v) { lab.st.d = v; } }); api.c.seg({ label: 'La force…', value: 'moteur', options: [{ v: 'moteur', l: 'aide' }, { v: 'resistant', l: 's’oppose' }], onChange: function (v) { lab.st.sens = v; } }); return function () { var r = lab.res(); return r.W === -120 ? { ok: true, msg: 'W = −' + r.F + ' × ' + r.d + ' = −120 J.' } : { ok: false, msg: 'W = ' + J(r.W) + '.' }; }; },
        e: 'Travail résistant : négatif.' },
      { type: 'qcm', title: 'Comparer', text: 'Deux élèves montent le même sac de ciment au 1er étage, l’un en 30 s, l’autre en 60 s. Le plus puissant :', o: ['celui de 30 s', 'celui de 60 s', 'ils sont aussi puissants', 'on ne peut pas savoir'], a: 0, hint: 'Même travail, durée plus courte.', e: 'P = W / t : durée plus courte, puissance plus grande.' },
      { type: 'qcm', title: 'Unités', text: '2,5 kW, c’est :', o: ['25 W', '250 W', '2 500 W', '25 000 W'], a: 2, hint: '1 kW = 1 000 W.', e: '2,5 × 1 000 = 2 500 W.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux dispositifs réalisent le même travail en des durées différentes. Ont-ils la même puissance ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-travail-puissance', level: '3e', theme: 'Mécanique', title: 'Travail et puissance mécaniques', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une force <b>travaille</b> lorsque son point d’application se déplace et qu’elle n’est pas perpendiculaire au déplacement. Une force perpendiculaire au déplacement ne travaille pas (W = 0).',
      'Travail d’une force constante parallèle au déplacement : <b>W = F × d</b> (F en N, d en m, W en <b>joules, J</b>).',
      'Travail du poids pour une dénivellation h : <b>W = m × g × h</b>. Il est <b>moteur</b> à la descente et <b>résistant</b> à la montée.',
      'Le travail est <b>moteur</b> si la force est dans le sens du déplacement, <b>résistant</b> (négatif) si elle s’y oppose (frottements).',
      'La <b>puissance</b> : <b>P = W / t</b> (W en J, t en s, P en <b>watts, W</b>) ; 1 kW = 1 000 W.'
    ],
    quiz: [
      { q: 'L’unité de travail est :', o: ['le watt', 'le joule', 'le newton', 'le mètre'], a: 1, e: 'Le joule (J).' },
      { q: 'Une force de 20 N déplace son point d’application de 5 m dans son sens. W =', o: ['4 J', '25 J', '100 J', '15 J'], a: 2, e: '20 × 5 = 100 J.' },
      { q: 'On monte un sac de 50 kg à 3 m (g = 10 N/kg). Travail fourni :', o: ['150 J', '1 500 J', '500 J', '53 J'], a: 1, e: '50 × 10 × 3 = 1 500 J.' },
      { q: 'La puissance s’exprime en :', o: ['joules', 'watts', 'newtons', 'secondes'], a: 1, e: 'En watts (W).' },
      { q: 'Les frottements effectuent un travail :', o: ['moteur', 'résistant', 'nul', 'infini'], a: 1, e: 'Ils s’opposent au déplacement.' }
    ]
  });
})();

