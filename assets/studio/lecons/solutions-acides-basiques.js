/* 3e · Les réactions chimiques · Leçon : Solutions acides, basiques et neutres */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var SOL = {
    hcl: { n: 'acide chlorhydrique', pH: 1, c: '#E8F2FF' }, citron: { n: 'jus de citron', pH: 2.4, c: '#F3EBA0' }, bissap: { n: 'jus de bissap', pH: 3.2, c: '#8E1F3A' }, vinaigre: { n: 'vinaigre', pH: 2.9, c: '#F4E9C8' },
    pluie: { n: 'eau de pluie', pH: 5.6, c: '#DDEFFF' }, eau: { n: 'eau pure', pH: 7, c: '#DDEFFF' }, sel: { n: 'eau salée', pH: 7, c: '#E6F2FF' }, savon: { n: 'eau savonneuse', pH: 9.8, c: '#EEF2F8' },
    javel: { n: 'eau de Javel', pH: 11.5, c: '#F2F7D9' }, soude: { n: 'soude', pH: 13, c: '#E8F2FF' }
  };
  function uni(pH) { var st = [[0, [220, 30, 40]], [3, [240, 90, 40]], [5, [245, 190, 40]], [7, [70, 180, 70]], [9, [40, 150, 170]], [11, [50, 80, 200]], [14, [110, 40, 150]]]; for (var i = 1; i < st.length; i++) if (pH <= st[i][0]) { var a = st[i - 1], b = st[i], k = (pH - a[0]) / (b[0] - a[0]); return 'rgb(' + a[1].map(function (v, j) { return Math.round(v + (b[1][j] - v) * k); }).join(',') + ')'; } return 'rgb(110,40,150)'; }
  function bbt(pH) { return pH < 6 ? '#F2D23C' : pH <= 7.6 ? '#4CAF50' : '#2E6BD8'; }
  function kind(pH) { pH = Math.round(pH * 10) / 10; return pH < 7 ? 'acide' : pH > 7 ? 'basique' : 'neutre'; }
  function dil(pH0, f) { var acid = pH0 < 7, d = Math.log10(f), p = acid ? pH0 + d : pH0 - d; if (acid && p > 6.5) p = 7 - 0.5 * Math.exp(-(p - 6.5)); if (!acid && p < 7.5) p = 7 + 0.5 * Math.exp(-(7.5 - p)); return p; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'mesure', sol: 'citron', tool: 'phmetre', base: 'acide', f: 1, dip: 1, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 392, width: 500, height: 54, fill: '#151D2E' }, G);
    /* bécher */
    var BX = 220, liq = s('path', {}, G), bk = s('path', { fill: 'none', stroke: '#BFE6FF', 'stroke-width': 3 }, G), grad = s('g', {}, G), lblB = s('text', { x: BX, y: 416, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8' }, G);
    /* pH-mètre */
    var PM = s('g', {}, G); s('rect', { x: 380, y: 210, width: 130, height: 150, rx: 14, fill: '#2F3646', stroke: '#4A5160', 'stroke-width': 2 }, PM); s('rect', { x: 394, y: 226, width: 102, height: 50, rx: 6, fill: '#0B1F14' }, PM); var pmT = s('text', { x: 486, y: 262, 'text-anchor': 'end', 'font-size': 26, 'font-weight': 900, fill: '#5CFF9D', 'font-family': 'monospace' }, PM); s('text', { x: 445, y: 300, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#C9D2E3', text: 'pH-mètre' }, PM);
    var cable = s('path', { fill: 'none', stroke: '#1A1F28', 'stroke-width': 4 }, PM), probe = s('rect', { width: 12, height: 150, rx: 6, fill: '#C9D2E3' }, PM);
    /* papier pH */
    var PP = s('g', {}, G); s('rect', { x: 380, y: 120, width: 130, height: 240, rx: 12, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, PP); s('text', { x: 445, y: 142, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#C9D2E3', text: 'papier pH' }, PP);
    for (var k = 0; k <= 14; k++) { s('rect', { x: 392 + (k % 2) * 56, y: 154 + Math.floor(k / 2) * 24, width: 22, height: 18, rx: 3, fill: uni(k) }, PP); s('text', { x: 420 + (k % 2) * 56, y: 167 + Math.floor(k / 2) * 24, 'font-size': 11, 'font-weight': 800, fill: '#EEF2F8', text: k }, PP); }
    var strip = s('rect', { x: 300, y: 70, width: 16, height: 80, rx: 3, fill: '#F4EBDD' }, G), stripC = s('rect', { x: 300, y: 120, width: 16, height: 30, rx: 3 }, G);
    /* BBT */
    var BT = s('g', {}, G); s('path', { d: 'M420 100 v80 l8 14 l8 -14 v-80z', fill: '#4CAF50', 'fill-opacity': 0.55, stroke: '#BFE6FF', 'stroke-width': 2 }, BT); s('text', { x: 428, y: 92, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 900, fill: '#C9D2E3', text: 'BBT' }, BT);
    var leg = s('g', {}, BT); [['jaune : acide', '#F2D23C'], ['vert : neutre', '#4CAF50'], ['bleu : basique', '#2E6BD8']].forEach(function (r, i) { s('circle', { cx: 396, cy: 246 + i * 26, r: 8, fill: r[1] }, leg); s('text', { x: 410, y: 250 + i * 26, 'font-size': 12, 'font-weight': 800, fill: '#EEF2F8', text: r[0] }, leg); });
    var drop = s('circle', { cx: BX, r: 5, fill: '#4CAF50' }, BT);
    /* dilution */
    var DL = s('g', {}, G), fT = s('text', { x: 450, y: 140, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#9FD7FF' }, DL), jug = s('g', {}, DL); s('path', { d: 'M420 170 h60 l-6 70 h-48z', fill: '#4FA8FF', 'fill-opacity': 0.4, stroke: '#BFE6FF', 'stroke-width': 2 }, jug); s('text', { x: 450, y: 258, 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 800, fill: '#C9D2E3', text: 'eau distillée' }, jug);
    var msg = s('text', { x: 290, y: 438, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 800, fill: '#EEF2F8' }, G);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 48, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'L’ÉCHELLE DE pH' }, P);
    var SX = PX + 24, SW = 232, SY = 92;
    for (var q = 0; q < 56; q++) s('rect', { x: SX + q * SW / 56, y: SY, width: SW / 56 + 0.5, height: 22, fill: uni(q / 4) }, P);
    for (q = 0; q <= 14; q += 1) { s('line', { x1: SX + q * SW / 14, x2: SX + q * SW / 14, y1: SY + 22, y2: SY + 28, stroke: '#A9B4C7', 'stroke-width': 1 }, P); if (q % 2 === 0) s('text', { x: SX + q * SW / 14, y: SY + 40, 'text-anchor': 'middle', 'font-size': 10.5, fill: '#A9B4C7', text: q }, P); }
    s('text', { x: SX, y: SY - 10, 'font-size': 12, 'font-weight': 900, fill: '#FF8A80', text: '← acide' }, P); s('text', { x: SX + SW / 2, y: SY - 10, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#5CFF9D', text: 'neutre' }, P); s('text', { x: SX + SW, y: SY - 10, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 900, fill: '#9FB2FF', text: 'basique →' }, P);
    var mk = s('path', { fill: '#EEF2F8' }, P), dots = s('g', {}, P);
    var big = s('text', { x: PX + 140, y: 186, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: '#EEF2F8' }, P), kd = s('text', { x: PX + 140, y: 214, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900 }, P);
    s('line', { x1: PX + 24, x2: PX + 256, y1: 232, y2: 232, stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pq = [0, 1, 2, 3, 4, 5, 6].map(function (k2) { return s('text', { x: PX + 140, y: 258 + k2 * 23, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k2) { t.textContent = a[k2] || ''; t.setAttribute('font-weight', a[k2] && a[k2].charAt(0) === '•' ? 800 : 400); }); }
    var memo = {};
    function step() {
      var res = {}, mes = st.mode === 'mesure', So = SOL[st.sol], pH, vol, col, name;
      if (mes) { pH = So.pH; vol = 1; name = So.n; col = st.tool === 'bbt' && st.dip > 0.5 ? bbt(pH) : So.c; if (st.dip > 0.9) memo[st.sol] = pH; }
      else { var p0 = st.base === 'acide' ? 2 : 12; pH = dil(p0, st.f); vol = Math.min(1, 0.25 + 0.75 * Math.log10(st.f) / 3); name = (st.base === 'acide' ? 'acide dilué ' : 'base diluée ') + st.f + ' fois'; col = uni(pH); }
      var top = 392 - 16 - 150 * (mes ? 0.75 : vol);
      bk.setAttribute('d', 'M' + (BX - 70) + ' 210 V384 q0 8 8 8 H' + (BX + 62) + ' q8 0 8 -8 V210 l8 -8'); liq.setAttribute('d', 'M' + (BX - 67) + ' ' + top + ' V384 q0 5 5 5 H' + (BX + 62) + ' q5 0 5 -5 V' + top + 'Z'); liq.setAttribute('fill', col); liq.setAttribute('opacity', mes && st.tool !== 'bbt' ? (st.sol === 'bissap' ? 0.85 : 0.45) : 0.75);
      lblB.textContent = name;
      PM.style.display = mes && st.tool === 'phmetre' ? '' : 'none'; PP.style.display = mes && st.tool === 'papier' ? '' : 'none'; BT.style.display = mes && st.tool === 'bbt' ? '' : 'none'; DL.style.display = mes ? 'none' : ''; strip.style.display = stripC.style.display = mes && st.tool === 'papier' ? '' : 'none';
      var dp = st.dip; attr(probe, { x: BX - 6, y: top - 120 + 70 * dp }); cable.setAttribute('d', 'M' + BX + ' ' + (top - 120 + 70 * dp) + ' C ' + BX + ' 140, 330 150, 390 240'); pmT.textContent = dp > 0.9 ? fmt(pH, 1) : '--.-';
      attr(strip, { x: BX - 8, y: top - 70 + 50 * dp }); attr(stripC, { x: BX - 8, y: top - 70 + 50 * dp + 50, height: 30, fill: dp > 0.9 ? uni(Math.round(pH)) : '#F4EBDD' });
      attr(drop, { cy: 200 + 60 * Math.min(1, dp) , opacity: dp < 0.95 ? 1 : 0 });
      fT.textContent = 'dilution × ' + st.f;
      var shown = mes ? (st.tool === 'phmetre' ? (dp > 0.9 ? fmt(pH, 1) : '?') : st.tool === 'papier' ? (dp > 0.9 ? '≈ ' + Math.round(pH) : '?') : (pH < 6 ? '< 6' : pH <= 7.6 ? '≈ 7' : '> 7,6')) : fmt(pH, 1);
      big.textContent = 'pH ' + shown; var kn = kind(pH); kd.textContent = kn === 'acide' ? 'solution acide' : kn === 'basique' ? 'solution basique' : 'solution neutre'; kd.setAttribute('fill', kn === 'acide' ? '#FF8A80' : kn === 'basique' ? '#9FB2FF' : '#5CFF9D');
      var known = !mes || st.dip > 0.9, mx = SX + pH / 14 * SW; mk.setAttribute('d', known ? 'M' + mx + ' ' + (SY - 2) + ' l-7 -10 h14z' : ''); kd.style.display = known ? '' : 'none';
      while (dots.firstChild) dots.removeChild(dots.firstChild); Object.keys(memo).forEach(function (k2, i) { s('circle', { cx: SX + memo[k2] / 14 * SW, cy: SY + 11, r: 4, fill: '#FFF', stroke: '#0A0F1A', 'stroke-width': 1.5 }, dots); });
      msg.textContent = mes ? (st.tool === 'phmetre' ? 'Le pH-mètre mesure le pH avec précision' : st.tool === 'papier' ? 'On compare la couleur du papier au nuancier' : 'Le BBT change de couleur selon le milieu') : (st.base === 'acide' ? 'En diluant un acide, son pH augmente vers 7' : 'En diluant une base, son pH diminue vers 7') + ' (sans jamais le dépasser)';
      pset(mes ? ['• pH < 7 : solution acide', '• pH = 7 : solution neutre', '• pH > 7 : solution basique', 'Plus le pH est loin de 7,', 'plus la solution est acide', 'ou basique.', 'Acides et bases : corrosifs !'] : ['• Dilution', 'Ajouter de l’eau rapproche', 'le pH de 7.', 'Pour diluer un acide :', 'verser l’acide dans l’eau,', 'jamais l’eau dans l’acide !', 'Gants et lunettes.']);
      res = { pH: pH, kind: kn, sol: st.sol, tool: st.tool, f: st.f, base: st.base, measured: Object.keys(memo).length };
      return res;
    }
    return { st: st, step: step, memo: memo };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Citron ou savon ?' }, { t: 8, title: 'Le pH-mètre' }, { t: 22, title: 'Acide, neutre, basique' }, { t: 30, title: 'Les indicateurs colorés' }, { t: 40, title: 'La dilution' }, { t: 52, title: 'Sécurité' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['<b>pH &lt; 7</b> : acide · <b>pH = 7</b> : neutre · <b>pH &gt; 7</b> : basique', 'citron, vinaigre : acides ; eau pure : neutre ; savon, eau de Javel : basiques.', '#FFC773'],
      ['On mesure le pH au <b>pH-mètre</b> ou au <b>papier pH</b>', 'le BBT est jaune en milieu acide, vert neutre, bleu basique.', '#4CAF50'],
      ['Diluer rapproche le pH de <b>7</b>', 'toujours verser l’acide dans l’eau ; gants et lunettes.', '#9FB2FF']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    var seq = ['eau', 'citron', 'savon'];
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.mode = 'mesure'; st.dip = 1;
        if (t < 8) { st.tool = 'phmetre'; st.sol = 'citron'; st.dip = 0; }
        else if (t < 22) { st.tool = 'phmetre'; var k = Math.min(2, Math.floor((t - 8) / 4.6)); st.sol = seq[k]; st.dip = K.k(t, 8 + k * 4.6, 1); }
        else if (t < 30) { st.tool = 'phmetre'; st.sol = t < 26 ? 'vinaigre' : 'javel'; st.dip = 1; }
        else if (t < 40) { st.tool = t < 35 ? 'papier' : 'bbt'; st.sol = t < 35 ? 'bissap' : (t < 37.5 ? 'vinaigre' : 'javel'); st.dip = t < 35 ? K.k(t, 30.5, 1) : K.k(t, t < 37.5 ? 35 : 37.5, 0.8); }
        else if (t < 52) { st.mode = 'dilution'; st.base = 'acide'; st.f = t < 44 ? 1 : t < 48 ? 10 : 100; }
        else { st.mode = 'dilution'; st.base = 'base'; st.f = 100; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Acide ou pas ? Comment le savoir ?') || tg.show(t, 9, 21.6, 290, 92, SOL[st.sol].n + ' : pH ' + fmt(SOL[st.sol].pH, 1)) || tg.show(t, 23, 29.6, 290, 92, st.sol === 'vinaigre' ? 'pH < 7 : acide' : 'pH > 7 : basique') ||
          tg.show(t, 31, 34.8, 290, 92, 'Papier pH : bissap ≈ 3') || tg.show(t, 35.4, 39.6, 290, 92, st.sol === 'vinaigre' ? 'BBT jaune : acide' : 'BBT bleu : basique') || tg.show(t, 41, 51.6, 290, 92, 'Dilution × ' + st.f + ' : pH ' + fmt(dil(2, st.f), 1)) || tg.show(t, 52.4, 56.6, 290, 92, 'L’acide dans l’eau, jamais l’inverse');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un pH-mètre mesure le pH de l’eau pure (7), du jus de citron (2,4) et de l’eau savonneuse (9,8) ; une échelle de pH colorée classe les solutions acides, neutres et basiques ; du papier pH trempé dans du jus de bissap et du bleu de bromothymol qui devient jaune dans le vinaigre et bleu dans l’eau de Javel ; puis un acide de pH 2 dilué 10 puis 100 fois dont le pH monte vers 7',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Le jus de citron pique, le savon glisse entre les doigts. Comment savoir si une solution est acide ou basique ?', sub: 'Acide ou <b>basique</b> ?' },
      { t: 8, d: 13.6, say: 'On mesure son pH, un nombre entre zéro et quatorze, avec un pH-mètre. L’eau pure a un pH de sept. Le jus de citron, environ deux virgule quatre. L’eau savonneuse, près de dix.', sub: 'Le <b>pH-mètre</b> mesure le pH.' },
      { t: 22, d: 7.6, say: 'Une solution de pH inférieur à sept est acide, comme le vinaigre. Égal à sept, elle est neutre. Supérieur à sept, comme l’eau de Javel, elle est basique.', sub: 'pH < 7 acide · = 7 neutre · > 7 <b>basique</b>.' },
      { t: 30, d: 9.6, say: 'Le papier pH change de couleur : on le compare au nuancier. Le bleu de bromothymol, ou BBT, devient jaune en milieu acide, vert en milieu neutre, et bleu en milieu basique.', sub: 'Indicateurs : <b>papier pH</b>, <b>BBT</b>.' },
      { t: 40, d: 11.6, say: 'Diluons un acide de pH deux : dix fois plus d’eau, le pH passe à trois ; cent fois, à quatre. En diluant, on rapproche le pH de sept, sans jamais le dépasser.', sub: 'Diluer rapproche le pH de <b>7</b>.' },
      { t: 52, d: 4.6, say: 'Acides et bases concentrés sont corrosifs : on verse toujours l’acide dans l’eau.', sub: 'Toujours l’<b>acide dans l’eau</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : pH inférieur à sept, acide ; égal à sept, neutre ; supérieur à sept, basique.', sub: 'La classification par le pH.' },
      { t: 61.8, d: 4.2, say: 'On le mesure au pH-mètre ou avec des indicateurs colorés.', sub: 'pH-mètre et indicateurs.' },
      { t: 66.2, d: 4.8, say: 'La dilution rapproche le pH de sept.', sub: 'Dilution : pH → 7.' }
    ],
    learn: [
      { t: 21, ch: 1, html: 'Le <b>pH</b> se mesure au pH-mètre (de 0 à 14).' },
      { t: 29, ch: 2, html: '<b>pH &lt; 7</b> acide ; pH = 7 neutre ; <b>pH &gt; 7</b> basique.' },
      { t: 39, ch: 3, html: 'BBT : <b>jaune</b> acide, <b>vert</b> neutre, <b>bleu</b> basique.' },
      { t: 51, ch: 4, html: 'Diluer rapproche le pH de <b>7</b>.' }
    ],
    question: { q: 'Une solution de pH 11 est :', o: ['acide', 'neutre', 'basique', 'impossible'], a: 2, e: 'pH > 7 : basique.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : mesurer le pH de dix solutions de la vie courante (citron, vinaigre, jus de bissap, eau de pluie, eau pure, eau salée, eau savonneuse, eau de Javel, acide chlorhydrique, soude) avec un pH-mètre, du papier pH ou du bleu de bromothymol ; puis diluer un acide ou une base et suivre son pH ; à droite, l’échelle de pH colorée',
    steps: [
      'Mesure le pH de plusieurs solutions avec le pH-mètre.',
      'Classe-les : acides, neutres ou basiques.',
      'Compare avec le papier pH et le BBT.',
      'Dilution : que devient le pH quand on ajoute de l’eau ?'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'mesure', options: [{ v: 'mesure', l: 'Mesurer le pH' }, { v: 'dilution', l: 'Dilution' }], onChange: function (v) { st.mode = v; vis(); } });
      var cS = c.seg({ label: 'Solution', value: 'citron', options: Object.keys(SOL).map(function (k) { return { v: k, l: SOL[k].n }; }), onChange: function (v) { st.sol = v; st.dip = 0; } });
      var cT = c.seg({ label: 'Instrument', value: 'phmetre', options: [{ v: 'phmetre', l: 'pH-mètre' }, { v: 'papier', l: 'papier pH' }, { v: 'bbt', l: 'BBT' }], onChange: function (v) { st.tool = v; st.dip = 0; } });
      var bD = c.button({ label: 'Mesurer', primary: true, onClick: function () { st.dip = 1; api.sound('tick'); } });
      var cB = c.seg({ label: 'Solution de départ', value: 'acide', options: [{ v: 'acide', l: 'acide (pH 2)' }, { v: 'base', l: 'base (pH 12)' }], onChange: function (v) { st.base = v; st.f = 1; sF.set(0); } });
      var sF = c.slider({ label: 'Dilution (puissance de 10)', min: 0, max: 5, step: 1, value: 0, unit: '', dec: 0, onInput: function (v) { st.f = Math.pow(10, v); } });
      function vis() { var m = st.mode === 'mesure'; cS.hide(!m); cT.hide(!m); bD.style.display = m ? '' : 'none'; cB.hide(m); sF.hide(m); }
      vis(); st.dip = 0;
      var ro = api.readouts([{ k: 'a', label: 'pH' }, { k: 'b', label: 'Nature' }]), last = {};
      api.loop(function () { last = lab.step(); var ok = st.mode !== 'mesure' || st.dip > 0.9; ro.a.set(ok ? (st.mode === 'mesure' && st.tool !== 'phmetre' ? (st.tool === 'papier' ? '≈ ' + Math.round(last.pH) : 'couleur') : fmt(last.pH, 1)) : '—'); ro.b.set(ok ? last.kind : '—'); });
      var Mm = api.measure; Mm.innerHTML = '<h3>Mes mesures</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, Mm), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, Mm);
      bR.onclick = function () { if (st.mode === 'mesure' && st.dip < 0.9) { api.say('Mesure d’abord.'); return; } rows.push(st.mode === 'mesure' ? { e: SOL[st.sol].n, i: { phmetre: 'pH-mètre', papier: 'papier pH', bbt: 'BBT' }[st.tool], p: st.tool === 'phmetre' ? fmt(last.pH, 1) : st.tool === 'papier' ? '≈ ' + Math.round(last.pH) : (last.pH < 6 ? 'jaune' : last.pH <= 7.6 ? 'vert' : 'bleu'), k: last.kind } : { e: (st.base === 'acide' ? 'acide dilué' : 'base diluée') + ' × ' + st.f, i: 'pH-mètre', p: fmt(last.pH, 1), k: last.kind }); api.sound('ok'); paint(); if (rows.length >= 5) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Solution</th><th>Instrument</th><th>Résultat</th><th>Nature</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.i + '</td><td>' + r.p + '</td><td>' + r.k + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>'; api.chart.innerHTML = '<h3>Le bleu de bromothymol (BBT)</h3><table class="mt"><thead><tr><th>Milieu</th><th>pH</th><th>Couleur du BBT</th></tr></thead><tbody><tr><td>acide</td><td>&lt; 6</td><td>jaune</td></tr><tr><td>neutre</td><td>≈ 7</td><td>vert</td></tr><tr><td>basique</td><td>&gt; 7,6</td><td>bleu</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'mesure', sol: 'citron', tool: 'phmetre', base: 'acide', f: 1, dip: 0 }); Object.keys(lab.memo).forEach(function (k) { delete lab.memo[k]; }); cM.set('mesure'); cS.set('citron'); cT.set('phmetre'); cB.set('acide'); sF.set(0); vis(); rows = []; paint(); });
      api.say('Choisis une solution et appuie sur « Mesurer ».');
      return { bilan: function () {
        if (rows.length < 4) return '<p>Relève au moins 4 mesures.</p>';
        return '<p>Le <b>pH</b> d’une solution aqueuse est un nombre compris entre 0 et 14. Une solution est <b>acide</b> si pH &lt; 7 (citron, vinaigre, bissap), <b>neutre</b> si pH = 7 (eau pure, eau salée), <b>basique</b> si pH &gt; 7 (eau savonneuse, eau de Javel, soude).</p><p>On mesure le pH avec un <b>pH-mètre</b> (précis) ou du <b>papier pH</b> (approché). Le <b>BBT</b> est jaune en milieu acide, vert en milieu neutre, bleu en milieu basique.</p><p>La <b>dilution</b> rapproche le pH de 7 sans le dépasser. Acides et bases concentrés sont corrosifs : gants, lunettes, et toujours <b>verser l’acide dans l’eau</b>.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Solutions acides et basiques' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function pick(api, lab) { api.c.seg({ label: 'Solution', value: lab.st.sol, options: Object.keys(SOL).map(function (k) { return { v: k, l: SOL[k].n }; }), onChange: function (v) { lab.st.sol = v; } }); }
  var DEFI = {
    title: 'Le défi du pH',
    intro: 'Acide, neutre ou basique ? Mène l’enquête au labo !',
    missions: [
      { title: 'La plus basique', text: 'Trouve la solution <b>la plus basique</b> de la liste.', lumi: 'Le pH le plus grand…', hint: 'La soude, pH 13.',
        build: function (api) { var lab = mini(api, { sol: 'eau' }); pick(api, lab); return function () { var r = lab.res(); return r.sol === 'soude' ? { ok: true, msg: 'La soude : pH 13.' } : { ok: false, msg: SOL[r.sol].n + ' : pH ' + fmt(r.pH, 1) + '.' }; }; },
        e: 'Plus le pH est grand, plus la solution est basique.' },
      { title: 'BBT jaune', text: 'Avec le <b>BBT</b>, fais apparaître la couleur <span style="color:#F2D23C">jaune</span>.', lumi: 'Il faut un milieu acide.', hint: 'Citron, vinaigre, bissap…',
        build: function (api) { var lab = mini(api, { sol: 'savon', tool: 'bbt' }); pick(api, lab); return function () { var r = lab.res(); return r.pH < 6 ? { ok: true, msg: 'BBT jaune : ' + SOL[r.sol].n + ' est acide.' } : { ok: false, msg: 'Le BBT est ' + (r.pH <= 7.6 ? 'vert' : 'bleu') + '.' }; }; },
        e: 'Le BBT est jaune en milieu acide.' },
      { title: 'pH 5', text: 'Dilue l’acide de pH 2 jusqu’à obtenir <b>pH 5</b>.', lumi: 'Chaque dilution par 10 augmente le pH de 1.', hint: '× 1 000.',
        build: function (api) { var lab = mini(api, { mode: 'dilution', base: 'acide' }); api.c.slider({ label: 'Dilution (puissance de 10)', min: 0, max: 5, step: 1, value: 0, unit: '', dec: 0, onInput: function (v) { lab.st.f = Math.pow(10, v); } }); return function () { var r = lab.res(); return Math.abs(r.pH - 5) < 0.05 ? { ok: true, msg: 'Dilution × 1 000 : pH 5.' } : { ok: false, msg: 'pH ' + fmt(r.pH, 1) + '.' }; }; },
        e: 'pH 2 → 3 → 4 → 5 : × 1 000.' },
      { type: 'qcm', title: 'Neutre ?', text: 'Quelle solution est neutre ?', o: ['jus de citron', 'eau salée', 'eau de Javel', 'vinaigre'], a: 1, hint: 'pH = 7.', e: 'L’eau salée a un pH de 7.' },
      { type: 'qcm', title: 'Sécurité', text: 'Pour diluer un acide concentré, on :', o: ['verse l’eau dans l’acide', 'verse l’acide dans l’eau', 'chauffe l’acide', 'le goûte'], a: 1, hint: 'Pour éviter les projections.', e: 'Toujours l’acide dans l’eau.' }
    ]
  };

  S.start({
    id: '3e-solutions-acides-basiques', level: '3e', theme: 'Les réactions chimiques', title: 'Solutions acides, basiques et neutres', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Le <b>pH</b> d’une solution aqueuse est un nombre compris entre <b>0 et 14</b>. On le mesure avec un <b>pH-mètre</b> ou du <b>papier pH</b>.',
      'Une solution est <b>acide</b> si pH &lt; 7, <b>neutre</b> si pH = 7, <b>basique</b> si pH &gt; 7.',
      'Exemples : jus de citron, vinaigre, jus de bissap (acides) ; eau pure, eau salée (neutres) ; eau savonneuse, eau de Javel, soude (basiques).',
      'Les <b>indicateurs colorés</b> changent de couleur selon le pH : le BBT est <b>jaune</b> en milieu acide, <b>vert</b> en milieu neutre, <b>bleu</b> en milieu basique.',
      'La <b>dilution</b> rapproche le pH de 7. Acides et bases concentrés sont <b>corrosifs</b> : gants, lunettes, et toujours <b>verser l’acide dans l’eau</b>.'
    ],
    quiz: [
      { q: 'Une solution de pH 3 est :', o: ['acide', 'neutre', 'basique', 'pure'], a: 0, e: 'pH < 7 : acide.' },
      { q: 'L’eau pure a un pH de :', o: ['0', '7', '14', '10'], a: 1, e: 'pH = 7 : neutre.' },
      { q: 'Dans l’eau de Javel, le BBT devient :', o: ['jaune', 'vert', 'bleu', 'rouge'], a: 2, e: 'Milieu basique : bleu.' },
      { q: 'Quand on dilue un acide, son pH :', o: ['diminue', 'augmente vers 7', 'dépasse 7', 'reste le même'], a: 1, e: 'Il se rapproche de 7.' },
      { q: 'L’instrument le plus précis pour mesurer le pH est :', o: ['le papier pH', 'le pH-mètre', 'le BBT', 'le thermomètre'], a: 1, e: 'Le pH-mètre.' }
    ]
  });
})();
