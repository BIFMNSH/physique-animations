# Habilitations des activités du cycle 4 — cadrage

Règle de la matrice de migration (§10) : *le thème principal d'une activité (A, B, C ou D) détermine son habilitation commerciale ; une ressource partagée n'exige pas un deuxième abonnement ; les droits se vérifient côté serveur pour les parcours, fichiers, exports et corrigés.*

## Ce qui est en place (serveur, testé : 17 tests)
- `pass.themes` (texte, ex. `A,C`) ; `NULL` = les quatre thèmes. Les pass existants gardent donc leur comportement.
- `GET /api/activites/:id/acces` : 200 si le pass couvre le thème de l'activité (ou pendant la période gratuite), sinon 402 avec le thème et les plans.
- `GET /api/activites/:id/corrige` : corrigé enseignant, `Cache-Control: no-store`. Réservé à un profil enseignant pendant la période gratuite, puis à un **pass enseignant** couvrant le thème. Jamais un pass élève, jamais l'accès par une classe.
- Élève dans une classe : accès aux thèmes du pass de son enseignant (union si plusieurs).
- `server/scripts/export-corriges.mjs` extrait les corrigés des fiches vers `server/private/activites/` (non déployé sur Vercel : `.vercelignore`).

## Ce qui ne l'est pas encore
1. **Le front n'appelle pas le serveur.** Les fiches (`assets/activites/fiches/*.js`) contiennent encore `prof` (référence, attendus) en clair : n'importe qui peut les lire dans le code source. Tant que ce n'est pas branché, le « mode enseignant » est une commodité, pas une protection. À faire : retirer `prof` des fiches publiques, charger le corrigé par `/api/activites/:id/corrige` après connexion.
2. **Hors ligne.** Le service worker met les fiches en cache : le corrigé servi par l'API ne doit pas y entrer (déjà `no-store`).
3. **Paiement.** `/api/pay/init` crée toujours un pass tous thèmes. Vendre « 1 thème » ou « 2 thèmes » demande un paramètre `themes` à l'initialisation et un prix.
4. **Les fiches élève** (situation, simulation) restent publiques. Si elles doivent être payantes, il faut aussi les servir par l'API.

## Décisions à prendre (les prix ci-dessous sont des hypothèses, rien n'est fixé)
| Question | Options | Recommandation |
|---|---|---|
| Que vend-on ? | Tous les thèmes ou un pack par thème | Tous les thèmes d'abord (déjà le comportement) ; packs plus tard si la demande existe |
| Qu'est-ce qui reste gratuit ? | Rien / une activité par thème / les quatre pilotes | Garder les quatre pilotes gratuits : ils servent de démonstration |
| Corrigé | Pass enseignant seulement / avec le pass élève | Pass enseignant seulement (déjà appliqué) |
| Établissement | Même règle que le pass enseignant ? | Oui : un pass établissement couvre tous les enseignants |
| Période gratuite | `FREE_UNTIL=2026-12-31` pour les activités aussi ? | Oui, pour une relecture en classe avant ouverture payante |

## Avant toute vente
Relecture scientifique des activités, droits des médias, CGV et politique de confidentialité mises à jour (traces élèves, mineurs), validation du service SMS en Côte d'Ivoire, et branchement du front (point 1).
