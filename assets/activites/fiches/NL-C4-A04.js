/* NL-C4-A04 — Le sachet disparu · 5e · Dissolution · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche A04 ; matrice de migration, pilote A04.
   Socle : simulation solubilite, leçons masse et melanges (non modifiées). */
(function () {
  var TARE = 45, EAU = 100; // flacon + bouchon + coupelle ; eau (g)
  function essai(sucre) { // modèle : système fermé, dissolution complète pour 1–10 g de sucre dans 100 g d'eau
    var m = TARE + EAU + sucre;
    return { sucre: sucre, avant: m, apres: m };
  }
  var h = Activite.h, $ = Activite.$, esc = Activite.esc, num = Activite.num;
  function newRun(sucre) { return { sucre: sucre, phase: 0, avant: null, apres: null }; } // 0 rien · 1 pesé avant · 2 incliné · 3 agité · 4 pesé après
  /* ---- illustration SVG : flacon fermé sur une balance ---- */
  function flaskSVG(host) {
    host.innerHTML =
      '<svg viewBox="0 0 320 280" role="img" aria-label="Un flacon fermé posé sur une balance. Dans le flacon, de l’eau et une coupelle fixée au bouchon qui contient du sucre." style="width:100%;max-width:420px">' +
      '<rect x="40" y="236" width="240" height="26" rx="8" fill="#5B6B88"/><rect x="60" y="226" width="200" height="12" rx="3" fill="#7C8CA8"/>' +
      '<g id="fl" style="transform-origin:160px 226px;transition:transform .8s">' +
      '<path d="M110 90 h100 v128 a8 8 0 0 1 -8 8 h-84 a8 8 0 0 1 -8 -8 z" fill="rgba(156,200,232,.15)" stroke="var(--glass)" stroke-width="3"/>' +
      '<rect x="112" y="150" width="96" height="74" rx="4" fill="rgba(79,168,255,.38)"/>' +
      '<rect x="128" y="72" width="64" height="20" rx="4" fill="#C77B30"/>' +
      '<path d="M150 92 v34 M170 92 v34" stroke="#C77B30" stroke-width="3"/><path d="M138 126 h44 l-6 14 h-32 z" fill="none" stroke="#C77B30" stroke-width="3" id="coupe"/>' +
      '<g id="grains" fill="#FFF8E7" stroke="#B8A88A" stroke-width="1"></g></g>' +
      '<rect x="26" y="40" width="268" height="206" rx="14" fill="none" stroke="var(--or)" stroke-width="2.5" stroke-dasharray="7 6"/>' +
      '<text x="34" y="34" font-size="13" fill="var(--or-soft)" font-family="sans-serif">Système : tout ce qui est dans le flacon fermé</text></svg>';
    var g = $('#grains', host), i, pts = [[146,132],[154,134],[162,131],[170,134],[150,128],[158,129],[166,128],[174,131],[142,134],[178,134]];
    g.innerHTML = '';
    for (i = 0; i < 10; i++) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', pts[i][0]); c.setAttribute('cy', pts[i][1]); c.setAttribute('r', 3.2); c.setAttribute('class', 'grain'); g.appendChild(c); }
    return { setSugar: function (n) { [].forEach.call(g.children, function (c, k) { c.style.display = k < n ? '' : 'none'; c.style.opacity = 1; c.style.transform = ''; }); },
      tilt: function (on) { $('#fl', host).style.transform = on ? 'rotate(-38deg)' : ''; },
      drop: function () { [].forEach.call(g.children, function (c, k) { c.style.transform = 'translate(' + (-10 + (k % 5) * 6) + 'px,' + (70 + (k % 3) * 8) + 'px)'; }); },
      dissolve: function () { [].forEach.call(g.children, function (c) { c.style.opacity = 0; }); },
      reset: function (n) { $('#fl', host).style.transform = ''; this.setSugar(n); } };
  }
  window.FICHE_A04 = {
    id: 'NL-C4-A04', version: '1.0', modele: 'masse-systeme-ferme-1.0',
    titre: 'Le sachet disparu', niveau: '5e', chapitre: 'Dissolution',
    objectif: 'Établir la conservation de la masse pendant une dissolution en système fermé.',
    objectifEleve: 'Savoir si la masse change quand le sucre se dissout dans l’eau, et le prouver avec des mesures.',
    materiel: 'Un flacon fermé avec une coupelle intérieure de sucre, 100 g d’eau, une balance.',
    situation: 'Dans un flacon fermé, une coupelle intérieure libère du sucre dans l’eau. Les grains ne sont plus visibles : la masse a-t-elle diminué ?',
    prevision: { consigne: 'Indique le sens de variation attendu de la masse et justifie.',
      choix: [['diminue', 'La masse diminue'], ['identique', 'La masse reste identique'], ['augmente', 'La masse augmente']] },
    protocole: ['Peser l’ensemble fermé avant mélange.', 'Incliner puis agiter sans ouvrir le flacon.', 'Peser le même ensemble.', 'Recommencer avec une autre quantité de sucre.'],
    variable: 'Quantité de sucre (g)', maintenu: 'Flacon fermé, 100 g d’eau, même balance',
    confrontation: 'Mets les deux pesées en regard de ta prévision. Distingue dispersion et disparition.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Une partie du liquide est renversée, puis on pèse de nouveau. La nouvelle pesée concerne-t-elle le même système ?', rep: 'non',
      expl: 'Non : le flacon a perdu de la matière, ce n’est plus le même système fermé. La masse a diminué parce que du liquide est sorti, pas parce que le sucre a disparu.' },
    critere: 'Identifier le système fermé et justifier avec les deux valeurs.',
    sucreMin: 1, sucreMax: 10, essai: essai,
    illustration: function (host) { flaskSVG(host).setSugar(5); },
    colonnes: ['Sucre (g)', 'Masse avant (g)', 'Masse après (g)', 'Différence (g)'], lignesVides: 3,
    lignes: function (st) { return st.essais.map(function (e) { return [String(e.sucre), num(e.avant), num(e.apres), num(e.apres - e.avant)]; }); },
    resume: function (e) { return e.sucre + ' g de sucre : ' + num(e.avant) + ' g puis ' + num(e.apres) + ' g'; },
    manip: function (panel, X) {
      var F = window.FICHE_A04, st = X.st(), cur = null;
      var g = h('div', { class: 'grid2' }, panel), L = h('div', {}, g), R = h('div', {}, g);
      var holder = h('div', { style: 'text-align:center' }, L); var fl = flaskSVG(holder);
      var balRow = h('div', { class: 'row', style: 'justify-content:center' }, L);
      h('span', { text: 'Balance (flacon + contenu) :' }, balRow);
      var bal = h('output', { class: 'bal', 'aria-live': 'polite' }, balRow, '— g');
      var sl = h('label', { for: 'sug', text: 'Quantité de sucre dans la coupelle : ' }, R); var out = h('b', {}, sl, '');
      var rng = h('input', { type: 'range', id: 'sug', min: F.sucreMin, max: F.sucreMax, step: 1, value: cur ? cur.sucre : 5, style: 'width:100%' }, R);
      var ol = h('ol', { class: 'steps' }, R);
      var labs = ['Peser le flacon fermé (avant)', 'Incliner le flacon', 'Agiter sans ouvrir', 'Peser le même flacon (après)'];
      var btns = labs.map(function (t, i) { var li = h('li', {}, ol); var b = h('button', { class: 'btn', type: 'button', text: (i + 1) + ' · ' + t }, li); b.onclick = function () { act(i); }; return { li: li, b: b }; });
      var note = h('p', { style: 'color:var(--mist);font-size:15px' }, R, 'Le flacon reste fermé pendant tout l’essai : rien n’entre, rien ne sort. Changer la quantité de sucre ouvre un nouvel essai.');
      var again = h('button', { class: 'btn', type: 'button', text: 'Nouvel essai (même quantité)', disabled: '' }, R); again.onclick = function () { fresh(cur.sucre); };
      var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, R); var aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, R);
      aid.onclick = function () {
        if (!st.essais.length) { aidBox.hidden = false; aidBox.textContent = 'L’aide est disponible après ton premier essai complet : essaie d’abord seul.'; return; }
        aidBox.hidden = false; aidBox.textContent = X.aide();
      };
      var tb = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes essais' }, tb); var tbl = h('div', {}, tb);
      function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Données simulées — modèle ' + F.modele); }
      function paint() {
        out.textContent = cur.sucre + ' g';
        btns.forEach(function (o, i) { o.li.className = cur.phase > i ? 'done' : cur.phase === i ? 'now' : ''; o.b.disabled = cur.phase !== i; });
        again.disabled = cur.phase !== 4;
        bal.textContent = cur.phase === 0 ? '— g' : cur.phase < 4 ? num(cur.avant) + ' g' : num(cur.apres) + ' g';
        table();
      }
      function fresh(n) { cur = newRun(n); fl.reset(n); paint(); }
      function act(i) {
        if (cur.phase !== i) return;
        var m = F.essai(cur.sucre);
        if (i === 0) { cur.avant = m.avant; cur.phase = 1; }
        else if (i === 1) { fl.tilt(true); fl.drop(); cur.phase = 2; }
        else if (i === 2) { fl.dissolve(); cur.phase = 3; }
        else { cur.apres = m.apres; cur.phase = 4; fl.tilt(false); X.addEssai({ sucre: cur.sucre, avant: cur.avant, apres: cur.apres }); }
        paint();
      }
      rng.oninput = function () { fresh(Number(rng.value)); };
      fresh(Number(rng.value));
        },

    aides: [
      'Le système, c’est tout ce qui est dans le flacon fermé, flacon et coupelle compris. Rien n’entre, rien ne sort.',
      'Compare la valeur de la balance avant et après : écris les deux nombres avec leur unité, puis leur différence.',
      'Les grains ne se voient plus, mais ils sont toujours dans le flacon : ils sont dispersés dans l’eau.'
    ],
    synthese: 'Dans un système fermé, la masse totale ne change pas pendant une dissolution : le sucre est dispersé dans l’eau, il n’a pas disparu. Cela ne dit rien du volume, qui n’a pas été mesuré ici.',
    pedagogie: {
      "theme": "A",
      "attendu": 1,
      "connaissance": "Conservation de la masse lors d’une transformation ; interpréter la dissolution comme une transformation physique sans perte de matière.",
      "competences": [["demarche","hypothese"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Formuler une prévision justifiée avant d’expérimenter.",
          "eleve": "Je sais formuler une prévision et la justifier avant de mesurer.",
          "savoirFaire": [
            "Choisir une réponse et expliquer pourquoi",
            "Enregistrer ma prévision avant de voir les résultats"
          ],
          "indicateur": "La prévision est enregistrée avant les essais, avec une raison.",
          "preuve": "Prévision"
        },
        {
          "id": "O2",
          "objectif": "Mesurer la masse d’un système avant et après dissolution.",
          "eleve": "Je sais comparer la masse avant et après la dissolution du sucre, dans un flacon fermé.",
          "savoirFaire": [
            "Relever deux masses avec leurs unités",
            "Comparer deux valeurs et conclure"
          ],
          "indicateur": "Chaque essai du tableau contient les deux masses et leur comparaison.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Conclure en s’appuyant sur des mesures.",
          "eleve": "Je sais tirer une conclusion en citant mes mesures.",
          "savoirFaire": [
            "Citer un résultat précis avec son unité",
            "Dire si la prévision est confirmée ou infirmée"
          ],
          "indicateur": "La conclusion cite au moins une valeur mesurée et un verdict.",
          "preuve": "Conclusion et transfert"
        }
      ]
    },
    prof: {
      reference: 'Pour un flacon et sa coupelle de 45 g, 100 g d’eau et 5 g de sucre, on obtient 150 g avant et après. Avec 10 g de sucre : 155 g. On ne conclut pas à la conservation du volume.',
      attendus: ['Les deux pesées sont égales pour tout essai (1 à 10 g de sucre).', 'Le système est identifié comme fermé (flacon, coupelle, eau, sucre).', 'L’élève distingue dispersion (le sucre est toujours là) et disparition.', 'Transfert : non, le système n’est plus le même après le renversement.'],
      erreurs: ['« Le sucre a disparu, donc la masse diminue » : confusion entre ne plus voir et ne plus exister.', 'Confondre la tare (réglage de la balance) avec une perte de matière.', 'Conclure que le volume est conservé : l’activité ne le mesure pas.'],
      limites: 'Modèle idéal : dissolution complète de 1 à 10 g de sucre dans 100 g d’eau, balance sans bruit de mesure, aucune évaporation. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : pictogrammes du matériel, vocabulaire explicité, tableau préparé. Approfondissement : demander un nouvel exemple ou une limite de la conclusion.'
    }
  };
})();
