# Scénarios à valider · lot Électricité (ELE-08 à ELE-16)

24 octobre 2026 · collection Côte d'Ivoire, 6e · **En conception**.

Propositions originales NohobaLab : ni texte officiel reproduit, ni conformité scientifique et pédagogique déjà certifiée. **Aucune fiche n'est construite à ce stade.** ELE-06 a son propre scénario : [scenario-ele06.md](scenario-ele06.md). Les neuf fiches ci-dessous complètent le thème Électricité (ELE-01 à 05, 07 et 17 existent déjà).

## Vue d'ensemble

| Fiche | Chapitre | Compétence visée (une seule) | Appui possible dans le Studio |
|---|---|---|---|
| ELE-08 | Commande d'un circuit | Réaliser un circuit commandé par un interrupteur simple | `commande-circuit` |
| ELE-09 | Commande d'un circuit | Réaliser un circuit commandé par un bouton poussoir | `commande-circuit` |
| ELE-10 | Commande d'un circuit | Réaliser l'allumage alterné de deux lampes avec un commutateur | `commande-circuit` |
| ELE-11 | Commande d'un circuit | Réaliser un montage va-et-vient | `commande-circuit` |
| ELE-12 | Court-circuit et protection | Définir un court-circuit | `court-circuit` |
| ELE-13 | Court-circuit et protection | Identifier les causes d'un court-circuit | `court-circuit` |
| ELE-14 | Court-circuit et protection | Découvrir les dangers d'un court-circuit | `court-circuit` |
| ELE-15 | Court-circuit et protection | Découvrir le rôle du fusible et du disjoncteur | `court-circuit` |
| ELE-16 | Court-circuit et protection | Identifier les causes d'une panne dans un circuit | atelier électrique |

Règles communes à tout le lot :
- Atelier d'électricité partagé : pile 4,5 V aux bornes de même taille, fils attachés par des pinces, contacts de la lampe au plot et au culot (jamais le verre). Montage réaliste et schéma normalisé côte à côte, synchronisés.
- Modèle **qualitatif** : aucune intensité ni tension annoncée comme mesurée. Les valeurs d'illustration du Studio ne sont pas reprises.
- Une seule variable modifiée à la fois. Hypothèse enregistrée avant la manipulation, jamais écrasée.
- L'élève investigue sur simulation. Toute manipulation réelle reste encadrée par le professeur ; aucun court-circuit n'est réalisé en vrai. Aucun travail sur le secteur 220 V.
- Mouvement réduit : repères statiques à la place des animations. Étiquettes et `aria-label` sur tous les contrôles et images.
- Statut `prototype` après construction, jusqu'à validation du propriétaire.

---

## ELE-08 · Réaliser un circuit commandé par un interrupteur simple

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Commande d'un circuit |
| Compétence visée | Placer un interrupteur dans la boucle d'un circuit pour commander une lampe. |
| À la fin de cette partie, je dois être capable de | Réaliser un circuit pile, lampe, interrupteur ; prévoir l'état de la lampe selon la position de l'interrupteur ; légender le schéma. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Kofi veut allumer et éteindre la lampe de sa chambre sans débrancher la pile. Que faut-il ajouter au circuit ? |
| Émettre une hypothèse | L'élève choisit où placer l'interrupteur et prévoit l'état de la lampe interrupteur ouvert, puis fermé. |
| Expérimenter / Investiguer | Essais interrupteur ouvert et fermé ; puis interrupteur déplacé dans la boucle (avant la lampe, après la lampe), un seul changement à la fois. |
| Analyser et interpréter | Boucle ouverte : lampe éteinte ; boucle fermée : lampe allumée. L'emplacement dans la boucle unique ne change pas la commande. |
| Conclure | L'élève formule : un interrupteur ouvert coupe la boucle. |
| Communiquer | Schéma normalisé des deux positions, hypothèse initiale et conclusion imprimés. |

Garde-fous : limiter à la boucle unique (en série) ; ne pas généraliser à un circuit à plusieurs branches.

