/* Livre vivant · 4e · Dangers du courant du secteur (220 V).
   Moment essentiel : on choisit un geste ; on voit s'il est sûr ou s'il expose à un contact avec une partie sous tension.
   Chapitre 2 : un disjoncteur différentiel coupe le courant en cas de fuite. Qualitatif, simulation seule ; aucun seuil chiffré affiché. */
(function () {
  'use strict';
  var V = window.Vivant;
  var risque = V.lois.risqueSecteur = function (geste, mains) {
    if (geste === 'fil') return 'danger'; if (mains === 'mouillees' && geste !== 'rien') return 'danger'; return 'ok';
  };
  var disj = V.lois.coupeDisjoncteur = function (prot, fuite) { return fuite === 'oui' && prot === 'avec'; };
  function main(c, P, x, y, mouillee, col) { P.circ(c, x, y, 14, col, 2.2, '#F2C9A5'); if (mouillee) for (var i = 0; i < 3; i++) P.circ(c, x - 12 + i * 12, y - 22 - (i % 2) * 6, 3, P.col.a, 1.4, 'rgba(80,150,230,.5)'); }
  function scenePrise(c, X) {
    var P = X.P, s = X.S[0].v, r = risque(s.geste, s.mains);
    P.rect(c, 230, 70, 80, 90, P.col.ink, 2.6, P.col.fill); P.circ(c, 255, 115, 5, P.col.ink, 2, P.col.paper); P.circ(c, 285, 115, 5, P.col.ink, 2, P.col.paper); P.txt(c, '220 V', 270, 55, 13, P.col.hot, 'center', 800);
    if (s.geste === 'fil') P.line(c, 150, 115, 230, 115, P.col.hot, 4); else if (s.geste === 'fiche') P.rect(c, 170, 105, 55, 20, P.col.ink, 2.4, '#C9BFA6');
    if (s.geste !== 'rien') main(c, P, 120, 115, s.mains === 'mouillees', r === 'danger' ? P.col.hot : P.col.ok);
    P.txt(c, s.geste === 'fil' ? 'fil dénudé' : s.geste === 'fiche' ? 'on débranche par la fiche' : 'on ne touche à rien', 160, 185, 12, P.col.ink, 'center', 800);
    P.txt(c, r === 'danger' ? '⚠ DANGER : risque d’électrisation' : '✓ geste sûr', 190, 24, 14, r === 'danger' ? P.col.hot : P.col.ok, 'center', 800);
  }
  function sceneDisj(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 20 + k * 185, f = s.v.fuite === 'oui', cut = disj(s.v.prot, s.v.fuite); c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0, 60, 60, 30, col, 2.4, s.v.prot === 'avec' ? '#CFE6FF' : P.col.paper); P.txt(c, s.v.prot === 'avec' ? 'disjoncteur' : 'sans', x0 + 30, 75, 10, col, 'center', 800);
      P.line(c, x0 + 60, 75, x0 + 120, 75, cut ? P.col.soft : P.col.hot, 3); if (cut) P.txt(c, '✕', x0 + 90, 75, 16, P.col.ok, 'center', 800);
      P.rect(c, x0 + 120, 55, 40, 40, col, 2.4, P.col.fill); P.txt(c, 'appareil', x0 + 140, 75, 10, col, 'center'); if (f) P.line(c, x0 + 140, 95, x0 + 140, 140, P.col.hot, 2.4);
      P.txt(c, f ? (cut ? 'courant coupé' : 'DANGER : fuite') : 'tout va bien', x0 + 90, 175, 13, f && !cut ? P.col.hot : P.col.ok, 'center', 800); P.txt(c, s.nom, x0 + 90, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'dangers-secteur', defiTitre: 'Les dangers du secteur : le défi',
    chap: [
      { titre: 'Gestes sûrs', labTitre: 'À la prise de courant', cur: 'Pourquoi ne touche-t-on jamais un fil dénudé ni une prise avec les mains mouillées ?',
        paras: ['La tension du secteur (220 V) est dangereuse : le courant peut traverser le corps (électrisation).', 'On ne touche jamais un fil dénudé. On a les mains sèches. On débranche en tirant sur la fiche, pas sur le câble.'],
        loi: { t: 'Secteur 220 V : dangereux', s: 'mains sèches · pas de fil dénudé · tirer la fiche' }, note: 'Simulation : choisis un geste et l’état des mains.',
        predis: { q: 'Pour débrancher un appareil, Awa…', opts: ['tire sur la fiche, mains sèches', 'tire sur le câble', 'touche les broches'], a: 0, rep: 'Elle tire sur la fiche avec les mains sèches.' },
        verif: { q: 'l’eau rend le contact avec le secteur…', o: ['plus dangereux', 'moins dangereux', 'sans effet'], a: 0, e: 'Mains mouillées : plus dangereux.' },
        lab: { w: 380, h: 220, alt: 'Prise de courant, main et fil', scene: scenePrise, live: false, notrace: true, sit: [{ nom: '', vars: {} }],
          choices: [{ id: 'geste', label: 'Geste', opts: [['rien', 'Ne rien toucher'], ['fiche', 'Tirer la fiche'], ['fil', 'Toucher un fil dénudé']], val: 'rien' }, { id: 'mains', label: 'Mains', opts: [['seches', 'Sèches'], ['mouillees', 'Mouillées']], val: 'seches' }],
          read: function (v) { return risque(v.geste, v.mains) === 'danger' ? ['<b>Danger : risque d’électrisation</b>', 'Ne jamais toucher une partie sous tension.'] : ['<b>Geste sûr</b>']; }, sound: function (v) { return risque(v.geste, v.mains) === 'danger' ? 130 : 420; } } },
      { titre: 'Le disjoncteur différentiel', labTitre: 'Une fuite de courant', cur: 'Comment une installation se protège-t-elle d’une fuite de courant ?',
        paras: ['Un disjoncteur différentiel coupe le courant dès qu’il détecte une fuite.', 'Sans protection, la fuite peut traverser une personne qui touche l’appareil.'],
        loi: { t: 'Disjoncteur différentiel : coupe en cas de fuite', s: 'protège les personnes' }, note: 'Compare une installation avec et sans protection.',
        predis: { q: 'Une fuite apparaît. Avec un disjoncteur différentiel, le courant…', opts: ['est coupé', 'continue', 'augmente'], a: 0, rep: 'Il est coupé.' },
        verif: { q: 'le disjoncteur différentiel protège…', o: ['les personnes', 'seulement les murs', 'personne'], a: 0, e: 'Il protège les personnes.' },
        lab: { w: 380, h: 220, alt: 'Installation avec ou sans disjoncteur différentiel', scene: sceneDisj, live: false, notrace: true, sit: [{ nom: 'Sans protection', vars: { prot: 'sans' } }, { nom: 'Avec disjoncteur', vars: { prot: 'avec' } }],
          choices: [{ id: 'fuite', label: 'Fuite de courant', opts: [['non', 'Non'], ['oui', 'Oui']], val: 'oui' }],
          read: function (v) { return v.fuite === 'non' ? ['Pas de fuite : tout va bien'] : [disj(v.prot, v.fuite) ? 'Courant coupé : personne en danger' : 'DANGER : la fuite reste active']; }, sound: function (v) { return disj(v.prot, v.fuite) ? 420 : 130; } } }
    ],
    manches: function (LV) {
      return [
        { type: 'qcm', q: 'Dans le laboratoire, quel geste est sûr pour débrancher ?', o: ['Tirer la fiche, mains sèches', 'Tirer le câble, mains mouillées', 'Toucher un fil dénudé'], a: 0, e: 'Fiche et mains sèches.' },
        { type: 'qcm', q: 'Kofi touche un appareil qui fuit. Quelle installation le protège ?', o: ['Celle avec disjoncteur différentiel', 'Celle sans protection', 'Aucune'], a: 0, e: 'Le courant est coupé.' }
      ];
    }
  });
})();
