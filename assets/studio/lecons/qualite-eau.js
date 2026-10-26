/* 4e · Eau potable · Leçon : Qualité de l’eau */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var SAMP = {
    robinet: { n: 'eau du robinet', ph: 7.2, cl: 20, so: 12, ca: 30, res: 160, mic: 0, tr: 0, col: '#8EC9FF' },
    minerale: { n: 'eau minérale', ph: 7.6, cl: 14, so: 26, ca: 78, res: 340, mic: 0, tr: 0, col: '#9FD7FF' },
    puits: { n: 'eau de puits', ph: 6.1, cl: 64, so: 40, ca: 52, res: 420, mic: 38, tr: 0.15, col: '#B9D3C4' },
    lagune: { n: 'eau de lagune', ph: 7.0, cl: 900, so: 140, ca: 90, res: 2600, mic: 60, tr: 0.7, col: '#9C8B5E' },
    mer: { n: 'eau de mer', ph: 8.2, cl: 19000, so: 2700, ca: 410, res: 35000, mic: 6, tr: 0.05, col: '#4F9BD9' },
    distillee: { n: 'eau distillée', ph: 7.0, cl: 0, so: 0, ca: 0, res: 0, mic: 0, tr: 0, col: '#DDEFFF' }
  };
  var KEYS = ['robinet', 'minerale', 'puits', 'lagune', 'mer', 'distillee'];
  var TESTS = [
    { k: 'asp', n: 'Aspect', tool: 'observation' },
    { k: 'ph', n: 'pH', tool: 'papier pH' },
    { k: 'cl', n: 'Ions chlorure', tool: 'nitrate d’argent' },
    { k: 'so', n: 'Ions sulfate', tool: 'chlorure de baryum' },
    { k: 'ca', n: 'Ions calcium', tool: 'oxalate d’ammonium' },
    { k: 'res', n: 'Résidu sec', tool: 'évaporation' },
    { k: 'mic', n: 'Microbes', tool: 'culture 48 h' }
  ];
  function result(sm, k) {
    var x = SAMP[sm];
    switch (k) {
      case 'asp': return { v: x.tr > 0.3 ? 'trouble' : x.tr > 0.1 ? 'légèrement trouble' : 'limpide, inodore', ok: x.tr <= 0.1 };
      case 'ph': return { v: 'pH ≈ ' + fmt(x.ph, 1) + (x.ph < 6.5 ? ' (acide)' : x.ph > 8.5 ? ' (basique)' : ''), ok: x.ph >= 6.5 && x.ph <= 8.5 };
      case 'cl': return { v: x.cl < 1 ? 'aucun précipité' : 'précipité blanc ' + (x.cl > 500 ? 'abondant' : 'léger'), ok: x.cl <= 250 };
      case 'so': return { v: x.so < 1 ? 'aucun précipité' : 'précipité blanc ' + (x.so > 250 ? 'abondant' : 'léger'), ok: x.so <= 250 };
      case 'ca': return { v: x.ca < 1 ? 'aucun précipité' : 'précipité blanc ' + (x.ca > 200 ? 'abondant' : 'léger'), ok: true };
      case 'res': return { v: x.res < 1 ? 'aucun dépôt' : x.res > 1500 ? 'dépôt blanc abondant' : 'léger dépôt blanc', ok: x.res <= 1500 };
      case 'mic': return { v: x.mic ? x.mic + ' colonies' : 'aucune colonie', ok: x.mic === 0 };
    }
  }
  function verdict(sm, done) {
    var d = done[sm] || {}, all = true, bad = null, any = false;
    TESTS.forEach(function (T) { if ((d[T.k] || 0) >= 1) { any = true; var r = result(sm, T.k); if (!r.ok && !bad) bad = T; } else all = false; });
    if (bad) return { s: 'bad', t: 'NON CONFORME', why: bad.n + ' hors des valeurs de référence' };
    if (sm === 'distillee' && all) return { s: 'warn', t: 'BUVABLE MAIS SANS SELS', why: 'pas de sels minéraux utiles' };
    return all ? { s: 'ok', t: 'CONFORME AUX TESTS', why: 'ces 7 critères sont respectés (d’autres analyses restent nécessaires)' } : { s: 'wait', t: any ? 'ANALYSE EN COURS' : 'À ANALYSER', why: '' };
  }
  var PHC = ['#D32F2F', '#E53935', '#F4511E', '#FB8C00', '#FDD835', '#C0CA33', '#7CB342', '#43A047', '#00897B', '#00ACC1', '#1E88E5', '#3949AB', '#5E35B1', '#6A1B9A'];
  function phColor(p) { var i = Math.max(0, Math.min(13, Math.round(p) - 1)); return PHC[i]; }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
  function mixc(a, b, k) { function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; } var A = h(a), B = h(b); k = Math.max(0, Math.min(1, k)); return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); }).join(',') + ')'; }

  function Lab(G, o) {
    var st = Object.assign({ sample: 'robinet', test: 'asp', prog: 0, run: false, done: {}, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 0, y: 404, width: 548, height: 66, fill: '#151D2E' }, G);
    /* étagère d’échantillons */
    var bot = KEYS.map(function (k, i) {
      var x = 24 + (i % 2) * 92, y = 56 + Math.floor(i / 2) * 116, g = s('g', { style: 'cursor:pointer' }, G);
      var sel = s('rect', { x: x - 4, y: y - 4, width: 88, height: 108, rx: 12, fill: '#16223A', stroke: '#2B3A57', 'stroke-width': 2 }, g);
      s('rect', { x: x + 30, y: y + 6, width: 20, height: 12, rx: 3, fill: '#5B6680' }, g);
      s('path', { d: 'M' + (x + 24) + ' ' + (y + 18) + 'h32 l8 16 v44 q0 8 -8 8 h-32 q-8 0 -8 -8 v-44z', fill: SAMP[k].col, opacity: 0.85 }, g);
      s('path', { d: 'M' + (x + 24) + ' ' + (y + 18) + 'h32 l8 16 v44 q0 8 -8 8 h-32 q-8 0 -8 -8 v-44z', fill: 'none', stroke: '#DCE3EE', 'stroke-width': 1.5 }, g);
      s('text', { x: x + 40, y: y + 100, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 700, fill: '#C9D2E3', text: SAMP[k].n.replace('eau ', '') }, g);
      g.addEventListener('click', function () { if (o.pick) o.pick(k); });
      return sel;
    });
    /* paillasse */
    var BX = 218, BC = 383, B = s('g', {}, G);
    var title = s('text', { x: BC, y: 40, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#EEF2F8' }, G), sub = s('text', { x: BC, y: 60, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, G);
    // verre (aspect) / bécher (pH)
    var gl = s('g', {}, B), glW = s('path', { d: 'M' + (BC - 60) + ' 200 L' + (BC - 52) + ' 380 H' + (BC + 52) + ' L' + (BC + 60) + ' 200Z' }, gl);
    var glP = s('g', {}, gl); for (var i = 0; i < 40; i++) s('circle', { cx: BC - 48 + rnd(i, 1) * 96, cy: 210 + rnd(i, 2) * 160, r: 1.5 + rnd(i, 3) * 2, fill: '#6B5434' }, glP);
    s('path', { d: 'M' + (BC - 66) + ' 160 L' + (BC - 54) + ' 386 H' + (BC + 54) + ' L' + (BC + 66) + ' 160', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, gl);
    var eye = s('g', {}, gl); s('path', { d: 'M-22 0 q22 -18 44 0 q-22 18 -44 0z', fill: '#EEF2F8' }, eye); s('circle', { r: 7, fill: '#2B6CB0' }, eye);
    var strip = s('g', {}, gl), stripC = s('rect', { x: -7, y: 60, width: 14, height: 60, fill: '#E9D9A6' }, strip); s('rect', { x: -7, y: -80, width: 14, height: 140, fill: '#F2EBD3' }, strip);
    var scale = s('g', {}, gl); PHC.forEach(function (c, k) { s('rect', { x: BX + 12 + k * 22, y: 398, width: 22, height: 16, fill: c }, scale); if (k % 2 === 0) s('text', { x: BX + 23 + k * 22, y: 430, 'text-anchor': 'middle', 'font-size': 11, fill: '#A9B4C7', text: k + 1 }, scale); });
    s('text', { x: BX + 12, y: 448, 'font-size': 11, fill: '#FF8A80', text: 'acide' }, scale); s('text', { x: BX + 12 + 7 * 22 - 22, y: 448, 'text-anchor': 'middle', 'font-size': 11, fill: '#9BE7A5', text: 'neutre' }, scale); s('text', { x: BX + 12 + 14 * 22, y: 448, 'text-anchor': 'end', 'font-size': 11, fill: '#80B8FF', text: 'basique' }, scale);
    var mark = s('path', { fill: '#EEF2F8' }, scale);
    // tube à essais (réactifs)
    var tb = s('g', {}, B), tW = s('path', {}, tb), tP = s('g', {}, tb), TP = [];
    for (i = 0; i < 70; i++) TP.push(s('circle', { cx: BC - 30 + rnd(i, 4) * 60, cy: 240 + Math.pow(rnd(i, 5), 0.5) * 130, r: 2 + rnd(i, 6) * 3, fill: '#F4F6FA' }, tP));
    s('path', { d: 'M' + (BC - 40) + ' 140 V350 a40 40 0 0 0 80 0 V140', fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, tb);
    var drop = s('g', {}, tb); s('rect', { x: -7, y: -60, width: 14, height: 46, rx: 4, fill: '#DCE3EE' }, drop); s('path', { d: 'M-7 -14 L0 0 L7 -14Z', fill: '#DCE3EE' }, drop); s('rect', { x: -11, y: -78, width: 22, height: 20, rx: 7, fill: '#FFB547' }, drop);
    var dropT = s('text', { x: BC + 26, y: 92, 'font-size': 12, 'font-weight': 800, fill: '#FFB547' }, tb), dd = s('circle', { r: 4, fill: '#DCE3EE' }, tb);
    // capsule (évaporation)
    var ev = s('g', {}, B);
    s('path', { d: 'M' + (BC - 80) + ' 260 q80 70 160 0', fill: '#DCE3EE', stroke: '#A9B4C7', 'stroke-width': 2 }, ev);
    var evW = s('path', { d: 'M' + (BC - 70) + ' 266 q70 54 140 0 Z' }, ev), evD = s('g', {}, ev), ED = [];
    for (i = 0; i < 40; i++) ED.push(s('circle', { cx: BC - 50 + rnd(i, 7) * 100, cy: 274 + rnd(i, 8) * 16, r: 1.5 + rnd(i, 9) * 2.5, fill: '#FFFFFF' }, evD));
    s('path', { d: 'M' + (BC - 60) + ' 300 L' + (BC - 74) + ' 392 M' + (BC + 60) + ' 300 L' + (BC + 74) + ' 392 M' + (BC - 90) + ' 300 H' + (BC + 90), stroke: '#7D89A3', 'stroke-width': 4 }, ev);
    var fire = s('g', {}, ev); s('path', { d: 'M' + BC + ' 330 q22 26 0 56 q-22 -30 0 -56z', fill: '#4FC3FF' }, fire); s('path', { d: 'M' + BC + ' 350 q10 14 0 32 q-10 -16 0 -32z', fill: '#E8F4FF' }, fire);
    var steam = [0, 1, 2].map(function (k) { return s('path', { d: 'M0 0 q8 -12 0 -24 q-8 -12 0 -24', stroke: '#C9D2E3', 'stroke-width': 2, fill: 'none' }, ev); });
    // boîte de Pétri
    var pe = s('g', {}, B);
    s('circle', { cx: BC, cy: 270, r: 110, fill: '#F2E6B8', opacity: 0.9 }, pe); s('circle', { cx: BC, cy: 270, r: 116, fill: 'none', stroke: '#BFE6FF', 'stroke-width': 4 }, pe);
    var COL = []; for (i = 0; i < 60; i++) { var a = rnd(i, 11) * 6.283, r = Math.sqrt(rnd(i, 12)) * 96; COL.push(s('circle', { cx: BC + r * Math.cos(a), cy: 270 + r * Math.sin(a), r: 3 + rnd(i, 13) * 5, fill: ['#E8A33D', '#F4F1E8', '#C26A3B'][i % 3] }, pe)); }
    var clock = s('text', { x: BC, y: 410, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#FFC773' }, pe);
    var resT = s('text', { x: BC, y: 120, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#FFC773' }, G);
    /* fiche d’analyse */
    var FX = 560, F = s('g', {}, G);
    s('rect', { x: FX, y: 22, width: 280, height: 426, rx: 18, fill: '#F7F4EA' }, F);
    s('text', { x: FX + 20, y: 52, 'font-size': 13, 'font-weight': 900, fill: '#3A3426', text: 'FICHE D’ANALYSE' }, F);
    var fS = s('text', { x: FX + 20, y: 74, 'font-size': 13, 'font-weight': 700, fill: '#6B624C' }, F);
    var FR = TESTS.map(function (T, k) {
      var y = 108 + k * 40; s('line', { x1: FX + 18, x2: FX + 262, y1: y + 14, y2: y + 14, stroke: '#E1DACA', 'stroke-width': 1 }, F);
      var hl = s('rect', { x: FX + 10, y: y - 16, width: 260, height: 34, rx: 8, fill: '#FFE7B0', opacity: 0 }, F);
      s('text', { x: FX + 20, y: y, 'font-size': 13, 'font-weight': 800, fill: '#3A3426', text: T.n }, F);
      return { hl: hl, v: s('text', { x: FX + 20, y: y + 13, 'font-size': 11, fill: '#6B624C' }, F), ok: s('circle', { cx: FX + 250, cy: y - 4, r: 8 }, F) };
    });
    var vb = s('rect', { x: FX + 18, y: 392, width: 244, height: 38, rx: 19 }, F), vt = s('text', { x: FX + 140, y: 416, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900 }, F), vw = s('text', { x: FX + 140, y: 384, 'text-anchor': 'middle', 'font-size': 11, fill: '#6B624C' }, F);
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      var Tm = st.t != null ? st.t : now / 1000, x = SAMP[st.sample];
      if (st.t == null && st.run) { st.prog = Math.min(1, st.prog + dt / 1.4); if (st.prog >= 1) { st.run = false; (st.done[st.sample] = st.done[st.sample] || {})[st.test] = 1; o.onDone && o.onDone(); } }
      var p = st.prog, T = TESTS.filter(function (z) { return z.k === st.test; })[0], R = result(st.sample, st.test);
      bot.forEach(function (b, i) { b.setAttribute('stroke', KEYS[i] === st.sample ? '#FFB547' : '#2B3A57'); b.setAttribute('stroke-width', KEYS[i] === st.sample ? 3 : 2); });
      title.textContent = T.n + ' : ' + x.n; sub.textContent = 'outil : ' + T.tool; title.style.display = sub.style.display = o.noTitle ? 'none' : '';
      gl.style.display = st.test === 'asp' || st.test === 'ph' ? '' : 'none'; tb.style.display = ['cl', 'so', 'ca'].indexOf(st.test) >= 0 ? '' : 'none'; ev.style.display = st.test === 'res' ? '' : 'none'; pe.style.display = st.test === 'mic' ? '' : 'none';
      if (st.test === 'asp' || st.test === 'ph') {
        glW.setAttribute('fill', mixc(x.col, '#8B6B3D', x.tr)); glW.setAttribute('opacity', 0.55 + x.tr * 0.3); glP.setAttribute('opacity', x.tr * 1.2);
        eye.style.display = st.test === 'asp' ? '' : 'none'; eye.setAttribute('transform', 'translate(' + (BC + 110) + ' 260) scale(' + (0.8 + 0.2 * Math.abs(Math.sin(Tm * 2))) + ' 1)'); eye.setAttribute('opacity', p > 0 ? 1 : 0.4);
        strip.style.display = st.test === 'ph' ? '' : 'none'; strip.setAttribute('transform', 'translate(' + BC + ' ' + (120 + Math.min(1, p * 2) * 120) + ')');
        stripC.setAttribute('fill', p > 0.5 ? mixc('#E9D9A6', phColor(x.ph).replace('#', '#'), Math.min(1, (p - 0.5) * 3)) : '#E9D9A6');
        scale.style.display = st.test === 'ph' ? '' : 'none';
        var mx = BX + 12 + (x.ph - 0.5) * 22; mark.setAttribute('d', 'M' + mx + ' 396 l-7 -12 h14z'); mark.setAttribute('opacity', p >= 1 ? 1 : 0);
      } else if (tb.style.display === '') {
        var conc = x[st.test], amt = conc <= 0 ? 0 : Math.min(1, 0.18 + Math.log10(conc + 1) / 4.4);
        tW.setAttribute('d', 'M' + (BC - 40) + ' 210 V350 a40 40 0 0 0 80 0 V210Z'); tW.setAttribute('fill', mixc(x.col, '#8B6B3D', x.tr)); tW.setAttribute('opacity', 0.45);
        var pr = Math.max(0, (p - 0.35) / 0.65); TP.forEach(function (c, i) { c.setAttribute('opacity', i / TP.length < amt * pr ? (st.test === 'cl' ? 0.95 : 0.9) : 0); c.setAttribute('fill', st.test === 'cl' && st.t == null && p >= 1 ? '#EDEFF3' : '#F4F6FA'); });
        drop.style.display = p > 0 && p < 1 ? '' : 'none'; drop.setAttribute('transform', 'translate(' + BC + ' 150)'); dropT.textContent = T.tool; dd.style.display = p > 0.1 && p < 0.5 ? '' : 'none'; attr(dd, { cx: BC, cy: 154 + ((p * 200) % 60) });
      } else if (st.test === 'res') {
        evW.setAttribute('fill', x.col); evW.setAttribute('opacity', 0.7 * (1 - p)); evW.setAttribute('transform', 'translate(0 ' + p * 8 + ') scale(1 ' + (1 - p * 0.8) + ')'); evW.setAttribute('transform-origin', BC + ' 280');
        var amt2 = x.res <= 0 ? 0 : Math.min(1, 0.1 + Math.log10(x.res + 1) / 4.6); ED.forEach(function (c, i) { c.setAttribute('opacity', p > 0.7 && i / ED.length < amt2 ? 1 : 0); });
        fire.style.display = p > 0 && p < 1 ? '' : 'none'; fire.setAttribute('opacity', 0.75 + 0.25 * Math.sin(Tm * 18));
        steam.forEach(function (sm, k) { var ph = ((Tm * 0.8 + k / 3) % 1); sm.style.display = p > 0.05 && p < 0.9 ? '' : 'none'; sm.setAttribute('transform', 'translate(' + (BC - 30 + k * 30) + ' ' + (250 - ph * 60) + ')'); sm.setAttribute('opacity', 1 - ph); });
      } else {
        COL.forEach(function (c, i) { c.setAttribute('opacity', i < x.mic * Math.min(1, p * 1.2) ? 1 : 0); c.setAttribute('r', 3 + rnd(i, 13) * 5 * Math.min(1, p * 1.5)); });
        clock.textContent = 'incubation : ' + Math.round(48 * p) + ' h';
      }
      resT.textContent = p >= 1 ? R.v : p > 0 ? 'test en cours…' : 'appuie sur « Réaliser le test »';
      resT.setAttribute('fill', p >= 1 ? (R.ok ? '#3DD68C' : '#FF8A80') : '#A9B4C7');
      // fiche
      fS.textContent = 'échantillon : ' + x.n;
      var d = st.done[st.sample] || {};
      FR.forEach(function (row, k) { var Tk = TESTS[k].k, dn = (d[Tk] || 0) >= 1, r = result(st.sample, Tk); row.v.textContent = dn ? r.v : '—'; row.ok.setAttribute('fill', dn ? (r.ok ? '#3DD68C' : '#FF5A4E') : '#E1DACA'); row.hl.setAttribute('opacity', Tk === st.test ? 1 : 0); });
      var V = verdict(st.sample, st.done);
      vb.setAttribute('fill', { ok: '#3DD68C', bad: '#FF5A4E', warn: '#FFB547', wait: '#D9D2C0' }[V.s]); vt.setAttribute('fill', V.s === 'wait' ? '#6B624C' : '#1A1A1A'); vt.textContent = V.t; vw.textContent = V.why;
      return { V: V, R: R, p: p, sample: st.sample, test: st.test, done: st.done };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Une eau potable, c’est quoi ?' }, { t: 12, title: 'Le pH' }, { t: 26, title: 'Les ions dans l’eau' }, { t: 42, title: 'Résidu sec et microbes' }, { t: 56, title: 'À retenir' }];
  var PLAN = [ // [début, échantillon, test]
    [0.5, 'robinet', 'asp'], [6.2, 'lagune', 'asp'], [12.4, 'robinet', 'ph'], [19, 'puits', 'ph'], [26.4, 'robinet', 'cl'], [31.6, 'robinet', 'so'], [36.4, 'robinet', 'ca'], [42.4, 'robinet', 'res'], [48.4, 'robinet', 'mic']
  ];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { noTitle: true }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Une eau <b>potable</b> peut être bue sans danger', 'limpide, inodore, sans microbes dangereux, peu de sels minéraux.', 'var(--blue)'],
      ['Le <b>pH</b> mesure l’acidité', 'pH < 7 acide, 7 neutre, > 7 basique ; référence OMS : 6,5 à 8,5.', '#7CB342'],
      ['Des <b>réactifs</b> révèlent les ions', 'nitrate d’argent → Cl⁻, chlorure de baryum → SO₄²⁻, oxalate d’ammonium → Ca²⁺.', '#FFB547']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t; var cur = PLAN[0]; st.done = {};
        PLAN.forEach(function (pl) { if (t >= pl[0] - 0.5) cur = pl; if (t >= pl[0] + 1.6) { (st.done[pl[1]] = st.done[pl[1]] || {})[pl[2]] = 1; } });
        st.sample = cur[1]; st.test = cur[2]; st.prog = K.k(t, cur[0], 1.5);
        lab.step();
        tg.show(t, 2.4, 5.8, 388, 92, 'Limpide et inodore') || tg.show(t, 8, 11.6, 388, 92, 'Trouble : elle n’est pas potable') || tg.show(t, 14.4, 18.6, 388, 92, 'pH ≈ 7 : neutre') || tg.show(t, 21, 25.6, 388, 92, 'pH 6,1 : trop acide') ||
          tg.show(t, 28.4, 31.2, 388, 92, 'Précipité blanc : ions chlorure') || tg.show(t, 33.4, 36, 388, 92, 'Précipité blanc : ions sulfate') || tg.show(t, 38.4, 41.6, 388, 92, 'Précipité blanc : ions calcium') ||
          tg.show(t, 44.4, 47.8, 388, 92, 'Il reste des sels minéraux') || tg.show(t, 50.4, 55.6, 388, 92, 'Aucun microbe dangereux détecté');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un laboratoire d’analyse teste plusieurs eaux (robinet, lagune, puits) : aspect, pH avec du papier pH, tests des ions chlorure, sulfate et calcium avec des réactifs, résidu sec par évaporation et culture de microbes, avec une fiche d’analyse qui se remplit',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Une eau potable peut être bue sans danger. Première vérification : son aspect. L’eau du robinet est limpide et sans odeur.', sub: 'Une eau <b>potable</b> est d’abord <b>limpide</b> et <b>inodore</b>.' },
      { t: 6.2, d: 5.6, say: 'L’eau de la lagune, elle, est trouble : elle n’est pas potable.', sub: 'Une eau trouble <b>n’est pas potable</b>.' },
      { t: 12, d: 6.8, say: 'Mesurons le pH avec du papier pH. Pour l’eau du robinet, le pH est proche de sept : elle est neutre.', sub: 'Le <b>pH</b> : 7 = neutre, moins de 7 = acide, plus de 7 = basique.' },
      { t: 19, d: 6.6, say: 'L’eau de ce puits a un pH de six virgule un : elle est trop acide. Une eau potable a un pH entre six et demi et huit et demi.', sub: 'Eau potable : pH entre <b>6,5 et 8,5</b>.' },
      { t: 26, d: 5.4, say: 'L’eau contient aussi des ions. Le nitrate d’argent donne un précipité blanc avec les ions chlorure.', sub: '<b>Nitrate d’argent</b> → précipité blanc : ions <b>chlorure</b>.' },
      { t: 31.6, d: 4.6, say: 'Le chlorure de baryum révèle les ions sulfate.', sub: '<b>Chlorure de baryum</b> → ions <b>sulfate</b>.' },
      { t: 36.4, d: 5.4, say: 'L’oxalate d’ammonium révèle les ions calcium.', sub: '<b>Oxalate d’ammonium</b> → ions <b>calcium</b>.' },
      { t: 42, d: 6, say: 'Faisons évaporer l’eau : il reste un dépôt blanc, le résidu sec. Ce sont les sels minéraux dissous.', sub: 'Après évaporation : le <b>résidu sec</b> (sels minéraux).' },
      { t: 48.2, d: 7.4, say: 'Enfin, une culture en laboratoire ne révèle aucun microbe dangereux. L’eau du robinet passe tous ces tests.', sub: 'Aucun <b>microbe dangereux</b> détecté.' },
      { t: 56, d: 4.4, say: 'À retenir : une eau potable respecte des normes contrôlées par des laboratoires.', sub: 'Une eau potable respecte des <b>normes</b>.' },
      { t: 60.6, d: 4.2, say: 'Son pH est compris entre six et demi et huit et demi.', sub: 'pH entre <b>6,5 et 8,5</b>.' },
      { t: 65, d: 5, say: 'Des réactifs permettent d’identifier les ions qu’elle contient.', sub: 'Des <b>réactifs</b> identifient les ions.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'Une eau potable est <b>limpide</b>, <b>inodore</b> et sans goût désagréable.' },
      { t: 25, ch: 1, html: '<b>pH</b> : acide &lt; 7 &lt; basique ; valeur de référence 6,5 à 8,5.' },
      { t: 41, ch: 2, html: 'Nitrate d’argent → <b>Cl⁻</b> ; chlorure de baryum → <b>SO₄²⁻</b> ; oxalate d’ammonium → <b>Ca²⁺</b>.' },
      { t: 55, ch: 3, html: 'Le <b>résidu sec</b> = sels minéraux ; une eau potable est <b>sans microbes dangereux</b>.' }
    ],
    question: { q: 'Une eau de pH 5 est :', o: ['acide', 'neutre', 'basique', 'forcément potable'], a: 0, e: 'pH inférieur à 7 : solution acide (et hors norme pour l’eau potable).' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Test', r: [10, 20, 550, 430] }, { n: 'Fiche', r: [560, 22, 280, 424] }],
    alt: 'Laboratoire d’analyse de l’eau : six échantillons, une paillasse où l’on réalise un test (aspect, pH, ions, résidu sec, microbes) et une fiche d’analyse avec le verdict potable ou non',
    steps: [
      'Choisis un échantillon (clique sur une bouteille) et observe son aspect.',
      'Mesure son pH, puis teste la présence des ions chlorure, sulfate et calcium.',
      'Fais le résidu sec et la culture de microbes : l’eau est-elle potable ?',
      'Compare au moins trois eaux et relève tes verdicts dans l’onglet Mesures.'
    ],
    build: function (api) {
      var cS, cT;
      var lab = Lab(api.g, { pick: function (k) { st.sample = k; st.prog = (st.done[k] || {})[st.test] ? 1 : 0; st.run = false; cS.set(k); }, onDone: function () { api.sound('ok'); } }), st = lab.st, c = api.c, rows = [];
      cS = c.seg({ label: 'Échantillon', value: 'robinet', options: KEYS.map(function (k) { return { v: k, l: SAMP[k].n.replace('eau ', '') }; }), onChange: function (v) { st.sample = v; st.prog = (st.done[v] || {})[st.test] ? 1 : 0; st.run = false; } });
      cT = c.seg({ label: 'Test', value: 'asp', options: TESTS.map(function (T) { return { v: T.k, l: T.n }; }), onChange: function (v) { st.test = v; st.prog = (st.done[st.sample] || {})[v] ? 1 : 0; st.run = false; } });
      var r1 = c.row();
      c.button({ label: 'Réaliser le test', primary: true, into: r1, onClick: function () { if (st.prog >= 1 || st.run) return; st.prog = 0; st.run = true; } });
      c.button({ label: 'Analyse complète', sm: true, into: r1, onClick: function () { st.done[st.sample] = {}; TESTS.forEach(function (T) { st.done[st.sample][T.k] = 1; }); st.prog = 1; api.sound('ok'); } });
      var ro = api.readouts([{ k: 'r', label: 'Résultat' }, { k: 'v', label: 'Verdict' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.r.set(last.p >= 1 ? last.R.v : '—'); ro.v.set(last.V.t.toLowerCase()); });
      var M = api.measure; M.innerHTML = '<h3>Mes verdicts</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cet échantillon'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var d = st.done[st.sample] || {}, n = TESTS.filter(function (T) { return d[T.k]; }).length; rows = rows.filter(function (r) { return r.k !== st.sample; }); rows.push({ k: st.sample, n: SAMP[st.sample].n, t: n, v: last.V.t.toLowerCase(), w: last.V.why }); api.sound('ok'); paint(); if (rows.length >= 3) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Eau</th><th>Tests</th><th>Verdict</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.n + '</td><td>' + r.t + ' / 7</td><td>' + r.v + (r.w ? '<br><small>' + r.w + '</small>' : '') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun échantillon relevé.</div>';
        api.chart.innerHTML = '<h3>Seuils indicatifs utilisés dans cette leçon</h3><table class="mt"><thead><tr><th>Critère</th><th>Seuil utilisé</th><th>Nature</th></tr></thead><tbody><tr><td>Aspect</td><td>limpide, inodore</td><td>acceptabilité</td></tr><tr><td>pH</td><td>6,5 à 8,5</td><td>valeur indicative de l’OMS (confort, corrosion)</td></tr><tr><td>Ions chlorure</td><td>≤ 250 mg/L</td><td>seuil de goût (OMS)</td></tr><tr><td>Ions sulfate</td><td>≤ 250 mg/L</td><td>seuil de goût, valeur pédagogique</td></tr><tr><td>Résidu sec</td><td>≤ 1 500 mg/L</td><td>valeur pédagogique simplifiée (l’OMS indique ≈ 1 000 mg/L pour le goût)</td></tr><tr><td>Microbes</td><td>aucun germe pathogène</td><td>critère de santé (analyse en laboratoire)</td></tr></tbody></table><p style="font-size:13px;margin:8px 0 0">Source : OMS, <i>Guidelines for drinking-water quality</i>, 4e éd. (2017). Ces seuils sont des <b>exemples pédagogiques</b> : ce ne sont pas les normes ivoiriennes en vigueur, et ces tests ne suffisent pas à garantir qu’une eau est potable. « Sans germe pathogène » ne veut pas dire stérile.</p>';
      }
      paint();
      api.onReset(function () { st.sample = 'robinet'; st.test = 'asp'; st.prog = 0; st.run = false; st.done = {}; cS.set('robinet'); cT.set('asp'); rows = []; paint(); });
      api.say('Clique sur une bouteille, puis réalise les tests un par un.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Analyse et relève au moins 3 eaux différentes.</p>';
        return '<p>Une eau <b>potable</b> est limpide, inodore, a un <b>pH entre 6,5 et 8,5</b> (valeur de référence), contient peu de sels minéraux et <b>aucun microbe dangereux</b>. L’eau du robinet et l’eau minérale passent ces tests.</p><p><b>Attention :</b> ces quelques tests ne suffisent pas à déclarer une eau potable. Les laboratoires agréés contrôlent de nombreux autres critères (métaux, nitrates, pesticides…). Les seuils utilisés ici sont des valeurs de référence simplifiées.</p><p>L’eau de puits peut être acide et contenir des microbes ; l’eau de lagune et l’eau de mer contiennent beaucoup trop de sels (chlorures, sulfates).</p><p>Les réactifs révèlent les ions : nitrate d’argent → chlorure, chlorure de baryum → sulfate, oxalate d’ammonium → calcium. L’eau distillée ne contient pas de sels minéraux.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Laboratoire d’analyse de l’eau' }, api.root), G = api.s('g', {}, sv); o.pick = function (k) { lab.st.sample = k; lab.st.prog = (lab.st.done[k] || {})[lab.st.test] ? 1 : 0; lab.st.run = false; }; var lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.res_ = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function testRow(api, lab, list) { if (list.length > 1) api.c.seg({ label: 'Test', value: list[0], options: TESTS.filter(function (T) { return list.indexOf(T.k) >= 0; }).map(function (T) { return { v: T.k, l: T.n }; }), onChange: function (v) { lab.st.test = v; lab.st.prog = (lab.st.done[lab.st.sample] || {})[v] ? 1 : 0; lab.st.run = false; } }); api.c.button({ label: 'Réaliser le test', sm: true, onClick: function () { if (lab.st.prog < 1 && !lab.st.run) { lab.st.prog = 0; lab.st.run = true; } } }); }
  var DEFI = {
    title: 'Le défi du laboratoire',
    intro: 'Blouse, gants, lunettes : tu es l’analyste de la ville. Quelle eau peut-on boire ?',
    missions: [
      { title: 'L’eau la plus salée', text: 'Clique sur les bouteilles et trouve l’eau qui contient le <span style="color:var(--amber)">plus d’ions chlorure</span>.', lumi: 'Compare la quantité de précipité blanc avec le nitrate d’argent.', hint: 'Pense à l’eau la plus salée de la planète…',
        build: function (api) { var lab = mini(api, { test: 'cl' }); testRow(api, lab, ['cl']); return function () { var r = lab.res(); return r.sample === 'mer' && r.p >= 1 ? { ok: true, msg: 'L’eau de mer : précipité blanc très abondant !' } : { ok: false, msg: r.p < 1 ? 'Réalise le test sur l’échantillon choisi.' : 'Il existe une eau encore plus riche en chlorures.' }; }; },
        e: 'L’eau de mer contient environ 19 g d’ions chlorure par litre.' },
      { type: 'qcm', title: 'Neutre', text: 'Une eau de pH 7 est :', o: ['acide', 'neutre', 'basique', 'salée'], a: 1, hint: 'Le milieu de l’échelle…', e: 'pH = 7 : neutre.' },
      { title: 'Le puits suspect', text: 'Prouve par un test que l’<span style="color:#9BE7A5">eau de puits</span> n’est pas potable.', lumi: 'Elle est limpide… mais un test va parler.', hint: 'Mesure son pH ou cherche les microbes.',
        build: function (api) { var lab = mini(api, { sample: 'puits', test: 'asp' }); testRow(api, lab, ['asp', 'ph', 'res', 'mic']); return function () { var r = lab.res(); return r.V.s === 'bad' ? { ok: true, msg: 'Prouvé : ' + r.V.why + '.' } : { ok: false, msg: 'Aucun test réalisé ne la rend non potable pour l’instant.' }; }; },
        e: 'L’eau de puits est trop acide (pH 6,1) et contient des microbes.' },
      { type: 'qcm', title: 'Quel réactif ?', text: 'Pour mettre en évidence les ions chlorure, on utilise :', o: ['l’oxalate d’ammonium', 'le chlorure de baryum', 'le nitrate d’argent', 'le papier pH'], a: 2, hint: 'Un réactif à base d’argent…', e: 'Le nitrate d’argent donne un précipité blanc avec les ions chlorure.' },
      { title: 'Le verdict', text: 'Réalise les 7 tests sur une eau qui doit tous les <span style="color:#3DD68C">réussir</span>.', lumi: 'Robinet ou minérale ? Les deux devraient passer !', hint: 'Choisis l’eau du robinet et enchaîne les 7 tests.',
        build: function (api) { var lab = mini(api, { sample: 'robinet', test: 'asp' }); testRow(api, lab, TESTS.map(function (T) { return T.k; })); return function () { var r = lab.res(); return r.V.s === 'ok' ? { ok: true, msg: r.sample === 'robinet' ? 'L’eau du robinet réussit les 7 tests.' : 'Cette eau réussit les 7 tests.' } : { ok: false, msg: r.V.s === 'bad' ? 'Cette eau échoue à un test.' : 'Il manque des tests sur la fiche.' }; }; },
        e: 'Une eau qui échoue à un seul test n’est pas potable ; réussir ces tests ne suffit pas à elle seule pour la déclarer potable.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux eaux paraissent transparentes. Cela suffit-il pour conclure qu’elles ont la même composition ou la même qualité ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-qualite-eau', level: '4e', theme: 'Eau potable', title: 'Qualité de l’eau', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une <b>eau potable</b> peut être consommée sans danger : elle est limpide, inodore, sans goût désagréable, sans microbes dangereux, et sa teneur en sels minéraux est limitée. Sa potabilité est contrôlée par des laboratoires sur de nombreux critères.',
      'Le <b>pH</b> se mesure avec du papier pH ou un pH-mètre : pH &lt; 7 acide, pH = 7 neutre, pH &gt; 7 basique. Valeur de référence pour l’eau de boisson : pH entre <b>6,5 et 8,5</b>.',
      'Tests d’ions : <b>nitrate d’argent</b> → précipité blanc (qui noircit à la lumière) avec les ions <b>chlorure</b> Cl<sup>−</sup> ; <b>chlorure de baryum</b> → précipité blanc avec les ions <b>sulfate</b> SO<sub>4</sub><sup>2−</sup> ; <b>oxalate d’ammonium</b> → précipité blanc avec les ions <b>calcium</b> Ca<sup>2+</sup>.',
      'L’évaporation de l’eau laisse un <b>résidu sec</b> : ce sont les sels minéraux dissous.',
      'L’étiquette d’une eau minérale indique sa composition (en mg/L) : on la compare aux normes de potabilité.'
    ],
    quiz: [
      { q: 'Une eau potable a un pH compris entre :', o: ['0 et 3', '6,5 et 8,5', '10 et 14', '4 et 5'], a: 1, e: 'C’est la valeur de référence recommandée pour l’eau de boisson.' },
      { q: 'Le chlorure de baryum met en évidence les ions :', o: ['chlorure', 'sulfate', 'calcium', 'sodium'], a: 1, e: 'Précipité blanc de sulfate de baryum.' },
      { q: 'Le résidu sec, c’est :', o: ['l’eau qui reste', 'les sels minéraux dissous', 'les microbes', 'la boue'], a: 1, e: 'Il reste après évaporation de l’eau.' },
      { q: 'Une eau de pH 9 est :', o: ['acide', 'neutre', 'basique', 'pure'], a: 2, e: 'pH supérieur à 7.' },
      { q: 'L’eau de mer n’est pas potable car :', o: ['elle est trop acide', 'elle contient trop de sels', 'elle est trouble', 'elle est froide'], a: 1, e: 'Environ 35 g de sels par litre.' }
    ]
  });
})();

