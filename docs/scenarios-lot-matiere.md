# Scénarios à valider · lot Matière (MAT-01 à MAT-26)

25 octobre 2026 · collection Côte d'Ivoire, 6e · thème « Propriétés physiques de la matière » · **En conception**.

Propositions originales NohobaLab : ni texte officiel reproduit, ni conformité scientifique et pédagogique déjà certifiée. **Aucune fiche n'est construite à ce stade.** Appui : les fiches enseignant SPO 4 à 7 de l'archive TP DPFC reçue le 25 octobre 2026 (liquides, gaz, température, changements d'état), qui fixent le matériel, les habiletés et les résultats attendus. Les consignes, figures et formulations sont originales.

## Vue d'ensemble

| Fiche | Leçon | Compétence visée (une seule) | Appui TP DPFC |
|---|---|---|---|
| MAT-01 | Solides et liquides | Découvrir les propriétés des solides | fiche 4 (par contraste) |
| MAT-02 | Solides et liquides | Découvrir les propriétés des liquides | fiche 4 |
| MAT-03 | Solides et liquides | Distinguer un solide compact d'un solide divisé | — |
| MAT-04 | Solides et liquides | Distinguer un solide divisé d'un liquide | fiche 4 (surface libre) |
| MAT-05 | Solides et liquides | Reconnaître quelques éléments de la verrerie de laboratoire | fiches 4 à 7 (matériel) |
| MAT-06 | Solides et liquides | Reconnaître des pictogrammes de danger | — |
| MAT-07 | Les gaz | Montrer l'existence de l'air | fiche 5 |
| MAT-26 | Les gaz | Citer quelques gaz de la vie courante | — |
| MAT-08 | Les gaz | Découvrir les propriétés des gaz | fiche 5, activité 1 |
| MAT-09 | Les gaz | Définir la pression d'un gaz | fiche 5, activité 1 (prolongement) |
| MAT-10 | Les gaz | Transvaser, recueillir et conserver un gaz | fiche 5, activités 2 et 3 |
| MAT-11 | Les gaz | Appliquer les règles de sécurité (manipulation des gaz) | fiche 5 (consigne) |
| MAT-12 | Température d'un corps | Découvrir la notion de température | fiche 6, activité 1 |
| MAT-13 | Température d'un corps | Décrire un thermomètre de laboratoire | fiche 6 (matériel) |
| MAT-14 | Température d'un corps | Repérer la température d'un corps | fiche 6, activité 2 |
| MAT-15 | Température d'un corps | Repérer la température de la glace fondante et de l'eau bouillante | fiche 6, activité 2 |
| MAT-16 | Température d'un corps | Décrire le thermomètre médical à liquide | fiche 6 (matériel) |
| MAT-17 | Température d'un corps | Repérer la température du corps humain | fiche 6, activité 3 |
| MAT-18 | Température d'un corps | Reconnaître d'autres types de thermomètres | — |
| MAT-19 | Changements d'état de l'eau | Réaliser la solidification de l'eau | fiche 7, activité 1 |
| MAT-20 | Changements d'état de l'eau | Réaliser la fusion de la glace | fiche 7 |
| MAT-21 | Changements d'état de l'eau | Montrer la variation de volume au cours de la solidification | — |
| MAT-22 | Changements d'état de l'eau | Montrer la variation de volume au cours de la fusion | — |
| MAT-23 | Changements d'état de l'eau | Montrer la conservation de la masse au cours de la fusion | fiche 7, activité 3 |
| MAT-24 | Changements d'état de l'eau | Réaliser la vaporisation de l'eau et la condensation de la vapeur d'eau | fiche 7, activité 4 |
| MAT-25 | Changements d'état de l'eau | Expliquer le cycle de l'eau | — |

Règles communes à tout le lot :
- Paillasse virtuelle partagée : verrerie, thermomètre, balance, seringue et cuve à eau réutilisés d'une fiche à l'autre, mêmes dessins, mêmes noms.
- Modèle **qualitatif** par défaut. Les seules valeurs chiffrées sont celles des repères de l'archive TP : 0 °C (glace fondante, solidification), environ 100 °C (ébullition, au niveau de la mer), environ 37 °C (corps humain), échelle du thermomètre de laboratoire de −10 °C à 110 °C. Les autres températures (ambiante, mélange réfrigérant) sont des illustrations, jamais présentées comme des mesures.
- Une seule variable modifiée à la fois. Hypothèse enregistrée avant la manipulation, jamais écrasée.
- L'élève investigue sur simulation. Toute manipulation réelle (eau chaude, flamme, gaz combustible, verre) reste encadrée par le professeur, 30 minutes par séance, un responsable par groupe.
- Mouvement réduit : repères statiques à la place des animations. Étiquettes et `aria-label` sur tous les contrôles et images.
- Une compétence par fiche ; présentation Thème / Chapitre / Compétence visée / « À la fin de cette partie, je dois être capable de ». Aucun code interne affiché à l'élève.
- Statut `prototype` après construction, jusqu'à validation du propriétaire. Corrigés dans `prof.reference`, à passer côté serveur comme pour l'Électricité.
- Ordre conseillé de construction et de parcours : verrerie (MAT-05) et masse (MES-05 à MES-07) avant MAT-23 ; thermomètre (MAT-13 à MAT-15) avant MAT-19 et MAT-20.

---

## Leçon · Solides et liquides

### MAT-01 · Découvrir les propriétés des solides

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Identifier les propriétés d'un solide à partir d'observations. |
| À la fin de cette partie, je dois être capable de | Dire qu'un solide a une forme propre ; qu'il garde sa forme d'un récipient à l'autre ; qu'il ne coule pas. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Un caillou, un morceau de bois et une gomme changent-ils de forme quand on les change de récipient ? |
| Émettre une hypothèse | L'élève prévoit la forme de chaque objet dans trois récipients différents. |
| Expérimenter / Investiguer | En simulation : poser chaque solide dans les récipients, l'incliner, essayer de le verser. |
| Analyser et interpréter | La forme ne change pas ; l'objet ne coule pas ; il garde sa forme même sans récipient. |
| Conclure | L'élève énonce deux propriétés des solides. |
| Communiquer | Tableau des solides testés, imprimable. |

Garde-fous : solides compacts seulement (le solide divisé est traité en MAT-03). Un solide qui se déforme (éponge, pâte) n'est pas proposé, pour ne pas brouiller la règle.

### MAT-02 · Découvrir les propriétés des liquides

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Identifier les propriétés d'un liquide au repos. |
| À la fin de cette partie, je dois être capable de | Dire qu'un liquide prend la forme de son récipient ; qu'il coule (c'est un fluide) ; que sa surface libre au repos est plane et horizontale, même quand le récipient est incliné. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Quelle est la forme de l'eau ? Que devient sa surface si on penche le récipient ? |
| Émettre une hypothèse | L'élève dessine d'abord la surface qu'il attend dans un récipient incliné. |
| Expérimenter / Investiguer | Verser le liquide dans un cristallisoir, un tube à essai, un ballon à fond plat et un flacon ; incliner un récipient ; essayer avec un autre liquide. |
| Analyser et interpréter | Le liquide épouse chaque récipient ; la surface libre reste horizontale quand le récipient penche. |
| Conclure | L'élève complète : « un liquide n'a pas de forme propre… ». |
| Communiquer | Schémas de la surface libre dans chaque récipient (la planche de la fiche TP sert de modèle de présentation, pas de figure). |

Garde-fous : liquides courants et inoffensifs (eau colorée, huile). Le niveau de l'eau est dessiné horizontal sur toute la largeur ; ne pas montrer de ménisque dans cette fiche.

### MAT-03 · Distinguer un solide compact d'un solide divisé

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Classer des solides en compacts ou divisés. |
| À la fin de cette partie, je dois être capable de | Reconnaître un solide divisé (sable, sel, farine, grains) ; dire qu'il est fait de morceaux qui gardent chacun leur forme. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Le sable est-il un solide comme le caillou ? Pourquoi semble-t-il couler ? |
| Émettre une hypothèse | L'élève classe six objets (caillou, sel, bloc de bois, farine, riz, clou) en deux groupes avant tout test. |
| Expérimenter / Investiguer | En simulation : verser, prendre une pincée, regarder à la loupe virtuelle un grain, écraser. |
| Analyser et interpréter | Un solide divisé prend la forme du tas qu'il forme, mais chaque grain garde sa forme. |
| Conclure | L'élève corrige son classement et justifie deux choix. |
| Communiquer | Tableau classé, imprimable. |

Garde-fous : la loupe virtuelle est un grossissement qualitatif, sans échelle chiffrée. Ne pas affirmer que le sable est un liquide, ni que « le solide divisé coule » sans préciser que ce sont les grains qui glissent.

### MAT-04 · Distinguer un solide divisé d'un liquide

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Utiliser la surface libre pour distinguer un solide divisé d'un liquide. |
| À la fin de cette partie, je dois être capable de | Dire que la surface libre d'un liquide au repos est plane et horizontale alors que celle d'un solide divisé forme un tas ; citer un autre critère (les grains restent visibles). |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Sable et eau coulent tous les deux. Comment ne pas les confondre ? |
| Émettre une hypothèse | L'élève prévoit la surface du sable et celle de l'eau dans un récipient incliné. |
| Expérimenter / Investiguer | Verser sable puis eau dans le même récipient, l'incliner, le poser. |
| Analyser et interpréter | L'eau reste horizontale ; le sable garde sa pente. |
| Conclure | L'élève écrit le critère de distinction. |
| Communiquer | Deux schémas comparés. |

Garde-fous : le sable sec seulement. Réutilise le résultat de MAT-02 ; ne pas faire intervenir de sable mouillé ni de vibration.

### MAT-05 · Reconnaître quelques éléments de la verrerie de laboratoire

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Nommer des récipients de laboratoire et dire à quoi ils servent. |
| À la fin de cette partie, je dois être capable de | Nommer cristallisoir, tube à essai, ballon à fond plat, flacon, bécher, verre, bocal ; en choisir un selon l'usage. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Un technicien prépare une expérience : quel récipient prendre ? |
| Émettre une hypothèse | L'élève associe chaque nom à une silhouette avant la correction. |
| Expérimenter / Investiguer | Jeu d'association nom / dessin, puis choix du récipient pour trois situations (chauffer, conserver, observer). |
| Analyser et interpréter | Chaque forme a un usage ; le verre chauffable est repéré (ballon en pyrex). |
| Conclure | L'élève nomme cinq éléments. |
| Communiquer | Planche de verrerie, imprimable. |

Garde-fous : liste limitée au matériel des fiches TP 4 à 7 ; l'éprouvette graduée et la burette relèvent de MES-02. Verre non gradué = pas de lecture de volume.

### MAT-06 · Reconnaître des pictogrammes de danger

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Associer un pictogramme de danger à sa signification. |
| À la fin de cette partie, je dois être capable de | Reconnaître les pictogrammes les plus courants et dire quel comportement adopter devant chacun. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Trois flacons portent une étiquette : que faut-il faire ou ne pas faire ? |
| Émettre une hypothèse | L'élève devine le sens de chaque pictogramme à partir de sa forme. |
| Expérimenter / Investiguer | Association pictogramme / sens, puis mise en situation (que faire d'un flacon marqué « inflammable » près d'une flamme ?). |
| Analyser et interpréter | La forme en losange et le dessin signalent un danger précis. |
| Conclure | L'élève classe les pictogrammes et énonce une règle. |
| Communiquer | Affiche de laboratoire de l'élève, imprimable. |

Garde-fous : liste exacte des pictogrammes au programme à confirmer (voir décisions) ; dessins originaux conformes au système d'étiquetage en vigueur, sans reproduction d'une planche officielle. MAT-06 traite les produits de laboratoire ; CHI-19 traite les pictogrammes liés aux incendies, sans doublon d'exercices.

---

## Leçon · Les gaz

### MAT-07 · Montrer l'existence de l'air

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Montrer par une expérience que l'air existe et occupe de la place. |
| À la fin de cette partie, je dois être capable de | Décrire une expérience qui prouve la présence de l'air et en tirer la conclusion. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | On ne voit pas l'air. Comment savoir qu'il est là ? |
| Émettre une hypothèse | L'élève prévoit si l'eau remplira un verre renversé enfoncé dans l'eau. |
| Expérimenter / Investiguer | Enfoncer un verre à l'envers dans un cristallisoir ; incliner le verre ; gonfler un ballon ; pousser le piston d'une seringue fermée. |
| Analyser et interpréter | L'eau n'entre pas tant que l'air reste ; des bulles sortent quand on incline ; le ballon prend du volume. |
| Conclure | L'élève écrit : « l'air existe, il occupe de la place ». |
| Communiquer | Schéma légendé de l'expérience du verre. |

Garde-fous : le verre est parfaitement droit au départ (une inclinaison fausserait la conclusion). L'air est dessiné par des repères neutres (point ou pointillé), jamais comme une substance colorée.

### MAT-26 · Citer quelques gaz de la vie courante

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Reconnaître des gaz dans des situations du quotidien. |
| À la fin de cette partie, je dois être capable de | Citer au moins quatre gaz de la vie courante (air, butane de la bouteille de cuisine, dioxyde de carbone des boissons gazeuses, vapeur d'eau, dioxygène) et dire où on les rencontre. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Où y a-t-il du gaz dans la maison, à la cuisine, dans la rue ? |
| Émettre une hypothèse | L'élève entoure sur une image de cuisine ce qu'il pense contenir un gaz. |
| Expérimenter / Investiguer | Clic sur chaque objet : bouteille de gaz, boisson gazeuse, marmite qui bout, pneu, ballon. |
| Analyser et interpréter | Chaque gaz est relié à son usage ; plusieurs sont invisibles. |
| Conclure | L'élève complète un tableau gaz / où je le trouve. |
| Communiquer | Tableau imprimable. |

Garde-fous : reconnaissance seulement, pas de manipulation. Le butane est signalé inflammable. La vapeur d'eau est présentée comme un gaz invisible (le « nuage blanc » au-dessus de la marmite est de fines gouttelettes : à ne pas confondre, voir MAT-24). Formules chimiques hors de cette fiche.

### MAT-08 · Découvrir les propriétés des gaz

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Mettre en évidence qu'un gaz est compressible, expansible et élastique. |
| À la fin de cette partie, je dois être capable de | Décrire ce qui arrive au volume d'air d'une seringue quand on appuie, quand on tire, quand on relâche. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Peut-on faire changer le volume de l'air enfermé ? |
| Émettre une hypothèse | L'élève prévoit le volume final et la position du piston après relâchement. |
| Expérimenter / Investiguer | Seringue bouchée au doigt : appuyer sur le piston puis relâcher ; tirer sur le piston puis relâcher ; refaire seringue ouverte. |
| Analyser et interpréter | Volume réduit (compression), augmenté (expansion), piston qui revient (élasticité) ; seringue ouverte : aucun effet. |
| Conclure | L'élève nomme les trois propriétés. |
| Communiquer | Tableau « action / volume / piston ». |

Garde-fous : aucune valeur de pression ni de volume mesuré ; graduations de la seringue qualitatives. La seringue est sans aiguille. Le « doigt » est un bouchon dans la simulation.

### MAT-09 · Définir la pression d'un gaz

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Relier la pression d'un gaz aux poussées qu'il exerce sur les parois. |
| À la fin de cette partie, je dois être capable de | Expliquer qu'un gaz enfermé pousse sur les parois du récipient et qu'on sent cette poussée quand on comprime. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Pourquoi faut-il pousser fort sur le piston quand l'air est enfermé ? |
| Émettre une hypothèse | L'élève prévoit s'il faut pousser plus ou moins fort quand le volume diminue. |
| Expérimenter / Investiguer | Même seringue que MAT-08 : compresser de plus en plus, sentir la résistance (jauge qualitative « faible / moyenne / forte »), gonfler un ballon. |
| Analyser et interpréter | Plus le volume diminue, plus la poussée sur le piston et sur les parois augmente. |
| Conclure | L'élève définit la pression comme la poussée du gaz sur les parois. |
| Communiquer | Schéma de la seringue avec les poussées en flèches. |

Garde-fous : le programme ne prescrit pas, à notre connaissance, de loi de Boyle ni d'unité en 6e : modèle qualitatif, sans pascal ni bar (à confirmer). Aucune formule.

### MAT-10 · Transvaser, recueillir et conserver un gaz

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Réaliser en simulation le transvasement et le recueil d'un gaz par déplacement d'eau, puis le conserver. |
| À la fin de cette partie, je dois être capable de | Décrire comment le gaz prend la place de l'eau dans un bocal ou un tube renversé, et comment le garder (bouchon sous l'eau). |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment faire passer un gaz d'un récipient à un autre, ou le garder, puisqu'on ne le voit pas ? |
| Émettre une hypothèse | L'élève prévoit ce qui prend la place de l'eau quand on incline un tube plein d'air sous un bocal renversé. |
| Expérimenter / Investiguer | Transvaser : bocal rempli d'eau renversé dans le cristallisoir, tube à essai plein d'air incliné sous le bocal. Recueillir : tube plein d'eau renversé, tuyau coudé relié au labogaz, ouvrir. Conserver : fermer le tube sous l'eau avec un bouchon. |
| Analyser et interpréter | Des bulles montent, le niveau d'eau baisse : le gaz a pris la place de l'eau. |
| Conclure | L'élève écrit la méthode en trois temps. |
| Communiquer | Schéma annoté des trois montages. |

Garde-fous : le gaz du labogaz est inflammable : simulation uniquement, aucun montage réel sans le professeur, pas de flamme à proximité, pièce aérée. Attention aux jets d'eau (consigne de la fiche TP). Le gaz recueilli est représenté sans couleur.

### MAT-11 · Appliquer les règles de sécurité (manipulation des gaz)

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Les gaz |
| Compétence visée | Appliquer les règles de sécurité lors de la manipulation d'un gaz. |
| À la fin de cette partie, je dois être capable de | Repérer dans une scène les gestes dangereux et énoncer la règle correspondante. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Une paillasse est préparée pour l'expérience du gaz. Qu'est-ce qui ne va pas ? |
| Émettre une hypothèse | L'élève clique d'abord sur ce qu'il juge dangereux. |
| Expérimenter / Investiguer | Scène de paillasse avec cinq défauts (flamme près du labogaz, verre cassé, flaque, blouse ouverte, tuyau non fixé) ; l'élève corrige. |
| Analyser et interpréter | Chaque défaut est relié à sa règle. |
| Conclure | L'élève écrit cinq règles. |
| Communiquer | Affiche des règles de la paillasse. |

Garde-fous : aucune mise en scène réaliste d'accident. MAT-11 traite la manipulation des gaz ; CHI-18 traite les combustions : deux scènes différentes, vocabulaire commun.

---

## Leçon · Température d'un corps

### MAT-12 · Découvrir la notion de température

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Montrer que le toucher ne permet pas d'apprécier la température. |
| À la fin de cette partie, je dois être capable de | Expliquer pourquoi l'eau tiède peut paraître chaude ou froide, et dire qu'il faut un instrument pour repérer une température. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Une main dans l'eau froide, l'autre dans l'eau chaude : la même eau tiède paraît-elle pareille aux deux mains ? |
| Émettre une hypothèse | L'élève prévoit la sensation de chaque main dans l'eau tiède. |
| Expérimenter / Investiguer | Simulation des trois bacs (froid, tiède, chaud) et des deux mains ; inverser les mains. |
| Analyser et interpréter | La main sortie de l'eau froide trouve l'eau tiède chaude ; l'autre la trouve froide. |
| Conclure | L'élève écrit que le toucher peut tromper. |
| Communiquer | Tableau « main / bac d'avant / sensation ». |

Garde-fous : eau « chaude » = eau seulement agréablement chaude, jamais brûlante (aucun contact avec de l'eau bouillante, ni en simulation ni en réel). Pas de valeur numérique ici : le thermomètre vient ensuite.

### MAT-13 · Décrire un thermomètre de laboratoire

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Décrire les parties d'un thermomètre et sa graduation. |
| À la fin de cette partie, je dois être capable de | Nommer réservoir, tube, liquide, graduations ; dire que le thermomètre de laboratoire va de −10 °C à 110 °C ; lire un trait de graduation. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment un thermomètre « sait »-il quelle est la température ? |
| Émettre une hypothèse | L'élève place les noms des parties sur un dessin avant correction. |
| Expérimenter / Investiguer | Observer le thermomètre à différentes températures illustrées ; repérer la valeur d'un trait (une graduation = 1 °C) ; s'entraîner à lire sur un panneau de lecture. |
| Analyser et interpréter | Le liquide monte quand la température augmente ; on lit au niveau du liquide, l'œil à sa hauteur. |
| Conclure | L'élève décrit le thermomètre. |
| Communiquer | Schéma légendé. |

Garde-fous : valeur d'une graduation à confirmer sur le matériel ivoirien (1 °C supposé). Liquide non nommé comme mercure ; thermomètre fragile : ne jamais l'utiliser pour remuer.

### MAT-14 · Repérer la température d'un corps

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Utiliser correctement un thermomètre pour repérer une température. |
| À la fin de cette partie, je dois être capable de | Placer le thermomètre, attendre, lire la valeur et l'écrire avec son unité. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment mesurer la température de l'air de la salle ou de l'eau d'un bac ? |
| Émettre une hypothèse | L'élève estime d'abord la température de l'air de la salle. |
| Expérimenter / Investiguer | Thermomètre dans l'air puis dans un bac d'eau ; attendre la stabilisation ; lire. |
| Analyser et interpréter | La valeur lue diffère de l'estimation ; elle ne change plus au bout de quelques instants. |
| Conclure | L'élève écrit la procédure en quatre étapes. |
| Communiquer | Carnet de mesures imprimable. |

Garde-fous : les valeurs affichées (par exemple 30 °C pour l'air de la salle) sont des illustrations, non des mesures. Le réservoir ne touche ni le fond ni la paroi.

### MAT-15 · Repérer la température de la glace fondante et de l'eau bouillante

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Repérer deux températures de référence avec un thermomètre. |
| À la fin de cette partie, je dois être capable de | Donner la température de la glace fondante (0 °C) et celle de l'eau qui bout (environ 100 °C). |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Existe-t-il des températures qu'on retrouve toujours ? |
| Émettre une hypothèse | L'élève prévoit les deux valeurs. |
| Expérimenter / Investiguer | Thermomètre dans l'eau glacée (avec glace en train de fondre) puis dans l'eau bouillante. |
| Analyser et interpréter | 0 °C pour la glace fondante, environ 100 °C pour l'ébullition ; la valeur ne bouge plus pendant le changement d'état. |
| Conclure | L'élève retient les deux repères. |
| Communiquer | Frise des deux repères. |

Garde-fous : « environ 100 °C » au niveau de la mer ; ne pas affirmer 100 °C partout. En réel, eau bouillante manipulée par le professeur seul, éloigner les élèves du bec, chauffage sur trépied stable, thermomètre fragile.

### MAT-16 · Décrire le thermomètre médical à liquide

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Décrire un thermomètre médical et expliquer comment l'utiliser. |
| À la fin de cette partie, je dois être capable de | Nommer ses parties, dire pourquoi on le secoue avant usage et lire sa graduation. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Comment diffère-t-il du thermomètre de laboratoire ? |
| Émettre une hypothèse | L'élève liste les différences qu'il attend (taille, graduation, usage). |
| Expérimenter / Investiguer | Comparer les deux thermomètres côte à côte ; secouer le thermomètre médical pour faire descendre le liquide ; lire. |
| Analyser et interpréter | Graduation resserrée autour de 37 °C ; le liquide reste en place après usage, d'où la nécessité de le secouer. |
| Conclure | L'élève décrit le thermomètre médical. |
| Communiquer | Schéma comparatif. |

Garde-fous : échelle exacte du thermomètre médical ivoirien à confirmer sur le matériel. Pas de conseil médical. Hygiène : un thermomètre se nettoie avant d'être partagé.

### MAT-17 · Repérer la température du corps humain

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Utiliser le thermomètre médical pour repérer la température du corps. |
| À la fin de cette partie, je dois être capable de | Dire que la température normale du corps est voisine de 37 °C et décrire la procédure (secouer, aisselle, attendre 2 à 3 minutes, lire). |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La température de chacun est-elle exactement la même ? |
| Émettre une hypothèse | L'élève prévoit l'ordre de grandeur de la température d'une personne en bonne santé. |
| Expérimenter / Investiguer | Trois personnages virtuels ; pour chacun : secouer, placer, attendre, lire. |
| Analyser et interpréter | Les valeurs (par exemple 37 °C, 37,5 °C, 38 °C) sont voisines de 37 °C. |
| Conclure | L'élève énonce la température normale (environ 37 °C). |
| Communiquer | Tableau des trois relevés. |

Garde-fous : les relevés sont fictifs. Ne pas poser de diagnostic ni de seuil de fièvre ; ne pas présenter 38 °C comme normal ou anormal sans avis du professeur. En réel : thermomètres individuels ou désinfectés, élèves volontaires uniquement.

### MAT-18 · Reconnaître d'autres types de thermomètres

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Associer un type de thermomètre à son usage. |
| À la fin de cette partie, je dois être capable de | Citer au moins trois types de thermomètres (à liquide, électronique, à infrarouge, de four ou de cuisine) et dire à quoi chacun sert. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Pourquoi y a-t-il des thermomètres de formes différentes ? |
| Émettre une hypothèse | L'élève associe cinq situations à un thermomètre avant correction. |
| Expérimenter / Investiguer | Choix du thermomètre adapté pour : eau du bain, four, malade, air extérieur, congélateur. |
| Analyser et interpréter | Chaque instrument est adapté à une plage et à un usage. |
| Conclure | L'élève relie type et usage. |
| Communiquer | Tableau type / usage / avantage. |

Garde-fous : liste de types à confirmer avec le programme (voir décisions). Pas de marque. Aucun fonctionnement interne (infrarouge) expliqué au-delà de « mesure sans contact ».

---

## Leçon · Changements d'état de l'eau

### MAT-19 · Réaliser la solidification de l'eau

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Réaliser la solidification de l'eau et repérer sa température. |
| À la fin de cette partie, je dois être capable de | Dire que l'eau liquide devient glace en se solidifiant, et que la température de solidification est 0 °C. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | À quelle température l'eau devient-elle glace ? |
| Émettre une hypothèse | L'élève note la valeur attendue avant l'expérience. |
| Expérimenter / Investiguer | Mélange réfrigérant (glace pilée et sel) dans un bécher ; tube à essai contenant de l'eau et un thermomètre plongé dans le mélange ; relever la température quand la glace apparaît. |
| Analyser et interpréter | La température reste à 0 °C pendant que la glace se forme. |
| Conclure | L'élève complète : « la solidification de l'eau se fait à 0 °C ». |
| Communiquer | Courbe qualitative de la température (descente puis palier). |

Garde-fous : le mélange réfrigérant est plus froid que 0 °C ; la température de l'eau du tube, elle, s'arrête à 0 °C au moment où la glace se forme. Ne pas confondre les deux relevés, et ne pas annoncer de valeur pour le mélange. Pas de surfusion dans cette fiche. En réel : ne pas toucher le mélange à main nue longtemps.

### MAT-20 · Réaliser la fusion de la glace

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Réaliser la fusion de la glace et repérer sa température. |
| À la fin de cette partie, je dois être capable de | Dire que la glace devient de l'eau liquide en fondant, à 0 °C. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La glace qui fond change-t-elle de température pendant qu'elle fond ? |
| Émettre une hypothèse | L'élève prévoit ce que fera le thermomètre. |
| Expérimenter / Investiguer | Glace pilée dans un bécher à la température de la salle, thermomètre au centre ; relever à intervalles réguliers jusqu'à la fin de la fusion. |
| Analyser et interpréter | La température reste à 0 °C tant qu'il reste de la glace ; elle remonte une fois la glace fondue. |
| Conclure | L'élève énonce la température de fusion (0 °C). |
| Communiquer | Courbe qualitative avec palier. |

Garde-fous : valeur de 0 °C avec glace pure fondante ; la glace salée de MAT-19 fond plus bas : ne pas mélanger les deux situations. Durées de la simulation accélérées et signalées comme telles.

### MAT-21 · Montrer la variation de volume au cours de la solidification

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Montrer que le volume de l'eau augmente quand elle gèle. |
| À la fin de cette partie, je dois être capable de | Comparer les volumes avant et après solidification et en tirer une conséquence pratique. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Une bouteille d'eau pleine mise au congélateur : que peut-il arriver ? |
| Émettre une hypothèse | L'élève prévoit si le niveau montera, baissera ou restera identique. |
| Expérimenter / Investiguer | Marquer le niveau d'eau d'un tube gradué ; simuler la solidification ; marquer le niveau de la glace. |
| Analyser et interpréter | Le niveau monte : l'eau occupe plus de place sous forme de glace. |
| Conclure | L'élève conclut et cite un risque (bouteille déformée ou éclatée, conduite qui éclate). |
| Communiquer | Schéma avant / après avec les deux niveaux. |

Garde-fous : augmentation qualitative (« un peu plus de place »), sans pourcentage. En réel, récipient en plastique souple, jamais en verre fermé.

### MAT-22 · Montrer la variation de volume au cours de la fusion

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Montrer que le volume diminue quand la glace fond. |
| À la fin de cette partie, je dois être capable de | Comparer le volume de la glace et celui de l'eau obtenue. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Un glaçon qui fond dans un verre fait-il déborder le verre ? |
| Émettre une hypothèse | L'élève prévoit le niveau après fusion. |
| Expérimenter / Investiguer | Tube gradué rempli de glace jusqu'à un repère ; laisser fondre ; relever le nouveau niveau. |
| Analyser et interpréter | Le niveau baisse après fusion : l'eau liquide occupe moins de place que la glace. |
| Conclure | L'élève rapproche ce résultat de MAT-21 (fusion et solidification donnent des variations de sens opposés). |
| Communiquer | Schéma comparatif. |

Garde-fous : un glaçon flottant dans un verre d'eau ne fait pas déborder le verre en fondant : situation différente, non traitée ici pour éviter la confusion. Pas de valeur de masse volumique.

### MAT-23 · Montrer la conservation de la masse au cours de la fusion

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Comparer la masse avant et après la fusion. |
| À la fin de cette partie, je dois être capable de | Dire que la masse se conserve quand la glace fond (et quand l'eau gèle), alors que le volume change. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La glace fondue pèse-t-elle autant que la glace ? |
| Émettre une hypothèse | L'élève note son hypothèse (plus, moins ou autant). |
| Expérimenter / Investiguer | Peser le récipient avec la glace (m₁) puis, une fois fondue, le même récipient fermé avec l'eau (m₂) ; comparer. |
| Analyser et interpréter | m₁ = m₂ : la masse ne change pas, même si le volume a changé (MAT-22). |
| Conclure | L'élève énonce la conservation de la masse. |
| Communiquer | Tableau m₁ / m₂ avec conclusion. |

Garde-fous : valeurs de masse de la fiche TP (par exemple 50 g) = illustration, la balance est qualitative à l'égalité près ; récipient couvert pour éviter l'évaporation et la buée qui falsifieraient la pesée. Réutilise MES-06 et MES-07 pour la pesée.

### MAT-24 · Réaliser la vaporisation de l'eau et la condensation de la vapeur d'eau

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Réaliser l'ébullition de l'eau et observer la condensation de la vapeur. |
| À la fin de cette partie, je dois être capable de | Dire que l'eau qui bout passe de l'état liquide à l'état gazeux (vaporisation) à environ 100 °C, et que la vapeur se condense en gouttelettes sur une paroi froide. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Où va l'eau d'une casserole qui bout ? Que devient la vapeur sur un couvercle ? |
| Émettre une hypothèse | L'élève prévoit la température de l'eau qui bout et ce qui apparaît sur une paroi froide. |
| Expérimenter / Investiguer | Ballon à fond plat sur trépied, thermomètre, labogaz ; relever la température à l'ébullition ; placer une paroi froide (verre) au-dessus de la vapeur. |
| Analyser et interpréter | La température reste voisine de 100 °C pendant l'ébullition ; des gouttelettes se déposent sur la paroi froide. |
| Conclure | L'élève nomme vaporisation (ébullition) et condensation. |
| Communiquer | Schéma légendé avec les états physiques. |

Garde-fous : eau bouillante et flamme : simulation, ou démonstration par le professeur seul ; verre pyrex ; thermomètre qui ne touche pas le fond. Distinguer vapeur d'eau (gaz invisible) et « fumée » blanche (gouttelettes). Le vocabulaire d'évaporation à basse température n'est pas introduit sans accord du programme (voir décisions).

### MAT-25 · Expliquer le cycle de l'eau

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Expliquer le cycle de l'eau avec les changements d'état. |
| À la fin de cette partie, je dois être capable de | Ordonner les étapes du cycle (vaporisation, condensation, précipitations, retour à la mer ou au sol) et nommer l'état de l'eau à chaque étape. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | D'où viennent les nuages, et où va la pluie ? |
| Émettre une hypothèse | L'élève place les étapes dans un ordre de son choix avant correction. |
| Expérimenter / Investiguer | Schéma du paysage (mer, soleil, nuages, pluie, rivière) à compléter ; relier chaque étape à une expérience de la leçon (MAT-24 pour la vaporisation et la condensation, MAT-19 pour la solidification). |
| Analyser et interpréter | L'eau change d'état et circule en cycle, sans se perdre. |
| Conclure | L'élève raconte le cycle en cinq phrases. |
| Communiquer | Schéma du cycle de l'eau de l'élève, imprimable. |

Garde-fous : contexte ivoirien (lagune, saison des pluies) autorisé comme illustration. Pas d'échelle de temps ni de chiffres. Éviter de laisser croire que les nuages sont de la vapeur d'eau : ce sont de fines gouttelettes.

---

## Sources et points à confirmer

| Source | Ce qui est établi | Ce qui reste à vérifier |
|---|---|---|
| 13 TP officiels DPFC | Archive reçue le 25 octobre 2026. Fiches 4 (liquides), 5 (gaz), 6 (température), 7 (changements d'état) lues : matériel, habiletés et résultats attendus utilisés comme appui. | Les fiches TP ne couvrent pas MAT-01, 03, 04 (en partie), 06, 09, 18, 21, 22, 25, 26 et la condensation de MAT-24 ; ces scénarios sont des propositions NohobaLab. |
| [Programme éducatif et guide d'exécution MENA, 6e](https://apprendre.auf.org/wp-content/uploads/2021/08/13-Programme_Educatif_PC_6ieme.pdf) | Compétence 2 « Propriétés physiques de la matière », leçons 4 à 7 (solides et liquides ; gaz ; température ; changements d'état). | Numéros de page et contenus exacts de ces leçons : à relire avant construction (la lecture assistée d'octobre ne portait que sur l'Électricité). |
| Dossier « Extraction des 70 activités » (23 octobre 2026) | Intitulés des 26 fiches MAT du catalogue. | Correspondance MENA marquée « à vérifier ». |
| Manuel JD Éditions | Structure et habiletés seulement ; consignes et figures originales. | Non fourni : aucune page citée ici. |

### Décisions attendues du propriétaire

1. Valider le découpage en 26 fiches et l'ordre conseillé (verrerie et masse avant MAT-23, thermomètre avant MAT-19 et MAT-20).
2. MAT-06 : liste des pictogrammes à retenir (inflammable, corrosif, toxique, comburant, explosif, nocif ou irritant, dangereux pour l'environnement ?).
3. MAT-09 : confirmer que la pression reste qualitative (sans unité) en 6e.
4. MAT-13 et MAT-16 : valeur d'une graduation du thermomètre de laboratoire et échelle du thermomètre médical du matériel ivoirien.
5. MAT-18 : liste des types de thermomètres à citer.
6. MAT-24 : introduire ou non le mot « évaporation » (changement d'état sans ébullition) ; MAT-21 et MAT-22 : confirmer que le programme les traite bien comme fiches séparées.
7. Après construction et recette, les fiches restent **prototype** jusqu'à votre validation explicite ; les corrigés ne seront pas placés dans les fichiers publics.
