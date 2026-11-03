# Suite : étendre le style « banc d'essai » (lot énergie et leçons de 5e)

Reprise prévue dans une **nouvelle conversation** (méthode du projet : un lot par conversation). Branche de travail : `essai/lecon-ampoule` (PR n° 24, brouillon). Ne pas toucher `main`.

## Acquis (circuits 6e CI et livre 3D)
- Fond blanc, modules sur socle noir, lampe sur support à deux douilles, symbole M du moteur sur le support (hélice seule au-dessus), pile plate en bloc avec deux languettes de laiton identiques, fiches banane verticales qui coiffent les douilles, pinces crocodiles sur la pile, câbles souples, schémas normalisés alignés sur le montage.
- Fenêtre 3D au clic ou à Entrée sur la pile, la lampe, le moteur, l'interrupteur (lampe dévissable).
- Outils dans `assets/shared/atelier-electrique.js` : `svgBanc`, `pileM`, `lampeM`, `interM`, `moteurM`, `chaine`, `cab`, `ring`, `pileLampe`, `montageSerie`.

## Reste à faire
| Lieu | Fichier | Remplacer | Contraintes |
|---|---|---|---|
| ~~Cartable 5e, cahier, leçon d'essai~~ | `assets/simple/cartable.js`, `cahier-essai.js`, `lecon-essai.js` | Fait le 3 nov. 2026 avec `A.banc5e` (boucle à une ou deux lampes, voltmètre au centre) et le test `qa/banc-5e.cjs` | Reste à valider par le propriétaire (captures bureau et téléphone faites) |
| Lot énergie | `assets/shared/energie-modele.js` (`sceneCellule`, `sceneAppareil`) | `A.lampe`, `A.pile45`, `A.moteur` | Schémas `A.schema` à garder alignés |
| Livre 3D, chapitres 0 et 1, ELE-01, ELE-02 | `livre-ci.js`, `NL-CI-6E-ELE-01.js` | `pile45`, `pileCyl`, lampe seule | Décision du propriétaire : lampe seule conservée, à reconfirmer |

## Méthode
1. Tableau de scénarios (skill `nohoba-scenarios-design`), à valider.
2. Construction avec les tests (`cd qa && npm test`, à garder verts).
3. Une vérification visuelle (captures bureau et téléphone), puis `nohoba-controle-conformite`.
4. Commit en français, push sur la branche, PR en brouillon, `docs/REGISTRE-ECARTS.md` à jour, `sw.js` incrémenté.

## Invite conseillée pour la nouvelle conversation
« Lis `docs/SUITE-STYLE-BANC.md` sur la branche `essai/lecon-ampoule`. Prépare le tableau de scénarios pour appliquer le style banc d'essai aux leçons de 5e (cartable, cahier, leçon d'essai), sans rien construire avant ma validation. »
