# Conception des lots 5e (complément) et 3e à partir des activités des manuels JD

Statut : **plan de conception à valider**, rien n'est construit. Entrées : `docs/inventaire-jd-5e-3e.md` (153 activités : 71 en 5e, 82 en 3e) et le classeur de travail `activites-jd-5e-3e.xlsx` (non versionné). Les manuels restent hors du dépôt : seules la structure et les habiletés sont utilisées, consignes et figures sont originales.

Méthode : ce document donne le plan de tous les lots (une ligne par fiche). Le **tableau de scénarios détaillé** (six opérations, montage et schéma, hypothèses à quatre choix) se fait **lot par lot**, dans une conversation par lot, puis validation, puis construction. Le premier lot (`docs/scenarios-lot-5e-intensite-tensions.md`) est déjà détaillé.

## 1. Règles de conception communes
- **Une activité du site = une compétence.** Une activité « Expérimente » du manuel donne une fiche de simulation. Une activité « Analyse un document » donne une fiche seulement si elle porte une compétence manipulable (classer, lire, calculer, construire, choisir) ; sinon elle reste dans « Retiens l'essentiel » et le Livre vivant.
- **Plusieurs activités du manuel peuvent nourrir une fiche** quand elles travaillent la même compétence ; une activité qui en travaille deux est coupée.
- Neuf moments affichés, six opérations côté professeur et sur la trace A4. Statut `prototype` ; seul le propriétaire passe une fiche en `disponible`.
- Repères ivoiriens : Awa, Kofi, Abidjan, 220 V, CIE, F CFA ; aucun prix inventé (tarifs à fournir par le propriétaire).
- Électricité : banc d'essai (fond blanc, modules sur socle noir, câbles à fiches banane ou pinces crocodiles) avec montage réaliste et schéma normalisé côte à côte. Atomes en couleurs CPK. Zéros sans barre.
- **Sécurité** : toute flamme, combustion vive, thermite, mélange de gaz inflammables ou produit corrosif est une **démonstration guidée par le professeur** ; l'élève investigue sur simulation. Aucune quantité ni protocole détaillé de manipulation réelle dans les fiches.
- Accessibilité : étiquettes, SVG `role="img"` et `aria-label`, mouvement réduit, pas de défilement horizontal, impression A4 vérifiée.
- Chaque fiche : modèle de simulation **testable** (`qa/`), pas de nouvelle notion hors lot.

## 2. Architecture à prévoir
| Élément | 5e | 3e |
|---|---|---|
| Page générique | `activites-5e/` (PR n° 25) | `activites-3e/` (à créer sur le même modèle) |
| Catalogue | `assets/catalogues/5e-ci.js` (à créer ; statuts `conception`, `prototype`, `disponible`) | `assets/catalogues/3e-ci.js` |
| Fiches | `NL-5E-<LOT>-nn.js` | `NL-3E-<LOT>-nn.js` |
| Modèles testables | `NohobaIntensite`, `NohobaPanne`, `NohobaDilatation5e`, `NohobaEquation5e`… | `NohobaOhm`, `NohobaEnergie`, `NohobaLentille`, `NohobaForces`, `NohobaChimie3e`… |
| Dessins | `elec5e.js`, banc 5e, `chimie-dessins.js` (atomes CPK) | mêmes outils + modules lentille, dynamomètre, bécher, électrolyseur (originaux) |
| Tests | `qa/lot-5e-<lot>.cjs` | `qa/lot-3e-<lot>.cjs` |
| Cache hors-ligne | `sw.js` mis à jour à chaque lot | idem |

**Dépendance** : les lots 5e s'appuient sur le banc et les pages de la PR n° 25 (non fusionnée) ; les lots 3e réutilisent le même moteur. Fusionner la n° 25 avant de construire, ou construire sur une branche qui en dérive.

## 3. Lots 5e (complément) : 20 fiches
Déjà couvert : 18 fiches (PR n° 25). Les lignes ci-dessous sont les fiches à ajouter.

