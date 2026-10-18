/* 3e · Mécanique · Leçon : Les forces */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit;
  var EFF = { mettre: { n: 'met un objet en mouvement', k: 'contact', a: 'la main pousse le chariot' }, devier: { n: 'modifie le mouvement', k: 'distance', a: 'l’aimant attire la bille d’acier' }, deformer: { n: 'déforme un objet', k: 'contact', a: 'la main comprime le ressort' } };
  var CM = 26; /* 1 cm à l’écran */
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function arrow(G, col) { var g = s('g', {}, G), l = s('line', { stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), h = s('path', { fill: col }, g); return { g: g, set: function (x1, y1, x2, y2, on) { g.style.display = on === false ? 'none' : ''; var a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 4) { g.style.display = 'none'; return; } var bx = x2 - Math.cos(a) * 14, by = y2 - Math.sin(a) * 14; attr(l, { x1: x1, y1: y1, x2: bx, y2: by }); h.setAttribute('d', 'M' + x2 + ' ' + y2 + ' L' + (bx + Math.sin(a) * 9) + ' ' + (by - Math.cos(a) * 9) + ' L' + (bx - Math.sin(a) * 9) + ' ' + (by + Math.cos(a) * 9) + 'Z'); } }; }
  function hand(G) { var g = s('g', {}, G); s('path', { d: 'M-70 -10 h46 q6 -14 18 -12 q10 2 8 14 v16 q0 10 -10 10 h-16 q-6 6 -46 6z', fill: '#C68A5E', stroke: '#8D5A3B', 'stroke-width': 2 }, g); return g; }

  function Lab(G, o) {
    var st = Object.assign({ mode: 'effets', eff: 'mettre', p: 0, run: false, F: 30, ang: 30, pt: 'droite', hl: -1, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    s('rect', { x: 40, y: 380, width: 500, height: 66, fill: '#151D2E' }, G);
    /* ---------- EFFETS ---------- */
    var E = s('g', {}, G);
    var cart = s('g', {}, E); s('rect', { x: -50, y: -46, width: 100, height: 40, rx: 6, fill: '#4C6BFF', stroke: '#2B3FA8', 'stroke-width': 2 }, cart); [-30, 30].forEach(function (x) { s('circle', { cx: x, cy: -6, r: 10, fill: '#1A1F28', stroke: '#9AA6BC', 'stroke-width': 2 }, cart); });
    var hA = hand(E);
    var ballG = s('g', {}, E), trail = s('path', { fill: 'none', stroke: '#9FD7FF', 'stroke-width': 2, 'stroke-dasharray': '3 6' }, ballG), straight = s('line', { stroke: '#7D89A3', 'stroke-width': 1.5, 'stroke-dasharray': '8 6' }, ballG), ball = s('circle', { r: 14, fill: '#B8C2D4', stroke: '#6B7280', 'stroke-width': 2 }, ballG);
    var mag = s('g', {}, ballG); s('path', { d: 'M-34 0 v-40 a34 34 0 0 1 68 0 v40 h-20 v-40 a14 14 0 0 0 -28 0 v40z', fill: '#E5484D' }, mag); s('rect', { x: -34, y: -8, width: 20, height: 12, fill: '#EEF2F8' }, mag); s('rect', { x: 14, y: -8, width: 20, height: 12, fill: '#EEF2F8' }, mag); mag.setAttribute('transform', 'translate(340 300) rotate(180)');
    s('text', { x: 300, y: 396, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'aimant' }, ballG);
    var sprG = s('g', {}, E), spr = s('path', { fill: 'none', stroke: '#9AA6BC', 'stroke-width': 4 }, sprG), plate = s('rect', { x: 250, width: 80, height: 10, rx: 3, fill: '#7D89A3' }, sprG); s('rect', { x: 250, y: 372, width: 80, height: 8, fill: '#5B6478' }, sprG); var hD = hand(sprG);
    var fE = arrow(E, '#FFB547'), fT = s('text', { 'font-size': 15, 'font-weight': 900, fill: '#FFC773' }, E);
    var eMsg = s('text', { x: 290, y: 426, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, E);
    /* ---------- VECTEUR ---------- */
    var V = s('g', {}, G), BX = 170, BY = 310, BW = 110, BH = 70;
    s('rect', { x: BX, y: BY, width: BW, height: BH, rx: 4, fill: '#B07A4A', stroke: '#6B4526', 'stroke-width': 3 }, V); s('path', { d: 'M' + BX + ' ' + BY + ' l' + BW + ' ' + BH + ' M' + (BX + BW) + ' ' + BY + ' l-' + BW + ' ' + BH, stroke: '#6B4526', 'stroke-width': 2 }, V); s('text', { x: BX + BW / 2, y: BY + BH + 22, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'caisse' }, V);
    var rope = s('line', { stroke: '#C8A46A', 'stroke-width': 3 }, V), dyn = s('g', {}, V); s('rect', { x: -26, y: -9, width: 52, height: 18, rx: 6, fill: '#E5E9F0', stroke: '#9AA6BC', 'stroke-width': 1.5 }, dyn); var dynT = s('text', { y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#B4232A' }, dyn);
    var dline = s('line', { stroke: '#9FD7FF', 'stroke-width': 1.5, 'stroke-dasharray': '10 6' }, V), angA = s('path', { fill: 'none', stroke: '#9FD7FF', 'stroke-width': 1.5 }, V), angT = s('text', { 'font-size': 12, 'font-weight': 800, fill: '#9FD7FF' }, V), hor = s('line', { stroke: '#7D89A3', 'stroke-width': 1, 'stroke-dasharray': '3 4' }, V);
    var fV = arrow(V, '#E5484D'), Apt = s('circle', { r: 6, fill: '#FFC773', stroke: '#0A0F1A', 'stroke-width': 2 }, V), AT = s('text', { 'font-size': 14, 'font-weight': 900, fill: '#FFC773', text: 'A' }, V), FT = s('text', { 'font-size': 16, 'font-weight': 900, fill: '#FF8A80' }, V);
    var scl = s('g', {}, V); s('line', { x1: 64, x2: 64 + CM, y1: 400, y2: 400, stroke: '#FFC773', 'stroke-width': 4 }, scl); s('text', { x: 64 + CM + 8, y: 404, 'font-size': 12, 'font-weight': 800, fill: '#FFC773', text: '1 cm ↔ 10 N' }, scl);
    var vMsg = s('text', { x: 310, y: 430, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#EEF2F8' }, V);
    /* ---------- PANNEAU ---------- */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    var pTitle = s('text', { x: PX + 140, y: 50, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7' }, P);
    var PE = s('g', {}, P), effRows = Object.keys(EFF).map(function (k, i) { var y = 70 + i * 62, g = s('g', {}, PE), r = s('rect', { x: PX + 14, y: y, width: 252, height: 52, rx: 12, fill: '#141C30', stroke: '#2B3A57', 'stroke-width': 2 }, g); s('text', { x: PX + 28, y: y + 22, 'font-size': 13.5, 'font-weight': 900, fill: '#EEF2F8', text: 'Une force ' + EFF[k].n.split(' ')[0] }, g); s('text', { x: PX + 28, y: y + 41, 'font-size': 12.5, fill: '#C9D2E3', text: EFF[k].n.split(' ').slice(1).join(' ') }, g); return { k: k, r: r, g: g }; });
    var badge = s('g', {}, PE), bR = s('rect', { x: PX + 40, y: 268, width: 200, height: 40, rx: 20 }, badge), bT = s('text', { x: PX + 140, y: 293, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#0A0F1A' }, badge);
    var PV = s('g', {}, P), chRows = [['Point d’application', '#FFC773'], ['Direction (droite d’action)', '#9FD7FF'], ['Sens', '#FF8A80'], ['Intensité (valeur)', '#5CFF9D']].map(function (r, i) { var y = 68 + i * 56, g = s('g', {}, PV), bx = s('rect', { x: PX + 14, y: y, width: 252, height: 48, rx: 12, fill: '#141C30', stroke: r[1], 'stroke-width': 1.5 }, g); s('text', { x: PX + 28, y: y + 19, 'font-size': 12, 'font-weight': 800, fill: r[1], text: r[0] }, g); var v = s('text', { x: PX + 28, y: y + 38, 'font-size': 13.5, 'font-weight': 900, fill: '#EEF2F8' }, g); return { g: g, b: bx, v: v }; });
    var pq = [0, 1, 2].map(function (k) { return s('text', { x: PX + 140, y: 350 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    function pset(a) { pq.forEach(function (t, k) { t.textContent = a[k] || ''; }); }
    var last = performance.now();
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var res = {};
      E.style.display = PE.style.display = st.mode === 'effets' ? '' : 'none'; V.style.display = PV.style.display = st.mode === 'vecteur' ? '' : 'none';
      if (st.mode === 'effets') {
        if (st.t == null && st.run) { st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) st.run = false; }
        var p = st.p, ef = st.eff;
        cart.style.display = hA.style.display = ef === 'mettre' ? '' : 'none'; ballG.style.display = ef === 'devier' ? '' : 'none'; sprG.style.display = ef === 'deformer' ? '' : 'none';
        pTitle.textContent = 'EFFETS D’UNE FORCE';
        if (ef === 'mettre') {
          var push = ease(p / 0.3), mv = Math.max(0, p - 0.3) / 0.7, cx = 170 + 22 * push + 280 * mv * mv;
          cart.setAttribute('transform', 'translate(' + cx + ' 380)'); var hx = p < 0.35 ? cx - 50 : cx - 50 - (p - 0.35) * 260; hA.setAttribute('transform', 'translate(' + Math.max(60, hx) + ' 354)');
          fE.set(cx - 50, 354, cx - 50 + 60, 354, p > 0.02 && p < 0.35); attr(fT, { x: cx - 40, y: 340, text: p > 0.02 && p < 0.35 ? 'F' : '' });
          eMsg.textContent = p < 0.02 ? 'Le chariot est immobile…' : p < 0.35 ? 'La main exerce une force sur le chariot' : 'Le chariot s’est mis en mouvement';
        } else if (ef === 'devier') {
          var x0 = 70, y0 = 200, pts = [], bx2, by2;
          for (var q = 0; q <= 40; q++) { var u = q / 40 * p, x = x0 + 420 * u, bend = u > 0.4 ? 80 * Math.pow((u - 0.4) / 0.6, 2) : 0; pts.push(x.toFixed(1) + ' ' + (y0 + bend).toFixed(1)); bx2 = x; by2 = y0 + bend; }
          trail.setAttribute('d', 'M' + pts.join(' L')); attr(straight, { x1: x0, y1: y0, x2: 500, y2: y0 }); attr(ball, { cx: bx2, cy: by2 });
          var near = p > 0.35 && p < 0.98, ax = 340 - bx2, ay = 300 - by2, al = Math.hypot(ax, ay); fE.set(bx2, by2, bx2 + ax / al * 70, by2 + ay / al * 70, near); attr(fT, { x: bx2 + ax / al * 70 + 6, y: by2 + ay / al * 70, text: near ? 'F' : '' });
          eMsg.textContent = p < 0.4 ? 'La bille roule en ligne droite…' : 'L’aimant attire la bille à distance : sa trajectoire se courbe';
        } else {
          var cpr = p < 0.6 ? ease(p / 0.45) : 1 - ease((p - 0.6) / 0.3), top = 372 - 150 + 80 * cpr, coils = 9, d = '';
          for (var c2 = 0; c2 <= coils * 2; c2++) { var yy = 372 - (372 - top) * c2 / (coils * 2); d += (c2 ? 'L' : 'M') + (290 + (c2 % 2 ? 24 : -24) * (c2 === 0 || c2 === coils * 2 ? 0 : 1)) + ' ' + yy.toFixed(1); }
          spr.setAttribute('d', d); attr(plate, { y: top - 10 }); hD.setAttribute('transform', 'translate(304 ' + (top - 22) + ') rotate(90)');
          fE.set(330 + 40, top - 70, 370, top - 12, cpr > 0.05); attr(fT, { x: 380, y: top - 36, text: cpr > 0.05 ? 'F' : '' });
          eMsg.textContent = cpr > 0.9 ? 'Le ressort est comprimé : il est déformé' : p > 0.7 ? 'Plus de force : le ressort reprend sa forme' : 'La main appuie sur le ressort…';
        }
        effRows.forEach(function (r) { var on = r.k === ef; r.r.setAttribute('stroke', on ? '#FFB547' : '#2B3A57'); r.g.setAttribute('opacity', on ? 1 : 0.45); });
        var dist = EFF[ef].k === 'distance'; bR.setAttribute('fill', dist ? '#B9A3E3' : '#FFB547'); bT.textContent = dist ? 'force à distance' : 'force de contact';
        pset(['Une force est une action', 'mécanique : ' + EFF[ef].a + '.', 'Elle se mesure en newtons (N).']);
        res = { eff: ef, p: p };
      } else {
        pTitle.textContent = 'CARACTÉRISTIQUES D’UNE FORCE';
        var A = st.pt === 'haut' ? [BX + BW / 2, BY] : [BX + BW, BY + BH / 2], th = st.ang * Math.PI / 180, L = st.F / 10 * CM, ux = Math.cos(th), uy = -Math.sin(th);
        var ex = A[0] + ux * L, ey = A[1] + uy * L;
        var tm = Math.min((528 - A[0]) / ux, uy < 0 ? (A[1] - 52) / -uy : 999), tb = Math.min((A[0] - 52) / ux, uy < 0 ? (378 - A[1]) / -uy : 999); attr(dline, { x1: A[0] - ux * tb, y1: A[1] - uy * tb, x2: A[0] + ux * tm, y2: A[1] + uy * tm }); attr(hor, { x1: A[0], y1: A[1], x2: A[0] + 90, y2: A[1] });
        var rr = 46; angA.setAttribute('d', 'M' + (A[0] + rr) + ' ' + A[1] + ' A' + rr + ' ' + rr + ' 0 0 0 ' + (A[0] + rr * ux) + ' ' + (A[1] + rr * uy)); attr(angT, { x: A[0] + 54, y: A[1] - 6, text: st.ang + '°' }); angA.style.display = angT.style.display = st.ang > 3 ? '' : 'none';
        var rx = A[0] + ux * Math.max(L + 40, 130), ry = A[1] + uy * Math.max(L + 40, 130); attr(rope, { x1: A[0], y1: A[1], x2: rx + ux * 60, y2: ry + uy * 60 }); dyn.setAttribute('transform', 'translate(' + rx + ' ' + ry + ') rotate(' + (-st.ang) + ')'); dynT.textContent = Math.round(st.F) + ' N';
        fV.set(A[0], A[1], ex, ey, st.F > 0); attr(Apt, { cx: A[0], cy: A[1] }); attr(AT, { x: A[0] - 18, y: A[1] - 8 }); attr(FT, { x: (A[0] + ex) / 2 - 8, y: (A[1] + ey) / 2 - 12, text: 'F' });
        var vals = ['point A (' + (st.pt === 'haut' ? 'haut de la caisse' : 'côté de la caisse') + ')', st.ang ? 'inclinée de ' + st.ang + '° sur l’horizontale' : 'horizontale', 'de A vers ' + (st.ang ? 'la droite et le haut' : 'la droite'), 'F = ' + Math.round(st.F) + ' N (' + fmt(st.F / 10, 1) + ' cm)'];
        chRows.forEach(function (r, i) { r.v.textContent = vals[i]; r.g.setAttribute('opacity', st.hl < 0 || st.hl === i ? 1 : 0.35); r.b.setAttribute('stroke-width', st.hl === i ? 3 : 1.5); });
        Apt.setAttribute('r', st.hl === 0 ? 9 : 6); dline.setAttribute('stroke-width', st.hl === 1 ? 3 : 1.5);
        vMsg.textContent = 'La corde tire la caisse : F = ' + Math.round(st.F) + ' N → flèche de ' + fmt(st.F / 10, 1) + ' cm';
        pset(['On représente une force par', 'un vecteur (une flèche)', 'tracé à l’échelle.']);
        res = { F: st.F, ang: st.ang, pt: st.pt, len: st.F / 10 };
      }
      return res;
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Qu’est-ce qu’une force ?' }, { t: 7, title: 'Mettre en mouvement' }, { t: 16, title: 'Modifier un mouvement' }, { t: 26, title: 'Déformer' }, { t: 34, title: 'Les caractéristiques' }, { t: 47, title: 'À l’échelle' }, { t: 57, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Une <b>force</b> peut mettre en mouvement, modifier un mouvement ou déformer', 'force de contact (main, fil) ou à distance (aimant, poids).', '#FFB547'],
      ['Elle a <b>4 caractéristiques</b>', 'point d’application, direction, sens, intensité.', '#9FD7FF'],
      ['L’intensité se mesure en <b>newtons</b> (dynamomètre)', 'on représente la force par une flèche tracée à l’échelle.', '#FF8A80']], [57.2, 61.8, 66.2]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 57.2)) {
        st.t = t;
        if (t < 16) { st.mode = 'effets'; st.eff = 'mettre'; st.p = Math.max(0, Math.min(1, (t - 8) / 6)); }
        else if (t < 26) { st.mode = 'effets'; st.eff = 'devier'; st.p = Math.max(0, Math.min(1, (t - 17) / 6)); }
        else if (t < 34) { st.mode = 'effets'; st.eff = 'deformer'; st.p = Math.max(0, Math.min(1, (t - 26.5) / 6.5)); }
        else if (t < 47) { st.mode = 'vecteur'; st.F = 30; st.ang = 30; st.pt = 'droite'; st.hl = t < 36 ? -1 : t < 38.6 ? 0 : t < 41.2 ? 1 : t < 43.8 ? 2 : t < 46.4 ? 3 : -1; }
        else { st.mode = 'vecteur'; st.hl = 3; st.ang = 0; st.F = 10 + 30 * K.k(t, 48, 4); }
        lab.step();
        tg.show(t, 1, 6.6, 290, 92, 'Qu’est-ce qu’une force ?') || tg.show(t, 8.5, 15.6, 290, 92, 'Effet 1 : mettre en mouvement') || tg.show(t, 18, 25.6, 290, 92, 'Effet 2 : modifier le mouvement') || tg.show(t, 27, 33.6, 290, 92, 'Effet 3 : déformer') ||
          tg.show(t, 36, 46.6, 290, 92, ['Point d’application : A', 'Direction : la droite d’action', 'Sens : de A vers le haut', 'Intensité : 30 N'][Math.min(3, Math.max(0, st.hl))]) || tg.show(t, 48, 56.6, 290, 92, Math.round(st.F) + ' N → ' + fmt(st.F / 10, 1) + ' cm');
      }
      bg.setAttribute('opacity', t > 56.8 ? 1 : 0);
      K.group(g5, t, 56.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une main pousse un chariot immobile qui se met en mouvement ; un aimant courbe la trajectoire d’une bille d’acier ; une main comprime un ressort ; puis une corde tire une caisse et la force est représentée par une flèche dont on montre le point d’application, la direction, le sens et l’intensité, tracée à l’échelle 1 cm pour 10 N',
    duration: 71, chapters: CH,
    segs: [
      { t: 0, d: 6.6, say: 'Pousser, tirer, lancer, attirer… En physique, toutes ces actions sont des forces. Que peut faire une force ?', sub: 'Qu’est-ce qu’une <b>force</b> ?' },
      { t: 7, d: 8.6, say: 'La main pousse le chariot immobile : il se met en mouvement. C’est une force de contact.', sub: 'Une force peut <b>mettre en mouvement</b>.' },
      { t: 16, d: 9.6, say: 'Une bille roule en ligne droite. L’aimant l’attire sans la toucher : sa trajectoire se courbe. C’est une force à distance.', sub: 'Elle peut <b>modifier un mouvement</b>, même à distance.' },
      { t: 26, d: 7.6, say: 'La main appuie sur le ressort : il se comprime. Une force peut aussi déformer un objet.', sub: 'Elle peut <b>déformer</b> un objet.' },
      { t: 34, d: 12.6, say: 'Une force a quatre caractéristiques : son point d’application, ici le point A ; sa direction, la droite d’action ; son sens, vers la droite et le haut ; et son intensité, trente newtons.', sub: 'Point d’application, direction, sens, <b>intensité</b>.' },
      { t: 47, d: 9.6, say: 'On la représente par une flèche à l’échelle. Avec un centimètre pour dix newtons, une force de quarante newtons fait quatre centimètres.', sub: '1 cm ↔ 10 N : 40 N → <b>4 cm</b>.' },
      { t: 57, d: 4.6, say: 'À retenir : une force peut mettre en mouvement, modifier un mouvement ou déformer.', sub: 'Trois effets.' },
      { t: 61.8, d: 4.2, say: 'Elle a quatre caractéristiques.', sub: 'Quatre caractéristiques.' },
      { t: 66.2, d: 4.8, say: 'Son intensité se mesure en newtons, avec un dynamomètre.', sub: 'Intensité en newtons.' }
    ],
    learn: [
      { t: 15, ch: 1, html: 'Une force peut <b>mettre en mouvement</b> (force de contact).' },
      { t: 25, ch: 2, html: 'Elle peut <b>modifier un mouvement</b>, même à distance (aimant).' },
      { t: 33, ch: 3, html: 'Elle peut <b>déformer</b> un objet.' },
      { t: 46, ch: 4, html: '4 caractéristiques : point, direction, sens, <b>intensité (N)</b>.' }
    ],
    question: { q: 'À l’échelle 1 cm ↔ 10 N, une force de 25 N se représente par une flèche de :', o: ['25 cm', '2,5 cm', '0,25 cm', '10 cm'], a: 1, e: '25 / 10 = 2,5 cm.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Deux activités : les effets d’une force (une main pousse un chariot, un aimant courbe la trajectoire d’une bille, une main comprime un ressort) ; puis une caisse tirée par une corde avec dynamomètre, dont on règle l’intensité, l’angle et le point d’application, la force étant représentée par une flèche à l’échelle 1 cm pour 10 N',
    steps: [
      'Effets : lance chaque expérience et observe l’effet de la force.',
      'Classe chaque force : de contact ou à distance ?',
      'Caractéristiques : règle l’intensité, l’angle et le point d’application.',
      'Lis la longueur de la flèche à l’échelle.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cM = c.seg({ label: 'Activité', value: 'effets', options: [{ v: 'effets', l: 'Effets d’une force' }, { v: 'vecteur', l: 'Caractéristiques' }], onChange: function (v) { st.mode = v; vis(); } });
      var cE = c.seg({ label: 'Expérience', value: 'mettre', options: [{ v: 'mettre', l: 'chariot' }, { v: 'devier', l: 'bille et aimant' }, { v: 'deformer', l: 'ressort' }], onChange: function (v) { st.eff = v; st.p = 0; st.run = false; } });
      var bL = c.button({ label: 'Lancer l’expérience', primary: true, onClick: function () { st.p = 0; st.run = true; api.sound('tick'); } });
      var sF = c.slider({ label: 'Intensité F', min: 0, max: 60, step: 5, value: 30, unit: 'N', dec: 0, onInput: function (v) { st.F = v; } });
      var sA = c.slider({ label: 'Angle avec l’horizontale', min: 0, max: 60, step: 5, value: 30, unit: '°', dec: 0, onInput: function (v) { st.ang = v; } });
      var cP = c.seg({ label: 'Point d’application', value: 'droite', options: [{ v: 'droite', l: 'côté' }, { v: 'haut', l: 'haut' }], onChange: function (v) { st.pt = v; } });
      function vis() { var e = st.mode === 'effets'; cE.hide(!e); bL.style.display = e ? '' : 'none'; sF.hide(e); sA.hide(e); cP.hide(e); }
      vis();
      var ro = api.readouts([{ k: 'a', label: 'Force' }, { k: 'b', label: 'Observation' }]), last = {};
      api.loop(function () { last = lab.step(); if (st.mode === 'effets') { ro.a.set(EFF[st.eff].k === 'distance' ? 'à distance' : 'de contact'); ro.b.set(st.p >= 0.5 ? 'elle ' + EFF[st.eff].n : '—'); } else { ro.a.set(Math.round(st.F) + ' N, ' + st.ang + '°'); ro.b.set('flèche : ' + fmt(st.F / 10, 1) + ' cm'); } });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push(st.mode === 'effets' ? { e: EFF[st.eff].a, o: 'elle ' + EFF[st.eff].n + ' (' + (EFF[st.eff].k === 'distance' ? 'à distance' : 'de contact') + ')' } : { e: 'corde : ' + Math.round(st.F) + ' N à ' + st.ang + '°', o: 'flèche de ' + fmt(st.F / 10, 1) + ' cm' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() { api.count(rows.length); tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Situation</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.e + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>'; api.chart.innerHTML = '<h3>Forces de contact et à distance</h3><table class="mt"><thead><tr><th>Force de contact</th><th>Force à distance</th></tr></thead><tbody><tr><td>main qui pousse</td><td>aimant qui attire le fer</td></tr><tr><td>corde, fil qui tire</td><td>poids (attraction de la Terre)</td></tr><tr><td>vent sur une voile</td><td>règle frottée qui attire des papiers</td></tr></tbody></table>'; }
      paint();
      api.onReset(function () { Object.assign(st, { mode: 'effets', eff: 'mettre', p: 0, run: false, F: 30, ang: 30, pt: 'droite', hl: -1 }); cM.set('effets'); cE.set('mettre'); sF.set(30); sA.set(30); cP.set('droite'); vis(); rows = []; paint(); });
      api.say('Lance l’expérience du chariot.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Une <b>force</b> est une action mécanique capable de <b>mettre un objet en mouvement</b>, de <b>modifier son mouvement</b> (vitesse ou direction) ou de le <b>déformer</b>. On distingue les forces <b>de contact</b> (main, corde, support) et les forces <b>à distance</b> (aimant, poids).</p><p>Une force est caractérisée par son <b>point d’application</b>, sa <b>direction</b> (droite d’action), son <b>sens</b> et son <b>intensité</b>, mesurée en newtons (N) avec un dynamomètre. On la représente par une flèche (vecteur) tracée à l’échelle.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Les forces' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function vctl(api, lab) { api.c.slider({ label: 'Intensité F', min: 0, max: 60, step: 5, value: lab.st.F, unit: 'N', dec: 0, onInput: function (v) { lab.st.F = v; } }); api.c.slider({ label: 'Angle', min: 0, max: 60, step: 5, value: lab.st.ang, unit: '°', dec: 0, onInput: function (v) { lab.st.ang = v; } }); api.c.seg({ label: 'Point d’application', value: lab.st.pt, options: [{ v: 'droite', l: 'côté' }, { v: 'haut', l: 'haut' }], onChange: function (v) { lab.st.pt = v; } }); }
  var DEFI = {
    title: 'Le défi des forces',
    intro: 'Pousse, tire, attire… et dessine juste !',
    missions: [
      { type: 'qcm', title: 'À distance', text: 'Laquelle de ces forces est une force <b>à distance</b> ?', o: ['la main qui pousse une porte', 'la corde qui tire une pirogue', 'l’aimant qui attire un clou', 'le pied qui frappe le ballon'], a: 2, hint: 'Il n’y a pas de contact.', e: 'L’aimant agit sans contact.' },
      { title: 'Horizontale', text: 'Représente une force <b>horizontale</b> de <span style="color:#5CFF9D">40 N</span> appliquée sur le côté de la caisse.', lumi: 'Angle nul, intensité 40 N.', hint: '0° et 40 N, point « côté ».',
        build: function (api) { var lab = mini(api, { mode: 'vecteur', F: 20, ang: 30 }); vctl(api, lab); return function () { var r = lab.res(); return r.F === 40 && r.ang === 0 && r.pt === 'droite' ? { ok: true, msg: '40 N horizontale : une flèche de 4 cm.' } : { ok: false, msg: 'F = ' + r.F + ' N, angle ' + r.ang + '°.' }; }; },
        e: 'Direction horizontale, intensité 40 N.' },
      { title: 'Flèche de 2,5 cm', text: 'À l’échelle 1 cm ↔ 10 N, obtiens une flèche de <b>2,5 cm</b>.', lumi: 'Intensité = longueur × 10.', hint: '25 N.',
        build: function (api) { var lab = mini(api, { mode: 'vecteur', F: 50, ang: 20 }); vctl(api, lab); return function () { var r = lab.res(); return Math.abs(r.len - 2.5) < 0.01 ? { ok: true, msg: '25 N ↔ 2,5 cm.' } : { ok: false, msg: 'Flèche de ' + fmt(r.len, 1) + ' cm.' }; }; },
        e: '2,5 × 10 = 25 N.' },
      { type: 'qcm', title: 'Les effets', text: 'Un gardien de but arrête le ballon : la force qu’il exerce…', o: ['déforme seulement le ballon', 'modifie le mouvement du ballon', 'n’a aucun effet', 'met en mouvement le gardien'], a: 1, hint: 'Le ballon s’arrête.', e: 'Elle modifie le mouvement (elle l’arrête).' },
      { type: 'qcm', title: 'L’unité', text: 'L’intensité d’une force s’exprime en :', o: ['kilogrammes', 'newtons', 'mètres', 'joules'], a: 1, hint: 'Comme le poids.', e: 'En newtons (N).' }
    ]
  };

  S.start({
    id: '3e-les-forces', level: '3e', theme: 'Mécanique', title: 'Les forces', back: '../3e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une <b>force</b> est une action mécanique capable de <b>mettre un objet en mouvement</b>, de <b>modifier son mouvement</b> ou de le <b>déformer</b>.',
      'On distingue les forces <b>de contact</b> (main, corde, support…) et les forces <b>à distance</b> (aimant, poids, électricité statique).',
      'Une force a <b>4 caractéristiques</b> : son <b>point d’application</b>, sa <b>direction</b> (droite d’action), son <b>sens</b> et son <b>intensité</b>.',
      'L’intensité d’une force se mesure avec un <b>dynamomètre</b> ; son unité est le <b>newton (N)</b>.',
      'On représente une force par un <b>vecteur</b> (une flèche) : il part du point d’application, suit la direction et le sens, et sa longueur est proportionnelle à l’intensité, selon une <b>échelle</b>.'
    ],
    quiz: [
      { q: 'Une force peut :', o: ['seulement déformer', 'mettre en mouvement, modifier un mouvement ou déformer', 'seulement arrêter', 'changer la masse'], a: 1, e: 'Trois effets possibles.' },
      { q: 'Le poids est une force :', o: ['de contact', 'à distance', 'sans intensité', 'horizontale'], a: 1, e: 'L’attraction de la Terre agit à distance.' },
      { q: 'L’intensité d’une force se mesure avec :', o: ['une balance', 'un dynamomètre', 'un thermomètre', 'une règle'], a: 1, e: 'Un dynamomètre.' },
      { q: 'Laquelle n’est pas une caractéristique d’une force ?', o: ['le sens', 'la direction', 'la couleur', 'l’intensité'], a: 2, e: 'Point, direction, sens, intensité.' },
      { q: 'À l’échelle 1 cm ↔ 5 N, une force de 20 N mesure :', o: ['20 cm', '4 cm', '5 cm', '100 cm'], a: 1, e: '20 / 5 = 4 cm.' }
    ]
  });
})();
