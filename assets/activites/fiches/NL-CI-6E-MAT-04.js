/* NohobaLab · 6e Côte d'Ivoire · MAT-04 · Distinguer un solide divisé d'un liquide.
   Modèle qualitatif : surface libre horizontale pour l’eau, en tas (pente) pour le sable sec. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const MAT=[['eau','De l’eau'],['sable','Du sable sec']];
  const ETAT=[['pose','Le récipient est posé droit'],['incline','Le récipient est incliné']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:4,titre:'Atelier · eau et sable dans le même récipient',
      intro:'Je choisis la matière et l’état du récipient, puis j’observe la surface libre. Sable sec seulement. Simulation uniquement.',
      controles:[{cle:'m',legende:'La matière',items:MAT},{cle:'e',legende:'Le récipient',items:ETAT}],
      saisie:'J’observe que la surface…',legendeTable:'Mes essais : matière, récipient et surface libre.',F:()=>window.FICHE_CI_MAT04,
      render:v=>{const r=M().surfaceLibre(v.m,v.e),sc=M().scene.surface({matiere:v.m,etat:v.e});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{matiere:v.m,etat:v.e,horizontale:r.horizontale,grains:r.grains}};}});
  }
  window.FICHE_CI_MAT04={
    id:'NL-CI-6E-MAT-04',version:'0.9',modele:'surface-libre-qualitatif-v1',
    titre:'Distinguer un solide divisé d’un liquide',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Utiliser la surface libre pour distinguer un solide divisé d’un liquide.',
    objectifsPedagogiques:['Dire que la surface libre d’un liquide au repos est plane et horizontale','Dire que la surface d’un solide divisé forme un tas','Citer un autre critère : les grains restent visibles'],
    situationEvaluation:'Un vendeur du marché verse du sel fin dans un bol. Un client prétend que c’est du liquide. Comment le convaincre en regardant la surface ?',
    objectif:'Distinguer le sable et l’eau par leur surface libre.',objectifEleve:'Savoir distinguer un solide divisé d’un liquide.',
    situation:'Le sable et l’eau coulent tous les deux quand on les verse. Kofi les confond. Awa lui propose de les comparer dans un même récipient, posé puis incliné.',
    materiel:'Simulation : un bécher, de l’eau, du sable sec.',
    prevision:{consigne:'Avant les essais, choisis la surface que tu prévois pour le sable dans un récipient incliné. Justifie ton hypothèse.',choix:[['tas','Le sable forme un tas : sa surface n’est pas horizontale'],['horiz','Le sable a une surface horizontale, comme l’eau'],['penche','La surface du sable penche avec le récipient comme un bloc'],['liquide','Le sable se comporte exactement comme l’eau']]},
    protocole:['Verser de l’eau dans le bécher posé, observer la surface.','Incliner le bécher avec l’eau et observer.','Faire pareil avec du sable sec.','Comparer les deux surfaces.'],
    variable:'La matière (eau ou sable), puis l’inclinaison',maintenu:'Le même bécher',
    colonnes:['Matière','Récipient','Surface libre','Grains visibles ?','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(MAT,e.matiere),lib(ETAT,e.etat),e.horizontale?'Plane et horizontale':'En tas, en pente',e.grains?'Oui':'Non',e.observation||'—']),
    resume:e=>lib(MAT,e.matiere).toLowerCase()+' ('+(e.etat==='incline'?'incliné':'posé')+') : '+(e.horizontale?'surface horizontale':'surface en tas'),
    confrontation:'1. Comment est la surface de l’eau ? 2. Comment est celle du sable ? 3. Quel critère permet de ne pas les confondre ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai pour l’eau et un essai pour le sable avec la forme de leur surface.',
    transfert:{q:'Dans un récipient incliné, la surface du sable sec est-elle horizontale ?',rep:'non',expl:'Non : le sable forme un tas avec une pente ; seule la surface libre d’un liquide au repos est horizontale.'},
    critere:'Énoncer le critère de la surface libre et un second critère (les grains).',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Compare l’eau et le sable sans parler de la surface.'],['MF','Décrit les deux surfaces sans conclure.'],['MS','Énonce le critère de la surface libre.'],['TBM','Énonce deux critères et les applique à un autre solide divisé.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.matiere==='eau')&&v.some(e=>e.matiere==='sable');},
    aides:['Compare la ligne en pointillé de l’eau avec le dessus du sable.','Regarde si le sable reste en pente quand on incline le bécher.','Au repos, seule la surface libre d’un liquide est plane et horizontale.'],
    synthese:'La surface libre d’un liquide au repos est plane et horizontale. Celle d’un solide divisé forme un tas ; on y voit des grains. Ce critère permet de distinguer un solide divisé d’un liquide.',
    prof:{reference:'Surface libre d’un liquide au repos : plane et horizontale. Solide divisé : tas en pente, grains visibles.',attendus:['Observer la surface horizontale de l’eau, droite ou inclinée.','Observer le tas de sable avec sa pente.','Énoncer le critère et le second critère (grains).'],erreurs:['Dire que le sable est liquide parce qu’il coule.','Ne comparer que la couleur ou le poids.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare l’eau et le sable, posés puis inclinés.']:['Fais un premier essai.']
  };
})();
