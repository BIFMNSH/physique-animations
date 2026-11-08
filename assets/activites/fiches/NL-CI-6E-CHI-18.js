/* NohobaLab · 6e Côte d'Ivoire · CHI-18 · Appliquer les règles de sécurité.
   Six scénarios « bon geste » à quatre choix ; le retour explique avec le triangle du feu (exploitation du triangle). Numéro des sapeurs-pompiers donné par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  function manip(panel,X){
    const h=window.Activite.h;
    const items=C().SCENARIOS.map(s=>({id:s.id,label:s.label,options:s.options,juste:s.juste,retour:s.retour,aide:'Pense au triangle du feu : mon geste enlève-t-il l’air, le combustible ou la chaleur ? ou en apporte-t-il ?'}));
    M().tri(panel,X,{id:'gestes',titre:'Le bon geste · six situations',intro:'Pour chaque situation, je choisis le geste à faire. Le retour m’explique, avec le triangle du feu, pourquoi il convient ou non.',legende:'Je choisis le geste',cats:[],items,impression:{titre:'Mes règles de sécurité'}});
    const u=h('div',{class:'card'},panel);h('h3',{text:'Alerter'},u);
    h('p',{},u,'En cas d’incendie ou d’intoxication : sortir, aérer si possible, prévenir un adulte et appeler les sapeurs-pompiers. <b>Le numéro à composer est donné par le professeur et affiché en classe.</b> Je le recopie sur ma trace.');
  }
  window.FICHE_CI_CHI18={
    id:'NL-CI-6E-CHI-18',version:'0.9',modele:'regles-securite-v1',
    titre:'Le bon geste',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Appliquer les règles de sécurité face à un début de feu, une fuite de gaz ou une fumée, en exploitant le triangle du feu.',
    objectifsPedagogiques:['Choisir le bon geste dans six situations','Justifier le geste avec le triangle du feu (élément supprimé ou apporté)','Connaître les règles : prévenir, alerter, éteindre un petit feu, sortir'],
    situationEvaluation:'À la cantine, l’huile d’une casserole prend feu et un camarade court chercher de l’eau. Dis ce qu’il faut faire à la place, dans l’ordre, et justifie avec le triangle du feu.',
    objectif:'Appliquer les règles de sécurité et exploiter le triangle du feu.',objectifEleve:'Savoir quoi faire, et quoi ne pas faire, face à un début de feu.',
    situation:'Un début de feu dans la cuisine de la cantine : que fait-on, et dans quel ordre ? Awa et Kofi s’entraînent sur six situations avant d’écrire les règles de la classe.',
    materiel:'Simulation : six situations, quatre gestes au choix pour chacune, retour expliqué avec le triangle du feu.',
    prevision:{consigne:'Avant l’entraînement, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['eau','On jette de l’eau sur tout'],['regarder','On reste regarder'],['fenetres','On ouvre tout pour chasser la fumée'],['regles','On alerte, on coupe le gaz, on étouffe un petit feu, jamais d’eau sur l’huile ou l’électricité, on sort et on appelle les pompiers']]},
    protocole:['Lire chaque situation et choisir un geste.','Lire le retour : quel élément du triangle mon geste enlève-t-il ou apporte-t-il ?','Corriger jusqu’au bon geste.','Écrire les règles de la classe et recopier le numéro donné par le professeur.'],
    variable:'La situation',maintenu:'La même règle : supprimer un élément du triangle, ne jamais en apporter',
    colonnes:['Situation','Mon geste','Résultat'],lignesVides:6,
    lignes:st=>M().lignesTri(st,'gestes',i=>C().scenario(i).label,c=>c).map((r,k)=>{const e=st.essais.filter(x=>x.tri==='gestes')[k];const s=C().scenario(e.item),o=s.options.filter(x=>x[0]===e.choix)[0];return [r[0],o?o[1]:e.choix,r[2]];}),
    resume:e=>'geste choisi : '+(C().scenario(e.item).options.filter(x=>x[0]===e.choix)[0]||[,e.choix])[1].toLowerCase(),
    confrontation:'1. Pourquoi l’eau aggrave-t-elle le feu d’huile ? 2. Pourquoi ouvrir grand une porte ou souffler peut-il aviver un feu ? 3. Quel est le premier geste quand on sent le gaz ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux situations, le bon geste et l’élément du triangle concerné.',
    transfert:{q:'Quand une pièce se remplit de fumée, faut-il ouvrir toutes les fenêtres et rester pour aérer ?',rep:'non',expl:'Non : l’air apporte du comburant au feu et je reste exposé à la fumée toxique. Je sors en restant près du sol, je ferme la porte derrière moi, j’alerte et on appelle les sapeurs-pompiers.'},
    critere:'Trouver le bon geste dans les six situations et le justifier avec le triangle du feu.',
    essaisMin:6,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Jette de l’eau sur tout.'],['MF','Connaît un geste sans le justifier.'],['MS','Trouve les bons gestes et les justifie avec le triangle.'],['TBM','Ordonne les gestes (alerter, agir, sortir) et explique les interdits.']],
    peutConfronter:st=>M().triEtat(st,'gestes',C().SCENARIOS.map(s=>s.id)).justes>=6,
    aides:['Éteindre, c’est enlever un élément du triangle : étouffer, retirer le combustible, refroidir.','Souffler, ouvrir grand, courir : cela apporte de l’air au feu.','Jamais d’eau sur l’huile ni sur un appareil électrique.'],
    synthese:'Règles de sécurité : prévenir (rien d’inflammable près des flammes, bouteille de gaz debout en lieu aéré) ; alerter un adulte ; éteindre un petit feu en supprimant un élément du triangle (couvercle, sable, couper le gaz) ; jamais d’eau sur l’huile ni sur l’électricité ; si la fumée envahit la pièce, sortir près du sol, fermer la porte et appeler les sapeurs-pompiers au numéro donné par le professeur.',
    prof:{reference:'Huile : couvercle + couper le gaz. Gaz : fermer la bouteille, aérer, alerter, aucune flamme ni interrupteur. Électrique : couper le courant, alerter. Vêtement : s’arrêter, se coucher, rouler, couvrir. Fumée : sortir près du sol, fermer la porte. Papier : étouffer puis alerter. Le numéro des sapeurs-pompiers est affiché après reconfirmation auprès du GSPM (écart ouvert au registre).',attendus:['Six bons gestes trouvés.','Justification par le triangle.','Numéro recopié depuis l’affichage de la classe.'],erreurs:['Eau sur l’huile ou l’électricité.','Craquer une allumette pour « voir » le gaz.','Ouvrir grand pour « chasser » la fumée.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les retours qui parlent d’air apporté au feu.']:['Commence par la casserole d’huile.']
  };
})();
