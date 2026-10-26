# Mes réussites · règles de délivrance

Page `reussites/`, règles dans `assets/reussites/regles.js`, PDF dans `assets/reussites/pdf.js` (générateur A4 sans dépendance), tests dans `qa/reussites.cjs`.

## Ce qui est mesuré (règles déjà présentes dans le site)
- **Activités réalisées** : pour une leçon, résumé, simulation et défi terminés (`pc-studio-prog`, valeurs strictement `true`).
- **Évaluation réussie** : quiz de sortie de la leçon réussi (80 % ou plus, règle de `assets/studio/studio.js`). Il n'existe pas d'évaluation finale unique : l'attestation ne l'annonce pas.
- **Compétence validée** : aucune règle numérique n'existe. Le niveau (I, F, S, TB) est l'avis du professeur sur la fiche papier ; il n'est pas enregistré.

## Documents
| Document | Disponible quand |
|---|---|
| Attestation de réussite | toutes les leçons en ligne de la classe ont leurs activités terminées **et** leur quiz réussi |
| Attestation de participation | toutes les activités terminées, quiz non tous réussis. Ne mentionne ni réussite ni compétences |
| Certificat de compétences | au moins une compétence validée enregistrée. **Aujourd'hui : « Validation non disponible »** |

L'éligibilité est recalculée à chaque génération (`NLReussites.document`), pas seulement en désactivant le bouton.

## Ce qui reste à configurer
- **Validation des compétences** : brancher une source, exposée par `window.NLValidations.lire()` qui renvoie `[{ competence, niveau }]` (`niveau` ∈ `I`, `F`, `S`, `TB`, facultatif). À prévoir : saisie de l'avis du professeur (table serveur liée à l'élève et à la classe, accès limité au professeur de la classe) ; décision du propriétaire sur les niveaux qui valident (aucun seuil n'est inventé : tout enregistrement fourni est affiché tel quel).
- **Identité vérifiée et identifiant de document** : non fournis. La progression est locale à l'appareil et modifiable par l'utilisateur ; les documents portent la mention « non vérifié ». Un identifiant n'est ajouté que si sa persistance serveur existe.
- **Accès** : les documents sont produits dans le navigateur à partir des données de l'appareil ; aucune route serveur n'expose le document d'un élève.
