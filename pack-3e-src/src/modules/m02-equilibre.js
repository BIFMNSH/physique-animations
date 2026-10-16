/* Équilibre d'un solide soumis à deux forces : anneau tiré par deux dynamomètres.
   Condition : même direction, sens opposés, même valeur. Sinon l'anneau se déplace. */
Lab.register({
  id: 'equilibre', theme: 'meca', title: 'Anneau tiré par deux dynamomètres',
  lesson: 'Équilibre d’un solide soumis à deux forces', skills: ['C1', 'C2', 'C4'],
  objective: 'Trouve les conditions pour que l’anneau reste immobile au centre de la planche.',
  alt: 'Planche avec un anneau tiré par deux fils reliés à deux dynamomètres, dont on règle la valeur et la direction',
  thumb: '<circle cx="80" cy="39" r="7" fill="none" stroke="var(--scene-text)" stroke-width="3"/><path d="M73 39H22M87 39H138" stroke="var(--s1)" stroke-width="3"/><path d="M22 39l9-6v12zM138 39l-9-6v12z" fill="var(--s1)"/>',
  height: 420,
  steps: [
    'Règle la <b>valeur</b> des deux forces avec les curseurs.',
    'Oriente chaque fil avec son curseur de direction (ou glisse la poignée ronde).',
    'Observe l’anneau : cherche à le garder au centre.',
    'Appuie sur « Relever » à chaque essai, puis conclus.'
  ],
  retiens: [
    'Un solide soumis à <b>deux forces</b> est en équilibre si elles ont <b>la même droite d’action</b>, des <b>sens opposés</b> et la <b>même valeur</b>.',
    'Si une condition manque, la somme des forces n’est pas nulle : le solide se met en mouvement.',
    'Le dynamomètre mesure la valeur d’une force en newton (N).'
  ],
  quiz: [
    { q: 'Quelles sont les trois conditions pour qu’un solide soumis à deux forces soit en équilibre ?', o: ['Même valeur, même sens, directions différentes', 'Même droite d’action, sens opposés, même valeur', 'Même droite d’action, même sens, valeurs différentes', 'Sens opposés, directions différentes, même valeur'], a: 1, e: 'Les deux forces se compensent : même droite, sens contraires, mêmes valeurs.' },
    { q: 'Deux forces de 3 N, de même direction et de même sens, agissent sur un solide. Que se passe-t-il ?', o: ['Il est en équilibre', 'Il se déplace dans le sens des forces', 'Il tourne sur place sans bouger', 'Rien, car les valeurs sont égales'], a: 1, e: 'Les sens ne sont pas opposés : les effets s’ajoutent (6 N au total).' },
    { q: 'Un solide en équilibre subit F1 = 4 N vers la gauche. Que vaut F2 ?', o: ['2 N vers la gauche', '4 N vers la droite', '8 N vers la droite', '0 N'], a: 1, e: 'F2 compense F1 : 4 N dans le sens contraire.' },
    { q: 'Une lampe est suspendue à un fil, immobile. Le fil exerce une force de 5 N. Quel est le poids de la lampe ?', o: ['0 N', '2,5 N', '5 N', '10 N'], a: 2, e: 'Poids et tension du fil s’équilibrent : même valeur, 5 N.' },
    { q: 'Deux forces de même valeur tirent l’anneau dans des directions non opposées. L’anneau :', o: ['reste au centre', 'se déplace', 'disparaît', 'change de masse'], a: 1, e: 'Même valeur ne suffit pas : il faut aussi la même droite et des sens opposés.' }
  ],
  build: function (c) {
    var CX = 400, CY = 210, K = 30, R = 175;   // K : pixels par newton
    var f1 = c.slider('Force F<sub>1</sub>', { min: 0.5, max: 5, step: 0.1, value: 3, unit: 'N' });
    var a1 = c.slider('Direction du fil 1', { min: 0, max: 359, step: 1, value: 155, unit: '°' });
    var f2 = c.slider('Force F<sub>2</sub>', { min: 0.5, max: 5, step: 0.1, value: 2, unit: 'N' });
    var a2 = c.slider('Direction du fil 2', { min: 0, max: 359, step: 1, value: 25, unit: '°' });
    var off = { x: 0, y: 0 };

    // décor : planche et repère central
    c.s('rect', { x: 30, y: 24, width: 740, height: 372, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('circle', { cx: CX, cy: CY, r: 16, fill: 'none', stroke: 'var(--scene-muted)', 'stroke-dasharray': '4 4' });
    c.s('text', { x: 60, y: 54, 'font-size': 14, text: 'Repère central' }).style.fill = 'var(--scene-muted)';
    var g = c.s('g');
    var strings = [], handles = [], boxes = [], arrows = [], labels = [];
    var cols = ['var(--s1)', 'var(--s2)'];
    for (var i = 0; i < 2; i++) {
      strings.push(c.s('line', { stroke: 'var(--scene-text)', 'stroke-width': 2 }, g));
      boxes.push(c.s('rect', { width: 70, height: 22, rx: 5, fill: cols[i], stroke: 'var(--scene)', 'stroke-width': 1.5 }, g));
      labels.push(c.s('text', { 'font-size': 13, 'text-anchor': 'middle', 'font-weight': 700, fill: '#fff' }, g));
      labels[i].style.fill = '#fff';
      arrows.push(c.s('path', { fill: cols[i], 'fill-opacity': .85 }, g));
      handles.push(c.s('circle', { r: 22, fill: cols[i], 'fill-opacity': .22, stroke: cols[i], 'stroke-width': 2 }, g));
    }
    var resArrow = c.s('path', { fill: 'var(--bad)', 'fill-opacity': .9 }, g);
    var resText = c.s('text', { x: 750, y: 54, 'font-size': 15, 'font-weight': 700, 'text-anchor': 'end' }, g); resText.style.fill = 'var(--bad)';
    var ring = c.s('circle', { r: 14, fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 6 }, g);

    function vec(f, a) { var r = a * Math.PI / 180; return { x: f * Math.cos(r), y: -f * Math.sin(r) }; }
    function netF() { var u = vec(f1.get(), a1.get()), v = vec(f2.get(), a2.get()); return { x: u.x + v.x, y: u.y + v.y }; }
    function arrow(el, x0, y0, dx, dy) {
      var L = Math.hypot(dx, dy); if (L < 3) { el.setAttribute('d', ''); return; }
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hd = Math.min(14, L * .5), w = 4;
      var x1 = x0 + dx, y1 = y0 + dy, bx = x1 - ux * hd, by = y1 - uy * hd;
      el.setAttribute('d', 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * 10) + ' ' + (by + ny * 10) + 'L' + x1 + ' ' + y1 + 'L' + (bx - nx * 10) + ' ' + (by - ny * 10) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z');
    }
    function draw() {
      var px = CX + off.x, py = CY + off.y, F = [f1.get(), f2.get()], A = [a1.get(), a2.get()];
      for (var i = 0; i < 2; i++) {
        var r = A[i] * Math.PI / 180, ux = Math.cos(r), uy = -Math.sin(r);
        var hx = CX + ux * R, hy = CY + uy * R;
        strings[i].setAttribute('x1', px); strings[i].setAttribute('y1', py); strings[i].setAttribute('x2', hx); strings[i].setAttribute('y2', hy);
        handles[i].setAttribute('cx', hx); handles[i].setAttribute('cy', hy);
        var bx = px + ux * 100, by = py + uy * 100;
        boxes[i].setAttribute('x', bx - 35); boxes[i].setAttribute('y', by - 11);
        labels[i].setAttribute('x', bx); labels[i].setAttribute('y', by + 5); labels[i].textContent = 'F' + (i + 1) + ' = ' + c.fmt(F[i], 1) + ' N';
        arrow(arrows[i], px, py, ux * F[i] * K, uy * F[i] * K);
      }
      var n = netF(), L = Math.hypot(n.x, n.y);
      arrow(resArrow, px, py, n.x * K, n.y * K); resArrow.style.display = L > 0.12 ? '' : 'none';
      resText.textContent = L > 0.12 ? 'Somme des forces (flèche rouge) : ' + c.fmt(L, 1) + ' N' : 'Somme des forces nulle';
      ring.setAttribute('cx', px); ring.setAttribute('cy', py);
    }
    c.onUpdate(draw);

    // poignées glissables : règlent la direction du fil
    [0, 1].forEach(function (i) {
      c.drag(handles[i], { move: function (x, y) {
        var a = Math.atan2(-(y - CY), x - CX) * 180 / Math.PI; if (a < 0) a += 360; (i ? a2 : a1).set(Math.round(a) % 360);
      } });
    });

    function state() {
      var n = netF(), L = Math.hypot(n.x, n.y);
      var d = Math.abs(((a1.get() - a2.get()) % 360 + 540) % 360 - 180);   // écart par rapport à 180°
      var eq = L < 0.15;
      return { L: L, d: d, eq: eq };
    }
    c.loop(function (dt) {   // l'anneau glisse vers un décalage proportionnel à la somme des forces
      var n = netF(), tx = Math.max(-150, Math.min(150, n.x * 38)), ty = Math.max(-150, Math.min(150, n.y * 38));
      var k = 1 - Math.exp(-6 * dt); off.x += (tx - off.x) * k; off.y += (ty - off.y) * k; draw();
    });
    var lastTip = '';
    c.onUpdate(function () {
      var st = state(), tip;
      if (st.eq) tip = 'L’anneau est en équilibre : forces de même valeur, sur la même droite, de sens opposés.';
      else if (st.d > 3 && Math.abs(f1.get() - f2.get()) < 0.15) tip = 'Les valeurs sont égales, mais les fils ne sont pas alignés : l’anneau se déplace.';
      else if (st.d <= 3) tip = 'Les fils sont alignés et opposés, mais les valeurs sont différentes : l’anneau se déplace vers la plus grande force.';
      else tip = 'Il manque encore une condition : regarde l’angle entre les fils et les valeurs.';
      if (tip !== lastTip) { c.say(tip, st.eq ? 'ok' : 'warn'); lastTip = tip; }
    });

    c.readout('F₁ (dynamomètre 1)', function () { return c.noise(f1.get(), 0.005); }, 'N', 2);
    c.readout('F₂ (dynamomètre 2)', function () { return c.noise(f2.get(), 0.005); }, 'N', 2);
    c.readout('Angle entre les fils', function () { var d = Math.abs(a1.get() - a2.get()); return d > 180 ? 360 - d : d; }, '°', 0);
    c.readout('Somme des forces', function () { return state().L; }, 'N', 2);

    c.table({ cols: [{ key: 'f1', label: 'F₁', unit: 'N', d: 1 }, { key: 'f2', label: 'F₂', unit: 'N', d: 1 }, { key: 'ang', label: 'angle entre les fils', unit: '°', d: 0 }, { key: 'som', label: 'somme', unit: 'N', d: 2 }, { key: 'etat', label: 'anneau', txt: true }], onChange: bilan });
    c.measure('Relever cet essai', function () {
      var st = state(), d = Math.abs(a1.get() - a2.get()); if (d > 180) d = 360 - d;
      return { f1: f1.get(), f2: f2.get(), ang: d, som: st.L, etat: st.eq ? 'immobile' : 'se déplace' };
    });
    function bilan(rows) {
      var eqs = rows.filter(function (r) { return r.etat === 'immobile'; });
      if (eqs.length >= 2) {
        var ok = eqs.every(function (r) { return Math.abs(r.f1 - r.f2) < 0.16 && Math.abs(r.ang - 180) < 4; });
        c.results(ok ? '<b>Conclusion :</b> dans tous les cas d’équilibre, F₁ = F₂ et l’angle entre les fils vaut 180° (même droite, sens opposés).' : 'Vérifie tes essais en équilibre : les valeurs et l’angle devraient respecter les trois conditions.');
      } else c.results(rows.length ? 'Trouve au moins deux essais où l’anneau est immobile pour conclure.' : '');
    }
  }
});
