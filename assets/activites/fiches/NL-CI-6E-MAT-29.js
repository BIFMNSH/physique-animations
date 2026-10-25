/* NohobaLab · 6e Côte d'Ivoire · MAT-29 · Choisir un matériau selon ses propriétés (parcours « Matériaux, tri et déchets »). Classement seul. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().tri(panel,X,{id:'choix',titre:'Je choisis la propriété utile',intro:'Pour chaque usage, je choisis la propriété du matériau qui compte.',legende:'La propriété utile est',cats:M().PROPRIETES,
      items:M().CRITERES_METAL.map(c=>({id:c.id,label:c.txt,juste:c.juste,pourquoi:c.pourquoi,aide:'Que doit faire le matériau : transmettre la chaleur, le courant, ou être attiré ?'}))});
  }
  const itLib=i=>(M().CRITERES_METAL.filter(x=>x.id===i)[0]||{txt:i}).txt;
  window.FICHE_CI_MAT29={
    id:'NL-CI-6E-MAT-29',version:'0.9',modele:'choix-materiau-v1',
    titre:'Choisir un matériau selon ses propriétés',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Relier un usage à la propriété d’un matériau.',
    objectifsPedagogiques:['Associer chaque usage à une propriété','Justifier le choix d’un matériau','Citer trois propriétés : chaleur, courant, aimant'],
    situationEvaluation:'Un artisan choisit le matériau d’une casserole, d’un câble et d’un tri de boîtes. Pour chacun, quelle propriété compte ? Justifie.',
    objectif:'Choisir un matériau d’après sa propriété.',objectifEleve:'Savoir pourquoi on choisit un matériau.',
    situation:'Pourquoi tous les objets ne sont-ils pas faits du même matériau ? Awa associe trois usages à des propriétés.',
    materiel:'Trois situations d’usage et trois propriétés.',
    prevision:{consigne:'Avant le jeu, choisis la propriété qui compte pour le fond d’une casserole. Justifie ton hypothèse.',choix:[['chaleur','Il conduit bien la chaleur'],['electricite','Il conduit le courant électrique'],['aimant','Il est attiré par un aimant'],['couleur','Il est de couleur grise']]},
    protocole:['Lire l’usage.','Choisir la propriété utile.','Lire la justification.','Recommencer pour les trois usages.'],
    variable:'L’usage',maintenu:'Les trois propriétés proposées',
    colonnes:['Usage','Mon choix','Résultat'],lignesVides:3,
    lignes:st=>M().lignesTri(st,'choix',itLib,c=>lib(M().PROPRIETES,c)),
    resume:e=>itLib(e.item||'').toLowerCase().slice(0,40)+'… : '+lib(M().PROPRIETES,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quelle propriété pour chaque usage ? 2. Pourquoi un même métal ne convient-il pas partout ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un usage, la propriété choisie et la raison.',
    transfert:{q:'Le cuivre conduit-il le courant ?',rep:'oui',expl:'Oui, c’est pourquoi on l’utilise pour les fils électriques. Mais il n’est pas attiré par un aimant.'},
    critere:'Associer les trois usages à leur propriété et justifier.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Associe un usage.'],['MF','Associe sans justifier.'],['MS','Associe et justifie.'],['TBM','Associe, justifie et propose un autre exemple.']],
    peutConfronter:st=>M().triEtat(st,'choix',M().CRITERES_METAL.map(c=>c.id)).repondus>=3,
    aides:['Casserole : que fait le fond avec le feu ?','Câble : que doit-il transporter ?','Tri : quel outil sépare l’acier ?'],
    synthese:'On choisit un matériau pour sa propriété : conduire la chaleur (fond d’une casserole), conduire le courant (fil électrique), être attiré par un aimant (tri de l’acier).',
    prof:{reference:'Chaleur : casserole ; courant : câble ; aimant : tri de l’acier.',attendus:['Trois associations.','Justifier chaque choix.'],erreurs:['Confondre conducteur de courant et magnétique.','Choisir la couleur du matériau comme critère.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les justifications.']:['Fais un premier choix.']
  };
})();
