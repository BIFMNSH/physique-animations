/* Les quatre étapes d'une leçon de 6e, telles que l'élève les voit :
   1 Essaie (prévision + démarche dans la simulation), 2 Regarde (résumé), 3 Enquête, 4 Vérifie (quiz).
   L'ordre suit le moteur Studio : tant que la démarche n'est pas terminée (« pc-inquiry-6e-<slug> ».complete),
   le résumé, le défi et le quiz renvoient à la démarche. Tout est lu sur l'appareil ; rien n'est envoyé. */
(function () {
  var SLUG = { 'Matériaux, tri et déchets': 'materiaux-tri-dechets', 'Circuit électrique': 'circuit-electrique', 'Commande d’un circuit': 'commande-circuit', 'Court-circuit et protection': 'court-circuit', 'Solides et liquides': 'solides-liquides', 'Gaz': 'les-gaz', 'Température d’un corps': 'temperature', 'Changements d’état de l’eau': 'changements-etat', 'Volume d’un liquide ou d’un solide': 'volume', 'Masse d’un solide ou d’un liquide': 'masse', 'Constituants de l’air': 'constituants-air', 'Combustions de solides et liquides': 'combustion-solide-liquide', 'Combustion de gaz': 'combustion-gaz', 'Dangers des combustions': 'dangers-combustions' };
  /* fiches existantes : même liste que activites-ci/index.html */
  var FICHES = /^NL-CI-6E-(?:ELE-(?:0[1-9]|1[0-7])|MAT-(?:0[1-9]|[12][0-9]|3[0-3]))$/;
  /* parcours propre à la collection Côte d’Ivoire : pas de leçon Studio, seulement des investigations */
  var LOCAL = 'materiaux-tri-dechets';
  function read(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  /* même règle d'avancement que le moteur d'activité : 0 = jamais ouverte, 6 = conclusion rédigée */
  function actState(id) { var st = read('pc-act-' + id); if (!Object.keys(st).length) return 0; if (!st.prevision) return 1; if (!(st.essais && st.essais.length)) return 2; if (!st.confront) return 3; if (!st.conclusion) return 4; return 6; }
  /* pilote validé : proposé même si le catalogue ne se charge pas */
  var PILOTE = [{ id: 'NL-CI-6E-ELE-07', sourceId: 'ELE-07', lecon: 'Circuit électrique', titre: 'Conducteurs et isolants', statut: 'disponible' }];
  function activites(slug) { var c = window.NL_CATALOGUE_CI_6E; return (c && c.length ? c : PILOTE).filter(function (a) { return SLUG[a.lecon] === slug; }); }
  /* investigations validées par le professeur pour la leçon, dans l'ordre du catalogue */
  function enquetes(slug) { return activites(slug).filter(function (a) { return a.statut === 'disponible' && FICHES.test(a.id); }); }
  /* l'étape « Enquête » enchaîne les investigations : la première pas terminée, et l'étape est faite quand toutes le sont */
  function enquete(slug) {
    var A = enquetes(slug); if (!A.length) return null;
    var S = A.map(function (a) { return actState(a.id); }), i = S.findIndex(function (x) { return x < 6; });
    return { act: A[i < 0 ? 0 : i], rang: (i < 0 ? A.length : i + 1), total: A.length, done: i < 0, started: S.some(function (x) { return x > 0; }) };
  }

  /* parcours local : une étape par investigation validée, dans l'ordre du catalogue */
  function etapesLocal(slug) {
    var A = activites(slug).filter(function (a) { return a.statut === 'disponible' && FICHES.test(a.id); });
    var E = A.map(function (a, i) {
      var st = actState(a.id);
      return { k: 'enquete', mot: 'Investigation ' + (i + 1), d: a.titre, href: '../activites-ci/?a=' + a.id + '&lecon=' + slug, done: st >= 6, started: st > 0, act: a, n: i + 1 };
    });
    return { local: true, ordre: 'essaie', list: E, done: E.filter(function (e) { return e.done; }).length, next: E.filter(function (e) { return !e.done; })[0] || null, defiBonus: null };
  }

  function etapes(slug) {
    if (slug === LOCAL) return etapesLocal(slug);
    var p = read('pc-studio-prog')['6e-' + slug] || {}, inq = read('pc-inquiry-6e-' + slug), L = '../lecon/?l=' + slug;
    var open = !!inq.complete, E1 = enquete(slug), act = E1 && E1.act;
    var essaie = { k: 'essaie', mot: 'Essaie', d: 'Fais ta prévision, puis manipule la simulation.', href: L + '#sim', done: open, started: !!inq.started };
    var regarde = { k: 'regarde', mot: 'Regarde', d: 'Le résumé en vidéo, en une minute.', href: L + '#resume', done: !!p.resume };
    var enq = act
      ? { k: 'enquete', mot: 'Enquête', d: (E1.total > 1 ? 'Investigation ' + E1.rang + ' sur ' + E1.total + ' : ' : '') + act.titre + '.', href: '../activites-ci/?a=' + act.id + '&lecon=' + slug, done: E1.done, started: E1.started, act: act }
      : { k: 'enquete', mot: 'Enquête', d: 'Relève le défi : utilise ce que tu as appris.', href: L + '#defi', done: !!p.defi };
    var verifie = { k: 'verifie', mot: 'Vérifie', d: 'Le quiz : vérifie ce que tu sais.', href: L + '#quiz', done: !!p.quiz };
    var ordre = window.NohobaSimple ? window.NohobaSimple.ordre() : 'essaie';
    var E = ordre === 'regarde' ? [regarde, essaie, enq, verifie] : [essaie, regarde, enq, verifie];
    /* seuls le quiz et le défi attendent la démarche (comme le moteur) ; le résumé et l'enquête en six opérations restent ouverts.
       Une étape « à venir » reste cliquable : elle affiche un message qui dit quoi faire (pas de cadenas). */
    E.forEach(function (e, i) { e.n = i + 1; e.gated = (e.k === 'verifie' || (e.k === 'enquete' && !e.act)) && !open && !e.done; });
    var next = E.filter(function (e) { return !e.done && !e.gated; })[0] || null;
    return { ordre: ordre, list: E, done: E.filter(function (e) { return e.done; }).length, next: next, defiBonus: act ? { href: L + '#defi', done: !!p.defi, locked: !open } : null };
  }
  window.NohobaEtapesCI = { etapes: etapes, activites: activites, LOCAL: LOCAL };
})();
