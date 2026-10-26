/* NohobaLab · 6e Côte d'Ivoire · MAT-25 · Expliquer le cycle de l'eau.
   Paysage de Côte d'Ivoire : mer et lagune, saison des pluies. Schéma : A évaporation, B condensation, C précipitations, D ruissellement. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const FL=[['A','La flèche A (le soleil chauffe la mer)'],['B','Le nuage B'],['C','La pluie C'],['D','La rivière D']];
  const ETAT={A:'L’eau passe de l’état liquide à l’état gazeux (vapeur d’eau, invisible).',B:'La vapeur d’eau se refroidit en altitude et redevient liquide : de fines gouttelettes forment le nuage.',C:'Les gouttelettes grossissent et tombent : l’eau est liquide.',D:'L’eau de pluie coule dans les rivières et la lagune, liquide, et revient à la mer.'};
  const ID={A:'evap',B:'cond',C:'pluie',D:'retour'};
  function manip(panel,X){
    M().bloc(panel,X,{n:25,titre:'Atelier · le paysage et le cycle de l’eau',
      intro:'Sur le paysage, je regarde quatre repères A à D. Je choisis un repère pour lire l’état de l’eau à cette étape.',
      controles:[{cle:'k',legende:'Le repère',items:FL}],
      saisie:'J’observe que, à ce repère, l’eau…',legendeTable:'Mes lectures : repère et état de l’eau.',F:()=>window.FICHE_CI_MAT25,
      render:v=>{const sc=M().scene.cycle({});return {montage:sc.montage,schema:sc.schema,txt:ETAT[v.k],essai:{rep:v.k}};}});
    M().tri(panel,X,{id:'cycle',titre:'Je nomme chaque étape',intro:'Pour chaque description, je choisis le nom de l’étape du cycle.',legende:'C’est',cats:M().CYCLE_NOMS,
      items:M().ETAPES_CYCLE.map(e=>({id:e.id,label:e.txt,juste:e.juste,pourquoi:{evaporation:'Le liquide devient gaz : évaporation (voir MAT-24).',condensation:'Le gaz devient liquide : condensation.',precipitation:'Les gouttes tombent du nuage : précipitations.',ruissellement:'L’eau coule vers la rivière puis la mer : ruissellement et retour à la mer.'}[e.juste],aide:'Quel est l’état de l’eau au début et à la fin de l’étape ?'}))});
  }
  const etLib=i=>(M().ETAPES_CYCLE.filter(x=>x.id===i)[0]||{txt:i}).txt;
  window.FICHE_CI_MAT25={
    id:'NL-CI-6E-MAT-25',version:'0.9',modele:'cycle-eau-v1',
    titre:'Expliquer le cycle de l’eau',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Expliquer le cycle de l’eau avec les changements d’état.',
    objectifsPedagogiques:['Ordonner les étapes du cycle de l’eau','Nommer l’état de l’eau à chaque étape','Relier chaque étape à un changement d’état vu en classe'],
    situationEvaluation:'Pendant la saison des pluies à Abidjan, Awa se demande d’où viennent les nuages et où va la pluie. Explique le cycle de l’eau en quatre étapes avec l’état de l’eau.',
    objectif:'Expliquer le cycle de l’eau.',objectifEleve:'Savoir raconter le cycle de l’eau.',
    situation:'D’où viennent les nuages, et où va la pluie ? Awa observe le paysage : mer, lagune, soleil, nuage, pluie, rivière.',
    materiel:'Schéma d’un paysage de Côte d’Ivoire avec quatre repères A à D.',
    prevision:{consigne:'Avant le jeu, choisis l’ordre des étapes qui te semble juste. Justifie ton hypothèse.',choix:[['bon','Évaporation, condensation, précipitations, retour à la mer'],['b','Précipitations, évaporation, condensation, retour à la mer'],['c','Condensation, précipitations, évaporation, retour à la mer'],['d','Retour à la mer, précipitations, condensation, évaporation']]},
    protocole:['Lire l’état de l’eau à chaque repère A à D.','Nommer chaque étape.','Relier chaque étape à une expérience de la leçon.','Raconter le cycle dans l’ordre.'],
    variable:'Le repère sur le paysage',maintenu:'Le même paysage',
    colonnes:['Élément','Mon choix','Résultat'],lignesVides:4,
    lignes:st=>st.essais.filter(e=>e.rep).map(e=>['Repère '+e.rep,lib(FL,e.rep),ETAT[e.rep]]).concat(M().lignesTri(st,'cycle',etLib,c=>lib(M().CYCLE_NOMS,c))),
    resume:e=>e.tri?'étape : '+lib(M().CYCLE_NOMS,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):'repère '+e.rep,
    confrontation:'1. Quel est l’ordre des étapes ? 2. Quel est l’état de l’eau à chacune ? 3. Où retrouve-t-on l’eau à la fin ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux étapes avec leur nom et l’état de l’eau.',
    transfert:{q:'L’eau est-elle perdue au cours du cycle ?',rep:'non',expl:'Non : l’eau change d’état et circule en cycle, sans se perdre.'},
    critere:'Ordonner les quatre étapes et nommer l’état de l’eau à chacune.',
    essaisMin:8,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Nomme une étape.'],['MF','Nomme les étapes sans l’ordre.'],['MS','Ordonne et nomme les quatre étapes.'],['TBM','Ordonne, nomme et donne l’état de l’eau à chaque étape.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>e.rep);return ['A','B','C','D'].every(k=>v.some(e=>e.rep===k))&&M().triEtat(st,'cycle',M().ETAPES_CYCLE.map(e=>e.id)).repondus>=4;},
    aides:['Le cycle commence par le soleil qui chauffe la mer.','En altitude, la vapeur se refroidit.','Quel changement d’état as-tu vu en MAT-24 ?'],
    synthese:'Le cycle de l’eau : le soleil provoque l’évaporation de l’eau de la mer (liquide → gaz) ; la vapeur se condense en nuages (gaz → liquide) ; les précipitations font retomber l’eau ; elle ruisselle dans les rivières et revient à la mer. L’eau change d’état et circule, sans se perdre.',
    prof:{reference:'Cycle : évaporation, condensation, précipitations, ruissellement et retour à la mer ; états : gaz puis liquide.',attendus:['Lire les quatre repères.','Nommer les quatre étapes.','Dire que l’eau ne se perd pas.'],erreurs:['Mettre les étapes dans le désordre.','Dire que le nuage est de la vapeur d’eau (ce sont des gouttelettes).']},
    diagnostic:st=>st.essais.length?['Indicatif : lis les quatre repères, puis nomme les étapes.']:['Lis un premier repère.']
  };
})();
