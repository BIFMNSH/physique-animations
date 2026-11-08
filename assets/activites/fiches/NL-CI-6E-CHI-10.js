/* NohobaLab · 6e Côte d'Ivoire · CHI-10 · Réaliser la combustion complète du butane.
   Modèle qualitatif : brûleur à butane allumé par le professeur, virole ouverte : flamme bleue, très chaude, soucoupe propre. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:10,titre:'Atelier · la flamme bleue du brûleur',
      intro:'Le professeur ouvre le robinet du brûleur à butane et l’allume, virole ouverte. Je choisis l’étape, je regarde la flamme, la chaleur simulée et la soucoupe, puis j’écris ce que je vois. Je ne touche ni au gaz ni à la flamme.',
      controles:[{cle:'e',legende:'L’étape',items:C().ETAPES_BUTANE}],
      saisie:'J’observe que la flamme… que la soucoupe…',legendeTable:'Mes essais : étape, flamme, soucoupe.',F:()=>window.FICHE_CI_CHI10,
      render:v=>{const sc=C().sceneEtapeButane(v.e),b=v.e==='eteint'?null:C().butane('ouverte');return {montage:sc.montage,schema:sc.schema,txt:b?b.txt:'Robinet fermé : pas de flamme, pas de chaleur.',essai:{e:v.e,flamme:b?b.flamme:'aucune',depot:b?b.depot:false,chaleur:b?b.chaleur:'aucune'}};}});
  }
  window.FICHE_CI_CHI10={
    id:'NL-CI-6E-CHI-10',version:'0.9',modele:'butane-complete-v1',
    titre:'La flamme bleue',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un gaz dans l’air',
    competenceVisee:'Réaliser la combustion complète du butane et la décrire.',
    objectifsPedagogiques:['Décrire la flamme d’une combustion complète : bleue, cône net, peu éclairante, très chaude','Constater l’absence de dépôt sur une soucoupe','Relier la combustion complète à une bonne arrivée d’air (virole ouverte)'],
    situationEvaluation:'À la cantine, la cuisinière veut que l’eau bouille vite et que les casseroles restent propres. Quelle flamme doit-elle obtenir, et comment la reconnaît-elle ?',
    objectif:'Réaliser et décrire la combustion complète du butane.',objectifEleve:'Savoir reconnaître la flamme d’une combustion complète.',
    situation:'À la cantine du collège d’Adjamé, Awa remarque que, quand la flamme de la gazinière est bleue, le fond des casseroles reste propre. Que se passe-t-il quand le butane brûle « bien » ? Le professeur allume le brûleur du laboratoire.',
    materiel:'Simulation : brûleur à butane (cartouche, tube, virole), allumettes (professeur), soucoupe blanche, thermomètre simulé.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand le butane brûle avec beaucoup d’air. Justifie ton hypothèse.',choix:[['sansAir','Le butane brûle sans air'],['bleue','Le butane brûle avec le gaz oxygène de l’air : flamme bleue, chaude, sans dépôt'],['explose','Le butane ne brûle pas, il explose toujours'],['froide','La flamme bleue est froide']]},
    protocole:['Observer le brûleur robinet fermé.','Le professeur ouvre le robinet et allume, virole ouverte : observer la flamme et le thermomètre simulé.','Le professeur passe une soucoupe blanche au-dessus de la flamme : observer.','Noter couleur, chaleur, dépôt.'],
    variable:'L’étape du protocole',maintenu:'Le même brûleur, virole ouverte',
    colonnes:['Étape','Flamme','Soucoupe','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lib(C().ETAPES_BUTANE,e.e),e.flamme==='aucune'?'Aucune':'Bleue, très chaude',e.e==='soucoupe'?(e.depot?'Dépôt noir':'Propre'):'—',e.observation||'—']),
    resume:e=>lib(C().ETAPES_BUTANE,e.e).toLowerCase()+' : flamme '+e.flamme,
    confrontation:'1. Quelle est la couleur de la flamme ? Est-elle très éclairante ? 2. Que montre le thermomètre simulé ? 3. Que trouve-t-on sur la soucoupe ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite la couleur de la flamme, la chaleur et l’état de la soucoupe.',
    transfert:{q:'Une flamme bleue et peu éclairante chauffe-t-elle moins qu’une flamme jaune bien visible ?',rep:'non',expl:'Non : la flamme bleue de la combustion complète est la plus chaude, même si elle éclaire peu. C’est celle qu’on cherche pour cuisiner.'},
    critere:'Décrire la combustion complète du butane : flamme bleue, très chaude, sans dépôt, avec beaucoup d’air.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense que le butane brûle sans air ou que la flamme bleue est froide.'],['MF','Décrit la couleur sans la chaleur ni la soucoupe.'],['MS','Décrit flamme, chaleur et soucoupe propre.'],['TBM','Relie la combustion complète à l’arrivée d’air par la virole.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.e==='eteint')&&v.some(e=>e.e==='soucoupe');},
    aides:['Regarde la virole : ouverte, elle laisse entrer beaucoup d’air.','La chaleur simulée est la plus forte avec la flamme bleue.','La soucoupe propre : rien ne s’est déposé.'],
    synthese:'Avec assez d’air (virole ouverte), le butane brûle complètement : la flamme est bleue, à cône net, peu éclairante et très chaude. Une soucoupe blanche passée au-dessus reste propre. C’est la combustion complète.',
    prof:{reference:'Robinet fermé : rien. Allumé, virole ouverte : flamme bleue, très chaude, peu éclairante. Soucoupe : propre. Conclusion : combustion complète grâce à une bonne arrivée d’air.',attendus:['Trois étapes observées.','Flamme bleue et chaleur reliées.','Soucoupe propre notée.'],erreurs:['Croire que la flamme bleue est froide.','Croire que le butane brûle sans air.','Confondre virole et robinet.']},
    diagnostic:st=>st.essais.length?['Indicatif : termine par la soucoupe.']:['Commence par le brûleur éteint.']
  };
})();
