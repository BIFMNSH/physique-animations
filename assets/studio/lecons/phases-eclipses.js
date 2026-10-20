/* 4e · Optique · Leçon : Les phases de la Lune et les éclipses */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit;
  var LUN = 29.53, INC = 5.1, D2R = Math.PI / 180;
  var NAMES = ['nouvelle lune', 'premier croissant', 'premier quartier', 'gibbeuse croissante', 'pleine lune', 'gibbeuse décroissante', 'dernier quartier', 'dernier croissant'];
  function phaseName(phi) { return NAMES[Math.round(((phi % 360) + 360) % 360 / 45) % 8]; }
  function frac(phi) { return (1 - Math.cos(phi * D2R)) / 2; }
  /* disque de la Lune vue de la Terre (hémisphère nord) : partie éclairée */
  function moonPath(cx, cy, R, phi) {
    phi = ((phi % 360) + 360) % 360; var c = Math.cos(phi * D2R), rx = Math.abs(c) * R, top = cx + ' ' + (cy - R), bot = cx + ' ' + (cy + R);
    if (phi < 0.5 || phi > 359.5) return '';
    if (phi <= 180) return 'M' + top + 'A' + R + ' ' + R + ' 0 0 1 ' + bot + 'A' + rx + ' ' + R + ' 0 0 ' + (c > 0 ? 0 : 1) + ' ' + top + 'Z';
    return 'M' + top + 'A' + R + ' ' + R + ' 0 0 0 ' + bot + 'A' + rx + ' ' + R + ' 0 0 ' + (c > 0 ? 1 : 0) + ' ' + top + 'Z';
  }
  function eclipse(phi, nu) {
    var b = INC * Math.sin((phi - nu) * D2R), p = ((phi % 360) + 360) % 360;
    var nearNew = Math.min(p, 360 - p) < 4, nearFull = Math.abs(p - 180) < 4;
    if (nearNew && Math.abs(b) < 0.55) return { t: 'sol', total: Math.abs(b) < 0.3, b: b };
    if (nearFull && Math.abs(b) < 0.9) return { t: 'lun', total: Math.abs(b) < 0.4, b: b };
    return { t: null, b: b };
  }
  var GID = 0;
  function glow(G, col) { var id = 'pe' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.9 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ phi: 45, nu: 60, rays: true, side: true }, o || {});
    var XC = 330, YC = 245, RO = 165;
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#050812' }, G);
    for (var i = 0; i < 70; i++) s('circle', { cx: (i * 137) % 860, cy: (i * 61) % 470, r: (i % 3) * 0.5 + 0.6, fill: '#fff', opacity: 0.5 }, G);
    // Soleil à gauche + rayons parallèles
    s('circle', { cx: -80, cy: YC, r: 180, fill: glow(G, '#FFC773') }, G); s('circle', { cx: -60, cy: YC, r: 90, fill: '#FFB547' }, G);
    s('text', { x: 40, y: 456, 'font-size': 14, 'font-weight': 800, fill: '#FFC773', text: 'lumière du Soleil →' }, G);
    var rg = s('g', { opacity: 0.35 }, G); for (i = -4; i <= 4; i++) { s('line', { x1: 40, y1: YC + i * 44, x2: 600, y2: YC + i * 44, stroke: '#FFE29A', 'stroke-width': 1.5, 'stroke-dasharray': '6 10' }, rg); s('path', { d: K.arrow(100, YC + i * 44, 112, YC + i * 44, 1, 5, 8), fill: '#FFE29A' }, rg); }
    var shadowE = s('path', { fill: '#000', opacity: 0.55 }, G), shadowM = s('path', { fill: '#000', opacity: 0.6 }, G);
    s('circle', { cx: XC, cy: YC, r: RO, fill: 'none', stroke: '#3B4E73', 'stroke-width': 2, 'stroke-dasharray': '5 8' }, G);
    // Terre (jour à gauche)
    var earth = s('g', {}, G); s('circle', { cx: XC, cy: YC, r: 38, fill: '#2B6CB0' }, earth); s('path', { d: 'M' + (XC - 18) + ' ' + (YC - 20) + ' q12 -8 22 2 q8 10 -2 18 q-14 4 -20 -8z M' + (XC + 4) + ' ' + (YC + 12) + ' q10 -4 16 6 q-6 10 -16 4z', fill: '#3DD68C', opacity: 0.85 }, earth);
    s('path', { d: 'M' + XC + ' ' + (YC - 38) + 'A38 38 0 0 1 ' + XC + ' ' + (YC + 38) + 'Z', fill: '#000', opacity: 0.55 }, earth);
    s('text', { x: XC, y: YC + 60, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#9AB4D8', text: 'Terre' }, G);
    // Lune (moitié tournée vers le Soleil éclairée)
    var mg = s('g', {}, G); s('circle', { r: 16, fill: '#3A3F48' }, mg); s('path', { d: 'M0 -16 A16 16 0 0 0 0 16 Z', fill: '#E6E8EC' }, mg);
    var mHit = s('circle', { r: 30, fill: 'transparent', style: 'cursor:grab;touch-action:none' }, mg);
    var mLab = s('text', { 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9CED6', text: 'Lune' }, G);
    var view = s('path', { stroke: '#FFB547', 'stroke-width': 1.5, 'stroke-dasharray': '3 4', opacity: 0.7 }, G);
    // vue depuis la Terre
    var IX = 640, IY = 24;
    s('rect', { x: IX, y: IY, width: 200, height: 190, rx: 14, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, G);
    s('text', { x: IX + 100, y: IY + 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'CE QU’ON VOIT DE LA TERRE' }, G);
    var vSky = s('circle', { cx: IX + 100, cy: IY + 100, r: 58, fill: '#262B33' }, G), vLit = s('path', { fill: '#E6E8EC' }, G), vRed = s('circle', { cx: IX + 100, cy: IY + 100, r: 58, fill: '#B5452E', opacity: 0 }, G);
    var vSun = s('circle', { cx: IX + 100, cy: IY + 100, r: 58, fill: '#FFB547', opacity: 0 }, G), vSunM = s('circle', { cy: IY + 100, r: 59, fill: '#0B1220', opacity: 0 }, G);
    var vName = s('text', { x: IX + 100, y: IY + 178, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#EEF2F8' }, G);
    // vue de côté (inclinaison de l'orbite)
    var SV = s('g', {}, G), SX = 640, SY = 240;
    s('rect', { x: SX, y: SY, width: 200, height: 120, rx: 14, fill: '#0B1220', stroke: '#2B3A57', 'stroke-width': 2 }, SV);
    s('text', { x: SX + 100, y: SY + 20, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'VUE DE CÔTÉ (inclinaison ×10)' }, SV);
    s('line', { x1: SX + 12, x2: SX + 188, y1: SY + 70, y2: SY + 70, stroke: '#FFE29A', 'stroke-width': 1, opacity: 0.6, 'stroke-dasharray': '4 4' }, SV);
    s('circle', { cx: SX + 18, cy: SY + 70, r: 10, fill: '#FFB547' }, SV); s('circle', { cx: SX + 110, cy: SY + 70, r: 9, fill: '#2B6CB0' }, SV);
    var sMoon = s('circle', { r: 5, fill: '#E6E8EC' }, SV), sOrb = s('path', { stroke: '#5A73A3', 'stroke-width': 1.5, fill: 'none' }, SV);
    var sT = s('text', { x: SX + 100, y: SY + 108, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7' }, SV);
    var ecl = s('text', { x: 840, y: 456, 'text-anchor': 'end', 'font-size': 18, 'font-weight': 800, fill: '#FFB547' }, G);
    var drag = false;
    mHit.addEventListener('pointerdown', function (e) { drag = true; try { mHit.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); });
    mHit.addEventListener('pointermove', function (e) { if (!drag) return; var sv = G.ownerSVGElement, p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; p = p.matrixTransform(G.getScreenCTM().inverse()); var a = Math.atan2(-(p.y - YC), p.x - XC) / D2R; st.phi = ((a - 180) % 360 + 360) % 360; o.onDrag && o.onDrag(); });
    mHit.addEventListener('pointerup', function () { drag = false; });
    function step() {
      var phi = st.phi, a = (180 + phi) * D2R, mx = XC + RO * Math.cos(a), my = YC - RO * Math.sin(a);
      mg.setAttribute('transform', 'translate(' + mx + ' ' + my + ')'); attr(mLab, { x: mx, y: my - 24 });
      view.setAttribute('d', 'M' + XC + ' ' + YC + 'L' + mx + ' ' + my);
      rg.style.display = st.rays ? '' : 'none';
      var E = eclipse(phi, st.nu);
      // ombres (cônes vers la droite)
      shadowE.setAttribute('d', 'M' + XC + ' ' + (YC - 38) + 'L' + (XC + 360) + ' ' + (YC - 8) + 'L' + (XC + 360) + ' ' + (YC + 8) + 'L' + XC + ' ' + (YC + 38) + 'Z');
      shadowM.setAttribute('d', E.t === 'sol' ? 'M' + mx + ' ' + (my - 16) + 'L' + (XC - 30) + ' ' + (YC - 3) + 'L' + (XC - 30) + ' ' + (YC + 3) + 'L' + mx + ' ' + (my + 16) + 'Z' : '');
      // vue depuis la Terre
      vLit.setAttribute('d', E.t === 'sol' ? '' : moonPath(IX + 100, IY + 100, 58, phi));
      vRed.setAttribute('opacity', E.t === 'lun' ? (E.total ? 0.85 : 0.45) : 0);
      vSun.setAttribute('opacity', E.t === 'sol' ? 1 : 0); vSunM.setAttribute('opacity', E.t === 'sol' ? 1 : 0); vSunM.setAttribute('cx', IX + 100 + (E.total ? 0 : 26)); vSunM.setAttribute('r', E.total ? 55 : 59); vSky.setAttribute('opacity', E.t === 'sol' ? 0 : 1);
      vName.textContent = E.t === 'sol' ? (E.total ? 'éclipse totale de Soleil !' : 'éclipse partielle de Soleil') : E.t === 'lun' ? (E.total ? 'éclipse totale de Lune !' : 'éclipse partielle de Lune') : phaseName(phi);
      SV.style.display = st.side ? '' : 'none';
      var p = ((phi % 360) + 360) % 360, sx = SX + 110 - 70 * Math.cos(p * D2R), sy = SY + 70 - E.b * 7;
      attr(sMoon, { cx: sx, cy: sy }); if (st._nu !== st.nu) { st._nu = st.nu; var d = ''; for (var q = 0; q <= 360; q += 10) d += (q ? 'L' : 'M') + (SX + 110 - 70 * Math.cos(q * D2R)).toFixed(1) + ' ' + (SY + 70 - INC * 7 * Math.sin((q - st.nu) * D2R)).toFixed(1); sOrb.setAttribute('d', d + 'Z'); }
      sT.textContent = 'Lune ' + (Math.abs(E.b) < 0.6 ? 'dans le plan Terre-Soleil' : E.b > 0 ? 'au-dessus du plan' : 'au-dessous du plan');
      ecl.style.display = st.noEcl ? 'none' : ''; ecl.textContent = E.t === 'sol' ? 'Soleil – Lune – Terre alignés : éclipse de Soleil' : E.t === 'lun' ? 'Soleil – Terre – Lune alignés : éclipse de Lune' : '';
      return { E: E, name: phaseName(phi), f: frac(phi) };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La Lune, un objet diffusant' }, { t: 12, title: 'Le cycle des phases' }, { t: 32, title: 'L’éclipse de Soleil' }, { t: 43, title: 'L’éclipse de Lune' }, { t: 53, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { phi: 0, nu: 60, side: false, noEcl: true }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La Lune est un <b>objet diffusant</b>', 'elle est toujours éclairée à moitié par le Soleil.', '#C9CED6'],
      ['Les <b>phases</b> : on voit une partie de sa moitié éclairée', 'le cycle dure environ 29,5 jours.', 'var(--blue)'],
      ['<b>Éclipse</b> : alignement Soleil – Terre – Lune', 'de Soleil : la Lune cache le Soleil ; de Lune : elle entre dans l’ombre de la Terre.', 'var(--amber)']], [53.2, 57.6, 62]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 53.2)) {
        st.side = t > 32; st.nu = t < 32 ? 60 : 0;
        if (t < 12) st.phi = 90;
        else if (t < 32) st.phi = 360 * K.k(t, 13, 18) ;
        else if (t < 43) st.phi = 360 - 20 + 20 * K.k(t, 33, 3);
        else st.phi = 160 + 20 * K.k(t, 44, 3);
        lab.step();
        tg.show(t, 1, 11.6, 330, 92, 'La moitié tournée vers le Soleil est éclairée') || tg.show(t, 13, 31.4, 330, 92, 'Jour ' + Math.round(st.phi / 360 * LUN) + ' : ' + phaseName(st.phi)) || tg.show(t, 36.4, 42.6, 330, 92, 'La Lune cache le Soleil') || tg.show(t, 47, 52.6, 330, 92, 'La Lune dans l’ombre de la Terre : elle rougit');
      }
      bg.setAttribute('opacity', t > 52.8 ? 1 : 0);
      K.group(g5, t, 52.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : vue du dessus du Soleil, de la Terre et de la Lune qui tourne, avec ce que l’on voit de la Terre (phases), puis les éclipses de Soleil et de Lune',
    duration: 67, chapters: CH,
    segs: [
      { t: 0, d: 5.6, say: 'La Lune ne produit pas de lumière : c’est un objet diffusant, éclairé par le Soleil.', sub: 'La Lune est un <b>objet diffusant</b> éclairé par le <b>Soleil</b>.' },
      { t: 5.8, d: 6, say: 'À chaque instant, la moitié de la Lune tournée vers le Soleil est éclairée ; l’autre moitié est dans la nuit.', sub: 'Toujours <b>une moitié éclairée</b>, celle tournée vers le Soleil.' },
      { t: 12, d: 6.6, say: 'La Lune tourne autour de la Terre. Le cycle de ses phases, la lunaison, dure vingt-neuf jours et demi. On ne voit qu’une partie de sa moitié éclairée.', sub: 'Cycle des phases (lunaison) : <b>29,5 jours</b>.' },
      { t: 18.8, d: 6.4, say: 'Nouvelle lune, premier croissant, premier quartier, gibbeuse… puis la pleine lune, quand la Terre est entre le Soleil et la Lune.', sub: 'Nouvelle lune → croissant → premier quartier → <b>pleine lune</b>…' },
      { t: 25.4, d: 6.2, say: 'Ensuite la partie visible diminue : dernier quartier, dernier croissant, et le cycle recommence.', sub: '…dernier quartier → dernier croissant : le cycle recommence.' },
      { t: 32, d: 4.4, say: 'Parfois, à la nouvelle lune, le Soleil, la Lune et la Terre sont parfaitement alignés.', sub: 'Soleil – Lune – Terre <b>alignés</b>…' },
      { t: 36.6, d: 6, say: 'La Lune cache le Soleil et son ombre balaie la Terre : c’est une éclipse de Soleil.', sub: '…la Lune cache le Soleil : <b>éclipse de Soleil</b>.' },
      { t: 43, d: 4, say: 'À la pleine lune, la Terre peut se placer entre le Soleil et la Lune.', sub: 'Soleil – Terre – Lune alignés…' },
      { t: 47.2, d: 5.6, say: 'La Lune entre dans l’ombre de la Terre et devient rougeâtre : c’est une éclipse de Lune.', sub: '…la Lune dans l’ombre de la Terre : <b>éclipse de Lune</b>.' },
      { t: 53, d: 4.4, say: 'À retenir : la Lune est un objet diffusant.', sub: 'La Lune est un <b>objet diffusant</b>.' },
      { t: 57.6, d: 4.2, say: 'Ses phases viennent de la partie éclairée que l’on voit depuis la Terre.', sub: 'Les <b>phases</b> : la partie éclairée visible de la Terre.' },
      { t: 62, d: 5, say: 'Les éclipses se produisent quand le Soleil, la Terre et la Lune sont alignés.', sub: '<b>Éclipses</b> : Soleil, Terre et Lune alignés.' }
    ],
    learn: [
      { t: 10, ch: 1, html: 'La moitié de la Lune tournée vers le Soleil est <b>toujours éclairée</b>.' },
      { t: 30, ch: 2, html: 'Cycle des phases : <b>29,5 jours</b> (lunaison).' },
      { t: 42, ch: 3, html: 'Éclipse de <b>Soleil</b> : Soleil – Lune – Terre, à la nouvelle lune.' },
      { t: 52, ch: 4, html: 'Éclipse de <b>Lune</b> : Soleil – Terre – Lune, à la pleine lune.' }
    ],
    question: { q: 'Une éclipse de Lune ne peut avoir lieu qu’à la…', o: ['nouvelle lune', 'pleine lune', 'premier quartier', 'n’importe quelle phase'], a: 1, e: 'La Terre doit être entre le Soleil et la Lune : c’est la pleine lune.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Vue du dessus : le Soleil à gauche, la Terre et la Lune sur son orbite ; vue de la Lune depuis la Terre et vue de côté de l’orbite',
    steps: [
      'Fais tourner la Lune autour de la Terre (glisse-la ou utilise le curseur « Jour ») et observe ce qu’on voit depuis la Terre.',
      'Repère où se trouve la Lune à la nouvelle lune, au premier quartier, à la pleine lune et au dernier quartier.',
      'Règle la position des nœuds de l’orbite : à quelle phase peut-on observer une éclipse de Soleil ? de Lune ?',
      'Relève les phases dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onDrag: function () { sD.set(Math.round(st.phi / 360 * LUN * 2) / 2); } }), st = lab.st, c = api.c, rows = [];
      var sD = c.slider({ label: 'Jour de la lunaison', min: 0, max: 29.5, step: 0.5, value: Math.round(45 / 360 * LUN * 2) / 2, unit: 'j', dec: 1, onInput: function (v) { st.phi = v / LUN * 360; } });
      var sN = c.slider({ label: 'Position des nœuds (saison des éclipses)', min: 0, max: 180, step: 5, value: 60, unit: '°', onInput: function (v) { st.nu = v; } });
      var tR = c.toggle({ label: 'Rayons du Soleil', value: true, onChange: function (v) { st.rays = v; } });
      var tV = c.toggle({ label: 'Vue de côté', value: true, onChange: function (v) { st.side = v; } });
      var row = c.row();
      [['Nouvelle lune', 0], ['1er quartier', 90], ['Pleine lune', 180], ['Dernier quartier', 270]].forEach(function (p) { c.button({ label: p[0], sm: true, into: row, onClick: function () { st.phi = p[1]; sD.set(Math.round(p[1] / 360 * LUN * 2) / 2); } }); });
      var ro = api.readouts([{ k: 'j', label: 'Jour' }, { k: 'p', label: 'Phase' }, { k: 'f', label: 'Partie visible éclairée' }, { k: 'e', label: 'Éclipse' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.j.set(fmt(st.phi / 360 * LUN, 1) + ' j'); ro.p.set(last.name); ro.f.set(Math.round(last.f * 100) + ' %'); ro.e.set(last.E.t === 'sol' ? 'de Soleil' : last.E.t === 'lun' ? 'de Lune' : 'aucune'); });
      var M = api.measure; M.innerHTML = '<h3>Mon calendrier lunaire</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cette phase'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ j: st.phi / 360 * LUN, n: last.name, f: last.f, e: last.E.t }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Jour</th><th>Phase</th><th>Visible</th><th>Éclipse</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + fmt(r.j, 1) + '</td><td>' + r.n + '</td><td>' + Math.round(r.f * 100) + ' %</td><td>' + (r.e === 'sol' ? 'Soleil' : r.e === 'lun' ? 'Lune' : '—') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune phase relevée.</div>';
        api.chart.innerHTML = '<h3>Partie éclairée visible au fil des jours</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'jour', ylabel: 'visible (%)', xmin: 0, xmax: 30, xstep: 5, ymin: 0, ymax: 100, ystep: 25, series: [{ color: 'var(--blue)', pts: rows.map(function (r) { return [r.j, r.f * 100]; }) }] });
      }
      paint();
      api.onReset(function () { st.phi = 45; st.nu = 60; st.rays = true; st.side = true; sD.set(3.5); sN.set(60); tR.set(true); tV.set(true); rows = []; paint(); });
      api.say('Attrape la Lune et fais-la tourner autour de la Terre.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 phases différentes.</p>';
        return '<p>La partie éclairée visible augmente de la nouvelle lune (0 %) à la pleine lune (100 %, vers le jour 15), puis diminue : le cycle dure <b>29,5 jours</b>.</p><p>À la <b>nouvelle lune</b>, la Lune est entre la Terre et le Soleil ; à la <b>pleine lune</b>, la Terre est entre les deux.</p><p>Les éclipses n’ont lieu que si l’alignement est parfait (orbite inclinée) : éclipse de Soleil à la nouvelle lune, éclipse de Lune à la pleine lune.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Soleil, Terre et Lune' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi des astres',
    intro: 'Place la Lune au bon endroit, au bon moment : phases et éclipses n’auront plus de secret pour toi !',
    missions: [
      { title: 'Premier quartier', text: 'Place la Lune pour qu’on voie un <span style="color:var(--amber)">premier quartier</span> depuis la Terre.', lumi: 'Attrape la Lune et regarde l’encart « ce qu’on voit de la Terre ».', hint: 'Au premier quartier, on voit la moitié droite éclairée : la Lune a fait un quart de tour après la nouvelle lune.',
        build: function (api) { var lab = mini(api, { phi: 300, nu: 60, side: false }); return function () { return lab.res().name === 'premier quartier' ? { ok: true, msg: 'Premier quartier : la moitié droite est éclairée.' } : { ok: false, msg: 'On voit : ' + lab.res().name + '.' }; }; },
        e: 'Premier quartier : la Lune a fait un quart de tour depuis la nouvelle lune.' },
      { type: 'qcm', title: 'Pleine lune', text: 'À la pleine lune, où se trouve la Terre ?', o: ['Entre le Soleil et la Lune', 'Derrière le Soleil', 'Sur le côté', 'La Lune est entre le Soleil et la Terre'], a: 0, hint: 'On voit toute la face éclairée…', e: 'La Terre est entre le Soleil et la Lune : on voit toute la moitié éclairée.' },
      { title: 'Éclipse de Soleil', text: 'Règle la Lune et les nœuds pour provoquer une <span style="color:var(--amber)">éclipse de Soleil</span>.', lumi: 'Il faut un alignement parfait, et la Lune dans le plan Terre-Soleil.', hint: 'Nouvelle lune (jour 0) et nœuds à 0° ou 180°.',
        build: function (api) { var lab = mini(api, { phi: 90, nu: 70 }); api.c.slider({ label: 'Jour', min: 0, max: 29.5, step: 0.5, value: 7.5, unit: 'j', dec: 1, onInput: function (v) { lab.st.phi = v / LUN * 360; } }); api.c.slider({ label: 'Position des nœuds', min: 0, max: 180, step: 5, value: 70, unit: '°', onInput: function (v) { lab.st.nu = v; } }); return function () { return lab.res().E.t === 'sol' ? { ok: true, msg: 'Soleil, Lune et Terre alignés : éclipse de Soleil !' } : { ok: false, msg: 'Pas d’éclipse de Soleil.' }; }; },
        e: 'Éclipse de Soleil : nouvelle lune + Lune dans le plan Terre-Soleil.' },
      { type: 'qcm', title: 'Pourquoi pas chaque mois ?', text: 'Pourquoi n’y a-t-il pas une éclipse à chaque nouvelle lune ?', o: ['La Lune est trop petite', 'L’orbite de la Lune est inclinée : elle passe souvent au-dessus ou au-dessous', 'Le Soleil s’éteint', 'La Terre ne tourne pas'], a: 1, hint: 'Regarde la vue de côté.', e: 'L’orbite lunaire est inclinée d’environ 5° : l’alignement parfait est rare.' },
      { type: 'qcm', title: 'Combien de jours ?', text: 'Combien de temps dure un cycle complet des phases de la Lune ?', o: ['7 jours', '24 heures', 'environ 29,5 jours', '365 jours'], a: 2, hint: 'C’est une lunaison, à peu près un mois.', e: 'Une lunaison dure environ 29,5 jours.' }
    ]
  };

  S.start({
    inquiry: {"situation": "La Lune ne présente pas toujours le même aspect. Comment les positions du Soleil, de la Terre et de la Lune permettent-elles de l’expliquer ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-phases-eclipses', level: '4e', theme: 'Optique', title: 'Les phases de la Lune et les éclipses', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La Lune est un <b>objet diffusant</b> : elle renvoie la lumière du Soleil. À chaque instant, la moitié tournée vers le Soleil est éclairée.',
      'La Lune tourne autour de la Terre en environ 27,3 jours ; le cycle de ses phases (la <b>lunaison</b>) dure environ <b>29,5 jours</b>, car la Terre a aussi avancé autour du Soleil. Depuis la Terre, on voit une partie plus ou moins grande de sa moitié éclairée : ce sont les <b>phases</b> (nouvelle lune, premier croissant, premier quartier, gibbeuse, pleine lune, dernier quartier, dernier croissant).',
      'À la <b>nouvelle lune</b>, la Lune est entre le Soleil et la Terre ; à la <b>pleine lune</b>, la Terre est entre le Soleil et la Lune.',
      '<b>Éclipse de Soleil</b> : Soleil, Lune et Terre sont alignés (nouvelle lune) ; la Lune cache le Soleil et son ombre se projette sur la Terre.',
      '<b>Éclipse de Lune</b> : Soleil, Terre et Lune sont alignés (pleine lune) ; la Lune passe dans l’ombre de la Terre. Les éclipses sont rares car l’orbite de la Lune est inclinée.'
    ],
    quiz: [
      { q: 'Pourquoi voit-on la Lune ?', o: ['Elle produit sa lumière', 'Elle diffuse la lumière du Soleil', 'Elle reflète la Terre', 'Elle brûle'], a: 1, e: 'C’est un objet diffusant éclairé par le Soleil.' },
      { q: 'À la nouvelle lune, la Lune est :', o: ['entre le Soleil et la Terre', 'derrière la Terre', 'invisible car éteinte', 'à côté du Soleil'], a: 0, e: 'Sa face éclairée est tournée vers le Soleil, on voit sa face sombre.' },
      { q: 'Lors d’une éclipse de Soleil :', o: ['la Terre cache la Lune', 'la Lune cache le Soleil', 'le Soleil cache la Lune', 'la Lune devient rouge'], a: 1, e: 'La Lune passe devant le Soleil.' },
      { q: 'Une éclipse de Lune a lieu :', o: ['à la nouvelle lune', 'à la pleine lune', 'au premier quartier', 'chaque nuit'], a: 1, e: 'Soleil – Terre – Lune alignés : pleine lune.' },
      { q: 'La durée d’une lunaison est d’environ :', o: ['1 jour', '7 jours', '29,5 jours', '1 an'], a: 2, e: 'Environ 29,5 jours.' }
    ]
  });
})();

