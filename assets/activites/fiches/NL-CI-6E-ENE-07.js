/* NohobaLab · 6e Côte d'Ivoire · ENE-07 · Construire la chaîne énergétique d'un panneau photovoltaïque (niveau 2, sans repères). « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : la chaîne est construite seule, sans repères nommés ; le montage et la chaîne sont deux dessins distincts. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const ROLES=['reservoir','recue','convertisseur','utile','recepteur','dissipee','milieu'];
  function manip(panel,X){
    NE().chaineTri(panel,X,{id:'panneau',chaine:'panneau',niveau:'libre',figTitre:'Le panneau solaire et sa chaîne énergétique',
      titre:'Je construis seul la chaîne du panneau solaire',
      intro:'Les cases de la chaîne n’ont plus de nom : je dois trouver ce qui va dans chacune. Je lis le montage, je suis le chemin de l’énergie du Soleil jusqu’à la lampe, puis je cherche ce qui part vers l’extérieur. Je choisis dans la liste de chaque case ; elle se remplit quand elle est juste.',
      vigilance:'Une seule case n’accepte qu’une seule réponse juste. La liste contient aussi des intrus.',
      montage:NE().sceneCellule('soleil').montage,titreImpression:'La chaîne énergétique d’un panneau solaire'});
  }
  window.FICHE_CI_ENE07={
    id:'NL-CI-6E-ENE-07',version:'0.9',modele:'chaine-panneau-libre-v1',
    titre:'Construire la chaîne énergétique d’un panneau photovoltaïque (niveau 2)',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Construire seul une chaîne énergétique complète.',
    objectifsPedagogiques:['Choisir seul la source, le convertisseur et le récepteur','Nommer la forme d’énergie de chaque flèche','Ajouter la branche d’énergie dissipée vers le milieu extérieur'],
    situationEvaluation:'Le directeur de l’école installe un panneau solaire. Dessine la chaîne énergétique : d’où vient l’énergie, que fait le panneau, où va-t-elle ?',
    objectif:'Construire sans aide la chaîne énergétique d’un panneau solaire.',objectifEleve:'Savoir construire seul une chaîne d’énergie.',
    situation:'Le directeur veut un panneau solaire pour l’école. Il demande aux élèves de dessiner le chemin de l’énergie, du Soleil à la lampe de la salle de classe.',
    materiel:'Simulation : le montage cellule–lampe et une chaîne à sept cases sans nom ; une liste de réponses avec des intrus.',
    prevision:{consigne:'Avant de construire, choisis ce que le panneau reçoit et ce qu’il donne. Justifie ton hypothèse.',choix:[['lum_elec','Il reçoit de l’énergie lumineuse et donne de l’énergie électrique'],['elec_lum','Il reçoit de l’énergie électrique et donne de la lumière'],['chim_elec','Il reçoit de l’énergie chimique et donne de l’énergie électrique'],['chal_mvt','Il reçoit de la chaleur et donne du mouvement']]},
    protocole:['Lire le montage : le Soleil, le panneau, la lampe.','Remplir la première case (d’où vient l’énergie) puis suivre les flèches.','Écrire la forme d’énergie de chaque flèche.','Ajouter la branche dissipée et le milieu extérieur.'],
    variable:'La case à remplir',maintenu:'Le montage',
    colonnes:['Case','Ma réponse','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'panneau',i=>'Case '+(ROLES.indexOf(i)+1),c=>c).map(r=>[r[0],r[1],r[2]]),
    resume:e=>'case '+(ROLES.indexOf(e.item)+1)+' → '+e.choix+(e.juste?'':' (à revoir)'),
    confrontation:'1. D’où vient l’énergie ? 2. Quelle forme reçoit le panneau ? 3. Quelle forme donne-t-il ? 4. Qu’est-ce qui part vers l’extérieur ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une case et explique pourquoi ta réponse est la bonne.',
    transfert:{q:'Dans la chaîne du panneau solaire, la flèche qui va du panneau vers l’air porte-t-elle de l’énergie lumineuse ?',rep:'non',expl:'Non : elle porte de l’énergie thermique (chaleur), c’est l’énergie dissipée. La lumière est reçue par le panneau ; elle n’en repart pas.'},
    critere:'Construire sans aide la chaîne complète, avec une forme d’énergie sur chaque flèche.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Remplit un ou deux blocs au hasard.'],['MF','Remplit les blocs mais confond les formes d’énergie.'],['MS','Construit la chaîne complète.'],['TBM','Construit la chaîne, explique la branche dissipée et le sépare du montage.']],
    peutConfronter:st=>M().triEtat(st,'panneau',ROLES).repondus>=7,
    aides:['Commence par ce qui arrive sur le panneau : d’où vient-il ?','Un panneau photovoltaïque convertit la lumière en électricité.','Pour la branche dissipée, cherche la chaleur qui part dans l’air.'],
    synthese:'Soleil (source) → énergie lumineuse → panneau photovoltaïque (convertisseur) → énergie électrique (utile) → lampe de l’école (récepteur) ; une branche d’énergie thermique (dissipée) part vers l’air extérieur. Le montage montre les connexions ; la chaîne montre les conversions et les transferts.',
    prof:{reference:'Source : le Soleil. Flèche 1 : énergie lumineuse. Convertisseur : le panneau. Flèche 2 : énergie électrique. Récepteur : la lampe de l’école. Flèche dissipée : énergie thermique vers l’air extérieur.',attendus:['Construire seul les sept cases.','Distinguer montage et chaîne.'],erreurs:['Placer la chaleur sur la flèche utile.','Mettre la pile comme source du panneau.']},
    diagnostic:st=>M().triEtat(st,'panneau',ROLES).repondus?['Indicatif : suis le chemin de l’énergie.']:['Remplis la première case.']
  };
})();
