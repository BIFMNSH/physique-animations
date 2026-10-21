/* NL-C4-D02 — Le logo sur l’écran · 5e · Propagation rectiligne et ombres · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche D02. Source ponctuelle, écran à 60 cm, disque de 6 cm ; diamètre de l’ombre = diamètre du disque × 60 / d (d = distance source-disque). */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var DE = 60, DISQUE = 6, DIST = [20, 30, 40, 45];
  function ombre(d) { return Math.round(DISQUE * DE / d * 10) / 10; }
  function rapport(d) { return Math.round(DE / d * 100) / 100; }
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  function manip(panel, X) {
    var F = window.FICHE_D02, st = X.st(), d = 30;
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'Le banc optique (vue de dessus)' }, L); var host = h('div', { style: 'text-align:center' }, L);
    h('label', { for: 'dd', text: 'Distance source–disque (cm) :' }, R); var sd = h('select', { id: 'dd' }, R, DIST.map(function (k) { return '<option value="' + k + '"' + (k === 30 ? ' selected' : '') + '>' + k + ' cm</option>'; }).join(''));
    var info = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, R);
    h('h4', { text: 'Ce que je relève' }, R);
    h('label', { for: 'o_omb', text: 'Diamètre de l’ombre mesuré (cm) :' }, R); var io = h('input', { id: 'o_omb', type: 'text', inputmode: 'decimal', autocomplete: 'off' }, R);
    h('label', { for: 'o_rap', text: 'Rapport ombre / disque calculé :' }, R); var ir = h('input', { id: 'o_rap', type: 'text', inputmode: 'decimal', autocomplete: 'off' }, R);
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, R), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter dans mon tableau' }, R);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Mesures simulées — modèle ' + F.modele); }
    function draw() {
      var xd = 40 + d * 4, xe = 40 + DE * 4, om = ombre(d) * 4, hd = DISQUE * 4;
      host.innerHTML = '<svg viewBox="0 0 320 170" role="img" aria-label="Source ponctuelle à gauche, disque opaque à ' + d + ' cm, écran à ' + DE + ' cm. L’ombre sur l’écran mesure ' + num(ombre(d), 1) + ' cm pour un disque de ' + DISQUE + ' cm." style="width:100%;max-width:360px"><circle cx="40" cy="85" r="5" fill="#FFD84A"/><line x1="40" y1="85" x2="' + xe + '" y2="' + (85 - om / 2) + '" stroke="#F97316" stroke-dasharray="4 3"/><line x1="40" y1="85" x2="' + xe + '" y2="' + (85 + om / 2) + '" stroke="#F97316" stroke-dasharray="4 3"/><rect x="' + (xd - 3) + '" y="' + (85 - hd / 2) + '" width="6" height="' + hd + '" fill="#5B6B88"/><rect x="' + (xe - 2) + '" y="15" width="4" height="140" fill="var(--ink)"/><rect x="' + (xe - 2) + '" y="' + (85 - om / 2) + '" width="8" height="' + om + '" fill="#0B1220"/><text x="40" y="110" text-anchor="middle" font-size="11" fill="var(--ink)" font-family="sans-serif">source</text><text x="' + xd + '" y="150" text-anchor="middle" font-size="11" fill="var(--ink)" font-family="sans-serif">disque</text><text x="' + xe + '" y="165" text-anchor="middle" font-size="11" fill="var(--ink)" font-family="sans-serif">écran</text></svg>';
      info.textContent = 'Disque à ' + d + ' cm de la source — ombre mesurée : ' + num(ombre(d), 1) + ' cm (disque : ' + DISQUE + ' cm, écran à ' + DE + ' cm).';
    }
    sd.onchange = function () { d = parseInt(sd.value, 10); draw(); };
    bn.onclick = function () { var a = parse(io.value), b = parse(ir.value); if (a == null || b == null) { msg.hidden = false; msg.textContent = 'Écris tes deux valeurs (nombres) avant d’enregistrer.'; return; } msg.hidden = true; X.addEssai({ d: d, omb: a, rap: b }); table(); };
    table(); draw();
  }
  window.FICHE_D02 = {
    id: 'NL-C4-D02', version: '1.0', modele: 'ombre-geometrique-1.0',
    titre: 'Le logo sur l’écran', niveau: '5e', chapitre: 'Propagation rectiligne et ombres',
    objectif: 'Construire une ombre par propagation rectiligne et relier sa taille aux distances.',
    objectifEleve: 'Expliquer la taille d’une ombre en traçant les rayons limites de la lumière.',
    materiel: 'Une source ponctuelle, un disque opaque de 6 cm, un écran à 60 cm de la source, une règle.',
    situation: 'Pour projeter un logo, on veut que l’ombre d’un disque opaque soit deux fois plus grande que le disque. Où placer le disque entre la source et l’écran ?',
    prevision: { consigne: 'La source est à 60 cm de l’écran. À quelle distance de la source faut-il placer le disque pour obtenir une ombre deux fois plus grande que lui ?', choix: [['20', '20 cm de la source'], ['30', '30 cm de la source'], ['40', '40 cm de la source'], ['45', '45 cm de la source'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Placer le disque à une distance de la source.', 'Mesurer le diamètre de l’ombre sur l’écran.', 'Calculer le rapport ombre / disque.', 'Recommencer à une autre distance et noter dans le tableau.'],
    variable: 'Distance source–disque', maintenu: 'Distance source–écran (60 cm), diamètre du disque',
    confrontation: 'Compare ta prévision avec les mesures. À quelle distance l’ombre est-elle deux fois plus grande ? Trace les rayons limites.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'On éloigne le disque de la source, vers l’écran. L’ombre devient-elle plus petite ?', options: [['oui', 'Oui : le rapport 60 / d diminue'], ['non', 'Non : elle devient plus grande'], ['meme', 'Elle ne change pas']], rep: 'oui',
      expl: 'Plus le disque est loin de la source, plus d augmente et plus le rapport 60 / d diminue : l’ombre se rapproche de la taille du disque.' },
    critere: 'Tracer les rayons limites et expliciter la géométrie de la proportion.',
    aides: ['Trace les deux rayons qui partent de la source et frôlent le bord du disque.', 'Compare les distances : source–disque et source–écran. Quand l’ombre est-elle deux fois plus grande que le disque ?', 'Le rapport ombre / disque est égal au rapport des deux distances.'],
    synthese: 'La lumière se propage en ligne droite : les rayons limites qui frôlent le disque délimitent l’ombre. Le diamètre de l’ombre est celui du disque multiplié par le rapport (distance source–écran) / (distance source–disque) : facteur 2 à 30 cm, facteur 3 à 20 cm. Éloigner le disque de la source réduit l’ombre.',
    colonnes: ['Distance source–disque (cm)', 'Ombre mesurée (cm)', 'Rapport calculé'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [e.d, num(e.omb, 1), num(e.rap, 2)]; }); },
    resume: function (e) { return 'À ' + e.d + ' cm : ombre ' + num(e.omb, 1) + ' cm, rapport ' + num(e.rap, 2); },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var bad = []; if (Math.abs(e.omb - ombre(e.d)) > 0.3) bad.push('le diamètre de l’ombre (relis ta mesure)'); if (Math.abs(e.rap - e.omb / DISQUE) > 0.15) bad.push('le rapport (ombre ÷ disque)');
        o.push('(' + e.d + ' cm) ' + (bad.length ? 'Revois ' + bad.join(' et ') + '.' : 'Mesure et rapport cohérents avec le modèle.'));
      });
      if (st.essais.length === 1) o.push('Une seule distance ne suffit pas pour conclure : teste-en une deuxième.');
      return o;
    },
    extraPrint: { titre: 'Construction des rayons limites', consigne: 'Trace la source, le disque, l’écran et les deux rayons limites pour une distance au choix.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 320 120" role="img" aria-label="Une source, un disque et un écran alignés." style="width:100%;max-width:360px"><circle cx="40" cy="60" r="5" fill="#FFD84A"/><rect x="120" y="40" width="6" height="40" fill="#5B6B88"/><rect x="280" y="10" width="4" height="100" fill="var(--ink)"/></svg>'; },
    manip: manip,
    modele_: { ombre: ombre, rapport: rapport, DE: DE, DISQUE: DISQUE, DIST: DIST },
    pedagogie: {
      "theme": "D",
      "attendu": 0,
      "connaissance": "Exploiter expérimentalement la propagation rectiligne de la lumière dans le vide et le modèle du rayon lumineux ; ombres ; mesures de distance.",
      "competences": [["demarche","hypothese"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Tracer les rayons limites.",
          "eleve": "Je sais tracer les rayons qui limitent une ombre.",
          "savoirFaire": [
            "Tracer des droites depuis la source"
          ],
          "indicateur": "Les rayons limites sont tracés.",
          "preuve": "Manipulation"
        },
        {
          "id": "O2",
          "objectif": "Mesurer des diamètres d’ombre.",
          "eleve": "Je sais mesurer un diamètre d’ombre selon la position du disque.",
          "savoirFaire": [
            "Mesurer avec une règle"
          ],
          "indicateur": "Les diamètres du tableau sont mesurés avec unité.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Prévoir une ombre.",
          "eleve": "Je sais prévoir comment l’ombre change si je déplace le disque.",
          "savoirFaire": [
            "Utiliser la propagation rectiligne"
          ],
          "indicateur": "Le transfert prévoit le bon sens de variation.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Source ponctuelle, propagation rectiligne : diamètre de l’ombre / diamètre du disque = d(source-écran) / d(source-disque). Écran à 60 cm, disque de 6 cm : à 30 cm, ombre 12 cm (facteur 2) ; à 20 cm, 18 cm (facteur 3) ; à 40 cm, 9 cm ; à 45 cm, 8 cm. Transfert : éloigner le disque de la source réduit l’ombre. Proportion simple en 5e.',
      attendus: ['Rayons limites tracés.', 'Rapport 60 / d explicité.', 'Le disque est à 30 cm pour un facteur 2.', 'Deux distances comparées.'],
      erreurs: ['Penser que l’ombre est toujours de la taille du disque.', 'Confondre distance source–disque et disque–écran.', 'Tracer des rayons non rectilignes.'],
    }
  };
})();
