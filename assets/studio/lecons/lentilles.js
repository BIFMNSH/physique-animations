/* 3e · Optique · Leçon : Les lentilles */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var OX = 300, AY = 236, PXC = 5, H = 46; /* lentille en x = 300, axe en y = 236, 5 px par cm */
  function glow(G, col) { var id = 'lg' + Math.floor(Math.random() * 1e9), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function img(d, f) { var inv = 1 / f - 1 / d; if (Math.abs(inv) < 1e-6) return { dp: Infinity, g: Infinity }; var dp = 1 / inv; return { dp: dp, g: -dp / d }; }
  function clipLine(x1, y1, x2, y2) { /* prolonge la droite (x1,y1)→(x2,y2) jusqu’au bord x = 534 */ var dx = x2 - x1, dy = y2 - y1; if (Math.abs(dx) < 1e-6) return [x2, y2]; var k = (534 - x1) / dx; var y = y1 + dy * k; if (y < 50) { k = (50 - y1) / dy; } else if (y > 440) { k = (440 - y1) / dy; } return [x1 + dx * k, y1 + dy * k]; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'image', type: 'conv', f: 10, d: 30, show3: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var axis = s('line', { x1: 50, x2: 530, y1: AY, y2: AY, stroke: '#7D89A3', 'stroke-width': 1.5, 'stroke-dasharray': '10 6' }, G);
    for (var c = -50; c <= 46; c += 10) { var x = OX + c * PXC; if (x > 50 && x < 530) { s('line', { x1: x, x2: x, y1: AY + 146, y2: AY + 152, stroke: '#4A5568', 'stroke-width': 1 }, G); s('text', { x: x, y: AY + 166, 'text-anchor': 'middle', 'font-size': 9.5, fill: '#7D89A3', text: c + ' cm' }, G); } }
    s('line', { x1: 60, x2: 520, y1: AY + 146, y2: AY + 146, stroke: '#4A5568', 'stroke-width': 1.5 }, G);
    var lens = s('path', { fill: '#9FD7FF', 'fill-opacity': 0.25, stroke: '#BFE6FF', 'stroke-width': 2.5 }, G), Ot = s('text', { x: OX + 6, y: AY + 16, 'font-size': 12, 'font-weight': 900, fill: '#EEF2F8', text: 'O' }, G);
    var Fp = s('circle', { r: 4, fill: '#FFC773' }, G), Fpt = s('text', { 'font-size': 12, 'font-weight': 900, fill: '#FFC773', text: 'F′' }, G), Fo = s('circle', { r: 4, fill: '#FFC773' }, G), Fot = s('text', { 'font-size': 12, 'font-weight': 900, fill: '#FFC773', text: 'F' }, G);
    /* faisceau */
    var B = s('g', {}, G), sun = s('g', {}, B); s('circle', { cx: 74, cy: AY, r: 16, fill: '#FFD84A' }, sun); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s('line', { x1: 74 + Math.cos(a) * 20, y1: AY + Math.sin(a) * 20, x2: 74 + Math.cos(a) * 27, y2: AY + Math.sin(a) * 27, stroke: '#FFD84A', 'stroke-width': 3 }, sun); }
    var RB = [-72, -36, 0, 36, 72].map(function () { return [s('line', { stroke: '#FFD84A', 'stroke-width': 2.5 }, B), s('line', { stroke: '#FFD84A', 'stroke-width': 2.5 }, B), s('line', { stroke: '#FFD84A', 'stroke-width': 1.5, 'stroke-dasharray': '5 5', opacity: 0.7 }, B)]; });
    var hot = s('circle', { r: 20, fill: glow(G, '#FFF2B0') }, B);
    /* image */
    var A = s('g', {}, G), obj = s('path', { stroke: '#5CFF9D', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, A), objT = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#5CFF9D' }, A), im = s('path', { 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, A), imT = s('text', { 'font-size': 13, 'font-weight': 900 }, A);
    var rays = [0, 1, 2].map(function (k) { var col = ['#FF8A80', '#9FD7FF', '#B9A3E3'][k]; return [s('line', { stroke: col, 'stroke-width': 2 }, A), s('line', { stroke: col, 'stroke-width': 2 }, A), s('line', { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '5 5' }, A)]; });
    var screen = s('rect', { width: 8, height: 160, rx: 2, fill: '#EEF2F8', opacity: 0.85 }, A), eye = s('g', {}, A); s('ellipse', { rx: 14, ry: 9, fill: '#EEF2F8' }, eye); s('circle', { r: 5, fill: '#3B2A1A' }, eye);
    var msg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, G);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var icon = s('path', { fill: '#9FD7FF', 'fill-opacity': 0.3, stroke: '#BFE6FF', 'stroke-width': 2 }, P), iconT = s('text', { x: PX + 140, y: 156, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P);
    var fT = s('text', { x: PX + 140, y: 186, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, P), cT = s('text', { x: PX + 140, y: 210, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 226, y2: 226, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return s('text', { x: PX + 140, y: 250 + k * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', a[k] && a[k].charAt(0) === '•' ? 800 : 400); t.setAttribute('fill', a[k] && a[k].charAt(0) === '•' ? '#EEF2F8' : '#C9D2E3'); }); }
    function lensPath(conv, x, y, h) { return conv ? 'M' + x + ' ' + (y - h) + ' Q' + (x + 18) + ' ' + y + ' ' + x + ' ' + (y + h) + ' Q' + (x - 18) + ' ' + y + ' ' + x + ' ' + (y - h) + 'Z' : 'M' + (x - 12) + ' ' + (y - h) + ' H' + (x + 12) + ' Q' + (x + 2) + ' ' + y + ' ' + (x + 12) + ' ' + (y + h) + ' H' + (x - 12) + ' Q' + (x - 2) + ' ' + y + ' ' + (x - 12) + ' ' + (y - h) + 'Z'; }
    function seg(l, x1, y1, x2, y2, on) { l.style.display = on === false ? 'none' : ''; attr(l, { x1: x1, y1: y1, x2: x2, y2: y2 }); }
    function step() {
      var res = {}, conv = st.type === 'conv', f = conv ? st.f : -st.f, fx = f * PXC;
      lens.setAttribute('d', lensPath(conv, OX, AY, 140));
      attr(Fp, { cx: OX + fx, cy: AY }); attr(Fpt, { x: OX + fx - 6, y: AY - 10 }); attr(Fo, { cx: OX - fx, cy: AY }); attr(Fot, { x: OX - fx - 4, y: AY - 10 });
      icon.setAttribute('d', lensPath(conv, PX + 140, 100, 40)); iconT.textContent = conv ? 'lentille convergente : bords minces' : 'lentille divergente : bords épais';
      fT.textContent = 'distance focale f = ' + st.f + ' cm'; cT.textContent = 'vergence C = 1 / f = ' + (conv ? '' : '−') + fmt(100 / st.f, 1) + ' δ';
      B.style.display = st.mode === 'faisceau' ? '' : 'none'; A.style.display = st.mode === 'image' ? '' : 'none';
      if (st.mode === 'faisceau') {
        pT.textContent = 'UN FAISCEAU PARALLÈLE';
        [-72, -36, 0, 36, 72].forEach(function (h, k) { var y = AY + h, r = RB[k]; seg(r[0], 100, y, OX, y); if (conv) { var e = clipLine(OX, y, OX + fx, AY); seg(r[1], OX, y, e[0], e[1]); r[2].style.display = 'none'; } else { var e2 = clipLine(OX + fx, AY, OX, y); seg(r[1], OX, y, e2[0], e2[1]); seg(r[2], OX + fx, AY, OX, y); } });
        attr(hot, { cx: OX + fx, cy: AY, opacity: conv ? 1 : 0 });
        msg.textContent = conv ? 'Les rayons convergent au foyer image F′ : la lentille concentre la lumière' : 'Les rayons divergent : ils semblent venir du foyer F′, situé avant la lentille';
        pset(conv ? ['• Lentille convergente', 'Un faisceau parallèle à l’axe', 'converge au foyer image F′.', 'f = OF′ : distance focale.', 'Elle peut enflammer du papier', 'au soleil : attention !', '• Vergence C = 1 / f', 'f en mètres, C en dioptries (δ)'] : ['• Lentille divergente', 'Un faisceau parallèle à l’axe', 'diverge : les rayons semblent', 'venir de F′ (foyer virtuel).', 'Sa vergence est négative.', '', '• Vergence C = 1 / f', 'f en mètres, C en dioptries (δ)']);
        res = { conv: conv };
      } else {
        pT.textContent = 'FORMATION DE L’IMAGE';
        var d = st.d, ax = OX - d * PXC, by = AY - H; obj.setAttribute('d', 'M' + ax + ' ' + AY + ' V' + by + ' m-6 8 l6 -8 l6 8'); attr(objT, { x: ax - 10, y: by - 8, text: 'AB' });
        var q = img(d, f), dp = q.dp, gm = q.g, far = !isFinite(dp) || Math.abs(dp) > 60, real = dp > 0 && !far;
        var ix = OX + dp * PXC, ih = H * gm, iy = AY - ih;
        /* rayon 1 : parallèle puis par F′ */
        var r = rays[0]; seg(r[0], ax, by, OX, by);
        if (conv) { var e = clipLine(OX, by, OX + fx, AY); seg(r[1], OX, by, e[0], e[1]); } else { var e3 = clipLine(OX + fx, AY, OX, by); seg(r[1], OX, by, e3[0], e3[1]); }
        if (!real && !far) seg(r[2], OX, by, ix, iy); else if (!conv) seg(r[2], OX + fx, AY, OX, by); else r[2].style.display = 'none';
        /* rayon 2 : par le centre optique */
        r = rays[1]; seg(r[0], ax, by, OX, AY); var e4 = clipLine(ax, by, OX, AY); seg(r[1], OX, AY, e4[0], e4[1]); if (!real && !far) seg(r[2], OX, AY, ix, iy); else r[2].style.display = 'none';
        /* rayon 3 : par F, ressort parallèle */
        r = rays[2]; var y3 = by + (AY - by) / ((OX - fx) - ax) * (OX - ax), show3 = st.show3 && conv && d > st.f + 0.5 && Math.abs(y3 - AY) < 140; if (show3) { var e5 = [OX, y3]; seg(r[0], ax, by, OX, e5[1]); seg(r[1], OX, e5[1], 534, e5[1]); r[2].style.display = 'none'; } else r.forEach(function (l) { l.style.display = 'none'; });
        im.style.display = imT.style.display = far ? 'none' : ''; screen.style.display = real && ix < 530 ? '' : 'none'; eye.style.display = !real && !far ? '' : 'none';
        if (!far) { var col = real ? '#FF8A80' : '#FFC773'; im.setAttribute('stroke', col); im.setAttribute('stroke-dasharray', real ? '' : '6 5'); var dir = ih > 0 ? 8 : -8; im.setAttribute('d', 'M' + ix + ' ' + AY + ' V' + iy + ' m-6 ' + dir + ' l6 ' + (-dir) + ' l6 ' + dir); attr(imT, { x: ix + 8, y: iy + (ih > 0 ? -8 : 18), text: 'A′B′', fill: col }); attr(screen, { x: ix + 4, y: AY - 80 }); eye.setAttribute('transform', 'translate(518 ' + (AY - 30) + ')'); }
        var big = Math.abs(gm), kind = far ? 'pas d’image nette (objet au foyer)' : real ? 'réelle, renversée, ' + (big > 1.02 ? 'plus grande' : big < 0.98 ? 'plus petite' : 'de même taille') : 'virtuelle, droite, ' + (big > 1.02 ? 'agrandie' : 'plus petite');
        msg.textContent = far ? 'Objet au foyer : les rayons sortent parallèles, pas d’image' : real ? 'Image réelle : on peut la recueillir sur un écran (' + fmt(dp, 1) + ' cm)' : (conv ? 'Image virtuelle : on la voit à travers la lentille (loupe)' : 'Lentille divergente : image virtuelle, droite, plus petite');
        pset(['• Objet à ' + d + ' cm de la lentille', 'image ' + kind, far ? '' : 'distance OA′ = ' + fmt(Math.abs(dp), 1) + ' cm ' + (real ? '(après la lentille)' : '(avant)'), far ? '' : 'grandissement : × ' + fmt(big, 2), '• Rayons particuliers', 'par O : non dévié', '∥ à l’axe : passe par F′', 'par F : ressort ∥ à l’axe']);
        res = { d: d, f: f, dp: dp, real: real, far: far, big: big, conv: conv };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Loupes et lunettes' }, { t: 8, title: 'Deux sortes de lentilles' }, { t: 17, title: 'Foyer et vergence' }, { t: 27, title: 'Une image réelle' }, { t: 39, title: 'Plus grande' }, { t: 47, title: 'La loupe' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Convergente : <b>bords minces</b> · divergente : <b>bords épais</b>', 'un faisceau parallèle converge au foyer F′, ou diverge.', '#9FD7FF'],
      ['Distance focale f = OF′ · <b>vergence C = 1 / f</b>', 'f en mètres, C en dioptries (δ).', '#FFC773'],
      ['Une lentille convergente donne une <b>image réelle</b>', 'renversée sur un écran ; tout près, une image virtuelle agrandie (loupe).', '#FF8A80']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.f = 10; st.show3 = true;
        if (t < 8) { st.mode = 'faisceau'; st.type = 'conv'; }
        else if (t < 17) { st.mode = 'faisceau'; st.type = t < 12.5 ? 'conv' : 'div'; }
        else if (t < 27) { st.mode = 'faisceau'; st.type = 'conv'; st.f = t < 22 ? 10 : 20; }
        else if (t < 39) { st.mode = 'image'; st.type = 'conv'; st.d = Math.round(40 - 10 * K.k(t, 27.5, 3)); }
        else if (t < 47) { st.mode = 'image'; st.type = 'conv'; st.d = Math.round(30 - 15 * K.k(t, 39.2, 2.5)); }
        else { st.mode = 'image'; st.type = 'conv'; st.d = 6; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Que fait une lentille ?') || tg.show(t, 8.6, 16.6, 290, 92, st.type === 'conv' ? 'Bords minces : convergente' : 'Bords épais : divergente') || tg.show(t, 17.6, 26.6, 290, 92, 'f = ' + st.f + ' cm → C = ' + fmt(100 / st.f, 0) + ' δ') ||
          tg.show(t, 28, 38.6, 290, 92, 'Image réelle, renversée, plus petite') || tg.show(t, 40, 46.6, 290, 92, 'Plus près : image plus grande') || tg.show(t, 47.6, 56.6, 290, 92, 'Avant F : image virtuelle agrandie');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un faisceau de rayons parallèles venant du Soleil traverse une lentille convergente et se concentre au foyer, puis traverse une lentille divergente et s’écarte ; la distance focale de 10 cm puis 20 cm et la vergence ; enfin un objet placé devant une lentille convergente, avec les rayons particuliers qui construisent son image réelle renversée sur un écran, plus petite puis plus grande, et une image virtuelle agrandie quand l’objet est entre le foyer et la lentille',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Loupes, lunettes, appareils photo, et même nos yeux : tous utilisent des lentilles. Que fait une lentille à la lumière ?', sub: 'Que fait une <b>lentille</b> ?' },
      { t: 8, d: 8.6, say: 'Une lentille à bords minces fait converger les rayons du Soleil en un point : elle est convergente. Une lentille à bords épais les fait diverger : elle est divergente.', sub: 'Bords minces : <b>convergente</b> ; bords épais : <b>divergente</b>.' },
      { t: 17, d: 9.6, say: 'Le point de convergence est le foyer image F prime. La distance OF prime est la distance focale f. Sa vergence C est l’inverse de f : pour dix centimètres, dix dioptries ; pour vingt centimètres, cinq dioptries.', sub: '<b>C = 1 / f</b> : f = 0,10 m → C = 10 δ.' },
      { t: 27, d: 11.6, say: 'Plaçons un objet loin devant une lentille convergente. Les rayons particuliers construisent son image : elle est réelle, on peut la recueillir sur un écran. Elle est renversée et plus petite.', sub: 'Image <b>réelle</b>, <b>renversée</b>.' },
      { t: 39, d: 7.6, say: 'Si l’on rapproche l’objet du foyer, l’image s’éloigne et devient plus grande que l’objet.', sub: 'Objet plus près : image plus grande.' },
      { t: 47, d: 9.6, say: 'Entre le foyer et la lentille, il n’y a plus d’image sur l’écran : on voit à travers la lentille une image virtuelle, droite et agrandie. C’est le principe de la loupe.', sub: 'Image <b>virtuelle</b> agrandie : la <b>loupe</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : une lentille convergente a les bords minces, une divergente les bords épais.', sub: 'Bords minces ou épais.' },
      { t: 61.8, d: 4.2, say: 'Sa vergence C égale un sur f, en dioptries.', sub: 'C = 1 / f.' },
      { t: 66.2, d: 4.8, say: 'Une lentille convergente peut donner une image réelle et renversée.', sub: 'Image réelle et renversée.' }
    ],
    learn: [
      { t: 16, ch: 1, html: 'Convergente : bords <b>minces</b> ; divergente : bords <b>épais</b>.' },
      { t: 26, ch: 2, html: 'Vergence : <b>C = 1 / f</b> (f en m, C en dioptries δ).' },
      { t: 38, ch: 3, html: 'Image <b>réelle et renversée</b> recueillie sur un écran.' },
      { t: 56, ch: 5, html: 'Objet entre F et O : image <b>virtuelle</b>, droite, agrandie (loupe).' }
    ],
    question: { q: 'Une lentille de distance focale 25 cm a une vergence de :', o: ['25 δ', '4 δ', '0,25 δ', '2,5 δ'], a: 1, e: 'C = 1 / 0,25 = 4 δ.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Optique', r: [40, 40, 500, 406] }, { n: 'Mesures', r: [560, 22, 280, 424] }],
    alt: 'Un banc d’optique avec une lentille convergente ou divergente de distance focale réglable ; en mode faisceau, des rayons parallèles venant du Soleil convergent au foyer ou divergent ; en mode image, un objet placé à une distance réglable et les rayons particuliers qui construisent son image, réelle sur un écran ou virtuelle ; à droite, la vergence et les caractéristiques de l’image',
    steps: [
      'Faisceau : compare une lentille convergente et une divergente.',
      'Change la distance focale : où est le foyer ?',
      'Image : éloigne puis rapproche l’objet de la lentille convergente.',
      'Trouve quand l’image devient virtuelle (loupe).'
    ],
    build: function (api) {
      var lab = Lab(api.g, { mode: 'faisceau' }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'faisceau', options: [{ v: 'faisceau', l: 'Faisceau parallèle' }, { v: 'image', l: 'Image d’un objet' }], onChange: function (v) { st.mode = v; vis(); } });
      var cT = c.seg({ label: 'Lentille', value: 'conv', options: [{ v: 'conv', l: 'convergente' }, { v: 'div', l: 'divergente' }], onChange: function (v) { st.type = v; } });
      var sf = c.slider({ label: 'Distance focale f', min: 5, max: 20, step: 1, value: 10, unit: 'cm', dec: 0, onInput: function (v) { st.f = v; } });
      var sd = c.slider({ label: 'Distance objet-lentille', min: 2, max: 45, step: 1, value: 30, unit: 'cm', dec: 0, onInput: function (v) { st.d = v; } });
      var t3 = c.toggle({ label: 'Rayon par le foyer F', value: true, onChange: function (v) { st.show3 = v; } });
      function vis() { var im = st.mode === 'image'; sd.hide(!im); t3.hide(!im); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Vergence' }, { k: 'b', label: 'Image' }]), last = {};
      api.loop(function () { last = lab.step(); ro.a.set((st.type === 'conv' ? '' : '−') + fmt(100 / st.f, 1) + ' δ'); ro.b.set(st.mode === 'image' ? (last.far ? 'à l’infini' : (last.real ? 'réelle à ' : 'virtuelle à ') + fmt(Math.abs(last.dp), 1) + ' cm') : '—'); });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { rows.push(st.mode === 'image' ? { l: (st.type === 'conv' ? 'conv.' : 'div.') + ' f = ' + st.f + ' cm', d: st.d + ' cm', i: last.far ? 'à l’infini' : (last.real ? 'réelle, renversée' : 'virtuelle, droite') + ', × ' + fmt(last.big, 2) } : { l: (st.type === 'conv' ? 'convergente' : 'divergente') + ', f = ' + st.f + ' cm', d: '∞ (faisceau)', i: st.type === 'conv' ? 'converge en F′' : 'diverge' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Lentille</th><th>Objet</th><th>Image</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.l + '</td><td>' + r.d + '</td><td>' + r.i + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Lentille convergente : position de l’objet</h3><table class="mt"><thead><tr><th>Objet</th><th>Image</th></tr></thead><tbody><tr><td>au-delà de 2f</td><td>réelle, renversée, plus petite</td></tr><tr><td>entre f et 2f</td><td>réelle, renversée, plus grande</td></tr><tr><td>au foyer F</td><td>à l’infini</td></tr><tr><td>entre F et O</td><td>virtuelle, droite, agrandie (loupe)</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'faisceau', type: 'conv', f: 10, d: 30, show3: true }); cM.set('faisceau'); cT.set('conv'); sf.set(10); sd.set(30); t3.set(true); vis(); rows = []; paint(); });
      api.say('Compare une lentille convergente et une divergente.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Une lentille <b>convergente</b> (bords minces) fait converger un faisceau parallèle en son <b>foyer image F′</b> ; une lentille <b>divergente</b> (bords épais) le fait diverger. La distance <b>f = OF′</b> est la distance focale ; la <b>vergence</b> vaut <b>C = 1 / f</b> (f en m, C en dioptries δ), négative pour une lentille divergente.</p><p>Pour construire l’image : le rayon passant par le centre optique O n’est pas dévié ; le rayon parallèle à l’axe ressort en passant par F′ ; le rayon passant par F ressort parallèle à l’axe.</p><p>Avec une lentille convergente, un objet placé au-delà du foyer donne une image <b>réelle et renversée</b> (écran, appareil photo, œil) ; placé entre F et O, il donne une image <b>virtuelle, droite et agrandie</b> : c’est la <b>loupe</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Les lentilles' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’opticien',
    intro: 'Foyers, images et dioptries : règle ton banc d’optique !',
    missions: [
      { title: '5 dioptries', text: 'Choisis une lentille convergente de vergence <span style="color:#FFC773">5 δ</span>.', lumi: 'f = 1 / C.', hint: 'f = 0,20 m = 20 cm.',
        build: function (api) { var lab = mini(api, { mode: 'faisceau', f: 10 }); api.c.slider({ label: 'Distance focale', min: 5, max: 20, step: 1, value: 10, unit: 'cm', dec: 0, onInput: function (v) { lab.st.f = v; } }); return function () { return lab.st.f === 20 ? { ok: true, msg: 'f = 20 cm : C = 5 δ.' } : { ok: false, msg: 'C = ' + fmt(100 / lab.st.f, 1) + ' δ.' }; }; },
        e: 'C = 1 / 0,20 = 5 δ.' },
      { title: 'Même taille', text: 'Avec f = 10 cm, place l’objet pour que l’image réelle ait <b>la même taille</b> que l’objet.', lumi: 'À deux fois la distance focale…', hint: 'd = 20 cm.',
        build: function (api) { var lab = mini(api, { mode: 'image', f: 10, d: 35 }); api.c.slider({ label: 'Distance objet', min: 2, max: 45, step: 1, value: 35, unit: 'cm', dec: 0, onInput: function (v) { lab.st.d = v; } }); return function () { var r = lab.res(); return r.real && Math.abs(r.big - 1) < 0.02 ? { ok: true, msg: 'd = 2f = 20 cm : image de même taille, à 20 cm.' } : { ok: false, msg: r.far ? 'Pas d’image.' : 'Grandissement × ' + fmt(r.big, 2) + '.' }; }; },
        e: 'Objet à 2f : image réelle, renversée, même taille, à 2f.' },
      { title: 'La loupe', text: 'Obtiens une image <b>virtuelle agrandie</b> avec la lentille convergente.', lumi: 'L’objet doit être tout près…', hint: 'Objet à moins de f de la lentille.',
        build: function (api) { var lab = mini(api, { mode: 'image', f: 12, d: 30 }); api.c.slider({ label: 'Distance objet', min: 2, max: 45, step: 1, value: 30, unit: 'cm', dec: 0, onInput: function (v) { lab.st.d = v; } }); return function () { var r = lab.res(); return !r.real && !r.far && r.big > 1 ? { ok: true, msg: 'Image virtuelle, droite, × ' + fmt(r.big, 1) + ' : c’est une loupe.' } : { ok: false, msg: r.real ? 'L’image est encore réelle.' : 'Rapproche l’objet.' }; }; },
        e: 'Objet entre F et O : loupe.' },
      { type: 'qcm', title: 'Reconnaître', text: 'Une lentille à bords épais et centre mince est :', o: ['convergente', 'divergente', 'un miroir', 'un prisme'], a: 1, hint: 'Elle écarte les rayons.', e: 'Bords épais : divergente.' },
      { type: 'qcm', title: 'Rayon particulier', text: 'Un rayon qui passe par le centre optique O d’une lentille :', o: ['passe ensuite par F′', 'n’est pas dévié', 'ressort parallèle à l’axe', 'est réfléchi'], a: 1, hint: 'Le centre de la lentille…', e: 'Il traverse sans être dévié.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On veut obtenir une image nette sur un écran avec une lentille. De quels réglages dépend la formation de cette image ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-lentilles', level: '3e', theme: 'Optique', title: 'Les lentilles', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une lentille <b>convergente</b> a des bords minces ; une lentille <b>divergente</b> a des bords épais.',
      'Un faisceau parallèle à l’axe converge au <b>foyer image F′</b> d’une lentille convergente. La <b>distance focale</b> est f = OF′.',
      'La <b>vergence</b> d’une lentille : <b>C = 1 / f</b> (f en mètres, C en <b>dioptries δ</b>) ; elle est positive pour une lentille convergente, négative pour une divergente.',
      'Rayons particuliers : par le centre optique O, <b>non dévié</b> ; parallèle à l’axe, il ressort par <b>F′</b> ; passant par <b>F</b>, il ressort parallèle à l’axe.',
      'Lentille convergente : objet au-delà de F → image <b>réelle et renversée</b> (écran) ; objet entre F et O → image <b>virtuelle, droite, agrandie</b> (loupe).'
    ],
    quiz: [
      { q: 'Une lentille convergente a :', o: ['des bords épais', 'des bords minces', 'une surface plane', 'un centre creux'], a: 1, e: 'Bords minces, centre épais.' },
      { q: 'Un faisceau parallèle traversant une lentille convergente :', o: ['diverge', 'converge au foyer F′', 'reste parallèle', 'est réfléchi'], a: 1, e: 'Il converge en F′.' },
      { q: 'La vergence d’une lentille de f = 50 cm vaut :', o: ['50 δ', '2 δ', '0,5 δ', '5 δ'], a: 1, e: '1 / 0,5 = 2 δ.' },
      { q: 'L’image recueillie sur un écran est :', o: ['virtuelle', 'réelle', 'toujours droite', 'toujours agrandie'], a: 1, e: 'Seule une image réelle se forme sur un écran.' },
      { q: 'Pour utiliser une lentille comme loupe, l’objet doit être :', o: ['très loin', 'entre le foyer et la lentille', 'au foyer exactement', 'derrière la lentille'], a: 1, e: 'Entre F et O : image virtuelle agrandie.' }
    ]
  });
})();

