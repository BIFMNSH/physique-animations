/* NL-C4-C06 — Le panneau lumineux à compléter · 4e · Sécurité et intensité · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche C06 ; matrice de migration, pilote C06.
   Socle : simulation additivite, leçons intensité et court-circuit (non modifiées).
   Modèle : courants nominaux sous 6 V ; limite d'alimentation fictive de 500 mA ; au-delà, demande théorique seulement. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var LIMITE = 500, MOD = { m1: { n: 'Module 1', i: 120 }, m2: { n: 'Module 2', i: 180 }, X: { n: 'Module X', i: 150 }, Y: { n: 'Module Y', i: 250 } };
  function total(ids) { return ids.reduce(function (s, k) { return s + MOD[k].i; }, 0); } // additivité en dérivation
  function decision(t) { return t <= LIMITE ? 'dans la limite' : 'hors spécification (demande théorique)'; }

  function manip(panel, X) {
    var F = window.FICHE_C06, st = X.st();
    var on = { m1: true, m2: true }, slot = 'aucun', court = false;
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'Le circuit (6 V, branches en dérivation)' }, L);
    var svgHost = h('div', {}, L), gauge = h('div', {}, L);
    var amm = h('output', { class: 'bal', 'aria-live': 'polite', style: 'font-size:26px;min-width:0;display:block;text-align:center;margin:10px 0' }, L, '');
    var verdict = h('p', { style: 'font-weight:700;margin:6px 0' }, L);
    h('h3', { text: 'Mes branchements' }, R);
    [['m1', 'Module 1 (120 mA)'], ['m2', 'Module 2 (180 mA)']].forEach(function (c) {
      var lab = h('label', { class: 'opt' }, R, '<input type="checkbox" checked><span>' + esc(c[1]) + ' branché</span>'); lab.firstChild.onchange = function () { on[c[0]] = lab.firstChild.checked; if (court) { court = false; cb.checked = false; } paint(); };
    });
    h('label', { for: 'slot', text: 'Troisième branche :' }, R);
    var sel = h('select', { id: 'slot' }, R, '<option value="aucun">Aucune</option><option value="X">Module X (150 mA)</option><option value="Y">Module Y (250 mA)</option>');
    sel.onchange = function () { slot = sel.value; if (court) { court = false; cb.checked = false; } paint(); };
    var cbl = h('label', { class: 'opt' }, R, '<input type="checkbox" id="cc"><span><b>Scénario de défaut :</b> relier directement les deux bornes de l’alimentation par un fil</span>'), cb = cbl.firstChild;
    cb.onchange = function () { court = cb.checked; paint(); };
    var info = h('div', { class: 'msg', 'aria-live': 'polite' }, R);
    var rel = h('button', { class: 'btn primary', type: 'button', text: 'Relever cette situation dans mon tableau' }, R);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, R), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, R);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier relevé : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes relevés' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function ids() { var a = []; if (on.m1) a.push('m1'); if (on.m2) a.push('m2'); if (slot !== 'aucun') a.push(slot); return a; }
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Données simulées — modèle ' + F.modele); }
    function branches() { return ids().map(function (k) { return MOD[k].i; }); }
    function scheme() {
      var a = ids(), s = '<svg viewBox="0 0 400 230" role="img" aria-label="' + (court ? 'Schéma : un fil relie directement les deux bornes de l’alimentation 6 V.' : 'Schéma : alimentation 6 V et ' + (a.length) + ' branche(s) en dérivation, ampèremètre sur la branche principale.') + '" style="width:100%;max-width:440px">' +
        '<rect x="18" y="80" width="44" height="70" rx="6" fill="#5B6B88" stroke="var(--line)"/><text x="40" y="120" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">6 V</text>' +
        '<path d="M40 80 V30 H370 M40 150 V200 H370" fill="none" stroke="var(--ink)" stroke-width="3"/>' +
        '<circle cx="90" cy="30" r="17" fill="var(--card)" stroke="var(--ink)" stroke-width="3"/><text x="90" y="36" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)" font-family="sans-serif">A</text>';
      if (court) s += '<path d="M370 30 V200" stroke="var(--bad)" stroke-width="5" stroke-dasharray="2 0"/><text x="204" y="118" text-anchor="middle" font-size="14" font-weight="800" fill="var(--bad)" font-family="sans-serif">fil : chemin presque sans résistance</text>';
      else ['m1', 'm2', 'slot'].forEach(function (k, i) {
        var id = k === 'slot' ? slot : k, x = 160 + i * 80, act = k === 'slot' ? slot !== 'aucun' : on[k];
        s += '<g opacity="' + (act ? 1 : .35) + '"><path d="M' + x + ' 30 V80 M' + x + ' 150 V200" stroke="var(--ink)" stroke-width="3"' + (act ? '' : ' stroke-dasharray="5 5"') + '/><rect x="' + (x - 24) + '" y="80" width="48" height="70" rx="8" fill="' + (act ? '#F6B301' : 'none') + '" stroke="var(--ink)" stroke-width="2"/><text x="' + x + '" y="110" text-anchor="middle" font-size="13" font-weight="800" fill="' + (act ? '#0B1220' : 'var(--mist)') + '" font-family="sans-serif">' + (act ? (id === 'aucun' ? '' : id === 'm1' ? 'M1' : id === 'm2' ? 'M2' : id) : '—') + '</text><text x="' + x + '" y="132" text-anchor="middle" font-size="12" fill="' + (act ? '#0B1220' : 'var(--mist)') + '" font-family="sans-serif">' + (act ? MOD[id].i + ' mA' : 'vide') + '</text></g>';
      });
      svgHost.innerHTML = s + '</svg>';
    }
    function bar(t) {
      var W = 300, mx = 700, x = function (v) { return Math.min(W, v / mx * W); };
      gauge.innerHTML = '<svg viewBox="0 0 330 46" role="img" aria-label="Jauge : ' + t + ' milliampères demandés pour une limite de ' + LIMITE + ' milliampères." style="width:100%;max-width:440px"><rect x="10" y="8" width="' + W + '" height="16" rx="4" fill="var(--field)" stroke="var(--line)"/><rect x="10" y="8" width="' + x(t) + '" height="16" rx="4" fill="' + (t <= LIMITE ? 'var(--ok)' : 'var(--bad)') + '"/><line x1="' + (10 + x(LIMITE)) + '" x2="' + (10 + x(LIMITE)) + '" y1="2" y2="30" stroke="var(--ink)" stroke-width="3"/><text x="' + (10 + x(LIMITE)) + '" y="43" text-anchor="middle" font-size="11" fill="var(--ink)" font-family="sans-serif">limite ' + LIMITE + ' mA</text></svg>';
    }
    function paint() {
      scheme();
      if (court) {
        gauge.innerHTML = ''; amm.textContent = 'courant : non déterminé'; verdict.textContent = 'Défaut de court-circuit';
        info.className = 'msg bad'; info.textContent = 'Le fil crée un chemin de très faible résistance : ce n’est pas un récepteur de plus, et on ne peut pas l’obtenir en additionnant des modules. Le courant réel dépend de l’installation et n’est pas simulé ici. Une protection (fusible, disjoncteur) est faite pour couper ce défaut.';
        return;
      }
      var a = ids(), t = total(a);
      bar(t);
      if (!a.length) { amm.textContent = '0 mA'; verdict.textContent = 'Aucun module branché'; info.className = 'msg'; info.textContent = 'Aucun courant demandé.'; return; }
      if (t <= LIMITE) { amm.textContent = t + ' mA (mesure)'; verdict.textContent = 'Dans la limite de ' + LIMITE + ' mA'; info.className = 'msg ok'; info.textContent = branches().join(' + ') + ' = ' + t + ' mA : l’alimentation peut fournir ce courant.'; }
      else { amm.textContent = t + ' mA (demande théorique)'; verdict.textContent = 'Hors spécification : au-delà de ' + LIMITE + ' mA'; info.className = 'msg bad'; info.textContent = branches().join(' + ') + ' = ' + t + ' mA demandés. Ce n’est pas une mesure garantie : l’alimentation est utilisée hors de ses spécifications et son comportement réel n’est pas simulé.'; }
    }
    rel.onclick = function () {
      if (court) { X.addEssai({ cfg: 'défaut : court-circuit', courants: '—', total: null, decision: 'défaut de court-circuit (non simulé)' }); }
      else { var a = ids(); if (!a.length) return; X.addEssai({ cfg: a.map(function (k) { return k === 'm1' ? 'M1' : k === 'm2' ? 'M2' : k; }).join(' + '), courants: branches().join(' + '), total: total(a), decision: decision(total(a)) }); }
      table();
    };
    table(); paint();
  }

  window.FICHE_C06 = {
    id: 'NL-C4-C06', version: '1.0', modele: 'additivite-derivation-1.0',
    titre: 'Le panneau lumineux à compléter', niveau: '4e', chapitre: 'Sécurité et intensité',
    objectif: 'Exploiter l’additivité pour respecter une limite de fonctionnement.',
    objectifEleve: 'Choisir un module à ajouter au panneau sans dépasser la limite de l’alimentation, et justifier ton choix avec un calcul.',
    materiel: 'Un panneau avec deux modules en dérivation sous 6 V, deux modules possibles (X et Y), une alimentation limitée, un ampèremètre.',
    situation: 'Deux modules de 120 mA et de 180 mA, alimentés sous 6 V, sont branchés en dérivation sur une alimentation limitée à 500 mA. On veut ajouter un module : X (150 mA) ou Y (250 mA). Lequel peut-on ajouter ?',
    prevision: { consigne: 'Choisis un module et prévois le courant total demandé à l’alimentation.', nombre: { label: 'Courant total prévu avec ce module', unite: 'mA' }, choix: [['X', 'J’ajoute le module X'], ['Y', 'J’ajoute le module Y']] },
    protocole: ['Mesurer la situation de départ.', 'Ajouter le module X et relever le courant.', 'Remplacer X par Y et relever le courant.', 'Comparer chaque total à la limite.', 'Observer séparément une surcharge et un court-circuit.'],
    variable: 'Module ajouté (aucun, X ou Y)', maintenu: 'Tension 6 V, limite de l’alimentation, modules 1 et 2',
    confrontation: 'Pourquoi l’indépendance des branches ne garantit-elle pas que le courant dans la branche principale reste constant ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'On ajoute cette fois deux modules X (au lieu d’un seul) aux deux modules de départ. Quel courant total est demandé à l’alimentation, en milliampères ?', type: 'nombre', unite: 'mA', rep: 600, tol: 0,
      expl: '300 + 150 + 150 = 600 mA demandés : c’est plus que la limite de 500 mA, donc non conforme au cahier des charges. Ce n’est pas un court-circuit : chaque module garde son courant normal, mais leur somme dépasse ce que l’alimentation peut fournir.' },
    critere: 'Argumenter avec un total et distinguer les deux défauts (surcharge et court-circuit).',
    aides: [
      'En dérivation, chaque branche a son propre courant. Le courant dans la branche principale est la somme des courants des branches.',
      'Écris d’abord l’addition des courants de chaque module branché, puis compare le total à la limite de l’alimentation.',
      'Un total au-dessus de la limite est une demande hors spécification, pas une mesure sûre. Un court-circuit est un autre défaut : un fil sans récepteur, donc un chemin presque sans résistance.'
    ],
    synthese: 'En dérivation, les branches fonctionnent indépendamment, mais leurs courants s’additionnent dans la branche principale : ajouter une branche augmente le courant demandé à l’alimentation. Il faut comparer ce total à la limite. Au-delà, c’est une surcharge, hors spécification. Un court-circuit est un défaut différent : il ne s’obtient pas en ajoutant un récepteur normal, il crée un chemin de très faible résistance.',
    colonnes: ['Situation', 'Courants (mA)', 'Total (mA)', 'Limite (mA)', 'Décision'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [e.cfg, e.courants, e.total == null ? '—' : String(e.total), String(LIMITE), e.decision]; }); },
    resume: function (e) { return e.cfg + ' : ' + (e.total == null ? 'défaut de court-circuit' : e.total + ' mA (' + e.decision + ')'); },
    extraPrint: { titre: 'Schéma de protection', consigne: 'Dessine le circuit avec l’alimentation, les modules en dérivation et l’endroit où placer un fusible ou un disjoncteur.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 400 130" role="img" aria-label="Alimentation 6 V reliée à deux modules en dérivation et à un emplacement libre pour un module à ajouter." style="width:100%;max-width:440px"><rect x="18" y="30" width="44" height="70" rx="6" fill="#5B6B88"/><text x="40" y="70" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">6 V</text><path d="M40 30 V10 H370 M40 100 V120 H370" fill="none" stroke="var(--ink)" stroke-width="3"/><path d="M160 10 V30 M160 100 V120 M240 10 V30 M240 100 V120 M320 10 V30 M320 100 V120" stroke="var(--ink)" stroke-width="3"/><rect x="136" y="30" width="48" height="70" rx="8" fill="#F6B301" stroke="var(--ink)" stroke-width="2"/><rect x="216" y="30" width="48" height="70" rx="8" fill="#F6B301" stroke="var(--ink)" stroke-width="2"/><rect x="296" y="30" width="48" height="70" rx="8" fill="none" stroke="var(--mist)" stroke-width="2" stroke-dasharray="6 5"/><text x="320" y="70" text-anchor="middle" font-size="22" fill="var(--mist)" font-family="sans-serif">?</text></svg>'; },
    manip: manip,
    modele_: { total: total, decision: decision, LIMITE: LIMITE, MOD: MOD },
    pedagogie: {
      "theme": "C",
      "attendu": 2,
      "connaissance": "Loi d’additivité des intensités (circuit à deux mailles) ; mettre en relation les lois de l’électricité et les règles de sécurité dans ce domaine.",
      "competences": [["demarche","mesure"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Appliquer la loi d’additivité des intensités.",
          "eleve": "Je sais calculer l’intensité totale quand des modules sont en dérivation.",
          "savoirFaire": [
            "Additionner les intensités des branches",
            "Donner le résultat avec son unité"
          ],
          "indicateur": "Les intensités totales du tableau sont justes.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Comparer une intensité à une limite de sécurité.",
          "eleve": "Je sais dire si une alimentation est surchargée.",
          "savoirFaire": [
            "Comparer deux valeurs en mA",
            "Décider « dans la limite » ou « hors limite »"
          ],
          "indicateur": "Chaque décision du tableau est cohérente avec la limite.",
          "preuve": "Tableau"
        },
        {
          "id": "O3",
          "objectif": "Expliquer le fondement d’une règle de sécurité.",
          "eleve": "Je sais expliquer pourquoi on ne dépasse pas une intensité limite.",
          "savoirFaire": [
            "Relier surcharge et risque pour l’installation",
            "Justifier un choix par un calcul"
          ],
          "indicateur": "La conclusion justifie le choix par un calcul et par la sécurité.",
          "preuve": "Conclusion et transfert"
        }
      ]
    },
    prof: {
      reference: 'Situation initiale : 120 + 180 = 300 mA. Avec X : 450 mA, dans la limite. Avec Y : 550 mA demandés, hors spécification (limite 500 mA). Un court-circuit n’est pas simplement l’ajout d’un récepteur normal : il crée un chemin de faible résistance. Transfert : deux modules X donnent 600 mA demandés, non conforme.',
      attendus: ['Totaux exacts : 300, 450 et 550 mA ; 600 mA pour deux modules X.', 'Comparaison explicite à la limite de 500 mA et décision argumentée avec le total.', 'Surcharge (somme trop grande de courants normaux) distinguée du court-circuit (chemin de faible résistance).', 'Au-delà de 500 mA, l’élève parle de demande théorique, pas de mesure garantie.', 'Retirer un module restaure les valeurs précédentes.'],
      erreurs: ['Penser que le courant principal reste égal à celui d’une branche parce que les branches sont indépendantes.', 'Assimiler le dépassement de la limite à un court-circuit.', 'Annoncer une coupure automatique à 500 mA : le modèle ne l’affirme pas.'],
      limites: 'Courants nominaux à 6 V. La limite de 500 mA est une capacité nominale d’un dispositif fictif. Au-delà, le modèle affiche une demande théorique et ne simule pas le comportement réel ; aucune coupure universelle n’est inventée. Le court-circuit n’est pas chiffré. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : rappel ciblé de la grandeur ou du modèle et exemple d’organisation des mesures. Approfondissement : laisser choisir un paramètre supplémentaire et justifier les conditions maintenues.'
    }
  };
})();
