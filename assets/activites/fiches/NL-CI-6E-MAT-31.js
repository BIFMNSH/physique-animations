/* NohobaLab · 6e Côte d'Ivoire · MAT-31 · Durée de décomposition des déchets (parcours « Matériaux, tri et déchets »).
   Ordres de grandeur, classement seul. Aucune expérience d'enfouissement : on n'enterre jamais plastique, verre ou métal dans la nature. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().tri(panel,X,{id:'duree',titre:'Combien de temps pour disparaître ?',intro:'Les durées sont des ordres de grandeur. Il n’y a aucune expérience à faire dehors : on ne laisse jamais plastique, verre ou métal dans la nature. Je classe chaque déchet.',legende:'Il met',cats:M().CLASSES_DUREE,
      items:M().DECOMPOSITION.map(d=>({id:d.id,label:d.nom,juste:d.classe,pourquoi:d.nom+' : '+d.source+'. Les déchets de plastique, de verre ou de métal restent très longtemps : on les trie au lieu de les laisser dans la nature.',aide:'Matière issue d’un végétal : quelques mois. Plastique, verre, aluminium : très longtemps.'}))});
  }
  const itLib=i=>(M().DECOMPOSITION.filter(x=>x.id===i)[0]||{nom:i}).nom;
  window.FICHE_CI_MAT31={
    id:'NL-CI-6E-MAT-31',version:'0.9',modele:'decomposition-dechets-v1',
    titre:'Comparer la durée de décomposition de déchets',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Classer des déchets selon leur durée de décomposition.',
    objectifsPedagogiques:['Distinguer les déchets qui disparaissent en quelques mois de ceux qui restent des siècles','Citer un déchet de chaque classe','Dire pourquoi on ne laisse pas de déchets dans la nature'],
    situationEvaluation:'Awa jette une épluchure et une bouteille en plastique sur un terrain. Que restera-t-il dans un an ? dans cent ans ? Pourquoi trier les déchets ?',
    objectif:'Comparer des durées de décomposition.',objectifEleve:'Savoir quels déchets restent longtemps dans la nature.',
    situation:'Que deviennent les déchets abandonnés ? Kofi classe sept déchets selon le temps qu’ils mettent à disparaître.',
    materiel:'Sept déchets et trois classes de durée (ordres de grandeur).',
    prevision:{consigne:'Avant le jeu, choisis le déchet qui met le plus de temps à disparaître. Justifie ton hypothèse.',choix:[['bouteille','La bouteille en plastique'],['journal','Le vieux journal'],['mouchoir','Le mouchoir en papier'],['pomme','Le trognon de fruit']]},
    protocole:['Lire le déchet.','Choisir la durée.','Lire l’explication.','Classer les sept déchets.'],
    variable:'Le déchet',maintenu:'Les trois classes de durée',
    colonnes:['Déchet','Mon choix','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'duree',itLib,c=>lib(M().CLASSES_DUREE,c)),
    resume:e=>itLib(e.item||'').toLowerCase()+' : '+lib(M().CLASSES_DUREE,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quels déchets disparaissent en quelques mois ? 2. Lesquels restent très longtemps ? 3. Que faire de ces derniers ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un déchet de chaque classe.',
    transfert:{q:'Une bouteille en plastique abandonnée dans la nature disparaît-elle en quelques mois ?',rep:'non',expl:'Non : elle reste des siècles. On la met dans la collecte prévue, jamais dans la nature.'},
    critere:'Classer les déchets et citer un exemple de chaque classe.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Classe moins de trois déchets.'],['MF','Classe sans expliquer.'],['MS','Classe tous les déchets.'],['TBM','Classe, explique et relie au tri.']],
    peutConfronter:st=>M().triEtat(st,'duree',M().DECOMPOSITION.map(d=>d.id)).repondus>=7,
    aides:['Les déchets d’origine végétale disparaissent vite.','Plastique, verre et aluminium durent très longtemps.','Les durées sont des ordres de grandeur.'],
    synthese:'Papier et restes de fruit disparaissent en quelques mois ; le bois en quelques années ; le plastique, le verre et l’aluminium restent des siècles. On ne les laisse donc pas dans la nature : on les trie.',
    prof:{reference:'Mois : mouchoir, fruit, journal ; années : bois ; siècles : canette, bouteille, verre. Ordres de grandeur.',attendus:['Classer les sept déchets.','Citer un exemple par classe.'],erreurs:['Proposer d’enterrer plastique, verre ou métal.','Prendre les durées pour exactes.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les explications.']:['Classe un premier déchet.']
  };
})();
