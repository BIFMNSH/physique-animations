/* Hors-ligne : met le site en cache pour qu'il reste disponible sans réseau (Wi-Fi du collège en panne…).
   Pages : réseau d'abord (toujours à jour), cache en secours. Fichiers statiques et polices : cache d'abord. */
var VERSION = 'pc-v45';
var CORE = [
  './', './metal/', './solutions/', './atome/', './ions/', './tests/', './labo/', './fiche/', './simulateur/', './pack-3e/', './4e/', './lecon/', './assets/studio/studio.css', './assets/studio/studio.js', './assets/studio/programme.js', './assets/studio/hub.js', './assets/studio/kits/elec.js', './assets/studio/lecons/generateur-recepteur.js', './assets/studio/lecons/association-lampes.js', './assets/studio/lecons/piles-serie.js', './assets/studio/lecons/intensite.js', './assets/studio/lecons/tension.js', './assets/studio/lecons/pression-atmospherique.js', './assets/studio/lecons/melanges.js', './assets/studio/lecons/atomes-molecules.js', './assets/studio/kits/combustion.js', './assets/studio/lecons/combustion-carbone.js', './assets/studio/lecons/combustion-soufre.js', './assets/studio/kits/thermo.js', './assets/studio/lecons/dilatation-solides.js', './assets/studio/lecons/dilatation-liquides.js', './assets/studio/lecons/dilatation-gaz.js', './assets/studio/lecons/circuit-electrique.js', './assets/studio/lecons/commande-circuit.js', './assets/studio/lecons/court-circuit.js', './assets/studio/lecons/masse.js', './assets/studio/lecons/volume.js', './assets/studio/lecons/dangers-combustions.js', './assets/studio/lecons/combustion-gaz.js', './assets/studio/lecons/combustion-solide-liquide.js', './assets/studio/lecons/constituants-air.js', './assets/studio/lecons/changements-etat.js', './assets/studio/lecons/temperature.js', './assets/studio/lecons/les-gaz.js', './assets/studio/lecons/solides-liquides.js', './5e/', './6e/', './assets/studio/lecons/tension-alternative.js', './assets/studio/lecons/aimant-bobine.js', './assets/studio/lecons/tension-sinusoidale.js', './assets/studio/lecons/dangers-secteur.js', './assets/studio/lecons/transfo-redressement.js', './assets/studio/lecons/sources-recepteurs.js', './assets/studio/lecons/propagation-lumiere.js', './assets/studio/lecons/phases-eclipses.js', './assets/studio/lecons/lumiere-blanche.js', './assets/studio/lecons/atomes-ions.js', './assets/studio/lecons/metal-ion.js', './assets/studio/lecons/traitement-eau.js', './assets/studio/lecons/qualite-eau.js', './assets/sim.css', './assets/sim.js', './assets/sim-index.js', './assets/sim-fiche.js', './assets/sim/additivite.js', './assets/sim/circuits-lampes.js', './assets/sim/effet-serre.js', './assets/sim/energie-chute.js', './assets/sim/etat-eau.js', './assets/sim/masse-volumique.js', './assets/sim/miroir.js', './assets/sim/mouvement-bille.js', './assets/sim/ohm.js', './assets/sim/ph.js', './assets/sim/phases-lune.js', './assets/sim/poids-masse.js', './assets/sim/puissance-energie.js', './assets/sim/ressort.js', './assets/sim/solubilite.js', './assets/sim/vitesse.js', './assets/sim/vitesse-son.js', './assets/sim/force-vecteur.js', './assets/sim/equilibre-2forces.js', './assets/sim/travail-puissance.js', './assets/sim/electrolyse-eau.js', './assets/sim/alcanes.js', './assets/sim/combustions.js', './assets/sim/reduction-cuo.js', './assets/sim/lentille-image.js', './assets/sim/oeil.js',
  './assets/style.css', './assets/player.js', './assets/content.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !isFont) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('./'); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
