/* NohobaLab · 6e Côte d'Ivoire · MAT-23 · Conservation de la masse au cours de la fusion.
   Valeurs de masse = illustrations simulées (50 g). Récipient couvert pour éviter buée et évaporation. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const ET=[['glace','Glace, avant la fusion'],['eau','Eau, après la fusion']];
  const CV=[['oui','Récipient couvert'],['non','Récipient resté ouvert']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:23,titre:'Atelier · je pèse avant et après la fusion',
      intro:'Je pèse le récipient avec la glace, puis avec l’eau, couvert ou ouvert. Les masses sont simulées : la balance sert à comparer.',
      controles:[{cle:'e',legende:'Ce que je pèse',items:ET},{cle:'c',legende:'Le récipient',items:CV}],
      saisie:'J’observe que la balance indique…',legendeTable:'Mes pesées : état, récipient et masse (simulée).',F:()=>window.FICHE_CI_MAT23,
      render:v=>{const r=M().masse(v.e,v.c==='oui'),sc=M().scene.masse({etat:v.e,couvert:v.c==='oui'});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{etat:v.e,couvert:v.c==='oui',m:r.m}};}});
  }
  window.FICHE_CI_MAT23={
    id:'NL-CI-6E-MAT-23',version:'0.9',modele:'masse-fusion-v1',
    titre:'Montrer la conservation de la masse au cours de la fusion',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Comparer la masse avant et après la fusion.',
    objectifsPedagogiques:['Dire que la masse se conserve quand la glace fond','Dire que le volume change alors que la masse reste la même','Expliquer pourquoi on couvre le récipient'],
    situationEvaluation:'Awa pèse un récipient avec de la glace : 50 g. La glace fond. Que doit indiquer la balance pour le récipient couvert ? Pourquoi couvre-t-on le récipient ?',
    objectif:'Comparer la masse avant et après la fusion.',objectifEleve:'Savoir si la masse change quand la glace fond.',
    situation:'La glace fondue pèse-t-elle autant que la glace ? Kofi pèse le récipient avant et après la fusion.',
    materiel:'Simulation : balance, récipient avec couvercle, glace.',
    prevision:{consigne:'Avant les pesées, choisis ce que doit indiquer la balance après la fusion (récipient couvert). Justifie ton hypothèse.',choix:[['autant','Autant qu’avant'],['moins','Moins qu’avant'],['plus','Plus qu’avant'],['zero','Zéro']]},
    protocole:['Peser le récipient couvert avec la glace (m1).','Attendre la fusion complète.','Peser le même récipient couvert (m2).','Refaire avec le récipient ouvert et comparer.'],
    variable:'Récipient couvert ou ouvert',maintenu:'La même glace et la même balance',
    colonnes:['Ce que je pèse','Récipient','Masse (simulée)','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lib(ET,e.etat),e.etat==='glace'?'Couvert':(e.couvert?'Couvert':'Ouvert'),e.m+' g',e.observation||'—']),
    resume:e=>lib(ET,e.etat).toLowerCase()+(e.etat==='eau'?(e.couvert?' (couvert)':' (ouvert)'):'')+' : '+e.m+' g',
    confrontation:'1. Que vaut m2 par rapport à m1 si le récipient est couvert ? 2. Et s’il est resté ouvert ? 3. Pourquoi ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite m1 et m2 avec leurs valeurs.',
    transfert:{q:'La masse de l’eau change-t-elle quand la glace fond dans un récipient couvert ?',rep:'non',expl:'Non : la masse se conserve, même si le volume change.'},
    critere:'Énoncer la conservation de la masse avec deux pesées et expliquer le couvercle.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Donne une masse sans comparer.'],['MF','Compare sans expliquer le couvercle.'],['MS','Énonce la conservation.'],['TBM','Énonce, explique le couvercle et relie au volume.']],
    peutConfronter:st=>{const v=M().valides(st);return v.some(e=>e.etat==='glace')&&v.some(e=>e.etat==='eau'&&e.couvert)&&v.some(e=>e.etat==='eau'&&!e.couvert);},
    aides:['Compare m1 et m2 pour le récipient couvert.','Pourquoi la balance baisse-t-elle quand le récipient est ouvert ?','Le volume change, pas la masse.'],
    synthese:'Quand la glace fond, la masse se conserve (m1 = m2) si le récipient est couvert, alors que le volume change. Un récipient ouvert perd un peu d’eau par évaporation : la pesée est faussée.',
    prof:{reference:'m1 = m2 en récipient couvert ; masse qui baisse si ouvert (évaporation, buée) ; valeurs simulées.',attendus:['Trois pesées.','Énoncer la conservation.','Expliquer le couvercle.'],erreurs:['Dire que l’eau est plus lourde ou plus légère.','Oublier le couvercle.']},
    diagnostic:st=>st.essais.length?['Indicatif : pèse la glace, l’eau couverte et l’eau ouverte.']:['Fais une première pesée.']
  };
})();
