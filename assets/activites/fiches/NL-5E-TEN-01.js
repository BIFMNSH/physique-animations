/* NohobaLab · 5e · TEN-01 · Loi des tensions dans un circuit avec dérivation.
   Modèle : générateur idéal de 4,5 V ou 3 V, deux lampes en dérivation : même tension aux bornes de chaque branche ; valeurs de simulation (NohobaIntensite5e.tensionDeriv). */
(function(){
  'use strict';
  const M=()=>window.NohobaIntensite5e,E=()=>window.NohobaElec5e;
  const nomDip=d=>M().DIP.filter(x=>x[0]===d)[0][1];
  function manip(panel,X){
    const m=M();
    E().atelier(panel,X,{titre:'Atelier · la tension aux bornes de chaque branche',idObs:'e-obs',placeholder:'J’observe que la tension aux bornes de…',
      intro:'L1 et L2 sont en dérivation sur le générateur. Le voltmètre se branche en dérivation, aux bornes du dipôle choisi. Je lis la tension.',
      fiche:()=>window.FICHE_5E_TEN01,
      groupes:[{legende:'Le voltmètre est branché aux bornes de',nom:'e-d',items:m.DIP,def:'G'},
        {legende:'Générateur',nom:'e-u',items:[['4.5','Pile de 4,5 V'],['3','Deux piles : 3 V']],def:'4.5'}],
      rendre:v=>{const d=v['e-d'],U=+v['e-u'],u=m.tensionDeriv(d,U);
        return {montage:m.montageTension(d,U),schema:m.schemaTension(d),
          lecture:'Tension aux bornes de '+nomDip(d).replace(/^La /,'la ')+' : '+m.fv(u),essai:{d:d,gen:U,U:u}};}});
  }
  const val=st=>E().valides(st);
  window.FICHE_5E_TEN01={
    id:'NL-5E-TEN-01',version:'0.9',modele:'tension-derivation-v1',
    titre:'En dérivation, la même tension ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'La tension électrique',
    competenceVisee:'Établir que des dipôles branchés en dérivation ont la même tension à leurs bornes.',
    objectifsPedagogiques:['Mesurer la tension aux bornes du générateur et de chaque lampe en dérivation','Comparer les tensions mesurées','Énoncer la loi des tensions dans un circuit avec dérivation'],
    situationEvaluation:'Chez Awa, la télévision et le ventilateur sont branchés en dérivation sur le secteur de 220 V. Quelle est la tension aux bornes du ventilateur ? Justifie.',
    objectif:'Comparer la tension aux bornes du générateur et de deux lampes en dérivation.',
    objectifEleve:'Savoir utiliser la loi des tensions dans un circuit avec dérivation.',
    situation:'Kofi branche deux lampes différentes en dérivation sur la même pile. Il pense que la tension de la pile se partage entre les deux lampes, comme dans un circuit en série. Awa pense que chaque lampe reçoit toute la tension. Qui a raison ?',
    materiel:'Générateur fictif (pile plate de 4,5 V ou deux piles, 3 V), deux lampes différentes L1 et L2, voltmètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les mesures, choisis ce que vaut la tension aux bornes de chaque lampe en dérivation. Justifie avec « car ».',choix:[
      ['meme','La même tension que celle du générateur'],['moitie','La moitié de la tension du générateur'],['partage','Des tensions différentes dont la somme vaut celle du générateur'],['nulle','Une tension nulle']]},
    protocole:['Avec la pile de 4,5 V, mesurer la tension aux bornes de la pile, puis de L1, puis de L2.','Comparer les trois valeurs.','Changer un seul élément : prendre le générateur de 3 V et mesurer de nouveau.','Écrire une observation après chaque essai.'],
    variable:'Le dipôle mesuré, puis le générateur',maintenu:'Les deux lampes et le montage en dérivation',
    colonnes:['Générateur','Voltmètre aux bornes de','Tension','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[M().fv(e.gen),nomDip(e.d),M().fv(e.U),e.observation||'—']),
    resume:e=>'Générateur '+M().fv(e.gen)+', '+nomDip(e.d).toLowerCase()+' : '+M().fv(e.U),
    confrontation:'1. Compare les tensions aux bornes de la pile, de L1 et de L2. 2. Que se passe-t-il avec le générateur de 3 V ? Compare ensuite à ton hypothèse : qui a raison, Awa ou Kofi ?',
    retroaction:'Cite les trois tensions mesurées avec leur unité pour un même générateur.',
    transfert:{q:'La télévision et le ventilateur d’Awa sont branchés en dérivation sur le secteur de 220 V. Quelle est la tension aux bornes du ventilateur ?',rep:'220',options:[['0','0 V'],['110','110 V'],['220','220 V'],['440','440 V']],expl:'Des appareils branchés en dérivation ont la même tension à leurs bornes : 220 V pour chacun. C’est pourquoi les appareils de la maison sont branchés en dérivation.'},
    critere:'Mesurer les trois tensions et conclure qu’elles sont égales dans un montage en dérivation.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Relève des tensions sans les comparer.'],['MF','Remarque des valeurs égales sans généraliser.'],['MS','Conclut que la tension est la même aux bornes des dipôles en dérivation.'],['TBM','Conclut, cite les mesures avec l’unité et vérifie avec un second générateur.']],
    peutConfronter:st=>{const v=val(st);return M().GENS.some(g=>v.filter(e=>e.gen===g).map(e=>e.d).filter((d,i,a)=>a.indexOf(d)===i).length>=3)&&v.map(e=>e.gen).filter((g,i,a)=>a.indexOf(g)===i).length>=2;},
    aides:['Le voltmètre se branche en dérivation : borne V du côté de la borne +, borne COM du côté de la borne −.','Mesure aux bornes de la pile, de L1 et de L2 sans changer de générateur.','Change de générateur : les trois tensions restent-elles égales entre elles ?'],
    synthese:'Dans un circuit avec dérivation, la tension est la même aux bornes de dipôles branchés en dérivation : U = U1 = U2. Chaque lampe reçoit la tension du générateur. À la maison, les appareils sont branchés en dérivation : chacun reçoit la tension du secteur, 220 V.',
    prof:{reference:'Pile de 4,5 V : 4,5 V aux bornes de la pile, de L1 et de L2. Générateur de 3 V : 3 V partout. Awa a raison : en dérivation, la tension ne se partage pas.',attendus:['Hypothèse notée avant les mesures.','Trois dipôles mesurés avec le même générateur.','Phrase : U = U1 = U2 en dérivation.'],erreurs:['Appliquer la loi du circuit en série (U = U1 + U2).','Confondre tension et intensité.','Oublier l’unité (V).']},
    diagnostic:st=>val(st).map(e=>e.gen).filter((g,i,a)=>a.indexOf(g)===i).length>=2?['Avec les deux générateurs, que remarques-tu sur les trois tensions ?']:['Change de générateur et mesure de nouveau aux bornes de la pile, de L1 et de L2.']
  };
})();
