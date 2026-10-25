# Scénarios à valider · lot Matière (MAT-01 à MAT-26)

25 octobre 2026 (mise à jour le même jour : décisions du propriétaire et dossier de ressources MAT) · collection Côte d'Ivoire, 6e · thème « Propriétés physiques de la matière » · **En conception**.

Propositions originales NohobaLab : ni texte officiel reproduit, ni conformité scientifique et pédagogique déjà certifiée. **Aucune fiche n'est construite à ce stade.** Appui : les fiches enseignant SPO 4 à 7 de l'archive TP DPFC reçue le 25 octobre 2026 (liquides, gaz, température, changements d'état), qui fixent le matériel, les habiletés et les résultats attendus. Les consignes, figures et formulations sont originales. Le dossier de ressources `NohobaLab_Ressources_MAT_Pour_Claude.docx` (25 octobre 2026) enrichit MAT-06 et MAT-18 et propose des activités d'approfondissement : voir la dernière section.

## Vue d'ensemble

| Fiche | Leçon | Compétence visée (une seule) | Appui TP DPFC |
|---|---|---|---|
| MAT-01 | Solides et liquides | Découvrir les propriétés des solides | fiche 4 (par contraste) |
| MAT-02 | Solides et liquides | Découvrir les propriétés des liquides | fiche 4 |
| MAT-03 | Solides et liquides | Distinguer un solide compact d'un solide divisé | — |
| MAT-04 | Solides et liquides | Distinguer un solide divisé d'un liquide | fiche 4 (surface libre) |
| MAT-05 | Solides et liquides | Reconnaître quelques éléments de la verrerie de laboratoire | fiches 4 à 7 (matériel) |
| MAT-06 | Solides et liquides | Associer chaque pictogramme de danger à son danger et à la conduite à tenir | ressources MAT (activité « Sécurité en chimie ») |
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
| MAT-18 | Température d'un corps | Associer un type de thermomètre à son usage | ressources MAT (types de thermomètres) |
| MAT-19 | Changements d'état de l'eau | Réaliser la solidification de l'eau | fiche 7, activité 1 |
| MAT-20 | Changements d'état de l'eau | Réaliser la fusion de la glace | fiche 7 |
| MAT-21 | Changements d'état de l'eau | Montrer la variation de volume de l'eau au cours de la solidification et de la fusion | — (fiche fusionnée, voir MAT-21) |
| ~~MAT-22~~ | Changements d'état de l'eau | Fusionnée dans MAT-21 (décision du 25 octobre 2026) | — |
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
- Pratiques scientifiques (collège) à chaque mesure : écrire la valeur avec son unité, préciser la précision de lecture, attendre la stabilisation, répéter une mesure douteuse, consigner dans un tableau. Les valeurs de la simulation sont signalées comme simulées.
- Terminologie : « condensation » désigne le passage de la vapeur à l'état liquide (usage du programme MENA ; « liquéfaction » est donné comme synonyme). Sublimation et condensation solide : hors lot.

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

### MAT-06 · Associer chaque pictogramme de danger à son danger et à la conduite à tenir

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Solides et liquides |
| Compétence visée | Associer un pictogramme de danger à son danger et à la conduite à tenir. |
| À la fin de cette partie, je dois être capable de | Reconnaître les neuf pictogrammes ; lire l'étiquette d'un produit ménager ou de laboratoire et en tirer les précautions ; citer les équipements de protection à porter. |

| Opération | Scénario proposé (d'après les six questions du dossier, reformulées) |
|---|---|
| Problématiser | Awa et Kofi trouvent un désodorisant en aérosol, un produit anti-moustiques et deux flacons de laboratoire. Que signifient les dessins rouges sur les étiquettes ? |
| Émettre une hypothèse | L'élève associe chaque pictogramme à un danger avant correction (association pictogramme / danger). |
| Expérimenter / Investiguer | 1. Lire les étiquettes des quatre produits et relever les dangers. 2. Dire s'il est permis de verser l'anti-moustiques ou le sulfate de cuivre dans l'évier, et pourquoi. 3. Choisir les équipements de protection pour manipuler des pastilles de soude. |
| Analyser et interpréter | Chaque pictogramme dit un danger précis ; certains produits en portent plusieurs ; le pictogramme « environnement » interdit l'évier et la nature. |
| Conclure | L'élève énonce trois règles : lire l'étiquette avant usage, se protéger, ne pas jeter à l'évier. |
| Communiquer | Jeu de paires (Memory) numérique et imprimable, puis trace élève imprimable ; prolongement à la maison : **observer** avec un adulte des emballages et lister leurs pictogrammes, **sans ouvrir ni manipuler** les produits. |

**Les neuf pictogrammes à retenir** (dessins originaux NohobaLab conformes au système normalisé SGH ; libellé de la source conservé séparément pour la traçabilité)

| N° | Nom affiché | Description accessible (texte alternatif) | Danger | Conduite à tenir | Libellé de la source |
|---|---|---|---|---|---|
| 1 | Explosif | Losange rouge, bombe qui éclate | Peut exploser | Tenir loin de la chaleur, des chocs, des flammes | Explosif |
| 2 | Inflammable | Losange rouge, flamme | Peut s'enflammer | Tenir loin des flammes et des étincelles | Inflammable |
| 3 | Corrosif | Losange rouge, liquide qui ronge une main et une surface | Ronge la peau, les yeux, certains matériaux | Gants et lunettes ; en cas de contact, rincer à l'eau et prévenir un adulte | Corrosif |
| 4 | Toxique (danger mortel) | Losange rouge, tête de mort et os croisés | Empoisonne, parfois en très petite quantité | Ne pas respirer, avaler ni toucher ; manipuler seulement avec le professeur | Très toxique |
| 5 | Comburant | Losange rouge, flamme au-dessus d'un cercle | Aggrave un incendie | Éloigner des produits inflammables | Comburant |
| 6 | Gaz sous pression | Losange rouge, bouteille de gaz | Peut éclater sous la chaleur | Ne pas chauffer, ne pas jeter au feu, garder au frais | Sous pression |
| 7 | Irritant ou nocif | Losange rouge, point d'exclamation | Irrite la peau, les yeux ou les voies respiratoires ; nocif en cas d'usage imprudent | Éviter le contact ; ne pas confondre avec la tête de mort | Toxique, nocif, irritant |
| 8 | Danger grave pour la santé | Losange rouge, silhouette avec une étoile dans le torse | Effets graves à long terme (cancer et autres atteintes) | Ne pas respirer ni toucher ; produit réservé au professeur | Cancérogène |
| 9 | Danger pour l'environnement | Losange rouge, arbre et poisson | Pollue l'eau et la nature | Jamais à l'évier ni dans la nature ; point de collecte | Polluant |

Le contrôle visuel du 25 octobre 2026 confirme que les neuf recadrages du dossier correspondent à leur libellé, sans inversion.

**Équipements de protection individuelle** (rubrique distincte, symboles bleus d'obligation, **non comptés** parmi les neuf pictogrammes) : blouse, lunettes, masque, gants. Pour les pastilles de soude : blouse, lunettes, gants ; le masque est à discuter avec le professeur (poussière).

Garde-fous :
- Libellés scientifiques : le n° 8 ne se réduit pas au « cancérogène » ; le n° 7 n'est pas la tête de mort ; « toxique » appartient au n° 4. Le libellé de la source pour le n° 7 est conservé tel quel dans le champ de traçabilité, pas dans l'affichage.
- Les recadrages et le texte du dossier viennent d'un manuel du commerce : ils servent de référence, **jamais republiés**. Les pictogrammes sont redessinés (SVG avec `role="img"`), les étiquettes de produits et les consignes sont originales. Les liens externes du dossier ne sont pas repris et n'ont pas été consultés.
- Contexte ivoirien : la date « depuis 2017 » et la réglementation française ne sont pas reprises ; produits proposés : insecticide en aérosol, eau de Javel, désodorisant, soude de laboratoire. Où jeter un produit usagé (question 6) : information locale à fournir (voir décisions) ; aucun lien externe.
- Aucun produit réel manipulé par l'élève ; la recherche à la maison est une observation d'emballages.
- MAT-06 traite les produits de laboratoire et ménagers ; CHI-19 traite les pictogrammes liés aux incendies, sans doublon d'exercices.
- Recette : neuf pictogrammes distincts, quatre équipements séparés, aucune association inversée, textes alternatifs, lisibilité mobile, impression exploitable, correction professeur séparée (côté serveur).

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

Garde-fous : **décidé le 25 octobre 2026** : la pression reste qualitative, sans unité (ni pascal, ni bar), sans loi de Boyle ni formule. Jauge « faible / moyenne / forte » seulement.

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

Garde-fous : **fixé le 25 octobre 2026** pour des élèves de collège : thermomètre de laboratoire de −10 °C à 110 °C, une graduation = 1 °C ; la valeur se lit à la graduation la plus proche et s'écrit avec l'unité (« 23 °C »), avec la mention « à 1 °C près ». Liquide non nommé comme mercure ; thermomètre fragile : ne jamais l'utiliser pour remuer.

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

Garde-fous : **fixé le 25 octobre 2026** : échelle du thermomètre médical de la simulation de 35 °C à 42 °C, graduation 0,1 °C (lecture « à 0,1 °C près »). Pas de conseil médical. Hygiène : un thermomètre se nettoie avant d'être partagé.

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

### MAT-18 · Associer un type de thermomètre à son usage

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Température d'un corps |
| Compétence visée | Associer un type de thermomètre à son usage. |
| À la fin de cette partie, je dois être capable de | Reconnaître six types de thermomètres, choisir celui qui convient à une situation de mesure et lire une température avec la méthode adaptée. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Pourquoi y a-t-il des thermomètres de formes si différentes (cuisine, météo, hôpital, usine) ? |
| Émettre une hypothèse | L'élève associe cinq situations à un thermomètre avant correction. |
| Expérimenter / Investiguer | Exercice d'association appareil / nom ; exercice de choix du thermomètre selon la situation (eau d'un bain, four, personne malade, air extérieur sur une journée, congélateur, surface brûlante à distance) ; entraînement à la lecture avec la fiche méthode. |
| Analyser et interpréter | Chaque instrument est adapté à une plage de températures et à un usage ; certains mesurent sans contact. |
| Conclure | L'élève relie type et usage et rédige les étapes de lecture. |
| Communiquer | Tableau type / usage / précaution ; fiche méthode imprimable ; correction professeur séparée. |

**À reconnaître (six types, niveau collège)**

| Type | Libellé anglais de la source | Usage retenu | Remarque |
|---|---|---|---|
| Thermomètre à liquide (alcool coloré) | Alcohol thermometer (le « Mercury thermometer » est cité comme élément de la source, jamais manipulé) | Laboratoire, température ambiante | Fragile ; lecture à hauteur d'œil |
| Thermomètre numérique à sonde | Digital thermometer ; Probe thermometer | Cuisine, laboratoire, liquides | « Numérique » est un mode d'affichage, « à sonde » une forme : un thermomètre peut être les deux |
| Thermomètre infrarouge | Infrared thermometer | Mesure sans contact d'une surface ou du front | Ne mesure pas à travers une vitre |
| Thermomètre mural ou à cadran | Wall thermometer ; Bimetallic thermometers | Température de la pièce, de l'air | « Bilame » est le principe interne, hors niveau |
| Thermomètre à minimum et à maximum | Minimum–maximum thermometer | Extrêmes de la journée (météo, serre) | |
| Thermomètre médical | (hors image ; voir MAT-16) | Température du corps | Échelle 35 °C à 42 °C |

**Approfondissement (lecture seule, hors évaluation)** : thermomètre à cristaux liquides (Liquid crystal thermometer), thermocouple (Thermocouple), sonde de température à résistance électrique (RTD), thermomètre à capillaire (Capillary thermometer), thermomètre pour gaz d'échappement (Exhaust gas thermometer), pyromètre (Pyrometer).

**Traçabilité des quatorze intitulés de la source** (image « Types of thermometers », stock du commerce, filigrane et crédit conservés dans le dossier) : Mercury thermometer = à mercure ; Alcohol thermometer = à alcool ; Wall thermometer = mural ; Digital thermometer = numérique ; Liquid crystal thermometer = à cristaux liquides ; Pyrometer = pyromètre ; Minimum–maximum thermometer = à minimum et à maximum ; Infrared thermometer = infrarouge ; Probe thermometer = à sonde ; Thermocouple = thermocouple ; RTD = sonde à résistance électrique ; Exhaust gas thermometer = pour gaz d'échappement ; Capillary thermometer = à capillaire ; Bimetallic thermometers = à bilame.

**Fiche méthode « Lire une température »** : 1. Choisir le thermomètre adapté. 2. Le placer (réservoir ou sonde dans le milieu, sans toucher le fond ni la paroi ; infrarouge : viser la surface). 3. Attendre que la valeur se stabilise. 4. Lire (liquide : œil à hauteur du sommet de la colonne ; numérique : valeur affichée). 5. Écrire la valeur avec l'unité et la précision (« 23 °C, à 1 °C près »). 6. Noter dans le tableau et recommencer si la valeur est douteuse.

Garde-fous :
- Les quatorze intitulés ne sont pas quatorze technologies indépendantes : l'image mélange principes de mesure, modes d'affichage, formes et usages. Cette fiche ne les présente pas comme tels.
- **Pyromètre** : l'illustration associe « Pyrometer » à un appareil qui ressemble à un thermomètre médical numérique. L'association n'est pas reprise ; on ne nomme pas « pyromètre » le thermomètre médical dessiné. Le pyromètre, mesure à distance de très hautes températures, reste en approfondissement, sans visuel tant que l'association n'est pas vérifiée.
- Aucun thermomètre à mercure à manipuler ; l'élève ne le voit que comme élément documentaire.
- L'image fournie est un visuel de banque d'images : référence documentaire seulement, jamais republiée ; visuels originaux pour l'interface.
- La fiche méthode « mesurer une température » du dossier (suivi de température, MAT-19 et MAT-20) se rattache à cette fiche.

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

### MAT-21 · Montrer la variation de volume de l'eau au cours de la solidification et de la fusion

*Fiche fusionnée le 25 octobre 2026 : elle remplace MAT-21 et MAT-22.*

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Montrer que le volume de l'eau change quand elle change d'état entre liquide et solide. |
| À la fin de cette partie, je dois être capable de | Dire que le volume de l'eau augmente quand elle gèle et diminue quand la glace fond ; citer une conséquence pratique. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Une bouteille d'eau pleine au congélateur : que peut-il arriver ? Et quand la glace fond ? |
| Émettre une hypothèse | L'élève prévoit si le niveau montera, baissera ou restera identique, à la solidification puis à la fusion. |
| Expérimenter / Investiguer | Marquer le niveau d'eau d'un tube gradué ; simuler la solidification et marquer le niveau de la glace ; simuler la fusion et marquer le nouveau niveau. |
| Analyser et interpréter | Le niveau monte quand l'eau gèle, redescend quand la glace fond : variations de sens opposés pour un même changement d'état inversé. |
| Conclure | L'élève conclut et cite un risque (bouteille déformée ou éclatée, conduite qui éclate). |
| Communiquer | Schéma avant / après avec les trois niveaux. |

Garde-fous : variation qualitative (« un peu plus de place »), sans pourcentage ni masse volumique. En réel, récipient en plastique souple, jamais en verre fermé. Un glaçon flottant dans un verre d'eau ne fait pas déborder le verre en fondant : situation différente, non traitée ici. Conséquences de la fusion des fiches : le catalogue passe de 73 à 72 entrées et le thème Matière de 26 à 25 fiches ; l'identifiant MAT-22 est retiré et non réattribué ; les compteurs, tests et libellés du hub sont à mettre à jour à la construction.

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
| Analyser et interpréter | m₁ = m₂ : la masse ne change pas, même si le volume a changé (MAT-21). |
| Conclure | L'élève énonce la conservation de la masse. |
| Communiquer | Tableau m₁ / m₂ avec conclusion. |

Garde-fous : valeurs de masse de la fiche TP (par exemple 50 g) = illustration, la balance est qualitative à l'égalité près ; récipient couvert pour éviter l'évaporation et la buée qui falsifieraient la pesée. Réutilise MES-06 et MES-07 pour la pesée.

### MAT-24 · Réaliser la vaporisation de l'eau (évaporation et ébullition) et la condensation de la vapeur d'eau

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Réaliser la vaporisation de l'eau, lente (évaporation) ou rapide (ébullition), et observer la condensation de la vapeur. |
| À la fin de cette partie, je dois être capable de | Distinguer évaporation et ébullition ; dire que l'eau bout à environ 100 °C ; dire que la vapeur se condense en gouttelettes sur une paroi froide. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Le linge sèche sans bouillir ; l'eau de la casserole bout. Dans les deux cas, où va l'eau ? Que devient la vapeur sur un couvercle ? |
| Émettre une hypothèse | L'élève prévoit : le niveau de deux soucoupes (au soleil, à l'ombre) après une journée ; la température de l'eau qui bout ; ce qui apparaît sur une paroi froide. |
| Expérimenter / Investiguer | **Évaporation** : deux soucoupes d'eau, l'une au soleil, l'autre à l'ombre, niveau relevé plusieurs fois. **Ébullition** : ballon à fond plat sur trépied, thermomètre, labogaz, température à l'ébullition. **Condensation** : paroi froide (verre) au-dessus de la vapeur. |
| Analyser et interpréter | L'évaporation est lente, se fait à la surface, sans bulles, à toute température, plus vite au chaud ; l'ébullition fait des bulles dans tout le liquide à environ 100 °C ; la vapeur se condense en gouttelettes sur la paroi froide. |
| Conclure | L'élève nomme évaporation, ébullition (deux formes de vaporisation) et condensation. |
| Communiquer | Schéma légendé avec les états physiques, tableau évaporation / ébullition. |

Garde-fous : eau bouillante et flamme : simulation, ou démonstration par le professeur seul ; verre pyrex ; thermomètre qui ne touche pas le fond. Distinguer vapeur d'eau (gaz invisible) et « fumée » blanche (gouttelettes). **Décidé le 25 octobre 2026** : le mot « évaporation » est introduit. Si la fiche devenait trop dense pour 30 minutes, la proposition est de la scinder (évaporation d'un côté) : décision réservée au propriétaire.

