/* Les lentilles convergentes : banc d'optique */
Lab.register({
  id: 'lentilles', theme: 'optique', title: 'Banc d’optique : lentille convergente',
  lesson: 'Les lentilles', skills: ['C1', 'C2', 'C4'],
  objective: 'Prévois la position et la nature de l’image, puis trouve la relation entre OA, OA′ et f.',
  alt: 'Lentille convergente sur un axe avec un objet fléché, trois rayons lumineux et l’image formée',
  thumb: '<path d="M80 8c-10 20-10 44 0 62c10-18 10-42 0-62z" fill="var(--glass)" stroke="var(--scene-line)" stroke-width="2"/><path d="M12 39H148" stroke="var(--scene-line)"/><path d="M34 39V23" stroke="var(--s2)" stroke-width="4"/><path d="M120 39v14" stroke="var(--s1)" stroke-width="4"/><path d="M34 23L80 23L120 53M34 23L120 53" stroke="var(--s2)" fill="none"/>',
  height: 420,
  hint: 'Déplace l’objet (glisse-le ou utilise le curseur) et change la lentille.',
  steps: [
    'Choisis la distance focale f de la lentille.',
    'Règle la distance OA de l’objet (ou glisse la flèche orange).',
    'Observe les trois rayons et l’image : réelle ou virtuelle ? droite ou renversée ?',
    'Relève plusieurs positions : le graphique de 1/OA′ en fonction de 1/OA est une droite.'
  ],
  retiens: [
    'Une lentille <b>convergente</b> fait converger un faisceau parallèle en son <b>foyer image F′</b>. La distance OF′ = <b>f</b> est la distance focale ; la vergence est <b>C = 1/f</b> (en dioptries δ, f en m).',
    'Trois rayons utiles : parallèle à l’axe → passe par F′ ; passe par O → non dévié ; passe par F → ressort parallèle.',
    'Si OA > f : image <b>réelle</b>, renversée (visible sur un écran). Si OA < f : image <b>virtuelle</b>, droite et agrandie (loupe).',
    'Relation : <b>1/OA′ − 1/OA = 1/f</b> (OA négatif). Grandissement γ = A′B′/AB = OA′/OA.'
  ],
  quiz: [
    { q: 'Où convergent des rayons parallèles à l’axe après une lentille convergente ?', o: ['En O, centre optique', 'Au foyer image F′', 'À l’infini', 'Au foyer objet F'], a: 1, e: 'Par définition du foyer image.' },
    { q: 'Une lentille a une distance focale de 20 cm. Sa vergence vaut :', o: ['0,2 δ', '5 δ', '20 δ', '50 δ'], a: 1, e: 'C = 1/f = 1/0,20 = 5 δ.' },
    { q: 'L’objet est placé entre F et O. L’image est :', o: ['réelle et renversée', 'virtuelle, droite et agrandie', 'réelle et droite', 'inexistante'], a: 1, e: 'C’est le principe de la loupe.' },
    { q: 'Un objet est à 30 cm d’une lentille de f = 10 cm. Où est l’image ?', o: ['à 15 cm, côté opposé', 'à 30 cm', 'à 10 cm', 'à 7,5 cm'], a: 0, e: '1/OA′ = 1/10 − 1/30 = 2/30 → OA′ = 15 cm.' },
    { q: 'Que peut-on recueillir sur un écran ?', o: ['Une image virtuelle', 'Une image réelle', 'Les deux', 'Aucune'], a: 1, e: 'Une image réelle se forme réellement sur l’écran.' }
  ],
  build: function (c) {
    var S = 4, LX = 300, AY = 210, HOB = 6;   // 4 px/cm, lentille en x = 300, objet de 6 cm
    var fch = c.choice('Distance focale f', [{ v: 5, label: '5 cm' }, { v: 10, label: '10 cm' }, { v: 15, label: '15 cm' }, { v: 20, label: '20 cm' }], null, 10);
    var oa = c.slider('Distance objet–lentille OA', { min: 6, max: 60, step: 1, value: 30, unit: 'cm' });
    function f() { return fch.get(); }
    function img() {
      var d = oa.get(), ff = f(); if (Math.abs(d - ff) < 0.6) return { inf: true };
      var dp = d * ff / (d - ff); return { dp: dp, gam: dp / -d * -1 * -1, real: dp > 0, g: -ff / (d - ff) };
    }
    c.s('rect', { x: 10, y: 10, width: 780, height: 400, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    c.s('line', { x1: 10, x2: 790, y1: AY, y2: AY, stroke: 'var(--scene-muted)' });
    for (var cm = -70; cm <= 110; cm += 10) { var tx = LX + cm * S; if (tx > 14 && tx < 786) { c.s('line', { x1: tx, x2: tx, y1: AY - 4, y2: AY + 4, stroke: 'var(--scene-muted)' }); if (cm % 20 === 0 && cm) c.s('text', { x: tx, y: AY + 20, 'font-size': 11, 'text-anchor': 'middle', text: String(cm) }).style.fill = 'var(--scene-muted)'; } }
    c.s('path', { d: 'M300 30c-18 50-18 330 0 360c18-30 18-310 0-360z', fill: 'var(--glass)', 'fill-opacity': .55, stroke: 'var(--scene-line)', 'stroke-width': 2 });
    var gl = c.s('g');
    var cdef = c.s('defs'); var cp = c.s('clipPath', { id: 'lclip' }, cdef); c.s('rect', { x: 12, y: 12, width: 776, height: 396 }, cp);
    var rays = c.s('g', { 'clip-path': 'url(#lclip)' }); var lbl = c.s('g');
    var obj = c.s('path', { stroke: 'var(--s2)', 'stroke-width': 5, fill: 'none' }); var objH = c.s('path', { fill: 'var(--s2)' });
    var objHit = c.s('rect', { y: AY - 80, width: 40, height: 80, fill: '#000', 'fill-opacity': 0 });
    var im = c.s('path', { stroke: 'var(--s1)', 'stroke-width': 5, fill: 'none' }); var imH = c.s('path', { fill: 'var(--s1)' });
    var imt = c.s('text', { 'font-size': 14, 'font-weight': 700, 'text-anchor': 'middle' }); imt.style.fill = 'var(--s1)';
    var ff1 = c.s('text', { 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle' }), ff2 = c.s('text', { 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle' }), oo = c.s('text', { 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', text: 'O' });
    var st = c.s('text', { x: 400, y: 36, 'font-size': 15, 'font-weight': 700, 'text-anchor': 'middle' });
    var drag = c.drag(objHit, { move: function (x) { oa.set(Math.max(6, Math.min(60, Math.round((LX - x) / S)))); } });
    function vline(el, hx, hy, dash) { }
    function line(x1, y1, x2, y2, col, dash) { var l = c.s('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: col, 'stroke-width': 2, 'stroke-dasharray': dash || '' }, rays); return l; }
    c.onUpdate(function () {
      rays.innerHTML = ''; var d = oa.get(), ff = f(), r = img(), ox = LX - d * S, hy = HOB * S;
      obj.setAttribute('d', 'M' + ox + ' ' + AY + 'V' + (AY - hy)); objH.setAttribute('d', 'M' + (ox - 7) + ' ' + (AY - hy + 10) + 'L' + ox + ' ' + (AY - hy - 2) + 'L' + (ox + 7) + ' ' + (AY - hy + 10) + 'Z');
      objHit.setAttribute('x', ox - 20);
      ff1.setAttribute('x', LX - ff * S); ff1.setAttribute('y', AY + 36); ff1.textContent = 'F'; ff2.setAttribute('x', LX + ff * S); ff2.setAttribute('y', AY + 36); ff2.textContent = 'F′'; oo.setAttribute('x', LX); oo.setAttribute('y', AY + 36);
      [LX - ff * S, LX + ff * S].forEach(function (x) { c.s('circle', { cx: x, cy: AY, r: 4, fill: 'var(--scene-text)' }, rays); });
      var col = 'var(--s2)', ytop = AY - hy, R = 790;
      var slope1 = hy / (ff * S);   // rayon 1 : de (LX, ytop) vers F'
      line(ox, ytop, LX, ytop, col); line(LX, ytop, R, ytop + slope1 * (R - LX), col);
      var s2 = (AY - ytop) / (LX - ox); line(ox, ytop, R, ytop + s2 * (R - ox), col);
      var y3 = AY - hy * ff / (ff - d) * -1; var yc = AY - (hy * ff / (ff - d)); y3 = AY + (-hy * ff / (ff - d)) * -1;
      var yy3 = AY - hy * ff / (ff - d);   // hauteur du rayon 3 sur la lentille (écran)
      if (Math.abs(yy3 - AY) < 180 && d !== ff) { line(ox, ytop, LX, yy3, col); line(LX, yy3, R, yy3, col); }
      if (r.inf) { im.setAttribute('d', ''); imH.setAttribute('d', ''); imt.textContent = ''; st.textContent = 'OA = f : les rayons ressortent parallèles, l’image est rejetée à l’infini.'; }
      else {
        var ix = LX + r.dp * S, ih = r.g * hy * -1;   // g<0 : renversée -> pointe vers le bas
        var iy = AY - r.g * hy * -1 * -1; iy = AY - (r.g * HOB * S);
        var vis = Math.abs(ix) < 780 && ix > 20 && Math.abs(iy - AY) < 195;
        if (!vis) { im.setAttribute('d', ''); imH.setAttribute('d', ''); imt.textContent = ''; st.textContent = 'Image trop loin ou trop grande pour être dessinée (OA′ = ' + c.fmt(r.dp, 0) + ' cm).'; }
        else {
          var dash = r.real ? '' : '5 4';
          im.setAttribute('d', 'M' + ix + ' ' + AY + 'V' + iy); im.setAttribute('stroke-dasharray', dash);
          var dirn = iy < AY ? 1 : -1;
          imH.setAttribute('d', 'M' + (ix - 7) + ' ' + (iy + dirn * 10) + 'L' + ix + ' ' + (iy - dirn * 2) + 'L' + (ix + 7) + ' ' + (iy + dirn * 10) + 'Z');
          imt.setAttribute('x', ix); imt.setAttribute('y', iy < AY ? iy - 10 : iy + 18); imt.textContent = 'A′B′';
          if (!r.real) { line(LX, ytop, ix, iy, 'var(--s2)', '5 4'); line(ox, ytop, ix, iy, 'var(--s2)', '5 4'); line(LX, iy, ix, iy, 'var(--s2)', '5 4'); }
          st.textContent = 'Image ' + (r.real ? 'réelle' : 'virtuelle') + ', ' + (r.g < 0 ? 'renversée' : 'droite') + ', ' + (Math.abs(r.g) > 1.02 ? 'agrandie' : (Math.abs(r.g) < 0.98 ? 'réduite' : 'de même taille'));
        }
      }
    });
    c.readout('OA', function () { return oa.get(); }, 'cm', 0);
    c.readout('OA′', function () { var r = img(); return r.inf ? '∞' : r.dp; }, 'cm', 1);
    c.readout('Grandissement γ', function () { var r = img(); return r.inf ? '∞' : r.g; }, '', 2);
    c.readout('Vergence C', function () { return 100 / f(); }, 'δ', 1);
    var cols = { 5: 'var(--s1)', 10: 'var(--s3)', 15: 'var(--s4)', 20: 'var(--s5)' };
    var ch = c.chart({ x: { label: '1/OA', unit: 'δ', min: 0, max: 20 }, y: { label: '1/OA′', unit: 'δ', min: -12, max: 22 }, fit: 'line', series: [5, 10, 15, 20].map(function (k) { return { id: 'f' + k, name: 'f = ' + k + ' cm', color: cols[k] }; }) });
    c.table({ cols: [{ key: 'f', label: 'f', unit: 'cm', d: 0 }, { key: 'oa', label: 'OA', unit: 'cm', d: 0 }, { key: 'op', label: 'OA′', unit: 'cm', d: 1 }, { key: 'g', label: 'γ', d: 2 }, { key: 'n', label: 'image', txt: true }], max: 14, onChange: bilan });
    c.measure('Relever cette position', function () {
      var r = img(); if (r.inf) { c.say('Cette position envoie l’image à l’infini : choisis-en une autre.', 'warn'); return null; }
      return { f: f(), oa: oa.get(), op: c.noise(r.dp, 0.004), g: r.g, n: (r.real ? 'réelle' : 'virtuelle') + ', ' + (r.g < 0 ? 'renversée' : 'droite') };
    });
    function bilan(rows) {
      [5, 10, 15, 20].forEach(function (k) { ch.setPoints(rows.filter(function (r) { return r.f === k; }).map(function (r) { return [100 / r.oa, 100 / r.op]; }), 'f' + k); });
      var ks = [5, 10, 15, 20].filter(function (k) { return ch.count('f' + k) >= 3; });
      if (ks.length) { var k = ks[0], fit = ch.fit('f' + k); c.results('<b>Conclusion :</b> pour f = ' + k + ' cm, la droite a une pente ≈ ' + c.fmt(fit.a, 2) + ' et une ordonnée à l’origine ≈ ' + c.fmt(fit.b, 1) + ' δ = 1/f (=' + c.fmt(100 / k, 1) + ' δ) : <b>1/OA′ = 1/f − 1/OA</b> (OA en valeur absolue).'); }
      else c.results(rows.length ? 'Relève au moins 3 positions pour une même lentille.' : '');
    }
  }
});
