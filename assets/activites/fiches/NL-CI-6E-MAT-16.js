/* NohobaLab · 6e Côte d'Ivoire · MAT-16 · Décrire le thermomètre médical à liquide.
   Décision du 25 octobre 2026 : échelle de la simulation 35 °C à 42 °C, graduation 0,1 °C. Pas de conseil médical. Hygiène : nettoyer avant de partager. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const ET=[['utilise','Il vient de servir (le liquide est resté en haut)'],['neuf','Il est prêt (liquide en bas)']];
  const AC=[['lire','Je le lis tel quel'],['secouer','Je le secoue, puis je le lis']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:16,titre:'Atelier · le thermomètre médical et celui du laboratoire',
      intro:'Je compare les deux thermomètres et je teste le secouage. Échelle médicale de la simulation : 35 °C à 42 °C, un trait = 0,1 °C. Valeurs simulées, aucun conseil médical.',
      controles:[{cle:'e',legende:'L’état du thermomètre médical',items:ET},{cle:'a',legende:'Ce que je fais',items:AC}],
      saisie:'J’observe que le liquide… et que l’échelle…',legendeTable:'Mes essais : état, action et valeur (simulée).',F:()=>window.FICHE_CI_MAT16,
      render:v=>{const r=M().medical(v.e,v.a),sc=M().scene.medical({etat:v.e,action:v.a});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{etat:v.e,action:v.a,valeur:r.valeur,pret:r.pret}};}});
  }
  window.FICHE_CI_MAT16={
    id:'NL-CI-6E-MAT-16',version:'0.9',modele:'thermometre-medical-v1',
    titre:'Décrire le thermomètre médical à liquide',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Décrire un thermomètre médical et expliquer comment l’utiliser.',
    objectifsPedagogiques:['Nommer les parties du thermomètre médical','Dire pourquoi on le secoue avant l’emploi','Lire sa graduation, resserrée autour de 37 °C'],
    situationEvaluation:'Un thermomètre médical affiche 38,4 °C avant d’être placé sous le bras. Que faut-il faire ? Explique pourquoi.',
    objectif:'Décrire et utiliser le thermomètre médical.',objectifEleve:'Savoir lire et préparer un thermomètre médical.',
    situation:'Comment le thermomètre médical diffère-t-il de celui du laboratoire ? Awa et Kofi les comparent côte à côte.',
    materiel:'Simulation : un thermomètre de laboratoire et un thermomètre médical (35 °C à 42 °C, 0,1 °C par trait).',
    prevision:{consigne:'Avant les essais, choisis ce qu’il faut faire du thermomètre médical qui vient de servir, avant le suivant. Justifie ton hypothèse.',choix:[['secouer','Le secouer pour faire redescendre le liquide'],['lire','Le lire tel quel'],['chauffer','Le chauffer pour le sécher'],['rien','Rien : il se remet seul à zéro']]},
    protocole:['Comparer les deux échelles.','Lire le thermomètre médical qui vient de servir.','Le secouer, puis relire.','Noter ce qui change.'],
    variable:'L’état du thermomètre et l’action',maintenu:'Le même thermomètre médical',
    colonnes:['État du thermomètre','Action','Valeur (simulée)','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[e.etat==='utilise'?'Déjà utilisé':'Prêt',lib(AC,e.action),String(e.valeur).replace('.',',')+' °C',e.observation||'—']),
    resume:e=>(e.etat==='utilise'?'déjà utilisé':'prêt')+', '+lib(AC,e.action).toLowerCase()+' : '+String(e.valeur).replace('.',',')+' °C',
    confrontation:'1. Que se passe-t-il au liquide après usage ? 2. Que fait le secouage ? 3. En quoi l’échelle diffère-t-elle de celle du laboratoire ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux essais avec les valeurs lues.',
    transfert:{q:'Faut-il secouer un thermomètre médical avant de s’en servir ?',rep:'oui',expl:'Oui : le liquide reste en place après usage ; on le fait redescendre pour mesurer la nouvelle température.'},
    critere:'Décrire l’échelle et expliquer le secouage.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un seul thermomètre.'],['MF','Compare sans expliquer le secouage.'],['MS','Compare les échelles et explique le secouage.'],['TBM','Explique, lit au dixième et nomme les précautions d’hygiène.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.action==='lire'&&e.etat==='utilise')&&v.some(e=>e.action==='secouer');},
    aides:['Compare l’étendue des deux échelles.','Que reste-t-il dans le tube après usage ?','Un trait vaut 0,1 °C : on lit au dixième.'],
    synthese:'Le thermomètre médical a une échelle resserrée (35 °C à 42 °C), graduée au dixième de degré. Le liquide reste en place après usage : il faut le secouer avant de s’en servir. On le nettoie avant de le partager.',
    prof:{reference:'Échelle 35–42 °C au dixième ; liquide bloqué après usage ; secouer avant emploi ; nettoyage.',attendus:['Comparer les échelles.','Expliquer le secouage.','Lire une valeur au dixième.'],erreurs:['Lire sans secouer.','Partager sans nettoyer.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais une lecture avant et après secouage.']:['Fais un premier essai.']
  };
})();
