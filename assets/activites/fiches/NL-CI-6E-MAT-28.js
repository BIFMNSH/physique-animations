/* NohobaLab · 6e Côte d'Ivoire · MAT-28 · Matériaux : la chaleur (parcours « Matériaux, tri et déchets »).
   Simulation seulement ; eau chaude = jamais brûlante pour les élèves (démonstration du professeur en réel). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const MAT=()=>Object.keys(M().MATERIAUX).map(k=>[k,M().MATERIAUX[k].nom]);
  const INS=[['court','Après 1 minute'],['long','Après 5 minutes']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:28,titre:'Atelier · la chaleur dans une tige',
      intro:'Un bout de la tige est dans l’eau chaude ; je regarde le bout libre. Je choisis le matériau et l’instant. Simulation, durées accélérées.',
      controles:[{cle:'m',legende:'La tige est en…',items:MAT()},{cle:'i',legende:'L’instant',items:INS}],
      saisie:'J’observe que le bout libre…',legendeTable:'Mes essais : matériau, instant et état du bout libre.',F:()=>window.FICHE_CI_MAT28,
      render:v=>{const r=M().chaleur(v.m,v.i),sc=M().scene.chaleur({mat:v.m,instant:v.i});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{mat:v.m,instant:v.i,chaud:r.chaud,conduit:r.conduit}};}});
  }
  window.FICHE_CI_MAT28={
    id:'NL-CI-6E-MAT-28',version:'0.9',modele:'chaleur-materiaux-v1',
    titre:'Comparer la façon dont des matériaux transmettent la chaleur',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Comparer la transmission de la chaleur dans des matériaux.',
    objectifsPedagogiques:['Dire que les métaux transmettent bien la chaleur','Dire que le plastique, le bois et le verre la transmettent mal','Relier cette propriété à un usage'],
    situationEvaluation:'Awa remue la sauce avec une cuillère en métal et une cuillère en bois. Laquelle chauffe jusqu’à la main ? Explique avec la propriété des matériaux.',
    objectif:'Comparer la conduction de la chaleur.',objectifEleve:'Savoir quels matériaux transmettent bien la chaleur.',
    situation:'Pourquoi le manche d’une casserole est-il en bois ou en plastique et le fond en métal ? Kofi compare six tiges.',
    materiel:'Simulation : six tiges de même taille, un bécher d’eau chaude.',
    prevision:{consigne:'Avant les essais, choisis la tige dont le bout libre devient le plus chaud. Justifie ton hypothèse.',choix:[['metal','Une tige en métal'],['bois','La tige en bois'],['plastique','La tige en plastique'],['verre','La tige en verre']]},
    protocole:['Plonger un bout de la tige dans l’eau chaude.','Observer le bout libre après 1 minute.','Observer encore après 5 minutes.','Refaire avec une autre tige.'],
    variable:'Le matériau de la tige',maintenu:'La taille, l’eau chaude et la durée',
    colonnes:['Tige','Instant','Bout libre','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[lib(MAT(),e.mat),lib(INS,e.i||e.instant),e.chaud,e.observation||'—']),
    resume:e=>lib(MAT(),e.mat).toLowerCase()+' ('+lib(INS,e.instant).toLowerCase()+') : bout libre '+e.chaud,
    confrontation:'1. Quelles tiges chauffent vite jusqu’au bout libre ? 2. Lesquelles chauffent peu ? 3. Quel usage en déduis-tu ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux matériaux et l’état de leur bout libre.',
    transfert:{q:'Pourquoi le manche d’une casserole n’est-il pas en métal ?',rep:'mal',type:'choix',options:[['mal','Parce que le bois ou le plastique transmettent mal la chaleur : la main ne brûle pas'],['lourd','Parce que le métal est trop léger'],['couleur','Parce que le métal est noir'],['rien','Il n’y a aucune raison']],expl:'Les matériaux qui transmettent mal la chaleur protègent la main.'},
    critere:'Classer les matériaux selon la transmission de la chaleur avec deux essais cités.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Observe sans comparer.'],['MF','Compare sans relier à un usage.'],['MS','Compare et relie à un usage.'],['TBM','Compare, relie et explique le choix du matériau.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&v.some(e=>e.conduit)&&v.some(e=>!e.conduit)&&M().distincts(v,'mat')>=3;},
    aides:['Compare le bout libre d’une tige en métal et d’une tige en bois.','Regarde après 1 minute et après 5 minutes.','Qui transmet mal protège la main.'],
    synthese:'Les métaux transmettent bien la chaleur : le bout libre devient vite chaud. Le plastique, le bois et le verre la transmettent mal. On choisit donc un métal pour le fond d’une casserole et du bois ou du plastique pour le manche.',
    prof:{reference:'Métaux : bonne transmission de la chaleur ; plastique, bois, verre : mauvaise transmission.',attendus:['Quatre essais.','Conclure.','Relier à l’usage.'],erreurs:['Toucher l’eau chaude (interdit : simulation).','Confondre chaud et conducteur du courant.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste un métal et un non-métal.']:['Fais un premier essai.']
  };
})();
