/* 3e · Combustions (oxydations) dans le dioxygène : produits, tests, conservation de la masse, réactif limitant */
Sim.register('combustions', {
  objective: 'Faire brûler du carbone, du soufre, du fer ou du cuivre dans un flacon de dioxygène, identifier le produit et relier les masses.',
  alt: 'Un flacon rempli de dioxygène dans lequel on plonge un têt à combustion contenant le réactif enflammé, une jauge de dioxygène et un tube d’eau de chaux',
  chart: true,
  steps: [
    'Choisis le réactif et sa masse, puis appuie sur « Enflammer et plonger ». Observe la combustion.',
    'Quand elle s’arrête, regarde ce qui reste : du réactif ? du dioxygène ? Relève les masses.',
    'Verse de l’eau de chaux dans le flacon pour tester le gaz formé.',
    'Recommence avec des masses de plus en plus grandes (nouveau flacon à chaque fois) : que montre la courbe ?'
  ],
  retiens: [
    'Une <b>combustion</b> est une réaction chimique au cours de laquelle un combustible réagit avec le <b>dioxygène</b> (le comburant) : c’est une <b>oxydation</b>.',
    'Carbone : C + O₂ → CO₂ (trouble l’eau de chaux). Soufre : S + O₂ → SO₂ (gaz suffocant). Fer : 3 Fe + 2 O₂ → Fe₃O₄ (oxyde magnétique). Cuivre : 2 Cu + O₂ → 2 CuO (noir).',
    'Au cours d’une réaction, <b>la masse se conserve</b> : m(réactifs consommés) = m(produits formés).',
    'La réaction s’arrête quand un réactif est épuisé : c’est le <b>réactif limitant</b>. L’autre est en excès.'
  ],
  quiz: [
    { q: 'Quel gaz est indispensable à une combustion ?', o: ['Le diazote', 'Le dioxygène', 'Le dihydrogène', 'Le dioxyde de carbone'], a: 1, e: 'Le dioxygène est le comburant.' },
    { q: 'La combustion du carbone produit un gaz qui trouble l’eau de chaux. C’est :', o: ['le dioxyde de carbone', 'le dioxyde de soufre', 'la vapeur d’eau', 'le dioxygène'], a: 0, e: 'C + O₂ → CO₂ ; le CO₂ trouble l’eau de chaux.' },
    { q: '3 g de carbone brûlent complètement avec 8 g de dioxygène. Quelle masse de CO₂ se forme ?', o: ['5 g', '8 g', '11 g', '24 g'], a: 2, e: 'Conservation de la masse : 3 + 8 = 11 g.' },
    { q: 'Quelle est l’équation de la combustion du fer ?', o: ['Fe + O₂ → FeO₂', '3 Fe + 2 O₂ → Fe₃O₄', '2 Fe + O₂ → Fe₂O', 'Fe + O → FeO'], a: 1, e: 'Le fer brûle en formant de l’oxyde magnétique Fe₃O₄ : 3 Fe + 2 O₂ → Fe₃O₄.' },
    { q: 'La combustion s’arrête alors qu’il reste du soufre dans le têt. Le réactif limitant est :', o: ['le soufre', 'le dioxygène', 'le dioxyde de soufre', 'il n’y en a pas'], a: 1, e: 'Le dioxygène est épuisé : c’est lui qui limite la réaction.' }
  ],
  build: function (e) {
    var W = e.W, VO2 = 1.0, VM = 24, MO2 = 32;
    var R = {
      C: { nm: 'carbone (charbon de bois)', eq: 'C + O₂ → CO₂', M: 12, a: 1, b: 1, p: 'CO₂', Mp: 44, pc: 1, min: 0.1, max: 1, st: 0.1, v: 0.3, col: '#2B2B2B', fl: ['#FF6A2B', '#FFD27A'], prod: 'dioxyde de carbone (gaz incolore)', gas: true, ser: 0 },
      S: { nm: 'soufre (poudre jaune)', eq: 'S + O₂ → SO₂', M: 32, a: 1, b: 1, p: 'SO₂', Mp: 64, pc: 1, min: 0.2, max: 2, st: 0.2, v: 0.6, col: '#E8D23A', fl: ['#4A7BFF', '#A9C4FF'], prod: 'dioxyde de soufre (gaz suffocant)', gas: true, ser: 1 },
      Fe: { nm: 'fer (paille de fer)', eq: '3 Fe + 2 O₂ → Fe₃O₄', M: 56, a: 3, b: 2, p: 'Fe₃O₄', Mp: 232, pc: 1, min: 0.5, max: 5, st: 0.5, v: 1.5, col: '#8F969E', fl: ['#FFF3B0', '#FFD24A'], prod: 'oxyde magnétique (globules noirs)', gas: false, ser: 2 },
      Cu: { nm: 'cuivre (tournure)', eq: '2 Cu + O₂ → 2 CuO', M: 63.5, a: 2, b: 1, p: 'CuO', Mp: 79.5, pc: 2, min: 0.5, max: 8, st: 0.5, v: 2, col: '#C46A3A', fl: ['#FF5A2A', '#FF9A5A'], prod: 'oxyde de cuivre (poudre noire)', gas: false, ser: 3 }
    };
    var key = 'C', m = R.C.v, left = m, o2 = VO2, prodM = 0, phase = 'idle', ph = 0, burnT = 0, burnDur = 3, lime = 0, limeOn = false, parts = [], tbl, ch, last = null;
    var FX = 400, FTOP = 120, FBOT = 340;

    function stoich(r, mass) {               // masses consommées pour mass de réactif disponible
      var nR = mass / r.M, nO = VO2 / VM, xi = Math.min(nR / r.a, nO / r.b);
      return { usedR: xi * r.a * r.M, usedO2L: xi * r.b * VM, prod: xi * r.pc * r.Mp, lim: nR / r.a <= nO / r.b ? 'R' : 'O' };
    }

    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    e.s('rect', { x: 0, y: 340, width: W, height: 40, fill: 'var(--scene2)' });
    /* flacon */
    var o2Fill = e.s('rect', { x: FX - 78, y: FTOP + 10, width: 156, height: FBOT - FTOP - 12, fill: 'var(--s1)', opacity: 0.16 });
    var limeR = e.s('rect', { x: FX - 78, y: FBOT - 2, width: 156, height: 0, fill: '#DDE7F1', opacity: 0.6 });
    e.s('rect', { x: FX - 78, y: FBOT - 14, width: 156, height: 12, fill: '#D9C9A3', opacity: 0.8 });
    e.s('path', { d: 'M' + (FX - 60) + ' ' + FTOP + 'V' + (FTOP + 6) + 'Q' + (FX - 80) + ' ' + (FTOP + 10) + ' ' + (FX - 80) + ' ' + (FTOP + 30) + 'V' + (FBOT - 6) + 'Q' + (FX - 80) + ' ' + FBOT + ' ' + (FX - 74) + ' ' + FBOT + 'H' + (FX + 74) + 'Q' + (FX + 80) + ' ' + FBOT + ' ' + (FX + 80) + ' ' + (FBOT - 6) + 'V' + (FTOP + 30) + 'Q' + (FX + 80) + ' ' + (FTOP + 10) + ' ' + (FX + 60) + ' ' + (FTOP + 6) + 'V' + FTOP, fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 3 });
    e.s('text', { x: FX, y: FBOT + 22, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--scene-muted)', text: 'flacon de 1 L de dioxygène · sable au fond' });
    var residue = e.s('g');
    var smoke = e.s('g');
    /* têt à combustion */
    var spoon = e.s('g');
    e.s('line', { x1: 0, y1: -170, x2: 0, y2: 0, stroke: 'var(--scene-muted)', 'stroke-width': 4 }, spoon);
    e.s('rect', { x: -40, y: -142, width: 80, height: 10, rx: 3, fill: 'var(--scene-muted)' }, spoon);    // bouchon
    e.s('path', { d: 'M-22 0Q0 18 22 0Z', fill: 'var(--scene-muted)', stroke: 'var(--scene-text)', 'stroke-width': 1.5 }, spoon);
    var heap = e.s('path', {}, spoon);
    var flameG = e.s('g', {}, spoon);
    var fOut = e.s('path', {}, flameG), fIn = e.s('path', {}, flameG);
    var glow = e.s('circle', { cx: 0, cy: -2, r: 18, opacity: 0 }, spoon);
    var sparkG = e.s('g');

    /* panneau d'infos */
    var nmT = e.s('text', { x: 20, y: 34, 'font-size': 18, 'font-weight': 800, fill: 'var(--scene-text)' });
    var eqT = e.s('text', { x: 20, y: 62, 'font-size': 20, 'font-weight': 800, fill: 'var(--s2)' });
    var stT = e.s('text', { x: 20, y: 88, 'font-size': 14, fill: 'var(--scene-muted)' });
    var balT = [0, 1, 2].map(function (j) { return e.s('text', { x: 20, y: 140 + j * 24, 'font-size': 15, 'font-weight': 700, fill: 'var(--scene-text)' }); });
    var verdict = e.s('text', { x: 20, y: 228, 'font-size': 14, 'font-weight': 800 });
    /* jauge O2 */
    e.s('text', { x: 680, y: 34, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-muted)', text: 'Dioxygène restant' });
    e.s('rect', { x: 652, y: 46, width: 56, height: 200, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    var gO = e.s('rect', { x: 656, y: 50, width: 48, height: 192, rx: 7, fill: 'var(--s1)' });
    var gT = e.s('text', { x: 680, y: 270, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: 'var(--s1)' });
    var limeT = e.s('text', { x: 680, y: 300, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-text)' });

    var roL = e.readout({ label: 'Réactif restant' }), roO = e.readout({ label: 'Dioxygène restant' });

    function heapPath(k) { var h = 4 + 12 * k, w = 8 + 12 * Math.sqrt(k); return 'M' + (-w) + ' 1Q0 ' + (-h * 1.8) + ' ' + w + ' 1Z'; }
    function draw() {
      var r = R[key];
      nmT.textContent = 'Réactif : ' + r.nm;
      eqT.textContent = r.eq;
      stT.textContent = 'Produit : ' + r.prod;
      var k = Math.max(0, left / r.max);
      heap.setAttribute('d', left > 0.001 ? heapPath(Math.min(1, k * 1.4 + 0.1)) : '');
      heap.style.fill = r.col;
      var y = phase === 'idle' ? -40 : phase === 'down' ? -40 + 182 * ph : 142;
      var x = FX;
      spoon.setAttribute('transform', 'translate(' + x + ' ' + (FTOP + y) + ')');
      var frac = o2 / VO2;
      gO.setAttribute('height', 192 * frac); gO.setAttribute('y', 50 + 192 * (1 - frac));
      gT.textContent = e.fmt(o2, 2) + ' L';
      o2Fill.style.opacity = 0.05 + 0.16 * frac;
      balT[0].textContent = 'Réactif consommé : ' + e.fmt(m - left, 2) + ' g';
      balT[1].textContent = 'Dioxygène consommé : ' + e.fmt((VO2 - o2) / VM * MO2, 2) + ' g';
      balT[2].textContent = 'Produit formé : ' + e.fmt(prodM, 2) + ' g';
      balT[2].style.fill = 'var(--s3)';
      roL.set(e.fmt(left, 2) + ' g'); roO.set(e.fmt(o2, 2) + ' L');
      limeR.setAttribute('height', 22 * Math.min(1, lime)); limeR.setAttribute('y', FBOT - 14 - 22 * Math.min(1, lime));
      var turb = limeOn && R[key].gas && key === 'C' && prodM > 0;
      limeR.style.fill = turb ? '#F3F5F8' : '#CFE3F5'; limeR.style.opacity = turb ? 0.95 : 0.55;
    }
    function setKey(k) {
      key = k; var r = R[k];
      sM.el.min = r.min; sM.el.max = r.max; sM.el.step = r.st; m = r.v; sM.set(m);
      fresh();
    }
    function fresh() {
      left = m; o2 = VO2; prodM = 0; phase = 'idle'; ph = 0; lime = 0; limeOn = false; last = null;
      residue.innerHTML = ''; smoke.innerHTML = ''; parts.forEach(function (p) { p.el.remove(); }); parts = [];
      fOut.setAttribute('d', ''); fIn.setAttribute('d', ''); glow.style.opacity = 0; verdict.textContent = ''; limeT.textContent = '';
      draw();
    }

    var cR = e.choice({ label: 'Réactif', value: 'C', options: [{ v: 'C', l: 'Carbone' }, { v: 'S', l: 'Soufre' }, { v: 'Fe', l: 'Fer' }, { v: 'Cu', l: 'Cuivre' }], onChange: setKey });
    var sM = e.slider({ label: 'Masse de réactif dans le têt', min: 0.1, max: 1, step: 0.1, value: m, unit: 'g', dec: 1, onInput: function (v) { m = v; if (phase === 'idle') { left = m; draw(); } } });
    var row = e.buttonRow();
    e.button({ label: 'Enflammer et plonger', primary: true, into: row, onClick: function () {
      if (phase !== 'idle') { e.say('Prends un nouveau flacon pour une nouvelle expérience.', 'warn'); return; }
      last = stoich(R[key], m); left = m; phase = 'down'; ph = 0; burnT = 0; burnDur = 1.6 + 3 * Math.min(1, last.usedO2L / VO2 + 0.2);
      e.say(key === 'Cu' ? 'Le cuivre est chauffé au rouge, puis plongé dans le dioxygène…' : 'Le réactif est enflammé puis plongé dans le flacon…');
    } });
    e.button({ label: 'Nouveau flacon', into: row, onClick: function () { left = m; fresh(); e.say('Nouveau flacon rempli de dioxygène.'); } });
    e.button({ label: 'Verser l’eau de chaux', onClick: function () {
      if (phase !== 'done') { e.say('Fais d’abord la combustion, puis teste le contenu du flacon.', 'warn'); return; }
      limeOn = true; lime = 0;
    } });

    function flamePath(s, f) { return 'M' + (-10 * s) + ' -2C' + (-14 * s) + ' ' + (-20 * s) + ' ' + (-2 * s) + ' ' + (-30 * s * f) + ' 0 ' + (-46 * s * f) + 'C' + (4 * s) + ' ' + (-30 * s * f) + ' ' + (14 * s) + ' ' + (-20 * s) + ' ' + (10 * s) + ' -2Z'; }

    e.loop(function (dt, T) {
      var r = R[key];
      if (phase === 'down') {
        ph = Math.min(1, ph + dt / 0.9);
        glow.style.opacity = 0.8; glow.style.fill = r.fl[0];
        if (ph >= 1) phase = 'burn';
      } else if (phase === 'burn') {
        burnT += dt; var k = Math.min(1, burnT / burnDur);
        left = m - last.usedR * k; o2 = VO2 - last.usedO2L * k; prodM = last.prod * k;
        var s = (key === 'Cu' ? 0 : 1) * (0.7 + 0.5 * (1 - k)) * (1 + Math.sin(T * 17) * 0.08), f = 1 + Math.sin(T * 11) * 0.12;
        fOut.setAttribute('d', s ? flamePath(s * (key === 'Fe' ? 1.3 : 1), f) : ''); fOut.style.fill = r.fl[0]; fOut.style.opacity = 0.85;
        fIn.setAttribute('d', s ? flamePath(s * 0.5, f) : ''); fIn.style.fill = r.fl[1];
        glow.style.opacity = 0.5 + 0.3 * Math.sin(T * 9); glow.style.fill = key === 'Cu' ? '#FF5A2A' : r.fl[0];
        // particules : étincelles (fer), fumées (soufre), dépôt noir (cuivre)
        var sy = FTOP + 142;
        if (key === 'Fe' && Math.random() < dt * 90) { var a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 120; parts.push({ x: FX, y: sy - 8, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, t: 0.6 + Math.random() * 0.4, el: e.s('circle', { r: 2, fill: '#FFF3B0' }, sparkG), k: 'sp' }); }
        if (key === 'S' && Math.random() < dt * 14) parts.push({ x: FX - 20 + Math.random() * 40, y: sy - 30, vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 20, t: 3, el: e.s('circle', { r: 6, fill: '#E9EEF5', opacity: 0.25 }, smoke), k: 'sm' });
        if (k >= 1) {
          phase = 'done'; fOut.setAttribute('d', ''); fIn.setAttribute('d', ''); glow.style.opacity = 0;
          if (key === 'Fe') for (var i = 0; i < 14; i++) e.s('circle', { cx: FX - 60 + Math.random() * 120, cy: FBOT - 15 - Math.random() * 3, r: 2 + Math.random() * 3, fill: '#1A1A1A' }, residue);
          if (key === 'Cu') heap.style.fill = left > 0.01 ? '#5A3020' : '#151515';
          var gas = r.gas ? ' Le produit est un gaz : ' + r.p + '.' : ' Le produit ' + r.p + ' est un solide.';
          verdict.textContent = last.lim === 'R' ? 'Tout le réactif a réagi : le dioxygène est en excès.' : 'Plus de dioxygène : il reste du réactif (O₂ limitant).';
          verdict.style.fill = last.lim === 'R' ? 'var(--ok)' : 'var(--warn)';
          e.say('Combustion terminée.' + gas + ' Masse formée : ' + e.fmt(prodM, 2) + ' g. Relève les masses.', 'ok');
        }
      }
      if (limeOn && lime < 1) {
        lime = Math.min(1, lime + dt / 1.2);
        if (lime >= 1) {
          var msg = key === 'C' ? 'L’eau de chaux se trouble : le gaz formé est du dioxyde de carbone CO₂.' : key === 'S' ? 'L’eau de chaux se trouble légèrement, mais c’est l’odeur suffocante qui signale le dioxyde de soufre SO₂ (ne pas respirer !).' : 'L’eau de chaux reste limpide : aucun gaz n’a été formé, le produit est un solide.';
          limeT.textContent = key === 'C' ? 'eau de chaux troublée' : key === 'S' ? 'faiblement troublée' : 'eau de chaux limpide';
          if (key === 'S') { limeOn = false; limeR.style.fill = '#E6ECF2'; limeR.style.opacity = 0.8; }
          e.say(msg, key === 'C' ? 'ok' : '');
        }
      }
      parts = parts.filter(function (p) {
        p.t -= dt; if (p.t <= 0) { p.el.remove(); return false; }
        p.x += p.vx * dt; p.y += p.vy * dt; if (p.k === 'sp') p.vy += 300 * dt; else { p.el.setAttribute('r', 6 + (3 - p.t) * 8); p.el.setAttribute('opacity', 0.25 * p.t / 3); if (p.y < FTOP + 20) p.vy = 0; }
        p.el.setAttribute('cx', p.x); p.el.setAttribute('cy', p.y); return true;
      });
      draw();
      if (key === 'S' && limeOn === false && lime >= 1) { limeR.style.fill = '#E6ECF2'; limeR.style.opacity = 0.8; }
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'r', label: 'Réactif' }, { k: 'm', label: 'm brûlée', unit: 'g', dec: 2 }, { k: 'p', label: 'm produit', unit: 'g', dec: 2 }, { k: 'o', label: 'O₂ utilisé', unit: 'L', dec: 2 }, { k: 'reste', label: 'Reste' }],
      onChange: function (rows) {
        ['C', 'S', 'Fe', 'Cu'].forEach(function (k) {
          var rs = rows.filter(function (r) { return r.key === k; });
          ch.setPoints(R[k].ser, rs.map(function (r) { return [r.m0, r.p]; }));
        });
        bilan(rows);
      }
    });
    e.measure('Relever les masses', function () {
      if (phase !== 'done') { e.say('Attends la fin de la combustion pour relever les masses.', 'warn'); return null; }
      var r = R[key], p = Math.round(e.noise(prodM, 0.01) * 100) / 100;
      return { n: tbl.rows().length + 1, key: key, r: key, m0: m, m: m - left, p: p, o: VO2 - o2, reste: last.lim === 'R' ? 'O₂ en excès' : 'réactif en excès' };
    });
    function bilan(rows) {
      if (!rows.length) { e.results(''); return; }
      var r = rows[rows.length - 1], mO = r.o / VM * MO2;
      var h = 'Dernier essai : ' + e.fmt(r.m, 2) + ' g de réactif + ' + e.fmt(mO, 2) + ' g de dioxygène → <b>' + e.fmt(r.p, 2) + ' g</b> de produit : <b>la masse se conserve</b>.';
      ['C', 'S', 'Fe', 'Cu'].forEach(function (k) {
        var rs = rows.filter(function (x) { return x.key === k; });
        if (rs.length >= 3) {
          var q = R[k], pts = [], lim = VO2 / VM / q.b * q.a * q.M;
          for (var x = 0; x <= q.max; x += q.max / 40) pts.push([x, stoich(q, x).prod]);
          ch.curve('th' + k, pts, q.ser, '6 5');
          if (rs.some(function (x) { return x.reste === 'réactif en excès'; })) h += '<br>' + k + ' : la courbe monte puis devient horizontale au-delà de <b>' + e.fmt(lim, 1) + ' g</b> : tout le dioxygène est consommé, il est le réactif limitant.';
          else h += '<br>' + k + ' : m(produit) est proportionnelle à m(réactif). Essaie de plus grandes masses !';
        }
      });
      if (!rows.some(function (x) { return rows.filter(function (y) { return y.key === x.key; }).length >= 3; })) h += '<br>Fais au moins 3 essais avec le même réactif et des masses différentes.';
      e.results(h);
    }
    ch = e.chart({ xlabel: 'Masse de réactif mise dans le têt', xunit: 'g', ylabel: 'Masse de produit', yunit: 'g', xmin: 0, xmax: 8, ymin: 0, ymax: 8, xstep: 1, ystep: 2 });
    e.onReset(function () { cR.set('C'); setKey('C'); });
    draw();
    e.say('Choisis un réactif et une masse, puis appuie sur « Enflammer et plonger ».');
  }
});
