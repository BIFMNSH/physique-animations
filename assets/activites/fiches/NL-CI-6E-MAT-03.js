/* NohobaLab · 6e Côte d'Ivoire · MAT-03 · Distinguer un solide compact d'un solide divisé.
   Modèle qualitatif : un solide divisé est fait de grains qui gardent chacun leur forme ; un solide compact est d’un seul morceau. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const OBJ=[['caillou','Un caillou'],['sel','Du sel fin'],['bois','Un bloc de bois'],['farine','De la farine'],['riz','Du riz'],['clou','Un clou']];
  const ACT=[['verser','Je verse'],['loupe','Je regarde à la loupe virtuelle']];
  const CATS=[['compact','Solide compact'],['divise','Solide divisé']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const typeDe=o=>M().OBJETS[o].type==='compact'?'compact':'divise';
  function manip(panel,X){
    M().bloc(panel,X,{n:3,titre:'Atelier · je teste six objets',
      intro:'Je verse chaque objet ou je le regarde à la loupe virtuelle (grossissement qualitatif, sans échelle). Puis je classe les six objets. Simulation uniquement.',
      controles:[{cle:'o',legende:'L’objet',items:OBJ},{cle:'a',legende:'Ce que je fais',items:ACT}],
      saisie:'J’observe que l’objet… et qu’à la loupe…',legendeTable:'Mes essais : objet, action et observation.',F:()=>window.FICHE_CI_MAT03,
      render:v=>{const r=M().examiner(v.o,v.a),sc=M().scene.divise({objet:v.o,action:v.a});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{objet:v.o,action:v.a,grains:r.grains}};}});
    const items=OBJ.map(o=>({id:o[0],label:o[1],svg:M().scene.objetSvg(o[0],o[1]),juste:typeDe(o[0]),
      pourquoi:M().OBJETS[o[0]].type==='compact'?'C’est un seul morceau, avec une forme propre.':'C’est fait de petits grains qui gardent chacun leur forme.',aide:'Regarde ce que tu as vu à la loupe : un seul morceau ou des grains ?'}));
    M().tri(panel,X,{id:'classe',titre:'Je classe les six objets',intro:'Un solide divisé est fait de grains ; un solide compact est d’un seul morceau.',legende:'Cet objet est',cats:CATS,items:items});
  }
  window.FICHE_CI_MAT03={
    id:'NL-CI-6E-MAT-03',version:'0.9',modele:'compact-divise-qualitatif-v1',
    titre:'Distinguer un solide compact d’un solide divisé',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Classer des solides en solides compacts ou solides divisés.',
    objectifsPedagogiques:['Reconnaître un solide divisé (sable, sel, farine, riz)','Dire qu’un solide divisé est fait de grains qui gardent chacun leur forme','Classer des objets en solides compacts ou divisés'],
    situationEvaluation:'Kofi dit : « le sable coule, donc le sable est un liquide ». Que lui réponds-tu ? Appuie-toi sur ce que tu as vu à la loupe.',
    objectif:'Classer des solides en compacts ou divisés.',objectifEleve:'Savoir classer un solide et justifier mon choix.',
    situation:'Au bord de la lagune, Awa verse du sable et le voit couler. Elle se demande si le sable est un solide comme un caillou. Elle compare six objets du quotidien.',
    materiel:'Simulation : un caillou, du sel fin, un bloc de bois, de la farine, du riz, un clou ; une loupe virtuelle.',
    prevision:{consigne:'Avant les essais, choisis comment tu rangerais le sel, la farine et le riz. Justifie ton hypothèse.',choix:[['divise','Ce sont des solides divisés, faits de grains'],['liquide','Ce sont des liquides, car ils coulent'],['compact','Ce sont des solides compacts, comme le caillou'],['gaz','Ce sont des gaz, car ils s’envolent']]},
    protocole:['Verser chaque objet et observer comment il se comporte.','Regarder chaque objet à la loupe virtuelle.','Noter ce qu’on voit : un seul morceau ou des grains.','Classer les six objets en deux groupes et justifier.'],
    variable:'L’objet testé',maintenu:'La façon de l’observer (verser, loupe)',
    colonnes:['Objet','Action','Ce que je vois','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(OBJ,e.objet),lib(ACT,e.action),e.grains?'Des grains':'Un seul morceau',e.observation||'—']).concat(M().lignesTri(st,'classe',i=>lib(OBJ,i),c=>lib(CATS,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?lib(OBJ,e.item).toLowerCase()+' classé : '+lib(CATS,e.choix).toLowerCase():lib(OBJ,e.objet).toLowerCase()+' ('+lib(ACT,e.action).toLowerCase()+') : '+(e.grains?'grains':'un seul morceau'),
    confrontation:'1. Quels objets sont faits de grains à la loupe ? 2. Quels objets sont d’un seul morceau ? 3. Chaque grain garde-t-il sa forme ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un objet et ce que la loupe virtuelle t’a montré.',
    transfert:{q:'Le sable « coule » quand on le verse : est-ce un liquide ?',rep:'non',expl:'Non : le sable est un solide divisé. Ce sont les grains qui glissent les uns sur les autres ; chaque grain garde sa forme.'},
    critere:'Classer les six objets et justifier deux choix avec ce qu’on voit à la loupe.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Classe sans justifier.'],['MF','Classe correctement mais justifie par « ça coule ».'],['MS','Classe et justifie par les grains ou le bloc.'],['TBM','Classe, justifie et explique pourquoi le sable n’est pas un liquide.']],
    peutConfronter:st=>{const v=M().valides(st),e=M().triEtat(st,'classe',OBJ.map(o=>o[0]));return v.length>=3&&v.some(x=>x.grains)&&v.some(x=>!x.grains)&&e.repondus>=6;},
    aides:['Verse l’objet, puis regarde-le à la loupe.','Un solide divisé est fait de petits morceaux séparés.','Chaque grain garde sa forme, même quand l’ensemble s’écoule.'],
    synthese:'Un solide compact est d’un seul morceau. Un solide divisé (sable, sel, farine, riz) est fait de grains qui gardent chacun leur forme : l’ensemble prend la forme du tas qu’il forme et peut s’écouler, mais ce sont les grains qui glissent.',
    prof:{reference:'Solide compact : un seul morceau. Solide divisé : ensemble de grains qui gardent chacun leur forme (sel, sable, farine, riz).',attendus:['Observer à la loupe des grains pour le sel, la farine et le riz.','Classer les six objets : caillou, bois, clou compacts ; sel, farine, riz divisés.','Justifier par la présence de grains.'],erreurs:['Dire que le sable est un liquide parce qu’il coule.','Confondre « petit » et « divisé » : un petit caillou reste compact.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste au moins un objet compact et un objet divisé.']:['Fais un premier essai.']
  };
})();
