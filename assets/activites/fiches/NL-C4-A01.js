/* NL-C4-A01 — Le colis à trois compartiments · 5e · États et propriétés · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche A01. Modèle macroscopique qualitatif : sans granularité ni capillarité ; pas de compression visible du liquide dans la plage scolaire. */
(function () {
  var h = Activite.h, esc = Activite.esc, num = Activite.num;
  var CONT = { bloc: { n: 'Le bloc solide' }, eau: { n: 'L’eau' }, air: { n: 'L’air' } };
  var FORMES = { bloc: 'propre', eau: 'recipient', air: 'recipient' }, OCC = { bloc: 'garde', eau: 'bas', air: 'tout' }, COMP = { bloc: 'non', eau: 'non', air: 'oui' };
  var LF = { propre: 'garde sa forme propre', recipient: 'prend la forme du récipient' }, LO = { garde: 'occupe le même espace', bas: 'reste en bas, surface horizontale', tout: 'occupe tout l’espace disponible' }, LC = { oui: 'se comprime', non: 'ne se comprime pas visiblement' };
  var RECIP = { haut: { n: 'Récipient haut et étroit', w: 70, h: 150 }, large: { n: 'Récipient large et bas', w: 170, h: 80 }, ballon: { n: 'Récipient de forme irrégulière', w: 120, h: 110 } };
  var VOL = 100; // mL
  function volAffiche(c, comprime) { return c === 'air' && comprime ? 60 : VOL; }
  function manip(panel, X) {
    var F = window.FICHE_A01, st = X.st(), c = 'eau', r = 'haut', comp = false;
    var g = h('div', { class: 'grid2' }, panel), L = h('div', { class: 'card' }, g), R = h('div', { class: 'card' }, g);
    h('h3', { text: 'Le colis' }, L); var host = h('div', { style: 'text-align:center' }, L);
    h('label', { for: 'cont', text: 'Contenu :' }, R); var sc = h('select', { id: 'cont' }, R, Object.keys(CONT).map(function (k) { return '<option value="' + k + '">' + CONT[k].n + ' (' + VOL + ' mL)</option>'; }).join(''));
    h('label', { for: 'rec', text: 'Récipient où l’on transfère :' }, R); var sr = h('select', { id: 'rec' }, R, Object.keys(RECIP).map(function (k) { return '<option value="' + k + '">' + RECIP[k].n + '</option>'; }).join(''));
    var cb = h('button', { class: 'btn', type: 'button' }, R), info = h('p', { 'aria-live': 'polite', style: 'font-weight:700' }, R);
    var sep = h('h4', { text: 'Ce que j’observe' }, R);
    var d = {};
    [['forme', 'Forme du contenu', LF], ['occ', 'Occupation du récipient', LO], ['comp', 'Effet de la compression', LC]].forEach(function (x) {
      h('label', { for: 'o_' + x[0], text: x[1] + ' :' }, R); d[x[0]] = h('select', { id: 'o_' + x[0] }, R, '<option value="">— choisir —</option>' + Object.keys(x[2]).map(function (k) { return '<option value="' + k + '">' + x[2][k] + '</option>'; }).join(''));
    });
    var msg = h('div', { class: 'msg bad', role: 'alert', hidden: '' }, R), bn = h('button', { class: 'btn primary', type: 'button', text: 'Noter dans mon tableau' }, R);
    var aid = h('button', { class: 'btn', type: 'button', text: 'Besoin d’une aide ?' }, panel), aidBox = h('div', { class: 'msg', hidden: '', 'aria-live': 'polite' }, panel);
    aid.onclick = function () { aidBox.hidden = false; aidBox.textContent = st.essais.length ? X.aide() : 'L’aide est disponible après ton premier enregistrement : essaie d’abord seul.'; };
    var res = h('div', { class: 'card' }, panel); h('h3', { text: 'Mon tableau' }, res); var tbl = h('div', { style: 'overflow-x:auto', tabindex: '0', role: 'region', 'aria-label': 'Tableau, défile horizontalement' }, res);
    function table() { tbl.innerHTML = X.tableHTML(F, F.lignes(st), 'Observations simulées — modèle ' + F.modele); }
    function draw() {
      var R0 = RECIP[r], W = R0.w, H = R0.h, x0 = 110 - W / 2, y0 = 190 - H, fill = '';
      if (c === 'eau') fill = '<rect x="' + (x0 + 2) + '" y="' + (190 - H * 0.55) + '" width="' + (W - 4) + '" height="' + (H * 0.55 - 2) + '" fill="rgba(79,168,255,.5)"/><line x1="' + (x0 + 2) + '" x2="' + (x0 + W - 2) + '" y1="' + (190 - H * 0.55) + '" y2="' + (190 - H * 0.55) + '" stroke="#2E9CDB" stroke-width="3"/>';
      else if (c === 'air') fill = '<rect x="' + (x0 + 2) + '" y="' + (y0 + 2) + '" width="' + (W - 4) + '" height="' + (H - 4) + '" fill="rgba(200,210,230,.25)"/>' + [1, 2, 3, 4, 5, 6].map(function (k) { return '<circle cx="' + (x0 + 12 + (k * 37) % (W - 24)) + '" cy="' + (y0 + 12 + (k * 53) % (H - 24)) + '" r="3" fill="var(--mist)"/>'; }).join('');
      else fill = '<rect x="' + (110 - 30) + '" y="' + (190 - 50) + '" width="60" height="48" fill="#B0B8C4" stroke="#0B1220" stroke-width="2"/>';
      var piston = c === 'air' && comp ? '<rect x="' + (x0 + 2) + '" y="' + (y0 + 2) + '" width="' + (W - 4) + '" height="' + ((H - 4) * 0.4) + '" fill="#5B6B88"/><text x="110" y="' + (y0 + 20) + '" text-anchor="middle" font-size="11" fill="#fff" font-family="sans-serif">piston</text>' : '';
      host.innerHTML = '<svg viewBox="0 0 220 200" role="img" aria-label="' + CONT[c].n + ' transféré dans : ' + RECIP[r].n + '. ' + (c === 'eau' ? 'L’eau reste en bas, avec une surface horizontale.' : c === 'air' ? 'L’air occupe tout le récipient' + (comp ? ', un piston le comprime.' : '.') : 'Le bloc garde sa forme.') + '" style="width:100%;max-width:300px"><rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="none" stroke="var(--glass)" stroke-width="3"/>' + fill + piston + '</svg>';
      info.textContent = CONT[c].n + ' : ' + num(volAffiche(c, comp), 0) + ' mL' + (c === 'air' && comp ? ' (comprimé)' : '');
      cb.textContent = comp ? 'Relâcher le piston' : 'Comprimer le volume enfermé'; cb.disabled = c === 'bloc' ? false : false;
    }
    sc.onchange = function () { c = sc.value; comp = false; draw(); }; sr.onchange = function () { r = sr.value; draw(); };
    cb.onclick = function () { comp = !comp; if (c !== 'air') { info.textContent = CONT[c].n + ' : ' + num(VOL, 0) + ' mL (aucun changement visible quand on comprime)'; comp = false; draw(); info.textContent = CONT[c].n + ' : ' + num(VOL, 0) + ' mL — aucun changement visible à la compression'; return; } draw(); };
    bn.onclick = function () { var f = d.forme.value, o = d.occ.value, k = d.comp.value; if (!f || !o || !k) { msg.hidden = false; msg.textContent = 'Complète les trois observations avant d’enregistrer.'; return; } msg.hidden = true; X.addEssai({ c: c, nom: CONT[c].n, r: r, forme: f, occ: o, comp: k }); table(); };
    table(); draw();
  }
  window.FICHE_A01 = {
    id: 'NL-C4-A01', version: '1.0', modele: 'etats-macroscopique-1.0',
    titre: 'Le colis à trois compartiments', niveau: '5e', chapitre: 'États et propriétés',
    objectif: 'Caractériser solide, liquide et gaz à partir de leurs propriétés.',
    objectifEleve: 'Décrire un solide, un liquide et un gaz avec des propriétés observables, et savoir les distinguer.',
    materiel: 'Un bloc solide, de l’eau, de l’air, plusieurs récipients, une seringue (piston).',
    situation: 'Un kit contient un bloc solide, de l’eau et de l’air. Peut-on transférer les trois contenus dans un récipient de forme différente en conservant leur forme et leur volume ?',
    prevision: { consigne: 'Dessine sur ta fiche les contenus après transfert dans un récipient de forme différente, puis indique lequel occupera tout l’espace disponible.', choix: [['bloc', 'Le bloc solide'], ['eau', 'L’eau'], ['air', 'L’air'], ['inconnu', 'Je ne sais pas']] },
    protocole: ['Transférer successivement chaque contenu dans les récipients.', 'Observer la forme et l’espace occupé.', 'Comprimer le volume enfermé de chaque contenu.', 'Noter les observations dans le tableau.'],
    variable: 'Contenu et récipient', maintenu: 'Quantité de chaque contenu',
    confrontation: 'Compare chaque dessin avec les observations. Quel test permet de distinguer un liquide d’un gaz ?',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Un tas de sable épouse la forme d’un récipient. Suffit-il de dire que le sable est un liquide ?', options: [['non', 'Non : chaque grain est un solide ; c’est le tas qui s’écoule'], ['oui', 'Oui : il prend la forme du récipient'], ['gaz', 'Non : c’est un gaz']], rep: 'non',
      expl: 'Non : à l’échelle du grain, le sable est solide. Le tas s’écoule parce que les grains glissent les uns sur les autres : il faut préciser l’échelle d’observation et utiliser plus d’une propriété.' },
    critere: 'Utiliser au moins deux propriétés et distinguer l’échelle du grain de celle du tas.',
    aides: ['Compare ce qui se passe pour chaque contenu quand tu changes de récipient : sa forme change-t-elle ? l’espace occupé change-t-il ?', 'Pour distinguer un liquide d’un gaz, pense à l’espace occupé et à ce qui arrive quand on comprime.', 'Une seule propriété ne suffit pas : cherche un deuxième critère pour chaque état.'],
    synthese: 'Le solide garde sa forme propre. Le liquide prend la forme du récipient, garde à peu près le même volume et sa surface libre au repos est horizontale. Le gaz occupe tout l’espace disponible et peut être comprimé. Une seule propriété ne suffit pas pour classer : il faut en utiliser au moins deux, et préciser l’échelle d’observation (grain ou tas).',
    colonnes: ['Contenu', 'Récipient', 'Forme', 'Occupation', 'Compression'], lignesVides: 4,
    lignes: function (st) { return st.essais.map(function (e) { return [e.nom, RECIP[e.r].n, LF[e.forme], LO[e.occ], LC[e.comp]]; }); },
    resume: function (e) { return e.nom + ' (' + RECIP[e.r].n + ') : ' + LF[e.forme] + ', ' + LO[e.occ] + ', ' + LC[e.comp]; },
    diagnostic: function (st) {
      var o = [];
      st.essais.forEach(function (e) {
        var bad = []; if (e.forme !== FORMES[e.c]) bad.push('la forme'); if (e.occ !== OCC[e.c]) bad.push('l’occupation du récipient'); if (e.comp !== COMP[e.c]) bad.push('l’effet de la compression');
        o.push('(' + e.nom + ') ' + (bad.length ? 'Revois ' + bad.join(', ') + ' : refais le transfert et observe.' : 'Tes trois observations sont cohérentes avec le modèle.'));
      });
      var vus = {}; st.essais.forEach(function (e) { vus[e.c] = 1; }); if (Object.keys(vus).length < 3 && st.essais.length) o.push('Tu n’as pas encore étudié les trois contenus : le classement demande de les comparer.');
      return o;
    },
    extraPrint: { titre: 'Dessins avant et après le transfert', consigne: 'Dessine chaque contenu dans son récipient d’origine puis dans un récipient de forme différente.', hauteur: 170 },
    illustration: function (host) { host.innerHTML = '<svg viewBox="0 0 420 110" role="img" aria-label="Trois contenants : un bloc, de l’eau et de l’air." style="width:100%;max-width:460px"><rect x="20" y="30" width="80" height="70" fill="none" stroke="var(--glass)" stroke-width="3"/><rect x="40" y="60" width="40" height="40" fill="#B0B8C4"/><rect x="160" y="30" width="80" height="70" fill="none" stroke="var(--glass)" stroke-width="3"/><rect x="162" y="60" width="76" height="38" fill="rgba(79,168,255,.5)"/><rect x="300" y="30" width="80" height="70" fill="none" stroke="var(--glass)" stroke-width="3"/></svg>'; },
    manip: manip,
    modele_: { FORMES: FORMES, OCC: OCC, COMP: COMP, volAffiche: volAffiche, VOL: VOL },
    pedagogie: {
      "theme": "A",
      "attendu": 0,
      "connaissance": "Caractériser les différents états de la matière (solide, liquide et gaz) à partir de leurs propriétés.",
      "competences": [["demarche","hypothese"]],
      "objectifs": [
        {
          "id": "O1",
          "objectif": "Caractériser solide, liquide et gaz par leur forme et leur occupation de l’espace.",
          "eleve": "Je sais décrire un solide, un liquide et un gaz avec leurs propriétés.",
          "savoirFaire": [
            "Observer la forme propre ou non",
            "Observer l’occupation du récipient"
          ],
          "indicateur": "Le tableau consigne forme et occupation pour chaque contenu.",
          "preuve": "Tableau"
        },
        {
          "id": "O2",
          "objectif": "Utiliser au moins deux propriétés pour classer.",
          "eleve": "Je sais classer un contenu en utilisant plus d’une propriété.",
          "savoirFaire": [
            "Combiner deux propriétés observées",
            "Éviter de classer d’après un seul indice"
          ],
          "indicateur": "Chaque classement cite deux propriétés.",
          "preuve": "Conclusion"
        },
        {
          "id": "O3",
          "objectif": "Distinguer l’échelle du grain de celle du tas.",
          "eleve": "Je sais dire pourquoi un tas de grains peut sembler couler sans être un liquide.",
          "savoirFaire": [
            "Changer d’échelle d’observation",
            "Préciser ce qui est solide"
          ],
          "indicateur": "Le transfert distingue grain et tas.",
          "preuve": "Transfert"
        }
      ]
    },
  };
})();
