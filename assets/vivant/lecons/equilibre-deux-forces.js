/* Livre vivant · 3e · Équilibre d'un solide soumis à deux forces.
   Moment essentiel : un objet de 1 kg (P = 10 N) pendu à un fil ; il est en équilibre si la tension T a la même valeur que P, la même droite d'action et un sens opposé.
   Chapitre 2 : si T < P l'objet descend, si T > P il monte. g = 10 N/kg. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, P0 = 10;
  var etat = V.lois.etatDeuxForces = function (T, fil) { if (fil === 'oblique') return 'tourne'; return T === P0 ? 'equilibre' : T < P0 ? 'descend' : 'monte'; };
  function dessin(c, P, x, y, T, fil, col) {
    var e = etat(T, fil), dy = e === 'descend' ? 14 : e === 'monte' ? -14 : 0, ox = fil === 'oblique' ? 22 : 0;
    P.line(c, x - 40, 24, x + 40, 24, P.col.soft, 3); P.line(c, x + ox, y + dy - 18, x, 24, col, 2); P.rect(c, x - 18 + ox / 2, y + dy - 18, 36, 36, col, 2.6, '#E9DDBB');
    P.arrow(c, x + ox / 2, y + dy, x + ox / 2, y + dy + P0 * 4, P.col.b, 3); P.txt(c, 'P = 10 N', x + ox / 2 + 26, y + dy + 46, 11, P.col.b, 'left', 800);
    if (T > 0) { P.arrow(c, x + ox / 2, y + dy, x + ox / 2 + (fil === 'oblique' ? -10 : 0), y + dy - T * 4, P.col.hot, 3); P.txt(c, 'T = ' + fr(T, 0) + ' N', x + ox / 2 - 28, y + dy - T * 4 - 6, 11, P.col.hot, 'right', 800); }
    P.txt(c, e === 'equilibre' ? 'équilibre' : e === 'tourne' ? 'tourne' : e === 'descend' ? 'descend' : 'monte', x, 230, 13, e === 'equilibre' ? P.col.ok : P.col.hot, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      dessin(c, P, two ? 95 + 190 * k : 190, 130, +s.v.T, s.v.fil, col); if (two) P.txt(c, s.nom, 95 + 190 * k, 12, 12, col, 'center', 800); c.restore();
    });
  }
  function lig(v) { var e = etat(+v.T, v.fil); return e === 'equilibre' ? ['<b>Équilibre : T = P = 10 N, même droite, sens opposés</b>'] : e === 'tourne' ? ['<b>Pas d’équilibre : les forces ne sont pas sur la même droite</b>'] : [e === 'descend' ? '<b>T inférieure à P : l’objet descend</b>' : '<b>T supérieure à P : l’objet monte</b>']; }
  var tI = { id: 'T', label: 'Tension du fil', min: 0, max: 20, step: 2, val: 6, unit: 'N', dec: 0 };
  V.add({
    slug: 'equilibre-deux-forces', defiTitre: 'L’équilibre sous deux forces : le défi',
    chap: [
      { titre: 'Les conditions d’équilibre', labTitre: 'Un objet suspendu', cur: 'Pourquoi une lampe suspendue reste-t-elle immobile ?',
        paras: ['Un solide soumis à deux forces est en équilibre si elles ont la même droite d’action, la même valeur et des sens opposés.', 'Ici : le poids P (vers le bas) et la tension T du fil (vers le haut).'],
        loi: { t: 'Équilibre : même droite, même valeur, sens opposés', s: 'P = 10 N pour 1 kg' }, note: 'Règle la tension jusqu’à l’équilibre. Fil vertical ou oblique.',
        predis: { q: 'Pour que l’objet de poids 10 N reste immobile, le fil tire avec…', opts: ['10 N vers le haut', '5 N vers le haut', '10 N vers le bas'], a: 0, rep: '10 N vers le haut : même valeur, sens opposé.' },
        verif: { q: 'deux forces s’équilibrent si elles ont…', o: ['la même valeur et des sens opposés', 'la même valeur et le même sens', 'des valeurs différentes'], a: 0, e: 'Même droite, même valeur, sens opposés.' },
        lab: { w: 380, h: 250, alt: 'Objet suspendu à un fil avec le poids et la tension', scene: scene, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [tI], choices: [{ id: 'fil', label: 'Fil', opts: [['vertical', 'Vertical'], ['oblique', 'Oblique']], val: 'vertical' }], read: lig, sound: function (v) { return etat(+v.T, v.fil) === 'equilibre' ? 440 : 180; } } },
      { titre: 'Pas d’équilibre', labTitre: 'Trop ou trop peu de tension', cur: 'Que se passe-t-il si le fil tire moins fort que le poids ?',
        paras: ['Si la tension est plus petite que le poids, l’objet descend. Si elle est plus grande, il monte.', 'Seule l’égalité des valeurs donne l’équilibre.'],
        loi: { t: 'T < P : descend · T > P : monte', s: 'T = P : équilibre' }, note: 'Compare deux tensions, fil vertical.',
        predis: { q: 'La tension (6 N) est plus petite que le poids (10 N). L’objet…', opts: ['descend', 'monte', 'reste immobile'], a: 0, rep: 'Il descend.' },
        verif: { q: 'à l’équilibre, la valeur de T est…', o: ['égale à P', 'plus grande que P', 'nulle'], a: 0, e: 'T = P.' },
        lab: { w: 380, h: 250, alt: 'Deux objets suspendus avec des tensions différentes', scene: scene, live: false, notrace: true, sit: [{ nom: 'Fil A', vars: { fil: 'vertical' } }, { nom: 'Fil B', vars: { fil: 'vertical' } }], inputs: [Object.assign({}, tI, { val: [6, 14], per: true })], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; }, sound: function (v) { return etat(+v.T, v.fil) === 'equilibre' ? 440 : 180; } } }
    ],
    manches: function (LV) {
      var T = LV[0] && LV[0].T != null ? +LV[0].T : 6, e = etat(T, 'vertical'), noms = { equilibre: 'reste en équilibre', descend: 'descend', monte: 'monte' };
      return [
        { type: 'qcm', q: 'Dans le laboratoire, le fil vertical tire avec ' + fr(T, 0) + ' N sur un objet de poids 10 N. L’objet…', o: ['reste en équilibre', 'descend', 'monte'], a: ['equilibre', 'descend', 'monte'].indexOf(e), e: 'Il ' + noms[e] + '.' },
        { type: 'calcul', q: 'Un objet de 3 kg pend à un fil vertical, immobile (g = 10 N/kg). Quelle est la tension du fil, en N ?', ans: 30, tol: 0.5, unit: 'N', e: 'T = P = 3 × 10 = 30 N.' }
      ];
    }
  });
})();
