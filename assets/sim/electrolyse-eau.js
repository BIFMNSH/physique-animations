/* 3e · Électrolyse de l'eau : volumes de dihydrogène et de dioxygène, tests d'identification */
Sim.register('electrolyse-eau', {
  objective: 'Décomposer l’eau par le courant électrique, comparer les volumes de gaz formés aux deux électrodes et identifier ces gaz.',
  alt: 'Électrolyseur : une cuve d’eau avec deux électrodes, deux tubes gradués retournés qui se remplissent de gaz, un générateur et un interrupteur',
  chart: true,
  steps: [
    'Choisis le liquide (eau pure ou eau additionnée de soude) et l’intensité du courant, puis ferme l’interrupteur.',
    'Observe les bulles : dans quel tube le gaz se forme-t-il le plus vite ? Repère la borne (+) et la borne (−).',
    'Relève les volumes des deux tubes à plusieurs instants et observe la courbe V = f(t).',
    'Teste chaque gaz : allumette enflammée pour l’un, bûchette incandescente pour l’autre. Inverse les bornes et recommence.'
  ],
  retiens: [
    'L’eau pure conduit très mal le courant : on ajoute un peu de <b>soude</b> pour réaliser l’électrolyse.',
    'À l’électrode reliée à la borne (−), la <b>cathode</b>, il se forme du <b>dihydrogène H₂</b> : il produit une petite détonation (« pop ») au contact d’une flamme.',
    'À l’électrode reliée à la borne (+), l’<b>anode</b>, il se forme du <b>dioxygène O₂</b> : il rallume une bûchette incandescente.',
    'Le volume de dihydrogène est <b>le double</b> de celui de dioxygène. Bilan : <b>2 H₂O → 2 H₂ + O₂</b>. L’eau est un corps composé.'
  ],
  quiz: [
    { q: 'Quel gaz se forme à la cathode (électrode reliée à la borne −) ?', o: ['Le dioxygène', 'Le dihydrogène', 'Le dioxyde de carbone', 'La vapeur d’eau'], a: 1, e: 'Le dihydrogène H₂ se forme à la cathode, le dioxygène O₂ à l’anode.' },
    { q: 'On obtient 12 mL de dihydrogène. Quel volume de dioxygène s’est formé en même temps ?', o: ['24 mL', '12 mL', '6 mL', '3 mL'], a: 2, e: 'V(H₂) = 2 × V(O₂), donc V(O₂) = 12 ÷ 2 = 6 mL.' },
    { q: 'Quel test met en évidence le dioxygène ?', o: ['Il trouble l’eau de chaux', 'Il rallume une bûchette incandescente', 'Il fait « pop » avec une flamme', 'Il colore le sulfate de cuivre en bleu'], a: 1, e: 'Le dioxygène entretient la combustion : la bûchette se rallume.' },
    { q: 'Pourquoi ajoute-t-on un peu de soude dans l’eau ?', o: ['Pour la colorer', 'Pour qu’elle conduise le courant', 'Pour la refroidir', 'Pour obtenir plus de dioxygène que de dihydrogène'], a: 1, e: 'L’eau pure conduit très mal ; la soude apporte des ions qui laissent passer le courant.' },
    { q: 'Quelle équation traduit l’électrolyse de l’eau ?', o: ['H₂O → H₂ + O₂', '2 H₂O → 2 H₂ + O₂', 'H₂ + O₂ → H₂O', '2 H₂ + O₂ → 2 H₂O'], a: 1, e: '2 H₂O → 2 H₂ + O₂ : l’équation est équilibrée (4 H et 2 O de chaque côté).' }
  ],
  build: function (e) {
    var W = e.W, CAP = 20, PXML = 10.5, TOP = 46, TX = [356, 500], TW = 40, WL = 196;
    var I = 0.4, soude = true, closed = false, inv = false, t = 0, vol = [0, 0], tbl, ch, bub = [], test = null, SPEED = 20;
    // tube 0 = gauche, tube 1 = droite ; sans inversion, gauche = cathode (−)
    function sign(i) { return (i === 0) !== inv ? '−' : '+'; }
    function isH2(i) { return sign(i) === '−'; }
    function current() { return closed ? (soude ? I : 0.004) : 0; }

    var defs = e.s('defs'), gw = e.s('linearGradient', { id: 'elW', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    e.s('stop', { offset: 0, 'stop-color': 'var(--s1)', 'stop-opacity': 0.35 }, gw); e.s('stop', { offset: 1, 'stop-color': 'var(--s1)', 'stop-opacity': 0.6 }, gw);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    e.s('rect', { x: 0, y: 336, width: W, height: 40, fill: 'var(--scene2)' });

    /* cuve */
    e.s('path', { d: 'M282 186V334H574V186', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 3 });
    var water = e.s('rect', { x: 284, y: WL, width: 288, height: 136, fill: 'url(#elW)' });
    e.s('line', { x1: 284, x2: 572, y1: WL, y2: WL, stroke: 'var(--s1)', 'stroke-width': 2 });
    var liqT = e.s('text', { x: 280, y: 130, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--scene-muted)' });
    /* électrodes */
    var elec = TX.map(function (x) { return e.s('rect', { x: x - 9, y: 286, width: 18, height: 34, fill: 'var(--scene-muted)' }); });
    /* tubes gradués retournés */
    var men = [], gasR = [], tubeLbl = [], gasLbl = [], volT = [];
    TX.forEach(function (x, i) {
      e.s('path', { d: 'M' + (x - TW / 2) + ' 300V' + (TOP + 14) + 'a' + (TW / 2) + ' ' + (TW / 2) + ' 0 0 1 ' + TW + ' 0V300', fill: 'var(--s1)', 'fill-opacity': 0.4, stroke: 'none' });
      gasR.push(e.s('rect', { x: x - TW / 2 + 2, y: TOP, width: TW - 4, height: 0, fill: 'var(--scene2)', opacity: 0.95 }));
      men.push(e.s('path', { fill: 'none', stroke: 'var(--s1)', 'stroke-width': 2.5 }));
      e.s('path', { d: 'M' + (x - TW / 2) + ' 300V' + (TOP + 14) + 'a' + (TW / 2) + ' ' + (TW / 2) + ' 0 0 1 ' + TW + ' 0V300', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 2.2 });
      for (var v = 0; v <= CAP; v++) {
        var y = TOP + v * PXML, big = v % 5 === 0;
        e.s('line', { x1: x + TW / 2 - (big ? 13 : 7), x2: x + TW / 2, y1: y, y2: y, stroke: 'var(--scene-text)', 'stroke-width': big ? 1.4 : 0.8, opacity: 0.8 });
        if (big) e.s('text', { x: x + TW / 2 + 5, y: y + 4, 'font-size': 10, fill: 'var(--scene-muted)', text: String(v) });
      }
      e.s('text', { x: x + TW / 2 + 5, y: TOP - 8, 'font-size': 10, fill: 'var(--scene-muted)', text: 'mL' });
      tubeLbl.push(e.s('text', { x: x, y: 330, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800 }));
      gasLbl.push(e.s('text', { x: x, y: TOP + 26, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-text)' }));
      volT.push(e.s('text', { x: x, y: 26, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800 }));
    });
    var bubG = e.s('g');

    /* générateur, interrupteur, fils */
    var wires = e.s('path', { fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3, 'stroke-linejoin': 'round' });
    var wiresOn = e.s('path', { fill: 'none', stroke: 'var(--warn)', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-dasharray': '6 10', opacity: 0 });
    e.s('rect', { x: 40, y: 170, width: 132, height: 78, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2.2 });
    e.s('text', { x: 106, y: 200, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-text)', text: 'Générateur' });
    var pL = e.s('text', { x: 66, y: 236, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800 });
    var pR = e.s('text', { x: 146, y: 236, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800 });
    var amm = e.s('text', { x: 106, y: 160, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: 'var(--s3)' });
    var sw = e.s('g', { style: 'cursor:pointer' });
    e.s('circle', { cx: 200, cy: 352, r: 4, fill: 'var(--scene-text)' }, sw); e.s('circle', { cx: 240, cy: 352, r: 4, fill: 'var(--scene-text)' }, sw);
    var lever = e.s('line', { x1: 200, y1: 352, stroke: 'var(--scene-text)', 'stroke-width': 4, 'stroke-linecap': 'round' }, sw);
    e.s('rect', { x: 186, y: 322, width: 68, height: 44, fill: 'transparent' }, sw);
    e.s('text', { x: 220, y: 318, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'K' });
    sw.addEventListener('click', function () { setClosed(!closed); });

    /* bandeau d'équation */
    var eqT = e.s('text', { x: 780, y: 60, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 800, fill: 'var(--scene-text)' });
    var clock = e.s('text', { x: 780, y: 34, 'text-anchor': 'end', 'font-size': 18, 'font-weight': 800, fill: 'var(--scene-text)' });
    /* test de gaz */
    var testG = e.s('g', { opacity: 0 });
    var stick = e.s('line', { stroke: '#C68B4E', 'stroke-width': 5, 'stroke-linecap': 'round' }, testG);
    var flame = e.s('path', { fill: 'var(--warn)' }, testG);
    var burst = e.s('path', { fill: '#FFE08A', stroke: 'var(--warn)', 'stroke-width': 2, opacity: 0 }, testG);
    var testT = e.s('text', { 'font-size': 14, 'font-weight': 800, 'text-anchor': 'middle' }, testG);

    var roI = e.readout({ label: 'Intensité I' }), roT = e.readout({ label: 'Durée t' });

    function fmtT(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ' min ' + (r < 10 ? '0' : '') + r + ' s'; }
    function draw() {
      var on = current() > 0.01;
      pL.textContent = inv ? '−' : '+'; pR.textContent = inv ? '+' : '−';
      pL.style.fill = inv ? 'var(--s1)' : 'var(--bad)'; pR.style.fill = inv ? 'var(--bad)' : 'var(--s1)';
      var d = 'M66 248V366H' + TX[1] + 'V320M146 248V352H200M240 352H' + TX[0] + 'V320';
      wires.setAttribute('d', d); wiresOn.setAttribute('d', d); wiresOn.style.opacity = on ? 0.9 : 0;
      lever.setAttribute('x2', closed ? 240 : 234); lever.setAttribute('y2', closed ? 352 : 330);
      amm.textContent = 'I = ' + e.fmt(current(), 2) + ' A';
      TX.forEach(function (x, i) {
        var h = vol[i] * PXML; gasR[i].setAttribute('y', TOP - 12); gasR[i].setAttribute('height', Math.max(0, h + 12));
        gasR[i].style.opacity = h > 0.5 ? 0.95 : 0;
        var my = TOP + h; men[i].setAttribute('d', h > 0.5 ? 'M' + (x - TW / 2 + 2) + ' ' + (my - 3) + 'Q' + x + ' ' + (my + 4) + ' ' + (x + TW / 2 - 2) + ' ' + (my - 3) : '');
        tubeLbl[i].textContent = sign(i) === '−' ? '(−) cathode' : '(+) anode';
        tubeLbl[i].style.fill = sign(i) === '−' ? 'var(--s1)' : 'var(--bad)';
        tubeLbl[i].setAttribute('font-size', 13);
        gasLbl[i].textContent = vol[i] > 2 ? (test && test.done && test.i === i ? (isH2(i) ? 'H₂' : 'O₂') : 'gaz ?') : '';
        volT[i].textContent = 'V = ' + e.fmt(vol[i], 1) + ' mL'; volT[i].style.fill = sign(i) === '−' ? 'var(--s1)' : 'var(--bad)';
        elec[i].style.fill = on ? 'var(--scene-text)' : 'var(--scene-muted)';
      });
      liqT.textContent = soude ? 'eau + quelques gouttes de soude' : 'eau pure (distillée)';
      water.style.opacity = soude ? 1 : 0.7;
      clock.textContent = fmtT(t);
      eqT.textContent = '2 H₂O  →  2 H₂  +  O₂';
      roI.set(e.fmt(current(), 2) + ' A'); roT.set(e.fmt(t / 60, 1) + ' min');
    }
    function setClosed(v) {
      closed = v; draw();
      if (v && !soude) e.say('L’interrupteur est fermé, mais il ne se passe presque rien : l’eau pure conduit très mal le courant.', 'warn');
      else if (v) e.say('Le courant passe : des bulles apparaissent sur les deux électrodes.');
      else e.say('Circuit ouvert : l’électrolyse s’arrête.');
      bK.label(closed ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur');
    }

    var cL = e.choice({ label: 'Liquide dans la cuve', value: 1, options: [{ v: 1, l: 'Eau + soude' }, { v: 0, l: 'Eau pure' }], onChange: function (v) { soude = !!v; draw(); } });
    var cI = e.choice({ label: 'Intensité du courant', value: 0.4, options: [{ v: 0.2, l: '0,2 A' }, { v: 0.4, l: '0,4 A' }, { v: 0.6, l: '0,6 A' }], onChange: function (v) { I = v; draw(); } });
    var tInv = e.toggle({ label: 'Inverser les bornes du générateur', value: false, onChange: function (v) { inv = v; vol = [0, 0]; t = 0; test = null; tbl && tbl.clear(); draw(); e.say('Bornes inversées : les tubes sont vidés. Où se forme maintenant le plus de gaz ?'); } });
    var bK = e.button({ label: 'Fermer l’interrupteur', primary: true, onClick: function () { setClosed(!closed); } });
    var row = e.buttonRow();
    e.button({ label: 'Tester le gaz de gauche', into: row, onClick: function () { startTest(0); } });
    e.button({ label: 'Tester le gaz de droite', into: row, onClick: function () { startTest(1); } });

    function startTest(i) {
      if (vol[i] < 2) { e.say('Pas assez de gaz dans ce tube : attends qu’il y en ait au moins 2 mL.', 'warn'); return; }
      test = { i: i, k: 0, done: false, h2: isH2(i) };
    }
    function drawTest() {
      if (!test) { testG.style.opacity = 0; return; }
      var side = test.i ? 1 : -1, x = TX[test.i] + side * (TW / 2 + 4), k = Math.min(1, test.k / 0.7), y0 = TOP + 34;
      testG.style.opacity = 1;
      var sx = x + side * (80 - 70 * k), sy = y0;
      stick.setAttribute('x1', sx + side * 70); stick.setAttribute('y1', sy + 14); stick.setAttribute('x2', sx); stick.setAttribute('y2', sy);
      if (test.h2) {
        flame.setAttribute('d', 'M' + sx + ' ' + (sy - 4) + 'c-6 -6 -4 -14 0 -20c4 6 6 14 0 20z'); flame.style.opacity = test.k < 0.8 ? 1 : 0;
        var b = test.k > 0.7 && test.k < 1.6, R = 18 + 20 * Math.min(1, (test.k - 0.7) * 3);
        var p = ''; for (var j = 0; j < 16; j++) { var a = j * Math.PI / 8, rr = j % 2 ? R * 0.5 : R; p += (j ? 'L' : 'M') + (x + side * 6 + rr * Math.cos(a)) + ' ' + (y0 + rr * Math.sin(a)); }
        burst.setAttribute('d', p + 'Z'); burst.style.opacity = b ? 1 : 0;
        testT.textContent = test.k > 0.7 ? '« POP ! » petite détonation' : 'allumette enflammée…';
      } else {
        var glow = test.k > 0.7;
        flame.setAttribute('d', glow ? 'M' + sx + ' ' + (sy - 4) + 'c-9 -9 -6 -22 0 -30c6 8 9 21 0 30z' : 'M' + (sx - 3) + ' ' + (sy - 3) + 'h6v6h-6z');
        flame.style.opacity = 1; flame.style.fill = glow ? 'var(--warn)' : 'var(--bad)';
        burst.style.opacity = 0;
        testT.textContent = glow ? 'la bûchette se rallume !' : 'bûchette incandescente…';
      }
      testT.setAttribute('x', x + side * 30); testT.setAttribute('y', y0 - 30); testT.setAttribute('text-anchor', test.i ? 'start' : 'end'); testT.style.fill = 'var(--warn)';
      volT[test.i].style.opacity = 0;
    }

    e.loop(function (dt) {
      var cur = current();
      if (cur > 0) {
        var ds = dt * SPEED; t += ds;
        var rate = cur * 60 / 193000 * 24000 / 60;         // mL de H2 par seconde (loi de Faraday)
        TX.forEach(function (x, i) { vol[i] = Math.min(CAP, vol[i] + rate * ds * (isH2(i) ? 1 : 0.5)); });
        if (vol[0] >= CAP || vol[1] >= CAP) { setClosed(false); e.say('Un tube est plein : l’électrolyse est arrêtée. Relève les volumes.', 'warn'); }
        // bulles
        TX.forEach(function (x, i) { if (Math.random() < dt * (cur > 0.05 ? (isH2(i) ? 60 : 30) * cur / 0.4 : 2)) bub.push({ x: x - 8 + Math.random() * 16, y: 290, r: 1.5 + Math.random() * 2.2, el: e.s('circle', { fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 1.2 }, bubG), i: i }); });
      }
      bub = bub.filter(function (b) {
        b.y -= dt * (90 + b.r * 20); b.x += Math.sin(b.y / 9) * 0.3;
        var top = TOP + vol[b.i] * PXML;
        if (b.y < top) { b.el.remove(); return false; }
        b.el.setAttribute('cx', b.x); b.el.setAttribute('cy', b.y); b.el.setAttribute('r', b.r); return true;
      });
      if (test) {
        test.k += dt;
        if (test.k > 1 && !test.done) { test.done = true; e.say(test.h2 ? 'Petite détonation : ce gaz est du dihydrogène H₂ (tube relié à la borne −).' : 'La bûchette incandescente se rallume : ce gaz est du dioxygène O₂ (tube relié à la borne +).', 'ok'); }
        if (test.k > 3.2) { volT[test.i].style.opacity = 1; var keep = test; test = null; testG.style.opacity = 0; draw(); test = null; gasLbl[keep.i].textContent = vol[keep.i] > 2 ? (keep.h2 ? 'H₂' : 'O₂') : ''; return; }
      }
      draw(); drawTest();
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 't', label: 't', unit: 'min', dec: 1 }, { k: 'v1', label: 'V tube (−)', unit: 'mL', dec: 1 }, { k: 'v2', label: 'V tube (+)', unit: 'mL', dec: 1 }, { k: 'r', label: 'V(−) ÷ V(+)', dec: 2 }],
      onChange: function (rows) {
        ch.setPoints(0, rows.map(function (r) { return [r.t, r.v1]; }));
        ch.setPoints(1, rows.map(function (r) { return [r.t, r.v2]; }));
        bilan(rows);
      }
    });
    e.measure('Relever les volumes', function () {
      if (t < 1) { e.say('Ferme d’abord l’interrupteur et attends que du gaz se forme.', 'warn'); return null; }
      var iC = sign(0) === '−' ? 0 : 1, iA = 1 - iC;
      var v1 = Math.round(e.noise(vol[iC], 0.02) * 10) / 10, v2 = Math.round(e.noise(vol[iA], 0.03) * 10) / 10;
      return { n: tbl.rows().length + 1, t: t / 60, v1: v1, v2: v2, r: v2 > 0 ? v1 / v2 : null };
    });
    function bilan(rows) {
      if (rows.length < 2) { e.results(rows.length ? 'Fais au moins un autre relevé, un peu plus tard.' : ''); return; }
      var a = ch.fit(0, true), b = ch.fit(1, true);
      e.results('Les volumes augmentent proportionnellement à la durée.<br>Tube (−) : <b>' + e.fmt(a.a, 2) + ' mL/min</b> · tube (+) : <b>' + e.fmt(b.a, 2) + ' mL/min</b>.<br>Rapport : ' + e.fmt(a.a / b.a, 2) + ' ≈ 2 → <b>V(H₂) = 2 × V(O₂)</b>, comme le prévoit 2 H₂O → 2 H₂ + O₂.');
    }
    ch = e.chart({ xlabel: 'Durée t', xunit: 'min', ylabel: 'Volume de gaz V', yunit: 'mL', xmin: 0, xmax: 12, ymin: 0, ymax: 20, xstep: 1, ystep: 5 });
    e.onReset(function () { closed = false; inv = false; soude = true; I = 0.4; t = 0; vol = [0, 0]; test = null; bub.forEach(function (b) { b.el.remove(); }); bub = []; cL.set(1); cI.set(0.4); tInv.set(false); bK.label('Fermer l’interrupteur'); draw(); drawTest(); });
    draw();
    e.say('Ferme l’interrupteur K (ou clique dessus dans le schéma) pour lancer l’électrolyse.');
  }
});
