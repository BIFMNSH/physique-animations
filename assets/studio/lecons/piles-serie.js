/* 5e · Électricité · Leçon : Association de piles en série */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729', LAMPS = [1.5, 3, 4.5, 6, 9];
  function total(P) { return P.reduce(function (a, p) { return a + (p.f ? -1 : 1) * p.u; }, 0); }
  function eqText(P) { if (!P.length) return 'aucune pile'; return P.map(function (p, i) { return (i ? (p.f ? ' − ' : ' + ') : (p.f ? '− ' : '')) + fmt(p.u, 1); }).join('') + ' = ' + fmt(total(P), 1) + ' V'; }

  function Lab(G, o) {
    var st = Object.assign({ piles: [{ u: 1.5, f: false }], Un: 3, closed: true, volt: true, xray: false, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 50, width: 500, height: 396, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var C = s('g', {}, G), vG = s('g', {}, G), Q = null, Y = 170;
    var PG = s('g', {}, C), key = '', cells = [];
    function cylinder(g, u, f) {
      var w = 80, h = 34;
      s('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: '#1A1D24', stroke: '#5B6680', 'stroke-width': 2 }, g);
      s('rect', { x: f ? -w / 2 : w / 2 - 24, y: -h / 2, width: 24, height: h, rx: 8, fill: '#C9853A' }, g);
      s('rect', { x: f ? -w / 2 - 6 : w / 2, y: -6, width: 6, height: 12, rx: 2, fill: '#C9D2E3' }, g);
      s('text', { x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#EEF2F8', text: fmt(u, 1) + ' V' }, g);
      s('text', { x: f ? -w / 2 + 8 : w / 2 - 8, y: -h / 2 - 6, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#FF8A80', text: '+' }, g);
      s('text', { x: f ? w / 2 - 8 : -w / 2 + 8, y: -h / 2 - 5, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#80B8FF', text: '−' }, g);
    }
    function build() {
      while (C.firstChild) C.removeChild(C.firstChild); while (vG.firstChild) vG.removeChild(vG.firstChild); cells = []; Q = { w: [] };
      var n = st.piles.length, sp = 84, xf = 290 - (n - 1) / 2 * sp, xl = 290 + (n - 1) / 2 * sp, jl = [xf - 58, 350], jr = [xl + 58, 350];
      var cab = function (A, dA, B, dB) { var w = E.cable(C, A, dA, B, dB); Q.w.push(w); return w; };
      /* porte-piles : les piles se touchent bout à bout (contacts à ressort), deux douilles aux extrémités */
      var tx = xf - 74, tw = xl - xf + 148;
      s('ellipse', { cx: 290, cy: 378, rx: tw / 2 + 6, ry: 7, fill: '#05080F', opacity: 0.4 }, C);
      s('rect', { x: tx, y: 322, width: tw, height: 56, rx: 8, fill: '#2B3548', stroke: '#5B6680', 'stroke-width': 2 }, C);
      s('rect', { x: tx + 4, y: 326, width: tw - 8, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.12 }, C);
      [jl, jr].forEach(function (j) { s('circle', { cx: j[0], cy: j[1], r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, C); s('circle', { cx: j[0], cy: j[1], r: 2.8, fill: '#2A2F38' }, C); });
      PG = s('g', {}, C);
      st.piles.forEach(function (p, i) {
        var x = xf + i * sp, g = s('g', { transform: 'translate(' + x + ' 350)', style: 'cursor:pointer', role: 'button', 'aria-label': 'Pile ' + fmt(p.u, 1) + ' V : cliquer pour la retourner' }, PG);
        if (p.u === 4.5) { var b = E.battery(g, 0, 0, { U: 4.5, flip: p.f, w: 80, h: 44 }); if (st.xray) { s('rect', { x: -38, y: -10, width: 76, height: 30, rx: 5, fill: '#0B1220' }, g); [-25, 0, 25].forEach(function (dx) { var c = s('g', { transform: 'translate(' + dx + ' 5) scale(0.3)' }, g); cylinder(c, 1.5, p.f); }); } }
        else cylinder(g, p.u, p.f);
        if (p.f) s('text', { x: 0, y: 42, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#FF8A80', text: 'retournée' }, g);
        g.addEventListener('click', function () { p.f = !p.f; key = ''; o.onFlip && o.onFlip(); });
        cells.push(g);
      });
      /* circuit : douille gauche → K → lampe → douille droite */
      Q.K = E.switchK(C, 110, Y, 170, { label: 'K', onToggle: function (c) { st.closed = c; } });
      Q.lp = E.lamp(C, 290, Y, { r: 24 }); Q.lpL = s('text', { x: 290, y: Y + 44, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, C);
      cab(jl, -1, [110, Y], -1); cab([170, Y], 1, [266, Y], -1); cab([314, Y], 1, jr, 1);
      /* voltmètre aux bornes de l'association */
      var mx = 290, my = 424, red = '#D9423B', blk = '#2B2F38';
      s('rect', { x: mx - 62, y: my - 22, width: 124, height: 44, rx: 8, fill: '#26303F', stroke: '#5B6680', 'stroke-width': 2 }, vG);
      s('rect', { x: mx - 48, y: my - 16, width: 96, height: 26, rx: 5, fill: '#071016', stroke: '#4FC3FF', 'stroke-width': 1.5 }, vG);
      Q.vt = s('text', { x: mx, y: my + 4, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#9BF0C5', 'font-family': 'ui-monospace,Menlo,monospace' }, vG);
      s('text', { x: mx - 56, y: my - 26, 'font-size': 11, 'font-weight': 900, fill: '#4FC3FF', text: 'V' }, vG);
      [[mx - 62, red], [mx + 62, blk]].forEach(function (m) { s('circle', { cx: m[0], cy: my, r: 7, fill: '#C9CED8', stroke: '#6B7480', 'stroke-width': 1.6 }, vG); s('circle', { cx: m[0], cy: my, r: 2.8, fill: '#2A2F38' }, vG); });
      E.wire(vG, 'M' + (mx - 62) + ' ' + my + ' C' + (mx - 122) + ' ' + my + ' ' + jl[0] + ' ' + (jl[1] + 58) + ' ' + jl[0] + ' ' + jl[1], { col: red });
      E.wire(vG, 'M' + (mx + 62) + ' ' + my + ' C' + (mx + 122) + ' ' + my + ' ' + jr[0] + ' ' + (jr[1] + 58) + ' ' + jr[0] + ' ' + jr[1], { col: blk });
    }
    /* schéma normalisé */
    var PX = 560, SCH = s('g', {}, G), SG, sKey = '';
    s('rect', { x: PX, y: 22, width: 280, height: 172, rx: 16, fill: '#F7F4EA' }, SCH); s('text', { x: PX + 18, y: 46, 'font-size': 12, 'font-weight': 900, fill: '#3A3426', text: 'SCHÉMA NORMALISÉ' }, SCH);
    SG = s('g', {}, SCH);
    function schema(on) {
      var k = JSON.stringify(st.piles) + st.closed + st.volt + on; if (k === sKey) return; sKey = k; while (SG.firstChild) SG.removeChild(SG.firstChild);
      var ink = '#1E2430', X0 = PX + 36, X1 = PX + 244, Y0 = 78, Y1 = 128, n = st.piles.length, xm = (X0 + X1) / 2;
      s('path', { d: 'M' + X0 + ' ' + Y0 + 'H' + X1 + 'V' + Y1 + 'H' + X0 + 'Z', fill: 'none', stroke: ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, SG);
      E.sym(SG, 'K', X0 + 52, Y0, { closed: st.closed }); E.sym(SG, 'L', X1 - 52, Y0, { on: on });
      s('text', { x: X0 + 52, y: Y0 - 10, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: ink, text: 'K' }, SG); s('text', { x: X1 - 52, y: Y0 - 16, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: ink, text: 'L' }, SG);
      st.piles.forEach(function (p, i) { var x = xm + (i - (n - 1) / 2) * 42; E.sym(SG, 'G', x, Y1, { flip: p.f, nolabel: n > 1 }); s('text', { x: x, y: Y1 + 24, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 800, fill: p.f ? '#C0392B' : ink, text: fmt(p.u, 1) + ' V' }, SG); });
      if (st.volt) { s('path', { d: 'M' + (X0 + 14) + ' ' + Y1 + 'V' + (Y1 + 36) + 'H' + (X0 + 40) + 'M' + (X0 + 62) + ' ' + (Y1 + 36) + 'H' + (X1 - 14) + 'V' + Y1, fill: 'none', stroke: ink, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, SG); s('circle', { cx: X0 + 51, cy: Y1 + 36, r: 11, fill: '#F7F4EA', stroke: ink, 'stroke-width': 2 }, SG); s('text', { x: X0 + 51, y: Y1 + 41, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: ink, text: 'V' }, SG); }
    }
    var P = s('g', {}, G);
    s('rect', { x: PX, y: 204, width: 280, height: 242, rx: 16, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 20, y: 226, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'TENSION DE L’ASSOCIATION' }, P);
    var eq = s('text', { x: PX + 140, y: 252, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#FFC773' }, P);
    var eqs = s('text', { x: PX + 140, y: 268, 'text-anchor': 'middle', 'font-size': 11.5, fill: '#A9B4C7' }, P);
    var bars = s('g', {}, P);
    s('text', { x: PX + 20, y: 358, 'font-size': 12.5, fill: '#C9D2E3', text: 'tension nominale de la lampe' }, P); var tUn = s('text', { x: PX + 260, y: 358, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: '#3DD68C' }, P);
    var vb = s('rect', { x: PX + 20, y: 366, width: 240, height: 30, rx: 15 }, P), vt = s('text', { x: PX + 140, y: 386, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0B1220' }, P);
    var rule = [0, 1].map(function (k) { return s('text', { x: PX + 140, y: 417 + k * 16, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P); });
    var KC = { off: '#7D89A3', low: '#4FC3FF', ok: '#3DD68C', high: '#FFB547', burn: '#FF5A4E' }, bkey = '';
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, k = JSON.stringify(st.piles) + st.xray;
      if (k !== key) { key = k; build(); }
      Q.K.set(st.closed);
      var U = total(st.piles), Ua = Math.abs(U), ls = E.lampState(st.closed ? Ua : 0, st.Un);
      Q.lp.set(ls.k === 'burn' ? 2 : ls.b); Q.lpL.textContent = 'lampe ' + E.v(st.Un);
      var I = st.closed && ls.k !== 'off' ? 0.8 : 0; Q.w.forEach(function (w) { w.flow(I, T); }); schema(I > 0);
      vG.style.display = st.volt ? '' : 'none'; Q.vt.textContent = (U < 0 ? '−' : '') + fmt(Ua, 2) + ' V';
      eq.textContent = eqText(st.piles); eqs.textContent = st.piles.some(function (p) { return p.f; }) ? 'une pile retournée se soustrait' : st.piles.length > 1 ? 'piles en concordance : les tensions s’ajoutent' : '';
      if (bkey !== k) { bkey = k; while (bars.firstChild) bars.removeChild(bars.firstChild); var x = PX + 20, sc = 240 / 12; st.piles.forEach(function (p) { var w = p.u * sc; s('rect', { x: p.f ? x - w : x, y: p.f ? 290 : 276, width: w, height: 12, rx: 4, fill: p.f ? '#FF8A80' : '#FFB547', stroke: '#0F1729', 'stroke-width': 1.5 }, bars); x += p.f ? -w : w; }); s('rect', { x: PX + 20, y: 308, width: Math.max(0, U) * sc, height: 14, rx: 5, fill: '#3DD68C' }, bars); for (var g2 = 0; g2 <= 12; g2 += 3) s('text', { x: PX + 20 + g2 * sc, y: 340, 'text-anchor': 'middle', 'font-size': 10, fill: '#7D89A3', text: g2 }, bars); }
      tUn.textContent = E.v(st.Un);
      var kk = st.closed ? ls.k : 'off'; vb.setAttribute('fill', KC[kk]); vt.textContent = !st.closed ? 'CIRCUIT OUVERT' : { off: 'LA LAMPE NE BRILLE PAS', low: 'SOUS-TENSION', ok: 'ÉCLAT NORMAL', high: 'SURTENSION', burn: 'FORTE SURTENSION' }[ls.k];
      rule[0].textContent = 'En série : borne + reliée au − de la suivante,'; rule[1].textContent = 'les tensions s’ajoutent.';
      return { U: U, ls: ls, n: st.piles.length, flips: st.piles.filter(function (p) { return p.f; }).length, piles: st.piles };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Une seule pile' }, { t: 10, title: 'Deux piles en série' }, { t: 22, title: 'Trois piles en série' }, { t: 32, title: 'Une pile retournée' }, { t: 44, title: 'Le secret de la pile plate' }, { t: 55, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Piles en <b>série</b> : + relié au − de la suivante', 'la tension totale est la <b>somme</b> des tensions.', '#FFB547'],
      ['Une pile <b>retournée</b> se soustrait', 'les piles doivent être en concordance.', '#FF8A80'],
      ['La <b>pile plate 4,5 V</b> contient 3 éléments de 1,5 V', 'associés en série : 1,5 + 1,5 + 1,5 = 4,5 V.', '#3DD68C']], [55.2, 59.6, 64]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function P(list) { return list.map(function (x) { return { u: x[0], f: !!x[1] }; }); }
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 55.2)) {
        st.t = t; st.xray = false;
        if (t < 10) { st.piles = P([[1.5]]); st.Un = 3; }
        else if (t < 22) { st.piles = P([[1.5], [1.5]]); st.Un = 3; }
        else if (t < 32) { st.piles = P([[1.5], [1.5], [1.5]]); st.Un = 4.5; }
        else if (t < 44) { st.piles = P([[1.5], [1.5, t > 35], [1.5]]); st.Un = 4.5; }
        else { st.piles = P([[4.5]]); st.Un = 4.5; st.xray = t > 47; }
        lab.step();
        tg.show(t, 2, 9.6, 290, 92, '1,5 V pour une lampe 3 V : éclat faible') || tg.show(t, 12, 21.6, 290, 92, '1,5 + 1,5 = 3 V : éclat normal') || tg.show(t, 24, 31.6, 290, 92, '1,5 + 1,5 + 1,5 = 4,5 V') ||
          tg.show(t, 35.4, 43.6, 290, 92, 'P2 retournée : 1,5 − 1,5 + 1,5 = 1,5 V') || tg.show(t, 47.4, 54.6, 290, 92, 'À l’intérieur : 3 éléments de 1,5 V');
      }
      bg.setAttribute('opacity', t > 54.8 ? 1 : 0);
      K.group(g5, t, 54.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une, deux puis trois piles de 1,5 V placées en série dans un circuit avec une lampe et un voltmètre ; l’éclat augmente avec la tension totale ; une pile retournée diminue la tension ; enfin l’intérieur d’une pile plate 4,5 V révèle trois éléments de 1,5 V',
    duration: 69, chapters: CH,
    segs: [
      { t: 0, d: 4.4, say: 'Une pile de un virgule cinq volt alimente une lampe de trois volts.', sub: 'Une pile <b>1,5 V</b>, une lampe <b>3 V</b>…' },
      { t: 4.6, d: 5.2, say: 'La lampe brille faiblement : la tension est trop petite.', sub: '…éclat faible : tension trop petite.' },
      { t: 10, d: 6, say: 'Ajoutons une deuxième pile : la borne plus de la première est reliée à la borne moins de la deuxième. Elles sont en série.', sub: 'Borne + reliée à la borne − : piles <b>en série</b>.' },
      { t: 16.2, d: 5.6, say: 'Le voltmètre indique trois volts : un virgule cinq plus un virgule cinq. La lampe brille normalement.', sub: '1,5 + 1,5 = <b>3 V</b> : éclat normal.' },
      { t: 22, d: 9.6, say: 'Avec trois piles en série, la tension totale vaut quatre virgule cinq volts. Les tensions s’ajoutent.', sub: 'Trois piles : 1,5 + 1,5 + 1,5 = <b>4,5 V</b>.' },
      { t: 32, d: 3.2, say: 'Mais attention : retournons une des piles.', sub: 'Retournons une pile…' },
      { t: 35.4, d: 8.4, say: 'La tension tombe à un virgule cinq volt : une pile retournée se soustrait. Les piles doivent être en concordance.', sub: '…une pile retournée <b>se soustrait</b> : 1,5 V seulement.' },
      { t: 44, d: 3.2, say: 'Et la pile plate de quatre virgule cinq volts ?', sub: 'Et la pile plate 4,5 V ?' },
      { t: 47.4, d: 7.4, say: 'À l’intérieur, il y a trois petits éléments de un virgule cinq volt… montés en série !', sub: 'Trois éléments de 1,5 V <b>en série</b>.' },
      { t: 55, d: 4.4, say: 'À retenir : des piles sont en série quand la borne plus de l’une est reliée à la borne moins de la suivante.', sub: 'Série : borne + → borne − de la suivante.' },
      { t: 59.6, d: 4.2, say: 'La tension de l’association est la somme des tensions.', sub: 'Les tensions <b>s’ajoutent</b>.' },
      { t: 64, d: 5, say: 'Une pile retournée diminue la tension totale.', sub: 'Une pile retournée <b>se soustrait</b>.' }
    ],
    learn: [
      { t: 9, ch: 0, html: 'Une seule pile 1,5 V : <b>sous-tension</b> pour une lampe 3 V.' },
      { t: 21, ch: 1, html: 'En série : U = U<sub>1</sub> + U<sub>2</sub>.' },
      { t: 43, ch: 3, html: 'Une pile <b>retournée</b> se soustrait.' },
      { t: 54, ch: 4, html: 'Pile plate 4,5 V = <b>3 × 1,5 V</b> en série.' }
    ],
    question: { q: 'Deux piles de 4,5 V en série (en concordance) donnent :', o: ['4,5 V', '0 V', '9 V', '2,25 V'], a: 2, e: 'Les tensions s’ajoutent : 4,5 + 4,5 = 9 V.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Montage', r: [40, 50, 500, 396] }, { n: 'Schéma', r: [560, 22, 280, 172] }, { n: 'Tension', r: [560, 204, 280, 242] }],
    alt: 'Circuit avec une lampe, un interrupteur et jusqu’à quatre piles en série que l’on peut ajouter, retirer ou retourner ; un voltmètre mesure la tension de l’association, affichée à droite avec un bilan',
    steps: [
      'Ajoute des piles de 1,5 V une à une : que mesure le voltmètre ?',
      'Clique sur une pile pour la retourner : que devient la tension ?',
      'Combine des piles de 1,5 V et de 4,5 V pour obtenir 6 V.',
      'Pour chaque lampe, trouve l’association de piles adaptée. Relève tes essais.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onFlip: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      var r1 = c.row();
      c.button({ label: '+ pile 1,5 V', sm: true, into: r1, onClick: function () { if (st.piles.length < 4) { st.piles.push({ u: 1.5, f: false }); api.sound('tick'); } } });
      c.button({ label: '+ pile 4,5 V', sm: true, into: r1, onClick: function () { if (st.piles.length < 4) { st.piles.push({ u: 4.5, f: false }); api.sound('tick'); } } });
      c.button({ label: 'Retirer la dernière', sm: true, into: r1, onClick: function () { st.piles.pop(); } });
      var cL = c.seg({ label: 'Lampe', value: 3, options: LAMPS.map(function (u) { return { v: u, l: E.v(u) }; }), onChange: function (v) { st.Un = v; } });
      var tV = c.toggle({ label: 'Voltmètre', value: true, onChange: function (v) { st.volt = v; } });
      var tX = c.toggle({ label: 'Voir l’intérieur des piles 4,5 V', value: false, onChange: function (v) { st.xray = v; } });
      var ro = api.readouts([{ k: 'n', label: 'Piles' }, { k: 'u', label: 'Tension totale' }, { k: 'e', label: 'Lampe' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.n.set(last.n + (last.flips ? ' (' + last.flips + ' retournée' + (last.flips > 1 ? 's' : '') + ')' : '')); ro.u.set(fmt(last.U, 1) + ' V'); ro.e.set(st.closed ? last.ls.t.split(' : ')[0] : 'circuit ouvert'); });
      var M = api.measure; M.innerHTML = '<h3>Mes associations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ a: eqText(st.piles), l: E.v(st.Un), o: last.ls.t.split(' : ')[0] }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Association</th><th>Lampe</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.a + '</td><td>' + r.l + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune association relevée.</div>';
        api.chart.innerHTML = '<h3>Nombre de piles de 1,5 V en série</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'nombre de piles', ylabel: 'tension (V)', xmin: 0, xmax: 4, xstep: 1, ymin: 0, ymax: 6, ystep: 1.5, series: [{ color: '#FFB547', pts: [[0, 0], [1, 1.5], [2, 3], [3, 4.5], [4, 6]], fit: true }] });
      }
      paint();
      api.onReset(function () { st.piles = [{ u: 1.5, f: false }]; st.Un = 3; st.volt = true; st.xray = false; st.closed = true; cL.set(3); tV.set(true); tX.set(false); rows = []; paint(); });
      api.say('Ajoute une deuxième pile de 1,5 V.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 associations différentes.</p>';
        return '<p>Des piles sont <b>en série</b> quand la borne + de l’une est reliée à la borne − de la suivante (piles en <b>concordance</b>). La tension de l’association est la <b>somme</b> des tensions : U = U<sub>1</sub> + U<sub>2</sub> + …</p><p>Une pile <b>retournée</b> (en opposition) se soustrait : la tension totale diminue.</p><p>On associe des piles en série pour obtenir une tension adaptée au récepteur. La pile plate 4,5 V contient trois éléments de 1,5 V en série.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit avec des piles en série' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function adders(api, lab, us) { var r = api.c.row(); us.forEach(function (u) { api.c.button({ label: '+ pile ' + fmt(u, 1) + ' V', sm: true, into: r, onClick: function () { if (lab.st.piles.length < 4) lab.st.piles.push({ u: u, f: false }); } }); }); api.c.button({ label: 'Retirer', sm: true, into: r, onClick: function () { lab.st.piles.pop(); } }); }
  var DEFI = {
    title: 'Le défi des piles',
    intro: 'Empile, retourne, combine : obtiens la bonne tension !',
    missions: [
      { title: 'Comme une pile plate', text: 'Avec des piles de <b>1,5 V</b> seulement, obtiens <span style="color:var(--amber)">4,5 V</span>.', lumi: 'Combien de fois 1,5 V dans 4,5 V ?', hint: 'Trois piles en concordance.',
        build: function (api) { var lab = mini(api, { piles: [], Un: 4.5 }); adders(api, lab, [1.5]); return function () { var r = lab.res(); return Math.abs(r.U - 4.5) < 0.01 ? { ok: true, msg: '1,5 + 1,5 + 1,5 = 4,5 V.' } : { ok: false, msg: 'Tension actuelle : ' + fmt(r.U, 1) + ' V.' }; }; },
        e: 'Trois piles de 1,5 V en série : 4,5 V.' },
      { type: 'qcm', title: 'Deux piles plates', text: 'Deux piles de 4,5 V en série, bien branchées, donnent :', o: ['4,5 V', '9 V', '0 V', '3 V'], a: 1, hint: 'Les tensions s’ajoutent.', e: '4,5 + 4,5 = 9 V.' },
      { title: 'L’intrus', text: 'La lampe brille faiblement : une pile est mal placée. <b>Clique dessus</b> pour la remettre dans le bon sens.', lumi: 'Cherche la pile dont le + est du mauvais côté.', hint: 'Toutes les bornes + doivent être du même côté.',
        build: function (api) { var lab = mini(api, { piles: [{ u: 1.5, f: false }, { u: 1.5, f: true }, { u: 1.5, f: false }], Un: 4.5 }); return function () { var r = lab.res(); return r.flips === 0 && Math.abs(r.U - 4.5) < 0.01 ? { ok: true, msg: 'Concordance retrouvée : 4,5 V, éclat normal.' } : { ok: false, msg: 'Il reste ' + r.flips + ' pile(s) retournée(s).' }; }; },
        e: 'Une pile retournée se soustrait : il faut toutes les piles en concordance.' },
      { type: 'qcm', title: 'En opposition', text: 'Une pile de 4,5 V et une pile de 1,5 V sont en série, mais la 1,5 V est retournée. La tension vaut :', o: ['6 V', '4,5 V', '3 V', '1,5 V'], a: 2, hint: 'Elle se soustrait.', e: '4,5 − 1,5 = 3 V.' },
      { title: 'La lampe 6 V', text: 'Fais briller la <span style="color:#3DD68C">lampe 6 V</span> normalement avec les piles disponibles.', lumi: 'Il y a plusieurs solutions !', hint: '4,5 + 1,5… ou 4 × 1,5.',
        build: function (api) { var lab = mini(api, { piles: [], Un: 6 }); adders(api, lab, [1.5, 4.5]); return function () { var r = lab.res(); return r.ls.k === 'ok' && Math.abs(r.U - 6) < 0.01 ? { ok: true, msg: eqText(r.piles) + ' : éclat normal !' } : { ok: false, msg: 'Tension : ' + fmt(r.U, 1) + ' V.' }; }; },
        e: 'Par exemple 4,5 + 1,5 = 6 V, ou 1,5 + 1,5 + 1,5 + 1,5 = 6 V.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Une seule pile ne fournit pas la tension souhaitée. Que se passe-t-il si on associe plusieurs piles et si on change leur sens ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '5e-piles-serie', level: '5e', theme: 'Électricité', title: 'Association de piles en série', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Des piles sont associées <b>en série</b> lorsque la borne + de l’une est reliée à la borne − de la suivante (piles en <b>concordance</b>).',
      'La tension aux bornes de l’association est égale à la <b>somme</b> des tensions des piles : U = U<sub>1</sub> + U<sub>2</sub> + U<sub>3</sub> + …',
      'Si une pile est <b>retournée</b> (en opposition), sa tension se <b>soustrait</b> : la tension totale diminue.',
      'On associe des piles en série pour obtenir une tension <b>adaptée</b> au récepteur.',
      'Une pile plate de 4,5 V est constituée de <b>trois éléments de 1,5 V</b> associés en série.'
    ],
    quiz: [
      { q: 'Trois piles de 1,5 V en série (concordance) :', o: ['1,5 V', '3 V', '4,5 V', '0,5 V'], a: 2, e: '1,5 × 3 = 4,5 V.' },
      { q: 'Dans une association en série, on relie :', o: ['+ avec +', '− avec −', '+ d’une pile avec − de la suivante', 'n’importe comment'], a: 2, e: 'C’est la concordance.' },
      { q: 'Deux piles de 1,5 V, l’une retournée :', o: ['3 V', '0 V', '1,5 V', '6 V'], a: 1, e: '1,5 − 1,5 = 0 V : la lampe ne brille pas.' },
      { q: 'Pour une lampe 9 V, on peut associer en série :', o: ['deux piles 4,5 V', 'une pile 1,5 V', 'deux piles 1,5 V', 'une pile 4,5 V'], a: 0, e: '4,5 + 4,5 = 9 V.' },
      { q: 'Une pile plate 4,5 V contient :', o: ['un élément de 4,5 V', 'trois éléments de 1,5 V en série', 'deux éléments de 2,25 V en opposition', 'neuf éléments'], a: 1, e: '3 × 1,5 V en série.' }
    ]
  });
})();

