/* Livre vivant · 6e · Dangers des combustions.
   Moment essentiel : deux situations à risque (fuite de gaz, braséro dans la chambre) ; on choisit la bonne conduite et on voit le résultat.
   Qualitatif, simulation seule. Numéros d'urgence non affichés (varient selon le pays). */
(function () {
  'use strict';
  var V = window.Vivant;
  var ISS = V.lois.conduiteRisque = function (sit, act) {
    var T = { gaz: { flamme: 'danger', fenetre: 'ok', rien: 'danger' }, brasero: { garde: 'danger', dehors: 'ok', fenetre: 'ok' } }; return T[sit][act];
  };
  function sceneMaison(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = two ? 20 + 185 * k : 110, r = ISS(s.v.sit, s.v.act), gaz = s.v.sit === 'gaz'; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0, 70, 150, 120, col, 2.6, P.col.paper); P.poly(c, [[x0 - 8, 70], [x0 + 75, 25], [x0 + 158, 70]], col, 2.6);
      P.rect(c, x0 + 60, 160, 30, 30, P.col.ink, 2, P.col.fill); P.txt(c, gaz ? 'gaz' : 'braséro', x0 + 75, 176, 10, P.col.ink, 'center', 800);
      if (s.v.act === 'fenetre') { P.rect(c, x0 + 15, 90, 30, 30, P.col.a, 2, '#CFE6FF'); P.txt(c, 'fenêtre ouverte', x0 + 30, 132, 10, P.col.a, 'center'); }
      if (r === 'danger') { P.txt(c, gaz ? (s.v.act === 'flamme' ? 'EXPLOSION POSSIBLE' : 'fuite : gaz qui s’accumule') : 'monoxyde de carbone', x0 + 75, 100, 11, P.col.hot, 'center', 800); P.txt(c, '⚠', x0 + 120, 130, 22, P.col.hot, 'center', 800); }
      else P.txt(c, '✓ bonne conduite', x0 + 75, 100, 12, P.col.ok, 'center', 800);
      if (s.v.act === 'dehors') P.txt(c, 'braséro dehors', x0 + 75, 212, 11, P.col.ok, 'center', 800);
      if (two) P.txt(c, s.nom, x0 + 75, 14, 12, col, 'center', 800); c.restore();
    });
  }
  var LAB = { w: 380, h: 250, scene: sceneMaison, live: false, notrace: true, sound: function (v) { return ISS(v.sit, v.act) === 'ok' ? 420 : 140; } };
  function lig(v) { var r = ISS(v.sit, v.act); return r === 'ok' ? ['<b>Bonne conduite</b>', 'Le risque est écarté.'] : v.sit === 'gaz' ? ['<b>Danger : gaz qui s’accumule</b>', 'Jamais de flamme ni d’étincelle : on ouvre les fenêtres, on ferme le robinet.'] : ['<b>Danger : monoxyde de carbone</b>', 'Invisible et sans odeur : on sort et on aère.']; }
  V.add({
    slug: 'dangers-combustions', defiTitre: 'Les dangers des combustions : le défi',
    chap: [
      { titre: 'Fuite de gaz', labTitre: 'Une odeur de gaz', cur: 'Que fait Awa si elle sent une odeur de gaz dans la cuisine ?',
        paras: ['Une fuite de gaz est dangereuse : le gaz s’accumule et peut exploser à la moindre flamme ou étincelle.', 'Bonne conduite : pas de flamme, pas d’interrupteur, on ouvre les fenêtres, on ferme le robinet et on prévient un adulte.'],
        loi: { t: 'Fuite de gaz : ni flamme ni étincelle', s: 'ouvrir les fenêtres, fermer le robinet' }, note: 'Simulation : choisis ce que fait Awa.',
        predis: { q: 'Odeur de gaz. Awa…', opts: ['allume une allumette pour voir', 'ouvre les fenêtres', 'attend'], a: 1, rep: 'Elle ouvre les fenêtres et ferme le robinet : pas de flamme.' },
        verif: { q: 'en cas de fuite de gaz, on évite…', o: ['les flammes et étincelles', 'd’ouvrir les fenêtres', 'de fermer le robinet'], a: 0, e: 'Le gaz peut exploser.' },
        lab: Object.assign({}, LAB, { alt: 'Maison avec une fuite de gaz', read: lig, sit: [{ nom: '', vars: { sit: 'gaz' } }], choices: [{ id: 'act', label: 'Conduite', opts: [['rien', 'Attendre'], ['flamme', 'Allumer une flamme'], ['fenetre', 'Ouvrir les fenêtres']], val: 'rien' }] }) },
      { titre: 'Braséro dans la chambre', labTitre: 'Charbon et monoxyde de carbone', cur: 'Pourquoi ne garde-t-on jamais un braséro allumé dans une chambre fermée ?',
        paras: ['Le charbon qui brûle dans une pièce fermée manque de dioxygène : il produit du monoxyde de carbone.', 'Ce gaz est invisible, sans odeur et toxique. On place le braséro dehors et on aère.'],
        loi: { t: 'Braséro : jamais dans une pièce fermée', s: 'on sort, on aère' }, note: 'Compare en alternance : deux conduites possibles.',
        predis: { q: 'Un braséro allumé dans une chambre fermée est dangereux car il produit…', opts: ['du monoxyde de carbone', 'de l’eau pure', 'du diazote'], a: 0, rep: 'Du monoxyde de carbone : invisible et sans odeur.' },
        verif: { q: 'bonne conduite avec un braséro…', o: ['le placer dehors', 'le garder en chambre', 'fermer la porte'], a: 0, e: 'Dehors, à l’air libre.' },
        lab: Object.assign({}, LAB, { alt: 'Deux maisons avec un braséro', read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sit: [{ nom: 'Chambre fermée', vars: { sit: 'brasero' } }, { nom: 'Chambre aérée', vars: { sit: 'brasero' } }], choices: [{ id: 'act', label: 'Conduite', opts: [['garde', 'Le garder'], ['fenetre', 'Ouvrir la fenêtre'], ['dehors', 'Le mettre dehors']], val: 'garde', per: true }] }) }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, quelle conduite écarte le risque de la fuite de gaz ?', o: ['Ouvrir les fenêtres et fermer le robinet', 'Allumer la lumière', 'Craquer une allumette'], a: 0, e: 'Pas de flamme ni d’étincelle.' },
        { type: 'qcm', q: 'Kofi a un malaise près d’un braséro allumé dans la chambre. Que faire ?', o: ['Sortir et aérer, prévenir un adulte', 'Se coucher', 'Fermer la fenêtre'], a: 0, e: 'Monoxyde de carbone : air frais et secours.' }
      ];
    }
  });
})();
