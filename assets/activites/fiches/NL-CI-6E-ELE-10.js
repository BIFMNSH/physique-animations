/* NohobaLab · 6e Côte d'Ivoire · ELE-10 · Allumage alterné de deux lampes avec un commutateur.
   Modèle qualitatif : le commutateur ferme la boucle de la lampe 1 ou celle de la lampe 2, jamais les deux. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  function manip(panel,X){
    C().bloc(panel,X,{n:10,titre:'Atelier · je bascule le commutateur',
      intro:'Une pile, un commutateur et deux lampes. Je choisis la position du commutateur et j’observe les deux lampes.',
      controles:[{cle:'p',legende:'Le commutateur est en…',items:[['1','Position 1'],['2','Position 2']]}],
      saisie:'J’observe que la lampe 1… et que la lampe 2…',legendeTable:'Mes essais : position du commutateur et état des deux lampes.',
      F:()=>window.FICHE_CI_ELE10,
      render:v=>{const m=C().commut({pos:Number(v.p)}),a=m.etat.L1==='actif';
        return {montage:m.montage,schema:m.schema,txt:'Position '+v.p+' : la lampe '+(a?'1':'2')+' est allumée et la lampe '+(a?'2':'1')+' est éteinte.',essai:{pos:v.p,L1:a,L2:!a}};}});
  }
  window.FICHE_CI_ELE10={
    id:'NL-CI-6E-ELE-10',version:'0.9',modele:'commutateur-deux-lampes-v1',
    titre:'Réaliser l’allumage alterné de deux lampes à l’aide d’un commutateur',niveau:'6e',
    theme:'Électricité',chapitre:'Commande d’un circuit',
    competenceVisee:'Utiliser un commutateur pour allumer l’une ou l’autre de deux lampes.',
    objectifsPedagogiques:['Réaliser le montage avec un commutateur et deux lampes','Prévoir quelle lampe s’allume selon la position du commutateur','Repérer la borne commune du commutateur'],
    situationEvaluation:'Un coffret doit allumer soit le voyant vert, soit le voyant rouge, jamais les deux. Comment un seul commutateur le permet-il ?',
    objectif:'Allumer l’une ou l’autre de deux lampes avec un commutateur.',
    objectifEleve:'Savoir utiliser un commutateur.',
    situation:'Le coffret de Kofi doit allumer le voyant vert ou le voyant rouge, jamais les deux en même temps. Il n’a qu’un seul organe de commande.',
    materiel:'Pile plate fictive de 4,5 V, commutateur, deux lampes, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe pour les deux lampes quand on bascule le commutateur. Justifie ton hypothèse.',choix:[['une','Une seule lampe brille à la fois, et l’autre quand on bascule'],['deux','Les deux lampes brillent dans les deux positions'],['aucune','Aucune lampe ne brille avec un commutateur'],['fixe','La même lampe brille quelle que soit la position']]},
    protocole:['Observer les deux lampes avec le commutateur en position 1.','Basculer le commutateur en position 2 et observer.','Revenir en position 1 pour vérifier.','Noter chaque observation.'],
    variable:'La position du commutateur',maintenu:'Pile, lampes et fils',
    colonnes:['Position','Lampe 1','Lampe 2','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>['Position '+e.pos,e.L1?'Allumée':'Éteinte',e.L2?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>'position '+e.pos+' : lampe 1 '+(e.L1?'allumée':'éteinte')+', lampe 2 '+(e.L2?'allumée':'éteinte'),
    confrontation:'1. Quelle lampe brille en position 1 ? en position 2 ? 2. Les deux lampes brillent-elles un jour ensemble ? 3. Combien de boucles sont fermées dans chaque position ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai pour chaque position avec l’état des deux lampes.',
    transfert:{q:'Avec ce commutateur, les deux lampes peuvent-elles s’allumer en même temps ?',rep:'non',expl:'Non : dans chaque position, le commutateur ferme une seule boucle. L’autre lampe n’est pas dans une boucle fermée.'},
    critere:'Prévoir et expliquer quelle lampe s’allume dans chaque position du commutateur.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas la position du commutateur à une lampe.'],['MF','Décrit les deux positions sans expliquer.'],['MS','Explique qu’une seule boucle est fermée à la fois.'],['TBM','Explique, repère la borne commune et schématise les deux positions.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.pos==='1')&&v.some(e=>e.pos==='2');},
    aides:['Compare les deux positions : quelle lampe change d’état ?','Suis sur le schéma la boucle qui part de la pile.','La borne commune est celle qui reste reliée à la pile quelle que soit la position.'],
    synthese:'Un commutateur dirige le courant vers l’une ou l’autre de deux lampes. Dans chaque position, une seule boucle est fermée : une lampe brille et l’autre est éteinte. Les deux lampes ne s’allument donc pas en même temps.',
    prof:{reference:'Position 1 : la lampe 1 brille, la lampe 2 est éteinte. Position 2 : la lampe 2 brille, la lampe 1 est éteinte. Le symbole du commutateur est à confirmer avec le document de classe.',attendus:['Hypothèse notée avant l’essai.','Les deux positions testées et rédigées.','Explication : une seule boucle fermée à la fois.','Schéma avec la position annotée.'],erreurs:['Croire que les deux lampes brillent en même temps.','Confondre commutateur et interrupteur.','Ne pas repérer la borne commune.']},
    diagnostic:st=>st.essais.some(e=>e.pos==='2')?['Compare la position 2 avec la position 1.']:['Bascule aussi en position 2.']
  };
})();
