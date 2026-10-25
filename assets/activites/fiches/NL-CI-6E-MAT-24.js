/* NohobaLab · 6e Côte d'Ivoire · MAT-24 · Vaporisation de l'eau (évaporation et ébullition) et condensation de la vapeur d'eau.
   Ébullition : simulation ou démonstration du professeur seul. La vapeur d'eau est un gaz invisible ; le « nuage » blanc est fait de gouttelettes. Valeurs simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
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
  function manip(panel,X){
    M().bloc(panel,X,{n:24,titre:'Atelier · l’eau passe à l’état gazeux, puis redevient liquide',
      intro:'Je choisis une expérience et le moment. L’ébullition est une démonstration du professeur seul (simulation ici). La vapeur d’eau est un gaz invisible.',
      controles:[{cle:'x',legende:'L’expérience',items:M().EXPERIENCES_VAPO},{cle:'m',legende:'Le moment',items:MOM}],
      saisie:'J’observe que…',legendeTable:'Mes essais : expérience, moment et observation (valeurs simulées).',F:()=>window.FICHE_CI_MAT24,
      render:v=>{const r=M().vaporisation(v.x,v.m),sc=M().scene.vapo({exp:v.x,moment:v.m});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{exp:v.x,moment:v.m,forme:r.forme,niveau:r.niveau,bulles:r.bulles,gouttes:r.gouttes,T:r.T}};}});
    M().tri(panel,X,{id:'formes',titre:'Évaporation ou ébullition ?',intro:'Pour chaque phrase, je choisis la forme de vaporisation.',legende:'C’est',cats:FORMES,
      items:ITEMS.map(i=>({id:i[0],label:i[1],juste:i[2],pourquoi:i[3],aide:'Y a-t-il des bulles dans tout le liquide ?'}))});
  }
  const itLib=i=>(ITEMS.filter(x=>x[0]===i)[0]||['',i])[1];
  window.FICHE_CI_MAT24={
    id:'NL-CI-6E-MAT-24',version:'0.9',modele:'vaporisation-condensation-v1',
    titre:'Réaliser la vaporisation de l’eau (évaporation et ébullition) et la condensation de la vapeur d’eau',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Réaliser la vaporisation de l’eau, lente (évaporation) ou rapide (ébullition), et observer la condensation de la vapeur.',
    objectifsPedagogiques:['Distinguer évaporation et ébullition','Dire que l’eau bout à environ 100 °C','Dire que la vapeur d’eau se condense en gouttelettes sur une paroi froide'],
    situationEvaluation:'Le linge sèche sans bouillir, l’eau de la casserole bout et des gouttes se forment sous le couvercle. Nomme chaque phénomène et explique la différence entre les deux premiers.',
    objectif:'Distinguer évaporation, ébullition et condensation.',objectifEleve:'Savoir comment l’eau passe à l’état gazeux et redevient liquide.',
    situation:'Awa étend du linge au soleil : il sèche sans bouillir. Sa mère fait bouillir de l’eau dans une casserole. Dans les deux cas, où va l’eau ? Que devient la vapeur sur le couvercle ?',
    materiel:'Simulation : deux soucoupes d’eau (soleil, ombre), ballon chauffé par le professeur, paroi froide.',
    prevision:{consigne:'Avant les essais, choisis ce qui apparaît sur une paroi froide placée au-dessus de la vapeur d’eau. Justifie ton hypothèse.',choix:[['gouttes','Des gouttelettes d’eau liquide'],['rien','Rien du tout'],['glace','De la glace'],['fumee','De la fumée noire']]},
    protocole:['Comparer les niveaux des soucoupes (soleil, ombre).','Observer l’eau qui bout (professeur) et la température.','Placer la paroi froide au-dessus de la vapeur.','Comparer évaporation et ébullition.'],
    variable:'L’expérience',maintenu:'La même eau',
    colonnes:['Expérience','Moment','Observation du modèle','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(M().EXPERIENCES_VAPO,e.exp),lib(MOM,e.moment),e.forme+(e.T?' · '+e.T+' °C (simulée)':''),e.observation||'—']).concat(M().lignesTri(st,'formes',itLib,c=>lib(FORMES,c))),
    resume:e=>e.tri?itLib(e.item||e.choix).toLowerCase().slice(0,40)+'… : '+lib(FORMES,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):lib(M().EXPERIENCES_VAPO,e.exp).toLowerCase()+' ('+lib(MOM,e.moment).toLowerCase()+')',
    confrontation:'1. Qu’est-ce qui diffère entre l’évaporation et l’ébullition ? 2. À quelle température l’eau bout-elle ? 3. Que devient la vapeur sur la paroi froide ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une observation pour l’évaporation, une pour l’ébullition et une pour la condensation.',
    transfert:{q:'La vapeur d’eau est-elle visible ?',rep:'non',expl:'Non : c’est un gaz invisible. Le « nuage » blanc au-dessus de la casserole est fait de fines gouttelettes de liquide.'},
    critere:'Distinguer évaporation et ébullition, et nommer la condensation.',
    essaisMin:6,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les expériences sans les nommer.'],['MF','Nomme sans distinguer.'],['MS','Distingue évaporation et ébullition, nomme la condensation.'],['TBM','Distingue, donne environ 100 °C et distingue vapeur et gouttelettes.']],
    peutConfronter:st=>{const v=M().valides(st);return v.some(e=>e.forme==='évaporation'&&e.moment==='tard')&&v.some(e=>e.forme==='ébullition'&&e.moment==='tard')&&v.some(e=>e.forme==='condensation'&&e.moment==='tard')&&M().triEtat(st,'formes',ITEMS.map(i=>i[0])).repondus>=6;},
    aides:['Compare les niveaux des deux soucoupes.','L’ébullition forme des bulles dans tout le liquide.','Sur la paroi froide, la vapeur redevient liquide.'],
    synthese:'L’eau passe de l’état liquide à l’état gazeux par vaporisation : lente, à la surface et à toute température, c’est l’évaporation ; rapide, avec des bulles dans tout le liquide à environ 100 °C, c’est l’ébullition. La vapeur d’eau est un gaz invisible : sur une paroi froide, elle se condense en gouttelettes.',
    prof:{reference:'Vaporisation : évaporation (surface, toute température) et ébullition (bulles, environ 100 °C) ; condensation sur paroi froide.',attendus:['Comparer soleil et ombre.','Citer environ 100 °C.','Observer des gouttelettes.'],erreurs:['Dire que la vapeur est visible.','Utiliser une flamme sans le professeur.']},
    diagnostic:st=>st.essais.length?['Indicatif : explore les quatre expériences, au départ puis plus tard.']:['Fais un premier essai.']
  };
})();
