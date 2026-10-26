/* Parcours élève simplifié : thème partagé (clé « pc-theme », synchronisée avec le Studio)
   et classe mémorisée sur l'appareil (« pc-classe »). Rien n'est envoyé. */
(function () {
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var NohobaSimple = {
    theme: function () { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; },
    setTheme: function (t) {
      root.setAttribute('data-theme', t);
      set('pc-theme', t);
      try { var p = JSON.parse(get('pc-studio') || '{}'); p.theme = t; set('pc-studio', JSON.stringify(p)); } catch (e) {}
    },
    /* ordre des étapes d'une leçon, pour comparer deux versions avec des élèves :
       « essaie » (A, par défaut : prévision avant le résumé) ou « regarde » (B : résumé d'abord).
       ?ordre=regarde ou ?ordre=essaie sur n'importe quelle page ; mémorisé sur l'appareil (« pc-ordre »). */
    ordre: function () {
      var m = /[?&]ordre=(essaie|regarde)/.exec(location.search);
      if (m) { set('pc-ordre', m[1]); return m[1]; }
      return get('pc-ordre') === 'regarde' ? 'regarde' : 'essaie';
    },
    classe: function () { var c = get('pc-classe'); return /^[3-6]e$/.test(c || '') ? c : null; },
    setClasse: function (c) { if (/^[3-6]e$/.test(c)) set('pc-classe', c); },
    /* bouton de thème : <button data-sp-theme> */
    bindTheme: function () {
      var b = document.querySelector('[data-sp-theme]'); if (!b) return;
      function paint() {
        var light = NohobaSimple.theme() === 'light';
        b.setAttribute('aria-label', light ? 'Passer en thème sombre' : 'Passer en thème clair');
        b.innerHTML = light
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
      }
      b.onclick = function () { NohobaSimple.setTheme(NohobaSimple.theme() === 'light' ? 'dark' : 'light'); paint(); };
      paint();
    }
  };
  window.NohobaSimple = NohobaSimple;
  NohobaSimple.ordre(); /* mémorise ?ordre=… dès l'arrivée sur n'importe quelle page */
})();
