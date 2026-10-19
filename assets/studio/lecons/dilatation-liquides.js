/* 5e · Propriétés physiques de la matière · Leçon : Dilatation des liquides */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var LIQ = { eau: { n: 'eau colorée', b: 2.1e-4, c: '#4FA8FF' }, alcool: { n: 'alcool', b: 1.1e-3, c: '#E5484D' }, huile: { n: 'huile', b: 7e-4, c: '#F2C94C' } };
  var KH = 1800, H0 = 70;
  function rise(l, T) { return KH * LIQ[l].b * (T - 20); }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'compare', T: 20, one: 'eau', sel: null, tTher: 20, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* bain-marie commun */
    var BM = s('g', {}, G), plate = s('rect', { x: 90, y: 404, width: 400, height: 18, rx: 5 }, BM), plateG = s('rect', { x: 90, y: 396, width: 400, height: 34, rx: 12, fill: TK.glow(G, '#FF5A2E'), opacity: 0 }, BM);
    var bath = s('rect', { x: 104, y: 300, width: 372, height: 100, fill: '#5FA8E8' }, BM); s('path', { d: 'M100 270 V398 q0 6 6 6 H474 q6 0 6 -6 V270', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, BM);
    var ice = s('g', {}, BM), IC = [0, 1, 2, 3, 4].map(function (i) { return s('rect', { x: 120 + i * 72, y: 302, width: 22, height: 18, rx: 4, fill: '#E8F4FF', opacity: 0.85, transform: 'rotate(' + (i * 17 - 20) + ' ' + (131 + i * 72) + ' 311)' }, ice); });
    var steam = [0, 1, 2, 3].map(function () { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2, fill: 'none' }, BM); });
    s('text', { x: 290, y: 442, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'bain-marie' }, BM);
    /* ballons à tube */
    function flaskTube(g, x, col, label) {
      var o2 = { g: s('g', {}, g) }; o2.liq = s('circle', { cx: x, cy: 330, r: 40, fill: col, opacity: 0.85 }, o2.g); s('circle', { cx: x, cy: 330, r: 42, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, o2.g);
      s('rect', { x: x - 10, y: 280, width: 20, height: 20, fill: col, opacity: 0.85 }, o2.g);
      o2.tube = s('rect', { x: x - 5, y: 80, width: 10, height: 210, rx: 3, fill: '#0B1220', stroke: '#BFE6FF', 'stroke-width': 2 }, o2.g);
      o2.col = s('rect', { x: x - 3, width: 6, fill: col }, o2.g);
      for (var k = 0; k <= 10; k++) { var yy = 290 - 20 - k * 18; s('line', { x1: x + 8, x2: x + (k % 5 ? 14 : 20), y1: yy, y2: yy, stroke: '#7D89A3', 'stroke-width': 1.2 }, o2.g); }
      o2.mark = s('path', { d: 'M' + (x - 22) + ' ' + (290 - H0) + ' h12', stroke: '#3DD68C', 'stroke-width': 3 }, o2.g); s('text', { x: x - 26, y: 290 - H0 + 4, 'text-anchor': 'end', 'font-size': 10, 'font-weight': 800, fill: '#3DD68C', text: 'repère' }, o2.g);
      o2.lab = s('text', { x: x, y: 64, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: col, text: label }, o2.g);
      o2.sel = s('rect', { x: x - 54, y: 46, width: 108, height: 336, rx: 14, fill: 'none', stroke: '#FFB547', 'stroke-width': 3, opacity: 0 }, o2.g);
      o2.hit = s('rect', { x: x - 54, y: 46, width: 108, height: 336, fill: 'transparent', style: 'cursor:pointer' }, o2.g);
      o2.set = function (h) { attr(o2.col, { y: 290 - h, height: h }); };
      return o2;
    }
    var CMP = s('g', {}, G), F3 = ['eau', 'alcool', 'huile'].map(function (k, i) { var f = flaskTube(CMP, 170 + i * 120, LIQ[k].c, LIQ[k].n); f.hit.addEventListener('click', function () { st.sel = k; o.onSel && o.onSel(k); }); return f; });
    var ONE = s('g', {}, G), F1 = flaskTube(ONE, 290, LIQ.eau.c, 'eau colorée');
    /* thermomètre à alcool */
    var TH = s('g', {}, G);
    s('rect', { x: 282, y: 60, width: 26, height: 300, rx: 13, fill: '#EEF2F8', stroke: '#C9D2E3', 'stroke-width': 2 }, TH); s('circle', { cx: 295, cy: 368, r: 20, fill: '#E5484D', stroke: '#C9D2E3', 'stroke-width': 2 }, TH);
    var tcol = s('rect', { x: 291, width: 8, rx: 4, fill: '#E5484D' }, TH);
    for (var g2 = -10; g2 <= 110; g2 += 10) { var yy = 344 - (g2 + 10) * 2.3; s('line', { x1: 310, x2: g2 % 50 === 0 ? 330 : 322, y1: yy, y2: yy, stroke: '#3A4560', 'stroke-width': g2 % 50 === 0 ? 2 : 1.2 }, TH); if (g2 % 20 === 0) s('text', { x: 336, y: yy + 4, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: g2 }, TH); }
    var tLab = s('text', { x: 190, y: 200, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: '#FFC773' }, TH);
    s('text', { x: 190, y: 228, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7', text: 'lecture du thermomètre' }, TH);
    var tRem = [s('text', { x: 450, y: 150, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, TH), s('text', { x: 450, y: 168, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, TH), s('text', { x: 450, y: 186, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, TH)];
    var msg = s('text', { x: 290, y: 30, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3', style: 'display:none' }, G);
    /* panneau */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var th = TK.thermometer(P, PX + 40, 70, 180, 0, 100);
    var pv = s('text', { x: PX + 178, y: 90, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), pl = [0, 1, 2].map(function (k) { return s('text', { x: PX + 178, y: 124 + k * 30, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900 }, P); });
    var pv3 = s('text', { x: PX + 150, y: 284, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7' }, P);
    s('text', { x: PX + 20, y: 300, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lp = TK.particles(P, PX + 20, 304, 240, 132, 'liquide', '#4FA8FF');
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, Tb = st.mode === 'thermo' ? st.tTher : st.T, res = {};
      CMP.style.display = st.mode === 'compare' ? '' : 'none'; ONE.style.display = st.mode === 'one' ? '' : 'none'; TH.style.display = st.mode === 'thermo' ? '' : 'none';
      var hk = Math.max(0, (Tb - 20) / 70), ck = Math.max(0, (20 - Tb) / 20);
      plate.setAttribute('fill', TK.mixc('#5B6680', '#FF5A2E', hk)); plateG.setAttribute('opacity', hk * 0.8);
      bath.setAttribute('fill', TK.mixc('#5FA8E8', '#8FC3F0', ck)); ice.style.display = Tb < 12 ? '' : 'none';
      steam.forEach(function (sm, i) { var ph = ((T * 0.8 + i / 4) % 1); sm.style.display = Tb > 55 ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (140 + i * 100) + ' ' + (296 - ph * 50) + ')'); sm.setAttribute('opacity', (1 - ph) * Math.min(1, (Tb - 55) / 20)); });
      if (st.mode === 'compare') {
        var H = {}; ['eau', 'alcool', 'huile'].forEach(function (k, i) { H[k] = H0 + rise(k, Tb); F3[i].set(H[k]); F3[i].sel.setAttribute('opacity', st.sel === k ? 1 : 0); });
        msg.textContent = Tb > 22 ? 'Les trois liquides montent… mais pas de la même hauteur' : Tb < 18 ? 'Refroidis, les liquides descendent sous le repère' : 'Trois liquides, même volume, même température';
        pv.textContent = 'MONTÉE DANS LE TUBE'; ['eau', 'alcool', 'huile'].forEach(function (k, i) { pl[i].textContent = LIQ[k].n + ' : ' + (rise(k, Tb) >= 0 ? '+' : '') + fmt(rise(k, Tb) / 18, 1) + ' gr.'; pl[i].setAttribute('fill', LIQ[k].c); });
        pv3.textContent = 'gr. = graduations au-dessus du repère';
        res = { H: H, sel: st.sel, T: Tb };
      } else if (st.mode === 'one') {
        var h = H0 + rise(st.one, Tb); F1.set(h); F1.liq.setAttribute('fill', LIQ[st.one].c); F1.col.setAttribute('fill', LIQ[st.one].c); F1.lab.textContent = LIQ[st.one].n; F1.lab.setAttribute('fill', LIQ[st.one].c);
        var d = rise(st.one, Tb) / 18;
        msg.textContent = d > 0.15 ? 'Le liquide monte au-dessus du repère : il se dilate' : d < -0.15 ? 'Le liquide descend sous le repère : il se contracte' : 'Le liquide est au repère';
        pv.textContent = 'NIVEAU DANS LE TUBE'; pl[0].textContent = (d >= 0 ? '+' : '') + fmt(d, 1) + ' graduation' + (Math.abs(d) >= 2 ? 's' : ''); pl[0].setAttribute('fill', LIQ[st.one].c); pl[1].textContent = d > 0.15 ? 'dilatation' : d < -0.15 ? 'contraction' : 'au repère'; pl[1].setAttribute('fill', '#C9D2E3'); pl[2].textContent = '';
        pv3.textContent = LIQ[st.one].n + ' chauffé(e) au bain-marie';
        res = { d: d, one: st.one, T: Tb };
      } else {
        var yy2 = 344 - (Tb + 10) * 2.3; attr(tcol, { y: yy2, height: 362 - yy2 });
        tLab.textContent = Math.round(Tb) + ' °C';
        msg.textContent = 'Un thermomètre à alcool plongé dans le bain-marie';
        tRem[0].textContent = 'Chauffé, l’alcool du réservoir'; tRem[1].textContent = 'se dilate et monte dans'; tRem[2].textContent = 'le tube fin gradué.';
        pv.textContent = 'TEMPÉRATURE DU BAIN'; pl[0].textContent = Math.round(Tb) + ' °C'; pl[0].setAttribute('fill', '#FFC773'); pl[1].textContent = Tb < 1 ? 'eau glacée' : Tb > 95 ? 'presque à ébullition' : ''; pl[1].setAttribute('fill', '#C9D2E3'); pl[2].textContent = '';
        pv3.textContent = 'principe du thermomètre : la dilatation';
        res = { T: Tb };
      }
      th.set(Tb); lp.set(Math.max(0, Math.min(1, (Tb) / 100)), T);
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Un ballon et un tube' }, { t: 10, title: 'On chauffe' }, { t: 20, title: 'On refroidit' }, { t: 31, title: 'Tous les liquides ?' }, { t: 44, title: 'Le thermomètre' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un liquide chauffé <b>se dilate</b>', 'son volume augmente ; refroidi, il <b>se contracte</b>.', '#4FA8FF'],
      ['La dilatation dépend du <b>liquide</b>', 'l’alcool se dilate plus que l’huile, qui se dilate plus que l’eau.', '#E5484D'],
      ['Le <b>thermomètre</b> utilise la dilatation', 'd’un liquide (alcool coloré) dans un tube fin gradué.', '#FFC773']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t;
        if (t < 31) { st.mode = 'one'; st.one = 'eau'; st.T = t < 10 ? 20 : t < 20 ? 20 + 60 * K.k(t, 10.5, 6) : 80 - 76 * K.k(t, 20.5, 7); }
        else if (t < 44) { st.mode = 'compare'; st.T = 20 + 60 * K.k(t, 32, 7); }
        else { st.mode = 'thermo'; st.tTher = t < 48 ? 20 + 17 * K.k(t, 44.5, 2.5) : t < 52 ? 37 + 63 * K.k(t, 48, 3) : 100 - 100 * K.k(t, 52, 3); }
        lab.step();
        tg.show(t, 2, 9.6, 290, 92, 'Le liquide est au repère') || tg.show(t, 12, 19.6, 290, 92, 'Chauffé, il monte : il se dilate') || tg.show(t, 22, 30.6, 290, 92, 'Refroidi, il descend : il se contracte') ||
          tg.show(t, 33, 43.6, 290, 92, 'Alcool > huile > eau') || tg.show(t, 45, 55.6, 290, 92, 'Thermomètre : ' + Math.round(st.tTher) + ' °C');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un ballon d’eau colorée surmonté d’un tube fin, placé dans un bain-marie qu’on chauffe puis refroidit avec de la glace ; trois ballons d’eau, d’alcool et d’huile chauffés ensemble ; puis un thermomètre à alcool dans le bain',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 5, say: 'Remplissons un ballon d’eau colorée, surmonté d’un tube fin. Marquons le niveau d’un repère.', sub: 'Un ballon d’eau colorée, un tube fin, un <b>repère</b>.' },
      { t: 5.2, d: 4.6, say: 'Plaçons-le dans un bain-marie.', sub: 'Dans un bain-marie…' },
      { t: 10, d: 9.6, say: 'Chauffons l’eau du bain-marie : le niveau monte dans le tube, au-dessus du repère. Le volume de l’eau augmente : elle se dilate.', sub: 'Chauffée, l’eau <b>se dilate</b> : son niveau monte.' },
      { t: 20, d: 10.6, say: 'Ajoutons de la glace : le niveau redescend, et passe même sous le repère. En refroidissant, le liquide se contracte.', sub: 'Refroidie, l’eau <b>se contracte</b> : son niveau descend.' },
      { t: 31, d: 12.6, say: 'Chauffons ensemble trois liquides : de l’eau, de l’huile et de l’alcool. Ils montent tous, mais l’alcool monte le plus et l’eau le moins : la dilatation dépend du liquide.', sub: 'L’<b>alcool</b> se dilate le plus, l’<b>eau</b> le moins.' },
      { t: 44, d: 11.6, say: 'C’est le principe du thermomètre : l’alcool coloré du réservoir se dilate et monte dans le tube gradué quand la température augmente.', sub: 'Le <b>thermomètre</b> : un liquide qui se dilate dans un tube gradué.' },
      { t: 56, d: 4.4, say: 'À retenir : un liquide chauffé se dilate, refroidi il se contracte.', sub: 'Chauffé : dilatation ; refroidi : contraction.' },
      { t: 60.6, d: 4.2, say: 'Tous les liquides ne se dilatent pas de la même façon.', sub: 'La dilatation dépend du <b>liquide</b>.' },
      { t: 65, d: 5, say: 'Le thermomètre à liquide fonctionne grâce à la dilatation.', sub: 'Le thermomètre utilise la <b>dilatation</b>.' }
    ],
    learn: [
      { t: 19, ch: 1, html: 'Chauffé, un liquide <b>se dilate</b> : son volume augmente.' },
      { t: 30, ch: 2, html: 'Refroidi, il <b>se contracte</b>.' },
      { t: 43, ch: 3, html: 'Alcool > huile > eau : la dilatation dépend du <b>liquide</b>.' },
      { t: 55, ch: 4, html: 'Le <b>thermomètre</b> à alcool utilise la dilatation.' }
    ],
    question: { q: 'Quand on chauffe un liquide, son volume :', o: ['diminue', 'augmente', 'reste le même', 'devient nul'], a: 1, e: 'Il se dilate.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Bain-marie chauffé ou refroidi par de la glace, contenant un ou trois ballons de liquide surmontés de tubes gradués, ou un thermomètre à alcool ; thermomètre et loupe sur les particules à droite',
    steps: [
      'Un seul ballon : chauffe puis refroidis le bain-marie et observe le niveau par rapport au repère.',
      'Trois ballons : chauffe-les ensemble. Quel liquide se dilate le plus ?',
      'Thermomètre : fais varier la température du bain et lis le thermomètre.',
      'Relève la montée de chaque liquide à plusieurs températures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onSel: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'compare', options: [{ v: 'compare', l: 'Trois liquides' }, { v: 'one', l: 'Un seul ballon' }, { v: 'thermo', l: 'Le thermomètre' }], onChange: function (v) { st.mode = v; vis(); } });
      var cL = c.seg({ label: 'Liquide', value: 'eau', options: Object.keys(LIQ).map(function (k) { return { v: k, l: LIQ[k].n }; }), onChange: function (v) { st.one = v; } });
      var sT = c.slider({ label: 'Température du bain-marie', min: 6, max: 90, step: 1, value: 20, unit: '°C', onInput: function (v) { st.T = v; } });
      var sH = c.slider({ label: 'Température du bain', min: -10, max: 100, step: 1, value: 20, unit: '°C', onInput: function (v) { st.tTher = v; } });
      function vis() { cL.hide(st.mode !== 'one'); sT.hide(st.mode === 'thermo'); sH.hide(st.mode !== 'thermo'); }
      vis();
      var ro = api.readouts([{ k: 't', label: 'Température' }, { k: 'o', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.t.set(Math.round(last.T) + ' °C'); ro.o.set(st.mode === 'compare' ? 'alcool : +' + fmt(Math.max(0, rise('alcool', st.T)) / 18, 1) + ' gr.' : st.mode === 'one' ? (last.d > 0.15 ? 'dilatation' : last.d < -0.15 ? 'contraction' : 'au repère') : 'thermomètre : ' + Math.round(st.tTher) + ' °C'); });
      var M = api.measure; M.innerHTML = '<h3>Montée des liquides (graduations)</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever (mode trois liquides)'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode !== 'compare') { api.say('Passe en mode « Trois liquides » pour relever.'); return; } rows.push({ T: st.T, e: rise('eau', st.T) / 18, a: rise('alcool', st.T) / 18, h: rise('huile', st.T) / 18 }); rows.sort(function (p, q) { return p.T - q.T; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>T</th><th>eau</th><th>alcool</th><th>huile</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.T + ' °C</td><td>' + fmt(r.e, 1) + '</td><td>' + fmt(r.a, 1) + '</td><td>' + fmt(r.h, 1) + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Montée en fonction de la température</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'température (°C)', ylabel: 'montée (gr.)', xmin: 0, xmax: 90, xstep: 15, ymin: -2, ymax: 10, ystep: 2, series: [{ color: LIQ.eau.c, pts: rows.map(function (r) { return [r.T, r.e]; }) }, { color: LIQ.alcool.c, pts: rows.map(function (r) { return [r.T, r.a]; }) }, { color: LIQ.huile.c, pts: rows.map(function (r) { return [r.T, r.h]; }) }] });
      }
      paint();
      api.onReset(function () { st.mode = 'compare'; st.T = 20; st.one = 'eau'; st.sel = null; st.tTher = 20; cM.set('compare'); cL.set('eau'); sT.set(20); sH.set(20); vis(); rows = []; paint(); });
      api.say('Chauffe le bain-marie et regarde les tubes.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève la montée des liquides à au moins 3 températures.</p>';
        return '<p>Chauffé, un liquide <b>se dilate</b> : son volume augmente et son niveau monte dans le tube. Refroidi, il <b>se contracte</b>.</p><p>À même température, l’<b>alcool</b> se dilate plus que l’huile, qui se dilate plus que l’<b>eau</b> : la dilatation dépend de la nature du liquide. Plus l’élévation de température est grande, plus la montée est importante.</p><p>Le <b>thermomètre</b> à liquide (alcool coloré) fonctionne grâce à cette dilatation. On ne remplit jamais une bouteille à ras bord : le liquide pourrait déborder en se dilatant.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Dilatation des liquides' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du bain-marie',
    intro: 'Chauffe, refroidis, compare : les liquides n’ont qu’à bien se tenir !',
    missions: [
      { title: 'Sous le repère', text: 'Fais descendre l’eau colorée <span style="color:#4FA8FF">sous le repère</span>.', lumi: 'Que faut-il faire au bain-marie ?', hint: 'Refroidis le bain (glace).',
        build: function (api) { var lab = mini(api, { mode: 'one', one: 'eau', T: 50 }); api.c.slider({ label: 'Température du bain-marie', min: 6, max: 90, step: 1, value: 50, unit: '°C', onInput: function (v) { lab.st.T = v; } }); return function () { var r = lab.res(); return r.d < -0.15 ? { ok: true, msg: 'Refroidie, l’eau se contracte.' } : { ok: false, msg: 'Le niveau est encore au-dessus du repère.' }; }; },
        e: 'En refroidissant, le liquide se contracte : son niveau descend.' },
      { type: 'qcm', title: 'Volume', text: 'Quand un liquide se contracte, son volume :', o: ['augmente', 'diminue', 'ne change pas', 'double'], a: 1, hint: 'Contraction…', e: 'Il diminue.' },
      { title: 'Le champion', text: 'Chauffe les trois ballons à au moins <b>60 °C</b>, puis <b>clique sur le liquide</b> qui se dilate le plus.', lumi: 'Compare les hauteurs dans les tubes.', hint: 'C’est le liquide des thermomètres.',
        build: function (api) { var lab = mini(api, { mode: 'compare' }); api.c.slider({ label: 'Température du bain-marie', min: 6, max: 90, step: 1, value: 20, unit: '°C', onInput: function (v) { lab.st.T = v; } }); return function () { var r = lab.res(); return r.T >= 60 && r.sel === 'alcool' ? { ok: true, msg: 'L’alcool se dilate le plus !' } : { ok: false, msg: r.T < 60 ? 'Chauffe d’abord à 60 °C.' : 'Clique sur le liquide qui monte le plus.' }; }; },
        e: 'À même température, l’alcool se dilate le plus.' },
      { type: 'qcm', title: 'Le thermomètre', text: 'Le thermomètre à alcool fonctionne grâce :', o: ['à l’évaporation de l’alcool', 'à la dilatation de l’alcool', 'à la pression de l’air', 'à l’électricité'], a: 1, hint: 'L’alcool monte dans le tube…', e: 'L’alcool se dilate et monte dans le tube.' },
      { title: '37 °C', text: 'Règle le bain pour que le thermomètre indique <span style="color:var(--amber)">37 °C</span>, la température du corps.', lumi: 'Lis bien les graduations.', hint: 'Entre 30 et 40.',
        build: function (api) { var lab = mini(api, { mode: 'thermo', tTher: 20 }); api.c.slider({ label: 'Température du bain', min: -10, max: 100, step: 1, value: 20, unit: '°C', onInput: function (v) { lab.st.tTher = v; } }); return function () { var r = lab.res(); return Math.abs(r.T - 37) <= 1 ? { ok: true, msg: 'Le thermomètre indique 37 °C.' } : { ok: false, msg: 'Il indique ' + Math.round(r.T) + ' °C.' }; }; },
        e: 'Le thermomètre indique la température du bain grâce à la dilatation de l’alcool.' }
    ]
  };

  S.start({
    id: '5e-dilatation-liquides', level: '5e', theme: 'Propriétés physiques de la matière', title: 'Dilatation des liquides', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Lorsqu’on chauffe un liquide, son volume augmente : il <b>se dilate</b>. Lorsqu’on le refroidit, son volume diminue : il <b>se contracte</b>.',
      'Expérience : le niveau d’eau colorée dans le tube monte au-dessus du repère quand on chauffe, et descend en dessous quand on refroidit.',
      'La dilatation dépend de la <b>nature du liquide</b> : à même température, l’alcool se dilate plus que l’huile, qui se dilate plus que l’eau.',
      'Les liquides se dilatent plus que les solides.',
      'Modèle simplifié, valable de 6 à 90 °C environ. Exception : entre 0 et 4 °C, l’eau se <b>contracte</b> quand on la chauffe (c’est pourquoi la glace flotte et les lacs gèlent par le dessus).',
      'Application : le <b>thermomètre</b> à liquide. Précaution : on ne remplit pas une bouteille ou un réservoir à ras bord.'
    ],
    quiz: [
      { q: 'Un liquide chauffé :', o: ['se contracte', 'se dilate', 'devient solide', 'ne change pas'], a: 1, e: 'Son volume augmente.' },
      { q: 'Lequel se dilate le plus ?', o: ['l’eau', 'l’huile', 'l’alcool', 'ils se dilatent pareil'], a: 2, e: 'L’alcool.' },
      { q: 'Pourquoi ne remplit-on pas une bouteille à ras bord ?', o: ['pour économiser', 'le liquide pourrait déborder en se dilatant', 'pour qu’elle soit plus légère', 'par habitude'], a: 1, e: 'Le liquide a besoin de place pour se dilater.' },
      { q: 'Dans un thermomètre, quand la température baisse, l’alcool :', o: ['monte', 'descend', 's’évapore', 'gèle aussitôt'], a: 1, e: 'Il se contracte.' },
      { q: 'Les liquides se dilatent :', o: ['moins que les solides', 'plus que les solides', 'jamais', 'seulement au soleil'], a: 1, e: 'Plus que les solides.' }
    ]
  });
})();
