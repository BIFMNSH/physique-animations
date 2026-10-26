/* NohobaLab · 6e Côte d'Ivoire · MAT-10 · Transvaser, recueillir et conserver un gaz.
   Simulation uniquement : le gaz du labogaz est inflammable, aucun montage réel sans le professeur, aucune flamme, pièce aérée. Gaz dessiné sans couleur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const ET=[['avant','Avant'],['apres','Après']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:10,titre:'Atelier · le gaz prend la place de l’eau',
      intro:'Simulation : je choisis un montage et le moment (avant ou après). Le gaz est dessiné sans couleur. Aucune flamme, aucun vrai gaz : le montage réel est réalisé par le professeur seul.',
      controles:[{cle:'m',legende:'Le montage',items:M().MONTAGES_GAZ},{cle:'e',legende:'Le moment',items:ET}],
      saisie:'J’observe que le niveau d’eau… et que le gaz…',legendeTable:'Mes essais : montage, moment et niveau d’eau.',F:()=>window.FICHE_CI_MAT10,
      render:v=>{const g=M().gazDeplaceEau(v.m,v.e),sc=M().scene.gaz({montage:v.m,etape:v.e});return {montage:sc.montage,schema:sc.schema,txt:g.txt,essai:{montage:v.m,etape:v.e,niveau:g.niveauEau,gaz:g.gazPresent}};}});
  }
  window.FICHE_CI_MAT10={
    id:'NL-CI-6E-MAT-10',version:'0.9',modele:'deplacement-eau-v1',
    titre:'Transvaser, recueillir et conserver un gaz',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Réaliser en simulation le transvasement et le recueil d’un gaz par déplacement d’eau, puis le conserver.',
    objectifsPedagogiques:['Décrire comment le gaz prend la place de l’eau dans un bocal ou un tube renversé','Décrire comment recueillir un gaz','Décrire comment conserver un gaz (bouchon sous l’eau)'],
    situationEvaluation:'Pour garder un gaz dans un tube, Awa le retire de l’eau puis cherche un bouchon. Qu’aurait-elle dû faire ? Explique.',
    objectif:'Décrire trois manipulations sur un gaz.',objectifEleve:'Savoir transvaser, recueillir et conserver un gaz.',
    situation:'On ne voit pas un gaz. Comment le faire passer d’un récipient à un autre, le recueillir ou le garder ? Le professeur montre le principe ; l’élève le comprend sur simulation.',
    materiel:'Simulation : cuve à eau (cristallisoir), bocal et tube à essai renversés, tuyau coudé, bouchon. Montage réel : professeur seul.',
    prevision:{consigne:'Avant les essais, choisis ce qui prend la place de l’eau quand on incline un tube plein d’air sous un bocal renversé rempli d’eau. Justifie ton hypothèse.',choix:[['gaz','Le gaz prend la place de l’eau (bulles qui montent)'],['rien','Rien ne change'],['plus','Le bocal se remplit encore d’eau'],['casse','Le bocal se vide en un seul coup, sans bulles']]},
    protocole:['Transvaser : observer le bocal avant, puis après.','Recueillir : observer le tube plein d’eau avant, puis après.','Conserver : fermer le tube sous l’eau avec un bouchon.','Noter le niveau d’eau à chaque fois.'],
    variable:'Le montage, puis le moment',maintenu:'La cuve à eau',
    colonnes:['Montage','Moment','Niveau d’eau','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[lib(M().MONTAGES_GAZ,e.montage).split(' : ')[0],lib(ET,e.etape),e.niveau,e.observation||'—']),
    resume:e=>lib(M().MONTAGES_GAZ,e.montage).split(' : ')[0].toLowerCase()+' ('+lib(ET,e.etape).toLowerCase()+') : niveau d’eau '+e.niveau,
    confrontation:'1. Que devient le niveau d’eau quand le gaz arrive ? 2. Qu’est-ce qui monte ? 3. Comment garde-t-on le gaz ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un montage, le niveau d’eau avant et après.',
    transfert:{q:'Pour conserver le gaz recueilli dans un tube, faut-il fermer le tube sous l’eau ?',rep:'oui',expl:'Oui : fermé sous l’eau avec un bouchon, le tube garde son gaz ; hors de l’eau, le gaz s’échapperait.'},
    critere:'Décrire en trois temps transvaser, recueillir et conserver.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les dessins sans parler du niveau.'],['MF','Dit que des bulles montent sans conclure.'],['MS','Dit que le gaz prend la place de l’eau et décrit les trois temps.'],['TBM','Décrit, justifie et prévoit les règles de sécurité.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'montage')>=2&&v.some(e=>e.etape==='apres');},
    aides:['Compare le niveau d’eau avant et après.','Les bulles sont du gaz qui monte.','On ferme le tube sous l’eau pour que le gaz ne s’échappe pas.'],
    synthese:'Un gaz prend la place de l’eau : on le transvase ou on le recueille par déplacement d’eau, dans un récipient renversé. Pour le conserver, on ferme le récipient sous l’eau avec un bouchon.',
    prof:{reference:'Déplacement d’eau : le gaz prend la place de l’eau ; conservation par bouchon sous l’eau. Gaz du labogaz inflammable : manipulation par le professeur, sans flamme, pièce aérée.',attendus:['Observer que le niveau d’eau baisse quand le gaz arrive.','Décrire les trois manipulations.','Citer les précautions : aucune flamme, pièce aérée, professeur.'],erreurs:['Retirer le tube de l’eau avant de le boucher.','Approcher une flamme du labogaz.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare « avant » et « après » sur au moins deux montages.']:['Fais un premier essai.']
  };
})();
