/* 4e · Eau potable · Leçon : Traitement de l’eau */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var ST = [
    { k: 'gr', n: 'Dégrillage', x0: 104, x1: 196, tank: false, c: '#A9B4C7' },
    { k: 'de', n: 'Décantation', x0: 214, x1: 370, tank: true, c: '#C8A46A' },
    { k: 'fi', n: 'Filtration', x0: 388, x1: 510, tank: true, c: '#E6D3A3' },
    { k: 'ch', n: 'Désinfection', x0: 528, x1: 648, tank: true, c: '#3DD68C' }
  ];
  var TYPES = [['debris', '#7A5A2E'], ['sable', '#C8A46A'], ['argile', '#9C7B52'], ['microbe', '#3DD68C']];
  function quality(st) {
    var deb = st.gr ? 0 : 1;
    var sand = (st.de ? Math.exp(-st.tDec * 1.6) : 1) * (st.fi ? 0.02 : 1);
    var clay = (st.de ? Math.exp(-st.tDec * 0.3) : 1) * (st.fi ? 0.07 : 1);
    var mic = (st.fi ? 0.6 : 1) * (st.ch ? Math.exp(-st.dose * 3) : 1);
    var tooMuch = st.ch && st.dose > 1.5;
    var pot = deb === 0 && sand < 0.05 && clay < 0.1 && mic < 0.05 && !tooMuch;
    return { deb: deb, sand: sand, clay: clay, mic: mic, tooMuch: tooMuch, pot: pot };
  }
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); k = Math.max(0, Math.min(1, k)); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }
  function water(cl) { return mixc('#4FA8FF', '#8B6B3D', Math.pow(cl, 0.6)); }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }

  function Lab(G, o) {
    var st = Object.assign({ gr: true, de: true, fi: true, ch: true, tDec: 2, dose: 1.2, t: null, verdict: true }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#07101A' }, G);
    s('rect', { x: 0, y: 330, width: 860, height: 140, fill: '#0B1524' }, G);
    // rivière
    s('path', { d: 'M0 196 q25 -8 50 0 t50 0 V284 H0Z', fill: '#8B6B3D', opacity: 0.75 }, G);
    s('text', { x: 46, y: 182, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C8A46A', text: 'rivière' }, G);
    s('path', { d: 'M14 300 q14 -26 30 -6 M58 304 q10 -22 24 -4', stroke: '#3DD68C', 'stroke-width': 3, fill: 'none', opacity: 0.7 }, G);
    // conduites entre les étapes
    var pipes = s('g', {}, G), PW = [];
    [[96, 104], [196, 214], [370, 388], [510, 528], [648, 676]].forEach(function (p) { PW.push(s('rect', { x: p[0], y: 214, width: p[1] - p[0], height: 52 }, pipes)); s('rect', { x: p[0], y: 210, width: p[1] - p[0], height: 4, fill: '#5B6680' }, pipes); s('rect', { x: p[0], y: 266, width: p[1] - p[0], height: 4, fill: '#5B6680' }, pipes); });
    var SG = ST.map(function (S0, i) {
      var g = s('g', {}, G), top = S0.tank ? 150 : 206, bot = S0.tank ? 326 : 274;
      var wtr = s('rect', { x: S0.x0, y: S0.tank ? 172 : 214, width: S0.x1 - S0.x0, height: (S0.tank ? 150 : 52) }, g);
      var extra = s('g', {}, g);
      s('path', { d: 'M' + S0.x0 + ' ' + top + 'V' + bot + 'H' + S0.x1 + 'V' + top, fill: 'none', stroke: '#7D89A3', 'stroke-width': 3 }, g);
      var badge = s('g', {}, g); s('circle', { cx: (S0.x0 + S0.x1) / 2 - 52, cy: 94, r: 12, fill: S0.c }, badge); s('text', { x: (S0.x0 + S0.x1) / 2 - 52, y: 98, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#0B1220', text: i + 1 }, badge);
      s('text', { x: (S0.x0 + S0.x1) / 2 - 34, y: 99, 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8', text: S0.n }, badge);
      var off = s('text', { x: (S0.x0 + S0.x1) / 2, y: S0.tank ? 205 : 244, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#FF8A80', text: 'désactivé' }, g);
      return { g: g, wtr: wtr, extra: extra, off: off, badge: badge };
    });
    // 1 grille
    var grill = s('g', {}, SG[0].extra); for (var i = 0; i < 6; i++) s('rect', { x: 147, y: 208 + i * 11, width: 6, height: 8, rx: 1, fill: '#C9D2E3' }, grill); s('rect', { x: 148, y: 204, width: 4, height: 72, fill: '#C9D2E3' }, grill);
    // 2 décanteur : boues
    var sludge = s('path', { fill: '#6B5434' }, SG[1].extra), clock = s('text', { x: 292, y: 190, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#FFE29A' }, SG[1].extra);
    // 3 filtre : sable et gravier
    var FL = s('g', {}, SG[2].extra); s('rect', { x: 388, y: 236, width: 122, height: 54, fill: '#D8C08A' }, FL); s('rect', { x: 388, y: 290, width: 122, height: 36, fill: '#7D7A72' }, FL);
    for (i = 0; i < 40; i++) s('circle', { cx: 392 + rnd(i, 1) * 114, cy: 240 + rnd(i, 2) * 46, r: 1.6, fill: '#A88B50' }, FL);
    for (i = 0; i < 16; i++) s('circle', { cx: 396 + rnd(i, 3) * 106, cy: 296 + rnd(i, 4) * 26, r: 5, fill: '#9B978C' }, FL);
    s('text', { x: 449, y: 268, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#5C4A22', text: 'sable' }, FL); s('text', { x: 449, y: 314, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#2F2E2A', text: 'gravier' }, FL);
    // 4 chlore
    var CL = s('g', {}, SG[3].extra); s('rect', { x: 568, y: 116, width: 40, height: 34, rx: 6, fill: '#E8F4FF' }, CL); s('rect', { x: 580, y: 108, width: 16, height: 10, rx: 2, fill: '#3DD68C' }, CL); s('text', { x: 588, y: 138, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#0B5E3A', text: 'chlore' }, CL);
    var drops = [0, 1, 2].map(function () { return s('path', { d: 'M0 -6 q5 6 0 10 q-5 -4 0 -10z', fill: '#9BF0C5' }, CL); });
    var doseT = s('text', { x: 588, y: 190, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#B8FFD9' }, CL);
    // château d’eau + verre
    var TW = s('g', {}, G);
    s('rect', { x: 690, y: 132, width: 92, height: 70, rx: 10 }, TW); var towerW = TW.lastChild;
    s('path', { d: 'M700 202 L690 330 M772 202 L782 330 M696 260 H776', stroke: '#7D89A3', 'stroke-width': 4 }, TW);
    s('rect', { x: 690, y: 132, width: 92, height: 70, rx: 10, fill: 'none', stroke: '#7D89A3', 'stroke-width': 3 }, TW);
    s('text', { x: 736, y: 99, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8', text: 'château d’eau' }, TW);
    s('path', { d: 'M782 300 H812 V312', stroke: '#C9D2E3', 'stroke-width': 6, fill: 'none' }, TW);
    var glassW = s('path', { d: 'M800 334 L804 380 H836 L840 334 Z' }, TW); s('path', { d: 'M796 320 L804 384 H836 L844 320', stroke: '#BFE6FF', 'stroke-width': 2.5, fill: 'none' }, TW);
    var verdict = s('g', {}, G), vR = s('rect', { x: 676, y: 392, width: 172, height: 34, rx: 17 }, verdict), vT = s('text', { x: 762, y: 414, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900 }, verdict);
    // particules
    var PG = s('g', {}, G), P = [];
    for (i = 0; i < 70; i++) {
      var ty = i < 8 ? 0 : i < 26 ? 1 : i < 50 ? 2 : 3, e;
      if (ty === 0) e = s('path', { d: 'M-8 -2 q8 -8 16 0 q-8 6 -16 0z', fill: TYPES[0][1] }, PG);
      else if (ty === 3) { e = s('g', {}, PG); s('circle', { r: 4.5, fill: TYPES[3][1] }, e); s('circle', { cx: -1.5, cy: -1, r: 1, fill: '#0B1220' }, e); s('circle', { cx: 1.5, cy: -1, r: 1, fill: '#0B1220' }, e); }
      else e = s('circle', { r: ty === 1 ? 3 : 2, fill: TYPES[ty][1] }, PG);
      P.push({ e: e, ty: ty, ph: rnd(i, 7), sp: 0.05 + rnd(i, 8) * 0.03, off: rnd(i, 9) * 2 - 1, r: rnd(i, 10) });
    }
    // jauges
    var BG = s('g', {}, G), bars = [['Débris', '#7A5A2E'], ['Sable', '#C8A46A'], ['Turbidité', '#9C7B52'], ['Microbes', '#3DD68C']].map(function (b, k) {
      var x = 24 + k * 160; s('text', { x: x, y: 362, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: b[0].toUpperCase() }, BG);
      s('rect', { x: x, y: 372, width: 140, height: 14, rx: 7, fill: '#1A2540' }, BG);
      return { f: s('rect', { x: x, y: 372, width: 0, height: 14, rx: 7, fill: b[1] }, BG), v: s('text', { x: x + 140, y: 362, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8' }, BG) };
    });
    var bNote = s('text', { x: 24, y: 412, 'font-size': 13, fill: '#C9D2E3' }, BG), bNote2 = s('text', { x: 24, y: 432, 'font-size': 13, fill: '#C9D2E3' }, BG);

    function yBand(x) { for (var k = 0; k < ST.length; k++) if (ST[k].tank && x >= ST[k].x0 && x <= ST[k].x1) return [180, 316]; return [220, 260]; }
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, Q = quality(st);
      SG.forEach(function (g, k) { var on = st[ST[k].k]; g.off.style.display = on ? 'none' : ''; g.extra.setAttribute('opacity', on ? 1 : 0.18); g.badge.setAttribute('opacity', on ? 1 : 0.5); });
      // couleur de l’eau
      var c0 = water(1), cDe = water(st.de ? Math.exp(-st.tDec * 0.3) : 1), cFi = water((st.de ? Math.exp(-st.tDec * 0.3) : 1) * (st.fi ? 0.07 : 1)), cEnd = water(Q.clay);
      PW[0].setAttribute('fill', c0); PW[1].setAttribute('fill', c0); PW[2].setAttribute('fill', cDe); PW[3].setAttribute('fill', cFi); PW[4].setAttribute('fill', cEnd);
      SG[0].wtr.setAttribute('fill', c0); SG[1].wtr.setAttribute('fill', mixc('#4FA8FF', '#8B6B3D', Math.pow((1 + (st.de ? Math.exp(-st.tDec * 0.3) : 1)) / 2, 0.6)));
      SG[2].wtr.setAttribute('fill', cDe); SG[3].wtr.setAttribute('fill', cFi);
      [PW, SG.map(function (g) { return g.wtr; })].forEach(function (L) { L.forEach(function (e) { e.setAttribute('opacity', 0.75); }); });
      towerW.setAttribute('fill', cEnd); glassW.setAttribute('fill', cEnd);
      var sl = st.de ? Math.min(1, st.tDec / 3) : 0; sludge.setAttribute('d', 'M214 326 V' + (326 - 4 - sl * 22) + ' q78 -' + (6 + sl * 6) + ' 156 0 V326Z'); clock.textContent = st.de ? 'repos : ' + fmt(st.tDec, 1) + ' h' : '';
      doseT.textContent = st.ch ? fmt(st.dose, 1) + ' mg/L' : '';
      drops.forEach(function (d, k) { var ph = ((T * 1.2 + k / 3) % 1); d.setAttribute('transform', 'translate(588 ' + (154 + ph * 22) + ')'); d.style.display = st.ch && st.dose > 0 ? '' : 'none'; });
      // particules
      var X0 = 96, X1 = 812;
      P.forEach(function (p) {
        var u = (T * p.sp + p.ph) % 1, x = X0 + u * (X1 - X0), b = yBand(x), y = (b[0] + b[1]) / 2 + p.off * (b[1] - b[0]) / 2 * 0.85, op = 1, show = true;
        if (p.ty === 0 && st.gr && x > 146) { x = 140 - p.r * 4; y = 214 + ((p.off + 1) / 2) * 48; }
        if (p.ty === 1 && st.de && p.r > Math.exp(-st.tDec * 1.6) && x > ST[1].x0 + 20) { var xs = ST[1].x0 + 20 + p.r * 110; if (x > xs) { var sink = Math.min(1, (x - xs) / 60); y = y + (318 - y) * sink; x = xs + (x - xs) * 0.25; } }
        if (p.ty === 2 && st.de && p.r > Math.exp(-st.tDec * 0.3) && x > ST[1].x0 + 30) { var xs2 = ST[1].x0 + 30 + p.r * 100; if (x > xs2) { var s2 = Math.min(1, (x - xs2) / 120); y = y + (318 - y) * s2; x = xs2 + (x - xs2) * 0.35; } }
        if ((p.ty === 1 || p.ty === 2) && st.fi && x > 400 && p.r > (p.ty === 1 ? 0.02 : 0.07) && y < 318) { x = Math.min(x, 400 + p.r * 100); y = Math.max(y, 240 + p.ph * 46); }
        if (p.ty === 3) {
          if (st.fi && p.r < 0.4 && x > 400) { x = Math.min(x, 400 + p.r * 240); y = Math.max(y, 240 + p.ph * 44); }
          else if (st.ch && x > 548) { var r2 = st.fi ? (p.r - 0.4) / 0.6 : p.r; if (r2 > Math.exp(-st.dose * 3)) op = Math.max(0, 1 - (x - 548) / 60); }
        }
        if (x > 676 && x < 800) show = false; // dans le château d’eau
        if (x >= 800) { x = 812 + ((p.ph * 31) % 1) * 18; y = 344 + ((p.ph * 17) % 1) * 30; if (p.ty === 0) show = false; }
        p.e.style.display = show && op > 0.02 ? '' : 'none'; p.e.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); p.e.setAttribute('opacity', op);
      });
      // jauges
      [Q.deb, Q.sand, Q.clay, Q.mic].forEach(function (v, k) { attr(bars[k].f, { width: Math.max(0, 140 * v) }); bars[k].v.textContent = Math.round(v * 100) + ' %'; });
      verdict.style.display = st.verdict ? '' : 'none';
      vR.setAttribute('fill', Q.pot ? '#3DD68C' : '#FF5A4E'); vT.setAttribute('fill', Q.pot ? '#06281A' : '#2A0805'); vT.textContent = Q.pot ? 'EAU POTABLE' : 'NON POTABLE';
      var why = Q.deb ? 'Les débris passent : il faut une grille.' : Q.sand > 0.05 ? 'Il reste du sable dans l’eau.' : Q.clay > 0.1 ? 'L’eau est encore trouble.' : Q.tooMuch ? 'Trop de chlore : goût et odeur désagréables.' : Q.mic > 0.05 ? 'L’eau est limpide… mais pleine de microbes !' : 'Limpide et sans microbes dangereux.';
      bNote.textContent = 'Eau à la sortie (en % de l’eau brute de la rivière).'; bNote2.textContent = why;
      Q.why = why; return Q;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’eau brute' }, { t: 10, title: 'Le dégrillage' }, { t: 20, title: 'La décantation' }, { t: 32, title: 'La filtration' }, { t: 43, title: 'La désinfection' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { gr: false, de: false, fi: false, ch: false, tDec: 0, dose: 0 }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’eau de rivière <b>n’est pas potable</b>', 'elle contient des débris, des particules et des microbes.', '#C8A46A'],
      ['<b>Dégrillage</b>, <b>décantation</b>, <b>filtration</b>', 'retirent les débris, le sable et la boue : l’eau devient limpide.', 'var(--blue)'],
      ['La <b>désinfection</b> (chlore) détruit les microbes', 'une eau limpide n’est pas forcément potable !', '#3DD68C']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t * 1.6; st.gr = t > 12; st.de = t > 22; st.tDec = 3 * K.k(t, 23, 6); st.fi = t > 34; st.ch = t > 46; st.dose = 1.2 * K.k(t, 47, 4); st.verdict = t > 2;
        lab.step();
        tg.show(t, 3, 9.6, 380, 92, 'Débris, sable, boue et microbes') || tg.show(t, 13, 19.6, 380, 92, 'La grille arrête les gros débris') || tg.show(t, 24, 31.6, 380, 92, 'Au repos, les particules tombent au fond') ||
          tg.show(t, 35, 42.6, 380, 92, 'Le sable retient les fines particules') || tg.show(t, 47, 52, 380, 92, 'Limpide… mais pas encore potable !') || tg.show(t, 52.4, 56.6, 380, 92, 'Le chlore détruit les microbes : eau potable');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : l’eau d’une rivière, chargée de débris, de sable, de boue et de microbes, traverse une station de traitement (grille, décanteur, filtre à sable, chloration) jusqu’au château d’eau ; des jauges montrent la qualité de l’eau à chaque étape',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'L’eau d’une rivière semble parfois claire, mais elle n’est pas potable.', sub: 'L’eau de rivière <b>n’est pas potable</b>.' },
      { t: 4.6, d: 5.2, say: 'Elle contient des débris, du sable, de la boue et des microbes invisibles.', sub: 'Débris, sable, boue… et <b>microbes</b>.' },
      { t: 10, d: 3, say: 'Première étape : le dégrillage.', sub: 'Étape 1 : le <b>dégrillage</b>.' },
      { t: 13.2, d: 6.4, say: 'Une grille arrête les gros débris : feuilles, branches, plastiques.', sub: 'Une <b>grille</b> arrête les gros débris.' },
      { t: 20, d: 3, say: 'Deuxième étape : la décantation.', sub: 'Étape 2 : la <b>décantation</b>.' },
      { t: 23.2, d: 8.4, say: 'On laisse l’eau au repos dans un grand bassin : les particules lourdes tombent au fond et forment des boues.', sub: 'Au repos, les particules <b>tombent au fond</b>.' },
      { t: 32, d: 2.8, say: 'Troisième étape : la filtration.', sub: 'Étape 3 : la <b>filtration</b>.' },
      { t: 35, d: 7.6, say: 'L’eau traverse du sable et du gravier, qui retiennent les plus fines particules. L’eau devient limpide.', sub: 'Sable et gravier retiennent les fines particules : eau <b>limpide</b>.' },
      { t: 43, d: 3.6, say: 'Mais attention : une eau limpide peut encore contenir des microbes.', sub: 'Limpide ne veut pas dire <b>potable</b> !' },
      { t: 46.8, d: 9.6, say: 'Dernière étape : la désinfection. Un peu de chlore détruit les microbes. L’eau est potable, elle part vers le château d’eau.', sub: 'Étape 4 : la <b>désinfection</b> au chlore : l’eau est <b>potable</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : l’eau naturelle n’est pas toujours potable.', sub: 'L’eau naturelle n’est pas toujours potable.' },
      { t: 61.6, d: 4.2, say: 'Dégrillage, décantation et filtration la rendent limpide.', sub: 'Dégrillage, décantation, filtration : eau <b>limpide</b>.' },
      { t: 66, d: 5, say: 'La désinfection détruit les microbes : l’eau devient potable.', sub: 'La <b>désinfection</b> la rend <b>potable</b>.' }
    ],
    learn: [
      { t: 19, ch: 1, html: '<b>Dégrillage</b> : une grille arrête les gros débris.' },
      { t: 31, ch: 2, html: '<b>Décantation</b> : au repos, les particules tombent au fond.' },
      { t: 42, ch: 3, html: '<b>Filtration</b> : le sable retient les fines particules.' },
      { t: 56, ch: 4, html: '<b>Désinfection</b> (chlore) : elle détruit les microbes.' }
    ],
    question: { q: 'Une eau limpide est-elle toujours potable ?', o: ['Oui, toujours', 'Non : elle peut contenir des microbes', 'Oui, si elle est froide', 'Oui, si elle vient d’une rivière'], a: 1, e: 'Seule la désinfection élimine les microbes dangereux.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Station de traitement de l’eau : rivière, grille, décanteur, filtre à sable, chloration et château d’eau, avec des jauges de qualité et un verdict potable ou non',
    steps: [
      'Désactive toutes les étapes : que contient l’eau qui arrive au robinet ?',
      'Active les étapes une à une et observe les jauges : quel rôle joue chacune ?',
      'Règle la durée de décantation et la dose de chlore pour obtenir une eau potable.',
      'Relève plusieurs doses de chlore dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var tg = ST.map(function (S0) { return c.toggle({ label: S0.n, value: true, onChange: function (v) { st[S0.k] = v; } }); });
      var sD = c.slider({ label: 'Durée de décantation', min: 0, max: 4, step: 0.5, value: 2, unit: 'h', dec: 1, onInput: function (v) { st.tDec = v; } });
      var sC = c.slider({ label: 'Dose de chlore', min: 0, max: 2, step: 0.1, value: 1.2, unit: 'mg/L', dec: 1, onInput: function (v) { st.dose = v; } });
      var ro = api.readouts([{ k: 't', label: 'Turbidité' }, { k: 'm', label: 'Microbes restants' }, { k: 'v', label: 'Verdict' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.t.set(Math.round(last.clay * 100) + ' %'); ro.m.set(Math.round(last.mic * 100) + ' %'); ro.v.set(last.pot ? 'potable' : 'non potable'); });
      var M = api.measure; M.innerHTML = '<h3>Mes analyses</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Analyser l’eau'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ cfg: ST.filter(function (x) { return st[x.k]; }).map(function (x) { return x.n.slice(0, 4) + '.'; }).join(' ') || 'aucune', d: st.ch ? st.dose : 0, m: last.mic, v: last.pot }); api.sound(last.pot ? 'ok' : 'tick'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Étapes</th><th>Chlore</th><th>Microbes</th><th>Verdict</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.cfg + '</td><td>' + fmt(r.d, 1) + '</td><td>' + Math.round(r.m * 100) + ' %</td><td>' + (r.v ? 'potable' : 'non') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune analyse.</div>';
        api.chart.innerHTML = '<h3>Microbes restants selon la dose de chlore</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'chlore (mg/L)', ylabel: 'microbes (%)', xmin: 0, xmax: 2, xstep: 0.5, ymin: 0, ymax: 100, ystep: 25, series: [{ color: '#3DD68C', pts: rows.map(function (r) { return [r.d, r.m * 100]; }) }] });
      }
      paint();
      api.onReset(function () { ST.forEach(function (x, k) { st[x.k] = true; tg[k].set(true); }); st.tDec = 2; st.dose = 1.2; sD.set(2); sC.set(1.2); rows = []; paint(); });
      api.say('Désactive les étapes une à une pour voir leur rôle.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Fais au moins 3 analyses avec des réglages différents.</p>';
        return '<p>Le <b>dégrillage</b> arrête les gros débris, la <b>décantation</b> fait tomber les particules lourdes (plus elle dure, plus l’eau s’éclaircit), la <b>filtration</b> sur sable retient les fines particules : l’eau devient <b>limpide</b>.</p><p>Une eau limpide peut encore contenir des microbes : la <b>désinfection</b> au chlore les détruit. Il faut une dose suffisante… mais pas trop forte (goût, odeur).</p><p>L’eau potable est ensuite stockée dans le château d’eau et distribuée.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Station de traitement de l’eau' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de la station',
    intro: 'Tu diriges la station de traitement : la ville attend une eau potable !',
    missions: [
      { title: 'Eau potable !', text: 'Toutes les étapes sont arrêtées. Remets la station en marche pour obtenir une <span style="color:#3DD68C">eau potable</span>.', lumi: 'Chaque étape retire quelque chose de différent…', hint: 'Active les 4 étapes.',
        build: function (api) { var lab = mini(api, { gr: false, de: false, fi: false, ch: false }); var r = api.c.row(); ST.forEach(function (S0) { var b = api.c.button({ label: S0.n, sm: true, into: r, onClick: function () { lab.st[S0.k] = !lab.st[S0.k]; b.classList.toggle('primary', lab.st[S0.k]); } }); }); return function () { var q = lab.res(); return q.pot ? { ok: true, msg: 'Bravo, la ville a de l’eau potable !' } : { ok: false, msg: q.why }; }; },
        e: 'Il faut enchaîner dégrillage, décantation, filtration et désinfection.' },
      { type: 'qcm', title: 'La décantation', text: 'À quoi sert la décantation ?', o: ['À tuer les microbes', 'À faire tomber au fond les particules lourdes', 'À chauffer l’eau', 'À ajouter des minéraux'], a: 1, hint: 'Pense à l’eau boueuse qu’on laisse reposer.', e: 'Au repos, les particules plus lourdes que l’eau tombent au fond.' },
      { title: 'La juste dose', text: 'Il y a trop de chlore ! Règle la dose pour que l’eau soit <span style="color:#3DD68C">potable</span> sans mauvais goût.', lumi: 'Ni trop, ni trop peu…', hint: 'Entre 0,9 et 1,5 mg/L.',
        build: function (api) { var lab = mini(api, { dose: 2 }); api.c.slider({ label: 'Dose de chlore', min: 0, max: 2, step: 0.1, value: 2, unit: 'mg/L', dec: 1, onInput: function (v) { lab.st.dose = v; } }); return function () { var q = lab.res(); return q.pot ? { ok: true, msg: 'Dose parfaite : microbes détruits, pas de goût.' } : { ok: false, msg: q.why }; }; },
        e: 'Une dose suffisante détruit les microbes ; trop de chlore donne un mauvais goût.' },
      { type: 'qcm', title: 'Limpide = potable ?', text: 'L’eau sort limpide du filtre. Peut-on la boire ?', o: ['Oui, elle est claire', 'Non, il faut encore la désinfecter', 'Oui, si on la refroidit', 'Non, il faut la décanter encore'], a: 1, hint: 'Les microbes sont invisibles…', e: 'Une eau limpide peut contenir des microbes : il faut la désinfecter.' },
      { type: 'qcm', title: 'Dans l’ordre', text: 'Quel est l’ordre des étapes du traitement ?', o: ['filtration, dégrillage, désinfection, décantation', 'dégrillage, décantation, filtration, désinfection', 'désinfection, filtration, décantation, dégrillage', 'décantation, désinfection, dégrillage, filtration'], a: 1, hint: 'Des plus gros déchets aux plus petits.', e: 'On retire d’abord les gros débris, puis les particules, puis les microbes.' }
    ]
  };

  S.start({
    id: '4e-traitement-eau', level: '4e', theme: 'Eau potable', title: 'Traitement de l’eau', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’eau naturelle (rivière, lagune, puits) n’est pas toujours <b>potable</b> : elle peut contenir des débris, des particules en suspension et des <b>microbes</b>.',
      '<b>Dégrillage</b> : une grille arrête les gros débris.',
      '<b>Décantation</b> : au repos, les particules lourdes tombent au fond. <b>Filtration</b> : le sable et le gravier retiennent les fines particules. L’eau devient <b>limpide</b>.',
      '<b>Désinfection</b> : le chlore (ou l’eau de Javel, l’ozone) détruit les microbes. Une eau limpide n’est pas forcément potable.',
      'L’eau potable est stockée dans un <b>château d’eau</b> puis distribuée. À la maison, on peut aussi la faire bouillir ou utiliser quelques gouttes d’eau de Javel.'
    ],
    quiz: [
      { q: 'La grille du dégrillage arrête :', o: ['les microbes', 'les gros débris', 'le sel', 'le chlore'], a: 1, e: 'Feuilles, branches, plastiques…' },
      { q: 'Le filtre à sable retient :', o: ['les fines particules', 'les microbes uniquement', 'l’eau', 'le chlore'], a: 0, e: 'L’eau devient limpide.' },
      { q: 'Le chlore sert à :', o: ['colorer l’eau', 'détruire les microbes', 'faire tomber la boue', 'sucrer l’eau'], a: 1, e: 'C’est la désinfection.' },
      { q: 'Une eau potable :', o: ['peut être bue sans danger', 'est toujours de l’eau de pluie', 'contient des microbes', 'est forcément gazeuse'], a: 0, e: 'Elle ne présente pas de danger pour la santé.' },
      { q: 'La décantation est plus efficace si :', o: ['l’eau est agitée', 'on laisse reposer plus longtemps', 'on ajoute du sable', 'on chauffe l’eau'], a: 1, e: 'Les particules ont le temps de tomber.' }
    ]
  });
})();
