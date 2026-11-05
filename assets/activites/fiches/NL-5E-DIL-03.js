/* NohobaLab · 5e · DIL-03 · Un liquide chauffé (principe du thermomètre).
   Modèle : niveaux qualitatifs (NohobaDilatation5e.res3). Bain chaud préparé par le professeur. */
(function(){
  'use strict';
  const M=()=>window.NohobaDilatation5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · le niveau dans le tube',idObs:'e-obs',placeholder:'J’observe que le niveau…',
      intro:'Je choisis un liquide et un bain, puis je compare le niveau au repère. Le bain chaud est préparé par le professeur.',
      fiche:()=>window.FICHE_5E_DIL03,
      groupes:[{legende:'Liquide',nom:'e-l',items:N.LIQ,def:'eau'},{legende:'Bain',nom:'e-b',items:N.BAINS,def:'chaud'}],
      rendre:v=>{const r=N.res3(v['e-l'],v['e-b']);return {montage:N.montage3(r.l,r.b),schema:N.schema3(r.l,r.b),lecture:r.nom+' · '+r.bain+' : '+r.txt,essai:{l:r.l,b:r.b,pos:r.pos}};}});
  }
  const P={dessus:'au-dessus du repère',repere:'au repère',dessous:'sous le repère'};
  window.FICHE_5E_DIL03={
    id:'NL-5E-DIL-03',version:'0.9',modele:'liquide-chauffe-v1',
    titre:'Pourquoi le liquide du thermomètre monte-t-il ?',niveau:'5e',
    theme:'Propriétés physiques de la matière',chapitre:'La dilatation des liquides',
    competenceVisee:'Relier la variation de température au volume d’un liquide.',
    objectifsPedagogiques:['Comparer le niveau du liquide dans trois bains','Constater la dilatation et la contraction d’un liquide','Relier la dilatation au fonctionnement du thermomètre'],
    situationEvaluation:'Au dispensaire, l’infirmière lit le thermomètre de Kofi : le liquide a monté dans le tube. Pourquoi ? Justifie avec tes essais.',
    objectif:'Relier la température au volume d’un liquide.',
    objectifEleve:'Savoir pourquoi le liquide d’un thermomètre monte.',
    situation:'Au dispensaire, l’infirmière met un thermomètre à Kofi : le liquide rouge monte dans le tube. Awa se demande ce qui fait monter le liquide.',
    materiel:'Ballons de verre à tube fin, eau colorée, huile, alcool coloré, bains (glace, ambiant, chaud préparé par le professeur), simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse avec « car ».',choix:[
      ['augmente','Le liquide chauffé occupe plus de volume : il monte dans le tube'],['constant','Le volume ne change jamais'],['diminue','Le liquide chauffé occupe moins de volume'],['tube','Seul le tube de verre se dilate']]},
    protocole:['Marquer le niveau de départ avec un repère.','Placer le ballon dans le bain choisi.','Comparer le niveau au repère.','Faire au moins cinq essais avec des liquides et des bains différents.'],
    variable:'Le liquide et le bain',maintenu:'Le ballon, le tube et le repère',
    colonnes:['Liquide','Bain','Niveau','Mon observation'],lignesVides:7,
    lignes:st=>st.essais.map(e=>[M().res3(e.l,e.b).nom,M().res3(e.l,e.b).bain,P[e.pos],e.observation||'—']),
    resume:e=>M().res3(e.l,e.b).nom+' · '+M().res3(e.l,e.b).bain+' : '+P[e.pos],
    confrontation:'1. Que fait le niveau dans le bain chaud ? 2. Et dans le bain de glace ? 3. Tous les liquides montent-ils pareil ? Compare à ton hypothèse.',
    retroaction:'Cite un liquide, un bain et la position du niveau par rapport au repère.',
    transfert:{q:'Dans un thermomètre, le liquide monte quand il fait plus chaud parce que :',rep:'dilate',options:[['dilate','le liquide se dilate : son volume augmente'],['evapore','le liquide s’évapore'],['pompe','une pompe le pousse'],['tube','le tube se raccourcit']],expl:'Un liquide chauffé se dilate : son volume augmente et le niveau monte dans le tube fin. C’est le principe du thermomètre.'},
    critere:'Réaliser au moins cinq essais et conclure : un liquide chauffé se dilate, refroidi il se contracte.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne compare pas le niveau au repère.'],['MF','Observe le niveau sans conclure.'],['MS','Conclut qu’un liquide chauffé se dilate et que refroidi il se contracte.'],['TBM','Conclut, compare des liquides et relie la dilatation au thermomètre.']],
    peutConfronter:st=>{const v=E().valides(st);return v.length>=5&&['eau','huile','alcool'].every(l=>v.some(e=>e.l===l&&e.b==='chaud'))&&v.some(e=>e.b==='glace');},
    aides:['Compare le haut du liquide au repère.','Chauffé, le liquide occupe-t-il plus de place ?','As-tu testé le bain chaud pour les trois liquides et un bain de glace ?'],
    synthese:'Un liquide chauffé se dilate : son volume augmente. Refroidi, il se contracte. Tous les liquides ne se dilatent pas de la même façon : l’alcool se dilate plus que l’eau. Le thermomètre à liquide fonctionne grâce à la dilatation : le liquide monte dans le tube quand la température augmente.',
    prof:{reference:'Bain chaud : eau, huile, alcool montent, l’alcool le plus. Bain de glace : niveaux sous le repère. Comparaisons qualitatives ; aucune valeur de coefficient. Bain chaud préparé par le professeur.',attendus:['Hypothèse notée avant les essais.','Au moins cinq essais avec observation.','Phrase : un liquide chauffé se dilate ; le thermomètre utilise ce principe.'],erreurs:['Penser que le liquide s’évapore.','Penser que seul le tube change.','Croire que tous les liquides montent pareil.']},
    diagnostic:st=>E().valides(st).some(e=>e.b==='glace')?['Compare ce niveau à celui du bain chaud.']:['Teste un bain de glace pour voir la contraction.']
  };
})();
