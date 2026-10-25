/* NohobaLab · 6e Côte d'Ivoire · MAT-32 · Le tri en centre de tri (parcours « Matériaux, tri et déchets »).
   Trois étapes, chacune utilise une propriété physique différente : aimant, tamisage, bac d'eau. Aucune couleur de poubelle imposée. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const CATS=[['aimant','Séparation magnétique'],['eau','Bac d’eau'],['aucune','Aucune de ces deux étapes']];
  const PROP=[['aimant','Elle est attirée par un aimant'],['taille','Elle passe ou non par des trous'],['eau','Elle flotte ou coule dans l’eau']];
  const MAP={aimant:'aimant',trommel:'taille',eau:'eau'};
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().tri(panel,X,{id:'etapes',titre:'Quelle propriété utilise chaque étape ?',intro:'Un centre de tri sépare les déchets en trois étapes. Je relie chaque étape à la propriété qu’elle utilise.',legende:'Elle utilise',cats:PROP,
      items:M().ETAPES_TRI.map(e=>({id:e.id,label:e.nom,juste:MAP[e.id],pourquoi:e.propriete,aide:'Que fait l’étape : attirer, tamiser ou faire flotter ?'}))});
    M().tri(panel,X,{id:'centre',titre:'Où chaque déchet est-il séparé ?',intro:'Pour chaque déchet, je choisis l’étape qui le sépare des autres.',legende:'Il est séparé par',cats:CATS,
      items:M().DECHETS_CENTRE.map(d=>({id:d.id,label:d.nom,juste:d.etape,pourquoi:{aimant:'L’acier est attiré par l’aimant.',eau:'Le plastique léger flotte dans le bac d’eau.',aucune:'Il n’est pas attiré par l’aimant et ne flotte pas : une autre étape le traite.'}[d.etape],aide:'Est-il attiré par l’aimant ? Flotte-t-il ?'}))});
  }
  const eLib=i=>(M().ETAPES_TRI.filter(x=>x.id===i)[0]||{nom:i}).nom;
  const dLib=i=>(M().DECHETS_CENTRE.filter(x=>x.id===i)[0]||{nom:i}).nom;
  window.FICHE_CI_MAT32={
    id:'NL-CI-6E-MAT-32',version:'0.9',modele:'centre-tri-v1',
    titre:'Comprendre comment un centre de tri sépare les déchets',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Relier les étapes d’un tri de déchets aux propriétés des matériaux.',
    objectifsPedagogiques:['Nommer trois étapes de tri','Relier chaque étape à une propriété','Prévoir où un déchet est séparé'],
    situationEvaluation:'Dans un centre de tri, une boîte de conserve en acier, une canette en aluminium et un bouchon en plastique passent par plusieurs étapes. Explique comment chacun est séparé.',
    objectif:'Relier un tri industriel aux propriétés des matériaux.',objectifEleve:'Savoir comment un centre de tri sépare les déchets.',
    situation:'Comment un centre de tri sépare-t-il des déchets mélangés ? Awa suit le parcours de quatre déchets.',
    materiel:'Trois étapes de tri et quatre déchets.',
    prevision:{consigne:'Avant le jeu, choisis l’outil qui sépare l’acier des autres déchets. Justifie ton hypothèse.',choix:[['aimant','Un aimant'],['eau','Un bac d’eau'],['feu','Le feu'],['tamis','Un tamis']]},
    protocole:['Relier chaque étape à sa propriété.','Choisir l’étape de chaque déchet.','Lire les explications.','Raconter le parcours.'],
    variable:'L’étape ou le déchet',maintenu:'Le centre de tri',
    colonnes:['Élément','Mon choix','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'etapes',eLib,c=>lib(PROP,c)).concat(M().lignesTri(st,'centre',dLib,c=>lib(CATS,c))),
    resume:e=>(e.tri==='centre'?dLib(e.item||''):eLib(e.item||'')).toLowerCase()+' : '+lib(e.tri==='centre'?CATS:PROP,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quelle propriété utilise chaque étape ? 2. Quels déchets sont séparés par l’aimant ? par l’eau ? 3. Pourquoi plusieurs étapes ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une étape, sa propriété et un déchet séparé.',
    transfert:{q:'Une canette en aluminium est-elle séparée par l’aimant ?',rep:'non',expl:'Non : l’aluminium n’est pas attiré. Elle suit une autre étape du centre de tri.'},
    critere:'Relier trois étapes à leurs propriétés et placer quatre déchets.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Nomme une étape.'],['MF','Nomme les étapes sans propriété.'],['MS','Relie étapes et propriétés.'],['TBM','Relie, place les déchets et explique pourquoi plusieurs étapes.']],
    peutConfronter:st=>M().triEtat(st,'etapes',M().ETAPES_TRI.map(e=>e.id)).repondus>=3&&M().triEtat(st,'centre',M().DECHETS_CENTRE.map(d=>d.id)).repondus>=4,
    aides:['Chaque étape utilise une propriété différente.','L’acier est attiré par un aimant.','Les matières légères flottent dans le bac d’eau.'],
    synthese:'Un centre de tri sépare les déchets en utilisant les propriétés des matériaux : l’aimant attire l’acier, le tambour tamise selon la taille, le bac d’eau sépare ce qui flotte de ce qui coule.',
    prof:{reference:'Aimant : acier ; tamis : taille ; bac d’eau : flotte ou coule.',attendus:['Trois associations.','Quatre déchets placés.'],erreurs:['Croire que l’aimant attire l’aluminium.','Croire qu’un seul outil suffit à tout séparer.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les explications.']:['Relie une première étape.']
  };
})();
