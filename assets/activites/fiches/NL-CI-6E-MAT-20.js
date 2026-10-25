/* NohobaLab · 6e Côte d'Ivoire · MAT-20 · Réaliser la fusion de la glace.
   0 °C avec de la glace pure qui fond (pas la glace salée de MAT-19). Durées accélérées, valeurs simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:20,titre:'Atelier · la glace fond',
      intro:'De la glace pilée est posée dans un bécher à la température de la salle, thermomètre au centre. Je choisis l’instant et je lis. Durées accélérées, valeurs simulées.',
      controles:[{cle:'i',legende:'L’instant',items:M().INSTANTS_FUSION}],
      saisie:'J’observe que le thermomètre…',legendeTable:'Mes relevés : instant, température et glace restante (simulés).',F:()=>window.FICHE_CI_MAT20,
      render:v=>{const r=M().fusion(v.i),sc=M().scene.fusion({instant:v.i});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{instant:v.i,T:r.T,glace:r.glace,palier:r.palier}};}});
  }
  window.FICHE_CI_MAT20={
    id:'NL-CI-6E-MAT-20',version:'0.9',modele:'fusion-glace-v1',
    titre:'Réaliser la fusion de la glace',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Réaliser la fusion de la glace et repérer sa température.',
    objectifsPedagogiques:['Dire que la glace devient de l’eau liquide en fondant','Dire que la température reste à 0 °C tant qu’il reste de la glace','Dire que la température remonte quand la glace a fondu'],
    situationEvaluation:'Un glaçon fond dans un verre posé sur la table. Pendant qu’il fond, que fait la température du mélange eau-glace ? Et quand il n’y a plus de glace ?',
    objectif:'Repérer la température de fusion de la glace.',objectifEleve:'Savoir à quelle température la glace fond.',
    situation:'La glace qui fond change-t-elle de température pendant qu’elle fond ? Awa suit un thermomètre au centre d’un bécher de glace pilée.',
    materiel:'Simulation : bécher de glace pilée, thermomètre, salle à température ambiante.',
    prevision:{consigne:'Avant les relevés, choisis ce que fera le thermomètre pendant que la glace fond. Justifie ton hypothèse.',choix:[['reste','Il reste à 0 °C tant qu’il y a de la glace'],['monte','Il monte régulièrement dès le début'],['baisse','Il descend sous 0 °C'],['100','Il monte à 100 °C']]},
    protocole:['Placer la glace pilée et le thermomètre au centre.','Lire à plusieurs instants.','Repérer le moment où la dernière glace disparaît.','Lire un peu plus tard.'],
    variable:'L’instant du relevé',maintenu:'La glace pilée, le thermomètre, la salle',
    colonnes:['Instant','Température (simulée)','Reste-t-il de la glace ?','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[lib(M().INSTANTS_FUSION,e.instant),e.T+' °C',e.glace?'Oui':'Non',e.observation||'—']),
    resume:e=>lib(M().INSTANTS_FUSION,e.instant).toLowerCase()+' : '+e.T+' °C, '+(e.glace?'il reste de la glace':'plus de glace'),
    confrontation:'1. Que fait la température tant qu’il reste de la glace ? 2. Que fait-elle quand il n’y en a plus ? 3. Comment s’appelle ce changement d’état ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un relevé avec glace et un relevé sans glace.',
    transfert:{q:'Pendant que la glace fond, sa température reste-t-elle à 0 °C ?',rep:'oui',expl:'Oui : tant qu’il reste de la glace qui fond, la température reste à 0 °C ; elle remonte ensuite.'},
    critere:'Énoncer la température de fusion de la glace (0 °C) avec deux relevés.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit sans relier à la glace.'],['MF','Voit le palier sans conclure.'],['MS','Énonce 0 °C et le palier.'],['TBM','Énonce, trace la courbe et explique la remontée.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&v.some(e=>e.glace&&e.palier)&&v.some(e=>!e.glace);},
    aides:['Compare un relevé avec de la glace et un relevé sans glace.','Pendant la fusion, la température reste constante.','La glace pilée fond à 0 °C quand elle est pure.'],
    synthese:'La glace devient de l’eau liquide : c’est la fusion. Elle se fait à 0 °C : tant qu’il reste de la glace qui fond, la température reste à 0 °C (palier) ; elle remonte quand toute la glace a fondu.',
    prof:{reference:'Fusion à 0 °C (glace pure) ; palier tant que la glace persiste ; remontée ensuite.',attendus:['Relever trois fois 0 °C.','Voir la remontée sans glace.','Énoncer 0 °C.'],erreurs:['Confondre avec la glace salée de MAT-19.','Dire que la température monte pendant la fusion.']},
    diagnostic:st=>st.essais.length?['Indicatif : relève avec glace puis sans glace.']:['Fais un premier relevé.']
  };
})();
