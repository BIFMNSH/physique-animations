/* 3e · Mécanique · Leçon : Énergie mécanique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var G10 = 10;
  /* chute verticale avec frottement de l’air éventuel (a = g − k v) */
  function fall(h, k, t) { var y = h, v = 0, dt = 0.005, tt = 0, lost = 0; while (tt < t - 1e-9 && y > 0) { var a = G10 - k * v; v += a * dt; y -= v * dt; tt += dt; } if (y < 0) y = 0; return { y: y, v: v, landed: y <= 0 }; }
  function Lab(G, o) {
    var st = Object.assign({ mode: 'chute', h: 5, m: 0.4, fr: false, tc: 0, run: false, tp: 0, H: 4, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 392, width: 500, height: 54, fill: '#2F5D3A' }, G);
    /* ---------- CHUTE ---------- */
    var A = s('g', {}, G), AX = 250, Y0 = 392;
    var tree = s('g', {}, A), trunk = s('rect', { x: 120, width: 26, fill: '#6B4526' }, tree), can1 = s('ellipse', { cx: 150, rx: 104, ry: 62, fill: '#2F7D4F' }, tree), can2 = s('ellipse', { cx: 196, rx: 58, ry: 42, fill: '#3A9A60' }, tree);
    var ruler = s('g', {}, A), rT = [];
    var trail = s('g', {}, A), fruit = s('g', {}, A); s('path', { d: 'M0 -14 q16 0 14 14 q-2 16 -14 16 q-14 0 -15 -14 q-1 -16 15 -16z', fill: '#FFB547', stroke: '#C7781E', 'stroke-width': 1.5 }, fruit); s('path', { d: 'M0 -14 q-2 -8 4 -10', stroke: '#2F7D4F', 'stroke-width': 2.5, fill: 'none' }, fruit);
    var vArr = s('path', { stroke: '#FF9A3E', 'stroke-width': 4, fill: 'none' }, A), vT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#FFB547' }, A), hT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#80C8FF' }, A);
    var aMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- PISTE ---------- */
    var B = s('g', {}, G), BX = 290, XW = 200, PYB = 380, PPM = 60;
    var track = s('path', { fill: 'none', stroke: '#9AA6BC', 'stroke-width': 8, 'stroke-linecap': 'round' }, B); (function () { var d = ''; for (var i = 0; i <= 60; i++) { var x = -XW + 2 * XW * i / 60, y = PYB - 4.6 * PPM * (x / XW) * (x / XW); d += (i ? 'L' : 'M') + (BX + x).toFixed(1) + ' ' + y.toFixed(1); } track.setAttribute('d', d); })();
    var heat = s('g', {}, B), HT = []; for (var i = 0; i < 12; i++) HT.push(s('path', { d: 'M0 0 q4 -6 0 -12 q-4 -6 0 -12', stroke: '#FF6B5E', 'stroke-width': 2, fill: 'none' }, heat));
    var ball = s('circle', { r: 16, fill: '#E5484D', stroke: '#8A1F24', 'stroke-width': 2 }, B), lvl = s('line', { stroke: '#80C8FF', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }, B), lvlT = s('text', { 'font-size': 12, 'font-weight': 800, fill: '#80C8FF', 'text-anchor': 'end' }, B);
    var bMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'ÉNERGIES (en joules)' }, P);
    var BY = 250, BH = 170, cols = [['Ep', '#4FA8FF', PX + 50], ['Ec', '#FF9A3E', PX + 120], ['Em', '#3DD68C', PX + 190]];
    s('line', { x1: PX + 26, x2: PX + 254, y1: BY, y2: BY, stroke: '#7D89A3', 'stroke-width': 2 }, P);
    var bars = cols.map(function (c) { var r = s('rect', { x: c[2], width: 44, rx: 5, fill: c[1] }, P), v = s('text', { x: c[2] + 22, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: c[1] }, P); s('text', { x: c[2] + 22, y: BY + 20, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: c[1], text: c[0] }, P); return { r: r, v: v }; });
    var em0 = s('line', { x1: PX + 30, x2: PX + 250, stroke: '#3DD68C', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, P);
    var fm = [['Ep = m × g × h', '#80C8FF'], ['Ec = ½ × m × v²', '#FFB547'], ['Em = Ec + Ep', '#3DD68C']].map(function (f, k) { return s('text', { x: PX + 140, y: 300 + k * 26, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: f[1], text: f[0] }, P); });
    var pq = [0, 1].map(function (k) { return s('text', { x: PX + 140, y: 392 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function setBars(Ep, Ec, Em, ref) { var sc = BH / Math.max(1, ref); [Ep, Ec, Em].forEach(function (v, k) { var h = Math.max(0, v) * sc; attr(bars[k].r, { y: BY - h, height: h }); attr(bars[k].v, { y: BY - h - 6, text: fmt(v, v < 10 ? 1 : 0) }); }); attr(em0, { y1: BY - ref * sc, y2: BY - ref * sc }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'chute' ? '' : 'none'; B.style.display = st.mode === 'piste' ? '' : 'none';
      if (st.mode === 'chute') {
        var PPMa = Math.min(30, 300 / st.h), k = st.fr ? 0.9 : 0;
        if (st.t == null && st.run) st.tc += dt * 0.5; /* ralenti × 0,5 */
        var f = fall(st.h, k, st.tc); if (f.landed && st.t == null) st.run = false;
        while (ruler.firstChild) ruler.removeChild(ruler.firstChild);
        var stepM = st.h > 10 ? 5 : 1; for (var mm = 0; mm <= st.h; mm += stepM) { var yy = Y0 - mm * PPMa; s('line', { x1: AX + 60, x2: AX + 72, y1: yy, y2: yy, stroke: '#7D89A3', 'stroke-width': 1.5 }, ruler); s('text', { x: AX + 78, y: yy + 4, 'font-size': 10.5, fill: '#A9B4C7', text: mm + ' m' }, ruler); }
        s('line', { x1: AX + 66, x2: AX + 66, y1: Y0, y2: Y0 - st.h * PPMa, stroke: '#7D89A3', 'stroke-width': 1.5 }, ruler);
        var fy = Y0 - 16 - f.y * PPMa; fruit.setAttribute('transform', 'translate(' + AX + ' ' + fy + ')');
        var vl = Math.min(90, f.v * 5); vArr.setAttribute('d', f.v > 0.3 && !f.landed ? 'M' + (AX - 30) + ' ' + fy + ' v' + vl + ' m-6 -10 l6 10 l6 -10' : ''); attr(vT, { x: AX - 40, y: fy + vl / 2, 'text-anchor': 'end', text: f.v > 0.3 ? 'v = ' + fmt(f.v, 1) + ' m/s' : '' });
        attr(hT, { x: AX + 26, y: fy + 4, text: 'h = ' + fmt(f.y, 1) + ' m' });
        var ty = Y0 - 16 - st.h * PPMa; attr(trunk, { y: ty, height: Y0 - ty }); attr(can1, { cy: ty - 30 }); attr(can2, { cy: ty - 52 });
        var Ep = st.m * G10 * f.y, Ec = 0.5 * st.m * f.v * f.v, Em = Ep + Ec, Em0 = st.m * G10 * st.h; setBars(Ep, Ec, Em, Em0);
        aMsg.textContent = st.tc <= 0 ? 'Mangue de ' + fmt(st.m, 1) + ' kg à ' + st.h + ' m de hauteur : Ec = 0' : f.landed ? 'Au sol : v = ' + fmt(f.v, 1) + ' m/s' + (st.fr ? ' (frottements : Em a diminué)' : ', Ep a été transformée en Ec') : 'Elle tombe : Ep diminue, Ec augmente';
        pq[0].textContent = st.fr ? 'Avec frottements, une partie de Em' : 'Sans frottements, Em reste constante :'; pq[1].textContent = st.fr ? 'se transforme en chaleur.' : 'Ep se transforme en Ec.';
        res = { Ep: Ep, Ec: Ec, Em: Em, Em0: Em0, v: f.v, landed: f.landed, y: f.y };
      } else {
        if (st.t == null && st.run) st.tp += dt;
        var lam = st.fr ? 0.12 : 0, Hh = st.H * Math.exp(-lam * st.tp), w = 2 * Math.PI / 3, xa = XW * Math.sqrt(Hh / 4.6), x = -xa * Math.cos(w * st.tp), y = 4.6 * (x / XW) * (x / XW);
        var bx = BX + x, by = PYB - y * PPM, cc = 4.6 * PPM / (XW * XW), nn = Math.sqrt(1 + 4 * cc * cc * x * x); attr(ball, { cx: bx - 20 * 2 * cc * x / nn, cy: by - 20 / nn });
        
        attr(lvl, { x1: 60, x2: 520, y1: PYB - st.H * PPM, y2: PYB - st.H * PPM }); attr(lvlT, { x: 520, y: PYB - st.H * PPM - 6, text: 'hauteur de départ' });
        HT.forEach(function (p, k2) { var ph = (T * 0.8 + k2 / 12) % 1; p.style.display = st.fr && st.tp > 0 ? '' : 'none'; p.setAttribute('transform', 'translate(' + (BX - XW + k2 * XW * 2 / 11) + ' ' + (PYB - 4.6 * PPM * Math.pow((k2 / 5.5 - 1), 2) - 4 - ph * 20) + ')'); p.setAttribute('opacity', 1 - ph); });
        var m = st.m, Em2 = m * G10 * Hh, Ep2 = m * G10 * y, Ec2 = Math.max(0, Em2 - Ep2); setBars(Ep2, Ec2, Em2, m * G10 * st.H);
        bMsg.textContent = st.tp === 0 ? 'Bille lâchée sans vitesse en haut de la piste' : st.fr ? 'Frottements : la bille remonte de moins en moins haut' : 'Sans frottements : elle remonte toujours à la même hauteur';
        pq[0].textContent = 'En bas : Ep minimale, Ec maximale.'; pq[1].textContent = 'En haut : Ec nulle, Ep maximale.';
        res = { Em: Em2, Em0: m * G10 * st.H, Ep: Ep2, Ec: Ec2, tp: st.tp };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La mangue qui tombe' }, { t: 8, title: 'L’énergie potentielle' }, { t: 18, title: 'L’énergie cinétique' }, { t: 30, title: 'L’énergie mécanique' }, { t: 40, title: 'Les frottements' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Énergie potentielle <b>Ep = m g h</b>', 'liée à la hauteur ; énergie cinétique <b>Ec = ½ m v²</b>, liée à la vitesse.', '#80C8FF'],
      ['Énergie mécanique <b>Em = Ec + Ep</b>', 'sans frottements, elle se conserve.', '#3DD68C'],
      ['Avec frottements, Em <b>diminue</b>', 'une partie se transforme en chaleur.', '#FF8A80']], [57.2, 61.8, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.m = 0.4; st.h = 5; st.fr = false;
        if (t < 18) { st.mode = 'chute'; st.tc = 0; }
        else if (t < 30) { st.mode = 'chute'; st.tc = Math.max(0, (t - 19.5) * 0.25); }
        else if (t < 40) { st.mode = 'chute'; st.tc = Math.max(0, (t - 31) * 0.3); }
        else if (t < 48) { st.mode = 'piste'; st.H = 4; st.fr = false; st.tp = Math.max(0, t - 40.5); }
        else { st.mode = 'piste'; st.H = 4; st.fr = true; st.tp = Math.max(0, (t - 48.2) * 1.8); }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Mangue de 0,4 kg à 5 m') || tg.show(t, 9, 17.6, 290, 92, 'Ep = 0,4 × 10 × 5 = 20 J') || tg.show(t, 20, 29.6, 290, 92, 'Au sol : Ec = ½ × 0,4 × 10² = 20 J') ||
          tg.show(t, 31, 39.6, 290, 92, 'Ep + Ec = 20 J à chaque instant') || tg.show(t, 41, 47.6, 290, 92, 'Sans frottements : même hauteur') || tg.show(t, 48.5, 56.6, 290, 92, 'Frottements : Em diminue');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une mangue de 0,4 kg accrochée à 5 m dans un manguier, avec des barres d’énergie potentielle, cinétique et mécanique ; elle tombe et son énergie potentielle de 20 J se transforme en énergie cinétique, l’énergie mécanique restant égale à 20 J ; puis une bille sur une piste en U qui remonte toujours à la même hauteur sans frottements, et de moins en moins haut avec frottements',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Une mangue de quatre cents grammes est accrochée à cinq mètres de hauteur. Quand elle tombe, elle peut faire mal ! Quelle énergie possède-t-elle ?', sub: 'Quelle <b>énergie</b> possède la mangue ?' },
      { t: 8, d: 9.6, say: 'Grâce à sa hauteur, elle possède une énergie potentielle de pesanteur : m fois g fois h, soit vingt joules. Immobile, son énergie cinétique est nulle.', sub: '<b>Ep = m × g × h</b> = 20 J ; Ec = 0.' },
      { t: 18, d: 11.6, say: 'Elle tombe : sa hauteur diminue, sa vitesse augmente. L’énergie potentielle se transforme en énergie cinétique, un demi de m v carré. Au sol, à dix mètres par seconde, Ec vaut vingt joules.', sub: '<b>Ec = ½ × m × v²</b> = 20 J au sol.' },
      { t: 30, d: 9.6, say: 'La somme des deux est l’énergie mécanique. Sans frottements, elle reste constante : vingt joules à chaque instant de la chute.', sub: '<b>Em = Ec + Ep</b> reste constante.' },
      { t: 40, d: 8, say: 'Sur une piste sans frottements, la bille lâchée en haut remonte toujours à la même hauteur : l’énergie se conserve.', sub: 'Sans frottements : <b>conservation</b>.' },
      { t: 48, d: 8.6, say: 'Avec des frottements, elle remonte de moins en moins haut : une partie de l’énergie mécanique se transforme en chaleur.', sub: 'Frottements : Em diminue (chaleur).' },
      { t: 57, d: 4.6, say: 'À retenir : Ep égale m g h, et Ec égale un demi de m v carré.', sub: 'Ep = m g h ; Ec = ½ m v².' },
      { t: 61.8, d: 4, say: 'L’énergie mécanique est leur somme ; sans frottements, elle se conserve.', sub: 'Em = Ec + Ep.' },
      { t: 66, d: 5, say: 'Avec frottements, elle diminue.', sub: 'Frottements : Em diminue.' }
    ],
    learn: [
      { t: 17, ch: 1, html: 'Énergie potentielle de pesanteur : <b>Ep = m × g × h</b>.' },
      { t: 29, ch: 2, html: 'Énergie cinétique : <b>Ec = ½ × m × v²</b>.' },
      { t: 39, ch: 3, html: 'Sans frottements, <b>Em = Ec + Ep</b> se conserve.' },
      { t: 56, ch: 4, html: 'Avec frottements, Em diminue : elle devient de la <b>chaleur</b>.' }
    ],
    question: { q: 'Une voiture de 1 000 kg roule à 10 m/s. Son énergie cinétique est :', o: ['10 000 J', '50 000 J', '100 000 J', '5 000 J'], a: 1, e: 'Ec = ½ × 1 000 × 10² = 50 000 J.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [40, 40, 500, 406] }, { n: 'Énergies', r: [560, 22, 280, 424] }],
    alt: 'Deux activités : une mangue qui tombe d’un manguier depuis une hauteur réglable, avec ou sans frottements de l’air, et les barres d’énergie potentielle, cinétique et mécanique ; puis une bille qui oscille sur une piste en U, avec ou sans frottements',
    steps: [
      'Chute : lâche la mangue et observe les barres d’énergie.',
      'Change la hauteur ou la masse : que devient Ep ?',
      'Ajoute les frottements de l’air : que devient Em ?',
      'Piste : compare avec et sans frottements.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'chute', options: [{ v: 'chute', l: 'Chute de la mangue' }, { v: 'piste', l: 'Bille sur la piste' }], onChange: function (v) { st.mode = v; st.run = false; st.tc = 0; st.tp = 0; vis(); } });
      var sh = c.slider({ label: 'Hauteur', min: 2, max: 20, step: 1, value: 5, unit: 'm', dec: 0, onInput: function (v) { st.h = v; st.tc = 0; st.run = false; } });
      var sm = c.slider({ label: 'Masse', min: 0.2, max: 1, step: 0.1, value: 0.4, unit: 'kg', dec: 1, onInput: function (v) { st.m = v; st.tc = 0; st.tp = 0; st.run = false; } });
      var sH = c.slider({ label: 'Hauteur de départ', min: 1, max: 4.5, step: 0.5, value: 4, unit: 'm', dec: 1, onInput: function (v) { st.H = v; st.tp = 0; st.run = false; } });
      var tF = c.toggle({ label: 'Frottements', value: false, onChange: function (v) { st.fr = v; st.tc = 0; st.tp = 0; st.run = false; } });
      var bL = c.button({ label: 'Lâcher', primary: true, onClick: function () { st.tc = 0; st.tp = 0; st.run = true; api.sound('tick'); } });
      var bP = c.button({ label: 'Pause / reprendre', sm: true, onClick: function () { st.run = !st.run; } });
      function vis() { var ch = st.mode === 'chute'; sh.hide(!ch); sH.hide(ch); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Ep' }, { k: 'b', label: 'Ec' }, { k: 'c', label: 'Em' }]), last = {};
      api.loop(function () { last = lab.step(); ro.a.set(fmt(last.Ep, 1) + ' J'); ro.b.set(fmt(last.Ec, 1) + ' J'); ro.c.set(fmt(last.Em, 1) + ' J'); });
      var M = api.measure; M.innerHTML = '<h3>Mes relevés</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ e: (st.mode === 'chute' ? 'chute, h = ' + fmt(last.y, 1) + ' m' : 'piste') + (st.fr ? ', frottements' : ''), p: fmt(last.Ep, 1), c: fmt(last.Ec, 1), m: fmt(last.Em, 1) }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Instant</th><th>Ep (J)</th><th>Ec (J)</th><th>Em (J)</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.p + '</td><td>' + r.c + '</td><td>' + r.m + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>'; api.chart.innerHTML = '<h3>Les formes d’énergie mécanique</h3><table class="mt"><thead><tr><th>Énergie</th><th>Formule</th><th>Dépend de</th></tr></thead><tbody><tr><td>potentielle Ep</td><td>m × g × h</td><td>la hauteur</td></tr><tr><td>cinétique Ec</td><td>½ × m × v²</td><td>la vitesse</td></tr><tr><td>mécanique Em</td><td>Ec + Ep</td><td>constante sans frottements</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'chute', h: 5, m: 0.4, fr: false, tc: 0, run: false, tp: 0, H: 4 }); cM.set('chute'); sh.set(5); sm.set(0.4); sH.set(4); tF.set(false); vis(); rows = []; paint(); });
      api.say('Appuie sur « Lâcher ».');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 instants.</p>';
        return '<p>Un corps en hauteur possède une <b>énergie potentielle de pesanteur</b> <b>Ep = m × g × h</b>. Un corps en mouvement possède une <b>énergie cinétique</b> <b>Ec = ½ × m × v²</b> (m en kg, v en m/s, Ec en J).</p><p>L’<b>énergie mécanique</b> est leur somme : <b>Em = Ec + Ep</b>. Pendant une chute, Ep se transforme en Ec. En l’absence de frottements, Em <b>se conserve</b>.</p><p>Avec des frottements, Em <b>diminue</b> : une partie se transforme en <b>chaleur</b>. Dans un barrage hydroélectrique (Kossou, Soubré), l’énergie potentielle de l’eau devient énergie cinétique puis électrique.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Énergie mécanique' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du manguier',
    intro: 'Hauteur, vitesse, énergie : maîtrise la chute !',
    missions: [
      { title: '40 J en haut', text: 'Règle hauteur et masse pour que la mangue ait <span style="color:#80C8FF">Ep = 40 J</span> avant de tomber.', lumi: 'Ep = m × 10 × h.', hint: '0,4 kg à 10 m, ou 0,5 kg à 8 m…',
        build: function (api) { var lab = mini(api, { h: 2, m: 0.2 }); api.c.slider({ label: 'Hauteur', min: 2, max: 20, step: 1, value: 2, unit: 'm', dec: 0, onInput: function (v) { lab.st.h = v; lab.st.tc = 0; } }); api.c.slider({ label: 'Masse', min: 0.2, max: 1, step: 0.1, value: 0.2, unit: 'kg', dec: 1, onInput: function (v) { lab.st.m = v; lab.st.tc = 0; } }); return function () { var r = lab.res(); return Math.abs(r.Em0 - 40) < 0.01 ? { ok: true, msg: 'Ep = 40 J.' } : { ok: false, msg: 'Ep = ' + fmt(r.Em0, 1) + ' J.' }; }; },
        e: 'm × h = 4.' },
      { type: 'qcm', title: 'Au sol', text: 'Sans frottements, une mangue lâchée avec Ep = 20 J arrive au sol avec :', o: ['Ec = 0 J', 'Ec = 10 J', 'Ec = 20 J', 'Ec = 40 J'], a: 2, hint: 'Em se conserve.', e: 'Toute l’Ep devient Ec : 20 J.' },
      { title: 'L’énergie perdue', text: 'Fais tomber la mangue <b>avec frottements</b> jusqu’au sol et observe Em.', lumi: 'Active les frottements, puis lâche.', hint: 'Frottements : Oui, puis « Lâcher ».',
        build: function (api) { var lab = mini(api, { h: 10 }); api.c.toggle({ label: 'Frottements', value: false, onChange: function (v) { lab.st.fr = v; lab.st.tc = 0; lab.st.run = false; } }); api.c.button({ label: 'Lâcher', sm: true, onClick: function () { lab.st.tc = 0; lab.st.run = true; } }); return function () { var r = lab.res(); return r.landed && r.Em < r.Em0 - 1 ? { ok: true, msg: 'Em = ' + fmt(r.Em, 1) + ' J < ' + fmt(r.Em0, 0) + ' J : le reste est devenu chaleur.' } : { ok: false, msg: r.landed ? 'Sans frottements, Em reste ' + fmt(r.Em0, 0) + ' J.' : 'Laisse-la tomber jusqu’au sol.' }; }; },
        e: 'Les frottements transforment une partie de Em en chaleur.' },
      { type: 'qcm', title: 'Vitesse double', text: 'Si la vitesse d’un objet double, son énergie cinétique est :', o: ['doublée', 'multipliée par 4', 'divisée par 2', 'inchangée'], a: 1, hint: 'v est au carré.', e: '(2v)² = 4v² : Ec × 4.' },
      { type: 'qcm', title: 'Barrage', text: 'Dans le barrage de Kossou, l’eau du lac en hauteur possède surtout de l’énergie :', o: ['cinétique', 'potentielle de pesanteur', 'chimique', 'nucléaire'], a: 1, hint: 'Elle est en hauteur.', e: 'Énergie potentielle, transformée en énergie électrique.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un objet change de hauteur et de vitesse dans le modèle. Comment évoluent ses énergies cinétique, potentielle et mécanique ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-energie-mecanique', level: '3e', theme: 'Mécanique', title: 'Énergie mécanique', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un corps situé à une hauteur h possède une <b>énergie potentielle de pesanteur</b> : <b>Ep = m × g × h</b> (en joules).',
      'Un corps de masse m animé d’une vitesse v possède une <b>énergie cinétique</b> : <b>Ec = ½ × m × v²</b> (m en kg, v en m/s, Ec en J).',
      'L’<b>énergie mécanique</b> d’un corps est la somme : <b>Em = Ec + Ep</b>.',
      'Au cours d’une chute, l’énergie potentielle se transforme en énergie cinétique. <b>Sans frottements, l’énergie mécanique se conserve</b>.',
      'Avec des frottements, l’énergie mécanique <b>diminue</b> : une partie se transforme en <b>chaleur</b>.'
    ],
    quiz: [
      { q: 'L’énergie potentielle de pesanteur dépend :', o: ['de la vitesse', 'de la hauteur', 'de la couleur', 'de la température'], a: 1, e: 'Ep = m g h.' },
      { q: 'Un objet de 2 kg à 3 m de hauteur (g = 10 N/kg) a Ep =', o: ['6 J', '60 J', '30 J', '600 J'], a: 1, e: '2 × 10 × 3 = 60 J.' },
      { q: 'Un ballon de 0,5 kg à 4 m/s a Ec =', o: ['1 J', '2 J', '4 J', '8 J'], a: 2, e: '½ × 0,5 × 16 = 4 J.' },
      { q: 'Sans frottements, pendant la chute :', o: ['Em augmente', 'Em diminue', 'Em reste constante', 'Ec diminue'], a: 2, e: 'Em se conserve.' },
      { q: 'Avec frottements, l’énergie mécanique perdue devient :', o: ['de la masse', 'de la chaleur', 'du poids', 'de la lumière seulement'], a: 1, e: 'De la chaleur.' }
    ]
  });
})();

