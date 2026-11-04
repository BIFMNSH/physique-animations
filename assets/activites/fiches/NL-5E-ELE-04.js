/* NohobaLab · 5e · ELE-04 · Association de piles en série.
   Modèle : piles de 1,5 V ; la tension de l'association est la somme algébrique (une pile retournée se retranche). */
(function(){
  'use strict';
  const E=()=>window.NohobaElec5e;
  const PRE={'1':[0],'2c':[0,0],'3c':[0,0,0],'2o':[0,1],'3o':[0,0,1]};
  const NOM={'1':'Une pile','2c':'Deux piles, même sens','3c':'Trois piles, même sens','2o':'Deux piles, une retournée','3o':'Trois piles, une retournée'};
  const piles=k=>PRE[k].map(f=>({f:!!f}));
  function manip(panel,X){
    const N=E();
    N.atelier(panel,X,{titre:'Atelier · associer des piles en série',idObs:'e-obs',placeholder:'J’observe que la tension…',
      intro:'Je choisis l’association de piles de 1,5 V, puis je lis la tension indiquée par le voltmètre, branché entre les deux extrémités.',
      fiche:()=>window.FICHE_5E_ELE04,
      groupes:[{legende:'Association de piles',nom:'e-a',items:Object.keys(NOM).map(k=>[k,NOM[k]]),def:'1'}],
      rendre:v=>{const m=N.montage4(piles(v['e-a']));
        return {montage:m.montage,schema:m.schema,lecture:NOM[v['e-a']]+' : '+N.fv(m.U),essai:{a:v['e-a'],n:PRE[v['e-a']].length,U:m.U}};}});
  }
  window.FICHE_5E_ELE04={
    id:'NL-5E-ELE-04',version:'0.9',modele:'piles-serie-v1',
    titre:'Associer des piles en série',niveau:'5e',
    theme:'Électricité',chapitre:'Association de piles en série',
    competenceVisee:'Prévoir la tension d’une association de piles en série selon le sens de chaque pile.',
    objectifsPedagogiques:['Associer des piles en série dans le même sens','Mesurer la tension d’une association de piles','Prévoir l’effet d’une pile retournée'],
    situationEvaluation:'Une pile plate de 4,5 V est faite de trois éléments de 1,5 V. Kofi en retourne un par erreur. Quelle tension le voltmètre indique-t-il ? Justifie avec tes essais.',
    objectif:'Prévoir la tension d’une association de piles en série.',
    objectifEleve:'Savoir prévoir la tension de plusieurs piles en série.',
    situation:'Une seule pile de 1,5 V ne suffit pas pour la lampe de Kofi. Il associe plusieurs piles. Que devient la tension, et que se passe-t-il si une pile est mise à l’envers ?',
    materiel:'Piles de 1,5 V, porte-piles, voltmètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis la tension de trois piles de 1,5 V placées dans le même sens. Justifie ton hypothèse avec « car ».',choix:[
      ['somme','Les tensions s’additionnent : 4,5 V, et une pile retournée se retranche'],['meme','La tension reste 1,5 V, quel que soit le nombre de piles'],['moy','La tension est la moyenne des tensions des piles'],['retourne','Retourner une pile ne change rien à la tension totale']]},
    protocole:['Lire la tension d’une seule pile.','Ajouter une, puis deux piles dans le même sens, et lire la tension.','Retourner une pile et lire de nouveau.','Noter chaque observation.'],
    variable:'Le nombre de piles et leur sens',maintenu:'Des piles identiques de 1,5 V et le voltmètre',
    colonnes:['Association','Piles','Tension','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[NOM[e.a],String(e.n),E().fv(e.U),e.observation||'—']),
    resume:e=>NOM[e.a].toLowerCase()+' : '+E().fv(e.U),
    confrontation:'1. Que devient la tension quand on ajoute des piles dans le même sens ? 2. Que devient-elle quand une pile est retournée ? 3. Écris le calcul qui relie la tension totale aux tensions des piles. Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux associations et la tension lue pour chacune.',
    transfert:{q:'Une pile plate de 4,5 V est constituée de combien d’éléments de 1,5 V en série ?',rep:'3',options:[['1','1'],['2','2'],['3','3'],['4','4']],expl:'1,5 V + 1,5 V + 1,5 V = 4,5 V : trois éléments en série.'},
    critere:'Prévoir la tension d’une association de piles en série, avec une pile retournée.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas la tension au nombre de piles.'],['MF','Lit les tensions sans écrire de relation.'],['MS','Conclut : U = U1 + U2 + U3 pour des piles dans le même sens.'],['TBM','Conclut, traite la pile retournée et justifie la pile plate de 4,5 V.']],
    peutConfronter:st=>{const v=E().valides(st);return ['1','2c','3c'].every(k=>v.some(e=>e.a===k))&&v.some(e=>e.a==='2o'||e.a==='3o');},
    aides:['Lis la tension d’une pile seule, puis ajoutes-en une.','Compare la tension totale à la somme des tensions des piles.','Qu’arrive-t-il à la tension quand une pile est retournée ?'],
    synthese:'Des piles sont associées en série quand la borne + de l’une est reliée à la borne − de la suivante. La tension de l’association est égale à la somme des tensions des piles : U = U1 + U2 + U3. Si une pile est retournée, sa tension se retranche et la tension totale diminue. Une pile plate de 4,5 V est faite de trois éléments de 1,5 V en série.',
    prof:{reference:'Une pile : 1,5 V. Deux piles : 3 V. Trois piles : 4,5 V. Deux piles dont une retournée : 0 V. Trois piles dont une retournée : 1,5 V.',attendus:['Hypothèse notée avant les essais.','Association à une, deux, trois piles puis un essai avec une pile retournée.','Calcul écrit : U = U1 + U2 + U3.'],erreurs:['Croire que la tension reste celle d’une pile.','Faire la moyenne des tensions.','Ignorer le sens des piles.']},
    diagnostic:st=>E().valides(st).some(e=>e.a==='2o'||e.a==='3o')?['Tu as retourné une pile : comment la tension a-t-elle changé ?']:['Retourne une pile et regarde la tension.']
  };
})();
