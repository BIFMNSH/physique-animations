/* NohobaLab · 6e Côte d'Ivoire · CHI-06 · Identifier les produits de la combustion de l'alcool.
   Modèle qualitatif : buée sur un verre à pied froid (eau) et eau de chaux (gaz carbonique), chacun avec son témoin. Deux tests seulement, comme les TP DPFC. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:6,titre:'Atelier · deux tests, deux témoins',
      intro:'La coupelle d’alcool brûle (allumée par le professeur). Je choisis le test et la situation, le professeur réalise le geste, je regarde le résultat puis j’écris ce que je vois.',
      controles:[{cle:'t',legende:'Le test',items:C().TESTS},{cle:'s',legende:'La situation',items:C().SITUATIONS_TEST}],
      saisie:'J’observe que…',legendeTable:'Mes essais : test, situation, résultat.',F:()=>window.FICHE_CI_CHI06,
      render:v=>{const r=C().test(v.t,v.s,'alcool'),sc=C().sceneTest(v.t,v.s,'alcool');return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{t:v.t,s:v.s,positif:r.positif}};}});
  }
  const RES=e=>e.t==='buee'?(e.positif?'Buée : eau':'Verre sec'):(e.positif?'Trouble : gaz carbonique':'Claire');
  window.FICHE_CI_CHI06={
    id:'NL-CI-6E-CHI-06',version:'0.9',modele:'produits-alcool-tests-v1',
    titre:'Ce que la flamme fabrique',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Identifier les produits de la combustion de l’alcool par le test de la buée et le test à l’eau de chaux.',
    objectifsPedagogiques:['Reconnaître l’eau par la buée sur un verre froid et sec','Reconnaître le gaz carbonique par l’eau de chaux qui se trouble','Utiliser un témoin pour chaque test'],
    situationEvaluation:'Kofi dit : « la buée sur le verre, c’est l’alcool qui s’est déposé ». Avec le témoin et ce que tu sais du test, explique-lui ce qu’est la buée.',
    objectif:'Mettre en évidence l’eau et le gaz carbonique formés par la combustion de l’alcool.',objectifEleve:'Savoir reconnaître l’eau et le gaz carbonique formés par une combustion.',
    situation:'Après la combustion, l’alcool a disparu. S’est-il envolé, ou s’est-il transformé en d’autres corps ? Le professeur propose deux tests sur la flamme.',
    materiel:'Simulation : coupelle d’alcool allumée par le professeur, verre à pied froid et sec, bocal, eau de chaux (manipulée par le professeur), témoins sans flamme.',
    prevision:{consigne:'Avant les tests, choisis ce que forme la combustion de l’alcool. Justifie ton hypothèse.',choix:[['rien','Il ne reste rien'],['eauSeule','De l’eau seulement'],['fumee','De la fumée noire'],['eauCO2','De l’eau et du gaz carbonique']]},
    protocole:['Le professeur tient un verre à pied froid et sec au-dessus de la flamme : observer.','Témoin : un verre identique posé loin de toute flamme.','Le professeur retourne un bocal sur la flamme, puis y verse de l’eau de chaux et agite : observer.','Témoin : eau de chaux agitée dans un bocal d’air.'],
    variable:'Le test et la situation (flamme ou témoin)',maintenu:'Le même alcool, les mêmes récipients',
    colonnes:['Test','Situation','Résultat','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().TESTS,e.t),e.s==='flamme'?'Flamme':'Témoin',RES(e),e.observation||'—']),
    resume:e=>lib(C().TESTS,e.t).toLowerCase()+', '+(e.s==='flamme'?'flamme':'témoin')+' : '+RES(e).toLowerCase(),
    confrontation:'1. Que montre le verre froid au-dessus de la flamme ? et le témoin ? 2. Que montre l’eau de chaux ? et le témoin ? 3. Quels corps la combustion de l’alcool a-t-elle formés ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les deux tests avec leur témoin.',
    transfert:{q:'Quand le réchaud à alcool brûle dans la cuisine, une buée apparaît sur la vitre froide. Est-ce de l’eau formée par la combustion ?',rep:'oui',expl:'Oui : la combustion de l’alcool produit de l’eau sous forme de vapeur ; elle se dépose en buée sur une surface froide, comme sur le verre à pied.'},
    critere:'Réaliser les deux tests avec leur témoin et conclure : la combustion de l’alcool produit de l’eau et du gaz carbonique.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas les tests à des corps formés.'],['MF','Identifie un produit sur deux.'],['MS','Identifie l’eau et le gaz carbonique.'],['TBM','Explique le rôle des témoins et compare au charbon.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=4&&['buee','chaux'].every(t=>v.some(e=>e.t===t&&e.s==='flamme')&&v.some(e=>e.t===t&&e.s==='temoin'));},
    aides:['La buée sur un verre froid, c’est de l’eau ; vérifie avec le témoin.','L’eau de chaux se trouble avec le gaz carbonique ; le témoin reste clair.','Deux tests positifs : deux corps formés.'],
    synthese:'La combustion de l’alcool produit de l’eau et du gaz carbonique (dioxyde de carbone). L’eau se reconnaît à la buée sur un verre froid et sec ; le gaz carbonique trouble l’eau de chaux. Les témoins, sans combustion, restent secs et clairs.',
    prof:{reference:'Buée, flamme : buée (eau). Buée, témoin : verre sec. Eau de chaux, flamme : trouble (gaz carbonique). Eau de chaux, témoin : claire. Deux tests seulement, comme dans les TP officiels.',attendus:['Quatre essais : deux tests et deux témoins.','Eau et gaz carbonique nommés.','Témoins expliqués.'],erreurs:['Prendre la buée pour de l’alcool.','Oublier les témoins.','Croire qu’une flamme bleue ne forme rien.']},
    diagnostic:st=>st.essais.length?['Indicatif : chaque test a besoin de son témoin.']:['Commence par le verre froid au-dessus de la flamme.']
  };
})();
