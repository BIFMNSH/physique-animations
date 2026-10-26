/* NohobaLab · 6e Côte d'Ivoire · MAT-06 · Associer chaque pictogramme de danger à son danger et à la conduite à tenir.
   Six questions : (1) pictogramme → danger, (2) lire l’étiquette de quatre produits, (3) l’évier, (4) équipements de protection pour la soude en pastilles,
   (5) pictogramme → conduite à tenir, (6) où jeter un produit usagé (tri des déchets, score sur 5). Pictogrammes redessinés (jamais reproduits d’un manuel).
   Aucun produit réel n’est manipulé par l’élève ; la recherche à la maison est une observation d’emballages. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const NOMS=()=>M().PICTOS.map(p=>[p.id,p.nom]);
  const ORDRE=['corrosif','gaz','toxique','irritant','inflammable','environnement','explosif','sante','comburant'];
  const QTITRE={q1:'Q1 · Pictogramme et danger',q2:'Q2 · Étiquettes',q3:'Q3 · Évier',q4:'Q4 · Protection',q5:'Q5 · Conduite à tenir',dechets:'Q6 · Déchets'};
  const CONDUITES=[['explosif','Le tenir loin de la chaleur, des chocs et des flammes'],['inflammable','Le tenir loin des flammes et des étincelles'],['gaz','Ne pas le chauffer, ne pas le jeter au feu, le garder au frais'],['corrosif','Mettre gants et lunettes ; en cas de contact, rincer à l’eau et prévenir un adulte']];
  const EVIER=[['oui','Oui, je peux le verser dans l’évier'],['non','Non, jamais dans l’évier']];
  const pn=id=>(M().PICTOS.filter(p=>p.id===id)[0]||{nom:id}).nom;
  const prod=id=>(M().PRODUITS.filter(p=>p.id===id)[0]||{nom:id}).nom;
  const epiN=id=>(M().EPI.filter(p=>p.id===id)[0]||{nom:id}).nom;
  const dest=id=>(M().DESTINATIONS.filter(p=>p[0]===id)[0]||[id,id])[1];
  const dech=id=>(M().DECHETS.filter(p=>p.id===id)[0]||{nom:id}).nom;
  const multi=(v,f)=>String(v).split(',').map(f).join(', ');
  const LIB={ /* libellés de la table des essais : fonctionnent même sans que la manipulation ait été affichée */
    q1:{item:i=>'Pictogramme « '+pn(i)+' »',rep:v=>pn(v)},
    q2:{item:i=>prod(i),rep:v=>multi(v,pn)},
    q3:{item:i=>prod(i),rep:v=>(EVIER.filter(x=>x[0]===v)[0]||['',v])[1]},
    q4:{item:()=>'Pastilles de soude',rep:v=>multi(v,epiN)},
    q5:{item:i=>'Pictogramme « '+pn(i)+' »',rep:v=>(CONDUITES.filter(x=>x[0]===v)[0]||['',v])[1]},
    dechets:{item:dech,rep:dest}
  };
  const IDS=['q1','q2','q3','q4','q5','dechets'];
  function manip(panel,X){
    const m=M(),h=window.Activite.h;
    h('p',{class:'msg',role:'note'},panel,'<b>Sécurité.</b> Tout ce travail se fait sur écran. Les étiquettes sont fictives. Je ne touche à aucun produit : je lis, je classe, je protège.');
    m.planche(panel);
    const qs=[];
    function refresh(){qs.forEach((q,i)=>{q.box.hidden=i>0&&!(qs[i-1].api&&qs[i-1].api.repondus()>=qs[i-1].api.total);});if(fin&&qs[5]&&qs[5].api)fin.hidden=!(qs[5].api.repondus()>=qs[5].api.total);}
    let fin=null;
    function ajoute(fn){const box=h('div',{},panel),q={box:box,api:null};qs.push(q);q.api=fn(box,refresh);}
    /* Q1 · neuf pictogrammes → danger */
    ajoute((box,cb)=>m.tri(box,X,{id:'q1',titre:'Question 1 · Quel danger signale chaque pictogramme ?',intro:'Je choisis, pour chaque pictogramme, son nom. Je lis la description du dessin.',legende:'Ce pictogramme signale',cats:NOMS(),
      items:ORDRE.map((id,i)=>{const p=m.PICTOS.filter(x=>x.id===id)[0];return {id:id,label:'Pictogramme n° '+(i+1),svg:m.dessin.pictoSvg(id),juste:id,pourquoi:p.nom+' : '+p.danger+' Conduite : '+p.conduite,aide:'Regarde le dessin noir dans le losange rouge : une flamme, une bombe, un crâne, un arbre et un poisson…'};}),onChange:cb}));
    /* Q2 · lire l'étiquette de quatre produits */
    ajoute((box,cb)=>m.tri(box,X,{id:'q2',titre:'Question 2 · Je lis l’étiquette de quatre produits',intro:'Pour chaque produit, je coche tous les pictogrammes que je vois sur son étiquette (fictive).',legende:'Je vois',multi:true,cats:NOMS(),
      items:m.PRODUITS.map(p=>({id:p.id,label:p.nom,svg:m.scene.produit(p.id),juste:p.pictos,pourquoi:p.txt,aide:'Un produit peut porter plusieurs pictogrammes. Regarde chaque petit losange de l’étiquette.'})),onChange:cb}));
    /* Q3 · l'évier */
    ajoute((box,cb)=>m.tri(box,X,{id:'q3',titre:'Question 3 · Peut-on le verser dans l’évier ?',intro:'Le produit anti-moustiques et le sulfate de cuivre portent chacun un pictogramme qui interdit l’évier.',vigilance:'Un produit dangereux ne se verse ni dans l’évier, ni dans le caniveau, ni dans la nature. Un adulte ou le professeur s’en occupe.',legende:'Je réponds',cats:EVIER,
      items:['antimoustiques','sulfate'].map(id=>({id:id,label:prod(id),svg:m.scene.produit(id),juste:m.evierInterdit(id)?'non':'oui',pourquoi:'Le pictogramme « arbre et poisson » signale un danger pour l’environnement : le produit pollue l’eau et la nature. On le garde pour le professeur ou on le confie à une collecte adaptée.',aide:'Cherche le pictogramme « arbre et poisson » sur l’étiquette.'})),onChange:cb}));
    /* Q4 · équipements pour la soude */
    ajoute((box,cb)=>m.tri(box,X,{id:'q4',titre:'Question 4 · Comment se protéger avec des pastilles de soude ?',intro:'Les équipements de protection sont des symboles bleus : ils ne sont pas des pictogrammes de danger. Je coche ceux qu’il faut porter.',legende:'Je porte',multi:true,cats:m.EPI.map(e=>[e.id,e.nom]),
      items:[{id:'soude',label:'Pastilles de soude (corrosives), manipulées par le professeur',svg:m.scene.produit('soude'),juste:m.EPI_SOUDE.slice(),pourquoi:'La soude est corrosive : la blouse, les lunettes et les gants protègent la peau et les yeux ; le masque limite la poussière qu’on pourrait respirer. L’élève ne manipule pas le produit.',aide:'Pense à la peau, aux yeux, aux mains et à ce qu’on peut respirer.'}],onChange:cb}));
    /* Q5 · pictogramme → conduite */
    ajoute((box,cb)=>m.tri(box,X,{id:'q5',titre:'Question 5 · Que faire quand je vois ce pictogramme ?',intro:'Je relie chaque pictogramme à la conduite à tenir.',legende:'Je dois',cats:CONDUITES,
      items:CONDUITES.map((c,i)=>{const p=m.PICTOS.filter(x=>x.id===c[0])[0];return {id:c[0],label:'Pictogramme « '+p.nom+' »',svg:m.dessin.pictoSvg(c[0]),juste:c[0],pourquoi:p.danger+' '+p.conduite,aide:'Pense au danger : flamme, explosion, chaleur, ronge la peau.'};}),onChange:cb}));
    /* Q6 · où jeter un produit usagé */
    ajoute((box,cb)=>m.dechets(box,X,{onChange:cb}));
    /* synthèse, jeu de paires, carnet d'observation à la maison */
    fin=h('div',{hidden:''},panel);
    const tr=h('div',{class:'card'},fin);h('h3',{text:'Ma trace'},tr);
    h('p',{},tr,'Je peux imprimer mes six séries de réponses avec les explications et mon score au tri des déchets.');
    h('button',{type:'button',class:'btn primary',text:'Imprimer ma trace complète'},tr).onclick=function(){m.imprimer('Sécurité en chimie : ma trace',m.traceHTML(IDS,X.st()));};
    m.paires(fin);m.carnetMaison(fin);
    refresh();
  }
  window.FICHE_CI_MAT06={
    id:'NL-CI-6E-MAT-06',version:'0.9',modele:'pictogrammes-sgh-association-v1',
    titre:'Associer chaque pictogramme de danger à son danger et à la conduite à tenir',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Associer un pictogramme de danger à son danger et à la conduite à tenir.',
    objectifsPedagogiques:['Reconnaître les neuf pictogrammes de danger','Lire l’étiquette d’un produit et en tirer les précautions','Citer les équipements de protection à porter et dire où jeter un produit usagé'],
    situationEvaluation:'Dans la cour de l’école, un élève trouve un flacon vide d’insecticide portant le pictogramme « arbre et poisson ». Il veut le rincer au caniveau. Que lui dis-tu ? Cite le pictogramme, le danger et ce qu’il faut faire du flacon.',
    objectif:'Reconnaître les pictogrammes, leurs dangers et les bons gestes.',objectifEleve:'Savoir lire une étiquette et me protéger.',
    situation:'Awa et Kofi trouvent un désodorisant en aérosol, un produit anti-moustiques et deux flacons de laboratoire. Sur chaque étiquette, de petits losanges à bord rouge : que signifient-ils ? Que faut-il faire, et ne pas faire, avec ces produits ?',
    materiel:'Écran : neuf pictogrammes de danger redessinés, quatre équipements de protection, quatre étiquettes fictives, cinq déchets à trier. Aucun produit réel.',
    prevision:{consigne:'Avant les questions, choisis ce que signifie un losange à bord rouge sur une étiquette. Justifie ton hypothèse.',choix:[['danger','Il signale un danger précis et dit comment me protéger'],['pub','C’est un dessin de publicité sans importance'],['pays','Il indique le pays où le produit est fabriqué'],['qualite','Il indique que le produit est de très bonne qualité']]},
    protocole:['Associer chaque pictogramme à son danger (question 1).','Lire l’étiquette de quatre produits (question 2) et décider pour l’évier (question 3).','Choisir les équipements pour la soude (question 4) et la conduite à tenir (question 5).','Trier cinq déchets (question 6), puis réviser avec le jeu de paires.'],
    variable:'La question et la réponse choisie',maintenu:'Les pictogrammes, qui ne changent pas',
    colonnes:['Question','Situation','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>st.essais.filter(e=>LIB[e.tri]).map(e=>[QTITRE[e.tri],LIB[e.tri].item(e.item),LIB[e.tri].rep(e.choix),e.juste?'Juste':'À revoir']),
    resume:e=>LIB[e.tri]?QTITRE[e.tri]+' : '+LIB[e.tri].item(e.item).toLowerCase()+' → '+LIB[e.tri].rep(e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):'',
    confrontation:'1. Quels pictogrammes as-tu reconnus du premier coup ? 2. Lesquels as-tu confondus (tête de mort et point d’exclamation) ? 3. Quel déchet ne doit jamais aller à la poubelle ordinaire ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un pictogramme, le danger qu’il signale et le geste à adopter.',
    transfert:{q:'Un flacon porte un point d’exclamation. Est-ce le même pictogramme que la tête de mort ?',rep:'non',expl:'Non : le point d’exclamation signale un produit irritant ou nocif, la tête de mort un produit toxique, parfois mortel en très petite quantité. On ne les confond pas.'},
    critere:'Reconnaître les neuf pictogrammes, citer les équipements de protection et dire où va un déchet dangereux.',
    essaisMin:24,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Reconnaît moins de quatre pictogrammes.'],['MF','Reconnaît les pictogrammes mais confond danger et conduite.'],['MS','Associe pictogramme, danger et conduite, et sait ne pas jeter un produit dangereux à l’évier.'],['TBM','Maîtrise les neuf pictogrammes, les équipements et le tri, et justifie par l’étiquette.']],
    peutConfronter:st=>{const a=M().triEtat(st,'dechets',M().DECHETS.map(d=>d.id)),b=M().triEtat(st,'q1',M().PICTOS.map(p=>p.id));return a.repondus>=5&&b.repondus>=9;},
    aides:['Un pictogramme rouge dit toujours un danger : décris d’abord le dessin noir.','Ne confonds pas tête de mort et point d’exclamation.','Un produit dangereux ne va ni à l’évier, ni dans la nature, ni avec les déchets ordinaires : un adulte le confie à une collecte adaptée.'],
    synthese:'Neuf pictogrammes à losange rouge signalent des dangers précis (explosif, inflammable, corrosif, toxique, comburant, gaz sous pression, irritant ou nocif, danger grave pour la santé, danger pour l’environnement). Je lis l’étiquette avant d’utiliser un produit, je me protège (blouse, lunettes, gants, masque selon le produit) et je ne jette jamais un produit dangereux à l’évier ni dans la nature.',
    prof:{reference:'Neuf pictogrammes distincts, quatre équipements de protection séparés ; pastilles de soude : blouse, lunettes, gants et masque (poussières) ; produit portant « arbre et poisson » : jamais à l’évier ni dans la nature ; pile et bidon de pesticide : déchets dangereux confiés par un adulte à une collecte spécialisée ; bouteille propre et canette : recyclage ; épluchures : poubelle ordinaire ou compost.',
      attendus:['Associer les neuf pictogrammes à leur danger sans inversion.','Relever les pictogrammes de quatre étiquettes et refuser l’évier pour les produits « arbre et poisson ».','Choisir blouse, lunettes, gants et masque pour la soude en pastilles.','Trier cinq déchets en justifiant, sans jamais conseiller de manipuler un déchet dangereux.'],
      erreurs:['Confondre tête de mort et point d’exclamation.','Penser qu’un contenant vide de pesticide est inoffensif ou recyclable avec les bouteilles ordinaires.','Confondre un équipement de protection (symbole bleu) avec un pictogramme de danger (losange rouge).']},
    diagnostic:st=>st.essais.length?['Indicatif : refais les questions où tu as eu « À revoir ».']:['Commence par la question 1.']
  };
})();
