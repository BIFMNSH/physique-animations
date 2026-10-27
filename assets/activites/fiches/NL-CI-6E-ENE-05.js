/* NohobaLab · 6e Côte d'Ivoire · ENE-05 · Construire la chaîne énergétique pile–lampe (niveau 1, guidé). « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : rectangle = réservoir, ovale = convertisseur, flèche = transfert avec la forme d'énergie écrite dessus ; 7 repères numérotés. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const ROLES=['reservoir','recue','convertisseur','utile','recepteur','dissipee','milieu'];
  function manip(panel,X){
    NE().chaineTri(panel,X,{id:'chaine',chaine:'pileLampe',niveau:'guide',figTitre:'Le montage et sa chaîne énergétique',
      titre:'Je complète la chaîne, repère par repère',
      intro:'Sur le dessin, chaque case marquée d’un « ? » porte un numéro. Pour chaque repère, je choisis la bonne réponse : la case se remplit quand elle est juste. Rectangle : réservoir, récepteur ou milieu ; ovale : convertisseur ; flèche : transfert d’énergie, avec sa forme écrite dessus.',
      vigilance:'L’énergie dissipée n’est pas détruite ni « perdue » : elle passe au milieu extérieur.',
      montage:NE().sceneMoment('neuve',true).montage,titreImpression:'La chaîne énergétique pile–lampe'});
  }
  window.FICHE_CI_ENE05={
    id:'NL-CI-6E-ENE-05',version:'0.9',modele:'chaine-pile-lampe-guidee-v1',
    titre:'Construire la chaîne énergétique pile–lampe (niveau 1)',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Compléter une chaîne énergétique à repères numérotés.',
    objectifsPedagogiques:['Placer le réservoir, le convertisseur, le récepteur et le milieu extérieur','Écrire la forme d’énergie sur chaque flèche','Distinguer la flèche de l’énergie utile et celle de l’énergie dissipée'],
    situationEvaluation:'Kofi a dessiné : « pile → lampe → lumière » et rien d’autre. Que manque-t-il à son dessin ? Complète-le.',
    objectif:'Compléter la chaîne énergétique d’une lampe de poche.',objectifEleve:'Savoir dessiner le chemin de l’énergie dans une lampe.',
    situation:'Awa veut dessiner « le chemin de l’énergie » dans sa lampe de poche, de la pile jusqu’à l’air de la pièce.',
    materiel:'Simulation : le montage pile–lampe et une chaîne à sept repères numérotés.',
    prevision:{consigne:'Avant de compléter, choisis la chaîne qui te paraît juste. Justifie ton hypothèse.',choix:[['juste','Pile → énergie électrique → lampe → lumière ; et de la chaleur part vers l’air'],['sans','Pile → lampe → lumière : il n’y a rien d’autre'],['inv','Lampe → énergie lumineuse → pile'],['chal','Pile → chaleur → lampe → lumière']]},
    protocole:['Repérer sur le dessin la pile, la lampe et la flèche entre les deux.','Choisir pour chaque repère la bonne réponse.','Vérifier que chaque flèche porte une forme d’énergie.','Relire la chaîne complète.'],
    variable:'Le repère à compléter',maintenu:'Le montage pile–lampe',
    colonnes:['Repère','Ma réponse','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'chaine',i=>NE().ROLES_NOMS[i],c=>c).map(r=>[r[0],r[1],r[2]]),
    resume:e=>NE().ROLES_NOMS[e.item]+' → '+e.choix+(e.juste?'':' (à revoir)'),
    confrontation:'1. D’où vient l’énergie ? 2. Quelle forme porte la première flèche ? 3. Que fait la lampe de l’énergie reçue ? 4. Où va l’énergie dissipée ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un repère et explique pourquoi ta réponse est juste.',
    transfert:{q:'Dans la chaîne de la lampe, l’énergie dissipée (chaleur) va-t-elle dans le récepteur de lumière ?',rep:'non',expl:'Non : la lumière va vers le récepteur (la pièce éclairée), la chaleur part vers le milieu extérieur (l’air autour de la lampe). Ce sont deux flèches différentes.'},
    critere:'Compléter les sept repères de la chaîne avec la bonne forme d’énergie sur chaque flèche.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Complète un ou deux repères.'],['MF','Complète les blocs mais oublie les formes d’énergie sur les flèches.'],['MS','Complète les sept repères.'],['TBM','Complète les sept repères et explique la flèche dissipée.']],
    peutConfronter:st=>M().triEtat(st,'chaine',ROLES).repondus>=7,
    aides:['Suis le chemin de l’énergie, de la pile à la pièce éclairée.','Chaque flèche porte le nom d’une forme d’énergie.','La lampe convertit l’énergie : une partie va vers la lumière, une partie vers l’air.'],
    synthese:'Pile (réservoir) → énergie électrique → lampe (convertisseur) → énergie lumineuse (utile) vers la pièce éclairée ; une branche d’énergie thermique (dissipée) part vers l’air autour. Rien ne disparaît : l’énergie passe d’un endroit à un autre.',
    prof:{reference:'Réservoir : pile. Flèche 1 : énergie électrique. Convertisseur : lampe. Flèche 2 (utile) : énergie lumineuse vers la pièce éclairée. Flèche 3 (dissipée) : énergie thermique vers l’air autour.',attendus:['Compléter les sept repères.','Expliquer que la chaleur n’est pas détruite.'],erreurs:['Écrire « énergie perdue » pour la chaleur.','Oublier la branche dissipée.']},
    diagnostic:st=>M().triEtat(st,'chaine',ROLES).repondus?['Indicatif : complète les repères un à un.']:['Choisis une réponse pour le repère 1.']
  };
})();
