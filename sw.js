/* Hors-ligne : met le site en cache pour qu'il reste disponible sans réseau (Wi-Fi du collège en panne…).
   Pages : réseau d'abord (toujours à jour), cache en secours. Fichiers statiques (polices auto-hébergées comprises) : cache d'abord. Aucun service tiers. */
var VERSION = 'pc-v111';
var CORE = [
  './', './metal/', './solutions/', './atome/', './ions/', './tests/', './labo/', './fiche/', './simulateur/', './pack-3e/', './4e/', './lecon/', './activites/', './assets/activites/activites.css', './assets/activites/catalogue.js', './assets/activites/programme.js', './assets/activites/visee.js', './assets/compte.js', './assets/activites/pedagogie-catalogue.js', './assets/activites/activite.js', './assets/activites/fiches/NL-C4-A04.js', './assets/activites/fiches/NL-C4-B02.js', './assets/activites/fiches/NL-C4-C06.js', './assets/activites/fiches/NL-C4-D06.js', './assets/activites/fiches/NL-C4-A02.js', './assets/activites/fiches/NL-C4-C03.js', './assets/activites/fiches/NL-C4-D05.js', './assets/activites/fiches/NL-C4-A01.js', './assets/activites/fiches/NL-C4-C01.js', './assets/activites/fiches/NL-C4-D01.js', './assets/activites/fiches/NL-C4-D02.js', './assets/activites/fiches/NL-C4-C08.js', './assets/activites/fiches/NL-C4-B01.js', './assets/activites/fiches/NL-C4-B03.js', './assets/activites/fiches/NL-C4-B04.js', './assets/activites/fiches/NL-C4-B05.js', './assets/studio/studio.css', './assets/studio/studio.js', './assets/studio/programme.js', './assets/studio/hub.js', './decouvrir/', './assets/simple/simple.css', './assets/simple/simple.js', './assets/simple/classe.js', './assets/simple/etapes-ci.js', './assets/studio/kits/elec.js', './assets/studio/lecons/generateur-recepteur.js', './assets/studio/lecons/association-lampes.js', './assets/studio/lecons/piles-serie.js', './assets/studio/lecons/intensite.js', './assets/studio/lecons/tension.js', './assets/studio/lecons/pression-atmospherique.js', './assets/studio/lecons/melanges.js', './assets/studio/lecons/atomes-molecules.js', './assets/studio/kits/combustion.js', './assets/studio/lecons/combustion-carbone.js', './assets/studio/lecons/combustion-soufre.js', './assets/studio/kits/thermo.js', './assets/studio/lecons/dilatation-solides.js', './assets/studio/lecons/dilatation-liquides.js', './assets/studio/lecons/dilatation-gaz.js', './assets/studio/lecons/circuit-electrique.js', './assets/studio/lecons/commande-circuit.js', './assets/studio/lecons/court-circuit.js', './assets/studio/lecons/conducteur-ohmique.js', './assets/studio/lecons/puissance-energie-electriques.js', './assets/studio/lecons/defauts-oeil.js', './assets/studio/lecons/lentilles.js', './assets/studio/lecons/solutions-acides-basiques.js', './assets/studio/lecons/reduction-oxydes.js', './assets/studio/lecons/oxydation-corps-purs.js', './assets/studio/lecons/alcanes.js', './assets/studio/lecons/electrolyse-eau.js', './assets/studio/lecons/energie-mecanique.js', './assets/studio/lecons/travail-puissance.js', './assets/studio/lecons/equilibre-deux-forces.js', './assets/studio/lecons/les-forces.js', './assets/studio/lecons/masse-poids.js', './assets/studio/lecons/masse.js', './assets/studio/lecons/volume.js', './assets/studio/lecons/dangers-combustions.js', './assets/studio/lecons/combustion-gaz.js', './assets/studio/lecons/combustion-solide-liquide.js', './assets/studio/lecons/constituants-air.js', './assets/studio/lecons/changements-etat.js', './assets/studio/lecons/temperature.js', './assets/studio/lecons/les-gaz.js', './assets/studio/lecons/solides-liquides.js', './5e/', './6e/', './3e/', './assets/studio/lecons/tension-alternative.js', './assets/studio/lecons/aimant-bobine.js', './assets/studio/lecons/tension-sinusoidale.js', './assets/studio/lecons/dangers-secteur.js', './assets/studio/lecons/transfo-redressement.js', './assets/studio/lecons/sources-recepteurs.js', './assets/studio/lecons/propagation-lumiere.js', './assets/studio/lecons/phases-eclipses.js', './assets/studio/lecons/lumiere-blanche.js', './assets/studio/lecons/atomes-ions.js', './assets/studio/lecons/metal-ion.js', './assets/studio/lecons/traitement-eau.js', './assets/studio/lecons/qualite-eau.js', './assets/sim.css', './assets/sim.js', './assets/sim-index.js', './assets/sim-fiche.js', './assets/sim/additivite.js', './assets/sim/circuits-lampes.js', './assets/sim/effet-serre.js', './assets/sim/energie-chute.js', './assets/sim/etat-eau.js', './assets/sim/masse-volumique.js', './assets/sim/miroir.js', './assets/sim/mouvement-bille.js', './assets/sim/ohm.js', './assets/sim/ph.js', './assets/sim/phases-lune.js', './assets/sim/poids-masse.js', './assets/sim/puissance-energie.js', './assets/sim/ressort.js', './assets/sim/solubilite.js', './assets/sim/vitesse.js', './assets/sim/vitesse-son.js', './assets/sim/force-vecteur.js', './assets/sim/equilibre-2forces.js', './assets/sim/travail-puissance.js', './assets/sim/electrolyse-eau.js', './assets/sim/alcanes.js', './assets/sim/combustions.js', './assets/sim/reduction-cuo.js', './assets/sim/lentille-image.js', './assets/sim/oeil.js',
  './assets/shared/catalogue-parcours.css', './collections/', './assets/catalogues/6e-ci.js', './assets/shared/conductivite-modele.js', './assets/shared/conductivite-circuit.js', './assets/shared/atelier-electrique.js', './assets/shared/commande-protection.js', './activites-ci/', './parcours-ci/', './assets/activites/fiches/NL-CI-6E-ELE-01.js', './assets/activites/fiches/NL-CI-6E-ELE-02.js', './assets/activites/fiches/NL-CI-6E-ELE-03.js', './assets/activites/fiches/NL-CI-6E-ELE-04.js', './assets/activites/fiches/NL-CI-6E-ELE-05.js', './assets/activites/fiches/NL-CI-6E-ELE-06.js', './assets/activites/fiches/NL-CI-6E-ELE-07.js', './assets/activites/fiches/NL-CI-6E-ELE-08.js', './assets/activites/fiches/NL-CI-6E-ELE-09.js', './assets/activites/fiches/NL-CI-6E-ELE-10.js', './assets/activites/fiches/NL-CI-6E-ELE-11.js', './assets/activites/fiches/NL-CI-6E-ELE-12.js', './assets/activites/fiches/NL-CI-6E-ELE-13.js', './assets/activites/fiches/NL-CI-6E-ELE-14.js', './assets/activites/fiches/NL-CI-6E-ELE-15.js', './assets/activites/fiches/NL-CI-6E-ELE-16.js', './assets/activites/fiches/NL-CI-6E-ELE-17.js',
  './assets/style.css', './assets/player.js', './assets/content.js', './assets/fonts/fonts.css', './assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2', './assets/fonts/atkinson-hyperlegible-latin-700-normal.woff2', './assets/fonts/bricolage-grotesque-latin-600-normal.woff2', './assets/fonts/bricolage-grotesque-latin-800-normal.woff2', './animations/', './bepc/', './lecons/', './assets/bepc/sujets.js', './assets/brand/nohoba-icon.svg', './mentions-legales/', './confidentialite/', './credits/'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('pc-v') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      if (res.redirected && new URL(res.url).origin !== location.origin) return Response.redirect(res.url, 302);
      if (res && res.ok && !res.redirected && (res.type === 'basic' || res.type === 'default')) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('./'); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (res && res.ok && !res.redirected && (res.type === 'basic' || res.type === 'default')) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
