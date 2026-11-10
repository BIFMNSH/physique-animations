/* NohobaLab · 6e Côte d'Ivoire · CHI-04 · Réaliser la combustion du charbon de bois.
   Modèle qualitatif : charbon porté à incandescence par le professeur ; bocal fermé (s'éteint), air libre (rougeoie), air soufflé (vif). Pas de flamme. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const BR={eteinte:'S’éteint',rouge:'Rougeoie',vive:'Incandescence vive'};
  function manip(panel,X){
    M().bloc(panel,X,{n:4,titre:'Atelier · le charbon de bois qui brûle',
      intro:'Le professeur a porté le morceau de charbon à incandescence au brûleur et l’a posé sur la soucoupe. Je choisis la condition, je regarde la braise, puis j’écris ce que je vois. Simulation : aucune flamme réelle.',
      controles:[{cle:'c',legende:'La condition',items:C().CONDITIONS}],
      saisie:'J’observe que la braise… qu’il n’y a… que le charbon…',legendeTable:'Mes essais : condition, braise, charbon.',F:()=>window.FICHE_CI_CHI04,
      render:v=>{const r=C().charbon(v.c),sc=C().sceneCharbon(v.c);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{c:v.c,braise:r.braise,diminue:r.diminue}};}});
  }
  window.FICHE_CI_CHI04={
    id:'NL-CI-6E-CHI-04',version:'0.9',modele:'combustion-charbon-qualitatif-v1',
    titre:'Le charbon de bois qui rougit',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Réaliser la combustion du charbon de bois et dire ce dont elle a besoin.',
    objectifsPedagogiques:['Décrire la combustion du charbon de bois : incandescence sans flamme, chaleur, charbon qui diminue','Montrer que la combustion s’arrête quand l’air manque','Dire que le gaz oxygène de l’air est consommé'],
    situationEvaluation:'Pour éteindre le fourneau après la cuisine, la grand-mère d’Awa pose un couvercle dessus. Explique, avec tes essais, pourquoi les braises s’éteignent.',
    objectif:'Réaliser et décrire la combustion du charbon de bois.',objectifEleve:'Savoir décrire la combustion du charbon et dire de quoi elle a besoin.',
    situation:'Awa évente le fourneau pour raviver les braises. Kofi dit que c’est le vent qui « nourrit » le feu. De quoi le charbon de bois a-t-il besoin pour brûler ? En travaux pratiques, le professeur allume un morceau de charbon.',
    materiel:'Simulation : morceau de charbon de bois porté à incandescence par le professeur, soucoupe, bocal, air soufflé.',
    prevision:{consigne:'Avant les essais, choisis ce dont le charbon a besoin pour brûler. Justifie ton hypothèse.',choix:[['seul','De rien : il brûle tout seul, même sans air'],['eau','D’eau pour l’humidifier'],['air','De l’air, qui apporte le gaz oxygène'],['fumee','De fumée pour l’entretenir']]},
    protocole:['Le professeur porte le charbon à incandescence et le pose sur la soucoupe.','Observer à l’air libre : braise, flamme ou non, chaleur, taille du morceau.','Couvrir d’un bocal fermé : observer la braise.','Observer en soufflant de l’air : comparer.'],
    variable:'La condition : bocal fermé, air libre, air soufflé',maintenu:'Le même morceau de charbon, la même soucoupe',
    colonnes:['Condition','Braise','Charbon','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().CONDITIONS,e.c),BR[e.braise],e.diminue?'Diminue, cendres':'Ne diminue plus',e.observation||'—']),
    resume:e=>lib(C().CONDITIONS,e.c).toLowerCase()+' : braise '+BR[e.braise].toLowerCase(),
    confrontation:'1. Que devient la braise dans le bocal fermé ? Qu’est-ce qui lui manque ? 2. Que change l’air soufflé ? 3. Y a-t-il une flamme ? Que devient le morceau de charbon ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les trois conditions et l’état de la braise dans chacune.',
    transfert:{q:'Un sac de charbon fermé peut-il « brûler tout seul » dans la réserve, sans source de chaleur ?',rep:'non',expl:'Non : la combustion a besoin d’une source de chaleur pour démarrer et de gaz oxygène pour continuer. Le charbon froid dans un sac ne brûle pas ; il faut quand même le ranger loin des flammes.'},
    critere:'Décrire la combustion du charbon (incandescence sans flamme, charbon qui diminue) et conclure qu’elle consomme le gaz oxygène de l’air.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense que le charbon brûle sans air.'],['MF','Voit la braise s’éteindre sous le bocal sans dire pourquoi.'],['MS','Relie l’extinction au manque de gaz oxygène.'],['TBM','Décrit les trois conditions et explique le rôle de l’air soufflé.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=3&&v.some(e=>e.c==='ferme')&&v.some(e=>e.c!=='ferme');},
    aides:['Compare le bocal fermé et l’air libre : qu’est-ce qui manque dans le bocal ?','Souffler apporte plus d’air, donc plus de gaz oxygène.','Le charbon ne fait pas de flamme : il rougeoie et diminue.'],
    synthese:'Le charbon de bois brûle dans l’air sans flamme : il devient incandescent, dégage de la chaleur, diminue et laisse des cendres. La combustion consomme le charbon et le gaz oxygène (dioxygène) de l’air : dans un bocal fermé, elle s’arrête quand le gaz oxygène manque ; en soufflant, elle devient plus vive.',
    prof:{reference:'Bocal fermé : la braise pâlit et s’éteint (gaz oxygène consommé). Air libre : rougeoie sans flamme, chauffe, diminue, cendres. Air soufflé : incandescence vive, diminue plus vite. Le TP introduit le charbon dans un bocal de dioxygène ; la simulation parle d’air (écart signalé au registre).',attendus:['Hypothèse avant l’essai.','Trois conditions comparées.','Extinction reliée au manque de gaz oxygène.','Aucune flamme, charbon qui diminue.'],erreurs:['Croire que le charbon brûle sans air.','Croire que le vent « nourrit » le feu par lui-même.','Appeler « flamme » l’incandescence.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare le bocal fermé et l’air libre.']:['Fais un premier essai à l’air libre.']
  };
})();
