/* 5e · Mesure de grandeurs physiques · Leçon : Intensité du courant électrique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729', U = 3, R1 = 20, R2 = 30, UN = 3;
  /* fentes possibles pour l’ampèremètre : centre, orientation, [amont, aval] (sens du courant) */
  var SLOTS = {
    serie: { A: { x: 100, y: 250, v: true, up: [100, 228], dn: [100, 272], n: 'A (à gauche)' }, B: { x: 285, y: 120, v: false, up: [307, 120], dn: [263, 120], n: 'B (entre les lampes)' }, C: { x: 470, y: 250, v: true, up: [470, 272], dn: [470, 228], n: 'C (à droite)' } },
    der: { P: { x: 100, y: 255, v: true, up: [100, 233], dn: [100, 277], n: 'branche principale' }, '1': { x: 260, y: 170, v: true, up: [260, 192], dn: [260, 148], n: 'branche de L1' }, '2': { x: 400, y: 170, v: true, up: [400, 192], dn: [400, 148], n: 'branche de L2' } }
  };
  function solve(st) {
    var I1, I2, I, V1, V2, sc = false;
    if (st.mode === 'serie') { if (st.wrong) { I = U / R2; V1 = 0; V2 = U; } else { I = U / (R1 + R2); V1 = I * R1; V2 = I * R2; } I1 = I2 = I; }
    else { if (st.wrong) { sc = true; I = 8; I1 = 0; I2 = 0; V1 = V2 = 0; } else { I1 = U / R1; I2 = U / R2; I = I1 + I2; V1 = V2 = U; } }
    var meas = st.wrong ? (st.mode === 'serie' ? I : 8) : st.mode === 'serie' ? I : st.slot === 'P' ? I : st.slot === '1' ? I1 : I2;
    return { I: I, I1: I1, I2: I2, V1: V1, V2: V2, sc: sc, meas: (st.rev ? -1 : 1) * meas };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'serie', slot: 'B', cal: 'mA200', rev: false, wrong: false, meter: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 50, width: 500, height: 396, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), key = '', P = null;
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild); P = { w: [], L: [] };
      if (st.mode === 'serie') {
        P.w.push(E.wire(C, 'M333 380 H470 V120 H100 V380 H237'));
        P.L.push(E.lamp(C, 210, 120, { r: 22 })); P.L.push(E.lamp(C, 360, 120, { r: 22 }));
        s('text', { x: 210, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L1' }, C); s('text', { x: 360, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L2' }, C);
        P.bat = E.battery(C, 285, 380, { U: U });
      } else {
        P.w.push(E.wire(C, 'M223 400 H400 M400 400 V110 M260 400 V110 M400 110 H100 V400 H127'));
        P.L.push(E.lamp(C, 260, 270, { r: 22 })); P.L.push(E.lamp(C, 400, 270, { r: 22 }));
        [[260, 110], [260, 400], [400, 110], [400, 400]].forEach(function (p) { E.dot(C, p[0], p[1]); });
        s('text', { x: 296, y: 276, 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L1' }, C); s('text', { x: 436, y: 276, 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L2' }, C);
        P.bat = E.battery(C, 175, 400, { U: U });
      }
      P.gap = s('g', {}, C); P.gr = s('rect', { fill: BG }, P.gap); P.g1 = s('circle', { r: 5, fill: '#EEF2F8' }, P.gap); P.g2 = s('circle', { r: 5, fill: '#EEF2F8' }, P.gap);
      P.slotTags = s('g', {}, C);
      Object.keys(SLOTS[st.mode]).forEach(function (k) { var z = SLOTS[st.mode][k]; s('text', { x: z.x + (z.v ? (z.x < 200 ? -22 : 22) : 0), y: z.y + (z.v ? 5 : -16), 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#7D89A3', text: k }, P.slotTags); });
      P.info = s('text', { x: st.mode === 'serie' ? 290 : 340, y: 434, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, C);
    }
    var MM = E.multimeter(G, 700, 40, { cal: st.cal, onDial: function (k) { st.cal = k; o.onDial && o.onDial(k); } });
    var LG = s('g', {}, G), red = E.lead(LG, '#FF5A4E'), blk = E.lead(LG, '#2A2F38');
    var blkOut = s('path', { fill: 'none', stroke: '#7D89A3', 'stroke-width': 1.5, 'stroke-dasharray': '2 3' }, LG);
    var warn = s('g', {}, G), wr = s('rect', { x: 120, y: 66, width: 340, height: 34, rx: 17, fill: '#FF5A4E' }, warn), wt = s('text', { x: 290, y: 88, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#2A0805' }, warn);
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, k = st.mode;
      if (k !== key) { key = k; build(); if (!SLOTS[st.mode][st.slot]) st.slot = st.mode === 'serie' ? 'B' : 'P'; }
      MM.set(st.cal);
      var R = solve(st), z = SLOTS[st.mode][st.slot];
      P.L[0].set(E.lampState(R.V1, UN).b); P.L[1].set(E.lampState(R.V2, UN).b);
      P.w.forEach(function (w) { w.flow(R.sc ? 1.6 : R.I > 0 ? Math.min(1.4, R.I * 4) : 0, T); });
      var inSeries = st.meter && !st.wrong;
      P.gap.style.display = inSeries ? '' : 'none';
      if (inSeries) { if (z.v) attr(P.gr, { x: z.x - 9, y: z.y - 22, width: 18, height: 44 }); else attr(P.gr, { x: z.x - 22, y: z.y - 9, width: 44, height: 18 }); attr(P.g1, { cx: z.up[0], cy: z.up[1] }); attr(P.g2, { cx: z.dn[0], cy: z.dn[1] }); }
      var c = E.CALS.filter(function (x) { return x.k === st.cal; })[0], sockR = c.k === 'A10' ? MM.sock['10A'] : c.ty === 'V' ? MM.sock.V : MM.sock.mA;
      var a, b; if (st.wrong) { if (st.mode === 'serie') { a = { x: 180, y: 120 }; b = { x: 240, y: 120 }; } else { a = { x: 260, y: 300 }; b = { x: 260, y: 240 }; } } else { a = { x: z.up[0], y: z.up[1] }; b = { x: z.dn[0], y: z.dn[1] }; }
      if (st.rev) { var tmp = a; a = b; b = tmp; }
      red.show(st.meter); blk.show(st.meter); MM.g.style.display = st.meter ? '' : 'none';
      if (st.meter) { red.set(sockR, a); blk.set(MM.sock.COM, b); }
      var M = st.meter ? MM.show(R.meas, 'A') : { st: 'off' };
      warn.style.display = R.sc || st.wrong ? '' : 'none'; wt.textContent = R.sc ? 'COURT-CIRCUIT ! Ampèremètre en dérivation' : 'Erreur : ampèremètre en dérivation sur L1';
      var msg = !st.meter ? '' : M.st === 'off' ? 'Multimètre éteint : tourne le sélecteur.' : M.st === 'wrongmode' ? 'Sélecteur sur « V » : choisis un calibre en A ou mA.' : M.st === 'over' ? 'Affichage « 1 » : calibre trop petit !' : 'I = ' + M.txt + (st.rev ? ' (fils inversés)' : '') + (st.wrong ? '' : ' · position ' + st.slot);
      P.info.textContent = msg;
      return { R: R, M: M, slot: st.slot, mode: st.mode, rev: st.rev, wrong: st.wrong, cal: st.cal };
    }
    return { st: st, step: step, MM: MM };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’intensité du courant' }, { t: 11, title: 'Brancher un ampèremètre' }, { t: 23, title: 'Choisir le calibre' }, { t: 35, title: 'La même partout en série' }, { t: 46, title: 'En dérivation' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { meter: false }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['L’intensité I se mesure en <b>ampères (A)</b>', 'avec un <b>ampèremètre</b> branché <b>en série</b> (COM côté borne −).', '#FFB547'],
      ['En série, l’intensité est <b>la même partout</b>', 'peu importe la position de l’ampèremètre.', 'var(--blue)'],
      ['En dérivation : <b>I = I<sub>1</sub> + I<sub>2</sub></b>', 'l’intensité principale est la somme des intensités des branches.', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.rev = false; st.wrong = false; st.meter = t >= 11;
        if (t < 11) { st.mode = 'serie'; st.meter = false; }
        else if (t < 23) { st.mode = 'serie'; st.slot = 'B'; st.cal = t < 15 ? 'OFF' : 'mA200'; }
        else if (t < 35) { st.mode = 'serie'; st.slot = 'B'; st.cal = t < 27 ? 'mA20' : t < 31 ? 'mA200' : 'A10'; }
        else if (t < 46) { st.mode = 'serie'; st.cal = 'mA200'; st.slot = t < 38.6 ? 'A' : t < 42.2 ? 'B' : 'C'; }
        else { st.mode = 'der'; st.cal = t < 49 ? 'A10' : 'mA200'; st.slot = t < 50.6 ? 'P' : t < 54.2 ? '1' : '2'; if (t < 49) st.slot = 'P'; }
        lab.step();
        tg.show(t, 2, 10.6, 290, 92, 'Le courant circule dans tout le circuit') || tg.show(t, 13, 22.6, 290, 92, 'En série : borne COM côté −') || tg.show(t, 24, 26.8, 290, 92, '20 mA : trop petit, l’écran affiche 1') ||
          tg.show(t, 27.2, 30.8, 290, 92, '200 mA : I = 60,0 mA') || tg.show(t, 31.2, 34.6, 290, 92, '10 A : 0,06 A, moins précis') || tg.show(t, 36, 45.6, 290, 92, 'Position ' + st.slot + ' : toujours 60 mA') ||
          tg.show(t, 47, 50.4, 290, 92, 'Branche principale : I = 0,25 A') || tg.show(t, 50.8, 57.6, 290, 92, 'I = I1 + I2 = 150 + 100 = 250 mA');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un circuit avec deux lampes en série, puis un multimètre utilisé en ampèremètre, branché en série à différents endroits avec différents calibres ; enfin un montage en dérivation où l’intensité principale est la somme des intensités des branches',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 5.4, say: 'Quand le circuit est fermé, un courant électrique circule dans tous ses éléments.', sub: 'Un <b>courant électrique</b> circule dans le circuit.' },
      { t: 5.6, d: 5.2, say: 'Son intensité se note I et se mesure en ampères, ou en milliampères.', sub: 'Son <b>intensité</b> I se mesure en <b>ampères (A)</b>.' },
      { t: 11, d: 4, say: 'On la mesure avec un ampèremètre : un multimètre réglé sur la position ampère.', sub: 'L’appareil : un <b>ampèremètre</b>.' },
      { t: 15.2, d: 7.4, say: 'On ouvre le circuit et on y insère l’ampèremètre, en série. Le courant entre par la borne milliampère et sort par la borne COM.', sub: 'Il se branche <b>en série</b> : courant entrant par mA, sortant par COM.' },
      { t: 23, d: 4, say: 'Sur le calibre vingt milliampères, l’écran affiche un : le calibre est trop petit.', sub: 'Affichage « 1 » : <b>calibre trop petit</b>.' },
      { t: 27.2, d: 7.6, say: 'Sur deux cents milliampères, on lit soixante milliampères. Sur dix ampères, on lit zéro virgule zéro six ampère, moins précis. On choisit le plus petit calibre possible.', sub: 'On choisit le <b>plus petit calibre</b> supérieur à la mesure.' },
      { t: 35, d: 10.6, say: 'Déplaçons l’ampèremètre : à gauche, entre les lampes, à droite… toujours soixante milliampères. Dans un circuit en série, l’intensité est la même en tout point.', sub: 'En série, l’intensité est <b>la même partout</b>.' },
      { t: 46, d: 4.4, say: 'En dérivation, mesurons dans la branche principale : zéro virgule vingt-cinq ampère.', sub: 'En dérivation, branche principale : <b>250 mA</b>.' },
      { t: 50.6, d: 7.2, say: 'Dans les branches : cent cinquante et cent milliampères. Leur somme fait deux cent cinquante : l’intensité principale est la somme des intensités des branches.', sub: '150 + 100 = 250 mA : <b>I = I₁ + I₂</b>.' },
      { t: 58, d: 4.4, say: 'À retenir : l’intensité se mesure en ampères avec un ampèremètre en série.', sub: 'Ampèremètre <b>en série</b>, unité : <b>ampère</b>.' },
      { t: 62.6, d: 4.2, say: 'En série, l’intensité est la même en tout point.', sub: 'Série : intensité <b>identique</b> partout.' },
      { t: 67, d: 5, say: 'En dérivation, l’intensité principale est la somme des intensités dans les branches.', sub: 'Dérivation : <b>I = I₁ + I₂</b>.' }
    ],
    learn: [
      { t: 10, ch: 0, html: 'Intensité I, unité : l’<b>ampère</b> (A) ; 1 A = 1 000 mA.' },
      { t: 22, ch: 1, html: 'Ampèremètre <b>en série</b>, entrée mA ou A, sortie COM.' },
      { t: 34, ch: 2, html: 'Écran « 1 » : calibre trop petit. On prend le <b>plus petit calibre</b> possible.' },
      { t: 57, ch: 4, html: 'Série : I identique ; dérivation : <b>I = I<sub>1</sub> + I<sub>2</sub></b>.' }
    ],
    question: { q: 'Comment branche-t-on un ampèremètre ?', o: ['en dérivation aux bornes de la lampe', 'en série dans le circuit', 'à la place du générateur', 'n’importe comment'], a: 1, e: 'Le courant doit le traverser : on l’insère en série.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Circuit avec un générateur 3 V et deux lampes, en série ou en dérivation, et un multimètre utilisé en ampèremètre, relié par des cordons rouge et noir à la position choisie',
    steps: [
      'Choisis le calibre sur le multimètre (clique sur le sélecteur) et lis l’intensité.',
      'Déplace l’ampèremètre en A, B et C : que remarques-tu ?',
      'Inverse les fils, puis essaie de brancher l’ampèremètre en dérivation : que se passe-t-il ?',
      'En dérivation, mesure I, I₁ et I₂ et vérifie la loi. Relève tes mesures.'
    ],
    build: function (api) {
      var cS, cD, cC;
      var lab = Lab(api.g, { onDial: function (k) { api.sound('tick'); cC && cC.set(k); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Montage', value: 'serie', options: [{ v: 'serie', l: 'Lampes en série' }, { v: 'der', l: 'Lampes en dérivation' }], onChange: function (v) { st.mode = v; st.slot = v === 'serie' ? 'B' : 'P'; st.wrong = false; vis(); } });
      cS = c.seg({ label: 'Position de l’ampèremètre', value: 'B', options: ['A', 'B', 'C'].map(function (k) { return { v: k, l: k }; }), onChange: function (v) { st.slot = v; st.wrong = false; } });
      cD = c.seg({ label: 'Position de l’ampèremètre', value: 'P', options: [{ v: 'P', l: 'principale' }, { v: '1', l: 'branche L1' }, { v: '2', l: 'branche L2' }], onChange: function (v) { st.slot = v; st.wrong = false; } });
      cC = c.seg({ label: 'Calibre', value: 'mA200', options: E.CALS.map(function (x) { return { v: x.k, l: x.l }; }), onChange: function (v) { st.cal = v; } });
      var tR = c.toggle({ label: 'Inverser les fils', value: false, onChange: function (v) { st.rev = v; } });
      var tW = c.toggle({ label: 'Erreur : brancher en dérivation sur L1', value: false, onChange: function (v) { st.wrong = v; if (v) api.sound('bad'); } });
      function vis() { cS.hide(st.mode !== 'serie'); cD.hide(st.mode === 'serie'); }
      vis();
      var ro = api.readouts([{ k: 'p', label: 'Position' }, { k: 'c', label: 'Calibre' }, { k: 'i', label: 'Mesure' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.p.set(st.wrong ? 'en dérivation !' : SLOTS[st.mode][st.slot].n); ro.c.set(E.CALS.filter(function (x) { return x.k === st.cal; })[0].l); ro.i.set(last.M.st === 'ok' ? last.M.txt : last.M.st === 'over' ? '« 1 » (trop petit)' : '—'); });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (last.M.st !== 'ok') { api.say('Lis d’abord une valeur correcte à l’écran.'); return; } rows.push({ m: st.mode === 'serie' ? 'série' : 'dérivation', p: st.wrong ? 'dérivation (erreur)' : SLOTS[st.mode][st.slot].n, i: last.M.txt }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Montage</th><th>Position</th><th>Intensité</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.m + '</td><td>' + r.p + '</td><td>' + r.i + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>';
        api.chart.innerHTML = '<h3>Les calibres</h3><table class="mt"><tbody><tr><td>Écran « 1 »</td><td>calibre trop petit : prends le calibre au-dessus</td></tr><tr><td>Valeur négative</td><td>fils inversés : le courant entre par COM</td></tr><tr><td>Meilleur calibre</td><td>le plus petit calibre supérieur à la valeur</td></tr><tr><td>Conversion</td><td>1 A = 1 000 mA</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'serie'; st.slot = 'B'; st.cal = 'mA200'; st.rev = false; st.wrong = false; cM.set('serie'); cS.set('B'); cD.set('P'); cC.set('mA200'); tR.set(false); tW.set(false); vis(); rows = []; paint(); });
      api.say('Lis l’intensité, puis déplace l’ampèremètre.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures correctes.</p>';
        return '<p>L’intensité du courant se note <b>I</b> et s’exprime en <b>ampères (A)</b> ; 1 A = 1 000 mA. Elle se mesure avec un <b>ampèremètre</b> branché <b>en série</b> : le courant entre par la borne A (ou mA) et sort par la borne COM.</p><p>On commence par le plus grand calibre, puis on choisit le <b>plus petit calibre</b> supérieur à la valeur mesurée. L’affichage « 1 » signale un calibre trop petit.</p><p>Dans un circuit <b>en série</b>, l’intensité est la <b>même en tout point</b> (ici 60 mA). En <b>dérivation</b>, l’intensité principale est la somme des intensités des branches : <b>I = I<sub>1</sub> + I<sub>2</sub></b> (250 = 150 + 100 mA).</p><p>Un ampèremètre branché en dérivation court-circuite le récepteur : c’est une erreur dangereuse.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit avec un ampèremètre' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’ampèremètre',
    intro: 'Branche, règle, lis : deviens un pro de la mesure !',
    missions: [
      { title: 'Le bon calibre', text: 'L’écran affiche « 1 ». Clique sur le <span style="color:var(--amber)">sélecteur</span> du multimètre pour lire l’intensité <b>le plus précisément possible</b>.', lumi: 'Le plus petit calibre qui convient donne le plus de chiffres.', hint: 'Essaie 200 mA.',
        build: function (api) { var lab = mini(api, { cal: 'mA20' }); return function () { var r = lab.res(); return r.M.st === 'ok' && r.cal === 'mA200' ? { ok: true, msg: 'I = ' + r.M.txt + ' : calibre idéal.' } : { ok: false, msg: r.M.st === 'ok' ? 'Ça marche, mais un calibre plus petit est plus précis.' : 'Pas de mesure correcte pour l’instant.' }; }; },
        e: 'On choisit le plus petit calibre supérieur à la valeur mesurée : 200 mA pour 60 mA.' },
      { type: 'qcm', title: 'Branchement', text: 'Un ampèremètre se branche :', o: ['en dérivation', 'en série', 'aux bornes du générateur', 'à la place de la lampe'], a: 1, hint: 'Le courant doit le traverser.', e: 'L’ampèremètre se branche en série.' },
      { title: 'Valeur négative', text: 'L’ampèremètre affiche une <b>valeur négative</b>. Corrige le branchement.', lumi: 'Par quelle borne le courant entre-t-il ?', hint: 'Inverse les fils : le courant doit sortir par COM.',
        build: function (api) { var lab = mini(api, { rev: true }); api.c.toggle({ label: 'Inverser les fils', value: true, onChange: function (v) { lab.st.rev = v; } }); return function () { var r = lab.res(); return !r.rev && r.M.st === 'ok' ? { ok: true, msg: 'Le courant entre par mA et sort par COM.' } : { ok: false, msg: 'La valeur est encore négative.' }; }; },
        e: 'Le courant doit entrer par la borne A (ou mA) et sortir par la borne COM.' },
      { title: 'Le courant principal', text: 'En dérivation, mesure l’intensité dans la <span style="color:#3DD68C">branche principale</span>.', lumi: 'Attention au calibre : la valeur est plus grande ici.', hint: 'Position « principale » et calibre 10 A.',
        build: function (api) { var lab = mini(api, { mode: 'der', slot: '1', cal: 'mA200' }); api.c.seg({ label: 'Position', value: '1', options: [{ v: 'P', l: 'principale' }, { v: '1', l: 'branche L1' }, { v: '2', l: 'branche L2' }], onChange: function (v) { lab.st.slot = v; } }); return function () { var r = lab.res(); return r.slot === 'P' && r.M.st === 'ok' ? { ok: true, msg: 'I = ' + r.M.txt + ' dans la branche principale.' } : { ok: false, msg: r.slot !== 'P' ? 'L’ampèremètre n’est pas dans la branche principale.' : 'Écran « 1 » : change de calibre.' }; }; },
        e: 'I = 0,25 A : il faut le calibre 10 A, car 250 mA dépasse 200 mA.' },
      { type: 'qcm', title: 'La loi des nœuds', text: 'En dérivation, I₁ = 0,15 A et I₂ = 0,10 A. L’intensité principale vaut :', o: ['0,05 A', '0,15 A', '0,25 A', '0,10 A'], a: 2, hint: 'Additionne.', e: 'I = I₁ + I₂ = 0,25 A.' }
    ]
  };

  S.start({
    id: '5e-intensite', level: '5e', theme: 'Mesure de grandeurs physiques', title: 'Intensité du courant électrique', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’intensité du courant électrique se note <b>I</b>. Son unité est l’<b>ampère</b> (A) ; on utilise aussi le milliampère : 1 A = 1 000 mA.',
      'On la mesure avec un <b>ampèremètre</b> (multimètre en position A), branché <b>en série</b> : le courant entre par la borne A ou mA et sort par la borne <b>COM</b>.',
      'On commence par le plus grand calibre, puis on choisit le <b>plus petit calibre supérieur</b> à la valeur mesurée. L’affichage « 1 » indique un calibre trop petit.',
      'Dans un circuit <b>en série</b>, l’intensité est la <b>même en tout point</b>.',
      'Dans un circuit <b>en dérivation</b>, l’intensité dans la branche principale est égale à la <b>somme</b> des intensités dans les branches dérivées : I = I<sub>1</sub> + I<sub>2</sub>.'
    ],
    quiz: [
      { q: 'L’unité de l’intensité est :', o: ['le volt', 'l’ampère', 'le watt', 'l’ohm'], a: 1, e: 'Symbole A.' },
      { q: '0,25 A est égal à :', o: ['25 mA', '250 mA', '2 500 mA', '2,5 mA'], a: 1, e: '0,25 × 1 000 = 250 mA.' },
      { q: 'L’écran d’un ampèremètre affiche « 1 ». Il faut :', o: ['changer la pile', 'prendre un calibre plus grand', 'prendre un calibre plus petit', 'inverser les fils'], a: 1, e: 'Le calibre est trop petit.' },
      { q: 'Dans un circuit en série, l’intensité :', o: ['diminue après chaque lampe', 'est la même partout', 'est nulle', 'augmente après chaque lampe'], a: 1, e: 'Elle ne s’use pas !' },
      { q: 'En dérivation, I = 0,5 A et I₁ = 0,2 A. Alors I₂ vaut :', o: ['0,7 A', '0,3 A', '0,2 A', '0,5 A'], a: 1, e: 'I₂ = I − I₁ = 0,3 A.' }
    ]
  });
})();
