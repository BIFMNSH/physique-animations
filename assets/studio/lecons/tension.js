/* 5e · Mesure de grandeurs physiques · Leçon : Tension électrique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729', U = 6, R1 = 20, R2 = 40, UN = 6;
  /* points de mesure : [borne rouge (côté où entre le courant), borne COM] */
  var PTS = {
    serie: { G: { r: [343, 380], k: [227, 380], n: 'générateur' }, L1: { r: [208, 120], k: [152, 120], n: 'lampe L1' }, K: { r: [318, 120], k: [252, 120], n: 'interrupteur K' }, L2: { r: [418, 120], k: [362, 120], n: 'lampe L2' }, F: { r: [470, 320], k: [470, 180], n: 'un fil de connexion' } },
    der: { G: { r: [223, 400], k: [127, 400], n: 'générateur' }, K: { r: [200, 110], k: [140, 110], n: 'interrupteur K' }, L1: { r: [280, 290], k: [280, 220], n: 'lampe L1' }, L2: { r: [420, 290], k: [420, 220], n: 'lampe L2' } }
  };
  function solve(st) {
    var o = {}, cl = st.closed && !st.wrong;
    if (st.mode === 'serie') { var I = cl ? U / (R1 + R2) : 0; o = { G: U, L1: I * R1, L2: I * R2, K: st.closed ? 0 : U, F: 0 }; if (st.wrong) { o.K = 0; } }
    else o = { G: U, L1: cl ? U : 0, L2: cl ? U : 0, K: st.closed ? 0 : U };
    return o;
  }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'serie', el: 'G', cal: 'V20', rev: false, wrong: false, closed: true, meter: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 50, width: 500, height: 396, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), key = '', P = null;
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild); P = { w: [], L: [] };
      if (st.mode === 'serie') {
        P.w.push(E.wire(C, 'M333 380 H470 V120 H100 V380 H237'));
        s('rect', { x: 244, y: 104, width: 82, height: 26, fill: BG }, C);
        P.K = E.switchK(C, 255, 120, 315, { closed: st.closed, onToggle: function (c) { st.closed = c; } });
        P.L.push(E.lamp(C, 180, 120, { r: 22 })); P.L.push(E.lamp(C, 390, 120, { r: 22 }));
        s('text', { x: 180, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L1' }, C); s('text', { x: 390, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L2' }, C);
        P.bat = E.battery(C, 285, 380, { U: U });
        P.gap = s('g', {}, C); s('rect', { x: 461, y: 228, width: 18, height: 44, fill: BG }, P.gap); E.dot(P.gap, 470, 228); E.dot(P.gap, 470, 272);
      } else {
        P.w.push(E.wire(C, 'M223 400 H420 M420 400 V110 M280 400 V110 M420 110 H100 V400 H127'));
        s('rect', { x: 130, y: 94, width: 80, height: 26, fill: BG }, C);
        P.K = E.switchK(C, 140, 110, 200, { closed: st.closed, onToggle: function (c) { st.closed = c; } });
        P.L.push(E.lamp(C, 280, 255, { r: 22 })); P.L.push(E.lamp(C, 420, 255, { r: 22 }));
        [[280, 110], [280, 400], [420, 110], [420, 400]].forEach(function (p) { E.dot(C, p[0], p[1]); });
        s('text', { x: 316, y: 261, 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L1' }, C); s('text', { x: 456, y: 261, 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L2' }, C);
        P.bat = E.battery(C, 175, 400, { U: U });
        P.gap = s('g', {}, C);
      }
      P.info = s('text', { x: st.mode === 'serie' ? 290 : 340, y: 434, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, C);
    }
    var MM = E.multimeter(G, 700, 40, { cal: st.cal, onDial: function (k) { st.cal = k; o.onDial && o.onDial(k); } });
    var LG = s('g', {}, G), red = E.lead(LG, '#FF5A4E'), blk = E.lead(LG, '#2A2F38');
    var mk = s('g', {}, G), mkR = s('rect', { rx: 10, fill: 'none', stroke: '#4FC3FF', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, mk);
    var warn = s('g', {}, G), wr = s('rect', { x: 110, y: 64, width: 360, height: 34, rx: 17, fill: '#FF5A4E' }, warn), wt = s('text', { x: 290, y: 86, 'text-anchor': 'middle', 'font-size': 13.5, 'font-weight': 900, fill: '#2A0805' }, warn);
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000;
      if (st.mode !== key) { key = st.mode; build(); if (!PTS[st.mode][st.el]) st.el = 'G'; }
      MM.set(st.cal); P.K.set(st.closed);
      var c = E.CALS.filter(function (x) { return x.k === st.cal; })[0], sc = st.meter && c.ty === 'A' && !st.wrong;
      var V = solve(st);
      if (sc) { if (st.el === 'L1' || st.el === 'L2') { V[st.el] = 0; } }
      var lit1 = st.mode === 'serie' ? V.L1 : V.L1, lit2 = V.L2;
      if (sc && st.el === 'G') { lit1 = lit2 = 0; }
      P.L[0].set(E.lampState(sc && st.el === 'L1' ? 0 : lit1, UN).b); P.L[1].set(E.lampState(sc && st.el === 'L2' ? 0 : lit2, UN).b);
      var flowing = (lit1 > 0.3 || lit2 > 0.3) || (sc && st.el !== 'K');
      P.w.forEach(function (w) { w.flow(flowing ? (sc ? 1.6 : 0.8) : 0, T); });
      P.gap.style.display = st.wrong && st.mode === 'serie' ? '' : 'none';
      var p = st.wrong && st.mode === 'serie' ? { r: [470, 272], k: [470, 228] } : PTS[st.mode][st.el];
      var a = { x: p.r[0], y: p.r[1] }, b = { x: p.k[0], y: p.k[1] }; if (st.rev) { var tmp = a; a = b; b = tmp; }
      var sockR = c.k === 'A10' ? MM.sock['10A'] : c.ty === 'A' ? MM.sock.mA : MM.sock.V;
      red.show(st.meter); blk.show(st.meter); MM.g.style.display = st.meter ? '' : 'none'; mk.style.display = st.meter && !st.wrong ? '' : 'none';
      if (st.meter) { red.set(sockR, a); blk.set(MM.sock.COM, b); var x0 = Math.min(p.r[0], p.k[0]), x1 = Math.max(p.r[0], p.k[0]), y0 = Math.min(p.r[1], p.k[1]), y1 = Math.max(p.r[1], p.k[1]); attr(mkR, { x: x0 - 16, y: y0 - 34, width: x1 - x0 + 32, height: y1 - y0 + 68 }); }
      var val = st.wrong && st.mode === 'serie' ? U * 0.999 : V[st.el];
      var M = st.meter ? MM.show((st.rev ? -1 : 1) * val, sc ? 'A' : 'V') : { st: 'off' };
      if (sc) M = { st: 'sc' };
      warn.style.display = sc || st.wrong ? '' : 'none'; wt.textContent = sc ? 'Calibre ampère en dérivation : COURT-CIRCUIT !' : 'Voltmètre en série : les lampes s’éteignent';
      P.info.textContent = !st.meter ? '' : M.st === 'off' ? 'Multimètre éteint : tourne le sélecteur.' : M.st === 'sc' ? 'Choisis un calibre en volts (V).' : M.st === 'wrongmode' ? 'Choisis un calibre en volts (V).' : M.st === 'over' ? 'Affichage « 1 » : calibre trop petit !' : 'U(' + (st.wrong ? 'voltmètre en série' : st.el) + ') = ' + M.txt + (st.rev ? ' (fils inversés)' : '');
      return { V: V, M: M, el: st.el, mode: st.mode, rev: st.rev, wrong: st.wrong, closed: st.closed, cal: st.cal };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La tension électrique' }, { t: 12, title: 'Aux bornes des lampes' }, { t: 25, title: 'Interrupteur et fil' }, { t: 38, title: 'L’additivité en série' }, { t: 48, title: 'En dérivation' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La tension U se mesure en <b>volts (V)</b>', 'avec un <b>voltmètre</b> branché <b>en dérivation</b> (COM côté −).', 'var(--blue)'],
      ['En série : <b>U = U<sub>1</sub> + U<sub>2</sub></b>', 'la tension du générateur se partage entre les récepteurs.', '#FFB547'],
      ['En dérivation : <b>U<sub>1</sub> = U<sub>2</sub> = U</b>', 'chaque branche reçoit la tension du générateur.', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.rev = false; st.wrong = false; st.cal = 'V20'; st.meter = t > 4;
        if (t < 25) { st.mode = 'serie'; st.closed = true; st.el = t < 12 ? 'G' : t < 18.6 ? 'L1' : 'L2'; }
        else if (t < 38) { st.mode = 'serie'; st.el = t < 29 ? 'K' : t < 33 ? 'F' : 'K'; st.closed = t < 33; }
        else if (t < 48) { st.mode = 'serie'; st.closed = true; st.el = t < 41.4 ? 'G' : t < 44.6 ? 'L1' : 'L2'; }
        else { st.mode = 'der'; st.closed = true; st.el = t < 51.4 ? 'G' : t < 54.6 ? 'L1' : 'L2'; }
        lab.step();
        tg.show(t, 5, 11.6, 290, 92, 'Aux bornes du générateur : 6 V') || tg.show(t, 13, 24.6, 290, 92, 'U(L1) = 2 V · U(L2) = 4 V') || tg.show(t, 25.4, 28.8, 290, 92, 'Interrupteur fermé : 0 V') || tg.show(t, 29.2, 32.8, 290, 92, 'Un fil : 0 V') ||
          tg.show(t, 33.2, 37.6, 290, 92, 'Interrupteur ouvert : 6 V !') || tg.show(t, 39, 47.6, 290, 92, '2 V + 4 V = 6 V') || tg.show(t, 49, 57.6, 340, 92, 'U(L1) = U(L2) = U(G) = 6 V');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un multimètre utilisé en voltmètre mesure la tension aux bornes du générateur, des lampes, de l’interrupteur et d’un fil dans un circuit en série, puis aux bornes des lampes d’un circuit en dérivation',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'Un générateur possède une tension électrique entre ses bornes.', sub: 'Un générateur a une <b>tension</b> entre ses bornes.' },
      { t: 4.6, d: 7.2, say: 'Elle se mesure en volts, avec un voltmètre branché en dérivation : directement aux bornes, sans ouvrir le circuit. Ici, six volts.', sub: 'Unité : le <b>volt</b>. Voltmètre <b>en dérivation</b> : 6 V.' },
      { t: 12, d: 6.4, say: 'Mesurons aux bornes de la lampe L un : deux volts.', sub: 'Aux bornes de L1 : <b>2 V</b>.' },
      { t: 18.6, d: 6.2, say: 'Aux bornes de la lampe L deux : quatre volts.', sub: 'Aux bornes de L2 : <b>4 V</b>.' },
      { t: 25, d: 3.8, say: 'Aux bornes de l’interrupteur fermé : zéro volt.', sub: 'Interrupteur fermé : <b>0 V</b>.' },
      { t: 29, d: 4, say: 'Aux bornes d’un fil de connexion : zéro volt aussi.', sub: 'Un fil : <b>0 V</b>.' },
      { t: 33.2, d: 4.6, say: 'Mais si on ouvre l’interrupteur, on mesure six volts à ses bornes !', sub: 'Interrupteur <b>ouvert</b> : 6 V à ses bornes !' },
      { t: 38, d: 9.6, say: 'Revenons au circuit fermé : deux volts plus quatre volts, cela fait six volts, la tension du générateur. En série, les tensions s’additionnent.', sub: '2 + 4 = 6 V : en série, les tensions <b>s’additionnent</b>.' },
      { t: 48, d: 9.6, say: 'En dérivation, la tension aux bornes de chaque lampe est la même : six volts, comme le générateur.', sub: 'En dérivation, <b>même tension</b> pour chaque branche.' },
      { t: 58, d: 4.4, say: 'À retenir : la tension se mesure en volts, avec un voltmètre en dérivation.', sub: 'Voltmètre <b>en dérivation</b>, unité : <b>volt</b>.' },
      { t: 62.6, d: 4.2, say: 'En série, la tension du générateur est la somme des tensions des récepteurs.', sub: 'Série : <b>U = U₁ + U₂</b>.' },
      { t: 67, d: 5, say: 'En dérivation, tous les dipôles ont la même tension.', sub: 'Dérivation : <b>U₁ = U₂ = U</b>.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'Tension U en <b>volts</b> ; voltmètre <b>en dérivation</b>.' },
      { t: 37, ch: 2, html: 'Fil ou interrupteur fermé : <b>0 V</b> ; interrupteur ouvert : U du générateur.' },
      { t: 47, ch: 3, html: 'Série : <b>U = U<sub>1</sub> + U<sub>2</sub></b>.' },
      { t: 57, ch: 4, html: 'Dérivation : <b>U<sub>1</sub> = U<sub>2</sub> = U</b>.' }
    ],
    question: { q: 'Un voltmètre se branche :', o: ['en série', 'en dérivation', 'à la place du fil', 'uniquement sur le générateur'], a: 1, e: 'Ses bornes sont reliées aux deux bornes du dipôle étudié.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Circuit', r: [40, 50, 500, 396] }, { n: 'Multimètre', r: [575, 25, 285, 410] }],
    alt: 'Circuit avec un générateur 6 V, un interrupteur et deux lampes en série ou en dérivation ; un multimètre en voltmètre est relié par des cordons aux bornes du dipôle choisi',
    steps: [
      'Mesure la tension aux bornes du générateur, puis de chaque lampe.',
      'Mesure aux bornes de l’interrupteur (ouvert, puis fermé) et d’un fil.',
      'Vérifie la loi d’additivité en série, puis l’égalité des tensions en dérivation.',
      'Teste les erreurs (fils inversés, voltmètre en série) et relève tes mesures.'
    ],
    build: function (api) {
      var cE1, cE2, cC;
      var lab = Lab(api.g, { onDial: function (k) { api.sound('tick'); cC && cC.set(k); } }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Montage', value: 'serie', options: [{ v: 'serie', l: 'Lampes en série' }, { v: 'der', l: 'Lampes en dérivation' }], onChange: function (v) { st.mode = v; st.el = 'G'; st.wrong = false; vis(); } });
      cE1 = c.seg({ label: 'Mesurer aux bornes de…', value: 'G', options: [{ v: 'G', l: 'générateur' }, { v: 'L1', l: 'L1' }, { v: 'L2', l: 'L2' }, { v: 'K', l: 'interrupteur' }, { v: 'F', l: 'un fil' }], onChange: function (v) { st.el = v; st.wrong = false; } });
      cE2 = c.seg({ label: 'Mesurer aux bornes de…', value: 'G', options: [{ v: 'G', l: 'générateur' }, { v: 'L1', l: 'L1' }, { v: 'L2', l: 'L2' }, { v: 'K', l: 'interrupteur' }], onChange: function (v) { st.el = v; } });
      cC = c.seg({ label: 'Calibre', value: 'V20', options: E.CALS.map(function (x) { return { v: x.k, l: x.l }; }), onChange: function (v) { st.cal = v; } });
      var tK = c.toggle({ label: 'Interrupteur fermé', value: true, onChange: function (v) { st.closed = v; } });
      var tR = c.toggle({ label: 'Inverser les fils', value: false, onChange: function (v) { st.rev = v; } });
      var tW = c.toggle({ label: 'Erreur : voltmètre en série', value: false, onChange: function (v) { st.wrong = v; } });
      function vis() { cE1.hide(st.mode !== 'serie'); cE2.hide(st.mode === 'serie'); tW.hide(st.mode !== 'serie'); }
      vis();
      var ro = api.readouts([{ k: 'e', label: 'Aux bornes de' }, { k: 'c', label: 'Calibre' }, { k: 'u', label: 'Mesure' }]);
      var last = {};
      api.loop(function () { last = lab.step(); tK.set(st.closed); ro.e.set(st.wrong ? 'en série !' : PTS[st.mode][st.el].n); ro.c.set(E.CALS.filter(function (x) { return x.k === st.cal; })[0].l); ro.u.set(last.M.st === 'ok' ? last.M.txt : last.M.st === 'over' ? '« 1 » (trop petit)' : '—'); });
      var M = api.measure; M.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (last.M.st !== 'ok') { api.say('Lis d’abord une valeur correcte à l’écran.'); return; } rows.push({ m: (st.mode === 'serie' ? 'série' : 'dérivation') + (st.closed ? '' : ', K ouvert'), e: st.wrong ? 'voltmètre en série' : PTS[st.mode][st.el].n, u: last.M.txt }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Circuit</th><th>Aux bornes de</th><th>Tension</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.m + '</td><td>' + r.e + '</td><td>' + r.u + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>';
        api.chart.innerHTML = '<h3>Les deux lois</h3><table class="mt"><tbody><tr><td>Série</td><td>U<sub>G</sub> = U<sub>L1</sub> + U<sub>L2</sub> (6 = 2 + 4)</td></tr><tr><td>Dérivation</td><td>U<sub>L1</sub> = U<sub>L2</sub> = U<sub>G</sub> (6 V)</td></tr><tr><td>Fil, K fermé</td><td>0 V</td></tr><tr><td>K ouvert</td><td>U<sub>K</sub> = U<sub>G</sub></td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'serie'; st.el = 'G'; st.cal = 'V20'; st.rev = false; st.wrong = false; st.closed = true; cM.set('serie'); cE1.set('G'); cE2.set('G'); cC.set('V20'); tR.set(false); tW.set(false); vis(); rows = []; paint(); });
      api.say('Mesure la tension du générateur, puis celle de chaque lampe.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 mesures correctes.</p>';
        return '<p>La tension électrique se note <b>U</b> et s’exprime en <b>volts (V)</b>. On la mesure avec un <b>voltmètre</b> branché <b>en dérivation</b> aux bornes du dipôle : borne V du côté de la borne + du générateur, borne COM du côté de la borne −.</p><p>La tension aux bornes d’un fil ou d’un interrupteur fermé est nulle ; aux bornes d’un interrupteur ouvert, elle est égale à celle du générateur.</p><p><b>En série</b> : U = U<sub>1</sub> + U<sub>2</sub> (6 V = 2 V + 4 V). <b>En dérivation</b> : U<sub>1</sub> = U<sub>2</sub> = U (6 V).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit avec un voltmètre' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function elSeg(api, lab, list) { api.c.seg({ label: 'Aux bornes de…', value: lab.st.el, options: list.map(function (k) { return { v: k, l: { G: 'générateur', L1: 'L1', L2: 'L2', K: 'interrupteur', F: 'un fil' }[k] }; }), onChange: function (v) { lab.st.el = v; } }); }
  var DEFI = {
    title: 'Le défi du voltmètre',
    intro: 'Des volts, partout ? Mesure, compare et trouve les pièges !',
    missions: [
      { title: 'Le générateur', text: 'Mesure la tension aux bornes du <span style="color:var(--amber)">générateur</span>. Règle le multimètre (clique sur le sélecteur).', lumi: 'Il faut un calibre en volts plus grand que la tension.', hint: 'Calibre 20 V.',
        build: function (api) { var lab = mini(api, { el: 'L1', cal: 'OFF' }); elSeg(api, lab, ['G', 'L1', 'L2']); return function () { var r = lab.res(); return r.el === 'G' && r.M.st === 'ok' ? { ok: true, msg: 'U = ' + r.M.txt + ' aux bornes du générateur.' } : { ok: false, msg: r.el !== 'G' ? 'Les cordons ne sont pas sur le générateur.' : 'Pas de mesure correcte : vérifie le calibre.' }; }; },
        e: 'Calibre 20 V, voltmètre aux bornes du générateur : 6 V.' },
      { type: 'qcm', title: 'Branchement', text: 'Pour mesurer la tension aux bornes d’une lampe, on branche le voltmètre :', o: ['en série avec la lampe', 'en dérivation aux bornes de la lampe', 'à la place de la lampe', 'sur le générateur'], a: 1, hint: 'On ne coupe pas le circuit.', e: 'Le voltmètre se branche en dérivation.' },
      { title: 'Le piège', text: 'Le circuit est <b>ouvert</b>. Trouve l’élément (autre que le générateur) aux bornes duquel on mesure <span style="color:var(--amber)">6 V</span>.', lumi: 'Les lampes ne reçoivent plus rien…', hint: 'L’interrupteur ouvert !',
        build: function (api) { var lab = mini(api, { closed: false, el: 'L1' }); elSeg(api, lab, ['L1', 'L2', 'K', 'F']); return function () { var r = lab.res(); return r.el === 'K' && r.M.st === 'ok' ? { ok: true, msg: 'Interrupteur ouvert : 6 V à ses bornes !' } : { ok: false, msg: r.M.st === 'ok' ? 'Ici, U = ' + r.M.txt + '.' : 'Pas de mesure.' }; }; },
        e: 'Aux bornes d’un interrupteur ouvert, la tension est celle du générateur.' },
      { type: 'qcm', title: 'Additivité', text: 'En série : U(générateur) = 9 V et U(L1) = 3,5 V. Alors U(L2) vaut :', o: ['12,5 V', '5,5 V', '3,5 V', '9 V'], a: 1, hint: 'U = U₁ + U₂.', e: 'U₂ = 9 − 3,5 = 5,5 V.' },
      { title: 'En dérivation', text: 'Dans le circuit en dérivation, mesure la tension aux bornes de <span style="color:#3DD68C">L2</span>.', lumi: 'Compare avec celle du générateur.', hint: 'Choisis L2, calibre 20 V.',
        build: function (api) { var lab = mini(api, { mode: 'der', el: 'G', cal: 'V2' }); elSeg(api, lab, ['G', 'L1', 'L2']); return function () { var r = lab.res(); return r.el === 'L2' && r.M.st === 'ok' ? { ok: true, msg: 'U(L2) = ' + r.M.txt + ', comme le générateur.' } : { ok: false, msg: r.el !== 'L2' ? 'Mesure aux bornes de L2.' : 'Écran « 1 » : change de calibre.' }; }; },
        e: 'En dérivation, chaque lampe a la même tension que le générateur.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On mesure des tensions aux bornes des dipôles d’un circuit. Quelles relations prévoir selon leur association ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-tension', level: '5e', theme: 'Mesure de grandeurs physiques', title: 'Tension électrique', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'La tension électrique se note <b>U</b> ; son unité est le <b>volt</b> (V). On utilise aussi le millivolt : 1 V = 1 000 mV.',
      'On la mesure avec un <b>voltmètre</b> (multimètre en position V) branché <b>en dérivation</b> aux bornes du dipôle : borne V du côté de la borne + du générateur, borne COM du côté de la borne −.',
      'La tension aux bornes d’un fil de connexion ou d’un interrupteur fermé est <b>nulle</b> ; aux bornes d’un interrupteur ouvert, elle est égale à la tension du générateur.',
      '<b>En série</b>, la tension aux bornes du générateur est égale à la <b>somme</b> des tensions aux bornes des récepteurs : U = U<sub>1</sub> + U<sub>2</sub>.',
      '<b>En dérivation</b>, les tensions aux bornes des dipôles sont <b>égales</b> : U<sub>1</sub> = U<sub>2</sub> = U.'
    ],
    quiz: [
      { q: 'L’unité de la tension est :', o: ['l’ampère', 'le volt', 'le watt', 'le joule'], a: 1, e: 'Symbole V.' },
      { q: 'Aux bornes d’un fil de connexion, la tension est :', o: ['égale à celle du générateur', 'nulle', 'très grande', 'négative'], a: 1, e: 'Un fil n’a (presque) pas de tension à ses bornes.' },
      { q: 'En série, U(G) = 12 V, U(L1) = 4 V. U(L2) = ?', o: ['16 V', '8 V', '4 V', '12 V'], a: 1, e: '12 − 4 = 8 V.' },
      { q: 'En dérivation, U(G) = 4,5 V. Aux bornes de chaque lampe :', o: ['2,25 V', '4,5 V', '9 V', '0 V'], a: 1, e: 'Les tensions sont égales en dérivation.' },
      { q: 'Le voltmètre affiche −6,00 V. Cela signifie :', o: ['la pile est vide', 'les fils sont inversés', 'le calibre est trop petit', 'il y a un court-circuit'], a: 1, e: 'La borne COM est du côté +.' }
    ]
  });
})();

