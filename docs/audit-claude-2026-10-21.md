# Audit indépendant – NOHOBA-Lab (21/10/2026)

Objet : confirmer ou infirmer l'audit ChatGPT (A01–A28) sur l'état actuel de `main` (après fusion de la PR #2).

Méthode : extraction de la config des 79 modules (395 questions), tests Playwright d'exécution, jsdom (qa/, 931 assertions), axe WCAG A/AA sous la CSP réelle, contrôles d'intégrité (liens, sitemap, SW CORE), recherche de secrets, `npm audit`, vérification arithmétique des explications.

## Verdict sur l'audit ChatGPT
| Verdict | Constats |
|---|---|
| Confirmé et corrigé | A01, A02, A03*, A05*, A06, A07, A08, A09, A10, A11, A12, A14, A15, A16, A19, A22, A23, A24, A26, A27 (* en grande partie) |
| Confirmé, encore ouvert | A04 (valeurs gustatives OMS présentées comme normes de potabilité), A20 (formule de rotation d'équipes), A21 (explications de quiz trop courtes / simple écho de la réponse), A25 (reduced-motion non respecté par les boucles JS) |
| Partiellement ouvert | A17, A18, A28 |
| Non reproduit | A13 |

## Constats nouveaux
- **N1** – Biais de position des bonnes réponses : 63 % en B, aucune permutation des options.
- **N2** – g = 9,8 N/kg dans `masse-poids` contre 10 N/kg ailleurs.

## Contrôles OK
Liens (1 189, 0 cassé), sitemap (72 URL), SW CORE (122 entrées présentes), métadonnées, aucun secret, `npm audit` 0, arithmétique des explications 0 erreur. Axe (mode sombre) : aucune violation sur les pages testées ; exception connue : texte blanc sur orange #F97316 (2,8:1, choix de marque).

## Limites
Pas de relecture scientifique humaine des 395 questions ; CI GitHub Actions en `startup_failure` (cause non vérifiée) ; balayage axe en mode clair non terminé au moment de l'écriture.
