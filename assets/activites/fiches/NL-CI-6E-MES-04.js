/* NohobaLab · 6e Côte d'Ivoire · MES-04 · Déterminer le volume d'un solide de forme géométrique simple.
   Cube, pavé (V = L × ℓ × h) et cylindre (V = 3,14 × r × r × h, 3,14 valeur approchée comme le manuel). Dimensions entières ou au demi-centimètre.
   Contrôle par l'eau seulement pour un solide insoluble. Erreur à prévoir : diamètre pris pour le rayon. Sphère non retenue. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const FORMES=()=>Q().FORMES.map(f=>[f.id,f.court]);
  const CTRL=[['pave','Le pavé de métal'],['cylindre','Le cylindre de métal']];
  function manip(panel,X){
    M().bloc(panel,X,{n:204,titre:'Atelier 1 · je remplis un pavé avec des cubes de 1 cm³',
      intro:'Le pavé creux mesure 4 cm × 3 cm × 2 cm. Je pose les cubes unités couche par couche.',
      controles:[{cle:'couches',legende:'Couches posées',items:[['1','Une couche'],['2','Deux couches (le pavé est plein)']]}],
      saisie:'J’observe qu’une couche compte … cubes et que…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES04,
      render:v=>{const r=Q().cubesPave(Number(v.couches)),sc=Q().scene.cubes({couches:Number(v.couches)});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{atelier:'cubes',couches:r.couches,total:r.total}};}});
    Q().mesure(panel,X,{id:'mes04calc',titre:'Atelier 2 · je mesure à la règle et je calcule',
      intro:'Je lis chaque dimension sur la règle (le bord de l’objet est sur le zéro), puis j’applique la formule. Toutes les longueurs en cm, le volume en cm³.',
      controles:[{cle:'id',legende:'L’objet',items:FORMES()}],
      champs:v=>Q().dimensions(v.id).map(d=>({cle:d[0],label:d[1].charAt(0).toUpperCase()+d[1].slice(1),unite:'cm'})).concat([{cle:'V',label:'Volume calculé',unite:'cm³'}]),
      F:()=>window.FICHE_CI_MES04,legendeTable:'Mes mesures et mes calculs.',
      render:v=>{const sc=Q().scene.forme(v);return {montage:sc.montage,schema:sc.schema,txt:'Formule : '+Q().formule(v.id)+'.'+(Q().forme(v.id).type==='cylindre'?' Le rayon r est la moitié du diamètre.':'')};},
      verifier:(v,s)=>{const r=Q().verifierVolumeForme(v.id,s,s.V);return {juste:r.juste,retour:r.retour,essai:{atelier:'calcul',id:v.id,V:r.attendu}};},
      attendu:v=>{const o={};Q().dimensions(v.id).forEach(d=>o[d[0]]=Q().fr(d[2]));o.V=Q().fr(Q().volumeForme(v.id));return o;},
      aide:v=>Q().forme(v.id).type==='cylindre'?'Mesure le diamètre, divise-le par 2 pour avoir le rayon, puis calcule 3,14 × r × r × h.':'Multiplie les trois dimensions, toutes en cm.'});
    Q().mesure(panel,X,{id:'mes04eau',titre:'Atelier 3 · je contrôle par l’eau (solides insolubles)',
      intro:'Je plonge le pavé ou le cylindre de métal dans l’éprouvette de 250 cm³ (une division = 5 cm³) et je compare au calcul. On ne plonge ni la boîte d’allumettes ni la boîte de conserve.',
      controles:[{cle:'id',legende:'Le solide',items:CTRL}],
      champs:[{cle:'V1',label:'V₁',unite:'cm³'},{cle:'V2',label:'V₂',unite:'cm³'},{cle:'V',label:'V = V₂ − V₁',unite:'cm³'}],
      F:()=>window.FICHE_CI_MES04,legendeTable:'Mes contrôles.',
      render:v=>{const sc=Q().scene.controleEau(v);return {montage:sc.montage,schema:sc.schema,txt:'Lis V₁ et V₂ au bas du ménisque.'};},
      verifier:(v,s)=>{const c=Q().controleEau(v.id),a=Q().nombre(s.V1),b=Q().nombre(s.V2),x=Q().nombre(s.V),ok=Q().egal(a,c.V1)&&Q().egal(b,c.V2)&&Q().egal(x,b-a);
        return {juste:ok,retour:ok?'Oui : '+c.V+' cm³ par l’eau, '+Q().fr(c.calcul)+' cm³ par le calcul : les deux résultats concordent à la précision de la lecture.':'Relis V₁ et V₂ : une division vaut 5 cm³ ; puis calcule V₂ − V₁.',essai:{atelier:'eau',id:v.id,V:c.V,calcul:c.calcul}};},
      attendu:v=>{const c=Q().controleEau(v.id);return {V1:c.V1,V2:c.V2,V:c.V};}});
  }
  function ligne(e){
    if(e.atelier==='cubes'&&!e.mesure)return ['Cubes unités · '+e.couches+' couche'+(e.couches>1?'s':''),e.total+' cubes de 1 cm³',e.observation||'—'];
    if(e.mesure==='mes04calc')return ['Calcul · '+lib(FORMES(),e.id),e.saisies.V+' cm³',e.juste?'Juste':'À revoir'];
    if(e.mesure==='mes04eau')return ['Contrôle par l’eau · '+lib(CTRL,e.id),e.saisies.V+' cm³ (calcul : '+Q().fr(e.calcul)+' cm³)',e.juste?'Juste':'À revoir'];
    return null;
  }
  window.FICHE_CI_MES04={
    id:'NL-CI-6E-MES-04',version:'0.9',modele:'volume-forme-v1',
    titre:'Déterminer le volume d’un solide de forme géométrique simple',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Volume d’un liquide et d’un solide',
    competenceVisee:'Calculer le volume d’un cube, d’un pavé ou d’un cylindre à partir de ses dimensions.',
    objectifsPedagogiques:['Mesurer les dimensions avec une règle graduée','Calculer V = a × a × a, V = L × ℓ × h ou V = 3,14 × r × r × h','Exprimer le résultat en cm³','Comparer le calcul à une mesure par déplacement d’eau'],
    situationEvaluation:'Kofi veut savoir combien de cubes de sucre de 1 cm³ tiennent dans une boîte de 6 cm × 4 cm × 3 cm. Calcule le volume de la boîte et explique ta méthode.',
    objectif:'Calculer le volume d’un solide de forme simple.',objectifEleve:'Savoir calculer le volume d’un pavé, d’un cube ou d’un cylindre.',
    situation:'Pour un pavé de métal, une boîte d’allumettes ou une boîte de conserve, Awa se demande s’il faut plonger l’objet dans l’eau ou si l’on peut calculer son volume avec une règle.',
    materiel:'Simulation : un pavé creux et des cubes de 1 cm³, une règle graduée, un cube de bois, un pavé et un cylindre de métal, une boîte d’allumettes, une boîte de conserve, une éprouvette de 250 cm³.',
    prevision:{consigne:'Avant les essais, choisis combien de cubes de 1 cm³ remplissent le pavé de 4 cm × 3 cm × 2 cm. Justifie ton hypothèse.',choix:[['24','24 cubes'],['9','9 cubes (4 + 3 + 2)'],['12','12 cubes'],['48','48 cubes']]},
    protocole:['Remplir le pavé couche par couche avec des cubes de 1 cm³.','Mesurer les dimensions de chaque objet à la règle.','Calculer le volume avec la formule.','Contrôler le pavé et le cylindre de métal par déplacement d’eau.'],
    variable:'L’objet mesuré',maintenu:'La même règle et la même unité (cm)',
    colonnes:['Ce que je fais','Résultat','Mon observation ou verdict'],lignesVides:6,
    lignes:st=>st.essais.map(ligne).filter(Boolean),
    resume:e=>e.mesure==='mes04calc'?lib(FORMES(),e.id).toLowerCase()+' : '+Q().fr(e.V)+' cm³':e.mesure==='mes04eau'?'contrôle '+e.id+' : '+e.V+' cm³':e.total+' cubes',
    confrontation:'1. Combien de cubes de 1 cm³ remplissent le pavé ? 2. Quelle formule donne ce nombre sans compter ? 3. Le calcul et la mesure par l’eau concordent-ils ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les dimensions d’un objet et le volume calculé avec son unité.',
    transfert:{q:'Une boîte d’allumettes mesure 5 cm × 4 cm × 2 cm. Quel est son volume ?',type:'nombre',unite:'cm³',rep:40,tol:0,expl:'V = L × ℓ × h = 5 × 4 × 2 = 40 cm³.'},
    critere:'Calculer juste le volume d’un pavé et d’un cylindre, avec l’unité, et le comparer à une mesure par l’eau.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Additionne les dimensions.'],['MF','Calcule le pavé mais se trompe sur le cylindre (diamètre pour rayon).'],['MS','Calcule pavé, cube et cylindre avec l’unité cm³.'],['TBM','Calcule, contrôle par l’eau et explique l’écart dû à la précision de lecture.']],
    peutConfronter:st=>{const v=M().valides(st),j=Q().justes(st,'mesure','mes04calc'),t=new Set(j.map(e=>Q().forme(e.id).type));return v.some(e=>e.atelier==='cubes'&&e.couches===2)&&t.has('pave')&&t.has('cylindre')&&j.length>=3&&Q().justes(st,'mesure','mes04eau').length>=1;},
    aides:['Une couche du pavé compte 4 × 3 = 12 cubes ; il y a 2 couches.','Toutes les dimensions doivent être dans la même unité (cm).','Pour le cylindre : r = diamètre ÷ 2, puis 3,14 × r × r × h.'],
    synthese:'Le volume d’un solide de forme simple se calcule à partir de ses dimensions, toutes dans la même unité : cube V = a × a × a ; pavé V = L × ℓ × h ; cylindre V = 3,14 × r × r × h (r = diamètre ÷ 2). En centimètres, le volume s’écrit en cm³. Pour un solide insoluble, le calcul et la mesure par déplacement d’eau concordent à la précision de la lecture près.',
    prof:{reference:'Pavé creux : 24 cubes ; cube 27 cm³ ; pavé de métal 24 cm³ ; boîte d’allumettes 26,25 cm³ ; cylindre 62,8 cm³ ; conserve 502,4 cm³ ; contrôle par l’eau : 25 cm³ et 65 cm³ à 5 cm³ près (valeurs simulées).',attendus:['Mesurer les dimensions.','Appliquer la bonne formule.','Écrire l’unité cm³.','Comparer au contrôle par l’eau.'],erreurs:['Additionner les dimensions.','Prendre le diamètre pour le rayon.','Mélanger cm et mm.']},
    diagnostic:st=>st.essais.length?['Indicatif : calcule un pavé et un cylindre, puis contrôle par l’eau.']:['Commence par remplir le pavé de cubes.']
  };
})();
