# Audit des étiquettes des scènes sur téléphone (360 px)

Mesure faite le 26/10/2026 sur les 53 leçons (onglet simulation), écran de 360 px en portrait, thème sombre.
Taille affichée = taille de la police SVG × échelle réelle de la scène à l'écran.

## Résultats

- Les 53 scènes ont **toutes** leurs étiquettes sous 11 px ; la plus petite va de 3,2 à 6,3 px (médiane 3,6 px).
- 38 scènes sur 53 portent 15 étiquettes ou plus : trop denses pour une simple mise à l'échelle.
- Essai d'un agrandissement automatique dans le moteur (minimum 11 px, sans recouvrement) : la plus petite étiquette passe de 3,6 à 6,1 px en médiane, mais 6 scènes de plus se mettent à avoir des textes qui se touchent (5 → 11). **Abandonné** : le gain est trop faible pour le risque sur des scènes validées.
- Conclusion : la règle automatique ne suffit pas. Il faut recomposer les scènes en portrait, par lots. Le bouton « Agrandir » (scène tournée en paysage) reste le palliatif en attendant.

## Ordre de travail proposé

Lot 1 : les leçons de 6e (collection Côte d'Ivoire), de la plus chargée à la moins chargée ; puis 5e, 4e, 3e.
Colonne « Étiquettes » = nombre de textes visibles dans la scène ; « Plus petite » = taille affichée de la plus petite étiquette (px).

| Leçon | Étiquettes | Plus petite (px) |
|---|---|---|
| 6e/volume | 36 | 3,4 |
| 6e/changements-etat | 28 | 3,2 |
| 6e/temperature | 23 | 3,8 |
| 6e/circuit-electrique | 20 | 3,4 |
| 6e/masse | 20 | 3,4 |
| 6e/les-gaz | 19 | 3,8 |
| 6e/constituants-air | 18 | 3,8 |
| 6e/combustion-gaz | 17 | 3,4 |
| 6e/combustion-solide-liquide | 16 | 4,1 |
| 6e/commande-circuit | 16 | 4,1 |
| 6e/court-circuit | 16 | 3,4 |
| 6e/solides-liquides | 16 | 3,8 |
| 6e/dangers-combustions | 13 | 4,1 |
| 5e/piles-serie | 23 | 3,4 |
| 5e/dilatation-liquides | 18 | 3,4 |
| 5e/dilatation-solides | 17 | 3,4 |
| 5e/generateur-recepteur | 17 | 4,1 |
| 5e/association-lampes | 16 | 3,8 |
| 5e/atomes-molecules | 16 | 4,1 |
| 5e/combustion-carbone | 15 | 3,4 |
| 5e/combustion-soufre | 15 | 3,4 |
| 5e/dilatation-gaz | 15 | 3,4 |
| 5e/pression-atmospherique | 13 | 3,4 |
| 5e/intensite | 9 | 4,1 |
| 5e/melanges | 9 | 3,8 |
| 5e/tension | 7 | 4,1 |
| 4e/traitement-eau | 28 | 3,4 |
| 4e/qualite-eau | 26 | 3,6 |
| 4e/tension-alternative | 24 | 3,7 |
| 4e/transfo-redressement | 19 | 4,1 |
| 4e/dangers-secteur | 14 | 3,3 |
| 4e/metal-ion | 12 | 4 |
| 4e/tension-sinusoidale | 12 | 4,1 |
| 4e/atomes-ions | 9 | 3,4 |
| 4e/aimant-bobine | 7 | 5,6 |
| 4e/phases-eclipses | 7 | 4,1 |
| 4e/lumiere-blanche | 5 | 3,8 |
| 4e/sources-recepteurs | 4 | 4,5 |
| 4e/propagation-lumiere | 2 | 6,3 |
| 3e/alcanes | 41 | 3,4 |
| 3e/masse-poids | 39 | 3,2 |
| 3e/conducteur-ohmique | 32 | 3,4 |
| 3e/electrolyse-eau | 29 | 3,2 |
| 3e/lentilles | 27 | 3,2 |
| 3e/solutions-acides-basiques | 26 | 3,6 |
| 3e/defauts-oeil | 24 | 3,6 |
| 3e/puissance-energie-electriques | 24 | 3,6 |
| 3e/energie-mecanique | 22 | 3,6 |
| 3e/oxydation-corps-purs | 21 | 3,8 |
| 3e/equilibre-deux-forces | 20 | 4,1 |
| 3e/travail-puissance | 18 | 3,8 |
| 3e/reduction-oxydes | 15 | 3,2 |
| 3e/les-forces | 14 | 4,1 |

## Critères d'acceptation d'une scène recomposée

- Étiquettes d'au moins 12 px affichés à 360 px de large, sans chevauchement ni débordement.
- `role="img"` et `aria-label` conservés ; couleurs CPK ; chiffres sans barre.
- Glisser-déposer et commandes inchangés ; `cd qa && npm test` vert ; une capture à 360 px par scène.
- Le rendu ordinateur (1280 × 720) ne change pas.
