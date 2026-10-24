/* NohobaLab · 6e Côte d'Ivoire · ELE-12 · Définir un court-circuit.
   Simulation seulement pour l'élève (aucun court-circuit réel). Échelle d'échauffement qualitative, sans valeur d'intensité. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const FIL={aucun:'Aucun fil ajouté',lampe:'Un fil entre les deux bornes de la lampe',pile:'Un fil entre les deux bornes de la pile'};
  const CH={fort:'fort',aucun:'aucun'};
  function manip(panel,X){
    C().bloc(panel,X,{n:12,titre:'Atelier · simulation : j’ajoute un fil virtuel',
      intro:'Simulation uniquement : aucun court-circuit n’est réalisé en vrai par l’élève. Je choisis où je relie un fil, et j’observe la lampe et l’indicateur d’échauffement (échelle qualitative, sans valeur mesurée).',
      controles:[{cle:'f',legende:'Je place…',items:[['aucun',FIL.aucun],['lampe',FIL.lampe],['pile',FIL.pile]]}],
      saisie:'J’observe que la lampe… et que l’échauffement…',legendeTable:'Mes essais : fil ajouté, lampe et échauffement.',
      F:()=>window.FICHE_CI_ELE12,
      render:v=>{const o={pile:'ok',slot1:'inter',s1:{ferme:true},lampe:'ok'};if(v.f==='lampe'){o.planche=true;o.pont='fil';}if(v.f==='pile')o.courtPile=true;
        const m=C().boucle(o),e=m.etat;
        return {montage:m.montage,schema:m.schema,txt:FIL[v.f]+' : la lampe est '+(e.lampe==='actif'?'allumée':'éteinte')+', échauffement '+(e.courtCircuit?'fort (danger)':'aucun')+'.',essai:{fil:v.f,allumee:e.lampe==='actif',court:e.courtCircuit,echauffement:e.echauffement}};}});
  }
  window.FICHE_CI_ELE12={
    id:'NL-CI-6E-ELE-12',version:'0.9',modele:'court-circuit-qualitatif-v1',
    titre:'Définir un court-circuit',niveau:'6e',
    theme:'Électricité',chapitre:'Court-circuit et protection',
    competenceVisee:'Définir un court-circuit comme une liaison de très faible résistance entre deux points d’un circuit : les bornes du générateur ou les bornes d’un récepteur.',
    objectifsPedagogiques:['Reconnaître un court-circuit sur un schéma','Décrire l’effet d’un court-circuit sur la lampe','Dire pourquoi un court-circuit est une situation à éviter'],
    situationEvaluation:'Awa relie par erreur un fil entre les deux bornes de la pile. Que se passe-t-il pour la lampe et pour la pile, et pourquoi faut-il l’éviter ?',
    objectif:'Définir le court-circuit avec ses mots.',
    objectifEleve:'Savoir reconnaître et définir un court-circuit.',
    situation:'Awa relie par erreur un fil entre les deux bornes de la pile de son circuit. Elle veut comprendre ce qui se passe, sans rien risquer : elle utilise la simulation.',
    materiel:'Pile plate fictive de 4,5 V, lampe, interrupteur fermé, fil de connexion, simulation. Aucune manipulation de court-circuit en vrai pour l’élève.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la lampe quand on ajoute un fil entre les deux bornes de la pile. Justifie ton hypothèse.',choix:[['eteint','La lampe s’éteint et le fil chauffe beaucoup'],['plus','La lampe brille plus fort'],['pareil','Rien ne change'],['seule','La lampe s’éteint mais rien ne chauffe']]},
    protocole:['Observer le circuit sans fil ajouté.','Ajouter un fil virtuel entre les deux bornes de la lampe, observer.','Retirer ce fil, puis en ajouter un entre les deux bornes de la pile, observer.','Noter la lampe et l’échauffement à chaque essai.'],
    variable:'L’endroit où le fil est relié',maintenu:'Pile, lampe et interrupteur fermé',
    colonnes:['Fil ajouté','Lampe','Échauffement','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[FIL[e.fil],e.allumee?'Allumée':'Éteinte',CH[e.echauffement]||'aucun',e.observation||'—']),
    resume:e=>FIL[e.fil].toLowerCase()+' : lampe '+(e.allumee?'allumée':'éteinte')+', échauffement '+(CH[e.echauffement]||'aucun'),
    confrontation:'1. Que fait la lampe quand un fil relie ses deux bornes ? 2. Et quand un fil relie les deux bornes de la pile ? 3. Par où le courant passe-t-il ? 4. Pourquoi est-ce dangereux ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai avec un fil ajouté et ce que tu as observé pour la lampe et l’échauffement.',
    transfert:{q:'Un fil relie directement les deux bornes d’une pile. Est-ce un court-circuit ?',rep:'oui',expl:'Oui : le fil relie directement les deux bornes du générateur. Le courant passe par le fil et non par la lampe, et le générateur et le fil chauffent beaucoup.'},
    critere:'Définir le court-circuit et le reconnaître sur un schéma, avec son effet sur la lampe.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne repère pas le fil ajouté.'],['MF','Décrit la lampe éteinte sans parler du fil.'],['MS','Définit un court-circuit et le reconnaît sur un schéma.'],['TBM','Définit, reconnaît, explique l’échauffement et pourquoi l’éviter.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.fil==='aucun')&&v.some(e=>e.fil==='lampe')&&v.some(e=>e.fil==='pile');},
    aides:['Compare le circuit sans fil ajouté et avec un fil ajouté.','Regarde sur le schéma où passe le courant quand un fil relie deux bornes.','Un court-circuit relie directement deux bornes : celles d’un générateur ou celles d’un récepteur.'],
    synthese:'Un court-circuit est une liaison, de très faible résistance, entre deux points d’un circuit, par exemple les deux bornes de la pile ou les deux bornes de la lampe. Le courant passe par ce fil et non par la lampe, qui s’éteint. Le générateur et le fil chauffent beaucoup : c’est une situation dangereuse à éviter.',
    prof:{reference:'Fil entre les bornes de la lampe ou de la pile : la lampe est éteinte, le courant passe par le fil, échauffement fort (qualitatif). Décision du 24 octobre 2026 : l’élève investigue en simulation ; le professeur peut, facultativement, faire une démonstration réelle après l’investigation, selon un protocole de sécurité à valider (non décrit ici).',attendus:['Hypothèse notée avant l’essai.','Les deux emplacements du fil testés.','Définition rédigée avec les mots de l’élève.','Deux schémas annotés (avec et sans court-circuit).'],erreurs:['Croire que la lampe brille plus fort.','Penser que le court-circuit « ne casse rien ».','Confondre court-circuit et circuit ouvert.']},
    diagnostic:st=>st.essais.some(e=>e.fil==='pile')?['Tu as testé le fil aux bornes de la pile : compare avec le fil aux bornes de la lampe.']:['Teste aussi un fil entre les bornes de la pile.']
  };
})();
