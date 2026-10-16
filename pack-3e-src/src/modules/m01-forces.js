/* Masse, poids et caractéristiques d'une force */
Lab.register({
  id: 'forces', theme: 'meca', title: 'Le poids d’un objet suspendu',
  lesson: 'Masse et poids · Les forces', skills: ['C1', 'C2', 'C4'],
  objective: 'Décris le poids avec ses 4 caractéristiques, puis trouve la relation entre poids et masse.',
  alt: 'Objet suspendu à un dynamomètre, avec la flèche du poids dirigée vers le bas',
  thumb: '<rect x="62" y="12" width="36" height="14" rx="3" fill="var(--metal)"/><path d="M80 26v14" stroke="var(--scene-text)" stroke-width="3"/><rect x="66" y="40" width="28" height="22" rx="3" fill="var(--s2)"/><path d="M80 62v10M74 67l6 8 6-8" stroke="var(--bad)" stroke-width="3" fill="none"/>',
  height: 420,
  hint: 'Change la masse et le lieu, puis relève plusieurs mesures.',
  steps: [
    'Choisis un lieu (valeur de g) et règle la masse de l’objet.',
    'Lis la valeur du poids sur le dynamomètre et observe la flèche.',
    'Appuie sur « Relever » pour au moins 4 masses différentes.',
    'Observe le graphique : P en fonction de m est une droite qui passe par l’origine.'
  ],
  retiens: [
    'Le <b>poids</b> P est la force d’attraction exercée par la Terre sur un objet. Il se mesure en <b>newton (N)</b> avec un dynamomètre.',
    'Caractéristiques : <b>point d’application</b> = centre de gravité ; <b>direction</b> = verticale ; <b>sens</b> = vers le bas ; <b>valeur</b> P.',
    '<b>P = m × g</b> (m en kg, g en N/kg). Sur Terre g ≈ 9,8 N/kg (on prend souvent 10) ; sur la Lune g ≈ 1,6 N/kg.',
    'La masse ne change pas avec le lieu ; le poids change.'
  ],
  quiz: [
    { q: 'Quelle est la direction du poids d’un objet ?', o: ['Horizontale', 'Verticale', 'Oblique', 'Elle dépend de l’objet'], a: 1, e: 'Le poids est dirigé suivant la verticale du lieu, vers le centre de la Terre.' },
    { q: 'Un objet de 3 kg est pesé sur Terre (g = 10 N/kg). Son poids vaut :', o: ['3 N', '13 N', '30 N', '0,3 N'], a: 2, e: 'P = m × g = 3 × 10 = 30 N.' },
    { q: 'Le même objet est emporté sur la Lune. Qu’est-ce qui change ?', o: ['Sa masse seulement', 'Son poids seulement', 'Sa masse et son poids', 'Rien'], a: 1, e: 'La masse est la quantité de matière : elle ne change pas. Le poids dépend de g.' },
    { q: 'Quelle est l’unité du poids ?', o: ['le kilogramme', 'le newton', 'le joule', 'le watt'], a: 1, e: 'Une force se mesure en newton (N).' },
    { q: 'Où se situe le point d’application du poids ?', o: ['Au sol', 'Au crochet du dynamomètre', 'Au centre de gravité de l’objet', 'Au point le plus haut'], a: 2, e: 'On représente le poids à partir du centre de gravité.' }
  ],
  build: function (c) {
    var LIEUX = { t98: { g: 9.8, n: 'Terre (g = 9,8)', col: 'var(--s1)' }, t10: { g: 10, n: 'Terre (g = 10)', col: 'var(--s3)' }, lune: { g: 1.6, n: 'Lune (g = 1,6)', col: 'var(--s4)' } };
    var K = 3;   // px par newton
    var m = c.slider('Masse m', { min: 0.1, max: 5, step: 0.1, value: 2, unit: 'kg' });
    var lieu = c.choice('Lieu', [{ v: 't98', label: 'Terre 9,8' }, { v: 't10', label: 'Terre 10' }, { v: 'lune', label: 'Lune' }], null, 't98');
    function g() { return LIEUX[lieu.get()].g; }
    function P() { return m.get() * g(); }

    c.s('rect', { x: 40, y: 20, width: 720, height: 380, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('rect', { x: 170, y: 30, width: 160, height: 14, rx: 3, fill: 'var(--metal)' });
    c.s('rect', { x: 230, y: 44, width: 40, height: 100, rx: 6, fill: 'var(--glass)', stroke: 'var(--scene-line)' });
    for (var i = 0; i <= 5; i++) { c.s('line', { x1: 230, x2: 242, y1: 54 + i * 16, y2: 54 + i * 16, stroke: 'var(--scene-text)' }); }
    var rod = c.s('line', { x1: 250, x2: 250, y1: 144, stroke: 'var(--scene-text)', 'stroke-width': 3 });
    var needle = c.s('rect', { x: 230, width: 40, height: 4, fill: 'var(--bad)' });
    var box = c.s('rect', { rx: 5, fill: 'var(--s2)', stroke: 'var(--scene-text)', 'stroke-width': 2 });
    var boxT = c.s('text', { 'font-size': 15, 'text-anchor': 'end', 'font-weight': 700 });
    var arrow = c.s('path', { fill: 'var(--bad)' });
    var dot = c.s('circle', { r: 5, fill: 'var(--scene-text)' });
    var pl = c.s('text', { 'font-size': 16, 'font-weight': 700 }); pl.style.fill = 'var(--bad)';
    c.s('line', { x1: 540, x2: 540 + 10 * K, y1: 70, y2: 70, stroke: 'var(--scene-text)', 'stroke-width': 3 });
    c.s('text', { x: 540, y: 58, 'font-size': 13, text: 'Échelle : 10 N' });
    var car = [c.s('text', { x: 430, y: 120, 'font-size': 15 }), c.s('text', { x: 430, y: 150, 'font-size': 15 }), c.s('text', { x: 430, y: 180, 'font-size': 15 }), c.s('text', { x: 430, y: 210, 'font-size': 15 })];
    c.s('text', { x: 430, y: 96, 'font-size': 15, 'font-weight': 700, text: 'Caractéristiques du poids' });

    c.onUpdate(function () {
      var p = P(), st = p * 0.8, sz = 36 + 10 * Math.cbrt(m.get()), top = 154 + st;
      rod.setAttribute('y2', top); needle.setAttribute('y', 52 + p * 1.6 > 138 ? 138 : 52 + p * 1.6);
      box.setAttribute('x', 250 - sz / 2); box.setAttribute('y', top); box.setAttribute('width', sz); box.setAttribute('height', sz);
      boxT.setAttribute('x', 250 - sz / 2 - 8); boxT.setAttribute('y', top + sz / 2 + 5); boxT.textContent = c.fmt(m.get(), 1) + ' kg';
      var cy = top + sz / 2, L = p * K; dot.setAttribute('cx', 250); dot.setAttribute('cy', cy);
      if (L < 6) arrow.setAttribute('d', ''); else {
        var hd = Math.min(14, L * .5), y1 = cy + L;
        arrow.setAttribute('d', 'M246 ' + cy + 'H254V' + (y1 - hd) + 'H260L250 ' + y1 + 'L240 ' + (y1 - hd) + 'H246Z');
      }
      pl.setAttribute('x', 275); pl.setAttribute('y', cy + Math.max(L, 20) / 2 + 4); pl.textContent = 'P = ' + c.fmt(p, 1) + ' N';
      car[0].textContent = 'Point d’application : centre de gravité (●)';
      car[1].textContent = 'Direction : verticale';
      car[2].textContent = 'Sens : vers le bas';
      car[3].textContent = 'Valeur : P = m × g = ' + c.fmt(m.get(), 1) + ' × ' + c.fmt(g(), 1) + ' = ' + c.fmt(p, 1) + ' N';
    });

    c.readout('Masse m', function () { return m.get(); }, 'kg', 1);
    c.readout('g (lieu)', function () { return g(); }, 'N/kg', 1);
    c.readout('Dynamomètre : P', function () { return c.noise(P(), 0.004); }, 'N', 1);

    var series = Object.keys(LIEUX).map(function (k) { return { id: k, name: LIEUX[k].n, color: LIEUX[k].col }; });
    var ch = c.chart({ x: { label: 'masse m', unit: 'kg', min: 0, max: 5 }, y: { label: 'poids P', unit: 'N', min: 0, max: 50 }, fit: 'origin', series: series });
    c.table({ cols: [{ key: 'lieu', label: 'lieu', txt: true }, { key: 'm', label: 'm', unit: 'kg', d: 1 }, { key: 'p', label: 'P', unit: 'N', d: 1 }, { key: 'r', label: 'P / m', unit: 'N/kg', d: 2 }], max: 12, onChange: bilan });
    c.measure('Relever la mesure', function () {
      var p = c.noise(P(), 0.004); return { k: lieu.get(), lieu: LIEUX[lieu.get()].n, m: m.get(), p: p, r: p / m.get() };
    });
    function bilan(rows) {
      Object.keys(LIEUX).forEach(function (k) { ch.setPoints(rows.filter(function (r) { return r.k === k; }).map(function (r) { return [r.m, r.p]; }), k); });
      var best = null;
      Object.keys(LIEUX).forEach(function (k) { var rr = rows.filter(function (r) { return r.k === k; }); if (rr.length >= 3 && (!best || rr.length > best.n)) best = { k: k, n: rr.length, a: ch.fit(k).a }; });
      c.results(best ? '<b>Conclusion :</b> pour ' + LIEUX[best.k].n.split(' (')[0] + ', P / m ≈ ' + c.fmt(best.a, 1) + ' N/kg : le poids est proportionnel à la masse, <b>P = m × g</b>.' : (rows.length ? 'Relève au moins 3 masses pour un même lieu.' : ''));
    }
  }
});
