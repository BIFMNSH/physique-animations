# Scénarios : lot Mesures de 5e (tension et pression atmosphérique, 3 fiches)

Statut : **validé le 4 nov. 2026 et construit** : fiches `NL-5E-ELE-05`, `NL-5E-MES-01`, `NL-5E-MES-02`, modèles `assets/shared/elec5e.js` (tension) et `assets/shared/mesures5e.js` (pression), test `qa/activites-5e.cjs`. Reste à valider par le propriétaire. Branche `essai/lecon-ampoule`. Gabarit : `NL-5E-ELE-01` à `-04` (moteur 6e, page `activites-5e/`). Thème : Mesure de grandeurs physiques. Contexte : Awa, Kofi, Abidjan, mont Tonkoui, F CFA. Valeurs de simulation affichées comme telles.

Pour respecter « une activité = une seule compétence », la leçon sur la pression atmosphérique donne deux fiches.

| Fiche | Chapitre | Compétence unique | 1 Problématiser | 2 Hypothèse (4 choix) | 3 Manipulation | 4 Analyser | 5 Conclure / transfert | 6 Communiquer |
|---|---|---|---|---|---|---|---|---|
| `NL-5E-ELE-05` · Tension électrique | La tension électrique | Mesurer une tension avec un voltmètre | Awa veut savoir quelle tension a chaque lampe de son circuit en série | Même tension partout, somme, moitié, nulle | Banc 5e à deux lampes (L1 : 1,5 V ; L2 : 3 V sur pile de 4,5 V) : voltmètre aux bornes de G, L1, L2, K (fermé ou ouvert), fiches V et COM respectant la polarité | Comparer U(G) à U(L1) + U(L2) ; K ouvert : tension de la pile | U = U1 + U2 en série ; transfert : U(L2) = 9 V − 3,5 V = 5,5 V | Trace A4, grille, corrigé réservé |
| `NL-5E-MES-01` · Effets de la pression atmosphérique | La pression atmosphérique | Mettre en évidence l'existence de la pression atmosphérique | Kofi retourne un verre plein d'eau fermé par une carte : pourquoi l'eau ne tombe-t-elle pas ? | L'air pousse la carte, l'eau colle, la carte colle, le poids de l'eau est nul | Trois expériences au choix : verre et carte, bouteille dont on retire l'air, ventouse ; résultat qualitatif | Relier chaque effet à l'air qui presse dans toutes les directions | L'air exerce une pression sur tous les objets ; transfert : ventouse au mur | idem |
| `NL-5E-MES-02` · Pression et altitude | La pression atmosphérique | Lire un baromètre et relier la pression à l'altitude | Awa part d'Abidjan vers le mont Tonkoui : que lira son baromètre ? | Augmente, diminue, ne change pas, devient nulle | Lieux : Abidjan (0 m), mont Tonkoui (1 189 m), mont Nimba (1 752 m), Kilimandjaro (5 895 m), Everest (8 849 m) ; lecture en hPa (1 013 hPa au niveau de la mer) | Tracer ou lire le tableau altitude / pression | La pression diminue quand l'altitude augmente ; transfert : valeur à 5 000 m comparée à 1 013 hPa | idem |

Contraintes communes :
- Aucune notion hors lot (pas de formule de pression force/surface, pas de loi de Mariotte) ; unités hPa et cmHg (76 cmHg ≈ 1 013 hPa) pour la pression, V et mV pour la tension.
- Dessins nommés (SVG `role="img"` et `aria-label`) ; pour l'électricité, banc d'essai ; pour la pression, dessins originaux (verre, bouteille, ventouse, baromètre à cadran) sans reprise des figures du manuel.
- Modèle de pression : valeurs arrondies de la simulation Studio (même fonction réutilisée si elle est exportable, sinon table à cinq lieux) ; à confirmer.
- Le modèle de tension (L1 1,5 V, L2 3 V) est repris du cartable ; il passe dans `elec5e.js` pour ne pas charger tout le cartable.
- Pages : `activites-5e/` étend sa liste blanche à `ELE-05`, `MES-01`, `MES-02` ; `sw.js` et `qa/activites-5e.cjs` étendus.
- Points à confirmer : altitudes et pressions des cinq lieux, libellés Thème/Chapitre, source du programme.

Choix de construction : pression = atmosphère standard arrondie, comme la simulation Studio (Abidjan 1 013 hPa, Tonkoui 873, Nimba 817, Kilimandjaro 480, Everest 314) ; MES-01 propose six variantes (une avec effet et une témoin pour chaque expérience) et un schéma « air dehors / air dedans » ; le libellé « Schéma normalisé » du moteur s'applique aussi au cadran du baromètre (MES-02).
