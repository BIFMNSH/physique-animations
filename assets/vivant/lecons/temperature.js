/* Livre vivant · 6e · Mesures · La température.
   Moment essentiel : on règle la température ; le liquide du thermomètre monte et on la lit sur les graduations (0 °C glace fondante, 100 °C eau qui bout).
   Chapitre 2 : deux thermomètres de graduations différentes (1 °C et 5 °C) : la précision de la lecture change. Qualitatif en dehors des deux repères ; aucune valeur de manuel. */
(function () {
  'use strict';
  var V = window.Vivant, fr = V.fr;
  var lecture = V.lois.lectureTemperature = function (T, grad) { return grad === 1 ? { v: Math.round(T), pre: true } : { v: Math.floor(T / grad) * grad, pre: false, max: Math.floor(T / grad) * grad + grad }; };
  function thermo(c, P, cx, T, grad, col, nom, two) {
    var y0 = 200, k = 1.7, ty = y0 - T * k, i;
    P.circ(c, cx, 217, 17, P.col.ink, 2.6, P.col.paper); P.rect(c, cx - 7, 24, 14, 190, P.col.ink, 2.4, P.col.paper);
    c.fillStyle = '#D64545'; c.beginPath(); c.arc(cx, 217, 14, 0, 6.2832); c.fill(); c.fillRect(cx - 3.5, ty, 7, 214 - ty);
    for (i = 0; i <= 100; i += grad) { var y = y0 - i * k, big = i % 10 === 0; P.line(c, cx + 7, y, cx + 7 + (big ? 10 : grad === 1 ? 4 : 6), y, P.col.soft, big ? 1.6 : 1); if (big) P.txt(c, String(i), cx + 22, y, 10, P.col.soft, 'left'); }
    P.line(c, cx - 30, ty, cx - 8, ty, P.col.b, 1.8); P.arrow(c, cx - 36, ty, cx - 10, ty, P.col.b, 1.8);
    if (!two) { P.txt(c, '0 °C : glace fondante', cx + 56, y0, 11, P.col.a, 'left', 800); P.txt(c, '100 °C : eau qui bout', cx + 56, y0 - 170, 11, P.col.hot, 'left', 800); }
    if (nom) P.txt(c, nom, cx, 12, 12, col, 'center', 800);
  }
  function scene(c, X) {
    var P = X.P, two = X.S.length > 1;
    X.S.forEach(function (s, k) {
      var col = s.cls === 'b' ? P.col.b : s.cls === 'a' ? P.col.a : P.col.ink; c.save(); c.globalAlpha = X.act >= 0 && X.act !== s.i ? 0.35 : 1;
      thermo(c, P, two ? 80 + 190 * k : 120, +s.v.T, +s.v.grad, col, two ? s.nom : '', two); c.restore();
    });
  }
  function lig(v) {
    var r = lecture(+v.T, +v.grad);
    return r.pre ? ['<b>On lit T = ' + fr(r.v, 0) + ' °C</b>', 'Graduation de 1 °C : la lecture est précise. Œil au niveau du liquide.'] : ['<b>On lit entre ' + fr(r.v, 0) + ' °C et ' + fr(r.max, 0) + ' °C</b>', 'Graduation de ' + fr(+v.grad, 0) + ' °C : lecture moins précise.'];
  }
  var Tn = { id: 'T', label: 'Température', min: 0, max: 100, step: 1, val: 37, unit: '°C', dec: 0 };
  var base = { w: 380, h: 270, scene: scene, live: false, notrace: true, read: lig, inputs: [Tn], sound: function (v) { return 150 + 5 * +v.T; } };
  V.add({
    slug: 'temperature', defiTitre: 'La température : le défi',
    chap: [
      { titre: 'Lire un thermomètre', labTitre: 'Faire monter le liquide', cur: 'Comment Kofi sait-il si son eau est trop chaude pour le bain de bébé ?',
        paras: ['La température se mesure avec un thermomètre, en degrés Celsius (°C). Le liquide du thermomètre monte quand la température augmente.', 'Repères : 0 °C pour la glace fondante, 100 °C pour l’eau qui bout.'],
        loi: { t: 'Température : thermomètre, en °C', s: '0 °C : glace fondante · 100 °C : eau qui bout' }, note: 'Déplace le curseur : le liquide monte et la flèche rouge marque où lire.',
        predis: { q: 'Pour lire un thermomètre, on place son œil…', opts: ['au niveau du liquide', 'au-dessus', 'en dessous'], a: 0, rep: 'Au niveau du liquide : sinon on se trompe de graduation (erreur de lecture).' },
        verif: { q: 'la glace fondante est à…', o: ['0 °C', '37 °C', '100 °C'], a: 0, e: 'La glace fondante est à 0 °C.' },
        lab: Object.assign({}, base, { alt: 'Thermomètre dont le liquide monte avec la température', sit: [{ nom: '', vars: { grad: 1 } }] }) },
      { titre: 'Précision de la lecture', labTitre: 'Graduations de 1 °C et de 5 °C', cur: 'Pourquoi certains thermomètres donnent-ils une valeur plus précise que d’autres ?',
        paras: ['Les graduations plus serrées donnent une lecture plus précise.', 'Avec des graduations de 5 °C, on ne peut lire qu’un intervalle : « entre 35 °C et 40 °C ».'],
        loi: { t: 'Graduations serrées : lecture précise', s: 'graduations de 5 °C : on lit un intervalle' }, note: 'Compare en alternance : même température, deux thermomètres.',
        predis: { q: 'Sur un thermomètre gradué de 5 en 5, le liquide est entre 35 °C et 40 °C. On lit…', opts: ['exactement 37 °C', 'un intervalle', 'exactement 40 °C'], a: 1, rep: 'On ne peut donner qu’un intervalle : entre 35 °C et 40 °C.' },
        verif: { q: 'pour une lecture plus précise, on choisit des graduations…', o: ['plus serrées', 'plus espacées', 'sans chiffres'], a: 0, e: 'Plus serrées.' },
        lab: Object.assign({}, base, { alt: 'Deux thermomètres, graduations de 1 °C et de 5 °C', sit: [{ nom: 'Graduation 1 °C', vars: { grad: 1 } }, { nom: 'Graduation 5 °C', vars: { grad: 5 } }], read: function (v) { return [lig(v)[0].replace(/<\/?b>/g, '')]; } }) }
    ],
    manches: function (LV) {
      var T = LV[0] && LV[0].T != null ? +LV[0].T : 37;
      return [
        { type: 'calcul', q: 'Dans le laboratoire, le liquide du thermomètre (graduations de 1 °C) est monté à la graduation que tu as réglée. Quelle température lis-tu ?', ans: T, tol: 0.5, unit: '°C', e: 'Tu as réglé ' + fr(T, 0) + ' °C : c’est la graduation où s’arrête le liquide.' },
        { type: 'qcm', q: 'Un thermomètre gradué tous les 5 °C : le liquide est entre 20 °C et 25 °C. Quelle lecture est correcte ?', o: ['« 22 °C exactement »', '« entre 20 °C et 25 °C »', '« 25 °C exactement »'], a: 1, e: 'Avec des graduations de 5 °C, on lit un intervalle.' }
      ];
    }
  });
})();
