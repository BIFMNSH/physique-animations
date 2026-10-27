/* NohobaLab · 6e Côte d'Ivoire · ENE-03 · Décrire le transfert d'énergie d'une pile vers une lampe. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : la pile se vide, la lampe éclaire de moins en moins ; l'énergie n'a pas disparu, elle est passée de la pile à la lampe par les fils. Niveaux simulés. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const MOM=[['neuve','Pile neuve'],['soir1','Après un soir'],['soirs','Après plusieurs soirées'],['vide','Pile usée']];
  const LAMPE={forte:'éclaire bien',moyenne:'éclaire un peu moins',faible:'éclaire très peu',eteinte:'est éteinte'};
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const CATS=[['pile_lampe','De la pile vers la lampe, en passant par les fils'],['disparu','Elle a disparu'],['air','Elle est partie dans l’air, sans passer par la lampe'],['fils','Elle est restée dans les fils']];
  function manip(panel,X){
    M().bloc(panel,X,{n:3,titre:'Atelier · la pile s’use au fil des soirées',
      intro:'Je choisis le moment, je regarde le niveau de la pile et l’éclat de la lampe. Les niveaux sont simulés (dessin qualitatif, sans mesure). Puis j’écris ce que j’observe.',
      controles:[{cle:'m',legende:'Le moment',items:MOM}],
      saisie:'J’observe que la pile… et que la lampe…',legendeTable:'Mes essais : moment, état de la pile et de la lampe (valeurs simulées).',F:()=>window.FICHE_CI_ENE03,
      render:v=>{const r=NE().pileLampe(v.m),sc=NE().sceneMoment(v.m);return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (Niveaux simulés.)',essai:{moment:v.m,pile:r.pile,lampe:r.lampe,niveau:r.niveau,transfert:r.transfert}};}});
    M().tri(panel,X,{id:'ou',titre:'Où est passée l’énergie de la pile ?',intro:'La pile est usée. Choisis ce qui s’est passé.',legende:'Pour moi, l’énergie…',cats:CATS,
      items:[{id:'bilan',label:'La pile de la lampe de poche de Kofi est usée. Où est passée son énergie ?',juste:'pile_lampe',pourquoi:'L’énergie n’a pas disparu : elle a quitté la pile, elle est passée par les fils et elle est arrivée à la lampe.',aide:'Regarde le sens de la flèche « énergie électrique » sur le dessin : de quoi vers quoi ?',
        retour:{disparu:'Non : l’énergie ne disparaît pas. Regarde la flèche sur le dessin : elle va de la pile vers la lampe.',air:'Pas tout à fait : une partie finira dans l’air, mais c’est après être passée par la lampe (voir la fiche sur la lampe qui chauffe). La pile donne d’abord son énergie à la lampe.',fils:'Non : les fils laissent passer l’énergie, ils ne la gardent pas. Elle arrive à la lampe.'}}]});
  }
  window.FICHE_CI_ENE03={
    id:'NL-CI-6E-ENE-03',version:'0.9',modele:'transfert-pile-lampe-qualitatif-v1',
    titre:'Décrire le transfert d’énergie d’une pile vers une lampe',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Dire d’où vient l’énergie, où elle va et par où elle passe dans un circuit.',
    objectifsPedagogiques:['Dire que l’énergie vient de la pile','Dire que les fils transportent l’énergie jusqu’à la lampe','Dire que l’énergie d’une pile usée n’a pas disparu : elle est passée à la lampe'],
    situationEvaluation:'Awa dit : « quand la pile est usée, l’énergie a disparu ». Que lui réponds-tu ? Dessine le chemin de l’énergie.',
    objectif:'Décrire le chemin de l’énergie dans un circuit pile–lampe.',objectifEleve:'Savoir dire d’où vient l’énergie, où elle va et par où elle passe.',
    situation:'Après plusieurs soirées, la lampe de poche de Kofi éclaire de moins en moins, puis plus du tout. Sa pile est usée. Kofi se demande où est passée l’énergie.',
    materiel:'Simulation : une pile, une lampe, des fils ; niveaux simulés à quatre moments.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à l’énergie de la pile. Justifie ton hypothèse.',choix:[['passe','Elle passe de la pile à la lampe par les fils'],['disparu','Elle disparaît quand la pile s’use'],['air','Elle s’échappe dans l’air sans passer par la lampe'],['fils','Elle reste dans les fils']]},
    protocole:['Observer la pile neuve et la lampe.','Observer la pile après un soir, puis après plusieurs soirées.','Observer la pile usée.','Noter l’état de la pile et celui de la lampe à chaque moment.'],
    variable:'Le moment (le temps de fonctionnement)',maintenu:'La pile, la lampe, les fils',
    colonnes:['Moment','Pile','Lampe','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(MOM,e.moment),e.pile,LAMPE[e.lampe],e.observation||'—']).concat(M().lignesTri(st,'ou',()=>'Où est passée l’énergie ?',c=>lib(CATS,c)).map(r=>[r[0],'Bilan',r[1],r[2]])),
    resume:e=>e.tri?'bilan : '+lib(CATS,e.choix).toLowerCase():lib(MOM,e.moment).toLowerCase()+' : pile '+e.pile+', lampe '+LAMPE[e.lampe],
    confrontation:'1. Que devient le niveau de la pile quand la lampe éclaire ? 2. Que devient l’éclat de la lampe ? 3. Où l’énergie de la pile est-elle passée ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux moments et décris l’état de la pile et de la lampe.',
    transfert:{q:'Quand la pile est vide, l’énergie qu’elle contenait a-t-elle disparu ?',rep:'non',expl:'Non : elle est passée de la pile à la lampe par les fils (puis elle est allée dans la lumière et dans l’air autour de la lampe). L’énergie ne disparaît pas : elle passe d’un endroit à un autre.'},
    critere:'Décrire le chemin de l’énergie en citant deux moments du fonctionnement.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Dit que la pile est usée sans parler d’énergie.'],['MF','Dit que l’énergie « sort » de la pile sans dire où elle va.'],['MS','Décrit : de la pile, par les fils, vers la lampe.'],['TBM','Décrit le chemin, dit que l’énergie ne disparaît pas et l’applique à une autre pile.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri);return v.length>=3&&M().distincts(v,'moment')>=3&&M().triEtat(st,'ou',['bilan']).repondus>=1;},
    aides:['Compare le niveau de la pile au début et à la fin.','Regarde la flèche « énergie électrique » : elle montre le sens du transfert.','L’énergie ne disparaît pas : elle passe d’un endroit à un autre.'],
    synthese:'Dans un circuit, l’énergie vient de la pile, passe par les fils et arrive à la lampe. Quand la pile est usée, son énergie n’a pas disparu : elle est passée à la lampe.',
    prof:{reference:'Transfert d’énergie électrique de la pile vers la lampe par les fils ; la pile se vide, la lampe éclaire moins puis plus. Niveaux simulés, qualitatifs.',attendus:['Observer que la pile se vide quand la lampe éclaire.','Dire que l’énergie est passée de la pile à la lampe.'],erreurs:['Dire que l’énergie a disparu.','Dire que les fils gardent l’énergie.']},
    diagnostic:st=>st.essais.length?['Indicatif : observe au moins trois moments différents.']:['Fais un premier essai.']
  };
})();
