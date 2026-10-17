/* 3e · Équilibre d'un solide soumis à deux forces (anneau + deux dynamomètres) */
Sim.register('equilibre-2forces', {
  objective: 'Trouver à quelles conditions un anneau tiré par deux dynamomètres reste immobile (en équilibre).',
  alt: 'Vue de dessus d’une table : un anneau léger relié à deux dynamomètres que l’on peut déplacer, avec les vecteurs des deux forces',
  chart: false,
  steps: [
    'Fais glisser les poignées des dynamomètres D₁ et D₂ pour placer les fils où tu veux.',
    'Lâche l’anneau (ou déplace-le puis relâche-le) : il bouge puis s’immobilise. Relève F₁, F₂ et l’angle entre les deux forces.',
    'Recommence avec d’autres positions, puis avec un dynamomètre D₂ plus raide : l’équilibre change-t-il de règle ?',
    'Active la punaise pour bloquer l’anneau ailleurs : les deux forces se compensent-elles encore ?'
  ],
  retiens: [
    'Un solide soumis à deux forces est <b>en équilibre</b> (immobile) si ces deux forces se compensent.',
    'Conditions d’équilibre : les deux forces ont <b>la même droite d’action</b>, des <b>sens opposés</b> et <b>la même intensité</b> (F₁ = F₂).',
    'On dit que la somme vectorielle des deux forces est nulle : elles se compensent.',
    'Si une seule de ces conditions manque, le solide se met en mouvement.'
  ],
  quiz: [
    { q: 'Un anneau est en équilibre sous l’action de deux forces. F₁ = 6 N. Que vaut F₂ ?', o: ['3 N', '6 N', '12 N', 'On ne peut pas savoir'], a: 1, e: 'À l’équilibre, les deux forces ont la même intensité : F₂ = F₁ = 6 N.' },
    { q: 'À l’équilibre, quel angle font les deux forces entre elles ?', o: ['0°', '90°', '180°', 'N’importe lequel'], a: 2, e: 'Elles sont sur la même droite d’action et de sens opposés : l’angle vaut 180°.' },
    { q: 'Deux forces de même droite d’action, de sens opposés, F₁ = 5 N et F₂ = 8 N. Le solide :', o: ['reste immobile', 'se déplace du côté de F₂', 'se déplace du côté de F₁', 'tourne sur lui-même'], a: 1, e: 'Les forces ne se compensent pas : le solide est entraîné du côté de la force la plus grande.' },
    { q: 'Avec un dynamomètre D₂ plus raide, à l’équilibre :', o: ['F₂ est plus grande que F₁', 'F₂ est plus petite que F₁', 'F₁ = F₂ quand même', 'il n’y a plus d’équilibre'], a: 2, e: 'Le ressort de D₂ s’allonge moins, mais la force lue est la même : F₁ = F₂.' },
    { q: 'Une lampe suspendue à un fil est immobile. Les deux forces qui s’exercent sur elle sont :', o: ['le poids et la tension du fil', 'le poids et la réaction du sol', 'la tension du fil seulement', 'le poids seulement'], a: 0, e: 'Le poids (vers le bas) et la tension du fil (vers le haut) se compensent.' }
  ],
  build: function (e) {
    var W = e.W, H = e.H, RR = 18, TUBE = 120, L0 = 46;
    var K1 = 0.08, K2 = 0.08;                   // N par pixel d'allongement
    var P = [{ x: 120, y: 330 }, { x: 680, y: 300 }];
    var R = { x: 400, y: 315 }, V = { x: 0, y: 0 }, held = false, pinned = false, still = 0, tbl;
    var COL = ['var(--s1)', 'var(--s2)'];

    function arrowPath(x0, y0, x1, y1, w, hw, hl) {
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
      if (L < 3) return '';
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux; hl = Math.min(hl, L * 0.6);
      var bx = x1 - ux * hl, by = y1 - uy * hl;
      return 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * hw) + ' ' + (by + ny * hw) +
        'L' + x1 + ' ' + y1 + 'L' + (bx - nx * hw) + ' ' + (by - ny * hw) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z';
    }
    function springPath(ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, n = 14, end = 10;
      var d = 'M' + ax + ' ' + ay + 'L' + (ax + ux * end) + ' ' + (ay + uy * end);
      var seg = (L - 2 * end) / n;
      for (var i = 1; i < n; i++) { var s = (i % 2 ? 1 : -1) * 8, t = end + seg * i; d += 'L' + (ax + ux * t + nx * s) + ' ' + (ay + uy * t + ny * s); }
      return d + 'L' + (bx - ux * end) + ' ' + (by - uy * end) + 'L' + bx + ' ' + by;
    }

    /* table vue de dessus */
    e.s('rect', { x: 0, y: 0, width: W, height: H, fill: 'var(--scene)' });
    e.s('rect', { x: 16, y: 16, width: W - 32, height: H - 32, rx: 18, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 });
    for (var gx = 56; gx < W - 30; gx += 40) e.s('line', { x1: gx, x2: gx, y1: 30, y2: H - 30, stroke: 'var(--scene-line)', 'stroke-width': 1, opacity: 0.45 });
    for (var gy = 50; gy < H - 30; gy += 40) e.s('line', { x1: 30, x2: W - 30, y1: gy, y2: gy, stroke: 'var(--scene-line)', 'stroke-width': 1, opacity: 0.45 });

    var axis = e.s('line', { stroke: 'var(--s4)', 'stroke-width': 1.6, 'stroke-dasharray': '8 7', opacity: 0 });
    var dyn = [0, 1].map(function (i) {
      var g = e.s('g');
      var spring = e.s('path', { fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
      var tube = e.s('g', {}, g);
      e.s('rect', { x: 0, y: -15, width: TUBE, height: 30, rx: 10, fill: 'var(--scene)', stroke: COL[i], 'stroke-width': 2.5 }, tube);
      var read = e.s('text', { x: TUBE / 2, y: 6, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: COL[i] }, tube);
      var handle = e.s('g', {}, g);
      e.s('circle', { r: 22, fill: COL[i], 'fill-opacity': 0.22, stroke: COL[i], 'stroke-width': 2.5 }, handle);
      e.s('circle', { r: 6, fill: COL[i] }, handle);
      e.s('text', { y: -30, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: COL[i], text: 'D' + (i ? '₂' : '₁') }, handle);
      var hit = e.s('circle', { r: 32, fill: 'transparent' }, handle);
      return { spring: spring, tube: tube, read: read, handle: handle, hit: hit, F: 0, u: { x: 0, y: 0 } };
    });
    /* anneau */
    var ringG = e.s('g');
    e.s('circle', { r: RR, fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 7 }, ringG);
    e.s('circle', { r: RR, fill: 'none', stroke: 'var(--scene)', 'stroke-width': 2, opacity: 0.4 }, ringG);
    var ringHit = e.s('circle', { r: RR + 14, fill: 'transparent' }, ringG);
    var pin = e.s('g', {}, ringG);
    e.s('circle', { r: 7, fill: 'var(--bad)', stroke: 'var(--scene)', 'stroke-width': 2 }, pin);
    var vecs = [0, 1].map(function (i) {
      return { p: e.s('path', { fill: COL[i] }), t: e.s('text', { 'font-size': 15, 'font-weight': 800, fill: COL[i] }) };
    });
    var res = e.s('path', { fill: 'var(--bad)', opacity: 0.85 });
    var arc = e.s('path', { fill: 'none', stroke: 'var(--s4)', 'stroke-width': 2 });
    var arcT = e.s('text', { 'font-size': 14, 'font-weight': 800, fill: 'var(--s4)' });

    /* panneau d'état */
    e.s('rect', { x: 32, y: 32, width: 300, height: 108, rx: 12, fill: 'var(--scene)', 'fill-opacity': 0.9, stroke: 'var(--scene-line)' });
    var tF1 = e.s('text', { x: 48, y: 60, 'font-size': 16, 'font-weight': 800, fill: COL[0] });
    var tF2 = e.s('text', { x: 190, y: 60, 'font-size': 16, 'font-weight': 800, fill: COL[1] });
    var tAng = e.s('text', { x: 48, y: 86, 'font-size': 14, fill: 'var(--scene-text)' });
    var tState = e.s('text', { x: 48, y: 120, 'font-size': 17, 'font-weight': 800 });
    e.s('text', { x: W - 34, y: H - 30, 'text-anchor': 'end', 'font-size': 12, fill: 'var(--scene-muted)', text: 'Anneau léger : son poids est négligeable · vecteurs : 1 N ↔ 14 px' });

    var ro1 = e.readout({ label: 'F₁ (dynamomètre D₁)' }), ro2 = e.readout({ label: 'F₂ (dynamomètre D₂)' });

    function forces() {
      [0, 1].forEach(function (i) {
        var d = dyn[i], k = i ? K2 : K1, dx = P[i].x - R.x, dy = P[i].y - R.y, L = Math.hypot(dx, dy) || 1;
        d.u = { x: dx / L, y: dy / L };
        var s = L - RR - TUBE - L0;
        d.F = s > 0 ? k * s : 0; d.len = L;
      });
    }
    function angleDeg() {
      var a = dyn[0].u, b = dyn[1].u, c = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y));
      return Math.acos(c) * 180 / Math.PI;
    }
    function status() {
      var nx = dyn[0].F * dyn[0].u.x + dyn[1].F * dyn[1].u.x, ny = dyn[0].F * dyn[0].u.y + dyn[1].F * dyn[1].u.y;
      return { net: Math.hypot(nx, ny), nx: nx, ny: ny, speed: Math.hypot(V.x, V.y) };
    }
    function draw() {
      forces();
      [0, 1].forEach(function (i) {
        var d = dyn[i], u = d.u, ang = Math.atan2(u.y, u.x) * 180 / Math.PI;
        var ax = R.x + u.x * RR, ay = R.y + u.y * RR;                      // crochet sur l'anneau
        var tx = P[i].x - u.x * TUBE, ty = P[i].y - u.y * TUBE;            // début du tube
        d.spring.setAttribute('d', springPath(ax, ay, tx, ty));
        d.tube.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') rotate(' + ang + ')');
        d.read.setAttribute('transform', Math.abs(ang) > 90 ? 'rotate(180 ' + TUBE / 2 + ' 0)' : '');
        d.read.textContent = e.fmt(d.F, 1) + ' N';
        d.handle.setAttribute('transform', 'translate(' + P[i].x + ' ' + P[i].y + ')');
        var L = d.F * 14, x1 = R.x + u.x * L, y1 = R.y + u.y * L;
        vecs[i].p.setAttribute('d', arrowPath(R.x, R.y, x1, y1, 2.6, 8, 15));
        vecs[i].t.setAttribute('x', x1 + u.x * 12 - 10); vecs[i].t.setAttribute('y', y1 + u.y * 12 + (u.y > 0 ? 18 : -8));
        vecs[i].t.textContent = d.F > 0.05 ? 'F' + (i ? '₂' : '₁') : '';
      });
      ringG.setAttribute('transform', 'translate(' + R.x + ' ' + R.y + ')');
      pin.style.display = pinned ? '' : 'none';
      var st = status(), ang = angleDeg();
      var a0 = Math.atan2(dyn[0].u.y, dyn[0].u.x), a1 = Math.atan2(dyn[1].u.y, dyn[1].u.x), r = 46;
      var sweep = ((a1 - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI), big = sweep > Math.PI;
      if (big) { var tmp = a0; a0 = a1; a1 = tmp; sweep = 2 * Math.PI - sweep; }
      arc.setAttribute('d', 'M' + (R.x + r * Math.cos(a0)) + ' ' + (R.y + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + (R.x + r * Math.cos(a1)) + ' ' + (R.y + r * Math.sin(a1)));
      var am = a0 + sweep / 2; arcT.setAttribute('x', R.x + (r + 16) * Math.cos(am) - 14); arcT.setAttribute('y', R.y + (r + 16) * Math.sin(am) + 5);
      arcT.textContent = Math.round(ang) + '°';
      var eq = !held && st.speed < 3 && st.net < 0.15;
      axis.style.opacity = eq ? 0.9 : 0;
      if (eq) { axis.setAttribute('x1', P[0].x); axis.setAttribute('y1', P[0].y); axis.setAttribute('x2', P[1].x); axis.setAttribute('y2', P[1].y); }
      var showRes = (pinned || held) && st.net > 0.2;
      res.setAttribute('d', showRes ? arrowPath(R.x, R.y, R.x + st.nx * 14, R.y + st.ny * 14, 2, 7, 13) : '');
      res.setAttribute('stroke-dasharray', '4 3');
      tF1.textContent = 'F₁ = ' + e.fmt(dyn[0].F, 1) + ' N'; tF2.textContent = 'F₂ = ' + e.fmt(dyn[1].F, 1) + ' N';
      tAng.textContent = 'Angle entre F₁ et F₂ : ' + Math.round(ang) + '°';
      if (eq) { tState.textContent = '✓ Équilibre : l’anneau est immobile'; tState.style.fill = 'var(--ok)'; }
      else if (pinned) { tState.textContent = st.net > 0.2 ? 'Bloqué par la punaise : forces non compensées' : 'Bloqué par la punaise'; tState.style.fill = 'var(--warn)'; tState.setAttribute('font-size', 14); }
      else if (held) { tState.textContent = 'Tu tiens l’anneau…'; tState.style.fill = 'var(--warn)'; }
      else { tState.textContent = '→ L’anneau se déplace'; tState.style.fill = 'var(--warn)'; }
      if (!pinned) tState.setAttribute('font-size', 17);
      ro1.set(e.fmt(dyn[0].F, 1) + ' N'); ro2.set(e.fmt(dyn[1].F, 1) + ' N');
      return eq;
    }

    function clampP(p) { return { x: Math.max(50, Math.min(W - 50, p.x)), y: Math.max(160, Math.min(H - 50, p.y)) }; }
    [0, 1].forEach(function (i) {
      e.drag(dyn[i].hit, { move: function (p) { P[i] = clampP(p); still = 0; draw(); } });
    });
    e.drag(ringHit, {
      start: function () { held = true; },
      move: function (p) { R = { x: Math.max(60, Math.min(W - 60, p.x)), y: Math.max(60, Math.min(H - 60, p.y)) }; V = { x: 0, y: 0 }; draw(); },
      end: function () { held = false; if (!pinned) e.say('Tu as lâché l’anneau : regarde où il s’arrête.'); draw(); }
    });

    var cK = e.choice({ label: 'Dynamomètre D₂', value: 1, options: [{ v: 1, l: 'identique à D₁' }, { v: 2, l: 'deux fois plus raide' }], onChange: function (v) { K2 = 0.08 * v; still = 0; draw(); e.say(v === 2 ? 'Le ressort de D₂ s’allonge deux fois moins pour une même force.' : 'Les deux dynamomètres sont identiques.'); } });
    var tP = e.toggle({ label: 'Punaise : bloquer l’anneau', value: false, onChange: function (v) { pinned = v; V = { x: 0, y: 0 }; draw(); e.say(v ? 'L’anneau est bloqué : déplace-le ou déplace les dynamomètres, puis compare F₁ et F₂.' : 'L’anneau est libre : il va chercher sa position d’équilibre.'); } });
    var bRow = e.buttonRow();
    e.button({ label: 'Aligner D₁ et D₂', into: bRow, onClick: function () { P = [{ x: 120, y: 330 }, { x: 680, y: 330 }]; draw(); } });
    e.button({ label: 'Placer en angle', into: bRow, onClick: function () { P = [{ x: 150, y: 470 }, { x: 640, y: 190 }]; draw(); } });

    e.loop(function (dt) {
      if (held || pinned) { draw(); return; }
      var n = Math.max(1, Math.round(dt * 600)), h = dt / n, m = 0.0016, c = 0.028;
      for (var k = 0; k < n; k++) {
        forces();
        var fx = dyn[0].F * dyn[0].u.x + dyn[1].F * dyn[1].u.x, fy = dyn[0].F * dyn[0].u.y + dyn[1].F * dyn[1].u.y;
        V.x += (fx - c * V.x) / m * h; V.y += (fy - c * V.y) / m * h;
        R.x += V.x * h; R.y += V.y * h;
      }
      R.x = Math.max(40, Math.min(W - 40, R.x)); R.y = Math.max(40, Math.min(H - 40, R.y));
      var eq = draw();
      if (eq) { still += dt; if (still > 0.4 && still - dt <= 0.4) e.say('L’anneau est immobile : F₁ = F₂ et l’angle vaut 180°. Relève les forces.', 'ok'); }
      else still = 0;
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'f1', label: 'F₁', unit: 'N', dec: 1 }, { k: 'f2', label: 'F₂', unit: 'N', dec: 1 }, { k: 'ang', label: 'Angle', unit: '°', dec: 0 }, { k: 'eq', label: 'Équilibre ?' }],
      onChange: bilan
    });
    e.measure('Relever F₁, F₂ et l’angle', function () {
      var st = status();
      if (!pinned && !held && st.speed > 3) { e.say('Attends que l’anneau soit immobile avant de relever.', 'warn'); return null; }
      if (dyn[0].F < 0.3 && dyn[1].F < 0.3) { e.say('Les fils ne sont pas tendus : écarte les dynamomètres.', 'warn'); return null; }
      var eq = !held && st.net < 0.15;
      var f1 = Math.round(e.noise(dyn[0].F, 0.01) * 10) / 10, f2 = Math.round(e.noise(dyn[1].F, 0.01) * 10) / 10;
      return { n: tbl.rows().length + 1, f1: f1, f2: f2, ang: Math.round(e.noise(angleDeg(), 0.004)), eq: eq ? 'oui' : (pinned ? 'non (punaise)' : 'non') };
    });
    function bilan(rows) {
      if (!rows.length) { e.results(''); return; }
      var yes = rows.filter(function (r) { return r.eq === 'oui'; }), no = rows.length - yes.length, h = '';
      if (yes.length) {
        var md = 0, ma = 0; yes.forEach(function (r) { md = Math.max(md, Math.abs(r.f1 - r.f2)); ma = Math.max(ma, Math.abs(180 - r.ang)); });
        h += 'Dans les <b>' + yes.length + '</b> cas d’équilibre : <b>F₁ = F₂</b> (écart max ' + e.fmt(md, 1) + ' N) et l’angle vaut <b>180°</b> (à ' + ma + '° près) : même droite d’action, sens opposés.';
      }
      if (no) h += (h ? '<br>' : '') + 'Quand l’anneau est bloqué par la punaise, les forces ne vérifient pas forcément ces conditions : sans la punaise, il se mettrait en mouvement.';
      if (yes.length < 2) h += '<br>Fais au moins 2 relevés d’équilibre dans des positions différentes.';
      e.results(h);
    }
    e.onReset(function () { P = [{ x: 120, y: 330 }, { x: 680, y: 300 }]; R = { x: 400, y: 315 }; V = { x: 0, y: 0 }; K2 = 0.08; pinned = false; cK.set(1); tP.set(false); draw(); });
    draw();
    e.say('Fais glisser les poignées D₁ et D₂, ou attrape l’anneau puis lâche-le.');
  }
});
