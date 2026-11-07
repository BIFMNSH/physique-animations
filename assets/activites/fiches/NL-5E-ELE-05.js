/* NohobaLab · 5e · ELE-05 · Tension électrique : mesurer avec un voltmètre.
   Modèle : pile 4,5 V, L1 (20 Ω) et L2 (40 Ω) en série : U(L1) = 1,5 V, U(L2) = 3 V ; valeurs de simulation. */
(function(){
  'use strict';
  const E=()=>window.NohobaElec5e;
  const V=(U)=>E().fv(U).replace('-','−');
  function manip(panel,X){
    const N=E();
    N.atelier(panel,X,{titre:'Atelier · mesurer une tension avec le voltmètre',idObs:'e-obs',placeholder:'J’observe que la tension…',
      intro:'Le voltmètre se branche en dérivation, aux bornes du dipôle : la fiche V du côté de la borne +, la fiche COM du côté de la borne −. Je choisis le dipôle et la position de l’interrupteur, puis je lis la tension.',
      fiche:()=>window.FICHE_5E_ELE05,
      groupes:[{legende:'Le voltmètre est branché aux bornes de',nom:'e-d',items:N.DIP,def:'G'},{legende:'Interrupteur K',nom:'e-k',items:[['ferme','Fermé'],['ouvert','Ouvert']],def:'ferme'}],
      rendre:v=>{const f=v['e-k']==='ferme',m=N.montageTension(v['e-d'],f);
        return {montage:m.montage,schema:m.schema,lecture:'Tension aux bornes de '+N.nomDip(v['e-d']).replace(/^L/,'l').replace(/^La /,'la ')+' : '+V(m.U),
          essai:{d:v['e-d'],ferme:f,U:m.U}};}});
  }
  window.FICHE_5E_ELE05={
    id:'NL-5E-ELE-05',version:'0.9',modele:'tension-serie-v1',
    titre:'Mesurer une tension avec un voltmètre',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'La tension électrique',
    competenceVisee:'Mesurer une tension avec un voltmètre.',
    objectifsPedagogiques:['Brancher un voltmètre en dérivation aux bornes d’un dipôle','Lire une tension en volts','Comparer les tensions dans un circuit en série'],
    situationEvaluation:'Dans un circuit en série, la tension de la pile est 9 V et celle de la lampe L1 est 3,5 V. Quelle est la tension aux bornes de L2 ? Justifie.',
    objectif:'Mesurer des tensions dans un circuit en série et les comparer.',
    objectifEleve:'Savoir mesurer une tension avec un voltmètre.',
    situation:'Awa a monté un circuit en série avec une pile de 4,5 V, deux lampes L1 et L2 et un interrupteur. Elle se demande quelle tension il y a aux bornes de chaque lampe et comment la mesurer.',
    materiel:'Pile plate fictive de 4,5 V, deux lampes, interrupteur, voltmètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les mesures, choisis le lien entre la tension de la pile et celles des deux lampes. Justifie ton hypothèse avec « car ».',choix:[
      ['somme','La tension de la pile est égale à la somme des tensions des deux lampes'],['egale','Chaque lampe a la même tension que la pile'],['moitie','Chaque lampe a la moitié de la tension de la pile'],['nulle','Aux bornes d’une lampe, la tension est nulle']]},
    protocole:['Brancher le voltmètre aux bornes de la pile, interrupteur fermé, et lire la tension.','Le brancher aux bornes de L1, puis de L2.','Ouvrir l’interrupteur et mesurer aux bornes de K.','Écrire une observation après chaque mesure.'],
    variable:'Le dipôle aux bornes duquel on mesure, puis la position de K',maintenu:'La pile et le circuit en série',
    colonnes:['Dipôle','Interrupteur','Tension','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[E().nomDip(e.d),e.ferme?'Fermé':'Ouvert',V(e.U),e.observation||'—']),
    resume:e=>E().nomDip(e.d).toLowerCase()+', K '+(e.ferme?'fermé':'ouvert')+' : '+V(e.U),
    confrontation:'1. Compare la tension de la pile à celles de L1 et de L2. 2. Fais la somme U(L1) + U(L2) : que remarques-tu ? 3. Que lit-on aux bornes de K quand il est ouvert ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les trois tensions U(G), U(L1) et U(L2) avec leur unité, le volt.',
    transfert:{q:'En série, U(pile) = 9 V et U(L1) = 3,5 V. Que vaut U(L2) ?',rep:'5,5',options:[['12,5','12,5 V'],['5,5','5,5 V'],['3,5','3,5 V'],['9','9 V']],expl:'U(L2) = 9 V − 3,5 V = 5,5 V : la tension de la pile est la somme des tensions des lampes.'},
    critere:'Mesurer U(G), U(L1) et U(L2) et conclure que U(G) = U(L1) + U(L2) en série.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne sait pas où brancher le voltmètre.'],['MF','Lit les tensions sans les comparer.'],['MS','Conclut que la tension de la pile est la somme des tensions des lampes.'],['TBM','Conclut, écrit l’unité et explique la tension aux bornes de K ouvert.']],
    peutConfronter:st=>{const v=E().valides(st);return ['G','L1','L2'].every(d=>v.some(e=>e.d===d&&e.ferme))&&v.some(e=>e.d==='K'&&!e.ferme);},
    aides:['Le voltmètre se branche en dérivation : il ne coupe pas le circuit.','La fiche V va du côté de la borne + de la pile, la fiche COM du côté de la borne −.','As-tu mesuré aux bornes de la pile, de L1, de L2 et de K ouvert ?'],
    synthese:'La tension électrique se note U ; son unité est le volt (V). On la mesure avec un voltmètre branché en dérivation aux bornes du dipôle : la fiche V du côté de la borne + du générateur, la fiche COM du côté de la borne −. En série, la tension aux bornes de la pile est égale à la somme des tensions aux bornes des lampes : U = U1 + U2. Aux bornes d’un interrupteur ouvert, on lit la tension de la pile.',
    prof:{reference:'Pile : 4,5 V. L1 : 1,5 V. L2 : 3 V. K fermé : 0 V ; K ouvert : 4,5 V. U(G) = U(L1) + U(L2).',attendus:['Hypothèse notée avant les mesures.','Quatre mesures : G, L1, L2, K ouvert.','Phrase : U = U1 + U2 en série.'],erreurs:['Brancher le voltmètre en série.','Penser que chaque lampe a la tension de la pile.','Oublier l’unité (V).']},
    diagnostic:st=>E().valides(st).some(e=>e.d==='K'&&!e.ferme)?['Tu as ouvert K : que lit le voltmètre à ses bornes ?']:['Ouvre l’interrupteur et mesure aux bornes de K.']
  };
})();
