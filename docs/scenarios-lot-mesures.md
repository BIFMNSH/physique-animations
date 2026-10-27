# Scénarios à valider · lot Grandeurs et mesures (MES-01 à MES-10)

27 octobre 2026 · collection Côte d'Ivoire, 6e · thème « Grandeurs et mesures physiques » · **En conception**.

Propositions originales NohobaLab : ni texte officiel reproduit, ni conformité scientifique et pédagogique déjà certifiée. **Aucune fiche n'est construite à ce stade.** Les titres et l'ordre viennent du catalogue (`assets/catalogues/6e-ci.js`). L'archive des TP DPFC et les pages du programme MENA ne sont pas disponibles dans cette session : la colonne « Appui » reste **à confirmer** (voir la dernière section). Les consignes, figures et formulations sont originales.

## Vue d'ensemble

| Fiche | Leçon | Compétence visée (une seule) | Appui officiel |
|---|---|---|---|
| MES-01 | Volume d'un liquide ou d'un solide | Distinguer le volume d'un corps et la capacité d'un récipient, et utiliser leurs unités | à confirmer |
| MES-02 | Volume d'un liquide ou d'un solide | Mesurer le volume d'un liquide avec une éprouvette graduée | à confirmer |
| MES-03 | Volume d'un liquide ou d'un solide | Mesurer le volume d'un solide insoluble par déplacement d'eau | à confirmer |
| MES-04 | Volume d'un liquide ou d'un solide | Calculer le volume d'un cube ou d'un pavé à partir de ses dimensions | à confirmer |
| MES-05 | Masse d'un solide ou d'un liquide | Définir la masse d'un corps et citer ses unités | à confirmer |
| MES-06 | Masse d'un solide ou d'un liquide | Expliquer le principe de la simple pesée avec une balance à plateaux | à confirmer |
| MES-07 | Masse d'un solide ou d'un liquide | Mesurer la masse d'un solide par simple pesée | à confirmer |
| MES-08 | Masse d'un solide ou d'un liquide | Mesurer la masse d'un liquide par différence de deux pesées | à confirmer |
| MES-09 | Masse d'un solide ou d'un liquide | Mesurer la masse d'un solide par double pesée | à confirmer |
| MES-10 | Masse d'un solide ou d'un liquide | Associer un type de balance à son usage et à sa précision | à confirmer |