## ELE-09 · Réaliser un circuit commandé par un bouton poussoir

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Commande d'un circuit |
| Compétence visée | Utiliser un bouton poussoir, ouvert ou fermé au repos, pour commander un circuit pendant l'appui. |
| À la fin de cette partie, je dois être capable de | Réaliser le circuit ; décrire ce qui se passe pendant et après l'appui ; distinguer bouton poussoir et interrupteur. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La sonnette de la maison d'Awa ne sonne que lorsqu'on appuie. Quel élément le permet ? |
| Émettre une hypothèse | L'élève prévoit l'état de la lampe appui maintenu, puis après relâchement. |
| Expérimenter / Investiguer | Appui maintenu, appui bref, relâchement, avec le bouton ouvert au repos puis fermé au repos ; comparaison avec un interrupteur dans le même circuit, seul l'élément de commande change. |
| Analyser et interpréter | Bouton ouvert au repos : le circuit se ferme pendant l'appui. Bouton fermé au repos : il s'ouvre pendant l'appui. L'interrupteur, lui, garde sa position. |
| Conclure | L'élève décrit la différence en une phrase. |
| Communiquer | Deux schémas (appui / repos), tableau des observations imprimé. |

Garde-fous : le programme prescrit les **deux versions** du bouton (ouvert et fermé au repos) et leurs symboles ; les deux sont traitées. Le contact de repos de l'élément réel reste à confirmer sur le matériel ivoirien.

## ELE-10 · Allumage alterné de deux lampes avec un commutateur

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Commande d'un circuit |
| Compétence visée | Utiliser un commutateur pour allumer l'une ou l'autre de deux lampes. |
| À la fin de cette partie, je dois être capable de | Réaliser le montage ; prévoir quelle lampe s'allume selon la position ; repérer la borne commune du commutateur. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Un coffret doit allumer soit le voyant vert, soit le voyant rouge, jamais les deux. Comment commander cela avec un seul organe ? |
| Émettre une hypothèse | L'élève prévoit l'état des deux lampes pour chaque position du commutateur. |
| Expérimenter / Investiguer | Basculer le commutateur entre ses deux positions ; relever l'état de chaque lampe dans un tableau. |
| Analyser et interpréter | Dans chaque position, une seule boucle est fermée ; l'autre lampe n'est pas dans une boucle fermée. |
| Conclure | L'élève explique pourquoi les deux lampes ne s'allument pas en même temps. |
| Communiquer | Schéma normalisé avec la position du commutateur annotée, tableau imprimé. |

Garde-fous : ne pas confondre avec le va-et-vient (ELE-11) ; symbole du commutateur à confirmer avec le document de classe.

## ELE-11 · Réaliser un montage va-et-vient

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Commande d'un circuit |
| Compétence visée | Commander une même lampe depuis deux endroits avec deux commutateurs. |
| À la fin de cette partie, je dois être capable de | Réaliser le montage à deux commutateurs ; constater que chacun change l'état de la lampe ; compléter le tableau des quatre combinaisons. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Dans le couloir de Kofi, on veut allumer et éteindre la même lampe depuis les deux bouts. Est-ce possible avec un seul interrupteur ? |
| Émettre une hypothèse | L'élève prévoit si changer un seul commutateur suffit à modifier l'état de la lampe. |
| Expérimenter / Investiguer | Tester les quatre combinaisons des deux commutateurs, en changeant un commutateur à la fois ; noter l'état de la lampe. |
| Analyser et interpréter | Changer la position de n'importe quel commutateur inverse l'état de la lampe ; deux chemins relient les commutateurs. |
| Conclure | L'élève formule : chaque commutateur peut allumer ou éteindre, quelle que soit la position de l'autre. |
| Communiquer | Tableau des quatre combinaisons et schéma normalisé annotés. |

Garde-fous : le guide d'exécution précise que le va-et-vient n'est pas un organe de commande mais un circuit qui utilise deux commutateurs : la fiche vise aussi à le **reconnaître** sur un schéma. Câblage en basse tension uniquement (4,5 V) ; l'installation d'une maison réelle relève d'un électricien. Le tableau est construit par l'élève, pas affiché d'avance.

## ELE-12 · Définir un court-circuit

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Court-circuit et protection |
| Compétence visée | Définir un court-circuit comme une liaison de très faible résistance entre deux points d'un circuit (bornes du générateur ou bornes d'un récepteur). |
| À la fin de cette partie, je dois être capable de | Reconnaître un court-circuit sur un schéma ; décrire l'effet sur la lampe ; dire pourquoi c'est une situation à éviter. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Awa relie par erreur un fil entre les deux bornes de la pile. Que se passe-t-il ? |
| Émettre une hypothèse | L'élève prévoit l'état de la lampe quand un fil est ajouté (aux bornes de la pile, puis aux bornes de la lampe). |
| Expérimenter / Investiguer | En simulation uniquement : ajouter un fil virtuel dans deux endroits ; observer la lampe et l'indicateur qualitatif d'échauffement. |
| Analyser et interpréter | Le courant passe par le fil, pas par la lampe ; le générateur débite beaucoup et chauffe. |
| Conclure | L'élève écrit la définition avec ses mots. |
| Communiquer | Deux schémas annotés, un avec court-circuit, un sans. |

