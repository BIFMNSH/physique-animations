/* NohobaLab · 6e Côte d'Ivoire · ELE-09 · Circuit commandé par un bouton poussoir.
   Modèle qualitatif : bouton poussoir ouvert au repos (se ferme pendant l'appui), fermé au repos (s'ouvre pendant l'appui), comparés à un interrupteur. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const EL={pousseNO:'Bouton poussoir ouvert au repos',pousseNF:'Bouton poussoir fermé au repos',inter:'Interrupteur'};
  const AC={repos:'Je n’agis pas sur l’élément',appui:'J’agis et je maintiens (j’appuie ou je bascule)',relache:'Je relâche ma main'};
  function allume(t,a){return t==='pousseNO'?a==='appui':t==='pousseNF'?a!=='appui':(a==='appui'||a==='relache');}
  function manip(panel,X){
    C().bloc(panel,X,{n:9,titre:'Atelier · seul l’élément de commande change',
      intro:'Pile et lampe ne changent pas. Je choisis l’élément de commande, puis ce que je fais avec la main, et j’observe la lampe.',
      controles:[{cle:'t',legende:'L’élément de commande est…',items:[['pousseNO',EL.pousseNO],['pousseNF',EL.pousseNF],['inter',EL.inter]]},{cle:'a',legende:'Avec ma main…',items:[['repos',AC.repos],['appui',AC.appui],['relache',AC.relache]]}],
      saisie:'J’observe que la lampe… pendant l’appui et… après le relâchement.',legendeTable:'Mes essais : élément de commande, action et lampe.',
      F:()=>window.FICHE_CI_ELE09,
      render:v=>{const on=allume(v.t,v.a),m=C().boucle(v.t==='inter'?{pile:'ok',slot1:'inter',s1:{ferme:on},lampe:'ok'}:{pile:'ok',slot1:v.t,s1:{appui:v.a==='appui'},lampe:'ok'});
        return {montage:m.montage,schema:m.schema,txt:EL[v.t]+' · '+AC[v.a].toLowerCase()+' : la lampe est '+(on?'allumée':'éteinte')+'.',essai:{type:v.t,action:v.a,allumee:on}};}});
  }
  window.FICHE_CI_ELE09={
    id:'NL-CI-6E-ELE-09',version:'0.9',modele:'serie-bouton-poussoir-no-nf-v1',
    titre:'Réaliser un circuit électrique commandé par un bouton poussoir',niveau:'6e',
    theme:'Électricité',chapitre:'Commande d’un circuit',
    competenceVisee:'Utiliser un bouton poussoir, ouvert ou fermé au repos, pour commander un circuit pendant l’appui.',
    objectifsPedagogiques:['Réaliser un circuit commandé par un bouton poussoir','Décrire ce qui se passe pendant l’appui et après le relâchement','Distinguer un bouton poussoir d’un interrupteur'],
    situationEvaluation:'La sonnette de la maison d’Awa ne sonne que lorsqu’on appuie. Quel élément le permet, et en quoi diffère-t-il d’un interrupteur ?',
    objectif:'Commander un circuit avec un bouton poussoir et le distinguer d’un interrupteur.',
    objectifEleve:'Savoir utiliser un bouton poussoir.',
    situation:'La sonnette de la maison d’Awa ne sonne que pendant qu’on appuie sur le bouton. Awa veut comprendre quel élément du circuit permet cela.',
    materiel:'Pile plate fictive de 4,5 V, lampe, bouton poussoir ouvert au repos, bouton poussoir fermé au repos, interrupteur, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que fait la lampe avec un bouton poussoir ouvert au repos : pendant l’appui, puis après le relâchement. Justifie ton hypothèse.',choix:[['pendant','Allumée pendant l’appui, éteinte après le relâchement'],['reste','Allumée pendant l’appui et reste allumée après'],['repos','Allumée tant qu’on n’appuie pas, éteinte pendant l’appui'],['jamais','La lampe ne s’allume pas avec un bouton poussoir']]},
    protocole:['Choisir le bouton poussoir ouvert au repos : observer sans agir, avec appui, après relâchement.','Faire de même avec le bouton poussoir fermé au repos.','Refaire les mêmes actions avec l’interrupteur.','Noter chaque observation.'],
    variable:'L’élément de commande et l’action de la main',maintenu:'Pile, lampe et fils',
    colonnes:['Élément','Action','Lampe','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[EL[e.type],AC[e.action],e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>EL[e.type].toLowerCase()+', '+AC[e.action].toLowerCase()+' : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. Avec le bouton ouvert au repos, que fait la lampe pendant l’appui ? après ? 2. Et avec le bouton fermé au repos ? 3. Que fait l’interrupteur quand tu lâches ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai avec appui et un essai après relâchement, avec ce que tu as vu.',
    transfert:{q:'Une sonnette doit sonner seulement pendant qu’on appuie. Quel bouton choisit-on ?',options:[['no','Un bouton poussoir ouvert au repos'],['nf','Un bouton poussoir fermé au repos']],rep:'no',expl:'Ouvert au repos, le circuit ne se ferme que pendant l’appui : la sonnette ne sonne que pendant l’appui. Fermé au repos, c’est l’inverse.'},
    critere:'Décrire l’état du circuit pendant l’appui et après relâchement, pour les deux boutons et l’interrupteur.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas l’appui du relâchement.'],['MF','Décrit un bouton sans comparer avec l’interrupteur.'],['MS','Décrit les deux boutons et l’effet de l’appui.'],['TBM','Distingue bouton poussoir et interrupteur et choisit le bon bouton pour un usage.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=5&&['pousseNO','pousseNF','inter'].every(t=>v.some(e=>e.type===t))&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee);},
    aides:['Regarde l’état du bouton sur le schéma normalisé pendant l’appui.','Compare ce qui se passe après le relâchement pour le bouton et pour l’interrupteur.','Un bouton ouvert au repos se ferme pendant l’appui ; un bouton fermé au repos s’ouvre.'],
    synthese:'Un bouton poussoir commande le circuit seulement pendant l’appui. Ouvert au repos, il ferme le circuit pendant l’appui et la lampe brille ; dès qu’on relâche, elle s’éteint. Fermé au repos, il ouvre le circuit pendant l’appui. Un interrupteur garde sa position quand on lâche la main : c’est la différence avec le bouton poussoir.',
    prof:{reference:'Ouvert au repos : lampe allumée seulement pendant l’appui. Fermé au repos : lampe allumée sauf pendant l’appui. Interrupteur : il garde la position choisie après le relâchement. Le contact de repos du matériel réel est à confirmer sur le matériel utilisé en classe.',attendus:['Hypothèse notée avant l’essai.','Les deux boutons et l’interrupteur testés avec appui et relâchement.','Différence énoncée en une phrase.','Deux schémas (appui / repos).'],erreurs:['Croire que le bouton poussoir garde sa position.','Confondre « ouvert au repos » et « ouvert pendant l’appui ».','Oublier de tester le relâchement.']},
    diagnostic:st=>st.essais.some(e=>e.type==='pousseNF')?['Compare le bouton fermé au repos avec le bouton ouvert au repos.']:['Teste aussi le bouton poussoir fermé au repos.']
  };
})();
