# Connexion NohobaLab : recette Railway

Branche : `feat/connexion-railway`. PR en brouillon : #22. Aucun changement de `main` ni du domaine public.

## Infrastructure

- Projet Railway : `nohoba-lab` (`ec38e7fc-f8b3-4443-b3c9-880765d9c59c`).
- Environnement : `recette` (`37c6aba0-ba67-47e6-8310-b6a6b5d16957`).
- API : `nohoba-lab-api` (`6321c083-0cc6-4fac-b8c7-f52c91bb748b`), racine `/server`, suit cette branche.
- PostgreSQL : service dédié `Postgres`, avec volume persistant.
- `DATABASE_URL` référence `${{Postgres.DATABASE_URL}}` via le réseau privé Railway.
- Le secret Better Auth a été généré et enregistré uniquement dans Railway.
- Santé : https://nohoba-lab-api-recette.up.railway.app/health vérifie aussi PostgreSQL.
- Prévisualisation stable : https://physique-animations-git-feat-connexion-12d04e-bifmnshs-projects.vercel.app/connexion/

## Routage et sessions

Le navigateur appelle `/api` sur sa propre origine. `vercel.json` relaie ces requêtes vers Railway ; les cookies restent sur l’origine du site, sans dépendre de cookies tiers. `SITE_URL` et `BETTER_AUTH_URL` désignent l’alias stable de recette. Pas de `COOKIE_DOMAIN` en recette. Les retours OAuth doivent utiliser cet alias stable et nécessitent un contrôle réel avec le fournisseur choisi.

## Activation nécessaire

Aucun fournisseur n’est configuré par défaut en production. Le serveur n’affiche jamais de code SMS dans ses journaux de production.

- E-mail : configurer `RESEND_API_KEY` et `MAIL_FROM` avec un domaine expéditeur validé.
- SMS : configurer `AT_USERNAME`, `AT_API_KEY` et, si nécessaire, `AT_SENDER_ID`. Un compte sandbox n’active pas les SMS publics.
- OAuth : configurer les identifiants du fournisseur souhaité et son URL de retour.

Renseigner les secrets directement dans Railway, jamais dans GitHub ou un message. La recette reste sans connexion utilisateur réelle tant qu’aucun fournisseur n’est activé. Le paiement reste désactivé (`PAY_MODE=off`).

## Validation

`npm ci --prefix server`, puis `node --test --test-concurrency=1 server/test/*.test.js` avec un PostgreSQL de test séparé. Ne jamais pointer les tests sur une base contenant des comptes réels. `npm ci --prefix qa`, `npm run test:connexion --prefix qa`, `npm test --prefix qa`.

La CI `Connexion et PostgreSQL` fournit un PostgreSQL jetable pour les tests d’authentification, profils, classes, paiement simulé et santé. Le test DOM couvre panne, fournisseurs, inscription, renvoi SMS et correction du numéro. Les tests ne valident pas la livraison réelle d’un SMS ou d’un e-mail.

## Avant fusion

Préparer un environnement de production et remplacer la destination de recette du proxy. Configurer son origine, ses fournisseurs et ses domaines. Recetter inscription, confirmation, connexion, session après rechargement, récupération de mot de passe et déconnexion sur la prévisualisation. Le statut enseignant reste déclaratif dans le socle existant : la vérification de ce statut reste un chantier distinct avant distribution de corrigés confidentiels.

## Connexions sociales : Google, Facebook, Apple et X

Les quatre fournisseurs sont intégrés au serveur Better Auth et au formulaire. Seuls les fournisseurs disposant de leurs deux identifiants apparaissent. Les échecs et annulations reviennent au formulaire, sans création de session locale fictive.

| Fournisseur | Variables Railway | Chemin de retour |
| --- | --- | --- |
| Google | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | /api/auth/callback/google |
| Facebook | FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET | /api/auth/callback/facebook |
| Apple | APPLE_CLIENT_ID, APPLE_CLIENT_SECRET | /api/auth/callback/apple |
| X | TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET | /api/auth/callback/twitter |

Préfixer chaque chemin par l’origine stable de recette :
https://physique-animations-git-feat-connexion-12d04e-bifmnshs-projects.vercel.app

Enregistrer les applications chez les fournisseurs, renseigner ces URL de retour et stocker leurs secrets directement dans Railway. Ne jamais publier ces secrets dans GitHub. La protection Vercel de la recette doit permettre au testeur d’atteindre la page de retour ; Apple peut notamment renvoyer un POST. Recetter chaque fournisseur avec un compte autorisé avant ouverture publique.

Les tests DOM vérifient les quatre boutons, les identifiants transmis, les URL de retour, les doubles clics et la récupération après erreur. Ils ne remplacent pas une connexion OAuth réelle. L’activation reste à effectuer avec les identifiants du propriétaire.
