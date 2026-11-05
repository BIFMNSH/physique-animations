# Scénarios : lot Dilatation de 5e (4 fiches sur le moteur des fiches de 6e)

Statut : **validé le 5 nov. 2026 et construit** (fiches `NL-5E-DIL-01` à `-04`, `assets/shared/dilatation5e.js`, tests dans `qa/activites-5e.cjs`). Choix retenus par défaut : solides en deux fiches ; classement qualitatif seulement dans DIL-02 ; pression d'une bouteille fermée en simple mention de sécurité dans DIL-04. Branche `essai/lecon-ampoule`. Gabarit : fiches `NL-5E-MAT-01` à `-04`, `MEL-01` à `-03` (moteur 6e, page `activites-5e/`, atelier `NohobaElec5e.atelier`). Thème : Propriétés physiques de la matière. Leçons sources Studio (inchangées) : `dilatation-solides`, `dilatation-liquides`, `dilatation-gaz`. Contexte : Awa, Kofi, rails de la gare d'Abidjan, thermomètre du dispensaire, bouteille de gaz du marché.

Trois leçons, quatre compétences : la leçon « solides » est coupée en deux fiches (effet de la température ; comparaison des métaux), car « une activité = une seule compétence ».

| Fiche | Chapitre | Compétence unique | 1 Problématiser | 2 Hypothèse (4 choix) | 3 Manipulation (simulation) | 4 Analyser | 5 Conclure / transfert | 6 Communiquer |
|---|---|---|---|---|---|---|---|---|
| `NL-5E-DIL-01` · Un solide chauffé | La dilatation des solides | Relier la variation de température à la variation de dimension d'un solide | Kofi n'arrive plus à passer la boule métallique dans l'anneau après l'avoir chauffée : que s'est-il passé ? | La boule grossit ; reste identique ; rétrécit ; l'anneau seul change | Boule et anneau : état de la boule (froide, chauffée, refroidie) × passage dans l'anneau ; chauffage réalisé par le professeur | Comparer boule froide, chauffée, refroidie : quand passe-t-elle ? | Un solide chauffé se dilate, refroidi il se contracte ; transfert : joint de dilatation des rails (sans valeur numérique) | Trace A4, grille, corrigé réservé |
| `NL-5E-DIL-02` · Des métaux différents | La dilatation des solides | Comparer la dilatation de solides de nature différente | Awa se demande si le fer, le cuivre et l'aluminium s'allongent pareil quand on les chauffe | Tous identiques ; le fer le plus ; l'aluminium le plus ; aucun ne change | Trois barres de même longueur (fer, cuivre, aluminium) × chauffage identique : allongements dessinés et classés, sans coefficient | Classer les barres d'après l'allongement | Ordre qualitatif : aluminium > cuivre > fer ; transfert : choisir le métal d'un fil de ligne électrique (laisser du jeu) | idem |
| `NL-5E-DIL-03` · Un liquide chauffé | La dilatation des liquides | Relier la variation de température au volume d'un liquide (principe du thermomètre) | Le thermomètre du dispensaire : pourquoi le liquide monte-t-il quand la température monte ? | Le volume augmente ; reste constant ; diminue ; le tube se dilate seul | Liquide (eau colorée, huile, alcool) × bain (glace, ambiant, chaud) : niveau dans le tube comparé au repère | Comparer les niveaux pour chaque liquide et chaque bain | Un liquide chauffé se dilate, refroidi il se contracte ; l'alcool se dilate plus que l'eau ; transfert : lecture d'un thermomètre | idem |
| `NL-5E-DIL-04` · Un gaz chauffé | La dilatation des gaz | Relier la variation de température au volume d'un gaz | Awa plonge un ballon de verre coiffé d'un ballon de baudruche dans l'eau chaude : pourquoi se gonfle-t-il ? | Le volume augmente ; reste constant ; diminue ; l'air disparaît | Bain (glace, ambiant, chaud, chaleur des mains) : ballon de baudruche gonflé ou dégonflé, bulles dans le tube | Comparer l'état du ballon selon le bain | Un gaz chauffé se dilate plus que liquides et solides ; transfert : bouteille de gaz fermée et pression, loin de la chaleur | idem |

## Garde-fous
- Toute flamme ou bain très chaud : protocole guidé par le professeur, élève sur simulation.
- Hors lot : coefficients de dilatation, formules, loi des gaz parfaits, explication microscopique, anomalie de l'eau à 4 °C. Les comparaisons restent qualitatives.
- Vocabulaire : dilatation, contraction, volume, longueur, repère, joint de dilatation, thermomètre.
- Aucun code interne ni « Programme du cycle 4 » affiché ; corrigé enseignant réservé.
- Statut des fiches : `prototype` jusqu'à validation du propriétaire.

## À valider
1. Découpage 2 + 1 + 1 (solides en deux fiches) ou trois fiches, une par leçon ?
2. DIL-02 : classement qualitatif seulement (aluminium > cuivre > fer), sans aucune valeur chiffrée ?
3. DIL-04 : la pression dans une bouteille fermée reste-t-elle une simple mention de sécurité dans le transfert ?
