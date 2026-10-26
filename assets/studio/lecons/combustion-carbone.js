/* 5e · Mélanges et réactions chimiques · Leçon : Combustion du carbone */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, C = window.CombKit;
  var R_OK = [{ e: 'C', a: [-80, 0], b: [0, 0] }, { e: 'O', a: [20, 0], b: [-36, 0] }, { e: 'O', a: [52, 0], b: [36, 0] }];
  var R_CO = [{ e: 'C', a: [-90, -24], b: [-30, -28] }, { e: 'C', a: [-90, 24], b: [-30, 28] }, { e: 'O', a: [24, 0], b: [4, -28] }, { e: 'O', a: [56, 0], b: [4, 28] }];
  function lump(g, sc) { s('path', { d: 'M-15 -2 q2 -12 12 -12 q6 -8 14 0 q8 2 6 12 q-4 6 -16 6 q-14 0 -16 -6z', fill: '#1E1E22', stroke: '#3A3A42', 'stroke-width': 1.5, transform: 'scale(' + sc + ')' }, g); }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'labo', gas: 'O2', heat: 0, inF: false, p: 0, lime: 0, heating: false, liming: false, aer: 0.2, co: 300, t: null }, o || {});
    var GR = C.grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    /* ---------- LABO ---------- */
    var L = s('g', {}, G); s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, L); s('rect', { x: 40, y: 412, width: 500, height: 34, fill: '#151D2E' }, L);
    var bun = C.burner(L, 150, 412), fl = C.flask(L, 390, 168, { w: 160, h: 228 }), sp = C.spoon(L);
    var coal = s('g', {}, sp.cont), cl0 = s('g', {}, coal); lump(cl0, 1);
    var hot = s('circle', { r: 26, fill: C.glow(G, '#FF7A2E'), opacity: 0 }, coal), hotC = s('path', { d: 'M-12 -4 q8 -8 14 -2 q6 4 -2 6z', fill: '#FFB547', opacity: 0 }, coal);
    var spk = s('g', {}, sp.cont), SP = []; for (var i = 0; i < 14; i++) SP.push(s('circle', { r: 1.8, fill: '#FFE29A' }, spk));
    var lbl = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, L);
    /* ---------- RÉCHAUD ---------- */
    var Rm = s('g', {}, G); s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#1A1F2E', stroke: '#1E2A44', 'stroke-width': 2 }, Rm);
    s('rect', { x: 40, y: 380, width: 500, height: 66, fill: '#3A2F28' }, Rm);
    var winF = s('rect', { x: 470, y: 120, width: 56, height: 120, fill: '#0B1530', stroke: '#C9D2E3', 'stroke-width': 3 }, Rm), winO = s('rect', { x: 472, y: 122, height: 116, fill: '#5FA8E8', opacity: 0.6 }, Rm);
    s('text', { x: 498, y: 260, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'fenêtre' }, Rm);
    s('path', { d: 'M180 380 L200 300 H300 L320 380 Z', fill: '#5B4636', stroke: '#8D6E4E', 'stroke-width': 2 }, Rm);
    var emb = s('g', {}, Rm); for (i = 0; i < 7; i++) s('circle', { cx: 214 + i * 12, cy: 298, r: 7, fill: '#2A1A12' }, emb);
    var embG = s('ellipse', { cx: 250, cy: 296, rx: 52, ry: 14, fill: C.glow(G, '#FF7A2E'), opacity: 0.8 }, Rm);
    s('path', { d: 'M196 278 h108 l-8 -40 h-92z', fill: '#6B7280' }, Rm); s('text', { x: 250, y: 400, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#E6D3B8', text: 'réchaud à charbon' }, Rm);
    var coG = s('g', {}, Rm), CO = []; for (i = 0; i < 60; i++) CO.push(s('circle', { r: 5, fill: '#9AA6BC', opacity: 0 }, coG));
    var det = s('g', {}, Rm); s('rect', { x: 64, y: 150, width: 150, height: 74, rx: 12, fill: '#EEF2F8' }, det); s('text', { x: 76, y: 170, 'font-size': 11, 'font-weight': 900, fill: '#3A3426', text: 'DÉTECTEUR CO' }, det);
    var detV = s('text', { x: 76, y: 204, 'font-size': 24, 'font-weight': 900, fill: '#1A1F28' }, det), detL = s('circle', { cx: 194, cy: 166, r: 8 }, det);
    var warn = s('text', { x: 300, y: 124, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#FF5A4E' }, Rm);
    /* ---------- PANNEAU ---------- */
    var PX = 560, mv = C.molView(G, PX, 22, 280, 196, GR), P = s('g', {}, G);
    s('rect', { x: PX, y: 230, width: 280, height: 216, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 18, y: 256, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var bar = s('rect', { x: PX + 18, y: 266, width: 244, height: 14, rx: 7, fill: '#1A2540' }, P), barF = s('rect', { x: PX + 18, y: 266, height: 14, rx: 7, fill: '#4FC3FF' }, P);
    var ob = [0, 1, 2, 3, 4].map(function (k) { return s('text', { x: PX + 18, y: 310 + k * 26, 'font-size': 13, fill: '#C9D2E3' }, P); });
    var last = performance.now(), phase = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      L.style.display = st.mode === 'labo' ? '' : 'none'; Rm.style.display = st.mode === 'rechaud' ? '' : 'none';
      var res = {};
      if (st.mode === 'labo') {
        var O2tot = st.gas === 'O2' ? 1 : 0.21, burning = st.inF && st.heat > 0.8 && st.p < O2tot - 0.001;
        if (st.t == null) {
          if (st.heating && !st.inF) st.heat = Math.min(1, st.heat + dt / 2);
          if (burning) st.p = Math.min(O2tot, st.p + dt / (st.gas === 'O2' ? 7 : 5));
          if (!st.inF && !st.heating) st.heat = Math.max(0, st.heat - dt / 8);
          if (st.inF && st.p >= O2tot - 0.001) st.heat = Math.max(0, st.heat - dt / 3);
          if (st.liming) st.lime = Math.min(1, st.lime + dt / 2);
        }
        var x = st.inF ? 390 : 150, y = st.inF ? 312 : 262;
        sp.at(x, y); bun.set(st.heating && !st.inF, T);
        var viv = burning ? (st.gas === 'O2' ? 1.6 : 0.9) : st.heat;
        hot.setAttribute('opacity', Math.min(1, viv * 0.8)); hot.setAttribute('r', 22 + 14 * Math.min(1.6, viv)); hotC.setAttribute('opacity', Math.min(1, viv) * (0.7 + 0.3 * Math.sin(T * 12)));
        var used = st.p / 1; coal.setAttribute('transform', 'translate(0 -6) scale(' + (1 - 0.35 * Math.min(1, used)) + ')');
        SP.forEach(function (c, k) { var on = burning && st.gas === 'O2'; c.style.display = on ? '' : 'none'; var ph = (T * 1.6 + C.rnd(k, 1)) % 1, a = C.rnd(k, 2) * 6.28; attr(c, { cx: Math.cos(a) * (10 + ph * 40), cy: -8 + Math.sin(a) * (6 + ph * 30) - ph * 20, opacity: 1 - ph }); });
        var co2 = st.p, milk = st.lime * Math.min(1, co2 * 3);
        fl.set({ gas: st.gas === 'O2' ? '#9FD7FF' : '#C9D2E3', gasOp: 0.1, label: st.gas === 'O2' ? 'flacon de dioxygène' : 'flacon d’air', liq: st.lime > 0 ? 34 * Math.min(1, st.lime * 2) : 0, liqCol: milk > 0.05 ? '#F4F6FA' : '#DDEFFF', liqOp: 0.4 + 0.5 * milk, T: T });
        lbl.textContent = burning ? (st.gas === 'O2' ? 'Le charbon brûle vivement, sans flamme' : 'Le charbon rougeoie faiblement') : st.inF && st.p >= O2tot - 0.001 && st.heat < 0.6 ? 'Combustion terminée : plus de dioxygène' : st.heat > 0.8 && !st.inF ? 'Charbon incandescent : plonge-le dans le flacon' : st.heating ? 'Le charbon chauffe…' : 'Chauffe d’abord le charbon';
        phase = burning ? (phase + dt * 0.5) % 1 : (st.p > 0 ? 1 : 0); if (st.t != null) phase = burning ? (T * 0.5) % 1 : (st.p > 0 ? 1 : 0);
        mv.set(R_OK, Math.min(1, phase * 1.3), 'C + O_{2} → CO_{2}');
        pT.textContent = 'DIOXYGÈNE RESTANT DANS LE FLACON'; attr(barF, { width: 244 * Math.max(0, O2tot - st.p) / 1 }); barF.setAttribute('fill', '#4FC3FF');
        ob[0].textContent = 'Réactifs : carbone + dioxygène'; ob[1].textContent = 'Produit : dioxyde de carbone';
        ob[2].textContent = st.lime > 0.5 ? (milk > 0.3 ? 'Eau de chaux troublée : CO₂ présent !' : 'Eau de chaux limpide : pas de CO₂') : 'Test : verse l’eau de chaux et agite';
        ob[2].setAttribute('fill', st.lime > 0.5 ? (milk > 0.3 ? '#3DD68C' : '#FFC773') : '#C9D2E3');
        ob[3].textContent = 'Le carbone et le dioxygène disparaissent,'; ob[4].textContent = 'du dioxyde de carbone apparaît.';
        res = { burning: burning, gas: st.gas, p: st.p, lime: st.lime, milk: milk, heat: st.heat, inF: st.inF };
      } else {
        var target = 650 * Math.pow(1 - st.aer, 2.2);
        if (st.t == null) st.co += (target - st.co) * Math.min(1, dt / 3); else st.co = target;
        var w = 52 * st.aer; attr(winO, { width: Math.max(0, w) });
        embG.setAttribute('opacity', 0.5 + 0.3 * Math.sin(T * 3) * 0.3 + st.aer * 0.3);
        var nCO = Math.round(Math.min(60, st.co / 8));
        CO.forEach(function (c, k) { var on = k < nCO; var ph = (C.rnd(k, 3) + T * 0.04) % 1; attr(c, { cx: 60 + C.rnd(k, 4) * 400 + Math.sin(T + k) * 10, cy: 360 - ph * 280, opacity: on ? 0.45 : 0 }); });
        var lvl = st.co < 35 ? 0 : st.co < 200 ? 1 : 2;
        detV.textContent = Math.round(st.co) + ' ppm'; detL.setAttribute('fill', ['#3DD68C', '#FFB547', '#FF5A4E'][lvl]); detL.setAttribute('opacity', lvl === 2 ? (Math.sin(T * 10) > 0 ? 1 : 0.2) : 1);
        warn.textContent = lvl === 2 ? 'DANGER : monoxyde de carbone !' : lvl === 1 ? 'Attention : aère davantage' : '';
        var inc = st.aer < 0.5;
        phase = (T * 0.4) % 1;
        mv.set(inc ? R_CO : R_OK, Math.min(1, phase * 1.3), inc ? '2 C + O_{2} → 2 CO' : 'C + O_{2} → CO_{2}');
        pT.textContent = 'AÉRATION DE LA PIÈCE'; attr(barF, { width: 244 * st.aer }); barF.setAttribute('fill', '#3DD68C');
        ob[0].textContent = inc ? 'Pas assez de dioxygène :' : 'Assez de dioxygène :'; ob[1].textContent = inc ? 'combustion incomplète' : 'combustion complète';
        ob[2].textContent = inc ? 'Il se forme du monoxyde de carbone CO,' : 'Il se forme surtout du CO₂.'; ob[2].setAttribute('fill', inc ? '#FF8A80' : '#3DD68C');
        ob[3].textContent = inc ? 'un gaz invisible, sans odeur… mortel.' : 'Ne jamais utiliser un réchaud'; ob[4].textContent = inc ? 'Aère la pièce !' : 'dans une pièce fermée.';
        res = { co: st.co, aer: st.aer, lvl: lvl };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le charbon de bois' }, { t: 11, title: 'Dans le dioxygène' }, { t: 23, title: 'Le gaz formé' }, { t: 35, title: 'Le bilan' }, { t: 46, title: 'Le danger du réchaud' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Le carbone brûle dans le <b>dioxygène</b>', 'sans flamme, en devenant incandescent ; plus vivement dans le dioxygène pur.', '#FF7A2E'],
      ['Il se forme du <b>dioxyde de carbone</b>', 'qui trouble l’<b>eau de chaux</b>. Bilan : C + O₂ → CO₂.', 'var(--blue)'],
      ['Sans assez d’air : <b>monoxyde de carbone</b>', 'gaz invisible, inodore et mortel : on aère toujours !', '#FF5A4E']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t;
        if (t < 46) { st.mode = 'labo'; st.gas = 'O2'; st.heating = t > 3 && t < 11; st.heat = t < 11 ? K.k(t, 4, 4) : t < 23 ? 1 : 1 - K.k(t, 22, 3) * 0.9; st.inF = t > 11; st.p = t < 11 ? 0 : 0.9 * K.k(t, 11.6, 10); st.lime = t < 23 ? 0 : K.k(t, 24, 3); }
        else { st.mode = 'rechaud'; st.aer = t < 52 ? 0.05 : 0.05 + 0.85 * K.k(t, 52, 4); }
        lab.step();
        tg.show(t, 1, 10.6, 290, 92, 'Le charbon de bois : surtout du carbone') || tg.show(t, 12, 22.6, 290, 92, 'Il brûle vivement, sans flamme') || tg.show(t, 26, 34.6, 290, 92, 'L’eau de chaux se trouble : CO₂ !') ||
          tg.show(t, 36, 45.6, 290, 92, 'Les atomes se réarrangent : C + O₂ → CO₂') || tg.show(t, 47, 51.8, 290, 92, 'Pièce fermée : du monoxyde de carbone') || tg.show(t, 53, 57.6, 290, 92, 'On aère : le danger disparaît');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un morceau de charbon de bois chauffé sur un bec Bunsen devient incandescent, puis brûle vivement dans un flacon de dioxygène ; l’eau de chaux versée dans le flacon se trouble ; une vue moléculaire montre C + O₂ → CO₂ ; enfin un réchaud à charbon dans une pièce fermée produit du monoxyde de carbone détecté par une alarme',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'Le charbon de bois est constitué presque uniquement de carbone.', sub: 'Le charbon de bois : du <b>carbone</b>.' },
      { t: 4.6, d: 6.2, say: 'Chauffons-le sur la flamme : il rougit, il devient incandescent.', sub: 'Chauffé, il devient <b>incandescent</b>.' },
      { t: 11, d: 5.6, say: 'Plongeons-le dans un flacon de dioxygène : il brûle vivement, sans flamme, en lançant des étincelles.', sub: 'Dans le <b>dioxygène</b>, il brûle vivement, sans flamme.' },
      { t: 16.8, d: 6, say: 'Peu à peu, la combustion ralentit puis s’arrête : le dioxygène du flacon a été consommé.', sub: 'Le dioxygène est <b>consommé</b> : la combustion s’arrête.' },
      { t: 23, d: 5, say: 'Quel gaz s’est formé ? Versons de l’eau de chaux et agitons.', sub: 'Versons de l’<b>eau de chaux</b>…' },
      { t: 28.2, d: 6.6, say: 'L’eau de chaux se trouble : il s’est formé du dioxyde de carbone.', sub: '…elle se <b>trouble</b> : c’est du <b>dioxyde de carbone</b>.' },
      { t: 35, d: 10.4, say: 'À l’échelle des molécules, un atome de carbone et une molécule de dioxygène se réarrangent en une molécule de dioxyde de carbone. Les atomes ne disparaissent pas : ils changent de partenaires.', sub: 'C + O₂ → CO₂ : les atomes <b>se réarrangent</b>.' },
      { t: 46, d: 6, say: 'Attention : dans une pièce fermée, un réchaud à charbon manque de dioxygène. Il produit du monoxyde de carbone.', sub: 'Pièce fermée : du <b>monoxyde de carbone</b>…' },
      { t: 52.2, d: 5.6, say: 'Ce gaz est invisible, sans odeur et mortel. Il faut toujours aérer.', sub: '…invisible et mortel : il faut <b>aérer</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : le carbone brûle dans le dioxygène en formant du dioxyde de carbone.', sub: 'Carbone + dioxygène → <b>dioxyde de carbone</b>.' },
      { t: 62.6, d: 4.2, say: 'Le dioxyde de carbone trouble l’eau de chaux.', sub: 'Il <b>trouble l’eau de chaux</b>.' },
      { t: 67, d: 5, say: 'Une combustion incomplète produit du monoxyde de carbone, très dangereux.', sub: 'Combustion incomplète : <b>CO</b>, très dangereux.' }
    ],
    learn: [
      { t: 22, ch: 1, html: 'Le carbone brûle <b>sans flamme</b>, vivement dans le dioxygène.' },
      { t: 34, ch: 2, html: 'Le <b>dioxyde de carbone</b> trouble l’eau de chaux.' },
      { t: 45, ch: 3, html: 'Bilan : <b>C + O₂ → CO₂</b>.' },
      { t: 57, ch: 4, html: 'Manque d’air : <b>monoxyde de carbone</b> CO, mortel.' }
    ],
    question: { q: 'Le gaz qui trouble l’eau de chaux est :', o: ['le dioxygène', 'le dioxyde de carbone', 'le diazote', 'la vapeur d’eau'], a: 1, e: 'C’est le test du dioxyde de carbone.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [40, 40, 500, 406] }, { n: 'Molécules', r: [560, 22, 280, 196] }, { n: 'Bilan', r: [560, 230, 280, 216] }],
    alt: 'Laboratoire : un bec Bunsen, un têt à combustion avec du charbon de bois et un flacon d’air ou de dioxygène ; on chauffe, on plonge, puis on teste le gaz formé à l’eau de chaux. Second mode : un réchaud à charbon dans une pièce avec une fenêtre réglable et un détecteur de monoxyde de carbone',
    steps: [
      'Chauffe le charbon sur la flamme jusqu’à ce qu’il soit incandescent.',
      'Plonge-le dans le flacon de dioxygène, puis recommence avec un flacon d’air : compare.',
      'Verse l’eau de chaux dans le flacon et agite : que montre ce test ?',
      'Mode réchaud : règle l’aération et surveille le détecteur de monoxyde de carbone.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'labo', options: [{ v: 'labo', l: 'Au laboratoire' }, { v: 'rechaud', l: 'Le réchaud à charbon' }], onChange: function (v) { st.mode = v; vis(); } });
      var cG = c.seg({ label: 'Flacon', value: 'O2', options: [{ v: 'O2', l: 'dioxygène pur' }, { v: 'air', l: 'air' }], onChange: function (v) { st.gas = v; st.p = 0; st.lime = 0; st.liming = false; st.inF = false; } });
      var r1 = c.row();
      var bH = c.button({ label: 'Chauffer le charbon', sm: true, into: r1, onClick: function () { st.inF = false; st.heating = true; } });
      var bP = c.button({ label: 'Plonger dans le flacon', primary: true, sm: true, into: r1, onClick: function () { st.heating = false; st.inF = !st.inF; api.sound('tick'); } });
      var bL = c.button({ label: 'Eau de chaux + agiter', sm: true, into: r1, onClick: function () { st.inF = false; st.heating = false; st.liming = true; } });
      var bR = c.button({ label: 'Nouveau flacon', sm: true, into: r1, onClick: function () { st.p = 0; st.lime = 0; st.liming = false; st.inF = false; } });
      var sA = c.slider({ label: 'Aération (fenêtre ouverte)', min: 0, max: 100, step: 5, value: 20, unit: '%', onInput: function (v) { st.aer = v / 100; } });
      function vis() { var lab2 = st.mode === 'labo'; cG.hide(!lab2); r1.style.display = lab2 ? 'flex' : 'none'; sA.hide(lab2); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Observation' }, { k: 'b', label: 'Mesure' }]);
      var last = {};
      api.loop(function () { last = lab.step(); bP.textContent = st.inF ? 'Retirer du flacon' : 'Plonger dans le flacon'; if (st.mode === 'labo') { ro.a.set(last.burning ? 'combustion vive' + (st.gas === 'air' ? ' (faible)' : '') : last.heat > 0.8 ? 'incandescent' : 'charbon froid'); ro.b.set('O₂ consommé : ' + Math.round(last.p * 100) + ' %'); } else { ro.a.set(last.lvl === 2 ? 'DANGER' : last.lvl === 1 ? 'attention' : 'air sain'); ro.b.set(Math.round(last.co) + ' ppm de CO'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bRl = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bRl.onclick = function () { rows.push(st.mode === 'labo' ? { e: 'flacon de ' + (st.gas === 'O2' ? 'dioxygène' : 'air'), o: (last.p > 0 ? 'combustion ' + (st.gas === 'O2' ? 'vive' : 'faible') : 'pas de combustion') + (st.lime > 0.5 ? (last.milk > 0.3 ? ', eau de chaux troublée' : ', eau de chaux limpide') : '') } : { e: 'réchaud, aération ' + Math.round(st.aer * 100) + ' %', o: Math.round(last.co) + ' ppm de CO' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>';
        api.chart.innerHTML = '<h3>Le bilan</h3><table class="mt"><tbody><tr><td>Réactifs</td><td>carbone + dioxygène</td></tr><tr><td>Produit</td><td>dioxyde de carbone</td></tr><tr><td>Équation</td><td>C + O<sub>2</sub> → CO<sub>2</sub></td></tr><tr><td>Test</td><td>le CO<sub>2</sub> trouble l’eau de chaux</td></tr><tr><td>Manque d’air</td><td>monoxyde de carbone CO (mortel)</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'labo'; st.gas = 'O2'; st.heat = 0; st.inF = false; st.p = 0; st.lime = 0; st.heating = false; st.liming = false; st.aer = 0.2; st.co = 300; cM.set('labo'); cG.set('O2'); sA.set(20); vis(); rows = []; paint(); });
      api.say('Commence par chauffer le charbon.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Chauffé, le charbon de bois (du <b>carbone</b>) devient incandescent. Plongé dans le <b>dioxygène</b>, il brûle vivement <b>sans flamme</b> ; dans l’air, la combustion est moins vive (l’air ne contient qu’environ 21 % de dioxygène). La combustion s’arrête quand le dioxygène est consommé.</p><p>Le gaz formé <b>trouble l’eau de chaux</b> : c’est du <b>dioxyde de carbone</b>. Bilan : carbone + dioxygène → dioxyde de carbone, soit <b>C + O<sub>2</sub> → CO<sub>2</sub></b>. Les atomes se réarrangent, ils ne disparaissent pas.</p><p>Quand le dioxygène manque (pièce fermée), la combustion est <b>incomplète</b> : il se forme du <b>monoxyde de carbone</b>, un gaz invisible, inodore et mortel. Il faut toujours aérer.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Combustion du carbone' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function labRow(api, lab, withLime) { var r = api.c.row(); api.c.button({ label: 'Chauffer', sm: true, into: r, onClick: function () { lab.st.inF = false; lab.st.heating = true; } }); api.c.button({ label: 'Plonger / retirer', sm: true, into: r, onClick: function () { lab.st.heating = false; lab.st.inF = !lab.st.inF; } }); if (withLime) api.c.button({ label: 'Eau de chaux', sm: true, into: r, onClick: function () { lab.st.inF = false; lab.st.liming = true; } }); }
  var DEFI = {
    title: 'Le défi du charbon',
    intro: 'Du feu, du gaz, un test… et une alarme ! Prêt ?',
    missions: [
      { title: 'Combustion vive', text: 'Fais brûler le charbon <span style="color:#FF7A2E">vivement</span> dans le dioxygène.', lumi: 'Il doit d’abord être incandescent.', hint: 'Chauffer, puis plonger.',
        build: function (api) { var lab = mini(api, { gas: 'O2' }); labRow(api, lab, false); return function () { var r = lab.res(); return r.burning && r.gas === 'O2' ? { ok: true, msg: 'Il brûle vivement, sans flamme !' } : { ok: false, msg: r.heat < 0.8 ? 'Le charbon n’est pas assez chaud.' : 'Plonge-le dans le flacon.' }; }; },
        e: 'Le carbone incandescent brûle vivement dans le dioxygène.' },
      { type: 'qcm', title: 'Le test', text: 'Quel réactif permet de mettre en évidence le dioxyde de carbone ?', o: ['le sulfate de cuivre', 'l’eau de chaux', 'la soude', 'le papier pH'], a: 1, hint: 'Elle se trouble.', e: 'Le CO₂ trouble l’eau de chaux.' },
      { title: 'La preuve', text: 'Brûle le charbon dans le flacon, puis <b>prouve</b> qu’il s’est formé du dioxyde de carbone.', lumi: 'Un test qui trouble…', hint: 'Combustion, puis eau de chaux.',
        build: function (api) { var lab = mini(api, { gas: 'O2' }); labRow(api, lab, true); return function () { var r = lab.res(); return r.milk > 0.3 && r.lime > 0.9 ? { ok: true, msg: 'Eau de chaux troublée : du CO₂ s’est formé.' } : { ok: false, msg: r.p < 0.1 ? 'Il faut d’abord une combustion.' : 'Fais le test à l’eau de chaux.' }; }; },
        e: 'L’eau de chaux troublée prouve la présence de CO₂.' },
      { type: 'qcm', title: 'Le bilan', text: 'Dans la combustion du carbone, les réactifs sont :', o: ['le carbone et le dioxyde de carbone', 'le carbone et le dioxygène', 'le dioxygène et l’eau', 'le dioxyde de carbone seul'], a: 1, hint: 'Ce qui disparaît…', e: 'C + O₂ → CO₂ : carbone et dioxygène sont consommés.' },
      { title: 'Alarme !', text: 'Le détecteur sonne ! Rends l’air de la pièce <span style="color:#3DD68C">sain</span> (moins de 35 ppm).', lumi: 'Le réchaud manque de dioxygène…', hint: 'Ouvre grand la fenêtre.',
        build: function (api) { var lab = mini(api, { mode: 'rechaud', aer: 0.05, co: 560 }); api.c.slider({ label: 'Aération', min: 0, max: 100, step: 5, value: 5, unit: '%', onInput: function (v) { lab.st.aer = v / 100; } }); return function () { var r = lab.res(); return r.co < 35 ? { ok: true, msg: 'Air sain : ' + Math.round(r.co) + ' ppm.' } : { ok: false, msg: Math.round(r.co) + ' ppm : encore dangereux.' }; }; },
        e: 'En aérant, la combustion devient complète et le CO est évacué.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un morceau de carbone brûle dans un récipient. Quel rôle joue le dioxygène et comment identifier le produit formé ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-combustion-carbone', level: '5e', theme: 'Mélanges et réactions chimiques', title: 'Combustion du carbone', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le charbon de bois est essentiellement constitué de <b>carbone</b>. Chauffé, il devient incandescent ; il brûle <b>sans flamme</b>, plus vivement dans le <b>dioxygène</b> pur que dans l’air.',
      'Au cours de la combustion, le carbone et le dioxygène (les <b>réactifs</b>) disparaissent ; il se forme du <b>dioxyde de carbone</b> (le <b>produit</b>).',
      'Le dioxyde de carbone <b>trouble l’eau de chaux</b>.',
      'Bilan : carbone + dioxygène → dioxyde de carbone ; équation : <b>C + O<sub>2</sub> → CO<sub>2</sub></b>. Les atomes se conservent et se réarrangent.',
      'Si le dioxygène manque, la combustion est <b>incomplète</b> : il se forme du <b>monoxyde de carbone</b> (CO), gaz invisible, inodore et <b>mortel</b>. On n’utilise jamais un réchaud à charbon dans une pièce fermée.'
    ],
    quiz: [
      { q: 'Le charbon de bois brûle :', o: ['avec une grande flamme bleue', 'sans flamme, en devenant incandescent', 'sans dégager de chaleur', 'seulement dans l’eau'], a: 1, e: 'Il rougeoie sans flamme.' },
      { q: 'La combustion du carbone produit :', o: ['du dioxygène', 'du dioxyde de carbone', 'de l’eau', 'du soufre'], a: 1, e: 'C + O₂ → CO₂.' },
      { q: 'Dans le dioxygène pur, le carbone brûle :', o: ['moins vite que dans l’air', 'plus vivement que dans l’air', 'pas du tout', 'de la même façon'], a: 1, e: 'L’air ne contient que 21 % de dioxygène.' },
      { q: 'Le monoxyde de carbone se forme quand :', o: ['il y a trop de dioxygène', 'le dioxygène manque', 'on ajoute de l’eau de chaux', 'le charbon est mouillé'], a: 1, e: 'Combustion incomplète.' },
      { q: 'Le monoxyde de carbone est :', o: ['coloré et odorant', 'invisible, inodore et mortel', 'sans danger', 'un liquide'], a: 1, e: 'D’où le danger des réchauds dans les pièces fermées.' }
    ]
  });
})();

