/* Livre vivant · 4e · Des atomes aux ions.
   Moment essentiel : un atome gagne ou perd des électrons : il devient un ion (charge = protons − électrons). Couches : 2 puis 8 électrons ; l'ion stable a sa dernière couche pleine.
   Éléments : Na (Z = 11), Mg (12), Cl (17), O (8). Modèle des couches simplifié (2 · 8 · 8). Chapitre 2 : compensation des charges dans un solide ionique (NaCl, MgCl₂). */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var EL = { Na: ['sodium', 11, 'ion sodium'], Mg: ['magnésium', 12, 'ion magnésium'], Cl: ['chlore', 17, 'ion chlorure'], O: ['oxygène', 8, 'ion oxyde'] };
  var charge = V.lois.chargeIon = function (el, gain) { return -gain; };
  var couches = V.lois.couches = function (e) { var r = [], cap = [2, 8, 8], i, k = e; for (i = 0; i < 3; i++) { var n = Math.min(cap[i], k); r.push(n); k -= n; } return r; };
  var stable = V.lois.ionStable = function (el, gain) { var e = EL[el][1] + gain, c = couches(e), last = c[c.length - 1] ? c.filter(function (x) { return x > 0; }).pop() : 0; var nz = c.filter(function (x) { return x > 0; }); var capLast = [2, 8, 8][nz.length - 1]; return nz[nz.length - 1] === capLast; };
  var nomIon = function (el, gain) { var q = charge(el, gain); if (q === 0) return 'atome ' + EL[el][0]; var sym = { Na: 'Na', Mg: 'Mg', Cl: 'Cl', O: 'O' }[el]; return EL[el][2] + ' ' + sym + (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−'); };
  V.lois.nomIon = nomIon;
  function sceneAt(c, X) {
    var P = X.P, s = X.S[0].v, el = s.el, g = +s.gain, Z = EL[el][1], e = Z + g, cs = couches(e), cx = 180, cy = 118, i, j;
    P.circ(c, cx, cy, 16, P.col.ink, 2.4, '#E8A0A0'); P.txt(c, Z + '+', cx, cy, 11, P.col.ink, 'center', 800);
    cs.forEach(function (n, k) { var r = 34 + k * 24; if (n > 0 || k < 3 && cs.slice(k).some(function (x) { return x > 0; })) P.circ(c, cx, cy, r, P.col.soft, 1.2, null); for (j = 0; j < n; j++) { var a = j * 6.2832 / n + k; P.circ(c, cx + r * Math.cos(a), cy + r * Math.sin(a), 4.5, P.col.ink, 1.4, '#3B5BDB'); } });
    P.txt(c, nomIon(el, g), cx, 24, 14, P.col.ink, 'center', 800); P.txt(c, Z + ' protons · ' + e + ' électrons', cx, 232, 12, P.col.ink, 'center', 800);
    P.txt(c, 'couches : ' + cs.filter(function (x) { return x > 0; }).join(' · '), cx, 248, 12, stable(el, g) ? P.col.ok : P.col.soft, 'center', 800);
  }
  var SEL = { NaCl: { a: ['Na⁺', 1, '#C9D8FF'], b: ['Cl⁻', 1, '#C9F0C9'], nom: 'chlorure de sodium' }, MgCl2: { a: ['Mg²⁺', 1, '#C9D8FF'], b: ['Cl⁻', 2, '#C9F0C9'], nom: 'chlorure de magnésium' } };
  var tot = V.lois.chargeTotale = function (s) { return s === 'NaCl' ? 1 * 1 + 1 * -1 : 1 * 2 + 2 * -1; };
  function sceneSel(c, X) {
    var P = X.P;
    X.S.forEach(function (s, k) {
      var d = SEL[s.v.sel], col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink, x0 = 25 + k * 185, i; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      P.circ(c, x0 + 20, 90, 14, col, 2.2, d.a[2]); P.txt(c, d.a[0], x0 + 20, 90, 11, P.col.ink, 'center', 800);
      for (i = 0; i < d.b[1]; i++) { P.circ(c, x0 + 60 + i * 34, 90, 14, col, 2.2, d.b[2]); P.txt(c, d.b[0], x0 + 60 + i * 34, 90, 11, P.col.ink, 'center', 800); }
      P.txt(c, '1 ' + d.a[0] + ' + ' + d.b[1] + ' ' + d.b[0], x0 + 80, 140, 12, col, 'center', 800); P.txt(c, 'charge totale : 0', x0 + 80, 160, 13, P.col.ok, 'center', 800); P.txt(c, s.nom, x0 + 80, 20, 12, col, 'center', 800); c.restore();
    });
  }
  V.add({
    slug: 'atomes-ions', defiTitre: 'Des atomes aux ions : le défi',
    chap: [
      { titre: 'Gagner ou perdre des électrons', labTitre: 'Atome et ion', cur: 'Comment le sodium devient-il un ion dans l’eau salée ?',
        paras: ['Un atome est neutre : autant de protons (+) que d’électrons (−). S’il gagne ou perd des électrons, il devient un ion.', 'Perdre des électrons donne un ion positif ; en gagner, un ion négatif.'],
        loi: { t: 'Charge de l’ion = protons − électrons', s: 'perte d’électrons : ion + · gain : ion −' }, note: 'Choisis l’élément et le nombre d’électrons gagnés (négatif = perdus). Couches : 2, puis 8.',
        predis: { q: 'Un atome perd un électron. Il devient un ion…', opts: ['positif', 'négatif', 'neutre'], a: 0, rep: 'Positif : il reste plus de protons que d’électrons.' },
        verif: { q: 'un atome de chlore gagne 1 électron : charge…', o: ['−1', '+1', '0'], a: 0, e: 'Ion chlorure : Cl⁻.' },
        lab: { w: 360, h: 260, alt: 'Atome avec ses couches d’électrons', scene: sceneAt, live: false, notrace: true, sit: [{ nom: '', vars: {} }],
          choices: [{ id: 'el', label: 'Élément', opts: [['Na', 'Na'], ['Mg', 'Mg'], ['Cl', 'Cl'], ['O', 'O']], val: 'Na' }], inputs: [{ id: 'gain', label: 'Électrons gagnés', min: -2, max: 2, step: 1, val: 0, unit: '', dec: 0 }],
          read: function (v) { var q = charge(v.el, +v.gain); return ['<b>' + nomIon(v.el, +v.gain) + ' (charge ' + (q > 0 ? '+' : q < 0 ? '−' : '') + Math.abs(q) + ')</b>', stable(v.el, +v.gain) ? 'Dernière couche pleine : ion stable' : 'Dernière couche incomplète']; }, sound: function (v) { return 250 + 50 * (+v.gain); } } },
      { titre: 'Un solide ionique', labTitre: 'Les charges se compensent', cur: 'Pourquoi le sel de cuisine est-il électriquement neutre ?',
        paras: ['Un solide ionique contient des ions positifs et négatifs. Leurs charges se compensent : le solide est neutre.', 'NaCl : 1 Na⁺ pour 1 Cl⁻. MgCl₂ : 1 Mg²⁺ pour 2 Cl⁻.'],
        loi: { t: 'Solide ionique : charges + et − compensées', s: 'NaCl · MgCl₂' }, note: 'Compare les deux solides.',
        predis: { q: 'Dans MgCl₂, pour 1 Mg²⁺ il y a…', opts: ['2 Cl⁻', '1 Cl⁻', '3 Cl⁻'], a: 0, rep: 'Deux Cl⁻ : +2 − 2 = 0.' },
        verif: { q: 'un solide ionique est…', o: ['neutre', 'positif', 'négatif'], a: 0, e: 'Neutre.' },
        lab: { w: 380, h: 200, alt: 'Ions dans NaCl et MgCl₂', scene: sceneSel, live: false, notrace: true, sit: [{ nom: 'Sel de cuisine', vars: {} }, { nom: 'Chlorure de magnésium', vars: {} }], choices: [{ id: 'sel', label: 'Solide', opts: [['NaCl', 'NaCl'], ['MgCl2', 'MgCl₂']], val: 'NaCl', per: true }],
          read: function (v) { return [SEL[v.sel].nom + ' : charge totale ' + tot(v.sel)]; }, sound: function () { return 330; } } }
    ],
    manches: function (LV) {
      var l = LV[0] || {}, el = EL[l.el] ? l.el : 'Na', g = l.gain != null ? +l.gain : 0, q = charge(el, g);
      return [
        { type: 'calcul', q: 'Dans le laboratoire : ' + EL[el][0] + ', ' + EL[el][1] + ' protons, ' + (g >= 0 ? 'gagne ' + g : 'perd ' + Math.abs(g)) + ' électron(s). Quelle est la charge de l’ion (nombre entier signé) ?', ans: q, tol: 0.1, unit: '', e: 'Charge = −(électrons gagnés) = ' + q + '.' },
        { type: 'qcm', q: 'Dans MgCl₂, pourquoi y a-t-il deux Cl⁻ pour un Mg²⁺ ?', o: ['Pour que le solide soit neutre', 'Parce que Cl est plus gros', 'Par hasard'], a: 0, e: '+2 − 2 = 0.' }
      ];
    }
  });
})();
