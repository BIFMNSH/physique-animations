/* NohobaLab · 6e Côte d'Ivoire · ENE-10 · Bilan : construire une chaîne énergétique dans une situation nouvelle. « Pour aller plus loin », hors programme officiel.
   Méthode : source, convertisseur, récepteur, milieu extérieur ; nommer chaque transfert. Deux cas nouveaux, sans repères nommés. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const ROLES=['reservoir','recue','convertisseur','utile','recepteur','dissipee','milieu'];
  const CAS=[['ventilateur','Le ventilateur solaire'],['dynamo','La lampe à dynamo']];
  function manip(panel,X){
    const h=window.Activite.h;
    const d=h('details',{class:'card',open:''},panel);h('summary',{style:'font-weight:700;cursor:pointer'},d,'La fiche méthode (4 questions)');
    const ol=h('ol',{},d);
    ['Quelle est la source ou le réservoir d’énergie, et quelle forme d’énergie en part ?','Quel appareil convertit l’énergie (le convertisseur) ?','Quelle forme d’énergie est utile, et qui la reçoit (le récepteur) ?','Quelle forme d’énergie est dissipée, et vers quel milieu extérieur va-t-elle ?'].forEach(t=>h('li',{text:t},ol));
    h('p',{class:'msg',role:'note'},d,'Sur chaque flèche, j’écris la forme d’énergie. L’énergie dissipée n’est jamais « perdue » : elle passe au milieu extérieur.');
    CAS.forEach(c=>NE().chaineTri(panel,X,{id:c[0],chaine:c[0],niveau:'libre',figTitre:c[1]+' : sa chaîne énergétique',titre:'Je construis la chaîne : '+c[1].toLowerCase(),
      intro:'Je suis la fiche méthode. Chaque case de la chaîne est à trouver dans la liste ; elle se remplit quand elle est juste. La liste contient des intrus.',titreImpression:'Chaîne énergétique : '+c[1].toLowerCase()}));
  }
  window.FICHE_CI_ENE10={
    id:'NL-CI-6E-ENE-10',version:'0.9',modele:'bilan-chaine-energetique-v1',
    titre:'Bilan : construire une chaîne énergétique',niveau:'6e',
    theme:'Énergie',chapitre:'Produire de l’énergie électrique',
    competenceVisee:'Appliquer la méthode (source, convertisseur, récepteur, milieu extérieur) à une situation nouvelle.',
    objectifsPedagogiques:['Appliquer la méthode en quatre questions','Nommer la forme d’énergie de chaque transfert','Distinguer l’énergie utile de l’énergie dissipée dans un cas nouveau'],
    situationEvaluation:'Awa utilise une lampe à dynamo : elle tourne une manivelle et la lampe s’allume. Construis sa chaîne énergétique avec la fiche méthode.',
    objectif:'Appliquer seul la méthode de la chaîne énergétique.',objectifEleve:'Savoir construire une chaîne d’énergie dans une situation nouvelle.',
    situation:'Kofi découvre deux appareils qu’il n’a jamais étudiés : un ventilateur solaire et une lampe à dynamo. Il veut dessiner, pour chacun, le chemin de l’énergie.',
    materiel:'Simulation : deux chaînes à sept cases sans nom ; une fiche méthode ; des listes de réponses avec des intrus.',
    prevision:{consigne:'Avant de construire, choisis ce que reçoit une lampe à dynamo. Justifie ton hypothèse.',choix:[['mvt','De l’énergie de mouvement (la manivelle qu’on tourne)'],['elec','De l’énergie électrique venant d’une pile'],['chim','De l’énergie chimique d’une pile cachée'],['lum','De l’énergie lumineuse du Soleil']]},
    protocole:['Lire la fiche méthode.','Construire la chaîne du ventilateur solaire.','Construire la chaîne de la lampe à dynamo.','Relire : chaque flèche porte-t-elle une forme d’énergie ?'],
    variable:'Le cas étudié',maintenu:'La méthode',
    colonnes:['Cas','Case','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>CAS.reduce((a,c)=>a.concat(M().lignesTri(st,c[0],i=>'Case '+(ROLES.indexOf(i)+1),x=>x).map(r=>[c[1],r[0],r[1],r[2]])),[]),
    resume:e=>(e.tri==='dynamo'?'dynamo':'ventilateur')+' : case '+(ROLES.indexOf(e.item)+1)+' → '+e.choix+(e.juste?'':' (à revoir)'),
    confrontation:'1. Quelle est la source de chaque appareil ? 2. Quelle forme d’énergie est utile ? 3. Qu’est-ce qui est dissipé et où va-t-il ? 4. Les deux chaînes ont-elles la même forme ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un cas, une flèche et la forme d’énergie qu’elle porte.',
    transfert:{q:'Dans la lampe à dynamo, la chaleur dissipée a-t-elle disparu ?',rep:'non',expl:'Non : elle est passée à l’air autour de la lampe. L’énergie dissipée n’est pas détruite ; elle est transférée au milieu extérieur.'},
    critere:'Construire seul les deux chaînes avec les bonnes formes d’énergie.',
    essaisMin:14,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Remplit des cases sans suivre la méthode.'],['MF','Construit une chaîne avec aide.'],['MS','Construit seul les deux chaînes.'],['TBM','Construit les deux chaînes et justifie l’énergie dissipée.']],
    peutConfronter:st=>M().triEtat(st,'ventilateur',ROLES).repondus>=7&&M().triEtat(st,'dynamo',ROLES).repondus>=7,
    aides:['Commence par la source : d’où vient l’énergie ?','Écris la forme d’énergie sur chaque flèche.','Pour la branche dissipée, cherche la chaleur et le milieu qui la reçoit.'],
    synthese:'Pour construire une chaîne : 1. la source et la forme d’énergie qui en part ; 2. le convertisseur ; 3. la forme utile et son récepteur ; 4. la forme dissipée et le milieu extérieur. Dans tous les cas, l’énergie dissipée n’est pas perdue : elle passe au milieu extérieur.',
    prof:{reference:'Ventilateur solaire : Soleil → énergie lumineuse → ventilateur solaire → énergie de mouvement vers la personne rafraîchie ; énergie thermique vers l’air. Lampe à dynamo : personne qui tourne la manivelle → énergie de mouvement → lampe à dynamo → énergie lumineuse vers la pièce ; énergie thermique vers l’air.',attendus:['Suivre la méthode en quatre questions.','Construire les deux chaînes.'],erreurs:['Écrire « énergie électrique » comme source de la lampe à dynamo.','Oublier la branche dissipée.']},
    diagnostic:st=>st.essais.length?['Indicatif : suis la fiche méthode.']:['Remplis la première case du ventilateur solaire.']
  };
})();
