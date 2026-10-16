/* Électrolyse de l'eau : voltamètre de Hofmann */
Lab.register({
  id: 'electrolyse', theme: 'chimie', title: 'Électrolyse de l’eau',
  lesson: 'Électrolyse et synthèse de l’eau', skills: ['C1', 'C2', 'C3', 'C4'],
  objective: 'Identifie les gaz formés, compare leurs volumes et écris l’équation bilan.',
  alt: 'Voltamètre de Hofmann : deux tubes gradués remplis d’eau au-dessus de deux électrodes reliées à un générateur',
  thumb: '<rect x="38" y="12" width="22" height="52" rx="4" fill="var(--glass)" stroke="var(--scene-line)"/><rect x="100" y="12" width="22" height="52" rx="4" fill="var(--glass)" stroke="var(--scene-line)"/><rect x="38" y="30" width="22" height="34" fill="var(--s1)" opacity=".5"/><rect x="100" y="46" width="22" height="18" fill="var(--s1)" opacity=".5"/><path d="M49 66v8M111 66v8" stroke="var(--scene-text)" stroke-width="3"/>',
  height: 440,
  hint: 'Mets le générateur en marche, observe les volumes, puis teste chaque gaz.',
  steps: [
    'Mets le générateur en marche et choisis l’intensité.',
    'Relève les volumes de gaz à plusieurs instants.',
    'Teste chaque gaz : flamme (pop) ou allumette incandescente.',
    'Inverse les bornes : quel gaz apparaît encore au pôle moins (−) ?'
  ],
  retiens: [
    'L’<b>électrolyse</b> de l’eau décompose l’eau grâce au courant électrique : on obtient du <b>dihydrogène</b> et du <b>dioxygène</b>.',
    'Le dihydrogène (H₂) se forme à la cathode (borne −) et brûle avec une petite détonation ; le dioxygène (O₂) se forme à l’anode (borne +) et ravive une allumette incandescente.',
    '<b>V(H₂) = 2 × V(O₂)</b>.',
    'Équation bilan : <b>2 H₂O → 2 H₂ + O₂</b>. La synthèse de l’eau est la réaction inverse : 2 H₂ + O₂ → 2 H₂O.'
  ],
  quiz: [
    { q: 'Quel gaz se forme à la borne négative (−) ?', o: ['Dioxygène', 'Dihydrogène', 'Dioxyde de carbone', 'Diazote'], a: 1, e: 'H₂ se forme à la cathode, reliée à la borne −.' },
    { q: 'Comment identifie-t-on le dihydrogène ?', o: ['Il trouble l’eau de chaux', 'Il ravive une allumette incandescente', 'Il explose avec une petite détonation à l’approche d’une flamme', 'Il éteint toujours la flamme sans bruit'], a: 2, e: 'Test caractéristique : « pop » à la flamme.' },
    { q: 'On recueille 18 mL de dihydrogène. Quel volume de dioxygène a-t-on recueilli ?', o: ['36 mL', '18 mL', '9 mL', '6 mL'], a: 2, e: 'V(O₂) = V(H₂) / 2 = 9 mL.' },
    { q: 'Quelle équation est correctement équilibrée ?', o: ['H₂O → H₂ + O₂', '2 H₂O → 2 H₂ + O₂', '2 H₂O → H₂ + 2 O₂', 'H₂O → 2 H₂ + O₂'], a: 1, e: 'À gauche : 4 H et 2 O ; à droite : 4 H et 2 O.' },
    { q: 'L’électrolyse de l’eau est :', o: ['une transformation physique', 'une décomposition chimique', 'un changement d’état', 'une dissolution'], a: 1, e: 'L’eau disparaît et de nouveaux corps (H₂, O₂) se forment.' }
  ],
  build: function (c) {
    var on = false, inv = false, t = 0, vL = 0, vR = 0, ident = { L: null, R: null }, RATE = 0.5;
    var I = c.slider('Intensité du courant', { min: 1, max: 4, step: 1, value: 2, unit: '' });
    c.toggle('Générateur en marche', function (v) { on = v; }, false);
    c.toggle('Inverser les bornes', function (v) { inv = v; reset(); }, false);
    var test = c.choice('Test', [{ v: 'f', label: 'Flamme' }, { v: 'a', label: 'Allumette incandescente' }], null, 'f');
    function polL() { return inv ? '+' : '−'; }
    function gazL() { return polL() === '−' ? 'H2' : 'O2'; }
    function gazR() { return polL() === '−' ? 'O2' : 'H2'; }
    function reset() { t = 0; vL = vR = 0; ident = { L: null, R: null }; }
    c.onReset(function () { on = false; inv = false; reset(); });

    c.s('rect', { x: 20, y: 20, width: 760, height: 400, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('rect', { x: 200, y: 330, width: 400, height: 50, rx: 8, fill: 'var(--water)', 'fill-opacity': .55, stroke: 'var(--scene-line)' });
    var TH = 230, TY = 80, SC = TH / 28;   // 28 mL de capacité visible
    var tubes = [];
    [{ k: 'L', x: 250 }, { k: 'R', x: 500 }].forEach(function (d) {
      c.s('rect', { x: d.x, y: TY, width: 50, height: TH, fill: 'var(--water)', 'fill-opacity': .5, stroke: 'var(--scene-line)', 'stroke-width': 2 });
      var gas = c.s('rect', { x: d.x + 1, y: TY, width: 48, height: 0, fill: '#fff', 'fill-opacity': .55 });
      for (var m = 0; m <= 28; m += 4) { c.s('line', { x1: d.x + 50, x2: d.x + 40, y1: TY + m * SC, y2: TY + m * SC, stroke: 'var(--scene-text)' }); c.s('text', { x: d.x + 58, y: TY + m * SC + 4, 'font-size': 12, text: String(28 - m) }); }
      c.s('line', { x1: d.x + 25, x2: d.x + 25, y1: TY + TH, y2: 360, stroke: 'var(--scene-text)', 'stroke-width': 4 });
      var pol = c.s('text', { x: d.x + 25, y: 408, 'font-size': 20, 'font-weight': 700, 'text-anchor': 'middle' });
      var name = c.s('text', { x: d.x + 25, y: 66, 'font-size': 15, 'font-weight': 700, 'text-anchor': 'middle' });
      var bub = []; for (var b = 0; b < 8; b++) bub.push(c.s('circle', { r: 3, fill: '#fff', 'fill-opacity': .8, cx: d.x + 25, cy: 400 }));
      tubes.push({ k: d.k, x: d.x, gas: gas, pol: pol, name: name, bub: bub, ph: Math.random() * 8 });
    });
    c.s('text', { x: 400, y: 370, 'font-size': 13, 'text-anchor': 'middle', text: 'eau + un peu d’acide sulfurique' }).style.fill = 'var(--scene-text)';
    c.s('text', { x: 40, y: 46, 'font-size': 16, 'font-weight': 700, text: 'Voltamètre de Hofmann' });
    var eq = c.s('text', { x: 400, y: 432, 'font-size': 16, 'font-weight': 700, 'text-anchor': 'middle' }); eq.style.fill = 'var(--ok)';
    var bat = c.s('text', { x: 650, y: 120, 'font-size': 14 }); bat.style.fill = 'var(--scene-text)';
    function vol(k) { return k === 'L' ? vL : vR; }
    c.loop(function (dt) {
      if (on) {
        t += dt; var r = RATE * I.get() * dt;
        if (Math.max(vL, vR) < 26) { if (gazL() === 'H2') { vL += r; vR += r / 2; } else { vL += r / 2; vR += r; } }
        else { on = false; c.say('Un tube est plein : le générateur s’arrête.', 'warn'); }
      }
      tubes.forEach(function (tb) {
        var v = vol(tb.k); tb.gas.setAttribute('height', Math.min(28, v) * SC);
        tb.pol.textContent = (tb.k === 'L' ? polL() : (polL() === '−' ? '+' : '−')) === '−' ? 'borne −' : 'borne +';
        tb.bub.forEach(function (b, i) {
          if (!on) { b.setAttribute('cy', -50); return; }
          var rate = (tb.k === 'L' ? gazL() : gazR()) === 'H2' ? 1 : 0.5; var ph = ((t * (0.6 + 0.15 * I.get()) * rate + i / 8 + tb.ph) % 1);
          b.setAttribute('cy', 355 - ph * (355 - TY - TH + v * SC)); b.setAttribute('cx', tb.x + 25 + Math.sin(ph * 12 + i) * 8);
        });
        var idn = ident[tb.k]; tb.name.textContent = idn ? (idn === 'H2' ? 'H₂ dihydrogène' : 'O₂ dioxygène') : 'gaz ?';
      });
      bat.textContent = on ? 'Générateur : ON' : 'Générateur : arrêt';
      eq.textContent = (ident.L && ident.R) ? 'Bilan : 2 H₂O → 2 H₂ + O₂' : '';
      c.update();
    });
    function testTube(k) {
      var v = vol(k); if (v < 2) { c.say('Pas assez de gaz dans ce tube (au moins 2 mL).', 'warn'); return; }
      var g = k === 'L' ? gazL() : gazR(), mode = test.get();
      if (g === 'H2' && mode === 'f') { c.say('Petite détonation (« pop ») : c’est du dihydrogène H₂.', 'ok'); ident[k] = 'H2'; }
      else if (g === 'O2' && mode === 'a') { c.say('L’allumette incandescente se rallume vivement : c’est du dioxygène O₂.', 'ok'); ident[k] = 'O2'; }
      else if (g === 'H2') c.say('L’allumette incandescente s’éteint, sans rien de plus. Essaie la flamme.', 'warn');
      else c.say('La flamme ne produit pas de détonation. Essaie l’allumette incandescente.', 'warn');
    }
    c.button('Tester le tube de gauche', function () { testTube('L'); }, { into: 'ctrl' });
    c.button('Tester le tube de droite', function () { testTube('R'); }, { into: 'ctrl' });
    c.readout('Durée', function () { return t; }, 's', 0);
    c.readout('Volume tube gauche', function () { return vL; }, 'mL', 1);
    c.readout('Volume tube droit', function () { return vR; }, 'mL', 1);

    var ch = c.chart({ x: { label: 'V(O₂)', unit: 'mL', min: 0, max: 14 }, y: { label: 'V(H₂)', unit: 'mL', min: 0, max: 28 }, fit: 'origin' });
    c.table({ cols: [{ key: 't', label: 't', unit: 's', d: 0 }, { key: 'h', label: 'V(H₂)', unit: 'mL', d: 1 }, { key: 'o', label: 'V(O₂)', unit: 'mL', d: 1 }, { key: 'r', label: 'V(H₂) / V(O₂)', d: 2 }], max: 10, onChange: bilan });
    c.measure('Relever les volumes', function () {
      var h = gazL() === 'H2' ? vL : vR, o = gazL() === 'H2' ? vR : vL; if (o < 1) { c.say('Laisse l’électrolyse avancer avant de relever.', 'warn'); return null; }
      return { t: t, h: c.noise(h, 0.01), o: c.noise(o, 0.01), r: h / o };
    });
    function bilan(rows) {
      ch.setPoints(rows.map(function (r) { return [r.o, r.h]; }));
      if (rows.length >= 3) { var f = ch.fit(); c.results('<b>Conclusion :</b> le graphique est une droite de pente ≈ ' + c.fmt(f.a, 1) + ' : <b>V(H₂) = 2 × V(O₂)</b>. Avec 2 H₂O → 2 H₂ + O₂ : 2 molécules d’H₂ pour 1 d’O₂.'); }
      else c.results(rows.length ? 'Relève au moins 3 mesures.' : '');
    }
  }
});
