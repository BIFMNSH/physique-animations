/* NohobaLab · 6e Côte d'Ivoire · MAT-26 · Citer quelques gaz de la vie courante.
   Reconnaissance seulement : cinq situations, un gaz à nommer. Le butane est inflammable ; la « fumée » blanche d’une marmite est faite de gouttelettes. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const IC={butane:'butane',boisson:'boisson',marmite:'marmite',pneu:'pneu',oxygene:'oxygene'};
  const nom=c=>(M().GAZ_NOMS.filter(x=>x[0]===c)[0]||['',c])[1];
  const item=i=>(M().GAZ_VIE.filter(x=>x.id===i)[0]||{nom:i}).nom;
  function manip(panel,X){
    const items=M().GAZ_VIE.map(g=>({id:g.id,label:g.nom,svg:M().dessin.objetSvg(IC[g.id],g.nom),juste:g.gaz,pourquoi:g.noteGaz,aide:'Pense à ce que contient l’objet : ce qu’on gonfle, ce qui fait des bulles, ce qui brûle dans la cuisine, ce qui sort de l’eau chaude.'}));
    M().tri(panel,X,{id:'gaz',titre:'Quel gaz y a-t-il ici ?',intro:'Pour chaque situation de la vie courante, je choisis le gaz. Je ne touche à rien : c’est un classement.',vigilance:'Le gaz de la bouteille de cuisine est inflammable : on ne l’approche jamais d’une flamme.',legende:'Le gaz est',cats:M().GAZ_NOMS,items:items});
  }
  window.FICHE_CI_MAT26={
    id:'NL-CI-6E-MAT-26',version:'0.9',modele:'gaz-vie-courante-v1',
    titre:'Citer quelques gaz de la vie courante',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Reconnaître des gaz dans des situations du quotidien.',
    objectifsPedagogiques:['Citer au moins quatre gaz de la vie courante','Dire où on rencontre chacun','Savoir qu’un gaz est souvent invisible'],
    situationEvaluation:'Dans la cuisine de ta maison, cite quatre endroits où il y a un gaz et nomme-le. Précise lequel demande de la prudence.',
    objectif:'Reconnaître des gaz dans la vie courante.',objectifEleve:'Savoir citer des gaz et dire où ils sont.',
    situation:'Dans la cuisine, dans la rue, au centre de santé : y a-t-il des gaz autour d’Awa ? Elle observe une bouteille de gaz, une boisson gazeuse, une marmite qui bout, un pneu de vélo et une bouteille d’oxygène.',
    materiel:'Cinq dessins d’objets du quotidien et cinq noms de gaz.',
    prevision:{consigne:'Avant le classement, choisis le gaz que contient un pneu de vélo gonflé. Justifie ton hypothèse.',choix:[['air','De l’air'],['butane','Du butane, comme la bouteille de cuisine'],['vapeur','De la vapeur d’eau'],['rien','Rien : il est vide']]},
    protocole:['Regarder chaque situation.','Choisir le gaz et valider.','Lire l’explication, corriger si besoin.','Retenir lequel est inflammable.'],
    variable:'La situation étudiée',maintenu:'La liste des cinq gaz proposés',
    colonnes:['Situation','Mon gaz','Résultat'],lignesVides:5,
    lignes:st=>M().lignesTri(st,'gaz',item,nom),
    resume:e=>item(e.item).toLowerCase()+' : '+nom(e.choix)+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quels gaz as-tu reconnus ? 2. Lesquels sont invisibles ? 3. Lequel est inflammable ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une situation et son gaz.',
    transfert:{q:'Le « nuage blanc » au-dessus d’une marmite qui bout est-il de la vapeur d’eau invisible ?',rep:'non',expl:'Non : la vapeur d’eau est un gaz invisible ; le nuage blanc est fait de fines gouttelettes.'},
    critere:'Citer quatre gaz et dire où on les trouve.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Cite un gaz.'],['MF','Cite deux gaz sans situation.'],['MS','Cite quatre gaz avec leur situation.'],['TBM','Cite les gaz, leur lieu et la prudence pour le butane.']],
    peutConfronter:st=>M().triEtat(st,'gaz',M().GAZ_VIE.map(g=>g.id)).repondus>=5,
    aides:['Un pneu se gonfle avec de l’air.','Les bulles d’une boisson gazeuse sont du dioxyde de carbone.','La vapeur d’eau est invisible.'],
    synthese:'Les gaz de la vie courante : l’air (pneu, ballon), le butane de la bouteille de cuisine (inflammable), le dioxyde de carbone des boissons gazeuses, la vapeur d’eau, le dioxygène des centres de santé. Beaucoup sont invisibles.',
    prof:{reference:'Air, butane (inflammable), dioxyde de carbone, vapeur d’eau (invisible), dioxygène.',attendus:['Associer les cinq situations à leur gaz.','Signaler le butane inflammable.','Distinguer vapeur d’eau et nuage de gouttelettes.'],erreurs:['Appeler vapeur le nuage blanc.','Penser qu’un gaz se voit toujours.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les explications des erreurs.']:['Fais un premier choix.']
  };
})();
