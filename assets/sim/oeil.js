/* 3e · L'œil : accommodation, myopie, hypermétropie et correction par une lentille */
Sim.register('oeil', {
  objective: 'Comprendre comment l’œil forme une image nette sur la rétine, et choisir la lentille qui corrige un œil myope ou hypermétrope.',
  alt: 'Coupe d’un œil avec le cristallin et la rétine, des rayons venant d’un objet, une lentille correctrice devant l’œil et, en dessous, ce que voit la personne',
  chart: false,
  steps: [
    'Œil normal : rapproche puis éloigne l’objet. Observe le cristallin qui se bombe (accommodation) et la netteté de l’image.',
    'Choisis l’œil myope : les objets lointains sont-ils nets ? Jusqu’à quelle distance vois-tu net ?',
    'Cherche la vergence du verre correcteur qui rend nets les objets lointains. Est-ce une lentille convergente ou divergente ?',
    'Recommence avec l’œil hypermétrope en regardant de près (25 cm). Relève chaque essai dans le tableau.'
  ],
  retiens: [
    'L’œil fonctionne comme une <b>lentille convergente</b> (le cristallin et la cornée) qui forme une image sur un écran : la <b>rétine</b>.',
    'Pour voir net à toutes les distances, le cristallin se bombe quand l’objet se rapproche : c’est l’<b>accommodation</b>. Sa vergence augmente.',
    '<b>Œil myope</b> : trop convergent, l’image d’un objet lointain se forme <b>en avant</b> de la rétine. On le corrige avec une <b>lentille divergente</b> (vergence négative).',
    '<b>Œil hypermétrope</b> : pas assez convergent, l’image se forme <b>en arrière</b> de la rétine ; il voit mal de près. On le corrige avec une <b>lentille convergente</b> (vergence positive).'
  ],
  quiz: [
    { q: 'Dans le modèle de l’œil, la rétine joue le rôle :', o: ['de la lentille', 'de l’écran', 'du diaphragme', 'de l’objet'], a: 1, e: 'L’image se forme sur la rétine, qui joue le rôle de l’écran.' },
    { q: 'Que fait le cristallin quand on regarde un objet proche ?', o: ['Il s’aplatit', 'Il se bombe', 'Il ne change pas', 'Il s’opacifie'], a: 1, e: 'Il se bombe pour devenir plus convergent : c’est l’accommodation.' },
    { q: 'Chez un œil myope regardant au loin, l’image se forme :', o: ['sur la rétine', 'en avant de la rétine', 'en arrière de la rétine', 'sur le cristallin'], a: 1, e: 'L’œil myope est trop convergent : l’image se forme avant la rétine.' },
    { q: 'Quel verre corrige la myopie ?', o: ['Un verre convergent', 'Un verre divergent', 'Un miroir', 'Un verre teinté'], a: 1, e: 'Une lentille divergente (vergence négative) diminue la convergence de l’œil.' },
    { q: 'Une personne a des lunettes de vergence +2 δ. Elle est probablement :', o: ['myope', 'hypermétrope', 'daltonienne', 'aveugle'], a: 1, e: 'Une vergence positive indique une lentille convergente, qui corrige l’hypermétropie.' }
  ],
  build: function (e) {
    var W = e.W, Y = 196, LXc = 334, RX = 578, PXMM = (RX - LXc) / 17, EX = 8;  // EX : exagération du décalage de l'image
    var DIST = [10, 15, 20, 25, 33, 50, 75, 100, 200, 500, Infinity];
    var EYES = { n: { nm: 'normal', c0: 1000 / 17, lab: 'Œil normal' }, m: { nm: 'myope', c0: 1000 / 17 + 3, lab: 'Œil myope' }, h: { nm: 'hypermétrope', c0: 1000 / 17 - 2, lab: 'Œil hypermétrope' } };
    var eye = 'n', di = 10, Cv = 0, AMAX = 4, tbl;

    function state() {
      var d = DIST[di], inv = d === Infinity ? 0 : 100 / d, need = 1000 / 17 + inv, c0 = EYES[eye].c0;
      var A = Math.max(0, Math.min(AMAX, need - c0 - Cv)), D = need - (c0 + Cv + A);
      return { d: d, A: A, D: D, sharp: Math.abs(D) < 0.3, tot: c0 + Cv + A };
    }
    var defs = e.s('defs');
    var clip = e.s('clipPath', { id: 'oeClip' }, defs); e.s('circle', { cx: 446, cy: Y, r: 134 }, clip);
    var bl = e.s('filter', { id: 'oeBlur', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
    var blE = e.s('feGaussianBlur', { stdDeviation: 0 }, bl);
    e.s('rect', { x: 0, y: 0, width: W, height: e.H, fill: 'var(--scene)' });
    /* œil en coupe */
    e.s('circle', { cx: 446, cy: Y, r: 136, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 3 });
    e.s('path', { d: 'M318 ' + (Y - 52) + 'Q292 ' + Y + ' 318 ' + (Y + 52), fill: 'var(--s1)', 'fill-opacity': 0.18, stroke: 'var(--scene-text)', 'stroke-width': 2.5 });
    e.s('path', { d: 'M446 ' + (Y - 136) + 'A136 136 0 0 1 582 ' + Y + 'A136 136 0 0 1 446 ' + (Y + 136), fill: 'none', stroke: 'var(--bad)', 'stroke-width': 6, opacity: 0.75 });
    e.s('text', { x: 572, y: Y + 128, 'font-size': 14, 'font-weight': 800, fill: 'var(--bad)', text: 'rétine' });
    e.s('rect', { x: LXc - 6, y: Y - 70, width: 12, height: 18, fill: 'var(--scene-text)', opacity: 0.7 });
    e.s('rect', { x: LXc - 6, y: Y + 52, width: 12, height: 18, fill: 'var(--scene-text)', opacity: 0.7 });
    e.s('text', { x: LXc - 26, y: Y - 80, 'font-size': 13, fill: 'var(--scene-muted)', text: 'iris' });
    e.s('line', { x1: 230, x2: 600, y1: Y, y2: Y, stroke: 'var(--scene-muted)', 'stroke-width': 1, 'stroke-dasharray': '8 5', opacity: 0.6 });
    var rayG = e.s('g');
    var rayIn = e.s('g', { 'clip-path': 'url(#oeClip)' });
    var lens = e.s('ellipse', { cx: LXc, cy: Y, ry: 50, fill: 'var(--s1)', 'fill-opacity': 0.45, stroke: 'var(--s1)', 'stroke-width': 2.5 });
    e.s('text', { x: LXc + 24, y: Y + 76, 'font-size': 14, 'font-weight': 800, fill: 'var(--s1)', text: 'cristallin' });
    var imgDot = e.s('circle', { r: 5, fill: 'var(--warn)' });
    var blurSeg = e.s('line', { stroke: 'var(--warn)', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 });
    var imgT = e.s('text', { x: 446, y: Y + 158, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800 });
    /* objet + verre correcteur */
    var obj = e.s('g');
    var objPost = e.s('line', { stroke: 'var(--scene-muted)', 'stroke-width': 3 }, obj);
    var objCard = e.s('rect', { fill: 'var(--warn)', rx: 3 }, obj);
    var objTxt = e.s('text', { 'text-anchor': 'middle', 'font-weight': 800, fill: '#2A1A00', text: 'A' }, obj);
    var dT = e.s('text', { x: 24, y: 36, 'font-size': 18, 'font-weight': 800, fill: 'var(--scene-text)' });
    var eyeT = e.s('text', { x: 24, y: 60, 'font-size': 14, fill: 'var(--scene-muted)' });
    var glass = e.s('path', { fill: 'var(--s3)', 'fill-opacity': 0.35, stroke: 'var(--s3)', 'stroke-width': 2.5 });
    var glassT = e.s('text', { x: 262, y: Y + 88, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: 'var(--s3)' });
    /* jauge d'accommodation */
    e.s('text', { x: 780, y: 36, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-muted)', text: 'Accommodation' });
    e.s('rect', { x: 640, y: 46, width: 140, height: 14, rx: 7, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    var acc = e.s('rect', { x: 640, y: 46, width: 0, height: 14, rx: 7, fill: 'var(--s1)' });
    var accT = e.s('text', { x: 780, y: 80, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: 'var(--s1)' });
    var cT = e.s('text', { x: 780, y: 102, 'text-anchor': 'end', 'font-size': 13, fill: 'var(--scene-muted)' });
    e.s('text', { x: 24, y: 372, 'font-size': 11, fill: 'var(--scene-muted)', text: 'Schéma non à l’échelle : le décalage de l’image est agrandi' });
    /* vision de la personne */
    e.s('rect', { x: 16, y: 380, width: W - 32, height: 216, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-line)' });
    e.s('text', { x: 34, y: 406, 'font-size': 12, 'font-weight': 800, 'letter-spacing': '0.1em', fill: 'var(--scene-muted)', text: 'CE QUE VOIT LA PERSONNE' });
    var view = e.s('g', { filter: 'url(#oeBlur)' });
    e.s('rect', { x: 250, y: 418, width: 300, height: 166, rx: 8, fill: '#FDFBF4', stroke: '#C9C2AE' }, view);
    [['E', 46, 470], ['F  P', 30, 510], ['T  O  Z', 20, 540], ['L  P  E  D', 14, 563], ['P  E  C  F  D', 10, 578]].forEach(function (r) {
      e.s('text', { x: 400, y: r[2], 'text-anchor': 'middle', 'font-size': r[1], 'font-weight': 800, fill: '#141414', 'font-family': 'Atkinson Hyperlegible, sans-serif', text: r[0] }, view);
    });
    var vT = e.s('text', { x: 34, y: 440, 'font-size': 18, 'font-weight': 800 });
    var vT2 = e.s('text', { x: 34, y: 466, 'font-size': 14, fill: 'var(--scene-muted)' });
    var tipT = [0, 1, 2].map(function (j) { return e.s('text', { x: 572, y: 440 + j * 22, 'font-size': 13, fill: 'var(--scene-text)' }); });

    var roA = e.readout({ label: 'Accommodation utilisée' }), roN = e.readout({ label: 'Image sur la rétine' });

    function draw() {
      var st = state(), d = st.d;
      // objet : position schématique (plus proche = plus à droite et plus grand)
      var u = di / (DIST.length - 1), ox = 214 - u * 180, sz = 54 - u * 30;
      objPost.setAttribute('x1', ox); objPost.setAttribute('x2', ox); objPost.setAttribute('y1', Y); objPost.setAttribute('y2', Y + 120);
      objCard.setAttribute('x', ox - sz / 2); objCard.setAttribute('y', Y - sz / 2); objCard.setAttribute('width', sz); objCard.setAttribute('height', sz);
      objTxt.setAttribute('x', ox); objTxt.setAttribute('y', Y + sz * 0.32); objTxt.setAttribute('font-size', sz * 0.8);
      dT.textContent = 'Objet à ' + (d === Infinity ? 'l’infini (très loin)' : d + ' cm');
      eyeT.textContent = EYES[eye].lab + (Cv ? ' · verre de ' + (Cv > 0 ? '+' : '') + e.fmt(Cv, 1) + ' δ' : ' · sans verre');
      // cristallin
      lens.setAttribute('rx', 7 + st.A * 3.2);
      // rayons
      rayG.innerHTML = ''; rayIn.innerHTML = '';
      var vShift = (1000 / (st.tot - (d === Infinity ? 0 : 100 / d)) - 17) * PXMM * EX;
      var cx = Math.max(LXc + 60, Math.min(RX + 160, RX + vShift));
      var hs = [-36, -18, 0, 18, 36], parallel = d === Infinity || d >= 500;
      var hits = [];
      hs.forEach(function (h) {
        var y0 = parallel ? Y + h : Y, x0 = parallel ? 40 : ox + sz / 2 + 2;
        e.s('line', { x1: x0, y1: y0, x2: LXc, y2: Y + h, stroke: 'var(--warn)', 'stroke-width': 1.6, opacity: 0.9 }, rayG);
        // après le cristallin : vers le point de convergence, prolongé jusqu'à la rétine
        var dx = cx - LXc, dy = Y - (Y + h), t = (RX - LXc) / dx, yR = Y + h + dy * t;
        var xEnd = RX + 4, yEnd = Y + h + dy * (xEnd - LXc) / dx;
        e.s('line', { x1: LXc, y1: Y + h, x2: xEnd, y2: yEnd, stroke: 'var(--warn)', 'stroke-width': 1.6 }, rayIn);
        hits.push(yR);
      });
      var spread = Math.abs(hits[0] - hits[4]);
      imgDot.setAttribute('cx', cx); imgDot.setAttribute('cy', Y); imgDot.style.opacity = st.sharp ? 1 : (cx < RX ? 0.9 : 0.35);
      blurSeg.setAttribute('x1', RX + 2); blurSeg.setAttribute('x2', RX + 2); blurSeg.setAttribute('y1', Y - spread / 2); blurSeg.setAttribute('y2', Y + spread / 2);
      blurSeg.style.opacity = st.sharp ? 0 : 0.8;
      if (st.sharp) { imgT.textContent = '✓ L’image se forme sur la rétine'; imgT.style.fill = 'var(--ok)'; }
      else if (st.D < 0) { imgT.textContent = 'L’image se forme EN AVANT de la rétine'; imgT.style.fill = 'var(--warn)'; }
      else { imgT.textContent = 'L’image se forme EN ARRIÈRE de la rétine'; imgT.style.fill = 'var(--warn)'; }
      // verre correcteur
      if (Cv) {
        var gx = 262, k = Math.min(1, Math.abs(Cv) / 4);
        glass.setAttribute('d', Cv > 0 ? 'M' + gx + ' ' + (Y - 64) + 'Q' + (gx + 12 + 10 * k) + ' ' + Y + ' ' + gx + ' ' + (Y + 64) + 'Q' + (gx - 12 - 10 * k) + ' ' + Y + ' ' + gx + ' ' + (Y - 64) + 'Z'
          : 'M' + (gx - 12 - 6 * k) + ' ' + (Y - 64) + 'H' + (gx + 12 + 6 * k) + 'Q' + (gx + 2) + ' ' + Y + ' ' + (gx + 12 + 6 * k) + ' ' + (Y + 64) + 'H' + (gx - 12 - 6 * k) + 'Q' + (gx - 2) + ' ' + Y + ' ' + (gx - 12 - 6 * k) + ' ' + (Y - 64) + 'Z');
        glassT.textContent = (Cv > 0 ? '+' : '') + e.fmt(Cv, 1) + ' δ ' + (Cv > 0 ? '(convergent)' : '(divergent)');
      } else { glass.setAttribute('d', ''); glassT.textContent = ''; }
      acc.setAttribute('width', 140 * st.A / AMAX); acc.style.fill = st.A >= AMAX - 0.01 && !st.sharp ? 'var(--bad)' : 'var(--s1)';
      accT.textContent = e.fmt(st.A, 1) + ' δ sur ' + AMAX + ' δ' + (st.A >= AMAX - 0.01 ? ' (maximum)' : '');
      cT.textContent = 'Vergence totale : ' + e.fmt(st.tot, 1) + ' δ';
      // vision
      blE.setAttribute('stdDeviation', st.sharp ? 0 : Math.min(9, Math.abs(st.D) * 2.2));
      vT.textContent = st.sharp ? 'Net !' : 'Flou'; vT.style.fill = st.sharp ? 'var(--ok)' : 'var(--warn)';
      vT2.textContent = st.sharp ? (st.A > 0.05 ? 'Accommodation : ' + e.fmt(st.A, 1) + ' δ' : 'Œil au repos') : 'Écart de netteté : ' + e.fmt(Math.abs(st.D), 1) + ' δ';
      var pr = (EYES[eye].c0 + Cv) - 1000 / 17, pp = pr + AMAX;
      tipT[0].textContent = 'Vision nette pour cet œil :';
      tipT[1].textContent = pr <= 0.01 ? 'de loin : jusqu’à l’infini' : 'de loin : jusqu’à ' + Math.round(100 / pr) + ' cm seulement';
      tipT[2].textContent = pp <= 0 ? 'de près : impossible' : 'de près : à partir de ' + Math.round(100 / pp) + ' cm';
      if (pr < -0.01) tipT[1].textContent = 'de loin : non (même à l’infini il accommode)';
      roA.set(e.fmt(st.A, 1) + ' δ'); roN.set(st.sharp ? 'nette' : 'floue');
      return st;
    }

    var cE = e.choice({ label: 'Œil observé', value: 'n', options: [{ v: 'n', l: 'Normal' }, { v: 'm', l: 'Myope' }, { v: 'h', l: 'Hypermétrope' }], onChange: function (v) { eye = v; draw(); } });
    var sD = e.slider({ label: 'Distance de l’objet', min: 0, max: DIST.length - 1, step: 1, value: di, fmt: function (i) { return DIST[i] === Infinity ? '∞ (très loin)' : DIST[i] + ' cm'; }, onInput: function (v) { di = v; draw(); } });
    var sV = e.slider({ label: 'Verre correcteur (vergence)', min: -5, max: 5, step: 0.5, value: 0, fmt: function (v) { return v === 0 ? 'aucun' : (v > 0 ? '+' : '') + e.fmt(v, 1) + ' δ'; }, onInput: function (v) { Cv = v; var st = draw(); if (st.sharp && eye !== 'n' && Cv) e.say('Avec ce verre, l’image est nette sur la rétine.', 'ok'); } });
    var row = e.buttonRow();
    e.button({ label: 'Regarder au loin', into: row, onClick: function () { di = DIST.length - 1; sD.set(di); draw(); } });
    e.button({ label: 'Lire à 25 cm', into: row, onClick: function () { di = 3; sD.set(di); draw(); } });

    tbl = e.table({ cols: [{ k: 'n', label: 'n°', dec: 0 }, { k: 'oe', label: 'Œil' }, { k: 'd', label: 'Distance' }, { k: 'v', label: 'Verre', unit: 'δ', dec: 1 }, { k: 'a', label: 'Accom.', unit: 'δ', dec: 1 }, { k: 'img', label: 'Image' }], onChange: bilan });
    e.measure('Relever cet essai', function () {
      var st = draw();
      return { n: tbl.rows().length + 1, oe: EYES[eye].nm, d: st.d === Infinity ? '∞' : st.d + ' cm', v: Cv, a: st.A, img: st.sharp ? 'nette' : 'floue' };
    });
    function bilan(rows) {
      if (!rows.length) { e.results(''); return; }
      var h = [];
      var mFar = rows.filter(function (r) { return r.oe === 'myope' && r.d === '∞'; });
      if (mFar.length) { var ok = mFar.filter(function (r) { return r.img === 'nette'; }); h.push(ok.length ? 'Œil myope, objet lointain : net avec un verre de <b>' + e.fmt(ok[0].v, 1) + ' δ</b> → lentille <b>divergente</b>.' : 'Œil myope, objet lointain : image floue. Essaie un verre de vergence négative.'); }
      var hNear = rows.filter(function (r) { return r.oe === 'hypermétrope' && r.d === '25 cm'; });
      if (hNear.length) { var ok2 = hNear.filter(function (r) { return r.img === 'nette'; }); h.push(ok2.length ? 'Œil hypermétrope, lecture à 25 cm : net avec <b>+' + e.fmt(ok2[0].v, 1) + ' δ</b> → lentille <b>convergente</b>.' : 'Œil hypermétrope à 25 cm : image floue. Essaie un verre de vergence positive.'); }
      var nr = rows.filter(function (r) { return r.oe === 'normal'; });
      if (nr.length) h.push('Œil normal : plus l’objet est proche, plus il accommode (jusqu’à 4 δ, soit 25 cm au plus près).');
      e.results(h.join('<br>') || 'Continue tes essais avec les trois yeux.');
    }
    e.onReset(function () { eye = 'n'; di = 10; Cv = 0; cE.set('n'); sD.set(10); sV.set(0); draw(); });
    draw();
    e.say('Change la distance de l’objet et regarde le cristallin s’adapter.');
  }
});
