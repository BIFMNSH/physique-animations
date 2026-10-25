/* NohobaLab · 6e Côte d'Ivoire · MAT-14 · Repérer la température d'un corps.
   Valeurs affichées = illustrations simulées, jamais des mesures. Le réservoir ne touche ni le fond ni la paroi. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const MIL=[['air','L’air de la salle'],['eau','L’eau d’un bac']];
  const MOM=[['debut','Tout de suite après avoir placé le thermomètre'],['stable','Après avoir attendu que la colonne ne bouge plus']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:14,titre:'Atelier · je mesure une température',
      intro:'Je place le thermomètre dans l’air ou dans l’eau, je choisis le moment de la lecture et j’observe la colonne. Valeurs simulées.',
      controles:[{cle:'m',legende:'Le milieu',items:MIL},{cle:'t',legende:'Le moment de la lecture',items:MOM}],
      saisie:'J’observe que la colonne… et je lis…',legendeTable:'Mes essais : milieu, moment et valeur lue.',F:()=>window.FICHE_CI_MAT14,
      render:v=>{const r=M().repererTemp(v.m,v.t),sc=M().scene.repererTemp({milieu:v.m,moment:v.t});return {montage:sc.montage,schema:sc.schema,txt:r.txt+' Valeur affichée : '+r.valeur+' °C.',essai:{milieu:v.m,moment:v.t,valeur:r.valeur,stable:r.stable}};}});
  }
  window.FICHE_CI_MAT14={
    id:'NL-CI-6E-MAT-14',version:'0.9',modele:'repérer-temperature-v1',
    titre:'Repérer la température d’un corps',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Utiliser correctement un thermomètre pour repérer une température.',
    objectifsPedagogiques:['Placer le thermomètre dans le milieu sans toucher le fond ni la paroi','Attendre que la colonne se stabilise','Lire la valeur et l’écrire avec son unité'],
    situationEvaluation:'Kofi lit son thermomètre dès qu’il le plonge dans l’eau et note 23 °C. Awa attend et lit 28 °C. Qui a raison ? Écris la procédure en quatre étapes.',
    objectif:'Appliquer la procédure de mesure.',objectifEleve:'Savoir mesurer une température.',
    situation:'Comment mesurer la température de l’air de la classe ou de l’eau d’un bac ? Awa estime d’abord, puis mesure.',
    materiel:'Simulation : thermomètre de laboratoire, air de la salle, bac d’eau.',
    prevision:{consigne:'Avant les essais, choisis quand il faut lire le thermomètre après l’avoir placé. Justifie ton hypothèse.',choix:[['attendre','Après avoir attendu que la colonne ne bouge plus'],['tout','Tout de suite, dès qu’il est placé'],['avant','Avant de le placer'],['jamais','On ne peut pas le lire']]},
    protocole:['Placer le thermomètre dans le milieu.','Lire tout de suite et noter que la colonne bouge.','Attendre et lire quand elle est immobile.','Écrire la valeur avec l’unité.'],
    variable:'Le moment de la lecture, puis le milieu',maintenu:'Le même thermomètre',
    colonnes:['Milieu','Moment','Valeur lue (simulée)','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(MIL,e.milieu),e.moment==='debut'?'Tout de suite':'Après attente',e.valeur+' °C',e.observation||'—']),
    resume:e=>lib(MIL,e.milieu).toLowerCase()+' ('+(e.moment==='debut'?'lecture immédiate':'colonne stable')+') : '+e.valeur+' °C',
    confrontation:'1. La valeur change-t-elle juste après le placement ? 2. Quand est-elle fiable ? 3. Que faire si la valeur est douteuse ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une lecture immédiate et une lecture après attente.',
    transfert:{q:'Faut-il attendre que la colonne se stabilise avant de lire ?',rep:'oui',expl:'Oui : tant qu’elle bouge, le thermomètre n’a pas atteint la température du milieu.'},
    critere:'Écrire la procédure en quatre étapes avec une valeur lue et son unité.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit sans attendre.'],['MF','Attend mais n’écrit pas l’unité.'],['MS','Applique la procédure et écrit l’unité.'],['TBM','Applique, explique l’attente et refait une lecture douteuse.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.moment==='debut')&&v.some(e=>e.moment==='stable');},
    aides:['Compare la valeur « tout de suite » et « après attente ».','Le réservoir ne touche ni le fond ni la paroi.','La valeur utile est celle qui ne bouge plus.'],
    synthese:'Pour repérer une température : placer le thermomètre sans toucher le fond ni la paroi, attendre que la colonne se stabilise, lire à hauteur d’œil, écrire la valeur avec l’unité (par exemple 28 °C, à 1 °C près).',
    prof:{reference:'Placer, attendre, lire, écrire avec l’unité ; valeurs simulées.',attendus:['Observer la différence entre lecture immédiate et stable.','Écrire la procédure.','Écrire l’unité.'],erreurs:['Lire trop tôt.','Poser le réservoir sur le fond du bac.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais une lecture immédiate et une lecture après attente.']:['Fais un premier essai.']
  };
})();
