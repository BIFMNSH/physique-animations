/* NohobaLab · 5e · MAT-04 · Combustion du soufre.
   Modèle : table de résultats simulés (NohobaMatiere5e.res4). Chauffage sous la hotte, par le professeur seulement. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · brûler du soufre',idObs:'e-obs',placeholder:'J’observe que…',
      intro:'Je choisis le gaz du flacon et un test. Le professeur chauffe sous la hotte : ici, je l’observe en simulation.',
      fiche:()=>window.FICHE_5E_MAT04,
      groupes:[{legende:'Gaz du flacon',nom:'e-g',items:N.GAZ,def:'o2'},{legende:'Test',nom:'e-t',items:N.TESTS,def:'flamme'}],
      rendre:v=>{const r=N.res4(v['e-g'],v['e-t']);return {montage:N.montage4(r.g,r.t),schema:N.schema4(r.g,r.t),lecture:r.gaz+' · '+r.test+' : '+r.txt,essai:{g:r.g,t:r.t,pos:r.pos}};}});
  }
  window.FICHE_5E_MAT04={
    id:'NL-5E-MAT-04',version:'0.9',modele:'combustion-soufre-v1',
    titre:'Un nouveau corps se forme-t-il quand le soufre brûle ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'La combustion du soufre',
    competenceVisee:'Identifier le produit de la combustion du soufre à partir d’indices observés.',
    objectifsPedagogiques:['Observer les indices d’un nouveau corps (flamme, gaz, tests)','Comparer l’effet du gaz du flacon','Écrire le bilan en mots'],
    situationEvaluation:'Awa observe du soufre qui brûle avec une flamme bleue et dégage un gaz piquant. Quel corps se forme ? Justifie avec les tests.',
    objectif:'Identifier le produit de la combustion du soufre.',
    objectifEleve:'Savoir quel gaz se forme quand le soufre brûle.',
    situation:'Au laboratoire, le professeur fait brûler un peu de soufre sous la hotte : la flamme est bleue et un gaz piquant se dégage. Kofi se demande si un nouveau corps se forme.',
    materiel:'Soufre, flacons d’air, de dioxygène et de diazote, papier pH, permanganate de potassium, hotte, simulation. Manipulation réalisée par le professeur seulement.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['gaz','Un gaz piquant se forme : le soufre et le dioxygène donnent un nouveau corps'],['rien','Rien ne se forme'],['fond','Le soufre fond seulement'],['liquide','La flamme est du soufre liquide']]},
    protocole:['Le professeur fait brûler le soufre sous la hotte.','Choisir le gaz du flacon puis un test : flamme, papier pH humide, permanganate.','Noter ce qui change.','Faire au moins cinq essais, dont un dans le diazote.'],
    variable:'Le gaz du flacon et le test',maintenu:'La quantité de soufre et le chauffage',
    colonnes:['Gaz','Test','Observation du test','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.map(e=>[M().res4(e.g,e.t).gaz,M().res4(e.g,e.t).test,e.pos?'oui':'non',e.observation||'—']),
    resume:e=>M().res4(e.g,e.t).gaz+' · '+M().res4(e.g,e.t).test+' : '+M().res4(e.g,e.t).txt,
    confrontation:'1. Que se passe-t-il avec la flamme, le papier pH et le permanganate dans le dioxygène ? 2. Et dans le diazote ? 3. Que prouvent ces indices ? Compare à ton hypothèse.',
    retroaction:'Cite un test, ce que tu observes, et ce que cela prouve.',
    transfert:{q:'Le soufre brûle avec le dioxygène. Le gaz formé est :',rep:'so2',options:[['so2','le dioxyde de soufre, un gaz suffocant à ne pas respirer'],['co2','le dioxyde de carbone'],['eau','de l’eau'],['rien','aucun gaz']],expl:'Soufre + dioxygène → dioxyde de soufre : gaz suffocant qui rougit le papier pH humide et décolore le permanganate. On ne le respire pas.'},
    critere:'Réaliser au moins cinq essais et conclure : le soufre brûle avec le dioxygène et forme du dioxyde de soufre.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas les tests à un nouveau corps.'],['MF','Décrit les tests sans conclure.'],['MS','Conclut : le soufre brûle avec le dioxygène et forme du dioxyde de soufre.'],['TBM','Conclut, écrit le bilan en mots et justifie avec les indices (flamme, papier pH, permanganate, diazote).']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&v.some(e=>e.g==='n2')&&v.some(e=>e.g==='o2'&&e.t==='ph')&&v.some(e=>e.g==='o2'&&e.t==='kmno');},
    aides:['Compare le dioxygène et le diazote.','Un gaz acide rougit le papier pH humide.','As-tu fait les tests pH et permanganate dans le dioxygène, et un essai dans le diazote ?'],
    synthese:'Le soufre brûle avec une flamme bleue dans le dioxygène et forme un nouveau corps : le dioxyde de soufre, un gaz suffocant. Il rougit le papier pH humide et décolore le permanganate. Bilan en mots : soufre + dioxygène → dioxyde de soufre. Dans le diazote, le soufre ne brûle pas.',
    prof:{reference:'Dioxygène : flamme bleue vive, papier pH rouge, permanganate décoloré. Air : mêmes indices, plus faibles. Diazote : pas de flamme, pas de changement. Bilan : S + O₂ → SO₂. Manipulation par le professeur sous la hotte uniquement.',attendus:['Hypothèse notée avant les essais.','Au moins cinq essais avec observation.','Bilan en mots : soufre + dioxygène → dioxyde de soufre.'],erreurs:['Croire que la flamme est du soufre liquide.','Oublier de comparer avec le diazote.','Confondre dioxyde de soufre et dioxyde de carbone.']},
    diagnostic:st=>E().valides(st).some(e=>e.g==='n2')?['Compare l’essai dans le diazote à celui dans le dioxygène.']:['Fais un essai dans le diazote pour comparer.']
  };
})();
