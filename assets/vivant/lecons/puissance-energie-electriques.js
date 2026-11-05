/* Livre vivant · 3e · Puissance et énergie électriques.
   Moment essentiel : P = U × I (en watts) pour un appareil sous 220 V ; E = P × t (en kWh quand P est en kW et t en h) ; coût = E × prix du kWh.
   Prix du kWh = 100 F CFA : valeur d'exemple, pas un tarif de la CIE (à remplacer par le tarif en vigueur). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr, U = 220, PRIX = 100;
  var puiss = V.lois.puissanceElec = function (u, i) { return u * i; };
  var energie = V.lois.energieKWh = function (pW, th) { return pW / 1000 * th; };
  var cout = V.lois.coutEnergie = function (pW, th) { return energie(pW, th) * PRIX; };
  function sceneP(c, X) {
    var P = X.P, i = +X.S[0].v.I, p = puiss(U, i);
    P.rect(c, 110, 70, 140, 80, P.col.ink, 2.6, P.col.fill); P.txt(c, 'appareil', 180, 110, 14, P.col.ink, 'center', 800); P.txt(c, '220 V', 180, 50, 13, P.col.hot, 'center', 800);
    P.line(c, 50, 110, 110, 110, P.col.ink, 3); P.line(c, 250, 110, 310, 110, P.col.ink, 3); P.txt(c, 'I = ' + fr(i, 1) + ' A', 80, 96, 12, P.col.a, 'center', 800);
    P.rect(c, 60, 180, 240, 18, P.col.ink, 1.6, P.col.paper); c.fillStyle = '#E23B3B'; c.fillRect(61, 181, 238 * Math.min(1, p / 2200), 16); P.txt(c, 'P = U × I = ' + fr(U, 0) + ' × ' + fr(i, 1) + ' = ' + fr(p, 0) + ' W', 180, 220, 14, P.col.hot, 'center', 800);
  }
  var AP = { lampe: ['lampe', 10], fer: ['fer à repasser', 1000], clim: ['climatiseur', 1500] };
  function sceneE(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var a = AP[s.v.ap], t = +s.v.t, col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 95 + k * 190; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.rect(c, x0 - 52, 60, 104, 50, col, 2.4, P.col.fill); P.txt(c, a[0], x0, 85, 11, col, 'center', 800); P.txt(c, fr(a[1], 0) + ' W · ' + fr(t, 0) + ' h', x0, 130, 12, P.col.ink, 'center', 800);
      P.txt(c, fr(energie(a[1], t), 2) + ' kWh', x0, 160, 14, P.col.hot, 'center', 800); P.txt(c, fr(cout(a[1], t), 0) + ' F CFA', x0, 184, 14, P.col.ok, 'center', 800); P.txt(c, s.nom, x0, 18, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'puissance-energie-electriques', defiTitre: 'Puissance et énergie électriques : le défi',
    chap: [
      { titre: 'La puissance P = U × I', labTitre: 'Un appareil sur le secteur', cur: 'Pourquoi un fer à repasser chauffe-t-il plus qu’une lampe ?',
        paras: ['La puissance électrique d’un appareil est P = U × I : tension en volts, intensité en ampères, puissance en watts (W).', 'À 220 V, plus l’intensité est grande, plus la puissance est grande.'],
        loi: { t: 'P = U × I', s: 'watts = volts × ampères' }, note: 'Tension fixée à 220 V : fais varier l’intensité.',
        predis: { q: 'Sous 220 V, un appareil consomme 5 A. Sa puissance est…', opts: ['1 100 W', '225 W', '44 W'], a: 0, rep: '220 × 5 = 1 100 W.' },
        verif: { q: 'la puissance se mesure en…', o: ['watts', 'volts', 'ampères'], a: 0, e: 'En watts (W).' },
        lab: { w: 360, h: 250, alt: 'Appareil sous 220 V avec intensité et puissance', scene: sceneP, live: false, notrace: true, sit: [{ nom: '', vars: {} }], inputs: [{ id: 'I', label: 'Intensité', min: 0.5, max: 10, step: 0.5, val: 5, unit: 'A', dec: 1 }],
          read: function (v) { return ['<b>P = ' + fr(U, 0) + ' × ' + fr(+v.I, 1) + ' = ' + fr(puiss(U, +v.I), 0) + ' W</b>']; }, sound: function (v) { return 150 + puiss(U, +v.I) / 8; } } },
      { titre: 'L’énergie et son coût', labTitre: 'Lampe, fer, climatiseur', cur: 'Pourquoi la facture de la CIE monte-t-elle avec le climatiseur ?',
        paras: ['L’énergie consommée est E = P × t. Avec P en kilowatts et t en heures, E est en kilowattheures (kWh).', 'Le coût est E multipliée par le prix du kWh (ici 100 F CFA, valeur d’exemple).'],
        loi: { t: 'E = P × t (kWh) · coût = E × prix', s: 'prix du kWh : 100 F CFA (exemple)' }, note: 'Même durée pour les deux appareils.',
        predis: { q: 'Un fer de 1 000 W fonctionne 2 h. Il consomme…', opts: ['2 kWh', '1 kWh', '2 000 kWh'], a: 0, rep: '1 kW × 2 h = 2 kWh.' },
        verif: { q: 'une lampe de 10 W pendant 100 h consomme…', o: ['1 kWh', '10 kWh', '100 kWh'], a: 0, e: '0,01 kW × 100 h = 1 kWh.' },
        lab: { w: 380, h: 230, alt: 'Énergie et coût de deux appareils', scene: sceneE, live: false, notrace: true, sit: [{ nom: 'Appareil A', vars: {} }, { nom: 'Appareil B', vars: {} }], inputs: [{ id: 't', label: 'Durée de fonctionnement', min: 1, max: 10, step: 1, val: 2, unit: 'h', dec: 0 }], choices: [{ id: 'ap', label: 'Appareil', opts: [['lampe', 'Lampe 10 W'], ['fer', 'Fer 1 000 W'], ['clim', 'Climatiseur 1 500 W']], val: 'fer', per: true }],
          read: function (v) { var a = AP[v.ap]; return [a[0] + ' : ' + fr(energie(a[1], +v.t), 2) + ' kWh, soit ' + fr(cout(a[1], +v.t), 0) + ' F CFA']; }, sound: function (v) { return 150 + cout(AP[v.ap][1], +v.t) / 4; } } }
    ],
    manches: function (LV) {
      var i = LV[0] && LV[0].I != null ? +LV[0].I : 5, t = LV[1] && LV[1].t != null ? +LV[1].t : 2;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, un appareil sous 220 V est traversé par ' + fr(i, 1) + ' A. Quelle puissance, en W ?', ans: U * i, tol: 0.5, unit: 'W', e: 'P = 220 × ' + fr(i, 1) + ' = ' + fr(U * i, 0) + ' W.' },
        { type: 'calcul', q: 'Awa utilise un fer de 1 000 W pendant ' + fr(t, 0) + ' h. Quelle énergie, en kWh ?', ans: t, tol: 0.05, unit: 'kWh', e: '1 kW × ' + fr(t, 0) + ' h = ' + fr(t, 0) + ' kWh.' }
      ];
    }
  });
})();
