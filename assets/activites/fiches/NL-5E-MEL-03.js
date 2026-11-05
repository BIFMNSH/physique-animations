/* NohobaLab · 5e · MEL-03 · Récupérer un constituant d'un mélange homogène.
   Modèle : table de résultats simulés (NohobaMelanges5e.res3). Chauffage = simulation, protocole guidé par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMelanges5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · séparer un mélange homogène',idObs:'e-obs',placeholder:'J’observe que la méthode…',
      intro:'Je choisis un mélange et une méthode. Le chauffage est réalisé par le professeur : ici, je l’observe en simulation.',
      fiche:()=>window.FICHE_5E_MEL03,
      groupes:[{legende:'Mélange',nom:'e-m',items:N.MIX3,def:'sel'},{legende:'Méthode',nom:'e-k',items:N.METH3,def:'filtration'}],
      rendre:v=>{const r=N.res3(v['e-m'],v['e-k']);return {montage:N.montage3(r.m,r.k),schema:N.schema3(r.m,r.k),lecture:r.mix+' · '+r.meth+' : '+r.txt,essai:{m:r.m,k:r.k,sep:r.sep,recup:r.recup}};}});
  }
  const REC={rien:'rien',solide:'le solide',distillat:'l’eau (distillat)'};
  window.FICHE_5E_MEL03={
    id:'NL-5E-MEL-03',version:'0.9',modele:'separation-homogene-v1',
    titre:'Comment récupérer le sel ou l’eau d’un mélange homogène ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'La séparation des constituants d’un mélange',
    competenceVisee:'Choisir la méthode qui permet de récupérer un constituant d’un mélange homogène.',
    objectifsPedagogiques:['Tester la filtration, l’évaporation et la distillation','Dire ce que chaque méthode permet de récupérer','Choisir la méthode d’après le constituant voulu'],
    situationEvaluation:'Awa veut récupérer de l’eau pure à partir d’eau de mer. Quelle méthode choisit-elle ? Justifie avec tes essais.',
    objectif:'Choisir la méthode pour récupérer un constituant d’un mélange homogène.',
    objectifEleve:'Savoir choisir entre filtration, évaporation et distillation.',
    situation:'Sur la plage de Grand-Bassam, Kofi regarde les salines : l’eau de mer s’évapore et laisse du sel. Awa se demande comment récupérer l’eau elle-même, et si un filtre suffit.',
    materiel:'Eau salée, eau sucrée, eau de mer, entonnoir, papier filtre, montage de distillation (manipulé par le professeur), simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['filtre','La filtration suffit pour séparer l’eau et le sel dissous'],['evap','L’évaporation donne le sel mais pas l’eau'],['distil','Il faut chauffer et condenser la vapeur pour récupérer l’eau'],['rien','Un mélange homogène ne peut pas être séparé']]},
    protocole:['Choisir un mélange homogène.','Choisir une méthode : filtration, évaporation ou distillation.','Le chauffage est réalisé par le professeur ; j’observe la simulation et ce qui est récupéré.','Tester les trois méthodes sur au moins deux mélanges.'],
    variable:'La méthode de séparation',maintenu:'Le mélange testé (un seul à la fois)',
    colonnes:['Mélange','Méthode','Je récupère','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.map(e=>[M().res3(e.m,e.k).mix,M().res3(e.m,e.k).meth,REC[e.recup],e.observation||'—']),
    resume:e=>M().res3(e.m,e.k).mix+' · '+M().res3(e.m,e.k).meth+' : '+REC[e.recup],
    confrontation:'1. Que récupère la filtration ? 2. Que récupère l’évaporation ? 3. Que récupère la distillation ? Compare à ton hypothèse : quelle méthode donne l’eau pure ?',
    retroaction:'Cite une méthode et ce qu’elle permet de récupérer (solide dissous ou eau).',
    transfert:{q:'Awa veut récupérer de l’eau pure à partir d’eau de mer. La méthode adaptée est :',rep:'distil',options:[['filtre','la filtration'],['evap','l’évaporation seule'],['distil','la distillation'],['repos','laisser reposer']],expl:'La distillation chauffe le mélange puis condense la vapeur d’eau : on recueille l’eau pure (distillat). La filtration ne retient pas un solide dissous ; l’évaporation seule perd l’eau.'},
    critere:'Réaliser au moins cinq essais et dire ce que chaque méthode permet de récupérer.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas les trois méthodes.'],['MF','Décrit les méthodes sans dire ce qu’elles récupèrent.'],['MS','Associe chaque méthode à ce qu’elle récupère.'],['TBM','Associe, justifie et emploie dissous, distillat et condensation.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&['filtration','evaporation','distillation'].every(k=>v.some(e=>e.k===k));},
    aides:['Le sel est dissous : passe-t-il à travers le filtre ?','Après l’évaporation, que reste-t-il dans la coupelle ?','As-tu testé les trois méthodes ?'],
    synthese:'Un constituant dissous traverse le filtre : la filtration ne sépare pas un mélange homogène. L’évaporation permet de récupérer le solide dissous, mais l’eau est perdue. La distillation chauffe le mélange puis condense la vapeur : on recueille l’eau pure (le distillat).',
    prof:{reference:'Filtration : rien n’est séparé. Évaporation : on récupère le sel ou le sucre. Distillation : on récupère l’eau pure (distillat). Chauffage réalisé par le professeur uniquement.',attendus:['Hypothèse notée avant les essais.','Au moins cinq essais, les trois méthodes testées.','Phrase : la distillation donne l’eau pure.'],erreurs:['Croire que le filtre retient le sel dissous.','Penser que l’évaporation récupère l’eau.','Confondre évaporation et distillation.']},
    diagnostic:st=>E().valides(st).some(e=>e.k==='distillation')?['Que contient le distillat ? Que reste-t-il dans le ballon ?']:['Teste la distillation pour voir ce que l’on recueille.']
  };
})();
