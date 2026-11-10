/* NohobaLab · 6e Côte d'Ivoire · CHI-01 · Découvrir les constituants essentiels de l'air.
   Modèle qualitatif : bougie dans un cristallisoir d'eau colorée, coiffée ou non d'un bocal (méthode du guide et du TP).
   Sous le bocal la flamme s'éteint et l'eau monte d'environ 1/5 ; sans bocal elle brûle. Flamme allumée par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:1,titre:'Atelier · la bougie sous le bocal',
      intro:'Le professeur a allumé la bougie posée dans le cristallisoir d’eau colorée. Je choisis le récipient qui la coiffe, je regarde la flamme et le niveau d’eau, puis j’écris ce que je vois. Simulation : je ne touche à aucune flamme.',
      controles:[{cle:'r',legende:'Le récipient qui coiffe la bougie',items:C().RECIPIENTS}],
      saisie:'J’observe que la flamme… et que l’eau…',legendeTable:'Mes essais : récipient, flamme, niveau d’eau.',F:()=>window.FICHE_CI_CHI01,
      render:v=>{const b=C().bougie(v.r),sc=C().sceneBougie(v.r);return {montage:sc.montage,schema:sc.schema,txt:b.txt,essai:{r:v.r,flamme:b.flamme,montee:b.montee}};}});
  }
  window.FICHE_CI_CHI01={
    id:'NL-CI-6E-CHI-01',version:'0.9',modele:'air-bougie-qualitatif-v1',
    titre:'De quoi l’air est-il fait ?',niveau:'6e',theme:'Air et combustions',chapitre:'Les constituants de l’air',
    competenceVisee:'Découvrir les constituants essentiels de l’air à partir de la bougie sous un bocal.',
    objectifsPedagogiques:['Dire que l’air est un mélange de gaz','Nommer le gaz oxygène (dioxygène), qui entretient la combustion, et le gaz azote (diazote), qui ne l’entretient pas','Relier l’extinction de la bougie et la montée de l’eau à la consommation d’un gaz'],
    situationEvaluation:'Kofi affirme : « quand la bougie s’éteint sous le bocal, c’est parce que tout l’air a été consommé ». Explique-lui, avec l’expérience, pourquoi il reste un gaz dans le bocal.',
    objectif:'Montrer que l’air est un mélange d’au moins deux gaz.',objectifEleve:'Savoir dire de quels gaz l’air est fait et lequel entretient la combustion.',
    situation:'Awa, du club environnement de son collège de Yopougon, dit : « l’air, c’est de l’oxygène ». Kofi pense qu’il y a autre chose dedans. Qui a raison ? Le professeur propose l’expérience de la bougie sous le bocal.',
    materiel:'Simulation : cristallisoir d’eau colorée, bougie (allumée par le professeur), petit bocal, grand bocal.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses de l’air. Justifie ton hypothèse.',choix:[['seul','L’air est un seul gaz, l’oxygène'],['vide','L’air, c’est du vide : il n’y a rien dedans'],['melange','L’air est un mélange de plusieurs gaz'],['carbonique','L’air est surtout du gaz carbonique']]},
    protocole:['Le professeur allume la bougie posée dans le cristallisoir d’eau colorée.','Observer la bougie sans récipient : flamme et niveau d’eau.','Coiffer la bougie du petit bocal : noter ce que fait la flamme et le niveau d’eau.','Recommencer avec le grand bocal et comparer.'],
    variable:'Le récipient qui coiffe la bougie (aucun, petit, grand)',maintenu:'La même bougie, la même eau colorée',
    colonnes:['Récipient','Flamme','Eau dans le bocal','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().RECIPIENTS,e.r),e.flamme==='brule'?'Continue de brûler':'S’éteint',e.montee?'Monte (environ 1/5)':'Ne change pas',e.observation||'—']),
    resume:e=>lib(C().RECIPIENTS,e.r).toLowerCase()+' : flamme '+(e.flamme==='brule'?'qui brûle':'éteinte')+', eau '+(e.montee?'montée':'inchangée'),
    confrontation:'1. Pourquoi la flamme s’éteint-elle sous le bocal et pas à l’air libre ? 2. Pourquoi l’eau monte-t-elle, et d’environ quelle part du bocal ? 3. La bougie éteinte, reste-t-il un gaz dans le bocal ? Lequel ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai précis : récipient, ce qu’a fait la flamme, ce qu’a fait l’eau.',
    transfert:{q:'On souffle sur les braises d’un fourneau pour les raviver. Est-ce parce que l’air apporte du gaz oxygène ?',rep:'oui',expl:'Oui : souffler renouvelle l’air autour des braises et leur apporte du gaz oxygène (dioxygène), le gaz qui entretient la combustion.'},
    critere:'Conclure que l’air est un mélange : un gaz consommé par la combustion (gaz oxygène) et un gaz restant qui ne l’entretient pas (gaz azote).',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Dit que l’air est un seul gaz ou du vide.'],['MF','Voit que la flamme s’éteint mais ne relie pas à un gaz consommé.'],['MS','Relie l’extinction et la montée de l’eau à la consommation d’un gaz de l’air.'],['TBM','Nomme les deux gaz, leur rôle, et explique le gaz restant.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.r==='aucun')&&v.some(e=>e.montee);},
    aides:['Compare la flamme sans récipient et sous le bocal : qu’est-ce qui change pour l’air autour de la bougie ?','L’eau monte pour prendre la place d’un gaz qui a été consommé.','La bougie éteinte, il reste un gaz dans le bocal : il n’entretient pas la combustion.'],
    synthese:'L’air est un mélange de gaz. Il contient surtout du gaz azote (diazote), qui n’entretient pas les combustions, et du gaz oxygène (dioxygène), qui les entretient et que la bougie consomme. Sous le bocal, la flamme s’éteint quand le gaz oxygène manque ; l’eau monte et prend la place du gaz consommé, environ 1/5 du bocal.',
    prof:{reference:'Sans récipient : la bougie brûle, le niveau ne change pas. Sous le petit bocal : la flamme s’éteint vite, l’eau monte d’environ 1/5. Sous le grand bocal : la flamme s’éteint plus tard, l’eau monte aussi d’environ 1/5 du bocal. Conclusion : l’air est un mélange ; le gaz oxygène est consommé, le gaz azote reste.',attendus:['Hypothèse formulée avant l’essai.','Trois essais avec un contraste (air libre / bocal).','Extinction reliée au manque de gaz oxygène.','Montée de l’eau reliée au gaz consommé ; gaz restant nommé.'],erreurs:['Croire que tout l’air est consommé.','Croire que la flamme « aspire » l’eau.','Confondre gaz oxygène et air.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare toujours à l’essai sans récipient.']:['Fais un premier essai sans récipient.']
  };
})();
