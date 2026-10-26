/* 6e · Les combustions · Leçon : Combustion d’un gaz dans l’air (butane) */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, C = window.CombKit;
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function shape(w, h) { return 'M0 ' + (-h) + ' C' + w + ' ' + (-h * 0.45) + ' ' + w + ' 0 0 0 C' + (-w) + ' 0 ' + (-w) + ' ' + (-h * 0.45) + ' 0 ' + (-h) + 'Z'; }
  /* flamme de gaz : a = 0 (sans air, jaune) … 1 (air, bleue) */
  function gasFlame(G, gl, sc) {
    var g = s('g', {}, G), halo = s('ellipse', { fill: gl }, g), yO = s('path', { fill: '#FFB547' }, g), yI = s('path', { fill: '#FFE08A' }, g), bO = s('path', { fill: '#5BA8FF' }, g), bI = s('path', { fill: '#BFE0FF' }, g);
    return { set: function (x, y, a, T, on) {
      g.style.display = on ? '' : 'none'; if (!on) return;
      var f = 1 + 0.07 * Math.sin(T * 19) + 0.05 * Math.sin(T * 31), hy = 120 * sc * f * (1 - 0.15 * a), hb = 70 * sc * (1 + 0.04 * Math.sin(T * 25));
      g.setAttribute('transform', 'translate(' + x + ' ' + y + ') skewX(' + ((1 - a) * 4 * Math.sin(T * 5)) + ')');
      attr(halo, { cy: -hy * 0.5, rx: 40 * sc, ry: hy * 0.7, opacity: 0.6 * (1 - a) + 0.1 });
      yO.setAttribute('d', shape(16 * sc, hy)); yO.setAttribute('opacity', Math.max(0, 1 - a * 1.25));
      yI.setAttribute('d', shape(9 * sc, hy * 0.6)); yI.setAttribute('opacity', Math.max(0, 1 - a * 1.4));
      bO.setAttribute('d', shape(12 * sc, hb)); bO.setAttribute('opacity', 0.25 + 0.65 * a);
      bI.setAttribute('d', shape(6 * sc, hb * 0.45)); bI.setAttribute('opacity', a * 0.95); } };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'bunsen', air: 0, on: true, sau: 0, sauIn: false, dep: 0, dirty: false, soot: 0, t: null }, o || {});
    var GL = C.glow(G, '#FFB547', 0.7);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- BEC BUNSEN ---------- */
    var A = s('g', {}, G), BX = 210; s('rect', { x: 40, y: 410, width: 500, height: 36, fill: '#151D2E' }, A);
    s('rect', { x: BX - 50, y: 396, width: 100, height: 14, rx: 6, fill: '#5B6478' }, A); s('rect', { x: BX - 11, y: 250, width: 22, height: 146, fill: '#9AA6BC' }, A); s('rect', { x: BX - 13, y: 246, width: 26, height: 8, rx: 2, fill: '#C9D2E3' }, A);
    s('path', { d: 'M' + (BX + 50) + ' 402 h60 q20 0 20 20', stroke: '#E5484D', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, A); s('text', { x: BX + 128, y: 404, 'font-size': 11, 'font-weight': 800, fill: '#FF8A80', text: 'butane' }, A);
    var vir = s('rect', { x: BX - 15, y: 350, width: 30, height: 22, rx: 3, fill: '#7D89A3' }, A), hole = s('rect', { x: BX - 5, y: 354, height: 14, rx: 3, fill: '#0A0F1A' }, A);
    s('text', { x: BX + 22, y: 366, 'text-anchor': 'start', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'virole' }, A);
    var airA = [0, 1, 2].map(function (k) { return s('path', { d: 'M0 0 h-22 m6 -5 l-6 5 l6 5', stroke: '#9FD7FF', 'stroke-width': 2.5, fill: 'none' }, A); });
    var fA = gasFlame(A, GL, 1), soot = s('g', {}, A), SO = []; for (var i = 0; i < 18; i++) SO.push(s('circle', { r: 3 + rnd(i, 1) * 3, fill: '#1A1A1E' }, soot));
    var sauc = s('g', {}, A); s('line', { x1: 0, y1: 0, x2: 150, y2: -30, stroke: '#9AA6BC', 'stroke-width': 4 }, sauc); s('ellipse', { cx: 0, cy: 0, rx: 44, ry: 9, fill: '#F4F6FA', stroke: '#C9D2E3', 'stroke-width': 2 }, sauc);
    var depE = s('ellipse', { cx: 0, cy: 3, rx: 30, ry: 6, fill: '#141418' }, sauc); s('text', { x: 150, y: -40, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'soucoupe' }, sauc);
    var zoom = s('g', {}, A); s('circle', { cx: 440, cy: 190, r: 70, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, zoom); s('text', { x: 440, y: 106, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'à la virole' }, zoom);
    var ZM = []; for (i = 0; i < 16; i++) ZM.push(s('circle', { r: 5, fill: i < 6 ? '#E5484D' : '#4C6BFF' }, zoom));
    var zT = s('text', { x: 440, y: 286, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3' }, zoom);
    var aT = s('text', { x: 290, y: 434, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, A);
    /* ---------- CUISINE ---------- */
    var Bk = s('g', {}, G); s('rect', { x: 40, y: 330, width: 500, height: 116, fill: '#3A2F28' }, Bk);
    s('rect', { x: 70, y: 220, width: 90, height: 150, rx: 26, fill: '#2F7D4F' }, Bk); s('rect', { x: 98, y: 200, width: 34, height: 24, rx: 4, fill: '#9AA6BC' }, Bk); s('text', { x: 115, y: 300, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8', text: 'B12' }, Bk); s('text', { x: 115, y: 318, 'text-anchor': 'middle', 'font-size': 10, fill: '#CFE8D8', text: 'butane' }, Bk);
    s('path', { d: 'M115 200 q0 -30 60 -20 q60 10 90 60', stroke: '#E58A2E', 'stroke-width': 5, fill: 'none' }, Bk);
    s('rect', { x: 230, y: 260, width: 230, height: 70, rx: 8, fill: '#C9D2E3' }, Bk); s('rect', { x: 230, y: 252, width: 230, height: 12, rx: 4, fill: '#4A5160' }, Bk); s('circle', { cx: 430, cy: 296, r: 10, fill: '#4A5160' }, Bk);
    s('rect', { x: 314, y: 246, width: 52, height: 8, rx: 3, fill: '#2A2F3A' }, Bk);
    var fK = [0, 1, 2, 3, 4].map(function () { return gasFlame(Bk, GL, 0.3); });
    var pot = s('g', {}, Bk); s('path', { d: 'M282 150 h116 v58 q0 12 -12 12 h-92 q-12 0 -12 -12z', fill: '#B0B8C8' }, pot); s('rect', { x: 276, y: 144, width: 128, height: 10, rx: 4, fill: '#8B95A8' }, pot); s('path', { d: 'M260 160 h22 M398 160 h22', stroke: '#2A2F3A', 'stroke-width': 6, 'stroke-linecap': 'round' }, pot);
    var potS = s('path', { d: 'M282 196 h116 v12 q0 12 -12 12 h-92 q-12 0 -12 -12z', fill: '#141418' }, pot);
    var steam = [0, 1, 2].map(function () { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#DDE6F2', 'stroke-width': 3, fill: 'none' }, Bk); });
    var warnB = s('g', {}, Bk); s('rect', { x: 56, y: 118, width: 196, height: 52, rx: 12, fill: '#3A1518', stroke: '#FF5A4E', 'stroke-width': 2 }, warnB); s('text', { x: 154, y: 140, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#FF8A80', text: '⚠ monoxyde de carbone' }, warnB); s('text', { x: 154, y: 158, 'text-anchor': 'middle', 'font-size': 11, fill: '#FFC9C4', text: 'gaz toxique, invisible' }, warnB);
    var bT = s('text', { x: 290, y: 434, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#F4E6D6' }, Bk);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'COMBUSTION DU BUTANE' }, P);
    function box(y, col, title, lines) { var g = s('g', {}, P), r = s('rect', { x: PX + 14, y: y, width: 252, height: 150, rx: 14, fill: '#141C30', stroke: col, 'stroke-width': 2 }, g); s('text', { x: PX + 28, y: y + 26, 'font-size': 14, 'font-weight': 900, fill: col, text: title }, g); lines.forEach(function (l, k) { s('text', { x: PX + 28, y: y + 52 + k * 22, 'font-size': 12.5, fill: l[1] || '#C9D2E3', 'font-weight': l[2] ? 800 : 400, text: l[0] }, g); }); return { g: g, r: r }; }
    var bxC = box(66, '#5BA8FF', 'Combustion complète', [['flamme bleue, très chaude'], ['assez d’air (dioxygène)'], ['→ dioxyde de carbone', '#EEF2F8', 1], ['→ eau', '#80C8FF', 1]]);
    var bxI = box(232, '#FFB547', 'Combustion incomplète', [['flamme jaune, éclairante'], ['manque d’air (dioxygène)'], ['→ carbone (suie noire)', '#EEF2F8', 1], ['→ monoxyde de carbone !', '#FF8A80', 1]]);
    var tempT = s('text', { x: PX + 140, y: 410, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773' }, P);
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'bunsen' ? '' : 'none'; Bk.style.display = st.mode === 'cuisine' ? '' : 'none';
      var a = st.mode === 'bunsen' ? st.air : (st.dirty ? 0.05 : 1), comp = a >= 0.6;
      bxC.g.setAttribute('opacity', comp ? 1 : 0.4); bxI.g.setAttribute('opacity', comp ? 0.4 : 1); bxC.r.setAttribute('stroke-width', comp ? 3 : 1); bxI.r.setAttribute('stroke-width', comp ? 1 : 3);
      if (st.mode === 'bunsen') {
        if (st.t == null) { st.sau = st.sauIn ? Math.min(1, st.sau + dt / 0.8) : Math.max(0, st.sau - dt / 0.8); if (st.sau >= 1 && st.on) st.dep = Math.min(1, st.dep + dt * Math.pow(1 - a, 2) / 2.5); }
        attr(hole, { width: 2 + 18 * a, x: BX - 1 - 9 * a });
        airA.forEach(function (p, k) { var ph = (T * 1.2 + k / 3) % 1; p.style.display = st.on && a > 0.05 ? '' : 'none'; p.setAttribute('transform', 'translate(' + (BX - 18 - 30 * (1 - ph)) + ' ' + (356 + k * 6) + ')'); p.setAttribute('opacity', a * (0.4 + 0.6 * ph)); });
        fA.set(BX, 246, a, T, st.on);
        SO.forEach(function (c, k) { var ph = (T * 0.5 + rnd(k, 2)) % 1, show = st.on && a < 0.45 && st.sau < 0.5; c.style.display = show ? '' : 'none'; attr(c, { cx: BX + (rnd(k, 3) - 0.5) * 30 + Math.sin(T * 2 + k) * 8, cy: 130 - ph * 90, opacity: (1 - ph) * (0.45 - a) * 2 }); });
        var sy = 104 + st.sau * 86; sauc.setAttribute('transform', 'translate(' + BX + ' ' + sy + ')'); depE.setAttribute('opacity', st.dep);
        var gas = 6, oxN = Math.round(a * 10); ZM.forEach(function (m, k) { var isG = k < gas, show = isG || k - gas < oxN; m.style.display = st.on && show ? '' : 'none'; var ang = rnd(k, 5) * 6.28 + T * (0.6 + rnd(k, 6)), rr = 14 + rnd(k, 7) * 44; attr(m, { cx: 440 + Math.cos(ang) * rr, cy: 190 + Math.sin(ang) * rr }); });
        zT.textContent = !st.on ? 'gaz fermé' : a < 0.1 ? 'virole fermée : du gaz, pas d’air' : a < 0.6 ? 'un peu d’air' : 'virole ouverte : gaz + beaucoup d’air';
        aT.textContent = !st.on ? 'Bec Bunsen éteint' : st.sau > 0.9 ? (st.dep > 0.4 ? 'Dépôt noir sur la soucoupe : du carbone (suie)' : a >= 0.6 ? 'Flamme bleue : la soucoupe reste propre' : 'La soucoupe noircit…') : comp ? 'Flamme bleue : combustion complète' : a < 0.1 ? 'Flamme jaune et fumée noire : combustion incomplète' : 'Flamme jaune-bleu : il manque encore de l’air';
        tempT.textContent = st.on ? 'flamme ≈ ' + Math.round(1000 + 500 * a) + ' °C' : '';
        res = { a: a, dep: st.dep, sau: st.sau, on: st.on };
      } else {
        if (st.t == null && st.dirty) st.soot = Math.min(1, st.soot + dt / 5);
        fK.forEach(function (f, k) { f.set(318 + k * 11, 246, a, T + k * 0.7, true); });
        potS.setAttribute('opacity', st.soot); warnB.style.display = st.dirty ? '' : 'none';
        steam.forEach(function (sm, k) { var ph = (T * 0.6 + k / 3) % 1; sm.setAttribute('transform', 'translate(' + (310 + k * 30) + ' ' + (140 - ph * 40) + ')'); sm.setAttribute('opacity', (1 - ph) * 0.7); });
        bT.textContent = st.dirty ? 'Brûleur encrassé : flamme jaune, la marmite noircit' : st.soot > 0.1 ? 'Brûleur nettoyé : flamme bleue (nettoie la marmite !)' : 'Gazinière bien réglée : flamme bleue';
        tempT.textContent = st.dirty ? 'Aérer ! Faire nettoyer le brûleur' : 'Bonne combustion';
        res = { dirty: st.dirty, soot: st.soot };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le gaz butane' }, { t: 9, title: 'Virole fermée' }, { t: 20, title: 'La suie' }, { t: 30, title: 'Virole ouverte' }, { t: 41, title: 'À la maison' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Le <b>butane</b> est un combustible gazeux', 'il brûle en consommant le dioxygène de l’air.', '#FF8A80'],
      ['Assez d’air : <b>flamme bleue</b>', 'combustion complète → dioxyde de carbone + eau.', '#5BA8FF'],
      ['Manque d’air : <b>flamme jaune</b>', 'combustion incomplète → suie + monoxyde de carbone, toxique.', '#FFB547']], [57.2, 61.4, 65.8]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.on = true;
        if (t < 9) { st.mode = 'cuisine'; st.dirty = false; st.soot = 0; }
        else if (t < 20) { st.mode = 'bunsen'; st.air = 0; st.sau = 0; st.dep = 0; }
        else if (t < 30) { st.mode = 'bunsen'; st.air = 0; st.sau = K.k(t, 20.5, 1); st.dep = K.k(t, 22, 5); }
        else if (t < 41) { st.mode = 'bunsen'; st.air = K.k(t, 30.5, 3); st.sau = t < 35.5 ? 0 : K.k(t, 35.5, 1); st.dep = 0; }
        else if (t < 50) { st.mode = 'cuisine'; st.dirty = true; st.soot = K.k(t, 42, 6); }
        else { st.mode = 'cuisine'; st.dirty = false; st.soot = 1; }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Le gaz brûle avec une flamme bleue') || tg.show(t, 11, 19.6, 290, 92, 'Sans air : flamme jaune et fumée') || tg.show(t, 23, 29.6, 290, 92, 'Un dépôt noir : du carbone') ||
          tg.show(t, 32, 40.6, 290, 92, 'Avec de l’air : flamme bleue') || tg.show(t, 43, 49.6, 290, 92, 'Brûleur encrassé : danger !') || tg.show(t, 51, 56.6, 290, 92, 'Brûleur propre : flamme bleue');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une gazinière reliée à une bouteille de butane B12 avec une flamme bleue ; un bec Bunsen virole fermée donnant une flamme jaune et de la fumée noire, qui noircit une soucoupe ; la virole ouverte donne une flamme bleue qui laisse la soucoupe propre ; un brûleur encrassé donne une flamme jaune qui noircit la marmite et produit du monoxyde de carbone',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'À la maison, la gazinière brûle le butane d’une bouteille de gaz. Le butane est un combustible gazeux.', sub: 'Le <b>butane</b> : un combustible gazeux.' },
      { t: 9, d: 10.6, say: 'Au laboratoire, on brûle le butane dans un bec Bunsen. Virole fermée, l’air n’entre pas : la flamme est jaune, éclairante, et elle fume.', sub: 'Virole fermée : flamme <b>jaune</b>.' },
      { t: 20, d: 9.6, say: 'Plaçons une soucoupe dans cette flamme jaune : elle se couvre d’un dépôt noir. C’est du carbone, la suie.', sub: 'Dépôt noir : du <b>carbone</b> (suie).' },
      { t: 30, d: 10.8, say: 'Ouvrons la virole : l’air entre et se mélange au gaz. La flamme devient bleue et très chaude, et la soucoupe reste propre.', sub: 'Virole ouverte : flamme <b>bleue</b>, pas de suie.' },
      { t: 41, d: 9, say: 'Avec assez de dioxygène, la combustion est complète : elle donne du dioxyde de carbone et de l’eau. Quand l’air manque, elle est incomplète et produit aussi du monoxyde de carbone, un gaz toxique.', sub: 'Manque d’air : <b>monoxyde de carbone</b>, toxique !' },
      { t: 50, d: 6.6, say: 'Un brûleur bien nettoyé donne une flamme bleue : c’est une bonne combustion.', sub: 'Flamme bleue : bonne combustion.' },
      { t: 57, d: 4.2, say: 'À retenir : le butane est un combustible gazeux.', sub: 'Butane : combustible <b>gazeux</b>.' },
      { t: 61.4, d: 4.2, say: 'Avec assez d’air, la flamme est bleue : la combustion est complète.', sub: 'Flamme bleue : complète.' },
      { t: 65.8, d: 5.2, say: 'Quand l’air manque, la flamme est jaune : la combustion est incomplète et dangereuse.', sub: 'Flamme jaune : incomplète.' }
    ],
    learn: [
      { t: 19, ch: 1, html: 'Virole fermée : flamme <b>jaune</b>, éclairante, qui fume.' },
      { t: 29, ch: 2, html: 'La flamme jaune dépose du <b>carbone</b> (suie).' },
      { t: 40, ch: 3, html: 'Virole ouverte : flamme <b>bleue</b>, très chaude, sans suie.' },
      { t: 56, ch: 4, html: 'Combustion incomplète → <b>monoxyde de carbone</b>, gaz toxique.' }
    ],
    question: { q: 'Pour obtenir une flamme bleue avec un bec Bunsen, on :', o: ['ferme la virole', 'ouvre la virole', 'coupe le gaz', 'souffle sur la flamme'], a: 1, e: 'L’air entre par la virole.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Flamme', r: [40, 40, 500, 406] }, { n: 'Bilan', r: [560, 22, 280, 424] }],
    alt: 'Deux activités : un bec Bunsen dont on règle l’ouverture de la virole, avec une soucoupe que l’on place dans la flamme et une loupe sur les molécules de gaz et d’air ; une gazinière reliée à une bouteille de butane dont le brûleur peut être encrassé ; à droite, combustion complète et incomplète',
    steps: [
      'Bec Bunsen : virole fermée, observe la flamme.',
      'Place la soucoupe dans la flamme jaune.',
      'Ouvre la virole : que devient la flamme ?',
      'Cuisine : compare un brûleur propre et encrassé.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'bunsen', options: [{ v: 'bunsen', l: 'Bec Bunsen' }, { v: 'cuisine', l: 'Gazinière' }], onChange: function (v) { st.mode = v; vis(); } });
      var sA = c.slider({ label: 'Ouverture de la virole', min: 0, max: 100, step: 5, value: 0, unit: '%', dec: 0, onInput: function (v) { st.air = v / 100; } });
      var tG = c.toggle({ label: 'Gaz ouvert', value: true, onChange: function (v) { st.on = v; } });
      var bS = c.button({ label: 'Soucoupe dans la flamme / retirer', primary: true, onClick: function () { st.sauIn = !st.sauIn; } });
      var bC = c.button({ label: 'Nettoyer la soucoupe', sm: true, onClick: function () { st.dep = 0; } });
      var tD = c.toggle({ label: 'Brûleur encrassé', value: false, onChange: function (v) { st.dirty = v; } });
      function vis() { var b = st.mode === 'bunsen'; sA.hide(!b); tG.hide(!b); bS.style.display = bC.style.display = b ? '' : 'none'; tD.hide(b); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Flamme' }, { k: 'b', label: 'Combustion' }]), last = {};
      function col() { return !last.a && last.a !== 0 ? '—' : (st.mode === 'bunsen' && !st.on) ? 'éteinte' : last.a >= 0.6 ? 'bleue' : last.a < 0.1 ? 'jaune' : 'jaune et bleue'; }
      api.loop(function () { last = lab.step(); var a = st.mode === 'bunsen' ? st.air : st.dirty ? 0 : 1; last.a = a; ro.a.set(col()); ro.b.set(st.mode === 'bunsen' && !st.on ? '—' : a >= 0.6 ? 'complète' : 'incomplète'); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ e: st.mode === 'bunsen' ? 'virole ' + Math.round(st.air * 100) + ' %' : st.dirty ? 'brûleur encrassé' : 'brûleur propre', f: col(), o: st.mode === 'bunsen' ? (st.dep > 0.4 ? 'dépôt noir' : st.sau > 0.9 ? 'soucoupe propre' : '—') : st.dirty ? 'marmite noircie, CO' : 'pas de suie' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Réglage</th><th>Flamme</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.f + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Deux sortes de combustion</h3><table class="mt"><thead><tr><th></th><th>Complète</th><th>Incomplète</th></tr></thead><tbody><tr><td>Air</td><td>suffisant</td><td>insuffisant</td></tr><tr><td>Flamme</td><td>bleue, très chaude</td><td>jaune, éclairante</td></tr><tr><td>Produits</td><td>dioxyde de carbone + eau</td><td>+ carbone (suie) + monoxyde de carbone</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'bunsen', air: 0, on: true, sau: 0, sauIn: false, dep: 0, dirty: false, soot: 0 }); cM.set('bunsen'); sA.set(0); tG.set(true); tD.set(false); vis(); rows = []; paint(); });
      api.say('Observe la flamme virole fermée.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Le <b>butane</b> est un combustible <b>gazeux</b>. Il brûle dans l’air en consommant du dioxygène.</p><p>Virole ouverte, l’air se mélange au gaz : la flamme est <b>bleue</b> et très chaude, la combustion est <b>complète</b> : elle produit du dioxyde de carbone et de l’eau.</p><p>Virole fermée (ou brûleur encrassé), l’air manque : la flamme est <b>jaune</b>, elle dépose du <b>carbone</b> (suie) et produit du <b>monoxyde de carbone</b>, un gaz invisible et toxique : la combustion est <b>incomplète</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Combustion du butane' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de la flamme bleue',
    intro: 'Règle ta flamme comme un pro du labo… et de la cuisine !',
    missions: [
      { title: 'Flamme bleue', text: 'Règle la virole pour obtenir une <span style="color:#5BA8FF">flamme bleue</span> (combustion complète).', lumi: 'Il faut faire entrer l’air.', hint: 'Ouvre la virole à plus de 60 %.',
        build: function (api) { var lab = mini(api, { mode: 'bunsen' }); api.c.slider({ label: 'Virole', min: 0, max: 100, step: 5, value: 0, unit: '%', dec: 0, onInput: function (v) { lab.st.air = v / 100; } }); return function () { var r = lab.res(); return r.a >= 0.6 ? { ok: true, msg: 'Flamme bleue : combustion complète.' } : { ok: false, msg: 'La flamme est encore jaune.' }; }; },
        e: 'L’air entre par la virole : flamme bleue.' },
      { title: 'La preuve noire', text: 'Montre que la flamme jaune dépose du <b>carbone</b> sur la soucoupe.', lumi: 'Virole fermée, soucoupe dans la flamme.', hint: 'Ferme la virole et place la soucoupe.',
        build: function (api) { var lab = mini(api, { mode: 'bunsen', air: 0.8 }); api.c.slider({ label: 'Virole', min: 0, max: 100, step: 5, value: 80, unit: '%', dec: 0, onInput: function (v) { lab.st.air = v / 100; } }); api.c.button({ label: 'Soucoupe dans la flamme / retirer', sm: true, onClick: function () { lab.st.sauIn = !lab.st.sauIn; } }); return function () { var r = lab.res(); return r.dep > 0.6 ? { ok: true, msg: 'Dépôt noir : c’est du carbone (suie).' } : { ok: false, msg: r.sau > 0.9 ? (r.a >= 0.6 ? 'La flamme bleue ne dépose pas de suie.' : 'Encore un peu…') : 'Place la soucoupe dans la flamme.' }; }; },
        e: 'La combustion incomplète dépose du carbone.' },
      { type: 'qcm', title: 'Le gaz invisible', text: 'Une combustion incomplète peut produire un gaz toxique :', o: ['le dioxygène', 'le monoxyde de carbone', 'le diazote', 'la vapeur d’eau'], a: 1, hint: 'Son nom commence par « mono »…', e: 'Le monoxyde de carbone, invisible et sans odeur.' },
      { title: 'Sécurité cuisine', text: 'La marmite de maman noircit. <b>Règle le problème</b> pour retrouver une flamme bleue.', lumi: 'D’où vient la flamme jaune ?', hint: 'Le brûleur est encrassé : nettoie-le.',
        build: function (api) { var lab = mini(api, { mode: 'cuisine', dirty: true, soot: 0.6 }); api.c.toggle({ label: 'Brûleur encrassé', value: true, onChange: function (v) { lab.st.dirty = v; } }); return function () { var r = lab.res(); return !r.dirty ? { ok: true, msg: 'Brûleur propre : flamme bleue, combustion complète.' } : { ok: false, msg: 'La flamme est toujours jaune.' }; }; },
        e: 'Un brûleur propre laisse entrer l’air.' },
      { type: 'qcm', title: 'Quel état ?', text: 'Le butane de la bouteille de gaz est un combustible :', o: ['solide', 'liquide', 'gazeux', 'ce n’est pas un combustible'], a: 2, hint: 'Il sort du brûleur…', e: 'Le butane brûle à l’état gazeux.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Une flamme de gaz change d’aspect lorsque l’arrivée d’air change. Comment prévoir les conséquences sur la combustion ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-combustion-gaz', level: '6e', theme: 'Les combustions', title: 'Combustion d’un gaz : le butane', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le <b>butane</b> (bouteille de gaz, gazinière, réchaud) est un combustible <b>gazeux</b> ; il brûle en consommant le dioxygène de l’air.',
      'Avec assez d’air (virole ouverte), la flamme est <b>bleue</b> et très chaude : la combustion est <b>complète</b>. Elle produit du <b>dioxyde de carbone</b> et de l’<b>eau</b>.',
      'Quand l’air manque (virole fermée, brûleur encrassé), la flamme est <b>jaune</b> et éclairante : la combustion est <b>incomplète</b>.',
      'Une combustion incomplète dépose du <b>carbone</b> (suie noire) et produit du <b>monoxyde de carbone</b>, un gaz invisible, sans odeur et toxique.',
      'Une flamme jaune à la maison : il faut aérer et faire nettoyer le brûleur.'
    ],
    quiz: [
      { q: 'Le butane est un combustible :', o: ['solide', 'liquide', 'gazeux', 'métallique'], a: 2, e: 'Il brûle à l’état gazeux.' },
      { q: 'Une flamme bleue correspond à une combustion :', o: ['complète', 'incomplète', 'impossible', 'sans dioxygène'], a: 0, e: 'Assez d’air : complète.' },
      { q: 'La virole du bec Bunsen sert à régler l’arrivée :', o: ['du gaz', 'de l’air', 'de l’eau', 'de la chaleur'], a: 1, e: 'Elle règle l’entrée d’air.' },
      { q: 'Le dépôt noir sur la soucoupe est :', o: ['du carbone', 'de l’eau', 'du dioxygène', 'du butane'], a: 0, e: 'C’est la suie : du carbone.' },
      { q: 'La combustion incomplète est dangereuse car elle produit :', o: ['du dioxygène', 'de l’eau', 'du monoxyde de carbone', 'du diazote'], a: 2, e: 'Le monoxyde de carbone est toxique.' }
    ]
  });
})();

