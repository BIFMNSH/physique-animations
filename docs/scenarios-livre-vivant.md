# Scénarios : « Livre vivant » des quatre niveaux (6e, 5e, 4e, 3e)

Statut : **lots 1 à 5 construits (25 leçons) ; les 28 autres suivent le tableau ci-dessous, validé le 5 nov. 2026.** Branche `feat/fiches-5e-investigation`. Page : `/livre-vivant/`, à côté du cartable (`/livre/`) pour comparer les deux.
Source de cadrage : le prompt « livre vivant » du propriétaire, appliqué sans la section bilingue (interface française). Aucune page de manuel fournie : tout part du programme et des leçons Studio (À retenir, quiz), sans copie de manuel.

## Structure commune (prompt)
- Livre ouvert sur un bureau en chêne clair, deux pages (480 × 840), une page sur téléphone < 600 px. Cinq lignes de plan puis 3 à 5 chapitres : **1 moment essentiel (vedette, sans bouton « Démarrer »)**, 1 modèle secondaire ou une comparaison, **défi** (6 à 7 manches, dont au moins une qui lit le laboratoire). Page de gauche : curiosité, explication courte, loi en évidence, note jaune, « Prédis puis révèle », vérification ✓. Page de droite : modèle pop-up en panneaux CSS 3D, curseurs, valeurs en direct avec l'équation chiffrée.
- Son Web Audio : démarre au premier mouvement, s'arrête 1,5 s après le dernier, sourdine visible, niveau plafonné, coupé au changement de page. Tracés « dessinés sous les yeux » (stylo lumineux). « Comparer en alternance » avec une couleur constante par situation. Mode enseignant (lab agrandi, textes masqués, Esc). Animations actives par défaut même en « réduction des mouvements », bouton pour les arrêter.
- Le sélecteur de niveau du sommaire (6e · 5e · 4e · 3e) change de classe et donne accès à toutes les leçons.

## Modèles principaux disponibles dans le moteur
`courbe` (relation entre grandeurs, tracé animé) · `signal` (oscilloscope + son) · `particules` (agitation, états, dilatation) · `banc` (montage à manipuler : électricité, optique) · `couches` (structure démontable) · `etapes` (processus) · `frise` (temps/espace) · `scenario` (décisions).

