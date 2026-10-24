/* NohobaLab · 6e Côte d'Ivoire · ELE-16 · Causes d'une panne dans un circuit.
   Quatre circuits en panne, une seule cause cachée par circuit. L'élève remplace un élément à la fois ou utilise un testeur de continuité qualitatif (allumé / éteint). Jamais sur le secteur. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const CIR={A:'inter',B:'fil',C:'pile',D:'lampe'};
  const ACT={pileNeuve:'Je remplace la pile par une pile neuve',lampeNeuve:'Je remplace la lampe par une lampe neuve',interNeuf:'Je remplace l’interrupteur par un interrupteur neuf',serrer:'Je resserre le fil à la lampe',testPile:'Je branche une lampe témoin sur la pile',testLampe:'Je teste la lampe avec le testeur de continuité',testInter:'Je teste l’interrupteur fermé avec le testeur',testFil:'Je teste le fil avec le testeur'};
  const TEST=['testPile','testLampe','testInter','testFil'];
  function lire(c,a){const r=C().panne(CIR[c],a);return r;}
  const RES=e=>TEST.indexOf(e.action)>=0?(e.action==='testPile'?(e.ok?'La lampe témoin s’allume':'La lampe témoin reste éteinte'):(e.ok?'Le testeur s’allume : le courant peut passer':'Le testeur reste éteint : le courant ne passe pas')):(e.ok?'La lampe s’allume':'La lampe reste éteinte');
  function manip(panel,X){
    C().bloc(panel,X,{n:16,titre:'Atelier · je dépanne, une action à la fois',
      intro:'Quatre circuits ne s’allument plus ; la cause est cachée. Je choisis un circuit et une action : je remplace un élément ou je le teste. Le circuit revient à son état initial avant chaque action.',
      controles:[{cle:'c',legende:'Circuit en panne',items:[['A','Circuit A'],['B','Circuit B'],['C','Circuit C'],['D','Circuit D']]},{cle:'a',legende:'Mon action',items:Object.keys(ACT).map(k=>[k,ACT[k]])}],
      saisie:'J’observe que la lampe… ou que le testeur… donc la cause est peut-être…',legendeTable:'Ma fiche de dépannage : circuit, action et résultat.',
      F:()=>window.FICHE_CI_ELE16,
      render:v=>{const r=lire(v.c,v.a),test=TEST.indexOf(v.a)>=0,ok=test?(v.a==='testPile'?!!r.temoin:!!r.testeur):!!r.allumee;
        const m=C().boucle(Object.assign(C().optsPanne(CIR[v.c],test?'aucune':v.a),{cache:true}));
        const e={circuit:v.c,action:v.a,ok:ok};
        return {montage:m.montage,schema:m.schema,txt:'Circuit '+v.c+' · '+ACT[v.a].toLowerCase()+' : '+RES(e).toLowerCase()+'.',essai:e};}});
  }
  window.FICHE_CI_ELE16={
    id:'NL-CI-6E-ELE-16',version:'0.9',modele:'depannage-circuit-cause-cachee-v1',
    titre:'Identifier les causes d’une panne dans un circuit électrique',niveau:'6e',
    theme:'Électricité',chapitre:'Court-circuit et protection',
    competenceVisee:'Mener un dépannage méthodique pour trouver la cause d’une lampe qui ne s’allume pas.',
    objectifsPedagogiques:['Lister les causes possibles d’une panne : pile usée, lampe grillée, interrupteur défectueux, fil ou contact défaillant','Tester une cause à la fois','Conclure en écrivant la cause trouvée et la méthode utilisée'],
    situationEvaluation:'La lampe de Kofi ne s’allume plus. Que vérifie-t-il, dans quel ordre, et comment sait-il quel élément est défectueux ?',
    objectif:'Trouver la cause d’une panne en testant un élément à la fois.',
    objectifEleve:'Savoir chercher la cause d’une panne.',
    situation:'La lampe de Kofi ne s’allume plus. Son circuit comprend une pile, un interrupteur, des fils et une lampe. Kofi ne sait pas où est la panne et décide de tester un élément à la fois, en simulation basse tension.',
    materiel:'Pile plate fictive de 4,5 V, lampe, interrupteur, fils de connexion, pièces de rechange en bon état, lampe témoin, testeur de continuité qualitatif, simulation. Jamais sur le secteur.',
    prevision:{consigne:'Avant les essais, choisis la cause qui te paraît la plus probable quand la lampe ne s’allume plus. Justifie ton hypothèse.',choix:[['pile','La pile est usée'],['lampe','La lampe est grillée (filament coupé)'],['inter','L’interrupteur est défectueux'],['fil','Un fil ou un contact est mal serré']]},
    protocole:['Choisir un circuit en panne.','Remplacer un seul élément par un élément en bon état, ou le tester avec la lampe témoin ou le testeur.','Observer ; le circuit revient à son état initial avant l’action suivante.','Conclure : quel élément est défectueux ?'],
    variable:'L’élément remplacé ou testé',maintenu:'Les autres éléments du circuit',
    colonnes:['Circuit','Action','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>['Circuit '+e.circuit,ACT[e.action],RES(e),e.observation||'—']),
    resume:e=>'circuit '+e.circuit+' · '+ACT[e.action].toLowerCase()+' : '+RES(e).toLowerCase(),
    confrontation:'1. Dans quel circuit as-tu trouvé la panne, et avec quelle action la lampe s’est-elle allumée ? 2. Quels tests t’ont permis d’éliminer une cause ? 3. Pourquoi faut-il changer un seul élément à la fois ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un circuit : l’action qui a rallumé la lampe et ce que tu en conclus.',
    transfert:{q:'Tu remplaces la pile et la lampe en même temps : la lampe s’allume. Sais-tu quel élément était défectueux ?',rep:'non',expl:'Non : en changeant deux éléments à la fois, on ne peut pas dire lequel était défectueux. Il faut tester une seule cause à la fois.'},
    critere:'Localiser la panne dans au moins deux circuits en testant une cause à la fois.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Change plusieurs éléments à la fois.'],['MF','Trouve une panne sans méthode.'],['MS','Teste une cause à la fois et localise la panne.'],['TBM','Localise plusieurs pannes avec méthode et rédige la cause et la méthode.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=4&&new Set(v.filter(e=>TEST.indexOf(e.action)<0&&e.ok).map(e=>e.circuit)).size>=2;},
    aides:['Teste une seule cause à la fois, en commençant par la plus simple.','Un élément remplacé qui rallume la lampe est l’élément défectueux.','Utilise la lampe témoin pour la pile et le testeur pour la lampe, l’interrupteur et les fils.'],
    synthese:'Pour dépanner un circuit, on teste une cause à la fois : pile usée, lampe grillée, interrupteur défectueux, fil ou contact défaillant. Quand on remplace l’élément défectueux par un élément en bon état, la lampe s’allume : la panne est localisée. Un testeur de continuité ou une lampe témoin permettent de vérifier un élément sans le remplacer. On ne dépanne jamais un appareil branché sur le secteur.',
    prof:{reference:'Circuit A : interrupteur défectueux (contact qui ne se ferme pas). Circuit B : fil mal serré à la lampe. Circuit C : pile usée. Circuit D : lampe grillée (filament coupé). Le remplacement de l’élément en cause rallume la lampe ; le testeur de continuité reste éteint sur l’élément défectueux.',attendus:['Hypothèse notée avant l’essai.','Une cause testée à la fois.','Cause et méthode écrites pour au moins deux circuits.','Fiche de dépannage imprimée.'],erreurs:['Remplacer plusieurs éléments à la fois.','Conclure sans test.','Tester sur le secteur : interdit.']},
    diagnostic:st=>st.essais.length>=2?['Pense à tester les quatre causes possibles.']:['Commence par tester ou remplacer un seul élément.']
  };
})();
