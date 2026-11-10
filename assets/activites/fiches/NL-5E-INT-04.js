/* NohobaLab · 5e · INT-04 · Loi des intensités dans un circuit avec dérivation.
   Modèle : pile idéale 4,5 V, L1 30 Ω (150 mA) et L2 45 Ω (100 mA) en dérivation : 250 mA dans la branche principale ; valeurs de simulation (NohobaIntensite5e.derivation). */
(function(){
  'use strict';
  const M=()=>window.NohobaIntensite5e,E=()=>window.NohobaElec5e;
  const nomPt=p=>M().PTS.filter(x=>x[0]===p)[0][1];
  function manip(panel,X){
    const m=M();
    E().atelier(panel,X,{titre:'Atelier · le courant se partage-t-il ?',idObs:'e-obs',placeholder:'J’observe que l’intensité dans…',
      intro:'L1 et L2 sont en dérivation. Je place l’ampèremètre dans la branche principale (A), dans la branche de L1 (A1) ou dans celle de L2 (A2), puis je lis l’intensité.',
      fiche:()=>window.FICHE_5E_INT04,
      groupes:[{legende:'Je place l’ampèremètre dans la',nom:'e-p',items:m.PTS,def:'P'},
        {legende:'Interrupteur K',nom:'e-k',items:[['ferme','Fermé'],['ouvert','Ouvert']],def:'ferme'},
        {legende:'Lampe L2',nom:'e-l',items:[['oui','Vissée'],['non','Dévissée']],def:'oui'}],
      rendre:v=>{const pt=v['e-p'],f=v['e-k']==='ferme',l2=v['e-l']==='oui',r=m.derivation(pt,f,l2);
        return {montage:m.montageDeriv(pt,f,l2),schema:m.schemaDeriv(pt,f,l2),
          lecture:'Intensité lue dans la '+nomPt(pt).toLowerCase()+' : '+m.mA(r.lu)+(f?'':' (circuit ouvert)'),
          essai:{pt:pt,ferme:f,l2:l2,i:r.lu}};}});
  }
  const val=st=>E().valides(st);
  window.FICHE_5E_INT04={
    id:'NL-5E-INT-04',version:'0.9',modele:'intensite-derivation-v1',
    titre:'En dérivation, le courant se partage-t-il ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'L’intensité du courant électrique',
    competenceVisee:'Établir la relation entre l’intensité dans la branche principale et les intensités dans les branches dérivées.',
    objectifsPedagogiques:['Mesurer l’intensité dans la branche principale et dans chaque branche dérivée','Comparer I à la somme I1 + I2','Énoncer la loi des intensités dans un circuit avec dérivation'],
    situationEvaluation:'Dans un circuit avec deux lampes en dérivation, Kofi mesure 300 mA dans la branche principale et 180 mA dans la branche de la première lampe. Quelle est l’intensité dans la branche de la seconde lampe ? Justifie.',
    objectif:'Comparer l’intensité dans la branche principale et dans les branches dérivées.',
    objectifEleve:'Savoir utiliser la loi des intensités dans un circuit avec dérivation.',
    situation:'Dans la chambre d’Awa, deux lampes sont branchées en dérivation sur la même pile. Awa pense que chaque lampe reçoit tout le courant de la pile. Kofi pense que le courant se partage entre les deux lampes. Qui a raison ?',
    materiel:'Pile plate fictive de 4,5 V, interrupteur, deux lampes différentes L1 et L2, ampèremètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les mesures, choisis la relation entre l’intensité I dans la branche principale et les intensités I1 et I2 dans les branches des lampes. Justifie avec « car ».',choix:[
      ['somme','I = I1 + I2 : le courant se partage'],['egal1','I = I1 = I2 : la même intensité partout'],['moins','I = I1 − I2'],['double','I1 = I2 = 2 × I']]},
    protocole:['Interrupteur fermé, mesurer l’intensité dans la branche principale, puis dans la branche de L1, puis dans celle de L2.','Calculer I1 + I2 et comparer à I.','Changer un seul élément : dévisser L2 et mesurer de nouveau dans les trois branches.','Écrire une observation après chaque essai.'],
    variable:'La place de l’ampèremètre, puis l’état de la lampe L2',maintenu:'La pile et le montage en dérivation',
    colonnes:['Branche','Interrupteur','Lampe L2','Intensité','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.map(e=>[nomPt(e.pt),e.ferme?'Fermé':'Ouvert',e.l2?'Vissée':'Dévissée',M().mA(e.i),e.observation||'—']),
    resume:e=>nomPt(e.pt)+(e.l2?'':', L2 dévissée')+(e.ferme?'':', circuit ouvert')+' : '+M().mA(e.i),
    confrontation:'1. Additionne les intensités des deux branches dérivées et compare à celle de la branche principale. 2. Que deviennent les trois intensités quand L2 est dévissée ? Compare ensuite à ton hypothèse : qui a raison, Awa ou Kofi ?',
    retroaction:'Cite les trois mesures (I, I1, I2) en mA et écris la relation entre elles.',
    transfert:{q:'Kofi mesure I = 300 mA dans la branche principale et I1 = 180 mA dans la branche de la première lampe. Que vaut I2 ?',rep:'120',options:[['120','120 mA'],['180','180 mA'],['300','300 mA'],['480','480 mA']],expl:'I = I1 + I2, donc I2 = I − I1 = 300 mA − 180 mA = 120 mA.'},
    critere:'Mesurer I, I1 et I2 et conclure que I = I1 + I2.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Relève des mesures sans les comparer.'],['MF','Remarque que les intensités sont différentes sans trouver la relation.'],['MS','Conclut que I = I1 + I2.'],['TBM','Conclut, cite les mesures avec l’unité et explique le cas de la lampe dévissée.']],
    peutConfronter:st=>{const v=val(st).filter(e=>e.ferme);return v.filter(e=>e.l2).map(e=>e.pt).filter((p,i,a)=>a.indexOf(p)===i).length>=3&&v.some(e=>!e.l2);},
    aides:['Mesure dans les trois branches sans rien changer d’autre.','Additionne les deux intensités des branches dérivées : que retrouves-tu ?','Dévisse L2 : quelle branche n’est plus parcourue par un courant ?'],
    synthese:'Dans un circuit avec dérivation, le courant de la branche principale se partage entre les branches dérivées. L’intensité dans la branche principale est égale à la somme des intensités dans les branches dérivées : I = I1 + I2. Si une lampe est dévissée, sa branche n’est plus parcourue par un courant et l’autre lampe continue de briller.',
    prof:{reference:'Interrupteur fermé : I = 250 mA, I1 = 150 mA, I2 = 100 mA. L2 dévissée : I = 150 mA, I1 = 150 mA, I2 = 0 mA. Interrupteur ouvert : 0 mA partout. Kofi a raison.',attendus:['Hypothèse notée avant les mesures.','Trois branches mesurées.','Relation I = I1 + I2 écrite avec les valeurs.'],erreurs:['Croire que l’intensité est la même partout, comme en série.','Additionner sans unité.','Confondre branche principale et branche dérivée.']},
    diagnostic:st=>val(st).some(e=>!e.l2)?['Avec L2 dévissée, la relation I = I1 + I2 est-elle encore vraie ?']:['Dévisse L2 et mesure de nouveau dans les trois branches.']
  };
})();
