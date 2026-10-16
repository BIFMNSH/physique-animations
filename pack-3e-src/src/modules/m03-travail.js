/* Travail et puissance mécaniques */
Lab.register({
  id: 'travail', theme: 'meca', title: 'Tirer une caisse : travail et puissance',
  lesson: 'Travail et puissance mécaniques', skills: ['C1', 'C2', 'C4'],
  objective: 'Trouve de quoi dépendent le travail d’une force et la puissance.',
  alt: 'Caisse tirée sur le sol par une corde inclinée, avec la force F, l’angle et la distance parcourue',
  thumb: '<rect x="62" y="38" width="34" height="22" rx="3" fill="var(--s2)"/><path d="M96 46l40-20" stroke="var(--s1)" stroke-width="3"/><path d="M136 26l-10 0 4 8z" fill="var(--s1)"/><path d="M20 66h120" stroke="var(--scene-line)" stroke-width="3"/>',
  height: 420,
  hint: 'Règle F, l’angle et la distance, puis relève W et P.',
  steps: [
    'Règle la force F, la distance d et la durée t.',
    'Choisis l’angle α entre la force et le déplacement.',
    'Lance le déplacement pour voir la caisse avancer, puis relève W et P.',
    'Fais plusieurs mesures pour chaque angle : le graphique W en fonction de d donne une droite.'
  ],
  retiens: [
    'Le <b>travail</b> d’une force constante, de même direction que le déplacement, vaut <b>W = F × d</b> (J, N, m).',
    'Si la force est inclinée d’un angle α : <b>W = F × d × cos α</b>. Si la force est perpendiculaire au déplacement (α = 90°), son travail est nul.',
    'La <b>puissance</b> mesure la rapidité : <b>P = W / t</b> (W en J, t en s, P en watts).'
  ],
  quiz: [
    { q: 'Une force de 50 N déplace une caisse de 4 m dans sa direction. Son travail vaut :', o: ['12,5 J', '54 J', '200 J', '46 J'], a: 2, e: 'W = F × d = 50 × 4 = 200 J.' },
    { q: 'Le travail d’une force perpendiculaire au déplacement est :', o: ['maximal', 'égal à F × d', 'nul', 'négatif'], a: 2, e: 'cos 90° = 0 : la force ne travaille pas.' },
    { q: 'Un moteur fournit un travail de 600 J en 20 s. Sa puissance vaut :', o: ['12 000 W', '30 W', '580 W', '620 W'], a: 1, e: 'P = W / t = 600 / 20 = 30 W.' },
    { q: 'On double la distance parcourue, la force restant la même. Le travail :', o: ['est divisé par 2', 'ne change pas', 'double', 'est multiplié par 4'], a: 2, e: 'W est proportionnel à d.' },
    { q: 'Le porteur marche à vitesse constante avec une valise sur la tête (force verticale). Le travail de la force exercée sur la valise est :', o: ['grand', 'nul', 'égal au poids', 'égal à la distance'], a: 1, e: 'La force verticale est perpendiculaire au déplacement horizontal.' }
  ],
  build: function (c) {
    var F = c.slider('Force F', { min: 10, max: 200, step: 10, value: 100, unit: 'N' });
    var D = c.slider('Distance d', { min: 1, max: 20, step: 1, value: 10, unit: 'm' });
    var T = c.slider('Durée t', { min: 2, max: 12, step: 1, value: 5, unit: 's' });
    var ang = c.choice('Angle α', [{ v: 0, label: '0°' }, { v: 30, label: '30°' }, { v: 60, label: '60°' }, { v: 90, label: '90°' }], null, 0);
    var ANG = { 0: 'var(--s1)', 30: 'var(--s3)', 60: 'var(--s4)', 90: 'var(--s5)' };
    function W() { return F.get() * D.get() * Math.cos(ang.get() * Math.PI / 180); }
    function Pw() { return W() / T.get(); }
    var pos = 0, run = null;   // run : {t0}
    var X0 = 80, X1 = 600;
    c.s('rect', { x: 20, y: 20, width: 760, height: 380, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('rect', { x: 20, y: 300, width: 760, height: 100, fill: 'var(--s3)', 'fill-opacity': .25 });
    c.s('line', { x1: 20, x2: 780, y1: 300, y2: 300, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    for (var i = 0; i <= 4; i++) { c.s('line', { x1: X0 + i * (X1 - X0 + 100) / 4, x2: X0 + i * (X1 - X0 + 100) / 4, y1: 300, y2: 310, stroke: 'var(--scene-line)' }); }
    var start = c.s('line', { x1: X0, x2: X0, y1: 200, y2: 320, stroke: 'var(--scene-muted)', 'stroke-dasharray': '5 4' });
    var crate = c.s('rect', { y: 250, width: 90, height: 50, rx: 5, fill: 'var(--s2)', stroke: 'var(--scene-text)', 'stroke-width': 2 });
    var rope = c.s('line', { stroke: 'var(--scene-text)', 'stroke-width': 3 });
    var arrow = c.s('path', { fill: 'var(--s1)' });
    var lbl = c.s('text', { 'font-size': 16, 'font-weight': 700 }); lbl.style.fill = 'var(--s1)';
    var arc = c.s('path', { fill: 'none', stroke: 'var(--scene-text)' });
    var at = c.s('text', { 'font-size': 14 });
    var wt = c.s('text', { x: 400, y: 56, 'font-size': 17, 'font-weight': 700, 'text-anchor': 'middle' });
    var chrono = c.s('text', { x: 760, y: 56, 'font-size': 15, 'text-anchor': 'end' });
    function arr(x0, y0, dx, dy) {
      var L = Math.hypot(dx, dy); if (L < 4) return ''; var ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hd = Math.min(14, L * .5), w = 3, x1 = x0 + dx, y1 = y0 + dy, bx = x1 - ux * hd, by = y1 - uy * hd;
      return 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * 9) + ' ' + (by + ny * 9) + 'L' + x1 + ' ' + y1 + 'L' + (bx - nx * 9) + ' ' + (by - ny * 9) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z';
    }
    function draw() {
      var x = X0 + pos * (X1 - X0), a = ang.get() * Math.PI / 180, L = F.get() * 0.9;
      crate.setAttribute('x', x); var hx = x + 90, hy = 275;
      rope.setAttribute('x1', hx); rope.setAttribute('y1', hy); rope.setAttribute('x2', hx + Math.cos(a) * 60); rope.setAttribute('y2', hy - Math.sin(a) * 60);
      arrow.setAttribute('d', arr(hx, hy, Math.cos(a) * L, -Math.sin(a) * L));
      lbl.setAttribute('x', hx + Math.cos(a) * L + 8); lbl.setAttribute('y', hy - Math.sin(a) * L - 4); lbl.textContent = 'F = ' + F.get() + ' N';
      arc.setAttribute('d', a ? 'M' + (hx + 40) + ' ' + hy + 'A40 40 0 0 0 ' + (hx + 40 * Math.cos(a)) + ' ' + (hy - 40 * Math.sin(a)) : '');
      at.setAttribute('x', hx + 46); at.setAttribute('y', hy + 22); at.textContent = 'α = ' + ang.get() + '°';
      wt.textContent = 'W = F × d × cos α = ' + F.get() + ' × ' + D.get() + ' × ' + c.fmt(Math.cos(ang.get() * Math.PI / 180), 2) + ' = ' + c.fmt(W(), 0) + ' J';
    }
    c.onUpdate(function () { if (!run) { pos = 0; } draw(); chrono.textContent = run ? 't = ' + c.fmt(run.t, 1) + ' s' : ''; });
    c.button('Lancer le déplacement', function () { run = { t: 0 }; pos = 0; }, { into: 'ctrl' });
    c.onReset(function () { run = null; pos = 0; });
    c.loop(function (dt) {
      if (!run) return; run.t += dt; pos = Math.min(1, run.t / T.get()); draw(); chrono.textContent = 't = ' + c.fmt(Math.min(run.t, T.get()), 1) + ' s';
      if (run.t >= T.get()) { run = null; c.say('Déplacement terminé : W = ' + c.fmt(W(), 0) + ' J, P = ' + c.fmt(Pw(), 1) + ' W.', 'ok'); }
    });
    c.readout('Travail W', function () { return W(); }, 'J', 0);
    c.readout('Puissance P', function () { return Pw(); }, 'W', 1);
    c.readout('cos α', function () { return Math.cos(ang.get() * Math.PI / 180); }, '', 2);

    var series = [0, 30, 60, 90].map(function (a) { return { id: 'a' + a, name: 'α = ' + a + '°', color: ANG[a] }; });
    var ch = c.chart({ x: { label: 'distance d', unit: 'm', min: 0, max: 20 }, y: { label: 'travail W', unit: 'J', min: 0, max: 4000 }, fit: 'origin', series: series });
    c.table({ cols: [{ key: 'f', label: 'F', unit: 'N', d: 0 }, { key: 'a', label: 'α', unit: '°', d: 0 }, { key: 'd', label: 'd', unit: 'm', d: 0 }, { key: 't', label: 't', unit: 's', d: 0 }, { key: 'w', label: 'W', unit: 'J', d: 0 }, { key: 'p', label: 'P', unit: 'W', d: 1 }], max: 14, onChange: bilan });
    c.measure('Relever W et P', function () { return { f: F.get(), a: ang.get(), d: D.get(), t: T.get(), w: c.noise(W(), 0.003), p: c.noise(Pw(), 0.003) }; });
    function bilan(rows) {
      [0, 30, 60, 90].forEach(function (a) { ch.setPoints(rows.filter(function (r) { return r.a === a; }).map(function (r) { return [r.d, r.w]; }), 'a' + a); });
      var r0 = rows.filter(function (r) { return r.a === 90; }).length;
      var msg = '';
      if (r0) msg += 'À 90° le travail est nul : une force perpendiculaire au déplacement ne travaille pas. ';
      var ok = [0, 30, 60].filter(function (a) { return ch.count('a' + a) >= 3; });
      if (ok.length) msg += 'Pour α = ' + ok[0] + '°, le graphique est une droite passant par l’origine : <b>W est proportionnel à d</b>.';
      c.results(msg || (rows.length ? 'Relève au moins 3 distances pour un même angle.' : ''));
    }
  }
});
