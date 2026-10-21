# Migration vers les 48 activités — lot 1 et pilote A04

Référence : *Matrice de migration* et *Dossier complet 4 thèmes* du 21/10/2026.

## Livré
- `assets/activites/catalogue.js` : les 48 activités (identifiant NL-C4, thème A–D, niveau, chapitre, objectif, décision, ressources historiques liées). Table de relation activité → ressource ; les ressources et URL historiques (`lecon/?l=…`, `simulateur/?s=…`) ne sont pas modifiées.
- `activites/` : catalogue et moteur à six écrans (situation, prévision, manipulation, confrontation, bilan, trace). Page `noindex` tant que l'ensemble n'est pas validé.
- `assets/activites/fiches/NL-C4-A04.js` : pilote A04 « Le sachet disparu » (modèle `masse-systeme-ferme-1.0`).
- `qa/activites.cjs` : recette (catalogue, références résolues, modèle A04, absence de réponse dans les textes élève).

## Choix
- Données élève : `localStorage` `pc-act-<id>` (versionné), sur l'appareil uniquement. Prévision initiale conservée même révisée ; essais jamais écrasés.
- Corrigé : seulement en mode enseignant, explicite, jamais dans la trace élève ni dans la fiche vierge/remplie.
- Boutons et onglets pleins en `#C2410C` (texte blanc, contraste ≥ 5:1) ; l'orange du logo `#F97316` reste un accent.

## Reste à faire (hors lot 1)
Habilitations côté serveur par thème, relecture scientifique, recette en classe, droits des médias, pilotes B02 / C06 / D06, lien depuis l'accueil.
