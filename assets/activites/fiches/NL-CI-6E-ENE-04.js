/* NohobaLab · 6e Côte d'Ivoire · ENE-04 · Décrire la conversion d'énergie dans une lampe. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : une lampe donne de la lumière et de la chaleur ; l'énergie utile dépend de la fonction ; la chaleur dissipée n'est pas détruite. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const DUR=[['court','Allumée 1 minute'],['moyen','Allumée 10 minutes'],['long','Allumée 30 minutes']];
  const CATS=[['utile','Énergie utile'],['dissipee','Énergie dissipée']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const SIT=[
    ['e_lum','Pour éclairer une chambre : la lumière de la lampe','eclairer','lumineuse'],
    ['e_chal','Pour éclairer une chambre : la chaleur du verre de la lampe','eclairer','thermique'],
    ['c_chal','Pour chauffer des poussins sous une lampe chauffante : la chaleur de la lampe','chauffer','thermique'],
    ['c_lum','Pour chauffer des poussins sous une lampe chauffante : la lumière de la lampe','chauffer','lumineuse']];
  const POURQUOI={
    e_lum:'Pour éclairer, la lumière est ce qu’on veut : elle est utile.',
    e_chal:'Pour éclairer, la chaleur n’est pas voulue : c’est de l’énergie dissipée. Elle n’est pas détruite : elle passe dans l’air autour de la lampe.',
    c_chal:'Ici la fonction est de chauffer : la chaleur est utile.',
    c_lum:'Ici la fonction est de chauffer : la lumière n’est pas voulue, c’est de l’énergie dissipée.'};
  function manip(panel,X){
    M().bloc(panel,X,{n:4,titre:'Atelier · je laisse une lampe allumée',
      intro:'Je choisis la durée, je regarde la lumière et le thermomètre (niveaux qualitatifs simulés, sans mesure). Puis j’écris ce que j’observe.',
      controles:[{cle:'d',legende:'La durée',items:DUR}],
      saisie:'J’observe que la lampe… et que le thermomètre…',legendeTable:'Mes essais : durée, lumière et chaleur (valeurs simulées).',F:()=>window.FICHE_CI_ENE04,
      render:v=>{const r=NE().lampeChaleur(v.d),sc=NE().sceneChaleur(v.d);return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (Niveaux simulés.)',essai:{duree:v.d,chaleur:r.chaleur,mot:r.mot}};}});
    const items=SIT.map(s=>({id:s[0],label:s[1],juste:NE().utilite(s[2],s[3]),pourquoi:POURQUOI[s[0]],aide:'Demande-toi : qu’est-ce qu’on veut obtenir avec cet appareil ?'}));
    M().tri(panel,X,{id:'utile',titre:'Utile ou dissipée ?',intro:'Une même forme d’énergie peut être utile ou dissipée : cela dépend de ce qu’on veut faire avec l’appareil.',legende:'C’est une énergie',cats:CATS,items});
  }
  window.FICHE_CI_ENE04={
    id:'NL-CI-6E-ENE-04',version:'0.9',modele:'conversion-lampe-qualitatif-v1',
    titre:'Décrire la conversion d’énergie dans une lampe',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Distinguer l’énergie utile et l’énergie dissipée d’une lampe.',
    objectifsPedagogiques:['Dire qu’une lampe convertit de l’énergie électrique en lumière et en chaleur','Dire que l’énergie utile dépend de la fonction de l’appareil','Dire que l’énergie dissipée n’est pas détruite : elle passe dans l’air autour'],
    situationEvaluation:'Kofi dit : « la chaleur d’une lampe, c’est de l’énergie perdue, elle n’existe plus ». Que lui réponds-tu ? Où est-elle passée ?',
    objectif:'Distinguer l’énergie utile et l’énergie dissipée d’une lampe.',objectifEleve:'Savoir dire ce qui est utile et ce qui est dissipé.',
    situation:'Awa remarque qu’une lampe allumée depuis longtemps est chaude. Elle se demande pourquoi une lampe qui sert à éclairer devient chaude.',
    materiel:'Simulation : une pile, une lampe, un thermomètre simulé (niveaux qualitatifs) ; quatre situations à classer.',
    prevision:{consigne:'Avant les essais, choisis ce que donne une lampe allumée longtemps. Justifie ton hypothèse.',choix:[['lum_chal','De la lumière et de la chaleur'],['lum','De la lumière seulement'],['chal','De la chaleur seulement'],['rien','Rien de visible : seule la pile change']]},
    protocole:['Allumer la lampe 1 minute et noter la lumière et la chaleur.','Recommencer avec 10 minutes, puis 30 minutes.','Comparer les trois essais.','Classer quatre formes d’énergie en utile ou dissipée selon la fonction.'],
    variable:'La durée d’allumage',maintenu:'La pile et la lampe',
    colonnes:['Durée','Lumière','Chaleur','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(DUR,e.duree),'La lampe éclaire','Le verre est '+e.mot,e.observation||'—']).concat(M().lignesTri(st,'utile',i=>SIT.filter(s=>s[0]===i)[0][1],c=>lib(CATS,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?'classement : '+lib(CATS,e.choix).toLowerCase():lib(DUR,e.duree).toLowerCase()+' : lumière et chaleur ('+e.mot+')',
    confrontation:'1. La lampe donne-t-elle seulement de la lumière ? 2. Que devient le verre quand la durée augmente ? 3. Pour éclairer, la chaleur est-elle utile ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une durée et ce que tu as observé sur la lumière et sur la chaleur.',
    transfert:{q:'Pour éclairer une pièce, la chaleur d’une lampe est-elle de l’énergie utile ?',rep:'non',expl:'Non : pour éclairer, la lumière est utile et la chaleur est dissipée. L’énergie dissipée n’est pas détruite : elle est transférée à l’air autour. Pour chauffer des poussins, c’est la chaleur qui est utile.'},
    critere:'Dire pour une lampe ce qui est utile et ce qui est dissipé, selon la fonction.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Dit que la lampe « marche » sans parler de chaleur.'],['MF','Voit la lumière et la chaleur sans parler de fonction.'],['MS','Classe lumière et chaleur en utile ou dissipée pour éclairer.'],['TBM','Classe selon la fonction, dit que la chaleur n’est pas détruite et traite le cas de la lampe chauffante.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri);return v.length>=3&&M().distincts(v,'duree')>=3&&M().triEtat(st,'utile',SIT.map(s=>s[0])).repondus>=4;},
    aides:['Regarde le thermomètre simulé : monte-t-il avec la durée ?','Qu’est-ce qu’on veut obtenir : de la lumière ou de la chaleur ?','Une énergie dissipée n’est pas détruite : elle passe dans l’air autour.'],
    synthese:'Une lampe convertit de l’énergie électrique en lumière et en chaleur. Pour éclairer, la lumière est l’énergie utile et la chaleur est l’énergie dissipée, qui passe dans l’air autour. L’énergie utile dépend de la fonction de l’appareil.',
    prof:{reference:'Lampe : électrique → lumineuse + thermique. Pour éclairer : lumière utile, chaleur dissipée vers l’air. Pour chauffer : l’inverse. Dissipée : transférée au milieu extérieur, jamais détruite. Niveaux simulés.',attendus:['Observer que la lampe chauffe de plus en plus.','Classer lumière et chaleur selon la fonction.'],erreurs:['Dire « énergie perdue ».','Croire que la chaleur est toujours dissipée.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste les trois durées.']:['Fais un premier essai.']
  };
})();
