/* 6e · Électricité · Leçon : Le circuit électrique */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729';
  var OBJ = {
    clou: { n: 'clou en fer', c: true, col: '#9AA6BC', k: 1 },
    cuivre: { n: 'fil de cuivre', c: true, col: '#D9783F', k: 1 },
    alu: { n: 'papier aluminium', c: true, col: '#DCE3EE', k: 1 },
    piece: { n: 'pièce de monnaie', c: true, col: '#C9A86A', k: 1 },
    mine: { n: 'mine de crayon', c: true, col: '#3A3A42', k: 0.55 },
    plastique: { n: 'règle en plastique', c: false, col: '#4FC3FF', k: 0 },
    bois: { n: 'bâton de bois', c: false, col: '#A07850', k: 0 },
    verre: { n: 'baguette de verre', c: false, col: '#BFE6FF', k: 0 },
    gomme: { n: 'gomme', c: false, col: '#F2A0B4', k: 0 },
    papier: { n: 'papier', c: false, col: '#F2EBD3', k: 0 }
  };
  var PARTS = [['G', 'la pile (générateur)', [285, 380, 64, 34]], ['L', 'la lampe (récepteur)', [200, 126, 36, 40]], ['K', 'l’interrupteur', [360, 112, 46, 30]], ['F', 'les fils de connexion', [100, 250, 22, 140]]];

  function Lab(G, o) {
    var st = Object.assign({ closed: true, linked: true, obj: 'cuivre', arrows: true, hl: null, tested: {}, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var wA = E.wire(G, 'M333 380 H470 V284'), wB = E.wire(G, 'M470 216 V120 H392'), wC = E.wire(G, 'M330 120 H222'), wD = E.wire(G, 'M178 120 H100 V300'), wE = E.wire(G, 'M100 300 V380 H237');
    var gapM = s('rect', { x: 91, y: 290, width: 18, height: 40, fill: BG }, G), loose = s('path', { d: 'M100 330 l-30 20', stroke: '#C9D2E3', 'stroke-width': 3.5, 'stroke-linecap': 'round', fill: 'none' }, G), looseDot = s('circle', { cx: 70, cy: 350, r: 5, fill: '#FFB547' }, G);
    s('rect', { x: 320, y: 104, width: 82, height: 26, fill: BG }, G);
    var K1 = E.switchK(G, 330, 120, 390, { closed: st.closed, onToggle: function (c) { st.closed = c; o.onToggle && o.onToggle(); } });
    var lp = E.lamp(G, 200, 120, { r: 22 });
    var bat = E.battery(G, 285, 380, { U: 4.5 });
    /* zone de test : deux pinces et l’objet */
    s('rect', { x: 461, y: 216, width: 18, height: 68, fill: BG }, G);
    var clipT = s('path', { d: 'M462 216 h16 l-4 10 h-8z', fill: '#E5484D' }, G), clipB = s('path', { d: 'M462 284 h16 l-4 -10 h-8z', fill: '#2A2F38', stroke: '#7D89A3' }, G);
    var objR = s('rect', { x: 462, y: 224, width: 16, height: 52, rx: 4 }, G);
    var objL = s('text', { x: 450, y: 254, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 800, fill: '#C9D2E3' }, G);
    s('text', { x: 450, y: 238, 'text-anchor': 'end', 'font-size': 10, 'font-weight': 800, fill: '#7D89A3', text: 'objet testé' }, G);
    var arr = s('g', {}, G), AR = []; for (var i = 0; i < 8; i++) AR.push(s('path', { fill: '#FFE29A' }, arr));
    var HL = s('rect', { rx: 12, fill: 'none', stroke: '#FFB547', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, G), HLt = s('text', { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773' }, G);
    var msg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, G);
    /* schéma normalisé */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 230, rx: 16, fill: '#F7F4EA' }, P);
    s('text', { x: PX + 18, y: 46, 'font-size': 12, 'font-weight': 900, fill: '#3A3426', text: 'SCHÉMA NORMALISÉ' }, P);
    var ink = '#1E2430', x0 = PX + 50, x1 = PX + 230, y0 = 84, y1 = 214;
    s('path', { d: 'M' + x0 + ' ' + y0 + ' H' + x1 + ' V' + y1 + ' H' + x0 + ' Z', fill: 'none', stroke: ink, 'stroke-width': 2 }, P);
    var lx = x0 + 50; s('circle', { cx: lx, cy: y0, r: 12, fill: '#F7F4EA', stroke: ink, 'stroke-width': 2 }, P); var lFill = s('circle', { cx: lx, cy: y0, r: 10, fill: '#FFE9A8', opacity: 0 }, P); s('path', { d: 'M' + (lx - 8.5) + ' ' + (y0 - 8.5) + 'l17 17M' + (lx + 8.5) + ' ' + (y0 - 8.5) + 'l-17 17', stroke: ink, 'stroke-width': 2 }, P);
    var kx = x0 + 130; s('rect', { x: kx - 16, y: y0 - 12, width: 32, height: 16, fill: '#F7F4EA' }, P); s('circle', { cx: kx - 13, cy: y0, r: 2.5, fill: ink }, P); s('circle', { cx: kx + 13, cy: y0, r: 2.5, fill: ink }, P); var kl = s('line', { x1: kx - 13, y1: y0, stroke: ink, 'stroke-width': 2 }, P);
    var gx = (x0 + x1) / 2; s('rect', { x: gx - 12, y: y1 - 16, width: 24, height: 32, fill: '#F7F4EA' }, P); s('line', { x1: gx + 6, y1: y1 - 16, x2: gx + 6, y2: y1 + 16, stroke: ink, 'stroke-width': 2 }, P); s('line', { x1: gx - 6, y1: y1 - 9, x2: gx - 6, y2: y1 + 9, stroke: ink, 'stroke-width': 5 }, P); s('text', { x: gx + 10, y: y1 - 18, 'font-size': 12, 'font-weight': 900, fill: ink, text: '+' }, P);
    s('rect', { x: x1 - 8, y: (y0 + y1) / 2 - 18, width: 16, height: 36, fill: '#F7F4EA', stroke: ink, 'stroke-width': 2 }, P); s('text', { x: x1 + 14, y: (y0 + y1) / 2 + 4, 'font-size': 10, fill: ink, text: 'objet' }, P);
    var gapS = s('g', {}, P); s('rect', { x: x0 - 4, y: 160, width: 8, height: 26, fill: '#F7F4EA' }, gapS);
    var sArr = s('path', { fill: '#C62828' }, P), sArrT = s('text', { x: x0 - 12, y: 140, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 900, fill: '#C62828', text: 'I' }, P);
    s('text', { x: lx, y: y0 - 18, 'text-anchor': 'middle', 'font-size': 10, fill: ink, text: 'lampe' }, P); s('text', { x: kx, y: y0 - 18, 'text-anchor': 'middle', 'font-size': 10, fill: ink, text: 'interrupteur' }, P); s('text', { x: gx + 26, y: y1 + 22, 'font-size': 10, fill: ink, text: 'pile' }, P);
    /* fiche des objets testés */
    var F = s('g', {}, G); s('rect', { x: PX, y: 264, width: 280, height: 182, rx: 16, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, F);
    var vb = s('rect', { x: PX + 18, y: 278, width: 244, height: 36, rx: 18 }, F), vt = s('text', { x: PX + 140, y: 302, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, F);
    s('text', { x: PX + 18, y: 336, 'font-size': 11, 'font-weight': 800, fill: '#3DD68C', text: 'CONDUCTEURS' }, F); s('text', { x: PX + 148, y: 336, 'font-size': 11, 'font-weight': 800, fill: '#FF8A80', text: 'ISOLANTS' }, F);
    var listC = s('g', {}, F), lastKey = '';
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, O = OBJ[st.obj];
      var on = st.closed && st.linked && O.c, I = on ? O.k : 0;
      K1.set(st.closed); bat.set(4.5); lp.set(on ? O.k * 1.0 : 0);
      [wA, wB, wC, wD, wE].forEach(function (w) { w.flow(I, T); });
      loose.style.display = looseDot.style.display = gapM.style.display = st.linked ? 'none' : '';
      objR.setAttribute('fill', O.col); objL.textContent = O.n;
      if (on) st.tested[st.obj] = true; else if (st.closed && st.linked && !O.c) st.tested[st.obj] = true;
      // flèches du sens conventionnel (+ → −, à l’extérieur de la pile)
      var path = [[400, 380, 1, 0], [470, 340, 0, -1], [470, 170, 0, -1], [430, 120, -1, 0], [280, 120, -1, 0], [140, 120, -1, 0], [100, 200, 0, 1], [160, 380, 1, 0]];
      AR.forEach(function (a, k) { var p = path[k]; a.style.display = on && st.arrows ? '' : 'none'; var x = p[0], y = p[1], dx = p[2], dy = p[3]; a.setAttribute('d', 'M' + (x + dx * 9) + ' ' + (y + dy * 9) + ' L' + (x - dx * 7 - dy * 7) + ' ' + (y - dy * 7 + dx * 7) + ' L' + (x - dx * 7 + dy * 7) + ' ' + (y - dy * 7 - dx * 7) + 'Z'); });
      // mise en évidence d’un élément
      if (st.hl != null) { var hp = PARTS[st.hl][2]; attr(HL, { x: hp[0] - hp[2], y: hp[1] - hp[3], width: hp[2] * 2, height: hp[3] * 2 }); HL.style.display = ''; attr(HLt, { x: hp[0], y: hp[1] - hp[3] - 10 }); HLt.textContent = PARTS[st.hl][1]; HLt.style.display = ''; } else { HL.style.display = 'none'; HLt.style.display = 'none'; }
      msg.textContent = !st.linked ? 'Un fil est débranché : circuit ouvert' : !st.closed ? 'Interrupteur ouvert : circuit ouvert' : O.c ? 'Circuit fermé : la lampe brille' + (O.k < 1 ? ' (faiblement)' : '') : 'La lampe ne brille pas : ' + O.n + ' isolant(e)';
      // schéma
      lFill.setAttribute('opacity', on ? O.k : 0); attr(kl, { x2: kx + 13, y2: st.closed ? y0 : y0 - 12 }); gapS.style.display = st.linked ? 'none' : '';
      sArr.setAttribute('d', on ? 'M' + x0 + ' 150 l-6 -12 h12z' : ''); sArrT.style.display = on ? '' : 'none';
      // verdict et fiche
      var test = st.closed && st.linked;
      vb.setAttribute('fill', !test ? '#3A4560' : O.c ? '#3DD68C' : '#FF5A4E'); vt.setAttribute('fill', !test ? '#C9D2E3' : '#0B1220'); vt.textContent = !test ? 'FERME LE CIRCUIT' : O.c ? O.n.toUpperCase() + ' : CONDUCTEUR' : O.n.toUpperCase() + ' : ISOLANT';
      vt.setAttribute('font-size', vt.textContent.length > 28 ? 11.5 : 14);
      var key = Object.keys(st.tested).join(); if (key !== lastKey) { lastKey = key; while (listC.firstChild) listC.removeChild(listC.firstChild); var nc = 0, ni = 0; Object.keys(st.tested).forEach(function (k) { var c = OBJ[k].c; s('text', { x: PX + (c ? 18 : 148), y: 356 + (c ? nc++ : ni++) * 17, 'font-size': 11.5, fill: '#C9D2E3', text: '• ' + OBJ[k].n }, listC); }); }
      var nC = Object.keys(st.tested).filter(function (k) { return OBJ[k].c; }).length;
      return { on: on, O: O, nC: nC, nT: Object.keys(st.tested).length, closed: st.closed, linked: st.linked };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les éléments du circuit' }, { t: 13, title: 'Circuit fermé, circuit ouvert' }, { t: 23, title: 'Le sens du courant' }, { t: 33, title: 'Conducteurs et isolants' }, { t: 47, title: 'Le schéma normalisé' }, { t: 56, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un circuit : <b>générateur</b>, <b>récepteur</b>, <b>interrupteur</b>, <b>fils</b>', 'formant une boucle fermée.', '#FFB547'],
      ['Le courant circule si le circuit est <b>fermé</b>', 'du <b>+</b> vers le <b>−</b> du générateur, à l’extérieur de celui-ci.', 'var(--blue)'],
      ['<b>Conducteurs</b> (métaux, graphite) et <b>isolants</b>', 'plastique, bois, verre, caoutchouc ne laissent pas passer le courant.', '#3DD68C']], [56.2, 60.6, 65]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    var seq = ['clou', 'plastique', 'mine', 'bois', 'alu', 'verre'];
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 56.2)) {
        st.t = t; st.linked = true; st.arrows = t > 23;
        st.hl = t < 13 ? Math.min(3, Math.floor(t / 3)) : null;
        st.closed = t < 13 ? true : t < 23 ? (t < 16 || t > 19.5) : true;
        if (t > 33 && t < 47) { st.obj = seq[Math.min(5, Math.floor((t - 33) / 2.3))]; } else st.obj = 'cuivre';
        if (t < 33) st.tested = {};
        lab.step();
        tg.show(t, 14, 15.8, 290, 92, 'Interrupteur fermé : la lampe brille') || tg.show(t, 16.2, 19.4, 290, 92, 'Interrupteur ouvert : elle s’éteint') || tg.show(t, 24, 32.6, 290, 92, 'Sens du courant : du + vers le −') ||
          tg.show(t, 34, 46.6, 290, 92, OBJ[st.obj].n + ' : ' + (OBJ[st.obj].c ? 'conducteur' : 'isolant')) || tg.show(t, 48, 55.6, 290, 92, 'Chaque élément a son symbole');
      }
      bg.setAttribute('opacity', t > 55.8 ? 1 : 0);
      K.group(g5, t, 55.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un circuit avec une pile, une lampe, un interrupteur et des fils ; on ouvre et ferme l’interrupteur, des flèches montrent le sens du courant, puis on teste des objets conducteurs et isolants ; un schéma normalisé accompagne le circuit',
    duration: 70, chapters: CH,
    segs: [
      { t: 0, d: 6, say: 'Voici un circuit électrique. Il comporte une pile : c’est le générateur. Puis une lampe : c’est le récepteur.', sub: 'Un <b>générateur</b> (la pile) et un <b>récepteur</b> (la lampe)…' },
      { t: 6.2, d: 6.4, say: 'Il y a aussi un interrupteur et des fils de connexion qui relient tous les éléments en une boucle.', sub: '…un <b>interrupteur</b> et des <b>fils</b>, en boucle.' },
      { t: 13, d: 3, say: 'Interrupteur fermé : le circuit est fermé, la lampe brille.', sub: 'Circuit <b>fermé</b> : la lampe brille.' },
      { t: 16.2, d: 6.6, say: 'Interrupteur ouvert : le circuit est ouvert, le courant ne passe plus, la lampe s’éteint.', sub: 'Circuit <b>ouvert</b> : le courant ne passe pas.' },
      { t: 23, d: 9.6, say: 'Par convention, à l’extérieur du générateur, le courant circule de la borne plus vers la borne moins.', sub: 'Le courant va de la borne <b>+</b> vers la borne <b>−</b>.' },
      { t: 33, d: 7.4, say: 'Plaçons différents objets dans le circuit. Avec un clou, une mine de crayon ou du papier aluminium, la lampe brille : ce sont des conducteurs.', sub: 'Métaux, graphite : des <b>conducteurs</b>.' },
      { t: 40.6, d: 6.2, say: 'Avec du plastique, du bois ou du verre, elle reste éteinte : ce sont des isolants.', sub: 'Plastique, bois, verre : des <b>isolants</b>.' },
      { t: 47, d: 8.8, say: 'Pour dessiner un circuit, on utilise un schéma normalisé : chaque élément a son symbole, compris partout dans le monde.', sub: 'Le <b>schéma normalisé</b> : un symbole par élément.' },
      { t: 56, d: 4.4, say: 'À retenir : un circuit comporte un générateur, des récepteurs, un interrupteur et des fils.', sub: 'Générateur, récepteurs, interrupteur, fils.' },
      { t: 60.6, d: 4.2, say: 'Le courant ne circule que dans un circuit fermé, du plus vers le moins.', sub: 'Circuit fermé, courant du <b>+</b> vers le <b>−</b>.' },
      { t: 65, d: 5, say: 'Les métaux sont conducteurs ; le plastique, le bois et le verre sont isolants.', sub: 'Conducteurs et isolants.' }
    ],
    learn: [
      { t: 12, ch: 0, html: 'Générateur, récepteur, interrupteur, <b>fils</b> : une boucle.' },
      { t: 22, ch: 1, html: 'Le courant ne passe que dans un circuit <b>fermé</b>.' },
      { t: 32, ch: 2, html: 'Sens conventionnel : du <b>+</b> vers le <b>−</b> du générateur.' },
      { t: 46, ch: 3, html: '<b>Conducteurs</b> : métaux, graphite ; <b>isolants</b> : plastique, bois, verre.' }
    ],
    question: { q: 'Un objet qui laisse passer le courant est :', o: ['un isolant', 'un conducteur', 'un générateur', 'un interrupteur'], a: 1, e: 'Il permet à la lampe de briller.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Circuit avec une pile, une lampe, un interrupteur, des fils et une zone de test entre deux pinces où l’on place différents objets ; schéma normalisé et liste des conducteurs et isolants à droite',
    steps: [
      'Ouvre et ferme l’interrupteur (clique dessus) : que fait la lampe ?',
      'Débranche un fil : la lampe peut-elle briller ?',
      'Place différents objets entre les pinces : lesquels sont conducteurs ?',
      'Teste au moins 6 objets et relève tes résultats.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onToggle: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var cO = c.seg({ label: 'Objet placé entre les pinces', value: 'cuivre', options: Object.keys(OBJ).map(function (k) { return { v: k, l: OBJ[k].n }; }), onChange: function (v) { st.obj = v; api.sound('tick'); } });
      var tK = c.toggle({ label: 'Interrupteur fermé', value: true, onChange: function (v) { st.closed = v; } });
      var tL = c.toggle({ label: 'Tous les fils branchés', value: true, onChange: function (v) { st.linked = v; } });
      var tA = c.toggle({ label: 'Flèches du sens du courant', value: true, onChange: function (v) { st.arrows = v; } });
      var ro = api.readouts([{ k: 'c', label: 'Circuit' }, { k: 'l', label: 'Lampe' }, { k: 'n', label: 'Objets testés' }]);
      var last = {};
      api.loop(function () { last = lab.step(); tK.set(st.closed); ro.c.set(st.closed && st.linked ? 'fermé' : 'ouvert'); ro.l.set(last.on ? 'allumée' : 'éteinte'); ro.n.set(last.nT + ' / ' + Object.keys(OBJ).length); });
      var M = api.measure; M.innerHTML = '<h3>Mes tests</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cet objet'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (!(st.closed && st.linked)) { api.say('Ferme d’abord le circuit.'); return; } rows = rows.filter(function (r) { return r.k !== st.obj; }); rows.push({ k: st.obj, n: OBJ[st.obj].n, c: OBJ[st.obj].c }); api.sound('ok'); paint(); if (rows.length >= 6) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Objet</th><th>Lampe</th><th>Conclusion</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.n + '</td><td>' + (r.c ? 'brille' : 'éteinte') + '</td><td style="color:' + (r.c ? '#3DD68C' : '#FF8A80') + '">' + (r.c ? 'conducteur' : 'isolant') + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun objet relevé.</div>';
        api.chart.innerHTML = '<h3>Les symboles normalisés</h3><table class="mt"><tbody><tr><td>Pile</td><td>un trait long (+) et un trait court épais (−)</td></tr><tr><td>Lampe</td><td>un cercle barré d’une croix</td></tr><tr><td>Interrupteur</td><td>un trait levé (ouvert) ou couché (fermé)</td></tr><tr><td>Fil</td><td>un trait droit</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.closed = true; st.linked = true; st.obj = 'cuivre'; st.arrows = true; st.tested = {}; cO.set('cuivre'); tL.set(true); tA.set(true); rows = []; paint(); });
      api.say('Teste plusieurs objets entre les pinces.');
      return { bilan: function () {
        if (rows.length < 4) return '<p>Teste au moins 4 objets.</p>';
        return '<p>Un circuit électrique simple comprend un <b>générateur</b> (pile), un ou plusieurs <b>récepteurs</b> (lampe, moteur…), un <b>interrupteur</b> et des <b>fils de connexion</b>, formant une <b>boucle</b>.</p><p>Le courant ne circule que si le circuit est <b>fermé</b>. Par convention, il va de la borne <b>+</b> vers la borne <b>−</b> du générateur, à l’extérieur de celui-ci.</p><p>Les <b>conducteurs</b> laissent passer le courant : métaux (fer, cuivre, aluminium), graphite. Les <b>isolants</b> ne le laissent pas passer : plastique, bois, verre, caoutchouc, papier.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit électrique' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi du circuit',
    intro: 'Fils, interrupteur, objets mystères : allume la lampe !',
    missions: [
      { title: 'Panne !', text: 'La lampe ne brille pas. <b>Répare le circuit</b> pour l’allumer.', lumi: 'Vérifie tous les éléments de la boucle.', hint: 'Un fil est débranché et l’interrupteur est ouvert.',
        build: function (api) { var lab = mini(api, { linked: false, closed: false, obj: 'cuivre' }); api.c.toggle({ label: 'Rebrancher le fil', value: false, onChange: function (v) { lab.st.linked = v; } }); return function () { var r = lab.res(); return r.on ? { ok: true, msg: 'Circuit fermé : la lampe brille !' } : { ok: false, msg: !r.linked ? 'Un fil est encore débranché.' : 'L’interrupteur est ouvert (clique dessus).' }; }; },
        e: 'Le courant ne circule que dans une boucle fermée.' },
      { type: 'qcm', title: 'Symbole', text: 'Sur un schéma, la lampe est représentée par :', o: ['un rectangle', 'un cercle barré d’une croix', 'deux traits parallèles', 'un triangle'], a: 1, hint: 'Regarde le schéma normalisé.', e: 'Un cercle avec une croix.' },
      { title: 'Le bon objet', text: 'Il manque un morceau dans le circuit. Choisis un objet qui fait <span style="color:#FFC773">briller la lampe normalement</span>.', lumi: 'Il faut un bon conducteur.', hint: 'Un métal.',
        build: function (api) { var lab = mini(api, { obj: 'bois' }); api.c.seg({ label: 'Objet', value: 'bois', options: ['bois', 'plastique', 'mine', 'clou', 'verre'].map(function (k) { return { v: k, l: OBJ[k].n }; }), onChange: function (v) { lab.st.obj = v; } }); return function () { var r = lab.res(); return r.on && r.O.k === 1 ? { ok: true, msg: r.O.n + ' : conducteur !' } : { ok: false, msg: r.on ? 'Elle brille faiblement : cherche un meilleur conducteur.' : r.O.n + ' : isolant.' }; }; },
        e: 'Le fer du clou est un bon conducteur.' },
      { type: 'qcm', title: 'Le sens du courant', text: 'À l’extérieur de la pile, le courant circule :', o: ['de la borne − vers la borne +', 'de la borne + vers la borne −', 'dans les deux sens', 'il ne circule pas'], a: 1, hint: 'C’est une convention.', e: 'Du + vers le −.' },
      { title: 'Le détective', text: 'Teste les objets et trouve <b>4 conducteurs</b>.', lumi: 'Les métaux… et un autre !', hint: 'La mine de crayon conduit aussi.',
        build: function (api) { var lab = mini(api, { obj: 'papier', tested: {} }); api.c.seg({ label: 'Objet', value: 'papier', options: Object.keys(OBJ).map(function (k) { return { v: k, l: OBJ[k].n }; }), onChange: function (v) { lab.st.obj = v; } }); return function () { var r = lab.res(); return r.nC >= 4 ? { ok: true, msg: r.nC + ' conducteurs trouvés !' } : { ok: false, msg: r.nC + ' conducteur(s) trouvé(s) pour l’instant.' }; }; },
        e: 'Fer, cuivre, aluminium, pièce, graphite : des conducteurs.' }
    ]
  };

  S.start({
    id: '6e-circuit-electrique', level: '6e', theme: 'Électricité', title: 'Le circuit électrique', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un circuit électrique simple est constitué d’un <b>générateur</b> (pile), d’un ou plusieurs <b>récepteurs</b> (lampe, moteur…), d’un <b>interrupteur</b> et de <b>fils de connexion</b>, formant une <b>boucle</b>.',
      'Le courant électrique ne circule que si le circuit est <b>fermé</b>. Si le circuit est <b>ouvert</b> (interrupteur ouvert, fil débranché), il ne circule pas.',
      'Par convention, à l’extérieur du générateur, le courant circule de la borne <b>+</b> vers la borne <b>−</b>.',
      'Les <b>conducteurs</b> laissent passer le courant (métaux, graphite) ; les <b>isolants</b> ne le laissent pas passer (plastique, bois, verre, caoutchouc, papier).',
      'On représente un circuit par un <b>schéma normalisé</b> : chaque élément a un symbole.'
    ],
    quiz: [
      { q: 'Dans un circuit, la pile est :', o: ['le récepteur', 'le générateur', 'l’interrupteur', 'un isolant'], a: 1, e: 'Elle fournit le courant.' },
      { q: 'La lampe brille si le circuit est :', o: ['ouvert', 'fermé', 'coupé', 'sans pile'], a: 1, e: 'Le courant doit faire une boucle.' },
      { q: 'Lequel est un isolant ?', o: ['le cuivre', 'le fer', 'le plastique', 'l’aluminium'], a: 2, e: 'Le plastique ne conduit pas le courant.' },
      { q: 'La mine d’un crayon (graphite) est :', o: ['isolante', 'conductrice', 'un générateur', 'magnétique'], a: 1, e: 'Le graphite conduit le courant.' },
      { q: 'Le courant sort de la pile par :', o: ['la borne −', 'la borne +', 'le milieu', 'les deux bornes'], a: 1, e: 'Sens conventionnel : du + vers le −.' }
    ]
  });
})();
