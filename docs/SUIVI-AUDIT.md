# Consolidation après audit — lots 1 et 2

Référence de l’audit : main `e0603c013692e3a102b21e8d481707be0a5ff567`.
Branche : `codex/consolidation-pedagogique-2026`, PR #1.
Validation : 19 octobre 2026. Cette proposition ne clôture pas les 28 constats.

## Livré dans ce lot

- A01 : classement pH 6,6 / 7 / 7,4 corrigé ; distinctions acide/neutre/basique dans le laboratoire de qualité de l’eau corrigées aussi.
- A02 : révolution sidérale 27,3 jours et lunaison 29,5 jours distinguées dans narration, sous-titre et bilan.
- A03–A04 : résultats de traitement/analyse présentés comme résultats du modèle ; retrait du dosage domestique, des unités réelles du réglage fictif et des certifications injustifiées de potabilité. Seuils de l’exercice explicitement pédagogiques. Les normes ivoiriennes restent à documenter.
- A05 : retrait de la frontière universelle de danger à 30 mA ; limites des résistances et déclenchements simulés indiquées ; effets physiologiques non présentés comme diagnostics certains. Modèle électrique simplifié encore à approfondir.
- A06 : infrastructure d’investigation et **pilote sur association de lampes (5e)**. Prévision conservée et verrouillée avant manipulation ; observations, comparaison et bilan saisis avant révélation de la synthèse ; parcours Révision explicite ; données conservées sur l’appareil. Le dépôt d’un texte ne valide pas automatiquement sa justesse. État initial du lot 1 ; voir extension du lot 2 ci-dessous.
- A07 : conservation du correctif de reprise proposé dans la PR initiale, désormais testé.
- A08, A22–A23 : pause des boucles derrière les fenêtres, annotation activable/désactivable, focus d’entrée/restauration, confinement Tab et fermeture Échap.
- A09 : fiche élève sans réponses ni synthèse préremplie ; trace d’investigation imprimable ; corrigé par choix explicite. Ce choix n’est pas un contrôle d’accès sécurisé.
- A10 : tensions nominales et tension du générateur explicites dans le QCM des trois lampes.
- A11 : hypothèses pression constante/volume variable et récipient rigide distinguées dans consigne, bilan et question sur l’aérosol ; les autres formulations de la narration restent à relire.
- A13 : condition de travail mécanique non nul rectifiée ; profondeur mathématique MENA à confirmer.
- A15 : transparence/translucidité distinguées par image nette et diffusion ; lumière transmise partiellement ne suffit plus à définir translucide.
- A19 : 100 points par réussite, sans bonus de vitesse ; chronomètre optionnel désactivé par défaut ; expert ne réduit plus le temps.
- A20 : toutes les équipes jouent toutes les missions, sans omission. Activité explicitement collective : entendre la réponse d’une équipe précédente interdit d’en faire une évaluation individuelle comparable.
- A24–A25 : disposition Studio étroite sans réduction globale ; commandes lisibles, outils de zoom hors de la scène sur mobile ; navigation des onglets au clavier ; pause accessible dans les réglages ; préférence de réduction des mouvements prise en compte. Les petits textes internes aux SVG nécessitent encore le zoom. Contraste et accessibilité de chaque geste ne sont pas intégralement certifiés.
- A26 : au moins une vue non modale conservée ; accès au quiz respecte les étapes activées ; parcours pilote protégé des révélations prématurées hors Révision.
- A27 : cache v36 ; purge limitée au préfixe de l’application ; navigation en erreur HTTP non mise en cache. Le cycle hors ligne complet reste à tester.
- A28 : année du référentiel actualisée. Reclassement transversal et couverture par compétences restent ouverts.

## Validation réalisée

