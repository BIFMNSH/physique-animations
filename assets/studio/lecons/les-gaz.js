/* 6e · Propriétés physiques de la matière · Leçon : Les gaz */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var RHO = 1.3; // g par litre d’air
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function bounce(i, T, x, y, w, h, sp) { var u = (rnd(i, 3) + T * sp * (0.05 + rnd(i, 4) * 0.08)) % 2, v = (rnd(i, 5) + T * sp * (0.04 + rnd(i, 6) * 0.07)) % 2; u = u > 1 ? 2 - u : u; v = v > 1 ? 2 - v : v; return [x + 6 + u * (w - 12), y + 6 + v * (h - 12)]; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'seringue', V: 60, valve: false, open: 0, strokes: 0, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- SERINGUE ---------- */
    var A = s('g', {}, G), SX = 110, SY = 200, SL = 300, SH = 70;
    s('rect', { x: SX - 22, y: SY + 22, width: 22, height: 26, rx: 4, fill: '#E5484D' }, A); s('text', { x: SX - 11, y: SY + 88, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'bouchée' }, A);
    s('rect', { x: SX, y: SY, width: SL, height: SH, rx: 6, fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    for (var g = 0; g <= 90; g += 10) { var gx = SX + g / 90 * (SL - 20); s('line', { x1: gx, x2: gx, y1: SY - 2, y2: SY + (g % 30 ? 10 : 16), stroke: '#7D89A3', 'stroke-width': 1.5 }, A); if (g % 30 === 0) s('text', { x: gx, y: SY - 8, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: g + ' mL' }, A); }
    var gasA = s('g', {}, A), GA = []; for (var i = 0; i < 26; i++) GA.push(s('circle', { r: 5, fill: '#E8F4FF', opacity: 0.85 }, gasA));
    var pist = s('rect', { y: SY + 4, width: 14, height: SH - 8, rx: 3, fill: '#5B6680' }, A), rod = s('rect', { y: SY + 28, height: 14, fill: '#9AA6BC' }, A), knob = s('rect', { y: SY - 16, width: 14, height: SH + 32, rx: 5, fill: '#C9D2E3' }, A);
    var hand = s('path', { fill: '#C68B59', stroke: '#8D5A35', 'stroke-width': 2 }, A);
    var arrA = s('path', { fill: '#FFC773' }, A), aMsg = s('text', { x: 290, y: 330, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, A), aMsg2 = s('text', { x: 290, y: 354, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, A);
    /* ---------- DEUX FLACONS ---------- */
    var B = s('g', {}, G), F1 = [90, 150, 160, 220], F2 = [330, 150, 160, 220];
    [F1, F2].forEach(function (f) { s('rect', { x: f[0], y: f[1], width: f[2], height: f[3], rx: 18, fill: '#9FD7FF', 'fill-opacity': 0.06, stroke: '#BFE6FF', 'stroke-width': 3 }, B); });
    s('rect', { x: 250, y: 250, width: 80, height: 20, fill: '#0F1729', stroke: '#BFE6FF', 'stroke-width': 3 }, B);
    var valveG = s('g', { style: 'cursor:pointer' }, B); s('circle', { cx: 290, cy: 260, r: 16, fill: '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2 }, valveG); var vh = s('rect', { x: 284, y: 236, width: 12, height: 48, rx: 4, fill: '#FFB547' }, valveG);
    valveG.addEventListener('click', function () { st.valve = !st.valve; o.onValve && o.onValve(); });
    s('text', { x: 290, y: 302, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'robinet' }, B);
    s('text', { x: 170, y: 140, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'flacon A : air' }, B); s('text', { x: 410, y: 140, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'flacon B : vide' }, B);
    var gasB = s('g', {}, B), GB = []; for (i = 0; i < 36; i++) GB.push(s('circle', { r: 5, fill: '#FFC773', opacity: 0.9 }, gasB));
    var bMsg = s('text', { x: 290, y: 410, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, B);
    /* ---------- MASSE DE L’AIR ---------- */
    var C = s('g', {}, G);
    s('path', { d: 'M150 380 H430 L410 340 H170 Z', fill: '#3A4560' }, C); s('rect', { x: 230, y: 350, width: 120, height: 26, rx: 5, fill: '#A9C29A' }, C);
    var disp = s('text', { x: 340, y: 370, 'text-anchor': 'end', 'font-size': 18, 'font-weight': 800, fill: '#1B2418', 'font-family': 'ui-monospace,Menlo,monospace' }, C);
    s('rect', { x: 170, y: 330, width: 240, height: 10, rx: 3, fill: '#5B6680' }, C);
    var ball = s('path', { fill: '#3D8BFF', stroke: '#80B8FF', 'stroke-width': 2 }, C), ballS = s('ellipse', { fill: '#FFFFFF', opacity: 0.25 }, C), valveC = s('rect', { x: 284, y: 318, width: 12, height: 14, rx: 2, fill: '#2A2F38' }, C);
    var pump = s('g', {}, C); s('rect', { x: 452, y: 200, width: 30, height: 130, rx: 5, fill: '#4FC3FF', opacity: 0.8 }, pump); var pr = s('rect', { x: 462, width: 10, fill: '#C9D2E3' }, pump), ph = s('rect', { x: 442, width: 50, height: 10, rx: 4, fill: '#2A3346' }, pump);
    s('path', { d: 'M467 330 Q467 360 420 346 T300 326', fill: 'none', stroke: '#2A3346', 'stroke-width': 4 }, C);
    var cMsg = s('text', { x: 290, y: 420, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, C);
    s('text', { x: 467, y: 190, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'pompe' }, C);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pt = s('text', { x: PX + 140, y: 52, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), pv = s('text', { x: PX + 140, y: 92, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 900, fill: '#FFC773' }, P), pv2 = s('text', { x: PX + 140, y: 118, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var rowsP = ['Forme propre', 'Volume propre', 'Compressible', 'A une masse'].map(function (l, k) { var y = 160 + k * 30; s('text', { x: PX + 20, y: y, 'font-size': 13, fill: '#C9D2E3', text: l }, P); return s('text', { x: PX + 260, y: y, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 900 }, P); });
    s('text', { x: PX + 20, y: 296, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lp = TK.particles(P, PX + 20, 304, 240, 132, 'gaz', '#E8F4FF');
    var last = performance.now(), shown = {};
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'seringue' ? '' : 'none'; B.style.display = st.mode === 'robinet' ? '' : 'none'; C.style.display = st.mode === 'masse' ? '' : 'none';
      var dens = 1;
      if (st.mode === 'seringue') {
        var px = SX + st.V / 90 * (SL - 20); attr(pist, { x: px }); attr(rod, { x: px + 14, width: 90 }); attr(knob, { x: px + 104 });
        GA.forEach(function (c, k) { var p = bounce(k, T, SX + 2, SY + 2, px - SX - 2, SH - 4, 1 + 60 / st.V); attr(c, { cx: p[0], cy: p[1] }); });
        var Pr = 60 / st.V; dens = Pr;
        hand.setAttribute('d', 'M' + (px + 118) + ' ' + (SY - 10) + ' q30 -6 40 14 q6 30 -6 60 q-20 10 -34 -6z');
        arrA.setAttribute('d', st.V < 59 ? K.arrow(px + 190, SY + 35, px + 140, SY + 35, 4, 10, 14) : st.V > 61 ? '' : '');
        aMsg.textContent = st.V < 55 ? 'On pousse : l’air est comprimé' : st.V > 65 ? 'On tire : l’air se détend' : 'Seringue bouchée : 60 mL d’air';
        aMsg2.textContent = 'Les particules ont ' + (st.V < 55 ? 'moins' : st.V > 65 ? 'plus' : 'autant') + ' de place, mais leur nombre ne change pas';
        pt.textContent = 'VOLUME DE L’AIR'; pv.textContent = Math.round(st.V) + ' mL'; pv2.textContent = st.V < 55 ? 'compressible' : st.V > 65 ? 'expansible' : 'au départ : 60 mL';
        res = { V: st.V };
      } else if (st.mode === 'robinet') {
        if (st.t == null) st.open = st.valve ? Math.min(1, st.open + dt / 2) : Math.max(0, st.open - dt / 0.5 * 0);
        vh.setAttribute('transform', st.valve ? 'rotate(90 290 260)' : '');
        GB.forEach(function (c, k) { var inB = k % 2 === 1 && rnd(k, 9) < st.open * 1.0, f = inB ? F2 : F1; var p = bounce(k, T, f[0], f[1], f[2], f[3], 1.2); attr(c, { cx: p[0], cy: p[1] }); });
        dens = 1 - 0.5 * st.open;
        bMsg.textContent = st.open > 0.9 ? 'L’air occupe tout l’espace offert : les deux flacons' : st.valve ? 'L’air passe dans le flacon B…' : 'Clique sur le robinet pour l’ouvrir';
        pt.textContent = 'VOLUME OCCUPÉ PAR L’AIR'; pv.textContent = (1 + st.open).toFixed(1).replace('.', ',') + ' L'; pv2.textContent = 'flacon A : 1 L · flacon B : 1 L';
        res = { open: st.open, valve: st.valve };
      } else {
        var Vb = 0.5 * st.strokes, m = 10 + RHO * Vb, r = 18 + 26 * Math.sqrt(Math.min(4, Vb) / 4);
        ball.setAttribute('d', 'M290 330 C' + (290 - r * 1.3) + ' ' + (330 - r * 0.6) + ' ' + (290 - r * 1.2) + ' ' + (330 - r * 2.2) + ' 290 ' + (330 - r * 2.2) + ' C' + (290 + r * 1.2) + ' ' + (330 - r * 2.2) + ' ' + (290 + r * 1.3) + ' ' + (330 - r * 0.6) + ' 290 330Z');
        attr(ballS, { cx: 290 - r * 0.4, cy: 330 - r * 1.6, rx: r * 0.25, ry: r * 0.16 });
        var pk = st.t != null ? 0.5 + 0.5 * Math.sin(T * 6) : (st.pumpK || 0); attr(pr, { y: 150 + pk * 50, height: 60 }); attr(ph, { y: 145 + pk * 50 });
        if (st.pumpK) st.pumpK = Math.max(0, st.pumpK - dt * 3);
        disp.textContent = fmt(m, 1) + ' g'; cMsg.textContent = st.strokes ? 'Ballon gonflé de ' + fmt(Vb, 1) + ' L d’air : il est plus lourd !' : 'Ballon de basket dégonflé posé sur la balance';
        pt.textContent = 'MASSE AFFICHÉE'; pv.textContent = fmt(m, 1) + ' g'; pv2.textContent = '+ ' + fmt(RHO * Vb, 1) + ' g d’air (1 L d’air ≈ 1,3 g)';
        dens = 1 + Vb / 2;
        res = { m: m, dm: RHO * Vb, strokes: st.strokes };
      }
      [['non', '#FF8A80'], ['non', '#FF8A80'], ['oui', '#3DD68C'], ['oui', '#3DD68C']].forEach(function (v, k) { rowsP[k].textContent = v[0]; rowsP[k].setAttribute('fill', v[1]); });
      lp.set(0.6, T, Math.max(0.45, Math.min(1.3, 1.2 / Math.max(0.6, dens))));
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Un gaz occupe tout l’espace' }, { t: 12, title: 'Un gaz se comprime' }, { t: 23, title: 'Un gaz se détend' }, { t: 33, title: 'L’air a une masse' }, { t: 46, title: 'Solide, liquide ou gaz ?' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un gaz n’a ni <b>forme propre</b>, ni <b>volume propre</b>', 'il occupe tout l’espace qui lui est offert.', '#4FC3FF'],
      ['Un gaz est <b>compressible</b> et <b>expansible</b>', 'on peut réduire ou augmenter son volume.', '#FFC773'],
      ['L’air est un gaz qui a une <b>masse</b>', '1 litre d’air a une masse d’environ 1,3 g.', '#3DD68C']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t;
        if (t < 12) { st.mode = 'robinet'; st.valve = t > 4; st.open = K.k(t, 4.5, 4); }
        else if (t < 23) { st.mode = 'seringue'; st.V = 60 - 30 * K.k(t, 13, 6); }
        else if (t < 33) { st.mode = 'seringue'; st.V = 30 + 60 * K.k(t, 23.5, 6); }
        else if (t < 46) { st.mode = 'masse'; st.strokes = Math.min(8, Math.floor(Math.max(0, t - 36) / 0.9)); }
        else { st.mode = 'robinet'; st.valve = true; st.open = 1; }
        lab.step();
        tg.show(t, 1, 4, 290, 92, 'Tout l’air est dans le flacon A') || tg.show(t, 5, 11.6, 290, 92, 'On ouvre : l’air remplit aussi B') || tg.show(t, 14, 22.6, 290, 92, 'On pousse : le volume diminue') || tg.show(t, 24, 32.6, 290, 92, 'On tire : le volume augmente') ||
          tg.show(t, 34, 45.6, 290, 92, 'Plus d’air : la masse augmente') || tg.show(t, 47, 55.6, 290, 92, 'Un gaz prend la forme et le volume du récipient');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : de l’air enfermé dans un flacon se répand dans un second flacon quand on ouvre un robinet ; une seringue bouchée est poussée puis tirée ; un ballon posé sur une balance devient plus lourd quand on le gonfle ; une loupe montre les particules du gaz',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'L’air qui nous entoure est un gaz. Le flacon A en contient ; le flacon B est vide.', sub: 'L’air est un <b>gaz</b>.' },
      { t: 4.6, d: 7.2, say: 'Ouvrons le robinet : l’air se répand dans les deux flacons. Un gaz occupe tout l’espace qui lui est offert.', sub: 'Un gaz occupe <b>tout l’espace</b> offert.' },
      { t: 12, d: 10.6, say: 'Bouchons une seringue pleine d’air et poussons le piston : le volume de l’air diminue. On dit qu’un gaz est compressible.', sub: 'On pousse : le gaz est <b>compressible</b>.' },
      { t: 23, d: 9.6, say: 'Tirons le piston : le volume de l’air augmente. Un gaz est aussi expansible. Le nombre de particules, lui, ne change pas.', sub: 'On tire : le gaz est <b>expansible</b>.' },
      { t: 33, d: 12.4, say: 'Posons un ballon dégonflé sur une balance, puis gonflons-le avec une pompe : la masse augmente ! L’air a une masse : environ un virgule trois gramme par litre.', sub: 'L’air a une <b>masse</b> : environ 1,3 g par litre.' },
      { t: 46, d: 9.6, say: 'Un solide a une forme propre ; un liquide a un volume propre ; un gaz n’a ni l’un ni l’autre : il prend la forme et le volume de son récipient.', sub: 'Un gaz : ni forme propre, ni volume propre.' },
      { t: 56, d: 4.4, say: 'À retenir : un gaz occupe tout l’espace qui lui est offert.', sub: 'Un gaz occupe tout l’espace.' },
      { t: 60.6, d: 4.2, say: 'Il est compressible et expansible.', sub: '<b>Compressible</b> et <b>expansible</b>.' },
      { t: 65, d: 5, say: 'L’air est un gaz qui a une masse.', sub: 'L’air a une <b>masse</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'Un gaz occupe <b>tout l’espace</b> qui lui est offert.' },
      { t: 22, ch: 1, html: 'Un gaz est <b>compressible</b>.' },
      { t: 32, ch: 2, html: 'Un gaz est <b>expansible</b>.' },
      { t: 45, ch: 3, html: 'L’air a une <b>masse</b> : 1 L ≈ 1,3 g.' }
    ],
    question: { q: 'On pousse le piston d’une seringue bouchée pleine d’air. Le volume de l’air :', o: ['augmente', 'diminue', 'ne change pas', 'devient liquide'], a: 1, e: 'Un gaz est compressible.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Seringue', r: [40, 40, 500, 406] }, { n: 'Propriétés', r: [560, 22, 280, 424] }],
    alt: 'Trois expériences sur les gaz : une seringue bouchée dont on déplace le piston, deux flacons reliés par un robinet, et un ballon que l’on gonfle sur une balance ; loupe sur les particules à droite',
    steps: [
      'Seringue : pousse puis tire le piston. Que devient le volume de l’air ?',
      'Flacons : ouvre le robinet. Où va l’air ?',
      'Balance : gonfle le ballon avec la pompe. Que devient la masse ?',
      'Relève la masse pour plusieurs coups de pompe.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onValve: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'seringue', options: [{ v: 'seringue', l: 'Seringue bouchée' }, { v: 'robinet', l: 'Deux flacons' }, { v: 'masse', l: 'L’air a-t-il une masse ?' }], onChange: function (v) { st.mode = v; vis(); } });
      var sV = c.slider({ label: 'Position du piston (volume)', min: 20, max: 90, step: 1, value: 60, unit: 'mL', onInput: function (v) { st.V = v; } });
      var bV = c.button({ label: 'Ouvrir / fermer le robinet', sm: true, onClick: function () { st.valve = !st.valve; if (!st.valve) st.open = 0; } });
      var r1 = c.row(); c.button({ label: 'Un coup de pompe (+0,5 L)', primary: true, sm: true, into: r1, onClick: function () { if (st.strokes < 8) { st.strokes++; st.pumpK = 1; api.sound('tick'); } } }); c.button({ label: 'Dégonfler', sm: true, into: r1, onClick: function () { st.strokes = 0; } });
      function vis() { sV.hide(st.mode !== 'seringue'); bV.style.display = st.mode === 'robinet' ? '' : 'none'; r1.style.display = st.mode === 'masse' ? 'flex' : 'none'; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Mesure' }, { k: 'b', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'seringue') { ro.a.set(st.V + ' mL'); ro.b.set(st.V < 58 ? 'compression' : st.V > 62 ? 'détente' : 'départ'); } else if (st.mode === 'robinet') { ro.a.set(st.valve ? 'robinet ouvert' : 'robinet fermé'); ro.b.set(last.open > 0.9 ? 'air dans A et B' : 'air dans A'); } else { ro.a.set(fmt(last.m, 1) + ' g'); ro.b.set(st.strokes + ' coup(s) de pompe'); } });
      var M = api.measure; M.innerHTML = '<h3>Masse du ballon</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever (mode balance)'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode !== 'masse') { api.say('Passe en mode balance pour relever.'); return; } rows = rows.filter(function (r) { return r.n !== st.strokes; }); rows.push({ n: st.strokes, v: 0.5 * st.strokes, m: last.m }); rows.sort(function (a, b) { return a.n - b.n; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Coups</th><th>Air ajouté</th><th>Masse</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.n + '</td><td>' + fmt(r.v, 1) + ' L</td><td>' + fmt(r.m, 1) + ' g</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Masse en fonction de l’air ajouté</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'air ajouté (L)', ylabel: 'masse (g)', xmin: 0, xmax: 4, xstep: 1, ymin: 9, ymax: 16, ystep: 1, series: [{ color: '#3DD68C', pts: rows.map(function (r) { return [r.v, r.m]; }), fit: rows.length > 1 }] });
      }
      paint();
      api.onReset(function () { st.mode = 'seringue'; st.V = 60; st.valve = false; st.open = 0; st.strokes = 0; cM.set('seringue'); sV.set(60); vis(); rows = []; paint(); });
      api.say('Pousse le piston de la seringue bouchée.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève la masse pour au moins 3 gonflages différents.</p>';
        return '<p>Un gaz (comme l’air) <b>n’a pas de forme propre</b> ni de <b>volume propre</b> : il occupe <b>tout l’espace</b> qui lui est offert (il passe dans le flacon vide).</p><p>Un gaz est <b>compressible</b> (son volume diminue quand on pousse le piston) et <b>expansible</b> (il augmente quand on tire). Le nombre de particules ne change pas : elles ont seulement plus ou moins de place.</p><p>L’air a une <b>masse</b> : chaque litre ajouté augmente la masse du ballon d’environ <b>1,3 g</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Expériences sur les gaz' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’air invisible',
    intro: 'On ne le voit pas, mais l’air se comprime, se répand… et pèse !',
    missions: [
      { title: 'Comprime !', text: 'Réduis le volume de l’air de la seringue <b>de moitié</b> (30 mL ou moins).', lumi: 'Pousse le piston.', hint: 'Descends à 30 mL.',
        build: function (api) { var lab = mini(api, { mode: 'seringue' }); api.c.slider({ label: 'Volume', min: 20, max: 90, step: 1, value: 60, unit: 'mL', onInput: function (v) { lab.st.V = v; } }); return function () { var r = lab.res(); return r.V <= 30 ? { ok: true, msg: 'L’air est comprimé : ' + r.V + ' mL.' } : { ok: false, msg: 'Encore ' + r.V + ' mL.' }; }; },
        e: 'Un gaz est compressible.' },
      { type: 'qcm', title: 'Forme propre ?', text: 'Un gaz a-t-il une forme propre ?', o: ['oui, comme un solide', 'non, il occupe tout le récipient', 'oui, celle d’une sphère', 'seulement s’il est froid'], a: 1, hint: 'Pense aux deux flacons.', e: 'Un gaz n’a pas de forme propre.' },
      { title: 'Partage l’air', text: 'Fais en sorte que l’air occupe <b>les deux flacons</b>.', lumi: 'Il y a un robinet entre les deux.', hint: 'Clique sur le robinet orange.',
        build: function (api) { var lab = mini(api, { mode: 'robinet' }); return function () { var r = lab.res(); return r.open > 0.9 ? { ok: true, msg: 'L’air occupe tout l’espace offert.' } : { ok: false, msg: r.valve ? 'Patiente un instant…' : 'Le robinet est fermé.' }; }; },
        e: 'Un gaz occupe tout l’espace qui lui est offert.' },
      { type: 'qcm', title: 'Combien pèse l’air ?', text: 'La masse d’un litre d’air est d’environ :', o: ['0 g', '1,3 g', '1 kg', '100 g'], a: 1, hint: 'Un peu plus d’un gramme.', e: 'Environ 1,3 g.' },
      { title: 'Plus lourd', text: 'Gonfle le ballon pour que sa masse augmente d’au moins <span style="color:#3DD68C">2,6 g</span>.', lumi: 'Combien de litres d’air faut-il ?', hint: '2 litres, soit 4 coups de pompe.',
        build: function (api) { var lab = mini(api, { mode: 'masse' }); api.c.button({ label: 'Un coup de pompe', sm: true, onClick: function () { if (lab.st.strokes < 8) { lab.st.strokes++; lab.st.pumpK = 1; } } }); return function () { var r = lab.res(); return r.dm >= 2.59 ? { ok: true, msg: '+' + fmt(r.dm, 1) + ' g : l’air a bien une masse !' } : { ok: false, msg: 'Seulement +' + fmt(r.dm, 1) + ' g.' }; }; },
        e: '2 L d’air ont une masse d’environ 2,6 g.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On enferme de l’air dans une seringue virtuelle. Peut-on modifier le volume qu’il occupe sans changer la quantité de gaz ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-les-gaz', level: '6e', theme: 'Propriétés physiques de la matière', title: 'Les gaz', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’air est un <b>gaz</b>. Comme tous les gaz, il est invisible le plus souvent, mais on peut mettre son existence en évidence (bulles, sac gonflé, vent).',
      'Un gaz n’a <b>ni forme propre, ni volume propre</b> : il occupe <b>tout l’espace</b> qui lui est offert.',
      'Un gaz est <b>compressible</b> (on peut diminuer son volume) et <b>expansible</b> (son volume peut augmenter).',
      'L’air a une <b>masse</b> : 1 litre d’air a une masse d’environ 1,3 g.',
      'Dans un gaz, les particules sont très éloignées les unes des autres et se déplacent dans toutes les directions.'
    ],
    quiz: [
      { q: 'Un gaz occupe :', o: ['seulement le fond du récipient', 'tout l’espace qui lui est offert', 'la moitié du récipient', 'un volume fixe'], a: 1, e: 'Il occupe tout l’espace.' },
      { q: 'On tire le piston d’une seringue bouchée : l’air est :', o: ['comprimé', 'détendu', 'liquéfié', 'chauffé'], a: 1, e: 'Le gaz est expansible.' },
      { q: 'Un ballon gonflé est :', o: ['plus léger que dégonflé', 'plus lourd que dégonflé', 'de même masse', 'sans masse'], a: 1, e: 'L’air ajouté a une masse.' },
      { q: 'Lequel n’a ni forme ni volume propres ?', o: ['le sable', 'l’eau', 'l’air', 'le bois'], a: 2, e: 'C’est un gaz.' },
      { q: 'Dans un gaz, les particules sont :', o: ['serrées et ordonnées', 'très éloignées et en mouvement', 'immobiles', 'collées'], a: 1, e: 'Elles sont très espacées.' }
    ]
  });
})();

