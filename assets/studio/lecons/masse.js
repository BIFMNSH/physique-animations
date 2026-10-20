/* 6e · Mesure de grandeurs physiques · Leçon : Masse d’un solide et d’un liquide */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var OBJ = { orange: { n: 'orange', m: 185 }, savon: { n: 'morceau de savon', m: 125 }, cahier: { n: 'cahier', m: 80 } };
  var MASSES = [100, 50, 20, 10, 5], BECH = 95, LIQ = { eau: { n: 'eau', r: 1, c: '#4FA8FF' }, huile: { n: 'huile', r: 0.92, c: '#E2B23C' } };
  function Lab(G, o) {
    var st = Object.assign({ mode: 'roberval', obj: 'orange', on: {}, ang: 0, bech: true, tare: 0, V: 0, liq: 'eau', g: 1000, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 400, width: 500, height: 46, fill: '#151D2E' }, G);
    /* ---------- ROBERVAL ---------- */
    var R = s('g', {}, G), BXc = 290, BY = 262, HL = 140;
    s('path', { d: 'M200 400 h180 l-16 -30 h-148z', fill: '#4A5160', stroke: '#6B7280', 'stroke-width': 2 }, R); s('rect', { x: BXc - 9, y: BY, width: 18, height: 110, fill: '#7D89A3' }, R);
    var beam = s('g', {}, R); s('rect', { x: -HL - 10, y: -6, width: 2 * HL + 20, height: 12, rx: 6, fill: '#C9D2E3' }, beam); s('path', { d: 'M0 -2 v-50', stroke: '#E5484D', 'stroke-width': 3 }, beam); s('circle', { r: 7, fill: '#9AA6BC' }, beam);
    s('path', { d: 'M' + (BXc - 30) + ' ' + (BY - 60) + ' a30 30 0 0 1 60 0', fill: 'none', stroke: '#7D89A3', 'stroke-width': 2 }, R); s('line', { x1: BXc, y1: BY - 66, x2: BXc, y2: BY - 58, stroke: '#3DD68C', 'stroke-width': 3 }, R);
    function plate() { var g = s('g', {}, R); s('rect', { x: -4, y: -40, width: 8, height: 40, fill: '#9AA6BC' }, g); s('ellipse', { cx: 0, cy: -40, rx: 64, ry: 9, fill: '#D8DEE9', stroke: '#9AA6BC', 'stroke-width': 2 }, g); var c = s('g', {}, g); return { g: g, c: c }; }
    var pL = plate(), pR = plate();
    var objs = {}; objs.orange = s('g', {}, pL.c); s('circle', { cx: 0, cy: -70, r: 30, fill: '#FF9A2E' }, objs.orange); s('path', { d: 'M0 -100 q6 -10 14 -8', stroke: '#2F7D4F', 'stroke-width': 4, fill: 'none' }, objs.orange);
    objs.savon = s('g', {}, pL.c); s('rect', { x: -40, y: -76, width: 80, height: 34, rx: 10, fill: '#7FD1AE' }, objs.savon); s('text', { x: 0, y: -54, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#1E5A40', text: 'SAVON' }, objs.savon);
    objs.cahier = s('g', {}, pL.c); s('rect', { x: -48, y: -56, width: 96, height: 14, rx: 2, fill: '#4C6BFF' }, objs.cahier); s('rect', { x: -46, y: -54, width: 92, height: 4, fill: '#EEF2F8' }, objs.cahier);
    var MG = MASSES.map(function (m) { var g = s('g', {}, pR.c), w = 12 + Math.sqrt(m) * 2.4, h = 8 + Math.sqrt(m) * 2.2; s('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 3, fill: '#C8A46A', stroke: '#8A6A3A', 'stroke-width': 1.5 }, g); s('rect', { x: -w / 6, y: -h - 6, width: w / 3, height: 6, rx: 2, fill: '#C8A46A' }, g); s('text', { x: 0, y: -h / 2 + 4, 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 900, fill: '#3A2A10', text: m + ' g' }, g); return { g: g, w: w, h: h, m: m }; });
    var rMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, R);
    var sumBox = s('g', {}, R); s('rect', { x: 392, y: 96, width: 132, height: 54, rx: 12, fill: '#EEF2F8' }, sumBox); s('text', { x: 458, y: 113, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A3426', text: 'MASSES MARQUÉES' }, sumBox); var sumT = s('text', { x: 458, y: 140, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#1A1F28' }, sumBox);
    /* ---------- ÉLECTRONIQUE ---------- */
    var E = s('g', {}, G);
    s('path', { d: 'M160 400 l14 -70 h232 l14 70z', fill: '#2F3646', stroke: '#4A5160', 'stroke-width': 2 }, E); s('rect', { x: 200, y: 318, width: 180, height: 14, rx: 4, fill: '#C9D2E3' }, E);
    s('rect', { x: 210, y: 352, width: 110, height: 34, rx: 6, fill: '#0B1F14' }, E); var disp = s('text', { x: 312, y: 378, 'text-anchor': 'end', 'font-size': 22, 'font-weight': 900, fill: '#5CFF9D', 'font-family': 'monospace' }, E);
    var tareB = s('rect', { x: 336, y: 356, width: 60, height: 26, rx: 13, fill: '#E5484D' }, E); s('text', { x: 366, y: 374, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: '#FFF', text: 'TARE' }, E);
    var bk = s('g', {}, E); var bkL = s('rect', { x: 248, width: 84, fill: '#4FA8FF', opacity: 0.55 }, bk); s('path', { d: 'M244 190 l-6 -6 M244 186 V310 q0 8 8 8 H328 q8 0 8 -8 V186', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, bk); for (var k = 1; k <= 4; k++) s('line', { x1: 248, x2: 262, y1: 318 - k * 25, y2: 318 - k * 25, stroke: '#BFE6FF', 'stroke-width': 1.2 }, bk);
    var eMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, E);
    var eq = s('text', { x: 290, y: 130, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, E), eq2 = s('text', { x: 290, y: 154, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, E);
    /* ---------- UNITÉS ---------- */
    var U = s('g', {}, G);
    var sack = s('g', {}, U); s('path', { d: 'M110 380 q-20 -100 10 -170 q10 -20 30 -24 h60 q20 4 30 24 q30 70 10 170z', fill: '#E6D3B8', stroke: '#B79B72', 'stroke-width': 2 }, sack); s('path', { d: 'M150 186 q30 -14 60 0', stroke: '#B79B72', 'stroke-width': 4, fill: 'none' }, sack); s('text', { x: 180, y: 290, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#6B4E36', text: 'RIZ' }, sack); s('text', { x: 180, y: 314, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#6B4E36', text: '1 kg' }, sack);
    s('text', { x: 180, y: 396, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'sachet de riz : 1 kg = 1 000 g' }, U);
    var grains = s('g', {}, U), GRS = []; for (k = 0; k < 40; k++) GRS.push(s('path', { d: 'M-8 8 q-2 -10 2 -14 h12 q4 4 2 14z', fill: '#E6D3B8', stroke: '#B79B72', 'stroke-width': 1.2, transform: 'translate(' + (336 + (k % 8) * 22) + ' ' + (364 - Math.floor(k / 8) * 22) + ')' }, grains));
    var uBig = s('text', { x: 290, y: 118, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#EEF2F8' }, U), uSub = s('text', { x: 420, y: 396, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3' }, U);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'LA MASSE' }, P);
    var cellT = ['kg', 'hg', 'dag', 'g'].map(function (h, k) { var x = PX + 22 + k * 59; s('rect', { x: x, y: 66, width: 55, height: 26, rx: 6, fill: '#1A2540' }, P); s('text', { x: x + 27.5, y: 84, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: h }, P); return s('text', { x: x + 27.5, y: 120, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#EEF2F8' }, P); });
    s('text', { x: PX + 140, y: 150, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3', text: 'tableau de conversion' }, P);
    var big = s('text', { x: PX + 140, y: 196, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 900, fill: '#FFC773' }, P);
    [['1 kg = 1 000 g', '#FFC773'], ['1 t = 1 000 kg', '#C9D2E3'], ['1 g = 1 000 mg', '#C9D2E3']].forEach(function (r, k) { s('text', { x: PX + 140, y: 236 + k * 24, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: r[1], text: r[0] }, P); });
    var pq = [0, 1, 2, 3].map(function (k) { return s('text', { x: PX + 140, y: 334 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    function table(g) { g = Math.max(0, Math.round(g)); var d = String(g).padStart(4, '0').split(''), lead = true; d.forEach(function (c, k) { if (c !== '0' || k === 3) lead = false; cellT[k].textContent = lead && k < 3 ? '' : c; }); if (g >= 10000) cellT[0].textContent = String(Math.floor(g / 1000)); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      R.style.display = st.mode === 'roberval' ? '' : 'none'; E.style.display = st.mode === 'electronique' ? '' : 'none'; U.style.display = st.mode === 'unites' ? '' : 'none';
      if (st.mode === 'roberval') {
        var mL = OBJ[st.obj].m, mR = MASSES.reduce(function (a, m) { return a + (st.on[m] ? m : 0); }, 0), tgt = Math.max(-1, Math.min(1, (mR - mL) / 40)) * 9;
        if (st.t == null) st.ang += (tgt - st.ang) * Math.min(1, dt * 4); else st.ang = tgt;
        beam.setAttribute('transform', 'translate(' + BXc + ' ' + BY + ') rotate(' + st.ang.toFixed(2) + ')');
        var rad = st.ang * Math.PI / 180, dy = Math.sin(rad) * HL, dx = Math.cos(rad) * HL;
        pL.g.setAttribute('transform', 'translate(' + (BXc - dx) + ' ' + (BY - dy) + ')'); pR.g.setAttribute('transform', 'translate(' + (BXc + dx) + ' ' + (BY + dy) + ')');
        Object.keys(objs).forEach(function (k2) { objs[k2].style.display = k2 === st.obj ? '' : 'none'; });
        var xs = -44; MG.forEach(function (q) { var on = !!st.on[q.m]; q.g.style.display = on ? '' : 'none'; if (on) { q.g.setAttribute('transform', 'translate(' + (xs + q.w / 2) + ' -49)'); xs += q.w + 4; } });
        var eqb = mR === mL; sumT.textContent = mR + ' g'; sumT.setAttribute('fill', eqb ? '#1A7F4B' : '#1A1F28');
        rMsg.textContent = eqb ? 'Équilibre : la masse du ' + (st.obj === 'orange' ? 'fruit' : OBJ[st.obj].n) + ' est ' + mL + ' g' : mR === 0 ? 'Pose des masses marquées sur le plateau de droite' : mR > mL ? 'Trop lourd à droite : retire une masse' : 'Pas assez lourd à droite : ajoute une masse';
        big.textContent = eqb ? mL + ' g' : '? g'; table(eqb ? mL : 0);
        pset(['Balance de Roberval :', 'à l’équilibre, la masse de l’objet', 'est égale à la somme', 'des masses marquées.']);
        res = { eq: eqb, mR: mR, mL: mL, obj: st.obj };
      } else if (st.mode === 'electronique') {
        var L = LIQ[st.liq], mliq = st.V * L.r, raw = (st.bech ? BECH : 0) + (st.bech ? mliq : 0), shown = raw - st.tare;
        bk.style.display = st.bech ? '' : 'none'; var lh = st.V * 0.5; attr(bkL, { y: 318 - lh, height: lh }); bkL.setAttribute('fill', L.c);
        disp.textContent = fmt(shown, 0) + ' g';
        eq.textContent = st.tare > 0 ? 'Tare faite : on lit directement la masse du liquide' : st.V > 0 && st.bech ? 'm = m₂ − m₁ = ' + fmt(raw, 0) + ' − ' + BECH + ' = ' + fmt(mliq, 0) + ' g' : st.bech ? 'Bécher vide : m₁ = ' + BECH + ' g' : '';
        eq2.textContent = st.V > 0 ? st.V + ' mL d’' + L.n + ' → ' + fmt(mliq, 0) + ' g' : '';
        eMsg.textContent = !st.bech ? 'Pose le bécher vide sur la balance' : st.tare > 0 ? (st.V > 0 ? 'Masse de ' + L.n + ' : ' + fmt(shown, 0) + ' g' : 'Affichage remis à zéro : verse le liquide') : st.V > 0 ? 'La balance affiche bécher + liquide' : 'Appuie sur TARE pour enlever la masse du bécher';
        big.textContent = fmt(shown, 0) + ' g'; table(shown);
        pset(['Masse d’un liquide :', 'm = m₂ − m₁ (plein − vide)', 'ou on fait la tare', 'avec le récipient vide.']);
        res = { shown: shown, tare: st.tare, V: st.V, liq: st.liq, mliq: mliq, raw: raw };
      } else {
        var g = st.g; uBig.textContent = fmt(g / 1000, g % 1000 ? (g % 100 ? (g % 10 ? 3 : 2) : 1) : 0) + ' kg = ' + Math.round(g) + ' g';
        GRS.forEach(function (e, k) { e.style.display = k < g / 125 ? '' : 'none'; }); uSub.textContent = 'chaque petit sachet : 125 g';
        big.textContent = Math.round(g) + ' g'; table(g);
        pset(['Unité légale : le kilogramme (kg).', 'On utilise aussi le gramme (g),', 'la tonne (t) et le milligramme (mg).', 'Pour convertir : le tableau.']);
        res = { g: g };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Peser une orange' }, { t: 9, title: 'Les masses marquées' }, { t: 24, title: 'La balance électronique' }, { t: 36, title: 'Masse d’un liquide' }, { t: 46, title: 'Les unités' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La masse se mesure avec une <b>balance</b>', 'à l’équilibre, masse de l’objet = somme des masses marquées.', '#FFC773'],
      ['Masse d’un liquide : <b>m = m₂ − m₁</b>', 'ou on fait la <b>tare</b> avec le récipient vide.', '#4FA8FF'],
      ['<b>1 kg = 1 000 g</b>', 'l’unité légale de masse est le kilogramme.', '#3DD68C']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 24) { st.mode = 'roberval'; st.obj = 'orange'; var on = {}; [[100, 10.5], [50, 13.5], [20, 16.5], [10, 19], [5, 21.5]].forEach(function (q) { if (t >= q[1]) on[q[0]] = true; }); st.on = on; }
        else if (t < 36) { st.mode = 'electronique'; st.bech = t > 25; st.V = 0; st.liq = 'eau'; st.tare = t > 31 ? BECH : 0; }
        else if (t < 46) { st.mode = 'electronique'; st.bech = true; st.liq = 'eau'; st.tare = t < 41.5 ? 0 : BECH; st.V = t < 41.5 ? Math.round(150 * K.k(t, 36.5, 3)) : 150; }
        else { st.mode = 'unites'; st.g = Math.round(1000 * K.k(t, 46.5, 4) / 125) * 125; }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Quelle est la masse de l’orange ?') || tg.show(t, 10, 23.6, 290, 92, (st.on[5] ? 'Équilibre : 185 g !' : 'On ajoute des masses marquées…')) ||
          tg.show(t, 25.5, 30.6, 290, 92, 'Bécher vide : 95 g') || tg.show(t, 31.2, 35.6, 290, 92, 'TARE : retour à 0 g') || tg.show(t, 37, 41.2, 290, 92, '245 − 95 = 150 g') || tg.show(t, 41.8, 45.6, 290, 92, 'Avec la tare : 150 g directement') || tg.show(t, 47, 56.6, 290, 92, '1 kg = 1 000 g');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une orange sur le plateau gauche d’une balance de Roberval ; on ajoute 100, 50, 20, 10 et 5 g de masses marquées jusqu’à l’équilibre à 185 g ; une balance électronique pèse un bécher vide de 95 g, on fait la tare, puis on y verse 150 mL d’eau qui pèsent 150 g ; enfin un sachet de riz de 1 kg = 1 000 g',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'Au marché, on pèse les fruits. Quelle est la masse de cette orange ? Pour le savoir, on utilise une balance.', sub: 'La masse se mesure avec une <b>balance</b>.' },
      { t: 9, d: 14.6, say: 'Sur une balance de Roberval, on pose l’orange à gauche et des masses marquées à droite : cent, cinquante, vingt, dix, puis cinq grammes. À l’équilibre, la masse de l’orange est la somme des masses : cent quatre-vingt-cinq grammes.', sub: 'Équilibre : 100 + 50 + 20 + 10 + 5 = <b>185 g</b>.' },
      { t: 24, d: 6.8, say: 'Une balance électronique affiche directement la masse. Le bécher vide pèse quatre-vingt-quinze grammes.', sub: 'Bécher vide : <b>m₁ = 95 g</b>.' },
      { t: 31, d: 5, say: 'La touche tare remet l’affichage à zéro, avec le bécher dessus.', sub: 'La <b>tare</b> remet à zéro.' },
      { t: 36, d: 10, say: 'Sans tare, avec l’eau, la balance affiche deux cent quarante-cinq grammes : la masse de l’eau est deux cent quarante-cinq moins quatre-vingt-quinze, soit cent cinquante grammes. Avec la tare, on lit cent cinquante grammes directement.', sub: 'm = m₂ − m₁ = 245 − 95 = <b>150 g</b>.' },
      { t: 46, d: 10.6, say: 'L’unité légale de masse est le kilogramme. Un sachet de riz de un kilogramme contient mille grammes de riz.', sub: '<b>1 kg = 1 000 g</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : la masse se mesure avec une balance.', sub: 'On mesure la masse avec une balance.' },
      { t: 61.6, d: 4.2, say: 'Pour un liquide : m égale m deux moins m un, ou on fait la tare.', sub: 'm = m₂ − m₁, ou la tare.' },
      { t: 66, d: 5, say: 'Un kilogramme égale mille grammes.', sub: '1 kg = 1 000 g.' }
    ],
    learn: [
      { t: 23, ch: 1, html: 'À l’équilibre : masse de l’objet = <b>somme des masses marquées</b>.' },
      { t: 35, ch: 2, html: 'La <b>tare</b> remet l’affichage à zéro.' },
      { t: 45, ch: 3, html: 'Masse d’un liquide : <b>m = m₂ − m₁</b>.' },
      { t: 56, ch: 4, html: 'Unité légale : le <b>kilogramme</b> ; 1 kg = 1 000 g.' }
    ],
    question: { q: 'Un récipient vide pèse 120 g ; plein d’huile, 300 g. La masse d’huile est :', o: ['300 g', '420 g', '180 g', '120 g'], a: 2, e: '300 − 120 = 180 g.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Une balance de Roberval avec une orange, un savon ou un cahier et des masses marquées de 100, 50, 20, 10 et 5 g ; une balance électronique avec tare, un bécher et de l’eau ou de l’huile ; un mode unités avec un sachet de riz de 1 kg ; à droite, le tableau de conversion des masses',
    steps: [
      'Roberval : ajoute des masses marquées jusqu’à l’équilibre.',
      'Électronique : pèse le bécher vide, fais la tare.',
      'Verse un liquide et lis sa masse.',
      'Unités : convertis en kg et en g.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'roberval', options: [{ v: 'roberval', l: 'Balance de Roberval' }, { v: 'electronique', l: 'Balance électronique' }, { v: 'unites', l: 'Les unités' }], onChange: function (v) { st.mode = v; vis(); } });
      var cO = c.seg({ label: 'Objet à peser', value: 'orange', options: [{ v: 'orange', l: 'orange' }, { v: 'savon', l: 'savon' }, { v: 'cahier', l: 'cahier' }], onChange: function (v) { st.obj = v; } });
      var rw = c.row(), mb = MASSES.map(function (m) { var b = c.button({ label: m + ' g', sm: true, into: rw, onClick: function () { st.on[m] = !st.on[m]; b.classList.toggle('primary', !!st.on[m]); api.sound('tick'); } }); return b; });
      var tB = c.toggle({ label: 'Bécher sur la balance', value: true, onChange: function (v) { st.bech = v; if (!v) { st.V = 0; sV.set(0); } } });
      var bT = c.button({ label: 'TARE (remettre à zéro)', primary: true, onClick: function () { st.tare = st.bech ? BECH + st.V * LIQ[st.liq].r : 0; api.sound('tick'); } });
      var cL = c.seg({ label: 'Liquide', value: 'eau', options: [{ v: 'eau', l: 'eau' }, { v: 'huile', l: 'huile' }], onChange: function (v) { st.liq = v; } });
      var sV = c.slider({ label: 'Liquide versé', min: 0, max: 200, step: 10, value: 0, unit: 'mL', dec: 0, onInput: function (v) { st.V = st.bech ? v : 0; } });
      var bZ = c.button({ label: 'Annuler la tare', sm: true, onClick: function () { st.tare = 0; } });
      var sG = c.slider({ label: 'Masse', min: 0, max: 5000, step: 125, value: 1000, unit: 'g', dec: 0, onInput: function (v) { st.g = v; } });
      function vis() { var m = st.mode; cO.hide(m !== 'roberval'); rw.style.display = m === 'roberval' ? '' : 'none'; tB.hide(m !== 'electronique'); bT.style.display = bZ.style.display = m === 'electronique' ? '' : 'none'; cL.hide(m !== 'electronique'); sV.hide(m !== 'electronique'); sG.hide(m !== 'unites'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Lecture' }, { k: 'b', label: 'Résultat' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'roberval') { ro.a.set(last.mR + ' g de masses'); ro.b.set(last.eq ? 'équilibre : ' + last.mL + ' g' : 'pas d’équilibre'); } else if (st.mode === 'electronique') { ro.a.set(fmt(last.shown, 0) + ' g'); ro.b.set(st.V ? (st.tare ? 'masse du liquide' : 'bécher + liquide') : st.tare ? 'tare faite' : 'bécher vide'); } else { ro.a.set(fmt(st.g / 1000, 3) + ' kg'); ro.b.set(st.g + ' g'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var r = st.mode === 'roberval' ? { e: OBJ[st.obj].n, o: last.eq ? last.mL + ' g (équilibre)' : 'pas d’équilibre (' + last.mR + ' g)' } : st.mode === 'electronique' ? { e: st.V ? st.V + ' mL d’' + LIQ[st.liq].n : 'bécher vide', o: fmt(last.shown, 0) + ' g' + (st.tare ? ' (après tare)' : '') } : { e: 'conversion', o: st.g + ' g = ' + fmt(st.g / 1000, 3) + ' kg' }; rows.push(r); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Objet pesé</th><th>Masse</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Masse et volume d’un liquide</h3><table class="mt"><thead><tr><th>Liquide</th><th>100 mL</th><th>1 L</th></tr></thead><tbody><tr><td>eau</td><td>100 g</td><td>1 kg</td></tr><tr><td>huile</td><td>92 g</td><td>920 g</td></tr></tbody></table><p style="font-size:13px;opacity:.8">Même volume, masses différentes : masse et volume sont deux grandeurs différentes.</p>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'roberval', obj: 'orange', on: {}, ang: 0, bech: true, tare: 0, V: 0, liq: 'eau', g: 1000 }); cM.set('roberval'); cO.set('orange'); mb.forEach(function (b) { b.classList.remove('primary'); }); tB.set(true); cL.set('eau'); sV.set(0); sG.set(1000); vis(); rows = []; paint(); });
      api.say('Ajoute des masses marquées pour équilibrer la balance.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures.</p>';
        return '<p>La <b>masse</b> d’un corps se mesure avec une <b>balance</b>. Sur une balance de Roberval, à l’équilibre, la masse de l’objet est égale à la somme des masses marquées.</p><p>Pour un liquide, on pèse le récipient vide (m₁) puis plein (m₂) : <b>m = m₂ − m₁</b>. Avec une balance électronique, on peut aussi faire la <b>tare</b> avec le récipient vide et lire directement la masse du liquide.</p><p>L’unité légale est le <b>kilogramme (kg)</b> : 1 kg = 1 000 g ; 1 t = 1 000 kg. 100 mL d’eau ont une masse de 100 g, mais 100 mL d’huile seulement 92 g.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Mesure de masse' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function weights(api, lab) { var rw = api.c.row(); MASSES.forEach(function (m) { var b = api.c.button({ label: m + ' g', sm: true, into: rw, onClick: function () { lab.st.on[m] = !lab.st.on[m]; b.classList.toggle('primary', !!lab.st.on[m]); } }); }); }
  var DEFI = {
    title: 'Le défi du marché',
    intro: 'Pèse juste comme la vendeuse du marché de Treichville !',
    missions: [
      { title: 'Le savon', text: 'Équilibre la balance pour trouver la masse du <b>savon</b>.', lumi: 'Commence par la plus grosse masse.', hint: '100 + 20 + 5.',
        build: function (api) { var lab = mini(api, { obj: 'savon' }); weights(api, lab); return function () { var r = lab.res(); return r.eq ? { ok: true, msg: 'Équilibre : le savon a une masse de 125 g.' } : { ok: false, msg: r.mR > r.mL ? 'Trop lourd à droite.' : 'Pas assez lourd à droite.' }; }; },
        e: '100 + 20 + 5 = 125 g.' },
      { title: 'Le cahier', text: 'Trouve la masse du <b>cahier</b>.', lumi: 'Il est plus léger que 100 g.', hint: '50 + 20 + 10.',
        build: function (api) { var lab = mini(api, { obj: 'cahier' }); weights(api, lab); return function () { var r = lab.res(); return r.eq ? { ok: true, msg: 'Le cahier a une masse de 80 g.' } : { ok: false, msg: r.mR > r.mL ? 'Trop lourd à droite.' : 'Pas assez lourd à droite.' }; }; },
        e: '50 + 20 + 10 = 80 g.' },
      { title: '100 g d’huile', text: 'Avec la tare, verse et affiche exactement la masse de <span style="color:#E2B23C">100 mL d’huile</span>.', lumi: 'Tare d’abord, avec le bécher vide.', hint: 'TARE, puis 100 mL d’huile : 92 g.',
        build: function (api) { var lab = mini(api, { mode: 'electronique', liq: 'huile' }); api.c.button({ label: 'TARE', sm: true, onClick: function () { lab.st.tare = BECH + lab.st.V * 0.92; } }); api.c.slider({ label: 'Huile versée', min: 0, max: 200, step: 10, value: 0, unit: 'mL', dec: 0, onInput: function (v) { lab.st.V = v; } }); return function () { var r = lab.res(); return r.V === 100 && Math.abs(r.shown - 92) < 0.5 ? { ok: true, msg: '100 mL d’huile ont une masse de 92 g.' } : { ok: false, msg: r.V !== 100 ? 'Verse 100 mL.' : 'L’affichage inclut encore le bécher : fais la tare avec le bécher vide.' }; }; },
        e: 'Tare avec le bécher vide, puis on lit 92 g.' },
      { type: 'qcm', title: 'Calcul', text: 'Une bouteille vide : 40 g ; pleine d’eau : 540 g. Masse de l’eau ?', o: ['580 g', '500 g', '540 g', '40 g'], a: 1, hint: 'Plein − vide.', e: '540 − 40 = 500 g.' },
      { type: 'qcm', title: 'Conversion', text: 'Un sac de riz de 25 kg a une masse de :', o: ['250 g', '2 500 g', '25 000 g', '25 g'], a: 2, hint: '1 kg = 1 000 g.', e: '25 × 1 000 = 25 000 g.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On veut déterminer la masse d’un objet avec une balance. Quel protocole et quelle unité choisir ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-masse', level: '6e', theme: 'Mesure de grandeurs physiques', title: 'Masse d’un solide et d’un liquide', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La <b>masse</b> d’un corps se mesure avec une <b>balance</b> (de Roberval ou électronique).',
      'Balance de Roberval : à l’<b>équilibre</b>, la masse de l’objet est égale à la somme des <b>masses marquées</b>.',
      'Masse d’un liquide : on pèse le récipient vide (m₁) puis plein (m₂) : <b>m = m₂ − m₁</b> ; ou on fait la <b>tare</b> avec le récipient vide.',
      'L’unité légale de masse est le <b>kilogramme (kg)</b> : <b>1 kg = 1 000 g</b> ; 1 t = 1 000 kg ; 1 g = 1 000 mg.',
      'Masse et volume sont deux grandeurs différentes : 100 mL d’eau ont une masse de 100 g, 100 mL d’huile de 92 g.'
    ],
    quiz: [
      { q: 'La masse se mesure avec :', o: ['une éprouvette', 'une balance', 'un thermomètre', 'un ampèremètre'], a: 1, e: 'Une balance.' },
      { q: 'L’unité légale de masse est :', o: ['le gramme', 'le kilogramme', 'le litre', 'la tonne'], a: 1, e: 'Le kilogramme.' },
      { q: '1 kg est égal à :', o: ['100 g', '1 000 g', '10 g', '10 000 g'], a: 1, e: '1 kg = 1 000 g.' },
      { q: 'La touche « tare » d’une balance électronique sert à :', o: ['éteindre la balance', 'remettre l’affichage à zéro', 'changer d’unité', 'doubler la masse'], a: 1, e: 'Elle remet à zéro.' },
      { q: 'À l’équilibre, avec 100 g + 20 g + 10 g, la masse de l’objet est :', o: ['120 g', '130 g', '110 g', '100 g'], a: 1, e: '100 + 20 + 10 = 130 g.' }
    ]
  });
})();

