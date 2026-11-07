/* NohobaLab · 5e · DIL-01 · Un solide chauffé (boule et anneau).
   Modèle : états de la boule (NohobaDilatation5e.res1). Chauffage réalisé par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaDilatation5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · la boule et l’anneau',idObs:'e-obs',placeholder:'J’observe que la boule…',
      intro:'Je choisis l’état de la boule et j’essaie de la passer dans l’anneau. Le chauffage est réalisé par le professeur : ici, je l’observe en simulation.',
      fiche:()=>window.FICHE_5E_DIL01,
      groupes:[{legende:'État de la boule',nom:'e-e',items:N.ETATS,def:'froide'}],
      rendre:v=>{const r=N.res1(v['e-e']);return {montage:N.montage1(r.e),schema:N.schema1(r.e),lecture:r.etat+' : '+r.txt,essai:{e:r.e,passe:r.passe}};}});
  }
  window.FICHE_5E_DIL01={
    id:'NL-5E-DIL-01',version:'0.9',modele:'solide-chauffe-v1',
    titre:'Que devient un solide quand on le chauffe ?',niveau:'5e',
    theme:'Propriétés physiques de la matière',chapitre:'La dilatation des solides',
    competenceVisee:'Relier la variation de température à la variation de dimension d’un solide.',
    objectifsPedagogiques:['Comparer la boule froide, chauffée et refroidie','Constater le passage ou le blocage dans l’anneau','Conclure : un solide chauffé se dilate, refroidi il se contracte'],
    situationEvaluation:'Sur la voie ferrée d’Abidjan, des joints sont laissés entre les rails. Pourquoi ? Justifie avec tes essais.',
    objectif:'Relier température et dimension d’un solide.',
    objectifEleve:'Savoir ce que devient un solide chauffé ou refroidi.',
    situation:'Au laboratoire, Kofi fait passer une boule métallique dans un anneau : elle passe tout juste. Le professeur chauffe la boule, et Kofi n’arrive plus à la passer. Awa se demande ce qui a changé.',
    materiel:'Boule métallique, anneau, support, brûleur (manipulé par le professeur), simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la boule chauffée. Justifie ton hypothèse avec « car ».',choix:[
      ['grossit','La boule chauffée grossit, donc elle ne passe plus'],['identique','La boule garde exactement la même taille'],['rétrécit','La boule chauffée rétrécit'],['anneau','Seul l’anneau change']]},
    protocole:['Essayer la boule à la température ambiante dans l’anneau.','Le professeur chauffe la boule : l’essayer à nouveau.','Laisser refroidir la boule : l’essayer encore.','Noter une observation après chaque essai.'],
    variable:'L’état de la boule (ambiante, chauffée, refroidie)',maintenu:'La boule et l’anneau',
    colonnes:['État de la boule','Passe dans l’anneau','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[M().res1(e.e).etat,e.passe?'oui':'non',e.observation||'—']),
    resume:e=>M().res1(e.e).etat+' : '+(e.passe?'passe':'reste bloquée'),
    confrontation:'1. Dans quel état la boule passe-t-elle ? 2. Que se passe-t-il quand elle est chauffée ? 3. Que se passe-t-il quand elle refroidit ? Compare à ton hypothèse.',
    retroaction:'Cite un état de la boule et dis si elle passe, en expliquant la taille.',
    transfert:{q:'Entre deux rails, on laisse un petit espace (joint de dilatation). Pourquoi ?',rep:'dilate',options:[['dilate','Les rails chauffés par le soleil se dilatent et ont besoin de place'],['decor','C’est seulement décoratif'],['contract','Les rails rétrécissent quand il fait chaud'],['bruit','Pour mesurer la température']],expl:'Un solide chauffé se dilate : les rails s’allongent au soleil. Sans espace, ils se tordraient.'},
    critere:'Tester les trois états de la boule et conclure : un solide chauffé se dilate, refroidi il se contracte.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas les états de la boule.'],['MF','Décrit le blocage sans l’expliquer.'],['MS','Conclut qu’un solide chauffé se dilate et que refroidi il se contracte.'],['TBM','Conclut, justifie avec la taille de la boule et applique aux rails.']],
    peutConfronter:st=>{const v=E().valides(st);return ['froide','chauffee','refroidie'].every(e=>v.some(x=>x.e===e));},
    aides:['Compare la taille de la boule à l’ouverture de l’anneau.','Une boule chauffée est-elle plus grosse ou plus petite ?','As-tu testé la boule froide, chauffée et refroidie ?'],
    synthese:'Un solide chauffé se dilate : ses dimensions augmentent. Refroidi, il se contracte et reprend sa taille. On en tient compte dans les constructions : les rails, les ponts, les fils électriques laissent du jeu avec des joints de dilatation.',
    prof:{reference:'Boule ambiante : passe tout juste. Chauffée : plus grosse, bloquée. Refroidie : repasse. Chauffage réalisé par le professeur uniquement ; aucune valeur chiffrée.',attendus:['Hypothèse notée avant les essais.','Les trois états testés avec observation.','Phrase : un solide chauffé se dilate, refroidi il se contracte.'],erreurs:['Croire que la boule fond ou change de matière.','Penser que l’anneau seul change.','Oublier la contraction au refroidissement.']},
    diagnostic:st=>E().valides(st).some(e=>e.e==='chauffee')?['Compare la boule chauffée à l’ouverture de l’anneau.']:['Teste la boule chauffée.']
  };
})();
