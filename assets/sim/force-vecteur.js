/* 3e · Représenter une force par un vecteur (caractéristiques d'une force, échelle) */
Sim.register('force-vecteur', {
  objective: 'Tirer une caisse avec un dynamomètre, lire les 4 caractéristiques de la force et la représenter par un vecteur à l’échelle.',
  alt: 'Caisse posée sur le sol, tirée par un dynamomètre que l’on oriente avec la main, et schéma à l’échelle de la force sur papier quadrillé',
  chart: true,
  steps: [
    'Fais glisser la main (ou utilise les curseurs) pour choisir l’intensité F et la direction de la force.',
    'Lis l’intensité sur le dynamomètre, puis repère le point d’application A, la direction et le sens.',
    'Choisis une échelle (par exemple 1 cm pour 2 N) et calcule la longueur du vecteur : L = F ÷ échelle.',
    'Relève plusieurs forces pour chaque échelle et observe la courbe L en fonction de F.'
  ],
  retiens: [
    'Une force a <b>4 caractéristiques</b> : un point d’application, une direction (la droite d’action), un sens et une intensité en newtons (N).',
    'L’intensité d’une force se mesure avec un <b>dynamomètre</b>.',
    'On représente une force par un <b>vecteur</b> : une flèche qui part du point d’application, suit la direction, indique le sens, et dont la longueur est proportionnelle à l’intensité.',
    'Avec une échelle de 1 cm pour e newtons : <b>L = F ÷ e</b>. Exemple : 12 N avec 1 cm pour 4 N donne une flèche de 3 cm.'
  ],
  quiz: [
    { q: 'Avec quel appareil mesure-t-on l’intensité d’une force ?', o: ['Une balance', 'Un dynamomètre', 'Un thermomètre', 'Un voltmètre'], a: 1, e: 'Le dynamomètre contient un ressort qui s’allonge proportionnellement à la force.' },
    { q: 'Laquelle n’est PAS une caractéristique d’une force ?', o: ['Le point d’application', 'La direction', 'La couleur', 'L’intensité'], a: 2, e: 'Les 4 caractéristiques : point d’application, direction, sens, intensité.' },
    { q: 'Échelle : 1 cm pour 5 N. Quelle longueur pour une force de 15 N ?', o: ['3 cm', '5 cm', '15 cm', '75 cm'], a: 0, e: 'L = F ÷ e = 15 ÷ 5 = 3 cm.' },
    { q: 'Un vecteur de 4 cm représente une force avec l’échelle 1 cm pour 2 N. Son intensité vaut :', o: ['2 N', '6 N', '8 N', '0,5 N'], a: 2, e: 'F = L × e = 4 × 2 = 8 N.' },
    { q: 'L’unité de l’intensité d’une force est :', o: ['le kilogramme (kg)', 'le joule (J)', 'le newton (N)', 'le watt (W)'], a: 2, e: 'L’intensité d’une force s’exprime en newtons (N).' }
  ],
  build: function (e) {
    var W = e.W, D2R = Math.PI / 180, GY = 318;
    var Ax = 214, Ay = 290;          // point d'application (crochet sur la caisse)
    var PXN = 6, ROD = 150;           // 6 px par newton d'allongement
    var F = 8, th = 20, ech = 2, show = true, tbl, ch;
    var SER = { 2: 0, 4: 1, 5: 2 };
    var CM = 18;                      // 1 cm du papier = 18 px

    function arrowPath(x0, y0, x1, y1, w, hw, hl) {
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
      if (L < 2) return '';
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux; hl = Math.min(hl, L * 0.6);
      var bx = x1 - ux * hl, by = y1 - uy * hl;
      return 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * hw) + ' ' + (by + ny * hw) +
        'L' + x1 + ' ' + y1 + 'L' + (bx - nx * hw) + ' ' + (by - ny * hw) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z';
    }

    /* décor */
    var defs = e.s('defs');
    var g1 = e.s('linearGradient', { id: 'fvSky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    e.s('stop', { offset: 0, 'stop-color': 'var(--scene)' }, g1); e.s('stop', { offset: 1, 'stop-color': 'var(--scene2)' }, g1);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'url(#fvSky)' });
    e.s('rect', { x: 0, y: GY, width: W, height: e.H - GY, fill: 'var(--scene2)' });
    e.s('line', { x1: 0, x2: W, y1: GY, y2: GY, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    for (var i = 0; i < 40; i++) e.s('line', { x1: i * 22, x2: i * 22 - 12, y1: GY + 4, y2: GY + 16, stroke: 'var(--scene-line)', 'stroke-width': 1.5 });
    /* caisse en bois */
    var crate = e.s('g');
    e.s('rect', { x: 84, y: 232, width: 130, height: 86, rx: 6, fill: 'var(--s2)', 'fill-opacity': 0.85, stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, crate);
    e.s('path', { d: 'M90 238L208 312M208 238L90 312', stroke: 'var(--scene-text)', 'stroke-width': 2, opacity: 0.35 }, crate);
    e.s('rect', { x: 84, y: 232, width: 130, height: 12, fill: 'var(--scene-text)', opacity: 0.12 }, crate);
    e.s('text', { x: 149, y: 284, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--scene-text)', text: '3 kg' }, crate);
    /* droite d'action */
    var act = e.s('line', { stroke: 'var(--s4)', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', opacity: 0.9 });
    var actT = e.s('text', { 'font-size': 13, 'font-weight': 700, fill: 'var(--s4)', text: 'droite d’action' });
    /* angle */
    var hor = e.s('line', { x1: Ax, x2: Ax + 120, y1: Ay, y2: Ay, stroke: 'var(--scene-muted)', 'stroke-width': 1.4, 'stroke-dasharray': '3 4' });
    var arc = e.s('path', { fill: 'none', stroke: 'var(--s4)', 'stroke-width': 2 });
    var arcT = e.s('text', { 'font-size': 14, 'font-weight': 800, fill: 'var(--s4)' });

    /* dynamomètre (groupe tourné) */
    var dyn = e.s('g');
    var rod = e.s('rect', { x: 0, y: -3, width: ROD + 4, height: 6, rx: 3, fill: 'var(--scene-muted)' }, dyn);
    var hook = e.s('path', { d: 'M0 0 C-10 0 -12 -12 -2 -14', fill: 'none', stroke: 'var(--scene-text)', 'stroke-width': 3, 'stroke-linecap': 'round' }, dyn);
    var tube = e.s('g', {}, dyn);
    e.s('rect', { x: 0, y: -16, width: 150, height: 32, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2.2 }, tube);
    e.s('rect', { x: 6, y: -11, width: 138, height: 22, rx: 6, fill: 'var(--scene)', opacity: 0.85 }, tube);
    // graduations : valeur v à la position local 130 - 6v (la lecture croît vers le crochet)
    for (var v = 0; v <= 20; v++) {
      var lx = 130 - PXN * v, big = v % 5 === 0;
      e.s('line', { x1: lx, x2: lx, y1: -11, y2: big ? -1 : -5, stroke: 'var(--scene-text)', 'stroke-width': big ? 1.6 : 1 }, tube);
      if (big) e.s('text', { x: lx, y: 9, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700, fill: 'var(--scene-text)', text: String(v) }, tube);
    }
    e.s('text', { x: 140, y: 9, 'text-anchor': 'middle', 'font-size': 9, fill: 'var(--scene-muted)', text: 'N' }, tube);
    var marker = e.s('rect', { x: ROD - 1.5, y: -12, width: 3, height: 24, fill: 'var(--bad)' }, dyn);
    /* main */
    var hand = e.s('g', {}, dyn);
    e.s('rect', { x: 150, y: -6, width: 20, height: 12, rx: 4, fill: 'var(--scene-muted)' }, hand);
    e.s('path', { d: 'M168 -18 q30 -6 34 18 q-4 22 -34 18 z', fill: '#E7B48C', stroke: '#7A4A2A', 'stroke-width': 2 }, hand);
    e.s('path', { d: 'M176 -12 h18 M176 -2 h20 M176 8 h18', stroke: '#7A4A2A', 'stroke-width': 1.5, opacity: 0.7 }, hand);
    var grip = e.s('circle', { cx: 186, cy: 0, r: 34, fill: 'transparent' }, hand);
    var gripRing = e.s('circle', { cx: 186, cy: 0, r: 30, fill: 'none', stroke: 'var(--warn)', 'stroke-width': 2, 'stroke-dasharray': '4 5', opacity: 0.8 }, hand);

    /* point A */
    e.s('circle', { cx: Ax, cy: Ay, r: 6, fill: 'var(--bad)', stroke: 'var(--scene)', 'stroke-width': 2 });
    e.s('text', { x: Ax - 4, y: Ay + 24, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--bad)', text: 'A' });

    /* encart : schéma à l'échelle sur papier quadrillé */
    var IX = 540, IY = 12, IW = 248, IH = 200, OX = IX + 26, OY = IY + IH - 22;
    e.s('rect', { x: IX, y: IY, width: IW, height: IH, rx: 10, fill: '#FBFCFE', stroke: 'var(--scene-line)', 'stroke-width': 1.5 });
    for (var gx = OX; gx <= IX + IW - 4; gx += CM) e.s('line', { x1: gx, x2: gx, y1: IY + 4, y2: IY + IH - 4, stroke: '#BFD3EA', 'stroke-width': 1 });
    for (var gy = OY; gy >= IY + 4; gy -= CM) e.s('line', { x1: IX + 4, x2: IX + IW - 4, y1: gy, y2: gy, stroke: '#BFD3EA', 'stroke-width': 1 });
    e.s('text', { x: IX + 10, y: IY + 20, 'font-size': 12, 'font-weight': 800, fill: '#1A2B45', text: 'Mon cahier · 1 carreau = 1 cm' });
    var echT = e.s('text', { x: IX + IW - 10, y: IY + IH - 10, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700, fill: '#1F6FB5' });
    e.s('rect', { x: OX - 20, y: OY - 14, width: 22, height: 14, fill: '#E3B57A', stroke: '#1A2B45', 'stroke-width': 1.2 });
    e.s('circle', { cx: OX, cy: OY, r: 3.5, fill: '#C0392B' });
    e.s('text', { x: OX - 4, y: OY + 15, 'font-size': 12, 'font-weight': 800, fill: '#C0392B', text: 'A' });
    var vec = e.s('path', { fill: '#C0392B' });
    var vecT = e.s('text', { 'font-size': 14, 'font-weight': 800, fill: '#C0392B' });
    var hidT = e.s('text', { x: IX + IW / 2, y: IY + IH / 2, 'text-anchor': 'middle', 'font-size': 13, fill: '#55627A', text: 'Vecteur caché : trace-le toi-même !' });

    /* bandeau des caractéristiques */
    var cars = e.s('g');
    e.s('rect', { x: 16, y: 12, width: 300, height: 118, rx: 10, fill: 'var(--scene)', 'fill-opacity': 0.85, stroke: 'var(--scene-line)' }, cars);
    var cT = [];
    ['Point d’application', 'Direction', 'Sens', 'Intensité'].forEach(function (k, j) {
      e.s('text', { x: 28, y: 38 + j * 26, 'font-size': 13, fill: 'var(--scene-muted)', text: k }, cars);
      cT.push(e.s('text', { x: 304, y: 38 + j * 26, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: 'var(--scene-text)' }, cars));
    });

    var roF = e.readout({ label: 'Lecture du dynamomètre' }), roL = e.readout({ label: 'Longueur du vecteur' });

    function draw() {
      var a = th * D2R, c = Math.cos(a), s = Math.sin(a), ext = PXN * F;
      // le tube et la main s'éloignent quand le ressort s'allonge
      tube.setAttribute('transform', 'translate(' + (ROD - 130 + ext) + ' 0)');
      hand.setAttribute('transform', 'translate(' + (ROD - 130 + ext) + ' 0)');
      dyn.setAttribute('transform', 'translate(' + Ax + ' ' + Ay + ') rotate(' + (-th) + ')');
      var far = 360;
      act.setAttribute('x1', Ax - c * 60); act.setAttribute('y1', Ay + s * 60); act.setAttribute('x2', Ax + c * far); act.setAttribute('y2', Ay - s * far);
      actT.setAttribute('x', Ax + c * 215 + 8); actT.setAttribute('y', Ay - s * 215 + 24); actT.style.opacity = th > 4 ? 1 : 0;
      arc.setAttribute('d', th > 0 ? 'M' + (Ax + 70) + ' ' + Ay + 'A70 70 0 0 0 ' + (Ax + 70 * c) + ' ' + (Ay - 70 * s) : '');
      arcT.setAttribute('x', Ax + 80 * Math.cos(a / 2) + 4); arcT.setAttribute('y', Ay - 80 * Math.sin(a / 2) + 6); arcT.textContent = th > 0 ? th + '°' : '';
      cT[0].textContent = 'A (le crochet)';
      cT[1].textContent = th === 0 ? 'horizontale' : 'oblique, ' + th + '° vers le haut';
      cT[2].textContent = F > 0 ? 'de A vers la main' : '—';
      cT[3].textContent = e.fmt(F, 1) + ' N';
      roF.set(e.fmt(F, 1) + ' N');
      var L = F / ech; roL.set(show ? e.fmt(L, 1) + ' cm' : '? cm');
      echT.textContent = 'Échelle : 1 cm ↔ ' + ech + ' N';
      var x1 = OX + L * CM * c, y1 = OY - L * CM * s;
      vec.setAttribute('d', show ? arrowPath(OX, OY, x1, y1, 2.2, 7, 13) : '');
      vecT.setAttribute('x', x1 + 6); vecT.setAttribute('y', y1 - 4);
      vecT.textContent = show && F > 0 ? 'F = ' + e.fmt(F, 1) + ' N' : '';
      if (show && x1 > IX + IW - 70) { vecT.setAttribute('x', x1 - 6); vecT.setAttribute('text-anchor', 'end'); vecT.setAttribute('y', y1 - 12); } else vecT.setAttribute('text-anchor', 'start');
      hidT.style.opacity = show ? 0 : 1;
    }

    var sF = e.slider({ label: 'Intensité F', min: 0, max: 20, step: 0.5, value: F, unit: 'N', dec: 1, onInput: function (v) { F = v; draw(); } });
    var sT = e.slider({ label: 'Direction (angle avec l’horizontale)', min: 0, max: 45, step: 5, value: th, unit: '°', dec: 0, onInput: function (v) { th = v; draw(); } });
    var cE = e.choice({ label: 'Échelle du vecteur', value: ech, options: [{ v: 2, l: '1 cm ↔ 2 N' }, { v: 4, l: '1 cm ↔ 4 N' }, { v: 5, l: '1 cm ↔ 5 N' }], onChange: function (v) { ech = v; draw(); } });
    var tS = e.toggle({ label: 'Montrer le vecteur sur le cahier', value: true, onChange: function (v) { show = v; draw(); e.say(v ? 'Le vecteur est tracé à l’échelle sur le cahier.' : 'Calcule L = F ÷ échelle et trace le vecteur toi-même, puis vérifie.'); } });

    e.drag(grip, {
      start: function () { gripRing.style.opacity = 0; },
      move: function (p) {
        var dx = p.x - Ax, dy = Ay - p.y, ang = Math.atan2(dy, dx) / D2R, dist = Math.hypot(dx, dy);
        th = Math.max(0, Math.min(45, Math.round(ang / 5) * 5));
        F = Math.max(0, Math.min(20, Math.round((dist - (ROD - 130 + 186)) / PXN * 2) / 2));
        sF.set(F); sT.set(th); draw();
      },
      end: function () { e.say('Lis maintenant l’intensité sur le dynamomètre : ' + e.fmt(F, 1) + ' N.'); }
    });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'f', label: 'F', unit: 'N', dec: 1 }, { k: 'th', label: 'Direction', unit: '°', dec: 0 }, { k: 'e', label: 'Échelle', unit: 'N/cm', dec: 0 }, { k: 'l', label: 'L', unit: 'cm', dec: 1 }],
      onChange: function (rows) {
        [2, 4, 5].forEach(function (k) { ch.setPoints(SER[k], rows.filter(function (r) { return r.e === k; }).map(function (r) { return [r.f, r.l]; })); });
        bilan(rows);
      }
    });
    e.measure('Relever la force', function () {
      if (F === 0) { e.say('Tire d’abord sur le dynamomètre : la force est nulle.', 'warn'); return null; }
      var f = Math.round(e.noise(F, 0.012) * 2) / 2;
      return { n: tbl.rows().length + 1, f: f, th: th, e: ech, l: f / ech };
    });
    function bilan(rows) {
      var parts = [];
      [2, 4, 5].forEach(function (k) {
        var n = rows.filter(function (r) { return r.e === k; }).length;
        if (n >= 2) { var r = ch.fit(SER[k], true); parts.push('Échelle 1 cm ↔ ' + k + ' N : pente <b>' + e.fmt(r.a, 2) + ' cm/N</b> = 1 ÷ ' + k); }
      });
      e.results(parts.length ? 'Chaque série donne une droite qui passe par l’origine : <b>L est proportionnelle à F</b>.<br>' + parts.join('<br>') + '<br>Donc <b>L = F ÷ échelle</b>.' : (rows.length ? 'Relève au moins 2 forces avec la même échelle.' : ''));
    }
    ch = e.chart({ xlabel: 'Intensité F', xunit: 'N', ylabel: 'Longueur L', yunit: 'cm', xmin: 0, xmax: 20, ymin: 0, ymax: 10, xstep: 2, ystep: 2 });
    e.onReset(function () { F = 8; th = 20; ech = 2; show = true; sF.set(F); sT.set(th); cE.set(2); tS.set(true); gripRing.style.opacity = 0.8; draw(); });
    draw();
    e.say('Attrape la main (cercle orange) pour tirer sur la caisse, ou règle les curseurs.');
  }
});
