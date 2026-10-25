/* NohobaLab · 6e Côte d'Ivoire · MAT-15 · Repérer la température de la glace fondante et de l'eau bouillante.
   « Environ 100 °C » au niveau de la mer. Eau bouillante : simulation, ou démonstration du professeur seul (bec éloigné des élèves, trépied stable). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const MIL=[['glace','De l’eau avec de la glace qui fond'],['bouillante','De l’eau qui bout (démonstration du professeur)']];
  const MOM=[['debut','Juste après avoir plongé le thermomètre'],['stable','Quand la colonne ne bouge plus'],['longtemps','Encore un peu plus tard']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:15,titre:'Atelier · deux températures de référence',
      intro:'Simulation : je plonge le thermomètre dans l’eau glacée avec de la glace ou dans l’eau qui bout, puis je lis à trois moments. L’eau qui bout est manipulée par le professeur seul.',
      controles:[{cle:'m',legende:'Le thermomètre est dans',items:MIL},{cle:'t',legende:'Le moment',items:MOM}],
      saisie:'J’observe que la valeur… pendant le changement d’état.',legendeTable:'Mes essais : milieu, moment et valeur (simulée).',F:()=>window.FICHE_CI_MAT15,
      render:v=>{const r=M().reperes(v.m,v.t),sc=M().scene.reperes({milieu:v.m,moment:v.t});return {montage:sc.montage,schema:sc.schema,txt:r.txt+' Valeur : '+r.valeur+' °C (simulée).',essai:{milieu:v.m,moment:v.t,valeur:r.valeur,palier:r.palier}};}});
  }
  window.FICHE_CI_MAT15={
    id:'NL-CI-6E-MAT-15',version:'0.9',modele:'reperes-0-100-v1',
    titre:'Repérer la température de la glace fondante et de l’eau bouillante',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Repérer deux températures de référence avec un thermomètre.',
    objectifsPedagogiques:['Donner la température de la glace fondante : 0 °C','Donner la température de l’eau qui bout : environ 100 °C','Dire que la valeur ne bouge plus pendant le changement d’état'],
    situationEvaluation:'Awa dit que l’eau bout toujours à exactement 100 °C, partout dans le monde. Que réponds-tu ? Cite les deux repères de la leçon.',
    objectif:'Repérer 0 °C et environ 100 °C.',objectifEleve:'Savoir donner deux températures de référence.',
    situation:'Existe-t-il des températures qu’on retrouve toujours ? Le professeur plonge un thermomètre dans de l’eau avec de la glace qui fond, puis dans de l’eau qui bout.',
    materiel:'Simulation : eau avec glace qui fond, eau qui bout, thermomètre de laboratoire.',
    prevision:{consigne:'Avant les essais, choisis les deux valeurs que tu attends pour la glace fondante et l’eau qui bout. Justifie ton hypothèse.',choix:[['0100','0 °C pour la glace fondante et environ 100 °C pour l’eau qui bout'],['1050','10 °C et 50 °C'],['2037','20 °C et 37 °C'],['varie','Les valeurs changent tout le temps']]},
    protocole:['Plonger le thermomètre dans l’eau avec glace, lire juste après, puis quand la colonne est stable.','Attendre un peu et relire.','Faire de même avec l’eau qui bout (professeur).','Comparer.'],
    variable:'Le milieu, puis le moment',maintenu:'Le même thermomètre',
    colonnes:['Milieu','Moment','Valeur (simulée)','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[e.milieu==='glace'?'Glace qui fond':'Eau qui bout',lib(MOM,e.moment).split(' ').slice(0,3).join(' ')+'…',e.valeur+' °C',e.observation||'—']),
    resume:e=>(e.milieu==='glace'?'glace fondante':'eau qui bout')+' ('+(e.moment==='debut'?'au début':'stable')+') : '+e.valeur+' °C',
    confrontation:'1. Quelle est la valeur avec la glace qui fond ? 2. Et avec l’eau qui bout ? 3. Que fait la valeur quand l’eau change d’état ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite la valeur stable pour chaque milieu.',
    transfert:{q:'La température de la glace qui fond est-elle 0 °C ?',rep:'oui',expl:'Oui : tant qu’il reste de la glace qui fond, la température reste à 0 °C.'},
    critere:'Donner 0 °C et environ 100 °C et dire que la valeur ne bouge plus.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Donne une valeur sans milieu.'],['MF','Donne les deux valeurs sans palier.'],['MS','Donne 0 °C et environ 100 °C et le palier.'],['TBM','Donne, explique le palier et nuance « environ 100 °C ».']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.milieu==='glace'&&e.palier)&&v.some(e=>e.milieu==='bouillante'&&e.palier);},
    aides:['Attends que la colonne ne bouge plus.','Compare la lecture immédiate et la lecture stable.','Pendant un changement d’état, la valeur reste constante.'],
    synthese:'La glace qui fond est à 0 °C ; l’eau qui bout est à environ 100 °C (au niveau de la mer). Pendant le changement d’état, la température ne bouge plus.',
    prof:{reference:'0 °C pour la glace fondante ; environ 100 °C pour l’eau qui bout au niveau de la mer ; palier pendant le changement d’état.',attendus:['Observer 0 °C stable avec glace.','Observer environ 100 °C stable avec eau qui bout.','Écrire « environ » pour 100 °C.'],erreurs:['Affirmer 100 °C partout.','Laisser le thermomètre toucher le fond.']},
    diagnostic:st=>st.essais.length?['Indicatif : lis chaque milieu juste après et quand c’est stable.']:['Fais un premier essai.']
  };
})();
