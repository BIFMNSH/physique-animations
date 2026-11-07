/* NohobaLab · 5e · MAT-02 · Corps simple, corps composé.
   Modèle : molécules CPK, classement d'après le nombre de types d'atomes (NohobaMatiere5e.mol). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · ranger les molécules',idObs:'e-obs',placeholder:'J’observe que la molécule…',
      intro:'Je choisis une molécule et je compte les types d’atomes différents qu’elle contient.',
      fiche:()=>window.FICHE_5E_MAT02,
      groupes:[{legende:'Molécule',nom:'e-m',items:N.MOL.map(m=>[m[0],m[1]]),def:'h2'}],
      rendre:v=>{const m=N.mol(v['e-m']);return {montage:N.montageMol(m.id),schema:N.schemaMol(m.id,'classe'),lecture:m.nom+' ('+m.f+') : '+m.types+(m.types>1?' types d’atomes':' type d’atome')+' → corps '+m.classe,essai:{m:m.id,types:m.types,classe:m.classe}};}});
  }
  window.FICHE_5E_MAT02={
    id:'NL-5E-MAT-02',version:'0.9',modele:'corps-simple-compose-v1',
    titre:'Comment ranger les corps purs ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'Atomes et molécules',
    competenceVisee:'Classer un corps pur en corps simple ou corps composé d’après sa formule.',
    objectifsPedagogiques:['Compter les types d’atomes dans une formule','Distinguer corps simple et corps composé','Justifier le classement avec le nombre de types d’atomes'],
    situationEvaluation:'Awa lit « O₂ » sur une bouteille d’oxygène et « CO₂ » sur un extincteur. Chacun est-il un corps simple ou un corps composé ? Justifie.',
    objectif:'Classer des corps purs en corps simples et corps composés.',
    objectifEleve:'Savoir classer un corps pur à partir de sa formule.',
    situation:'Awa a rangé sur la table dix modèles de molécules du laboratoire. Kofi remarque que certains n’ont qu’une seule couleur de boules et d’autres plusieurs. Peut-on les ranger en deux familles ?',
    materiel:'Modèles moléculaires en boules (couleurs CPK), simulation.',
    prevision:{consigne:'Avant d’observer, choisis comment ranger les molécules. Justifie ton hypothèse avec « car ».',choix:[
      ['types','Deux familles : un seul type d’atome ou plusieurs types d’atomes'],['total','On les range d’après le nombre total d’atomes'],['etat','On les range d’après leur état (gaz, liquide)'],['aucun','On ne peut pas les ranger']]},
    protocole:['Choisir une molécule et regarder son modèle.','Compter les types d’atomes différents (couleurs).','Noter la famille : un seul type ou plusieurs types.','Observer au moins six molécules.'],
    variable:'La molécule observée',maintenu:'Le critère de comptage : les types d’atomes',
    colonnes:['Molécule','Types d’atomes','Famille','Mon observation'],lignesVides:8,
    lignes:st=>st.essais.map(e=>[M().mol(e.m).nom,String(e.types),'corps '+e.classe,e.observation||'—']),
    resume:e=>M().mol(e.m).nom+' ('+M().mol(e.m).f+') : '+e.types+(e.types>1?' types':' type')+' → corps '+e.classe,
    confrontation:'1. Quelles molécules n’ont qu’un seul type d’atome ? 2. Lesquelles en ont plusieurs ? 3. Le nombre total d’atomes permet-il de classer ? Compare à ton hypothèse.',
    retroaction:'Cite un corps simple et un corps composé avec leur formule et le nombre de types d’atomes.',
    transfert:{q:'Le dioxyde de carbone CO₂ est :',rep:'compose',options:[['simple','un corps simple, car il a trois atomes'],['compose','un corps composé, car il contient deux types d’atomes (C et O)'],['melange','un mélange'],['atome','un atome']],expl:'CO₂ contient du carbone et de l’oxygène : deux types d’atomes, donc un corps composé. Le nombre total d’atomes ne sert pas à classer.'},
    critere:'Observer au moins six molécules et les classer d’après le nombre de types d’atomes.',
    essaisMin:6,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne compte pas les types d’atomes.'],['MF','Compte les atomes sans classer.'],['MS','Classe en corps simple ou composé d’après les types d’atomes.'],['TBM','Classe, justifie avec la formule et écarte le nombre total d’atomes comme critère.']],
    peutConfronter:st=>{const v=E().valides(st),m=new Set(v.map(e=>e.m));return v.length>=6&&m.size>=6&&v.filter(e=>e.classe==='simple').length>=2&&v.filter(e=>e.classe==='composé').length>=2;},
    aides:['Regarde les couleurs différentes dans le modèle.','Un seul type d’atome : corps simple.','As-tu observé au moins deux corps simples et deux corps composés ?'],
    synthese:'Un corps pur est formé d’une seule sorte de molécules. Un corps simple est formé d’un seul type d’atome (H₂, O₂, N₂, Cl₂). Un corps composé est formé d’au moins deux types d’atomes différents (H₂O, CO₂, CH₄, NH₃).',
    prof:{reference:'Simples : H₂, O₂, N₂, Cl₂. Composés : H₂O, CO₂, CO, CH₄, NH₃, SO₂.',attendus:['Hypothèse notée avant les observations.','Au moins six molécules observées.','Phrase : un type d’atome = simple ; au moins deux = composé.'],erreurs:['Classer d’après le nombre total d’atomes (O₂ : deux atomes, donc « composé »).','Confondre corps simple et atome.','Confondre corps composé et mélange.']},
    diagnostic:st=>E().valides(st).some(e=>e.classe==='composé')?['Compare ce composé à un corps simple : que remarques-tu sur les couleurs ?']:['Observe une molécule qui contient plusieurs couleurs de boules.']
  };
})();
