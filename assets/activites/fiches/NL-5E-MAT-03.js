/* NohobaLab · 5e · MAT-03 · Combustion du carbone.
   Modèle : table de résultats simulés (NohobaMatiere5e.res3). Chauffage réalisé par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · brûler du carbone',idObs:'e-obs',placeholder:'J’observe que le carbone…',
      intro:'Je choisis le gaz du flacon. Le chauffage est réalisé par le professeur : ici, je l’observe en simulation.',
      fiche:()=>window.FICHE_5E_MAT03,
      groupes:[{legende:'Gaz du flacon',nom:'e-g',items:N.GAZ,def:'air'}],
      rendre:v=>{const r=N.res3(v['e-g']);return {montage:N.montage3(r.g),schema:N.schema3(r.g),lecture:r.gaz+' : '+r.txt,essai:{g:r.g,brule:r.brule,chaux:r.chaux}};}});
  }
  const BR={non:'ne brûle pas',lente:'rougeoie',vive:'brûle vivement'};
  window.FICHE_5E_MAT03={
    id:'NL-5E-MAT-03',version:'0.9',modele:'combustion-carbone-v1',
    titre:'Que se passe-t-il quand le carbone brûle ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'La combustion du carbone',
    competenceVisee:'Identifier le rôle du dioxygène et le produit de la combustion du carbone.',
    objectifsPedagogiques:['Comparer la combustion du carbone dans trois gaz','Identifier le gaz formé avec l’eau de chaux','Écrire le bilan en mots'],
    situationEvaluation:'Kofi allume du charbon de bois. Qu’est-ce qui permet au carbone de brûler et quel gaz se forme ? Justifie avec tes essais.',
    objectif:'Identifier le dioxygène et le produit de la combustion du carbone.',
    objectifEleve:'Savoir ce qui est nécessaire et ce qui se forme.',
    situation:'Kofi allume du charbon de bois pour le repas. Le charbon rougeoie, puis il devient cendre. Awa se demande ce qu’il faut pour qu’il brûle et ce qu’il devient.',
    materiel:'Charbon de bois (carbone), flacons d’air, de dioxygène et de diazote, eau de chaux, simulation. Le chauffage est réalisé par le professeur.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['o2','Le carbone brûle avec le dioxygène et forme du dioxyde de carbone'],['sansair','Le carbone brûle sans aucun gaz'],['disparait','Le carbone disparaît sans rien former'],['eau','Il se forme seulement de l’eau']]},
    protocole:['Le professeur chauffe un morceau de carbone dans un flacon.','Observer le carbone dans l’air, le dioxygène, puis le diazote.','Observer l’eau de chaux après chaque essai.','Noter une observation par essai.'],
    variable:'Le gaz du flacon',maintenu:'Le morceau de carbone et le chauffage',
    colonnes:['Gaz','Le carbone…','Eau de chaux','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[M().res3(e.g).gaz,BR[e.brule],e.chaux==='trouble'?'trouble':'limpide',e.observation||'—']),
    resume:e=>M().res3(e.g).gaz+' : le carbone '+BR[e.brule]+', eau de chaux '+(e.chaux==='trouble'?'trouble':'limpide'),
    confrontation:'1. Dans quel gaz le carbone brûle-t-il le mieux ? 2. Que devient l’eau de chaux quand le carbone brûle ? 3. Dans le diazote, que se passe-t-il ? Compare à ton hypothèse.',
    retroaction:'Cite un gaz, ce que fait le carbone, et ce qui se passe avec l’eau de chaux.',
    transfert:{q:'Kofi cuisine sur un réchaud à charbon dans une pièce fermée. Il manque de dioxygène : pourquoi faut-il aérer ?',rep:'aerer',options:[['aerer','Le carbone a besoin de dioxygène pour brûler ; mal aéré, il peut se former un gaz dangereux (monoxyde de carbone)'],['rien','Le carbone brûle sans air, il n’y a aucun risque'],['eau','Le carbone se transforme en eau'],['froid','Aérer sert à refroidir le charbon']],expl:'Le carbone brûle grâce au dioxygène. Quand l’air manque, la combustion est mauvaise et peut former du monoxyde de carbone, un gaz dangereux : on aère toujours.'},
    critere:'Tester les trois gaz et conclure : le carbone brûle avec le dioxygène et forme du dioxyde de carbone.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas les trois essais.'],['MF','Décrit les essais sans identifier le produit.'],['MS','Dit que le carbone brûle avec le dioxygène et forme du dioxyde de carbone.'],['TBM','Conclut, écrit le bilan en mots et justifie avec l’eau de chaux.']],
    peutConfronter:st=>{const v=E().valides(st);return ['air','o2','n2'].every(g=>v.some(e=>e.g===g));},
    aides:['Compare le carbone dans les trois flacons.','L’eau de chaux se trouble en présence de dioxyde de carbone.','As-tu testé l’air, le dioxygène et le diazote ?'],
    synthese:'La combustion du carbone a besoin de dioxygène. Le carbone brûle avec le dioxygène et forme du dioxyde de carbone, que l’eau de chaux trouble permet d’identifier. Bilan en mots : carbone + dioxygène → dioxyde de carbone. Dans le diazote, le carbone ne brûle pas.',
    prof:{reference:'Air : le carbone rougeoie, eau de chaux trouble. Dioxygène : combustion vive, eau de chaux trouble. Diazote : pas de combustion. Bilan : C + O₂ → CO₂ (un atome de carbone, deux atomes d’oxygène). Chauffage réalisé par le professeur uniquement.',attendus:['Hypothèse notée avant les essais.','Les trois gaz testés avec observation.','Bilan en mots : carbone + dioxygène → dioxyde de carbone.'],erreurs:['Croire que le carbone disparaît.','Croire que l’eau se forme.','Oublier le rôle du dioxygène.']},
    diagnostic:st=>E().valides(st).some(e=>e.g==='n2')?['Compare le diazote aux deux autres flacons : qu’est-ce qui manque ?']:['Teste le flacon de diazote.']
  };
})();
