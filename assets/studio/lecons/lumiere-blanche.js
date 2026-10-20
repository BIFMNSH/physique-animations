/* 4e · Optique · Leçon : Analyse et synthèse de la lumière blanche */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var BANDS = [['rouge', '#FF3B30', 'R'], ['orange', '#FF9500', 'R'], ['jaune', '#FFE600', 'RG'], ['vert', '#34C759', 'G'], ['cyan', '#32D3E6', 'GB'], ['bleu', '#2F6BFF', 'B'], ['violet', '#8E44FF', 'B']];
  var FILTERS = { none: { l: 'aucun', ch: 'RGB' }, R: { l: 'rouge', ch: 'R' }, G: { l: 'vert', ch: 'G' }, B: { l: 'bleu', ch: 'B' }, Y: { l: 'jaune', ch: 'RG' }, C: { l: 'cyan', ch: 'GB' }, M: { l: 'magenta', ch: 'RB' } };
  function passes(band, ch) { for (var i = 0; i < band[2].length; i++) if (ch.indexOf(band[2][i]) < 0) return false; return true; }
  function nameOf(r, g, b) { var k = (r > 0.35 ? 'R' : '') + (g > 0.35 ? 'G' : '') + (b > 0.35 ? 'B' : ''); return { '': 'noir', R: 'rouge', G: 'vert', B: 'bleu', RG: 'jaune', GB: 'cyan', RB: 'magenta', RGB: 'blanc' }[k]; }
  function rgb(r, g, b) { return 'rgb(' + Math.round(255 * Math.min(1, r)) + ',' + Math.round(255 * Math.min(1, g)) + ',' + Math.round(255 * Math.min(1, b)) + ')'; }
  function chRGB(ch) { return [ch.indexOf('R') >= 0 ? 1 : 0, ch.indexOf('G') >= 0 ? 1 : 0, ch.indexOf('B') >= 0 ? 1 : 0]; }
  var FEM = { blanc: 'blanche', rouge: 'rouge', vert: 'verte', bleu: 'bleue', jaune: 'jaune', cyan: 'cyan', magenta: 'magenta', noir: 'noire' };
  var OBJ = [['T-shirt blanc', [1, 1, 1]], ['tomate rouge', [1, 0.08, 0.08]], ['feuille verte', [0.12, 1, 0.15]], ['ballon bleu', [0.1, 0.15, 1]]];
  var GID = 0;
  function glow(G, col) { var id = 'lb' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.45, 'stop-color': col, 'stop-opacity': 0.25 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'ana', prism: true, filter: 'none', labels: true, R: 1, G: 1, B: 1, objs: true }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#06080F' }, G);
    /* ---------- ANALYSE ---------- */
    var A = s('g', {}, G), YB = 235;
    s('rect', { x: 20, y: YB - 34, width: 70, height: 68, rx: 10, fill: '#2A3346', stroke: '#47546E', 'stroke-width': 2 }, A);
    s('circle', { cx: 60, cy: YB, r: 60, fill: glow(G, '#FFF6D6') }, A); s('circle', { cx: 60, cy: YB, r: 14, fill: '#FFF8E1' }, A);
    s('text', { x: 55, y: YB + 56, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'lampe' }, A);
    s('rect', { x: 108, y: YB - 50, width: 6, height: 42, fill: '#5B6680' }, A); s('rect', { x: 108, y: YB + 8, width: 6, height: 42, fill: '#5B6680' }, A);
    s('text', { x: 111, y: YB - 58, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3', text: 'fente' }, A);
    var beam1 = s('path', { d: 'M114 ' + (YB - 6) + 'L190 ' + (YB - 6) + 'L190 ' + (YB + 6) + 'L114 ' + (YB + 6) + 'Z', fill: '#FFFDF2', opacity: 0.9 }, A);
    var beam2 = s('path', { opacity: 0.85 }, A), beamIn = s('path', { opacity: 0.6 }, A);
    var filt = s('rect', { x: 186, y: YB - 46, width: 14, height: 92, rx: 3, opacity: 0.85 }, A), filtT = s('text', { x: 193, y: YB + 64, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#A9B4C7' }, A);
    var fan = s('g', { style: 'mix-blend-mode:screen' }, A), bandP = [], bandL = [], bandS = [];
    var XS = 770, Y0 = 118, BH = 30;
    BANDS.forEach(function (b, i) {
      bandP.push(s('path', { d: 'M408 ' + (YB - 4 + i * 1.4) + 'L' + XS + ' ' + (Y0 + i * BH) + 'L' + XS + ' ' + (Y0 + (i + 1) * BH) + 'L408 ' + (YB - 2 + i * 1.4) + 'Z', fill: b[1], opacity: 0.55 }, fan));
      bandS.push(s('rect', { x: XS, y: Y0 + i * BH, width: 20, height: BH, fill: b[1] }, A));
      bandL.push(s('text', { x: XS + 28, y: Y0 + i * BH + 20, 'font-size': 12, 'font-weight': 700, fill: b[1], text: b[0] }, A));
    });
    var prism = s('g', {}, A);
    s('path', { d: 'M360 150 L435 280 L285 280 Z', fill: '#9FD7FF', 'fill-opacity': 0.14, stroke: '#BFE6FF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, prism);
    s('text', { x: 360, y: 304, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#9AB4D8', text: 'prisme' }, prism);
    var spot = s('ellipse', { cx: XS + 10, cy: YB, rx: 10, ry: 14 }, A), straight = s('path', { opacity: 0.85 }, A);
    s('rect', { x: XS - 2, y: 80, width: 4, height: 300, fill: '#3A4560' }, A);
    s('text', { x: XS + 10, y: 72, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'écran' }, A);
    /* ---------- SYNTHÈSE ---------- */
    var Sg = s('g', {}, G);
    s('rect', { x: 250, y: 30, width: 590, height: 410, rx: 16, fill: '#0A0A0C', stroke: '#2B3A57', 'stroke-width': 2 }, Sg);
    s('text', { x: 545, y: 58, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#7D89A3', text: 'ÉCRAN BLANC DANS LE NOIR' }, Sg);
    var mix = s('g', { style: 'isolation:isolate' }, Sg), C = [];
    [[482, 180, '#FF2A2A'], [608, 180, '#2AFF4A'], [545, 289, '#2A5BFF']].forEach(function (p) { C.push(s('circle', { cx: p[0], cy: p[1], r: 108, fill: p[2], style: 'mix-blend-mode:screen' }, mix)); });
    var proj = [], PJ = [['R', '#FF3B30', 'rouge'], ['G', '#34C759', 'vert'], ['B', '#2F6BFF', 'bleu']];
    PJ.forEach(function (p, i) {
      var g = s('g', { transform: 'translate(30 ' + (62 + i * 64) + ')' }, Sg);
      s('rect', { x: 0, y: 0, width: 72, height: 46, rx: 9, fill: '#2A3346', stroke: '#47546E', 'stroke-width': 2 }, g);
      var lens = s('circle', { cx: 72, cy: 23, r: 14, fill: p[1] }, g);
      s('text', { x: 36, y: 28, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8', text: p[2] }, g);
      var pct = s('text', { x: 100, y: 28, 'font-size': 12, 'font-weight': 700, fill: '#A9B4C7' }, g);
      proj.push({ lens: lens, pct: pct });
    });
    var OB = s('g', {}, Sg);
    s('rect', { x: 20, y: 262, width: 214, height: 178, rx: 14, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, OB);
    s('text', { x: 127, y: 284, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'OBJETS SOUS CETTE LUMIÈRE' }, OB);
    var objE = [];
    objE.push(s('path', { d: 'M40 312 l18 -12 h14 q6 8 14 0 h14 l18 12 -10 14 -8 -5 v42 h-42 v-42 l-8 5z', stroke: '#222', 'stroke-width': 1 }, OB));
    objE.push(s('circle', { cx: 152, cy: 334, r: 24 }, OB)); s('path', { d: 'M146 310 q6 -6 12 0 q-6 4 -12 0z', fill: '#2E7D32' }, OB);
    objE.push(s('path', { d: 'M48 420 q10 -38 46 -30 q-6 34 -46 30z' }, OB));
    objE.push(s('circle', { cx: 160, cy: 404, r: 22 }, OB));
    var objT = s('text', { x: 127, y: 434, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7' }, OB);
    var mixT = s('text', { x: 545, y: 428, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#EEF2F8' }, Sg);

    function step() {
      var res = {};
      A.style.display = st.mode === 'ana' ? '' : 'none'; Sg.style.display = st.mode === 'syn' ? '' : 'none';
      if (st.mode === 'ana') {
        var F = FILTERS[st.filter], c = chRGB(F.ch), col = rgb(c[0], c[1], c[2]);
        filt.style.display = st.filter === 'none' ? 'none' : ''; filt.setAttribute('fill', col); filtT.textContent = st.filter === 'none' ? '' : 'filtre ' + F.l;
        prism.style.display = st.prism ? '' : 'none';
        var xe = st.prism ? 314 : XS;
        beam2.setAttribute('d', 'M190 ' + (YB - 6) + 'L' + xe + ' ' + (YB - 6) + 'L' + xe + ' ' + (YB + 6) + 'L190 ' + (YB + 6) + 'Z'); beam2.setAttribute('fill', col);
        beamIn.setAttribute('d', st.prism ? 'M314 ' + (YB - 6) + 'L408 ' + (YB - 4) + 'L408 ' + (YB + 6) + 'L314 ' + (YB + 6) + 'Z' : ''); beamIn.setAttribute('fill', col);
        var pass = [], n = 0;
        BANDS.forEach(function (b, i) { var ok = passes(b, F.ch); pass.push(ok); if (ok) n++; var on = st.prism && ok; bandP[i].style.display = on ? '' : 'none'; bandS[i].style.display = on ? '' : 'none'; bandL[i].style.display = on && st.labels ? '' : 'none'; });
        fan.style.display = st.prism ? '' : 'none';
        spot.style.display = st.prism ? 'none' : ''; spot.setAttribute('fill', col);
        res = { name: nameOf(c[0], c[1], c[2]), n: st.prism ? n : 0, pass: pass, beam: F.l === 'aucun' ? 'blanche' : FEM[F.l] };
      } else {
        var I = [st.R, st.G, st.B];
        C.forEach(function (e, i) { e.setAttribute('opacity', I[i]); proj[i].lens.setAttribute('opacity', 0.25 + 0.75 * I[i]); proj[i].pct.textContent = Math.round(I[i] * 100) + ' %'; });
        var nm = nameOf(st.R, st.G, st.B);
        OB.style.display = st.objs ? '' : 'none';
        objE.forEach(function (e, i) { var r = OBJ[i][1]; e.setAttribute('fill', rgb(r[0] * st.R, r[1] * st.G, r[2] * st.B)); });
        objT.textContent = nm === 'noir' ? 'aucune lumière' : 'en lumière ' + FEM[nm];
        mixT.textContent = 'Au centre : ' + nm;
        res = { name: nm, objs: OBJ.map(function (ob) { var r = ob[1]; return nameOf(r[0] * st.R, r[1] * st.G, r[2] * st.B); }) };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La lumière blanche' }, { t: 12, title: 'Le spectre' }, { t: 26, title: 'Les filtres' }, { t: 40, title: 'La synthèse' }, { t: 55, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { prism: false }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La lumière blanche est un <b>mélange</b>', 'un prisme la décompose en un spectre continu, du rouge au violet.', '#FFE600'],
      ['Un <b>filtre coloré</b> ne laisse passer', 'qu’une partie des lumières colorées : il absorbe les autres.', 'var(--blue)'],
      ['<b>Rouge + vert + bleu = blanc</b>', 'synthèse additive : rouge + vert = jaune, vert + bleu = cyan, rouge + bleu = magenta.', 'var(--amber)']], [55.2, 59.6, 64]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 55.2)) {
        st.mode = t < 40 ? 'ana' : 'syn'; st.prism = t > 6.4; st.labels = t > 14;
        st.filter = t < 27.5 ? 'none' : t < 31.5 ? 'R' : t < 35.5 ? 'G' : t < 39.5 ? 'C' : 'none';
        st.R = K.k(t, 41, 1); st.G = K.k(t, 43.4, 1); st.B = K.k(t, 46.4, 1); st.objs = t > 49;
        lab.step();
        tg.show(t, 1, 6, 450, 92, 'Sans prisme : une tache blanche') || tg.show(t, 7, 11.6, 450, 92, 'Le prisme décompose la lumière') || tg.show(t, 14, 25.6, 450, 92, 'Un spectre continu, du rouge au violet') ||
          tg.show(t, 28, 39.4, 450, 92, 'Filtre ' + FILTERS[st.filter].l + ' : il absorbe les autres couleurs');
      }
      bg.setAttribute('opacity', t > 54.8 ? 1 : 0);
      K.group(g5, t, 54.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une lampe, un prisme qui décompose la lumière blanche en spectre, des filtres colorés, puis trois projecteurs rouge, vert et bleu qui se superposent pour donner du blanc',
    duration: 69, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Éclairons un écran avec une lampe : on obtient une tache de lumière blanche.', sub: 'Une lampe éclaire l’écran : la tache est <b>blanche</b>.' },
      { t: 6.4, d: 5.4, say: 'Plaçons un prisme sur le trajet de la lumière… surprise !', sub: 'Plaçons un <b>prisme</b> sur le trajet…' },
      { t: 12, d: 6.6, say: 'La lumière blanche est décomposée en une multitude de lumières colorées : c’est son spectre.', sub: 'La lumière blanche est <b>décomposée</b> : c’est son <b>spectre</b>.' },
      { t: 18.8, d: 6.6, say: 'Rouge, orange, jaune, vert, bleu, violet : les couleurs se suivent sans interruption, le spectre est continu.', sub: 'Du <b>rouge</b> au <b>violet</b> : un spectre <b>continu</b>.' },
      { t: 26, d: 5.4, say: 'Un filtre rouge ne laisse passer que la lumière rouge : il absorbe les autres.', sub: 'Un <b>filtre rouge</b> ne laisse passer que le rouge.' },
      { t: 31.6, d: 7.6, say: 'Un filtre vert ne laisse passer que le vert ; un filtre cyan laisse passer le vert et le bleu.', sub: 'Un filtre <b>absorbe</b> une partie des lumières colorées.' },
      { t: 40, d: 6, say: 'Faisons l’inverse : superposons trois lumières, rouge, verte et bleue, sur un écran blanc.', sub: 'Superposons des lumières <b>rouge</b>, <b>verte</b> et <b>bleue</b>…' },
      { t: 46.4, d: 8.2, say: 'Rouge et vert donnent du jaune. Et les trois ensemble redonnent… du blanc ! C’est la synthèse additive.', sub: '…les trois ensemble donnent du <b>blanc</b> : c’est la <b>synthèse additive</b>.' },
      { t: 55, d: 4.4, say: 'À retenir : la lumière blanche est un mélange de lumières colorées.', sub: 'La lumière blanche est un <b>mélange</b>.' },
      { t: 59.6, d: 4.2, say: 'Un filtre coloré absorbe une partie de ces lumières.', sub: 'Un <b>filtre</b> absorbe une partie des lumières.' },
      { t: 64, d: 5, say: 'Rouge, vert et bleu superposés redonnent de la lumière blanche.', sub: 'Rouge + vert + bleu = <b>blanc</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'Un <b>prisme</b> décompose la lumière blanche.' },
      { t: 25, ch: 1, html: 'Spectre de la lumière blanche : <b>continu</b>, du rouge au violet.' },
      { t: 39, ch: 2, html: 'Un <b>filtre</b> coloré absorbe une partie des lumières colorées.' },
      { t: 54, ch: 3, html: '<b>Synthèse additive</b> : rouge + vert + bleu = blanc.' }
    ],
    question: { q: 'Que donne la superposition d’une lumière rouge et d’une lumière verte ?', o: ['du bleu', 'du jaune', 'du noir', 'du blanc'], a: 1, e: 'Rouge + vert = jaune (synthèse additive).' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Banc d’optique : lampe, fente, filtre, prisme et écran ; ou trois projecteurs rouge, vert et bleu superposés sur un écran',
    steps: [
      'Mode Analyse : retire puis remets le prisme. Qu’observes-tu sur l’écran ?',
      'Place différents filtres devant la lampe : quelles couleurs restent dans le spectre ?',
      'Mode Synthèse : allume les projecteurs un par un et note les couleurs obtenues.',
      'Observe les objets sous chaque lumière, puis relève tes résultats dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'ana', options: [{ v: 'ana', l: 'Analyse (prisme)' }, { v: 'syn', l: 'Synthèse (projecteurs)' }], onChange: function (v) { st.mode = v; vis(); } });
      var tP = c.toggle({ label: 'Prisme', value: true, onChange: function (v) { st.prism = v; } });
      var cF = c.seg({ label: 'Filtre devant la lampe', value: 'none', options: Object.keys(FILTERS).map(function (k) { return { v: k, l: FILTERS[k].l }; }), onChange: function (v) { st.filter = v; } });
      var tL = c.toggle({ label: 'Noms des couleurs', value: true, onChange: function (v) { st.labels = v; } });
      var sl = PJ0.map(function (p) { return c.slider({ label: 'Projecteur ' + p[1], min: 0, max: 100, step: 5, value: 100, unit: '%', onInput: function (v) { st[p[0]] = v / 100; } }); });
      function vis() { var a = st.mode === 'ana'; tP.hide(!a); cF.hide(!a); tL.hide(!a); sl.forEach(function (x) { x.hide(a); }); }
      vis();
      var ro = api.readouts([{ k: 'm', label: 'Expérience' }, { k: 'n', label: 'Couleurs du spectre' }, { k: 'c', label: 'Couleur obtenue' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.m.set(st.mode === 'ana' ? 'analyse' : 'synthèse'); ro.n.set(st.mode === 'ana' ? (st.prism ? last.n + ' / 7' : '—') : '—'); ro.c.set(st.mode === 'ana' ? 'lumière ' + last.beam : last.name); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cette expérience'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () {
        if (st.mode === 'ana') rows.push({ a: 'Filtre ' + FILTERS[st.filter].l + (st.prism ? '' : ' (sans prisme)'), r: st.prism ? BANDS.filter(function (b, i) { return last.pass[i]; }).map(function (b) { return b[0]; }).join(', ') || 'rien' : 'tache ' + last.name });
        else rows.push({ a: PJ0.filter(function (p) { return st[p[0]] > 0.35; }).map(function (p) { return p[1]; }).join(' + ') || 'aucun projecteur', r: last.name });
        api.sound('ok'); paint(); if (rows.length >= 4) api.done();
      };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.a + '</td><td>' + r.r + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation relevée.</div>';
        api.chart.innerHTML = '<h3>Synthèse additive</h3><table class="mt"><tbody><tr><td>rouge + vert</td><td>jaune</td></tr><tr><td>vert + bleu</td><td>cyan</td></tr><tr><td>rouge + bleu</td><td>magenta</td></tr><tr><td>rouge + vert + bleu</td><td>blanc</td></tr></tbody></table><p style="opacity:.75;font-size:.9em">Vérifie chaque ligne avec les projecteurs !</p>';
      }
      paint();
      api.onReset(function () { st.mode = 'ana'; st.prism = true; st.filter = 'none'; st.labels = true; st.R = st.G = st.B = 1; cM.set('ana'); tP.set(true); cF.set('none'); tL.set(true); sl.forEach(function (x) { x.set(100); }); vis(); rows = []; paint(); });
      api.say('Le prisme est en place : regarde l’écran !');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations (analyse et synthèse).</p>';
        return '<p>Le prisme <b>décompose</b> la lumière blanche : on obtient un spectre <b>continu</b> du rouge au violet. La lumière blanche est donc un mélange de lumières colorées.</p><p>Un <b>filtre coloré</b> ne transmet qu’une partie de ces lumières et absorbe les autres.</p><p>En superposant des lumières rouge, verte et bleue, on recompose la lumière <b>blanche</b> : c’est la <b>synthèse additive</b>. Un objet coloré éclairé en lumière colorée peut paraître noir s’il ne diffuse pas cette lumière.</p>';
      } };
    }
  };
  var PJ0 = [['R', 'rouge'], ['G', 'vert'], ['B', 'bleu']];

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Expérience de lumière' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function toggles(api, lab) { var row = api.c.row(); PJ0.forEach(function (p) { var b = api.c.button({ label: 'Projecteur ' + p[1], into: row, onClick: function () { lab.st[p[0]] = lab.st[p[0]] > 0.5 ? 0 : 1; paint(); } }); function paint() { b.classList.toggle('primary', lab.st[p[0]] > 0.5); } paint(); }); }
  var DEFI = {
    title: 'Le défi des couleurs',
    intro: 'Projecteurs, prisme et filtres : deviens le maître de la lumière !',
    missions: [
      { title: 'Du jaune !', text: 'Allume les bons projecteurs pour obtenir du <span style="color:#FFE600">jaune</span> au centre.', lumi: 'Il n’y a pas de projecteur jaune… mais deux couleurs suffisent !', hint: 'Rouge + vert.',
        build: function (api) { var lab = mini(api, { mode: 'syn', R: 0, G: 0, B: 0, objs: false }); toggles(api, lab); return function () { return lab.res().name === 'jaune' ? { ok: true, msg: 'Rouge + vert = jaune !' } : { ok: false, msg: 'On obtient : ' + lab.res().name + '.' }; }; },
        e: 'Synthèse additive : rouge + vert = jaune.' },
      { type: 'qcm', title: 'Le prisme', text: 'Que fait le prisme à la lumière blanche ?', o: ['Il la colore en rouge', 'Il la décompose en lumières colorées', 'Il l’absorbe', 'Il la rend plus intense'], a: 1, hint: 'Pense au spectre sur l’écran.', e: 'Le prisme décompose la lumière blanche : elle est un mélange de lumières colorées.' },
      { title: 'Le bon filtre', text: 'Choisis le filtre pour que le spectre contienne le <span style="color:#34C759">vert</span> et le <span style="color:#2F6BFF">bleu</span>, mais <b>plus de rouge</b>.', lumi: 'Un filtre ne laisse passer qu’une partie des couleurs.', hint: 'Vert + bleu = cyan…',
        build: function (api) { var lab = mini(api, { mode: 'ana' }); api.c.seg({ label: 'Filtre', value: 'none', options: ['none', 'R', 'G', 'B', 'Y', 'C', 'M'].map(function (k) { return { v: k, l: FILTERS[k].l }; }), onChange: function (v) { lab.st.filter = v; } }); return function () { var p = lab.res().pass || []; return p[3] && p[5] && !p[0] ? { ok: true, msg: 'Le filtre cyan laisse passer le vert et le bleu.' } : { ok: false, msg: !p[0] ? 'Il manque du vert ou du bleu.' : 'Il reste du rouge.' }; }; },
        e: 'Un filtre cyan transmet le vert et le bleu et absorbe le rouge.' },
      { title: 'Retour au blanc', text: 'Retrouve de la <b>lumière blanche</b> avec les projecteurs.', lumi: 'Combien de couleurs faut-il superposer ?', hint: 'Les trois projecteurs.',
        build: function (api) { var lab = mini(api, { mode: 'syn', R: 1, G: 0, B: 0 }); toggles(api, lab); return function () { return lab.res().name === 'blanc' ? { ok: true, msg: 'Rouge + vert + bleu = blanc !' } : { ok: false, msg: 'On obtient : ' + lab.res().name + '.' }; }; },
        e: 'Les trois lumières rouge, verte et bleue superposées donnent du blanc.' },
      { type: 'qcm', title: 'La feuille mystère', text: 'Une feuille verte est éclairée uniquement en lumière rouge. Elle paraît :', o: ['verte', 'rouge', 'noire', 'jaune'], a: 2, hint: 'Elle ne diffuse que le vert… et il n’y en a pas.', e: 'La feuille absorbe le rouge et ne reçoit pas de vert : elle paraît noire.' }
    ]
  };

  S.start({
    inquiry: {"situation": "La classe observe de la lumière blanche à travers un dispositif optique. Est-elle constituée d’une seule couleur ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-lumiere-blanche', level: '4e', theme: 'Optique', title: 'Analyse et synthèse de la lumière blanche', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un <b>prisme</b> décompose la lumière blanche : on obtient son <b>spectre</b>, continu, du rouge au violet.',
      'La lumière blanche est un <b>mélange de lumières colorées</b>.',
      'Un <b>filtre coloré</b> ne laisse passer qu’une partie des lumières colorées ; il absorbe les autres.',
      '<b>Synthèse additive</b> : en superposant des lumières rouge, verte et bleue, on obtient du blanc. Rouge + vert = jaune ; vert + bleu = cyan ; rouge + bleu = magenta.',
      'Un objet coloré diffuse sa couleur et absorbe les autres : éclairé par une lumière qu’il absorbe, il paraît <b>noir</b>.'
    ],
    quiz: [
      { q: 'Le spectre de la lumière blanche est :', o: ['une seule couleur', 'continu, du rouge au violet', 'noir et blanc', 'uniquement bleu'], a: 1, e: 'Toutes les couleurs se suivent sans interruption.' },
      { q: 'Un filtre rouge éclairé en lumière blanche laisse passer :', o: ['toutes les couleurs', 'le rouge', 'le vert', 'rien'], a: 1, e: 'Il absorbe les autres couleurs.' },
      { q: 'Vert + bleu donne :', o: ['jaune', 'magenta', 'cyan', 'blanc'], a: 2, e: 'Vert + bleu = cyan.' },
      { q: 'Rouge + vert + bleu donne :', o: ['noir', 'blanc', 'marron', 'violet'], a: 1, e: 'C’est la synthèse additive de la lumière blanche.' },
      { q: 'Une tomate rouge éclairée en lumière bleue paraît :', o: ['rouge', 'bleue', 'noire', 'violette'], a: 2, e: 'Elle absorbe le bleu et ne reçoit pas de rouge.' }
    ]
  });
})();

