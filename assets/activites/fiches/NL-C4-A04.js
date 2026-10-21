/* NL-C4-A04 — Le sachet disparu · 5e · Dissolution · modèle v1.0
   Source : Dossier complet 4 thèmes (21/10/2026), fiche A04 ; matrice de migration, pilote A04.
   Socle : simulation solubilite, leçons masse et melanges (non modifiées). */
(function () {
  var TARE = 45, EAU = 100; // flacon + bouchon + coupelle ; eau (g)
  function essai(sucre) { // modèle : système fermé, dissolution complète pour 1–10 g de sucre dans 100 g d'eau
    var m = TARE + EAU + sucre;
    return { sucre: sucre, avant: m, apres: m };
  }
  window.FICHE_A04 = {
    id: 'NL-C4-A04', version: '1.0', modele: 'masse-systeme-ferme-1.0',
    titre: 'Le sachet disparu', niveau: '5e', chapitre: 'Dissolution',
    objectif: 'Établir la conservation de la masse pendant une dissolution en système fermé.',
    objectifEleve: 'Savoir si la masse change quand le sucre se dissout dans l’eau, et le prouver avec des mesures.',
    materiel: 'Un flacon fermé avec une coupelle intérieure de sucre, 100 g d’eau, une balance.',
    situation: 'Dans un flacon fermé, une coupelle intérieure libère du sucre dans l’eau. Les grains ne sont plus visibles : la masse a-t-elle diminué ?',
    prevision: { consigne: 'Indique le sens de variation attendu de la masse et justifie.',
      choix: [['diminue', 'La masse diminue'], ['identique', 'La masse reste identique'], ['augmente', 'La masse augmente']] },
    protocole: ['Peser l’ensemble fermé avant mélange.', 'Incliner puis agiter sans ouvrir le flacon.', 'Peser le même ensemble.', 'Recommencer avec une autre quantité de sucre.'],
    variable: 'Quantité de sucre (g)', maintenu: 'Flacon fermé, 100 g d’eau, même balance',
    confrontation: 'Mets les deux pesées en regard de ta prévision. Distingue dispersion et disparition.',
    retroaction: 'Quel résultat précis soutient ta conclusion ? Relis ta prévision et indique ce que tu conserves ou modifies.',
    transfert: { q: 'Une partie du liquide est renversée, puis on pèse de nouveau. La nouvelle pesée concerne-t-elle le même système ?', rep: 'non',
      expl: 'Non : le flacon a perdu de la matière, ce n’est plus le même système fermé. La masse a diminué parce que du liquide est sorti, pas parce que le sucre a disparu.' },
    critere: 'Identifier le système fermé et justifier avec les deux valeurs.',
    sucreMin: 1, sucreMax: 10, essai: essai,
    aides: [
      'Le système, c’est tout ce qui est dans le flacon fermé, flacon et coupelle compris. Rien n’entre, rien ne sort.',
      'Compare la valeur de la balance avant et après : écris les deux nombres avec leur unité, puis leur différence.',
      'Les grains ne se voient plus, mais ils sont toujours dans le flacon : ils sont dispersés dans l’eau.'
    ],
    synthese: 'Dans un système fermé, la masse totale ne change pas pendant une dissolution : le sucre est dispersé dans l’eau, il n’a pas disparu. Cela ne dit rien du volume, qui n’a pas été mesuré ici.',
    prof: {
      reference: 'Pour un flacon et sa coupelle de 45 g, 100 g d’eau et 5 g de sucre, on obtient 150 g avant et après. Avec 10 g de sucre : 155 g. On ne conclut pas à la conservation du volume.',
      attendus: ['Les deux pesées sont égales pour tout essai (1 à 10 g de sucre).', 'Le système est identifié comme fermé (flacon, coupelle, eau, sucre).', 'L’élève distingue dispersion (le sucre est toujours là) et disparition.', 'Transfert : non, le système n’est plus le même après le renversement.'],
      erreurs: ['« Le sucre a disparu, donc la masse diminue » : confusion entre ne plus voir et ne plus exister.', 'Confondre la tare (réglage de la balance) avec une perte de matière.', 'Conclure que le volume est conservé : l’activité ne le mesure pas.'],
      limites: 'Modèle idéal : dissolution complète de 1 à 10 g de sucre dans 100 g d’eau, balance sans bruit de mesure, aucune évaporation. Une réponse libre n’est pas validée automatiquement par des mots-clés.',
      differenciation: 'Aide : pictogrammes du matériel, vocabulaire explicité, tableau préparé. Approfondissement : demander un nouvel exemple ou une limite de la conclusion.'
    }
  };
})();
