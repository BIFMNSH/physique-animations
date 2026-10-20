/* 3e · Les réactions chimiques · Leçon : Oxydation des corps purs simples */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var CPK = { Cu: ['#E39B5A', '#8A4A16', 17], O: ['#F0454B', '#9E1A1F', 14], C: ['#3A3A3A', '#0E0E0E', 16], S: ['#FFD84A', '#B38C00', 19] };
  var EL = {
    fer: { n: 'fer', eq: '3 Fe + 2 O₂ → Fe₃O₄', ox: 'oxyde magnétique de fer Fe₃O₄', col: '#3A3A42', obs: 'vives étincelles, il se forme des grains gris-noir', met: true },
    cuivre: { n: 'cuivre', eq: '2 Cu + O₂ → 2 CuO', ox: 'oxyde de cuivre II CuO', col: '#1E1A18', obs: 'la lame rouge-orangé devient noire', met: true },
    carbone: { n: 'carbone', eq: 'C + O₂ → CO₂', ox: 'dioxyde de carbone CO₂', col: '#EEF2F8', obs: 'il rougeoie ; l’eau de chaux se trouble', met: false },
    soufre: { n: 'soufre', eq: 'S + O₂ → SO₂', ox: 'dioxyde de soufre SO₂', col: '#EEF2F8', obs: 'flamme bleue, gaz à l’odeur piquante', met: false }
  };
  var MOLS = { cuivre: [['Cu', -78, -26, 36, -26], ['Cu', -78, 30, 36, 30], ['O', -24, 2, 70, -26], ['O', 4, 2, 70, 30]], carbone: [['C', -70, 2, 60, 2], ['O', -14, 2, 28, 2], ['O', 14, 2, 92, 2]], soufre: [['S', -70, 2, 60, 2], ['O', -14, 2, 26, 2], ['O', 14, 2, 94, 2]] };
  var GID = 0;
  function grads(G) { var d = s('defs', {}, G), o = {}; Object.keys(CPK).forEach(function (e) { var id = 'ox' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, d); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': CPK[e][0] }, gr); s('stop', { offset: 1, 'stop-color': CPK[e][1] }, gr); o[e] = 'url(#' + id + ')'; }); return o; }
  function glow(G, col) { var id = 'og' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function ease(p) { p = Math.max(0, Math.min(1, p)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function mix(a, b, k) { var A = a.match(/\w\w/g).map(function (h) { return parseInt(h, 16); }), B = b.match(/\w\w/g).map(function (h) { return parseInt(h, 16); }); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'vive', el: 'fer', p: 0, run: false, days: 0, t: null }, o || {});
    var GR = grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- OXYDATION VIVE ---------- */
    var A = s('g', {}, G), FX = 300;
    var flask = s('g', {}, A); s('path', { d: 'M' + (FX - 22) + ' 150 V184 L' + (FX - 80) + ' 300 V384 q0 10 10 10 H' + (FX + 70) + ' q10 0 10 -10 V300 L' + (FX + 22) + ' 184 V150', fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, flask); var lime = s('rect', { x: FX - 77, width: 154, fill: '#DDEFFF' }, flask); s('text', { x: FX, y: 420, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'flacon de dioxygène' }, flask);
    var fumes = s('g', {}, flask), FU = []; for (var i = 0; i < 16; i++) FU.push(s('circle', { r: 9, fill: '#E6E9EF' }, fumes));
    var rod = s('line', { x1: FX, y1: 110, x2: FX, stroke: '#9AA6BC', 'stroke-width': 3 }, A);
    var wool = s('g', {}, A), woolP = s('path', { d: 'M-22 0 q8 -20 22 -8 q14 -14 22 6 q6 16 -10 22 q-18 6 -30 -2 q-10 -8 -4 -18z', stroke: '#C9D2E3', 'stroke-width': 2 }, wool), woolG = s('circle', { r: 34, fill: glow(G, '#FFD27A') }, wool);
    var SP = []; for (i = 0; i < 26; i++) SP.push(s('line', { stroke: '#FFE29A', 'stroke-width': 2, 'stroke-linecap': 'round' }, A));
    var drops = s('g', {}, A), DR = []; for (i = 0; i < 10; i++) DR.push(s('circle', { r: 2.5 + rnd(i, 1) * 2, fill: '#3A3A42' }, drops));
    var spoon = s('g', {}, A), spC = s('path', { d: 'M-16 0 q16 14 32 0z', fill: '#9AA6BC' }, spoon), lump = s('path', { d: 'M-12 -2 q2 -10 12 -10 q10 0 12 10z' }, spoon), lumpG = s('circle', { cy: -6, r: 26, fill: glow(G, '#FF7A2E') }, spoon), sFl = s('path', { fill: '#5B8CFF', opacity: 0.85 }, spoon);
    var bun = s('g', {}, A); s('rect', { x: 160, y: 380, width: 60, height: 12, rx: 4, fill: '#5B6478' }, bun); s('rect', { x: 182, y: 300, width: 16, height: 80, fill: '#9AA6BC' }, bun); var bFl = s('path', { d: 'M190 300 q-14 -30 0 -70 q14 40 0 70z', fill: '#5BA8FF', opacity: 0.85 }, bun);
    var plate = s('g', {}, A), plR = s('rect', { x: 0, y: -10, width: 150, height: 20, rx: 3 }, plate); s('line', { x1: 150, y1: 0, x2: 260, y2: -40, stroke: '#9AA6BC', 'stroke-width': 5 }, plate); plate.setAttribute('transform', 'translate(150 230)');
    var aMsg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- OXYDATION LENTE ---------- */
    var B = s('g', {}, G), TX = [160, 290, 420], TT = ['air + eau', 'eau bouillie + huile', 'air sec'], TS = ['(air humide)', '(pas d’air)', '(pas d’eau)'];
    var nails = TX.map(function (x, k) { var g = s('g', {}, B); s('path', { d: 'M' + (x - 26) + ' 120 V360 a26 26 0 0 0 52 0 V120', fill: '#9FD7FF', 'fill-opacity': 0.06, stroke: '#BFE6FF', 'stroke-width': 3 }, g);
      if (k === 0) s('path', { d: 'M' + (x - 24) + ' 300 V360 a24 24 0 0 0 48 0 V300z', fill: '#4FA8FF', opacity: 0.45 }, g);
      if (k === 1) { s('path', { d: 'M' + (x - 24) + ' 170 V360 a24 24 0 0 0 48 0 V170z', fill: '#4FA8FF', opacity: 0.45 }, g); s('rect', { x: x - 24, y: 150, width: 48, height: 20, fill: '#E2B23C', opacity: 0.7 }, g); }
      if (k === 2) { for (var q = 0; q < 14; q++) s('circle', { cx: x - 16 + (q % 5) * 8, cy: 372 - Math.floor(q / 5) * 8, r: 4, fill: '#EEF2F8' }, g); s('rect', { x: x - 24, y: 120, width: 48, height: 10, fill: '#8D6E4E' }, g); }
      var nl = s('g', {}, g); s('rect', { x: x - 3, y: 180, width: 6, height: 170, fill: '#9AA6BC' }, nl); s('rect', { x: x - 10, y: 176, width: 20, height: 6, rx: 2, fill: '#9AA6BC' }, nl); var rust = s('rect', { x: x - 4, y: 220, width: 8, height: 130, fill: '#B5521E' }, nl), rust2 = s('rect', { x: x - 11, y: 175, width: 22, height: 8, rx: 2, fill: '#B5521E' }, nl);
      s('text', { x: x, y: 412, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: TT[k] }, g); s('text', { x: x, y: 428, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: TS[k] }, g);
      return { rust: rust, rust2: rust2 }; });
    var cal = s('g', {}, B); s('rect', { x: 444, y: 56, width: 84, height: 54, rx: 10, fill: '#EEF2F8' }, cal); var calT = s('text', { x: 486, y: 92, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#1A1F28' }, cal);
    var bMsg = s('text', { x: 280, y: 114, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var MV = s('g', {}, P), keyM = '', MA = [];
    var arr = s('text', { x: PX + 140, y: 128, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#7D89A3', text: '' }, P), crys = s('text', { x: PX + 140, y: 122, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var eqT = s('text', { x: PX + 140, y: 196, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 900, fill: '#FFC773' }, P), oxT = s('text', { x: PX + 140, y: 220, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 240, y2: 240, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5, 6].map(function (k) { return s('text', { x: PX + 140, y: 266 + k * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', a[k] && a[k].charAt(0) === '•' ? 800 : 400); }); }
    function mol(el, p) {
      var m = MOLS[el]; if (keyM !== el) { keyM = el; while (MV.firstChild) MV.removeChild(MV.firstChild); MA = (m || []).map(function (a) { var g = s('g', {}, MV); s('circle', { r: CPK[a[0]][2], fill: GR[a[0]], stroke: '#0006', 'stroke-width': 1 }, g); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': a[0].length > 1 ? 10 : 11, 'font-weight': 900, fill: a[0] === 'S' ? '#3A2A00' : '#FFF', text: a[0] }, g); return g; }); }
      if (!m) { crys.textContent = el === 'fer' ? 'Fe₃O₄ : un solide (cristal), pas une molécule' : 'Al₂O₃ : un solide (cristal)'; return; } crys.textContent = '';
      var e = ease(p); m.forEach(function (a, i) { var x = a[1] + (a[3] - a[1]) * e, y = a[2] + (a[4] - a[2]) * e; MA[i].setAttribute('transform', 'translate(' + (PX + 140 + x).toFixed(1) + ' ' + (122 + y).toFixed(1) + ')'); });
    }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'vive' ? '' : 'none'; B.style.display = st.mode === 'lente' ? '' : 'none';
      if (st.mode === 'vive') {
        if (st.t == null && st.run) { st.p = Math.min(1, st.p + dt / 4); if (st.p >= 1) st.run = false; }
        var el = st.el, E = EL[el], p = st.p, inFl = el !== 'cuivre';
        flask.style.display = inFl ? '' : 'none'; bun.style.display = plate.style.display = el === 'cuivre' ? '' : 'none';
        rod.style.display = inFl ? '' : 'none'; wool.style.display = el === 'fer' ? '' : 'none'; spoon.style.display = el === 'carbone' || el === 'soufre' ? '' : 'none';
        var dip = Math.min(1, p / 0.15), yy = 130 + 150 * dip; attr(rod, { y2: yy - 8 });
        var burning = p > 0.15 && p < 0.9;
        wool.setAttribute('transform', 'translate(' + FX + ' ' + yy + ')'); woolP.setAttribute('fill', mix('#C9D2E3', '#3A3A42', Math.max(0, (p - 0.15) / 0.7))); woolG.setAttribute('opacity', burning && el === 'fer' ? 0.7 + 0.3 * Math.sin(T * 20) : 0);
        SP.forEach(function (l, k) { var on = el === 'fer' && burning, ph = (T * 2.2 + rnd(k, 1)) % 1, a = rnd(k, 2) * 6.28, r1 = 10 + ph * 60, r2 = r1 + 10; l.style.display = on ? '' : 'none'; attr(l, { x1: FX + Math.cos(a) * r1, y1: yy + Math.sin(a) * r1, x2: FX + Math.cos(a) * r2, y2: yy + Math.sin(a) * r2, opacity: 1 - ph }); });
        DR.forEach(function (d, k) { var ph = Math.max(0, p - 0.2 - rnd(k, 3) * 0.5) * 3; d.style.display = el === 'fer' && p > 0.2 ? '' : 'none'; attr(d, { cx: FX - 30 + rnd(k, 4) * 60, cy: Math.min(390, yy + 20 + ph * 120) }); });
        spoon.setAttribute('transform', 'translate(' + FX + ' ' + yy + ')'); lump.setAttribute('fill', el === 'soufre' ? '#FFD84A' : '#1E1E22'); lump.setAttribute('transform', 'scale(' + (1 - 0.6 * Math.max(0, (p - 0.15) / 0.75)) + ')');
        lumpG.setAttribute('opacity', el === 'carbone' && burning ? 0.8 : 0); var fk = 1 + 0.1 * Math.sin(T * 18); sFl.setAttribute('d', el === 'soufre' && burning ? 'M-10 -6 q-8 -22 10 -' + (40 * fk) + ' q18 22 10 ' + (40 * fk) + 'z' : '');
        var fumeK = el === 'soufre' ? Math.max(0, Math.min(1, (p - 0.2) * 2)) : 0; FU.forEach(function (c, k) { var ph = (rnd(k, 5) + T * 0.05) % 1; attr(c, { cx: FX - 60 + rnd(k, 6) * 120 + Math.sin(T + k) * 6, cy: 200 + ph * 180, opacity: fumeK * 0.35 }); });
        var lh = el === 'carbone' && p > 0.9 ? 30 * Math.min(1, (p - 0.9) * 12) : 0; attr(lime, { y: 394 - lh, height: lh }); lime.setAttribute('fill', lh > 2 ? '#F4F6FA' : '#DDEFFF'); lime.setAttribute('opacity', lh > 2 ? 0.85 : 0);
        var heat = Math.max(0, (p - 0.1) / 0.8); bFl.style.display = el === 'cuivre' && p > 0 && p < 1 ? '' : 'none'; plR.setAttribute('fill', mix('#D9804A', '#1E1A18', Math.min(1, heat)));
        aMsg.textContent = p <= 0 ? (el === 'cuivre' ? 'Une lame de cuivre au-dessus d’un bec Bunsen' : 'Le ' + E.n + ' chauffé va être plongé dans le dioxygène') : p < 0.9 ? E.obs : 'Il s’est formé : ' + E.ox;
        pT.textContent = 'OXYDATION DU ' + E.n.toUpperCase(); mol(el, Math.max(0, (p - 0.15) / 0.7)); eqT.textContent = E.eq; oxT.textContent = 'produit : ' + E.ox;
        pset(['• Oxydation : le corps simple', 'se combine avec le dioxygène.', 'Il se forme un oxyde.', E.met ? 'Le ' + E.n + ' est un métal :' : 'Le ' + E.n + ' est un non-métal :', E.met ? 'son oxyde est un solide.' : 'son oxyde est un gaz.', 'Oxydation vive = combustion', '(chaleur et lumière).']);
        res = { el: el, p: p, done: p >= 1 };
      } else {
        var d = st.days, k1 = Math.min(1, d / 5);
        nails.forEach(function (nl, k) { var r = k === 0 ? k1 : 0; nl.rust.setAttribute('opacity', r); nl.rust2.setAttribute('opacity', r * 0.9); });
        calT.textContent = fmt(d, d % 1 ? 1 : 0) + ' j'; bMsg.textContent = d < 0.5 ? 'Trois clous en fer neufs : lequel va rouiller ?' : d < 3 ? 'Les jours passent…' : 'Seul le clou dans l’air humide a rouillé';
        pT.textContent = 'OXYDATION LENTE : LA ROUILLE'; mol('fer', 0); crys.textContent = 'la rouille : un oxyde de fer hydraté'; eqT.textContent = 'fer + dioxygène + eau → rouille'; oxT.textContent = 'oxydation lente, sans flamme';
        pset(['• Le fer rouille en présence', 'de dioxygène ET d’eau.', 'La rouille est poreuse :', 'le fer est rongé en profondeur.', 'Protection : peinture, graisse,', 'zinc (tôle galvanisée).', 'L’alumine protège l’aluminium.']);
        res = { days: d, rust: k1 };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le portail rouillé' }, { t: 8, title: 'Le fer' }, { t: 18, title: 'Le cuivre' }, { t: 28, title: 'Le carbone et le soufre' }, { t: 40, title: 'La rouille' }, { t: 52, title: 'Protéger les métaux' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Oxydation : un corps simple <b>+ dioxygène → oxyde</b>', '2 Cu + O₂ → 2 CuO ; 3 Fe + 2 O₂ → Fe₃O₄ ; C + O₂ → CO₂ ; S + O₂ → SO₂.', '#FFC773'],
      ['Oxydation <b>vive</b> (combustion) ou <b>lente</b>', 'la rouille se forme lentement, sans flamme.', '#FF8A80'],
      ['Le fer rouille avec <b>l’air et l’eau</b>', 'on le protège : peinture, graisse, zinc.', '#B5521E']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 8) { st.mode = 'lente'; st.days = 6; }
        else if (t < 18) { st.mode = 'vive'; st.el = 'fer'; st.p = Math.max(0, Math.min(1, (t - 8.6) / 8.6)); }
        else if (t < 28) { st.mode = 'vive'; st.el = 'cuivre'; st.p = Math.max(0, Math.min(1, (t - 18.6) / 8)); }
        else if (t < 34) { st.mode = 'vive'; st.el = 'carbone'; st.p = Math.max(0, Math.min(1, (t - 28.4) / 5.2)); }
        else if (t < 40) { st.mode = 'vive'; st.el = 'soufre'; st.p = Math.max(0, Math.min(0.85, (t - 34.4) / 5.2)); }
        else { st.mode = 'lente'; st.days = t < 52 ? 6 * K.k(t, 41, 9) : 6; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Pourquoi le fer rouille-t-il ?') || tg.show(t, 9, 17.6, 290, 92, '3 Fe + 2 O₂ → Fe₃O₄') || tg.show(t, 19, 27.6, 290, 92, '2 Cu + O₂ → 2 CuO') || tg.show(t, 29, 33.6, 290, 92, 'C + O₂ → CO₂') || tg.show(t, 34.6, 39.6, 290, 92, 'S + O₂ → SO₂') ||
          tg.show(t, 42, 51.6, 290, 92, 'Il faut de l’air ET de l’eau') || tg.show(t, 52.4, 56.6, 290, 92, 'Peinture, graisse, zinc : protection');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : trois clous dans des tubes, dont un seul rouille ; de la paille de fer incandescente qui brûle avec des étincelles dans un flacon de dioxygène ; une lame de cuivre qui noircit dans la flamme d’un bec Bunsen, avec les atomes de cuivre et d’oxygène qui forment l’oxyde de cuivre ; du carbone qui rougeoie et trouble l’eau de chaux ; du soufre qui brûle avec une flamme bleue ; enfin la rouille qui n’apparaît qu’avec de l’air et de l’eau',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Les portails en fer finissent par rouiller. Que se passe-t-il quand un métal réagit avec l’air ?', sub: 'Pourquoi le fer <b>rouille</b>-t-il ?' },
      { t: 8, d: 9.6, say: 'Plongée dans du dioxygène, la paille de fer chauffée brûle avec de vives étincelles. Il se forme un solide gris-noir : l’oxyde magnétique de fer.', sub: '<b>3 Fe + 2 O₂ → Fe₃O₄</b>' },
      { t: 18, d: 9.6, say: 'Chauffée dans l’air, une lame de cuivre noircit : le cuivre se combine avec le dioxygène pour former de l’oxyde de cuivre.', sub: '<b>2 Cu + O₂ → 2 CuO</b>' },
      { t: 28, d: 11.6, say: 'Les non-métaux s’oxydent aussi. Le carbone donne du dioxyde de carbone, qui trouble l’eau de chaux. Le soufre brûle avec une flamme bleue et donne du dioxyde de soufre, à l’odeur piquante.', sub: 'C + O₂ → CO₂ ; S + O₂ → SO₂.' },
      { t: 40, d: 11.6, say: 'La rouille est une oxydation lente du fer. Elle n’apparaît qu’en présence à la fois de dioxygène et d’eau : sans air, ou sans eau, le clou reste intact.', sub: 'La rouille : <b>air + eau</b>.' },
      { t: 52, d: 4.6, say: 'Pour protéger le fer, on le peint, on le graisse ou on le recouvre de zinc.', sub: 'Protéger : peinture, graisse, zinc.' },
      { t: 57, d: 4.6, say: 'À retenir : l’oxydation d’un corps simple est sa combinaison avec le dioxygène. Il se forme un oxyde.', sub: 'Corps simple + O₂ → oxyde.' },
      { t: 61.8, d: 4.2, say: 'Elle peut être vive, comme une combustion, ou lente, comme la rouille.', sub: 'Vive ou lente.' },
      { t: 66.2, d: 4.8, say: 'Le fer rouille avec l’air et l’eau.', sub: 'Air + eau → rouille.' }
    ],
    learn: [
      { t: 17, ch: 1, html: 'Le fer brûle dans le dioxygène : <b>3 Fe + 2 O₂ → Fe₃O₄</b>.' },
      { t: 27, ch: 2, html: 'Le cuivre chauffé noircit : <b>2 Cu + O₂ → 2 CuO</b>.' },
      { t: 39, ch: 3, html: 'Non-métaux : C + O₂ → CO₂ ; S + O₂ → SO₂ (oxydes gazeux).' },
      { t: 56, ch: 4, html: 'La rouille exige <b>dioxygène et eau</b>.' }
    ],
    question: { q: 'Quand on chauffe une lame de cuivre à l’air, elle devient :', o: ['verte', 'noire', 'blanche', 'transparente'], a: 1, e: 'Il se forme de l’oxyde de cuivre CuO, noir.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : l’oxydation vive du fer, du cuivre, du carbone et du soufre, chacun réagissant avec le dioxygène avec ses observations propres et son équation-bilan, avec les atomes qui se réarrangent dans le panneau ; puis l’oxydation lente de trois clous placés dans l’air humide, dans de l’eau bouillie sous l’huile et dans l’air sec, au fil des jours',
    steps: [
      'Oxydation vive : choisis un corps simple et lance la réaction.',
      'Compare les produits des métaux et des non-métaux.',
      'Rouille : fais passer les jours.',
      'Trouve les conditions nécessaires à la rouille.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'vive', options: [{ v: 'vive', l: 'Oxydation vive' }, { v: 'lente', l: 'La rouille' }], onChange: function (v) { st.mode = v; vis(); } });
      var cE = c.seg({ label: 'Corps simple', value: 'fer', options: [{ v: 'fer', l: 'fer' }, { v: 'cuivre', l: 'cuivre' }, { v: 'carbone', l: 'carbone' }, { v: 'soufre', l: 'soufre' }], onChange: function (v) { st.el = v; st.p = 0; st.run = false; } });
      var bG = c.button({ label: 'Lancer la réaction', primary: true, onClick: function () { st.p = 0; st.run = true; api.sound('pop'); } });
      var sD = c.slider({ label: 'Jours', min: 0, max: 7, step: 0.5, value: 0, unit: 'j', dec: 1, onInput: function (v) { st.days = v; } });
      function vis() { var v = st.mode === 'vive'; cE.hide(!v); bG.style.display = v ? '' : 'none'; sD.hide(v); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Réaction' }, { k: 'b', label: 'Produit' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'vive') { ro.a.set(EL[st.el].eq); ro.b.set(st.p >= 1 ? EL[st.el].ox.split(' ').slice(-1)[0] : '—'); } else { ro.a.set(st.days + ' jour(s)'); ro.b.set(last.rust > 0.3 ? 'rouille (tube 1)' : '—'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode === 'vive') { if (st.p < 1) { api.say('Attends la fin de la réaction.'); return; } rows.push({ e: EL[st.el].n, o: EL[st.el].obs, q: EL[st.el].eq }); } else rows.push({ e: 'clous, ' + st.days + ' j', o: last.rust > 0.3 ? 'seul le clou dans l’air humide rouille' : 'pas encore de rouille', q: '—' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Corps</th><th>Observation</th><th>Équation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td><td>' + r.q + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Les oxydes</h3><table class="mt"><thead><tr><th>Corps simple</th><th>Oxyde</th><th>État</th></tr></thead><tbody><tr><td>fer Fe</td><td>Fe₃O₄ (gris-noir)</td><td>solide</td></tr><tr><td>cuivre Cu</td><td>CuO (noir)</td><td>solide</td></tr><tr><td>aluminium Al</td><td>Al₂O₃ (blanc)</td><td>solide</td></tr><tr><td>carbone C</td><td>CO₂</td><td>gaz</td></tr><tr><td>soufre S</td><td>SO₂</td><td>gaz</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'vive', el: 'fer', p: 0, run: false, days: 0 }); cM.set('vive'); cE.set('fer'); sD.set(0); vis(); rows = []; paint(); });
      api.say('Choisis un corps simple et lance la réaction.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>L’<b>oxydation</b> d’un corps pur simple est sa réaction avec le <b>dioxygène</b> : il se forme un <b>oxyde</b>. Elle est <b>vive</b> quand elle produit chaleur et lumière (combustion), <b>lente</b> sinon (rouille).</p><p>Métaux : 3 Fe + 2 O₂ → Fe₃O₄ ; 2 Cu + O₂ → 2 CuO ; 4 Al + 3 O₂ → 2 Al₂O₃ — leurs oxydes sont solides. Non-métaux : C + O₂ → CO₂ ; S + O₂ → SO₂ — leurs oxydes sont gazeux.</p><p>Le fer rouille en présence de <b>dioxygène et d’eau</b> ; la rouille poreuse ronge le métal. On le protège par la peinture, la graisse ou le zinc (tôle galvanisée). L’aluminium, lui, se couvre d’une fine couche d’alumine qui le protège.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Oxydation des corps purs simples' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function vive(api, el0) { var lab = mini(api, { el: el0 }); api.c.seg({ label: 'Corps simple', value: el0, options: [{ v: 'fer', l: 'fer' }, { v: 'cuivre', l: 'cuivre' }, { v: 'carbone', l: 'carbone' }, { v: 'soufre', l: 'soufre' }], onChange: function (v) { lab.st.el = v; lab.st.p = 0; lab.st.run = false; } }); api.c.button({ label: 'Lancer', sm: true, onClick: function () { lab.st.p = 0; lab.st.run = true; } }); return lab; }
  var DEFI = {
    title: 'Le défi de l’oxygène',
    intro: 'Métaux et non-métaux face au dioxygène !',
    missions: [
      { title: 'Lame noire', text: 'Fais réagir le métal qui donne un <b>oxyde noir</b> CuO.', lumi: 'Rouge-orangé au départ…', hint: 'Le cuivre.',
        build: function (api) { var lab = vive(api, 'fer'); return function () { var r = lab.res(); return r.el === 'cuivre' && r.done ? { ok: true, msg: '2 Cu + O₂ → 2 CuO.' } : { ok: false, msg: r.done ? 'Ce n’est pas CuO.' : 'Lance une réaction.' }; }; },
        e: 'Le cuivre donne l’oxyde de cuivre CuO.' },
      { title: 'Flamme bleue', text: 'Fais brûler le non-métal qui donne un gaz à l’<b>odeur piquante</b>.', lumi: 'Il est jaune.', hint: 'Le soufre.',
        build: function (api) { var lab = vive(api, 'carbone'); return function () { var r = lab.res(); return r.el === 'soufre' && r.p > 0.5 ? { ok: true, msg: 'S + O₂ → SO₂ : dioxyde de soufre.' } : { ok: false, msg: 'Pas encore…' }; }; },
        e: 'Le soufre donne du dioxyde de soufre.' },
      { title: 'La rouille', text: 'Fais passer assez de jours pour voir <b>quel clou rouille</b>.', lumi: 'Patience…', hint: 'Au moins 4 jours.',
        build: function (api) { var lab = mini(api, { mode: 'lente' }); api.c.slider({ label: 'Jours', min: 0, max: 7, step: 0.5, value: 0, unit: 'j', dec: 1, onInput: function (v) { lab.st.days = v; } }); return function () { var r = lab.res(); return r.rust > 0.75 ? { ok: true, msg: 'Seul le clou dans l’air humide rouille : il faut air + eau.' } : { ok: false, msg: 'Pas assez de rouille.' }; }; },
        e: 'La rouille exige dioxygène et eau.' },
      { type: 'qcm', title: 'Équilibrer', text: '4 Al + … O₂ → 2 Al₂O₃', o: ['2', '3', '4', '6'], a: 1, hint: '6 atomes O à droite.', e: '3 O₂ = 6 O.' },
      { type: 'qcm', title: 'Protéger', text: 'Pour éviter que la tôle d’un toit rouille, on utilise :', o: ['de l’eau', 'du zinc (tôle galvanisée)', 'du sel', 'du dioxygène'], a: 1, hint: 'On isole le fer de l’air et de l’eau.', e: 'La tôle galvanisée est recouverte de zinc.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un corps pur réagit avec le dioxygène. Comment identifier les réactifs et les produits de cette transformation ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-oxydation-corps-purs', level: '3e', theme: 'Les réactions chimiques', title: 'Oxydation des corps purs simples', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’<b>oxydation</b> d’un corps pur simple est sa réaction avec le <b>dioxygène</b> : il se forme un <b>oxyde</b>.',
      'Métaux : <b>3 Fe + 2 O₂ → Fe₃O₄</b> (oxyde magnétique) ; <b>2 Cu + O₂ → 2 CuO</b> (noir) ; <b>4 Al + 3 O₂ → 2 Al₂O₃</b> (alumine). Leurs oxydes sont solides.',
      'Non-métaux : <b>C + O₂ → CO₂</b> ; <b>S + O₂ → SO₂</b>. Leurs oxydes sont gazeux.',
      'Une oxydation est <b>vive</b> si elle s’accompagne de chaleur et de lumière (combustion), <b>lente</b> sinon.',
      'La <b>rouille</b> est une oxydation lente du fer qui nécessite du <b>dioxygène et de l’eau</b>. On protège le fer par peinture, graisse ou zinc ; l’alumine protège l’aluminium.'
    ],
    quiz: [
      { q: 'L’oxydation d’un métal est sa réaction avec :', o: ['l’eau', 'le dioxygène', 'le diazote', 'le dihydrogène'], a: 1, e: 'Avec le dioxygène.' },
      { q: 'La combustion du fer dans le dioxygène donne :', o: ['CuO', 'Fe₃O₄', 'CO₂', 'Al₂O₃'], a: 1, e: 'L’oxyde magnétique Fe₃O₄.' },
      { q: 'L’oxyde du soufre est :', o: ['un solide noir', 'un gaz à odeur piquante', 'un liquide', 'un métal'], a: 1, e: 'SO₂, gazeux.' },
      { q: 'Un clou rouille dans :', o: ['l’air sec', 'l’eau bouillie sous l’huile', 'l’air humide', 'le vide'], a: 2, e: 'Il faut air + eau.' },
      { q: 'La rouille est une oxydation :', o: ['vive', 'lente', 'impossible', 'électrique'], a: 1, e: 'Lente, sans flamme.' }
    ]
  });
})();

