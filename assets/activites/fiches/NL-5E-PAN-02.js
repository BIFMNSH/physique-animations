/* NohobaLab · 5e · PAN-02 · Effet d'un court-circuit d'une lampe en série et en dérivation (modèle NohobaPannes5e.courtCircuit).
   Le court-circuit est simulé : il ne doit pas être réalisé avec le secteur ni laissé en place sur une pile. */
(function(){
  'use strict';
  const P=()=>window.NohobaPannes5e,E=()=>window.NohobaElec5e;
  const mode=m=>m==='serie'?'En série':'En dérivation';
  function manip(panel,X){const p=P();
    E().atelier(panel,X,{titre:'Atelier · un fil aux bornes d’une lampe',idObs:'e-obs',placeholder:'J’observe que les lampes…',
      intro:'Un fil relie les deux bornes d’une lampe : la lampe est court-circuitée. Je choisis le montage et la lampe, puis j’observe. Dans la simulation, rien ne chauffe : dans la réalité, on ne laisse jamais un court-circuit en place.',fiche:()=>window.FICHE_5E_PAN02,
      groupes:[{legende:'Montage des deux lampes',nom:'e-m',items:p.MODES,def:'serie'},{legende:'Fil ajouté aux bornes de',nom:'e-c',items:p.CIBLES,def:'aucune'}],
      rendre:v=>{const r=p.vueCC(v['e-m'],v['e-c']);return {montage:r.montage,schema:r.schema,lecture:r.etat.txt,essai:{mode:v['e-m'],cible:v['e-c'],gen:r.etat.generateur,txt:r.etat.txt}};}});}
  const val=st=>E().valides(st);
  window.FICHE_5E_PAN02={
    id:'NL-5E-PAN-02',version:'0.9',modele:'court-circuit-lampe-v1',
    titre:'Un fil en trop : le court-circuit',niveau:'5e',theme:'Électricité',chapitre:'Association de lampes électriques',
    competenceVisee:'Prévoir l’effet du court-circuit d’une lampe dans un montage en série ou en dérivation.',
    objectifsPedagogiques:['Reconnaître une lampe court-circuitée','Observer l’effet du court-circuit d’une lampe en série','Reconnaître le court-circuit du générateur en dérivation'],
    situationEvaluation:'Dans un montage en dérivation, Kofi pose par erreur un fil sur les deux bornes d’une lampe. Que se passe-t-il pour les deux lampes ? Pourquoi est-ce dangereux ?',
    objectif:'Trouver ce que deviennent les lampes quand un fil relie les deux bornes de l’une d’elles.',
    objectifEleve:'Savoir prévoir l’effet d’un court-circuit et expliquer son danger.',
    situation:'En rangeant son montage, Awa laisse tomber un fil dénudé sur les deux bornes d’une lampe. Dans un montage, l’autre lampe se met à briller plus fort. Dans un autre, tout s’éteint et la pile chauffe. Que s’est-il passé ?',
    materiel:'Pile plate fictive de 4,5 V, deux lampes identiques sur support, un fil supplémentaire, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand un fil relie les deux bornes d’une lampe. Justifie ton hypothèse avec « car ».',choix:[
      ['depend','En série l’autre lampe brille plus fort ; en dérivation tout s’éteint'],['rien','Rien ne change : le fil ne sert à rien'],['seule','Seule la lampe touchée s’éteint, dans les deux montages'],['tout','Tout s’éteint dans les deux montages']]},
    protocole:['Montage en série, sans fil ajouté : observer les deux lampes.','Changer un seul élément : ajouter le fil aux bornes de L1, puis de L2.','Recommencer avec le montage en dérivation.','Écrire une observation après chaque essai.'],
    variable:'La lampe court-circuitée, puis le montage',maintenu:'La pile et les deux lampes',
    colonnes:['Montage','Fil aux bornes de','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[mode(e.mode),e.cible==='aucune'?'Aucune lampe':e.cible,e.txt,e.observation||'—']),
    resume:e=>mode(e.mode)+', '+(e.cible==='aucune'?'sans fil ajouté':'fil aux bornes de '+e.cible)+' : '+e.txt,
    confrontation:'1. En série, que devient la lampe court-circuitée ? Et l’autre ? 2. En dérivation, que deviennent les deux lampes ? 3. Par où passe le courant quand le fil est ajouté ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai en série et un essai en dérivation avec l’état des deux lampes.',
    transfert:{q:'Dans un montage en dérivation, un fil relie les deux bornes d’une lampe. Que se passe-t-il ?',rep:'gen',options:[['gen','Les deux lampes s’éteignent : le générateur est en court-circuit'],['plus','L’autre lampe brille plus fort'],['une','Seule cette lampe s’éteint'],['rien','Rien ne change']],expl:'En dérivation, les bornes de la lampe sont aussi reliées aux bornes du générateur : le fil met le générateur en court-circuit. Le courant devient très intense, les fils chauffent : risque d’incendie.'},
    critere:'Prévoir l’effet du court-circuit d’une lampe dans les deux montages et nommer le danger.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un essai sans parler de court-circuit.'],['MF','Reconnaît la lampe court-circuitée sans comparer les montages.'],['MS','Prévoit correctement l’effet dans les deux montages.'],['TBM','Prévoit, explique le trajet du courant et nomme le danger pour le générateur.']],
    peutConfronter:st=>{const v=val(st);return ['serie','derivation'].every(m=>v.some(e=>e.mode===m&&e.cible!=='aucune'));},
    aides:['Le courant passe presque entièrement par le fil, plus facile à traverser que la lampe.','En série, quelle lampe reste seule dans la boucle avec la pile ?','En dérivation, regarde le schéma : le fil relie-t-il aussi les deux bornes du générateur ?'],
    synthese:'Court-circuiter une lampe, c’est relier ses deux bornes par un fil. La lampe court-circuitée s’éteint : le courant passe par le fil. En série, l’autre lampe brille plus fort. En dérivation, le fil relie aussi les deux bornes du générateur : c’est un court-circuit du générateur. Toutes les lampes s’éteignent, le courant devient très intense, les fils chauffent : il y a un risque d’incendie. À la maison, les fusibles et les disjoncteurs coupent le courant en cas de court-circuit.',
    prof:{reference:'Série : la lampe court-circuitée s’éteint, l’autre brille plus fort. Dérivation : les deux lampes s’éteignent, générateur en court-circuit.',attendus:['Hypothèse notée avant les essais.','Un court-circuit testé dans chaque montage.','Danger du court-circuit du générateur nommé.'],erreurs:['Croire que seule la lampe touchée s’éteint en dérivation.','Confondre lampe en panne et lampe court-circuitée.','Oublier le danger (échauffement, incendie).']},
    diagnostic:st=>val(st).some(e=>e.gen)?['Tu as vu le court-circuit du générateur : pourquoi est-il dangereux ?']:['Passe au montage en dérivation et ajoute le fil aux bornes d’une lampe.']
  };
})();
