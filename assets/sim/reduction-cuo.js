/* 3e · Réduction de l'oxyde de cuivre II par le carbone : 2 CuO + C → 2 Cu + CO2 */
Sim.register('reduction-cuo', {
  objective: 'Chauffer un mélange d’oxyde de cuivre et de carbone, identifier les produits et vérifier la conservation de la masse.',
  alt: 'Tube à essais incliné contenant un mélange noir chauffé par un bec Bunsen, relié par un tube à dégagement à un tube d’eau de chaux',
  chart: true,
  steps: [
    'Choisis la masse d’oxyde de cuivre CuO et la masse de carbone C, puis appuie sur « Chauffer ».',
    'Observe le mélange noir et l’eau de chaux pendant le chauffage.',
    'À la fin, retire le tube à dégagement de l’eau de chaux AVANT d’arrêter le chauffage, puis relève les masses.',
    'Recommence avec plusieurs masses de CuO (avec assez de carbone) et trace m(Cu) en fonction de m(CuO).'
  ],
  retiens: [
    'Chauffé avec du carbone, l’oxyde de cuivre (noir) donne du <b>cuivre</b> (rouge-orangé) et du <b>dioxyde de carbone</b> (trouble l’eau de chaux).',
    'Équation : <b>2 CuO + C → 2 Cu + CO₂</b>. L’oxyde de cuivre perd son oxygène : il est <b>réduit</b>. Le carbone gagne de l’oxygène : il est <b>oxydé</b>. Le carbone est le <b>réducteur</b>.',
    'Une réaction où il y a à la fois une réduction et une oxydation est une <b>oxydoréduction</b>.',
    'La masse se conserve : m(CuO) + m(C) consommés = m(Cu) + m(CO₂) formés. La masse du tube diminue car le CO₂ s’échappe.'
  ],
  quiz: [
    { q: 'Quelle est la couleur de l’oxyde de cuivre CuO ?', o: ['Rouge', 'Blanc', 'Noir', 'Bleu'], a: 2, e: 'L’oxyde de cuivre II est une poudre noire ; le cuivre formé est rouge-orangé.' },
    { q: 'Dans la réaction 2 CuO + C → 2 Cu + CO₂, le carbone est :', o: ['réduit', 'oxydé', 'inchangé', 'un produit'], a: 1, e: 'Le carbone gagne de l’oxygène et devient CO₂ : il est oxydé, c’est le réducteur.' },
    { q: 'Pourquoi l’eau de chaux se trouble-t-elle ?', o: ['Il se forme du dioxygène', 'Il se forme du dioxyde de carbone', 'Elle chauffe', 'Le cuivre s’y dissout'], a: 1, e: 'Le dioxyde de carbone formé passe dans l’eau de chaux et la trouble.' },
    { q: '15,9 g de CuO réagissent avec 1,2 g de C et donnent 12,7 g de cuivre. Quelle masse de CO₂ se forme ?', o: ['4,4 g', '17,1 g', '3,2 g', '1,2 g'], a: 0, e: 'Conservation de la masse : 15,9 + 1,2 − 12,7 = 4,4 g.' },
    { q: 'Pourquoi retire-t-on le tube de l’eau de chaux avant d’arrêter le chauffage ?', o: ['Pour aller plus vite', 'Pour éviter que l’eau de chaux remonte dans le tube chaud', 'Pour mieux voir le cuivre', 'Pour peser le gaz'], a: 1, e: 'En refroidissant, le gaz du tube se contracte : l’eau froide serait aspirée dans le tube brûlant, qui pourrait éclater.' }
  ],
  build: function (e) {
    var W = e.W, MCuO = 79.5, MC = 12, MCu = 63.5, MCO2 = 44, TUBE = 24.6;
    var mO = 4, mC = 0.4, k = 0, phase = 'idle', res = null, lime = 0, flameOn = false, inLime = true, tbl, ch, bub = [], suck = 0;
    function react(a, c) { var x = Math.min(a / (2 * MCuO), c / MC); return { cuo: a - 2 * MCuO * x, c: c - MC * x, cu: 2 * MCu * x, co2: MCO2 * x, lim: a / (2 * MCuO) <= c / MC ? 'CuO' : 'C' }; }

    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    e.s('rect', { x: 0, y: 340, width: W, height: 40, fill: 'var(--scene2)' });
    /* support */
    e.s('rect', { x: 46, y: 104, width: 8, height: 238, fill: 'var(--scene-muted)' });
    e.s('rect', { x: 26, y: 334, width: 120, height: 8, rx: 3, fill: 'var(--scene-muted)' });
    e.s('path', { d: 'M54 176H130', stroke: 'var(--scene-muted)', 'stroke-width': 6 });
    /* tube incliné (groupe) */
    var tube = e.s('g', { transform: 'translate(120 176) rotate(-12) scale(1.3)' });
    var bed = e.s('g', {}, tube);
    e.s('rect', { x: 8, y: 6, width: 190, height: 18, rx: 2, fill: 'var(--s1)', opacity: 0.07 }, tube);
    var grains = [];
    for (var i = 0; i < 60; i++) grains.push({ el: e.s('circle', { cx: 52 + Math.random() * 120, cy: 14 + Math.random() * 9, r: 3 + Math.random() * 3.5 }, bed), th: 0.15 + Math.random() * 0.8 });
    e.s('path', { d: 'M230 0H24A12 12 0 0 0 24 30H230', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, tube);
    e.s('rect', { x: 226, y: -3, width: 22, height: 36, rx: 3, fill: '#7A5A44' }, tube);   // bouchon
    /* tube à dégagement */
    var dTube = e.s('path', { fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 4, 'stroke-linejoin': 'round' });
    /* tube d'eau de chaux */
    var LX = 560;
    e.s('rect', { x: LX - 50, y: 330, width: 100, height: 12, rx: 3, fill: 'var(--scene-muted)' });
    var limeW = e.s('rect', { x: LX - 18, y: 236, width: 36, height: 92, fill: 'var(--s1)', opacity: 0.3 });
    var milk = e.s('rect', { x: LX - 18, y: 236, width: 36, height: 92, fill: '#C9CFD8', opacity: 0 });
    e.s('line', { x1: LX - 18, x2: LX + 18, y1: 236, y2: 236, stroke: 'var(--s1)', 'stroke-width': 2 });
    e.s('path', { d: 'M' + (LX - 20) + ' 150V316A20 20 0 0 0 ' + (LX + 20) + ' 316V150', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 2.5 });
    e.s('text', { x: LX, y: 360, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'eau de chaux' });
    var bubG = e.s('g');
    /* bec Bunsen */
    var BX = 262;
    e.s('rect', { x: BX - 10, y: 232, width: 20, height: 102, fill: 'var(--scene-muted)' });
    e.s('rect', { x: BX - 30, y: 330, width: 60, height: 10, rx: 3, fill: 'var(--scene-muted)' });
    var flO = e.s('path', { fill: '#5A8BFF', opacity: 0.75 }), flI = e.s('path', { fill: '#BFD3FF', opacity: 0.9 });
    var heatGlow = e.s('ellipse', { cx: BX, cy: 168, rx: 44, ry: 12, fill: '#FF6A2B', opacity: 0 });

    /* panneau de bilan */
    var px = 618;
    e.s('rect', { x: px, y: 16, width: 168, height: 196, rx: 12, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    e.s('text', { x: px + 84, y: 38, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-muted)', 'letter-spacing': '0.08em', text: 'BALANCE (tube + solide)' });
    var bA = e.s('text', { x: px + 84, y: 70, 'text-anchor': 'middle', 'font-size': 15, fill: 'var(--scene-text)' });
    var bB = e.s('text', { x: px + 84, y: 96, 'text-anchor': 'middle', 'font-size': 15, fill: 'var(--scene-text)' });
    var bD = e.s('text', { x: px + 84, y: 126, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--s2)' });
    var bE = e.s('text', { x: px + 84, y: 150, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--scene-muted)', text: '= masse de CO₂ dégagé' });
    var bCu = e.s('text', { x: px + 84, y: 184, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--s3)' });
    var eqT = e.s('text', { x: 20, y: 34, 'font-size': 20, 'font-weight': 800, fill: 'var(--scene-text)', text: '2 CuO  +  C  →  2 Cu  +  CO₂' });
    var redT = e.s('text', { x: 20, y: 58, 'font-size': 13, fill: 'var(--scene-muted)', text: 'CuO perd son oxygène (réduction) · C gagne de l’oxygène (oxydation)' });
    var stT = e.s('text', { x: 20, y: 84, 'font-size': 15, 'font-weight': 800 });
    var warnT = e.s('text', { x: LX, y: 120, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--bad)' });

    var roCu = e.readout({ label: 'Cuivre formé' }), roT = e.readout({ label: 'Masse du tube' });

    function mix(a, b, t) { return a.map(function (x, j) { return Math.round(x + (b[j] - x) * t); }); }
    function draw() {
      var r = res || react(mO, mC), kk = res ? k : 0;
      var cuK = r.cu > 0 ? kk : 0;
      var fracCu = (mO > 0 ? (r.cu * kk) / (r.cu * kk + r.cuo + (mO - r.cuo) * (1 - kk) + 0.0001) : 0);
      grains.forEach(function (g) {
        var turned = cuK > g.th && Math.random() < 1 && g.th < (r.cu / (r.cu + r.cuo + r.c * 3 + 1e-6)) * 1.05 + 0.02;
        var c = turned ? mix([30, 30, 32], [199, 104, 58], Math.min(1, (cuK - g.th) * 4)) : [28, 28, 30];
        g.el.setAttribute('fill', 'rgb(' + c.join(',') + ')');
      });
      // tube à dégagement : de l'extrémité du bouchon jusqu'au fond de l'eau de chaux (ou relevé)
      var sx = 120 + 322 * Math.cos(-12 * Math.PI / 180) - 19.5 * Math.sin(-12 * Math.PI / 180), sy = 176 + 322 * Math.sin(-12 * Math.PI / 180) + 19.5 * Math.cos(-12 * Math.PI / 180);
      var endY = inLime ? 300 : 170;
      dTube.setAttribute('d', 'M' + (sx - 8) + ' ' + sy + 'L' + (sx + 40) + ' ' + (sy - 6) + 'Q' + (LX - 4) + ' ' + (sy - 30) + ' ' + (LX - 4) + ' ' + (sy + 10) + 'V' + endY);
      var turb = Math.min(1, lime);
      milk.style.opacity = 0.92 * turb;
      var before = TUBE + mO + mC, after = TUBE + (res ? (mO + mC - r.co2 * kk) : mO + mC);
      bA.textContent = 'Avant : ' + e.fmt(before, 2) + ' g';
      bB.textContent = 'Maintenant : ' + e.fmt(after, 2) + ' g';
      bD.textContent = 'Écart : ' + e.fmt(before - after, 2) + ' g';
      bCu.textContent = 'Cuivre : ' + e.fmt(r.cu * kk, 2) + ' g';
      stT.textContent = phase === 'idle' ? 'Mélange noir : ' + e.fmt(mO, 1) + ' g de CuO + ' + e.fmt(mC, 2) + ' g de C' : phase === 'heat' ? 'Chauffage… le mélange rougeoie' : phase === 'done' ? (r.lim === 'CuO' ? 'Tout l’oxyde de cuivre est réduit' : 'Il reste de l’oxyde de cuivre : carbone insuffisant') : 'Chauffage arrêté';
      stT.style.fill = phase === 'done' ? (r.lim === 'CuO' ? 'var(--ok)' : 'var(--warn)') : 'var(--scene-text)';
      roCu.set(e.fmt(r.cu * kk, 2) + ' g'); roT.set(e.fmt(after, 2) + ' g');
    }

    var sO = e.slider({ label: 'Masse d’oxyde de cuivre CuO', min: 1, max: 8, step: 0.5, value: mO, unit: 'g', dec: 1, onInput: function (v) { mO = v; if (phase === 'idle') draw(); } });
    var sC = e.slider({ label: 'Masse de carbone C', min: 0.05, max: 0.8, step: 0.05, value: mC, unit: 'g', dec: 2, onInput: function (v) { mC = v; if (phase === 'idle') draw(); } });
    var row = e.buttonRow();
    var bH = e.button({ label: 'Chauffer', primary: true, into: row, onClick: function () {
      if (phase === 'heat') return;
      if (phase !== 'idle') { e.say('Prépare d’abord un nouveau mélange.', 'warn'); return; }
      res = react(mO, mC); k = 0; lime = 0; phase = 'heat'; flameOn = true; inLime = true; suck = 0; warnT.textContent = '';
      sO.disable(true); sC.disable(true);
      e.say('Le bec Bunsen chauffe le mélange. Surveille l’eau de chaux.');
    } });
    e.button({ label: 'Sortir le tube de l’eau de chaux', into: row, onClick: function () { inLime = false; warnT.textContent = ''; e.say('Le tube à dégagement est sorti : tu peux arrêter le chauffage sans danger.', 'ok'); draw(); } });
    e.button({ label: 'Arrêter le chauffage', onClick: function () {
      if (!flameOn) return;
      flameOn = false;
      if (inLime && phase !== 'idle') { warnT.textContent = 'Danger : l’eau de chaux remonte !'; suck = 1; e.say('Attention : le gaz du tube refroidit et l’eau de chaux est aspirée vers le tube brûlant ! Il fallait d’abord sortir le tube.', 'bad'); }
      if (phase === 'heat') { phase = 'stop'; }
      draw();
    } });
    e.button({ label: 'Nouveau mélange', onClick: function () { phase = 'idle'; res = null; k = 0; lime = 0; flameOn = false; inLime = true; suck = 0; warnT.textContent = ''; sO.disable(false); sC.disable(false); bub.forEach(function (b) { b.el.remove(); }); bub = []; draw(); } });

    e.loop(function (dt, T) {
      var f = 1 + Math.sin(T * 15) * 0.07;
      flO.setAttribute('d', flameOn ? 'M' + (BX - 9) + ' 232C' + (BX - 14) + ' 208 ' + (BX - 4) + ' ' + (194 - 14 * f) + ' ' + BX + ' ' + (174 - 10 * f) + 'C' + (BX + 4) + ' ' + (194 - 14 * f) + ' ' + (BX + 14) + ' 208 ' + (BX + 9) + ' 232Z' : '');
      flI.setAttribute('d', flameOn ? 'M' + (BX - 5) + ' 232C' + (BX - 7) + ' 218 ' + (BX - 2) + ' 210 ' + BX + ' ' + (200 - 4 * f) + 'C' + (BX + 2) + ' 210 ' + (BX + 7) + ' 218 ' + (BX + 5) + ' 232Z' : '');
      heatGlow.style.opacity = flameOn ? 0.25 + 0.1 * Math.sin(T * 7) : 0;
      if (phase === 'heat') {
        k = Math.min(1, k + dt / 6);
        if (inLime) lime = Math.min(1, lime + dt * (res.co2 / 1.2) / 6 * 1.2);
        if (inLime && Math.random() < dt * 22 * (res.co2 > 0 ? 1 : 0) * (k < 1 ? 1 : 0)) bub.push({ x: LX - 4 + Math.random() * 6, y: 300, el: e.s('circle', { r: 2.5, fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 1.2 }, bubG) });
        if (k >= 1) { phase = 'done'; e.say(res.lim === 'CuO' ? 'Réaction terminée : le cuivre rouge est apparu et l’eau de chaux est troublée. Sors le tube de l’eau de chaux, arrête le chauffage, puis relève.' : 'Réaction terminée, mais il reste de la poudre noire : il n’y avait pas assez de carbone.', 'ok'); }
      }
      if (suck > 0) { suck = Math.max(0, suck - dt / 2); }
      bub = bub.filter(function (b) { b.y -= dt * 70; if (b.y < 238) { b.el.remove(); return false; } b.el.setAttribute('cx', b.x); b.el.setAttribute('cy', b.y); return true; });
      draw();
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'cuo', label: 'm CuO', unit: 'g', dec: 1 }, { k: 'c', label: 'm C', unit: 'g', dec: 2 }, { k: 'cu', label: 'm Cu', unit: 'g', dec: 2 }, { k: 'co2', label: 'm CO₂', unit: 'g', dec: 2 }],
      onChange: function (rows) { ch.setPoints(0, rows.filter(function (r) { return r.full; }).map(function (r) { return [r.cuo, r.cu]; })); ch.setPoints(1, rows.filter(function (r) { return !r.full; }).map(function (r) { return [r.cuo, r.cu]; })); bilan(rows); }
    });
    e.measure('Relever les masses', function () {
      if (phase !== 'done' && phase !== 'stop') { e.say('Chauffe le mélange jusqu’à la fin de la réaction avant de relever.', 'warn'); return null; }
      if (flameOn) { e.say('Arrête d’abord le chauffage (après avoir sorti le tube de l’eau de chaux) puis laisse refroidir.', 'warn'); return null; }
      var r = res, cu = Math.round(e.noise(r.cu * k, 0.012) * 100) / 100, co2 = Math.round(e.noise(r.co2 * k, 0.012) * 100) / 100;
      return { n: tbl.rows().length + 1, cuo: mO, c: mC, cu: cu, co2: co2, full: r.lim === 'CuO' && k >= 1 };
    });
    function bilan(rows) {
      if (!rows.length) { e.results(''); return; }
      var r = rows[rows.length - 1], h = 'Dernier essai : ' + e.fmt(r.cuo, 1) + ' g de CuO + ' + e.fmt(r.c, 2) + ' g de C → ' + e.fmt(r.cu, 2) + ' g de Cu + ' + e.fmt(r.co2, 2) + ' g de CO₂ (+ réactif en excès).';
      var full = rows.filter(function (x) { return x.full; });
      if (full.length >= 2) { var f = ch.fit(0, true); h += '<br>Quand tout le CuO réagit, <b>m(Cu) = ' + e.fmt(f.a, 2) + ' × m(CuO)</b> : la masse de cuivre est proportionnelle à la masse d’oxyde (2 × 63,5 ÷ 159 ≈ 0,80).'; }
      else h += '<br>Fais au moins 2 essais avec assez de carbone pour que tout le CuO réagisse.';
      if (rows.some(function (x) { return !x.full; })) h += '<br>Points orange : carbone insuffisant, une partie du CuO n’a pas réagi.';
      e.results(h);
    }
    ch = e.chart({ xlabel: 'Masse d’oxyde de cuivre CuO', xunit: 'g', ylabel: 'Masse de cuivre', yunit: 'g', xmin: 0, xmax: 8, ymin: 0, ymax: 7, xstep: 1, ystep: 1 });
    e.onReset(function () { mO = 4; mC = 0.4; sO.set(4); sC.set(0.4); phase = 'idle'; res = null; k = 0; lime = 0; flameOn = false; inLime = true; warnT.textContent = ''; sO.disable(false); sC.disable(false); bub.forEach(function (b) { b.el.remove(); }); bub = []; draw(); });
    draw();
    e.say('Règle les masses de CuO et de carbone, puis appuie sur « Chauffer ».');
  }
});
