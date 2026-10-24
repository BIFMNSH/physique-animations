/* NohobaLab · 6e Côte d'Ivoire · ELE-11 · Montage va-et-vient (deux commutateurs, une lampe), très basse tension 4,5 V.
   Modèle qualitatif : la lampe brille si les deux commutateurs sont dans la même position ; changer un commutateur inverse son état. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  function manip(panel,X){
    C().bloc(panel,X,{n:11,titre:'Atelier · je change un commutateur à la fois',
      intro:'Une pile, une lampe et deux commutateurs reliés par deux fils. Je choisis la position de chaque commutateur et j’observe la lampe. Je construis moi-même le tableau des quatre combinaisons.',
      controles:[{cle:'a',legende:'Commutateur 1',items:[['1','Position 1'],['2','Position 2']]},{cle:'b',legende:'Commutateur 2',items:[['1','Position 1'],['2','Position 2']]}],
      saisie:'J’observe que la lampe… quand le commutateur 1 est en… et le commutateur 2 en…',legendeTable:'Mes combinaisons : positions des commutateurs et état de la lampe.',
      F:()=>window.FICHE_CI_ELE11,
      render:v=>{const m=C().vaetvient({p1:Number(v.a),p2:Number(v.b)}),on=m.etat.lampe==='actif';
        return {montage:m.montage,schema:m.schema,txt:'Commutateur 1 en position '+v.a+', commutateur 2 en position '+v.b+' : la lampe est '+(on?'allumée':'éteinte')+'.',essai:{p1:v.a,p2:v.b,allumee:on}};}});
  }
  window.FICHE_CI_ELE11={
    id:'NL-CI-6E-ELE-11',version:'0.9',modele:'va-et-vient-deux-commutateurs-v1',
    titre:'Réaliser un montage va-et-vient',niveau:'6e',
    theme:'Électricité',chapitre:'Commande d’un circuit',
    competenceVisee:'Commander une même lampe depuis deux endroits avec deux commutateurs.',
    objectifsPedagogiques:['Réaliser le montage à deux commutateurs','Constater que chaque commutateur change l’état de la lampe','Compléter le tableau des quatre combinaisons'],
    situationEvaluation:'Dans le couloir de Kofi, on veut allumer et éteindre la même lampe depuis les deux bouts. Pourquoi un seul interrupteur ne suffit-il pas, et que permet le montage va-et-vient ?',
    objectif:'Commander une lampe depuis deux endroits.',
    objectifEleve:'Savoir commander une lampe depuis deux endroits.',
    situation:'Dans le couloir de Kofi, il y a un commutateur à chaque bout. Kofi veut pouvoir allumer et éteindre la même lampe depuis l’un ou l’autre. Le montage est en basse tension (pile de 4,5 V) : une installation réelle relève d’un électricien.',
    materiel:'Pile plate fictive de 4,5 V, lampe, deux commutateurs, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la lampe quand tu changes un seul commutateur. Justifie ton hypothèse.',choix:[['inverse','Changer n’importe quel commutateur change l’état de la lampe'],['un','Seul le commutateur 1 peut changer l’état de la lampe'],['rien','Changer un seul commutateur ne change rien : il faut changer les deux'],['allume','La lampe reste allumée quelles que soient les positions']]},
    protocole:['Choisir une position pour chaque commutateur et noter la lampe.','Changer un seul commutateur à la fois pour parcourir les quatre combinaisons.','Observer la lampe avec le schéma normalisé.','Compléter le tableau des quatre combinaisons.'],
    variable:'La position d’un commutateur',maintenu:'Pile, lampe, fils et l’autre commutateur',
    colonnes:['Commutateur 1','Commutateur 2','Lampe','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>['Position '+e.p1,'Position '+e.p2,e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>'commutateurs '+e.p1+' et '+e.p2+' : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. Quelles combinaisons allument la lampe ? 2. Que se passe-t-il quand tu changes un seul commutateur ? 3. Cela dépend-il de la position de l’autre ? 4. Combien de chemins relient les deux commutateurs ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux combinaisons qui ne diffèrent que par un commutateur et ce que tu as observé.',
    transfert:{q:'Un seul commutateur peut-il allumer ou éteindre la lampe, quelle que soit la position de l’autre ?',rep:'oui',expl:'Oui : changer la position de n’importe quel commutateur inverse l’état de la lampe, quelle que soit la position de l’autre.'},
    critere:'Compléter les quatre combinaisons et expliquer que chaque commutateur peut allumer ou éteindre.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne parcourt pas les combinaisons.'],['MF','Complète le tableau sans conclure.'],['MS','Formule que chaque commutateur change l’état de la lampe.'],['TBM','Formule, reconnaît le va-et-vient sur un schéma et explique les deux chemins.']],
    peutConfronter:st=>{const v=C().valides(st);return ['1-1','1-2','2-1','2-2'].every(k=>v.some(e=>e.p1+'-'+e.p2===k));},
    aides:['Change un seul commutateur et compare l’état de la lampe.','Regarde les deux fils qui relient les commutateurs sur le schéma.','Y a-t-il des combinaisons qui donnent le même état de la lampe ?'],
    synthese:'Dans un montage va-et-vient, deux commutateurs sont reliés par deux fils. Changer la position de n’importe quel commutateur inverse l’état de la lampe, quelle que soit la position de l’autre. On peut donc commander la même lampe depuis deux endroits. Le va-et-vient n’est pas un organe de commande : c’est un circuit qui utilise deux commutateurs.',
    prof:{reference:'La lampe brille quand les deux commutateurs sont dans la même position (1-1 ou 2-2) et reste éteinte quand ils sont dans des positions différentes (1-2 ou 2-1). Changer un seul commutateur inverse l’état de la lampe. Câblage à 4,5 V uniquement.',attendus:['Hypothèse notée avant l’essai.','Les quatre combinaisons testées, un commutateur changé à la fois.','Formulation : chaque commutateur peut allumer ou éteindre.','Reconnaissance du montage sur un schéma.'],erreurs:['Croire qu’il faut changer les deux commutateurs ensemble.','Confondre va-et-vient et commutateur à deux lampes.','Croire qu’une position donnée du commutateur 1 allume toujours la lampe.']},
    diagnostic:st=>['1-1','1-2','2-1','2-2'].filter(k=>!st.essais.some(e=>e.p1+'-'+e.p2===k)).length?['Il te manque encore des combinaisons à tester.']:['Tu as testé les quatre combinaisons.']
  };
})();
