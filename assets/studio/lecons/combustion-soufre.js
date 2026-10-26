/* 5e · Mélanges et réactions chimiques · Leçon : Combustion du soufre */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, C = window.CombKit;
  var RX = [{ e: 'S', a: [-80, 0], b: [0, 0] }, { e: 'O', a: [20, 0], b: [-38, 22] }, { e: 'O', a: [52, 0], b: [38, 22] }];
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); k = Math.max(0, Math.min(1, k)); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'labo', gas: 'O2', heat: 0, inF: false, p: 0, heating: false, ph: 0, kmno: 0, phOn: false, kOn: false, em: 0.8, t: null }, o || {});
    var GR = C.grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    /* ---------- LABO ---------- */
    var L = s('g', {}, G); s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, L); s('rect', { x: 40, y: 412, width: 500, height: 34, fill: '#151D2E' }, L);
    s('text', { x: 524, y: 402, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 800, fill: '#FFB547', text: 'manipulation sous la hotte' }, L);
    var bun = C.burner(L, 150, 412), fl = C.flask(L, 390, 168, { w: 160, h: 228 }), sp = C.spoon(L);
    var sul = s('path', { d: 'M-14 -2 q4 -10 14 -10 q10 0 14 10z' }, sp.cont);
    var fla = s('g', {}, sp.cont), fl1 = s('path', { fill: '#5B7BFF', opacity: 0.85 }, fla), fl2 = s('path', { fill: '#B9C8FF', opacity: 0.9 }, fla), flG = s('circle', { cy: -20, fill: C.glow(G, '#6E8BFF'), opacity: 0 }, fla);
    var strip = s('g', {}, L); s('rect', { x: -6, y: 0, width: 12, height: 70, fill: '#F2EBD3' }, strip); var stripC = s('rect', { x: -6, y: 0, width: 12, height: 28, fill: '#E9D9A6' }, strip);
    var lbl = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, L);
    /* ---------- POLLUTION ---------- */
    var P2 = s('g', {}, G); s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#16233A', stroke: '#1E2A44', 'stroke-width': 2 }, P2);
    s('rect', { x: 40, y: 360, width: 500, height: 86, fill: '#2E4A2E' }, P2); var lake = s('ellipse', { cx: 410, cy: 400, rx: 100, ry: 26 }, P2);
    s('rect', { x: 80, y: 250, width: 90, height: 110, fill: '#4A5568' }, P2); s('rect', { x: 140, y: 170, width: 22, height: 100, fill: '#5B6680' }, P2); s('text', { x: 125, y: 382, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'usine' }, P2);
    var smoke = s('g', {}, P2), SM = []; for (var i = 0; i < 14; i++) SM.push(s('circle', { r: 12, fill: '#9AA6BC' }, smoke));
    var cloud = s('g', {}, P2), cl = [[280, 110, 46], [330, 96, 54], [390, 110, 46], [350, 124, 42]].map(function (c) { return s('circle', { cx: c[0], cy: c[1], r: c[2] }, cloud); });
    var rain = s('g', {}, P2), RN = []; for (i = 0; i < 30; i++) RN.push(s('line', { stroke: '#7FB8FF', 'stroke-width': 2, 'stroke-linecap': 'round' }, rain));
    var tree = s('g', {}, P2); s('rect', { x: 248, y: 300, width: 12, height: 62, fill: '#6B4F34' }, tree); var leaves = [[254, 286, 34], [236, 300, 22], [272, 300, 22]].map(function (c) { return s('circle', { cx: c[0], cy: c[1], r: c[2] }, tree); });
    var drop = s('g', {}, P2); s('path', { d: 'M470 160 q22 30 22 46 a22 22 0 0 1 -44 0 q0 -16 22 -46z', fill: '#7FB8FF', opacity: 0.85 }, drop); var dT = s('text', { x: 470, y: 214, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#0B1220' }, drop);
    s('text', { x: 470, y: 248, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#C9D2E3', text: 'pH de la pluie' }, P2);
    /* ---------- PANNEAU ---------- */
    var PX = 560, mv = C.molView(G, PX, 22, 280, 196, GR), P = s('g', {}, G);
    s('rect', { x: PX, y: 230, width: 280, height: 216, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 18, y: 256, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    s('rect', { x: PX + 18, y: 266, width: 244, height: 14, rx: 7, fill: '#1A2540' }, P); var barF = s('rect', { x: PX + 18, y: 266, height: 14, rx: 7, fill: '#4FC3FF' }, P);
    var ob = [0, 1, 2, 3, 4].map(function (k) { return s('text', { x: PX + 18, y: 310 + k * 26, 'font-size': 13, fill: '#C9D2E3' }, P); });
    var last = performance.now(), phase = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      L.style.display = st.mode === 'labo' ? '' : 'none'; P2.style.display = st.mode === 'pollu' ? '' : 'none';
      if (st.mode === 'labo') {
        var O2tot = st.gas === 'O2' ? 1 : 0.21, lit = st.heat > 0.85, burning = lit && st.inF && st.p < O2tot - 0.001, burnAir = lit && !st.inF && st.heating;
        if (st.t == null) {
          if (st.heating && !st.inF) st.heat = Math.min(1, st.heat + dt / 3);
          if (burning) st.p = Math.min(O2tot, st.p + dt / (st.gas === 'O2' ? 7 : 5));
          if (st.inF && st.p >= O2tot - 0.001) st.heat = Math.max(0.6, st.heat - dt / 3);
          if (st.phOn) st.ph = Math.min(1, st.ph + dt / 1.5); if (st.kOn) st.kmno = Math.min(1, st.kmno + dt / 2);
        }
        var x = st.inF ? 390 : 150, y = st.inF ? 312 : 262; sp.at(x, y); bun.set(st.heating && !st.inF, T);
        var hk = Math.min(1, st.heat / 0.6); sul.setAttribute('fill', mixc('#FFD84A', '#B5451B', Math.max(0, (st.heat - 0.45) / 0.4))); sul.setAttribute('d', hk < 0.8 ? 'M-14 -2 q4 -10 14 -10 q10 0 14 10z' : 'M-15 -2 q15 -5 30 0z');
        var fs = burning ? (st.gas === 'O2' ? 1.8 : 0.8) : burnAir ? 0.7 : 0, fk = 1 + 0.08 * Math.sin(T * 18);
        fla.style.display = fs ? '' : 'none';
        fl1.setAttribute('d', 'M-12 -4 q' + (-6 * fs) + ' ' + (-20 * fs * fk) + ' 12 ' + (-46 * fs * fk) + ' q' + (18 * fs) + ' ' + (26 * fs * fk) + ' 12 ' + (46 * fs * fk) + 'z');
        fl2.setAttribute('d', 'M-5 -4 q-2 ' + (-12 * fs * fk) + ' 5 ' + (-24 * fs * fk) + ' q7 ' + (12 * fs * fk) + ' 5 ' + (24 * fs * fk) + 'z');
        attr(flG, { r: 30 + 30 * fs, opacity: Math.min(1, fs * 0.6) });
        var so2 = st.p, dec = st.kmno * Math.min(1, so2 * 3);
        fl.set({ gas: st.gas === 'O2' ? '#9FD7FF' : '#C9D2E3', gasOp: 0.1, label: st.gas === 'O2' ? 'flacon de dioxygène' : 'flacon d’air', fume: Math.min(1, so2 * 1.6), T: T, liq: st.kmno > 0 ? 34 * Math.min(1, st.kmno * 2) : 0, liqCol: mixc('#8E2BB8', '#E9F2FF', dec), liqOp: 0.8 });
        strip.style.display = st.ph > 0 ? '' : 'none'; strip.setAttribute('transform', 'translate(452 ' + (130 + 20 * Math.min(1, st.ph * 2)) + ')'); stripC.setAttribute('fill', mixc('#E9D9A6', '#E53935', st.ph * Math.min(1, so2 * 3)));
        lbl.textContent = burning ? (st.gas === 'O2' ? 'Belle flamme bleue, fumées blanches' : 'Petite flamme bleue') : burnAir ? 'Le soufre fond puis s’enflamme : flamme bleue' : st.heating ? 'Le soufre fond…' : st.p > 0 ? 'Combustion terminée' : 'Chauffe le soufre sur la flamme';
        phase = burning ? (st.t != null ? (T * 0.5) % 1 : (phase + dt * 0.5) % 1) : (st.p > 0 ? 1 : 0);
        mv.set(RX, Math.min(1, phase * 1.3), 'S + O_{2} → SO_{2}');
        pT.textContent = 'DIOXYGÈNE RESTANT DANS LE FLACON'; attr(barF, { width: 244 * Math.max(0, O2tot - st.p) }); barF.setAttribute('fill', '#4FC3FF');
        ob[0].textContent = 'Réactifs : soufre + dioxygène'; ob[1].textContent = 'Produit : dioxyde de soufre SO₂';
        ob[2].textContent = st.ph > 0.5 ? (so2 > 0.15 ? 'Papier pH humide rouge : gaz acide' : 'Papier pH : pas de changement') : 'Test 1 : papier pH humide'; ob[2].setAttribute('fill', st.ph > 0.5 && so2 > 0.15 ? '#FF8A80' : '#C9D2E3');
        ob[3].textContent = st.kmno > 0.5 ? (dec > 0.3 ? 'Permanganate décoloré : SO₂ présent !' : 'Permanganate reste violet') : 'Test 2 : permanganate de potassium'; ob[3].setAttribute('fill', st.kmno > 0.5 && dec > 0.3 ? '#3DD68C' : '#C9D2E3');
        ob[4].textContent = '';
        res = { burning: burning, gas: st.gas, p: st.p, dec: dec, kmno: st.kmno, phTest: st.ph, heat: st.heat, inF: st.inF };
      } else {
        var e = st.em, pH = 5.6 - 1.7 * e;
        SM.forEach(function (c, k) { var ph = (C.rnd(k, 1) + T * 0.12) % 1, on = k / SM.length < e; attr(c, { cx: 151 + ph * 150 + Math.sin(T + k) * 6, cy: 160 - ph * 50, r: 8 + ph * 18, opacity: on ? 0.5 * (1 - ph) : 0 }); });
        cl.forEach(function (c) { c.setAttribute('fill', mixc('#C9D2E3', '#6B7280', e)); });
        RN.forEach(function (r, k) { var ph = (C.rnd(k, 2) + T * 0.9) % 1, x0 = 250 + C.rnd(k, 3) * 180, y0 = 150 + ph * 220; attr(r, { x1: x0, y1: y0, x2: x0 - 3, y2: y0 + 12, stroke: mixc('#7FB8FF', '#C6E06A', e) }); });
        leaves.forEach(function (c) { c.setAttribute('fill', mixc('#3DD68C', '#8B6B3D', e * 1.1)); });
        lake.setAttribute('fill', mixc('#3D8BFF', '#6E8A4E', e));
        dT.textContent = fmt(pH, 1);
        phase = (T * 0.4) % 1; mv.set(RX, Math.min(1, phase * 1.3), 'S + O_{2} → SO_{2}');
        pT.textContent = 'REJETS DE DIOXYDE DE SOUFRE'; attr(barF, { width: 244 * e }); barF.setAttribute('fill', mixc('#3DD68C', '#FF5A4E', e));
        ob[0].textContent = 'Le SO₂ rejeté dans l’air se dissout'; ob[1].textContent = 'dans l’eau des nuages :';
        ob[2].textContent = pH < 5 ? 'pluies acides (pH ' + fmt(pH, 1) + ') !' : 'pluie presque normale (pH ' + fmt(pH, 1) + ')'; ob[2].setAttribute('fill', pH < 5 ? '#FF8A80' : '#3DD68C');
        ob[3].textContent = 'Elles abîment les forêts, les lacs'; ob[4].textContent = 'et les monuments.';
        res = { pH: pH, em: e };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le soufre' }, { t: 10, title: 'Une flamme bleue' }, { t: 22, title: 'Le gaz formé' }, { t: 35, title: 'Le bilan' }, { t: 45, title: 'Les pluies acides' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Le soufre brûle avec une <b>flamme bleue</b>', 'plus vive dans le dioxygène pur que dans l’air.', '#6E8BFF'],
      ['Il se forme du <b>dioxyde de soufre</b> SO₂', 'gaz suffocant et acide ; il décolore le permanganate. S + O₂ → SO₂.', '#FFD84A'],
      ['Le SO₂ <b>pollue</b> : il cause les pluies acides', 'on manipule toujours le soufre sous la hotte.', '#FF5A4E']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 45) { st.mode = 'labo'; st.gas = 'O2'; st.heating = t > 3 && t < 15; st.heat = K.k(t, 3.5, 7); st.inF = t > 15; st.p = t < 15 ? 0 : 0.9 * K.k(t, 15.4, 9); st.ph = t < 25 ? 0 : K.k(t, 25, 2); st.kmno = t < 30 ? 0 : K.k(t, 30, 3); }
        else { st.mode = 'pollu'; st.em = t < 51 ? 0.95 : 0.95 - 0.8 * K.k(t, 51, 4); }
        lab.step();
        tg.show(t, 1, 9.6, 290, 92, 'Le soufre : un solide jaune') || tg.show(t, 10.5, 15, 290, 92, 'Il fond, puis brûle : flamme bleue') || tg.show(t, 15.6, 21.6, 290, 92, 'Dans le dioxygène : flamme vive et fumées') ||
          tg.show(t, 26, 29.6, 290, 92, 'Papier pH humide : rouge, gaz acide') || tg.show(t, 31, 34.6, 290, 92, 'Le permanganate se décolore : SO₂ !') || tg.show(t, 36, 44.6, 290, 92, 'S + O₂ → SO₂') || tg.show(t, 46, 50.6, 290, 92, 'Fumées soufrées : pluies acides') || tg.show(t, 52, 56.6, 290, 92, 'Moins de rejets : pluie moins acide');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : du soufre jaune chauffé dans un têt fond puis s’enflamme avec une flamme bleue ; dans un flacon de dioxygène la flamme devient vive et des fumées apparaissent ; le papier pH humide rougit et le permanganate se décolore ; la vue moléculaire montre S + O₂ → SO₂ ; enfin une usine rejette du dioxyde de soufre qui provoque des pluies acides',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 5, say: 'Le soufre est un solide jaune. On le manipule toujours sous la hotte.', sub: 'Le soufre : un solide <b>jaune</b>. On travaille sous la hotte.' },
      { t: 5.2, d: 4.6, say: 'Chauffons-le dans le têt à combustion : il fond et devient brun-rouge.', sub: 'Chauffé, il <b>fond</b>.' },
      { t: 10, d: 5, say: 'Puis il s’enflamme dans l’air, avec une petite flamme bleue.', sub: 'Il s’enflamme : <b>flamme bleue</b>.' },
      { t: 15.2, d: 6.6, say: 'Dans le dioxygène pur, la flamme bleue devient beaucoup plus vive, et des fumées blanches remplissent le flacon.', sub: 'Dans le dioxygène : flamme <b>vive</b> et fumées.' },
      { t: 22, d: 3, say: 'Quel gaz s’est formé ? Il a une odeur suffocante.', sub: 'Un gaz à l’odeur <b>suffocante</b>…' },
      { t: 25.2, d: 4.6, say: 'Un papier pH humide devient rouge : le gaz est acide.', sub: 'Papier pH humide <b>rouge</b> : gaz acide.' },
      { t: 30, d: 5, say: 'Le permanganate de potassium, violet, se décolore : c’est le test du dioxyde de soufre.', sub: 'Le permanganate se <b>décolore</b> : <b>dioxyde de soufre</b>.' },
      { t: 35, d: 10, say: 'Un atome de soufre et une molécule de dioxygène forment une molécule de dioxyde de soufre : S plus O deux donne S O deux.', sub: 'Bilan : <b>S + O₂ → SO₂</b>.' },
      { t: 45, d: 6, say: 'Les usines et les véhicules rejettent du dioxyde de soufre. Dissous dans l’eau des nuages, il rend la pluie acide.', sub: 'Le SO₂ rejeté provoque des <b>pluies acides</b>.' },
      { t: 51.2, d: 5.6, say: 'Les pluies acides abîment les forêts et les lacs. Réduire les rejets protège l’environnement.', sub: 'Réduire les rejets protège la nature.' },
      { t: 57, d: 4.4, say: 'À retenir : le soufre brûle avec une flamme bleue.', sub: 'Le soufre brûle avec une <b>flamme bleue</b>.' },
      { t: 61.6, d: 4.2, say: 'Il se forme du dioxyde de soufre, qui décolore le permanganate.', sub: 'Il se forme du <b>dioxyde de soufre</b>.' },
      { t: 66, d: 5, say: 'Ce gaz toxique pollue l’air et provoque les pluies acides.', sub: 'Un gaz <b>toxique</b> et <b>polluant</b>.' }
    ],
    learn: [
      { t: 14, ch: 1, html: 'Le soufre fond puis brûle avec une <b>flamme bleue</b>.' },
      { t: 34, ch: 2, html: 'Le <b>dioxyde de soufre</b> rougit le papier pH et décolore le permanganate.' },
      { t: 44, ch: 3, html: 'Bilan : <b>S + O₂ → SO₂</b>.' },
      { t: 56, ch: 4, html: 'Le SO₂ provoque les <b>pluies acides</b>.' }
    ],
    question: { q: 'La combustion du soufre produit :', o: ['du dioxyde de carbone', 'du dioxyde de soufre', 'de l’eau', 'du monoxyde de carbone'], a: 1, e: 'S + O₂ → SO₂.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [40, 40, 500, 406] }, { n: 'Molécules', r: [560, 22, 280, 196] }, { n: 'Bilan', r: [560, 230, 280, 216] }],
    alt: 'Laboratoire sous la hotte : un bec Bunsen, un têt à combustion avec du soufre et un flacon d’air ou de dioxygène ; deux tests (papier pH humide, permanganate de potassium). Second mode : une usine rejette du dioxyde de soufre et la pluie devient acide',
    steps: [
      'Chauffe le soufre : observe sa fusion puis sa flamme dans l’air.',
      'Plonge-le dans le flacon de dioxygène : compare la flamme.',
      'Réalise les deux tests du gaz formé : papier pH humide et permanganate.',
      'Mode pollution : fais varier les rejets de l’usine et observe le pH de la pluie.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'labo', options: [{ v: 'labo', l: 'Au laboratoire' }, { v: 'pollu', l: 'Les pluies acides' }], onChange: function (v) { st.mode = v; vis(); } });
      var cG = c.seg({ label: 'Flacon', value: 'O2', options: [{ v: 'O2', l: 'dioxygène pur' }, { v: 'air', l: 'air' }], onChange: function (v) { st.gas = v; st.p = 0; st.ph = 0; st.kmno = 0; st.phOn = st.kOn = false; st.inF = false; } });
      var r1 = c.row();
      c.button({ label: 'Chauffer le soufre', sm: true, into: r1, onClick: function () { st.inF = false; st.heating = true; } });
      var bP = c.button({ label: 'Plonger dans le flacon', primary: true, sm: true, into: r1, onClick: function () { st.heating = false; st.inF = !st.inF; api.sound('tick'); } });
      c.button({ label: 'Papier pH humide', sm: true, into: r1, onClick: function () { st.phOn = true; } });
      c.button({ label: 'Permanganate + agiter', sm: true, into: r1, onClick: function () { st.inF = false; st.heating = false; st.kOn = true; } });
      c.button({ label: 'Nouveau flacon', sm: true, into: r1, onClick: function () { st.p = 0; st.ph = 0; st.kmno = 0; st.phOn = st.kOn = false; st.inF = false; st.heat = 0; } });
      var sE = c.slider({ label: 'Rejets de dioxyde de soufre', min: 0, max: 100, step: 5, value: 80, unit: '%', onInput: function (v) { st.em = v / 100; } });
      function vis() { var l = st.mode === 'labo'; cG.hide(!l); r1.style.display = l ? 'flex' : 'none'; sE.hide(l); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Observation' }, { k: 'b', label: 'Mesure' }]);
      var last = {};
      api.loop(function () { last = lab.step(); bP.textContent = st.inF ? 'Retirer du flacon' : 'Plonger dans le flacon'; if (st.mode === 'labo') { ro.a.set(last.burning ? 'flamme bleue ' + (st.gas === 'O2' ? 'vive' : 'faible') : last.heat > 0.85 ? 'soufre enflammé' : last.heat > 0.45 ? 'soufre fondu' : 'soufre solide'); ro.b.set('O₂ consommé : ' + Math.round(last.p * 100) + ' %'); } else { ro.a.set(last.pH < 5 ? 'pluies acides' : 'pluie normale'); ro.b.set('pH ' + fmt(last.pH, 1)); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bRl = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bRl.onclick = function () { rows.push(st.mode === 'labo' ? { e: 'flacon de ' + (st.gas === 'O2' ? 'dioxygène' : 'air'), o: (last.p > 0 ? 'flamme bleue ' + (st.gas === 'O2' ? 'vive' : 'faible') : 'pas de combustion') + (last.phTest > 0.5 ? ', papier pH ' + (last.p > 0.15 ? 'rouge' : 'inchangé') : '') + (last.kmno > 0.5 ? ', permanganate ' + (last.dec > 0.3 ? 'décoloré' : 'violet') : '') } : { e: 'rejets ' + Math.round(st.em * 100) + ' %', o: 'pluie de pH ' + fmt(last.pH, 1) }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>';
        api.chart.innerHTML = '<h3>Carbone ou soufre ?</h3><table class="mt"><thead><tr><th></th><th>Carbone</th><th>Soufre</th></tr></thead><tbody><tr><td>Combustion</td><td>sans flamme</td><td>flamme bleue</td></tr><tr><td>Produit</td><td>CO<sub>2</sub></td><td>SO<sub>2</sub></td></tr><tr><td>Test</td><td>eau de chaux troublée</td><td>permanganate décoloré</td></tr><tr><td>Équation</td><td>C + O<sub>2</sub> → CO<sub>2</sub></td><td>S + O<sub>2</sub> → SO<sub>2</sub></td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'labo'; st.gas = 'O2'; st.heat = 0; st.inF = false; st.p = 0; st.heating = false; st.ph = st.kmno = 0; st.phOn = st.kOn = false; st.em = 0.8; cM.set('labo'); cG.set('O2'); sE.set(80); vis(); rows = []; paint(); });
      api.say('Chauffe le soufre sur la flamme.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Chauffé, le <b>soufre</b> (solide jaune) fond, puis brûle dans l’air avec une petite <b>flamme bleue</b> ; dans le <b>dioxygène</b> pur, la flamme est beaucoup plus vive.</p><p>Il se forme un gaz incolore à l’odeur suffocante, le <b>dioxyde de soufre</b> : il rougit le papier pH humide (gaz acide) et <b>décolore le permanganate de potassium</b>. Bilan : <b>S + O<sub>2</sub> → SO<sub>2</sub></b>.</p><p>Le dioxyde de soufre est toxique ; rejeté par les usines et les véhicules, il provoque les <b>pluies acides</b>. On manipule le soufre sous la hotte.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Combustion du soufre' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function labRow(api, lab, test) { var r = api.c.row(); api.c.button({ label: 'Chauffer', sm: true, into: r, onClick: function () { lab.st.inF = false; lab.st.heating = true; } }); api.c.button({ label: 'Plonger / retirer', sm: true, into: r, onClick: function () { lab.st.heating = false; lab.st.inF = !lab.st.inF; } }); if (test) { api.c.button({ label: 'Papier pH', sm: true, into: r, onClick: function () { lab.st.phOn = true; } }); api.c.button({ label: 'Permanganate', sm: true, into: r, onClick: function () { lab.st.inF = false; lab.st.kOn = true; } }); } }
  var DEFI = {
    title: 'Le défi du soufre',
    intro: 'Flamme bleue, gaz suffocant, pluie acide : enquête sous la hotte !',
    missions: [
      { title: 'Flamme vive', text: 'Fais brûler le soufre avec une <span style="color:#6E8BFF">flamme bleue vive</span>.', lumi: 'Il lui faut beaucoup de dioxygène.', hint: 'Chauffe, puis plonge dans le flacon de dioxygène.',
        build: function (api) { var lab = mini(api, { gas: 'O2' }); labRow(api, lab, false); return function () { var r = lab.res(); return r.burning && r.gas === 'O2' ? { ok: true, msg: 'Superbe flamme bleue dans le dioxygène !' } : { ok: false, msg: r.heat < 0.85 ? 'Le soufre n’est pas encore enflammé.' : 'Plonge-le dans le flacon.' }; }; },
        e: 'Le soufre enflammé brûle vivement dans le dioxygène.' },
      { type: 'qcm', title: 'Sa couleur', text: 'Le soufre brûle avec une flamme :', o: ['rouge', 'jaune', 'bleue', 'verte'], a: 2, hint: 'Pense à la flamme qui reste petite dans l’air.', e: 'Flamme bleue.' },
      { title: 'Identifie le gaz', text: 'Après la combustion, <b>prouve</b> qu’il s’est formé du dioxyde de soufre.', lumi: 'Un réactif violet change de couleur…', hint: 'Combustion, puis permanganate.',
        build: function (api) { var lab = mini(api, { gas: 'O2' }); labRow(api, lab, true); return function () { var r = lab.res(); return r.dec > 0.3 && r.kmno > 0.9 ? { ok: true, msg: 'Permanganate décoloré : c’est du SO₂ !' } : { ok: false, msg: r.p < 0.1 ? 'Il faut d’abord une combustion.' : 'Fais le test au permanganate.' }; }; },
        e: 'Le dioxyde de soufre décolore le permanganate de potassium.' },
      { type: 'qcm', title: 'Équation', text: 'Complète : S + O₂ → …', o: ['SO', 'SO₂', 'CO₂', 'S₂O'], a: 1, hint: 'Compte les atomes.', e: '1 S et 2 O : SO₂.' },
      { title: 'Pluie propre', text: 'Réduis les rejets de l’usine pour que la pluie ait un pH d’au moins <span style="color:#3DD68C">5,5</span>.', lumi: 'Moins de SO₂ dans l’air…', hint: 'Baisse fortement les rejets.',
        build: function (api) { var lab = mini(api, { mode: 'pollu', em: 0.9 }); api.c.slider({ label: 'Rejets de SO₂', min: 0, max: 100, step: 5, value: 90, unit: '%', onInput: function (v) { lab.st.em = v / 100; } }); return function () { var r = lab.res(); return r.pH >= 5.5 ? { ok: true, msg: 'pH ' + fmt(r.pH, 1) + ' : la pluie n’est plus acide.' } : { ok: false, msg: 'pH ' + fmt(r.pH, 1) + ' : encore trop acide.' }; }; },
        e: 'Réduire les rejets de dioxyde de soufre limite les pluies acides.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Dans le laboratoire virtuel, du soufre brûle dans le dioxygène. Quelles observations indiqueraient la formation d’un nouveau corps ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-combustion-soufre', level: '5e', theme: 'Mélanges et réactions chimiques', title: 'Combustion du soufre', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le <b>soufre</b> est un solide jaune. Chauffé, il fond puis s’enflamme et brûle avec une <b>flamme bleue</b>, plus vive dans le <b>dioxygène</b> pur que dans l’air.',
      'Au cours de la combustion, le soufre et le dioxygène disparaissent ; il se forme du <b>dioxyde de soufre</b>, un gaz incolore à l’odeur suffocante.',
      'Le dioxyde de soufre rougit le papier pH humide (gaz <b>acide</b>) et <b>décolore</b> la solution violette de permanganate de potassium.',
      'Bilan : soufre + dioxygène → dioxyde de soufre ; équation : <b>S + O<sub>2</sub> → SO<sub>2</sub></b>.',
      'Le dioxyde de soufre est <b>toxique</b> et <b>polluant</b> : il est à l’origine des <b>pluies acides</b>. On manipule le soufre sous la hotte.'
    ],
    quiz: [
      { q: 'Le soufre est :', o: ['un liquide bleu', 'un solide jaune', 'un gaz', 'un métal gris'], a: 1, e: 'Solide jaune.' },
      { q: 'Le gaz formé par la combustion du soufre :', o: ['trouble l’eau de chaux uniquement', 'décolore le permanganate', 'est sans odeur', 'est du dioxygène'], a: 1, e: 'Test du SO₂.' },
      { q: 'Le dioxyde de soufre est :', o: ['basique', 'acide', 'neutre', 'sucré'], a: 1, e: 'Il rougit le papier pH humide.' },
      { q: 'L’équation de la combustion du soufre :', o: ['C + O₂ → CO₂', 'S + O₂ → SO₂', 'S + H₂ → H₂S', '2S + O₂ → 2SO'], a: 1, e: 'S + O₂ → SO₂.' },
      { q: 'Le SO₂ rejeté dans l’air provoque :', o: ['des arcs-en-ciel', 'des pluies acides', 'plus d’ozone', 'rien du tout'], a: 1, e: 'Pluies acides.' }
    ]
  });
})();

