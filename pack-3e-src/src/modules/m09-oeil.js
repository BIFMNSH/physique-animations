/* L'œil et ses défauts */
Lab.register({
  id: 'oeil', theme: 'optique', title: 'L’œil, ses défauts et leur correction',
  lesson: 'Les défauts de l’œil et leurs corrections', skills: ['C1', 'C2', 'C4', 'C5'],
  objective: 'Retrouve la lentille qui corrige un œil myope ou hypermétrope.',
  alt: 'Schéma d’un œil avec cristallin, rétine et rayons, plus une lentille correctrice devant l’œil',
  thumb: '<ellipse cx="80" cy="39" rx="44" ry="28" fill="var(--glass)" stroke="var(--scene-line)" stroke-width="2"/><path d="M56 39c6-12 6-12 0-24M56 39c6 12 6 12 0 24" fill="none"/><ellipse cx="62" cy="39" rx="5" ry="14" fill="var(--s1)"/><circle cx="108" cy="39" r="4" fill="var(--s2)"/>',
  height: 420,
  hint: 'Choisis un œil, règle la distance de l’objet, puis cherche la correction.',
  steps: [
    'Choisis un type d’œil : normal, myope ou hypermétrope.',
    'Règle la distance de l’objet et l’accommodation (ou « Accommoder au mieux »).',
    'Ajoute une lentille correctrice et cherche celle qui rend l’image nette à l’infini.',
    'Relève tes essais dans le tableau.'
  ],
  retiens: [
    'L’œil se comporte comme une lentille convergente (le cristallin) qui forme l’image sur la <b>rétine</b>. Pour voir net de près, il <b>accommode</b> : sa vergence augmente.',
    'Œil <b>myope</b> : trop convergent, l’image se forme <b>devant</b> la rétine ; il voit mal de loin. On le corrige avec une lentille <b>divergente</b>.',
    'Œil <b>hypermétrope</b> : pas assez convergent, l’image se forme <b>derrière</b> la rétine ; il voit mal de près. On le corrige avec une lentille <b>convergente</b>.',
    'Les vergences s’additionnent : C(total) = C(œil) + C(lentille).'
  ],
  quiz: [
    { q: 'Où se forme l’image d’un objet lointain dans un œil myope non corrigé ?', o: ['Sur la rétine', 'Devant la rétine', 'Derrière la rétine', 'Dans le cristallin'], a: 1, e: 'L’œil myope est trop convergent.' },
    { q: 'Quelle lentille corrige la myopie ?', o: ['Convergente', 'Divergente', 'Plane', 'Aucune, un simple filtre'], a: 1, e: 'Une lentille divergente diminue la vergence totale.' },
    { q: 'L’hypermétropie se corrige avec une lentille :', o: ['divergente', 'convergente', 'cylindrique', 'colorée'], a: 1, e: 'Elle ajoute de la vergence à l’œil.' },
    { q: 'Que fait le cristallin pour voir un objet proche ?', o: ['Il s’aplatit', 'Il devient plus bombé (vergence plus grande)', 'Il se déplace vers la rétine', 'Rien'], a: 1, e: 'C’est l’accommodation.' },
    { q: 'Un œil myope a besoin d’une correction de −4 δ. La lentille a une distance focale de :', o: ['+25 cm', '−25 cm', '−4 cm', '+4 cm'], a: 1, e: 'f = 1/C = 1/(−4) = −0,25 m = −25 cm : lentille divergente.' }
  ],
  build: function (c) {
    var E = 0.017;   // longueur de l'œil : 17 mm
    var C0 = 1 / E;  // vergence d'un œil normal au repos : 58,8 δ
    var TYPES = { normal: { n: 'œil normal', d: 0 }, myope: { n: 'œil myope', d: 4 }, hyper: { n: 'œil hypermétrope', d: -2 } };
    var type = c.choice('Type d’œil', [{ v: 'normal', label: 'Normal' }, { v: 'myope', label: 'Myope' }, { v: 'hyper', label: 'Hypermétrope' }], null, 'normal');
    var dist = c.slider('Distance de l’objet', { min: 0.1, max: 10, step: 0.05, value: 10, unit: 'm' });
    var acc = c.slider('Accommodation', { min: 0, max: 4, step: 0.25, value: 0, unit: 'δ' });
    var cor = c.slider('Lentille correctrice', { min: -8, max: 8, step: 0.5, value: 0, unit: 'δ' });
    function Crest() { return C0 + TYPES[type.get()].d; }
    function Ctot() { return Crest() + acc.get() + cor.get(); }
    function need() { return C0 + 1 / dist.get(); }
    function delta() { return Ctot() - need(); }   // >0 : trop convergent (image devant)
    function etat() { var d = delta(); return Math.abs(d) < 0.3 ? 'nette' : (d > 0 ? 'floue (image devant la rétine)' : 'floue (image derrière la rétine)'); }
    c.button('Accommoder au mieux', function () { var a = need() - Crest() - cor.get(); acc.set(Math.max(0, Math.min(4, Math.round(a * 4) / 4))); }, { into: 'ctrl' });
    c.s('rect', { x: 10, y: 10, width: 780, height: 400, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    var defs = c.s('defs'); var fil = c.s('filter', { id: 'blur', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); var gb = c.s('feGaussianBlur', { stdDeviation: 0 }, fil);
    var LX = 330, PX = 330 + 170, CY = 210;
    c.s('ellipse', { cx: 430, cy: CY, rx: 135, ry: 108, fill: 'var(--glass)', 'fill-opacity': .3, stroke: 'var(--scene-line)', 'stroke-width': 3 });
    c.s('path', { d: 'M' + PX + ' ' + (CY - 70) + 'Q' + (PX + 14) + ' ' + CY + ' ' + PX + ' ' + (CY + 70), stroke: 'var(--s5)', 'stroke-width': 6, fill: 'none' });
    c.s('text', { x: PX + 18, y: CY - 76, 'font-size': 13, text: 'rétine' });
    c.s('text', { x: LX - 36, y: CY - 92, 'font-size': 13, text: 'cristallin' });
    c.s('line', { x1: 20, x2: 770, y1: CY, y2: CY, stroke: 'var(--scene-muted)', 'stroke-dasharray': '3 5' });
    var cry = c.s('ellipse', { cx: LX, cy: CY, rx: 10, ry: 48, fill: 'var(--s1)', 'fill-opacity': .55, stroke: 'var(--s1)', 'stroke-width': 2 });
    var cl = c.s('path', { fill: 'var(--s3)', 'fill-opacity': .45, stroke: 'var(--s3)', 'stroke-width': 2 }); var clt = c.s('text', { x: 255, y: CY + 82, 'font-size': 13, 'text-anchor': 'middle' });
    var rays = c.s('g'); var objt = c.s('text', { x: 60, y: CY + 22, 'font-size': 14, 'text-anchor': 'middle' });
    c.s('path', { d: 'M60 ' + CY + 'V' + (CY - 40), stroke: 'var(--s2)', 'stroke-width': 5 }); c.s('path', { d: 'M53 ' + (CY - 30) + 'L60 ' + (CY - 44) + 'L67 ' + (CY - 30) + 'Z', fill: 'var(--s2)' });
    var info = c.s('text', { x: 400, y: 40, 'font-size': 16, 'font-weight': 700, 'text-anchor': 'middle' });
    var viewG = c.s('g', { transform: 'translate(640 270)' }); c.s('rect', { x: 0, y: 0, width: 130, height: 110, rx: 8, fill: 'var(--scene)', stroke: 'var(--scene-line)' }, viewG);
    var viewT = c.s('text', { x: 65, y: 70, 'font-size': 42, 'font-weight': 700, 'text-anchor': 'middle', text: 'LIRE', filter: 'url(#blur)' }, viewG); viewT.style.fill = 'var(--scene-text)';
    c.s('text', { x: 65, y: 100, 'font-size': 12, 'text-anchor': 'middle', text: 'ce que voit l’œil' }, viewG).style.fill = 'var(--scene-muted)';
        c.onUpdate(function () {
      rays.innerHTML = ''; var ct = Ctot(), d = delta(), v = 1 / (ct - 1 / dist.get()); // m
      var vpx = Math.max(60, Math.min(260, v * 10000));   // 10 px par mm
      var fx = LX + vpx, ap = 46, src = LX - Math.min(250, 30 + 55 * dist.get());
      [-ap, ap].forEach(function (a) {
        var par = dist.get() >= 5;
        c.s('line', { x1: par ? 70 : src, y1: par ? CY + a : CY, x2: LX, y2: CY + a, stroke: 'var(--s2)', 'stroke-width': 2 }, rays);
        var sl = (CY - (CY + a)) / (fx - LX), xe = Math.min(PX + 20, fx + 30);
        c.s('line', { x1: LX, y1: CY + a, x2: PX, y2: CY + a + sl * (PX - LX), stroke: 'var(--s2)', 'stroke-width': 2 }, rays);
      });
      c.s('circle', { cx: Math.min(fx, 700), cy: CY, r: 4, fill: 'var(--s2)' }, rays);
      cry.setAttribute('rx', Math.max(6, Math.min(26, 10 + (ct - C0) * 1.6)));
      var kc = cor.get();
      if (kc > 0.1) cl.setAttribute('d', 'M255 ' + (CY - 56) + 'Q' + (255 + 8 + kc * 2) + ' ' + CY + ' 255 ' + (CY + 56) + 'Q' + (255 - 8 - kc * 2) + ' ' + CY + ' 255 ' + (CY - 56) + 'Z');
      else if (kc < -0.1) cl.setAttribute('d', 'M' + (240 - Math.abs(kc)) + ' ' + (CY - 56) + 'Q255 ' + (CY - 20) + ' ' + (270 + Math.abs(kc)) + ' ' + (CY - 56) + 'V' + (CY + 56) + 'Q255 ' + (CY + 20) + ' ' + (240 - Math.abs(kc)) + ' ' + (CY + 56) + 'Z');
      else cl.setAttribute('d', '');
      clt.textContent = kc > 0.1 ? 'lentille convergente' : (kc < -0.1 ? 'lentille divergente' : '');
      var blur = Math.min(8, Math.abs(d) * 1.2); gb.setAttribute('stdDeviation', Math.abs(d) < 0.3 ? 0 : blur);
      objt.textContent = c.fmt(dist.get(), 2) + ' m';
      info.textContent = 'Image ' + etat();
      info.style.fill = Math.abs(d) < 0.3 ? 'var(--ok)' : 'var(--bad)';
    });
    c.readout('C de l’œil', function () { return Crest() + acc.get(); }, 'δ', 1);
    c.readout('C total (avec lentille)', function () { return Ctot(); }, 'δ', 1);
    c.readout('C nécessaire pour voir net', function () { return need(); }, 'δ', 1);
    c.readout('Écart', function () { return delta(); }, 'δ', 2);
    c.table({ cols: [{ key: 'o', label: 'œil', txt: true }, { key: 'd', label: 'objet', unit: 'm', d: 2 }, { key: 'a', label: 'accomm.', unit: 'δ', d: 2 }, { key: 'k', label: 'lentille', unit: 'δ', d: 1 }, { key: 'e', label: 'image', txt: true }], max: 12, onChange: bilan });
    c.measure('Relever cet essai', function () { return { t: type.get(), o: TYPES[type.get()].n, d: dist.get(), a: acc.get(), k: cor.get(), e: etat().split(' (')[0], far: dist.get() >= 5 }; });
    function bilan(rows) {
      var m = rows.filter(function (r) { return r.t === 'myope' && r.far && r.e === 'nette' && r.a === 0; }), h = rows.filter(function (r) { return r.t === 'hyper' && r.far && r.e === 'nette' && r.a === 0; });
      var msg = '';
      if (m.length) msg += 'Œil myope, vision de loin sans accommoder : correction ≈ ' + c.fmt(m[0].k, 1) + ' δ (lentille <b>divergente</b>, f = ' + c.fmt(100 / m[0].k, 0) + ' cm). ';
      if (h.length) msg += 'Œil hypermétrope, vision de loin sans accommoder : correction ≈ +' + c.fmt(h[0].k, 1) + ' δ (lentille <b>convergente</b>, f = ' + c.fmt(100 / h[0].k, 0) + ' cm).';
      c.results(msg || (rows.length ? 'Cherche une correction qui donne une image nette à l’infini (objet à 10 m), sans accommoder (0 δ).' : ''));
    }
  }
});