### MAT-25 · Expliquer le cycle de l'eau

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Propriétés physiques de la matière** / Changements d'état de l'eau |
| Compétence visée | Expliquer le cycle de l'eau avec les changements d'état. |
| À la fin de cette partie, je dois être capable de | Ordonner les étapes du cycle (évaporation, condensation, précipitations, retour à la mer ou au sol) et nommer l'état de l'eau à chaque étape. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | D'où viennent les nuages, et où va la pluie ? |
| Émettre une hypothèse | L'élève place les étapes dans un ordre de son choix avant correction. |
| Expérimenter / Investiguer | Schéma du paysage (mer, soleil, nuages, pluie, rivière) à compléter ; relier chaque étape à une expérience de la leçon (MAT-24 pour l'évaporation et la condensation, MAT-19 pour la solidification). |
| Analyser et interpréter | L'eau change d'état et circule en cycle, sans se perdre. |
| Conclure | L'élève raconte le cycle en cinq phrases. |
| Communiquer | Schéma du cycle de l'eau de l'élève, imprimable. |

Garde-fous : contexte ivoirien (lagune, saison des pluies) autorisé comme illustration. Pas d'échelle de temps ni de chiffres. Éviter de laisser croire que les nuages sont de la vapeur d'eau : ce sont de fines gouttelettes.

---

## Ressources complémentaires du dossier du 25 octobre 2026

Le dossier apporte, en plus de MAT-06 et MAT-18 (intégrés ci-dessus), huit ressources sur les propriétés de la matière et six sur l'énergie. Ce sont des pages de manuel du commerce : elles servent de **référence**, sans republication des textes, figures ni liens. Aucun identifiant nouveau n'est créé ici.

| Ressource | Contenu | Rattachement proposé | Remarques |
|---|---|---|---|
| 1 · Propriétés physiques des matériaux | Tri, conductivité thermique et électrique, aimants | Aucune fiche MAT ne couvre le sujet ; la conductivité électrique est déjà en ELE-07 | Candidat au parcours d'approfondissement (voir décisions) |
| 2 · Diagnostic de début de chapitre | Trois questions : états, origine des matériaux, changements d'état | Test d'entrée de la leçon « Changements d'état de l'eau » (avant MAT-19) | Les questions 1 et 3 conviennent ; la question 2 relève du parcours matériaux |
| 3 · Décomposition des matériaux | Durées de décomposition, pollution, protocole d'enfouissement | Parcours d'approfondissement | Durées = ordres de grandeur de la source ; protocole à confiner (jamais de plastique, verre ou métal dans la nature) |
| 4 · Températures et changements d'état | Suivi de température d'un glaçon, tableau, graphique, palier | MAT-20 (fusion) et MAT-19 (solidification) ; fiche méthode rattachée à MAT-18 | Tableau vide de la source : en simulation, les valeurs sont produites et signalées comme simulées ; en réel, elles sont saisies par l'élève |
| 5 · Cours et synthèse visuelle | Bilan du chapitre | Bilan de leçon après MAT-25 et fiches méthode (tester une propriété, mesurer une température, tracer un graphique, exploiter un palier) | Flashcards, schéma interactif et vidéo du dossier non fournis |
| 6 · Glycérol et paraffine | Exercices d'interprétation d'un palier | Différenciation de MAT-20 : niveau 1 glycérol avec aides (palier à 18 °C selon le tableau), niveau 2 paraffine (palier à 50 °C selon le tableau) | La valeur de la paraffine n'est pas universelle |
| 7 · Métaux et plastiques | Séparation magnétique, densités des plastiques, métaux et propriétés | Parcours d'approfondissement | Densité hors programme 6e à confirmer ; « la plupart des aciers » est conservé ; le chiffre de 79 % est à contextualiser ; exemples français (TGV) à remplacer |
| 8 · Tri des déchets | Étapes du tri, trommel, recyclage | Parcours d'approfondissement, exercice bilan | « Poubelle jaune » propre à la France : à contextualiser |
| 9 à 14 · Énergie, conversions, production d'électricité | Formes d'énergie, chaînes énergétiques, ressources | Hors lot Matière ; à garder pour un futur lot Énergie ou une extension Électricité | Non intégré ; exemple de production à Lille à remplacer |

Vigilances de terminologie du dossier : le tableau de la ressource 4 nomme « condensation » le passage gaz → solide et « liquéfaction » gaz → liquide ; le lot suit l'usage MENA (condensation = vapeur → liquide) et laisse sublimation et condensation solide hors lot. Le diamant et le sel de la ressource 2 sont considérés dans le contexte du diagnostic (leur origine peut demander une précision).

---

## Sources et points à confirmer

| Source | Ce qui est établi | Ce qui reste à vérifier |
|---|---|---|
| 13 TP officiels DPFC | Archive reçue le 25 octobre 2026. Fiches 4 (liquides), 5 (gaz), 6 (température), 7 (changements d'état) lues : matériel, habiletés et résultats attendus utilisés comme appui. | Les fiches TP ne couvrent pas MAT-01, 03, 04 (en partie), 06, 09, 18, 21, 25, 26 et la condensation de MAT-24 ; ces scénarios sont des propositions NohobaLab. |
| [Programme éducatif et guide d'exécution MENA, 6e](https://apprendre.auf.org/wp-content/uploads/2021/08/13-Programme_Educatif_PC_6ieme.pdf) | Compétence 2 « Propriétés physiques de la matière », leçons 4 à 7 (solides et liquides ; gaz ; température ; changements d'état). | Pages et contenus exacts de ces leçons : à relire avant construction (la lecture assistée d'octobre ne portait que sur l'Électricité). |
| Dossier « Ressources MAT » (25 octobre 2026) | Neuf pictogrammes et quatre équipements vérifiés visuellement, quatorze intitulés de thermomètres traduits, huit ressources matière et six ressources énergie transcrites. | Droits des visuels (manuel et banque d'images) : références seulement ; liens externes non consultés. |
| Dossier « Extraction des 70 activités » (23 octobre 2026) | Intitulés des 26 fiches MAT du catalogue. | Correspondance MENA marquée « à vérifier ». |
| Manuel JD Éditions | Structure et habiletés seulement ; consignes et figures originales. | Non fourni : aucune page citée ici. |

### Décisions du propriétaire (25 octobre 2026)

1. MAT-06 : neuf pictogrammes et quatre équipements séparés, enrichis par le dossier. **Décidé.**
2. MAT-09 : pression qualitative, sans unité. **Décidé.**
3. MAT-13 et MAT-16 : échelles adaptées au collège (laboratoire −10 à 110 °C au degré ; médical 35 à 42 °C au dixième). **Décidé** (valeurs de la simulation).
4. MAT-18 : liste des types fixée à six à reconnaître, six en approfondissement. **Décidé** sur la base du dossier ; à relire.
5. MAT-24 : le mot « évaporation » est introduit. **Décidé.**
6. MAT-21 et MAT-22 : plus de fiches séparées, donc fusion en MAT-21 (lecture de la réponse « Non » : 25 fiches, catalogue à 72 entrées). **Appliqué ; à corriger si ce n'était pas l'intention.**

### Décisions restantes

1. Valider les 25 scénarios mis à jour et donner le feu vert à la construction du lot (fiches, simulations, catalogue, tests, une vérification visuelle, contrôle de conformité).
2. Parcours d'approfondissement « Matériaux, tri et déchets » (ressources 1, 3, 7, 8) : créer ou non de nouvelles fiches, avec quels identifiants, et sans dépasser le programme 6e (densité notamment).
3. MAT-06, question 6 : où jeter un produit usagé en Côte d'Ivoire (information locale à fournir).
4. MAT-06 : masque ou non pour les pastilles de soude.
5. Après construction et recette, les fiches restent **prototype** jusqu'à votre validation explicite ; les corrigés ne seront pas placés dans les fichiers publics.
