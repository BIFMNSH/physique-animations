/* Réduction d'un oxyde : CuO + C */
Lab.register({
  id: 'reduction', theme: 'chimie', title: 'Réduire l’oxyde de cuivre par le carbone',
  lesson: 'Réduction des oxydes', skills: ['C1', 'C2', 'C3', 'C4'],
  objective: 'Observe le cuivre qui réapparaît et détermine le réactif limitant.',
  alt: 'Tube à essais chauffé contenant un mélange d’oxyde de cuivre noir et de carbone, relié à un flacon d’eau de chaux',
  thumb: '<path d="M30 52l50-18" stroke="var(--glass)" stroke-width="12" stroke-linecap="round"/><path d="M80 34h30v26" stroke="var(--scene-line)" stroke-width="3" fill="none"/><rect x="96" y="54" width="28" height="16" rx="3" fill="var(--glass)"/><path d="M26 66q4-10 8 0z" fill="var(--s2)"/>',
  height: 420,
  hint: 'Règle les masses, chauffe, puis compare les bilans.',
  steps: [
    'Règle la masse d’oxyde de cuivre (noir) et celle de carbone.',
    'Chauffe le mélange et observe la couleur et l’eau de chaux.',
    'Lis le bilan des masses et le réactif limitant.',
    'Relève plusieurs essais et compare-les.'
  ],
  retiens: [
    'Une <b>réduction</b> enlève de l’oxygène à un oxyde : <b>2 CuO + C → 2 Cu + CO₂</b>.',
    'Le carbone, qui prend l’oxygène, est <b>oxydé</b> ; l’oxyde de cuivre, qui le perd, est <b>réduit</b> : oxydation et réduction ont lieu en même temps.',
    'Le carbone est le <b>réducteur</b>. Le cuivre rouge-orangé réapparaît ; le CO₂ trouble l’eau de chaux.',
    'En masse : 159 g de CuO réagissent avec 12 g de C pour donner 127 g de Cu et 44 g de CO₂. Le réactif en défaut est <b>limitant</b>.'
  ],
  quiz: [
    { q: 'Que devient l’oxyde de cuivre noir quand on le chauffe avec du carbone ?', o: ['Il reste noir', 'Il devient du cuivre rouge-orangé', 'Il devient blanc', 'Il disparaît sans rien former'], a: 1, e: 'L’oxyde est réduit en cuivre métallique.' },
    { q: 'Que traduit le trouble de l’eau de chaux ?', o: ['La formation d’eau', 'La formation de dioxyde de carbone', 'La formation de dioxygène', 'La formation de dihydrogène'], a: 1, e: 'Le carbone oxydé donne CO₂.' },
    { q: 'Dans la réaction, le carbone est :', o: ['réduit', 'oxydé', 'un catalyseur', 'un produit'], a: 1, e: 'Il gagne de l’oxygène : il est oxydé, c’est le réducteur.' },
    { q: 'On chauffe 159 g de CuO avec 24 g de C. Quel est le réactif limitant ?', o: ['Le carbone', 'L’oxyde de cuivre', 'Le cuivre', 'Aucun'], a: 1, e: '159 g de CuO ne réagissent qu’avec 12 g de C : l’autre moitié de carbone reste.' },
    { q: 'Quelle masse de cuivre obtient-on avec 159 g de CuO et du carbone en excès ?', o: ['159 g', '127 g', '44 g', '12 g'], a: 1, e: '159 + 12 = 127 + 44 : on obtient 127 g de cuivre.' }
  ],
  build: function (c) {
    var M = { cuo: 79.5, c: 12, cu: 63.5, co2: 44 };
    var mo = c.slider('Masse d’oxyde de cuivre CuO', { min: 5, max: 40, step: 1, value: 16, unit: 'g' });
    var mc = c.slider('Masse de carbone C', { min: 0.2, max: 3, step: 0.1, value: 1.2, unit: 'g' });
    var heat = false, prog = 0, done = false, T = 0;
    function calc() {
      var n1 = mo.get() / M.cuo, n2 = mc.get() / M.c, xi = Math.min(n1 / 2, n2);
      var lim = Math.abs(n1 / 2 - n2) < 1e-6 ? 'aucun (proportions exactes)' : (n1 / 2 < n2 ? 'oxyde de cuivre' : 'carbone');
      return { cuo0: mo.get(), c0: mc.get(), cu: 2 * xi * M.cu, co2: xi * M.co2, cuo: mo.get() - 2 * xi * M.cuo, c: mc.get() - xi * M.c, lim: lim, xi: xi };
    }
    c.onReset(function () { heat = false; prog = 0; done = false; });
    c.s('rect', { x: 20, y: 20, width: 760, height: 380, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('path', { d: 'M110 280L330 200', stroke: 'var(--glass)', 'stroke-width': 46, 'stroke-linecap': 'round' });
    c.s('path', { d: 'M110 280L330 200', stroke: 'var(--scene-line)', 'stroke-width': 50, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': .35 });
    var mix = c.s('path', { d: 'M110 280L190 251', stroke: '#222', 'stroke-width': 34, 'stroke-linecap': 'round' });
    var mixTop = c.s('path', { d: 'M110 280L190 251', stroke: '#222', 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-opacity': 0 });
    c.s('path', { d: 'M338 188H470V300', stroke: 'var(--scene-line)', 'stroke-width': 5, fill: 'none' });
    c.s('path', { d: 'M440 270H620V380H440z', fill: 'var(--glass)', 'fill-opacity': .35, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    var chalk = c.s('rect', { x: 443, y: 300, width: 174, height: 77, fill: '#fff', 'fill-opacity': .25 });
    c.s('text', { x: 530, y: 262, 'font-size': 14, 'text-anchor': 'middle', text: 'eau de chaux' });
    var bub = []; for (var i = 0; i < 6; i++) bub.push(c.s('circle', { r: 4, fill: '#fff', 'fill-opacity': .85, cx: 470, cy: -20 }));
    var flame = c.s('path', { fill: '#FF922B' });
    c.s('rect', { x: 90, y: 330, width: 60, height: 30, rx: 4, fill: 'var(--metal)' });
    var info = c.s('g');
    c.onUpdate(function () {
      info.innerHTML = '';
      var k = calc(), t = 0;
      var colr = done ? '#C8693B' : (prog > 0 ? 'rgb(' + Math.round(34 + 166 * prog * (k.cu / (k.cuo0 * 63.5 / 79.5 || 1))) + ',' + Math.round(34 + 70 * prog) + ',' + Math.round(34 + 20 * prog) + ')' : '#222');
      mix.setAttribute('stroke', done ? '#C8693B' : (prog > 0 ? colr : '#222'));
      chalk.setAttribute('fill-opacity', .25 + 0.6 * Math.min(1, prog * k.co2 / 10));
      var x = 400, y = 52;
      c.s('text', { x: 40, y: 50, 'font-size': 16, 'font-weight': 700, text: '2 CuO + C → 2 Cu + CO₂' }, info);
      if (done) {
        var lines = [['Cu formé', k.cu], ['CO₂ formé', k.co2], ['CuO restant', k.cuo], ['C restant', k.c]];
        lines.forEach(function (l, i) { c.s('text', { x: 440, y: 84 + i * 22, 'font-size': 14, text: l[0] + ' : ' + c.fmt(l[1], 2) + ' g' }, info); });
        c.s('text', { x: 40, y: 80, 'font-size': 14, text: 'Réactif limitant : ' + k.lim }, info).style.fill = 'var(--ok)';
        c.s('text', { x: 40, y: 100, 'font-size': 14, text: 'Avant : ' + c.fmt(k.cuo0 + k.c0, 2) + ' g  =  après : ' + c.fmt(k.cu + k.co2 + k.cuo + k.c, 2) + ' g' }, info).style.fill = 'var(--ok)';
      }
      c.s('text', { x: 100, y: 396, 'font-size': 14, text: done ? 'Cuivre rouge-orangé' : (heat ? 'Chauffage…' : 'Mélange noir : oxyde de cuivre + carbone') }, info);
    });
    c.loop(function (dt) {
      T += dt; var k = calc();
      if (heat) { prog = Math.min(1, prog + dt / 4); if (prog >= 1) { heat = false; done = true; c.say('Réaction terminée : cuivre formé, le CO₂ a troublé l’eau de chaux.', 'ok'); } c.update(); }
      bub.forEach(function (b, i) { if (!heat) { b.setAttribute('cy', -20); return; } var ph = ((T * .8 + i / 6) % 1); b.setAttribute('cx', 470 + (ph * 100 - 20) * 0); b.setAttribute('cy', 350 - ph * 60); b.setAttribute('cx', 500 + Math.sin(ph * 9 + i) * 10 + i * 6); });
      if (heat) { var fl = 12 + 6 * Math.sin(T * 20); flame.setAttribute('d', 'M120 324Q112 ' + (300 - fl) + ' 120 ' + (286 - fl * 1.4) + 'Q128 ' + (300 - fl) + ' 120 324Z'); flame.setAttribute('transform', 'translate(0 0)'); }
      else flame.setAttribute('d', '');
    });
    c.button('Chauffer', function () { if (heat) return; done = false; prog = 0; heat = true; c.say('Le mélange chauffe…', 'ok'); }, { into: 'ctrl' });
    c.readout('n(CuO)', function () { return mo.get() / M.cuo; }, 'mol', 3);
    c.readout('n(C)', function () { return mc.get() / M.c; }, 'mol', 3);
    c.readout('Réactif limitant', function () { return calc().lim.split(' (')[0]; });
    var ch = c.chart({ x: { label: 'masse de CuO introduite', unit: 'g', min: 0, max: 40 }, y: { label: 'masse de cuivre obtenue', unit: 'g', min: 0, max: 32 }, fit: null, series: [{ id: 'cuo', name: 'CuO limitant', color: 'var(--s1)' }, { id: 'c', name: 'C limitant', color: 'var(--s2)' }] });
    c.table({ cols: [{ key: 'a', label: 'm(CuO)', unit: 'g', d: 1 }, { key: 'b', label: 'm(C)', unit: 'g', d: 1 }, { key: 'cu', label: 'm(Cu)', unit: 'g', d: 2 }, { key: 'co2', label: 'm(CO₂)', unit: 'g', d: 2 }, { key: 'lim', label: 'limitant', txt: true }], max: 10, onChange: bilan });
    c.measure('Relever ce bilan', function () {
      if (!done) { c.say('Chauffe d’abord pour pouvoir relever le bilan.', 'warn'); return null; }
      var k = calc(); return { a: k.cuo0, b: k.c0, cu: k.cu, co2: k.co2, lim: k.lim.split(' (')[0], id: k.lim.indexOf('carbone') === 0 ? 'c' : 'cuo' };
    });
    function bilan(rows) {
      ['cuo', 'c'].forEach(function (id) { ch.setPoints(rows.filter(function (r) { return r.id === id; }).map(function (r) { return [r.a, r.cu]; }), id); });
      var a = rows.filter(function (r) { return r.id === 'cuo'; }), b = rows.filter(function (r) { return r.id === 'c'; });
      var msg = '';
      if (a.length) msg += 'Quand le carbone est en excès, la masse de cuivre est proportionnelle à la masse de CuO (≈ ' + c.fmt(a[0].cu / a[0].a, 2) + ' g de Cu par g de CuO). ';
      if (b.length) msg += 'Quand le carbone est limitant, ajouter du CuO ne donne pas plus de cuivre : la quantité de carbone impose la limite.';
      c.results(msg);
    }
  }
});
