/* NL-C4-B01 — Le voyageur assis · 5e · Référentiel et trajectoire · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche B01. Modèle : translation rectiligne à 4 m/s ; passager à 2,0 m de l'arrière du véhicule ; deux repères. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var V = 4, X0 = 2; // m/s, m
  function xVehicule() { return X0; }                 // passager dans le référentiel du véhicule
  function xSol(t) { return X0 + V * t; }            // passager dans le référentiel du sol
  var REF = { vehicule: 'Véhicule', sol: 'Sol' };
  function manip(panel, X) {
    var F = window.FICHE_B01, st = X.st(), ref = 'sol', t = 0;
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'Le véhicule vu par deux observateurs' }, c);
    h('label', { for: 'ref', text: 'Je me place dans le référentiel :' }, c);
    var sel = h('select', { id: 'ref' }, c, '<option value="sol">du sol (observateur immobile au bord de la route)</option><option value="vehicule">du véhicule (observateur assis dans le véhicule)</option>');
    var lt = h('label', { for: 'tt', text: 'Instant : ' }, c), out = h('b', {}, lt, ''), rng = h('input', { type: 'range', id: 'tt', min: 0, max: 6, step: 2, value: 0, style: 'width:100%' }, c);
    var host = h('div', {}, c), rd = h('output', { class: 'bal', 'aria-live': 'polite', style: 'display:block;text-align:center;font-size:22px;min-width:0;margin:8px 0' }, c, '');
    var row = h('div', { class: 'row' }, c), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter cette position dans mon tableau' }, row);
    h('p', { style: 'color:var(--mist);font-size:15px' }, c, 'Le véhicule roule en ligne droite. Le passager est assis, un sac est posé à côté de lui. Les positions sont mesurées à partir de l’origine de ton référentiel.');
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier relevé : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Relevés simulés — modèle ' + F.modele); }
    function px(x) { return 40 + x * 12; }
    function draw() {
      var xv = V * t, xp = ref === 'sol' ? xSol(t) : xVehicule();
      var vehX = ref === 'sol' ? px(xv) : 140, pasX = ref === 'sol' ? px(xSol(t)) : 140 + X0 * 12;
      host.innerHTML = '<svg viewBox="0 0 440 140" role="img" aria-label="Un véhicule vu de côté sur une route, avec un passager assis et un sac. ' + (ref === 'sol' ? 'Vu du sol : le véhicule avance vers la droite.' : 'Vu du véhicule : le véhicule reste en place et la route défile.') + '" style="width:100%;max-width:560px"><line x1="10" x2="430" y1="110" y2="110" stroke="var(--mist)" stroke-width="3"' + (ref === 'vehicule' ? ' stroke-dasharray="' + (6 + 0) + ' 10" stroke-dashoffset="' + (-(t * 24) % 16) + '"' : '') + '/><rect x="' + vehX + '" y="62" width="100" height="40" rx="8" fill="#5B6B88"/><circle cx="' + (vehX + 22) + '" cy="106" r="8" fill="#0B1220"/><circle cx="' + (vehX + 78) + '" cy="106" r="8" fill="#0B1220"/><circle cx="' + (ref === 'sol' ? pasX : vehX + 24) + '" cy="52" r="9" fill="#F97316"/><rect x="' + (ref === 'sol' ? pasX + 16 : vehX + 40) + '" y="48" width="12" height="12" fill="#C77B30"/><text x="' + (vehX + 50) + '" y="130" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">' + (ref === 'sol' ? 'sol : repère fixe' : 'véhicule : repère fixe') + '</text></svg>';
      out.textContent = t + ' s'; rd.textContent = 'Position du passager : ' + num(xp, 1) + ' m';
    }
    sel.onchange = function () { ref = sel.value; draw(); }; rng.oninput = function () { t = Number(rng.value); draw(); };
    bn.onclick = function () { X.addEssai({ ref: ref, t: t, x: ref === 'sol' ? xSol(t) : xVehicule(), xs: ref === 'sol' ? xSol(t) + 0.5 : X0 + 0.5 }); table(); };
    table(); draw();
  }
  window.FICHE_B01 = {
    id: 'NL-C4-B01', version: '1.0', modele: 'referentiel-translation-1.0',
    titre: 'Le voyageur assis', niveau: '5e', chapitre: 'Référentiel et trajectoire',
    objectif: 'Caractériser un mouvement en précisant le référentiel.',
    objectifEleve: 'Décrire le mouvement d’un passager en précisant à chaque fois qui l’observe.',
    materiel: 'Une simulation d’un véhicule vu de côté, un tableau de positions.',
    situation: 'Une personne est assise dans un véhicule. Est-elle immobile ou en mouvement ?',
    prevision: { consigne: 'Donne une réponse et dis qui observe la personne.', choix: [['immobile', 'Elle est immobile'], ['mouvement', 'Elle est en mouvement'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Choisir le sol comme référentiel, relever la position du passager à plusieurs instants.', 'Choisir le véhicule comme référentiel, relever la position à plusieurs instants.', 'Comparer les deux colonnes du tableau.', 'Décrire la trajectoire du passager dans chaque cas.'],
    variable: 'Référentiel et instant', maintenu: 'Véhicule en ligne droite à vitesse constante',
    confrontation: 'Deux descriptions différentes peuvent-elles être toutes les deux correctes ? Pour chaque réponse, nomme le référentiel utilisé.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un sac est posé sur le siège à côté du passager. Sa description du mouvement est-elle la même que celle du passager, dans chaque référentiel ?', options: [['oui', 'Oui'], ['non', 'Non']], rep: 'oui',
      expl: 'Oui : le sac est immobile dans le véhicule et il avance avec lui par rapport au sol, comme le passager. Une description de mouvement n’a de sens qu’avec un référentiel précisé.' },
    critere: 'Préciser le référentiel pour chaque réponse sans contradiction apparente.',
    aides: ['Une position se mesure toujours à partir d’une origine : demande-toi quelle origine (quel observateur) tu utilises.', 'Compare, ligne par ligne, le même instant dans les deux référentiels : quelle colonne change, laquelle ne change pas ?', 'Écris tes phrases sous la forme « par rapport au … , le passager … ».'],
    synthese: 'Un mouvement se décrit toujours par rapport à un référentiel. Le passager est immobile dans le référentiel du véhicule et en mouvement dans celui du sol quand le véhicule roule. Les deux descriptions sont correctes : elles ne répondent pas à la même question. Il faut donc préciser le référentiel pour décrire un mouvement.',
    colonnes: ['Référentiel', 'Instant (s)', 'Position du passager (m)', 'Position du sac (m)'], lignesVides: 6,
    lignes: function (st) { return st.essais.map(function (e) { return [REF[e.ref], num(e.t, 0), num(e.x, 1), num(e.xs, 1)]; }); },
    resume: function (e) { return REF[e.ref] + ' à ' + num(e.t, 0) + ' s : passager ' + num(e.x, 1) + ' m, sac ' + num(e.xs, 1) + ' m'; },
    diagnostic: function (st) {
      var o = [], r = { sol: [], vehicule: [] }; st.essais.forEach(function (e) { r[e.ref].push(e); });
      var dist = function (a) { var s = {}; a.forEach(function (e) { s[e.t] = 1; }); return Object.keys(s).length; };
      if (dist(r.sol) < 2 || dist(r.vehicule) < 2) o.push('Il te manque des relevés : prends au moins deux instants différents dans chaque référentiel avant de comparer.');
      else {
        var cst = function (a) { return a.every(function (e) { return Math.abs(e.x - a[0].x) < 1e-9; }); };
        o.push('Dans tes relevés du ' + (cst(r.vehicule.length ? r.vehicule : [{ x: 0 }]) ? 'véhicule, la position du passager ne varie pas' : 'véhicule, la position varie') + ' ; dans ceux du sol, elle ' + (cst(r.sol) ? 'ne varie pas' : 'varie') + '. Décris chaque cas avec son référentiel.');
      }
      return o;
    },
    extraPrint: { titre: 'Deux dessins légendés', consigne: 'Dessine le véhicule, le passager et le sac vus du sol, puis vus du véhicule. Légende chaque dessin avec son référentiel.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 440 100" role="img" aria-label="Un véhicule sur une route avec un passager assis à l’intérieur." style="width:100%;max-width:480px"><line x1="10" x2="430" y1="80" y2="80" stroke="var(--mist)" stroke-width="3"/><rect x="140" y="38" width="110" height="40" rx="8" fill="#5B6B88"/><circle cx="165" cy="82" r="8" fill="#0B1220"/><circle cx="225" cy="82" r="8" fill="#0B1220"/><circle cx="170" cy="30" r="9" fill="#F97316"/></svg>'; },
    manip: manip,
    modele_: { xVehicule: xVehicule, xSol: xSol, V: V, X0: X0 },
    pedagogie: {
      "theme": "B",
      "attendu": 0,
      "connaissance": "Relativité du mouvement dans des cas simples (train qui démarre le long d’un quai) ; notion d’observateur immobile ou en mouvement.",
      "competences": [["demarche","modele"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Décrire un mouvement en précisant le référentiel.",
          "eleve": "Je sais dire « par rapport à quoi » un objet est immobile ou en mouvement.",
          "savoirFaire": [
            "Nommer l’observateur ou le référentiel",
            "Rédiger une phrase de description complète"
          ],
          "indicateur": "Chaque réponse de la conclusion nomme un référentiel.",
          "preuve": "Conclusion"
        },
        {
          "id": "O2",
          "objectif": "Comparer deux descriptions d’un même mouvement.",
          "eleve": "Je sais lire un tableau de positions dans deux référentiels et les comparer.",
          "savoirFaire": [
            "Repérer la colonne qui varie et celle qui reste constante",
            "Relier chaque colonne à son référentiel"
          ],
          "indicateur": "La comparaison des deux colonnes est exacte et chaque colonne est reliée à son référentiel.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Transférer à un autre objet.",
          "eleve": "Je sais appliquer la même description à un autre objet du véhicule.",
          "savoirFaire": [
            "Réutiliser la méthode pour un objet voisin"
          ],
          "indicateur": "La réponse au transfert est juste et justifiée.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'Dans le référentiel du véhicule : position 2,0 m à tout instant, passager immobile. Dans le référentiel du sol : 2,0 ; 10,0 ; 18,0 ; 26,0 m à 0 ; 2 ; 4 ; 6 s (vitesse 4 m/s), passager en mouvement rectiligne. Le sac a la même description que le passager.',
      attendus: ['Chaque réponse précise son référentiel.', 'Pas de contradiction : immobile (véhicule) et en mouvement (sol) sont deux descriptions correctes.', 'Lecture du tableau : une colonne constante, une colonne qui varie.', 'Trajectoire rectiligne dans le référentiel du sol.'],
      erreurs: ['Dire « il bouge » ou « il ne bouge pas » sans référentiel.', 'Croire que l’une des deux descriptions est fausse.', 'Confondre immobile et « ne change pas de siège ».'],
      limites: 'Translation rectiligne à vitesse constante, deux repères ; positions simulées (passager à 2,0 m de l’arrière, sac à +0,5 m). Pas de rotation ni d’accélération. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : phrase à compléter « par rapport au … ». Approfondissement : un deuxième véhicule qui double.'
    }
  };
})();
