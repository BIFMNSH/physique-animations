/* NohobaLab · 6e Côte d'Ivoire · ENE-08 · Comparer des ressources d'énergie. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : renouvelable ou non renouvelable. Garde-fou : une pile n'est pas une ressource, c'est un réservoir qui se vide. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const CATS=[['renouvelable','Renouvelable'],['non_renouvelable','Non renouvelable']];
  const OPT_PILE=[['renouvelable','Renouvelable'],['non_renouvelable','Non renouvelable'],['reservoir','Ni l’un ni l’autre : c’est un réservoir qui se vide']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const nom=id=>NE().ressource(id).nom;
  function manip(panel,X){
    const h=window.Activite.h;
    const c=h('div',{class:'card'},panel);h('h3',{text:'Pour comprendre'},c);
    h('p',{},c,'Une ressource est <b>renouvelable</b> si elle se reforme assez vite pour qu’on ne l’épuise pas en l’utilisant (le Soleil, le vent, l’eau des rivières). Elle est <b>non renouvelable</b> si on l’utilise beaucoup plus vite qu’elle ne se reforme (le pétrole, le charbon, le gaz naturel : il faut des millions d’années pour les former).');
    const items=NE().RESSOURCES.map(r=>({id:r.id,label:r.nom,juste:r.type,options:r.type==='reservoir'?OPT_PILE:undefined,pourquoi:r.pourquoi,
      aide:r.type==='reservoir'?'Une pile se vide quand on l’utilise, mais est-ce une ressource de la nature ?':'Se reforme-t-elle assez vite pour qu’on ne l’épuise pas ?',
      retour:r.type==='reservoir'?{renouvelable:'Non : une pile ne se reforme pas toute seule. '+r.pourquoi,non_renouvelable:'Non : une pile n’est pas un gisement de la nature. '+r.pourquoi}:undefined}));
    M().tri(panel,X,{id:'ressources',titre:'Je classe les ressources d’énergie',intro:'Classe chaque ressource : renouvelable ou non renouvelable. Attention, un des objets n’est pas une ressource.',legende:'Cette ressource est',cats:CATS,items});
  }
  window.FICHE_CI_ENE08={
    id:'NL-CI-6E-ENE-08',version:'0.9',modele:'ressources-energie-v1',
    titre:'Comparer des ressources d’énergie',niveau:'6e',
    theme:'Énergie',chapitre:'Produire de l’énergie électrique',
    competenceVisee:'Classer des ressources d’énergie en renouvelables ou non renouvelables.',
    objectifsPedagogiques:['Dire qu’une ressource renouvelable se reforme assez vite','Dire qu’une ressource non renouvelable s’épuise','Dire qu’une pile n’est pas une ressource d’énergie : c’est un réservoir qui se vide'],
    situationEvaluation:'Kofi dit : « le pétrole est renouvelable : il y en a encore dans le sol ». Que lui réponds-tu ? Utilise les mots « se reforme » et « s’épuise ».',
    objectif:'Classer des ressources en renouvelables ou non renouvelables.',objectifEleve:'Savoir classer une ressource et justifier mon choix.',
    situation:'Une école de Côte d’Ivoire veut choisir comment produire son électricité. Avant de décider, les élèves se demandent d’où vient l’énergie et si elle peut s’épuiser.',
    materiel:'Sept cartes : le Soleil, le vent, un cours d’eau, le pétrole, le charbon, le gaz naturel, une pile.',
    prevision:{consigne:'Avant le classement, choisis la phrase qui te paraît juste. Justifie ton hypothèse.',choix:[['juste','Le Soleil, le vent et l’eau se renouvellent ; le pétrole, le charbon et le gaz s’épuisent'],['tout_ren','Toutes les ressources se renouvellent, il y en aura toujours'],['tout_non','Toutes les ressources s’épuisent'],['inverse','Le pétrole se renouvelle, le Soleil s’épuise']]},
    protocole:['Lire l’aide « Pour comprendre ».','Classer chaque ressource, une carte après l’autre.','Lire le retour expliqué de chaque réponse et réessayer si besoin.','Repérer l’objet qui n’est pas une ressource.'],
    variable:'La ressource classée',maintenu:'Le critère : se reforme-t-elle assez vite ?',
    colonnes:['Ressource','Mon classement','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'ressources',i=>nom(i),c=>lib(OPT_PILE,c)).map(r=>[r[0],r[1],r[2]]),
    resume:e=>nom(e.item).toLowerCase()+' → '+lib(OPT_PILE,e.choix).toLowerCase()+(e.juste?'':' (à revoir)'),
    confrontation:'1. Quelles ressources se reforment assez vite ? 2. Lesquelles s’épuisent ? 3. Qu’est-ce qui n’est pas une ressource ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une ressource renouvelable et une non renouvelable et dis pourquoi.',
    transfert:{q:'Une pile qui se vide est-elle une ressource non renouvelable de la nature ?',rep:'non',expl:'Non : une pile n’est pas un gisement de la nature. C’est un petit réservoir d’énergie fabriqué par l’homme, qui se vide quand on l’utilise.'},
    critere:'Classer les ressources et justifier le cas de la pile.',
    essaisMin:7,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Classe sans critère.'],['MF','Classe correctement mais sans justifier.'],['MS','Classe les six ressources et justifie par « se reforme » ou « s’épuise ».'],['TBM','Classe, justifie et explique que la pile est un réservoir, pas une ressource.']],
    peutConfronter:st=>M().triEtat(st,'ressources',NE().RESSOURCES.map(r=>r.id)).repondus>=7,
    aides:['Se reforme-t-elle assez vite pour qu’on ne l’épuise pas ?','Le pétrole, le charbon et le gaz naturel ont mis des millions d’années à se former.','Une pile se vide ; ce n’est pas un gisement de la nature.'],
    synthese:'Le Soleil, le vent et l’eau des rivières sont des ressources renouvelables : elles se reforment assez vite. Le pétrole, le charbon et le gaz naturel sont non renouvelables : on les épuise. Une pile n’est pas une ressource de la nature : c’est un réservoir qui se vide.',
    prof:{reference:'Renouvelables : Soleil, vent, eau. Non renouvelables : pétrole, charbon, gaz naturel. Pile : réservoir, pas une ressource.',attendus:['Classer les six ressources.','Rejeter l’idée que la pile est une ressource non renouvelable.'],erreurs:['Dire que le pétrole est renouvelable car il y en a encore.','Classer la pile parmi les ressources non renouvelables.']},
    diagnostic:st=>M().triEtat(st,'ressources',NE().RESSOURCES.map(r=>r.id)).repondus?['Indicatif : lis le retour de chaque réponse.']:['Classe une première ressource.']
  };
})();
