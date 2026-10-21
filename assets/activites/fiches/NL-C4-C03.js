/* NL-C4-C03 — Deux commandes pour deux zones · 5e · Série et dérivation · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche C03. Modèle qualitatif : état d'une lampe = existence d'un chemin conducteur fermé. */
(function () {
  var h = Activite.h, esc = Activite.esc;
  function etat(montage, s1, s2, o) { // s = true si fermé ; o : { g: interrupteur général (undefined = absent), gril1: lampe 1 grillée }
    o = o || {}; var g = o.g !== false, gr = !!o.gril1;
    if (montage === 'serie') { var on = g && s1 && s2 && !gr; return { l1: on, l2: on }; }
    return { l1: g && s1 && !gr, l2: g && s2 };
  }
  function nbEtats(st) { var v = {}; st.essais.forEach(function (e) { if (!e.gril && e.g == null) v[e.montage + (e.s1 ? 1 : 0) + (e.s2 ? 1 : 0)] = 1; }); return Object.keys(v).length; }
  function manip(panel, X) {
    var F = window.FICHE_C03, st = X.st(), montage = 'serie', s1 = true, s2 = true, g = null, gril = false;
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'Maquette' }, c);
    h('label', { for: 'mont', text: 'Montage testé :' }, c);
    var sel = h('select', { id: 'mont' }, c, '<option value="serie">Montage A — lampes l’une après l’autre dans la même boucle</option><option value="deriv">Montage B — une branche par lampe, chacune avec son interrupteur</option>');
    var host = h('div', { style: 'text-align:center' }, c);
    var row = h('div', { class: 'row' }, c), b1 = h('button', { class: 'btn', type: 'button' }, row), b2 = h('button', { class: 'btn', type: 'button' }, row), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter cet état dans mon tableau' }, row);
    var opt = h('div', { class: 'row' }, c), bg = h('button', { class: 'btn', type: 'button', text: 'Ajouter un interrupteur général' }, opt), bgt = h('button', { class: 'btn', type: 'button', hidden: '' }, opt), bd = h('button', { class: 'btn', type: 'button' }, opt);
    var gnote = h('p', { style: 'color:var(--mist);font-size:15px' }, c);
    var out = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, c);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier essai noté : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau des états' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Relevés simulés — modèle ' + F.modele); var ok = nbEtats(st) >= 8; bg.disabled = !ok; gnote.textContent = ok ? 'Tu as testé les quatre états des deux montages : tu peux maintenant essayer un interrupteur général ou une lampe grillée.' : 'Les options « interrupteur général » et « lampe grillée » se débloquent quand les quatre états des deux montages sont notés (' + nbEtats(st) + ' sur 8).'; bd.disabled = !ok; }
    function lamp(x, y, on, nom, gr) { return '<circle cx="' + x + '" cy="' + y + '" r="17" fill="' + (on ? '#F6B301' : 'none') + '" stroke="var(--ink)" stroke-width="3"/>' + (gr ? '<line x1="' + (x - 12) + '" y1="' + (y - 12) + '" x2="' + (x + 12) + '" y2="' + (y + 12) + '" stroke="#E5484D" stroke-width="3"/>' : '') + (on ? '<g stroke="#F6B301" stroke-width="3"><line x1="' + (x - 27) + '" x2="' + (x - 21) + '" y1="' + y + '" y2="' + y + '"/><line x1="' + (x + 21) + '" x2="' + (x + 27) + '" y1="' + y + '" y2="' + y + '"/></g>' : '') + '<text x="' + x + '" y="' + (y + 38) + '" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="sans-serif">' + nom + (on ? ' allumée' : gr ? ' grillée' : ' éteinte') + '</text>'; }
    function sw(x, y, closed, nom) { return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="var(--ink)"/><circle cx="' + (x + 36) + '" cy="' + y + '" r="3" fill="var(--ink)"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + 36) + '" y2="' + (closed ? y : y - 18) + '" stroke="var(--ink)" stroke-width="3"/><text x="' + (x + 18) + '" y="' + (y - 24) + '" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="sans-serif">' + nom + (closed ? ' fermé' : ' ouvert') + '</text>'; }
    function gsw(closed) { return '<circle cx="60" cy="75" r="3" fill="var(--ink)"/><circle cx="60" cy="45" r="3" fill="var(--ink)"/><line x1="60" y1="75" x2="' + (closed ? 60 : 78) + '" y2="' + (closed ? 45 : 52) + '" stroke="var(--ink)" stroke-width="3"/><text x="90" y="64" font-size="13" fill="var(--ink)" font-family="sans-serif">G ' + (closed ? 'fermé' : 'ouvert') + '</text>'; }
    function draw() {
      var e = etat(montage, s1, s2, { g: g === null ? undefined : g, gril1: gril }), s, wire = g === null ? 'M60 90 V30' : 'M60 90 V75 M60 45 V30';
      if (montage === 'serie') s = '<path d="' + wire + ' H360 V150 H60 V110" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="50" y="90" width="20" height="20" fill="var(--bg)" stroke="var(--ink)" stroke-width="2"/><text x="82" y="104" font-size="12" fill="var(--mist)" font-family="sans-serif">pile</text>' + lamp(150, 30, e.l1, 'Lampe 1', gril) + sw(220, 30, s1, 'S1') + lamp(310, 30, e.l2, 'Lampe 2') + sw(250, 150, s2, 'S2');
      else s = '<path d="' + wire + ' H360 M60 110 V150 H360 M360 30 V150" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="50" y="90" width="20" height="20" fill="var(--bg)" stroke="var(--ink)" stroke-width="2"/><text x="82" y="104" font-size="12" fill="var(--mist)" font-family="sans-serif">pile</text>' + sw(100, 30, s1, 'S1') + lamp(250, 30, e.l1, 'Lampe 1', gril) + sw(100, 150, s2, 'S2') + lamp(250, 150, e.l2, 'Lampe 2');
      if (g !== null) s += gsw(g);
      host.innerHTML = '<svg viewBox="0 0 420 200" role="img" aria-label="' + (montage === 'serie' ? 'Schéma : une pile, deux lampes et deux interrupteurs dans une seule boucle.' : 'Schéma : une pile alimentant deux branches parallèles, chacune avec un interrupteur et une lampe.') + (g !== null ? ' Un interrupteur général est placé sur le fil commun, ' + (g ? 'fermé' : 'ouvert') + '.' : '') + ' Interrupteur S1 ' + (s1 ? 'fermé' : 'ouvert') + ', S2 ' + (s2 ? 'fermé' : 'ouvert') + '.' + (gril ? ' La lampe 1 est grillée.' : '') + ' Lampe 1 ' + (e.l1 ? 'allumée' : 'éteinte') + ', lampe 2 ' + (e.l2 ? 'allumée' : 'éteinte') + '." style="width:100%;max-width:480px">' + s + '</svg>';
      b1.textContent = 'S1 : ' + (s1 ? 'ouvrir' : 'fermer'); b2.textContent = 'S2 : ' + (s2 ? 'ouvrir' : 'fermer');
      bg.textContent = g === null ? 'Ajouter un interrupteur général' : 'Retirer l’interrupteur général'; bgt.hidden = g === null; bgt.textContent = 'G : ' + (g ? 'ouvrir' : 'fermer'); bd.textContent = gril ? 'Remplacer la lampe 1 grillée' : 'Griller la lampe 1';
      out.textContent = 'Lampe 1 ' + (e.l1 ? 'allumée' : 'éteinte') + ' · Lampe 2 ' + (e.l2 ? 'allumée' : 'éteinte');
    }
    sel.onchange = function () { montage = sel.value; s1 = s2 = true; draw(); };
    b1.onclick = function () { s1 = !s1; draw(); }; b2.onclick = function () { s2 = !s2; draw(); };
    bg.onclick = function () { g = g === null ? true : null; draw(); }; bgt.onclick = function () { g = !g; draw(); }; bd.onclick = function () { gril = !gril; draw(); };
    bn.onclick = function () { var e = etat(montage, s1, s2, { g: g === null ? undefined : g, gril1: gril }); X.addEssai({ montage: montage, s1: s1, s2: s2, g: g, gril: gril, l1: e.l1, l2: e.l2 }); table(); };
    table(); draw();
  }
  var OF = function (b) { return b ? 'fermé' : 'ouvert'; }, AL = function (b) { return b ? 'allumée' : 'éteinte'; };
  window.FICHE_C03 = {
    id: 'NL-C4-C03', version: '1.0', modele: 'circuit-chemins-1.0',
    titre: 'Deux commandes pour deux zones', niveau: '5e', chapitre: 'Série et dérivation',
    objectif: 'Choisir une association permettant un fonctionnement indépendant.',
    objectifEleve: 'Choisir le montage qui permet d’allumer et d’éteindre chaque zone sans gêner l’autre, et le justifier avec le trajet du courant.',
    materiel: 'Une pile, deux lampes identiques, deux interrupteurs, des fils.',
    situation: 'Deux zones d’une maquette doivent être éclairées indépendamment avec une seule alimentation. Quel montage répond au besoin ?',
    prevision: { consigne: 'Pour le cahier des charges « la zone 2 reste éclairée quand la zone 1 est éteinte », quel montage vas-tu tester en premier ? Dessine ton schéma sur ta fiche.', choix: [['serie', 'Les deux lampes l’une après l’autre dans la même boucle'], ['deriv', 'Chaque lampe sur sa propre branche, avec son interrupteur'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Dessiner d’abord, sur ta fiche, le schéma que tu penses utiliser, puis tester le montage A et le montage B.', 'Pour chacun, essayer les quatre états des interrupteurs (S1 et S2 ouverts ou fermés).', 'Noter l’état des deux lampes à chaque fois.', 'Repérer, sur le schéma, un chemin fermé qui passe par chaque lampe allumée.', 'Une fois les huit états notés, essayer l’interrupteur général et une lampe grillée.'],
    variable: 'Montage, état des interrupteurs et défaut éventuel', maintenu: 'Même pile, mêmes lampes',
    confrontation: 'Le montage que tu proposes satisfait-il les quatre états demandés ? Montre le chemin fermé qui explique chaque lampe allumée et chaque lampe éteinte.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'On ajoute un interrupteur général, placé entre la pile et le point où le circuit se sépare en deux branches (montage B). Il est ouvert, S1 et S2 sont fermés. Que font les lampes ?', options: [['eteintes', 'Les deux lampes sont éteintes'], ['deux', 'Les deux lampes restent allumées'], ['une', 'Une seule lampe est allumée']], rep: 'eteintes',
      expl: 'Les deux sont éteintes : l’interrupteur général est sur le chemin commun, donc quand il est ouvert la boucle est coupée pour les deux branches. Chaque interrupteur de branche ne commande ensuite que sa lampe.' },
    critere: 'Vérifier les quatre états et justifier par les chemins conducteurs.',
    aides: [
      'Une lampe ne s’allume que s’il existe une boucle fermée contenant la pile, la lampe et tous les interrupteurs de ce chemin.',
      'Suis du doigt le fil depuis la borne de la pile : combien de chemins différents existent-ils ? Quels interrupteurs sont sur chacun ?',
      'Pour que la lampe 2 reste alimentée quand S1 est ouvert, il faut un chemin pour la lampe 2 qui ne passe pas par S1.'
    ],
    synthese: 'Une lampe est allumée quand elle appartient à une boucle fermée avec la pile. Dans le montage où tout est sur une seule boucle, ouvrir un interrupteur coupe la boucle entière : les deux lampes s’éteignent. Avec une branche par lampe, chaque interrupteur coupe seulement sa branche : les lampes sont commandées indépendamment. Un interrupteur placé avant la séparation des branches commande tout le circuit.',
    colonnes: ['Montage', 'Interrupteur général', 'S1', 'S2', 'Lampe 1', 'Lampe 2'], lignesVides: 5,
    lignes: function (st) { return st.essais.map(function (e) { return [(e.montage === 'serie' ? 'A' : 'B') + (e.gril ? ' (lampe 1 grillée)' : ''), e.g == null ? '—' : OF(e.g), OF(e.s1), OF(e.s2), AL(e.l1), AL(e.l2)]; }); },
    resume: function (e) { return 'Montage ' + (e.montage === 'serie' ? 'A' : 'B') + (e.gril ? ' (lampe 1 grillée)' : '') + (e.g == null ? '' : ', interrupteur général ' + OF(e.g)) + ' : S1 ' + OF(e.s1) + ', S2 ' + OF(e.s2) + ' → lampe 1 ' + AL(e.l1) + ', lampe 2 ' + AL(e.l2); },
    diagnostic: function (st) {
      var o = [], vus = {};
      st.essais.forEach(function (e) { if (!e.gril && e.g == null) vus[e.montage + (e.s1 ? 1 : 0) + (e.s2 ? 1 : 0)] = 1; });
      ['serie', 'deriv'].forEach(function (m) {
        var n = 0; [[1, 1], [1, 0], [0, 1], [0, 0]].forEach(function (c) { if (vus[m + c[0] + c[1]]) n++; });
        if (n && n < 4) o.push('Montage ' + (m === 'serie' ? 'A' : 'B') + ' : tu as testé ' + n + ' état(s) sur 4. Pour conclure, il faut les quatre.');
        if (n === 4) o.push('Montage ' + (m === 'serie' ? 'A' : 'B') + ' : les quatre états sont testés.');
      });
      var ind = st.essais.some(function (e) { return e.montage === 'deriv' && !e.gril && e.g == null && !e.s1 && e.s2 && e.l2 && !e.l1; });
      if (ind) o.push('Tu as obtenu une lampe allumée et l’autre éteinte : c’est le fonctionnement indépendant demandé.');
      if (st.essais.some(function (e) { return e.gril && e.montage === 'serie' && e.s1 && e.s2 && !e.l2; })) o.push('Montage A, lampe 1 grillée : la boucle est coupée, la lampe 2 s’éteint aussi.');
      if (st.essais.some(function (e) { return e.gril && e.montage === 'deriv' && e.s2 && e.l2; })) o.push('Montage B, lampe 1 grillée : la lampe 2 reste allumée, car sa branche forme encore une boucle fermée.');
      if (st.essais.some(function (e) { return e.g === false && !e.l1 && !e.l2; })) o.push('Interrupteur général ouvert : les deux lampes sont éteintes, quel que soit l’état de S1 et S2.');
      return o;
    },
    extraPrint: { titre: 'Mes deux schémas', consigne: 'Dessine le montage A puis le montage B, avec la pile, les lampes et les interrupteurs, et colorie un chemin fermé.', hauteur: 180 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 420 130" role="img" aria-label="Une pile, deux lampes et deux interrupteurs à relier." style="width:100%;max-width:460px"><rect x="20" y="50" width="20" height="30" fill="none" stroke="var(--ink)" stroke-width="3"/><circle cx="160" cy="40" r="17" fill="none" stroke="var(--ink)" stroke-width="3"/><circle cx="160" cy="95" r="17" fill="none" stroke="var(--ink)" stroke-width="3"/><line x1="260" y1="40" x2="300" y2="22" stroke="var(--ink)" stroke-width="3"/><line x1="260" y1="95" x2="300" y2="77" stroke="var(--ink)" stroke-width="3"/></svg>'; },
    manip: manip,
    modele_: { etat: etat, nbEtats: nbEtats },
    pedagogie: {
      "theme": "C",
      "attendu": 2,
      "connaissance": "Exploiter les lois de l’électricité : dipôles en série, dipôles en dérivation ; élaborer et mettre en œuvre un protocole expérimental simple visant à réaliser un circuit électrique répondant à un cahier des charges.",
      "competences": [
        [
          "concevoir",
          "dispositif"
        ],
        [
          "demarche",
          "hypothese"
        ],
        [
          "langages",
          "passer"
        ]
      ],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Choisir un montage répondant à un cahier des charges.",
          "eleve": "Je sais choisir le montage qui permet de commander chaque lampe séparément.",
          "savoirFaire": [
            "Proposer un schéma avant de tester",
            "Relier chaque exigence à un montage"
          ],
          "indicateur": "La prévision est enregistrée avec un schéma ou une raison.",
          "preuve": "Prévision"
        },
        {
          "id": "O2",
          "objectif": "Tester systématiquement les états d’un circuit.",
          "eleve": "Je sais tester tous les états des interrupteurs et noter l’état des lampes.",
          "savoirFaire": [
            "Faire varier une seule chose à la fois",
            "Compléter un tableau d’états"
          ],
          "indicateur": "Les huit états des deux montages sont notés.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Justifier avec les chemins fermés.",
          "eleve": "Je sais expliquer pourquoi une lampe est allumée ou éteinte en suivant les chemins du courant.",
          "savoirFaire": [
            "Repérer une boucle fermée contenant la pile et la lampe",
            "Expliquer le rôle d’un interrupteur"
          ],
          "indicateur": "La conclusion s’appuie sur des chemins conducteurs.",
          "preuve": "Conclusion et transfert"
        }
      ]
    },
    prof: {
      reference: 'Montage A (une seule boucle) : lampes allumées seulement si S1 et S2 sont fermés. Montage B (une branche par lampe) : lampe 1 commandée par S1 seulement, lampe 2 par S2 seulement ; S1 ouvert et S2 fermé → lampe 1 éteinte, lampe 2 allumée. Transfert : interrupteur général ouvert → deux lampes éteintes.',
      attendus: ['Quatre états testés pour chaque montage.', 'Justification par les chemins fermés : un chemin par lampe dans B, un seul chemin partagé dans A.', 'Distinction entre un interrupteur de branche et un interrupteur général.'],
      erreurs: ['Penser que, dans le montage A, la première lampe est « avant » et reste allumée quand la seconde est coupée.', 'Dire que les lampes de B s’éteignent toutes les deux dès qu’on ouvre un interrupteur de branche.', 'Conclure après un seul état testé.'],
      limites: 'Modèle qualitatif : pile idéale, lampes compatibles avec la source ; l’éclat des lampes n’est pas comparé (on ne dit rien de l’égalité d’éclat de lampes différentes). Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : schémas pré-imprimés à compléter, repérage des chemins par couleur. Approfondissement : ajouter une troisième zone ou un interrupteur général et prévoir les huit états.'
    }
  };
})();
