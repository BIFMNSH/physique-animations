/* NL-C4-B05 — Les voisins invisibles · 5e · Interactions · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche B05. Diagramme objet-interactions qualitatif ; objet étudié : une masse métallique suspendue à un fil, sous un aimant. */
(function () {
  var h = Activite.h, esc = Activite.esc;
  var CAND = [
    { k: 'fil', n: 'Le fil', t: 'contact' },
    { k: 'terre', n: 'La Terre', t: 'distance' },
    { k: 'aimant', n: 'L’aimant', t: 'distance' },
    { k: 'air', n: 'L’air', t: 'negligee' }
  ];
  var TYPE = { contact: 'action de contact', distance: 'action à distance', negligee: 'action négligée dans ce modèle', aucune: 'aucune action' };
  function manip(panel, X) {
    var F = window.FICHE_B05, st = X.st();
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'L’objet étudié' }, c);
    h('div', { style: 'text-align:center' }, c, '<svg viewBox="0 0 320 200" role="img" aria-label="Une masse métallique suspendue par un fil, sous un aimant fixé à un support. La Terre est en bas, et l’air entoure la masse." style="width:100%;max-width:360px"><rect x="90" y="10" width="140" height="14" fill="#5B6B88"/><rect x="140" y="24" width="40" height="30" fill="#D33" stroke="#0B1220" stroke-width="2"/><text x="160" y="44" text-anchor="middle" font-size="12" fill="#fff" font-family="sans-serif">aimant</text><line x1="160" y1="54" x2="160" y2="88" stroke="var(--ink)" stroke-width="2" stroke-dasharray="2 5"/><rect x="140" y="95" width="40" height="30" rx="4" fill="#B0B8C4" stroke="#0B1220" stroke-width="2"/><text x="160" y="115" text-anchor="middle" font-size="12" fill="#111" font-family="sans-serif">masse</text><line x1="160" y1="125" x2="160" y2="160" stroke="var(--ink)" stroke-width="2"/><rect x="40" y="172" width="240" height="14" fill="#7A5B3A"/><text x="160" y="196" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">sol (la Terre)</text></svg>');
    h('p', {}, c, 'Une masse métallique est suspendue à un fil, juste sous un aimant. Pour chaque objet de la liste, indique comment il agit sur la masse, puis vérifie en modifiant le montage.');
    var tb = h('table', { class: 't' }, h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c), '<thead><tr><th scope="col">Objet</th><th scope="col">Comment agit-il sur la masse ?</th></tr></thead>');
    var body = h('tbody', {}, tb); CAND.forEach(function (o) { h('tr', {}, body, '<th scope="row" style="text-align:left;font-weight:700">' + esc(o.n) + '</th><td><select id="s_' + o.k + '" aria-label="' + esc(o.n) + ' : comment agit-il sur la masse"><option value="">— choisir —</option><option value="contact">par contact</option><option value="distance">à distance</option><option value="negligee">action négligeable ou négligée dans le modèle</option><option value="aucune">pas d’action</option></select></td>'); });
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, c), bn = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer mon diagramme' }, c);
    bn.onclick = function () { var v = {}, ok = true; CAND.forEach(function (o) { v[o.k] = panel.querySelector('#s_' + o.k).value; if (!v[o.k]) ok = false; });
      if (!ok) { msg.hidden = false; msg.textContent = 'Réponds pour chaque objet avant d’enregistrer.'; return; }
      msg.hidden = true; X.addEssai({ kind: 'diagramme', v: v }); table(); };
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'Je modifie le montage' }, c2);
    var row = h('div', { class: 'row' }, c2), b1 = h('button', { class: 'btn', type: 'button', text: 'Retirer le fil' }, row), b2 = h('button', { class: 'btn', type: 'button', text: 'Éloigner l’aimant' }, row), b3 = h('button', { class: 'btn', type: 'button', text: 'Remettre le montage' }, row);
    var out = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, c2, 'Montage de départ : la masse est immobile.');
    var NOTE = { fil: 'Fil retiré : la masse tombe. Le fil n’agit plus, la Terre agit toujours (et l’aimant aussi, si elle reste proche).', aimant: 'Aimant éloigné : la masse n’est plus attirée par lui, elle reste suspendue au fil. La Terre et le fil continuent d’agir.' };
    b1.onclick = function () { out.textContent = NOTE.fil; X.addEssai({ kind: 'scenario', s: 'fil' }); table(); };
    b2.onclick = function () { out.textContent = NOTE.aimant; X.addEssai({ kind: 'scenario', s: 'aimant' }); table(); };
    b3.onclick = function () { out.textContent = 'Montage de départ : la masse est immobile.'; };
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Réponses de l’élève et observations simulées — modèle ' + F.modele); }
    table();
  }
  window.FICHE_B05 = {
    id: 'NL-C4-B05', version: '1.0', modele: 'interactions-qualitatif-1.0',
    titre: 'Les voisins invisibles', niveau: '5e', chapitre: 'Interactions',
    objectif: 'Identifier des actions de contact et des actions à distance.',
    objectifEleve: 'Nommer les objets qui agissent sur une masse suspendue et dire si chacun agit par contact ou à distance.',
    materiel: 'Une masse métallique, un fil, un aimant, un support.',
    situation: 'Un aimant attire un objet métallique suspendu à un fil. Quels objets agissent sur cet objet ?',
    prevision: { consigne: 'Écris la liste des objets qui agissent sur la masse et indique ceux qui la touchent.', choix: [['visibles', 'Seuls les objets que je vois toucher la masse agissent sur elle'], ['aussi', 'D’autres objets peuvent aussi agir sans la toucher'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Isoler l’objet étudié : la masse.', 'Lister les objets qui peuvent agir sur elle.', 'Qualifier chaque action : contact ou distance.', 'Retirer le fil, puis éloigner l’aimant, et observer.'],
    variable: 'Présence du fil et distance de l’aimant', maintenu: 'La même masse métallique',
    confrontation: 'Une action a-t-elle besoin d’un contact ? Compare tes observations quand le fil est retiré et quand l’aimant est éloigné.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un livre est posé sur une table. Quelles interactions qualifier avec le livre ?', options: [['deux', 'La table agit par contact et la Terre agit à distance'], ['table', 'Seule la table agit, par contact'], ['terre', 'Seule la Terre agit, à distance']], rep: 'deux',
      expl: 'La table agit par contact et la Terre agit à distance : un objet peut subir plusieurs actions de natures différentes, et chaque interaction relie deux objets.' },
    critere: 'Nommer les deux objets et qualifier chaque interaction.',
    aides: ['Une interaction relie toujours deux objets : cherche à chaque fois l’objet qui agit et l’objet qui subit l’action.', 'Pose-toi la question : si je retire cet objet, l’action disparaît-elle ?', 'Un objet peut agir sur la masse sans la toucher : pense à la façon dont elle reste attirée quand rien ne la retient.'],
    synthese: 'Le fil agit sur la masse par contact ; la Terre et l’aimant agissent à distance. L’air peut être négligé dans ce modèle, ce que la fiche doit préciser. Une action n’exige donc pas toujours un contact. Retirer le fil supprime l’action du fil mais pas celle de la Terre. Toute interaction relie deux objets.',
    colonnes: ['Objet ou observation', 'Ma réponse', 'Modèle'], lignesVides: 6,
    lignes: function (st) {
      var r = [];
      st.essais.forEach(function (e) {
        if (e.kind === 'diagramme') CAND.forEach(function (o) { r.push([o.n, TYPE[e.v[o.k]], TYPE[o.t]]); });
        else r.push([e.s === 'fil' ? 'Fil retiré' : 'Aimant éloigné', '—', e.s === 'fil' ? 'la masse tombe' : 'la masse n’est plus attirée']);
      });
      return r;
    },
    resume: function (e) { return e.kind === 'diagramme' ? 'Diagramme : ' + CAND.map(function (o) { return o.n.toLowerCase() + ' → ' + TYPE[e.v[o.k]]; }).join(' ; ') : (e.s === 'fil' ? 'Fil retiré : la masse tombe' : 'Aimant éloigné : la masse n’est plus attirée'); },
    diagnostic: function (st) {
      var o = [];
      st.essais.filter(function (e) { return e.kind === 'diagramme'; }).forEach(function (e) {
        var bad = CAND.filter(function (x) { return e.v[x.k] !== x.t; });
        if (!bad.length) o.push('Ton diagramme est cohérent avec le modèle pour les quatre objets.');
        else bad.forEach(function (x) {
          if (x.k === 'terre' && e.v.terre === 'aucune') o.push('La Terre agit sur la masse : essaie de dire ce qui la fait tomber quand le fil est retiré.');
          else if (x.k === 'terre') o.push('Revois la Terre : agit-elle en touchant la masse ?');
          else if (x.k === 'aimant' && e.v.aimant === 'contact') o.push('L’aimant ne touche pas la masse : peut-il agir sans la toucher ?');
          else o.push('Revois « ' + x.n.toLowerCase() + ' » : relis ce que le montage permet d’observer.');
        });
      });
      return o;
    },
    extraPrint: { titre: 'Diagramme objet-interactions', consigne: 'Dessine la masse au centre, entoure les objets qui agissent sur elle et relie-les par un trait plein (contact) ou pointillé (distance).', hauteur: 180 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 220 120" role="img" aria-label="Une masse suspendue sous un aimant." style="width:100%;max-width:240px"><rect x="70" y="5" width="80" height="14" fill="#5B6B88"/><rect x="95" y="19" width="30" height="20" fill="#D33"/><rect x="95" y="60" width="30" height="24" rx="3" fill="#B0B8C4"/><line x1="110" y1="84" x2="110" y2="110" stroke="var(--ink)" stroke-width="2"/></svg>'; },
    manip: manip,
    modele_: { CAND: CAND, TYPE: TYPE },
    pedagogie: {
      "theme": "B",
      "attendu": 1,
      "connaissance": "Identifier les actions mises en jeu (de contact ou à distance) ; action de contact et action à distance. Modélisation par des forces progressive : descriptive dès le début du cycle, formalisée en 4e.",
      "competences": [
        [
          "demarche",
          "modele"
        ],
        [
          "demarche",
          "interpreter"
        ],
        [
          "langages",
          "passer"
        ]
      ],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Identifier les objets qui agissent sur un objet étudié.",
          "eleve": "Je sais lister les objets qui agissent sur la masse suspendue.",
          "savoirFaire": [
            "Isoler l’objet étudié",
            "Nommer l’objet qui agit pour chaque action"
          ],
          "indicateur": "Le diagramme enregistré nomme les objets pertinents.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Qualifier une action : contact ou distance.",
          "eleve": "Je sais dire si une action se fait par contact ou à distance.",
          "savoirFaire": [
            "Distinguer contact et distance",
            "Justifier avec une observation du montage"
          ],
          "indicateur": "Le diagramme est cohérent avec le modèle.",
          "preuve": "Tableau et diagnostic"
        },
        {
          "id": "O3",
          "objectif": "Réinvestir à une situation voisine.",
          "eleve": "Je sais décrire les actions sur un objet posé.",
          "savoirFaire": [
            "Appliquer la méthode à un autre objet"
          ],
          "indicateur": "La réponse au transfert est juste et justifiée.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Fil : action de contact. Terre : action à distance. Aimant : action à distance. Air : négligé dans le modèle si on le précise. Retirer le fil supprime l’action du fil mais pas celle de la Terre (la masse tombe). Éloigner l’aimant supprime son attraction. Transfert : livre sur une table → table par contact, Terre à distance.',
      attendus: ['Quatre objets qualifiés avec la bonne nature d’action.', 'Chaque interaction relie deux objets nommés.', 'Retirer le fil ne supprime pas la Terre.', 'Précision que l’air est négligé dans le modèle.'],
      erreurs: ['Penser qu’une action exige un contact.', 'Oublier la Terre.', 'Attribuer une action de contact à l’aimant.'],
      limites: 'Diagramme qualitatif sans champ magnétique ni valeurs de force. Les cas « fil retiré » et « aimant éloigné » sont des scénarios décrits, non animés en physique. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : cartes illustrées des objets à classer. Approfondissement : ajouter le support de l’aimant et discuter les interactions réciproques.'
    }
  };
})();
