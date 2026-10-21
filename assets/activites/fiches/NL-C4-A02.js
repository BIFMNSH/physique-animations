/* NL-C4-A02 — Le flacon sans étiquette · 5e · Mesurer masse et volume · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche A02. Socle : leçons masse et volume, simulation masse-volumique (non modifiées).
   Modèle : balance — masse affichée = masse totale posée − tare ; volume et masse du liquide paramétrés indépendamment. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var FLACON = 42, VOL = 60; // g, mL
  var LIQ = { eau: { n: 'Liquide A', m: 60 }, huile: { n: 'Liquide B', m: 54 }, alcool: { n: 'Liquide C', m: 48 } }; // masse de 60 mL (g)
  function affichage(posee, tare) { return posee - tare; }       // balance
  function posee(etat, liq) { return etat === 'vide' ? FLACON : etat === 'plein' ? FLACON + LIQ[liq].m : 0; }
  var SLOTS = [['vide', 'Masse du flacon vide'], ['plein', 'Masse du flacon plein'], ['tare', 'Mesure avec tare (flacon plein)']];

  function manip(panel, X) {
    var F = window.FICHE_A02, st = X.st(), liq = 'eau', etat = 'rien', tare = 0, oeil = 'niveau', got = {}, vlu = null;
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'Balance et éprouvette' }, L);
    var host = h('div', { style: 'text-align:center' }, L);
    var bal = h('output', { class: 'bal', 'aria-live': 'polite', style: 'display:block;text-align:center;margin:8px 0;min-width:0' }, L, '');
    var rd = h('p', { 'aria-live': 'polite', style: 'text-align:center;margin:4px 0' }, L);
    h('label', { for: 'liq', text: 'Liquide :' }, R);
    var sl = h('select', { id: 'liq' }, R, Object.keys(LIQ).map(function (k) { return '<option value="' + k + '">' + LIQ[k].n + ' (' + VOL + ' mL)</option>'; }).join(''));
    h('label', { for: 'oeil', text: 'Position de l’œil pour lire le volume :' }, R);
    var oe = h('select', { id: 'oeil' }, R, '<option value="haut">Au-dessus du niveau</option><option value="niveau" selected>À hauteur du bas du ménisque</option><option value="bas">En dessous du niveau</option>');
    var row = h('div', { class: 'row' }, R), b1 = h('button', { class: 'btn', type: 'button', text: 'Poser le flacon vide' }, row), b2 = h('button', { class: 'btn', type: 'button', text: 'Remplir (60 mL)' }, row), b3 = h('button', { class: 'btn', type: 'button', text: 'Tarer (zéro)' }, row), b4 = h('button', { class: 'btn', type: 'button', text: 'Retirer la tare' }, row);
    h('label', { for: 'noter', text: 'Je note cette pesée comme :' }, R);
    var nt = h('select', { id: 'noter' }, R, SLOTS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join(''));
    var bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter l’affichage dans mon tableau' }, R);
    var inf = h('div', { class: 'msg', 'aria-live': 'polite' }, R, 'Pose le flacon, remplis-le, essaie la tare, puis note tes trois pesées : vide, plein, avec tare.');
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, R), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, R);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier essai complet : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes pesées' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Données simulées — modèle ' + F.modele); }
    function draw() {
      var lvl = etat === 'plein' ? VOL : (host.dataset.lv ? Number(host.dataset.lv) : 0), y = 170 - lvl * 1.6;
      var shift = oeil === 'haut' ? 3 : oeil === 'bas' ? -3 : 0;
      host.innerHTML = '<svg viewBox="0 0 320 210" role="img" aria-label="Une balance électronique avec un flacon posé dessus, et à droite une éprouvette graduée de 0 à 100 millilitres." style="width:100%;max-width:380px"><rect x="20" y="170" width="170" height="26" rx="8" fill="#5B6B88"/>' +
        (etat !== 'rien' ? '<path d="M60 90 h90 v78 h-90 z" fill="rgba(156,200,232,.15)" stroke="var(--glass)" stroke-width="3"/>' + (etat === 'plein' ? '<rect x="62" y="110" width="86" height="56" fill="rgba(79,168,255,.4)"/>' : '') + '<rect x="75" y="78" width="60" height="14" rx="3" fill="#C77B30"/>' : '<text x="105" y="150" text-anchor="middle" font-size="13" fill="var(--mist)" font-family="sans-serif">plateau vide</text>') +
        '<rect x="230" y="40" width="40" height="150" rx="4" fill="none" stroke="var(--glass)" stroke-width="3"/>' + (etat === 'plein' ? '<rect x="233" y="' + (190 - VOL * 1.5) + '" width="34" height="' + (VOL * 1.5) + '" fill="rgba(79,168,255,.4)"/>' : '') +
        [0, 20, 40, 60, 80, 100].map(function (v) { return '<line x1="262" x2="270" y1="' + (190 - v * 1.5) + '" y2="' + (190 - v * 1.5) + '" stroke="var(--ink)"/><text x="276" y="' + (194 - v * 1.5) + '" font-size="11" fill="var(--mist)" font-family="sans-serif">' + v + '</text>'; }).join('') + '</svg>';
      var v = affichage(posee(etat, liq), tare); bal.textContent = num(v) + ' g';
      var lu = lecture();
      rd.textContent = lu == null ? 'Volume : l’éprouvette est vide.' : 'Volume lu : ' + lu + ' mL' + (oeil === 'niveau' ? ' (œil au niveau du bas du ménisque)' : ' (lecture faussée : l’œil n’est pas au niveau du ménisque)');
      b2.disabled = etat !== 'vide'; b3.disabled = etat === 'rien'; b4.disabled = tare === 0; b1.disabled = etat !== 'rien';
    }
    function lecture() { return etat === 'plein' ? VOL + (oeil === 'haut' ? 4 : oeil === 'bas' ? -4 : 0) : null; }
    function reset() { etat = 'rien'; tare = 0; draw(); }
    b1.onclick = function () { etat = 'vide'; inf.textContent = 'Flacon vide posé. Tu peux noter cette pesée ou remplir le flacon.'; draw(); };
    b2.onclick = function () { etat = 'plein'; inf.textContent = 'Flacon rempli de 60 mL. Note la pesée, ou essaie la tare.'; draw(); };
    b3.onclick = function () { tare = posee(etat, liq); inf.textContent = 'La balance a mis son affichage à zéro avec ce qui est posé : c’est la tare.'; draw(); };
    b4.onclick = function () { tare = 0; draw(); };
    sl.onchange = function () { liq = sl.value; got = {}; reset(); inf.textContent = 'Nouveau liquide : recommence tes trois pesées.'; };
    oe.onchange = function () { oeil = oe.value; draw(); };
    bn.onclick = function () {
      if (etat === 'rien') { inf.textContent = 'Pose d’abord le flacon sur la balance.'; return; }
      got[nt.value] = affichage(posee(etat, liq), tare); if (etat === 'plein' && lecture() != null) vlu = lecture(); inf.textContent = 'Noté : ' + SLOTS.filter(function (s) { return s[0] === nt.value; })[0][1] + ' = ' + num(got[nt.value]) + ' g.';
      if (got.vide != null && got.plein != null && got.tare != null) { X.addEssai({ liq: LIQ[liq].n, vol: vlu == null ? VOL : vlu, vide: got.vide, plein: got.plein, tare: got.tare }); table(); inf.textContent += ' Essai complet enregistré.'; got = {}; vlu = null; }
    };
    table(); draw();
  }

  window.FICHE_A02 = {
    id: 'NL-C4-A02', version: '1.0', modele: 'balance-tare-1.0',
    titre: 'Le flacon sans étiquette', niveau: '5e', chapitre: 'Mesurer masse et volume',
    objectif: 'Mesurer la masse d’un liquide en excluant son récipient et lire un volume.',
    objectifEleve: 'Savoir quelle masse de liquide on a prélevée, sans compter le flacon, et ne pas confondre masse et volume.',
    materiel: 'Un flacon, une éprouvette graduée, une balance électronique avec touche de tare.',
    situation: 'Une préparation exige 60 mL de liquide. Le flacon vide pèse 42 g et le flacon rempli de liquide pèse 102 g. Quelle masse de liquide a-t-on prélevée ?',
    prevision: { consigne: 'Choisis une valeur et explique ce que mesure la balance.', choix: [['42', '42 g'], ['60', '60 g'], ['102', '102 g']] },
    protocole: ['Lire le volume au bas du ménisque, l’œil à hauteur du niveau.', 'Peser le flacon vide, puis le flacon plein.', 'Refaire la mesure en utilisant la tare.', 'Comparer les deux méthodes.', 'Recommencer avec un autre liquide versé au même volume.'],
    variable: 'Liquide utilisé', maintenu: 'Volume de 60 mL, même flacon, même balance',
    confrontation: 'Compare tes essais avec plusieurs liquides. Les deux méthodes (calcul avec deux pesées, et mesure avec la tare) donnent-elles la même masse ? Explique pourquoi la pesée du flacon plein ne répond pas, seule, à la question.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Avec 60 mL d’un autre liquide, la balance indique 90 g pour le flacon rempli (le flacon vide pèse toujours 42 g). Quelle est la masse de ce liquide, en grammes ?', type: 'nombre', unite: 'g', rep: 48, tol: 0,
      expl: '90 − 42 = 48 g. On retire la masse du flacon. Deux liquides de même volume (60 mL) peuvent avoir des masses différentes : le volume se mesure en mL, la masse en g.' },
    critere: 'Exclure le récipient, conserver les unités et ne pas confondre g et mL.',
    aides: [
      'La balance indique la masse de tout ce qui est posé sur son plateau, flacon compris.',
      'La tare remet l’affichage à zéro avec le flacon posé : elle retire la masse du flacon de l’affichage, ce n’est pas de la matière perdue.',
      'Les millilitres mesurent un volume et les grammes une masse : même quand les nombres se ressemblent, ce ne sont pas les mêmes grandeurs.'
    ],
    synthese: 'La balance mesure la masse de tout ce qui est posé dessus. Pour avoir la masse du liquide seul, on retire la masse du flacon vide (soustraction) ou on tare la balance avec le flacon vide : les deux méthodes donnent la même valeur. Le volume (en mL) et la masse (en g) sont deux grandeurs différentes : 60 mL de liquides différents n’ont pas forcément la même masse.',
    colonnes: ['Liquide', 'Volume lu (mL)', 'Masse vide (g)', 'Masse pleine (g)', 'Différence (g)', 'Mesure tarée (g)'], lignesVides: 3,
    lignes: function (st) { return st.essais.map(function (e) { return [e.liq, num(e.vol == null ? VOL : e.vol, 0), num(e.vide), num(e.plein), num(e.plein - e.vide), num(e.tare)]; }); },
    resume: function (e) { return e.liq + ' (' + num(e.vol == null ? VOL : e.vol, 0) + ' mL) : vide ' + num(e.vide) + ' g, plein ' + num(e.plein) + ' g, différence ' + num(e.plein - e.vide) + ' g, tarée ' + num(e.tare) + ' g'; },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var m = null; Object.keys(LIQ).forEach(function (k) { if (LIQ[k].n === e.liq) m = LIQ[k].m; });
        if (m == null) return;
        if (Math.abs(e.plein - e.vide - m) > 1e-9 || Math.abs(e.tare - m) > 1e-9) o.push('(' + e.liq + ') Tes trois valeurs ne se correspondent pas : vérifie ce que tu as noté comme « vide », « plein » et « avec tare ».');
        else o.push('(' + e.liq + ') La différence des deux pesées et la mesure avec la tare donnent la même masse.');
        if (e.vol != null && e.vol !== VOL) o.push('(' + e.liq + ') Ton volume lu (' + num(e.vol, 0) + ' mL) diffère du volume réellement versé : place l’œil à hauteur du bas du ménisque avant de lire.');
      });
      var ms = {}; st.essais.forEach(function (e) { ms[e.liq] = e.plein - e.vide; });
      var ks = Object.keys(ms); if (ks.length >= 2 && ms[ks[0]] !== ms[ks[1]]) o.push('Tu as testé deux liquides versés au même volume : leurs masses ne sont pas les mêmes. Le volume (mL) et la masse (g) sont des grandeurs différentes.');
      return o;
    },
    extraPrint: { titre: 'Schéma de lecture', consigne: 'Dessine l’éprouvette, le ménisque et la position de l’œil pour lire correctement le volume.', hauteur: 150 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 320 130" role="img" aria-label="Un flacon posé sur une balance électronique et une éprouvette graduée." style="width:100%;max-width:420px"><rect x="20" y="100" width="170" height="20" rx="8" fill="#5B6B88"/><path d="M60 40 h90 v58 h-90 z" fill="rgba(156,200,232,.15)" stroke="var(--glass)" stroke-width="3"/><rect x="75" y="28" width="60" height="14" rx="3" fill="#C77B30"/><rect x="230" y="10" width="40" height="110" rx="4" fill="none" stroke="var(--glass)" stroke-width="3"/></svg>'; },
    manip: manip,
    modele_: { affichage: affichage, posee: posee, FLACON: FLACON, VOL: VOL, LIQ: LIQ },
    pedagogie: {
      "theme": "A",
      "attendu": 0,
      "connaissance": "Mesures de masse et de volume d’une substance (études quantitatives dès la classe de 5e) ; le quotient masse volumique n’est introduit qu’à partir de la classe de 4e.",
      "competences": [
        [
          "demarche",
          "mesure"
        ],
        [
          "demarche",
          "interpreter"
        ],
        [
          "outils",
          "planifier"
        ]
      ],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Mesurer la masse d’un liquide en excluant celle de son récipient.",
          "eleve": "Je sais mesurer la masse d’un liquide sans compter celle du flacon.",
          "savoirFaire": [
            "Utiliser une balance électronique et sa fonction tare",
            "Déterminer une masse par différence de deux pesées"
          ],
          "indicateur": "Les deux méthodes (différence de pesées, tare) donnent la même valeur dans le tableau.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Lire un volume dans une éprouvette graduée.",
          "eleve": "Je sais lire un volume au bas du ménisque, l’œil à hauteur du niveau.",
          "savoirFaire": [
            "Placer l’œil à hauteur du niveau",
            "Lire la graduation au bas du ménisque"
          ],
          "indicateur": "Le volume lu dans le tableau correspond au volume versé.",
          "preuve": "Manipulation"
        },
        {
          "id": "O3",
          "objectif": "Distinguer masse et volume.",
          "eleve": "Je sais que la masse et le volume sont deux grandeurs différentes, avec leurs unités.",
          "savoirFaire": [
            "Associer à chaque grandeur sa bonne unité",
            "Comparer deux liquides versés au même volume"
          ],
          "indicateur": "La conclusion et le transfert n’assimilent pas des millilitres à des grammes.",
          "preuve": "Conclusion et transfert"
        }
      ]
    },
    prof: {
      reference: 'Liquide A : 102 − 42 = 60 g ; la mesure avec tare donne aussi 60 g (zéro avec le flacon vide, puis 60 g après remplissage). Le volume est 60 mL dans cet exemple ; masse et volume restent des grandeurs différentes. Transfert : 90 − 42 = 48 g.',
      attendus: ['Masse du liquide = masse pleine − masse vide = 60 g pour le liquide A.', 'Mesure tarée identique à la différence des deux pesées.', '102 g est la masse du flacon et du liquide : elle ne répond pas seule à la question.', 'Lecture du volume à hauteur des yeux, au bas du ménisque.', 'Unités conservées : g pour la masse, mL pour le volume.'],
      erreurs: ['Répondre 102 g (masse totale) ou 42 g (flacon seul).', 'Répondre 60 g « parce que 60 mL » : confusion entre volume et masse.', 'Considérer que la tare fait disparaître de la matière.'],
      limites: 'Modèle : masse affichée = masse totale − tare ; la masse du liquide est paramétrée indépendamment de son volume (60 mL de liquides différents : 60 g, 54 g, 48 g, valeurs synthétiques). La lecture faussée par la position de l’œil est schématique (± 4 mL). Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : pictogrammes du matériel, vocabulaire explicité, tableau préparé. Approfondissement : demander un nouvel exemple ou une limite de la conclusion.'
    }
  };
})();
