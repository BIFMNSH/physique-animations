/* Socle commun du site : coque (navigation, mise à l'échelle, plein écran, thème, hors-ligne,
   quiz et fiche) + moteur de lecture des animations par étapes. */
(function () {
  var ICON_PAUSE = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="3" y="2" width="4" height="14" rx="1" fill="currentColor"/><rect x="11" y="2" width="4" height="14" rx="1" fill="currentColor"/></svg>';
  var ICON_PLAY = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 2.5 L15 9 L5 15.5 Z" fill="currentColor"/></svg>';
  var ICON_RESTART = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.5 9 A5.5 5.5 0 1 0 5.2 5"/><path d="M3 2.5 V6 H6.5"/></svg>';
  var ICON_SUN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13"/></svg>';
  var ICON_MOON = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7Z" fill="currentColor"/></svg>';

  /* Ordre des pages : une seule liste pour tout le site. */
  var PAGES = ['metal', 'solutions', 'atome', 'ions', 'tests', 'labo'];
  function slug() {
    var m = /\/([a-z-]+)\/?$/.exec(location.pathname.replace(/index\.html$/, ''));
    return m ? m[1] : '';
  }

  /* ---------- Thème clair / sombre (mémorisé) ---------- */
  function getTheme() { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('pc-theme', t); } catch (e) {}
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.innerHTML = t === 'light' ? ICON_MOON : ICON_SUN;
      b.setAttribute('aria-label', t === 'light' ? 'Passer en thème sombre' : 'Passer en thème clair');
      b.title = b.getAttribute('aria-label');
    });
  }
  window.SiteTheme = { get: getTheme, set: setTheme, toggle: function () { setTheme(getTheme() === 'light' ? 'dark' : 'light'); } };

  /* ---------- Hors-ligne : le site reste disponible sans réseau ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
    var root = location.pathname.split('/').length > 2 && slug() ? '../' : './';
    navigator.serviceWorker.register(root + 'sw.js').catch(function () {});
  }
  window.registerSW = registerSW;

  function makeBtn(cls, html, label, onClick, attr) {
    var b = document.createElement(attr === 'a' ? 'a' : 'button');
    b.className = cls; b.innerHTML = html; b.setAttribute('aria-label', label); b.title = label;
    if (onClick) b.addEventListener('click', onClick);
    return b;
  }

  /* ---------- Coque d'une page (animation ou labo) ---------- */
  window.Shell = function (opts) {
    opts = opts || {};
    var s = slug(), i = PAGES.indexOf(s);
    var app = document.querySelector('.app');
    var vp = document.querySelector('.viewport');
    var stage = document.querySelector('.stage');

    if (i >= 0) {
      var num = document.querySelector('.crumb .num');
      if (num) num.textContent = (i + 1) + ' / ' + PAGES.length;
      var prev = document.querySelector('.tb-btn[aria-label="Animation précédente"]');
      var next = document.querySelector('.tb-btn[aria-label="Animation suivante"]');
      [[prev, PAGES[i - 1]], [next, PAGES[i + 1]]].forEach(function (pair) {
        var a = pair[0], to = pair[1];
        if (!a) return;
        if (to) { a.setAttribute('href', '../' + to + '/'); a.removeAttribute('aria-disabled'); }
        else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); }
      });
    }

    /* mise à l'échelle : la scène 1280×720 remplit l'écran, centrée, sans déformation */
    function fit() {
      if (!vp || !stage) return;
      var r = vp.getBoundingClientRect();
      var pad = document.fullscreenElement ? 0 : Math.min(24, r.width * 0.02);
      var sc = Math.min((r.width - pad * 2) / 1280, (r.height - pad * 2) / 720);
      stage.style.setProperty('--s', Math.max(0.1, sc));
    }
    window.addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', fit);
    fit();

    function fullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (app && app.requestFullscreen) app.requestFullscreen();
    }
    var fsBtn = document.querySelector('[data-fs]');
    if (fsBtn) fsBtn.addEventListener('click', fullscreen);

    /* boutons ajoutés dans la barre du haut : quiz, fiche, thème */
    var bar = document.querySelector('.topbar');
    if (bar && fsBtn) {
      if (s && s !== 'labo' && s !== 'simulateur') {
        var fiche = makeBtn('tb-btn', '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4z"/><path d="M9.5 1.5V5H13M6.5 8.5h4M6.5 11h4"/></svg><span class="lbl">Fiche</span>', 'Fiche élève imprimable', null, 'a');
        fiche.href = '../fiche/?a=' + s;
        bar.insertBefore(fiche, fsBtn);
        var quizBtn = makeBtn('tb-btn quiz-btn', '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M6.2 6.2a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.6"/><circle cx="8" cy="11.6" r=".4" fill="currentColor"/></svg><span class="lbl">Quiz</span>', 'Quiz', function () { openQuiz(s); });
        bar.insertBefore(quizBtn, fsBtn);
      }
      var tb = makeBtn('tb-btn', '', '', function () { window.SiteTheme.toggle(); });
      tb.setAttribute('data-theme-btn', '');
      bar.insertBefore(tb, fsBtn);
      setTheme(getTheme());
    }

    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.querySelector('.quiz.open')) return;
      if ((e.key === 'f' || e.key === 'F') && !opts.noKeys) fullscreen();
    });

    registerSW();
    return { app: app, stage: stage, fit: fit, fullscreen: fullscreen };
  };

  /* ---------- Quiz (contenu dans assets/content.js, chargé à la demande) ---------- */
  var contentLoading = null;
  function loadContent(cb) {
    if (window.SITE_CONTENT) return cb(window.SITE_CONTENT);
    if (!contentLoading) {
      contentLoading = [];
      var sc = document.createElement('script');
      sc.src = '../assets/content.js';
      sc.onload = function () { contentLoading.forEach(function (f) { f(window.SITE_CONTENT); }); };
      document.head.appendChild(sc);
    }
    contentLoading.push(cb);
  }
  window.loadSiteContent = loadContent;

  function openQuiz(s) {
    loadContent(function (C) {
      var data = C && C.quiz[s];
      if (!data) return;
      var box = document.querySelector('.quiz');
      if (!box) {
        box = document.createElement('div');
        box.className = 'quiz';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Quiz');
        document.body.appendChild(box);
        box.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      }
      var qi = 0, score = 0, answered = false, back = document.activeElement;
      function close() { box.classList.remove('open'); box.innerHTML = ''; if (back && back.focus) back.focus(); }
      function render() {
        if (qi >= data.length) {
          var msg = score === data.length ? 'Parfait, tout est juste !' : score >= data.length - 1 ? 'Très bien !' : score >= data.length / 2 ? 'Bien ! Revois l’animation pour les points manqués.' : 'Revois l’animation, puis retente le quiz.';
          box.innerHTML = '<div class="quiz-card"><div class="quiz-top"><span class="quiz-k">Résultat</span><button class="quiz-x" aria-label="Fermer le quiz">×</button></div>' +
            '<div class="quiz-score">' + score + ' / ' + data.length + '</div><p class="quiz-msg">' + msg + '</p>' +
            '<div class="quiz-actions"><button class="quiz-go" data-again>Recommencer</button><button class="quiz-ghost" data-close>Revenir à l’animation</button></div></div>';
          box.querySelector('[data-again]').onclick = function () { qi = 0; score = 0; render(); };
          box.querySelector('[data-close]').onclick = close;
          box.querySelector('.quiz-x').onclick = close;
          box.querySelector('[data-again]').focus();
          return;
        }
        var q = data[qi]; answered = false;
        box.innerHTML = '<div class="quiz-card"><div class="quiz-top"><span class="quiz-k">Question ' + (qi + 1) + ' / ' + data.length + '</span><button class="quiz-x" aria-label="Fermer le quiz">×</button></div>' +
          '<div class="quiz-bar"><i style="width:' + (qi / data.length * 100) + '%"></i></div>' +
          '<h2 class="quiz-q">' + q.q + '</h2><div class="quiz-opts">' +
          q.o.map(function (o, k) { return '<button class="quiz-opt" data-k="' + k + '"><span class="quiz-l">' + 'ABCD'[k] + '</span><span>' + o + '</span></button>'; }).join('') +
          '</div><div class="quiz-fb" aria-live="polite"></div><div class="quiz-actions"><button class="quiz-go" data-next hidden>' + (qi === data.length - 1 ? 'Voir mon score' : 'Question suivante') + ' →</button></div></div>';
        box.querySelector('.quiz-x').onclick = close;
        box.querySelectorAll('.quiz-opt').forEach(function (b) {
          b.onclick = function () {
            if (answered) return; answered = true;
            var k = +b.getAttribute('data-k'), ok = k === q.a;
            if (ok) score++;
            box.querySelectorAll('.quiz-opt').forEach(function (o, j) {
              o.classList.add(j === q.a ? 'right' : (j === k ? 'wrong' : 'dim'));
              o.setAttribute('aria-disabled', 'true');
            });
            box.querySelector('.quiz-fb').innerHTML = '<b>' + (ok ? 'Bonne réponse.' : 'Pas tout à fait.') + '</b> ' + q.e;
            var nx = box.querySelector('[data-next]'); nx.hidden = false; nx.focus();
          };
        });
        box.querySelector('[data-next]').onclick = function () { qi++; render(); };
        box.querySelector('.quiz-opt').focus();
      }
      box.classList.add('open');
      render();
    });
  }
  window.openQuiz = openQuiz;

  /* ---------- Moteur des animations par étapes ---------- */
  window.Player = function (cfg) {
    var shell = window.Shell();
    var stage = shell.stage;
    var n = cfg.steps.length;
    var sec = cfg.stepSeconds || 6;
    var t = 0, playing = true, step = -1;
    var extra = {};

    var footer = stage.querySelector('.footer');
    footer.innerHTML =
      '<div class="progress"><div class="progress-fill"></div></div>' +
      '<div class="controls">' +
      '<button class="ctl" data-play aria-label="Mettre en pause">' + ICON_PAUSE + '</button>' +
      '<button class="ctl ghost" data-restart aria-label="Recommencer depuis le début">' + ICON_RESTART + '</button>' +
      '<div class="chips"></div><div class="grow"></div></div>';
    var fill = footer.querySelector('.progress-fill');
    var btnPlay = footer.querySelector('[data-play]');
    var chipsBox = footer.querySelector('.chips');
    var chips = cfg.steps.map(function (s, i) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.innerHTML = '<span>' + (i + 1) + '</span><span>' + s.chip + '</span>';
      b.addEventListener('click', function () { go(i); });
      chipsBox.appendChild(b);
      return b;
    });
    if (cfg.extraControl) footer.querySelector('.controls').appendChild(cfg.extraControl);

    var capBox = stage.querySelector('.cap');
    var capTitle = stage.querySelector('[data-cap-title]');
    var capText = stage.querySelector('[data-cap-text]');
    var badge = stage.querySelector('[data-badge]');

    function T() { return sec * n; }
    function setPlaying(p) {
      playing = p;
      btnPlay.innerHTML = p ? ICON_PAUSE : ICON_PLAY;
      btnPlay.setAttribute('aria-label', p ? 'Mettre en pause' : 'Lire l’animation');
    }
    function classes() {
      var c = 'stage ' + (cfg.flags ? cfg.flags(step) : '');
      for (var k in extra) if (extra[k]) c += ' ' + k;
      stage.className = c;
    }
    function apply(s) {
      step = s;
      var st = cfg.steps[s];
      classes();
      capTitle.textContent = st.title;
      capText.textContent = st.text;
      capBox.classList.remove('cap-in'); void capBox.offsetWidth; capBox.classList.add('cap-in');
      if (badge && st.badge) { badge.textContent = st.badge; badge.style.background = st.badgeColor || ''; }
      chips.forEach(function (b, i) {
        b.className = 'chip' + (i === s ? ' on' : i < s ? ' done' : '');
        if (i === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      if (cfg.onStep) cfg.onStep(s);
    }
    function update() {
      t = Math.max(0, t);
      var s = Math.min(n - 1, Math.floor(t / sec));
      if (s !== step) apply(s);
      fill.style.width = Math.min(100, (t / T()) * 100) + '%';
      if (cfg.onTick) cfg.onTick(t, step, t - step * sec);
    }
    function go(i) {
      i = Math.max(0, Math.min(n - 1, i));
      t = i * sec + 0.001; step = -1; setPlaying(true); update();
    }
    function toggle() {
      if (!playing && t >= T() - 0.01) { go(0); return; }
      setPlaying(!playing);
    }
    btnPlay.addEventListener('click', toggle);
    footer.querySelector('[data-restart]').addEventListener('click', function () { go(0); });

    /* clavier : pour piloter au vidéoprojecteur ou à la télécommande */
    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (document.querySelector('.quiz.open')) return;
      if (e.key === ' ' || e.key === 'k') { if (tag !== 'BUTTON' || e.key === 'k') { e.preventDefault(); toggle(); } }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(step + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(step - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
    });

    /* ?etape=3 dans l'adresse pour ouvrir directement une étape */
    var m = /[?&]etape=(\d+)/.exec(location.search);
    if (m) t = (Math.max(1, Math.min(n, +m[1])) - 1) * sec + 0.001;

    var prev = performance.now();
    function frame(now) {
      var dt = Math.max(0, Math.min(0.1, (now - prev) / 1000)); prev = now;
      if (playing) {
        t += dt;
        if (t >= T()) { t = T(); setPlaying(false); }
      }
      update();
      requestAnimationFrame(frame);
    }
    update();
    requestAnimationFrame(frame);

    return {
      setExtra: function (name, on) { extra[name] = !!on; classes(); },
      pause: function () { setPlaying(false); },
      go: go
    };
  };
})();
