/* 6e · Mesure de grandeurs physiques · Leçon : Volume d’un liquide et d’un solide */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var OBJ = { caillou: { n: 'caillou', v: 18, c: '#8B8378' }, cle: { n: 'clé', v: 4, c: '#D8B64A' }, bille: { n: 'bille', v: 7, c: '#4FA8FF' } };
  var EYE = { haut: 2, bon: 0, bas: -2 };
  var GID = 0;
  function Lab(G, o) {
    var st = Object.assign({ mode: 'eprouvette', V: 64, eye: 'bon', v1: 60, obj: 'caillou', drop: 0, dropping: false, ml: 1500, pour: 1, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- ÉPROUVETTE ---------- */
    var E = s('g', {}, G), CX = 190, CW = 58, Y0 = 384, PPM = 2.6, YT = Y0 - 104 * PPM;
    function yv(v) { return Y0 - v * PPM; }
    s('path', { d: 'M' + (CX - 60) + ' ' + (Y0 + 30) + ' h120 l-14 -18 h-92z', fill: '#BFE6FF', 'fill-opacity': 0.4, stroke: '#BFE6FF', 'stroke-width': 2 }, E);
    var liq = s('path', { fill: '#4FA8FF', opacity: 0.55 }, E), men = s('path', { fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2 }, E);
    var objG = s('g', {}, E), objS = s('path', { stroke: '#0006', 'stroke-width': 1.5 }, objG);
    s('path', { d: 'M' + (CX - CW / 2) + ' ' + (YT - 6) + ' V' + (Y0 + 12) + ' H' + (CX + CW / 2) + ' V' + (YT - 6) + ' l8 -6', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, E);
    for (var m = 0; m <= 100; m += 2) { var yy = yv(m), big = m % 10 === 0; s('line', { x1: CX - CW / 2, x2: CX - CW / 2 + (big ? 18 : 9), y1: yy, y2: yy, stroke: '#C9D2E3', 'stroke-width': big ? 1.6 : 0.8 }, E); if (big) s('text', { x: CX - CW / 2 - 6, y: yy + 4, 'text-anchor': 'end', 'font-size': 10.5, fill: '#A9B4C7', text: m }, E); }
    s('text', { x: CX, y: YT - 18, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'mL' }, E);
    var eye = s('g', {}, E); s('ellipse', { rx: 16, ry: 10, fill: '#EEF2F8' }, eye); s('circle', { r: 6, fill: '#3B2A1A' }, eye); s('circle', { r: 2.5, fill: '#000' }, eye);
    var sight = s('line', { stroke: '#FFC773', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, E);
    var mark = s('line', { stroke: '#FF6B5E', 'stroke-width': 2.4 }, E);
    /* loupe sur le ménisque */
    var ZX = 430, ZY = 252, ZR = 80, cid = 'vz' + (GID++), cp = s('clipPath', { id: cid }, s('defs', {}, E)); s('circle', { cx: ZX, cy: ZY, r: ZR }, cp);
    var Z = s('g', {}, E); s('circle', { cx: ZX, cy: ZY, r: ZR + 3, fill: '#141C30', stroke: '#FFC773', 'stroke-width': 3 }, Z);
    var Zc = s('g', { 'clip-path': 'url(#' + cid + ')' }, Z), zLiq = s('path', { fill: '#4FA8FF', opacity: 0.5 }, Zc), zMen = s('path', { fill: 'none', stroke: '#9FD7FF', 'stroke-width': 3 }, Zc), zRed = s('line', { x1: ZX - ZR, x2: ZX + ZR, stroke: '#FF6B5E', 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, Zc), zTicks = s('g', {}, Zc);
    var zLab = s('text', { x: ZX, y: ZY + ZR + 24, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#FFC773' }, Z);
    var eMsg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, E);
    var rdBox = s('g', {}, E); s('rect', { x: 360, y: 98, width: 160, height: 56, rx: 12, fill: '#EEF2F8' }, rdBox); s('text', { x: 440, y: 116, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3A3426', text: 'JE LIS' }, rdBox); var rdT = s('text', { x: 440, y: 144, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#1A1F28' }, rdBox);
    /* ---------- UNITÉS ---------- */
    var U = s('g', {}, G);
    var cube = s('g', {}, U); s('path', { d: 'M90 200 h150 v150 h-150z M90 200 l50 -40 h150 l-50 40 M240 350 l50 -40 v-150', fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2.5 }, cube); for (var i = 1; i < 10; i++) { s('line', { x1: 90 + i * 15, y1: 200, x2: 90 + i * 15, y2: 350, stroke: '#9FD7FF', 'stroke-width': 0.6, opacity: 0.4 }, cube); s('line', { x1: 90, y1: 200 + i * 15, x2: 240, y2: 200 + i * 15, stroke: '#9FD7FF', 'stroke-width': 0.6, opacity: 0.4 }, cube); }
    var cubeF = s('rect', { x: 91, width: 148, fill: '#4FA8FF', opacity: 0.45 }, U);
    s('rect', { x: 90, y: 335, width: 15, height: 15, fill: '#FFB547' }, U); s('text', { x: 165, y: 150, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#9FD7FF', text: '1 dm³ = 1 L' }, U); s('text', { x: 165, y: 378, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#FFB547', text: 'petit cube orange : 1 cm³ = 1 mL' }, U);
    s('text', { x: 165, y: 396, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: '1 000 petits cubes remplissent le grand' }, U);
    var bot = s('g', {}, U), BX = 420; s('path', { d: 'M' + (BX - 12) + ' 120 v24 q-34 14 -34 54 v170 q0 14 14 14 h64 q14 0 14 -14 v-170 q0 -40 -34 -54 v-24z', fill: '#BFE6FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, bot); s('rect', { x: BX - 14, y: 108, width: 28, height: 14, rx: 3, fill: '#4C6BFF' }, bot);
    var botL = s('rect', { x: BX - 44, width: 88, fill: '#4FA8FF', opacity: 0.5 }, U), botT = s('text', { x: BX, y: 410, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3', text: 'bouteille de 1,5 L' }, U);
    var uBig = s('text', { x: 290, y: 118, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#EEF2F8' }, U);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'LE VOLUME' }, P);
    var hdr = ['L', 'dL', 'cL', 'mL'], cellT = [];
    hdr.forEach(function (h, k) { var x = PX + 22 + k * 59; s('rect', { x: x, y: 66, width: 55, height: 26, rx: 6, fill: '#1A2540' }, P); s('text', { x: x + 27.5, y: 84, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#9FD7FF', text: h }, P); cellT.push(s('text', { x: x + 27.5, y: 120, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#EEF2F8' }, P)); });
    s('text', { x: PX + 140, y: 150, 'text-anchor': 'middle', 'font-size': 11, fill: '#7D89A3', text: 'tableau de conversion' }, P);
    var big = s('text', { x: PX + 140, y: 196, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 900, fill: '#FFC773' }, P);
    [['1 L = 1 000 mL', '#C9D2E3'], ['1 L = 1 dm³', '#9FD7FF'], ['1 mL = 1 cm³', '#FFB547']].forEach(function (r, k) { s('text', { x: PX + 140, y: 236 + k * 24, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: r[1], text: r[0] }, P); });
    var pq = [0, 1, 2, 3].map(function (k) { return s('text', { x: PX + 140, y: 334 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    function table(ml) { var d = String(Math.round(ml)).padStart(4, '0').split(''), lead = true; d.forEach(function (c, k) { if (c !== '0' || k === 3) lead = false; cellT[k].textContent = lead && k < 3 ? '' : c; }); if (Math.round(ml) >= 10000) cellT[0].textContent = String(Math.floor(ml / 1000)); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      E.style.display = st.mode === 'unites' ? 'none' : ''; U.style.display = st.mode === 'unites' ? '' : 'none';
      if (st.mode !== 'unites') {
        var sol = st.mode === 'solide', ob = OBJ[st.obj];
        if (st.t == null && sol) st.drop = st.dropping ? Math.min(1, st.drop + dt / 1.2) : Math.max(0, st.drop - dt / 1.2);
        var dk = sol ? Math.min(1, st.drop * 1.25) : 0, inW = sol ? (st.drop >= 0.999 ? 1 : Math.max(0, (st.drop - 0.55) / 0.45)) : 0;
        var V = sol ? st.v1 + ob.v * Math.min(1, inW) : st.V, yl = yv(V);
        liq.setAttribute('d', 'M' + (CX - CW / 2 + 2) + ' ' + (yl - 3) + ' Q' + CX + ' ' + (yl + 3) + ' ' + (CX + CW / 2 - 2) + ' ' + (yl - 3) + ' V' + (Y0 + 10) + ' H' + (CX - CW / 2 + 2) + 'Z');
        men.setAttribute('d', 'M' + (CX - CW / 2 + 2) + ' ' + (yl - 3) + ' Q' + CX + ' ' + (yl + 3) + ' ' + (CX + CW / 2 - 2) + ' ' + (yl - 3));
        objG.style.display = sol ? '' : 'none';
        if (sol) { var oy = (YT - 30) + (Y0 - 4 - (YT - 30)) * (dk * dk); objG.setAttribute('transform', 'translate(' + CX + ' ' + oy + ')'); objS.setAttribute('fill', ob.c); objS.setAttribute('d', st.obj === 'caillou' ? 'M-20 0 q-4 -16 8 -22 q14 -8 26 2 q10 10 2 20z' : st.obj === 'cle' ? 'M-4 0 v-22 h8 v22 h-3 v-6 h-2 v6z M0 -42 a10 10 0 1 0 0.1 0z' : 'M0 0 a11 11 0 1 1 0.1 0z'); }
        var eo = EYE[st.eye], read = V + eo, ey = yv(V) - eo * 14;
        eye.setAttribute('transform', 'translate(' + (CX + 110) + ' ' + ey + ')');
        attr(sight, { x1: CX + 94, y1: ey, x2: CX - CW / 2, y2: yv(read) }); attr(mark, { x1: CX - CW / 2 - 4, x2: CX + CW / 2 + 4, y1: yv(read), y2: yv(read) });
        while (zTicks.firstChild) zTicks.removeChild(zTicks.firstChild);
        var ZP = 9, zy = function (v) { return ZY - (v - V) * ZP; };
        for (var q = Math.floor(V) - 9; q <= Math.ceil(V) + 9; q++) { if (q < 0) continue; var y2 = zy(q), bg = q % 5 === 0; s('line', { x1: ZX - ZR, x2: ZX - ZR + (bg ? 46 : 26), y1: y2, y2: y2, stroke: '#EEF2F8', 'stroke-width': bg ? 2 : 1 }, zTicks); if (bg) s('text', { x: ZX - ZR + 52, y: y2 + 4, 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8', text: q }, zTicks); }
        zLiq.setAttribute('d', 'M' + (ZX - ZR) + ' ' + (ZY - 22) + ' Q' + ZX + ' ' + (ZY + 22) + ' ' + (ZX + ZR) + ' ' + (ZY - 22) + ' V' + (ZY + ZR) + ' H' + (ZX - ZR) + 'Z'); zMen.setAttribute('d', 'M' + (ZX - ZR) + ' ' + (ZY - 22) + ' Q' + ZX + ' ' + (ZY + 22) + ' ' + (ZX + ZR) + ' ' + (ZY - 22));
        attr(zRed, { y1: ZY, y2: ZY }); zLab.textContent = 'lire au bas du ménisque';
        rdT.textContent = fmt(read, 0) + ' mL'; rdT.setAttribute('fill', eo ? '#E5484D' : '#1A7F4B');
        eMsg.textContent = sol ? (inW >= 1 ? 'V = ' + fmt(V, 0) + ' − ' + st.v1 + ' = ' + ob.v + ' mL : volume du ' + ob.n : 'Eau seule : V₁ = ' + st.v1 + ' mL. Plonge l’objet…') : eo > 0 ? 'Œil trop haut : on lit une valeur trop grande' : eo < 0 ? 'Œil trop bas : on lit une valeur trop petite' : 'Œil au niveau du ménisque : bonne lecture';
        big.textContent = fmt(read, 0) + ' mL'; table(read);
        pset(sol ? ['Volume d’un solide :', 'V = V₂ − V₁', '(niveau après − niveau avant)', 'Le solide doit être immergé.'] : ['Lire l’éprouvette :', 'œil au niveau du liquide,', 'au bas du ménisque.', 'Le volume se mesure en mL.']);
        res = { V: V, read: read, eye: st.eye, inW: inW, v1: st.v1, obj: st.obj, vObj: ob.v };
      } else {
        var ml = st.ml, f = Math.min(1, ml / 1000), bf = Math.min(1, ml / 1500);
        attr(cubeF, { y: 350 - 149 * f, height: 149 * f }); attr(botL, { y: 382 - 210 * bf, height: 210 * bf });
        uBig.textContent = fmt(ml / 1000, ml % 1000 ? (ml % 100 ? 2 : 1) : 0) + ' L = ' + Math.round(ml) + ' mL';
        big.textContent = Math.round(ml) + ' mL'; table(ml);
        pset(['Unité légale : le mètre cube (m³).', 'Unités courantes : le litre (L)', 'et le millilitre (mL).', 'Pour convertir : le tableau.']);
        res = { ml: ml };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’éprouvette graduée' }, { t: 9, title: 'Bien lire' }, { t: 22, title: 'La position de l’œil' }, { t: 31, title: 'Volume d’un solide' }, { t: 46, title: 'Les unités' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Le volume se mesure avec une <b>éprouvette graduée</b>', 'œil au niveau du liquide, on lit au <b>bas du ménisque</b>.', '#4FA8FF'],
      ['Volume d’un solide : <b>V = V₂ − V₁</b>', 'on le plonge dans l’eau et on mesure la montée du niveau.', '#FFB547'],
      ['<b>1 L = 1 000 mL = 1 dm³</b>', 'et <b>1 mL = 1 cm³</b>.', '#9FD7FF']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 9) { st.mode = 'eprouvette'; st.eye = 'bon'; st.V = 64 * K.k(t, 1.5, 6); }
        else if (t < 22) { st.mode = 'eprouvette'; st.eye = 'bon'; st.V = 64; }
        else if (t < 31) { st.mode = 'eprouvette'; st.V = 64; st.eye = t < 26.5 ? 'haut' : 'bas'; }
        else if (t < 46) { st.mode = 'solide'; st.v1 = 60; st.obj = 'caillou'; st.eye = 'bon'; st.drop = K.k(t, 35, 1.6); }
        else { st.mode = 'unites'; st.ml = t < 51 ? 1000 * K.k(t, 46.5, 3) : 1000 + 500 * K.k(t, 51.5, 2.5); }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Quel volume d’eau ?') || tg.show(t, 10, 21.6, 290, 92, 'Au bas du ménisque : 64 mL') || tg.show(t, 22.6, 26.3, 290, 92, 'Œil trop haut : 66 mL ✗') || tg.show(t, 26.8, 30.6, 290, 92, 'Œil trop bas : 62 mL ✗') ||
          tg.show(t, 32, 36.5, 290, 92, 'Avant : V₁ = 60 mL') || tg.show(t, 37.5, 45.6, 290, 92, 'Après : V₂ = 78 mL → V = 18 mL') || tg.show(t, 47, 56.6, 290, 92, st.ml <= 1000 ? '1 L = 1 dm³ = 1 000 mL' : '1,5 L = 1 500 mL');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : on verse de l’eau dans une éprouvette graduée jusqu’à 64 mL ; une loupe montre le ménisque et la lecture à son bas ; un œil placé trop haut lit 66 mL, trop bas 62 mL ; un caillou plongé dans 60 mL d’eau fait monter le niveau à 78 mL, son volume est 18 mL ; enfin un cube de 1 dm³ et une bouteille de 1,5 L se remplissent',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'Pour mesurer le volume d’un liquide, on utilise une éprouvette graduée. Versons-y de l’eau.', sub: 'L’<b>éprouvette graduée</b> mesure les volumes.' },
      { t: 9, d: 12.6, say: 'La surface de l’eau est un peu courbée : c’est le ménisque. On place l’œil à sa hauteur et on lit au bas du ménisque : soixante-quatre millilitres.', sub: 'On lit au <b>bas du ménisque</b> : 64 mL.' },
      { t: 22, d: 8.6, say: 'Si l’œil est trop haut, on lit une valeur trop grande. S’il est trop bas, une valeur trop petite.', sub: 'L’œil doit être <b>au niveau</b> du liquide.' },
      { t: 31, d: 6, say: 'Pour un solide, comme un caillou, on lit d’abord le volume d’eau : soixante millilitres.', sub: 'Eau seule : <b>V₁ = 60 mL</b>.' },
      { t: 37.2, d: 8.6, say: 'On plonge le caillou : l’eau monte à soixante-dix-huit millilitres. Le volume du caillou est la différence : dix-huit millilitres.', sub: 'V = V₂ − V₁ = 78 − 60 = <b>18 mL</b>.' },
      { t: 46, d: 5, say: 'Un litre, c’est le volume d’un cube de un décimètre de côté.', sub: '<b>1 L = 1 dm³</b>.' },
      { t: 51.2, d: 5.6, say: 'Un litre vaut mille millilitres : une bouteille de un litre et demi contient mille cinq cents millilitres.', sub: '1 L = 1 000 mL · 1,5 L = 1 500 mL.' },
      { t: 57, d: 4.4, say: 'À retenir : on lit l’éprouvette au bas du ménisque, l’œil au niveau du liquide.', sub: 'Lire au bas du ménisque.' },
      { t: 61.6, d: 4.2, say: 'Le volume d’un solide est V deux moins V un.', sub: 'V = V₂ − V₁.' },
      { t: 66, d: 5, say: 'Un litre égale mille millilitres, et un millilitre égale un centimètre cube.', sub: '1 L = 1 000 mL ; 1 mL = 1 cm³.' }
    ],
    learn: [
      { t: 21, ch: 1, html: 'On lit l’éprouvette au <b>bas du ménisque</b>.' },
      { t: 30, ch: 2, html: 'L’œil doit être <b>au niveau</b> du liquide.' },
      { t: 45, ch: 3, html: 'Volume d’un solide : <b>V = V₂ − V₁</b>.' },
      { t: 56, ch: 4, html: '<b>1 L = 1 000 mL = 1 dm³</b> ; 1 mL = 1 cm³.' }
    ],
    question: { q: 'L’eau passe de 50 mL à 62 mL quand on plonge une clé. Le volume de la clé est :', o: ['62 mL', '50 mL', '12 mL', '112 mL'], a: 2, e: '62 − 50 = 12 mL.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Une éprouvette graduée de 100 mL avec une loupe sur le ménisque et un œil que l’on peut placer trop haut, au bon niveau ou trop bas ; un mode où l’on plonge un caillou, une clé ou une bille dans l’eau ; un mode unités avec un cube de 1 dm³ et une bouteille ; à droite, le tableau de conversion',
    steps: [
      'Éprouvette : règle le volume d’eau et place l’œil au bon niveau.',
      'Observe l’erreur quand l’œil est trop haut ou trop bas.',
      'Solide : plonge un objet et calcule V = V₂ − V₁.',
      'Unités : convertis les volumes en L et en mL.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { V: 40 }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'eprouvette', options: [{ v: 'eprouvette', l: 'Lire une éprouvette' }, { v: 'solide', l: 'Volume d’un solide' }, { v: 'unites', l: 'Les unités' }], onChange: function (v) { st.mode = v; vis(); } });
      var sV = c.slider({ label: 'Eau versée', min: 10, max: 95, step: 1, value: 40, unit: 'mL', dec: 0, onInput: function (v) { st.V = v; } });
      var cE = c.seg({ label: 'Position de l’œil', value: 'bon', options: [{ v: 'haut', l: 'trop haut' }, { v: 'bon', l: 'au niveau' }, { v: 'bas', l: 'trop bas' }], onChange: function (v) { st.eye = v; } });
      var s1 = c.slider({ label: 'Eau avant (V₁)', min: 30, max: 70, step: 1, value: 60, unit: 'mL', dec: 0, onInput: function (v) { st.v1 = v; } });
      var cO = c.seg({ label: 'Objet', value: 'caillou', options: [{ v: 'caillou', l: 'caillou' }, { v: 'cle', l: 'clé' }, { v: 'bille', l: 'bille' }], onChange: function (v) { st.obj = v; st.dropping = false; st.drop = 0; } });
      var bD = c.button({ label: 'Plonger / retirer l’objet', primary: true, onClick: function () { st.dropping = !st.dropping; } });
      var sU = c.slider({ label: 'Volume', min: 0, max: 2000, step: 50, value: 1500, unit: 'mL', dec: 0, onInput: function (v) { st.ml = v; } });
      function vis() { var m = st.mode; sV.hide(m !== 'eprouvette'); cE.hide(m === 'unites'); s1.hide(m !== 'solide'); cO.hide(m !== 'solide'); bD.style.display = m === 'solide' ? '' : 'none'; sU.hide(m !== 'unites'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Lecture' }, { k: 'b', label: 'Résultat' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'unites') { ro.a.set(fmt(st.ml / 1000, 2) + ' L'); ro.b.set(st.ml + ' mL = ' + st.ml + ' cm³'); } else if (st.mode === 'solide') { ro.a.set(fmt(last.read, 0) + ' mL'); ro.b.set(last.inW >= 1 ? 'V = ' + fmt(last.read, 0) + ' − ' + st.v1 + ' = ' + fmt(last.read - st.v1, 0) + ' mL' : 'V₁ = ' + st.v1 + ' mL'); } else { ro.a.set(fmt(last.read, 0) + ' mL'); ro.b.set(st.eye === 'bon' ? 'lecture correcte' : 'erreur de ' + (st.eye === 'haut' ? '+' : '−') + '2 mL'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var r = st.mode === 'unites' ? { e: 'conversion', l: st.ml + ' mL', o: fmt(st.ml / 1000, 2) + ' L' } : st.mode === 'solide' ? { e: OBJ[st.obj].n + (last.inW >= 1 ? '' : ' (pas plongé)'), l: fmt(last.read, 0) + ' mL', o: last.inW >= 1 ? 'V = ' + fmt(last.read - st.v1, 0) + ' mL' : '—' } : { e: 'œil ' + { haut: 'trop haut', bon: 'au niveau', bas: 'trop bas' }[st.eye], l: fmt(last.read, 0) + ' mL', o: st.eye === 'bon' ? 'correct' : 'faux' }; rows.push(r); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Lecture</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.l + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Conversions utiles</h3><table class="mt"><thead><tr><th>Volume</th><th>en mL</th><th>en cm³</th></tr></thead><tbody><tr><td>1 L</td><td>1 000 mL</td><td>1 000 cm³ (= 1 dm³)</td></tr><tr><td>1 dL</td><td>100 mL</td><td>100 cm³</td></tr><tr><td>1 cL</td><td>10 mL</td><td>10 cm³</td></tr><tr><td>canette 33 cL</td><td>330 mL</td><td>330 cm³</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'eprouvette', V: 40, eye: 'bon', v1: 60, obj: 'caillou', drop: 0, dropping: false, ml: 1500 }); cM.set('eprouvette'); sV.set(40); cE.set('bon'); s1.set(60); cO.set('caillou'); sU.set(1500); vis(); rows = []; paint(); });
      api.say('Place l’œil au niveau du liquide.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures.</p>';
        return '<p>Le <b>volume</b> d’un corps est la place qu’il occupe. On mesure le volume d’un liquide avec une <b>éprouvette graduée</b> posée à plat : l’œil au niveau du liquide, on lit au <b>bas du ménisque</b>. Un œil trop haut donne une valeur trop grande, trop bas une valeur trop petite.</p><p>Pour un solide, on mesure le niveau de l’eau avant (V₁) puis après l’avoir plongé (V₂) : <b>V = V₂ − V₁</b>.</p><p>Unités : <b>1 L = 1 000 mL = 1 dm³</b> et <b>1 mL = 1 cm³</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Mesure de volume' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du laborantin',
    intro: 'Mesure juste, au millilitre près !',
    missions: [
      { title: 'Juste 75 mL', text: 'Verse exactement <span style="color:#4FA8FF">75 mL</span> d’eau et lis-les avec l’œil au bon niveau.', lumi: 'Une lecture juste demande un œil bien placé.', hint: 'Œil « au niveau », curseur sur 75.',
        build: function (api) { var lab = mini(api, { V: 40, eye: 'haut' }); api.c.slider({ label: 'Eau versée', min: 10, max: 95, step: 1, value: 40, unit: 'mL', dec: 0, onInput: function (v) { lab.st.V = v; } }); api.c.seg({ label: 'Œil', value: 'haut', options: [{ v: 'haut', l: 'trop haut' }, { v: 'bon', l: 'au niveau' }, { v: 'bas', l: 'trop bas' }], onChange: function (v) { lab.st.eye = v; } }); return function () { var r = lab.res(); return r.V === 75 && r.eye === 'bon' ? { ok: true, msg: '75 mL, lecture parfaite.' } : { ok: false, msg: r.eye !== 'bon' ? 'Ta lecture est faussée par la position de l’œil.' : 'Tu as ' + r.V + ' mL.' }; }; },
        e: 'Œil au niveau, bas du ménisque.' },
      { type: 'qcm', title: 'Erreur de lecture', text: 'Avec l’œil trop haut, la valeur lue est :', o: ['trop grande', 'trop petite', 'juste', 'impossible à lire'], a: 0, hint: 'Regarde la ligne de visée.', e: 'Œil trop haut : valeur trop grande.' },
      { title: 'La clé', text: 'Mesure le volume de la <b>clé</b> en la plongeant dans l’eau.', lumi: 'V = V₂ − V₁.', hint: 'Choisis la clé et plonge-la.',
        build: function (api) { var lab = mini(api, { mode: 'solide', obj: 'caillou' }); api.c.seg({ label: 'Objet', value: 'caillou', options: [{ v: 'caillou', l: 'caillou' }, { v: 'cle', l: 'clé' }, { v: 'bille', l: 'bille' }], onChange: function (v) { lab.st.obj = v; lab.st.drop = 0; lab.st.dropping = false; } }); api.c.button({ label: 'Plonger / retirer', sm: true, onClick: function () { lab.st.dropping = !lab.st.dropping; } }); return function () { var r = lab.res(); return r.obj === 'cle' && r.inW >= 1 ? { ok: true, msg: 'V = ' + fmt(r.V, 0) + ' − ' + r.v1 + ' = 4 mL.' } : { ok: false, msg: r.obj !== 'cle' ? 'Ce n’est pas la clé.' : 'Plonge-la entièrement.' }; }; },
        e: 'La clé a un volume de 4 mL.' },
      { type: 'qcm', title: 'Calcul', text: 'Niveau avant : 45 mL ; après avoir plongé un caillou : 63 mL. Volume du caillou ?', o: ['63 mL', '18 mL', '45 mL', '108 mL'], a: 1, hint: 'Après − avant.', e: '63 − 45 = 18 mL.' },
      { title: 'Conversion', text: 'Affiche un volume de <span style="color:#FFC773">0,75 L</span>.', lumi: '1 L = 1 000 mL.', hint: '750 mL.',
        build: function (api) { var lab = mini(api, { mode: 'unites', ml: 0 }); api.c.slider({ label: 'Volume', min: 0, max: 2000, step: 50, value: 0, unit: 'mL', dec: 0, onInput: function (v) { lab.st.ml = v; } }); return function () { var r = lab.res(); return r.ml === 750 ? { ok: true, msg: '0,75 L = 750 mL.' } : { ok: false, msg: r.ml + ' mL = ' + fmt(r.ml / 1000, 2) + ' L.' }; }; },
        e: '0,75 × 1 000 = 750 mL.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On veut mesurer le volume d’un liquide puis d’un solide. Quels relevés et quelles unités faut-il utiliser ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-volume', level: '6e', theme: 'Mesure de grandeurs physiques', title: 'Volume d’un liquide et d’un solide', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le <b>volume</b> d’un corps est la place qu’il occupe. On le mesure avec une <b>éprouvette graduée</b>.',
      'L’éprouvette est posée à plat ; l’œil est placé <b>au niveau du liquide</b> et on lit au <b>bas du ménisque</b>.',
      'Volume d’un solide (non poreux, qui coule) : on lit V₁ avant et V₂ après l’avoir plongé ; <b>V = V₂ − V₁</b>.',
      'L’unité légale est le mètre cube (m³) ; on utilise souvent le <b>litre (L)</b> et le <b>millilitre (mL)</b>.',
      '<b>1 L = 1 000 mL = 1 dm³</b> ; <b>1 mL = 1 cm³</b> ; 1 L = 10 dL = 100 cL.'
    ],
    quiz: [
      { q: 'On mesure le volume d’un liquide avec :', o: ['une balance', 'une éprouvette graduée', 'un thermomètre', 'une règle'], a: 1, e: 'L’éprouvette graduée.' },
      { q: 'On lit le volume :', o: ['en haut du ménisque', 'au bas du ménisque', 'au bord du verre', 'n’importe où'], a: 1, e: 'Au bas du ménisque.' },
      { q: '1 L est égal à :', o: ['100 mL', '1 000 mL', '10 mL', '10 000 mL'], a: 1, e: '1 L = 1 000 mL.' },
      { q: '1 mL est égal à :', o: ['1 dm³', '1 cm³', '1 m³', '10 cm³'], a: 1, e: '1 mL = 1 cm³.' },
      { q: 'L’eau passe de 30 mL à 37 mL avec une bille. Volume de la bille :', o: ['7 mL', '37 mL', '67 mL', '30 mL'], a: 0, e: '37 − 30 = 7 mL.' }
    ]
  });
})();

