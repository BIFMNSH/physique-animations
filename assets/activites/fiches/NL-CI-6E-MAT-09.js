/* NohobaLab · 6e Côte d'Ivoire · MAT-09 · Définir la pression d'un gaz.
   Décision du 25 octobre 2026 : pression qualitative, sans unité (ni pascal ni bar), sans loi ni formule. Jauge « faible / moyenne / forte ». */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  function manip(panel,X){
    M().bloc(panel,X,{n:9,titre:'Atelier · je comprime l’air et je sens la poussée',
      intro:'Seringue bouchée. Je choisis le volume d’air enfermé et j’observe la poussée du gaz sur les parois (flèches rouges) et la jauge qualitative. Aucune valeur n’est mesurée.',
      controles:[{cle:'v',legende:'Le volume d’air enfermé',items:M().VOLUMES}],
      saisie:'J’observe que, quand le volume diminue, la poussée…',legendeTable:'Mes essais : volume et poussée du gaz.',F:()=>window.FICHE_CI_MAT09,
      render:v=>{const r=M().pression(v.v),sc=M().scene.pression({vol:v.v});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{vol:v.v,jauge:r.jauge,niveau:r.niveau}};}});
  }
  const lv=k=>(M().VOLUMES.filter(x=>x[0]===k)[0]||['',k])[1];
  window.FICHE_CI_MAT09={
    id:'NL-CI-6E-MAT-09',version:'0.9',modele:'pression-qualitative-v1',
    titre:'Définir la pression d’un gaz',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Relier la pression d’un gaz aux poussées qu’il exerce sur les parois.',
    objectifsPedagogiques:['Dire qu’un gaz enfermé pousse sur les parois du récipient','Dire que la poussée augmente quand on comprime','Définir la pression comme la poussée du gaz sur les parois'],
    situationEvaluation:'Awa gonfle un pneu avec une pompe : plus elle pompe, plus c’est dur. Explique ce qui se passe dans le pneu avec le mot « pression ».',
    objectif:'Définir la pression d’un gaz.',objectifEleve:'Savoir expliquer ce qu’est la pression d’un gaz.',
    situation:'Quand Kofi bouche la seringue et enfonce le piston, il faut pousser de plus en plus fort. Pourquoi ? Il compare trois volumes d’air enfermé.',
    materiel:'Simulation : seringue bouchée, jauge qualitative (faible, moyenne, forte).',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand le volume d’air enfermé diminue. Justifie ton hypothèse.',choix:[['plus','Il faut pousser plus fort : la poussée du gaz augmente'],['moins','Il faut pousser moins fort'],['pareil','Il faut pousser pareil'],['aucune','L’air ne pousse pas du tout']]},
    protocole:['Choisir un grand volume d’air, observer la poussée.','Réduire le volume, observer.','Réduire encore, observer.','Noter la jauge à chaque fois.'],
    variable:'Le volume d’air enfermé',maintenu:'La seringue bouchée',
    colonnes:['Volume d’air','Poussée du gaz (jauge)','Mon observation'],lignesVides:3,
    lignes:st=>st.essais.map(e=>[lv(e.vol),e.jauge,e.observation||'—']),
    resume:e=>lv(e.vol).toLowerCase()+' : poussée '+e.jauge,
    confrontation:'1. Que devient la poussée quand le volume diminue ? 2. Où le gaz pousse-t-il ? 3. Comment définir la pression ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux essais de volumes différents avec la poussée observée.',
    transfert:{q:'Quand on comprime un gaz enfermé, la poussée sur les parois augmente. Vrai ?',rep:'oui',expl:'Oui : plus le volume est petit, plus la poussée du gaz sur les parois est forte. C’est la pression, ici décrite sans valeur ni unité.'},
    critere:'Définir la pression comme la poussée d’un gaz sur les parois, avec deux essais.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit la seringue sans parler de poussée.'],['MF','Dit qu’il faut pousser plus fort sans parler du gaz.'],['MS','Définit la pression comme la poussée sur les parois.'],['TBM','Définit et applique au pneu ou au ballon.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'vol')>=3;},
    aides:['Compare le nombre de flèches rouges.','Les flèches montrent où le gaz pousse.','La pression est la poussée du gaz sur les parois.'],
    synthese:'Un gaz enfermé pousse sur les parois du récipient. Quand on diminue son volume, cette poussée augmente. La pression d’un gaz est cette poussée sur les parois (en 6e, sans valeur ni unité).',
    prof:{reference:'Pression = poussée du gaz sur les parois ; elle augmente quand le volume diminue. Qualitatif seulement.',attendus:['Observer l’augmentation de la poussée quand le volume diminue.','Définir la pression.','Ne citer ni unité ni formule.'],erreurs:['Parler de pascal ou de bar.','Confondre pression et force sur le piston seulement.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste les trois volumes.']:['Fais un premier essai.']
  };
})();
