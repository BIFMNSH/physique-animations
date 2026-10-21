/* NL-C4-D01 — L’objet dans la boîte · 5e · Sources et objets diffusants · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche D01. Modèle géométrique qualitatif : lumière en rayons, diffusion idéale, pas de réflexion spéculaire. */
(function () {
  var h = Activite.h, esc = Activite.esc;
  var OBJ = { source: { n: 'La source (lampe de la boîte)' }, carte: { n: 'La carte blanche' } };
  var LV = { oui: 'visible', non: 'non visible' };
  var LT = { direct: 'Source → œil', diffuse: 'Source → carte → œil', aucun: 'Aucun trajet de lumière vers l’œil' };
  var LTY = { primaire: 'Source primaire', diffusant: 'Objet diffusant' };
  function visible(o, on) { return o === 'source' ? on : on; }          // la source n’est vue que si elle est allumée ; la carte aussi (elle est éclairée par la source)
  function trajet(o, on) { return !on ? 'aucun' : (o === 'source' ? 'direct' : 'diffuse'); }
  function type(o) { return o === 'source' ? 'primaire' : 'diffusant'; }
  function manip(panel, X) {
    var F = window.FICHE_D01, st = X.st(), o = 'carte', on = true;
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'La boîte noire' }, L); var host = h('div', { style: 'text-align:center' }, L);
    h('label', { for: 'obj', text: 'Objet observé :' }, R); var so = h('select', { id: 'obj' }, R, Object.keys(OBJ).map(function (k) { return '<option value="' + k + '">' + OBJ[k].n + '</option>'; }).join(''));
    var tb = h('button', { class: 'btn', type: 'button' }, R), info = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, R);
    h('h4', { text: 'Ce que j’observe' }, R);
    var d = {};
    [['vis', 'Objet vu par l’œil', LV], ['traj', 'Trajet de la lumière', LT], ['type', 'Type d’objet', LTY]].forEach(function (x) {
      h('label', { for: 'o_' + x[0], text: x[1] + ' :' }, R); d[x[0]] = h('select', { id: 'o_' + x[0] }, R, '<option value="">— choisir —</option>' + Object.keys(x[2]).map(function (k) { return '<option value="' + k + '">' + x[2][k] + '</option>'; }).join(''));
    });
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, R), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter dans mon tableau' }, R);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Observations simulées — modèle ' + F.modele); }
    function draw() {
      var v = visible(o, on), cx = o === 'source' ? 140 : 140;
      host.innerHTML = '<svg viewBox="0 0 320 170" role="img" aria-label="Boîte noire vue de dessus. ' + (on ? 'La lampe de la boîte est allumée' : 'La lampe de la boîte est éteinte') + ', ' + (o === 'carte' ? 'on observe la carte blanche' : 'on observe directement la lampe') + '. ' + (v ? 'L’objet est vu par l’œil.' : 'Rien n’est vu.') + '" style="width:100%;max-width:360px"><rect x="20" y="20" width="220" height="120" fill="#0B1220" stroke="var(--glass)" stroke-width="3"/><circle cx="50" cy="45" r="9" fill="' + (on ? '#FFD84A' : '#444') + '"/><rect x="170" y="80" width="12" height="50" fill="' + (on ? '#F2F2F2' : '#8A8A8A') + '"/><circle cx="290" cy="80" r="12" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="290" y="110" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">œil</text>'
        + (on && o === 'source' ? '<line x1="59" y1="48" x2="278" y2="80" stroke="#F97316" stroke-width="2"/>' : '') + (on && o === 'carte' ? '<line x1="59" y1="50" x2="170" y2="100" stroke="#F97316" stroke-width="2"/><line x1="182" y1="100" x2="278" y2="82" stroke="#F97316" stroke-width="2"/>' : '') + '</svg>';
      tb.textContent = on ? 'Éteindre la lampe de la boîte' : 'Allumer la lampe de la boîte';
      info.textContent = OBJ[o].n + ' : ' + (v ? 'vu' : 'non vu') + ' (lampe ' + (on ? 'allumée' : 'éteinte') + ')';
    }
    so.onchange = function () { o = so.value; draw(); }; tb.onclick = function () { on = !on; draw(); };
    bn.onclick = function () { var a = d.vis.value, b = d.traj.value, c = d.type.value; if (!a || !b || !c) { msg.hidden = false; msg.textContent = 'Complète les trois observations avant d’enregistrer.'; return; } msg.hidden = true; X.addEssai({ o: o, on: on, nom: OBJ[o].n, a: a, b: b, c: c }); table(); };
    table(); draw();
  }
  window.FICHE_D01 = {
    id: 'NL-C4-D01', version: '1.0', modele: 'vision-diffusion-qualitatif-1.0',
    titre: 'L’objet dans la boîte', niveau: '5e', chapitre: 'Sources et objets diffusants',
    objectif: 'Distinguer source primaire et objet diffusant, et orienter les trajets de la lumière vers l’œil.',
    objectifEleve: 'Expliquer pourquoi on voit un objet et tracer le trajet de la lumière jusqu’à l’œil.',
    materiel: 'Une boîte noire, une lampe, une carte blanche, un œilleton.',
    situation: 'Une carte blanche est placée dans une boîte noire. Pourquoi ne la voit-on pas sans source de lumière ?',
    prevision: { consigne: 'La lampe de la boîte est éteinte : verras-tu la carte blanche ? Et si la lampe est allumée, comment la lumière arrive-t-elle à ton œil ?', choix: [['oui', 'On la voit quand même, car elle est blanche'], ['non', 'On ne la voit pas : il faut une source qui l’éclaire'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Observer la carte avec la lampe éteinte puis allumée.', 'Observer directement la lampe.', 'Orienter les trajets de lumière.', 'Noter dans le tableau.'],
    variable: 'État de la lampe et objet observé', maintenu: 'Position de l’œil',
    confrontation: 'Compare ta prévision avec les observations. Que se passe-t-il quand la lampe est éteinte ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'La Lune est visible dans le ciel nocturne. Comment peut-on l’expliquer ?', options: [['diff', 'Elle diffuse la lumière que le Soleil lui envoie'], ['src', 'Elle est une source primaire de lumière'], ['aucune', 'On la voit sans aucune lumière']], rep: 'diff',
      expl: 'La Lune n’est pas une source primaire : elle diffuse, en grande partie, la lumière du Soleil, comme la carte diffuse la lumière de la lampe.' },
    critere: 'Orienter les trajets de lumière jusqu’à l’œil et distinguer source primaire et objet diffusant.',
    aides: ['Que reçoit ton œil quand la lampe est éteinte ?', 'Trace le trajet de la lumière en partant de la lampe : que rencontre-t-elle avant ton œil ?', 'La lampe produit sa lumière ; la carte, elle, ne fait que la renvoyer dans toutes les directions.'],
    synthese: 'On voit un objet quand de la lumière arrive à l’œil. Une source primaire produit sa lumière ; un objet diffusant renvoie dans toutes les directions la lumière qu’il reçoit. Sans source, la carte n’est pas visible, même si elle est blanche.',
    colonnes: ['Objet', 'Lampe', 'Visibilité', 'Trajet', 'Type'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [e.nom, e.on ? 'allumée' : 'éteinte', LV[e.a], LT[e.b], LTY[e.c]]; }); },
    resume: function (e) { return e.nom + ' (lampe ' + (e.on ? 'allumée' : 'éteinte') + ') : ' + LV[e.a] + ' ; ' + LT[e.b] + ' ; ' + LTY[e.c]; },
    diagnostic: function (st) {
      var o = [], vus = {};
      st.essais.forEach(function (e) {
        vus[e.on ? 'on' : 'off'] = 1; var bad = [];
        if (e.a !== (visible(e.o, e.on) ? 'oui' : 'non')) bad.push('la visibilité'); if (e.b !== trajet(e.o, e.on)) bad.push('le trajet de la lumière'); if (e.c !== type(e.o)) bad.push('le type d’objet');
        o.push('(' + e.nom + ', lampe ' + (e.on ? 'allumée' : 'éteinte') + ') ' + (bad.length ? 'Revois ' + bad.join(', ') + '.' : 'Tes observations sont cohérentes avec le modèle.'));
      });
      if (st.essais.length && Object.keys(vus).length < 2) o.push('Tu n’as pas comparé lampe allumée et éteinte : c’est la clé de l’expérience.');
      return o;
    },
    extraPrint: { titre: 'Trajets de la lumière', consigne: 'Dessine la boîte, la lampe, la carte et l’œil, puis trace le trajet de la lumière.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 320 120" role="img" aria-label="Une boîte noire contenant une lampe et une carte blanche, avec un œil à droite." style="width:100%;max-width:360px"><rect x="20" y="10" width="220" height="100" fill="#0B1220" stroke="var(--glass)" stroke-width="3"/><circle cx="50" cy="35" r="9" fill="#FFD84A"/><rect x="170" y="60" width="12" height="40" fill="#F2F2F2"/><circle cx="290" cy="60" r="12" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>'; },
    manip: manip,
    modele_: { visible: visible, trajet: trajet, type: type },
    pedagogie: {
      "theme": "D",
      "attendu": 0,
      "connaissance": "Distinguer une source primaire (objet lumineux) d’un objet diffusant ; propagation rectiligne de la lumière.",
      "competences": [["demarche","hypothese"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Distinguer source primaire et objet diffusant.",
          "eleve": "Je sais distinguer un objet qui émet de la lumière d’un objet qui en renvoie.",
          "savoirFaire": [
            "Masquer successivement les trajets"
          ],
          "indicateur": "Le tableau distingue source et objet diffusant.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Orienter les trajets vers l’œil.",
          "eleve": "Je sais dessiner le trajet de la lumière jusqu’à l’œil.",
          "savoirFaire": [
            "Orienter les rayons de la source vers l’œil"
          ],
          "indicateur": "Les trajets sont orientés vers l’œil.",
          "preuve": "Manipulation"
        },
        {
          "id": "O3",
          "objectif": "Réinvestir pour un objet naturel.",
          "eleve": "Je sais appliquer l’idée à la Lune.",
          "savoirFaire": [
            "Identifier source et objet diffusant"
          ],
          "indicateur": "Le transfert nomme source et objet diffusant.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Sans lumière issue d’une source, ni la carte ni rien dans la boîte n’est visible. Source allumée : la source est vue par trajet direct (source → œil) ; la carte est vue par diffusion (source → carte → œil). La carte est un objet diffusant, la lampe une source primaire. Transfert : la Lune diffuse la lumière solaire.',
      attendus: ['Pas de lumière, pas de vision de la carte.', 'Trajets orientés vers l’œil.', 'Distinction source primaire / objet diffusant.', 'Application à la Lune.'],
      erreurs: ['Penser que l’œil « envoie » quelque chose vers l’objet.', 'Dire que la carte blanche « brille » ou est une source.', 'Dessiner les flèches de l’œil vers l’objet.'],
      limites: 'Modèle géométrique qualitatif : diffusion idéale, pas de réflexion spéculaire ni d’absorption chiffrée. Pas de situation « fluorescence ». Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : schéma à compléter avec flèches fournies. Approfondissement : miroir et surface noire.'
    }
  };
})();
