/* NL-C4-C08 — Le défi des consommations · 3e · Puissance et énergie · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche C08. Modèle : puissances constantes ; E = P × t ; P = U × I appliqué au continu. 1 Wh = 3600 J.
   Aucun coût ni bilan carbone réel : pas de tarif ni de facteur sourcé. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var APP = { a: { n: 'Appareil A — 60 W', P: 60 }, b: { n: 'Appareil B — 15 W', P: 15 }, c: { n: 'Appareil C — 20 W', P: 20 }, d: { n: 'Récepteur continu D — 12 V et 0,50 A', U: 12, I: 0.5, P: 6 }, e: { n: 'Appareil E en veille permanente — 5 W', P: 5 }, f: { n: 'Appareil F en usage actif — 100 W', P: 100 } };
  function energieWh(P, t) { return P * t; }
  function enJoules(wh) { return wh * 3600; }
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  function near(a, b, tol) { return a != null && Math.abs(a - b) <= tol; }
  function manip(panel, X) {
    var F = window.FICHE_C08, st = X.st(), k = 'a', t = 2;
    var c1 = h('div', { class: 'card' }, panel); h('h3', { text: 'Appareil et durée' }, c1);
    h('label', { for: 'appr', text: 'Appareil :' }, c1);
    var sel = h('select', { id: 'appr' }, c1, Object.keys(APP).map(function (x) { return '<option value="' + x + '">' + APP[x].n + '</option>'; }).join(''));
    var lt = h('label', { for: 'dur', text: 'Durée de fonctionnement : ' }, c1), out = h('b', {}, lt, ''), rng = h('input', { type: 'range', id: 'dur', min: 0.5, max: 24, step: 0.5, value: t, style: 'width:100%' }, c1);
    var info = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, c1);
    function show() { out.textContent = num(t, 1) + ' h'; var a = APP[k]; info.textContent = a.P != null && a.U == null ? 'Puissance indiquée : ' + a.P + ' W · Durée : ' + num(t, 1) + ' h' : 'Tension : ' + a.U + ' V · Intensité : ' + num(a.I, 2) + ' A · Durée : ' + num(t, 1) + ' h (la puissance n’est pas indiquée)'; }
    sel.onchange = function () { k = sel.value; show(); }; rng.oninput = function () { t = Number(rng.value); show(); };
    h('p', { style: 'color:var(--mist);font-size:15px' }, c1, 'Ici, seule l’énergie est calculée. Pour en déduire un coût, il faudrait un tarif (par exemple en F CFA par kWh) ; il n’est pas fourni et aucun montant n’est inventé.');
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'Mes calculs' }, c2);
    var rows = [['P', 'Puissance de l’appareil', 'W'], ['E', 'Énergie consommée sur la durée choisie', 'Wh']];
    h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c2, '<table class="t"><thead><tr><th scope="col">Grandeur</th><th scope="col">Ma valeur</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><th scope="row" style="font-weight:700;text-align:left">' + esc(r[1]) + ' (' + r[2] + ')</th><td><input type="text" inputmode="decimal" autocomplete="off" id="c_' + r[0] + '" aria-label="' + esc(r[1]) + ' en ' + (r[2] === 'W' ? 'watts' : 'wattheures') + '" style="width:110px"></td></tr>'; }).join('') + '</tbody></table>');
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, c2), note = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, c2);
    var bRec = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer dans mon tableau' }, c2);
    bRec.onclick = function () {
      var P = parse(panel.querySelector('#c_P').value), E = parse(panel.querySelector('#c_E').value);
      if (P === null || E === null) { msg.hidden = false; msg.textContent = 'Complète la puissance et l’énergie avec des nombres avant d’enregistrer.'; return; }
      msg.hidden = true; X.addEssai({ app: k, nom: APP[k].n.split(' — ')[0], t: t, P: P, E: E }); table();
      note.hidden = false; note.textContent = 'Enregistré. Essaie une autre durée ou un autre appareil, puis compare les énergies.';
    };
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Calculs de l’élève — modèle ' + F.modele); }
    table(); show();
  }
  window.FICHE_C08 = {
    id: 'NL-C4-C08', version: '1.0', modele: 'puissance-energie-1.0',
    titre: 'Le défi des consommations', niveau: '3e', chapitre: 'Puissance et énergie',
    objectif: 'Calculer puissance et énergie et comparer des usages.',
    objectifEleve: 'Comparer l’énergie consommée par plusieurs appareils en tenant compte à la fois de leur puissance et de leur durée de fonctionnement.',
    materiel: 'Des fiches techniques d’appareils (puissance ou tension et intensité), un tableau de calcul.',
    situation: 'Un appareil de 60 W fonctionne 2 h ; un autre de 15 W fonctionne 10 h. Le moins puissant consomme-t-il moins ?',
    prevision: { consigne: 'Avant tout calcul, classe les énergies consommées par les deux appareils et explique ton choix.', choix: [['b-moins', 'L’appareil de 15 W consomme moins'], ['a-moins', 'L’appareil de 60 W consomme moins'], ['egal', 'Ils consomment la même énergie'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Choisir un appareil et une durée.', 'Déterminer la puissance (la calculer si on donne une tension et une intensité).', 'Calculer l’énergie consommée avec la durée.', 'Recommencer avec d’autres durées et d’autres appareils.', 'Comparer et classer.', 'Comparer un appareil en veille toute la journée avec un appareil actif peu de temps.', 'Proposer une façon de réduire la consommation, avec un argument chiffré.'],
    variable: 'Appareil et durée de fonctionnement', maintenu: 'Puissances supposées constantes',
    confrontation: 'Compare la puissance et l’énergie des deux appareils. Qu’est-ce qui inverse le classement ? Que se passe-t-il pour l’énergie si la durée double ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un appareil de 20 W fonctionne pendant 3 h. Quelle énergie consomme-t-il, en wattheures ?', type: 'nombre', unite: 'Wh', rep: 60, tol: 0,
      expl: '20 W × 3 h = 60 Wh. La puissance est une grandeur instantanée (en W) ; l’énergie cumulée dépend aussi de la durée (en Wh).' },
    critere: 'Distinguer W et Wh et expliciter la durée.',
    aides: [
      'Une puissance en watts dit ce que l’appareil demande à chaque instant ; pour l’énergie, il faut aussi la durée.',
      'Multiplie la puissance en watts par la durée en heures pour obtenir des wattheures. Garde la même unité de temps dans tout le calcul.',
      'Quand on donne une tension et une intensité, calcule d’abord la puissance (dans ce modèle, en courant continu : P = U × I).'
    ],
    synthese: 'La puissance (en watts) mesure l’énergie transférée par seconde ; l’énergie consommée est le produit de la puissance par la durée : E = P × t, en wattheures si t est en heures. Un appareil peu puissant qui fonctionne longtemps peut consommer plus qu’un appareil puissant utilisé brièvement. En courant continu, P = U × I dans ce modèle. 1 Wh = 3600 J. Sans tarif ni facteur d’émission sourcés, on ne déduit ni coût ni bilan carbone.',
    colonnes: ['Appareil', 'Durée (h)', 'Puissance (W)', 'Énergie (Wh)'], lignesVides: 5,
    lignes: function (st) { return st.essais.map(function (e) { return [e.nom, num(e.t, 1), num(e.P), num(e.E)]; }); },
    resume: function (e) { return e.nom + ' pendant ' + num(e.t, 1) + ' h : puissance ' + num(e.P) + ' W, énergie ' + num(e.E) + ' Wh'; },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var a = APP[e.app]; if (!a) return; var tag = '(' + e.nom + ', ' + num(e.t, 1) + ' h) ', Er = energieWh(a.P, e.t);
        if (a.U != null && near(e.P, a.U + a.I, 0.01)) o.push(tag + 'Ta puissance ressemble à une somme : tension et intensité se multiplient pour donner la puissance.');
        else if (a.U != null && !near(e.P, a.P, 0.01)) o.push(tag + 'Ta puissance ne correspond pas à la tension et l’intensité indiquées : relis la relation entre ces trois grandeurs.');
        if (near(e.E, a.P, 1e-9) && e.t !== 1) o.push(tag + 'Ton énergie est égale à la puissance : la durée n’est pas prise en compte.');
        else if (near(e.E, enJoules(Er), 0.5)) o.push(tag + 'Ton résultat semble être en joules : ici l’énergie est demandée en wattheures (1 Wh = 3600 J).');
        else if (near(e.P, a.P, 0.01) && near(e.E, Er, 1e-9)) o.push(tag + 'Puissance et énergie sont cohérentes avec le modèle.');
      });
      return o;
    },
    extraPrint: { titre: 'Mon classement argumenté', consigne: 'Classe les appareils par énergie consommée et propose, en une phrase argumentée, une façon de réduire la consommation.', hauteur: 150 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 420 120" role="img" aria-label="Deux barres de hauteurs différentes : la puissance d’un appareil à gauche, la durée de fonctionnement à droite, dont le produit donne l’énergie." style="width:100%;max-width:420px"><rect x="40" y="20" width="60" height="80" fill="#F97316"/><rect x="180" y="60" width="140" height="40" fill="#2E9CDB"/><text x="70" y="115" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">puissance</text><text x="250" y="115" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">durée</text></svg>'; },
    manip: manip,
    modele_: { energieWh: energieWh, enJoules: enJoules, APP: APP },
    prof: {
      reference: 'A : 60 W × 2 h = 120 Wh ; B : 15 W × 10 h = 150 Wh : le moins puissant consomme davantage ici. Récepteur D : 12 V × 0,50 A = 6 W. 1 Wh = 3600 J, donc 120 Wh = 432 000 J. Veille : 5 W × 24 h = 120 Wh ; usage actif : 100 W × 2 h = 200 Wh : la veille représente plus de la moitié de l’énergie de l’usage actif. Transfert : 20 W × 3 h = 60 Wh.',
      attendus: ['E = P × t calculée avec la durée en heures.', 'Distinction W (puissance instantanée) / Wh (énergie cumulée).', 'Doubler la durée double l’énergie.', 'P = U × I pour le récepteur continu.', 'Aucune déduction de coût ou de bilan carbone réel.'],
      erreurs: ['Comparer seulement les puissances (60 W > 15 W donc A consomme plus).', 'Écrire des W pour une énergie.', 'Additionner U et I au lieu de les multiplier.', 'Mélanger heures et secondes.'],
      limites: 'Puissances constantes ; P = U × I appliqué au courant continu dans ce modèle ; pas de tarif ni de facteur d’émission sourcé, donc aucun coût ni bilan carbone réel n’est déduit. Les profils d’usage numériques sont réduits à deux appareils synthétiques (veille permanente et usage actif). Le tarif de l’électricité (en F CFA par kWh) n’est pas inclus : le professeur peut l’apporter avec sa source. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : tableau avec colonnes P, t, E préparées. Approfondissement : calculer 120 Wh en joules, ou proposer un usage numérique et discuter ce qui manque pour estimer un bilan carbone.'
    }
  };
})();
