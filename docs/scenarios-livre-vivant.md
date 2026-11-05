# Scénarios : « Livre vivant » des quatre niveaux (6e, 5e, 4e, 3e)

Statut : **lot 1 construit pour 5 leçons, les 48 autres sont à valider ici.** Branche `feat/fiches-5e-investigation`. Page : `/livre-vivant/`, à côté du cartable (`/livre/`) pour comparer les deux.
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

## À valider : les 48 autres leçons
| Niveau | Leçon | Moment essentiel | Modèle |
|---|---|---|---|
| 6e | circuit-electrique | Fermer la boucle : relier pile, lampe, fils, la lampe s'allume | banc |
| 6e | commande-circuit | Interrupteur ouvert/fermé commande la lampe | banc |
| 6e | court-circuit | Un fil en dérivation éteint la lampe et chauffe : le fusible protège | scénario |
| 6e | solides-liquides | Verser : le solide garde sa forme, le liquide prend celle du récipient | particules |
| 6e | les-gaz | Piston : le gaz se comprime et remplit tout le volume | particules |
| 6e | temperature | Thermomètre à graduer et lire | banc |
| 6e | constituants-air | Bougie sous cloche : l'eau monte d'environ un cinquième | couches |
| 6e | combustion-solide-liquide | Retirer un côté du triangle du feu, la flamme s'éteint | étapes |
| 6e | combustion-gaz | Gaz, air, flamme : combustion complète ou non | étapes |
| 6e | dangers-combustions | Que faire face à un feu, face au monoxyde de carbone | scénario |
| 6e | volume | Lire le volume dans une éprouvette, ménisque | banc |
| 6e | masse | Peser à l'équilibre | banc |
| 5e | generateur-recepteur | Placer générateur et récepteur, sens du courant | banc |
| 5e | association-lampes | Série ou dérivation : une lampe dévissée | banc |
| 5e | piles-serie | Associer des piles : les tensions s'ajoutent | courbe |
| 5e | intensite | Ampèremètre en série, valeur affichée | banc |
| 5e | tension | Voltmètre en dérivation, valeur affichée | banc |
| 5e | pression-atmospherique | Ventouse et air : l'air presse | particules |
| 5e | melanges | Trier, filtrer, décanter | étapes |
| 5e | atomes-molecules | Assembler des atomes en couleurs CPK | couches |
| 5e | combustion-carbone | Carbone + dioxygène, test à l'eau de chaux | étapes |
| 5e | combustion-soufre | Soufre + dioxygène, gaz piquant | étapes |
| 5e | dilatation-solides | Boule et anneau | particules |
| 5e | dilatation-liquides | Thermomètre, niveau du liquide | particules |
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
