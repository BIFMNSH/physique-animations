/* 3e · Les alcanes : formule générale CnH2n+2 et combustion complète */
Sim.register('alcanes', {
  objective: 'Construire les alcanes du méthane à l’hexane, trouver leur formule générale et équilibrer l’équation de leur combustion complète.',
  alt: 'Modèle moléculaire d’un alcane (atomes de carbone noirs et d’hydrogène blancs) avec sa formule, et l’équation de sa combustion avec le décompte des atomes',
  chart: true,
  steps: [
    'Choisis le nombre n d’atomes de carbone avec le curseur et observe le modèle de la molécule.',
    'Compte les atomes d’hydrogène, puis relève l’alcane (n, nom, formule, nombre d’H, masse molaire).',
    'Relève les 6 alcanes et observe la courbe : nombre d’H en fonction de n. Quelle relation trouves-tu ?',
    'Active « J’équilibre moi-même » et trouve les coefficients de la combustion complète : chaque atome doit être aussi nombreux à gauche et à droite.'
  ],
  retiens: [
    'Les <b>alcanes</b> sont des hydrocarbures (composés de carbone et d’hydrogène) dont la formule générale est <b>CₙH₂ₙ₊₂</b>.',
    'Les quatre premiers : méthane CH₄, éthane C₂H₆, propane C₃H₈, butane C₄H₁₀ (gaz naturel, gaz en bouteille).',
    'Combustion complète d’un alcane dans le dioxygène : il se forme du <b>dioxyde de carbone</b> (trouble l’eau de chaux) et de l’<b>eau</b> (buée). Ex. : <b>CH₄ + 2 O₂ → CO₂ + 2 H₂O</b>.',
    'Une combustion incomplète (manque de dioxygène) produit du carbone (fumée noire) et du <b>monoxyde de carbone CO</b>, un gaz mortel : il faut aérer.'
  ],
  quiz: [
    { q: 'Quelle est la formule du propane (n = 3) ?', o: ['C₃H₆', 'C₃H₈', 'C₃H₁₀', 'C₈H₃'], a: 1, e: 'CₙH₂ₙ₊₂ avec n = 3 : C₃H₈.' },
    { q: 'Un alcane possède 12 atomes d’hydrogène. Combien a-t-il d’atomes de carbone ?', o: ['4', '5', '6', '12'], a: 1, e: '2n + 2 = 12 donc n = 5 : c’est le pentane C₅H₁₂.' },
    { q: 'Quels produits forme la combustion complète du butane ?', o: ['CO et H₂', 'CO₂ et H₂O', 'C et O₂', 'CO₂ seulement'], a: 1, e: 'Combustion complète d’un alcane : dioxyde de carbone et eau.' },
    { q: 'Complète : CH₄ + … O₂ → CO₂ + 2 H₂O', o: ['1', '2', '3', '4'], a: 1, e: 'À droite : 2 O (CO₂) + 2 O (2 H₂O) = 4 O, soit 2 O₂.' },
    { q: 'Pourquoi une combustion incomplète du gaz est-elle dangereuse ?', o: ['Elle produit du monoxyde de carbone, toxique', 'Elle produit trop d’eau', 'Elle consomme le carbone', 'Elle ne chauffe pas'], a: 0, e: 'Le monoxyde de carbone CO est incolore, inodore et mortel : il faut aérer et faire entretenir les appareils.' }
  ],
  build: function (e) {
    var W = e.W, NAMES = ['', 'méthane', 'éthane', 'propane', 'butane', 'pentane', 'hexane'];
    var USE = ['', 'gaz naturel, biogaz', 'gaz naturel', 'gaz en bouteille', 'gaz en bouteille, briquets', 'constituant de l’essence', 'solvant, essence'];
    var n = 1, self = false, co = [1, 1, 1, 1], tbl, ch, born = 0;
    var SUB = '₀₁₂₃₄₅₆₇₈₉';
    function sub(k) { return String(k).split('').map(function (c) { return SUB[+c]; }).join(''); }
    function formula(k) { return 'C' + (k > 1 ? sub(k) : '') + 'H' + sub(2 * k + 2); }
    function semi(k) { if (k === 1) return 'CH₄'; var a = ['CH₃']; for (var i = 2; i < k; i++) a.push('CH₂'); a.push('CH₃'); return a.join('–'); }
    function coefs(k) { var b = 3 * k + 1; return b % 2 ? [2, b, 2 * k, 2 * (k + 1)] : [1, b / 2, k, k + 1]; }

    var defs = e.s('defs');
    var gC = e.s('radialGradient', { id: 'alC', cx: 0.35, cy: 0.35, r: 0.7 }, defs);
    e.s('stop', { offset: 0, 'stop-color': '#7A8597' }, gC); e.s('stop', { offset: 1, 'stop-color': '#1E2533' }, gC);
    var gH = e.s('radialGradient', { id: 'alH', cx: 0.35, cy: 0.35, r: 0.7 }, defs);
    e.s('stop', { offset: 0, 'stop-color': '#FFFFFF' }, gH); e.s('stop', { offset: 1, 'stop-color': '#B9C3D3' }, gH);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    e.s('rect', { x: 12, y: 246, width: W - 24, height: 116, rx: 12, fill: 'var(--scene2)' });
    var mol = e.s('g');
    var nameT = e.s('text', { x: 20, y: 34, 'font-size': 24, 'font-weight': 800, fill: 'var(--scene-text)' });
    var formT = e.s('text', { x: 20, y: 62, 'font-size': 19, 'font-weight': 800, fill: 'var(--s1)' });
    var semiT = e.s('text', { x: 20, y: 86, 'font-size': 14, fill: 'var(--scene-muted)' });
    var infoT = e.s('text', { x: 780, y: 34, 'text-anchor': 'end', 'font-size': 14, fill: 'var(--scene-muted)' });
    var massT = e.s('text', { x: 780, y: 58, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 800, fill: 'var(--s2)' });
    var cntT = e.s('text', { x: 780, y: 82, 'text-anchor': 'end', 'font-size': 14, fill: 'var(--scene-text)' });
    e.s('text', { x: 28, y: 272, 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-muted)', 'letter-spacing': '0.1em', text: 'COMBUSTION COMPLÈTE DANS LE DIOXYGÈNE' });
    var eqT = e.s('text', { x: W / 2, y: 310, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 800, fill: 'var(--scene-text)' });
    var chk = [0, 1, 2].map(function (j) { return e.s('text', { x: 200 + j * 200, y: 344, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800 }); });
    /* petite flamme */
    var fl = e.s('path', { fill: 'var(--s1)', opacity: 0.85 });
    var fl2 = e.s('path', { fill: 'var(--warn)', opacity: 0.9 });
    var leg = e.s('g');
    e.s('circle', { cx: 30, cy: 230, r: 9, fill: 'url(#alC)' }, leg); e.s('text', { x: 44, y: 235, 'font-size': 13, fill: 'var(--scene-muted)', text: 'carbone C' }, leg);
    e.s('circle', { cx: 130, cy: 230, r: 6, fill: 'url(#alH)', stroke: '#8D99AE' }, leg); e.s('text', { x: 142, y: 235, 'font-size': 13, fill: 'var(--scene-muted)', text: 'hydrogène H' }, leg);

    var atoms = [];
    function build() {
      mol.innerHTML = ''; atoms = [];
      var gap = 74, cy = 170, x0 = W / 2 - (n - 1) * gap / 2, bonds = e.s('g', {}, mol), aG = e.s('g', {}, mol);
      function bond(x1, y1, x2, y2) { e.s('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: 'var(--scene-muted)', 'stroke-width': 6, 'stroke-linecap': 'round' }, bonds); }
      function atom(x, y, isC, i) { var c = e.s('circle', { cx: x, cy: y, r: 0, fill: isC ? 'url(#alC)' : 'url(#alH)', stroke: isC ? 'none' : '#8D99AE', 'stroke-width': 1 }, aG); atoms.push({ el: c, R: isC ? 22 : 14, d: i * 0.05 }); }
      var k = 0;
      for (var i = 0; i < n; i++) {
        var x = x0 + i * gap;
        if (i > 0) bond(x - gap, cy, x, cy);
        bond(x, cy, x, cy - 56); bond(x, cy, x, cy + 56);
        atom(x, cy, true, k++); atom(x, cy - 56, false, k++); atom(x, cy + 56, false, k++);
      }
      bond(x0, cy, x0 - 56, cy); atom(x0 - 56, cy, false, k++);
      bond(x0 + (n - 1) * gap, cy, x0 + (n - 1) * gap + 56, cy); atom(x0 + (n - 1) * gap + 56, cy, false, k++);
      born = 0;
    }
    function count(c) {
      var L = { C: c[0] * n, H: c[0] * (2 * n + 2), O: 2 * c[1] }, R = { C: c[2], H: 2 * c[3], O: 2 * c[2] + c[3] };
      return { L: L, R: R, ok: L.C === R.C && L.H === R.H && L.O === R.O };
    }
    function k1(c) { return c === 1 ? '' : c + ' '; }
    function draw() {
      nameT.textContent = NAMES[n].charAt(0).toUpperCase() + NAMES[n].slice(1);
      formT.textContent = 'Formule brute : ' + formula(n);
      semiT.textContent = 'Semi-développée : ' + semi(n);
      infoT.textContent = (n <= 4 ? 'Gaz' : 'Liquide') + ' à 20 °C · ' + USE[n];
      massT.textContent = 'M = ' + n + ' × 12 + ' + (2 * n + 2) + ' × 1 = ' + (14 * n + 2) + ' g/mol';
      cntT.textContent = n + ' atome' + (n > 1 ? 's' : '') + ' de C · ' + (2 * n + 2) + ' atomes de H';
      var c = self ? co : coefs(n), r = count(c);
      eqT.textContent = k1(c[0]) + formula(n) + '  +  ' + k1(c[1]) + 'O₂   →   ' + k1(c[2]) + 'CO₂  +  ' + k1(c[3]) + 'H₂O';
      ['C', 'H', 'O'].forEach(function (a, j) {
        var ok = r.L[a] === r.R[a];
        chk[j].textContent = 'Atomes ' + a + ' : ' + r.L[a] + ' → ' + r.R[a] + (ok ? '  ✓' : '  ✗');
        chk[j].style.fill = ok ? 'var(--ok)' : 'var(--bad)';
      });
      roF.set(formula(n)); roM.set((14 * n + 2) + ' g/mol');
      return r.ok;
    }
    var roF = e.readout({ label: 'Formule brute' }), roM = e.readout({ label: 'Masse molaire' });
    var sN = e.slider({ label: 'Nombre d’atomes de carbone n', min: 1, max: 6, step: 1, value: 1, dec: 0, onInput: function (v) { n = v; build(); co = [1, 1, 1, 1]; syncCo(); draw(); } });
    var tS = e.toggle({ label: 'J’équilibre moi-même', value: false, onChange: function (v) { self = v; co = [1, 1, 1, 1]; syncCo(); ['a', 'b', 'c', 'd'].forEach(function (k, j) { cs[j].hide(!v); }); draw(); e.say(v ? 'Règle les 4 coefficients jusqu’à ce que les trois lignes soient vertes.' : 'L’équation équilibrée est affichée.'); } });
    var cs = [['Coefficient de l’alcane', 2], ['Coefficient de O₂', 20], ['Coefficient de CO₂', 12], ['Coefficient de H₂O', 14]].map(function (d, j) {
      var s = e.slider({ label: d[0], min: 1, max: d[1], step: 1, value: 1, dec: 0, onInput: function (v) { co[j] = v; if (draw()) e.say('Bravo, l’équation est équilibrée : ' + eqT.textContent.replace(/\s+/g, ' '), 'ok'); } });
      s.hide(true); return s;
    });
    function syncCo() { cs.forEach(function (s, j) { s.set(co[j]); }); }

    e.loop(function (dt, T) {
      born += dt;
      atoms.forEach(function (a) { var k = Math.max(0, Math.min(1, (born - a.d) / 0.25)); a.el.setAttribute('r', a.R * (k < 1 ? 1 - Math.pow(1 - k, 3) * 1.0 + Math.sin(k * Math.PI) * 0.15 : 1)); });
      mol.setAttribute('transform', 'translate(0 ' + (Math.sin(T * 1.4) * 3) + ')');
      var f = 1 + Math.sin(T * 13) * 0.08, g = 1 + Math.sin(T * 9 + 1) * 0.1;
      fl.setAttribute('d', 'M748 300c-14 -12 -12 -30 0 -' + (46 * f) + 'c12 ' + (16 * f) + ' 14 34 0 ' + (46 * f) + 'z');
      fl2.setAttribute('d', 'M748 300c-7 -7 -6 -16 0 -' + (24 * g) + 'c6 ' + (8 * g) + ' 7 17 0 ' + (24 * g) + 'z');
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n', dec: 0 }, { k: 'nom', label: 'Nom' }, { k: 'f', label: 'Formule' }, { k: 'h', label: 'Atomes H', dec: 0 }, { k: 'm', label: 'M', unit: 'g/mol', dec: 0 }],
      onChange: function (rows) { ch.setPoints(0, rows.map(function (r) { return [r.n, r.h]; })); bilan(rows); }
    });
    e.measure('Relever cet alcane', function () {
      if (tbl.rows().some(function (r) { return r.n === n; })) { e.say('Cet alcane est déjà dans le tableau : change n.', 'warn'); return null; }
      return { n: n, nom: NAMES[n], f: formula(n), h: 2 * n + 2, m: 14 * n + 2 };
    });
    function bilan(rows) {
      if (rows.length < 2) { e.results(rows.length ? 'Relève au moins un autre alcane.' : ''); return; }
      var r = ch.fit(0, false);
      e.results('Les points sont alignés : nombre d’atomes H = <b>' + e.fmt(r.a, 0) + ' × n + ' + e.fmt(r.b, 0) + '</b>.<br>Formule générale des alcanes : <b>CₙH₂ₙ₊₂</b>. Masse molaire : M = 14 n + 2 g/mol.');
    }
    ch = e.chart({ xlabel: 'Nombre d’atomes de carbone n', xunit: '', ylabel: 'Atomes H', yunit: '', xmin: 0, xmax: 7, ymin: 0, ymax: 16, xstep: 1, ystep: 2 });
    e.onReset(function () { n = 1; self = false; co = [1, 1, 1, 1]; sN.set(1); tS.set(false); syncCo(); cs.forEach(function (s) { s.hide(true); }); build(); draw(); });
    build(); draw();
    e.say('Fais glisser le curseur n pour allonger la chaîne de carbone.');
  }
});
