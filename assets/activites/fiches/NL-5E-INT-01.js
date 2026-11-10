/* NohobaLab · 5e · INT-01 · Notion d'intensité : comparer des courants grâce à leurs effets.
   Modèle : piles idéales de 1,5 V en série, lampe 30 Ω, moteur 25 Ω : valeurs de simulation (NohobaIntensite5e.notion). */
(function(){
  'use strict';
  const M=()=>window.NohobaIntensite5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const m=M();
    E().atelier(panel,X,{titre:'Atelier · plus de piles, plus de courant ?',idObs:'e-obs',placeholder:'J’observe que la lampe (ou le moteur)…',
      intro:'Les piles sont en série, dans le même sens. Je change le nombre de piles, j’observe la lampe ou le moteur, puis je branche l’ampèremètre pour lire l’intensité.',
      fiche:()=>window.FICHE_5E_INT01,
      groupes:[{legende:'Nombre de piles de 1,5 V',nom:'e-n',items:[['1','Une pile'],['2','Deux piles'],['3','Trois piles']],def:'1'},
        {legende:'Récepteur',nom:'e-r',items:[['lampe','Lampe'],['moteur','Moteur']],def:'lampe'},
        {legende:'Ampèremètre',nom:'e-a',items:[['non','Non branché'],['oui','Branché en série']],def:'non'}],
      rendre:v=>{const n=+v['e-n'],rec=v['e-r'],amp=v['e-a']==='oui',r=m.notion(n,rec);
        return {montage:m.montageNotion(n,rec,amp),schema:m.schemaNotion(n,rec,amp),
          lecture:r.effet+'.'+(amp?' L’ampèremètre indique '+m.mA(r.i)+'.':' Ampèremètre non branché.'),
          essai:{n:n,rec:rec,amp:amp,i:amp?r.i:null,effet:r.effet}};}});
  }
  const val=st=>E().valides(st);
  window.FICHE_5E_INT01={
    id:'NL-5E-INT-01',version:'0.9',modele:'intensite-notion-v1',
    titre:'Plus de piles : plus de courant ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'L’intensité du courant électrique',
    competenceVisee:'Comparer des courants d’intensités différentes grâce à leurs effets.',
    objectifsPedagogiques:['Relier l’éclat d’une lampe ou la vitesse d’un moteur à l’intensité du courant','Nommer la grandeur intensité et son unité, l’ampère','Vérifier une comparaison avec un ampèremètre'],
    situationEvaluation:'Dans deux circuits, la même lampe brille fort dans le premier et faiblement dans le second. Dans quel circuit l’intensité du courant est-elle la plus grande ? Justifie.',
    objectif:'Comparer l’intensité du courant dans un circuit quand on change le nombre de piles.',
    objectifEleve:'Savoir comparer deux courants grâce à leurs effets.',
    situation:'Kofi fabrique une lampe de poche pour sa petite sœur, à Abidjan. Avec une pile, la lampe brille à peine. Avec trois piles, elle brille bien. Awa lui demande : « Qu’est-ce qui a changé dans le circuit ? »',
    materiel:'Une à trois piles fictives de 1,5 V, une lampe, un moteur, un ampèremètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand Kofi ajoute des piles en série. Justifie ton hypothèse avec « car ».',choix:[
      ['plus','Le courant est plus intense : la lampe brille plus'],['meme','Le courant reste le même : seule la lampe change'],['moins','Le courant est moins intense'],['aucun','Il n’y a plus de courant']]},
    protocole:['Avec la lampe, essayer une pile, puis deux, puis trois. Observer l’éclat.','Brancher l’ampèremètre en série et lire l’intensité pour chaque nombre de piles.','Changer un seul élément : remplacer la lampe par le moteur et recommencer.','Écrire une observation après chaque essai.'],
    variable:'Le nombre de piles',maintenu:'Le récepteur (la lampe, puis le moteur)',
    colonnes:['Piles','Récepteur','Effet observé','Intensité','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[String(e.n),e.rec==='lampe'?'Lampe':'Moteur',e.effet,e.i==null?'non mesurée':M().mA(e.i),e.observation||'—']),
    resume:e=>e.n+(e.n===1?' pile':' piles')+', '+e.rec+' : '+e.effet.toLowerCase()+(e.i==null?'':', '+M().mA(e.i)),
    confrontation:'1. Comment change l’éclat de la lampe quand tu ajoutes des piles ? 2. Comment change la valeur lue sur l’ampèremètre ? 3. Le moteur confirme-t-il ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux essais avec le nombre de piles, l’effet observé et l’intensité en mA.',
    transfert:{q:'La même lampe brille fort dans le circuit 1 et faiblement dans le circuit 2. Où l’intensité est-elle la plus grande ?',rep:'c1',options:[['c1','Dans le circuit 1'],['c2','Dans le circuit 2'],['egal','Elle est la même dans les deux'],['sait','On ne peut pas comparer']],expl:'Pour une même lampe, plus l’éclat est fort, plus l’intensité du courant est grande : c’est le circuit 1.'},
    critere:'Relier un effet plus marqué (éclat, vitesse) à une intensité plus grande, et le vérifier avec l’ampèremètre.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un essai sans comparer.'],['MF','Compare les éclats sans parler d’intensité.'],['MS','Relie l’éclat ou la vitesse à l’intensité du courant.'],['TBM','Relie l’effet à l’intensité, cite les mesures en mA et l’unité.']],
    peutConfronter:st=>{const v=val(st);return ['lampe','moteur'].some(r=>v.filter(e=>e.rec===r).map(e=>e.n).filter((n,i,a)=>a.indexOf(n)===i).length>=3)&&v.some(e=>e.amp);},
    aides:['Garde le même récepteur et change seulement le nombre de piles.','Regarde l’éclat de la lampe : il renseigne sur le courant qui la traverse.','Branche l’ampèremètre : la valeur lue augmente-t-elle avec le nombre de piles ?'],
    synthese:'Le courant électrique peut être plus ou moins intense. Plus l’intensité du courant est grande, plus la lampe brille et plus le moteur tourne vite. L’intensité se note I. Elle se mesure avec un ampèremètre et s’exprime en ampères (A) ou en milliampères (mA).',
    prof:{reference:'Lampe : 50 mA, 100 mA et 150 mA pour une, deux et trois piles. Moteur : 60 mA, 120 mA et 180 mA. L’éclat et la vitesse augmentent avec l’intensité.',attendus:['Hypothèse notée avant les essais.','Trois essais avec le même récepteur.','Phrase reliant l’effet observé à l’intensité, avec l’unité.'],erreurs:['Confondre intensité et tension.','Changer deux éléments à la fois.','Oublier l’unité (A ou mA).']},
    diagnostic:st=>val(st).some(e=>e.amp)?['Tu as mesuré : que devient la valeur quand tu ajoutes une pile ?']:['Branche l’ampèremètre en série et lis l’intensité.']
  };
})();
