/* NohobaLab · 5e · INT-02 · Mesurer une intensité avec un ampèremètre monté en série.
   Modèle : pile idéale 4,5 V, L1 30 Ω et L2 45 Ω en série : 60 mA ; valeurs de simulation (NohobaIntensite5e.mesure).
   Le mauvais branchement (en dérivation sur la pile) est signalé comme un court-circuit, sans dégât dans la simulation. */
(function(){
  'use strict';
  const M=()=>window.NohobaIntensite5e,E=()=>window.NohobaElec5e;
  const nomPos=p=>M().POS.filter(x=>x[0]===p)[0][1];
  function manip(panel,X){
    const m=M();
    E().atelier(panel,X,{titre:'Atelier · brancher l’ampèremètre',idObs:'e-obs',placeholder:'J’observe que l’ampèremètre…',
      intro:'Pour mesurer l’intensité, le courant doit traverser l’ampèremètre : il entre par la borne mA et ressort par la borne COM. Je choisis un branchement et un calibre, puis je lis l’écran.',
      fiche:()=>window.FICHE_5E_INT02,
      groupes:[{legende:'Branchement de l’ampèremètre',nom:'e-b',items:m.POS,def:'avantL1'},
        {legende:'Interrupteur K',nom:'e-k',items:[['ferme','Fermé'],['ouvert','Ouvert']],def:'ferme'},
        {legende:'Calibre',nom:'e-c',items:m.CAL,def:'200mA'}],
      rendre:v=>{const pos=v['e-b'],f=v['e-k']==='ferme',cal=v['e-c'],r=m.mesure(pos,f,cal);
        return {montage:m.montageMesure(pos,f,cal),schema:m.schemaMesure(pos,f),
          lecture:r.erreur?'Mauvais branchement : l’ampèremètre est en dérivation aux bornes de la pile. C’est un court-circuit : aucune mesure, il faut débrancher tout de suite.':'L’ampèremètre indique '+r.txt+(f?'.':' (circuit ouvert).'),
          essai:{pos:pos,ferme:f,cal:cal,erreur:r.erreur,i:r.i,txt:r.txt}};}});
  }
  const val=st=>E().valides(st);
  window.FICHE_5E_INT02={
    id:'NL-5E-INT-02',version:'0.9',modele:'intensite-mesure-v1',
    titre:'Où brancher l’ampèremètre ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'L’intensité du courant électrique',
    competenceVisee:'Mesurer une intensité avec un ampèremètre monté en série.',
    objectifsPedagogiques:['Brancher un ampèremètre en série dans un circuit','Repérer les bornes mA et COM','Lire une intensité avec son unité'],
    situationEvaluation:'Awa veut mesurer l’intensité du courant dans le moteur de son ventilateur de bureau. Explique où et comment elle doit brancher l’ampèremètre.',
    objectif:'Trouver le branchement qui permet de mesurer l’intensité du courant dans un circuit.',
    objectifEleve:'Savoir brancher un ampèremètre et lire une intensité.',
    situation:'Awa veut connaître l’intensité du courant qui traverse les lampes de son montage. Kofi propose de poser les deux fils de l’ampèremètre sur les bornes de la pile, « comme pour un voltmètre ». Awa hésite. Comment faut-il brancher l’ampèremètre ?',
    materiel:'Pile plate fictive de 4,5 V, deux lampes, un interrupteur, un ampèremètre (bornes mA et COM, calibres 200 mA et 2 A), fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis comment brancher l’ampèremètre pour mesurer l’intensité. Justifie ton hypothèse avec « car ».',choix:[
      ['serie','En série : on ouvre le circuit et on y insère l’ampèremètre'],['derivation','En dérivation, aux bornes d’une lampe'],['pile','Directement aux bornes de la pile'],['partout','N’importe comment : il mesure toujours']]},
    protocole:['Brancher l’ampèremètre en série entre la pile et L1, interrupteur fermé, et lire l’écran.','Changer un seul élément : déplacer l’ampèremètre entre L1 et L2, puis après L2.','Essayer le branchement en dérivation aux bornes de la pile : que signale l’appareil ?','Ouvrir l’interrupteur, puis changer de calibre : que lit-on ?','Écrire une observation après chaque essai.'],
    variable:'Le branchement de l’ampèremètre',maintenu:'La pile, les deux lampes et le circuit en série',
    colonnes:['Branchement','Interrupteur','Calibre','Lecture','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[nomPos(e.pos),e.ferme?'Fermé':'Ouvert',e.cal==='2A'?'2 A':'200 mA',e.erreur?'Court-circuit':e.txt,e.observation||'—']),
    resume:e=>nomPos(e.pos)+', interrupteur '+(e.ferme?'fermé':'ouvert')+' : '+(e.erreur?'court-circuit signalé':e.txt),
    confrontation:'1. Quels branchements donnent une mesure ? 2. Que se passe-t-il quand l’ampèremètre est en dérivation aux bornes de la pile ? 3. Que lit-on, circuit ouvert ? Compare ensuite à ton hypothèse : Kofi avait-il raison ?',
    retroaction:'Cite un branchement correct avec la valeur lue et son unité, puis le branchement à ne jamais faire.',
    transfert:{q:'Awa veut mesurer l’intensité du courant dans un moteur. Comment branche-t-elle l’ampèremètre ?',rep:'serie',options:[['serie','En série avec le moteur, borne COM du côté de la borne − de la pile'],['bornes','En dérivation aux bornes du moteur'],['pile','Aux bornes de la pile'],['sans','Sans ouvrir le circuit, posé sur un fil']],expl:'Un ampèremètre se branche toujours en série : le courant du moteur doit le traverser, en entrant par la borne mA (ou A) et en sortant par COM.'},
    critere:'Insérer l’ampèremètre en série, lire la valeur avec son unité et reconnaître le mauvais branchement.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Branche l’ampèremètre sans distinguer série et dérivation.'],['MF','Obtient une mesure sans expliquer le branchement.'],['MS','Branche en série et lit l’intensité avec son unité.'],['TBM','Branche en série, lit sur les deux calibres et explique pourquoi la dérivation sur la pile est interdite.']],
    peutConfronter:st=>{const v=val(st);return v.filter(e=>!e.erreur&&e.ferme).map(e=>e.pos).filter((p,i,a)=>a.indexOf(p)===i).length>=2&&v.some(e=>e.erreur)&&v.some(e=>!e.erreur&&!e.ferme);},
    aides:['Pour être traversé par le courant, l’ampèremètre doit faire partie de la boucle.','Essaie deux places différentes dans la boucle : la valeur change-t-elle ?','As-tu essayé le branchement en dérivation sur la pile, puis l’interrupteur ouvert ?'],
    synthese:'L’intensité du courant se mesure avec un ampèremètre. Il se branche en série : on ouvre le circuit et on l’insère dans la boucle. Le courant entre par la borne mA (ou A) et ressort par la borne COM. On ne branche jamais un ampèremètre directement aux bornes d’une pile : c’est un court-circuit. On commence par le plus grand calibre. 1 A = 1 000 mA.',
    prof:{reference:'En série, aux trois places : 60 mA (0,06 A sur le calibre 2 A). Interrupteur ouvert : 0 mA. En dérivation aux bornes de la pile : court-circuit signalé, aucune mesure.',attendus:['Hypothèse notée avant les essais.','Deux places en série essayées.','Phrase : l’ampèremètre se branche en série.'],erreurs:['Brancher l’ampèremètre comme un voltmètre.','Inverser les bornes mA et COM.','Oublier l’unité ou confondre A et mA.']},
    diagnostic:st=>val(st).some(e=>e.erreur)?['Tu as vu le mauvais branchement : pourquoi est-il dangereux pour l’appareil et la pile ?']:['Essaie le branchement en dérivation aux bornes de la pile : que signale l’ampèremètre ?']
  };
})();
