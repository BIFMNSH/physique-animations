/* NohobaLab · 5e · ELE-02 · Adaptation d'un générateur à un récepteur.
   Modèle qualitatif : état du récepteur selon le rapport entre la tension du générateur et la tension nominale (voir NohobaElec5e.etat). */
(function(){
  'use strict';
  const E=()=>window.NohobaElec5e;
  const GEN=E=>E.GENS.map(u=>[String(u),E.fv(u)]);
  function manip(panel,X){
    const N=E();
    N.atelier(panel,X,{titre:'Atelier · choisir un générateur pour un récepteur',idObs:'e-obs',placeholder:'J’observe que le récepteur…',
      intro:'Je lis l’indication sur le récepteur (sa tension nominale), puis je branche un générateur et j’observe ce qui se passe.',
      fiche:()=>window.FICHE_5E_ELE02,
      groupes:[{legende:'Récepteur',nom:'e-r',items:N.RECS.map(r=>[r[0],r[1]]),def:'L6'},{legende:'Tension du générateur',nom:'e-g',items:GEN(N),def:'4.5'}],
      rendre:v=>{const U=+v['e-g'],m=N.montageGR(U,v['e-r']);
        return {montage:m.montage,schema:m.schema,lecture:m.rec.nom+' sous '+N.fv(U)+' : '+m.etat.txt+'.',
          essai:{r:v['e-r'],g:U,etat:m.etat.k,txt:m.etat.txt}};}});
  }
  window.FICHE_5E_ELE02={
    id:'NL-5E-ELE-02',version:'0.9',modele:'tension-nominale-v1',
    titre:'Adapter un générateur à un récepteur',niveau:'5e',
    theme:'Électricité',chapitre:'Générateur et récepteur',
    competenceVisee:'Choisir un générateur dont la tension convient à un récepteur.',
    objectifsPedagogiques:['Lire la tension nominale inscrite sur un récepteur','Comparer la tension d’un générateur à la tension nominale du récepteur','Choisir un générateur adapté'],
    situationEvaluation:'Kofi veut faire tourner un petit moteur de 6 V avec une pile de 4,5 V. Que va-t-il observer ? Justifie avec tes essais.',
    objectif:'Choisir le générateur adapté à un récepteur.',
    objectifEleve:'Savoir choisir un générateur adapté à un récepteur.',
    situation:'Kofi a une lampe marquée « 6 V » et plusieurs piles. Il se demande laquelle choisir pour que la lampe brille normalement sans être abîmée.',
    materiel:'Générateurs de 1,5 V à 12 V, lampes de 1,5 V, 4,5 V, 6 V et 12 V, moteur de 6 V, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis la règle qui permet de bien alimenter un récepteur. Justifie ton hypothèse avec « car ».',choix:[
      ['egale','Le récepteur fonctionne normalement quand la tension du générateur est égale à sa tension nominale'],
      ['grande','Plus la tension du générateur est grande, mieux le récepteur fonctionne'],
      ['peuimporte','N’importe quel générateur convient à n’importe quel récepteur'],
      ['petite','Une tension plus petite que la tension nominale abîme le récepteur']]},
    protocole:['Choisir un récepteur et lire sa tension nominale.','Le brancher à un générateur de même tension, puis à un générateur de tension plus faible, puis plus forte.','Changer un seul élément à la fois.','Noter ce que fait le récepteur à chaque essai.'],
    variable:'La tension du générateur (puis le récepteur)',maintenu:'Le montage : un générateur, un récepteur, deux fils',
    colonnes:['Récepteur','Générateur','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[E().rec(e.r).nom,E().fv(e.g),e.txt,e.observation||'—']),
    resume:e=>E().bas(E().rec(e.r).nom)+' sur '+E().fv(e.g)+' : '+e.txt,
    confrontation:'1. Dans quels essais le récepteur fonctionne-t-il normalement ? Compare avec sa tension nominale. 2. Que se passe-t-il avec une tension plus faible ? plus forte ? 3. Que se passe-t-il avec une tension beaucoup trop forte ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai « normal », un essai « sous-tension » et un essai « surtension » avec les tensions utilisées.',
    transfert:{q:'Kofi branche son moteur de 6 V sur une pile de 4,5 V. Que se passe-t-il ?',rep:'lent',options:[['normal','Il tourne normalement'],['lent','Il tourne lentement : il est en sous-tension'],['vite','Il tourne trop vite'],['grille','Il est détérioré']],expl:'4,5 V est plus petit que 6 V : le moteur est en sous-tension, il tourne lentement, sans être abîmé.'},
    critere:'Choisir un générateur dont la tension est égale à la tension nominale du récepteur et expliquer sous-tension et surtension.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas l’état du récepteur à la tension du générateur.'],['MF','Décrit les essais sans parler de la tension nominale.'],['MS','Conclut qu’un générateur est adapté si sa tension est égale à la tension nominale.'],['TBM','Conclut, distingue sous-tension et surtension et cite des essais précis.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&v.some(e=>e.etat==='ok')&&v.some(e=>e.etat==='low')&&v.some(e=>e.etat==='high'||e.etat==='burn')&&new Set(v.map(e=>e.r)).size>=2;},
    aides:['Lis la tension nominale sur le récepteur avant de choisir le générateur.','Compare la tension du générateur à la tension nominale : plus petite, égale ou plus grande ?','As-tu essayé une tension plus faible et une tension plus forte ?'],
    synthese:'Un récepteur porte l’indication de sa tension nominale, en volts. Il fonctionne normalement quand la tension du générateur est égale (ou très proche) de cette tension nominale : le générateur est adapté. Avec une tension plus faible, le récepteur est en sous-tension (lampe peu brillante, moteur lent). Avec une tension plus forte, il est en surtension ; une forte surtension le détériore, la lampe grille.',
    prof:{reference:'Lampe 6 V : 1,5 V ne la fait pas briller, 4,5 V la fait briller faiblement (sous-tension), 6 V normalement, 9 V trop fort (surtension), 12 V la fait griller.',attendus:['Hypothèse notée avant les essais.','Au moins un essai normal, un en sous-tension, un en surtension.','Phrase : le générateur est adapté si sa tension est égale à la tension nominale.'],erreurs:['Croire que plus la tension est grande, mieux le récepteur fonctionne.','Confondre tension nominale et tension du générateur.','Penser que la sous-tension abîme le récepteur.']},
    diagnostic:st=>E().valides(st).some(e=>e.etat==='high'||e.etat==='burn')?['Tu as testé une surtension : que devient le récepteur ?']:['Essaie un générateur de tension plus forte que la tension nominale.']
  };
})();
