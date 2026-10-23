---
name: nohoba-nouvel-outil-web
description: Créer une page ou un petit outil web pour le site NOHOBA-Lab (HTML statique, charte, accessibilité, tests, sans déploiement direct).
---

# Nouvelle page ou outil web NOHOBA-Lab

- Site statique : une page = un dossier avec `index.html`. Pas de framework imposé ; scripts dans `assets/`. Polices locales (`assets/fonts`), aucun CDN.
- Politique de sécurité (vercel.json) : scripts, styles et images de même origine ; connexions vers api.lab.nohaba.com seulement.
- Charte : voir `CLAUDE.md`. Mobile d'abord, largeur utilisée, contrastes suffisants, clavier, `lang="fr"`.
- Données : rien n'est envoyé ; état de l'élève dans `localStorage`, toujours dans un `try/catch`.
- Ajouter la page à `sitemap.xml` si elle doit être indexée, et au hub concerné.
- Tests : étendre `qa/` (jsdom) ; une capture de contrôle.
- Livraison : branche + PR en brouillon. Jamais de déploiement par l'outil Vercel.
