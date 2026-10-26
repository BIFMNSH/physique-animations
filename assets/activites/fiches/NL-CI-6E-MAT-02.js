/* NohobaLab · 6e Côte d'Ivoire · MAT-02 · Découvrir les propriétés des liquides.
   Modèle qualitatif : un liquide au repos prend la forme de son récipient, coule, et sa surface libre est plane et horizontale. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const LIQ=[['eau','De l’eau colorée'],['huile','De l’huile']];
  const REC=[['cristallisoir','Un cristallisoir'],['tube','Un tube à essai'],['ballon','Un ballon à fond plat'],['flacon','Un flacon']];
  const INC=[['non','Le récipient est posé droit'],['oui','Le récipient est incliné']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:2,titre:'Atelier · je verse des liquides dans des récipients',
      intro:'Je choisis un liquide, un récipient et son inclinaison, puis j’observe la forme du liquide et sa surface libre (en pointillé). Simulation uniquement.',
      controles:[{cle:'l',legende:'Le liquide',items:LIQ},{cle:'r',legende:'Le récipient',items:REC},{cle:'i',legende:'L’inclinaison',items:INC}],
      saisie:'J’observe que le liquide… et que sa surface…',legendeTable:'Mes essais : liquide, récipient, inclinaison et surface libre.',F:()=>window.FICHE_CI_MAT02,
      render:v=>{const inc=v.i==='oui',r=M().liquide(v.l,v.r,inc),sc=M().scene.liquideRec({liq:v.l,rec:v.r,incl:inc});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{liq:v.l,rec:v.r,incl:inc,surface:'horizontale'}};}});
  }
  window.FICHE_CI_MAT02={
    id:'NL-CI-6E-MAT-02',version:'0.9',modele:'liquide-surface-libre-v1',
    titre:'Découvrir les propriétés des liquides',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Identifier les propriétés d’un liquide au repos.',
    objectifsPedagogiques:['Dire qu’un liquide prend la forme de son récipient','Dire qu’un liquide coule : c’est un fluide','Dire que la surface libre d’un liquide au repos est plane et horizontale, même si le récipient est incliné'],
    situationEvaluation:'Kofi penche une bouteille à moitié pleine d’eau. Il dit : « la surface de l’eau penche avec la bouteille ». A-t-il raison ? Dessine ce qu’il voit et explique.',
    objectif:'Dégager trois propriétés des liquides au repos.',objectifEleve:'Savoir décrire la forme et la surface d’un liquide.',
    situation:'Dans la cuisine, Awa verse de l’eau puis de l’huile dans différents récipients. Elle se demande quelle forme prend le liquide, et ce que devient sa surface quand elle penche le récipient.',
    materiel:'Simulation : eau colorée, huile ; cristallisoir, tube à essai, ballon à fond plat, flacon.',
    prevision:{consigne:'Avant les essais, choisis ce que devient la surface du liquide quand on incline le récipient. Justifie ton hypothèse.',choix:[['horiz','La surface reste plane et horizontale'],['penche','La surface penche avec le récipient'],['bosse','La surface devient bombée au milieu'],['depend','La surface dépend du liquide utilisé']]},
    protocole:['Verser de l’eau colorée dans un récipient posé droit, observer sa forme et sa surface.','Incliner le récipient et observer la surface.','Changer de récipient, puis de liquide (huile), et refaire.','Noter chaque observation.'],
    variable:'Le récipient, le liquide ou l’inclinaison (un seul à la fois)',maintenu:'Les deux autres choix',
    colonnes:['Liquide','Récipient','Inclinaison','Surface libre','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[lib(LIQ,e.liq),lib(REC,e.rec),e.incl?'Incliné':'Droit','Plane et horizontale',e.observation||'—']),
    resume:e=>lib(LIQ,e.liq).toLowerCase()+' dans '+lib(REC,e.rec).toLowerCase()+(e.incl?' incliné':' posé')+' : surface horizontale',
    confrontation:'1. Quelle forme prend le liquide dans chaque récipient ? 2. Que devient la surface quand le récipient est incliné ? 3. Cela dépend-il du liquide ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai avec un récipient incliné et décris la surface observée.',
    transfert:{q:'Dans une bouteille inclinée à moitié pleine d’eau, la surface libre de l’eau est-elle horizontale ?',rep:'oui',expl:'Oui : au repos, la surface libre d’un liquide est plane et horizontale, même quand le récipient est incliné.'},
    critere:'Énoncer trois propriétés du liquide au repos en citant des essais.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit le liquide sans parler de la surface.'],['MF','Dit que le liquide épouse le récipient, sans la surface.'],['MS','Énonce les trois propriétés en citant des essais.'],['TBM','Énonce, justifie et applique à une nouvelle situation (bouteille penchée).']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'rec')>=2&&v.some(e=>e.incl)&&v.some(e=>!e.incl);},
    aides:['Regarde la ligne en pointillé : est-elle penchée ou horizontale ?','Compare avec un récipient posé droit : qu’est-ce qui change, qu’est-ce qui ne change pas ?','Au repos, la surface libre est toujours plane et horizontale.'],
    synthese:'Un liquide n’a pas de forme propre : il prend la forme de son récipient. Il coule (c’est un fluide). Au repos, sa surface libre est plane et horizontale, même si le récipient est incliné.',
    prof:{reference:'Un liquide prend la forme de son récipient, il coule ; sa surface libre au repos est plane et horizontale.',attendus:['Observer que le liquide épouse le récipient.','Observer que la surface reste horizontale quand le récipient penche.','Énoncer les trois propriétés.'],erreurs:['Dessiner une surface penchée avec le récipient.','Parler de « niveau » sans dire qu’il est horizontal.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare un récipient droit et un récipient incliné.']:['Fais un premier essai.']
  };
})();
