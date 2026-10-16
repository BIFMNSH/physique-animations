/* Hors-ligne : met le site en cache pour qu'il reste disponible sans réseau (Wi-Fi du collège en panne…).
   Pages : réseau d'abord (toujours à jour), cache en secours. Fichiers statiques et polices : cache d'abord. */
var VERSION = 'pc-v6';
var CORE = [
  './', './metal/', './solutions/', './atome/', './ions/', './tests/', './labo/', './fiche/', './simulateur/', './pack-3e/', './assets/sim.css', './assets/sim.js', './assets/sim-index.js', './assets/sim-fiche.js', './assets/sim/additivite.js', './assets/sim/circuits-lampes.js', './assets/sim/effet-serre.js', './assets/sim/energie-chute.js', './assets/sim/etat-eau.js', './assets/sim/masse-volumique.js', './assets/sim/miroir.js', './assets/sim/mouvement-bille.js', './assets/sim/ohm.js', './assets/sim/ph.js', './assets/sim/phases-lune.js', './assets/sim/poids-masse.js', './assets/sim/puissance-energie.js', './assets/sim/ressort.js', './assets/sim/solubilite.js', './assets/sim/vitesse.js', './assets/sim/vitesse-son.js',
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
