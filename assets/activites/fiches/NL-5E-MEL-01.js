/* NohobaLab · 5e · MEL-01 · Mélanges homogènes et hétérogènes.
   Modèle : nombre de phases visibles (NohobaMelanges5e.mix1). */
(function(){
  'use strict';
  const M=()=>window.NohobaMelanges5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · observer un mélange',idObs:'e-obs',placeholder:'J’observe que le mélange…',
      intro:'Je choisis un mélange, je regarde le bécher et je compte les phases que je distingue à l’œil nu.',
      fiche:()=>window.FICHE_5E_MEL01,
      groupes:[{legende:'Mélange',nom:'e-m',items:N.MIX1.map(m=>[m[0],m[1]]),def:'sable'}],
      rendre:v=>{const m=N.mix1(v['e-m']);return {montage:N.montage1(m.id),schema:N.schema1(m.id),lecture:m.nom+' : '+m.phases+(m.phases>1?' phases':' phase'),essai:{m:m.id,phases:m.phases,famille:m.famille}};}});
  }
  window.FICHE_5E_MEL01={
    id:'NL-5E-MEL-01',version:'0.9',modele:'melanges-phases-v1',
    titre:'Comment classer les mélanges ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'Les mélanges',
    competenceVisee:'Classer un mélange en homogène ou hétérogène d’après le nombre de phases observées.',
    objectifsPedagogiques:['Compter les phases visibles dans un mélange','Distinguer mélange homogène et mélange hétérogène','Justifier le classement avec le nombre de phases'],
    situationEvaluation:'Kofi prépare de l’eau boueuse pour arroser. Est-ce un mélange homogène ou hétérogène ? Justifie avec le nombre de phases.',
    objectif:'Classer des mélanges d’après le nombre de phases.',
    objectifEleve:'Savoir classer un mélange en homogène ou hétérogène.',
    situation:'Dans la cuisine, Awa mélange de l’eau avec du sable, du sel, de l’huile de palme… Kofi remarque que certains mélanges se voient « en plusieurs morceaux » et d’autres non. Il veut les ranger en deux familles.',
    materiel:'Béchers, eau, sable, sel, huile de palme, sucre, terre, sirop, farine, alcool, simulation.',
    prevision:{consigne:'Avant d’observer, choisis comment ranger les mélanges. Justifie ton hypothèse avec « car ».',choix:[
      ['deux','Il y a deux familles : un seul aspect visible ou plusieurs aspects visibles'],['identiques','Tous les mélanges se ressemblent'],['couleur','On les range d’après leur couleur'],['gout','On les range d’après leur goût']]},
    protocole:['Choisir un mélange et regarder le bécher.','Compter les phases visibles à l’œil nu.','Noter une observation après chaque mélange.','Observer au moins cinq mélanges, dont un seul aspect et plusieurs aspects.'],
    variable:'Le mélange observé',maintenu:'L’observation à l’œil nu, sans goûter ni chauffer',
    colonnes:['Mélange','Phases','Famille','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[M().mix1(e.m).nom,String(e.phases),e.famille,e.observation||'—']),
    resume:e=>M().mix1(e.m).nom+' : '+e.phases+(e.phases>1?' phases':' phase')+' → '+e.famille,
    confrontation:'1. Range tes mélanges : combien de phases voit-on pour chacun ? 2. Quels mélanges ont une seule phase ? plusieurs phases ? 3. Le goût ou la couleur permettent-ils de classer ? Compare à ton hypothèse.',
    retroaction:'Cite un mélange à une phase et un mélange à plusieurs phases, avec le nombre de phases.',
    transfert:{q:'L’eau boueuse de Kofi se voit en deux parties : la terre et l’eau. C’est un mélange :',rep:'hetero',options:[['homo','homogène, car on voit une seule phase'],['hetero','hétérogène, car on voit plusieurs phases'],['pur','un corps pur'],['couleur','homogène, car elle est marron']],expl:'On distingue plusieurs phases (terre et eau) : le mélange est hétérogène. La couleur ne sert pas à classer.'},
    critere:'Observer au moins cinq mélanges et les ranger d’après le nombre de phases.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne compte pas les phases.'],['MF','Compte les phases sans classer le mélange.'],['MS','Classe le mélange d’après le nombre de phases.'],['TBM','Classe, justifie avec le nombre de phases et écarte la couleur et le goût comme critères.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&v.some(e=>e.phases===1)&&v.some(e=>e.phases>1);},
    aides:['Regarde le bécher : combien de couches ou d’aspects distincts vois-tu ?','Un mélange est homogène si on voit une seule phase.','As-tu observé au moins un mélange à une phase et un à plusieurs phases ?'],
    synthese:'Un mélange est formé de plusieurs constituants. Si l’on distingue une seule phase à l’œil nu, le mélange est homogène (eau salée, eau sucrée). Si l’on distingue plusieurs phases, le mélange est hétérogène (eau et sable, eau et huile).',
    prof:{reference:'Homogènes : eau salée, eau sucrée, eau au sirop, eau et alcool (une phase). Hétérogènes : eau et sable, eau et huile de palme, eau et terre, eau et farine (deux phases).',attendus:['Hypothèse notée avant les observations.','Au moins cinq mélanges observés.','Phrase : une phase = homogène ; plusieurs phases = hétérogène.'],erreurs:['Classer d’après la couleur ou le goût.','Croire qu’un mélange transparent est un corps pur.','Confondre « phase » et « constituant ».']},
    diagnostic:st=>{const v=E().valides(st);return v.some(e=>e.phases>1)?['Compare ce mélange à un mélange à une seule phase.']:['Observe un mélange où l’on voit plusieurs phases.'];}
  };
})();
