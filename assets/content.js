/* Contenu pédagogique : quiz et fiches élèves (une seule source pour tout le site).
   Dans les fiches, [[mot]] marque un mot à compléter (souligné dans la version élève, en rouge dans le corrigé). */
window.SITE_CONTENT = {
  order: ['metal', 'solutions', 'atome', 'ions', 'tests'],

  quiz: {
    metal: [
      { q: 'Dans un fil de cuivre, qu’est-ce qui se déplace quand le courant passe ?', o: ['Les noyaux des atomes', 'Les électrons libres', 'Les atomes entiers', 'Des ions'], a: 1, e: 'Le courant dans un métal est un déplacement d’ensemble des électrons libres. Les atomes, eux, restent en place.' },
      { q: 'Sans générateur, que font les électrons libres d’une lame de cuivre ?', o: ['Ils sont immobiles', 'Ils s’agitent dans tous les sens', 'Ils avancent tous vers la borne +', 'Ils sortent du métal'], a: 1, e: 'Ils s’agitent en désordre : en moyenne ils ne vont nulle part, il n’y a donc pas de courant.' },
      { q: 'À l’extérieur du générateur, les électrons se déplacent…', o: ['de la borne + vers la borne −', 'de la borne − vers la borne +', 'dans les deux sens à la fois', 'seulement dans la lampe'], a: 1, e: 'Les électrons partent de la borne − et rejoignent la borne + du générateur.' },
      { q: 'Le sens conventionnel du courant, à l’extérieur du générateur, va…', o: ['de la borne + vers la borne −', 'de la borne − vers la borne +', 'de la lampe vers le générateur', 'il n’y a pas de sens'], a: 0, e: 'Par convention, le courant va de + vers − : c’est le sens inverse du déplacement des électrons.' },
      { q: 'Pourquoi le plastique ne conduit-il pas le courant ?', o: ['Il est trop épais', 'Il ne contient pas d’électrons libres', 'Il contient trop d’électrons libres', 'Il est toujours mouillé'], a: 1, e: 'Sans électrons libres, aucun déplacement d’ensemble n’est possible : le plastique est un isolant.' }
    ],
    solutions: [
      { q: 'L’eau déminéralisée est-elle conductrice ?', o: ['Oui, très bien', 'Non, elle ne contient que des molécules neutres', 'Oui, grâce aux électrons libres', 'Seulement si elle est chaude'], a: 1, e: 'L’eau déminéralisée ne contient (presque) que des molécules H₂O, électriquement neutres : la lampe ne s’allume pas.' },
      { q: 'Pourquoi l’eau salée conduit-elle le courant ?', o: ['Elle contient des ions', 'Elle contient du sucre', 'Elle contient des électrons libres', 'Le sel est un métal'], a: 0, e: 'L’eau salée contient des ions Na⁺ et Cl⁻, qui portent des charges électriques.' },
      { q: 'L’eau sucrée contient des molécules de sucre. Elle est…', o: ['conductrice', 'non conductrice', 'conductrice seulement à la lumière', 'explosive'], a: 1, e: 'Les molécules de sucre sont neutres, comme les molécules d’eau : pas d’ions, pas de courant.' },
      { q: 'Dans une solution, le courant électrique est dû au déplacement…', o: ['des électrons libres', 'des molécules d’eau', 'des ions', 'des atomes de métal'], a: 2, e: 'Dans une solution, ce sont les ions qui se déplacent : les cations dans un sens, les anions dans l’autre.' },
      { q: 'Vers quelle électrode se déplacent les cations (ions +) ?', o: ['Celle reliée à la borne +', 'Celle reliée à la borne −', 'Aucune, ils restent immobiles', 'Les deux à la fois'], a: 1, e: 'Les charges de signes contraires s’attirent : les cations (+) vont vers l’électrode reliée à la borne −.' }
    ],
    atome: [
      { q: 'De quoi est constitué un atome ?', o: ['D’un noyau et d’électrons', 'Uniquement d’électrons', 'D’ions et de molécules', 'D’un noyau seulement'], a: 0, e: 'Un atome possède un noyau central, autour duquel se déplacent des électrons.' },
      { q: 'Que contient le noyau d’un atome ?', o: ['Des électrons', 'Des protons et des neutrons', 'Des ions', 'Du vide uniquement'], a: 1, e: 'Le noyau contient des protons (chargés +) et des neutrons (sans charge).' },
      { q: 'L’atome de chlore possède 17 protons. Combien a-t-il d’électrons ?', o: ['18', '35', '17', '0'], a: 2, e: 'Un atome est neutre : il a autant d’électrons que de protons, donc 17.' },
      { q: 'Un atome est électriquement…', o: ['positif', 'négatif', 'neutre', 'cela dépend de sa taille'], a: 2, e: 'Les charges + du noyau compensent exactement les charges − des électrons.' },
      { q: 'Par rapport à l’atome, le noyau est…', o: ['à peu près de la même taille', 'environ 2 fois plus petit', 'environ 100 000 fois plus petit', 'plus grand'], a: 2, e: 'Le noyau est minuscule : l’atome est surtout constitué de vide.' }
    ],
    ions: [
      { q: 'Qu’est-ce qu’un ion ?', o: ['Un atome qui a gagné ou perdu des électrons', 'Un atome qui a perdu son noyau', 'Une molécule d’eau', 'Un électron libre'], a: 0, e: 'Un ion provient d’un atome (ou d’un groupe d’atomes) qui a gagné ou perdu un ou plusieurs électrons.' },
      { q: 'L’atome de chlore Cl gagne 1 électron. Il devient…', o: ['Cl⁺', 'Cl⁻', 'Cl²⁺', 'il reste Cl'], a: 1, e: 'Il a un électron de plus que de protons : il porte une charge −1. C’est l’ion chlorure Cl⁻.' },
      { q: 'L’atome de sodium Na perd 1 électron. Il devient…', o: ['Na⁻', 'Na²⁺', 'Na⁺', 'un atome de chlore'], a: 2, e: 'Il lui manque un électron : il porte une charge +1. C’est l’ion sodium Na⁺.' },
      { q: 'Quand un ion se forme, le noyau…', o: ['gagne des protons', 'perd des protons', 'ne change pas', 'disparaît'], a: 2, e: 'Seul le nombre d’électrons change ; le noyau reste identique.' },
      { q: 'Comment appelle-t-on un ion positif ?', o: ['Un anion', 'Un cation', 'Un électron', 'Un proton'], a: 1, e: 'Ion positif = cation (il a perdu des électrons). Ion négatif = anion (il en a gagné).' }
    ],
    tests: [
      { q: 'Quel détecteur utilise-t-on pour les ions cuivre II (Cu²⁺) ?', o: ['Le nitrate d’argent', 'La soude', 'L’eau', 'Le sel'], a: 1, e: 'Avec la soude, les ions Cu²⁺ donnent un précipité bleu.' },
      { q: 'Avec la soude, un précipité couleur rouille apparaît. Quel ion est présent ?', o: ['Fe²⁺', 'Zn²⁺', 'Fe³⁺', 'Cl⁻'], a: 2, e: 'Le précipité rouille est caractéristique des ions fer III, Fe³⁺.' },
      { q: 'Avec la soude, un précipité vert apparaît. Quel ion est présent ?', o: ['Fe²⁺', 'Cu²⁺', 'Fe³⁺', 'Zn²⁺'], a: 0, e: 'Le précipité vert est caractéristique des ions fer II, Fe²⁺.' },
      { q: 'Comment identifie-t-on les ions chlorure Cl⁻ ?', o: ['Avec la soude : précipité bleu', 'Avec le nitrate d’argent : précipité blanc qui noircit à la lumière', 'Avec la soude : précipité blanc', 'En goûtant la solution'], a: 1, e: 'Le nitrate d’argent donne avec Cl⁻ un précipité blanc qui noircit à la lumière. On ne goûte jamais une solution au laboratoire !' },
      { q: 'Pourquoi utilise-t-on de petites quantités de détecteur ?', o: ['Pour aller plus vite', 'Les détecteurs sont corrosifs, et quelques gouttes suffisent', 'Pour que le précipité soit invisible', 'Ce n’est pas important'], a: 1, e: 'La soude et le nitrate d’argent sont corrosifs. Quelques gouttes suffisent pour observer le précipité (et un excès de soude peut même redissoudre le précipité de zinc).' }
    ]
  },

  fiches: {
    metal: {
      title: 'Le courant électrique dans un métal',
      objectif: 'Comprendre ce qu’est le courant électrique dans un métal.',
      schema: '<svg viewBox="0 0 520 250" aria-label="Schéma : circuit avec générateur, lampe et lame de cuivre"><g fill="none" stroke="#222" stroke-width="2.5"><path d="M188 40 H60 V180 H140 M380 180 H460 V40 H346 M314 40 H212"/></g><line x1="188" y1="24" x2="188" y2="56" stroke="#222" stroke-width="7"/><line x1="212" y1="12" x2="212" y2="68" stroke="#222" stroke-width="2.5"/><text x="176" y="20" font-size="20" font-weight="700" text-anchor="middle">−</text><text x="226" y="14" font-size="20" font-weight="700" text-anchor="middle">+</text><text x="200" y="92" font-size="14" text-anchor="middle">générateur</text><circle cx="330" cy="40" r="16" fill="#fff" stroke="#222" stroke-width="2.5"/><path d="M319 29 L341 51 M341 29 L319 51" stroke="#222" stroke-width="2.5"/><text x="330" y="78" font-size="14" text-anchor="middle">lampe</text><rect x="140" y="170" width="240" height="20" fill="#E2B744" stroke="#222" stroke-width="2"/><text x="260" y="158" font-size="14" text-anchor="middle">lame de cuivre</text><g stroke="#1565C0" stroke-width="3" fill="#1565C0"><line x1="180" y1="208" x2="330" y2="208"/><path d="M340 208 L328 202 L328 214 Z"/></g><text x="260" y="228" font-size="13" fill="#1565C0" text-anchor="middle">électrons</text><g stroke="#C62828" stroke-width="3" fill="#C62828"><line x1="230" y1="60" x2="300" y2="60"/><path d="M308 60 L296 54 L296 66 Z"/></g><text x="262" y="78" font-size="12" fill="#C62828" text-anchor="middle">courant</text></svg>',
      legende: 'En bleu : déplacement des électrons. En rouge : sens conventionnel du courant.',
      retiens: [
        'Un métal comme le cuivre contient des [[électrons libres]], qui ne sont attachés à aucun atome.',
        'Sans générateur, les électrons libres s’agitent [[dans tous les sens]] : il n’y a pas de courant.',
        'Dans un circuit fermé, les électrons libres se déplacent tous [[dans le même sens]] : c’est le [[courant électrique]].',
        'À l’extérieur du générateur, les électrons vont de la borne [[−]] vers la borne [[+]].',
        'Le sens conventionnel du courant est l’inverse : de la borne [[+]] vers la borne [[−]], à l’extérieur du générateur.'
      ],
      exercices: [
        { q: 'Pourquoi une lame de cuivre seule, sans générateur, ne permet-elle pas d’allumer une lampe ?', lines: 2, a: 'Sans générateur, les électrons libres s’agitent en désordre, sans déplacement d’ensemble : il n’y a pas de courant.' },
        { q: 'Le plastique ne contient pas d’électrons libres. Est-il conducteur ou isolant ? Justifie.', lines: 2, a: 'C’est un isolant : sans électrons libres, aucun déplacement d’ensemble de charges n’est possible.' },
        { q: 'Sur un schéma de circuit, comment représente-t-on le sens conventionnel du courant ?', lines: 2, a: 'Par une flèche sur un fil, orientée de la borne + vers la borne − à l’extérieur du générateur.' }
      ]
    },
    solutions: {
      title: 'Le courant électrique dans les solutions',
      objectif: 'Expliquer pourquoi certaines solutions conduisent le courant électrique.',
      schema: '<svg viewBox="0 0 520 260" aria-label="Schéma : générateur, lampe, ampèremètre et bécher avec deux électrodes"><g fill="none" stroke="#222" stroke-width="2.5"><path d="M88 40 H40 V100 H190 V112 M132 40 H244 M276 40 H384 M426 40 H480 V100 H330 V112"/><path d="M160 128 V236 Q160 246 170 246 H350 Q360 246 360 236 V128"/></g><rect x="162" y="160" width="196" height="84" fill="#BBDEFB"/><rect x="185" y="112" width="10" height="110" fill="#9E9E9E" stroke="#222"/><rect x="325" y="112" width="10" height="110" fill="#9E9E9E" stroke="#222"/><circle cx="110" cy="40" r="20" fill="#fff" stroke="#222" stroke-width="2.5"/><text x="110" y="46" font-size="17" font-weight="700" text-anchor="middle">G</text><text x="80" y="24" font-size="17" font-weight="700">+</text><text x="134" y="24" font-size="19" font-weight="700">−</text><circle cx="260" cy="40" r="16" fill="#fff" stroke="#222" stroke-width="2.5"/><path d="M249 29 L271 51 M271 29 L249 51" stroke="#222" stroke-width="2.5"/><circle cx="405" cy="40" r="20" fill="#fff" stroke="#222" stroke-width="2.5"/><text x="405" y="46" font-size="17" font-weight="700" text-anchor="middle">A</text><g font-size="13" font-weight="700" text-anchor="middle"><circle cx="230" cy="185" r="11" fill="#7E57C2"/><text x="230" y="190" fill="#fff">+</text><circle cx="255" cy="218" r="11" fill="#7E57C2"/><text x="255" y="223" fill="#fff">+</text><circle cx="295" cy="182" r="12" fill="#2E7D32"/><text x="295" y="187" fill="#fff">−</text><circle cx="285" cy="222" r="12" fill="#2E7D32"/><text x="285" y="227" fill="#fff">−</text></g><g stroke="#5E35B1" stroke-width="2.5" fill="#5E35B1"><line x1="370" y1="190" x2="440" y2="190"/><path d="M448 190 L438 185 L438 195 Z"/></g><text x="378" y="182" font-size="12" fill="#5E35B1">cations (+)</text><g stroke="#2E7D32" stroke-width="2.5" fill="#2E7D32"><line x1="440" y1="225" x2="372" y2="225"/><path d="M364 225 L374 220 L374 230 Z"/></g><text x="378" y="245" font-size="12" fill="#2E7D32">anions (−)</text><text x="190" y="104" font-size="11" text-anchor="end">reliée à +</text><text x="340" y="104" font-size="11">reliée à −</text></svg>',
      legende: 'Les cations vont vers l’électrode reliée à la borne −, les anions vers celle reliée à la borne +.',
      retiens: [
        'L’eau déminéralisée et l’eau sucrée ne contiennent que des [[molécules]], électriquement neutres : elles sont [[non conductrices]].',
        'L’eau salée et la solution de sulfate de cuivre contiennent des [[ions]] : elles sont [[conductrices]].',
        'Un ion porte une [[charge électrique]], indiquée en exposant dans sa formule : Na⁺, Cl⁻, Cu²⁺, SO₄²⁻.',
        'Dans une solution, le courant est dû au déplacement des ions : les [[cations]] (ions +) vont vers l’électrode reliée à la borne −, les [[anions]] (ions −) vers celle reliée à la borne +.',
        'Plus une solution contient d’ions, mieux elle conduit : l’eau du robinet est [[faiblement conductrice]].'
      ],
      exercices: [
        { q: 'Classe ces liquides en conducteurs et non conducteurs : eau sucrée, eau salée, eau déminéralisée, solution de sulfate de cuivre.', lines: 2, a: 'Conducteurs : eau salée, solution de sulfate de cuivre. Non conducteurs : eau sucrée, eau déminéralisée.' },
        { q: 'Dans la formule de l’ion Cu²⁺, que signifie « 2+ » ?', lines: 1, a: 'L’ion porte deux charges positives : l’atome de cuivre a perdu 2 électrons.' },
        { q: 'Pourquoi est-il dangereux d’utiliser un sèche-cheveux près d’une baignoire pleine ?', lines: 2, a: 'L’eau du bain contient des ions : elle conduit le courant. Si l’appareil tombe dans l’eau, il y a un risque d’électrocution.' }
      ]
    },
    atome: {
      title: 'L’atome et sa composition',
      objectif: 'Connaître la constitution d’un atome et sa neutralité électrique.',
      schema: '<svg viewBox="0 0 520 240" aria-label="Schéma d’un atome : noyau avec protons et neutrons, électrons autour"><circle cx="150" cy="120" r="100" fill="none" stroke="#558B2F" stroke-width="2" stroke-dasharray="6 6"/><circle cx="150" cy="120" r="30" fill="#827717" opacity=".25" stroke="#222" stroke-width="2"/><g stroke="#222" stroke-width="1"><circle cx="140" cy="110" r="8" fill="#E53935"/><circle cx="158" cy="108" r="8" fill="#9E9E9E"/><circle cx="148" cy="126" r="8" fill="#9E9E9E"/><circle cx="164" cy="124" r="8" fill="#E53935"/><circle cx="134" cy="128" r="8" fill="#E53935"/><circle cx="152" cy="140" r="7" fill="#9E9E9E"/></g><g fill="#26A69A" stroke="#222" stroke-width="1"><circle cx="150" cy="22" r="8"/><circle cx="236" cy="70" r="8"/><circle cx="236" cy="170" r="8"/><circle cx="150" cy="218" r="8"/><circle cx="64" cy="170" r="8"/><circle cx="64" cy="70" r="8"/></g><g stroke="#222" stroke-width="1.5"><line x1="180" y1="120" x2="330" y2="120"/><line x1="172" y1="124" x2="330" y2="158"/><line x1="166" y1="108" x2="330" y2="84"/><line x1="244" y1="70" x2="330" y2="44"/></g><g font-size="15"><text x="338" y="49">électron (charge −)</text><text x="338" y="89">neutron (sans charge)</text><text x="338" y="125">noyau</text><text x="338" y="163">proton (charge +)</text></g></svg>',
      legende: 'Modèle simplifié, dessin pas à l’échelle.',
      retiens: [
        'Un atome est constitué d’un [[noyau]] et d’[[électrons]] en mouvement autour du noyau.',
        'Le noyau contient des [[protons]], chargés positivement, et des [[neutrons]], sans charge.',
        'Chaque électron porte une charge [[négative]].',
        'Un atome contient autant de protons que d’électrons : il est électriquement [[neutre]].',
        'Le noyau est environ [[100 000]] fois plus petit que l’atome : l’atome est surtout constitué de vide.'
      ],
      exercices: [
        { q: 'L’atome de sodium possède 11 protons. Combien a-t-il d’électrons ? Justifie.', lines: 2, a: '11 électrons, car un atome est électriquement neutre : autant de charges − que de charges +.' },
        { q: 'Complète le bilan des charges de l’atome de chlore (17 protons) : 17 − ..... = .....', lines: 1, a: '17 − 17 = 0 : l’atome de chlore est neutre.' },
        { q: 'Si un atome avait la taille d’un stade de football, quelle serait environ la taille de son noyau : une bille, un ballon ou une voiture ?', lines: 1, a: 'Une bille au centre du stade : le noyau est environ 100 000 fois plus petit que l’atome.' }
      ]
    },
    ions: {
      title: 'La formation des ions',
      objectif: 'Savoir comment un atome devient un ion positif ou négatif.',
      schema: '<svg viewBox="0 0 520 250" aria-label="Formation des ions chlorure et sodium"><g font-size="14" text-anchor="middle"><circle cx="80" cy="60" r="38" fill="#fff" stroke="#558B2F" stroke-width="2" stroke-dasharray="5 5"/><circle cx="80" cy="60" r="14" fill="#827717" opacity=".3" stroke="#222"/><text x="80" y="65" font-weight="700">17+</text><text x="80" y="118">atome Cl</text><text x="80" y="136" font-size="12">17 p · 17 e⁻ · neutre</text><circle cx="400" cy="60" r="38" fill="#fff" stroke="#558B2F" stroke-width="2" stroke-dasharray="5 5"/><circle cx="400" cy="60" r="14" fill="#827717" opacity=".3" stroke="#222"/><text x="400" y="65" font-weight="700">17+</text><text x="400" y="118">ion Cl⁻</text><text x="400" y="136" font-size="12">17 p · 18 e⁻ · charge −1</text><text x="240" y="44" fill="#1565C0" font-weight="700">+ 1 électron</text><circle cx="80" cy="185" r="38" fill="#fff" stroke="#558B2F" stroke-width="2" stroke-dasharray="5 5"/><circle cx="80" cy="185" r="14" fill="#827717" opacity=".3" stroke="#222"/><text x="80" y="190" font-weight="700">11+</text><text x="80" y="240">atome Na · 11 p · 11 e⁻</text><circle cx="400" cy="185" r="38" fill="#fff" stroke="#558B2F" stroke-width="2" stroke-dasharray="5 5"/><circle cx="400" cy="185" r="14" fill="#827717" opacity=".3" stroke="#222"/><text x="400" y="190" font-weight="700">11+</text><text x="400" y="240">ion Na⁺ · 11 p · 10 e⁻</text><text x="240" y="170" fill="#C62828" font-weight="700">− 1 électron</text></g><g stroke="#222" stroke-width="2.5" fill="#222"><line x1="140" y1="60" x2="340" y2="60"/><path d="M350 60 L338 54 L338 66 Z"/><line x1="140" y1="185" x2="340" y2="185"/><path d="M350 185 L338 179 L338 191 Z"/></g></svg>',
      legende: 'Le noyau ne change pas : seul le nombre d’électrons change.',
      retiens: [
        'Un ion est un atome (ou un groupe d’atomes) qui a [[gagné]] ou [[perdu]] un ou plusieurs électrons.',
        'Un atome qui gagne des électrons devient un ion [[négatif]], appelé [[anion]] : Cl + 1 e⁻ → Cl⁻.',
        'Un atome qui perd des électrons devient un ion [[positif]], appelé [[cation]] : Na → Na⁺ + 1 e⁻.',
        'Lors de la formation d’un ion, le [[noyau]] ne change pas : seul le nombre d’électrons change.'
      ],
      exercices: [
        { q: 'L’ion chlorure Cl⁻ : combien a-t-il de protons ? d’électrons ?', lines: 1, a: '17 protons et 18 électrons.' },
        { q: 'L’ion sodium Na⁺ : combien a-t-il de protons ? d’électrons ?', lines: 1, a: '11 protons et 10 électrons.' },
        { q: 'L’ion cuivre Cu²⁺ provient d’un atome de cuivre (29 protons). L’atome a-t-il gagné ou perdu des électrons ? Combien d’électrons possède l’ion ?', lines: 2, a: 'Il a perdu 2 électrons : l’ion Cu²⁺ possède 27 électrons (et toujours 29 protons).' }
      ]
    },
    tests: {
      title: 'Identifier des ions en solution',
      objectif: 'Savoir réaliser et interpréter un test d’identification d’ions.',
      schema: '<svg viewBox="0 0 520 220" aria-label="Résultats des tests d’identification"><g font-size="13" text-anchor="middle">' +
        [['#2F8FE0', 'Cu²⁺', 'bleu', 'soude'], ['#4F6B1C', 'Fe²⁺', 'vert', 'soude'], ['#B5401A', 'Fe³⁺', 'rouille', 'soude'], ['#FFFFFF', 'Zn²⁺', 'blanc', 'soude'], ['#FFFFFF', 'Cl⁻', 'blanc qui noircit', 'nitrate d’argent']].map(function (t, i) {
          var x = 60 + i * 100;
          return '<path d="M' + (x - 16) + ' 20 V140 a16 16 0 0 0 32 0 V20" fill="none" stroke="#222" stroke-width="2"/><rect x="' + (x - 14) + '" y="96" width="28" height="56" rx="12" fill="' + t[0] + '" stroke="#999"/><text x="' + x + '" y="182" font-weight="700">' + t[1] + '</text><text x="' + x + '" y="198">' + t[2] + '</text><text x="' + x + '" y="214" font-size="11" fill="#555">' + t[3] + '</text>';
        }).join('') + '</g></svg>',
      legende: 'Couleur du précipité obtenu avec chaque détecteur.',
      retiens: [
        'Pour identifier un ion, on ajoute quelques gouttes d’un [[détecteur]] à un petit échantillon de la solution.',
        'Si l’ion est présent, il se forme un [[précipité]] dont la couleur est caractéristique.',
        'Avec la [[soude]] : précipité bleu → Cu²⁺ ; vert → Fe²⁺ ; [[rouille]] → Fe³⁺ ; blanc → Zn²⁺.',
        'Avec le [[nitrate d’argent]] : précipité blanc qui [[noircit à la lumière]] → ions chlorure Cl⁻.',
        'Sécurité : blouse, lunettes et gants ; on utilise de [[petites quantités]] de détecteur.'
      ],
      tableau: { head: ['Ion', 'Formule', 'Détecteur', 'Couleur du précipité'], rows: [['ion cuivre II', 'Cu²⁺', 'soude', 'bleu'], ['ion fer II', 'Fe²⁺', 'soude', 'vert'], ['ion fer III', 'Fe³⁺', 'soude', 'rouille'], ['ion zinc', 'Zn²⁺', 'soude', 'blanc'], ['ion chlorure', 'Cl⁻', 'nitrate d’argent', 'blanc, noircit à la lumière']], blank: [2, 3] },
      exercices: [
        { q: 'On ajoute quelques gouttes de soude à une solution inconnue : un précipité vert apparaît. Quel ion contient-elle ?', lines: 1, a: 'Des ions fer II, Fe²⁺.' },
        { q: 'Décris le test qui permet de montrer qu’une eau minérale contient des ions chlorure.', lines: 2, a: 'On verse un peu d’eau minérale dans un tube, on ajoute quelques gouttes de nitrate d’argent : un précipité blanc qui noircit à la lumière apparaît.' },
        { q: 'La solution de chlorure de fer III réagit avec les deux détecteurs. Explique pourquoi.', lines: 2, a: 'Elle contient deux ions détectables : Fe³⁺ (précipité rouille avec la soude) et Cl⁻ (précipité blanc avec le nitrate d’argent).' }
      ]
    }
  }
};
