/* NohobaLab · 6e Côte d'Ivoire · CHI-02 · Découvrir quelques sources de pollution de l'air.
   Enquête (pas d'expérience) : huit lieux d'un quartier, un capteur simulé (bon / moyen / mauvais), la source à reconnaître. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    const items=C().LIEUX.map(l=>({id:l.id,label:l.nom+' — capteur : '+lib(C().INDICES,l.indice).toLowerCase(),svg:C().vueLieu(l.id),juste:l.source,pourquoi:l.pourquoi,aide:'Regarde le capteur, puis demande-toi : quelque chose brûle-t-il ici ? de la poussière vole-t-elle ?'}));
    M().tri(panel,X,{id:'sources',titre:'Enquête · d’où vient la pollution de l’air ?',intro:'Je promène le capteur de qualité de l’air (simulé) dans huit lieux du quartier. Pour chaque lieu, je lis l’indice puis je dis d’où vient la pollution.',legende:'Dans ce lieu, la pollution vient de',cats:C().SOURCES,items,impression:{titre:'Mon enquête sur les sources de pollution'}});
  }
  window.FICHE_CI_CHI02={
    id:'NL-CI-6E-CHI-02',version:'0.9',modele:'air-sources-enquete-v1',
    titre:'D’où vient la pollution de l’air ?',niveau:'6e',theme:'Air et combustions',chapitre:'Les constituants de l’air',
    competenceVisee:'Découvrir quelques sources de pollution de l’air en reliant chaque lieu à sa source.',
    objectifsPedagogiques:['Lire un indice qualitatif de qualité de l’air','Reconnaître les sources de pollution : combustions (usines, moteurs, feux d’ordures, cuisine au charbon) et poussières','Repérer les lieux sans source de pollution'],
    situationEvaluation:'Awa dit : « dans notre quartier, seules les usines polluent ». Cite trois autres sources de pollution de l’air que tu as rencontrées dans l’enquête, et dis ce qu’elles ont en commun.',
    objectif:'Identifier des sources de pollution de l’air dans un quartier.',objectifEleve:'Savoir dire d’où vient la pollution de l’air autour de moi.',
    situation:'Dans le quartier de Kofi, près de la zone industrielle de Yopougon, le linge séché dehors noircit et sa petite sœur tousse quand le vent vient de l’usine. Mais est-ce la seule cause ? Le club environnement part en enquête avec un capteur.',
    materiel:'Simulation : carte de huit lieux du quartier, capteur de qualité de l’air à trois niveaux (bon, moyen, mauvais), cartes à classer.',
    prevision:{consigne:'Avant l’enquête, choisis ce que tu penses des sources de pollution. Justifie ton hypothèse.',choix:[['usines','Seules les usines polluent l’air'],['vehicules','Seuls les véhicules polluent l’air'],['jamais','L’air ne peut pas être sali'],['plusieurs','Plusieurs sources : usines, véhicules, feux d’ordures, fumée de cuisine, poussières']]},
    protocole:['Lire l’indice du capteur dans chaque lieu.','Observer la scène : quelque chose brûle-t-il ? de la poussière vole-t-elle ?','Dire d’où vient la pollution (combustion, poussière, aucune) et valider.','Lire le retour et corriger si besoin.'],
    variable:'Le lieu du quartier',maintenu:'Le même capteur, la même façon de lire l’indice',
    colonnes:['Lieu','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>M().lignesTri(st,'sources',i=>C().air(i).nom,c=>lib(C().SOURCES,c)),
    resume:e=>'lieu classé : '+lib(C().SOURCES,e.choix).toLowerCase(),
    confrontation:'1. Quels lieux ont l’indice « mauvais » ? Qu’ont-ils en commun ? 2. Quel lieu est pollué sans combustion ? 3. Quels lieux ont un air propre, et pourquoi ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux lieux pollués et leur source, et un lieu à l’air propre.',
    transfert:{q:'Un fourneau à charbon qui brûle dans une cour fermée pollue-t-il l’air de la cour ?',rep:'oui',expl:'Oui : la combustion du charbon dégage de la fumée et des gaz. Dans une cour fermée, ils restent sur place ; il faut cuisiner en plein air ou aérer.'},
    critere:'Relier chaque lieu à sa source et dire que la plupart des sources de pollution sont des combustions.',
    essaisMin:8,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas lieux pollués et lieux propres.'],['MF','Reconnaît les usines mais pas les autres sources.'],['MS','Relie les lieux pollués à une combustion ou à de la poussière.'],['TBM','Classe les huit lieux et explique le point commun des combustions.']],
    peutConfronter:st=>M().triEtat(st,'sources',C().LIEUX.map(l=>l.id)).repondus>=8,
    aides:['Un indice « mauvais » accompagne presque toujours une fumée : quelque chose brûle.','La poussière salit l’air sans flamme ni fumée.','Un lieu sans feu et sans poussière garde un air propre.'],
    synthese:'La pollution de l’air a plusieurs sources. La plupart sont des combustions : cheminées d’usines, moteurs des véhicules, feux d’ordures, fourneaux à charbon. D’autres sont des poussières soulevées par le vent et les véhicules. Les lieux sans combustion ni poussière gardent un air propre.',
    prof:{reference:'Mauvais : usine, carrefour, feu d’ordures (combustions). Moyen : fourneau (combustion), piste poussiéreuse (poussière). Bon : marché couvert, bord de lagune, cour plantée (aucune source).',attendus:['Huit lieux classés.','Point commun des sources fortes : une combustion.','Un cas de poussière distingué.'],erreurs:['Croire que seules les usines polluent.','Classer la piste poussiéreuse en combustion.','Croire que la fumée de cuisine « ne compte pas ».']},
    diagnostic:st=>st.essais.length?['Indicatif : vérifie les lieux à indice « moyen ».']:['Commence par un lieu à indice « mauvais ».']
  };
})();
