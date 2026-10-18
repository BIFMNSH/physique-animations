/* Progression 4e (programme MENA, Côte d'Ivoire, 2025-2026) : thèmes et leçons « studio ».
   ready: true → la leçon est en ligne (fichier assets/studio/lecons/<slug>.js). */
window.PROGRAMME = {
  '4e': [
    { nm: 'Optique', col: 'var(--blue)', on: '#0E1626', ic: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>', les: [
      { slug: 'sources-recepteurs', t: 'Sources et récepteurs de lumière', ready: true },
      { slug: 'propagation-lumiere', t: 'Propagation de la lumière', ready: true },
      { slug: 'phases-eclipses', t: 'Les phases de la Lune et les éclipses', ready: true },
      { slug: 'lumiere-blanche', t: 'Analyse et synthèse de la lumière blanche', ready: true }] },
    { nm: 'Courants et tensions alternatifs', col: 'var(--amber)', on: '#2A1A00', ic: '<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/>', les: [
      { slug: 'aimant-bobine', t: 'Aimant et bobine', ready: true },
      { slug: 'tension-alternative', t: 'Production d’une tension alternative', ready: true },
      { slug: 'tension-sinusoidale', t: 'Tension alternative sinusoïdale', ready: true },
      { slug: 'dangers-secteur', t: 'Dangers du courant du secteur', ready: true },
      { slug: 'transfo-redressement', t: 'Transformation, redressement et lissage', ready: true }] },
    { nm: 'Les ions', col: 'var(--violet)', on: '#1B1238', ic: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>', les: [
      { slug: 'atomes-ions', t: 'Atomes et ions', ready: true },
      { slug: 'metal-ion', t: 'Transformation d’un métal en ion et inversement', ready: true }] },
    { nm: 'Eau potable', col: 'var(--green)', on: '#062A18', ic: '<path d="M12 3C8 9 6 12 6 15a6 6 0 0 0 12 0c0-3-2-6-6-12z"/>', les: [
      { slug: 'traitement-eau', t: 'Traitement de l’eau', ready: true },
      { slug: 'qualite-eau', t: 'Qualité de l’eau', ready: true }] }
  ],
  '5e': [
    { nm: 'Électricité', col: 'var(--amber)', on: '#2A1A00', ic: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', les: [
      { slug: 'generateur-recepteur', t: 'Adaptation d’un générateur à un récepteur', ready: true, kit: 'elec' },
      { slug: 'association-lampes', t: 'Association de lampes électriques', ready: true, kit: 'elec' },
      { slug: 'piles-serie', t: 'Association de piles en série', ready: true, kit: 'elec' }] },
    { nm: 'Mesure de grandeurs physiques', col: 'var(--blue)', on: '#0E1626', ic: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>', les: [
      { slug: 'intensite', t: 'Intensité du courant électrique', ready: true, kit: 'elec' },
      { slug: 'tension', t: 'Tension électrique', ready: true, kit: 'elec' },
      { slug: 'pression-atmospherique', t: 'Pression atmosphérique', ready: true }] },
    { nm: 'Mélanges et réactions chimiques', col: 'var(--violet)', on: '#1B1238', ic: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>', les: [
      { slug: 'melanges', t: 'Les mélanges', ready: true },
      { slug: 'atomes-molecules', t: 'Atomes et molécules', ready: true },
      { slug: 'combustion-carbone', t: 'Combustion du carbone', ready: true, kit: 'combustion' },
      { slug: 'combustion-soufre', t: 'Combustion du soufre', ready: true, kit: 'combustion' }] },
    { nm: 'Propriétés physiques de la matière', col: 'var(--green)', on: '#062A18', ic: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>', les: [
      { slug: 'dilatation-solides', t: 'Dilatation des solides', ready: true, kit: 'thermo' },
      { slug: 'dilatation-liquides', t: 'Dilatation des liquides', ready: true, kit: 'thermo' },
      { slug: 'dilatation-gaz', t: 'Dilatation des gaz', ready: true, kit: 'thermo' }] }
  ],
  '6e': [
    { nm: 'Électricité', col: 'var(--amber)', on: '#2A1A00', ic: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', les: [
      { slug: 'circuit-electrique', t: 'Le circuit électrique', ready: true, kit: 'elec' },
      { slug: 'commande-circuit', t: 'Commande d’un circuit électrique', ready: true, kit: 'elec' },
      { slug: 'court-circuit', t: 'Court-circuit et protection des installations électriques', ready: true, kit: 'elec' }] },
    { nm: 'Propriétés physiques de la matière', col: 'var(--blue)', on: '#0E1626', ic: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>', les: [
      { slug: 'solides-liquides', t: 'Solides et liquides', ready: true, kit: 'thermo' },
      { slug: 'les-gaz', t: 'Les gaz', ready: true, kit: 'thermo' },
      { slug: 'temperature', t: 'Température d’un corps', ready: true, kit: 'thermo' },
      { slug: 'changements-etat', t: 'Les changements d’état de l’eau', ready: true, kit: 'thermo' }] },
    { nm: 'Les combustions', col: 'var(--violet)', on: '#1B1238', ic: '<path d="M12 2c3 5 6 7 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3 0-3-1-5 0-8z"/>', les: [
      { slug: 'constituants-air', t: 'Les constituants de l’air', ready: true, kit: 'combustion' },
      { slug: 'combustion-solide-liquide', t: 'Combustion d’un solide et d’un liquide dans l’air', ready: true, kit: 'combustion' },
      { slug: 'combustion-gaz', t: 'Combustion d’un gaz dans l’air', ready: true, kit: 'combustion' },
      { slug: 'dangers-combustions', t: 'Dangers des combustions', ready: true, kit: 'combustion' }] },
    { nm: 'Mesure de grandeurs physiques', col: 'var(--green)', on: '#062A18', ic: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>', les: [
      { slug: 'volume', t: 'Volume d’un liquide et d’un solide', ready: true },
      { slug: 'masse', t: 'Masse d’un solide et d’un liquide', ready: true }] }
  ],
  '3e': [
    { nm: 'Mécanique', col: 'var(--blue)', on: '#0E1626', ic: '<path d="M12 3v14"/><path d="M8 13l4 4 4-4"/><circle cx="12" cy="20" r="1.5"/>', les: [
      { slug: 'masse-poids', t: 'Masse et poids d’un corps', ready: true },
      { slug: 'les-forces', t: 'Les forces', ready: true },
      { slug: 'equilibre-deux-forces', t: 'Équilibre d’un solide soumis à deux forces', ready: true },
      { slug: 'travail-puissance', t: 'Travail et puissance mécaniques', ready: true },
      { slug: 'energie-mecanique', t: 'Énergie mécanique', ready: false }] },
    { nm: 'Les réactions chimiques', col: 'var(--violet)', on: '#1B1238', ic: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>', les: [
      { slug: 'electrolyse-eau', t: 'Électrolyse et synthèse de l’eau', ready: false },
      { slug: 'alcanes', t: 'Les alcanes', ready: false },
      { slug: 'oxydation-corps-purs', t: 'Oxydation des corps purs simples', ready: false },
      { slug: 'reduction-oxydes', t: 'Réduction des oxydes', ready: false },
      { slug: 'solutions-acides-basiques', t: 'Solutions acides, basiques et neutres', ready: false }] },
    { nm: 'Optique', col: 'var(--green)', on: '#062A18', ic: '<path d="M12 3c-3 5-3 13 0 18c3-5 3-13 0-18z"/><path d="M2 12h20"/>', les: [
      { slug: 'lentilles', t: 'Les lentilles', ready: false },
      { slug: 'defauts-oeil', t: 'Les défauts de l’œil et leurs corrections', ready: false }] },
    { nm: 'Électricité', col: 'var(--amber)', on: '#2A1A00', ic: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', les: [
      { slug: 'puissance-energie-electriques', t: 'Puissance et énergie électriques', ready: false },
      { slug: 'conducteur-ohmique', t: 'Le conducteur ohmique', ready: false }] }
  ]
};
