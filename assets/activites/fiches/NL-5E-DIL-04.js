/* NohobaLab · 5e · DIL-04 · Un gaz chauffé.
   Modèle : volumes qualitatifs (NohobaDilatation5e.res4). Eau chaude préparée par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaDilatation5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · le ballon de baudruche',idObs:'e-obs',placeholder:'J’observe que le ballon…',
      intro:'Je choisis le bain du ballon de verre et j’observe le ballon de baudruche. L’eau chaude est préparée par le professeur.',
      fiche:()=>window.FICHE_5E_DIL04,
      groupes:[{legende:'Bain',nom:'e-b',items:N.BAINS4,def:'chaud'}],
      rendre:v=>{const r=N.res4(v['e-b']);return {montage:N.montage4(r.b),schema:N.schema4(r.b),lecture:r.bain+' : '+r.txt,essai:{b:r.b,etat:r.etat}};}});
  }
  window.FICHE_5E_DIL04={
    id:'NL-5E-DIL-04',version:'0.9',modele:'gaz-chauffe-v1',
    titre:'Que devient l’air quand on le chauffe ?',niveau:'5e',
    theme:'Propriétés physiques de la matière',chapitre:'La dilatation des gaz',
    competenceVisee:'Relier la variation de température au volume d’un gaz.',
    objectifsPedagogiques:['Observer le ballon de baudruche dans différents bains','Constater la dilatation et la contraction de l’air','Comparer la dilatation des gaz à celle des liquides et des solides'],
    situationEvaluation:'Awa laisse une bouteille de gaz fermée près du feu de cuisine. Pourquoi est-ce dangereux ? Justifie avec tes essais.',
    objectif:'Relier la température au volume d’un gaz.',
    objectifEleve:'Savoir ce que devient l’air chauffé ou refroidi.',
    situation:'Awa pose un ballon de verre rempli d’air, coiffé d’un ballon de baudruche dégonflé, dans l’eau chaude : le ballon de baudruche se gonfle. Kofi se demande pourquoi.',
    materiel:'Ballon de verre, ballon de baudruche, bacs d’eau (glacée, ambiante, chaude préparée par le professeur), simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['augmente','Chauffé, l’air occupe plus de volume : le ballon se gonfle'],['constant','Le volume de l’air ne change pas'],['diminue','Chauffé, l’air occupe moins de volume'],['disparait','L’air disparaît quand il est chauffé']]},
    protocole:['Placer le ballon de verre dans le bain choisi.','Observer le ballon de baudruche.','Essayer aussi la chaleur des mains.','Faire au moins trois essais et noter une observation.'],
    variable:'Le bain (température)',maintenu:'Le ballon de verre et la quantité d’air',
    colonnes:['Bain','Ballon de baudruche','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[M().res4(e.b).bain,e.etat,e.observation||'—']),
    resume:e=>M().res4(e.b).bain+' : ballon '+e.etat,
    confrontation:'1. Que fait le ballon dans l’eau chaude ? 2. Et dans l’eau glacée ? 3. Que fait la chaleur des mains ? Compare à ton hypothèse.',
    retroaction:'Cite un bain et dis si le ballon est gonflé ou dégonflé.',
    transfert:{q:'Une bouteille de gaz fermée est laissée près du feu. Le gaz chauffé cherche à occuper plus de place. Que risque-t-il ?',rep:'danger',options:[['danger','La pression monte dans la bouteille : il faut la garder loin de la chaleur'],['rien','Rien, le gaz ne change pas'],['disparait','Le gaz disparaît'],['froid','Le gaz se refroidit']],expl:'Un gaz chauffé se dilate. Dans une bouteille fermée, il ne peut pas occuper plus de place : sa pression augmente. On garde les bouteilles de gaz et les aérosols loin de la chaleur.'},
    critere:'Tester au moins l’eau chaude et l’eau glacée et conclure : un gaz chauffé se dilate, refroidi il se contracte.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas l’état du ballon au bain.'],['MF','Décrit le ballon sans conclure.'],['MS','Conclut qu’un gaz chauffé se dilate et que refroidi il se contracte.'],['TBM','Conclut, compare aux liquides et aux solides et applique à la bouteille de gaz.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=3&&v.some(e=>e.b==='chaud')&&v.some(e=>e.b==='glace');},
    aides:['Regarde la taille du ballon de baudruche.','Un gaz chauffé occupe-t-il plus de place ?','As-tu testé l’eau chaude et l’eau glacée ?'],
    synthese:'Un gaz chauffé se dilate : son volume augmente. Refroidi, il se contracte. Les gaz se dilatent bien plus que les liquides et les solides. Dans une bouteille fermée, c’est la pression qui monte : on garde les bouteilles de gaz et les aérosols loin de la chaleur.',
    prof:{reference:'Eau chaude : ballon de baudruche gonflé. Eau glacée : dégonflé. Mains : léger gonflement. Les gaz se dilatent bien plus que liquides et solides (mention qualitative). Eau chaude préparée par le professeur.',attendus:['Hypothèse notée avant les essais.','Eau chaude et eau glacée testées avec observation.','Phrase : un gaz chauffé se dilate, refroidi il se contracte.'],erreurs:['Croire que l’air disparaît ou s’échappe.','Oublier la contraction à froid.','Confondre volume et pression dans une bouteille fermée.']},
    diagnostic:st=>E().valides(st).some(e=>e.b==='glace')?['Compare ce ballon à celui de l’eau chaude.']:['Teste l’eau glacée pour voir la contraction.']
  };
})();
