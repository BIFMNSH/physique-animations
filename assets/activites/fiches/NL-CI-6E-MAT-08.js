/* NohobaLab · 6e Côte d'Ivoire · MAT-08 · Découvrir les propriétés des gaz.
   Seringue sans aiguille ; graduations qualitatives ; aucune valeur de pression ni de volume mesuré. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const BOU=[['oui','Seringue bouchée (bouchon au bout)'],['non','Seringue ouverte']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:8,titre:'Atelier · la seringue et l’air enfermé',
      intro:'Je choisis une action sur le piston et si la seringue est bouchée ou ouverte, puis j’observe le volume d’air et la position du piston. Simulation : seringue sans aiguille, un bouchon à la place du doigt.',
      controles:[{cle:'b',legende:'La seringue',items:BOU},{cle:'a',legende:'Ce que je fais',items:M().ACTIONS_SERINGUE}],
      saisie:'J’observe que le volume d’air… et que le piston…',legendeTable:'Mes essais : seringue, action, volume et piston.',F:()=>window.FICHE_CI_MAT08,
      render:v=>{const r=M().seringue(v.b==='oui',v.a),sc=M().scene.seringue({bouchee:v.b==='oui',action:v.a});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{bouchee:v.b==='oui',action:v.a,volume:r.volume,revient:r.revient}};}});
  }
  window.FICHE_CI_MAT08={
    id:'NL-CI-6E-MAT-08',version:'0.9',modele:'seringue-air-qualitatif-v1',
    titre:'Découvrir les propriétés des gaz',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Les gaz',
    competenceVisee:'Mettre en évidence qu’un gaz est compressible, expansible et élastique.',
    objectifsPedagogiques:['Décrire ce qui arrive au volume d’air quand on appuie sur le piston','Décrire ce qui arrive quand on tire','Dire que le piston revient quand on relâche : un gaz est élastique'],
    situationEvaluation:'Kofi bouche une pompe à vélo avec son doigt et pousse le piston, puis relâche. Que sent-il et que voit-il ? Nomme les propriétés de l’air qu’il met en évidence.',
    objectif:'Dégager trois propriétés des gaz.',objectifEleve:'Savoir décrire la compression, l’expansion et l’élasticité d’un gaz.',
    situation:'Awa bouche l’embout d’une seringue et pousse le piston : elle sent une résistance. Elle se demande si l’on peut changer le volume de l’air enfermé.',
    materiel:'Simulation : une seringue sans aiguille remplie d’air, un bouchon.',
    prevision:{consigne:'Avant les essais, choisis ce que fait le piston quand on appuie puis qu’on relâche, seringue bouchée. Justifie ton hypothèse.',choix:[['revient','Il s’enfonce puis revient presque à sa place'],['reste','Il s’enfonce et reste enfoncé'],['bloque','Il ne bouge pas du tout'],['sort','Il sort de la seringue']]},
    protocole:['Seringue bouchée : appuyer puis relâcher.','Seringue bouchée : tirer puis relâcher.','Refaire avec la seringue ouverte.','Noter volume d’air et piston.'],
    variable:'L’action sur le piston, puis le bouchon',maintenu:'La même seringue',
    colonnes:['Seringue','Action','Volume d’air','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[e.bouchee?'Bouchée':'Ouverte',lib(M().ACTIONS_SERINGUE,e.action),e.volume+(e.revient?' (le piston revient)':''),e.observation||'—']),
    resume:e=>(e.bouchee?'bouchée':'ouverte')+', '+lib(M().ACTIONS_SERINGUE,e.action).toLowerCase()+' : volume '+e.volume,
    confrontation:'1. Que devient le volume d’air quand on appuie ? 2. Et quand on tire ? 3. Que fait le piston quand on relâche ? 4. Et avec la seringue ouverte ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai avec la seringue bouchée et ce que tu as observé.',
    transfert:{q:'On bouche une seringue et on appuie sur le piston : le volume d’air diminue. Cela montre que l’air est…',rep:'compressible',type:'choix',options:[['compressible','compressible'],['elastique','seulement élastique'],['solide','solide']],expl:'Compressible : on peut diminuer son volume. S’il revient en relâchant, il est aussi élastique.'},
    critere:'Nommer compressible, expansible, élastique en citant des essais.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit le piston sans parler du volume.'],['MF','Dit que le volume change sans nommer la propriété.'],['MS','Nomme les trois propriétés avec des essais.'],['TBM','Nomme, justifie et explique le cas de la seringue ouverte.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=3&&v.some(e=>e.bouchee&&e.volume==='réduit')&&v.some(e=>e.bouchee&&e.volume==='augmenté')&&v.some(e=>e.bouchee&&e.revient);},
    aides:['Compare le volume d’air avant et après.','Que fait le piston quand on relâche ?','Seringue ouverte, l’air peut sortir : le volume enfermé ne change pas.'],
    synthese:'Un gaz est compressible (son volume diminue quand on appuie), expansible (il augmente quand on tire) et élastique (le piston revient quand on relâche). Seringue ouverte, l’air entre et sort : rien de tout cela ne se voit.',
    prof:{reference:'Gaz compressible, expansible, élastique ; seringue ouverte : pas d’effet.',attendus:['Observer volume réduit, augmenté, puis le retour du piston.','Observer l’absence d’effet seringue ouverte.','Nommer les trois propriétés.'],erreurs:['Ne pas boucher la seringue.','Confondre compressible et élastique.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais appuyer, tirer et relâcher, seringue bouchée.']:['Fais un premier essai.']
  };
})();
