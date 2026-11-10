/* NohobaLab · 5e · MEL-02 · Séparer un mélange hétérogène.
   Modèle : table de résultats simulés (NohobaMelanges5e.res2). */
(function(){
  'use strict';
  const M=()=>window.NohobaMelanges5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · séparer un mélange hétérogène',idObs:'e-obs',placeholder:'J’observe que la méthode…',
      intro:'Je choisis un mélange et une méthode de séparation, puis j’observe ce qui est séparé.',
      fiche:()=>window.FICHE_5E_MEL02,
      groupes:[{legende:'Mélange',nom:'e-m',items:N.MIX2,def:'sable'},{legende:'Méthode',nom:'e-k',items:N.METH2,def:'decantation'}],
      rendre:v=>{const r=N.res2(v['e-m'],v['e-k']);return {montage:N.montage2(r.m,r.k),schema:N.schema2(r.m,r.k),lecture:r.mix+' · '+r.meth+' : '+r.txt,essai:{m:r.m,k:r.k,sep:r.sep}};}});
  }
  const SEP={oui:'séparé',partiel:'en partie',non:'non séparé'};
  window.FICHE_5E_MEL02={
    id:'NL-5E-MEL-02',version:'0.9',modele:'separation-heterogene-v1',
    titre:'Quelle méthode pour séparer un mélange hétérogène ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'La séparation des constituants d’un mélange',
    competenceVisee:'Choisir la méthode qui sépare les constituants d’un mélange hétérogène.',
    objectifsPedagogiques:['Tester des méthodes de séparation sur un mélange','Comparer ce que chaque méthode sépare','Choisir la méthode adaptée au mélange'],
    situationEvaluation:'Kofi veut récupérer l’huile de palme mélangée à de l’eau. Quelle méthode choisit-il ? Justifie avec tes essais.',
    objectif:'Choisir la bonne méthode pour séparer un mélange hétérogène.',
    objectifEleve:'Savoir choisir une méthode de séparation adaptée.',
    situation:'Au marché, Awa a de l’eau boueuse, de l’eau avec du sable et un flacon où l’huile de palme flotte sur l’eau. Elle veut séparer chaque mélange. Quelle méthode utiliser pour chacun ?',
    materiel:'Béchers, entonnoir, papier filtre, ampoule à décanter, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['adaptee','Chaque mélange demande une méthode adaptée'],['filtration','La filtration sépare tous les mélanges hétérogènes'],['repos','Laisser reposer suffit toujours'],['ampoule','L’ampoule à décanter sépare tous les mélanges']]},
    protocole:['Choisir un mélange hétérogène.','Choisir une méthode : décantation, filtration ou ampoule à décanter.','Observer ce qui est séparé et noter le résultat.','Tester les trois méthodes sur au moins deux mélanges.'],
    variable:'La méthode de séparation',maintenu:'Le mélange testé (un seul à la fois)',
    colonnes:['Mélange','Méthode','Résultat','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.map(e=>[M().res2(e.m,e.k).mix,M().res2(e.m,e.k).meth,SEP[e.sep],e.observation||'—']),
    resume:e=>M().res2(e.m,e.k).mix+' · '+M().res2(e.m,e.k).meth+' : '+SEP[e.sep],
    confrontation:'1. Pour chaque mélange, quelle méthode sépare bien ? 2. Quelle méthode ne sépare rien ? pourquoi ? 3. Compare à ton hypothèse : une seule méthode convient-elle à tout ?',
    retroaction:'Cite un mélange, la méthode adaptée et ce qui est séparé (filtrat, résidu ou liquide).',
    transfert:{q:'Kofi veut séparer l’eau et l’huile de palme. La méthode adaptée est :',rep:'ampoule',options:[['filtration','la filtration'],['ampoule','l’ampoule à décanter'],['evap','l’évaporation'],['couleur','le tri par la couleur']],expl:'L’huile et l’eau sont deux liquides non miscibles qui forment deux couches : l’ampoule à décanter permet de les séparer. La filtration ne sépare pas deux liquides.'},
    critere:'Réaliser au moins cinq essais et associer chaque mélange à la méthode qui le sépare.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas les résultats des méthodes.'],['MF','Décrit les résultats sans associer méthode et mélange.'],['MS','Associe chaque mélange à la méthode adaptée.'],['TBM','Associe, justifie avec le résultat observé et emploie filtrat, résidu et non miscible.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&['sable','huile','boue'].every(m=>v.some(e=>e.m===m&&e.sep==='oui'))&&v.some(e=>e.sep==='non');},
    aides:['Regarde ce qui reste sur le filtre et ce qui passe dessous.','Deux liquides qui ne se mélangent pas forment deux couches.','As-tu trouvé une méthode qui réussit pour chaque mélange ?'],
    synthese:'Pour séparer un mélange hétérogène, on choisit la méthode d’après les constituants. La filtration sépare un solide d’un liquide : le solide reste sur le filtre (résidu) et le liquide qui passe est le filtrat. La décantation laisse déposer un solide. L’ampoule à décanter sépare deux liquides non miscibles.',
    prof:{reference:'Eau et sable : filtration. Eau boueuse : filtration (décantation partielle). Eau et huile de palme : ampoule à décanter ; la filtration ne sépare pas.',attendus:['Hypothèse notée avant les essais.','Au moins cinq essais avec observation.','Chaque mélange associé à sa méthode adaptée.'],erreurs:['Filtrer deux liquides non miscibles.','Croire que la décantation suffit à rendre l’eau limpide.','Utiliser l’ampoule à décanter pour un solide.']},
    diagnostic:st=>E().valides(st).some(e=>e.sep==='non')?['Explique pourquoi cette méthode ne convient pas à ce mélange.']:['Teste une méthode qui ne convient pas pour comprendre pourquoi.']
  };
})();
