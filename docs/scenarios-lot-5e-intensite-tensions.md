# Scénarios : lot Intensité et lois du courant de 5e (5 fiches)

Statut : **à valider par le propriétaire, rien n'est construit.** Source : leçons « Intensité du courant électrique » et « Tension électrique » de la 5e (voir `docs/inventaire-jd-5e-3e.md`, activités Mesures 1 : n° 1, 3, 4, 5 ; Mesures 2 : n° 5). Thème : Mesure de grandeurs physiques. Contexte : Awa, Kofi, Abidjan, lampes et piles de la classe. Valeurs de simulation affichées comme telles.

Suite directe de `NL-5E-ELE-05` (mesurer une tension, banc 5e, branche `feat/fiches-5e-investigation`, PR n° 25) : même banc, même style (fond blanc, modules sur socle noir, câbles souples à fiches banane, pile plate à deux languettes identiques, lampe sur support à deux douilles).

Une activité = une compétence : la leçon donne cinq fiches. Les activités « analyse de document » de la leçon (appareil de mesure, définition de la tension) restent dans « Retiens l'essentiel » et le Livre vivant.

| Fiche | Chapitre | Compétence unique | 1 Problématiser | 2 Hypothèse (4 choix) | 3 Manipulation | 4 Analyser | 5 Conclure / transfert | 6 Communiquer |
|---|---|---|---|---|---|---|---|---|
| `NL-5E-INT-01` · Notion d'intensité | Intensité du courant | Comparer des courants d'intensités différentes grâce à leurs effets | Kofi branche une ou plusieurs piles : pourquoi la lampe brille-t-elle plus fort ? | Même courant, plus de courant, moins de courant, pas de courant | 1 à 3 piles en concordance × lampe ou moteur ; effet lu : éclat de la lampe, vitesse du moteur ; ampèremètre affiché ensuite | Relier un effet plus marqué à une intensité plus grande | L'intensité mesure la quantité de courant qui circule ; unité : l'ampère (A) ; transfert : quelle lampe brille le plus ? | Trace A4, grille, corrigé réservé |
| `NL-5E-INT-02` · Mesurer une intensité | Intensité du courant | Mesurer une intensité avec un ampèremètre monté en série | Awa veut connaître l'intensité du courant dans sa lampe | Brancher en dérivation, en série, aux bornes de la pile, n'importe où | Banc 5e : ampèremètre en série à un endroit choisi (avant L1, après L1, après L2) ou mal branché en dérivation ; fiches A et COM, calibre ; lecture en mA | Comparer les montages : lecture normale, lecture nulle (circuit ouvert), court-circuit signalé | L'ampèremètre se place en série, dans le circuit ; transfert : lire une valeur sur un calibre | idem |
| `NL-5E-INT-03` · Intensité en série | Lois des intensités | Établir que l'intensité est la même en tout point d'un circuit en série | Le courant s'use-t-il en traversant la première lampe ? | Plus fort avant L1, plus fort après L2, partout pareil, nul après L1 | Circuit série pile + L1 + L2 + K ; ampèremètre en 4 positions (près de +, entre L1 et L2, près de −, K) ; lecture en mA | Comparer les quatre lectures | En série, l'intensité est la même en tout point ; transfert : I connue en un point, I ailleurs | idem |
| `NL-5E-INT-04` · Intensité en dérivation | Lois des intensités | Établir la relation entre l'intensité dans la branche principale et celles des branches dérivées | Awa a deux lampes en dérivation : le courant de la pile se partage-t-il ? | I = I1 + I2, I = I1, I = I2, I = I1 − I2 | Circuit dérivation pile + L1 // L2 ; ampèremètre dans la branche principale, dans L1, dans L2 | Comparer I à I1 + I2 | En dérivation, I = I1 + I2 ; transfert : trouver I2 connaissant I et I1 | idem |
| `NL-5E-TEN-01` · Tension en dérivation | Lois des tensions | Établir que des dipôles en dérivation ont la même tension à leurs bornes | Deux lampes en dérivation sur la même pile : ont-elles la même tension ? | Même tension que la pile, somme, moitié, nulle | Circuit dérivation ; voltmètre aux bornes de G, L1, L2 ; deux lampes de natures différentes (1,5 V et 3 V) | Comparer U(G), U(L1), U(L2) | En dérivation, la tension est la même aux bornes des branches ; transfert : tension aux bornes d'une prise de 220 V pour deux appareils | idem |

## Décisions de conception proposées
- **Loi des tensions en série** (activité 4) : déjà traitée dans la conclusion et le transfert de `NL-5E-ELE-05` (U = U1 + U2). Pas de fiche en plus ; à relire lors du contrôle.
- **Modèle** : nouveau modèle testable `NohobaIntensite` (comme `NohobaCommande`), qualitatif et numérique simple : pile 6 V, L1 = 40 Ω et L2 = 60 Ω pour des valeurs rondes (série : 60 mA ; dérivation : 150 mA + 100 mA = 250 mA). `ELE-05` garde 4,5 V. Aucune loi d'Ohm (programme de 3e) : les valeurs sont des mesures de simulation, pas un calcul demandé à l'élève.
- **Ampèremètre** : symbole A dans un cercle, fiches A et COM, lecture en mA (calibre 200 mA, puis 2 A pour la dérivation). Conversion mA ↔ A hors lot, sauf une ligne dans le bilan.
- **Mauvais branchement** : l'ampèremètre en dérivation aux bornes de la pile affiche un court-circuit (signal qualitatif, sans danger, et rappel de la règle de sécurité) ; pas de composant « grillé » sans explication.
- **Dessins** : banc 5e réutilisé (`pileM`, `lampeM`, `interM`, `cab`) ; ajout d'un module ampèremètre sur socle noir, dessin original ; schéma normalisé à côté du montage réaliste dans chaque fiche. Aucune figure du manuel reprise.
- **Pages et tests** : `activites-5e/` étend sa liste blanche ; test dédié (`qa/lot-5e-intensite.cjs`) pour le modèle (valeurs, lois, mauvais branchement) ; statut `prototype`.

## Points à confirmer
- Valeurs de la pile et des lampes (6 V, 40 Ω, 60 Ω) et calibres de l'ampèremètre.
- Libellé Thème/Chapitre et numéros de page du manuel (lecture assistée).
- Faut-il aussi une fiche de tension en série avec d'autres valeurs (renforcement) ?
- Ordre de construction : INT-02 d'abord (les autres s'appuient sur l'ampèremètre).
