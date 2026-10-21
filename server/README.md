# NOHOBA-Lab · serveur des comptes

Le site (HTML) reste sur **Vercel** : `https://lab.nohaba.com`.
Ce dossier est le serveur qui gère les comptes, déployé sur **Railway** : `https://api.lab.nohaba.com`.

| Fonction | Où |
|---|---|
| Connexion Google, Facebook, X | Better Auth (`src/auth.js`) |
| Connexion par code SMS (numéros +225 et +33) | plugin téléphone + Africa's Talking (`src/sms.js`) |
| Profil élève / enseignant / établissement | `POST /api/me/profile` |
| Classes avec code (ex. `K7M-4PX`), suivi par l'enseignant | `/api/classes…` |
| Progression synchronisée | `GET/PUT /api/progress` |
| Pass payants, Mobile Money (Wave, Orange, MTN, Moov) | CinetPay (`src/pay.js`) |
| Contenu verrouillé côté serveur | `GET /api/content/<nom>` ← fichiers de `private/` |
| Effacement du compte | `DELETE /api/me` |

**Gratuité.** Tant que `FREE_UNTIL` n'est pas dépassé (31 décembre 2026), tout le monde a accès : le serveur répond `access.level = "gratuit"`. Après, il faut un pass personnel ou être dans la classe d'un enseignant qui a un pass « prof ».

## Ce qui est sûr côté serveur
- Le prix vient du serveur (`src/plans.js`), jamais du navigateur.
- Un paiement n'est accepté qu'après appel à CinetPay `/payment/check` : statut ACCEPTED, même montant, même devise, même transaction. Les notifications répétées ne créent qu'un seul pass.
- Écritures acceptées seulement depuis `lab.nohaba.com` (contrôle d'origine + cookies `Secure`).
- Limites de débit : 3 SMS par minute et par IP, 3 essais par code, 8 essais de code de classe par minute.
- L'enseignant voit prénom et étapes terminées de ses élèves, jamais leur téléphone ni leur e-mail.
- Le serveur refuse de démarrer en production sans secret de 32 caractères, ou avec `PAY_MODE=mock`.

## Tester en local
```bash
cd server && npm install
npm test            # 11 tests ; il faut un Postgres (DATABASE_URL, défaut : postgres://pgtest@127.0.0.1:5544/nl_test)
cp .env.example .env  # remplir DATABASE_URL et BETTER_AUTH_SECRET, mettre NODE_ENV=development
npm run dev
```
Hors production, sans clés SMS, le code s'affiche dans la console.

## Mise en ligne, pas à pas

### 1. Railway
1. Railway → **New Project** → **Deploy from GitHub repo** → `BIFMNSH/physique-animations`.
2. Service → **Settings → Root Directory** : `server`.
3. **+ New → Database → PostgreSQL**.
4. Service → **Variables** : colle le contenu de `.env.example`. `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` ; `BETTER_AUTH_SECRET` = résultat de `openssl rand -base64 32`.
5. **Settings → Networking → Custom Domain** : `api.lab.nohaba.com`. Railway affiche un CNAME (et parfois un TXT) à créer.
6. **Vercel → Domains → nohaba.com → DNS Records** : ajoute exactement ce que Railway indique. Attends « Active » côté Railway.
7. Contrôle : `https://api.lab.nohaba.com/health` répond `{"ok":true}`.

### 2. Google
console.cloud.google.com → APIs et services → **Écran de consentement OAuth** (externe, nom NOHOBA-Lab, liens vers `/confidentialite/` et `/mentions-legales/`) → **Identifiants → ID client OAuth → Application Web**.
URI de redirection autorisée : `https://api.lab.nohaba.com/api/auth/callback/google`.

### 3. Facebook
developers.facebook.com → **Créer une app** (type Consommateur) → **Facebook Login → Paramètres**.
URI de redirection OAuth valide : `https://api.lab.nohaba.com/api/auth/callback/facebook`. Renseigne la politique de confidentialité (`https://lab.nohaba.com/confidentialite/`) et le lien d'effacement des données (même page, section « Effacer mes données »), puis passe l'app en mode **Live**.

### 4. X
developer.x.com → projet → app → **User authentication settings** : OAuth 2.0, type **Web App** (client confidentiel).
Callback : `https://api.lab.nohaba.com/api/auth/callback/twitter`. Website : `https://lab.nohaba.com`. Pour recevoir l'e-mail, active « Request email from users » (X demande une politique de confidentialité et des conditions). Sans e-mail, le compte marche quand même (adresse de remplacement).

### 5. SMS (Africa's Talking)
Compte sur africastalking.com → **SMS** → crée une clé API. `AT_USERNAME` et `AT_API_KEY` dans Railway. Fais d'abord un test en `AT_SANDBOX=1`.
**À vérifier avant de promettre quoi que ce soit** : que la couverture Côte d'Ivoire est bien active sur ton compte, et le délai de validation d'un nom d'expéditeur (jusqu'à environ 3 semaines en Côte d'Ivoire). Sans nom validé, les SMS partent d'un numéro générique, ce qui marche mais inspire moins confiance. Si le fournisseur ne convient pas, seul `src/sms.js` change.

### 6. Paiement (CinetPay)
Compte marchand CinetPay (justificatif d'activité demandé), puis `CINETPAY_API_KEY`, `CINETPAY_SITE_ID`, `PAY_MODE=cinetpay`. L'adresse de notification est envoyée à chaque paiement : `https://api.lab.nohaba.com/api/pay/notify`. Fais un paiement test de 100 F avant d'ouvrir.

## Avant d'ouvrir au public (non technique)
- Déclaration ou autorisation **ARTCI** pour le fichier des comptes (loi 2013-450).
- **CGV** et politique de remboursement ; identité de l'éditeur dans les mentions légales.
- Mettre à jour `/confidentialite/` : comptes, téléphone, e-mail, fournisseurs de connexion, CinetPay, Africa's Talking.
- Élèves mineurs : prévoir le consentement d'un parent ou de l'établissement.

## Branchement du site (fait côté front)
- `assets/compte.js` : client du serveur (`api.lab.nohaba.com` ; en local `localhost:3000`). Il n'appelle le serveur que si le visiteur s'est déjà connecté : un visiteur anonyme ne déclenche aucune requête.
- `/connexion/` : Google, Facebook, X (boutons affichés selon `/api/providers`), code SMS (+225 mobiles 01/05/07 et +33 6/7), profil (élève ou enseignant, prénom, classe), code classe pour l'élève, création de classes pour l'enseignant, déconnexion, suppression du compte.
- `/abonnement/` : offres et prix (le paiement n'est pas ouvert : `PAY_MODE=off`).
- `vercel.json` : `connect-src` autorise `https://api.lab.nohaba.com`.
- Testé en local avec Postgres : parcours enseignant et élève complets (SMS, profil, classe, suppression), sans erreur JS, accessibilité WCAG A/AA sur mobile.
- Notes enseignant (limites du modèle, différenciation) : servies par `/api/activites/:id/corrige`, absentes des fiches publiques.
- **Reste à faire** : le paiement CinetPay (`/api/pay/init`), la synchronisation de la progression (`/api/progress`) et le formulaire de devis établissement (pas de point d'accès côté serveur).
