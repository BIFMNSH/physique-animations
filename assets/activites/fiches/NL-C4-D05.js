/* NL-C4-D05 — Deux capteurs dans le couloir · 4e · Vitesse du son · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche D05. Socle : simulation vitesse-son (non modifiée).
   Modèle : propagation alignée, air homogène, v = 340 m/s ; t1 = 4,0 ms (source à 1,36 m du capteur 1), t2 = t1 + d/v. Mesures synthétiques. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var C = 340, T1 = 4.0, DIST = [1.7, 3.4, 6.8];
  function t2(d) { return Math.round((T1 + 1000 * d / C) * 10) / 10; }  // ms, arrondi au dixième
  function delai(d) { return Math.round((t2(d) - T1) * 10) / 10; }          // ms
  function parse(x) { var n = parseFloat(String(x).replace(',', '.')); return isFinite(n) ? n : null; }
  function near(a, b, tol) { return a != null && Math.abs(a - b) <= tol; }
  function manip(panel, X) {
    var F = window.FICHE_D05, st = X.st(), d = 3.4, emis = false;
    var c1 = h('div', { class: 'card' }, panel); h('h3', { text: 'Le couloir' }, c1);
    h('label', { for: 'dist', text: 'Distance entre les deux capteurs :' }, c1);
    var sel = h('select', { id: 'dist' }, c1, DIST.map(function (x) { return '<option value="' + x + '"' + (x === 3.4 ? ' selected' : '') + '>' + num(x, 2) + ' m</option>'; }).join(''));
    var host = h('div', {}, c1);
    var row = h('div', { class: 'row' }, c1), bEm = h('button', { class: 'btn', type: 'button', text: 'Émettre l’impulsion' }, row);
    var rd = h('output', { class: 'bal', 'aria-live': 'polite', style: 'display:block;text-align:center;font-size:22px;min-width:0;margin:8px 0' }, c1, 'Aucune impulsion émise.');
    function draw() {
      var xs = 60 + 0, x1 = 150, x2 = 150 + Math.min(300, d * 45);
      host.innerHTML = '<svg viewBox="0 0 560 120" role="img" aria-label="Un couloir vu de dessus : une source sonore à gauche, puis deux capteurs alignés, séparés de ' + num(d, 2) + ' mètres. Le son se propage de gauche à droite." style="width:100%;max-width:620px"><rect x="20" y="40" width="520" height="40" fill="none" stroke="var(--mist)" stroke-dasharray="4 4"/><circle cx="' + xs + '" cy="60" r="12" fill="#F97316"/><text x="' + xs + '" y="100" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">source</text><rect x="' + (x1 - 8) + '" y="48" width="16" height="24" fill="#5B6B88"/><text x="' + x1 + '" y="36" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">capteur 1</text><rect x="' + (x2 - 8) + '" y="48" width="16" height="24" fill="#5B6B88"/><text x="' + x2 + '" y="36" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">capteur 2</text><line x1="' + x1 + '" x2="' + x2 + '" y1="100" y2="100" stroke="var(--ink)" stroke-width="2"/><text x="' + ((x1 + x2) / 2) + '" y="116" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="sans-serif">' + num(d, 2) + ' m</text></svg>';
      rd.textContent = emis ? 'Capteur 1 : ' + num(T1) + ' ms · Capteur 2 : ' + num(t2(d)) + ' ms' : 'Aucune impulsion émise.';
    }
    sel.onchange = function () { d = Number(sel.value); emis = false; draw(); };
    bEm.onclick = function () { emis = true; draw(); };
    var c2 = h('div', { class: 'card' }, panel); h('h3', { text: 'Je calcule la vitesse' }, c2);
    h('p', {}, c2, 'Émets l’impulsion, lis les deux horodatages, puis complète chaque étape avec ses unités (virgule ou point accepté).');
    var rows = [['t1', 'Horodatage du capteur 1', 'ms'], ['t2', 'Horodatage du capteur 2', 'ms'], ['dl', 'Délai entre les capteurs, en secondes', 's'], ['v', 'Vitesse déduite', 'm/s']];
    h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, c2, '<table class="t"><thead><tr><th scope="col">Étape</th><th scope="col">Ma valeur</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><th scope="row" style="font-weight:700;text-align:left">' + esc(r[1]) + ' (' + r[2] + ')</th><td><input type="text" inputmode="decimal" autocomplete="off" id="c_' + r[0] + '" aria-label="' + esc(r[1]) + ' en ' + (r[2] === 'ms' ? 'millisecondes' : r[2] === 's' ? 'secondes' : 'mètres par seconde') + '" style="width:110px"></td></tr>'; }).join('') + '</tbody></table>');
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, c2), note = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, c2);
    var bRec = h('button', { class: 'btn primary', type: 'button', text: 'Enregistrer mon calcul dans mon tableau' }, c2);
    bRec.onclick = function () {
      if (!emis) { msg.hidden = false; msg.textContent = 'Émets d’abord l’impulsion pour lire les horodatages.'; return; }
      var v = {}, ok = true; rows.forEach(function (r) { v[r[0]] = parse(panel.querySelector('#c_' + r[0]).value); if (v[r[0]] === null) ok = false; });
      if (!ok) { msg.hidden = false; msg.textContent = 'Complète les quatre étapes avec des nombres avant d’enregistrer.'; return; }
      msg.hidden = true; X.addEssai({ dist: d, t1: v.t1, t2: v.t2, dl: v.dl, v: v.v, lu1: T1, lu2: t2(d) }); table();
      note.hidden = false; note.textContent = 'Calcul enregistré. Change la distance et recommence : que devient le délai, que devient la vitesse ?';
    };
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Relevés simulés et calculs de l’élève — modèle ' + F.modele); }
    table(); draw();
  }
  window.FICHE_D05 = {
    id: 'NL-C4-D05', version: '1.0', modele: 'son-deux-capteurs-1.0',
    titre: 'Deux capteurs dans le couloir', niveau: '4e', chapitre: 'Vitesse du son',
    objectif: 'Déterminer une vitesse à partir d’une distance et d’un délai.',
    objectifEleve: 'Calculer la vitesse du son avec la distance entre deux capteurs et le délai qui sépare leurs détections.',
    materiel: 'Deux capteurs sonores alignés dans un couloir, une source, un chronomètre électronique.',
    situation: 'Deux capteurs séparés de 3,40 m reçoivent la même impulsion à 10,0 ms d’intervalle. Quelle vitesse déduire ?',
    prevision: { consigne: 'Avant tout calcul, indique de quelle distance tu auras besoin et comment tu obtiendras la durée.', choix: [['entre', 'La distance entre les deux capteurs, et la différence des deux horodatages'], ['source', 'La distance source–capteur 2, et l’horodatage du capteur 2'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Lire les deux horodatages.', 'Soustraire pour obtenir le délai.', 'Convertir les millisecondes en secondes.', 'Calculer la vitesse avec la distance entre les capteurs.', 'Refaire avec une autre distance.'],
    variable: 'Distance entre les capteurs', maintenu: 'Même source, même couloir, air homogène',
    confrontation: 'Compare tes quotients pour les différentes distances. Que se passe-t-il pour le délai quand la distance double ? Une petite erreur sur le délai change-t-elle beaucoup le résultat ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Dans ce modèle, quel délai attend-on entre deux capteurs séparés de 1,70 m ?', type: 'nombre', unite: 'ms', rep: 5, tol: 0.1,
      expl: 'Le délai est proportionnel à la distance : 1,70 m est la moitié de 3,40 m, donc le délai est la moitié de 10,0 ms, soit 5,0 ms (1,70 ÷ 340 = 0,0050 s).' },
    critere: 'Choisir la distance et la durée correspondantes, avec conversion.',
    aides: [
      'La durée utile n’est pas l’horodatage d’un seul capteur : c’est le temps qui sépare les deux détections.',
      'Convertis 1 ms en 0,001 s avant de diviser la distance par la durée.',
      'Le son va dans un seul sens entre les deux capteurs : la distance à utiliser est celle qui sépare les capteurs, sans la multiplier ni la diviser par deux.'
    ],
    synthese: 'La vitesse est le quotient de la distance parcourue par la durée du parcours. Entre deux capteurs alignés, la distance est celle qui les sépare et la durée est la différence des deux horodatages, convertie en secondes. Ce trajet n’est pas un aller-retour. Si la distance double, le délai double et le quotient reste le même dans ce modèle.',
    colonnes: ['Distance (m)', 'Horodatage 1 (ms)', 'Horodatage 2 (ms)', 'Délai (s)', 'Vitesse (m/s)'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [num(e.dist, 2), num(e.t1), num(e.t2), num(e.dl, 4), num(e.v)]; }); },
    resume: function (e) { return 'Distance ' + num(e.dist, 2) + ' m : horodatages ' + num(e.t1) + ' ms et ' + num(e.t2) + ' ms, délai ' + num(e.dl, 4) + ' s, vitesse ' + num(e.v) + ' m/s'; },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var tag = '(' + num(e.dist, 2) + ' m) ', dl = delai(e.dist) / 1000, v = e.dist / dl;
        if (near(e.t1, T1, 0.05) === false || near(e.t2, t2(e.dist), 0.05) === false) o.push(tag + 'Tes horodatages ne correspondent pas à ceux affichés : relis-les sur le simulateur.');
        if (near(e.dl, delai(e.dist), 0.05)) o.push(tag + 'Ton délai est resté en millisecondes : convertis en secondes (1 ms = 0,001 s) avant de calculer la vitesse.');
        else if (near(e.dl, t2(e.dist) / 1000, 1e-5)) o.push(tag + 'Ton délai est l’horodatage du capteur 2 : il faut soustraire l’horodatage du capteur 1 pour obtenir le temps qui sépare les deux détections.');
        if (near(e.v, 2 * v, 1)) o.push(tag + 'Ta vitesse est le double de la valeur attendue : le son ne fait pas d’aller-retour entre les capteurs, ne double pas la distance.');
        if (near(e.v, v / 1000, 0.01) || near(e.v, v * 1000, 1)) o.push(tag + 'Ta vitesse est trop petite ou trop grande d’un facteur mille : vérifie la conversion ms → s.');
        if (near(e.dl, dl, 1e-5) && near(e.v, v, 3)) o.push(tag + 'Délai et vitesse sont cohérents avec le modèle.');
      });
      return o;
    },
    extraPrint: { titre: 'Schéma du couloir', consigne: 'Dessine la source, les deux capteurs, la distance qui les sépare et le sens de propagation du son.', hauteur: 150 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 560 90" role="img" aria-label="Un couloir avec une source à gauche et deux capteurs alignés." style="width:100%;max-width:560px"><rect x="20" y="25" width="520" height="40" fill="none" stroke="var(--mist)" stroke-dasharray="4 4"/><circle cx="60" cy="45" r="12" fill="#F97316"/><rect x="142" y="33" width="16" height="24" fill="#5B6B88"/><rect x="302" y="33" width="16" height="24" fill="#5B6B88"/></svg>'; },
    manip: manip,
    modele_: { t2: t2, delai: delai, C: C, T1: T1 },
    prof: {
      reference: '3,40 m ÷ 0,0100 s = 340 m/s ; avec 6,80 m le délai est 20,0 ms et la vitesse reste 340 m/s. Transfert : 1,70 m → 5,0 ms. Le délai entre capteurs n’est pas un aller-retour.',
      attendus: ['Délai = différence des horodatages (10,0 ms), pas l’horodatage du capteur 2.', 'Conversion 10,0 ms = 0,0100 s.', 'Distance = séparation des capteurs, sans doubler.', 'Constat : délai proportionnel à la distance, quotient constant.'],
      erreurs: ['Utiliser l’horodatage du capteur 2 (14,0 ms) comme durée.', 'Laisser le délai en ms avec une distance en m.', 'Doubler la distance comme dans un écho.'],
      limites: 'Mesures synthétiques arrondies à 0,1 ms ; propagation alignée dans un air homogène, vitesse fixée à 340 m/s, source supposée alignée avec les capteurs. L’incertitude de mesure n’est pas modélisée : la discussion sur « l’influence d’une petite erreur » est qualitative. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : tableau de calcul étape par étape sans résultat final. Approfondissement : changer le milieu ou discuter une erreur de 0,5 ms sur le délai.'
    }
  };
})();
