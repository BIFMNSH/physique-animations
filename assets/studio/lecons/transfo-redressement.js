/* 4e · Courants et tensions alternatifs · Leçon : Transformation, redressement et lissage */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit;
  var U1MAX = 311, N1 = 1100, F = 50, RL = 100, DX = 72, DY = 30;

  /* ---------- calcul des tensions ---------- */
  function signals(st) {
    var u2m = U1MAX * st.N2 / N1, Cf = st.C * 1e-6, drop = st.rect === 'none' ? 0 : st.rect === 'diode' ? 0.7 : 1.4;
    function u2(t) { return st.dc ? 0 : u2m * Math.sin(2 * Math.PI * F * t); }
    function rr(t) { var u = u2(t); if (st.rect === 'none') return u; if (st.rect === 'diode') return Math.max(0, u - drop); return Math.max(0, Math.abs(u) - drop); }
    // lissage : décharge RC entre deux crêtes (régime établi après 3 périodes)
    var win = 0.05, N = 600, dt = (win + 0.06) / N, v = 0, out = [], t0 = -0.06;
    for (var i = 0; i <= N; i++) {
      var t = t0 + i * dt, r = rr(t);
      if (st.rect !== 'none' && Cf > 0) { v = Math.max(r, v * Math.exp(-dt / (RL * Cf))); } else v = r;
      if (t >= 0) out.push([t, v]);
    }
    var mn = Infinity, mx = -Infinity, sum = 0; out.forEach(function (p) { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); sum += p[1]; });
    return { u2m: u2m, u2: u2, out: out, ripple: mx - mn, mean: sum / out.length, max: mx, min: mn, win: win };
  }

  /* ---------- dessin : chaîne de blocs + oscilloscope 2 voies ---------- */
  function Lab(G, o) {
    var st = Object.assign({ N2: 44, rect: 'none', C: 0, sens: 5, dc: false, ph: 0, showN: true }, o || {});
    var g = s('g', {}, G), B = {};
    function box(x, w, title) { var b = s('g', {}, g); s('rect', { x: x, y: 34, width: w, height: 120, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, b); s('text', { x: x + w / 2, y: 54, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: 'var(--scene-muted)', 'letter-spacing': '0.06em', text: title }, b); return b; }
    B.src = box(14, 120, 'SECTEUR'); B.tr = box(160, 160, 'TRANSFORMATEUR'); B.rd = box(346, 140, 'REDRESSEMENT'); B.ls = box(512, 130, 'LISSAGE'); B.ap = box(668, 176, 'APPAREIL');
    // secteur : prise
    var pr = s('g', { transform: 'translate(74 104)' }, B.src);
    s('circle', { r: 30, fill: '#E6E1D6', stroke: '#B8B2A4', 'stroke-width': 2 }, pr); s('circle', { cx: -11, r: 5, fill: '#1A1A1A' }, pr); s('circle', { cx: 11, r: 5, fill: '#1A1A1A' }, pr);
    B.srcT = s('text', { x: 74, y: 148, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-text)' }, B.src);
    // transformateur
    s('rect', { x: 184, y: 70, width: 112, height: 70, rx: 6, fill: 'none', stroke: '#8E97A6', 'stroke-width': 12 }, B.tr);
    B.flux = s('rect', { x: 184, y: 70, width: 112, height: 70, rx: 6, fill: 'none', stroke: '#C4B5FD', 'stroke-width': 3, 'stroke-dasharray': '6 10' }, B.tr);
    for (var i = 0; i < 6; i++) s('rect', { x: 174, y: 78 + i * 9, width: 20, height: 5, rx: 2.5, fill: 'var(--copper)' }, B.tr);
    B.sec = s('g', {}, B.tr);
    B.n1 = s('text', { x: 184, y: 152, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--scene-muted)' }, B.tr);
    B.n2 = s('text', { x: 296, y: 152, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--copper)' }, B.tr);
    // redressement
    B.rdNone = s('text', { x: 416, y: 108, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--scene-muted)', text: 'aucun' }, B.rd);
    function diode(parent, x, y, rot) { var d = s('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + rot + ')' }, parent); var tri = s('path', { d: 'M-9 -9 L9 0 L-9 9Z', fill: 'var(--scene-text)' }, d); s('line', { x1: 9, y1: -10, x2: 9, y2: 10, stroke: 'var(--scene-text)', 'stroke-width': 3 }, d); return tri; }
    B.d1 = s('g', {}, B.rd); s('line', { x1: 366, y1: 104, x2: 466, y2: 104, stroke: 'var(--scene-muted)', 'stroke-width': 2.5 }, B.d1); B.d1t = diode(B.d1, 416, 104, 0);
    B.pont = s('g', {}, B.rd); s('path', { d: 'M416 68 L452 104 L416 140 L380 104Z', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 2.5 }, B.pont);
    B.pd = [diode(B.pont, 398, 86, 45), diode(B.pont, 434, 86, -45 + 90), diode(B.pont, 398, 122, -45), diode(B.pont, 434, 122, 45 + 90)];
    // lissage
    B.lsNone = s('text', { x: 577, y: 108, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--scene-muted)', text: 'aucun' }, B.ls);
    B.cap = s('g', {}, B.ls); s('path', { d: 'M577 70V96M557 96H597M557 108H597M577 108V136', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 4 }, B.cap);
    B.capT = s('text', { x: 577, y: 148, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-text)' }, B.ls);
    B.capQ = s('rect', { x: 600, y: 96, width: 8, height: 12, fill: 'var(--blue)' }, B.cap);
    // appareil : téléphone en charge
    var ph = s('g', { transform: 'translate(682 64)' }, B.ap);
    s('rect', { x: 0, y: 0, width: 48, height: 80, rx: 8, fill: '#141C2E', stroke: 'var(--scene-text)', 'stroke-width': 2 }, ph);
    s('rect', { x: 14, y: 26, width: 20, height: 34, rx: 3, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ph);
    B.bat = s('rect', { x: 17, y: 57, width: 14, height: 0, fill: 'var(--green)' }, ph);
    B.apT = s('text', { x: 798, y: 100, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: 'var(--scene-text)' }, B.ap);
    B.apT2 = s('text', { x: 798, y: 120, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--scene-muted)' }, B.ap);
    s('path', { d: 'M134 94H160M320 94H346M486 94H512M642 94H668', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, g);
    s('text', { x: 336, y: 26, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#FFB547', text: 'A' }, g); s('text', { x: 656, y: 26, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--trace)', text: 'B' }, g);
    s('circle', { cx: 333, cy: 94, r: 5, fill: '#FFB547' }, g); s('circle', { cx: 655, cy: 94, r: 5, fill: 'var(--trace)' }, g);
    // oscilloscope
    var SX = 70, SY = 196, Y0 = SY + 4 * DY;
    s('rect', { x: SX - 18, y: SY - 14, width: 10 * DX + 36, height: 8 * DY + 46, rx: 16, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, g);
    s('rect', { x: SX, y: SY, width: 10 * DX, height: 8 * DY, rx: 6, fill: 'var(--scope)' }, g);
    var d = ''; for (i = 1; i < 10; i++) d += 'M' + (SX + i * DX) + ' ' + SY + 'v' + 8 * DY; for (i = 1; i < 8; i++) d += 'M' + SX + ' ' + (SY + i * DY) + 'h' + 10 * DX;
    s('path', { d: d, stroke: 'var(--scope-grid)', 'stroke-width': 1 }, g); s('path', { d: 'M' + SX + ' ' + Y0 + 'h' + 10 * DX, stroke: 'var(--scope-axis)', 'stroke-width': 1.5 }, g);
    var cp = s('clipPath', { id: 'trc' + (o && o.id || '') }, s('defs', {}, g)); s('rect', { x: SX, y: SY, width: 10 * DX, height: 8 * DY }, cp);
    var tg = s('g', { 'clip-path': 'url(#trc' + (o && o.id || '') + ')' }, g);
    B.ta = s('path', { fill: 'none', stroke: '#FFB547', 'stroke-width': 2.2, 'stroke-dasharray': '5 4', opacity: 0.85 }, tg);
    B.tb = s('path', { fill: 'none', stroke: 'var(--trace)', 'stroke-width': 3.4, 'stroke-linejoin': 'round' }, tg);
    B.spot = s('circle', { r: 6, fill: '#B9FFD6' }, tg);
    B.scT = s('text', { x: SX + 5 * DX, y: SY + 8 * DY + 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)' }, g);
    B.warn = s('text', { x: SX + 5 * DX, y: SY + 24, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: 'var(--amber)' }, g);
    s('text', { x: SX + 6, y: SY + 16, 'font-size': 11, 'font-weight': 800, fill: '#FFB547', text: '- - voie A : sortie du transformateur' }, g);
    s('text', { x: SX + 6, y: SY + 30, 'font-size': 11, 'font-weight': 800, fill: '#7CFFB0', text: '— voie B : vers l’appareil' }, g);
    var cache = null, ckey = '';
    function step(dt, T) {
      var key = [st.N2, st.rect, st.C, st.dc].join('|'); if (key !== ckey) { ckey = key; cache = signals(st); }
      var sg = cache, sens = st.sens;
      st.ph = (st.ph + dt / 2.4) % 1;
      B.srcT.textContent = st.dc ? 'pile 12 V' : '220 V · 50 Hz';
      B.n1.textContent = 'N₁ = ' + N1; B.n2.textContent = st.showN ? 'N₂ = ' + st.N2 : 'N₂ = ?';
      B.sec.innerHTML = ''; var nt = clamp(Math.round(st.N2 / 60) + 2, 2, 14); for (var i = 0; i < nt; i++) s('rect', { x: 286, y: 76 + i * (58 / nt), width: 20, height: Math.max(2.5, 58 / nt - 3), rx: 2, fill: 'var(--copper)' }, B.sec);
      var u = sg.u2(st.ph * sg.win);
      B.flux.setAttribute('stroke-dashoffset', st.dc ? 0 : (u >= 0 ? -1 : 1) * T * 60); B.flux.setAttribute('opacity', st.dc ? 0 : 0.9);
      B.rdNone.style.display = st.rect === 'none' ? '' : 'none'; B.d1.style.display = st.rect === 'diode' ? '' : 'none'; B.pont.style.display = st.rect === 'pont' ? '' : 'none';
      B.d1t.style.fill = u > 0.7 ? '#FFB547' : 'var(--scene-text)';
      B.pd.forEach(function (p, k) { var on = (k === 0 || k === 3) ? u > 1.4 : u < -1.4; p.style.fill = on ? '#FFB547' : 'var(--scene-text)'; });
      B.lsNone.style.display = st.C ? 'none' : ''; B.cap.style.display = st.C ? '' : 'none'; B.capT.textContent = st.C ? st.C + ' µF' : '';
      var vb = sg.out[Math.min(sg.out.length - 1, Math.floor(st.ph * sg.out.length))][1];
      B.capQ.setAttribute('height', clamp(vb / Math.max(1, sg.max) * 12, 0, 12)); B.capQ.setAttribute('y', 108 - clamp(vb / Math.max(1, sg.max) * 12, 0, 12));
      var dcOk = st.rect !== 'none' && sg.ripple < 0.15 * Math.max(sg.max, 0.1) && sg.mean > 0.5;
      B.apT.textContent = st.dc ? '0 V' : (st.rect === 'none' ? 'U alternative' : dcOk ? '≈ ' + fmt(sg.mean, 1) + ' V ⎓' : 'U ondulée');
      B.apT2.textContent = st.dc ? 'le transformateur ne marche pas' : dcOk ? 'presque continue' : st.rect === 'none' ? 'change de signe' : 'ondulation ' + fmt(sg.ripple, 1) + ' V';
      B.bat.setAttribute('height', dcOk ? 4 + ((T * 6) % 28) : 0); B.bat.setAttribute('y', dcOk ? 57 - (4 + ((T * 6) % 28)) : 57);
      var a = '', b = '', xs = SX + st.ph * 10 * DX;
      for (var px = 0; px <= 10 * DX; px += 3) { var tt = px / (10 * DX) * sg.win, ya = Y0 - sg.u2(tt) / sens * DY; a += (px ? 'L' : 'M') + (SX + px) + ' ' + ya.toFixed(1); if (SX + px <= xs) { var vv = sg.out[Math.min(sg.out.length - 1, Math.floor(px / (10 * DX) * sg.out.length))][1]; b += (b ? 'L' : 'M') + (SX + px) + ' ' + (Y0 - vv / sens * DY).toFixed(1); } }
      B.ta.setAttribute('d', a); B.tb.setAttribute('d', b); attr(B.spot, { cx: xs, cy: Y0 - vb / sens * DY });
      B.tb.setAttribute('stroke-width', S.settings.proj ? 5 : 3.4);
      B.scT.textContent = 'Sensibilité ' + sens + ' V/div (voies A et B) · balayage 5 ms/div';
      B.warn.textContent = sg.u2m / sens > 4.05 ? 'Les courbes sortent de l’écran : augmente les V/div' : '';
    }
    return { st: st, step: step, sig: function () { return cache || signals(st); } };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Le transformateur' }, { t: 16, title: 'Redresser' }, { t: 32, title: 'Lisser' }, { t: 46, title: 'Le chargeur' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(20 40)' }, G), lab = Lab(g, { id: 'rs', N2: 44, sens: 5 }), st = lab.st;
    var hl = s('rect', { y: 30, height: 128, rx: 16, fill: 'none', stroke: '#FFB547', 'stroke-width': 4 }, g);
    var g4 = s('g', {}, G), cards = K.cards(g4, [
      ['Le <b>transformateur</b> : U₂ ÷ U₁ = N₂ ÷ N₁', 'il abaisse (ou élève) une tension alternative ; il ne marche pas en continu.', 'var(--violet)'],
      ['Une <b>diode</b> ne laisse passer le courant que dans un sens', 'pont de diodes : les alternances négatives sont retournées.', 'var(--amber)'],
      ['Le <b>condensateur</b> lisse la tension', 'on obtient une tension presque continue : c’est un chargeur !', 'var(--green)']], [52.2, 56.6, 61]);
    var lastT = 0;
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 52.2)) {
        st.dc = t > 10 && t < 15; st.N2 = t < 6 ? 44 : t < 10 ? 44 + 66 * K.k(t, 6.5, 2) : 44;
        st.rect = t < 16 ? 'none' : t < 23 ? 'diode' : 'pont'; st.C = t < 32 ? 0 : t < 39 ? 100 : 1000;
        st.sens = st.N2 > 60 ? 10 : 5;
        if (t >= 46) { st.N2 = 18; st.rect = 'pont'; st.C = 1000; st.sens = 2; }
        lab.step(t - lastT, t);
        var bx = t < 16 ? [158, 164] : t < 32 ? [344, 144] : t < 46 ? [510, 134] : [12, 834];
        attr(hl, { x: bx[0], width: bx[1], opacity: 0.6 + 0.4 * Math.sin(t * 4) });
        tg.show(t, 2, 6, 600, 262, 'U₂ ÷ U₁ = N₂ ÷ N₁ : 44 ÷ 1100 → 12 V max') || tg.show(t, 6.8, 9.8, 600, 262, 'Plus de spires au secondaire : U₂ plus grande') || tg.show(t, 10.4, 15, 600, 262, 'Avec une pile : rien au secondaire !') ||
          tg.show(t, 17, 22.6, 600, 262, '1 diode : on supprime les alternances négatives') || tg.show(t, 23.4, 31.4, 600, 262, 'Pont de diodes : elles sont retournées') ||
          tg.show(t, 33, 38.6, 600, 262, '100 µF : la tension ondule encore') || tg.show(t, 39.4, 45.6, 600, 262, '1000 µF : presque continue !') || tg.show(t, 46.6, 51.8, 600, 262, '220 V ~ → 5 V ⎓ : le chargeur de téléphone');
      }
      lastT = t;
      K.group(g4, t, 51.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : chaîne secteur, transformateur, redressement, lissage et téléphone, avec un oscilloscope à deux voies',
    duration: 66, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Le transformateur est formé de deux bobines sur un noyau de fer. Il transforme deux cent vingt volts en une tension plus petite.', sub: 'Le <b>transformateur</b> : 2 bobines sur un noyau de fer. Il <b>abaisse</b> la tension.' },
      { t: 6.2, d: 4, say: 'Plus la bobine secondaire a de spires, plus la tension de sortie est grande.', sub: '<b>U₂ ÷ U₁ = N₂ ÷ N₁</b> : plus de spires, plus de tension.' },
      { t: 10.4, d: 5, say: 'Mais avec une tension continue, comme une pile, il ne se passe rien au secondaire.', sub: 'Avec une tension <b>continue</b>, le transformateur ne fonctionne <b>pas</b>.' },
      { t: 16, d: 7, say: 'Pour redresser la tension, on utilise une diode : elle ne laisse passer le courant que dans un sens. Les alternances négatives disparaissent.', sub: 'Une <b>diode</b> ne laisse passer le courant que dans <b>un sens</b>.' },
      { t: 23.2, d: 8.4, say: 'Avec un pont de quatre diodes, les alternances négatives sont retournées : c’est un redressement double alternance.', sub: 'Un <b>pont de diodes</b> retourne les alternances négatives : <b>double alternance</b>.' },
      { t: 32, d: 6.6, say: 'Pour lisser la tension, on ajoute un condensateur : il se charge, puis se décharge doucement.', sub: 'Un <b>condensateur</b> se charge puis se décharge : il <b>lisse</b> la tension.' },
      { t: 39, d: 6.8, say: 'Plus sa capacité est grande, plus la tension est presque continue.', sub: 'Plus la <b>capacité</b> est grande, plus la tension est <b>presque continue</b>.' },
      { t: 46, d: 6, say: 'C’est exactement ce que fait le chargeur de ton téléphone : deux cent vingt volts alternatifs deviennent cinq volts continus.', sub: 'Le <b>chargeur</b> : 220 V alternatifs → <b>5 V continus</b>.' },
      { t: 52.2, d: 4.2, say: 'À retenir : le transformateur abaisse une tension alternative.', sub: 'Le transformateur <b>abaisse</b> une tension alternative.' },
      { t: 56.6, d: 4.2, say: 'Les diodes redressent la tension.', sub: 'Les <b>diodes</b> redressent.' },
      { t: 61, d: 4.6, say: 'Le condensateur la lisse : elle devient presque continue.', sub: 'Le <b>condensateur</b> lisse.' }
    ],
    learn: [
      { t: 9, ch: 1, html: '<b>U₂ ÷ U₁ = N₂ ÷ N₁</b> ; ne fonctionne qu’en <b>alternatif</b>.' },
      { t: 22, ch: 2, html: 'Une <b>diode</b> : courant dans un seul sens → simple alternance.' },
      { t: 30, ch: 2, html: '<b>Pont de diodes</b> → double alternance.' },
      { t: 44, ch: 3, html: 'Le <b>condensateur</b> lisse : tension presque continue.' }
    ],
    question: { q: 'Un transformateur a N₁ = 1 100 spires et N₂ = 55 spires. Il est branché sur 220 V. Quelle tension efficace obtient-on ?', o: ['5 V', '11 V', '22 V', '4 400 V'], a: 1, e: 'U₂ = 220 × 55 ÷ 1 100 = 11 V.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Chaîne secteur, transformateur, redressement, lissage et téléphone, avec un oscilloscope à deux voies A et B',
    steps: [
      'Règle le nombre de spires N₂ du secondaire et observe la voie A : la tension est-elle plus petite que 220 V ?',
      'Remplace le secteur par une pile : le transformateur fonctionne-t-il ?',
      'Choisis le redressement (1 diode, puis pont de diodes) et observe la voie B.',
      'Ajoute un condensateur de lissage. Dans Mesures, relève U₂ max pour plusieurs N₂.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { id: 'sim', N2: 44, sens: 5 }), st = lab.st, c = api.c, rows = [];
      var cSrc = c.seg({ label: 'Source', value: 0, options: [{ v: 0, l: 'Secteur 220 V ~' }, { v: 1, l: 'Pile 12 V' }], onChange: function (v) { st.dc = !!v; api.say(v ? 'Avec une tension continue, la voie A reste à 0 : le transformateur ne fonctionne pas.' : 'Secteur : tension alternative.'); } });
      var sN = c.slider({ label: 'Spires du secondaire N₂ (N₁ = 1100)', min: 10, max: 220, step: 1, value: 44, onInput: function (v) { st.N2 = v; } });
      var cR = c.seg({ label: 'Redressement', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'diode', l: '1 diode' }, { v: 'pont', l: 'pont de 4 diodes' }], onChange: function (v) { st.rect = v; } });
      var cC = c.seg({ label: 'Condensateur de lissage', value: 0, options: [{ v: 0, l: 'aucun' }, { v: 100, l: '100 µF' }, { v: 470, l: '470 µF' }, { v: 2200, l: '2200 µF' }], onChange: function (v) { st.C = v; } });
      var cS = c.seg({ label: 'Oscilloscope : sensibilité', value: 5, options: [{ v: 2, l: '2 V/div' }, { v: 5, l: '5 V/div' }, { v: 10, l: '10 V/div' }, { v: 20, l: '20 V/div' }], onChange: function (v) { st.sens = v; } });
      var ro = api.readouts([{ k: 'r', label: 'N₂ ÷ N₁' }, { k: 'u', label: 'U₂ max (calculée)' }, { k: 'm', label: 'Tension moyenne en B' }, { k: 'o', label: 'Ondulation en B' }]);
      api.loop(function (dt, T) { lab.step(dt, T); var sg = lab.sig(); ro.r.set(fmt(st.N2 / N1, 3)); ro.u.set(S.prof.level === 'dec' ? fmt(sg.u2m, 1) + ' V' : 'à lire (voie A)'); ro.m.set(fmt(sg.mean, 1) + ' V'); ro.o.set(st.rect === 'none' ? '—' : fmt(sg.ripple, 1) + ' V'); });
      var M = api.measure; M.innerHTML = '<h3>Voie A : hauteur d’une crête</h3>';
      var rd = api.h('div', { class: 'read', style: 'grid-template-columns:1fr' }, M), i1 = api.h('input', { type: 'number', step: '0.1', inputmode: 'decimal' }, api.h('label', {}, rd, 'Crête de la voie A (en divisions)'));
      var br = api.h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px' }, M), bA = api.h('button', { class: 'btn sm' }, br, 'Lire pour moi'), bR = api.h('button', { class: 'btn sm primary' }, br, 'Vérifier et relever');
      var msg = api.h('div', { class: 'msg' }, M), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bA.onclick = function () { i1.value = Math.round(lab.sig().u2m / st.sens * 10) / 10; };
      bR.onclick = function () {
        var tr = lab.sig().u2m / st.sens, a = parseFloat(String(i1.value).replace(',', '.'));
        if (st.dc) { msg.className = 'msg warn'; msg.textContent = 'Avec la pile, il n’y a rien à mesurer en A.'; return; }
        if (tr > 4.05) { msg.className = 'msg warn'; msg.textContent = 'La courbe sort de l’écran : augmente les V/div.'; return; }
        if (isNaN(a)) { msg.className = 'msg warn'; msg.textContent = 'Écris ta lecture en divisions.'; return; }
        if (Math.abs(a - tr) > (S.prof.level === 'exp' ? 0.2 : 0.3)) { msg.className = 'msg bad'; msg.textContent = 'Lecture imprécise (1 petit trait = 0,2 div). Utilise la loupe.'; api.sound('bad'); return; }
        rows.push({ N2: st.N2, u: a * st.sens }); msg.className = 'msg ok'; msg.textContent = 'U₂ max = ' + fmt(a * st.sens, 1) + ' V pour N₂ = ' + st.N2 + '.'; api.sound('ok'); i1.value = ''; paint(); if (rows.length >= 3) api.done();
      };
      function paint() {
        bA.style.display = S.prof.level === 'dec' ? '' : 'none'; api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>N₂</th><th>N₂ ÷ N₁</th><th>U₂ max (V)</th><th>U₂ ÷ U₁</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.N2 + '</td><td>' + fmt(r.N2 / N1, 3) + '</td><td>' + fmt(r.u, 1) + '</td><td>' + fmt(r.u / U1MAX, 3) + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure pour l’instant.</div>';
        api.chart.innerHTML = '<h3>U₂ max en fonction de N₂</h3>'; var bx = api.h('div', {}, api.chart);
        var a = S.chart(bx, { xlabel: 'N₂ (spires)', ylabel: 'U₂ max (V)', xmin: 0, xmax: 220, xstep: 50, ymin: 0, ymax: 70, ystep: 10, series: [{ color: 'var(--amber)', pts: rows.map(function (r) { return [r.N2, r.u]; }), fit: true }] });
        if (a[0]) api.h('p', { style: 'font-size:13px;margin:6px 0 0' }, api.chart, 'Pente : <b>' + fmt(a[0], 3) + ' V par spire</b> ≈ 311 ÷ 1 100 = 0,283');
      }
      paint();
      api.onReset(function () { Object.assign(st, { N2: 44, rect: 'none', C: 0, sens: 5, dc: false }); cSrc.set(0); sN.set(44); cR.set('none'); cC.set(0); cS.set(5); rows = []; paint(); });
      api.say('Commence par faire varier N₂ et regarde la voie A (pointillés orange).');
      return { enter: paint, bilan: function () {
        if (rows.length < 2) return '<p>Relève U₂ max pour au moins 2 valeurs de N₂.</p>';
        var k = 0; rows.forEach(function (r) { k += (r.u / U1MAX) / (r.N2 / N1); }); k /= rows.length;
        return '<p>Rapport (U₂ ÷ U₁) ÷ (N₂ ÷ N₁) ≈ <b>' + fmt(k, 2) + '</b> ≈ 1 : <b>U₂ ÷ U₁ = N₂ ÷ N₁</b>.</p><p>La diode supprime les alternances négatives, le pont les retourne ; le condensateur réduit l’ondulation : plus la capacité est grande, plus la tension est presque continue.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Chaîne transformateur, redressement, lissage' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); api.loop(function (dt, T) { lab.step(dt, T); }); return lab; }
  var DEFI = {
    title: 'Le défi du chargeur',
    intro: 'Construis un vrai chargeur : abaisse la tension, redresse-la, lisse-la… avant la fin du chrono !',
    missions: [
      { title: 'Abaisser', text: 'Règle N₂ pour obtenir une tension maximale de <span style="color:var(--amber)">12 V</span> (± 0,5 V) sur la voie A.', lumi: 'À 5 V/div, 12 V correspondent à 2,4 divisions.', hint: 'N₂ = 1100 × 12 ÷ 311 ≈ 42 spires.',
        build: function (api) { var lab = mini(api, { id: 'd1', N2: 100, sens: 5, showN: S.prof.level === 'dec' }); api.c.slider({ label: 'Spires N₂', min: 10, max: 220, step: 1, value: 100, fmt: function (v) { return S.prof.level === 'dec' ? v + '' : '?'; }, onInput: function (v) { lab.st.N2 = v; } }); return function () { var u = lab.sig().u2m; return Math.abs(u - 12) <= 0.5 ? { ok: true, msg: 'U₂ max = ' + fmt(u, 1) + ' V avec N₂ = ' + lab.st.N2 + '.' } : { ok: false, msg: 'Regarde la crête de la voie A.' }; }; },
        e: 'U₂ max = 311 × N₂ ÷ 1100.' },
      { type: 'qcm', title: 'Transformateur et pile', text: 'On branche un transformateur sur une pile de 12 V. Au secondaire, on obtient :', o: ['12 V', 'une tension alternative', 'rien (0 V)', 'une tension plus grande'], a: 2, hint: 'Le transformateur a besoin d’une tension qui varie…', e: 'Un transformateur ne fonctionne qu’en tension alternative.' },
      { title: 'Double alternance', text: 'Fais en sorte que la voie B ne soit <span style="color:var(--amber)">jamais négative</span> et que <span style="color:var(--amber)">toutes</span> les alternances soient utilisées.', lumi: 'Une seule diode jette la moitié du signal…', hint: 'Il faut un pont de 4 diodes.',
        build: function (api) { var lab = mini(api, { id: 'd3', N2: 44, sens: 5 }); api.c.seg({ label: 'Redressement', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'diode', l: '1 diode' }, { v: 'pont', l: 'pont' }], onChange: function (v) { lab.st.rect = v; } }); return function () { return lab.st.rect === 'pont' ? { ok: true, msg: 'Le pont retourne les alternances négatives.' } : { ok: false, msg: lab.st.rect === 'diode' ? 'Avec 1 diode, les alternances négatives sont perdues.' : 'La tension est encore alternative.' }; }; },
        e: 'Le pont de diodes réalise un redressement double alternance.' },
      { title: 'Presque continue', text: 'Obtiens en B une tension dont l’<span style="color:var(--amber)">ondulation</span> est inférieure à <span style="color:var(--amber)">1 V</span>.', lumi: 'Redressement + condensateur… lequel ?', hint: 'Pont de diodes et le plus gros condensateur.',
        build: function (api) { var lab = mini(api, { id: 'd4', N2: 44, sens: 5 }); api.c.seg({ label: 'Redressement', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'diode', l: '1 diode' }, { v: 'pont', l: 'pont' }], onChange: function (v) { lab.st.rect = v; } }); api.c.seg({ label: 'Condensateur', value: 0, options: [{ v: 0, l: 'aucun' }, { v: 100, l: '100 µF' }, { v: 470, l: '470 µF' }, { v: 2200, l: '2200 µF' }], onChange: function (v) { lab.st.C = v; } }); return function () { var sg = lab.sig(); return lab.st.rect !== 'none' && sg.ripple < 1 ? { ok: true, msg: 'Ondulation de ' + fmt(sg.ripple, 2) + ' V seulement : la tension est presque continue.' } : { ok: false, msg: lab.st.rect === 'none' ? 'Il faut d’abord redresser.' : 'Ondulation : ' + fmt(sg.ripple, 1) + ' V.' }; }; },
        e: 'Pont de diodes + grand condensateur : ondulation très faible.' },
      { type: 'qcm', title: 'La diode', text: 'Quel est le rôle d’une diode ?', o: ['Abaisser la tension', 'Laisser passer le courant dans un seul sens', 'Stocker l’énergie', 'Mesurer la fréquence'], a: 1, hint: 'Pense au symbole : une flèche et une barre.', e: 'La diode ne laisse passer le courant que dans un sens.' }
    ]
  };

  S.start({
    id: '4e-transfo-redressement', level: '4e', theme: 'Courants et tensions alternatifs', title: 'Transformation, redressement et lissage', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un <b>transformateur</b> est formé de deux bobines (primaire et secondaire) enroulées sur un noyau de fer. Il modifie la valeur d’une tension <b>alternative</b> sans changer sa fréquence ; il ne fonctionne pas en tension continue.',
      'Pour un transformateur : <b>U₂ ÷ U₁ = N₂ ÷ N₁</b>. Si N₂ < N₁, il est <b>abaisseur</b> ; si N₂ > N₁, il est élévateur.',
      'Une <b>diode</b> ne laisse passer le courant que dans un sens : avec une diode, on obtient un redressement <b>simple alternance</b> ; avec un <b>pont de 4 diodes</b>, un redressement <b>double alternance</b>.',
      'Un <b>condensateur</b> placé en sortie <b>lisse</b> la tension redressée : plus sa capacité est grande, plus l’ondulation est faible et la tension presque continue.',
      'Un <b>adaptateur</b> (chargeur) associe transformateur, pont de diodes et condensateur : il fournit une tension continue de faible valeur à partir du secteur.'
    ],
    quiz: [
      { q: 'Un transformateur abaisseur a :', o: ['N₂ > N₁', 'N₂ < N₁', 'N₂ = N₁', 'aucune bobine'], a: 1, e: 'Moins de spires au secondaire : la tension de sortie est plus petite.' },
      { q: 'N₁ = 1 000, N₂ = 50, U₁ = 220 V. U₂ vaut :', o: ['11 V', '22 V', '4 400 V', '50 V'], a: 0, e: 'U₂ = 220 × 50 ÷ 1 000 = 11 V.' },
      { q: 'Avec une seule diode, la tension redressée est :', o: ['double alternance', 'simple alternance', 'continue parfaite', 'nulle'], a: 1, e: 'Seules les alternances positives passent.' },
      { q: 'Le pont de diodes sert à :', o: ['lisser', 'redresser en double alternance', 'abaisser la tension', 'mesurer la tension'], a: 1, e: 'Il retourne les alternances négatives.' },
      { q: 'Pour obtenir une tension presque continue, on ajoute :', o: ['une résistance', 'un condensateur', 'une deuxième diode', 'un fusible'], a: 1, e: 'Le condensateur lisse la tension redressée.' }
    ]
  });
})();
