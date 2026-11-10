# Scénario : livre de 5e sans cahier (neuf moments, fiche intégrée)

Statut : **validé et construit (5 nov. 2026)**. Choix du propriétaire : la fiche remplace toute la saisie des moments 3 à 7 ; chaque fiche a son bilan (lu dans le livre quand la fiche est terminée) ; le défi s'ouvre quand toutes les fiches de la leçon sont terminées ; un petit lien « Explorer librement la simulation » garde la simulation d'origine (à l'essai, on verra à l'usage). L'état du livre se déduit des fiches (`pc-act-<id>`), rien à cocher à la main. Branche `feat/fiches-5e-investigation`. Demande du propriétaire (5 nov. 2026) : un seul parcours pour l'élève, « le livre avec les 9 moments », et **retirer le cahier** (tiroir « Mon cahier »), illisible sur téléphone.

## Constat
Aujourd'hui l'élève a deux parcours en parallèle : le cahier (9 moments, saisie à droite) et la fiche (6 opérations), deux laboratoires (simulation et fiche), l'hypothèse écrite deux fois. Sur téléphone le cahier en tiroir est trop petit.

## Principe
La fiche (moteur des six opérations, déjà lisible en plein écran sur téléphone) devient **la seule zone de saisie**. Le livre garde les neuf moments, **sans cahier** : il raconte, ouvre la fiche, affiche un récapitulatif en lecture seule des réponses de l'élève et garde le bilan scientifique et le défi. Les réponses restent dans `pc-act-<id>` (rien n'est envoyé).

| Moment | Contenu dans le livre | Où l'élève écrit | Validé quand |
|---|---|---|---|
| 1 Situation | Page « La situation » (texte, image) | Nulle part | Page lue |
| 2 Résumé animé | Bouton « Regarder le résumé » (volet) | Nulle part | Au choix (non bloquant) |
| 3 Problématiser et hypothèse | Bouton « Commencer l'investigation » : la fiche s'ouvre en volet aux opérations 1 et 2 | Fiche : prévision + « car » | Prévision enregistrée |
| 4 Manipulation | Même volet, opération 3 (atelier montage + schéma) | Fiche : essais et observations | Essais minimum atteints |
| 5 Analyse | Opération 4 | Fiche : confrontation | Confrontation enregistrée |
| 6 Conclusion | Opération 5 | Fiche : conclusion | Conclusion enregistrée |
| 7 Communiquer | Opération 6 (trace, impression A4) | Fiche | Trace ouverte |
| 8 Bilan scientifique | Page « Ce que dit l'expérience » : récapitulatif en lecture seule (hypothèse, observations, conclusion) puis bilan qui s'ouvre | Nulle part | Bilan lu et comparé (un choix : « il confirme / complète / corrige ma conclusion ») |
| 9 Défi | Défi en manches, étoiles | Nulle part | Défi terminé |

## Règles
- Le bouton « Mon cahier », le tiroir, le mode bureau à deux colonnes et la saisie du cahier disparaissent. La mise en page est identique sur ordinateur et téléphone : une page à la fois sur téléphone, double page sur grand écran.
- Plusieurs fiches pour une leçon (mélanges : 3 ; pression, atomes, dilatation solides : 2) : une liste avec coches. Le moment 8 s'ouvre quand **au moins une** fiche est terminée jusqu'à la conclusion (les autres restent faisables).
- La simulation d'origine quitte le parcours principal. Elle reste ouverte par un lien « Explorer librement » sur la page « Le laboratoire » (au choix, voir questions).
- Reprise : le livre se rouvre à la bonne page d'après l'état de la fiche et du bilan.
- Accessibilité : étiquettes sur les contrôles, mouvement réduit respecté, aucune donnée envoyée.
- Tests : adaptation de `qa/livre-5e.cjs` (moments, reprise, téléphone) ; `npm test` vert avant commit.
- Hors lot : serveur de comptes, corrigés, mode impression du cahier (remplacé par la trace A4 de la fiche).

## À valider
1. La fiche remplace toute la saisie (moments 3 à 7) : d'accord ?
2. Plusieurs fiches par leçon : une seule terminée suffit pour continuer (recommandé), ou toutes ?
3. Simulation d'origine : lien « Explorer librement » conservé, ou retirée du livre ?
