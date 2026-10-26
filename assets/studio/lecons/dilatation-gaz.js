/* 5e · Propriétés physiques de la matière · Leçon : Dilatation des gaz */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  function vRatio(T) { return (T + 273) / 293; }
  function pct(kind, dT) { return kind === 'gaz' ? 100 * dT / 293 : kind === 'liquide' ? 100 * 1.1e-3 * dT : 100 * 3 * 12e-6 * dT; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'ballon', T: 20, Tb: 20, Tmax: 20, nb: 0, dT: 50, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- BALLON + BAUDRUCHE ---------- */
    var A = s('g', {}, G);
    var bath = s('rect', { x: 124, y: 290, width: 332, height: 112 }, A); s('path', { d: 'M120 250 V398 q0 6 6 6 H454 q6 0 6 -6 V250', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    var plate = s('rect', { x: 110, y: 406, width: 360, height: 16, rx: 5 }, A), plateG = s('rect', { x: 110, y: 398, width: 360, height: 32, rx: 12, fill: TK.glow(G, '#FF5A2E'), opacity: 0 }, A);
    var ice = s('g', {}, A); [0, 1, 2, 3].forEach(function (i) { s('rect', { x: 150 + i * 80, y: 292, width: 24, height: 18, rx: 4, fill: '#E8F4FF', opacity: 0.85, transform: 'rotate(' + (i * 23 - 20) + ' ' + (162 + i * 80) + ' 301)' }, ice); });
    var stA = [0, 1, 2, 3].map(function () { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2, fill: 'none' }, A); });
    s('circle', { cx: 290, cy: 320, r: 62, fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    s('path', { d: 'M276 260 V200 H304 V260', fill: '#0F1729', stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    var balloon = s('path', { fill: '#E5484D', stroke: '#FF8A80', 'stroke-width': 2 }, A), shine = s('ellipse', { fill: '#FFFFFF', opacity: 0.25 }, A);
    s('rect', { x: 272, y: 196, width: 36, height: 10, rx: 3, fill: '#B83236' }, A);
    var airA = s('g', {}, A), AP = []; for (var i = 0; i < 16; i++) AP.push(s('circle', { r: 3, fill: '#E8F4FF', opacity: 0.8 }, airA));
    var aMsg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, A);
    /* ---------- BULLES ---------- */
    var B = s('g', {}, G);
    s('rect', { x: 330, y: 250, width: 170, height: 150, fill: '#5FA8E8', opacity: 0.55 }, B); s('path', { d: 'M326 220 V398 q0 6 6 6 H498 q6 0 6 -6 V220', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, B);
    s('circle', { cx: 170, cy: 300, r: 70, fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, B);
    s('rect', { x: 154, y: 196, width: 32, height: 40, rx: 4, fill: '#8B6B3D' }, B);
    s('path', { d: 'M170 196 V140 H420 V360', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 8, 'stroke-linejoin': 'round', opacity: 0.8 }, B);
    s('path', { d: 'M170 196 V140 H420 V360', fill: 'none', stroke: '#0F1729', 'stroke-width': 4, 'stroke-linejoin': 'round' }, B);
    var wcol = s('line', { x1: 420, x2: 420, y2: 360, stroke: '#5FA8E8', 'stroke-width': 4 }, B);
    var hands = s('g', {}, B); [[-1], [1]].forEach(function (d) { s('path', { d: 'M' + (170 + d[0] * 92) + ' 300 q' + (-d[0] * 20) + ' -40 ' + (-d[0] * 26) + ' -10 q' + (-d[0] * 4) + ' 30 0 60 q' + (d[0] * 20) + ' 10 ' + (d[0] * 26) + ' -50z', fill: '#C68B59', stroke: '#8D5A35', 'stroke-width': 2 }, hands); });
    var bub = s('g', {}, B), BB = []; for (i = 0; i < 14; i++) BB.push(s('circle', { r: 4 + (i % 3) * 2, fill: 'none', stroke: '#E8F4FF', 'stroke-width': 2 }, bub));
    var bMsg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, B);
    s('text', { x: 170, y: 394, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: 'ballon rempli d’air' }, B);
    /* ---------- COMPARAISON ---------- */
    var Cg = s('g', {}, G), KIND = [['solide', 'fer (solide)', '#9AA6BC'], ['liquide', 'alcool (liquide)', '#E5484D'], ['gaz', 'air (gaz)', '#4FC3FF']];
    s('text', { x: 290, y: 116, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#EEF2F8', text: 'Augmentation de volume pour le même échauffement' }, Cg);
    var CB = KIND.map(function (k, j) { var y = 166 + j * 80; s('text', { x: 70, y: y - 10, 'font-size': 13, 'font-weight': 800, fill: k[2], text: k[1] }, Cg); s('rect', { x: 70, y: y, width: 420, height: 34, rx: 8, fill: '#1A2540' }, Cg); return { b: s('rect', { x: 70, y: y, height: 34, rx: 8, fill: k[2] }, Cg), t: s('text', { x: 80, y: y + 23, 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, Cg) }; });
    var cMsg = s('text', { x: 290, y: 420, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#FFC773' }, Cg);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var th = TK.thermometer(P, PX + 40, 70, 180, -10, 90);
    var pv = s('text', { x: PX + 178, y: 90, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), pv1 = s('text', { x: PX + 178, y: 124, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#FFC773' }, P), pv2 = s('text', { x: PX + 178, y: 148, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var pv3 = s('text', { x: PX + 178, y: 186, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P), pv4 = s('text', { x: PX + 178, y: 206, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P);
    s('text', { x: PX + 20, y: 300, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lp = TK.particles(P, PX + 20, 306, 240, 130, 'gaz', '#E8F4FF');
    var last = performance.now(), prevTb = st.Tb, bubT = -9;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'ballon' ? '' : 'none'; B.style.display = st.mode === 'bulles' ? '' : 'none'; Cg.style.display = st.mode === 'compare' ? '' : 'none';
      var Tshow = st.mode === 'ballon' ? st.T : st.mode === 'bulles' ? st.Tb : 20 + st.dT, ratio = vRatio(Tshow);
      if (st.mode === 'ballon') {
        var hk = Math.max(0, (st.T - 20) / 70), ck = Math.max(0, (20 - st.T) / 30);
        bath.setAttribute('fill', TK.mixc('#5FA8E8', '#8FC3F0', ck)); bath.setAttribute('opacity', 0.6); plate.setAttribute('fill', TK.mixc('#5B6680', '#FF5A2E', hk)); plateG.setAttribute('opacity', hk * 0.8); ice.style.display = st.T < 8 ? '' : 'none';
        stA.forEach(function (sm, k) { var ph = ((T * 0.8 + k / 4) % 1); sm.style.display = st.T > 55 ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (160 + k * 90) + ' ' + (286 - ph * 50) + ')'); sm.setAttribute('opacity', (1 - ph) * Math.min(1, (st.T - 55) / 20)); });
        var ex = Math.max(0, (ratio - 0.95) / 0.32), rB = 16 + 40 * ex, ly = 196 - rB * 1.5;
        balloon.setAttribute('d', ex < 0.06 ? 'M278 196 q-8 -20 6 -34 q14 4 8 34 z' : 'M276 198 Q' + (290 - rB * 1.25) + ' ' + (ly + rB * 0.6) + ' ' + (290 - rB * 0.9) + ' ' + ly + ' A' + rB + ' ' + rB + ' 0 1 1 ' + (290 + rB * 0.9) + ' ' + ly + ' Q' + (290 + rB * 1.25) + ' ' + (ly + rB * 0.6) + ' 304 198 Z');
        attr(shine, { cx: 290 - rB * 0.35, cy: ly - rB * 0.45, rx: rB * 0.22, ry: rB * 0.14, opacity: ex > 0.1 ? 0.25 : 0 });
        AP.forEach(function (c, k) { var a = TK.rnd(k, 1) * 6.28, r = Math.sqrt(TK.rnd(k, 2)) * 54; attr(c, { cx: 290 + r * Math.cos(a) + Math.sin(T * (2 + 4 * hk) + k) * (2 + 5 * hk), cy: 320 + r * Math.sin(a) + Math.cos(T * (2 + 4 * hk) + k) * (2 + 5 * hk) }); });
        aMsg.textContent = ratio > 1.03 ? 'L’air chauffé se dilate : il gonfle le ballon' : ratio < 0.97 ? 'L’air refroidi se contracte : le ballon se dégonfle' : 'Ballon de verre rempli d’air, coiffé d’un ballon de baudruche';
        pv.textContent = 'VOLUME DE L’AIR'; pv1.textContent = (ratio >= 1 ? '+' : '') + fmt((ratio - 1) * 100, 1) + ' %'; pv2.textContent = 'par rapport à 20 °C'; pv3.textContent = ratio > 1.03 ? 'dilatation' : ratio < 0.97 ? 'contraction' : ''; pv4.textContent = '';
        res = { ratio: ratio, T: st.T };
      } else if (st.mode === 'bulles') {
        if (st.t == null) { if (st.Tb > prevTb + 0.05) { bubT = T; st.nb += (st.Tb - prevTb) * 1.2; } if (st.Tb > st.Tmax) st.Tmax = st.Tb; prevTb = st.Tb; }
        hands.style.display = st.Tb > 22 ? '' : 'none'; hands.setAttribute('opacity', Math.min(1, (st.Tb - 20) / 6));
        var bubOn = st.t != null ? st.bubOn : T - bubT < 1.5;
        BB.forEach(function (c, k) { var ph = (T * 1.2 + k / BB.length) % 1; c.style.display = bubOn ? '' : 'none'; attr(c, { cx: 420 + Math.sin(T * 5 + k) * 4, cy: 360 - ph * 110, opacity: 1 - ph * 0.6 }); });
        var hw = Math.max(0, Math.min(150, (st.Tmax - st.Tb) * 6)); attr(wcol, { y1: 360 - hw }); wcol.style.display = hw > 1 ? '' : 'none';
        bMsg.textContent = bubOn ? 'L’air chauffé se dilate : des bulles sortent du tube' : hw > 4 ? 'L’air refroidi se contracte : l’eau remonte dans le tube' : 'Réchauffe le ballon avec tes mains…';
        pv.textContent = 'AIR DANS LE BALLON'; pv1.textContent = Math.round(st.Tb) + ' °C'; pv2.textContent = bubOn ? 'bulles !' : hw > 4 ? 'l’eau remonte de ' + Math.round(hw / 6) + ' cm' : ''; pv3.textContent = 'mains chaudes : ~ 35 °C'; pv4.textContent = '';
        res = { bub: bubOn, nb: st.nb, hw: hw, T: st.Tb };
      } else {
        KIND.forEach(function (k, j) { var p = pct(k[0], st.dT), w = Math.max(4, Math.min(420, p * 420 / 30)); attr(CB[j].b, { width: w }); CB[j].t.textContent = (p < 1 ? fmt(p, 2) : fmt(p, 1)) + ' %'; attr(CB[j].t, { x: w > 90 ? 80 : 70 + w + 8 }); CB[j].t.setAttribute('fill', w > 90 ? '#0B1220' : '#EEF2F8'); });
        cMsg.textContent = 'Échauffement de ' + st.dT + ' °C : gaz > liquides > solides';
        pv.textContent = 'ÉCHAUFFEMENT'; pv1.textContent = '+' + st.dT + ' °C'; pv2.textContent = 'même volume de départ'; pv3.textContent = 'les gaz se dilatent'; pv4.textContent = 'beaucoup plus que les liquides';
        res = { dT: st.dT };
      }
      th.set(Tshow); lp.set(Math.max(0, Math.min(1, (Tshow + 10) / 100)), T, Math.max(0.4, Math.min(1.3, 0.6 + (ratio - 0.93) * 2)));
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Un ballon de baudruche' }, { t: 9, title: 'Dans l’eau chaude' }, { t: 20, title: 'Dans l’eau glacée' }, { t: 31, title: 'Les bulles' }, { t: 44, title: 'Gaz, liquides, solides' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un gaz chauffé <b>se dilate</b>', 'son volume augmente ; refroidi, il <b>se contracte</b>.', '#4FC3FF'],
      ['Les gaz se dilatent <b>beaucoup plus</b>', 'que les liquides, qui se dilatent plus que les solides.', '#FFC773'],
      ['Applications et précautions', 'montgolfière, pneus moins gonflés par forte chaleur, bouteilles de gaz loin du feu.', '#FF5A4E']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t;
        if (t < 31) { st.mode = 'ballon'; st.T = t < 9 ? 20 : t < 20 ? 20 + 65 * K.k(t, 9.5, 6) : 85 - 85 * K.k(t, 20.5, 7); }
        else if (t < 44) { st.mode = 'bulles'; st.Tb = t < 38 ? 20 + 15 * K.k(t, 32, 4) : 35 - 15 * K.k(t, 38.5, 4); st.Tmax = t < 38 ? st.Tb : 35; st.bubOn = t > 33 && t < 38; }
        else { st.mode = 'compare'; st.dT = 50; }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Le ballon de verre est rempli d’air') || tg.show(t, 11, 19.6, 290, 92, 'L’air chauffé se dilate : le ballon gonfle') || tg.show(t, 22, 30.6, 290, 92, 'Refroidi, l’air se contracte') ||
          tg.show(t, 33, 37.6, 290, 92, 'Des mains chaudes suffisent : des bulles !') || tg.show(t, 39, 43.6, 290, 92, 'L’air se contracte : l’eau remonte') || tg.show(t, 45, 55.6, 290, 92, 'Le gaz se dilate le plus');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un ballon de verre rempli d’air et coiffé d’un ballon de baudruche placé dans l’eau chaude puis glacée ; un ballon réchauffé par des mains fait sortir des bulles d’un tube plongé dans l’eau, puis l’eau remonte quand il refroidit ; enfin une comparaison de la dilatation d’un solide, d’un liquide et d’un gaz',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'Ce ballon de verre contient de l’air. Coiffons-le d’un ballon de baudruche dégonflé.', sub: 'Un ballon de verre rempli d’<b>air</b>, coiffé d’un ballon de baudruche.' },
      { t: 9, d: 10.6, say: 'Plongeons-le dans l’eau chaude : le ballon de baudruche se gonfle. Chauffé, l’air se dilate : son volume augmente.', sub: 'Chauffé, l’air <b>se dilate</b> : le ballon gonfle.' },
      { t: 20, d: 10.6, say: 'Dans l’eau glacée, le ballon se dégonfle : refroidi, l’air se contracte.', sub: 'Refroidi, l’air <b>se contracte</b>.' },
      { t: 31, d: 7, say: 'Même la chaleur des mains suffit : l’air chauffé se dilate et s’échappe en bulles par le tube.', sub: 'La chaleur des mains : des <b>bulles</b> sortent du tube.' },
      { t: 38.2, d: 5.6, say: 'Quand on lâche le ballon, l’air refroidit et se contracte : l’eau remonte dans le tube.', sub: 'L’air se contracte : l’eau <b>remonte</b>.' },
      { t: 44, d: 11.6, say: 'Pour un même échauffement, le fer augmente à peine de volume, l’alcool un peu plus… et l’air beaucoup plus. Les gaz se dilatent bien plus que les liquides et les solides.', sub: 'Gaz > liquides > solides.' },
      { t: 56, d: 4.4, say: 'À retenir : un gaz chauffé se dilate ; refroidi, il se contracte.', sub: 'Gaz chauffé : dilatation ; refroidi : contraction.' },
      { t: 60.6, d: 4.2, say: 'Les gaz se dilatent plus que les liquides et les solides.', sub: 'Les gaz se dilatent le <b>plus</b>.' },
      { t: 65, d: 5, say: 'Dans une bouteille fermée, c’est la pression qui monte : on garde les bouteilles de gaz et les aérosols loin de la chaleur.', sub: 'Récipient fermé : la <b>pression</b> monte. Loin de la chaleur !' }
    ],
    learn: [
      { t: 19, ch: 1, html: 'Chauffé, un gaz <b>se dilate</b> : son volume augmente.' },
      { t: 30, ch: 2, html: 'Refroidi, il <b>se contracte</b>.' },
      { t: 43, ch: 3, html: 'La chaleur des mains suffit à dilater l’air.' },
      { t: 55, ch: 4, html: '<b>Gaz > liquides > solides</b>.' }
    ],
    question: { q: 'Pour le même échauffement, qui se dilate le plus ?', o: ['un solide', 'un liquide', 'un gaz', 'ils se dilatent pareil'], a: 2, e: 'Les gaz se dilatent le plus.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Ballon', r: [40, 40, 500, 406] }, { n: 'Mesures', r: [560, 22, 280, 424] }],
    alt: 'Trois expériences de dilatation des gaz : ballon de verre coiffé d’un ballon de baudruche dans un bain chaud ou glacé, ballon réchauffé par les mains dont l’air sort en bulles par un tube plongé dans l’eau, et comparaison de la dilatation d’un solide, d’un liquide et d’un gaz',
    steps: [
      'Ballon : chauffe puis refroidis le bain et observe le ballon de baudruche.',
      'Bulles : augmente la température de l’air (tes mains), puis laisse-le refroidir.',
      'Comparaison : pour un même échauffement, compare solide, liquide et gaz.',
      'Relève le volume de l’air à plusieurs températures.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'ballon', options: [{ v: 'ballon', l: 'Ballon de baudruche' }, { v: 'bulles', l: 'Les bulles' }, { v: 'compare', l: 'Gaz, liquide, solide' }], onChange: function (v) { st.mode = v; vis(); } });
      var sT = c.slider({ label: 'Température du bain', min: -10, max: 90, step: 1, value: 20, unit: '°C', onInput: function (v) { st.T = v; } });
      var sB = c.slider({ label: 'Température de l’air du ballon', min: 10, max: 40, step: 0.5, value: 20, unit: '°C', dec: 1, onInput: function (v) { st.Tb = v; } });
      var bB = c.button({ label: 'Recommencer (tube vide)', sm: true, onClick: function () { st.Tmax = st.Tb; st.nb = 0; } });
      var sC = c.slider({ label: 'Échauffement', min: 10, max: 80, step: 5, value: 50, unit: '°C', onInput: function (v) { st.dT = v; } });
      function vis() { var m = st.mode; sT.hide(m !== 'ballon'); sB.hide(m !== 'bulles'); bB.style.display = m === 'bulles' ? '' : 'none'; sC.hide(m !== 'compare'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Mesure' }, { k: 'b', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'ballon') { ro.a.set('volume ' + (last.ratio >= 1 ? '+' : '') + fmt((last.ratio - 1) * 100, 1) + ' %'); ro.b.set(last.ratio > 1.03 ? 'ballon gonflé' : last.ratio < 0.97 ? 'ballon dégonflé' : 'ballon flasque'); } else if (st.mode === 'bulles') { ro.a.set(fmt(st.Tb, 1) + ' °C'); ro.b.set(last.bub ? 'bulles' : last.hw > 4 ? 'l’eau remonte' : '—'); } else { ro.a.set('+' + st.dT + ' °C'); ro.b.set('air : +' + fmt(pct('gaz', st.dT), 1) + ' %'); } });
      var M = api.measure; M.innerHTML = '<h3>Volume de l’air</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever (mode ballon)'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode !== 'ballon') { api.say('Passe en mode « Ballon de baudruche » pour relever.'); return; } rows.push({ T: st.T, v: (last.ratio - 1) * 100 }); rows.sort(function (p, q) { return p.T - q.T; }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Température</th><th>Variation de volume</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.T + ' °C</td><td>' + (r.v >= 0 ? '+' : '') + fmt(r.v, 1) + ' %</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun relevé.</div>';
        api.chart.innerHTML = '<h3>Variation de volume de l’air</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'température (°C)', ylabel: 'volume (%)', xmin: -10, xmax: 90, xstep: 20, ymin: -12, ymax: 25, ystep: 6, series: [{ color: '#4FC3FF', pts: rows.map(function (r) { return [r.T, r.v]; }) }] });
      }
      paint();
      api.onReset(function () { st.mode = 'ballon'; st.T = 20; st.Tb = 20; st.Tmax = 20; st.nb = 0; st.dT = 50; cM.set('ballon'); sT.set(20); sB.set(20); sC.set(50); vis(); rows = []; paint(); });
      api.say('Chauffe le bain et regarde le ballon de baudruche.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève le volume de l’air à au moins 3 températures.</p>';
        return '<p>Chauffé, un gaz <b>se dilate</b> : son volume augmente (le ballon de baudruche gonfle, des bulles sortent du tube). Refroidi, il <b>se contracte</b> (le ballon se dégonfle, l’eau remonte dans le tube).</p><p>À l’échelle des particules, elles s’agitent plus vite et occupent plus de place.</p><p>Pour un même échauffement, les <b>gaz se dilatent beaucoup plus</b> que les liquides, qui se dilatent plus que les solides.</p><p>Ces expériences concernent un gaz <b>qui peut changer de volume</b>. Dans un récipient rigide fermé (bouteille de gaz, aérosol), le volume ne peut pas augmenter : c’est la <b>pression</b> qui augmente quand on chauffe, d’où le risque d’explosion. Précautions : ne pas exposer une bouteille de gaz ou un aérosol à la chaleur ; vérifier la pression des pneus à froid.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Dilatation des gaz' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’air chaud',
    intro: 'Gonfle, fais des bulles, fais remonter l’eau… avec de la chaleur !',
    missions: [
      { title: 'Gonfle le ballon', text: 'Augmente le volume de l’air d’au moins <span style="color:#FF8A80">+15 %</span>.', lumi: 'Il faut de l’eau bien chaude.', hint: 'Au-delà de 64 °C.',
        build: function (api) { var lab = mini(api, { mode: 'ballon' }); api.c.slider({ label: 'Température du bain', min: -10, max: 90, step: 1, value: 20, unit: '°C', onInput: function (v) { lab.st.T = v; } }); return function () { var r = lab.res(); return r.ratio >= 1.15 ? { ok: true, msg: '+' + fmt((r.ratio - 1) * 100, 1) + ' % : le ballon est bien gonflé !' } : { ok: false, msg: 'Seulement ' + fmt((r.ratio - 1) * 100, 1) + ' %.' }; }; },
        e: 'Chauffé, l’air se dilate et gonfle le ballon.' },
      { type: 'qcm', title: 'Gaz chauffé', text: 'Quand on chauffe un gaz, son volume :', o: ['diminue', 'augmente', 'ne change pas', 'devient nul'], a: 1, hint: 'Le ballon gonfle…', e: 'Il se dilate.' },
      { title: 'Des bulles !', text: 'Réchauffe l’air du ballon pour faire sortir des <span style="color:#4FC3FF">bulles</span> du tube.', lumi: 'La chaleur de tes mains suffit.', hint: 'Augmente la température de l’air.',
        build: function (api) { var lab = mini(api, { mode: 'bulles' }); api.c.slider({ label: 'Température de l’air', min: 10, max: 40, step: 0.5, value: 20, unit: '°C', dec: 1, onInput: function (v) { lab.st.Tb = v; } }); return function () { var r = lab.res(); return r.nb > 5 ? { ok: true, msg: 'L’air dilaté s’échappe en bulles !' } : { ok: false, msg: 'Pas assez de bulles : chauffe davantage.' }; }; },
        e: 'L’air chauffé se dilate et sort du ballon en bulles.' },
      { type: 'qcm', title: 'Classement', text: 'Range du plus au moins dilatable :', o: ['solides > liquides > gaz', 'gaz > liquides > solides', 'liquides > gaz > solides', 'ils se dilatent pareil'], a: 1, hint: 'Pense au ballon de baudruche.', e: 'Gaz > liquides > solides.' },
      { title: 'L’eau remonte', text: 'Fais <b>remonter l’eau</b> d’au moins 4 cm dans le tube.', lumi: 'Chauffe d’abord, puis…', hint: 'Chauffe l’air à 35 °C puis laisse-le refroidir à 20 °C.',
        build: function (api) { var lab = mini(api, { mode: 'bulles' }); api.c.slider({ label: 'Température de l’air', min: 10, max: 40, step: 0.5, value: 20, unit: '°C', dec: 1, onInput: function (v) { lab.st.Tb = v; } }); return function () { var r = lab.res(); return r.hw >= 24 ? { ok: true, msg: 'L’air s’est contracté : l’eau remonte de ' + Math.round(r.hw / 6) + ' cm.' } : { ok: false, msg: r.hw > 0 ? 'L’eau remonte un peu : refroidis davantage.' : 'Chauffe d’abord l’air, puis refroidis-le.' }; }; },
        e: 'Refroidi, l’air se contracte : l’eau prend sa place dans le tube.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On chauffe un gaz dans le dispositif proposé. Que prévois-tu pour son volume ou sa pression, selon les contraintes du dispositif ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-dilatation-gaz', level: '5e', theme: 'Propriétés physiques de la matière', title: 'Dilatation des gaz', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Lorsqu’on chauffe un gaz <b>qui peut changer de volume</b> (ballon souple, piston, bulles qui s’échappent), son volume augmente : il <b>se dilate</b>. Lorsqu’on le refroidit, il <b>se contracte</b>.',
      'Expériences : un ballon de baudruche sur un ballon de verre gonfle dans l’eau chaude ; l’air chauffé par les mains s’échappe en bulles par un tube plongé dans l’eau.',
      'Pour un même échauffement, les <b>gaz se dilatent beaucoup plus</b> que les liquides, qui se dilatent plus que les solides.',
      'À l’échelle des particules : chauffées, elles s’agitent plus vite et occupent plus de place.',
      'Dans un récipient rigide et fermé (bouteille de gaz, aérosol), le gaz ne peut pas se dilater : c’est sa <b>pression</b> qui augmente quand on chauffe, ce qui peut faire éclater le récipient. On les éloigne donc de la chaleur ; on vérifie la pression des pneus à froid. Application : la montgolfière (air chaud).'
    ],
    quiz: [
      { q: 'Un gaz refroidi :', o: ['se dilate', 'se contracte', 'explose', 'devient plus chaud'], a: 1, e: 'Son volume diminue.' },
      { q: 'Le ballon de baudruche gonfle dans l’eau chaude car :', o: ['l’eau entre dedans', 'l’air se dilate', 'le verre fond', 'l’air disparaît'], a: 1, e: 'L’air chauffé se dilate.' },
      { q: 'Pourquoi ne faut-il pas chauffer un aérosol ?', o: ['il se vide', 'le gaz se dilate et peut le faire éclater', 'il devient froid', 'il change de couleur'], a: 1, e: 'Le gaz dilaté peut faire éclater le récipient.' },
      { q: 'Qui se dilate le moins ?', o: ['l’air', 'l’alcool', 'le fer', 'l’eau'], a: 2, e: 'Les solides se dilatent le moins.' },
      { q: 'Une montgolfière s’élève grâce à :', o: ['l’air froid', 'l’air chaud dilaté', 'l’eau', 'le vent seulement'], a: 1, e: 'L’air chaud, dilaté, est plus léger.' }
    ]
  });
})();

