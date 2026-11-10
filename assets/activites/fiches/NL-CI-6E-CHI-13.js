/* NohobaLab · 6e Côte d'Ivoire · CHI-13 · Distinguer une combustion complète d'une combustion incomplète.
   Comparateur : huit situations à classer, vérifiables au brûleur simulé (virole + soucoupe). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:13,titre:'Vérification · le brûleur',
      intro:'Pour vérifier une situation, je règle la virole et je regarde la flamme et la soucoupe (brûleur allumé par le professeur).',
      controles:[{cle:'v',legende:'La virole',items:C().VIROLES}],
      saisie:'J’observe que…',legendeTable:'Mes vérifications.',F:()=>window.FICHE_CI_CHI13,
      render:v=>{const b=C().butane(v.v),sc=C().sceneButane(v.v,'soucoupe');return {montage:sc.montage,schema:sc.schema,txt:b.txt,essai:{v:v.v,flamme:b.flamme,depot:b.depot}};}});
    const items=C().SITUATIONS_FLAMME.map(s=>({id:s.id,label:s.label,juste:s.juste,pourquoi:s.pourquoi,aide:'Bleue, chaude, propre, beaucoup d’air : complète. Jaune, moins chaude, dépôt noir, peu d’air : incomplète.'}));
    M().tri(panel,X,{id:'completude',titre:'Comparateur · complète ou incomplète ?',intro:'Pour chaque situation observée à la maison ou au laboratoire, je dis de quelle combustion il s’agit.',legende:'C’est une',cats:C().COMPLETUDES,items,impression:{titre:'Mon tableau complète / incomplète'}});
  }
  window.FICHE_CI_CHI13={
    id:'NL-CI-6E-CHI-13',version:'0.9',modele:'complete-incomplete-v1',
    titre:'Bleue ou jaune ?',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un gaz dans l’air',
    competenceVisee:'Distinguer une combustion complète d’une combustion incomplète à partir de ses signes.',
    objectifsPedagogiques:['Utiliser quatre critères : couleur, chaleur, dépôt, arrivée d’air','Classer des situations du quotidien','Dire ce que signale une flamme jaune à la maison'],
    situationEvaluation:'Chez Kofi, le chauffe-eau au gaz a une flamme jaune et le mur au-dessus noircit. De quelle combustion s’agit-il ? Que faut-il faire ?',
    objectif:'Distinguer combustion complète et incomplète.',objectifEleve:'Savoir reconnaître à coup sûr une combustion complète et une combustion incomplète.',
    situation:'Kofi et Awa observent deux réchauds au marché : l’un à flamme bleue, l’autre à flamme jaune. Comment savoir lequel brûle bien ? Ils dressent un tableau de critères.',
    materiel:'Simulation : brûleur à butane (professeur), soucoupe, huit cartes de situations.',
    prevision:{consigne:'Avant le classement, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['jauneMieux','Une flamme jaune est meilleure car elle éclaire'],['pareil','Les deux flammes se valent'],['bleueComplete','Flamme bleue : combustion complète ; flamme jaune : combustion incomplète'],['gazCouleur','La couleur dépend seulement du gaz utilisé']]},
    protocole:['Vérifier au brûleur les deux positions de la virole.','Classer les huit situations.','Lire chaque retour et corriger.','Remplir le tableau : couleur, chaleur, dépôt, air.'],
    variable:'La situation à classer',maintenu:'Les mêmes critères',
    colonnes:['Situation','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>['Vérification : virole '+e.v,'Flamme '+e.flamme+(e.depot?', dépôt':', propre'),e.observation||'—']).concat(M().lignesTri(st,'completude',i=>C().SITUATIONS_FLAMME.filter(s=>s.id===i)[0].label,c=>lib(C().COMPLETUDES,c))),
    resume:e=>e.tri?'situation classée : '+lib(C().COMPLETUDES,e.choix).toLowerCase():'vérification virole '+e.v+' : flamme '+e.flamme,
    confrontation:'1. Quels signes vont ensemble pour la combustion complète ? 2. Et pour l’incomplète ? 3. Quel signe est le plus facile à voir chez soi ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux signes de chaque combustion.',
    transfert:{q:'Un groupe électrogène qui rejette une fumée noire a-t-il une combustion complète ?',rep:'non',expl:'Non : la fumée noire est du carbone, signe d’une combustion incomplète. Il faut le faire régler, et toujours le faire tourner dehors.'},
    critere:'Classer les huit situations et remplir le tableau à quatre critères.',
    essaisMin:8,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Juge sur la seule luminosité.'],['MF','Utilise la couleur seulement.'],['MS','Utilise couleur, dépôt et chaleur.'],['TBM','Relie les quatre critères à l’arrivée d’air et au geste à faire.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>!e.tri);return v.length>=2&&C().distincts(v,'v')>=2&&M().triEtat(st,'completude',C().SITUATIONS_FLAMME.map(s=>s.id)).repondus>=8;},
    aides:['Complète : bleue, très chaude, soucoupe propre, virole ouverte.','Incomplète : jaune, moins chaude, dépôt noir, air insuffisant.','La couleur de la flamme se voit tout de suite à la maison.'],
    synthese:'Combustion complète : flamme bleue, très chaude, peu éclairante, aucun dépôt, beaucoup d’air. Combustion incomplète : flamme jaune, moins chaude, éclairante, dépôt de carbone, air insuffisant. À la maison, une flamme jaune est un signal : aérer et faire nettoyer l’appareil.',
    prof:{reference:'Complète : flamme bleue, fond propre, virole ouverte, très chaude. Incomplète : flamme jaune, fond noirci, brûleur encrassé, moins chaude mais éclairante.',attendus:['Deux vérifications au brûleur.','Huit situations classées.','Tableau à quatre critères.'],erreurs:['Préférer la flamme jaune parce qu’elle éclaire.','Croire que la couleur dépend du gaz.','Oublier le critère du dépôt.']},
    diagnostic:st=>st.essais.length?['Indicatif : vérifie les deux positions de la virole.']:['Commence par vérifier la virole ouverte.']
  };
})();
