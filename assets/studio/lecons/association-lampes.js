/* 5e · Électricité · Leçon : Association de lampes électriques (série et dérivation) */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var UN = 6, BG = '#0F1729';
  var POS = { serie: { 1: [300], 2: [235, 365], 3: [190, 300, 410] }, der: { 1: [300], 2: [270, 400], 3: [250, 350, 450] } };

  function solve(st) {
    var n = st.n, rm = st.removed.slice(0, n), on = st.closed, V = [];
    if (st.mode === 'serie') { var open = !on || rm.some(Boolean); for (var i = 0; i < n; i++) V.push(open || rm[i] ? 0 : st.U / n); }
    else for (i = 0; i < n; i++) V.push(on && !rm[i] ? st.U : 0);
    var lit = V.filter(function (u) { return E.lampState(u, UN).k !== 'off'; }).length;
    return { V: V, lit: lit, states: V.map(function (u) { return E.lampState(u, UN); }) };
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'serie', n: 2, U: 6, closed: true, removed: [false, false, false], schema: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 50, width: 500, height: 390, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), key = '', parts = null;
    function mask(x, y, w, h) { return s('rect', { x: x, y: y, width: w, height: h, fill: BG }, C); }
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild);
      var P = { wires: [], branch: [], lamps: [], holes: [] }, xs = POS[st.mode][st.n];
      if (st.mode === 'serie') {
        P.wires.push(E.wire(C, 'M100 120 H500 V380 H100 Z'));
        xs.forEach(function (x, i) { var h = s('g', {}, C); s('rect', { x: x - 26, y: 112, width: 52, height: 16, fill: BG }, h); s('circle', { cx: x - 26, cy: 120, r: 4, fill: '#EEF2F8' }, h); s('circle', { cx: x + 26, cy: 120, r: 4, fill: '#EEF2F8' }, h); s('path', { d: 'M' + (x - 10) + ' 120 h20 v14 h-20z', fill: '#5B6680' }, h); P.holes.push(h); P.lamps.push(lampAt(x, 120, i)); });
        mask(140, 372, 80, 16); P.K = E.switchK(C, 150, 380, 210, { closed: st.closed, onToggle: function (c) { st.closed = c; o.onToggle && o.onToggle(); } });
        P.bat = E.battery(C, 360, 380, { U: st.U });
      } else {
        var xl = xs[xs.length - 1];
        P.wires.push(E.wire(C, 'M100 110 H' + xl + ' M100 400 H' + xl + ' M100 110 V400'));
        xs.forEach(function (x, i) { var w = E.wire(C, 'M' + x + ' 110 V400'); P.branch.push(w); E.dot(C, x, 110); E.dot(C, x, 400); var h = s('g', {}, C); s('rect', { x: x - 8, y: 222, width: 16, height: 56, fill: BG }, h); s('circle', { cx: x, cy: 222, r: 4, fill: '#EEF2F8' }, h); s('circle', { cx: x, cy: 278, r: 4, fill: '#EEF2F8' }, h); s('path', { d: 'M' + (x - 10) + ' 250 h20 v14 h-20z', fill: '#5B6680' }, h); P.holes.push(h); P.lamps.push(lampAt(x, 250, i)); });
        mask(140, 102, 80, 16); P.K = E.switchK(C, 150, 110, 210, { closed: st.closed, onToggle: function (c) { st.closed = c; o.onToggle && o.onToggle(); } });
        P.bat = E.battery(C, 170, 400, { U: st.U });
      }
      P.lab = s('text', { x: st.mode === 'serie' ? 290 : 380, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#A9B4C7', text: st.mode === 'serie' ? 'lampes en série : une seule boucle' : 'lampes en dérivation : plusieurs boucles' }, C);
      return P;
    }
    function lampAt(x, y, i) {
      var L = E.lamp(C, x, y, { r: 22 }), tag = s('text', { x: x, y: y + (st.mode === 'serie' ? 60 : 0), 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L' + (i + 1) }, C);
      if (st.mode === 'der') attr(tag, { x: x + 34, y: y + 5 });
      var hit = s('circle', { cx: x, cy: y, r: 30, fill: 'transparent', style: 'cursor:pointer' }, C);
      hit.addEventListener('click', function () { st.removed[i] = !st.removed[i]; o.onUnscrew && o.onUnscrew(i, st.removed[i]); });
      return { L: L, tag: tag, hit: hit };
    }
    /* schéma normalisé */
    var PX = 560, SC = s('g', {}, G);
    s('rect', { x: PX, y: 24, width: 280, height: 250, rx: 16, fill: '#F7F4EA' }, SC);
    s('text', { x: PX + 18, y: 50, 'font-size': 12, 'font-weight': 900, fill: '#3A3426', text: 'SCHÉMA NORMALISÉ' }, SC);
    var SG = s('g', {}, SC);
    function sym(G2, kind, x, y, vert, extra) {
      var ink = '#1E2430';
      if (kind === 'L') { s('circle', { cx: x, cy: y, r: 11, fill: extra ? '#FFE9A8' : '#F7F4EA', stroke: ink, 'stroke-width': 2 }, G2); s('path', { d: 'M' + (x - 7.8) + ' ' + (y - 7.8) + 'l15.6 15.6M' + (x + 7.8) + ' ' + (y - 7.8) + 'l-15.6 15.6', stroke: ink, 'stroke-width': 2 }, G2); }
      if (kind === 'G') { s('rect', { x: x - 10, y: y - 14, width: 20, height: 28, fill: '#F7F4EA' }, G2); s('line', { x1: x - 5, y1: y - 14, x2: x - 5, y2: y + 14, stroke: ink, 'stroke-width': 2 }, G2); s('line', { x1: x + 5, y1: y - 8, x2: x + 5, y2: y + 8, stroke: ink, 'stroke-width': 5 }, G2); s('text', { x: x - 14, y: y - 16, 'font-size': 11, 'font-weight': 900, fill: ink, text: '+' }, G2); }
      if (kind === 'K') { s('rect', { x: x - 14, y: y - 10, width: 28, height: 14, fill: '#F7F4EA' }, G2); s('circle', { cx: x - 12, cy: y, r: 2.5, fill: ink }, G2); s('circle', { cx: x + 12, cy: y, r: 2.5, fill: ink }, G2); s('line', { x1: x - 12, y1: y, x2: x + 12, y2: extra ? y : y - 10, stroke: ink, 'stroke-width': 2 }, G2); }
    }
    function schema(sol) {
      while (SG.firstChild) SG.removeChild(SG.firstChild);
      var ink = '#1E2430', x0 = PX + 40, x1 = PX + 240, y0 = 82, y1 = 240, n = st.n;
      if (st.mode === 'serie') {
        s('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: 'none', stroke: ink, 'stroke-width': 2 }, SG);
        for (var i = 0; i < n; i++) { var x = x0 + (x1 - x0) * (i + 1) / (n + 1); if (st.removed[i]) { s('rect', { x: x - 12, y: y0 - 4, width: 24, height: 8, fill: '#F7F4EA' }, SG); } else sym(SG, 'L', x, y0, false, sol.states[i].k !== 'off'); s('text', { x: x, y: y0 - 16, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: ink, text: 'L' + (i + 1) }, SG); }
        sym(SG, 'G', (x0 + x1) / 2 + 40, y1); sym(SG, 'K', x0 + 50, y1, false, st.closed);
      } else {
        var xs = []; for (i = 0; i < n; i++) xs.push(x0 + 70 + i * (x1 - x0 - 70) / Math.max(1, n - 1) * (n > 1 ? 1 : 0)); if (n === 1) xs = [x0 + 130];
        var xl = xs[xs.length - 1];
        s('path', { d: 'M' + x0 + ' ' + y0 + 'H' + xl + 'M' + x0 + ' ' + y1 + 'H' + xl + 'M' + x0 + ' ' + y0 + 'V' + y1, fill: 'none', stroke: ink, 'stroke-width': 2 }, SG);
        xs.forEach(function (x, i) { s('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: ink, 'stroke-width': 2 }, SG); s('circle', { cx: x, cy: y0, r: 3, fill: ink }, SG); s('circle', { cx: x, cy: y1, r: 3, fill: ink }, SG); if (st.removed[i]) s('rect', { x: x - 5, y: (y0 + y1) / 2 - 12, width: 10, height: 24, fill: '#F7F4EA' }, SG); else sym(SG, 'L', x, (y0 + y1) / 2, true, sol.states[i].k !== 'off'); s('text', { x: x + 16, y: (y0 + y1) / 2 + 4, 'font-size': 11, 'font-weight': 800, fill: ink, text: 'L' + (i + 1) }, SG); });
        sym(SG, 'G', x0, (y0 + y1) / 2 + 30); sym(SG, 'K', x0 + 40, y0, false, st.closed);
      }
    }
    /* observations */
    var OB = s('g', {}, G);
    s('rect', { x: PX, y: 290, width: 280, height: 156, rx: 16, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, OB);
    s('text', { x: PX + 18, y: 316, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'OBSERVATIONS' }, OB);
    var ob = [0, 1, 2, 3].map(function (k) { return s('text', { x: PX + 18, y: 344 + k * 24, 'font-size': 13, fill: '#C9D2E3' }, OB); });
    var schKey = '';
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, k = st.mode + st.n;
      if (k !== key) { key = k; parts = build(); }
      parts.K.set(st.closed); parts.bat.set(st.U);
      var sol = solve(st);
      parts.lamps.forEach(function (p, i) { var rm = st.removed[i]; p.L.g.style.display = rm ? 'none' : ''; parts.holes[i].style.display = rm ? '' : 'none'; p.L.set(sol.states[i].b); p.tag.setAttribute('opacity', rm ? 0.5 : 1); });
      var anyI = sol.V.some(function (u) { return u > 0; });
      parts.wires.forEach(function (w) { w.flow(anyI ? 0.8 : 0, T); });
      parts.branch.forEach(function (w, i) { w.flow(sol.V[i] > 0 ? 0.8 : 0, T); });
      SC.style.display = st.schema ? '' : 'none';
      var sk = k + st.removed.join() + st.closed + sol.states.map(function (x) { return x.k; }).join(); if (sk !== schKey) { schKey = sk; schema(sol); }
      var nRm = st.removed.slice(0, st.n).filter(Boolean).length, b0 = sol.states.filter(function (x, i) { return !st.removed[i]; })[0];
      ob[0].textContent = 'Générateur ' + E.v(st.U) + ' · ' + st.n + ' lampe' + (st.n > 1 ? 's' : '') + ' ' + E.v(UN);
      ob[1].textContent = !st.closed ? 'Interrupteur ouvert : aucune lampe ne brille.' : sol.lit + ' lampe' + (sol.lit > 1 ? 's' : '') + ' allumée' + (sol.lit > 1 ? 's' : '') + (nRm ? ' (' + nRm + ' dévissée' + (nRm > 1 ? 's' : '') + ')' : '');
      ob[2].textContent = st.closed && b0 && sol.lit ? 'Chaque lampe ' + b0.t.split(' : ')[0] + '.' : st.closed && nRm && st.mode === 'serie' ? 'Une lampe dévissée ouvre la boucle !' : '';
      ob[3].textContent = st.closed && sol.lit ? 'Tension aux bornes de chaque lampe : ' + E.v(sol.V.filter(function (u) { return u > 0; })[0]) : '';
      return { sol: sol, lit: sol.lit, mode: st.mode, n: st.n, nRm: nRm, closed: st.closed, U: st.U };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Deux lampes en série' }, { t: 14, title: 'On dévisse une lampe' }, { t: 24, title: 'Deux lampes en dérivation' }, { t: 38, title: 'On dévisse encore' }, { t: 47, title: 'Dans la maison' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { mode: 'serie', n: 1 }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['<b>En série</b> : une seule boucle', 'les lampes brillent moins ; si l’une est dévissée, toutes s’éteignent.', '#FFB547'],
      ['<b>En dérivation</b> : plusieurs boucles', 'chaque lampe brille normalement et fonctionne indépendamment.', 'var(--blue)'],
      ['À la maison, les appareils sont <b>en dérivation</b>', 'chacun reçoit la même tension et s’allume seul.', '#3DD68C']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t;
        if (t < 24) { st.mode = 'serie'; st.n = t < 5 ? 1 : 2; st.removed = [false, t > 16 && t < 22.5, false]; }
        else if (t < 47) { st.mode = 'der'; st.n = 2; st.removed = [false, t > 39.5, false]; }
        else { st.mode = 'der'; st.n = 3; st.removed = [false, t > 51, false]; }
        lab.step();
        tg.show(t, 1, 4.8, 290, 92, 'Une lampe seule : éclat normal') || tg.show(t, 6, 13.6, 290, 92, 'Deux lampes en série : elles brillent moins') || tg.show(t, 16.4, 22.4, 290, 92, 'L2 dévissée : tout s’éteint !') ||
          tg.show(t, 26, 37.6, 290, 92, 'En dérivation : éclat normal pour chacune') || tg.show(t, 40, 46.6, 290, 92, 'L2 dévissée : L1 brille toujours') || tg.show(t, 48, 55.6, 290, 92, 'Chaque appareil a sa propre boucle');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un circuit avec une lampe, puis deux lampes en série qui brillent moins et s’éteignent toutes quand on en dévisse une, puis deux et trois lampes en dérivation qui brillent normalement et restent allumées quand on en dévisse une ; un schéma normalisé accompagne chaque montage',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 4.8, say: 'Une lampe de six volts, branchée seule sur un générateur de six volts, brille normalement.', sub: 'Une lampe seule : éclat <b>normal</b>.' },
      { t: 5, d: 8.6, say: 'Ajoutons une deuxième lampe dans la même boucle : les lampes sont en série. Elles brillent toutes les deux… mais moins fort.', sub: 'Deux lampes dans une seule boucle : <b>en série</b>, éclat plus faible.' },
      { t: 14, d: 2.4, say: 'Dévissons une lampe.', sub: 'Dévissons L2…' },
      { t: 16.6, d: 7, say: 'L’autre lampe s’éteint aussi : la boucle est ouverte, le courant ne passe plus.', sub: '…<b>tout s’éteint</b> : la boucle est ouverte.' },
      { t: 24, d: 4, say: 'Branchons maintenant les deux lampes autrement, chacune dans sa propre boucle.', sub: 'Chaque lampe dans sa propre boucle…' },
      { t: 28.2, d: 9.4, say: 'Les lampes sont en dérivation. Chacune brille normalement, comme si elle était seule.', sub: '…ce sont des lampes <b>en dérivation</b> : éclat normal.' },
      { t: 38, d: 8.6, say: 'Dévissons L deux : L un continue de briller. En dérivation, les lampes fonctionnent indépendamment.', sub: 'L2 dévissée, L1 brille toujours : elles sont <b>indépendantes</b>.' },
      { t: 47, d: 8.8, say: 'C’est pour cela que les lampes et les appareils d’une maison sont branchés en dérivation : on peut les allumer ou les éteindre séparément.', sub: 'À la maison, tout est branché <b>en dérivation</b>.' },
      { t: 56, d: 4.4, say: 'À retenir : en série, il n’y a qu’une seule boucle.', sub: 'Série : une seule boucle.' },
      { t: 60.6, d: 4.2, say: 'En dérivation, il y a plusieurs boucles.', sub: 'Dérivation : plusieurs boucles.' },
      { t: 65, d: 5, say: 'Dans une installation domestique, les appareils sont montés en dérivation.', sub: 'Les appareils domestiques sont en <b>dérivation</b>.' }
    ],
    learn: [
      { t: 13, ch: 0, html: 'En <b>série</b>, les lampes brillent moins qu’une lampe seule.' },
      { t: 23, ch: 1, html: 'En série, si une lampe est dévissée, <b>toutes s’éteignent</b>.' },
      { t: 37, ch: 2, html: 'En <b>dérivation</b>, chaque lampe brille normalement.' },
      { t: 46, ch: 3, html: 'En dérivation, les lampes sont <b>indépendantes</b>.' }
    ],
    question: { q: 'Dans un montage en série, on dévisse une lampe. Les autres :', o: ['brillent plus fort', 'brillent toujours', 's’éteignent', 'clignotent'], a: 2, e: 'La boucle unique est ouverte : le courant ne passe plus.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Circuit avec un générateur, un interrupteur et une, deux ou trois lampes montées en série ou en dérivation ; on clique sur une lampe pour la dévisser ; un schéma normalisé et des observations sont affichés à droite',
    steps: [
      'Monte 1, 2 puis 3 lampes en série : comment évolue l’éclat ?',
      'Clique sur une lampe pour la dévisser : que deviennent les autres ?',
      'Recommence en dérivation et compare.',
      'Avec 2 lampes en série, essaie un générateur 12 V. Relève tes observations.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onUnscrew: function (i, r) { api.sound('tick'); }, onToggle: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Montage', value: 'serie', options: [{ v: 'serie', l: 'En série' }, { v: 'der', l: 'En dérivation' }], onChange: function (v) { st.mode = v; st.removed = [false, false, false]; } });
      var cN = c.seg({ label: 'Nombre de lampes', value: 2, options: [{ v: 1, l: '1 lampe' }, { v: 2, l: '2 lampes' }, { v: 3, l: '3 lampes' }], onChange: function (v) { st.n = v; st.removed = [false, false, false]; } });
      var cU = c.seg({ label: 'Générateur', value: 6, options: [{ v: 6, l: '6 V' }, { v: 12, l: '12 V' }], onChange: function (v) { st.U = v; } });
      var r1 = c.row(); c.button({ label: 'Revisser toutes les lampes', sm: true, into: r1, onClick: function () { st.removed = [false, false, false]; } }); c.button({ label: 'Ouvrir / fermer K', sm: true, into: r1, onClick: function () { st.closed = !st.closed; } });
      var tS = c.toggle({ label: 'Schéma normalisé', value: true, onChange: function (v) { st.schema = v; } });
      var ro = api.readouts([{ k: 'm', label: 'Montage' }, { k: 'l', label: 'Lampes allumées' }, { k: 'u', label: 'Tension par lampe' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.m.set(st.mode === 'serie' ? 'série' : 'dérivation'); ro.l.set(last.lit + ' / ' + st.n); var u = last.sol.V.filter(function (x) { return x > 0; })[0]; ro.u.set(u ? E.v(u) : '0 V'); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var b0 = last.sol.states.filter(function (x, i) { return !st.removed[i]; })[0]; rows.push({ m: (st.mode === 'serie' ? 'série' : 'dérivation') + ', ' + st.n + ' L, ' + E.v(st.U), d: last.nRm, o: last.lit + ' allumée(s)' + (last.lit && b0 ? ' · ' + b0.t.split(' : ')[0] : '') }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Montage</th><th>Dévissées</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.m + '</td><td>' + r.d + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>';
        api.chart.innerHTML = '<h3>Série ou dérivation ?</h3><table class="mt"><thead><tr><th></th><th>Série</th><th>Dérivation</th></tr></thead><tbody><tr><td>Boucles</td><td>une seule</td><td>plusieurs</td></tr><tr><td>Éclat</td><td>plus faible</td><td>normal</td></tr><tr><td>Une lampe dévissée</td><td>tout s’éteint</td><td>les autres brillent</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'serie'; st.n = 2; st.U = 6; st.closed = true; st.removed = [false, false, false]; st.schema = true; cM.set('serie'); cN.set(2); cU.set(6); tS.set(true); rows = []; paint(); });
      api.say('Clique sur une lampe pour la dévisser.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations (série et dérivation).</p>';
        return '<p><b>En série</b>, les lampes sont dans une seule boucle : plus il y a de lampes, plus elles brillent faiblement (la tension du générateur se partage). Si une lampe est dévissée, la boucle est ouverte et <b>toutes s’éteignent</b>.</p><p><b>En dérivation</b>, chaque lampe est dans sa propre boucle : elle reçoit la tension du générateur, brille <b>normalement</b> et fonctionne <b>indépendamment</b> des autres.</p><p>Deux lampes 6 V en série sur un générateur 12 V brillent normalement : chacune reçoit 6 V.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit avec des lampes' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi des guirlandes',
    intro: 'Série ou dérivation ? Allume (ou éteins) les bonnes lampes !',
    missions: [
      { title: 'Indépendantes', text: 'Monte <b>3 lampes</b> pour qu’elles brillent <span style="color:#3DD68C">normalement</span> toutes les trois.', lumi: 'Chaque lampe doit recevoir 6 V.', hint: 'En dérivation, chaque lampe reçoit la tension du générateur.',
        build: function (api) { var lab = mini(api, { mode: 'serie', n: 3 }); api.c.seg({ label: 'Montage', value: 'serie', options: [{ v: 'serie', l: 'En série' }, { v: 'der', l: 'En dérivation' }], onChange: function (v) { lab.st.mode = v; } }); return function () { var r = lab.res(); return r.lit === 3 && r.sol.states.every(function (x) { return x.k === 'ok'; }) ? { ok: true, msg: 'En dérivation, chaque lampe brille normalement.' } : { ok: false, msg: r.lit ? 'Elles brillent trop faiblement.' : 'Aucune lampe ne brille.' }; }; },
        e: 'En dérivation, chaque lampe reçoit 6 V : éclat normal.' },
      { title: 'Le test', text: 'Ces lampes sont-elles en série ? <b>Prouve-le</b> en dévissant une lampe de façon à éteindre <span style="color:var(--amber)">toutes</span> les lampes.', lumi: 'Clique sur une lampe pour la dévisser.', hint: 'En série, n’importe quelle lampe suffit.',
        build: function (api) { var lab = mini(api, { mode: 'serie', n: 3, U: 12 }); return function () { var r = lab.res(); return r.lit === 0 && r.nRm === 1 ? { ok: true, msg: 'Une seule lampe dévissée et tout s’éteint : montage en série !' } : { ok: false, msg: r.nRm > 1 ? 'Une seule lampe suffit : revisse les autres.' : 'Dévisse une lampe.' }; }; },
        e: 'En série, une lampe dévissée ouvre l’unique boucle.' },
      { type: 'qcm', title: 'À la maison', text: 'Dans une maison, on éteint la lampe du salon : la télévision reste allumée. Les appareils sont branchés :', o: ['en série', 'en dérivation', 'en court-circuit', 'sans fil'], a: 1, hint: 'Ils sont indépendants.', e: 'Les appareils domestiques sont en dérivation : chacun a sa boucle.' },
      { title: 'Deux lampes, 12 V', text: 'Avec un générateur <b>12 V</b> et deux lampes 6 V, trouve le montage où elles brillent normalement <span style="color:var(--amber)">sans surtension</span>.', lumi: 'En dérivation, chaque lampe recevrait 12 V…', hint: 'En série, la tension se partage.',
        build: function (api) { var lab = mini(api, { mode: 'der', n: 2, U: 12 }); api.c.seg({ label: 'Montage', value: 'der', options: [{ v: 'serie', l: 'En série' }, { v: 'der', l: 'En dérivation' }], onChange: function (v) { lab.st.mode = v; } }); return function () { var r = lab.res(); return r.mode === 'serie' && r.lit === 2 && r.sol.states.every(function (x) { return x.k === 'ok'; }) ? { ok: true, msg: '6 V pour chaque lampe : éclat normal !' } : { ok: false, msg: 'Chaque lampe reçoit 12 V : forte surtension !' }; }; },
        e: 'En série, les 12 V se partagent : 6 V par lampe.' },
      { type: 'qcm', title: 'Combien de boucles ?', text: 'Un circuit en série comporte :', o: ['une seule boucle', 'deux boucles', 'autant de boucles que de lampes', 'aucune boucle'], a: 0, hint: 'Le courant n’a qu’un chemin.', e: 'En série, il n’y a qu’une seule boucle.' }
    ]
  };

  S.start({
    inquiry: {
      situation: 'Pour éclairer une maquette, Awa utilise une pile de 6 V et deux lampes identiques de tension nominale 6 V. Elle souhaite que la seconde lampe reste allumée lorsque la première est dévissée. Quel montage choisir ?',
      prediction: 'Prévois ce qui se passera en série puis en dérivation. Explique pourquoi. Pendant les essais, garde la pile à 6 V et utilise deux lampes.'
    },
    id: '5e-association-lampes', level: '5e', theme: 'Électricité', title: 'Association de lampes électriques', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Des lampes sont <b>en série</b> lorsqu’elles forment avec le générateur <b>une seule boucle</b>.',
      'En série, les lampes brillent moins qu’une lampe seule ; si une lampe est dévissée (ou grillée), <b>toutes les lampes s’éteignent</b>.',
      'Des lampes sont <b>en dérivation</b> lorsqu’elles forment <b>plusieurs boucles</b> avec le générateur.',
      'En dérivation, chaque lampe brille normalement et fonctionne <b>indépendamment</b> des autres.',
      'Dans une installation domestique, les appareils sont branchés <b>en dérivation</b>.'
    ],
    quiz: [
      { q: 'Deux lampes en série :', o: ['forment deux boucles', 'forment une seule boucle', 'ne s’allument jamais', 'sont toujours plus brillantes'], a: 1, e: 'Le courant n’a qu’un seul chemin.' },
      { q: 'En dérivation, une lampe grille. Les autres :', o: ['s’éteignent', 'continuent de briller', 'grillent aussi', 'brillent moins'], a: 1, e: 'Chaque lampe a sa propre boucle.' },
      { q: 'Trois lampes identiques de tension nominale 6 V, branchées en série sur un générateur de 6 V, brillent :', o: ['normalement', 'faiblement', 'trop fort', 'pas du tout'], a: 1, e: 'La tension se partage entre les trois lampes.' },
      { q: 'Les prises d’une maison sont montées :', o: ['en série', 'en dérivation', 'au hasard', 'en boucle unique'], a: 1, e: 'Chaque appareil fonctionne indépendamment.' },
      { q: 'Sur un schéma, le symbole d’une lampe est :', o: ['un rectangle', 'un cercle avec une croix', 'deux traits parallèles', 'un triangle'], a: 1, e: 'Cercle barré d’une croix.' }
    ]
  });
})();
