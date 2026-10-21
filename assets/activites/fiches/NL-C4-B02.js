/* NL-C4-B02 — Deux robots, un rendez-vous · 5e · Vitesse uniforme · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche B02 ; matrice de migration, pilote B02.
   Socle : simulation vitesse (non modifiée). Mouvements uniformes synthétiques : x = v × t. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var D = 10, VA = 0.5, VB = 0.4; // trajet (m), vitesses (m/s)
  var REL = { A: { d: 6, t: 12 }, B: { d: 8, t: 20 } }; // relevés initiaux (m, s)
  /* Modèle pur, indépendant du rendu : la position ne dépend que du temps du modèle. */
  function pos(v, t) { return Math.min(D, v * t); }
  function arrivee(v) { return D / v; }
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  var TEND = Math.max(arrivee(VA), arrivee(VB));

  function manip(panel, X) {
    var F = window.FICHE_B02, st = X.st(), reduce = false;
    try { reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    var t = 0, run = false, last = 0, speed = 1, raf = 0, done = false, fin = { A: false, B: false }, ess = null;
    /* 1 · relevés et prévision */
    var c1 = h('div', { class: 'card' }, panel);
    h('h3', { text: 'Mes relevés et mes prévisions' }, c1);
    h('p', { style: 'color:var(--mist)' }, c1, 'Vitesse = distance parcourue en 1 seconde. Complète les deux dernières colonnes <b>avant</b> de lancer la course (virgule ou point accepté).');
    var tb = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c1, '<table class="t"><thead><tr><th scope="col">Robot</th><th scope="col">Distance (m)</th><th scope="col">Durée (s)</th><th scope="col">Vitesse (m/s)</th><th scope="col">Temps prévu sur ' + D + ' m (s)</th></tr></thead><tbody>' +
      ['A', 'B'].map(function (k) { return '<tr><th scope="row" style="font-weight:700">Robot ' + k + '</th><td>' + REL[k].d + '</td><td>' + REL[k].t + '</td><td><input type="text" inputmode="decimal" autocomplete="off" id="v' + k + '" aria-label="Vitesse du robot ' + k + ' en mètres par seconde" style="width:90px"></td><td><input type="text" inputmode="decimal" autocomplete="off" id="p' + k + '" aria-label="Temps prévu pour le robot ' + k + ' sur ' + D + ' mètres, en secondes" style="width:90px"></td></tr>'; }).join('') + '</tbody></table>');
    var ids = ['vA', 'vB', 'pA', 'pB'], inp = {}; ids.forEach(function (i) { inp[i] = panel.querySelector('#' + i); inp[i].oninput = refresh; });
    /* 2 · piste */
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'La course (piste de ' + D + ' m)' }, c2);
    var X0 = 60, PX = 52, svg = '<svg viewBox="0 0 640 190" role="img" aria-label="Piste de ' + D + ' mètres graduée de 0 à ' + D + ' m avec deux robots, A sur la voie du haut et B sur la voie du bas." style="width:100%;max-width:700px"><rect x="40" y="30" width="560" height="130" rx="10" fill="rgba(164,176,204,.10)" stroke="var(--line)"/>';
    for (var m = 0; m <= D; m++) svg += '<line x1="' + (X0 + m * PX) + '" x2="' + (X0 + m * PX) + '" y1="38" y2="152" stroke="var(--line)"/><text x="' + (X0 + m * PX) + '" y="178" text-anchor="middle" font-size="12" fill="var(--mist)" font-family="sans-serif">' + m + '</text>';
    svg += '<text x="618" y="178" font-size="12" fill="var(--mist)" font-family="sans-serif">m</text><line x1="' + (X0 + D * PX) + '" x2="' + (X0 + D * PX) + '" y1="34" y2="156" stroke="var(--ink)" stroke-width="3" stroke-dasharray="6 4"/>';
    [['A', 62, '#2E9CDB'], ['B', 120, '#E9A23B']].forEach(function (r) { svg += '<g id="rob' + r[0] + '"><rect x="-16" y="' + (r[1] - 16) + '" width="32" height="28" rx="7" fill="' + r[2] + '" stroke="#0B1220" stroke-width="2"/><text x="0" y="' + (r[1] + 5) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#0B1220" font-family="sans-serif">' + r[0] + '</text></g>'; });
    svg += '</svg>';
    h('div', {}, c2, svg);
    var clock = h('output', { class: 'bal', style: 'font-size:28px;min-width:140px' }, h('div', { class: 'row' }, c2, '<span>Chronomètre :</span>'), 't = 0,0 s');
    var live = h('p', { 'aria-live': 'polite', style: 'min-height:1.5em;font-weight:700' }, c2);
    var row = h('div', { class: 'row' }, c2);
    var bGo = h('button', { class: 'btn primary', type: 'button', text: 'Départ' }, row), bStep = h('button', { class: 'btn', type: 'button', text: '+ 1 s' }, row), bEnd = h('button', { class: 'btn', type: 'button', text: 'Aller à l’arrivée' }, row), bRst = h('button', { class: 'btn', type: 'button', text: 'Nouvelle course' }, row);
    var sp = h('label', { style: 'display:inline-flex;gap:6px;align-items:center;margin:0;font-weight:400' }, row, 'Vitesse de l’animation <select id="spd" style="width:auto"><option value="1">× 1</option><option value="2">× 2</option><option value="5" selected>× 5</option></select>');
    var sel = panel.querySelector('#spd'); speed = 5; sel.onchange = function () { speed = Number(sel.value); };
    if (reduce) { bGo.hidden = true; sp.hidden = true; h('p', { style: 'color:var(--mist);font-size:15px;margin:0' }, c2, 'Animation réduite (réglage de ton appareil) : avance seconde par seconde ou va directement à l’arrivée.'); }
    h('p', { style: 'color:var(--mist);font-size:15px' }, c2, 'Le temps affiché est celui du modèle : il ne dépend ni de la puissance de l’appareil ni de la vitesse d’animation choisie. Les deux robots partent ensemble.');
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { if (!st.essais.length) { aidBox.hidden = false; aidBox.textContent = 'L’aide est disponible après ta première course : essaie d’abord seul.'; return; } aidBox.hidden = false; aidBox.textContent = X.aide(); };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes essais' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Données simulées — modèle ' + F.modele); }
    function ready() { return ids.every(function (i) { return parse(inp[i].value) !== null; }); }
    function refresh() { var ok = ready(); bGo.disabled = bStep.disabled = bEnd.disabled = !ok && !run; if (!ok) live.textContent = 'Complète d’abord les quatre cases pour lancer la course.'; else if (!run && t === 0) live.textContent = ''; }
    function draw() {
      ['A', 'B'].forEach(function (k) { var x = X0 + pos(k === 'A' ? VA : VB, t) * PX; panel.querySelector('#rob' + k).setAttribute('transform', 'translate(' + x + ' 0)'); });
      clock.textContent = 't = ' + num(t) + ' s';
      [['A', VA], ['B', VB]].forEach(function (r) { if (!fin[r[0]] && t >= arrivee(r[1]) - 1e-9) { fin[r[0]] = true; live.textContent = (live.textContent ? live.textContent + ' ' : '') + 'Le robot ' + r[0] + ' arrive à t = ' + num(arrivee(r[1])) + ' s.'; } });
      if (!done && fin.A && fin.B) { done = true; run = false; bGo.textContent = 'Départ'; record(); }
    }
    function record() {
      var e = { vA: parse(inp.vA.value), vB: parse(inp.vB.value), pA: parse(inp.pA.value), pB: parse(inp.pB.value), oA: arrivee(VA), oB: arrivee(VB) };
      X.addEssai(e); table(); bGo.disabled = true; bStep.disabled = true; bEnd.disabled = true;
      live.textContent += ' Compare maintenant ces temps observés avec tes prévisions (' + num(e.pA) + ' s et ' + num(e.pB) + ' s).';
    }
    function tick(now) { raf = 0; if (!run) return; if (!document.body.contains(panel)) return; t = Math.min(TEND, t + (now - last) / 1000 * speed); last = now; draw(); if (run) raf = requestAnimationFrame(tick); }
    bGo.onclick = function () {
      if (done || !ready()) return;
      if (run) { run = false; bGo.textContent = 'Reprendre'; return; } // pause : le temps du modèle est conservé
      run = true; last = performance.now(); bGo.textContent = 'Pause'; raf = requestAnimationFrame(tick);
    };
    bStep.onclick = function () { if (done || !ready()) return; run = false; bGo.textContent = 'Reprendre'; t = Math.min(TEND, Math.floor(t + 1e-9) + 1); draw(); };
    bEnd.onclick = function () { if (done || !ready()) return; run = false; t = TEND; draw(); };
    bRst.onclick = function () { run = false; t = 0; done = false; fin = { A: false, B: false }; live.textContent = ''; bGo.textContent = 'Départ'; draw(); refresh(); };
    table(); draw(); refresh();
  }

  window.FICHE_B02 = {
    id: 'NL-C4-B02', version: '1.0', modele: 'mouvement-uniforme-1.0',
    titre: 'Deux robots, un rendez-vous', niveau: '5e', chapitre: 'Vitesse uniforme',
    objectif: 'Comparer des vitesses et exploiter v = d/t.',
    objectifEleve: 'Savoir quel robot est le plus rapide, et le prouver avec les distances et les durées.',
    materiel: 'Deux robots sur une piste de 10 m, un chronomètre, un tableau de relevés.',
    situation: 'Le robot A parcourt 6 m en 12 s, le robot B parcourt 8 m en 20 s. Lequel parcourt 10 m le plus vite si chacun garde sa vitesse ?',
    prevision: { consigne: 'Choisis un robot et justifie avant tout calcul.', choix: [['A', 'Le robot A arrive le premier'], ['B', 'Le robot B arrive le premier']] },
    protocole: ['Relever les distances et les durées.', 'Calculer la distance parcourue en 1 seconde (vitesse) de chaque robot.', 'Prévoir le temps de chaque robot sur 10 m.', 'Lancer les deux robots ensemble et relever les temps observés.'],
    variable: 'Aucune : on compare deux robots', maintenu: 'Même piste de 10 m, départ commun, chaque robot garde sa vitesse',
    confrontation: 'Pourquoi le plus long trajet initial ne permet-il pas, à lui seul, de choisir le robot le plus rapide ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Cette fois, le robot B part 4 s avant le robot A. On prend l’origine des temps au départ de B. À quel instant le robot A arrive-t-il au bout des 10 m ?', type: 'nombre', unite: 's', rep: 24, tol: 0.05,
      expl: 'A part à t = 4 s et met toujours le même temps pour 10 m : il arrive à t = 4 + 20 = 24 s, alors que B arrive à t = 25 s. A arrive encore 1 s avant B, mais l’écart a diminué de 4 s à 1 s.' },
    critere: 'Utiliser distance et durée avec des unités cohérentes.',
    aides: [
      'La vitesse indique combien de mètres un robot parcourt en 1 seconde : divise la distance par la durée.',
      'Pour comparer deux robots, exprime leurs vitesses dans la même unité (mètres par seconde).',
      'Quand on connaît la distance à parcourir et la vitesse, on trouve la durée en divisant la distance par la vitesse.'
    ],
    synthese: 'La vitesse compare une distance et une durée : v = d / t. Un robot qui a parcouru plus de distance au départ n’est pas forcément plus rapide, car il a aussi pris plus de temps. Ici, les vitesses sont 0,50 m/s pour A et 0,40 m/s pour B : A arrive le premier. Ce sont des données synthétiques de mouvements uniformes.',
    colonnes: ['Robot', 'Distance (m)', 'Durée (s)', 'Vitesse (m/s)', 'Temps prévu (s)', 'Temps observé (s)'], lignesVides: 2,
    lignes: function (st) { var r = []; st.essais.forEach(function (e) { r.push(['A', String(REL.A.d), String(REL.A.t), num(e.vA, 2), num(e.pA), num(e.oA)]); r.push(['B', String(REL.B.d), String(REL.B.t), num(e.vB, 2), num(e.pB), num(e.oB)]); }); return r; },
    resume: function (e) { return 'A : prévu ' + num(e.pA) + ' s, observé ' + num(e.oA) + ' s ; B : prévu ' + num(e.pB) + ' s, observé ' + num(e.oB) + ' s'; },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 640 120" role="img" aria-label="Deux robots, A et B, sur deux voies parallèles prêts à partir sur une piste de 10 mètres." style="width:100%;max-width:640px"><rect x="40" y="10" width="560" height="100" rx="10" fill="rgba(164,176,204,.10)" stroke="var(--line)"/><line x1="560" x2="560" y1="14" y2="106" stroke="var(--ink)" stroke-width="3" stroke-dasharray="6 4"/><rect x="60" y="22" width="32" height="28" rx="7" fill="#2E9CDB" stroke="#0B1220" stroke-width="2"/><text x="76" y="42" text-anchor="middle" font-size="16" font-weight="800" fill="#0B1220" font-family="sans-serif">A</text><rect x="60" y="68" width="32" height="28" rx="7" fill="#E9A23B" stroke="#0B1220" stroke-width="2"/><text x="76" y="88" text-anchor="middle" font-size="16" font-weight="800" fill="#0B1220" font-family="sans-serif">B</text></svg>'; },
    manip: manip,
    modele_: { pos: pos, arrivee: arrivee, VA: VA, VB: VB, D: D },
    pedagogie: {
      "theme": "B",
      "attendu": 0,
      "connaissance": "Utiliser la relation liant vitesse, distance et durée dans le cas d’un mouvement uniforme.",
      "competences": [["demarche","mesure"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Déterminer une vitesse à partir d’une distance et d’une durée.",
          "eleve": "Je sais calculer une vitesse avec une distance et une durée.",
          "savoirFaire": [
            "Relever une distance et une durée",
            "Calculer le quotient et donner l’unité"
          ],
          "indicateur": "Les vitesses du tableau sont justes, avec leur unité.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Comparer deux mouvements uniformes.",
          "eleve": "Je sais comparer deux vitesses pour désigner le plus rapide.",
          "savoirFaire": [
            "Comparer des valeurs avec leurs unités",
            "Argumenter avec des distances et des durées"
          ],
          "indicateur": "Le verdict s’appuie sur des valeurs chiffrées.",
          "preuve": "Confrontation"
        },
        {
          "id": "O3",
          "objectif": "Prévoir une durée ou une position.",
          "eleve": "Je sais prévoir quand un mobile arrivera.",
          "savoirFaire": [
            "Utiliser la relation entre distance, vitesse et durée",
            "Tenir compte d’un départ décalé"
          ],
          "indicateur": "La réponse au transfert est juste et justifiée.",
          "preuve": "Transfert"
        }
      ]
    },
    prof: {
      reference: 'A : 0,50 m/s et 20 s sur 10 m. B : 0,40 m/s et 25 s sur 10 m. A arrive le premier. Données synthétiques de mouvements uniformes. Transfert : B part 4 s avant A ; avec l’origine au départ de B, A arrive à t = 24 s contre 25 s pour B.',
      attendus: ['Vitesses calculées : A = 6 ÷ 12 = 0,50 m/s ; B = 8 ÷ 20 = 0,40 m/s.', 'Temps prévus sur 10 m : 20 s pour A et 25 s pour B ; observés identiques (modèle uniforme).', 'L’élève explique que la distance seule ne suffit pas : il faut la rapporter à la durée.', 'Unités cohérentes (m, s, m/s) et conclusion appuyée sur des valeurs.', 'Transfert : A arrive à t = 24 s (4 + 20), B à 25 s.'],
      erreurs: ['Choisir B parce qu’il a parcouru la plus grande distance (8 m > 6 m).', 'Diviser la durée par la distance (inverser v = d / t) ou mélanger m et s.', 'Compter la durée de A à partir de l’origine de B (donner 20 s au lieu de 24 s).'],
      limites: 'Mouvements uniformes idéalisés : pas d’accélération ni de frottements. L’horloge du modèle est indépendante du nombre d’images par seconde ; la vitesse d’animation ne change pas les temps affichés. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : pictogrammes du matériel, vocabulaire explicité, tableau préparé. Approfondissement : demander un nouvel exemple ou une limite de la conclusion.'
    }
  };
})();
