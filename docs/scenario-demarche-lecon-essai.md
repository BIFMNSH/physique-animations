# Scénario : démarche à six opérations pour la leçon d'essai (5e)

Statut : **à valider par le propriétaire, rien n'est construit.** Fichiers concernés : `assets/simple/lecon-essai.js`, `qa/lecon-essai.cjs`. Branche `essai/lecon-ampoule`.

Compétence unique : mesurer une intensité en plusieurs points d'un circuit en série.

| # | Opération (6e) | Aujourd'hui dans la leçon | Proposition | Garde-fou |
|---|---|---|---|---|
| 1 | Problématiser | Absente (on commence par manipuler) | Écran court : Awa voit la lampe chauffer et se demande « La lampe use-t-elle le courant ? » ; l'élève reformule la question avec un choix de formulations | Une seule question, pas de manipulation |
| 2 | Émettre une hypothèse | `prevision()` placée en étape « Enquête » | Déplacée avant toute mesure : 4 hypothèses (mêmes options qu'aujourd'hui) | Verrou : pas de mesure sans hypothèse |
| 3 | Expérimenter / Investiguer | « Essaie » et « Regarde » | Inchangé : 1 lampe puis 2 lampes, points A, B, C, K cliquable | Simulation, valeurs annoncées comme simulées |
| 4 | Analyser et interpréter | « Enquête » | Tableau des trois mesures ; l'élève compare A, B, C et confronte à son hypothèse | Une seule compétence : l'intensité |
| 5 | Conclure | Fin des questions « Vérifie » | Conclusion à compléter par choix de phrases (série : même intensité partout) ; les 7 questions actuelles restent comme transfert | Corrigé non affiché avant réponse |
| 6 | Communiquer | Absente | Une phrase de bilan à lire à la classe + lien d'impression de la trace | Rien n'est envoyé (`localStorage` seulement) |

Effets :
- Les 4 étapes deviennent 6 ; la reprise `pc-essai-intensite` garde sa clé, avec migration de l'ancien état.
- Le cadre Thème / Chapitre / Compétence ne change pas.
- Tests à ajouter : verrou hypothèse, 6 étapes, reprise d'un ancien état.

À décider : étendre ensuite aux 13 leçons du cartable (plus long), ou s'arrêter à la leçon d'essai.
