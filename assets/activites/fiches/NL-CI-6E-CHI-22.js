/* NohobaLab · 6e Côte d'Ivoire · CHI-22 · Identifier le produit de la combustion du charbon de bois.
   Modèle qualitatif : eau de chaux dans le bocal où le charbon a brûlé (trouble) et dans un bocal d'air témoin (claire). Eau de chaux manipulée par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:22,titre:'Atelier · le test à l’eau de chaux',
      intro:'Le charbon incandescent a brûlé dans un bocal (geste du professeur). Je choisis le bocal testé, le professeur verse l’eau de chaux et agite ; je regarde si elle se trouble, puis j’écris ce que je vois.',
      controles:[{cle:'s',legende:'Le bocal testé',items:C().SITUATIONS_TEST}],
      saisie:'J’observe que l’eau de chaux…',legendeTable:'Mes essais : bocal, eau de chaux.',F:()=>window.FICHE_CI_CHI22,
      render:v=>{const r=C().test('chaux',v.s,'charbon'),sc=C().sceneTest('chaux',v.s,'charbon');return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{s:v.s,positif:r.positif}};}});
  }
  window.FICHE_CI_CHI22={
    id:'NL-CI-6E-CHI-22',version:'0.9',modele:'produit-charbon-chaux-v1',
    titre:'Ce que le charbon fabrique',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Identifier le produit de la combustion du charbon de bois grâce au test à l’eau de chaux.',
    objectifsPedagogiques:['Connaître le test du gaz carbonique : l’eau de chaux se trouble','Comparer le bocal de combustion et le bocal témoin','Conclure que la combustion du charbon produit du gaz carbonique (dioxyde de carbone)'],
    situationEvaluation:'Kofi verse de l’eau de chaux dans un bocal où un charbon a brûlé : elle se trouble. Il dit : « c’est la chaleur qui la trouble ». Avec le bocal témoin, explique-lui ce qui trouble l’eau de chaux.',
    objectif:'Mettre en évidence le gaz carbonique formé par la combustion du charbon.',objectifEleve:'Savoir reconnaître le gaz carbonique avec l’eau de chaux.',
    situation:'Le charbon disparaît sans flamme ni fumée visible. Awa se demande s’il forme quelque chose d’invisible. Le professeur propose un test : l’eau de chaux.',
    materiel:'Simulation : bocal où un charbon a brûlé, bocal d’air (témoin), eau de chaux versée et agitée par le professeur.',
    prevision:{consigne:'Avant le test, choisis ce que forme la combustion du charbon. Justifie ton hypothèse.',choix:[['rien','Rien : le charbon disparaît sans rien former'],['eau','De l’eau seulement'],['suie','De la suie noire'],['carbonique','Du gaz carbonique, invisible']]},
    protocole:['Le professeur fait brûler le charbon incandescent dans un bocal, puis le retire.','Le professeur verse l’eau de chaux dans ce bocal et agite : observer.','Faire de même avec un bocal d’air sans combustion (témoin) : observer.','Comparer les deux bocaux.'],
    variable:'Le bocal testé (combustion ou témoin)',maintenu:'La même eau de chaux, la même façon d’agiter',
    colonnes:['Bocal','Eau de chaux','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lib(C().SITUATIONS_TEST,e.s),e.positif?'Se trouble':'Reste claire',e.observation||'—']),
    resume:e=>lib(C().SITUATIONS_TEST,e.s).toLowerCase()+' : eau de chaux '+(e.positif?'trouble':'claire'),
    confrontation:'1. Dans quel bocal l’eau de chaux se trouble-t-elle ? 2. Pourquoi faut-il tester aussi un bocal d’air sans combustion ? 3. Quel gaz la combustion du charbon a-t-elle formé ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite le résultat du bocal de combustion et celui du témoin.',
    transfert:{q:'Si l’eau de chaux versée dans un bocal d’air de la classe reste claire, cela veut-il dire que l’air ne contient aucun gaz carbonique ?',rep:'non',expl:'Non : l’air en contient très peu, trop peu pour troubler l’eau de chaux. Après la combustion, il y en a beaucoup plus : l’eau de chaux se trouble nettement.'},
    critere:'Comparer les deux bocaux et conclure que la combustion du charbon produit du gaz carbonique.',
    essaisMin:2,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne sait pas à quoi sert l’eau de chaux.'],['MF','Voit le trouble sans le comparer au témoin.'],['MS','Compare au témoin et nomme le gaz carbonique.'],['TBM','Explique le rôle du témoin et le lien avec la disparition du charbon.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=2&&v.some(e=>e.s==='flamme')&&v.some(e=>e.s==='temoin');},
    aides:['L’eau de chaux se trouble en présence de gaz carbonique.','Le témoin montre ce qui se passe sans combustion.','Le charbon a disparu : un gaz invisible a pris sa place.'],
    synthese:'La combustion du charbon de bois produit du gaz carbonique (dioxyde de carbone), un gaz invisible. On le reconnaît avec l’eau de chaux : elle se trouble dans le bocal où le charbon a brûlé, et reste claire dans un bocal d’air (témoin).',
    prof:{reference:'Bocal de combustion : eau de chaux trouble. Témoin (air) : claire. Conclusion : gaz carbonique formé. Le TP fait brûler le charbon dans un bocal de dioxygène, le manuel dans un bocal d’air ; la simulation parle d’air (écart signalé).',attendus:['Deux bocaux testés.','Trouble relié au gaz carbonique.','Rôle du témoin expliqué.'],erreurs:['Attribuer le trouble à la chaleur.','Oublier le témoin.','Confondre gaz carbonique et gaz oxygène.']},
    diagnostic:st=>st.essais.length?['Indicatif : n’oublie pas le bocal témoin.']:['Teste d’abord le bocal où le charbon a brûlé.']
  };
})();
