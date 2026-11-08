/* NohobaLab · 6e Côte d'Ivoire · CHI-09 · Distinguer une réaction chimique d'une transformation physique.
   Modèle qualitatif : sept situations ; deux critères (nouveau corps ? retour possible ?). La bougie : la cire fond (physique) puis brûle (chimique). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:9,titre:'Deux bancs · fondre ou brûler ?',
      intro:'Je choisis une situation et je regarde : un nouveau corps apparaît-il ? Peut-on revenir en arrière ? Les flammes sont allumées par le professeur ; simulation seulement.',
      controles:[{cle:'s',legende:'La situation',items:C().TRANSFOS.map(t=>[t.id,t.nom])}],
      saisie:'J’observe que…',legendeTable:'Mes essais : situation, nouveau corps, retour.',F:()=>window.FICHE_CI_CHI09,
      render:v=>{const r=C().transformation(v.s),sc=C().sceneTransformation(v.s);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{s:v.s,nouveau:r.nouveau,retour:r.retour,type:r.type}};}});
    const items=C().TRANSFOS.map(t=>({id:t.id,label:t.nom,juste:t.type,pourquoi:t.pourquoi,aide:'Pose deux questions : y a-t-il un nouveau corps ? peut-on revenir en arrière ?'}));
    M().tri(panel,X,{id:'types',titre:'Je classe · physique ou chimique',intro:'Pour chaque situation, je dis s’il s’agit d’une transformation physique ou d’une réaction chimique.',legende:'C’est une',cats:C().TYPES,items});
  }
  window.FICHE_CI_CHI09={
    id:'NL-CI-6E-CHI-09',version:'0.9',modele:'physique-chimique-v1',
    titre:'Fondre ou brûler ?',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Distinguer une réaction chimique d’une transformation physique.',
    objectifsPedagogiques:['Reconnaître une transformation physique : le corps reste le même, le retour est possible','Reconnaître une réaction chimique : de nouveaux corps apparaissent','Appliquer les deux critères à la bougie'],
    situationEvaluation:'Awa fait fondre du beurre de karité, puis le laisse refroidir ; Kofi fait brûler du charbon. Dis pour chacun s’il s’agit d’une transformation physique ou d’une réaction chimique, en donnant la preuve.',
    objectif:'Distinguer transformation physique et réaction chimique.',objectifEleve:'Savoir reconnaître si un corps change seulement d’état ou s’il se transforme en d’autres corps.',
    situation:'Awa fait fondre du beurre de karité dans une casserole et fait brûler du charbon dessous. « Les deux changent », dit-elle. Est-ce la même chose ? Le professeur installe deux bancs côte à côte.',
    materiel:'Simulation : glace, eau qui bout, beurre de karité, charbon, alcool, bougie ; eau de chaux pour les tests (professeur).',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['tout','Tout changement est une réaction chimique'],['fondreNouveau','Fondre forme de nouveaux corps'],['deux','Fondre garde le même corps ; brûler forme de nouveaux corps'],['brulerMeme','Brûler garde le même corps']]},
    protocole:['Observer les situations de fusion et d’ébullition : le corps change-t-il ? revient-il ?','Observer les combustions : test à l’eau de chaux, retour possible ?','Observer la bougie : la cire qui fond, puis la cire qui brûle.','Classer les sept situations.'],
    variable:'La situation observée',maintenu:'Les deux mêmes questions (nouveau corps ? retour ?)',
    colonnes:['Situation','Nouveau corps ?','Retour possible ?','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[C().TRANSFOS.filter(t=>t.id===e.s)[0].nom,e.nouveau?'Oui':'Non',e.retour?'Oui':'Non',e.observation||'—']).concat(M().lignesTri(st,'types',i=>C().TRANSFOS.filter(t=>t.id===i)[0].nom,c=>lib(C().TYPES,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?'situation classée : '+lib(C().TYPES,e.choix).toLowerCase():C().TRANSFOS.filter(t=>t.id===e.s)[0].nom.toLowerCase()+' : '+(e.nouveau?'nouveau corps':'même corps'),
    confrontation:'1. Dans quelles situations le corps reste-t-il le même ? Comment le sais-tu ? 2. Dans lesquelles de nouveaux corps apparaissent-ils ? Quelle preuve ? 3. Que se passe-t-il dans la bougie ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une transformation physique et une réaction chimique, avec la preuve pour chacune.',
    transfert:{q:'L’eau d’une casserole qui bout et s’échappe en vapeur a-t-elle subi une réaction chimique ?',rep:'non',expl:'Non : la vapeur est toujours de l’eau ; elle redevient liquide sur un couvercle froid. C’est une transformation physique (changement d’état).'},
    critere:'Classer les sept situations avec les deux critères, bougie comprise.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Appelle « réaction chimique » tout changement.'],['MF','Distingue fondre et brûler sans donner de critère.'],['MS','Utilise les deux critères sur les situations simples.'],['TBM','Explique le double cas de la bougie.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>!e.tri);return v.length>=4&&v.some(e=>e.type==='physique')&&v.some(e=>e.type==='chimique')&&M().triEtat(st,'types',C().TRANSFOS.map(t=>t.id)).repondus>=7;},
    aides:['Transformation physique : même corps, retour possible (glace ↔ eau).','Réaction chimique : nouveaux corps (eau de chaux troublée), pas de retour.','Bougie : la cire fond (physique), la cire fondue brûle (chimique).'],
    synthese:'Dans une transformation physique, le corps change d’état ou de forme mais reste le même, et on peut revenir en arrière : la glace fond, l’eau bout, le beurre de karité fond. Dans une réaction chimique, des corps disparaissent et de nouveaux corps apparaissent, sans retour : le charbon ou l’alcool brûlent. Dans une bougie, la cire fond (physique) puis brûle (chimique).',
    prof:{reference:'Physiques : fusion de la glace, ébullition de l’eau, fusion du karité, cire qui fond. Chimiques : combustion du charbon, de l’alcool, de la cire fondue. Critères : nouveau corps (preuve : eau de chaux, buée) et retour possible.',attendus:['Quatre essais couvrant les deux types.','Sept situations classées.','Deux critères énoncés.'],erreurs:['Croire que fondre crée un nouveau corps.','Croire que la vapeur n’est plus de l’eau.','Classer toute la bougie en « chimique ».']},
    diagnostic:st=>st.essais.length?['Indicatif : observe les deux situations de la bougie.']:['Commence par la glace qui fond.']
  };
})();
