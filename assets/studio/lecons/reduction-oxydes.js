/* 3e · Les réactions chimiques · Leçon : Réduction des oxydes */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var CPK = { Cu: ['#E39B5A', '#8A4A16', 16], O: ['#F0454B', '#9E1A1F', 13], C: ['#3A3A3A', '#0E0E0E', 15] };
  var M = [['Cu', -100, -26, 28, -28], ['O', -70, -26, 58, 6], ['Cu', -100, 32, 28, 36], ['O', -70, 32, 122, 6], ['C', -28, 4, 90, 6]];
  var GID = 0;
  function grads(G) { var d = s('defs', {}, G), o = {}; Object.keys(CPK).forEach(function (e) { var id = 'rd' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, d); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': CPK[e][0] }, gr); s('stop', { offset: 1, 'stop-color': CPK[e][1] }, gr); o[e] = 'url(#' + id + ')'; }); return o; }
  function glow(G, col) { var id = 'rg' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function ease(p) { p = Math.max(0, Math.min(1, p)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function mix(a, b, k) { k = Math.max(0, Math.min(1, k)); var A = a.match(/\w\w/g).map(function (h) { return parseInt(h, 16); }), B = b.match(/\w\w/g).map(function (h) { return parseInt(h, 16); }); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'cuivre', carb: true, p: 0, run: false, q: 0, fire: false, mp: null, roles: 0, t: null }, o || {});
    var GR = grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- CuO + C ---------- */
    var A = s('g', {}, G);
    var stand = s('g', {}, A); s('rect', { x: 70, y: 392, width: 120, height: 10, rx: 3, fill: '#5B6478' }, A); s('rect', { x: 78, y: 150, width: 8, height: 244, fill: '#7D89A3' }, A); s('rect', { x: 82, y: 196, width: 70, height: 6, fill: '#7D89A3' }, A);
    var tube = s('g', { transform: 'translate(150 200) rotate(14)' }, A); s('path', { d: 'M0 -14 H150 a14 14 0 0 1 0 28 H0', fill: '#9FD7FF', 'fill-opacity': 0.08, stroke: '#BFE6FF', 'stroke-width': 3 }, tube); var mixP = s('path', { d: 'M88 4 H150 a10 10 0 0 1 0 8 H88z' }, tube), dots = s('g', {}, tube), DT = []; for (var i = 0; i < 18; i++) DT.push(s('circle', { cx: 92 + rnd(i, 1) * 64, cy: 6 + rnd(i, 2) * 6, r: 1.6 }, dots)); s('rect', { x: -10, y: -10, width: 14, height: 20, rx: 3, fill: '#6B4E36' }, tube);
    var hose = s('path', { d: 'M143 200 C 110 190, 120 120, 200 110 S 380 110, 420 200 V330', fill: 'none', stroke: '#C9D2E3', 'stroke-width': 4 }, A);
    var bun = s('g', {}, A); s('rect', { x: 260, y: 382, width: 60, height: 12, rx: 4, fill: '#5B6478' }, bun); s('rect', { x: 282, y: 312, width: 16, height: 70, fill: '#9AA6BC' }, bun); var bFl = s('path', { d: 'M290 312 q-14 -30 0 -62 q14 32 0 62z', fill: '#5BA8FF', opacity: 0.85 }, bun);
    var lt = s('g', {}, A); s('path', { d: 'M396 250 V380 a24 24 0 0 0 48 0 V250', fill: '#9FD7FF', 'fill-opacity': 0.06, stroke: '#BFE6FF', 'stroke-width': 3 }, lt); var limeL = s('path', { d: 'M398 300 V380 a22 22 0 0 0 44 0 V300z' }, lt); s('text', { x: 420, y: 428, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: 'eau de chaux' }, lt);
    var BB = []; for (i = 0; i < 8; i++) BB.push(s('circle', { r: 2.5, fill: 'none', stroke: '#EEF2F8', 'stroke-width': 1.2 }, lt));
    var mixT = s('text', { x: 230, y: 268, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3' }, A);
    var aMsg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- ALUMINOTHERMIE ---------- */
    var B = s('g', {}, G);
    s('rect', { x: 140, y: 380, width: 300, height: 22, rx: 4, fill: '#5B4636' }, B); s('text', { x: 290, y: 396, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#E6D3B8', text: 'sable' }, B);
    var rail = s('g', {}, B); s('path', { d: 'M150 372 h110 v-10 h-30 v-30 h40 v-12 h-110 v12 h40 v30 h-50z', fill: '#7D89A3' }, rail); s('path', { d: 'M430 372 h-110 v-10 h30 v-30 h-40 v-12 h110 v12 h-40 v30 h50z', fill: '#7D89A3' }, rail);
    var weld = s('rect', { x: 260, y: 320, width: 60, height: 52, fill: '#FF7A2E' }, B);
    s('path', { d: 'M240 150 L256 300 H324 L340 150z', fill: '#B0B8C8', stroke: '#6B7280', 'stroke-width': 3 }, B); var charge = s('path', { d: 'M246 200 L254 292 H326 L334 200z' }, B), ign = s('line', { x1: 290, y1: 200, x2: 290, y2: 160, stroke: '#EEF2F8', 'stroke-width': 3 }, B), ignF = s('circle', { cx: 290, cy: 160, fill: glow(G, '#FFFFFF') }, B);
    var blaze = s('circle', { cx: 290, cy: 200, fill: glow(G, '#FFB547') }, B), SPK = []; for (i = 0; i < 30; i++) SPK.push(s('line', { stroke: '#FFE29A', 'stroke-width': 2, 'stroke-linecap': 'round' }, B));
    var pour = s('path', { stroke: '#FF7A2E', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, B);
    s('text', { x: 360, y: 180, 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: 'creuset' }, B); var chT = s('text', { x: 360, y: 198, 'font-size': 11, fill: '#A9B4C7' }, B);
    var bMsg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 140, y: 46, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var MV = s('g', {}, P), MA = M.map(function (a) { var g = s('g', {}, MV); s('circle', { r: CPK[a[0]][2], fill: GR[a[0]], stroke: '#0006', 'stroke-width': 1 }, g); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': a[0].length > 1 ? 9.5 : 11, 'font-weight': 900, fill: '#FFF', text: a[0] }, g); return g; });
    var oArr = [0, 1].map(function () { return s('path', { fill: 'none', stroke: '#FF8A80', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, MV); });
    var eqT = s('text', { x: PX + 140, y: 206, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#FFC773' }, P);
    var brk = s('g', {}, P), redB = s('path', { fill: 'none', stroke: '#80C8FF', 'stroke-width': 2 }, brk), oxB = s('path', { fill: 'none', stroke: '#FF8A80', 'stroke-width': 2 }, brk), redT = s('text', { 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#80C8FF', text: 'réduction' }, brk), oxT = s('text', { 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#FF8A80', text: 'oxydation' }, brk);
    var roles = s('g', {}, P), rl = [0, 1].map(function (k) { var y = 252 + k * 46, g = s('g', {}, roles); s('rect', { x: PX + 14, y: y, width: 252, height: 38, rx: 10, fill: '#141C30', stroke: k ? '#FF8A80' : '#80C8FF', 'stroke-width': 1.5 }, g); var a = s('text', { x: PX + 26, y: y + 16, 'font-size': 12, 'font-weight': 900, fill: k ? '#FF8A80' : '#80C8FF' }, g), b = s('text', { x: PX + 26, y: y + 31, 'font-size': 11.5, fill: '#C9D2E3' }, g); return { a: a, b: b }; });
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 372 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'cuivre' ? '' : 'none'; B.style.display = st.mode === 'alumino' ? '' : 'none';
      if (st.mode === 'cuivre') {
        if (st.t == null && st.run) { st.p = Math.min(1, st.p + dt / 5); if (st.p >= 1) st.run = false; }
        var p = st.p, react = st.carb ? Math.max(0, (p - 0.2) / 0.7) : 0;
        mixP.setAttribute('fill', mix('1E1A18', 'C8642E', react)); DT.forEach(function (d) { d.style.display = st.carb ? '' : 'none'; d.setAttribute('fill', react > 0.6 ? '#D9804A' : '#555'); });
        bFl.style.display = st.run || (p > 0 && p < 1) ? '' : 'none';
        var milk = Math.max(0, Math.min(1, (react - 0.3) / 0.5)); limeL.setAttribute('fill', mix('DDEFFF', 'F4F6FA', milk)); limeL.setAttribute('opacity', 0.4 + 0.5 * milk);
        BB.forEach(function (b, k) { var on = st.carb && p > 0.25 && p < 1, ph = (T * 1.4 + k / 8) % 1; b.style.display = on ? '' : 'none'; attr(b, { cx: 414 + rnd(k, 3) * 12, cy: 376 - ph * 74 }); });
        mixT.textContent = st.carb ? (react > 0.6 ? 'du cuivre rouge apparaît' : 'oxyde de cuivre (noir) + carbone') : 'oxyde de cuivre seul';
        aMsg.textContent = p <= 0 ? 'On chauffe le mélange d’oxyde de cuivre et de carbone' : !st.carb ? 'Sans carbone, l’oxyde de cuivre reste noir : pas de réaction' : react < 0.6 ? 'Des bulles de gaz passent dans l’eau de chaux…' : 'Cuivre rouge + eau de chaux troublée (dioxyde de carbone)';
        pT.textContent = 'RÉDUCTION DE L’OXYDE DE CUIVRE'; var mp = st.mp != null ? st.mp : react; var e = ease(mp);
        MA.forEach(function (g, k) { var a = M[k]; g.setAttribute('transform', 'translate(' + (PX + 140 + a[1] + (a[3] - a[1]) * e).toFixed(1) + ' ' + (102 + a[2] + (a[4] - a[2]) * e).toFixed(1) + ')'); g.style.display = ''; });
        oArr.forEach(function (pa, k) { pa.setAttribute('d', mp < 0.05 && st.roles ? 'M' + (PX + 70) + ' ' + (102 + (k ? 32 : -26)) + ' Q' + (PX + 100) + ' ' + (102 + (k ? 20 : -10)) + ' ' + (PX + 112) + ' 104' : ''); });
        eqT.textContent = '2 CuO + C → 2 Cu + CO₂';
        var ro = st.roles; brk.style.display = roles.style.display = ro ? '' : 'none';
        attr(redB, { d: 'M' + (PX + 40) + ' 214 v8 H' + (PX + 166) + ' v-8' }); attr(redT, { x: PX + 103, y: 238 }); attr(oxB, { d: 'M' + (PX + 100) + ' 188 v-8 H' + (PX + 254) + ' v8' }); attr(oxT, { x: PX + 177, y: 175 });
        rl[0].a.textContent = 'CuO perd son oxygène : il est réduit'; rl[0].b.textContent = 'CuO est l’oxydant'; rl[1].a.textContent = 'C gagne de l’oxygène : il est oxydé'; rl[1].b.textContent = 'C est le réducteur';
        pset(['Réduction et oxydation ont lieu', 'en même temps :', 'c’est une oxydoréduction.']);
        res = { p: p, carb: st.carb, done: st.carb && p >= 1 };
      } else {
        if (st.t == null) { if (st.fire) st.q = Math.min(1, st.q + dt / 4); }
        var q = st.q, burn = q > 0.15 && q < 0.75 ? Math.sin((q - 0.15) / 0.6 * Math.PI) : 0;
        charge.setAttribute('fill', mix('9B3B22', '3A3A42', Math.max(0, (q - 0.2) / 0.5))); ign.style.display = q < 0.2 ? '' : 'none'; attr(ignF, { r: st.fire && q < 0.2 ? 18 + 6 * Math.sin(T * 30) : 0 });
        attr(blaze, { r: 140 * burn, opacity: burn }); SPK.forEach(function (l, k) { var ph = (T * 2 + rnd(k, 1)) % 1, a = -Math.PI * rnd(k, 2), r1 = 20 + ph * 120; l.style.display = burn > 0.1 ? '' : 'none'; attr(l, { x1: 290 + Math.cos(a) * r1, y1: 190 + Math.sin(a) * r1, x2: 290 + Math.cos(a) * (r1 + 12), y2: 190 + Math.sin(a) * (r1 + 12), opacity: 1 - ph }); });
        var pr = Math.max(0, Math.min(1, (q - 0.55) / 0.25)); pour.setAttribute('d', pr > 0 && q < 0.95 ? 'M290 300 V' + (300 + 22 * pr) : ''); weld.setAttribute('fill', q >= 0.8 ? mix('FF7A2E', '9AA6BC', (q - 0.8) / 0.2) : '#0F1729'); weld.setAttribute('opacity', q >= 0.55 ? 1 : 0);
        chT.textContent = q < 0.2 ? 'Fe₂O₃ + aluminium' : 'fer liquide (≈ 2 500 °C)';
        bMsg.textContent = q <= 0 ? 'Oxyde de fer + poudre d’aluminium : on allume le ruban de magnésium' : q < 0.55 ? 'Réaction très vive : chaleur et lumière intenses' : 'Le fer liquide coule et soude les deux rails';
        pT.textContent = 'ALUMINOTHERMIE'; MA.forEach(function (g) { g.style.display = 'none'; }); oArr.forEach(function (pa) { pa.setAttribute('d', ''); });
        eqT.textContent = 'Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃'; brk.style.display = 'none'; roles.style.display = '';
        rl[0].a.textContent = 'Fe₂O₃ perd son oxygène : réduit'; rl[0].b.textContent = 'Fe₂O₃ est l’oxydant'; rl[1].a.textContent = 'Al gagne de l’oxygène : oxydé'; rl[1].b.textContent = 'Al est le réducteur';
        pset(['On l’utilise pour souder les rails', '(chemin de fer Abidjan–Ouagadougou).', 'Au haut fourneau, c’est CO qui réduit.']);
        res = { q: q, done: q >= 1 };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Retrouver le métal' }, { t: 8, title: 'Oxyde de cuivre + carbone' }, { t: 24, title: 'Réducteur et oxydant' }, { t: 36, title: 'L’aluminothermie' }, { t: 48, title: 'L’oxydoréduction' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Réduire un oxyde : lui <b>enlever son oxygène</b>', '2 CuO + C → 2 Cu + CO₂ ; Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃.', '#80C8FF'],
      ['Le <b>réducteur</b> capte l’oxygène', 'carbone, aluminium : ils sont oxydés.', '#FF8A80'],
      ['Réduction + oxydation = <b>oxydoréduction</b>', 'les deux ont lieu en même temps.', '#FFC773']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.carb = true; st.roles = 0; st.mp = null;
        if (t < 8) { st.mode = 'cuivre'; st.p = 0; st.mp = 0; }
        else if (t < 24) { st.mode = 'cuivre'; st.p = Math.max(0, Math.min(1, (t - 9) / 13)); }
        else if (t < 36) { st.mode = 'cuivre'; st.p = 1; st.roles = 1; st.mp = t < 27 ? 0 : K.k(t, 27, 4); }
        else if (t < 48) { st.mode = 'alumino'; st.q = Math.max(0, Math.min(1, (t - 37) / 10)); }
        else { st.mode = 'cuivre'; st.p = 1; st.roles = 1; st.mp = 1; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Comment retrouver le cuivre ?') || tg.show(t, 9.5, 23.6, 290, 92, st.p > 0.6 ? 'Cuivre rouge + CO₂' : 'On chauffe CuO + C…') || tg.show(t, 25, 35.6, 290, 92, 'Le carbone capte l’oxygène') ||
          tg.show(t, 37.5, 47.6, 290, 92, 'Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃') || tg.show(t, 49, 56.6, 290, 92, 'Réduction et oxydation ensemble');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un tube contenant un mélange noir d’oxyde de cuivre et de carbone, chauffé au bec Bunsen, relié à un tube d’eau de chaux ; le mélange devient rouge cuivre et l’eau de chaux se trouble ; à droite, les atomes montrent le carbone qui capte l’oxygène de l’oxyde de cuivre ; puis l’aluminothermie, réaction très vive entre l’oxyde de fer et l’aluminium, dont le fer liquide soude deux rails',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Dans la nature, les métaux se trouvent souvent sous forme d’oxydes, dans les minerais. Comment retrouver le métal ?', sub: 'Comment obtenir le <b>métal</b> ?' },
      { t: 8, d: 15.6, say: 'Chauffons un mélange d’oxyde de cuivre noir et de carbone. Un gaz se dégage et trouble l’eau de chaux : c’est du dioxyde de carbone. Dans le tube, un solide rouge apparaît : du cuivre.', sub: 'Il se forme du <b>cuivre</b> et du <b>dioxyde de carbone</b>.' },
      { t: 24, d: 11.6, say: 'Le carbone a pris l’oxygène de l’oxyde de cuivre. L’oxyde de cuivre a été réduit : c’est l’oxydant. Le carbone a été oxydé : c’est le réducteur.', sub: '2 CuO + C → 2 Cu + CO₂ : C est le <b>réducteur</b>.' },
      { t: 36, d: 11.6, say: 'L’aluminium réduit l’oxyde de fer : c’est l’aluminothermie. La réaction est si vive que le fer formé est liquide. On s’en sert pour souder les rails de chemin de fer.', sub: '<b>Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃</b>' },
      { t: 48, d: 8.6, say: 'Dans ces réactions, une réduction et une oxydation se produisent en même temps : on parle d’oxydoréduction.', sub: 'Une <b>oxydoréduction</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : réduire un oxyde, c’est lui enlever son oxygène.', sub: 'Réduire = enlever l’oxygène.' },
      { t: 61.8, d: 4.2, say: 'Le réducteur, comme le carbone ou l’aluminium, capte cet oxygène.', sub: 'Le réducteur capte l’oxygène.' },
      { t: 66.2, d: 4.8, say: 'Réduction et oxydation forment une oxydoréduction.', sub: 'Oxydoréduction.' }
    ],
    learn: [
      { t: 23, ch: 1, html: 'CuO + C chauffés : <b>cuivre rouge</b> et CO₂ (eau de chaux troublée).' },
      { t: 35, ch: 2, html: 'L’oxyde est <b>réduit</b> ; le carbone, <b>réducteur</b>, est oxydé.' },
      { t: 47, ch: 3, html: 'Aluminothermie : <b>Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃</b>.' },
      { t: 56, ch: 4, html: 'Réduction + oxydation simultanées : <b>oxydoréduction</b>.' }
    ],
    question: { q: 'Dans 2 CuO + C → 2 Cu + CO₂, le réducteur est :', o: ['CuO', 'C', 'Cu', 'CO₂'], a: 1, e: 'Le carbone capte l’oxygène.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : un tube contenant de l’oxyde de cuivre avec ou sans carbone, chauffé au bec Bunsen et relié à de l’eau de chaux ; puis l’aluminothermie, réaction entre l’oxyde de fer et l’aluminium allumée par un ruban de magnésium, dont le fer liquide soude deux rails ; à droite, l’équation, les atomes qui se réarrangent et les rôles d’oxydant et de réducteur',
    steps: [
      'Chauffe l’oxyde de cuivre seul : que se passe-t-il ?',
      'Ajoute du carbone et chauffe à nouveau.',
      'Identifie l’oxydant et le réducteur.',
      'Aluminothermie : allume le mélange.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { roles: 1 }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'cuivre', options: [{ v: 'cuivre', l: 'CuO + carbone' }, { v: 'alumino', l: 'Aluminothermie' }], onChange: function (v) { st.mode = v; vis(); } });
      var tC = c.toggle({ label: 'Carbone ajouté', value: true, onChange: function (v) { st.carb = v; st.p = 0; st.run = false; } });
      var bH = c.button({ label: 'Chauffer', primary: true, onClick: function () { st.p = 0; st.run = true; } });
      var bF = c.button({ label: 'Allumer le ruban de magnésium', primary: true, onClick: function () { st.q = 0; st.fire = true; api.sound('pop'); } });
      var bN = c.button({ label: 'Recommencer', sm: true, onClick: function () { st.q = 0; st.fire = false; st.p = 0; st.run = false; } });
      function vis() { var cu = st.mode === 'cuivre'; tC.hide(!cu); bH.style.display = cu ? '' : 'none'; bF.style.display = cu ? 'none' : ''; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Réaction' }, { k: 'b', label: 'Observation' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'cuivre') { ro.a.set(st.carb ? '2 CuO + C' : 'CuO seul'); ro.b.set(last.done ? 'cuivre + CO₂' : st.p > 0 && !st.carb ? 'rien' : '—'); } else { ro.a.set('Fe₂O₃ + 2 Al'); ro.b.set(last.done ? 'fer soudé' : st.q > 0 ? 'très vive' : '—'); } });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { rows.push(st.mode === 'cuivre' ? { e: st.carb ? 'CuO + C chauffés' : 'CuO seul chauffé', o: st.carb ? (last.done ? 'cuivre rouge, eau de chaux troublée' : 'en cours') : 'reste noir : pas de réaction' } : { e: 'Fe₂O₃ + Al', o: last.done ? 'fer liquide, rails soudés' : st.q > 0 ? 'réaction très vive' : 'pas encore allumé' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Oxydant et réducteur</h3><table class="mt"><thead><tr><th>Réaction</th><th>Oxydant (réduit)</th><th>Réducteur (oxydé)</th></tr></thead><tbody><tr><td>2 CuO + C → 2 Cu + CO₂</td><td>CuO</td><td>C</td></tr><tr><td>Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃</td><td>Fe₂O₃</td><td>Al</td></tr><tr><td>Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂ (haut fourneau)</td><td>Fe₂O₃</td><td>CO</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'cuivre', carb: true, p: 0, run: false, q: 0, fire: false }); cM.set('cuivre'); tC.set(true); vis(); rows = []; paint(); });
      api.say('Chauffe le mélange d’oxyde de cuivre et de carbone.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p><b>Réduire</b> un oxyde, c’est lui <b>enlever son oxygène</b>. Le corps qui capte l’oxygène est le <b>réducteur</b> : il est <b>oxydé</b>. L’oxyde qui cède son oxygène est l’<b>oxydant</b> : il est <b>réduit</b>.</p><p>Oxyde de cuivre et carbone : <b>2 CuO + C → 2 Cu + CO₂</b> (cuivre rouge, eau de chaux troublée). Sans carbone, rien ne se passe. Aluminothermie : <b>Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃</b>, réaction très exothermique utilisée pour souder les rails.</p><p>La réduction et l’oxydation se produisent simultanément : c’est une <b>oxydoréduction</b>. La métallurgie (haut fourneau) obtient les métaux par réduction de leurs minerais.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Réduction des oxydes' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du métallurgiste',
    intro: 'Arrache l’oxygène aux oxydes et retrouve les métaux !',
    missions: [
      { title: 'Le cuivre rouge', text: 'Obtiens du <span style="color:#E39B5A">cuivre</span> à partir de l’oxyde de cuivre.', lumi: 'Il faut un réducteur.', hint: 'Ajoute le carbone et chauffe.',
        build: function (api) { var lab = mini(api, { carb: false, roles: 1 }); api.c.toggle({ label: 'Carbone ajouté', value: false, onChange: function (v) { lab.st.carb = v; lab.st.p = 0; lab.st.run = false; } }); api.c.button({ label: 'Chauffer', sm: true, onClick: function () { lab.st.p = 0; lab.st.run = true; } }); return function () { var r = lab.res(); return r.done ? { ok: true, msg: '2 CuO + C → 2 Cu + CO₂.' } : { ok: false, msg: r.p > 0 && !r.carb ? 'Sans réducteur, rien ne se passe.' : 'Pas encore de cuivre.' }; }; },
        e: 'Le carbone réduit l’oxyde de cuivre.' },
      { type: 'qcm', title: 'Le rôle', text: 'Dans la réduction de CuO par le carbone, l’oxyde de cuivre est :', o: ['le réducteur, il est oxydé', 'l’oxydant, il est réduit', 'un produit', 'un catalyseur'], a: 1, hint: 'Il perd son oxygène.', e: 'CuO cède son oxygène : il est réduit.' },
      { title: 'Souder les rails', text: 'Réalise l’<b>aluminothermie</b> jusqu’à souder les rails.', lumi: 'Il faut l’allumer.', hint: 'Allume le ruban de magnésium.',
        build: function (api) { var lab = mini(api, { mode: 'alumino' }); api.c.button({ label: 'Allumer le ruban de magnésium', sm: true, onClick: function () { lab.st.q = 0; lab.st.fire = true; } }); return function () { var r = lab.res(); return r.done ? { ok: true, msg: 'Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃ : rails soudés.' } : { ok: false, msg: r.q > 0 ? 'Attends la fin…' : 'Allume le mélange.' }; }; },
        e: 'L’aluminium réduit l’oxyde de fer.' },
      { type: 'qcm', title: 'Équilibrer', text: '2 CuO + C → 2 Cu + … ?', o: ['CO', 'CO₂', 'O₂', 'Cu₂O'], a: 1, hint: '2 atomes d’oxygène à gauche.', e: 'Le carbone capte les 2 O : CO₂.' },
      { type: 'qcm', title: 'Simultané', text: 'Une réaction où une réduction et une oxydation ont lieu en même temps s’appelle :', o: ['une combustion', 'une électrolyse', 'une oxydoréduction', 'une dissolution'], a: 2, hint: 'Les deux mots réunis…', e: 'Une oxydoréduction.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Dans le laboratoire virtuel, on cherche à obtenir un métal à partir de son oxyde. Quels réactifs et quels indices de transformation faut-il examiner ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-reduction-oxydes', level: '3e', theme: 'Les réactions chimiques', title: 'Réduction des oxydes', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      '<b>Réduire</b> un oxyde, c’est lui <b>enlever son oxygène</b>.',
      'Réduction de l’oxyde de cuivre par le carbone : <b>2 CuO + C → 2 Cu + CO₂</b> (il se forme du cuivre rouge ; le CO₂ trouble l’eau de chaux).',
      'Aluminothermie : <b>Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃</b> (réaction très vive, utilisée pour souder les rails).',
      'Le corps qui capte l’oxygène est le <b>réducteur</b> (il est oxydé) ; l’oxyde qui le cède est l’<b>oxydant</b> (il est réduit).',
      'Une réduction s’accompagne toujours d’une oxydation : c’est une <b>oxydoréduction</b>. La métallurgie obtient les métaux par réduction de leurs minerais.'
    ],
    quiz: [
      { q: 'Réduire un oxyde, c’est :', o: ['lui ajouter de l’oxygène', 'lui enlever son oxygène', 'le dissoudre', 'le refroidir'], a: 1, e: 'Réduire un oxyde, c’est lui enlever son oxygène. L’autre réactif capte cet oxygène : il est oxydé, c’est le réducteur.' },
      { q: 'Lors du chauffage de CuO avec du carbone, le gaz formé :', o: ['rallume une bûchette', 'trouble l’eau de chaux', 'aboie à la flamme', 'est du dioxygène'], a: 1, e: 'C’est du dioxyde de carbone.' },
      { q: 'Dans Fe₂O₃ + 2 Al → 2 Fe + Al₂O₃, le réducteur est :', o: ['Fe₂O₃', 'Al', 'Fe', 'Al₂O₃'], a: 1, e: 'L’aluminium capte l’oxygène.' },
      { q: 'Le réducteur, au cours de la réaction :', o: ['est réduit', 'est oxydé', 'ne change pas', 'disparaît sans réagir'], a: 1, e: 'Il gagne de l’oxygène : il est oxydé.' },
      { q: 'L’aluminothermie sert à :', o: ['fabriquer de l’eau', 'souder des rails', 'produire du dioxygène', 'refroidir les métaux'], a: 1, e: 'Le fer liquide soude les rails.' }
    ]
  });
})();

