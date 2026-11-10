# Scénarios : lot Matière de 5e (4 fiches sur le moteur des fiches de 6e)

Statut : **validé le 5 nov. 2026 et construit** (fiches `NL-5E-MAT-01` à `-04`, `assets/shared/matiere5e.js`, tests dans `qa/activites-5e.cjs`). Choix retenus par défaut : découpage 2 + 1 + 1 ; monoxyde de carbone en simple mention de sécurité dans MAT-03 ; indicateurs papier pH et permanganate conservés (simulation seulement). Branche `essai/lecon-ampoule`. Gabarit : fiches `NL-5E-MEL-01` à `-03` (moteur 6e, page `activites-5e/`). Thème : Mélanges et réactions chimiques. Leçons sources Studio (inchangées) : `atomes-molecules`, `combustion-carbone`, `combustion-soufre`. Contexte : Awa, Kofi, charbon de bois du marché, réchaud, soufre au laboratoire.

Trois leçons contiennent quatre compétences distinctes ; `atomes-molecules` est donc coupée en deux fiches (« une activité = une seule compétence »). Atomes en couleurs CPK (H blanc, C noir, O rouge, S jaune, N bleu, Cl vert).

| Fiche | Chapitre | Compétence unique | 1 Problématiser | 2 Hypothèse (4 choix) | 3 Manipulation (simulation) | 4 Analyser | 5 Conclure / transfert | 6 Communiquer |
|---|---|---|---|---|---|---|---|---|
| `NL-5E-MAT-01` · Atomes et molécules | Atomes et molécules | Relier la formule d'une molécule au nombre et à la nature de ses atomes | Kofi voit « H₂O » et « CO₂ » sur une affiche : que disent ces écritures ? | Un seul atome ; le chiffre indique le nombre d'atomes ; la lettre est le nom complet ; l'ordre n'a pas de sens | Choisir une molécule (dihydrogène, dioxygène, eau, dioxyde de carbone, méthane, ammoniac) : modèle CPK dessiné, atomes comptés, formule lue | Comparer formule et modèle : lettres = atomes, indice = nombre | Une lettre = un type d'atome ; un indice = nombre d'atomes ; transfert : atomes de CH₄ | idem |
| `NL-5E-MAT-02` · Corps simple, corps composé | Atomes et molécules | Classer un corps pur en corps simple ou corps composé d'après sa formule | Awa range les molécules de l'affiche : toutes sont-elles de même famille ? | Deux familles selon le nombre de types d'atomes ; selon le nombre total d'atomes ; selon l'état ; pas de classement | Dix molécules (H₂, O₂, N₂, Cl₂, H₂O, CO₂, CO, CH₄, NH₃, SO₂) : modèle CPK, types d'atomes comptés | Regrouper les modèles à un seul type d'atome et ceux à plusieurs | Corps simple : un seul type d'atome ; composé : au moins deux types ; transfert : O₂ ou CO₂ | idem |
| `NL-5E-MAT-03` · Combustion du carbone | La combustion du carbone | Identifier le rôle du dioxygène et le produit de la combustion du carbone | Kofi allume du charbon de bois : que devient-il, et que faut-il pour qu'il brûle ? | Brûle sans air ; brûle mieux dans le dioxygène ; disparaît sans rien former ; forme de l'eau seulement | Gaz (air, dioxygène, diazote) × flacon : chauffage réalisé par le professeur (simulation) ; eau de chaux qui se trouble ; bilan en atomes | Comparer les trois gaz : où le carbone brûle-t-il, qu'est-ce qui se forme | Carbone + dioxygène → dioxyde de carbone (eau de chaux trouble) ; transfert : réchaud sans aération (CO, danger) en conclusion qualitative | idem |
| `NL-5E-MAT-04` · Combustion du soufre | La combustion du soufre | Identifier le produit de la combustion du soufre et ses indices de formation | Awa observe en vidéo du soufre qui brûle avec une flamme bleue : un nouveau corps se forme-t-il ? | Rien ne se forme ; un gaz piquant se forme ; le soufre fond seulement ; la flamme est du soufre liquide | Flacon dioxygène ou air, chauffage réalisé par le professeur sous la hotte (simulation) ; indicateurs : papier pH humide, permanganate décoloré ; bilan en atomes | Relier flamme bleue, gaz suffocant et indicateurs à un nouveau corps | Soufre + dioxygène → dioxyde de soufre ; transfert : pourquoi ne pas respirer le gaz (pluies acides évoquées sans calcul) | idem |

## Garde-fous
- Toute flamme : protocole guidé par le professeur, élève sur simulation ; soufre sous la hotte, par le professeur seulement.
- Hors lot : équations équilibrées à coefficients, masse molaire, mole, noms systématiques complexes. Le bilan reste « en mots » et « en atomes comptés ».
- Vocabulaire : atome, molécule, formule, corps pur, corps simple, corps composé, réactif, produit, combustion, dioxygène, dioxyde de carbone, dioxyde de soufre.
- Aucun code interne ni « Programme du cycle 4 » affiché ; corrigé enseignant réservé.
- Statut des fiches : `prototype` jusqu'à validation du propriétaire.

## À valider
1. Découpage 2 + 1 + 1 (ou une seule fiche « atomes et molécules » ?).
2. Le monoxyde de carbone (réchaud mal aéré) reste-t-il une simple mention de sécurité dans MAT-03, ou une fiche à part plus tard ?
3. MAT-04 : indicateurs papier pH / permanganate conservés, ou seulement odeur et flamme (plus sûr) ?
