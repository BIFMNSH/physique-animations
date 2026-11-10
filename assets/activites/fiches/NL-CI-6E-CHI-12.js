/* NohobaLab · 6e Côte d'Ivoire · CHI-12 · Réaliser la combustion incomplète du butane.
   Modèle qualitatif : virole fermée → flamme jaune, moins chaude, dépôt de carbone ; produits limités à carbone, eau, gaz carbonique (guide). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const REG=[['flamme','La flamme et la chaleur'],['soucoupe','La soucoupe blanche passée au-dessus']];
  function manip(panel,X){
    M().bloc(panel,X,{n:12,titre:'Atelier · virole ouverte, virole fermée',
      intro:'Le brûleur est allumé par le professeur. Je choisis la position de la virole et ce que je regarde, puis j’écris ce que je vois. Je ne touche ni au gaz ni à la flamme.',
      controles:[{cle:'v',legende:'La virole',items:C().VIROLES},{cle:'r',legende:'Ce que je regarde',items:REG}],
      saisie:'J’observe que…',legendeTable:'Mes essais : virole, flamme, soucoupe.',F:()=>window.FICHE_CI_CHI12,
      render:v=>{const b=C().butane(v.v),sc=C().sceneButane(v.v,v.r);return {montage:sc.montage,schema:sc.schema,txt:b.txt,essai:{v:v.v,r:v.r,flamme:b.flamme,depot:b.depot,chaleur:b.chaleur}};}});
  }
  window.FICHE_CI_CHI12={
    id:'NL-CI-6E-CHI-12',version:'0.9',modele:'butane-incomplete-v1',
    titre:'La flamme jaune',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un gaz dans l’air',
    competenceVisee:'Réaliser la combustion incomplète du butane et connaître ses produits.',
    objectifsPedagogiques:['Obtenir une flamme jaune en fermant la virole (moins d’air)','Décrire la flamme incomplète : jaune, éclairante, moins chaude, dépôt noir','Nommer les produits : carbone, eau, gaz carbonique'],
    situationEvaluation:'Les casseroles de la cantine noircissent depuis que le brûleur est encrassé. Explique ce qui se passe et ce qu’il faut changer, en utilisant tes essais.',
    objectif:'Réaliser et décrire la combustion incomplète du butane.',objectifEleve:'Savoir reconnaître une flamme qui manque d’air et dire ce qu’elle dépose.',
    situation:'Depuis quelques jours, à la cantine du collège d’Adjamé, la flamme est jaune et les casseroles noircissent. Kofi veut comprendre pourquoi. Le professeur ferme la virole du brûleur.',
    materiel:'Simulation : brûleur à butane allumé par le professeur, virole réglable, soucoupe blanche, thermomètre simulé.',
    prevision:{consigne:'Avant les essais, choisis pourquoi les casseroles noircissent. Justifie ton hypothèse.',choix:[['gaz','Le gaz est de mauvaise qualité'],['vieille','La casserole est trop vieille'],['air','L’air manque au brûleur : la combustion est incomplète et dépose du carbone'],['chaude','La flamme est trop chaude']]},
    protocole:['Virole ouverte : observer la flamme et la soucoupe.','Le professeur ferme la virole : observer la flamme et le thermomètre simulé.','Le professeur passe la soucoupe blanche : observer le dépôt.','Comparer les deux positions.'],
    variable:'La position de la virole',maintenu:'Le même brûleur, le même gaz',
    colonnes:['Virole','Flamme','Soucoupe','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(C().VIROLES,e.v),e.flamme==='bleue'?'Bleue, très chaude':'Jaune, moins chaude',e.r==='soucoupe'?(e.depot?'Dépôt noir (carbone)':'Propre'):'—',e.observation||'—']),
    resume:e=>'virole '+e.v+', '+lib(REG,e.r).toLowerCase()+' : flamme '+e.flamme,
    confrontation:'1. Que change la fermeture de la virole pour la flamme ? pour la chaleur ? 2. Qu’y a-t-il sur la soucoupe ? De quel corps s’agit-il ? 3. Qu’est-ce qui a manqué ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les deux positions de la virole avec la flamme et la soucoupe.',
    transfert:{q:'La flamme jaune éclaire mieux : est-elle meilleure pour cuisiner ?',rep:'non',expl:'Non : elle chauffe moins et dépose du carbone (noir de fumée) sur les casseroles. Il faut faire nettoyer le brûleur pour retrouver la flamme bleue.'},
    critere:'Décrire la combustion incomplète (flamme jaune, moins chaude, dépôt de carbone) et nommer ses produits.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Attribue le noircissement au gaz ou à la casserole.'],['MF','Voit la flamme jaune sans relier au manque d’air.'],['MS','Relie flamme jaune, dépôt et manque d’air.'],['TBM','Nomme les trois produits et propose la correction (nettoyer, ouvrir la virole).']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=4&&v.some(e=>e.v==='ouverte')&&v.some(e=>e.v==='fermee'&&e.r==='soucoupe');},
    aides:['Virole fermée : moins d’air entre dans le brûleur.','Le dépôt noir est du carbone, une partie du butane qui n’a pas brûlé complètement.','La flamme jaune chauffe moins que la bleue.'],
    synthese:'Quand l’air manque (virole fermée, brûleur encrassé), la combustion du butane est incomplète : la flamme est jaune, éclairante et moins chaude ; elle dépose du carbone (noir de fumée). Les produits sont le carbone, l’eau et le gaz carbonique. Une flamme jaune à la maison signale qu’il faut faire nettoyer le brûleur.',
    prof:{reference:'Virole ouverte : bleue, très chaude, soucoupe propre. Virole fermée : jaune, moins chaude, dépôt noir de carbone. Produits de la combustion incomplète limités à carbone, eau, gaz carbonique (guide et TP) ; le gaz toxique invisible est traité dans la fiche sur les dangers.',attendus:['Quatre essais, deux positions.','Dépôt nommé : carbone.','Manque d’air identifié.'],erreurs:['Croire que la flamme jaune est la plus chaude.','Attribuer le noir à la casserole.','Appeler le dépôt « gaz carbonique ».']},
    diagnostic:st=>st.essais.length?['Indicatif : compare toujours à la virole ouverte.']:['Commence par la virole ouverte.']
  };
})();
