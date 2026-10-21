# Lot 2 — quatre activités supplémentaires (21/10/2026)

Source : Dossier complet 4 thèmes. Même moteur et même contrat de fiche que les pilotes.

| Activité | Niveau | Modèle | Valeurs de référence |
|---|---|---|---|
| NL-C4-A02 Le flacon sans étiquette | 5e | balance : affichage = masse posée − tare | 102 − 42 = 60 g ; transfert 90 − 42 = 48 g |
| NL-C4-C03 Deux commandes pour deux zones | 5e | une lampe est allumée si une boucle fermée la contient | quatre états × deux montages ; transfert : interrupteur général ouvert → lampes éteintes |
| NL-C4-D05 Deux capteurs dans le couloir | 4e | t2 = t1 + d/340 (t1 = 4,0 ms) | 3,40 m / 10,0 ms → 340 m/s ; 6,80 m / 20,0 ms ; transfert 1,70 m → 5,0 ms |
| NL-C4-C08 Le défi des consommations | 3e | E = P × t ; P = U × I (continu) | 120 Wh vs 150 Wh ; 6 W ; 1 Wh = 3600 J ; transfert 60 Wh |

## Limites assumées
- Valeurs de simulation synthétiques ; non relues scientifiquement ni testées en classe.
- C03 : modèle qualitatif, aucune comparaison d'éclat. D05 : pas d'incertitude modélisée. C08 : profils d'usage numériques non simulés (trois appareils et un récepteur continu seulement), aucun coût ni bilan carbone.
- Les corrigés (`prof`) restent dans les fiches publiques tant que le front n'appelle pas `/api/activites/:id/corrige` ; copies privées régénérées dans `server/private/activites/`.

## Contrôles
`qa/activites.cjs` : 398 assertions (modèles, diagnostics, absence de réponse dans les textes élève). Parcours navigateur et axe WCAG A/AA, clair et sombre, 390 px. Les tableaux défilants sont désormais focalisables (région nommée) sur toutes les fiches.
Service worker : `pc-v78`.

## Suite (21/10/2026) — fiche A4 et corrigé élève
- **Fiche imprimable** : aperçu fidèle à l'écran et impression partagent le même HTML/CSS ; A4, deux pages (situation, prévision avec cases à cocher, protocole, tableau, cadre quadrillé ; conclusion, transfert, auto-évaluation, avis du professeur). Boutons « Imprimer » et « Enregistrer en PDF » (même boîte d'impression du navigateur, avec consigne « Enregistrer au format PDF »). Contrôlé : 2 pages pour les 8 activités.
- **Corrigé élève** : n'apparaît qu'après la conclusion personnelle ET une réponse au transfert. Référence, points à cocher, erreurs fréquentes, zone « ce que j'avais faux / compris » ; reprise dans une rubrique « Après correction » de la fiche remplie.
- **Limite** : ce corrigé est encore chargé avec la fiche (JS public). Le verrouillage réel exige le branchement au serveur (`/api/activites/:id/corrige`), non fait. Le corrigé professeur (limites, différenciation) reste en mode enseignant.
- Service worker `pc-v79`.
