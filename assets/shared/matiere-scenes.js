/* NohobaLab · 6e Côte d'Ivoire · scènes de simulation du thème Matière : chaque scène rend un « montage » (réaliste) et un « schéma » (normalisé).
   scene.<nom>(valeurs) → {montage, schema} (deux chaînes SVG). Dessins originaux. */
(function(){
  'use strict';
  var M=window.NohobaMatiere,D=M.dessin,A=window.NohobaAtelier,INK='#243049',ROUGE='#D6221C';
  var S={},T=function(x,y,t,s,c,w,a){return A.T(x,y,t,s,c,w,a);};
  var real=function(m){return m!=='schema';};
  function pair(label,f){return function(v){var L=typeof label==='function'?label(v):label;return {montage:D.vue(f(v,'montage'),L),schema:D.vue(f(v,'schema'),L)};};}
  /* légende : seulement sur le schéma normalisé */
  function leg(m,x,y,t,anchor){return m==='schema'?T(x,y,t,13,INK,700,anchor||'middle'):'';}
  function trait(m,x1,y1,x2,y2){return m==='schema'?'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+INK+'" stroke-width="1.4"/>':'';}
  function sol(m){return '<line x1="20" y1="222" x2="440" y2="222" stroke="'+(real(m)?'#B8C2D2':INK)+'" stroke-width="3"/>';}
  var CL={eau:'#5BA8E0',huile:'#E6B93C'};

  /* solide dans un récipient : poser, incliner, verser (il ne coule pas) */
  S.solideRec=pair(function(v){return 'Montage : '+M.OBJETS[v.objet].nom+' dans '+M.RECIPIENTS[v.rec].nom+' ('+v.action+')';},function(v,m){
    var rot=v.action==='poser'?0:v.action==='incliner'?25:70,x=230,y=214,rad=rot*Math.PI/180,s=sol(m);
    s+=D.recipient(v.rec,x,y,{mode:m,incline:rot,sc:1.15});
    s+=D.solide(v.objet,x+Math.sin(rad)*14,y-Math.cos(rad)*14,{mode:m,rot:rot,sc:.95});
    if(v.action==='verser')s+=D.fleche(x+70,y-100,x+120,y-60,INK,2.5)+T(x+120,y-30,'rien ne coule',13,INK,700);
    s+=leg(m,x-110,y-120,'solide',"end")+trait(m,x-108,y-116,x-20,y-30);
    return s;});

  /* liquide : forme du récipient, surface libre horizontale */
  S.liquideRec=pair(function(v){return 'Montage : '+(v.liq==='huile'?'huile':'eau colorée')+' dans '+M.RECIPIENTS[v.rec].nom+(v.incl?' incliné':'');},function(v,m){
    var rot=v.incl?22:0,x=230,y=214,h=D.hauteur(v.rec,1.25),s=sol(m);
    s+=D.recipient(v.rec,x,y,{mode:m,incline:rot,sc:1.25,niveau:.5,liq:CL[v.liq]||CL.eau});
    var ys=y-h*.5*Math.cos(rot*Math.PI/180);
    s+='<line x1="'+(x-150)+'" y1="'+ys+'" x2="'+(x+150)+'" y2="'+ys+'" stroke="'+INK+'" stroke-width="1.6" stroke-dasharray="6 5"/>';
    s+=leg(m,x+155,ys-6,'surface libre','end');
    return s;});

  /* solide divisé / compact : verser, pincée, loupe, écraser */
  S.divise=pair(function(v){return 'Montage : '+M.OBJETS[v.objet].court+' ('+v.action+')';},function(v,m){
    var o=M.OBJETS[v.objet],s=sol(m),x=180;
    if(v.action==='loupe'){
      s+=(o.type==='divisé'?D.tas(v.objet,x-40,214,{mode:m,w:80,h:34}):D.solide(v.objet,x-40,214,{mode:m,sc:1.2}))+D.loupe(o.type==='divisé'?v.objet:'caillou',x+120,150,{mode:m});
      s+=leg(m,x+120,236,o.type==='divisé'?'chaque grain a sa forme':'un seul morceau');
    }else if(o.type==='divisé'){
      s+=D.tas(v.objet,x,214,{mode:m,w:v.action==='ecraser'?150:100,h:v.action==='ecraser'?22:44});
      if(v.action==='verser'){s+=D.recipient('becher',x+80,120,{mode:m,incline:55,sc:.8});s+=D.fleche(x,60,x,150,INK,2);}
      if(v.action==='pincee')s+=D.main(x+90,120,{mode:m,sc:.9});
      s+=leg(m,x,236,'tas de grains');
    }else{
      s+=D.solide(v.objet,x,214,{mode:m,sc:1.5});
      if(v.action==='verser')s+=D.recipient('becher',x+90,150,{mode:m,incline:60,sc:.8})+T(x+60,56,'il ne s’écoule pas',13,INK,700);
      s+=leg(m,x,236,'un seul bloc');
    }
    return s;});

  /* vignette d'un objet solide (compact ou divisé) pour les classements */
  S.objetSvg=function(id,label){var o=M.OBJETS[id],inner=o.type==='divisé'?D.tas(id,60,100,{mode:'montage',w:96,h:46}):D.solide(id,60,100,{mode:'montage',sc:1.8});return D.vue(inner,label,'0 0 120 120');};
  /* surface libre : eau ou sable sec, récipient posé ou incliné */
  S.surface=pair(function(v){return 'Montage : '+(v.matiere==='eau'?'eau':'sable sec')+' dans un bécher '+(v.etat==='incline'?'incliné':'posé');},function(v,m){
    var rot=v.etat==='incline'?20:0,x=230,y=214,s=sol(m),h=D.hauteur('becher',1.3);
    if(v.matiere==='eau'){
      s+=D.recipient('becher',x,y,{mode:m,incline:rot,sc:1.3,niveau:.5,liq:CL.eau});
      var ys=y-h*.5*Math.cos(rot*Math.PI/180);
      s+='<line x1="'+(x-130)+'" y1="'+ys+'" x2="'+(x+130)+'" y2="'+ys+'" stroke="'+INK+'" stroke-width="1.6" stroke-dasharray="6 5"/>'+leg(m,x+135,ys-6,'surface horizontale','end');
    }else{
      s+='<g transform="translate('+x+' '+y+') rotate('+rot+')">'+D.tas('sable',0,-4,{mode:m,w:92,h:52})+'</g>';
      s+=D.recipient('becher',x,y,{mode:m,incline:rot,sc:1.3});
      s+=leg(m,x+135,y-100,'tas : surface en pente','end');
    }
    return s;});

  /* verrerie : planche d'un récipient */
  S.verre=function(id,m){return D.recipient(id,60,112,{mode:m,sc:id==='tube'||id==='ballon'?.8:1})+(id==='cristallisoir'?'':'');};
  S.verrerieSvg=function(id,label){return D.vue(D.recipient(id,60,112,{mode:'montage',sc:id==='cristallisoir'?.7:id==='ballon'?.78:1}),label,'0 0 120 128');};

  /* air : verre renversé, ballon, seringue */
  S.air=pair(function(v){return 'Montage : '+M.air(v.exp).nom;},function(v,m){
    var s=sol(m),x=230,y=214;
    if(v.exp==='verre_droit'||v.exp==='verre_incline'){
      var inc=v.exp==='verre_incline';
      s+=D.recipient('cristallisoir',x,y,{mode:m,niveau:.9,liq:CL.eau,sc:1.45});
      s+=D.verreRenverse(x+(inc?-16:0),y-96,{mode:m,eauDans:inc?.55:.08,incline:inc?24:0,h:96,w:36});
      if(inc)s+=D.bulles(x+30,y-92,4,m);
      s+=leg(m,x+120,y-110,'air','start')+leg(m,x-110,y-70,'eau','end');
    }else if(v.exp==='ballon'){
      s+=D.ballon(130,150,28,{mode:m})+D.fleche(185,150,265,150,INK,3)+D.ballon(340,130,62,{mode:m})+T(130,230,'avant',13,INK,700)+T(340,230,'après',13,INK,700);
    }else{
      s+=D.seringue(100,150,{mode:m,bouchee:true,piston:1,fleches:2})+leg(m,230,100,'air enfermé');
    }
    return s;});

  /* seringue : appuyer, tirer, relâcher */
  S.seringue=pair(function(v){var r=M.seringue(v.bouchee,v.action);return 'Montage : seringue '+(v.bouchee?'bouchée':'ouverte')+', piston '+['','enfoncé','au repos','tiré'][r.piston];},function(v,m){
    var r=M.seringue(v.bouchee,v.action),s=sol(m);
    s+=D.seringue(70,150,{mode:m,bouchee:v.bouchee,piston:r.piston,fleches:v.bouchee&&r.volume==='réduit'?2:0});
    var tire=v.action.indexOf('tirer')===0,rel=/_relacher$/.test(v.action);
    if(rel)s+=D.fleche(120,100,80,100,ROUGE,3)+T(100,86,'je relâche',13,INK,700);
    else if(tire)s+=D.fleche(150,100,90,100,INK,3)+T(120,86,'je tire',13,INK,700);
    else s+=D.fleche(90,100,150,100,INK,3)+T(120,86,'j’appuie',13,INK,700);
    s+=leg(m,300,198,'air enfermé')+trait(m,300,184,270,160);
    return s;});

  /* pression qualitative : flèches de poussée et jauge */
  S.pression=pair(function(v){return 'Montage : seringue bouchée, volume d’air '+v.vol+' ; poussée '+M.pression(v.vol).jauge;},function(v,m){
    var p=M.pression(v.vol),pist={grand:3,moyen:2,petit:1}[v.vol],s=sol(m),k;
    s+=D.seringue(70,130,{mode:m,bouchee:true,piston:pist});
    for(k=0;k<p.fleches;k++){
      s+=D.fleche(150+k*28,126,150+k*28,96,ROUGE,2.5)+D.fleche(150+k*28,134,150+k*28,164,ROUGE,2.5);
    }
    s+=T(230,206,'poussée du gaz sur les parois : '+p.jauge,14,INK,800);
    for(k=0;k<3;k++)s+='<rect x="'+(150+k*50)+'" y="224" width="44" height="12" rx="3" fill="'+(k<p.niveau?(real(m)?ROUGE:INK):'none')+'" stroke="'+INK+'" stroke-width="1.8"/>';
    s+=T(120,235,'jauge',12,INK,700,'end');
    return s;});

  /* gaz : transvaser, recueillir, conserver */
  S.gaz=pair(function(v){return 'Montage : '+M.MONTAGES_GAZ.filter(function(x){return x[0]===v.montage;})[0][1]+' ('+(v.etape==='apres'?'après':'avant')+')';},function(v,m){
    var g=M.gazDeplaceEau(v.montage,v.etape),s=sol(m),x=230,y=214;
    s+=D.recipient('cristallisoir',x,y,{mode:m,niveau:.85,liq:CL.eau,sc:1.7});
    var ev=g.niveauEau==='haut'?1:.3;
    if(v.montage==='transvaser'){
      s+=D.verreRenverse(x,y-100,{mode:m,eauDans:ev,h:110,w:42});
      s+=D.recipient('tube',x+8,y-30,{mode:m,incline:v.etape==='apres'?-125:-80,sc:.55});
      if(g.bulles)s+=D.bulles(x,y-70,4,m);
    }else if(v.montage==='recueillir'){
      s+=D.verreRenverse(x,y-100,{mode:m,eauDans:ev,h:110,w:24});
      s+='<path d="M'+(x+190)+','+(y-70)+' H'+(x+60)+' Q'+(x+10)+','+(y-70)+' '+x+','+(y-60)+' L'+x+','+(y-50)+'" fill="none" stroke="'+(real(m)?'#E8A02A':INK)+'" stroke-width="6" stroke-linecap="round"/>'+leg(m,x+150,y-80,'tuyau vers le labogaz','end');
      if(g.bulles)s+=D.bulles(x,y-56,4,m);
    }else{
      s+=D.verreRenverse(x,y-100,{mode:m,eauDans:.3,h:110,w:24});
      if(g.bouche)s+='<rect x="'+(x-22)+'" y="'+(y-6)+'" width="44" height="12" rx="3" fill="'+(real(m)?'#B9722E':'none')+'" stroke="'+INK+'" stroke-width="2"/>';
    }
    s+=leg(m,x-120,y-110,'gaz (sans couleur)','end');
    return s;});

  /* toucher : une main passe d'un bac (froid, chaud ou rien) à l'eau tiède */
  S.toucher=pair(function(v){return 'Montage : la main plongée d’abord dans '+(v.avant==='froide'?'l’eau froide':v.avant==='chaude'?'l’eau agréablement chaude':'rien')+', puis dans l’eau tiède';},function(v,m){
    var s=sol(m);
    if(v.avant!=='aucune')s+=D.bac(110,214,{mode:m,liq:v.avant==='froide'?'#8FC9F0':'#F2B36A',glace:v.avant==='froide'})+D.main(110,120,{mode:m,sc:.9})+leg(m,110,238,v.avant==='froide'?'bac froid':'bac chaud');
    s+=D.bac(330,214,{mode:m,liq:'#9ED2E8'})+D.main(330,120,{mode:m,sc:.9,col:'#E8B48A'})+leg(m,330,238,'bac d’eau tiède');
    if(v.avant!=='aucune')s+=D.fleche(150,120,285,120,INK,3);
    var r=M.toucher(v.avant);s+=T(330,60,'« elle me paraît '+r.mainGauche+' »',14,INK,800);
    return s;});

  /* thermomètre de laboratoire : lecture à la graduation la plus proche */
  S.thermoLab=pair(function(v){return 'Montage : thermomètre de laboratoire, colonne à '+v.T+' °C';},function(v,m){
    var s=D.thermometre(130,30,{mode:m,type:'lab',T:v.T,h:170})+D.thermometre(330,30,{mode:m,type:'lab',T:v.T,h:170,zoom:true});
    s+=T(130,250,'−10 °C à 110 °C',12,INK,700)+T(330,250,'zoom : 1 trait = 1 °C',12,INK,700);
    if(m==='schema'){s+=D.repere(70,60,'A')+trait(m,84,60,120,60)+D.repere(70,150,'B')+trait(m,84,150,126,150)+D.repere(200,95,'C')+trait(m,186,95,152,95)+D.repere(60,232,'D')+trait(m,74,230,112,222);}
    return s;});

  /* repérer une température : air de la salle, eau d'un bac */
  S.repererTemp=pair(function(v){var r=M.repererTemp(v.milieu,v.moment);return 'Montage : thermomètre dans '+(v.milieu==='air'?'l’air de la salle':'l’eau d’un bac')+', valeur lue '+r.valeur+' °C (simulée)';},function(v,m){
    var r=M.repererTemp(v.milieu,v.moment),s=sol(m),x=200;
    if(v.milieu==='eau')s+=D.recipient('becher',x,214,{mode:m,niveau:.7,liq:CL.eau,sc:1.6});
    s+=D.thermometre(x,v.milieu==='eau'?20:30,{mode:m,type:'lab',T:r.valeur,h:v.milieu==='eau'?150:170});
    s+=T(330,110,r.valeur+' °C',28,INK,800)+T(330,138,r.stable?'colonne immobile':'la colonne bouge encore',13,INK,700)+T(330,160,'(valeur simulée)',12,INK,400);
    return s;});

  /* repères : glace fondante, eau qui bout (démonstration du professeur) */
  S.reperes=pair(function(v){var r=M.reperes(v.milieu,v.moment);return 'Montage : thermomètre dans '+(v.milieu==='glace'?'de l’eau avec de la glace qui fond':'de l’eau qui bout')+', valeur '+r.valeur+' °C (simulée)';},function(v,m){
    var r=M.reperes(v.milieu,v.moment),s=sol(m),x=190;
    if(v.milieu==='glace'){s+=D.recipient('becher',x,214,{mode:m,niveau:.7,liq:'#A8D6F0',sc:1.6})+D.glacons(x+20,y0(),4,m);}
    else{s+=D.recipient('ballon',x,214,{mode:m,niveau:.55,liq:CL.eau,sc:1.35})+D.bulles(x+20,170,4,m)+'<path d="M'+(x-50)+',214 L'+(x+50)+',214" stroke="'+INK+'" stroke-width="3"/>';}
    s+=D.thermometre(x-26,18,{mode:m,type:'lab',T:r.valeur,h:150});
    s+=T(350,110,r.valeur+' °C',28,INK,800)+T(350,138,r.palier?'la valeur ne bouge plus':'la colonne bouge encore',13,INK,700)+T(350,160,'(valeur simulée)',12,INK,400);
    return s;
    function y0(){return 150;}
  });

  /* thermomètre médical : comparer, secouer, lire */
  S.medical=pair(function(v){var r=M.medical(v.etat,v.action);return 'Montage : thermomètre médical, colonne à '+r.valeur+' °C';},function(v,m){
    var r=M.medical(v.etat,v.action),s=D.thermometre(330,30,{mode:m,type:'med',T:r.valeur,h:180})+D.thermometre(110,30,{mode:m,type:'lab',T:23,h:180});
    s+=T(110,250,'laboratoire',13,INK,700)+T(330,250,'médical',13,INK,700)+T(215,130,'échelle 35 à 42',12,INK,700)+T(215,148,'au dixième',12,INK,700);
    if(v.action==='secouer')s+=D.fleche(260,60,260,100,INK,3)+T(260,50,'secouer',13,INK,700);
    return s;});

  /* température du corps : relevé fictif */
  S.corps=pair(function(v){var r=M.corps(v.pers,v.secoue,v.duree);return 'Montage : relevé fictif de '+v.nom+', thermomètre médical à '+r.valeur+' °C';},function(v,m){
    var r=M.corps(v.pers,v.secoue,v.duree),s=D.thermometre(330,30,{mode:m,type:'med',T:r.valeur,h:180});
    s+=D.objet('eleve',120,150,2.4)+T(120,230,v.nom,14,INK,800)+T(215,100,v.duree==='courte'?'30 s':'2 à 3 min',16,INK,800)+T(215,120,'d’attente',12,INK,700);
    s+=T(330,250,r.fiable?'lecture fiable':'lecture à refaire',13,r.fiable?'#1E7A3B':ROUGE,800)+T(215,170,(v.secoue?'secoué':'non secoué'),13,INK,700);
    return s;});

  /* solidification : tube dans un mélange réfrigérant */
  S.solidification=pair(function(v){var r=M.solidification(v.instant);return 'Montage : tube d’eau dans un mélange réfrigérant, thermomètre à '+r.T+' °C (valeur simulée)';},function(v,m){
    var r=M.solidification(v.instant),s=sol(m),x=190;
    s+=D.recipient('becher',x,214,{mode:m,niveau:.65,liq:'#B8DDF2',sc:1.7});
    s+=D.glacons(x-20,150,5,m)+D.glacons(x+30,168,3,m);
    var etat=v.instant;
    s+=D.recipient('tube',x,196,{mode:m,sc:1.15,niveau:.55,liq:etat==='solide'||etat==='croit'?'#F4FAFF':CL.eau});
    if(etat==='apparait'||etat==='croit'||etat==='solide')s+=D.points(x-12,150,24,etat==='solide'?30:18,18);
    s+=D.thermometre(x,36,{mode:m,type:'lab',T:r.T,h:110});
    s+=T(350,100,r.T+' °C',26,INK,800)+T(350,128,'thermomètre du tube',12,INK,700)+T(350,146,'(valeur simulée)',12,INK,400);
    s+=leg(m,x+120,226,'mélange réfrigérant','start');
    return s;});

  /* fusion : glace pilée qui fond */
  S.fusion=pair(function(v){var r=M.fusion(v.instant);return 'Montage : glace pilée qui fond, thermomètre à '+r.T+' °C (valeur simulée)';},function(v,m){
    var r=M.fusion(v.instant),s=sol(m),x=190,k={debut:7,milieu:5,presque:2,fini:0,plus_tard:0}[v.instant],niv={debut:.18,milieu:.35,presque:.5,fini:.55,plus_tard:.55}[v.instant];
    s+=D.recipient('becher',x,214,{mode:m,niveau:niv,liq:'#A8D6F0',sc:1.7});
    s+=D.glacons(x,150,k,m);
    s+=D.thermometre(x-24,30,{mode:m,type:'lab',T:r.T,h:130});
    s+=T(350,100,r.T+' °C',26,INK,800)+T(350,128,r.glace?'il reste de la glace':'plus de glace',13,INK,700)+T(350,146,'(valeur simulée)',12,INK,400);
    return s;});

  /* variation de volume : tube gradué */
  S.volume=pair(function(v){return 'Montage : tube contenant de l’eau — '+M.volumeEau(v.etat).niveau;},function(v,m){
    var r=M.volumeEau(v.etat),x=200,y=216,h=D.hauteur('tube',1.5),base=.5,niv=base*(r.niv===2?1.09:1),s=sol(m),ys=y-h*base;
    s+=D.recipient('tube',x,y,{mode:m,sc:1.5,niveau:niv,liq:v.etat==='solide'?'#EAF6FF':CL.eau});
    if(v.etat==='solide')s+=D.points(x-12,y-h*niv+4,24,h*niv-30,22);
    s+='<line x1="'+(x-60)+'" y1="'+ys+'" x2="'+(x+60)+'" y2="'+ys+'" stroke="'+ROUGE+'" stroke-width="2" stroke-dasharray="6 4"/>'+T(x+66,ys+4,'niveau de départ',12,ROUGE,700,'start');
    if(v.etat==='solide')s+=D.fleche(x-70,ys,x-70,y-h*niv,INK,2.5)+T(x-78,ys-18,'un peu plus de place',12,INK,700,'end');
    return s;});

  /* masse : balance, glace avant, eau après */
  S.masse=pair(function(v){var r=M.masse(v.etat,v.couvert);return 'Montage : balance indiquant '+r.m+' g (valeur simulée)';},function(v,m){
    var r=M.masse(v.etat,v.couvert),s=sol(m),x=230;
    s+=D.balance(x,190,{mode:m,texte:r.m+' g'});
    s+=D.recipient('becher',x,138,{mode:m,sc:.9,niveau:v.etat==='eau'?.4:.35,liq:'#A8D6F0'});
    if(v.etat==='glace')s+=D.glacons(x,108,3,m);
    if(v.couvert)s+='<rect x="'+(x-44)+'" y="40" width="88" height="8" rx="3" fill="'+(real(m)?'#9AA7BA':'none')+'" stroke="'+INK+'" stroke-width="2"/>'+leg(m,x+60,50,'couvercle','start');
    s+=T(x,246,'(valeur simulée)',12,INK,400);
    return s;});

  /* vaporisation et condensation */
  S.vapo=pair(function(v){return 'Montage : '+M.EXPERIENCES_VAPO.filter(function(x){return x[0]===v.exp;})[0][1]+(v.moment==='tard'?' (plus tard)':' (au départ)');},function(v,m){
    var r=M.vaporisation(v.exp,v.moment),s=sol(m),x=200,niv={haut:.7,moyen:.45,bas:.2}[r.niveau];
    if(v.exp==='evap_soleil'||v.exp==='evap_ombre'){
      s+=D.recipient('cristallisoir',x,214,{mode:m,niveau:niv,liq:CL.eau,sc:1.7});
      s+=v.exp==='evap_soleil'?'<circle cx="360" cy="52" r="22" fill="'+(real(m)?'#FFC83D':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>'+T(360,100,'soleil',12,INK,700):'<path d="M300,60 Q300,36 326,36 Q336,20 358,26 Q382,24 384,50 Q394,60 380,66 H306 Q296,66 300,60 Z" fill="'+(real(m)?'#C6CFDB':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>'+T(342,100,'ombre',12,INK,700);
      s+='<line x1="'+(x-86)+'" y1="'+(214-D.hauteur('cristallisoir',1.7)*.7)+'" x2="'+(x+86)+'" y2="'+(214-D.hauteur('cristallisoir',1.7)*.7)+'" stroke="'+ROUGE+'" stroke-width="1.6" stroke-dasharray="6 4"/>'+T(x+92,214-D.hauteur('cristallisoir',1.7)*.7+4,'niveau de départ',12,ROUGE,700,'start');
    }else if(v.exp==='ebullition'){
      s+=D.recipient('ballon',x,200,{mode:m,niveau:.55,liq:CL.eau,sc:1.35});
      s+='<path d="M'+(x-70)+',212 L'+(x-50)+',200 L'+(x+50)+',200 L'+(x+70)+',212 Z" fill="'+(real(m)?'#6B7280':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>'+D.objet('flamme',x,222,.8);
      if(r.bulles)s+=D.bulles(x+16,180,5,m);
      s+=D.thermometre(x-26,12,{mode:m,type:'lab',T:r.T,h:120})+T(350,110,r.T+' °C',26,INK,800)+T(350,136,'(valeur simulée)',12,INK,400)+T(350,170,'démonstration du professeur',12,ROUGE,800);
    }else{
      s+=D.recipient('ballon',x,214,{mode:m,niveau:.5,liq:CL.eau,sc:1.2});
      s+='<rect x="'+(x-70)+'" y="40" width="140" height="12" rx="3" fill="'+(real(m)?'rgba(190,220,245,.6)':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>'+leg(m,x+78,50,'paroi froide','start');
      s+=[-30,0,30].map(function(dx){return '<path d="M'+(x+dx)+',120 Q'+(x+dx+8)+',100 '+(x+dx)+',80 Q'+(x+dx-8)+',62 '+(x+dx)+',56" fill="none" stroke="'+(real(m)?'#B9C2D0':INK)+'" stroke-width="2.5" stroke-dasharray="3 5"/>';}).join('');
      if(r.gouttes)s+=[-40,-14,12,40].map(function(dx){return '<path d="M'+(x+dx)+',58 q-5,8 0,12 q5,-4 0,-12 Z" fill="'+(real(m)?'#5BA8E0':'none')+'" stroke="'+INK+'" stroke-width="1.5"/>';}).join('');
      s+=leg(m,x-80,150,'vapeur d’eau (gaz invisible)','end');
    }
    return s;});

  /* aimant */
  S.aimant=pair(function(v){var r=M.aimant(v.mat);return 'Montage : aimant approché de '+M.MATERIAUX[v.mat].nom.toLowerCase()+' — '+(r.attire?'il est attiré':'il n’est pas attiré');},function(v,m){
    var r=M.aimant(v.mat),s=sol(m),x=230;
    s+='<path d="M'+(x-30)+',70 L'+(x-30)+',116 Q'+(x-30)+',140 '+x+',140 Q'+(x+30)+',140 '+(x+30)+',116 L'+(x+30)+',70" fill="none" stroke="'+(real(m)?'#B8B8C0':INK)+'" stroke-width="16"/>';
    s+='<rect x="'+(x-38)+'" y="60" width="16" height="22" fill="'+(real(m)?ROUGE:'none')+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x+22)+'" y="60" width="16" height="22" fill="'+(real(m)?'#3A6EC4':'none')+'" stroke="'+INK+'" stroke-width="2"/>'+T(x-30,56,'N',12,INK,800)+T(x+30,56,'S',12,INK,800);
    var dy=r.attire?-8:0;
    s+='<g transform="translate(0 '+dy+')">'+D.solide(v.mat==='fer'?'clou':v.mat==='bois'?'bois':v.mat==='verre'?'caillou':'gomme',x,r.attire?190:214,{mode:m,sc:1.2})+'</g>';
    if(r.attire)s+=D.fleche(x,200,x,150,INK,2.5);
    s+=leg(m,x+90,200,M.MATERIAUX[v.mat].court,'start');
    return s;});

  /* conduction de la chaleur : tige dont un bout trempe dans l'eau chaude */
  S.chaleur=pair(function(v){return 'Montage : tige de '+M.MATERIAUX[v.mat].court.toLowerCase()+' dont un bout est dans l’eau chaude';},function(v,m){
    var r=M.chaleur(v.mat,v.instant),s=sol(m),k;
    s+=D.recipient('becher',90,214,{mode:m,niveau:.7,liq:'#F2B36A',sc:1.2});
    var col=r.conduit?(v.instant==='long'?['#E8461E','#EE6B2C','#F59A4A','#F8BE78','#FBD9A5']:['#EE6B2C','#F59A4A','#FBD9A5','#E3E7EE','#E3E7EE']):['#F8BE78','#E3E7EE','#E3E7EE','#E3E7EE','#E3E7EE'];
    for(k=0;k<5;k++)s+='<rect x="'+(90+k*62)+'" y="96" width="62" height="16" fill="'+(real(m)?col[k]:(k<(r.conduit?(v.instant==='long'?5:3):1)?'url(#nlh)':'none'))+'" stroke="'+INK+'" stroke-width="2"/>';
    s+=leg(m,230,86,'tige de '+M.MATERIAUX[v.mat].court.toLowerCase())+T(402,130,'bout libre',12,INK,700,'end')+T(402,148,r.chaud,13,INK,800,'end');
    return s;});

  /* flotte ou coule : morceaux de plastique dans l'eau */
  var COUL={bouchon:'#2E7BC4',bouteille:'#CFE6F2',sachet:'#E5E5E5',tuyau:'#8E96A3',mousse:'#FFFFFF'};
  S.flotte=pair(function(v){var r=M.flotte(v.id);return 'Montage : '+M.PLASTIQUES.filter(function(p){return p.id===v.id;})[0].nom.toLowerCase()+' dans l’eau — '+(r.flotte?'il flotte':'il coule');},function(v,m){
    var r=M.flotte(v.id),s=sol(m),x=230,y=214,h=D.hauteur('becher',1.7);
    s+=D.recipient('becher',x,y,{mode:m,niveau:.62,liq:CL.eau,sc:1.7});
    var yo=r.flotte?y-h*.62-8:y-16;
    s+='<rect x="'+(x-22)+'" y="'+yo+'" width="44" height="'+(v.id==='sachet'?8:16)+'" rx="'+(v.id==='bouchon'?8:3)+'" fill="'+(real(m)?COUL[v.id]:'none')+'" stroke="'+INK+'" stroke-width="2.2"/>';
    s+=leg(m,x+130,yo+10,r.flotte?'flotte : plus léger que l’eau':'coule : plus lourd que l’eau','start');
    return s;});

  /* cycle de l'eau : paysage avec quatre repères A à D */
  S.cycle=pair('Schéma : cycle de l’eau — mer et lagune, soleil, nuage, pluie, rivière',function(v,m){
    var r=real(m),s='<rect x="0" y="176" width="460" height="84" fill="'+(r?'#3C8DC9':'url(#nlh)')+'" opacity="'+(r?.88:1)+'"/>';
    s+='<path d="M300,176 L350,86 L388,132 L416,106 L460,176 Z" fill="'+(r?'#7C8F6A':'none')+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M0,176 H460" stroke="'+INK+'" stroke-width="2.5"/>';
    s+='<circle cx="52" cy="40" r="22" fill="'+(r?'#FFC83D':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>';
    s+='<path d="M180,66 Q180,44 204,44 Q212,26 236,32 Q256,26 264,46 Q288,48 286,66 Z" fill="'+(r?'#E8EEF5':'none')+'" stroke="'+INK+'" stroke-width="2.5"/>';
    s+=[200,216,232,248].map(function(px){return '<line x1="'+px+'" y1="76" x2="'+(px-6)+'" y2="98" stroke="'+(r?'#3A6EC4':INK)+'" stroke-width="2.5"/>';}).join('');
    s+='<path d="M372,176 Q360,206 392,236" fill="none" stroke="'+(r?'#7DB8D8':INK)+'" stroke-width="5"/>';
    s+=D.fleche(110,168,160,80,ROUGE,3)+D.fleche(300,110,290,130,INK,0.1)+D.fleche(360,170,300,214,INK,3);
    s+=D.repere(150,128,'A')+D.repere(206,22,'B')+D.repere(234,112,'C')+D.repere(318,208,'D');
    return s;});

  /* produit d'illustration avec son étiquette (pictogrammes) */
  S.produit=function(id){
    var p=M.PRODUITS.filter(function(x){return x.id===id;})[0],s='',k;
    var corps={desodorisant:'<rect x="70" y="50" width="50" height="130" rx="10" fill="#9FD3C7" stroke="#243049" stroke-width="2.5"/><rect x="86" y="30" width="18" height="22" rx="3" fill="#7A828F" stroke="#243049" stroke-width="2"/>',antimoustiques:'<rect x="70" y="50" width="50" height="130" rx="10" fill="#F2C94C" stroke="#243049" stroke-width="2.5"/><rect x="86" y="30" width="18" height="22" rx="3" fill="#7A828F" stroke="#243049" stroke-width="2"/>',sulfate:'<path d="M85,34 H105 V56 L124,70 V176 Q124,182 118,182 H72 Q66,182 66,176 V70 L85,56 Z" fill="#CFE6F2" stroke="#243049" stroke-width="2.5"/><rect x="82" y="26" width="26" height="10" rx="2" fill="#2E7BC4" stroke="#243049" stroke-width="2"/>',soude:'<path d="M85,34 H105 V56 L124,70 V176 Q124,182 118,182 H72 Q66,182 66,176 V70 L85,56 Z" fill="#EDEDED" stroke="#243049" stroke-width="2.5"/><rect x="82" y="26" width="26" height="10" rx="2" fill="#D6221C" stroke="#243049" stroke-width="2"/>'}[id];
    s+=corps+'<rect x="72" y="92" width="46" height="62" rx="4" fill="#fff" stroke="#243049" stroke-width="1.5"/>';
    p.pictos.forEach(function(q,i){s+=D.picto(q,95,(p.pictos.length===1?122:106+i*30),p.pictos.length===1?36:28);});
    return D.vue(s,'Flacon d’illustration : '+p.nom+' ; étiquette fictive portant '+p.pictos.length+' pictogramme(s) : '+p.pictos.map(function(q){return M.PICTOS.filter(function(z){return z.id===q;})[0].alt.toLowerCase();}).join(' ; '),'0 0 190 200');
  };

  M.scene=S;
})();
