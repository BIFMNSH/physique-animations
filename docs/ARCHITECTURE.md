# Architecture · NOHOBA-Lab

Site statique (Vercel, `main` déployé automatiquement) + serveur de comptes (`server/`, Railway, api.lab.nohaba.com).

## Moteur d'activités
`assets/activites/activite.js` : fiche = objet `window.FICHE_*`. Six écrans (Problématiser, Émettre une hypothèse, Expérimenter / Investiguer, Analyser et interpréter, Conclure, Communiquer). Fiche imprimable A4 (vierge, remplie, professeur). Données de l'élève : `localStorage` seulement.

## Collection Côte d'Ivoire 6e
- Catalogue : `assets/catalogues/6e-ci.js` (73 entrées, statuts `conception` / `prototype` / `disponible`).
- Fiches : `assets/activites/fiches/NL-CI-6E-*.js`. Page : `activites-ci/?a=<id>` (ELE-01 à 05, 07, 17 reconnus).
- Atelier partagé : `assets/shared/atelier-electrique.js`. Conductivité : `conductivite-modele.js`, `conductivite-circuit.js`.
- Hub : `parcours-ci/`. Collections : `collections/`.

## Tests
`cd qa && npm test` (jsdom 26.1.0) : regression, activites, catalogues-ci-fr, lot-ci-electricite.

## Points ouverts
Voir `docs/REGISTRE-ECARTS.md` et `docs/audit-claude-2026-10-21.md`.
