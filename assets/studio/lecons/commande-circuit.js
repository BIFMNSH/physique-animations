/* 6e · Électricité · Leçon : Commande d’un circuit électrique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729';
  function lit(st) {
    if (st.mode === 'simple') return st.btn === 'poussoir' ? st.press : st.k1;
    if (st.mode === 'serie') return st.k1 && st.k2;
    if (st.mode === 'der') return st.k1 || st.k2;
    return st.v1 === st.v2;
  }
  function Lab(G, o) {
    var st = Object.assign({ mode: 'simple', btn: 'inter', k1: false, k2: false, press: false, v1: 'a', v2: 'b', seen: {}, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), key = '', P = null;
    function tog() { o.onTog && o.onTog(); }
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild); P = { w: [], b1: [], b2: [] };
      var m = st.mode, cab = function (a, da, b, db, k) { return E.cable(C, a, da, b, db, k ? { k: k } : undefined); };
      var sw = function (x1, y, label, key) { return E.switchK(C, x1, y, x1 + 60, { label: label, onToggle: function (c) { st[key] = c; tog(); } }); };
      if (m === 'simple') {
        var K = st.btn === 'poussoir' ? E.poussoir(C, 140, 170, 200, { label: 'bouton-poussoir', onDown: function () { st.press = true; tog(); }, onUp: function () { st.press = false; } }) : sw(140, 170, 'interrupteur', 'k1');
        if (st.btn === 'poussoir') P.push = K; else P.K1 = K;
        P.L = E.lamp(C, 400, 170, { r: 24 });
        P.w.push(cab([338, 360], 1, [424, 170], 1), cab([376, 170], -1, [200, 170], 1), cab([140, 170], -1, [242, 360], -1));
      } else if (m === 'serie') {
        P.K1 = sw(110, 170, 'K1', 'k1'); P.L = E.lamp(C, 290, 170, { r: 24 }); P.K2 = sw(410, 170, 'K2', 'k2');
        P.w.push(cab([338, 360], 1, [470, 170], 1), cab([410, 170], -1, [314, 170], 1), cab([266, 170], -1, [170, 170], 1), cab([110, 170], -1, [242, 360], -1));
      } else if (m === 'der') {
        P.K1 = sw(120, 120, 'K1', 'k1'); P.K2 = sw(120, 230, 'K2', 'k2'); P.L = E.lamp(C, 400, 175, { r: 24 });
        P.b1.push(cab([180, 120], 1, [376, 175], -1), cab([120, 120], -1, [120, 230], -1)); P.b2.push(cab([180, 230], 1, [376, 175], -1));
        P.w.push(cab([120, 230], -1, [242, 360], -1), cab([338, 360], 1, [424, 175], 1));
      } else {
        P.V1 = E.vav(C, 140, 190, { label: 'en bas de l’escalier', onToggle: function () { st.v1 = st.v1 === 'a' ? 'b' : 'a'; tog(); } });
        P.V2 = E.vav(C, 440, 190, { flip: true, label: 'en haut de l’escalier', onToggle: function () { st.v2 = st.v2 === 'a' ? 'b' : 'a'; tog(); } });
        P.nA = cab(P.V1.A, 1, P.V2.A, -1); P.nB = cab(P.V1.B, 1, P.V2.B, -1);
        P.L = E.lamp(C, 170, 360, { r: 22 });
        P.w.push(cab(P.V2.C, 1, [438, 360], 1), cab([342, 360], -1, [192, 360], 1), cab([148, 360], -1, P.V1.C, -1));
      }
      P.bat = E.battery(C, m === 'vav' ? 390 : 290, 360, { U: 4.5 });
      P.msg = s('text', { x: 290, y: 434, 'text-anchor': 'middle', 'font-size': 13.5, 'font-weight': 800, fill: '#C9D2E3' }, C);
    }
    /* schéma normalisé */
    var PX = 560, SCH = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 172, rx: 16, fill: '#F7F4EA' }, SCH);
    s('text', { x: PX + 18, y: 46, 'font-size': 12, 'font-weight': 900, fill: '#3A3426', text: 'SCHÉMA NORMALISÉ' }, SCH);
    var SG = s('g', {}, SCH), sKey = '';
    function schema(on) {
      var k = st.mode + st.btn + st.k1 + st.k2 + st.press + st.v1 + st.v2 + on; if (k === sKey) return; sKey = k;
      while (SG.firstChild) SG.removeChild(SG.firstChild);
      var ink = '#1E2430', X0 = PX + 34, X1 = PX + 246, Y0 = 70, Y1 = 166, ym = (Y0 + Y1) / 2, m = st.mode;
      var path = function (d) { s('path', { d: d, fill: 'none', stroke: ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, SG); };
      var dot = function (x, y) { s('circle', { cx: x, cy: y, r: 3.2, fill: ink }, SG); };
      var lab = function (x, y, txt, anc) { s('text', { x: x, y: y, 'text-anchor': anc || 'middle', 'font-size': 11, 'font-weight': 800, fill: ink, text: txt }, SG); };
      if (m === 'simple' || m === 'serie') {
        path('M' + X0 + ' ' + Y0 + 'H' + X1 + 'V' + Y1 + 'H' + X0 + 'Z');
        E.sym(SG, 'G', X0, ym, { vert: true });
        if (m === 'simple') {
          if (st.btn === 'poussoir') E.sym(SG, 'P', (X0 + X1) / 2, Y0, { closed: st.press }); else E.sym(SG, 'K', (X0 + X1) / 2, Y0, { closed: st.k1 });
          E.sym(SG, 'L', X1, ym, { on: on }); lab(X1 - 18, ym + 4, 'L', 'end');
        } else {
          E.sym(SG, 'K', X0 + 52, Y0, { closed: st.k1 }); lab(X0 + 52, Y0 - 10, 'K1'); E.sym(SG, 'L', (X0 + X1) / 2, Y0, { on: on }); lab((X0 + X1) / 2, Y0 - 16, 'L'); E.sym(SG, 'K', X1 - 52, Y0, { closed: st.k2 }); lab(X1 - 52, Y0 - 10, 'K2');
        }
      } else if (m === 'der') {
        var A = X0 + 50, B = X0 + 150, y2 = ym - 4;
        path('M' + X0 + ' ' + Y0 + 'H' + X1 + 'V' + Y1 + 'H' + X0 + 'Z'); path('M' + A + ' ' + Y0 + 'V' + y2 + 'H' + B + 'V' + Y0);
        E.sym(SG, 'G', X0, ym + 8, { vert: true }); E.sym(SG, 'K', (A + B) / 2, Y0, { closed: st.k1 }); lab((A + B) / 2, Y0 - 10, 'K1'); E.sym(SG, 'K', (A + B) / 2, y2, { closed: st.k2 }); lab((A + B) / 2, y2 - 10, 'K2');
        dot(A, Y0); dot(B, Y0); E.sym(SG, 'L', X1, ym + 8, { on: on }); lab(X1 - 18, ym + 12, 'L', 'end');
      } else {
        var Ax = X0 + 46, Bx = X1 - 46, yc = Y0 + 34;
        path('M' + (Ax + 14) + ' ' + (yc - 9) + 'H' + (Bx - 14) + 'M' + (Ax + 14) + ' ' + (yc + 9) + 'H' + (Bx - 14));
        path('M' + (Ax - 14) + ' ' + yc + 'H' + X0 + 'V' + Y1 + 'H' + X1 + 'V' + yc + 'H' + (Bx + 14));
        E.sym(SG, 'V', Ax, yc, { pos: st.v1 }); E.sym(SG, 'V', Bx, yc, { pos: st.v2, flip: true });
        E.sym(SG, 'L', X0, (yc + Y1) / 2 + 4, { on: on }); lab(X0 + 16, (yc + Y1) / 2 + 8, 'L', 'start'); E.sym(SG, 'G', (X0 + X1) / 2, Y1, { flip: true });
      }
    }
    /* table de vérité */
    var T = s('g', {}, G);
    s('rect', { x: PX, y: 204, width: 280, height: 190, rx: 16, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, T);
    var tT = s('text', { x: PX + 20, y: 228, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, T), TB = s('g', {}, T);
    s('rect', { x: PX, y: 402, width: 280, height: 44, rx: 14, fill: '#141E33', stroke: '#2B3A57', 'stroke-width': 1.5 }, T);
    var rule = [0, 1].map(function (k) { return s('text', { x: PX + 140, y: 420 + k * 16, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, T); });
    var tKey = '';
    function rows() {
      var m = st.mode;
      if (m === 'simple') return st.btn === 'poussoir' ? [{ k: 'r', c: ['relâché'], on: false }, { k: 'p', c: ['appuyé'], on: true }] : [{ k: 'o', c: ['ouvert'], on: false }, { k: 'f', c: ['fermé'], on: true }];
      if (m === 'vav') return [['a', 'a'], ['a', 'b'], ['b', 'a'], ['b', 'b']].map(function (x) { return { k: x.join(''), c: ['position ' + (x[0] === 'a' ? 1 : 2), 'position ' + (x[1] === 'a' ? 1 : 2)], on: x[0] === x[1] }; });
      return [[0, 0], [1, 0], [0, 1], [1, 1]].map(function (x) { return { k: x.join(''), c: [x[0] ? 'fermé' : 'ouvert', x[1] ? 'fermé' : 'ouvert'], on: m === 'serie' ? x[0] && x[1] : x[0] || x[1] }; });
    }
    function curKey() { var m = st.mode; if (m === 'simple') return st.btn === 'poussoir' ? (st.press ? 'p' : 'r') : (st.k1 ? 'f' : 'o'); if (m === 'vav') return st.v1 + st.v2; return (st.k1 ? 1 : 0) + '' + (st.k2 ? 1 : 0); }
    function drawTable() {
      while (TB.firstChild) TB.removeChild(TB.firstChild);
      var R = rows(), cols = st.mode === 'simple' ? [st.btn === 'poussoir' ? 'Bouton' : 'Interrupteur'] : st.mode === 'vav' ? ['En bas', 'En haut'] : ['K1', 'K2'], ck = curKey(), y = 248;
      cols.concat(['Lampe']).forEach(function (h, i, arr) { s('text', { x: PX + 20 + i * (240 / arr.length) + 120 / arr.length, y: y, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#EEF2F8', text: h }, TB); });
      R.forEach(function (r, j) {
        var yy = y + 8 + j * 34, seen = st.seen[st.mode + st.btn + r.k], cur = r.k === ck, n = cols.length + 1;
        s('rect', { x: PX + 16, y: yy, width: 248, height: 28, rx: 8, fill: cur ? '#22304D' : '#141E33', stroke: cur ? '#FFB547' : '#2B3A57', 'stroke-width': cur ? 2.5 : 1.5 }, TB);
        r.c.forEach(function (v, i) { s('text', { x: PX + 20 + i * (240 / n) + 120 / n, y: yy + 19, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 700, fill: '#C9D2E3', text: v }, TB); });
        var lx = PX + 20 + cols.length * (240 / n) + 120 / n;
        if (seen) { s('circle', { cx: lx, cy: yy + 14, r: 9, fill: r.on ? '#FFD27A' : '#2A3346', stroke: '#C9D2E3', 'stroke-width': 2 }, TB);  }
        else s('text', { x: lx, y: yy + 20, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#5B6680', text: '?' }, TB);
      });
    }
    function step() {
      var Tm = st.t != null ? st.t : performance.now() / 1000, m = st.mode;
      if (m + st.btn !== key) { key = m + st.btn; build(); }
      var on = lit(st);
      if (P.K1) P.K1.set(st.k1); if (P.K2) P.K2.set(st.k2); if (P.push) P.push.set(st.press); if (P.V1) { P.V1.set(st.v1); P.V2.set(st.v2); }
      P.L.set(on ? 1 : 0); P.bat.set(4.5);
      P.w.forEach(function (w) { w.flow(on ? 0.8 : 0, Tm); }); P.b1.forEach(function (w) { w.flow(on && st.k1 ? 0.8 : 0, Tm); }); P.b2.forEach(function (w) { w.flow(on && st.k2 ? 0.8 : 0, Tm); }); schema(on); if (P.nA) { P.nA.flow(on && st.v1 === 'a' ? 0.8 : 0, Tm); P.nB.flow(on && st.v1 === 'b' ? 0.8 : 0, Tm); }
      st.seen[m + st.btn + curKey()] = true;
      var tk = m + st.btn + curKey() + Object.keys(st.seen).length; if (tk !== tKey) { tKey = tk; drawTable(); }
      tT.textContent = m === 'simple' ? (st.btn === 'poussoir' ? 'LE BOUTON-POUSSOIR' : 'L’INTERRUPTEUR') : m === 'serie' ? 'DEUX INTERRUPTEURS EN SÉRIE' : m === 'der' ? 'DEUX INTERRUPTEURS EN DÉRIVATION' : 'LE MONTAGE VA-ET-VIENT';
      var RL = { simple: st.btn === 'poussoir' ? ['La lampe ne brille que pendant', 'qu’on appuie (sonnette).'] : ['L’interrupteur garde sa position :', 'ouvert = éteinte ; fermé = allumée.'], serie: ['Allumée seulement si K1 ET K2', 'sont fermés (double commande).'], der: ['Allumée si K1 OU K2 est fermé :', 'un seul chemin suffit.'], vav: ['On allume ou on éteint depuis', 'deux endroits (escalier, couloir).'] }[m];
      rule.forEach(function (r, i) { r.textContent = RL[i]; });
      var R = rows(), ns = R.filter(function (r) { return st.seen[m + st.btn + r.k]; }).length;
      P.msg.textContent = on ? 'La lampe est allumée' : 'La lampe est éteinte';
      return { on: on, k1: st.k1, k2: st.k2, v1: st.v1, v2: st.v2, press: st.press, done: ns === R.length, ns: ns };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'L’interrupteur' }, { t: 10, title: 'Le bouton-poussoir' }, { t: 20, title: 'Deux interrupteurs en série' }, { t: 34, title: 'En dérivation' }, { t: 46, title: 'Le va-et-vient' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['<b>Interrupteur</b> : garde sa position', '<b>bouton-poussoir</b> : ne ferme le circuit que si on appuie.', '#FFB547'],
      ['<b>En série</b> : K1 <b>ET</b> K2 fermés', '<b>en dérivation</b> : K1 <b>OU</b> K2 fermé suffit.', 'var(--blue)'],
      ['Le <b>va-et-vient</b>', 'commande une lampe depuis deux endroits (escalier, couloir).', '#3DD68C']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.seen = {};
        if (t < 10) { st.mode = 'simple'; st.btn = 'inter'; st.k1 = t > 3 && t < 7; }
        else if (t < 20) { st.mode = 'simple'; st.btn = 'poussoir'; st.press = (t > 12 && t < 14) || (t > 16 && t < 17); }
        else if (t < 34) { st.mode = 'serie'; st.k1 = t > 23; st.k2 = t > 27 && t < 31; }
        else if (t < 46) { st.mode = 'der'; st.k1 = t > 36 && t < 40; st.k2 = t > 41; }
        else { st.mode = 'vav'; st.v1 = t < 50 ? 'a' : 'b'; st.v2 = t < 54 ? 'b' : 'b'; if (t > 54) st.v2 = 'a'; }
        lab.step();
        tg.show(t, 3.2, 9.6, 290, 92, 'Il reste fermé : la lampe reste allumée') || tg.show(t, 12, 19.6, 290, 92, 'Allumée seulement quand on appuie') || tg.show(t, 23.4, 26.8, 290, 92, 'K1 fermé seul : éteinte') || tg.show(t, 27.2, 33.6, 290, 92, 'K1 ET K2 fermés : allumée') ||
          tg.show(t, 36.4, 45.6, 290, 92, 'Un seul interrupteur fermé suffit') || tg.show(t, 47, 49.8, 290, 92, 'Lampe éteinte') || tg.show(t, 50.2, 53.8, 290, 92, 'On bascule en bas : allumée') || tg.show(t, 54.2, 57.6, 290, 92, 'On bascule en haut : éteinte');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une lampe commandée par un interrupteur, puis par un bouton-poussoir, puis par deux interrupteurs en série, en dérivation, et enfin par un montage va-et-vient d’escalier ; une table de vérité se remplit à droite',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 9.6, say: 'Un interrupteur commande la lampe. Fermé, il reste fermé : la lampe reste allumée jusqu’à ce qu’on l’ouvre.', sub: 'L’<b>interrupteur</b> garde sa position.' },
      { t: 10, d: 9.6, say: 'Le bouton-poussoir, lui, ne ferme le circuit que tant qu’on appuie dessus, comme une sonnette.', sub: 'Le <b>bouton-poussoir</b> : allumée tant qu’on appuie.' },
      { t: 20, d: 13.6, say: 'Plaçons deux interrupteurs en série. K un fermé seul : la lampe reste éteinte. Il faut fermer K un et K deux pour l’allumer.', sub: 'En série : <b>K1 ET K2</b> fermés.' },
      { t: 34, d: 11.6, say: 'En dérivation, c’est différent : il suffit de fermer K un ou K deux pour allumer la lampe.', sub: 'En dérivation : <b>K1 OU K2</b> fermé.' },
      { t: 46, d: 11.6, say: 'Dans un escalier, on utilise le montage va-et-vient : on peut allumer en bas et éteindre en haut, ou l’inverse.', sub: 'Le <b>va-et-vient</b> : deux endroits pour une lampe.' },
      { t: 58, d: 4.4, say: 'À retenir : l’interrupteur et le bouton-poussoir commandent un circuit.', sub: 'Interrupteur, bouton-poussoir.' },
      { t: 62.6, d: 4.2, say: 'En série, tous les interrupteurs doivent être fermés ; en dérivation, un seul suffit.', sub: 'Série : ET ; dérivation : OU.' },
      { t: 67, d: 5, say: 'Le va-et-vient permet de commander une lampe depuis deux endroits.', sub: 'Le <b>va-et-vient</b>.' }
    ],
    learn: [
      { t: 19, ch: 1, html: '<b>Bouton-poussoir</b> : le circuit n’est fermé que si on appuie.' },
      { t: 33, ch: 2, html: 'Interrupteurs en <b>série</b> : K1 ET K2 fermés.' },
      { t: 45, ch: 3, html: 'Interrupteurs en <b>dérivation</b> : K1 OU K2 fermé.' },
      { t: 57, ch: 4, html: '<b>Va-et-vient</b> : commande depuis deux endroits.' }
    ],
    question: { q: 'Deux interrupteurs en série : la lampe s’allume si :', o: ['un seul est fermé', 'les deux sont fermés', 'les deux sont ouverts', 'jamais'], a: 1, e: 'K1 ET K2 doivent être fermés.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Montage', r: [50, 50, 460, 390] }, { n: 'Schéma', r: [560, 22, 280, 172] }, { n: 'Tableau', r: [560, 204, 280, 242] }],
    alt: 'Circuits de commande d’une lampe : interrupteur ou bouton-poussoir, deux interrupteurs en série ou en dérivation, montage va-et-vient d’escalier ; une table de vérité se remplit au fil des essais',
    steps: [
      'Clique sur l’interrupteur, puis sur le bouton-poussoir (maintiens appuyé) : compare.',
      'Deux interrupteurs en série : essaie les 4 combinaisons et remplis la table.',
      'Même chose en dérivation.',
      'Va-et-vient : allume en bas, éteins en haut. Remplis toutes les tables.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onTog: function () { api.sound('tick'); } }), st = lab.st, c = api.c, done = {};
      var cM = c.seg({ label: 'Montage', value: 'simple', options: [{ v: 'simple', l: 'Un seul organe' }, { v: 'serie', l: 'Deux interrupteurs en série' }, { v: 'der', l: 'Deux en dérivation' }, { v: 'vav', l: 'Va-et-vient' }], onChange: function (v) { st.mode = v; st.k1 = st.k2 = false; vis(); } });
      var cB = c.seg({ label: 'Organe de commande', value: 'inter', options: [{ v: 'inter', l: 'interrupteur' }, { v: 'poussoir', l: 'bouton-poussoir' }], onChange: function (v) { st.btn = v; } });
      function vis() { cB.hide(st.mode !== 'simple'); }
      vis();
      var ro = api.readouts([{ k: 'l', label: 'Lampe' }, { k: 'c', label: 'Table' }]);
      api.loop(function () { var r = lab.step(); ro.l.set(r.on ? 'allumée' : 'éteinte'); ro.c.set(r.ns + ' case(s) découverte(s)'); if (r.done) { var k = st.mode + (st.mode === 'simple' ? st.btn : ''); if (!done[k]) { done[k] = 1; api.sound('ok'); paint(); if (Object.keys(done).length >= 4) api.done(); } } });
      var M = api.measure;
      function paint() {
        api.count(Object.keys(done).length);
        var names = { simpleinter: 'interrupteur', simplepoussoir: 'bouton-poussoir', serie: 'série (ET)', der: 'dérivation (OU)', vav: 'va-et-vient' };
        M.innerHTML = '<h3>Tables complétées</h3>' + (Object.keys(done).length ? '<table class="mt"><tbody>' + Object.keys(done).map(function (k) { return '<tr><td>' + names[k] + '</td><td style="color:#3DD68C">complète</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Essaie toutes les combinaisons d’un montage pour compléter sa table.</div>');
        api.chart.innerHTML = '<h3>À quoi ça sert ?</h3><table class="mt"><tbody><tr><td>Bouton-poussoir</td><td>sonnette, minuterie</td></tr><tr><td>Série</td><td>machine dangereuse : deux mains sur deux boutons</td></tr><tr><td>Dérivation</td><td>allumer depuis deux boutons au choix</td></tr><tr><td>Va-et-vient</td><td>escalier, long couloir, chambre</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.mode = 'simple'; st.btn = 'inter'; st.k1 = st.k2 = false; st.v1 = 'a'; st.v2 = 'b'; st.seen = {}; cM.set('simple'); cB.set('inter'); vis(); done = {}; paint(); });
      api.say('Clique sur les interrupteurs pour les ouvrir ou les fermer.');
      return { bilan: function () {
        if (Object.keys(done).length < 3) return '<p>Complète au moins 3 tables (dont série et dérivation).</p>';
        return '<p>L’<b>interrupteur</b> garde la position qu’on lui donne (ouvert ou fermé). Le <b>bouton-poussoir</b> ne ferme le circuit que tant qu’on appuie.</p><p>Avec deux interrupteurs <b>en série</b>, la lampe ne s’allume que si K1 <b>et</b> K2 sont fermés. <b>En dérivation</b>, il suffit que K1 <b>ou</b> K2 soit fermé.</p><p>Le montage <b>va-et-vient</b>, avec deux commutateurs reliés par deux fils, permet d’allumer et d’éteindre une lampe depuis deux endroits différents.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Commande d’une lampe' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’électricien',
    intro: 'Interrupteurs, poussoir, va-et-vient : allume (ou éteins) au bon moment !',
    missions: [
      { title: 'Double sécurité', text: 'Allume la lampe commandée par <b>deux interrupteurs en série</b>. Clique sur les interrupteurs.', lumi: 'Un seul ne suffira pas…', hint: 'Ferme K1 et K2.',
        build: function (api) { var lab = mini(api, { mode: 'serie' }); return function () { var r = lab.res(); return r.on ? { ok: true, msg: 'K1 ET K2 fermés : la lampe brille.' } : { ok: false, msg: 'La lampe est éteinte.' }; }; },
        e: 'En série, tous les interrupteurs doivent être fermés.' },
      { type: 'qcm', title: 'La sonnette', text: 'Avec un bouton-poussoir, la sonnette sonne :', o: ['tout le temps', 'seulement pendant qu’on appuie', 'quand on relâche', 'jamais'], a: 1, hint: 'Il revient tout seul.', e: 'Le circuit n’est fermé que pendant l’appui.' },
      { title: 'Un seul suffit', text: 'En dérivation, allume la lampe avec <b>un seul</b> interrupteur fermé.', lumi: 'Un chemin suffit au courant.', hint: 'Ferme K1 ou K2, pas les deux.',
        build: function (api) { var lab = mini(api, { mode: 'der' }); return function () { var r = lab.res(); return r.on && r.k1 !== r.k2 ? { ok: true, msg: 'Un seul interrupteur fermé suffit en dérivation.' } : { ok: false, msg: r.on ? 'Les deux sont fermés : ouvre-en un.' : 'La lampe est éteinte.' }; }; },
        e: 'En dérivation : K1 OU K2.' },
      { type: 'qcm', title: 'L’escalier', text: 'Pour allumer en bas et éteindre en haut d’un escalier, on utilise :', o: ['deux interrupteurs en série', 'un bouton-poussoir', 'un montage va-et-vient', 'une seule pile'], a: 2, hint: 'Va… et vient !', e: 'Le va-et-vient commande une lampe depuis deux endroits.' },
      { title: 'Bonne nuit !', text: 'Tu es <b>en haut</b> de l’escalier : éteins la lumière <span style="color:var(--amber)">sans toucher au commutateur du bas</span>.', lumi: 'Clique sur le bon commutateur.', hint: 'Celui de droite, en haut.',
        build: function (api) { var lab = mini(api, { mode: 'vav', v1: 'b', v2: 'b' }); return function () { var r = lab.res(); return !r.on && r.v1 === 'b' ? { ok: true, msg: 'Éteinte depuis le haut : bonne nuit !' } : { ok: false, msg: r.v1 !== 'b' ? 'Tu as touché au commutateur du bas.' : 'La lampe est encore allumée.' }; }; },
        e: 'Avec le va-et-vient, chaque commutateur change l’état de la lampe.' }
    ]
  };

  S.start({
    inquiry: {"situation": "On veut commander l’éclairage sans débrancher la pile. Comment placer et utiliser un interrupteur ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '6e-commande-circuit', level: '6e', theme: 'Électricité', title: 'Commande d’un circuit électrique', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'On commande un circuit avec un <b>interrupteur</b> (il garde sa position, ouvert ou fermé) ou un <b>bouton-poussoir</b> (il ne ferme le circuit que pendant qu’on appuie).',
      'Deux interrupteurs <b>en série</b> : la lampe ne s’allume que si les deux sont fermés (K1 <b>ET</b> K2).',
      'Deux interrupteurs <b>en dérivation</b> : la lampe s’allume si l’un ou l’autre est fermé (K1 <b>OU</b> K2).',
      'Le montage <b>va-et-vient</b> permet de commander une lampe depuis deux endroits différents (escalier, couloir).',
      'Chaque organe de commande a son symbole sur un schéma normalisé.'
    ],
    quiz: [
      { q: 'Un interrupteur fermé :', o: ['laisse passer le courant', 'bloque le courant', 'produit du courant', 'éteint la pile'], a: 0, e: 'Le circuit est fermé.' },
      { q: 'Deux interrupteurs en dérivation, un seul fermé : la lampe est :', o: ['allumée', 'éteinte', 'grillée', 'clignotante'], a: 0, e: 'Un chemin suffit.' },
      { q: 'Deux interrupteurs en série, un seul fermé : la lampe est :', o: ['allumée', 'éteinte', 'à moitié allumée', 'grillée'], a: 1, e: 'La boucle reste ouverte.' },
      { q: 'Le bouton d’une sonnette est :', o: ['un interrupteur', 'un bouton-poussoir', 'un va-et-vient', 'un générateur'], a: 1, e: 'Il revient en position ouverte quand on lâche.' },
      { q: 'Le va-et-vient sert à :', o: ['commander une lampe de deux endroits', 'faire clignoter une lampe', 'protéger contre les courts-circuits', 'mesurer le courant'], a: 0, e: 'Escalier, couloir.' }
    ]
  });
})();

