/* Oxydation des corps purs simples : combustion dans le dioxygène */
Lab.register({
  id: 'oxydation', theme: 'chimie', title: 'Brûler un corps dans le dioxygène',
  lesson: 'Oxydation des corps purs simples', skills: ['C1', 'C2', 'C3', 'C4'],
  objective: 'Prévois le produit formé et vérifie que la masse se conserve.',
  alt: 'Bocal de dioxygène dans lequel brûle un corps simple posé sur une cuillère, avec bilan des masses avant et après',
  thumb: '<rect x="50" y="12" width="60" height="56" rx="8" fill="var(--glass)" stroke="var(--scene-line)" stroke-width="2"/><path d="M80 12v24" stroke="var(--scene-text)" stroke-width="3"/><circle cx="80" cy="46" r="8" fill="var(--s2)"/><circle cx="80" cy="46" r="4" fill="#FFD43B"/>',
  height: 420,
  hint: 'Choisis un corps, règle les quantités, puis allume.',
  steps: [
    'Choisis le corps à brûler et règle sa masse et le volume de dioxygène.',
    'Appuie sur « Allumer » et observe la flamme.',
    'Lis le bilan : masses avant et après la réaction.',
    'Relève plusieurs essais : la masse totale se conserve.'
  ],
  retiens: [
    'Une <b>oxydation</b> est une réaction avec le dioxygène : <b>corps + dioxygène → oxyde</b>.',
    'Exemples : C + O₂ → CO₂ ; S + O₂ → SO₂ ; 3 Fe + 2 O₂ → Fe₃O₄ ; 2 Mg + O₂ → 2 MgO ; 2 Cu + O₂ → 2 CuO.',
    'Pendant la réaction, la <b>masse totale se conserve</b> : m(avant) = m(après). Les atomes ne disparaissent pas, ils se réarrangent.',
    'Si un réactif est en défaut, il est entièrement consommé : c’est le <b>réactif limitant</b>.'
  ],
  quiz: [
    { q: 'Que forme la combustion du carbone dans le dioxygène ?', o: ['Du monoxyde de fer', 'Du dioxyde de carbone', 'De l’eau', 'Du dioxyde de soufre'], a: 1, e: 'C + O₂ → CO₂ (il trouble l’eau de chaux).' },
    { q: 'On brûle 6 g de carbone avec 16 g de dioxygène (tout est consommé). Quelle masse de CO₂ obtient-on ?', o: ['10 g', '16 g', '22 g', '96 g'], a: 2, e: 'La masse se conserve : 6 + 16 = 22 g.' },
    { q: 'Quelle est l’équation de l’oxydation du fer dans le dioxygène (oxyde Fe₃O₄) ?', o: ['Fe + O₂ → FeO₂', '3 Fe + 2 O₂ → Fe₃O₄', '2 Fe + O₂ → Fe₂O', 'Fe + 2 O → FeO'], a: 1, e: '3 Fe à gauche et à droite ; 4 O à gauche et à droite.' },
    { q: 'Un réactif limitant est :', o: ['celui qui reste à la fin', 'celui qui est entièrement consommé', 'le gaz', 'le produit'], a: 1, e: 'Quand il est épuisé, la réaction s’arrête.' },
    { q: 'Le magnésium brûle avec une flamme éblouissante. Le produit est :', o: ['un gaz', 'une poudre blanche d’oxyde de magnésium', 'de l’eau', 'un liquide noir'], a: 1, e: '2 Mg + O₂ → 2 MgO, solide blanc.' }
  ],
  build: function (c) {
    var S = {
      C: { n: 'carbone', M: 12, a: 1, b: 1, p: 'dioxyde de carbone CO₂', Mp: 44, eq: 'C + O₂ → CO₂', col: '#2B2B2B', flame: '#FF6B35', prod: 'gaz (CO₂)', solid: false, test: true },
      S: { n: 'soufre', M: 32, a: 1, b: 1, p: 'dioxyde de soufre SO₂', Mp: 64, eq: 'S + O₂ → SO₂', col: '#F2D024', flame: '#4C6EF5', prod: 'gaz (SO₂)', solid: false },
      Fe: { n: 'fer', M: 56, a: 3, b: 2, p: 'oxyde de fer Fe₃O₄', Mp: 232, eq: '3 Fe + 2 O₂ → Fe₃O₄', col: '#7F8794', flame: '#FFE066', prod: 'poudre noire', solid: true, pc: '#2B2F36' },
      Mg: { n: 'magnésium', M: 24, a: 2, b: 1, p: 'oxyde de magnésium MgO', Mp: 40, eq: '2 Mg + O₂ → 2 MgO', col: '#C9CED6', flame: '#FFFFFF', prod: 'poudre blanche', solid: true, pc: '#F1F3F5', ap: 2 },
      Cu: { n: 'cuivre', M: 64, a: 2, b: 1, p: 'oxyde de cuivre CuO', Mp: 80, eq: '2 Cu + O₂ → 2 CuO', col: '#C8693B', flame: '#FF922B', prod: 'poudre noire', solid: true, pc: '#25282D', ap: 2 }
    };
    var COL = { C: 'var(--s5)', S: 'var(--s2)', Fe: 'var(--s1)', Mg: 'var(--s4)', Cu: 'var(--s3)' };
    var corps = c.choice('Corps simple', [{ v: 'C', label: 'Carbone' }, { v: 'S', label: 'Soufre' }, { v: 'Fe', label: 'Fer' }, { v: 'Mg', label: 'Magnésium' }, { v: 'Cu', label: 'Cuivre' }], function () { done = null; prog = 0; }, 'C');
    var ms = c.slider('Masse du corps', { min: 0.5, max: 6, step: 0.5, value: 3, unit: 'g' });
    var vo = c.slider('Volume de dioxygène', { min: 0.5, max: 15, step: 0.5, value: 5, unit: 'L' });
    var done = null, prog = 0, burning = false, T = 0, testDone = false;
    function calc() {
      var s = S[corps.get()], n1 = ms.get() / s.M, n2 = vo.get() / 24, xi = Math.min(n1 / s.a, n2 / s.b);
      var cons = xi * s.a * s.M, o2c = xi * s.b * 32, prod = xi * (s.ap || 1) * s.Mp;
      if (s.ap) prod = xi * s.ap * s.Mp; else prod = xi * s.Mp;
      var lim = (n1 / s.a < n2 / s.b - 1e-9) ? s.n : ((n1 / s.a > n2 / s.b + 1e-9) ? 'dioxygène' : 'aucun (proportions exactes)');
      return { s: s, m0: ms.get(), o0: n2 * 32, cons: cons, o2c: o2c, prod: prod, rest: ms.get() - cons, orest: n2 * 32 - o2c, lim: lim };
    }
    c.onReset(function () { done = null; prog = 0; burning = false; testDone = false; });
    c.s('rect', { x: 20, y: 20, width: 760, height: 380, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('rect', { x: 120, y: 90, width: 220, height: 270, rx: 18, fill: 'var(--glass)', 'fill-opacity': .35, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    var gas = c.s('rect', { x: 124, y: 94, width: 212, height: 262, rx: 14, fill: 'var(--s1)' });
    c.s('rect', { x: 150, y: 76, width: 160, height: 14, rx: 4, fill: 'var(--metal)' });
    c.s('line', { x1: 230, x2: 230, y1: 90, y2: 230, stroke: 'var(--scene-text)', 'stroke-width': 3 });
    c.s('path', { d: 'M205 232h50l-8 18h-34z', fill: 'var(--metal)' });
    var pile = c.s('circle', { cx: 230, cy: 228, r: 14, fill: '#444' });
    var powder = c.s('ellipse', { cx: 230, cy: 350, rx: 70, ry: 0, fill: '#444' });
    var flame = c.s('path', { fill: '#FF922B', 'fill-opacity': .9 }); var flame2 = c.s('path', { fill: '#FFF3BF', 'fill-opacity': .95 });
    var lab = c.s('text', { x: 230, y: 392, 'font-size': 14, 'text-anchor': 'middle' });
    var board = c.s('g'); var bx = 400;
    function row(y, a, b, bold) { var t1 = c.s('text', { x: bx + 10, y: y, 'font-size': 15, 'font-weight': bold ? 700 : 400 }, board); t1.textContent = a; var t2 = c.s('text', { x: 760, y: y, 'font-size': 15, 'text-anchor': 'end', 'font-weight': bold ? 700 : 400 }, board); t2.textContent = b; }
    c.onUpdate(function () {
      var k = calc(), s = k.s; board.innerHTML = '';
      gas.setAttribute('fill-opacity', .12 + Math.min(1, vo.get() / 15) * .5);
      pile.setAttribute('fill', s.col); pile.setAttribute('r', done ? 6 : 8 + ms.get() * 1.6); pile.setAttribute('cy', 226 - (done ? 0 : 0));
      var pr = done ? (s.solid ? Math.min(1, k.prod / 14) : 0) : 0;
      powder.setAttribute('fill', s.pc || '#ccc'); powder.setAttribute('ry', pr * 14 + (pr ? 3 : 0));
      lab.textContent = burning ? 'Combustion en cours…' : (done ? 'Terminé : ' + s.p : s.n + ' + dioxygène');
      var t = c.s('text', { x: bx + 10, y: 56, 'font-size': 17, 'font-weight': 700, text: 'Bilan des masses' }, board);
      c.s('text', { x: bx + 10, y: 80, 'font-size': 14, text: 'Équation : ' + s.eq }, board);
      c.s('text', { x: bx + 10, y: 116, 'font-size': 14, 'font-weight': 700, text: 'AVANT' }, board);
      row(138, 'm(' + s.n + ')', c.fmt(k.m0, 2) + ' g'); row(160, 'm(dioxygène)', c.fmt(k.o0, 2) + ' g'); row(184, 'Total avant', c.fmt(k.m0 + k.o0, 2) + ' g', true);
      c.s('text', { x: bx + 10, y: 226, 'font-size': 14, 'font-weight': 700, text: 'APRÈS' }, board);
      if (done) {
        row(248, 'm(' + s.n + ') restant', c.fmt(k.rest, 2) + ' g'); row(270, 'm(dioxygène) restant', c.fmt(k.orest, 2) + ' g'); row(292, 'm(' + s.p.split(' ').slice(-1)[0] + ')', c.fmt(k.prod, 2) + ' g'); row(318, 'Total après', c.fmt(k.rest + k.orest + k.prod, 2) + ' g', true);
        c.s('text', { x: bx + 10, y: 350, 'font-size': 14, text: 'Réactif limitant : ' + k.lim }, board).style.fill = 'var(--ok)';
        c.s('text', { x: bx + 10, y: 374, 'font-size': 14, text: 'La masse totale se conserve.' }, board).style.fill = 'var(--ok)';
      } else c.s('text', { x: bx + 10, y: 256, 'font-size': 14, text: 'Appuie sur « Allumer » pour voir le bilan.' }, board).style.fill = 'var(--scene-muted)';
    });
    c.loop(function (dt) {
      T += dt; var s = S[corps.get()];
      if (burning) { prog += dt / 3; if (prog >= 1) { burning = false; done = true; prog = 1; c.say('Réaction terminée : ' + s.p + ' formé.', 'ok'); c.update(); } }
      if (burning) {
        var fl = 18 + 20 * Math.sin(T * 18) * Math.sin(T * 7), w = 16 + 8 * (1 - prog);
        flame.setAttribute('d', 'M' + (230 - w) + ' 226Q' + (230 - w) + ' ' + (190 - fl) + ' 230 ' + (176 - fl * 2) + 'Q' + (230 + w) + ' ' + (190 - fl) + ' ' + (230 + w) + ' 226Z');
        flame2.setAttribute('d', 'M' + (230 - w / 2) + ' 226Q' + (230 - w / 2) + ' 200 230 ' + (196 - fl) + 'Q' + (230 + w / 2) + ' 200 ' + (230 + w / 2) + ' 226Z');
        flame.setAttribute('fill', s.flame);
      } else { flame.setAttribute('d', ''); flame2.setAttribute('d', ''); }
    });
    c.button('Allumer', function () { if (burning) return; done = null; prog = 0; burning = true; testDone = false; c.say('Le corps brûle dans le dioxygène…', 'ok'); }, { into: 'ctrl' });
    c.button('Tester le gaz à l’eau de chaux', function () {
      if (!done) { c.say('Fais d’abord brûler le corps.', 'warn'); return; }
      if (corps.get() === 'C') c.say('L’eau de chaux se trouble : il s’est formé du dioxyde de carbone.', 'ok');
      else if (corps.get() === 'S') c.say('Pas de trouble net, mais une odeur piquante : c’est du dioxyde de soufre (à ne pas respirer).', 'warn');
      else c.say('Aucun gaz formé : le produit est un solide (oxyde), l’eau de chaux ne change pas.', 'warn');
    }, { into: 'ctrl' });
    c.readout('Corps', function () { return S[corps.get()].n; });
    c.readout('Produit', function () { return S[corps.get()].p.split(' ').slice(-1)[0]; });
    var series = Object.keys(S).map(function (k) { return { id: k, name: S[k].n, color: COL[k] }; });
    var ch = c.chart({ x: { label: 'masse de corps consommée', unit: 'g', min: 0, max: 6 }, y: { label: 'masse d’oxyde formée', unit: 'g', min: 0, max: 24 }, fit: 'origin', series: series });
    c.table({ cols: [{ key: 'n', label: 'corps', txt: true }, { key: 'm0', label: 'm corps', unit: 'g', d: 2 }, { key: 'o0', label: 'm O₂', unit: 'g', d: 2 }, { key: 'avant', label: 'total avant', unit: 'g', d: 2 }, { key: 'prod', label: 'm produit', unit: 'g', d: 2 }, { key: 'apres', label: 'total après', unit: 'g', d: 2 }], max: 12, onChange: bilan });
    c.measure('Relever ce bilan', function () {
      if (!done) { c.say('Allume d’abord pour pouvoir relever le bilan.', 'warn'); return null; }
      var k = calc(); return { k: corps.get(), n: k.s.n, m0: k.m0, o0: k.o0, avant: k.m0 + k.o0, prod: k.prod, cons: k.cons, apres: k.rest + k.orest + k.prod };
    });
    function bilan(rows) {
      Object.keys(S).forEach(function (k) { ch.setPoints(rows.filter(function (r) { return r.k === k; }).map(function (r) { return [r.cons, r.prod]; }), k); });
      if (rows.length >= 2) { var ok = rows.every(function (r) { return Math.abs(r.avant - r.apres) < 0.011; }); c.results(ok ? '<b>Conclusion :</b> dans tous tes essais, total avant = total après : la masse se conserve (même si un réactif reste). Le graphique montre que la masse d’oxyde est proportionnelle à celle du corps consommé.' : 'Vérifie les totaux.'); }
      else c.results(rows.length ? 'Fais au moins 2 essais.' : '');
    }
  }
});
