/* NohobaLab · 6e Côte d'Ivoire · MAT-33 · Réaliser l'ébullition de l'eau et la condensation de la vapeur d'eau.
   Issue de la scission de MAT-24 (25 octobre 2026). Ébullition : simulation ou démonstration du professeur seul. La vapeur d'eau est un gaz invisible. Valeurs simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const EXP=()=>M().EXPERIENCES_VAPO.filter(x=>!/^evap/.test(x[0]));
  const MOM=[['debut','Au départ'],['tard','Plus tard']];
  const FORMES=[['evaporation','Évaporation'],['ebullition','Ébullition']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const ITEMS=[
    ['f1','Elle se fait à la surface de l’eau, sans bulles.','evaporation','C’est l’évaporation : lente, à la surface, sans bulles.'],
    ['f2','Des bulles se forment dans tout le liquide.','ebullition','Ce sont les bulles de l’ébullition.'],
    ['f3','Elle se produit à toute température, plus vite quand il fait chaud.','evaporation','L’évaporation a lieu à toute température, plus vite au chaud.'],
    ['f4','Elle se produit à environ 100 °C (au niveau de la mer).','ebullition','L’ébullition a lieu à environ 100 °C.'],
    ['f5','Le linge mouillé qui sèche sur la corde.','evaporation','Le linge sèche par évaporation, sans bouillir.'],
    ['f6','L’eau de la casserole sur le feu quand elle bout.','ebullition','C’est l’ébullition : des bulles dans tout le liquide.']];
  const itLib=i=>(ITEMS.filter(x=>x[0]===i)[0]||['',i])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:33,titre:'Atelier · l’eau bout, la vapeur se condense',
      intro:'Je choisis une expérience et le moment. L’ébullition est une démonstration du professeur seul (simulation ici). La vapeur d’eau est un gaz invisible.',
      controles:[{cle:'x',legende:'L’expérience',items:EXP()},{cle:'m',legende:'Le moment',items:MOM}],
      saisie:'J’observe que…',legendeTable:'Mes essais : expérience, moment et observation (valeurs simulées).',F:()=>window.FICHE_CI_MAT33,
      render:v=>{const r=M().vaporisation(v.x,v.m),sc=M().scene.vapo({exp:v.x,moment:v.m});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{exp:v.x,moment:v.m,forme:r.forme,bulles:r.bulles,gouttes:r.gouttes,T:r.T}};}});
    M().tri(panel,X,{id:'formes',titre:'Évaporation ou ébullition ?',intro:'Pour chaque phrase, je choisis la forme de vaporisation.',legende:'C’est',cats:FORMES,
      items:ITEMS.map(i=>({id:i[0],label:i[1],juste:i[2],pourquoi:i[3],aide:'Y a-t-il des bulles dans tout le liquide ?'}))});
  }
  window.FICHE_CI_MAT33={
    id:'NL-CI-6E-MAT-33',version:'0.9',modele:'ebullition-condensation-v1',
    titre:'Réaliser l’ébullition de l’eau et la condensation de la vapeur d’eau',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Réaliser l’ébullition de l’eau et observer la condensation de la vapeur.',
    objectifsPedagogiques:['Dire que l’eau bout à environ 100 °C, avec des bulles dans tout le liquide','Distinguer ébullition et évaporation','Dire que la vapeur d’eau se condense en gouttelettes sur une paroi froide'],
    situationEvaluation:'Sa mère fait bouillir de l’eau : des gouttes se forment sous le couvercle. Awa explique ce qui se passe et nomme chaque changement d’état.',
    objectif:'Reconnaître l’ébullition et la condensation.',objectifEleve:'Savoir ce qui se passe quand l’eau bout et quand la vapeur refroidit.',
    situation:'Sa mère fait bouillir de l’eau dans une casserole. Awa remarque des bulles, puis des gouttes sous le couvercle. À quelle température l’eau bout-elle ? Que devient la vapeur ?',
    materiel:'Simulation : ballon d’eau chauffé par le professeur, thermomètre, paroi froide au-dessus de la vapeur.',
    prevision:{consigne:'Avant les essais, choisis ce qui apparaît sur une paroi froide placée au-dessus de la vapeur d’eau. Justifie ton hypothèse.',choix:[['gouttes','Des gouttelettes d’eau liquide'],['rien','Rien du tout'],['glace','De la glace'],['fumee','De la fumée noire']]},
    protocole:['Observer l’eau tiède, puis l’eau qui bout (professeur).','Lire le thermomètre quand les bulles apparaissent.','Placer la paroi froide au-dessus de la vapeur.','Comparer avec l’évaporation.'],
    variable:'L’expérience',maintenu:'La même eau',
    colonnes:['Expérience','Moment','Observation du modèle','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(EXP(),e.exp),lib(MOM,e.moment),e.forme+(e.T?' · '+e.T+' °C (simulée)':''),e.observation||'—']).concat(M().lignesTri(st,'formes',itLib,c=>lib(FORMES,c))),
    resume:e=>e.tri?itLib(e.item).toLowerCase().slice(0,40)+'… : '+lib(FORMES,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):lib(EXP(),e.exp).toLowerCase()+' ('+lib(MOM,e.moment).toLowerCase()+')',
    confrontation:'1. À quelle température l’eau bout-elle ? 2. Qu’est-ce qui diffère de l’évaporation ? 3. Que devient la vapeur sur la paroi froide ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une observation pour l’ébullition et une pour la condensation.',
    transfert:{q:'La vapeur d’eau est-elle visible ?',rep:'non',expl:'Non : c’est un gaz invisible. Le « nuage » blanc au-dessus de la casserole est fait de fines gouttelettes de liquide.'},
    critere:'Distinguer ébullition et évaporation, et nommer la condensation.',
    essaisMin:6,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit sans nommer.'],['MF','Nomme sans distinguer.'],['MS','Distingue ébullition et évaporation, nomme la condensation.'],['TBM','Distingue, donne environ 100 °C et distingue vapeur et gouttelettes.']],
    peutConfronter:st=>{const v=M().valides(st);return v.some(e=>e.forme==='ébullition'&&e.moment==='tard')&&v.some(e=>e.forme==='condensation'&&e.moment==='tard')&&M().triEtat(st,'formes',ITEMS.map(i=>i[0])).repondus>=6;},
    aides:['L’ébullition forme des bulles dans tout le liquide.','Sur la paroi froide, la vapeur redevient liquide.','L’eau bout à environ 100 °C.'],
    synthese:'L’ébullition est la vaporisation rapide de l’eau, avec des bulles dans tout le liquide, à environ 100 °C. La vapeur d’eau est un gaz invisible : sur une paroi froide, elle se condense en gouttelettes. L’évaporation, elle, est lente et se fait à la surface, à toute température.',
    prof:{reference:'Ébullition : bulles, environ 100 °C ; condensation sur paroi froide ; distinguer de l’évaporation (MAT-24).',attendus:['Observer environ 100 °C.','Observer des gouttelettes.','Distinguer évaporation et ébullition.'],erreurs:['Dire que la vapeur est visible.','Utiliser une flamme sans le professeur.']},
    diagnostic:st=>st.essais.length?['Indicatif : explore l’ébullition et la condensation, au départ puis plus tard.']:['Fais un premier essai.']
  };
})();
