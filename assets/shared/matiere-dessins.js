/* NohobaLab · 6e Côte d'Ivoire · dessins originaux du thème « Propriétés physiques de la matière ».
   Deux rendus par objet : « montage » (réaliste, en couleurs) et « schema » (normalisé : traits noirs, hachures pour les liquides).
   Les neuf pictogrammes de danger et les quatre équipements de protection sont redessinés ici (jamais reproduits d'un manuel). */
(function(){
  'use strict';
  var M=window.NohobaMatiere,A=window.NohobaAtelier;
  var INK='#243049',ROUGE='#D6221C',BLEU='#1F5FBF',FONT='Atkinson Hyperlegible,system-ui,sans-serif';
  var D={};
  function n(v){return Math.round(v*10)/10;}
  function esc(s){return A.esc(s);}
  function txt(x,y,t,size,col,w,anchor){return A.T(x,y,t,size,col,w,anchor);}
  var uid=0;
  /* cadre commun : motifs de hachures des liquides du schéma */
  D.vue=function(inner,label,vb){
    return A.svg('<defs><pattern id="nlh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="7" stroke="'+INK+'" stroke-width="1.1"/></pattern></defs>'+inner,vb||'0 0 460 260',label);
  };
  var real=function(m){return m!=='schema';};

  /* ---------- récipients ---------- */
  var FORMES={
    cristallisoir:{h:56,w:152,d:'M-76,-56 L-76,-12 Q-76,0 -64,0 L64,0 Q76,0 76,-12 L76,-56'},
    tube:{h:132,w:36,d:'M-18,-132 L-18,-18 A18,18 0 0 0 18,-18 L18,-132'},
    ballon:{h:134,w:104,d:'M-12,-134 L-12,-103.5 A48,48 0 0 0 -28,-18 L28,-18 A48,48 0 0 0 12,-103.5 L12,-134'},
    flacon:{h:108,w:64,d:'M-11,-108 L-11,-84 L-32,-76 L-32,-6 Q-32,0 -26,0 L26,0 Q32,0 32,-6 L32,-76 L11,-84 L11,-108'},
    becher:{h:92,w:72,d:'M-36,-92 L-36,-4 Q-36,0 -32,0 L32,0 Q36,0 36,-4 L36,-92'},
    verre:{h:84,w:64,d:'M-32,-84 L-24,-4 Q-24,0 -20,0 L20,0 Q24,0 24,-4 L32,-84'},
    bocal:{h:88,w:84,d:'M-42,-88 L-42,-6 Q-42,0 -36,0 L36,0 Q42,0 42,-6 L42,-88'}
  };
  D.FORMES=FORMES;
  /* o : {niveau 0..1, liq couleur, incline degrés, mode, sc, bouchon, etiquette} ; (x,y) = centre du fond */
  D.recipient=function(kind,x,y,o){
    o=o||{};var f=FORMES[kind],sc=o.sc||1,rot=o.incline||0,mode=o.mode,id='c'+(++uid);
    var tr='translate('+x+' '+y+') rotate('+rot+') scale('+sc+')',s='';
    var glass=real(mode)?'rgba(190,220,245,.28)':'none',stk=real(mode)?'#5F7596':INK;
    if(o.niveau>0){
      var ymax=Math.cos(rot*Math.PI/180),ys=y-f.h*sc*o.niveau*ymax;
      s+='<clipPath id="'+id+'"><path d="'+f.d+' Z" transform="'+tr+'"/></clipPath>';
      s+='<rect x="'+(x-210)+'" y="'+n(ys)+'" width="420" height="'+n(y+60-ys)+'" clip-path="url(#'+id+')" fill="'+(real(mode)?(o.liq||'#5BA8E0'):'url(#nlh)')+'"'+(real(mode)?' opacity=".72"':'')+'/>';
      s+='<line x1="'+(x-f.w*sc/2*1.1)+'" y1="'+n(ys)+'" x2="'+(x+f.w*sc/2*1.1)+'" y2="'+n(ys)+'" clip-path="url(#'+id+')" stroke="'+(real(mode)?'#2D7CB8':INK)+'" stroke-width="2"/>';
    }
    s+='<path d="'+f.d+'" transform="'+tr+'" fill="'+glass+'" stroke="'+stk+'" stroke-width="'+(real(mode)?3:2.5)+'" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>';
    if(o.bouchon){var top=-f.h;s+='<g transform="'+tr+'"><rect x="-13" y="'+(top-10)+'" width="26" height="16" rx="3" fill="'+(real(mode)?'#B9722E':'none')+'" stroke="'+INK+'" stroke-width="2"/></g>';}
    return s;
  };
  D.hauteur=function(kind,sc){return FORMES[kind].h*(sc||1);};

  /* ---------- solides ---------- */
  D.solide=function(kind,x,y,o){
    o=o||{};var m=o.mode,sc=o.sc||1,r=real(m),s='<g transform="translate('+x+' '+y+') rotate('+(o.rot||0)+') scale('+sc+')" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round">';
    if(kind==='caillou')s+='<path d="M-26,0 L-30,-16 L-18,-30 L4,-34 L24,-24 L30,-8 L22,0 Z" fill="'+(r?'#8E949D':'none')+'"/>'+(r?'<path d="M-12,-24 L4,-28 L12,-20" fill="none" stroke="#C9CDD3"/>':'');
    if(kind==='bois')s+='<rect x="-30" y="-24" width="60" height="24" rx="3" fill="'+(r?'#B77A3E':'none')+'"/>'+(r?'<path d="M-24,-16 Q0,-22 24,-16 M-24,-8 Q0,-14 24,-8" fill="none" stroke="#8A5524"/>':'<path d="M-24,-12 H24" fill="none"/>');
    if(kind==='gomme')s+='<rect x="-26" y="-20" width="52" height="20" rx="6" fill="'+(r?'#F2A3B5':'none')+'"/>'+(r?'<rect x="-8" y="-20" width="16" height="20" fill="#4A78C8" stroke="none"/>':'');
    if(kind==='clou')s+='<rect x="-3" y="-34" width="6" height="34" fill="'+(r?'#9AA2AD':'none')+'"/><rect x="-11" y="-38" width="22" height="6" rx="2" fill="'+(r?'#9AA2AD':'none')+'"/>';
    return s+'</g>';
  };
  /* grains déterministes dans un triangle (tas) */
  function grainsTas(kind,x,y,w,h,mode){
    var s='',i,seed=7,cols={sel:'#F4F4F0',sable:'#E6C77A',farine:'#FAF7EE',riz:'#EFE7D2'},r=real(mode),rad=kind==='riz'?3.4:kind==='farine'?1.8:2.4;
    function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
    for(i=0;i<(kind==='farine'?190:130);i++){
      var t=rnd(),px=(rnd()*2-1)*(1-t)*w/2,py=-t*h-rnd()*3;
      if(kind==='riz')s+='<ellipse cx="'+n(x+px)+'" cy="'+n(y+py)+'" rx="'+rad+'" ry="1.6" transform="rotate('+Math.round(rnd()*180)+' '+n(x+px)+' '+n(y+py)+')" fill="'+(r?cols[kind]:'none')+'" stroke="'+INK+'" stroke-width=".8"/>';
      else s+='<circle cx="'+n(x+px)+'" cy="'+n(y+py)+'" r="'+rad+'" fill="'+(r?cols[kind]:'none')+'" stroke="'+(r?'#A89C78':INK)+'" stroke-width=".8"/>';
    }
    return s;
  }
  D.tas=function(kind,x,y,o){o=o||{};var w=o.w||90,h=o.h||40;return grainsTas(kind,x,y,w,h,o.mode);};
  /* loupe virtuelle : quelques grands grains de formes propres (grossissement qualitatif, sans échelle) */
  D.loupe=function(kind,x,y,o){
    o=o||{};var r=real(o.mode),s='<circle cx="'+x+'" cy="'+y+'" r="62" fill="'+(r?'#FFFFFF':'none')+'" stroke="'+INK+'" stroke-width="3"/><line x1="'+(x+44)+'" y1="'+(y+44)+'" x2="'+(x+82)+'" y2="'+(y+82)+'" stroke="'+INK+'" stroke-width="8" stroke-linecap="round"/>';
    var cols={sel:'#F4F4F0',sable:'#E6C77A',farine:'#FAF7EE',riz:'#EFE7D2'},P=[[-24,-22,'M-10,-6 L0,-12 L10,-4 L8,8 L-6,10 Z'],[18,-20,'M-9,-4 L2,-11 L11,0 L4,10 L-8,6 Z'],[-4,10,'M-12,-2 L-2,-10 L10,-6 L12,6 L0,12 L-10,8 Z'],[28,14,'M-8,-4 L4,-8 L10,2 L2,10 L-8,6 Z'],[-30,16,'M-8,-6 L6,-8 L10,4 L-2,10 L-10,2 Z']];
    if(kind==='riz')P=[[-22,-18,'M-14,-4 Q0,-10 14,-4 Q0,2 -14,-4 Z'],[16,-14,'M-14,-4 Q0,-10 14,-4 Q0,2 -14,-4 Z'],[-6,8,'M-14,-4 Q0,-10 14,-4 Q0,2 -14,-4 Z'],[24,16,'M-14,-4 Q0,-10 14,-4 Q0,2 -14,-4 Z']];
    P.forEach(function(p,i){s+='<path d="'+p[2]+'" transform="translate('+(x+p[0])+' '+(y+p[1])+') rotate('+(i*37)+')" fill="'+(r?cols[kind]||'#ddd':'none')+'" stroke="'+(r?'#7C735A':INK)+'" stroke-width="2"/>';});
    return s;
  };
  D.fleche=function(x1,y1,x2,y2,col,w){
    var a=Math.atan2(y2-y1,x2-x1),L=9,c=col||INK;
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/><path d="M'+x2+' '+y2+' L'+n(x2-L*Math.cos(a-.45))+' '+n(y2-L*Math.sin(a-.45))+' L'+n(x2-L*Math.cos(a+.45))+' '+n(y2-L*Math.sin(a+.45))+' Z" fill="'+c+'"/>';
  };
  D.bulles=function(x,y,k,mode){var s='',i;for(i=0;i<k;i++)s+='<circle cx="'+(x+((i*13)%17)-8)+'" cy="'+(y-i*13)+'" r="'+(3+(i%3))+'" fill="'+(real(mode)?'rgba(255,255,255,.8)':'none')+'" stroke="'+INK+'" stroke-width="1.5"/>';return s;};
  D.points=function(x,y,w,h,k){var s='',i,seed=11;function r(){seed=(seed*16807)%2147483647;return seed/2147483647;}for(i=0;i<k;i++)s+='<circle cx="'+n(x+r()*w)+'" cy="'+n(y+r()*h)+'" r="1.6" fill="'+INK+'" opacity=".55"/>';return s;};

  /* ---------- thermomètres ---------- */
  /* o : {type:'lab'|'med', T, mode, zoom, h} ; x = axe du tube, y = haut du tube */
  D.thermometre=function(x,y,o){
    o=o||{};var m=o.mode,r=real(m),H=o.h||190,lab=o.type!=='med',lo=lab?M.LAB.min:M.MED.min,hi=lab?M.LAB.max:M.MED.max,T=o.T;
    if(o.zoom&&lab){lo=Math.round(T)-6;hi=Math.round(T)+6;}
    var y0=y+H,span=hi-lo,py=function(v){return y0-(Math.max(lo,Math.min(hi,v))-lo)/span*H;};
    var s='<rect x="'+(x-8)+'" y="'+(y-8)+'" width="16" height="'+(H+16)+'" rx="8" fill="'+(r?'rgba(200,225,245,.45)':'none')+'" stroke="'+(r?'#5F7596':INK)+'" stroke-width="2.5"/>';
    s+='<circle cx="'+x+'" cy="'+(y0+18)+'" r="17" fill="'+(r?'#D63B3B':INK)+'" stroke="'+INK+'" stroke-width="2.5"/>';
    if(T!=null){var ty=py(T);s+='<rect x="'+(x-3.5)+'" y="'+n(ty)+'" width="7" height="'+n(y0+14-ty)+'" fill="'+(r?'#D63B3B':INK)+'"/>';}
    var step=lab?(o.zoom?1:5):.1,k,v;
    for(k=0;k<=span/step+1e-6;k++){
      v=lo+k*step;var maj=lab?(o.zoom?(Math.round(v)%5===0):(Math.round(v)%10===0)):(Math.abs(v-Math.round(v))<.01),mid=!lab&&Math.abs(v*10%5)<.01&&!maj,w=maj?14:mid?10:6,yy=py(v);
      s+='<line x1="'+(x+9)+'" y1="'+n(yy)+'" x2="'+(x+9+w)+'" y2="'+n(yy)+'" stroke="'+INK+'" stroke-width="'+(maj?2:1)+'"/>';
      if(maj&&(!lab||o.zoom||Math.round(v)%20===0||Math.round(v)===110))s+=txt(x+34,n(yy+4),String(Math.round(v)),12,INK,700,'start');
    }
    return s;
  };
  D.partiesThermo=function(x,y,H){H=H||190;return [['Tube',x-8,y+20],['Liquide',x,y+90],['Graduations',x+16,y+60],['Réservoir',x,y+H+18]];};

  /* ---------- seringue (axe horizontal) ---------- */
  /* piston : 1 enfoncé, 2 repos, 3 tiré ; bouchee : doigt-bouchon au bout ; fleches : nombre de flèches de poussée */
  D.seringue=function(x,y,o){
    o=o||{};var m=o.mode,r=real(m),p=o.piston||2,L=200,pos={1:70,2:110,3:150}[p],s='';
    s+='<rect x="'+x+'" y="'+(y-22)+'" width="'+L+'" height="44" rx="4" fill="'+(r?'rgba(200,225,245,.35)':'none')+'" stroke="'+(r?'#5F7596':INK)+'" stroke-width="3"/>';
    s+='<rect x="'+(x+L)+'" y="'+(y-6)+'" width="20" height="12" fill="'+(r?'#C9D3E0':'none')+'" stroke="'+INK+'" stroke-width="2"/>';
    s+='<rect x="'+(x+pos-8)+'" y="'+(y-20)+'" width="14" height="40" fill="'+(r?'#3D4B6B':INK)+'"/><line x1="'+(x+pos-8)+'" y1="'+y+'" x2="'+(x-50+pos)+'" y2="'+y+'" stroke="'+INK+'" stroke-width="5"/><rect x="'+(x-58+pos)+'" y="'+(y-18)+'" width="8" height="36" rx="3" fill="'+(r?'#3D4B6B':INK)+'"/>';
    s+=D.points(x+pos+8,y-17,L-pos-14,34,Math.round((L-pos)/4));
    if(o.bouchee)s+='<rect x="'+(x+L+20)+'" y="'+(y-10)+'" width="14" height="20" rx="4" fill="'+(r?'#E8B48A':'none')+'" stroke="'+INK+'" stroke-width="2"/>';
    for(var k=0;k<5;k++)s+='<line x1="'+(x+40+k*35)+'" y1="'+(y-22)+'" x2="'+(x+40+k*35)+'" y2="'+(y-14)+'" stroke="'+INK+'" stroke-width="1.5"/>';
    for(k=0;k<(o.fleches||0);k++)s+=D.fleche(x+L-22,y-14+k*14,x+L-2,y-14+k*14,ROUGE,2.5);
    return s;
  };

  /* ---------- ballon de baudruche ---------- */
  D.ballon=function(x,y,rr,o){o=o||{};var r=real(o.mode);return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rr+'" ry="'+n(rr*1.18)+'" fill="'+(r?'#E8505B':'none')+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+(x-5)+' '+n(y+rr*1.18)+' L'+x+' '+n(y+rr*1.18+9)+' L'+(x+5)+' '+n(y+rr*1.18)+' Z" fill="'+(r?'#E8505B':'none')+'" stroke="'+INK+'" stroke-width="2"/>';};

  /* ---------- verre renversé (air) ---------- */
  D.verreRenverse=function(x,y,o){
    o=o||{};var r=real(o.mode),rot=o.incline||0,h=o.h||90,w=o.w||34,ev=o.eauDans==null?0:o.eauDans,s='',id='v'+(++uid);
    var tr='translate('+x+' '+y+') rotate('+rot+')',d='M-'+w+',0 L-'+(w-8)+','+h+' L'+(w-8)+','+h+' L'+w+',0 Z';
    s+='<clipPath id="'+id+'"><path d="'+d+'" transform="'+tr+'"/></clipPath>';
    if(ev>0)s+='<rect x="'+(x-120)+'" y="'+n(y+h-h*ev)+'" width="240" height="'+n(h*ev+40)+'" clip-path="url(#'+id+')" fill="'+(r?'rgba(91,168,224,.7)':'url(#nlh)')+'"/>';
    s+='<path d="'+d+'" transform="'+tr+'" fill="'+(r?'rgba(190,220,245,.3)':'none')+'" stroke="'+(r?'#5F7596':INK)+'" stroke-width="3"/>';
    s+='<g transform="'+tr+'">'+D.points(-w+10,6,2*w-20,Math.max(8,h*(1-ev)-12),Math.round(26*(1-ev)))+'</g>';
    return s;
  };

  /* ---------- balance ---------- */
  D.balance=function(x,y,o){
    o=o||{};var r=real(o.mode),s='<rect x="'+(x-80)+'" y="'+(y-12)+'" width="160" height="30" rx="8" fill="'+(r?'#DDE3EC':'none')+'" stroke="'+INK+'" stroke-width="2.5"/><rect x="'+(x-60)+'" y="'+(y-52)+'" width="120" height="8" rx="3" fill="'+(r?'#9AA7BA':'none')+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x-34)+'" y="'+(y-7)+'" width="68" height="18" rx="3" fill="#10212E"/>';
    s+=txt(x,y+7,o.texte||'0 g',14,'#8DF7B1',800);
    return s;
  };

  /* ---------- glaçons ---------- */
  D.glacons=function(x,y,k,mode){
    var s='',i,P=[[0,0],[22,-4],[-22,-2],[10,-22],[-10,-20],[34,-18],[-34,-16]];
    for(i=0;i<k&&i<P.length;i++)s+='<rect x="'+(x+P[i][0]-9)+'" y="'+(y+P[i][1]-9)+'" width="18" height="18" rx="3" transform="rotate('+(i*13)+' '+(x+P[i][0])+' '+(y+P[i][1])+')" fill="'+(real(mode)?'rgba(220,242,255,.9)':'none')+'" stroke="'+(real(mode)?'#7DB8D8':INK)+'" stroke-width="2"/>';
    return s;
  };

  /* ---------- main (toucher) ---------- */
  D.main=function(x,y,o){
    o=o||{};var r=real(o.mode),col=r?(o.col||'#E8B48A'):'none',s='<g transform="translate('+x+' '+y+') scale('+(o.sc||1)+')" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round">';
    s+='<path d="M-18,0 L-18,-22 Q-18,-30 -10,-30 L10,-30 Q18,-30 18,-22 L18,0 Z" fill="'+col+'"/>';
    [-14,-5,4,13].forEach(function(dx,i){s+='<rect x="'+(dx-4)+'" y="'+(-62+(i%3===1?-4:0))+'" width="8" height="36" rx="4" fill="'+col+'"/>';});
    return s+'</g>';
  };
  D.bac=function(x,y,o){o=o||{};var r=real(o.mode),s=D.recipient('cristallisoir',x,y,{niveau:.78,liq:o.liq,mode:o.mode,sc:.85});if(o.glace)s+=D.glacons(x-10,y-34,3,o.mode);return s;};

  /* ---------- pictogrammes de danger (losange rouge à fond blanc, dessin noir) ---------- */
  var ICONES={
    explosif:'<circle cx="-4" cy="6" r="11" fill="#111"/><rect x="2" y="-9" width="8" height="6" rx="1" fill="#111" transform="rotate(35 4 -6)"/><path d="M12,-18 L15,-8 L24,-12 L17,-3 L26,3 L15,3 L14,13 L8,5 L1,10 L4,0 L-4,-3 L5,-6 Z" fill="#111" transform="translate(-4 -6) scale(.55)"/><path d="M16,-18 L18,-12 M22,-10 L17,-8" stroke="#111" stroke-width="2"/>',
    inflammable:'<path d="M0,-24 C8,-14 18,-10 16,4 C15,14 8,20 0,20 C-9,20 -17,14 -15,3 C-14,-4 -9,-6 -7,-14 C-4,-10 -2,-8 -1,-4 C3,-10 3,-17 0,-24 Z" fill="#111"/>',
    corrosif:'<path d="M-22,-16 L-10,-22 L-4,-12 L-14,-6 Z" fill="#111"/><path d="M-12,-8 L-8,0 M-6,-6 L-2,2" stroke="#111" stroke-width="2.5"/><circle cx="-6" cy="5" r="2.3" fill="#111"/><circle cx="2" cy="9" r="2.3" fill="#111"/><path d="M-22,16 H24 L22,22 H-20 Z" fill="#111"/><path d="M6,-14 Q4,-2 8,4 L22,4 L24,-10 Z" fill="#111"/><path d="M8,4 L12,10 M14,4 L16,10 M20,4 L22,10" stroke="#111" stroke-width="2.5"/>',
    toxique:'<ellipse cx="0" cy="-8" rx="13" ry="12" fill="#111"/><rect x="-7" y="1" width="14" height="10" rx="2" fill="#111"/><circle cx="-5" cy="-9" r="3.6" fill="#fff"/><circle cx="5" cy="-9" r="3.6" fill="#fff"/><path d="M-2,-2 L0,-5 L2,-2 Z" fill="#fff"/><path d="M-4,6 V11 M0,6 V11 M4,6 V11" stroke="#fff" stroke-width="1.5"/><path d="M-20,12 L20,22 M20,12 L-20,22" stroke="#111" stroke-width="4" stroke-linecap="round"/>',
    comburant:'<circle cx="0" cy="12" r="11" fill="none" stroke="#111" stroke-width="4"/><path d="M0,-22 C6,-14 12,-11 11,-3 C10,3 5,5 0,5 C-6,5 -11,2 -10,-4 C-9,-8 -5,-10 -4,-15 C-2,-12 -1,-10 0,-7 C3,-12 2,-17 0,-22 Z" fill="#111"/>',
    gaz:'<rect x="-9" y="-16" width="18" height="38" rx="9" fill="#111"/><rect x="-4" y="-24" width="8" height="9" rx="2" fill="#111"/><rect x="-8" y="-27" width="16" height="4" rx="2" fill="#111"/>',
    irritant:'<rect x="-4.5" y="-22" width="9" height="28" rx="3" fill="#111"/><circle cx="0" cy="14" r="5.2" fill="#111"/>',
    sante:'<circle cx="0" cy="-16" r="6.5" fill="#111"/><path d="M-14,20 L-14,-4 Q-14,-8 -8,-8 L8,-8 Q14,-8 14,-4 L14,20 Z" fill="#111"/><path d="M0,-3 L2,3 L8,3 L3,7 L5,13 L0,9 L-5,13 L-3,7 L-8,3 L-2,3 Z" fill="#fff"/>',
    environnement:'<path d="M-20,22 H-2" stroke="#111" stroke-width="3"/><rect x="-12" y="4" width="4" height="18" fill="#111"/><circle cx="-10" cy="-4" r="9" fill="#111"/><circle cx="-17" cy="4" r="6" fill="#111"/><circle cx="-3" cy="4" r="6" fill="#111"/><path d="M4,6 Q14,-2 24,6 Q14,14 4,6 Z" fill="#111"/><path d="M24,6 L30,0 L30,12 Z" fill="#111"/><circle cx="10" cy="5" r="1.6" fill="#fff"/><path d="M2,20 Q10,16 18,20 Q26,24 32,20" fill="none" stroke="#111" stroke-width="2.5"/>'
  };
  D.picto=function(id,x,y,size){
    var s=(size||80)/80,ic=ICONES[id];if(!ic)throw new Error('pictogramme inconnu : '+id);
    return '<g transform="translate('+x+' '+y+') scale('+n(s)+')"><rect x="-39" y="-39" width="78" height="78" rx="2" fill="#fff" stroke="'+ROUGE+'" stroke-width="9" transform="rotate(45)"/><g transform="scale(1.02)">'+ic+'</g></g>';
  };
  D.pictoSvg=function(id,size){var p=M.PICTOS.filter(function(q){return q.id===id;})[0];return D.vue(D.picto(id,60,60,100),'Pictogramme « '+p.nom+' » : '+p.alt,'0 0 120 120');};
  /* ---------- équipements de protection individuelle (symboles bleus d'obligation) ---------- */
  var EPI={
    blouse:'<path d="M-12,-20 L-22,-6 L-18,20 L-9,20 L-9,-2 L-6,18 L6,18 L9,-2 L9,20 L18,20 L22,-6 L12,-20 L6,-14 L0,-8 L-6,-14 Z" fill="#fff"/>',
    lunettes:'<circle cx="-12" cy="2" r="9" fill="none" stroke="#fff" stroke-width="4"/><circle cx="12" cy="2" r="9" fill="none" stroke="#fff" stroke-width="4"/><path d="M-3,0 H3 M-21,0 L-26,-6 M21,0 L26,-6" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
    masque:'<path d="M-16,-8 Q0,-14 16,-8 L14,10 Q0,18 -14,10 Z" fill="#fff"/><path d="M-16,-4 Q-26,-2 -24,8 M16,-4 Q26,-2 24,8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M-8,0 H8 M-8,5 H8" stroke="#1F5FBF" stroke-width="2"/>',
    gants:'<path d="M-14,20 L-14,0 Q-14,-6 -8,-6 L-8,-18 Q-8,-22 -4,-22 Q0,-22 0,-18 L0,-22 Q0,-26 4,-26 Q8,-26 8,-22 L8,-18 Q8,-14 12,-12 Q16,-10 16,-4 L16,20 Z" fill="#fff"/>'
  };
  D.epi=function(id,x,y,size){
    var s=(size||70)/70,ic=EPI[id];if(!ic)throw new Error('équipement inconnu : '+id);
    return '<g transform="translate('+x+' '+y+') scale('+n(s)+')"><circle r="34" fill="'+BLEU+'"/>'+ic+'</g>';
  };
  D.epiSvg=function(id){var p=M.EPI.filter(function(q){return q.id===id;})[0];return D.vue(D.epi(id,40,40,70),p.alt,'0 0 80 80');};

  /* ---------- objets du quotidien (tri, gaz) ---------- */
  var OBJ={
    pile:'<rect x="-14" y="-26" width="28" height="48" rx="4" fill="#3B4A7A"/><rect x="-6" y="-32" width="12" height="7" rx="2" fill="#B9C2D6"/><rect x="-14" y="-26" width="28" height="12" rx="4" fill="#E8B13A"/><path d="M-4,2 H4 M0,-2 V6" stroke="#fff" stroke-width="3"/>',
    pesticide:'<path d="M-22,22 V-14 L-12,-26 H8 L12,-20 V-26 H22 V22 Z" fill="#E9E1B8"/><rect x="8" y="-34" width="14" height="10" rx="2" fill="#5B8F3A"/><path d="M-22,-4 H22" stroke="#C9BF8E" stroke-width="2"/><g transform="translate(0 8) scale(.34)"><rect x="-39" y="-39" width="78" height="78" fill="#fff" stroke="#D6221C" stroke-width="9" transform="rotate(45)"/>'+ICONES.environnement+'</g>',
    bouteille:'<path d="M-6,-34 H6 V-24 Q16,-16 16,-4 V20 Q16,24 12,24 H-12 Q-16,24 -16,20 V-4 Q-16,-16 -6,-24 Z" fill="rgba(150,205,240,.8)"/><rect x="-7" y="-40" width="14" height="7" rx="2" fill="#2E86C1"/><path d="M-16,4 H16" stroke="#6BB0DA" stroke-width="3"/>',
    epluchures:'<path d="M-24,10 Q-20,-20 6,-20 Q22,-18 20,0 Q16,-8 4,-8 Q-8,-6 -10,10 Q-14,22 -24,10 Z" fill="#8DBB4A"/><path d="M-8,18 Q4,2 20,6 Q26,18 12,22 Q0,24 -8,18 Z" fill="#E3A93C"/>',
    canette:'<rect x="-13" y="-28" width="26" height="52" rx="5" fill="#C9D1DB"/><rect x="-13" y="-20" width="26" height="22" fill="#D6542C"/><ellipse cx="0" cy="-28" rx="13" ry="4" fill="#9AA5B4"/>',
    butane:'<rect x="-16" y="-24" width="32" height="48" rx="8" fill="#E24B2B"/><rect x="-7" y="-34" width="14" height="10" rx="2" fill="#7A828F"/><rect x="-4" y="-38" width="8" height="5" fill="#7A828F"/>',
    boisson:'<path d="M-6,-34 H6 V-24 Q16,-16 16,-4 V20 Q16,24 12,24 H-12 Q-16,24 -16,20 V-4 Q-16,-16 -6,-24 Z" fill="#7A3E1D"/><rect x="-7" y="-40" width="14" height="7" rx="2" fill="#D6221C"/><circle cx="-4" cy="-6" r="2.4" fill="#fff"/><circle cx="4" cy="2" r="2" fill="#fff"/><circle cx="-2" cy="10" r="2.6" fill="#fff"/>',
    marmite:'<path d="M-24,-8 H24 L20,20 Q20,24 16,24 H-16 Q-20,24 -20,20 Z" fill="#8F99A8"/><rect x="-28" y="-14" width="56" height="7" rx="3" fill="#5F6B7C"/><path d="M-10,-20 Q-4,-26 -10,-32 M2,-20 Q8,-26 2,-32 M14,-20 Q20,-26 14,-32" fill="none" stroke="#B9C2D0" stroke-width="3" stroke-linecap="round"/>',
    pneu:'<circle r="24" fill="none" stroke="#2B2F36" stroke-width="9"/><circle r="6" fill="#8F99A8"/><path d="M0,-18 V-6 M0,6 V18 M-18,0 H-6 M6,0 H18" stroke="#8F99A8" stroke-width="2"/>',
    oxygene:'<rect x="-13" y="-22" width="26" height="46" rx="12" fill="#2F9E5B"/><rect x="-5" y="-32" width="10" height="11" rx="2" fill="#7A828F"/><rect x="-9" y="-35" width="18" height="4" rx="2" fill="#7A828F"/>',
    flamme:'<path d="M0,-22 C7,-13 15,-9 14,3 C13,12 7,17 0,17 C-8,17 -14,12 -13,2 C-12,-4 -8,-6 -6,-13 C-3,-9 -2,-7 -1,-4 C3,-9 3,-15 0,-22 Z" fill="#F7931E"/>',
    verre_casse:'<path d="M-18,-18 L-10,10 L2,-14 L12,12 L20,-16" fill="none" stroke="#5F7596" stroke-width="4" stroke-linejoin="round"/>',
    flaque:'<ellipse cx="0" cy="8" rx="28" ry="9" fill="rgba(91,168,224,.75)"/>',
    eleve:'<circle cx="0" cy="-22" r="9" fill="#E8B48A"/><path d="M-14,26 L-14,-8 L14,-8 L14,26 Z" fill="#fff" stroke="#243049" stroke-width="2"/>',
    tuyau:'<path d="M-30,16 Q-10,-24 10,8 T32,-14" fill="none" stroke="#E8A02A" stroke-width="7" stroke-linecap="round"/>',
    lunettesobj:'<circle cx="-11" cy="0" r="8" fill="none" stroke="#243049" stroke-width="3"/><circle cx="11" cy="0" r="8" fill="none" stroke="#243049" stroke-width="3"/><path d="M-3,0 H3" stroke="#243049" stroke-width="3"/>'
  };
  D.objet=function(id,x,y,s){var ic=OBJ[id];if(!ic)throw new Error('objet inconnu : '+id);return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')" stroke="#243049" stroke-width="2" stroke-linejoin="round">'+ic+'</g>';};
  D.objetSvg=function(id,label){return D.vue(D.objet(id,60,56,1.6),label,'0 0 120 112');};
  D.OBJETS=Object.keys(OBJ);

  /* repères numérotés pour le schéma du cycle (A, B, C, D : l'élève ordonne et nomme) */
  D.repere=function(x,y,lettre){return '<circle cx="'+x+'" cy="'+y+'" r="14" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'+txt(x,y+5,lettre,15,INK,800);};
  D.etiquette=function(x,y,t,o){o=o||{};var w=o.w||Math.max(40,t.length*7.4+14);return '<rect x="'+(x-w/2)+'" y="'+(y-12)+'" width="'+w+'" height="22" rx="6" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/>'+txt(x,y+4,t,12.5,INK,700);};

  /* ---------- les six types de thermomètres à reconnaître (dessins originaux) ---------- */
  var TH={
    liquide:'<rect x="-5" y="-48" width="10" height="82" rx="5" fill="#DCEBF7"/><circle cy="40" r="10" fill="#D63B3B"/><rect x="-2.5" y="-10" width="5" height="46" fill="#D63B3B"/><path d="M8,-40 h8 M8,-28 h6 M8,-16 h8 M8,-4 h6 M8,8 h8 M8,20 h6" stroke="#243049" stroke-width="2"/>',
    sonde:'<rect x="-40" y="-40" width="52" height="38" rx="6" fill="#E8ECF2"/><rect x="-34" y="-34" width="40" height="18" rx="2" fill="#10212E"/><text x="-14" y="-20" font-size="12" font-weight="800" fill="#8DF7B1" text-anchor="middle">23,5</text><path d="M12,-20 Q30,-20 30,0 L30,30" fill="none" stroke="#243049" stroke-width="3"/><path d="M27,30 h6 l-3,22 z" fill="#9AA2AD"/>',
    infrarouge:'<path d="M-36,-14 H18 Q26,-14 26,-6 V0 H8 V24 Q8,28 4,28 H-6 Q-10,28 -10,24 V0 H-36 Z" fill="#E8ECF2"/><rect x="-30" y="-10" width="14" height="8" rx="2" fill="#10212E"/><path d="M26,-8 L52,-8" stroke="#D6221C" stroke-width="2.5" stroke-dasharray="4 3"/><circle cx="54" cy="-8" r="3" fill="#D6221C"/>',
    mural:'<rect x="-38" y="-44" width="76" height="88" rx="8" fill="#B77A3E"/><circle r="26" fill="#fff"/><path d="M0,0 L10,-16" stroke="#D6221C" stroke-width="3" stroke-linecap="round"/><circle r="3" fill="#243049"/><path d="M-20,12 L-16,8 M20,12 L16,8 M0,-22 V-18 M-22,-6 H-18 M22,-6 H18" stroke="#243049" stroke-width="2"/>',
    minmax:'<path d="M-18,-44 V26 Q-18,40 -4,40 Q10,40 10,26 V-44" fill="none" stroke="#5F7596" stroke-width="7"/><path d="M-18,-44 V26 Q-18,40 -4,40 Q10,40 10,26 V-44" fill="none" stroke="#DCEBF7" stroke-width="3"/><rect x="-21" y="-14" width="6" height="8" fill="#243049"/><rect x="7" y="-30" width="6" height="8" fill="#243049"/><path d="M18,-40 h8 M18,-20 h8 M18,0 h8 M18,20 h8" stroke="#243049" stroke-width="2"/>',
    medical:'<rect x="-46" y="-8" width="92" height="16" rx="8" fill="#DCEBF7"/><rect x="-40" y="-2" width="60" height="4" fill="#D63B3B"/><path d="M-6,-8 v-5 M6,-8 v-4 M18,-8 v-5 M30,-8 v-4" stroke="#243049" stroke-width="2"/><circle cx="-46" cy="0" r="9" fill="#D63B3B"/>'
  };
  D.thermoType=function(id,label){var ic=TH[id];if(!ic)throw new Error('type inconnu : '+id);return D.vue('<g transform="translate(60 62)" stroke="#243049" stroke-width="2" stroke-linejoin="round">'+ic+'</g>',label,'0 0 120 124');};
  D.THERMO_TYPES=Object.keys(TH);
  M.dessin=D;
})();
