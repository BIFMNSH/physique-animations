/* 5e · Mélanges et réactions chimiques · Leçon : Atomes et molécules (modèles aux couleurs CPK) */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var EL = {
    H: { n: 'hydrogène', c: '#FFFFFF', d: '#B9C2CF', r: 16 },
    C: { n: 'carbone', c: '#3A3A3A', d: '#0E0E0E', r: 26 },
    N: { n: 'azote', c: '#4C6BFF', d: '#1E2FA8', r: 25 },
    O: { n: 'oxygène', c: '#F0454B', d: '#9E1A1F', r: 24 },
    S: { n: 'soufre', c: '#FFD84A', d: '#B38C00', r: 32 },
    Cl: { n: 'chlore', c: '#3DDC6B', d: '#178A3A', r: 30 }
  };
  var ORDER = ['C', 'H', 'N', 'O', 'S', 'Cl'];
  /* molécules connues : composition, nom, type, où la trouver, positions (x, y, profondeur) */
  var MOL = [
    { f: 'H_{2}', c: { H: 2 }, n: 'dihydrogène', w: 'gaz très léger, carburant des fusées', at: [['H', -18, 0], ['H', 18, 0]] },
    { f: 'O_{2}', c: { O: 2 }, n: 'dioxygène', w: '21 % de l’air ; indispensable pour respirer', at: [['O', -24, 0], ['O', 24, 0]] },
    { f: 'N_{2}', c: { N: 2 }, n: 'diazote', w: '78 % de l’air que nous respirons', at: [['N', -24, 0], ['N', 24, 0]] },
    { f: 'Cl_{2}', c: { Cl: 2 }, n: 'dichlore', w: 'gaz toxique, utilisé pour désinfecter l’eau', at: [['Cl', -28, 0], ['Cl', 28, 0]] },
    { f: 'H_{2}O', c: { H: 2, O: 1 }, n: 'eau', w: 'la molécule la plus abondante de ton corps', at: [['H', -36, 24], ['H', 36, 24], ['O', 0, 0, 1]] },
    { f: 'CO_{2}', c: { C: 1, O: 2 }, n: 'dioxyde de carbone', w: 'rejeté quand on respire et par les combustions', at: [['O', -50, 0], ['O', 50, 0], ['C', 0, 0, 1]] },
    { f: 'CO', c: { C: 1, O: 1 }, n: 'monoxyde de carbone', w: 'gaz mortel des fourneaux à charbon mal aérés', at: [['C', -22, 0], ['O', 26, 0]] },
    { f: 'CH_{4}', c: { C: 1, H: 4 }, n: 'méthane', w: 'gaz naturel, biogaz', at: [['H', 10, 18, -1], ['C', 0, 0, 0], ['H', 0, -44, 1], ['H', -42, 18, 1], ['H', 40, 24, 1]] },
    { f: 'NH_{3}', c: { N: 1, H: 3 }, n: 'ammoniac', w: 'odeur piquante, engrais', at: [['N', 0, 0, 0], ['H', -40, 22, 1], ['H', 40, 22, 1], ['H', 0, -42, 1]] },
    { f: 'SO_{2}', c: { S: 1, O: 2 }, n: 'dioxyde de soufre', w: 'gaz suffocant, formé quand le soufre brûle', at: [['O', -48, 24], ['O', 48, 24], ['S', 0, 0, 1]] },
    { f: 'HCl', c: { H: 1, Cl: 1 }, n: 'chlorure d’hydrogène', w: 'dissous dans l’eau : acide chlorhydrique', at: [['H', -28, 0], ['Cl', 14, 0, 1]] }
  ];
  function key(c) { return ORDER.map(function (e) { return c[e] ? e + c[e] : ''; }).join(''); }
  var BYK = {}; MOL.forEach(function (m) { BYK[key(m.c)] = m; });
  function formula(c) { var f = ''; ['C', 'S', 'N', 'H', 'O', 'Cl'].forEach(function (e) { if (c[e]) f += e + (c[e] > 1 ? '_{' + c[e] + '}' : ''); }); return f; }
  function rich(t, str, fs) { while (t.firstChild) t.removeChild(t.firstChild); var re = /_\{([^}]*)\}/g, i = 0, m, off = 0; function put(x, d, sm) { if (!x) return; var a = { text: x }; if (d !== off) a.dy = d - off; if (sm) a['font-size'] = fs * 0.62; s('tspan', a, t); off = d; } while ((m = re.exec(str))) { put(str.slice(i, m.index), 0); put(m[1], fs * 0.25, true); i = re.lastIndex; } put(str.slice(i), 0); if (off) put('​', 0); }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  var GID = 0;

  function Lab(G, o) {
    var st = Object.assign({ cnt: { C: 0, H: 0, N: 0, O: 0, S: 0, Cl: 0 }, ball: false, sym: true, zoom: 0, found: {}, t: null }, o || {});
    var defs = s('defs', {}, G), GR = {};
    ORDER.forEach(function (e) { var id = 'am' + (GID++), gr = s('radialGradient', { id: id, cx: 0.35, cy: 0.32, r: 0.75 }, defs); s('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': e === 'H' ? 1 : 0.55 }, gr); s('stop', { offset: 0.25, 'stop-color': EL[e].c }, gr); s('stop', { offset: 1, 'stop-color': EL[e].d }, gr); GR[e] = 'url(#' + id + ')'; });
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var W = s('g', {}, G), sticks = s('g', {}, W), atomsG = s('g', {}, W), A = [];
    function sphere(e) { var g = s('g', {}, atomsG); var c = s('circle', { r: EL[e].r, fill: GR[e], stroke: '#00000055', 'stroke-width': 1 }, g); var t = s('text', { y: 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: e === 'H' || e === 'S' || e === 'Cl' ? '#1A1F28' : '#FFFFFF', text: e }, g); return { e: e, g: g, c: c, t: t, x: 290, y: 240, z: 0 }; }
    var msg = s('text', { x: 290, y: 400, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, G);
    /* goutte d’eau zoomée (intro) */
    var Z = s('g', {}, G), ZD = s('path', { d: 'M290 90 C340 170 380 220 380 280 a90 90 0 0 1 -180 0 C200 220 240 170 290 90Z', fill: '#5FA8E8', opacity: 0.55, stroke: '#BFE6FF', 'stroke-width': 3 }, Z), ZM = s('g', {}, Z), zm = [];
    for (var i = 0; i < 26; i++) { var g = s('g', {}, ZM); s('circle', { cx: -7, cy: 5, r: 4.5, fill: GR.H }, g); s('circle', { cx: 7, cy: 5, r: 4.5, fill: GR.H }, g); s('circle', { r: 7, fill: GR.O }, g); zm.push(g); }
    /* panneau */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 20, y: 48, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'CARTE DE LA MOLÉCULE' }, P);
    var pf = s('text', { x: PX + 140, y: 100, 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 900, fill: '#FFC773' }, P);
    var pn = s('text', { x: PX + 140, y: 130, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#EEF2F8' }, P);
    var pt = s('text', { x: PX + 140, y: 154, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800 }, P);
    var pw = s('text', { x: PX + 140, y: 178, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var cntG = s('g', {}, P);
    s('line', { x1: PX + 20, x2: PX + 260, y1: 262, y2: 262, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var colT = s('text', { x: PX + 20, y: 286, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var coll = MOL.map(function (m, k) { var x = PX + 22 + (k % 4) * 62, y = 300 + Math.floor(k / 4) * 46, g = s('g', {}, P); var r = s('rect', { x: x, y: y, width: 56, height: 38, rx: 9, fill: '#16223A', stroke: '#2B3A57', 'stroke-width': 1.5 }, g); var t = s('text', { x: x + 28, y: y + 25, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#5B6680' }, g); return { r: r, t: t, m: m }; });
    var lastK = '', last = performance.now(), lastSum = -1;
    function rebuild() {
      var want = []; ORDER.forEach(function (e) { for (var j = 0; j < (st.cnt[e] || 0); j++) want.push(e); });
      // ajuster la liste des sphères en gardant celles qui existent
      var have = {}; A.forEach(function (a) { (have[a.e] = have[a.e] || []).push(a); });
      var next = []; want.forEach(function (e) { var h = have[e] && have[e].length ? have[e].shift() : sphere(e); next.push(h); });
      Object.keys(have).forEach(function (e) { have[e].forEach(function (a) { a.g.remove(); }); });
      A = next;
    }
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      var k = key(st.cnt); if (k !== lastK) { lastK = k; rebuild(); }
      var M = BYK[k], sum = A.length;
      Z.style.display = st.zoom > 0 ? '' : 'none'; W.style.display = st.zoom >= 1 ? 'none' : '';
      if (st.zoom > 0) { var zz = st.zoom; ZD.setAttribute('opacity', 0.55 * (1 - Math.max(0, zz - 0.5) * 1.6)); zm.forEach(function (g2, i2) { var a = rnd(i2, 1) * 6.283, r = Math.sqrt(rnd(i2, 2)) * 80; g2.setAttribute('transform', 'translate(' + (290 + r * Math.cos(a) + Math.sin(T * 2 + i2) * 3) + ' ' + (270 + r * Math.sin(a) * 0.9 + Math.cos(T * 1.7 + i2) * 3) + ') scale(' + (0.4 + zz * 1.6) + ') rotate(' + (rnd(i2, 3) * 360 + T * 20) + ')'); g2.setAttribute('opacity', Math.min(1, zz * 2)); }); }
      // positions cibles
      var sc = st.ball ? 2.3 : 1.55, rs = st.ball ? 0.8 : 1.5;
      if (M) {
        var used = {};
        M.at.forEach(function (p) { var e = p[0], list = A.filter(function (a) { return a.e === e && !used[A.indexOf(a)]; }), a = list[0]; if (!a) return; used[A.indexOf(a)] = 1; a.tx = 290 + p[1] * sc; a.ty = 230 + p[2] * sc; a.z = p[3] || 0; });
      } else A.forEach(function (a, i2) { var n = A.length, ang = i2 / Math.max(1, n) * 6.283; a.tx = 290 + (n > 1 ? 120 : 0) * Math.cos(ang + T * 0.15) + Math.sin(T + i2) * 8; a.ty = 225 + (n > 1 ? 90 : 0) * Math.sin(ang + T * 0.15) + Math.cos(T * 1.3 + i2) * 8; a.z = 0; });
      var kk = st.t != null ? 1 : Math.min(1, dt * 6);
      A.forEach(function (a) { a.x += (a.tx - a.x) * kk; a.y += (a.ty - a.y) * kk; a.g.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ')'); a.c.setAttribute('r', EL[a.e].r * (M ? rs : 1.2)); a.t.style.display = st.sym ? '' : 'none'; a.t.setAttribute('font-size', M && !st.ball ? 18 : 14); a.t.setAttribute('y', M && !st.ball ? 6 : 5); });
      // profondeur
      A.slice().sort(function (p, q) { return p.z - q.z; }).forEach(function (a) { atomsG.appendChild(a.g); });
      while (sticks.firstChild) sticks.removeChild(sticks.firstChild);
      if (M && st.ball) { var cen = A.filter(function (a) { return a.z === 1 || (M.at.length === 2 && a === A[0]); })[0] || A[0]; if (M.at.length === 2) s('line', { x1: A[0].x, y1: A[0].y, x2: A[1].x, y2: A[1].y, stroke: '#C9D2E3', 'stroke-width': 7, 'stroke-linecap': 'round' }, sticks); else { var c0 = A.filter(function (a) { return ['C', 'O', 'N', 'S', 'Cl'].indexOf(a.e) >= 0 && Math.abs(a.tx - 290) < 1 && Math.abs(a.ty - 230) < 1; })[0] || A[0]; A.forEach(function (a) { if (a !== c0) s('line', { x1: c0.x, y1: c0.y, x2: a.x, y2: a.y, stroke: '#C9D2E3', 'stroke-width': 7, 'stroke-linecap': 'round' }, sticks); }); } }
      if (M && !st.found[k]) { st.found[k] = 1; o.onFound && o.onFound(M); }
      msg.textContent = !sum ? 'Ajoute des atomes avec les boutons.' : M ? 'Molécule de ' + M.n + ' : ' + sum + ' atome' + (sum > 1 ? 's' : '') + ' liés.' : sum === 1 ? 'Un atome seul : ' + EL[A[0].e].n + '.' : 'Ces atomes ne forment pas une molécule connue ici.';
      // carte
      rich(pf, sum ? formula(st.cnt) : '?', 40); pn.textContent = M ? M.n : sum ? 'pas de molécule connue' : '';
      var nE = ORDER.filter(function (e) { return st.cnt[e]; }).length;
      pt.textContent = M ? (nE === 1 ? 'CORPS SIMPLE · 1 sorte d’atome' : 'CORPS COMPOSÉ · ' + nE + ' sortes d’atomes') : ''; pt.setAttribute('fill', nE === 1 ? '#4FC3FF' : '#FFB547');
      pw.textContent = M ? M.w : '';
      if (sum !== lastSum || true) { while (cntG.firstChild) cntG.removeChild(cntG.firstChild); var nn = ORDER.filter(function (e) { return st.cnt[e]; }).length, stp = Math.min(72, 240 / Math.max(1, nn)), xs = PX + 20 + (240 - stp * nn) / 2; ORDER.forEach(function (e) { if (!st.cnt[e]) return; s('circle', { cx: xs + 12, cy: 220, r: 12, fill: GR[e] }, cntG); s('text', { x: xs + 12, y: 225, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 900, fill: e === 'H' || e === 'S' || e === 'Cl' ? '#1A1F28' : '#FFF', text: e }, cntG); if (nn <= 3) s('text', { x: xs + 30, y: 225, 'font-size': 14, 'font-weight': 800, fill: '#EEF2F8', text: '× ' + st.cnt[e] }, cntG); else s('text', { x: xs + 12, y: 250, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8', text: '×' + st.cnt[e] }, cntG); if (nn <= 3) s('text', { x: xs + 12, y: 248, 'text-anchor': 'middle', 'font-size': 10, fill: '#7D89A3', text: EL[e].n }, cntG); xs += stp; }); lastSum = sum; }
      var nf = Object.keys(st.found).length; colT.textContent = 'MOLÉCULES DÉCOUVERTES : ' + nf + ' / ' + MOL.length;
      coll.forEach(function (cc) { var f = st.found[key(cc.m.c)]; rich(cc.t, f ? cc.m.f : '?', 14); cc.t.setAttribute('fill', f ? '#FFC773' : '#5B6680'); cc.r.setAttribute('stroke', M === cc.m ? '#FFB547' : '#2B3A57'); });
      return { M: M, k: k, sum: sum, found: nf };
    }
    return { st: st, step: step, GR: GR };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La matière est faite d’atomes' }, { t: 12, title: 'Atomes et symboles' }, { t: 25, title: 'Les molécules' }, { t: 37, title: 'La formule chimique' }, { t: 48, title: 'Corps simple, corps composé' }, { t: 59, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La matière est faite d’<b>atomes</b>', 'chaque atome a un nom, un <b>symbole</b> (C, H, O, N…) et une couleur dans les modèles.', '#FFC773'],
      ['Une <b>molécule</b> est un groupe d’atomes liés', 'sa <b>formule</b> indique le nombre d’atomes de chaque sorte : H₂O, CO₂, CH₄.', 'var(--blue)'],
      ['<b>Corps simple</b> : un seul type d’atome (O₂)', '<b>Corps composé</b> : plusieurs types d’atomes (H₂O).', '#3DD68C']], [59.2, 63.6, 68]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function C(o2) { var c = { C: 0, H: 0, N: 0, O: 0, S: 0, Cl: 0 }; for (var k in o2) c[k] = o2[k]; return c; }
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 59.2)) {
        st.t = t; st.ball = false;
        if (t < 12) { st.zoom = K.k(t, 1, 8) * 0.999 + 0.001; st.cnt = C({}); }
        else if (t < 25) { st.zoom = 0; var n = Math.min(6, Math.floor((t - 12.5) / 1.6) + 1); var c = {}; ORDER.slice(0, n).forEach(function (e) { c[e] = 1; }); st.cnt = C(c); }
        else if (t < 37) { st.zoom = 0; st.cnt = t < 28 ? C({ O: 1 }) : t < 30.5 ? C({ O: 1, H: 1 }) : C({ O: 1, H: 2 }); st.ball = t > 33.5; }
        else if (t < 48) { st.zoom = 0; st.cnt = t < 42.5 ? C({ C: 1, O: 2 }) : C({ C: 1, H: 4 }); }
        else { st.zoom = 0; st.cnt = t < 53 ? C({ O: 2 }) : C({ H: 2, O: 1 }); }
        lab.step();
        tg.show(t, 2, 11.6, 290, 92, 'Dans une goutte d’eau : des milliards de molécules') || tg.show(t, 13, 24.6, 290, 92, 'C noir, H blanc, N bleu, O rouge, S jaune, Cl vert') || tg.show(t, 30.6, 33.2, 290, 92, '2 H + 1 O : une molécule d’eau') || tg.show(t, 33.6, 36.6, 290, 92, 'Modèle éclaté : on voit les liaisons') ||
          tg.show(t, 38, 42.2, 290, 92, 'CO₂ : 1 carbone, 2 oxygènes') || tg.show(t, 43, 47.6, 290, 92, 'CH₄ : 1 carbone, 4 hydrogènes') || tg.show(t, 49, 52.6, 290, 92, 'O₂ : un seul type d’atome') || tg.show(t, 53.4, 58.6, 290, 92, 'H₂O : deux types d’atomes');
      }
      bg.setAttribute('opacity', t > 58.8 ? 1 : 0);
      K.group(g5, t, 58.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : zoom dans une goutte d’eau jusqu’aux molécules, présentation des atomes C, H, N, O, S et Cl avec leurs couleurs, assemblage d’une molécule d’eau, puis des molécules de dioxyde de carbone, méthane et dioxygène avec leur formule',
    duration: 73, chapters: CH,
    segs: [
      { t: 0, d: 5.6, say: 'Zoomons dans une goutte d’eau, encore et encore…', sub: 'Zoomons dans une goutte d’eau…' },
      { t: 5.8, d: 6, say: 'Elle contient des milliards de minuscules particules : des molécules, elles-mêmes faites d’atomes.', sub: 'Des milliards de <b>molécules</b>, faites d’<b>atomes</b>.' },
      { t: 12, d: 6.4, say: 'Chaque sorte d’atome a un nom et un symbole : C pour le carbone, H pour l’hydrogène, N pour l’azote…', sub: 'Chaque atome a un <b>symbole</b> : C, H, N…' },
      { t: 18.6, d: 6.2, say: '… O pour l’oxygène, S pour le soufre, Cl pour le chlore. Dans les modèles, chacun a sa couleur.', sub: '…O, S, Cl : chacun sa <b>couleur</b> dans les modèles.' },
      { t: 25, d: 5.6, say: 'Prenons un atome d’oxygène et deux atomes d’hydrogène, et lions-les.', sub: 'Un atome O et deux atomes H…' },
      { t: 30.8, d: 6, say: 'Nous obtenons une molécule d’eau. Une molécule est un groupe d’atomes liés entre eux.', sub: '…une <b>molécule</b> d’eau : des atomes <b>liés</b>.' },
      { t: 37, d: 5.4, say: 'La formule de cette molécule de dioxyde de carbone est C O deux : un carbone et deux oxygènes.', sub: 'Formule <b>CO₂</b> : 1 C et 2 O.' },
      { t: 42.6, d: 5.2, say: 'Le méthane, C H quatre : un carbone et quatre hydrogènes. Le petit chiffre est l’indice.', sub: '<b>CH₄</b> : l’indice donne le nombre d’atomes.' },
      { t: 48, d: 5, say: 'Le dioxygène, O deux, ne contient qu’une seule sorte d’atome : c’est un corps simple.', sub: 'O₂ : un <b>corps simple</b>.' },
      { t: 53.2, d: 5.6, say: 'L’eau contient deux sortes d’atomes : c’est un corps composé.', sub: 'H₂O : un <b>corps composé</b>.' },
      { t: 59, d: 4.4, say: 'À retenir : la matière est formée d’atomes, représentés par des symboles.', sub: 'Des <b>atomes</b> et leurs <b>symboles</b>.' },
      { t: 63.6, d: 4.2, say: 'Une molécule est un groupe d’atomes liés, décrit par sa formule.', sub: 'Une <b>molécule</b> et sa <b>formule</b>.' },
      { t: 68, d: 5, say: 'Corps simple : un seul type d’atome. Corps composé : plusieurs.', sub: 'Corps <b>simple</b> ou <b>composé</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'La matière est faite de particules très petites : les <b>atomes</b>.' },
      { t: 24, ch: 1, html: 'Symboles : <b>C</b>, <b>H</b>, <b>N</b>, <b>O</b>, <b>S</b>, <b>Cl</b>.' },
      { t: 36, ch: 2, html: 'Une <b>molécule</b> est un groupe d’atomes liés.' },
      { t: 58, ch: 4, html: 'Formule : H₂O, CO₂, CH₄ ; <b>corps simple</b> ou <b>composé</b>.' }
    ],
    question: { q: 'La formule CO₂ signifie que la molécule contient :', o: ['2 carbones, 1 oxygène', '1 carbone, 2 oxygènes', '1 cobalt, 2 oxygènes', '2 molécules de CO'], a: 1, e: 'L’indice 2 se rapporte à l’atome O qui le précède.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Atomes', r: [40, 40, 500, 406] }, { n: 'Molécules', r: [560, 22, 280, 424] }],
    alt: 'Atelier de modèles moléculaires : on ajoute des atomes de carbone, hydrogène, azote, oxygène, soufre et chlore ; quand la composition correspond à une molécule connue, les atomes s’assemblent et la carte de la molécule s’affiche ; une collection compte les molécules découvertes',
    steps: [
      'Ajoute des atomes avec les boutons : quand ils forment une molécule connue, ils s’assemblent.',
      'Lis la formule et le nom de chaque molécule obtenue.',
      'Classe chaque molécule : corps simple ou corps composé ?',
      'Découvre les 11 molécules de la collection ! Relève-les dans l’onglet Mesures.'
    ],
    build: function (api) {
      var rows = [], lab = Lab(api.g, { onFound: function (M) { api.sound('win'); api.say('Nouvelle molécule : ' + M.n + ' !'); rows.push(M); paint(); if (rows.length >= 4) api.done(); } }), st = lab.st, c = api.c;
      var host = c.row(); host.style.display = 'block';
      var paints = ORDER.map(function (e) {
        var row = api.h('div', { style: 'display:flex;align-items:center;gap:10px;margin:5px 0' }, host);
        api.h('span', { style: 'width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 32%,#fff 0,' + EL[e].c + ' 30%,' + EL[e].d + ' 100%);display:inline-block;border:1px solid #0006' }, row);
        api.h('div', { style: 'flex:1;font-weight:700' }, row, EL[e].n + ' (' + e + ')');
        var m = api.h('button', { class: 'btn sm', type: 'button', 'aria-label': 'retirer ' + EL[e].n }, row, '−'), v = api.h('div', { style: 'min-width:24px;text-align:center;font-weight:800' }, row), p = api.h('button', { class: 'btn sm', type: 'button', 'aria-label': 'ajouter ' + EL[e].n }, row, '+');
        function paint1() { v.textContent = st.cnt[e]; }
        m.onclick = function () { st.cnt[e] = Math.max(0, st.cnt[e] - 1); paint1(); api.sound('tick'); }; p.onclick = function () { if (st.cnt[e] < 4) { st.cnt[e]++; paint1(); api.sound('tick'); } };
        paint1(); return paint1;
      });
      var r2 = c.row(); c.button({ label: 'Vider', sm: true, into: r2, onClick: function () { ORDER.forEach(function (e) { st.cnt[e] = 0; }); paints.forEach(function (f) { f(); }); } });
      var tB = c.toggle({ label: 'Modèle éclaté (liaisons visibles)', value: false, onChange: function (v) { st.ball = v; } });
      var tS = c.toggle({ label: 'Symboles sur les atomes', value: true, onChange: function (v) { st.sym = v; } });
      var ro = api.readouts([{ k: 'f', label: 'Formule' }, { k: 'n', label: 'Molécule' }, { k: 'c', label: 'Collection' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.f.set(last.sum ? formula(st.cnt).replace(/_\{(\d+)\}/g, function (a, d) { return '₀₁₂₃₄₅₆₇₈₉'.split('')[+d] || d; }) : '—'); ro.n.set(last.M ? last.M.n : '—'); ro.c.set(last.found + ' / ' + MOL.length); });
      var M = api.measure;
      function paint() {
        api.count(rows.length);
        M.innerHTML = '<h3>Ma collection</h3>' + (rows.length ? '<table class="mt"><thead><tr><th>Formule</th><th>Nom</th><th>Type</th></tr></thead><tbody>' + rows.map(function (m) { var n = Object.keys(m.c).length; return '<tr><td>' + m.f.replace(/_\{(\d+)\}/g, '<sub>$1</sub>') + '</td><td>' + m.n + '</td><td>' + (n === 1 ? 'corps simple' : 'corps composé') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune molécule découverte.</div>');
        api.chart.innerHTML = '<h3>Couleurs des modèles (CPK)</h3><table class="mt"><tbody>' + ORDER.map(function (e) { return '<tr><td><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:' + EL[e].c + ';border:1px solid #0006;vertical-align:-2px;margin-right:6px"></span>' + e + '</td><td>' + EL[e].n + '</td></tr>'; }).join('') + '</tbody></table>';
      }
      paint();
      api.onReset(function () { ORDER.forEach(function (e) { st.cnt[e] = 0; }); paints.forEach(function (f) { f(); }); st.found = {}; st.ball = false; st.sym = true; tB.set(false); tS.set(true); rows = []; paint(); });
      api.say('Essaie : 2 hydrogènes et 1 oxygène.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Découvre au moins 3 molécules.</p>';
        return '<p>La matière est constituée d’<b>atomes</b>. Chaque sorte d’atome est représentée par un <b>symbole</b> (C, H, N, O, S, Cl) et, dans les modèles moléculaires, par une boule de couleur conventionnelle.</p><p>Une <b>molécule</b> est un ensemble d’atomes liés. Sa <b>formule</b> indique la nature et le nombre de ses atomes : l’indice, écrit en bas à droite, s’applique au symbole qui le précède (H<sub>2</sub>O : 2 H et 1 O).</p><p>Un <b>corps simple</b> est formé d’un seul type d’atome (O<sub>2</sub>, N<sub>2</sub>, H<sub>2</sub>) ; un <b>corps composé</b> de plusieurs types (H<sub>2</sub>O, CO<sub>2</sub>, CH<sub>4</sub>).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Modèles moléculaires' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function adders(api, lab, els) { var r = api.c.row(); els.forEach(function (e) { api.c.button({ label: '+ ' + e, sm: true, into: r, onClick: function () { if (lab.st.cnt[e] < 4) lab.st.cnt[e]++; } }); api.c.button({ label: '− ' + e, sm: true, into: r, onClick: function () { lab.st.cnt[e] = Math.max(0, lab.st.cnt[e] - 1); } }); }); }
  function target(f, msg) { return function (api) { var lab = mini(api, {}); adders(api, lab, ['C', 'H', 'O', 'N']); return function () { var r = lab.res(); return r.M && r.M.f === f ? { ok: true, msg: msg } : { ok: false, msg: r.M ? 'C’est la molécule de ' + r.M.n + '.' : 'Pas encore une molécule connue.' }; }; }; }
  var DEFI = {
    title: 'Le défi des molécules',
    intro: 'Boules rouges, blanches, noires… Assemble les bonnes molécules !',
    missions: [
      { title: 'De l’eau', text: 'Construis une <span style="color:#4FC3FF">molécule d’eau</span>.', lumi: 'H₂O : lis bien les indices.', hint: '2 atomes d’hydrogène et 1 atome d’oxygène.', build: target('H_{2}O', 'H₂O : 2 hydrogènes, 1 oxygène !'), e: 'La molécule d’eau H₂O : 2 H et 1 O.' },
      { type: 'qcm', title: 'Lire une formule', text: 'Combien d’atomes contient la molécule CO₂ ?', o: ['2', '3', '4', '1'], a: 1, hint: '1 carbone + 2 oxygènes.', e: '1 + 2 = 3 atomes.' },
      { title: 'Le gaz naturel', text: 'Construis une molécule de <span style="color:var(--amber)">méthane CH₄</span>.', lumi: 'Un carbone au centre…', hint: '1 C et 4 H.', build: target('CH_{4}', 'CH₄ : le méthane, gaz naturel et biogaz.'), e: 'Méthane CH₄ : 1 C et 4 H.' },
      { type: 'qcm', title: 'Simple ou composé ?', text: 'Le dioxygène O₂ est :', o: ['un corps composé', 'un corps simple', 'un mélange', 'un atome'], a: 1, hint: 'Combien de sortes d’atomes ?', e: 'Un seul type d’atome : corps simple.' },
      { title: 'Ce que l’on expire', text: 'Construis la molécule de <b>3 atomes</b> que nous rejetons en respirant.', lumi: 'Elle est aussi produite par les combustions.', hint: 'Le dioxyde de carbone.', build: target('CO_{2}', 'CO₂ : le dioxyde de carbone.'), e: 'CO₂ : 1 C et 2 O.' }
    ]
  };

  S.start({
    inquiry: {"situation": "La classe doit représenter plusieurs corps avec des modèles de particules. Comment distinguer un atome, une molécule et un mélange ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-atomes-molecules', level: '5e', theme: 'Mélanges et réactions chimiques', title: 'Atomes et molécules', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La matière est constituée de particules extrêmement petites : les <b>atomes</b>.',
      'Chaque sorte d’atome est représentée par un <b>symbole</b> : C (carbone), H (hydrogène), N (azote), O (oxygène), S (soufre), Cl (chlore). Dans les modèles, ils ont des couleurs conventionnelles : C noir, H blanc, N bleu, O rouge, S jaune, Cl vert.',
      'Une <b>molécule</b> est un ensemble d’atomes liés entre eux.',
      'La <b>formule</b> d’une molécule indique la nature et le nombre de ses atomes ; l’<b>indice</b> s’écrit en bas à droite du symbole : H<sub>2</sub>O (2 H, 1 O), CO<sub>2</sub> (1 C, 2 O), CH<sub>4</sub> (1 C, 4 H).',
      'Un <b>corps simple</b> est formé d’un seul type d’atome (O<sub>2</sub>, H<sub>2</sub>, N<sub>2</sub>) ; un <b>corps composé</b> de plusieurs types d’atomes (H<sub>2</sub>O, CO<sub>2</sub>).'
    ],
    quiz: [
      { q: 'Le symbole de l’atome d’oxygène est :', o: ['Ox', 'O', 'Og', 'X'], a: 1, e: 'Le symbole de l’oxygène est la lettre O (majuscule). Quand il y a deux lettres, la seconde est en minuscule : Cl, Fe.' },
      { q: 'Dans les modèles, l’atome de carbone est :', o: ['rouge', 'blanc', 'noir', 'bleu'], a: 2, e: 'Noir : dans les modèles moléculaires (code CPK), le carbone est noir, l’hydrogène blanc, l’oxygène rouge, l’azote bleu.' },
      { q: 'La molécule CH₄ contient :', o: ['1 C et 4 H', '4 C et 1 H', '1 C et 1 H', '5 C'], a: 0, e: 'L’indice 4 porte sur H.' },
      { q: 'Lequel est un corps composé ?', o: ['O₂', 'N₂', 'H₂O', 'H₂'], a: 2, e: 'H₂O contient deux types d’atomes.' },
      { q: 'Une molécule est :', o: ['un atome seul', 'un groupe d’atomes liés', 'un mélange', 'un ion'], a: 1, e: 'Des atomes liés entre eux.' }
    ]
  });
})();

