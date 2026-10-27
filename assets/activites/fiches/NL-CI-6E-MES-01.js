/* NohobaLab · 6e Côte d'Ivoire · MES-01 · S'approprier les notions de volume et de capacité.
   Capacités simulées : bouteille haute 0,75 L, bouteille large 1 L ; gobelet de 0,25 L ; cube creux de 1 dm³ ; cube de 1 cm³. La forme trompe. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const CONV=()=>Q().CONVERSIONS_VOL;
  function manip(panel,X){
    M().bloc(panel,X,{n:201,titre:'Atelier · je compare deux bouteilles et je découvre 1 L = 1 dm³',
      intro:'Je choisis une expérience. Les deux bouteilles sont pleines et vendues au même prix. Les volumes sont simulés.',
      controles:[{cle:'exp',legende:'Ce que je fais',items:Q().EXP_CAPACITE}],
      saisie:'J’observe que le jus arrive au trait… / je remplis … gobelets…',legendeTable:'Mes expériences : ce que je fais et ce que je lis (valeurs simulées).',F:()=>window.FICHE_CI_MES01,
      render:v=>{const r=Q().capacite(v.exp),sc=Q().scene.capacite(v);return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (valeur simulée)',essai:{exp:v.exp,litres:r.litres,lu:r.lu}};}});
    M().tri(panel,X,{id:'mes01conv',titre:'Je convertis des volumes et des capacités',intro:'Pour chaque égalité, je choisis la bonne valeur. Un retour m’explique chaque choix.',legende:'Je choisis',cats:[['x','x']],
      items:CONV().map(c=>({id:c.id,label:c.q,options:c.options,juste:c.juste,pourquoi:c.pourquoi,aide:'Utilise 1 L = 1 dm³, 1 mL = 1 cm³ et 1 L = 100 cL = 1 000 mL.'}))});
  }
  window.FICHE_CI_MES01={
    id:'NL-CI-6E-MES-01',version:'0.9',modele:'volume-capacite-v1',
    titre:'S’approprier les notions de volume et de capacité',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Volume d’un liquide et d’un solide',
    competenceVisee:'Distinguer le volume d’un corps et la capacité d’un récipient, et utiliser leurs unités.',
    objectifsPedagogiques:['Dire que le volume est la place qu’occupe un corps','Dire que la capacité est le volume de liquide qu’un récipient peut contenir','Citer le m³ et ses sous-multiples (dm³, cm³, mm³), le litre et ses multiples et sous-multiples (kL, hL, daL, dL, cL, mL)','Utiliser 1 L = 1 dm³ et 1 mL = 1 cm³ pour convertir'],
    situationEvaluation:'Au marché de Treichville, Aya veut acheter le plus de jus possible. Une bouteille porte « 75 cL », l’autre « 0,8 L », au même prix. Laquelle choisit-elle ? Explique ta conversion.',
    objectif:'Comparer des capacités en les exprimant dans la même unité.',objectifEleve:'Savoir comparer des capacités et convertir des volumes.',
    situation:'Au marché, Awa et Kofi hésitent entre deux bouteilles de jus de gingembre de formes différentes, pleines, vendues au même prix. Contiennent-elles la même quantité de jus ? Et un dé à jouer, qui ne contient rien, a-t-il un volume ?',
    materiel:'Simulation : une bouteille haute et étroite, une bouteille large et basse, un verre mesureur de 1 L, des gobelets de 0,25 L, un cube creux de 1 dm³, un cube de 1 cm³, une seringue de 1 mL.',
    prevision:{consigne:'Avant les essais, choisis la bouteille qui contient le plus de jus. Justifie ton hypothèse (« car… »).',choix:[['large','La bouteille large et basse contient le plus de jus'],['haute','La bouteille haute contient le plus, car elle est plus haute'],['pareil','Elles contiennent autant, puisqu’elles ont le même prix'],['aucune','On ne peut rien comparer sans ouvrir les bouteilles']]},
    protocole:['Vider chaque bouteille dans le même verre mesureur et lire le volume.','Compter les gobelets de 0,25 L remplis avec chaque bouteille.','Remplir d’eau le cube de 1 dm³ et la verser dans le verre mesureur.','Remplir le cube de 1 cm³ et aspirer l’eau avec la seringue de 1 mL.','Convertir quatre volumes ou capacités.'],
    variable:'La bouteille ou le cube utilisé',maintenu:'Le même verre mesureur et le même gobelet',
    colonnes:['Ce que je fais','Ce que je lis','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(Q().EXP_CAPACITE,e.exp),e.lu+' (simulé)',e.observation||'—']).concat(Q().lignesTri(st,'mes01conv',CONV())),
    resume:e=>e.tri?'conversion '+(e.juste?'juste':'à revoir'):lib(Q().EXP_CAPACITE,e.exp).toLowerCase()+' : '+e.lu,
    confrontation:'1. Quelle bouteille contient le plus de jus ? 2. Pourquoi la forme trompe-t-elle ? 3. Combien de litres contient le cube de 1 dm³ ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les deux volumes lus, avec leur unité.',
    transfert:{q:'Un bidon d’huile porte l’étiquette « 5 L ». Quel est son volume en dm³ ?',rep:'5',options:[['5','5 dm³'],['50','50 dm³'],['500','500 dm³']],expl:'1 L = 1 dm³, donc 5 L = 5 dm³.'},
    critere:'Distinguer volume et capacité, comparer deux capacités dans la même unité et réussir quatre conversions.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Compare les bouteilles à l’œil.'],['MF','Mesure les deux bouteilles mais ne relie pas litre et dm³.'],['MS','Compare dans la même unité et utilise 1 L = 1 dm³.'],['TBM','Compare, convertit sans erreur et explique pourquoi la forme trompe.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri),ex=new Set(v.map(e=>e.exp)),c=M().triEtat(st,'mes01conv',CONV().map(x=>x.id));return (ex.has('haute_mes')||ex.has('haute_gob'))&&(ex.has('large_mes')||ex.has('large_gob'))&&(ex.has('cube_dm3')||ex.has('cube_cm3'))&&c.repondus>=4;},
    aides:['Vide les deux bouteilles dans le même verre mesureur : c’est la même règle pour les deux.','Une bouteille haute peut être étroite : la hauteur ne suffit pas pour comparer.','1 L = 1 dm³ ; 1 mL = 1 cm³ ; 1 L = 1 000 mL.'],
    synthese:'Le volume est la place qu’occupe un corps ; son unité internationale est le mètre cube (m³), avec le dm³, le cm³ et le mm³. La capacité est le volume de liquide qu’un récipient peut contenir ; elle s’exprime en litres (L) et en kL, hL, daL, dL, cL, mL. 1 L = 1 dm³ et 1 mL = 1 cm³. Pour comparer deux capacités, on les exprime dans la même unité : la forme d’une bouteille peut tromper.',
    prof:{reference:'Bouteille large 1 L > bouteille haute 0,75 L (valeurs simulées) ; 1 dm³ = 1 L ; 1 cm³ = 1 mL ; conversions : 1 500 mL, 25 cL, 1 L, 50 mL.',attendus:['Comparer les deux bouteilles avec la même mesure.','Écrire les deux définitions.','Réussir quatre conversions.'],erreurs:['Croire que la bouteille la plus haute contient le plus.','Confondre volume et masse.','Oublier que la capacité de l’étiquette est nominale (la bouteille n’est pas remplie à ras bord).']},
    diagnostic:st=>st.essais.length?['Indicatif : mesure les deux bouteilles, puis le cube de 1 dm³.']:['Fais une première expérience.']
  };
})();
