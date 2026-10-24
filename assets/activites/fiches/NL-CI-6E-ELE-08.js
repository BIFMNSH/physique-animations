/* NohobaLab · 6e Côte d'Ivoire · ELE-08 · Circuit commandé par un interrupteur simple.
   Modèle qualitatif : boucle unique en série ; l'interrupteur ouvert coupe la boucle, où qu'il soit placé. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const EMP={avant:'Avant la lampe (côté borne −)',apres:'Après la lampe (côté borne +)'};
  const POS={ferme:'fermé',ouvert:'ouvert'};
  function manip(panel,X){
    C().bloc(panel,X,{n:8,titre:'Atelier · un seul changement à la fois',
      intro:'Pile, lampe et interrupteur sont en série. Je choisis où se trouve l’interrupteur, puis sa position, et j’observe la lampe.',
      controles:[{cle:'e',legende:'L’interrupteur est placé…',items:[['avant',EMP.avant],['apres',EMP.apres]]},{cle:'p',legende:'L’interrupteur est…',items:[['ferme','Fermé'],['ouvert','Ouvert']]}],
      saisie:'J’observe que la lampe… quand l’interrupteur est…',legendeTable:'Mes essais : emplacement, position et état de la lampe.',
      F:()=>window.FICHE_CI_ELE08,
      render:v=>{const f=v.p==='ferme',m=C().boucle(v.e==='avant'?{pile:'ok',slot1:'inter',s1:{ferme:f},lampe:'ok'}:{pile:'ok',slot2:'inter',s2:{ferme:f},lampe:'ok'});
        return {montage:m.montage,schema:m.schema,txt:'Interrupteur '+POS[v.p]+', '+EMP[v.e].toLowerCase()+' : la lampe est '+(f?'allumée':'éteinte')+'.',essai:{emp:v.e,pos:v.p,allumee:f}};}});
  }
  window.FICHE_CI_ELE08={
    id:'NL-CI-6E-ELE-08',version:'0.9',modele:'serie-pile-lampe-interrupteur-v1',
    titre:'Réaliser un circuit électrique commandé par un interrupteur simple',niveau:'6e',
    theme:'Électricité',chapitre:'Commande d’un circuit',
    competenceVisee:'Placer un interrupteur dans la boucle d’un circuit pour commander une lampe.',
    objectifsPedagogiques:['Réaliser un circuit comprenant une pile, une lampe et un interrupteur','Prévoir l’état de la lampe selon la position de l’interrupteur','Légender le schéma normalisé du circuit commandé'],
    situationEvaluation:'Kofi veut allumer et éteindre la lampe de sa chambre sans débrancher la pile. Où place-t-il l’interrupteur, et que se passe-t-il quand il l’ouvre ?',
    objectif:'Commander une lampe avec un interrupteur placé dans la boucle.',
    objectifEleve:'Savoir commander une lampe avec un interrupteur.',
    situation:'Kofi veut allumer et éteindre la lampe de sa chambre sans débrancher la pile à chaque fois. Il se demande ce qu’il faut ajouter au circuit et où le placer.',
    materiel:'Pile plate fictive de 4,5 V, lampe, interrupteur, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la lampe quand on ouvre, puis quand on ferme l’interrupteur. Justifie ton hypothèse.',choix:[['ouvreEteint','Interrupteur ouvert : lampe éteinte ; fermé : lampe allumée'],['ouvreAllume','Interrupteur ouvert : lampe allumée ; fermé : lampe éteinte'],['toujours','La lampe reste allumée quelle que soit la position'],['place','Cela dépend de l’endroit où on place l’interrupteur']]},
    protocole:['Placer l’interrupteur avant la lampe, d’abord fermé puis ouvert.','Changer un seul élément à la fois : déplacer l’interrupteur après la lampe, puis refaire fermé et ouvert.','Observer la lampe avec le schéma normalisé.','Noter chaque observation.'],
    variable:'La position de l’interrupteur, puis son emplacement',maintenu:'Pile, lampe et fils',
    colonnes:['Emplacement','Interrupteur','Lampe','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[EMP[e.emp],POS[e.pos],e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>'interrupteur '+POS[e.pos]+' ('+EMP[e.emp].toLowerCase()+') : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. Que fait la lampe quand l’interrupteur est ouvert ? fermé ? 2. Le résultat change-t-il quand tu déplaces l’interrupteur avant ou après la lampe ? 3. Que devient la boucle quand il est ouvert ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai « ouvert » et un essai « fermé » avec ce que tu as observé sur la lampe.',
    transfert:{q:'Dans un circuit en série (une seule boucle), l’interrupteur ouvert éteint-il la lampe quel que soit son emplacement dans la boucle ?',rep:'oui',expl:'Oui : il n’y a qu’une seule boucle. L’interrupteur ouvert la coupe, où qu’il soit placé : plus rien ne passe.'},
    critere:'Réaliser le circuit et expliquer qu’un interrupteur ouvert coupe la boucle.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas la position de l’interrupteur à la lampe.'],['MF','Décrit les deux états sans parler de la boucle.'],['MS','Explique que l’interrupteur ouvert coupe la boucle.'],['TBM','Explique, légende le schéma et montre que l’emplacement ne change rien.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=4&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee)&&v.some(e=>e.emp==='avant')&&v.some(e=>e.emp==='apres');},
    aides:['Compare l’état de la lampe quand l’interrupteur est ouvert et fermé.','Regarde la boucle sur le schéma normalisé : est-elle fermée ?','As-tu essayé les deux emplacements ?'],
    synthese:'Un interrupteur placé dans la boucle commande le circuit. Fermé, il laisse la boucle fermée et la lampe brille. Ouvert, il coupe la boucle et la lampe est éteinte. Dans un circuit en série, l’emplacement de l’interrupteur dans la boucle ne change pas la commande.',
    prof:{reference:'Interrupteur fermé : la lampe brille, quel que soit l’emplacement. Interrupteur ouvert : la boucle est ouverte, la lampe est éteinte, quel que soit l’emplacement.',attendus:['Hypothèse notée avant l’essai.','Les deux positions testées pour chaque emplacement.','Phrase : un interrupteur ouvert coupe la boucle.','Schéma normalisé légendé.'],erreurs:['Croire que l’interrupteur doit être près de la pile.','Confondre interrupteur fermé et circuit fermé de la lampe sans pile.','Dessiner l’interrupteur ouvert avec une boucle fermée.']},
    diagnostic:st=>st.essais.some(e=>e.emp==='apres')?['Tu as testé les deux emplacements : que remarques-tu ?']:['Déplace l’interrupteur après la lampe et refais l’essai.']
  };
})();
