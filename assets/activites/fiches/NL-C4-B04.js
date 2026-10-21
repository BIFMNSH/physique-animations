/* NL-C4-B04 — Le virage régulier · 4e · Vecteur vitesse et trajectoires · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche B04. Modèle : cercle de rayon fixe, valeur de vitesse constante 1,0 m/s ; flèche de vitesse tangente, dans le sens du déplacement. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var VAL = 1.0, ANG = [0, 45, 90, 135, 180, 225, 270, 315];
  function norm(a) { return ((a % 360) + 360) % 360; }
  function attendu(theta, sens) { return norm(theta + (sens === 'anti' ? 90 : -90)); } // direction de la tangente dans le sens du déplacement
  var SENS = { anti: 'sens inverse des aiguilles d’une montre', horaire: 'sens des aiguilles d’une montre' };
  function manip(panel, X) {
    var F = window.FICHE_B04, st = X.st(), theta = 90, sens = 'anti', alpha = null, verifie = false;
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'Le mobile sur son cercle' }, c);
    h('label', { for: 'th', text: 'Position du mobile (angle sur le cercle) :' }, c); var sth = h('select', { id: 'th' }, c, ANG.map(function (a) { return '<option value="' + a + '"' + (a === 90 ? ' selected' : '') + '>' + a + '°</option>'; }).join(''));
    h('label', { for: 'sn', text: 'Sens du déplacement :' }, c); var ssn = h('select', { id: 'sn' }, c, '<option value="anti">sens inverse des aiguilles d’une montre</option><option value="horaire">sens des aiguilles d’une montre</option>');
    h('label', { for: 'al', text: 'Direction de ma flèche de vitesse (angle à partir de l’axe horizontal vers la droite) :' }, c); var sal = h('select', { id: 'al' }, c, '<option value="">— choisir —</option>' + ANG.map(function (a) { return '<option value="' + a + '">' + a + '°</option>'; }).join(''));
    var host = h('div', { style: 'text-align:center' }, c), info = h('p', { 'aria-live': 'polite', style: 'font-weight:700;text-align:center' }, c, 'Valeur de la vitesse : ' + num(VAL, 1) + ' m/s, la même partout.');
    var row = h('div', { class: 'row' }, c), bv = h('button', { class: 'btn', type: 'button', text: 'Vérifier ma flèche' }, row), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter dans mon tableau' }, row);
    var msg = h('div', { class: 'msg', 'aria-live': 'polite', hidden: '' }, c);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Relevés simulés — modèle ' + F.modele); }
    function pt(a, r) { var t = a * Math.PI / 180; return [150 + r * Math.cos(t), 100 - r * Math.sin(t)]; }
    function arrow(p, ang, len, col, dash) { var t = ang * Math.PI / 180, e = [p[0] + len * Math.cos(t), p[1] - len * Math.sin(t)], l = ang + 155, r = ang - 155, hd = function (a) { var u = a * Math.PI / 180; return (e[0] + 9 * Math.cos(u)) + ',' + (e[1] - 9 * Math.sin(u)); };
      return '<g stroke="' + col + '" fill="none" stroke-width="3"' + (dash ? ' stroke-dasharray="5 4"' : '') + '><line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + e[0] + '" y2="' + e[1] + '"/><polyline points="' + hd(l) + ' ' + e[0] + ',' + e[1] + ' ' + hd(r) + '"/></g>'; }
    function draw() {
      var p = pt(theta, 70), s = '<svg viewBox="0 0 300 200" role="img" aria-label="Un mobile sur un cercle, à la position ' + theta + ' degrés. Il tourne dans le ' + SENS[sens] + '.' + (alpha != null ? ' Ta flèche est orientée à ' + alpha + ' degrés.' : '') + '" style="width:100%;max-width:340px"><circle cx="150" cy="100" r="70" fill="none" stroke="var(--mist)" stroke-width="2" stroke-dasharray="3 4"/>';
      ANG.forEach(function (a) { var q = pt(a, 70); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="var(--mist)"/>'; });
      if (verifie && alpha != null) s += arrow(p, attendu(theta, sens), 38, '#2EAD6B', true);
      if (alpha != null) s += arrow(p, alpha, 38, '#F97316', false);
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#2E9CDB" stroke="#0B1220" stroke-width="2"/></svg>'; host.innerHTML = s;
    }
    function reset() { alpha = null; verifie = false; sal.value = ''; msg.hidden = true; draw(); }
    sth.onchange = function () { theta = Number(sth.value); reset(); }; ssn.onchange = function () { sens = ssn.value; reset(); };
    sal.onchange = function () { alpha = sal.value === '' ? null : Number(sal.value); verifie = false; msg.hidden = true; draw(); };
    bv.onclick = function () { if (alpha == null) { msg.hidden = false; msg.textContent = 'Choisis d’abord la direction de ta flèche.'; return; } verifie = true; draw(); msg.hidden = false; msg.textContent = alpha === attendu(theta, sens) ? 'La flèche orange est tangente au cercle et suit le sens du déplacement.' : 'Ta flèche orange n’est pas celle attendue : la flèche verte en pointillés montre la direction qui convient. Observe l’angle entre la flèche et le rayon.'; };
    bn.onclick = function () { if (alpha == null) { msg.hidden = false; msg.textContent = 'Choisis d’abord la direction de ta flèche.'; return; } X.addEssai({ theta: theta, sens: sens, alpha: alpha, val: VAL, ok: alpha === attendu(theta, sens) }); table(); };
    table(); draw();
  }
  window.FICHE_B04 = {
    id: 'NL-C4-B04', version: '1.0', modele: 'cercle-uniforme-1.0',
    titre: 'Le virage régulier', niveau: '4e', chapitre: 'Vecteur vitesse et trajectoires',
    objectif: 'Distinguer valeur, direction et sens de la vitesse.',
    objectifEleve: 'Décrire la vitesse d’un mobile sur un cercle avec sa valeur, sa direction et son sens.',
    materiel: 'Une simulation d’un mobile sur un cercle, un tableau de caractéristiques.',
    situation: 'Un mobile avance sur un cercle à allure régulière. Sa vitesse est-elle identique en tous les points ?',
    prevision: { consigne: 'Avant d’utiliser la simulation, dessine sur ta fiche une flèche de vitesse en deux positions, puis donne ton avis.', choix: [['oui', 'La vitesse est identique en tous les points'], ['non', 'La vitesse n’est pas identique en tous les points'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Choisir une position et un sens de déplacement.', 'Orienter la flèche de vitesse et la vérifier.', 'Noter la direction et la valeur.', 'Recommencer pour plusieurs positions, puis inverser le sens.'],
    variable: 'Position sur le cercle et sens du déplacement', maintenu: 'Rayon du cercle et valeur de la vitesse',
    confrontation: 'Compare la valeur, la direction et le sens de ta flèche d’une position à l’autre. Que faut-il préciser séparément pour décrire la vitesse ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un mobile parcourt une ligne droite à vitesse de valeur constante, dans un seul sens. Que reste-t-il constant ?', options: [['trois', 'La valeur, la direction et le sens'], ['valeur', 'Seulement la valeur'], ['rien', 'Rien']], rep: 'trois',
      expl: 'Sur une ligne droite parcourue uniformément, la valeur, la direction et le sens restent constants. Sur le cercle, seule la valeur reste constante : la direction change à chaque position.' },
    critere: 'Identifier séparément les trois caractéristiques.',
    aides: ['La vitesse se décrit par plusieurs caractéristiques : une valeur, une direction et un sens. Examine-les séparément.', 'La flèche de vitesse touche le cercle en un seul point sans le traverser : cherche sa position par rapport au rayon.', 'Quand tu inverses le sens du déplacement, quelle caractéristique de la flèche change et lesquelles restent ?'],
    synthese: 'La vitesse possède une valeur, une direction et un sens. Sur le cercle parcouru régulièrement, la valeur reste constante, mais la direction change à chaque position : la flèche est toujours tangente au cercle. Le sens suit le déplacement : en l’inversant, on inverse les flèches. Dire que « tout change » ou que « rien ne change » est trop imprécis.',
    colonnes: ['Position (°)', 'Sens du déplacement', 'Direction de ma flèche (°)', 'Valeur (m/s)', 'Flèche conforme ?'], lignesVides: 5,
    lignes: function (st) { return st.essais.map(function (e) { return [num(e.theta, 0), e.sens === 'anti' ? 'inverse des aiguilles' : 'des aiguilles', num(e.alpha, 0), num(e.val, 1), e.ok ? 'oui' : 'non']; }); },
    resume: function (e) { return 'Position ' + num(e.theta, 0) + '°, ' + SENS[e.sens] + ' : flèche à ' + num(e.alpha, 0) + '°, valeur ' + num(e.val, 1) + ' m/s, ' + (e.ok ? 'conforme' : 'non conforme'); },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var tag = '(' + num(e.theta, 0) + '°) ', r = attendu(e.theta, e.sens);
        if (e.alpha === r) o.push(tag + 'Ta flèche est tangente et suit le sens du déplacement.');
        else if (e.alpha === norm(r + 180)) o.push(tag + 'Ta flèche est bien tangente, mais dans le mauvais sens : relis le sens du déplacement.');
        else if (e.alpha === e.theta || e.alpha === norm(e.theta + 180)) o.push(tag + 'Ta flèche suit le rayon du cercle : la vitesse est tangente, perpendiculaire au rayon.');
        else o.push(tag + 'Ta flèche n’est pas tangente au cercle : vérifie l’angle entre la flèche et le rayon.');
      });
      return o;
    },
    extraPrint: { titre: 'Schéma à quatre positions', consigne: 'Dessine un cercle, quatre positions du mobile et la flèche de vitesse en chacune. Garde la même longueur pour toutes les flèches.', hauteur: 180 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 300 150" role="img" aria-label="Un cercle avec un mobile qui le parcourt." style="width:100%;max-width:300px"><circle cx="150" cy="75" r="60" fill="none" stroke="var(--mist)" stroke-width="2" stroke-dasharray="3 4"/><circle cx="150" cy="15" r="8" fill="#2E9CDB"/></svg>'; },
    manip: manip,
    modele_: { attendu: attendu, VAL: VAL, norm: norm },
    pedagogie: {
      "theme": "B",
      "attendu": 0,
      "connaissance": "Vitesse : direction, sens et valeur ; mouvements rectilignes et circulaires.",
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
          "numerique",
          "simul"
        ]
      ],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Représenter la vitesse par une flèche tangente à la trajectoire.",
          "eleve": "Je sais orienter la flèche de vitesse d’un mobile sur un cercle.",
          "savoirFaire": [
            "Repérer la tangente à un cercle",
            "Orienter la flèche dans le sens du déplacement"
          ],
          "indicateur": "Les flèches notées sont conformes dans le tableau.",
          "preuve": "Manipulation et tableau"
        },
        {
          "id": "O2",
          "objectif": "Distinguer valeur, direction et sens.",
          "eleve": "Je sais nommer séparément ce qui change et ce qui ne change pas dans la vitesse.",
          "savoirFaire": [
            "Nommer les trois caractéristiques",
            "Dire laquelle varie le long du cercle"
          ],
          "indicateur": "La conclusion évite « tout change » et « rien ne change ».",
          "preuve": "Conclusion"
        },
        {
          "id": "O3",
          "objectif": "Comparer cercle et ligne droite.",
          "eleve": "Je sais comparer la vitesse sur un cercle et sur une droite.",
          "savoirFaire": [
            "Réinvestir les trois caractéristiques dans un autre cas"
          ],
          "indicateur": "La réponse au transfert est juste et justifiée.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Valeur 1,0 m/s en tout point. À 90°, sens inverse des aiguilles : flèche à 180° (vers la gauche) ; à 0° : 90° ; à 180° : 270° ; à 270° : 0°. En sens horaire, toutes les flèches sont inversées. Direction tangente (perpendiculaire au rayon), sens du déplacement. Transfert : sur la droite uniforme, valeur, direction et sens constants.',
      attendus: ['Flèche tangente au cercle (perpendiculaire au rayon) à chaque position.', 'Longueur (valeur) constante.', 'Inversion du sens du déplacement = inversion des flèches.', 'Trois caractéristiques nommées séparément.'],
      erreurs: ['Dessiner la flèche selon le rayon (vers le centre ou vers l’extérieur).', 'Dire « la vitesse change » sans préciser ce qui change.', 'Confondre trajectoire courbe et valeur de vitesse variable.'],
      limites: 'Modèle : cercle de rayon fixe et valeur constante ; huit positions ; angles en degrés. Les flèches ne sont pas des vecteurs mathématiques complets (pas de composantes). La valeur 1,0 m/s est synthétique. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : rayon tracé et équerre. Approfondissement : discuter le cas où la valeur de la vitesse varie sur le cercle.'
    }
  };
})();
