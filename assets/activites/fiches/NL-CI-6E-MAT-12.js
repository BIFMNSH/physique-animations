/* NohobaLab · 6e Côte d'Ivoire · MAT-12 · Découvrir la notion de température.
   Eau « chaude » = seulement agréablement chaude, jamais brûlante. Aucune valeur numérique : le thermomètre vient ensuite. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const AV=[['froide','D’abord dans l’eau froide'],['chaude','D’abord dans l’eau agréablement chaude'],['aucune','Dans aucun bac avant']];
  const lib=k=>(AV.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:12,titre:'Atelier · la même eau tiède, deux mains',
      intro:'Je choisis où ma main a été avant, puis je la plonge dans l’eau tiède. L’eau « chaude » est seulement agréablement chaude. Simulation : je ne touche à aucune eau en vrai pendant cette étape.',
      controles:[{cle:'a',legende:'Ma main a été…',items:AV}],
      saisie:'J’observe que l’eau tiède paraît…',legendeTable:'Mes essais : bac d’avant et sensation dans l’eau tiède.',F:()=>window.FICHE_CI_MAT12,
      render:v=>{const r=M().toucher(v.a),sc=M().scene.toucher({avant:v.a});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{avant:v.a,sensation:r.mainGauche}};}});
  }
  window.FICHE_CI_MAT12={
    id:'NL-CI-6E-MAT-12',version:'0.9',modele:'toucher-sensation-v1',
    titre:'Découvrir la notion de température',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Montrer que le toucher ne permet pas d’apprécier la température.',
    objectifsPedagogiques:['Expliquer pourquoi la même eau tiède peut paraître chaude ou froide','Dire que le toucher peut tromper','Dire qu’il faut un instrument pour repérer une température'],
    situationEvaluation:'Kofi dit : « je sais si l’eau est chaude en y mettant la main ». Que lui réponds-tu, avec l’expérience des deux mains ?',
    objectif:'Montrer que le toucher peut tromper.',objectifEleve:'Savoir pourquoi il faut un thermomètre.',
    situation:'Awa plonge une main dans l’eau froide, l’autre dans l’eau agréablement chaude, puis les deux dans l’eau tiède. Les deux mains sentent-elles la même chose ?',
    materiel:'Simulation : trois bacs (froid, tiède, agréablement chaud) et deux mains.',
    prevision:{consigne:'Avant les essais, choisis ce que sent la main qui sort de l’eau froide dans l’eau tiède. Justifie ton hypothèse.',choix:[['chaude','Elle trouve l’eau tiède chaude'],['froide','Elle trouve l’eau tiède froide'],['tiede','Elle la trouve tiède, comme l’autre main'],['rien','Elle ne sent rien']]},
    protocole:['Plonger une main dans l’eau froide, l’autre dans l’eau agréablement chaude.','Mettre ensuite chaque main dans l’eau tiède.','Noter ce que chaque main ressent.','Comparer avec une main qui n’a rien touché avant.'],
    variable:'Le bac où la main a été avant',maintenu:'L’eau tiède',
    colonnes:['Ma main a été','Sensation dans l’eau tiède','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lib(e.avant),e.sensation,e.observation||'—']),
    resume:e=>lib(e.avant).toLowerCase()+' : l’eau tiède paraît '+e.sensation,
    confrontation:'1. Que sent la main sortie de l’eau froide ? 2. Et l’autre ? 3. L’eau tiède a-t-elle changé ? 4. Que dire du toucher ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux essais et la sensation de chaque main.',
    transfert:{q:'Le toucher permet-il de savoir avec certitude si une eau est chaude ou froide ?',rep:'non',expl:'Non : la sensation dépend de ce que la main a touché avant. Il faut un thermomètre.'},
    critere:'Expliquer que le toucher peut tromper avec deux essais.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les bacs sans les sensations.'],['MF','Donne les sensations sans conclure.'],['MS','Conclut que le toucher peut tromper.'],['TBM','Conclut et explique le besoin d’un thermomètre.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.avant==='froide')&&v.some(e=>e.avant==='chaude');},
    aides:['Compare les deux mains dans la même eau tiède.','Qu’est-ce qui a changé : l’eau ou la main ?','La sensation dépend de la température d’avant.'],
    synthese:'Le toucher peut tromper : la même eau tiède paraît chaude à une main qui sort de l’eau froide et froide à une main qui sort d’une eau chaude. Pour repérer une température, il faut un instrument : le thermomètre.',
    prof:{reference:'La sensation dépend de l’état antérieur de la main ; il faut un thermomètre.',attendus:['Observer les deux sensations opposées.','Conclure que le toucher trompe.','Annoncer le thermomètre.'],erreurs:['Dire que l’eau change de température selon la main.','Utiliser de l’eau brûlante : interdit.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste la main « froide » et la main « chaude ».']:['Fais un premier essai.']
  };
})();
