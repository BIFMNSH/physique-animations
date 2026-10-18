/* 5e · Propriétés physiques de la matière · Leçon : Dilatation des solides */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, TK = window.ThermoKit;
  var MET = { alu: { n: 'aluminium', a: 23e-6, c: '#C9D2E3' }, cuivre: { n: 'cuivre', a: 17e-6, c: '#D9783F' }, fer: { n: 'fer', a: 12e-6, c: '#8D96A8' } };
  var A_ACIER = 12e-6, D0 = 30, DR0 = 30.05, L0 = 500, RAIL = 18000;
  function pix(D) { return 40 + (D - 30) * 220; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'anneau', hot: 'boule', T: 20, drop: 0, dropping: false, met: 'alu', Tb: 20, Tr: 30, joint: true, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- BOULE ET ANNEAU ---------- */
    var A = s('g', {}, G);
    s('path', { d: 'M110 410 H470 M150 410 V160 H230', stroke: '#7D89A3', 'stroke-width': 6, fill: 'none' }, A);
    var ring = s('ellipse', { cx: 290, cy: 260, fill: 'none', 'stroke-width': 10 }, A), ringFront = s('path', { fill: 'none', 'stroke-width': 10 }, A);
    s('path', { d: 'M230 160 H262 V248', stroke: '#7D89A3', 'stroke-width': 5, fill: 'none' }, A);
    var chain = s('line', { x1: 290, x2: 290, y1: 60, stroke: '#9AA6BC', 'stroke-width': 2.5, 'stroke-dasharray': '4 3' }, A);
    var ballG = s('circle', { cx: 290, fill: TK.glow(G, '#FF7A2E'), opacity: 0 }, A), ball = s('circle', { cx: 290, stroke: '#2A2F38', 'stroke-width': 2 }, A);
    var bun = TK.burner(A, 420, 410), aMsg = s('text', { x: 290, y: 436, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, A);
    s('text', { x: 520, y: 64, 'text-anchor': 'end', 'font-size': 11, fill: '#7D89A3', text: 'dilatation exagérée sur le dessin' }, A);
    /* ---------- BARRE ---------- */
    var B = s('g', {}, G);
    s('rect', { x: 70, y: 200, width: 30, height: 120, rx: 4, fill: '#5B6680' }, B); s('rect', { x: 60, y: 320, width: 380, height: 14, rx: 4, fill: '#3A4560' }, B);
    var flames = [170, 250, 330].map(function (x) { return TK.burner(B, x, 320); });
    var bar = s('rect', { x: 100, y: 236, height: 24, rx: 4 }, B), barG = s('rect', { x: 100, y: 226, height: 44, rx: 10, fill: TK.glow(G, '#FF7A2E'), opacity: 0 }, B);
    var DX = 470, DY = 248, dial = s('g', {}, B);
    s('circle', { cx: DX, cy: DY, r: 56, fill: '#F7F4EA', stroke: '#C9A86A', 'stroke-width': 6 }, dial);
    for (var m = 0; m <= 5; m++) { var a = (-60 + m * 24) * Math.PI / 180; s('line', { x1: DX + 44 * Math.sin(a), y1: DY - 44 * Math.cos(a), x2: DX + 52 * Math.sin(a), y2: DY - 52 * Math.cos(a), stroke: '#3A3426', 'stroke-width': 2 }, dial); s('text', { x: DX + 34 * Math.sin(a), y: DY - 34 * Math.cos(a) + 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 800, fill: '#3A3426', text: m }, dial); }
    s('text', { x: DX, y: DY + 26, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 800, fill: '#6B624C', text: 'mm' }, dial);
    var needle = s('path', { d: 'M' + (DX - 3) + ' ' + DY + ' L' + DX + ' ' + (DY - 46) + ' L' + (DX + 3) + ' ' + DY + 'Z', fill: '#C62828' }, dial); s('circle', { cx: DX, cy: DY, r: 5, fill: '#3A3426' }, dial);
    var push = s('line', { y1: 248, y2: 248, stroke: '#9AA6BC', 'stroke-width': 4 }, B);
    var bMsg = s('text', { x: 270, y: 380, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, B), bMsg2 = s('text', { x: 270, y: 404, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, B);
    s('text', { x: 250, y: 190, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'barre métallique de 50 cm' }, B);
    /* ---------- RAILS ---------- */
    var R = s('g', {}, G), sun = s('circle', { cx: 470, cy: 96, r: 30, fill: '#FFC773' }, R), sunG = s('circle', { cx: 470, cy: 96, r: 70, fill: TK.glow(G, '#FFC773') }, R);
    s('rect', { x: 40, y: 300, width: 500, height: 146, fill: '#3A3328' }, R);
    for (var i = 0; i < 13; i++) s('rect', { x: 52 + i * 38, y: 262, width: 18, height: 70, rx: 2, fill: '#6B4F34' }, R);
    var r1 = s('path', { fill: 'none', stroke: '#C9D2E3', 'stroke-width': 9, 'stroke-linecap': 'butt' }, R), r2 = s('path', { fill: 'none', stroke: '#C9D2E3', 'stroke-width': 9 }, R);
    var r1b = s('path', { fill: 'none', stroke: '#C9D2E3', 'stroke-width': 9 }, R), r2b = s('path', { fill: 'none', stroke: '#C9D2E3', 'stroke-width': 9 }, R);
    var zoomG = s('g', {}, R); s('circle', { cx: 290, cy: 160, r: 62, fill: '#0B1220', stroke: '#FFC773', 'stroke-width': 3 }, zoomG); s('line', { x1: 290, y1: 222, x2: 290, y2: 266, stroke: '#FFC773', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, zoomG);
    var zl = s('rect', { y: 148, height: 24, fill: '#C9D2E3' }, zoomG), zr = s('rect', { y: 148, height: 24, fill: '#C9D2E3' }, zoomG), zT = s('text', { x: 290, y: 200, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773' }, zoomG);
    s('text', { x: 290, y: 116, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'joint de dilatation (zoom)' }, zoomG);
    var rMsg = s('text', { x: 290, y: 380, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#EEF2F8' }, R), rMsg2 = s('text', { x: 290, y: 404, 'text-anchor': 'middle', 'font-size': 12, fill: '#E6D3B8' }, R);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var th = TK.thermometer(P, PX + 40, 70, 180, 0, 500), thR = TK.thermometer(P, PX + 40, 70, 180, 0, 70);
    var pv = s('text', { x: PX + 178, y: 90, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P), pv1 = s('text', { x: PX + 178, y: 124, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 900, fill: '#FFC773' }, P), pv2 = s('text', { x: PX + 178, y: 148, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    var pv3 = s('text', { x: PX + 178, y: 186, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P), pv4 = s('text', { x: PX + 178, y: 206, 'text-anchor': 'middle', 'font-size': 12, fill: '#C9D2E3' }, P);
    s('text', { x: PX + 20, y: 296, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'À L’ÉCHELLE DES PARTICULES' }, P);
    var lp = TK.particles(P, PX + 20, 304, 240, 132, 'solide', '#9AA6BC');
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'anneau' ? '' : 'none'; B.style.display = st.mode === 'barre' ? '' : 'none'; R.style.display = st.mode === 'rail' ? '' : 'none';
      th.g.style.display = st.mode === 'rail' ? 'none' : ''; thR.g.style.display = st.mode === 'rail' ? '' : 'none';
      var Tobj = st.mode === 'anneau' ? st.T : st.mode === 'barre' ? st.Tb : st.Tr;
      if (st.mode === 'anneau') {
        var Tb = st.hot === 'boule' ? st.T : 20, Tr = st.hot === 'anneau' ? st.T : 20, Db = D0 * (1 + A_ACIER * (Tb - 20)), Dr = DR0 * (1 + A_ACIER * (Tr - 20)), passes = Db <= Dr;
        var rb = pix(Db), rr = pix(Dr);
        if (st.dropping && st.t == null) { st.drop = Math.min(1, st.drop + dt / 1.2); if (st.drop >= 1) st.dropping = false; }
        var y0 = 140, yStop = 260 - Math.sqrt(Math.max(0, rb * rb - rr * rr)) - 2, yEnd = 360, by = passes ? y0 + (yEnd - y0) * st.drop : Math.min(y0 + (yEnd - y0) * st.drop, yStop);
        var ringCol = TK.hotMetal('#8D96A8', Tr); attr(ring, { rx: rr + 5, ry: 14, stroke: ringCol }); ringFront.setAttribute('d', 'M' + (290 - rr - 5) + ' 260 A' + (rr + 5) + ' 14 0 0 0 ' + (290 + rr + 5) + ' 260'); ringFront.setAttribute('stroke', ringCol);
        attr(ball, { cy: by, r: rb, fill: TK.hotMetal('#6B7280', Tb) }); attr(ballG, { cy: by, r: rb * 1.8, opacity: Math.max(0, (Tb - 120) / 380) * 0.8 }); attr(chain, { y2: by - rb });
        A.appendChild(ringFront);
        bun.set(st.T > 25 ? Math.min(1, (st.T - 20) / 300) : 0, T); bun.g.setAttribute('transform', st.hot === 'boule' ? 'translate(290 ' + Math.min(470, by + rb + 120) + ')' : 'translate(420 410)'); bun.g.style.display = st.T > 25 && st.drop < 0.05 ? '' : 'none';
        aMsg.textContent = st.drop > 0.6 ? (passes ? 'La boule passe à travers l’anneau.' : 'La boule ne passe plus : elle s’est dilatée !') : st.hot === 'boule' ? (Tb > 25 ? 'Boule chauffée à ' + Math.round(Tb) + ' °C' : 'Boule et anneau à la même température') : 'Anneau chauffé à ' + Math.round(Tr) + ' °C';
        pv.textContent = 'DIAMÈTRES'; pv1.textContent = 'boule ' + fmt(Db, 3) + ' mm'; pv2.textContent = 'anneau ' + fmt(Dr, 3) + ' mm'; pv3.textContent = passes ? 'boule ≤ anneau : elle passe' : 'boule > anneau : elle bloque'; pv4.textContent = '';
        res = { passes: passes, stuck: !passes && st.drop >= 1, drop: st.drop, Db: Db };
      } else if (st.mode === 'barre') {
        var M = MET[st.met], dL = M.a * L0 * (st.Tb - 20), Lpx = 300 + dL * 6;
        attr(bar, { width: Lpx, fill: TK.hotMetal(M.c, st.Tb) }); attr(barG, { width: Lpx, opacity: Math.max(0, (st.Tb - 200) / 300) * 0.7 });
        attr(push, { x1: 100 + Lpx, x2: DX - 50 });
        flames.forEach(function (f) { f.set(st.Tb > 25 ? Math.min(1, (st.Tb - 20) / 300) : 0, T); });
        needle.setAttribute('transform', 'rotate(' + (-60 + Math.min(5, dL) * 24) + ' ' + DX + ' ' + DY + ')');
        bMsg.textContent = 'Allongement : ' + fmt(dL, 2) + ' mm'; bMsg2.textContent = 'barre en ' + M.n + ' chauffée à ' + Math.round(st.Tb) + ' °C';
        pv.textContent = 'ALLONGEMENT'; pv1.textContent = fmt(dL, 2) + ' mm'; pv2.textContent = M.n + ', 50 cm'; pv3.textContent = 'aluminium > cuivre > fer'; pv4.textContent = 'à température égale';
        res = { dL: dL, met: st.met, Tb: st.Tb };
      } else {
        var g0 = st.joint ? 10 : 0, gap = g0 - A_ACIER * RAIL * (st.Tr - 20), comp = Math.max(0, -gap), buck = Math.min(30, comp * 3);
        sun.setAttribute('opacity', Math.min(1, (st.Tr - 5) / 45)); sunG.setAttribute('opacity', Math.min(1, (st.Tr - 20) / 40));
        var gp = Math.max(0, gap) * 3, xm = 290;
        function railPath(x0, x1, y, b) { var d = 'M' + x0 + ' ' + y; for (var x = x0; x <= x1; x += 10) d += ' L' + x + ' ' + (y - b * Math.sin(Math.PI * (x - x0) / (x1 - x0))); return d; }
        r1.setAttribute('d', railPath(40, xm - gp / 2, 280, buck)); r2.setAttribute('d', railPath(xm + gp / 2, 540, 280, buck));
        r1b.setAttribute('d', railPath(40, xm - gp / 2, 314, buck)); r2b.setAttribute('d', railPath(xm + gp / 2, 540, 314, buck));
        var zg = Math.max(0, gap) * 4; attr(zl, { x: 232, width: 58 - zg / 2 }); attr(zr, { x: 290 + zg / 2, width: 58 - zg / 2 });
        zT.textContent = gap > 0 ? 'écart : ' + fmt(gap, 1) + ' mm' : 'écart refermé !';
        rMsg.textContent = buck > 0.5 ? 'Les rails se déforment !' : 'Rails en bon état'; rMsg2.textContent = st.joint ? 'rails de 18 m avec joint de dilatation' : 'rails soudés sans joint';
        rMsg.setAttribute('fill', buck > 0.5 ? '#FF8A80' : '#9BE7A5');
        pv.textContent = 'ÉCART ENTRE LES RAILS'; pv1.textContent = gap > 0 ? fmt(gap, 1) + ' mm' : '0 mm'; pv2.textContent = 'rail en acier de 18 m'; pv3.textContent = 'allongement : ' + fmt(A_ACIER * RAIL * (st.Tr - 20), 1) + ' mm'; pv4.textContent = '(par rapport à 20 °C)';
        res = { gap: gap, buck: buck, joint: st.joint, Tr: st.Tr };
      }
      th.set(Tobj); thR.set(Tobj);
      lp.set(Math.min(1, (Tobj - 10) / (st.mode === 'rail' ? 60 : 450)), T);
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La boule et l’anneau' }, { t: 11, title: 'On chauffe la boule' }, { t: 23, title: 'Elle refroidit' }, { t: 33, title: 'Tous les métaux ?' }, { t: 45, title: 'Rails et ponts' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un solide chauffé <b>se dilate</b>', 'ses dimensions augmentent ; refroidi, il <b>se contracte</b>.', '#FF7A2E'],
      ['La dilatation dépend de la <b>matière</b>', 'à température égale : aluminium > cuivre > fer.', 'var(--blue)'],
      ['On en tient compte : <b>joints de dilatation</b>', 'rails, ponts, fils électriques, couvercles…', '#3DD68C']], [57.2, 61.6, 66]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 33) { st.mode = 'anneau'; st.hot = 'boule'; st.T = t < 11 ? 20 : t < 23 ? 20 + 330 * K.k(t, 11, 4) : 350 - 330 * K.k(t, 23.5, 3); st.drop = t < 11 ? K.k(t, 5, 3) : t < 23 ? K.k(t, 17, 3) : K.k(t, 28, 3); }
        else if (t < 45) { st.mode = 'barre'; st.met = t < 37 ? 'fer' : t < 41 ? 'cuivre' : 'alu'; st.Tb = 20 + 380 * K.k(t, t < 37 ? 33 : t < 41 ? 37 : 41, 2.5); }
        else { st.mode = 'rail'; st.joint = t < 51; st.Tr = 25 + 30 * K.k(t, 46, 3) - (t > 51 && t < 51.5 ? 0 : 0); if (t >= 51) st.Tr = 55; }
        lab.step();
        tg.show(t, 1, 10.6, 290, 92, 'À froid : la boule passe') || tg.show(t, 12, 22.6, 290, 92, 'Chauffée, la boule ne passe plus') || tg.show(t, 26, 32.6, 290, 92, 'Refroidie, elle repasse : contraction') ||
          tg.show(t, 34, 44.6, 290, 92, (st.met === 'fer' ? 'Fer' : st.met === 'cuivre' ? 'Cuivre' : 'Aluminium') + ' à 400 °C : ' + fmt(MET[st.met].a * L0 * (st.Tb - 20), 1) + ' mm') || tg.show(t, 46, 50.6, 290, 92, 'Le joint laisse la place aux rails') || tg.show(t, 51.4, 56.6, 290, 92, 'Sans joint : les rails se tordent');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une boule métallique passe dans un anneau à froid mais plus une fois chauffée, puis repasse en refroidissant ; une barre de fer, de cuivre puis d’aluminium chauffée s’allonge et fait tourner l’aiguille d’un cadran ; enfin des rails avec et sans joint de dilatation au soleil',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 4.8, say: 'Voici une boule de métal et un anneau. À la même température, la boule passe tout juste dans l’anneau.', sub: 'À froid, la boule <b>passe</b> dans l’anneau.' },
      { t: 5, d: 5.6, say: 'Elle traverse sans difficulté.', sub: 'Elle traverse sans difficulté.' },
      { t: 11, d: 5.8, say: 'Chauffons fortement la boule à la flamme, puis essayons à nouveau.', sub: 'Chauffons la boule…' },
      { t: 17, d: 5.8, say: 'Elle reste bloquée sur l’anneau ! Chauffée, la boule a grossi : elle s’est dilatée.', sub: '…elle reste bloquée : elle s’est <b>dilatée</b>.' },
      { t: 23, d: 9.6, say: 'Laissons-la refroidir : elle reprend sa taille et passe de nouveau. En refroidissant, un solide se contracte.', sub: 'En refroidissant, elle se <b>contracte</b> et repasse.' },
      { t: 33, d: 11.6, say: 'Chauffons trois barres de même longueur : fer, cuivre, aluminium. Toutes s’allongent, mais pas autant : l’aluminium se dilate le plus, le fer le moins.', sub: 'Aluminium > cuivre > <b>fer</b> : la dilatation dépend de la matière.' },
      { t: 45, d: 6, say: 'Au soleil, un rail de dix-huit mètres s’allonge de plusieurs millimètres. Un petit espace entre les rails, le joint de dilatation, lui laisse la place.', sub: 'Le <b>joint de dilatation</b> laisse de la place aux rails.' },
      { t: 51.2, d: 5.6, say: 'Sans joint, les rails n’ont pas la place de s’allonger : ils se tordent.', sub: 'Sans joint, les rails se <b>déforment</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : un solide chauffé se dilate ; refroidi, il se contracte.', sub: 'Chauffé : <b>dilatation</b> ; refroidi : <b>contraction</b>.' },
      { t: 61.6, d: 4.2, say: 'La dilatation dépend de la nature du solide.', sub: 'Elle dépend de la <b>matière</b>.' },
      { t: 66, d: 5, say: 'On en tient compte dans les constructions, avec des joints de dilatation.', sub: 'On prévoit des <b>joints de dilatation</b>.' }
    ],
    learn: [
      { t: 22, ch: 1, html: 'Chauffé, un solide <b>se dilate</b> : ses dimensions augmentent.' },
      { t: 32, ch: 2, html: 'Refroidi, il <b>se contracte</b>.' },
      { t: 44, ch: 3, html: 'Aluminium > cuivre > fer : la dilatation dépend de la <b>matière</b>.' },
      { t: 56, ch: 4, html: 'Rails, ponts : on prévoit des <b>joints de dilatation</b>.' }
    ],
    question: { q: 'Une boule de métal chauffée ne passe plus dans l’anneau car :', o: ['elle est devenue plus lourde', 'elle s’est dilatée', 'l’anneau a rétréci', 'elle a fondu'], a: 1, e: 'Son diamètre a augmenté.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Trois expériences de dilatation des solides : boule et anneau de Gravesande, barre métallique chauffée qui pousse l’aiguille d’un cadran, rails au soleil avec ou sans joint de dilatation ; thermomètre et loupe sur les particules à droite',
    steps: [
      'Boule et anneau : lâche la boule à froid, puis chauffe-la et recommence.',
      'Chauffe l’anneau au lieu de la boule : que se passe-t-il ?',
      'Barre : compare l’allongement du fer, du cuivre et de l’aluminium à la même température.',
      'Rails : fais varier la température avec et sans joint de dilatation. Relève tes mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Expérience', value: 'anneau', options: [{ v: 'anneau', l: 'Boule et anneau' }, { v: 'barre', l: 'Barre chauffée' }, { v: 'rail', l: 'Rails au soleil' }], onChange: function (v) { st.mode = v; vis(); } });
      var cH = c.seg({ label: 'On chauffe…', value: 'boule', options: [{ v: 'boule', l: 'la boule' }, { v: 'anneau', l: 'l’anneau' }], onChange: function (v) { st.hot = v; st.drop = 0; } });
      var sT = c.slider({ label: 'Température de l’objet chauffé', min: 20, max: 400, step: 10, value: 20, unit: '°C', onInput: function (v) { st.T = v; st.drop = 0; st.dropping = false; } });
      var bD = c.button({ label: 'Lâcher la boule', primary: true, onClick: function () { st.drop = 0; st.dropping = true; api.sound('tick'); } });
      var cMt = c.seg({ label: 'Métal', value: 'alu', options: Object.keys(MET).map(function (k) { return { v: k, l: MET[k].n }; }), onChange: function (v) { st.met = v; } });
      var sB = c.slider({ label: 'Température de la barre', min: 20, max: 500, step: 10, value: 20, unit: '°C', onInput: function (v) { st.Tb = v; } });
      var sR = c.slider({ label: 'Température des rails', min: 0, max: 60, step: 1, value: 30, unit: '°C', onInput: function (v) { st.Tr = v; } });
      var tJ = c.toggle({ label: 'Joint de dilatation', value: true, onChange: function (v) { st.joint = v; } });
      function vis() { var m = st.mode; cH.hide(m !== 'anneau'); sT.hide(m !== 'anneau'); bD.style.display = m === 'anneau' ? '' : 'none'; cMt.hide(m !== 'barre'); sB.hide(m !== 'barre'); sR.hide(m !== 'rail'); tJ.hide(m !== 'rail'); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Mesure' }, { k: 'b', label: 'Observation' }]);
      var last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'anneau') { ro.a.set('boule : ' + fmt(last.Db, 3) + ' mm'); ro.b.set(last.drop > 0.6 ? (last.passes ? 'elle passe' : 'elle bloque') : 'lâche la boule'); } else if (st.mode === 'barre') { ro.a.set('ΔL = ' + fmt(last.dL, 2) + ' mm'); ro.b.set(MET[st.met].n + ' à ' + st.Tb + ' °C'); } else { ro.a.set('écart : ' + fmt(Math.max(0, last.gap), 1) + ' mm'); ro.b.set(last.buck > 0.5 ? 'rails déformés' : 'rails droits'); } });
      var M = api.measure; M.innerHTML = '<h3>Allongement des barres (50 cm)</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever (mode barre)'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.mode !== 'barre') { api.say('Passe en mode « Barre chauffée » pour relever.'); return; } rows.push({ m: st.met, T: st.Tb, d: last.dL }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Métal</th><th>Température</th><th>Allongement</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + MET[r.m].n + '</td><td>' + r.T + ' °C</td><td>' + fmt(r.d, 2) + ' mm</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure.</div>';
        api.chart.innerHTML = '<h3>Allongement en fonction de la température</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'température (°C)', ylabel: 'allongement (mm)', xmin: 0, xmax: 500, xstep: 100, ymin: 0, ymax: 6, ystep: 1, series: Object.keys(MET).map(function (k) { return { color: MET[k].c, pts: rows.filter(function (r) { return r.m === k; }).map(function (r) { return [r.T, r.d]; }) }; }) });
      }
      paint();
      api.onReset(function () { st.mode = 'anneau'; st.hot = 'boule'; st.T = 20; st.drop = 0; st.dropping = false; st.met = 'alu'; st.Tb = 20; st.Tr = 30; st.joint = true; cM.set('anneau'); cH.set('boule'); sT.set(20); cMt.set('alu'); sB.set(20); sR.set(30); tJ.set(true); vis(); rows = []; paint(); });
      api.say('Lâche la boule à froid, puis chauffe-la.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 allongements de barres.</p>';
        return '<p>Chauffé, un solide <b>se dilate</b> : ses dimensions augmentent (la boule chauffée ne passe plus dans l’anneau, la barre s’allonge). Refroidi, il <b>se contracte</b>.</p><p>À l’échelle des particules, elles s’agitent davantage et s’écartent un peu les unes des autres.</p><p>L’allongement est d’autant plus grand que la température s’élève ; il dépend de la <b>nature</b> du solide : l’aluminium se dilate plus que le cuivre, qui se dilate plus que le fer.</p><p>On prévoit des <b>joints de dilatation</b> sur les rails, les ponts, les routes en béton.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Dilatation des solides' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de la dilatation',
    intro: 'Boule, barre, rails : la chaleur fait grandir les solides !',
    missions: [
      { title: 'Bloque la boule', text: 'Fais en sorte que la boule <span style="color:#FF7A2E">reste bloquée</span> sur l’anneau.', lumi: 'Il faut qu’elle grossisse…', hint: 'Chauffe la boule au-delà de 160 °C, puis lâche-la.',
        build: function (api) { var lab = mini(api, { mode: 'anneau' }); api.c.slider({ label: 'Température de la boule', min: 20, max: 400, step: 10, value: 20, unit: '°C', onInput: function (v) { lab.st.T = v; lab.st.drop = 0; } }); api.c.button({ label: 'Lâcher la boule', sm: true, onClick: function () { lab.st.drop = 0; lab.st.dropping = true; } }); return function () { var r = lab.res(); return r.stuck ? { ok: true, msg: 'Bloquée : la boule s’est dilatée.' } : { ok: false, msg: r.drop >= 1 ? 'Elle est passée : chauffe-la davantage.' : 'Lâche la boule.' }; }; },
        e: 'Chauffée, la boule se dilate et ne passe plus.' },
      { type: 'qcm', title: 'Refroidissement', text: 'Un solide qui refroidit :', o: ['se dilate', 'se contracte', 'fond toujours', 'ne change pas'], a: 1, hint: 'L’inverse de la dilatation.', e: 'Il se contracte : ses dimensions diminuent.' },
      { title: '3 millimètres', text: 'Obtiens un allongement d’au moins <span style="color:var(--amber)">3 mm</span> pour la barre de 50 cm.', lumi: 'Tous les métaux ne se dilatent pas autant…', hint: 'L’aluminium se dilate le plus.',
        build: function (api) { var lab = mini(api, { mode: 'barre', met: 'fer' }); api.c.seg({ label: 'Métal', value: 'fer', options: Object.keys(MET).map(function (k) { return { v: k, l: MET[k].n }; }), onChange: function (v) { lab.st.met = v; } }); api.c.slider({ label: 'Température', min: 20, max: 500, step: 10, value: 20, unit: '°C', onInput: function (v) { lab.st.Tb = v; } }); return function () { var r = lab.res(); return r.dL >= 3 ? { ok: true, msg: fmt(r.dL, 2) + ' mm avec le ' + MET[r.met].n + ' !' } : { ok: false, msg: 'Seulement ' + fmt(r.dL, 2) + ' mm.' }; }; },
        e: 'L’aluminium (ou le cuivre très chaud) s’allonge de plus de 3 mm.' },
      { type: 'qcm', title: 'Les rails', text: 'Pourquoi laisse-t-on un petit espace entre deux rails ?', o: ['pour faire du bruit', 'pour laisser les rails se dilater en été', 'pour économiser du métal', 'pour l’évacuation de l’eau'], a: 1, hint: 'Pense au soleil.', e: 'C’est le joint de dilatation.' },
      { title: 'Canicule', text: 'Il fait <b>55 °C</b> sur les rails. Évite qu’ils se <span style="color:#FF8A80">déforment</span>.', lumi: 'Les rails ont besoin de place…', hint: 'Active le joint de dilatation.',
        build: function (api) { var lab = mini(api, { mode: 'rail', Tr: 55, joint: false }); api.c.toggle({ label: 'Joint de dilatation', value: false, onChange: function (v) { lab.st.joint = v; } }); return function () { var r = lab.res(); return r.buck < 0.5 ? { ok: true, msg: 'Le joint absorbe l’allongement : rails intacts.' } : { ok: false, msg: 'Les rails se déforment !' }; }; },
        e: 'Le joint de dilatation laisse la place à l’allongement des rails.' }
    ]
  };

  S.start({
    id: '5e-dilatation-solides', level: '5e', theme: 'Propriétés physiques de la matière', title: 'Dilatation des solides', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Lorsqu’on chauffe un solide, ses dimensions augmentent : il <b>se dilate</b>. Lorsqu’on le refroidit, il <b>se contracte</b>.',
      'Expérience : la boule chauffée ne passe plus dans l’anneau ; refroidie, elle passe de nouveau.',
      'La dilatation augmente avec l’élévation de température et dépend de la <b>nature</b> du solide : à température égale, l’aluminium se dilate plus que le cuivre, qui se dilate plus que le fer.',
      'À l’échelle des particules : chauffées, elles s’agitent davantage et s’écartent légèrement.',
      'Applications : <b>joints de dilatation</b> des rails, des ponts et des routes ; fils électriques moins tendus en été.'
    ],
    quiz: [
      { q: 'Un solide chauffé :', o: ['se contracte', 'se dilate', 'devient liquide aussitôt', 'disparaît'], a: 1, e: 'Ses dimensions augmentent.' },
      { q: 'À température égale, lequel se dilate le plus ?', o: ['le fer', 'le cuivre', 'l’aluminium', 'ils se dilatent pareil'], a: 2, e: 'Aluminium > cuivre > fer.' },
      { q: 'Le joint de dilatation sert à :', o: ['décorer', 'laisser la place à l’allongement', 'refroidir les rails', 'freiner le train'], a: 1, e: 'Les rails s’allongent au soleil.' },
      { q: 'En été, les fils électriques :', o: ['sont plus tendus', 'pendent davantage', 'se cassent', 'ne changent pas'], a: 1, e: 'Ils se dilatent et s’allongent.' },
      { q: 'La boule chauffée repasse dans l’anneau quand :', o: ['on la chauffe encore', 'elle refroidit', 'on la mouille', 'jamais'], a: 1, e: 'Elle se contracte en refroidissant.' }
    ]
  });
})();
