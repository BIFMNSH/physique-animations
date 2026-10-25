/* NohobaLab · 6e Côte d'Ivoire · MAT-24 · Réaliser l'évaporation de l'eau.
   Scission décidée par le propriétaire (25 octobre 2026) : l'évaporation ici, l'ébullition et la condensation en MAT-33. Valeurs simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const EXP=()=>M().EXPERIENCES_VAPO.filter(x=>/^evap/.test(x[0]));
  const MOM=[['debut','Au départ'],['tard','Plus tard']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:24,titre:'Atelier · deux soucoupes d’eau',
      intro:'Deux soucoupes pleines d’eau, l’une au soleil, l’autre à l’ombre. Je choisis la soucoupe et le moment, et je regarde le niveau. Durées accélérées, simulation.',
      controles:[{cle:'x',legende:'La soucoupe',items:EXP()},{cle:'m',legende:'Le moment',items:MOM}],
      saisie:'J’observe que le niveau…',legendeTable:'Mes essais : soucoupe, moment et niveau (simulés).',F:()=>window.FICHE_CI_MAT24,
      render:v=>{const r=M().vaporisation(v.x,v.m),sc=M().scene.vapo({exp:v.x,moment:v.m});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{exp:v.x,moment:v.m,forme:r.forme,niveau:r.niveau,bulles:r.bulles}};}});
  }
  window.FICHE_CI_MAT24={
    id:'NL-CI-6E-MAT-24',version:'0.9',modele:'evaporation-v1',
    titre:'Réaliser l’évaporation de l’eau',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Réaliser l’évaporation de l’eau et reconnaître ses caractéristiques.',
    objectifsPedagogiques:['Dire que l’eau passe lentement de l’état liquide à l’état gazeux à sa surface','Dire que l’évaporation se fait sans bulles et à toute température','Dire que l’évaporation est plus rapide quand il fait plus chaud'],
    situationEvaluation:'Awa étend deux linges identiques, l’un au soleil, l’autre à l’ombre. Lequel sèche le plus vite ? Où va l’eau ? Y a-t-il des bulles ?',
    objectif:'Reconnaître l’évaporation de l’eau.',objectifEleve:'Savoir où va l’eau qui sèche.',
    situation:'Awa étend du linge au soleil : il sèche sans que l’eau bouille. Où va l’eau ? Elle compare deux soucoupes d’eau, l’une au soleil, l’autre à l’ombre.',
    materiel:'Simulation : deux soucoupes pleines d’eau, une au soleil, une à l’ombre.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive au niveau de l’eau dans la soucoupe au soleil après une journée. Justifie ton hypothèse.',choix:[['baisse','Il baisse plus que dans la soucoupe à l’ombre'],['egal','Il reste identique'],['monte','Il monte'],['pareil','Il baisse pareil à l’ombre et au soleil']]},
    protocole:['Remplir deux soucoupes au même niveau.','En mettre une au soleil, l’autre à l’ombre.','Relever le niveau au départ puis plus tard.','Comparer.'],
    variable:'La place de la soucoupe (soleil ou ombre)',maintenu:'La soucoupe, la quantité d’eau et la durée',
    colonnes:['Soucoupe','Moment','Niveau (simulé)','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(EXP(),e.exp),lib(MOM,e.moment),e.niveau,e.observation||'—']),
    resume:e=>lib(EXP(),e.exp).toLowerCase()+' ('+lib(MOM,e.moment).toLowerCase()+') : niveau '+e.niveau,
    confrontation:'1. Que devient le niveau dans chaque soucoupe ? 2. Y a-t-il des bulles ? 3. Dans laquelle l’eau part-elle le plus vite ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite le niveau de chaque soucoupe plus tard.',
    transfert:{q:'Pour sécher plus vite, le linge doit-il bouillir ?',rep:'non',expl:'Non : l’eau du linge s’évapore à la surface, sans bouillir, et plus vite quand il fait chaud.'},
    critere:'Dire que l’évaporation est lente, sans bulles, et plus rapide au chaud, avec deux essais cités.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les niveaux sans conclure.'],['MF','Dit que l’eau part sans comparer.'],['MS','Compare soleil et ombre.'],['TBM','Compare, nomme l’évaporation et dit qu’elle se fait à toute température.']],
    peutConfronter:st=>{const v=M().valides(st);return v.some(e=>e.exp==='evap_soleil'&&e.moment==='tard')&&v.some(e=>e.exp==='evap_ombre'&&e.moment==='tard')&&v.length>=4;},
    aides:['Compare le niveau des deux soucoupes plus tard.','Regarde s’il y a des bulles.','Où va l’eau qui disparaît ?'],
    synthese:'L’évaporation est le passage lent de l’eau liquide à l’état gazeux (vapeur d’eau, invisible) à sa surface. Elle se fait sans bulles, à toute température, et plus vite quand il fait plus chaud.',
    prof:{reference:'Évaporation : lente, en surface, sans bulles, à toute température, plus rapide au chaud.',attendus:['Comparer soleil et ombre.','Dire qu’il n’y a pas de bulles.','Nommer l’évaporation.'],erreurs:['Dire que l’eau disparaît sans aller nulle part.','Confondre évaporation et ébullition.']},
    diagnostic:st=>st.essais.length?['Indicatif : relève les deux soucoupes au départ et plus tard.']:['Fais un premier essai.']
  };
})();
