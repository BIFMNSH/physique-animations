/* 6e · Propriétés physiques de la matière · Leçon : Solides et liquides */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var SUB = {
    cube: { n: 'cube de bois', t: 'compact', c: '#C8A46A' }, caillou: { n: 'caillou', t: 'compact', c: '#8D96A8' },
    sable: { n: 'sable', t: 'poudre', c: '#E2C27D' }, sel: { n: 'sel fin', t: 'poudre', c: '#F4F6FA' },
    eau: { n: 'eau', t: 'liquide', c: '#4FA8FF' }, huile: { n: 'huile', t: 'liquide', c: '#F2C94C' }, lait: { n: 'lait', t: 'liquide', c: '#F4F1E8' }
  };
  var CONT = {
    becher: { n: 'bécher', p: [[-60, 0], [60, 0], [60, -150], [-60, -150]] },
    verre: { n: 'verre à pied', p: [[-6, -60], [6, -60], [58, -180], [-58, -180]], stem: true },
    eprouvette: { n: 'éprouvette', p: [[-22, 0], [22, 0], [22, -210], [-22, -210]] },
    assiette: { n: 'assiette creuse', p: [[-70, 0], [70, 0], [112, -34], [-112, -34]] },
    bouteille: { n: 'bouteille', p: [[-46, 0], [46, 0], [46, -120], [16, -160], [16, -205], [-16, -205], [-16, -160], [-46, -120]] }
  };
  var VOL = 4300, OX = 290, OY = 380;
  function rot(p, a) { var c = Math.cos(a), sn = Math.sin(a); return [OX + p[0] * c - p[1] * sn, OY + p[0] * sn + p[1] * c]; }
  function area(P) { var A = 0; for (var i = 0; i < P.length; i++) { var j = (i + 1) % P.length; A += P[i][0] * P[j][1] - P[j][0] * P[i][1]; } return Math.abs(A) / 2; }
  function clipBelow(P, L) { var out = []; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length], ia = a[1] >= L, ib = b[1] >= L; if (ia) out.push(a); if (ia !== ib) { var t = (L - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, L]); } } return out; }
  function level(P, V) { var ys = P.map(function (p) { return p[1]; }), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys); for (var k = 0; k < 40; k++) { var m = (lo + hi) / 2; if (area(clipBelow(P, m)) > V) lo = m; else hi = m; } return (lo + hi) / 2; }
  function d(P) { return 'M' + P.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') + 'Z'; }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  var GID = 0;

  function Lab(G, o) {
    var st = Object.assign({ sub: 'eau', cont: 'becher', tilt: 0, seen: {}, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 60, y: 392, width: 460, height: 12, rx: 4, fill: '#3A4560' }, G);
    var hor = s('line', { x1: 120, x2: 460, stroke: '#3DD68C', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0 }, G), horT = s('text', { x: 466, 'font-size': 11, 'font-weight': 800, fill: '#3DD68C', text: 'horizontale' }, G);
    var liq = s('path', { opacity: 0.85 }, G), surf = s('line', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.5 }, G);
    var RG = s('g', {}, G), defsC = s('defs', {}, G), cpId = 'sl' + (GID++), cp = s('clipPath', { id: cpId }, defsC), cpP = s('path', {}, cp);
    var inner = s('g', { 'clip-path': 'url(#' + cpId + ')' }, RG), heap = s('path', {}, inner), grains = s('g', {}, inner), GR = [];
    for (var i = 0; i < 90; i++) GR.push(s('circle', { r: 1.6, fill: '#00000033' }, grains));
    var cube = s('g', {}, RG), cubeR = s('rect', { x: -32, y: -64, width: 64, height: 64, rx: 4, stroke: '#00000044', 'stroke-width': 2 }, cube), stone = s('path', { d: 'M-40 0 q-6 -30 18 -44 q26 -12 46 6 q14 18 4 38z', stroke: '#00000044', 'stroke-width': 2 }, cube);
    var glass = s('path', { fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, RG), stem = s('path', { d: 'M-6 -60 V-4 M-40 0 H40', stroke: '#BFE6FF', 'stroke-width': 4, fill: 'none' }, RG);
    var lab1 = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, G);
    /* panneau */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pn = s('text', { x: PX + 140, y: 54, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#EEF2F8' }, P), pe = s('text', { x: PX + 140, y: 78, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800 }, P);
    var rowsP = ['Forme propre', 'Volume propre', 'Prend la forme du récipient', 'Surface libre horizontale'].map(function (l, k) { var y = 112 + k * 34; s('text', { x: PX + 20, y: y, 'font-size': 12.5, fill: '#C9D2E3', text: l }, P); return s('text', { x: PX + 260, y: y, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 900 }, P); });
    var pv = s('text', { x: PX + 140, y: 262, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    s('text', { x: PX + 20, y: 292, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lpS = TK.particles(P, PX + 20, 300, 240, 136, 'solide', '#C8A46A'), lpL = TK.particles(P, PX + 20, 300, 240, 136, 'liquide', '#4FA8FF');
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, Sb = SUB[st.sub], C = CONT[st.cont], a = st.tilt * Math.PI / 180;
      var W = C.p.map(function (p) { return rot(p, a); });
      RG.setAttribute('transform', 'translate(' + OX + ' ' + OY + ') rotate(' + st.tilt + ')');
      var oi = (st.cont === 'bouteille' ? 4 : 2) + 1, PP = C.p.slice(oi).concat(C.p.slice(0, oi)); glass.setAttribute('d', 'M' + PP.map(function (p) { return p.join(' '); }).join(' L')); stem.style.display = C.stem ? '' : 'none';
      cpP.setAttribute('d', d(C.p));
      var isL = Sb.t === 'liquide', isP = Sb.t === 'poudre', isC = Sb.t === 'compact';
      liq.style.display = surf.style.display = isL ? '' : 'none'; heap.style.display = grains.style.display = isP ? '' : 'none'; cube.style.display = isC ? '' : 'none';
      var spill = false, Lw = 0;
      if (isL) {
        var cap = area(W), V = Math.min(VOL, cap * 0.98); spill = VOL > cap * 0.98;
        Lw = level(W, V); var Q = clipBelow(W, Lw); liq.setAttribute('d', d(Q)); liq.setAttribute('fill', Sb.c);
        var xs = Q.filter(function (p) { return Math.abs(p[1] - Lw) < 0.6; }).map(function (p) { return p[0]; }); if (xs.length >= 2) attr(surf, { x1: Math.min.apply(null, xs), x2: Math.max.apply(null, xs), y1: Lw, y2: Lw });
        hor.setAttribute('opacity', Math.abs(st.tilt) > 2 ? 0.9 : 0); attr(hor, { y1: Lw, y2: Lw }); attr(horT, { y: Lw - 6 }); horT.style.display = Math.abs(st.tilt) > 2 ? '' : 'none';
      } else { hor.setAttribute('opacity', 0); horT.style.display = 'none'; }
      if (isP) {
        var Lp = level(C.p, VOL), h = -Lp; heap.setAttribute('d', 'M-200 4 L-200 ' + (-h + 6) + ' Q0 ' + (-h - 34) + ' 200 ' + (-h + 6) + ' L200 4Z'); heap.setAttribute('fill', Sb.c);
        GR.forEach(function (c, k) { attr(c, { cx: -110 + rnd(k, 1) * 220, cy: -rnd(k, 2) * (h + 8) }); });
      }
      if (isC) { cubeR.style.display = st.sub === 'cube' ? '' : 'none'; stone.style.display = st.sub === 'caillou' ? '' : 'none'; cubeR.setAttribute('fill', Sb.c); stone.setAttribute('fill', Sb.c); var by = C.stem ? -64 : 0, sc = st.cont === 'eprouvette' ? 0.6 : 1; cube.setAttribute('transform', 'translate(0 ' + by + ') scale(' + sc + ')'); }
      st.seen[st.sub + '|' + st.cont] = 1;
      lab1.textContent = spill ? 'Le récipient déborde !' : isL ? (Math.abs(st.tilt) > 2 ? 'Récipient incliné : la surface libre reste horizontale' : 'Le liquide prend la forme du récipient') : isP ? 'Le sable prend la forme du fond… mais chaque grain est un solide' : 'Le solide garde sa forme, quel que soit le récipient';
      if (isP) lab1.textContent = Sb.n === 'sel fin' ? 'Le sel prend la forme du fond… mais chaque grain est un solide' : lab1.textContent;
      pn.textContent = Sb.n; pe.textContent = isL ? 'LIQUIDE' : isP ? 'SOLIDE EN GRAINS (POUDRE)' : 'SOLIDE COMPACT'; pe.setAttribute('fill', isL ? '#4FC3FF' : '#FFB547');
      var vals = isL ? ['non', 'oui', 'oui', 'oui'] : isP ? ['grain : oui', 'oui', 'en partie', 'non'] : ['oui', 'oui', 'non', '—'];
      rowsP.forEach(function (r, k) { r.textContent = vals[k]; r.setAttribute('fill', vals[k] === 'oui' ? '#3DD68C' : vals[k] === 'non' ? '#FF8A80' : '#FFC773'); });
      pv.textContent = 'dans : ' + C.n + (st.tilt ? ' incliné de ' + Math.abs(st.tilt) + '°' : '');
      lpS.g.style.display = isL ? 'none' : ''; lpL.g.style.display = isL ? '' : 'none'; (isL ? lpL : lpS).set(0.15, T);
      var nc = Object.keys(st.seen).filter(function (k) { return k.split('|')[0] === st.sub; }).length;
      return { type: Sb.t, sub: st.sub, cont: st.cont, tilt: st.tilt, Lw: Lw, nCont: nc, spill: spill };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les solides compacts' }, { t: 12, title: 'Les solides en poudre' }, { t: 24, title: 'Les liquides' }, { t: 37, title: 'La surface libre' }, { t: 48, title: 'Les particules' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un <b>solide</b> a une <b>forme propre</b>', 'et un volume propre ; les poudres sont faites de petits solides.', '#FFB547'],
      ['Un <b>liquide</b> n’a <b>pas de forme propre</b>', 'il prend la forme du récipient, mais garde son volume.', 'var(--blue)'],
      ['Au repos, la <b>surface libre</b> d’un liquide', 'est <b>plane et horizontale</b>, même si on incline le récipient.', '#3DD68C']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    var cs = ['becher', 'verre', 'eprouvette', 'assiette', 'bouteille'];
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 12) { st.sub = 'cube'; st.cont = cs[Math.min(2, Math.floor(t / 4))]; st.tilt = 0; }
        else if (t < 24) { st.sub = 'sable'; st.cont = t < 18 ? 'becher' : 'becher'; st.tilt = t < 18 ? 0 : 25 * K.k(t, 18.5, 2); }
        else if (t < 37) { st.sub = 'eau'; st.cont = cs[Math.min(4, Math.floor((t - 24) / 2.6))]; st.tilt = 0; }
        else if (t < 48) { st.sub = 'eau'; st.cont = 'becher'; st.tilt = 28 * Math.sin((t - 37) / 11 * Math.PI * 2) * K.k(t, 37.4, 1.5); }
        else { st.sub = t < 52.5 ? 'cube' : 'eau'; st.cont = 'becher'; st.tilt = 0; }
        lab.step();
        tg.show(t, 1, 11.6, 290, 92, 'Le cube garde sa forme') || tg.show(t, 13, 17.6, 290, 92, 'Le sable prend la forme du fond…') || tg.show(t, 18.6, 23.6, 290, 92, '…mais sa surface n’est pas horizontale') ||
          tg.show(t, 25, 36.6, 290, 92, 'Même volume, formes différentes') || tg.show(t, 38, 47.6, 290, 92, 'La surface libre reste horizontale') || tg.show(t, 48.6, 52.2, 290, 92, 'Solide : particules ordonnées, liées') || tg.show(t, 52.8, 56.6, 290, 92, 'Liquide : particules qui glissent');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un cube de bois placé dans différents récipients garde sa forme ; du sable prend la forme du fond mais reste en tas quand on incline ; de l’eau versée dans un bécher, un verre, une éprouvette, une assiette et une bouteille prend leur forme ; on incline le bécher et la surface libre reste horizontale ; à droite, une loupe sur les particules',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Plaçons un cube de bois dans un bécher, puis dans un verre, puis dans une éprouvette.', sub: 'Un cube dans différents récipients…' },
      { t: 6.2, d: 5.6, say: 'Il garde toujours la même forme : un solide a une forme propre et un volume propre.', sub: 'Un <b>solide</b> a une <b>forme propre</b>.' },
      { t: 12, d: 6, say: 'Le sable, lui, semble prendre la forme du fond du récipient.', sub: 'Le sable prend la forme du fond…' },
      { t: 18.2, d: 5.6, say: 'Mais si on incline, il reste en tas : chaque grain de sable est un petit solide. C’est un solide en poudre.', sub: '…c’est un <b>solide en grains</b>.' },
      { t: 24, d: 12.6, say: 'Versons la même quantité d’eau dans différents récipients. Elle prend à chaque fois la forme du récipient : un liquide n’a pas de forme propre. Mais son volume ne change pas.', sub: 'Un <b>liquide</b> prend la forme du récipient, son <b>volume</b> ne change pas.' },
      { t: 37, d: 10.6, say: 'Inclinons le bécher : la surface de l’eau reste toujours plane et horizontale. C’est la surface libre du liquide.', sub: 'La <b>surface libre</b> reste <b>plane et horizontale</b>.' },
      { t: 48, d: 4.4, say: 'Dans un solide, les particules sont serrées et liées, elles gardent leur place.', sub: 'Solide : particules liées et ordonnées.' },
      { t: 52.6, d: 4.4, say: 'Dans un liquide, elles sont serrées mais glissent les unes sur les autres.', sub: 'Liquide : particules qui glissent.' },
      { t: 57, d: 4.4, say: 'À retenir : un solide a une forme propre.', sub: 'Solide : <b>forme propre</b>.' },
      { t: 61.6, d: 4.2, say: 'Un liquide prend la forme du récipient qui le contient.', sub: 'Liquide : forme du récipient.' },
      { t: 66, d: 4, say: 'Au repos, sa surface libre est plane et horizontale.', sub: 'Surface libre <b>horizontale</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'Un <b>solide</b> a une forme propre et un volume propre.' },
      { t: 23, ch: 1, html: 'Le sable, le sel : des <b>solides en grains</b>.' },
      { t: 36, ch: 2, html: 'Un <b>liquide</b> prend la forme du récipient ; son volume est constant.' },
      { t: 47, ch: 3, html: '<b>Surface libre</b> : plane et horizontale au repos.' }
    ],
    question: { q: 'Quand on incline un verre d’eau, la surface libre :', o: ['s’incline avec le verre', 'reste horizontale', 'devient verticale', 'disparaît'], a: 1, e: 'Au repos, la surface libre d’un liquide est horizontale.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Paillasse : on choisit une matière (cube de bois, caillou, sable, sel, eau, huile, lait) et un récipient (bécher, verre à pied, éprouvette, assiette, bouteille), et on peut incliner le récipient ; une fiche indique les propriétés et une loupe montre les particules',
    steps: [
      'Place le cube puis le caillou dans différents récipients : changent-ils de forme ?',
      'Verse l’eau dans chaque récipient : que remarques-tu ? Son volume change-t-il ?',
      'Incline le récipient : observe la surface libre de l’eau, puis du sable.',
      'Teste toutes les matières et relève tes observations.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cS = c.seg({ label: 'Matière', value: 'eau', options: Object.keys(SUB).map(function (k) { return { v: k, l: SUB[k].n }; }), onChange: function (v) { st.sub = v; api.sound('tick'); } });
      var cC = c.seg({ label: 'Récipient', value: 'becher', options: Object.keys(CONT).map(function (k) { return { v: k, l: CONT[k].n }; }), onChange: function (v) { st.cont = v; api.sound('tick'); } });
      var sT = c.slider({ label: 'Inclinaison du récipient', min: -35, max: 35, step: 1, value: 0, unit: '°', onInput: function (v) { st.tilt = v; } });
      var ro = api.readouts([{ k: 'e', label: 'État' }, { k: 'o', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.e.set(last.type === 'liquide' ? 'liquide' : last.type === 'poudre' ? 'solide en grains' : 'solide compact'); ro.o.set(last.type === 'liquide' ? (Math.abs(st.tilt) > 2 ? 'surface horizontale' : 'forme du récipient') : last.type === 'poudre' ? 'reste en tas' : 'garde sa forme'); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cette matière'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows = rows.filter(function (r) { return r.k !== st.sub; }); rows.push({ k: st.sub, n: SUB[st.sub].n, t: last.type }); api.sound('ok'); paint(); if (rows.length >= 5) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Matière</th><th>État</th><th>Forme propre ?</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.n + '</td><td>' + (r.t === 'liquide' ? 'liquide' : 'solide' + (r.t === 'poudre' ? ' en grains' : '')) + '</td><td>' + (r.t === 'liquide' ? 'non' : 'oui') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune matière relevée.</div>';
        api.chart.innerHTML = '<h3>Solide ou liquide ?</h3><table class="mt"><thead><tr><th></th><th>Solide</th><th>Liquide</th></tr></thead><tbody><tr><td>Forme propre</td><td>oui</td><td>non</td></tr><tr><td>Volume propre</td><td>oui</td><td>oui</td></tr><tr><td>Surface libre</td><td>—</td><td>plane, horizontale</td></tr><tr><td>Particules</td><td>liées, ordonnées</td><td>serrées, mobiles</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.sub = 'eau'; st.cont = 'becher'; st.tilt = 0; st.seen = {}; cS.set('eau'); cC.set('becher'); sT.set(0); rows = []; paint(); });
      api.say('Verse l’eau dans différents récipients, puis incline-les.');
      return { bilan: function () {
        if (rows.length < 4) return '<p>Relève au moins 4 matières différentes.</p>';
        return '<p>Un <b>solide</b> a une <b>forme propre</b> et un <b>volume propre</b> : on peut le saisir avec les doigts. Le sable ou le sel sont des solides en grains (poudres) : chaque grain est un petit solide, et ils ne forment pas de surface horizontale quand on incline.</p><p>Un <b>liquide</b> n’a pas de forme propre : il prend la forme du récipient, mais garde son <b>volume</b>. Au repos, sa <b>surface libre</b> est <b>plane et horizontale</b>, même si le récipient est incliné.</p><p>Dans un solide, les particules sont liées et ordonnées ; dans un liquide, elles sont serrées mais glissent les unes sur les autres.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Solides et liquides' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi des récipients',
    intro: 'Verse, incline, compare : solides et liquides n’auront plus de secrets !',
    missions: [
      { title: 'Le plus haut', text: 'Verse l’eau dans le récipient où sa <span style="color:#4FC3FF">surface libre</span> monte le plus haut.', lumi: 'Même volume, récipient étroit…', hint: 'Le plus étroit des récipients.',
        build: function (api) { var lab = mini(api, { sub: 'eau', cont: 'assiette' }); api.c.seg({ label: 'Récipient', value: 'assiette', options: Object.keys(CONT).map(function (k) { return { v: k, l: CONT[k].n }; }), onChange: function (v) { lab.st.cont = v; } }); return function () { var r = lab.res(); return r.cont === 'eprouvette' ? { ok: true, msg: 'Dans l’éprouvette étroite, l’eau monte très haut.' } : { ok: false, msg: 'Un récipient plus étroit ferait monter l’eau plus haut.' }; }; },
        e: 'Le volume ne change pas : plus le récipient est étroit, plus le niveau est haut.' },
      { type: 'qcm', title: 'Forme propre', text: 'Un liquide :', o: ['a une forme propre', 'prend la forme du récipient', 'n’a pas de volume', 'est toujours bleu'], a: 1, hint: 'Pense à l’eau dans la bouteille.', e: 'Il n’a pas de forme propre.' },
      { title: 'Penche !', text: 'Incline le bécher d’au moins <b>20°</b> et observe la surface de l’eau.', lumi: 'Regarde la ligne verte.', hint: 'Utilise le curseur d’inclinaison.',
        build: function (api) { var lab = mini(api, { sub: 'eau', cont: 'becher' }); api.c.slider({ label: 'Inclinaison', min: -35, max: 35, step: 1, value: 0, unit: '°', onInput: function (v) { lab.st.tilt = v; } }); return function () { var r = lab.res(); return Math.abs(r.tilt) >= 20 ? { ok: true, msg: 'Le bécher penche, mais la surface libre reste horizontale !' } : { ok: false, msg: 'Incline davantage.' }; }; },
        e: 'La surface libre d’un liquide au repos est toujours horizontale.' },
      { type: 'qcm', title: 'Le sable', text: 'Le sable est :', o: ['un liquide', 'un solide en grains', 'un gaz', 'ni solide ni liquide'], a: 1, hint: 'Observe un grain à la loupe.', e: 'Chaque grain est un petit solide.' },
      { title: 'Têtu', text: 'Trouve une matière qui <b>garde sa forme</b> et essaie-la dans <b>3 récipients</b> différents.', lumi: 'Un solide compact…', hint: 'Le cube ou le caillou.',
        build: function (api) { var lab = mini(api, { sub: 'eau', cont: 'becher', seen: {} }); api.c.seg({ label: 'Matière', value: 'eau', options: Object.keys(SUB).map(function (k) { return { v: k, l: SUB[k].n }; }), onChange: function (v) { lab.st.sub = v; } }); api.c.seg({ label: 'Récipient', value: 'becher', options: Object.keys(CONT).map(function (k) { return { v: k, l: CONT[k].n }; }), onChange: function (v) { lab.st.cont = v; } }); return function () { var r = lab.res(); return r.type === 'compact' && r.nCont >= 3 ? { ok: true, msg: 'Il garde sa forme partout : c’est un solide.' } : { ok: false, msg: r.type !== 'compact' ? 'Cette matière ne garde pas sa forme.' : 'Essaie encore ' + (3 - r.nCont) + ' récipient(s).' }; }; },
        e: 'Un solide compact a une forme propre.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On transfère différents échantillons entre des récipients. Quelles propriétés permettent de distinguer un solide d’un liquide ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-solides-liquides', level: '6e', theme: 'Propriétés physiques de la matière', title: 'Solides et liquides', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La matière peut exister à l’état <b>solide</b>, <b>liquide</b> ou <b>gazeux</b>.',
      'Un <b>solide</b> a une <b>forme propre</b> et un volume propre ; on peut le saisir avec les doigts. Les poudres (sable, sel, farine) sont des solides en grains.',
      'Un <b>liquide</b> n’a pas de forme propre : il prend la forme du récipient qui le contient ; il a un <b>volume propre</b>. On peut le verser (transvaser).',
      'Au repos, la <b>surface libre</b> d’un liquide est <b>plane et horizontale</b>.',
      'Dans un solide, les particules sont liées et ordonnées ; dans un liquide, elles sont serrées mais peuvent glisser les unes sur les autres.'
    ],
    quiz: [
      { q: 'Un caillou est :', o: ['un liquide', 'un solide', 'un gaz', 'une poudre'], a: 1, e: 'Il a une forme propre.' },
      { q: 'L’eau versée dans une bouteille :', o: ['garde la forme du verre', 'prend la forme de la bouteille', 'change de volume', 'devient solide'], a: 1, e: 'Un liquide prend la forme du récipient.' },
      { q: 'La surface libre d’un liquide au repos est :', o: ['inclinée', 'plane et horizontale', 'bombée', 'verticale'], a: 1, e: 'Toujours horizontale.' },
      { q: 'Le sel fin est :', o: ['un liquide', 'un solide en grains', 'un gaz', 'de l’eau'], a: 1, e: 'Chaque grain est solide.' },
      { q: 'Quand on transvase un liquide, son volume :', o: ['augmente', 'diminue', 'ne change pas', 'devient nul'], a: 2, e: 'Il a un volume propre.' }
    ]
  });
})();

