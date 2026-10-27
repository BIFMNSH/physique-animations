/* Leçon de 6e en neuf moments : un moment par écran, un seul gros bouton.
   Lit la configuration d'une leçon Studio (situation, prévision, critères, À retenir) sans construire
   l'interface Studio, puis embarque le résumé animé, la simulation et le défi dans un cadre (?embed=).
   Les textes de l'élève restent dans « pc-inquiry-6e-<slug> » ; la progression dans « pc-lecon-ci-<slug> ». Rien n'est envoyé. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var P = window.NohobaMoments, N = P.N;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function jr(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } }
  function jw(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var TITRES = [
    'Situation-problème',
    'J’analyse et je réponds',
    'Je formule mon hypothèse',
    'Je réalise la manipulation',
    'J’observe et j’analyse les résultats',
    'Je confronte les résultats à mon hypothèse',
    'Je rédige mon bilan',
    'Je compare avec le bilan scientifique',
    'Je relève un défi, seul ou en équipe'
  ];
  var AIDE = 'J’ai besoin d’aide en regardant une courte vidéo, puis je continue';

  var slug = (new URL(location.href).searchParams.get('l') || 'circuit-electrique').replace(/[^a-z0-9-]/g, '');
  var lecon = null, Q = null, S = null, cur = 1, sub = null, hosts = {};
  var narrow = function () { return window.innerWidth < 1000; };

  /* ---------- chargement de la leçon ---------- */
  function trouver() {
    var ok = null;
    var PR = (window.PROGRAMME && window.PROGRAMME['6e']) || [];
    PR.forEach(function (th) { th.les.forEach(function (x) { if (x.slug === slug && x.ready) ok = x; }); });
    return ok;
  }
  function charger(ok, fin) {
    var files = (slug === 'circuit-electrique' ? ['../assets/shared/conductivite-modele.js'] : [])
      .concat(ok.kit ? [].concat(ok.kit).map(function (k) { return '../assets/studio/kits/' + k + '.js'; }) : [])
      .concat('../assets/studio/lecons/' + slug + '.js');
    window.__momentsCapture = function (L) { lecon = L; };
    (function next(i) {
      if (i >= files.length) { fin(); return; }
      var sc = document.createElement('script'); sc.src = files[i];
      sc.onload = function () { next(i + 1); };
      sc.onerror = function () { fin(new Error('chargement')); };
      document.body.appendChild(sc);
    })(0);
  }

  /* ---------- état ---------- */
  function sauve() { jw('pc-inquiry-6e-' + slug, Q); }
  function atteint(m) { if (m > S.max) { S.max = m; P.ecrire(slug, S); } }
  function suivant(m) { atteint(m + 1); aller(m + 1); }

  /* ---------- cadres embarqués ---------- */
  function cadre(kind, titre) {
    if (hosts[kind]) return hosts[kind];
    var f = document.createElement('iframe');
    f.className = 'mo-frame ' + kind; f.title = titre; f.loading = 'eager';
    f.setAttribute('allow', 'fullscreen');
    f.src = '../lecon/?l=' + encodeURIComponent(slug) + '&embed=' + kind + '#' + kind;
    $('hosts').appendChild(f); hosts[kind] = f; return f;
  }
  function montre(kind, titre) {
    $('hosts').hidden = !kind; /* visible avant la création du cadre : sa taille sert à la mise à l'échelle */
    Object.keys(hosts).forEach(function (k) { hosts[k].hidden = k !== kind; });
    if (kind) cadre(kind, titre).hidden = false;
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || typeof e.data !== 'object') return;
    if (e.data.nohoba === 'studio-h') {
      Object.keys(hosts).forEach(function (k) {
        if (hosts[k].contentWindow === e.source) hosts[k].style.height = narrow() ? Math.max(480, Math.min(4000, +e.data.h || 0)) + 'px' : '';
      });
    }
  });
  window.addEventListener('resize', function () { Object.keys(hosts).forEach(function (k) { if (!narrow()) hosts[k].style.height = ''; }); });

  /* ---------- briques d'écran ---------- */
  function champ(id, label, valeur, rows) {
    return '<div class="mo-field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" rows="' + (rows || 5) + '" maxlength="2000" autocomplete="off">' + esc(valeur) + '</textarea></div>';
  }
  function lie(id, cle) { var t = $(id); t.addEventListener('input', function () { Q[cle] = t.value; if (cle !== 'reponse') Q.complete = false; sauve(); }); return t; }
  function citation(titre, texte) { return '<blockquote class="mo-quote"><b>' + titre + '</b><span>' + (texte && texte.trim() ? esc(texte) : 'Rien d’écrit pour l’instant.') + '</span></blockquote>'; }
  function exige(t, msg) { if (t.value.trim()) return true; $('mo-msg').textContent = msg; t.focus(); return false; }

  /* ---------- les neuf écrans ---------- */
  function ecran(m) {
    var I = lecon.inquiry || {}, haut = $('mo-top'), bas = $('mo-bottom'), mid = null;
    montre(null);
    $('mo-grid').className = 'mo-grid';
    var T = '<h1 class="sp-h1 mo-h1" id="mo-h1" tabindex="-1">' + TITRES[m - 1] + '</h1>';
    if (m === 1) {
      haut.innerHTML = T + '<p class="mo-big">' + esc(I.situation || '') + '</p>';
      bas.innerHTML = '<button type="button" class="sp-btn mo-go" id="mo-ok">Je commence</button>';
      $('mo-ok').onclick = function () { suivant(1); };
    } else if (m === 2 && sub === 'aide') {
      haut.innerHTML = '<h1 class="sp-h1 mo-h1" id="mo-h1" tabindex="-1">Une courte vidéo pour m’aider</h1><p class="mo-lead">' + esc(I.situation || '') + '</p>';
      montre('resume', 'Résumé animé de la leçon');
      bas.innerHTML = '<button type="button" class="sp-btn mo-go" id="mo-ok">Je continue</button>';
      $('mo-ok').onclick = function () { sub = null; ecran(2); focus(); };
    } else if (m === 2) {
      haut.innerHTML = T + '<p class="mo-lead">' + esc(I.situation || '') + '</p>';
      bas.innerHTML = champ('mo-t', 'Avec mes mots, je réponds à la question. Je peux me tromper : c’est le début de la recherche.', Q.reponse || '') +
        '<p class="mo-msg" id="mo-msg" role="status"></p><div class="mo-actions"><button type="button" class="sp-btn mo-go" id="mo-ok">Je propose une réponse</button>' +
        '<button type="button" class="sp-btn ghost" id="mo-aide">' + AIDE + '</button></div>';
      var t = lie('mo-t', 'reponse');
      $('mo-ok').onclick = function () { if (exige(t, 'Écris une réponse, même courte. Sinon, regarde la vidéo.')) suivant(2); };
      $('mo-aide').onclick = function () { sub = 'aide'; ecran(2); focus(); };
    } else if (m === 3) {
      haut.innerHTML = T + citation('Ma première réponse', Q.reponse);
      bas.innerHTML = champ('mo-t', esc(I.prediction || 'Je prévois ce qui va se passer et je justifie avec « car » ou « parce que ».'), Q.prediction) +
        '<p class="mo-msg" id="mo-msg" role="status"></p><button type="button" class="sp-btn mo-go" id="mo-ok">J’enregistre mon hypothèse</button>';
      var t3 = lie('mo-t', 'prediction');
      $('mo-ok').onclick = function () { if (exige(t3, 'Écris ton hypothèse et explique ton raisonnement.')) { Q.started = true; sauve(); suivant(3); } };
    } else if (m === 4) {
      var steps = (I.steps && I.steps.length ? I.steps : ['Choisis un réglage.', 'Observe ce qui change.', 'Recommence avec un autre réglage.']);
      haut.innerHTML = T + citation('Mon hypothèse', Q.prediction) + '<ol class="mo-steps">' + steps.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
      montre('sim', 'Simulation de la manipulation');
      bas.innerHTML = '<button type="button" class="sp-btn mo-go" id="mo-ok">J’ai fini ma manipulation</button>';
      $('mo-ok').onclick = function () { suivant(4); };
    } else if (m === 5) {
      haut.innerHTML = T;
      montre('sim', 'Simulation de la manipulation');
      bas.innerHTML = champ('mo-t', 'Je note le montage, les réglages et ce que j’observe.', Q.observation, 8) +
        '<p class="mo-msg" id="mo-msg" role="status"></p><button type="button" class="sp-btn mo-go" id="mo-ok">Je passe à la confrontation</button>';
      var t5 = lie('mo-t', 'observation');
      $('mo-ok').onclick = function () { if (exige(t5, 'Décris au moins un essai et son résultat.')) suivant(5); };
    } else if (m === 6) {
      haut.innerHTML = T + citation('Mon hypothèse', Q.prediction) + citation('Mes observations', Q.observation);
      bas.innerHTML = champ('mo-t', 'Je compare mes résultats à mon hypothèse. Je justifie avec « car » ou « parce que ».', Q.comparison) +
        '<p class="mo-msg" id="mo-msg" role="status"></p><button type="button" class="sp-btn mo-go" id="mo-ok">Je continue</button>';
      var t6 = lie('mo-t', 'comparison');
      $('mo-ok').onclick = function () { if (exige(t6, 'Dis si tes résultats confirment ou non ton hypothèse, et pourquoi.')) suivant(6); };
    } else if (m === 7) {
      var crit = I.criteria || ['Je décris les conditions des essais et leurs résultats.', 'Je compare mes résultats à mon hypothèse.', 'Je justifie mon bilan par les observations.'];
      haut.innerHTML = T + '<div class="mo-crit"><b>Pour réussir mon bilan</b><ul>' + crit.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>';
      bas.innerHTML = champ('mo-t', 'Quelle règle est-ce que je retiens ?', Q.conclusion, 6) +
        '<p class="mo-msg" id="mo-msg" role="status"></p><button type="button" class="sp-btn mo-go" id="mo-ok">J’enregistre mon bilan</button>';
      var t7 = lie('mo-t', 'conclusion');
      $('mo-ok').onclick = function () { if (exige(t7, 'Écris la règle que tu retiens.')) suivant(7); };
    } else if (m === 8) {
      haut.innerHTML = T + citation('Mon bilan', Q.conclusion) +
        '<div class="mo-crit sci"><b>Le bilan scientifique</b><ul>' + (lecon.retiens || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>' +
        '<p class="mo-lead">Je relis mon bilan à côté du bilan scientifique. Ce que j’ai bien dit, ce que je corrige.</p>';
      bas.innerHTML = '<button type="button" class="sp-btn mo-go" id="mo-ok">J’ai comparé : je continue</button>';
      $('mo-ok').onclick = function () { Q.complete = true; sauve(); suivant(8); };
    } else if (m === 9) {
      haut.innerHTML = T + '<p class="mo-lead">Je joue seul, ou en équipe : les équipes passent chacune leur tour sur le même écran.</p>';
      montre('defi', 'Défi de la leçon');
      bas.innerHTML = '<button type="button" class="sp-btn mo-go" id="mo-ok">Je termine la leçon</button>';
      $('mo-ok').onclick = function () { S.fini = true; S.max = N; P.ecrire(slug, S); fin(); focus(); };
    }
  }

  function suite() {
    var liste = [];
    ((window.PROGRAMME && window.PROGRAMME['6e']) || []).forEach(function (th) { th.les.forEach(function (x) { if (x.ready) liste.push(x); }); });
    var i = liste.findIndex(function (x) { return x.slug === slug; });
    return liste[i + 1] || null;
  }
  function fin() {
    montre(null);
    $('mo-grid').className = 'mo-grid';
    $('mo-bar').innerHTML = barre(N);
    $('mo-top').innerHTML = '<h1 class="sp-h1 mo-h1" id="mo-h1" tabindex="-1">Leçon terminée. Bravo !</h1><p class="mo-lead">Tes réponses restent sur cet appareil.</p>';
    var nx = suite();
    $('mo-bottom').innerHTML = (nx ? '<a class="sp-btn mo-go" href="?l=' + nx.slug + '">Leçon suivante : ' + esc(nx.t) + '</a>' : '<a class="sp-btn mo-go" href="../6e/">Revenir à mes leçons</a>') +
      '<button type="button" class="sp-btn ghost" id="mo-revoir">Revoir ma leçon</button>';
    $('mo-revoir').onclick = function () { aller(1); };
    $('mo-count').textContent = 'Leçon terminée';
  }

  function barre(n) { var h = ''; for (var i = 1; i <= N; i++) h += '<i' + (i <= n ? ' class="on"' : '') + '></i>'; return h; }
  function focus() { var h1 = $('mo-h1'); if (h1) h1.focus({ preventScroll: false }); }

  function aller(m) {
    m = Math.max(1, Math.min(N, m, S.max));
    cur = m; if (m !== 2) sub = null;
    $('mo-bar').innerHTML = barre(m);
    $('mo-bar').setAttribute('aria-label', 'Moment ' + m + ' sur ' + N);
    $('mo-count').textContent = 'Moment ' + m + ' sur ' + N;
    $('mo-prev').hidden = m === 1;
    ecran(m);
    document.title = TITRES[m - 1] + ' · ' + lecon.title + ' · NOHOBA-Lab';
    try { history.replaceState(null, '', '?l=' + slug + '&m=' + m); } catch (e) {}
    focus();
  }

  function demarre() {
    if (!lecon || !lecon.inquiry) { $('mo-top').innerHTML = '<p class="mo-lead">Cette leçon arrive bientôt. <a href="../6e/">Retour à mes leçons</a></p>'; return; }
    Q = Object.assign({ reponse: '', prediction: '', observation: '', comparison: '', conclusion: '', started: false, complete: false }, jr('pc-inquiry-6e-' + slug, {}));
    var pg = jr('pc-studio-prog', {}); pg.last = '6e-' + slug; jw('pc-studio-prog', pg); /* « reprendre » sur la page de classe */
    S = P.lire(slug); P.ecrire(slug, S); /* la conversion d'une ancienne trace est enregistrée une fois */
    $('mo-theme').textContent = lecon.theme || '';
    $('mo-lecon').textContent = lecon.title || '';
    $('mo-prev').onclick = function () { aller(cur - 1); };
    var q = +(/[?&]m=(\d)/.exec(location.search) || [])[1];
    if (S.fini && !q) { fin(); return; }
    aller(q >= 1 && q <= N ? q : Math.min(S.max, N));
  }

  var ok = trouver();
  if (!ok) { document.addEventListener('DOMContentLoaded', function () { $('mo-top').innerHTML = '<p class="mo-lead">Cette leçon arrive bientôt. <a href="../6e/">Retour à mes leçons</a></p>'; }); return; }
  window.NohobaSimple && window.NohobaSimple.bindTheme();
  charger(ok, function (err) {
    if (err) { $('mo-top').innerHTML = '<p class="mo-lead">La leçon n’a pas pu être chargée. Vérifie la connexion puis recharge la page.</p>'; return; }
    demarre();
  });
  window.__momentsAller = aller; /* tests et captures */
})();
