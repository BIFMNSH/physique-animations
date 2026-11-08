/* NohobaLab · 6e Côte d'Ivoire · CHI-15 · Définir l'incendie, l'explosion, l'asphyxie et l'intoxication.
   Quatre scènes dessinées à associer à un mot, puis quatre définitions à associer. Pas d'expérience. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    const sc=C().SCENES.map(s=>({id:s.id,label:s.label,svg:C().vueScene(s.id),juste:s.juste,pourquoi:s.pourquoi,aide:'Que se passe-t-il : un feu qui gagne, un éclatement, un manque d’air, un gaz respiré ?'}));
    M().tri(panel,X,{id:'scenes',titre:'Quatre scènes · quel mot ?',intro:'Pour chaque scène (dessin original, d’après des faits rapportés par la presse), je choisis le mot qui convient.',legende:'Cette scène est',cats:C().MOTS,items:sc});
    const defs=C().MOTS.map(m=>({id:'d_'+m[0],label:'« '+C().definition(m[0])+' »',juste:m[0],pourquoi:'C’est la définition de : '+m[1].toLowerCase()+'.',aide:'Relis les quatre scènes : laquelle correspond à cette phrase ?'}));
    M().tri(panel,X,{id:'defs',titre:'Quatre définitions · quel mot ?',intro:'J’associe chaque définition à son mot.',legende:'Cette définition est celle de',cats:C().MOTS,items:defs,impression:{titre:'Mes quatre définitions'}});
  }
  window.FICHE_CI_CHI15={
    id:'NL-CI-6E-CHI-15',version:'0.9',modele:'quatre-dangers-v1',
    titre:'Quatre mots pour un danger',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Définir l’incendie, l’explosion, l’asphyxie et l’intoxication.',
    objectifsPedagogiques:['Associer une scène à l’un des quatre mots','Énoncer la définition de chaque mot','Distinguer asphyxie (manque de gaz oxygène) et intoxication (gaz toxique)'],
    situationEvaluation:'Un journal titre : « Explosion et incendie dans un dépôt de gaz, douze personnes intoxiquées ». Explique chacun des trois mots soulignés par le professeur.',
    objectif:'Définir les quatre dangers des combustions.',objectifEleve:'Savoir ce que veulent dire incendie, explosion, asphyxie et intoxication.',
    situation:'À la télévision, Kofi voit l’incendie d’un parking au Plateau : des flammes, une fumée noire, une explosion, des personnes soignées pour « intoxication ». Que veulent dire ces quatre mots ?',
    materiel:'Simulation : quatre scènes dessinées, quatre définitions, cartes à associer.',
    prevision:{consigne:'Avant le classement, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['meme','C’est quatre fois la même chose : le feu'],['quatre','Quatre dangers différents : feu qui se propage, éclatement brutal, manque de gaz oxygène, gaz toxique'],['explosionSeule','Seule l’explosion est dangereuse'],['chaleur','L’asphyxie vient de la chaleur']]},
    protocole:['Observer chaque scène et choisir son mot.','Lire le retour et corriger si besoin.','Associer chaque définition à son mot.','Recopier les quatre définitions.'],
    variable:'La scène ou la définition à classer',maintenu:'Les quatre mêmes mots',
    colonnes:['Carte','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>M().lignesTri(st,'scenes',i=>C().SCENES.filter(s=>s.id===i)[0].label,c=>lib(C().MOTS,c)).concat(M().lignesTri(st,'defs',i=>C().definition(i.slice(2)),c=>lib(C().MOTS,c))),
    resume:e=>'carte classée : '+lib(C().MOTS,e.choix).toLowerCase(),
    confrontation:'1. Quelle différence entre un incendie et une explosion ? 2. Quelle différence entre asphyxie et intoxication ? 3. Lequel de ces dangers peut arriver sans aucune flamme visible ? Compare ensuite à ton hypothèse.',
    retroaction:'Donne deux définitions avec un exemple chacune.',
    transfert:{q:'Une personne qui manque d’air dans une pièce fermée où un fourneau a brûlé est-elle intoxiquée ?',rep:'non',expl:'Pas exactement : manquer de gaz oxygène, c’est l’asphyxie. L’intoxication, c’est respirer un gaz toxique. Les deux peuvent arriver en même temps dans une pièce fermée.'},
    critere:'Associer les quatre scènes et les quatre définitions à leur mot.',
    essaisMin:8,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Confond les quatre mots.'],['MF','Distingue incendie et explosion seulement.'],['MS','Associe scènes et définitions.'],['TBM','Explique la différence asphyxie / intoxication avec un exemple.']],
    peutConfronter:st=>M().triEtat(st,'scenes',C().SCENES.map(s=>s.id)).repondus>=4&&M().triEtat(st,'defs',C().MOTS.map(m=>'d_'+m[0])).repondus>=4,
    aides:['Incendie : le feu se propage. Explosion : ça éclate d’un coup.','Asphyxie : il manque du gaz oxygène pour respirer.','Intoxication : on a respiré un gaz ou une fumée toxique.'],
    synthese:'Un incendie est un feu qui se propage et échappe au contrôle. Une explosion est une combustion très rapide qui éclate avec un bruit violent. Une asphyxie est un manque de gaz oxygène (dioxygène) pour respirer. Une intoxication est le fait d’avoir respiré un gaz ou une fumée toxique.',
    prof:{reference:'Scènes : flammes qui gagnent le parking = incendie ; bouteille qui éclate = explosion ; personne qui manque d’air dans la pièce fermée = asphyxie ; fumée respirée, mal de tête = intoxication. Définitions reformulées par NohobaLab (le programme demande de définir les quatre termes).',attendus:['Quatre scènes classées.','Quatre définitions associées.','Asphyxie et intoxication distinguées.'],erreurs:['Confondre asphyxie et intoxication.','Croire que l’explosion est un incendie rapide seulement.','Attribuer l’asphyxie à la chaleur.']},
    diagnostic:st=>st.essais.length?['Indicatif : vérifie asphyxie et intoxication.']:['Commence par les quatre scènes.']
  };
})();
