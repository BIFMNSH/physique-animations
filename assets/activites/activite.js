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
  var STEPS = ['Situation', 'Prévision', 'Manipulation', 'Confrontation', 'Bilan', 'Trace'];

  function load(key) { try { var s = JSON.parse(localStorage.getItem(key)); if (s && s.v === 1) return s; } catch (e) {} return { v: 1, prevision: null, essais: [], confront: null, conclusion: '', transfert: null, aides: 0, step: 0 }; }
  function save(key, st) { try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {} }

  /* ---- modèle de séquence de pesée (indépendant du rendu) ---- */
  function newRun(F, sucre) { return { sucre: sucre, phase: 0, avant: null, apres: null }; } // 0 rien · 1 pesé avant · 2 incliné · 3 agité · 4 pesé après

  /* ---- illustration SVG : flacon fermé sur une balance ---- */
  function flaskSVG(host) {
    host.innerHTML =
      '<svg viewBox="0 0 320 280" role="img" aria-label="Un flacon fermé posé sur une balance. Dans le flacon, de l’eau et une coupelle fixée au bouchon qui contient du sucre." style="width:100%;max-width:420px">' +
      '<rect x="40" y="236" width="240" height="26" rx="8" fill="#5B6B88"/><rect x="60" y="226" width="200" height="12" rx="3" fill="#7C8CA8"/>' +
      '<g id="fl" style="transform-origin:160px 226px;transition:transform .8s">' +
      '<path d="M110 90 h100 v128 a8 8 0 0 1 -8 8 h-84 a8 8 0 0 1 -8 -8 z" fill="rgba(156,200,232,.15)" stroke="var(--glass)" stroke-width="3"/>' +
      '<rect x="112" y="150" width="96" height="74" rx="4" fill="rgba(79,168,255,.38)"/>' +
      '<rect x="128" y="72" width="64" height="20" rx="4" fill="#C77B30"/>' +
      '<path d="M150 92 v34 M170 92 v34" stroke="#C77B30" stroke-width="3"/><path d="M138 126 h44 l-6 14 h-32 z" fill="none" stroke="#C77B30" stroke-width="3" id="coupe"/>' +
      '<g id="grains" fill="#FFF8E7" stroke="#B8A88A" stroke-width="1"></g></g>' +
      '<rect x="26" y="40" width="268" height="206" rx="14" fill="none" stroke="var(--or)" stroke-width="2.5" stroke-dasharray="7 6"/>' +
      '<text x="34" y="34" font-size="13" fill="var(--or-soft)" font-family="sans-serif">Système : tout ce qui est dans le flacon fermé</text></svg>';
    var g = $('#grains', host), i, pts = [[146,132],[154,134],[162,131],[170,134],[150,128],[158,129],[166,128],[174,131],[142,134],[178,134]];
    g.innerHTML = '';
    for (i = 0; i < 10; i++) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', pts[i][0]); c.setAttribute('cy', pts[i][1]); c.setAttribute('r', 3.2); c.setAttribute('class', 'grain'); g.appendChild(c); }
    return { setSugar: function (n) { [].forEach.call(g.children, function (c, k) { c.style.display = k < n ? '' : 'none'; c.style.opacity = 1; c.style.transform = ''; }); },
      tilt: function (on) { $('#fl', host).style.transform = on ? 'rotate(-38deg)' : ''; },
      drop: function () { [].forEach.call(g.children, function (c, k) { c.style.transform = 'translate(' + (-10 + (k % 5) * 6) + 'px,' + (70 + (k % 3) * 8) + 'px)'; }); },
      dissolve: function () { [].forEach.call(g.children, function (c) { c.style.opacity = 0; }); },
      reset: function (n) { $('#fl', host).style.transform = ''; this.setSugar(n); } };
  }

  /* ---- impression ---- */
  function printDoc(F, st, mode) { // mode : 'vierge' | 'remplie' | 'prof'
    var P = $('#print'); P.innerHTML = '';
    var filled = mode !== 'vierge', prof = mode === 'prof';
    var line = function (t, v) { return '<p><b>' + esc(t) + '</b> ' + (filled && v ? esc(v) : '') + '</p>' + (filled && v ? '' : '<div class="line"></div><div class="line"></div>'); };
    var pv = st.prevision, ch = pv && F.prevision.choix.filter(function (c) { return c[0] === pv.choix; })[0];
    var h1 = '<h1>' + esc(F.titre) + '</h1><p>' + esc(F.id) + ' · version ' + esc(F.version) + ' · niveau ' + esc(F.niveau) + ' · ' + (prof ? 'VERSION PROFESSEUR' : filled ? 'fiche remplie' : 'fiche vierge') + '</p><p>Nom : ____________ Classe : ______ Date : ________</p>';
    var rows = '', i;
    for (i = 0; i < Math.max(filled ? st.essais.length : 0, 3); i++) { var e = filled && st.essais[i]; rows += '<tr><td>' + (e ? e.sucre : '') + '</td><td>' + (e ? num(e.avant) : '') + '</td><td>' + (e ? num(e.apres) : '') + '</td><td>' + (e ? num(e.apres - e.avant) : '') + '</td></tr>'; }
    var p1 = h1 + '<h2>Situation</h2><p>' + esc(F.situation) + '</p><p><b>Matériel :</b> ' + esc(F.materiel) + '</p>' +
      '<h2>Ma prévision</h2><p>' + esc(F.prevision.consigne) + '</p>' + (filled && pv ? '<p>' + (pv.inconnu ? 'Je ne sais pas encore. Mon hypothèse : ' : '') + esc(ch ? ch[1] : '') + ' — parce que ' + esc(pv.raison || '') + '</p>' : '<div class="line"></div><div class="line"></div>') +
      '<h2>Protocole</h2><ol>' + F.protocole.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol><p>Variable modifiée : ' + esc(F.variable) + '. Conditions maintenues : ' + esc(F.maintenu) + '.</p>' +
      '<table><thead><tr><th>Sucre (g)</th><th>Masse avant (g)</th><th>Masse après (g)</th><th>Différence (g)</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      (filled && st.essais.length ? '<p><i>Données simulées (modèle ' + esc(F.modele) + ').</i></p>' : '');
    var cf = st.confront, verdicts = { confirmee: 'confirmée', infirmee: 'infirmée', partielle: 'partiellement confirmée', non: 'non testée de façon concluante' };
    var tr = st.transfert;
    var p2 = '<div class="pb"></div>' + h1.split('<p>Nom')[0] + '<h2>Expliquer</h2>' +
      line('Ma prévision initiale :', pv && (ch ? ch[1] : '')) +
      line('Mon résultat précis (valeurs et unités) :', filled && st.essais.length ? st.essais.map(function (e) { return e.sucre + ' g de sucre : ' + num(e.avant) + ' g puis ' + num(e.apres) + ' g'; }).join(' ; ') : '') +
      '<p><b>Ma prévision est :</b> ' + (filled && cf ? esc(verdicts[cf.verdict] || '') : '☐ confirmée ☐ infirmée ☐ partiellement confirmée ☐ non testée de façon concluante') + '</p>' +
      line('Je le justifie avec :', cf && cf.preuve) + line('Ma conclusion personnelle :', st.conclusion) +
      '<h2>Transfert</h2><p>' + esc(F.transfert.q) + '</p>' + (filled && tr ? '<p>Ma réponse : ' + esc(tr.rep) + ' — ' + esc(tr.just || '') + '</p>' : '<div class="line"></div><div class="line"></div>') +
      '<p><b>Critère de réussite :</b> ' + esc(F.critere) + '</p>' +
      (filled ? '<p><b>Aides utilisées :</b> ' + st.aides + '</p>' : '<p>Réussites observées : ______ Priorité de progression : ______ Aides utilisées : ______</p>');
    var pr = '';
    if (prof) pr = '<div class="pb"></div><h1>Corrigé professeur — ' + esc(F.titre) + '</h1><div class="box"><p><b>Référence :</b> ' + esc(F.prof.reference) + '</p></div><h2>Attendus</h2><ul>' + F.prof.attendus.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul><h2>Erreurs usuelles</h2><ul>' + F.prof.erreurs.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul><h2>Limites du modèle</h2><p>' + esc(F.prof.limites) + '</p><h2>Transfert</h2><p>' + esc(F.transfert.rep) + ' — ' + esc(F.transfert.expl) + '</p><h2>Différenciation</h2><p>' + esc(F.prof.differenciation) + '</p>';
    P.innerHTML = p1 + p2 + pr;
    window.print();
  }

  /* ---- application ---- */
  function run(F, root) {
    var KEY = 'pc-act-' + F.id, st = load(KEY), profMode = false, view = st.step || 0, cur = null, api = null;
    function reached() { // plus grand écran accessible
      if (!st.prevision) return 1;
      if (!st.essais.length) return 2;
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
      h('h2', { text: 'Situation-problème' }, panel);
      h('p', { text: F.situation }, panel);
      h('p', {}, panel, '<b>À produire :</b> une conclusion justifiée par tes mesures. <b>Objectif :</b> ' + esc(F.objectifEleve || F.objectif));
      h('p', {}, panel, '<b>Matériel :</b> ' + esc(F.materiel));
      var d = h('div', { style: 'text-align:center' }, panel); flaskSVG(d).setSugar(5);
      var r = h('div', { class: 'row' }, panel);
      next('Commencer : ma prévision ▸', 1, r);
      var v = h('button', { class: 'btn', type: 'button', text: 'Fiche vierge (imprimer)' }, r); v.onclick = function () { printDoc(F, st, 'vierge'); };
    }

    function sPrevision() {
      h('h2', { text: 'Ma prévision' }, panel);
      h('p', { text: F.prevision.consigne }, panel);
      var pv = st.prevision;
      if (pv && !pv.edit) {
        var ch = F.prevision.choix.filter(function (c) { return c[0] === pv.choix; })[0];
        h('div', { class: 'msg ok' }, panel, '<b>Prévision enregistrée à ' + hhmm(pv.ts) + '.</b><br>' + (pv.inconnu ? 'Je ne sais pas encore ; mon hypothèse : ' : '') + esc(ch[1]) + ' — parce que ' + esc(pv.raison) + (pv.revisions && pv.revisions.length ? '<br><i>' + pv.revisions.length + ' révision(s) conservée(s).</i>' : ''));
        var r = h('div', { class: 'row' }, panel);
        next('Passer à la manipulation ▸', 2, r);
        var rv = h('button', { class: 'btn', type: 'button', text: 'Réviser ma prévision (la première est conservée)' }, r);
        rv.onclick = function () { pv.edit = true; draw(); };
        return;
      }
      var cur0 = pv && pv.edit ? pv : null, inconnu = h('label', { class: 'opt' }, panel, '<input type="checkbox" id="pi"> <span>Je ne sais pas encore : je formule une hypothèse et je vais vérifier.</span>');
      var f = h('fieldset', { style: 'border:0;padding:0;margin:0' }, panel); h('legend', { class: 'noprint', style: 'font-weight:700' }, f, 'Sens de variation attendu');
      F.prevision.choix.forEach(function (c) { h('label', { class: 'opt' }, f, '<input type="radio" name="pc" value="' + c[0] + '"' + (cur0 && cur0.choix === c[0] ? ' checked' : '') + '><span>' + esc(c[1]) + '</span>'); });
      h('label', { for: 'pr', text: 'Je justifie :' }, panel); var ta = h('textarea', { id: 'pr' }, panel); if (cur0) ta.value = cur0.raison;
      var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, panel);
      var b = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer ma prévision' }, panel);
      b.onclick = function () {
        var sel = panel.querySelector('input[name=pc]:checked');
        if (!sel || ta.value.trim().length < 3) { msg.hidden = false; msg.textContent = 'Choisis une réponse et écris une justification, même courte.'; return; }
        var neo = { choix: sel.value, raison: ta.value.trim(), inconnu: $('#pi').checked, ts: Date.now() };
        if (cur0) { var init = cur0.initiale || { choix: cur0.choix, raison: cur0.raison, inconnu: cur0.inconnu, ts: cur0.ts }; neo = { choix: neo.choix, raison: neo.raison, inconnu: neo.inconnu, ts: neo.ts, initiale: init, revisions: (cur0.revisions || []).concat([{ choix: neo.choix, raison: neo.raison, ts: neo.ts }]) }; }
        else { neo.initiale = { choix: neo.choix, raison: neo.raison, inconnu: neo.inconnu, ts: neo.ts }; neo.revisions = []; }
        st.prevision = neo; save(KEY, st); view = 1; draw();
      };
    }

    function sManip() {
      h('h2', { text: 'Manipulation' }, panel);
      h('p', {}, panel, '<b>Variable modifiée :</b> ' + esc(F.variable) + ' · <b>Maintenu :</b> ' + esc(F.maintenu));
      var g = h('div', { class: 'grid2' }, panel), L = h('div', {}, g), R = h('div', {}, g);
      var holder = h('div', { style: 'text-align:center' }, L); var fl = flaskSVG(holder);
      var balRow = h('div', { class: 'row', style: 'justify-content:center' }, L);
      h('span', { text: 'Balance (flacon + contenu) :' }, balRow);
      var bal = h('output', { class: 'bal', 'aria-live': 'polite' }, balRow, '— g');
      var sl = h('label', { for: 'sug', text: 'Quantité de sucre dans la coupelle : ' }, R); var out = h('b', {}, sl, '');
      var rng = h('input', { type: 'range', id: 'sug', min: F.sucreMin, max: F.sucreMax, step: 1, value: cur ? cur.sucre : 5, style: 'width:100%' }, R);
      var ol = h('ol', { class: 'steps' }, R);
      var labs = ['Peser le flacon fermé (avant)', 'Incliner le flacon', 'Agiter sans ouvrir', 'Peser le même flacon (après)'];
      var btns = labs.map(function (t, i) { var li = h('li', {}, ol); var b = h('button', { class: 'btn', type: 'button', text: (i + 1) + ' · ' + t }, li); b.onclick = function () { act(i); }; return { li: li, b: b }; });
      var note = h('p', { style: 'color:var(--mist);font-size:15px' }, R, 'Le flacon reste fermé pendant tout l’essai : rien n’entre, rien ne sort. Changer la quantité de sucre ouvre un nouvel essai.');
      var again = h('button', { class: 'btn', type: 'button', text: 'Nouvel essai (même quantité)', disabled: '' }, R); again.onclick = function () { fresh(cur.sucre); };
      var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, R); var aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, R);
      aid.onclick = function () {
        if (!st.essais.length) { aidBox.hidden = false; aidBox.textContent = 'L’aide est disponible après ton premier essai complet : essaie d’abord seul.'; return; }
        var k = Math.min(st.aides, F.aides.length - 1); aidBox.hidden = false; aidBox.textContent = F.aides[k]; st.aides++; save(KEY, st);
      };
      var tb = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes essais' }, tb); var tbl = h('div', {}, tb);
      var r = h('div', { class: 'row' }, panel); var nx = h('button', { class: 'btn primary', type: 'button', text: 'J’ai assez d’essais : confronter ▸' }, r); nx.onclick = function () { go(3); panel.focus(); };
      function table() {
        tbl.innerHTML = '<table class="t"><caption class="noprint" style="text-align:left;color:var(--mist)">Données simulées — modèle ' + esc(F.modele) + '</caption><thead><tr><th>Sucre (g)</th><th>Masse avant (g)</th><th>Masse après (g)</th><th>Différence (g)</th></tr></thead><tbody>' +
          (st.essais.length ? st.essais.map(function (e) { return '<tr><td>' + e.sucre + '</td><td>' + num(e.avant) + '</td><td>' + num(e.apres) + '</td><td>' + num(e.apres - e.avant) + '</td></tr>'; }).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--mist)">Aucun essai pour l’instant</td></tr>') + '</tbody></table>';
        nx.disabled = !st.essais.length;
      }
      function paint() {
        out.textContent = cur.sucre + ' g';
        btns.forEach(function (o, i) { o.li.className = cur.phase > i ? 'done' : cur.phase === i ? 'now' : ''; o.b.disabled = cur.phase !== i; });
        again.disabled = cur.phase !== 4;
        bal.textContent = cur.phase === 0 ? '— g' : cur.phase < 4 ? num(cur.avant) + ' g' : num(cur.apres) + ' g';
        table();
      }
      function fresh(n) { cur = newRun(F, n); fl.reset(n); paint(); }
      function act(i) {
        if (cur.phase !== i) return;
        var m = F.essai(cur.sucre);
        if (i === 0) { cur.avant = m.avant; cur.phase = 1; }
        else if (i === 1) { fl.tilt(true); fl.drop(); cur.phase = 2; }
        else if (i === 2) { fl.dissolve(); cur.phase = 3; }
        else { cur.apres = m.apres; cur.phase = 4; fl.tilt(false); st.essais.push({ sucre: cur.sucre, avant: cur.avant, apres: cur.apres, ts: Date.now(), statut: 'simulé', modele: F.modele }); save(KEY, st); drawTabs(); }
        paint();
      }
      rng.oninput = function () { fresh(Number(rng.value)); };
      fresh(Number(rng.value));
    }

    function sConfront() {
      h('h2', { text: 'Confrontation' }, panel);
      h('p', { text: F.confrontation }, panel);
      var g = h('div', { class: 'grid2' }, panel), a = h('div', { class: 'card' }, g), b = h('div', { class: 'card' }, g);
      var pv = st.prevision, ch = F.prevision.choix.filter(function (c) { return c[0] === pv.initiale.choix; })[0];
      h('h3', { text: 'Ma prévision initiale' }, a); h('p', {}, a, (pv.initiale.inconnu ? '<i>Je ne savais pas encore ; hypothèse :</i> ' : '') + esc(ch[1]) + ' — parce que ' + esc(pv.initiale.raison));
      if (pv.revisions && pv.revisions.length) h('p', { style: 'color:var(--mist)' }, a, 'Révisée ' + pv.revisions.length + ' fois depuis.');
      h('h3', { text: 'Mes résultats (données simulées)' }, b);
      h('div', {}, b, '<table class="t"><thead><tr><th>Sucre (g)</th><th>Avant (g)</th><th>Après (g)</th><th>Diff. (g)</th></tr></thead><tbody>' + st.essais.map(function (e) { return '<tr><td>' + e.sucre + '</td><td>' + num(e.avant) + '</td><td>' + num(e.apres) + '</td><td>' + num(e.apres - e.avant) + '</td></tr>'; }).join('') + '</tbody></table>');
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
      h('h2', { text: 'Bilan et transfert' }, panel);
      h('label', { for: 'cc', text: 'Ma conclusion personnelle (avant la synthèse) :' }, panel); var t = h('textarea', { id: 'cc' }, panel); t.value = st.conclusion || '';
      var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, panel);
      var r = h('div', { class: 'row' }, panel);
      var b = h('button', { class: 'btn primary', type: 'button', text: st.conclusion ? 'Mettre à jour ma conclusion' : 'Valider ma conclusion' }, r);
      b.onclick = function () { if (t.value.trim().length < 5) { msg.hidden = false; msg.textContent = 'Écris ta conclusion en une phrase complète, avec au moins une valeur mesurée.'; return; } st.conclusion = t.value.trim(); save(KEY, st); drawTabs(); draw(); };
      if (!st.conclusion) return;
      h('div', { class: 'msg ok' }, panel, '<b>Synthèse scientifique.</b> ' + esc(F.synthese));
      h('h3', { text: 'Transfert' }, panel); h('p', { text: F.transfert.q }, panel);
      var tr = st.transfert || {};
      var f = h('fieldset', { style: 'border:0;padding:0' }, panel);
      [['oui', 'Oui'], ['non', 'Non']].forEach(function (c) { h('label', { class: 'opt' }, f, '<input type="radio" name="tr" value="' + c[0] + '"' + (tr.rep === c[0] ? ' checked' : '') + '><span>' + c[1] + '</span>'); });
      h('label', { for: 'tj', text: 'Je justifie :' }, panel); var tj = h('textarea', { id: 'tj' }, panel); tj.value = tr.just || '';
      var res = h('div', { class: 'msg', 'aria-live': 'polite', hidden: '' }, panel);
      function show() { var s = st.transfert; if (!s) return; res.hidden = false; res.className = 'msg ' + (s.rep === F.transfert.rep ? 'ok' : 'bad'); res.innerHTML = '<b>' + (s.rep === F.transfert.rep ? 'Exact.' : 'Pas tout à fait.') + '</b> ' + esc(F.transfert.expl); }
      var ck = h('button', { class: 'btn', type: 'button', text: 'Vérifier ma réponse' }, panel);
      ck.onclick = function () { var sel = panel.querySelector('input[name=tr]:checked'); if (!sel) return; st.transfert = { rep: sel.value, just: tj.value.trim(), ts: Date.now() }; save(KEY, st); show(); };
      show();
      var r2 = h('div', { class: 'row' }, panel); next('Voir ma trace ▸', 5, r2);
    }

    function sTrace() {
      h('h2', { text: 'Ma trace' }, panel);
      var pv = st.prevision, ch = F.prevision.choix.filter(function (c) { return c[0] === pv.initiale.choix; })[0];
      h('div', { class: 'card' }, panel,
        '<p><b>Prévision initiale :</b> ' + esc(ch[1]) + ' — ' + esc(pv.initiale.raison) + '</p>' +
        '<p><b>Essais :</b> ' + st.essais.map(function (e) { return e.sucre + ' g : ' + num(e.avant) + ' → ' + num(e.apres) + ' g'; }).join(' · ') + ' <i>(données simulées)</i></p>' +
        '<p><b>Verdict :</b> ' + esc(st.confront.verdict) + ' — ' + esc(st.confront.preuve) + '</p>' +
        '<p><b>Ma conclusion :</b> ' + esc(st.conclusion) + '</p>' +
        '<p><b>Aides utilisées :</b> ' + st.aides + '</p>' +
        '<p style="color:var(--mist);font-size:15px">Critère de réussite : ' + esc(F.critere) + '. Cette trace garde ta propre conclusion ; elle ne contient pas le corrigé. Ton travail est enregistré sur cet appareil seulement.</p>');
      var r = h('div', { class: 'row' }, panel);
      h('button', { class: 'btn primary', type: 'button', text: 'Imprimer ma fiche remplie' }, r).onclick = function () { printDoc(F, st, 'remplie'); };
      h('button', { class: 'btn', type: 'button', text: 'Imprimer la fiche vierge' }, r).onclick = function () { printDoc(F, st, 'vierge'); };
      var pf = h('div', { class: 'card' }, panel); h('h3', { text: 'Espace enseignant' }, pf);
      if (!profMode) {
        h('p', { style: 'color:var(--mist)' }, pf, 'Le corrigé et les attendus sont une ressource distincte de la trace élève.');
        h('button', { class: 'btn', type: 'button', text: 'Passer en mode enseignant' }, pf).onclick = function () { profMode = true; draw(); };
      } else {
        h('div', { class: 'bannerprof', role: 'status' }, pf, 'Mode enseignant activé : les réponses attendues sont affichées. Ne pas projeter devant les élèves avant la fin de l’activité.');
        h('p', {}, pf, '<b>Référence :</b> ' + esc(F.prof.reference));
        h('ul', {}, pf, F.prof.attendus.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join(''));
        h('p', {}, pf, '<b>Erreurs usuelles :</b> ' + F.prof.erreurs.map(esc).join(' · '));
        h('p', {}, pf, '<b>Limites du modèle :</b> ' + esc(F.prof.limites));
        var rr = h('div', { class: 'row' }, pf);
        h('button', { class: 'btn primary', type: 'button', text: 'Imprimer la version professeur' }, rr).onclick = function () { printDoc(F, st, 'prof'); };
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

  window.Activite = { run: run, num: num };
})();
