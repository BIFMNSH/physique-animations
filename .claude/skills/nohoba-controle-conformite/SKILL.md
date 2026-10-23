---
name: nohoba-controle-conformite
description: Contrôle final d'une fiche ou d'un lot NOHOBA-Lab avant commit : tests, captures, charte, impression, accessibilité.
---

# Contrôle de conformité (une fois par lot)

1. `cd qa && npm test` : tout vert.
2. Parcours réel : serveur statique local, ouvrir `activites-ci/?a=<id>`, faire le parcours complet d'une fiche (prévision, essais, analyse, bilan, trace). Aucune erreur console. Une seule capture par fiche.
3. Charte : pas de code interne affiché, libellé « À la fin de cette partie… », une seule compétence, repères locaux, largeur utilisée, pas de défilement horizontal à 390 px.
4. Impression : aperçu A4 (fiche vierge et remplie) lisible, tableaux non coupés.
5. Accessibilité : clavier, étiquettes, noms des images, mouvement réduit.
6. Registre des écarts à jour ; points à confirmer listés au propriétaire.
7. Commit, push sur la branche ; vérifier avec `git ls-remote origin refs/heads/<branche>` (les alertes « commits non poussés » viennent souvent d'une référence de suivi périmée).
