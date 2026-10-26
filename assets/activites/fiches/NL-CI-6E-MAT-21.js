/* NohobaLab · 6e Côte d'Ivoire · MAT-21 · Variation de volume de l'eau (fiche fusionnée MAT-21 + ancienne MAT-22, décision du 25 octobre 2026).
   Variation qualitative (« un peu plus de place »), sans pourcentage ni masse volumique. En réel : récipient en plastique souple, jamais en verre fermé. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:21,titre:'Atelier · le niveau de l’eau dans le tube',
      intro:'Un tube gradué contient de l’eau ; un trait marque le niveau de départ. Je choisis l’état de l’eau et je compare le niveau au trait de départ. Simulation.',
      controles:[{cle:'e',legende:'L’eau est…',items:M().ETATS_VOLUME}],
      saisie:'J’observe que le niveau…',legendeTable:'Mes essais : état de l’eau et niveau comparé au départ.',F:()=>window.FICHE_CI_MAT21,
      render:v=>{const r=M().volumeEau(v.e),sc=M().scene.volume({etat:v.e});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{etat:v.e,niveau:r.niveau,niv:r.niv}};}});
  }
  window.FICHE_CI_MAT21={
    id:'NL-CI-6E-MAT-21',version:'0.9',modele:'volume-eau-v1',
    titre:'Montrer la variation de volume de l’eau au cours de la solidification et de la fusion',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Montrer que le volume de l’eau change quand elle change d’état entre liquide et solide.',
    objectifsPedagogiques:['Dire que le volume de l’eau augmente quand elle gèle','Dire que le volume diminue quand la glace fond','Citer une conséquence pratique'],
    situationEvaluation:'Kofi range une bouteille en plastique pleine d’eau au congélateur. Qu’observe-t-il le lendemain ? Pourquoi ? Que se passe-t-il quand la glace fond ?',
    objectif:'Montrer que le volume change avec l’état de l’eau.',objectifEleve:'Savoir comment le volume de l’eau change quand elle gèle et quand la glace fond.',
    situation:'Une bouteille d’eau pleine au congélateur : que peut-il arriver ? Et quand la glace fond ? Awa marque le niveau d’un tube et le compare.',
    materiel:'Simulation : tube gradué avec un trait de niveau de départ.',
    prevision:{consigne:'Avant les essais, choisis ce que fait le niveau quand l’eau gèle. Justifie ton hypothèse.',choix:[['monte','Il monte au-dessus du trait de départ'],['baisse','Il descend sous le trait de départ'],['egal','Il reste au trait de départ'],['vide','Le tube se vide']]},
    protocole:['Marquer le niveau de l’eau liquide.','Observer le niveau quand l’eau est devenue glace.','Observer le niveau quand la glace a fondu.','Comparer les trois niveaux.'],
    variable:'L’état de l’eau',maintenu:'Le même tube et la même eau',
    colonnes:['État de l’eau','Niveau comparé au départ','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lib(M().ETATS_VOLUME,e.etat),e.niveau,e.observation||'—']),
    resume:e=>lib(M().ETATS_VOLUME,e.etat).toLowerCase()+' : niveau '+e.niveau,
    confrontation:'1. Que devient le niveau quand l’eau gèle ? 2. Et quand la glace fond ? 3. Pourquoi une bouteille pleine peut-elle se déformer au congélateur ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les trois niveaux observés.',
    transfert:{q:'Pourquoi ne faut-il pas remplir complètement une bouteille avant de la mettre au congélateur ?',rep:'place',type:'choix',options:[['place','Parce que l’eau prend un peu plus de place en gelant'],['masse','Parce que l’eau devient plus légère'],['chaud','Parce que la glace est chaude'],['rien','Il n’y a aucune raison']],expl:'En gelant, l’eau occupe un peu plus de place : une bouteille pleine se déforme, une conduite peut éclater.'},
    critere:'Conclure sur le volume à la solidification et à la fusion, et citer un risque.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un seul niveau.'],['MF','Compare sans conclure.'],['MS','Conclut sur la solidification et la fusion.'],['TBM','Conclut et cite une conséquence pratique.']],
    peutConfronter:st=>{const v=M().valides(st);return ['liquide','solide','fondue'].every(k=>v.some(e=>e.etat===k));},
    aides:['Compare le niveau au trait de départ.','Que fait le niveau quand la glace fond ?','Une bouteille pleine qui gèle manque de place.'],
    synthese:'Quand l’eau gèle, son volume augmente : la glace prend un peu plus de place. Quand la glace fond, le volume diminue et revient au niveau de départ. C’est pourquoi une bouteille pleine se déforme au congélateur et qu’une conduite peut éclater par grand froid.',
    prof:{reference:'Volume plus grand pour la glace, retour au niveau de départ à la fusion ; variation qualitative, sans valeur.',attendus:['Voir les trois niveaux.','Conclure.','Citer une conséquence.'],erreurs:['Donner un pourcentage.','Confondre avec la masse.','Utiliser un récipient en verre fermé en réel.']},
    diagnostic:st=>st.essais.length?['Indicatif : observe les trois états.']:['Fais un premier essai.']
  };
})();
