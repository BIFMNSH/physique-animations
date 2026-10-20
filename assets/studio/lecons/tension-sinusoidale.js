/* 4e · Courants et tensions alternatifs · Leçon : Tension alternative sinusoïdale */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit, DIV = 34;

  /* ---------- oscilloscope réutilisable ---------- */
  function scope(G, X, Y, id) {
    var o = { X: X, Y: Y }, g = s('g', {}, G); o.g = g;
    s('rect', { x: X - 18, y: Y - 22, width: 376, height: 330, rx: 18, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, g);
    s('rect', { x: X, y: Y, width: 10 * DIV, height: 8 * DIV, rx: 6, fill: 'var(--scope)' }, g);
    var d = ''; for (var i = 1; i < 10; i++) d += 'M' + (X + i * DIV) + ' ' + Y + 'v' + 8 * DIV; for (i = 1; i < 8; i++) d += 'M' + X + ' ' + (Y + i * DIV) + 'h' + 10 * DIV;
    s('path', { d: d, stroke: 'var(--scope-grid)', 'stroke-width': 1 }, g);
    var Y0 = Y + 4 * DIV, tk = 'M' + X + ' ' + Y0 + 'h' + 10 * DIV + 'M' + (X + 5 * DIV) + ' ' + Y + 'v' + 8 * DIV;
    for (i = 0; i <= 50; i++) tk += 'M' + (X + i * DIV / 5) + ' ' + (Y0 - 3) + 'v6'; for (i = 0; i <= 40; i++) tk += 'M' + (X + 5 * DIV - 3) + ' ' + (Y + i * DIV / 5) + 'h6';
    s('path', { d: tk, stroke: 'var(--scope-axis)', 'stroke-width': 1.3 }, g);
    var cp = s('clipPath', { id: 'sc' + id }, s('defs', {}, g)); s('rect', { x: X, y: Y, width: 10 * DIV, height: 8 * DIV }, cp);
    var tg = s('g', { 'clip-path': 'url(#sc' + id + ')' }, g);
    o.dim = s('path', { fill: 'none', stroke: 'var(--trace)', 'stroke-width': 2.5, opacity: 0.28 }, tg);
    o.tr = s('path', { fill: 'none', stroke: 'var(--trace)', 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, tg);
    o.spot = s('circle', { r: 6, fill: '#B9FFD6' }, tg);
    o.over = s('g', {}, tg);
    o.lab = s('text', { x: X + 170, y: Y + 8 * DIV + 26, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-muted)' }, g);
    o.warn = s('text', { x: X + 170, y: Y + 4 * DIV - 10, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--amber)' }, g);
    s('text', { x: X + 348, y: Y - 4, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 700, fill: 'var(--scene-muted)', 'letter-spacing': '0.08em', text: 'OSCILLOSCOPE' }, g);
    o.Y0 = Y0;
    // U(t) en volts, fenêtre win (s), sensibilité sens (V/div), fraction balayée k (0..1)
    o.draw = function (U, win, sens, k) {
      var a = '', b = '', xs = X + k * 10 * DIV;
      for (var px = 0; px <= 10 * DIV; px += 2) { var y = (Y0 - U(px / (10 * DIV) * win) / sens * DIV).toFixed(1); a += (px ? 'L' : 'M') + (X + px) + ' ' + y; if (X + px <= xs) b += (px ? 'L' : 'M') + (X + px) + ' ' + y; }
      o.dim.setAttribute('d', a); o.tr.setAttribute('d', b); attr(o.spot, { cx: xs, cy: Y0 - U(k * win) / sens * DIV });
    };
    return o;
  }
  function knob(G, x, y, label) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    s('circle', { r: 22, fill: 'var(--scene)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    var p = s('line', { x1: 0, y1: 0, x2: 0, y2: -18, stroke: 'var(--amber)', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    s('text', { y: 40, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--scene-muted)', text: label }, g);
    return function (k) { p.setAttribute('transform', 'rotate(' + (-135 + 270 * clamp(k, 0, 1)) + ')'); };
  }
  /* GBF + multimètre + oscilloscope */
  function bench(G, id) {
    var o = {};
    var gb = s('g', {}, G); o.gbf = gb;
    s('rect', { x: 30, y: 40, width: 280, height: 170, rx: 14, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, gb);
    s('text', { x: 46, y: 64, 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-muted)', 'letter-spacing': '0.08em', text: 'GÉNÉRATEUR BF' }, gb);
    s('rect', { x: 46, y: 76, width: 150, height: 44, rx: 6, fill: '#0E1B12' }, gb);
    o.fd = s('text', { x: 186, y: 107, 'text-anchor': 'end', 'font-size': 26, 'font-weight': 800, fill: '#7CFFB0', 'font-family': 'ui-monospace, monospace' }, gb);
    o.kf = knob(gb, 90, 160, 'fréquence'); o.ka = knob(gb, 180, 160, 'amplitude');
    s('path', { d: 'M232 96 c8 -18 16 -18 24 0 s16 18 24 0', fill: 'none', stroke: 'var(--trace)', 'stroke-width': 3 }, gb);
    s('circle', { cx: 250, cy: 170, r: 8, fill: 'var(--red)' }, gb); s('circle', { cx: 282, cy: 170, r: 8, fill: '#141C2E', stroke: 'var(--scene-muted)' }, gb);
    var pb = s('g', {}, G); o.pile = pb;
    s('rect', { x: 90, y: 70, width: 160, height: 110, rx: 12, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, pb);
    s('rect', { x: 150, y: 58, width: 40, height: 14, rx: 3, fill: 'var(--scene-muted)' }, pb);
    s('text', { x: 170, y: 132, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 800, fill: 'var(--scene-text)', 'font-family': 'Bricolage Grotesque, sans-serif', text: '4,5 V' }, pb);
    s('text', { x: 112, y: 100, 'font-size': 20, 'font-weight': 800, fill: 'var(--red)', text: '+' }, pb); s('text', { x: 222, y: 100, 'font-size': 20, 'font-weight': 800, fill: 'var(--blue)', text: '−' }, pb);
    // multimètre
    var mm = s('g', {}, G); o.mm = mm;
    s('rect', { x: 70, y: 250, width: 200, height: 190, rx: 18, fill: '#F2C94C', stroke: '#7A5F12', 'stroke-width': 2 }, mm);
    s('rect', { x: 88, y: 268, width: 164, height: 56, rx: 6, fill: '#C9D6B8' }, mm);
    o.md = s('text', { x: 240, y: 308, 'text-anchor': 'end', 'font-size': 32, 'font-weight': 800, fill: '#1C2416', 'font-family': 'ui-monospace, monospace' }, mm);
    o.mmode = s('text', { x: 170, y: 352, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#2A1A00' }, mm);
    s('circle', { cx: 170, cy: 396, r: 26, fill: '#3A3A3A' }, mm);
    o.mk = s('line', { x1: 170, y1: 396, x2: 170, y2: 374, stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' }, mm);
    s('text', { x: 120, y: 400, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#2A1A00', text: 'V⎓' }, mm); s('text', { x: 220, y: 400, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#2A1A00', text: 'V~' }, mm);
    o.wires = s('path', { d: 'M282 170 H360 V96 H470 M250 178 V226 H380 V112 H470 M282 178 V244 H220 V250 M250 178 V236 H120 V250', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 2.6 }, G);
    o.sc = scope(G, 488, 44, id);
    return o;
  }
  function Lab(G, o) {
    var B = bench(G, o.id), st = { src: o.src || 'gbf', f: o.f || 50, Um: o.Um == null ? 4 : o.Um, sens: o.sens || 2, sweep: o.sweep || 5, ac: o.ac !== false, ph: 0, showF: o.showF !== false };
    function U(t) { return st.src === 'pile' ? 4.5 : st.Um * Math.sin(2 * Math.PI * st.f * t); }
    function meter() { if (st.src === 'pile') return st.ac ? 0 : 4.5; return st.ac ? st.Um / Math.SQRT2 : 0; }
    function step(dt) {
      var win = 10 * st.sweep / 1000;
      st.ph = (st.ph + dt / 2.2) % 1;                                  // balayage visuel : 2,2 s par écran
      B.gbf.style.display = st.src === 'gbf' ? '' : 'none'; B.pile.style.display = st.src === 'pile' ? '' : 'none';
      B.fd.textContent = st.showF ? (st.f < 100 ? fmt(st.f, 1) : fmt(st.f, 0)) + ' Hz' : '— — Hz';
      B.kf(Math.log(st.f) / Math.log(200)); B.ka(st.Um / 10);
      B.sc.draw(U, win, st.sens, st.ph);
      B.sc.lab.textContent = 'Sensibilité ' + st.sens + ' V/div · balayage ' + st.sweep + ' ms/div';
      var over = st.src === 'gbf' && st.Um / st.sens > 4.05, few = st.src === 'gbf' && 1 / st.f > win;
      B.sc.warn.textContent = over ? 'La courbe sort de l’écran : augmente les V/div' : few ? 'Moins d’une période : augmente les ms/div' : '';
      var m = meter(); B.md.textContent = fmt(m, 2).replace('.', ','); B.mmode.textContent = st.ac ? 'mode alternatif ~' : 'mode continu ⎓';
      B.mk.setAttribute('transform', 'rotate(' + (st.ac ? 50 : -50) + ' 170 396)');
      var sw = S.settings.proj ? 1.6 : 1; B.sc.tr.setAttribute('stroke-width', 3.2 * sw);
    }
    return { st: st, step: step, meter: meter, B: B };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Continue ou alternative ?' }, { t: 14, title: 'Période et fréquence' }, { t: 30, title: 'Tension maximale et efficace' }, { t: 46, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var main = s('g', { transform: 'translate(12 40)' }, G), B = bench(main, 'rs'), sc = B.sc;
    var ov = s('g', {}, main);
    var brk = s('path', { fill: 'none', stroke: 'var(--blue)', 'stroke-width': 3 }, ov), brT = s('text', { 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: 'var(--blue)' }, ov);
    var um = s('path', { fill: 'var(--amber)' }, ov), umT = s('text', { 'font-size': 17, 'font-weight': 800, fill: 'var(--amber)' }, ov);
    var sect = s('g', { opacity: 0 }, G);
    s('rect', { x: 560, y: 380, width: 300, height: 60, rx: 16, fill: 'var(--amber)' }, sect);
    s('text', { x: 710, y: 418, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: 'var(--on-amber)', text: 'Secteur : 220 V · 50 Hz' }, sect);
    var g4 = s('g', {}, G), cards = K.cards(g4, [
      ['Tension <b>alternative sinusoïdale</b> : elle change de signe', 'sa courbe est une sinusoïde qui se répète.', 'var(--amber)'],
      ['<b>Période T</b> (s) et <b>fréquence f = 1 / T</b> (Hz)', 'T = nombre de divisions × balayage.', 'var(--blue)'],
      ['<b>U max</b> à l’oscilloscope, <b>U eff</b> au voltmètre', 'U eff = U max ÷ √2 ; secteur : 220 V, 50 Hz.', 'var(--green)']], [46.2, 51.2, 56.2]);
    function render(t) {
      tg.begin();
      var vis = K.group(main, t, -1, 46.2);
      if (vis) {
        var pile = t < 6.5, f = t < 20 ? 50 : t < 26 ? 50 + 50 * K.k(t, 22, 2) : 100 - 50 * K.k(t, 27, 1.5), Um = t < 34 ? 5 : 5;
        B.gbf.style.display = pile ? 'none' : ''; B.pile.style.display = pile ? '' : 'none';
        B.fd.textContent = fmt(f, 0) + ' Hz'; B.kf(Math.log(f) / Math.log(200)); B.ka(Um / 10);
        var win = 0.05, k = (t % 2.2) / 2.2;
        sc.draw(function (x) { return pile ? 4.5 : Um * Math.sin(2 * Math.PI * f * x); }, win, 2, k);
        sc.lab.textContent = 'Sensibilité 2 V/div · balayage 5 ms/div'; sc.warn.textContent = '';
        var ac = t > 34; B.md.textContent = pile ? '4,50' : ac ? fmt(Um / Math.SQRT2, 2) : '0,00'; B.mmode.textContent = ac || (!pile && t > 8) ? 'mode alternatif ~' : 'mode continu ⎓';
        if (!pile && t > 8 && t < 34) B.md.textContent = fmt(Um / Math.SQRT2, 2);
        B.mk.setAttribute('transform', 'rotate(' + (ac || (!pile && t > 8) ? 50 : -50) + ' 170 396)');
        // période
        var X = sc.X, Y0 = sc.Y0, pT = 1 / f / win * 10 * DIV, show = t > 16 && t < 29.5;
        brk.setAttribute('d', show ? 'M' + X + ' ' + (Y0 + 120) + 'v-10M' + X + ' ' + (Y0 + 115) + 'H' + (X + pT) + 'M' + (X + pT) + ' ' + (Y0 + 120) + 'v-10' : '');
        attr(brT, { x: X + pT / 2, y: Y0 + 106, text: show ? 'T = ' + fmt(pT / DIV, 0) + ' div × 5 ms = ' + fmt(1000 / f, 0) + ' ms' : '' });
        var sm = t > 31 && t < 46;
        um.setAttribute('d', sm ? K.arrow(X + DIV * 1.25, Y0, X + DIV * 1.25, Y0 - Um / 2 * DIV + 4, 2, 7, 12) : '');
        attr(umT, { x: X + DIV * 1.25 + 10, y: Y0 - Um / 2 * DIV / 2, text: sm ? 'U max = ' + fmt(Um / 2, 1) + ' div × 2 V = ' + Um + ' V' : '' });
        tg.show(t, 1, 6, 660, 34, 'Pile : une droite, la tension est continue') || tg.show(t, 7, 13.6, 660, 34, 'GBF : la tension change de signe') ||
          tg.show(t, 22, 26, 660, 34, 'f double → T est divisée par 2') || tg.show(t, 35, 40.8, 660, 34, 'Le voltmètre (~) mesure U eff') || tg.show(t, 41, 45.8, 660, 34, 'U eff = U max ÷ √2 ≈ 0,71 × U max');
      }
      sect.setAttribute('opacity', K.fade(t, 41.2, 46.4, 0.5));
      K.group(g4, t, 45.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une pile puis un générateur basse fréquence reliés à un oscilloscope et à un multimètre ; période, fréquence, tension maximale et tension efficace',
    duration: 61, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Branchons une pile sur l’oscilloscope : on voit une droite. La tension est continue, elle ne change pas.', sub: 'Avec une <b>pile</b> : une droite, la tension est <b>continue</b>.' },
      { t: 6.6, d: 7, say: 'Avec un générateur basse fréquence, la courbe monte, descend et change de signe : la tension est alternative sinusoïdale.', sub: 'Avec un <b>GBF</b> : la tension change de signe, elle est <b>alternative sinusoïdale</b>.' },
      { t: 14, d: 7.6, say: 'La courbe se répète. La durée d’un motif est la période T. Ici, quatre divisions de cinq millisecondes : vingt millisecondes.', sub: 'La durée d’un motif est la <b>période T</b> : 4 div × 5 ms = <b>20 ms</b>.' },
      { t: 22, d: 7.4, say: 'La fréquence f est le nombre de périodes par seconde : f égale un sur T. Si la fréquence double, la période est divisée par deux.', sub: '<b>f = 1 / T</b>, en hertz. Si f double, T est divisée par 2.' },
      { t: 30, d: 5, say: 'La hauteur d’une crête donne la tension maximale : ici cinq volts.', sub: 'La hauteur d’une crête donne la <b>tension maximale</b> : U max = <b>5 V</b>.' },
      { t: 35.2, d: 5.6, say: 'Le voltmètre, en mode alternatif, indique la tension efficace : trois virgule cinq volts.', sub: 'Le voltmètre en mode <b>~</b> indique la <b>tension efficace</b> : 3,5 V.' },
      { t: 41, d: 5, say: 'La tension efficace vaut la tension maximale divisée par racine de deux. Au secteur : deux cent vingt volts, cinquante hertz.', sub: '<b>U eff = U max ÷ √2</b>. Secteur : <b>220 V</b> efficaces, <b>50 Hz</b>.' },
      { t: 46, d: 4.8, say: 'À retenir : une tension alternative sinusoïdale change de signe et se répète.', sub: 'Une tension <b>alternative sinusoïdale</b> change de signe et se répète.' },
      { t: 51, d: 4.8, say: 'Elle a une période T, et une fréquence f égale à un sur T.', sub: 'Période <b>T</b>, fréquence <b>f = 1 / T</b>.' },
      { t: 56, d: 4.8, say: 'Sa tension efficace vaut sa tension maximale divisée par racine de deux.', sub: '<b>U eff = U max ÷ √2</b>.' }
    ],
    learn: [
      { t: 12, ch: 1, html: 'Pile : tension <b>continue</b> ; GBF, secteur : tension <b>alternative</b>.' },
      { t: 20, ch: 2, html: '<b>T</b> = nombre de divisions × balayage.' },
      { t: 28, ch: 2, html: '<b>f = 1 / T</b> (f en Hz, T en s).' },
      { t: 44, ch: 3, html: '<b>U eff = U max ÷ √2</b> ; secteur : 220 V, 50 Hz.' }
    ],
    question: { q: 'La période d’une tension est T = 0,02 s. Quelle est sa fréquence ?', o: ['0,02 Hz', '2 Hz', '50 Hz', '200 Hz'], a: 2, e: 'f = 1 / T = 1 / 0,02 = 50 Hz.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Un générateur basse fréquence ou une pile reliés à un multimètre et à un oscilloscope',
    steps: [
      'Compare la pile et le GBF sur l’oscilloscope : quelle tension est continue, laquelle est alternative ?',
      'Avec le GBF, règle la fréquence et l’amplitude, puis l’oscilloscope (V/div, ms/div) pour bien voir une ou deux périodes.',
      'Passe le multimètre en mode continu (⎓) puis alternatif (~) : que mesure-t-il ?',
      'Dans Mesures, lis U max et T sur l’écran, relève, et compare U max à la valeur du voltmètre.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { id: 'sim', f: 50, Um: 4, showF: true }), st = lab.st, c = api.c, rows = [];
      var cSrc = c.seg({ label: 'Source', value: 'gbf', options: [{ v: 'gbf', l: 'GBF' }, { v: 'pile', l: 'Pile 4,5 V' }], onChange: function (v) { st.src = v; vis(); } });
      var sF = c.slider({ label: 'Fréquence du GBF', min: 5, max: 200, step: 1, value: 50, unit: 'Hz', onInput: function (v) { st.f = v; } });
      var sA = c.slider({ label: 'Amplitude (bouton non gradué)', min: 0, max: 10, step: 0.1, value: 4, fmt: function (v) { return S.prof.level === 'dec' ? fmt(v, 1) + ' V' : 'à lire sur l’écran'; }, onInput: function (v) { st.Um = v; } });
      var cS = c.seg({ label: 'Oscilloscope : sensibilité', value: 2, options: [{ v: 1, l: '1 V/div' }, { v: 2, l: '2 V/div' }, { v: 5, l: '5 V/div' }], onChange: function (v) { st.sens = v; } });
      var cW = c.seg({ label: 'Oscilloscope : balayage', value: 5, options: [{ v: 1, l: '1 ms/div' }, { v: 2, l: '2 ms/div' }, { v: 5, l: '5 ms/div' }, { v: 10, l: '10 ms/div' }, { v: 20, l: '20 ms/div' }], onChange: function (v) { st.sweep = v; } });
      var cM = c.seg({ label: 'Multimètre', value: 1, options: [{ v: 0, l: 'Mode continu ⎓' }, { v: 1, l: 'Mode alternatif ~' }], onChange: function (v) { st.ac = !!v; } });
      function vis() { sF.hide(st.src !== 'gbf'); sA.hide(st.src !== 'gbf'); }
      var ro = api.readouts([{ k: 's', label: 'Source' }, { k: 'f', label: 'Fréquence (GBF)' }, { k: 'v', label: 'Voltmètre' }, { k: 'x', label: S.prof.level === 'dec' ? 'U max' : 'U max' }]);
      api.loop(function (dt) {
        lab.step(dt);
        ro.s.set(st.src === 'gbf' ? 'GBF' : 'pile'); ro.f.set(st.src === 'gbf' ? st.f + ' Hz' : '—'); ro.v.set(fmt(lab.meter(), 2) + ' V ' + (st.ac ? '~' : '⎓'));
        ro.x.set(S.prof.level === 'dec' && st.src === 'gbf' ? fmt(st.Um, 1) + ' V' : 'sur l’écran');
      });
      var M = api.measure; M.innerHTML = '<h3>Je lis l’oscilloscope</h3>';
      var rd = api.h('div', { class: 'read' }, M);
      var i1 = api.h('input', { type: 'number', step: '0.1', inputmode: 'decimal' }, api.h('label', {}, rd, 'Hauteur d’une crête (div)'));
      var i2 = api.h('input', { type: 'number', step: '0.1', inputmode: 'decimal' }, api.h('label', {}, rd, 'Durée d’une période (div)'));
      var br = api.h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px' }, M);
      var bA = api.h('button', { class: 'btn sm' }, br, 'Lire pour moi'), bR = api.h('button', { class: 'btn sm primary' }, br, 'Vérifier et relever');
      var msg = api.h('div', { class: 'msg' }, M), tb = api.h('div', { style: 'margin-top:8px' }, M);
      function truth() { return { c: st.Um / st.sens, p: (1000 / st.f) / st.sweep }; }
      bA.onclick = function () { var t = truth(); i1.value = (Math.round(t.c * 10) / 10); i2.value = (Math.round(t.p * 10) / 10); };
      function say(t, cl) { msg.className = 'msg ' + (cl || ''); msg.innerHTML = t; }
      bR.onclick = function () {
        if (st.src !== 'gbf') { say('Choisis le GBF : une tension continue n’a ni période ni crête.', 'warn'); return; }
        if (!st.ac) { say('Passe le multimètre en mode alternatif (~) pour mesurer la tension efficace.', 'warn'); return; }
        var t = truth(); if (t.c > 4.05) { say('La courbe sort de l’écran : augmente les V/div.', 'warn'); return; } if (t.p > 10) { say('Moins d’une période à l’écran : augmente les ms/div.', 'warn'); return; }
        var a = parseFloat(String(i1.value).replace(',', '.')), b = parseFloat(String(i2.value).replace(',', '.'));
        if (isNaN(a) || isNaN(b)) { say('Écris tes deux lectures en divisions (aide-toi de la loupe ×3).', 'warn'); return; }
        var tol = S.prof.level === 'exp' ? 0.2 : 0.3;
        if (Math.abs(a - t.c) > tol || Math.abs(b - t.p) > tol) { say('Lecture imprécise : ' + (Math.abs(a - t.c) > tol ? 'crête ' : '') + (Math.abs(b - t.p) > tol ? 'période ' : '') + '— 1 petit trait = 0,2 division.', 'bad'); api.sound('bad'); return; }
        var Um = a * st.sens, T = b * st.sweep, ue = lab.meter();
        rows.push({ um: Um, T: T, f: 1000 / T, ue: ue, r: Um / ue }); say('Relevé : U max = ' + fmt(Um, 1) + ' V, T = ' + fmt(T, 1) + ' ms, f = ' + fmt(1000 / T, 0) + ' Hz, U eff = ' + fmt(ue, 2) + ' V.', 'ok'); api.sound('ok'); i1.value = ''; i2.value = ''; paint(); if (rows.length >= 3) api.done();
      };
      function paint() {
        bA.style.display = S.prof.level === 'dec' ? '' : 'none'; api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>U max (V)</th><th>T (ms)</th><th>f (Hz)</th><th>U eff (V)</th><th>U max ÷ U eff</th><th></th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr><td>' + fmt(r.um, 1) + '</td><td>' + fmt(r.T, 1) + '</td><td>' + fmt(r.f, 0) + '</td><td>' + fmt(r.ue, 2) + '</td><td>' + fmt(r.r, 2) + '</td><td><button data-i="' + i + '" aria-label="Supprimer">×</button></td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure pour l’instant.</div>';
        tb.querySelectorAll('button[data-i]').forEach(function (b) { b.onclick = function () { rows.splice(+b.dataset.i, 1); paint(); }; });
        api.chart.innerHTML = '<h3>U eff en fonction de U max</h3>'; var bx = api.h('div', {}, api.chart);
        var a = S.chart(bx, { xlabel: 'U max (V)', ylabel: 'U eff (V)', xmin: 0, xmax: 10, xstep: 2, ymin: 0, ymax: 8, ystep: 2, series: [{ color: 'var(--blue)', pts: rows.map(function (r) { return [r.um, r.ue]; }), fit: true }] });
        if (a[0]) api.h('p', { style: 'font-size:13px;margin:6px 0 0' }, api.chart, 'Pente de la droite : <b>' + fmt(a[0], 2) + '</b> ≈ 1 ÷ √2 = 0,71');
      }
      paint(); vis();
      api.onReset(function () { st.src = 'gbf'; st.f = 50; st.Um = 4; st.sens = 2; st.sweep = 5; st.ac = true; cSrc.set('gbf'); sF.set(50); sA.set(4); cS.set(2); cW.set(5); cM.set(1); vis(); rows = []; paint(); });
      api.say('Compare d’abord la pile et le GBF sur l’oscilloscope.');
      return { enter: paint, bilan: function () {
        if (rows.length < 2) return '<p>Relève au moins 2 mesures avec des amplitudes différentes.</p>';
        var m = 0; rows.forEach(function (r) { m += r.r; }); m /= rows.length;
        return '<p>Rapport moyen U max ÷ U eff = <b>' + fmt(m, 2) + '</b> ≈ √2 = 1,41 : <b>U eff = U max ÷ √2</b>.</p><p>Pour chaque mesure, f = 1 / T : la fréquence lue sur l’écran correspond à celle du GBF.</p><p>En mode continu, le voltmètre indique 0 V pour une tension sinusoïdale : sa moyenne est nulle.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'GBF, multimètre et oscilloscope' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); api.loop(function (dt) { lab.step(dt); }); return lab; }
  var DEFI = {
    title: 'Le défi de l’oscilloscope',
    intro: 'Période, fréquence, tension maximale et efficace : lis l’écran plus vite que ton ombre !',
    missions: [
      { title: 'Quatre divisions', text: 'Règle le GBF pour qu’une période occupe exactement <span style="color:var(--amber)">4 divisions</span> (balayage 5 ms/div).', lumi: 'L’affichage du GBF est masqué : regarde seulement l’écran de l’oscilloscope.', hint: '4 divisions × 5 ms = 20 ms, donc f = 1 / 0,020 = 50 Hz.',
        build: function (api) { var lab = mini(api, { id: 'd1', f: 20, Um: 5, sens: 2, sweep: 5, showF: false }); api.c.slider({ label: 'Fréquence du GBF', min: 10, max: 100, step: 1, value: 20, fmt: function () { return '?'; }, onInput: function (v) { lab.st.f = v; } }); return function () { var p = 200 / lab.st.f; return Math.abs(lab.st.f - 50) <= 1 ? { ok: true, msg: 'T = 20 ms : la fréquence vaut 50 Hz.' } : { ok: false, msg: 'Une période occupe ' + fmt(p, 1) + ' divisions.' }; }; },
        e: '4 div × 5 ms/div = 20 ms ; f = 1/T = 50 Hz.' },
      { type: 'qcm', title: 'Calcul éclair', text: 'La période d’une tension vaut T = 10 ms. Sa fréquence est :', o: ['10 Hz', '100 Hz', '1 000 Hz', '0,1 Hz'], a: 1, hint: '10 ms = 0,010 s, puis f = 1 / T.', e: 'f = 1 / 0,010 = 100 Hz.' },
      { title: 'Le bon voltmètre', text: 'Règle l’amplitude pour que le voltmètre (mode ~) indique <span style="color:var(--amber)">4,24 V</span> ± 0,1 V.', lumi: 'Le voltmètre en mode alternatif affiche la tension efficace.', hint: 'U max = U eff × √2 ≈ 6 V : la crête doit monter à 3 divisions (2 V/div).',
        build: function (api) { var lab = mini(api, { id: 'd3', f: 50, Um: 2, sens: 2, sweep: 5 }); api.c.slider({ label: 'Amplitude du GBF', min: 0, max: 10, step: 0.1, value: 2, fmt: function () { return 'à lire sur l’écran'; }, onInput: function (v) { lab.st.Um = v; } }); return function () { var u = lab.meter(); return Math.abs(u - 4.24) <= 0.1 ? { ok: true, msg: 'U eff = ' + fmt(u, 2) + ' V, donc U max = ' + fmt(lab.st.Um, 1) + ' V.' } : { ok: false, msg: 'Le voltmètre indique ' + fmt(u, 2) + ' V.' }; }; },
        e: 'U eff = U max ÷ √2 : 6 V ÷ 1,41 ≈ 4,24 V.' },
      { type: 'qcm', title: 'Le secteur', text: 'La tension du secteur vaut 220 V efficaces. Sa tension maximale est d’environ :', o: ['156 V', '220 V', '311 V', '440 V'], a: 2, hint: 'U max = U eff × √2.', e: 'U max = 220 × 1,41 ≈ 311 V.' },
      { type: 'qcm', title: 'Piège du multimètre', text: 'Un voltmètre en mode continu (⎓) est branché sur une tension alternative sinusoïdale. Il indique :', o: ['U max', 'U eff', '0 V', 'la fréquence'], a: 2, hint: 'La tension est positive puis négative pendant des durées égales…', e: 'La moyenne d’une tension sinusoïdale est nulle : en mode continu on lit 0 V.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Deux tensions sinusoïdales sont représentées à l’écran. Comment comparer leurs amplitudes, périodes et fréquences ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-tension-sinusoidale', level: '4e', theme: 'Courants et tensions alternatifs', title: 'Tension alternative sinusoïdale', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une tension <b>continue</b> garde la même valeur (pile). Une tension <b>alternative</b> change de signe au cours du temps ; celle du GBF ou du secteur est <b>sinusoïdale</b>.',
      'La <b>période T</b> est la durée d’un motif (en secondes). La <b>fréquence f = 1 / T</b> est le nombre de périodes par seconde (en hertz, Hz).',
      'À l’oscilloscope : <b>T = nombre de divisions × balayage</b> ; <b>U max = nombre de divisions × sensibilité</b>.',
      'Un voltmètre en mode alternatif (~) mesure la <b>tension efficace</b> : <b>U eff = U max ÷ √2</b> (≈ 0,71 × U max).',
      'En Côte d’Ivoire, la tension du secteur vaut <b>220 V</b> (efficace) et sa fréquence <b>50 Hz</b> ; sa tension maximale est d’environ 311 V.'
    ],
    quiz: [
      { q: 'Quelle source fournit une tension continue ?', o: ['Le secteur', 'Un GBF', 'Une pile', 'Un alternateur'], a: 2, e: 'La pile donne une tension constante.' },
      { q: 'Sur l’oscilloscope (balayage 2 ms/div), une période occupe 5 divisions. T vaut :', o: ['2,5 ms', '7 ms', '10 ms', '0,4 ms'], a: 2, e: 'T = 5 × 2 = 10 ms.' },
      { q: 'Une tension a une fréquence de 25 Hz. Sa période est :', o: ['0,04 s', '25 s', '0,25 s', '4 s'], a: 0, e: 'T = 1 / f = 1 / 25 = 0,04 s.' },
      { q: 'U max = 10 V. Le voltmètre en mode ~ indique environ :', o: ['10 V', '14,1 V', '7,1 V', '5 V'], a: 2, e: 'U eff = 10 ÷ 1,41 ≈ 7,1 V.' },
      { q: 'La fréquence du secteur en Côte d’Ivoire est :', o: ['60 Hz', '50 Hz', '220 Hz', '311 Hz'], a: 1, e: 'Le secteur : 220 V, 50 Hz.' }
    ]
  });
})();

