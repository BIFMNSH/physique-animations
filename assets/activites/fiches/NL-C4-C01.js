/* NL-C4-C01 — La lampe à plusieurs histoires · 5e · Sources et formes d’énergie · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche C01. Modèle qualitatif de chaîne énergétique ; aucune valeur chiffrée, aucun rendement. */
(function () {
  var h = Activite.h, esc = Activite.esc;
  var SRC = { pile: { n: 'Lampe sur pile', forme: 'chimique', conv: 'La pile' }, solaire: { n: 'Lampe sur panneau solaire', forme: 'rayonnement', conv: 'Le panneau solaire' } };
  var LFS = { chimique: 'Énergie chimique', rayonnement: 'Rayonnement', electrique: 'Énergie électrique', thermique: 'Énergie thermique' };
  var LSORT = { lum: 'Rayonnement lumineux seul', lumth: 'Rayonnement lumineux et transfert thermique', th: 'Transfert thermique seul' };
  var LBIL = { autant: 'Autant d’énergie en sortie qu’en entrée (répartie)', plus: 'Plus d’énergie en sortie qu’en entrée', moins: 'Moins d’énergie en sortie : une partie disparaît' };
  var SORTIE = 'lumth', BILAN = 'autant';
  function formeSource(s) { return SRC[s].forme; }
  function manip(panel, X) {
    var F = window.FICHE_C01, st = X.st(), s = 'pile';
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'La chaîne' }, L); var host = h('div', { style: 'text-align:center' }, L);
    h('label', { for: 'src', text: 'Montage :' }, R); var ss = h('select', { id: 'src' }, R, Object.keys(SRC).map(function (k) { return '<option value="' + k + '">' + SRC[k].n + '</option>'; }).join(''));
    h('h4', { text: 'Ce que j’identifie' }, R);
    var d = {};
    [['source', 'Forme d’énergie à la source', LFS], ['sortie', 'Ce que fournit la lampe à l’environnement', LSORT], ['bilan', 'Bilan entre entrée et sortie', LBIL]].forEach(function (x) {
      h('label', { for: 'o_' + x[0], text: x[1] + ' :' }, R); d[x[0]] = h('select', { id: 'o_' + x[0] }, R, '<option value="">— choisir —</option>' + Object.keys(x[2]).map(function (k) { return '<option value="' + k + '">' + x[2][k] + '</option>'; }).join(''));
    });
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, R), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter dans mon tableau' }, R);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Chaîne simulée — modèle ' + F.modele); }
    function draw() {
      var src = s === 'pile' ? 'Pile' : 'Panneau solaire';
      function box(x, t) { return '<rect x="' + x + '" y="40" width="100" height="50" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="' + (x + 50) + '" y="70" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="sans-serif">' + t + '</text>'; }
      function arr(x) { return '<line x1="' + x + '" x2="' + (x + 30) + '" y1="65" y2="65" stroke="var(--ink)" stroke-width="2" marker-end="url(#ar)"/>'; }
      host.innerHTML = '<svg viewBox="0 0 420 130" role="img" aria-label="Chaîne : ' + src + ', puis circuit électrique, puis lampe qui rayonne de la lumière et chauffe l’environnement." style="width:100%;max-width:460px"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="var(--ink)"/></marker></defs>' + box(10, src) + arr(112) + box(145, 'Circuit') + arr(247) + box(280, 'Lampe') + '<text x="330" y="25" text-anchor="middle" font-size="12" fill="#F97316" font-family="sans-serif">lumière + chaleur</text></svg>';
    }
    ss.onchange = function () { s = ss.value; draw(); };
    bn.onclick = function () { var a = d.source.value, b = d.sortie.value, c = d.bilan.value; if (!a || !b || !c) { msg.hidden = false; msg.textContent = 'Complète les trois identifications avant d’enregistrer.'; return; } msg.hidden = true; X.addEssai({ s: s, nom: SRC[s].n, a: a, b: b, c: c }); table(); };
    table(); draw();
  }
  window.FICHE_C01 = {
    id: 'NL-C4-C01', version: '1.0', modele: 'chaine-energie-qualitatif-1.0',
    titre: 'La lampe à plusieurs histoires', niveau: '5e', chapitre: 'Sources et formes d’énergie',
    objectif: 'Identifier sources, convertisseurs, transferts et formes d’énergie dans une chaîne.',
    objectifEleve: 'Décrire une chaîne d’énergie avec ses sources, ses convertisseurs et ses transferts.',
    materiel: 'Une lampe, une pile, un panneau solaire, des cartes (sources, convertisseurs, transferts, formes).',
    situation: 'Une même lampe s’allume tantôt avec une pile, tantôt avec un panneau solaire. La chaîne énergétique est-elle la même dans les deux cas ?',
    prevision: { consigne: 'Avant de manipuler : la lampe fonctionne-t-elle avec la même chaîne d’énergie dans les deux montages ?', choix: [['meme', 'Oui, exactement la même chaîne'], ['debut', 'Non : seul le début de la chaîne change'], ['tout', 'Non : toute la chaîne est différente'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Choisir un montage.', 'Placer les cartes sources, convertisseurs, transferts et formes dans l’ordre.', 'Identifier la forme d’énergie à la source et ce que fournit la lampe.', 'Comparer entrée et sortie, puis noter dans le tableau.'],
    variable: 'Source d’énergie (pile ou panneau solaire)', maintenu: 'La lampe',
    confrontation: 'Compare ta chaîne avec ta prévision. Où les deux montages se ressemblent-ils, où diffèrent-ils ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un moteur est alimenté par une pile. Quelle chaîne décrit le mieux la situation ?', options: [['bonne', 'Pile (chimique) → circuit électrique → moteur (mouvement + transfert thermique à l’environnement)'], ['creee', 'Le moteur crée de l’énergie de mouvement'], ['sans', 'Pile → moteur, sans aucun transfert vers l’environnement']], rep: 'bonne',
      expl: 'La pile fournit de l’énergie chimique convertie en énergie électrique ; le moteur la convertit en mouvement, avec un transfert thermique vers l’environnement. Aucun convertisseur ne crée d’énergie.' },
    critere: 'Distinguer sources, convertisseurs, transferts et formes, et inclure le transfert vers l’environnement.',
    aides: ['Place d’abord ce qui fournit l’énergie, puis ce qui la convertit, puis ce qui la reçoit.', 'Regarde la lampe : donne-t-elle seulement de la lumière ? Touche-la prudemment après usage.', 'Compare l’énergie qui entre et celle qui sort : peut-il y en avoir plus ou moins ?'],
    synthese: 'Une chaîne d’énergie relie une source, des convertisseurs et des transferts. Seul le début change entre pile (énergie chimique) et panneau solaire (rayonnement) ; le circuit est électrique et la lampe fournit du rayonnement lumineux et un transfert thermique. Aucun convertisseur ne crée d’énergie : elle se conserve, répartie entre plusieurs formes.',
    colonnes: ['Montage', 'Source', 'Sortie de la lampe', 'Bilan'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [e.nom, LFS[e.a], LSORT[e.b], LBIL[e.c]]; }); },
    resume: function (e) { return e.nom + ' : ' + LFS[e.a] + ' ; ' + LSORT[e.b] + ' ; ' + LBIL[e.c]; },
    diagnostic: function (st) {
      var o = [], vus = {};
      st.essais.forEach(function (e) {
        vus[e.s] = 1; var bad = [];
        if (e.a !== formeSource(e.s)) bad.push('la forme d’énergie à la source'); if (e.b !== SORTIE) bad.push('ce que fournit la lampe'); if (e.c !== BILAN) bad.push('le bilan entrée-sortie');
        o.push('(' + e.nom + ') ' + (bad.length ? 'Revois ' + bad.join(', ') + '.' : 'Tes identifications sont cohérentes avec le modèle.'));
      });
      if (st.essais.length && Object.keys(vus).length < 2) o.push('Tu n’as étudié qu’un seul montage : la comparaison demande les deux.');
      return o;
    },
    extraPrint: { titre: 'Mes chaînes d’énergie', consigne: 'Dessine la chaîne de chaque montage avec flèches et formes d’énergie.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 420 90" role="img" aria-label="Une pile, un circuit et une lampe." style="width:100%;max-width:460px"><rect x="10" y="25" width="100" height="40" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="160" y="25" width="100" height="40" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="350" cy="45" r="22" fill="#FFD84A" stroke="var(--ink)" stroke-width="2"/></svg>'; },
    manip: manip,
    modele_: { SRC: SRC, formeSource: formeSource, SORTIE: SORTIE, BILAN: BILAN },
    pedagogie: {
      "theme": "C",
      "attendu": 0,
      "connaissance": "Identifier les différentes formes d’énergie ; établir un bilan énergétique pour un système simple (sources, transferts, conversion d’une forme d’énergie en une autre).",
      "competences": [
        [
          "demarche",
          "modele"
        ],
        [
          "langages",
          "passer"
        ],
        [
          "ethique",
          "reinvestir"
        ]
      ],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Distinguer source, forme, transfert et conversion.",
          "eleve": "Je sais classer une carte comme source, forme, transfert ou convertisseur.",
          "savoirFaire": [
            "Associer chaque carte à sa catégorie"
          ],
          "indicateur": "Le classement des cartes est cohérent.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Construire une chaîne d’énergie.",
          "eleve": "Je sais construire une chaîne d’énergie pour un objet.",
          "savoirFaire": [
            "Ordonner source, convertisseur et forme"
          ],
          "indicateur": "La chaîne est complète et ordonnée.",
          "preuve": "Manipulation"
        },
        {
          "id": "O3",
          "objectif": "Inclure le transfert vers l’environnement.",
          "eleve": "Je sais montrer ce qui part vers l’environnement.",
          "savoirFaire": [
            "Ajouter le transfert thermique"
          ],
          "indicateur": "Le transfert inclut la sortie vers l’environnement.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Pile : énergie chimique → électrique ; panneau solaire : rayonnement → électrique. Lampe : électrique → rayonnement lumineux + transfert thermique vers l’environnement. Aucun convertisseur ne crée d’énergie : conservation, répartie entre formes. Transfert : pile → moteur → mouvement + transfert thermique.',
      attendus: ['Seul le début de la chaîne diffère.', 'Le transfert thermique est cité.', 'Bilan : autant d’énergie en sortie qu’en entrée.', 'Vocabulaire source / convertisseur / transfert / forme employé correctement.'],
      erreurs: ['Dire que la pile « contient de l’électricité ».', 'Oublier le transfert thermique de la lampe.', 'Penser que la lampe « produit » de l’énergie.'],
      limites: 'Modèle qualitatif de chaîne d’énergie, sans valeurs chiffrées ni rendement ; la nuance entre « énergie perdue » et « énergie dégradée » n’est pas traitée. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : cartes déjà ordonnées à compléter. Approfondissement : ajouter une chaîne avec une dynamo ou un chauffe-eau solaire.'
    }
  };
})();
