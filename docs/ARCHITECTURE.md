# Architecture · NOHOBA-Lab

Site statique (Vercel, `main` déployé automatiquement) + serveur de comptes (`server/`, Railway, api.lab.nohaba.com).

## Moteur d'activités
`assets/activites/activite.js` : fiche = objet `window.FICHE_*`. Six écrans (Problématiser, Émettre une hypothèse, Expérimenter / Investiguer, Analyser et interpréter, Conclure, Communiquer). Fiche imprimable A4 (vierge, remplie, professeur). Données de l'élève : `localStorage` seulement.

## Collection Côte d'Ivoire 6e
- Catalogue : `assets/catalogues/6e-ci.js` (90 entrées : 59 `disponible`, 11 `prototype`, 20 `conception` ; chaque entrée hors `conception` a sa fiche).
- Fiches : `assets/activites/fiches/NL-CI-6E-*.js`. Page : `activites-ci/?a=<id>` (toutes les fiches du catalogue sont reconnues).
- Atelier partagé : `assets/shared/atelier-electrique.js`. Conductivité : `conductivite-modele.js`, `conductivite-circuit.js`.
- Hub : `parcours-ci/`. Collections : `collections/`.

## Tests
`cd qa && npm test` (jsdom 26.1.0) : 13 suites (regression, activites, catalogues-ci-fr, lots ELE, MAT, ENE, MES, SEO, portrait…), exécutées par GitHub Actions (`frontend-tests.yml`).
Serveur : `cd server && npm test`, base Postgres sur le port 5544 (`DATABASE_URL`), exécutée par `server-tests.yml` avec un service Postgres.

## Points ouverts
Voir `docs/REGISTRE-ECARTS.md` et `docs/audit-claude-2026-10-21.md`.
