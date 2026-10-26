/* NohobaLab · 6e Côte d'Ivoire · MAT-07 · Montrer l'existence de l'air.
   Modèle qualitatif : l’air occupe de la place ; il est dessiné par des points neutres, jamais comme une substance colorée. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const EXP=()=>M().AIR.map(a=>[a.id,a.nom]);
  const lib=k=>(EXP().filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:7,titre:'Atelier · je cherche l’air',
      intro:'Je choisis une expérience et j’observe ce qui se passe. Le verre est bien droit au départ. L’air est représenté par des petits points. Simulation uniquement.',
      controles:[{cle:'e',legende:'L’expérience',items:EXP()}],
      saisie:'J’observe que l’eau… ou que le ballon…',legendeTable:'Mes essais : expérience et observation.',F:()=>window.FICHE_CI_MAT07,
      render:v=>{const a=M().air(v.e),sc=M().scene.air({exp:v.e});return {montage:sc.montage,schema:sc.schema,txt:a.txt,essai:{exp:v.e,bulles:a.bulles}};}});
  }
  window.FICHE_CI_MAT07={
    id:'NL-CI-6E-MAT-07',version:'0.9',modele:'air-occupe-place-v1',
    titre:'Montrer l’existence de l’air',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Montrer par une expérience que l’air existe et occupe de la place.',
    objectifsPedagogiques:['Décrire une expérience qui prouve la présence de l’air','Dire que l’air occupe de la place','Conclure à partir d’observations'],
    situationEvaluation:'Kofi pense qu’un verre « vide » ne contient rien. Décris une expérience qui lui montre le contraire et dis ce qu’il verra.',
    objectif:'Prouver que l’air existe.',objectifEleve:'Savoir montrer que l’air est là.',
    situation:'On ne voit pas l’air. Awa se demande comment savoir qu’il existe. Elle dispose d’un verre, d’une cuve à eau, d’un ballon et d’une seringue.',
    materiel:'Simulation : cristallisoir rempli d’eau, verre, ballon de baudruche, seringue fermée.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive quand on enfonce un verre à l’envers, bien droit, dans l’eau. Justifie ton hypothèse.',choix:[['nentre','L’eau n’entre presque pas dans le verre'],['remplit','Le verre se remplit d’eau aussitôt'],['coule','Le verre se remplit d’eau puis coule'],['rien','On ne peut rien prévoir']]},
    protocole:['Enfoncer le verre droit dans l’eau, observer.','Incliner le verre sous l’eau, observer.','Gonfler un ballon, observer.','Pousser le piston d’une seringue fermée, observer.'],
    variable:'L’expérience choisie',maintenu:'La cuve et le verre',
    colonnes:['Expérience','Bulles ?','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(e.exp),e.bulles?'Oui':'Non',e.observation||'—']),
    resume:e=>lib(e.exp).toLowerCase()+' : '+(e.bulles?'des bulles sortent':'pas de bulles'),
    confrontation:'1. Pourquoi l’eau n’entre-t-elle pas quand le verre est droit ? 2. Que se passe-t-il quand on incline ? 3. Que prouve le ballon ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une expérience et ce qui prouve la présence de l’air.',
    transfert:{q:'Un verre « vide » enfoncé droit dans l’eau ne se remplit pas. Est-il vraiment vide ?',rep:'non',expl:'Non : il contient de l’air, qui occupe la place et empêche l’eau d’entrer.'},
    critere:'Décrire une expérience prouvant l’air et conclure.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les dessins sans conclure.'],['MF','Dit que l’eau n’entre pas, sans parler de l’air.'],['MS','Conclut que l’air existe et occupe de la place.'],['TBM','Conclut et relie les trois expériences.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'exp')>=2&&v.some(e=>e.exp==='verre_droit');},
    aides:['Regarde le niveau de l’eau dans le verre.','Que sort du verre quand on l’incline ?','Ce qui empêche l’eau d’entrer occupe de la place.'],
    synthese:'L’air existe : il est invisible mais il occupe de la place. Il empêche l’eau d’entrer dans un verre renversé, il gonfle un ballon, il pousse sur le piston d’une seringue fermée.',
    prof:{reference:'L’air existe et occupe de la place : verre renversé, bulles quand on incline, ballon gonflé.',attendus:['Observer que l’eau n’entre presque pas dans le verre droit.','Observer les bulles quand on incline.','Conclure : l’air existe, il occupe de la place.'],erreurs:['Dire que le verre est vide.','Incliner le verre au départ : la conclusion serait faussée.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais au moins l’expérience du verre droit et une autre.']:['Fais un premier essai.']
  };
})();
