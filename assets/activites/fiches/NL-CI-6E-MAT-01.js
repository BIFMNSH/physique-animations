/* NohobaLab · 6e Côte d'Ivoire · MAT-01 · Découvrir les propriétés des solides.
   Modèle qualitatif : un solide compact garde sa forme propre et ne coule pas, quel que soit le récipient ou l’inclinaison. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const OBJ=[['caillou','Un caillou'],['bois','Un bloc de bois'],['gomme','Une gomme']];
  const REC=[['cristallisoir','Un cristallisoir'],['becher','Un bécher'],['bocal','Un bocal']];
  const ACT=[['poser','Je pose l’objet'],['incliner','J’incline le récipient'],['verser','J’essaie de le verser']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:1,titre:'Atelier · je teste des solides dans des récipients',
      intro:'Je choisis un objet, un récipient et une action, puis j’observe la forme de l’objet. Simulation : je ne touche à rien en vrai.',
      controles:[{cle:'o',legende:'L’objet',items:OBJ},{cle:'r',legende:'Le récipient',items:REC},{cle:'a',legende:'Ce que je fais',items:ACT}],
      saisie:'J’observe que la forme de l’objet…',legendeTable:'Mes essais : objet, récipient, action et forme.',F:()=>window.FICHE_CI_MAT01,
      render:v=>{const r=M().solide(v.o,v.r,v.a),sc=M().scene.solideRec({objet:v.o,rec:v.r,action:v.a});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{objet:v.o,rec:v.r,action:v.a,forme:'inchangée',coule:false}};}});
  }
  window.FICHE_CI_MAT01={
    id:'NL-CI-6E-MAT-01',version:'0.9',modele:'solide-compact-qualitatif-v1',
    titre:'Découvrir les propriétés des solides',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Identifier les propriétés d’un solide à partir d’observations.',
    objectifsPedagogiques:['Dire qu’un solide a une forme propre','Dire qu’un solide garde sa forme d’un récipient à l’autre','Dire qu’un solide ne coule pas'],
    situationEvaluation:'Au marché, Kofi met un caillou dans un seau, puis dans une bassine. Sa petite sœur croit que le caillou « prend la forme du seau ». Que lui réponds-tu ? Appuie-toi sur deux propriétés des solides.',
    objectif:'Dégager deux propriétés des solides à partir d’observations.',objectifEleve:'Savoir dire ce qu’est un solide et comment il se comporte.',
    situation:'Awa a rapporté du marché un caillou, un bloc de bois et une gomme. Elle les range dans des récipients différents. Elle se demande si ces objets changent de forme quand on change de récipient.',
    materiel:'Simulation : un caillou, un bloc de bois, une gomme ; un cristallisoir, un bécher, un bocal.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la forme d’un objet solide quand on le change de récipient. Justifie ton hypothèse.',choix:[['propre','Chaque objet garde sa forme dans tous les récipients'],['recip','Chaque objet prend la forme du récipient'],['coule','Les objets coulent quand on incline le récipient'],['taille','La forme dépend de la taille du récipient']]},
    protocole:['Choisir un objet et un récipient, le poser et observer sa forme.','Incliner le récipient et observer.','Essayer de verser l’objet et observer s’il coule.','Changer d’objet, puis de récipient, et noter chaque observation.'],
    variable:'L’objet, le récipient ou l’action (un seul à la fois)',maintenu:'Les deux autres choix',
    colonnes:['Objet','Récipient','Action','Forme de l’objet','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[lib(OBJ,e.objet),lib(REC,e.rec),lib(ACT,e.a||e.action),'Inchangée',e.observation||'—']),
    resume:e=>lib(OBJ,e.objet).toLowerCase()+' dans '+lib(REC,e.rec).toLowerCase()+' ('+lib(ACT,e.action).toLowerCase()+') : forme inchangée',
    confrontation:'1. La forme de l’objet change-t-elle d’un récipient à l’autre ? 2. Que se passe-t-il quand on incline ou qu’on verse ? 3. Que garde chaque objet ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai précis (objet, récipient, action) et ce que tu as observé.',
    transfert:{q:'Un solide prend la forme du récipient qui le contient. Vrai ?',rep:'non',expl:'Non : un solide garde sa forme propre. C’est le liquide qui prend la forme de son récipient (on le voit dans la fiche suivante).'},
    critere:'Énoncer deux propriétés des solides en citant au moins deux essais.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les objets sans comparer les récipients.'],['MF','Dit que la forme ne change pas, sans citer d’essai.'],['MS','Énonce deux propriétés en citant des essais.'],['TBM','Énonce les propriétés, les justifie par des essais et les applique à un nouvel objet.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'objet')>=2&&M().distincts(v,'rec')>=2;},
    aides:['Compare la forme de l’objet avant et après chaque action.','Regarde si l’objet s’étale ou s’écoule quand on incline le récipient.','Un solide a une forme propre : il la garde dans tous les récipients.'],
    synthese:'Un solide a une forme propre : il la garde d’un récipient à l’autre. Il ne coule pas, il ne s’étale pas pour remplir un récipient.',
    prof:{reference:'Un solide compact garde sa forme propre, d’un récipient à l’autre ; il ne coule pas.',attendus:['Observer que la forme ne change pas quand on change de récipient.','Observer que l’objet ne coule pas quand on incline ou verse.','Énoncer deux propriétés : forme propre, ne coule pas.'],erreurs:['Confondre « il glisse » et « il coule » : un bloc qui glisse garde sa forme.','Dire qu’un solide prend la forme du récipient (propriété du liquide).']},
    diagnostic:st=>st.essais.length?['Indicatif : compare au moins deux objets dans deux récipients différents.']:['Fais un premier essai.']
  };
})();
