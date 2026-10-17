/* 3e · Image d'un objet donnée par une lentille convergente (banc d'optique) */
Sim.register('lentille-image', {
  objective: 'Former sur un écran l’image nette d’un objet lumineux avec une lentille convergente, décrire cette image et retrouver la distance focale.',
  alt: 'Banc d’optique gradué avec un objet lumineux, une lentille convergente, ses foyers, un écran déplaçable, les rayons lumineux et l’aspect de l’image sur l’écran',
  chart: true,
  steps: [
    'Choisis la lentille (distance focale f) et la distance objet-lentille OA.',
    'Déplace l’écran (glisse-le ou utilise le curseur) jusqu’à ce que l’image soit la plus nette possible, puis relève OA et OA′.',
    'Recommence pour au moins 4 positions de l’objet. Décris l’image : droite ou renversée ? plus grande ou plus petite ?',
    'Rapproche l’objet à moins de f de la lentille : obtiens-tu encore une image sur l’écran ?'
  ],
  retiens: [
    'Une lentille <b>convergente</b> (bords minces) fait converger les rayons parallèles à l’axe en un point : le <b>foyer image F′</b>. La distance OF′ est la <b>distance focale f</b>.',
    'Sa <b>vergence</b> est <b>C = 1 / f</b> (C en dioptries δ, f en mètres). Exemple : f = 20 cm = 0,20 m donne C = 5 δ.',
    'Si l’objet est au-delà du foyer, la lentille donne sur un écran une <b>image réelle et renversée</b>. Plus l’objet se rapproche du foyer, plus l’image est grande et lointaine.',
    'Si l’objet est entre le foyer et la lentille, il n’y a pas d’image sur l’écran : en regardant à travers la lentille, on voit une image droite et agrandie (c’est une <b>loupe</b>).'
  ],
  quiz: [
    { q: 'Une lentille convergente a une distance focale de 25 cm. Sa vergence vaut :', o: ['25 δ', '4 δ', '0,25 δ', '2,5 δ'], a: 1, e: 'C = 1 / f = 1 / 0,25 m = 4 δ.' },
    { q: 'Un objet placé loin d’une lentille convergente donne sur l’écran une image :', o: ['droite et agrandie', 'renversée', 'toujours de même taille', 'virtuelle'], a: 1, e: 'L’image réelle obtenue sur un écran est renversée.' },
    { q: 'Où passe un rayon qui arrive parallèlement à l’axe optique ?', o: ['Par le centre optique O', 'Par le foyer image F′', 'Il ne dévie pas', 'Par le foyer objet F'], a: 1, e: 'Après la lentille, il passe par le foyer image F′.' },
    { q: 'L’objet est placé à 5 cm d’une lentille de focale 10 cm. Sur l’écran :', o: ['on voit une image nette renversée', 'on ne peut pas obtenir d’image', 'on voit une image droite', 'on voit l’image au foyer'], a: 1, e: 'L’objet est entre F et O : la lentille fonctionne comme une loupe, l’image n’est pas sur l’écran.' },
    { q: 'Un rayon qui passe par le centre optique O d’une lentille :', o: ['est dévié vers le foyer', 'n’est pas dévié', 'est réfléchi', 'devient parallèle à l’axe'], a: 1, e: 'Un rayon passant par le centre optique traverse la lentille sans être dévié.' }
  ],
  build: function (e) {
    var W = e.W, Y0 = 186, OX = 290, PX = 5, VY = 12, AB = 3;    // 5 px/cm horizontalement, 12 px/cm verticalement (hauteurs)
    var f = 10, OA = 30, xs = 40, rays = true, ghost = false, tbl, ch, SER = { 10: 0, 15: 1, 20: 2 };
    function imgDist() { return OA > f + 0.01 ? 1 / (1 / f - 1 / OA) : null; }

    var defs = e.s('defs');
    var blurF = e.s('filter', { id: 'liBlur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    var blurE = e.s('feGaussianBlur', { stdDeviation: 0 }, blurF);
    var cp = e.s('clipPath', { id: 'liClip' }, defs); e.s('rect', { x: 14, y: 40, width: 772, height: 292 }, cp);
    var cp2 = e.s('clipPath', { id: 'liClip2' }, defs); e.s('rect', { x: 624, y: 16, width: 160, height: 118, rx: 8 }, cp2);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    /* banc gradué */
    e.s('rect', { x: 14, y: 316, width: 772, height: 14, rx: 4, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    for (var c = -50; c <= 100; c += 5) { var gx = OX + c * PX, big = c % 10 === 0; if (gx < 16 || gx > 784) continue; e.s('line', { x1: gx, x2: gx, y1: 316, y2: big ? 326 : 321, stroke: 'var(--scene-muted)', 'stroke-width': 1 }); if (big && c % 20 === 0) e.s('text', { x: gx, y: 346, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--scene-muted)', text: c + ' cm' }); }
    e.s('line', { x1: 14, x2: 786, y1: Y0, y2: Y0, stroke: 'var(--scene-muted)', 'stroke-width': 1.2, 'stroke-dasharray': '10 4 2 4' });
    var rayG = e.s('g', { 'clip-path': 'url(#liClip)' });
    /* lentille */
    e.s('path', { d: 'M' + OX + ' ' + (Y0 - 100) + 'Q' + (OX + 22) + ' ' + Y0 + ' ' + OX + ' ' + (Y0 + 100) + 'Q' + (OX - 22) + ' ' + Y0 + ' ' + OX + ' ' + (Y0 - 100) + 'Z', fill: 'var(--s1)', 'fill-opacity': 0.22, stroke: 'var(--s1)', 'stroke-width': 2 });
    e.s('line', { x1: OX, x2: OX, y1: Y0 + 100, y2: 316, stroke: 'var(--scene-muted)', 'stroke-width': 3 });
    e.s('text', { x: OX + 6, y: Y0 + 18, 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-text)', text: 'O' });
    var fF = e.s('g'), fF2 = e.s('g');
    [fF, fF2].forEach(function (g, j) { e.s('circle', { cx: 0, cy: Y0, r: 4, fill: 'var(--s4)' }, g); e.s('text', { x: 0, y: Y0 + 20, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--s4)', text: j ? 'F′' : 'F' }, g); });
    /* objet lumineux */
    var obj = e.s('g');
    e.s('rect', { x: -26, y: Y0 - 50, width: 18, height: 100, rx: 4, fill: 'var(--scene2)', stroke: 'var(--scene-muted)' }, obj);
    e.s('line', { x1: 0, x2: 0, y1: Y0, y2: Y0 - AB * VY, stroke: 'var(--warn)', 'stroke-width': 4 }, obj);
    e.s('path', { d: 'M-7 ' + (Y0 - AB * VY + 10) + 'L0 ' + (Y0 - AB * VY) + 'L7 ' + (Y0 - AB * VY + 10) + 'Z', fill: 'var(--warn)' }, obj);
    e.s('text', { x: -4, y: Y0 + 18, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--warn)', text: 'A' }, obj);
    e.s('text', { x: 8, y: Y0 - AB * VY, 'font-size': 13, 'font-weight': 800, fill: 'var(--warn)', text: 'B' }, obj);
    e.s('line', { x1: -17, x2: -17, y1: Y0 + 50, y2: 316, stroke: 'var(--scene-muted)', 'stroke-width': 3 }, obj);
    var objHit = e.s('rect', { x: -34, y: Y0 - 60, width: 52, height: 180, fill: 'transparent' }, obj);
    /* image fantôme */
    var gImg = e.s('g', { opacity: 0 });
    var gLine = e.s('line', { stroke: 'var(--warn)', 'stroke-width': 3, 'stroke-dasharray': '5 4' }, gImg);
    var gT = e.s('text', { 'font-size': 13, 'font-weight': 800, fill: 'var(--warn)' }, gImg);
    /* écran */
    var scr = e.s('g');
    e.s('rect', { x: -4, y: Y0 - 120, width: 8, height: 240, rx: 2, fill: 'var(--scene-text)', opacity: 0.85 }, scr);
    e.s('line', { x1: 0, x2: 0, y1: Y0 + 120, y2: 316, stroke: 'var(--scene-muted)', 'stroke-width': 3 }, scr);
    var spot = e.s('rect', { x: -3, width: 6, fill: 'var(--warn)' }, scr);
    var scrHit = e.s('rect', { x: -24, y: Y0 - 124, width: 48, height: 250, fill: 'transparent' }, scr);
    e.s('text', { x: 0, y: Y0 - 128, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'écran' }, scr);
    /* vue de l'écran (encart) */
    e.s('rect', { x: 624, y: 16, width: 160, height: 118, rx: 8, fill: '#F6F1E6', stroke: 'var(--scene-line)' });
    var viewG = e.s('g', { 'clip-path': 'url(#liClip2)' });
    var letter = e.s('g', { filter: 'url(#liBlur)' }, viewG);
    e.s('rect', { x: -2, y: -14, width: 4, height: 28, fill: '#FF9A1F' }, letter);
    e.s('rect', { x: -2, y: -14, width: 14, height: 4, fill: '#FF9A1F' }, letter);
    e.s('rect', { x: -2, y: -2, width: 10, height: 4, fill: '#FF9A1F' }, letter);
    var glowE = e.s('circle', { r: 30, fill: '#FFC873', opacity: 0 }, viewG);
    e.s('text', { x: 704, y: 148, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'ce qu’on voit sur l’écran' });
    var nT = e.s('text', { x: 20, y: 26, 'font-size': 16, 'font-weight': 800 });
    var dT = e.s('text', { x: 20, y: 46, 'font-size': 14, fill: 'var(--scene-muted)' });
    var objLtr = e.s('text', { x: 20, y: 64, 'font-size': 13, fill: 'var(--scene-muted)', text: 'Objet : la lettre « F » éclairée (hauteur 3 cm)' });

    var roOA = e.readout({ label: 'OA (objet–lentille)' }), roOI = e.readout({ label: 'OA′ (lentille–écran)' });

    function line(x1, y1, x2, y2, col, dash) { e.s('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: col, 'stroke-width': 1.8, 'stroke-dasharray': dash || null }, rayG); }
    function extend(x1, y1, x2, y2, xEnd) { var t = (xEnd - x1) / (x2 - x1); return [xEnd, y1 + (y2 - y1) * t]; }
    function draw() {
      var ax = OX - OA * PX, bY = Y0 - AB * VY, sx = OX + xs * PX, di = imgDist();
      obj.setAttribute('transform', 'translate(' + ax + ' 0)');
      fF.setAttribute('transform', 'translate(' + (OX - f * PX) + ' 0)'); fF2.setAttribute('transform', 'translate(' + (OX + f * PX) + ' 0)');
      scr.setAttribute('transform', 'translate(' + sx + ' 0)');
      rayG.innerHTML = '';
      var col = ['var(--s2)', 'var(--s3)', 'var(--s1)'];
      if (rays) {
        // 1 : parallèle puis par F′ ; 2 : par O ; 3 : par F puis parallèle — arrêtés à l'écran s'il est derrière
        var stop = sx;
        line(ax, bY, OX, bY, col[0]); var p = extend(OX, bY, OX + f * PX, Y0, stop); line(OX, bY, p[0], p[1], col[0]);
        p = extend(ax, bY, OX, Y0, stop); line(ax, bY, p[0], p[1], col[1]);
        if (OA > f + 0.5) { var yL = Y0 + (bY - Y0) * (f) / (f - OA); var hit = extend(ax, bY, OX - f * PX, Y0, OX); line(ax, bY, OX, hit[1], col[2]); line(OX, hit[1], stop, hit[1], col[2]); }
        if (!di) { // prolongements virtuels (loupe)
          var q = extend(OX, bY, OX + f * PX, Y0, 14); line(OX, bY, q[0], q[1], col[0], '4 4');
          q = extend(ax, bY, OX, Y0, 14); line(ax, bY, q[0], q[1], col[1], '4 4');
        }
      }
      var mag = di ? di / OA : 0, ih = AB * mag;
      ghost && di ? (gImg.style.opacity = 0.9) : (gImg.style.opacity = 0);
      if (di) { var ix = OX + di * PX; gLine.setAttribute('x1', ix); gLine.setAttribute('x2', ix); gLine.setAttribute('y1', Y0); gLine.setAttribute('y2', Y0 + ih * VY); gT.setAttribute('x', ix + 6); gT.setAttribute('y', Math.min(Y0 + ih * VY, 320) - 4); gT.textContent = 'A′B′'; }
      // tache / image sur l'écran
      var spotD = di ? 4 * Math.abs(xs - di) / di : 99;          // diamètre de la tache de flou (cm), ouverture 4 cm
      var hOnScr = di ? ih * xs / di : 0;
      spot.setAttribute('y', Y0); spot.setAttribute('height', di ? Math.max(2, Math.min(118, hOnScr * VY)) : 0);
      spot.style.opacity = di ? Math.max(0.15, 1 - spotD / 3) : 0;
      // encart
      var sharp = di && spotD < 0.35;
      var s = di ? Math.min(3.4, Math.max(0.4, 1.5 * mag * xs / di)) : 1;
      letter.setAttribute('transform', 'translate(704 75) scale(' + (di ? -s : 1) + ' ' + (di ? -s : 1) + ')');
      blurE.setAttribute('stdDeviation', di ? Math.min(14, spotD * 5) : 0);
      letter.style.opacity = di ? Math.max(0.1, 1 - spotD / 6) : 0;
      glowE.setAttribute('cx', 704); glowE.setAttribute('cy', 75); glowE.setAttribute('r', di ? Math.min(60, 8 + spotD * 9) : 50); glowE.style.opacity = di ? Math.min(0.45, spotD / 6) : 0.18;
      if (!di) { nT.textContent = 'Pas d’image sur l’écran : l’objet est entre F et O'; nT.style.fill = 'var(--warn)'; dT.textContent = 'La lentille agit comme une loupe : regarde à travers elle, l’image est droite et agrandie.'; }
      else if (di > 100) { nT.textContent = 'L’image se forme trop loin, au-delà du banc'; nT.style.fill = 'var(--warn)'; dT.textContent = 'Éloigne l’objet de la lentille.'; }
      else if (sharp) { nT.textContent = '✓ Image nette sur l’écran'; nT.style.fill = 'var(--ok)'; dT.textContent = 'Image renversée, ' + (mag > 1.05 ? 'plus grande' : mag < 0.95 ? 'plus petite' : 'de même taille') + ' que l’objet (× ' + e.fmt(mag, 2) + ')'; }
      else { nT.textContent = 'Image floue : déplace l’écran'; nT.style.fill = 'var(--scene-text)'; dT.textContent = 'Cherche la position où la lettre F est la plus nette.'; }
      roOA.set(OA + ' cm'); roOI.set(e.fmt(xs, 1) + ' cm');
      return { di: di, sharp: sharp, mag: mag, spotD: spotD };
    }

    var cF = e.choice({ label: 'Lentille convergente', value: 10, options: [{ v: 10, l: 'f = 10 cm' }, { v: 15, l: 'f = 15 cm' }, { v: 20, l: 'f = 20 cm' }], onChange: function (v) { f = v; draw(); } });
    var sO = e.slider({ label: 'Distance objet–lentille OA', min: 5, max: 50, step: 1, value: OA, unit: 'cm', dec: 0, onInput: function (v) { OA = v; draw(); } });
    var sS = e.slider({ label: 'Position de l’écran OA′', min: 5, max: 98, step: 0.5, value: xs, unit: 'cm', dec: 1, onInput: function (v) { xs = v; draw(); } });
    var tR = e.toggle({ label: 'Tracer les rayons particuliers', value: true, onChange: function (v) { rays = v; draw(); } });
    var tG = e.toggle({ label: 'Montrer où se forme l’image', value: false, onChange: function (v) { ghost = v; draw(); } });
    e.drag(scrHit, { move: function (p) { xs = Math.max(5, Math.min(98, Math.round((p.x - OX) / PX * 2) / 2)); sS.set(xs); draw(); } });
    e.drag(objHit, { move: function (p) { OA = Math.max(5, Math.min(50, Math.round((OX - p.x) / PX))); sO.set(OA); draw(); } });

    tbl = e.table({
      cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'f', label: 'f', unit: 'cm', dec: 0 }, { k: 'oa', label: 'OA', unit: 'cm', dec: 0 }, { k: 'oi', label: 'OA′', unit: 'cm', dec: 1 }, { k: 'g', label: 'A′B′ ÷ AB', dec: 2 }],
      onChange: function (rows) { [10, 15, 20].forEach(function (k) { ch.setPoints(SER[k], rows.filter(function (r) { return r.f === k; }).map(function (r) { return [100 / r.oa, 100 / r.oi]; })); }); bilan(rows); }
    });
    e.measure('Relever OA et OA′', function () {
      var st = draw();
      if (!st.di) { e.say('Il n’y a pas d’image sur l’écran : éloigne l’objet au-delà du foyer F.', 'warn'); return null; }
      if (!st.sharp) { e.say('L’image n’est pas nette : déplace l’écran avant de relever.', 'warn'); return null; }
      return { n: tbl.rows().length + 1, f: f, oa: OA, oi: xs, g: xs / OA };
    });
    function bilan(rows) {
      var out = [];
      [10, 15, 20].forEach(function (k) {
        if (rows.filter(function (r) { return r.f === k; }).length >= 2) {
          var r = ch.fit(SER[k], false);
          out.push('f = ' + k + ' cm : pente ' + e.fmt(r.a, 2) + ' ≈ −1 ; ordonnée à l’origine <b>' + e.fmt(r.b, 1) + ' m⁻¹</b> ≈ 1 ÷ ' + (k / 100).toFixed(2).replace('.', ',') + ' m = <b>' + e.fmt(100 / k, 1) + ' δ</b>');
        }
      });
      e.results(out.length ? 'Les points sont alignés : <b>1/OA′ = C − 1/OA</b>, où C = 1/f est la vergence.<br>' + out.join('<br>') + '<br>L’image est toujours renversée ; elle est plus grande quand l’objet est proche du foyer.' : (rows.length ? 'Relève au moins 2 positions avec la même lentille.' : ''));
    }
    ch = e.chart({ xlabel: '1 / OA', xunit: 'm⁻¹', ylabel: '1 / OA′', yunit: 'm⁻¹', xmin: 0, xmax: 10, ymin: 0, ymax: 10, xstep: 1, ystep: 2 });
    e.onReset(function () { f = 10; OA = 30; xs = 40; rays = true; ghost = false; cF.set(10); sO.set(30); sS.set(40); tR.set(true); tG.set(false); draw(); });
    draw();
    e.say('Glisse l’écran (ou utilise le curseur) jusqu’à obtenir une image nette de la lettre F.');
  }
});