Règles communes à tout le lot :
- **Paillasse virtuelle partagée** avec le lot Matière : mêmes bécher, cuve et balance électronique (`matiere-dessins.js`). Nouveaux dessins communs à créer : éprouvettes graduées (100 mL et 250 mL), verre mesureur de cuisine, règle graduée, cubes unités, **balance de Roberval** et boîte de masses marquées avec pince.
- Chaque expérience montre le montage réaliste et son schéma côte à côte (éprouvette vue de face avec zoom sur le ménisque ; balance avec le fléau, les plateaux et l'aiguille).
- **Pratiques de mesure** à chaque fiche : valeur + unité, valeur d'une graduation (précision de lecture), lecture une fois le liquide ou l'aiguille immobile, mesure douteuse répétée, résultats consignés dans un tableau. Toutes les valeurs sont **simulées** et signalées comme telles.
- Une seule variable modifiée à la fois. Hypothèse enregistrée avant la manipulation, jamais écrasée.
- Repères locaux : bidon de 5 L, bouteille d'eau de 1,5 L, sachet d'eau, sac de riz de 25 kg, marché, F CFA ; prénoms Awa, Kofi, Aya, Yao.
- Hors lot : poids, masse volumique, mole. Le mot « quantité de matière » est employé au sens courant.
- Ordre conseillé : MES-01 → MES-04 (volume), puis MES-05 → MES-10 (masse). MES-06 et MES-07 précèdent MAT-23 (conservation de la masse), déjà construite : vérifier la cohérence de vocabulaire avec elle.
- Statut `prototype` après construction, jusqu'à validation du propriétaire. Corrigés dans `server/private/corriges-ci/`, jamais dans un fichier public. Aucun code interne affiché à l'élève.

---

## Leçon · Volume d'un liquide ou d'un solide

### MES-01 · S'approprier les notions de volume et de capacité

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Volume d'un liquide ou d'un solide |
| Compétence visée | Distinguer le volume d'un corps et la capacité d'un récipient, et utiliser leurs unités. |
| À la fin de cette partie, je dois être capable de | Dire que le volume est la place qu'occupe un corps ; que la capacité est le volume de liquide qu'un récipient peut contenir ; citer l'unité légale (m³) et les unités usuelles (dm³, cm³, L, dL, cL, mL) ; utiliser 1 L = 1 dm³ et 1 mL = 1 cm³. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Awa a un bidon de 5 L, Kofi deux bouteilles de 1,5 L. Qui transporte le plus d'eau ? Un caillou a-t-il, lui aussi, un volume ? |
| Émettre une hypothèse | L'élève range quatre récipients (gobelet, bouteille, seau, bidon) par capacité, avant tout transvasement. |
| Expérimenter / Investiguer | Transvasements simulés avec un gobelet de 0,25 L (on compte les gobelets) ; un cube creux de 1 dm³ rempli d'eau = 1 L ; un petit cube de 1 cm³ et une seringue de 1 mL. |
| Analyser et interpréter | On compare des capacités en les exprimant avec la même unité ; 1 dm³ contient exactement 1 L, 1 cm³ correspond à 1 mL. |
| Conclure | L'élève écrit les deux définitions et complète le tableau de conversion. |
| Communiquer | Tableau de conversion (m³ → mL) imprimable et quatre conversions corrigées. |

Garde-fous : la capacité écrite sur une étiquette est une capacité nominale (la bouteille n'est pas pleine à ras bord). Conversions limitées aux unités citées ; pas de mm³. Ne pas confondre volume et masse (renvoi à MES-05).

### MES-02 · Mesurer le volume d'un liquide à l'aide d'un récipient gradué

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Volume d'un liquide ou d'un solide |
| Compétence visée | Mesurer le volume d'un liquide avec une éprouvette graduée. |
| À la fin de cette partie, je dois être capable de | Choisir l'éprouvette adaptée ; la poser sur un plan horizontal ; trouver la valeur d'une graduation ; placer l'œil à la hauteur du bas du ménisque ; écrire le volume avec son unité. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Kofi doit prélever 60 mL d'eau pour une expérience. Bécher, verre mesureur ou éprouvette : lequel choisir, et comment lire juste ? |
| Émettre une hypothèse | L'élève prévoit la lecture pour trois positions de l'œil (au-dessus, au niveau, en dessous du ménisque). |
| Expérimenter / Investiguer | Trouver la valeur d'une graduation (compter les intervalles entre deux nombres) ; verser ; déplacer l'œil avec un curseur ; zoom sur le ménisque ; mesurer le même liquide dans le bécher, le verre mesureur et l'éprouvette. |
| Analyser et interpréter | Seule la visée horizontale au bas du ménisque donne la bonne valeur ; l'éprouvette, plus étroite et finement graduée, est plus précise que le bécher. |
| Conclure | L'élève écrit la méthode en quatre étapes. |
| Communiquer | Fiche méthode et carnet de mesures (valeur, unité, valeur d'une graduation), imprimables. |

Garde-fous : eau colorée seulement ; ménisque concave (eau). Les graduations du bécher sont indicatives, ce qui reste cohérent avec MAT-05 (« pas gradué pour mesurer précisément »). Lecture arrondie à la graduation la plus proche. Contrairement à MAT-02, le ménisque est ici dessiné.

### MES-03 · Mesurer le volume d'un solide à l'aide d'un récipient gradué

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Volume d'un liquide ou d'un solide |
| Compétence visée | Mesurer le volume d'un solide insoluble par déplacement d'eau. |
| À la fin de cette partie, je dois être capable de | Lire V₁, immerger le solide, lire V₂ et calculer V = V₂ − V₁ ; donner les conditions de la méthode (solide insoluble, qui coule, entièrement immergé, introduit sans éclaboussure). |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment mesurer le volume d'un caillou dont la forme n'est pas régulière ? |
| Émettre une hypothèse | L'élève prévoit ce que devient le niveau de l'eau quand on plonge le caillou, puis avec deux cailloux. |
| Expérimenter / Investiguer | V₁ = 50 mL ; plonger un caillou, une clé, une bille, en inclinant l'éprouvette. Cas à diagnostiquer : morceau de sucre (se dissout), bouchon de liège (flotte), eau en quantité insuffisante (solide non immergé). |
| Analyser et interpréter | La montée du niveau est égale au volume du solide ; 1 mL = 1 cm³. Chaque cas raté est relié à la condition non respectée. |
| Conclure | L'élève écrit la formule et les conditions. |
| Communiquer | Tableau V₁ / V₂ / V, en mL et en cm³. |

Garde-fous : valeurs entières à la graduation près. Solide qui flotte : constat seulement, la méthode du lest n'est pas proposée (à confirmer). Méthode du vase à trop-plein non traitée sauf avis contraire. Le solide glisse le long de la paroi pour ne pas casser le fond de l'éprouvette.

### MES-04 · Déterminer le volume d'un solide de forme géométrique simple

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Volume d'un liquide ou d'un solide |
| Compétence visée | Calculer le volume d'un cube ou d'un pavé à partir de ses dimensions. |
| À la fin de cette partie, je dois être capable de | Mesurer longueur, largeur et hauteur avec une règle ; calculer V = L × l × h (cube : a × a × a) ; exprimer le résultat en cm³ ; le comparer à une mesure par déplacement d'eau. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Pour un pavé de métal ou une boîte d'allumettes, faut-il plonger l'objet ou peut-on calculer son volume ? |
| Émettre une hypothèse | L'élève estime combien de cubes de 1 cm³ remplissent un pavé. |
| Expérimenter / Investiguer | Remplir un pavé 4 × 3 × 2 avec des cubes unités (couche par couche) ; mesurer à la règle virtuelle ; calculer ; contrôler le pavé de métal par la méthode de MES-03. |
| Analyser et interpréter | Nombre de cubes = L × l × h ; le calcul et la mesure par l'eau concordent à la précision près. |
| Conclure | L'élève écrit les deux formules. |
| Communiquer | Tableau dimensions / calcul / mesure par l'eau. |

Garde-fous : trois dimensions dans la même unité ; valeurs entières ou au demi-centimètre. Contrôle par l'eau seulement avec un solide insoluble (pas de savon, pas de boîte en carton). Cylindre et sphère hors fiche, sauf si le programme MENA de 6e les prévoit (à confirmer).

---

## Leçon · Masse d'un solide ou d'un liquide

### MES-05 · Définir la masse

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Définir la masse d'un corps et citer ses unités. |
| À la fin de cette partie, je dois être capable de | Dire que la masse caractérise la quantité de matière d'un corps ; citer l'unité légale (kg), la tonne, le gramme et le milligramme ; dire que la masse ne change pas quand on déforme ou découpe un corps sans rien perdre ; distinguer masse et volume. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Au marché, le riz se vend au kilo. Si l'on aplatit une boule de pâte à modeler, ou qu'on la coupe en morceaux, sa masse change-t-elle ? |
| Émettre une hypothèse | L'élève prévoit l'indication de la balance après chaque transformation. |
| Expérimenter / Investiguer | Balance électronique du lot Matière : boule → galette → quatre morceaux réunis ; puis deux cubes de même volume (bois, fer) et deux objets de même masse mais de volumes différents. |
| Analyser et interpréter | La masse reste la même quelle que soit la forme ; deux corps de même volume peuvent avoir des masses différentes : masse et volume sont deux grandeurs distinctes. |
| Conclure | L'élève écrit la définition, l'unité et les conversions. |
| Communiquer | Tableau de conversion (t → mg) et classement d'objets du quotidien par masse. |

Garde-fous : pas de poids, pas de masse volumique (le contraste bois / fer reste une observation). Aucune perte de matière pendant les découpes (on rassemble tous les morceaux sur le plateau).

### MES-06 · Expliquer le principe de la simple pesée

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Expliquer le principe de la simple pesée avec une balance à plateaux. |
| À la fin de cette partie, je dois être capable de | Nommer les parties de la balance de Roberval (socle, fléau, plateaux, aiguille, repère) et la boîte de masses marquées ; dire qu'à l'équilibre la masse de l'objet est égale à la somme des masses marquées posées sur l'autre plateau ; vérifier l'équilibre à vide. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment une balance sans écran peut-elle « donner » une masse ? |
| Émettre une hypothèse | L'élève prévoit quel plateau descend quand on charge l'un d'eux. |
| Expérimenter / Investiguer | Vérifier l'équilibre à vide (aiguille au repère) ; poser un objet ; ajouter ou retirer des masses marquées avec la pince et observer l'aiguille. |
| Analyser et interpréter | Le plateau le plus chargé descend ; à l'équilibre, les deux plateaux portent la même masse. |
| Conclure | L'élève énonce le principe de la simple pesée. |
| Communiquer | Schéma légendé de la balance, imprimable. |

Garde-fous : masses marquées prises à la pince ; aucun liquide versé directement sur un plateau ; ne jamais dépasser la portée. Équilibre qualitatif (aiguille au repère). Composition de la boîte de masses à confirmer sur le matériel ivoirien (proposition : 1 g à 200 g).

### MES-07 · Déterminer la masse d'un solide par simple pesée

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Mesurer la masse d'un solide par simple pesée. |
| À la fin de cette partie, je dois être capable de | Appliquer la méthode : équilibre à vide, solide sur un plateau, masses marquées de la plus grande à la plus petite, somme des masses, résultat écrit avec son unité et sa précision. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Quelle est la masse de ce morceau de savon, de cette pile, de ce caillou ? |
| Émettre une hypothèse | L'élève estime chaque masse « à la main » avant la pesée. |
| Expérimenter / Investiguer | Pesée guidée par la méthode des masses décroissantes : si le plateau des masses descend, on retire la dernière masse posée et on essaie la suivante. Trois objets. |
| Analyser et interpréter | La masse est la somme des masses marquées ; la précision est la plus petite masse de la boîte ; l'estimation à la main est comparée à la mesure. |
| Conclure | L'élève écrit la méthode. |
| Communiquer | Carnet de pesée imprimable (objet, masses posées, masse, précision). |

Garde-fous : valeurs simulées ; objet propre et sec ; un objet plus lourd que la portée est refusé avec un message. Le même caillou peut servir en MES-03 pour relier masse et volume sans introduire la masse volumique.

### MES-08 · Déterminer la masse d'un liquide par simple pesée

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Mesurer la masse d'un liquide par différence de deux pesées. |
| À la fin de cette partie, je dois être capable de | Peser le récipient vide (m₁), puis le récipient avec le liquide (m₂), et calculer m = m₂ − m₁. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | On ne peut pas verser l'eau sur le plateau. Comment connaître la masse de 100 mL d'eau ? |
| Émettre une hypothèse | L'élève propose une méthode avant de manipuler. |
| Expérimenter / Investiguer | Peser le bécher vide (m₁) ; mesurer 100 mL d'eau à l'éprouvette (MES-02) et les verser ; peser (m₂). Recommencer avec 100 mL d'huile. |
| Analyser et interpréter | m = m₂ − m₁ ; deux liquides de même volume n'ont pas la même masse. |
| Conclure | L'élève écrit la méthode et la formule. |
| Communiquer | Tableau m₁ / m₂ / m pour les deux liquides. |

Garde-fous : ici m₂ > m₁ toujours (le liquide s'ajoute) ; récipient sec à l'extérieur. Comparaison eau / huile observée, sans masse volumique. La fonction « tare » de la balance électronique est réservée à MES-10.

### MES-09 · Déterminer la masse d'un solide par la double pesée

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Mesurer la masse d'un solide par double pesée. |
| À la fin de cette partie, je dois être capable de | Réaliser deux équilibres face à la même tare et calculer la masse ; expliquer que la double pesée donne une masse juste même si la balance est déréglée. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La balance de la classe a un bras légèrement plus long : la simple pesée donne une masse fausse. Comment peser juste quand même ? |
| Émettre une hypothèse | L'élève prévoit si la simple pesée sur cette balance donne trop ou pas assez. |
| Expérimenter / Investiguer | Simple pesée sur la balance déréglée : valeur fausse. Puis double pesée : **équilibre 1**, le solide et des masses m₁ sur le plateau gauche, une tare (godet de sable) sur le plateau droit ; **équilibre 2**, on retire le solide et on le remplace par des masses jusqu'à rétablir l'équilibre : masse totale m₂ sur le plateau gauche. |
| Analyser et interpréter | Face à la même tare, le solide a été remplacé par des masses marquées à la même place : m = m₂ − m₁, quelle que soit la longueur des bras. Si m₁ = 0, m = m₂. |
| Conclure | L'élève écrit la méthode et la formule. |
| Communiquer | Tableau des deux équilibres et comparaison simple pesée / double pesée. |

Garde-fous : **convention m = m₂ − m₁ à valider** (registre des écarts, entrée ouverte) : m₁ = masses ajoutées avec le solide au premier équilibre, m₂ = masses seules au second ; m₂ ≥ m₁. L'inégalité des bras est exagérée et signalée comme un modèle ; aucune notion de moment de force. On dit « déréglée », jamais « truquée ».

### MES-10 · Découvrir d'autres types de balances

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Grandeurs et mesures physiques** / Masse d'un solide ou d'un liquide |
| Compétence visée | Associer un type de balance à son usage et à sa précision. |
| À la fin de cette partie, je dois être capable de | Reconnaître six balances (électronique de laboratoire, de cuisine, de marché à cadran, pèse-personne, trébuchet, pont-bascule) ; en choisir une selon l'objet, la portée et la précision ; utiliser la fonction « tare » d'une balance électronique. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Pourquoi le bijoutier, la vendeuse de poisson, l'infirmière et le transporteur n'utilisent-ils pas la même balance ? |
| Émettre une hypothèse | L'élève associe six situations à six balances avant correction. |
| Expérimenter / Investiguer | Jeu d'association ; choix de la balance selon la portée et la précision ; balance électronique virtuelle : poser un bécher, appuyer sur « tare », verser un liquide et lire directement sa masse (lien avec MES-08). |
| Analyser et interpréter | Chaque balance a une portée (masse maximale) et une précision ; la tare évite le calcul m₂ − m₁. |
| Conclure | L'élève complète le tableau type / usage / portée / précision. |
| Communiquer | Tableau imprimable ; correction professeur séparée. |

Garde-fous : dessins génériques, sans marque. Portées et précisions données comme ordres de grandeur. Le pèse-personne et la balance de marché à ressort mesurent en réalité une force convertie en kilogrammes : on le tait en 6e ou on les retire de la liste (à décider) ; le peson n'est pas proposé.

---

## Points à confirmer avant construction

1. **Sources** : l'archive des 13 TP DPFC et les pages MENA / JD ne sont pas dans cette session. Quelles fiches TP couvrent le volume et la masse ? Merci de joindre l'archive (ou ces fiches) pour remplir la colonne « Appui » et le registre.
2. **Double pesée (MES-09)** : valider la convention m = m₂ − m₁ décrite ci-dessus, ou la méthode de Borda seule (m = m₂).
3. **MES-03** : solide qui flotte en constat seulement, sans méthode du lest ni vase à trop-plein ?
4. **MES-04** : cubes et pavés seulement, ou cylindre aussi ?
5. **MES-10** : garder le pèse-personne et la balance de marché à ressort, ou les retirer ?
6. **Matériel** : composition de la boîte de masses et éprouvettes disponibles dans les collèges (proposition : boîte de 1 g à 200 g, éprouvettes de 100 mL et 250 mL).
