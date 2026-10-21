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

## Lot 3 (21/10/2026) — thème B et enrichissement des quatre activités
- **Thème B ajouté** : B01 Le voyageur assis (référentiel, 2 m / 10 / 18 / 26 m), B03 Les points du mobile (distances 1/1/1, 1/2/3, 3/2/1 m), B04 Le virage régulier (flèche tangente, valeur 1,0 m/s constante), B05 Les voisins invisibles (contact / distance, fil retiré, aimant éloigné). Douze activités disponibles sur 48.
- **A02** : plusieurs liquides de même volume (60 mL) aux masses différentes, volume lu avec la position de l'œil, diagnostic « masse ≠ volume ».
- **C03** : lampe grillée (série : tout s'éteint ; dérivation : l'autre reste allumée) et interrupteur général vérifiables, débloqués après les huit états.
- **D05** : horloge moins précise (± 0,5 ms, valeurs déterministes) ; l'erreur relative pèse davantage sur les petites distances.
- **C08** : veille permanente 5 W × 24 h = 120 Wh contre usage actif 100 W × 2 h = 200 Wh ; mention explicite qu'aucun tarif (F CFA/kWh) n'est inventé.
- Correction d'accessibilité : identifiant dupliqué `app` dans C08 (le libellé n'était pas relié au sélecteur).
- Contrôles : 428 assertions, axe WCAG A/AA clair et sombre sur les douze activités, PDF vierge de deux pages pour chacune. Service worker `pc-v80`.
- Limites : mêmes que le lot 2 (valeurs synthétiques, non relues scientifiquement ni testées en classe ; corrigés encore dans les fiches publiques).

## Lot 4 (21/10/2026) — A01, C01, D01, D02 (5e)

- **A01 Le colis à trois compartiments** : bloc / eau / air dans trois récipients, compression du volume enfermé ; table forme–occupation–compression ; transfert « tas de sable » (échelle du grain).
- **C01 La lampe à plusieurs histoires** : chaîne pile ou panneau solaire → circuit → lampe (lumière + transfert thermique) ; bilan « aucun convertisseur ne crée d'énergie ». Modèle qualitatif, sans rendement.
- **D01 L'objet dans la boîte** : lampe allumée/éteinte, carte ou source observée ; trajet orienté vers l'œil ; source primaire / objet diffusant ; transfert Lune.
- **D02 Le logo sur l'écran** : source ponctuelle, écran à 60 cm, disque de 6 cm à 20/30/40/45 cm ; ombre = 6 × 60 / d (12 cm à 30 cm, 18 cm à 20 cm) ; l'élève relève l'ombre et calcule le rapport.
- Blocs `pedagogie` repris du catalogue en conception (qui passe de 36 à 32 activités) ; 16 activités disponibles ; service worker `pc-v83`.
- Contrôles : 1006 assertions activités, 931 de régression, axe WCAG A/AA clair/sombre à 390 px, PDF vierge de deux pages, corrigés privés régénérés (16 fichiers). Une aide de D02 révélait « 30 cm » : reformulée.
- Limites : valeurs synthétiques, non relues scientifiquement ni testées en classe ; corrigés encore dans les fiches publiques tant que le front n'est pas branché au serveur.
