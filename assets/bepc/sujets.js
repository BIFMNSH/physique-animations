/* Sujets types BEPC de physique-chimie (3e, programme MENA) — entraînement.
   Types d'items : trous (texte à compléter), vf (vrai/faux), qcm, apparier (relier), ouvert (corrigé + auto-évaluation).
   Toutes les valeurs numériques des corrigés ont été vérifiées par calcul. g = 10 N/kg. */
window.BEPC = [
{
  id: 's1', titre: 'Sujet type n° 1', themes: 'Électrolyse · Lentilles · Alcanes · Travail et puissance',
  ex: [
    { n: 1, titre: 'L’électrolyse de l’eau', partie: 'Chimie', pts: 4, items: [
      { t: 'trous', pts: 2, consigne: 'Complète le texte avec les mots qui conviennent (0,5 pt par mot).',
        texte: 'Lors de l’électrolyse de l’eau, on obtient du [[dihydrogène]] à la cathode et du [[dioxygène]] à l’anode. Le volume de dihydrogène est le [[double]] de celui du dioxygène. On ajoute un peu de [[soude]] pour rendre l’eau conductrice.',
        banque: ['dihydrogène', 'dioxygène', 'double', 'moitié', 'soude', 'sucre', 'dioxyde de carbone'] },
      { t: 'vf', pts: 2, consigne: 'Réponds par vrai ou faux (0,5 pt par affirmation).', liste: [
        ['Le dioxygène ravive une bûchette incandescente.', true],
        ['Le dihydrogène trouble l’eau de chaux.', false, 'C’est le dioxyde de carbone qui trouble l’eau de chaux. Le dihydrogène produit une légère détonation à l’approche d’une flamme.'],
        ['La synthèse de l’eau est la réaction inverse de l’électrolyse de l’eau.', true],
        ['Au cours d’une réaction chimique, la masse totale des réactifs est égale à la masse totale des produits.', true]
      ]}
    ]},
    { n: 2, titre: 'Les lentilles', partie: 'Physique', pts: 4, items: [
      { t: 'qcm', pts: 4, consigne: 'Choisis la bonne réponse (1 pt par question).', liste: [
        { q: 'Une lentille à bords minces est une lentille :', o: ['convergente', 'divergente', 'plane', 'opaque'], a: 0 },
        { q: 'La vergence d’une lentille de distance focale f = 20 cm vaut :', o: ['0,05 δ', '5 δ', '20 δ', '2 δ'], a: 1, e: 'C = 1 / f avec f en mètres : C = 1 / 0,20 = 5 δ.' },
        { q: 'Un œil myope se corrige avec une lentille :', o: ['convergente', 'divergente', 'de vergence nulle', 'teintée'], a: 1 },
        { q: 'Un rayon lumineux qui passe par le centre optique d’une lentille :', o: ['passe par le foyer image', 'est réfléchi', 'n’est pas dévié', 'devient parallèle à l’axe'], a: 2 }
      ]}
    ]},
    { n: 3, titre: 'La combustion du butane', partie: 'Chimie', pts: 6, items: [
      { t: 'ouvert', pts: 6, contexte: 'Le gaz des bouteilles B12 utilisé pour la cuisine est essentiellement du butane, de formule C₄H₁₀.', questions: [
        { q: 'Donne la formule générale des alcanes.', pts: 1, r: 'CₙH₂ₙ₊₂' },
        { q: 'Montre que le butane est un alcane.', pts: 1, r: 'Pour n = 4 : 2 × 4 + 2 = 10. La formule C₄H₁₀ est bien de la forme CₙH₂ₙ₊₂.' },
        { q: 'Écris et équilibre l’équation-bilan de la combustion complète du butane.', pts: 2, r: '2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O' },
        { q: 'Quel test permet de mettre en évidence le dioxyde de carbone formé ?', pts: 1, r: 'L’eau de chaux : elle se trouble en présence de dioxyde de carbone.' },
        { q: 'Pourquoi une combustion incomplète dans une pièce fermée est-elle dangereuse ?', pts: 1, r: 'Elle produit du monoxyde de carbone (CO), un gaz toxique, inodore et invisible, qui peut être mortel.' }
      ]}
    ]},
    { n: 4, titre: 'Situation d’évaluation : le carton de livres', partie: 'Physique', pts: 6, items: [
      { t: 'ouvert', pts: 6, situation: true,
        contexte: 'Pour la fête de l’école à Bouaké, Awa monte un carton de livres de masse 12 kg du sol jusqu’à l’estrade, haute de 1,5 m, en 3 secondes. Son frère Koffi monte le même carton à la même hauteur en 6 secondes. Il affirme : « J’ai fourni plus de travail que toi, puisque j’ai mis plus de temps. » On prend g = 10 N/kg. La force exercée sur le carton est verticale et de même valeur que son poids.',
        questions: [
          { q: 'Calcule le poids P du carton.', pts: 1, r: 'P = m × g = 12 × 10 = 120 N.' },
          { q: 'Calcule le travail W de la force exercée par Awa pour monter le carton.', pts: 1.5, r: 'W = F × h = 120 × 1,5 = 180 J.' },
          { q: 'Calcule la puissance développée par Awa, puis par Koffi.', pts: 2, r: 'Awa : P = W / t = 180 / 3 = 60 W. Koffi : P = 180 / 6 = 30 W.' },
          { q: 'Koffi a-t-il raison ? Justifie ta réponse.', pts: 1.5, r: 'Non. Le travail ne dépend que de la force et de la hauteur : il vaut 180 J pour les deux. C’est la puissance qui diffère : Awa a été deux fois plus puissante, car elle a mis deux fois moins de temps.' }
      ]}
    ]}
  ]
},
{
  id: 's2', titre: 'Sujet type n° 2', themes: 'Solutions et pH · Grandeurs et unités · Loi d’Ohm · Réduction des oxydes',
  ex: [
    { n: 1, titre: 'Solutions acides, basiques et neutres', partie: 'Chimie', pts: 4, items: [
      { t: 'apparier', pts: 2, consigne: 'Relie chaque solution à sa nature (0,5 pt par liaison).', choix: ['acide', 'neutre', 'basique'], liste: [
        ['Jus de citron (pH = 2)', 'acide'], ['Eau pure (pH = 7)', 'neutre'], ['Eau de Javel (pH = 11,5)', 'basique'], ['Vinaigre (pH = 3)', 'acide']
      ]},
      { t: 'vf', pts: 2, consigne: 'Réponds par vrai ou faux (0,5 pt par affirmation).', liste: [
        ['Quand on dilue une solution acide avec de l’eau, son pH diminue.', false, 'Il augmente et se rapproche de 7.'],
        ['Une solution de pH égal à 7 est neutre.', true],
        ['Le papier pH permet de connaître approximativement le pH d’une solution.', true],
        ['Pour diluer un acide concentré, on verse l’eau dans l’acide.', false, 'On verse toujours l’acide dans l’eau, lentement, pour éviter les projections.']
      ]}
    ]},
    { n: 2, titre: 'Grandeurs et unités', partie: 'Physique', pts: 4, items: [
      { t: 'apparier', pts: 4, consigne: 'Relie chaque grandeur à son unité dans le Système international (0,5 pt par liaison).',
        choix: ['kilogramme (kg)', 'newton (N)', 'ampère (A)', 'volt (V)', 'ohm (Ω)', 'watt (W)', 'joule (J)', 'dioptrie (δ)'], liste: [
        ['Masse', 'kilogramme (kg)'], ['Poids', 'newton (N)'], ['Intensité du courant', 'ampère (A)'], ['Tension électrique', 'volt (V)'],
        ['Résistance', 'ohm (Ω)'], ['Puissance', 'watt (W)'], ['Énergie', 'joule (J)'], ['Vergence', 'dioptrie (δ)']
      ]}
    ]},
    { n: 3, titre: 'Le conducteur ohmique', partie: 'Physique', pts: 6, items: [
      { t: 'ouvert', pts: 6, contexte: 'On mesure la tension U aux bornes d’un conducteur ohmique et l’intensité I du courant qui le traverse : U = 0 V ; 2 V ; 4 V ; 6 V ; 8 V pour I = 0 mA ; 20 mA ; 40 mA ; 60 mA ; 80 mA.', questions: [
        { q: 'Énonce la loi d’Ohm.', pts: 1, r: 'La tension aux bornes d’un conducteur ohmique est proportionnelle à l’intensité du courant qui le traverse : U = R × I.' },
        { q: 'Calcule la résistance R du conducteur ohmique.', pts: 2, r: 'R = U / I = 2 / 0,020 = 100 Ω (même résultat pour chaque mesure).' },
        { q: 'Calcule l’intensité du courant quand U = 5 V.', pts: 1.5, r: 'I = U / R = 5 / 100 = 0,05 A, soit 50 mA.' },
        { q: 'Calcule la puissance reçue par le conducteur ohmique quand U = 5 V.', pts: 1.5, r: 'P = U × I = 5 × 0,05 = 0,25 W.' }
      ]}
    ]},
    { n: 4, titre: 'Situation d’évaluation : le dépôt rouge', partie: 'Chimie', pts: 6, items: [
      { t: 'ouvert', pts: 6, situation: true,
        contexte: 'Au collège, à Daloa, un groupe d’élèves chauffe fortement un mélange d’oxyde de cuivre II (CuO, poudre noire) et de carbone (poudre de charbon de bois). À la fin, il reste un dépôt rouge, et le gaz dégagé trouble l’eau de chaux. Un élève affirme : « Le carbone a été oxydé. »',
        questions: [
          { q: 'Nomme le dépôt rouge et le gaz qui trouble l’eau de chaux.', pts: 1.5, r: 'Le dépôt rouge est du cuivre (Cu). Le gaz est du dioxyde de carbone (CO₂).' },
          { q: 'Écris et équilibre l’équation-bilan de la réaction.', pts: 2, r: '2 CuO + C → 2 Cu + CO₂' },
          { q: 'Quel corps est réduit ? Quel corps est oxydé ? L’élève a-t-il raison ?', pts: 1.5, r: 'L’oxyde de cuivre est réduit : il perd son oxygène. Le carbone est oxydé : il gagne de l’oxygène. L’élève a raison.' },
          { q: 'Comment appelle-t-on cette réaction ?', pts: 1, r: 'Une oxydoréduction (réduction de l’oxyde de cuivre par le carbone).' }
      ]}
    ]}
  ]
},
{
  id: 's3', titre: 'Sujet type n° 3', themes: 'Énergie mécanique · Combustions · Défauts de l’œil · Énergie électrique',
  ex: [
    { n: 1, titre: 'L’énergie mécanique', partie: 'Physique', pts: 4, items: [
      { t: 'trous', pts: 2, consigne: 'Complète le texte avec les mots qui conviennent (0,5 pt par mot).',
        texte: 'L’énergie mécanique d’un corps est la somme de son énergie [[cinétique]] et de son énergie [[potentielle de pesanteur]]. L’énergie cinétique s’écrit Ec = ½ m × [[v²]]. En l’absence de frottements, l’énergie mécanique [[se conserve]].',
        banque: ['cinétique', 'potentielle de pesanteur', 'thermique', 'v²', 'v', 'se conserve', 'augmente'] },
      { t: 'vf', pts: 2, consigne: 'Réponds par vrai ou faux (0,5 pt par affirmation).', liste: [
        ['L’énergie s’exprime en joules (J).', true],
        ['L’énergie potentielle de pesanteur s’écrit Ep = m × g × h.', true],
        ['Quand un corps tombe en chute libre, son énergie cinétique diminue.', false, 'Elle augmente : la vitesse augmente pendant la chute.'],
        ['Si la vitesse d’une voiture double, son énergie cinétique double.', false, 'Elle est multipliée par 4, car Ec dépend du carré de la vitesse.']
      ]}
    ]},
    { n: 2, titre: 'Combustions et alcanes', partie: 'Chimie', pts: 4, items: [
      { t: 'qcm', pts: 4, consigne: 'Choisis la bonne réponse (1 pt par question).', liste: [
        { q: 'La formule du méthane est :', o: ['CH₄', 'C₂H₆', 'CO₂', 'C₄H₁₀'], a: 0 },
        { q: 'La combustion du fer dans le dioxygène produit :', o: ['de la rouille', 'de l’oxyde magnétique Fe₃O₄', 'du dioxyde de carbone', 'de l’eau'], a: 1, e: '3 Fe + 2 O₂ → Fe₃O₄' },
        { q: 'La combustion du soufre dans le dioxygène produit :', o: ['du dioxyde de soufre SO₂', 'du sulfate de cuivre', 'du dihydrogène', 'du monoxyde de carbone'], a: 0, e: 'S + O₂ → SO₂' },
        { q: 'L’alcane qui possède 3 atomes de carbone est :', o: ['le méthane', 'l’éthane', 'le propane', 'le butane'], a: 2, e: 'Propane : C₃H₈.' }
      ]}
    ]},
    { n: 3, titre: 'Les défauts de l’œil', partie: 'Physique', pts: 6, items: [
      { t: 'ouvert', pts: 6, contexte: 'Moussa est myope. Ses lunettes portent l’indication − 2,5 δ. Son grand-père, presbyte, utilise des lunettes de + 2 δ pour lire.', questions: [
        { q: 'Où se forme l’image d’un objet éloigné dans l’œil de Moussa ?', pts: 1, r: 'En avant de la rétine : l’image est floue.' },
        { q: 'Quel type de lentille corrige la myopie ?', pts: 1, r: 'Une lentille divergente.' },
        { q: 'Que signifie le signe « − » de − 2,5 δ ? Calcule la distance focale de ces lentilles.', pts: 2, r: 'Le signe « − » indique une lentille divergente. Sa distance focale vaut, en valeur absolue, f = 1 / 2,5 = 0,4 m, soit 40 cm.' },
        { q: 'Quelle est la nature des lentilles du grand-père ? Calcule leur distance focale.', pts: 2, r: 'Vergence positive : lentilles convergentes. f = 1 / 2 = 0,5 m, soit 50 cm.' }
      ]}
    ]},
    { n: 4, titre: 'Situation d’évaluation : la facture d’électricité', partie: 'Physique', pts: 6, items: [
      { t: 'ouvert', pts: 6, situation: true,
        contexte: 'Chez Aya, à Yamoussoukro, un fer à repasser (220 V – 1 000 W) fonctionne 30 minutes par jour et quatre lampes LED (220 V – 10 W chacune) restent allumées 5 heures par jour. On prend comme exemple un prix de 80 F CFA le kilowattheure. Aya pense que ce sont les lampes qui coûtent le plus cher, puisqu’elles sont plus nombreuses et allumées plus longtemps.',
        questions: [
          { q: 'Calcule l’intensité du courant qui traverse le fer à repasser en fonctionnement normal.', pts: 1.5, r: 'I = P / U = 1 000 / 220 ≈ 4,5 A.' },
          { q: 'Calcule, en kWh, l’énergie consommée chaque jour par le fer, puis par les quatre lampes.', pts: 2, r: 'Fer : E = 1 kW × 0,5 h = 0,5 kWh. Lampes : E = 4 × 0,010 kW × 5 h = 0,2 kWh.' },
          { q: 'Calcule le coût de chacun pour un mois de 30 jours.', pts: 1.5, r: 'Fer : 0,5 × 30 × 80 = 1 200 F CFA. Lampes : 0,2 × 30 × 80 = 480 F CFA.' },
          { q: 'Aya a-t-elle raison ? Justifie.', pts: 1, r: 'Non. Le fer coûte plus cher : sa puissance (1 000 W) est 25 fois plus grande que celle des quatre lampes réunies (40 W), ce qui compense sa durée d’utilisation plus courte.' }
      ]}
    ]}
  ]
}
];
