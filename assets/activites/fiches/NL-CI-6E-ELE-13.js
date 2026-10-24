/* NohobaLab · 6e Côte d'Ivoire · ELE-13 · Causes d'un court-circuit.
   Six situations proposées par NohobaLab (le guide ne fournit pas de liste officielle). Un objet posé entre les deux bornes crée un court-circuit s'il est conducteur.
   Les liquides ne sont pas traités ici (voir la fiche sur les conducteurs et isolants). */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const SIT={
    fils:{nom:'Deux fils dont le plastique est abîmé se touchent',pont:'fil'},
    cle:{nom:'Une clé en métal tombe entre les deux contacts',pont:'cle'},
    capuchon:{nom:'Un morceau de plastique est coincé entre les deux contacts',pont:'plastique'},
    gomme:{nom:'Une gomme est posée entre les deux contacts',pont:'gomme'},
    bois:{nom:'Une planchette de bois sec est posée entre les deux contacts',pont:'bois'},
    plusieurs:{nom:'Plusieurs appareils sont branchés : le courant passe par chacun',pont:null}
  };
  const CLS={court:'Court-circuit',pas:'Pas de court-circuit'};
  function manip(panel,X){
    C().bloc(panel,X,{n:13,titre:'Atelier · je classe, puis je teste chaque situation',
      intro:'Pour chaque situation, je note d’abord mon classement, puis je lis le résultat de la simulation. Le circuit est en basse tension ; rien n’est mis en scène de dangereux.',
      controles:[{cle:'s',legende:'Situation',items:Object.keys(SIT).map(k=>[k,SIT[k].nom])},{cle:'c',legende:'Mon classement avant le test',items:[['court',CLS.court],['pas',CLS.pas]]}],
      saisie:'J’observe que la lampe… et le circuit…',legendeTable:'Mes situations : classement et résultat du test.',
      F:()=>window.FICHE_CI_ELE13,
      render:v=>{const s=SIT[v.s],o={pile:'ok',slot1:'inter',s1:{ferme:true},lampe:'ok',planche:true,pont:s.pont},m=C().boucle(o),e=m.etat;
        return {montage:m.montage,schema:m.schema,txt:s.nom+' : '+(e.courtCircuit?'court-circuit (la lampe est éteinte)':'pas de court-circuit (la lampe brille)')+'.',essai:{sit:v.s,classe:v.c,court:e.courtCircuit}};}});
  }
  window.FICHE_CI_ELE13={
    id:'NL-CI-6E-ELE-13',version:'0.9',modele:'court-circuit-situations-v1',
    titre:'Identifier les causes d’un court-circuit',niveau:'6e',
    theme:'Électricité',chapitre:'Court-circuit et protection',
    competenceVisee:'Identifier, parmi des situations du quotidien, celles qui créent un court-circuit.',
    objectifsPedagogiques:['Classer des situations en « court-circuit » ou « pas de court-circuit »','Justifier chaque choix avec ce que le test montre','Énoncer deux causes d’un court-circuit'],
    situationEvaluation:'Plusieurs incidents arrivent dans la maison de Kofi. Lesquels créent un chemin direct entre les deux fils, et pourquoi ?',
    objectif:'Identifier ce qui provoque un court-circuit.',
    objectifEleve:'Savoir reconnaître les causes d’un court-circuit.',
    situation:'Plusieurs petits incidents arrivent à la maison : fils abîmés, objets tombés, appareils branchés. Kofi veut savoir lesquels créent un chemin direct entre les deux fils.',
    materiel:'Pile plate fictive de 4,5 V, lampe, interrupteur fermé, planche à bornes, objets conducteurs et isolants, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui provoque un court-circuit. Justifie ton hypothèse.',choix:[['conducteur','Un conducteur qui relie directement les deux fils'],['tout','N’importe quel objet posé entre les fils'],['appareils','Brancher beaucoup d’appareils'],['isolant','Un isolant posé entre les fils']]},
    protocole:['Choisir une situation et écrire d’abord mon classement.','Lire le résultat de la simulation : lampe et chemin du courant.','Tester les six situations.','Corriger mon classement si besoin.'],
    variable:'La situation (l’objet entre les contacts)',maintenu:'Pile, lampe et interrupteur fermé',
    colonnes:['Situation','Mon classement','Résultat du test','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[SIT[e.sit].nom,CLS[e.classe],e.court?CLS.court:CLS.pas,e.observation||'—']),
    resume:e=>SIT[e.sit].nom.toLowerCase()+' : '+(e.court?'court-circuit':'pas de court-circuit'),
    confrontation:'1. Quelles situations créent un court-circuit ? 2. Que ont-elles en commun ? 3. Pourquoi un objet isolant n’en crée-t-il pas ? 4. Brancher plusieurs appareils est-il un court-circuit ? Compare ensuite à ton classement initial.',
    retroaction:'Cite une situation qui crée un court-circuit et une qui n’en crée pas, avec ce que tu as observé.',
    transfert:{q:'Un morceau de plastique tombe entre deux contacts nus. Y a-t-il court-circuit ?',rep:'non',expl:'Non : le plastique est isolant, il ne relie pas électriquement les deux contacts. Un conducteur (fil dénudé, clé en métal) créerait un court-circuit.'},
    critere:'Classer correctement les situations et énoncer deux causes d’un court-circuit.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Classe au hasard.'],['MF','Classe sans justifier avec le test.'],['MS','Classe et justifie par conducteur ou isolant.'],['TBM','Classe, justifie, énonce deux causes et distingue du simple branchement de plusieurs appareils.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=4&&v.some(e=>e.court)&&v.some(e=>!e.court);},
    aides:['Relis ce qui relie les deux contacts : conducteur ou isolant ?','Regarde si le courant passe par la lampe ou par l’objet.','Un court-circuit apparaît quand un conducteur relie directement les deux fils.'],
    synthese:'Un court-circuit apparaît quand un conducteur relie directement les deux fils ou les deux bornes : fils dénudés qui se touchent, objet métallique entre deux contacts. Un isolant posé entre les contacts n’en crée pas. Brancher plusieurs appareils n’est pas un court-circuit : le courant passe par chacun.',
    prof:{reference:'Fils abîmés qui se touchent et clé en métal : court-circuit, la lampe est éteinte. Plastique, gomme, bois sec entre les contacts : pas de court-circuit, la lampe brille. Plusieurs appareils branchés : pas de court-circuit. Les liquides ne sont pas traités ici ; la fiche sur les conducteurs et isolants s’en charge.',attendus:['Classement initial conservé.','Six situations testées.','Deux causes énoncées.','Tableau avec classement initial et corrigé.'],erreurs:['Croire que tout objet entre les fils crée un court-circuit.','Confondre court-circuit et trop d’appareils branchés.','Oublier de regarder la lampe.']},
    diagnostic:st=>st.essais.some(e=>!e.court)?['Compare les situations sans court-circuit avec celles qui en créent un.']:['Teste aussi une situation avec un isolant.']
  };
})();
