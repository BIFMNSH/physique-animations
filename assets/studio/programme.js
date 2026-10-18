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
      { slug: 'dilatation-liquides', t: 'Dilatation des liquides', ready: false },
      { slug: 'dilatation-gaz', t: 'Dilatation des gaz', ready: false }] }
  ]
};
