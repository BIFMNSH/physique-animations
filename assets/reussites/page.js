/* NohobaLab · page « Mes réussites » : lit la progression locale, affiche les états, génère les PDF à la demande. */
(function () {
  var R = window.NLReussites, P = window.NLPdf, $ = function (id) { return document.getElementById(id); };
  var classe = '6e';
  function lire(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function txt(el, s) { el.textContent = s; }
  function vider(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* Données fraîches, relues à chaque génération (l'éligibilité ne dépend jamais de l'état du bouton). */
  function contexte() {
    var v = window.NLValidations && typeof window.NLValidations.lire === 'function' ? window.NLValidations.lire() : [];
    return { classe: classe, programme: window.PROGRAMME, prog: lire('pc-studio-prog', {}), validations: v, eleve: $('nom').value, maintenant: new Date() };
  }
  function badge(b, cls, t) { b.className = 'badge ' + cls; txt(b, t); }

  function dessiner() {
    var c = contexte(), liste = R.lecons(c.programme, classe), ev = R.evaluerParcours(liste, c.prog), ce = R.certificat(c.validations);
    txt($('parcours'), 'Parcours de physique-chimie · classe de ' + classe + ' · programme du MENA (Côte d’Ivoire)');
    txt($('n-act'), ev.activites + ' / ' + ev.total); txt($('n-qz'), ev.quiz + ' / ' + ev.total);
    txt($('n-cp'), String(ce.competences.length)); txt($('n-cp-t'), ce.competences.length ? 'validées par le dispositif' : 'aucune validation enregistrée');

    // Certificat
    var cb = $('cert-body'); vider(cb);
    var cbtn = $('cert-btn');
    if (ce.etat === 'disponible') {
      badge($('cert-badge'), 'b-ok', 'Document disponible');
      var ul = el('ul', 'comp'); ce.competences.forEach(function (k) { var li = el('li'); li.appendChild(el('span', null, k.competence)); li.appendChild(el('em', null, k.niveauTexte || 'niveau non renseigné')); ul.appendChild(li); });
      cb.appendChild(ul); cbtn.setAttribute('aria-disabled', 'false'); cbtn.removeAttribute('aria-describedby');
    } else {
      badge($('cert-badge'), 'b-no', 'Validation non disponible');
      var w = el('p', null, 'Aucune compétence validée n’est enregistrée. Ton avis du professeur (maîtrise insuffisante, fragile, satisfaisante ou très bonne) n’est pas encore enregistré sur le site : le certificat sera proposé dès que les compétences évaluées et validées y seront renseignées.');
      w.id = 'cert-why'; cb.appendChild(w); cbtn.setAttribute('aria-disabled', 'true'); cbtn.setAttribute('aria-describedby', 'cert-why');
    }

    // Attestation
    var ab = $('att-body'); vider(ab);
    var abtn = $('att-btn'), pbtn = $('part-btn');
    if (ev.etat === 'reussite') {
      badge($('att-badge'), 'b-ok', 'Document disponible'); abtn.setAttribute('aria-disabled', 'false'); pbtn.hidden = true; abtn.removeAttribute('aria-describedby');
    } else {
      abtn.setAttribute('aria-disabled', 'true'); abtn.setAttribute('aria-describedby', 'att-why');
      var tete = ev.etat === 'participation' ? 'Validation en attente' : ev.etat === 'indisponible' ? 'Validation non disponible' : 'Parcours en cours';
      badge($('att-badge'), ev.etat === 'participation' ? 'b-wait' : 'b-no', tete);
      var d = el('div'); d.id = 'att-why';
      d.appendChild(el('p', null, ev.etat === 'participation' ? 'Toutes les activités sont terminées, mais la réussite n’est pas encore atteinte. Il reste :' : 'Pour obtenir l’attestation de réussite, il reste :'));
      var ol = el('ul', 'cond'); ev.conditions.forEach(function (t) { ol.appendChild(el('li', null, t)); }); d.appendChild(ol);
      if (ev.etat === 'participation') d.appendChild(el('p', null, 'En attendant, tu peux télécharger une attestation de participation : elle ne dit pas que tu as réussi.'));
      ab.appendChild(d); pbtn.hidden = ev.etat !== 'participation';
    }
  }

  function telecharger(type, bouton, msg) {
    msg.className = 'msg'; txt(msg, 'Préparation du document…'); bouton.setAttribute('aria-busy', 'true');
    setTimeout(function () {
      try {
        var doc = R.document(type, contexte());   // éligibilité recalculée ici
        var octets = P.creer(doc);
        if (!window.Blob || !window.URL || !URL.createObjectURL) throw Object.assign(new Error('Ton navigateur ne permet pas le téléchargement direct.'), { code: 'NAV' });
        var url = URL.createObjectURL(new Blob([octets], { type: 'application/pdf' })), a = document.createElement('a');
        a.href = url; a.download = 'NohobaLab-' + type + '-' + classe + '.pdf'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        msg.className = 'msg ok'; txt(msg, 'Document téléchargé : ' + doc.nature + '.');
      } catch (e) {
        msg.className = 'msg err';
        txt(msg, e && e.code ? e.message : 'Le téléchargement a échoué. Réessaie, ou utilise un autre navigateur.');
        if (e && e.code === 'NOM') $('nom').focus();
      } finally { bouton.removeAttribute('aria-busy'); dessiner(); }
    }, 30);
  }
  function relier(btn, type, msgId) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-disabled') === 'true') { var m = $(msgId); m.className = 'msg err'; txt(m, type === 'certificat' ? 'Validation non disponible : le certificat n’est pas encore délivrable.' : 'Les conditions de réussite ne sont pas remplies.'); return; }
      telecharger(type, btn, $(msgId));
    });
  }

  function init() {
    var c0 = null; try { c0 = localStorage.getItem('nl-classe'); } catch (e) {}
    classe = R.CLASSES.indexOf(c0) >= 0 ? c0 : '6e';
    var nom = ''; try { nom = localStorage.getItem('nl-eleve-nom') || ''; } catch (e) {}
    $('nom').value = nom;
    var chips = $('chips').querySelectorAll('button');
    function marquer() { chips.forEach(function (b) { b.setAttribute('aria-checked', b.dataset.c === classe ? 'true' : 'false'); }); }
    chips.forEach(function (b) { b.addEventListener('click', function () { classe = b.dataset.c; ecrire('nl-classe', classe); marquer(); dessiner(); }); });
    $('nom').addEventListener('input', function () { ecrire('nl-eleve-nom', $('nom').value); });
    if (!nom && window.NLCompte && window.NLCompte.connecte && window.NLCompte.connecte()) {
      window.NLCompte.me().then(function (m) { var n = (m.profile && m.profile.display_name) || (m.user && m.user.name) || ''; if (n && !$('nom').value) { $('nom').value = n; ecrire('nl-eleve-nom', n); } }).catch(function () {});
    }
    relier($('cert-btn'), 'certificat', 'cert-msg'); relier($('att-btn'), 'reussite', 'att-msg'); relier($('part-btn'), 'participation', 'att-msg');
    marquer(); dessiner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
