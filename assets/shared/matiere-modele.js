/* NohobaLab · 6e Côte d'Ivoire · modèles qualitatifs du thème « Propriétés physiques de la matière » (lot Matière).
   Fonctions pures, sans dessin, testées par qa/lot-ci-matiere.cjs. Les valeurs chiffrées sont des illustrations signalées comme simulées,
   sauf les repères du programme : 0 °C (glace fondante, solidification), environ 100 °C (ébullition au niveau de la mer), environ 37 °C (corps humain). */
(function(){
  'use strict';
  var M={};

  /* ---------- Solides et liquides ---------- */
  M.OBJETS={
    caillou:{nom:'un caillou',court:'Caillou',type:'compact'},
    bois:{nom:'un bloc de bois',court:'Bloc de bois',type:'compact'},
    gomme:{nom:'une gomme',court:'Gomme',type:'compact'},
    clou:{nom:'un clou',court:'Clou',type:'compact'},
    sel:{nom:'du sel fin',court:'Sel',type:'divisé'},
    sable:{nom:'du sable sec',court:'Sable sec',type:'divisé'},
    farine:{nom:'de la farine',court:'Farine',type:'divisé'},
    riz:{nom:'du riz',court:'Riz',type:'divisé'}
  };
  M.RECIPIENTS={
    cristallisoir:{nom:'un cristallisoir',court:'Cristallisoir'},
    tube:{nom:'un tube à essai',court:'Tube à essai'},
    ballon:{nom:'un ballon à fond plat',court:'Ballon à fond plat'},
    flacon:{nom:'un flacon',court:'Flacon'},
    becher:{nom:'un bécher',court:'Bécher'},
    verre:{nom:'un verre',court:'Verre'},
    bocal:{nom:'un bocal',court:'Bocal'}
  };
  /* un solide compact garde sa forme propre : il ne coule pas, quel que soit le récipient ou l'inclinaison */
  M.solide=function(obj,rec,action){
    var o=M.OBJETS[obj];if(!o||o.type!=='compact')throw new Error('solide compact attendu');
    return {forme:'propre',formeIdentique:true,coule:false,epouseRecipient:false,
      txt:cap(o.nom)+' garde sa forme dans '+M.RECIPIENTS[rec].nom+(action==='verser'?' : on essaie de le verser, il ne coule pas, il reste d’un seul bloc.':action==='incliner'?' : on incline le récipient, l’objet reste le même (il peut glisser, mais sa forme ne change pas).':' : posé, il garde la forme qu’il avait dehors.')};
  };
  /* un liquide au repos : forme du récipient, il coule, surface libre plane et horizontale même si le récipient penche */
  M.liquide=function(liq,rec,incline){
    return {forme:'récipient',coule:true,epouseRecipient:true,surface:'plane et horizontale',surfaceHorizontaleSiIncline:true,
      txt:'Le liquide ('+(liq==='huile'?'huile':'eau colorée')+') prend la forme de '+M.RECIPIENTS[rec].nom+' ; sa surface libre est plane et horizontale'+(incline?', même quand le récipient est incliné.':'.')};
  };
  M.liquides=['eau','huile'];
  /* comportement d'un solide divisé : tas, grains qui gardent leur forme */
  M.divise=function(obj,action){
    var o=M.OBJETS[obj];if(!o||o.type!=='divisé')throw new Error('solide divisé attendu');
    var t={verser:'Les grains glissent les uns sur les autres : ils s’écoulent et forment un tas.',pincee:'On prend une pincée : on distingue des grains séparés.',loupe:'À la loupe virtuelle (grossissement qualitatif, sans échelle), chaque grain a sa forme propre.',ecraser:'On écrase : on obtient des grains plus petits, mais chacun garde une forme.'};
    return {grainsVisibles:true,chaqueGrainGardeForme:true,forme:'tas',txt:cap(o.nom)+' : '+t[action]};
  };
  /* classement compact / divisé : verser, loupe virtuelle */
  M.examiner=function(obj,action){
    var o=M.OBJETS[obj];if(!o)throw new Error('objet inconnu');
    if(o.type==='compact')return {type:'compact',grains:false,txt:cap(o.nom)+' : '+(action==='verser'?'il ne s’écoule pas, il reste d’un seul bloc.':'à la loupe virtuelle (grossissement qualitatif), on voit un seul morceau, sans grains séparés.')};
    var d=M.divise(obj,action==='verser'?'verser':'loupe');return {type:'divisé',grains:true,txt:d.txt};
  };
  /* surface libre : pour distinguer solide divisé et liquide */
  M.surfaceLibre=function(matiere,etat){
    if(matiere==='eau')return {surface:'plane et horizontale',horizontale:true,tas:false,grains:false,txt:'La surface de l’eau est plane et horizontale'+(etat==='incline'?', même dans le récipient incliné.':'.')};
    if(matiere==='sable')return {surface:'en tas, avec une pente',horizontale:false,tas:true,grains:true,txt:'Le sable forme un tas avec une pente : sa surface n’est pas horizontale, et les grains restent visibles.'};
    throw new Error('matière inconnue');
  };

  /* ---------- Verrerie ---------- */
  M.VERRERIE=[
    {id:'cristallisoir',nom:'cristallisoir',usage:'cuve large et peu profonde : cuve à eau pour recueillir ou observer sous l’eau.'},
    {id:'tube',nom:'tube à essai',usage:'petit tube fermé en bas : on y met une petite quantité de liquide à observer ou à chauffer avec précaution.'},
    {id:'ballon',nom:'ballon à fond plat',usage:'ballon en verre résistant à la chaleur (pyrex) qui tient debout : on peut y chauffer un liquide sur un support stable.'},
    {id:'flacon',nom:'flacon',usage:'récipient à col étroit et à bouchon : il sert à conserver un liquide.'},
    {id:'becher',nom:'bécher',usage:'récipient droit : on y prépare, on y verse, on y mélange. Il n’est pas gradué pour mesurer précisément.'},
    {id:'verre',nom:'verre',usage:'récipient du quotidien, évasé, utilisé pour verser ou renverser dans l’eau.'},
    {id:'bocal',nom:'bocal',usage:'récipient large à grande ouverture : on y conserve ou on y recueille.'}
  ];
  M.SITUATIONS_VERRERIE=[
    {id:'chauffer',txt:'Je dois chauffer de l’eau avec le professeur sur un support stable.',juste:'ballon',pourquoi:'Le ballon à fond plat est en verre résistant à la chaleur (pyrex) et tient debout.'},
    {id:'conserver',txt:'Je dois conserver un liquide pendant plusieurs jours, fermé.',juste:'flacon',pourquoi:'Le flacon se ferme avec un bouchon : le liquide ne s’évapore pas et ne se renverse pas.'},
    {id:'cuve',txt:'Je dois préparer une cuve à eau pour recueillir un gaz sous l’eau.',juste:'cristallisoir',pourquoi:'Le cristallisoir est large et peu profond : il reçoit les tubes et les bocaux renversés.'}
  ];

  /* ---------- Pictogrammes de danger (neuf) et équipements de protection (quatre, rubrique distincte) ---------- */
  M.PICTOS=[
    {n:1,id:'explosif',nom:'Explosif',alt:'Losange rouge, bombe qui éclate',danger:'Peut exploser.',conduite:'Tenir loin de la chaleur, des chocs et des flammes.',source:'Explosif'},
    {n:2,id:'inflammable',nom:'Inflammable',alt:'Losange rouge, flamme',danger:'Peut s’enflammer.',conduite:'Tenir loin des flammes et des étincelles.',source:'Inflammable'},
    {n:3,id:'corrosif',nom:'Corrosif',alt:'Losange rouge, liquide qui ronge une main et une surface',danger:'Ronge la peau, les yeux et certains matériaux.',conduite:'Gants et lunettes ; en cas de contact, rincer à l’eau et prévenir un adulte.',source:'Corrosif'},
    {n:4,id:'toxique',nom:'Toxique (danger mortel)',alt:'Losange rouge, tête de mort et os croisés',danger:'Empoisonne, parfois en très petite quantité.',conduite:'Ne pas respirer, avaler ni toucher ; manipuler seulement avec le professeur.',source:'Très toxique'},
    {n:5,id:'comburant',nom:'Comburant',alt:'Losange rouge, flamme au-dessus d’un cercle',danger:'Aggrave un incendie.',conduite:'Éloigner des produits inflammables.',source:'Comburant'},
    {n:6,id:'gaz',nom:'Gaz sous pression',alt:'Losange rouge, bouteille de gaz',danger:'Peut éclater sous la chaleur.',conduite:'Ne pas chauffer, ne pas jeter au feu, garder au frais.',source:'Sous pression'},
    {n:7,id:'irritant',nom:'Irritant ou nocif',alt:'Losange rouge, point d’exclamation',danger:'Irrite la peau, les yeux ou les voies respiratoires ; nocif en cas d’usage imprudent.',conduite:'Éviter le contact ; ne pas confondre avec la tête de mort.',source:'Toxique, nocif, irritant'},
    {n:8,id:'sante',nom:'Danger grave pour la santé',alt:'Losange rouge, silhouette avec une étoile dans le torse',danger:'Effets graves à long terme (cancer et autres atteintes).',conduite:'Ne pas respirer ni toucher ; produit réservé au professeur.',source:'Cancérogène'},
    {n:9,id:'environnement',nom:'Danger pour l’environnement',alt:'Losange rouge, arbre et poisson',danger:'Pollue l’eau et la nature.',conduite:'Jamais à l’évier ni dans la nature ; point de collecte.',source:'Polluant'}
  ];
  M.EPI=[
    {id:'blouse',nom:'Blouse',alt:'Symbole bleu d’obligation : blouse',role:'Protège les vêtements et la peau des projections.'},
    {id:'lunettes',nom:'Lunettes de protection',alt:'Symbole bleu d’obligation : lunettes',role:'Protègent les yeux des projections et des poussières.'},
    {id:'masque',nom:'Masque',alt:'Symbole bleu d’obligation : masque',role:'Limite l’inhalation des poussières et des vapeurs.'},
    {id:'gants',nom:'Gants',alt:'Symbole bleu d’obligation : gants',role:'Protègent les mains du contact avec le produit.'}
  ];
  /* étiquettes d'illustration, fictives : les produits réels ne sont jamais manipulés par l'élève */
  M.PRODUITS=[
    {id:'desodorisant',nom:'Désodorisant en aérosol',pictos:['inflammable','gaz'],usage:'Se vaporise dans l’air d’une pièce.',txt:'Étiquette (fictive) : flamme et bouteille de gaz. Tenir loin des flammes, ne pas percer, ne pas chauffer.'},
    {id:'antimoustiques',nom:'Produit anti-moustiques',pictos:['inflammable','irritant','environnement'],usage:'Se vaporise contre les insectes.',txt:'Étiquette (fictive) : flamme, point d’exclamation, arbre et poisson. Ne pas respirer le nuage, ne pas vider dans l’évier ni dans la nature.'},
    {id:'sulfate',nom:'Sulfate de cuivre (flacon de laboratoire)',pictos:['irritant','environnement'],usage:'Poudre bleue de laboratoire, manipulée par le professeur.',txt:'Étiquette (fictive) : point d’exclamation, arbre et poisson. Éviter le contact, ne jamais le verser dans l’évier.'},
    {id:'soude',nom:'Soude en pastilles (flacon de laboratoire)',pictos:['corrosif'],usage:'Pastilles de laboratoire, manipulées par le professeur.',txt:'Étiquette (fictive) : liquide qui ronge. Gants, lunettes et blouse ; poussières : masque. Ne jamais toucher à mains nues.'}
  ];
  /* règle d'évier : un produit portant le pictogramme « environnement » n'est jamais versé à l'évier */
  M.evierInterdit=function(idProduit){var p=M.PRODUITS.filter(function(x){return x.id===idProduit;})[0];return !!p&&p.pictos.indexOf('environnement')>=0;};
  /* équipements pour les pastilles de soude : blouse, lunettes, gants et (décision du 25 octobre 2026) masque */
  M.EPI_SOUDE=['blouse','lunettes','masque','gants'];
  M.epiSoude=function(choisis){var ok=M.EPI_SOUDE.slice().sort().join(),c=(choisis||[]).slice().sort().join();return {complet:ok===c,manquants:M.EPI_SOUDE.filter(function(x){return (choisis||[]).indexOf(x)<0;}),enTrop:(choisis||[]).filter(function(x){return M.EPI_SOUDE.indexOf(x)<0;})};};

  /* ---------- Tri des déchets (MAT-06, question 6) ---------- */
  M.DESTINATIONS=[['ordinaire','Poubelle ordinaire'],['recyclage','Recyclage'],['specialisee','Collecte spécialisée']];
  M.DECHETS=[
    {id:'pile',nom:'Une pile usagée',juste:'specialisee',danger:true,
      aide:'Cherche si un déchet contient des métaux ou des produits qui polluent : peut-il aller avec les ordures de la cuisine ?',
      retour:{
        ordinaire:'Non. Une pile usagée contient des métaux qui polluent le sol et l’eau si elle finit dans la poubelle ordinaire, au bord de la rue ou dans la nature.',
        recyclage:'Pas avec les bouteilles et les canettes. Une pile est un déchet dangereux : elle a sa propre collecte spécialisée, où l’on récupère ses métaux sans risque.',
        specialisee:'Oui. Une pile usagée est un déchet dangereux. Un adulte la dépose dans une collecte spécialisée disponible près de chez toi. En attendant, on la garde à l’abri, hors de portée des petits.'}},
    {id:'pesticide',nom:'Un bidon vide de pesticide (produit contre les insectes ou les mauvaises herbes)',juste:'specialisee',danger:true,
      aide:'Le contenant garde des traces du produit. Regarde le pictogramme « arbre et poisson » : que dit-il ?',
      retour:{
        ordinaire:'Non. Le bidon garde des traces de produit qui peuvent empoisonner les personnes, les animaux, le sol et l’eau. On ne le met ni à la poubelle ordinaire, ni au feu, ni au caniveau.',
        recyclage:'Non. Un récipient qui a contenu un pesticide ne se recycle pas avec les bouteilles ordinaires, et il ne sert jamais à stocker de l’eau ou de la nourriture.',
        specialisee:'Oui. Le bidon est un déchet dangereux : on ne l’ouvre pas, on ne le réutilise pas, et l’élève ne le manipule pas. Un adulte le remet à une filière de collecte spécialisée disponible localement. En attendant, il reste fermé, hors de portée des enfants.'}},
    {id:'bouteille',nom:'Une bouteille d’eau en plastique, vide et propre',juste:'recyclage',danger:false,
      aide:'C’est un matériau qui peut servir de nouveau. Est-ce un déchet dangereux ?',
      retour:{
        ordinaire:'Pas la meilleure réponse. Le plastique propre peut être récupéré et recyclé. Si le recyclage n’existe pas près de chez toi, la poubelle ordinaire vaut mieux que la rue ou la nature.',
        recyclage:'Oui. Vide et propre, la bouteille en plastique peut être récupérée puis recyclée. Elle ne doit jamais rester dans la nature, où elle met très longtemps à disparaître.',
        specialisee:'Non. Une bouteille d’eau vide n’est pas un déchet dangereux. Réserve la collecte spécialisée aux déchets qui portent un danger (piles, pesticides…).'}},
    {id:'epluchures',nom:'Des épluchures de légumes',juste:'ordinaire',danger:false,
      aide:'C’est un déchet de cuisine qui se décompose vite. Est-ce un matériau à recycler ?',
      retour:{
        ordinaire:'Oui. Les restes de cuisine vont à la poubelle ordinaire (ou au compost si ta famille en fait). Ils se décomposent vite.',
        recyclage:'Non. Les épluchures ne se recyclent pas comme le plastique ou le métal. Elles se décomposent d’elles-mêmes, et peuvent aller au compost.',
        specialisee:'Non. Ce n’est pas un déchet dangereux : pas besoin de collecte spécialisée.'}},
    {id:'canette',nom:'Une canette en aluminium, vide',juste:'recyclage',danger:false,
      aide:'Le métal se récupère et sert à fabriquer de nouveaux objets. Est-ce dangereux ?',
      retour:{
        ordinaire:'Pas la meilleure réponse. Le métal propre se recycle très bien. Si tu ne peux pas le recycler, la poubelle ordinaire vaut mieux que la nature, où la canette met très longtemps à disparaître.',
        recyclage:'Oui. Le métal se récupère et se recycle de nombreuses fois. On évite de la laisser dans la nature.',
        specialisee:'Non. Une canette vide n’est pas un déchet dangereux.'}}
  ];
  /* vérifie une réponse : renvoie {juste, retour} et refuse les destinations inconnues */
  M.verifierDechet=function(id,dest){
    var d=M.DECHETS.filter(function(x){return x.id===id;})[0];
    if(!d)throw new Error('déchet inconnu');
    if(!d.retour[dest])throw new Error('destination inconnue');
    return {juste:d.juste===dest,retour:d.retour[dest],attendu:d.juste};
  };
  /* score sur 5 : réussites du premier coup ; « final » = réponses justes après correction */
  M.scoreTri=function(reps,tentatives,liste,verif){
    liste=liste||M.DECHETS;verif=verif||function(id,d){return M.verifierDechet(id,d).juste;};
    var premier=0,final=0,repondus=0;
    liste.forEach(function(d){var r=reps&&reps[d.id];if(!r)return;repondus++;if(verif(d.id,r))final++;});
    liste.forEach(function(d){var t=tentatives&&tentatives[d.id];if(t&&t.length&&verif(d.id,t[0]))premier++;});
    return {premier:premier,final:final,repondus:repondus,total:liste.length};
  };

  /* ---------- Gaz ---------- */
  M.AIR=[
    {id:'verre_droit',nom:'Je plonge un verre à l’envers, bien droit, dans l’eau',eau:'n’entre presque pas',bulles:false,txt:'Le verre est plein d’air : l’eau ne peut pas entrer. Le niveau dans le verre reste bas.'},
    {id:'verre_incline',nom:'J’incline ensuite le verre sous l’eau',eau:'entre',bulles:true,txt:'Des bulles sortent du verre et l’eau entre : l’air s’échappe et laisse la place à l’eau.'},
    {id:'ballon',nom:'Je gonfle un ballon',eau:null,bulles:false,txt:'Le ballon prend du volume : l’air qu’on y souffle occupe de la place.'},
    {id:'seringue',nom:'Je pousse le piston d’une seringue fermée',eau:null,bulles:false,txt:'Le piston ne va pas jusqu’au bout : l’air enfermé occupe de la place et pousse en retour.'}
  ];
  M.air=function(id){var a=M.AIR.filter(function(x){return x.id===id;})[0];if(!a)throw new Error('expérience inconnue');return a;};
  M.ACTIONS_SERINGUE=[['comprimer','J’appuie sur le piston'],['comprimer_relacher','J’appuie puis je relâche'],['tirer','Je tire sur le piston'],['tirer_relacher','Je tire puis je relâche']];
  /* niveau de piston qualitatif : 1 enfoncé, 2 repos, 3 tiré. Seringue ouverte : l'air passe, le piston reste où on le laisse. */
  M.seringue=function(bouchee,action){
    var tire=action.indexOf('tirer')===0,rel=/_relacher$/.test(action);
    if(!bouchee)return {piston:rel?2:(tire?3:1),volume:'inchangé',resistance:'aucune',revient:false,txt:'Seringue ouverte : l’air entre et sort, on ne sent presque aucune résistance. Le volume d’air enfermé ne change pas.'};
    if(rel)return {piston:2,volume:'inchangé',resistance:tire?'moyenne':'forte',revient:true,txt:'Seringue bouchée : quand on relâche, le piston revient presque à sa position de départ. L’air est élastique.'};
    return tire?{piston:3,volume:'augmenté',resistance:'moyenne',revient:false,txt:'Seringue bouchée : en tirant, le volume d’air augmente (l’air est expansible).'}:{piston:1,volume:'réduit',resistance:'forte',revient:false,txt:'Seringue bouchée : en appuyant, le volume d’air diminue (l’air est compressible).'};
  };
  M.VOLUMES=[['grand','Grand volume d’air'],['moyen','Volume moyen'],['petit','Petit volume d’air']];
  /* pression qualitative, sans unité : plus le volume diminue, plus la poussée sur les parois augmente */
  M.pression=function(vol){var t={grand:{jauge:'faible',niveau:1},moyen:{jauge:'moyenne',niveau:2},petit:{jauge:'forte',niveau:3}}[vol];if(!t)throw new Error('volume inconnu');return {jauge:t.jauge,niveau:t.niveau,fleches:t.niveau+1,txt:'Volume '+(vol==='petit'?'petit':vol==='moyen'?'moyen':'grand')+' : poussée du gaz sur les parois '+t.jauge+'.'};};
  M.MONTAGES_GAZ=[['transvaser','Transvaser : tube plein d’air incliné sous un bocal renversé'],['recueillir','Recueillir : tube plein d’eau renversé, tuyau relié au labogaz'],['conserver','Conserver : fermer le tube sous l’eau avec un bouchon']];
  M.gazDeplaceEau=function(montage,etape){
    if(['transvaser','recueillir','conserver'].indexOf(montage)<0)throw new Error('montage inconnu');
    var apres=etape==='apres';
    return {niveauEau:apres&&montage!=='conserver'?'bas':(montage==='conserver'?'bas':'haut'),gazPresent:apres||montage==='conserver',bulles:apres&&montage!=='conserver',bouche:montage==='conserver'&&apres,
      txt:montage==='conserver'?(apres?'Le tube est fermé sous l’eau avec un bouchon : le gaz reste enfermé.':'Le tube contient déjà du gaz ; on le ferme sous l’eau.'):(apres?'Des bulles montent, le niveau d’eau baisse : le gaz a pris la place de l’eau.':'Le récipient est plein d’eau : il n’y a pas encore de gaz.')};
  };
  M.GAZ_VIE=[
    {id:'butane',nom:'Bouteille de gaz de cuisine',gaz:'butane',noteGaz:'Le butane est inflammable : jamais près d’une flamme.'},
    {id:'boisson',nom:'Boisson gazeuse (les bulles)',gaz:'co2',noteGaz:'Le dioxyde de carbone fait les bulles.'},
    {id:'marmite',nom:'Marmite d’eau qui bout',gaz:'vapeur',noteGaz:'La vapeur d’eau est un gaz invisible ; le « nuage blanc » au-dessus est fait de fines gouttelettes.'},
    {id:'pneu',nom:'Pneu de vélo gonflé',gaz:'air',noteGaz:'Le pneu est gonflé d’air.'},
    {id:'oxygene',nom:'Bouteille d’oxygène d’un centre de santé',gaz:'o2',noteGaz:'Le dioxygène aide les personnes qui respirent mal.'}
  ];
  M.GAZ_NOMS=[['air','l’air'],['butane','le butane'],['co2','le dioxyde de carbone'],['vapeur','la vapeur d’eau'],['o2','le dioxygène']];
  M.DEFAUTS_PAILLASSE=[
    {id:'flamme',nom:'Une flamme allumée près du labogaz',danger:true,regle:'Aucune flamme près d’un gaz inflammable.'},
    {id:'verre',nom:'Un verre cassé sur la paillasse',danger:true,regle:'Un verre cassé se signale au professeur, on ne le ramasse pas à main nue.'},
    {id:'flaque',nom:'Une flaque d’eau par terre',danger:true,regle:'On essuie tout de suite : on peut glisser.'},
    {id:'blouse',nom:'Un élève dont la blouse est ouverte',danger:true,regle:'La blouse se porte fermée.'},
    {id:'tuyau',nom:'Un tuyau de gaz non fixé',danger:true,regle:'Le tuyau est fixé et vérifié par le professeur avant d’ouvrir le gaz.'},
    {id:'cuve',nom:'Une cuve à eau bien posée, au centre de la paillasse',danger:false,regle:'Cette situation est correcte.'},
    {id:'lunettes',nom:'Un élève qui porte ses lunettes de protection',danger:false,regle:'Cette situation est correcte.'}
  ];

  /* ---------- Température ---------- */
  M.LAB={min:-10,max:110,grad:1};
  M.MED={min:35,max:42,grad:0.1};
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  M.lectureLab=function(T){var t=clamp(Math.round(T),M.LAB.min,M.LAB.max);return {valeur:t,txt:'Le sommet de la colonne est au trait '+t+' : on lit '+t+' °C, à 1 °C près.'};};
  M.lectureMed=function(T){var t=Math.round(clamp(T,M.MED.min,M.MED.max)*10)/10;return {valeur:t,txt:'On lit '+fr(t)+' °C, à 0,1 °C près.'};};
  M.TEMPS_ILLUSTRES=[0,23,37,60,100];
  /* toucher : la sensation dépend de la main, pas seulement de l'eau (eau « chaude » = seulement agréablement chaude) */
  M.toucher=function(avant){
    if(avant==='froide')return {mainGauche:'chaude',txt:'La main sortie de l’eau froide trouve l’eau tiède chaude.'};
    if(avant==='chaude')return {mainGauche:'froide',txt:'La main sortie de l’eau agréablement chaude trouve l’eau tiède froide.'};
    if(avant==='aucune')return {mainGauche:'tiède',txt:'Une main qui n’a rien touché avant trouve l’eau simplement tiède.'};
    throw new Error('état inconnu');
  };
  M.repererTemp=function(milieu,moment){
    var stable={air:30,eau:28}[milieu];if(stable==null)throw new Error('milieu inconnu');
    var debut={air:24,eau:23}[milieu];
    return {valeur:moment==='debut'?debut:stable,stable:moment!=='debut',illustration:true,txt:moment==='debut'?'La colonne bouge encore : on n’écrit pas la valeur tout de suite, on attend.':'La colonne ne bouge plus : on peut lire. (Valeur simulée.)'};
  };
  M.reperes=function(milieu,moment){
    var t={glace:{debut:6,stable:0,longtemps:0},bouillante:{debut:70,stable:100,longtemps:100}}[milieu];if(!t)throw new Error('milieu inconnu');
    var v=t[moment];if(v==null)throw new Error('moment inconnu');
    return {valeur:v,palier:moment!=='debut',txt:moment==='debut'?'La colonne est encore en mouvement.':milieu==='glace'?'La valeur reste à 0 °C tant qu’il reste de la glace qui fond.':'La valeur reste voisine de 100 °C tant que l’eau bout (au niveau de la mer).'};
  };
  /* thermomètre médical : le liquide reste en place après usage, d'où le secouage */
  M.medical=function(etat,action){
    var avant=etat==='utilise'?38.4:35;
    if(action==='secouer')return {valeur:35,txt:'Après avoir secoué, la colonne est redescendue sous le bas de l’échelle : le thermomètre est prêt.',secoue:true,pret:true};
    return {valeur:avant,txt:etat==='utilise'?'Le liquide est resté à 38,4 °C : ce n’est pas la température de la personne suivante. Il faut le secouer.':'Le liquide est en bas de l’échelle.',secoue:false,pret:etat!=='utilise'};
  };
  M.PERSONNES=[['awa','Awa'],['kofi','Kofi'],['mariam','Mariam']];
  M.corps=function(pers,secoue,duree){
    var stable={awa:36.9,kofi:37.2,mariam:37.6}[pers];if(stable==null)throw new Error('personne inconnue');
    if(!secoue)return {valeur:38.4,fiable:false,txt:'Le thermomètre n’a pas été secoué : il affiche 38,4 °C, ancienne valeur. Cette lecture est fausse. Recommence en secouant d’abord.'};
    if(duree==='courte')return {valeur:Math.round((stable-0.8)*10)/10,fiable:false,txt:'Après 30 secondes seulement, la colonne n’a pas fini de monter : on attend 2 à 3 minutes.'};
    return {valeur:stable,fiable:true,txt:'Après 2 à 3 minutes, la colonne est stable : on lit '+fr(stable)+' °C (relevé fictif).'};
  };
  M.THERMOS=[
    {id:'liquide',nom:'Thermomètre à liquide (alcool coloré)',usage:'Laboratoire, température ambiante.',precaution:'Fragile ; lecture à hauteur d’œil ; ne sert pas à remuer.'},
    {id:'sonde',nom:'Thermomètre numérique à sonde',usage:'Cuisine, laboratoire, liquides.',precaution:'« Numérique » est un mode d’affichage, « à sonde » une forme : un thermomètre peut être les deux.'},
    {id:'infrarouge',nom:'Thermomètre infrarouge',usage:'Mesure sans contact d’une surface ou du front.',precaution:'Ne mesure pas à travers une vitre.'},
    {id:'mural',nom:'Thermomètre mural ou à cadran',usage:'Température de la pièce, de l’air.',precaution:'À lire de face, sans le toucher.'},
    {id:'minmax',nom:'Thermomètre à minimum et à maximum',usage:'Extrêmes de la journée (météo, serre).',precaution:'À remettre à zéro après lecture selon le mode d’emploi.'},
    {id:'medical',nom:'Thermomètre médical',usage:'Température du corps.',precaution:'Échelle 35 °C à 42 °C ; se nettoie avant d’être partagé et se secoue avant usage.'}
  ];
  M.SITUATIONS_THERMO=[
    {id:'s1',txt:'Lire de loin la température de l’air d’une salle de classe, fixée au mur.',juste:'mural'},
    {id:'s2',txt:'Prendre la température d’un enfant malade.',juste:'medical'},
    {id:'s3',txt:'Connaître la température la plus basse de la nuit et la plus haute du jour dans la cour.',juste:'minmax'},
    {id:'s4',txt:'Connaître la température d’une plaque très chaude, sans la toucher.',juste:'infrarouge'},
    {id:'s5',txt:'Suivre la température d’un liquide qui cuit dans une casserole, avec une sonde plongée dedans.',juste:'sonde'},
    {id:'s6',txt:'Mesurer la température de l’eau d’un bécher au laboratoire, en lisant à hauteur d’œil.',juste:'liquide'}
  ];
  M.APPROFONDISSEMENT_THERMO=['thermomètre à cristaux liquides','thermocouple','sonde de température à résistance électrique','thermomètre à capillaire','thermomètre pour gaz d’échappement','pyromètre'];

  /* ---------- Changements d'état de l'eau ---------- */
  /* instants : valeurs simulées. Le mélange réfrigérant est plus froid que 0 °C mais sa valeur n'est jamais annoncée. */
  M.INSTANTS_SOLID=[['depart','Au départ'],['refroidit','L’eau refroidit'],['apparait','La glace apparaît'],['croit','La glace se forme'],['solide','Tout est solide']];
  M.solidification=function(instant){
    var t={depart:{T:20,etat:'liquide'},refroidit:{T:6,etat:'liquide'},apparait:{T:0,etat:'liquide et solide'},croit:{T:0,etat:'liquide et solide'},solide:{T:-3,etat:'solide'}}[instant];
    if(!t)throw new Error('instant inconnu');
    return {T:t.T,etat:t.etat,palier:instant==='apparait'||instant==='croit',melangeNote:'Le mélange réfrigérant est plus froid que 0 °C : sa valeur n’est pas annoncée.',
      txt:instant==='solide'?'Toute l’eau du tube est devenue glace : le thermomètre descend sous 0 °C (valeur simulée).':t.T===0?'La glace se forme et le thermomètre du tube reste à 0 °C.':'Le thermomètre du tube indique '+t.T+' °C (valeur simulée), l’eau est liquide.'};
  };
  M.INSTANTS_FUSION=[['debut','Au début'],['milieu','Il reste beaucoup de glace'],['presque','Il reste un peu de glace'],['fini','Il n’y a plus de glace'],['plus_tard','Un peu plus tard']];
  M.fusion=function(instant){
    var t={debut:{T:0,glace:true},milieu:{T:0,glace:true},presque:{T:0,glace:true},fini:{T:3,glace:false},plus_tard:{T:12,glace:false}}[instant];
    if(!t)throw new Error('instant inconnu');
    return {T:t.T,glace:t.glace,palier:t.glace,txt:t.glace?'Il reste de la glace : le thermomètre indique 0 °C (durées accélérées, valeur simulée).':'Plus de glace : la température remonte ('+t.T+' °C, valeur simulée).'};
  };
  M.ETATS_VOLUME=[['liquide','Eau liquide (départ)'],['solide','Eau devenue glace'],['fondue','Glace fondue']];
  M.volumeEau=function(etat){
    var t={liquide:{niveau:'départ',niv:1},solide:{niveau:'plus haut que le départ',niv:2},fondue:{niveau:'revenu au départ',niv:1}}[etat];
    if(!t)throw new Error('état inconnu');
    return {niveau:t.niveau,niv:t.niv,txt:etat==='solide'?'Quand l’eau gèle, son volume augmente : la glace prend un peu plus de place.':etat==='fondue'?'Quand la glace fond, le volume diminue : le niveau revient à celui de l’eau de départ.':'Niveau de départ marqué sur le tube.'};
  };
  M.masse=function(etat,couvert){
    if(etat==='glace')return {m:50,txt:'Avant la fusion, la balance indique 50 g (valeur simulée).'};
    if(etat==='eau')return couvert?{m:50,txt:'Après la fusion, récipient couvert : la balance indique 50 g (valeur simulée). La masse est la même.'}:{m:49,txt:'Récipient resté ouvert : la balance indique 49 g (valeur simulée). De la buée et de l’évaporation falsifient la pesée : on couvre le récipient.'};
    throw new Error('état inconnu');
  };
  M.EXPERIENCES_VAPO=[['evap_soleil','Évaporation : soucoupe au soleil'],['evap_ombre','Évaporation : soucoupe à l’ombre'],['ebullition','Ébullition : ballon chauffé par le professeur'],['condensation','Condensation : paroi froide au-dessus de la vapeur']];
  M.vaporisation=function(exp,moment){
    var tard=moment==='tard';
    if(exp==='evap_soleil')return {forme:'évaporation',niveau:tard?'bas':'haut',bulles:false,T:null,gouttes:false,txt:tard?'Au soleil, le niveau a bien baissé : l’eau s’évapore en surface, sans bulles.':'Au départ, la soucoupe est pleine.'};
    if(exp==='evap_ombre')return {forme:'évaporation',niveau:tard?'moyen':'haut',bulles:false,T:null,gouttes:false,txt:tard?'À l’ombre, le niveau a baissé moins vite : l’évaporation est plus lente quand il fait moins chaud.':'Au départ, la soucoupe est pleine.'};
    if(exp==='ebullition')return {forme:'ébullition',niveau:tard?'moyen':'haut',bulles:tard,T:tard?100:25,gouttes:false,txt:tard?'L’eau bout : des bulles se forment dans tout le liquide, le thermomètre reste voisin de 100 °C (au niveau de la mer, valeur simulée).':'L’eau est tiède, il n’y a pas de bulles (25 °C, valeur simulée).'};
    if(exp==='condensation')return {forme:'condensation',niveau:'moyen',bulles:false,T:null,gouttes:tard,txt:tard?'La vapeur d’eau (gaz invisible) se condense en gouttelettes sur la paroi froide.':'On place une paroi froide au-dessus de la vapeur : rien n’est encore visible.'};
    throw new Error('expérience inconnue');
  };
  M.ETAPES_CYCLE=[
    {id:'evap',txt:'Le soleil chauffe la mer et la lagune : une partie de l’eau passe de l’état liquide à l’état gazeux.',juste:'evaporation'},
    {id:'cond',txt:'En altitude, la vapeur d’eau se refroidit et devient de fines gouttelettes qui forment les nuages.',juste:'condensation'},
    {id:'pluie',txt:'Les gouttelettes grossissent et tombent sur le sol pendant la saison des pluies.',juste:'precipitation'},
    {id:'retour',txt:'L’eau de pluie coule dans les rivières et la lagune, puis revient à la mer.',juste:'ruissellement'}
  ];
  M.CYCLE_NOMS=[['evaporation','L’évaporation'],['condensation','La condensation'],['precipitation','Les précipitations'],['ruissellement','Le ruissellement et le retour à la mer']];

  /* ---------- Parcours « Matériaux, tri et déchets » ---------- */
  M.MATERIAUX={
    fer:{nom:'Un clou en acier',court:'Acier',aimant:true,chaleur:'bien',eau:'coule'},
    cuivre:{nom:'Un fil de cuivre',court:'Cuivre',aimant:false,chaleur:'bien',eau:'coule'},
    aluminium:{nom:'Une feuille d’aluminium',court:'Aluminium',aimant:false,chaleur:'bien',eau:'coule'},
    plastique:{nom:'Une règle en plastique',court:'Plastique',aimant:false,chaleur:'mal',eau:'coule'},
    bois:{nom:'Une réglette en bois',court:'Bois',aimant:false,chaleur:'mal',eau:'flotte'},
    verre:{nom:'Un morceau de verre épais',court:'Verre',aimant:false,chaleur:'mal',eau:'coule'}
  };
  /* « la plupart des aciers » sont attirés par un aimant ; cuivre et aluminium ne le sont pas, même s'ils conduisent le courant */
  M.aimant=function(mat){var m=M.MATERIAUX[mat];if(!m)throw new Error('matériau inconnu');return {attire:m.aimant,txt:m.aimant?cap(m.nom)+' est attiré par l’aimant (la plupart des aciers le sont).':cap(m.nom)+' n’est pas attiré par l’aimant.'};};
  M.chaleur=function(mat,instant){var m=M.MATERIAUX[mat];if(!m)throw new Error('matériau inconnu');var t=instant==='long';return {chaud:m.chaleur==='bien'?(t?'très chaud':'chaud'):(t?'tiède':'froid'),conduit:m.chaleur==='bien',txt:m.chaleur==='bien'?'La chaleur se propage vite jusqu’au bout de la tige : le bout libre devient '+(t?'très chaud':'chaud')+'.':'La chaleur se propage mal : le bout libre reste '+(t?'tiède':'froid')+'.'};};
  M.PLASTIQUES=[
    {id:'bouchon',nom:'Un bouchon de bouteille',eau:'flotte'},
    {id:'bouteille',nom:'Un morceau de bouteille d’eau',eau:'coule'},
    {id:'sachet',nom:'Un morceau de sachet',eau:'flotte'},
    {id:'tuyau',nom:'Un morceau de tuyau rigide gris',eau:'coule'},
    {id:'mousse',nom:'Un morceau de mousse d’emballage',eau:'flotte'}
  ];
  /* « plus léger que l'eau » = flotte ; « plus lourd que l'eau » = coule (à volume égal) ; aucune notion de densité en 6e */
  M.flotte=function(id){var p=M.PLASTIQUES.filter(function(x){return x.id===id;})[0];if(!p)throw new Error('plastique inconnu');var f=p.eau==='flotte';return {flotte:f,comparaison:f?'plus léger que l’eau':'plus lourd que l’eau',txt:cap(p.nom)+' '+(f?'flotte : à volume égal, il est plus léger que l’eau.':'coule : à volume égal, il est plus lourd que l’eau.')};};
  M.CRITERES_METAL=[
    {id:'poele',txt:'Le fond d’une casserole qui chauffe sur le feu.',juste:'chaleur',pourquoi:'Le fond doit conduire la chaleur vers la nourriture.'},
    {id:'cable',txt:'Le fil d’un cordon de ventilateur (220 V).',juste:'electricite',pourquoi:'Le fil doit conduire le courant électrique.'},
    {id:'tri',txt:'Séparer les boîtes en acier des autres déchets au centre de tri.',juste:'aimant',pourquoi:'L’acier est attiré par un aimant, pas l’aluminium ni le plastique.'}
  ];
  M.PROPRIETES=[['chaleur','Il conduit bien la chaleur'],['electricite','Il conduit le courant électrique'],['aimant','Il est attiré par un aimant']];
  M.DECOMPOSITION=[
    {id:'mouchoir',nom:'Un mouchoir en papier',classe:'mois',source:'environ 1 mois'},
    {id:'pomme',nom:'Un trognon de fruit',classe:'mois',source:'1 à 5 mois'},
    {id:'journal',nom:'Un vieux journal',classe:'mois',source:'3 à 12 mois'},
    {id:'bois',nom:'Des débris de bois',classe:'annees',source:'environ 15 ans'},
    {id:'canette',nom:'Une canette en aluminium',classe:'siecles',source:'environ 100 ans'},
    {id:'bouteille',nom:'Une bouteille en plastique',classe:'siecles',source:'environ 500 ans'},
    {id:'verre',nom:'Un objet en verre',classe:'siecles',source:'plusieurs milliers d’années'}
  ];
  M.CLASSES_DUREE=[['mois','Quelques mois'],['annees','Quelques années'],['siecles','Un siècle ou plus']];
  M.dureeDecomposition=function(id){var d=M.DECOMPOSITION.filter(function(x){return x.id===id;})[0];if(!d)throw new Error('déchet inconnu');return d;};
  /* centre de tri : étapes, chacune utilise une propriété physique différente */
  M.ETAPES_TRI=[
    {id:'aimant',nom:'Séparation magnétique',propriete:'Les déchets en acier sont attirés par un aimant.',separe:['fer']},
    {id:'trommel',nom:'Tamisage dans un tambour (trommel)',propriete:'Les petits déchets passent par les trous du tambour, les gros restent.',separe:['petit']},
    {id:'eau',nom:'Bac d’eau',propriete:'Les matières plus légères que l’eau flottent, les plus lourdes coulent.',separe:['flotte']}
  ];
  M.DECHETS_CENTRE=[
    {id:'boite',nom:'Une boîte de conserve en acier',etape:'aimant'},
    {id:'canette',nom:'Une canette en aluminium',etape:'aucune'},
    {id:'bouchon',nom:'Un bouchon en plastique',etape:'eau'},
    {id:'bouteille',nom:'Un morceau de bouteille en plastique',etape:'aucune'}
  ];

  function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
  function fr(n){return String(n).replace('.',',');}
  M.cap=cap;M.fr=fr;

  /* ---------- Outils de test communs aux fiches ---------- */
  /* essais valides : observation de dix caractères au moins */
  M.valides=function(st){return st.essais.filter(function(e){return typeof e.observation==='string'&&e.observation.trim().length>=10;});};
  M.distincts=function(liste,cle){var s={};liste.forEach(function(e){s[typeof cle==='function'?cle(e):e[cle]]=1;});return Object.keys(s).length;};

  window.NohobaMatiere=M;
})();
