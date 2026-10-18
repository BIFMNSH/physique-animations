/* 3e · Électricité · Leçon : Le conducteur ohmique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var COL = ['#1A1A1A', '#7A4A1E', '#E5484D', '#FF8A2E', '#FFD84A', '#3DD68C', '#4C6BFF', '#9B5CF2', '#9AA6BC', '#F4F6FA'], CN = ['noir', 'marron', 'rouge', 'orange', 'jaune', 'vert', 'bleu', 'violet', 'gris', 'blanc'];
  var RES = { r47: { n: '47 Ω', R: 47, b: [4, 7, 0], c: '#FFB547' }, r100: { n: '100 Ω', R: 100, b: [1, 0, 1], c: '#5CFF9D' }, r220: { n: '220 Ω', R: 220, b: [2, 2, 1], c: '#9FB2FF' }, r470: { n: '470 Ω', R: 470, b: [4, 7, 1], c: '#FF8A80' }, lampe: { n: 'lampe', R: 0, c: '#FFE08A' } };
  function current(k, U) { if (k === 'lampe') { var R = 20 + 9 * U; return U / R; } return U / RES[k].R; }
  function band(b) { return (b[0] * 10 + b[1]) * Math.pow(10, b[2]); }
  function ohm(x) { return x >= 1000 ? fmt(x / 1000, x % 1000 ? 1 : 0) + ' kΩ' : fmt(x, 0) + ' Ω'; }
  function glow(G, col) { var id = 'co' + Math.floor(Math.random() * 1e9), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function resistor(G, x, y, w) { var g = s('g', {}, G); s('line', { x1: x - w / 2 - 30, x2: x + w / 2 + 30, y1: y, y2: y, stroke: '#C9D2E3', 'stroke-width': 3 }, g); s('rect', { x: x - w / 2, y: y - 14, width: w, height: 28, rx: 12, fill: '#E6D3B8', stroke: '#B79B72', 'stroke-width': 2 }, g); var bs = [0, 1, 2, 3].map(function (i) { return s('rect', { x: x - w / 2 + (w > 120 ? 20 : 12) + i * (w - (w > 120 ? 50 : 30)) / (w > 120 ? 3 : 3.3), y: y - 14, width: 7, height: 28, fill: i === 3 ? '#C8A46A' : '#000' }, g); }); return { g: g, bs: bs }; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'loi', k: 'r100', U: 6, pts: [], cb: [1, 0, 1], t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- CIRCUIT ---------- */
    var A = s('g', {}, G);
    s('path', { d: 'M110 330 V180 H230 M350 180 H470 V330 H330 M250 330 H110', fill: 'none', stroke: '#C9D2E3', 'stroke-width': 3 }, A);
    s('rect', { x: 84, y: 220, width: 52, height: 70, rx: 8, fill: '#2F3646', stroke: '#9AA6BC', 'stroke-width': 2 }, A); var genT = s('text', { x: 110, y: 262, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, A);
    var rz = resistor(A, 290, 180, 90), heat = s('ellipse', { cx: 290, cy: 180, rx: 70, ry: 34, fill: glow(G, '#FF6B3E') }, A), lampG = s('g', {}, A); s('circle', { cx: 290, cy: 180, r: 24, fill: '#1A2032', stroke: '#C9D2E3', 'stroke-width': 3 }, lampG); var bulb = s('circle', { cx: 290, cy: 180, r: 20 }, lampG); s('path', { d: 'M273 163 L307 197 M307 163 L273 197', stroke: '#C9D2E3', 'stroke-width': 2 }, lampG);
    var rT = s('text', { x: 290, y: 226, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8' }, A);
    s('path', { d: 'M230 180 V128 H350 V180', fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2 }, A); s('circle', { cx: 290, cy: 128, r: 18, fill: '#141C30', stroke: '#9FD7FF', 'stroke-width': 3 }, A); s('text', { x: 290, y: 134, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#9FD7FF', text: 'V' }, A); var vT = s('text', { x: 360, y: 134, 'font-size': 14, 'font-weight': 900, fill: '#9FD7FF' }, A);
    s('circle', { cx: 290, cy: 330, r: 22, fill: '#141C30', stroke: '#FF8A80', 'stroke-width': 3 }, A); s('text', { x: 290, y: 336, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: '#FF8A80', text: 'A' }, A); var aT = s('text', { x: 290, y: 376, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FF8A80' }, A);
    var lawT = s('text', { x: 290, y: 410, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, A), aMsg = s('text', { x: 290, y: 436, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- CODE DES COULEURS ---------- */
    var B = s('g', {}, G), big = resistor(B, 290, 170, 240);
    var legend = s('g', {}, B); for (var i = 0; i < 10; i++) { var lx = 70 + (i % 5) * 92, ly = 270 + Math.floor(i / 5) * 34; s('rect', { x: lx, y: ly, width: 22, height: 18, rx: 3, fill: COL[i], stroke: '#2B3A57', 'stroke-width': 1 }, legend); s('text', { x: lx + 28, y: ly + 14, 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: i + ' ' + CN[i] }, legend); }
    var cT1 = s('text', { x: 290, y: 236, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, B), cT2 = s('text', { x: 290, y: 372, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#FFC773' }, B);
    var omm = s('g', {}, B); s('rect', { x: 210, y: 386, width: 160, height: 40, rx: 8, fill: '#2F3646' }, omm); var ommT = s('text', { x: 290, y: 413, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#5CFF9D', 'font-family': 'monospace' }, omm);
    [['1er chiffre', 193, 126], ['2e chiffre', 256, 108], ['multiplicateur', 319, 126], ['tolérance', 383, 108]].forEach(function (l) { s('text', { x: l[1], y: l[2], 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: l[0] }, B); s('line', { x1: l[1], x2: l[1], y1: l[2] + 5, y2: 152, stroke: '#4A5568', 'stroke-width': 1 }, B); });
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var GA = s('g', {}, P), gx0 = PX + 46, gy0 = 248, gw = 210, gh = 170, IMAX = 0.26;
    for (var k = 0; k <= 6; k++) { var yg = gy0 - k * gh / 6; s('line', { x1: gx0, x2: gx0 + gw, y1: yg, y2: yg, stroke: '#1E2A44', 'stroke-width': 1 }, GA); s('text', { x: gx0 - 6, y: yg + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#A9B4C7', text: k * 2 }, GA); }
    for (k = 0; k <= 5; k++) { var xg = gx0 + k * gw / 5; s('line', { x1: xg, x2: xg, y1: gy0, y2: gy0 - gh, stroke: '#1E2A44', 'stroke-width': 1 }, GA); s('text', { x: xg, y: gy0 + 14, 'text-anchor': 'middle', 'font-size': 10, fill: '#A9B4C7', text: k * 50 }, GA); }
    s('text', { x: gx0 + gw, y: gy0 + 30, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'I (mA)' }, GA); s('text', { x: gx0 - 4, y: gy0 - gh - 10, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'U (V)' }, GA);
    var lines = s('g', {}, GA), ptsG = s('g', {}, GA), cur = s('circle', { r: 6, fill: 'none', 'stroke-width': 2.5 }, GA);
    var form = s('text', { x: PX + 140, y: 300, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#FFC773', text: 'U = R × I' }, P);
    var pq = [0, 1, 2, 3, 4].map(function (k2) { return s('text', { x: PX + 140, y: 330 + k2 * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k2) { t.textContent = a[k2] || ''; }); }
    function gp(I, U) { return [gx0 + Math.min(1.04, I / IMAX) * gw, gy0 - Math.min(12.4, U) / 12 * gh]; }
    var last = performance.now();
    function step() {
      var now = performance.now(), T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'loi' ? '' : 'none'; B.style.display = st.mode === 'code' ? '' : 'none';
      if (st.mode === 'loi') {
        var lamp = st.k === 'lampe', U = st.U, I = current(st.k, U), Rv = I > 0 ? U / I : (lamp ? 20 : RES[st.k].R);
        rz.g.style.display = heat.style.display = lamp ? 'none' : ''; lampG.style.display = lamp ? '' : 'none';
        if (!lamp) RES[st.k].b.forEach(function (b, i) { rz.bs[i].setAttribute('fill', COL[b]); });
        var Pj = U * I; heat.setAttribute('opacity', lamp ? 0 : Math.min(1, Pj / 1.5)); bulb.setAttribute('fill', 'rgb(' + Math.round(40 + 215 * Math.min(1, Pj / 1)) + ',' + Math.round(40 + 190 * Math.min(1, Pj / 1)) + ',' + Math.round(50 + 80 * Math.min(1, Pj)) + ')');
        genT.textContent = fmt(U, 1) + ' V'; vT.textContent = fmt(U, 1) + ' V'; aT.textContent = 'I = ' + fmt(I * 1000, 1) + ' mA'; rT.textContent = lamp ? 'lampe' : 'R = ' + RES[st.k].n;
        lawT.textContent = U > 0 ? 'U / I = ' + fmt(U, 1) + ' / ' + fmt(I, 3) + ' = ' + fmt(Rv, 0) + ' Ω' : 'U = 0 : I = 0';
        aMsg.textContent = lamp ? 'Pour la lampe, U / I change : ce n’est pas un conducteur ohmique' : 'Pour un conducteur ohmique, U / I = R reste constant';
        pT.textContent = 'CARACTÉRISTIQUE U = f(I)'; GA.style.display = '';
        while (lines.firstChild) lines.removeChild(lines.firstChild); while (ptsG.firstChild) ptsG.removeChild(ptsG.firstChild);
        var byK = {}; st.pts.forEach(function (q) { (byK[q.k] = byK[q.k] || []).push(q); var p = gp(q.I, q.U); s('circle', { cx: p[0], cy: p[1], r: 4.5, fill: RES[q.k].c, stroke: '#0A0F1A', 'stroke-width': 1.5 }, ptsG); });
        Object.keys(byK).forEach(function (kk) { var arr = byK[kk]; if (arr.length < 2) return; if (kk === 'lampe') { var d = 'M' + gp(0, 0).join(' '); for (var u = 0.25; u <= 12; u += 0.25) d += ' L' + gp(current('lampe', u), u).join(' '); s('path', { d: d, fill: 'none', stroke: RES.lampe.c, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, lines); } else { var R = RES[kk].R, Iend = Math.min(IMAX * 1.04, 12.4 / R), a = gp(0, 0), b = gp(Iend, Iend * R); s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: RES[kk].c, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, lines); } });
        var cp = gp(I, U); attr(cur, { cx: cp[0], cy: cp[1], stroke: RES[st.k].c });
        form.style.display = ''; form.textContent = 'U = R × I';
        pset(lamp ? ['La caractéristique de la lampe', 'n’est pas une droite :', 'sa résistance augmente', 'quand elle chauffe.', ''] : ['Conducteur ohmique : la caractéristique', 'est une droite passant par l’origine.', 'R : résistance, en ohms (Ω).', 'Il chauffe : c’est l’effet Joule', '(fer à repasser, chauffe-eau).']);
        res = { U: U, I: I, R: Rv, k: st.k, n: st.pts.length };
      } else {
        var b = st.cb, val = band(b); [0, 1, 2].forEach(function (i) { big.bs[i].setAttribute('fill', COL[b[i]]); }); big.bs[3].setAttribute('fill', '#C8A46A');
        cT1.textContent = CN[b[0]] + ' (' + b[0] + ') · ' + CN[b[1]] + ' (' + b[1] + ') · ' + CN[b[2]] + ' (× ' + Math.pow(10, b[2]) + ')';
        cT2.textContent = 'R = ' + b[0] + '' + b[1] + ' × ' + Math.pow(10, b[2]) + ' = ' + ohm(val); ommT.textContent = ohm(val * (1 + 0.012 * Math.sin(T * 0.7)));
        pT.textContent = 'MESURER UNE RÉSISTANCE'; GA.style.display = 'none'; form.style.display = ''; form.textContent = 'R = ' + ohm(val);
        pset(['On lit la résistance avec le', 'code des couleurs, ou on la mesure', 'avec un ohmmètre (hors circuit).', 'Bande or : tolérance de 5 %.', '1 kΩ = 1 000 Ω']);
        res = { val: val, b: b.slice() };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La résistance' }, { t: 8, title: 'Mesures U et I' }, { t: 22, title: 'La loi d’Ohm' }, { t: 32, title: 'Une autre résistance' }, { t: 40, title: 'Et la lampe ?' }, { t: 48, title: 'Code des couleurs' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Loi d’Ohm : <b>U = R × I</b>', 'R en ohms (Ω), U en volts, I en ampères.', '#FFC773'],
      ['Caractéristique : une <b>droite</b> par l’origine', 'la lampe, elle, n’est pas un conducteur ohmique.', '#5CFF9D'],
      ['R se lit au <b>code des couleurs</b> ou à l’ohmmètre', 'un conducteur ohmique chauffe : l’effet Joule.', '#FF8A80']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function P(k, U) { return { k: k, U: U, I: current(k, U) }; }
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.mode = 'loi'; st.k = 'r100'; st.pts = [];
        if (t < 8) { st.U = 6; }
        else if (t < 22) { var n = Math.min(5, Math.floor((t - 8) / 2.6) + 1); st.U = n * 2; for (var i = 1; i < n; i++) st.pts.push(P('r100', i * 2)); }
        else if (t < 32) { st.U = 6; [2, 4, 6, 8, 10].forEach(function (u) { st.pts.push(P('r100', u)); }); }
        else if (t < 40) { st.k = 'r220'; st.U = t < 36 ? 6 : 10; [2, 4, 6, 8, 10].forEach(function (u) { st.pts.push(P('r100', u)); }); [4, 8, 12].forEach(function (u) { st.pts.push(P('r220', u)); }); }
        else if (t < 48) { st.k = 'lampe'; st.U = 2 + Math.floor((t - 40) / 1.6) * 2; [2, 4, 6, 8, 10].forEach(function (u) { st.pts.push(P('r100', u)); }); [2, 4, 6, 8, 10, 12].forEach(function (u) { if (u < st.U || t > 47) st.pts.push(P('lampe', u)); }); }
        else { st.mode = 'code'; st.cb = t < 52.5 ? [1, 0, 1] : [2, 2, 1]; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Qu’est-ce qu’une résistance ?') || tg.show(t, 9, 21.6, 290, 92, fmt(st.U, 0) + ' V → ' + fmt(current('r100', st.U) * 1000, 0) + ' mA') || tg.show(t, 23, 31.6, 290, 92, '6 V / 0,06 A = 100 Ω') ||
          tg.show(t, 33, 39.6, 290, 92, '220 Ω : moins de courant') || tg.show(t, 41, 47.6, 290, 92, 'La lampe : une courbe') || tg.show(t, 49, 56.6, 290, 92, st.cb[0] === 1 ? 'marron, noir, marron : 100 Ω' : 'rouge, rouge, marron : 220 Ω');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un conducteur ohmique de 100 Ω branché avec un générateur réglable, un voltmètre et un ampèremètre ; sous 2, 4, 6, 8 et 10 V, l’intensité vaut 20, 40, 60, 80 et 100 mA et les points du graphique U = f(I) forment une droite passant par l’origine ; une résistance de 220 Ω donne une droite plus pentue ; une lampe donne une courbe ; enfin la lecture du code des couleurs : marron, noir, marron pour 100 Ω, rouge, rouge, marron pour 220 Ω',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Dans les appareils électroniques, on trouve de petits composants à bandes de couleur : des conducteurs ohmiques, ou résistances. À quoi servent-ils ?', sub: 'Le <b>conducteur ohmique</b>.' },
      { t: 8, d: 13.6, say: 'Branchons un conducteur ohmique de cent ohms. Sous deux volts, l’intensité vaut vingt milliampères ; sous quatre volts, quarante ; sous six volts, soixante. Quand la tension double, l’intensité double.', sub: 'U et I sont <b>proportionnels</b>.' },
      { t: 22, d: 9.6, say: 'Les points forment une droite passant par l’origine. Le rapport U sur I est constant : c’est la résistance R. Six volts divisés par zéro virgule zéro six ampère : cent ohms. C’est la loi d’Ohm : U égale R fois I.', sub: '<b>U = R × I</b> : la loi d’Ohm.' },
      { t: 32, d: 7.6, say: 'Avec une résistance de deux cent vingt ohms, le courant est plus faible : la droite est plus pentue. Plus R est grande, plus elle s’oppose au passage du courant.', sub: 'Plus R est grande, plus I est petite.' },
      { t: 40, d: 7.6, say: 'Pour une lampe, les points ne sont pas alignés : sa résistance augmente quand elle chauffe. Ce n’est pas un conducteur ohmique.', sub: 'La lampe : pas un conducteur ohmique.' },
      { t: 48, d: 8.6, say: 'On lit la résistance grâce au code des couleurs : marron, noir, marron, c’est un, zéro, et un zéro : cent ohms. On peut aussi la mesurer avec un ohmmètre.', sub: '<b>Code des couleurs</b> ou ohmmètre.' },
      { t: 57, d: 4.6, say: 'À retenir : la loi d’Ohm, U égale R fois I.', sub: 'U = R × I.' },
      { t: 61.8, d: 4.2, say: 'Sa caractéristique est une droite passant par l’origine.', sub: 'Une droite par l’origine.' },
      { t: 66.2, d: 4.8, say: 'Un conducteur ohmique chauffe quand le courant passe : c’est l’effet Joule.', sub: 'L’effet Joule.' }
    ],
    learn: [
      { t: 21, ch: 1, html: 'Pour un conducteur ohmique, U et I sont <b>proportionnels</b>.' },
      { t: 31, ch: 2, html: 'Loi d’Ohm : <b>U = R × I</b>, R en ohms (Ω).' },
      { t: 47, ch: 4, html: 'La lampe n’est <b>pas</b> un conducteur ohmique.' },
      { t: 56, ch: 5, html: 'Code des couleurs : 2 chiffres puis le <b>multiplicateur</b>.' }
    ],
    question: { q: 'Un conducteur ohmique de 50 Ω est traversé par 0,2 A. La tension à ses bornes :', o: ['250 V', '10 V', '0,004 V', '50,2 V'], a: 1, e: 'U = 50 × 0,2 = 10 V.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : un circuit avec un générateur réglable de 0 à 12 V, un conducteur ohmique de 47, 100, 220 ou 470 Ω ou une lampe, un voltmètre et un ampèremètre ; chaque relevé place un point sur le graphique U = f(I) ; puis un conducteur ohmique dont on choisit les couleurs des bandes, avec le code des couleurs et un ohmmètre',
    steps: [
      'Choisis le conducteur de 100 Ω et relève U et I pour plusieurs tensions.',
      'Trace la caractéristique U = f(I) : quelle est sa forme ?',
      'Compare avec 220 Ω, puis avec la lampe.',
      'Code des couleurs : retrouve la valeur d’une résistance.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'loi', options: [{ v: 'loi', l: 'Loi d’Ohm' }, { v: 'code', l: 'Code des couleurs' }], onChange: function (v) { st.mode = v; vis(); } });
      var cK = c.seg({ label: 'Dipôle', value: 'r100', options: [{ v: 'r47', l: '47 Ω' }, { v: 'r100', l: '100 Ω' }, { v: 'r220', l: '220 Ω' }, { v: 'r470', l: '470 Ω' }, { v: 'lampe', l: 'lampe' }], onChange: function (v) { st.k = v; } });
      var sU = c.slider({ label: 'Tension du générateur', min: 0, max: 12, step: 1, value: 6, unit: 'V', dec: 0, onInput: function (v) { st.U = v; } });
      var bC = c.button({ label: 'Effacer le graphique', sm: true, onClick: function () { st.pts = []; rows = rows.filter(function () { return false; }); paint(); } });
      var opts = CN.map(function (n, i) { return { v: String(i), l: n }; });
      var c1 = c.seg({ label: '1re bande', value: '1', options: opts.slice(1), onChange: function (v) { st.cb[0] = +v; } }), c2 = c.seg({ label: '2e bande', value: '0', options: opts, onChange: function (v) { st.cb[1] = +v; } }), c3 = c.seg({ label: 'Multiplicateur', value: '1', options: opts.slice(0, 7), onChange: function (v) { st.cb[2] = +v; } });
      function vis() { var l = st.mode === 'loi'; cK.hide(!l); sU.hide(!l); bC.style.display = l ? '' : 'none'; c1.hide(l); c2.hide(l); c3.hide(l); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'U' }, { k: 'b', label: 'I' }, { k: 'c', label: 'U / I' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'loi') { ro.a.set(fmt(last.U, 1) + ' V'); ro.b.set(fmt(last.I * 1000, 1) + ' mA'); ro.c.set(last.U > 0 ? fmt(last.R, 0) + ' Ω' : '—'); } else { ro.a.set('—'); ro.b.set('—'); ro.c.set(ohm(last.val)); } });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { if (st.mode === 'loi') { st.pts.push({ k: st.k, U: st.U, I: last.I }); rows.push({ d: RES[st.k].n, u: fmt(st.U, 1), i: fmt(last.I * 1000, 1), r: st.U > 0 ? fmt(last.R, 0) : '—' }); } else rows.push({ d: 'code ' + st.cb.map(function (b) { return CN[b]; }).join('-'), u: '—', i: '—', r: ohm(last.val) }); api.sound('ok'); paint(); if (rows.length >= 6) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Dipôle</th><th>U (V)</th><th>I (mA)</th><th>U / I (Ω)</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.d + '</td><td>' + r.u + '</td><td>' + r.i + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Code des couleurs</h3><table class="mt"><tbody>' + CN.map(function (n, i) { return '<tr><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + COL[i] + ';vertical-align:-2px;margin-right:6px;border:1px solid #2B3A57"></span>' + n + '</td><td>' + i + '</td><td>× ' + Math.pow(10, i) + '</td></tr>'; }).slice(0, 7).join('') + '</tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'loi', k: 'r100', U: 6, pts: [], cb: [1, 0, 1] }); cM.set('loi'); cK.set('r100'); sU.set(6); c1.set('1'); c2.set('0'); c3.set('1'); vis(); rows = []; paint(); });
      api.say('Règle la tension et relève U et I.');
      return { bilan: function () {
        if (rows.length < 4) return '<p>Relève au moins 4 mesures.</p>';
        return '<p>Pour un <b>conducteur ohmique</b>, la tension U à ses bornes et l’intensité I qui le traverse sont <b>proportionnelles</b> : sa caractéristique U = f(I) est une <b>droite passant par l’origine</b>. Le coefficient de proportionnalité est sa <b>résistance R</b>, en ohms (Ω) : c’est la <b>loi d’Ohm</b>, <b>U = R × I</b>.</p><p>Plus la résistance est grande, plus l’intensité est faible pour une même tension. La lampe n’est pas un conducteur ohmique : sa caractéristique n’est pas une droite.</p><p>La valeur d’une résistance se lit grâce au <b>code des couleurs</b> (deux chiffres puis un multiplicateur) ou se mesure à l’<b>ohmmètre</b>, hors circuit. Traversé par un courant, un conducteur ohmique s’échauffe : c’est l’<b>effet Joule</b>, utilisé dans les radiateurs, fers à repasser et chauffe-eau.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Le conducteur ohmique' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’électronicien',
    intro: 'Mesure, calcule et décode les résistances !',
    missions: [
      { title: '20 mA', text: 'Avec la résistance de <b>470 Ω</b>, obtiens une intensité d’environ <span style="color:#FF8A80">20 mA</span>.', lumi: 'U = R × I.', hint: '470 × 0,02 ≈ 9 V.',
        build: function (api) { var lab = mini(api, { k: 'r470', U: 2 }); api.c.slider({ label: 'Tension', min: 0, max: 12, step: 1, value: 2, unit: 'V', dec: 0, onInput: function (v) { lab.st.U = v; } }); return function () { var r = lab.res(); return Math.abs(r.I * 1000 - 20) < 1.2 ? { ok: true, msg: fmt(r.U, 0) + ' V / 470 Ω = ' + fmt(r.I * 1000, 1) + ' mA.' } : { ok: false, msg: 'I = ' + fmt(r.I * 1000, 1) + ' mA.' }; }; },
        e: 'U = 470 × 0,020 ≈ 9,4 V : on prend 9 V.' },
      { title: 'Trouver R', text: 'Sous 10 V, une résistance laisse passer environ <b>45 mA</b>. Laquelle est-ce ?', lumi: 'R = U / I.', hint: '10 / 0,045 ≈ 220 Ω.',
        build: function (api) { var lab = mini(api, { k: 'r47', U: 10 }); api.c.seg({ label: 'Dipôle', value: 'r47', options: [{ v: 'r47', l: '47 Ω' }, { v: 'r100', l: '100 Ω' }, { v: 'r220', l: '220 Ω' }, { v: 'r470', l: '470 Ω' }], onChange: function (v) { lab.st.k = v; } }); return function () { var r = lab.res(); return r.k === 'r220' ? { ok: true, msg: '10 V / 220 Ω = 45,5 mA.' } : { ok: false, msg: 'I = ' + fmt(r.I * 1000, 1) + ' mA.' }; }; },
        e: 'R = 10 / 0,045 ≈ 220 Ω.' },
      { title: 'Décoder', text: 'Compose les couleurs d’une résistance de <span style="color:#FFC773">4,7 kΩ</span>.', lumi: '47 × 100…', hint: 'jaune, violet, rouge.',
        build: function (api) { var lab = mini(api, { mode: 'code', cb: [1, 0, 1] }); var opts = CN.map(function (n, i) { return { v: String(i), l: n }; }); api.c.seg({ label: '1re bande', value: '1', options: opts.slice(1), onChange: function (v) { lab.st.cb[0] = +v; } }); api.c.seg({ label: '2e bande', value: '0', options: opts, onChange: function (v) { lab.st.cb[1] = +v; } }); api.c.seg({ label: 'Multiplicateur', value: '1', options: opts.slice(0, 7), onChange: function (v) { lab.st.cb[2] = +v; } }); return function () { var r = lab.res(); return r.val === 4700 ? { ok: true, msg: 'Jaune (4), violet (7), rouge (× 100) : 4 700 Ω.' } : { ok: false, msg: 'Valeur : ' + ohm(r.val) + '.' }; }; },
        e: '47 × 10² = 4 700 Ω.' },
      { type: 'qcm', title: 'La caractéristique', text: 'La caractéristique U = f(I) d’un conducteur ohmique est :', o: ['une courbe', 'une droite passant par l’origine', 'une droite horizontale', 'un cercle'], a: 1, hint: 'U et I sont proportionnels.', e: 'Une droite par l’origine.' },
      { type: 'qcm', title: 'Effet Joule', text: 'Le fer à repasser chauffe grâce :', o: ['à l’effet Joule', 'à la loi des nœuds', 'au court-circuit', 'au champ magnétique'], a: 0, hint: 'Une résistance traversée par un courant…', e: 'Effet Joule : la résistance chauffe.' }
    ]
  };

  S.start({
    id: '3e-conducteur-ohmique', level: '3e', theme: 'Électricité', title: 'Le conducteur ohmique', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Pour un <b>conducteur ohmique</b>, la tension U à ses bornes est <b>proportionnelle</b> à l’intensité I qui le traverse.',
      '<b>Loi d’Ohm</b> : <b>U = R × I</b> (U en volts, I en ampères, R en <b>ohms Ω</b>). R est la <b>résistance</b> du conducteur.',
      'Sa <b>caractéristique</b> U = f(I) est une <b>droite passant par l’origine</b>, dont le coefficient directeur est R. La lampe n’est pas un conducteur ohmique.',
      'On détermine R avec un <b>ohmmètre</b> (hors circuit), par le calcul R = U / I, ou avec le <b>code des couleurs</b> (2 chiffres puis le multiplicateur).',
      'Traversé par un courant, un conducteur ohmique s’échauffe : c’est l’<b>effet Joule</b> (radiateur, fer à repasser, chauffe-eau, fusible).'
    ],
    quiz: [
      { q: 'L’unité de résistance est :', o: ['le volt', 'l’ampère', 'l’ohm', 'le watt'], a: 2, e: 'L’ohm (Ω).' },
      { q: 'La loi d’Ohm s’écrit :', o: ['U = R / I', 'U = R × I', 'I = R × U', 'R = U × I'], a: 1, e: 'U = R × I.' },
      { q: 'Une résistance de 1 kΩ sous 5 V est traversée par :', o: ['5 A', '0,5 A', '5 mA', '200 mA'], a: 2, e: 'I = 5 / 1 000 = 0,005 A = 5 mA.' },
      { q: 'Les bandes marron, noir, rouge indiquent :', o: ['102 Ω', '1 000 Ω', '100 Ω', '10 Ω'], a: 1, e: '10 × 100 = 1 000 Ω.' },
      { q: 'L’échauffement d’un conducteur parcouru par un courant s’appelle :', o: ['effet Joule', 'effet Ohm', 'court-circuit', 'induction'], a: 0, e: 'L’effet Joule.' }
    ]
  });
})();
