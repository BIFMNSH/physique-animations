/* NohobaLab · 6e Côte d'Ivoire · MAT-30 · Plastiques : flotte ou coule (parcours « Matériaux, tri et déchets »).
   Vocabulaire : « plus léger / plus lourd que l'eau » (à volume égal), rien de plus. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const PL=()=>M().PLASTIQUES.map(p=>[p.id,p.nom]);
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:30,titre:'Atelier · flotte ou coule ?',
      intro:'Je dépose un morceau de plastique dans un bac d’eau et j’observe. Simulation.',
      controles:[{cle:'p',legende:'Le morceau testé',items:PL()}],
      saisie:'J’observe que le morceau…',legendeTable:'Mes essais : morceau et comportement dans l’eau.',F:()=>window.FICHE_CI_MAT30,
      render:v=>{const r=M().flotte(v.p),sc=M().scene.flotte({id:v.p});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{id:v.p,flotte:r.flotte}};}});
  }
  window.FICHE_CI_MAT30={
    id:'NL-CI-6E-MAT-30',version:'0.9',modele:'plastiques-flotte-v1',
    titre:'Comparer des plastiques : flottent-ils ou coulent-ils ?',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Tester si un plastique flotte ou coule dans l’eau.',
    objectifsPedagogiques:['Dire qu’un plastique peut flotter ou couler','Employer « plus léger que l’eau » et « plus lourd que l’eau »','Comprendre que cela permet de trier des plastiques'],
    situationEvaluation:'Dans un seau d’eau, un bouchon flotte et un morceau de bouteille coule. Que peux-tu dire de chaque plastique par rapport à l’eau ? Comment utiliser cela pour trier ?',
    objectif:'Tester si des plastiques flottent ou coulent.',objectifEleve:'Savoir si un plastique flotte ou coule.',
    situation:'Tous les plastiques sont-ils pareils dans l’eau ? Kofi teste cinq morceaux de plastique dans un bac d’eau.',
    materiel:'Simulation : bac d’eau et cinq morceaux de plastique.',
    prevision:{consigne:'Avant les essais, choisis ce que tu attends pour un bouchon de bouteille. Justifie ton hypothèse.',choix:[['flotte','Il flotte'],['coule','Il coule'],['depend','Ça dépend du jour'],['fond','Il fond']]},
    protocole:['Choisir un morceau.','Le déposer dans l’eau.','Noter s’il flotte ou coule.','Tester les cinq morceaux.'],
    variable:'Le morceau de plastique',maintenu:'Le même bac d’eau',
    colonnes:['Morceau','Comportement','Comparaison avec l’eau','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[lib(PL(),e.id),e.flotte?'Flotte':'Coule',e.flotte?'Plus léger que l’eau':'Plus lourd que l’eau',e.observation||'—']),
    resume:e=>lib(PL(),e.id).toLowerCase()+' : '+(e.flotte?'flotte':'coule'),
    confrontation:'1. Quels morceaux flottent ? 2. Lesquels coulent ? 3. Que peut-on faire de cette différence au centre de tri ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un morceau qui flotte et un qui coule.',
    transfert:{q:'Un morceau qui coule est-il plus lourd ou plus léger que l’eau (à volume égal) ?',rep:'lourd',type:'choix',options:[['lourd','Plus lourd que l’eau'],['leger','Plus léger que l’eau'],['egal','Aussi lourd que l’eau'],['sais','On ne peut pas savoir']],expl:'Un morceau qui coule est plus lourd que le même volume d’eau.'},
    critere:'Classer les plastiques en flotte ou coule avec deux essais cités.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Teste sans conclure.'],['MF','Conclut sans le vocabulaire.'],['MS','Conclut avec « plus léger / plus lourd que l’eau ».'],['TBM','Conclut et relie au tri des plastiques.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&v.some(e=>e.flotte)&&v.some(e=>!e.flotte)&&M().distincts(v,'id')>=4;},
    aides:['Teste au moins quatre morceaux.','Compare un morceau qui flotte et un qui coule.','Flotte : plus léger que l’eau. Coule : plus lourd.'],
    synthese:'Certains plastiques flottent (plus légers que l’eau), d’autres coulent (plus lourds que l’eau). On peut donc les séparer dans un bac d’eau.',
    prof:{reference:'Bouchon, sachet, mousse flottent ; morceau de bouteille et tuyau rigide coulent ; vocabulaire « plus léger / plus lourd que l’eau ».',attendus:['Quatre essais.','Vocabulaire correct.','Relier au tri.'],erreurs:['Employer un vocabulaire hors programme de 6e.','Dire que tous les plastiques flottent.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste un morceau qui flotte et un qui coule.']:['Fais un premier essai.']
  };
})();
