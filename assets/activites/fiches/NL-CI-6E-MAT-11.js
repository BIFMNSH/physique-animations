/* NohobaLab · 6e Côte d'Ivoire · MAT-11 · Appliquer les règles de sécurité (manipulation des gaz).
   Scène de paillasse : sept éléments dont cinq défauts. Aucune mise en scène réaliste d’accident. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const CATS=[['danger','Dangereux : je le corrige'],['correct','Correct']];
  const ICO={flamme:'flamme',verre:'verre_casse',flaque:'flaque',blouse:'eleve',tuyau:'tuyau',cuve:'bouteille',lunettes:'lunettesobj'};
  const item=i=>(M().DEFAUTS_PAILLASSE.filter(x=>x.id===i)[0]||{nom:i}).nom;
  const cat=c=>(CATS.filter(x=>x[0]===c)[0]||['',c])[1];
  function manip(panel,X){
    const items=M().DEFAUTS_PAILLASSE.map(d=>({id:d.id,label:d.nom,svg:M().dessin.objetSvg(ICO[d.id],d.nom),juste:d.danger?'danger':'correct',pourquoi:d.regle,aide:'Demande-toi : peut-on se blesser ou provoquer un incendie ?'}));
    M().tri(panel,X,{id:'secu',titre:'La paillasse du gaz : qu’est-ce qui ne va pas ?',intro:'Je regarde chaque élément de la paillasse. Je dis s’il est dangereux ou correct. Quand il est dangereux, je lis la règle qui le corrige.',vigilance:'Simulation : aucun gaz réel. En vrai, seul le professeur ouvre le gaz.',legende:'Cet élément est',cats:CATS,items:items});
  }
  window.FICHE_CI_MAT11={
    id:'NL-CI-6E-MAT-11',version:'0.9',modele:'securite-paillasse-v1',
    titre:'Appliquer les règles de sécurité lors de la manipulation des gaz',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Appliquer les règles de sécurité lors de la manipulation d’un gaz.',
    objectifsPedagogiques:['Repérer les gestes dangereux sur une paillasse','Énoncer la règle de sécurité correspondante','Reconnaître les situations correctes'],
    situationEvaluation:'Avant l’expérience du gaz, tu entres dans la salle. Cite deux dangers possibles sur la paillasse et la règle qui protège dans chaque cas.',
    objectif:'Repérer les dangers et énoncer les règles.',objectifEleve:'Savoir me comporter en sécurité avec un gaz.',
    situation:'La paillasse est préparée pour l’expérience du gaz. Kofi la regarde : plusieurs choses ne vont pas. Aide-le à les repérer.',
    materiel:'Scène virtuelle de paillasse : sept éléments à examiner.',
    prevision:{consigne:'Avant le classement, choisis la règle la plus importante avec un gaz inflammable. Justifie ton hypothèse.',choix:[['flamme','Aucune flamme près du gaz'],['couleur','Choisir un tuyau de belle couleur'],['vite','Travailler très vite'],['rien','Aucune règle particulière']]},
    protocole:['Examiner chaque élément.','Dire s’il est dangereux ou correct.','Lire la règle de sécurité associée.','Retenir cinq règles.'],
    variable:'L’élément examiné',maintenu:'La paillasse',
    colonnes:['Élément','Mon avis','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'secu',item,cat),
    resume:e=>item(e.item).toLowerCase()+' : '+cat(e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quels éléments sont dangereux ? 2. Quelle règle corrige chacun ? 3. Quels éléments étaient corrects ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un danger et la règle qui le corrige.',
    transfert:{q:'Peut-on allumer une bougie près du tuyau de gaz pour mieux voir ?',rep:'non',expl:'Non : le gaz est inflammable, aucune flamme ne doit être près de lui.'},
    critere:'Énoncer cinq règles de sécurité pour la manipulation d’un gaz.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Repère moins de trois dangers.'],['MF','Repère les dangers sans règle.'],['MS','Repère cinq dangers et énonce leurs règles.'],['TBM','Repère, justifie et applique à une nouvelle situation.']],
    peutConfronter:st=>M().triEtat(st,'secu',M().DEFAUTS_PAILLASSE.map(d=>d.id)).repondus>=7,
    aides:['Cherche une flamme, un verre cassé, de l’eau par terre, un vêtement ouvert, un tuyau mal fixé.','Une situation correcte est aussi à reconnaître.','Chaque danger a une règle simple.'],
    synthese:'Avec un gaz : aucune flamme à proximité, tuyau fixé et vérifié par le professeur, pièce aérée, blouse fermée, paillasse sèche, verre cassé signalé.',
    prof:{reference:'Cinq défauts : flamme, verre cassé, flaque, blouse ouverte, tuyau non fixé ; deux éléments corrects.',attendus:['Repérer les cinq défauts.','Énoncer la règle de chacun.','Ne pas condamner les situations correctes.'],erreurs:['Classer une situation correcte comme dangereuse.','Oublier la règle de la blouse ou du tuyau.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les règles des éléments « À revoir ».']:['Examine un premier élément.']
  };
})();
