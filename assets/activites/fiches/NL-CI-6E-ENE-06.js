/* NohobaLab · 6e Côte d'Ivoire · ENE-06 · Faire fonctionner une lampe avec une cellule photovoltaïque. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : plus la cellule est éclairée, mieux la lampe fonctionne ; niveaux simulés. Le montage (connexions) et la chaîne (conversions) sont deux dessins distincts : la chaîne est construite dans une autre fiche. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const ECL=[['soleil','Plein soleil'],['nuage','Ciel nuageux'],['bureau','Lampe de bureau allumée près de la cellule'],['couvert','Cellule couverte par un carton']];
  const LAMPE={forte:'éclaire fort',moyenne:'éclaire correctement',faible:'éclaire faiblement',eteinte:'est éteinte'};
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:6,titre:'Atelier · j’éclaire une cellule photovoltaïque',
      intro:'Une cellule photovoltaïque est reliée à une petite lampe. Je choisis l’éclairement, je regarde le montage et son schéma (la cellule s’écrit G, comme un générateur). Les niveaux sont simulés, sans mesure.',
      controles:[{cle:'e',legende:'L’éclairement de la cellule',items:ECL}],
      saisie:'J’observe que la cellule… et que la lampe…',legendeTable:'Mes essais : éclairement et état de la lampe (valeurs simulées).',F:()=>window.FICHE_CI_ENE06,
      render:v=>{const r=NE().cellule(v.e),sc=NE().sceneCellule(v.e);return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (Niveaux simulés.)',essai:{ecl:v.e,niveau:r.niveau,lampe:r.lampe}};}});
  }
  window.FICHE_CI_ENE06={
    id:'NL-CI-6E-ENE-06',version:'0.9',modele:'cellule-photovoltaique-qualitatif-v1',
    titre:'Faire fonctionner une lampe avec une cellule photovoltaïque',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Relier l’éclairement de la cellule au fonctionnement de la lampe.',
    objectifsPedagogiques:['Dire que la cellule photovoltaïque fournit de l’électricité quand elle est éclairée','Dire que la lampe éclaire d’autant mieux que la cellule reçoit de lumière','Dire que sans lumière sur la cellule, la lampe reste éteinte'],
    situationEvaluation:'À l’école, la lampe reliée à la cellule solaire s’éteint quand un nuage passe. Kofi dit : « elle est cassée ». A-t-il raison ? Explique.',
    objectif:'Relier la lumière reçue par la cellule au fonctionnement de la lampe.',objectifEleve:'Savoir dire pourquoi la lampe s’éteint quand la cellule n’est plus éclairée.',
    situation:'À l’école, une petite lampe est alimentée par une cellule photovoltaïque. Awa se demande ce qui se passe si on l’éclaire moins.',
    materiel:'Simulation : une cellule photovoltaïque, une petite lampe, des fils, une lampe de bureau, un carton.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la lampe quand la cellule est moins éclairée. Justifie ton hypothèse.',choix:[['moins','La lampe éclaire moins, puis plus du tout sans lumière'],['pareil','La lampe éclaire pareil, quelle que soit la lumière'],['plus','La lampe éclaire plus quand la cellule est dans l’ombre'],['cassee','La lampe est cassée dès qu’il y a un nuage']]},
    protocole:['Éclairer la cellule en plein soleil et noter l’état de la lampe.','Changer l’éclairement : ciel nuageux, puis lampe de bureau.','Couvrir la cellule avec un carton.','Comparer les quatre essais.'],
    variable:'L’éclairement de la cellule',maintenu:'La cellule, la lampe et les fils',
    colonnes:['Éclairement','Lampe','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(ECL,e.ecl),LAMPE[e.lampe],e.observation||'—']),
    resume:e=>lib(ECL,e.ecl).toLowerCase()+' : la lampe '+LAMPE[e.lampe],
    confrontation:'1. Que fait la lampe en plein soleil ? 2. Quand la cellule est moins éclairée ? 3. Quand elle est couverte ? 4. La lumière est-elle nécessaire ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux éclairements différents et l’état de la lampe dans chaque cas.',
    transfert:{q:'La nuit, une cellule photovoltaïque seule alimente-t-elle la lampe de l’école ?',rep:'non',expl:'Non : sans lumière sur la cellule, elle ne fournit pas d’électricité. Pour avoir de la lumière la nuit, il faut une autre source ou une réserve d’énergie.'},
    critere:'Relier l’éclairement de la cellule à l’état de la lampe en citant des essais.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit la lampe sans parler de la cellule.'],['MF','Dit qu’il faut de la lumière sans comparer les essais.'],['MS','Relie chaque éclairement à l’état de la lampe.'],['TBM','Relie, conclut que la cellule convertit la lumière en énergie électrique et applique à la nuit.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'ecl')>=3&&v.some(e=>e.ecl==='couvert');},
    aides:['Compare l’état de la lampe pour deux éclairements différents.','Quand la cellule ne reçoit pas de lumière, que se passe-t-il ?','La cellule transforme la lumière reçue en énergie électrique.'],
    synthese:'Une cellule photovoltaïque convertit la lumière qu’elle reçoit en énergie électrique. Plus elle est éclairée, mieux la lampe fonctionne ; sans lumière, la lampe reste éteinte. Le montage montre les connexions ; la chaîne énergétique, qu’on dessine à part, montre les conversions.',
    prof:{reference:'Cellule éclairée → énergie électrique → lampe. Éclairement fort : lampe forte ; faible : lampe faible ; nul : lampe éteinte. Niveaux simulés, aucune valeur mesurée.',attendus:['Tester au moins trois éclairements dont la cellule couverte.','Conclure que la lampe dépend de la lumière reçue.'],erreurs:['Croire que la cellule « stocke » la lumière.','Confondre cellule et pile.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste la cellule couverte.']:['Fais un premier essai.']
  };
})();