- 49 assertions DOM avec jsdom, dont initialisation/manipulation de base des 29 leçons Studio, pH, prévision obligatoire, persistance, impression, focus, Échap, annotation, pause et reprise du défi.
- Chargement des **55 modules** dans Chromium 153, sans erreur JavaScript observée. Ce contrôle d’ouverture ne teste pas toutes les missions ni toutes les manipulations.
- Parcours pilote effectué dans Chromium ; vérification du déverrouillage du bilan après confrontation.
- Largeurs 360, 390, 768 et 1280 px : aucun débordement horizontal du document dans le parcours pilote ; vues mobile et ordinateur inspectées visuellement.
- Fiche élève A4 générée dans Chromium ; contenu sans corrigé ni synthèse préremplie, avec les réponses de l’élève ; rendu inspecté. Marges de page et protection contre la coupure des blocs ajoutées.
- Syntaxe des fichiers JavaScript examinée ; aucune erreur relevée.

Les scénarios reproductibles sont dans `scripts/regression.cjs` : Node >=22.13, puis `npm ci` et `npm test`. Les dépendances sont uniquement destinées aux tests ; le site reste statique et sans compilation.

## Restant à traiter

1. Étendre le parcours d’investigation avec des situations-problèmes spécifiques à chaque leçon ; ajouter des critères d’évaluation et une remédiation contextualisée (A06/A21).
2. Reprendre masse volumique/flottaison à égalité, résistance interne en court-circuit, effet de serre et validité expérimentale, puissance active et contextualisation des tarifs (A12/A14/A16/A17/A18).
3. Approfondir les modèles et narrations des risques électriques, de l’eau et des gaz sans transformer des hypothèses simplifiées en lois universelles.
4. Vérifier le programme détaillé MENA au-delà des titres de progression : couverture partielle de 6e, synthèse de l’eau et sous-objectifs de 3e ; classement par référentiel ; README (A28).
5. Recette exhaustive clavier/tactile, lecteur d’écran, contraste, voix/sous-titres, zoom 200 %, toutes les missions, corrigés PDF longs et hors ligne/mise à jour (A23–A27).
6. Consulter les pages du manuel Educadhoc sous une forme lisible avant de lui attribuer des activités. Aucun contenu de ce lot n’est présenté comme extrait du manuel.

## Références de conception

- NASA : https://science.nasa.gov/moon/moon-phases/
- OMS : https://www.who.int/en/news-room/fact-sheets/detail/drinking-water
- INRS : https://www.inrs.fr/risques/electriques/accidents-origine-electrique
- W3C APG : https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/

Ces références cadrent les corrections ; elles ne certifient pas les simulations ni une conformité réglementaire ivoirienne.

## Lot 2 — 19 octobre 2026

- A06 : quatre nouvelles investigations : circuit électrique (6e), mélanges et dilatation des liquides (5e), phases et éclipses (4e). Total : 5 leçons sur 29. Consignes spécifiques avec paramètres à garder constants, prévision conservée, observations et confrontation avant synthèse. Le pilote lampes dispose aussi de son protocole ciblé. Les textes déposés ne constituent pas une validation de compétence.
- A12 : modèle linéaire qualitatif explicitement borné à 10–60 °C, commandes, défis et trajectoires du résumé inclus. Exception de l’eau entre 0 et 4 °C et changements d’état exclus explicitement. Comparaison à volume initial et variation de température identiques ; suppression de la généralisation liquides/solides. Affichage signé du refroidissement corrigé. Les coefficients restent illustratifs : aucune précision métrologique n’est revendiquée.
- Navigation : les flèches du clavier ignorent les onglets désactivés avant la prévision.
- Cache porté à v37.
- Validation : 71 assertions jsdom réussies, syntaxe JavaScript et ouverture des 29 leçons. Dix parcours dans Chromium (5 investigations × 390/1280 px), sans erreur JavaScript ni débordement horizontal du document, avec accès au bilan après confrontation.
- Référence scientifique du domaine : https://www.usgs.gov/water-science-school/science/water-density . Cette source décrit notamment le comportement particulier de l’eau autour de 4 °C ; elle ne valide pas les coefficients illustratifs du modèle.

Les autres modèles scientifiques ouverts, la couverture détaillée MENA et la recette exhaustive restent à traiter. Aucun contenu Educadhoc n’a été utilisé sans lecture vérifiée.
