/* Livre vivant · 4e · Transformateur et redressement.
   Moment essentiel : un transformateur change la valeur d'une tension alternative (plus de spires au secondaire : tension plus grande) ; une diode ne laisse passer le courant que dans un sens.
   Rapport Us/Up = Ns/Np : relation proportionnelle utilisée comme choix de conception qualitatif (Np = 1 000 spires, Up = 220 V) ; à confronter au programme MENA. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, NP = 1000, UP = 220;
  var us = V.lois.tensionSecondaire = function (ns) { return UP * ns / NP; };
  var type = V.lois.typeTransfo = function (ns) { return ns < NP ? 'abaisseur' : ns > NP ? 'élévateur' : 'neutre'; };
  var redresse = V.lois.redresse = function (u, diode) { return diode === 'avec' && u < 0 ? 0 : u; };
  function sceneT(c, X) {
    var P = X.P, ns = +X.S[0].v.ns, u = us(ns), ry = 60 + 130, i;
    P.rect(c, 150, 60, 20, 130, P.col.ink, 2.6, P.col.fill);
    for (i = 0; i < 9; i++) { P.circ(c, 140, 70 + i * 14, 6, P.col.a, 1.8, null); }
    var n2 = Math.max(2, Math.min(14, Math.round(ns / 150))); for (i = 0; i < n2; i++) P.circ(c, 180, 190 - 8 - i * (120 / n2), 6, P.col.b, 1.8, null);
    P.txt(c, 'primaire', 100, 50, 12, P.col.a, 'center', 800); P.txt(c, '1 000 spires · 220 V', 100, 210, 11, P.col.a, 'center', 800);
    P.txt(c, 'secondaire', 250, 50, 12, P.col.b, 'center', 800); P.txt(c, fr(ns, 0) + ' spires · ' + fr(u, 0) + ' V', 250, 210, 12, P.col.b, 'center', 800);
    P.txt(c, type(ns), 160, 25, 14, P.col.ink, 'center', 800);
  }
  function sceneD(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 20 + k * 185, w = 150, y0 = 190, h = 110, pts = [], q; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.axes(c, x0, y0, x0 + w + 8, y0 - h - 20, 't', 'U'); for (q = 0; q <= 40; q++) { var u = Math.sin(q / 40 * 4 * Math.PI); pts.push([x0 + q * w / 40, y0 - h / 2 - redresse(u, s.v.diode) * h / 2 * 0.9]); }
      P.poly(c, pts, col, 2.6); P.txt(c, s.v.diode === 'avec' ? 'avec diode' : 'sans diode', x0 + w / 2, 18, 13, col, 'center', 800); P.txt(c, s.v.diode === 'avec' ? 'jamais négative' : 'positive et négative', x0 + w / 2, 218, 11, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'transfo-redressement', defiTitre: 'Transformateur et redressement : le défi',
    chap: [
      { titre: 'Le transformateur', labTitre: 'Abaisser ou éléver la tension', cur: 'Comment le chargeur de téléphone transforme-t-il le 220 V du secteur ?',
        paras: ['Un transformateur change la valeur d’une tension alternative. Il comporte deux bobines : le primaire et le secondaire.', 'Moins de spires au secondaire : la tension diminue (abaisseur). Plus de spires : elle augmente (élévateur).'],
        loi: { t: 'Transformateur : change la valeur d’une tension alternative', s: 'moins de spires au secondaire : tension plus faible' }, note: 'Primaire fixé : 1 000 spires, 220 V. Relation de proportionnalité à confronter au programme.',
        predis: { q: 'Un chargeur abaisse 220 V à une valeur bien plus faible. Son secondaire a…', opts: ['beaucoup moins de spires', 'beaucoup plus de spires', 'autant de spires'], a: 0, rep: 'Beaucoup moins de spires : transformateur abaisseur.' },
        verif: { q: 'un transformateur fonctionne avec une tension…', o: ['alternative', 'continue', 'nulle'], a: 0, e: 'Alternative.' },
        lab: { w: 380, h: 230, alt: 'Transformateur avec primaire et secondaire', scene: sceneT, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'ns', label: 'Spires au secondaire', min: 50, max: 2000, step: 50, val: 100, unit: '', dec: 0 }],
          read: function (v) { var u = us(+v.ns); return ['<b>Us ≈ ' + fr(u, 0) + ' V : transformateur ' + type(+v.ns) + '</b>', 'Alternative en entrée, alternative en sortie.']; }, sound: function (v) { return 150 + 0.15 * us(+v.ns); } } },
      { titre: 'La diode', labTitre: 'Redresser la tension', cur: 'Comment passe-t-on d’une tension alternative à une tension qui ne change pas de sens ?',
        paras: ['Une diode laisse passer le courant dans un seul sens.', 'Avec une diode, la tension alternative n’est plus jamais négative : elle est redressée (simple alternance).'],
        loi: { t: 'Diode : courant dans un seul sens', s: 'redressement : tension jamais négative' }, note: 'Compare les courbes sans et avec diode.',
        predis: { q: 'Après redressement par une diode, la tension est…', opts: ['jamais négative', 'toujours négative', 'identique'], a: 0, rep: 'Jamais négative.' },
        verif: { q: 'une diode laisse passer le courant dans…', o: ['un seul sens', 'les deux sens', 'aucun sens'], a: 0, e: 'Un seul sens.' },
        lab: { w: 380, h: 230, alt: 'Tension alternative sans et avec diode', scene: sceneD, live: false, notrace: true, sit: [{ nom: 'Sans diode', vars: { diode: 'sans' } }, { nom: 'Avec diode', vars: { diode: 'avec' } }], choices: [{ id: 'diode', label: 'Diode', opts: [['sans', 'Sans'], ['avec', 'Avec']], val: 'sans', per: true }],
          read: function (v) { return [v.diode === 'avec' ? 'Avec diode : demi-périodes négatives supprimées' : 'Sans diode : tension alternative complète']; }, sound: function (v) { return v.diode === 'avec' ? 330 : 220; } } }
    ],
    manches: function (LV) {
      var ns = LV[0] && LV[0].ns != null ? +LV[0].ns : 100, u = us(ns);
      return [
        { type: 'calcul', q: 'Dans le laboratoire, le secondaire a ' + fr(ns, 0) + ' spires (primaire : 1 000 spires, 220 V). Quelle tension de sortie, en V ?', ans: u, tol: 0.5, unit: 'V', e: 'Us = 220 × ' + fr(ns, 0) + ' ÷ 1 000 = ' + fr(u, 1) + ' V.' },
        { type: 'qcm', q: 'Quel composant ne laisse passer le courant que dans un sens ?', o: ['La diode', 'Le transformateur', 'Le fil'], a: 0, e: 'La diode.' }
      ];
    }
  });
})();
