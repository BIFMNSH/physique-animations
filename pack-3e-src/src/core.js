/* Pack 3e — cadre commun des simulations (aucune bibliothèque, aucun réseau).
   Chaque module appelle Lab.register({...}) ; voir SPEC.md pour l'API de `c`. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var Lab = window.Lab = { mods: [], reg: {}, cur: null };
  Lab.register = function (d) { Lab.mods.push(d); Lab.reg[d.id] = d; };

  /* ---------- petits outils ---------- */
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  var STYLE_ATTRS = { fill: 1, stroke: 1, 'stop-color': 1, color: 1 };
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (k === 'text') e.textContent = v;
      else if (STYLE_ATTRS[k] && typeof v === 'string' && v.indexOf('var(') === 0) e.style.setProperty(k, v);
      else e.setAttribute(k, v);
    }
    if (parent) parent.appendChild(e);
    return e;
  }
  function fmt(x, d) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    d = d === undefined ? 1 : d;
    return Number(x).toFixed(d).replace('.', ',').replace('-', '−');
  }
  var seed = 12345;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) / 0.58; }
  function nice(lo, hi, n) {
    var span = hi - lo || 1, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = span / n / step;
    step *= err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1;
    var a = Math.ceil(lo / step - 1e-9) * step, out = [];
    for (var v = a; v <= hi + 1e-9; v += step) out.push(Math.round(v / step) * step);
    return out;
  }
  Lab.h = h; Lab.s = s; Lab.fmt = fmt;
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---------- thème ---------- */
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  applyTheme(store('p3-theme'));
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme');
    var dark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var n = dark ? 'light' : 'dark'; applyTheme(n); store('p3-theme', n);
  }

  /* ---------- page d'accueil ---------- */
  var THEMES = [
    ['meca', 'Mécanique', 'Forces, équilibre, travail'],
    ['chimie', 'Chimie', 'Électrolyse, alcanes, oxydation, réduction'],
    ['optique', 'Optique', 'Lentilles et œil']
  ];
  function topbar(back) {
    var t = h('div', { class: 'top' });
    t.appendChild(h('span', { class: 'brand', text: 'Physique-Chimie · 3e · programme MENA' }));
    t.appendChild(h('span', { class: 'sp' }));
    var b = h('button', { class: 'pill', type: 'button', text: 'Thème clair / sombre' });
    b.onclick = toggleTheme; t.appendChild(b);
    return t;
  }
  function home(app) {
    app.innerHTML = '';
    app.appendChild(topbar());
    var sec = h('section', { class: 'home' });
    sec.appendChild(h('h1', { text: 'Le laboratoire de 3e, sans salle de TP' }));
    sec.appendChild(h('p', { class: 'lead', text: 'Neuf simulations qui suivent la progression 2026-2027 de 3e : tu manipules, tu relèves des mesures, tu conclus, puis tu vérifies avec le quiz. Un badge s’affiche quand tu réussis au moins 4 questions sur 5.' }));
    THEMES.forEach(function (th) {
      var mods = Lab.mods.filter(function (m) { return m.theme === th[0]; });
      if (!mods.length) return;
      var hh = h('div', { class: 'theme-h' }); hh.appendChild(h('span', { text: th[1] })); hh.appendChild(h('small', { text: th[2] }));
      sec.appendChild(hh);
      var g = h('div', { class: 'grid' });
      mods.forEach(function (m) {
        var a = h('a', { class: 'card', href: '#' + m.id });
        var th2 = h('div', { class: 'thumb' });
        if (m.thumb) { th2.innerHTML = '<svg viewBox="0 0 160 78" aria-hidden="true">' + m.thumb + '</svg>'; }
        a.appendChild(th2);
        a.appendChild(h('h3', { text: m.title }));
        a.appendChild(h('p', { text: m.objective }));
        var ch = h('div', { class: 'chips' });
        ch.appendChild(h('span', { class: 'chip les', text: 'Leçon : ' + m.lesson }));
        (m.skills || []).forEach(function (k) { ch.appendChild(h('span', { class: 'chip', text: k })); });
        a.appendChild(ch);
        var sc = store('p3-q-' + m.id);
        if (sc !== null && sc >= 4) a.appendChild(h('span', { class: 'badge', text: '✓ ' + sc + '/5' }));
        g.appendChild(a);
      });
      sec.appendChild(g);
    });
    app.appendChild(sec);
  }

  /* ---------- page d'un module ---------- */
  function run(def, app) {
    app.innerHTML = '';
    app.appendChild(topbar());
    var root = h('section', { class: 'mod' });
    app.appendChild(root);
    var back = h('a', { class: 'pill back', href: '#', text: '← Tous les modules' });
    root.appendChild(back);
    root.appendChild(h('h2', { text: def.title }));
    root.appendChild(h('p', { class: 'obj', text: def.objective }));
    var sk = h('div', { class: 'skills' });
    sk.appendChild(h('span', { class: 'chip les', text: 'Leçon : ' + def.lesson }));
    (def.skills || []).forEach(function (k) { sk.appendChild(h('span', { class: 'chip', text: k })); });
    root.appendChild(sk);

    var layout = h('div', { class: 'layout' }); root.appendChild(layout);
    var left = h('div'); var right = h('aside', { class: 'panel' });
    layout.appendChild(left); layout.appendChild(right);

    var H = def.height || 420, W = 800;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'scene', role: 'img', 'aria-label': def.alt || def.title });
    left.appendChild(svg);
    var msg = h('div', { class: 'msg', role: 'status', 'aria-live': 'polite', text: def.hint || 'Manipule les commandes à droite.' });
    left.appendChild(msg);
    var chartHost = h('div', { class: 'chartbox box' }); chartHost.hidden = true; left.appendChild(chartHost);

    var stepsBox = h('div', { class: 'box' });
    stepsBox.appendChild(h('h3', { text: 'À faire' }));
    var ol = h('ol', { class: 'steps' }); (def.steps || []).forEach(function (t) { ol.appendChild(h('li', { html: t })); });
    stepsBox.appendChild(ol); right.appendChild(stepsBox);
    var ctrlBox = h('div', { class: 'box' }); right.appendChild(ctrlBox);
    var readBox = h('div', { class: 'reads' }); right.appendChild(readBox);
    var actBox = h('div', { class: 'row' }); right.appendChild(actBox);

    /* Mesures */
    var low = h('div', { class: 'low' }); root.appendChild(low);
    var mBox = h('div', { class: 'box wide' }); mBox.appendChild(h('h3', { text: 'Mes mesures' }));
    var tw = h('div', { class: 'tw' }); mBox.appendChild(tw);
    var resBox = h('div', { class: 'results', 'aria-live': 'polite' }); mBox.appendChild(resBox);
    low.appendChild(mBox);
    var rBox = h('div', { class: 'box' }); rBox.appendChild(h('h3', { text: 'Je retiens' }));
    var ul = h('ul', { class: 'retiens' }); (def.retiens || []).forEach(function (t) { ul.appendChild(h('li', { html: t })); });
    rBox.appendChild(ul); low.appendChild(rBox);
    var qBox = h('div', { class: 'box quiz' }); qBox.appendChild(h('h3', { text: 'Quiz de vérification' })); low.appendChild(qBox);

    /* ---- API passée au module ---- */
    var updaters = [], resets = [], loops = [], tableRows = [], tableCfg = null, chart = null, last = 0, alive = true;
    var c = { s: function (t, a, p) { return s(t, a, p || svg); }, W: W, H: H, svg: svg, fmt: fmt, h: h };
    c.update = function () { updaters.forEach(function (f) { f(); }); };
    c.say = function (t, kind) { msg.className = 'msg' + (kind ? ' ' + kind : ''); msg.textContent = t; };
    c.noise = function (v, rel) { return v * (1 + (rel || 0.01) * gauss()); };
    c.rand = rnd;
    c.onReset = function (f) { resets.push(f); };
    c.onUpdate = function (f) { updaters.push(f); f(); };
    c.loop = function (f) { loops.push(f); };
    c.results = function (html) { resBox.innerHTML = html || ''; };

    c.slider = function (label, o) {
      var id = 'sl-' + Math.random().toString(36).slice(2, 8);
      var wrap = h('div', { class: 'ctl' });
      var out = h('output', { for: id });
      var lb = h('label', { for: id }); lb.appendChild(h('span', { html: label })); lb.appendChild(out); wrap.appendChild(lb);
      var inp = h('input', { type: 'range', id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value });
      wrap.appendChild(inp); ctrlBox.appendChild(wrap);
      var dig = o.digits !== undefined ? o.digits : (String(o.step || 1).indexOf('.') >= 0 ? String(o.step).split('.')[1].length : 0);
      var api = {
        get: function () { return parseFloat(inp.value); },
        set: function (v) { inp.value = v; show(); },
        el: inp, wrap: wrap, disable: function (b) { inp.disabled = b; }
      };
      function show() { out.textContent = fmt(api.get(), dig) + (o.unit ? ' ' + o.unit : ''); }
      inp.addEventListener('input', function () { show(); if (o.onInput) o.onInput(api.get()); c.update(); });
      show(); resets.push(function () { inp.value = o.value; show(); if (o.onInput) o.onInput(o.value); });
      return api;
    };
    c.choice = function (label, opts, onChange, init) {
      var wrap = h('div', { class: 'ctl' }); wrap.appendChild(h('div', { class: 'lab', html: label }));
      var seg = h('div', { class: 'seg', role: 'group', 'aria-label': label.replace(/<[^>]+>/g, '') }); wrap.appendChild(seg);
      var cur = init !== undefined ? init : opts[0].v, btns = [];
      opts.forEach(function (op) {
        var b = h('button', { type: 'button', html: op.label, 'aria-pressed': String(op.v === cur) });
        b.onclick = function () { set(op.v, true); }; seg.appendChild(b); btns.push([b, op.v]);
      });
      function set(v, fire) { cur = v; btns.forEach(function (p) { p[0].setAttribute('aria-pressed', String(p[1] === v)); }); if (fire && onChange) onChange(v); c.update(); }
      ctrlBox.appendChild(wrap);
      resets.push(function () { set(init !== undefined ? init : opts[0].v, true); });
      return { get: function () { return cur; }, set: function (v) { set(v, true); }, wrap: wrap };
    };
    c.toggle = function (label, onChange, init) {
      var wrap = h('div', { class: 'ctl' }); var b = h('button', { type: 'button', class: 'btn', html: label, 'aria-pressed': String(!!init) });
      var on = !!init;
      function paint() { b.setAttribute('aria-pressed', String(on)); b.style.background = on ? 'var(--ink)' : ''; b.style.color = on ? 'var(--bg)' : ''; }
      b.onclick = function () { on = !on; paint(); if (onChange) onChange(on); c.update(); };
      paint(); wrap.appendChild(b); ctrlBox.appendChild(wrap);
      resets.push(function () { on = !!init; paint(); if (onChange) onChange(on); });
      return { get: function () { return on; }, set: function (v) { on = !!v; paint(); if (onChange) onChange(on); }, wrap: wrap };
    };
    c.button = function (label, fn, o) {
      o = o || {};
      var b = h('button', { type: 'button', class: 'btn' + (o.primary ? ' primary' : ''), html: label });
      if (o.hold) { /* maintenir appuyé */
        var t = null;
        var stop = function () { clearInterval(t); t = null; if (o.hold.up) o.hold.up(); };
        b.addEventListener('pointerdown', function (e) { e.preventDefault(); if (o.hold.down) o.hold.down(); t = setInterval(function () { o.hold.tick(); c.update(); }, o.hold.every || 80); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, function () { if (t) stop(); }); });
      } else b.onclick = function () { fn(); c.update(); };
      (o.into === 'ctrl' ? ctrlBox : actBox).appendChild(b);
      return b;
    };
    c.readout = function (label, fn, unit, digits) {
      var box = h('div', { class: 'read' }); var sm = h('small', { text: label }); var b = h('b', { text: '—' });
      box.appendChild(sm); box.appendChild(b); readBox.appendChild(box);
      var u = function () { var v = fn(); b.textContent = (typeof v === 'string' ? v : fmt(v, digits === undefined ? 1 : digits)) + (unit && typeof v !== 'string' ? ' ' + unit : ''); };
      updaters.push(u); u(); return box;
    };
    c.table = function (cfg) { /* cfg: {cols:[{key,label,unit,d,txt}], max, onChange(rows)} */
      tableCfg = cfg; renderTable();
    };
    function renderTable() {
      tw.innerHTML = ''; if (!tableCfg) { mBox.hidden = true; return; }
      var t = h('table', { class: 't' }); var hd = h('tr'); hd.appendChild(h('th', { text: 'n°' }));
      tableCfg.cols.forEach(function (k) { hd.appendChild(h('th', { text: k.label + (k.unit ? ' (' + k.unit + ')' : '') })); });
      hd.appendChild(h('th', { text: '' })); t.appendChild(hd);
      if (!tableRows.length) { var er = h('tr'); er.appendChild(h('td', { class: 'txt', colspan: String(tableCfg.cols.length + 2), text: 'Aucune mesure : appuie sur le bouton orange pour en relever.' })); t.appendChild(er); }
      tableRows.forEach(function (r, i) {
        var tr = h('tr'); tr.appendChild(h('td', { text: String(i + 1) }));
        tableCfg.cols.forEach(function (k) { var v = r[k.key]; tr.appendChild(h('td', { class: k.txt ? 'txt' : '', text: typeof v === 'number' ? fmt(v, k.d === undefined ? 1 : k.d) : (v === undefined ? '' : v) })); });
        var x = h('button', { type: 'button', class: 'x', 'aria-label': 'Supprimer la mesure ' + (i + 1), text: '×' });
        x.onclick = function () { tableRows.splice(i, 1); renderTable(); if (tableCfg.onChange) tableCfg.onChange(tableRows); };
        var td = h('td'); td.appendChild(x); tr.appendChild(td); t.appendChild(tr);
      });
      tw.appendChild(t);
    }
    c.measure = function (label, fn) {
      var b = c.button(label, function () {
        var r = fn(); if (!r) return;
        var max = (tableCfg && tableCfg.max) || 12;
        if (tableRows.length >= max) { c.say('Tableau plein (' + max + ' mesures) : supprime une ligne avec ×.', 'warn'); return; }
        tableRows.push(r); renderTable(); if (tableCfg && tableCfg.onChange) tableCfg.onChange(tableRows);
      }, { primary: true });
      return b;
    };
    c.rows = function () { return tableRows; };

    /* graphique */
    c.chart = function (cfg) {
      /* cfg: {x:{label,unit,min,max}, y:{...}, fit:'origin'|'line'|null, series:[{id,name,color}]} */
      chartHost.hidden = false; chartHost.innerHTML = '';
      var CW = 800, CH = 250, m = { l: 66, r: 20, t: 16, b: 46 };
      var cs = s('svg', { viewBox: '0 0 ' + CW + ' ' + CH, class: 'scene', role: 'img', 'aria-label': 'Graphique ' + cfg.y.label + ' en fonction de ' + cfg.x.label });
      chartHost.appendChild(cs);
      var pts = {}; var series = cfg.series || [{ id: 'a', name: '', color: 'var(--s1)' }];
      series.forEach(function (sr) { pts[sr.id] = []; });
      var marker = null;
      function sx(v) { return m.l + (v - cfg.x.min) / (cfg.x.max - cfg.x.min) * (CW - m.l - m.r); }
      function sy(v) { return CH - m.b - (v - cfg.y.min) / (cfg.y.max - cfg.y.min) * (CH - m.t - m.b); }
      function draw() {
        cs.innerHTML = '';
        nice(cfg.x.min, cfg.x.max, 8).forEach(function (v) { s('line', { x1: sx(v), x2: sx(v), y1: m.t, y2: CH - m.b, stroke: 'var(--scene-muted)', 'stroke-opacity': .25 }, cs); s('text', { x: sx(v), y: CH - m.b + 18, 'text-anchor': 'middle', 'font-size': 13, text: fmt(v, v % 1 ? 1 : 0) }, cs); });
        nice(cfg.y.min, cfg.y.max, 5).forEach(function (v) { s('line', { y1: sy(v), y2: sy(v), x1: m.l, x2: CW - m.r, stroke: 'var(--scene-muted)', 'stroke-opacity': .25 }, cs); s('text', { x: m.l - 8, y: sy(v) + 4, 'text-anchor': 'end', 'font-size': 13, text: fmt(v, v % 1 ? 1 : 0) }, cs); });
        s('rect', { x: m.l, y: m.t, width: CW - m.l - m.r, height: CH - m.t - m.b, fill: 'none', stroke: 'var(--scene-line)' }, cs);
        s('text', { x: (m.l + CW - m.r) / 2, y: CH - 8, 'text-anchor': 'middle', 'font-size': 14, text: cfg.x.label + (cfg.x.unit ? ' (' + cfg.x.unit + ')' : '') }, cs);
        s('text', { x: 16, y: (m.t + CH - m.b) / 2, 'text-anchor': 'middle', 'font-size': 14, transform: 'rotate(-90 16 ' + ((m.t + CH - m.b) / 2) + ')', text: cfg.y.label + (cfg.y.unit ? ' (' + cfg.y.unit + ')' : '') }, cs);
        series.forEach(function (sr, si) {
          var p = pts[sr.id];
          var f = fitOf(p);
          if (cfg.fit && f) {
            var x0 = cfg.x.min, x1 = cfg.x.max;
            s('line', { x1: sx(x0), y1: sy(f.a * x0 + f.b), x2: sx(x1), y2: sy(f.a * x1 + f.b), stroke: sr.color, 'stroke-width': 2, 'stroke-dasharray': '6 4', 'clip-path': 'url(#cl)' }, cs);
          }
          if (cfg.line) { var d = p.slice().sort(function (a, b) { return a[0] - b[0]; }).map(function (q, i) { return (i ? 'L' : 'M') + sx(q[0]) + ' ' + sy(q[1]); }).join(''); if (d) s('path', { d: d, fill: 'none', stroke: sr.color, 'stroke-width': 2 }, cs); }
          p.forEach(function (q) { s('circle', { cx: sx(q[0]), cy: sy(q[1]), r: 5, fill: sr.color, stroke: 'var(--scene)', 'stroke-width': 1.5 }, cs); });
          if (sr.name) { s('text', { x: m.l + 10 + si * 130, y: m.t + 16, 'font-size': 13, fill: sr.color, text: '● ' + sr.name }, cs).style.fill = sr.color; }
        });
        if (marker) s('circle', { cx: sx(marker[0]), cy: sy(marker[1]), r: 7, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 3 }, cs);
        var defs = s('defs', {}, cs); var cp = s('clipPath', { id: 'cl' }, defs); s('rect', { x: m.l, y: m.t, width: CW - m.l - m.r, height: CH - m.t - m.b }, cp);
      }
      function fitOf(p) {
        if (p.length < 2) return null; var n = p.length, sxx = 0, sxy = 0, sx1 = 0, sy1 = 0;
        if (cfg.fit === 'origin') { p.forEach(function (q) { sxx += q[0] * q[0]; sxy += q[0] * q[1]; }); return sxx ? { a: sxy / sxx, b: 0 } : null; }
        p.forEach(function (q) { sx1 += q[0]; sy1 += q[1]; sxx += q[0] * q[0]; sxy += q[0] * q[1]; });
        var den = n * sxx - sx1 * sx1; if (!den) return null; var a = (n * sxy - sx1 * sy1) / den; return { a: a, b: (sy1 - a * sx1) / n };
      }
      var api = {
        point: function (x, y, id) { pts[id || series[0].id].push([x, y]); draw(); },
        setPoints: function (arr, id) { pts[id || series[0].id] = arr.slice(); draw(); },
        clear: function (id) { if (id) pts[id] = []; else series.forEach(function (sr) { pts[sr.id] = []; }); marker = null; draw(); },
        marker: function (x, y) { marker = (x === null || x === undefined) ? null : [x, y]; draw(); },
        fit: function (id) { return fitOf(pts[id || series[0].id]); },
        count: function (id) { return pts[id || series[0].id].length; }
      };
      draw(); resets.push(function () { api.clear(); });
      c.chartApi = api; return api;
    };

    c.drag = function (el, o) { /* souris et doigt ; coordonnées SVG */
      function pt(e) { var r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
      var on = false;
      el.style.cursor = 'grab'; el.style.touchAction = 'none';
      el.addEventListener('pointerdown', function (e) { on = true; el.setPointerCapture(e.pointerId); e.preventDefault(); var p = pt(e); if (o.start) o.start(p.x, p.y, e); });
      el.addEventListener('pointermove', function (e) { if (!on) return; var p = pt(e); if (o.move) o.move(p.x, p.y, e); c.update(); });
      var end = function (e) { if (!on) return; on = false; var p = pt(e); if (o.end) o.end(p.x, p.y, e); };
      el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    };

    c.button('Remettre à zéro', function () {
      tableRows = []; renderTable(); resBox.innerHTML = ''; resets.forEach(function (f) { f(); }); c.say(def.hint || 'Manipule les commandes.'); c.update();
    });

    /* ---- construction ---- */
    def.build(c);
    if (!tableCfg) mBox.hidden = true;
    c.update();

    /* ---- quiz ---- */
    (function () {
      var qi = 0, score = 0; var body = h('div'); qBox.appendChild(body);
      function show() {
        body.innerHTML = '';
        if (qi >= def.quiz.length) {
          store('p3-q-' + def.id, Math.max(store('p3-q-' + def.id) || 0, score));
          body.appendChild(h('p', { class: 'q', text: 'Score : ' + score + ' / ' + def.quiz.length + (score >= 4 ? ' — badge gagné !' : ' — relis « Je retiens » et recommence.') }));
          var r = h('button', { type: 'button', class: 'btn', text: 'Recommencer' }); r.onclick = function () { qi = 0; score = 0; show(); }; body.appendChild(r); return;
        }
        var q = def.quiz[qi];
        body.appendChild(h('div', { class: 'sr', text: 'Question ' + (qi + 1) }));
        body.appendChild(h('p', { class: 'q', html: (qi + 1) + '/' + def.quiz.length + ' — ' + q.q }));
        var done = false;
        q.o.forEach(function (t, i) {
          var b = h('button', { type: 'button', class: 'opt', html: t });
          b.onclick = function () {
            if (done) return; done = true; if (i === q.a) score++;
            Array.prototype.forEach.call(body.querySelectorAll('.opt'), function (x, j) { x.classList.add(j === q.a ? 'good' : (j === i ? 'wrong' : '')); });
            body.appendChild(h('p', { class: 'ex', html: (i === q.a ? 'Bravo. ' : 'Pas tout à fait. ') + q.e }));
            var n = h('button', { type: 'button', class: 'btn primary', text: qi + 1 < def.quiz.length ? 'Question suivante' : 'Voir mon score' }); n.onclick = function () { qi++; show(); }; body.appendChild(n);
          };
          body.appendChild(b);
        });
      }
      show();
    })();

    /* ---- animation ---- */
    function frame(t) {
      if (!alive || Lab.cur !== def) return;
      var dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
      loops.forEach(function (f) { f(dt, t / 1000); });
      requestAnimationFrame(frame);
    }
    if (loops.length) requestAnimationFrame(function (t) { last = t; requestAnimationFrame(frame); });
  }

  /* ---------- routage ---------- */
  function route() {
    var app = document.getElementById('app'); var id = location.hash.replace('#', '');
    var def = Lab.reg[id];
    Lab.cur = def || null;
    if (def) run(def, app); else home(app);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  Lab.start = route;
})();
