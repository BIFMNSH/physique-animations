# Scénarios : lot Électricité de 5e (3 fiches sur le moteur des fiches de 6e)

Statut : **validé le 4 nov. 2026 et construit** : fiches `NL-5E-ELE-02`, `-03`, `-04`, modèle et dessins `assets/shared/elec5e.js`, test `qa/activites-5e.cjs`. Reste à valider par le propriétaire (captures bureau et téléphone faites). Branche `essai/lecon-ampoule`. Gabarit : `NL-5E-ELE-01` (déjà fait). Thème : Électricité. Contexte : Awa, Kofi, B12, 220 V, F CFA. Manipulations sur le banc (`pileM`, `lampeM`, `moteurM`, `cab`, schéma normalisé aligné), valeurs de simulation affichées comme telles.

| Fiche | Chapitre | Compétence unique | 1 Problématiser | 2 Hypothèse (4 choix) | 3 Manipulation | 4 Analyser | 5 Conclure / transfert | 6 Communiquer |
|---|---|---|---|---|---|---|---|---|
| `NL-5E-ELE-02` · Adaptation d'un générateur à un récepteur | Générateur et récepteur | Choisir un générateur dont la tension convient à un récepteur | Kofi a une lampe 6 V et plusieurs piles : laquelle choisir ? | Tension plus faible, égale, plus forte, indifférent | Récepteur (lampe 1,5 / 4,5 / 6 / 12 V, moteur 6 V) × générateur (1,5 / 4,5 / 6 / 9 / 12 V) ; état lu : éteint, sous-tension, normal, surtension, grillée | Comparer l'état à la tension nominale lue sur le récepteur | Adapté = tension du générateur égale à la tension nominale ; transfert : moteur 6 V sur pile 4,5 V | Trace A4, grille, corrigé réservé |
| `NL-5E-ELE-03` · Association de lampes | Lampes en série et en dérivation | Distinguer un montage en série d'un montage en dérivation | Deux pièces à éclairer : si une lampe est dévissée, l'autre doit rester allumée | Série, dérivation, les deux, aucun | Montage série ou dérivation × lampe dévissée (aucune, L1, L2) ; éclat de chaque lampe | Comparer l'éclat seule, en série, en dérivation ; effet d'une lampe dévissée | Dérivation : lampes indépendantes ; transfert : installation de la maison (220 V) | idem |
| `NL-5E-ELE-04` · Association de piles en série | Piles en série | Prévoir la tension d'une association de piles selon leur sens | Une seule pile ne donne pas la tension voulue | Somme, une seule, différence, moyenne | 1 à 3 piles, sens (concordance ou opposition), lampe ; tension totale lue au voltmètre (banc 5e) | Comparer U mesurée à U1 + U2 + U3, signes en opposition | U = somme en concordance ; opposition : soustraction ; transfert : pile plate 4,5 V = 3 × 1,5 V | idem |

Contraintes communes :
- Ordre d'écriture des lampes : verre isolant ; deux douilles ; polarité respectée (câble rouge sur la borne +).
- Une seule compétence par fiche ; aucune notion hors lot (pas d'intensité calculée, pas de résistance).
- `activites-5e/` : liste blanche étendue à 02, 03, 04 ; `sw.js` mis à jour ; test `qa/activites-5e.cjs` étendu par fiche (structure, manipulation, règle du modèle, hors-ligne).
- Les simulations Studio existantes (`assets/studio/lecons/*.js`) ne sont pas modifiées : les fiches s'ajoutent à côté.
- Points à confirmer : tensions nominales proposées (valeurs de la leçon Studio), libellés Thème/Chapitre, programme à citer.

Choix de construction : ELE-03 en dérivation range L2 sous L1 (cables chaînés sur les douilles de L1, sans croisement) ; ELE-04 propose cinq associations prédéfinies (1 pile ; 2 ou 3 dans le même sens ; 2 ou 3 dont une retournée, jamais la première) pour que le voltmètre lise toujours une valeur positive ; schéma des dérivations et des piles dessinés à la main (`A.schema` ne couvre que la série).
