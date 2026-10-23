---
name: nohoba-nouvelle-activite
description: Construire une fiche d'investigation NOHOBA-Lab (6e Côte d'Ivoire) à partir d'un scénario validé : fiche JS, simulation, catalogue, tests.
---

# Construire une activité NOHOBA-Lab

Pré-requis : le scénario du lot a été validé par le propriétaire (tableau de scénarios). Lire `CLAUDE.md` d'abord.

## Étapes
1. Copier `gabarit-fiche.js` vers `assets/activites/fiches/NL-CI-6E-<THÈME>-<nn>.js` et le remplir. Nom global : `FICHE_CI_<THÈME><nn>`.
2. Écrire la simulation dans `manip(panel, X)` :
   - Utiliser `NohobaAtelier.paire(parent, h)` pour afficher le montage et le schéma normalisé côte à côte ; les mettre à jour ensemble.
   - Contrôles : boutons radio ou listes avec étiquettes ; zone d'observation (`NohobaAtelier.saisie`) quand l'élève doit décrire ce qu'il voit.
   - Enregistrer chaque essai avec `X.addEssai({...})` ; le tableau vient de `lignes(st)`.
   - Définir `peutConfronter(st)` : ce qui doit être fait avant l'analyse (un contraste d'observations au minimum).
3. Rédiger les champs : situation contextualisée (Awa, Kofi…), matériel, prévision (4 choix, un seul juste), protocole, variable et maintenu, confrontation, rétroaction, transfert (question + réponse + explication), synthèse, `prof` (référence, attendus, erreurs), `grilleMaitrise` (MI, MF, MS, TBM), aides progressives, `situationEvaluation`.
4. Passer l'entrée du catalogue à `prototype` dans `assets/catalogues/6e-ci.js`. Ajouter l'id à la liste autorisée de `activites-ci/index.html` (expression régulière) et au hub `parcours-ci/index.html`.
5. Ajouter les cas de test dans `qa/lot-ci-<theme>.cjs` : règles physiques du modèle (tous les cas de la manipulation), progression, structure, absence de code interne.
6. `cd qa && npm test`. Puis une seule capture de contrôle par fiche (voir `nohoba-controle-conformite`).
7. Mettre à jour `docs/REGISTRE-ECARTS.md` pour tout écart avec le programme, le manuel ou le TP.

## Règles du modèle
- Modèle qualitatif, explicite sur ses limites. Aucune valeur numérique inventée présentée comme mesure.
- Une seule compétence ; un seul changement de variable à la fois dans la simulation.
- Corrigés : pour l'instant `prof.reference` est public (comme ELE-07). Ne jamais y mettre de limites du modèle ou de différenciation sensibles : elles iront côté serveur.
