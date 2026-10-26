/* Page de classe simplifiée : « Continuer » puis la liste des leçons par thème.
   Lit data-level sur <html>, PROGRAMME (assets/studio/programme.js) et la progression
   « pc-studio-prog » (quatre étapes : resume, sim, defi, quiz), conservée sur l'appareil. */
(function () {
  var LV = document.documentElement.getAttribute('data-level') || '6e';
  var PRG = (window.PROGRAMME || {})[LV] || [], CI = LV === '6e';
  var STEPS = ['resume', 'sim', 'defi', 'quiz'];
  var TC = { 'var(--amber)': 'var(--t-amber)', 'var(--blue)': 'var(--t-blue)', 'var(--green)': 'var(--t-green)', 'var(--violet)': 'var(--t-violet)' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function prog() { try { return JSON.parse(localStorage.getItem('pc-studio-prog') || '{}') || {}; } catch (e) { return {}; } }
  function href(slug) { return (CI ? '../parcours-ci/?l=' : '../lecon/?l=') + slug; }
  function bar(n) { var h = ''; for (var i = 0; i < 4; i++) h += '<i' + (i < n ? ' class="on"' : '') + '></i>'; return '<span class="sp-bar" role="img" aria-label="' + n + ' étape' + (n > 1 ? 's' : '') + ' sur 4">' + h + '</span>'; }

  function render() {
    var P = prog();
    function steps(slug) { var p = P[LV + '-' + slug] || {}; return STEPS.filter(function (k) { return p[k]; }).length; }
    var ready = [];
    PRG.forEach(function (t) { t.les.forEach(function (l) { if (l.ready) ready.push(l); }); });
    /* leçon à reprendre : la dernière ouverte si elle n'est pas finie, sinon la première pas finie */
    var cur = ready.filter(function (l) { return LV + '-' + l.slug === P.last; })[0];
    if (!cur || steps(cur.slug) === 4) cur = ready.filter(function (l) { return steps(l.slug) < 4; })[0] || null;

    var box = document.getElementById('reprise');
    if (cur) {
      var n = steps(cur.slug);
      box.innerHTML = '<a class="sp-resume" href="' + href(cur.slug) + '"><small>' + (n ? 'Tu t’es arrêté ici' : 'Commence par cette leçon') + '</small><b>' + esc(cur.t) + '</b>' + bar(n) + '<span class="sp-btn">' + (n ? 'Continuer →' : 'Commencer →') + '</span></a>';
    } else if (ready.length) {
      box.innerHTML = '<div class="sp-resume"><b>Bravo, tout est terminé !</b><small>Tu peux refaire n’importe quelle leçon ci-dessous.</small></div>';
    } else box.innerHTML = '';

    var num = 0;
    document.getElementById('lecons').innerHTML = PRG.map(function (t, ti) {
      return '<section class="sp-theme" style="--tc:' + (TC[t.col] || 'var(--text)') + '" aria-labelledby="th' + ti + '"><h2 id="th' + ti + '">' + esc(t.nm) + '</h2><ol class="sp-list">' + t.les.map(function (l) {
        num++;
        if (!l.ready) return '<li><div class="sp-les soon"><span class="n" aria-hidden="true">' + num + '</span><span class="t">' + esc(l.t) + '</span><span class="s">Bientôt</span></div></li>';
        var n = steps(l.slug), isCur = cur && cur.slug === l.slug, done = n === 4;
        var state = done ? 'Terminée ✓' : isCur && n ? 'En cours' : '';
        return '<li><a class="sp-les' + (done ? ' done' : isCur ? ' cur' : '') + '" href="' + href(l.slug) + '"' + (isCur ? ' aria-current="step"' : '') + '><span class="n" aria-hidden="true">' + num + '</span><span class="t">' + esc(l.t) + '</span>' + (state ? '<span class="s">' + state + '</span>' : '') + '</a></li>';
      }).join('') + '</ol></section>';
    }).join('');
  }

  var S = window.NohobaSimple;
  if (S) { S.setClasse(LV); S.bindTheme(); }
  render();
  window.addEventListener('pageshow', function (e) { if (e.persisted) render(); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('../sw.js').catch(function () {});
})();
