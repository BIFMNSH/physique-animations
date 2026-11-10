/* NohobaLab · 6e Côte d'Ivoire · CHI-21 · Déterminer les proportions des gaz oxygène et azote dans l'air.
   Modèle qualitatif : même expérience que la bougie, avec une éprouvette graduée (TP) ; variante paille de fer (guide, une semaine, simulée).
   Seule valeur : l'eau monte d'environ 1/5 du volume ; le gaz restant (4/5) éteint une bûchette. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    M().bloc(panel,X,{n:21,titre:'Atelier · lire la part de gaz consommée',
      intro:'Je choisis la méthode (bougie, ou paille de fer en variante) et le moment, puis je lis le niveau d’eau sur les graduations de l’éprouvette. Le professeur a allumé la bougie ; la paille de fer est une simulation accélérée.',
      controles:[{cle:'m',legende:'La méthode',items:C().METHODES},{cle:'e',legende:'Le moment de la lecture',items:C().ETAPES_PROP}],
      saisie:'Je lis que l’eau occupe…',legendeTable:'Mes lectures : méthode, moment, niveau lu.',F:()=>window.FICHE_CI_CHI21,
      render:v=>{const p=C().proportion(v.m,v.e),sc=C().sceneProportion(v.m,v.e);return {montage:sc.montage,schema:sc.schema,txt:p.txt,essai:{m:v.m,e:v.e,fraction:p.fraction,lecture:p.lecture}};}});
  }
  window.FICHE_CI_CHI21={
    id:'NL-CI-6E-CHI-21',version:'0.9',modele:'air-proportion-qualitatif-v1',
    titre:'Combien de gaz oxygène dans l’air ?',niveau:'6e',theme:'Air et combustions',chapitre:'Les constituants de l’air',
    competenceVisee:'Déterminer les proportions des gaz oxygène et azote dans un volume d’air en lisant une éprouvette graduée.',
    objectifsPedagogiques:['Lire un niveau sur une éprouvette graduée renversée','Dire que l’eau monte d’environ 1/5 du volume d’air','Conclure : environ 1/5 de gaz oxygène et 4/5 de gaz azote'],
    situationEvaluation:'Dans une éprouvette renversée sur l’eau, cinq graduations égales marquent le volume d’air. Après l’expérience, l’eau atteint la première graduation. Quelle part de l’air était du gaz oxygène ? Quelle part est restée ?',
    objectif:'Mesurer qualitativement la part de gaz oxygène dans l’air.',objectifEleve:'Savoir lire la part d’air consommée et en déduire les proportions des deux gaz.',
    situation:'Dans la première activité, l’eau est montée « d’une petite part » sous le bocal. Awa veut une réponse plus précise : quelle part de l’air est du gaz oxygène ? Le professeur remplace le bocal par une éprouvette graduée.',
    materiel:'Simulation : cristallisoir d’eau colorée, éprouvette graduée (cinq graduations égales), bougie allumée par le professeur ; variante : paille de fer humide (simulation accélérée sur une semaine), bûchette incandescente pour tester le gaz restant.',
    prevision:{consigne:'Avant la lecture, choisis la part de l’air qui est du gaz oxygène. Justifie ton hypothèse.',choix:[['tout','Presque tout l’air'],['moitie','Environ la moitié'],['rien','Presque rien'],['cinquieme','Environ un cinquième']]},
    protocole:['Le professeur allume la bougie et la coiffe de l’éprouvette graduée renversée.','Lire le niveau d’eau au début.','Attendre l’extinction, puis lire le niveau sur les graduations.','Variante : paille de fer, lectures après trois jours et à la fin (simulation).','Noter le test de la bûchette dans le gaz restant.'],
    variable:'Le moment de la lecture',maintenu:'La même éprouvette, les mêmes graduations',
    colonnes:['Méthode','Moment','Niveau lu','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().METHODES,e.m),lib(C().ETAPES_PROP,e.e),e.lecture,e.observation||'—']),
    resume:e=>lib(C().METHODES,e.m).toLowerCase()+', '+lib(C().ETAPES_PROP,e.e).toLowerCase()+' : '+e.lecture,
    confrontation:'1. De combien l’eau est-elle montée à la fin ? 2. Quelle part de l’air a donc été consommée, et quelle part reste ? 3. Que fait la bûchette incandescente dans le gaz restant ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite la lecture finale sur les graduations et ce qu’elle représente.',
    transfert:{q:'Le gaz qui reste dans l’éprouvette (environ 4/5) est-il du gaz oxygène ?',rep:'non',expl:'Non : la bûchette incandescente s’y éteint, ce gaz n’entretient pas la combustion. C’est surtout du gaz azote (diazote), environ 4/5 de l’air.'},
    critere:'Lire environ 1/5 sur l’éprouvette et conclure : environ 1/5 de gaz oxygène, 4/5 de gaz azote.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne lit pas le niveau sur les graduations.'],['MF','Lit le niveau mais ne l’exprime pas en part du volume.'],['MS','Lit environ 1/5 et nomme le gaz consommé.'],['TBM','Donne 1/5 et 4/5, nomme les deux gaz et interprète le test de la bûchette.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.e==='debut')&&v.some(e=>e.fraction>=0.2);},
    aides:['Compte les graduations : combien l’eau en a-t-elle franchi à la fin ?','Une graduation sur cinq, c’est un cinquième du volume.','Le gaz restant éteint la bûchette : ce n’est pas le gaz oxygène.'],
    synthese:'Dans un volume d’air, la combustion consomme environ 1/5 du volume : c’est la part du gaz oxygène (dioxygène), soit environ 20 %. Il reste environ 4/5, soit environ 80 %, surtout du gaz azote (diazote), qui n’entretient pas la combustion.',
    prof:{reference:'Début : niveau 0. Fin (bougie ou paille de fer) : l’eau atteint la première graduation sur cinq, soit environ 1/5 du volume d’air ; la bûchette s’éteint dans le gaz restant. Conclusion : environ 1/5 de gaz oxygène (20 %), 4/5 de gaz azote (80 %). La paille de fer donne le même résultat en une semaine (simulé).',attendus:['Lecture du niveau au début et à la fin.','Niveau exprimé en part du volume (1/5).','Proportions des deux gaz énoncées.'],erreurs:['Lire 1/5 et conclure « 1/5 d’azote ».','Croire que l’eau monte à cause de la chaleur seulement.','Donner une valeur « exacte » alors que la lecture est approximative.']},
    diagnostic:st=>st.essais.length?['Indicatif : lis toujours le niveau de départ avant celui de la fin.']:['Fais une première lecture au début.']
  };
})();
