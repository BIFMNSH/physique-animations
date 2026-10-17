/* 3e · Travail et puissance d'une force constante */
Sim.register('travail-puissance', {
  objective: 'Découvrir de quoi dépend le travail W d’une force qui déplace une caisse, puis calculer la puissance P = W / t.',
  alt: 'Une personne tire une caisse sur le sol avec une corde inclinée d’un angle alpha ; une jauge montre l’énergie transférée',
  chart: true,
  steps: [
    'Règle la force F, l’angle α de la corde, la distance d et la durée t du trajet.',
    'Appuie sur « Tirer la caisse » et observe la jauge d’énergie transférée.',
    'Relève W et P, puis recommence avec d’autres distances pour un même angle : quelle forme a la courbe W = f(d) ?',
    'Change l’angle α en gardant F et d : comment varie le travail ? Que se passe-t-il pour P si on va deux fois plus vite ?'
  ],
  retiens: [
    'Une force <b>travaille</b> quand son point d’application se déplace. Le travail W s’exprime en <b>joules (J)</b>.',
    'Force constante faisant un angle α avec le déplacement d : <b>W = F × d × cos α</b>. Si la force est dans le sens du déplacement (α = 0°), W = F × d.',
    'Une force perpendiculaire au déplacement (α = 90°) ne travaille pas : W = 0.',
    'La <b>puissance</b> indique la rapidité du transfert : <b>P = W ÷ t</b>, en <b>watts (W)</b>, avec t en secondes.'
  ],
  quiz: [
    { q: 'Une force de 50 N déplace une caisse de 4 m dans sa direction. Le travail vaut :', o: ['12,5 J', '54 J', '200 J', '46 J'], a: 2, e: 'W = F × d = 50 × 4 = 200 J.' },
    { q: 'Le travail d’une force perpendiculaire au déplacement est :', o: ['maximal', 'égal à F × d', 'nul', 'égal à F'], a: 2, e: 'cos 90° = 0 : la force ne travaille pas.' },
    { q: 'Un moteur fournit 600 J en 20 s. Sa puissance vaut :', o: ['12 000 W', '30 W', '580 W', '620 W'], a: 1, e: 'P = W ÷ t = 600 ÷ 20 = 30 W.' },
    { q: 'Même force, même distance, mais on tire avec un angle de 60° au lieu de 0°. Le travail :', o: ['est divisé par 2', 'double', 'ne change pas', 'devient nul'], a: 0, e: 'cos 60° = 0,5 : W est divisé par 2.' },
    { q: 'Deux élèves font le même travail, l’un en 10 s, l’autre en 5 s. Le plus puissant est :', o: ['celui qui met 10 s', 'celui qui met 5 s', 'aucun, ils sont égaux', 'on ne peut pas savoir'], a: 1, e: 'P = W ÷ t : pour le même W, la durée la plus courte donne la plus grande puissance.' }
  ],
  build: function (e) {
    var W = e.W, GY = 300, X0 = 40, CW = 74, CH = 50, PXM = 22, D2R = Math.PI / 180;
    var F = 100, al = 0, d = 10, T = 5, pos = 0, run = null, done = false, tbl, ch;
    var SER = { 0: 0, 30: 1, 45: 2, 60: 3 };

    function arrowPath(x0, y0, x1, y1, w, hw, hl) {
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
      if (L < 3) return '';
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux; hl = Math.min(hl, L * 0.6);
      var bx = x1 - ux * hl, by = y1 - uy * hl;
      return 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * hw) + ' ' + (by + ny * hw) +
        'L' + x1 + ' ' + y1 + 'L' + (bx - nx * hw) + ' ' + (by - ny * hw) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z';
    }
    function Wj() { return F * d * Math.cos(al * D2R); }

    /* décor : ciel, soleil, sol */
    var defs = e.s('defs'), gs = e.s('linearGradient', { id: 'tpSky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    e.s('stop', { offset: 0, 'stop-color': 'var(--scene)' }, gs); e.s('stop', { offset: 1, 'stop-color': 'var(--scene2)' }, gs);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'url(#tpSky)' });
    e.s('rect', { x: 0, y: GY, width: W, height: e.H - GY, fill: 'var(--scene2)' });
    e.s('line', { x1: 0, x2: W, y1: GY, y2: GY, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    for (var m = 0; m <= 20; m++) {
      var gx = X0 + CW + m * PXM, big = m % 5 === 0;
      e.s('line', { x1: gx, x2: gx, y1: GY, y2: GY + (big ? 14 : 7), stroke: 'var(--scene-muted)', 'stroke-width': big ? 2 : 1 });
      if (big) e.s('text', { x: gx, y: GY + 30, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--scene-muted)', text: m + ' m' });
    }
    var target = e.s('g');
    e.s('line', { y1: GY - 70, y2: GY + 4, stroke: 'var(--ok)', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, target);
    e.s('path', { d: 'M0 ' + (GY - 70) + 'h20l-6 7l6 7h-20z', fill: 'var(--ok)' }, target);
    var dispArrow = e.s('path', { fill: 'var(--s3)', opacity: 0.9 });
    var dispT = e.s('text', { 'font-size': 13, 'font-weight': 800, fill: 'var(--s3)', 'text-anchor': 'middle' });

    /* caisse */
    var crate = e.s('g');
    e.s('rect', { x: 0, y: GY - CH, width: CW, height: CH, rx: 5, fill: 'var(--s2)', 'fill-opacity': 0.85, stroke: 'var(--scene-text)', 'stroke-width': 2.2 }, crate);
    e.s('path', { d: 'M6 ' + (GY - CH + 6) + 'L' + (CW - 6) + ' ' + (GY - 6) + 'M' + (CW - 6) + ' ' + (GY - CH + 6) + 'L6 ' + (GY - 6), stroke: 'var(--scene-text)', 'stroke-width': 1.8, opacity: 0.35 }, crate);
    /* corde, personnage */
    var rope = e.s('line', { stroke: 'var(--scene-text)', 'stroke-width': 2.5 });
    var man = e.s('g', { fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    var head = e.s('circle', { r: 10, fill: 'var(--scene-text)' }, man);
    var body = e.s('path', {}, man), legs = e.s('path', {}, man), arms = e.s('path', {}, man);
    var vecF = e.s('path', { fill: 'var(--s1)' });
    var vecT = e.s('text', { 'font-size': 15, 'font-weight': 800, fill: 'var(--s1)' });
    var arc = e.s('path', { fill: 'none', stroke: 'var(--s4)', 'stroke-width': 2 });
    var arcT = e.s('text', { 'font-size': 13, 'font-weight': 800, fill: 'var(--s4)' });
    var hz = e.s('line', { stroke: 'var(--scene-muted)', 'stroke-width': 1.3, 'stroke-dasharray': '3 4' });

    /* formule + jauge */
    var fW = e.s('text', { x: 20, y: 34, 'font-size': 17, 'font-weight': 800, fill: 'var(--scene-text)' });
    var fP = e.s('text', { x: 20, y: 60, 'font-size': 15, fill: 'var(--scene-muted)' });
    var chrono = e.s('text', { x: 780, y: 34, 'text-anchor': 'end', 'font-size': 17, 'font-weight': 800, fill: 'var(--scene-text)' });
    e.s('text', { x: 780, y: 60, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--scene-muted)', text: 'Énergie transférée à la caisse' });
    e.s('rect', { x: 560, y: 68, width: 220, height: 16, rx: 8, fill: 'var(--scene)', stroke: 'var(--scene-line)' });
    var gauge = e.s('rect', { x: 560, y: 68, width: 0, height: 16, rx: 8, fill: 'var(--s3)' });
    var gaugeT = e.s('text', { x: 670, y: 100, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--s3)' });

    var roW = e.readout({ label: 'Travail W' }), roP = e.readout({ label: 'Puissance P' });

    function draw(tSim) {
      var c = Math.cos(al * D2R), s = Math.sin(al * D2R);
      var cx = X0 + pos * d * PXM, ax = cx + CW, ay = GY - CH + 12;
      crate.setAttribute('transform', 'translate(' + cx + ' 0)');
      target.setAttribute('transform', 'translate(' + (X0 + CW + d * PXM) + ' 0)');
      var hy = al === 0 ? ay : GY - 118, gap = al === 0 ? 120 : (ay - hy) / Math.tan(al * D2R);
      var hx = ax + gap;
      rope.setAttribute('x1', ax); rope.setAttribute('y1', ay); rope.setAttribute('x2', hx); rope.setAttribute('y2', hy);
      // personnage qui marche (penché en avant)
      var bx = hx + 18, phase = run ? (run.t * 9) : 0, sw = Math.sin(phase) * 12;
      var hipY = GY - 46, shY = GY - 98;
      head.setAttribute('cx', bx + 8); head.setAttribute('cy', shY - 16);
      body.setAttribute('d', 'M' + (bx + 4) + ' ' + shY + 'L' + bx + ' ' + hipY);
      legs.setAttribute('d', 'M' + bx + ' ' + hipY + 'L' + (bx + 10 + sw) + ' ' + GY + 'M' + bx + ' ' + hipY + 'L' + (bx + 10 - sw) + ' ' + GY);
      arms.setAttribute('d', 'M' + (bx + 4) + ' ' + (shY + 6) + 'L' + hx + ' ' + hy + 'M' + (bx + 4) + ' ' + (shY + 6) + 'L' + (hx + 4) + ' ' + (hy + 6));
      // vecteur force (longueur ∝ F) depuis le point d'accroche
      var L = 20 + F * 0.42;
      vecF.setAttribute('d', arrowPath(ax, ay, ax + L * c, ay - L * s, 2.6, 8, 14));
      vecT.setAttribute('x', cx + CW / 2); vecT.setAttribute('y', GY - CH - 12); vecT.setAttribute('text-anchor', 'middle'); vecT.textContent = 'F = ' + F + ' N';
      hz.setAttribute('x1', ax); hz.setAttribute('x2', ax + 70); hz.setAttribute('y1', ay); hz.setAttribute('y2', ay);
      arc.setAttribute('d', al ? 'M' + (ax + 44) + ' ' + ay + 'A44 44 0 0 0 ' + (ax + 44 * c) + ' ' + (ay - 44 * s) : '');
      arcT.setAttribute('x', ax + 50); arcT.setAttribute('y', ay - 8); arcT.textContent = al ? 'α = ' + al + '°' : 'α = 0°';
      // déplacement
      var x0 = X0 + CW, x1 = X0 + CW + d * PXM;
      dispArrow.setAttribute('d', arrowPath(x0, GY + 46, x1, GY + 46, 2, 7, 12));
      dispT.setAttribute('x', (x0 + x1) / 2); dispT.setAttribute('y', GY + 66); dispT.textContent = 'déplacement d = ' + d + ' m';
      var w = Wj(), wNow = F * pos * d * c;
      fW.textContent = 'W = F × d × cos α = ' + F + ' × ' + d + ' × ' + e.fmt(c, 2) + ' = ' + e.fmt(w, 0) + ' J';
      fP.textContent = 'P = W ÷ t = ' + e.fmt(w, 0) + ' ÷ ' + T + ' = ' + e.fmt(w / T, 1) + ' W';
      gauge.setAttribute('width', Math.max(0, 220 * wNow / 4000));
      gaugeT.textContent = e.fmt(wNow, 0) + ' J';
      chrono.textContent = 't = ' + e.fmt(tSim == null ? (done ? T : 0) : tSim, 1) + ' s';
      roW.set(e.fmt(w, 0) + ' J'); roP.set(e.fmt(w / T, 1) + ' W');
    }
    function changed() { run = null; done = false; pos = 0; draw(); }

    var sF = e.slider({ label: 'Force F', min: 10, max: 200, step: 10, value: F, unit: 'N', dec: 0, onInput: function (v) { F = v; changed(); } });
    var cA = e.choice({ label: 'Angle α de la corde', value: 0, options: [{ v: 0, l: '0°' }, { v: 30, l: '30°' }, { v: 45, l: '45°' }, { v: 60, l: '60°' }], onChange: function (v) { al = v; changed(); } });
    var sD = e.slider({ label: 'Distance d', min: 2, max: 20, step: 1, value: d, unit: 'm', dec: 0, onInput: function (v) { d = v; changed(); } });
    var sT = e.slider({ label: 'Durée du trajet t', min: 2, max: 20, step: 1, value: T, unit: 's', dec: 0, onInput: function (v) { T = v; changed(); } });
    var bGo = e.button({ label: 'Tirer la caisse', primary: true, onClick: function () { run = { t: 0 }; done = false; pos = 0; } });

    e.loop(function (dt) {
      if (!run) return;
      var speedUp = Math.max(1, T / 4);                   // un trajet dure au plus ~4 s à l'écran
      run.t += dt * speedUp; pos = Math.min(1, run.t / T); draw(run.t);
      if (run.t >= T) { run = null; done = true; pos = 1; draw(); e.say('Arrivée ! La force a transféré W = ' + e.fmt(Wj(), 0) + ' J en ' + T + ' s : P = ' + e.fmt(Wj() / T, 1) + ' W.', 'ok'); }
    });

    tbl = e.table({
      cols: [{ k: 'f', label: 'F', unit: 'N', dec: 0 }, { k: 'a', label: 'α', unit: '°', dec: 0 }, { k: 'd', label: 'd', unit: 'm', dec: 0 }, { k: 't', label: 't', unit: 's', dec: 0 }, { k: 'w', label: 'W', unit: 'J', dec: 0 }, { k: 'p', label: 'P', unit: 'W', dec: 1 }],
      onChange: function (rows) {
        [0, 30, 45, 60].forEach(function (a) { ch.setPoints(SER[a], rows.filter(function (r) { return r.a === a; }).map(function (r) { return [r.d, r.w]; })); });
        bilan(rows);
      }
    });
    e.measure('Relever W et P', function () {
      if (!done) { e.say('Tire d’abord la caisse jusqu’au drapeau, puis relève.', 'warn'); return null; }
      var w = Math.round(e.noise(Wj(), 0.004));
      return { f: F, a: al, d: d, t: T, w: w, p: w / T };
    });
    function bilan(rows) {
      if (!rows.length) { e.results(''); return; }
      var out = [];
      [0, 30, 45, 60].forEach(function (a) {
        var rs = rows.filter(function (r) { return r.a === a; });
        if (rs.length >= 2 && rs.every(function (r) { return r.f === rs[0].f; })) {
          var k = ch.fit(SER[a], true);
          out.push('α = ' + a + '° : droite par l’origine, pente <b>' + e.fmt(k.a, 0) + ' J/m</b> ≈ F × cos α = ' + e.fmt(rs[0].f * Math.cos(a * D2R), 0));
        }
      });
      var h = out.length ? '<b>W est proportionnel à d</b>.<br>' + out.join('<br>') : 'Pour une même force et un même angle, relève au moins 2 distances.';
      var r = rows[rows.length - 1];
      h += '<br>Dernier relevé : P = W ÷ t = ' + e.fmt(r.w, 0) + ' ÷ ' + r.t + ' = <b>' + e.fmt(r.p, 1) + ' W</b>.';
      e.results(h);
    }
    ch = e.chart({ xlabel: 'Distance d', xunit: 'm', ylabel: 'Travail W', yunit: 'J', xmin: 0, xmax: 20, ymin: 0, ymax: 4000, xstep: 2, ystep: 1000 });
    e.onReset(function () { F = 100; al = 0; d = 10; T = 5; sF.set(F); cA.set(0); sD.set(d); sT.set(T); changed(); });
    draw();
    e.say('Règle F, α, d et t, puis appuie sur « Tirer la caisse ».');
  }
});
