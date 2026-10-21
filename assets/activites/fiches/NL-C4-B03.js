/* NL-C4-B03 — Les points du mobile · 4e · Variations de vitesse · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche B03. Positions imposées à 1 s d'intervalle ; vitesse moyenne d'intervalle (pas de vitesse instantanée). */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var MOB = { A: { n: 'Mobile A', p: [0, 1, 2, 3] }, B: { n: 'Mobile B', p: [0, 1, 3, 6] }, C: { n: 'Mobile C', p: [0, 3, 5, 6] } };
  function dists(p) { return [p[1] - p[0], p[2] - p[1], p[3] - p[2]]; }
  function nature(d) { var s = d[0], i; var up = d[1] > d[0] && d[2] > d[1], dn = d[1] < d[0] && d[2] < d[1], eq = d[0] === d[1] && d[1] === d[2]; return eq ? 'uniforme' : up ? 'accelere' : dn ? 'ralenti' : 'variable'; }
  var NOM = { uniforme: 'mouvement uniforme', accelere: 'mouvement accéléré', ralenti: 'mouvement ralenti' };
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  function manip(panel, X) {
    var F = window.FICHE_B03, st = X.st(), k = 'A', timer = 0;
    var c = h('div', { class: 'card' }, panel); h('h3', { text: 'Chronophotographie' }, c);
    h('label', { for: 'mob', text: 'Mobile :' }, c); var sel = h('select', { id: 'mob' }, c, Object.keys(MOB).map(function (x) { return '<option value="' + x + '">' + MOB[x].n + '</option>'; }).join(''));
    var host = h('div', {}, c), row0 = h('div', { class: 'row' }, c), bj = h('button', { class: 'btn', type: 'button', text: 'Rejouer les positions' }, row0), live = h('p', { 'aria-live': 'polite', style: 'color:var(--mist);margin:4px 0' }, c, 'Les positions sont relevées toutes les secondes, aux instants 0 s, 1 s, 2 s et 3 s.');
    function draw(upto) { var p = MOB[k].p, n = upto == null ? 4 : upto;
      host.innerHTML = '<svg viewBox="0 0 440 90" role="img" aria-label="' + MOB[k].n + ' : positions sur une règle graduée de 0 à 6 mètres, aux instants 0, 1, 2 et 3 secondes : ' + p.join(', ') + ' mètres." style="width:100%;max-width:560px"><line x1="30" x2="420" y1="55" y2="55" stroke="var(--ink)" stroke-width="2"/>' + [0, 1, 2, 3, 4, 5, 6].map(function (m) { return '<line x1="' + (30 + m * 65) + '" x2="' + (30 + m * 65) + '" y1="50" y2="60" stroke="var(--ink)"/><text x="' + (30 + m * 65) + '" y="78" text-anchor="middle" font-size="12" fill="var(--mist)" font-family="sans-serif">' + m + ' m</text>'; }).join('') + p.slice(0, n).map(function (x, i) { return '<circle cx="' + (30 + x * 65) + '" cy="40" r="9" fill="#F97316" stroke="#0B1220" stroke-width="2"/><text x="' + (30 + x * 65) + '" y="22" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">' + i + ' s</text>'; }).join('') + '</svg>'; }
    sel.onchange = function () { k = sel.value; draw(); }; bj.onclick = function () { clearInterval(timer); var i = 1; draw(1); timer = setInterval(function () { i++; draw(i); if (i >= 4) clearInterval(timer); }, 900); };
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes mesures' }, c2);
    h('p', {}, c2, 'Lis les positions et complète : distance parcourue pendant chaque seconde (en mètres), puis ta qualification du mouvement.');
    var ids = [['d1', 'Distance de 0 s à 1 s'], ['d2', 'Distance de 1 s à 2 s'], ['d3', 'Distance de 2 s à 3 s']];
    h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c2, '<table class="t"><thead><tr><th scope="col">Intervalle</th><th scope="col">Ma valeur (m)</th></tr></thead><tbody>' + ids.map(function (r) { return '<tr><th scope="row" style="text-align:left;font-weight:700">' + r[1] + '</th><td><input type="text" inputmode="decimal" autocomplete="off" id="c_' + r[0] + '" aria-label="' + r[1] + ' en mètres" style="width:90px"></td></tr>'; }).join('') + '</tbody></table>');
    h('label', { for: 'qual', text: 'Je qualifie ce mouvement :' }, c2); var ql = h('select', { id: 'qual' }, c2, '<option value="">— choisir —</option><option value="uniforme">uniforme (même distance chaque seconde)</option><option value="accelere">accéléré (distances qui augmentent)</option><option value="ralenti">ralenti (distances qui diminuent)</option>');
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, c2), bn = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer dans mon tableau' }, c2);
    bn.onclick = function () { var v = ids.map(function (r) { return parse(panel.querySelector('#c_' + r[0]).value); }), q = ql.value;
      if (v.indexOf(null) >= 0 || !q) { msg.hidden = false; msg.textContent = 'Complète les trois distances et choisis une qualification avant d’enregistrer.'; return; }
      msg.hidden = true; X.addEssai({ mob: k, nom: MOB[k].n, d: v, q: q }); table(); };
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Positions simulées, calculs de l’élève — modèle ' + F.modele); }
    table(); draw();
  }
  window.FICHE_B03 = {
    id: 'NL-C4-B03', version: '1.0', modele: 'positions-intervalles-1.0',
    titre: 'Les points du mobile', niveau: '4e', chapitre: 'Variations de vitesse',
    objectif: 'Qualifier un mouvement à partir de positions à intervalles de temps égaux.',
    objectifEleve: 'Reconnaître un mouvement uniforme, accéléré ou ralenti en comparant les distances parcourues pendant des durées égales.',
    materiel: 'Trois chronophotographies, une règle graduée, un tableau.',
    situation: 'Trois mobiles suivent la même ligne droite. Leurs traces ont-elles le même mouvement ?',
    prevision: { consigne: 'Avant de mesurer, dis ce que tu penses et par quels écarts tu le justifies.', choix: [['meme', 'Les trois mobiles ont le même mouvement'], ['diff', 'Les trois mobiles n’ont pas le même mouvement'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Lire les positions de chaque mobile à 0 s, 1 s, 2 s et 3 s.', 'Calculer la distance parcourue pendant chaque seconde.', 'Comparer ces distances entre elles.', 'Qualifier le mouvement : uniforme, accéléré ou ralenti.', 'Rejouer les positions pour contrôler.'],
    variable: 'Mobile étudié', maintenu: 'Intervalle de temps de 1 s, même règle',
    confrontation: 'Compare ton impression en regardant les points avec les distances calculées pendant des durées égales. Qu’est-ce qui te permet de qualifier le mouvement ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un mobile suit un cercle en parcourant la même distance chaque seconde. La valeur de sa vitesse peut-elle être constante ?', options: [['oui', 'Oui'], ['non', 'Non']], rep: 'oui',
      expl: 'Oui : la valeur de la vitesse peut rester constante même si la trajectoire est courbe. La direction change, mais la distance parcourue par seconde reste la même.' },
    critere: 'Distinguer trajectoire, valeur de la vitesse et direction.',
    aides: ['Compare les distances parcourues pendant des durées égales, pas les positions elles-mêmes.', 'Calcule chaque distance en soustrayant deux positions voisines.', 'Si les distances augmentent d’une seconde à l’autre, que peux-tu dire de la valeur de la vitesse ?'],
    synthese: 'Pour des durées égales, des distances égales indiquent une vitesse de valeur constante (mouvement uniforme) ; des distances qui augmentent indiquent un mouvement accéléré ; des distances qui diminuent, un mouvement ralenti. La trajectoire peut être rectiligne dans les trois cas. Ces distances donnent une vitesse moyenne sur chaque intervalle, pas la vitesse à un instant précis.',
    colonnes: ['Mobile', 'Distance 0–1 s (m)', 'Distance 1–2 s (m)', 'Distance 2–3 s (m)', 'Mon mouvement'], lignesVides: 3,
    lignes: function (st) { return st.essais.map(function (e) { return [e.nom, num(e.d[0], 1), num(e.d[1], 1), num(e.d[2], 1), NOM[e.q]]; }); },
    resume: function (e) { return e.nom + ' : ' + e.d.map(function (x) { return num(x, 1) + ' m'; }).join(', ') + ' → ' + NOM[e.q]; },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var m = MOB[e.mob]; if (!m) return; var d = dists(m.p), tag = '(' + e.nom + ') ', ok = d.every(function (x, i) { return Math.abs(x - e.d[i]) < 1e-9; });
        if (!ok) o.push(tag + 'Une distance ne correspond pas aux positions : calcule chaque distance en soustrayant les positions de deux instants voisins.');
        else if (e.q !== nature(d)) o.push(tag + 'Tes distances sont justes, mais ta qualification ne correspond pas : compare ces distances entre elles.');
        else o.push(tag + 'Distances et qualification sont cohérentes avec les positions.');
      });
      return o;
    },
    extraPrint: { titre: 'Chronophotographies annotées', consigne: 'Reproduis les trois séries de points, note les distances entre points voisins et qualifie chaque mouvement.', hauteur: 150 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 440 60" role="img" aria-label="Quatre points alignés sur une règle, à des écarts réguliers." style="width:100%;max-width:520px"><line x1="30" x2="420" y1="35" y2="35" stroke="var(--ink)" stroke-width="2"/><circle cx="30" cy="25" r="8" fill="#F97316"/><circle cx="160" cy="25" r="8" fill="#F97316"/><circle cx="290" cy="25" r="8" fill="#F97316"/><circle cx="420" cy="25" r="8" fill="#F97316"/></svg>'; },
    manip: manip,
    modele_: { MOB: MOB, dists: dists, nature: nature },
    pedagogie: {
      "theme": "B",
      "attendu": 0,
      "connaissance": "Mouvements uniformes et mouvements dont la vitesse varie au cours du temps en direction ou en valeur.",
      "competences": [["demarche","mesure"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Calculer des distances parcourues pendant des durées égales.",
          "eleve": "Je sais calculer la distance parcourue pendant chaque seconde à partir des positions.",
          "savoirFaire": [
            "Soustraire deux positions voisines",
            "Compléter un tableau de distances"
          ],
          "indicateur": "Les distances du tableau correspondent aux positions.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Qualifier un mouvement : uniforme, accéléré, ralenti.",
          "eleve": "Je sais qualifier un mouvement en comparant les distances.",
          "savoirFaire": [
            "Comparer des distances entre elles",
            "Choisir le terme qui convient"
          ],
          "indicateur": "La qualification est cohérente avec les distances calculées.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Distinguer trajectoire, valeur de la vitesse et direction.",
          "eleve": "Je sais que la forme de la trajectoire ne dit pas à elle seule comment varie la vitesse.",
          "savoirFaire": [
            "Séparer trajectoire et valeur de la vitesse",
            "Argumenter sur un cas circulaire"
          ],
          "indicateur": "La réponse au transfert est juste et justifiée.",
          "preuve": "Transfert"
        }
      ]
    },
  };
})();
