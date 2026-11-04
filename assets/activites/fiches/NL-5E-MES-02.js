/* NohobaLab · 5e · MES-02 · Pression atmosphérique et altitude.
   Modèle : atmosphère standard arrondie (NohobaMes5e.pression) ; lectures de baromètre simulées. */
(function(){
  'use strict';
  const M=()=>window.NohobaMes5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · lire le baromètre en montant',idObs:'e-obs',placeholder:'J’observe que la pression…',
      intro:'Je choisis un lieu, plus ou moins haut, et je lis la pression indiquée par le baromètre à cadran.',
      fiche:()=>window.FICHE_5E_MES02,
      groupes:[{legende:'Lieu',nom:'e-l',items:N.LIEUX.map(l=>[l[0],l[1]+' · '+N.mh(l[2])]),def:'abidjan'}],
      rendre:v=>{const l=N.lieu(v['e-l']),P=N.pression(l.h);return {montage:N.montageAltitude(l.id),schema:N.schemaBarometre(l.id),lecture:l.nom+' : '+N.fh(P),essai:{l:l.id,h:l.h,P:P}};}});
  }
  window.FICHE_5E_MES02={
    id:'NL-5E-MES-02',version:'0.9',modele:'pression-altitude-v1',
    titre:'La pression change-t-elle avec l’altitude ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'La pression atmosphérique',
    competenceVisee:'Lire un baromètre et relier la pression atmosphérique à l’altitude.',
    objectifsPedagogiques:['Lire une pression en hectopascals sur un baromètre','Comparer des pressions mesurées à des altitudes différentes','Conclure sur l’effet de l’altitude'],
    situationEvaluation:'Awa monte à 5 000 m avec son baromètre. La valeur lue sera-t-elle plus grande ou plus petite que 1 013 hPa ? Justifie avec tes mesures.',
    objectif:'Relier la pression atmosphérique à l’altitude.',
    objectifEleve:'Savoir lire un baromètre et relier la pression à l’altitude.',
    situation:'Awa part d’Abidjan, au bord de la lagune, pour monter au mont Tonkoui avec son baromètre. Elle se demande si la valeur qu’elle lit va changer en montant.',
    materiel:'Baromètre à cadran (en hPa), carte des altitudes, simulation.',
    prevision:{consigne:'Avant les mesures, choisis ce qui arrive à la pression en montant. Justifie ton hypothèse avec « car ».',choix:[
      ['diminue','La pression diminue quand l’altitude augmente'],['augmente','La pression augmente quand l’altitude augmente'],['constante','La pression ne change pas avec l’altitude'],['nulle','La pression devient nulle dès qu’on monte']]},
    protocole:['Lire la pression à Abidjan, au niveau de la mer.','Lire la pression en montant : mont Tonkoui, mont Nimba.','Lire la pression à très haute altitude : Kilimandjaro, Everest.','Écrire une observation après chaque lecture.'],
    variable:'L’altitude du lieu',maintenu:'Le baromètre et la méthode de lecture',
    colonnes:['Lieu','Altitude','Pression','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[M().lieu(e.l).nom,M().mh(e.h),M().fh(e.P),e.observation||'—']),
    resume:e=>M().lieu(e.l).nom+' ('+M().mh(e.h)+') : '+M().fh(e.P),
    confrontation:'1. Range les lieux du plus bas au plus haut : que fait la pression ? 2. Compare la valeur à Abidjan (environ 1 013 hPa) à celle de l’Everest. 3. La pression devient-elle nulle ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux lieux avec leur altitude et leur pression, en indiquant le sens de la variation.',
    transfert:{q:'Awa monte à 5 000 m. La pression lue sera :',rep:'petite',options:[['grande','plus grande que 1 013 hPa'],['egale','égale à 1 013 hPa'],['petite','plus petite que 1 013 hPa'],['nulle','nulle']],expl:'La pression diminue quand l’altitude augmente : à 5 000 m, elle est plus petite que 1 013 hPa (sans devenir nulle).'},
    critere:'Lire au moins quatre pressions et conclure que la pression diminue quand l’altitude augmente.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne lit pas correctement le baromètre.'],['MF','Lit les valeurs sans les relier à l’altitude.'],['MS','Conclut que la pression diminue quand l’altitude augmente.'],['TBM','Conclut, cite des valeurs avec l’unité hPa et note que la pression ne devient pas nulle.']],
    peutConfronter:st=>{const v=E().valides(st),l=new Set(v.map(e=>e.l));return l.size>=4&&l.has('abidjan')&&v.some(e=>e.h>=5000);},
    aides:['Lis l’aiguille du baromètre en hPa.','Compare la pression en bas (Abidjan) et en haut (Everest).','As-tu lu au moins quatre lieux, dont le plus bas et un sommet très haut ?'],
    synthese:'L’air exerce une pression : la pression atmosphérique. On la mesure avec un baromètre, en hectopascals (hPa) ; au niveau de la mer, elle vaut environ 1 013 hPa (76 cmHg). La pression atmosphérique diminue quand l’altitude augmente : à l’Everest, elle est environ trois fois plus petite qu’à Abidjan.',
    prof:{reference:'Abidjan 1 013 hPa ; mont Tonkoui environ 873 hPa ; mont Nimba environ 817 hPa ; Kilimandjaro environ 480 hPa ; Everest environ 314 hPa.',attendus:['Hypothèse notée avant les lectures.','Au moins quatre lieux lus avec l’unité.','Phrase : la pression diminue quand l’altitude augmente.'],erreurs:['Croire que la pression augmente avec l’altitude.','Oublier l’unité (hPa).','Penser qu’il n’y a plus de pression en haut.']},
    diagnostic:st=>E().valides(st).some(e=>e.h>=5000)?['Compare cette valeur à celle d’Abidjan : que remarques-tu ?']:['Lis la pression sur un sommet très haut.']
  };
})();
