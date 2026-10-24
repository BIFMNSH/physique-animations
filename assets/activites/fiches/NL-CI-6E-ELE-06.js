/* NohobaLab · 6e Côte d'Ivoire · ELE-06 · Sens conventionnel du courant.
   Modèle qualitatif : pile, interrupteur fermé, moteur et lampe en série. Inverser la pile inverse la rotation du moteur ; la lampe reste allumée.
   La simulation ne démontre pas la convention : elle est introduite explicitement à l'analyse. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const SENS=a=>a==='inverse'?-1:1;
  const nomPile=a=>a==='inverse'?'Pile retournée (polarités inversées)':'Pile dans le sens initial';
  const rot=s=>s>0?'dans le sens des aiguilles d’une montre':'dans le sens inverse des aiguilles d’une montre';
  function manip(panel,X){
    C().bloc(panel,X,{n:6,titre:'Atelier · j’inverse la pile, rien d’autre',
      intro:'Le montage est en série : pile, interrupteur fermé, moteur et lampe. Je ne change qu’une chose : le sens de la pile. J’observe le moteur et la lampe.',
      controles:[{cle:'a',legende:'La pile est…',items:[['normal','Dans le sens initial'],['inverse','Retournée (+ et − échangés)']]}],
      saisie:'J’observe que le moteur… et que la lampe…',legendeTable:'Mes deux essais : sens de la pile, moteur et lampe.',
      F:()=>window.FICHE_CI_ELE06,
      render:v=>{const m=C().boucle({pile:'ok',inverse:v.a==='inverse',slot1:'inter',s1:{ferme:true},moteur:true,lampe:'ok'});
        return {montage:m.montage,schema:m.schema,txt:nomPile(v.a)+'. Le moteur tourne '+rot(SENS(v.a))+' ; la lampe est allumée.',essai:{pile:v.a,sens:SENS(v.a),allumee:true}};}});
  }
  window.FICHE_CI_ELE06={
    id:'NL-CI-6E-ELE-06',version:'0.9',modele:'serie-pile-inversee-moteur-lampe-v1',
    titre:'Découvrir le sens conventionnel du courant électrique',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Indiquer le sens conventionnel du courant dans le circuit extérieur à une pile.',
    objectifsPedagogiques:['Repérer les bornes + et − de la pile','Orienter les flèches du courant de la borne + vers la borne − dans le circuit extérieur','Distinguer une observation (rotation du moteur) de la convention utilisée pour représenter le courant'],
    situationEvaluation:'Awa dessine la flèche du courant dans un sens, Kofi dans l’autre, sur le même circuit. Comment décider ensemble du sens à représenter, et pourquoi la rotation d’un moteur ne suffit-elle pas à trancher ?',
    objectif:'Indiquer le sens conventionnel du courant dans un circuit.',
    objectifEleve:'Savoir dans quel sens dessiner la flèche du courant.',
    situation:'Awa et Kofi ont dessiné le même circuit, mais leurs flèches du courant sont opposées. Leur professeur leur demande de se mettre d’accord sur une représentation commune.',
    materiel:'Pile plate fictive de 4,5 V, interrupteur, moteur à courant continu, lampe à filament, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis dans quel sens tu dessinerais la flèche du courant dans le circuit extérieur à la pile. Justifie ton choix.',choix:[['plusmoins','Du côté de la borne + vers la borne −'],['moinsplus','Du côté de la borne − vers la borne +'],['deux','Dans les deux sens à la fois'],['depend','Cela dépend du moteur ou de la lampe utilisés']]},
    protocole:['Observer le premier essai : pile dans le sens initial, moteur et lampe.','Retourner la pile (les autres éléments ne changent pas).','Observer le sens de rotation du moteur et la lampe.','Écrire deux observations, puis comparer avec la convention annoncée à l’analyse.'],
    variable:'Le sens de la pile (polarités)',maintenu:'Moteur, lampe, interrupteur fermé et fils',
    colonnes:['Pile','Lampe','Moteur','Mon observation'],lignesVides:2,
    lignes:st=>st.essais.map(e=>[nomPile(e.pile),'Allumée','Tourne '+rot(e.sens),e.observation||'—']),
    resume:e=>nomPile(e.pile).toLowerCase()+' : moteur '+rot(e.sens)+', lampe allumée',
    confrontation:'1. Que devient la rotation du moteur quand tu retournes la pile ? 2. Que devient la lampe ? 3. Cette observation t’apprend-elle quelque chose sur le choix d’une flèche ? Rappel : par convention, dans le circuit extérieur à la pile, on représente le courant de la borne + vers la borne −. Compare ensuite à ta prévision.',
    retroaction:'Cite l’essai où le moteur tourne dans un sens et celui où il tourne dans l’autre.',
    transfert:{q:'Dans un circuit extérieur à la pile, la flèche qui représente le courant part…',options:[['plus','de la borne + de la pile'],['moins','de la borne − de la pile']],rep:'plus',expl:'Par convention, dans le circuit extérieur à la pile, on représente le courant de la borne + vers la borne −. C’est un choix de représentation : la flèche n’indique ni une vitesse ni le déplacement des électrons.'},
    critere:'Dessiner les flèches du courant de + vers − dans le circuit extérieur et dire qu’il s’agit d’une convention.',
    essaisMin:2,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne repère pas les bornes de la pile.'],['MF','Décrit les effets de l’inversion sans placer de flèches.'],['MS','Place les flèches de + vers − dans le circuit extérieur.'],['TBM','Place les flèches, distingue observation et convention et corrige un schéma faux.']],
    peutConfronter:st=>{const v=C().valides(st);return v.some(e=>e.pile==='normal')&&v.some(e=>e.pile==='inverse');},
    aides:['Compare les deux essais : qu’est-ce qui a changé, qu’est-ce qui n’a pas changé ?','Regarde où sont les signes + et − sur le schéma normalisé.','On convient de représenter le courant du côté + vers le côté − dans le circuit extérieur.'],
    synthese:'Quand on retourne la pile, le moteur tourne dans l’autre sens et la lampe reste allumée. Cette observation montre un effet de l’inversion des bornes ; elle ne permet pas de choisir une représentation. Par convention, dans le circuit extérieur à la pile, on dessine le courant de la borne + vers la borne −. Cette flèche est un choix de représentation : elle ne donne ni une vitesse ni le sens de déplacement des électrons.',
    prof:{reference:'Pile dans le sens initial : le moteur tourne dans un sens, la lampe brille. Pile retournée : le moteur tourne dans l’autre sens, la lampe brille. La convention (courant du + vers le − dans le circuit extérieur) est annoncée à l’analyse : la simulation ne la démontre pas.',attendus:['Hypothèse notée avant l’essai.','Les deux orientations de la pile observées et rédigées.','Flèches de + vers − dans le circuit extérieur sur les deux schémas.','Distinction entre observation et convention.'],erreurs:['Croire que la rotation du moteur prouve le sens du courant.','Penser que la lampe s’éteint quand on inverse la pile.','Dessiner les flèches à l’intérieur de la pile comme dans le circuit extérieur.']},
    diagnostic:st=>st.essais.some(e=>e.pile==='inverse')?['Tu as testé la pile retournée : compare la rotation et la lampe avec le premier essai.']:['Retourne aussi la pile pour comparer.']
  };
})();
