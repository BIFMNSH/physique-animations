/* NL-C4-D06 — La réserve mesurée sans contact · 3e · Écho et mesure indirecte · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche D06 ; matrice de migration, pilote D06.
   Socle : simulation vitesse-son (composants de temps) ; géométrie du réservoir et calcul nouveaux.
   Modèle : t = 2 (2 − h) / 340 ; h entre 0,20 et 1,80 m ; air homogène, délais électroniques négligés. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var C = 340, FOND = 2, HMIN = 0.2, HMAX = 1.8; // m/s, m, m, m
  function delai(hh) { return 2 * (FOND - hh) / C; }              // s (non arrondi)
  function hauteur(tS) { return FOND - (C * tS) / 2; }            // m, relation inverse
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  var MESURES = { a: { ms: 8.0, label: 'Écho reçu après 8,0 ms' }, b: { ms: 5.0, label: 'Écho reçu après 5,0 ms' } };

  function manip(panel, X) {
    var F = window.FICHE_D06, st = X.st(), reduce = false, raf = 0, hh = 1.0;
    try { reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    /* 1 · mesure donnée : le calcul de l'élève */
    var c1 = h('div', { class: 'card' }, panel); h('h3', { text: 'Je calcule la hauteur d’eau' }, c1);
    h('p', {}, c1, 'Le capteur est à <b>2,00 m du fond</b>. Vitesse du son : <b>340 m/s</b>. Choisis la mesure à exploiter, puis complète chaque étape avec ses unités (virgule ou point accepté).');
    var sel = h('select', { id: 'mes', 'aria-label': 'Mesure à exploiter' }, c1, '<option value="a">' + MESURES.a.label + '</option><option value="b">' + MESURES.b.label + '</option>');
    var rows = [['d', 'Durée de l’écho en secondes (conversion de ms en s)', 's'], ['p', 'Trajet total du son (aller-retour)', 'm'], ['q', 'Distance capteur–surface de l’eau', 'm'], ['e', 'Hauteur d’eau', 'm']];
    var tb = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c1, '<table class="t"><thead><tr><th scope="col">Étape</th><th scope="col">Ma valeur</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><th scope="row" style="font-weight:700;text-align:left">' + esc(r[1]) + ' (' + r[2] + ')</th><td><input type="text" inputmode="decimal" autocomplete="off" id="c_' + r[0] + '" aria-label="' + esc(r[1]) + ' en ' + (r[2] === 's' ? 'secondes' : 'mètres') + '" style="width:110px"></td></tr>'; }).join('') + '</tbody></table>');
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, c1);
    var bRec = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer mon calcul dans mon tableau' }, c1);
    bRec.onclick = function () {
      var v = {}, ok = true; rows.forEach(function (r) { v[r[0]] = parse(panel.querySelector('#c_' + r[0]).value); if (v[r[0]] === null) ok = false; });
      if (!ok) { msg.hidden = false; msg.textContent = 'Complète les quatre étapes avec des nombres avant d’enregistrer.'; return; }
      msg.hidden = true; X.addEssai({ origine: 'calcul', ms: MESURES[sel.value].ms, d: v.d, p: v.p, q: v.q, e: v.e }); table();
      note.hidden = false; note.textContent = 'Calcul enregistré. Vérifie-le dans le réservoir ci-dessous : règle la hauteur d’eau avec ta valeur et regarde si le capteur affiche le même délai.';
    };
    var note = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, c1);
    /* 2 · réservoir simulé */
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'Le réservoir' }, c2);
    var W = 560, top = 30, bot = 250, px = (bot - top) / FOND; // 2 m ↔ 220 px
    var svg = '<svg viewBox="0 0 640 290" role="img" aria-label="Réservoir vu de côté. Un capteur est fixé en haut, à 2 mètres du fond. L’eau monte jusqu’à une hauteur réglable. Le son part du capteur, descend jusqu’à la surface de l’eau puis remonte au capteur." style="width:100%;max-width:700px">' +
      '<rect x="120" y="' + top + '" width="200" height="' + (bot - top) + '" fill="none" stroke="var(--ink)" stroke-width="3"/><rect id="eau" x="123" y="0" width="194" height="0" fill="rgba(46,156,219,.5)"/><line id="surf" x1="123" x2="317" y1="0" y2="0" stroke="#2E9CDB" stroke-width="3"/>' +
      '<rect x="190" y="12" width="60" height="18" rx="4" fill="#5B6B88"/><text x="220" y="26" text-anchor="middle" font-size="12" fill="#fff" font-family="sans-serif">capteur</text>' +
      '<path id="aller" d="M205 30 V0" stroke="#F97316" stroke-width="3" stroke-dasharray="7 5"/><path id="retour" d="M235 0 V30" stroke="#E9A23B" stroke-width="3" stroke-dasharray="7 5"/>' +
      '<circle id="pulse" r="6" fill="#F6B301" stroke="#0B1220" stroke-width="2" cx="205" cy="30" opacity="0"/>' +
      '<g font-family="sans-serif" font-size="13" fill="var(--mist)"><line x1="100" x2="100" y1="' + top + '" y2="' + bot + '" stroke="var(--mist)"/><text x="94" y="' + (top + 110) + '" text-anchor="end">2,00 m</text><line id="hl" x1="338" x2="338" y1="0" y2="' + bot + '" stroke="#2E9CDB" stroke-width="2"/><text id="ht" x="346" y="0">h</text></g>' +
      '<text x="380" y="40" font-size="13" fill="var(--ink)" font-family="sans-serif">Orange : aller. Jaune : retour.</text></svg>';
    h('div', {}, c2, svg);
    var sl = h('label', { for: 'niv', text: 'Hauteur d’eau : ' }, c2), out = h('b', {}, sl, ''), rng = h('input', { type: 'range', id: 'niv', min: HMIN, max: HMAX, step: 0.01, value: hh, style: 'width:100%', 'aria-describedby': 'nivinfo' }, c2);
    h('p', { id: 'nivinfo', style: 'color:var(--mist);font-size:15px;margin:2px 0' }, c2, 'De ' + num(HMIN, 2) + ' m à ' + num(HMAX, 2) + ' m. Vitesse du son fixée : ' + C + ' m/s.');
    var read = h('output', { class: 'bal', 'aria-live': 'polite', style: 'font-size:26px;display:block;text-align:center;margin:10px 0;min-width:0' }, c2, '');
    var conv = h('p', { style: 'text-align:center;color:var(--mist);margin:0 0 8px' }, c2);
    var row = h('div', { class: 'row' }, c2), bEm = h('button', { class: 'btn', type: 'button', text: 'Émettre une impulsion' }, row), bRel = h('button', { class: 'btn primary', type: 'button', text: 'Relever ce niveau dans mon tableau' }, row);
    h('p', { style: 'color:var(--mist);font-size:15px' }, c2, reduce ? 'Animation réduite (réglage de ton appareil) : le trajet est dessiné en pointillés, sans mouvement.' : 'Animation volontairement <b>ralentie</b> : le vrai trajet dure quelques millisecondes (le délai affiché est le délai réel). Le temps visuel n’est pas le temps physique.');
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Calculs de l’élève et relevés simulés — modèle ' + F.modele); }
    function layout() {
      var y = top + (FOND - hh) * px, E = panel.querySelector('#eau'), t = delai(hh);
      E.setAttribute('y', y); E.setAttribute('height', bot - y); panel.querySelector('#surf').setAttribute('y1', y); panel.querySelector('#surf').setAttribute('y2', y);
      var a = panel.querySelector('#aller'), r = panel.querySelector('#retour'); a.setAttribute('d', 'M205 30 V' + y); r.setAttribute('d', 'M235 ' + y + ' V30');
      panel.querySelector('#hl').setAttribute('y1', y); panel.querySelector('#ht').setAttribute('y', (y + bot) / 2); panel.querySelector('#ht').textContent = 'h = ' + num(hh, 2) + ' m';
      out.textContent = num(hh, 2) + ' m';
      read.textContent = 'Écho reçu après ' + num(t * 1000) + ' ms';
      conv.textContent = '= ' + num(t, 4) + ' s';
    }
    function pulse() {
      var P = panel.querySelector('#pulse'); if (reduce) return; cancelAnimationFrame(raf);
      var y = top + (FOND - hh) * px, T = 4000, t0 = performance.now(); P.setAttribute('opacity', 1);
      (function step(now) { var k = Math.min(1, (now - t0) / T); if (!document.body.contains(P)) return; if (k < .5) { P.setAttribute('cx', 205); P.setAttribute('cy', 30 + (y - 30) * (k * 2)); } else { P.setAttribute('cx', 235); P.setAttribute('cy', y - (y - 30) * ((k - .5) * 2)); } if (k < 1) raf = requestAnimationFrame(step); else P.setAttribute('opacity', 0); })(t0);
    }
    rng.oninput = function () { hh = Number(rng.value); layout(); };
    bEm.onclick = pulse;
    bRel.onclick = function () { var t = delai(hh); X.addEssai({ origine: 'simulé', ms: t * 1000, d: t, p: C * t, q: C * t / 2, e: hh }); table(); };
    table(); layout();
  }

  function near(a, b, tol) { return a != null && Math.abs(a - b) <= tol; }
  window.FICHE_D06 = {
    id: 'NL-C4-D06', version: '1.0', modele: 'echo-reservoir-1.0',
    titre: 'La réserve mesurée sans contact', niveau: '3e', chapitre: 'Écho et mesure indirecte',
    objectif: 'Exploiter un temps de vol aller-retour pour déterminer un niveau.',
    objectifEleve: 'Trouver la hauteur d’eau d’un réservoir sans le toucher, avec la durée d’un écho, et vérifier ton résultat.',
    materiel: 'Un réservoir, un capteur à ultrasons fixé à 2,00 m du fond, un chronomètre électronique.',
    situation: 'Un capteur est fixé à 2,00 m du fond d’un réservoir. Il émet un son qui se réfléchit sur l’eau et revient au capteur après 8,0 ms. Le son se propage à 340 m/s. Quelle hauteur d’eau reste-t-il ?',
    prevision: { consigne: 'Sur ta fiche ou une feuille, dessine le trajet du son. Puis estime si la réserve est à plus de la moitié de la hauteur de 2,00 m, avant tout calcul.', choix: [['plus', 'L’eau dépasse la moitié (plus de 1,00 m)'], ['moins', 'L’eau est sous la moitié (moins de 1,00 m)']] },
    protocole: ['Convertir la durée de l’écho en secondes.', 'Calculer le trajet total du son.', 'Diviser par deux pour obtenir la distance capteur–surface.', 'Soustraire cette distance de 2,00 m.', 'Tester un autre niveau dans le réservoir simulé.'],
    variable: 'Niveau d’eau (m)', maintenu: 'Capteur à 2,00 m du fond, vitesse du son 340 m/s',
    confrontation: 'Un résultat de 2,72 m pour la distance capteur–surface respecte-t-il la géométrie du réservoir ? Où se trouve l’aller-retour dans ton calcul ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Dans ce dispositif, si le niveau d’eau monte, l’écho revient-il plus tôt ou plus tard ?', options: [['tot', 'Plus tôt'], ['tard', 'Plus tard'], ['pareil', 'Au même moment']], rep: 'tot',
      expl: 'Plus tôt : quand l’eau monte, la surface est plus proche du capteur, donc le trajet aller-retour est plus court et dure moins longtemps (t = 2 × (2 − h) ÷ 340).' },
    critere: 'Prendre en compte le facteur deux (aller-retour) puis le repère du fond.',
    aides: [
      'Commence par convertir : 1 ms = 0,001 s. Travaille ensuite étape par étape, sans sauter de ligne du tableau.',
      'Le son fait un aller-retour : le trajet total mesuré correspond à deux fois la distance entre le capteur et la surface de l’eau.',
      'La distance trouvée est mesurée depuis le capteur, pas depuis le fond : il faut ensuite la comparer à la hauteur de 2,00 m entre le capteur et le fond.'
    ],
    synthese: 'Le capteur mesure la durée d’un aller-retour du son : le trajet total est la vitesse multipliée par cette durée, et la distance capteur–surface est la moitié de ce trajet. La hauteur d’eau se lit ensuite depuis le fond : 2,00 m moins cette distance. Ici, 8,0 ms donnent un trajet de 2,72 m, une distance de 1,36 m et 0,64 m d’eau ; 5,0 ms donnent 0,85 m et 1,15 m. Quand le niveau monte, l’écho revient plus tôt.',
    colonnes: ['Origine', 'Délai (ms)', 'Trajet total (m)', 'Distance surface (m)', 'Hauteur d’eau (m)'], lignesVides: 3,
    lignes: function (st) { return st.essais.map(function (e) { return [e.origine === 'calcul' ? 'Mon calcul' : 'Relevé simulé', num(e.ms), num(e.p, 2), num(e.q, 2), num(e.e, 2)]; }); },
    resume: function (e) { return (e.origine === 'calcul' ? 'Calcul' : 'Relevé') + ' à ' + num(e.ms) + ' ms : trajet ' + num(e.p, 2) + ' m, distance ' + num(e.q, 2) + ' m, hauteur ' + num(e.e, 2) + ' m'; },
    diagnostic: function (st) {
      var out = [];
      st.essais.filter(function (e) { return e.origine === 'calcul'; }).forEach(function (e) {
        var ms = e.ms, ref = { p: C * ms / 1000, q: C * ms / 2000, e: hauteur(ms / 1000) }, tag = '(' + num(ms) + ' ms) ';
        if (near(e.d, ms / 1000, 1e-6) === false && near(e.d, ms, 1e-6)) out.push(tag + 'Ta durée est restée en millisecondes : convertis en secondes (1 ms = 0,001 s) avant de multiplier par 340 m/s.');
        if (near(e.q, ref.p, 0.011)) out.push(tag + 'Ta distance capteur–surface est égale au trajet total : le son a fait un aller-retour, divise le trajet par deux. Remarque : ' + num(ref.p, 2) + ' m dépasserait la hauteur de 2,00 m du capteur au fond.');
        if (near(e.e, ref.q, 0.011) && !near(e.e, ref.e, 0.011)) out.push(tag + 'Ta hauteur d’eau est égale à la distance capteur–surface : cette distance se mesure depuis le capteur, soustrais-la de 2,00 m pour repartir du fond.');
        if (near(e.d, ms / 1000, 1e-6) && near(e.p, ref.p, 0.011) && near(e.q, ref.q, 0.011) && near(e.e, ref.e, 0.011)) out.push(tag + 'Toutes tes étapes sont cohérentes avec le modèle.');
      });
      return out;
    },
    extraPrint: { titre: 'Schéma du trajet', consigne: 'Dessine le réservoir, le capteur, la surface de l’eau et le trajet du son à l’aller et au retour.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 640 200" role="img" aria-label="Réservoir avec un capteur en haut et de l’eau au fond. Un son part du capteur vers la surface de l’eau puis revient." style="width:100%;max-width:520px"><rect x="200" y="20" width="160" height="170" fill="none" stroke="var(--ink)" stroke-width="3"/><rect x="203" y="110" width="154" height="77" fill="rgba(46,156,219,.5)"/><rect x="250" y="8" width="60" height="18" rx="4" fill="#5B6B88"/><text x="280" y="21" text-anchor="middle" font-size="12" fill="#fff" font-family="sans-serif">capteur</text><path d="M265 26 V110" stroke="#F97316" stroke-width="3" stroke-dasharray="7 5"/><path d="M295 110 V26" stroke="#E9A23B" stroke-width="3" stroke-dasharray="7 5"/></svg>'; },
    manip: manip,
    modele_: { delai: delai, hauteur: hauteur, C: C, FOND: FOND, HMIN: HMIN, HMAX: HMAX },
    pedagogie: {
      "theme": "D",
      "attendu": 1,
      "connaissance": "Signaux sonores : relier la distance parcourue par un son à la durée de propagation ; mesurer une grandeur de manière indirecte (écho).",
      "competences": [["demarche","mesure"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Exploiter un trajet aller-retour.",
          "eleve": "Je sais utiliser la durée d’un écho pour trouver une distance.",
          "savoirFaire": [
            "Convertir la durée en secondes",
            "Diviser le trajet total par deux"
          ],
          "indicateur": "Distance capteur–surface juste dans le tableau.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Passer d’une distance mesurée à une hauteur.",
          "eleve": "Je sais déduire une hauteur d’eau à partir d’une distance depuis le capteur.",
          "savoirFaire": [
            "Changer de repère : du capteur au fond",
            "Contrôler la cohérence avec la géométrie"
          ],
          "indicateur": "La hauteur d’eau est juste et cohérente avec le réservoir.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Contrôler un résultat avec le simulateur.",
          "eleve": "Je sais vérifier mon calcul avec le réservoir simulé.",
          "savoirFaire": [
            "Utiliser une simulation pour contrôler un calcul",
            "Corriger une étape fausse"
          ],
          "indicateur": "Le diagnostic final signale un calcul cohérent.",
          "preuve": "Manipulation et diagnostic"
        }
      ]
    },
    prof: {
      reference: 'Trajet total 340 × 0,0080 = 2,72 m ; distance capteur–surface 1,36 m ; hauteur d’eau 2,00 − 1,36 = 0,64 m. Pour 5,0 ms : trajet 1,70 m, distance 0,85 m, hauteur 1,15 m. Un niveau plus haut donne un écho plus précoce.',
      attendus: ['Conversion 8,0 ms = 0,0080 s avant le calcul.', 'Facteur deux : 2,72 m est le trajet aller-retour, pas la distance capteur–surface.', 'Repère du fond : hauteur = 2,00 m − distance capteur–surface.', 'Vérification dans le réservoir : 0,64 m redonne 8,0 ms ; 1,15 m redonne 5,0 ms.', 'Transfert : niveau plus haut, trajet plus court, écho plus tôt.'],
      erreurs: ['Oublier de diviser par deux (donner 2,72 m comme distance, impossible dans un réservoir de 2,00 m).', 'Donner la distance capteur–surface comme hauteur d’eau (oubli du repère du fond).', 'Laisser la durée en millisecondes avec une vitesse en m/s.', 'Confondre l’aller-retour du son avec le décalage entre deux microphones.'],
      limites: 'Modèle : t = 2 (2 − h) ÷ 340, h entre 0,20 m et 1,80 m, air homogène, délais électroniques négligés, vitesse du son fixée à 340 m/s. L’animation est volontairement ralentie ; le délai affiché est le délai réel. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : décomposer conversion, relation et interprétation sans donner la réponse finale. Approfondissement : discuter la précision, les hypothèses du modèle et le domaine de validité.'
    }
  };
})();
