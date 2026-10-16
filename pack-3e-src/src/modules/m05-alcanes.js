/* Les alcanes : constructeur de molécules */
Lab.register({
  id: 'alcanes', theme: 'chimie', title: 'Constructeur d’alcanes',
  lesson: 'Les alcanes', skills: ['C1', 'C2', 'C3', 'C4'],
  objective: 'Construis les alcanes de 1 à 6 carbones et trouve la formule générale.',
  alt: 'Molécule d’alcane en chaîne : atomes de carbone gris et atomes d’hydrogène blancs reliés par des traits',
  thumb: '<g stroke="var(--scene-text)" stroke-width="2"><path d="M40 39H120M60 39v-18M60 39v18M80 39v-18M80 39v18M100 39v-18M100 39v18"/></g><g><circle cx="40" cy="39" r="9" fill="#8A8A8A"/><circle cx="80" cy="39" r="9" fill="#8A8A8A"/><circle cx="120" cy="39" r="9" fill="#8A8A8A"/><circle cx="60" cy="18" r="5" fill="#fff" stroke="var(--scene-text)"/><circle cx="100" cy="60" r="5" fill="#fff" stroke="var(--scene-text)"/></g>',
  height: 420,
  hint: 'Change le nombre d’atomes de carbone, observe la formule, puis enregistre.',
  steps: [
    'Choisis le nombre n d’atomes de carbone (1 à 6).',
    'Compte les atomes de carbone et d’hydrogène sur le dessin.',
    'Appuie sur « Ajouter à ma liste » pour chaque valeur de n.',
    'Observe le graphique : H en fonction de C est une droite.'
  ],
  retiens: [
    'Les <b>alcanes</b> sont des hydrocarbures (C et H) où chaque carbone forme 4 liaisons simples. Formule générale : <b>CₙH₂ₙ₊₂</b>.',
    'Noms : méthane (1), éthane (2), propane (3), butane (4), pentane (5), hexane (6).',
    'Combustion complète : alcane + dioxygène → <b>dioxyde de carbone + eau</b>. En combustion incomplète, il se forme aussi du monoxyde de carbone (CO) et du carbone (suie).',
    'À 20 °C, de 1 à 4 carbones les alcanes sont gazeux ; pentane et hexane sont liquides.'
  ],
  quiz: [
    { q: 'Quelle est la formule du propane ?', o: ['C₃H₆', 'C₃H₈', 'C₂H₆', 'C₄H₁₀'], a: 1, e: 'n = 3 : C₃H₂×3+2 = C₃H₈.' },
    { q: 'Combien d’atomes d’hydrogène contient le pentane (n = 5) ?', o: ['10', '11', '12', '14'], a: 2, e: '2n + 2 = 12.' },
    { q: 'Quels produits donne la combustion complète d’un alcane ?', o: ['Carbone et eau', 'Dioxyde de carbone et eau', 'Monoxyde de carbone et dihydrogène', 'Dioxygène et eau'], a: 1, e: 'Alcane + O₂ → CO₂ + H₂O.' },
    { q: 'Quel test met en évidence le dioxyde de carbone ?', o: ['Il rougit le sulfate de cuivre', 'Il trouble l’eau de chaux', 'Il ravive une allumette', 'Il explose'], a: 1, e: 'CO₂ trouble l’eau de chaux ; l’eau est détectée par le sulfate de cuivre anhydre.' },
    { q: 'Le butane a pour formule :', o: ['C₄H₈', 'C₄H₁₀', 'C₅H₁₂', 'C₃H₈'], a: 1, e: 'n = 4 : 2×4 + 2 = 10 hydrogènes.' }
  ],
  build: function (c) {
    var NOM = ['', 'méthane', 'éthane', 'propane', 'butane', 'pentane', 'hexane'];
    var SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    function sub(n) { return String(n).split('').map(function (d) { return SUB[+d]; }).join(''); }
    var n = c.slider('Nombre de carbones n', { min: 1, max: 6, step: 1, value: 3 });
    var labels = c.toggle('Afficher les symboles C et H', null, true);
    c.s('rect', { x: 20, y: 20, width: 760, height: 380, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    var g = c.s('g'), title = c.s('text', { x: 400, y: 56, 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' }), semi = c.s('text', { x: 400, y: 318, 'font-size': 17, 'text-anchor': 'middle' }),
      comb = c.s('text', { x: 400, y: 352, 'font-size': 16, 'text-anchor': 'middle' }), bal = c.s('text', { x: 400, y: 380, 'font-size': 14, 'text-anchor': 'middle' });
    bal.style.fill = 'var(--scene-muted)';
    function atom(x, y, el, p) {
      var r = el === 'C' ? 19 : 12;
      var a = c.s('circle', { cx: x, cy: y, r: r, fill: el === 'C' ? '#8A8A8A' : '#FFFFFF', stroke: 'var(--scene-text)', 'stroke-width': 1.5 }, p);
      if (labels.get()) { var t = c.s('text', { x: x, y: y + 5, 'font-size': el === 'C' ? 16 : 12, 'font-weight': 700, 'text-anchor': 'middle', text: el }, p); t.style.fill = el === 'C' ? '#fff' : '#142238'; }
    }
    function coef(N) { var o = (3 * N + 1), d = 2; if (N % 2 === 0) { return { k: 2, c: 2 * N, o: o, h: 2 * N + 2, a: 1 }; } return { k: 1, c: N, o: o / 2, h: N + 1, a: 1 }; }
    c.onUpdate(function () {
      var N = n.get(); g.innerHTML = '';
      var sp = N > 4 ? 100 : 118, x0 = 400 - (N - 1) * sp / 2, cy = 180;
      var bonds = c.s('g', {}, g), atoms = c.s('g', {}, g);
      function link(x1, y1, x2, y2) { c.s('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'var(--scene-text)', 'stroke-width': 3 }, bonds); }
      for (var i = 0; i < N; i++) {
        var x = x0 + i * sp; if (i) link(x - sp, cy, x, cy);
        link(x, cy, x, cy - 56); link(x, cy, x, cy + 56); atom(x, cy - 56, 'H', atoms); atom(x, cy + 56, 'H', atoms);
        if (i === 0) { link(x, cy, x - 58, cy); atom(x - 58, cy, 'H', atoms); }
        if (i === N - 1) { link(x, cy, x + 58, cy); atom(x + 58, cy, 'H', atoms); }
      }
      for (var j = 0; j < N; j++) atom(x0 + j * sp, cy, 'C', atoms);
      title.textContent = NOM[N] + ' : C' + sub(N) + 'H' + sub(2 * N + 2);
      var sm = []; for (var k = 0; k < N; k++) { var hh = (k === 0 || k === N - 1) ? 3 : 2; if (N === 1) hh = 4; sm.push('CH' + (hh > 1 ? sub(hh) : '')); }
      semi.textContent = 'Formule semi-développée : ' + sm.join('–');
      var q = coef(N), m = q.k;
      comb.textContent = (m > 1 ? m + ' ' : '') + 'C' + sub(N) + 'H' + sub(2 * N + 2) + ' + ' + q.o + ' O' + sub(2) + ' → ' + q.c + ' CO' + sub(2) + ' + ' + q.h + ' H' + sub(2) + 'O';
      bal.textContent = 'Bilan des atomes — C : ' + q.c + ' = ' + q.c + ' · H : ' + (2 * (m === 2 ? 2 * N + 2 : 2 * N + 2) / 2 * (m)) + '';
      bal.textContent = 'Bilan des atomes : C ' + (m * N) + ' = ' + q.c + ' · H ' + (m * (2 * N + 2)) + ' = ' + (2 * q.h) + ' · O ' + (2 * q.o) + ' = ' + (2 * q.c + q.h);
    });
    c.readout('Carbones (C)', function () { return n.get(); }, '', 0);
    c.readout('Hydrogènes (H)', function () { return 2 * n.get() + 2; }, '', 0);
    c.readout('État à 20 °C', function () { return n.get() <= 4 ? 'gaz' : 'liquide'; });
    var ch = c.chart({ x: { label: 'nombre de C', min: 0, max: 7 }, y: { label: 'nombre de H', min: 0, max: 16 }, fit: 'line' });
    c.table({ cols: [{ key: 'nom', label: 'nom', txt: true }, { key: 'c', label: 'C', d: 0 }, { key: 'h', label: 'H', d: 0 }, { key: 'f', label: 'formule', txt: true }, { key: 'e', label: 'état 20 °C', txt: true }], max: 6, onChange: bilan });
    c.measure('Ajouter à ma liste', function () {
      var N = n.get(); if (c.rows().some(function (r) { return r.c === N; })) { c.say('Cet alcane est déjà dans la liste.', 'warn'); return null; }
      return { nom: NOM[N], c: N, h: 2 * N + 2, f: 'C' + sub(N) + 'H' + sub(2 * N + 2), e: N <= 4 ? 'gaz' : 'liquide' };
    });
    function bilan(rows) {
      ch.setPoints(rows.map(function (r) { return [r.c, r.h]; }));
      if (rows.length >= 3) { var f = ch.fit(); c.results('<b>Conclusion :</b> H = ' + c.fmt(f.a, 0) + ' × C + ' + c.fmt(f.b, 0) + '. Formule générale des alcanes : <b>CₙH₂ₙ₊₂</b>.'); }
      else c.results(rows.length ? 'Ajoute au moins 3 alcanes différents.' : '');
    }
  }
});
