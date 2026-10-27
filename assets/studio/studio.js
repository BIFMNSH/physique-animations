/* Studio : moteur commun des leçons premium (résumé vidéo narré, simulation, défi, quiz)
   Physique-chimie en animations — aucun réseau requis, réglages gardés sur l'appareil. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- utilitaires DOM ---------- */
  function h(tag, attrs, parent, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (attrs[k] == null) continue; if (k === 'class') e.className = attrs[k]; else if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag), st = '';
    if (attrs) for (var k in attrs) {
      var v = attrs[k]; if (v == null) continue;
      if (k === 'text') { e.textContent = v; continue; }
      if ((k === 'fill' || k === 'stroke' || k === 'stop-color') && String(v).indexOf('var(') === 0) { st += k + ':' + v + ';'; continue; }
      e.setAttribute(k, v);
    }
    if (st) e.style.cssText += st;
    if (parent) parent.appendChild(e);
    return e;
  }
  function attr(e, o) { for (var k in o) { var v = o[k]; if ((k === 'fill' || k === 'stroke') && String(v).indexOf('var(') === 0) e.style[k] = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v); } return e; }
  function fmt(x, d) { if (x == null || isNaN(x)) return '—'; d = d == null ? 1 : d; return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ','); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(k) { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function store(key, def) { try { var v = JSON.parse(localStorage.getItem(key)); return v && typeof v === 'object' ? Object.assign({}, def, v) : Object.assign({}, def); } catch (e) { return Object.assign({}, def); } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  var ICON = {
    gear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>',
    pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    prev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',
    next: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',
    voice: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>',
    mute: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4zM16 9l5 6M21 9l-5 6"/></svg>',
    fs: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4"/></svg>',
    lens: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg>',
    hand: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7s-5-2-6.5-5L3 12a1.5 1.5 0 0 1 2.5-1.5L8 13"/></svg>',
    spot: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
    pen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z"/></svg>',
    freeze: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 2v20M3 7l18 10M21 7L3 17"/></svg>'
  };

  /* ---------- réglages (gardés sur l'appareil) ---------- */
  var SET = store('pc-studio', { fs: 1, speed: 1, theme: null, cvd: false, proj: false, tts: false, hints: true, sound: true, sub: 22, voice: true });
  if (!SET.theme) { try { SET.theme = localStorage.getItem('pc-theme') || 'dark'; } catch (e) { SET.theme = 'dark'; } }
  /* Sur téléphone, fond clair par défaut (meilleure lisibilité) tant que l’élève n’a pas choisi lui-même un thème. */
  try { if (!SET.themeSet && window.matchMedia && window.matchMedia('(max-width:700px)').matches) SET.theme = 'light'; } catch (e) {}
  var PROF = store('pc-studio-prof', { on: false, steps: { resume: true, sim: true, defi: true, quiz: true }, level: 'std', hideRes: false, corr: false, time: 60, timed: false, nTeams: 4, teams: ['Baobab', 'Lagune', 'Fromager', 'Savane', 'Iroko', 'Lagon'], board: true });
  var PROG = store('pc-studio-prog', {});
  var TEAMC = ['#FFB547', '#5CC8FF', '#3DD68C', '#C4B5FD', '#FF7A7A', '#F0E442'];
  var listeners = [];
  function applySettings() {
    var r = document.documentElement;
    r.setAttribute('data-theme', SET.theme === 'light' ? 'light' : 'dark');
    if (SET.theme === 'contrast') r.setAttribute('data-contrast', 'on'); else r.removeAttribute('data-contrast');
    if (SET.cvd) r.setAttribute('data-cvd', 'on'); else r.removeAttribute('data-cvd');
    r.style.setProperty('--fs', SET.fs);
    r.style.setProperty('--sub', SET.sub + 'px');
    try { localStorage.setItem('pc-theme', SET.theme === 'light' ? 'light' : 'dark'); } catch (e) {}
    save('pc-studio', SET);
    listeners.forEach(function (f) { f(SET); });
  }
  function onSettings(f) { listeners.push(f); }

  /* ---------- horloge commune ---------- */
  var loops = [], frozen = false, last = performance.now(), T = 0;
  function loop(f) { loops.push(f); return function () { loops = loops.filter(function (g) { return g !== f; }); }; }
  (function tick(now) {
    var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    if (!frozen && !document.hidden) { T += dt; for (var i = 0; i < loops.length; i++) loops[i](dt, T); }
    requestAnimationFrame(tick);
  })(last);

  /* ---------- voix (synthèse vocale de l'appareil) ---------- */
  var synth = window.speechSynthesis || null, voiceFr = null;
  function pickVoice() {
    if (!synth) return;
    var vs = synth.getVoices().filter(function (v) { return /^fr/i.test(v.lang); });
    vs.sort(function (a, b) { function sc(v) { return (/fr-FR/i.test(v.lang) ? 2 : 0) + (/google|natural|neural|premium|enhanced|amélie|audrey|thomas/i.test(v.name) ? 3 : 0) + (v.localService ? 1 : 0); } return sc(b) - sc(a); });
    voiceFr = vs[0] || null;
  }
  if (synth) { pickVoice(); if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice; }
  function speak(text, rate, onend) {
    if (!synth) { if (onend) setTimeout(onend, 10); return null; }
    var busy = synth.speaking || synth.pending;
    if (busy) synth.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ''));
    u.lang = 'fr-FR'; if (voiceFr) u.voice = voiceFr;
    u.rate = clamp(rate || 1, 0.6, 1.6); u.pitch = 1.02;
    var done = false, stopped = false; function fin() { if (!done) { done = true; onend && onend(); } }
    u.onend = fin; u.onerror = function (e) { if (e && e.error === 'not-allowed') vocalOk = false; fin(); };
    // garde-fou : certaines voix n'envoient jamais « fin »
    var guard = setTimeout(fin, 1500 + text.length * 95 / u.rate);
    u.addEventListener('end', function () { clearTimeout(guard); });
    if (busy) setTimeout(function () { if (!stopped) synth.speak(u); }, 80); else synth.speak(u);
    return { stop: function () { done = true; stopped = true; clearTimeout(guard); synth.cancel(); } };
  }
  function hush() { if (synth) synth.cancel(); }
  /* Sur téléphone (iOS, Android), la synthèse vocale ne parle que si elle a été « réveillée » par un geste de l'élève :
     la lecture automatique du résumé (lancée par la boucle d'animation) restait muette. On la réveille au premier toucher,
     avec une phrase vide, puis à chaque appui sur Lecture. */
  var vocalOk = false;
  function wakeVoice() {
    if (!synth) return;
    try {
      var u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'fr-FR';
      synth.speak(u); if (synth.paused) synth.resume(); vocalOk = true;
    } catch (e) {}
  }
  ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function once() { if (!vocalOk) wakeVoice(); }, { passive: true, capture: true }); });

  /* ---------- sons ---------- */
  var actx = null;
  function sound(kind) {
    if (!SET.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var seq = { ok: [[660, 0], [880, 0.09], [1175, 0.18]], bad: [[220, 0], [180, 0.12]], tick: [[1200, 0]], win: [[523, 0], [659, 0.12], [784, 0.24], [1046, 0.36]], pop: [[900, 0]] }[kind] || [[600, 0]];
      seq.forEach(function (n) {
        var o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + n[1];
        o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(kind === 'tick' ? 0.05 : 0.14, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + (kind === 'tick' ? 0.05 : 0.22));
        o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + 0.25);
      });
    } catch (e) {}
  }

  /* ---------- confettis ---------- */
  function confetti(stage) {
    var c = h('canvas', { class: 'overlay', width: 1280, height: 720, style: 'width:100%;height:100%' }, stage), g = c.getContext('2d'), P = [];
    var cols = ['#FFB547', '#5CC8FF', '#3DD68C', '#C4B5FD', '#FF7A7A', '#FFFFFF'];
    for (var i = 0; i < 160; i++) P.push({ x: 640 + gauss() * 80, y: 300, vx: gauss() * 420, vy: -300 - Math.random() * 520, r: 4 + Math.random() * 6, a: Math.random() * 6, va: gauss() * 8, c: cols[i % cols.length] });
    var t = 0, stop = loop(function (dt) {
      t += dt; g.clearRect(0, 0, 1280, 720);
      P.forEach(function (p) { p.vy += 900 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore(); });
      if (t > 2.6) { stop(); c.remove(); }
    });
  }

  /* ---------- Lumi, la mascotte ---------- */
  function lumi(size, mood) {
    var mouth = mood === 'wow' ? '<ellipse cx="48" cy="78" rx="7" ry="6" fill="#141C2E"/>' : mood === 'sad' ? '<path d="M39 81 Q48 73 57 81" stroke="#141C2E" stroke-width="3" fill="none" stroke-linecap="round"/>' : mood === 'think' ? '<path d="M41 79 H55" stroke="#141C2E" stroke-width="3" stroke-linecap="round"/>' : '<path d="M39 75 Q48 85 57 75" stroke="#141C2E" stroke-width="3" fill="none" stroke-linecap="round"/>';
    var eyes = mood === 'happy2' ? '<path d="M33 62 q6 -6 12 0M51 62 q6 -6 12 0" stroke="#141C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<g class="eye"><circle cx="39" cy="62" r="6" fill="#141C2E"/><circle cx="41" cy="60" r="2" fill="#fff"/></g><g class="eye"><circle cx="57" cy="62" r="6" fill="#141C2E"/><circle cx="59" cy="60" r="2" fill="#fff"/></g>';
    return '<svg class="lumi' + (mood === 'wow' ? ' wow' : '') + '" width="' + size + '" height="' + Math.round(size * 1.15) + '" viewBox="0 0 96 110" role="img" aria-label="Lumi, l’étincelle qui guide"><g class="bob"><circle cx="48" cy="58" r="44" fill="#FFB547" opacity="0.14"/><path d="M48 10 C70 30 82 48 78 70 C74 92 58 102 48 102 C38 102 22 92 18 70 C14 48 26 30 48 10Z" fill="#FFB547"/><path d="M48 25 C62 40 68 52 66 68 C64 82 56 90 48 90 C40 90 32 82 30 68 C28 52 34 40 48 25Z" fill="#FFD28A"/>' + eyes + mouth + '</g></svg>';
  }

  /* ---------- zoom, déplacement, loupe et mini-carte d'une scène SVG ---------- */
  function zoomable(box, svg, W, H, rootG, panels) {
    var z = 1, cx = W / 2, cy = H / 2, panMode = false, lensOn = false, bx = 0, by = 0, bw = W, bh = H;
    var tools = h('div', { class: 'ztools', role: 'toolbar', 'aria-label': 'Zoom' }, box);
    var bL = h('button', { 'aria-label': 'Loupe ×3', 'aria-pressed': 'false', title: 'Loupe ×3' }, tools, ICON.lens);
    var bH = h('button', { 'aria-label': 'Déplacer la vue', 'aria-pressed': 'false', title: 'Déplacer la vue' }, tools, ICON.hand);
    var bP = h('button', { 'aria-label': 'Zoomer', title: 'Zoomer' }, tools, '+');
    var zv = h('span', { class: 'zv', 'aria-live': 'polite' }, tools, '100 %');
    var bM = h('button', { 'aria-label': 'Dézoomer', title: 'Dézoomer' }, tools, '−');
    var bF = h('button', { class: 'fit', title: 'Vue entière' }, tools, 'Ajuster');
    /* téléphone en portrait : la scène passe en plein écran, tournée en paysage, pour que les étiquettes deviennent lisibles */
    var bBig = h('button', { class: 'bigbtn', type: 'button', 'aria-label': 'Agrandir la simulation', 'aria-pressed': 'false' }, tools, 'Agrandir');
    function bigOff() { box.classList.remove('big'); document.documentElement.classList.remove('has-big'); bBig.textContent = 'Agrandir'; bBig.setAttribute('aria-pressed', 'false'); bBig.setAttribute('aria-label', 'Agrandir la simulation'); }
    bBig.onclick = function () {
      if (box.classList.contains('big')) { bigOff(); setTimeout(function () { box.dispatchEvent(new Event('panelsync')); }, 30); return; }
      box.classList.add('big'); document.documentElement.classList.add('has-big');
      bBig.textContent = 'Réduire'; bBig.setAttribute('aria-pressed', 'true'); bBig.setAttribute('aria-label', 'Réduire la simulation'); setTimeout(function () { box.dispatchEvent(new Event('panelsync')); }, 30);
    };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('big')) bigOff(); });
    var mm = h('div', { class: 'minimap', 'aria-hidden': 'true' }, box);
    var msv = s('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMid meet' }, mm);
    var uid = 'z' + Math.random().toString(36).slice(2, 7);
    rootG.setAttribute('id', uid);
    s('use', { href: '#' + uid }, msv);
    var mr = s('rect', { fill: 'none', stroke: '#FFB547', 'stroke-width': W / 120, rx: 8 }, msv);
    // loupe
    var defs = s('defs', {}, svg), cp = s('clipPath', { id: uid + 'c' }, defs), cc = s('circle', { r: 78 }, cp);
    var lens = s('g', { class: 'lens', style: 'display:none' }, svg);
    var lensIn = s('g', { 'clip-path': 'url(#' + uid + 'c)' }, lens);
    s('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: 'var(--scene)' }, lensIn);
    var lu = s('use', { href: '#' + uid }, lensIn);
    var lring = s('circle', { r: 78, fill: 'none', stroke: '#FFB547', 'stroke-width': 4 }, lens);
    var ltag = s('text', { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#FFB547', text: '×3' }, lens);
    function apply() {
      z = clamp(z, 1, 4); var w = bw / z, hh = bh / z;
      cx = clamp(cx, bx + w / 2, bx + bw - w / 2); cy = clamp(cy, by + hh / 2, by + bh - hh / 2);
      svg.setAttribute('viewBox', (cx - w / 2) + ' ' + (cy - hh / 2) + ' ' + w + ' ' + hh);
      zv.textContent = Math.round(z * 100) + ' %';
      mr.setAttribute('x', cx - w / 2); mr.setAttribute('y', cy - hh / 2); mr.setAttribute('width', w); mr.setAttribute('height', hh);
      mm.classList.toggle('on', z > 1.01);
    }
    function pt(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
    function zoomAt(f, px, py) { var nz = clamp(z * f, 1, 4); if (px != null) { cx = px - (px - cx) * z / nz; cy = py - (py - cy) * z / nz; } z = nz; apply(); }
    bP.onclick = function () { zoomAt(1.25); }; bM.onclick = function () { zoomAt(0.8); };
    bF.onclick = function () { z = 1; cx = bx + bw / 2; cy = by + bh / 2; apply(); };
    bH.onclick = function () { panMode = !panMode; bH.setAttribute('aria-pressed', panMode); svg.style.cursor = panMode ? 'grab' : ''; };
    bL.onclick = function () { lensOn = !lensOn; bL.setAttribute('aria-pressed', lensOn); lens.style.display = 'none'; };
    box.addEventListener('wheel', function (e) { if (!e.ctrlKey && !e.altKey && z === 1 && Math.abs(e.deltaY) < 30) return; e.preventDefault(); var p = pt(e); zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, p.x, p.y); }, { passive: false });
    // pincer (2 doigts) et déplacer
    var ptrs = {}, pinch = null, drag = null;
    svg.addEventListener('pointerdown', function (e) {
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: z }; e.stopPropagation(); }
      else if (panMode || e.button === 1) { drag = { x: e.clientX, y: e.clientY, cx: cx, cy: cy }; try { svg.setPointerCapture(e.pointerId); } catch (_) {} svg.style.cursor = 'grabbing'; e.stopPropagation(); e.preventDefault(); }
    }, true);
    svg.addEventListener('pointermove', function (e) {
      if (ptrs[e.pointerId]) ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (pinch && ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; z = pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d; apply(); }
      else if (drag) { var r = svg.getBoundingClientRect(), k = (bw / z) / r.width; cx = drag.cx - (e.clientX - drag.x) * k; cy = drag.cy - (e.clientY - drag.y) * k; apply(); }
      if (lensOn) {
        var p = pt(e), M = 3;
        lens.style.display = '';
        cc.setAttribute('cx', p.x); cc.setAttribute('cy', p.y); lring.setAttribute('cx', p.x); lring.setAttribute('cy', p.y);
        var rr = 78 / Math.sqrt(z); cc.setAttribute('r', rr); lring.setAttribute('r', rr); lring.setAttribute('stroke-width', 4 / z);
        ltag.setAttribute('x', p.x); ltag.setAttribute('y', p.y - rr - 6 / z); ltag.setAttribute('font-size', 14 / z);
        lu.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') scale(' + M + ') translate(' + (-p.x) + ' ' + (-p.y) + ')');
      }
    });
    function up(e) { delete ptrs[e.pointerId]; if (Object.keys(ptrs).length < 2) pinch = null; if (drag) { drag = null; svg.style.cursor = panMode ? 'grab' : ''; } }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('pointerleave', function () { if (lensOn) lens.style.display = 'none'; });
    mm.addEventListener('pointerdown', function (e) { var r = mm.getBoundingClientRect(); cx = (e.clientX - r.left) / r.width * W; cy = (e.clientY - r.top) / r.height * H; apply(); });
    apply();
    /* vue par panneau (téléphone en portrait) : la scène est recadrée sur une zone à la fois (montage, schéma, fiche…)
       pour que les étiquettes restent lisibles ; le dessin d'origine n'est pas modifié et le rendu ordinateur non plus. */
    var panNav = null, panB = [], panCur = 0, panOn = false;
    if (panels && panels.length > 1) {
      panNav = h('nav', { class: 'panels', 'aria-label': 'Parties de la scène' }, box);
      panels.forEach(function (P, i) { var b = h('button', { type: 'button', 'aria-pressed': i === 0 }, panNav, esc(P.n)); b.onclick = function () { panCur = i; syncPanel(true); }; panB.push(b); });
    }
    function syncPanel(force) {
      if (!panNav) return;
      var app = box.closest && box.closest('.app'), want = !!(app && app.classList.contains('portrait')) && !box.classList.contains('big');
      if (want === panOn && !force) return;
      panOn = want;
      panB.forEach(function (b, i) { b.setAttribute('aria-pressed', i === panCur); });
      var r = want ? panels[panCur].r : [0, 0, W, H];
      bx = r[0]; by = r[1]; bw = r[2]; bh = r[3]; z = 1; cx = bx + bw / 2; cy = by + bh / 2;
      svg.style.height = want ? 'auto' : ''; svg.style.minHeight = want ? '0' : '';
      apply();
    }
    function syncSoon() { requestAnimationFrame(function () { syncPanel(); }); }
    if (panNav) { box.addEventListener('panelsync', function () { syncPanel(true); }); window.addEventListener('resize', syncSoon); setTimeout(syncPanel, 0); setTimeout(syncPanel, 500); }
    return { reset: function () { bF.onclick(); }, tools: tools, sync: syncSoon, get z() { return z; } };
  }

  /* ---------- petit graphique SVG ---------- */
  function chart(el, o) {
    el.innerHTML = '';
    var W = 300, H = 190, L = 44, R = 10, Tt = 12, B = 36, w = W - L - R, hh = H - Tt - B;
    var sv = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img', 'aria-label': o.ylabel + ' en fonction de ' + o.xlabel }, el);
    function X(x) { return L + (x - o.xmin) / (o.xmax - o.xmin) * w; } function Y(y) { return Tt + hh - (y - o.ymin) / (o.ymax - o.ymin) * hh; }
    for (var x = o.xmin; x <= o.xmax + 1e-9; x += o.xstep) { s('line', { x1: X(x), x2: X(x), y1: Tt, y2: Tt + hh, stroke: 'var(--line)', 'stroke-width': 1 }, sv); s('text', { x: X(x), y: Tt + hh + 14, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--muted)', text: fmt(x, 0) }, sv); }
    for (var y = o.ymin; y <= o.ymax + 1e-9; y += o.ystep) { s('line', { x1: L, x2: L + w, y1: Y(y), y2: Y(y), stroke: 'var(--line)', 'stroke-width': 1 }, sv); s('text', { x: L - 6, y: Y(y) + 3, 'text-anchor': 'end', 'font-size': 10, fill: 'var(--muted)', text: fmt(y, 0) }, sv); }
    s('text', { x: L + w / 2, y: H - 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--text)', text: o.xlabel }, sv);
    s('text', { x: 12, y: Tt + hh / 2, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: 'var(--text)', transform: 'rotate(-90 12 ' + (Tt + hh / 2) + ')', text: o.ylabel }, sv);
    var out = [];
    (o.series || []).forEach(function (se) {
      var p = se.pts || [];
      if (se.fit && p.length >= 2) { var sxy = 0, sxx = 0; p.forEach(function (q) { sxy += q[0] * q[1]; sxx += q[0] * q[0]; }); var a = sxy / sxx; out.push(a); s('line', { x1: X(o.xmin), y1: Y(a * o.xmin), x2: X(o.xmax), y2: Y(clamp(a * o.xmax, o.ymin, o.ymax * 1.2)), stroke: se.color, 'stroke-width': 2, 'stroke-dasharray': '6 5', 'clip-path': null }, sv); } else out.push(null);
      p.forEach(function (q) { s('circle', { cx: X(q[0]), cy: Y(q[1]), r: 4.5, fill: se.color, stroke: 'var(--panel)', 'stroke-width': 1.5 }, sv); });
    });
    return out;
  }

  /* ---------- commandes ---------- */
  function controls(parent) {
    var api = {
      slider: function (o) {
        var r = h('div', { class: 'row' }, parent), id = 'r' + Math.random().toString(36).slice(2, 7);
        var lb = h('label', { class: 'lb', for: id }, r, '<span>' + o.label + '</span><output></output>');
        var inp = h('input', { type: 'range', id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value }, r);
        var out = lb.querySelector('output');
        function show() { out.textContent = o.fmt ? o.fmt(+inp.value) : fmt(+inp.value, o.dec || 0) + (o.unit ? ' ' + o.unit : ''); }
        inp.addEventListener('input', function () { show(); o.onInput && o.onInput(+inp.value); }); show();
        return { get: function () { return +inp.value; }, set: function (v, fire) { inp.value = v; show(); if (fire && o.onInput) o.onInput(+inp.value); }, row: r, el: inp, hide: function (b) { r.style.display = b ? 'none' : ''; } };
      },
      seg: function (o) {
        var r = h('div', { class: 'row' }, parent); if (o.label) h('div', { class: 'lb' }, r, '<span>' + o.label + '</span>');
        var g = h('div', { class: 'seg', role: 'group', 'aria-label': o.label || '' }, r), val = o.value;
        var bs = o.options.map(function (op) { var b = h('button', { type: 'button' }, g, esc(op.l)); b.onclick = function () { val = op.v; paint(); o.onChange && o.onChange(val); }; return b; });
        function paint() { bs.forEach(function (b, i) { b.setAttribute('aria-pressed', o.options[i].v === val); }); } paint();
        return { get: function () { return val; }, set: function (v, fire) { val = v; paint(); if (fire && o.onChange) o.onChange(v); }, row: r, hide: function (b) { r.style.display = b ? 'none' : ''; } };
      },
      toggle: function (o) {
        var r = h('div', { class: 'tgl' }, parent, '<span>' + o.label + '</span>'), b = h('button', { type: 'button' }, r), v = !!o.value;
        function paint() { b.setAttribute('aria-pressed', v); b.textContent = v ? 'Oui' : 'Non'; } paint();
        b.onclick = function () { v = !v; paint(); o.onChange && o.onChange(v); };
        return { get: function () { return v; }, set: function (x, fire) { v = !!x; paint(); if (fire && o.onChange) o.onChange(v); }, row: r, hide: function (x) { r.style.display = x ? 'none' : ''; } };
      },
      button: function (o) { var b = h('button', { type: 'button', class: 'btn' + (o.primary ? ' primary' : '') + (o.sm ? ' sm' : '') }, o.into || parent, esc(o.label)); b.onclick = function () { o.onClick && o.onClick(); }; return b; },
      row: function () { return h('div', { style: 'display:flex;flex-wrap:wrap;gap:8px' }, parent); }
    };
    return api;
  }

  /* leçon suivante dans la progression du niveau (PROGRAMME) */
  function nextLesson(L) {
    var P = window.PROGRAMME && window.PROGRAMME[L.level]; if (!P) return null;
    var list = []; P.forEach(function (t) { t.les.forEach(function (x) { list.push(x); }); });
    var slug = String(L.id).replace(L.level + '-', ''), i = -1; list.forEach(function (x, k) { if (x.slug === slug) i = k; });
    for (var k = i + 1; k < list.length; k++) if (list[k].ready) return { t: list[k].t, href: '../lecon/?l=' + list[k].slug };
    return { t: '', href: L.back || '../', done: true };
  }
  /* ---------- quiz ---------- */
  /* fenêtre modale accessible : focus placé et contenu, Échap pour fermer, focus rendu au déclencheur */
  function trapModal(m, onClose) {
    var prev = document.activeElement;
    function items() { return Array.prototype.filter.call(m.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; }); }
    function key(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      var it = items(); if (!it.length) return;
      var f = it[0], l = it[it.length - 1];
      if (e.shiftKey && (document.activeElement === f || !m.contains(document.activeElement))) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && (document.activeElement === l || !m.contains(document.activeElement))) { e.preventDefault(); f.focus(); }
    }
    document.addEventListener('keydown', key, true);
    setTimeout(function () { var it = items(); if (it.length && !m.contains(document.activeElement)) it[0].focus(); }, 0);
    return { release: function () { document.removeEventListener('keydown', key, true); try { if (prev && prev.focus) prev.focus(); } catch (e) {} }, focusFirst: function () { var it = items(); if (it.length) it[0].focus(); } };
  }
  var printTeacher = false;
  function printSheet(teacher) { printTeacher = teacher === true; try { window.print(); } finally { printTeacher = false; } }
  function shuf(q) {
    if (q._s) return q._s;
    var idx = q.o.map(function (_, k) { return k; }), r = [];
    while (idx.length) r.push(idx.splice(Math.floor(Math.random() * idx.length), 1)[0]);
    var c = {}; for (var k in q) c[k] = q[k];
    c.o = r.map(function (k) { return q.o[k]; }); c.a = r.indexOf(q.a);
    return c;
  }
  function quiz(stage, qs, title, onDone, next, onClose) {
    var m = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Quiz' }, stage), i = 0, score = 0, closed = false;
    function close() { if (closed) return; closed = true; m.remove(); a11y.release(); onClose && onClose(); }
    var a11y = trapModal(m, close);
    var box = h('div', { class: 'box' }, m);
    function show() {
      if (i >= qs.length) {
        var ok = score >= Math.ceil(qs.length * 0.8);
        box.innerHTML = '<div style="display:flex;gap:16px;align-items:center">' + lumi(90, ok ? 'happy2' : 'think') + '<div><span class="kick">Quiz terminé</span><h2>' + score + ' / ' + qs.length + (ok ? ' · Bravo !' : '') + '</h2><p style="margin:6px 0 0;color:var(--soft)">' + (ok ? 'Tu as le badge de cette leçon.' : 'Relis « À retenir » et retente ta chance : il faut 4 bonnes réponses sur 5.') + '</p></div></div>';
        var r = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' }, box);
        h('button', { class: 'btn' }, r, 'Recommencer').onclick = function () { i = 0; score = 0; show(); };
        h('button', { class: 'btn' + (next ? '' : ' primary') }, r, 'Fermer').onclick = close;
        if (next) { var a = h('a', { class: 'btn primary', href: next.href }, r, (next.done ? 'Retour au parcours' : 'Leçon suivante : ' + esc(next.t)) + ' ▸'); a.style.textDecoration = 'none'; }
        if (ok) { sound('win'); confetti(stage); }
        a11y.focusFirst(); onDone && onDone(score, ok); return;
      }
      var q = shuf(qs[i]);
      box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><span class="kick">' + esc(title) + ' · question ' + (i + 1) + ' / ' + qs.length + '</span></div><h2>' + q.q + '</h2>';
      var g = h('div', { class: 'opts' }, box), fb = h('div', { class: 'msg', 'aria-live': 'polite' }, box), nx;
      q.o.forEach(function (t, j) {
        var b = h('button', { type: 'button' }, g, t);
        b.onclick = function () {
          if (nx) return;
          var good = j === q.a; if (good) score++;
          g.querySelectorAll('button').forEach(function (x, k) { x.disabled = true; if (k === q.a) x.className = 'good'; else if (k === j) x.className = 'bad'; });
          fb.className = 'msg ' + (good ? 'ok' : 'bad'); fb.innerHTML = '<b>' + (good ? 'Exact !' : 'Pas tout à fait.') + '</b> ' + (good ? '' : 'La bonne réponse est : <b>' + q.o[q.a] + '</b>. ') + q.e;
          sound(good ? 'ok' : 'bad');
          nx = h('button', { class: 'btn primary', style: 'align-self:flex-end' }, box, i + 1 < qs.length ? 'Question suivante →' : 'Voir mon score'); nx.onclick = function () { i++; show(); }; nx.focus();
        };
      });
      var cl = h('button', { class: 'btn sm', style: 'align-self:flex-start' }, box, 'Fermer le quiz'); cl.onclick = close;
      a11y.focusFirst();
    }
    show();
  }


  /* ---------- trousse pour les scènes des résumés vidéo ---------- */
  var kit = {
    fade: function (t, a, b, f) { f = f || 0.6; return clamp(Math.min((t - a) / f, (b - t) / f), 0, 1); },
    k: function (t, a, d) { return ease(clamp((t - a) / (d || 0.6), 0, 1)); },
    arrow: function (x0, y0, x1, y1, w, hw, hl) {
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 2) return '';
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux; hl = Math.min(hl || 14, L * 0.6); hw = hw || 8; w = w || 2.5;
      var bx = x1 - ux * hl, by = y1 - uy * hl;
      return 'M' + (x0 + nx * w) + ' ' + (y0 + ny * w) + 'L' + (bx + nx * w) + ' ' + (by + ny * w) + 'L' + (bx + nx * hw) + ' ' + (by + ny * hw) + 'L' + x1 + ' ' + y1 + 'L' + (bx - nx * hw) + ' ' + (by - ny * hw) + 'L' + (bx - nx * w) + ' ' + (by - ny * w) + 'L' + (x0 - nx * w) + ' ' + (y0 - ny * w) + 'Z';
    },
    tagger: function (G) {
      var g = s('g', { opacity: 0 }, G), r = s('rect', { rx: 18, height: 40, fill: 'var(--amber)' }, g), t = s('text', { 'font-size': 18, 'font-weight': 800, fill: 'var(--on-amber)', 'text-anchor': 'middle' }, g), on = false;
      return {
        begin: function () { on = false; },
        show: function (tt, a, b, x, y, txt) { if (on || tt < a || tt > b) return false; on = true; g.setAttribute('opacity', kit.fade(tt, a, b, 0.4)); t.textContent = txt; var w = txt.length * 9.4 + 32; attr(r, { x: x - w / 2, y: y - 28, width: w }); attr(t, { x: x, y: y - 2 }); return true; },
        end: function () { if (!on) g.setAttribute('opacity', 0); g.parentNode.appendChild(g); }
      };
    },
    chapter: function (G, chapters) {
      var g = s('g', {}, G), r = s('rect', { x: 24, y: 18, height: 40, rx: 20, fill: 'var(--scene2)' }, g), tx = s('text', { x: 44, y: 44, 'font-size': 17, 'font-weight': 700, fill: 'var(--scene-text)' }, g);
      return function (t) { var i = 0; chapters.forEach(function (c, j) { if (t >= c.t) i = j; }); var txt = 'Chapitre ' + (i + 1) + ' · ' + chapters[i].title; if (tx.textContent !== txt) { tx.textContent = txt; r.setAttribute('width', txt.length * 8.6 + 40); } g.parentNode.appendChild(g); };
    },
    cards: function (G, list, times) {
      var gs = list.map(function (c, i) {
        var y = 70 + i * (list.length > 3 ? 92 : 120), hgt = list.length > 3 ? 80 : 100, cg = s('g', { opacity: 0 }, G);
        s('rect', { x: 120, y: y, width: 700, height: hgt, rx: 20, fill: 'var(--scene2)', stroke: c[2] || 'var(--amber)', 'stroke-width': 3 }, cg);
        s('circle', { cx: 170, cy: y + hgt / 2, r: 24, fill: c[2] || 'var(--amber)' }, cg);
        s('text', { x: 170, y: y + hgt / 2 + 9, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 800, fill: '#141C2E', 'font-family': 'Bricolage Grotesque, sans-serif', text: String(i + 1) }, cg);
        var t1 = s('text', { x: 212, y: y + hgt / 2 - 6, 'font-size': 23, 'font-weight': 800, fill: 'var(--scene-text)' }, cg); t1.innerHTML = c[0].replace(/<b>/g, '<tspan fill="#FFB547">').replace(/<\/b>/g, '</tspan>');
        s('text', { x: 212, y: y + hgt / 2 + 24, 'font-size': 17, fill: 'var(--scene-muted)', text: c[1] }, cg);
        return cg;
      });
      return function (t) { gs.forEach(function (cg, i) { var k = clamp((t - times[i]) / 0.6, 0, 1); cg.setAttribute('opacity', t < times[0] - 0.5 ? 0 : k); cg.setAttribute('transform', 'translate(' + (40 * (1 - ease(k))) + ' 0)'); }); };
    },
    group: function (G, t, a, b, f) { var o = kit.fade(t, a, b, f || 0.6); G.setAttribute('opacity', o); G.style.display = o > 0 ? '' : 'none'; return o > 0; },
    sine: function (x0, w, y0, amp, per, ph, step) { var d = ''; step = step || 2; for (var px = 0; px <= w; px += step) d += (px ? 'L' : 'M') + (x0 + px).toFixed(1) + ' ' + (y0 - amp * Math.sin(2 * Math.PI * per * px / w + (ph || 0))).toFixed(1); return d; }
  };

  /* ================== LA LEÇON ================== */
  function start(L) {
    /* lecteur « moments » : il lit la configuration de la leçon sans construire l'interface Studio */
    if (window.__momentsCapture) { window.__momentsCapture(L); return; }
    var inquiry = store('pc-inquiry-' + L.id, { prediction: '', observation: '', comparison: '', conclusion: '', started: false, complete: false });
    var revision = false;
    /* mode intégré (?embed=resume|sim|defi) : un seul écran Studio, sans barre du haut, dans le lecteur en moments */
    var EMBED = (/[?&]embed=(resume|sim|defi)\b/.exec(location.search) || [])[1] || null;
    var app = document.documentElement; app.classList.add('app'); if (EMBED) app.classList.add('embed');
    document.title = L.title + ' · ' + L.level + ' · NOHOBA-Lab'; var lh = document.getElementById('lh'); if (lh) lh.textContent = L.title + ' · ' + L.level;
    applySettings();
    var vp = h('div', { class: 'viewport' }, document.body), stage = h('div', { class: 'stage', role: 'main' }, vp);
    var prog = PROG[L.id] = PROG[L.id] || {}; PROG.last = L.id; save('pc-studio-prog', PROG);

    /* barre du haut */
    var top = h('header', { class: 'top' }, stage); if (EMBED) top.hidden = true;
    /* 6e : retour à la page des quatre étapes de la leçon ; autres classes : retour à la liste des leçons */
    var back6 = L.level === '6e' && /^6e-/.test(L.id || '');
    h('a', { class: 'btn', href: back6 ? '../parcours-ci/?l=' + L.id.replace(/^6e-/, '') : (L.back || '../4e/') }, top, back6 ? '← Mes étapes' : '← Mes leçons');
    h('span', { class: 'lvl' }, top, L.level);
    var tt = h('div', { style: 'display:flex;flex-direction:column;min-width:0;max-width:330px' }, top, '<span class="kick">' + esc(L.theme) + '</span><span class="ttl">' + esc(L.title) + '</span>');
    h('div', { class: 'grow' }, top);
    var steps = h('nav', { class: 'steps', 'aria-label': 'Étapes de la leçon' }, top);
    var STEPS = [['resume', '1 · Résumé'], ['sim', L.inquiry ? 'Investigation' : 'Simulation'], ['defi', '3 · Défi'], ['quiz', '4 · Quiz']];
    var stepBtn = {};
    STEPS.forEach(function (st) { var b = h('button', { type: 'button' }, steps); b.onclick = function () { go(st[0]); }; stepBtn[st[0]] = b; });
    function paintSteps() { STEPS.forEach(function (st) { var b = stepBtn[st[0]]; b.innerHTML = (prog[st[0]] ? '<span class="ok" aria-label="terminé">✓</span>' : '') + st[1]; b.hidden = !PROF.steps[st[0]]; b.setAttribute('aria-current', cur === st[0] ? 'step' : 'false'); }); }
    var bProf = h('button', { class: 'btn icon', 'aria-label': 'Mode enseignant', title: 'Mode enseignant' }, top, ICON.lock);
    var bSet = h('button', { class: 'btn icon', 'aria-label': 'Réglages d’affichage', title: 'Réglages', 'aria-expanded': 'false' }, top, ICON.gear);
    var bFs = h('button', { class: 'btn icon', 'aria-label': 'Plein écran', title: 'Plein écran' }, top, ICON.fs);
    bFs.onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {}); };

    /* outils de projection (mode enseignant) */
    var pt = h('div', { class: 'ptools', hidden: '' }, stage);
    var bSpot = h('button', { class: 'btn sm', 'aria-pressed': 'false' }, pt, ICON.spot + 'Projecteur');
    var bPen = h('button', { class: 'btn sm', 'aria-pressed': 'false' }, pt, ICON.pen + 'Annoter');
    var bClr = h('button', { class: 'btn sm' }, pt, 'Effacer');
    var bFrz = h('button', { class: 'btn sm', 'aria-pressed': 'false' }, pt, ICON.freeze + 'Figer');
    var spot = null, pen = null;
    function stagePt(e) { var r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * stage.offsetWidth, y: (e.clientY - r.top) / r.height * stage.offsetHeight }; }
    bSpot.onclick = function () {
      if (spot) { spot.remove(); spot = null; document.removeEventListener('pointermove', mvSpot); }
      else { spot = h('div', { class: 'spot' }, stage); document.addEventListener('pointermove', mvSpot); }
      bSpot.setAttribute('aria-pressed', !!spot);
    };
    function mvSpot(e) { if (!spot) return; var p = stagePt(e); spot.style.setProperty('--x', p.x + 'px'); spot.style.setProperty('--y', p.y + 'px'); }
    bPen.onclick = function () {
      if (!pen) {
        var c = h('canvas', { class: 'draw', width: stage.offsetWidth, height: stage.offsetHeight }, stage), g = c.getContext('2d'), down = false;
        g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#FFB547'; g.lineWidth = 5;
        c.addEventListener('pointerdown', function (e) { down = true; try { c.setPointerCapture(e.pointerId); } catch (_) {} var p = stagePt(e); g.beginPath(); g.moveTo(p.x, p.y); });
        c.addEventListener('pointermove', function (e) { if (!down) return; var p = stagePt(e); g.lineTo(p.x, p.y); g.stroke(); });
        c.addEventListener('pointerup', function () { down = false; });
        pen = { c: c, g: g, on: true };
      } else { pen.on = !pen.on; }
      pen.c.style.pointerEvents = pen.on ? 'auto' : 'none'; pen.c.style.cursor = pen.on ? 'crosshair' : '';
      bPen.setAttribute('aria-pressed', String(pen.on));
    };
    bClr.onclick = function () { if (pen) pen.g.clearRect(0, 0, pen.c.width, pen.c.height); };
    bFrz.onclick = function () { frozen = !frozen; app.classList.toggle('frozen', frozen); bFrz.setAttribute('aria-pressed', frozen); hush(); toast(frozen ? 'Écran figé' : 'Animation relancée'); };
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { frozen = true; app.classList.add('frozen'); bFrz.setAttribute('aria-pressed', 'true'); setTimeout(function () { toast('Animations en pause (réglage « réduire les animations » de ton appareil). Clique sur Figer pour les relancer.'); }, 600); } } catch (e) {}
    function toast(t, ms) { var d = h('div', { class: 'toast', role: 'status' }, stage, t); d.style.maxWidth = 'min(92%, 460px)'; d.style.textAlign = 'center'; if (ms) { d.style.cursor = 'pointer'; d.onclick = function () { d.remove(); }; } setTimeout(function () { d.remove(); }, ms || 1800); }

    /* ---------- tiroir des réglages ---------- */
    var dr = h('aside', { class: 'drawer', 'aria-label': 'Réglages d’affichage' }, stage);
    var dh = h('div', { class: 'hd' }, dr, '<b>Réglages</b>');
    h('button', { class: 'btn icon', 'aria-label': 'Fermer les réglages' }, dh, '×').onclick = function () { setDrawer(false); };
    var db = h('div', { class: 'bd' }, dr);
    function setDrawer(o) { dr.classList.toggle('open', o); bSet.setAttribute('aria-expanded', o); }
    bSet.onclick = function () { setDrawer(!dr.classList.contains('open')); };
    function drawSettings() {
      db.innerHTML = '';
      h('div', { class: 'kick' }, db, 'Taille du texte');
      var sz = h('div', { class: 'sz' }, db);
      [[0.9, 13], [1, 16], [1.15, 19], [1.3, 23]].forEach(function (p) { var b = h('button', { type: 'button', 'aria-pressed': SET.fs === p[0], style: 'font-size:' + p[1] + 'px', 'aria-label': 'Texte ' + Math.round(p[0] * 100) + ' %' }, sz, 'A'); b.onclick = function () { SET.fs = p[0]; applySettings(); drawSettings(); }; });
      var vr = h('div', { class: 'row' }, db); var id = 'spd';
      var lb = h('label', { class: 'lb', for: id }, vr, '<span>Vitesse des animations</span><output></output>');
      var SP = [0.25, 0.5, 0.75, 1, 1.5, 2], inp = h('input', { type: 'range', id: id, min: 0, max: 5, step: 1, value: Math.max(0, SP.indexOf(SET.speed)) }, vr);
      function so() { var v = SP[+inp.value]; lb.querySelector('output').textContent = fmt(v, v % 1 ? 2 : 0).replace(/,?0+$/, '') + '×' + (v < 1 ? ' ralenti' : v > 1 ? ' accéléré' : ''); }
      inp.oninput = function () { SET.speed = SP[+inp.value]; so(); applySettings(); }; so();
      h('div', { class: 'kick' }, db, 'Thème');
      var th = h('div', { class: 'th' }, db);
      [['dark', 'Sombre', 'background:#0B1220;color:#EEF2F8'], ['light', 'Clair', 'background:#F4F7FB;color:#142033'], ['contrast', 'Contraste élevé', 'background:#000;color:#FFFF00']].forEach(function (t) { var b = h('button', { type: 'button', 'aria-pressed': SET.theme === t[0], style: t[2] }, th, t[1]); b.onclick = function () { SET.theme = t[0]; SET.themeSet = true; applySettings(); drawSettings(); }; });
      var c = controls(db);
      c.toggle({ label: 'Couleurs adaptées aux daltoniens', value: SET.cvd, onChange: function (v) { SET.cvd = v; applySettings(); } });
      c.toggle({ label: 'Mode projection (traits épais)', value: SET.proj, onChange: function (v) { SET.proj = v; applySettings(); } });
      c.toggle({ label: 'Voix du résumé vidéo', value: SET.voice, onChange: function (v) { SET.voice = v; applySettings(); } });
      c.toggle({ label: 'Lire les consignes à voix haute', value: SET.tts, onChange: function (v) { SET.tts = v; applySettings(); } });
      c.toggle({ label: 'Lumi me donne des indices', value: SET.hints, onChange: function (v) { SET.hints = v; applySettings(); } });
      c.toggle({ label: 'Sons', value: SET.sound, onChange: function (v) { SET.sound = v; applySettings(); if (v) sound('pop'); } });
      h('p', { class: 'note' }, db, synth ? 'La voix est celle de votre appareil : elle peut changer d’un téléphone ou d’un ordinateur à l’autre.' : 'Cet appareil n’a pas de synthèse vocale : les sous-titres restent affichés.');
      h('p', { class: 'note' }, db, 'Les réglages sont gardés sur cet appareil pour toutes les leçons. Zoom : boutons + et −, molette ou deux doigts sur la scène.');
    }
    drawSettings();

    /* ---------- mode enseignant ---------- */
    var mp = h('div', { class: 'modal', hidden: '', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Mode enseignant' }, stage);
    var profA11y = null;
    function closeProf() { mp.hidden = true; applyProf(); if (profA11y) { profA11y.release(); profA11y = null; } }
    bProf.onclick = function () { drawProf(); mp.hidden = false; profA11y = trapModal(mp, closeProf); };
    function drawProf() {
      mp.innerHTML = '';
      var box = h('div', { class: 'box', style: 'width:min(1100px,96%)' }, mp);
      var hd = h('div', { style: 'display:flex;align-items:center;gap:12px' }, box, '<span class="btn sm primary" style="pointer-events:none">' + ICON.lock + 'Mode enseignant</span><h2 style="flex:1">Préparer ma séance</h2>');
      h('button', { class: 'btn' }, hd, 'Fermer').onclick = closeProf;
      var gr = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px' }, box);
      var c1 = h('div', { class: 'card' }, gr, '<h3>1 · Déroulé de la leçon</h3>'), k1 = controls(c1);
      [['resume', 'Résumé vidéo'], ['sim', 'Simulation'], ['defi', 'Défi'], ['quiz', 'Quiz de sortie']].forEach(function (st) { k1.toggle({ label: st[1], value: PROF.steps[st[0]], onChange: function (v) { PROF.steps[st[0]] = v; save('pc-studio-prof', PROF); paintSteps(); } }); });
      k1.toggle({ label: 'Outils de projection', value: PROF.on, onChange: function (v) { PROF.on = v; save('pc-studio-prof', PROF); applyProf(); } });
      var c2 = h('div', { class: 'card' }, gr, '<h3>2 · Difficulté et réponses</h3>'), k2 = controls(c2);
      k2.seg({ value: PROF.level, options: [{ v: 'dec', l: 'Découverte' }, { v: 'std', l: 'Standard' }, { v: 'exp', l: 'Expert' }], onChange: function (v) { PROF.level = v; save('pc-studio-prof', PROF); lvlNote.textContent = LVLN[v]; } });
      var LVLN = { dec: 'Découverte : lectures faites automatiquement, indices illimités, 90 s par mission si le chronomètre est activé.', std: 'Standard : l’élève lit l’oscilloscope lui-même, indices disponibles.', exp: 'Expert : pas d’indice, incertitudes plus fortes, temps réduit de moitié si le chronomètre est activé.' };
      var lvlNote = h('p', { class: 'note', style: 'font-size:13px;color:var(--muted);margin:0 0 10px' }, c2, LVLN[PROF.level]);
      k2.toggle({ label: 'Masquer les résultats du bilan', value: PROF.hideRes, onChange: function (v) { PROF.hideRes = v; save('pc-studio-prof', PROF); } });
      k2.toggle({ label: 'Montrer le corrigé après chaque mission', value: PROF.corr, onChange: function (v) { PROF.corr = v; save('pc-studio-prof', PROF); } });
      k2.toggle({ label: 'Activer le chronomètre (optionnel)', value: !!PROF.timed, onChange: function (v) { PROF.timed = v; save('pc-studio-prof', PROF); } });
      k2.slider({ label: 'Temps par mission', min: 20, max: 120, step: 10, value: PROF.time, unit: 's', onInput: function (v) { PROF.time = v; save('pc-studio-prof', PROF); } });
      var c3 = h('div', { class: 'card' }, gr, '<h3>3 · Équipes</h3>'), k3 = controls(c3);
      var names = h('div', { style: 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px' });
      k3.slider({ label: 'Nombre d’équipes', min: 1, max: 6, step: 1, value: PROF.nTeams, onInput: function (v) { PROF.nTeams = v; save('pc-studio-prof', PROF); drawNames(); } });
      c3.appendChild(names);
      function drawNames() {
        names.innerHTML = '';
        for (var i = 0; i < PROF.nTeams; i++) (function (i) {
          var l = h('label', { style: 'display:flex;align-items:center;gap:8px;background:var(--panel);border-radius:12px;padding:0 10px;height:44px;min-width:0' }, names, '<span style="width:12px;height:12px;border-radius:6px;flex-shrink:0;background:' + TEAMC[i] + '"></span>');
          var inp = h('input', { value: PROF.teams[i], 'aria-label': 'Nom de l’équipe ' + (i + 1), maxlength: 14, style: 'flex:1;min-width:0;width:100%;border:0;background:transparent;font-weight:700' }, l);
          inp.oninput = function () { PROF.teams[i] = inp.value || 'Équipe ' + (i + 1); save('pc-studio-prof', PROF); };
        })(i);
      }
      drawNames();
      k3.toggle({ label: 'Afficher le classement', value: PROF.board, onChange: function (v) { PROF.board = v; save('pc-studio-prof', PROF); } });
      h('p', { class: 'note', style: 'font-size:13px;color:var(--muted);margin:10px 0 0' }, c3, 'Les équipes jouent à tour de rôle sur le même écran, sans compte ni réseau.');
    }
    function applyProf() { pt.hidden = !PROF.on; bProf.classList.toggle('primary', PROF.on); paintSteps(); }

    /* ---------- vues ---------- */
    var views = {}, cur = null, ctl = {};
    function go(name) {
      /* le résumé reste toujours ouvert (il aide à se lancer) ; le défi et le quiz attendent la démarche, avec un message qui dit quoi faire */
      if (L.inquiry && !revision && !inquiry.complete && !EMBED) { PROF.steps.sim = true; if (name !== 'sim' && name !== 'resume') { toast('Fais d’abord l’étape « Investigation ». Si tu es bloqué, regarde le résumé ou manipule la simulation, puis reviens.', 7000); name = 'sim'; } }
      if (name === 'quiz' && !PROF.steps.quiz) { toast('Le quiz est désactivé par l’enseignant'); return; }
      if (!PROF.steps[name] && name !== 'quiz') { var nx = STEPS.map(function (x) { return x[0]; }).filter(function (k) { return PROF.steps[k] && k !== 'quiz'; })[0]; name = nx || 'resume'; }
      if (name === 'quiz') {
        var back = cur; hush(); if (back && ctl[back] && ctl[back].leave) ctl[back].leave();
        quiz(stage, L.quiz, L.title, function (sc, ok) { if (ok) { prog.quiz = true; save('pc-studio-prog', PROG); paintSteps(); } }, nextLesson(L), function () { if (back && ctl[back] && ctl[back].resume) ctl[back].resume(); });
        return;
      }
      hush();
      Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; if (ctl[k] && ctl[k].leave && k !== name) ctl[k].leave(); });
      cur = name; paintSteps();
      if (!ctl[name]) ctl[name] = BUILD[name](views[name]);
      if (ctl[name].enter) ctl[name].enter();
      try { history.replaceState(null, '', '#' + name); } catch (e) {}
    }
    function done(step) { if (!prog[step]) { prog[step] = true; save('pc-studio-prog', PROG); paintSteps(); } if (EMBED) { try { parent.postMessage({ nohoba: 'studio-done', step: step }, location.origin); } catch (e) {} } }
    ['resume', 'sim', 'defi'].forEach(function (k) { views[k] = h('section', { class: 'view' + (k === 'defi' ? ' defi' : ''), hidden: '', 'aria-label': k }, stage); });

    var BUILD = {
      resume: function (root) { return buildResume(root, L.resume, { stage: stage, done: function () { done('resume'); }, go: go }); },
      sim: function (root) { return buildSim(root, L.sim, { embed: !!EMBED, stage: stage, done: function () { done('sim'); }, go: go, L: L, inquiry: inquiry, revision: function () { return revision; }, revise: function () { revision = true; go('resume'); } }); },
      defi: function (root) { return buildDefi(root, L.defi, { stage: stage, done: function () { done('defi'); }, go: go, L: L }); }
    };

    /* fiche à imprimer */
    var fiche = h('div', { id: 'fiche' }, document.body);
    window.addEventListener('beforeprint', function () {
      var teacher = printTeacher;
      fiche.innerHTML = '<h1>' + esc(L.title) + '</h1><p>Physique-chimie · ' + L.level + ' · ' + esc(L.theme) + '</p>' + (printTeacher ? '<h2>À retenir</h2>' + L.retiens.map(function (r) { return '<div class="box">' + r + '</div>'; }).join('') : '<h2>Ma démarche</h2>' + (L.inquiry ? '<p>' + esc(L.inquiry.situation) + '</p>' : '') + [['prediction', 'Ma prévision et ma justification'], ['observation', 'Mes réglages et mes observations'], ['comparison', 'Confrontation aux résultats'], ['conclusion', 'Mon bilan']].map(function (item) { return '<h3>' + item[1] + '</h3><div class="box learner-answer">' + esc(inquiry[item[0]] || '................................................................................') + '</div>'; }).join('')) +
        '<h2>Je m’exerce</h2><ol>' + L.quiz.map(function (q) { return '<li><b>' + q.q + '</b><br>' + q.o.map(function (o, i) { return String.fromCharCode(97 + i) + ') ' + o; }).join(' &nbsp; ') + '</li>'; }).join('') + '</ol>' + (printTeacher ? '<h2>Corrigé professeur</h2><ol>' + L.quiz.map(function (q) { return '<li>' + String.fromCharCode(97 + q.a) + ') ' + q.o[q.a] + (q.e ? '<br>' + q.e : '') + '</li>'; }).join('') + '</ol>' : '');
    });

    /* mise à l'échelle */
    function fit() {
      /* téléphone : l'affichage portrait ne dépend pas de la hauteur de la fenêtre, qui chute quand le clavier s'ouvre
         (sinon la page bascule en mode 1280 × 720 réduit et devient illisible). */
      var w = window.innerWidth, hh = window.innerHeight, scr = window.screen || {}, devPortrait = !!(scr.orientation && /portrait/.test(scr.orientation.type || '')) || (scr.height > scr.width && w < 900);
      var portrait = w < 900 && (hh > w * 1.05 || w < 700 || devPortrait);
      app.classList.toggle('portrait', portrait);
      document.body.style.overflow = portrait ? 'auto' : 'hidden';
      if (portrait) { stage.style.transform = 'none'; vp.style.height = ''; stage.parentNode.style.height = ''; }
      else { var k2 = Math.min(w / 1280, hh / 720); stage.style.transform = 'scale(' + k2 + ')'; stage.parentNode.style.height = ''; }
    }
    window.addEventListener('resize', fit); document.addEventListener('fullscreenchange', fit);
    applyProf();
    var first = (location.hash || '').slice(1);
    go(EMBED || (STEPS.some(function (x) { return x[0] === first; }) && first !== 'quiz' ? first : (L.inquiry ? 'sim' : 'resume')));
    if (first === 'quiz' && !EMBED) go('quiz');
    if (/[?&]imprimer=fiche\b/.test(location.search)) setTimeout(function () { printSheet(false); }, 400);
    fit(); setTimeout(fit, 50);
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('../sw.js').catch(function () {});
    window.Studio.stage = stage;
    /* mode intégré : le lecteur reçoit la hauteur du contenu (affichage portrait) pour ajuster le cadre */
    if (EMBED) {
      var sendH = function () { try { parent.postMessage({ nohoba: 'studio-h', h: Math.ceil(document.documentElement.scrollHeight) }, location.origin); } catch (e) {} };
      if (window.ResizeObserver) new ResizeObserver(sendH).observe(document.body);
      window.addEventListener('resize', sendH); setTimeout(sendH, 300);
    }
  }

  /* ================== RÉSUMÉ VIDÉO NARRÉ ================== */
  function buildResume(root, R, ctx) {
    var player = h('div', { class: 'player' }, root);
    var screen = h('div', { class: 'screen' }, player);
    var sv = s('svg', { class: 'sv', viewBox: '0 0 900 560', role: 'img', 'aria-label': R.alt }, screen);
    var G = s('g', {}, sv);
    var subs = h('div', { class: 'subs', 'aria-live': 'polite' }, screen);
    var lumiBox = h('div', { class: 'lumibox', style: 'position:absolute;left:14px;bottom:10px;pointer-events:none' }, screen, lumi(58));
    var scene = R.scene({ svg: sv, g: G, s: s, attr: attr, ease: ease, clamp: clamp, fmt: fmt, set: SET });
    zoomable(screen, sv, 900, 560, G).tools.classList.add('ztop');

    var tl = h('div', { class: 'timeline', role: 'slider', 'aria-label': 'Position dans la vidéo', tabindex: '0', 'aria-valuemin': 0, 'aria-valuemax': Math.round(R.duration) }, player);
    var fill = h('div', { class: 'fill' }, tl);
    R.chapters.forEach(function (c, i) { if (i) h('div', { class: 'tick', style: 'left:' + (c.t / R.duration * 100) + '%' }, tl); });
    var knob = h('div', { class: 'knob' }, tl);
    var pc = h('div', { class: 'pctl' }, player);
    var bPrev = h('button', { class: 'btn icon', 'aria-label': 'Chapitre précédent' }, pc, ICON.prev);
    var bPlay = h('button', { class: 'play', 'aria-label': 'Lecture' }, pc, ICON.play);
    var bNext = h('button', { class: 'btn icon', 'aria-label': 'Chapitre suivant' }, pc, ICON.next);
    var tT = h('span', { class: 't' }, pc);
    h('div', { style: 'flex:1' }, pc);
    var spd = h('div', { class: 'speed', role: 'group', 'aria-label': 'Vitesse de lecture' }, pc), rate = 1;
    var SPD = [0.75, 1, 1.25];
    var spdB = SPD.map(function (v) { var b = h('button', { type: 'button' }, spd, fmt(v, v === 1 ? 0 : 2).replace(/0$/, '') + '×'); b.onclick = function () { rate = v; paintSpd(); if (speaking) { var keep = idx; stopVoice(); spoken = keep - 1; } }; return b; });
    function paintSpd() { spdB.forEach(function (b, i) { b.setAttribute('aria-pressed', SPD[i] === rate); }); } paintSpd();
    var bVoice = h('button', { class: 'btn', title: 'Voix off' }, pc);
    function paintVoice() { bVoice.innerHTML = (SET.voice ? ICON.voice : ICON.mute) + 'Voix'; bVoice.setAttribute('aria-pressed', SET.voice); } paintVoice();
    bVoice.onclick = function () { SET.voice = !SET.voice; applySettings(); paintVoice(); if (!SET.voice) stopVoice(); };
    var bSub = h('button', { class: 'btn', title: 'Taille des sous-titres' }, pc, 'Sous-titres A+');
    bSub.onclick = function () { SET.sub = SET.sub >= 34 ? 18 : SET.sub + 4; applySettings(); };

    /* colonne : chapitres + ce que j'ai appris */
    var side = h('aside', { class: 'side', style: 'padding:16px;gap:12px;overflow:auto' }, root);
    h('div', { class: 'kick' }, side, 'Chapitres');
    var chB = R.chapters.map(function (c, i) { var b = h('button', { class: 'chap', type: 'button' }, side, '<span class="st">○</span><span style="flex:1">' + (i + 1) + ' · ' + esc(c.title) + '</span><span class="tc">' + mmss(c.t) + '</span>'); b.onclick = function () { seek(c.t); play(true); }; return b; });
    h('div', { class: 'kick', style: 'margin-top:6px' }, side, 'Ce que j’ai appris');
    var learnBox = h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, side);
    var shown = -1;
    h('div', { style: 'flex:1' }, side);
    var nextB = h('button', { class: 'btn primary' }, side, 'Passer à la simulation ▸'); nextB.onclick = function () { ctx.go('sim'); };

    function mmss(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2); }
    var t = 0, playing = false, idx = -1, spoken = -1, speaking = null, hold = false, ended = false;
    function segAt(x) { var k = -1; R.segs.forEach(function (sg, i) { if (x >= sg.t) k = i; }); return k; }
    function stopVoice() { if (speaking) { speaking.stop(); speaking = null; } hold = false; }
    function seek(x) {
      t = clamp(x, 0, R.duration); stopVoice(); ended = false;
      var k = segAt(t); spoken = (k >= 0 && t - R.segs[k].t < 0.35) ? k - 1 : k; idx = k;
      render(true);
    }
    function play(on) {
      if (on) { wakeVoice(); if (synth && synth.paused) synth.resume(); }
      playing = on; bPlay.innerHTML = on ? ICON.pause : ICON.play; bPlay.setAttribute('aria-label', on ? 'Pause' : 'Lecture');
      if (!on) stopVoice(); else { if (t >= R.duration - 0.01) seek(0); var k = segAt(t); if (k >= 0 && t - R.segs[k].t < R.segs[k].d * 0.5) spoken = k - 1; }
    }
    bPlay.onclick = function () { play(!playing); };
    bPrev.onclick = function () { var c = 0; R.chapters.forEach(function (ch) { if (ch.t < t - 1.5) c = ch.t; }); seek(c); };
    bNext.onclick = function () { var n = R.chapters.filter(function (ch) { return ch.t > t + 0.2; })[0]; if (n) seek(n.t); };
    function fromX(e) { var r = tl.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 1) * R.duration; }
    tl.addEventListener('pointerdown', function (e) { try { tl.setPointerCapture(e.pointerId); } catch (_) {} seek(fromX(e)); tl._d = true; });
    tl.addEventListener('pointermove', function (e) { if (tl._d) seek(fromX(e)); });
    tl.addEventListener('pointerup', function () { tl._d = false; });
    tl.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') seek(t + 5); if (e.key === 'ArrowLeft') seek(t - 5); if (e.key === ' ') { e.preventDefault(); play(!playing); } });

    function render(force) {
      scene.render(t, SET);
      var k = segAt(t), sg = R.segs[k];
      subs.innerHTML = sg && t < sg.t + sg.d + 1.2 ? sg.sub || sg.say : '';
      fill.style.width = (t / R.duration * 100) + '%'; knob.style.left = (t / R.duration * 100) + '%';
      tl.setAttribute('aria-valuenow', Math.round(t));
      tT.textContent = mmss(t) + ' / ' + mmss(R.duration);
      var ci = 0; R.chapters.forEach(function (c, i) { if (t >= c.t) ci = i; });
      chB.forEach(function (b, i) { b.setAttribute('aria-current', i === ci); b.querySelector('.st').textContent = i < ci ? '✓' : i === ci ? '▸' : '○'; b.querySelector('.st').style.color = i < ci ? 'var(--green)' : i === ci ? 'var(--amber)' : ''; });
      var nL = R.learn.filter(function (l) { return t >= l.t; }).length;
      if (nL !== shown || force) {
        learnBox.innerHTML = '';
        R.learn.forEach(function (l, i) { if (i < nL) h('div', { class: 'learn' }, learnBox, l.html); else if (i === nL) h('div', { class: 'learn ph' }, learnBox, 'S’affiche au chapitre ' + (l.ch || '') + '…'); });
        if (nL > shown && shown >= 0 && !force) sound('pop');
        shown = nL;
      }
    }
    var stopLoop = loop(function (dt) {
      if (!playing) return;
      var k = segAt(t);
      if (k !== idx) idx = k;
      if (k > spoken && k >= 0) {
        spoken = k;
        if (SET.voice && synth) { hold = true; var me = speaking = speak(R.segs[k].say, rate * (SET.speed < 1 ? 0.9 : 1), function () { if (speaking === me) { speaking = null; hold = false; } }); }
      }
      var end = k >= 0 ? R.segs[k].t + R.segs[k].d : Infinity, nextT = t + dt * rate * Math.min(SET.speed, 1.25);
      if (hold && speaking && nextT > end - 0.05) nextT = Math.max(t, end - 0.05);     // la voix n'a pas fini : on attend
      t = Math.min(R.duration, nextT);
      render();
      if (t >= R.duration && !ended) { ended = true; play(false); flash(); }
    });
    function flash() {
      var q = shuf(R.question), f = h('div', { class: 'flash', role: 'dialog', 'aria-label': 'Question flash' }, screen), b = h('div', { class: 'box' }, f);
      b.innerHTML = '<div style="display:flex;gap:14px;align-items:center">' + lumi(64, 'think') + '<div><span class="kick">Question flash</span><h2>' + q.q + '</h2></div></div>';
      var g = h('div', { class: 'opts' }, b), fb = h('div', { class: 'msg' }, b);
      if (SET.voice) speak('Question flash. ' + q.q, rate);
      q.o.forEach(function (o, j) {
        var x = h('button', { type: 'button' }, g, o);
        x.onclick = function () {
          var ok = j === q.a; g.querySelectorAll('button').forEach(function (y, i) { y.disabled = true; if (i === q.a) y.className = 'good'; else if (i === j) y.className = 'bad'; });
          fb.className = 'msg ' + (ok ? 'ok' : 'bad'); fb.innerHTML = '<b>' + (ok ? 'Bravo !' : 'Presque…') + '</b> ' + (ok ? '' : 'La bonne réponse est : <b>' + q.o[q.a] + '</b>. ') + q.e; sound(ok ? 'ok' : 'bad');
          ctx.done();
          var r = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' }, b);
          h('button', { class: 'btn' }, r, 'Revoir la vidéo').onclick = function () { f.remove(); seek(0); play(true); };
          h('button', { class: 'btn primary' }, r, 'Passer à la simulation ▸').onclick = function () { f.remove(); ctx.go('sim'); };
        };
      });
    }
    seek(0);
    return { enter: function () { render(true); }, leave: function () { play(false); }, resume: function () { render(true); } };
  }

  /* ================== SIMULATION ================== */
  function buildSim(root, S, ctx) {
    var I = ctx.L.inquiry, state = ctx.inquiry;
    function persist() { if (I) save('pc-inquiry-' + ctx.L.id, state); }
    var main = h('div', { class: 'main' }, root);
    var box = h('div', { class: 'scene' }, main);
    var sv = s('svg', { class: 'sv', viewBox: '0 0 ' + S.W + ' ' + S.H, role: 'img', 'aria-label': S.alt }, box);
    var G = s('g', {}, sv);
    var ros = h('div', { class: 'ros' }, main);
    var side = h('aside', { class: 'side' }, root);
    var tabs = h('div', { class: 'tabs', role: 'tablist' }, side);
    var panes = {}, tabB = {};
    [['manip', 'Manipuler'], ['mes', 'Mesures'], ['bilan', 'Bilan']].forEach(function (p) {
      var b = h('button', { role: 'tab', 'aria-selected': p[0] === 'manip' }, tabs, p[1] + (p[0] === 'mes' ? '<span class="n">0</span>' : ''));
      b.id = ctx.L.id + '-tab-' + p[0]; b.setAttribute('aria-controls', ctx.L.id + '-pane-' + p[0]); b.tabIndex = p[0] === 'manip' ? 0 : -1; b.onclick = function () { tab(p[0]); }; tabB[p[0]] = b;
      panes[p[0]] = h('div', { class: 'pane', role: 'tabpanel', id: ctx.L.id + '-pane-' + p[0], 'aria-labelledby': ctx.L.id + '-tab-' + p[0], hidden: p[0] === 'manip' ? null : '' }, side);
    });
    function tab(k) { Object.keys(panes).forEach(function (x) { panes[x].hidden = x !== k; tabB[x].setAttribute('aria-selected', x === k); tabB[x].tabIndex = x === k ? 0 : -1; }); if (k === 'bilan') bilan(); }
    tabs.addEventListener('keydown', function (e) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      var keys = Object.keys(tabB).filter(function (k) { return !tabB[k].disabled; }), index = keys.findIndex(function (k) { return tabB[k] === document.activeElement; });
      if (index < 0) return;
      e.preventDefault(); index = e.key === 'Home' ? 0 : e.key === 'End' ? keys.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
      tab(keys[index]); tabB[keys[index]].focus();
    });
    var inquiryCard, comparisonCard;
    if (I) {
      inquiryCard = h('details', { class: 'card inquiry', open: state.started ? null : '' }, panes.manip, '<summary>Situation-problème et prévision</summary><h3>1 · Situation-problème</h3><p>' + esc(I.situation) + '</p><h3>2 · Ma prévision</h3>');
      h('label', { for: 'inquiry-prediction' }, inquiryCard, esc(I.prediction));
      var prediction = h('textarea', { id: 'inquiry-prediction', rows: 4, maxlength: 2000 }, inquiryCard); prediction.value = state.prediction; prediction.readOnly = state.started;
      prediction.oninput = function () { state.prediction = prediction.value; persist(); };
      var begin = h('button', { class: 'btn primary' }, inquiryCard, state.started ? 'Prévision enregistrée' : 'Enregistrer ma prévision'); begin.disabled = state.started;
      var notice = h('p', { role: 'status' }, inquiryCard);
      begin.onclick = function () { if (!prediction.value.trim()) { notice.textContent = 'Formule une prévision et explique ton raisonnement.'; prediction.focus(); return; } state.started = true; persist(); prediction.readOnly = true; begin.disabled = true; begin.textContent = 'Prévision enregistrée'; inquiryCard.open = false; unlock(); cmdCard.querySelector('button,input,select')?.focus(); };
      h('button', { class: 'btn sm' }, inquiryCard, 'Je ne sais pas encore : voir le résumé').onclick = function () { ctx.go('resume'); };
      h('button', { class: 'btn sm' }, inquiryCard, 'Parcours Révision').onclick = ctx.revise;
      comparisonCard = h('div', { class: 'card inquiry' }, panes.bilan, '<h3>4 · Confrontation aux résultats</h3><p>Ma prévision initiale :</p>');
      var initial = h('blockquote', {}, comparisonCard);
      var criteria = I.criteria || ['Je décris les conditions des essais et leurs résultats.', 'Je compare explicitement mes résultats à ma prévision initiale.', 'Je justifie mon bilan par les observations et une connaissance scientifique.'];
      h('div', { class: 'inquiry-criteria' }, comparisonCard, '<h4>Critères de réussite</h4><ul>' + criteria.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul><p>Relis ta trace avec ces critères. La présence d’un texte ne valide pas sa justesse ; une rétroaction de l’enseignant reste nécessaire.</p>');
      [['observation', 'Mes résultats : indique le montage, les réglages et ce que tu observes.'], ['comparison', 'Compare tes résultats à ta prévision. Justifie avec « car » ou « parce que ».'], ['conclusion', '5 · Mon bilan : quelle règle retiens-tu ?']].forEach(function (item) {
        var id = 'inquiry-' + item[0]; h('label', { for: id }, comparisonCard, item[1]);
        var input = h('textarea', { id: id, rows: 3, maxlength: 2000 }, comparisonCard); input.value = state[item[0]];
        input.oninput = function () { state[item[0]] = input.value; state.complete = false; persist(); retCard.hidden = true; bilCard.hidden = true; };
      });
      var feedback = h('p', { role: 'status' }, comparisonCard);
      h('button', { class: 'btn primary' }, comparisonCard, 'Comparer avec le bilan scientifique').onclick = function () {
        if (!state.started || !['observation', 'comparison', 'conclusion'].every(function (k) { return state[k].trim(); })) { feedback.textContent = 'Complète la prévision, tes observations, la comparaison et ton bilan.'; return; }
        state.complete = true; persist(); feedback.textContent = 'Trace enregistrée. Compare ton explication au bilan scientifique ; cet outil ne valide pas automatiquement sa justesse.'; bilan();
      };
    }
    if (ctx.embed && I) { inquiryCard.hidden = true; comparisonCard.hidden = true; tabB.bilan.hidden = true; }
    var cons = h('details', { class: 'card', open: '' }, panes.manip, '<summary class="kick" style="cursor:pointer">Consigne</summary><ol style="margin-top:8px">' + (ctx.L.inquiry && ctx.L.inquiry.steps || S.steps).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>');
    var cmdCard = h('div', { class: 'card' }, panes.manip, '<h3>Commandes</h3>');
    var msg = h('div', { class: 'msg', 'aria-live': 'polite' }, panes.manip);
    var mesCard = h('div', { class: 'card' }, panes.mes);
    var chartCard = h('div', { class: 'card' }, panes.mes);
    var bilCard = h('div', { class: 'card res' }, panes.bilan);
    var retCard = h('div', { class: 'card' }, panes.bilan, '<h3>À retenir</h3><ul>' + ctx.L.retiens.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>');
    var br = h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, panes.bilan);
    h('button', { class: 'btn' }, br, 'Fiche élève').onclick = function () { printSheet(false); };
    h('button', { class: 'btn' }, br, 'Corrigé professeur').onclick = function () { printSheet(true); };
    h('button', { class: 'btn primary' }, br, 'Relever le défi ▸').onclick = function () { ctx.go('defi'); };
    var resets = [];
    var api = {
      svg: sv, g: G, s: s, attr: attr, fmt: fmt, clamp: clamp, ease: ease, set: SET, prof: PROF, W: S.W, H: S.H,
      c: controls(cmdCard),
      readouts: function (list) { var o = {}; list.forEach(function (l) { var d = h('div', { class: 'ro' }, ros, '<div class="k">' + l.label + '</div><div class="v">—</div>'); o[l.k] = { set: function (v) { d.querySelector('.v').textContent = v; }, el: d }; }); return o; },
      measure: mesCard, chart: chartCard, panes: panes, tab: tab,
      count: function (n) { tabB.mes.querySelector('.n').textContent = n; },
      say: function (t, cls) { msg.className = 'msg' + (cls ? ' ' + cls : ''); msg.innerHTML = t || ''; if (t && SET.tts && cls !== 'ok') speak(t, 1); },
      loop: function (f) { return loop(function (dt, TT) { if (!root.hidden) f(dt * SET.speed, TT); }); },
      onReset: function (f) { resets.push(f); },
      done: ctx.done, gauss: gauss, sound: sound, lumi: lumi, h: h
    };
    var model = S.build(api);
    function unlock() {
      if (!I) return;
      var locked = !state.started && !ctx.revision() && !ctx.embed;
      main.hidden = locked; cmdCard.hidden = locked; cons.hidden = locked; msg.hidden = locked; if (rr) rr.hidden = locked; root.classList.toggle('inquiry-start', locked);
      initial.textContent = state.prediction || 'Aucune prévision enregistrée.';
      tabB.mes.disabled = locked; tabB.bilan.disabled = locked;
    }
    unlock();
    var rr = h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:auto' }, panes.manip);
    h('button', { class: 'btn sm' }, rr, 'Tout remettre à zéro').onclick = function () { resets.forEach(function (f) { f(); }); api.say('Simulation remise à zéro.'); };
    unlock();
    var zm = zoomable(box, sv, S.W, S.H, G, S.panels); zm.tools.classList.add('ztl');
    function bilan() { var withheld = PROF.hideRes || (I && !state.complete && !ctx.revision()); retCard.hidden = withheld; bilCard.hidden = withheld; if (I) initial.textContent = state.prediction || 'Aucune prévision enregistrée.'; bilCard.innerHTML = PROF.hideRes ? '<h3>Mon bilan</h3><p>Le bilan est masqué par l’enseignant : discutez-en ensemble.</p>' : '<h3>Mon bilan</h3>' + (model.bilan ? model.bilan() : ''); }
    return { refresh: function () { unlock(); bilan(); }, enter: function () { unlock(); bilan(); if (SET.tts) speak((ctx.L.inquiry && ctx.L.inquiry.steps || S.steps).join(' '), 1); model.enter && model.enter(); }, leave: function () { model.leave && model.leave(); } };
  }

  /* ================== DÉFI CHRONOMÉTRÉ ================== */
  function buildDefi(root, D, ctx) {
    var teams = [], mi = 0, timeLeft = 0, run = false, hintUsed = false, cur = null, results = [], tickT = 0;
    function lvl() { return PROF.level; }
    function intro() {
      root.innerHTML = '';
      var wrap = h('div', { style: 'flex:1;display:flex;gap:26px;align-items:center;justify-content:center' }, root);
      h('div', {}, wrap, lumi(150, 'happy2'));
      var col = h('div', { style: 'max-width:620px;display:flex;flex-direction:column;gap:14px' }, wrap);
      h('span', { class: 'kick', style: 'color:var(--green)' }, col, 'Défi · ' + D.missions.length + (PROF.timed ? ' missions chronométrées' : ' missions sans chronomètre'));
      h('h1', { style: 'margin:0;font:800 calc(42px*var(--fs))/1.08 var(--f-display)' }, col, D.title);
      h('p', { style: 'margin:0;font-size:calc(18px*var(--fs));line-height:1.45;color:var(--soft)' }, col, D.intro);
      h('p', { style: 'margin:0;font-size:15px;color:var(--muted)' }, col, '100 points par mission réussie + 10 par seconde restante. 3 étoiles si tu réussis vite, sans indice. En équipes, chaque équipe joue à son tour le même nombre de missions.');
      var r = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' }, col);
      h('button', { class: 'btn big primary' }, r, 'Jouer seul ▸').onclick = function () { begin(['Moi']); };
      var tn = PROF.teams.slice(0, PROF.nTeams); if (PROF.nTeams > 1) { var nm = D.missions.length, kk = Math.max(1, Math.floor(nm / PROF.nTeams)), tt = kk * PROF.nTeams; h('p', { style: 'margin:0;font-size:13px;color:var(--muted)' }, col, 'En équipes : ' + kk + ' mission' + (kk > 1 ? 's' : '') + ' par équipe, soit ' + tt + ' sur ' + nm + (tt < nm ? ' (les ' + (nm - tt) + ' dernières ne sont pas jouées, pour que chaque équipe joue autant)' : tt > nm ? ' (certaines missions sont rejouées par une autre équipe)' : '') + '.'); }
      if (PROF.nTeams > 1) h('button', { class: 'btn big' }, r, 'Jouer en ' + PROF.nTeams + ' équipes').onclick = function () { begin(tn); };
      h('p', { style: 'margin:0;font-size:13px;color:var(--dim)' }, col, 'Les noms et le nombre d’équipes se règlent dans le mode enseignant (cadenas, en haut).');
    }
    var total = 0;
    function begin(names) { teams = names.map(function (n, i) { return { n: n, c: TEAMC[i], pts: 0, stars: [] }; }); mi = 0; results = []; total = teams.length === 1 ? D.missions.length : teams.length * Math.max(1, Math.floor(D.missions.length / teams.length)); mission(); }
    function mtime() { var base = PROF.time || 60; return lvl() === 'dec' ? Math.max(base, 90) : lvl() === 'exp' ? Math.round(base / 2) : base; }
    function mission() {
      root.innerHTML = ''; hintUsed = false;
      var M = D.missions[mi % D.missions.length], team = teams[mi % teams.length];
      var hd = h('div', { style: 'display:flex;align-items:center;gap:14px' }, root);
      h('span', { class: 'kick', style: 'color:var(--green)' }, hd, 'Défi · ' + esc(ctx.L.title));
      h('div', { style: 'flex:1' }, hd);
      var dots = h('div', { class: 'dots', 'aria-label': 'Mission ' + (mi + 1) + ' sur ' + total }, hd);
      for (var di = 0; di < total; di++) h('span', { class: di < mi ? (results[di] ? 'done' : 'miss') : di === mi ? 'cur' : '' }, dots);
      h('b', { style: 'margin-left:8px' }, dots, 'Mission ' + (mi + 1) + ' / ' + total);
      var body = h('div', { style: 'flex:1;min-height:0;display:flex;gap:20px' }, root);
      var left = h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;gap:14px' }, body);
      var card = h('div', { class: 'mission' }, left);
      var ring = h('div', {}, card);
      var txt = h('div', { style: 'flex:1;display:flex;flex-direction:column;gap:8px' }, card);
      h('span', { class: 'sub' }, txt, (teams.length > 1 ? '<span style="color:' + team.c + '">● Équipe ' + esc(team.n) + '</span> · ' : '') + 'Mission ' + (mi + 1) + ' · ' + esc(M.title));
      h('h1', {}, txt, M.text);
      var area = h('div', { style: 'flex:1;min-height:0;display:flex;gap:16px' }, left);
      var play = h('div', { style: 'flex:1;min-width:0;background:var(--scene);border:1px solid var(--line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px' }, area);
      var lm = h('div', { style: 'width:280px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px' }, area);
      var bub = h('div', { class: 'bubble', 'aria-live': 'polite' }, lm, M.lumi || 'À toi de jouer !');
      var lumiEl = h('div', {}, lm, lumi(96));
      if (PROF.board) board(body, team);
      // zone de jeu
      var api = { root: play, h: h, s: s, attr: attr, fmt: fmt, clamp: clamp, set: SET, c: controls(play), loop: function (f) { var st = loop(function (dt, TT) { if (!root.hidden && run) f(dt * SET.speed, TT); }); cleanups.push(st); return st; }, gauss: gauss };
      var cleanups = [];
      cur = { M: M, team: team, api: api, cleanups: cleanups, bub: bub, lumiEl: lumiEl };
      if (M.type === 'qcm') {
        var g = h('div', { class: 'opts' }, play);
        M.o.forEach(function (o, j) { var b = h('button', { type: 'button' }, g, o); b.onclick = function () { if (!run) return; g.querySelectorAll('button').forEach(function (x, k) { x.disabled = true; if (k === M.a) x.className = 'good'; else if (k === j) x.className = 'bad'; }); finish(j === M.a, j === M.a ? M.e : M.e); }; });
      } else {
        cur.check = M.build(api);
        var br = h('div', { style: 'display:flex;gap:10px;margin-top:auto' }, play);
        h('button', { class: 'btn big primary', style: 'flex:1' }, br, 'Valider').onclick = function () {
          if (!run) return; var r = cur.check(); if (r.ok) finish(true, r.msg); else { say(r.msg || 'Pas encore… compare ton essai à la consigne.', 'think'); sound('bad'); }
        };
        cur.hintB = h('button', { class: 'btn big' }, br, 'Indice');
        if (lvl() === 'exp' || !SET.hints) cur.hintB.style.display = 'none';
      }
      if (M.hint && cur.hintB) cur.hintB.onclick = function () { if (!run) return; if (!hintUsed) { hintUsed = true; cur.hintB.textContent = 'Indice (utilisé)'; } say(M.hint, 'think'); };
      if (M.type === 'qcm' && M.hint && SET.hints && lvl() !== 'exp') { var hb = h('button', { class: 'btn', style: 'align-self:flex-start' }, play, 'Indice'); hb.onclick = function () { if (!run) return; hintUsed = true; say(M.hint, 'think'); }; }
      timeLeft = mtime(); var T0 = timeLeft; run = true;
      function drawRing() { if (!PROF.timed) { ring.textContent = 'Sans chronomètre'; return; } var k = timeLeft / T0, C = 2 * Math.PI * 58; ring.innerHTML = '<svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="Il reste ' + Math.ceil(timeLeft) + ' secondes"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="66" cy="66" r="58" fill="none" stroke="' + (k < 0.25 ? 'var(--red)' : 'var(--amber)') + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (C * k) + ' ' + C + '" transform="rotate(-90 66 66)"/><text x="66" y="77" text-anchor="middle" font-size="32" font-weight="800" fill="var(--text)" font-family="Bricolage Grotesque, sans-serif">' + Math.floor(Math.ceil(timeLeft) / 60) + ':' + ('0' + (Math.ceil(timeLeft) % 60)).slice(-2) + '</text></svg>'; }
      drawRing();
      var tl = loop(function (dt) {
        if (!run || root.hidden || !PROF.timed) return;
        timeLeft -= dt; tickT += dt;
        if (timeLeft <= 10 && tickT > 1) { tickT = 0; sound('tick'); }
        drawRing();
        if (timeLeft <= 0) { timeLeft = 0; drawRing(); finish(false, 'Temps écoulé ! ' + (M.e || '')); }
      });
      cleanups.push(tl);
      if (SET.tts) speak(M.text.replace(/<[^>]+>/g, ''), 1);
      function say(t, mood) { bub.innerHTML = t; lumiEl.innerHTML = lumi(96, mood); }
      cur.say = say;
    }
    function board(parent, team) {
      var b = h('aside', { class: 'board', 'aria-label': 'Classement' }, parent);
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center' }, b, '<b style="font:800 20px var(--f-display)">' + (teams.length > 1 ? 'Classement' : 'Mon score') + '</b><span style="font-size:13px;color:var(--muted)">' + (teams.length > 1 ? teams.length + ' équipes · 1 écran' : 'solo') + '</span>');
      teams.slice().sort(function (a, c) { return c.pts - a.pts; }).forEach(function (t, i) {
        h('div', { class: 'team' + (t === team ? ' turn' : '') }, b, '<span class="rk">' + (i + 1) + '</span><span class="dot" style="background:' + t.c + '"></span><div class="nm"><b>' + esc(t.n) + '</b><span>' + (t.stars.length ? t.stars.map(function (n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }).join(' ') : '—') + (t === team ? ' · à vous !' : '') + '</span></div><span class="pts">' + t.pts + '</span>');
      });
      h('div', { style: 'flex:1' }, b);
    }
    function finish(ok, msg) {
      if (!run) return; run = false;
      var M = cur.M, team = cur.team, stars = 0, pts = 0;
      if (ok) { stars = 3; pts = 100; team.pts += pts; team.stars.push(stars); sound('win'); confetti(ctx.stage); }
      else { team.stars.push(0); sound('bad'); }
      results[mi] = ok;
      cur.say((ok ? '<b>Réussi ! +' + pts + ' points</b> ' + '★'.repeat(stars) + '<br>' : '<b>Raté…</b><br>') + (PROF.corr || ok ? (msg || '') : 'On en parle avec le professeur ?'), ok ? 'wow' : 'sad');
      var nxt = h('button', { class: 'btn big primary', style: 'align-self:stretch' }, cur.lumiEl.parentNode, mi + 1 < total ? (teams.length > 1 ? 'Au tour de ' + esc(teams[(mi + 1) % teams.length].n) + ' ▸' : 'Mission suivante ▸') : 'Voir le résultat ▸');
      nxt.onclick = function () { cur.cleanups.forEach(function (f) { f(); }); mi++; if (mi < total) mission(); else end(); };
      nxt.focus();
    }
    function end() {
      root.innerHTML = '';
      var sorted = teams.slice().sort(function (a, b) { return b.pts - a.pts; }), win = sorted[0];
      var w = h('div', { style: 'flex:1;display:flex;gap:30px;align-items:center;justify-content:center' }, root);
      h('div', {}, w, lumi(170, 'wow'));
      var col = h('div', { style: 'display:flex;flex-direction:column;gap:14px;min-width:420px' }, w);
      h('span', { class: 'kick', style: 'color:var(--green)' }, col, 'Défi terminé');
      h('h1', { style: 'margin:0;font:800 calc(44px*var(--fs))/1.05 var(--f-display)' }, col, teams.length > 1 ? 'Victoire de l’équipe ' + esc(win.n) + ' !' : win.pts + ' points · ' + results.filter(Boolean).length + ' / ' + total + ' missions');
      var b = h('div', { class: 'board', style: 'width:auto' }, col);
      sorted.forEach(function (t, i) { h('div', { class: 'team' + (i === 0 ? ' turn' : '') }, b, '<span class="rk">' + (i + 1) + '</span><span class="dot" style="background:' + t.c + '"></span><div class="nm"><b>' + esc(t.n) + '</b><span>' + t.stars.reduce(function (a, x) { return a + x; }, 0) + ' étoiles</span></div><span class="pts">' + t.pts + '</span>'); });
      var r = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' }, col);
      h('button', { class: 'btn big' }, r, 'Rejouer').onclick = intro;
      h('button', { class: 'btn big primary' }, r, 'Quiz de sortie ▸').onclick = function () { ctx.go('quiz'); };
      ctx.done(); sound('win'); confetti(ctx.stage); setTimeout(function () { confetti(ctx.stage); }, 700);
      try { localStorage.setItem('pc-studio-defi-' + ctx.L.id, JSON.stringify({ at: Date.now(), teams: sorted.map(function (t) { return { n: t.n, pts: t.pts }; }) })); } catch (e) {}
    }
    intro();
    var paused = false;
    function pause() { if (run) { paused = true; run = false; } }
    function resume() { if (paused) { paused = false; run = true; } }
    return { enter: resume, leave: pause, resume: resume };
  }

  window.Studio = { start: start, kit: kit, h: h, s: s, attr: attr, fmt: fmt, esc: esc, clamp: clamp, ease: ease, lumi: lumi, settings: SET, prof: PROF, progress: PROG, applySettings: applySettings, onSettings: onSettings, loop: loop, speak: speak, sound: sound, confetti: confetti, chart: chart, gauss: gauss, store: store, save: save };
})();

