/* NOHOBA-Lab · Livre vivant : moteur commun aux quatre niveaux (6e, 5e, 4e, 3e).
   Un module par leçon (assets/vivant/lecons/<slug>.js) décrit les chapitres, un laboratoire pop-up et ses lois ;
   le moteur fournit le livre 3D, le tracé animé, le son Web Audio plafonné, « Prédis puis révèle », le défi et le mode enseignant.
   Les textes d'À retenir et les questions du défi viennent des leçons Studio. Rien n'est envoyé : progression dans « vv-<slug> ». */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fr(x, d) { var s = (+x).toFixed(d == null ? 0 : d).split('.'); s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); return s.join(',').replace('-', '−'); }
  function lit(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function ecrit(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var raf = function (f) { return (window.requestAnimationFrame || function (g) { return setTimeout(function () { g(Date.now()); }, 16); })(f); };
  var caf = function (id) { (window.cancelAnimationFrame || clearTimeout)(id); };

  var V = window.Vivant = { mods: {}, fr: fr, add: function (m) { V.mods[m.slug] = m; } };
  var NIVEAUX = ['6e', '5e', '4e', '3e'];
  var ST = { niv: '5e', slug: '', les: null, th: null, M: null, D: null, mode: 'dbl', anim: true, son: true, ens: false, pos: 0, busy: false, sv: null, lv: {}, labs: [], dm: null };

  /* ---------- crayon : traits un peu tremblés, déterministes (rien ne scintille) ---------- */
  var P = V.P = { col: {} };
  P.theme = function () {
    var d = document.documentElement.getAttribute('data-theme') === 'dark';
    P.col = d ? { ink: '#F3ECDD', soft: '#B9AE98', paper: '#252119', a: '#8DB5FF', b: '#FFA56B', ok: '#6FE29A', hot: '#FF8A5C', cold: '#7DB8FF', fill: '#3A342A', glow: '#FFE08A' }
      : { ink: '#2A2620', soft: '#6B604F', paper: '#FFFDF6', a: '#1D4FA8', b: '#C2410C', ok: '#17753A', hot: '#D9480F', cold: '#1971C2', fill: '#F0E5CB', glow: '#F2B705' };
  };
  P.theme();
  function jit(a, b) { return Math.sin(a * 12.9898 + b * 78.233) * 0.8; }
  P.line = function (c, x1, y1, x2, y2, col, w) {
    c.strokeStyle = col || P.col.ink; c.lineWidth = w || 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.globalAlpha = 0.4; c.lineWidth = (w || 2) * 0.6; c.beginPath(); c.moveTo(x1 + jit(x1, y1), y1 + jit(y1, x2)); c.lineTo(x2 + jit(x2, y2), y2 + jit(y2, x1)); c.stroke(); c.globalAlpha = 1;
  };
  P.poly = function (c, pts, col, w, fill, close) {
    c.beginPath(); pts.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); if (close) c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); } if (col) { c.strokeStyle = col; c.lineWidth = w || 2; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
  };
  P.rect = function (c, x, y, w, h, col, lw, fill) { P.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], col || P.col.ink, lw || 2, fill, true); };
  P.circ = function (c, x, y, r, col, lw, fill) { c.beginPath(); c.arc(x, y, r, 0, 6.2832); if (fill) { c.fillStyle = fill; c.fill(); } if (col) { c.strokeStyle = col; c.lineWidth = lw || 2; c.stroke(); } };
  P.txt = function (c, s, x, y, size, col, align, weight) { c.fillStyle = col || P.col.ink; c.font = (weight || 700) + ' ' + (size || 14) + "px 'Ecolier','Atkinson Hyperlegible',sans-serif"; c.textAlign = align || 'left'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
  P.arrow = function (c, x1, y1, x2, y2, col, w) { P.line(c, x1, y1, x2, y2, col, w); var a = Math.atan2(y2 - y1, x2 - x1), s = 9; P.poly(c, [[x2, y2], [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)], [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)]], col || P.col.ink, 1.5, col || P.col.ink, true); };
  P.axes = function (c, x0, y0, x1, y1, xl, yl) { P.arrow(c, x0, y0, x1, y0, P.col.soft, 1.6); P.arrow(c, x0, y0, x0, y1, P.col.soft, 1.6); P.txt(c, xl, x1, y0 + 28, 12, P.col.soft, 'right'); P.txt(c, yl, x0 + 6, y1 - 4, 12, P.col.soft, 'left'); };
  V.lois = {};
  /* rebond de particules dans une boîte (utilisé par les leçons de particules) */
  V.sim = {
    cree: function (n, box, seed) { var a = [], i, r = seed || 1; function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; } for (i = 0; i < n; i++) a.push({ x: box.x + 10 + rnd() * (box.w - 20), y: box.y + 10 + rnd() * (box.h - 20), a: rnd() * 6.283, k: 0.6 + rnd() * 0.8 }); return a; },
    pas: function (a, box, v, dt, r) { a.forEach(function (p) { var s = v * p.k * dt; p.x += Math.cos(p.a) * s; p.y += Math.sin(p.a) * s; if (p.x < box.x + r) { p.x = box.x + r; p.a = Math.PI - p.a; } if (p.x > box.x + box.w - r) { p.x = box.x + box.w - r; p.a = Math.PI - p.a; } if (p.y < box.y + r) { p.y = box.y + r; p.a = -p.a; } if (p.y > box.y + box.h - r) { p.y = box.y + box.h - r; p.a = -p.a; } p.a += (Math.random() - 0.5) * 0.25; }); }
  };

  /* ---------- son : un seul oscillateur, niveau plafonné, arrêt 1,5 s après le dernier mouvement ---------- */
  var AU = { ctx: null, osc: null, g: null, m: null, tm: 0, hold: false, mute: false, MAX: 0.1 };
  AU.ok = function () { try { if (!AU.ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return false; AU.ctx = new C(); AU.m = AU.ctx.createGain(); AU.m.gain.value = AU.mute ? 0 : AU.MAX; AU.m.connect(AU.ctx.destination); } if (AU.ctx.state === 'suspended') AU.ctx.resume(); return true; } catch (e) { return false; } };
  AU.play = function (hz) {
    if (!ST.son || !hz || !AU.ok()) return; var t = AU.ctx.currentTime;
    if (!AU.osc) { AU.osc = AU.ctx.createOscillator(); AU.g = AU.ctx.createGain(); AU.g.gain.value = 0; AU.osc.type = 'sine'; AU.osc.frequency.value = hz; AU.osc.connect(AU.g); AU.g.connect(AU.m); AU.osc.start(); }
    AU.osc.frequency.setTargetAtTime(Math.max(40, Math.min(2000, hz)), t, 0.015); AU.g.gain.setTargetAtTime(1, t, 0.02);
    clearTimeout(AU.tm); if (!AU.hold) AU.tm = setTimeout(AU.stop, 1500);
  };
  AU.stop = function () { clearTimeout(AU.tm); if (!AU.osc) return; var o = AU.osc, g = AU.g; AU.osc = null; try { g.gain.setTargetAtTime(0, AU.ctx.currentTime, 0.04); setTimeout(function () { try { o.stop(); o.disconnect(); g.disconnect(); } catch (e) {} }, 250); } catch (e) {} };
  AU.silence = function (m) { AU.mute = m; if (AU.m) AU.m.gain.value = m ? 0 : AU.MAX; };
  V.AU = AU;

  /* ---------- laboratoire pop-up ---------- */
  function makeLab(host, cfg, key) {
    var W = cfg.w || 380, H = cfg.h || 270, DUR = 1500, HOLD = 1100;
    var sits = (cfg.sit || [{ nom: '' }]).map(function (s, i, all) { return { i: i, nom: s.nom || '', cls: all.length > 1 ? (i ? 'b' : 'a') : '', vars: s.vars || {}, v: {} }; });
    var multi = sits.length > 1, saved = ST.lv[key] || {}, val = {}, cmp = false, act = 0, hold = false, tmr = 0, alive = true, rid = 0, t0 = 0, cv, c;
    (cfg.inputs || []).forEach(function (d) { sits.forEach(function (s) { var k = d.per ? s.i + '.' + d.id : d.id; if (!(k in val)) val[k] = saved[k] != null ? saved[k] : (d.val != null ? (Array.isArray(d.val) ? d.val[s.i] : d.val) : d.min); }); });
    (cfg.choices || []).forEach(function (d) { sits.forEach(function (s) { var k = d.per ? s.i + '.' + d.id : d.id; if (!(k in val)) val[k] = saved[k] != null ? saved[k] : d.val; }); });
    function sync() { sits.forEach(function (s) { s.v = {}; (cfg.inputs || []).concat(cfg.choices || []).forEach(function (d) { s.v[d.id] = val[d.per ? s.i + '.' + d.id : d.id]; }); Object.keys(s.vars).forEach(function (k) { s.v[k] = s.vars[k]; }); }); }
    function ctl(d, s, choice) {
      var id = d.per ? s.i + '.' + d.id : d.id, lab = esc(d.label) + (d.per && multi ? ' (' + esc(s.nom) + ')' : '');
      if (choice) return '<div class="chs" role="group" aria-label="' + esc(d.label) + '"><span>' + esc(d.label) + '</span>' + d.opts.map(function (o) { return '<button type="button" data-ch="' + id + '" data-v="' + esc(o[0]) + '" aria-pressed="' + (String(val[id]) === String(o[0])) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
      return '<label class="sl ' + (d.per ? s.cls : '') + '"><span>' + lab + '</span><input type="range" data-in="' + id + '" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + val[id] + '" aria-label="' + esc(d.label) + (d.per && multi ? ', situation ' + s.nom : '') + '"><output data-o="' + id + '">' + fr(val[id], d.dec || 0) + ' ' + (d.unit || '') + '</output></label>';
    }
    var html = '<div class="pop" data-pop><div class="psh"></div><div class="pnl wl"></div><div class="pnl wr"></div><div class="pnl bk"><canvas width="' + W * 2 + '" height="' + H * 2 + '" role="img" aria-label="' + esc(cfg.alt || 'Modèle de la leçon') + '"></canvas></div></div><div class="ctl">';
    (cfg.choices || []).forEach(function (d) { if (d.per) sits.forEach(function (s) { html += '<div class="grp ' + s.cls + '" data-g="' + s.i + '">' + ctl(d, s, true) + '</div>'; }); else html += ctl(d, sits[0], true); });
    (cfg.inputs || []).forEach(function (d) { if (d.per) sits.forEach(function (s) { html += '<div class="grp ' + s.cls + '" data-g="' + s.i + '">' + ctl(d, s) + '</div>'; }); else html += ctl(d, sits[0]); });
    html += '<div class="act">' + (multi ? '<button type="button" data-cmp aria-pressed="false">Comparer en alternance</button>' : '') + (cfg.sound ? '<button type="button" data-ecoute aria-pressed="false">Écouter</button>' : '') + (cfg.notrace ? '' : '<button type="button" data-rej>Rejouer le tracé</button>') + '</div></div><div class="rd" data-rd></div>';
    host.innerHTML = html;
    cv = $('canvas', host); c = cv.getContext && cv.getContext('2d'); if (c) c.setTransform(2, 0, 0, 2, 0, 0);
    function actif() { return multi && cmp ? sits[act] : sits[0]; }
    function readouts() {
      var h = '', list = multi ? sits : [sits[0]];
      list.forEach(function (s, k) { var lines = cfg.read ? cfg.read(s.v, s) : [], dim = multi && cmp && act !== s.i; lines.forEach(function (l, j) { h += '<div class="ln ' + s.cls + (dim ? ' dim' : '') + '"><i></i><span' + (j === 0 && !multi ? ' class="big"' : '') + '>' + (multi && j === 0 ? '<b>' + esc(s.nom) + ' : </b>' : '') + l + '</span></div>'; }); });
      $('[data-rd]', host).innerHTML = h;
    }
    function prog(ts) { if (!ST.anim) return 1; var e = ts - t0; if (e > DUR + HOLD) { t0 = ts; e = 0; } return Math.max(0, Math.min(1, e / DUR)); }
    function pen(cc, pts, s, p, w) {
      if (!pts || pts.length < 2) return; var col = s.pc || (s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink), dim = multi && cmp && act !== s.i;
      cc.save(); cc.globalAlpha = dim ? 0.25 : 1; cc.lineWidth = w || 3; cc.lineCap = 'round'; cc.lineJoin = 'round';
      cc.strokeStyle = col; cc.globalAlpha *= 0.28; cc.setLineDash([4, 5]); cc.beginPath(); pts.forEach(function (q, i) { if (i) cc.lineTo(q[0], q[1]); else cc.moveTo(q[0], q[1]); }); cc.stroke(); cc.setLineDash([]);
      cc.globalAlpha = dim ? 0.25 : 1;
      var n = Math.max(1, Math.floor((pts.length - 1) * p)), fr0 = (pts.length - 1) * p - n + 1; cc.beginPath(); cc.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i <= n && i < pts.length; i++) cc.lineTo(pts[i][0], pts[i][1]);
      var hx = pts[Math.min(n, pts.length - 1)][0], hy = pts[Math.min(n, pts.length - 1)][1];
      if (p < 1 && n < pts.length - 1) { var a = pts[n], b = pts[n + 1]; hx = a[0] + (b[0] - a[0]) * Math.min(1, fr0); hy = a[1] + (b[1] - a[1]) * Math.min(1, fr0); cc.lineTo(hx, hy); }
      cc.stroke();
      if (p < 1 && !dim) { var g = cc.createRadialGradient(hx, hy, 0, hx, hy, 12); g.addColorStop(0, P.col.glow); g.addColorStop(1, 'rgba(242,183,5,0)'); cc.fillStyle = g; cc.beginPath(); cc.arc(hx, hy, 12, 0, 6.2832); cc.fill(); cc.fillStyle = P.col.glow; cc.beginPath(); cc.arc(hx, hy, 3.2, 0, 6.2832); cc.fill(); }
      cc.restore();
    }
    function draw(ts) {
      if (!c) return; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, W, H); c.fillStyle = P.col.paper; c.fillRect(0, 0, W, H);
      cfg.scene(c, { W: W, H: H, t: ts || 0, p: prog(ts || 0), S: sits, act: multi && cmp ? act : -1, pen: function (pts, s, p, w) { pen(c, pts, s, p == null ? prog(ts || 0) : p, w); }, P: P, anim: ST.anim });
    }
    function need() { return alive && ST.anim && (cfg.live || true); }
    function frame(ts) {
      rid = 0; if (!alive || !document.body.contains(host)) return; draw(ts);
      if (ST.anim && !document.hidden) rid = raf(frame);
    }
    function kick() { if (!c) return; if (rid) { caf(rid); rid = 0; } t0 = (window.performance ? performance.now() : Date.now()); draw(t0); if (ST.anim) rid = raf(frame); }
    function hz() { var s = actif(); return cfg.sound ? cfg.sound(s.v, s) : null; }
    function pack() { var o = {}; Object.keys(val).forEach(function (k) { o[k] = val[k]; }); return o; }
    function changed(user) { sync(); ST.lv[key] = pack(); readouts(); kick(); if (user && cfg.sound) AU.play(hz()); }
    sync(); readouts();
    $$('[data-in]', host).forEach(function (r) { r.addEventListener('input', function () { var id = r.getAttribute('data-in'), d = (cfg.inputs || []).filter(function (x) { return (x.per ? /^\d+\./.test(id) && id.split('.')[1] : id) === x.id; })[0]; val[id] = +r.value; $('[data-o="' + id + '"]', host).textContent = fr(r.value, d.dec || 0) + ' ' + (d.unit || ''); changed(true); }); });
    $$('[data-ch]', host).forEach(function (b) { b.addEventListener('click', function () { var id = b.getAttribute('data-ch'); val[id] = b.getAttribute('data-v'); $$('[data-ch="' + id + '"]', host).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); var d = (cfg.choices || []).filter(function (x) { return x.id === (x.per ? id.split('.')[1] : id); })[0]; if (d && d.num) val[id] = +val[id]; changed(true); }); });
    var bc = $('[data-cmp]', host), be = $('[data-ecoute]', host), br = $('[data-rej]', host);
    function marque() { $$('.grp', host).forEach(function (g) { g.classList.toggle('act-on', cmp && +g.getAttribute('data-g') === act); }); }
    if (bc) bc.onclick = function () { cmp = !cmp; bc.setAttribute('aria-pressed', cmp); act = 0; clearInterval(tmr); if (cmp) tmr = setInterval(function () { act = 1 - act; marque(); readouts(); kick(); if (AU.hold) AU.play(hz()); }, 1900); marque(); readouts(); kick(); };
    if (be) be.onclick = function () { hold = !hold; AU.hold = hold; be.setAttribute('aria-pressed', hold); if (hold) AU.play(hz()); else AU.stop(); };
    if (br) br.onclick = kick;
    var lab = { key: key, stop: function () { alive = false; caf(rid); clearInterval(tmr); if (hold) { AU.hold = false; hold = false; } }, kick: kick, state: function () { return pack(); }, sits: sits };
    ST.labs.push(lab); kick();
    return lab;
  }
  function stopLabs() { ST.labs.forEach(function (l) { l.stop(); }); ST.labs = []; AU.hold = false; AU.stop(); }

  /* ---------- pages ---------- */
  function chaps() { return ST.M.chap; }
  function nbSp() { return chaps().length + 1; }
  function sv() { return ST.sv; }
  function sauve() { ecrit('vv-' + ST.slug, ST.sv); }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function note3(sc, n) { return sc >= n - 1 ? 3 : sc >= Math.ceil(n / 2) ? 2 : 1; }
  function tag(ci, side) { var t = ci < chaps().length ? chaps()[ci].titre : 'Le défi'; return '<div class="tag"><span>Chapitre ' + (ci + 1) + ' · ' + esc(t) + '</span><span>' + esc(ST.niv) + ' · ' + (side === 'g' ? 'lire' : 'manipuler') + '</span></div>'; }
  function pageG(ci) {
    if (ci >= chaps().length) return pageDefiG();
    var h = chaps()[ci], o = tag(ci, 'g');
    o += '<p class="cur">' + h.cur + '</p>' + h.paras.map(function (p) { return '<p class="p">' + p + '</p>'; }).join('');
    if (h.loi) o += '<div class="loi">' + h.loi.t + (h.loi.s ? '<small>' + h.loi.s + '</small>' : '') + '</div>';
    if (h.note) o += '<div class="note">' + h.note + '</div>';
    var p = h.predis; if (p) o += '<div class="pred" data-pred="' + ci + '"><b>Prédis puis révèle</b><p class="p">' + p.q + '</p><div class="opts">' + p.opts.map(function (t, i) { return '<button type="button" data-p="' + i + '" aria-pressed="false">' + t + '</button>'; }).join('') + '</div><div class="rev"><div class="ans" aria-live="polite" data-ans><p class="p"><b>Réponse :</b> ' + p.rep + '</p></div><button type="button" class="langue" data-lg disabled>Choisis, puis soulève la languette</button></div></div>';
    var q = h.verif; if (q) o += '<div class="vq" data-vq="' + ci + '"><span class="q">Vérifie : ' + q.q + '</span><div class="ch">' + q.o.map(function (t, i) { return '<button type="button" data-v="' + i + '">' + t + '</button>'; }).join('') + '</div><p class="ex" data-vx aria-live="polite"></p></div>';
    return o;
  }
  function pageD(ci) {
    if (ci >= chaps().length) return pageDefiD();
    var h = chaps()[ci];
    return tag(ci, 'd') + '<h2 class="ttl">' + esc(h.labTitre || h.titre) + '</h2><div class="lab" data-lab="' + ci + '"></div>';
  }
  function pageDefiG() {
    var n = ST.dm ? ST.dm.length : 6, q = sv().q || [], sc = q.reduce(function (a, b) { return a + b; }, 0), fini = sv().fini;
    return tag(chaps().length, 'g') + '<p class="th">Le défi</p><h2 class="ttl">' + esc(ST.M.defiTitre || 'Relève le défi, seul ou en équipe') + '</h2><p class="p">' + n + ' manches courtes. Une erreur ne retire rien : chaque manche t’explique la réponse.</p>'
      + '<p class="stars" aria-label="' + (fini ? note3(sc, n) : 0) + ' étoiles sur 3">' + stars(fini ? note3(sc, n) : 0) + '</p><p class="p">Manches jouées : ' + q.length + ' sur ' + n + ' · réussies : ' + sc + '.</p>'
      + '<div class="note">Certaines manches utilisent ce que tu as réglé dans le laboratoire. Seul ou à plusieurs, vous pouvez discuter avant de répondre.</div>';
  }
  function pageDefiD() {
    var dm = ST.dm, q = sv().q || [], n = dm.length, i = q.length;
    if (sv().fini || i >= n) { var sc = q.reduce(function (a, b) { return a + b; }, 0), s3 = note3(sc, n); return '<div class="fete" data-fete></div>' + tag(chaps().length, 'd') + '<h2 class="ttl">Défi terminé</h2><p class="stars" aria-label="' + s3 + ' étoiles sur 3">' + stars(s3) + '</p><p class="cur">' + sc + ' manches réussies sur ' + n + '.</p><p class="p">' + (s3 === 3 ? 'Bravo, tu maîtrises cette leçon !' : s3 === 2 ? 'Bien joué : relis les chapitres et retente pour décrocher la troisième étoile.' : 'Premier pas fait : retourne au laboratoire, puis rejoue.') + '</p><button type="button" class="big-go" data-rejoue>Rejouer le défi</button>'; }
    var m = dm[i], o = tag(chaps().length, 'd') + '<div class="manche" data-manche="' + i + '"><p class="th">Manche ' + (i + 1) + ' sur ' + n + '</p><h2>' + m.q + '</h2>';
    if (m.type === 'qcm') o += '<div class="ch" role="group" aria-label="Réponses possibles">' + m.o.map(function (t, k) { return '<button type="button" data-k="' + k + '">' + t + '</button>'; }).join('') + '</div>';
    else if (m.type === 'calcul') o += '<label class="p" for="rep">Ta réponse' + (m.unit ? ' (en ' + esc(m.unit) + ')' : '') + ' :</label><input type="text" id="rep" inputmode="decimal" autocomplete="off"><button type="button" class="big-go" data-val>Valider</button>';
    else if (m.type === 'clic') o += '<svg class="clic" viewBox="0 0 ' + m.w + ' ' + m.h + '" role="group" aria-label="Dessin : choisis une zone">' + m.svg + m.zones.map(function (z) { return '<rect class="z" tabindex="0" role="button" aria-label="' + esc(z.label) + '" data-z="' + z.id + '" x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '"/>'; }).join('') + '</svg>';
    return o + '<div data-mx aria-live="polite"></div></div>';
  }
  function page(ci, side, cls) { return '<div class="page ' + cls + '" data-ci="' + ci + '" data-sd="' + side + '">' + (side === 'g' ? pageG(ci) : pageD(ci)) + '</div>'; }
  function nu(ci, side, cls) { return page(ci, side, cls).replace(/ id="[^"]*"/g, ''); }

  /* ---------- liaisons ---------- */
  function lierPred(root) {
    $$('[data-pred]', root).forEach(function (bl) {
      var ci = +bl.getAttribute('data-pred'), p = chaps()[ci].predis, lg = $('[data-lg]', bl), ans = $('[data-ans]', bl), choix = -1;
      ans.setAttribute('aria-hidden', 'true');
      $$('[data-p]', bl).forEach(function (b) { b.onclick = function () { if (lg.classList.contains('lift')) return; choix = +b.getAttribute('data-p'); $$('[data-p]', bl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); lg.disabled = false; lg.textContent = 'Soulève la languette pour voir la réponse'; }; });
      lg.onclick = function () { if (lg.disabled) return; lg.classList.add('lift'); ans.removeAttribute('aria-hidden'); var bon = choix === p.a; ans.innerHTML = '<p class="p"><b>' + (bon ? 'Bien vu ! ' : 'Surprenant, non ? ') + '</b>' + p.rep + '</p>'; };
    });
    $$('[data-vq]', root).forEach(function (bl) {
      var ci = +bl.getAttribute('data-vq'), q = chaps()[ci].verif, x = $('[data-vx]', bl);
      if (sv().ok && sv().ok[ci]) { $$('[data-v]', bl).forEach(function (b, k) { if (k === q.a) b.classList.add('bon'); }); x.innerHTML = '<b>✓ Réussi.</b> ' + q.e; }
      $$('[data-v]', bl).forEach(function (b) { b.onclick = function () { var k = +b.getAttribute('data-v'); if (k === q.a) { $$('[data-v]', bl).forEach(function (y) { y.classList.remove('nope'); }); b.classList.add('bon'); x.innerHTML = '<b>✓ Exact.</b> ' + q.e; sv().ok = sv().ok || []; sv().ok[ci] = true; sauve(); majNav(); } else { b.classList.add('nope'); x.innerHTML = 'Pas encore : relis le chapitre ou essaie dans le laboratoire, puis réessaie.'; } }; });
    });
  }
  function lierLabs(root) {
    $$('[data-lab]', root).forEach(function (host) { var ci = +host.getAttribute('data-lab'); makeLab(host, chaps()[ci].lab, ci); });
    $$('[data-pop]', root).forEach(function (p) { if (!ST.anim) p.classList.add('up'); else setTimeout(function () { p.classList.add('up'); }, 70); });
  }
  function lierDefi(root) {
    var r = $('[data-manche]', root), q = sv().q || [];
    var rj = $('[data-rejoue]', root); if (rj) rj.onclick = function () { sv().q = []; sv().fini = false; ST.dm = construitDefi(); sauve(); monte(); };
    var f = $('[data-fete]', root); if (f && ST.anim) { var cols = ['#E0A800', '#C2410C', '#1D4FA8', '#17753A', '#B83280'], h = ''; for (var i = 0; i < 26; i++) h += '<i style="left:' + (i * 3.9) + '%;background:' + cols[i % 5] + ';animation-delay:' + ((i * 83) % 900) + 'ms"></i>'; f.innerHTML = h; }
    if (!r) return;
    var m = ST.dm[q.length], zone = $('[data-mx]', r);
    function fin(ok) {
      sv().q = (sv().q || []).concat([ok ? 1 : 0]); var n = ST.dm.length; if (sv().q.length >= n) sv().fini = true; sauve();
      zone.innerHTML = '<p class="ex"><b>' + (ok ? 'Exact.' : 'Pas encore.') + '</b> ' + m.e + '</p><button type="button" class="big-go" data-sv>' + (sv().q.length < n ? 'Manche suivante' : 'Voir mes étoiles') + '</button>';
      var b = $('[data-sv]', zone); b.focus(); b.onclick = function () { monte(); };
    }
    if (m.type === 'qcm') $$('[data-k]', r).forEach(function (b) { b.onclick = function () { var k = +b.getAttribute('data-k'); $$('[data-k]', r).forEach(function (x, j) { x.disabled = true; if (j === m.a) x.classList.add('bon'); else if (j === k) x.classList.add('nope'); }); fin(k === m.a); }; });
    if (m.type === 'calcul') { var vb = $('[data-val]', r), inp = $('#rep', r); vb.onclick = function () { var x = parseFloat(String(inp.value).replace(',', '.').replace('−', '-')); if (isNaN(x)) { zone.innerHTML = '<p class="ex">Écris un nombre.</p>'; return; } inp.disabled = true; vb.disabled = true; fin(Math.abs(x - m.ans) <= (m.tol || 0)); }; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') vb.click(); }); }
    if (m.type === 'clic') $$('.z', r).forEach(function (z) { var go = function () { var id = z.getAttribute('data-z'); $$('.z', r).forEach(function (y) { y.style.pointerEvents = 'none'; }); fin(id === m.a); }; z.onclick = go; z.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
  }
  function construitDefi() {
    var base = (ST.D.quiz || []).slice(0, 5).map(function (q) { return { type: 'qcm', q: q.q, o: q.o, a: q.a, e: q.e || '' }; });
    var ex = ST.M.manches ? ST.M.manches(ST.lv, ST.D) : [];
    var out = base.slice(0, 3).concat(ex.slice(0, 1), base.slice(3), ex.slice(1, 2));
    return out;
  }

  /* ---------- livre : navigation et retournement ---------- */
  function seq() { var s = [], i; for (i = 0; i < nbSp(); i++) { s.push([i, 'g']); s.push([i, 'd']); } return s; }
  function ci() { return ST.mode === 'sgl' && !ST.ens ? seq()[ST.pos][0] : ST.pos; }
  function single() { return ST.mode === 'sgl' || ST.ens; }
  function maxPos() { return (ST.mode === 'sgl' && !ST.ens ? seq().length : nbSp()) - 1; }
  function monte() {
    stopLabs(); var c = ci();
    if (ST.ens) { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(c, 'd', 'S'); }
    else if (ST.mode === 'sgl') { var q = seq()[ST.pos]; $('#sL').innerHTML = ''; $('#sR').innerHTML = page(q[0], q[1], 'S'); }
    else { $('#sL').innerHTML = page(c, 'g', 'L'); $('#sR').innerHTML = page(c, 'd', 'R'); }
    var bk = $('#book'); lierPred(bk); lierLabs(bk); lierDefi(bk); majNav();
  }
  function majNav() {
    var c = ci(); $('#dots').innerHTML = Array.apply(null, Array(nbSp())).map(function (_, i) { var ok = i === chaps().length ? sv().fini : sv().ok && sv().ok[i]; return '<button type="button" data-c="' + i + '" aria-label="' + (i === chaps().length ? 'Défi' : 'Chapitre ' + (i + 1)) + (ok ? ', réussi' : '') + '"' + (c === i ? ' aria-current="step"' : '') + '>' + (i + 1) + (ok ? '✓' : '') + '</button>'; }).join('');
    $('#prev').disabled = ST.pos === 0; $('#next').disabled = ST.pos >= maxPos();
  }
  function aller(t) {
    if (ST.busy || t < 0 || t > maxPos() || t === ST.pos) return;
    var de = ST.pos; if (ST.ens || !ST.anim) { ST.pos = t; sv().pos = t; sauve(); monte(); return; }
    ST.busy = true; stopLabs(); $$('#book .pop').forEach(function (p) { p.classList.remove('up'); });
    setTimeout(function () { tourne(de, t, function () { ST.pos = t; sv().pos = t; sauve(); ST.busy = false; monte(); }); }, 380);
  }
  function tourne(de, vers, fin) {
    var av = vers > de, sh = $('#sheet'), N = 9, w = 480 / N, i, h = '', f, b;
    if (ST.mode !== 'sgl') { f = av ? nu(de, 'd', 'R') : nu(vers, 'd', 'R'); b = av ? nu(vers, 'g', 'L') : nu(de, 'g', 'L'); $('#sL').innerHTML = av ? page(de, 'g', 'L') : page(vers, 'g', 'L'); $('#sR').innerHTML = av ? page(vers, 'd', 'R') : page(de, 'd', 'R'); }
    else { var S = seq(), A = S[de], B = S[vers]; f = av ? nu(A[0], A[1], 'S') : nu(B[0], B[1], 'S'); b = '<div class="page S"></div>'; $('#sR').innerHTML = page(av ? B[0] : A[0], av ? B[1] : A[1], 'S'); }
    function cr(html, k, bk) { return '<div class="fc' + (bk ? ' bk' : '') + '"><div class="in" style="left:' + (bk ? -(N - 1 - k) * w : -k * w) + 'px">' + html + '</div><div class="shade"></div></div>'; }
    for (i = N - 1; i >= 0; i--) h = '<div class="str" style="left:' + (i ? w : 0) + 'px;width:' + (w + 0.6) + 'px">' + cr(f, i) + cr(b, i, true) + h + '</div>';
    sh.innerHTML = h; sh.style.display = 'block'; papier();
    var st = $$('.str', sh), sd = $$('.shade', sh);
    function pose(p) { var th = av ? -180 * p : -180 * (1 - p), bd = 62 * Math.sin(Math.PI * p) * (av ? 1 : -1), pas = 2 * bd / (N - 1); st.forEach(function (e, k) { e.style.transform = 'rotateY(' + (k === 0 ? (th - bd) : pas) + 'deg)'; }); var o = 0.32 * Math.sin(Math.PI * p); sd.forEach(function (e) { e.style.opacity = o; }); }
    pose(0); var t0 = 0;
    (function s(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 850, 1), q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; pose(q); if (p < 1) raf(s); else { sh.style.display = 'none'; sh.innerHTML = ''; fin(); } })(window.performance ? performance.now() : Date.now());
  }
  /* léger bruit de page tournée (Web Audio, niveau très bas) */
  function papier() { if (!ST.son || AU.mute || !AU.ok()) return; try { var a = AU.ctx, n = a.sampleRate * 0.28, bf = a.createBuffer(1, n, a.sampleRate), d = bf.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n); var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'highpass'; fl.frequency.value = 1800; g.gain.value = 0.04; s.buffer = bf; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(); } catch (e) {} }

  /* ---------- barre, échelle, mode enseignant ---------- */
  function ajuste() {
    var W = window.innerWidth, old = ST.mode; ST.mode = W < 600 ? 'sgl' : 'dbl';
    var B = document.body, one = single(); B.classList.toggle('sgl', one); B.classList.toggle('anim', ST.anim); B.classList.toggle('ens', ST.ens);
    document.documentElement.style.setProperty('--tilt', one ? '0deg' : '9deg');
    var f = $('#fit'), s = $('#scale'), bw = one ? (ST.ens ? 990 : 510) : 1000, bh = ST.ens ? 840 : 905, k = Math.min(f.clientWidth / bw, f.clientHeight / bh) || 0.5, H = 840;
    if (ST.mode === 'sgl' && !ST.ens && f.clientWidth > 0 && f.clientHeight > 0) { H = Math.max(840, Math.min(1100, Math.round(480 * f.clientHeight / f.clientWidth))); k = Math.min(f.clientWidth / 480, f.clientHeight / H); }
    document.documentElement.style.setProperty('--bh', H + 'px');
    s.style.width = (one && !ST.ens ? 480 : 960) + 'px'; s.style.height = H + 'px'; s.style.transform = 'scale(' + k + ')';
    $('#prev').textContent = one && ST.mode === 'sgl' ? '←' : '← Précédent'; $('#next').textContent = one && ST.mode === 'sgl' ? '→' : 'Suivant →';
    pose(); return old !== ST.mode;
  }
  function pose() { var at = $('.cv-atom'); if (at && at.pauseAnimations) { if (ST.anim) at.unpauseAnimations(); else at.pauseAnimations(); } var c = ST.mode === 'sgl', s = $('#bSon'); s.textContent = ST.son ? 'Son' : 'Muet'; s.setAttribute('aria-pressed', ST.son); $('#bAnim').textContent = ST.anim ? (c ? 'Anim.' : 'Animations') : (c ? 'Figé' : 'Animations arrêtées'); $('#bAnim').setAttribute('aria-pressed', ST.anim); }
  function ens(on) {
    if (!ST.M || on === ST.ens) return; var c = ci(); ST.ens = on; $('#bEns').setAttribute('aria-pressed', on); $('#ensOut').hidden = !on;
    ST.pos = on ? c : (ST.mode === 'sgl' ? c * 2 : c); ajuste(); monte();
  }

  /* ---------- sommaire ---------- */
  function themesDe(n) { return (window.PROGRAMME && window.PROGRAMME[n]) || []; }
  function sommaire() {
    document.body.classList.add('somm'); $('#fit').hidden = true; var S = $('#somm'); S.hidden = false;
    var h = '<h1>Livre vivant de physique-chimie</h1><p class="lead">Choisis ta classe, puis une leçon : un modèle se dresse sur la page, tu le manipules, tu l’écoutes, puis tu relèves le défi.</p><div class="niv" role="tablist" aria-label="Classe">' + NIVEAUX.map(function (n) { return '<button type="button" role="tab" data-n="' + n + '" aria-selected="' + (n === ST.niv) + '">' + n + '</button>'; }).join('') + '</div>';
    themesDe(ST.niv).forEach(function (t) { h += '<h2>' + esc(t.nm) + '</h2><div class="les">' + t.les.map(function (l) { var s = lit('vv-' + l.slug), ok = V.mods[l.slug]; return ok ? '<a href="?l=' + l.slug + '"><span>' + esc(l.t) + '</span><small' + (s && s.fini ? ' class="ok"' : '') + '>' + (s && s.fini ? 'Terminé' : s ? 'En cours' : 'Ouvrir') + '</small></a>' : '<span class="off"><span>' + esc(l.t) + '</span><small>en préparation</small></span>'; }).join('') + '</div>'; });
    S.innerHTML = h;
    $$('.niv button', S).forEach(function (b) { b.onclick = function () { ST.niv = b.getAttribute('data-n'); try { localStorage.setItem('vv-niveau', ST.niv); } catch (e) {} sommaire(); var t = $('.niv button[aria-selected="true"]'); if (t) t.focus(); }; });
  }

  /* ---------- chargement des données Studio d'une leçon ---------- */
  function charger(fin) {
    var L = null; if (!window.Studio) window.Studio = { s: function () { return {}; }, attr: function () {}, fmt: function (x) { return x; }, kit: {} };
    window.Studio.start = function (c) { L = c; }; window.__momentsCapture = function (c) { L = c; };
    var files = [].concat(ST.th.kit ? [ST.th.kit] : []).map(function (k) { return '../assets/studio/kits/' + k + '.js'; }).concat('../assets/studio/lecons/' + ST.slug + '.js');
    (function next(i) {
      if (i >= files.length) { ST.D = L; fin(L && L.quiz && L.quiz.length ? null : new Error('données')); return; }
      var sc = document.createElement('script'); sc.src = files[i]; sc.onload = function () { next(i + 1); }; sc.onerror = function () { fin(new Error('chargement')); }; document.body.appendChild(sc);
    })(0);
  }
  function cherche(slug) { var r = null; NIVEAUX.forEach(function (n) { themesDe(n).forEach(function (t) { t.les.forEach(function (l) { if (l.slug === slug) r = { niv: n, les: t, l: l }; }); }); }); return r; }

  /* ---------- page de couverture ---------- */
  function cover() {
    var C = $('#couv'); if (!C) return;
    var url = /[?&]l=([a-z0-9-]+)/.exec(location.search), vu = false;
    try { vu = sessionStorage.getItem('vv-couv') === '1'; } catch (e) {}
    if (url || vu) { C.hidden = true; return; }
    document.body.classList.add('avec-couv'); var b = $('#couvGo', C);
    function ouvre(n) { if (typeof n === 'string' && NIVEAUX.indexOf(n) >= 0) { ST.niv = n; try { localStorage.setItem('vv-niveau', n); } catch (e) {} sommaire(); } try { sessionStorage.setItem('vv-couv', '1'); } catch (e) {} C.classList.add('ouvre'); document.body.classList.remove('avec-couv'); setTimeout(function () { C.hidden = true; var t = $('.niv button[aria-selected="true"]'); if (t) t.focus(); }, ST.anim ? 1100 : 0); }
    b.onclick = function () { ouvre(); }; $$('.cv-lv button', C).forEach(function (x) { x.onclick = function () { ouvre(x.getAttribute('data-n')); }; }); b.focus();
    document.addEventListener('keydown', function (e) { if (!C.hidden && !C.classList.contains('ouvre') && e.key === 'Escape') ouvre(); });
  }
  function init() {
    if (!$('#book')) return;
    P.theme();
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} P.theme(); ST.labs.forEach(function (l) { l.kick(); }); };
    $('#bMore').onclick = function () { var b = $('#bar'), o = !b.classList.contains('more'); b.classList.toggle('more', o); this.setAttribute('aria-expanded', o); ajuste(); };
    cover();
    $('#bSon').onclick = function () { ST.son = !ST.son; AU.silence(!ST.son); if (!ST.son) AU.stop(); pose(); };
    $('#bAnim').onclick = function () { ST.anim = !ST.anim; pose(); ajuste(); if (!ST.anim) $$('.pop').forEach(function (p) { p.classList.add('up'); }); ST.labs.forEach(function (l) { l.kick(); }); };
    $('#bEns').onclick = function () { ens(!ST.ens); }; $('#ensOut').onclick = function () { ens(false); };
    var url = (/[?&]l=([a-z0-9-]+)/.exec(location.search) || [])[1] || '', f = url ? cherche(url) : null;
    try { var n0 = localStorage.getItem('vv-niveau'); if (NIVEAUX.indexOf(n0) >= 0) ST.niv = n0; } catch (e) {}
    pose(); ajuste();
    if (!f || !V.mods[url]) { if (f) ST.niv = f.niv; sommaire(); var to0; window.addEventListener('resize', function () { clearTimeout(to0); to0 = setTimeout(ajuste, 120); }); return; }
    ST.niv = f.niv; ST.slug = url; ST.th = f.les; ST.les = f.l; ST.M = V.mods[url];
    $('#fit').hidden = false; document.title = f.l.t + ' · Livre vivant · NOHOBA-Lab';
    $('#sR').innerHTML = '<div class="page S"><p class="cur">Ouverture de la leçon…</p></div>';
    charger(function (err) {
      if (err) { $('#sR').innerHTML = '<div class="page S"><h2 class="ttl">Leçon indisponible</h2><p class="p">Impossible de charger cette leçon.</p><a class="big-go" href="./">Retour au sommaire</a></div>'; return; }
      var s = lit('vv-' + ST.slug); ST.sv = s && Array.isArray(s.q) ? s : { q: [], fini: false, ok: [], pos: 0 };
      ST.dm = construitDefi(); ajuste(); ST.pos = Math.min(ST.mode === 'sgl' ? nbSp() * 2 - 1 : nbSp() - 1, Math.max(0, (ST.sv.pos | 0))); if (ST.mode === 'sgl' && ST.pos < 0) ST.pos = 0;
      monte();
    });
    $('#prev').onclick = function () { aller(ST.pos - 1); }; $('#next').onclick = function () { aller(ST.pos + 1); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var c = +b.getAttribute('data-c'); if (ST.ens) { if (c !== ST.pos) { ST.pos = c; monte(); } } else aller(ST.mode === 'sgl' ? c * 2 : c); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ST.ens) { ens(false); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !ST.M) return;
      if (e.key === 'ArrowRight') aller(ST.pos + 1); if (e.key === 'ArrowLeft') aller(ST.pos - 1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|BUTTON|A|CANVAS/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) aller(ST.pos + (d < 0 ? 1 : -1)); x0 = null; }, { passive: true });
    var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var c = ci(), ch = ajuste(); ajuste(); if (ch) { ST.pos = ST.mode === 'sgl' ? c * 2 : c; monte(); } }, 120); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) AU.stop(); else ST.labs.forEach(function (l) { l.kick(); }); });
  }
  V.init = init;
  V.etat = function () { return ST; };
})();
