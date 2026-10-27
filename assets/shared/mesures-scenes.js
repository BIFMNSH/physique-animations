/* NohobaLab · 6e Côte d'Ivoire · scènes du thème « Mesure de grandeurs physiques » : chaque scène rend un « montage » (réaliste)
   et un « schéma » (normalisé, légendé). scene.<nom>(valeurs) → {montage, schema}. Valeurs simulées, signalées comme telles. */
(function(){
  'use strict';
  var Q=window.NohobaMesures,D=Q.dessin,A=window.NohobaAtelier,INK='#243049';
  var S={},T=function(x,y,t,s,c,w,a){return A.T(x,y,t,s||12,c||INK,w||700,a||'middle');};
  function pair(label,f){return function(v){var L=typeof label==='function'?label(v):label;return {montage:D.vue(f(v,'montage'),L),schema:D.vue(f(v,'schema'),L)};};}
  function leg(m,x,y,t,a){return m==='schema'?T(x,y,t,12,INK,700,a):'';}
  function sim(){return T(230,252,'(valeurs simulées)',11,INK,400);}

  /* MES-01 · capacités : bouteilles, gobelets, cubes */
  S.capacite=pair(function(v){return 'Montage : '+Q.EXP_CAPACITE.filter(function(e){return e[0]===v.exp;})[0][1];},function(v,m){
    var r=Q.capacite(v.exp),s=D.sol(m,232),b=r.objet;
    if(/_mes$/.test(v.exp)){s+=D.bouteille(b,110,230,{mode:m,vide:true})+D.fleche(160,110,230,130,INK,2.5)+D.verreMesureur(320,230,{mode:m,litres:r.litres});s+=leg(m,110,250,b==='haute'?'bouteille haute (vide)':'bouteille large (vide)')+leg(m,320,250,'verre mesureur');}
    else if(/_gob$/.test(v.exp)){s+=D.bouteille(b,80,230,{mode:m,vide:true});for(var i=0;i<r.gobelets;i++)s+=D.gobelet(170+i*62,214,{mode:m,plein:true});s+=leg(m,270,120,r.gobelets+' gobelets de 0,25 L');}
    else if(v.exp==='cube_dm3'){s+=D.cube(60,226,120,{mode:m,plein:false})+T(120,250,'cube creux de 1 dm³ (10 cm d’arête)',11,INK,700)+D.fleche(220,130,262,150,INK,2.5)+D.verreMesureur(340,230,{mode:m,litres:1,liq:'#5BA8E0'});}
    else{s+=D.cube(90,170,26,{mode:m,plein:true})+T(103,196,'cube de 1 cm³',11,INK,700)+D.fleche(140,150,196,150,INK,2.5)+D.seringue1(260,150,{mode:m,plein:true});}
    return s+T(230,30,r.lu,16,INK,800);});

  /* MES-02 · lecture d'une éprouvette, avec zoom sur le ménisque */
  S.lecture=pair(function(v){var e=Q.EPROUVETTES[v.id];return 'Montage : '+e.nom+' contenant de l’eau colorée, zoom sur le ménisque'+(v.oeil?' ; '+Q.OEIL.filter(function(o){return o[0]===v.oeil;})[0][1].toLowerCase():'');},function(v,m){
    var ep=D.eprouvette(110,236,{id:v.id,V:v.V,mode:m,H:180}),s=D.sol(m,236,30,200)+ep.svg,yv=ep.py(v.V);
    s+='<rect x="'+(ep.x-ep.hw-6)+'" y="'+(yv-16)+'" width="'+(2*ep.hw+12)+'" height="32" fill="none" stroke="#C2410C" stroke-width="2" stroke-dasharray="4 3"/>';
    s+='<line x1="'+(ep.x+ep.hw+6)+'" y1="'+(yv-16)+'" x2="238" y2="30" stroke="#C2410C" stroke-width="1.5"/><line x1="'+(ep.x+ep.hw+6)+'" y1="'+(yv+16)+'" x2="238" y2="230" stroke="#C2410C" stroke-width="1.5"/>';
    s+=D.zoom(238,30,{id:v.id,V:v.V,oeil:v.oeil||'niveau',mode:m,w:210,h:200});
    s+=leg(m,346,246,'zoom : bas du ménisque');
    return s;});

  /* MES-02 · le même liquide dans trois récipients gradués */
  S.recipients=pair(function(v){return 'Montage : 63 mL d’eau colorée (valeur simulée) dans '+Q.RECIPIENTS_GRADUES.filter(function(r){return r.id===v.rec;})[0].nom.toLowerCase();},function(v,m){
    var s=D.sol(m,232),V=Q.V_KOFI;
    if(v.rec==='becher')s+=D.becherGradue(200,230,{mode:m,V:V,sc:1.6,cap:120});
    else if(v.rec==='verre')s+=D.verreMesureur(200,230,{mode:m,litres:V/1000,cap:500,pas:50,liq:'#5BA8E0'});
    else s+=D.eprouvette(200,232,{id:'A',V:V,mode:m,H:190}).svg;
    var r=Q.mesureRecipient(v.rec);s+=r.precis?T(350,110,r.valeur+' mL',18,INK,800)+T(350,134,'à 1 mL près',12,INK,700):T(350,110,'entre '+r.min+' et '+r.max+' mL',15,INK,800)+T(350,134,'un trait tous les '+r.pas+' mL',12,INK,700);
    return s+sim();});

  /* MES-03 · déplacement d'eau : avant (V₁) et après (V₂), côte à côte */
  function dansEprouvette(id,x,yv,m,phase){
    if(phase==='avant')return '';
    if(id==='sucre')return D.sucre(x,yv+70,m,true);
    if(id==='bouchon')return D.bouchon(x,yv-2,m);
    if(id==='cle')return D.cle(x,218,m);
    if(id==='pate_boule')return '<circle cx="'+x+'" cy="212" r="11" fill="'+(m==='schema'?'none':'#4FA37A')+'" stroke="'+INK+'" stroke-width="2"/>';
    if(id==='pate_galette')return '<ellipse cx="'+x+'" cy="218" rx="15" ry="4" fill="'+(m==='schema'?'none':'#4FA37A')+'" stroke="'+INK+'" stroke-width="2"/>';
    if(id==='caillou_long')return '<path d="M'+(x-8)+' 222 L'+(x-10)+' 140 L'+(x+2)+' 132 L'+(x+10)+' 146 L'+(x+8)+' 222 Z" fill="'+(m==='schema'?'none':'#8E949D')+'" stroke="'+INK+'" stroke-width="2"/>';
    return '<path d="M'+(x-12)+' 222 L'+(x-14)+' 208 L'+(x-4)+' 198 L'+(x+10)+' 202 L'+(x+13)+' 216 L'+(x+8)+' 222 Z" fill="'+(m==='schema'?'none':'#8E949D')+'" stroke="'+INK+'" stroke-width="2"/>';
  }
  S.deplacement=pair(function(v){var s=Q.SOLIDES.filter(function(x){return x.id===v.solide;})[0],d=Q.deplacement(v.solide);return 'Montage : éprouvette avant ('+d.V1+' mL) et après avoir plongé '+s.nom+' ('+d.V2+' mL)';},function(v,m){
    var d=Q.deplacement(v.solide),s=D.sol(m,236),a=D.eprouvette(120,236,{id:'A',V:d.V1,mode:m,H:180}),b=D.eprouvette(320,236,{id:'A',V:d.V2,mode:m,H:180});
    s+=a.svg+b.svg+dansEprouvette(v.solide,320,b.py(d.V2),m,'apres');
    s+=T(196,92,'Avant : V₁',13,INK,800)+T(400,92,'Après : V₂',13,INK,800)+D.fleche(176,130,268,130,INK,2.5);
    return s+leg(m,230,250,'même éprouvette, lecture au bas du ménisque');});

  /* MES-03 · pour aller plus loin */
  S.plusLoin=pair(function(v){return 'Montage : '+Q.PLUS_LOIN.filter(function(x){return x[0]===v.exp;})[0][1];},function(v,m){
    var r=Q.plusLoin(v.exp),s=D.sol(m,236);
    if(v.exp==='lest_seul'||v.exp==='lest_bouchon'||v.exp==='huile_sucre'){
      var V=v.exp==='lest_seul'?56:v.exp==='lest_bouchon'?66:56,e=D.eprouvette(160,236,{id:'A',V:V,mode:m,H:180,liq:v.exp==='huile_sucre'?'#E6B93C':null});
      s+=e.svg;
      if(v.exp!=='huile_sucre')s+=D.ecrou(160,214,m);
      if(v.exp==='lest_bouchon')s+='<line x1="160" y1="205" x2="160" y2="192" stroke="'+INK+'" stroke-width="1.5"/>'+D.bouchon(160,184,m);
      if(v.exp==='huile_sucre')s+=D.sucre(160,214,m,false);
      s+=T(330,110,V+' mL',22,INK,800);
    }else if(v.exp==='trop_plein'){m==='schema'&&(s+=T(150,30,'vase à trop-plein',12,INK,700)+T(330,30,'eau recueillie',12,INK,700));s+=D.tropPlein(150,236,{mode:m,objet:true,deborde:true})+D.verreMesureur(330,236,{mode:m,litres:0.32,cap:500,pas:50,liq:'#5BA8E0'});}
    else{s+='<path d="M90 236 V196 Q90 186 100 186 H260 Q270 186 270 196 V236" fill="'+(m==='schema'?'none':'rgba(190,220,245,.28)')+'" stroke="'+INK+'" stroke-width="2.5"/><rect x="92" y="200" width="176" height="34" fill="'+(m==='schema'?'url(#nlh)':'#5BA8E0')+'" opacity=".7"/>';
      s+='<path d="M162 214 V30 H198 V214" fill="none" stroke="'+INK+'" stroke-width="2.5"/>'+[0,1,2,3,4,5,6,7].map(function(k){return '<line x1="198" y1="'+(46+k*20)+'" x2="188" y2="'+(46+k*20)+'" stroke="'+INK+'" stroke-width="1.4"/>';}).join('')+'<rect x="164" y="132" width="32" height="80" fill="'+(m==='schema'?'url(#nlh)':'#5BA8E0')+'" opacity=".7"/>';
      s+='<path d="M60 120 Q120 120 150 200 L176 220" fill="none" stroke="'+(m==='schema'?INK:'#E8A02A')+'" stroke-width="5" stroke-linecap="round"/>'+T(300,110,'air expiré ≈ 400 mL',14,INK,800)+leg(m,180,22,'éprouvette retournée, graduée');}
    return s+T(230,252,'Pour aller plus loin · valeurs simulées',11,INK,400);});

  /* MES-04 · solide de forme simple, posé contre la règle pour chaque dimension */
  S.forme=pair(function(v){var f=Q.forme(v.id);return 'Montage : '+f.nom+' et trois mesures à la règle graduée';},function(v,m){
    var f=Q.forme(v.id),s='',px=f.type==='cylindre'&&f.d>6?11:16,col={cube:'#C99A5B',pave:'#9AA2AD',allumettes:'#E7D7B0',cylindre:'#9AA2AD',conserve:'#B9C2D0'}[v.id]||'#9AA2AD';
    if(f.type==='cube')s+=D.pave(30,200,f.a,f.a,f.a,22,{mode:m,col:col});
    else if(f.type==='pave')s+=D.pave(24,200,f.L,f.l,f.h,22,{mode:m,col:col});
    else s+=D.cylindre(100,214,f.d,f.h,f.d>6?14:22,{mode:m,col:col,conserve:v.id==='conserve'});
    var dims=Q.dimensions(v.id),y0=46,pxr=f.type==='cylindre'&&f.d>6?20:28,Lr=f.type==='cylindre'&&f.d>6?10:6;
    dims.forEach(function(d,i){s+=D.regle(248,y0+i*72,Lr,pxr,{mode:m,barre:d[2],col:col,titre:''})+T(248+Lr*pxr/2,y0+i*72-22,d[1],12,INK,800);});
    return s;});
  S.cubes=pair(function(v){return 'Montage : pavé 4 × 3 × 2 rempli de '+Q.cubesPave(v.couches).total+' cubes de 1 cm³';},function(v,m){
    var r=Q.cubesPave(v.couches),s=D.sol(m,232)+D.cubesUnites(80,226,v.couches,40,{mode:m});
    return s+T(370,110,r.total+' cubes',22,INK,800)+T(370,136,'de 1 cm³',13,INK,700);});
  S.controleEau=pair(function(v){var f=Q.forme(v.id);return 'Montage : contrôle par l’eau du volume de '+f.nom;},function(v,m){
    var c=Q.controleEau(v.id),s=D.sol(m,236),a=D.eprouvette(120,236,{id:'B',V:c.V1,mode:m,H:180}),b=D.eprouvette(320,236,{id:'B',V:c.V2,mode:m,H:180});
    s+=a.svg+b.svg+(v.id==='pave'?D.pave(306,222,1.4,1,1,20,{mode:m}):'<rect x="312" y="196" width="16" height="26" fill="'+(m==='schema'?'none':'#9AA2AD')+'" stroke="'+INK+'" stroke-width="2"/>');
    return s+T(200,92,'V₁ = '+c.V1+' cm³',13,INK,800)+T(404,92,'V₂ = '+c.V2+' cm³',13,INK,800)+sim();});

  /* MES-05 · balance électronique : forme de la pâte, coton et fer */
  S.masse5=pair(function(v){var r=Q.masseObjet(v.obj);return 'Montage : balance électronique indiquant '+r.m+' g (valeur simulée)';},function(v,m){
    var r=Q.masseObjet(v.obj),s=D.sol(m,232),id={boule:'pate_boule',galette:'pate_galette',morceaux:'pate_morceaux',coton:'coton',fer:'fer'}[v.obj];
    s+=D.electronique(230,212,(r.m>=1000?'1 000':r.m)+' g',[id],m);
    return s+leg(m,330,200,'balance électronique','start')+sim();});

  /* MES-06 · principe : quel plateau descend ? */
  S.principe=pair(function(v){var e=Q.equilibre(Q.charge(v.g).m,Number(v.d));return 'Montage : balance de Roberval, '+(v.g==='vide'?'plateau gauche vide':'boîte de 100 g à gauche')+', '+v.d+' g de masses marquées à droite ; '+e.txt;},function(v,m){
    var md=Number(v.d),e=Q.equilibre(Q.charge(v.g).m,md),masses=Q.decroissante(md).masses;
    return D.sol(m,240)+D.roberval(230,240,{penche:e.penche,gauche:v.g==='vide'?[]:[v.g],masses:masses,cote:'droite',mode:m});});

  /* MES-10 · tare de la balance électronique */
  S.tare=pair(function(v){var t=Q.affichageTare(v.etape);return 'Montage : balance électronique, '+t.txt;},function(v,m){
    var t=Q.affichageTare(v.etape),s=D.sol(m,232),ids=v.etape==='vide'?[]:[v.etape==='lait'?'becher_eau':'becher_vide'];
    s+=D.electronique(200,212,t.affiche+' g',ids,m);
    s+='<rect x="276" y="198" width="34" height="16" rx="4" fill="'+(m==='schema'?'none':(v.etape==='tare'?'#C2410C':'#E8ECF2'))+'" stroke="'+INK+'" stroke-width="1.5"/>'+T(293,210,'tare',9.5,v.etape==='tare'&&m!=='schema'?'#fff':INK,800);
    return s+sim();});

  /* MES-11 · solides de même volume, même masse, jetons ; liquides tarés */
  S.cylindre=pair(function(v){var c=Q.cylindre(v.id);return 'Montage : '+c.txt;},function(v,m){
    var c=Q.cylindre(v.id),cy=Q.CYLINDRES.filter(function(x){return x.id===v.id;})[0],col={pvc:'#E8E8E8',bois:'#B77A3E',aluminium:'#C9D1DB',fer:'#6D7682',laiton:'#C9A227'}[v.id],s=D.sol(m,236);
    s+=D.eprouvette(100,236,{id:'B',V:50+c.V,mode:m,H:180}).svg+D.cylindre(100,214,1.6,2.4,10,{mode:m,col:col})+(c.lest?D.ecrou(100,224,m):'');
    s+=MD().balance(320,212,{mode:m,texte:c.m+' g'})+D.cylindre(320,160,2.4,3.4,12,{mode:m,col:col});
    return s+T(186,92,'50 → '+(50+c.V)+' cm³',12,INK,800)+T(320,40,cy.nom,13,INK,800)+sim();});
  function MD(){return window.NohobaMatiere.dessin;}
  S.cotonEcrous=pair('Montage : balance de Roberval en équilibre, 100 g de coton à gauche et 100 g d’écrous à droite',function(v,m){
    return D.sol(m,240)+D.roberval(230,240,{penche:'aucun',gauche:['sac_coton100'],droite:['ecrous'],masses:[],mode:m})+T(230,22,'même masse, volumes très différents',13,INK,800);});
  S.jetons=pair(function(v){var j=Q.jetons(Number(v.n));return 'Montage : '+j.txt;},function(v,m){
    var j=Q.jetons(Number(v.n)),s=D.sol(m,236),i;
    s+=D.eprouvette(100,236,{id:'A',V:50+j.V,mode:m,H:180}).svg;for(i=0;i<j.n;i++)s+=D.objet('jeton',100,224-i*7,m);
    s+=MD().balance(320,212,{mode:m,texte:j.m+' g'});for(i=0;i<j.n;i++)s+=D.objet('jeton',320+(i-(j.n-1)/2)*28,160,m);
    return s+T(186,92,'50 → '+(50+j.V)+' cm³',12,INK,800)+T(320,40,j.n+' jeton'+(j.n>1?'s':''),13,INK,800)+sim();});
  S.liquide=pair(function(v){var r=Q.liquideMV(v.liq,Number(v.V));return 'Montage : éprouvette tarée sur la balance électronique ; '+r.txt;},function(v,m){
    var r=Q.liquideMV(v.liq,Number(v.V)),col={eau:'#5BA8E0',huile:'#E6B93C',sirop:'#B2443A',vinaigre:'#EFE5C8',javel:'#D8E9C6'}[v.liq],s=D.sol(m,236);
    s+=MD().balance(230,212,{mode:m,texte:r.m+' g'});
    s+=D.eprouvette(230,162,{id:'A',V:Number(v.V),mode:m,H:110,W:26,liq:col}).svg;
    return s+T(360,60,Q.LIQ[v.liq].nom+' : '+v.V+' mL',13,INK,800)+leg(m,320,200,'éprouvette tarée','start')+sim();});

  /* MES-08 · pour aller plus loin : 10, 20, 50 mL d'eau */
  S.eauPlusLoin=pair(function(v){var r=Q.eauPlusLoin(Number(v.V));return 'Montage : bécher avec '+r.V+' mL d’eau sur la balance, '+r.m2+' g (valeur simulée)';},function(v,m){
    var r=Q.eauPlusLoin(Number(v.V)),s=D.sol(m,232)+D.electronique(200,212,r.m2+' g',['becher_eau'],m);
    return s+T(360,96,'m₁ = '+r.m1+' g',13,INK,700)+T(360,120,'m₂ = '+r.m2+' g',13,INK,700)+T(360,148,'m = '+r.m+' g',16,INK,800)+T(230,252,'Pour aller plus loin · valeurs simulées',11,INK,400);});

  /* MES-06 · balance de Roberval avec ses parties repérées par des lettres */
  S.robervalLettres=function(){
    var s=D.sol('schema',240)+D.roberval(230,240,{penche:'aucun',gauche:[],droite:[],masses:[],mode:'schema',sansLegende:true}),R=window.NohobaMatiere.dessin.repere;
    s+=R(70,214,'A')+'<line x1="84" y1="216" x2="112" y2="226" stroke="'+INK+'" stroke-width="1.4"/>';
    s+=R(300,150,'B')+'<line x1="286" y1="146" x2="268" y2="132" stroke="'+INK+'" stroke-width="1.4"/>';
    s+=R(60,70,'C')+'<line x1="74" y1="74" x2="100" y2="96" stroke="'+INK+'" stroke-width="1.4"/>';
    s+=R(330,70,'D')+'<line x1="316" y1="74" x2="236" y2="96" stroke="'+INK+'" stroke-width="1.4"/>';
    s+=R(170,26,'E')+'<line x1="184" y1="30" x2="226" y2="56" stroke="'+INK+'" stroke-width="1.4"/>';
    return D.vue(s,'Schéma de la balance de Roberval : cinq parties repérées par les lettres A à E');
  };

  Q.scene=S;
})();
