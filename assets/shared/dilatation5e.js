/* Dilatation de 5e (NohobaDilatation5e) : solides, liquides, gaz. Modèles qualitatifs testables, dessins originaux.
   Aucun coefficient : comparaisons qualitatives seulement. Toute flamme ou bain très chaud : réalisé par le professeur (simulation). */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,INK='#243049',N={},GR='#46536B',OR='#C2410C';
  function pick(L,id,what){var x=L.filter(function(a){return a[0]===id;})[0];if(!x)throw new Error(what+' inconnu : '+id);return x;}
  function cap(t){return t.charAt(0).toUpperCase()+t.slice(1);}
  /* ---------- DIL-01 : boule et anneau ---------- */
  N.ETATS=[['froide','Boule à la température ambiante'],['chauffee','Boule chauffée'],['refroidie','Boule refroidie']];
  N.res1=function(e){var x=pick(N.ETATS,e,'état'),ch=e==='chauffee';
    return {e:e,etat:x[1],diam:ch?'plus grand':'égal',passe:!ch,txt:ch?'la boule chauffée est trop grosse : elle reste bloquée sur l’anneau':e==='froide'?'la boule passe tout juste dans l’anneau':'la boule a repris sa taille : elle passe de nouveau'};};
  function support(){return '<path d="M150 172 H212 M288 172 H350" stroke="'+INK+'" stroke-width="9" stroke-linecap="round"/><path d="M170 172 V250 M330 172 V250 M140 250 H360" stroke="'+INK+'" stroke-width="5" stroke-linecap="round"/>'+T(250,196,'ouverture de l’anneau',12,GR,700);}
  N.montage1=function(e){var r=N.res1(e),ch=e==='chauffee',s=support(),R=ch?42:32;
    s+=ch?'<circle cx="250" cy="'+(172-4-R)+'" r="'+R+'" fill="#F28B4B" stroke="#9E3B0E" stroke-width="3"/><path d="M215 60 q10 -22 20 0 q10 -22 20 0 q10 -22 20 0" fill="none" stroke="#E8590C" stroke-width="5"/>'+T(250,30,'chauffage réalisé par le professeur',12,OR,800)
      :'<circle cx="250" cy="'+(e==='froide'?150:232)+'" r="'+R+'" fill="#B8C2D1" stroke="'+INK+'" stroke-width="3"/>'+(e==='refroidie'?'<path d="M250 190 v14" stroke="'+INK+'" stroke-width="3"/>':'');
    return A.svg(s+T(250,272,r.etat,14,INK,800),'0 0 500 290','Boule métallique et anneau : '+r.txt+'.');};
  N.schema1=function(e){var r=N.res1(e),w=r.e==='chauffee'?84:64,c=r.e==='chauffee'?'#E8590C':'#8C97A8';
    return A.svg(T(220,32,'Diamètre de la boule et ouverture',14,INK,800)+'<rect x="72" y="52" width="76" height="14" rx="4" fill="#243049"/>'+T(170,64,'ouverture',12,INK,700,'start')+'<rect x="'+(110-w/2)+'" y="84" width="'+w+'" height="14" rx="4" fill="'+c+'"/>'+T(170,96,'boule : '+r.diam+' que l’ouverture',12,INK,700,'start')+T(220,150,cap(r.txt)+'.',12,GR,700),'0 0 440 170','Schéma : '+r.etat.toLowerCase()+', diamètre '+r.diam+' que l’ouverture de l’anneau ; '+r.txt+'.');};
  /* ---------- DIL-02 : métaux comparés ---------- */
  N.BARRES=[['fer','Fer'],['cuivre','Cuivre'],['alu','Aluminium']];
  N.ETATS2=[['ambiant','À la température ambiante'],['chaud','Chauffée']];
  var AL={fer:1,cuivre:2,alu:3},COL={fer:'#8C97A8',cuivre:'#C77A3E',alu:'#CBD3DD'},TX=['','s’allonge un peu','s’allonge moyennement','s’allonge beaucoup'];
  N.res2=function(b,s){var x=pick(N.BARRES,b,'métal');pick(N.ETATS2,s,'état');var a=s==='chaud'?AL[b]:0;
    return {b:b,s:s,nom:x[1],allong:a,txt:a?x[1].toLowerCase()+' '+TX[a]:x[1].toLowerCase()+' garde sa longueur'};};
  N.montage2=function(b,s){var r=N.res2(b,s),x0=90,L=200,e=r.allong*16,i,t='';
    for(i=0;i<=6;i++)t+='<path d="M'+(x0+L+i*16)+' 160 v10" stroke="#9AA6BC" stroke-width="2"/>';
    var o='<rect x="'+x0+'" y="128" width="'+(L+e)+'" height="26" rx="4" fill="'+COL[b]+'" stroke="'+INK+'" stroke-width="2.5"/>'+(e?'<path d="M'+(x0+L)+' 120 V162" stroke="'+INK+'" stroke-width="2" stroke-dasharray="4 3"/>':'')
      +'<path d="M'+(x0)+' 120 V162 M'+(x0-14)+' 100 V190" stroke="'+INK+'" stroke-width="5"/><path d="M'+(x0+L)+' 166 H'+(x0+L+96)+'" stroke="'+INK+'" stroke-width="2"/>'+t
      +(s==='chaud'?'<path d="M'+(x0+60)+' 214 q10 -22 20 0 q10 -22 20 0 q10 -22 20 0 q10 -22 20 0" fill="none" stroke="#E8590C" stroke-width="5"/>'+T(250,256,'chauffage réalisé par le professeur',12,OR,800):'')
      +T(250,40,r.nom,16,INK,800)+T(x0+L+48,186,'échelle',11,GR,700);
    return A.svg(o,'0 0 500 270','Barre de '+r.nom.toLowerCase()+' de même longueur au départ : '+r.txt+'.');};
  N.schema2=function(b,s){var r=N.res2(b,s),n=['aucun allongement','petit allongement','allongement moyen','grand allongement'][r.allong];
    return A.svg(T(220,30,r.nom+' · '+(s==='chaud'?'chauffée':'ambiante'),14,INK,800)+T(220,150,cap(n)+' : '+r.txt+'.',12,GR,700)+'<rect x="40" y="62" width="'+(110+r.allong*28)+'" height="22" rx="5" fill="'+(r.allong?'#E8590C':'#8C97A8')+'"/><path d="M150 52 V96" stroke="'+INK+'" stroke-width="2" stroke-dasharray="4 3"/>'+T(150,112,'longueur de départ',11,GR,700),'0 0 440 170','Schéma : '+r.nom.toLowerCase()+', '+n+' ('+r.txt+').');};
  /* ---------- DIL-03 : liquides ---------- */
  N.LIQ=[['eau','Eau colorée'],['huile','Huile'],['alcool','Alcool coloré']];
  N.BAINS=[['glace','Bain de glace'],['ambiant','Bain à la température ambiante'],['chaud','Bain chaud']];
  var NV={eau:{glace:-1,ambiant:0,chaud:2},huile:{glace:-2,ambiant:0,chaud:3},alcool:{glace:-3,ambiant:0,chaud:5}},LC={eau:'#3BA7E8',huile:'#E5B93B',alcool:'#E0525E'},BC={glace:'#CFE8F7',ambiant:'#F4F6FA',chaud:'#F7C8A6'};
  N.res3=function(l,b){var x=pick(N.LIQ,l,'liquide'),bb=pick(N.BAINS,b,'bain'),n=NV[l][b],p=n>0?'dessus':n<0?'dessous':'repere';
    return {l:l,b:b,nom:x[1],bain:bb[1],niv:n,pos:p,txt:n>0?'le niveau monte au-dessus du repère':n<0?'le niveau descend sous le repère':'le niveau reste au repère'};};
  function ballon(l,niv,bc){var y=104-niv*9,s='<rect x="120" y="150" width="160" height="96" rx="10" fill="'+bc+'" stroke="'+INK+'" stroke-width="2.5"/>';
    s+='<circle cx="200" cy="190" r="44" fill="'+LC[l]+'" stroke="'+INK+'" stroke-width="3"/><rect x="193" y="'+y+'" width="14" height="'+(150-y)+'" fill="'+LC[l]+'"/><path d="M192 38 V148 M208 38 V148" stroke="'+INK+'" stroke-width="3"/>';
    s+='<path d="M180 104 H236" stroke="#243049" stroke-width="2.5" stroke-dasharray="5 3"/>'+T(244,108,'repère',12,INK,800,'start');return s;}
  N.montage3=function(l,b){var r=N.res3(l,b);
    return A.svg(ballon(l,r.niv,BC[b])+T(200,266,r.bain,13,INK,800)+(b==='chaud'?T(380,214,'chauffage par le professeur',11,OR,800):''),'0 0 500 280','Ballon rempli d’'+(l==='huile'?'huile':l==='eau'?'eau colorée':'alcool coloré')+' surmonté d’un tube, dans un '+r.bain.toLowerCase()+' : '+r.txt+'.');};
  N.schema3=function(l,b){var r=N.res3(l,b),y=84-r.niv*8;
    return A.svg(T(220,28,r.nom+' · '+r.bain,13,INK,800)+'<rect x="60" y="'+Math.min(y,84)+'" width="26" height="'+Math.abs(y-84)+'" fill="'+LC[l]+'"/><path d="M50 84 H100" stroke="'+INK+'" stroke-width="3"/>'+T(110,88,'repère',12,INK,700,'start')+T(220,150,cap(r.txt)+'.',12,GR,700),'0 0 440 170','Schéma du niveau : '+r.nom.toLowerCase()+' dans un '+r.bain.toLowerCase()+' ; '+r.txt+'.');};
  /* ---------- DIL-04 : gaz ---------- */
  N.BAINS4=[['glace','Eau glacée'],['ambiant','Eau à la température ambiante'],['chaud','Eau chaude'],['mains','Chaleur des mains']];
  var VG={glace:-2,ambiant:0,chaud:3,mains:1},BC4={glace:'#CFE8F7',ambiant:'#F4F6FA',chaud:'#F7C8A6',mains:'#F4F6FA'};
  N.res4=function(b){var x=pick(N.BAINS4,b,'bain'),v=VG[b];return {b:b,bain:x[1],vol:v,etat:v>0?'gonflé':v<0?'dégonflé':'inchangé',txt:b==='mains'?'l’air chauffé par les mains se dilate : le ballon se gonfle un peu':v>0?'l’air chauffé se dilate : le ballon se gonfle':v<0?'l’air refroidi se contracte : le ballon se dégonfle et rentre':'l’air garde son volume : le ballon ne change pas'};};
  N.montage4=function(b){var r=N.res4(b),h=36+r.vol*16,w=34+r.vol*7,cy=86-(r.vol<0?-6:0),s='';
    s+='<rect x="130" y="170" width="150" height="80" rx="10" fill="'+BC4[b]+'" stroke="'+INK+'" stroke-width="2.5"/><circle cx="205" cy="206" r="44" fill="#EAF4FB" stroke="'+INK+'" stroke-width="3"/><path d="M193 124 V166 M217 124 V166" stroke="'+INK+'" stroke-width="3"/>';
    s+='<path d="M193 124 q-'+(w-6)+' 0 -'+(w-6)+' -'+(h*0.55)+' q0 -'+(h*0.5)+' '+(w+6)+' -'+(h*0.5)+' q'+(w+6)+' 0 '+(w+6)+' '+(h*0.5)+' q0 '+(h*0.55)+' -'+(w-6)+' '+(h*0.55)+'z" transform="translate(5 0)" fill="#F2C94C" stroke="'+INK+'" stroke-width="2.5" opacity=".9"/>';
    if(b==='mains')s+='<path d="M290 190 q22 -10 22 12 q0 18 -22 12" fill="#E0A682" stroke="'+INK+'" stroke-width="2"/>';
    return A.svg(s+T(205,272,r.bain,13,INK,800)+(b==='chaud'?T(400,222,'chauffage par le professeur',11,OR,800):''),'0 0 500 290','Ballon de verre coiffé d’un ballon de baudruche, '+r.bain.toLowerCase()+' : '+r.txt+'.');};
  N.schema4=function(b){var r=N.res4(b),w=70+r.vol*22;
    return A.svg(T(220,28,r.bain,14,INK,800)+'<rect x="60" y="56" width="70" height="16" rx="4" fill="#CBD3DD"/>'+T(140,69,'volume de départ',12,GR,700,'start')+'<rect x="60" y="84" width="'+w+'" height="16" rx="4" fill="'+(r.vol>0?'#E8590C':r.vol<0?'#2E7BD6':'#8C97A8')+'"/>'+T(60+w+10,97,'volume : '+r.etat,12,INK,700,'start')+T(220,150,cap(r.txt)+'.',12,GR,700),'0 0 440 170','Schéma du volume de l’air : '+r.etat+' ('+r.txt+').');};
  window.NohobaDilatation5e=N;
})();
