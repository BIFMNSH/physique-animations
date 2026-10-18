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
  ]
};
