/* Matière de 5e (NohobaMatiere5e) : molécules en couleurs CPK, combustions du carbone et du soufre.
   Modèles qualitatifs testables et dessins originaux. Toute flamme : chauffage réalisé par le professeur (simulation). */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,INK='#243049',N={};
  var EL={H:['hydrogène','#FFFFFF','#9AA6BC',16],C:['carbone','#3A3A3A','#0E0E0E',26],N:['azote','#4C6BFF','#1E2FA8',25],O:['oxygène','#F0454B','#9E1A1F',24],S:['soufre','#FFD84A','#B38C00',30],Cl:['chlore','#3DDC6B','#178A3A',28]};
  N.EL=EL;
  var SUB='₀₁₂₃₄₅₆₇₈₉';
  function sub(n){return String(n).split('').map(function(c){return SUB[+c];}).join('');}
  /* ---------- molécules ---------- */
  var MOL=[
    ['h2','dihydrogène',{H:2},[['H',-20,0],['H',20,0]]],
    ['o2','dioxygène',{O:2},[['O',-26,0],['O',26,0]]],
    ['n2','diazote',{N:2},[['N',-26,0],['N',26,0]]],
    ['cl2','dichlore',{Cl:2},[['Cl',-30,0],['Cl',30,0]]],
    ['h2o','eau',{H:2,O:1},[['O',0,-12],['H',-40,24],['H',40,24]]],
    ['co2','dioxyde de carbone',{C:1,O:2},[['O',-58,0],['C',0,0],['O',58,0]]],
    ['co','monoxyde de carbone',{C:1,O:1},[['C',-26,0],['O',26,0]]],
    ['ch4','méthane',{C:1,H:4},[['C',0,0],['H',-42,-34],['H',42,-34],['H',-42,38],['H',42,38]]],
    ['nh3','ammoniac',{N:1,H:3},[['N',0,0],['H',-44,30],['H',44,30],['H',0,-46]]],
    ['so2','dioxyde de soufre',{S:1,O:2},[['S',0,-10],['O',-52,26],['O',52,26]]]];
  var ORD=['C','S','N','H','O','Cl'];
  N.MOL=MOL.map(function(m){return [m[0],m[1]];});
  N.mol=function(id){var m=MOL.filter(function(x){return x[0]===id;})[0];if(!m)throw new Error('molécule inconnue : '+id);
    var c=m[2],f='',tot=0,types=0;ORD.forEach(function(e){if(c[e]){f+=e+(c[e]>1?sub(c[e]):'');tot+=c[e];types++;}});
    return {id:id,nom:m[1],f:f,compo:c,total:tot,types:types,classe:types===1?'simple':'composé',at:m[3]};};
  function de(e){return /^[aeiouyhéè]/.test(EL[e][0])?'d’'+EL[e][0]:'de '+EL[e][0];}
  function atome(e,x,y,k,lab){var d=EL[e],r=Math.round(d[3]*k);return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+d[1]+'" stroke="'+d[2]+'" stroke-width="2.5"/>'+(lab===false?'':T(x,y+5,e,Math.round(15*k+2),e==='H'||e==='S'||e==='Cl'?INK:'#fff',800));}
  function bonds(m){var at=m.at,s='',c=null,i;
    if(at.length===2)return '<path d="M'+at[0][1]+' '+at[0][2]+' L'+at[1][1]+' '+at[1][2]+'" stroke="#8C97AB" stroke-width="10" stroke-linecap="round"/>';
    for(i=0;i<at.length;i++)if(at[i][0]==='C'||at[i][0]==='N'||at[i][0]==='S'||(m.id==='h2o'&&at[i][0]==='O')){c=at[i];break;}
    at.forEach(function(a){if(a!==c)s+='<path d="M'+c[1]+' '+c[2]+' L'+a[1]+' '+a[2]+'" stroke="#8C97AB" stroke-width="9" stroke-linecap="round"/>';});return s;}
  function modele(m,cx,cy,k){var s='<g transform="translate('+cx+' '+cy+') scale('+k+')">'+bonds(m);m.at.forEach(function(a){s+=atome(a[0],a[1],a[2],1);});return s+'</g>';}
  N.montageMol=function(id){var m=N.mol(id);
    return A.svg(modele(m,250,120,1.35)+T(250,262,m.nom,15,INK,800),'0 0 500 280','Modèle moléculaire en boules de « '+m.nom+' » : '+compoTxt(m)+'.');};
  function compoTxt(m){return ORD.filter(function(e){return m.compo[e];}).map(function(e){return m.compo[e]+' atome'+(m.compo[e]>1?'s':'')+' '+de(e);}).join(', ');}
  N.schemaMol=function(id,mode){var m=N.mol(id),s=T(220,40,m.f,34,INK,800),y=76;
    ORD.forEach(function(e){if(m.compo[e]){s+=atome(e,60,y+10,.7,false)+T(90,y+16,e+' : '+m.compo[e]+' atome'+(m.compo[e]>1?'s':'')+' '+de(e),14,INK,700,'start');y+=34;}});
    if(mode==='classe')s+=T(220,y+14,m.types+(m.types>1?' types d’atomes':' seul type d’atome'),14,m.types>1?'#C2410C':'#1E7A44',800);
    else s+=T(220,y+14,'Total : '+m.total+' atome'+(m.total>1?'s':''),14,'#46536B',800);
    return A.svg(s,'0 0 440 '+(y+36),'Formule « '+m.f+' » de '+m.nom+' : '+compoTxt(m)+(mode==='classe'?' ; '+m.types+(m.types>1?' types d’atomes':' seul type d’atome')+', donc un corps '+m.classe:' ; '+m.total+' atomes en tout')+'.');};
  /* ---------- combustions : gaz du flacon ---------- */
  N.GAZ=[['air','Air'],['o2','Dioxygène'],['n2','Diazote']];
  function gaz(id){var g=N.GAZ.filter(function(x){return x[0]===id;})[0];if(!g)throw new Error('gaz inconnu : '+id);return g[1];}
  /* carbone */
  var RC={air:['lente','trouble','le carbone rougeoie lentement ; l’eau de chaux se trouble'],o2:['vive','trouble','le carbone brûle vivement avec des étincelles ; l’eau de chaux se trouble'],n2:['non','limpide','le carbone ne brûle pas ; l’eau de chaux reste limpide']};
  N.res3=function(g){var r=RC[g];if(!r)throw new Error('gaz inconnu : '+g);return {g:g,gaz:gaz(g),brule:r[0],chaux:r[1],txt:r[2]};};
  function flacon(x,y,col,inner){return '<path d="M'+(x-18)+' '+y+' H'+(x+18)+' V'+(y+30)+' Q'+(x+78)+' '+(y+70)+' '+(x+70)+' '+(y+150)+' Q'+x+' '+(y+175)+' '+(x-70)+' '+(y+150)+' Q'+(x-78)+' '+(y+70)+' '+(x-18)+' '+(y+30)+' Z" fill="'+col+'" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/>'+inner;}
  function tube(x,y,trouble){return '<path d="M'+(x-22)+' '+y+' V'+(y+110)+' q0 18 22 18 q22 0 22 -18 V'+y+'" fill="none" stroke="'+INK+'" stroke-width="3"/><rect x="'+(x-19)+'" y="'+(y+50)+'" width="38" height="'+(trouble?58:58)+'" rx="8" fill="'+(trouble?'#EDE8DC':'#D6ECFA')+'" opacity="'+(trouble?1:.8)+'"/>'+T(x,y+150,trouble?'eau de chaux trouble':'eau de chaux limpide',12,INK,800);}
  N.montage3=function(g){var r=N.res3(g),on=r.brule!=='non',s=flacon(190,40,'#EEF6FC','')
    +'<path d="M190 40 V104" stroke="'+INK+'" stroke-width="4"/><ellipse cx="190" cy="118" rx="16" ry="11" fill="#2A2A30" stroke="'+INK+'" stroke-width="2"/>'
    +(on?'<circle cx="190" cy="116" r="'+(r.brule==='vive'?34:22)+'" fill="#FF7A2E" opacity=".35"/><ellipse cx="190" cy="118" rx="12" ry="8" fill="#FFB547"/>':'')
    +(r.brule==='vive'?'<g fill="#FFE29A"><circle cx="156" cy="100" r="3"/><circle cx="226" cy="96" r="3"/><circle cx="170" cy="82" r="3"/><circle cx="214" cy="140" r="3"/></g>':'')
    +T(190,214,r.gaz,15,INK,800)+tube(380,60,r.chaux==='trouble')+T(250,262,'chauffage réalisé par le professeur',12,'#C2410C',800);
    return A.svg(s,'0 0 500 280','Expérience : un morceau de carbone dans un flacon d’'+(g==='air'?'air':g==='o2'?'dioxygène':'diazote')+', chauffage réalisé par le professeur. Résultat simulé : '+r.txt+'.');};
  N.schema3=function(g){var r=N.res3(g),s,lab;
    if(r.brule==='non'){s=T(220,60,'Pas de réaction',22,'#D6221C',800)+T(220,100,'Le diazote ne réagit pas avec le carbone',14,'#46536B',700);lab='Bilan : le carbone ne brûle pas dans le diazote, aucun produit.';}
    else{s=atome('C',50,70,.8)+T(92,76,'+',20,INK,800)+atome('O',130,70,.8)+atome('O',166,70,.8)+T(212,76,'→',22,INK,800)+atome('O',262,70,.8)+atome('C',304,70,.8)+atome('O',346,70,.8)+T(220,130,'carbone + dioxygène → dioxyde de carbone',14,INK,800)+T(220,158,'Tous les atomes du début se retrouvent à la fin',12,'#46536B',700);lab='Bilan : carbone plus dioxygène donne dioxyde de carbone (un atome de carbone, deux atomes d’oxygène), l’eau de chaux se trouble.';}
    return A.svg(s,'0 0 440 180',lab);};
  /* soufre */
  N.TESTS=[['flamme','Flamme'],['ph','Papier pH humide'],['kmno','Permanganate de potassium']];
  var RS={flamme:{o2:[true,'flamme bleue vive, gaz suffocant'],air:[true,'flamme bleue pâle, gaz suffocant'],n2:[false,'pas de flamme']},
    ph:{o2:[true,'le papier pH humide rougit : le gaz est acide'],air:[true,'le papier pH humide rougit légèrement'],n2:[false,'le papier pH ne change pas']},
    kmno:{o2:[true,'le permanganate violet se décolore'],air:[true,'le permanganate se décolore lentement'],n2:[false,'le permanganate reste violet']}};
  N.res4=function(g,t){gaz(g);if(!RS[t])throw new Error('test inconnu : '+t);var r=RS[t][g];return {g:g,t:t,gaz:gaz(g),test:N.TESTS.filter(function(x){return x[0]===t;})[0][1],pos:r[0],txt:r[1]};};
  N.montage4=function(g,t){var r=N.res4(g,t),s=flacon(190,40,'#EEF6FC','')+'<path d="M190 40 V96" stroke="'+INK+'" stroke-width="4"/><path d="M174 112 q4 -12 16 -12 q12 0 16 12z" fill="#FFD84A" stroke="#B38C00" stroke-width="2"/>';
    if(g!=='n2')s+='<path d="M190 100 q-12 -16 0 -34 q12 18 0 34z" fill="#5B7BFF" opacity="'+(g==='o2'?.9:.55)+'"/><path d="M190 98 q-5 -10 0 -20 q5 10 0 20z" fill="#B9C8FF"/>';
    s+=T(190,214,r.gaz,15,INK,800);
    if(t==='ph')s+='<rect x="340" y="70" width="26" height="110" fill="#F2EBD3" stroke="'+INK+'" stroke-width="2"/><rect x="340" y="70" width="26" height="54" fill="'+(r.pos?'#E0524A':'#E9D9A6')+'"/>'+T(353,200,r.pos?'papier rouge':'papier inchangé',12,INK,800);
    else if(t==='kmno')s+='<path d="M338 70 V170 q0 18 16 18 q16 0 16 -18 V70" fill="none" stroke="'+INK+'" stroke-width="3"/><rect x="341" y="110" width="26" height="62" rx="8" fill="'+(r.pos?'#F4F0F6':'#8E2DB5')+'"/>'+T(354,208,r.pos?'incolore':'violet',12,INK,800);
    else s+=T(380,120,r.pos?'flamme bleue':'pas de flamme',14,r.pos?'#2E5BD6':'#46536B',800);
    s+=T(250,262,'chauffage réalisé par le professeur, sous la hotte',12,'#C2410C',800);
    return A.svg(s,'0 0 500 280','Expérience sous la hotte : du soufre dans un flacon d’'+(g==='n2'?'diazote':g==='o2'?'dioxygène':'air')+', test « '+r.test.toLowerCase()+' », chauffage réalisé par le professeur. Résultat simulé : '+r.txt+'.');};
  N.schema4=function(g,t){var r=N.res4(g,t),s,lab;
    if(!r.pos){s=T(220,60,'Aucun nouveau corps',22,'#D6221C',800)+T(220,100,r.txt.charAt(0).toUpperCase()+r.txt.slice(1),14,'#46536B',700);lab='Bilan : '+r.txt+' ; aucun nouveau corps ne se forme.';}
    else{s=atome('S',60,70,.8)+T(110,76,'+',20,INK,800)+atome('O',156,70,.8)+atome('O',192,70,.8)+T(238,76,'→',22,INK,800)+atome('O',286,80,.8)+atome('S',332,64,.8)+atome('O',378,80,.8)+T(220,130,'soufre + dioxygène → dioxyde de soufre',14,INK,800)+T(220,158,r.txt.charAt(0).toUpperCase()+r.txt.slice(1),12,'#46536B',700);lab='Bilan : soufre plus dioxygène donne dioxyde de soufre ; '+r.txt+'.';}
    return A.svg(s,'0 0 440 180',lab);};
  window.NohobaMatiere5e=N;
})();
