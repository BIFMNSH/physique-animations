/* NohobaLab · 6e Côte d'Ivoire · modèle qualitatif du lot « L'air et les combustions » (CHI-01 à CHI-22).
   Règles testables, sans valeur numérique inventée : les seules proportions sont 1/5 et 4/5 (programme).
   Vocabulaire : nom du programme d'abord, nom scientifique entre parenthèses (décision du 8 novembre 2026).
   Toute flamme est un protocole guidé par le professeur : le modèle décrit ce que montre la simulation. */
(function(){
  'use strict';
  var C=window.NohobaChimie={};
  function lib(l,k){var x=l.filter(function(y){return y[0]===k;})[0];if(!x)throw new Error('inconnu : '+k);return x[1];}
  C.lib=lib;

  /* ---------- vocabulaire ---------- */
  C.GAZ={oxygene:['gaz oxygène','dioxygène'],azote:['gaz azote','diazote'],carbonique:['gaz carbonique','dioxyde de carbone']};
  C.gaz=function(id,complet){var g=C.GAZ[id];if(!g)throw new Error('gaz inconnu : '+id);return complet?g[0]+' ('+g[1]+')':g[0];};

  /* ---------- CHI-01 · bougie sous récipient ---------- */
  C.RECIPIENTS=[['aucun','Sans récipient'],['petit','Petit bocal'],['grand','Grand bocal']];
  C.bougie=function(r){
    lib(C.RECIPIENTS,r);
    if(r==='aucun')return {flamme:'brule',duree:'longtemps',montee:false,txt:'Sans récipient, la bougie continue de brûler : l’air de la pièce lui apporte sans cesse du '+C.gaz('oxygene')+'. Le niveau d’eau ne change pas.'};
    var grand=r==='grand';
    return {flamme:'eteinte',duree:grand?'plus tard':'vite',montee:true,part:'1/5',
      txt:'Sous le '+(grand?'grand':'petit')+' bocal, la flamme faiblit puis s’éteint '+(grand?'plus tard que sous le petit':'vite')+'. L’eau monte dans le bocal et occupe environ 1/5 de son volume. Il reste un gaz qui n’entretient pas la combustion.'};
  };

  /* ---------- CHI-21 · lecture de la proportion ---------- */
  C.METHODES=[['bougie','Bougie sous éprouvette graduée'],['paille','Paille de fer humide (variante, une semaine)']];
  C.ETAPES_PROP=[['debut','Au début'],['milieu','Au milieu (paille : après trois jours)'],['fin','À la fin']];
  C.proportion=function(m,e){
    lib(C.METHODES,m);lib(C.ETAPES_PROP,e);
    var frac=e==='debut'?0:e==='milieu'?(m==='paille'?0.1:0.2):0.2;
    if(m==='bougie'&&e==='milieu')frac=0.2;
    var lecture=frac===0?'niveau de départ (0)':frac<0.2?'un peu moins de 1/5 (en cours)':'environ 1/5 du volume';
    return {fraction:frac,lecture:lecture,buchette:frac>=0.2?'s’éteint':'non testée',simule:true,
      txt:(m==='bougie'?'La bougie s’est éteinte. ':'La paille de fer a rouillé. ')+'L’eau est montée : '+lecture+'. '+(frac>=0.2?'Le gaz restant (environ 4/5) éteint une bûchette incandescente : c’est le '+C.gaz('azote')+'.':'L’expérience n’est pas terminée.')};
  };

  /* ---------- CHI-02 · sources de pollution (enquête) ---------- */
  C.SOURCES=[['combustion','Une combustion'],['poussiere','Des poussières'],['aucune','Pas de pollution']];
  C.LIEUX=[
    {id:'usine',nom:'Cheminée d’une usine de la zone industrielle',indice:'mauvais',source:'combustion',pourquoi:'La cheminée rejette les fumées d’une combustion.'},
    {id:'carrefour',nom:'Carrefour embouteillé (gbakas, motos, taxis)',indice:'mauvais',source:'combustion',pourquoi:'Les moteurs brûlent de l’essence ou du gazole : leurs gaz d’échappement polluent.'},
    {id:'ordures',nom:'Tas d’ordures que l’on brûle au bord de la rue',indice:'mauvais',source:'combustion',pourquoi:'Brûler des déchets produit une fumée épaisse et des gaz toxiques.'},
    {id:'fourneau',nom:'Fourneau à charbon de bois dans une cour',indice:'moyen',source:'combustion',pourquoi:'Le charbon qui brûle dégage de la fumée et des gaz : à faire en plein air.'},
    {id:'piste',nom:'Piste poussiéreuse pendant l’harmattan',indice:'moyen',source:'poussiere',pourquoi:'La poussière soulevée par le vent et les véhicules salit l’air sans combustion.'},
    {id:'marche',nom:'Marché couvert, sans feu',indice:'bon',source:'aucune',pourquoi:'Ni combustion ni poussière : l’air y est propre.'},
    {id:'lagune',nom:'Bord de la lagune, au vent',indice:'bon',source:'aucune',pourquoi:'L’air vient de la lagune : pas de source de pollution proche.'},
    {id:'cour',nom:'Cour d’école plantée d’arbres',indice:'bon',source:'aucune',pourquoi:'Les arbres retiennent une partie des poussières ; aucune combustion sur place.'}];
  C.air=function(id){var l=C.LIEUX.filter(function(x){return x.id===id;})[0];if(!l)throw new Error('lieu inconnu : '+id);return l;};
  C.INDICES=[['bon','Bon'],['moyen','Moyen'],['mauvais','Mauvais']];

  /* ---------- CHI-03 · actions contre la pollution ---------- */
  C.QUI=[['moi','Moi'],['famille','Ma famille'],['commune','La commune ou l’usine']];
  C.ACTIONS=[
    {id:'bruler',nom:'Ne plus brûler les ordures dans la cour',effet:2,qui:'famille'},
    {id:'collecte',nom:'Organiser la collecte des déchets du quartier',effet:2,qui:'commune'},
    {id:'foyer',nom:'Cuisiner en plein air ou avec un foyer amélioré',effet:1,qui:'famille'},
    {id:'moteur',nom:'Faire entretenir les moteurs des véhicules',effet:1,qui:'famille'},
    {id:'marcher',nom:'Marcher ou partager un véhicule pour les trajets courts',effet:1,qui:'moi'},
    {id:'arbres',nom:'Planter des arbres dans la cour et la rue',effet:1,qui:'moi'},
    {id:'filtre',nom:'Installer un filtre sur la cheminée de l’usine',effet:2,qui:'commune'},
    {id:'caniveau',nom:'Ne rien jeter dans les caniveaux',effet:1,qui:'moi'},
    {id:'arroser',nom:'Arroser la piste poussiéreuse',effet:1,qui:'commune'},
    {id:'masque',nom:'Porter un masque',effet:0,qui:'moi'}];
  C.action=function(id){var a=C.ACTIONS.filter(function(x){return x.id===id;})[0];if(!a)throw new Error('action inconnue : '+id);return a;};
  C.quartier=function(ids){
    var total=0;(ids||[]).forEach(function(id){total+=C.action(id).effet;});
    var indice=total>=6?'bon':total>=3?'moyen':'mauvais';
    return {points:total,indice:indice,simule:true,txt:'Avec '+(ids||[]).length+' action(s) choisie(s), l’air du quartier devient : '+lib(C.INDICES,indice).toLowerCase()+' (simulation qualitative).'+(ids&&ids.indexOf('masque')>=0?' Le masque protège une personne mais ne change pas l’air du quartier.':'')};
  };

  /* ---------- CHI-04 · combustion du charbon de bois ---------- */
  C.CONDITIONS=[['ferme','Dans un bocal fermé'],['libre','À l’air libre'],['souffle','À l’air libre, en soufflant']];
  C.charbon=function(c){
    lib(C.CONDITIONS,c);
    if(c==='ferme')return {braise:'eteinte',flamme:false,diminue:false,cendres:false,txt:'Dans le bocal fermé, la braise pâlit puis s’éteint : le '+C.gaz('oxygene')+' du bocal a été consommé.'};
    if(c==='libre')return {braise:'rouge',flamme:false,diminue:true,cendres:true,txt:'À l’air libre, le charbon rougeoie sans flamme, chauffe, diminue lentement et laisse des cendres grises.'};
    return {braise:'vive',flamme:false,diminue:true,cendres:true,txt:'En soufflant, l’incandescence devient vive : plus d’air arrive, le charbon diminue plus vite. Toujours pas de flamme.'};
  };

  /* ---------- tests d'identification (CHI-06, CHI-11, CHI-22) ---------- */
  C.TESTS=[['buee','Verre à pied froid et sec'],['chaux','Eau de chaux']];
  C.SITUATIONS_TEST=[['flamme','Au-dessus de la flamme / dans le bocal où elle a brûlé'],['temoin','Témoin : sans combustion']];
  C.COMBUSTIBLES=[['charbon','Charbon de bois'],['alcool','Alcool'],['butane','Butane (flamme bleue)'],['butane_jaune','Butane (flamme jaune)']];
  C.PRODUITS={charbon:['carbonique'],alcool:['carbonique','eau'],butane:['carbonique','eau'],butane_jaune:['carbonique','eau','carbone']};
  C.produits=function(comb){var p=C.PRODUITS[comb];if(!p)throw new Error('combustible inconnu : '+comb);return p.slice();};
  C.test=function(t,sit,comb){
    lib(C.TESTS,t);lib(C.SITUATIONS_TEST,sit);var P=C.produits(comb);
    if(sit==='temoin')return {positif:false,txt:t==='buee'?'Témoin : le verre reste sec.':'Témoin : l’eau de chaux agitée avec de l’air reste claire.'};
    if(t==='buee'){var e=P.indexOf('eau')>=0;return {positif:e,txt:e?'Une buée se forme sur le verre froid : il y a de l’eau.':'Le verre reste sec : aucune eau formée.'};}
    return {positif:true,txt:'L’eau de chaux se trouble : il y a du '+C.gaz('carbonique',true)+'.'};
  };

  /* ---------- CHI-05 · combustion de l'alcool ---------- */
  C.MOMENTS_ALCOOL=[['avant','Avant l’allumage'],['debut','Juste après l’allumage'],['suite','Après quelques minutes'],['bocal','Coiffée d’un bocal']];
  C.alcool=function(m){
    lib(C.MOMENTS_ALCOOL,m);
    if(m==='avant')return {flamme:false,niveau:3,chaud:false,suie:false,txt:'Avant l’allumage : pas de flamme, coupelle pleine, froide.'};
    if(m==='debut')return {flamme:true,niveau:3,chaud:true,suie:false,txt:'Flamme bleue, peu éclairante, chaude ; le niveau d’alcool n’a pas encore baissé.'};
    if(m==='suite')return {flamme:true,niveau:1,chaud:true,suie:false,txt:'La flamme continue ; le niveau d’alcool a baissé ; aucune suie sur une soucoupe passée au-dessus.'};
    return {flamme:false,niveau:1,chaud:true,suie:false,txt:'Sous le bocal, la flamme s’éteint : le '+C.gaz('oxygene')+' manque. L’alcool qui reste n’a pas disparu tout seul.'};
  };

  /* ---------- CHI-07 · réaction chimique : bilan en images ---------- */
  C.BILAN_CATS=[['avant','Présent avant, disparaît'],['apres','Apparaît après'],['ni','Ni l’un ni l’autre (pas un corps)']];
  C.BILAN=[
    {id:'charbon',label:'Le charbon de bois',juste:'avant',pourquoi:'Le charbon est consommé : il diminue puis disparaît.'},
    {id:'alcool',label:'L’alcool',juste:'avant',pourquoi:'L’alcool est consommé : son niveau baisse puis il disparaît.'},
    {id:'oxygene',label:'Le '+C.gaz('oxygene',true)+' de l’air',juste:'avant',pourquoi:'Il est consommé : sous un bocal, la combustion s’arrête quand il manque.'},
    {id:'carbonique',label:'Le '+C.gaz('carbonique',true),juste:'apres',pourquoi:'Il apparaît : l’eau de chaux se trouble après la combustion.'},
    {id:'eau',label:'L’eau',juste:'apres',pourquoi:'Elle apparaît : buée sur le verre froid (alcool).'},
    {id:'chaleur',label:'La chaleur',juste:'ni',pourquoi:'La chaleur n’est pas un corps : elle est dégagée pendant la combustion.'},
    {id:'flamme',label:'La flamme',juste:'ni',pourquoi:'La flamme n’est pas un corps : c’est le gaz très chaud qui brûle et éclaire.'},
    {id:'cendres',label:'Les cendres',juste:'ni',pourquoi:'Les cendres sont des restes non brûlés du charbon ; elles ne sont pas dans le bilan.'}];

  /* ---------- CHI-20, CHI-11 · équations littérales ---------- */
  C.ETIQUETTES=[['charbon','charbon de bois'],['alcool','alcool'],['butane','butane'],['oxygene',C.gaz('oxygene')],['carbonique',C.gaz('carbonique')],['eau','eau'],['chaleur','chaleur'],['flamme','flamme'],['cendres','cendres']];
  C.EQUATIONS={charbon:{gauche:['charbon','oxygene'],droite:['carbonique']},alcool:{gauche:['alcool','oxygene'],droite:['carbonique','eau']},butane:{gauche:['butane','oxygene'],droite:['carbonique','eau']}};
  C.equation=function(comb){var e=C.EQUATIONS[comb];if(!e)throw new Error('combustible inconnu : '+comb);
    var n=function(k){return lib(C.ETIQUETTES,k);};return n(e.gauche[0])+' + '+n(e.gauche[1])+' → '+e.droite.map(n).join(' + ');};

  /* ---------- CHI-08 · combustible / comburant ---------- */
  C.ROLES=[['combustible','Combustible (il brûle)'],['comburant','Comburant (il fait brûler)'],['ni','Ni l’un ni l’autre']];
  C.CARTES=[
    {id:'charbon',nom:'Charbon de bois',role:'combustible',air:'brule',o2:'vive',pourquoi:'Le charbon brûle dans l’air ; dans le '+C.gaz('oxygene')+' pur, il brûle encore plus vivement.'},
    {id:'alcool',nom:'Alcool',role:'combustible',air:'brule',o2:'vive',pourquoi:'L’alcool brûle avec une flamme.'},
    {id:'butane',nom:'Butane',role:'combustible',air:'brule',o2:'vive',pourquoi:'Le butane est le gaz des bouteilles : il brûle.'},
    {id:'bois',nom:'Bois',role:'combustible',air:'brule',o2:'vive',pourquoi:'Le bois du feu de cuisine brûle.'},
    {id:'petrole',nom:'Pétrole lampant',role:'combustible',air:'brule',o2:'vive',pourquoi:'Le pétrole de la lampe brûle.'},
    {id:'bougie',nom:'Bougie',role:'combustible',air:'brule',o2:'vive',pourquoi:'La cire de la bougie brûle.'},
    {id:'oxygene',nom:C.gaz('oxygene',true),role:'comburant',air:'rien',o2:'rien',pourquoi:'Il ne brûle pas lui-même : il permet aux combustibles de brûler.'},
    {id:'air',nom:'Air',role:'comburant',air:'rien',o2:'rien',pourquoi:'L’air contient le '+C.gaz('oxygene')+' : c’est lui le comburant.'},
    {id:'eau',nom:'Eau',role:'ni',air:'eteint',o2:'eteint',pourquoi:'L’eau ne brûle pas et ne fait pas brûler : elle éteint en refroidissant.'},
    {id:'sable',nom:'Sable',role:'ni',air:'eteint',o2:'eteint',pourquoi:'Le sable ne brûle pas : il étouffe un petit feu en le privant d’air.'}];
  C.carte=function(id){var c=C.CARTES.filter(function(x){return x.id===id;})[0];if(!c)throw new Error('carte inconnue : '+id);return c;};
  C.MILIEUX=[['air','Dans l’air'],['o2','Dans un bocal de '+C.gaz('oxygene')]];
  C.essaiFlamme=function(id,milieu){var c=C.carte(id);lib(C.MILIEUX,milieu);var r=milieu==='air'?c.air:c.o2;
    return {resultat:r,txt:c.nom+(r==='brule'?' : brûle (flamme ou braise) dans l’air.':r==='vive'?' : brûle très vivement dans le '+C.gaz('oxygene')+'.':r==='eteint'?' : ne brûle pas et éteint la flamme d’essai.':' : ne brûle pas (la flamme d’essai continue).')};};

  /* ---------- CHI-09 · réaction chimique / transformation physique ---------- */
  C.TYPES=[['physique','Transformation physique'],['chimique','Réaction chimique']];
  C.TRANSFOS=[
    {id:'glace',nom:'La glace fond dans un verre',type:'physique',nouveau:false,retour:true,pourquoi:'C’est toujours de l’eau ; au congélateur, elle redevient glace.'},
    {id:'ebullition',nom:'L’eau bout dans une casserole',type:'physique',nouveau:false,retour:true,pourquoi:'La vapeur est encore de l’eau : elle redevient liquide sur un couvercle froid.'},
    {id:'karite',nom:'Le beurre de karité fond dans la casserole',type:'physique',nouveau:false,retour:true,pourquoi:'En refroidissant, le beurre redevient solide : même corps.'},
    {id:'charbon',nom:'Le charbon de bois brûle dans le fourneau',type:'chimique',nouveau:true,retour:false,pourquoi:'Le charbon disparaît et du '+C.gaz('carbonique')+' apparaît (eau de chaux troublée) ; pas de retour en arrière.'},
    {id:'alcool',nom:'L’alcool brûle dans le réchaud',type:'chimique',nouveau:true,retour:false,pourquoi:'L’alcool disparaît ; de l’eau et du '+C.gaz('carbonique')+' apparaissent.'},
    {id:'cire_fond',nom:'La cire de la bougie fond près de la mèche',type:'physique',nouveau:false,retour:true,pourquoi:'La cire fondue redevient solide en refroidissant : même corps.'},
    {id:'cire_brule',nom:'La cire fondue brûle dans la flamme',type:'chimique',nouveau:true,retour:false,pourquoi:'La cire disparaît et de nouveaux corps se forment (buée, eau de chaux troublée).'}];
  C.transformation=function(id){var t=C.TRANSFOS.filter(function(x){return x.id===id;})[0];if(!t)throw new Error('transformation inconnue : '+id);
    return {type:t.type,nouveau:t.nouveau,retour:t.retour,txt:t.nom+' : '+(t.nouveau?'de nouveaux corps apparaissent':'le corps reste le même')+' ; '+(t.retour?'on peut revenir en arrière.':'on ne peut pas revenir en arrière.')};};

  /* ---------- CHI-10, 12, 13 · butane ---------- */
  C.VIROLES=[['ouverte','Virole ouverte (beaucoup d’air)'],['fermee','Virole fermée (peu d’air)']];
  C.ETAPES_BUTANE=[['eteint','Robinet fermé, brûleur éteint'],['allume','Robinet ouvert, brûleur allumé par le professeur'],['soucoupe','Soucoupe blanche passée au-dessus de la flamme']];
  C.butane=function(v){
    lib(C.VIROLES,v);var o=v==='ouverte';
    return {flamme:o?'bleue':'jaune',chaleur:o?'tres':'moins',eclairante:!o,depot:!o,complete:o,produits:C.produits(o?'butane':'butane_jaune'),
      txt:o?'Flamme bleue à cône net, peu éclairante, très chaude. La soucoupe blanche reste propre : combustion complète.':'Flamme jaune, éclairante, vacillante, moins chaude. La soucoupe blanche se couvre d’un dépôt noir de carbone : combustion incomplète.'};
  };
  C.COMPLETUDES=[['complete','Combustion complète'],['incomplete','Combustion incomplète']];
  C.SITUATIONS_FLAMME=[
    {id:'s1',label:'Flamme bleue à cône net',juste:'complete',pourquoi:'La flamme bleue est celle d’une combustion complète.'},
    {id:'s2',label:'Flamme jaune qui vacille',juste:'incomplete',pourquoi:'La flamme jaune signale un manque d’air.'},
    {id:'s3',label:'Fond de casserole noirci',juste:'incomplete',pourquoi:'Le dépôt noir est du carbone : combustion incomplète.'},
    {id:'s4',label:'Fond de casserole resté propre',juste:'complete',pourquoi:'Pas de dépôt : combustion complète.'},
    {id:'s5',label:'Virole du brûleur ouverte',juste:'complete',pourquoi:'La virole ouverte laisse entrer beaucoup d’air.'},
    {id:'s6',label:'Brûleur encrassé, trous bouchés',juste:'incomplete',pourquoi:'L’air n’entre plus assez : combustion incomplète.'},
    {id:'s7',label:'Flamme très chaude, peu éclairante',juste:'complete',pourquoi:'La combustion complète donne le plus de chaleur.'},
    {id:'s8',label:'Flamme moins chaude, très éclairante',juste:'incomplete',pourquoi:'Les particules de carbone éclairent mais la flamme chauffe moins.'}];

  /* ---------- CHI-14 · pièce fermée ---------- */
  C.FENETRES=[['ouverte','Fenêtre ouverte'],['fermee','Fenêtre fermée']];
  C.DUREES=[['court','Quelques minutes'],['long','Toute la nuit']];
  C.ETATS=[['bien','Va bien'],['mal','Mal de tête, nausée'],['danger','En danger']];
  C.piece=function(v,f,d){
    lib(C.VIROLES,v);lib(C.FENETRES,f);lib(C.DUREES,d);
    var aere=f==='ouverte',complete=v==='ouverte',longue=d==='long';
    var oxygene=aere?3:longue?1:2;
    var toxique=complete?0:aere?(longue?1:0):(longue?3:1);
    var suie=!complete;
    var etat=toxique>=3||oxygene<=1?'danger':(toxique>=1||oxygene===2)?'mal':'bien';
    if(aere&&complete)etat='bien';
    return {oxygene:oxygene,toxique:toxique,suie:suie,etat:etat,simule:true,
      txt:'Jauges simulées : '+C.gaz('oxygene')+' '+['absent','très bas','en baisse','normal'][oxygene]+' ; gaz toxique invisible '+['absent','un peu','présent','très présent'][toxique]+(suie?' ; suie sur les murs':'')+'. La personne : '+lib(C.ETATS,etat).toLowerCase()+'.'+(etat==='danger'?' Il faut sortir, aérer et alerter.':'')};
  };

  /* ---------- CHI-15 · quatre mots ---------- */
  C.MOTS=[['incendie','Incendie'],['explosion','Explosion'],['asphyxie','Asphyxie'],['intoxication','Intoxication']];
  C.DEFINITIONS={incendie:'Un feu qui se propage et échappe au contrôle.',explosion:'Une combustion très rapide qui éclate avec un bruit violent.',asphyxie:'Un manque de '+C.gaz('oxygene')+' pour respirer.',intoxication:'Un gaz ou une fumée toxique respirés.'};
  C.SCENES=[
    {id:'sc_feu',label:'Les flammes gagnent tout le parking et les voitures voisines',juste:'incendie',pourquoi:'Le feu se propage et échappe au contrôle.'},
    {id:'sc_bouteille',label:'Une bouteille de gaz chauffée éclate d’un coup',juste:'explosion',pourquoi:'Combustion très rapide avec éclatement.'},
    {id:'sc_piece',label:'Une personne dans une pièce fermée où un fourneau a brûlé toute la nuit a du mal à respirer',juste:'asphyxie',pourquoi:'Le '+C.gaz('oxygene')+' a été consommé : il en manque pour respirer.'},
    {id:'sc_fumee',label:'Une personne a respiré la fumée noire et a mal à la tête',juste:'intoxication',pourquoi:'Des gaz toxiques ont été respirés.'}];
  C.definition=function(m){lib(C.MOTS,m);return C.DEFINITIONS[m];};

  /* ---------- CHI-16 · maison ---------- */
  C.CAUSES=[['chaleur','La chaleur'],['gaz','Les gaz formés'],['pression','Un gaz sous pression']];
  C.MAISON=[
    {id:'rideau',nom:'Une bougie allumée près d’un rideau',danger:'incendie',cause:'chaleur',pourquoi:'La chaleur de la flamme peut enflammer le rideau.'},
    {id:'bouteille',nom:'Une bouteille de gaz posée à côté du fourneau',danger:'explosion',cause:'pression',pourquoi:'Chauffée, la bouteille de gaz sous pression peut éclater.'},
    {id:'groupe',nom:'Un groupe électrogène qui tourne dans le salon',danger:'intoxication',cause:'gaz',pourquoi:'Le moteur rejette des gaz toxiques dans la pièce.'},
    {id:'chambre',nom:'Un fourneau à charbon dans une chambre fermée',danger:'asphyxie',cause:'gaz',pourquoi:'La combustion consomme le '+C.gaz('oxygene')+' de la pièce et forme des gaz.'},
    {id:'essence',nom:'Un bidon d’essence près du feu de cuisine',danger:'incendie',cause:'chaleur',pourquoi:'Les vapeurs d’essence s’enflamment à la chaleur.'},
    {id:'allumettes',nom:'Des allumettes à portée d’un petit enfant',danger:'incendie',cause:'chaleur',pourquoi:'Une allumette apporte la chaleur qui démarre un feu.'}];

  /* ---------- CHI-17 · triangle du feu ---------- */
  C.SOMMETS=[['combustible','Combustible'],['comburant','Comburant (air)'],['chaleur','Chaleur']];
  C.GESTES=[['rien','Je laisse brûler'],['bocal','Je couvre d’un bocal'],['sable','Je verse du sable'],['ecarter','J’écarte le papier non brûlé'],['eau','Je verse de l’eau'],['froid','J’essaie d’allumer sans source de chaleur']];
  C.triangle=function(g){
    lib(C.GESTES,g);
    var S={rien:null,bocal:'comburant',sable:'comburant',ecarter:'combustible',eau:'chaleur',froid:'chaleur'}[g];
    var brule=g==='rien';
    return {brule:brule,sommet:S,txt:g==='rien'?'Le papier brûle : combustible, air et chaleur sont réunis.':g==='froid'?'Sans source de chaleur, le papier ne s’allume pas : il manque un sommet du triangle.':'La flamme s’éteint : le geste supprime le sommet « '+lib(C.SOMMETS,S).toLowerCase()+' ».'};
  };

  /* ---------- CHI-18 · règles de sécurité ---------- */
  C.SCENARIOS=[
    {id:'huile',label:'L’huile de la casserole prend feu',options:[['eau','Je jette de l’eau'],['couvercle','Je pose un couvercle et je coupe le gaz'],['souffle','Je souffle dessus'],['porte','J’ouvre grand la porte']],juste:'couvercle',
      retour:{eau:'Non : l’eau projette l’huile en feu et aggrave l’incendie.',couvercle:'Oui : le couvercle prive le feu d’air et couper le gaz retire la chaleur.',souffle:'Non : souffler apporte de l’air (comburant).',porte:'Non : plus d’air alimente le feu.'}},
    {id:'gaz',label:'Une odeur de gaz dans la cuisine',options:[['allumette','Je craque une allumette pour voir'],['robinet','Je ferme la bouteille, j’ouvre les fenêtres, j’alerte un adulte'],['lumiere','J’allume la lumière'],['rien','Je ne fais rien']],juste:'robinet',
      retour:{allumette:'Non : la flamme peut déclencher une explosion.',robinet:'Oui : couper le combustible, aérer, alerter.',lumiere:'Non : une étincelle peut déclencher l’explosion.',rien:'Non : le gaz s’accumule.'}},
    {id:'electrique',label:'Une prise électrique fume et prend feu',options:[['eau','Je jette de l’eau'],['couper','Je coupe le courant au disjoncteur et j’alerte'],['toucher','Je débranche à la main'],['ignorer','J’attends que ça s’arrête']],juste:'couper',
      retour:{eau:'Non : jamais d’eau sur un appareil électrique.',couper:'Oui : couper le courant puis alerter.',toucher:'Non : risque d’électrocution et de brûlure.',ignorer:'Non : le feu se propage.'}},
    {id:'vetement',label:'Le vêtement d’un camarade prend feu',options:[['courir','Il court'],['rouler','Il s’arrête, se couche et roule ; je le couvre d’un linge épais'],['souffler','Je souffle sur la flamme'],['eauSavon','Je cherche du savon']],juste:'rouler',
      retour:{courir:'Non : courir attise les flammes.',rouler:'Oui : rouler et couvrir étouffent le feu.',souffler:'Non : souffler apporte de l’air.',eauSavon:'Non : il faut agir tout de suite en étouffant.'}},
    {id:'fumee',label:'De la fumée remplit une pièce',options:[['debout','Je traverse debout'],['bas','Je sors en restant près du sol, je ferme la porte derrière moi'],['fenetre','J’ouvre toutes les fenêtres et je reste'],['cache','Je me cache sous le lit']],juste:'bas',
      retour:{debout:'Non : la fumée toxique est en haut de la pièce.',bas:'Oui : l’air est plus respirable près du sol ; fermer la porte ralentit le feu.',fenetre:'Non : l’air alimente le feu et je reste exposé.',cache:'Non : il faut sortir et alerter.'}},
    {id:'papier',label:'Un petit feu de papier dans une poubelle',options:[['sable','Je l’étouffe avec du sable ou un couvercle, puis j’alerte'],['porter','Je porte la poubelle dehors en courant'],['ventilateur','Je mets le ventilateur'],['rien','Je regarde']],juste:'sable',
      retour:{sable:'Oui : étouffer un petit feu, puis prévenir un adulte.',porter:'Non : les flammes peuvent me brûler et se propager.',ventilateur:'Non : l’air attise le feu.',rien:'Non : un petit feu devient un incendie.'}}];
  C.scenario=function(id){var s=C.SCENARIOS.filter(function(x){return x.id===id;})[0];if(!s)throw new Error('scénario inconnu : '+id);return s;};

  /* ---------- CHI-19 · pictogrammes ---------- */
  C.PICTOS=[
    {id:'inflammable',nom:'Inflammable',type:'danger',ou:'Bidon d’alcool à brûler, bidon d’essence',alt:'Losange rouge avec une flamme noire'},
    {id:'comburant',nom:'Comburant',type:'danger',ou:'Bouteille de '+C.gaz('oxygene')+' du dispensaire',alt:'Losange rouge avec une flamme au-dessus d’un cercle noir'},
    {id:'explosif',nom:'Explosif',type:'danger',ou:'Produits pyrotechniques, sous contrôle d’un adulte',alt:'Losange rouge avec une bombe qui explose'},
    {id:'gaz',nom:'Gaz sous pression',type:'danger',ou:'Bouteille de gaz butane',alt:'Losange rouge avec une bouteille horizontale'},
    {id:'corrosif',nom:'Corrosif',type:'danger',ou:'Étiquette d’un produit corrosif, sans le manipuler',alt:'Losange rouge avec un liquide versé sur une main et un métal'},
    {id:'toxique',nom:'Toxicité aiguë',type:'danger',ou:'Étiquette d’un produit toxique, sans le manipuler',alt:'Losange rouge avec un crâne et deux os croisés'},
    {id:'nocif',nom:'Nocif ou irritant',type:'danger',ou:'Étiquette d’un produit irritant, sans le manipuler',alt:'Losange rouge avec un point d’exclamation noir'},
    {id:'sante',nom:'Danger grave pour la santé',type:'danger',ou:'Étiquette d’un produit présentant un danger grave pour la santé',alt:'Losange rouge avec une silhouette et une étoile sur la poitrine'},
    {id:'environnement',nom:'Dangereux pour l’environnement',type:'danger',ou:'Étiquette d’un produit dangereux pour les milieux naturels',alt:'Losange rouge avec un arbre mort et un poisson'},
    {id:'extincteur',nom:'Extincteur',type:'consigne',ou:'Couloir du collège, laboratoire',alt:'Carré rouge avec un extincteur blanc'},
    {id:'sortie',nom:'Sortie de secours',type:'consigne',ou:'Au-dessus des portes de sortie',alt:'Rectangle vert avec un personnage qui court vers une porte'},
    {id:'flamme_interdite',nom:'Flamme nue interdite',type:'consigne',ou:'Près de la bouteille de gaz, au laboratoire',alt:'Cercle rouge barré sur une flamme'},
    {id:'urgence',nom:'Appel d’urgence',type:'consigne',ou:'Près du téléphone de l’administration',alt:'Carré vert avec un téléphone blanc'}];
  C.picto=function(id){var p=C.PICTOS.filter(function(x){return x.id===id;})[0];if(!p)throw new Error('pictogramme inconnu : '+id);return p;};
  C.TYPES_PICTO=[['danger','Signale un danger'],['consigne','Donne une consigne de sécurité']];

  /* ---------- utilitaires partagés avec les fiches ---------- */
  C.valides=function(st){return st.essais.filter(function(e){return typeof e.observation==='string'&&e.observation.trim().length>=10;});};
  C.distincts=function(liste,cle){var s={};liste.forEach(function(e){s[typeof cle==='function'?cle(e):e[cle]]=1;});return Object.keys(s).length;};
})();
