/* 4e · Optique · Leçon : Sources et récepteurs de lumière */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit;
  var TR = { none: 1, glass: 0.92, calque: 0.35, bois: 0 };
  var MAT = { none: 'aucun écran', glass: 'verre (transparent)', calque: 'papier calque (translucide)', bois: 'planche (opaque)' };

  /* ---------- dessins ---------- */
  var GID = 0;
  function glowFill(G, col) { var id = 'gl' + (GID++), gr = s('radialGradient', { id: id }, s('defs', {}, G)); s('stop', { offset: 0, 'stop-color': col, 'stop-opacity': 0.85 }, gr); s('stop', { offset: 0.45, 'stop-color': col, 'stop-opacity': 0.35 }, gr); s('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, gr); return 'url(#' + id + ')'; }
  function bulb(G, x, y, r) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g }; r = r || 1;
    o.glow = s('circle', { r: 90 * r, fill: glowFill(g, '#FFE29A'), opacity: 0 }, g);
    o.glass = s('path', { d: 'M0 ' + (-34 * r) + ' a' + 26 * r + ' ' + 26 * r + ' 0 1 1 -0.1 0z', transform: 'translate(0 ' + 8 * r + ')', fill: '#FFF6D5', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    s('rect', { x: -12 * r, y: 26 * r, width: 24 * r, height: 18 * r, rx: 3, fill: '#9AA0A8' }, g);
    s('path', { d: 'M' + (-8 * r) + ' ' + 14 * r + ' q' + 8 * r + ' ' + (-26 * r) + ' ' + 16 * r + ' 0', fill: 'none', stroke: '#C68B4E', 'stroke-width': 2 }, g);
    o.set = function (on, k) { o.glow.setAttribute('opacity', on ? 0.9 * (k == null ? 1 : k) : 0); o.glass.style.fill = on ? '#FFE680' : '#ECEFF3'; };
    return o;
  }
  function candle(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('rect', { x: -14, y: -10, width: 28, height: 70, rx: 4, fill: '#F4EEDC', stroke: '#B8B2A4' }, g);
    o.glow = s('circle', { cy: -30, r: 60, fill: glowFill(g, '#FFC773'), opacity: 0.8 }, g);
    o.fl = s('path', { d: 'M0 -48 c-10 14 -8 26 0 34 c8 -8 10 -20 0 -34z', fill: '#FFB547' }, g);
    s('path', { d: 'M0 -38 c-4 8 -3 14 0 18 c3 -4 4 -10 0 -18z', fill: '#FFF2B8' }, g);
    return o;
  }
  function sun(G, x, y, r) { var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G); s('circle', { r: r * 2.2, fill: glowFill(g, '#FFC773'), opacity: 0.9 }, g); for (var i = 0; i < 12; i++) s('line', { x1: 0, y1: -r * 1.2, x2: 0, y2: -r * 1.55, stroke: '#FFB547', 'stroke-width': 4, 'stroke-linecap': 'round', transform: 'rotate(' + i * 30 + ')' }, g); s('circle', { r: r, fill: '#FFB547' }, g); return g; }
  function moon(G, x, y, r) { var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G); s('circle', { r: r, fill: '#C9CED6' }, g); s('circle', { cx: -r * 0.3, cy: -r * 0.2, r: r * 0.18, fill: '#AEB4BE' }, g); s('circle', { cx: r * 0.3, cy: r * 0.3, r: r * 0.12, fill: '#AEB4BE' }, g); return g; }
  function book(G, x, y) { var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g }; o.c = s('rect', { x: -40, y: -54, width: 80, height: 108, rx: 6, fill: '#3B82F6' }, g); o.p = s('rect', { x: -32, y: -46, width: 64, height: 22, rx: 3, fill: '#EEF2F8' }, g); o.t = s('text', { y: -30, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#142033', text: 'PHYSIQUE' }, g); o.set = function (k) { g.setAttribute('opacity', 0.08 + 0.92 * clamp(k, 0, 1)); }; return o; }
  function eye(G, x, y, flip) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' + (flip ? ' scale(-1 1)' : '') }, G), o = { g: g };
    s('path', { d: 'M-40 0 Q0 -32 40 0 Q0 32 -40 0Z', fill: '#FDFBF4', stroke: 'var(--scene-text)', 'stroke-width': 2.5 }, g);
    o.iris = s('circle', { cx: -14, r: 14, fill: '#6B4A2E' }, g); s('circle', { cx: -14, r: 6, fill: '#141414' }, g);
    o.lid = s('path', { d: 'M-40 0 Q0 -32 40 0', fill: '#8B5A3C', opacity: 0 }, g);
    return o;
  }
  function screen(G, x, y, mat) {
    var g = s('g', {}, G);
    if (mat === 'none') return g;
    var f = mat === 'glass' ? { fill: '#BFE3FF', op: 0.35, st: '#7FC4F5' } : mat === 'calque' ? { fill: '#F2F2EC', op: 0.75, st: '#C8C8BE' } : { fill: '#9A6B3F', op: 1, st: '#6B4626' };
    s('rect', { x: x - 9, y: y - 90, width: 18, height: 180, rx: 4, fill: f.fill, opacity: f.op, stroke: f.st, 'stroke-width': 2 }, g);
    if (mat === 'bois') for (var i = 0; i < 5; i++) s('path', { d: 'M' + (x - 6) + ' ' + (y - 80 + i * 36) + ' q6 10 0 20', fill: 'none', stroke: '#6B4626', 'stroke-width': 1.5 }, g);
    if (mat === 'glass') s('path', { d: 'M' + (x - 4) + ' ' + (y - 70) + ' l6 -10 M' + (x - 4) + ' ' + (y - 40) + ' l6 -10', stroke: '#fff', 'stroke-width': 2 }, g);
    return g;
  }
  function ray(G, x1, y1, x2, y2, k, col) { if (k <= 0.02) return; var p = s('path', { d: 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2, stroke: col || '#FFE29A', 'stroke-width': 3, opacity: clamp(k, 0.15, 1), 'stroke-dasharray': '10 8' }, G); s('path', { d: K.arrow(x1 + (x2 - x1) * 0.52, y1 + (y2 - y1) * 0.52, x1 + (x2 - x1) * 0.6, y1 + (y2 - y1) * 0.6, 1.5, 7, 12), fill: col || '#FFE29A', opacity: clamp(k, 0.2, 1) }, G); return p; }
  function solarFan(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g, a: 0 };
    s('rect', { x: -50, y: -30, width: 60, height: 80, rx: 4, fill: '#1F3A6B', stroke: '#9AB4D8', 'stroke-width': 2, transform: 'skewY(-8)' }, g);
    for (var i = 1; i < 4; i++) s('line', { x1: -50, y1: -30 + i * 20, x2: 10, y2: -30 + i * 20 - 8, stroke: '#9AB4D8', 'stroke-width': 1 }, g);
    s('path', { d: 'M10 30 H40 V-20', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 2.5 }, g);
    s('circle', { cx: 40, cy: -20, r: 9, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    o.fan = s('g', { transform: 'translate(40 -20)' }, g); for (i = 0; i < 3; i++) s('ellipse', { cx: 0, cy: -16, rx: 6, ry: 16, fill: 'var(--blue)', transform: 'rotate(' + i * 120 + ')' }, o.fan);
    s('text', { x: -10, y: 74, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'cellule photovoltaïque' }, g);
    o.spin = function (dt, k) { o.a += dt * 900 * k; o.fan.setAttribute('transform', 'translate(40 -20) rotate(' + o.a + ')'); };
    return o;
  }
  function luxmeter(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('rect', { x: -40, y: -60, width: 80, height: 120, rx: 12, fill: '#F2C94C', stroke: '#7A5F12', 'stroke-width': 2 }, g);
    s('circle', { cx: 0, cy: -36, r: 14, fill: '#EEF2F8', stroke: '#7A5F12', 'stroke-width': 2 }, g);
    s('rect', { x: -32, y: -12, width: 64, height: 32, rx: 4, fill: '#C9D6B8' }, g);
    o.v = s('text', { x: 26, y: 12, 'text-anchor': 'end', 'font-size': 18, 'font-weight': 800, fill: '#1C2416', 'font-family': 'ui-monospace, monospace' }, g);
    s('text', { y: 44, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#2A1A00', text: 'luxmètre' }, g);
    return o;
  }
  function photores(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('rect', { x: -30, y: -14, width: 60, height: 28, rx: 14, fill: '#E3B57A', stroke: '#7A4A2A', 'stroke-width': 2 }, g);
    s('path', { d: 'M-18 -6 h8 v12 h8 v-12 h8 v12 h8', fill: 'none', stroke: '#7A4A2A', 'stroke-width': 2.5 }, g);
    o.led = s('circle', { cx: 0, cy: 50, r: 12, fill: '#4A1C1C' }, g); o.ledG = s('circle', { cx: 0, cy: 50, r: 26, fill: '#FF5A5A', opacity: 0 }, g);
    s('path', { d: 'M-30 0 H-46 V50 H-12 M30 0 H46 V50 H12', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 2.5 }, g);
    o.rT = s('text', { y: 88, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: 'var(--scene-muted)' }, g);
    s('text', { y: -24, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'photorésistance' }, g);
    return o;
  }

  /* ---------- banc : lampe — écran — récepteur ---------- */
  function Lab(G, o) {
    var st = Object.assign({ on: true, d: 60, mat: 'none', rec: 'lux', src: 'lampe' }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: 'var(--scene)' }, G);
    s('rect', { x: 30, y: 330, width: 800, height: 12, rx: 6, fill: 'var(--scene2)', stroke: 'var(--scene-line)' }, G);
    for (var c = 0; c <= 140; c += 10) { var gx = 90 + c * 5; if (gx > 830) break; s('line', { x1: gx, x2: gx, y1: 330, y2: c % 50 ? 336 : 342, stroke: 'var(--scene-muted)' }, G); if (c % 20 === 0) s('text', { x: gx, y: 360, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--scene-muted)', text: c + ' cm' }, G); }
    var rays = s('g', {}, G), lamp = bulb(G, 90, 200, 1), cnd = candle(G, 90, 240), scr = s('g', {}, G), rcv = s('g', {}, G);
    var lux = luxmeter(rcv, 0, 0), fan = solarFan(rcv, 0, 0), pr = photores(rcv, 0, 0), ey = eye(rcv, 0, 0, true);
    var info = s('text', { x: 430, y: 410, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: 'var(--scene-text)' }, G);
    var lastMat = null, E = 0;
    function lightAt() { if (!st.on) return 0; var P = st.src === 'lampe' ? 1 : 0.08, d = st.d / 100; return 400 * P / (d * d) * TR[st.mat]; }
    function step(dt) {
      var x = 90 + st.d * 5; E = lightAt();
      lamp.g.style.display = st.src === 'lampe' ? '' : 'none'; cnd.g.style.display = st.src === 'bougie' ? '' : 'none';
      lamp.set(st.on); cnd.glow.setAttribute('opacity', st.on ? 0.8 : 0); cnd.fl.style.display = st.on ? '' : 'none';
      var sx = 90 + 0.45 * (x - 90) + 20, key = st.mat + sx;
      if (lastMat !== key) { lastMat = key; scr.innerHTML = ''; screen(scr, sx, 200, st.mat); }
      rays.innerHTML = '';
      if (st.on) [-40, 0, 40].forEach(function (dy) {
        var k = TR[st.mat];
        ray(rays, 120, 200 + dy * 0.2, sx - 10, 200 + dy * 0.6, 1);
        if (k > 0) ray(rays, sx + 10, 200 + dy * 0.6, x - 30, 200 + dy * 0.3, k);
      });
      [lux, fan, pr, ey].forEach(function (r) { r.g.style.display = 'none'; });
      var R = st.rec === 'lux' ? lux : st.rec === 'fan' ? fan : st.rec === 'pr' ? pr : ey;
      R.g.style.display = ''; R.g.setAttribute('transform', 'translate(' + x + ' ' + (st.rec === 'fan' ? 200 : st.rec === 'pr' ? 190 : 200) + ')' + (st.rec === 'eye' ? ' scale(-1 1)' : ''));
      var k = clamp(Math.log10(1 + E) / 3.6, 0, 1);
      lux.v.textContent = fmt(E, E < 10 ? 1 : 0);
      fan.spin(dt, k);
      var Rph = 1e6 / (1 + E * 20); pr.rT.textContent = 'R = ' + (Rph > 1000 ? fmt(Rph / 1000, 0) + ' kΩ' : fmt(Rph, 0) + ' Ω'); pr.ledG.setAttribute('opacity', k * 0.6); pr.led.style.fill = k > 0.1 ? '#FF5A5A' : '#4A1C1C';
      info.textContent = st.rec === 'eye' ? (E > 2 ? 'L’œil reçoit la lumière : il voit la lampe' : 'L’œil ne reçoit pas de lumière') : st.rec === 'fan' ? (k > 0.05 ? 'Le moteur tourne : la cellule transforme la lumière en électricité' : 'Le moteur ne tourne pas') : st.rec === 'pr' ? 'Plus il y a de lumière, plus R est faible et plus la DEL brille' : 'Éclairement mesuré : ' + fmt(E, E < 10 ? 1 : 0) + ' lux';
    }
    return { st: st, step: step, E: function () { return E; }, lightAt: lightAt };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les sources de lumière' }, { t: 15, title: 'Voir un objet' }, { t: 29, title: 'Les récepteurs' }, { t: 40, title: 'Laisser passer la lumière ?' }, { t: 51, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g1 = s('g', {}, G), g2 = s('g', {}, G), g3 = s('g', {}, G), g4 = s('g', {}, G), g5 = s('g', {}, G);
    var dark1 = s('rect', { x: 0, y: 0, width: 900, height: 470, fill: '#000', opacity: 0 }, g1);
    sun(g1, 150, 170, 40); var b1 = bulb(g1, 330, 170, 1), c1 = candle(g1, 470, 190);
    moon(g1, 640, 160, 38); var bk1 = book(g1, 780, 180);
    var lab1 = s('text', { x: 330, y: 300, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#FFB547', text: 'Sources primaires : elles produisent la lumière' }, g1);
    var lab2 = s('text', { x: 710, y: 300, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#5CC8FF', text: 'Objets diffusants (sources secondaires)' }, g1);
    var b2 = bulb(g2, 130, 150, 1), bk2 = book(g2, 470, 260), e2 = eye(g2, 770, 170, true), r2 = s('g', {}, g2);
    var g3a = solarFan(g3, 220, 230), g3b = photores(g3, 470, 210), e3 = eye(g3, 720, 230, true), b3 = bulb(g3, 470, 70, 0.8), r3 = s('g', {}, g3);
    s('text', { x: 720, y: 300, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'l’œil' }, g3);
    var mats = ['glass', 'calque', 'bois'], b4 = bulb(g4, 110, 230, 0.9), r4 = s('g', {}, g4), sc4 = s('g', {}, g4);
    mats.forEach(function (m, i) { screen(sc4, 380, 230 + 0, m); });
    var cap4 = s('text', { x: 470, y: 380, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: 'var(--scene-text)' }, g4);
    var cards = K.cards(g5, [
      ['Une <b>source primaire</b> produit la lumière', 'Soleil, lampe allumée, flamme, étoiles.', 'var(--amber)'],
      ['Un <b>objet diffusant</b> renvoie la lumière reçue', 'Lune, livre, mur : on les voit s’ils sont éclairés.', 'var(--blue)'],
      ['On <b>voit</b> un objet si sa lumière entre dans l’œil', 'récepteurs : œil, cellule photovoltaïque, photorésistance.', 'var(--green)']], [51.2, 55.8, 60.4]);
    function render(t) {
      tg.begin();
      if (K.group(g1, t, -1, 15.2)) {
        var dk = K.k(t, 9, 1) * (1 - K.k(t, 13, 0.6)); dark1.setAttribute('opacity', dk * 0.85);
        b1.set(true); c1.fl.setAttribute('transform', 'scale(1 ' + (1 + 0.06 * Math.sin(t * 12)) + ')');
        lab1.setAttribute('opacity', K.k(t, 1.5, 0.6)); lab2.setAttribute('opacity', K.k(t, 5, 0.6));
        bk1.set(1 - dk); g1.appendChild(dark1); g1.insertBefore(dark1, g1.childNodes[1]);
        tg.show(t, 9.4, 12.8, 450, 400, 'Dans le noir, on ne voit plus le livre ni la Lune !');
      }
      if (K.group(g2, t, 15, 29.2)) {
        var on = t > 16.5 && !(t > 24 && t < 27); b2.set(on); bk2.set(on ? 1 : 0.1);
        r2.innerHTML = ''; if (on) { ray(r2, 160, 165, 430, 230, 1); ray(r2, 510, 240, 735, 180, 0.9); ray(r2, 500, 220, 640, 100, 0.5, '#9ADFFF'); ray(r2, 500, 300, 650, 380, 0.5, '#9ADFFF'); }
        tg.show(t, 17, 23.6, 450, 420, 'Lampe → livre → œil : on voit le livre') || tg.show(t, 24.2, 26.8, 450, 420, 'Lampe éteinte : plus de lumière, plus d’image');
      }
      if (K.group(g3, t, 29, 40.2)) {
        b3.set(true); g3a.spin(0.016, 1); g3b.ledG.setAttribute('opacity', 0.5); g3b.led.style.fill = '#FF5A5A'; g3b.rT.textContent = 'R faible';
        r3.innerHTML = ''; ray(r3, 450, 95, 250, 190, 1); ray(r3, 470, 100, 470, 180, 1); ray(r3, 490, 95, 690, 210, 1);
        tg.show(t, 30, 39.6, 450, 420, 'Ils réagissent à la lumière qu’ils reçoivent');
      }
      if (K.group(g4, t, 40, 51.2)) {
        var i = t < 43.6 ? 0 : t < 47.2 ? 1 : 2, m = mats[i];
        sc4.innerHTML = ''; screen(sc4, 380, 230, m); b4.set(true);
        r4.innerHTML = ''; [-30, 0, 30].forEach(function (d) { ray(r4, 140, 230 + d * 0.3, 370, 230 + d, 1); if (TR[m] > 0) ray(r4, 390, 230 + d, 820, 230 + d * (m === 'calque' ? 3 : 1.4), TR[m]); });
        cap4.textContent = ['Verre : transparent, on voit nettement à travers', 'Calque : translucide, lumière diffusée, image floue', 'Planche : opaque, la lumière ne passe pas'][i];
      }
      K.group(g5, t, 51, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : sources primaires et objets diffusants, le trajet de la lumière de la lampe au livre puis à l’œil, des récepteurs de lumière et des écrans transparent, translucide et opaque',
    duration: 65, chapters: CH,
    segs: [
      { t: 0, d: 4.6, say: 'Le Soleil, une lampe allumée, une flamme produisent leur propre lumière : ce sont des sources primaires.', sub: 'Soleil, lampe, flamme <b>produisent</b> la lumière : <b>sources primaires</b>.' },
      { t: 4.8, d: 4.2, say: 'La Lune ou un livre ne font que renvoyer la lumière qu’ils reçoivent : ce sont des objets diffusants.', sub: 'La Lune, un livre <b>renvoient</b> la lumière : <b>objets diffusants</b>.' },
      { t: 9.2, d: 5.6, say: 'Dans le noir complet, on ne les voit plus : ils ont besoin d’être éclairés.', sub: 'Dans le <b>noir</b>, on ne les voit plus.' },
      { t: 15, d: 8.6, say: 'Pour voir le livre, la lumière de la lampe arrive sur le livre, qui la diffuse dans toutes les directions. Une partie entre dans l’œil.', sub: 'Lampe → livre → <b>œil</b> : la lumière diffusée <b>entre dans l’œil</b>.' },
      { t: 24, d: 5, say: 'Si la lampe s’éteint, plus aucune lumière n’entre dans l’œil : on ne voit plus le livre.', sub: 'Pas de lumière dans l’œil = <b>on ne voit pas</b>.' },
      { t: 29, d: 5.4, say: 'L’œil est un récepteur de lumière. Il y en a d’autres : la cellule photovoltaïque fait tourner un moteur.', sub: 'Récepteurs : l’<b>œil</b>, la <b>cellule photovoltaïque</b>…' },
      { t: 34.6, d: 5.2, say: 'La résistance d’une photorésistance diminue quand elle est éclairée.', sub: '…la <b>photorésistance</b> : sa résistance diminue à la lumière.' },
      { t: 40, d: 3.4, say: 'Le verre est transparent : la lumière le traverse et on voit nettement à travers.', sub: 'Le verre est <b>transparent</b>.' },
      { t: 43.6, d: 3.4, say: 'Le papier calque est translucide : la lumière passe, mais on ne voit pas nettement à travers.', sub: 'Le papier calque est <b>translucide</b>.' },
      { t: 47.2, d: 3.6, say: 'Le bois est opaque : la lumière ne passe pas.', sub: 'Le bois est <b>opaque</b>.' },
      { t: 51, d: 4.6, say: 'À retenir : une source primaire produit de la lumière.', sub: 'Une <b>source primaire</b> produit la lumière.' },
      { t: 55.8, d: 4.4, say: 'Un objet diffusant renvoie la lumière qu’il reçoit.', sub: 'Un <b>objet diffusant</b> la renvoie.' },
      { t: 60.4, d: 4.4, say: 'On voit un objet si la lumière qui vient de lui entre dans notre œil.', sub: 'On voit un objet si sa lumière <b>entre dans l’œil</b>.' }
    ],
    learn: [
      { t: 6, ch: 1, html: '<b>Sources primaires</b> : Soleil, lampe, flamme. <b>Objets diffusants</b> : Lune, livre.' },
      { t: 22, ch: 2, html: 'On voit un objet si sa lumière <b>entre dans l’œil</b>.' },
      { t: 37, ch: 3, html: 'Récepteurs : œil, cellule photovoltaïque, photorésistance.' },
      { t: 50, ch: 4, html: '<b>Transparent</b>, <b>translucide</b>, <b>opaque</b>.' }
    ],
    question: { q: 'La Lune brille la nuit. C’est :', o: ['une source primaire', 'un objet diffusant éclairé par le Soleil', 'une étoile', 'un récepteur'], a: 1, e: 'La Lune ne produit pas de lumière : elle diffuse celle du Soleil.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Source', r: [0, 50, 330, 330] }, { n: 'Récepteur', r: [320, 50, 340, 330] }],
    alt: 'Banc gradué avec une lampe ou une bougie, un écran (verre, calque, planche) et un récepteur : luxmètre, cellule photovoltaïque, photorésistance ou œil',
    steps: [
      'Choisis un récepteur et allume la lampe : comment réagit-il ? Éteins-la.',
      'Place un écran de verre, de papier calque puis une planche entre la lampe et le récepteur.',
      'Avec le luxmètre, éloigne le récepteur de la lampe : comment varie l’éclairement ?',
      'Relève l’éclairement pour plusieurs distances (onglet Mesures) et compare avec une bougie.'
    ],
    build: function (api) {
      var lab = Lab(api.g, {}), st = lab.st, c = api.c, rows = [];
      var cSrc = c.seg({ label: 'Source', value: 'lampe', options: [{ v: 'lampe', l: 'Lampe' }, { v: 'bougie', l: 'Bougie' }], onChange: function (v) { st.src = v; } });
      var tOn = c.toggle({ label: 'Source allumée', value: true, onChange: function (v) { st.on = v; } });
      var cM = c.seg({ label: 'Écran entre les deux', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'glass', l: 'verre' }, { v: 'calque', l: 'papier calque' }, { v: 'bois', l: 'planche' }], onChange: function (v) { st.mat = v; } });
      var cR = c.seg({ label: 'Récepteur', value: 'lux', options: [{ v: 'lux', l: 'luxmètre' }, { v: 'fan', l: 'cellule + moteur' }, { v: 'pr', l: 'photorésistance' }, { v: 'eye', l: 'œil' }], onChange: function (v) { st.rec = v; } });
      var sD = c.slider({ label: 'Distance source – récepteur', min: 30, max: 140, step: 5, value: 60, unit: 'cm', onInput: function (v) { st.d = v; } });
      var ro = api.readouts([{ k: 's', label: 'Source' }, { k: 'm', label: 'Écran' }, { k: 'd', label: 'Distance' }, { k: 'e', label: 'Éclairement' }]);
      api.loop(function (dt) { lab.step(dt); ro.s.set(st.on ? st.src : 'éteinte'); ro.m.set({ none: 'aucun', glass: 'transparent', calque: 'translucide', bois: 'opaque' }[st.mat]); ro.d.set(st.d + ' cm'); ro.e.set(fmt(lab.E(), lab.E() < 10 ? 1 : 0) + ' lux'); });
      var M = api.measure; M.innerHTML = '<h3>Éclairement mesuré au luxmètre</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), msg = api.h('div', { class: 'msg' }, M), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { if (st.rec !== 'lux') { msg.className = 'msg warn'; msg.textContent = 'Choisis le luxmètre pour mesurer l’éclairement.'; return; } var E = lab.E() * (1 + (S.prof.level === 'dec' ? 0 : S.gauss() * 0.02)); rows.push({ src: st.on ? st.src : 'éteinte', m: st.mat, d: st.d, E: Math.max(0, E) }); msg.className = 'msg ok'; msg.textContent = 'Relevé : ' + fmt(E, E < 10 ? 1 : 0) + ' lux à ' + st.d + ' cm.'; api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Source</th><th>Écran</th><th>d (cm)</th><th>E (lux)</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.src + '</td><td>' + MAT[r.m].split(' (')[0] + '</td><td>' + r.d + '</td><td>' + fmt(r.E, r.E < 10 ? 1 : 0) + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure pour l’instant.</div>';
        api.chart.innerHTML = '<h3>Éclairement en fonction de la distance</h3>'; var bx = api.h('div', {}, api.chart);
        S.chart(bx, { xlabel: 'd (cm)', ylabel: 'E (lux)', xmin: 0, xmax: 140, xstep: 20, ymin: 0, ymax: 4500, ystep: 1000, series: [{ color: 'var(--amber)', pts: rows.filter(function (r) { return r.m === 'none' && r.src === 'lampe'; }).map(function (r) { return [r.d, r.E]; }) }, { color: 'var(--blue)', pts: rows.filter(function (r) { return r.m !== 'none' && r.src === 'lampe'; }).map(function (r) { return [r.d, r.E]; }) }] });
        api.h('p', { style: 'font-size:12px;color:var(--muted);margin:6px 0 0' }, api.chart, '<span style="color:var(--amber)">●</span> lampe sans écran · <span style="color:var(--blue)">●</span> avec un écran');
      }
      paint();
      api.onReset(function () { Object.assign(st, { on: true, d: 60, mat: 'none', rec: 'lux', src: 'lampe' }); cSrc.set('lampe'); tOn.set(true); cM.set('none'); cR.set('lux'); sD.set(60); rows = []; paint(); });
      api.say('Allume ou éteins la source et change de récepteur : que se passe-t-il ?');
      return { bilan: function () {
        if (rows.length < 2) return '<p>Relève l’éclairement pour au moins 2 distances.</p>';
        return '<p>Plus le récepteur est <b>loin</b> de la source, plus l’éclairement est <b>faible</b> (si la distance double, il est divisé par 4).</p><p>Un écran <b>transparent</b> laisse passer presque toute la lumière, un écran <b>translucide</b> laisse passer la lumière en la diffusant (on ne voit pas nettement à travers), un écran <b>opaque</b> rien du tout.</p><p>Une bougie éclaire beaucoup moins qu’une lampe.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Banc avec source, écran et récepteur' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); api.loop(function (dt) { lab.step(dt); }); return lab; }
  var DEFI = {
    title: 'Le défi de la lumière',
    intro: 'Sources, objets diffusants, récepteurs et écrans : à toi de faire passer la lumière là où il faut !',
    missions: [
      { title: 'Plein soleil', text: 'Fais tourner le moteur de la cellule photovoltaïque à <span style="color:var(--amber)">pleine vitesse</span> : il faut au moins 1 500 lux.', lumi: 'Distance et écran comptent tous les deux…', hint: 'Enlève la planche et rapproche la cellule de la lampe.',
        build: function (api) { var lab = mini(api, { rec: 'fan', mat: 'bois', d: 120 }); api.c.seg({ label: 'Écran', value: 'bois', options: [{ v: 'none', l: 'aucun' }, { v: 'calque', l: 'calque' }, { v: 'bois', l: 'planche' }], onChange: function (v) { lab.st.mat = v; } }); api.c.slider({ label: 'Distance', min: 30, max: 140, step: 5, value: 120, unit: 'cm', onInput: function (v) { lab.st.d = v; } }); return function () { var E = lab.E(); return E >= 1500 ? { ok: true, msg: 'Éclairement de ' + fmt(E, 0) + ' lux : le moteur tourne à fond !' } : { ok: false, msg: 'Seulement ' + fmt(E, 0) + ' lux.' }; }; },
        e: 'Plus la cellule est proche de la lampe, et sans écran opaque, plus elle reçoit de lumière.' },
      { type: 'qcm', title: 'Source ou pas ?', text: 'Parmi ces objets, lequel est une source primaire de lumière ?', o: ['La Lune', 'Un miroir', 'Une bougie allumée', 'Un mur blanc'], a: 2, hint: 'Qui produit sa propre lumière ?', e: 'La flamme de la bougie produit de la lumière ; les autres la renvoient.' },
      { type: 'qcm', title: 'Voir dans le noir', text: 'Dans une pièce totalement noire, on ne voit pas un livre posé sur la table, parce que…', o: ['le livre est trop petit', 'aucune lumière venant du livre n’entre dans l’œil', 'l’œil est fermé', 'le livre est opaque'], a: 1, hint: 'Condition pour voir un objet…', e: 'Sans lumière, le livre ne diffuse rien vers l’œil.' },
      { title: 'L’œil ne voit rien', text: 'L’œil ne doit <span style="color:var(--amber)">plus du tout</span> voir la lampe allumée. Choisis le bon écran.', lumi: 'Transparent, translucide ou opaque ?', hint: 'Seul un écran opaque arrête toute la lumière.',
        build: function (api) { var lab = mini(api, { rec: 'eye', mat: 'none', d: 80 }); api.c.seg({ label: 'Écran', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'glass', l: 'verre' }, { v: 'calque', l: 'calque' }, { v: 'bois', l: 'planche' }], onChange: function (v) { lab.st.mat = v; } }); return function () { return lab.st.mat === 'bois' ? { ok: true, msg: 'La planche est opaque : aucune lumière ne passe.' } : { ok: false, msg: 'Un peu de lumière passe encore.' }; }; },
        e: 'Un corps opaque ne laisse pas passer la lumière.' },
      { type: 'qcm', title: 'Récepteur', text: 'Lequel de ces objets est un récepteur de lumière ?', o: ['Une lampe de poche', 'Un panneau solaire', 'Une bougie', 'Une étoile'], a: 1, hint: 'Il réagit à la lumière qu’il reçoit.', e: 'Le panneau solaire (cellules photovoltaïques) transforme la lumière reçue en électricité.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un objet est visible dans une pièce. Produit-il lui-même de la lumière ou reçoit-il celle d’une autre source ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-sources-recepteurs', level: '4e', theme: 'Optique', title: 'Sources et récepteurs de lumière', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une <b>source primaire</b> de lumière produit sa propre lumière : le Soleil, les étoiles, une lampe allumée, une flamme.',
      'Un <b>objet diffusant</b> (source secondaire) renvoie dans toutes les directions une partie de la lumière qu’il reçoit : la Lune, les planètes, un livre, un mur. On ne le voit que s’il est éclairé.',
      'On <b>voit un objet</b> lorsque de la lumière provenant de cet objet entre dans notre œil.',
      'Un <b>récepteur</b> de lumière réagit à la lumière qu’il reçoit : l’œil, la cellule photovoltaïque (panneau solaire), la photorésistance, le capteur d’un appareil photo.',
      'Un corps <b>transparent</b> laisse passer la lumière et on voit nettement à travers (verre, eau) ; un corps <b>translucide</b> laisse passer la lumière en la diffusant : on ne voit pas nettement à travers (papier calque, verre dépoli) ; un corps <b>opaque</b> ne la laisse pas passer (bois, métal).'
    ],
    quiz: [
      { q: 'Laquelle est une source primaire de lumière ?', o: ['La Lune', 'Le Soleil', 'Une feuille blanche', 'Une vitre'], a: 1, e: 'Le Soleil produit sa propre lumière.' },
      { q: 'Un mur blanc éclairé est :', o: ['une source primaire', 'un objet diffusant', 'un récepteur', 'opaque et invisible'], a: 1, e: 'Il diffuse la lumière qu’il reçoit.' },
      { q: 'Pour voir un objet, il faut que :', o: ['l’œil envoie de la lumière vers l’objet', 'de la lumière venant de l’objet entre dans l’œil', 'l’objet soit transparent', 'il fasse jour'], a: 1, e: 'C’est la condition de visibilité.' },
      { q: 'Le papier calque est :', o: ['transparent', 'translucide', 'opaque', 'une source'], a: 1, e: 'Il laisse passer la lumière en la diffusant : on ne voit pas nettement à travers.' },
      { q: 'Quand une photorésistance est éclairée, sa résistance :', o: ['augmente', 'diminue', 'ne change pas', 'devient infinie'], a: 1, e: 'Elle diminue avec l’éclairement.' }
    ]
  });
})();

