/* Mélanges de 5e (NohobaMelanges5e) : modèle qualitatif testable et dessins originaux de verrerie (bécher, entonnoir, ampoule à décanter, évaporation, distillation).
   Aucun chauffage n'est manipulé par l'élève : les étapes de chauffage sont des simulations, protocole guidé par le professeur. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,INK='#243049',N={};
  var C={eau:'#A9DAF7',clair:'#D6ECFA',huile:'#F2C94C',sable:'#E3C07A',terre:'#8B5E3C',trouble:'#C9A98A',lait:'#EDE8DC',sirop:'#E8A4A0'};
  /* ---------- MEL-01 : nombre de phases ---------- */
  N.MIX1=[
    ['sable','Eau et sable',[['Sable (au fond)',C.sable,.15],['Eau',C.eau,.55]]],
    ['sel','Eau et sel',[['Eau salée (une seule phase)',C.clair,.7]]],
    ['huile','Eau et huile de palme',[['Eau',C.eau,.45],['Huile de palme (au-dessus)',C.huile,.2]]],
    ['sucre','Eau et sucre',[['Eau sucrée (une seule phase)',C.clair,.7]]],
    ['terre','Eau et terre',[['Terre (dépôt)',C.terre,.12],['Eau trouble',C.trouble,.55]]],
    ['sirop','Eau et sirop',[['Eau au sirop (une seule phase)',C.sirop,.7]]],
    ['farine','Eau et farine',[['Farine (dépôt)',C.lait,.12],['Eau laiteuse',C.trouble,.55]]],
    ['alcool','Eau et alcool',[['Eau et alcool (une seule phase)',C.clair,.7]]]];
  N.mix1=function(id){var m=N.MIX1.filter(function(x){return x[0]===id;})[0];if(!m)throw new Error('mélange inconnu : '+id);
    return {id:m[0],nom:m[1],couches:m[2],phases:m[2].length,famille:m[2].length>1?'hétérogène':'homogène'};};
  function bech(x,y,w,h,ls,pts){var s='',cur=y+h-3,i,l,hh;
    for(i=0;i<ls.length;i++){l=ls[i];hh=Math.round(l[2]*h);s+='<rect x="'+(x+3)+'" y="'+(cur-hh)+'" width="'+(w-6)+'" height="'+hh+'" fill="'+l[1]+'"/>';cur-=hh;}
    if(pts)s+=pts;
    return '<path d="M'+x+' '+(y-8)+' V'+(y+h-8)+' q0 11 11 11 H'+(x+w-11)+' q11 0 11 -11 V'+(y-8)+'" fill="none" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/>'+s+'<path d="M'+(x-4)+' '+(y-8)+' H'+(x+w+4)+'" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/>';}
  N.montage1=function(id){
    var m=N.mix1(id),s=bech(190,60,120,170,m.couches,m.id==='sable'||m.id==='farine'?'<circle cx="230" cy="150" r="2.5" fill="#fff" opacity=".7"/><circle cx="262" cy="170" r="2.5" fill="#fff" opacity=".7"/><circle cx="246" cy="130" r="2.5" fill="#fff" opacity=".7"/>':'')+T(250,262,m.nom,14,INK,800);
    return A.svg(s,'0 0 500 280','Bécher contenant le mélange « '+m.nom.toLowerCase()+' » : '+m.couches.map(function(c){return c[0].toLowerCase();}).join(', ')+'.');};
  N.schema1=function(id){
    var m=N.mix1(id),s='',i;
    s+=T(20,34,'Phases que je vois : '+m.phases,16,INK,800,'start');
    m.couches.slice().reverse().forEach(function(c,k){i=k;s+='<rect x="20" y="'+(56+i*44)+'" width="30" height="30" rx="6" fill="'+c[1]+'" stroke="'+INK+'" stroke-width="2"/>'+T(64,76+i*44,'Phase '+(k+1)+' : '+c[0].replace(' (une seule phase)',''),14,INK,700,'start');});
    s+=T(20,172,m.phases>1?'Plusieurs constituants visibles à l’œil nu':'Un seul constituant visible',13,'#46536B',700,'start');
    return A.svg(s,'0 0 440 190','Schéma des phases : '+m.phases+(m.phases>1?' phases visibles':' phase visible')+' pour « '+m.nom.toLowerCase()+' ».');};
  /* ---------- MEL-02 : séparer un mélange hétérogène ---------- */
  N.MIX2=[['sable','Eau et sable'],['huile','Eau et huile de palme'],['boue','Eau boueuse']];
  N.METH2=[['decantation','Décantation (repos)'],['filtration','Filtration'],['ampoule','Ampoule à décanter']];
  var R2={'sable-decantation':['partiel','le sable se dépose au fond ; l’eau est au-dessus'],'sable-filtration':['oui','le sable reste sur le filtre ; le filtrat (l’eau) est limpide'],'sable-ampoule':['non','l’ampoule à décanter ne convient pas : le sable n’est pas un liquide'],
    'huile-decantation':['partiel','deux couches se forment : l’huile au-dessus de l’eau, mais on ne les récupère pas proprement'],'huile-filtration':['non','l’eau et l’huile traversent le filtre ensemble : rien n’est séparé'],'huile-ampoule':['oui','l’eau sort par le robinet, l’huile reste dans l’ampoule'],
    'boue-decantation':['partiel','la terre se dépose, mais l’eau reste un peu trouble'],'boue-filtration':['oui','la terre reste sur le filtre ; le filtrat est limpide'],'boue-ampoule':['non','l’ampoule à décanter ne convient pas : la terre n’est pas un liquide']};
  function nom(L,id){var x=L.filter(function(a){return a[0]===id;})[0];if(!x)throw new Error('inconnu : '+id);return x[1];}
  N.res2=function(m,k){var r=R2[m+'-'+k];nom(N.MIX2,m);nom(N.METH2,k);return {m:m,k:k,mix:nom(N.MIX2,m),meth:nom(N.METH2,k),sep:r[0],txt:r[1]};};
  var BADGE={oui:['#1E9E5A','Séparation réussie'],partiel:['#E08A00','Séparation partielle'],non:['#D6221C','Méthode inadaptée']};
  function badge(sep){return '<rect x="20" y="70" width="400" height="44" rx="10" fill="'+BADGE[sep][0]+'"/>'+T(220,98,BADGE[sep][1],17,'#fff',800);}
  N.montage2=function(m,k){
    var r=N.res2(m,k),s='',lay=m==='sable'?[['',C.sable,.15],['',C.eau,.55]]:m==='huile'?[['',C.eau,.45],['',C.huile,.2]]:[['',C.terre,.12],['',C.trouble,.55]];
    if(k==='decantation'){var fin=r.sep==='partiel'?(m==='sable'?[['',C.sable,.15],['',C.eau,.6]]:m==='huile'?[['',C.eau,.45],['',C.huile,.22]]:[['',C.terre,.14],['',C.clair,.3],['',C.trouble,.28]]):lay;
      s+=bech(190,50,120,170,fin,'')+T(250,252,'Après le repos',13,'#46536B',700)+T(250,270,r.mix,13,INK,800);}
    else if(k==='filtration'){var ok=r.sep==='oui',fl=ok?[['',C.eau,.4]]:(m==='huile'?[['',C.eau,.25],['',C.huile,.12]]:[['',C.trouble,.4]]);
      s+='<path d="M190 40 L310 40 L262 110 H238 Z" fill="#fff" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><path d="M200 46 L300 46 L258 104 H242 Z" fill="#EFE9DC" stroke="#B9AE95" stroke-width="1.5"/>'
        +(m==='huile'?'':'<path d="M218 62 L282 62 L262 96 H238 Z" fill="'+(m==='sable'?C.sable:C.terre)+'" opacity="'+(ok?1:.5)+'"/>')+'<path d="M250 110 V140" stroke="'+INK+'" stroke-width="3"/>'
        +bech(205,150,90,80,fl,'')+T(250,256,ok?'Filtrat (dessous) et résidu (sur le filtre)':'Rien n’est séparé',13,'#46536B',700)+T(250,272,r.mix,13,INK,800);}
    else{var tw=m==='huile';
      s+='<path d="M200 36 H300 V70 L262 150 V190 H238 V150 L200 70 Z" fill="none" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/>'
        +(tw?'<path d="M205 78 L295 78 L262 140 H238 Z" fill="'+C.huile+'"/><path d="M238 140 L262 140 V160 H238 Z" fill="'+C.eau+'"/>':'<path d="M205 78 L295 78 L262 150 H238 Z" fill="'+(m==='sable'?C.sable:C.trouble)+'"/>')
        +'<path d="M228 192 H272" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>'+bech(215,212,70,36,tw?[['',C.eau,.8]]:[],'')+T(250,268,tw?'L’eau est recueillie dessous':'Le robinet ne règle rien ici',13,'#46536B',700);}
    return A.svg(s,'0 0 500 290','Expérience : '+r.mix.toLowerCase()+' avec la méthode « '+r.meth.toLowerCase()+' ». Résultat simulé : '+r.txt+'.');};
  N.schema2=function(m,k){var r=N.res2(m,k);
    return A.svg(T(220,34,r.mix+' · '+r.meth,14,INK,800)+badge(r.sep)+T(220,150,r.txt.charAt(0).toUpperCase()+r.txt.slice(1)+'.',12,'#46536B',700),'0 0 440 190','Bilan de l’essai : '+r.mix.toLowerCase()+' avec la méthode « '+r.meth.toLowerCase()+' » : '+BADGE[r.sep][1].toLowerCase()+'. '+r.txt+'.');};
  /* ---------- MEL-03 : séparer un mélange homogène ---------- */
  N.MIX3=[['sel','Eau salée'],['sucre','Eau sucrée'],['mer','Eau de mer']];
  N.METH3=[['filtration','Filtration'],['evaporation','Évaporation'],['distillation','Distillation']];
  N.res3=function(m,k){var mix=nom(N.MIX3,m),meth=nom(N.METH3,k),sol=m==='sucre'?'le sucre':m==='mer'?'les sels':'le sel',rst=m==='mer'?'restent':'reste',x;
    if(k==='filtration')x=['non','rien',mix+' traverse le filtre : '+sol+' dissous passe aussi, rien n’est séparé'];
    else if(k==='evaporation')x=['oui','solide','l’eau s’évapore et '+sol+' '+rst+' dans la coupelle ; l’eau n’est pas récupérée'];
    else x=['oui','distillat','on recueille l’eau pure (le distillat) ; '+sol+' '+rst+' dans le ballon'];
    return {m:m,k:k,mix:mix,meth:meth,sep:x[0],recup:x[1],txt:x[2],sol:sol};};
  N.montage3=function(m,k){
    var r=N.res3(m,k),s='',col=m==='sucre'?C.clair:C.clair;
    if(k==='filtration')s+='<path d="M190 40 L310 40 L262 110 H238 Z" fill="#fff" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><path d="M200 46 L300 46 L258 104 H242 Z" fill="#EFE9DC" stroke="#B9AE95" stroke-width="1.5"/><path d="M250 110 V140" stroke="'+INK+'" stroke-width="3"/>'+bech(205,150,90,80,[['',col,.4]],'')+T(250,256,'Le filtrat est identique au mélange',13,'#46536B',700)+T(250,272,r.mix,13,INK,800);
    else if(k==='evaporation')s+='<path d="M170 190 Q250 250 330 190 Z" fill="#fff" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><path d="M200 196 q20 6 40 0 q20 6 40 0 q8 -4 14 -4" fill="none" stroke="#fff" stroke-width="4"/><g fill="#F4F6FA" stroke="'+INK+'" stroke-width="1.2"><rect x="212" y="188" width="9" height="9"/><rect x="232" y="192" width="9" height="9"/><rect x="254" y="189" width="9" height="9"/><rect x="274" y="192" width="9" height="9"/></g><path d="M215 170 q-8 -14 0 -26 M250 168 q-8 -14 0 -26 M285 170 q-8 -14 0 -26" stroke="#9FB0C4" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M200 262 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0 q10 -16 20 0" fill="none" stroke="#E8590C" stroke-width="4"/>'+T(250,284,'chauffage réalisé par le professeur',12,'#C2410C',800)+T(250,38,'Il reste le solide : '+r.sol,13,INK,800);
    else s+='<circle cx="140" cy="170" r="42" fill="'+col+'" stroke="'+INK+'" stroke-width="3"/><path d="M128 130 V92 H160 V130" fill="none" stroke="'+INK+'" stroke-width="3"/><path d="M160 100 L330 140" stroke="'+INK+'" stroke-width="3"/><path d="M215 112 L345 152" stroke="#2E7BD6" stroke-width="10" opacity=".35" stroke-linecap="round"/><path d="M330 140 L350 190" stroke="'+INK+'" stroke-width="3"/>'+bech(325,200,70,40,[['',C.eau,.7]],'')+T(360,262,'distillat',12,INK,800)+T(140,236,'ballon',12,INK,800)+T(270,98,'réfrigérant',12,INK,800)+T(250,288,'chauffage réalisé par le professeur',12,'#C2410C',800);
    return A.svg(s,'0 0 500 300','Expérience : '+r.mix.toLowerCase()+' avec la méthode « '+r.meth.toLowerCase()+' » (chauffage réalisé par le professeur). Résultat simulé : '+r.txt+'.');};
  N.schema3=function(m,k){var r=N.res3(m,k),b=r.sep==='oui'?BADGE.oui:BADGE.non;
    return A.svg(T(220,34,r.mix+' · '+r.meth,14,INK,800)+'<rect x="20" y="70" width="400" height="44" rx="10" fill="'+b[0]+'"/>'+T(220,98,r.recup==='rien'?'Rien n’est séparé':r.recup==='solide'?'On récupère le solide dissous':'On récupère un liquide pur : le distillat',17,'#fff',800)+T(220,150,r.txt.charAt(0).toUpperCase()+r.txt.slice(1)+'.',12,'#46536B',700),'0 0 440 190','Bilan de l’essai : '+r.mix.toLowerCase()+' avec la méthode « '+r.meth.toLowerCase()+' » : '+(r.recup==='rien'?'rien n’est séparé':r.recup==='solide'?'on récupère le solide dissous':'on récupère le distillat')+'. '+r.txt+'.');};
  window.NohobaMelanges5e=N;
})();
