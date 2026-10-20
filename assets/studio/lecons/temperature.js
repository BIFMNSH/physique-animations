/* 6e · Propriétés physiques de la matière · Leçon : Température d’un corps */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var SAMP = {
    congel: { n: 'congélateur', T: -18, c: '#BFE6FF' }, glace: { n: 'glace fondante', T: 0, c: '#E8F4FF' }, robinet: { n: 'eau du robinet', T: 24, c: '#5FA8E8' },
    abidjan: { n: 'air d’Abidjan à midi', T: 32, c: '#FFE29A' }, corps: { n: 'corps humain', T: 37, c: '#F2A0B5' }, fievre: { n: 'enfant fiévreux', T: 39.5, c: '#FF8A80' }, bouillante: { n: 'eau bouillante', T: 100, c: '#4FA8FF' }
  };
  var TMIN = -20, TMAX = 110, X = 300, Y0 = 70, Y1 = 380;
  function yT(T) { return Y1 - (T - TMIN) / (TMAX - TMIN) * (Y1 - Y0); }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'reperes', samp: 'robinet', Tc: 24, eye: 0, stage: 0, live: 24, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- THERMOMÈTRE (repères et lecture) ---------- */
    var TH = s('g', {}, G);
    var beak = s('path', { d: 'M240 340 V430 q0 6 6 6 H354 q6 0 6 -6 V340', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, TH), bliq = s('rect', { x: 243, y: 362, width: 114, height: 72, opacity: 0.6 }, TH);
    var steamT = [0, 1, 2].map(function () { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2, fill: 'none' }, TH); });
    var iceT = [0, 1, 2].map(function (i) { return s('rect', { x: 256 + i * 32, y: 364, width: 20, height: 16, rx: 3, fill: '#FFFFFF', opacity: 0.85, transform: 'rotate(' + (i * 20 - 15) + ' ' + (266 + i * 32) + ' 372)' }, TH); });
    s('rect', { x: X - 13, y: Y0 - 14, width: 26, height: Y1 - Y0 + 40, rx: 13, fill: '#EEF2F8', stroke: '#C9D2E3', 'stroke-width': 2 }, TH);
    s('circle', { cx: X, cy: Y1 + 34, r: 17, fill: '#E5484D', stroke: '#C9D2E3', 'stroke-width': 2 }, TH);
    var col = s('rect', { x: X - 4, width: 8, rx: 4, fill: '#E5484D' }, TH);
    for (var g = TMIN; g <= TMAX; g += 5) { var yy = yT(g), big = g % 10 === 0; s('line', { x1: X + 13, x2: X + (big ? 30 : 22), y1: yy, y2: yy, stroke: '#3A4560', 'stroke-width': big ? 2 : 1 }, TH); if (g % 20 === 0) s('text', { x: X + 36, y: yy + 4, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: g }, TH); }
    s('text', { x: X + 36, y: Y0 - 18, 'font-size': 12, 'font-weight': 900, fill: '#FFC773', text: '°C' }, TH);
    var labs = s('g', {}, TH); [['tube fin', Y0 + 40], ['graduations', Y0 + 140], ['réservoir', Y1 + 34]].forEach(function (l) { s('text', { x: X - 26, y: l[1] + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#7D89A3', text: l[0] }, labs); s('line', { x1: X - 22, x2: X - 14, y1: l[1], y2: l[1], stroke: '#7D89A3' }, labs); });
    var eyeG = s('g', {}, TH); s('path', { d: 'M-22 0 q22 -16 44 0 q-22 16 -44 0z', fill: '#EEF2F8' }, eyeG); s('circle', { r: 7, fill: '#2B6CB0' }, eyeG);
    var sight = s('line', { stroke: '#FFC773', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, TH);
    var tMsg = s('text', { x: 450, y: 120, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: '#FFC773' }, TH), tMsg2 = s('text', { x: 450, y: 142, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, TH), tMsg3 = s('text', { x: 450, y: 160, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, TH);
    /* ---------- TROIS BASSINES ---------- */
    var B = s('g', {}, G), BOW = [['froid', 130, 10, '#80B8FF'], ['tiede', 290, 30, '#9BE7A5'], ['chaud', 450, 45, '#FF8A80']];
    var bowls = BOW.map(function (b) { s('path', { d: 'M' + (b[1] - 66) + ' 330 Q' + b[1] + ' 430 ' + (b[1] + 66) + ' 330 Z', fill: b[3], opacity: 0.35 }, B); s('path', { d: 'M' + (b[1] - 70) + ' 326 Q' + b[1] + ' 436 ' + (b[1] + 70) + ' 326', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, B); s('text', { x: b[1], y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: b[3], text: { froid: 'eau froide', tiede: 'eau tiède', chaud: 'eau chaude' }[b[0]] }, B); return s('text', { x: b[1], y: 312, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#7D89A3' }, B); });
    function handPath(flip) { return 'M0 0 q-14 -10 -10 -46 q4 -14 12 0 l2 22 l2 -40 q4 -12 10 0 l1 38 l3 -44 q5 -12 10 0 l0 44 l4 -38 q5 -10 10 2 l-2 50 q-4 26 -30 30 q-10 0 -12 -18z'; }
    var hL = s('path', { d: handPath(), fill: '#C68B59', stroke: '#8D5A35', 'stroke-width': 2 }, B), hR = s('path', { d: handPath(), fill: '#C68B59', stroke: '#8D5A35', 'stroke-width': 2 }, B);
    var bubL = s('g', {}, B), bubLR = s('rect', { width: 120, height: 34, rx: 17 }, bubL), bubLT = s('text', { x: 60, y: 22, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, bubL);
    var bubR = s('g', {}, B), bubRR = s('rect', { width: 120, height: 34, rx: 17 }, bubR), bubRT = s('text', { x: 60, y: 22, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, bubR);
    var bMsg = s('text', { x: 290, y: 150, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, B), bMsg2 = s('text', { x: 290, y: 172, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pt = s('text', { x: PX + 140, y: 52, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), pv = s('text', { x: PX + 140, y: 96, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: '#FFC773' }, P), pv2 = s('text', { x: PX + 140, y: 122, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    s('text', { x: PX + 20, y: 160, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'TEMPÉRATURES REPÈRES' }, P);
    var rep = [['eau bouillante', 100, '#4FA8FF'], ['corps humain', 37, '#F2A0B5'], ['glace fondante', 0, '#E8F4FF']].map(function (r, k) { var y = 186 + k * 28; s('circle', { cx: PX + 28, cy: y - 4, r: 6, fill: r[2] }, P); s('text', { x: PX + 42, y: y, 'font-size': 13, fill: '#C9D2E3', text: r[0] }, P); return s('text', { x: PX + 260, y: y, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 900, fill: r[2], text: r[1] + ' °C' }, P); });
    s('text', { x: PX + 20, y: 296, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lp = TK.particles(P, PX + 20, 304, 240, 132, 'liquide', '#4FA8FF');
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      TH.style.display = st.mode !== 'bassines' ? '' : 'none'; B.style.display = st.mode === 'bassines' ? '' : 'none';
      var Tshow;
      if (st.mode !== 'bassines') {
        var Sm = SAMP[st.samp], target = Sm.T;
        if (st.t == null) st.live += (target - st.live) * Math.min(1, dt / 1.2); else st.live = st.Tc != null ? st.Tc : target;
        var yc = yT(st.live); attr(col, { y: yc, height: Y1 + 30 - yc });
        bliq.setAttribute('fill', Sm.c); var ice = st.samp === 'glace' || st.samp === 'congel'; iceT.forEach(function (r) { r.style.display = ice ? '' : 'none'; });
        steamT.forEach(function (sm, i) { var ph = ((T * 0.8 + i / 3) % 1); sm.style.display = st.samp === 'bouillante' ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (262 + i * 36) + ' ' + (356 - ph * 50) + ')'); sm.setAttribute('opacity', 1 - ph); });
        var stable = Math.abs(st.live - target) < 0.3, lect = st.mode === 'lecture';
        eyeG.style.display = sight.style.display = lect ? '' : 'none';
        var eyeY = yc + st.eye * 60, err = lect ? (st.eye) * 6 : 0, read = Math.round((st.live + err) * 2) / 2;
        if (lect) { eyeG.setAttribute('transform', 'translate(160 ' + eyeY + ')'); attr(sight, { x1: 182, y1: eyeY, x2: X + 40, y2: eyeY + (yc - eyeY) * 1.4 }); }
        var good = Math.abs(st.eye) < 0.12;
        tMsg.textContent = !stable ? 'Attends : la colonne bouge encore…' : lect ? (good ? 'Lecture correcte : ' + fmt(read, 1) + ' °C' : 'Erreur : œil trop ' + (st.eye < 0 ? 'haut' : 'bas')) : Sm.n + ' : ' + fmt(target, 1) + ' °C';
        tMsg.setAttribute('fill', !stable ? '#A9B4C7' : lect && !good ? '#FF8A80' : '#FFC773');
        tMsg2.textContent = lect ? 'L’œil doit être en face' : 'Le réservoir est plongé'; tMsg3.textContent = lect ? 'du haut de la colonne' : 'dans le milieu à mesurer';
        pt.textContent = lect ? 'TU LIS' : 'TEMPÉRATURE MESURÉE'; pv.textContent = fmt(lect ? read : st.live, 1) + ' °C'; pv2.textContent = Sm.n;
        Tshow = st.live; res = { live: st.live, target: target, stable: stable, good: good, read: read, samp: st.samp, eye: st.eye };
      } else {
        var pos = st.stage === 0 ? [null, null] : st.stage === 1 ? ['froid', 'chaud'] : ['tiede', 'tiede'];
        BOW.forEach(function (b, k) { bowls[k].textContent = b[2] + ' °C'; });
        function bx(p) { return p === 'froid' ? 130 : p === 'tiede' ? 290 : 450; }
        var xl = pos[0] ? bx(pos[0]) - (st.stage === 2 ? 40 : 0) : 110, xr = pos[1] ? bx(pos[1]) + (st.stage === 2 ? 40 : 0) : 470, yh = pos[0] ? 350 : 220;
        hL.setAttribute('transform', 'translate(' + xl + ' ' + yh + ')'); hR.setAttribute('transform', 'translate(' + xr + ' ' + yh + ') scale(-1 1)');
        var sens = st.stage === 2 ? ['chaud !', 'froid !'] : st.stage === 1 ? ['froid', 'chaud'] : null;
        [[bubL, bubLR, bubLT, xl - 150, sens && sens[0]], [bubR, bubRR, bubRT, xr + 30, sens && sens[1]]].forEach(function (b) { b[0].style.display = b[4] ? '' : 'none'; if (!b[4]) return; b[0].setAttribute('transform', 'translate(' + Math.max(50, Math.min(390, b[3])) + ' ' + (yh - 80) + ')'); b[1].setAttribute('fill', /chaud/.test(b[4]) ? '#FF8A80' : '#80B8FF'); b[2].textContent = (b === null ? '' : '') + 'je sens : ' + b[4]; attr(b[1], { width: 140, x: -10 }); });
        bMsg.textContent = st.stage === 0 ? 'Trois bassines : froide, tiède et chaude' : st.stage === 1 ? 'Main gauche dans le froid, main droite dans le chaud' : 'Les deux mains dans la même eau tiède…';
        bMsg2.textContent = st.stage === 2 ? '…mais elles ne sentent pas la même chose ! Le toucher nous trompe.' : st.stage === 1 ? 'On attend une minute…' : '';
        pt.textContent = 'LE THERMOMÈTRE DIT'; pv.textContent = st.stage === 2 ? '30 °C' : '—'; pv2.textContent = st.stage === 2 ? 'pour les deux mains : même température' : 'plonge les mains';
        Tshow = 30; res = { stage: st.stage };
      }
      lp.set(Math.max(0, Math.min(1, (Tshow + 20) / 120)), T);
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le toucher nous trompe' }, { t: 14, title: 'Le thermomètre' }, { t: 25, title: 'Bien mesurer' }, { t: 38, title: 'Des températures repères' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Nos sensations ne permettent pas de <b>mesurer</b> une température', 'on utilise un <b>thermomètre</b>.', '#80B8FF'],
      ['La température s’exprime en <b>degrés Celsius (°C)</b>', 'réservoir plongé, attendre que la colonne s’arrête, œil en face.', '#FFC773'],
      ['Repères : glace fondante <b>0 °C</b>, corps <b>37 °C</b>', 'eau bouillante <b>100 °C</b> (au niveau de la mer).', '#3DD68C']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    var seq = [['glace', 38], ['corps', 43], ['fievre', 47], ['bouillante', 51], ['abidjan', 54.5]];
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 14) { st.mode = 'bassines'; st.stage = t < 3 ? 0 : t < 8 ? 1 : 2; }
        else if (t < 25) { st.mode = 'reperes'; st.samp = 'robinet'; st.Tc = 24; }
        else if (t < 38) { st.mode = 'lecture'; st.samp = 'robinet'; st.Tc = t < 28 ? 12 + 12 * K.k(t, 25, 3) : 24; st.eye = t < 31 ? -0.6 : t < 34 ? 0.6 : 0; }
        else { st.mode = 'reperes'; var cur = seq[0], prev = seq[0]; seq.forEach(function (q, i) { if (t >= q[1]) { prev = i ? seq[i - 1] : q; cur = q; } }); st.samp = cur[0]; st.Tc = SAMP[prev[0]].T + (SAMP[cur[0]].T - SAMP[prev[0]].T) * K.k(t, cur[1], 1.6); }
        lab.step();
        tg.show(t, 9, 13.6, 290, 92, 'Même eau tiède… deux sensations !') || tg.show(t, 15, 24.6, 290, 92, 'Réservoir, tube fin et graduations') || tg.show(t, 25.4, 27.8, 290, 92, 'On attend que la colonne s’arrête') || tg.show(t, 28.2, 33.8, 290, 92, 'Œil trop haut ou trop bas : erreur !') || tg.show(t, 34.2, 37.6, 290, 92, 'Œil en face : 24 °C') ||
          tg.show(t, 38.4, 56.6, 290, 92, SAMP[st.samp].n + ' : ' + fmt(SAMP[st.samp].T, 1) + ' °C');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : l’expérience des trois bassines, où deux mains sentent différemment la même eau tiède, puis un thermomètre, la bonne façon de le lire et des températures repères : glace fondante, corps humain, fièvre, eau bouillante, air d’Abidjan',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 3, say: 'Voici trois bassines : de l’eau froide, tiède et chaude.', sub: 'Trois bassines : froide, tiède, chaude.' },
      { t: 3.2, d: 4.6, say: 'Plongeons la main gauche dans l’eau froide et la main droite dans l’eau chaude, une minute.', sub: 'Main gauche au froid, main droite au chaud…' },
      { t: 8, d: 6, say: 'Puis les deux mains dans l’eau tiède. La gauche la trouve chaude, la droite la trouve froide ! Notre toucher nous trompe.', sub: '…dans l’eau tiède : le <b>toucher nous trompe</b> !' },
      { t: 14, d: 10.6, say: 'Pour mesurer une température, on utilise un thermomètre : un réservoir rempli de liquide coloré, un tube très fin et des graduations.', sub: 'Le <b>thermomètre</b> : réservoir, tube fin, graduations.' },
      { t: 25, d: 3, say: 'On plonge le réservoir et on attend que la colonne s’arrête.', sub: 'On attend que la colonne <b>s’arrête</b>.' },
      { t: 28.2, d: 9.6, say: 'Pour lire, l’œil doit être en face du haut de la colonne. Trop haut ou trop bas, on se trompe. Ici : vingt-quatre degrés Celsius.', sub: 'L’<b>œil en face</b> du haut de la colonne : 24 °C.' },
      { t: 38, d: 9, say: 'La glace fondante est à zéro degré Celsius. Le corps humain, à trente-sept degrés. Au-dessus, c’est la fièvre.', sub: 'Glace fondante : <b>0 °C</b> ; corps humain : <b>37 °C</b>.' },
      { t: 47.2, d: 9.6, say: 'L’eau bout à cent degrés Celsius. Et l’air d’Abidjan à midi atteint souvent trente-deux degrés.', sub: 'Eau bouillante : <b>100 °C</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : nos sensations ne suffisent pas, on mesure la température avec un thermomètre.', sub: 'On mesure avec un <b>thermomètre</b>.' },
      { t: 61.6, d: 4.2, say: 'La température s’exprime en degrés Celsius.', sub: 'Unité : le <b>degré Celsius</b> (°C).' },
      { t: 66, d: 5, say: 'Zéro degré pour la glace fondante, cent degrés pour l’eau qui bout.', sub: '0 °C et 100 °C : deux repères.' }
    ],
    learn: [
      { t: 13, ch: 0, html: 'Nos sensations de chaud et de froid <b>nous trompent</b>.' },
      { t: 24, ch: 1, html: 'Le <b>thermomètre</b> : réservoir, tube fin, graduations.' },
      { t: 37, ch: 2, html: 'Réservoir plongé, colonne stabilisée, <b>œil en face</b>.' },
      { t: 56, ch: 3, html: 'Repères : <b>0 °C</b>, <b>37 °C</b>, <b>100 °C</b>.' }
    ],
    question: { q: 'L’unité usuelle de température est :', o: ['le mètre', 'le degré Celsius', 'le gramme', 'le litre'], a: 1, e: 'Symbole °C.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Trois activités : l’expérience des trois bassines, un thermomètre plongé dans différents milieux (congélateur, glace fondante, eau du robinet, air d’Abidjan, corps humain, fièvre, eau bouillante) et la lecture d’un thermomètre avec la position de l’œil',
    steps: [
      'Bassines : place les mains dans le froid et le chaud, puis dans l’eau tiède. Que ressens-tu ?',
      'Repères : plonge le thermomètre dans chaque milieu et attends que la colonne s’arrête.',
      'Lecture : déplace l’œil. Où doit-il être pour bien lire ?',
      'Relève la température de chaque milieu.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'reperes', options: [{ v: 'bassines', l: 'Les trois bassines' }, { v: 'reperes', l: 'Températures repères' }, { v: 'lecture', l: 'Bien lire' }], onChange: function (v) { st.mode = v; vis(); } });
      var r1 = c.row(); c.button({ label: '1. Mains dans le froid et le chaud', sm: true, into: r1, onClick: function () { st.stage = 1; api.sound('tick'); } }); c.button({ label: '2. Mains dans l’eau tiède', sm: true, into: r1, onClick: function () { if (st.stage === 1) st.stage = 2; else api.say('Commence par l’étape 1.'); } });
      var cS = c.seg({ label: 'Plonger le thermomètre dans…', value: 'robinet', options: Object.keys(SAMP).map(function (k) { return { v: k, l: SAMP[k].n }; }), onChange: function (v) { st.samp = v; } });
      var sE = c.slider({ label: 'Position de l’œil (haut ↔ bas)', min: -100, max: 100, step: 5, value: 60, unit: '', onInput: function (v) { st.eye = v / 100; } });
      function vis() { r1.style.display = st.mode === 'bassines' ? 'flex' : 'none'; cS.hide(st.mode === 'bassines'); sE.hide(st.mode !== 'lecture'); if (st.mode === 'lecture') st.eye = sE.get() / 100; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Température' }, { k: 'b', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'bassines') { ro.a.set(st.stage === 2 ? '30 °C' : '—'); ro.b.set(st.stage === 2 ? 'sensations différentes' : 'étape ' + st.stage); } else { ro.a.set(fmt(last.live, 1) + ' °C'); ro.b.set(!last.stable ? 'la colonne bouge' : st.mode === 'lecture' ? (last.good ? 'lecture correcte' : 'erreur de lecture') : 'colonne stable'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes températures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode === 'bassines') return; if (!last.stable) { api.say('Attends que la colonne s’arrête.'); return; } rows = rows.filter(function (r) { return r.k !== st.samp; }); rows.push({ k: st.samp, n: SAMP[st.samp].n, T: SAMP[st.samp].T }); rows.sort(function (a, b) { return a.T - b.T; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Milieu</th><th>Température</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.n + '</td><td>' + fmt(r.T, 1) + ' °C</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>';
        api.chart.innerHTML = '<h3>Bien utiliser un thermomètre</h3><table class="mt"><tbody><tr><td>1</td><td>plonger le réservoir dans le milieu</td></tr><tr><td>2</td><td>ne pas toucher le fond ni les parois</td></tr><tr><td>3</td><td>attendre que la colonne s’arrête</td></tr><tr><td>4</td><td>lire avec l’œil en face du haut de la colonne</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'reperes'; st.samp = 'robinet'; st.stage = 0; st.eye = 0.6; cM.set('reperes'); cS.set('robinet'); sE.set(60); vis(); rows = []; paint(); });
      api.say('Plonge le thermomètre dans chaque milieu.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Mesure au moins 3 températures différentes.</p>';
        return '<p>Nos sensations de chaud et de froid ne permettent pas de mesurer une température : elles <b>nous trompent</b> (expérience des trois bassines).</p><p>On mesure la température avec un <b>thermomètre</b>. Elle s’exprime en <b>degrés Celsius (°C)</b>. Pour bien mesurer : réservoir plongé dans le milieu, sans toucher les parois ; attendre que la colonne s’arrête ; lire avec l’œil en face du haut de la colonne.</p><p>Repères : glace fondante <b>0 °C</b>, corps humain <b>37 °C</b> (fièvre au-delà de 38 °C), eau bouillante <b>100 °C</b> au niveau de la mer. Les températures négatives sont inférieures à 0 °C (congélateur : −18 °C).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Thermomètre' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function sampSeg(api, lab) { api.c.seg({ label: 'Plonger dans…', value: lab.st.samp, options: Object.keys(SAMP).map(function (k) { return { v: k, l: SAMP[k].n }; }), onChange: function (v) { lab.st.samp = v; } }); }
  var DEFI = {
    title: 'Le défi du thermomètre',
    intro: 'Chaud, froid, tiède… Ne te fie pas à tes mains : mesure !',
    missions: [
      { title: 'Zéro degré', text: 'Trouve le milieu dont la température est <span style="color:#80B8FF">0 °C</span>, et attends que la colonne s’arrête.', lumi: 'C’est un repère important.', hint: 'De la glace qui fond.',
        build: function (api) { var lab = mini(api, { samp: 'robinet' }); sampSeg(api, lab); return function () { var r = lab.res(); return r.samp === 'glace' && r.stable ? { ok: true, msg: 'Glace fondante : 0 °C.' } : { ok: false, msg: r.stable ? 'Ici : ' + fmt(r.target, 1) + ' °C.' : 'Attends que la colonne s’arrête.' }; }; },
        e: 'La glace fondante est à 0 °C.' },
      { type: 'qcm', title: 'Les bassines', text: 'Après avoir été dans l’eau chaude, la main droite plongée dans l’eau tiède la sent :', o: ['chaude', 'froide', 'tiède', 'bouillante'], a: 1, hint: 'Elle vient d’un endroit plus chaud.', e: 'Elle la sent froide : le toucher nous trompe.' },
      { title: 'Bien lire', text: 'Place ton œil pour faire une <span style="color:var(--amber)">lecture correcte</span>.', lumi: 'Regarde où va la ligne de visée.', hint: 'En face du haut de la colonne.',
        build: function (api) { var lab = mini(api, { mode: 'lecture', samp: 'robinet', eye: 0.7 }); api.c.slider({ label: 'Position de l’œil', min: -100, max: 100, step: 5, value: 70, onInput: function (v) { lab.st.eye = v / 100; } }); return function () { var r = lab.res(); return r.good && r.stable ? { ok: true, msg: 'Lecture correcte : ' + fmt(r.read, 1) + ' °C.' } : { ok: false, msg: 'Tu lis ' + fmt(r.read, 1) + ' °C : œil mal placé.' }; }; },
        e: 'L’œil doit être en face du haut de la colonne.' },
      { type: 'qcm', title: 'La fièvre', text: 'Un enfant a 39,5 °C. Il :', o: ['a une température normale', 'a de la fièvre', 'a trop froid', 'est en hypothermie'], a: 1, hint: 'La température normale est 37 °C.', e: 'Au-dessus de 38 °C, c’est de la fièvre.' },
      { title: 'Ça bout !', text: 'Mesure la température de l’<b>eau bouillante</b>.', lumi: 'Le thermomètre doit monter très haut.', hint: 'Choisis l’eau bouillante.',
        build: function (api) { var lab = mini(api, { samp: 'glace' }); sampSeg(api, lab); return function () { var r = lab.res(); return r.samp === 'bouillante' && r.stable ? { ok: true, msg: 'Eau bouillante : 100 °C.' } : { ok: false, msg: r.stable ? fmt(r.target, 1) + ' °C : ce n’est pas l’eau bouillante.' : 'Attends la stabilisation.' }; }; },
        e: 'Au niveau de la mer, l’eau bout à 100 °C.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux corps donnent des sensations différentes au toucher. Comment comparer objectivement leurs températures ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-temperature', level: '6e', theme: 'Propriétés physiques de la matière', title: 'Température d’un corps', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Nos sensations de chaud et de froid ne permettent pas de mesurer une température : elles peuvent <b>nous tromper</b>.',
      'On mesure la température avec un <b>thermomètre</b> (réservoir, tube fin, graduations). Elle s’exprime en <b>degrés Celsius</b> (°C).',
      'Pour bien mesurer : plonger le réservoir dans le milieu sans toucher les parois, <b>attendre</b> que la colonne s’arrête, lire avec l’<b>œil en face</b> du haut de la colonne.',
      'Températures repères : glace fondante <b>0 °C</b> ; corps humain <b>37 °C</b> ; eau bouillante <b>100 °C</b> (au niveau de la mer).',
      'Une température inférieure à 0 °C est <b>négative</b> (congélateur : −18 °C).'
    ],
    quiz: [
      { q: 'Pour connaître la température d’un liquide, on utilise :', o: ['la main', 'un thermomètre', 'une balance', 'une règle'], a: 1, e: 'Le toucher nous trompe.' },
      { q: 'La glace fondante est à :', o: ['100 °C', '37 °C', '0 °C', '−18 °C'], a: 2, e: 'Repère 0 °C.' },
      { q: 'Pour lire un thermomètre, l’œil doit être :', o: ['au-dessus', 'en face du haut de la colonne', 'en dessous', 'n’importe où'], a: 1, e: 'Sinon la lecture est fausse.' },
      { q: 'La température normale du corps humain est d’environ :', o: ['20 °C', '37 °C', '50 °C', '100 °C'], a: 1, e: 'Environ 37 °C.' },
      { q: '−18 °C est une température :', o: ['positive', 'négative', 'nulle', 'impossible'], a: 1, e: 'Inférieure à 0 °C.' }
    ]
  });
})();

