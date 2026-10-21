/* 3e · Optique · Leçon : Les défauts de l’œil et leurs corrections */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var EX = 340, AY = 230, NEAR = 250, KC = 880; /* cristallin en x = 340 ; lentille de correction de focale 880 / C px */
  var EYE = { normal: { n: 'œil normal', L: 100, fmin: 65, c: '#3DD68C' }, myope: { n: 'œil myope', L: 125, fmin: 65, c: '#9FB2FF' }, hyper: { n: 'œil hypermétrope', L: 79, fmin: 65, c: '#FFB547' }, presbyte: { n: 'œil presbyte', L: 100, fmin: 79, c: '#FF8A80' } };
  var BEST = { normal: 0, myope: -2, hyper: 2, presbyte: 2 };
  function trace(eye, near, C, fEye) {
    var E = EYE[eye], xs = [], hs = near ? [-30, 0, 30] : [-36, 0, 36], xL1 = C ? EX - 60 : EX, xo = EX - NEAR, out = [];
    hs.forEach(function (h) {
      var x = near ? xo : 56, y = near ? 0 : h, m = near ? h / (xL1 - xo) : 0, pts = [[x, y]];
      if (C) { var f1 = KC / C; y += m * (EX - 60 - x); x = EX - 60; pts.push([x, y]); m = m - y / f1; }
      y += m * (EX - x); x = EX; pts.push([x, y]); m = m - y / fEye;
      var xr = EX + E.L, yr = y + m * (xr - x); pts.push([xr, yr]);
      var xf = Math.abs(m) > 1e-6 ? EX - y / m : Infinity; out.push({ pts: pts, yr: yr, m: m, yE: y, xf: xf });
    });
    return out;
  }
  function solve(eye, near, C, acc) {
    var E = EYE[eye], ue; /* distance objet effective pour le cristallin */
    if (!C) ue = near ? NEAR : Infinity; else { var f1 = KC / C, u1 = near ? NEAR - 60 : Infinity, v1 = isFinite(u1) ? 1 / (1 / f1 - 1 / u1) : f1; ue = 60 - v1; if (Math.abs(ue) < 1e-6) ue = 1e-6; }
    var need = 1 / (1 / E.L + (isFinite(ue) ? 1 / ue : 0)), f = acc ? Math.max(E.fmin, Math.min(100, need)) : 100;
    var v = 1 / (1 / f - (isFinite(ue) ? 1 / ue : 0));
    return { f: f, v: v, blur: v - E.L, sharp: Math.abs(v - E.L) < 2.5, ue: ue };
  }

  function Lab(G, o) {
    var st = Object.assign({ eye: 'normal', near: false, C: 0, acc: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('line', { x1: 50, x2: 530, y1: AY, y2: AY, stroke: '#2B3A57', 'stroke-width': 1.5, 'stroke-dasharray': '8 6' }, G);
    var ball = s('path', { fill: '#EEF2F8', 'fill-opacity': 0.06, stroke: '#C9D2E3', 'stroke-width': 2.5 }, G), retina = s('path', { fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, G), retT = s('text', { 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: 'rétine' }, G);
    var cornea = s('path', { fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2 }, G);
    var crist = s('path', { fill: '#9FD7FF', 'fill-opacity': 0.35, stroke: '#BFE6FF', 'stroke-width': 2 }, G); s('text', { x: EX, y: AY - 84, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: 'cristallin' }, G);
    var glass = s('g', {}, G), gl = s('path', { fill: '#FFC773', 'fill-opacity': 0.25, stroke: '#FFC773', 'stroke-width': 2.5 }, glass), glT = s('text', { x: EX - 60, y: AY + 92, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#FFC773' }, glass);
    var obj = s('g', {}, G), book = s('g', {}, obj); s('rect', { x: -10, y: -30, width: 20, height: 60, rx: 2, fill: '#EEF2F8' }, book); for (var i = 0; i < 5; i++) s('line', { x1: -6, x2: 6, y1: -20 + i * 10, y2: -20 + i * 10, stroke: '#3A3F4A', 'stroke-width': 2 }, book); var tree = s('g', {}, obj); s('rect', { x: -4, y: -6, width: 8, height: 30, fill: '#6B4526' }, tree); s('circle', { cy: -18, r: 18, fill: '#2F7D4F' }, tree);
    var objT = s('text', { 'font-size': 11.5, 'font-weight': 800, fill: '#A9B4C7' }, G);
    var RAYS = [0, 1, 2].map(function () { return [s('path', { fill: 'none', stroke: '#FFD84A', 'stroke-width': 2 }, G), s('line', { stroke: '#FFD84A', 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0.7 }, G)]; });
    var spot = s('line', { stroke: '#FF6B5E', 'stroke-width': 6, 'stroke-linecap': 'round' }, G), dot = s('circle', { r: 6, fill: '#5CFF9D' }, G), fx = s('circle', { r: 4, fill: '#FFF' }, G), fxT = s('text', { 'font-size': 11, 'font-weight': 800, fill: '#EEF2F8' }, G);
    var view = s('g', {}, G); s('rect', { x: 58, y: 330, width: 120, height: 96, rx: 12, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, view); s('text', { x: 118, y: 348, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 800, fill: '#A9B4C7', text: 'CE QUE VOIT L’ŒIL' }, view);
    var cid = 'oe' + Math.floor(Math.random() * 1e9), filt = s('filter', { id: cid, x: '-50%', y: '-50%', width: '200%', height: '200%' }, s('defs', {}, G)), blurF = s('feGaussianBlur', { stdDeviation: 0 }, filt);
    var vw = s('g', { filter: 'url(#' + cid + ')' }, view), vText = s('text', { x: 118, y: 396, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#EEF2F8' }, vw);
    var msg = s('text', { x: 300, y: 438, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, G);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pT = s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900 }, P), pS = s('text', { x: PX + 140, y: 72, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var rows = ['vision de loin', 'vision de près'].map(function (r, k) { var y = 90 + k * 50, g = s('g', {}, P), b = s('rect', { x: PX + 14, y: y, width: 252, height: 40, rx: 10, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, g); s('text', { x: PX + 28, y: y + 25, 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8', text: r }, g); var v = s('text', { x: PX + 252, y: y + 25, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 900 }, g); return { b: b, v: v }; });
    var corr = s('text', { x: PX + 140, y: 214, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#FFC773' }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 230, y2: 230, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return s('text', { x: PX + 140, y: 254 + k * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; t.setAttribute('font-weight', a[k] && a[k].charAt(0) === '•' ? 800 : 400); }); }
    var TXT = { normal: ['• Œil normal', 'L’image d’un objet lointain', 'se forme sur la rétine.', 'Pour voir de près, le cristallin', 'se bombe : c’est l’accommodation.', '', '', ''], myope: ['• Myopie', 'L’œil est trop long (trop convergent) :', 'l’image d’un objet lointain', 'se forme AVANT la rétine.', 'Il voit mal de loin, bien de près.', '• Correction :', 'lentille DIVERGENTE', '(vergence négative).'], hyper: ['• Hypermétropie', 'L’œil est trop court :', 'l’image se forme DERRIÈRE', 'la rétine ; il voit mal de près', '(et se fatigue de loin).', '• Correction :', 'lentille CONVERGENTE', '(vergence positive).'], presbyte: ['• Presbytie (avec l’âge)', 'Le cristallin perd sa souplesse :', 'il n’accommode plus assez.', 'Il voit mal de près.', '', '• Correction :', 'lentille CONVERGENTE', '(lunettes de lecture).'] };
    function step() {
      var E = EYE[st.eye], L = E.L, r = solve(st.eye, st.near, st.C, st.acc), tr = trace(st.eye, st.near, st.C, r.f);
      ball.setAttribute('d', 'M' + (EX - 18) + ' ' + (AY - 70) + ' Q' + (EX - 40) + ' ' + AY + ' ' + (EX - 18) + ' ' + (AY + 70) + ' Q' + (EX + L * 0.5) + ' ' + (AY + 96) + ' ' + (EX + L + 6) + ' ' + (AY + 40) + ' Q' + (EX + L + 18) + ' ' + AY + ' ' + (EX + L + 6) + ' ' + (AY - 40) + ' Q' + (EX + L * 0.5) + ' ' + (AY - 96) + ' ' + (EX - 18) + ' ' + (AY - 70));
      retina.setAttribute('d', 'M' + (EX + L) + ' ' + (AY - 46) + ' Q' + (EX + L + 10) + ' ' + AY + ' ' + (EX + L) + ' ' + (AY + 46)); retina.setAttribute('stroke', E.c); attr(retT, { x: EX + L + 14, y: AY - 50 });
      cornea.setAttribute('d', 'M' + (EX - 26) + ' ' + (AY - 46) + ' Q' + (EX - 44) + ' ' + AY + ' ' + (EX - 26) + ' ' + (AY + 46));
      var bulge = 8 + (100 - r.f) * 0.45; crist.setAttribute('d', 'M' + EX + ' ' + (AY - 60) + ' Q' + (EX + bulge) + ' ' + AY + ' ' + EX + ' ' + (AY + 60) + ' Q' + (EX - bulge) + ' ' + AY + ' ' + EX + ' ' + (AY - 60) + 'Z');
      glass.style.display = st.C ? '' : 'none'; var cv = st.C > 0; gl.setAttribute('d', cv ? 'M' + (EX - 60) + ' ' + (AY - 76) + ' Q' + (EX - 44) + ' ' + AY + ' ' + (EX - 60) + ' ' + (AY + 76) + ' Q' + (EX - 76) + ' ' + AY + ' ' + (EX - 60) + ' ' + (AY - 76) + 'Z' : 'M' + (EX - 72) + ' ' + (AY - 76) + ' H' + (EX - 48) + ' Q' + (EX - 58) + ' ' + AY + ' ' + (EX - 48) + ' ' + (AY + 76) + ' H' + (EX - 72) + ' Q' + (EX - 62) + ' ' + AY + ' ' + (EX - 72) + ' ' + (AY - 76) + 'Z'); glT.textContent = (cv ? 'convergente ' : 'divergente ') + (cv ? '+' : '−') + Math.abs(st.C) + ' δ';
      book.style.display = st.near ? '' : 'none'; tree.style.display = st.near ? 'none' : ''; obj.setAttribute('transform', 'translate(' + (st.near ? EX - NEAR : 64) + ' ' + AY + ')'); attr(objT, { x: st.near ? EX - NEAR - 20 : 52, y: AY + (st.near ? 50 : 44), text: st.near ? 'livre (25 cm)' : 'arbre lointain' });
      tr.forEach(function (q, k) { var d = 'M' + q.pts.map(function (p) { return p[0].toFixed(1) + ' ' + (AY + p[1]).toFixed(1); }).join(' L'); RAYS[k][0].setAttribute('d', d); var xf = q.xf, show = k !== 1 && isFinite(xf) && xf > EX + L + 1 && xf < 535; RAYS[k][1].style.display = show ? '' : 'none'; if (show) attr(RAYS[k][1], { x1: EX + L, y1: AY + q.yr, x2: xf, y2: AY }); });
      var y0 = tr[0].yr, y2 = tr[2].yr; attr(spot, { x1: EX + L + 2, x2: EX + L + 2, y1: AY + Math.min(y0, y2), y2: AY + Math.max(y0, y2) }); spot.style.display = r.sharp ? 'none' : ''; attr(dot, { cx: EX + L + 2, cy: AY }); dot.style.display = r.sharp ? '' : 'none';
      var xF = EX + r.v; attr(fx, { cx: Math.min(535, xF), cy: AY }); fx.style.display = !r.sharp && xF < 535 ? '' : 'none'; attr(fxT, { x: Math.min(520, xF) - 18, y: AY + 20, text: !r.sharp && xF < 535 ? 'image' : '' });
      blurF.setAttribute('stdDeviation', r.sharp ? 0 : Math.min(5, 1 + Math.abs(r.blur) * 0.18)); vText.textContent = st.near ? 'Aa Bb' : 'ARBRE';
      msg.textContent = r.sharp ? 'Image nette sur la rétine' + (st.near && st.acc && r.f < 99 ? ' (le cristallin accommode)' : '') : r.blur < 0 ? 'Image floue : elle se forme avant la rétine' : 'Image floue : elle se forme derrière la rétine';
      pT.textContent = E.n.charAt(0).toUpperCase() + E.n.slice(1); pT.setAttribute('fill', E.c); pS.textContent = st.C ? 'avec une lentille ' + (st.C > 0 ? 'convergente' : 'divergente') + ' de ' + (st.C > 0 ? '+' : '−') + Math.abs(st.C) + ' δ' : 'sans correction';
      [false, true].forEach(function (nr, k) { var q = solve(st.eye, nr, st.C, st.acc); rows[k].v.textContent = q.sharp ? 'nette' : 'floue'; rows[k].v.setAttribute('fill', q.sharp ? '#5CFF9D' : '#FF8A80'); rows[k].b.setAttribute('stroke', nr === st.near ? '#FFC773' : '#2B3A57'); });
      corr.textContent = st.eye === 'normal' ? 'pas besoin de correction' : 'correction conseillée : ' + (BEST[st.eye] > 0 ? 'convergente +' : 'divergente −') + Math.abs(BEST[st.eye]) + ' δ';
      pset(TXT[st.eye]);
      var both = solve(st.eye, false, st.C, st.acc).sharp && solve(st.eye, true, st.C, st.acc).sharp;
      return { sharp: r.sharp, blur: r.blur, eye: st.eye, near: st.near, C: st.C, both: both };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Pourquoi des lunettes ?' }, { t: 8, title: 'L’œil normal' }, { t: 17, title: 'La myopie' }, { t: 28, title: 'Corriger la myopie' }, { t: 35, title: 'L’hypermétropie' }, { t: 45, title: 'La presbytie' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Œil normal : image <b>sur la rétine</b>', 'le cristallin accommode pour voir de près.', '#3DD68C'],
      ['Myope : image <b>avant</b> la rétine', 'il voit mal de loin → lentille <b>divergente</b>.', '#9FB2FF'],
      ['Hypermétrope, presbyte : voient mal de près', 'correction par lentille <b>convergente</b>.', '#FFB547']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.acc = true; st.C = 0;
        if (t < 8) { st.eye = 'myope'; st.near = false; }
        else if (t < 17) { st.eye = 'normal'; st.near = t > 12.5; }
        else if (t < 28) { st.eye = 'myope'; st.near = t > 23.5; }
        else if (t < 35) { st.eye = 'myope'; st.near = false; st.C = t > 29.5 ? -2 : 0; }
        else if (t < 45) { st.eye = 'hyper'; st.near = true; st.C = t > 40 ? 2 : 0; }
        else { st.eye = 'presbyte'; st.near = true; st.C = t > 50.5 ? 2 : 0; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Pourquoi tout est flou au tableau ?') || tg.show(t, 9, 16.6, 290, 92, st.near ? 'De près : le cristallin se bombe' : 'De loin : image sur la rétine') || tg.show(t, 18, 27.6, 290, 92, st.near ? 'Myope : net de près' : 'Myope : flou de loin') ||
          tg.show(t, 29, 34.6, 290, 92, st.C ? 'Lentille divergente : net !' : 'Image avant la rétine') || tg.show(t, 36, 44.6, 290, 92, st.C ? 'Lentille convergente : net !' : 'Hypermétrope : flou de près') || tg.show(t, 46, 56.6, 290, 92, st.C ? 'Lunettes de lecture : net !' : 'Presbyte : flou de près');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un modèle d’œil avec cornée, cristallin et rétine, et les rayons venant d’un arbre lointain ou d’un livre proche ; pour l’œil normal l’image se forme sur la rétine ; pour l’œil myope, l’image d’un objet lointain se forme avant la rétine et une lentille divergente la ramène sur la rétine ; pour l’œil hypermétrope et l’œil presbyte, l’image d’un objet proche se forme derrière la rétine et une lentille convergente la rend nette',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Certains élèves voient flou ce qui est écrit au tableau et doivent porter des lunettes. Pourquoi ?', sub: 'Pourquoi des <b>lunettes</b> ?' },
      { t: 8, d: 8.6, say: 'Dans l’œil, le cristallin est une lentille convergente, et la rétine sert d’écran. Pour un œil normal, l’image d’un objet lointain se forme sur la rétine. Pour voir de près, le cristallin se bombe : c’est l’accommodation.', sub: 'Œil normal : image <b>sur la rétine</b>.' },
      { t: 17, d: 10.6, say: 'L’œil myope est trop long : l’image d’un objet lointain se forme avant la rétine. Il voit flou de loin, mais net de près.', sub: 'Myopie : image <b>avant</b> la rétine.' },
      { t: 28, d: 6.6, say: 'Une lentille divergente écarte un peu les rayons : l’image recule jusqu’à la rétine. Le myope voit net.', sub: 'Correction : lentille <b>divergente</b>.' },
      { t: 35, d: 9.6, say: 'L’œil hypermétrope est trop court : l’image d’un objet proche se forme derrière la rétine. Une lentille convergente la ramène sur la rétine.', sub: 'Hypermétropie : lentille <b>convergente</b>.' },
      { t: 45, d: 11.6, say: 'Avec l’âge, le cristallin devient moins souple : il n’accommode plus assez, et l’on voit mal de près. C’est la presbytie, corrigée par des lunettes de lecture convergentes.', sub: 'Presbytie : lunettes <b>convergentes</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : pour l’œil normal, l’image se forme sur la rétine.', sub: 'Image sur la rétine.' },
      { t: 61.8, d: 4.2, say: 'Le myope se corrige avec une lentille divergente.', sub: 'Myope : divergente.' },
      { t: 66.2, d: 4.8, say: 'L’hypermétrope et le presbyte, avec une lentille convergente.', sub: 'Hypermétrope, presbyte : convergente.' }
    ],
    learn: [
      { t: 16, ch: 1, html: 'Œil normal : image <b>sur la rétine</b> ; le cristallin <b>accommode</b> de près.' },
      { t: 34, ch: 3, html: 'Myope : image <b>avant</b> la rétine → lentille <b>divergente</b>.' },
      { t: 44, ch: 4, html: 'Hypermétrope : image <b>derrière</b> la rétine → lentille <b>convergente</b>.' },
      { t: 56, ch: 5, html: 'Presbyte : n’accommode plus → lunettes de lecture <b>convergentes</b>.' }
    ],
    question: { q: 'Un élève voit flou au tableau mais lit bien son cahier. Il est :', o: ['hypermétrope', 'myope', 'presbyte', 'normal'], a: 1, e: 'Le myope voit mal de loin.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Un modèle d’œil avec cornée, cristallin et rétine ; on choisit un œil normal, myope, hypermétrope ou presbyte, un objet lointain ou un livre proche, et la vergence d’une lentille de correction ; les rayons tracés montrent où se forme l’image, sur, avant ou derrière la rétine, et une vignette montre si la vision est nette ou floue',
    steps: [
      'Œil normal : compare la vision de loin et de près.',
      'Choisis un œil myope : où se forme l’image d’un objet lointain ?',
      'Trouve la lentille qui corrige chaque défaut.',
      'Coupe l’accommodation : que se passe-t-il de près ?'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      c.seg({ label: 'Œil', value: 'normal', options: [{ v: 'normal', l: 'normal' }, { v: 'myope', l: 'myope' }, { v: 'hyper', l: 'hypermétrope' }, { v: 'presbyte', l: 'presbyte' }], onChange: function (v) { st.eye = v; } });
      c.seg({ label: 'Objet regardé', value: 'loin', options: [{ v: 'loin', l: 'de loin (arbre)' }, { v: 'pres', l: 'de près (livre)' }], onChange: function (v) { st.near = v === 'pres'; } });
      var sC = c.slider({ label: 'Lentille de correction', min: -3, max: 3, step: 1, value: 0, unit: 'δ', dec: 0, onInput: function (v) { st.C = v; } });
      var tA = c.toggle({ label: 'Accommodation', value: true, onChange: function (v) { st.acc = v; } });
      var ro = api.readouts([{ k: 'a', label: 'Image' }, { k: 'b', label: 'Vision' }]), last = {};
      api.loop(function () { last = lab.step(); ro.a.set(last.sharp ? 'sur la rétine' : last.blur < 0 ? 'avant la rétine' : 'derrière la rétine'); ro.b.set(last.sharp ? 'nette' : 'floue'); });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { rows.push({ e: EYE[st.eye].n, o: st.near ? 'de près' : 'de loin', c: st.C ? (st.C > 0 ? '+' : '−') + Math.abs(st.C) + ' δ' : 'aucune', v: last.sharp ? 'nette' : 'floue (' + (last.blur < 0 ? 'avant' : 'derrière') + ')' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Œil</th><th>Objet</th><th>Correction</th><th>Vision</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td><td>' + r.c + '</td><td>' + r.v + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Défauts et corrections</h3><table class="mt"><thead><tr><th>Défaut</th><th>Image</th><th>Voit mal</th><th>Correction</th></tr></thead><tbody><tr><td>myopie</td><td>avant la rétine</td><td>de loin</td><td>divergente</td></tr><tr><td>hypermétropie</td><td>derrière la rétine</td><td>de près</td><td>convergente</td></tr><tr><td>presbytie</td><td>derrière (de près)</td><td>de près</td><td>convergente</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { eye: 'normal', near: false, C: 0, acc: true }); sC.set(0); tA.set(true); rows = []; paint(); });
      api.say('Compare la vision de loin et de près de l’œil normal.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>L’œil se modélise par une lentille convergente (le <b>cristallin</b>) et un écran (la <b>rétine</b>). Pour un œil normal, l’image d’un objet lointain se forme sur la rétine ; pour voir de près, le cristallin se bombe : c’est l’<b>accommodation</b>.</p><p>L’œil <b>myope</b> (trop long) forme l’image d’un objet lointain <b>avant</b> la rétine : il voit mal de loin ; on le corrige avec une lentille <b>divergente</b>. L’œil <b>hypermétrope</b> (trop court) forme l’image <b>derrière</b> la rétine : il voit mal de près ; on le corrige avec une lentille <b>convergente</b>.</p><p>La <b>presbytie</b>, liée à l’âge, est la perte de l’accommodation : on voit mal de près ; on la corrige avec des lentilles <b>convergentes</b> (lunettes de lecture).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Défauts de l’œil' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function corrector(api, lab) { api.c.slider({ label: 'Lentille de correction', min: -3, max: 3, step: 1, value: 0, unit: 'δ', dec: 0, onInput: function (v) { lab.st.C = v; } }); }
  var DEFI = {
    title: 'Le défi de l’opticien',
    intro: 'Chaque patient repart avec des lunettes parfaites !',
    missions: [
      { title: 'Le tableau', text: 'Koffi est <b>myope</b>. Trouve la lentille qui lui fait voir <b>net de loin</b>.', lumi: 'Il faut écarter un peu les rayons.', hint: 'Une vergence négative.',
        build: function (api) { var lab = mini(api, { eye: 'myope' }); corrector(api, lab); return function () { var r = lab.res(); return r.sharp ? { ok: true, msg: 'Lentille divergente ' + r.C + ' δ : net de loin.' } : { ok: false, msg: r.blur < 0 ? 'L’image est encore avant la rétine.' : 'Trop corrigé : l’image passe derrière.' }; }; },
        e: 'La myopie se corrige avec une lentille divergente.' },
      { title: 'La lecture', text: 'Grand-mère est <b>presbyte</b>. Fais-lui lire son livre <b>nettement</b>.', lumi: 'Lunettes de lecture…', hint: 'Une vergence positive.',
        build: function (api) { var lab = mini(api, { eye: 'presbyte', near: true }); corrector(api, lab); return function () { var r = lab.res(); return r.sharp ? { ok: true, msg: 'Lentille convergente +' + r.C + ' δ : elle lit !' } : { ok: false, msg: 'Le livre est encore flou.' }; }; },
        e: 'La presbytie se corrige avec une lentille convergente.' },
      { type: 'qcm', title: 'Où est l’image ?', text: 'Chez un hypermétrope qui regarde de près, l’image se forme :', o: ['sur la rétine', 'avant la rétine', 'derrière la rétine', 'sur le cristallin'], a: 2, hint: 'L’œil est trop court.', e: 'Derrière la rétine.' },
      { title: 'Œil hypermétrope', text: 'Corrige l’œil <b>hypermétrope</b> pour qu’il voie net <b>de près ET de loin</b>.', lumi: 'Une seule lentille pour les deux.', hint: '+2 δ.',
        build: function (api) { var lab = mini(api, { eye: 'hyper', near: true }); corrector(api, lab); api.c.seg({ label: 'Objet', value: 'pres', options: [{ v: 'loin', l: 'de loin' }, { v: 'pres', l: 'de près' }], onChange: function (v) { lab.st.near = v === 'pres'; } }); return function () { var r = lab.res(); return r.both ? { ok: true, msg: 'Net de loin et de près avec +' + r.C + ' δ.' } : { ok: false, msg: 'Une des deux visions est encore floue.' }; }; },
        e: 'L’hypermétropie se corrige avec une lentille convergente.' },
      { type: 'qcm', title: 'L’accommodation', text: 'Pour voir un objet proche, le cristallin d’un œil normal :', o: ['s’aplatit', 'se bombe', 'recule', 'disparaît'], a: 1, hint: 'Il devient plus convergent.', e: 'Il se bombe : c’est l’accommodation.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Une personne voit certains objets flous. Comment la position de l’image dans le modèle de l’œil peut-elle expliquer ce défaut et guider sa correction ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '3e-defauts-oeil', level: '3e', theme: 'Optique', title: 'Les défauts de l’œil et leurs corrections', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'L’œil peut être modélisé par une <b>lentille convergente</b> (le cristallin) et un <b>écran</b> (la rétine).',
      'Œil normal : l’image d’un objet lointain se forme <b>sur la rétine</b>. Pour voir de près, le cristallin se bombe : c’est l’<b>accommodation</b>.',
      '<b>Myopie</b> : l’œil est trop long, l’image d’un objet lointain se forme <b>avant</b> la rétine ; le myope voit mal de loin. Correction : lentille <b>divergente</b>.',
      '<b>Hypermétropie</b> : l’œil est trop court, l’image se forme <b>derrière</b> la rétine ; il voit mal de près. Correction : lentille <b>convergente</b>.',
      '<b>Presbytie</b> : avec l’âge, le cristallin accommode moins ; on voit mal de près. Correction : lentille <b>convergente</b> (lunettes de lecture).'
    ],
    quiz: [
      { q: 'Dans l’œil, le rôle de l’écran est joué par :', o: ['la cornée', 'le cristallin', 'la rétine', 'la pupille'], a: 2, e: 'La rétine joue le rôle d’écran : l’image s’y forme, puis le nerf optique la transmet au cerveau.' },
      { q: 'Un œil myope forme l’image d’un objet lointain :', o: ['sur la rétine', 'avant la rétine', 'derrière la rétine', 'nulle part'], a: 1, e: 'L’œil myope est trop convergent : l’image d’un objet lointain se forme avant la rétine et paraît floue.' },
      { q: 'La myopie se corrige avec une lentille :', o: ['convergente', 'divergente', 'plane', 'colorée'], a: 1, e: 'Une lentille divergente éloigne le point de convergence des rayons : l’image se forme alors sur la rétine.' },
      { q: 'Les lunettes de lecture d’un presbyte sont :', o: ['divergentes', 'convergentes', 'teintées', 'sans vergence'], a: 1, e: 'Le presbyte voit mal de près : une lentille convergente aide son cristallin à faire converger les rayons sur la rétine.' },
      { q: 'L’accommodation est :', o: ['le changement de la pupille', 'la déformation du cristallin pour voir de près', 'la fatigue de l’œil', 'le port de lunettes'], a: 1, e: 'Le cristallin se bombe.' }
    ]
  });
})();

