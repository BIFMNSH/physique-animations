/* Progression d'une leçon de 6e en neuf moments (lecteur lecon-ci/).
   Clé « pc-lecon-ci-<slug> » : { max: moment le plus loin atteint (1 à 9), fini: vrai quand le moment 9 est terminé }.
   Les textes de l'élève restent dans « pc-inquiry-6e-<slug> » (inchangé) : une progression
   enregistrée avant la refonte est convertie à la lecture, sans rien perdre. */
(function () {
  var N = 9;
  function read(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function txt(v) { return typeof v === 'string' && v.trim().length > 0; }
  /* ancienne trace → moment atteint : hypothèse 3, manipulation 4, observations 5→6, confrontation →7, bilan →8, comparaison faite →9 */
  function convertir(slug) {
    var q = read('pc-inquiry-6e-' + slug) || {}, p = (read('pc-studio-prog') || {})['6e-' + slug] || {};
    var max = 1;
    if (txt(q.reponse)) max = 3;
    if (q.started || txt(q.prediction)) max = Math.max(max, q.started ? 4 : 3);
    if (q.started && txt(q.observation)) max = 6;
    if (q.started && txt(q.observation) && txt(q.comparison)) max = 7;
    if (q.started && txt(q.observation) && txt(q.comparison) && txt(q.conclusion)) max = 8;
    if (q.complete) max = 9;
    return { max: max, fini: !!(q.complete && p.defi) };
  }
  function lire(slug) {
    var s = read('pc-lecon-ci-' + slug);
    if (!s || typeof s.max !== 'number') s = convertir(slug);
    s.max = Math.min(N, Math.max(1, Math.round(s.max))); s.fini = !!s.fini;
    return s;
  }
  function ecrire(slug, s) { try { localStorage.setItem('pc-lecon-ci-' + slug, JSON.stringify({ max: s.max, fini: !!s.fini })); } catch (e) {} }
  window.NohobaMoments = {
    N: N,
    lire: lire,
    ecrire: ecrire,
    convertir: convertir,
    /* moments terminés (0 à 9) */
    faits: function (slug) { var s = lire(slug); return s.fini ? N : s.max - 1; },
    commence: function (slug) { var s = lire(slug); return s.fini || s.max > 1 || !!(read('pc-inquiry-6e-' + slug) || {}).reponse; }
  };
})();