Garde-fous : l'élève investigue sur simulation ; échelle d'échauffement qualitative, sans valeur d'intensité (la valeur du Studio est une illustration). Le programme prescrit aussi, sous la conduite du professeur, un court-circuit d'une lampe par un fil et d'une pile de 9 V par de la paille de fer : **décision du 24 octobre 2026 : simulation pour l'élève + démonstration facultative du professeur**, décrite dans la fiche professeur, réalisée par le professeur seul après l'investigation de l'élève (protocole de sécurité à valider par le propriétaire).

## ELE-13 · Identifier les causes d'un court-circuit

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Court-circuit et protection |
| Compétence visée | Identifier, parmi des situations du quotidien, celles qui créent un court-circuit. |
| À la fin de cette partie, je dois être capable de | Classer des situations (fils dénudés qui se touchent, objet métallique entre deux contacts, liquide conducteur) ; justifier chaque choix. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Plusieurs incidents arrivent dans une maison. Lesquels créent un chemin direct entre les deux fils ? |
| Émettre une hypothèse | L'élève classe d'abord six situations illustrées en « court-circuit » ou « pas de court-circuit ». |
| Expérimenter / Investiguer | Chaque situation est testée en simulation ; l'élève relève ce qu'il observe. |
| Analyser et interpréter | Un court-circuit apparaît quand un conducteur relie directement les deux fils ; un isolant ne le crée pas. L'élève distingue ce contact accidentel d'une simple surcharge (trop d'appareils). |
| Conclure | L'élève corrige son classement et énonce deux causes. |
| Communiquer | Tableau des situations imprimé avec classement initial et corrigé. |

Garde-fous : le guide demande seulement de faire identifier les causes, sans liste officielle : les six situations sont une proposition NohobaLab. Ne pas affirmer que « toute eau conduit » ; s'appuyer sur ELE-07 pour les liquides. Situations illustrées sans mise en scène de danger.

## ELE-14 · Découvrir les dangers d'un court-circuit

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Court-circuit et protection |
| Compétence visée | Relier un court-circuit à ses conséquences : échauffement, détérioration, risque d'incendie. |
| À la fin de cette partie, je dois être capable de | Citer deux dangers d'un court-circuit ; relier chaque danger à une cause ; dire quel comportement adopter. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Une prise chauffe, une odeur de brûlé apparaît. Pourquoi est-ce grave ? |
| Émettre une hypothèse | L'élève prévoit ce qui arrive au fil quand le courant devient très grand. |
| Expérimenter / Investiguer | En simulation : augmenter qualitativement le passage du courant dans un fil ; observer l'échauffement du fil et de la gaine. |
| Analyser et interpréter | Plus le courant est grand, plus le fil chauffe ; une gaine peut fondre. |
| Conclure | L'élève écrit les dangers et la conduite à tenir. |
| Communiquer | Affiche de prévention de l'élève, imprimable. |

Garde-fous : ton factuel, non anxiogène ; **numéro des sapeurs-pompiers 180 à reconfirmer auprès du GSPM avant toute publication** (déjà ouvert au registre).

## ELE-15 · Rôle du fusible et du disjoncteur

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Court-circuit et protection |
| Compétence visée | Expliquer que fusible et disjoncteur coupent le circuit en cas de courant trop grand. |
| À la fin de cette partie, je dois être capable de | Placer un fusible dans un circuit ; décrire ce que fait un fusible puis un disjoncteur ; dire pourquoi on ne remplace jamais un fusible par un simple fil. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | Dans le tableau de la maison, un élément « saute » au lieu de laisser le fil chauffer. À quoi sert-il ? |
| Émettre une hypothèse | L'élève prévoit ce que devient le circuit quand un court-circuit apparaît avec un fusible. |
| Expérimenter / Investiguer | En simulation : court-circuit sans protection, puis avec fusible, puis avec disjoncteur ; relever ce qui change. |
| Analyser et interpréter | Fusible : le filament fond, le circuit s'ouvre, il faut le remplacer. Disjoncteur : il se déclenche et se réarme. |
| Conclure | L'élève compare les deux protections en deux phrases. |
| Communiquer | Tableau de comparaison fusible / disjoncteur imprimé. |

Garde-fous : le guide ne détaille que la fusion du fusible et le rôle du disjoncteur, sans mécanisme : rester qualitatif et ne pas inventer de fonctionnement interne. Message explicite « ne jamais remplacer un fusible par un fil » ; calibre non chiffré dans la simulation ; aucune intervention sur une installation réelle (électricien agréé, CIE).

## ELE-16 · Identifier les causes d'une panne dans un circuit

| Repère | Proposition |
|---|---|
| Thème / Chapitre | **Électricité** / Court-circuit et protection |
| Compétence visée | Mener un dépannage méthodique pour trouver la cause d'une lampe qui ne s'allume pas. |
| À la fin de cette partie, je dois être capable de | Lister les causes possibles (pile usée, lampe grillée, interrupteur ouvert, fil ou contact défaillant) ; tester une cause à la fois ; conclure. |

| Opération | Scénario proposé |
|---|---|
| Problématiser | La lampe de Kofi ne s'allume plus. Que vérifier, et dans quel ordre ? |
| Émettre une hypothèse | L'élève classe les causes possibles de la plus probable à la moins probable. |
| Expérimenter / Investiguer | Quatre circuits en panne, cause cachée ; l'élève remplace un élément à la fois par un élément connu en bon état. |
| Analyser et interpréter | Quand l'élément défectueux est remplacé, la lampe s'allume : la panne est localisée. |
| Conclure | L'élève écrit la cause trouvée et la méthode utilisée. |
| Communiquer | Fiche de dépannage imprimée (causes testées, résultat de chaque test). |

Garde-fous : le programme prévoit de trouver la panne avec un testeur de continuité ou un circuit témoin, puis de remplacer l'élément défectueux : la simulation propose un circuit témoin et un testeur de continuité qualitatif (allumé / éteint), sans valeur chiffrée. Une seule cause cachée par circuit ; **jamais sur le secteur** (interdit par le guide).

---

## Sources et points à confirmer

| Source | Ce qui est établi | Ce qui reste à vérifier |
|---|---|---|
| [Programme éducatif et guide d'exécution MENA, 6e](https://apprendre.auf.org/wp-content/uploads/2021/08/13-Programme_Educatif_PC_6ieme.pdf) | Lecture assistée du 24 octobre 2026 : « Commande d'un circuit » = programme p. 7-8, guide p. 17-18 ; « Court-circuit et protection » = programme p. 8, guide p. 19-20. Habiletés : réaliser et schématiser les circuits commandés (interrupteur, bouton poussoir ouvert et fermé au repos, commutateur, va-et-vient) ; définir court-circuit, causes, dangers, rôle du fusible et du disjoncteur ; identifier une panne et remplacer l'élément défectueux. | Numéros de page issus d'une lecture assistée : à confirmer sur le PDF. Le guide ne donne ni liste des causes, ni mécanisme du disjoncteur, ni câblage détaillé du va-et-vient. |
| Dossier « Extraction des 70 activités » (23 octobre 2026) | Intitulés et scénarios éditoriaux NohobaLab ; pages 25 à 38 du manuel = « référence éditoriale antérieure » ; correspondance MENA marquée « à vérifier ». | Ces scénarios sont des adaptations, pas des textes officiels. |
| Manuel JD Éditions | Structure et habiletés seulement ; consignes et figures originales. | Non fourni ici : pages citées par le dossier non revérifiées. |
| 13 TP officiels DPFC | Archive annoncée par le dossier. | **Archive non reçue** (seuls deux documents Word ont été joints) : TP concernés et matériel à confirmer. |

### Décisions attendues du propriétaire

1. Valider le découpage en neuf fiches et leur appui sur les leçons `commande-circuit` et `court-circuit` du Studio (réutilisation du modèle, sans reprendre ses valeurs d'illustration).
2. Valider ELE-14 (dangers) et ELE-15 (protections), ainsi que le numéro 180 avant publication.
3. Décider si ELE-06 est construite avec ce lot ou séparément.
4. ~~Choix pour ELE-12~~ **Décidé** : simulation élève + démonstration facultative du professeur (court-circuit réel guidé, paille de fer). Reste à valider : le protocole de sécurité exact (type de pile, quantité, durée, équipement).
5. Fournir l'archive des 13 TP DPFC pour confirmer les références.
6. Après construction et recette, les fiches restent **prototype** jusqu'à votre validation explicite. Les corrigés ne seront pas placés dans les fichiers publics (consigne de la passation).
