/* NohobaLab · 6e Côte d'Ivoire · MES-06 · Expliquer le principe de la simple pesée.
   Balance de Roberval réglée : le plateau le plus chargé descend ; équilibre (aiguille sur le repère) quand les deux plateaux portent la même masse.
   Équilibre qualitatif ; boîte de masses de 1 g à 200 g ; masses prises à la pince ; aucun liquide versé sur un plateau. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>String(x[0])===String(k))[0]||['',k])[1];
  const G=[['vide','Plateau de gauche vide'],['objet100','Une boîte de 100 g à gauche']];
  const DR=[['0','Aucune masse à droite'],['20','20 g à droite'],['50','50 g à droite'],['100','100 g à droite'],['200','200 g à droite']];
  const LETTRES=[['socle','A'],['fleau','B'],['plateau','C'],['aiguille','D'],['repere','E']];
  const REGLES=[
    {id:'avant',q:'Avant de peser, l’aiguille doit être…',juste:'repere',options:[['repere','sur le repère, plateaux vides'],['gauche','penchée à gauche'],['importe','n’importe où']],pourquoi:'On vérifie d’abord l’équilibre à vide : sinon toutes les pesées sont fausses.'},
    {id:'pince',q:'Les masses marquées se prennent…',juste:'pince',options:[['pince','avec la pince'],['doigts','avec les doigts'],['verser','en les versant de la boîte']],pourquoi:'La pince évite de salir et d’abîmer les masses marquées, ce qui fausserait leur masse.'},
    {id:'ordre',q:'Pour équilibrer, on pose d’abord…',juste:'grande',options:[['grande','la plus grande masse qui convient'],['petite','la plus petite masse'],['hasard','une masse au hasard']],pourquoi:'On procède par masses décroissantes : de la plus grande à la plus petite.'}
  ];
  function manip(panel,X){
    const h=Activite.h,fig=h('div',{class:'card'},panel);
    h('h3',{text:'La balance de Roberval et ses parties'},fig);h('div',{style:'max-width:520px'},fig,Q().scene.robervalLettres());
    M().tri(panel,X,{id:'mes06parties',titre:'Je nomme les parties de la balance',intro:'Sur le schéma, les lettres A à E marquent cinq parties. Je choisis le nom de chacune.',legende:'C’est',cats:Q().dessin.PARTIES_ROBERVAL,
      items:LETTRES.map(l=>({id:l[0],label:'Partie '+l[1],juste:l[0],pourquoi:{socle:'Le socle porte toute la balance.',fleau:'Le fléau est la barre qui bascule autour de son axe.',plateau:'Les plateaux restent horizontaux ; on y pose l’objet et les masses marquées.',aiguille:'L’aiguille est fixée au fléau : elle penche avec lui.',repere:'Le repère est le zéro du cadran : aiguille sur le repère = équilibre.'}[l[0]],aide:'Le fléau bascule ; l’aiguille est solidaire du fléau ; le repère ne bouge pas.'}))});
    M().bloc(panel,X,{n:206,titre:'Atelier · quel plateau descend ?',
      intro:'Je charge les plateaux et j’observe le fléau et l’aiguille. Je commence par la balance à vide.',
      controles:[{cle:'g',legende:'Plateau de gauche',items:G},{cle:'d',legende:'Plateau de droite',items:DR}],
      saisie:'J’observe que le plateau … descend et que l’aiguille…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES06,
      render:v=>{const e=Q().equilibre(Q().charge(v.g).m,Number(v.d)),sc=Q().scene.principe(v);return {montage:sc.montage,schema:sc.schema,txt:e.txt,essai:{g:v.g,d:Number(v.d),penche:e.penche,equilibre:e.equilibre}};}});
    M().tri(panel,X,{id:'mes06regles',titre:'Les règles d’une bonne pesée',intro:'Je complète chaque règle.',legende:'Je choisis',cats:[['x','x']],
      items:REGLES.map((r,k)=>({id:r.id,label:r.q,options:Q().place(r.options,r.juste,k+1),juste:r.juste,pourquoi:r.pourquoi,aide:'Pense à la précision et au soin du matériel.'}))});
  }
  window.FICHE_CI_MES06={
    id:'NL-CI-6E-MES-06',version:'0.9',modele:'roberval-principe-v1',
    titre:'Expliquer le principe de la simple pesée',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Expliquer le principe de la simple pesée avec une balance à plateaux.',
    objectifsPedagogiques:['Nommer les parties de la balance de Roberval (socle, fléau, plateaux, aiguille, repère) et la boîte de masses marquées','Dire qu’à l’équilibre la masse de l’objet est égale à la somme des masses marquées posées sur l’autre plateau','Vérifier l’équilibre à vide (aiguille sur le repère)','Choisir les masses marquées dans l’ordre décroissant'],
    situationEvaluation:'Le grand-père de Yao a une vieille balance à plateaux sans écran. Explique à Yao comment elle permet de trouver la masse d’un sachet d’arachides, et ce qu’il doit vérifier avant de commencer.',
    objectif:'Expliquer comment une balance à plateaux mesure une masse.',objectifEleve:'Savoir expliquer le principe de la simple pesée.',
    situation:'En classe, Kofi découvre une balance de Roberval : elle n’a pas d’écran. Comment une balance sans écran peut-elle « donner » une masse ?',
    materiel:'Simulation : une balance de Roberval, une boîte de 100 g, une boîte de masses marquées (1 g à 200 g) et sa pince.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand on pose un objet sur le plateau de gauche seulement. Justifie ton hypothèse.',choix:[['droite','Le plateau de droite descend'],['rien','Rien ne bouge'],['gauche','Le plateau de gauche descend'],['deux','Les deux plateaux descendent']]},
    protocole:['Nommer les parties de la balance.','Vérifier l’équilibre à vide : aiguille sur le repère.','Poser la boîte à gauche et observer.','Poser des masses marquées à droite avec la pince, jusqu’à l’équilibre.','Énoncer le principe.'],
    variable:'Les charges posées sur les plateaux',maintenu:'La même balance, réglée',
    colonnes:['Plateau de gauche','Plateau de droite','Mon observation ou résultat'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(G,e.g),lib(DR,e.d),e.observation||'—']).concat(M().lignesTri(st,'mes06parties',i=>'Partie '+(LETTRES.filter(l=>l[0]===i)[0]||['',i])[1],c=>lib(Q().dessin.PARTIES_ROBERVAL,c))).concat(Q().lignesTri(st,'mes06regles',REGLES)),
    resume:e=>e.tri?(e.tri==='mes06parties'?'partie':'règle')+' '+(e.juste?'juste':'à revoir'):lib(G,e.g).toLowerCase()+', '+e.d+' g à droite : '+(e.equilibre?'équilibre':'le plateau '+(e.penche==='gauche'?'de gauche':'de droite')+' descend'),
    confrontation:'1. Quel plateau descend ? 2. Quand l’aiguille est-elle sur le repère ? 3. Que vaut alors la masse de l’objet ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai à l’équilibre : ce qu’il y a sur chaque plateau.',
    transfert:{q:'Une trousse est sur un plateau ; à l’équilibre, l’autre plateau porte 100 g, 50 g et 20 g. Quelle est la masse de la trousse ?',type:'nombre',unite:'g',rep:170,tol:0,expl:'À l’équilibre, la masse de l’objet est égale à la somme des masses marquées : 100 + 50 + 20 = 170 g.'},
    critere:'Nommer les parties, constater qu’à l’équilibre les deux plateaux portent la même masse et énoncer le principe.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas le plateau qui descend à la charge.'],['MF','Dit que le plateau le plus chargé descend sans parler d’équilibre.'],['MS','Énonce le principe de la simple pesée.'],['TBM','Énonce le principe, l’équilibre à vide et la méthode des masses décroissantes.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri);return v.some(e=>e.g==='vide'&&e.d===0)&&v.some(e=>e.penche==='gauche')&&v.some(e=>e.penche==='droite')&&v.some(e=>e.g==='objet100'&&e.equilibre)&&M().triEtat(st,'mes06parties',LETTRES.map(l=>l[0])).repondus>=5;},
    aides:['Commence par la balance à vide : où est l’aiguille ?','Le plateau qui porte la charge la plus lourde descend.','À l’équilibre, les deux plateaux portent la même masse.'],
    synthese:'La balance de Roberval compare deux masses : le plateau le plus chargé descend. Avant de peser, on vérifie l’équilibre à vide (aiguille sur le repère). Simple pesée : on pose l’objet sur un plateau et des masses marquées sur l’autre, prises à la pince et de la plus grande à la plus petite, jusqu’à l’équilibre. Alors la masse de l’objet est égale à la somme des masses marquées.',
    prof:{reference:'A socle, B fléau, C plateau, D aiguille, E repère ; équilibre pour 100 g face à 100 g ; 170 g pour la trousse.',attendus:['Nommer les parties.','Vérifier l’équilibre à vide.','Énoncer le principe de la simple pesée.'],erreurs:['Croire que le plateau qui monte est le plus lourd.','Prendre les masses avec les doigts.','Poser un liquide directement sur un plateau.']},
    diagnostic:st=>st.essais.length?['Indicatif : essaie la balance à vide, un plateau plus chargé de chaque côté, puis l’équilibre.']:['Nomme une première partie.']
  };
})();
