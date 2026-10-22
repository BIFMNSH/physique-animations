/* Moteur des activités NohobaLab (cycle 4) — six écrans : situation, prévision, manipulation, confrontation, bilan, trace.
   Données de l'élève : uniquement sur cet appareil (localStorage « pc-act-<id> »). Aucune donnée envoyée. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function h(tag, attrs, parent, html) {
    var e = document.createElement(tag), k;
    for (k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(x, d) { return Number(x).toFixed(d == null ? 1 : d).replace('.', ','); }
  function hhmm(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  var STEPS = ['Problématiser', 'Émettre une hypothèse', 'Expérimenter / Investiguer', 'Analyser et interpréter', 'Conclure', 'Communiquer'];

  function load(key) { try { var s = JSON.parse(localStorage.getItem(key)); if (s && s.v === 1) return s; } catch (e) {} return { v: 1, prevision: null, essais: [], confront: null, conclusion: '', transfert: null, aides: 0, step: 0 }; }
  function save(key, st) { try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {} }

  /* ---- modèle de séquence de pesée (indépendant du rendu) ---- */

  function tableHTML(F, rows, cap) {
    return '<table class="t">' + (cap ? '<caption class="noprint" style="text-align:left;color:var(--mist)">' + esc(cap) + '</caption>' : '') + '<thead><tr>' + F.colonnes.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (r) { return '<tr>' + r.map(function (c, k) { return k ? '<td>' + esc(c) + '</td>' : '<th scope="row" style="font-weight:700">' + esc(c) + '</th>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + F.colonnes.length + '" style="text-align:center;color:var(--mist)">Aucun essai pour l’instant</td></tr>') + '</tbody></table>';
  }

  /* ---- programme : compétences, objectifs, évaluation ---- */
  var NIV = ['I', 'F', 'S', 'TB'], NIVTXT = { I: 'maîtrise insuffisante', F: 'maîtrise fragile', S: 'maîtrise satisfaisante', TB: 'très bonne maîtrise' };
  function comps(F) { var P = window.PROGRAMME, ped = F.pedagogie; if (!P || !ped) return []; return ped.competences.map(function (c) { var k = P.competences[c[0]]; return k ? { nom: k.nom, cap: k.cap[c[1]] || '', socle: k.socle } : null; }).filter(Boolean); }
  function compsP(ped) { var P = window.PROGRAMME; if (!P || !ped) return []; return ped.competences.map(function (c) { var k = P.competences[c[0]]; return k ? { nom: k.nom, cap: k.cap[c[1]] || '', socle: k.socle } : null; }).filter(Boolean); }
  function cadreHTML(ped, chapitre, id) { // Thème / Chapitre / Compétence visée / à la fin de cette partie, je dois être capable de
    var P = window.PROGRAMME, T = P && ped && P.themes[ped.theme]; if (!T) return '';
    var CP = compsP(ped), V = window.VISEE && window.VISEE[id], n, caps, visee = '';
    if (V) { n = V.capable.length; caps = V.capable.map(function (t, i) { return '<li>' + esc(t) + (i < n - 1 ? ' ;' : '.') + '</li>'; }).join(''); visee = '<p class="vis">' + esc(V.visee) + '</p>'; }
    else { n = ped.objectifs.length; caps = ped.objectifs.map(function (o, i) { var t = String(o.eleve || o.objectif).replace(/^Je sais /, '').replace(/[.;\s]+$/, ''); return '<li>' + esc(t.charAt(0).toUpperCase() + t.slice(1)) + (i < n - 1 ? ' ;' : '.') + '</li>'; }).join(''); }
    var prog = '';
    return '<div class="cadre"><p class="th-nom">Thème : ' + esc(T.nom) + '</p><p class="ch">Chapitre : ' + esc(chapitre) + '</p><h3>Compétence visée</h3>' + visee + prog + '<h3>À la fin de cette partie, je dois être capable de :</h3><ul>' + caps + '</ul></div>';
  }
  function themeNom(F) { var P = window.PROGRAMME, ped = F.pedagogie; return P && ped && P.themes[ped.theme] ? P.themes[ped.theme] : null; }
  var AEL = { non: 'pas encore', partie: 'en partie', oui: 'oui' };

  /* Notes réservées à l'enseignant (limites du modèle, différenciation) : elles ne sont plus dans la fiche publique, le serveur les remet à un compte enseignant. */
  var PRIV = {};
  function privLoad(F) {
    if (PRIV[F.id]) return Promise.resolve({ ok: true });
    var C = window.NLCompte;
    if (!C) return Promise.resolve({ ok: false, msg: 'Le service de comptes n’est pas disponible pour le moment.' });
    if (!C.connecte()) return Promise.resolve({ ok: false, code: 401, msg: 'Connectez-vous avec un compte enseignant pour afficher les limites du modèle et la différenciation.' });
    return C.req('/api/activites/' + F.id + '/corrige').then(function (j) { PRIV[F.id] = j.prof || {}; return { ok: true }; }).catch(function (e) {
      return { ok: false, code: e.status, msg: e.status === 401 ? 'Votre session a expiré : reconnectez-vous avec un compte enseignant.' : e.status === 403 ? 'Ces notes sont réservées aux comptes enseignants (profil « enseignant »).' : e.status === 402 ? 'Un pass enseignant couvrant ce thème est nécessaire.' : e.status === 404 ? 'Notes enseignant non disponibles pour cette activité.' : 'Le serveur de comptes n’est pas joignable pour le moment.' };
    });
  }
  function privSecs(F, sec) {
    var P = PRIV[F.id];
    return P ? sec('▸', 'Limites du modèle', '<p>' + esc(P.limites) + '</p>') + sec('▸', 'Différenciation', '<p>' + esc(P.differenciation) + '</p>')
      : sec('▸', 'Limites du modèle et différenciation', '<p>Réservé aux comptes enseignants : connectez-vous sur lab.nohaba.com/connexion/ pour les afficher.</p>');
  }
  /* ---- fiche imprimable : même HTML à l'écran (aperçu) et à l'impression (A4, deux pages) ---- */
  function sheetHTML(F, st, mode) { // mode : 'vierge' | 'remplie' | 'prof'
    var filled = mode !== 'vierge', prof = mode === 'prof';
    var pv = filled && st.prevision, ini = pv && (pv.initiale || pv), ch = ini && F.prevision.choix.filter(function (c) { return c[0] === ini.choix; })[0];
    var lines = function (n) { var s = '', i; for (i = 0; i < n; i++) s += '<div class="sh-line"></div>'; return s; };
    var sec = function (n, t, body) { return '<section class="sh-sec"><h2><span class="sh-n">' + n + '</span>' + esc(t) + '</h2>' + body + '</section>'; };
    var field = function (t, v, n) { return '<p class="sh-q"><b>' + esc(t) + '</b>' + (v ? ' ' + esc(v) : '') + '</p>' + (v ? '' : lines(n || 2)); };
    var L = filled ? F.lignes(st) : [], nr = Math.max(L.length, F.lignesVides || 3), rows = '', i;
    for (i = 0; i < nr; i++) rows += '<tr>' + F.colonnes.map(function (_, k) { return '<td>' + (L[i] ? esc(L[i][k]) : '') + '</td>'; }).join('') + '</tr>';
    var tag = prof ? 'Version professeur' : filled ? 'Fiche remplie' : 'Fiche vierge';
    var head = '<header class="sh-head"><span class="sh-brand">NOHOBA-Lab · ' + (F.id.indexOf('NL-CI-') === 0 ? '6e Côte d’Ivoire' : 'Cycle 4 France') + '</span><span class="sh-tag">' + tag + '</span></header>' +
      '<h1>' + esc(F.titre) + '</h1><p class="sh-meta">' + esc(F.id) + ' · ' + esc(F.niveau) + ' · ' + esc(F.chapitre) + ' · version ' + esc(F.version) + '</p>';
    var ident = '<div class="sh-ident"><span>Nom : <i></i></span><span>Classe : <i></i></span><span>Date : <i></i></span></div>';
    var prev = pv ? '<p class="sh-q">' + (ini.inconnu ? 'Je ne sais pas encore. Mon hypothèse : ' : 'Ma prévision : ') + esc(ch ? ch[1] : '') + (ini.nombre ? ' (' + esc(ini.nombre) + ' ' + esc(F.prevision.nombre.unite) + ')' : '') + '</p><p class="sh-q"><b>Parce que</b> ' + esc(ini.raison || '') + '</p>' :
      '<ul class="sh-choix">' + F.prevision.choix.map(function (c) { return '<li>☐ ' + esc(c[1]) + '</li>'; }).join('') + '</ul>' + (F.prevision.nombre ? '<p class="sh-q"><b>' + esc(F.prevision.nombre.label) + ' :</b> ______ ' + esc(F.prevision.nombre.unite) + '</p>' : '') + '<p class="sh-q"><b>Parce que…</b></p>' + lines(2);
    var compBox = cadreHTML(F.pedagogie, F.chapitre, F.id);
    var p1 = '<div class="sh-page">' + head + ident + compBox +
      sec(1, 'Problématiser', '<p>' + esc(F.situation) + '</p><p class="sh-mat"><b>Matériel :</b> ' + esc(F.materiel) + '</p>') +
      sec(2, 'Émettre une hypothèse', '<p>' + esc(F.prevision.consigne) + '</p>' + prev) +
      sec(3, 'Expérimenter / Investiguer', '<ol class="sh-prot">' + F.protocole.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol><p class="sh-var"><b>Je fais varier :</b> ' + esc(F.variable) + '. <b>Je garde identique :</b> ' + esc(F.maintenu) + '.</p>' +
        '<table class="sh-t"><thead><tr>' + F.colonnes.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table>' + (filled && st.essais.length ? '<p class="sh-note">Données simulées (modèle ' + esc(F.modele) + ').</p>' : '') +
        (F.extraPrint ? '<p class="sh-q"><b>' + esc(F.extraPrint.titre) + ' :</b> ' + esc(F.extraPrint.consigne) + '</p><div class="sh-grid" style="height:' + (F.extraPrint.hauteur || 160) + 'px"></div>' : '')) +
      '</div>';
    var cf = st.confront, verd = { confirmee: 'confirmée', infirmee: 'infirmée', partielle: 'partiellement confirmée', non: 'non testée de façon concluante' }, tr = st.transfert;
    var T = F.transfert, trOk = tr && (T.type === 'nombre' ? Math.abs(parseFloat(String(tr.rep).replace(',', '.')) - T.rep) <= (T.tol || 0) : tr.rep === T.rep);
    var ac = st.autocorr, after = '';
    if (filled && ac && (ac.note || (ac.coches && ac.coches.length))) after = sec('★', 'Après correction', '<p class="sh-q"><b>Points que j’ai vérifiés :</b> ' + (ac.coches || []).map(function (k) { return esc(F.prof.attendus[k] || ''); }).join(' ; ') + '</p>' + field('Ce que j’avais faux ou oublié, et ce que j’ai compris :', ac.note, 2));
    var p2 = '<div class="sh-page">' + head.split('<h1>')[0] + '<h1 class="sh-h1b">' + esc(F.titre) + ' <small>(suite)</small></h1>' +
      sec(4, 'Analyser et interpréter', field('Ma prévision de départ :', pv && ch ? ch[1] : '', 1) +
        field('Résultats expérimentaux (valeurs et unités) :', filled && st.essais.length ? st.essais.map(F.resume).join(' ; ') : '', 2) +
        '<p class="sh-q"><b>Ma prévision est :</b> ' + (filled && cf ? esc(verd[cf.verdict] || '') : '☐ confirmée &nbsp; ☐ infirmée &nbsp; ☐ partiellement confirmée &nbsp; ☐ non testée de façon concluante') + '</p>' +
        field('Je confronte et interprète les résultats :', cf && cf.preuve, 2) + field('Je précise ce que je modifie dans mon hypothèse :', cf && cf.modif, 2)) +
      sec(5, 'Conclure', field('Ma conclusion personnelle argumentée :', st.conclusion, 3) +
        '<p class="sh-q"><b>Réinvestir mes connaissances :</b> ' + esc(T.q) + '</p>' +
        (filled && tr ? '<p class="sh-q"><b>Ma réponse :</b> ' + esc(tr.rep) + (T.unite ? ' ' + esc(T.unite) : '') + ' — ' + esc(tr.just || '') + '</p>' : '<p class="sh-q"><b>Ma réponse :</b> ____________ ' + (T.unite ? esc(T.unite) : '') + '</p>' + lines(2))) +
      sec(6, 'Communiquer', '<p class="sh-q"><b>Je présente la démarche :</b> problème, hypothèse, protocole, observations, interprétation et conclusion.</p>' +
        field('Ce que je retiens de mon investigation :', filled ? st.conclusion : '', 2)) +
      after + evalSec(F, st, filled) +
      '<footer class="sh-foot">NOHOBA-Lab · lab.nohaba.com · ' + (filled ? 'données simulées par le modèle de l’activité' : 'à compléter au stylo') + '</footer></div>';
    var pr = '';
    if (prof) pr = '<div class="sh-page"><header class="sh-head"><span class="sh-brand">NOHOBA-Lab · ' + (F.id.indexOf('NL-CI-') === 0 ? '6e Côte d’Ivoire' : 'Cycle 4 France') + '</span><span class="sh-tag">Corrigé professeur</span></header><h1>' + esc(F.titre) + '</h1>' +
      '<section class="sh-sec sh-ref"><p><b>Référence :</b> ' + esc(F.prof.reference) + '</p></section>' +
      sec('▸', 'Attendus', '<ul>' + F.prof.attendus.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>') + sec('▸', 'Erreurs usuelles', '<ul>' + F.prof.erreurs.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>') +
      profPed(F) + privSecs(F, sec) + '</div>';
    return '<div class="sheet">' + p1 + p2 + pr + '</div>';
  }
  function evalSec(F, st, filled) {
    var ped = F.pedagogie, ae = st.autoeval || {}, head = '<section class="sh-sec sh-eval"><h2><span class="sh-n">✓</span>Mon auto-évaluation et l’avis du professeur</h2>';
    var rows = ped ? ped.objectifs.map(function (o) {
      var moi = ['non', 'partie', 'oui'].map(function (k) { return (filled && ae[o.id] === k ? '● ' : '☐ ') + AEL[k]; }).join(' &nbsp; ');
      return '<tr><td>' + esc(o.eleve) + '</td><td>' + moi + '</td><td>' + NIV.map(function (n) { return '☐ ' + n; }).join(' &nbsp; ') + '</td></tr>';
    }).join('') : '';
    var tb = ped ? '<table class="sh-t sh-ev"><thead><tr><th>Je sais…</th><th>Moi</th><th>Professeur</th></tr></thead><tbody>' + rows + '</tbody></table><p class="sh-note">Avis du professeur : I = maîtrise insuffisante · F = maîtrise fragile · S = maîtrise satisfaisante · TB = très bonne maîtrise.</p>' : '';
    return head + '<p><b>Critère de réussite :</b> ' + esc(F.critere) + (filled ? ' &nbsp;·&nbsp; Aides utilisées : ' + st.aides : ' &nbsp;·&nbsp; Aides utilisées : ____') + '</p>' + tb + '<div class="sh-prof"><b>Commentaire du professeur :</b><div class="sh-line"></div></div></section>';
  }
  function profPed(F) {
    var ped = F.pedagogie, T = themeNom(F), CP = comps(F); if (!ped) return '';
    var sec = function (n, t, body) { return '<section class="sh-sec"><h2><span class="sh-n">' + n + '</span>' + esc(t) + '</h2>' + body + '</section>'; };
    var ctx = '<p class="sh-q"><b>Thème du programme :</b> ' + esc(T.nom) + ' — attendu de fin de cycle : ' + esc(T.attendus[ped.attendu]) + '.</p><p class="sh-q"><b>Connaissance visée :</b> ' + esc(ped.connaissance) + '</p>' +
      '<ul>' + CP.map(function (c) { return '<li><b>' + esc(c.nom) + '</b> — ' + esc(c.cap) + ' (domaine ' + esc(c.socle) + ')</li>'; }).join('') + '</ul>';
    var tb = '<table class="sh-t"><thead><tr><th>Objectif</th><th>Savoir-faire</th><th>Indicateur de réussite</th><th>Où l’observer</th></tr></thead><tbody>' + ped.objectifs.map(function (o) { return '<tr><td><b>' + o.id + '</b> ' + esc(o.objectif) + '</td><td><ul>' + o.savoirFaire.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></td><td>' + esc(o.indicateur) + '</td><td>' + esc(o.preuve) + '</td></tr>'; }).join('') + '</tbody></table><p class="sh-note">Niveaux de maîtrise (socle commun) : ' + window.PROGRAMME.niveaux.join(' · ') + '.</p>';
    return sec('▸', 'Compétences, objectifs et évaluation', ctx + tb);
  }
  function printDoc(F, st, mode) {
    var go = function () {
      var P = $('#print'), t0 = document.title; P.innerHTML = sheetHTML(F, st, mode);
      document.title = F.id + '-' + mode; var back = function () { document.title = t0; window.removeEventListener('afterprint', back); }; window.addEventListener('afterprint', back);
      window.print();
    };
    if (mode === 'prof') privLoad(F).then(go); else go();
  }
  /* carte « Fiche à imprimer » : aperçu fidèle + Imprimer / Enregistrer en PDF */
  function sheetCard(F, st, parent, modes, profMode) {
    var c = h('div', { class: 'card noprint' }, parent); h('h3', { text: 'Fiche à imprimer' }, c);
    var mode = modes[0], hasSel = modes.length > 1;
    if (hasSel) { h('label', { for: 'shm', text: 'Version :' }, c); var sel = h('select', { id: 'shm' }, c, modes.map(function (m) { return '<option value="' + m + '">' + { vierge: 'Fiche vierge (à compléter au stylo)', remplie: 'Fiche remplie avec mon travail', prof: 'Version professeur (avec corrigé)' }[m] + '</option>'; }).join('')); }
    var det = h('details', { class: 'sh-prev' }, c), sm = h('summary', { text: 'Voir l’aperçu de la fiche' }, det), pv = h('div', {}, det);
    function paint() { if (mode === 'prof') privLoad(F).then(function () { pv.innerHTML = sheetHTML(F, st, mode); }); else pv.innerHTML = sheetHTML(F, st, mode); }
    det.addEventListener('toggle', function () { if (det.open) paint(); });
    if (hasSel) sel.onchange = function () { mode = sel.value; if (det.open) paint(); };
    var row = h('div', { class: 'row' }, c), b1 = h('button', { class: 'btn primary', type: 'button', text: 'Imprimer' }, row), b2 = h('button', { class: 'btn', type: 'button', text: 'Enregistrer en PDF' }, row);
    var msg = h('p', { class: 'msg', 'aria-live': 'polite', hidden: '' }, c);
    b1.onclick = function () { msg.hidden = true; printDoc(F, st, mode); };
    b2.onclick = function () { msg.hidden = false; msg.textContent = 'Dans la fenêtre qui s’ouvre, choisis « Enregistrer au format PDF » comme imprimante, puis valide.'; printDoc(F, st, mode); };
    return c;
  }

  /* ---- application ---- */
  function run(F, root) {
    var KEY = 'pc-act-' + F.id, st = load(KEY), profMode = false, view = st.step || 0, ctxNx = null;
    function ctx() {
      return { st: function () { return st; }, key: KEY, F: F, h: h, $: $, num: num, esc: esc, tableHTML: tableHTML,
        save: function () { save(KEY, st); }, tabs: function () { drawTabs(); },
        addEssai: function (e) { e.ts = Date.now(); e.statut = 'simulé'; e.modele = F.modele; st.essais.push(e); save(KEY, st); drawTabs(); if (ctxNx) ctxNx.disabled = !readyForAnalysis(); },
        aide: function () { var k = Math.min(st.aides, F.aides.length - 1); st.aides++; save(KEY, st); return F.aides[k]; } };
    }
    function readyForAnalysis() { return F.peutConfronter ? F.peutConfronter(st) : st.essais.length > 0; }
    function reached() { // plus grand écran accessible
      if (!st.prevision) return 1;
      if (!readyForAnalysis()) return 2;
      if (!st.confront) return 3;
      if (!st.conclusion) return 4;
      return 5;
    }
    function go(i) { view = Math.min(i, reached()); st.step = view; save(KEY, st); draw(); }
    var tabs = h('div', { class: 'tabs noprint', role: 'tablist', 'aria-label': 'Étapes de l’activité' }, root);
    var panel = h('div', { role: 'tabpanel', id: 'panel', tabindex: '-1' }, root);
    function drawTabs() {
      tabs.innerHTML = '';
      STEPS.forEach(function (s, i) {
        var b = h('button', { type: 'button', role: 'tab', id: 'tab' + i, 'aria-selected': String(i === view), 'aria-controls': 'panel', tabindex: i === view ? '0' : '-1', text: (i + 1) + ' · ' + s }, tabs);
        if (i > reached()) b.disabled = true;
        b.onclick = function () { go(i); };
        b.onkeydown = function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -99 : e.key === 'End' ? 99 : 0; if (!d) return;
          e.preventDefault(); var n = Math.max(0, Math.min(reached(), d === -99 ? 0 : d === 99 ? reached() : i + d)); go(n); var t = $('#tab' + n); if (t) t.focus();
        };
      });
    }
    function next(label, to, parent) { var b = h('button', { class: 'btn primary', type: 'button', text: label }, parent); b.onclick = function () { go(to); panel.focus(); }; return b; }

    function sSituation() {
      var cd = cadreHTML(F.pedagogie, F.chapitre, F.id); if (cd) panel.insertAdjacentHTML('beforeend', cd);
      h('h2', { text: 'Problématiser · Situation-problème' }, panel);
      h('p', { text: F.situation }, panel);
      h('p', {}, panel, '<b>À produire :</b> une conclusion justifiée par tes mesures. <b>Objectif :</b> ' + esc(F.objectifEleve || F.objectif));
      h('p', {}, panel, '<b>Matériel :</b> ' + esc(F.materiel));
      var d = h('div', { style: 'text-align:center' }, panel); if (F.illustration) F.illustration(d);
      var r = h('div', { class: 'row' }, panel);
      next('Commencer : ma prévision ▸', 1, r);
      sheetCard(F, st, panel, ['vierge']);
    }

    function sPrevision() {
      h('h2', { text: 'Émettre une hypothèse' }, panel);
      h('p', { text: F.prevision.consigne }, panel);
      var pv = st.prevision;
      if (pv && !pv.edit) {
        var ch = F.prevision.choix.filter(function (c) { return c[0] === pv.choix; })[0];
        h('div', { class: 'msg ok' }, panel, '<b>Prévision enregistrée à ' + hhmm(pv.ts) + '.</b><br>' + (pv.inconnu ? 'Je ne sais pas encore ; mon hypothèse : ' : '') + esc(ch[1]) + (pv.nombre ? ' (' + esc(pv.nombre) + ' ' + esc(F.prevision.nombre.unite) + ')' : '') + ' — parce que ' + esc(pv.raison) + (pv.revisions && pv.revisions.length ? '<br><i>' + pv.revisions.length + ' révision(s) conservée(s).</i>' : ''));
        var r = h('div', { class: 'row' }, panel);
        next('Passer à la manipulation ▸', 2, r);
        var rv = h('button', { class: 'btn', type: 'button', text: 'Réviser ma prévision (la première est conservée)' }, r);
        rv.onclick = function () { pv.edit = true; draw(); };
        return;
      }
      var cur0 = pv && pv.edit ? pv : null, inconnu = h('label', { class: 'opt' }, panel, '<input type="checkbox" id="pi"> <span>Je ne sais pas encore : je formule une hypothèse et je vais vérifier.</span>');
      var f = h('fieldset', { style: 'border:0;padding:0;margin:0' }, panel); h('legend', { class: 'noprint', style: 'font-weight:700' }, f, 'Sens de variation attendu');
      F.prevision.choix.forEach(function (c) { h('label', { class: 'opt' }, f, '<input type="radio" name="pc" value="' + c[0] + '"' + (cur0 && cur0.choix === c[0] ? ' checked' : '') + '><span>' + esc(c[1]) + '</span>'); });
      var NB = F.prevision.nombre, nb = null;
      if (NB) { h('label', { for: 'pn', text: NB.label + ' (' + NB.unite + ') :' }, panel); nb = h('input', { type: 'text', inputmode: 'decimal', id: 'pn', autocomplete: 'off', style: 'max-width:160px' }, panel); if (cur0 && cur0.nombre != null) nb.value = cur0.nombre; }
      h('label', { for: 'pr', text: 'Je justifie :' }, panel); var ta = h('textarea', { id: 'pr' }, panel); if (cur0) ta.value = cur0.raison;
      var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, panel);
      var b = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer ma prévision' }, panel);
      b.onclick = function () {
        var sel = panel.querySelector('input[name=pc]:checked');
        if (!sel || ta.value.trim().length < 3 || (nb && !isFinite(parseFloat(nb.value.replace(',', '.'))))) { msg.hidden = false; msg.textContent = 'Choisis une réponse et écris une justification, même courte.'; return; }
        var neo = { choix: sel.value, raison: ta.value.trim(), inconnu: $('#pi').checked, ts: Date.now() }; if (nb) neo.nombre = nb.value.trim();
        if (cur0) { var init = cur0.initiale || { choix: cur0.choix, raison: cur0.raison, inconnu: cur0.inconnu, ts: cur0.ts, nombre: cur0.nombre }; neo = { choix: neo.choix, raison: neo.raison, inconnu: neo.inconnu, nombre: neo.nombre, ts: neo.ts, initiale: init, revisions: (cur0.revisions || []).concat([{ choix: neo.choix, raison: neo.raison, ts: neo.ts }]) }; }
        else { neo.initiale = { choix: neo.choix, raison: neo.raison, inconnu: neo.inconnu, nombre: neo.nombre, ts: neo.ts }; neo.revisions = []; }
        st.prevision = neo; save(KEY, st); view = 1; draw();
      };
    }

    function sManip() {
      h('h2', { text: 'Expérimenter / Investiguer' }, panel);
      h('p', {}, panel, '<b>Variable modifiée :</b> ' + esc(F.variable) + ' · <b>Maintenu :</b> ' + esc(F.maintenu));
      F.manip(panel, ctx());
      var r = h('div', { class: 'row' }, panel); var nx = h('button', { class: 'btn primary', type: 'button', text: 'J’ai assez d’essais : confronter ▸' }, r); nx.onclick = function () { go(3); panel.focus(); }; nx.disabled = !readyForAnalysis(); ctxNx = nx;
    }
    function sConfront() {
      h('h2', { text: 'Analyser et interpréter' }, panel);
      h('p', { text: F.confrontation }, panel);
      var g = h('div', { class: 'grid2' }, panel), a = h('div', { class: 'card' }, g), b = h('div', { class: 'card' }, g);
      var pv = st.prevision, ch = F.prevision.choix.filter(function (c) { return c[0] === pv.initiale.choix; })[0];
      h('h3', { text: 'Ma prévision initiale' }, a); h('p', {}, a, (pv.initiale.inconnu ? '<i>Je ne savais pas encore ; hypothèse :</i> ' : '') + esc(ch[1]) + (pv.initiale.nombre ? ' (' + esc(pv.initiale.nombre) + ' ' + esc(F.prevision.nombre.unite) + ')' : '') + ' — parce que ' + esc(pv.initiale.raison));
      if (pv.revisions && pv.revisions.length) h('p', { style: 'color:var(--mist)' }, a, 'Révisée ' + pv.revisions.length + ' fois depuis.');
      h('h3', { text: 'Mes résultats (données simulées)' }, b);
      h('div', { style: 'overflow-x:auto' }, b, tableHTML(F, F.lignes(st)));
      var dg = F.diagnostic && F.diagnostic(st);
      if (dg && dg.length) h('div', { class: 'card' }, panel, '<h3 style="margin-top:0">Diagnostic de mes calculs (indicatif, non noté)</h3><ul>' + dg.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>');
      var cf = st.confront || {};
      var f = h('fieldset', { style: 'border:0;padding:0' }, panel); h('legend', { style: 'font-weight:700' }, f, 'Ma prévision est…');
      [['confirmee', 'confirmée'], ['infirmee', 'infirmée'], ['partielle', 'partiellement confirmée'], ['non', 'impossible à conclure avec ces essais']].forEach(function (c) { h('label', { class: 'opt' }, f, '<input type="radio" name="vd" value="' + c[0] + '"' + (cf.verdict === c[0] ? ' checked' : '') + '><span>' + c[1] + '</span>'); });
      h('label', { for: 'pre', text: F.retroaction }, panel); var t1 = h('textarea', { id: 'pre' }, panel); t1.value = cf.preuve || '';
      h('label', { for: 'mod', text: 'Ce que je conserve ou modifie de ma prévision, et pourquoi :' }, panel); var t2 = h('textarea', { id: 'mod' }, panel); t2.value = cf.modif || '';
      var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, panel);
      var r = h('div', { class: 'row' }, panel);
      var ok = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer et passer au bilan ▸' }, r);
      ok.onclick = function () {
        var sel = panel.querySelector('input[name=vd]:checked');
        if (!sel || t1.value.trim().length < 3) { msg.hidden = false; msg.textContent = 'Choisis un verdict et cite un résultat précis (avec ses valeurs).'; return; }
        st.confront = { verdict: sel.value, preuve: t1.value.trim(), modif: t2.value.trim(), ts: Date.now() }; save(KEY, st); view = 4; st.step = 4; save(KEY, st); draw();
      };
      var back = h('button', { class: 'btn', type: 'button', text: '◂ Reprendre une expérience (mes essais sont conservés)' }, r); back.onclick = function () { go(2); };
    }

    function sBilan() {
      h('h2', { text: 'Conclure · Bilan et transfert' }, panel);
      h('label', { for: 'cc', text: 'Ma conclusion personnelle (avant la synthèse) :' }, panel); var t = h('textarea', { id: 'cc' }, panel); t.value = st.conclusion || '';
      var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, panel);
      var r = h('div', { class: 'row' }, panel);
      var b = h('button', { class: 'btn primary', type: 'button', text: st.conclusion ? 'Mettre à jour ma conclusion' : 'Valider ma conclusion' }, r);
      b.onclick = function () { if (t.value.trim().length < 5) { msg.hidden = false; msg.textContent = 'Écris ta conclusion en une phrase complète, avec au moins une valeur mesurée.'; return; } st.conclusion = t.value.trim(); save(KEY, st); drawTabs(); draw(); };
      if (!st.conclusion) return;
      h('div', { class: 'msg ok' }, panel, '<b>Synthèse scientifique.</b> ' + esc(F.synthese));
      h('h3', { text: 'Transfert' }, panel); h('p', { text: F.transfert.q }, panel);
      var tr = st.transfert || {}, T = F.transfert, isNum = T.type === 'nombre';
      var f = h('fieldset', { style: 'border:0;padding:0' }, panel), inp = null;
      if (isNum) {
        h('label', { for: 'tn', text: 'Ma réponse (' + T.unite + ') :' }, f); inp = h('input', { type: 'text', inputmode: 'decimal', id: 'tn', autocomplete: 'off', style: 'max-width:160px' }, f); inp.value = tr.rep || '';
      } else {
        (T.options || [['oui', 'Oui'], ['non', 'Non']]).forEach(function (c) { h('label', { class: 'opt' }, f, '<input type="radio" name="tr" value="' + c[0] + '"' + (tr.rep === c[0] ? ' checked' : '') + '><span>' + esc(c[1]) + '</span>'); });
      }
      h('label', { for: 'tj', text: 'Je justifie :' }, panel); var tj = h('textarea', { id: 'tj' }, panel); tj.value = tr.just || '';
      var res = h('div', { class: 'msg', 'aria-live': 'polite', hidden: '' }, panel);
      function good(rep) { return isNum ? Math.abs(parseFloat(String(rep).replace(',', '.')) - T.rep) <= (T.tol || 0) : rep === T.rep; }
      function show() { var s2 = st.transfert; if (!s2) return; var g = good(s2.rep); res.hidden = false; res.className = 'msg ' + (g ? 'ok' : 'bad'); res.innerHTML = '<b>' + (g ? 'Exact.' : 'Pas tout à fait.') + '</b> ' + esc(T.expl); }
      var ck = h('button', { class: 'btn', type: 'button', text: 'Vérifier ma réponse' }, panel);
      ck.onclick = function () {
        var v = isNum ? inp.value.trim() : (panel.querySelector('input[name=tr]:checked') || {}).value;
        if (!v) return; st.transfert = { rep: v, just: tj.value.trim(), ts: Date.now() }; save(KEY, st); show();
      };
      var cor = h('div', {}, panel);
      function corrige() {
        cor.innerHTML = ''; if (!st.transfert) return;
        var ac = st.autocorr || { coches: [], note: '' }, c = h('div', { class: 'card' }, cor);
        h('h3', { text: 'Corrigé : je compare avec mon travail' }, c);
        h('p', { style: 'color:var(--mist);font-size:15px' }, c, 'Tu as écrit ta conclusion et tenté le transfert : tu peux maintenant comparer ton travail avec la référence.');
        h('div', { class: 'msg ok' }, c, '<b>Référence.</b> ' + esc(F.prof.reference));
        h('h4', { text: 'Ce que ma fiche doit montrer (je coche ce que j’ai bien fait)' }, c);
        var fs = h('fieldset', { style: 'border:0;padding:0;margin:0' }, c);
        F.prof.attendus.forEach(function (a, k) { h('label', { class: 'opt' }, fs, '<input type="checkbox" data-k="' + k + '"' + (ac.coches.indexOf(k) >= 0 ? ' checked' : '') + '><span>' + esc(a) + '</span>'); });
        h('h4', { text: 'Erreurs fréquentes : est-ce que je me reconnais ?' }, c);
        h('ul', {}, c, F.prof.erreurs.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join(''));
        h('label', { for: 'ac', text: 'Ce que j’avais faux ou oublié, et ce que j’ai compris :' }, c); var ta = h('textarea', { id: 'ac' }, c); ta.value = ac.note || '';
        var sv = h('button', { class: 'btn', type: 'button', text: 'Enregistrer mon auto-correction' }, c), ok = h('span', { 'aria-live': 'polite', style: 'margin-left:10px' }, c);
        sv.onclick = function () { var cs = []; [].forEach.call(c.querySelectorAll('input[data-k]:checked'), function (i) { cs.push(Number(i.getAttribute('data-k'))); }); st.autocorr = { coches: cs, note: ta.value.trim(), ts: Date.now() }; save(KEY, st); ok.textContent = 'Enregistrée dans ma fiche.'; };
      }
      ck.addEventListener('click', function () { if (st.transfert) corrige(); });
      show(); corrige();
      var r2 = h('div', { class: 'row' }, panel); next('Voir ma trace ▸', 5, r2);
    }

    function sTrace() {
      h('h2', { text: 'Communiquer · Ma trace' }, panel);
      var pv = st.prevision, ch = F.prevision.choix.filter(function (c) { return c[0] === pv.initiale.choix; })[0];
      h('div', { class: 'card' }, panel,
        '<p><b>Prévision initiale :</b> ' + esc(ch[1]) + (pv.initiale.nombre ? ' (' + esc(pv.initiale.nombre) + ' ' + esc(F.prevision.nombre.unite) + ')' : '') + ' — ' + esc(pv.initiale.raison) + '</p>' +
        '<p><b>Essais :</b> ' + st.essais.map(function(e){ return esc(F.resume(e)); }).join(' · ') + ' <i>(données simulées)</i></p>' +
        '<p><b>Verdict :</b> ' + esc(st.confront.verdict) + ' — ' + esc(st.confront.preuve) + '</p>' +
        '<p><b>Ma conclusion :</b> ' + esc(st.conclusion) + '</p>' +
        '<p><b>Aides utilisées :</b> ' + st.aides + '</p>' +
        '<p style="color:var(--mist);font-size:15px">Critère de réussite : ' + esc(F.critere) + '. Cette trace garde ta propre conclusion ; elle ne contient pas le corrigé. Ton travail est enregistré sur cet appareil seulement.</p>');
      if (F.pedagogie) {
        var ae = st.autoeval || {}, ce = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon auto-évaluation' }, ce);
        h('p', { style: 'color:var(--mist);font-size:15px' }, ce, 'Pour chaque objectif, je dis honnêtement où j’en suis. Ton professeur donnera son avis sur la fiche imprimée.');
        F.pedagogie.objectifs.forEach(function (o) { h('label', { for: 'ae_' + o.id, text: o.eleve }, ce); h('select', { id: 'ae_' + o.id }, ce, ['', 'non', 'partie', 'oui'].map(function (k) { return '<option value="' + k + '"' + (ae[o.id] === k ? ' selected' : '') + '>' + (k ? AEL[k] : '— choisir —') + '</option>'; }).join('')); });
        var sv2 = h('button', { class: 'btn', type: 'button', text: 'Enregistrer mon auto-évaluation' }, ce), ok2 = h('span', { 'aria-live': 'polite', style: 'margin-left:10px' }, ce);
        sv2.onclick = function () { var r = {}; F.pedagogie.objectifs.forEach(function (o) { r[o.id] = panel.querySelector('#ae_' + o.id).value; }); st.autoeval = r; save(KEY, st); ok2.textContent = 'Enregistrée dans ma fiche.'; };
      }
      sheetCard(F, st, panel, ['remplie', 'vierge']);
      var pf = h('div', { class: 'card' }, panel); h('h3', { text: 'Espace enseignant' }, pf);
      if (!profMode) {
        h('p', { style: 'color:var(--mist)' }, pf, 'Le corrigé et les attendus sont une ressource distincte de la trace élève.');
        h('button', { class: 'btn', type: 'button', text: 'Passer en mode enseignant' }, pf).onclick = function () { profMode = true; draw(); };
      } else {
        h('div', { class: 'bannerprof', role: 'status' }, pf, 'Mode enseignant activé : les réponses attendues sont affichées. Ne pas projeter devant les élèves avant la fin de l’activité.');
        h('p', {}, pf, '<b>Référence :</b> ' + esc(F.prof.reference));
        h('ul', {}, pf, F.prof.attendus.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join(''));
        h('p', {}, pf, '<b>Erreurs usuelles :</b> ' + F.prof.erreurs.map(esc).join(' · '));
        var pv2 = h('div', { 'aria-live': 'polite' }, pf, '<p class="sub">Chargement des notes enseignant…</p>');
        privLoad(F).then(function (r) {
          pv2.innerHTML = r.ok ? '<p><b>Limites du modèle :</b> ' + esc(PRIV[F.id].limites) + '</p><p><b>Différenciation :</b> ' + esc(PRIV[F.id].differenciation) + '</p>'
            : '<div class="msg">' + esc(r.msg) + (r.code === 401 ? ' <a href="../connexion/">Se connecter</a>' : '') + '</div>';
        });
        if (F.pedagogie) { h('h4', { text: 'Compétences, objectifs et évaluation' }, pf); h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau des objectifs, défile horizontalement' }, pf, '<table class="t"><thead><tr><th scope="col">Objectif</th><th scope="col">Savoir-faire</th><th scope="col">Indicateur de réussite</th><th scope="col">Où l’observer</th></tr></thead><tbody>' + F.pedagogie.objectifs.map(function (o) { return '<tr><th scope="row" style="text-align:left">' + o.id + ' — ' + esc(o.objectif) + '</th><td>' + o.savoirFaire.map(esc).join(' ; ') + '</td><td>' + esc(o.indicateur) + '</td><td>' + esc(o.preuve) + '</td></tr>'; }).join('') + '</tbody></table>'); h('p', { style: 'color:var(--mist);font-size:15px' }, pf, 'Connaissance visée : ' + esc(F.pedagogie.connaissance)); }
        var rr = h('div', { class: 'row' }, pf);
        h('button', { class: 'btn primary', type: 'button', text: 'Imprimer la version professeur' }, rr).onclick = function () { printDoc(F, st, 'prof'); };
        h('button', { class: 'btn', type: 'button', text: 'Enregistrer en PDF (version professeur)' }, rr).onclick = function () { printDoc(F, st, 'prof'); };
        h('button', { class: 'btn', type: 'button', text: 'Quitter le mode enseignant' }, rr).onclick = function () { profMode = false; draw(); };
      }
      var rs = h('div', { class: 'row' }, panel); var b = h('button', { class: 'btn', type: 'button', text: 'Recommencer l’activité (efface mon travail)' }, rs);
      b.onclick = function () {
        if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'Confirmer : tout effacer sur cet appareil'; return; }
        try { localStorage.removeItem(KEY); } catch (e) {} st = load(KEY); view = 0; draw();
      };
    }

    function draw() {
      drawTabs(); panel.innerHTML = '';
      [sSituation, sPrevision, sManip, sConfront, sBilan, sTrace][view]();
    }
    if (!$('#print')) h('div', { id: 'print', 'aria-hidden': 'true' }, document.body);
    draw();
  }

  window.Activite = { cadreHTML: cadreHTML, run: run, num: num, h: h, $: $, esc: esc };
})();
