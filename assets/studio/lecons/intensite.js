/* 5e · Mesure de grandeurs physiques · Leçon : Intensité du courant électrique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729', U = 3, R1 = 20, R2 = 30, UN = 3;
  /* positions possibles de l’ampèremètre : un câble du montage est remplacé par deux cordons */
  var SLOTS = {
    serie: { A: { n: 'A (à gauche)' }, B: { n: 'B (entre les lampes)' }, C: { n: 'C (à droite)' } },
    der: { P: { n: 'branche principale' }, '1': { n: 'branche de L1' }, '2': { n: 'branche de L2' } }
  };
  function solve(st) {
    var I1, I2, I, V1, V2, sc = false;
    if (st.mode === 'serie') { if (st.wrong) { I = U / R2; V1 = 0; V2 = U; } else { I = U / (R1 + R2); V1 = I * R1; V2 = I * R2; } I1 = I2 = I; }
    else { if (st.wrong) { sc = true; I = 8; I1 = 0; I2 = 0; V1 = V2 = 0; } else { I1 = U / R1; I2 = U / R2; I = I1 + I2; V1 = V2 = U; } }
    var meas = st.wrong ? (st.mode === 'serie' ? I : 8) : st.mode === 'serie' ? I : st.slot === 'P' ? I : st.slot === '1' ? I1 : I2;
    return { I: I, I1: I1, I2: I2, V1: V1, V2: V2, sc: sc, meas: (st.rev ? -1 : 1) * meas };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'serie', slot: 'B', cal: 'mA200', rev: false, wrong: false, meter: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 50, width: 500, height: 396, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), key = '', P = null;
    function block(x, y0, y2, face) {
      var g = s('g', { role: 'img', 'aria-label': 'Barrette de dérivation : trois douilles reliées entre elles' }, C);
      s('rect', { x: x - 15, y: y0 - 16, width: 30, height: y2 - y0 + 32, rx: 6, fill: '#E9EEF6', stroke: '#9FB0C4', 'stroke-width': 2 }, g);
      s('rect', { x: x - 3, y: y0 - 8, width: 6, height: y2 - y0 + 16, rx: 3, fill: '#B98A16', opacity: 0.8 }, g);
      [y0, (y0 + y2) / 2, y2].forEach(function (yy) { s('circle', { cx: x, cy: yy, r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, g); s('circle', { cx: x, cy: yy, r: 2.8, fill: '#2A2F38' }, g); });
    }
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild); P = { w: [], L: [], slots: {} }; C.setAttribute('transform', 'translate(0 ' + (st.mode === 'serie' ? -14 : -6) + ')');
      var cab = function (A, dA, B, dB) { var g = s('g', {}, C), w = E.cable(g, A, dA, B, dB); w.g = g; P.w.push(w); return w; };
      var tag = function (x, y, txt, col) { return s('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: col || '#FFC773', text: txt }, C); };
      if (st.mode === 'serie') {
        var Y = 118;
        P.L.push(E.lamp(C, 190, Y, { r: 22 })); P.L.push(E.lamp(C, 370, Y, { r: 22 })); tag(190, Y + 42, 'L1'); tag(370, Y + 42, 'L2');
        P.bat = E.battery(C, 290, 232, { U: U });
        P.slots.A = { w: cab([168, Y], -1, [242, 232], -1), up: { x: 168, y: Y }, dn: { x: 242, y: 232 }, tx: 128, ty: 190 };
        P.slots.B = { w: cab([348, Y], -1, [212, Y], 1), up: { x: 348, y: Y }, dn: { x: 212, y: Y }, tx: 280, ty: Y - 12 };
        P.slots.C = { w: cab([338, 232], 1, [392, Y], 1), up: { x: 338, y: 232 }, dn: { x: 392, y: Y }, tx: 436, ty: 190 };
        P.shunt = [{ x: 168, y: Y }, { x: 212, y: Y }];
      } else {
        P.L.push(E.lamp(C, 290, 100, { r: 18 })); P.L.push(E.lamp(C, 290, 172, { r: 18 })); tag(236, 88, 'L1'); tag(236, 160, 'L2');
        P.bat = E.battery(C, 290, 248, { U: U });
        block(110, 100, 172); block(470, 100, 172);
        cab([272, 100], -1, [110, 100], 1); cab([272, 172], -1, [110, 172], 1); cab([110, 136], 1, [242, 248], -1);
        P.slots.P = { w: cab([338, 248], 1, [470, 136], -1), up: { x: 338, y: 248 }, dn: { x: 470, y: 136 }, tx: 440, ty: 214 };
        P.slots['1'] = { w: cab([470, 100], -1, [308, 100], 1), up: { x: 470, y: 100 }, dn: { x: 308, y: 100 }, tx: 400, ty: 90 };
        P.slots['2'] = { w: cab([470, 172], -1, [308, 172], 1), up: { x: 470, y: 172 }, dn: { x: 308, y: 172 }, tx: 400, ty: 190 };
        P.shunt = [{ x: 272, y: 100 }, { x: 308, y: 100 }];
      }
      Object.keys(P.slots).forEach(function (k) { var z = P.slots[k]; z.tag = tag(z.tx, z.ty, k, '#7D89A3'); });
      P.info = s('text', { x: 290, y: 290, 'text-anchor': 'middle', 'font-size': 13.5, 'font-weight': 800, fill: '#C9D2E3' }, C);
    }
    /* schéma normalisé (bandeau du bas) */
    var SCH = s('g', {}, G), SG, sKey = '';
    s('rect', { x: 56, y: 288, width: 290, height: 152, rx: 16, fill: '#F7F4EA', stroke: '#D9D2BC', 'stroke-width': 2 }, SCH); s('text', { x: 72, y: 310, 'font-size': 12, 'font-weight': 900, fill: '#3A3426', text: 'SCHÉMA NORMALISÉ' }, SCH);
    SG = s('g', {}, SCH);
    function schema(R) {
      var k = [st.mode, st.slot, st.meter, st.wrong, R.V1 > 0, R.V2 > 0].join(); if (k === sKey) return; sKey = k; while (SG.firstChild) SG.removeChild(SG.firstChild);
      var ink = '#1E2430', X0 = 106, X1 = 320, Ya = 342, Yb = 414, ym = (Ya + Yb) / 2, am = st.meter && !st.wrong;
      var path = function (d, dash) { s('path', { d: d, fill: 'none', stroke: ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'stroke-dasharray': dash || 'none' }, SG); };
      var lab = function (x, y, txt, col, bg) { if (bg) s('rect', { x: x - 12, y: y - 11, width: 24, height: 15, fill: '#F7F4EA' }, SG); s('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: col || ink, text: txt }, SG); };
      var amp = function (x, y) { s('circle', { cx: x, cy: y, r: 11, fill: '#FFE9A8', stroke: ink, 'stroke-width': 2 }, SG); s('text', { x: x, y: y + 4.5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: ink, text: 'A' }, SG); };
      var bypass = function (x1, x2, y, up) { var d = up ? -24 : 24; path('M' + x1 + ' ' + y + 'V' + (y + d) + 'H' + (x1 + 6) + 'M' + (x2 - 6) + ' ' + (y + d) + 'H' + x2 + 'V' + y, '4 3'); amp((x1 + x2) / 2, y + d); };
      if (st.mode === 'serie') {
        path('M' + X0 + ' ' + Ya + 'H' + X1 + 'V' + Yb + 'H' + X0 + 'Z');
        E.sym(SG, 'L', 170, Ya, { on: R.V1 > 0 }); lab(170, Ya - 16, 'L1'); E.sym(SG, 'L', 260, Ya, { on: R.V2 > 0 }); lab(260, Ya - 16, 'L2');
        E.sym(SG, 'G', 215, Yb, { flip: true, nolabel: true });
        if (am) { var pos = { A: [X0, ym], B: [215, Ya], C: [X1, ym] }[st.slot]; amp(pos[0], pos[1]); }
        [['A', X0 - 14, ym + 4], ['B', 215, Ya - 9], ['C', X1 + 14, ym + 4]].forEach(function (q) { if (!am || q[0] !== st.slot) lab(q[1], q[2], q[0], '#8A8576'); });
        if (st.wrong) bypass(150, 190, Ya);
      } else {
        var y1 = Ya, y2 = Ya + 32;
        path('M' + X0 + ' ' + y1 + 'H' + X1 + 'V' + Yb + 'H' + X0 + 'Z'); path('M' + X0 + ' ' + y2 + 'H' + X1);
        s('circle', { cx: X0, cy: y2, r: 3.2, fill: ink }, SG); s('circle', { cx: X1, cy: y2, r: 3.2, fill: ink }, SG);
        E.sym(SG, 'L', 205, y1, { on: R.V1 > 0 }); lab(236, y1 + 4, 'L1', null, true); E.sym(SG, 'L', 205, y2, { on: R.V2 > 0 }); lab(236, y2 + 4, 'L2', null, true);
        E.sym(SG, 'G', 215, Yb, { flip: true, nolabel: true });
        if (am) { var q2 = { P: [X1, (y2 + Yb) / 2], '1': [276, y1], '2': [276, y2] }[st.slot]; amp(q2[0], q2[1]); }
        [['P', X1 + 14, (y2 + Yb) / 2 + 4], ['1', 276, y1 - 9], ['2', 276, y2 - 9]].forEach(function (q) { if (!am || q[0] !== st.slot) lab(q[1], q[2], q[0], '#8A8576'); });
        if (st.wrong) bypass(186, 224, y1, true);
      }
    }
    var MM = E.multimeter(G, 700, 40, { cal: st.cal, onDial: function (k) { st.cal = k; o.onDial && o.onDial(k); } });
    var LG = s('g', {}, G), red = E.lead(LG, '#FF5A4E'), blk = E.lead(LG, '#2A2F38');
    var blkOut = s('path', { fill: 'none', stroke: '#7D89A3', 'stroke-width': 1.5, 'stroke-dasharray': '2 3' }, LG);
    var warn = s('g', {}, G), wr = s('rect', { x: 358, y: 300, width: 166, height: 70, rx: 14, fill: '#FF5A4E' }, warn), wt1 = s('text', { x: 441, y: 326, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: '#2A0805' }, warn), wt2 = s('text', { x: 441, y: 346, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: '#2A0805' }, warn), wt3 = s('text', { x: 441, y: 363, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: '#2A0805' }, warn);
    function warnText(txt) { var w = txt.split(' '), L = ['', '', ''], i = 0; w.forEach(function (x) { if ((L[i] + ' ' + x).length > 21 && i < 2 && L[i]) i++; L[i] = (L[i] ? L[i] + ' ' : '') + x; }); wt1.textContent = L[0]; wt2.textContent = L[1]; wt3.textContent = L[2]; }
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, k = st.mode;
      if (k !== key) { key = k; build(); if (!SLOTS[st.mode][st.slot]) st.slot = st.mode === 'serie' ? 'B' : 'P'; }
      MM.set(st.cal);
      var R = solve(st), z = P.slots[st.slot];
      P.L[0].set(E.lampState(R.V1, UN).b); P.L[1].set(E.lampState(R.V2, UN).b);
      P.w.forEach(function (w) { w.flow(R.sc ? 1.6 : R.I > 0 ? Math.min(1.4, R.I * 4) : 0, T); });
      var inSeries = st.meter && !st.wrong; Object.keys(P.slots).forEach(function (kk) { P.slots[kk].w.g.style.display = inSeries && kk === st.slot ? 'none' : ''; P.slots[kk].tag.style.display = inSeries && kk === st.slot ? 'none' : ''; }); schema(R);
      var c = E.CALS.filter(function (x) { return x.k === st.cal; })[0], sockR = c.k === 'A10' ? MM.sock['10A'] : c.ty === 'V' ? MM.sock.V : MM.sock.mA;
      var a, b; if (st.wrong) { a = P.shunt[0]; b = P.shunt[1]; } else { a = z.up; b = z.dn; }
      if (st.rev) { var tmp = a; a = b; b = tmp; }
      red.show(st.meter); blk.show(st.meter); MM.g.style.display = st.meter ? '' : 'none';
      if (st.meter) { var oy = st.mode === 'serie' ? -14 : -6; red.set(sockR, { x: a.x, y: a.y + oy }, 70); blk.set(MM.sock.COM, { x: b.x, y: b.y + oy }, 70); }
      var M = st.meter ? MM.show(R.meas, 'A') : { st: 'off' };
      warn.style.display = R.sc || st.wrong ? '' : 'none'; warnText(R.sc ? 'COURT-CIRCUIT ! Ampèremètre en dérivation' : 'Erreur : ampèremètre en dérivation sur L1');
      var msg = !st.meter ? '' : M.st === 'off' ? 'Multimètre éteint : tourne le sélecteur.' : M.st === 'wrongmode' ? 'Sélecteur sur « V » : choisis un calibre en A ou mA.' : M.st === 'over' ? 'Affichage « 1 » : calibre trop petit !' : 'I = ' + M.txt + (st.rev ? ' (fils inversés)' : '') + (st.wrong ? '' : ' · position ' + st.slot);
      P.info.textContent = msg;
      return { R: R, M: M, slot: st.slot, mode: st.mode, rev: st.rev, wrong: st.wrong, cal: st.cal };
    }
    return { st: st, step: step, MM: MM };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’intensité du courant' }, { t: 11, title: 'Brancher un ampèremètre' }, { t: 23, title: 'Choisir le calibre' }, { t: 35, title: 'La même partout en série' }, { t: 46, title: 'En dérivation' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { meter: false }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’intensité I se mesure en <b>ampères (A)</b>', 'avec un <b>ampèremètre</b> branché <b>en série</b> (COM côté borne −).', '#FFB547'],
      ['En série, l’intensité est <b>la même partout</b>', 'peu importe la position de l’ampèremètre.', 'var(--blue)'],
      ['En dérivation : <b>I = I<sub>1</sub> + I<sub>2</sub></b>', 'l’intensité principale est la somme des intensités des branches.', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.rev = false; st.wrong = false; st.meter = t >= 11;
        if (t < 11) { st.mode = 'serie'; st.meter = false; }
        else if (t < 23) { st.mode = 'serie'; st.slot = 'B'; st.cal = t < 15 ? 'OFF' : 'mA200'; }
        else if (t < 35) { st.mode = 'serie'; st.slot = 'B'; st.cal = t < 27 ? 'mA20' : t < 31 ? 'mA200' : 'A10'; }
        else if (t < 46) { st.mode = 'serie'; st.cal = 'mA200'; st.slot = t < 38.6 ? 'A' : t < 42.2 ? 'B' : 'C'; }
        else { st.mode = 'der'; st.cal = t < 49 ? 'A10' : 'mA200'; st.slot = t < 50.6 ? 'P' : t < 54.2 ? '1' : '2'; if (t < 49) st.slot = 'P'; }
        lab.step();
        tg.show(t, 2, 10.6, 290, 92, 'Le courant circule dans tout le circuit') || tg.show(t, 13, 22.6, 290, 92, 'En série : borne COM côté −') || tg.show(t, 24, 26.8, 290, 92, '20 mA : trop petit, l’écran affiche 1') ||
          tg.show(t, 27.2, 30.8, 290, 92, '200 mA : I = 60,0 mA') || tg.show(t, 31.2, 34.6, 290, 92, '10 A : 0,06 A, moins précis') || tg.show(t, 36, 45.6, 290, 92, 'Position ' + st.slot + ' : toujours 60 mA') ||
          tg.show(t, 47, 50.4, 290, 92, 'Branche principale : I = 0,25 A') || tg.show(t, 50.8, 57.6, 290, 92, 'I = I1 + I2 = 150 + 100 = 250 mA');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un circuit avec deux lampes en série, puis un multimètre utilisé en ampèremètre, branché en série à différents endroits avec différents calibres ; enfin un montage en dérivation où l’intensité principale est la somme des intensités des branches',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 5.4, say: 'Quand le circuit est fermé, un courant électrique circule dans tous ses éléments.', sub: 'Un <b>courant électrique</b> circule dans le circuit.' },
      { t: 5.6, d: 5.2, say: 'Son intensité se note I et se mesure en ampères, ou en milliampères.', sub: 'Son <b>intensité</b> I se mesure en <b>ampères (A)</b>.' },
      { t: 11, d: 4, say: 'On la mesure avec un ampèremètre : un multimètre réglé sur la position ampère.', sub: 'L’appareil : un <b>ampèremètre</b>.' },
      { t: 15.2, d: 7.4, say: 'On ouvre le circuit et on y insère l’ampèremètre, en série. Le courant entre par la borne milliampère et sort par la borne COM.', sub: 'Il se branche <b>en série</b> : courant entrant par mA, sortant par COM.' },
      { t: 23, d: 4, say: 'Sur le calibre vingt milliampères, l’écran affiche un : le calibre est trop petit.', sub: 'Affichage « 1 » : <b>calibre trop petit</b>.' },
      { t: 27.2, d: 7.6, say: 'Sur deux cents milliampères, on lit soixante milliampères. Sur dix ampères, on lit zéro virgule zéro six ampère, moins précis. On choisit le plus petit calibre possible.', sub: 'On choisit le <b>plus petit calibre</b> supérieur à la mesure.' },
      { t: 35, d: 10.6, say: 'Déplaçons l’ampèremètre : à gauche, entre les lampes, à droite… toujours soixante milliampères. Dans un circuit en série, l’intensité est la même en tout point.', sub: 'En série, l’intensité est <b>la même partout</b>.' },
      { t: 46, d: 4.4, say: 'En dérivation, mesurons dans la branche principale : zéro virgule vingt-cinq ampère.', sub: 'En dérivation, branche principale : <b>250 mA</b>.' },
      { t: 50.6, d: 7.2, say: 'Dans les branches : cent cinquante et cent milliampères. Leur somme fait deux cent cinquante : l’intensité principale est la somme des intensités des branches.', sub: '150 + 100 = 250 mA : <b>I = I₁ + I₂</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : l’intensité se mesure en ampères avec un ampèremètre en série.', sub: 'Ampèremètre <b>en série</b>, unité : <b>ampère</b>.' },
      { t: 62.6, d: 4.2, say: 'En série, l’intensité est la même en tout point.', sub: 'Série : intensité <b>identique</b> partout.' },
      { t: 67, d: 5, say: 'En dérivation, l’intensité principale est la somme des intensités dans les branches.', sub: 'Dérivation : <b>I = I₁ + I₂</b>.' }
    ],
    learn: [
      { t: 10, ch: 0, html: 'Intensité I, unité : l’<b>ampère</b> (A) ; 1 A = 1 000 mA.' },
      { t: 22, ch: 1, html: 'Ampèremètre <b>en série</b>, entrée mA ou A, sortie COM.' },
      { t: 34, ch: 2, html: 'Écran « 1 » : calibre trop petit. On prend le <b>plus petit calibre</b> possible.' },
      { t: 57, ch: 4, html: 'Série : I identique ; dérivation : <b>I = I<sub>1</sub> + I<sub>2</sub></b>.' }
    ],
    question: { q: 'Comment branche-t-on un ampèremètre ?', o: ['en dérivation aux bornes de la lampe', 'en série dans le circuit', 'à la place du générateur', 'n’importe comment'], a: 1, e: 'Le courant doit le traverser : on l’insère en série.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Montage', r: [40, 50, 500, 250] }, { n: 'Schéma', r: [56, 288, 290, 152] }, { n: 'Multimètre', r: [575, 25, 285, 410] }],
    alt: 'Circuit avec un générateur 3 V et deux lampes, en série ou en dérivation, et un multimètre utilisé en ampèremètre, relié par des cordons rouge et noir à la position choisie',
    steps: [
      'Choisis le calibre sur le multimètre (clique sur le sélecteur) et lis l’intensité.',
      'Déplace l’ampèremètre en A, B et C : que remarques-tu ?',
      'Inverse les fils, puis essaie de brancher l’ampèremètre en dérivation : que se passe-t-il ?',
      'En dérivation, mesure I, I₁ et I₂ et vérifie la loi. Relève tes mesures.'
    ],
    build: function (api) {
      var cS, cD, cC;
      var lab = Lab(api.g, { onDial: function (k) { api.sound('tick'); cC && cC.set(k); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Montage', value: 'serie', options: [{ v: 'serie', l: 'Lampes en série' }, { v: 'der', l: 'Lampes en dérivation' }], onChange: function (v) { st.mode = v; st.slot = v === 'serie' ? 'B' : 'P'; st.wrong = false; vis(); } });
      cS = c.seg({ label: 'Position de l’ampèremètre', value: 'B', options: ['A', 'B', 'C'].map(function (k) { return { v: k, l: k }; }), onChange: function (v) { st.slot = v; st.wrong = false; } });
      cD = c.seg({ label: 'Position de l’ampèremètre', value: 'P', options: [{ v: 'P', l: 'principale' }, { v: '1', l: 'branche L1' }, { v: '2', l: 'branche L2' }], onChange: function (v) { st.slot = v; st.wrong = false; } });
      cC = c.seg({ label: 'Calibre', value: 'mA200', options: E.CALS.map(function (x) { return { v: x.k, l: x.l }; }), onChange: function (v) { st.cal = v; } });
      var tR = c.toggle({ label: 'Inverser les fils', value: false, onChange: function (v) { st.rev = v; } });
      var tW = c.toggle({ label: 'Erreur : brancher en dérivation sur L1', value: false, onChange: function (v) { st.wrong = v; if (v) api.sound('bad'); } });
      function vis() { cS.hide(st.mode !== 'serie'); cD.hide(st.mode === 'serie'); }
      vis();
      var ro = api.readouts([{ k: 'p', label: 'Position' }, { k: 'c', label: 'Calibre' }, { k: 'i', label: 'Mesure' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.p.set(st.wrong ? 'en dérivation !' : SLOTS[st.mode][st.slot].n); ro.c.set(E.CALS.filter(function (x) { return x.k === st.cal; })[0].l); ro.i.set(last.M.st === 'ok' ? last.M.txt : last.M.st === 'over' ? '« 1 » (trop petit)' : '—'); });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (last.M.st !== 'ok') { api.say('Lis d’abord une valeur correcte à l’écran.'); return; } rows.push({ m: st.mode === 'serie' ? 'série' : 'dérivation', p: st.wrong ? 'dérivation (erreur)' : SLOTS[st.mode][st.slot].n, i: last.M.txt }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Montage</th><th>Position</th><th>Intensité</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.m + '</td><td>' + r.p + '</td><td>' + r.i + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>';
        api.chart.innerHTML = '<h3>Les calibres</h3><table class="mt"><tbody><tr><td>Écran « 1 »</td><td>calibre trop petit : prends le calibre au-dessus</td></tr><tr><td>Valeur négative</td><td>fils inversés : le courant entre par COM</td></tr><tr><td>Meilleur calibre</td><td>le plus petit calibre supérieur à la valeur</td></tr><tr><td>Conversion</td><td>1 A = 1 000 mA</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'serie'; st.slot = 'B'; st.cal = 'mA200'; st.rev = false; st.wrong = false; cM.set('serie'); cS.set('B'); cD.set('P'); cC.set('mA200'); tR.set(false); tW.set(false); vis(); rows = []; paint(); });
      api.say('Lis l’intensité, puis déplace l’ampèremètre.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures correctes.</p>';
        return '<p>L’intensité du courant se note <b>I</b> et s’exprime en <b>ampères (A)</b> ; 1 A = 1 000 mA. Elle se mesure avec un <b>ampèremètre</b> branché <b>en série</b> : le courant entre par la borne A (ou mA) et sort par la borne COM.</p><p>On commence par le plus grand calibre, puis on choisit le <b>plus petit calibre</b> supérieur à la valeur mesurée. L’affichage « 1 » signale un calibre trop petit.</p><p>Dans un circuit <b>en série</b>, l’intensité est la <b>même en tout point</b> (ici 60 mA). En <b>dérivation</b>, l’intensité principale est la somme des intensités des branches : <b>I = I<sub>1</sub> + I<sub>2</sub></b> (250 = 150 + 100 mA).</p><p>Un ampèremètre branché en dérivation court-circuite le récepteur : c’est une erreur dangereuse.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit avec un ampèremètre' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’ampèremètre',
    intro: 'Branche, règle, lis : deviens un pro de la mesure !',
    missions: [
      { title: 'Le bon calibre', text: 'L’écran affiche « 1 ». Clique sur le <span style="color:var(--amber)">sélecteur</span> du multimètre pour lire l’intensité <b>le plus précisément possible</b>.', lumi: 'Le plus petit calibre qui convient donne le plus de chiffres.', hint: 'Essaie 200 mA.',
        build: function (api) { var lab = mini(api, { cal: 'mA20' }); return function () { var r = lab.res(); return r.M.st === 'ok' && r.cal === 'mA200' ? { ok: true, msg: 'I = ' + r.M.txt + ' : calibre idéal.' } : { ok: false, msg: r.M.st === 'ok' ? 'Ça marche, mais un calibre plus petit est plus précis.' : 'Pas de mesure correcte pour l’instant.' }; }; },
        e: 'On choisit le plus petit calibre supérieur à la valeur mesurée : 200 mA pour 60 mA.' },
      { type: 'qcm', title: 'Branchement', text: 'Un ampèremètre se branche :', o: ['en dérivation', 'en série', 'aux bornes du générateur', 'à la place de la lampe'], a: 1, hint: 'Le courant doit le traverser.', e: 'L’ampèremètre se branche en série.' },
      { title: 'Valeur négative', text: 'L’ampèremètre affiche une <b>valeur négative</b>. Corrige le branchement.', lumi: 'Par quelle borne le courant entre-t-il ?', hint: 'Inverse les fils : le courant doit sortir par COM.',
        build: function (api) { var lab = mini(api, { rev: true }); api.c.toggle({ label: 'Inverser les fils', value: true, onChange: function (v) { lab.st.rev = v; } }); return function () { var r = lab.res(); return !r.rev && r.M.st === 'ok' ? { ok: true, msg: 'Le courant entre par mA et sort par COM.' } : { ok: false, msg: 'La valeur est encore négative.' }; }; },
        e: 'Le courant doit entrer par la borne A (ou mA) et sortir par la borne COM.' },
      { title: 'Le courant principal', text: 'En dérivation, mesure l’intensité dans la <span style="color:#3DD68C">branche principale</span>.', lumi: 'Attention au calibre : la valeur est plus grande ici.', hint: 'Position « principale » et calibre 10 A.',
        build: function (api) { var lab = mini(api, { mode: 'der', slot: '1', cal: 'mA200' }); api.c.seg({ label: 'Position', value: '1', options: [{ v: 'P', l: 'principale' }, { v: '1', l: 'branche L1' }, { v: '2', l: 'branche L2' }], onChange: function (v) { lab.st.slot = v; } }); return function () { var r = lab.res(); return r.slot === 'P' && r.M.st === 'ok' ? { ok: true, msg: 'I = ' + r.M.txt + ' dans la branche principale.' } : { ok: false, msg: r.slot !== 'P' ? 'L’ampèremètre n’est pas dans la branche principale.' : 'Écran « 1 » : change de calibre.' }; }; },
        e: 'I = 0,25 A : il faut le calibre 10 A, car 250 mA dépasse 200 mA.' },
      { type: 'qcm', title: 'La loi des nœuds', text: 'En dérivation, I₁ = 0,15 A et I₂ = 0,10 A. L’intensité principale vaut :', o: ['0,05 A', '0,15 A', '0,25 A', '0,10 A'], a: 2, hint: 'Additionne.', e: 'I = I₁ + I₂ = 0,25 A.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On mesure le courant en plusieurs points d’un circuit. Les intensités seront-elles identiques dans tous les montages ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-intensite', level: '5e', theme: 'Mesure de grandeurs physiques', title: 'Intensité du courant électrique', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’intensité du courant électrique se note <b>I</b>. Son unité est l’<b>ampère</b> (A) ; on utilise aussi le milliampère : 1 A = 1 000 mA.',
      'On la mesure avec un <b>ampèremètre</b> (multimètre en position A), branché <b>en série</b> : le courant entre par la borne A ou mA et sort par la borne <b>COM</b>.',
      'On commence par le plus grand calibre, puis on choisit le <b>plus petit calibre supérieur</b> à la valeur mesurée. L’affichage « 1 » indique un calibre trop petit.',
      'Dans un circuit <b>en série</b>, l’intensité est la <b>même en tout point</b>.',
      'Dans un circuit <b>en dérivation</b>, l’intensité dans la branche principale est égale à la <b>somme</b> des intensités dans les branches dérivées : I = I<sub>1</sub> + I<sub>2</sub>.'
    ],
    quiz: [
      { q: 'L’unité de l’intensité est :', o: ['le volt', 'l’ampère', 'le watt', 'l’ohm'], a: 1, e: 'Symbole A.' },
      { q: '0,25 A est égal à :', o: ['25 mA', '250 mA', '2 500 mA', '2,5 mA'], a: 1, e: '0,25 × 1 000 = 250 mA.' },
      { q: 'L’écran d’un ampèremètre affiche « 1 ». Il faut :', o: ['changer la pile', 'prendre un calibre plus grand', 'prendre un calibre plus petit', 'inverser les fils'], a: 1, e: 'Le calibre est trop petit.' },
      { q: 'Dans un circuit en série, l’intensité :', o: ['diminue après chaque lampe', 'est la même partout', 'est nulle', 'augmente après chaque lampe'], a: 1, e: 'Elle ne s’use pas !' },
      { q: 'En dérivation, I = 0,5 A et I₁ = 0,2 A. Alors I₂ vaut :', o: ['0,7 A', '0,3 A', '0,2 A', '0,5 A'], a: 1, e: 'I₂ = I − I₁ = 0,3 A.' }
    ]
  });
})();

