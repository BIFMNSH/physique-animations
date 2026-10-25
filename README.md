# NOHOBA-Lab — Physique-chimie au collège

Interface statique HTML/CSS/JavaScript : 53 leçons Studio (6e : 13 ; 5e : 13 ; 4e : 13 ; 3e : 14), 26 simulations et trois sujets d’entraînement au BEPC. Référence de travail : progression MENA Côte d’Ivoire 2026–2027.

## Parcours pédagogique

Chaque leçon propose une situation-problème et une prévision argumentée avant la manipulation. La prévision initiale est conservée ; l’élève décrit ses observations, les confronte à sa prévision puis rédige son bilan. Le bilan scientifique devient disponible après dépôt de cette trace. Le dépôt ne valide pas automatiquement la justesse des réponses : une rétroaction pédagogique reste nécessaire.

Le parcours Révision donne accès au résumé, aux défis et au quiz. Les défis sont sans chronomètre par défaut ; l’enseignant peut l’activer. Le score ne dépend ni de la vitesse ni des indices utilisés. La fiche élève imprime la démarche et les réponses ; le corrigé professeur contient le bilan et les réponses du quiz.

Les traces sont conservées dans le navigateur sous `pc-inquiry-<identifiant>`. Elles ne sont pas synchronisées avec le serveur de comptes. Éviter les données personnelles dans les réponses sur un appareil partagé.

## Structure

- `assets/studio/studio.js`, `studio.css` : moteur et interface des leçons.
- `assets/studio/lecons/` : contenus et modèles des 53 leçons.
- `assets/studio/programme.js` : parcours par niveau ; `lecon/?l=<slug>` : accès direct.
- `6e/` et `collections/` : navigation pliable par thème et par leçon, styles partagés dans `assets/shared/catalogue-parcours.css`. Les leçons de 6e ouvrent leur hub `parcours-ci/` ; les autres niveaux conservent leur accès Studio direct. Les Collections distinguent développement (prototype, disponible, conception) et progression personnelle.
- `assets/sim/` : 26 simulations complémentaires ; `simulateur/` : catalogue.
- `bepc/`, `assets/bepc/sujets.js` : entraînement et autoévaluation.
- `server/` : serveur distinct de comptes/paiements ; voir son README pour Railway.
- `sw.js` : cache hors connexion. Incrémenter la version lors des mises à jour.
- `qa/` : tests front-end ; `.github/workflows/frontend-tests.yml` : exécution CI.

## Validation

Depuis la racine : `npm ci --prefix qa`, puis `npm test --prefix qa` (Node 24). Ces tests couvrent les parcours et invariants structurels ; ils ne remplacent pas la revue scientifique et les tests tactiles/visuels. Pour une prévisualisation : `python3 -m http.server 8765`, puis ouvrir `/lecon/?l=association-lampes`.

L’interface Vercel n’a pas d’étape de build. Le domaine canonique est https://lab.nohaba.com/. La redirection de l’alias Vercel vise les requêtes HTML ; les ressources et le service worker restent accessibles sur leur origine pour éviter de casser des pages anciennes encore en cache.

L’accueil charge ses styles et scripts depuis `assets/accueil.css`, `assets/accueil-theme.js` (avant le rendu) et `assets/accueil.js` (différé). Sa CSP interdit les scripts exécutables inline ; les autres pages conservent temporairement leur politique compatible avec les simulations historiques. L’intégration en iframe est limitée à la même origine. Ne pas réintroduire de gestionnaires HTML `onclick` ou de scripts inline dans l’accueil.

Les fichiers `.woff2` ont un cache immuable d’un an : changer leur nom si leurs octets changent. Les images de marque ont un cache d’une heure. Les CSS et JS non versionnés restent revalidés à chaque requête ; ne pas leur appliquer de cache long sans versionner leurs URL. Vérifier les en-têtes sur une prévisualisation Vercel avant fusion, y compris avec un ancien service worker installé ; le serveur Python local n’applique pas `vercel.json`.

## État de validation du programme

La présence des intitulés ne certifie pas la couverture de toutes les habiletés officielles. La revue de correspondance détaillée MENA, des 395 questions et des 265 missions reste une validation éditoriale distincte. Les modèles de simulation sont simplifiés ; leurs limites doivent accompagner toute utilisation en classe.
