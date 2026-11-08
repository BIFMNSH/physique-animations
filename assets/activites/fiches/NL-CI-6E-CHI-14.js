/* NohobaLab · 6e Côte d'Ivoire · CHI-14 · Expliquer les dangers liés à la combustion incomplète du butane.
   Simulation « pièce » : virole, fenêtre, durée ; jauges qualitatives (gaz oxygène, gaz toxique invisible, suie) et état d'une personne. Aucune flamme réelle ; le gaz toxique n'est pas nommé côté élève. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:14,titre:'Simulation · un réchaud dans une pièce',
      intro:'Je règle la virole du réchaud, la fenêtre et la durée, puis je lis les jauges simulées et l’état de la personne. Tout est simulé : aucune flamme, aucun gaz réel.',
      controles:[{cle:'v',legende:'La virole du réchaud',items:C().VIROLES},{cle:'f',legende:'La fenêtre',items:C().FENETRES},{cle:'d',legende:'La durée',items:C().DUREES}],
      saisie:'J’observe que les jauges… et que la personne…',legendeTable:'Mes essais : réglages et état de la personne.',F:()=>window.FICHE_CI_CHI14,
      render:v=>{const r=C().piece(v.v,v.f,v.d),sc=C().scenePiece(v.v,v.f,v.d);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{v:v.v,f:v.f,d:v.d,oxygene:r.oxygene,toxique:r.toxique,etat:r.etat}};}});
  }
  window.FICHE_CI_CHI14={
    id:'NL-CI-6E-CHI-14',version:'0.9',modele:'piece-fermee-qualitatif-v1',
    titre:'Le danger invisible',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un gaz dans l’air',
    competenceVisee:'Expliquer les dangers liés à la combustion incomplète du butane dans une pièce fermée.',
    objectifsPedagogiques:['Dire qu’une combustion consomme le gaz oxygène de la pièce','Dire qu’une combustion incomplète forme un gaz toxique invisible et sans odeur, en plus de la suie','Énoncer les règles : flamme bleue, aérer, jamais de réchaud ni de groupe électrogène dans une pièce fermée'],
    situationEvaluation:'Une famille veut se chauffer la nuit avec un réchaud à gaz dans la chambre, fenêtre fermée « pour garder la chaleur ». Explique les deux dangers et ce qu’il faut faire à la place.',
    objectif:'Expliquer les dangers de la combustion incomplète dans une pièce fermée.',objectifEleve:'Savoir pourquoi un réchaud dans une pièce fermée est dangereux, même sans incendie.',
    situation:'Une famille a été retrouvée malade au matin : un réchaud avait brûlé toute la nuit dans une pièce fermée, sans aucun incendie. Pourquoi est-ce dangereux ? Awa et Kofi essaient la simulation de la pièce.',
    materiel:'Simulation : pièce avec réchaud à butane (virole réglable), fenêtre, durée ; jauges de gaz oxygène et de gaz toxique ; personnage dont l’état change.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['sansFlamme','Sans flamme visible, il n’y a pas de danger'],['fumee','Seule la fumée noire est dangereuse'],['toxique','La combustion incomplète consomme le gaz oxygène de la pièce et forme un gaz toxique invisible'],['explosion','Le seul danger est l’explosion']]},
    protocole:['Virole ouverte, fenêtre ouverte, toute la nuit : lire les jauges.','Virole fermée, fenêtre fermée, toute la nuit : lire les jauges et l’état de la personne.','Essayer les deux autres combinaisons sur la nuit.','Comparer quelques minutes et toute la nuit.'],
    variable:'Un réglage à la fois : virole, fenêtre ou durée',maintenu:'La même pièce, le même réchaud',
    colonnes:['Virole','Fenêtre','Durée','Personne','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[e.v,e.f,lib(C().DUREES,e.d),lib(C().ETATS,e.etat),e.observation||'—']),
    resume:e=>'virole '+e.v+', fenêtre '+e.f+', '+lib(C().DUREES,e.d).toLowerCase()+' : '+lib(C().ETATS,e.etat).toLowerCase(),
    confrontation:'1. Quelle combinaison garde la personne en bonne santé toute la nuit ? 2. Que change la fenêtre ? la virole ? 3. Pourquoi le danger existe-t-il même sans flamme jaune ni fumée ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite la combinaison la plus dangereuse et la plus sûre, avec les jauges.',
    transfert:{q:'Un groupe électrogène peut-il tourner dans le salon, porte fermée, pendant une coupure de courant ?',rep:'non',expl:'Non, jamais : son moteur brûle du carburant, consomme le gaz oxygène de la pièce et rejette un gaz toxique invisible et sans odeur. Il doit tourner dehors, loin des fenêtres.'},
    critere:'Tester les quatre combinaisons sur la nuit et expliquer les deux dangers (manque de gaz oxygène, gaz toxique invisible).',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense qu’il n’y a pas de danger sans flamme visible.'],['MF','Voit le danger sans distinguer manque d’oxygène et gaz toxique.'],['MS','Explique les deux dangers et le rôle de la fenêtre.'],['TBM','Énonce les règles et les applique au groupe électrogène.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>e.d==='long');return C().distincts(v,e=>e.v+e.f)>=4;},
    aides:['Compare fenêtre ouverte et fermée avec la même virole.','Le gaz toxique est invisible et sans odeur : seule la jauge le montre.','Même avec une flamme bleue, une pièce fermée perd son gaz oxygène au fil de la nuit.'],
    synthese:'Dans une pièce fermée, une combustion consomme le gaz oxygène (dioxygène) de l’air. Si elle est incomplète, elle forme en plus de la suie et un gaz toxique invisible et sans odeur. Dangers : intoxication et asphyxie, sans incendie. Règles : garder une flamme bleue, aérer, et ne jamais faire fonctionner un réchaud ou un groupe électrogène dans une pièce fermée.',
    prof:{reference:'Virole ouverte + fenêtre ouverte : va bien. Virole fermée + fenêtre fermée, toute la nuit : en danger (gaz toxique très présent). Virole ouverte + fenêtre fermée, toute la nuit : en danger (gaz oxygène très bas). Virole fermée + fenêtre ouverte : mal de tête (suie, un peu de gaz toxique). Le nom du gaz toxique figure dans la note enseignant, hors des fichiers publics (décision du propriétaire).',attendus:['Quatre combinaisons sur la nuit.','Deux dangers distingués.','Règles énoncées.'],erreurs:['Croire que la fenêtre fermée « garde la chaleur » sans risque.','Croire qu’une flamme bleue rend la pièce fermée sûre toute la nuit.','Confondre suie et gaz toxique.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste les quatre combinaisons sur la nuit.']:['Commence par la situation la plus sûre : virole ouverte, fenêtre ouverte.']
  };
})();
