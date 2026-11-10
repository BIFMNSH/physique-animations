/* NohobaLab · 6e Côte d'Ivoire · CHI-08 · Distinguer le combustible du comburant.
   Modèle qualitatif : dix cartes présentées à une flamme d'essai dans l'air ou dans un bocal de gaz oxygène ; puis classement combustible / comburant / ni l'un ni l'autre. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const RES={brule:'Brûle',vive:'Brûle vivement',eteint:'Éteint la flamme',rien:'Ne brûle pas'};
  function manip(panel,X){
    M().bloc(panel,X,{n:8,titre:'Banc d’essai · ça brûle ou pas ?',
      intro:'Le professeur présente chaque corps à une flamme d’essai, dans l’air puis dans un bocal de gaz oxygène. Je choisis le corps et le milieu, je regarde, puis j’écris ce que je vois. Simulation seulement.',
      controles:[{cle:'c',legende:'Le corps testé',items:C().CARTES.map(c=>[c.id,c.nom])},{cle:'m',legende:'Le milieu',items:C().MILIEUX}],
      saisie:'J’observe que…',legendeTable:'Mes essais : corps, milieu, résultat.',F:()=>window.FICHE_CI_CHI08,
      render:v=>{const r=C().essaiFlamme(v.c,v.m),sc=C().sceneFlammeEssai(v.c,v.m);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{c:v.c,m:v.m,resultat:r.resultat}};}});
    const items=C().CARTES.map(c=>({id:c.id,label:c.nom,juste:c.role,pourquoi:c.pourquoi,aide:'Un combustible brûle. Un comburant ne brûle pas mais fait brûler. L’eau et le sable éteignent.'}));
    M().tri(panel,X,{id:'roles',titre:'Je classe · combustible, comburant ou ni l’un ni l’autre',intro:'Avec mes essais, je classe chaque corps.',legende:'Ce corps est',cats:C().ROLES,items});
  }
  window.FICHE_CI_CHI08={
    id:'NL-CI-6E-CHI-08',version:'0.9',modele:'combustible-comburant-v1',
    titre:'Qui brûle, grâce à quoi ?',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Distinguer le combustible du comburant.',
    objectifsPedagogiques:['Définir le combustible : le corps qui brûle','Définir le comburant : le corps qui fait brûler, le gaz oxygène de l’air','Donner des exemples de combustibles du quotidien'],
    situationEvaluation:'Awa dit : « dans le fourneau, le combustible c’est l’air, puisque sans air ça ne brûle pas ». Corrige-la en utilisant les mots combustible et comburant, avec un essai du banc.',
    objectif:'Définir combustible et comburant.',objectifEleve:'Savoir dire qui brûle et grâce à quoi.',
    situation:'Pour le fourneau, on achète du charbon ; pour la gazinière, du butane ; pour le réchaud, de l’alcool. Kofi demande : « qu’est-ce que toutes ces combustions ont en commun ? » Le professeur installe un banc d’essai.',
    materiel:'Simulation : dix corps (charbon, alcool, butane, bois, pétrole lampant, bougie, gaz oxygène, air, eau, sable), flamme d’essai, bocal de gaz oxygène. Gestes du professeur.',
    prevision:{consigne:'Avant les essais, choisis ta définition. Justifie ton hypothèse.',choix:[['charbonComburant','Le charbon est le comburant'],['oxygeneBrule','Le gaz oxygène brûle'],['airCombustible','L’air est le combustible'],['def','Le combustible est le corps qui brûle ; le comburant (gaz oxygène) permet la combustion']]},
    protocole:['Présenter chaque corps à la flamme d’essai dans l’air : brûle, ne brûle pas, éteint ?','Refaire dans le bocal de gaz oxygène : comparer.','Classer les dix corps : combustible, comburant, ni l’un ni l’autre.','Écrire les deux définitions.'],
    variable:'Le corps testé et le milieu',maintenu:'La même flamme d’essai',
    colonnes:['Corps','Milieu','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[C().carte(e.c).nom,lib(C().MILIEUX,e.m),RES[e.resultat],e.observation||'—']).concat(M().lignesTri(st,'roles',i=>C().carte(i).nom,c=>lib(C().ROLES,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?'corps classé : '+lib(C().ROLES,e.choix).toLowerCase():C().carte(e.c).nom.toLowerCase()+', '+lib(C().MILIEUX,e.m).toLowerCase()+' : '+RES[e.resultat].toLowerCase(),
    confrontation:'1. Quels corps brûlent ? 2. Lequel ne brûle pas mais rend la combustion plus vive ? 3. Que font l’eau et le sable ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un combustible, le comburant, et un essai qui le montre.',
    transfert:{q:'Pour éteindre un petit feu, on jette du sable dessus. Le sable est-il un comburant ?',rep:'non',expl:'Non : le sable ne brûle pas et ne fait pas brûler. Il étouffe le feu en le séparant de l’air, donc du comburant, le gaz oxygène.'},
    critere:'Classer les dix corps et définir combustible et comburant.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Confond combustible et comburant.'],['MF','Reconnaît les combustibles mais pas le rôle du gaz oxygène.'],['MS','Définit les deux mots et classe les corps.'],['TBM','Explique le cas de l’air, de l’eau et du sable.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>!e.tri);return v.length>=4&&v.some(e=>e.resultat==='brule'||e.resultat==='vive')&&v.some(e=>e.m==='o2')&&M().triEtat(st,'roles',C().CARTES.map(c=>c.id)).repondus>=10;},
    aides:['Combustible : il brûle. Comburant : il fait brûler sans brûler lui-même.','Dans le bocal de gaz oxygène, un combustible brûle plus vivement.','L’air est comburant parce qu’il contient le gaz oxygène.'],
    synthese:'Le combustible est le corps qui brûle : charbon de bois, bois, alcool, butane, pétrole, bougie. Le comburant est le corps qui permet la combustion sans brûler lui-même : le gaz oxygène (dioxygène) de l’air. L’eau et le sable ne sont ni l’un ni l’autre : ils éteignent.',
    prof:{reference:'Combustibles : charbon, alcool, butane, bois, pétrole lampant, bougie (brûlent dans l’air, vivement dans le gaz oxygène). Comburants : gaz oxygène, air. Ni l’un ni l’autre : eau, sable (éteignent).',attendus:['Au moins quatre essais dont un dans le gaz oxygène.','Dix corps classés.','Deux définitions écrites.'],erreurs:['Dire que l’oxygène brûle.','Appeler l’air « combustible ».','Classer l’eau en comburant.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste aussi dans le bocal de gaz oxygène.']:['Commence par le charbon dans l’air.']
  };
})();
