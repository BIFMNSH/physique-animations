/* NohobaLab · 6e Côte d'Ivoire · MES-05 · Définir la masse.
   Balance électronique du lot Matière ; pâte à modeler de 120 g (boule, galette, quatre morceaux réunis) ; 1 kg de coton et 1 kg de fer.
   Pas de poids, pas de quotient masse ÷ volume ; la comparaison des volumes est laissée à MES-11. Acquis de l'école primaire (CM1, CM2). */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const CONV=()=>Q().CONVERSIONS_MASSE;
  function manip(panel,X){
    M().bloc(panel,X,{n:205,titre:'Atelier · je pèse, je déforme, je découpe',
      intro:'Je pose chaque objet sur la balance électronique. Quand je découpe la pâte, je rassemble tous les morceaux sur le plateau. Valeurs simulées.',
      controles:[{cle:'obj',legende:'Ce que je pose sur la balance',items:Q().TRANSFOS}],
      saisie:'J’observe que la balance indique…',legendeTable:'Mes pesées (valeurs simulées).',F:()=>window.FICHE_CI_MES05,
      render:v=>{const r=Q().masseObjet(v.obj),sc=Q().scene.masse5(v);return {montage:sc.montage,schema:sc.schema,txt:Q().sim(r.txt),essai:{obj:v.obj,m:r.m}};}});
    M().tri(panel,X,{id:'mes05conv',titre:'Je convertis des masses',intro:'Pour chaque égalité, je choisis la bonne valeur.',legende:'Je choisis',cats:[['x','x']],
      items:CONV().map(c=>({id:c.id,label:c.q,options:c.options,juste:c.juste,pourquoi:c.pourquoi,aide:'kg, hg, dag, g, dg, cg, mg : on passe d’une unité à la suivante en multipliant par 10. Et 1 t = 10 q = 1 000 kg.'}))});
    M().tri(panel,X,{id:'mes05ordre',titre:'Je range des objets du quotidien par masse',intro:'Pour chaque objet, je choisis l’ordre de grandeur de sa masse.',legende:'Sa masse est',cats:Q().ORDRES,
      items:Q().OBJETS_MASSE.map(o=>({id:o.id,label:o.nom,juste:o.juste,pourquoi:o.pourquoi,aide:'Compare à 1 g (un trombone), 1 kg (un sachet de sucre) et 100 kg (un quintal).'}))});
  }
  window.FICHE_CI_MES05={
    id:'NL-CI-6E-MES-05',version:'0.9',modele:'masse-definition-v1',
    titre:'Définir la masse',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Définir la masse d’un corps et citer ses unités.',
    objectifsPedagogiques:['Dire que la masse est la grandeur que l’on mesure avec une balance','Citer le kilogramme (kg), ses multiples (tonne, quintal) et sous-multiples (hg, dag, g, dg, cg, mg)','Dire que la masse ne change pas quand on déforme ou découpe un corps sans rien perdre','Dire que masse et volume sont deux grandeurs différentes'],
    situationEvaluation:'Au marché, Mariam achète un kilogramme de feuilles de manioc et un kilogramme d’ignames. Le sac de feuilles est beaucoup plus gros. Lequel a la plus grande masse ? Explique, puis convertis 1,5 kg en grammes.',
    objectif:'Définir la masse et utiliser ses unités.',objectifEleve:'Savoir ce qu’est la masse et dans quelle unité on l’exprime.',
    situation:'À la maison, Awa prépare un gâteau : la recette indique 250 g de farine. Que mesure-t-on avec la balance ? Et si l’on aplatit une boule de pâte à modeler, ou qu’on la coupe en morceaux, sa masse change-t-elle ?',
    materiel:'Simulation : une balance électronique, une boule de pâte à modeler, un kilogramme de coton, un kilogramme de fer.',
    prevision:{consigne:'Question de départ : qu’est-ce qui a la plus grande masse, un kilogramme de coton ou un kilogramme de fer ? Justifie ton hypothèse.',choix:[['fer','Le kilogramme de fer'],['egal','Ils ont la même masse'],['coton','Le kilogramme de coton, il est plus gros'],['inconnu','On ne peut pas savoir sans balance']]},
    protocole:['Peser la boule de pâte.','L’aplatir en galette et la peser.','La couper en quatre morceaux, tous posés sur le plateau, et peser.','Peser le kilogramme de coton puis le kilogramme de fer.','Convertir des masses et ranger des objets par masse.'],
    variable:'La forme de la pâte, puis la matière',maintenu:'La même balance ; aucune matière perdue',
    colonnes:['Ce que je pèse','Masse lue','Mon observation ou résultat'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(Q().TRANSFOS,e.obj),e.m+' g (simulé)',e.observation||'—']).concat(Q().lignesTri(st,'mes05conv',CONV())).concat(M().lignesTri(st,'mes05ordre',i=>(Q().OBJETS_MASSE.filter(o=>o.id===i)[0]||{nom:i}).nom,c=>lib(Q().ORDRES,c))),
    resume:e=>e.tri?(e.tri==='mes05conv'?'conversion':'ordre de grandeur')+' '+(e.juste?'juste':'à revoir'):lib(Q().TRANSFOS,e.obj).toLowerCase()+' : '+e.m+' g',
    confrontation:'1. La masse de la pâte change-t-elle avec sa forme ou quand on la coupe ? 2. Que montre la balance pour le coton et pour le fer ? 3. Prennent-ils la même place ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux masses lues avec leur unité.',
    transfert:{q:'On coupe une galette de pâte de 120 g en trois morceaux, sans rien perdre. Quelle est la masse des trois morceaux réunis ?',type:'nombre',unite:'g',rep:120,tol:0,expl:'La masse ne change pas quand on découpe un corps sans rien perdre : 120 g.'},
    critere:'Définir la masse, citer l’unité kg et réussir quatre conversions.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Confond masse et taille.'],['MF','Dit que la masse se conserve sans citer les unités.'],['MS','Définit la masse, cite le kg et convertit.'],['TBM','Définit, convertit et explique que masse et volume sont différents.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri),o=new Set(v.map(e=>e.obj));return o.has('boule')&&(o.has('galette')||o.has('morceaux'))&&o.has('coton')&&o.has('fer')&&M().triEtat(st,'mes05conv',CONV().map(c=>c.id)).repondus>=4;},
    aides:['Compare l’indication de la balance avant et après avoir aplati la pâte.','Le coton et le fer : regarde l’écran, pas la taille du sac.','1 kg = 1 000 g ; 1 q = 100 kg ; 1 t = 1 000 kg ; 1 g = 1 000 mg.'],
    synthese:'La masse d’un corps est la grandeur que l’on mesure avec une balance. Son unité internationale est le kilogramme (kg) ; on utilise aussi la tonne (t), le quintal (q), l’hectogramme (hg), le décagramme (dag), le gramme (g), le décigramme (dg), le centigramme (cg) et le milligramme (mg). La masse d’un corps ne change pas quand on le déforme ou qu’on le découpe sans rien perdre. Un kilogramme de coton et un kilogramme de fer ont la même masse, mais pas le même volume : masse et volume sont deux grandeurs différentes.',
    prof:{reference:'Pâte : 120 g quelle que soit la forme ; coton et fer : 1 000 g chacun (valeurs simulées) ; 2 500 g ; 100 kg ; 1 000 kg ; 0,35 kg ; 0,25 g.',attendus:['Constater la conservation de la masse.','Citer le kg et ses multiples et sous-multiples.','Réussir les conversions.'],erreurs:['Croire que la galette est plus légère que la boule.','Penser que le coton, plus gros, est plus lourd.','Confondre masse et volume.']},
    diagnostic:st=>st.essais.length?['Indicatif : pèse la pâte sous deux formes, puis le coton et le fer.']:['Pose un premier objet sur la balance.']
  };
})();
