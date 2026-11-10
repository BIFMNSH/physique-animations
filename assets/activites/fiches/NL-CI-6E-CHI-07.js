/* NohobaLab · 6e Côte d'Ivoire · CHI-07 · Définir la réaction chimique.
   Bilan en images : corps présents avant (disparaissent), corps apparus après, et ce qui n'est pas un corps (chaleur, flamme) ; cendres = restes, hors bilan. Aucun atome ni modèle moléculaire (6e). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    const h=window.Activite.h,sec=h('div',{class:'card'},panel);
    h('h3',{text:'Rappel · les deux combustions en images'},sec);
    h('p',{text:'Je revois la combustion du charbon et celle de l’alcool : ce qu’il y avait avant, ce que les tests ont montré après.'},sec);
    const grid=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px'},sec);
    [['charbon','Charbon de bois'],['alcool','Alcool']].forEach(([id,nom])=>{const f=h('figure',{style:'margin:0'},grid);const sc=C().sceneTransformation(id);h('div',{},f,sc.montage);h('figcaption',{style:'font-weight:700;margin-top:4px',text:nom+' : avant → après'},f);});
    const items=C().BILAN.map(b=>({id:b.id,label:b.label,juste:b.juste,pourquoi:b.pourquoi,aide:'Est-ce un corps (quelque chose de matériel) ? Était-il là avant ? Les tests l’ont-ils montré après ?'}));
    M().tri(panel,X,{id:'bilan',titre:'Je classe · avant, après, ou ni l’un ni l’autre',intro:'Pour chaque carte, je dis si c’est un corps présent avant qui disparaît, un corps qui apparaît après, ou autre chose.',legende:'Cette carte est',cats:C().BILAN_CATS,items,impression:{titre:'Mon bilan des deux combustions'}});
  }
  window.FICHE_CI_CHI07={
    id:'NL-CI-6E-CHI-07',version:'0.9',modele:'reaction-chimique-bilan-v1',
    titre:'Une réaction chimique',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un solide et d’un liquide dans l’air',
    competenceVisee:'Définir la réaction chimique à partir des corps qui disparaissent et des corps qui apparaissent.',
    objectifsPedagogiques:['Dire quels corps disparaissent et quels corps apparaissent dans une combustion','Distinguer un corps (matière) de la chaleur ou de la flamme','Énoncer la définition de la réaction chimique'],
    situationEvaluation:'Awa dit : « dans la combustion du charbon, rien ne disparaît vraiment, le charbon se cache dans les cendres ». Avec le bilan des deux combustions, explique-lui pourquoi c’est une réaction chimique.',
    objectif:'Construire la définition de la réaction chimique.',objectifEleve:'Savoir dire ce qu’est une réaction chimique.',
    situation:'Dans les deux combustions, des corps ont disparu (charbon, alcool, gaz oxygène) et d’autres sont apparus (gaz carbonique, eau). Kofi demande : « comment appelle-t-on ce qui s’est passé ? » Le professeur propose de faire le bilan en images.',
    materiel:'Simulation : rappel en images des deux combustions, huit cartes à classer.',
    prevision:{consigne:'Avant le classement, choisis ce qui s’est passé dans ces combustions. Justifie ton hypothèse.',choix:[['caches','Rien n’a changé : les corps sont cachés'],['disparu','Des corps ont disparu et de nouveaux corps sont apparus'],['refroidi','L’alcool a seulement refroidi'],['casse','Le charbon s’est seulement cassé']]},
    protocole:['Revoir les deux combustions en images.','Pour chaque carte, dire : présent avant et disparaît, apparaît après, ou ni l’un ni l’autre.','Valider et lire le retour.','Écrire la définition avec les mots « disparaissent » et « apparaissent ».'],
    variable:'La carte à classer',maintenu:'Les mêmes combustions (charbon, alcool)',
    colonnes:['Carte','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>M().lignesTri(st,'bilan',i=>C().BILAN.filter(b=>b.id===i)[0].label,c=>lib(C().BILAN_CATS,c)),
    resume:e=>'carte classée : '+lib(C().BILAN_CATS,e.choix).toLowerCase(),
    confrontation:'1. Quels corps étaient là avant et ont disparu ? 2. Quels corps sont apparus ? Comment le sais-tu ? 3. Pourquoi la chaleur et la flamme ne sont-elles pas dans le bilan ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un corps qui disparaît et un corps qui apparaît, avec la preuve.',
    transfert:{q:'Le bois qui brûle dans le feu de cuisine subit-il aussi une réaction chimique ?',rep:'oui',expl:'Oui : le bois disparaît et de nouveaux corps apparaissent (gaz carbonique, eau, fumée). Des corps disparaissent, d’autres apparaissent : c’est une réaction chimique.'},
    critere:'Classer les huit cartes et énoncer : une réaction chimique est une transformation où des corps disparaissent et de nouveaux corps apparaissent.',
    essaisMin:8,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense que rien ne change.'],['MF','Classe les corps de départ mais pas les produits.'],['MS','Classe les corps et écarte chaleur et flamme.'],['TBM','Énonce la définition et l’applique au bois.']],
    peutConfronter:st=>M().triEtat(st,'bilan',C().BILAN.map(b=>b.id)).repondus>=8,
    aides:['Un corps, c’est de la matière : on peut le mettre dans un bocal. La chaleur, non.','Les tests (buée, eau de chaux) prouvent les corps apparus.','Les cendres sont des restes non brûlés : elles n’ont pas été formées par la combustion.'],
    synthese:'Une réaction chimique est une transformation au cours de laquelle des corps disparaissent et de nouveaux corps apparaissent. Dans la combustion du charbon, le charbon et le gaz oxygène disparaissent, le gaz carbonique apparaît. Dans celle de l’alcool, l’alcool et le gaz oxygène disparaissent, le gaz carbonique et l’eau apparaissent. La chaleur et la flamme accompagnent la réaction mais ne sont pas des corps.',
    prof:{reference:'Avant : charbon, alcool, gaz oxygène. Après : gaz carbonique, eau. Ni l’un ni l’autre : chaleur, flamme (pas des corps), cendres (restes non brûlés, hors bilan : décision du propriétaire).',attendus:['Huit cartes classées.','Preuves des produits citées (buée, eau de chaux).','Définition énoncée avec « disparaissent » et « apparaissent ».'],erreurs:['Mettre la chaleur parmi les produits.','Croire que les cendres sont « le charbon transformé ».','Oublier le gaz oxygène parmi les corps consommés.']},
    diagnostic:st=>st.essais.length?['Indicatif : vérifie les cartes « chaleur » et « cendres ».']:['Commence par les corps de départ.']
  };
})();
