/* NohobaLab · règles de délivrance de « Mes réussites ».
   Aucune règle nouvelle : on réutilise celles du Studio.
   - Activités d'une leçon : résumé, simulation, défi terminés (clés « resume », « sim », « defi » de pc-studio-prog).
   - Évaluation : le quiz de sortie est réussi à 80 % ou plus (règle de assets/studio/studio.js, clé « quiz »).
   - Compétence validée : il n'existe pas encore d'enregistrement numérique de l'avis du professeur (I, F, S, TB).
     Tant qu'aucune source n'est branchée, le certificat reste « Validation non disponible ». */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.NLReussites = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var ACTIVITES = ['resume', 'sim', 'defi'];
  var NIVEAUX = { I: 'maîtrise insuffisante', F: 'maîtrise fragile', S: 'maîtrise satisfaisante', TB: 'très bonne maîtrise' };
  var CLASSES = ['6e', '5e', '4e', '3e'];
  var NATURES = { reussite: 'Attestation de réussite', participation: 'Attestation de participation', certificat: 'Certificat de compétences' };

  function erreur(code, message) { var e = new Error(message); e.code = code; return e; }

  /* Leçons en ligne d'une classe, à partir de window.PROGRAMME (assets/studio/programme.js). */
  function lecons(programme, classe) {
    var out = [], themes = (programme && programme[classe]) || [];
    themes.forEach(function (t) {
      (t.les || []).forEach(function (l) { if (l.ready) out.push({ slug: l.slug, titre: l.t, theme: t.nm }); });
    });
    return out;
  }

  /* État du parcours, calculé à partir des données brutes (jamais d'un drapeau déjà calculé). */
  function evaluerParcours(liste, prog) {
    prog = prog || {};
    var n = liste.length, act = 0, qz = 0;
    liste.forEach(function (l) {
      var p = prog[l.slug] || {};
      if (ACTIVITES.every(function (k) { return p[k] === true; })) act++;
      if (p.quiz === true) qz++;
    });
    var etat = n === 0 ? 'indisponible' : act === n && qz === n ? 'reussite' : act === n ? 'participation' : 'en_cours';
    var conditions = [];
    if (n && act < n) conditions.push('Terminer le résumé, la simulation et le défi de ' + (n - act) + (n - act > 1 ? ' leçons' : ' leçon') + '.');
    if (n && qz < n) conditions.push('Réussir le quiz de sortie de ' + (n - qz) + (n - qz > 1 ? ' leçons' : ' leçon') + ' (80 % de bonnes réponses ou plus).');
    return { total: n, activites: act, quiz: qz, etat: etat, conditions: conditions };
  }

  /* Compétences validées : uniquement des enregistrements explicites {competence, niveau?}. */
  function certificat(validations) {
    var vus = {}, liste = [];
    (Array.isArray(validations) ? validations : []).forEach(function (v) {
      if (!v || typeof v.competence !== 'string' || !v.competence.trim()) return;
      var nom = v.competence.trim(), niv = Object.prototype.hasOwnProperty.call(NIVEAUX, v.niveau) ? v.niveau : null;
      if (vus[nom]) return; vus[nom] = true;
      liste.push({ competence: nom, niveau: niv, niveauTexte: niv ? NIVEAUX[niv] : null });
    });
    return { etat: liste.length ? 'disponible' : 'indisponible', competences: liste };
  }

  function nomValide(nom) { return typeof nom === 'string' && nom.trim().length >= 2 && nom.trim().length <= 80; }

  /* Vérifie l'éligibilité au moment de la génération et renvoie le contenu du document.
     ctx : { classe, programme, prog, validations, eleve, maintenant } */
  function document_(type, ctx) {
    if (!NATURES[type]) throw erreur('TYPE', 'Type de document inconnu.');
    if (CLASSES.indexOf(ctx.classe) < 0) throw erreur('CLASSE', 'Choisis ta classe.');
    if (!nomValide(ctx.eleve)) throw erreur('NOM', 'Indique ton nom et ton prénom (2 à 80 caractères).');
    var liste = lecons(ctx.programme, ctx.classe), ev = evaluerParcours(liste, ctx.prog);
    var doc = { type: type, nature: NATURES[type], eleve: ctx.eleve.trim().replace(/\s+/g, ' '), niveau: ctx.classe,
      parcours: 'Parcours de physique-chimie de la classe de ' + ctx.classe + ' (programme du MENA, Côte d’Ivoire)',
      date: ctx.maintenant || new Date(), emetteur: 'NohobaLab', bilan: ev };
    if (type === 'reussite') {
      if (ev.etat !== 'reussite') throw erreur('NON_ELIGIBLE', 'Les conditions de réussite du parcours ne sont pas remplies.');
    } else if (type === 'participation') {
      if (ev.etat !== 'participation' && ev.etat !== 'reussite') throw erreur('NON_ELIGIBLE', 'Les activités du parcours ne sont pas toutes terminées.');
    } else {
      var c = certificat(ctx.validations);
      if (c.etat !== 'disponible') throw erreur('NON_VALIDE', 'Validation non disponible : aucune compétence validée n’est enregistrée.');
      doc.competences = c.competences;
    }
    return doc;
  }

  return { ACTIVITES: ACTIVITES, NIVEAUX: NIVEAUX, CLASSES: CLASSES, NATURES: NATURES, lecons: lecons, evaluerParcours: evaluerParcours,
    certificat: certificat, nomValide: nomValide, document: document_ };
});