| Lot | Fiche | Activités | Compétence unique | Manipulation simulée |
|---|---|---|---|---|
| **INT** (5 fiches, détaillées) | INT-01 à 04, TEN-01 | Mesures 1 n° 1, 3, 4, 5 ; Mesures 2 n° 5 | Voir `scenarios-lot-5e-intensite-tensions.md` | Banc 5e, ampèremètre, valeurs rondes (mA) |
| **PAN** | PAN-01 | Élec. 2 n° 2, 4 | Prévoir l'effet d'une lampe en panne en série et en dérivation | Lampe dévissée dans chaque montage ; éclat des autres lampes |
| | PAN-02 | Élec. 2 n° 2, 4 | Prévoir l'effet d'un court-circuit en série et en dérivation | Fil placé en parallèle d'une lampe ; signal de court-circuit (sans danger) |
| | PAN-03 | Élec. 2 n° 5 | Choisir série ou dérivation selon un besoin | Cahiers des charges (lampes indépendantes, une seule commande…) ; réutilise `NohobaCommande` |
| **DIL** | DIL-05 | Liquides n° 5 ; Gaz n° 6 | Classer solide, liquide, gaz selon l'importance de la dilatation | Même variation de température, trois états ; comparaison de variations de volume |
| | DIL-06 | Liquides n° 2 ; Gaz n° 3 | Identifier les facteurs dont dépend la dilatation d'un liquide ou d'un gaz | Variables : nature, volume initial, variation de température (une à la fois) |
| | DIL-07 | Gaz n° 4, 5 | Reconnaître les situations dangereuses avec une bombe aérosol | Classement de situations (soleil, flamme, perçage) en sûres ou dangereuses ; aucun essai réel |
| | DIL-08 | Solides n° 4, 5, 6 ; Liquides n° 4 | Relier une application (joint, bilame, emmanchement, vase d'expansion) à la dilatation qui la justifie | Appariement application ↔ principe |
| **MAT** | MAT-05 | Carbone n° 3 ; Soufre n° 3 | Écrire l'équation-bilan d'une combustion | Pièces : réactifs, produits, formules ; vérification par le modèle |
| | MAT-06 | Carbone n° 4 | Montrer la conservation des atomes dans une réaction | Modèle de boules CPK avant/après ; comptage par élément |
| | MAT-07 | Carbone n° 6 | Relier un pictogramme de danger à son message | Pictogrammes officiels du domaine public (voir CHI-19), messages ; classement |
| | MAT-08 | Carbone n° 5, 7 ; Soufre n° 4, 5, 6 | Relier un gaz produit (CO₂, SO₂) à son effet et à une action de protection | Cartes cause → effet → action, pluies acides incluses |
| | MAT-09 | Atomes n° 2 | Associer le nom d'un atome à son symbole | Appariement, couleurs CPK |
| | MAT-10 | Atomes n° 5 | Représenter une molécule avec un modèle moléculaire | Construction à boules (H₂O, CO₂, O₂, CH₄…) à partir de la formule |
| **PRE** | PRE-01 | Pression n° 4 | Distinguer dépression et surpression par rapport à la pression atmosphérique | Récipient et manomètre ; comparaison à 1 013 hPa |
| | PRE-02 | Pression n° 5 | Lire une carte météorologique (anticyclone, dépression) | Carte simplifiée originale, lecture de valeurs |

Non traitées (lecture) : définitions et appareils (Élec. 1 n° 1, 2, 4 ; Mesures 1 n° 2 ; Mesures 2 n° 1, 2 ; Atomes n° 1, 3), applications des piles (Élec. 3 n° 2). Mélanges n° 8 est déjà couvert par MEL-02 et MEL-03.

## 4. Lots 3e : 54 fiches
Aucune fiche n'existe. Les leçons « Livre vivant » 3e correspondantes sont à rapprocher avant la rédaction des scénarios.

| Lot | Fiche | Activités | Compétence unique | Manipulation simulée |
|---|---|---|---|---|
| **ELE** (13) | ELE-01 | Puissance n° 1 | Lire la puissance et la tension nominales d'un appareil | Plaques signalétiques (lampe, fer, ventilateur) |
| | ELE-02 | Puissance n° 2 | Établir la relation P = U × I | Mesures U et I sur un appareil, calcul |
| | ELE-03 | Puissance n° 3 | Calculer l'énergie électrique consommée E = P × t | Durée et puissance variables, kWh |
| | ELE-04 | Puissance n° 4, 5 | Identifier la forme d'énergie reçue et fournie par un dispositif (moteur, dynamo, lampe) | Chaîne d'énergie à compléter |
| | ELE-05 | Puissance n° 6 | Calculer le rendement d'un dispositif | Énergie utile et énergie reçue |
| | ELE-06 | Puissance n° 7 | Interpréter une facture d'électricité | Facture fictive affichée comme telle ; **tarif à fournir par le propriétaire** |
| | OHM-01 | Ohmique n° 1, 5 | Déterminer la valeur d'une résistance par le code des couleurs | Anneaux colorés à lire |
| | OHM-02 | Ohmique n° 4 | Mesurer une résistance à l'ohmmètre | Banc, ohmmètre, hors tension |
| | OHM-03 | Ohmique n° 3 | Établir la relation entre U et I pour un conducteur ohmique | Tracé de la caractéristique, coefficient directeur |
| | OHM-04 | Ohmique n° 2 | Prévoir l'effet d'un conducteur ohmique sur l'intensité | Lampe et résistance en série |
| | OHM-05 | Ohmique n° 6 | Calculer la résistance équivalente en série | Deux ou trois conducteurs |
| | OHM-06 | Ohmique n° 7 | Calculer la résistance équivalente en dérivation | Deux conducteurs |
| | OHM-07 | Ohmique n° 8 | Prévoir la tension aux bornes d'un conducteur dans un diviseur de tension | Deux conducteurs en série, voltmètres |
| **OPT** (10) | OPT-01 | Lentilles n° 1, 2 | Reconnaître une lentille convergente ou divergente | Forme, faisceau, symbole |
| | OPT-02 | Lentilles n° 3 | Déterminer le foyer et la distance focale | Banc d'optique simulé |
| | OPT-03 | Lentilles n° 4, 5 | Relier vergence et distance focale (C = 1/f) | Calcul, signe de la vergence |
| | OPT-04 | Lentilles n° 6 | Prévoir les caractéristiques de l'image selon la position de l'objet | Objet déplacé, image réelle ou virtuelle, droite ou renversée |
| | OPT-05 | Lentilles n° 7 | Construire l'image d'un objet par une lentille convergente | Rayons à placer, échelle |
| | OPT-06 | Lentilles n° 8 | Déterminer le grandissement | Mesures de A'B' et AB |
| | OPT-07 | Lentilles n° 9 | Associer chaque élément de l'appareil photographique à son rôle | Schéma original |
| | OPT-08 | Œil n° 1 | Associer chaque élément de l'œil à son rôle | Schéma original |
| | OPT-09 | Œil n° 2 | Reconnaître la myopie et l'hypermétropie | Œil simulé, image avant ou après la rétine |
| | OPT-10 | Œil n° 3, 4 | Choisir la lentille qui corrige un défaut de l'œil | Lentille ajoutée, image sur la rétine |
| **MEC** (14) | MEC-01 | Masse n° 2 | Calculer la masse volumique d'une substance | Mesures m et V |
| | MEC-02 | Masse n° 3 | Mesurer un poids avec un dynamomètre | Masses marquées |
| | MEC-03 | Masse n° 4 | Distinguer masse et poids | Même masse sur deux astres, lecture de g |
| | MEC-04 | Masse n° 5 | Établir la relation P = m × g | Tableau, proportionnalité ; **valeur de g à confirmer (9,8 ou 10 N/kg)** |
| | MEC-05 | Forces n° 1, 2 | Donner les caractéristiques d'une force | Point d'application, direction, sens, valeur |
| | MEC-06 | Forces n° 3 | Représenter une force par un vecteur | Échelle, construction |
| | MEC-07 | Forces n° 4, 5 | Établir la valeur de la poussée d'Archimède | Dynamomètre, solide immergé |
| | MEC-08 | Forces n° 7 | Reconnaître des forces de contact (réaction, tension d'un fil, frottement) | Situations à classer |
| | MEC-09 | Équilibre n° 1, 2 | Établir les conditions d'équilibre d'un solide soumis à deux forces | Forces à ajuster |
| | MEC-10 | Équilibre n° 3 | Prévoir si un corps flotte | Comparaison poids et poussée |
| | MEC-11 | Travail n° 1, 2 | Calculer le travail du poids d'un corps | Déplacement vertical, signe |
| | MEC-12 | Travail n° 3 | Distinguer travail moteur et travail résistant | Situations à classer |
| | MEC-13 | Énergie n° 1, 2, 3 | Calculer énergie cinétique, potentielle et mécanique | Masse, vitesse, hauteur |
| | MEC-14 | Énergie n° 4, 5 | Montrer la conservation de l'énergie mécanique | Chute, graphique des énergies |
| **CHI** (17) | CHI-01 | Électrolyse n° 1, 2 | Identifier le gaz formé à chaque électrode | Électrolyseur simulé, tests des gaz en vidéo originale ou schéma |
| | CHI-02 | Électrolyse n° 3 | Écrire l'équation-bilan de l'électrolyse de l'eau | Pièces à ajuster |
| | CHI-03 | Électrolyse n° 4 | Identifier le produit de la synthèse de l'eau | **Démonstration du professeur** ; l'élève observe et conclut sur simulation |
| | CHI-04 | Alcanes n° 1, 2 | Écrire les formules des quatre premiers alcanes | Constructeur à boules, formules brute, développée, semi-développée |
| | CHI-05 | Alcanes n° 3, 4 | Identifier les produits de la combustion complète du butane | **Flamme : professeur** ; tests simulés |
| | CHI-06 | Alcanes n° 5 | Équilibrer l'équation-bilan de la combustion complète du butane | Coefficients à choisir |
| | CHI-07 | Alcanes n° 7, 8 | Relier les gaz formés à leurs effets (dont l'effet de serre) | Cartes cause → effet |
| | CHI-08 | Oxydation n° 1, 2 | Identifier le produit de la combustion d'un métal | **Professeur** ; masse avant/après simulée |
| | CHI-09 | Oxydation n° 3, 6 | Distinguer oxydation lente et oxydation vive | Situations à classer |
| | CHI-10 | Oxydation n° 4 | Identifier les conditions de formation de la rouille | Tubes à essai simulés (air, eau, sel) |
| | CHI-11 | Oxydation n° 5 | Choisir une méthode de protection contre la rouille | Situations ivoiriennes (portails, toits en tôle) |
| | CHI-12 | Réduction n° 1, 2 | Identifier l'oxydant et le réducteur dans une réaction | **Professeur** ; équations à analyser |
| | CHI-13 | Réduction n° 3, 4 | Identifier le corps oxydé et le corps réduit | Réactions à classer |
| | CHI-14 | Solutions n° 2, 4 | Mesurer un pH et le placer sur l'échelle | pH-mètre ou papier pH simulés |
| | CHI-15 | Solutions n° 3, 7 | Identifier une solution acide, neutre ou basique avec un indicateur coloré | Teintes d'indicateur |
| | CHI-16 | Solutions n° 5 | Prévoir l'effet de la dilution sur le pH | Dilutions successives |
| | CHI-17 | Solutions n° 6, 8 | Relier acidité et basicité aux ions, et au pH du sol | Cartes, situations agricoles ivoiriennes |

Non traitées en 3e (lecture) : Lentilles n° 1 à 5 en partie, Masse n° 1, Électricité n° 1 (certaines définitions), Chimie 2 n° 6 et Forces n° 6 (intitulés non extraits : à lire dans le manuel avant décision).

## 5. Volume et ordre
| Étape | Lot | Fiches | Dépendances |
|---|---|---|---|
| 1 | 5e INT (+ TEN) | 5 | banc 5e (PR n° 25), `NohobaIntensite` |
| 2 | 5e PAN | 3 | `NohobaCommande` existant |
| 3 | 5e DIL | 4 | modèles de dilatation 5e |
| 4 | 5e MAT | 6 | atomes CPK, `chimie-dessins.js` |
| 5 | 5e PRE | 2 | `mesures5e.js` |
| 6 | 3e ELE | 13 | catalogue 3e, atelier électrique, `NohobaOhm`, `NohobaEnergie` |
| 7 | 3e OPT | 10 | modules d'optique à créer |
| 8 | 3e MEC | 14 | dynamomètre, bécher |
| 9 | 3e CHI | 17 | électrolyseur, indicateurs, équations |

Total : 20 fiches de 5e, 54 de 3e. Estimation indicative ; le tableau de chaque lot précisera le nombre réel. Une conversation par lot (méthode économe).

## 6. À décider par le propriétaire
1. Valider le plan (lots, ordre, fiches) ou retirer des fiches.
2. Pour la 3e : accord pour créer `activites-3e/` et `3e-ci.js` ; faut-il d'abord rapprocher les 14 leçons « Livre vivant » 3e ?
3. Valeur de g (9,8 ou 10 N/kg) et tarif de l'électricité (CIE) à fournir.
4. Programme 3e : confirmer que les lois d'association des résistances (série et dérivation) et la loi d'Ohm sont bien au programme ivoirien de 3e, comme dans le manuel.
5. Les démonstrations de chimie 3e (synthèse de l'eau, métaux, thermite) : confirmer qu'elles restent uniquement des démonstrations du professeur avec observation simulée.
6. Lecture de deux intitulés non extraits dans le manuel.
