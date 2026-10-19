/* 6e · Électricité · Leçon : Court-circuit et protection des installations électriques */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var BG = '#0F1729', U = 4.5, R = 15, UN = 3, IMAX = 1;
  function solve(st) {
    var cut = !st.closed || st.blown || st.tripped;
    if (cut) return { I: 0, V1: 0, V2: 0 };
    if (st.sc === 'G') return { I: 6, V1: 0, V2: 0 }; /* valeur d’illustration : en réalité elle dépend de la résistance interne du générateur */
    if (st.sc === 'L1') return { I: U / R, V1: 0, V2: U };
    return { I: U / (2 * R), V1: U / 2, V2: U / 2 };
  }
  function bright(V) { return V <= 0.2 ? 0 : Math.min(1.5, Math.pow(V / UN, 1.5)); }
  function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }

  function Lab(G, o) {
    var st = Object.assign({ sc: 'none', prot: 'none', closed: true, heat: 0, blown: false, tripped: false, t: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 40, width: 500, height: 406, rx: 22, fill: BG, stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var hotW = s('path', { d: 'M333 380 H470 V120 H100 V380 H237', fill: 'none', stroke: '#FF5A2E', 'stroke-width': 10, opacity: 0, 'stroke-linejoin': 'round' }, G);
    var W = E.wire(G, 'M333 380 H470 V120 H100 V380 H237');
    s('rect', { x: 140, y: 372, width: 80, height: 30, fill: BG }, G); var Ks = E.switchK(G, 150, 380, 210, { label: 'K', onToggle: function (c) { st.closed = c; } });
    var L1 = E.lamp(G, 200, 120, { r: 22 }), L2 = E.lamp(G, 370, 120, { r: 22 });
    s('text', { x: 200, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L1' }, G); s('text', { x: 370, y: 172, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#FFC773', text: 'L2' }, G);
    var bat = E.battery(G, 285, 380, { U: U }), batHot = s('rect', { x: 237, y: 357, width: 96, height: 46, rx: 7, fill: '#FF5A2E', opacity: 0 }, G);
    /* protection sur le fil de droite */
    var PR = s('g', {}, G); s('rect', { x: 456, y: 210, width: 28, height: 80, fill: BG }, PR);
    var fuse = s('g', {}, PR); s('rect', { x: 459, y: 212, width: 22, height: 76, rx: 6, fill: '#BFE6FF', 'fill-opacity': 0.15, stroke: '#BFE6FF', 'stroke-width': 2 }, fuse); s('rect', { x: 457, y: 210, width: 26, height: 10, rx: 2, fill: '#C9D2E3' }, fuse); s('rect', { x: 457, y: 280, width: 26, height: 10, rx: 2, fill: '#C9D2E3' }, fuse);
    var fil = s('path', { fill: 'none', stroke: '#E6D3B8', 'stroke-width': 2 }, fuse), filB = s('circle', { cx: 470, cy: 250, r: 4, fill: '#3A2F28' }, fuse);
    s('text', { x: 494, y: 254, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'fusible' }, fuse);
    var disj = s('g', {}, PR); s('rect', { x: 452, y: 206, width: 36, height: 88, rx: 6, fill: '#EEF2F8' }, disj); var lever = s('rect', { x: 462, width: 16, height: 26, rx: 4, fill: '#3A4560' }, disj); var dl = s('text', { x: 470, y: 288, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 900, fill: '#1A1F28' }, disj);
    s('text', { x: 494, y: 254, 'font-size': 11, 'font-weight': 800, fill: '#A9B4C7', text: 'disjoncteur' }, disj);
    /* fil de court-circuit */
    var scW = s('path', { fill: 'none', stroke: '#FF8A4C', 'stroke-width': 5, 'stroke-linecap': 'round' }, G), scD1 = s('circle', { r: 6, fill: '#FF8A4C' }, G), scD2 = s('circle', { r: 6, fill: '#FF8A4C' }, G);
    var smoke = s('g', {}, G), SM = []; for (var i = 0; i < 12; i++) SM.push(s('circle', { r: 10, fill: '#9AA6BC' }, smoke));
    var spark = s('g', {}, G), SP = []; for (i = 0; i < 10; i++) SP.push(s('circle', { r: 2.2, fill: '#FFE29A' }, spark));
    var msg = s('text', { x: 290, y: 432, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#C9D2E3' }, G);
    /* panneau */
    var PX = 560, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 280, height: 424, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 20, y: 50, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'INTENSITÉ DU COURANT' }, P);
    s('rect', { x: PX + 20, y: 60, width: 240, height: 16, rx: 8, fill: '#1A2540' }, P); var iBar = s('rect', { x: PX + 20, y: 60, height: 16, rx: 8 }, P); var iT = s('text', { x: PX + 260, y: 98, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 900, fill: '#EEF2F8' }, P);
    s('line', { x1: PX + 20 + 240 * IMAX / 6, x2: PX + 20 + 240 * IMAX / 6, y1: 56, y2: 82, stroke: '#FFB547', 'stroke-width': 2, 'stroke-dasharray': '3 3' }, P); s('text', { x: PX + 20 + 240 * IMAX / 6, y: 98, 'text-anchor': 'middle', 'font-size': 10, fill: '#FFB547', text: 'limite 1 A' }, P);
    s('text', { x: PX + 20, y: 134, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'ÉCHAUFFEMENT DES FILS ET DE LA PILE' }, P);
    s('rect', { x: PX + 20, y: 144, width: 240, height: 16, rx: 8, fill: '#1A2540' }, P); var hBar = s('rect', { x: PX + 20, y: 144, height: 16, rx: 8 }, P);
    var vb = s('rect', { x: PX + 20, y: 186, width: 240, height: 44, rx: 22 }, P), vt = s('text', { x: PX + 140, y: 214, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#0B1220' }, P);
    var ex = [0, 1, 2, 3, 4].map(function (k) { return s('text', { x: PX + 140, y: 264 + k * 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#C9D2E3' }, P); });
    var last = performance.now(), overT = 0;
    function step() {
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; var T = st.t != null ? st.t : now / 1000;
      var r = solve(st);
      if (st.t == null) {
        if (r.I > IMAX) { overT += dt; if (st.prot === 'fusible' && overT > 0.35) { st.blown = true; o.onCut && o.onCut('fusible'); } if (st.prot === 'disj' && overT > 0.08) { st.tripped = true; o.onCut && o.onCut('disj'); } } else overT = 0;
        r = solve(st);
        st.heat = Math.max(0, Math.min(1, st.heat + dt * (r.I > IMAX ? 0.22 : -0.15)));
      }
      Ks.set(st.closed); bat.set(U);
      L1.set(bright(r.V1)); L2.set(bright(r.V2));
      W.flow(r.I > 3 ? 1.6 : r.I * 4, T);
      hotW.setAttribute('opacity', st.heat * 0.7); batHot.setAttribute('opacity', st.heat * 0.6);
      PR.style.display = st.prot === 'none' ? 'none' : ''; fuse.style.display = st.prot === 'fusible' ? '' : 'none'; disj.style.display = st.prot === 'disj' ? '' : 'none';
      fil.setAttribute('d', st.blown ? 'M470 220 L468 242 M472 258 L470 280' : 'M470 220 Q466 250 470 280'); filB.style.display = st.blown ? '' : 'none';
      attr(lever, { y: st.tripped ? 254 : 218 }); dl.textContent = st.tripped ? 'OFF' : 'ON';
      var a, b; if (st.sc === 'L1') { a = [170, 120]; b = [230, 120]; } else if (st.sc === 'G') { a = [229, 380]; b = [341, 380]; }
      var on = !!a; scW.style.display = scD1.style.display = scD2.style.display = on ? '' : 'none';
      if (on) { var up = -1; scW.setAttribute('d', 'M' + a[0] + ' ' + a[1] + ' C' + a[0] + ' ' + (a[1] + up * 70) + ' ' + b[0] + ' ' + (b[1] + up * 70) + ' ' + b[0] + ' ' + b[1]); attr(scD1, { cx: a[0], cy: a[1] }); attr(scD2, { cx: b[0], cy: b[1] }); }
      SM.forEach(function (c, k) { var ph = (rnd(k, 1) + T * 0.25) % 1; c.style.display = st.heat > 0.55 ? '' : 'none'; attr(c, { cx: 285 + (rnd(k, 2) - 0.5) * 120 + Math.sin(T + k) * 8, cy: 360 - ph * 160, r: 8 + ph * 16, opacity: (1 - ph) * 0.45 * (st.heat - 0.5) * 2 }); });
      SP.forEach(function (c, k) { var ph = (rnd(k, 3) + T * 2) % 1, show = r.I > IMAX && st.sc === 'G'; c.style.display = show ? '' : 'none'; var aa = rnd(k, 4) * 6.28; attr(c, { cx: 341 + Math.cos(aa) * ph * 30, cy: 380 + Math.sin(aa) * ph * 30 - ph * 10, opacity: 1 - ph }); });
      var danger = r.I > IMAX;
      attr(iBar, { width: 240 * Math.min(1, r.I / 6) }); iBar.setAttribute('fill', danger ? '#FF5A4E' : '#3DD68C'); iT.textContent = r.I > 3 ? 'très grande !' : fmt(r.I, 2) + ' A';
      attr(hBar, { width: 240 * st.heat }); hBar.setAttribute('fill', st.heat > 0.55 ? '#FF5A4E' : st.heat > 0.2 ? '#FFB547' : '#3DD68C');
      var cut = st.blown || st.tripped, kk = cut ? 'cut' : danger ? 'danger' : st.sc === 'L1' ? 'warn' : 'ok';
      vb.setAttribute('fill', { cut: '#4FC3FF', danger: '#FF5A4E', warn: '#FFB547', ok: '#3DD68C' }[kk]);
      vt.textContent = { cut: st.blown ? 'FUSIBLE FONDU : CIRCUIT COUPÉ' : 'DISJONCTEUR DÉCLENCHÉ', danger: 'DANGER : COURT-CIRCUIT !', warn: 'L1 COURT-CIRCUITÉE', ok: !st.closed ? 'CIRCUIT OUVERT' : 'FONCTIONNEMENT NORMAL' }[kk];
      vt.setAttribute('font-size', vt.textContent.length > 24 ? 12.5 : 15);
      var EX = { cut: [st.blown ? 'Le fil du fusible a fondu :' : 'Le disjoncteur a coupé le courant :', 'l’installation est protégée.', st.blown ? 'Il faut supprimer la cause' : 'Supprime la cause du court-circuit,', st.blown ? 'puis changer le fusible.' : 'puis réarme le disjoncteur.', ''], danger: ['Le courant passe par le fil', 'sans traverser les lampes.', 'Intensité très grande : les fils', 'et la pile chauffent.', 'Risque d’incendie !'], warn: ['Le courant passe par le fil', 'plutôt que par L1 : L1 s’éteint.', 'L2 reçoit plus de tension :', 'elle brille plus fort.', ''], ok: ['Les deux lampes sont en série', 'et brillent normalement.', '', '', ''] }[kk];
      ex.forEach(function (e, i) { e.textContent = EX[i]; }); ex[4].setAttribute('fill', '#FF8A80');
      msg.textContent = kk === 'danger' ? (st.heat > 0.55 ? 'Ça chauffe ! Les isolants fondent…' : 'Court-circuit du générateur !') : kk === 'cut' ? 'Plus de courant : les lampes sont éteintes' : kk === 'warn' ? 'L1 éteinte, L2 brille plus fort' : st.closed ? 'Les lampes brillent' : 'Ferme l’interrupteur K';
      return { r: r, kk: kk, heat: st.heat, blown: st.blown, tripped: st.tripped, sc: st.sc, prot: st.prot };
    }
    return { st: st, step: step };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Un circuit normal' }, { t: 9, title: 'Une lampe court-circuitée' }, { t: 21, title: 'Le générateur court-circuité' }, { t: 35, title: 'Le fusible' }, { t: 46, title: 'Le disjoncteur' }, { t: 58, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, {}), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['Un <b>court-circuit</b> : un fil relie les bornes d’un dipôle', 'le courant passe par le fil et « contourne » le dipôle.', '#FFB547'],
      ['Court-circuit du <b>générateur</b> : <b>danger</b>', 'intensité très grande, échauffement, risque d’incendie.', '#FF5A4E'],
      ['On se protège : <b>fusible</b> et <b>disjoncteur</b>', 'ils coupent le courant en cas de court-circuit.', '#4FC3FF']], [58.2, 62.6, 67]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 58.2)) {
        st.t = t; st.closed = true;
        if (t < 9) { st.sc = 'none'; st.prot = 'none'; st.heat = 0; st.blown = st.tripped = false; }
        else if (t < 21) { st.sc = t > 11 ? 'L1' : 'none'; st.prot = 'none'; st.heat = 0; }
        else if (t < 35) { st.sc = t > 23 ? 'G' : 'none'; st.prot = 'none'; st.heat = t > 23 ? K.k(t, 23.5, 9) : 0; }
        else if (t < 46) { st.prot = 'fusible'; st.sc = t > 37 ? 'G' : 'none'; st.blown = t > 38; st.tripped = false; st.heat = 0; }
        else { st.prot = 'disj'; st.blown = false; st.sc = t > 48 && t < 53 ? 'G' : 'none'; st.tripped = t > 48.6 && t < 54.5; st.heat = 0; }
        lab.step();
        tg.show(t, 1, 8.6, 290, 92, 'Deux lampes en série : elles brillent') || tg.show(t, 11.4, 20.6, 290, 92, 'Un fil aux bornes de L1 : elle s’éteint') || tg.show(t, 23.4, 34.6, 290, 92, 'Un fil aux bornes de la pile : danger !') ||
          tg.show(t, 37.4, 45.6, 290, 92, 'Le fil du fusible fond : courant coupé') || tg.show(t, 48.6, 54.2, 290, 92, 'Le disjoncteur se déclenche') || tg.show(t, 54.6, 57.6, 290, 92, 'Cause supprimée : on réarme');
      }
      bg.setAttribute('opacity', t > 57.8 ? 1 : 0);
      K.group(g5, t, 57.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : deux lampes en série brillent ; un fil posé aux bornes de L1 l’éteint et fait briller L2 plus fort ; un fil aux bornes de la pile provoque un court-circuit, les fils chauffent et fument ; un fusible fond et coupe le courant ; un disjoncteur se déclenche puis est réarmé',
    duration: 72, chapters: CH,
    segs: [
      { t: 0, d: 8.6, say: 'Deux lampes en série, alimentées par une pile, brillent normalement.', sub: 'Deux lampes en série brillent normalement.' },
      { t: 9, d: 5.4, say: 'Relions les deux bornes de la lampe L un par un simple fil.', sub: 'Un fil relie les bornes de L1…' },
      { t: 14.6, d: 6.2, say: 'L un s’éteint : le courant passe par le fil, pas par la lampe. Elle est court-circuitée. L deux brille plus fort.', sub: '…L1 est <b>court-circuitée</b> : elle s’éteint, L2 brille plus.' },
      { t: 21, d: 5.6, say: 'Maintenant, relions directement les deux bornes de la pile : c’est le court-circuit du générateur.', sub: 'Un fil aux bornes de la pile : <b>court-circuit du générateur</b>.' },
      { t: 26.8, d: 8, say: 'Les lampes s’éteignent, l’intensité devient très grande, les fils et la pile chauffent. Les isolants peuvent fondre : c’est un risque d’incendie !', sub: 'Intensité très grande, échauffement : <b>risque d’incendie</b> !' },
      { t: 35, d: 10.6, say: 'Pour se protéger, on place un fusible. En cas de court-circuit, son fil fin fond et coupe le courant. Il faudra le remplacer.', sub: 'Le <b>fusible</b> fond et coupe le courant.' },
      { t: 46, d: 11.6, say: 'Dans les maisons, on utilise surtout des disjoncteurs : ils se déclenchent et coupent le courant. Une fois la cause supprimée, on les réarme.', sub: 'Le <b>disjoncteur</b> se déclenche, puis on le réarme.' },
      { t: 58, d: 4.4, say: 'À retenir : un dipôle est court-circuité quand un fil relie ses bornes.', sub: 'Un fil relie les bornes : <b>court-circuit</b>.' },
      { t: 62.6, d: 4.2, say: 'Le court-circuit du générateur est dangereux : il provoque un échauffement.', sub: 'Court-circuit du générateur : <b>danger</b>.' },
      { t: 67, d: 5, say: 'Fusibles et disjoncteurs protègent les installations électriques.', sub: '<b>Fusibles</b> et <b>disjoncteurs</b> protègent.' }
    ],
    learn: [
      { t: 20, ch: 1, html: 'Lampe court-circuitée : elle <b>s’éteint</b>, le courant passe par le fil.' },
      { t: 34, ch: 2, html: 'Générateur court-circuité : intensité très grande, <b>échauffement</b>.' },
      { t: 45, ch: 3, html: 'Le <b>fusible</b> fond et coupe le circuit.' },
      { t: 57, ch: 4, html: 'Le <b>disjoncteur</b> se déclenche ; on le réarme.' }
    ],
    question: { q: 'Quand on relie les deux bornes d’une pile par un fil :', o: ['la pile se recharge', 'il y a court-circuit : danger', 'rien ne se passe', 'les lampes brillent plus'], a: 1, e: 'L’intensité devient très grande : échauffement.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Circuit avec une pile, un interrupteur et deux lampes en série ; on peut poser un fil aux bornes de L1 ou de la pile et ajouter un fusible ou un disjoncteur ; à droite, l’intensité, l’échauffement et un diagnostic',
    steps: [
      'Pose un fil aux bornes de L1 : que deviennent L1 et L2 ?',
      'Sans protection, pose un fil aux bornes de la pile : observe l’intensité et l’échauffement.',
      'Ajoute un fusible, puis un disjoncteur, et recommence.',
      'Remets le circuit en service : supprime le court-circuit, change le fusible ou réarme.'
    ],
    build: function (api) {
      var lab = Lab(api.g, { onCut: function (k) { api.sound('bad'); api.say(k === 'fusible' ? 'Le fusible a fondu !' : 'Le disjoncteur a sauté !'); } }), st = lab.st, c = api.c, rows = [];
      var cS = c.seg({ label: 'Fil de court-circuit', value: 'none', options: [{ v: 'none', l: 'aucun' }, { v: 'L1', l: 'aux bornes de L1' }, { v: 'G', l: 'aux bornes de la pile' }], onChange: function (v) { st.sc = v; } });
      var cP = c.seg({ label: 'Protection', value: 'none', options: [{ v: 'none', l: 'aucune' }, { v: 'fusible', l: 'fusible' }, { v: 'disj', l: 'disjoncteur' }], onChange: function (v) { st.prot = v; st.blown = false; st.tripped = false; } });
      var r1 = c.row(); c.button({ label: 'Changer le fusible', sm: true, into: r1, onClick: function () { st.blown = false; api.sound('tick'); } }); c.button({ label: 'Réarmer le disjoncteur', sm: true, into: r1, onClick: function () { st.tripped = false; api.sound('tick'); } });
      var ro = api.readouts([{ k: 'i', label: 'Intensité' }, { k: 'h', label: 'Échauffement' }, { k: 'd', label: 'Diagnostic' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.i.set(last.r.I > 3 ? 'très grande' : fmt(last.r.I, 2) + ' A'); ro.h.set(Math.round(last.heat * 100) + ' %'); ro.d.set({ cut: 'protégé', danger: 'DANGER', warn: 'L1 court-circuitée', ok: 'normal' }[last.kk]); });
      var M = api.measure; M.innerHTML = '<h3>Mes observations</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ s: { none: 'aucun', L1: 'L1', G: 'pile' }[st.sc], p: { none: 'aucune', fusible: 'fusible', disj: 'disjoncteur' }[st.prot], o: { cut: 'courant coupé', danger: 'échauffement dangereux', warn: 'L1 éteinte, L2 plus brillante', ok: 'lampes allumées' }[last.kk] }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Court-circuit</th><th>Protection</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.s + '</td><td>' + r.p + '</td><td>' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucune observation.</div>';
        api.chart.innerHTML = '<h3>À la maison</h3><table class="mt"><tbody><tr><td>Ne pas surcharger</td><td>les multiprises</td></tr><tr><td>Remplacer</td><td>les fils dénudés ou abîmés</td></tr><tr><td>Ne jamais</td><td>remplacer un fusible par un fil</td></tr><tr><td>Disjoncteur</td><td>couper avant toute intervention</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.sc = 'none'; st.prot = 'none'; st.closed = true; st.heat = 0; st.blown = st.tripped = false; cS.set('none'); cP.set('none'); rows = []; paint(); });
      api.say('Pose un fil aux bornes de L1.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 observations.</p>';
        return '<p>Un dipôle est <b>court-circuité</b> lorsqu’un fil de connexion relie ses deux bornes : le courant passe par le fil. Une lampe court-circuitée s’éteint ; dans un circuit en série, l’autre lampe brille plus fort.</p><p>Le <b>court-circuit du générateur</b> est dangereux : l’intensité devient très grande, les fils et le générateur s’échauffent, les isolants peuvent fondre et provoquer un <b>incendie</b>.</p><p>On protège les installations avec un <b>fusible</b> (son fil fond et coupe le courant ; on le remplace) ou un <b>disjoncteur</b> (il se déclenche ; on le réarme après avoir supprimé la cause).</p><p style="font-size:13px;color:var(--muted)">Dans cette simulation, l’intensité de court-circuit est une valeur d’illustration : en réalité, elle dépend du générateur (de sa résistance interne) et peut devenir très grande.</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Court-circuit' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  function scSeg(api, lab) { api.c.seg({ label: 'Fil de court-circuit', value: lab.st.sc, options: [{ v: 'none', l: 'aucun' }, { v: 'L1', l: 'bornes de L1' }, { v: 'G', l: 'bornes de la pile' }], onChange: function (v) { lab.st.sc = v; } }); }
  var DEFI = {
    title: 'Le défi de la sécurité',
    intro: 'Court-circuit en vue ! Comprends le danger et protège l’installation.',
    missions: [
      { title: 'Plus brillante', text: 'Fais briller <span style="color:#FFC773">L2 plus fort</span> sans changer la pile.', lumi: 'Et si L1 n’était plus sur le chemin du courant ?', hint: 'Court-circuite L1.',
        build: function (api) { var lab = mini(api, {}); scSeg(api, lab); return function () { var r = lab.res(); return r.sc === 'L1' && r.kk === 'warn' ? { ok: true, msg: 'L1 est court-circuitée : L2 reçoit toute la tension.' } : { ok: false, msg: r.kk === 'danger' ? 'Danger : tu as court-circuité la pile !' : 'L2 brille normalement.' }; }; },
        e: 'En court-circuitant L1, toute la tension va sur L2.' },
      { type: 'qcm', title: 'Le danger', text: 'Le court-circuit d’un générateur est dangereux car :', o: ['les lampes brillent trop', 'les fils chauffent fortement : risque d’incendie', 'la pile se recharge', 'il n’y a plus de courant'], a: 1, hint: 'Regarde l’échauffement.', e: 'Intensité très grande, échauffement, incendie possible.' },
      { title: 'Protège !', text: 'La pile est en court-circuit ! Ajoute une <b>protection</b> pour couper le courant avant que ça chauffe trop.', lumi: 'Deux protections possibles…', hint: 'Fusible ou disjoncteur.',
        build: function (api) { var lab = mini(api, { sc: 'G' }); api.c.seg({ label: 'Protection', value: 'none', options: [{ v: 'none', l: 'aucune' }, { v: 'fusible', l: 'fusible' }, { v: 'disj', l: 'disjoncteur' }], onChange: function (v) { lab.st.prot = v; } }); return function () { var r = lab.res(); return (r.blown || r.tripped) && r.heat < 0.55 ? { ok: true, msg: 'Courant coupé : installation protégée.' } : { ok: false, msg: r.heat >= 0.55 ? 'Trop tard, ça a chauffé !' : 'Le court-circuit est toujours là.' }; }; },
        e: 'Le fusible fond ou le disjoncteur se déclenche : le courant est coupé.' },
      { type: 'qcm', title: 'Fusible fondu', text: 'Après un court-circuit, le fusible a fondu. Que faut-il faire ?', o: ['le remplacer par un fil de cuivre', 'supprimer la cause puis remplacer le fusible', 'ne rien faire', 'ajouter une pile'], a: 1, hint: 'Jamais de fil à la place d’un fusible !', e: 'On supprime la cause puis on met un fusible neuf.' },
      { title: 'Retour de la lumière', text: 'Le disjoncteur a sauté. <b>Rétablis</b> le courant pour rallumer les deux lampes.', lumi: 'Réarmer tout de suite ne suffira pas…', hint: 'Enlève le fil de court-circuit, puis réarme.',
        build: function (api) { var lab = mini(api, { sc: 'G', prot: 'disj', tripped: true }); scSeg(api, lab); api.c.button({ label: 'Réarmer le disjoncteur', sm: true, onClick: function () { lab.st.tripped = false; } }); return function () { var r = lab.res(); return r.kk === 'ok' && r.r.I > 0 ? { ok: true, msg: 'Lumière revenue en toute sécurité !' } : { ok: false, msg: r.tripped ? 'Le disjoncteur est encore déclenché.' : 'Il reste un problème.' }; }; },
        e: 'On supprime la cause du court-circuit avant de réarmer.' }
    ]
  };

  S.start({
    id: '6e-court-circuit', level: '6e', theme: 'Électricité', title: 'Court-circuit et protection des installations électriques', back: '../6e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Un dipôle est <b>court-circuité</b> lorsque ses deux bornes sont reliées par un fil de connexion : le courant passe par le fil.',
      'Une lampe court-circuitée <b>s’éteint</b> ; dans un circuit en série, les autres lampes brillent davantage.',
      'Le <b>court-circuit du générateur</b> est <b>dangereux</b> : l’intensité devient très grande, les fils et le générateur s’échauffent, ce qui peut provoquer un <b>incendie</b>.',
      'Le <b>fusible</b> protège l’installation : son fil fond et coupe le courant. Le <b>disjoncteur</b> se déclenche et coupe le courant ; on le réarme après avoir supprimé la cause.',
      'Ne jamais remplacer un fusible par un fil, ne pas surcharger les multiprises, remplacer les fils dénudés.'
    ],
    quiz: [
      { q: 'Une lampe dont les bornes sont reliées par un fil :', o: ['brille plus fort', 's’éteint', 'grille', 'clignote'], a: 1, e: 'Elle est court-circuitée.' },
      { q: 'Le court-circuit du générateur provoque :', o: ['un refroidissement', 'un échauffement dangereux', 'une économie d’énergie', 'rien'], a: 1, e: 'Risque d’incendie.' },
      { q: 'Le fusible protège le circuit en :', o: ['augmentant le courant', 'fondant pour couper le courant', 'éclairant', 'rechargeant la pile'], a: 1, e: 'Son fil fin fond.' },
      { q: 'Un disjoncteur déclenché :', o: ['doit être jeté', 'peut être réarmé', 'doit être remplacé par un fil', 'produit du courant'], a: 1, e: 'Après avoir supprimé la cause.' },
      { q: 'Pour éviter les accidents à la maison :', o: ['on surcharge les multiprises', 'on remplace les fils dénudés', 'on remplace les fusibles par des fils', 'on bouche les prises avec du papier'], a: 1, e: 'Les fils dénudés provoquent des courts-circuits.' }
    ]
  });
})();
