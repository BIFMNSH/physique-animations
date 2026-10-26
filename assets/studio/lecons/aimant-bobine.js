/* 4e · Courants et tensions alternatifs · Leçon : Aimant et bobine */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, ease = S.ease, K = S.kit;
  var KB = 6500, BE = 1;   // constante du champ des pôles, champ terrestre (vers le haut = nord)

  /* ---------- champ magnétique : pôles ponctuels + champ terrestre ---------- */
  function field(poles, x, y, earth) {
    var bx = 0, by = earth ? -BE : 0;
    poles.forEach(function (p) { var dx = x - p.x, dy = y - p.y, r2 = dx * dx + dy * dy + 60, r = Math.sqrt(r2), k = KB * p.q / (r2 * r); bx += k * dx; by += k * dy; });
    return { x: bx, y: by };
  }
  function lines(g, poles, W, H) {
    g.innerHTML = '';
    var Np = poles.filter(function (p) { return p.q > 0; });
    if (!Np.length || Math.abs(Np[0].q) < 0.05) return;
    Np.forEach(function (p) {
      for (var i = 0; i < 14; i++) {
        var a = i / 14 * 2 * Math.PI + 0.12, x = p.x + 12 * Math.cos(a), y = p.y + 12 * Math.sin(a), d = 'M' + x.toFixed(1) + ' ' + y.toFixed(1), mid = null;
        for (var k = 0; k < 420; k++) {
          var b = field(poles, x, y, false), L = Math.hypot(b.x, b.y) || 1; x += 5 * b.x / L; y += 5 * b.y / L;
          if (x < -40 || y < -40 || x > W + 40 || y > H + 40) break;
          if (poles.some(function (q) { return q.q < 0 && Math.hypot(x - q.x, y - q.y) < 10; })) break;
          d += 'L' + x.toFixed(1) + ' ' + y.toFixed(1);
          if (k === 40) mid = { x: x, y: y, a: Math.atan2(b.y, b.x) };
        }
        s('path', { d: d, fill: 'none', stroke: 'var(--violet)', 'stroke-width': 1.6, opacity: 0.55 }, g);
        if (mid) s('path', { d: 'M-6 -5 L5 0 L-6 5', fill: 'none', stroke: 'var(--violet)', 'stroke-width': 2, transform: 'translate(' + mid.x + ' ' + mid.y + ') rotate(' + (mid.a * 180 / Math.PI) + ')', opacity: 0.8 }, g);
      }
    });
  }
  function compass(G, x, y, r) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G); r = r || 26;
    s('circle', { r: r, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    s('circle', { r: r - 6, fill: 'none', stroke: 'var(--scene-line)', 'stroke-width': 1 }, g);
    var nd = s('g', {}, g);
    s('path', { d: 'M0 ' + (-r + 5) + ' L6 0 L-6 0Z', fill: 'var(--red)' }, nd);
    s('path', { d: 'M0 ' + (r - 5) + ' L6 0 L-6 0Z', fill: 'var(--scene-muted)' }, nd);
    s('circle', { r: 3, fill: 'var(--scene-text)' }, g);
    var hit = s('circle', { r: r + 8, fill: 'transparent' }, g);
    var o = { g: g, nd: nd, x: x, y: y, ang: 0, hit: hit };
    o.point = function (b) { var tgt = Math.atan2(b.x, -b.y) * 180 / Math.PI, d = ((tgt - o.ang + 540) % 360) - 180; o.ang += d * 0.18; nd.setAttribute('transform', 'rotate(' + o.ang + ')'); return tgt; };
    o.set = function (b) { o.ang = Math.atan2(b.x, -b.y) * 180 / Math.PI; nd.setAttribute('transform', 'rotate(' + o.ang + ')'); };
    o.move = function (nx, ny) { o.x = nx; o.y = ny; g.setAttribute('transform', 'translate(' + nx + ' ' + ny + ')'); };
    return o;
  }
  function magnet(G, x, y, L, flip) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G);
    s('rect', { x: -L / 2, y: -20, width: L / 2, height: 40, rx: 7, fill: flip ? 'var(--nord)' : 'var(--sud)' }, g);
    s('rect', { x: 0, y: -20, width: L / 2, height: 40, rx: 7, fill: flip ? 'var(--sud)' : 'var(--nord)' }, g);
    s('text', { x: -L / 4, y: 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: '#fff', text: flip ? 'N' : 'S' }, g);
    s('text', { x: L / 4, y: 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: '#fff', text: flip ? 'S' : 'N' }, g);
    return g;
  }
  /* bobine horizontale avec courant animé ; sens = +1 : face droite = nord */
  function coil(G, x, y, w, h) {
    var g = s('g', {}, G), o = { g: g };
    s('rect', { x: x - w / 2, y: y - h / 2 + 8, width: w, height: h - 16, rx: 8, fill: 'var(--scene2)', stroke: 'var(--scene-line)', 'stroke-width': 2 }, g);
    o.core = s('rect', { x: x - w / 2 - 20, y: y - 12, width: w + 40, height: 24, rx: 5, fill: '#8E97A6', opacity: 0 }, g);
    var n = 12; o.turns = [];
    for (var i = 0; i < n; i++) { var xx = x - w / 2 + 8 + i * (w - 16) / (n - 1); s('rect', { x: xx - 3.5, y: y - h / 2, width: 7, height: h, rx: 3.5, fill: 'var(--copper)' }, g); }
    o.cur = s('path', { d: '', fill: 'none', stroke: '#FFE29A', 'stroke-width': 3, 'stroke-dasharray': '6 12', opacity: 0 }, g);
    var d = ''; for (i = 0; i < n; i++) { xx = x - w / 2 + 8 + i * (w - 16) / (n - 1); d += 'M' + xx + ' ' + (y + h / 2 - 3) + 'V' + (y - h / 2 + 3); }
    o.cur.setAttribute('d', d);
    o.fL = s('text', { x: x - w / 2 - 34, y: y - h / 2 - 10, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800 }, g);
    o.fR = s('text', { x: x + w / 2 + 34, y: y - h / 2 - 10, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800 }, g);
    o.update = function (I, sens, core, showF, t) {
      o.core.setAttribute('opacity', core ? 0.9 : 0);
      var on = Math.abs(I) > 0.01;
      o.cur.setAttribute('opacity', on ? 0.95 : 0);
      o.cur.setAttribute('stroke-dashoffset', -t * 60 * sens);
      var R = sens > 0 ? 'nord' : 'sud', Lf = sens > 0 ? 'sud' : 'nord';
      attr(o.fL, { text: on && showF ? 'face ' + Lf : '' }); attr(o.fR, { text: on && showF ? 'face ' + R : '' });
      o.fL.style.fill = Lf === 'nord' ? 'var(--nord)' : 'var(--sud)'; o.fR.style.fill = R === 'nord' ? 'var(--nord)' : 'var(--sud)';
    };
    return o;
  }
  function battery(G, x, y) {
    var g = s('g', {}, G);
    s('rect', { x: x - 76, y: y - 26, width: 152, height: 52, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    var pl = s('text', { x: x - 58, y: y + 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800 }, g), pr = s('text', { x: x + 58, y: y + 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800 }, g);
    s('text', { x: x, y: y + 6, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'générateur' }, g);
    return { g: g, set: function (sens) { pl.textContent = sens > 0 ? '+' : '−'; pr.textContent = sens > 0 ? '−' : '+'; pl.style.fill = sens > 0 ? 'var(--red)' : 'var(--blue)'; pr.style.fill = sens > 0 ? 'var(--blue)' : 'var(--red)'; } };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les pôles d’un aimant' }, { t: 15, title: 'La boussole près d’un aimant' }, { t: 28, title: 'Une bobine devient un aimant' }, { t: 45, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, W = 900, H = 470;
    var g1 = s('g', {}, G), g2 = s('g', {}, G), g3 = s('g', {}, G), g4 = s('g', {}, G);
    // ch1 : deux aimants qui s'attirent / se repoussent + boussole terrestre
    var mA = s('g', {}, g1), mB = s('g', {}, g1), mR = s('g', {}, g1);
    magnet(mA, 0, 0, 180, false); magnet(mB, 0, 0, 180, false); magnet(mR, 0, 0, 180, true);
    var earth = s('g', {}, g1);
    s('circle', { cx: 0, cy: 0, r: 70, fill: 'var(--blue)', opacity: 0.25 }, earth);
    s('path', { d: 'M-40 -30 q20 -20 40 -10 q10 10 30 0 M-50 20 q30 10 50 -5', fill: 'none', stroke: 'var(--green)', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.6 }, earth);
    s('text', { x: 0, y: -84, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: 'var(--scene-text)', text: 'Nord géographique ↑' }, earth);
    var c0 = compass(earth, 0, 0, 30);
    var tg = K.tagger(G), chap = K.chapter(G, CH);
    // ch2 : aimant + boussoles + lignes de champ
    magnet(g2, 450, 250, 200, false);
    var poles2 = [{ x: 540, y: 250, q: 4 }, { x: 360, y: 250, q: -4 }];
    var lg2 = s('g', {}, g2); lines(lg2, poles2, W, H); g2.insertBefore(lg2, g2.firstChild);
    var cs2 = [[640, 250], [260, 250], [450, 130], [450, 370], [600, 140], [300, 360], [600, 360], [300, 140]].map(function (p) { return compass(g2, p[0], p[1], 22); });
    // ch3 : bobine + générateur + boussoles
    var co = coil(g3, 450, 230, 220, 120), bat = battery(g3, 450, 400);
    s('path', { d: 'M374 400H260V230H330M526 400H640V230H570', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, g3);
    var cs3 = [compass(g3, 230, 150, 26), compass(g3, 670, 150, 26)];
    var lg3 = s('g', { opacity: 0.8 }, g3); g3.insertBefore(lg3, g3.firstChild);
    var cards = K.cards(g4, [['Un aimant a deux <b>pôles</b> : nord et sud', 'deux pôles de même nom se repoussent, de noms différents s’attirent.', 'var(--amber)'],
      ['L’aiguille d’une <b>boussole</b> est un petit aimant', 'elle s’oriente vers le nord… ou selon l’aimant voisin.', 'var(--blue)'],
      ['Une <b>bobine</b> parcourue par un courant = un aimant', 'faces nord et sud ; inverser le courant inverse les faces.', 'var(--green)']], [45.2, 50.2, 55.2]);
    var last3 = null;
    function render(t) {
      tg.begin();
      // chapitre 1
      if (K.group(g1, t, -1, 15.2)) {
        var gap, rep = t < 7;
        if (rep) gap = t < 4.6 ? 260 - 140 * K.k(t, 2, 2.6) : 120 + 140 * K.k(t, 4.6, 1.6);
        else gap = t < 7.6 ? 260 : 260 - 260 * Math.pow(clamp((t - 7.6) / 1.4, 0, 1), 2.2);
        mA.setAttribute('transform', 'translate(' + (450 - 90 - gap / 2) + ' 160)');
        (rep ? mR : mB).setAttribute('transform', 'translate(' + (450 + 90 + gap / 2) + ' 160)');
        mR.style.display = rep ? '' : 'none'; mB.style.display = rep ? 'none' : '';
        tg.show(t, 2.6, 6.8, 450, 230, 'N face à N : ils se repoussent') || tg.show(t, 7.6, 10.4, 450, 230, 'N face à S : ils s’attirent');
        earth.setAttribute('transform', 'translate(450 360)'); earth.setAttribute('opacity', K.fade(t, 10.6, 16, 0.6));
        var sw = t < 11 ? 80 : 80 * Math.exp(-(t - 11) * 0.9) * Math.cos((t - 11) * 4);
        c0.nd.setAttribute('transform', 'rotate(' + sw + ')');
        tg.show(t, 11.8, 14.8, 450, 250, 'Le pôle nord de l’aiguille montre le nord');
        var mo = t > 10.6 ? 1 - K.k(t, 10.6, 0.6) : 1; mA.setAttribute('opacity', mo); mB.setAttribute('opacity', mo);
      }
      // chapitre 2
      if (K.group(g2, t, 15, 28.2)) {
        lg2.setAttribute('opacity', K.k(t, 21, 1.2) * 0.9);
        cs2.forEach(function (c, i) { var k = K.k(t, 16 + i * 0.5, 0.8), b = field(poles2, c.x, c.y, true); var tgt = Math.atan2(b.x, -b.y) * 180 / Math.PI; c.nd.setAttribute('transform', 'rotate(' + (k * tgt) + ')'); c.g.setAttribute('opacity', K.k(t, 15.4 + i * 0.3, 0.5)); });
        tg.show(t, 17.4, 21, 450, 96, 'Les aiguilles s’orientent autour de l’aimant') || tg.show(t, 21.6, 27.8, 450, 96, 'Lignes de champ : du pôle nord vers le pôle sud');
      }
      // chapitre 3
      if (K.group(g3, t, 28, 45.2)) {
        var on = t > 31.5, sens = t < 38.5 ? 1 : -1, I = on ? 2 : 0;
        bat.set(sens); co.update(I, sens, false, t > 33, t);
        var q = on ? 3.6 : 0, poles = [{ x: 560, y: 230, q: q * sens }, { x: 340, y: 230, q: -q * sens }];
        var key = on + ':' + sens; if (key !== last3) { last3 = key; if (on) lines(lg3, poles, W, H); else lg3.innerHTML = ''; }
        lg3.setAttribute('opacity', on ? 0.75 : 0);
        cs3.forEach(function (c) { var b = field(poles, c.x, c.y, true), tgt = Math.atan2(b.x, -b.y) * 180 / Math.PI; var d = ((tgt - c.ang + 540) % 360) - 180; c.ang += d * 0.12; c.nd.setAttribute('transform', 'rotate(' + c.ang + ')'); });
        tg.show(t, 28.6, 31.4, 450, 100, 'Interrupteur ouvert : rien ne se passe') || tg.show(t, 32, 38, 450, 100, 'Le courant passe : la bobine agit comme un aimant') || tg.show(t, 38.8, 44.6, 450, 100, 'Courant inversé : les faces s’inversent');
      }
      if (t < 28) cs3.forEach(function (c) { c.ang = 0; });
      K.group(g4, t, 44.8, 99);
      cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : deux aimants qui se repoussent puis s’attirent, une boussole, des boussoles autour d’un aimant avec les lignes de champ, puis une bobine parcourue par un courant qui agit comme un aimant',
    duration: 60, chapters: CH,
    segs: [
      { t: 0, d: 4.6, say: 'Un aimant possède deux pôles : un pôle nord et un pôle sud.', sub: 'Un aimant a deux <b>pôles</b> : un pôle <b>nord</b> et un pôle <b>sud</b>.' },
      { t: 4.8, d: 2.6, say: 'Deux pôles nord face à face se repoussent.', sub: 'Deux pôles de <b>même nom</b> se <b>repoussent</b>.' },
      { t: 7.6, d: 3, say: 'Un pôle nord et un pôle sud s’attirent.', sub: 'Deux pôles de <b>noms différents</b> s’<b>attirent</b>.' },
      { t: 10.8, d: 4, say: 'L’aiguille d’une boussole est un petit aimant : son pôle nord indique le nord géographique.', sub: 'L’aiguille d’une <b>boussole</b> est un petit aimant : elle montre le <b>nord</b>.' },
      { t: 15, d: 5.6, say: 'Près d’un aimant, les aiguilles des boussoles s’orientent toutes autour de lui.', sub: 'Près d’un aimant, les aiguilles <b>s’orientent autour de lui</b>.' },
      { t: 21, d: 6.6, say: 'On dessine des lignes de champ : elles sortent du pôle nord et entrent dans le pôle sud.', sub: 'Les <b>lignes de champ</b> vont du pôle <b>nord</b> vers le pôle <b>sud</b>.' },
      { t: 28, d: 3.6, say: 'Voici une bobine reliée à un générateur. Interrupteur ouvert : rien.', sub: 'Une <b>bobine</b> et un générateur : interrupteur ouvert, <b>rien</b>.' },
      { t: 31.8, d: 6.6, say: 'Le courant passe : la bobine se comporte comme un aimant, avec une face nord et une face sud.', sub: 'Avec un <b>courant</b>, la bobine devient un <b>aimant</b> : face nord, face sud.' },
      { t: 38.6, d: 6.2, say: 'Inversons le sens du courant : les faces nord et sud s’inversent, et les boussoles se retournent.', sub: 'On <b>inverse le courant</b> : les faces s’<b>inversent</b>.' },
      { t: 45, d: 4.8, say: 'À retenir : un aimant a deux pôles. Les pôles de même nom se repoussent.', sub: 'Les pôles de <b>même nom</b> se repoussent, les autres s’attirent.' },
      { t: 50, d: 4.8, say: 'Une boussole est un petit aimant qui s’oriente dans le champ magnétique.', sub: 'La <b>boussole</b> s’oriente dans le <b>champ magnétique</b>.' },
      { t: 55, d: 4.8, say: 'Une bobine parcourue par un courant se comporte comme un aimant.', sub: 'Bobine + <b>courant</b> = <b>aimant</b> (électroaimant).' }
    ],
    learn: [
      { t: 9, ch: 1, html: 'Pôles de <b>même nom</b> : répulsion ; de <b>noms différents</b> : attraction.' },
      { t: 13, ch: 1, html: 'L’aiguille d’une boussole est un <b>petit aimant</b>.' },
      { t: 24, ch: 2, html: 'Les lignes de champ vont du pôle <b>N</b> au pôle <b>S</b>.' },
      { t: 36, ch: 3, html: 'Une bobine parcourue par un courant a une <b>face nord</b> et une <b>face sud</b>.' },
      { t: 42, ch: 3, html: 'Inverser le courant <b>inverse les faces</b>.' }
    ],
    question: { q: 'On approche le pôle nord d’une aiguille aimantée de la face d’une bobine : l’aiguille est repoussée. Cette face est…', o: ['une face nord', 'une face sud', 'neutre', 'on ne peut pas savoir'], a: 0, e: 'Deux pôles de même nom se repoussent : la face est une face nord.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  function Lab(G, o) {
    var W = 860, H = 470, st = { src: o.src || 'coil', I: o.I == null ? 1.5 : o.I, sens: 1, on: o.on == null ? true : o.on, core: false, N: 500, showF: o.showF !== false, showL: o.showL !== false, flip: false };
    var lg = s('g', {}, G);
    var cg = s('g', {}, G), co = coil(cg, 430, 230, 200, 110), bat = battery(cg, 430, 400);
    s('path', { d: 'M354 400H250V230H330M506 400H610V230H530', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, cg);
    var swG = s('g', { style: 'cursor:pointer' }, cg), lev = s('line', { x1: 290, y1: 400, stroke: 'var(--scene-text)', 'stroke-width': 4, 'stroke-linecap': 'round' }, swG);
    s('rect', { x: 270, y: 380, width: 60, height: 40, fill: 'transparent' }, swG); s('text', { x: 310, y: 432, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--scene-muted)', text: 'K' }, swG);
    swG.addEventListener('click', function () { st.on = !st.on; o.onSwitch && o.onSwitch(st.on); });
    var mg = s('g', {}, G), mag = null;
    function drawMag() { mg.innerHTML = ''; mag = magnet(mg, 430, 230, 200, st.flip); }
    drawMag();
    var cs = [[200, 230, 'A'], [660, 230, 'B'], [430, 90, 'C']].map(function (p) { var c = compass(G, p[0], p[1], 28); s('text', { x: 0, y: -38, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-muted)', text: p[2] }, c.g); return c; });
    cs.forEach(function (c) {
      c.hit.style.cursor = 'grab'; c.hit.style.touchAction = 'none';
      var drag = false;
      c.hit.addEventListener('pointerdown', function (e) { drag = true; try { c.hit.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); });
      c.hit.addEventListener('pointermove', function (e) { if (!drag) return; var sv = G.ownerSVGElement, p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; p = p.matrixTransform(G.getScreenCTM().inverse()); c.move(clamp(p.x, 30, W - 30), clamp(p.y, 40, H - 30)); });
      c.hit.addEventListener('pointerup', function () { drag = false; });
    });
    var key = '';
    function poles() {
      if (st.src === 'mag') { var q = 4; return st.flip ? [{ x: 340, y: 230, q: q }, { x: 520, y: 230, q: -q }] : [{ x: 520, y: 230, q: q }, { x: 340, y: 230, q: -q }]; }
      var qq = st.on ? st.I * st.N / 500 * (st.core ? 4 : 1) : 0; return [{ x: 530, y: 230, q: qq * st.sens }, { x: 330, y: 230, q: -qq * st.sens }];
    }
    function step(dt, T) {
      var isC = st.src === 'coil';
      cg.style.display = isC ? '' : 'none'; mg.style.display = isC ? 'none' : '';
      lev.setAttribute('x2', st.on ? 330 : 322); lev.setAttribute('y2', st.on ? 400 : 378);
      bat.set(st.sens); co.update(st.on ? st.I : 0, st.sens, st.core, st.showF, T);
      var P = poles(), k = st.src + st.on + st.sens + st.I + st.core + st.N + st.flip + st.showL;
      if (k !== key) { key = k; if (st.showL) lines(lg, P, W, H); else lg.innerHTML = ''; }
      cs.forEach(function (c) { c.point(field(P, c.x, c.y, true)); });
    }
    function dev(c) { var b = field(poles(), c.x, c.y, true); var a = Math.atan2(b.x, -b.y) * 180 / Math.PI; return a; }
    return { st: st, step: step, cs: cs, dev: dev, drawMag: drawMag, poles: poles };
  }
  var SIM = {
    W: 860, H: 470,
    panels: [{ n: 'Expérience', r: [40, 40, 500, 406] }, { n: 'Mesures', r: [560, 22, 280, 424] }],
    alt: 'Une bobine reliée à un générateur et un interrupteur, ou un aimant droit, entourés de trois boussoles déplaçables et des lignes de champ',
    steps: [
      'Choisis « Aimant droit » : observe les boussoles A, B, C et les lignes de champ. Déplace une boussole autour de l’aimant.',
      'Choisis « Bobine », ferme l’interrupteur K : la bobine agit-elle comme un aimant ? Repère sa face nord grâce aux boussoles.',
      'Inverse le sens du courant, puis augmente l’intensité, ajoute un noyau de fer : que deviennent les faces et la déviation de la boussole A ?',
      'Relève la déviation de la boussole A pour plusieurs intensités (onglet Mesures) et trace la courbe.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { src: 'coil', on: false, onSwitch: function (v) { tK.set(v); } }), st = lab.st, rows = [], c = api.c;
      var cS = c.seg({ label: 'Source', value: 'coil', options: [{ v: 'mag', l: 'Aimant droit' }, { v: 'coil', l: 'Bobine' }], onChange: function (v) { st.src = v; vis(); } });
      var bFlip = c.button({ label: 'Retourner l’aimant', sm: true, onClick: function () { st.flip = !st.flip; lab.drawMag(); } });
      var tK = c.toggle({ label: 'Interrupteur K fermé', value: false, onChange: function (v) { st.on = v; api.say(v ? 'Le courant passe : regarde les boussoles !' : 'Circuit ouvert : plus de courant.'); } });
      var sI = c.slider({ label: 'Intensité du courant I', min: 0, max: 3, step: 0.1, value: st.I, unit: 'A', dec: 1, onInput: function (v) { st.I = v; } });
      var cD = c.seg({ label: 'Sens du courant', value: 1, options: [{ v: 1, l: 'Sens 1' }, { v: -1, l: 'Sens 2 (inversé)' }], onChange: function (v) { st.sens = v; } });
      var cN = c.seg({ label: 'Bobine', value: 500, options: [{ v: 250, l: '250 spires' }, { v: 500, l: '500 spires' }, { v: 1000, l: '1000 spires' }], onChange: function (v) { st.N = v; } });
      var tC = c.toggle({ label: 'Noyau de fer dans la bobine', value: false, onChange: function (v) { st.core = v; } });
      var tF = c.toggle({ label: 'Afficher les faces', value: S.prof.level !== 'exp', onChange: function (v) { st.showF = v; } }); st.showF = S.prof.level !== 'exp';
      var tL = c.toggle({ label: 'Lignes de champ', value: true, onChange: function (v) { st.showL = v; } });
      function vis() { var co = st.src === 'coil'; [tK, sI, cD, cN, tC, tF].forEach(function (x) { x.hide(!co); }); bFlip.style.display = co ? 'none' : ''; }
      vis();
      var ro = api.readouts([{ k: 'I', label: 'Intensité' }, { k: 'f', label: 'Face droite' }, { k: 'a', label: 'Déviation boussole A' }, { k: 'e', label: 'Effet' }]);
      api.loop(function (dt, T) {
        lab.step(dt, T);
        var isC = st.src === 'coil', on = isC && st.on && st.I > 0;
        ro.I.set(isC ? (st.on ? fmt(st.I, 1) + ' A' : '0 A') : '—');
        ro.f.set(isC ? (on ? (st.showF ? (st.sens > 0 ? 'nord' : 'sud') : '?') : '—') : (st.flip ? 'S' : 'N'));
        var a = lab.dev(lab.cs[0]); ro.a.set(Math.round(Math.abs(a)) + '°');
        ro.e.set(isC ? (on ? (Math.abs(a) > 60 ? 'fort' : Math.abs(a) > 25 ? 'moyen' : 'faible') : 'aucun') : 'aimant');
      });
      var M = api.measure; M.innerHTML = '<h3>Boussole A : déviation</h3><p style="font-size:13px;color:var(--muted);margin:0 0 8px">La boussole A doit rester sur l’axe de la bobine. Relève sa déviation (angle avec le nord) pour plusieurs intensités.</p>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever la déviation'), msg = api.h('div', { class: 'msg' }, M), tb = api.h('div', {}, M);
      bR.onclick = function () {
        if (st.src !== 'coil') { msg.className = 'msg warn'; msg.textContent = 'Choisis la bobine pour cette mesure.'; return; }
        var a = Math.abs(lab.dev(lab.cs[0])), na = Math.round(a + (S.prof.level === 'dec' ? 0 : S.gauss() * 1.5));
        rows.push({ I: st.on ? st.I : 0, N: st.N, core: st.core, a: Math.max(0, na) }); msg.className = 'msg ok'; msg.textContent = 'Déviation relevée : ' + Math.max(0, na) + '°.'; api.sound('ok'); paint(); if (rows.length >= 4) api.done();
      };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>I (A)</th><th>Spires</th><th>Noyau</th><th>Déviation</th><th></th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr><td>' + fmt(r.I, 1) + '</td><td>' + r.N + '</td><td>' + (r.core ? 'oui' : 'non') + '</td><td>' + r.a + '°</td><td><button data-i="' + i + '" aria-label="Supprimer">×</button></td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune mesure pour l’instant.</div>';
        tb.querySelectorAll('button[data-i]').forEach(function (b) { b.onclick = function () { rows.splice(+b.dataset.i, 1); paint(); }; });
        api.chart.innerHTML = '<h3>Déviation de A en fonction de I</h3>'; var bx = api.h('div', {}, api.chart);
        var keys = {}; rows.forEach(function (r) { keys[r.N + (r.core ? 'f' : '')] = 1; });
        var cols = ['var(--amber)', 'var(--blue)', 'var(--green)', 'var(--violet)', 'var(--red)', 'var(--scene-text)'];
        S.chart(bx, { xlabel: 'I (A)', ylabel: 'déviation (°)', xmin: 0, xmax: 3, xstep: 0.5, ymin: 0, ymax: 90, ystep: 15, series: Object.keys(keys).map(function (k, i) { return { color: cols[i % 6], pts: rows.filter(function (r) { return r.N + (r.core ? 'f' : '') === k; }).map(function (r) { return [r.I, r.a]; }) }; }) });
        api.h('p', { style: 'font-size:12px;color:var(--muted);margin:6px 0 0' }, api.chart, Object.keys(keys).map(function (k, i) { return '<span style="color:' + cols[i % 6] + '">●</span> ' + parseInt(k, 10) + ' spires' + (k.slice(-1) === 'f' ? ' + noyau' : ''); }).join(' · '));
      }
      paint();
      api.onReset(function () { st.src = 'coil'; st.on = false; st.I = 1.5; st.sens = 1; st.N = 500; st.core = false; st.flip = false; cS.set('coil'); tK.set(false); sI.set(1.5); cD.set(1); cN.set(500); tC.set(false); lab.drawMag(); vis(); lab.cs[0].move(200, 230); lab.cs[1].move(660, 230); lab.cs[2].move(430, 90); rows = []; paint(); });
      api.say('Commence par fermer l’interrupteur K (dans les commandes ou sur le schéma).');
      return { bilan: function () {
        if (rows.length < 2) return '<p>Relève la déviation de la boussole A pour au moins 2 intensités différentes.</p>';
        var h = '<p>Plus l’intensité du courant est grande, plus la déviation de la boussole est grande : <b>l’effet magnétique de la bobine augmente avec I</b>.</p>';
        if (rows.some(function (r) { return r.core; }) && rows.some(function (r) { return !r.core; })) h += '<p>Avec un <b>noyau de fer</b>, l’effet est beaucoup plus fort : c’est un <b>électroaimant</b>.</p>';
        if (rows.some(function (r) { return r.N === 1000; }) || rows.some(function (r) { return r.N === 250; })) h += '<p>Plus il y a de <b>spires</b>, plus l’effet est grand.</p>';
        return h + '<p>Inverser le sens du courant inverse les faces nord et sud de la bobine.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Bobine, générateur et boussoles' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); api.loop(function (dt, T) { lab.step(dt, T); }); return lab; }
  var DEFI = {
    title: 'Le défi des aimants',
    intro: 'Pôles, boussoles et électroaimants : trouve les faces, fais tourner les aiguilles et ne te laisse pas piéger par les questions éclair !',
    missions: [
      { title: 'La face mystère', text: 'Fais en sorte que la face <span style="color:var(--amber)">gauche</span> de la bobine soit une face <span style="color:var(--amber)">NORD</span>, puis valide.', lumi: 'Les faces sont cachées ! Regarde la boussole A : son pôle nord (rouge) est repoussé par une face nord.', hint: 'Une face nord repousse le pôle nord (rouge) de l’aiguille A : la pointe rouge doit s’éloigner de la bobine, vers la gauche.',
        build: function (api) { var lab = mini(api, { on: true, showF: false, I: 1.5 }); api.c.seg({ label: 'Sens du courant', value: 1, options: [{ v: 1, l: 'Sens 1' }, { v: -1, l: 'Sens 2' }], onChange: function (v) { lab.st.sens = v; } }); return function () { return lab.st.on && lab.st.sens === -1 ? { ok: true, msg: 'Face gauche nord : elle repousse la pointe rouge de la boussole A.' } : { ok: false, msg: lab.st.on ? 'Non : la pointe rouge de A est attirée, c’est une face sud.' : 'Le courant ne passe pas : ferme K.' }; }; },
        e: 'On repère une face nord : elle repousse le pôle nord d’une aiguille aimantée.' },
      { type: 'qcm', title: 'Face à face', text: 'On approche le pôle nord d’un aimant du pôle nord d’un autre aimant. Que se passe-t-il ?', o: ['Ils s’attirent', 'Ils se repoussent', 'Rien', 'Ils s’aimantent'], a: 1, hint: 'Même nom…', e: 'Deux pôles de même nom se repoussent.' },
      { title: 'Électroaimant puissant', text: 'Fais dévier la boussole A d’au moins <span style="color:var(--amber)">70°</span>.', lumi: 'Intensité, nombre de spires, noyau de fer… tout compte !', hint: 'Mets le noyau de fer et augmente l’intensité.',
        build: function (api) { var lab = mini(api, { on: true, I: 0.5, showL: false }); api.c.slider({ label: 'Intensité I', min: 0, max: 3, step: 0.1, value: 0.5, unit: 'A', dec: 1, onInput: function (v) { lab.st.I = v; } }); api.c.toggle({ label: 'Noyau de fer', value: false, onChange: function (v) { lab.st.core = v; } }); return function () { var a = Math.abs(lab.dev(lab.cs[0])); return a >= 70 ? { ok: true, msg: 'Déviation de ' + Math.round(a) + '° : un vrai électroaimant !' } : { ok: false, msg: 'Seulement ' + Math.round(a) + '°.' }; }; },
        e: 'L’effet magnétique augmente avec l’intensité et avec un noyau de fer.' },
      { type: 'qcm', title: 'Inversion', text: 'On inverse le sens du courant dans une bobine. Ses faces…', o: ['ne changent pas', 's’inversent', 'disparaissent', 'deviennent toutes les deux nord'], a: 1, hint: 'Repense au chapitre 3 du résumé.', e: 'La face nord devient une face sud, et inversement.' },
      { type: 'qcm', title: 'La grue du ferrailleur', text: 'Pourquoi la grue d’une casse lâche-t-elle la ferraille quand on coupe le courant ?', o: ['La ferraille devient trop lourde', 'L’électroaimant n’est plus un aimant sans courant', 'Le fer devient un aimant nord', 'Le courant est trop fort'], a: 1, hint: 'Que fait une bobine sans courant ?', e: 'Sans courant, la bobine (électroaimant) n’agit plus comme un aimant.' }
    ]
  };

  S.start({
    inquiry: {"situation": "Un élève veut produire une tension avec un aimant et une bobine. Faut-il déplacer l’aimant ou suffit-il de le laisser près de la bobine ?", "prediction": "Avant de manipuler, prévois le résultat et justifie ton choix avec « car » ou « parce que ».", "criteria": ["Je décris au moins deux essais avec leurs conditions et leurs résultats.", "Je compare ces résultats à ma prévision initiale.", "Je rédige un bilan argumenté et précise une limite de la simulation."]},
    id: '4e-aimant-bobine', level: '4e', theme: 'Courants et tensions alternatifs', title: 'Aimant et bobine', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un aimant possède deux <b>pôles</b> : un pôle nord (N) et un pôle sud (S). Deux pôles de même nom se <b>repoussent</b> ; deux pôles de noms différents s’<b>attirent</b>.',
      'L’aiguille d’une <b>boussole</b> est un petit aimant : loin de tout aimant, son pôle nord indique le nord géographique. Près d’un aimant, elle s’oriente selon le <b>champ magnétique</b>.',
      'Les <b>lignes de champ</b> sortent du pôle nord et entrent dans le pôle sud de l’aimant.',
      'Une <b>bobine parcourue par un courant</b> se comporte comme un aimant : elle a une <b>face nord</b> et une <b>face sud</b>. Si on inverse le sens du courant, les faces s’inversent.',
      'L’effet est plus fort si l’intensité augmente, si la bobine a plus de spires et avec un <b>noyau de fer</b> : c’est un <b>électroaimant</b> (grue, sonnette, haut-parleur).'
    ],
    quiz: [
      { q: 'Combien de pôles possède un aimant droit ?', o: ['1', '2', '3', 'Aucun'], a: 1, e: 'Un pôle nord et un pôle sud.' },
      { q: 'Un pôle sud et un pôle nord placés face à face :', o: ['s’attirent', 'se repoussent', 's’ignorent', 's’annulent'], a: 0, e: 'Deux pôles de noms différents s’attirent.' },
      { q: 'Loin de tout aimant, le pôle nord de l’aiguille d’une boussole indique :', o: ['le sud géographique', 'le nord géographique', 'l’est', 'n’importe quelle direction'], a: 1, e: 'Elle s’oriente vers le nord géographique.' },
      { q: 'Une bobine parcourue par un courant se comporte comme :', o: ['une pile', 'un aimant', 'une lampe', 'un isolant'], a: 1, e: 'Elle possède une face nord et une face sud.' },
      { q: 'Pour rendre un électroaimant plus puissant, on peut :', o: ['diminuer l’intensité', 'enlever des spires', 'ajouter un noyau de fer', 'inverser le courant'], a: 2, e: 'Le noyau de fer renforce beaucoup l’effet magnétique ; augmenter I et le nombre de spires aussi.' }
    ]
  });
})();

