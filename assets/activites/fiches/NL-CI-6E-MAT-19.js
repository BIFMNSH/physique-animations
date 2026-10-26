/* NohobaLab · 6e Côte d'Ivoire · MAT-19 · Réaliser la solidification de l'eau.
   Le mélange réfrigérant (glace pilée et sel) est plus froid que 0 °C : sa valeur n'est jamais annoncée. Pas de surfusion. Valeurs simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:19,titre:'Atelier · l’eau se solidifie',
      intro:'Un tube d’eau avec un thermomètre est plongé dans un mélange réfrigérant (glace pilée et sel). Je choisis l’instant et je lis le thermomètre du tube. Valeurs simulées, durées accélérées.',
      controles:[{cle:'i',legende:'L’instant',items:M().INSTANTS_SOLID}],
      saisie:'J’observe que le thermomètre du tube…',legendeTable:'Mes relevés : instant, température du tube et état de l’eau (simulés).',F:()=>window.FICHE_CI_MAT19,
      render:v=>{const r=M().solidification(v.i),sc=M().scene.solidification({instant:v.i});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{instant:v.i,T:r.T,etat:r.etat,palier:r.palier}};}});
  }
  window.FICHE_CI_MAT19={
    id:'NL-CI-6E-MAT-19',version:'0.9',modele:'solidification-eau-v1',
    titre:'Réaliser la solidification de l’eau',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Changements d’état de l’eau',
    competenceVisee:'Réaliser la solidification de l’eau et repérer sa température.',
    objectifsPedagogiques:['Dire que l’eau liquide devient glace en se solidifiant','Dire que la température du tube reste à 0 °C pendant que la glace se forme','Tracer l’allure de la courbe : descente, palier, descente'],
    situationEvaluation:'Awa met de l’eau au congélateur. Pendant que la glace se forme, que fait le thermomètre plongé dans l’eau ? À quelle température l’eau devient-elle glace ?',
    objectif:'Repérer la température de solidification de l’eau.',objectifEleve:'Savoir à quelle température l’eau devient glace.',
    situation:'À quelle température l’eau devient-elle glace ? Kofi plonge un tube d’eau dans un mélange de glace pilée et de sel et suit le thermomètre.',
    materiel:'Simulation : bécher avec mélange réfrigérant, tube à essai contenant de l’eau, thermomètre.',
    prevision:{consigne:'Avant les relevés, choisis la valeur que doit indiquer le thermomètre du tube quand la glace apparaît. Justifie ton hypothèse.',choix:[['0','0 °C'],['10','10 °C'],['-10','−10 °C'],['100','100 °C']]},
    protocole:['Plonger le tube d’eau dans le mélange réfrigérant.','Lire le thermomètre du tube à chaque instant.','Repérer quand la glace apparaît.','Lire encore quand tout est solide.'],
    variable:'L’instant du relevé',maintenu:'Le tube, l’eau et le thermomètre',
    colonnes:['Instant','Température du tube (simulée)','État de l’eau','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[lib(M().INSTANTS_SOLID,e.instant),e.T+' °C',e.etat,e.observation||'—']),
    resume:e=>lib(M().INSTANTS_SOLID,e.instant).toLowerCase()+' : '+e.T+' °C, '+e.etat,
    confrontation:'1. Que fait le thermomètre pendant que la glace se forme ? 2. Que fait-il quand tout est solide ? 3. Comment s’appelle ce changement d’état ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux relevés avec leur température et l’état de l’eau.',
    transfert:{q:'Pendant que l’eau du tube se solidifie, sa température…',rep:'reste',type:'choix',options:[['baisse','continue de baisser'],['reste','reste à 0 °C'],['monte','monte'],['100','vaut 100 °C']],expl:'Elle reste à 0 °C tant que la glace se forme : c’est un palier. Le mélange réfrigérant, lui, est plus froid que 0 °C.'},
    critere:'Dire que la solidification de l’eau se fait à 0 °C avec deux relevés.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit les températures sans état.'],['MF','Lit et nomme l’état sans voir le palier.'],['MS','Voit le palier et énonce 0 °C.'],['TBM','Énonce 0 °C, trace la courbe et distingue tube et mélange.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&v.some(e=>e.instant==='refroidit')&&v.some(e=>e.palier)&&v.some(e=>e.instant==='solide');},
    aides:['Compare le relevé « la glace apparaît » et « la glace se forme ».','Le thermomètre du tube indique la température de l’eau du tube, pas celle du mélange.','Quand tout est solide, le thermomètre redescend.'],
    synthese:'L’eau liquide devient glace : c’est la solidification. Elle se fait à 0 °C : pendant que la glace se forme, la température du tube reste à 0 °C (palier), puis redescend quand tout est solide. Le mélange réfrigérant est plus froid que 0 °C.',
    prof:{reference:'Solidification de l’eau à 0 °C ; palier pendant la formation de la glace ; descente ensuite.',attendus:['Relever 20 °C, 6 °C puis 0 °C stable.','Énoncer 0 °C.','Distinguer tube et mélange.'],erreurs:['Annoncer une valeur pour le mélange.','Confondre solidification et fusion.']},
    diagnostic:st=>st.essais.length?['Indicatif : relève avant, pendant et après la formation de la glace.']:['Fais un premier relevé.']
  };
})();
