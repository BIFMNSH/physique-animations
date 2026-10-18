/* 5e · Électricité · Leçon : Adaptation d’un générateur à un récepteur */
(function () {
  var S = window.Studio, s = S.s, attr = S.attr, fmt = S.fmt, K = S.kit, E = window.ElecKit;
  var REC = {
    L1: { n: 'lampe 1,5 V', Un: 1.5, ind: '1,5 V – 0,3 A', lamp: true },
    L4: { n: 'lampe 4,5 V', Un: 4.5, ind: '4,5 V – 0,2 A', lamp: true },
    L6: { n: 'lampe 6 V', Un: 6, ind: '6 V – 0,1 A', lamp: true },
    L12: { n: 'lampe 12 V', Un: 12, ind: '12 V – 0,1 A', lamp: true },
    M6: { n: 'moteur 6 V', Un: 6, ind: '6 V', lamp: false }
  };
  var GENS = [1.5, 4.5, 6, 9, 12];
  function gname(u) { return (u === 6 || u === 12 ? 'générateur ' : 'pile ') + E.v(u); }
  function motorState(U, Un) { var r = U / Un; return r < 0.3 ? { r: r, k: 'off', t: 'ne tourne pas' } : r < 0.8 ? { r: r, k: 'low', t: 'tourne lentement : sous-tension' } : r <= 1.2 ? { r: r, k: 'ok', t: 'tourne normalement' } : { r: r, k: 'high', t: 'tourne trop vite et chauffe : surtension' }; }
  var KCOL = { off: '#7D89A3', low: '#4FC3FF', ok: '#3DD68C', high: '#FFB547', burn: '#FF5A4E' };

  function Lab(G, o) {
    var st = Object.assign({ U: 4.5, reg: false, rec: 'L6', closed: true, broken: false, t: null, onBurn: null }, o || {});
    s('rect', { x: 0, y: 0, width: 860, height: 470, fill: '#0A0F1A' }, G);
    s('rect', { x: 40, y: 60, width: 480, height: 370, rx: 22, fill: '#0F1729', stroke: '#1E2A44', 'stroke-width': 2 }, G);
    var w1 = E.wire(G, 'M343 370 H480 V120 H402'), w2 = E.wire(G, 'M358 120 H200'), w3 = E.wire(G, 'M140 120 H90 V370 H229');
    var bat = E.battery(G, 285, 370, { U: st.U, caption: '' });
    var K1 = E.switchK(G, 140, 120, 200, { closed: st.closed, onToggle: function (c) { st.closed = c; o.onToggle && o.onToggle(c); } });
    var lp = E.lamp(G, 380, 120, { r: 24 }), mo = E.motor(G, 380, 120, { down: true });
    var recL = s('text', { x: 380, y: 222, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#C9D2E3' }, G);
    var genL = s('text', { x: 285, y: 412, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, G);
    var heat = s('circle', { cx: 380, cy: 140, r: 50, fill: E.glow(G, '#FF5A4E'), opacity: 0 }, G); G.insertBefore(heat, mo.g);
    // panneau : indications et comparaison
    var PX = 548, P = s('g', {}, G);
    s('rect', { x: PX, y: 22, width: 294, height: 426, rx: 18, fill: '#0F1729', stroke: '#2B3A57', 'stroke-width': 2 }, P);
    s('text', { x: PX + 20, y: 50, 'font-size': 12, 'font-weight': 800, fill: '#A9B4C7', text: 'INDICATIONS DU RÉCEPTEUR' }, P);
    s('circle', { cx: PX + 147, cy: 120, r: 54, fill: '#C9CDD6', stroke: '#8D96A8', 'stroke-width': 4 }, P);
    s('circle', { cx: PX + 147, cy: 120, r: 46, fill: 'none', stroke: '#A8AEBA', 'stroke-width': 2, 'stroke-dasharray': '3 5' }, P);
    var ind = s('text', { x: PX + 147, y: 127, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 900, fill: '#2A2F38' }, P);
    s('path', { d: 'M' + (PX + 186) + ' 160 l26 26', stroke: '#8D96A8', 'stroke-width': 8, 'stroke-linecap': 'round' }, P);
    var indSub = s('text', { x: PX + 147, y: 198, 'text-anchor': 'middle', 'font-size': 12, fill: '#A9B4C7' }, P);
    s('text', { x: PX + 20, y: 236, 'font-size': 13, fill: '#C9D2E3', text: 'tension nominale' }, P); var tUn = s('text', { x: PX + 274, y: 236, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 800, fill: '#3DD68C' }, P);
    s('rect', { x: PX + 20, y: 246, width: 254, height: 12, rx: 6, fill: '#1A2540' }, P); var bUn = s('rect', { x: PX + 20, y: 246, height: 12, rx: 6, fill: '#3DD68C' }, P);
    s('text', { x: PX + 20, y: 286, 'font-size': 13, fill: '#C9D2E3', text: 'tension du générateur' }, P); var tU = s('text', { x: PX + 274, y: 286, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 800, fill: '#FFB547' }, P);
    s('rect', { x: PX + 20, y: 296, width: 254, height: 12, rx: 6, fill: '#1A2540' }, P); var bU = s('rect', { x: PX + 20, y: 296, height: 12, rx: 6, fill: '#FFB547' }, P);
    var vb = s('rect', { x: PX + 20, y: 330, width: 254, height: 44, rx: 22 }, P), vt = s('text', { x: PX + 147, y: 358, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 900, fill: '#0B1220' }, P);
    var vs = s('text', { x: PX + 147, y: 400, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P), vs2 = s('text', { x: PX + 147, y: 420, 'text-anchor': 'middle', 'font-size': 13, fill: '#C9D2E3' }, P);
    var burnAt = null;
    function step() {
      var T = st.t != null ? st.t : performance.now() / 1000, R = REC[st.rec];
      bat.set(st.U); bat.band.setAttribute('fill', st.reg ? '#4FC3FF' : '#FFB547'); genL.textContent = st.reg ? 'générateur réglable' : gname(st.U);
      var Ueff = st.closed && !st.broken ? st.U : 0, ls = R.lamp ? E.lampState(st.U, R.Un) : motorState(st.U, R.Un);
      if (R.lamp && st.closed && ls.k === 'burn' && !st.broken) { if (burnAt == null) burnAt = T; if (T - burnAt > 0.5) { st.broken = true; burnAt = null; st.onBurn && st.onBurn(); } } else burnAt = null;
      lp.g.style.display = R.lamp ? '' : 'none'; mo.g.style.display = R.lamp ? 'none' : '';
      var on = st.closed && !st.broken;
      if (R.lamp) lp.set(on ? (ls.k === 'burn' ? 2.2 : ls.b) : 0, st.broken); else mo.set(on ? Math.min(2, ls.r) : 0, st.t);
      heat.setAttribute('opacity', !R.lamp && on && ls.k === 'high' ? 0.4 + 0.3 * Math.sin(T * 8) : 0);
      var I = on && (ls.k !== 'off' || !R.lamp) ? Math.min(1.6, ls.r) : 0; [w1, w2, w3].forEach(function (w) { w.flow(I, T); });
      recL.textContent = R.n + (st.broken ? ' (grillée)' : '');
      ind.textContent = R.ind; indSub.textContent = R.lamp ? 'inscrit sur le culot de la lampe' : 'inscrit sur le moteur';
      tUn.textContent = E.v(R.Un); tU.textContent = E.v(st.U); attr(bUn, { width: 254 * R.Un / 12 }); attr(bU, { width: 254 * st.U / 12 });
      var k = st.broken ? 'burn' : !st.closed ? 'off' : ls.k, txt = st.broken ? 'LAMPE GRILLÉE' : !st.closed ? 'CIRCUIT OUVERT' : { off: 'RIEN NE SE PASSE', low: 'SOUS-TENSION', ok: 'GÉNÉRATEUR ADAPTÉ', high: 'SURTENSION', burn: 'FORTE SURTENSION' }[ls.k];
      vb.setAttribute('fill', KCOL[k]); vt.textContent = txt;
      var why = st.broken ? ['Le filament a fondu.', 'Change la lampe (bouton).'] : !st.closed ? ['Ferme l’interrupteur K', 'pour faire passer le courant.'] : { off: ['La tension est beaucoup trop faible.', ''], low: ['U plus petite que la tension nominale :', 'le récepteur fonctionne mal.'], ok: ['U ≈ tension nominale :', 'fonctionnement normal.'], high: ['U plus grande que la tension nominale :', 'le récepteur s’use ou chauffe.'], burn: ['U bien trop grande :', 'la lampe va griller !'] }[ls.k];
      vs.textContent = why[0]; vs2.textContent = why[1];
      return { k: k, ls: ls, U: st.U, Un: R.Un, rec: st.rec, broken: st.broken, closed: st.closed };
    }
    return { st: st, step: step, K: K1 };
  }

  /* ================== RÉSUMÉ ================== */
  var CH = [{ t: 0, title: 'Les indications d’un récepteur' }, { t: 12, title: 'Un générateur adapté' }, { t: 23, title: 'La sous-tension' }, { t: 33, title: 'La surtension' }, { t: 45, title: 'Et pour un moteur ?' }, { t: 55, title: 'À retenir' }];
  function scene(api) {
    var G = api.g, tg = K.tagger(G), chap = K.chapter(G, CH);
    var g = s('g', { transform: 'translate(36 26) scale(0.92)' }, G), lab = Lab(g, { U: 6, rec: 'L6', closed: false }), st = lab.st;
    var g5 = s('g', {}, G), cards = K.cards(g5, [
      ['La <b>tension nominale</b> est inscrite sur le récepteur', 'c’est la tension pour laquelle il fonctionne normalement.', '#3DD68C'],
      ['Générateur <b>adapté</b> : sa tension ≈ la tension nominale', 'trop faible : sous-tension ; trop forte : surtension.', '#FFB547'],
      ['La <b>surtension</b> est dangereuse pour le récepteur', 'une lampe survoltée brille trop fort… puis grille.', '#FF5A4E']], [55.2, 59.6, 64]);
    var bg = s('rect', { x: 0, y: 0, width: 900, height: 560, fill: 'var(--scene)', opacity: 0 }, G); G.insertBefore(bg, g5);
    function render(t) {
      tg.begin();
      if (K.group(g, t, -1, 55.2)) {
        st.t = t; st.closed = t > 13; st.reg = t > 23;
        if (t < 45) { st.rec = 'L6'; st.U = t < 23 ? 6 : t < 33 ? 1.5 + 2 * K.k(t, 28, 3) : 6 + 6 * K.k(t, 34, 4); st.broken = t > 39.4; }
        else { st.rec = 'M6'; st.broken = false; st.U = t < 50 ? 6 : 6 - 3 * K.k(t, 50, 2); }
        lab.step();
        tg.show(t, 3, 11.6, 285, 92, '6 V – 0,1 A : ses valeurs nominales') || tg.show(t, 14, 22.6, 285, 92, 'Pile 6 V + lampe 6 V : éclat normal') || tg.show(t, 24, 32.6, 285, 92, 'Tension trop faible : éclat faible') ||
          tg.show(t, 34.4, 39.2, 285, 92, 'La tension augmente… trop !') || tg.show(t, 39.6, 44.6, 285, 92, 'Le filament fond : la lampe grille') || tg.show(t, 46, 54.6, 285, 92, 'Le moteur aussi a sa tension nominale');
      }
      bg.setAttribute('opacity', t > 54.8 ? 1 : 0);
      K.group(g5, t, 54.8, 99); cards(t);
      tg.end(); chap(t);
    }
    return { render: render };
  }
  var RESUME = {
    alt: 'Résumé animé : un circuit avec un générateur, un interrupteur et une lampe 6 V ; la lampe brille normalement sous 6 V, faiblement sous une tension plus faible, puis grille quand la tension devient trop forte ; enfin un moteur 6 V',
    duration: 69, chapters: CH,
    segs: [
      { t: 0, d: 5.6, say: 'Regarde le culot de cette lampe : on y lit deux indications, six volts et zéro virgule un ampère.', sub: 'Sur le culot : <b>6 V – 0,1 A</b>.' },
      { t: 5.8, d: 6, say: 'Six volts, c’est sa tension nominale : la tension pour laquelle elle a été fabriquée.', sub: '6 V est sa <b>tension nominale</b>.' },
      { t: 12, d: 5, say: 'Branchons-la sur un générateur de six volts et fermons l’interrupteur.', sub: 'Générateur de <b>6 V</b>, on ferme l’interrupteur…' },
      { t: 17.2, d: 5.4, say: 'La lampe brille normalement : le générateur est adapté à la lampe.', sub: 'Éclat normal : le générateur est <b>adapté</b>.' },
      { t: 23, d: 4.4, say: 'Avec une tension plus faible, un virgule cinq volt…', sub: 'Avec une tension plus faible…' },
      { t: 27.6, d: 5, say: '… la lampe brille faiblement. Elle est en sous-tension.', sub: '…éclat faible : <b>sous-tension</b>.' },
      { t: 33, d: 6, say: 'Augmentons la tension au-delà de six volts : la lampe brille de plus en plus fort. Elle est en surtension.', sub: 'Au-delà de 6 V : <b>surtension</b>, éclat trop fort…' },
      { t: 39.4, d: 5.4, say: 'Trop, c’est trop : le filament fond, la lampe est grillée.', sub: '…le filament fond : la lampe <b>grille</b>.' },
      { t: 45, d: 9.4, say: 'C’est pareil pour un moteur : sous sa tension nominale de six volts, il tourne normalement ; sous une tension trop faible, il tourne lentement.', sub: 'Un moteur aussi a une <b>tension nominale</b>.' },
      { t: 55, d: 4.4, say: 'À retenir : la tension nominale est inscrite sur le récepteur.', sub: 'La tension nominale est <b>inscrite</b> sur le récepteur.' },
      { t: 59.6, d: 4.2, say: 'Un générateur est adapté quand sa tension est égale à cette tension nominale.', sub: 'Adapté : tension du générateur = tension nominale.' },
      { t: 64, d: 5, say: 'Une forte surtension peut détériorer le récepteur.', sub: 'La <b>surtension</b> abîme le récepteur.' }
    ],
    learn: [
      { t: 11, ch: 0, html: 'La <b>tension nominale</b> est inscrite sur le récepteur.' },
      { t: 22, ch: 1, html: 'U<sub>générateur</sub> = U<sub>nominale</sub> : générateur <b>adapté</b>.' },
      { t: 32, ch: 2, html: 'U trop faible : <b>sous-tension</b>, fonctionnement médiocre.' },
      { t: 44, ch: 3, html: 'U trop forte : <b>surtension</b>, le récepteur peut griller.' }
    ],
    question: { q: 'Une lampe porte l’indication 6 V. Avec une pile de 9 V, elle est :', o: ['adaptée', 'en sous-tension', 'en surtension', 'éteinte'], a: 2, e: '9 V est supérieur à sa tension nominale de 6 V : surtension.' },
    scene: scene
  };

  /* ================== SIMULATION ================== */
  var SIM = {
    W: 860, H: 470,
    alt: 'Circuit en boucle : un générateur, un interrupteur K et un récepteur (lampe ou moteur) ; à droite, les indications du récepteur et la comparaison entre tension nominale et tension du générateur',
    steps: [
      'Lis les indications du récepteur : quelle est sa tension nominale ?',
      'Choisis différentes piles et observe l’éclat de la lampe (clique sur K pour ouvrir ou fermer).',
      'Trouve, pour chaque lampe, le générateur adapté. Attention à la surtension !',
      'Avec le générateur réglable, trouve la tension qui fait tourner le moteur normalement.'
    ],
    build: function (api) {
      var cG, cR, sU;
      var lab = Lab(api.g, { onToggle: function () { api.sound('tick'); } }), st = lab.st, c = api.c, rows = [];
      st.onBurn = function () { api.sound('bad'); api.say('Oups ! La lampe a grillé. Change-la avec le bouton.'); };
      cR = c.seg({ label: 'Récepteur', value: 'L6', options: Object.keys(REC).map(function (k) { return { v: k, l: REC[k].n }; }), onChange: function (v) { st.rec = v; st.broken = false; } });
      cG = c.seg({ label: 'Générateur', value: 4.5, options: GENS.map(function (u) { return { v: u, l: gname(u) }; }).concat([{ v: 'reg', l: 'réglable' }]), onChange: function (v) { if (v === 'reg') { st.reg = true; sU.hide(false); st.U = sU.get(); } else { st.reg = false; sU.hide(true); st.U = v; } } });
      sU = c.slider({ label: 'Tension du générateur réglable', min: 0, max: 12, step: 0.5, value: 6, unit: 'V', dec: 1, onInput: function (v) { if (st.reg) st.U = v; } }); sU.hide(true);
      var r1 = c.row(); c.button({ label: 'Changer la lampe', sm: true, into: r1, onClick: function () { st.broken = false; api.sound('tick'); } }); c.button({ label: 'Ouvrir / fermer K', sm: true, into: r1, onClick: function () { st.closed = !st.closed; lab.K.set(st.closed); } });
      var ro = api.readouts([{ k: 'u', label: 'Tension générateur' }, { k: 'n', label: 'Tension nominale' }, { k: 'e', label: 'Fonctionnement' }]);
      var last = {};
      api.loop(function () { last = lab.step(); ro.u.set(E.v(st.U)); ro.n.set(E.v(last.Un)); ro.e.set(last.broken ? 'grillé' : !last.closed ? 'circuit ouvert' : last.ls.t.split(' : ')[0]); });
      var M = api.measure; M.innerHTML = '<h3>Mes essais</h3>';
      var br = api.h('div', { style: 'display:flex;gap:8px' }, M), bR = api.h('button', { class: 'btn sm primary' }, br, 'Relever cet essai'), tb = api.h('div', { style: 'margin-top:8px' }, M);
      bR.onclick = function () { rows.push({ r: REC[st.rec].n, u: st.U, o: last.broken ? 'grillée' : !last.closed ? 'circuit ouvert' : last.ls.t, k: last.k }); api.sound('ok'); paint(); if (rows.length >= 4) api.done(); };
      function paint() {
        api.count(rows.length);
        tb.innerHTML = rows.length ? '<table class="mt"><thead><tr><th>Récepteur</th><th>Générateur</th><th>Observation</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r.r + '</td><td>' + E.v(r.u) + '</td><td style="color:' + KCOL[r.k] + '">' + r.o + '</td></tr>'; }).join('') + '</tbody></table>' : '<div class="empty">Aucun essai relevé.</div>';
        api.chart.innerHTML = '<h3>Le bon générateur pour chaque lampe</h3><table class="mt"><thead><tr><th>Lampe</th><th>Générateur adapté</th></tr></thead><tbody><tr><td>1,5 V</td><td>pile 1,5 V</td></tr><tr><td>4,5 V</td><td>pile plate 4,5 V</td></tr><tr><td>6 V</td><td>6 V</td></tr><tr><td>12 V</td><td>12 V</td></tr></tbody></table>';
      }
      paint();
      api.onReset(function () { st.U = 4.5; st.reg = false; st.rec = 'L6'; st.closed = true; st.broken = false; lab.K.set(true); cR.set('L6'); cG.set(4.5); sU.set(6); sU.hide(true); rows = []; paint(); });
      api.say('Essaie plusieurs piles avec la lampe 6 V.');
      return { bilan: function () {
        if (rows.length < 3) return '<p>Relève au moins 3 essais différents.</p>';
        return '<p>Chaque récepteur porte des <b>indications</b> : sa <b>tension nominale</b> (en volts) et parfois l’intensité nominale (en ampères).</p><p>Si la tension du générateur est <b>égale</b> à la tension nominale, le générateur est <b>adapté</b> : le récepteur fonctionne normalement.</p><p>Plus faible : <b>sous-tension</b> (éclat faible, moteur lent). Plus forte : <b>surtension</b> (éclat trop fort) ; une forte surtension <b>détériore</b> le récepteur (la lampe grille).</p>';
      } };
    }
  };

  /* ================== DÉFI ================== */
  function mini(api, o) { var sv = api.s('svg', { viewBox: '0 0 860 470', style: 'width:100%;flex:1;min-height:0', role: 'img', 'aria-label': 'Circuit électrique' }, api.root), G = api.s('g', {}, sv), lab = Lab(G, o); var r = {}; api.loop(function () { r = lab.step(); }); lab.res = function () { return r; }; return lab; }
  var DEFI = {
    title: 'Le défi de l’électricien',
    intro: 'Chaque récepteur a ses besoins. Choisis bien… sinon, gare au filament !',
    missions: [
      { title: 'La bonne pile', text: 'Choisis le générateur qui fait briller la <span style="color:#3DD68C">lampe 6 V</span> normalement.', lumi: 'Regarde les indications sur le culot.', hint: 'Même tension que la tension nominale.',
        build: function (api) { var lab = mini(api, { U: 1.5, rec: 'L6' }); api.c.seg({ label: 'Générateur', value: 1.5, options: GENS.map(function (u) { return { v: u, l: gname(u) }; }), onChange: function (v) { lab.st.U = v; lab.st.broken = false; } }); return function () { var r = lab.res(); return r.k === 'ok' ? { ok: true, msg: '6 V pour une lampe 6 V : générateur adapté !' } : { ok: false, msg: r.broken ? 'La lampe a grillé : trop de tension !' : 'Pas encore : ' + r.ls.t + '.' }; }; },
        e: 'Le générateur est adapté quand sa tension est égale à la tension nominale de la lampe.' },
      { type: 'qcm', title: 'Pile de 9 V', text: 'On branche une lampe marquée 3,5 V sur une pile de 9 V. Que se passe-t-il ?', o: ['Elle brille normalement', 'Elle brille faiblement', 'Elle brille très fort et risque de griller', 'Elle ne s’allume pas'], a: 2, hint: '9 V, c’est plus du double de 3,5 V.', e: 'Forte surtension : la lampe risque de griller.' },
      { title: 'La bonne lampe', text: 'Tu n’as qu’une <span style="color:var(--amber)">pile plate 4,5 V</span>. Choisis la lampe qui lui est adaptée.', lumi: 'Cette fois, c’est la lampe qu’on choisit.', hint: 'Lis les tensions nominales.',
        build: function (api) { var lab = mini(api, { U: 4.5, rec: 'L12' }); api.c.seg({ label: 'Lampe', value: 'L12', options: ['L1', 'L4', 'L6', 'L12'].map(function (k) { return { v: k, l: REC[k].n }; }), onChange: function (v) { lab.st.rec = v; lab.st.broken = false; } }); return function () { var r = lab.res(); return r.k === 'ok' && r.rec === 'L4' ? { ok: true, msg: 'Lampe 4,5 V et pile 4,5 V : parfait.' } : { ok: false, msg: r.broken ? 'Grillée ! Cette lampe ne supporte pas 4,5 V.' : r.ls.t + '.' }; }; },
        e: 'La lampe 4,5 V est adaptée à la pile 4,5 V.' },
      { type: 'qcm', title: 'Vocabulaire', text: 'La tension nominale d’un récepteur, c’est :', o: ['la tension maximale de la pile', 'la tension pour laquelle il fonctionne normalement', 'la tension quand le circuit est ouvert', 'l’intensité du courant'], a: 1, hint: 'Elle est inscrite dessus.', e: 'C’est la tension de fonctionnement normal, inscrite sur le récepteur.' },
      { title: 'Le ventilateur', text: 'Règle le générateur pour que le <span style="color:#4FC3FF">moteur 6 V</span> tourne normalement.', lumi: 'Ni trop lent, ni surchauffe…', hint: 'Autour de 6 V.',
        build: function (api) { var lab = mini(api, { U: 2, rec: 'M6', reg: true }); api.c.slider({ label: 'Tension du générateur', min: 0, max: 12, step: 0.5, value: 2, unit: 'V', dec: 1, onInput: function (v) { lab.st.U = v; } }); return function () { var r = lab.res(); return r.k === 'ok' ? { ok: true, msg: 'Le moteur tourne normalement.' } : { ok: false, msg: 'Le moteur ' + r.ls.t + '.' }; }; },
        e: 'Le moteur fonctionne normalement sous sa tension nominale (6 V).' }
    ]
  };

  S.start({
    id: '5e-generateur-recepteur', level: '5e', theme: 'Électricité', title: 'Adaptation d’un générateur à un récepteur', back: '../5e/',
    resume: RESUME, sim: SIM, defi: DEFI,
    retiens: [
      'Sur chaque récepteur (lampe, moteur…) sont inscrites des <b>indications</b> : la <b>tension nominale</b> en volts (V), parfois l’intensité nominale en ampères (A). Exemple : 6 V – 0,1 A.',
      'La tension nominale est la tension sous laquelle le récepteur <b>fonctionne normalement</b>.',
      'Un générateur est <b>adapté</b> à un récepteur lorsque sa tension est égale (ou très proche) de la tension nominale du récepteur.',
      'Tension plus faible : le récepteur est en <b>sous-tension</b> (lampe peu brillante, moteur lent).',
      'Tension plus forte : le récepteur est en <b>surtension</b> ; une forte surtension le <b>détériore</b> (la lampe grille).'
    ],
    quiz: [
      { q: 'L’indication 4,5 V sur une lampe est :', o: ['son intensité nominale', 'sa tension nominale', 'sa puissance', 'sa résistance'], a: 1, e: 'Le volt est l’unité de tension.' },
      { q: 'Une lampe 6 V branchée sur une pile 1,5 V :', o: ['brille normalement', 'brille faiblement', 'grille', 'brille très fort'], a: 1, e: 'Elle est en sous-tension.' },
      { q: 'Quel générateur est adapté à une lampe 12 V ?', o: ['une pile 1,5 V', 'une pile 4,5 V', 'un générateur 12 V', 'un générateur 24 V'], a: 2, e: 'Même tension que la tension nominale.' },
      { q: 'Une lampe en forte surtension :', o: ['s’éteint', 'peut griller', 'devient plus économe', 'ne change pas'], a: 1, e: 'Le filament chauffe trop et fond.' },
      { q: 'Un moteur en sous-tension :', o: ['tourne lentement', 'tourne très vite', 'explose', 'tourne normalement'], a: 0, e: 'Il ne reçoit pas assez de tension.' }
    ]
  });
})();
