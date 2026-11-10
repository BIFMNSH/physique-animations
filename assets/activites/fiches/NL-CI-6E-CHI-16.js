/* NohobaLab · 6e Côte d'Ivoire · CHI-16 · Expliquer les dangers des combustions.
   Scène « maison » : six situations à risque ; pour chacune, le danger (incendie, explosion, asphyxie, intoxication) et sa cause (chaleur, gaz formés, gaz sous pression). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    const d=C().MAISON.map(s=>({id:s.id,label:s.nom,svg:C().vueMaison(s.id),juste:s.danger,pourquoi:s.pourquoi,aide:'Qu’est-ce qui peut arriver : un feu, un éclatement, un manque d’air, un gaz respiré ?'}));
    M().tri(panel,X,{id:'dangers',titre:'La maison d’Awa · quel danger ?',intro:'J’inspecte six situations de la maison. Pour chacune, je nomme le danger.',legende:'Le danger est',cats:C().MOTS,items:d});
    const c=C().MAISON.map(s=>({id:'c_'+s.id,label:s.nom,juste:s.cause,pourquoi:s.pourquoi,aide:'La combustion dégage de la chaleur, forme des gaz, et le gaz d’une bouteille est sous pression.'}));
    M().tri(panel,X,{id:'causes',titre:'La maison d’Awa · d’où vient le danger ?',intro:'Pour chaque situation, je dis ce qui rend la combustion dangereuse.',legende:'La cause est',cats:C().CAUSES,items:c,impression:{titre:'Les dangers de la maison'}});
  }
  window.FICHE_CI_CHI16={
    id:'NL-CI-6E-CHI-16',version:'0.9',modele:'dangers-maison-v1',
    titre:'Pourquoi le feu est dangereux',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Expliquer les dangers des combustions en reliant chaque situation à son danger et à sa cause.',
    objectifsPedagogiques:['Repérer une situation à risque dans la maison','Nommer le danger : incendie, explosion, asphyxie, intoxication','Expliquer la cause : chaleur, gaz formés, gaz sous pression'],
    situationEvaluation:'Kofi range une bouteille de gaz neuve à côté du fourneau allumé « pour l’avoir sous la main ». Explique le danger et sa cause, puis propose un meilleur rangement.',
    objectif:'Expliquer pourquoi une combustion peut devenir dangereuse.',objectifEleve:'Savoir repérer un danger de combustion à la maison et l’expliquer.',
    situation:'Une bougie, un fourneau, une bouteille de gaz : des combustions de tous les jours chez Awa. Pourquoi peuvent-elles devenir dangereuses ? Awa inspecte sa maison avec Kofi.',
    materiel:'Simulation : six scènes de la maison, cartes dangers et cartes causes.',
    prevision:{consigne:'Avant l’inspection, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['grandes','Seules les grandes combustions sont dangereuses'],['toute','Toute combustion mal contrôlée est dangereuse : chaleur, gaz, pression'],['jamais','Une combustion bien faite n’est jamais dangereuse'],['electricite','Le danger ne vient que de l’électricité']]},
    protocole:['Observer chaque situation de la maison.','Nommer le danger et valider.','Dire la cause et valider.','Faire le tableau situation / danger / cause.'],
    variable:'La situation inspectée',maintenu:'Les mêmes dangers et causes',
    colonnes:['Situation','Ma réponse','Résultat'],lignesVides:12,
    lignes:st=>M().lignesTri(st,'dangers',i=>C().MAISON.filter(s=>s.id===i)[0].nom,c=>lib(C().MOTS,c)).concat(M().lignesTri(st,'causes',i=>'Cause : '+C().MAISON.filter(s=>s.id===i.slice(2))[0].nom,c=>lib(C().CAUSES,c))),
    resume:e=>e.tri==='dangers'?'danger : '+lib(C().MOTS,e.choix).toLowerCase():'cause : '+lib(C().CAUSES,e.choix).toLowerCase(),
    confrontation:'1. Quel danger revient le plus souvent ? Quelle est sa cause ? 2. Quelles situations sont dangereuses sans aucune flamme ? 3. Quel est le point commun de toutes ces situations ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux situations avec leur danger et leur cause.',
    transfert:{q:'La fumée noire qui sort d’un fourneau mal allumé est-elle seulement gênante pour les yeux ?',rep:'non',expl:'Non : la fumée noire signale une combustion incomplète qui forme des gaz toxiques. C’est un signal : aérer, sortir le fourneau en plein air.'},
    critere:'Relier les six situations à leur danger et à leur cause.',
    essaisMin:12,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne voit de danger que dans les grands feux.'],['MF','Nomme le danger sans la cause.'],['MS','Relie situation, danger et cause.'],['TBM','Explique le point commun et propose une prévention.']],
    peutConfronter:st=>M().triEtat(st,'dangers',C().MAISON.map(s=>s.id)).repondus>=6&&M().triEtat(st,'causes',C().MAISON.map(s=>'c_'+s.id)).repondus>=6,
    aides:['La chaleur d’une flamme peut enflammer ce qui est proche.','Une combustion forme des gaz : dans une pièce fermée, ils s’accumulent et le gaz oxygène manque.','Une bouteille de gaz est sous pression : chauffée, elle peut éclater.'],
    synthese:'Une combustion dégage de la chaleur, forme des gaz et consomme le gaz oxygène (dioxygène) de l’air. Mal contrôlée, elle devient dangereuse : brûlure et incendie (chaleur), asphyxie et intoxication (gaz formés, pièce fermée), explosion (gaz sous pression chauffé). La fumée noire est un signal d’alerte.',
    prof:{reference:'Rideau : incendie, chaleur. Bouteille près du fourneau : explosion, pression. Groupe électrogène dans le salon : intoxication, gaz. Fourneau dans la chambre fermée : asphyxie, gaz. Essence près du feu : incendie, chaleur. Allumettes et enfant : incendie, chaleur.',attendus:['Six dangers nommés.','Six causes expliquées.','Prévention proposée.'],erreurs:['Croire qu’une bouteille de gaz fermée ne craint rien.','Croire qu’une combustion sans flamme visible est sans danger.','Confondre danger et cause.']},
    diagnostic:st=>st.essais.length?['Indicatif : termine par les causes.']:['Commence par nommer les dangers.']
  };
})();
