/* Programme de physique-chimie du cycle 4 (BOEN n° 31 du 30 juillet 2020, annexe 3) : libellés repris du texte officiel.
   Les activités s'y réfèrent par codes : [compétence, capacité]. */
window.PROGRAMME = {
  source: 'Programme du cycle 4, physique-chimie, BOEN n° 31 du 30 juillet 2020',
  competences: {
    demarche: { nom: 'Pratiquer des démarches scientifiques', socle: '4', cap: {
      question: 'Identifier des questions de nature scientifique.',
      hypothese: 'Proposer une ou des hypothèses pour répondre à une question scientifique. Concevoir une expérience pour la ou les tester.',
      mesure: 'Mesurer des grandeurs physiques de manière directe ou indirecte.',
      interpreter: 'Interpréter des résultats expérimentaux, en tirer des conclusions et les communiquer en argumentant.',
      modele: 'Développer des modèles simples pour expliquer des faits d’observations et mettre en œuvre des démarches propres aux sciences.' } },
    concevoir: { nom: 'Concevoir, créer, réaliser', socle: '4, 5', cap: { dispositif: 'Concevoir et réaliser un dispositif de mesure ou d’observation.' } },
    outils: { nom: 'S’approprier des outils et des méthodes', socle: '2', cap: {
      planifier: 'Planifier une tâche expérimentale, organiser son espace de travail, garder des traces des étapes suivies et des résultats obtenus.' } },
    langages: { nom: 'Pratiquer des langages', socle: '1', cap: {
      lire: 'Lire et comprendre des documents scientifiques.',
      ecrire: 'Utiliser la langue française, à l’écrit comme à l’oral, en cultivant précision, richesse de vocabulaire et syntaxe pour rendre compte des observations, expériences, hypothèses et conclusions.',
      passer: 'Passer d’une forme de langage scientifique à une autre.' } },
    numerique: { nom: 'Mobiliser des outils numériques', socle: '2', cap: {
      simul: 'Utiliser des outils d’acquisition et de traitement de données, de simulations et de modèles numériques.' } },
    ethique: { nom: 'Adopter un comportement éthique et responsable', socle: '3, 5', cap: {
      securite: 'Expliquer les fondements des règles de sécurité en chimie, électricité, optique et acoustique.',
      reinvestir: 'Réinvestir ses connaissances, notamment celles sur les ressources et l’énergie, pour agir de façon responsable et respectueuse de l’environnement.' } }
  },
  themes: {
    A: { nom: 'Organisation et transformations de la matière', attendus: ['Décrire la constitution et les états de la matière', 'Décrire et expliquer des transformations chimiques', 'Décrire l’organisation de la matière dans l’Univers'] },
    B: { nom: 'Mouvement et interactions', attendus: ['Caractériser un mouvement', 'Modéliser une action exercée sur un objet par une force caractérisée par une direction, un sens et une valeur'] },
    C: { nom: 'L’énergie, ses transferts et ses conversions', attendus: ['Identifier les sources, les transferts, les conversions et les formes d’énergie', 'Utiliser la conservation de l’énergie', 'Réaliser des circuits électriques simples et exploiter les lois de l’électricité'] },
    D: { nom: 'Des signaux pour observer et communiquer', attendus: ['Caractériser différents types de signaux (lumineux, sonores, radio…)', 'Utiliser les propriétés de ces signaux'] }
  },
  niveaux: ['Maîtrise insuffisante', 'Maîtrise fragile', 'Maîtrise satisfaisante', 'Très bonne maîtrise'] // niveaux de maîtrise du socle commun
};
