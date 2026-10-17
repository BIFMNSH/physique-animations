# Physique-chimie en animations

Site statique (HTML/CSS/JS, sans étape de build) : animations pas à pas, labo virtuel, simulateur d'expériences du cycle 4 (26 expériences, dont 9 pour la 3e du programme ivoirien MENA).

- `index.html` : accueil
- `metal/`, `solutions/`, `atome/`, `ions/`, `tests/` : animations
- `labo/` : labo virtuel d'identification des ions
- `simulateur/`, `fiche/` : simulateur d'expériences et fiches élèves
- `simulateur/?niveau=3e` : 9 simulations de 3e du programme ivoirien MENA (forces, équilibre, travail, électrolyse, alcanes, combustions, réduction, lentilles, œil) dans `assets/sim/` ; `pack-3e/` redirige vers elles
- `assets/` : styles et scripts communs
- `sw.js` : cache hors-ligne (augmenter `VERSION` à chaque mise à jour)

Déploiement : Vercel, projet `physique-animations` (aucune commande de build, dossier racine).