## Lot 1 (construit)
| Niveau | Leçon | Moment essentiel | Modèle | Erreur fréquente visée |
|---|---|---|---|---|
| 6e | changements-etat | Curseur de température : les particules changent d'état, le thermomètre reste à 0 °C ou 100 °C pendant le palier | particules + courbe | « La température continue de monter pendant l'ébullition » |
| 5e | dilatation-gaz | Curseur de température : le gaz du ballon occupe plus de place, particules plus agitées (pas de comparaison à deux situations : barres qualitatives gaz/liquide/solide au chapitre 2) | particules | « Ce sont les particules qui grossissent » |
| 4e | tension-sinusoidale | Curseurs f et U max : oscilloscope tracé, son à la fréquence, T = 1 ÷ f en direct | signal | « Plus la fréquence est grande, plus la période est grande » |
| 3e | masse-poids | Curseur de masse, choix Terre / Lune : P = m × g, droite tracée, dynamomètre | courbe | « La masse change quand on va sur la Lune » |
| 3e | conducteur-ohmique | Curseur d'intensité, deux résistances comparées en alternance : U = R × I, droite par l'origine | courbe | « Quand U double, R double » (R est fixée par le composant ; c'est I qui suit U) |

## Lot 2 (construit, 6e)
| Niveau | Leçon | Moment essentiel | Modèle | Erreur fréquente visée |
|---|---|---|---|---|
| 6e | circuit-electrique | Choisir l'objet testé et le nombre de fils : la lampe brille si la boucle est fermée et l'objet conducteur | banc | « Un seul fil suffit » |
| 6e | commande-circuit | Interrupteur ouvert/fermé ; comparaison interrupteur à droite / à gauche | banc | « Il faut le placer tout près de la lampe » |
| 6e | court-circuit | Fil sur la lampe, avec ou sans fusible (simulation) | banc | « La lampe brille plus fort » |
| 6e | solides-liquides | Incliner un bocal : surface libre horizontale ; bloc de bois qui garde sa forme ; même volume, deux bocaux | particules | « La surface s'incline avec le bocal » |
| 6e | les-gaz | Piston de seringue : V diminue, 20 particules ; air contre eau | particules | « Les particules rapetissent » |

## Lot 3 (construit, 5e électricité)
| Niveau | Leçon | Moment essentiel | Modèle | Erreur fréquente visée |
|---|---|---|---|---|
| 5e | generateur-recepteur | Curseur de tension du générateur : lampe 6 V éteinte, sous-tension, normale, surtension ; comparaison lampe 6 V / 3 V | banc | « Une pile plus forte, c'est toujours mieux » |
| 5e | association-lampes | Série ou dérivation, on dévisse L1 ou L2 | banc | « En série, les autres lampes restent allumées » |
| 5e | piles-serie | Piles de 1,5 V bout à bout, U = somme ; une pile retournée se retranche | courbe/banc | « Une pile retournée ajoute quand même sa tension » |
| 5e | tension | Voltmètre en dérivation ; en série ; bornes inversées ; interrupteur ouvert (pile 4,5 V, lampe 0 V) | banc | « Sans courant, il n'y a pas de tension » |
| 5e | intensite | Ampèremètre en série : même valeur partout (0,10 A) ; en dérivation I = I₁ + I₂ = 0,25 A | banc | « L'ampèremètre mesure différemment avant et après la lampe » |

## Lot 4 (construit, 5e matière)
| Niveau | Leçon | Moment essentiel | Modèle | Erreur fréquente visée |
|---|---|---|---|---|
| 5e | dilatation-solides | Boule et anneau : chauffée, la boule ne passe plus ; joint de dilatation d'une route, avec et sans joint | particules | « Les particules grossissent » |
| 5e | dilatation-liquides | Thermomètre : le niveau monte, 14 particules inchangées ; alcool et eau comparés | particules | « Il y a plus de liquide » |
| 5e | pression-atmospherique | Hémisphères de Magdebourg : P extérieure 1 013 hPa, intérieure selon l'air retiré ; baromètres à deux altitudes | particules/courbe | « Ils sont collés » |
| 5e | melanges | Un mélange, une technique (filtration, décantation, évaporation), résultat dessiné | étapes | « Le sel reste sur le filtre » |
| 5e | atomes-molecules | Molécules en couleurs CPK, dénombrement des atomes ; corps pur simple ou composé | couches | « Le 2 de H₂O = 2 molécules » |

## À construire : les 28 autres leçons
| Niveau | Leçon | Moment essentiel | Modèle |
|---|---|---|---|
| 6e | temperature | Thermomètre à graduer et lire | banc |
| 6e | constituants-air | Bougie sous cloche : l'eau monte d'environ un cinquième | couches |
| 6e | combustion-solide-liquide | Retirer un côté du triangle du feu, la flamme s'éteint | étapes |
| 6e | combustion-gaz | Gaz, air, flamme : combustion complète ou non | étapes |
| 6e | dangers-combustions | Que faire face à un feu, face au monoxyde de carbone | scénario |
| 6e | volume | Lire le volume dans une éprouvette, ménisque | banc |
| 6e | masse | Peser à l'équilibre | banc |
| 5e | combustion-carbone | Carbone + dioxygène, test à l'eau de chaux | étapes |
| 5e | combustion-soufre | Soufre + dioxygène, gaz piquant | étapes |
| 4e | sources-recepteurs | Voir un objet : source, objet, œil | banc |
| 4e | propagation-lumiere | Rayon en ligne droite, ombre | banc |
| 4e | phases-eclipses | Déplacer la Lune sur son orbite | frise |
| 4e | lumiere-blanche | Prisme : décomposer la lumière | banc |
| 4e | aimant-bobine | Aimant qui bouge : tension induite | signal |
| 4e | tension-alternative | Alternatif ou continu à l'oscilloscope | signal |
| 4e | dangers-secteur | 220 V : gestes sûrs | scénario |
| 4e | transfo-redressement | Transformateur et diode | signal |
| 4e | atomes-ions | Gagner ou perdre des électrons | couches |
| 4e | metal-ion | Métal et ions en solution | étapes |
| 4e | traitement-eau | Étapes de potabilisation | étapes |
| 4e | qualite-eau | Lire des tests de qualité | scénario |
| 3e | les-forces | Représenter une force par un vecteur | banc |
| 3e | equilibre-deux-forces | Deux forces : conditions d'équilibre | banc |
| 3e | travail-puissance | W = F × d, P = W ÷ t | courbe |
| 3e | energie-mecanique | Chute : Ec et Ep | courbe |
| 3e | electrolyse-eau | Deux volumes de dihydrogène pour un de dioxygène | étapes |
| 3e | alcanes | Construire un alcane | couches |
| 3e | oxydation-corps-purs | Corps pur + dioxygène | étapes |
| 3e | reduction-oxydes | Réduction d'un oxyde | étapes |
| 3e | solutions-acides-basiques | Échelle de pH | banc |
| 3e | lentilles | Banc d'optique | banc |
| 3e | defauts-oeil | Œil et lentille correctrice | banc |
| 3e | puissance-energie-electriques | P = U × I, E = P × t | courbe |

## Choix et écarts à signaler au propriétaire
- Aucune page de manuel : valeurs prises dans les leçons Studio (par exemple g ≈ 9,8 N/kg arrondi à 10, 1,6 N/kg sur la Lune ; secteur 220 V et 50 Hz). Les valeurs de départ des curseurs sont des choix de conception, pas des données de manuel.
- Quiz : les leçons Studio ont 5 manches ; le livre ajoute 1 manche de laboratoire (6 au total) calculée à partir de ce que l'élève a réglé.
- Écrans de lot 1 : le **son** et le **tracé animé** ne peuvent pas être entendus ni vus en direct par l'agent ; les tests vérifient le code et les calculs, pas l'oreille.

## Remplacé ou retiré (lot 1)
- Section « Bilingue arabe / anglais » du prompt : retirée sur demande ; interface en français seul, donc ni `bdi` ni mise en page droite-à-gauche.
- Changements d'état et dilatation : modèles qualitatifs ; seuls 0 °C et 100 °C sont chiffrés (aucune valeur inventée).
- Défi : 5 manches issues du quiz Studio + 2 manches lues sur le laboratoire = 7.
- Mode enseignant : page de droite seule, laboratoire élargi, bouton de sortie + Échap.
- 48 leçons : cartes « en préparation » dans le sommaire jusqu'à validation du tableau ci-dessus.
- Lot 2 : leçons qualitatives du programme de 6e ; la graduation du piston (V = 100 − 0,7 × poussée en %) et le volume d'eau de 100 mL sont des choix de conception, pas des mesures. Court-circuit : simulation seulement, avec rappel de ne jamais le réaliser sans le professeur. Les points jaunes montrent le sens conventionnel du courant.
- Lot 3 : valeurs des leçons Studio (lampe 6 V, 0,10 A ; I₁ = 0,15 A, I₂ = 0,10 A). Lampe 4,5 V (piles en série) et lampe 3 V (comparaison) : choix de conception. Seuil de grillage d'une lampe = 1,5 × sa tension nominale : choix de conception, pas une donnée de manuel. Voltmètre en série : il affiche la tension de la pile et éteint la lampe (qualitatif). Interrupteur ouvert : 0 V aux bornes de la lampe, la pile garde sa tension.
- Mise en page : espacements des pages de gauche resserrés (le texte débordait de 24 à 60 px sur six pages). Le contrôle de débordement des pages fait désormais partie des captures.
- Lot 4 : leçons qualitatives, sauf deux calculs. Pression intérieure = 1 013 hPa × part d'air restant (volume et température constants). P(h) = 1 013 hPa × exp(−h / 8 400 m) : approximation de l'atmosphère à température constante, à confirmer avec le manuel. Boule/anneau : l'échelle de chauffage est en % et l'écart est exagéré ; seuil de passage et flèche de la barre (sans joint : (2/π)·√(ΔL·L)) sont des choix de dessin. Alcool plus dilatable que l'eau : qualitatif, sans coefficients. Évaporation : l'eau est perdue (pas de distillation). Les nombres de 1 000 et plus s'écrivent avec une espace insécable.
- Lot 5 (6e : température, volume, masse, constituants de l'air, combustion d'un solide ou d'un liquide) : qualitatif, hors repères 0 °C / 100 °C et 1 L = 1 000 mL. Masses d'objets indicatives (citron 100 g, pomme 150 g, mangue 400 g) ; inclinaison du fléau = choix de dessin (nulle à l'équilibre) ; bécher gradué de 20 mL, indicatif. Air : 4 O₂ + 16 N₂ sur le dessin = 1/5 et 4/5 ; l'eau monte de 20 % de la hauteur de la cloche : choix de dessin. Feu : simulation seule, jamais de flamme réelle sans le professeur. Écart connu : en chapitre 2 de la combustion, les deux contrôles « Moyen d'extinction » n'indiquent pas leur situation.
