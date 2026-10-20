# Corrections de l’audit du 20 octobre 2026

Base : `ceb2e6c5cb6bdda5e886c790659dda92d9cb8866`. Les ajouts récents du serveur Railway sont conservés. L’ancienne PR nº 1 n’est pas fusionnée.

## Changements

- A01 : redirection canonique limitée aux requêtes HTML ; ressources et service worker accessibles sur leur origine ; cache des réponses redirigées exclu ; navigation redirigée propagée par le worker. Validation sur Vercel encore requise.
- A02/A07 : 53 situations-problèmes et moteur commun de prévision, manipulation, confrontation et bilan ; trace locale persistante, critères de réussite, parcours Révision ; fiche élève sans conclusions fournies d’emblée. La justesse des réponses ouvertes n’est pas validée automatiquement.
- A03 : indicateurs et tableau du traitement de l’eau ne certifient plus une potabilité ; reformulation du défi sur la limpidité.
- A04 : quiz sur les facteurs de danger, indicateur corporel sans catégorie « aucun danger », reformulation du défi de protection. Les valeurs numériques restent un modèle indicatif, pas des seuils universels de sécurité.
- A05 : intensité instantanée nulle à l’arrêt dans la simulation puissance/énergie ; hypothèse résistive explicitée dans Studio ; distinction coût variable/facture.
- A06 : chronomètre optionnel, désactivé par défaut ; pas de pénalité temporelle après un essai ; score indépendant de la vitesse et des indices.
- A08 : interface portrait responsive sans réduction globale ; panneaux et commandes à taille lisible ; outils de zoom conservés pour le schéma.
- A09 : texte foncé sur les boutons orange de l’accueil.
- A10 : domaine thermique 10–60 °C cohérent entre commandes et animation ; clarification de la flottabilité de la glace.
- A11 : documentation et référence annuelle actualisées. La matrice détaillée des habiletés MENA reste à valider ; aucun label de conformité exhaustive n’est ajouté.
- A12 : suite de régression front-end et workflow CI. Les modèles des deux moteurs ne sont pas encore entièrement mutualisés.

## Vérification

- Parcours DOM des 53 leçons : prévision vide refusée, prévision enregistrée, commandes accessibles, bornes des curseurs, SVG sans NaN/Infinity, confrontation, bilan et fiche élève.
- Métadonnées des 79 modules et 395 questions ; syntaxe des scripts.
- Défi sans chronomètre : absence d’expiration après 80 secondes simulées.
- Persistance de la prévision après rechargement.
- Navigateur Chromium local, association de lampes à 390 et 1280 pixels : aucune erreur JavaScript ni débordement horizontal ; aucune violation axe WCAG 2 A/AA sur l’état de confrontation testé. Contrôles visibles mesurés entre 36 et 44 pixels de haut. Polices distantes et service worker de production non reproduits dans cet essai local.

Ces contrôles ne remplacent pas la revue scientifique complète des 395 questions, les tests de toutes les scènes sur appareils réels ni la validation des routes Vercel après déploiement. Les comptes, paiements, SMS et données du serveur ne sont pas concernés par ces modifications.

## Références de contrôle

- Risque électrique : https://www.inrs.fr/risques/electriques/accidents-origine-electrique.html (facteurs intensité, durée, trajet, conditions de contact).
- Redirections conditionnelles : https://vercel.com/docs/project-configuration/vercel-json (champ `has`).
- Programme : progression MENA/DPFC 2026–2027 fournie par le porteur de projet ; revue détaillée des habiletés à poursuivre.
