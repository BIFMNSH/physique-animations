/* NohobaLab · 6e Côte d'Ivoire · ENE-01 · Reconnaître les effets du courant électrique. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : un courant peut produire de la lumière, de la chaleur ou du mouvement selon l'appareil. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const APP=[['lampe','Une lampe'],['moteur','Un petit moteur'],['fil','Un fil résistant']];
  const NOM={lumiere:'De la lumière',chaleur:'De la chaleur',mouvement:'Du mouvement'};
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:1,titre:'Atelier · je branche trois appareils sur une pile',
      intro:'Je choisis un appareil, je regarde le montage et son schéma, puis j’écris ce que le courant produit. Simulation uniquement : on ne touche jamais un fil qui chauffe.',
      controles:[{cle:'a',legende:'L’appareil branché',items:APP}],
      saisie:'J’observe que l’appareil… ',legendeTable:'Mes essais : appareil et effet du courant.',F:()=>window.FICHE_CI_ENE01,
      render:v=>{const r=NE().effet(v.a),sc=NE().sceneEffet(v.a);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{app:v.a,effet:r.effet}};}});
  }
  window.FICHE_CI_ENE01={
    id:'NL-CI-6E-ENE-01',version:'0.9',modele:'effets-courant-qualitatif-v1',
    titre:'Reconnaître les effets du courant électrique',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Associer un effet du courant (lumière, chaleur, mouvement) à un appareil alimenté par une pile.',
    objectifsPedagogiques:['Dire qu’un courant peut produire de la lumière','Dire qu’un courant peut produire de la chaleur','Dire qu’un courant peut produire du mouvement'],
    situationEvaluation:'Kofi dit : « un courant électrique ne sert qu’à allumer des lampes ». Donne deux exemples qui montrent qu’il se trompe.',
    objectif:'Reconnaître trois effets du courant électrique.',objectifEleve:'Savoir dire ce que produit le courant dans un appareil.',
    situation:'Awa branche successivement une lampe, un petit moteur et un fil résistant sur la même pile. Elle se demande ce que le courant fait dans chaque appareil.',
    materiel:'Simulation : une pile, une lampe, un petit moteur, un fil résistant, des fils de connexion.',
    prevision:{consigne:'Avant les essais, choisis ce que tu crois : que produit le courant dans ces trois appareils ? Justifie ton hypothèse.',choix:[['trois','Lumière, mouvement et chaleur : un effet différent selon l’appareil'],['lumiere','Toujours de la lumière, quel que soit l’appareil'],['rien','Rien de visible dans le moteur et dans le fil'],['chaleur','Toujours de la chaleur, quel que soit l’appareil']]},
    protocole:['Brancher la lampe sur la pile et noter ce qu’on voit.','Brancher le moteur à la place et noter ce qu’on voit.','Brancher le fil résistant à la place et noter ce qu’on observe (en simulation seulement).','Comparer les trois effets.'],
    variable:'L’appareil branché',maintenu:'La pile et les fils',
    colonnes:['Appareil','Effet du courant','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(APP,e.app),NOM[e.effet],e.observation||'—']),
    resume:e=>lib(APP,e.app).toLowerCase()+' : '+NOM[e.effet].toLowerCase(),
    confrontation:'1. Que produit le courant dans la lampe ? 2. Dans le moteur ? 3. Dans le fil résistant ? 4. Le courant produit-il toujours le même effet ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un appareil et l’effet que tu as observé.',
    transfert:{q:'Un fer à repasser branché sur le secteur (220 V) devient chaud. Quel effet du courant est utilisé ?',rep:'chaleur',options:[['lumiere','La lumière'],['chaleur','La chaleur'],['mouvement','Le mouvement']],expl:'La chaleur : le courant traverse un élément chauffant, comme dans le fil résistant. On ne branche jamais un appareil du secteur sans l’accord d’un adulte.'},
    critere:'Associer chaque appareil à son effet en citant tes essais.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un appareil sans parler du courant.'],['MF','Associe un appareil à un effet sans citer les autres.'],['MS','Associe les trois appareils à lumière, mouvement et chaleur.'],['TBM','Associe, conclut que l’effet dépend de l’appareil et applique à un nouvel appareil.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&M().distincts(v,'effet')>=3;},
    aides:['Regarde ce que fait chaque appareil quand le circuit est fermé.','Compare les trois essais : qu’est-ce qui change, qu’est-ce qui reste pareil ?','La pile et les fils sont les mêmes : c’est l’appareil qui change l’effet.'],
    synthese:'Un courant électrique peut produire de la lumière (lampe), du mouvement (moteur) ou de la chaleur (fil résistant). L’effet dépend de l’appareil branché.',
    prof:{reference:'Lampe : lumière. Moteur : mouvement. Fil résistant : chaleur. L’effet principal dépend de l’appareil ; une lampe chauffe aussi un peu (voir la fiche sur la lampe qui chauffe).',attendus:['Observer les trois effets avec les trois appareils.','Conclure que l’effet dépend de l’appareil.'],erreurs:['Croire que le courant ne sert qu’à éclairer.','Croire qu’un fil qui chauffe est cassé.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste les trois appareils.']:['Fais un premier essai.']
  };
})();
