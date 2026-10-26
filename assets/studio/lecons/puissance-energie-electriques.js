/* 3e · Électricité · Leçon : Puissance et énergie électriques */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var R_L = 12, UN = 6, PRIX = 80, IMAX = 10; /* lampe 6 V – 3 W ; prix d’exemple du kWh : 80 F CFA ; disjoncteur 10 A */
  var APP = [['lampe', 'lampe', 60], ['ventilo', 'ventilateur', 75], ['tele', 'télévision', 100], ['frigo', 'réfrigérateur', 150], ['fer', 'fer à repasser', 1000], ['clim', 'climatiseur', 1500]];
  function glow(G, col) { var id = 'pe' + Math.floor(Math.random() * 1e9), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function W(x) { return x >= 1000 ? fmt(x / 1000, 2) + ' kW' : fmt(x, x < 10 ? 2 : 0) + ' W'; }
  function icon(G, k) {
    var g = s('g', {}, G);
    if (k === 'lampe') { s('circle', { cy: -6, r: 14, fill: '#FFE08A' }, g); s('rect', { x: -6, y: 6, width: 12, height: 10, fill: '#9AA6BC' }, g); }
    else if (k === 'ventilo') { [0, 120, 240].forEach(function (a) { s('path', { d: 'M0 -4 q8 -16 0 -22 q-8 6 0 22z', fill: '#9FD7FF', transform: 'translate(0 -4) rotate(' + a + ')' }, g); }); s('rect', { x: -2, y: 4, width: 4, height: 12, fill: '#9AA6BC' }, g); }
    else if (k === 'tele') { s('rect', { x: -20, y: -18, width: 40, height: 28, rx: 3, fill: '#1A1F28', stroke: '#9AA6BC', 'stroke-width': 2 }, g); s('rect', { x: -8, y: 10, width: 16, height: 4, fill: '#9AA6BC' }, g); }
    else if (k === 'frigo') { s('rect', { x: -12, y: -22, width: 24, height: 40, rx: 3, fill: '#EEF2F8' }, g); s('line', { x1: -12, x2: 12, y1: -6, y2: -6, stroke: '#9AA6BC', 'stroke-width': 2 }, g); }
    else if (k === 'fer') { s('path', { d: 'M-20 10 h36 q4 -16 -14 -22 h-10 q-12 6 -12 22z', fill: '#4FA8FF' }, g); s('path', { d: 'M-8 -12 q8 -8 16 0', stroke: '#9AA6BC', 'stroke-width': 3, fill: 'none' }, g); }
    else { s('rect', { x: -24, y: -14, width: 48, height: 22, rx: 5, fill: '#EEF2F8' }, g); for (var i = 0; i < 4; i++) s('line', { x1: -18 + i * 6, x2: -18 + i * 6, y1: 0, y2: 6, stroke: '#9AA6BC', 'stroke-width': 1.5 }, g); }
    return g;
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'lampe', U: 6, on: { lampe: true, ventilo: true }, h: 8, trip: false, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- LAMPE ---------- */
    var A = s('g', {}, G);
    s('path', { d: 'M110 300 V170 H290 M350 170 H470 V300 H330 M250 300 H110', fill: 'none', stroke: '#C9D2E3', 'stroke-width': 3 }, A);
    s('rect', { x: 84, y: 200, width: 52, height: 70, rx: 8, fill: '#2F3646', stroke: '#9AA6BC', 'stroke-width': 2 }, A); var genT = s('text', { x: 110, y: 242, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, A); s('text', { x: 110, y: 290, 'text-anchor': 'middle', 'font-size': 10.5, fill: '#A9B4C7', text: 'générateur' }, A);
    var halo = s('circle', { cx: 320, cy: 170, fill: glow(G, '#FFE08A') }, A); s('circle', { cx: 320, cy: 170, r: 24, fill: '#1A2032', stroke: '#C9D2E3', 'stroke-width': 3 }, A); var bulb = s('circle', { cx: 320, cy: 170, r: 20 }, A); s('path', { d: 'M303 153 L337 187 M337 153 L303 187', stroke: '#C9D2E3', 'stroke-width': 2 }, A); s('text', { x: 320, y: 216, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#A9B4C7', text: 'lampe 6 V – 3 W' }, A);
    s('circle', { cx: 290, cy: 300, r: 22, fill: '#141C30', stroke: '#FF8A80', 'stroke-width': 3 }, A); s('text', { x: 290, y: 306, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: '#FF8A80', text: 'A' }, A); var aT = s('text', { x: 290, y: 346, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FF8A80' }, A);
    s('path', { d: 'M290 170 V120 H350 V170', fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2 }, A); s('circle', { cx: 320, cy: 120, r: 18, fill: '#141C30', stroke: '#9FD7FF', 'stroke-width': 3 }, A); s('text', { x: 320, y: 126, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#9FD7FF', text: 'V' }, A); var vT = s('text', { x: 362, y: 126, 'font-size': 15, 'font-weight': 900, fill: '#9FD7FF' }, A);
    var pBox = s('g', {}, A); s('rect', { x: 150, y: 360, width: 280, height: 52, rx: 12, fill: '#141C30', stroke: '#FFC773', 'stroke-width': 2 }, pBox); var pT = s('text', { x: 290, y: 393, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#FFC773' }, pBox);
    var aMsg = s('text', { x: 290, y: 434, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- MAISON ---------- */
    var B = s('g', {}, G), tiles = {};
    APP.forEach(function (a, i) { var x = 76 + (i % 3) * 106, y = 70 + Math.floor(i / 3) * 128, g = s('g', { style: 'cursor:pointer' }, B), r = s('rect', { x: x, y: y, width: 96, height: 116, rx: 14, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, g), ic = icon(g, a[0]); ic.setAttribute('transform', 'translate(' + (x + 48) + ' ' + (y + 42) + ')'); s('text', { x: x + 48, y: y + 84, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: a[1] }, g); s('text', { x: x + 48, y: y + 103, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: a[2] + ' W' }, g); g.addEventListener('click', function () { st.on[a[0]] = !st.on[a[0]]; st.trip = false; o && o.onTile && o.onTile(); }); tiles[a[0]] = { r: r, g: g }; });
    var met = s('g', {}, B); s('rect', { x: 412, y: 330, width: 118, height: 98, rx: 10, fill: '#EEF2F8' }, met); s('text', { x: 471, y: 348, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A3426', text: 'COMPTEUR (kWh)' }, met); var metT = s('text', { x: 471, y: 376, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#1A1F28', 'font-family': 'monospace' }, met); var disk = s('g', {}, met); s('ellipse', { cx: 471, cy: 404, rx: 34, ry: 7, fill: '#9AA6BC' }, disk); var mark = s('rect', { y: 398, width: 6, height: 12, fill: '#E5484D' }, met);
    var dj = s('g', {}, B); s('rect', { x: 76, y: 336, width: 66, height: 90, rx: 8, fill: '#2F3646', stroke: '#9AA6BC', 'stroke-width': 2 }, dj); var lever = s('rect', { x: 100, width: 18, height: 30, rx: 4 }, dj); s('text', { x: 109, y: 420, 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 800, fill: '#C9D2E3', text: 'disjoncteur' }, dj);
    var bT1 = s('text', { x: 278, y: 362, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#EEF2F8' }, B), bT2 = s('text', { x: 278, y: 388, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#9FD7FF' }, B), bT3 = s('text', { x: 278, y: 414, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#FFC773' }, B);
    var bMsg = s('text', { x: 290, y: 440, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#FF8A80' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'PUISSANCE ET ÉNERGIE' }, P);
    s('text', { x: PX + 140, y: 84, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#FFC773', text: 'P = U × I' }, P); s('text', { x: PX + 140, y: 106, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3', text: 'P en watts (W), U en volts, I en ampères' }, P);
    s('text', { x: PX + 140, y: 146, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#5CFF9D', text: 'E = P × t' }, P); s('text', { x: PX + 140, y: 168, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3', text: 'J (P en W, t en s) ou Wh (t en h)' }, P); s('text', { x: PX + 140, y: 188, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3', text: '1 kWh = 1 000 Wh = 3 600 000 J' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 206, y2: 206, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return s('text', { x: PX + 140, y: 232 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', a[k] && a[k].charAt(0) === '•' ? 800 : 400); }); }
    var last = performance.now(), ang = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'lampe' ? '' : 'none'; B.style.display = st.mode === 'maison' ? '' : 'none';
      if (st.mode === 'lampe') {
        var U = st.U, I = U / R_L, Pw = U * I, k = Pw / 3, over = U > 7.5;
        genT.textContent = fmt(U, 1) + ' V'; aT.textContent = 'I = ' + fmt(I, 2) + ' A'; vT.textContent = 'U = ' + fmt(U, 1) + ' V';
        bulb.setAttribute('fill', over ? '#FFFFFF' : 'rgb(' + Math.round(40 + 215 * Math.min(1, k)) + ',' + Math.round(40 + 190 * Math.min(1, k)) + ',' + Math.round(50 + 90 * Math.min(1, k)) + ')'); attr(halo, { cy: 170, r: 30 + 60 * Math.min(1.4, k), opacity: Math.min(1, k) });
        pT.textContent = 'P = ' + fmt(U, 1) + ' × ' + fmt(I, 2) + ' = ' + W(Pw);
        aMsg.textContent = Math.abs(U - UN) < 0.05 ? 'Sous sa tension nominale (6 V), la lampe reçoit sa puissance nominale : 3 W' : U < UN ? 'Sous-tension : la lampe brille faiblement, P < 3 W' : over ? 'Surtension : la lampe risque de griller !' : 'Surtension : P > 3 W, la lampe s’use vite';
        pset(['• Puissance nominale', 'Sur un appareil : « 220 V – 60 W »', '220 V : tension nominale', '60 W : puissance nominale,', 'reçue sous la tension nominale.', 'Sous une tension plus faible,', 'l’appareil reçoit moins de puissance.', '', '']);
        res = { U: U, I: I, P: Pw };
      } else {
        var Pt = 0; APP.forEach(function (a) { var on = !!st.on[a[0]]; tiles[a[0]].r.setAttribute('stroke', on ? '#FFC773' : '#2B3A57'); tiles[a[0]].r.setAttribute('fill', on ? '#22283A' : '#141C30'); tiles[a[0]].g.setAttribute('opacity', on ? 1 : 0.55); if (on) Pt += a[2]; });
        var Itot = Pt / 220, trip = Itot > IMAX; if (trip) st.trip = true; var Pon = st.trip ? 0 : Pt;
        var E = Pon * st.h / 1000, Em = E * 30, cost = Em * PRIX;
        if (st.t == null) ang += dt * Pon / 120; else ang = T * Pon / 120; attr(mark, { x: 471 + 30 * Math.sin(ang) - 3 }); metT.textContent = fmt(Em, 1);
        attr(lever, { y: st.trip ? 384 : 350, fill: st.trip ? '#E5484D' : '#3DD68C' });
        bT1.textContent = 'P totale = ' + W(Pt) + '  (I = ' + fmt(Itot, 1) + ' A)'; bT2.textContent = 'E par jour = ' + W(Pon) + ' × ' + st.h + ' h = ' + fmt(E, 2) + ' kWh'; bT3.textContent = 'Par mois : ' + fmt(Em, 1) + ' kWh × ' + PRIX + ' F = ' + fmt(Math.round(cost), 0) + ' F CFA';
        bMsg.textContent = st.trip ? 'Trop de puissance : I > 10 A, le disjoncteur a coupé le courant !' : '';
        pset(['• À la maison', 'La puissance totale est la somme', 'des puissances des appareils.', 'Le compteur mesure l’énergie', 'consommée, en kilowattheures.', '• Exemple : 75 W pendant 8 h', '= 600 Wh = 0,6 kWh', 'Prix du kWh : ' + PRIX + ' F CFA (exemple)', 'Disjoncteur de 10 A : P max ≈ 2 200 W']);
        res = { Pt: Pt, I: Itot, trip: st.trip, E: E, Em: Em, cost: cost };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: '« 220 V – 60 W » ?' }, { t: 8, title: 'La puissance' }, { t: 20, title: 'P = U × I' }, { t: 30, title: 'L’énergie' }, { t: 44, title: 'La facture' }, { t: 51, title: 'Le disjoncteur' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Puissance électrique : <b>P = U × I</b>', 'en watts (W) ; la puissance nominale est indiquée sur l’appareil.', '#FFC773'],
      ['Énergie électrique : <b>E = P × t</b>', 'en joules ou en kilowattheures (kWh), mesurée par le compteur.', '#5CFF9D'],
      ['Trop d’appareils à la fois : <b>surintensité</b>', 'le disjoncteur coupe le courant.', '#FF8A80']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.h = 8;
        if (t < 8) { st.mode = 'lampe'; st.U = 6; }
        else if (t < 20) { st.mode = 'lampe'; st.U = t < 14 ? 6 : 3; }
        else if (t < 30) { st.mode = 'maison'; st.trip = false; st.on = { lampe: true, tele: true, fer: t > 25 }; }
        else if (t < 44) { st.mode = 'maison'; st.trip = false; st.on = { ventilo: true }; }
        else if (t < 51) { st.mode = 'maison'; st.trip = false; st.on = { ventilo: true, lampe: true, tele: true, frigo: true }; }
        else { st.mode = 'maison'; st.trip = false; st.on = { lampe: true, tele: true, frigo: true, fer: true, clim: t > 52.5 }; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Que signifie « 6 V – 3 W » ?') || tg.show(t, 9, 19.6, 290, 92, st.U === 6 ? '6 V × 0,5 A = 3 W' : '3 V : seulement 0,75 W') || tg.show(t, 21, 29.6, 290, 92, st.on.fer ? 'Le fer à repasser : 1 000 W !' : 'Lampe 60 W + télé 100 W') ||
          tg.show(t, 31, 43.6, 290, 92, '75 W × 8 h = 0,6 kWh par jour') || tg.show(t, 45, 50.6, 290, 92, 'Le compteur compte les kWh') || tg.show(t, 52.6, 56.6, 290, 92, 'Plus de 10 A : le disjoncteur saute');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une lampe 6 V – 3 W branchée avec un ampèremètre et un voltmètre, qui brille normalement sous 6 V et faiblement sous 3 V ; puis une maison avec six appareils (lampe, ventilateur, télévision, réfrigérateur, fer à repasser, climatiseur), un compteur qui tourne plus ou moins vite et calcule l’énergie consommée en kWh et son prix en francs CFA, et un disjoncteur qui coupe le courant quand trop d’appareils fonctionnent',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Sur une lampe, on lit « 6 V – 3 W ». Sur un fer à repasser, « 220 V – 1 000 W ». Que signifient ces indications ?', sub: 'Que signifie « <b>6 V – 3 W</b> » ?' },
      { t: 8, d: 11.6, say: 'Branchons la lampe sous six volts : l’ampèremètre indique zéro virgule cinq ampère. Le produit U fois I vaut trois watts : c’est sa puissance nominale. Sous trois volts, elle brille faiblement : sa puissance n’est que de zéro virgule soixante-quinze watt.', sub: 'P = 6 × 0,5 = <b>3 W</b> sous la tension nominale.' },
      { t: 20, d: 9.6, say: 'La puissance électrique reçue par un appareil est P égale U fois I, en watts. Une lampe consomme soixante watts, un fer à repasser mille watts.', sub: '<b>P = U × I</b>, en watts.' },
      { t: 30, d: 13.6, say: 'L’énergie consommée dépend aussi de la durée : E égale P fois t. Un ventilateur de soixante-quinze watts allumé huit heures consomme six cents wattheures, soit zéro virgule six kilowattheure.', sub: '<b>E = P × t</b> : 75 W × 8 h = 0,6 kWh.' },
      { t: 44, d: 6.6, say: 'Le compteur de la maison mesure l’énergie consommée en kilowattheures. La facture se calcule à partir de ce nombre.', sub: 'Le <b>compteur</b> mesure les kWh.' },
      { t: 51, d: 5.6, say: 'Si l’on branche trop d’appareils à la fois, l’intensité devient trop grande : le disjoncteur coupe le courant.', sub: 'Surintensité : le <b>disjoncteur</b> coupe.' },
      { t: 57, d: 4.6, say: 'À retenir : la puissance électrique est P égale U fois I, en watts.', sub: 'P = U × I.' },
      { t: 61.8, d: 4.2, say: 'L’énergie est E égale P fois t, en joules ou en kilowattheures.', sub: 'E = P × t.' },
      { t: 66.2, d: 4.8, say: 'Trop de puissance à la fois fait sauter le disjoncteur.', sub: 'Attention aux surintensités.' }
    ],
    learn: [
      { t: 19, ch: 1, html: 'Sous sa tension nominale, l’appareil reçoit sa <b>puissance nominale</b>.' },
      { t: 29, ch: 2, html: '<b>P = U × I</b> (W = V × A).' },
      { t: 43, ch: 3, html: '<b>E = P × t</b> ; 1 kWh = 3 600 000 J.' },
      { t: 56, ch: 5, html: 'Trop d’appareils : surintensité, le <b>disjoncteur</b> coupe.' }
    ],
    question: { q: 'Un fer à repasser de 1 000 W fonctionne 2 h. Il consomme :', o: ['500 Wh', '2 kWh', '1 kWh', '2 000 kWh'], a: 1, e: 'E = 1 000 × 2 = 2 000 Wh = 2 kWh.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Circuit', r: [40, 40, 500, 406] }, { n: 'Puissance', r: [560, 22, 280, 424] }],
    alt: 'Deux activités : une lampe 6 V – 3 W alimentée par un générateur réglable, avec un ampèremètre et un voltmètre, dont on calcule la puissance P = U × I ; puis une maison avec six appareils que l’on allume ou éteint en cliquant, une durée d’utilisation, le calcul de la puissance totale, de l’énergie par jour et du prix mensuel, un compteur et un disjoncteur de 10 A',
    steps: [
      'Hypothèse : les appareils sont assimilés à des récepteurs résistifs. Pour un moteur ou un appareil électronique réel, le calcul en alternatif peut demander un facteur de puissance.',
      'Lampe : règle la tension et calcule P = U × I.',
      'Sous quelle tension la lampe reçoit-elle 3 W ?',
      'Maison : allume des appareils (clique dessus) et lis la puissance totale.',
      'Change la durée : calcule l’énergie et le prix.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onTile: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'lampe', options: [{ v: 'lampe', l: 'La lampe 6 V – 3 W' }, { v: 'maison', l: 'À la maison' }], onChange: function (v) { st.mode = v; vis(); } });
      var sU = c.slider({ label: 'Tension du générateur', min: 0, max: 9, step: 0.5, value: 6, unit: 'V', dec: 1, onInput: function (v) { st.U = v; } });
      var sH = c.slider({ label: 'Durée d’utilisation par jour', min: 1, max: 24, step: 1, value: 8, unit: 'h', dec: 0, onInput: function (v) { st.h = v; } });
      var bJ = c.button({ label: 'Réarmer le disjoncteur', sm: true, onClick: function () { st.trip = false; } });
      function vis() { var l = st.mode === 'lampe'; sU.hide(!l); sH.hide(l); bJ.style.display = l ? 'none' : ''; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Puissance' }, { k: 'b', label: 'Énergie' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'lampe') { ro.a.set(W(last.P)); ro.b.set(fmt(last.P * 3600, 0) + ' J par heure'); } else { ro.a.set(W(last.Pt)); ro.b.set(fmt(last.E, 2) + ' kWh / jour'); } });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { rows.push(st.mode === 'lampe' ? { e: 'lampe sous ' + fmt(st.U, 1) + ' V', m: 'I = ' + fmt(last.I, 2) + ' A', r: 'P = ' + W(last.P) } : { e: APP.filter(function (a) { return st.on[a[0]]; }).map(function (a) { return a[1]; }).join(', ') || 'rien', m: W(last.Pt) + (last.trip ? ' (disjoncté)' : ''), r: fmt(last.Em, 1) + ' kWh/mois → ' + fmt(Math.round(last.cost), 0) + ' F' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Situation</th><th>Mesure</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.m + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Puissances nominales usuelles</h3><table class="mt"><thead><tr><th>Appareil</th><th>Puissance</th><th>Énergie en 1 h</th></tr></thead><tbody>' + APP.map(function (a) { return '<tr><td>' + a[1] + '</td><td>' + a[2] + ' W</td><td>' + fmt(a[2] / 1000, 3) + ' kWh</td></tr>'; }).join('') + '</tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'lampe', U: 6, on: { lampe: true, ventilo: true }, h: 8, trip: false }); cM.set('lampe'); sU.set(6); sH.set(8); vis(); rows = []; paint(); });
      api.say('Règle la tension et observe la lampe.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures.</p>';
        return '<p>La <b>puissance électrique</b> reçue par un appareil est <b>P = U × I</b> (P en watts, U en volts, I en ampères), relation exacte pour les appareils chauffants (résistances) ; pour les autres appareils (moteurs, chargeurs…), on se fie à la puissance indiquée. Les indications d’un appareil (« 220 V – 60 W ») donnent sa <b>tension nominale</b> et sa <b>puissance nominale</b>, reçue lorsqu’il fonctionne sous sa tension nominale.</p><p>L’<b>énergie électrique</b> consommée pendant une durée t est <b>E = P × t</b> : en joules (P en W, t en s) ou en wattheures (t en h). <b>1 kWh = 3 600 000 J</b>. Le compteur électrique mesure l’énergie consommée, qui détermine la facture.</p><p>La puissance totale d’une installation est la somme des puissances des appareils en fonctionnement ; si l’intensité devient trop grande, le <b>disjoncteur</b> coupe le courant.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Puissance et énergie électriques' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de la facture',
    intro: 'Allume juste ce qu’il faut, sans faire sauter le disjoncteur !',
    missions: [
      { title: 'Puissance nominale', text: 'Fais recevoir à la lampe exactement sa <b>puissance nominale</b>.', lumi: '« 6 V – 3 W »…', hint: 'U = 6 V.',
        build: function (api) { var lab = mini(api, { U: 2 }); api.c.slider({ label: 'Tension', min: 0, max: 9, step: 0.5, value: 2, unit: 'V', dec: 1, onInput: function (v) { lab.st.U = v; } }); return function () { var r = lab.res(); return Math.abs(r.P - 3) < 0.01 ? { ok: true, msg: '6 V × 0,5 A = 3 W.' } : { ok: false, msg: 'P = ' + W(r.P) + '.' }; }; },
        e: 'Sous 6 V, la lampe reçoit 3 W.' },
      { title: '1 175 W', text: 'Allume des appareils pour une puissance totale de <span style="color:#FFC773">1 175 W</span> (clique sur les appareils).', lumi: 'Additionne les puissances.', hint: 'Fer + télé + ventilateur.',
        build: function (api) { var lab = mini(api, { mode: 'maison', on: {} }); api.c.button({ label: 'Réarmer le disjoncteur', sm: true, onClick: function () { lab.st.trip = false; } }); return function () { var r = lab.res(); return r.Pt === 1175 && !r.trip ? { ok: true, msg: '1 000 + 100 + 75 = 1 175 W.' } : { ok: false, msg: 'P totale : ' + W(r.Pt) + '.' }; }; },
        e: 'Les puissances s’additionnent.' },
      { title: 'Le disjoncteur', text: 'Fais <b>sauter le disjoncteur</b> (plus de 10 A).', lumi: 'I = P / 220.', hint: 'Fer + climatiseur.',
        build: function (api) { var lab = mini(api, { mode: 'maison', on: { lampe: true } }); return function () { var r = lab.res(); return r.trip ? { ok: true, msg: 'Plus de 2 200 W : I > 10 A, le disjoncteur coupe.' } : { ok: false, msg: 'I = ' + fmt(r.I, 1) + ' A.' }; }; },
        e: 'P > 2 200 W sous 220 V : I > 10 A.' },
      { type: 'qcm', title: 'Calcul', text: 'Une télévision de 100 W reste allumée 5 h par jour. Énergie par jour :', o: ['20 Wh', '500 Wh', '105 Wh', '5 kWh'], a: 1, hint: 'E = P × t.', e: '100 × 5 = 500 Wh = 0,5 kWh.' },
      { type: 'qcm', title: 'Conversion', text: '1 kWh correspond à :', o: ['1 000 J', '3 600 J', '3 600 000 J', '60 J'], a: 2, hint: '1 000 W pendant 3 600 s.', e: '1 000 × 3 600 = 3 600 000 J.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux appareils n’ont pas la même puissance ni la même durée d’utilisation. Comment comparer leurs consommations d’énergie ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-puissance-energie-electriques', level: '3e', theme: 'Électricité', title: 'Puissance et énergie électriques', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'En courant continu, ou pour un récepteur résistif en alternatif, la <b>puissance électrique</b> reçue vaut : <b>P = U × I</b> (P en watts W, U en volts V, I en ampères A).',
      'Les indications « 220 V – 60 W » donnent la <b>tension nominale</b> et la <b>puissance nominale</b> : l’appareil reçoit 60 W lorsqu’il est alimenté sous 220 V.',
      'L’<b>énergie électrique</b> consommée : <b>E = P × t</b> ; en joules (W × s) ou en wattheures (W × h). <b>1 kWh = 1 000 Wh = 3 600 000 J</b>.',
      'Le <b>compteur</b> mesure l’énergie consommée en kWh ; à tarif constant, le coût variable de l’énergie est proportionnel à cette énergie, hors abonnement et autres frais.',
      'La puissance totale d’une installation est la somme des puissances des appareils ; une puissance trop grande provoque une <b>surintensité</b> et le <b>disjoncteur</b> coupe le courant.'
    ],
    quiz: [
      { q: 'La puissance électrique s’exprime en :', o: ['volts', 'ampères', 'watts', 'kilowattheures'], a: 2, e: 'En watts (W).' },
      { q: 'Un appareil résistif alimenté sous 220 V est traversé par 5 A. Sa puissance :', o: ['44 W', '225 W', '1 100 W', '215 W'], a: 2, e: '220 × 5 = 1 100 W.' },
      { q: 'L’énergie électrique se calcule par :', o: ['E = U × I', 'E = P × t', 'E = P / t', 'E = U / I'], a: 1, e: 'E = P × t.' },
      { q: 'Le compteur électrique de la maison mesure :', o: ['la tension', 'l’intensité', 'l’énergie consommée', 'la puissance nominale'], a: 2, e: 'L’énergie, en kWh.' },
      { q: 'Une lampe 220 V – 100 W alimentée sous 110 V reçoit :', o: ['100 W', 'plus de 100 W', 'moins de 100 W', '0 W'], a: 2, e: 'Sous-tension : moins que la puissance nominale.' }
    ]
  });
})();

