# NOHOBA-Lab · instructions du projet

Site de physique-chimie pour des élèves francophones (lab.nohaba.com). Dépôt privé `BIFMNSH/physique-animations`.
Propriétaire : docteur en chimie physique, professeur de physique-chimie. Répondre en français, court et direct.

## Règles absolues
- Ne jamais déployer avec l'outil Vercel (MCP). `main` se déploie automatiquement sur Vercel : ne pas y toucher sans validation écrite du propriétaire.
- Travailler sur une branche et une PR en brouillon. Collection Côte d'Ivoire 6e : branche `feat/catalogues-france-ci-investigation`, PR n° 5.
- Une fiche reste au statut `prototype` tant que le propriétaire ne l'a pas validée. Seul le propriétaire la passe en `disponible`.
- Ne jamais pousser de secrets, clés d'API ou corrigés enseignant dans un fichier public.
- Ne pas utiliser `pkill -f` avec un motif présent dans la commande (cela tue le shell).

## Charte de contenu
- Repères locaux : F CFA, B12, 220 V, CIE, noms et situations de Côte d'Ivoire (Awa, Kofi…).
- Atomes en couleurs CPK. Zéros sans barre. Orange #C2410C avec texte blanc (boutons, aplats, logo ; contraste 5,2:1). #F97316 seulement pour les décors, jamais sous du texte.
- Une activité = une seule compétence.
- Présentation d'une fiche : Thème (gras, couleur), Chapitre, Compétence visée, puis « À la fin de cette partie, je dois être capable de ».
- Ne jamais afficher de code interne (NL-C4-…, NL-CI-…) ni « Programme du cycle 4 ». Les libellés ELE-07 etc. ne servent que dans le hub.
- Les contenus utilisent toute la largeur disponible, sur ordinateur comme sur mobile (pas de défilement horizontal de page).
- Chaque expérience affiche un montage réaliste et son schéma normalisé côte à côte. Plot et culot de la lampe sont les contacts ; le verre est isolant.
- Accessibilité : étiquettes sur les contrôles, noms accessibles sur les images (SVG `role="img"` et `aria-label`), mouvement réduit respecté.
- Sécurité : protocoles guidés par le professeur pour toute flamme ; l'élève investigue sur simulation.

## Sources et honnêteté
- Vérifier chaque fiche avec le programme MENA, le manuel JD Éditions (structure et habiletés seulement ; consignes et figures originales) et les 13 TP officiels DPFC.
- Tenir `docs/REGISTRE-ECARTS.md` à jour. Ne jamais présenter une reformulation de NohobaLab comme un texte officiel. Les numéros de page issus d'une lecture assistée sont à confirmer.

## Architecture
- Moteur des activités : `assets/activites/activite.js` (six opérations : Problématiser, Émettre une hypothèse, Expérimenter / Investiguer, Analyser et interpréter, Conclure, Communiquer ; données de l'élève dans `localStorage` « pc-act-<id> », rien n'est envoyé).
- Fiches : `assets/activites/fiches/NL-CI-6E-ELE-nn.js` (fenêtre `FICHE_CI_ELEnn`). Gabarit : `.claude/skills/nohoba-nouvelle-activite/gabarit-fiche.js`.
- Catalogue CI : `assets/catalogues/6e-ci.js` (73 entrées ; statuts `conception`, `prototype`, `disponible`).
- Atelier d'électricité partagé : `assets/shared/atelier-electrique.js` (pile, lampe, interrupteur, moteur, schéma normalisé, grains). Table d'essai de conductivité : `conductivite-circuit.js` et `conductivite-modele.js`. Commande, court-circuit, protection et panne : `commande-protection.js` (modèle qualitatif testable `NohobaCommande`, dessins montage + schéma, `bloc()` pour les contrôles).
- Pages : `activites-ci/?a=<id>` (générique), `parcours-ci/` (hub de leçon), `collections/`.
- Serveur de comptes : `server/` (Railway, api.lab.nohaba.com). Accès aux corrigés limité aux fiches `NL-C4-[A-D]nn` ; les fiches CI n'y sont pas encore.
- Tests : `cd qa && npm test` (regression, activites, catalogues-ci-fr, lot-ci-electricite, lot-ci-commande, parcours-catalogues). Ils doivent rester verts avant tout commit.

## Méthode de travail (économe)
1. Scénarios : un tableau de scénarios par lot (compétence, six opérations, manipulation, garde-fous) à valider — voir le skill `nohoba-scenarios-design`.
2. Construction du lot entier avec ses tests — skill `nohoba-nouvelle-activite`.
3. Une seule vérification visuelle par lot (captures), puis contrôle de conformité — skill `nohoba-controle-conformite`.
4. Commit, push sur la branche, mise à jour de la PR en brouillon. Fin de message : ce qui est fait, ce qui reste à décider.
- Ouvrir une nouvelle conversation par lot pour limiter la consommation.

## Commits
Messages en français, une ligne de résumé puis le détail. Ne pas ajouter de signature si le propriétaire ne le demande pas ; suivre les consignes d'attribution de la session.
