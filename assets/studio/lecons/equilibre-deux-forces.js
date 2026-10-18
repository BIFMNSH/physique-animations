/* 3e · Mécanique · Leçon : Équilibre d’un solide soumis à deux forces */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var CM = 26, G10 = 10;
  function arrow(G, col) { var g = s('g', {}, G), l = s('line', { stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), h = s('path', { fill: col }, g); return { g: g, set: function (x1, y1, x2, y2, on) { var a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); g.style.display = on === false || L < 4 ? 'none' : ''; if (L < 4) return; var bx = x2 - Math.cos(a) * 14, by = y2 - Math.sin(a) * 14; attr(l, { x1: x1, y1: y1, x2: bx, y2: by }); h.setAttribute('d', 'M' + x2 + ' ' + y2 + ' L' + (bx + Math.sin(a) * 9) + ' ' + (by - Math.cos(a) * 9) + ' L' + (bx - Math.sin(a) * 9) + ' ' + (by + Math.cos(a) * 9) + 'Z'); } }; }
  function dyn(G) { var g = s('g', {}, G); s('rect', { x: -30, y: -11, width: 60, height: 22, rx: 7, fill: '#E5E9F0', stroke: '#9AA6BC', 'stroke-width': 1.5 }, g); var t = s('text', { y: 5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: '#B4232A' }, g); return { g: g, t: t }; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'plaque', F1: 4, F2: 4, a2: 0, d: 0, mv: 0, m: 0.3, sit: 'suspendu', t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    /* ---------- PLAQUE ---------- */
    var A = s('g', {}, G), CX = 290, CY = 240;
    s('rect', { x: 40, y: 400, width: 500, height: 46, fill: '#151D2E' }, A);
    var ghost = s('rect', { x: CX - 60, y: CY - 40, width: 120, height: 80, rx: 10, fill: 'none', stroke: '#2B3A57', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, A);
    var pl = s('g', {}, A); s('rect', { x: -60, y: -40, width: 120, height: 80, rx: 10, fill: '#E6D3B8', stroke: '#B79B72', 'stroke-width': 2 }, pl); s('text', { y: 6, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#6B4E36', text: 'plaque légère' }, pl);
    var s1 = s('line', { stroke: '#C9D2E3', 'stroke-width': 2 }, A), s2 = s('line', { stroke: '#C9D2E3', 'stroke-width': 2 }, A), D1 = dyn(A), D2 = dyn(A);
    var L1 = s('line', { stroke: '#FF8A80', 'stroke-width': 1.5, 'stroke-dasharray': '8 6', opacity: 0.6 }, A), L2 = s('line', { stroke: '#80C8FF', 'stroke-width': 1.5, 'stroke-dasharray': '8 6', opacity: 0.6 }, A);
    var f1 = arrow(A, '#E5484D'), f2 = arrow(A, '#4FA8FF'), t1 = s('text', { 'font-size': 15, 'font-weight': 900, fill: '#FF8A80' }, A), t2 = s('text', { 'font-size': 15, 'font-weight': 900, fill: '#80C8FF' }, A), p1 = s('circle', { r: 5, fill: '#FFC773' }, A), p2 = s('circle', { r: 5, fill: '#FFC773' }, A);
    var aMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, A);
    /* ---------- SUSPENDU / POSÉ ---------- */
    var B = s('g', {}, G), BX = 260;
    var sup = s('g', {}, B); s('rect', { x: 150, y: 56, width: 220, height: 14, rx: 4, fill: '#7D89A3' }, sup); var thread = s('line', { x1: BX, y1: 70, x2: BX, stroke: '#C9D2E3', 'stroke-width': 2 }, sup);
    var table = s('g', {}, B); s('rect', { x: 120, y: 330, width: 300, height: 14, rx: 3, fill: '#8D6E4E' }, table); s('rect', { x: 140, y: 344, width: 12, height: 56, fill: '#6B4E36' }, table); s('rect', { x: 388, y: 344, width: 12, height: 56, fill: '#6B4E36' }, table);
    s('rect', { x: 40, y: 400, width: 500, height: 46, fill: '#151D2E' }, B);
    var body = s('circle', { r: 34, fill: '#B8C2D4', stroke: '#6B7280', 'stroke-width': 2 }, B), Gp = s('circle', { r: 5, fill: '#E5484D', stroke: '#FFF', 'stroke-width': 1.5 }, B), Gt = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#FF8A80', text: 'G' }, B), Ap = s('circle', { r: 5, fill: '#FFC773' }, B), At = s('text', { 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'A' }, B);
    var fP = arrow(B, '#E5484D'), fT = arrow(B, '#4FA8FF'), tP = s('text', { 'font-size': 15, 'font-weight': 900, fill: '#FF8A80' }, B), tT = s('text', { 'font-size': 15, 'font-weight': 900, fill: '#80C8FF', 'text-anchor': 'end' }, B);
    var scl = s('g', {}, B); s('line', { x1: 430, x2: 430 + CM, y1: 110, y2: 110, stroke: '#FFC773', 'stroke-width': 4 }, scl); s('text', { x: 430, y: 130, 'font-size': 11, 'font-weight': 800, fill: '#FFC773', text: '1 cm ↔ 1 N' }, scl); s('text', { x: 430, y: 146, 'font-size': 11, fill: '#A9B4C7', text: 'g = 10 N/kg' }, scl);
    var bMsg = s('text', { x: 290, y: 428, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, B);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'CONDITIONS D’ÉQUILIBRE' }, P);
    var conds = ['même droite d’action', 'sens opposés', 'même intensité'].map(function (c, i) { var y = 70 + i * 58, g = s('g', {}, P), r = s('rect', { x: PX + 14, y: y, width: 252, height: 48, rx: 12, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, g), ic = s('text', { x: PX + 36, y: y + 31, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900 }, g); s('text', { x: PX + 58, y: y + 30, 'font-size': 14, 'font-weight': 900, fill: '#EEF2F8', text: c }, g); return { r: r, ic: ic }; });
    var eqB = s('rect', { x: PX + 40, y: 252, width: 200, height: 42, rx: 21 }, P), eqT = s('text', { x: PX + 140, y: 279, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#0A0F1A' }, P);
    var vec = s('text', { x: PX + 140, y: 326, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 900, fill: '#FFC773' }, P);
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 360 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    function setConds(c) { c.forEach(function (ok, i) { conds[i].ic.textContent = ok ? '✓' : '✗'; conds[i].ic.setAttribute('fill', ok ? '#3DD68C' : '#FF6B5E'); conds[i].r.setAttribute('stroke', ok ? '#2F7D4F' : '#7A2A2A'); }); var all = c.every(Boolean); eqB.setAttribute('fill', all ? '#3DD68C' : '#FF8A80'); eqT.textContent = all ? 'ÉQUILIBRE' : 'PAS D’ÉQUILIBRE'; return all; }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000, res = {};
      A.style.display = st.mode === 'plaque' ? '' : 'none'; B.style.display = st.mode === 'plaque' ? 'none' : '';
      if (st.mode === 'plaque') {
        var th = st.a2 * Math.PI / 180, c1 = Math.abs(st.d) < 0.5 && st.a2 === 0, c2 = st.a2 === 0, c3 = Math.abs(st.F1 - st.F2) < 0.01, all = setConds([c1, c2, c3]);
        var nx = st.F2 * Math.cos(th) - st.F1, ny = -st.F2 * Math.sin(th), tq = st.F2 * st.d * Math.cos(th) * 0.9 + (st.a2 ? st.F2 * Math.sin(th) * 60 / 26 : 0);
        var tgt = all ? 0 : 1; if (st.t == null) st.mv += (tgt - st.mv) * Math.min(1, dt * 1.5); else st.mv = tgt * (st.mvK == null ? 1 : st.mvK);
        var k = st.mv, dx = Math.max(-60, Math.min(60, nx * 12)) * k, dy = Math.max(-50, Math.min(50, ny * 12)) * k, rot = Math.max(-25, Math.min(25, -tq * 4)) * k;
        pl.setAttribute('transform', 'translate(' + (CX + dx) + ' ' + (CY + dy) + ') rotate(' + rot + ')');
        function loc(px, py) { var r = rot * Math.PI / 180; return [CX + dx + px * Math.cos(r) - py * Math.sin(r), CY + dy + px * Math.sin(r) + py * Math.cos(r)]; }
        var a1 = loc(-60, 0), a2p = loc(60, st.d * 6), e1 = [a1[0] - st.F1 * CM / 2, a1[1]], e2 = [a2p[0] + Math.cos(th) * st.F2 * CM / 2, a2p[1] - Math.sin(th) * st.F2 * CM / 2];
        f1.set(a1[0], a1[1], e1[0], e1[1]); f2.set(a2p[0], a2p[1], e2[0], e2[1]); attr(p1, { cx: a1[0], cy: a1[1] }); attr(p2, { cx: a2p[0], cy: a2p[1] });
        attr(t1, { x: (a1[0] + e1[0]) / 2 - 8, y: a1[1] - 12, text: 'F₁' }); attr(t2, { x: (a2p[0] + e2[0]) / 2 - 4, y: (a2p[1] + e2[1]) / 2 - 12, text: 'F₂' });
        var d1 = [70, a1[1]], d2 = [a2p[0] + Math.cos(th) * 150, a2p[1] - Math.sin(th) * 150]; d2[0] = Math.min(d2[0], 505);
        attr(s1, { x1: a1[0], y1: a1[1], x2: d1[0] + 30, y2: d1[1] }); attr(s2, { x1: a2p[0], y1: a2p[1], x2: d2[0], y2: d2[1] });
        D1.g.setAttribute('transform', 'translate(' + (d1[0] + 30) + ' ' + d1[1] + ')'); D2.g.setAttribute('transform', 'translate(' + d2[0] + ' ' + d2[1] + ') rotate(' + (-st.a2) + ')'); D1.t.textContent = fmt(st.F1, 1) + ' N'; D2.t.textContent = fmt(st.F2, 1) + ' N';
        attr(L1, { x1: 50, y1: a1[1], x2: 530, y2: a1[1] }); attr(L2, { x1: a2p[0] - Math.cos(th) * 300, y1: a2p[1] + Math.sin(th) * 300, x2: a2p[0] + Math.cos(th) * 300, y2: a2p[1] - Math.sin(th) * 300 });
        ghost.style.display = all ? 'none' : '';
        aMsg.textContent = all ? 'La plaque reste immobile : elle est en équilibre' : !c3 && c1 ? 'Intensités différentes : la plaque part du côté de la plus forte' : !c1 && c2 ? 'Droites d’action différentes : la plaque tourne' : 'Directions différentes : la plaque bouge et tourne';
        vec.textContent = all ? 'F₁ + F₂ = 0' : '';
        pset(['Un solide soumis à deux forces', 'est en équilibre si elles sont', 'directement opposées.']);
        res = { eq: all, F1: st.F1, F2: st.F2, a2: st.a2, d: st.d };
      } else {
        var sus = st.sit === 'suspendu', Pn = st.m * G10, L = Pn * CM, R = 34, cy = sus ? 230 : 330 - R;
        sup.style.display = sus ? '' : 'none'; table.style.display = sus ? 'none' : '';
        thread.setAttribute('y2', cy - R); attr(body, { cx: BX, cy: cy, r: R }); attr(Gp, { cx: BX, cy: cy }); attr(Gt, { x: BX - 22, y: cy + 4 });
        var ay = sus ? cy - R : cy + R; attr(Ap, { cx: BX, cy: ay }); attr(At, { x: BX - 20, y: ay + (sus ? -4 : 16) });
        fP.set(BX + 3, cy, BX + 3, cy + L); fT.set(BX - 3, ay, BX - 3, ay - L);
        attr(tP, { x: BX + 12, y: cy + L / 2 + 10, text: 'P = ' + fmt(Pn, 1) + ' N' }); attr(tT, { x: BX - (sus ? 14 : 42), y: ay - L / 2 - (sus ? 0 : 20), text: (sus ? 'T' : 'R') + ' = ' + fmt(Pn, 1) + ' N' });
        setConds([true, true, true]);
        bMsg.textContent = sus ? 'Le fil exerce une tension T qui compense le poids : T = P' : 'La table exerce une réaction R qui compense le poids : R = P';
        vec.textContent = sus ? 'T = P = ' + fmt(Pn, 1) + ' N' : 'R = P = ' + fmt(Pn, 1) + ' N';
        pset([sus ? 'Solide suspendu à un fil :' : 'Solide posé sur un support :', sus ? 'poids P et tension du fil T.' : 'poids P et réaction R du support.', 'm = ' + fmt(st.m, 2) + ' kg → P = m × g']);
        res = { sit: st.sit, P: Pn };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Deux forces, un équilibre ?' }, { t: 8, title: 'Même intensité' }, { t: 18, title: 'Intensités différentes' }, { t: 26, title: 'Même droite d’action' }, { t: 35, title: 'Solide suspendu' }, { t: 46, title: 'Solide posé' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Deux forces <b>directement opposées</b>', 'même droite d’action, sens opposés, même intensité.', '#3DD68C'],
      ['Alors le solide est en <b>équilibre</b>', 'F₁ + F₂ = 0 (vecteurs opposés).', '#FFC773'],
      ['Suspendu : <b>T = P</b> · Posé : <b>R = P</b>', 'le fil ou le support compense le poids.', '#80C8FF']], [57.2, 61.6, 65.8]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t; st.mode = 'plaque'; st.F1 = 4; st.F2 = 4; st.a2 = 0; st.d = 0; st.mvK = 1;
        if (t < 18) { }
        else if (t < 26) { st.F2 = 6; st.mvK = K.k(t, 19, 2); }
        else if (t < 35) { st.d = t < 30.5 ? 6 : 0; st.a2 = t < 30.5 ? 0 : 30; st.mvK = t < 30.5 ? K.k(t, 26.8, 2) : K.k(t, 31, 2); }
        else { st.mode = 'equi'; st.sit = t < 46 ? 'suspendu' : 'pose'; st.m = 0.3; }
        lab.step();
        tg.show(t, 1, 7.6, 290, 92, 'Quand la plaque reste-t-elle immobile ?') || tg.show(t, 9, 17.6, 290, 92, '4 N et 4 N, opposées : équilibre') || tg.show(t, 19, 25.6, 290, 92, '4 N et 6 N : elle bouge !') ||
          tg.show(t, 27, 30.4, 290, 92, 'Droites décalées : elle tourne') || tg.show(t, 31, 34.6, 290, 92, 'Directions différentes : elle bouge') || tg.show(t, 37, 45.6, 290, 92, 'Suspendu : T = P = 3 N') || tg.show(t, 47, 56.6, 290, 92, 'Posé : R = P = 3 N');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une plaque légère tirée par deux dynamomètres de 4 N dans des sens opposés reste immobile ; avec 4 N et 6 N elle se déplace ; avec des fils décalés elle tourne ; avec des directions différentes elle bouge ; puis une boule suspendue à un fil et une boule posée sur une table, avec leur poids et la tension ou la réaction représentés par des flèches égales et opposées',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 7.6, say: 'Une plaque très légère est tirée par deux fils reliés à des dynamomètres. À quelles conditions reste-t-elle immobile ?', sub: 'Quand le solide est-il en <b>équilibre</b> ?' },
      { t: 8, d: 9.6, say: 'Quatre newtons d’un côté, quatre newtons de l’autre, sur la même droite et en sens opposés : la plaque reste immobile. Elle est en équilibre.', sub: 'Même intensité, sens opposés : <b>équilibre</b>.' },
      { t: 18, d: 7.6, say: 'Si l’un des dynamomètres indique six newtons, la plaque se déplace du côté de la force la plus grande.', sub: 'Intensités différentes : pas d’équilibre.' },
      { t: 26, d: 8.6, say: 'Si les deux fils ne sont pas sur la même droite, la plaque tourne. Si les directions sont différentes, elle bouge. Les deux forces doivent avoir la même droite d’action.', sub: 'Il faut la <b>même droite d’action</b>.' },
      { t: 35, d: 10.6, say: 'Une boule de trois cents grammes est suspendue à un fil. Elle est soumise à son poids, trois newtons, et à la tension du fil. Comme elle est en équilibre, la tension vaut aussi trois newtons.', sub: 'Solide suspendu : <b>T = P</b>.' },
      { t: 46, d: 10.6, say: 'Posée sur une table, la boule est soumise à son poids et à la réaction de la table. À l’équilibre, la réaction compense exactement le poids.', sub: 'Solide posé : <b>R = P</b>.' },
      { t: 57, d: 4.4, say: 'À retenir : deux forces directement opposées ont la même droite d’action, des sens opposés et la même intensité.', sub: 'Deux forces directement opposées.' },
      { t: 61.6, d: 4, say: 'Un solide soumis à deux forces est en équilibre si elles sont directement opposées.', sub: 'Équilibre : F₁ + F₂ = 0.' },
      { t: 65.8, d: 5.2, say: 'Le fil ou le support compense alors le poids.', sub: 'T = P ou R = P.' }
    ],
    learn: [
      { t: 17, ch: 1, html: 'Même intensité, sens opposés : la plaque est en <b>équilibre</b>.' },
      { t: 25, ch: 2, html: 'Intensités différentes : <b>pas d’équilibre</b>.' },
      { t: 34, ch: 3, html: 'Les deux forces doivent avoir la <b>même droite d’action</b>.' },
      { t: 56, ch: 5, html: 'Suspendu : <b>T = P</b> ; posé : <b>R = P</b>.' }
    ],
    question: { q: 'Un sac de 2 kg est suspendu à un crochet (g = 10 N/kg). La tension du crochet vaut :', o: ['2 N', '10 N', '20 N', '0 N'], a: 2, e: 'T = P = 2 × 10 = 20 N.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : une plaque légère tirée par deux fils reliés à des dynamomètres dont on règle les intensités, l’angle et le décalage du second fil, avec la liste des conditions d’équilibre cochées ou non ; puis une boule suspendue à un fil ou posée sur une table, avec son poids et la tension ou la réaction',
    steps: [
      'Plaque : règle F₂ égale à F₁. Que se passe-t-il ?',
      'Change l’intensité, puis l’angle, puis le décalage de F₂.',
      'Trouve les trois conditions d’équilibre.',
      'Solide suspendu ou posé : compare les deux forces.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { F2: 3 }), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'plaque', options: [{ v: 'plaque', l: 'Plaque et deux fils' }, { v: 'equi', l: 'Suspendu ou posé' }], onChange: function (v) { st.mode = v; vis(); } });
      var s1 = c.slider({ label: 'Intensité F₁', min: 1, max: 6, step: 0.5, value: 4, unit: 'N', dec: 1, onInput: function (v) { st.F1 = v; } });
      var s2 = c.slider({ label: 'Intensité F₂', min: 1, max: 6, step: 0.5, value: 3, unit: 'N', dec: 1, onInput: function (v) { st.F2 = v; } });
      var sa = c.slider({ label: 'Angle du fil 2', min: 0, max: 45, step: 15, value: 0, unit: '°', dec: 0, onInput: function (v) { st.a2 = v; } });
      var sd = c.slider({ label: 'Décalage du fil 2', min: -6, max: 6, step: 2, value: 0, unit: '', dec: 0, onInput: function (v) { st.d = v; } });
      var cS = c.seg({ label: 'Situation', value: 'suspendu', options: [{ v: 'suspendu', l: 'suspendu à un fil' }, { v: 'pose', l: 'posé sur la table' }], onChange: function (v) { st.sit = v; } });
      var sm = c.slider({ label: 'Masse', min: 100, max: 500, step: 50, value: 300, unit: 'g', dec: 0, onInput: function (v) { st.m = v / 1000; } });
      function vis() { var p = st.mode === 'plaque'; [s1, s2, sa, sd].forEach(function (x) { x.hide(!p); }); cS.hide(p); sm.hide(p); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Forces' }, { k: 'b', label: 'État' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'plaque') { ro.a.set(fmt(st.F1, 1) + ' N / ' + fmt(st.F2, 1) + ' N'); ro.b.set(last.eq ? 'équilibre' : 'pas d’équilibre'); } else { ro.a.set('P = ' + fmt(last.P, 1) + ' N'); ro.b.set((st.sit === 'suspendu' ? 'T' : 'R') + ' = ' + fmt(last.P, 1) + ' N'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push(st.mode === 'plaque' ? { e: 'F₁ = ' + fmt(st.F1, 1) + ' N, F₂ = ' + fmt(st.F2, 1) + ' N, angle ' + st.a2 + '°, décalage ' + st.d, o: last.eq ? 'équilibre' : 'pas d’équilibre' } : { e: (st.sit === 'suspendu' ? 'suspendu' : 'posé') + ', m = ' + Math.round(st.m * 1000) + ' g', o: 'P = ' + fmt(last.P, 1) + ' N = ' + (st.sit === 'suspendu' ? 'T' : 'R') }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Réglage</th><th>Résultat</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Deux forces directement opposées</h3><table class="mt"><thead><tr><th>Caractéristique</th><th>F₁ et F₂</th></tr></thead><tbody><tr><td>Droite d’action</td><td>la même</td></tr><tr><td>Sens</td><td>opposés</td></tr><tr><td>Intensité</td><td>égale</td></tr><tr><td>Points d’application</td><td>peuvent être différents</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'plaque', F1: 4, F2: 3, a2: 0, d: 0, mv: 0, m: 0.3, sit: 'suspendu' }); cM.set('plaque'); s1.set(4); s2.set(3); sa.set(0); sd.set(0); cS.set('suspendu'); sm.set(300); vis(); rows = []; paint(); });
      api.say('Règle F₂ pour que la plaque soit en équilibre.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Un solide soumis à deux forces est en <b>équilibre</b> si ces deux forces sont <b>directement opposées</b> : elles ont la <b>même droite d’action</b>, des <b>sens opposés</b> et la <b>même intensité</b>. On écrit F₁ + F₂ = 0 (en vecteurs).</p><p>Si les intensités sont différentes, le solide se déplace ; si les droites d’action sont différentes, il tourne ou se déplace.</p><p>Un solide suspendu à un fil est soumis à son poids P et à la tension T du fil : T = P. Un solide posé sur un support est soumis à son poids P et à la réaction R du support : R = P.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Équilibre d’un solide' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’équilibre',
    intro: 'Rien ne doit bouger : trouve le réglage parfait !',
    missions: [
      { title: 'Immobile', text: 'F₁ vaut 5 N. Règle le fil 2 pour mettre la plaque en <span style="color:#3DD68C">équilibre</span>.', lumi: 'Trois conditions à remplir.', hint: 'F₂ = 5 N, angle 0°, décalage 0.',
        build: function (api) { var lab = mini(api, { F1: 5, F2: 2, a2: 30, d: 4 }); api.c.slider({ label: 'Intensité F₂', min: 1, max: 6, step: 0.5, value: 2, unit: 'N', dec: 1, onInput: function (v) { lab.st.F2 = v; } }); api.c.slider({ label: 'Angle du fil 2', min: 0, max: 45, step: 15, value: 30, unit: '°', dec: 0, onInput: function (v) { lab.st.a2 = v; } }); api.c.slider({ label: 'Décalage', min: -6, max: 6, step: 2, value: 4, unit: '', dec: 0, onInput: function (v) { lab.st.d = v; } }); return function () { var r = lab.res(); return r.eq ? { ok: true, msg: 'Deux forces directement opposées : équilibre !' } : { ok: false, msg: 'La plaque bouge encore.' }; }; },
        e: 'Même droite, sens opposés, même intensité.' },
      { type: 'qcm', title: 'Ça tourne', text: 'Les deux forces ont la même intensité et des sens opposés, mais la plaque tourne. Pourquoi ?', o: ['les intensités sont trop fortes', 'elles n’ont pas la même droite d’action', 'la plaque est trop légère', 'les fils sont trop longs'], a: 1, hint: 'Regarde les pointillés.', e: 'Les droites d’action sont décalées.' },
      { title: 'La lampe suspendue', text: 'Suspends une boule pour que la tension du fil vaille <b>4 N</b>.', lumi: 'T = P = m × g.', hint: '400 g.',
        build: function (api) { var lab = mini(api, { mode: 'equi', sit: 'suspendu', m: 0.1 }); api.c.slider({ label: 'Masse', min: 100, max: 500, step: 50, value: 100, unit: 'g', dec: 0, onInput: function (v) { lab.st.m = v / 1000; } }); return function () { var r = lab.res(); return Math.abs(r.P - 4) < 0.01 ? { ok: true, msg: 'm = 0,4 kg : T = P = 4 N.' } : { ok: false, msg: 'T = ' + fmt(r.P, 1) + ' N.' }; }; },
        e: 'm = T / g = 0,4 kg.' },
      { type: 'qcm', title: 'Sur la table', text: 'Un livre de 5 N est posé sur une table, immobile. La réaction de la table :', o: ['vaut 5 N, vers le haut', 'vaut 5 N, vers le bas', 'vaut 0 N', 'vaut 10 N, vers le haut'], a: 0, hint: 'Elle compense le poids.', e: 'R = P = 5 N, verticale, vers le haut.' },
      { type: 'qcm', title: 'Vecteurs', text: 'À l’équilibre, la somme des vecteurs F₁ + F₂ est :', o: ['nulle', 'égale à 2F₁', 'verticale', 'impossible à calculer'], a: 0, hint: 'Vecteurs opposés.', e: 'F₁ + F₂ = 0.' }
    ]
  };

  S.start({
    id: '3e-equilibre-deux-forces', level: '3e', theme: 'Mécanique', title: 'Équilibre d’un solide soumis à deux forces', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un solide soumis à deux forces F₁ et F₂ est en <b>équilibre</b> si ces deux forces sont <b>directement opposées</b>.',
      'Deux forces directement opposées ont : la <b>même droite d’action</b>, des <b>sens opposés</b> et la <b>même intensité</b>. On écrit : <b>F₁ + F₂ = 0</b> (vecteurs).',
      'Si une condition n’est pas remplie, le solide se déplace ou tourne.',
      'Un solide suspendu à un fil est soumis à son poids <b>P</b> et à la tension <b>T</b> du fil : à l’équilibre, <b>T = P</b>.',
      'Un solide posé sur un support est soumis à son poids <b>P</b> et à la réaction <b>R</b> du support : à l’équilibre, <b>R = P</b>.'
    ],
    quiz: [
      { q: 'Deux forces directement opposées ont :', o: ['la même direction et le même sens', 'la même droite d’action, des sens opposés et la même intensité', 'des intensités différentes', 'des directions perpendiculaires'], a: 1, e: 'Les trois conditions.' },
      { q: 'Si F₁ = 3 N et F₂ = 5 N sont opposées sur la même droite, le solide :', o: ['est en équilibre', 'se déplace du côté de F₂', 'se déplace du côté de F₁', 'tourne'], a: 1, e: 'Vers la plus grande force.' },
      { q: 'Un solide suspendu à un fil est soumis à :', o: ['son poids seulement', 'son poids et la tension du fil', 'la tension seulement', 'aucune force'], a: 1, e: 'P et T.' },
      { q: 'Une boule de 600 g est suspendue (g = 10 N/kg). La tension du fil vaut :', o: ['0,6 N', '6 N', '60 N', '600 N'], a: 1, e: 'T = P = 0,6 × 10 = 6 N.' },
      { q: 'La réaction d’une table sur un objet posé est dirigée :', o: ['vers le bas', 'vers le haut', 'horizontalement', 'vers la Terre'], a: 1, e: 'Verticale, vers le haut.' }
    ]
  });
})();
