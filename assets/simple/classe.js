/* Page de classe simplifiée : « Continuer » puis la liste des leçons par thème.
   Lit data-level sur <html>, PROGRAMME (assets/studio/programme.js) et la progression
   « pc-studio-prog » (quatre étapes : resume, sim, defi, quiz), conservée sur l'appareil. */
(function () {
  var LV = document.documentElement.getAttribute('data-level') || '6e';
  var CI = LV === '6e', LOCAL = window.NohobaEtapesCI ? window.NohobaEtapesCI.LOCAL : 'materiaux-tri-dechets';
  /* 6e : parcours propre à la collection Côte d’Ivoire, ajouté à la fin du thème Matière (copie : le programme partagé n'est pas modifié) */
  var PRG = JSON.parse(JSON.stringify((window.PROGRAMME || {})[LV] || []));
  if (CI) PRG.forEach(function (t) { if (t.nm === 'Propriétés physiques de la matière') t.les.push({ t: 'Matériaux, tri et déchets', slug: LOCAL, ready: true, local: true }); });
  /* « Pour aller plus loin » : parcours Énergie (hors programme), visible seulement quand une fiche est validée */
  if (CI && window.NohobaEtapesCI && window.NohobaEtapesCI.energieActif()) PRG.push({ nm: 'Pour aller plus loin', col: 'var(--amber)', les: [{ t: 'L’énergie du circuit', slug: window.NohobaEtapesCI.ENERGIE, ready: true, local: true }] });
  var STEPS = ['resume', 'sim', 'defi', 'quiz'];
  var TC = { 'var(--amber)': 'var(--t-amber)', 'var(--blue)': 'var(--t-blue)', 'var(--green)': 'var(--t-green)', 'var(--violet)': 'var(--t-violet)' };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function prog() { try { return JSON.parse(localStorage.getItem('pc-studio-prog') || '{}') || {}; } catch (e) { return {}; } }
  /* 6e : neuf moments par leçon (lecon-ci/) ; les parcours d'investigations locaux gardent leur page */
  var MOM = CI && window.NohobaMoments, TOT = MOM ? MOM.N : 4;
  function href(slug, local) { return (CI ? (local ? '../parcours-ci/?l=' : '../lecon-ci/?l=') : '../lecon/?l=') + slug; }
  function bar(n) { var h = ''; for (var i = 0; i < TOT; i++) h += '<i' + (i < n ? ' class="on"' : '') + '></i>'; return '<span class="sp-bar" role="img" aria-label="' + n + (MOM ? ' moment' : ' étape') + (n > 1 ? 's' : '') + ' sur ' + TOT + '">' + h + '</span>'; }

  function render() {
    var P = prog();
    /* 6e : mêmes quatre étapes que la page de leçon (Essaie, Regarde, Enquête, Vérifie) */
    var ECI = CI && window.NohobaEtapesCI;
    function steps(slug) { if (MOM) return MOM.faits(slug); if (ECI) return ECI.etapes(slug).done; var p = P[LV + '-' + slug] || {}; return STEPS.filter(function (k) { return p[k]; }).length; }
    var ready = [];
    PRG.forEach(function (t) { t.les.forEach(function (l) { if (l.ready && !l.local) ready.push(l); }); });
    /* leçon à reprendre : la dernière ouverte si elle n'est pas finie, sinon la première pas finie */
    var cur = ready.filter(function (l) { return LV + '-' + l.slug === P.last; })[0];
    /* 6e : une leçon déjà commencée (démarche ou enquête) compte comme « en cours » même sans étape Studio terminée */
    if (!cur && MOM) cur = ready.filter(function (l) { return MOM.commence(l.slug) && MOM.faits(l.slug) < TOT; })[0];
    else if (!cur && ECI) cur = ready.filter(function (l) { var e = ECI.etapes(l.slug); return e.done > 0 && e.done < 4 || e.list.some(function (x) { return x.started; }); })[0];
    if (!cur || steps(cur.slug) === TOT) cur = ready.filter(function (l) { return steps(l.slug) < TOT; })[0] || null;

    var box = document.getElementById('reprise');
    if (cur) {
      var n = steps(cur.slug), started = n || (MOM ? MOM.commence(cur.slug) : ECI && ECI.etapes(cur.slug).list.some(function (x) { return x.started; }));
      box.innerHTML = '<a class="sp-resume" href="' + href(cur.slug) + '"><small>' + (started ? 'Tu t’es arrêté ici' : 'Commence par cette leçon') + '</small><b>' + esc(cur.t) + '</b>' + bar(n) + '<span class="sp-btn">' + (started ? 'Continuer →' : 'Commencer →') + '</span></a>';
    } else if (ready.length) {
      box.innerHTML = '<div class="sp-resume"><b>Bravo, tout est terminé !</b><small>Tu peux refaire n’importe quelle leçon ci-dessous.</small></div>';
    } else box.innerHTML = '';

    var num = 0;
    document.getElementById('lecons').innerHTML = PRG.map(function (t, ti) {
      return '<section class="sp-theme" style="--tc:' + (TC[t.col] || 'var(--text)') + '" aria-labelledby="th' + ti + '"><h2 id="th' + ti + '">' + esc(t.nm) + '</h2><ol class="sp-list">' + t.les.map(function (l) {
        num++;
        if (!l.ready) return '<li><div class="sp-les soon"><span class="n" aria-hidden="true">' + num + '</span><span class="t">' + esc(l.t) + '</span><span class="s">Bientôt</span></div></li>';
        if (l.local) {
          /* parcours d'investigations : une ligne, hors de la progression des leçons */
          var R = ECI && ECI.etapes(l.slug), tot = R ? R.list.length : 0, fin = R ? R.done : 0, ok = tot && fin === tot;
          return '<li><a class="sp-les' + (ok ? ' done' : '') + '" href="' + href(l.slug, true) + '"><span class="n" aria-hidden="true">' + num + '</span><span class="t">' + esc(l.t) + '</span>' + (tot ? '<span class="s">' + (ok ? 'Terminé ✓' : fin + ' / ' + tot) + '</span>' : '') + '</a></li>';
        }
        var n = steps(l.slug), isCur = cur && cur.slug === l.slug, done = n === TOT;
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
