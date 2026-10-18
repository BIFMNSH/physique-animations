/* 4e · Courants et tensions alternatifs · Leçon : Dangers du courant du secteur */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, clamp = S.clamp, K = S.kit;
  var U = 220;
  var LEVELS = [[1, 'non perçu', 'var(--green)'], [10, 'picotements, secousse', 'var(--green)'], [30, 'contractions : on ne peut plus lâcher', 'var(--amber)'], [75, 'arrêt de la respiration possible', 'var(--red)'], [1e9, 'fibrillation du cœur : mortel', 'var(--red)']];
  function level(mA) { for (var i = 0; i < LEVELS.length; i++) if (mA < LEVELS[i][0]) return { i: i, t: LEVELS[i][1], c: LEVELS[i][2] }; }

  /* ---------- dessins ---------- */
  function socket(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('rect', { x: -60, y: -60, width: 120, height: 120, rx: 22, fill: '#F4F1EA', stroke: '#B8B2A4', 'stroke-width': 3 }, g);
    s('circle', { r: 46, fill: '#E6E1D6', stroke: '#B8B2A4', 'stroke-width': 2 }, g);
    s('circle', { cx: -18, cy: 4, r: 7, fill: '#1A1A1A' }, g); s('circle', { cx: 18, cy: 4, r: 7, fill: '#1A1A1A' }, g);
    s('rect', { x: -4, y: -42, width: 8, height: 16, rx: 3, fill: '#9AA0A8' }, g);
    s('text', { x: -18, y: 36, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C0392B', text: 'P' }, g);
    s('text', { x: 18, y: 36, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#1F6FB5', text: 'N' }, g);
    s('text', { x: 0, y: -48, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: '#17894F', text: 'T' }, g);
    return o;
  }
  function screwdriver(G) {
    var g = s('g', {}, G);
    s('rect', { x: -6, y: -150, width: 12, height: 90, rx: 6, fill: '#E5484D' }, g);
    var neon = s('rect', { x: -4, y: -132, width: 8, height: 26, rx: 3, fill: '#FFB347', opacity: 0.25 }, g);
    var glow = s('circle', { cx: 0, cy: -119, r: 24, fill: '#FFB347', opacity: 0 }, g);
    s('rect', { x: -2, y: -60, width: 4, height: 60, fill: '#C0C6CE' }, g);
    return { g: g, set: function (on) { neon.setAttribute('opacity', on ? 1 : 0.25); glow.setAttribute('opacity', on ? 0.5 : 0); } };
  }
  function person(G) {
    var g = s('g', {}, G), o = { g: g };
    o.aura = s('ellipse', { cx: 0, cy: -80, rx: 60, ry: 110, fill: '#FFE29A', opacity: 0 }, g);
    s('circle', { cx: 0, cy: -170, r: 20, fill: '#8B5A3C' }, g);
    o.body = s('path', { d: 'M0 -150 V-70 M0 -70 L-22 0 M0 -70 L22 0 M0 -138 L-30 -100', fill: 'none', stroke: '#8B5A3C', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    o.arm = s('path', { d: 'M0 -138 L44 -126', fill: 'none', stroke: '#8B5A3C', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    s('path', { d: 'M-12 -150 h24 l6 70 h-36z', fill: 'var(--blue)', opacity: 0.85 }, g);
    o.shoes = s('path', { d: 'M-34 2 h22 v8 h-22z M12 2 h22 v8 h-22z', fill: '#2B2B2B' }, g);
    o.bolt = s('path', { d: 'M40 -150 l-14 22 h12 l-16 26', fill: 'none', stroke: '#FFE29A', 'stroke-width': 4, opacity: 0 }, g);
    o.reach = function (dx, dy) { o.arm.setAttribute('d', 'M0 -138 L' + dx + ' ' + dy); };
    return o;
  }
  function washer(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    o.box = s('rect', { x: -70, y: -150, width: 140, height: 150, rx: 12, fill: '#D9DEE5', stroke: '#8D96A3', 'stroke-width': 3 }, g);
    s('rect', { x: -60, y: -140, width: 120, height: 24, rx: 5, fill: '#BAC2CD' }, g);
    s('circle', { cy: -58, r: 40, fill: '#7E8B9B', stroke: '#5A6676', 'stroke-width': 4 }, g);
    s('circle', { cy: -58, r: 28, fill: '#A9C9EA', opacity: 0.8 }, g);
    o.fault = s('g', { opacity: 0 }, g);
    s('path', { d: 'M48 -110 l-12 18 h10 l-14 22', fill: 'none', stroke: '#FF4040', 'stroke-width': 4 }, o.fault);
    s('text', { x: 0, y: 24, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: 'var(--red)', text: 'défaut : la phase touche la carcasse' }, o.fault);
    return o;
  }
  function panel(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('rect', { x: 0, y: 0, width: 150, height: 120, rx: 10, fill: 'var(--scene2)', stroke: 'var(--scene-text)', 'stroke-width': 2 }, g);
    s('text', { x: 75, y: 18, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 800, fill: 'var(--scene-muted)', 'letter-spacing': '0.06em', text: 'TABLEAU' }, g);
    o.dd = s('g', {}, g); s('rect', { x: 12, y: 28, width: 60, height: 80, rx: 6, fill: '#ECEFF3', stroke: '#8D96A3' }, o.dd);
    o.ddLev = s('rect', { x: 34, y: 40, width: 16, height: 22, rx: 3, fill: '#1F6FB5' }, o.dd);
    s('text', { x: 42, y: 84, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 800, fill: '#142033', text: 'différentiel' }, o.dd); s('text', { x: 42, y: 98, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 800, fill: '#142033', text: '30 mA' }, o.dd);
    o.fu = s('g', {}, g); s('rect', { x: 84, y: 28, width: 54, height: 80, rx: 6, fill: '#ECEFF3', stroke: '#8D96A3' }, o.fu);
    o.fuWire = s('path', { d: 'M111 40 V96', stroke: '#C68B4E', 'stroke-width': 3 }, o.fu);
    s('text', { x: 111, y: 104, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 800, fill: '#142033', text: 'fusible 16 A' }, o.fu);
    o.set = function (dd, trip, fuse, blown) { o.dd.style.display = dd ? '' : 'none'; o.ddLev.setAttribute('y', trip ? 62 : 40); o.ddLev.style.fill = trip ? '#C0392B' : '#1F6FB5'; o.fu.style.display = fuse ? '' : 'none'; o.fuWire.setAttribute('d', blown ? 'M111 40 V60 M111 78 V96' : 'M111 40 V96'); o.fuWire.style.stroke = blown ? '#555' : '#C68B4E'; };
    return o;
  }
  function gauge(G, x, y) {
    var g = s('g', { transform: 'translate(' + x + ' ' + y + ')' }, G), o = { g: g };
    s('text', { x: 0, y: 0, 'font-size': 13, 'font-weight': 800, fill: 'var(--scene-muted)', text: 'COURANT DANS LE CORPS' }, g);
    var cols = ['#3DD68C', '#9BE15D', '#FFB547', '#FF7A3D', '#FF3B3B'];
    [0, 1, 2, 3, 4].forEach(function (i) { s('rect', { x: i * 54, y: 10, width: 52, height: 16, rx: 4, fill: cols[i], opacity: 0.85 }, g); });
    ['1', '10', '30', '75 mA'].forEach(function (t, i) { s('text', { x: 52 + i * 54, y: 42, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--scene-muted)', text: t }, g); });
    o.cur = s('path', { d: 'M0 4 l-7 -10 h14z', fill: 'var(--scene-text)' }, g);
    o.val = s('text', { x: 0, y: 66, 'font-size': 20, 'font-weight': 800, fill: 'var(--scene-text)' }, g);
    o.txt = s('text', { x: 0, y: 88, 'font-size': 14, 'font-weight': 700 }, g);
    o.set = function (mA) { var L = level(mA), p = mA <= 0 ? 0 : clamp((Math.log10(Math.max(mA, 0.1)) + 1) / 3.2, 0, 1) * 270; o.cur.setAttribute('transform', 'translate(' + p + ' 6)'); o.val.textContent = mA < 0.05 ? '0 mA' : fmt(mA, mA < 10 ? 1 : 0) + ' mA'; o.txt.textContent = mA < 0.05 ? 'aucun courant' : L.t; o.txt.style.fill = L.c; };
    return o;
  }

  /* ---------- modèle électrique simplifié ---------- */
  function solve(st) {
    // R du corps + contact au sol ; carcasse au potentiel 220 V si défaut et pas de terre
    var Rp = st.floor === 'wet' ? 1000 : st.floor === 'shoes' ? 50000 : 2000, r = { body: 0, leak: 0, tripDD: false, blow: false, fire: false, casingV: 0, msg: '' };
    var live = !(st.trip || st.blown);
    if (!live) { r.msg = 'L’installation est coupée.'; return r; }
    if (st.touch === 'phase') { r.body = U / Rp * 1000; }
    else if (st.touch === 'pn') { r.body = U / 1000 * 1000; }
    else if (st.touch === 'case' && st.fault) { r.casingV = st.earth ? 12 : U; r.body = r.casingV / Rp * 1000; }
    if (st.fault && st.earth) r.leak = U / 12 * 1000;   // courant de fuite vers la terre (en mA)
    var leakTot = r.leak + (st.touch === 'pn' ? 0 : r.body);
    if (st.dd && leakTot >= 30) r.tripDD = true;
    if (st.fuse && (st.short || r.leak > 16000)) r.blow = true;
    if (st.short && !st.fuse) r.fire = true;
    return r;
  }

  /* ================== SCÈNE COMMUNE (simulation, défi) ================== */
  function Lab(G, o) {
    var st = Object.assign({ fault: true, earth: false, dd: false, fuse: true, floor: 'wet', touch: 'case', short: false, trip: false, blown: false, tester: 'none' }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: 'var(--scene)' }, G);
    s('rect', { x: 0, y: 400, width: 860, height: 70, fill: 'var(--scene2)' }, G);
    var wet = s('ellipse', { cx: 600, cy: 420, rx: 110, ry: 14, fill: 'var(--blue)', opacity: 0 }, G);
    var pnl = panel(G, 30, 30), so = socket(G, 330, 210), wa = washer(G, 470, 400), pe = person(G); pe.g.setAttribute('transform', 'translate(600 400)');
    var wires = s('path', { d: 'M180 70 H312 V200 M180 90 H348 V200 M180 110 H330 V160', fill: 'none', stroke: 'var(--scene-muted)', 'stroke-width': 3 }, G);
    var cord = s('path', { d: 'M390 210 C420 210 410 300 430 300', fill: 'none', stroke: '#3A3A3A', 'stroke-width': 6 }, G);
    var earthW = s('path', { d: 'M470 340 V440 H120 V470', fill: 'none', stroke: '#17894F', 'stroke-width': 3, 'stroke-dasharray': '8 5' }, G);
    var earthT = s('text', { x: 130, y: 432, 'font-size': 12, 'font-weight': 800, fill: '#17894F', text: 'fil de terre ⏚' }, G);
    var flow = s('path', { fill: 'none', stroke: '#FFE29A', 'stroke-width': 5, 'stroke-dasharray': '6 14', 'stroke-linecap': 'round', opacity: 0 }, G);
    var flowE = s('path', { d: 'M470 300 V440 H120', fill: 'none', stroke: '#7CFFB0', 'stroke-width': 5, 'stroke-dasharray': '6 14', opacity: 0 }, G);
    var fire = s('g', { opacity: 0 }, G); [0, 1, 2].forEach(function (i) { s('path', { d: 'M' + (380 + i * 18) + ' 220 c-10 -14 -2 -30 8 -40 c2 14 12 20 6 40z', fill: i === 1 ? '#FFB547' : '#FF5A2A' }, fire); });
    var shortW = s('path', { d: 'M312 214 C320 250 340 250 348 214', fill: 'none', stroke: '#C68B4E', 'stroke-width': 4, opacity: 0 }, G);
    var sd = screwdriver(G);
    var gg = gauge(G, 560, 40);
    var stT = s('text', { x: 560, y: 160, 'font-size': 15, 'font-weight': 800, fill: 'var(--scene-text)' }, G);
    var res = {};
    function step(dt, T) {
      var r = solve(st); res = r;
      if (r.tripDD && !st.trip) { st.trip = true; o.onEvent && o.onEvent('trip'); }
      if (r.blow && !st.blown) { st.blown = true; o.onEvent && o.onEvent('blow'); }
      pnl.set(st.dd, st.trip, st.fuse, st.blown);
      wa.fault.setAttribute('opacity', st.fault ? 1 : 0);
      earthW.style.display = st.earth ? '' : 'none'; earthT.style.display = st.earth ? '' : 'none';
      wet.setAttribute('opacity', st.floor === 'wet' ? 0.35 : 0); pe.shoes.style.display = st.floor === 'shoes' ? '' : 'none';
      var touchCase = st.touch === 'case', tp = st.touch === 'phase' || st.touch === 'pn';
      pe.g.setAttribute('transform', 'translate(' + (tp ? 410 : 600) + ' 400)');
      pe.reach(tp ? -62 : -56, tp ? -188 : -150);
      var dang = r.body >= 10 && !(st.trip || st.blown);
      pe.aura.setAttribute('opacity', dang ? 0.25 + 0.15 * Math.sin(T * 20) : 0); pe.bolt.setAttribute('opacity', dang ? 1 : 0);
      var path = '';
      if (r.body > 0.05) path = tp ? 'M180 70 H312 V210 L ' + (410 - 62) + ' ' + (400 - 188) + ' L410 300 L410 400' : 'M180 70 H312 V200 M390 210 C420 210 410 300 430 300 L' + (600 - 56) + ' ' + (400 - 150) + ' L600 330 L600 400';
      flow.setAttribute('d', path); flow.setAttribute('opacity', path ? 0.95 : 0); flow.setAttribute('stroke-dashoffset', -T * 80);
      flowE.setAttribute('opacity', r.leak > 0 ? 0.9 : 0); flowE.setAttribute('stroke-dashoffset', -T * 80);
      shortW.setAttribute('opacity', st.short ? 1 : 0); fire.setAttribute('opacity', r.fire ? 0.9 + 0.1 * Math.sin(T * 14) : 0);
      sd.g.style.display = st.tester === 'none' ? 'none' : '';
      var tx = st.tester === 'P' ? 312 : st.tester === 'N' ? 348 : 330, ty = st.tester === 'T' ? 172 : 214;
      sd.g.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') rotate(-14)');
      sd.set(st.tester === 'P' && !(st.trip || st.blown));
      gg.set(r.body);
      stT.textContent = st.trip ? 'Le différentiel a coupé le courant (fuite ≥ 30 mA)' : st.blown ? 'Le fusible a fondu : courant coupé' : r.fire ? 'Court-circuit sans fusible : les fils chauffent, risque d’incendie !' : r.leak > 0 ? 'Le courant de fuite part par la terre' : '';
      stT.style.fill = st.trip || st.blown ? 'var(--green)' : r.fire ? 'var(--red)' : 'var(--scene-text)';
      if (S.settings.proj) flow.setAttribute('stroke-width', 7);
    }
    return { st: st, step: step, res: function () { return res; }, solve: solve };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'La prise de courant' }, { t: 14, title: 'L’électrocution' }, { t: 30, title: 'Se protéger' }, { t: 47, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(20 40)' }, G);
    var lab = Lab(g, { fault: false, earth: false, dd: false, fuse: true, touch: 'none', floor: 'dry', tester: 'none' }), st = lab.st;
    var g4 = s('g', {}, G), cards = K.cards(g4, [
      ['La <b>phase</b> est dangereuse : 220 V', 'toucher la phase en étant relié au sol fait passer un courant dans le corps.', 'var(--red)'],
      ['<b>Prise de terre</b> + <b>disjoncteur différentiel 30 mA</b>', 'ils protègent les personnes ; le fusible protège l’installation.', 'var(--green)'],
      ['Jamais les mains <b>mouillées</b>, jamais d’objet dans la prise', 'on coupe le courant avant de réparer ; on ne surcharge pas les multiprises.', 'var(--amber)']], [47.2, 52.2, 57.2]);
    var lastT = 0;
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 47.2)) {
        // scénario en fonction du temps
        st.trip = false; st.blown = false; st.short = false;
        if (t < 14) { st.fault = false; st.touch = 'none'; st.tester = t < 4 ? 'none' : t < 7 ? 'N' : t < 10.5 ? 'P' : 'T'; st.earth = false; st.dd = false; }
        else if (t < 30) { st.tester = 'none'; st.fault = t >= 22; st.touch = t < 22 ? (t > 15.5 ? 'phase' : 'none') : 'case'; st.floor = t < 22 ? 'wet' : (t < 26 ? 'shoes' : 'wet'); st.earth = false; st.dd = false; }
        else { st.fault = true; st.touch = t < 42 ? 'case' : 'none'; st.floor = 'wet'; st.earth = t >= 33 && t < 38; st.dd = t >= 38; st.trip = t >= 39.4 && t < 42; st.short = t >= 42.5; st.fuse = true; st.blown = t >= 44; if (t >= 42) { st.fault = false; st.dd = false; st.trip = false; } }
        lab.step(t - lastT, t);
        tg.show(t, 4.4, 6.8, 560, 62, 'Neutre : le voyant reste éteint') || tg.show(t, 7.2, 10.4, 560, 62, 'Phase : le voyant s’allume !') || tg.show(t, 10.8, 13.8, 560, 62, 'Terre : borne de sécurité') ||
          tg.show(t, 16, 21.6, 560, 62, 'Pieds nus sur sol mouillé : 220 mA, mortel') || tg.show(t, 22.4, 25.8, 560, 62, 'Avec des chaussures isolantes : 4 mA') || tg.show(t, 26.2, 29.8, 560, 62, 'Défaut + pieds mouillés : danger') ||
          tg.show(t, 33.2, 37.8, 560, 62, 'La terre emporte le courant de fuite') || tg.show(t, 38.2, 41.8, 560, 62, 'Le différentiel coupe en moins de 30 ms') || tg.show(t, 42.6, 46.8, 560, 62, 'Court-circuit : le fusible fond');
      }
      lastT = t;
      K.group(g4, t, 46.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : une prise avec phase, neutre et terre testée au tournevis testeur, une personne qui touche la phase, une machine à laver en défaut, la prise de terre, le disjoncteur différentiel et le fusible',
    duration: 62, chapters: CH,
    segs: [
      { t: 0, d: 4, say: 'Une prise de courant a trois bornes : la phase, le neutre et la terre.', sub: 'Une prise a 3 bornes : <b>phase</b>, <b>neutre</b> et <b>terre</b>.' },
      { t: 4.2, d: 6.2, say: 'Avec un tournevis testeur, le voyant reste éteint sur le neutre… et s’allume sur la phase : c’est elle qui est dangereuse.', sub: 'Le tournevis testeur s’allume sur la <b>phase</b> : c’est la borne <b>dangereuse</b>.' },
      { t: 10.6, d: 3.4, say: 'La terre est une borne de sécurité.', sub: 'La <b>terre</b> est une borne de <b>sécurité</b>.' },
      { t: 14, d: 7.6, say: 'Si une personne touche la phase, pieds nus sur un sol mouillé, un courant traverse son corps jusqu’au sol : environ deux cent vingt milliampères. C’est mortel.', sub: 'Toucher la phase pieds nus : <b>220 mA</b> traversent le corps. <b>Mortel</b>.' },
      { t: 22, d: 4, say: 'Avec des chaussures isolantes, le courant est beaucoup plus faible.', sub: 'Avec des <b>chaussures isolantes</b>, le courant est bien plus faible.' },
      { t: 26, d: 4, say: 'Attention aux appareils en défaut : leur carcasse peut être sous tension.', sub: 'Un appareil en <b>défaut</b> : sa carcasse peut être <b>sous tension</b>.' },
      { t: 30, d: 7.8, say: 'Pour se protéger, on relie la carcasse métallique à la terre : le courant de fuite part dans la terre plutôt que dans le corps.', sub: 'La <b>prise de terre</b> évacue le courant de fuite.' },
      { t: 38, d: 4.2, say: 'Le disjoncteur différentiel coupe le courant dès qu’une fuite dépasse trente milliampères.', sub: 'Le <b>disjoncteur différentiel</b> coupe dès <b>30 mA</b> de fuite.' },
      { t: 42.4, d: 4.4, say: 'En cas de court-circuit, le fusible fond et coupe le courant : il protège l’installation contre l’incendie.', sub: 'Court-circuit : le <b>fusible</b> fond et protège l’installation.' },
      { t: 47, d: 4.8, say: 'À retenir : la phase est dangereuse.', sub: 'La <b>phase</b> est dangereuse.' },
      { t: 52, d: 4.8, say: 'La prise de terre et le disjoncteur différentiel protègent les personnes.', sub: '<b>Terre</b> + <b>différentiel</b> protègent les personnes.' },
      { t: 57, d: 5, say: 'Jamais les mains mouillées, et on coupe le courant avant de réparer.', sub: 'Jamais les <b>mains mouillées</b> ; on <b>coupe le courant</b> avant de réparer.' }
    ],
    learn: [
      { t: 9, ch: 1, html: 'La <b>phase</b> est la borne dangereuse (le testeur s’allume).' },
      { t: 21, ch: 2, html: 'Le danger dépend de l’<b>intensité</b> qui traverse le corps : au-delà de 30 mA, c’est grave.' },
      { t: 36, ch: 3, html: 'La <b>prise de terre</b> évacue le courant de fuite.' },
      { t: 45, ch: 3, html: 'Le <b>différentiel</b> protège les personnes, le <b>fusible</b> protège l’installation.' }
    ],
    question: { q: 'Quel appareil coupe le courant dès qu’une fuite dépasse 30 mA ?', o: ['Le fusible', 'Le disjoncteur différentiel', 'Le tournevis testeur', 'La prise de terre'], a: 1, e: 'Le disjoncteur différentiel 30 mA protège les personnes contre l’électrocution.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Une installation avec tableau électrique, prise de courant, machine à laver, fil de terre et une personne ; jauge du courant dans le corps',
    steps: [
      'Teste les bornes de la prise avec le tournevis testeur : laquelle est la phase ?',
      'La machine à laver a un défaut. Sans terre ni différentiel, la personne touche la carcasse : regarde la jauge selon le sol (mouillé, sec, chaussures).',
      'Ajoute la prise de terre, puis le disjoncteur différentiel : la personne est-elle protégée ?',
      'Provoque un court-circuit avec et sans fusible. Relève chaque situation dans l’onglet Mesures.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onEvent: function (e) { api.sound(e === 'trip' || e === 'blow' ? 'pop' : 'tick'); api.say(e === 'trip' ? 'Clac ! Le disjoncteur différentiel a coupé : la fuite dépassait 30 mA.' : 'Le fusible a fondu : le courant est coupé.', 'ok'); } }), st = lab.st, c = api.c, rows = [];
      c.seg({ label: 'Tournevis testeur sur…', value: 'none', options: [{ v: 'none', l: 'rangé' }, { v: 'P', l: 'borne gauche' }, { v: 'N', l: 'borne droite' }, { v: 'T', l: 'broche du haut' }], onChange: function (v) { st.tester = v; } });
      var cT = c.seg({ label: 'La personne touche…', value: 'case', options: [{ v: 'none', l: 'rien' }, { v: 'case', l: 'la carcasse' }, { v: 'phase', l: 'la phase' }, { v: 'pn', l: 'phase et neutre' }], onChange: function (v) { st.touch = v; } });
      var cF = c.seg({ label: 'Sol', value: 'wet', options: [{ v: 'wet', l: 'pieds nus, sol mouillé' }, { v: 'dry', l: 'pieds nus, sol sec' }, { v: 'shoes', l: 'chaussures isolantes' }], onChange: function (v) { st.floor = v; } });
      var tD = c.toggle({ label: 'Défaut dans la machine', value: true, onChange: function (v) { st.fault = v; } });
      var tE = c.toggle({ label: 'Carcasse reliée à la terre', value: false, onChange: function (v) { st.earth = v; } });
      var tDD = c.toggle({ label: 'Disjoncteur différentiel 30 mA', value: false, onChange: function (v) { st.dd = v; if (!v) st.trip = false; } });
      var tFu = c.toggle({ label: 'Fusible', value: true, onChange: function (v) { st.fuse = v; if (!v) st.blown = false; } });
      var row = c.row();
      c.button({ label: 'Court-circuit !', sm: true, into: row, onClick: function () { st.short = !st.short; } });
      c.button({ label: 'Réarmer le tableau', sm: true, into: row, onClick: function () { st.trip = false; st.blown = false; st.short = false; api.say('Tableau réarmé.'); } });
      var ro = api.readouts([{ k: 'b', label: 'Courant dans le corps' }, { k: 'l', label: 'Fuite vers la terre' }, { k: 'd', label: 'Danger' }, { k: 'p', label: 'Protection' }]);
      api.loop(function (dt, T) {
        lab.step(dt, T); var r = lab.res(), L = level(r.body);
        ro.b.set(r.body < 0.05 ? '0 mA' : fmt(r.body, r.body < 10 ? 1 : 0) + ' mA'); ro.l.set(r.leak > 0 ? fmt(r.leak / 1000, 1) + ' A' : '0');
        ro.d.set(r.body < 0.05 ? 'aucun' : L.i <= 1 ? 'faible' : L.i === 2 ? 'grave' : 'mortel'); ro.p.set(st.trip ? 'différentiel' : st.blown ? 'fusible' : '—');
      });
      var M = api.measure; M.innerHTML = '<h3>Mes situations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cette situation'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { var r = lab.res(); rows.push({ t: { none: 'rien', 'case': 'carcasse', phase: 'phase', pn: 'phase+neutre' }[st.touch], sol: { wet: 'mouillé', dry: 'sec', shoes: 'chaussures' }[st.floor], f: st.fault, e: st.earth, dd: st.dd, mA: r.body, cut: st.trip ? 'différentiel' : st.blown ? 'fusible' : 'non' }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Contact</th><th>Sol</th><th>Défaut</th><th>Terre</th><th>Diff.</th><th>I corps</th><th>Coupé ?</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.t + '</td><td>' + r.sol + '</td><td>' + (r.f ? 'oui' : 'non') + '</td><td>' + (r.e ? 'oui' : 'non') + '</td><td>' + (r.dd ? 'oui' : 'non') + '</td><td>' + fmt(r.mA, 0) + ' mA</td><td>' + r.cut + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune situation relevée.</div>';
        api.chart.innerHTML = '<h3>Effets du courant sur le corps</h3><ul>' + LEVELS.map(function (L, i) { return '<li><b style="color:' + L[2] + '">' + (i ? '≥ ' + LEVELS[i - 1][0] + ' mA' : '< 1 mA') + '</b> : ' + L[1] + '</li>'; }).join('') + '</ul><p style="font-size:12px;color:var(--muted);margin-top:6px">Valeurs indicatives : la résistance du corps est d’environ 2 000 Ω, beaucoup moins avec la peau mouillée.</p>';
      }
      paint();
      api.onReset(function () { Object.assign(st, { fault: true, earth: false, dd: false, fuse: true, floor: 'wet', touch: 'case', short: false, trip: false, blown: false, tester: 'none' }); cT.set('case'); cF.set('wet'); tD.set(true); tE.set(false); tDD.set(false); tFu.set(true); rows = []; paint(); });
      api.say('Simulation : aucune vraie électricité ici ! Commence par tester la prise avec le tournevis testeur.');
      return { bilan: function () {
        if (rows.length < 2) return '<p>Relève au moins 2 situations différentes.</p>';
        var h = '<p>Le danger dépend de l’<b>intensité</b> du courant qui traverse le corps : elle est bien plus grande avec la peau mouillée (I = U ÷ R).</p>';
        if (rows.some(function (r) { return r.e; })) h += '<p>Avec la <b>terre</b>, le courant de fuite passe par le fil de terre et non par la personne.</p>';
        if (rows.some(function (r) { return r.cut === 'différentiel'; })) h += '<p>Le <b>différentiel 30 mA</b> a coupé le courant : il protège les personnes.</p>';
        if (rows.some(function (r) { return r.cut === 'fusible'; })) h += '<p>Le <b>fusible</b> a fondu lors du court-circuit : il protège l’installation.</p>';
        return h;
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Installation électrique et personne' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); api.loop(function (dt, T) { lab.step(dt, T); }); return lab; }
  var DEFI = {
    title: 'Le défi de l’électricien',
    intro: 'Trouve la phase, protège la famille et sauve l’installation : chaque seconde compte !',
    missions: [
      { title: 'Où est la phase ?', text: 'Utilise le tournevis testeur pour trouver la <span style="color:var(--amber)">phase</span>, puis valide quand le voyant est allumé.', lumi: 'Pose le testeur sur chaque borne : seule la phase allume le voyant.', hint: 'Essaie les deux trous de la prise.',
        build: function (api) { var lab = mini(api, { fault: false, touch: 'none', tester: 'none', floor: 'shoes' }); api.c.seg({ label: 'Testeur sur…', value: 'none', options: [{ v: 'N', l: 'borne droite' }, { v: 'T', l: 'broche du haut' }, { v: 'P', l: 'borne gauche' }], onChange: function (v) { lab.st.tester = v; } }); return function () { return lab.st.tester === 'P' ? { ok: true, msg: 'Le voyant s’allume : c’est la phase.' } : { ok: false, msg: 'Le voyant reste éteint : ce n’est pas la phase.' }; }; },
        e: 'Le tournevis testeur s’allume uniquement sur la phase.' },
      { title: 'Protège la famille', text: 'La machine a un défaut et l’enfant va la toucher, pieds nus et mouillés. Rends la situation <span style="color:var(--amber)">sans danger</span> sans débrancher la machine.', lumi: 'Deux protections sauvent les personnes…', hint: 'Relie la carcasse à la terre ET installe le disjoncteur différentiel.',
        build: function (api) { var lab = mini(api, { fault: true, touch: 'case', floor: 'wet', earth: false, dd: false }); api.c.toggle({ label: 'Carcasse reliée à la terre', value: false, onChange: function (v) { lab.st.earth = v; } }); api.c.toggle({ label: 'Disjoncteur différentiel 30 mA', value: false, onChange: function (v) { lab.st.dd = v; if (!v) lab.st.trip = false; } }); return function () { var ok = lab.st.earth && lab.st.dd; return ok ? { ok: true, msg: 'La terre évacue la fuite et le différentiel coupe aussitôt.' } : { ok: false, msg: lab.st.earth || lab.st.dd ? 'C’est mieux, mais il manque une protection.' : 'L’enfant est en danger !' }; }; },
        e: 'Prise de terre + disjoncteur différentiel 30 mA protègent les personnes.' },
      { type: 'qcm', title: 'Calcul de danger', text: 'La tension est de 220 V et la résistance du corps mouillé de 1 000 Ω. Quelle intensité traverse le corps ?', o: ['0,22 mA', '22 mA', '220 mA', '2,2 A'], a: 2, hint: 'I = U ÷ R, puis convertis en milliampères.', e: 'I = 220 ÷ 1 000 = 0,22 A = 220 mA : c’est mortel.' },
      { type: 'qcm', title: 'Le rôle du fusible', text: 'À quoi sert surtout le fusible ?', o: ['À protéger les personnes', 'À protéger l’installation contre les surintensités', 'À indiquer la phase', 'À relier la carcasse à la terre'], a: 1, hint: 'Il fond quand l’intensité est trop grande…', e: 'Le fusible protège les fils contre l’échauffement (court-circuit, surcharge) : il évite l’incendie.' },
      { type: 'qcm', title: 'Le bon geste', text: 'Pour changer une ampoule, que faut-il faire d’abord ?', o: ['Mettre des gants mouillés', 'Couper le courant au disjoncteur', 'Toucher la phase pour vérifier', 'Rien, une ampoule est sans danger'], a: 1, hint: 'Avant toute intervention…', e: 'On coupe toujours le courant avant d’intervenir sur une installation.' }
    ]
  };

  S.start({
    id: '4e-dangers-secteur', level: '4e', theme: 'Courants et tensions alternatifs', title: 'Dangers du courant du secteur', back: '../4e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Une prise de courant possède trois bornes : la <b>phase</b>, le <b>neutre</b> et la <b>terre</b>. La phase est à environ 220 V par rapport à la terre : c’est elle qui est <b>dangereuse</b>. Le tournevis testeur s’allume sur la phase.',
      'Si l’on touche la phase en étant relié au sol (ou la phase et le neutre), un courant traverse le corps : c’est l’<b>électrisation</b>, et l’<b>électrocution</b> si elle est mortelle. Le danger augmente avec l’<b>intensité</b> : au-delà de 30 mA, c’est grave.',
      'La <b>prise de terre</b> relie les carcasses métalliques au sol : en cas de défaut, le courant de fuite passe par la terre.',
      'Le <b>disjoncteur différentiel 30 mA</b> coupe le courant dès qu’une fuite apparaît : il protège les <b>personnes</b>. Le <b>fusible</b> ou le disjoncteur protège l’<b>installation</b> contre les surintensités (court-circuit, surcharge).',
      'Règles : ne jamais toucher un appareil électrique les mains mouillées, ne rien introduire dans une prise, couper le courant avant toute réparation, ne pas surcharger les multiprises.'
    ],
    quiz: [
      { q: 'Quelle borne d’une prise est dangereuse ?', o: ['Le neutre', 'La terre', 'La phase', 'Aucune'], a: 2, e: 'La phase est à environ 220 V par rapport à la terre.' },
      { q: 'Le tournevis testeur s’allume sur :', o: ['la phase', 'le neutre', 'la terre', 'les trois bornes'], a: 0, e: 'Il signale la phase.' },
      { q: 'À partir de quelle intensité dans le corps le danger devient-il grave ?', o: ['0,1 mA', '1 mA', 'environ 30 mA', '10 A'], a: 2, e: 'Au-delà d’environ 30 mA : risque de paralysie respiratoire.' },
      { q: 'Pourquoi relie-t-on la carcasse d’une machine à laver à la terre ?', o: ['Pour qu’elle consomme moins', 'Pour que le courant de fuite passe par la terre', 'Pour la refroidir', 'Pour éviter les courts-circuits'], a: 1, e: 'En cas de défaut, la fuite part par la terre, pas par la personne.' },
      { q: 'Quel appareil protège les personnes contre l’électrocution ?', o: ['Le fusible', 'Le disjoncteur différentiel 30 mA', 'La multiprise', 'L’ampoule'], a: 1, e: 'Il coupe dès qu’une fuite de 30 mA apparaît.' }
    ]
  });
})();
