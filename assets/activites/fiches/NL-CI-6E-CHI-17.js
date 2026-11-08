/* NohobaLab · 6e Côte d'Ivoire · CHI-17 · Découvrir le triangle du feu.
   Modèle qualitatif : feuille de papier allumée par le professeur ; trois leviers (priver d'air, retirer le combustible, refroidir) ; le triangle perd un côté. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:17,titre:'Atelier · trois façons d’éteindre',
      intro:'Le professeur allume une feuille de papier sur une soucoupe. Je choisis un geste, je regarde la flamme et le triangle du feu, puis j’écris ce que je vois. Simulation : je ne touche ni à la flamme ni aux allumettes.',
      controles:[{cle:'g',legende:'Le geste',items:C().GESTES}],
      saisie:'J’observe que la flamme… parce que…',legendeTable:'Mes essais : geste, flamme, sommet supprimé.',F:()=>window.FICHE_CI_CHI17,
      render:v=>{const r=C().triangle(v.g),sc=C().sceneTriangle(v.g);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{g:v.g,brule:r.brule,sommet:r.sommet}};}});
    const items=C().GESTES.filter(g=>g[0]!=='rien'&&g[0]!=='froid').map(g=>({id:g[0],label:g[1],juste:C().triangle(g[0]).sommet,pourquoi:C().triangle(g[0]).txt,aide:'Le geste enlève quoi : l’air, le combustible ou la chaleur ?'}));
    M().tri(panel,X,{id:'sommets',titre:'Je classe · quel sommet chaque geste supprime-t-il ?',intro:'Pour chaque geste, je dis quel élément du triangle il enlève.',legende:'Ce geste supprime',cats:C().SOMMETS,items});
  }
  window.FICHE_CI_CHI17={
    id:'NL-CI-6E-CHI-17',version:'0.9',modele:'triangle-feu-v1',
    titre:'Le triangle du feu',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Découvrir les trois éléments du triangle du feu et montrer qu’en supprimer un éteint le feu.',
    objectifsPedagogiques:['Nommer les trois éléments : combustible, comburant (air), chaleur','Relier chaque geste d’extinction au sommet qu’il supprime','Dire qu’un feu ne démarre pas sans source de chaleur'],
    situationEvaluation:'Pour éteindre un feu d’huile dans une casserole, la grand-mère d’Awa pose un couvercle. Explique avec le triangle du feu pourquoi cela marche, et pourquoi il ne faut pas verser d’eau.',
    objectif:'Découvrir le triangle du feu.',objectifEleve:'Savoir de quoi un feu a besoin et comment l’éteindre.',
    situation:'Pour éteindre le fourneau, la grand-mère d’Awa pose un couvercle ; Kofi verse de l’eau ; l’oncle ferme le robinet de gaz de la gazinière. Pourquoi ces trois gestes marchent-ils ? Le professeur fait brûler une feuille de papier.',
    materiel:'Simulation : feuille de papier, soucoupe, allumettes (professeur), bocal, sable, eau ; triangle du feu dessiné.',
    prevision:{consigne:'Avant les essais, choisis ce qu’il faut pour qu’un feu existe. Justifie ton hypothèse.',choix:[['un','Un seul élément suffit : le combustible'],['chaleur','Il faut seulement de la chaleur'],['trois','Il faut trois éléments réunis : combustible, comburant (air), chaleur'],['eau','Le feu a besoin d’eau']]},
    protocole:['Le professeur allume le papier : observer le triangle complet.','Essayer chaque geste : couvrir d’un bocal, verser du sable, écarter le papier non brûlé, verser de l’eau.','Essayer d’allumer sans source de chaleur.','Classer les gestes selon le sommet supprimé.'],
    variable:'Le geste',maintenu:'La même feuille de papier, la même soucoupe',
    colonnes:['Geste','Flamme','Sommet supprimé','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(C().GESTES,e.g),e.brule?'Brûle':'Éteinte / pas d’allumage',e.sommet?lib(C().SOMMETS,e.sommet):'Aucun',e.observation||'—']).concat(M().lignesTri(st,'sommets',i=>lib(C().GESTES,i),c=>lib(C().SOMMETS,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?'geste classé : '+lib(C().SOMMETS,e.choix).toLowerCase():lib(C().GESTES,e.g).toLowerCase()+' : '+(e.brule?'brûle':'éteint'),
    confrontation:'1. Quels gestes privent le feu d’air ? 2. Quel geste retire le combustible ? Lequel refroidit ? 3. Pourquoi le papier ne s’allume-t-il pas sans source de chaleur ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite trois gestes et le sommet que chacun supprime.',
    transfert:{q:'Verser de l’eau sur une casserole d’huile en feu est-il un bon moyen d’éteindre ?',rep:'non',expl:'Non : l’eau projette l’huile enflammée et aggrave le feu. On supprime l’air avec un couvercle et on coupe le gaz (chaleur). Jamais d’eau sur l’huile.'},
    critere:'Nommer les trois éléments du triangle et relier cinq gestes au sommet supprimé.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense qu’un seul élément suffit.'],['MF','Nomme les trois éléments sans les relier aux gestes.'],['MS','Relie chaque geste au sommet supprimé.'],['TBM','Explique le cas de l’huile et de l’allumage sans chaleur.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>!e.tri);return v.length>=5&&v.some(e=>e.g==='rien')&&C().distincts(v.filter(e=>e.sommet),'sommet')>=3&&M().triEtat(st,'sommets',['bocal','sable','ecarter','eau']).repondus>=4;},
    aides:['Le bocal et le sable séparent le feu de l’air : c’est le comburant qui manque.','Écarter le papier non brûlé : plus de combustible.','L’eau refroidit : plus assez de chaleur.'],
    synthese:'Un feu a besoin de trois éléments réunis, le triangle du feu : un combustible, un comburant (le gaz oxygène de l’air) et une source de chaleur. Supprimer un seul des trois éteint le feu : étouffer (couvercle, sable, bocal), retirer le combustible (fermer le gaz, écarter), refroidir (eau). Jamais d’eau sur l’huile en feu.',
    prof:{reference:'Laisser brûler : triangle complet. Bocal, sable : comburant supprimé. Écarter le papier : combustible supprimé. Eau : chaleur supprimée. Sans source de chaleur : pas d’allumage. Papier retenu (TP et guide ; décision du propriétaire).',attendus:['Cinq essais dont le triangle complet.','Trois sommets supprimés au moins une fois.','Quatre gestes classés.'],erreurs:['Classer le sable dans « refroidir ».','Oublier la chaleur comme élément nécessaire.','Croire que l’eau convient à tous les feux.']},
    diagnostic:st=>st.essais.length?['Indicatif : essaie aussi d’allumer sans chaleur.']:['Commence par « je laisse brûler ».']
  };
})();
