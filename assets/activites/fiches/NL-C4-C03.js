/* NL-C4-C03 — Deux commandes pour deux zones · 5e · Série et dérivation · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche C03. Modèle qualitatif : état d'une lampe = existence d'un chemin conducteur fermé. */
(function () {
  var h = Activite.h, esc = Activite.esc;
  function etat(montage, s1, s2) { // s = true si fermé ; retourne {l1, l2}
    if (montage === 'serie') { var on = s1 && s2; return { l1: on, l2: on }; }
    return { l1: s1, l2: s2 };
  }
  function manip(panel, X) {
    var F = window.FICHE_C03, st = X.st(), montage = 'serie', s1 = true, s2 = true;
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'Maquette' }, c);
    h('label', { for: 'mont', text: 'Montage testé :' }, c);
    var sel = h('select', { id: 'mont' }, c, '<option value="serie">Montage A — lampes l’une après l’autre dans la même boucle</option><option value="deriv">Montage B — une branche par lampe, chacune avec son interrupteur</option>');
    var host = h('div', { style: 'text-align:center' }, c);
    var row = h('div', { class: 'row' }, c), b1 = h('button', { class: 'btn', type: 'button' }, row), b2 = h('button', { class: 'btn', type: 'button' }, row), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter cet état dans mon tableau' }, row);
    var out = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, c);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier essai noté : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau des états' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Relevés simulés — modèle ' + F.modele); }
    function lamp(x, y, on, nom) { return '<circle cx="' + x + '" cy="' + y + '" r="17" fill="' + (on ? '#F6B301' : 'none') + '" stroke="var(--ink)" stroke-width="3"/>' + (on ? '<g stroke="#F6B301" stroke-width="3"><line x1="' + (x - 27) + '" x2="' + (x - 21) + '" y1="' + y + '" y2="' + y + '"/><line x1="' + (x + 21) + '" x2="' + (x + 27) + '" y1="' + y + '" y2="' + y + '"/></g>' : '') + '<text x="' + x + '" y="' + (y + 38) + '" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="sans-serif">' + nom + (on ? ' allumée' : ' éteinte') + '</text>'; }
    function sw(x, y, closed, nom) { return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="var(--ink)"/><circle cx="' + (x + 36) + '" cy="' + y + '" r="3" fill="var(--ink)"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + 36) + '" y2="' + (closed ? y : y - 18) + '" stroke="var(--ink)" stroke-width="3"/><text x="' + (x + 18) + '" y="' + (y - 24) + '" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="sans-serif">' + nom + (closed ? ' fermé' : ' ouvert') + '</text>'; }
    function draw() {
      var e = etat(montage, s1, s2), s;
      if (montage === 'serie') s = '<path d="M60 90 V30 H360 V150 H60 V110" fill="none" stroke="var(--ink)" stroke-width="2"/>' + '<rect x="50" y="90" width="20" height="20" fill="var(--bg)" stroke="var(--ink)" stroke-width="2"/><text x="82" y="104" font-size="12" fill="var(--mist)" font-family="sans-serif">pile</text>' + lamp(150, 30, e.l1, 'Lampe 1').replace('cy="30"', 'cy="30"') + sw(220, 30, s1, 'S1').replace(/y="6"/, 'y="6"') + lamp(310, 30, e.l2, 'Lampe 2') + sw(250, 150, s2, 'S2');
      else s = '<path d="M60 90 V30 H360 M60 110 V150 H360 M360 30 V150" fill="none" stroke="var(--ink)" stroke-width="2"/><rect x="50" y="90" width="20" height="20" fill="var(--bg)" stroke="var(--ink)" stroke-width="2"/><text x="82" y="104" font-size="12" fill="var(--mist)" font-family="sans-serif">pile</text>' + sw(100, 30, s1, 'S1') + lamp(250, 30, e.l1, 'Lampe 1') + sw(100, 150, s2, 'S2') + lamp(250, 150, e.l2, 'Lampe 2');
      host.innerHTML = '<svg viewBox="0 0 420 200" role="img" aria-label="' + (montage === 'serie' ? 'Schéma : une pile, deux lampes et deux interrupteurs dans une seule boucle.' : 'Schéma : une pile alimentant deux branches parallèles, chacune avec un interrupteur et une lampe.') + ' Interrupteur S1 ' + (s1 ? 'fermé' : 'ouvert') + ', S2 ' + (s2 ? 'fermé' : 'ouvert') + '. Lampe 1 ' + (e.l1 ? 'allumée' : 'éteinte') + ', lampe 2 ' + (e.l2 ? 'allumée' : 'éteinte') + '." style="width:100%;max-width:480px">' + s + '</svg>';
      b1.textContent = 'S1 : ' + (s1 ? 'ouvrir' : 'fermer'); b2.textContent = 'S2 : ' + (s2 ? 'ouvrir' : 'fermer');
      out.textContent = 'Lampe 1 ' + (e.l1 ? 'allumée' : 'éteinte') + ' · Lampe 2 ' + (e.l2 ? 'allumée' : 'éteinte');
    }
    sel.onchange = function () { montage = sel.value; s1 = s2 = true; draw(); };
    b1.onclick = function () { s1 = !s1; draw(); }; b2.onclick = function () { s2 = !s2; draw(); };
    bn.onclick = function () { var e = etat(montage, s1, s2); X.addEssai({ montage: montage, s1: s1, s2: s2, l1: e.l1, l2: e.l2 }); table(); };
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
    protocole: ['Tester le montage A, puis le montage B.', 'Pour chacun, essayer les quatre états des interrupteurs (S1 et S2 ouverts ou fermés).', 'Noter l’état des deux lampes à chaque fois.', 'Repérer, sur le schéma, un chemin fermé qui passe par chaque lampe allumée.'],
    variable: 'Montage et état des interrupteurs', maintenu: 'Même pile, mêmes lampes',
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
    colonnes: ['Montage', 'S1', 'S2', 'Lampe 1', 'Lampe 2'], lignesVides: 8,
    lignes: function (st) { return st.essais.map(function (e) { return [e.montage === 'serie' ? 'A' : 'B', OF(e.s1), OF(e.s2), AL(e.l1), AL(e.l2)]; }); },
    resume: function (e) { return 'Montage ' + (e.montage === 'serie' ? 'A' : 'B') + ' : S1 ' + OF(e.s1) + ', S2 ' + OF(e.s2) + ' → lampe 1 ' + AL(e.l1) + ', lampe 2 ' + AL(e.l2); },
    diagnostic: function (st) {
      var o = [], vus = {};
      st.essais.forEach(function (e) { vus[e.montage + (e.s1 ? 1 : 0) + (e.s2 ? 1 : 0)] = 1; });
      ['serie', 'deriv'].forEach(function (m) {
        var n = 0; [[1, 1], [1, 0], [0, 1], [0, 0]].forEach(function (c) { if (vus[m + c[0] + c[1]]) n++; });
        if (n && n < 4) o.push('Montage ' + (m === 'serie' ? 'A' : 'B') + ' : tu as testé ' + n + ' état(s) sur 4. Pour conclure, il faut les quatre.');
        if (n === 4) o.push('Montage ' + (m === 'serie' ? 'A' : 'B') + ' : les quatre états sont testés.');
      });
      var ind = st.essais.some(function (e) { return e.montage === 'deriv' && !e.s1 && e.s2 && e.l2 && !e.l1; });
      if (ind) o.push('Tu as obtenu une lampe allumée et l’autre éteinte : c’est le fonctionnement indépendant demandé.');
      return o;
    },
    extraPrint: { titre: 'Mes deux schémas', consigne: 'Dessine le montage A puis le montage B, avec la pile, les lampes et les interrupteurs, et colorie un chemin fermé.', hauteur: 180 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 420 130" role="img" aria-label="Une pile, deux lampes et deux interrupteurs à relier." style="width:100%;max-width:460px"><rect x="20" y="50" width="20" height="30" fill="none" stroke="var(--ink)" stroke-width="3"/><circle cx="160" cy="40" r="17" fill="none" stroke="var(--ink)" stroke-width="3"/><circle cx="160" cy="95" r="17" fill="none" stroke="var(--ink)" stroke-width="3"/><line x1="260" y1="40" x2="300" y2="22" stroke="var(--ink)" stroke-width="3"/><line x1="260" y1="95" x2="300" y2="77" stroke="var(--ink)" stroke-width="3"/></svg>'; },
    manip: manip,
    modele_: { etat: etat },
    prof: {
      reference: 'Montage A (une seule boucle) : lampes allumées seulement si S1 et S2 sont fermés. Montage B (une branche par lampe) : lampe 1 commandée par S1 seulement, lampe 2 par S2 seulement ; S1 ouvert et S2 fermé → lampe 1 éteinte, lampe 2 allumée. Transfert : interrupteur général ouvert → deux lampes éteintes.',
      attendus: ['Quatre états testés pour chaque montage.', 'Justification par les chemins fermés : un chemin par lampe dans B, un seul chemin partagé dans A.', 'Distinction entre un interrupteur de branche et un interrupteur général.'],
      erreurs: ['Penser que, dans le montage A, la première lampe est « avant » et reste allumée quand la seconde est coupée.', 'Dire que les lampes de B s’éteignent toutes les deux dès qu’on ouvre un interrupteur de branche.', 'Conclure après un seul état testé.'],
      limites: 'Modèle qualitatif : pile idéale, lampes compatibles avec la source ; l’éclat des lampes n’est pas comparé (on ne dit rien de l’égalité d’éclat de lampes différentes). Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : schémas pré-imprimés à compléter, repérage des chemins par couleur. Approfondissement : ajouter une troisième zone ou un interrupteur général et prévoir les huit états.'
    }
  };
})();
