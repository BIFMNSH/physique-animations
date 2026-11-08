/* NohobaLab · 6e Côte d'Ivoire · CHI-05 · Réaliser la combustion de l'alcool.
   Modèle qualitatif : coupelle d'alcool allumée par le professeur ; flamme bleue, niveau qui baisse, chaleur, extinction sous un bocal. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:5,titre:'Atelier · la coupelle d’alcool',
      intro:'Le professeur a versé quelques millilitres d’alcool dans la coupelle et l’allume. Je choisis le moment, je regarde la flamme, le niveau d’alcool et le thermomètre simulé, puis j’écris ce que je vois. Simulation : je ne touche ni à l’alcool ni à la flamme.',
      controles:[{cle:'m',legende:'Le moment',items:C().MOMENTS_ALCOOL}],
      saisie:'J’observe que la flamme… que le niveau…',legendeTable:'Mes essais : moment, flamme, niveau.',F:()=>window.FICHE_CI_CHI05,
      render:v=>{const r=C().alcool(v.m),sc=C().sceneAlcool(v.m);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{m:v.m,flamme:r.flamme,niveau:r.niveau,chaud:r.chaud}};}});
  }
  window.FICHE_CI_CHI05={
    id:'NL-CI-6E-CHI-05',version:'0.9',modele:'combustion-alcool-qualitatif-v1',
    titre:'L’alcool qui flambe',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Réaliser la combustion de l’alcool et décrire ce qui est consommé.',
    objectifsPedagogiques:['Décrire la combustion de l’alcool : flamme bleue, chaleur, niveau qui baisse','Comparer avec la combustion du charbon','Montrer que la flamme s’éteint quand le gaz oxygène manque'],
    situationEvaluation:'La grand-mère d’Awa dit que l’alcool du réchaud « s’évapore » quand il brûle. Avec tes essais (flamme, chaleur, bocal), explique pourquoi il s’agit d’une combustion et non d’une simple évaporation.',
    objectif:'Réaliser et décrire la combustion d’un liquide, l’alcool.',objectifEleve:'Savoir décrire la combustion de l’alcool et ce qu’elle consomme.',
    situation:'Au marché, Awa achète un bidon d’alcool à brûler pour le réchaud de sa grand-mère. Que devient l’alcool quand il brûle ? En travaux pratiques, le professeur en allume quelques millilitres dans une coupelle.',
    materiel:'Simulation : coupelle, alcool versé et allumé par le professeur, bocal, thermomètre simulé, soucoupe blanche.',
    prevision:{consigne:'Avant les essais, choisis ce que devient l’alcool. Justifie ton hypothèse.',choix:[['evapore','Il s’évapore seulement, sans brûler'],['cendres','Il brûle et laisse des cendres'],['flamme','Il brûle avec une flamme et son niveau baisse'],['liquide','Un liquide ne peut pas brûler']]},
    protocole:['Observer la coupelle avant l’allumage : niveau, thermomètre.','Le professeur allume l’alcool : observer la flamme (couleur, éclat) et le thermomètre.','Après quelques minutes : observer le niveau d’alcool et une soucoupe passée au-dessus.','Le professeur coiffe la coupelle d’un bocal : observer la flamme.'],
    variable:'Le moment de l’observation',maintenu:'La même coupelle, le même alcool',
    colonnes:['Moment','Flamme','Niveau d’alcool','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().MOMENTS_ALCOOL,e.m),e.flamme?'Bleue, chaude':'Aucune',e.niveau===3?'Plein':'A baissé',e.observation||'—']),
    resume:e=>lib(C().MOMENTS_ALCOOL,e.m).toLowerCase()+' : '+(e.flamme?'flamme bleue':'pas de flamme')+', niveau '+(e.niveau===3?'plein':'baissé'),
    confrontation:'1. Quelle est la couleur de la flamme ? Y a-t-il de la suie ? 2. Que devient le niveau d’alcool ? 3. Pourquoi la flamme s’éteint-elle sous le bocal ? Compare avec le charbon, puis à ton hypothèse.',
    retroaction:'Cite deux moments et ce que tu as observé à chacun.',
    transfert:{q:'Peut-on rajouter de l’alcool dans un réchaud encore allumé pour le « recharger » ?',rep:'non',expl:'Non, jamais : l’alcool est très inflammable ; la flamme peut remonter jusqu’au bidon et provoquer un incendie ou des brûlures graves. On éteint, on laisse refroidir, puis un adulte remplit.'},
    critere:'Décrire la combustion de l’alcool (flamme bleue, chaleur, niveau qui baisse) et conclure qu’elle consomme l’alcool et le gaz oxygène.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense que l’alcool s’évapore seulement.'],['MF','Décrit la flamme sans parler du niveau qui baisse.'],['MS','Relie la baisse du niveau et l’extinction sous le bocal à la combustion.'],['TBM','Compare avec le charbon et énonce ce qui est consommé.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.flamme)&&v.some(e=>e.m==='bocal');},
    aides:['Compare « avant » et « après quelques minutes » : qu’est-ce qui a changé ?','La flamme s’éteint sous le bocal, comme la bougie : quel gaz manque ?','Le charbon rougeoie sans flamme ; l’alcool brûle avec une flamme.'],
    synthese:'L’alcool brûle dans l’air avec une flamme bleue, peu éclairante et chaude, sans suie. Son niveau baisse : l’alcool est consommé, comme le gaz oxygène (dioxygène) de l’air. Sous un bocal, la flamme s’éteint quand le gaz oxygène manque. Le charbon, lui, brûle sans flamme.',
    prof:{reference:'Avant : pas de flamme, coupelle pleine, froide. Allumage : flamme bleue, chaleur. Après quelques minutes : niveau baissé, pas de suie. Sous le bocal : extinction. Conclusion : combustion qui consomme l’alcool et le gaz oxygène.',attendus:['Hypothèse avant l’essai.','Flamme, chaleur et niveau observés.','Extinction sous le bocal reliée au gaz oxygène.','Règle de sécurité du transfert comprise.'],erreurs:['Dire que l’alcool « s’évapore » seulement.','Attendre des cendres.','Croire qu’une flamme bleue est froide.']},
    diagnostic:st=>st.essais.length?['Indicatif : observe aussi le moment « coiffée d’un bocal ».']:['Commence par le moment « avant l’allumage ».']
  };
})();
