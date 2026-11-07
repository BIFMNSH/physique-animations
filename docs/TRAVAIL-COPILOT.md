# Travailler sur le dépôt avec GitHub Copilot (modèle Claude)

Guide pour reprendre le travail de la branche `essai/lecon-ampoule` (PR n° 24, brouillon) depuis son ordinateur, avec Copilot ou à plusieurs.

## 1. Récupérer le dépôt et la branche

```bash
git clone https://github.com/BIFMNSH/physique-animations.git
cd physique-animations
git fetch origin
git checkout essai/lecon-ampoule      # jamais main
git pull
```

Prérequis : Git, Node 20 ou plus, Python 3 (serveur local).

## 2. Préparer et vérifier

```bash
cd qa && npm install && npm test      # doit être entièrement vert
cd .. && python3 -m http.server 8765  # puis http://localhost:8765/livre-ci/
```

## 3. Travailler avec Copilot

- **VS Code** : installer « GitHub Copilot » et « GitHub Copilot Chat », ouvrir le dossier, choisir le mode Agent, puis le modèle Claude proposé dans le sélecteur de modèles (disponibilité selon l'abonnement et les réglages de l'organisation).
- **Consignes du projet** : donner à Copilot le fichier `CLAUDE.md` (le glisser dans la conversation, ou le référencer avec `#file:CLAUDE.md`). Il contient les règles : français, charte, branche, pas de `main`, pas de déploiement.
- **Une tâche à la fois** : par exemple « adapter le dessin du montage X dans `assets/shared/atelier-electrique.js` », puis relancer `npm test`.
- **Relire** chaque modification (`git diff`) avant de valider.

## 4. Règles à ne jamais enfreindre

- Ne pas pousser sur `main` (déploiement automatique sur Vercel) et ne pas déployer avec l'outil Vercel.
- Une fiche reste `prototype` tant que le propriétaire ne l'a pas validée.
- Aucun secret, clé d'API ou corrigé enseignant dans un fichier public.
- Tests verts avant tout commit ; incrémenter `VERSION` dans `sw.js` quand un fichier servi change.

## 5. Enregistrer et partager

```bash
git add -A
git commit -m "Résumé en français sur une ligne

Détail."
git push origin essai/lecon-ampoule
```

Pour un travail parallèle, créer une branche dérivée (`git checkout -b essai/lecon-ampoule-nom`), la pousser et ouvrir une PR en brouillon vers `essai/lecon-ampoule`, jamais vers `main`.

## 6. Où se trouvent les dessins

- Montages « banc d'essai » : `assets/shared/atelier-electrique.js` (pile, lampe, interrupteur, moteur, câbles) et `assets/shared/commande-protection.js` (boucle, commutateur, va-et-vient).
- Livre 3D : `assets/livre-ci/livre-ci.js`.
- Fiches : `assets/activites/fiches/NL-CI-6E-ELE-nn.js`.
- Écarts à valider : `docs/REGISTRE-ECARTS.md`.
