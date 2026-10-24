/* NohobaLab · 6e Côte d'Ivoire · ELE-14 · Dangers d'un court-circuit.
   Échelle QUALITATIVE d'échauffement d'un fil (aucun, chaud, très chaud, gaine qui fond) selon la durée. Aucune valeur d'intensité ni de température. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const DU={0:'Pas de court-circuit',1:'Court-circuit bref',2:'Court-circuit moyen',3:'Court-circuit long'};
  const NIV=['Aucun échauffement','Le fil est chaud','Le fil est très chaud','La gaine du fil fond : danger'];
  function manip(panel,X){
    C().bloc(panel,X,{n:14,titre:'Atelier · simulation : la durée du court-circuit',
      intro:'Simulation qualitative : je choisis la durée du court-circuit et j’observe l’échauffement du fil et de sa gaine. L’échelle est qualitative, sans valeur mesurée.',
      controles:[{cle:'d',legende:'Le court-circuit dure…',items:[['0',DU[0]],['1',DU[1]],['2',DU[2]],['3',DU[3]]]}],
      saisie:'J’observe que le fil… et que la gaine…',legendeTable:'Mes essais : durée et échauffement du fil.',
      F:()=>window.FICHE_CI_ELE14,
      render:v=>{const d=Number(v.d),o={pile:'ok',slot1:'inter',s1:{ferme:true},lampe:'ok'};if(d>0){o.courtPile=true;o.duree=d;}
        const m=C().boucle(o);return {montage:m.montage,schema:m.schema,txt:DU[d]+' : '+NIV[m.etat.niveau]+'.',essai:{duree:d,niveau:m.etat.niveau}};}});
  }
  window.FICHE_CI_ELE14={
    id:'NL-CI-6E-ELE-14',version:'0.9',modele:'court-circuit-echauffement-qualitatif-v1',
    titre:'Découvrir les dangers d’un court-circuit',niveau:'6e',
    theme:'Électricité',chapitre:'Court-circuit et protection',
    competenceVisee:'Relier un court-circuit à ses conséquences : échauffement, détérioration et risque d’incendie.',
    objectifsPedagogiques:['Citer deux dangers d’un court-circuit','Relier chaque danger à sa cause','Dire quel comportement adopter'],
    situationEvaluation:'Une prise chauffe chez Awa et une odeur de brûlé apparaît. Pourquoi est-ce grave, et que doit-on faire ?',
    objectif:'Relier un court-circuit à ses dangers et à la conduite à tenir.',
    objectifEleve:'Savoir pourquoi un court-circuit est dangereux.',
    situation:'Une prise chauffe dans la cuisine d’Awa et une odeur de brûlé apparaît. Awa se demande pourquoi c’est grave.',
    materiel:'Pile plate fictive de 4,5 V, lampe, interrupteur, fil de connexion, simulation qualitative.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à un fil quand le courant devient très grand pendant longtemps. Justifie ton hypothèse.',choix:[['chauffe','Le fil chauffe de plus en plus et sa gaine peut fondre'],['froid','Le fil reste froid'],['brille','Le fil brille comme une lampe sans chauffer'],['rien','Rien ne change, quelle que soit la durée']]},
    protocole:['Observer le circuit sans court-circuit.','Provoquer en simulation un court-circuit bref, puis moyen, puis long.','Observer le fil, sa gaine et l’indicateur qualitatif.','Noter chaque observation.'],
    variable:'La durée du court-circuit',maintenu:'Pile, lampe, fils et interrupteur fermé',
    colonnes:['Durée','Échauffement','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[DU[e.duree],NIV[e.niveau],e.observation||'—']),
    resume:e=>DU[e.duree].toLowerCase()+' : '+NIV[e.niveau].toLowerCase(),
    confrontation:'1. Que devient le fil quand le court-circuit dure plus longtemps ? 2. Que peut-il arriver à la gaine ? 3. Quel danger en découle ? 4. Que fais-tu si tu sens une odeur de brûlé ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai court et un essai long avec ce que tu as observé.',
    transfert:{q:'Une prise est chaude et une odeur de brûlé apparaît. Que fais-tu en premier ?',options:[['adulte','Je préviens un adulte et je m’éloigne sans toucher à la prise'],['toucher','Je touche la prise pour voir si elle est chaude']],rep:'adulte',expl:'Il faut prévenir un adulte et s’éloigner sans toucher. En cas de risque d’incendie, on appelle les sapeurs-pompiers (numéro affiché dans la classe). On ne répare jamais soi-même une installation : c’est le travail d’un électricien agréé.'},
    critere:'Citer deux dangers d’un court-circuit, les relier à leur cause et dire quoi faire.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne cite aucun danger.'],['MF','Cite un danger sans le relier à la cause.'],['MS','Cite deux dangers reliés à la cause.'],['TBM','Cite deux dangers, les relie et décrit la conduite à tenir.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.duree===0)&&new Set(v.filter(e=>e.duree>0).map(e=>e.duree)).size>=2;},
    aides:['Compare l’échauffement pour un court-circuit bref et pour un long.','Regarde la gaine du fil sur le montage.','Plus le court-circuit dure, plus le fil chauffe.'],
    synthese:'Pendant un court-circuit, un courant très grand passe dans les fils : ils chauffent. Plus cela dure, plus le fil chauffe, jusqu’à faire fondre sa gaine, abîmer l’installation et provoquer un incendie. Si une prise chauffe ou sent le brûlé, on prévient un adulte et on s’éloigne ; on ne touche pas à l’installation.',
    prof:{reference:'Sans court-circuit : aucun échauffement. Court-circuit bref : fil chaud. Moyen : fil très chaud. Long : la gaine fond (danger). Échelle qualitative sans valeur d’intensité ni de température. Le numéro des sapeurs-pompiers (180) est à reconfirmer avant publication.',attendus:['Hypothèse notée avant l’essai.','Au moins deux durées testées.','Deux dangers cités : échauffement, incendie ou détérioration.','Conduite à tenir énoncée sans toucher à l’installation.'],erreurs:['Croire que le fil reste froid.','Proposer de réparer soi-même l’installation.','Banaliser l’odeur de brûlé.']},
    diagnostic:st=>st.essais.some(e=>e.duree===3)?['Compare l’échauffement bref et long.']:['Teste aussi un court-circuit plus long.']
  };
})();
