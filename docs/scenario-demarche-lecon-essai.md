# Scénario v2 : leçon d'essai de 5e sur le modèle des fiches de 6e

Statut : **à valider par le propriétaire, rien n'est construit.** Remplace la v1 (écrans inventés) : on reprend tel quel le modèle des fiches 6e, celui du moteur `assets/activites/activite.js` et du gabarit `gabarit-fiche.js`.

Compétence unique : mesurer une intensité en plusieurs points d'un circuit en série. Contexte : Awa, Kofi, pile de 4,5 V.

| # | Opération (moteur 6e) | Champ de la fiche | Contenu pour la leçon d'essai |
|---|---|---|---|
| 1 | Problématiser | `situation`, `objectif`, `objectifEleve`, `materiel` | « La lampe use-t-elle le courant ? » ; cadre Thème / Chapitre / Compétence / « À la fin de cette partie, je dois être capable de » |
| 2 | Émettre une hypothèse | `prevision` (4 choix, justification) | Les 4 hypothèses actuelles de `prevision()` ; verrou : pas d'essai sans hypothèse |
| 3 | Expérimenter / Investiguer | `manip` + `essaisMin` | Banc 5e (`A.banc5e`) : 1 puis 2 lampes, points A, B, C, K cliquable ; observation écrite à chaque essai ; tableau des essais |
| 4 | Analyser et interpréter | `confrontation`, `peutConfronter` | Confronter les trois mesures à l'hypothèse (déverrouillé après 3 essais utiles) |
| 5 | Conclure | `retroaction`, `synthese`, `transfert` | Synthèse « même intensité partout en série » ; question de transfert (moteur de Kofi) |
| 6 | Communiquer | trace, impression, `grilleMaitrise`, `aides`, mode professeur | Trace imprimable A4, grille MI / MF / MS / TBM, corrigé réservé au professeur |

Construction proposée :
- Nouvelle fiche `assets/activites/fiches/NL-5E-ELE-INT.js` (fenêtre `FICHE_5E_INT`), hors catalogue 6e. Les 7 questions actuelles passent dans `transfert` et `aides`.
- Une page `activites-5e/?a=<id>` calquée sur `activites-ci/` (le chargeur actuel n'accepte que les identifiants 6e).
- Le modèle `NohobaEssaiIntensite` et `banc5e` sont réutilisés ; `lecon-essai/` actuelle et le cartable restent inchangés tant que vous n'avez pas validé la bascule.
- Tests : fiche structurée (comme les lots 6e), parcours complet, reprise, aucun code interne, SVG nommés.
- Corrigés : aucun fichier public avec corrigé ; le mode professeur reste local.

À décider : (a) remplacer `lecon-essai/` par cette fiche ou garder les deux ; (b) étendre ensuite aux 13 leçons du cartable.
