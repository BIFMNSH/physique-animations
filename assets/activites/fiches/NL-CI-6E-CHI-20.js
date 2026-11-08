/* NohobaLab · 6e Côte d'Ivoire · CHI-20 · Écrire l'équation littérale d'une combustion.
   Atelier d'étiquettes : à gauche de la flèche ce qui est consommé, à droite ce qui se forme ; pièges : chaleur, flamme, cendres. « charbon de bois » (décision du propriétaire). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const SLOTS=[['charbon_g','Combustion du charbon de bois : à gauche de la flèche (ce qui est consommé)','charbon','gauche'],['charbon_d','Combustion du charbon de bois : à droite de la flèche (ce qui se forme)','charbon','droite'],['alcool_g','Combustion de l’alcool : à gauche de la flèche (ce qui est consommé)','alcool','gauche'],['alcool_d','Combustion de l’alcool : à droite de la flèche (ce qui se forme)','alcool','droite']];
  function manip(panel,X){
    const h=window.Activite.h,esc=window.Activite.esc,st=X.st();
    const items=SLOTS.map(s=>({id:s[0],label:s[1],juste:C().EQUATIONS[s[2]][s[3]].slice().sort(),pourquoi:s[3]==='gauche'?'À gauche : le combustible et le gaz oxygène, consommés.':'À droite : les corps formés, prouvés par les tests.',aide:'La chaleur, la flamme et les cendres ne sont pas des corps de l’équation.'}));
    const lu=h('div',{class:'card'},panel);h('h3',{text:'Mon équation, lue en entier'},lu);const p=h('p',{'aria-live':'polite',style:'font-size:18px;font-weight:700'},lu);
    function maj(){const S=(st.tri||{}).equation||{ok:{}};const l=[];['charbon','alcool'].forEach(c=>{if(S.ok[c+'_g']&&S.ok[c+'_d'])l.push(C().equation(c));});p.textContent=l.length?l.join('  ·  '):'Complète les deux côtés d’une combustion pour lire son équation littérale.';}
    M().tri(panel,X,{id:'equation',titre:'Atelier · je place les étiquettes',intro:'Pour chaque côté de la flèche, je coche les étiquettes qui conviennent, puis je valide. Une équation littérale s’écrit avec des mots : corps consommés → corps formés.',legende:'Je coche les étiquettes',cats:C().ETIQUETTES.filter(e=>e[0]!=='butane'),items,multi:true,onChange:maj,impression:{titre:'Mes équations littérales'}});
    maj();
  }
  window.FICHE_CI_CHI20={
    id:'NL-CI-6E-CHI-20',version:'0.9',modele:'equation-litterale-v1',
    titre:'Écrire la combustion en une ligne',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Écrire l’équation littérale d’une combustion (charbon de bois, alcool).',
    objectifsPedagogiques:['Placer les corps consommés à gauche de la flèche et les corps formés à droite','Écarter ce qui n’est pas un corps : chaleur, flamme, cendres','Lire une équation littérale en phrase'],
    situationEvaluation:'Kofi écrit : « charbon de bois + chaleur → cendres ». Corrige son équation et explique chaque changement.',
    objectif:'Écrire les équations littérales des combustions du charbon de bois et de l’alcool.',objectifEleve:'Savoir écrire une combustion en une ligne, avec une flèche.',
    situation:'Kofi veut résumer la combustion du charbon en une ligne, « comme une recette ». Comment écrire ce qui disparaît et ce qui apparaît ? Le professeur donne des étiquettes et une flèche.',
    materiel:'Simulation : étiquettes (charbon de bois, alcool, gaz oxygène, gaz carbonique, eau, chaleur, flamme, cendres), signe « + », flèche « → ».',
    prevision:{consigne:'Avant l’atelier, choisis comment on écrit une combustion. Justifie ton hypothèse.',choix:[['produit','On écrit seulement le produit formé'],['egal','On écrit avec un signe égal entre les corps'],['fleche','On écrit corps consommés → corps formés, avec une flèche'],['dessin','On dessine la flamme']]},
    protocole:['Pour le charbon de bois : cocher ce qui est consommé (gauche), valider ; cocher ce qui se forme (droite), valider.','Lire l’équation obtenue.','Faire de même pour l’alcool.','Vérifier que chaleur, flamme et cendres ne sont nulle part.'],
    variable:'Le côté de la flèche et la combustion',maintenu:'Les mêmes étiquettes',
    colonnes:['Côté','Mes étiquettes','Résultat'],lignesVides:4,
    lignes:st=>M().lignesTri(st,'equation',i=>SLOTS.filter(s=>s[0]===i)[0][1],c=>String(c).split(',').map(k=>lib(C().ETIQUETTES,k)).join(' + ')),
    resume:e=>'côté placé : '+String(e.choix).split(',').map(k=>lib(C().ETIQUETTES,k)).join(' + '),
    confrontation:'1. Qu’y a-t-il à gauche de la flèche ? Pourquoi le gaz oxygène y est-il toujours ? 2. Qu’y a-t-il à droite ? Quelle preuve as-tu ? 3. Pourquoi la chaleur n’est-elle pas dans l’équation ? Compare ensuite à ton hypothèse.',
    retroaction:'Écris une des deux équations en entier.',
    transfert:{q:'Le butane de la gazinière brûle en formant de l’eau et du gaz carbonique. Son équation littérale commence-t-elle par « butane + gaz oxygène → » ?',rep:'oui',expl:'Oui : comme pour le charbon et l’alcool, le combustible et le gaz oxygène sont à gauche ; à droite, le gaz carbonique et l’eau. Tu l’écriras dans la leçon sur la combustion du gaz.'},
    critere:'Écrire les deux équations littérales complètes, sans chaleur, flamme ni cendres.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Écrit seulement un produit ou met la chaleur dans l’équation.'],['MF','Place le combustible mais oublie le gaz oxygène.'],['MS','Écrit une équation complète.'],['TBM','Écrit les deux équations et les lit en phrase.']],
    peutConfronter:st=>M().triEtat(st,'equation',SLOTS.map(s=>s[0])).justes>=4,
    aides:['À gauche : le combustible et le gaz oxygène, toujours.','À droite : les corps prouvés par la buée et l’eau de chaux.','Chaleur, flamme et cendres ne sont pas des corps formés par la réaction.'],
    synthese:'Une équation littérale écrit une réaction chimique en mots : corps consommés → corps formés. Charbon de bois + gaz oxygène → gaz carbonique. Alcool + gaz oxygène → gaz carbonique + eau. La chaleur et la flamme accompagnent la réaction sans être des corps ; les cendres sont des restes.',
    prof:{reference:'charbon de bois + gaz oxygène → gaz carbonique ; alcool + gaz oxygène → gaz carbonique + eau. « Charbon de bois » retenu plutôt que « carbone » (décision du propriétaire, comme le TP).',attendus:['Quatre côtés justes.','Gaz oxygène présent à gauche des deux équations.','Pièges écartés.'],erreurs:['Oublier le gaz oxygène.','Écrire la chaleur comme un produit.','Mettre les cendres à droite.']},
    diagnostic:st=>st.essais.length?['Indicatif : le gaz oxygène est à gauche dans les deux équations.']:['Commence par la gauche de l’équation du charbon.']
  };
})();
