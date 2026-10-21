/* 3e · Les réactions chimiques · Leçon : Électrolyse et synthèse de l’eau */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var CPK = { H: ['#FFFFFF', '#B9C2CF', 10], O: ['#F0454B', '#9E1A1F', 15] };
  var GID = 0;
  function grads(G) { var d = s('defs', {}, G), o = {}; Object.keys(CPK).forEach(function (e) { var id = 'el' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, d); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': e === 'H' ? 1 : 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': CPK[e][0] }, gr); s('stop', { offset: 1, 'stop-color': CPK[e][1] }, gr); o[e] = 'url(#' + id + ')'; }); return o; }
  function glow(G, col) { var id = 'eg' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.95 }, gr); s('stop', { offset: 0.5, 'stop-color': col, 'stop-opacity': 0.3 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function ease(p) { p = Math.max(0, Math.min(1, p)); return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  /* atomes : 2 H₂O  ⇄  2 H₂ + O₂ */
  var MOL_A = [['O', -62, -34], ['H', -84, -18], ['H', -40, -18], ['O', -62, 30], ['H', -84, 46], ['H', -40, 46]];
  var MOL_B = [['O', 44, 52], ['H', 50, -52], ['H', 74, -52], ['O', 76, 52], ['H', 50, -6], ['H', 74, -6]];
  var VPX = 10; /* 10 px par mL */

  function Lab(G, o) {
    var st = Object.assign({ mode: 'electrolyse', soude: true, on: false, v: 0, test: null, tp: 0, sp: 0, sparking: false, cu: 0, cuing: false, mp: null, t: null }, o || {});
    var GR = grads(G);
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- ÉLECTROLYSEUR ---------- */
    var A = s('g', {}, G), T1 = 220, T2 = 360, TT = 112, TB = 330;
    s('path', { d: 'M150 236 V384 q0 8 8 8 H422 q8 0 8 -8 V236', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, A);
    var liq = s('rect', { x: 152, y: 250, width: 276, height: 140, fill: '#4FA8FF', opacity: 0.35 }, A);
    var tubes = [T1, T2].map(function (x, k) { var g = s('g', {}, A), gas = s('rect', { x: x - 19, y: TT + 4, width: 38, fill: k ? '#FFD6D8' : '#EEF2F8', opacity: 0.18 }, g), wat = s('rect', { x: x - 19, width: 38, fill: '#4FA8FF', opacity: 0.45 }, g); s('path', { d: 'M' + (x - 21) + ' ' + TB + ' V' + (TT + 20) + ' a21 21 0 0 1 42 0 V' + TB, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, g); for (var m = 0; m <= 20; m += 2) { var yy = TT + 10 + m * VPX; s('line', { x1: x + 21, x2: x + 21 + (m % 10 ? 5 : 10), y1: yy, y2: yy, stroke: '#A9B4C7', 'stroke-width': 1 }, g); if (m % 10 === 0) s('text', { x: x + 34, y: yy + 4, 'font-size': 9.5, fill: '#A9B4C7', text: m }, g); } s('rect', { x: x - 4, y: 334, width: 8, height: 56, fill: '#2A2F3A' }, g); var vt = s('text', { x: x, y: TT - 10, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: k ? '#FF8A80' : '#EEF2F8' }, g); return { gas: gas, wat: wat, vt: vt, g: g }; });
    s('text', { x: T1 - 28, y: 262, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 900, fill: '#9FD7FF', text: 'cathode (−)' }, A); s('text', { x: T2 + 50, y: 262, 'text-anchor': 'start', 'font-size': 11, 'font-weight': 900, fill: '#FF8A80', text: 'anode (+)' }, A);
    s('path', { d: 'M' + T1 + ' 392 V406 H268 M' + T2 + ' 392 V406 H312', stroke: '#C9D2E3', 'stroke-width': 2.5, fill: 'none' }, A); s('line', { x1: 274, x2: 274, y1: 396, y2: 416, stroke: '#EEF2F8', 'stroke-width': 3 }, A); s('line', { x1: 290, x2: 290, y1: 400, y2: 412, stroke: '#EEF2F8', 'stroke-width': 6 }, A); s('line', { x1: 268, x2: 274, y1: 406, y2: 406, stroke: '#C9D2E3', 'stroke-width': 2.5 }, A); s('line', { x1: 290, x2: 312, y1: 406, y2: 406, stroke: '#C9D2E3', 'stroke-width': 2.5 }, A);
    var lamp = s('circle', { cx: 330, cy: 406, r: 5 }, A);
    var BUB = []; for (var i = 0; i < 28; i++) BUB.push(s('circle', { r: 2 + rnd(i, 1) * 2.4, fill: 'none', stroke: '#EEF2F8', 'stroke-width': 1.2 }, A));
    function box(x) { var g = s('g', {}, A); s('rect', { x: x, y: 96, width: 104, height: 128, rx: 12, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, g); s('path', { d: 'M' + (x + 38) + ' 104 v60 a14 14 0 0 0 28 0 v-60', fill: '#EEF2F8', 'fill-opacity': 0.12, stroke: '#BFE6FF', 'stroke-width': 2, transform: 'rotate(180 ' + (x + 52) + ' 150)' }, g); return g; }
    var bxH = box(52), bxO = box(428);
    var mat = s('g', {}, bxH); s('line', { x1: 0, y1: 0, x2: 30, y2: 26, stroke: '#C8A46A', 'stroke-width': 4 }, mat); var mFl = s('path', { d: 'M-6 0 q-4 -12 6 -22 q10 10 6 22z', fill: '#FFB547' }, mat); mat.setAttribute('transform', 'translate(94 180)');
    var pop = s('circle', { cx: 104, cy: 140, fill: glow(G, '#7FB8FF') }, bxH), popT = s('text', { x: 104, y: 216, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773' }, bxH);
    var buch = s('g', {}, bxO); s('line', { x1: 0, y1: 0, x2: 0, y2: 60, stroke: '#C8A46A', 'stroke-width': 4 }, buch); var bTip = s('circle', { r: 4, fill: '#FF7A2E' }, buch), bFl = s('path', { d: 'M-6 0 q-4 -14 6 -24 q10 10 6 24z', fill: '#FFB547' }, buch); buch.setAttribute('transform', 'translate(480 176)');
    var oT = s('text', { x: 480, y: 216, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#FFC773' }, bxO);
    var aMsg = s('text', { x: 290, y: 450 - 8, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- SYNTHÈSE ---------- */
    var B = s('g', {}, G), EX = 250;
    s('path', { d: 'M150 300 V384 q0 8 8 8 H352 q8 0 8 -8 V300', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, B); s('rect', { x: 152, y: 310, width: 206, height: 80, fill: '#4FA8FF', opacity: 0.35 }, B);
    var eGas = s('rect', { x: EX - 19, y: 104, width: 38, fill: '#F4F6FA', opacity: 0.2 }, B), eWat = s('rect', { x: EX - 19, width: 38, fill: '#4FA8FF', opacity: 0.45 }, B);
    s('path', { d: 'M' + (EX - 22) + ' 370 V116 a22 22 0 0 1 44 0 V370', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 5 }, B);
    s('path', { d: 'M' + (EX - 34) + ' 120 h26 M' + (EX + 34) + ' 120 h-26', stroke: '#9AA6BC', 'stroke-width': 3 }, B); var spark = s('path', { d: 'M' + (EX - 8) + ' 120 l5 -6 l3 10 l4 -8 l4 4', stroke: '#FFE29A', 'stroke-width': 2.5, fill: 'none' }, B), flash = s('circle', { cx: EX, cy: 200, fill: glow(G, '#FFD27A') }, B);
    var drops = s('g', {}, B), DR = []; for (i = 0; i < 14; i++) DR.push(s('circle', { cx: EX - 14 + rnd(i, 2) * 28, cy: 112 + rnd(i, 3) * 160, r: 1.5 + rnd(i, 4) * 2, fill: '#BFE6FF' }, drops));
    var mixL = s('text', { x: EX + 34, y: 180, 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3' }, B), mixL2 = s('text', { x: EX + 34, y: 198, 'font-size': 12, fill: '#A9B4C7' }, B);
    s('text', { x: EX, y: 92, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'eudiomètre' }, B);
    var cap = s('g', {}, B); s('path', { d: 'M410 360 q50 30 100 0', fill: '#C9D2E3', stroke: '#9AA6BC', 'stroke-width': 2 }, cap); var pow = s('ellipse', { cx: 460, cy: 362, rx: 40, ry: 7 }, cap); s('text', { x: 460, y: 398, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'sulfate de cuivre anhydre' }, cap);
    var pip = s('g', {}, B); s('path', { d: 'M454 250 v60 l6 12 l6 -12 v-60z', fill: '#EEF2F8', 'fill-opacity': 0.25, stroke: '#BFE6FF', 'stroke-width': 2 }, pip); var dropC = s('circle', { cx: 460, r: 3.5, fill: '#BFE6FF' }, pip);
    var bMsg = s('text', { x: 290, y: 430, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 46, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES MOLÉCULES' }, P);
    var MV = s('g', {}, P), ats = MOL_A.map(function (a) { var g = s('g', {}, MV); s('circle', { r: CPK[a[0]][2], fill: GR[a[0]], stroke: '#0006', 'stroke-width': 1 }, g); s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: a[0] === 'H' ? '#1A1F28' : '#FFF', text: a[0] }, g); return g; });
    var arr = s('text', { x: PX + 140, y: 136, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#7D89A3' }, P);
    var eqT = s('text', { x: PX + 140, y: 222, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#FFC773' }, P), eqW = s('text', { x: PX + 140, y: 244, 'text-anchor': 'middle', 'font-size': 11.5, fill: '#A9B4C7' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 262, y2: 262, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5].map(function (k) { return s('text', { x: PX + 140, y: 290 + k * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', a[k] && a[k].charAt(0) === '•' ? 800 : 400); }); }
    function mol(p, rev) { var cx = PX + 140, cy = 128, e = ease(p); ats.forEach(function (g, i) { var A0 = rev ? MOL_B[i] : MOL_A[i], B0 = rev ? MOL_A[i] : MOL_B[i]; var x = A0[1] + (B0[1] - A0[1]) * e, y = A0[2] + (B0[2] - A0[2]) * e; g.setAttribute('transform', 'translate(' + (cx + x).toFixed(1) + ' ' + (cy + y).toFixed(1) + ')'); }); arr.textContent = '→'; }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'electrolyse' ? '' : 'none'; B.style.display = st.mode === 'synthese' ? '' : 'none';
      if (st.mode === 'electrolyse') {
        var cur = st.on && st.soude;
        if (st.t == null) { if (cur && st.v < 10) st.v = Math.min(10, st.v + dt * 0.8); if (st.test) st.tp = Math.min(1, st.tp + dt / 1.6); }
        var vH = 2 * st.v, vO = st.v;
        [vH, vO].forEach(function (v, k) { var tb = tubes[k], gy = TT + 10 + v * VPX; attr(tb.gas, { y: TT + 2, height: Math.max(0, gy - TT - 2) }); attr(tb.wat, { y: gy, height: Math.max(0, TB - gy) }); tb.vt.textContent = (k ? 'O₂ : ' : 'H₂ : ') + fmt(v, 1) + ' mL'; tb.gas.setAttribute('opacity', v > 0.05 ? 0.28 : 0); });
        lamp.setAttribute('fill', cur ? '#FFD84A' : '#3A3F4A');
        BUB.forEach(function (b, k) { var left = k < 19, x0 = left ? T1 : T2, ph = (T * (0.9 + rnd(k, 3)) + rnd(k, 2)) % 1, gy = TT + 10 + (left ? vH : vO) * VPX; b.style.display = cur && st.v < 10 ? '' : 'none'; attr(b, { cx: x0 - 12 + rnd(k, 4) * 24, cy: 338 - ph * (338 - gy) }); });
        liq.setAttribute('fill', st.soude ? '#4FA8FF' : '#6FC3FF');
        bxH.style.display = st.test === 'h2' ? '' : 'none'; bxO.style.display = st.test === 'o2' ? '' : 'none';
        var tp = st.tp, hasH = vH > 2, hasO = vO > 1;
        mat.setAttribute('transform', 'translate(' + (94 + 10 * (1 - tp)) + ' ' + (196 - 20 * Math.min(1, tp * 2)) + ')'); var bang = st.test === 'h2' && hasH && tp > 0.5 ? Math.sin(Math.min(1, (tp - 0.5) / 0.3) * Math.PI) : 0; attr(pop, { r: 50 * bang, opacity: bang }); popT.textContent = st.test === 'h2' ? (tp > 0.55 ? (hasH ? '« POP ! » détonation' : 'rien (pas de gaz)') : 'flamme à l’ouverture') : '';
        var relit = st.test === 'o2' && hasO && tp > 0.5; buch.setAttribute('transform', 'translate(480 ' + (196 - 18 * Math.min(1, tp * 2)) + ')'); bFl.style.display = relit ? '' : 'none'; bTip.setAttribute('fill', relit || tp < 0.5 ? '#FF7A2E' : '#3A3A3A'); oT.textContent = st.test === 'o2' ? (tp > 0.55 ? (hasO ? 'elle se rallume !' : 'rien (pas de gaz)') : 'bûchette incandescente') : '';
        aMsg.textContent = !st.soude ? 'Eau pure : presque pas de courant, rien ne se passe' : !st.on && st.v === 0 ? 'Ferme le circuit pour commencer l’électrolyse' : st.test === 'h2' ? 'Le gaz de la cathode « aboie » : c’est du dihydrogène' : st.test === 'o2' ? 'Le gaz de l’anode rallume la bûchette : c’est du dioxygène' : cur ? 'Des bulles se forment : V(H₂) = 2 × V(O₂)' : 'Courant coupé : V(H₂) = ' + fmt(vH, 1) + ' mL, V(O₂) = ' + fmt(vO, 1) + ' mL';
        var mp = st.mp != null ? st.mp : Math.min(1, st.v / 4); mol(mp, false); eqT.textContent = '2 H₂O → 2 H₂ + O₂'; eqW.textContent = 'eau → dihydrogène + dioxygène';
        pset(['• Électrolyse de l’eau', 'Le courant décompose l’eau.', 'À la cathode (−) : dihydrogène H₂', 'À l’anode (+) : dioxygène O₂', 'V(H₂) = 2 × V(O₂)', 'La soude rend l’eau conductrice.']);
        res = { vH: vH, vO: vO, cur: cur, test: st.test, tp: tp, popOk: st.test === 'h2' && hasH && tp > 0.55, relit: relit };
      } else {
        if (st.t == null) { if (st.sparking) st.sp = Math.min(1, st.sp + dt / 1.5); if (st.cuing && st.sp >= 1) st.cu = Math.min(1, st.cu + dt / 1.5); }
        var sp = st.sp, gone = ease((sp - 0.15) / 0.6), gh = 240 * (1 - gone);
        attr(eGas, { y: 106, height: gh }); attr(eWat, { y: 106 + gh, height: 264 - gh });
        spark.style.display = sp > 0.02 && sp < 0.2 ? '' : 'none'; var fl = sp > 0.08 && sp < 0.45 ? Math.sin((sp - 0.08) / 0.37 * Math.PI) : 0; attr(flash, { r: 90 * fl, opacity: fl });
        DR.forEach(function (d, k) { d.setAttribute('opacity', sp > 0.4 ? Math.min(1, (sp - 0.4) * 3) : 0); });
        mixL.textContent = sp < 0.15 ? '2 volumes de H₂' : sp >= 1 ? 'il reste de l’eau' : ''; mixL2.textContent = sp < 0.15 ? '+ 1 volume de O₂' : '';
        var cuK = st.cu; pow.setAttribute('fill', 'rgb(' + Math.round(240 - 200 * cuK) + ',' + Math.round(242 - 110 * cuK) + ',' + Math.round(246 - 20 * cuK) + ')'); pip.style.display = st.sp >= 1 ? '' : 'none'; attr(dropC, { cy: 326 + 30 * ((cuK * 3) % 1), opacity: cuK > 0 && cuK < 1 ? 1 : 0 });
        bMsg.textContent = sp <= 0 ? 'Mélange de dihydrogène et de dioxygène : on fait jaillir une étincelle' : sp < 1 ? 'Détonation ! Les gaz disparaissent' : cuK >= 0.95 ? 'Le sulfate de cuivre anhydre devient bleu : c’est de l’eau !' : 'Des gouttelettes apparaissent : on teste ce liquide…';
        var mp2 = st.mp != null ? st.mp : ease((sp - 0.1) / 0.6); mol(mp2, true); eqT.textContent = '2 H₂ + O₂ → 2 H₂O'; eqW.textContent = 'dihydrogène + dioxygène → eau';
        pset(['• Synthèse de l’eau', 'Une étincelle déclenche la réaction', 'entre 2 volumes de H₂ et 1 de O₂.', 'Il se forme de l’eau :', 'le sulfate de cuivre anhydre bleuit.', 'Les atomes se conservent.']);
        res = { sp: sp, cu: cuK };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Décomposer l’eau ?' }, { t: 8, title: 'L’électrolyse' }, { t: 20, title: 'Le dihydrogène' }, { t: 28, title: 'Le dioxygène' }, { t: 35, title: 'L’équation' }, { t: 44, title: 'La synthèse' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Électrolyse : <b>2 H₂O → 2 H₂ + O₂</b>', 'dihydrogène à la cathode (−), dioxygène à l’anode (+) ; V(H₂) = 2 V(O₂).', '#9FD7FF'],
      ['Tests : H₂ <b>« aboie »</b>, O₂ <b>rallume</b> la bûchette', 'flamme pour le dihydrogène, bûchette incandescente pour le dioxygène.', '#FFB547'],
      ['Synthèse : <b>2 H₂ + O₂ → 2 H₂O</b>', 'l’eau formée bleuit le sulfate de cuivre anhydre.', '#3DD68C']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.soude = true; st.test = null; st.tp = 0; st.mp = null;
        if (t < 8) { st.mode = 'electrolyse'; st.on = false; st.v = 0; st.mp = 0; }
        else if (t < 20) { st.mode = 'electrolyse'; st.on = t < 19; st.v = Math.min(10, (t - 8.5) * 0.95); st.mp = 0; }
        else if (t < 28) { st.mode = 'electrolyse'; st.on = false; st.v = 10; st.test = 'h2'; st.tp = K.k(t, 21, 2.5); st.mp = 0; }
        else if (t < 35) { st.mode = 'electrolyse'; st.on = false; st.v = 10; st.test = 'o2'; st.tp = K.k(t, 28.6, 2.5); st.mp = 0; }
        else if (t < 44) { st.mode = 'electrolyse'; st.on = false; st.v = 10; st.mp = K.k(t, 36, 4); }
        else { st.mode = 'synthese'; st.sp = K.k(t, 46, 2.5); st.cu = K.k(t, 51, 2.5); st.mp = K.k(t, 46.3, 3); }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'L’eau est-elle un corps simple ?') || tg.show(t, 9.5, 19.6, 290, 92, '20 mL d’un côté, 10 mL de l’autre') || tg.show(t, 21, 27.6, 290, 92, 'Il « aboie » : dihydrogène') ||
          tg.show(t, 29, 34.6, 290, 92, 'Bûchette rallumée : dioxygène') || tg.show(t, 36, 43.6, 290, 92, '2 H₂O → 2 H₂ + O₂') || tg.show(t, 45, 50.6, 290, 92, 'Étincelle : 2 H₂ + O₂ → 2 H₂O') || tg.show(t, 51.2, 56.6, 290, 92, 'Sulfate de cuivre bleu : de l’eau');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un électrolyseur avec de l’eau additionnée de soude ; quand on ferme le circuit, des bulles montent dans deux tubes, 20 mL de dihydrogène à la cathode et 10 mL de dioxygène à l’anode ; le dihydrogène produit une détonation au contact d’une flamme et le dioxygène rallume une bûchette ; à droite, deux molécules d’eau se séparent en deux molécules de dihydrogène et une de dioxygène ; enfin, dans un eudiomètre, une étincelle fait réagir le mélange et l’eau formée bleuit le sulfate de cuivre anhydre',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'L’eau est-elle un corps pur simple, ou peut-on la décomposer ? Faisons passer un courant électrique dans de l’eau.', sub: 'Peut-on <b>décomposer</b> l’eau ?' },
      { t: 8, d: 11.6, say: 'On ajoute un peu de soude pour que l’eau conduise. Dès que le circuit est fermé, des bulles montent sur les deux électrodes. À la cathode, il se forme deux fois plus de gaz qu’à l’anode.', sub: 'V à la cathode = <b>2 ×</b> V à l’anode.' },
      { t: 20, d: 7.6, say: 'Approchons une flamme du gaz de la cathode : il produit une petite détonation, il « aboie ». C’est du dihydrogène.', sub: 'Le gaz qui « aboie » : le <b>dihydrogène</b>.' },
      { t: 28, d: 6.6, say: 'Le gaz de l’anode rallume une bûchette incandescente : c’est du dioxygène.', sub: 'Bûchette rallumée : le <b>dioxygène</b>.' },
      { t: 35, d: 8.6, say: 'À l’échelle des molécules, deux molécules d’eau donnent deux molécules de dihydrogène et une molécule de dioxygène. Les atomes se conservent.', sub: '<b>2 H₂O → 2 H₂ + O₂</b>' },
      { t: 44, d: 12.6, say: 'Inversement, dans un eudiomètre, une étincelle fait réagir deux volumes de dihydrogène avec un volume de dioxygène. Les gaz disparaissent et il se forme de l’eau, qui bleuit le sulfate de cuivre anhydre. C’est la synthèse de l’eau.', sub: 'Synthèse : <b>2 H₂ + O₂ → 2 H₂O</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : l’électrolyse décompose l’eau en dihydrogène et en dioxygène.', sub: 'Électrolyse : décomposition.' },
      { t: 61.8, d: 4.2, say: 'Le dihydrogène aboie, le dioxygène rallume la bûchette.', sub: 'Les deux tests.' },
      { t: 66.2, d: 4.8, say: 'La synthèse de l’eau reforme de l’eau.', sub: 'Synthèse : formation d’eau.' }
    ],
    learn: [
      { t: 19, ch: 1, html: 'Électrolyse : V(H₂) = <b>2 × V(O₂)</b>.' },
      { t: 27, ch: 2, html: 'Le dihydrogène produit une <b>détonation</b> à la flamme.' },
      { t: 34, ch: 3, html: 'Le dioxygène <b>rallume</b> une bûchette incandescente.' },
      { t: 56, ch: 5, html: 'Synthèse : <b>2 H₂ + O₂ → 2 H₂O</b> ; l’eau bleuit le sulfate de cuivre anhydre.' }
    ],
    question: { q: 'Lors d’une électrolyse, on recueille 12 mL de dihydrogène. Le volume de dioxygène est :', o: ['24 mL', '12 mL', '6 mL', '3 mL'], a: 2, e: 'V(O₂) = V(H₂) / 2 = 6 mL.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : un électrolyseur d’eau avec ou sans soude, dont on ferme le circuit ; les gaz s’accumulent dans deux tubes gradués et on peut tester chaque gaz avec une flamme ou une bûchette incandescente ; puis un eudiomètre contenant un mélange de dihydrogène et de dioxygène où l’on fait jaillir une étincelle, avec le test de l’eau au sulfate de cuivre anhydre ; à droite, les molécules qui se réarrangent',
    steps: [
      'Électrolyse : ferme le circuit et compare les volumes de gaz.',
      'Essaie sans soude : que se passe-t-il ?',
      'Teste chaque gaz.',
      'Synthèse : fais jaillir l’étincelle, puis teste le liquide formé.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'electrolyse', options: [{ v: 'electrolyse', l: 'Électrolyse' }, { v: 'synthese', l: 'Synthèse' }], onChange: function (v) { st.mode = v; vis(); } });
      var tS = c.toggle({ label: 'Soude ajoutée', value: true, onChange: function (v) { st.soude = v; } });
      var tK = c.toggle({ label: 'Circuit fermé', value: false, onChange: function (v) { st.on = v; } });
      var rw = c.row(), b1 = c.button({ label: 'Flamme → gaz cathode', sm: true, into: rw, onClick: function () { st.test = 'h2'; st.tp = 0; st.on = false; tK.set(false); } }), b2 = c.button({ label: 'Bûchette → gaz anode', sm: true, into: rw, onClick: function () { st.test = 'o2'; st.tp = 0; st.on = false; tK.set(false); } });
      var bV = c.button({ label: 'Vider les tubes', sm: true, onClick: function () { st.v = 0; st.test = null; } });
      var bE = c.button({ label: 'Étincelle', primary: true, onClick: function () { st.sparking = true; api.sound('pop'); } });
      var bC = c.button({ label: 'Tester le liquide formé', sm: true, onClick: function () { if (st.sp >= 1) st.cuing = true; else api.say('Fais d’abord jaillir l’étincelle.'); } });
      var bN = c.button({ label: 'Nouveau mélange', sm: true, onClick: function () { st.sp = 0; st.sparking = false; st.cu = 0; st.cuing = false; } });
      function vis() { var e = st.mode === 'electrolyse'; tS.hide(!e); tK.hide(!e); rw.style.display = bV.style.display = e ? '' : 'none'; bE.style.display = bC.style.display = bN.style.display = e ? 'none' : ''; }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'V(H₂)' }, { k: 'b', label: 'V(O₂)' }, { k: 'c', label: 'Rapport' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'electrolyse') { ro.a.set(fmt(last.vH, 1) + ' mL'); ro.b.set(fmt(last.vO, 1) + ' mL'); ro.c.set(last.vO > 0.1 ? fmt(last.vH / last.vO, 1) : '—'); } else { ro.a.set(st.sp >= 1 ? '0 mL' : '2 vol.'); ro.b.set(st.sp >= 1 ? '0 mL' : '1 vol.'); ro.c.set(last.cu > 0.9 ? 'eau formée' : '—'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var r; if (st.mode === 'electrolyse') r = st.test === 'h2' ? { e: 'flamme sur le gaz de la cathode', o: last.popOk ? 'détonation : dihydrogène' : 'rien' } : st.test === 'o2' ? { e: 'bûchette dans le gaz de l’anode', o: last.relit ? 'se rallume : dioxygène' : 'rien' } : { e: 'électrolyse' + (st.soude ? '' : ' sans soude'), o: 'H₂ : ' + fmt(last.vH, 1) + ' mL, O₂ : ' + fmt(last.vO, 1) + ' mL' }; else r = { e: 'eudiomètre + étincelle', o: last.cu > 0.9 ? 'eau formée (sulfate de cuivre bleu)' : st.sp >= 1 ? 'gouttelettes' : 'mélange intact' }; rows.push(r); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Expérience</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Identifier les gaz et l’eau</h3><table class="mt"><thead><tr><th>Corps</th><th>Test</th><th>Résultat</th></tr></thead><tbody><tr><td>dihydrogène H₂</td><td>flamme</td><td>détonation (« aboie »)</td></tr><tr><td>dioxygène O₂</td><td>bûchette incandescente</td><td>se rallume</td></tr><tr><td>eau H₂O</td><td>sulfate de cuivre anhydre</td><td>blanc → bleu</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'electrolyse', soude: true, on: false, v: 0, test: null, tp: 0, sp: 0, sparking: false, cu: 0, cuing: false }); cM.set('electrolyse'); tS.set(true); tK.set(false); vis(); rows = []; paint(); });
      api.say('Ferme le circuit pour lancer l’électrolyse.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>L’<b>électrolyse</b> de l’eau (rendue conductrice par un peu de soude) la décompose : il se forme du <b>dihydrogène</b> à la cathode (−) et du <b>dioxygène</b> à l’anode (+), avec <b>V(H₂) = 2 × V(O₂)</b>. Équation-bilan : <b>2 H₂O → 2 H₂ + O₂</b>.</p><p>Le dihydrogène produit une détonation au contact d’une flamme ; le dioxygène rallume une bûchette incandescente.</p><p>La <b>synthèse</b> de l’eau est la réaction inverse : <b>2 H₂ + O₂ → 2 H₂O</b>, déclenchée par une étincelle ; l’eau formée bleuit le sulfate de cuivre anhydre. L’eau est donc un <b>corps pur composé</b> d’hydrogène et d’oxygène.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Électrolyse de l’eau' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du chimiste',
    intro: 'Décompose, identifie, reconstruis l’eau !',
    missions: [
      { title: '16 mL', text: 'Recueille au moins <span style="color:#EEF2F8">16 mL de dihydrogène</span>.', lumi: 'Le courant doit passer…', hint: 'Soude + circuit fermé.',
        build: function (api) { var lab = mini(api, { soude: false }); api.c.toggle({ label: 'Soude ajoutée', value: false, onChange: function (v) { lab.st.soude = v; } }); api.c.toggle({ label: 'Circuit fermé', value: false, onChange: function (v) { lab.st.on = v; } }); return function () { var r = lab.res(); return r.vH >= 16 ? { ok: true, msg: fmt(r.vH, 1) + ' mL de H₂ et ' + fmt(r.vO, 1) + ' mL de O₂.' } : { ok: false, msg: r.cur ? 'Encore un peu…' : 'Aucun gaz : le courant ne passe pas.' }; }; },
        e: 'La soude rend l’eau conductrice.' },
      { title: 'Le gaz qui aboie', text: 'Identifie le <b>dihydrogène</b> avec le bon test.', lumi: 'Quel gaz se forme à la cathode ?', hint: 'Flamme sur le gaz de la cathode.',
        build: function (api) { var lab = mini(api, { v: 8 }); var rw = api.c.row(); api.c.button({ label: 'Flamme → cathode', sm: true, into: rw, onClick: function () { lab.st.test = 'h2'; lab.st.tp = 0; } }); api.c.button({ label: 'Bûchette → anode', sm: true, into: rw, onClick: function () { lab.st.test = 'o2'; lab.st.tp = 0; } }); return function () { var r = lab.res(); return r.popOk ? { ok: true, msg: 'Détonation : c’est le dihydrogène.' } : { ok: false, msg: r.relit ? 'Ça, c’est le dioxygène.' : 'Fais le test.' }; }; },
        e: 'Le dihydrogène « aboie » à la flamme.' },
      { type: 'qcm', title: 'L’équation', text: 'L’équation-bilan de l’électrolyse de l’eau est :', o: ['H₂O → H₂ + O₂', '2 H₂O → 2 H₂ + O₂', '2 H₂ + O₂ → 2 H₂O', 'H₂O → H + O'], a: 1, hint: 'Les atomes doivent se conserver.', e: '4 H et 2 O de chaque côté.' },
      { title: 'L’eau retrouvée', text: 'Réalise la synthèse et prouve qu’il s’est formé de l’<b>eau</b>.', lumi: 'Étincelle, puis test.', hint: 'Étincelle, puis « Tester le liquide formé ».',
        build: function (api) { var lab = mini(api, { mode: 'synthese' }); api.c.button({ label: 'Étincelle', sm: true, onClick: function () { lab.st.sparking = true; } }); api.c.button({ label: 'Tester le liquide formé', sm: true, onClick: function () { if (lab.st.sp >= 1) lab.st.cuing = true; } }); return function () { var r = lab.res(); return r.cu > 0.9 ? { ok: true, msg: 'Sulfate de cuivre bleu : c’est de l’eau.' } : { ok: false, msg: r.sp >= 1 ? 'Teste les gouttelettes.' : 'Fais jaillir l’étincelle.' }; }; },
        e: 'L’eau bleuit le sulfate de cuivre anhydre.' },
      { type: 'qcm', title: 'Nature de l’eau', text: 'Ces expériences montrent que l’eau est :', o: ['un corps pur simple', 'un corps pur composé', 'un mélange de gaz', 'un métal'], a: 1, hint: 'On peut la décomposer.', e: 'Corps pur composé d’hydrogène et d’oxygène.' }
    ]
  };

  S.start({
    inquiry: {"situation": "L’électrolyse de l’eau produit des gaz dans deux tubes. Quels volumes relatifs et quelles identifications peut-on prévoir ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-electrolyse-eau', level: '3e', theme: 'Les réactions chimiques', title: 'Électrolyse et synthèse de l’eau', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’<b>électrolyse</b> de l’eau (additionnée de soude pour la rendre conductrice) la décompose en <b>dihydrogène</b> (à la cathode −) et en <b>dioxygène</b> (à l’anode +).',
      'Le volume de dihydrogène est le double de celui de dioxygène : <b>V(H₂) = 2 × V(O₂)</b>. Équation-bilan : <b>2 H₂O → 2 H₂ + O₂</b>.',
      'Tests : le dihydrogène produit une <b>détonation</b> au contact d’une flamme ; le dioxygène <b>rallume</b> une bûchette incandescente.',
      'La <b>synthèse</b> de l’eau : <b>2 H₂ + O₂ → 2 H₂O</b>, déclenchée par une étincelle. L’eau formée <b>bleuit le sulfate de cuivre anhydre</b>.',
      'L’eau est un <b>corps pur composé</b>. Au cours d’une réaction chimique, les atomes se conservent.'
    ],
    quiz: [
      { q: 'Lors de l’électrolyse de l’eau, le dihydrogène se forme :', o: ['à l’anode', 'à la cathode', 'dans les deux tubes', 'dans le générateur'], a: 1, e: 'À la cathode (−).' },
      { q: 'On ajoute de la soude à l’eau pour :', o: ['la colorer', 'la rendre conductrice', 'la chauffer', 'produire du dioxygène'], a: 1, e: 'L’eau pure conduit très mal.' },
      { q: 'Le gaz qui rallume une bûchette incandescente est :', o: ['le dihydrogène', 'le dioxygène', 'la vapeur d’eau', 'le diazote'], a: 1, e: 'Le dioxygène entretient la combustion : une bûchette incandescente s’y rallume. Le dihydrogène, lui, produit une petite détonation.' },
      { q: 'L’équation de la synthèse de l’eau est :', o: ['2 H₂O → 2 H₂ + O₂', '2 H₂ + O₂ → 2 H₂O', 'H₂ + O → H₂O', 'H + O₂ → H₂O'], a: 1, e: '2 H₂ + O₂ → 2 H₂O.' },
      { q: 'Le sulfate de cuivre anhydre permet de reconnaître :', o: ['le dioxygène', 'l’eau', 'le dihydrogène', 'le carbone'], a: 1, e: 'Il passe du blanc au bleu.' }
    ]
  });
})();

