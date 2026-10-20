/* 3e · Les réactions chimiques · Leçon : Les alcanes */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var CPK = { H: ['#FFFFFF', '#B9C2CF', 12], C: ['#3A3A3A', '#0E0E0E', 19], O: ['#F0454B', '#9E1A1F', 16] };
  var ALK = [null, { n: 'méthane', e: 'gaz', u: 'gaz naturel, biogaz' }, { n: 'éthane', e: 'gaz', u: 'gaz naturel' }, { n: 'propane', e: 'gaz', u: 'bouteilles de gaz, réchauds' }, { n: 'butane', e: 'gaz', u: 'bouteille de gaz B12, briquets' }, { n: 'pentane', e: 'liquide', u: 'solvant, essence' }, { n: 'hexane', e: 'liquide', u: 'solvant, essence' }];
  var SUB = '₀₁₂₃₄₅₆₇₈₉';
  function sub(n) { return String(n).split('').map(function (d) { return SUB[+d]; }).join(''); }
  function formula(n) { return 'C' + (n > 1 ? sub(n) : '') + 'H' + sub(2 * n + 2); }
  function eqn(n) { var a = 1, b = (3 * n + 1) / 2, c = n, d = n + 1; if (b % 1) { a *= 2; b *= 2; c *= 2; d *= 2; } return { a: a, b: b, c: c, d: d }; }
  function co(k, x) { return (k > 1 ? k + ' ' : '') + x; }
  var GID = 0;
  function grads(G) { var d = s('defs', {}, G), o = {}; Object.keys(CPK).forEach(function (e) { var id = 'al' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, d); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': e === 'H' ? 1 : 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': CPK[e][0] }, gr); s('stop', { offset: 1, 'stop-color': CPK[e][1] }, gr); o[e] = 'url(#' + id + ')'; }); return o; }
  function ease(p) { p = Math.max(0, Math.min(1, p)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  /* combustion du méthane : CH4 + 2 O2 → CO2 + 2 H2O */
  var RA = [['C', 130, 230], ['H', 130, 184], ['H', 130, 276], ['H', 84, 230], ['H', 176, 230], ['O', 232, 168], ['O', 264, 168], ['O', 232, 292], ['O', 264, 292]];
  var RB = [['C', 420, 150], ['H', 352, 306], ['H', 400, 306], ['H', 446, 306], ['H', 494, 306], ['O', 382, 150], ['O', 458, 150], ['O', 376, 282], ['O', 470, 282]];
  var BA = [[0, 1], [0, 2], [0, 3], [0, 4], [5, 6], [7, 8]], BB = [[0, 5], [0, 6], [7, 1], [7, 2], [8, 3], [8, 4]];

  function Lab(G, o) {
    var st = Object.assign({ mode: 'molecules', n: 4, fade: 1, cp: 0, run: false, t: null }, o || {});
    var GR = grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    function atom(par, e) { var g = s('g', {}, par); s('circle', { r: CPK[e][2], fill: GR[e], stroke: '#0006', 'stroke-width': 1 }, g); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': e === 'H' ? 10 : 12, 'font-weight': 900, fill: e === 'H' ? '#1A1F28' : '#FFF', text: e }, g); return g; }
    /* ---------- MOLÉCULES ---------- */
    var A = s('g', {}, G), bondsA = s('g', {}, A), atomsA = s('g', {}, A), keyA = -1;
    var nameT = s('text', { x: 290, y: 352, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#EEF2F8' }, A), formT = s('text', { x: 290, y: 382, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#FFC773' }, A), useT = s('text', { x: 290, y: 410, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#A9B4C7' }, A), stT = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800 }, A);
    var bottle = s('g', {}, A); s('rect', { x: 452, y: 236, width: 64, height: 96, rx: 18, fill: '#2F7D4F' }, bottle); s('rect', { x: 472, y: 222, width: 24, height: 16, rx: 3, fill: '#9AA6BC' }, bottle); s('text', { x: 484, y: 290, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#EEF2F8', text: 'B12' }, bottle);
    function build(n) {
      while (bondsA.firstChild) bondsA.removeChild(bondsA.firstChild); while (atomsA.firstChild) atomsA.removeChild(atomsA.firstChild);
      var cy = 210, x0 = 290 - 32 * (n - 1), pts = [];
      for (var i = 0; i < n; i++) { var x = x0 + 64 * i; pts.push(['C', x, cy]); pts.push(['H', x, cy - 56]); pts.push(['H', x, cy + 56]); s('line', { x1: x, y1: cy - 56, x2: x, y2: cy + 56, stroke: '#C9D2E3', 'stroke-width': 3 }, bondsA); if (i) s('line', { x1: x - 64, y1: cy, x2: x, y2: cy, stroke: '#C9D2E3', 'stroke-width': 3 }, bondsA); }
      pts.push(['H', x0 - 52, cy]); pts.push(['H', x0 + 64 * (n - 1) + 52, cy]); s('line', { x1: x0 - 52, y1: cy, x2: x0, y2: cy, stroke: '#C9D2E3', 'stroke-width': 3 }, bondsA); s('line', { x1: x0 + 64 * (n - 1), y1: cy, x2: x0 + 64 * (n - 1) + 52, y2: cy, stroke: '#C9D2E3', 'stroke-width': 3 }, bondsA);
      pts.forEach(function (p) { atom(atomsA, p[0]).setAttribute('transform', 'translate(' + p[1] + ' ' + p[2] + ')'); });
    }
    /* ---------- COMBUSTION ---------- */
    var B = s('g', {}, G), bondB = s('g', {}, B), atB = RA.map(function (a) { return atom(B, a[0]); });
    var flame = s('path', { d: 'M290 250 q-16 -26 0 -60 q16 34 0 60z', fill: '#FFB547', opacity: 0.85 }, B), arrB = s('text', { x: 300, y: 238, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: '#7D89A3', text: '→' }, B);
    var lab1 = s('text', { x: 160, y: 352, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7', text: 'réactifs' }, B), lab2 = s('text', { x: 424, y: 352, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7', text: 'produits' }, B);
    var eqB = s('text', { x: 290, y: 392, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#FFC773', text: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O' }, B), bMsg = s('text', { x: 290, y: 424, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'LES ALCANES' }, P);
    s('text', { x: PX + 140, y: 88, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 900, fill: '#FFC773', text: 'CₙH₂ₙ₊₂' }, P);
    var gen = s('text', { x: PX + 140, y: 114, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 132, y2: 132, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var cT = s('text', { x: PX + 140, y: 156, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'COMBUSTION COMPLÈTE' }, P);
    var eq1 = s('text', { x: PX + 140, y: 184, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#EEF2F8' }, P), eq2 = s('text', { x: PX + 140, y: 206, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#EEF2F8' }, P);
    var tb = s('g', {}, P); ['', 'réactifs', 'produits'].forEach(function (h, k) { s('text', { x: PX + 50 + k * 90, y: 238, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#A9B4C7', text: h }, tb); });
    var cnt = ['C', 'H', 'O'].map(function (e, k) { var y = 262 + k * 24; s('text', { x: PX + 50, y: y, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: e === 'O' ? '#FF8A80' : e === 'H' ? '#EEF2F8' : '#A9B4C7', text: e }, tb); return [s('text', { x: PX + 140, y: y, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#EEF2F8' }, tb), s('text', { x: PX + 230, y: y, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#EEF2F8' }, tb)]; });
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 360 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'molecules' ? '' : 'none'; B.style.display = st.mode === 'combustion' ? '' : 'none';
      var n = st.n, al = ALK[n], q = eqn(n);
      gen.textContent = 'n = ' + n + ' : ' + formula(n) + ' (' + al.n + ')';
      eq1.textContent = co(q.a, formula(n)) + ' + ' + co(q.b, 'O₂'); eq2.textContent = '→ ' + co(q.c, 'CO₂') + ' + ' + co(q.d, 'H₂O');
      var nC = q.a * n, nH = q.a * (2 * n + 2), nO = 2 * q.b; [[nC, q.c], [nH, 2 * q.d], [nO, 2 * q.c + q.d]].forEach(function (v, k) { cnt[k][0].textContent = v[0]; cnt[k][1].textContent = v[1]; });
      if (st.mode === 'molecules') {
        if (keyA !== n) { keyA = n; build(n); }
        atomsA.setAttribute('opacity', st.fade); bondsA.setAttribute('opacity', st.fade);
        nameT.textContent = al.n.charAt(0).toUpperCase() + al.n.slice(1); formT.textContent = formula(n) + '  ·  ' + n + ' C, ' + (2 * n + 2) + ' H'; useT.textContent = 'utilisation : ' + al.u; stT.textContent = 'à 25 °C : ' + al.e; stT.setAttribute('fill', al.e === 'gaz' ? '#9FD7FF' : '#4FA8FF');
        bottle.style.display = n === 4 || n === 3 ? '' : 'none';
        pset(['Un alcane est un hydrocarbure :', 'il ne contient que des atomes', 'de carbone et d’hydrogène.']);
        res = { n: n };
      } else {
        if (st.t == null && st.run) { st.cp = Math.min(1, st.cp + dt / 3); if (st.cp >= 1) st.run = false; }
        var p = ease(st.cp);
        atB.forEach(function (g, i) { var x = RA[i][1] + (RB[i][1] - RA[i][1]) * p, y = RA[i][2] + (RB[i][2] - RA[i][2]) * p; if (st.cp > 0 && st.cp < 1) { x += Math.sin(T * 9 + i) * 3; y += Math.cos(T * 8 + i) * 3; } g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); });
        while (bondB.firstChild) bondB.removeChild(bondB.firstChild);
        var bs = st.cp < 0.15 ? BA : st.cp > 0.85 ? BB : [], bo = st.cp < 0.15 ? 1 - st.cp / 0.15 : (st.cp - 0.85) / 0.15, P0 = st.cp < 0.15 ? RA : RB;
        bs.forEach(function (b) { s('line', { x1: P0[b[0]][1], y1: P0[b[0]][2], x2: P0[b[1]][1], y2: P0[b[1]][2], stroke: '#C9D2E3', 'stroke-width': 4, opacity: bo }, bondB); });
        flame.setAttribute('opacity', st.cp > 0.05 && st.cp < 0.95 ? 0.85 : 0); flame.setAttribute('transform', 'translate(0 ' + (Math.sin(T * 15) * 2) + ')');
        bMsg.textContent = st.cp <= 0 ? 'Exemple : une molécule de méthane et deux de dioxygène' : st.cp < 1 ? 'Les liaisons se cassent, les atomes se réarrangent…' : 'Il se forme du dioxyde de carbone et de l’eau : les atomes se conservent';
        pset(['Produits : dioxyde de carbone', '(trouble l’eau de chaux) et eau', '(bleuit le sulfate de cuivre anhydre).']);
        res = { cp: st.cp, n: n };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le gaz de la bouteille' }, { t: 8, title: 'Quatre alcanes' }, { t: 24, title: 'La formule générale' }, { t: 32, title: 'Combustion du méthane' }, { t: 46, title: 'Combustion du butane' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Les alcanes : <b>CₙH₂ₙ₊₂</b>', 'des hydrocarbures : seulement du carbone et de l’hydrogène.', '#FFC773'],
      ['Méthane, éthane, propane, <b>butane</b>…', 'CH₄, C₂H₆, C₃H₈, C₄H₁₀ : des combustibles.', '#9FD7FF'],
      ['Combustion complète → <b>CO₂ + H₂O</b>', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O : les atomes se conservent.', '#3DD68C']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.fade = 1;
        if (t < 8) { st.mode = 'molecules'; st.n = 4; }
        else if (t < 24) { st.mode = 'molecules'; var k = Math.min(3, Math.floor((t - 8) / 4)); st.n = k + 1; st.fade = K.k(t, 8 + k * 4, 0.6); }
        else if (t < 32) { st.mode = 'molecules'; st.n = t < 28 ? 5 : 6; st.fade = K.k(t, t < 28 ? 24 : 28, 0.6); }
        else if (t < 46) { st.mode = 'combustion'; st.n = 1; st.cp = K.k(t, 35, 5); }
        else { st.mode = 'molecules'; st.n = 4; st.fade = 1; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Qu’y a-t-il dans la bouteille de gaz ?') || tg.show(t, 8.6, 23.6, 290, 92, ALK[st.n].n + ' : ' + formula(st.n)) || tg.show(t, 24.6, 31.6, 290, 92, 'n = ' + st.n + ' : ' + formula(st.n) + ', liquide') ||
          tg.show(t, 33, 45.6, 290, 92, 'CH₄ + 2 O₂ → CO₂ + 2 H₂O') || tg.show(t, 47, 56.6, 290, 92, '2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : la molécule de butane et une bouteille de gaz ; puis les molécules de méthane, éthane, propane et butane construites avec des atomes de carbone noirs et d’hydrogène blancs ; la formule générale CnH2n+2 avec le pentane et l’hexane ; enfin la combustion d’une molécule de méthane avec deux molécules de dioxygène, dont les atomes se réarrangent en une molécule de dioxyde de carbone et deux molécules d’eau, et l’équation de la combustion du butane',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Le gaz de la bouteille de cuisine est du butane. De quoi est faite sa molécule ?', sub: 'Qu’est-ce que le <b>butane</b> ?' },
      { t: 8, d: 15.6, say: 'Le méthane, CH4, est le plus simple : un atome de carbone et quatre d’hydrogène. Puis l’éthane, C2H6, le propane, C3H8, et le butane, C4H10. Ils ne contiennent que du carbone et de l’hydrogène : ce sont des hydrocarbures, de la famille des alcanes.', sub: 'Méthane, éthane, propane, butane : des <b>alcanes</b>.' },
      { t: 24, d: 7.6, say: 'Avec n atomes de carbone, un alcane possède deux n plus deux atomes d’hydrogène. Le pentane et l’hexane sont liquides.', sub: 'Formule générale : <b>CₙH₂ₙ₊₂</b>.' },
      { t: 32, d: 13.6, say: 'Lors de la combustion complète du méthane, une molécule de méthane réagit avec deux molécules de dioxygène. Les atomes se réarrangent : il se forme une molécule de dioxyde de carbone et deux molécules d’eau. Aucun atome n’a disparu.', sub: '<b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b>' },
      { t: 46, d: 10.6, say: 'Pour le butane : deux C4H10 plus treize O2 donnent huit CO2 et dix H2O. On compte autant d’atomes de chaque sorte des deux côtés.', sub: '2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O.' },
      { t: 57, d: 4.6, say: 'À retenir : les alcanes ont pour formule CnH2n+2.', sub: 'Alcanes : CₙH₂ₙ₊₂.' },
      { t: 61.8, d: 4.2, say: 'Méthane, éthane, propane et butane sont des combustibles.', sub: 'Des combustibles.' },
      { t: 66.2, d: 4.8, say: 'Leur combustion complète produit du dioxyde de carbone et de l’eau.', sub: '→ CO₂ + H₂O.' }
    ],
    learn: [
      { t: 23, ch: 1, html: 'Méthane CH₄, éthane C₂H₆, propane C₃H₈, butane <b>C₄H₁₀</b>.' },
      { t: 31, ch: 2, html: 'Formule générale des alcanes : <b>CₙH₂ₙ₊₂</b>.' },
      { t: 45, ch: 3, html: '<b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b>.' },
      { t: 56, ch: 4, html: 'Une équation est équilibrée : les <b>atomes se conservent</b>.' }
    ],
    question: { q: 'L’alcane à 8 atomes de carbone (octane) a pour formule :', o: ['C₈H₁₆', 'C₈H₁₈', 'C₈H₈', 'C₈H₂₀'], a: 1, e: '2 × 8 + 2 = 18 : C₈H₁₈.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : construire les molécules des alcanes de 1 à 6 atomes de carbone, avec atomes de carbone noirs et d’hydrogène blancs, leur nom, leur formule, leur état et leur utilisation ; puis animer la combustion complète du méthane où les atomes se réarrangent ; à droite, l’équation équilibrée de la combustion de l’alcane choisi et le décompte des atomes',
    steps: [
      'Molécules : change le nombre d’atomes de carbone n.',
      'Vérifie la formule CₙH₂ₙ₊₂ pour chaque alcane.',
      'Combustion : lance la réaction du méthane.',
      'Compte les atomes des réactifs et des produits.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { n: 1 }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'molecules', options: [{ v: 'molecules', l: 'Les molécules' }, { v: 'combustion', l: 'La combustion' }], onChange: function (v) { st.mode = v; vis(); } });
      var sN = c.slider({ label: 'Atomes de carbone n', min: 1, max: 6, step: 1, value: 1, unit: '', dec: 0, onInput: function (v) { st.n = v; } });
      var bG = c.button({ label: 'Lancer la combustion du méthane', primary: true, onClick: function () { st.cp = 0; st.run = true; api.sound('pop'); } });
      function vis() { bG.style.display = st.mode === 'combustion' ? '' : 'none'; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Alcane' }, { k: 'b', label: 'Formule' }]), last = {};
      api.loop(function () { last = lab.step(); ro.a.set(ALK[st.n].n); ro.b.set(formula(st.n)); });
      var M = api.measure; M.innerHTML = '<h3>Mon tableau des alcanes</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tbl = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (rows.some(function (r) { return r.k === st.n; })) { api.say('Déjà relevé : change n.'); return; } var q = eqn(st.n); rows.push({ k: st.n, nm: ALK[st.n].n, f: formula(st.n), e: ALK[st.n].e, eq: co(q.a, formula(st.n)) + ' + ' + co(q.b, 'O₂') + ' → ' + co(q.c, 'CO₂') + ' + ' + co(q.d, 'H₂O') }); rows.sort(function (a, b) { return a.k - b.k; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tbl.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>n</th><th>Nom</th><th>Formule</th><th>État</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.k + '</td><td>' + r.nm + '</td><td>' + r.f + '</td><td>' + r.e + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun alcane relevé.</div>'; api.chart.innerHTML = '<h3>Équations de combustion</h3>' + (rows.length ? '<table class="mt"><tbody>' + rows.map(function (r) { return '<tr><td>' + r.nm + '</td><td>' + r.eq + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Relève des alcanes.</div>'); }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'molecules', n: 1, fade: 1, cp: 0, run: false }); cM.set('molecules'); sN.set(1); vis(); rows = []; paint(); });
      api.say('Fais varier n et relève chaque alcane.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 alcanes.</p>';
        return '<p>Les <b>alcanes</b> sont des <b>hydrocarbures</b> : leurs molécules ne contiennent que des atomes de <b>carbone</b> et d’<b>hydrogène</b>. Leur formule générale est <b>CₙH₂ₙ₊₂</b> : méthane CH₄, éthane C₂H₆, propane C₃H₈, butane C₄H₁₀… Les premiers sont gazeux, les suivants liquides (essence).</p><p>Ce sont des combustibles. Leur <b>combustion complète</b> dans le dioxygène produit du <b>dioxyde de carbone</b> et de l’<b>eau</b> : <b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b> ; 2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O. Dans une équation équilibrée, chaque sorte d’atome est en même nombre des deux côtés.</p><p>Si le dioxygène manque, la combustion est incomplète et produit aussi du carbone (suie) et du monoxyde de carbone, toxique.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Les alcanes' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi des hydrocarbures',
    intro: 'Construis les molécules et équilibre les équations !',
    missions: [
      { title: 'Le gaz du briquet', text: 'Affiche la molécule de <b>butane</b>.', lumi: 'Combien de carbones ?', hint: 'n = 4.',
        build: function (api) { var lab = mini(api, { n: 1 }); api.c.slider({ label: 'n', min: 1, max: 6, step: 1, value: 1, unit: '', dec: 0, onInput: function (v) { lab.st.n = v; } }); return function () { var r = lab.res(); return r.n === 4 ? { ok: true, msg: 'Butane : C₄H₁₀.' } : { ok: false, msg: 'C’est le ' + ALK[r.n].n + '.' }; }; },
        e: 'Le butane a 4 atomes de carbone.' },
      { title: '14 hydrogènes', text: 'Trouve l’alcane qui possède <b>14 atomes d’hydrogène</b>.', lumi: '2n + 2 = 14.', hint: 'n = 6.',
        build: function (api) { var lab = mini(api, { n: 1 }); api.c.slider({ label: 'n', min: 1, max: 6, step: 1, value: 1, unit: '', dec: 0, onInput: function (v) { lab.st.n = v; } }); return function () { var r = lab.res(); return r.n === 6 ? { ok: true, msg: 'Hexane : C₆H₁₄.' } : { ok: false, msg: formula(r.n) + ' : ' + (2 * r.n + 2) + ' H.' }; }; },
        e: '2 × 6 + 2 = 14.' },
      { title: 'Réarrangement', text: 'Réalise la combustion du méthane jusqu’au bout.', lumi: 'Lance la réaction.', hint: 'Bouton « Lancer ».',
        build: function (api) { var lab = mini(api, { mode: 'combustion', n: 1 }); api.c.button({ label: 'Lancer la combustion', sm: true, onClick: function () { lab.st.cp = 0; lab.st.run = true; } }); return function () { var r = lab.res(); return r.cp >= 1 ? { ok: true, msg: '1 CO₂ et 2 H₂O : 1 C, 4 H, 4 O de chaque côté.' } : { ok: false, msg: 'La réaction n’est pas terminée.' }; }; },
        e: 'Les atomes se conservent.' },
      { type: 'qcm', title: 'Équilibrer', text: 'C₃H₈ + 5 O₂ → 3 CO₂ + … H₂O', o: ['2', '3', '4', '8'], a: 2, hint: '8 atomes H à gauche.', e: '8 H → 4 H₂O.' },
      { type: 'qcm', title: 'Les produits', text: 'Le dioxyde de carbone produit par la combustion se reconnaît car il :', o: ['bleuit le sulfate de cuivre', 'trouble l’eau de chaux', 'rallume une bûchette', 'aboie à la flamme'], a: 1, hint: 'Test de l’eau de chaux.', e: 'Il trouble l’eau de chaux.' }
    ]
  };

  S.start({
    inquiry: {"situation": "La classe compare plusieurs molécules d’alcanes. Comment prévoir le nombre d’atomes d’hydrogène à partir du nombre d’atomes de carbone ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-alcanes', level: '3e', theme: 'Les réactions chimiques', title: 'Les alcanes', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Les <b>alcanes</b> sont des <b>hydrocarbures</b> : leurs molécules ne contiennent que des atomes de carbone et d’hydrogène.',
      'Formule générale : <b>CₙH₂ₙ₊₂</b>. Méthane <b>CH₄</b>, éthane <b>C₂H₆</b>, propane <b>C₃H₈</b>, butane <b>C₄H₁₀</b> (gaz) ; à partir de n = 5, ils sont liquides (essence).',
      'Les alcanes sont des <b>combustibles</b> (gaz naturel, bouteille de gaz, essence).',
      'Combustion complète : alcane + dioxygène → <b>dioxyde de carbone + eau</b>. Exemple : <b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b> ; 2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O.',
      'Dans une équation-bilan équilibrée, les <b>atomes se conservent</b> : même nombre de chaque sorte d’atome dans les réactifs et dans les produits.'
    ],
    quiz: [
      { q: 'Un alcane contient seulement des atomes :', o: ['de carbone et d’oxygène', 'de carbone et d’hydrogène', 'd’hydrogène et d’oxygène', 'de carbone seulement'], a: 1, e: 'C et H : un hydrocarbure.' },
      { q: 'La formule du propane est :', o: ['C₃H₆', 'C₃H₈', 'C₄H₁₀', 'CH₄'], a: 1, e: '2 × 3 + 2 = 8.' },
      { q: 'La combustion complète d’un alcane produit :', o: ['du carbone et de l’eau', 'du dioxyde de carbone et de l’eau', 'du dihydrogène', 'du monoxyde de carbone seulement'], a: 1, e: 'CO₂ + H₂O.' },
      { q: 'Dans CH₄ + 2 O₂ → CO₂ + 2 H₂O, combien d’atomes d’oxygène de chaque côté ?', o: ['2', '3', '4', '6'], a: 2, e: '2 × 2 = 4 à gauche ; 2 + 2 = 4 à droite.' },
      { q: 'Le gaz de la bouteille B12 est principalement :', o: ['le méthane', 'le butane', 'le dioxygène', 'l’hexane'], a: 1, e: 'Le butane, C₄H₁₀.' }
    ]
  });
})();

