/* NohobaLab · 6e Côte d'Ivoire · dessins originaux du thème « Mesure de grandeurs physiques ».
   Deux rendus par objet : « montage » (réaliste, en couleurs) et « schema » (normalisé : traits noirs, hachures pour les liquides).
   Éprouvettes graduées (mL et cm³), zoom sur le ménisque, récipients du marché, règle, cubes unités, balance de Roberval,
   boîte de masses marquées, objets pesés, six types de balances. Aucun dessin repris d'un manuel ou d'une fiche officielle. */
(function(){
  'use strict';
  var Q=window.NohobaMesures,MD=window.NohobaMatiere.dessin,A=window.NohobaAtelier;
  var INK='#243049',EAU='#5BA8E0',LAITON='#C9A227',FONT='Atkinson Hyperlegible,system-ui,sans-serif';
  var D={};
  function n(v){return Math.round(v*10)/10;}
  function T(x,y,t,s,c,w,a){return A.T(n(x),n(y),t,s||12,c||INK,w||700,a||'middle');}
  var real=function(m){return m!=='schema';};
  D.vue=function(inner,label,vb){return MD.vue(inner,label,vb||'0 0 460 260');};
  D.fleche=MD.fleche;D.etiquette=MD.etiquette;
  var uid=0;
  function fill(m,col){return real(m)?col:'none';}
  function liq(m,col){return real(m)?(col||EAU):'url(#nlh)';}
  function verre(m){return real(m)?'rgba(190,220,245,.28)':'none';}
  function bord(m){return real(m)?'#5F7596':INK;}
  D.sol=function(m,y,x1,x2){return '<line x1="'+(x1||16)+'" y1="'+(y||232)+'" x2="'+(x2||444)+'" y2="'+(y||232)+'" stroke="'+(real(m)?'#B8C2D2':INK)+'" stroke-width="3"/>';};

  /* ---------- éprouvette graduée (et biberon, seringue) ----------
     o : {id:'A'|'B'|'biberon'|'seringue', V, mode, H (hauteur graduée), W (largeur), sansNombres}
     (x, yBas) = milieu du pied. Renvoie {svg, py} où py(v) donne l'ordonnée d'un volume. */
  D.eprouvette=function(x,yBas,o){
    o=o||{};var e=Q.EPROUVETTES[o.id||'A'],m=o.mode,H=o.H||170,W=o.W||(o.id==='biberon'?50:o.id==='seringue'?24:34),cap=e.cap,d=Q.division(e.id);
    var y0=yBas-18,yc=y0-H,py=function(v){return y0-(v/cap)*H;},s='',hw=W/2,top=yc-(o.id==='seringue'?8:22);
    /* pied */
    if(o.id==='A'||o.id==='B'||!o.id)s+='<path d="M'+(x-34)+' '+yBas+' L'+(x+34)+' '+yBas+' L'+(x+24)+' '+(yBas-8)+' L'+(x-24)+' '+(yBas-8)+' Z" fill="'+fill(m,'#C9D3E0')+'" stroke="'+INK+'" stroke-width="2"/>';
    if(o.id==='biberon')s+='<path d="M'+(x-hw+6)+' '+(top)+' Q'+x+' '+(top-34)+' '+(x+hw-6)+' '+top+' Z" fill="'+fill(m,'#E8C08A')+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x-hw-4)+'" y="'+(top-4)+'" width="'+(W+8)+'" height="12" rx="4" fill="'+fill(m,'#F0F2F6')+'" stroke="'+INK+'" stroke-width="2"/>';
    if(o.id==='seringue'){var yp0=py(o.V||0);s+='<rect x="'+(x-3)+'" y="'+n(top-30)+'" width="6" height="'+n(yp0-8-(top-30))+'" fill="'+fill(m,'#3D4B6B')+'" stroke="'+INK+'" stroke-width="1.5"/><rect x="'+(x-16)+'" y="'+n(top-36)+'" width="32" height="7" rx="3" fill="'+fill(m,'#3D4B6B')+'" stroke="'+INK+'" stroke-width="1.5"/><rect x="'+(x-hw-8)+'" y="'+(top-2)+'" width="'+(W+16)+'" height="6" rx="2" fill="'+fill(m,'#C9D3E0')+'" stroke="'+INK+'" stroke-width="1.5"/><path d="M'+(x-4)+' '+(y0+6)+' h8 v14 h-8 z" fill="'+fill(m,'#C9D3E0')+'" stroke="'+INK+'" stroke-width="1.5"/>';}
    /* liquide et ménisque concave (eau) : le bas du ménisque est au niveau py(V) */
    var id='ep'+(++uid);
    s+='<clipPath id="'+id+'"><path d="M'+(x-hw)+' '+top+' V'+(y0)+' Q'+(x-hw)+' '+(y0+6)+' '+(x-hw+6)+' '+(y0+6)+' H'+(x+hw-6)+' Q'+(x+hw)+' '+(y0+6)+' '+(x+hw)+' '+y0+' V'+top+' Z"/></clipPath>';
    if(o.V>0&&o.id==='seringue'){var yq=py(o.V);s+='<rect x="'+(x-hw)+'" y="'+n(yq)+'" width="'+W+'" height="'+n(y0+6-yq)+'" clip-path="url(#'+id+')" fill="'+liq(m,o.liq)+'"'+(real(m)?' opacity=".75"':'')+'/><rect x="'+(x-hw+1)+'" y="'+n(yq-8)+'" width="'+(W-2)+'" height="8" fill="'+fill(m,'#2B2F36')+'" stroke="'+INK+'" stroke-width="1"/>';}
    else if(o.V>0){var yv=py(o.V),k=Math.min(5,W/7);
      s+='<path d="M'+(x-hw-2)+' '+n(yv-k)+' Q'+x+' '+n(yv+k)+' '+(x+hw+2)+' '+n(yv-k)+' V'+(y0+10)+' H'+(x-hw-2)+' Z" clip-path="url(#'+id+')" fill="'+liq(m,o.liq)+'"'+(real(m)?' opacity=".75"':'')+'/>';
      s+='<path d="M'+(x-hw-2)+' '+n(yv-k)+' Q'+x+' '+n(yv+k)+' '+(x+hw+2)+' '+n(yv-k)+'" clip-path="url(#'+id+')" fill="none" stroke="'+(real(m)?'#2D7CB8':INK)+'" stroke-width="2"/>';}
    /* tube */
    s+='<path d="M'+(x-hw)+' '+top+(o.id==='A'||o.id==='B'||!o.id?' l-6 -6':'')+' M'+(x-hw)+' '+top+' V'+y0+' Q'+(x-hw)+' '+(y0+6)+' '+(x-hw+6)+' '+(y0+6)+' H'+(x+hw-6)+' Q'+(x+hw)+' '+(y0+6)+' '+(x+hw)+' '+y0+' V'+top+'" fill="'+verre(m)+'" stroke="'+bord(m)+'" stroke-width="2.5" stroke-linejoin="round"/>';
    /* graduations : un trait par division si l'écart le permet, des nombres tous les « écart » */
    var pxd=H*d/cap,pas=pxd>=3?1:5,nb=Math.round(cap/d),i;
    for(i=0;i<=nb;i+=pas){var v=i*d,yy=py(v),maj=Math.abs(v/e.ecart-Math.round(v/e.ecart))<1e-6,mid=!maj&&e.divisions%2===0&&Math.abs((v/e.ecart)*2-Math.round((v/e.ecart)*2))<1e-6,w=maj?16:mid?11:7;
      s+='<line x1="'+(x+hw)+'" y1="'+n(yy)+'" x2="'+(x+hw-w)+'" y2="'+n(yy)+'" stroke="'+INK+'" stroke-width="'+(maj?1.8:1)+'"/>';
      if(maj&&!o.sansNombres&&i>0)s+=T(x+hw+4,yy+4,Q.fr(v),11,INK,700,'start');}
    s+=T(x-hw-4,yc+10,e.unite,12,INK,800,'end');
    return {svg:s,py:py,x:x,hw:hw,top:top,y0:y0};
  };

  /* ---------- zoom sur le ménisque, vu de profil, avec l'œil et la ligne de visée ----------
     (x,y) = coin haut gauche du cadre ; o : {id, V, oeil:'haut'|'niveau'|'bas', mode, w, h} */
  D.zoom=function(x,y,o){
    o=o||{};var e=Q.EPROUVETTES[o.id||'A'],m=o.mode,w=o.w||210,h=o.h||200,d=Q.division(e.id),pxd=14,cy=y+h/2,V=Q.lecture(e.id,o.V,'niveau').vrai;
    var yv=function(v){return cy-(v-V)/d*pxd;},s='',id='zm'+(++uid);
    s+='<clipPath id="'+id+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10"/></clipPath>';
    s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="'+(real(m)?'#FFFFFF':'none')+'" stroke="'+INK+'" stroke-width="2"/>';
    var xl=x+18,xr=x+104,g='';
    /* liquide avec ménisque concave (bords relevés) */
    g+='<path d="M'+xl+' '+(cy-12)+' Q'+((xl+xr)/2)+' '+(cy+12)+' '+xr+' '+(cy-12)+' V'+(y+h)+' H'+xl+' Z" fill="'+liq(m)+'"'+(real(m)?' opacity=".7"':'')+'/>';
    g+='<path d="M'+xl+' '+(cy-12)+' Q'+((xl+xr)/2)+' '+(cy+12)+' '+xr+' '+(cy-12)+'" fill="none" stroke="'+(real(m)?'#2D7CB8':INK)+'" stroke-width="2.5"/>';
    g+='<path d="M'+xl+' '+y+' V'+(y+h)+' M'+xr+' '+y+' V'+(y+h)+'" stroke="'+bord(m)+'" stroke-width="3"/>';
    /* graduations sur la paroi tournée vers l'œil */
    for(var k=-8;k<=8;k++){var v=V+k*d,yy=yv(v);if(yy<y+4||yy>y+h-4)continue;var maj=Math.abs(v/e.ecart-Math.round(v/e.ecart))<1e-6,mid=!maj&&Math.abs(v/(e.ecart/2)-Math.round(v/(e.ecart/2)))<1e-6&&e.divisions%2===0;
      g+='<line x1="'+xr+'" y1="'+n(yy)+'" x2="'+(xr-(maj?22:mid?15:9))+'" y2="'+n(yy)+'" stroke="'+INK+'" stroke-width="'+(maj?2.2:1.3)+'"/>';
      if(maj)g+=T(xr-26,yy+5,Q.fr(v),13,INK,800,'end');}
    s+='<g clip-path="url(#'+id+')">'+g+'</g>';
    /* œil et ligne de visée vers le bas du ménisque */
    var oeil=o.oeil||'niveau',mx=(xl+xr)/2,my=cy,ex=x+w-26,dec=oeil==='haut'?2:oeil==='bas'?-2:0,yi=my-dec*pxd,t=(xr-ex)/(mx-ex),ey=dec?(yi-my*t)/(1-t):my;
    if(oeil){
      s+='<line x1="'+n(ex)+'" y1="'+n(ey)+'" x2="'+mx+'" y2="'+my+'" stroke="'+(dec?'#D6221C':'#1B7F3B')+'" stroke-width="2" stroke-dasharray="5 4"/>';
      s+='<ellipse cx="'+n(ex)+'" cy="'+n(ey)+'" rx="13" ry="8" fill="'+(real(m)?'#fff':'none')+'" stroke="'+INK+'" stroke-width="2"/><circle cx="'+n(ex-5)+'" cy="'+n(ey)+'" r="4.5" fill="'+INK+'"/>';
      if(dec)s+='<circle cx="'+xr+'" cy="'+n(yi)+'" r="4" fill="#D6221C"/>';
    }
    s+='<line x1="'+(xl-6)+'" y1="'+my+'" x2="'+(xr+6)+'" y2="'+my+'" stroke="'+INK+'" stroke-width="1" stroke-dasharray="3 3"/>';
    return s;
  };

  /* ---------- récipients du marché et du laboratoire ---------- */
  D.bouteille=function(kind,x,y,o){
    o=o||{};var m=o.mode,s,jus=o.vide?(real(m)?'rgba(225,235,245,.55)':'none'):fill(m,'rgba(240,210,140,.9)');
    if(kind==='haute'){s='<path d="M'+(x-7)+' '+(y-200)+' h14 v18 q12 10 12 26 V'+(y-4)+' q0 4 -4 4 H'+(x-15)+' q-4 0 -4 -4 V'+(y-156)+' q0 -16 12 -26 Z" fill="'+jus+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x-8)+'" y="'+(y-208)+'" width="16" height="9" rx="2" fill="'+fill(m,'#2E7B3E')+'" stroke="'+INK+'" stroke-width="1.5"/>';
      if(real(m))s+='<rect x="'+(x-19)+'" y="'+(y-110)+'" width="38" height="40" fill="#fff" stroke="'+INK+'" stroke-width="1"/>'+T(x,y-94,'jus de',9,INK,700)+T(x,y-82,'gingembre',9,INK,700);}
    else{s='<path d="M'+(x-9)+' '+(y-128)+' h18 v14 q30 8 30 30 V'+(y-4)+' q0 4 -4 4 H'+(x-35)+' q-4 0 -4 -4 V'+(y-84)+' q0 -22 30 -30 Z" fill="'+jus+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x-10)+'" y="'+(y-136)+'" width="20" height="9" rx="2" fill="'+fill(m,'#2E7B3E')+'" stroke="'+INK+'" stroke-width="1.5"/>';
      if(real(m))s+='<rect x="'+(x-30)+'" y="'+(y-66)+'" width="60" height="34" fill="#fff" stroke="'+INK+'" stroke-width="1"/>'+T(x,y-52,'jus de',9,INK,700)+T(x,y-40,'gingembre',9,INK,700);}
    return s;
  };
  D.gobelet=function(x,y,o){o=o||{};var m=o.mode;return '<path d="M'+(x-16)+' '+(y-38)+' L'+(x-12)+' '+y+' H'+(x+12)+' L'+(x+16)+' '+(y-38)+'" fill="'+(o.plein?liq(m,'#E3B23C'):verre(m))+'" stroke="'+INK+'" stroke-width="2"/>'+T(x,y+14,'0,25 L',10,INK,700);};
  /* verre mesureur de cuisine (1 L) : traits tous les 250 mL ; niveau en litres */
  D.verreMesureur=function(x,y,o){
    o=o||{};var m=o.mode,H=150,W=74,cap=o.cap||1000,pas=o.pas||250,s='',id='vm'+(++uid),py=function(v){return y-8-(v/cap)*H;};
    var d='M'+(x-W/2)+' '+(y-H-24)+' L'+(x-W/2+6)+' '+y+' H'+(x+W/2-6)+' L'+(x+W/2)+' '+(y-H-24);
    s+='<clipPath id="'+id+'"><path d="'+d+' Z"/></clipPath>';
    if(o.litres>0)s+='<rect x="'+(x-W)+'" y="'+n(py(o.litres*1000))+'" width="'+(2*W)+'" height="'+n(y-py(o.litres*1000)+4)+'" clip-path="url(#'+id+')" fill="'+liq(m,o.liq||'#E3B23C')+'"'+(real(m)?' opacity=".8"':'')+'/>';
    s+='<path d="'+d+'" fill="'+verre(m)+'" stroke="'+bord(m)+'" stroke-width="2.5"/><path d="M'+(x+W/2-2)+' '+(y-H+4)+' q30 6 26 50 q-2 30 -30 34" fill="none" stroke="'+bord(m)+'" stroke-width="5"/>';
    for(var v=pas;v<=cap;v+=pas){var yy=py(v);s+='<line x1="'+(x-W/2+4)+'" y1="'+n(yy)+'" x2="'+(x-W/2+20)+'" y2="'+n(yy)+'" stroke="'+INK+'" stroke-width="1.6"/>'+T(x-W/2+23,yy+4,v+' mL',9.5,INK,700,'start');}
    return s;
  };
  /* bécher gradué (traits indicatifs) : dessin du lot Matière + traits */
  D.becherGradue=function(x,y,o){
    o=o||{};var m=o.mode,sc=o.sc||1.4,h=MD.hauteur('becher',sc),cap=o.cap||120,s=MD.recipient('becher',x,y,{mode:m,sc:sc,niveau:o.V?o.V/cap:0,liq:EAU});
    for(var v=25;v<=100;v+=25){var yy=y-v/cap*h;s+='<line x1="'+(x-36*sc+3)+'" y1="'+n(yy)+'" x2="'+(x-36*sc+16)+'" y2="'+n(yy)+'" stroke="'+INK+'" stroke-width="1.4"/>'+T(x-36*sc+19,yy+4,String(v),9.5,INK,700,'start');}
    return s+T(x+36*sc-8,y-h+14,'mL',10,INK,800,'end');
  };
  /* cube creux de 1 dm³ (10 cm d'arête) vu en perspective, rempli ou vide */
  D.cube=function(x,y,a,o){
    o=o||{};var m=o.mode,k=a*0.45,s='',f=o.plein?liq(m,o.liq||EAU):fill(m,o.col||'rgba(230,236,245,.5)');
    s+='<path d="M'+x+' '+y+' h'+a+' v-'+a+' h-'+a+' Z" fill="'+f+'" stroke="'+INK+'" stroke-width="2"'+(real(m)&&o.plein?' opacity=".85"':'')+'/>';
    s+='<path d="M'+x+' '+(y-a)+' l'+k+' -'+k+' h'+a+' l-'+k+' '+k+' Z" fill="'+fill(m,o.col?shade(o.col,.15):'rgba(240,244,250,.6)')+'" stroke="'+INK+'" stroke-width="2"/>';
    s+='<path d="M'+(x+a)+' '+y+' l'+k+' -'+k+' v-'+a+' l-'+k+' '+k+' Z" fill="'+fill(m,o.col?shade(o.col,-.15):'rgba(200,214,232,.6)')+'" stroke="'+INK+'" stroke-width="2"/>';
    return s;
  };
  function shade(hex,t){if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;var c=[1,3,5].map(function(i){return parseInt(hex.substr(i,2),16);}).map(function(v){return Math.max(0,Math.min(255,Math.round(t>0?v+(255-v)*t:v*(1+t))));});return '#'+c.map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');}
  D.shade=shade;
  /* seringue de 1 mL, horizontale */
  D.seringue1=function(x,y,o){ /* (x,y) : début du corps */o=o||{};var m=o.mode,p=o.plein?60:0;return '<rect x="'+x+'" y="'+(y-7)+'" width="80" height="14" rx="3" fill="'+verre(m)+'" stroke="'+bord(m)+'" stroke-width="2"/>'+(p?'<rect x="'+(x+80-p)+'" y="'+(y-5)+'" width="'+p+'" height="10" fill="'+liq(m)+'"/>':'')+'<rect x="'+(x-30)+'" y="'+(y-2)+'" width="'+(30+(80-p))+'" height="4" fill="'+fill(m,'#3D4B6B')+'"/><rect x="'+(x+80)+'" y="'+(y-2)+'" width="14" height="4" fill="'+fill(m,'#C9D3E0')+'" stroke="'+INK+'" stroke-width="1"/>'+T(x+40,y-12,'1 mL',10,INK,700);};

  /* ---------- règle graduée (cm, demi-cm) ---------- */
  /* (x,y) = zéro sur le bord haut ; L cm ; px par cm ; barre : longueur de l'objet posé contre la règle */
  D.regle=function(x,y,L,px,o){
    o=o||{};var m=o.mode,s='<rect x="'+(x-10)+'" y="'+y+'" width="'+(L*px+20)+'" height="30" rx="3" fill="'+fill(m,'#F6E7B8')+'" stroke="'+INK+'" stroke-width="1.8"/>',i;
    for(i=0;i<=L*10;i++){var xx=x+i*px/10,maj=i%10===0,half=i%5===0;s+='<line x1="'+n(xx)+'" y1="'+y+'" x2="'+n(xx)+'" y2="'+(y+(maj?13:half?9:5))+'" stroke="'+INK+'" stroke-width="'+(maj?1.5:.8)+'"/>';if(maj)s+=T(xx,y+25,String(i/10),10,INK,700);}
    if(o.barre)s+='<rect x="'+x+'" y="'+(y-14)+'" width="'+n(o.barre*px)+'" height="12" rx="2" fill="'+fill(m,o.col||'#8E949D')+'" stroke="'+INK+'" stroke-width="1.5"/>';
    if(o.titre)s+=T(x-12,y+20,o.titre,11,INK,800,'end');
    return s;
  };
  /* pavé en perspective (L × ℓ × h, en cm) ; px par cm */
  D.pave=function(x,y,L,l,h,px,o){
    o=o||{};var m=o.mode,a=L*px,b=h*px,k=l*px*0.5,col=o.col||'#9AA2AD';
    return '<path d="M'+x+' '+y+' h'+a+' v-'+b+' h-'+a+' Z" fill="'+fill(m,col)+'" stroke="'+INK+'" stroke-width="2"/><path d="M'+x+' '+(y-b)+' l'+n(k)+' -'+n(k)+' h'+a+' l-'+n(k)+' '+n(k)+' Z" fill="'+fill(m,shade(col,.25))+'" stroke="'+INK+'" stroke-width="2"/><path d="M'+(x+a)+' '+y+' l'+n(k)+' -'+n(k)+' v-'+b+' l-'+n(k)+' '+n(k)+' Z" fill="'+fill(m,shade(col,-.2))+'" stroke="'+INK+'" stroke-width="2"/>';
  };
  D.cylindre=function(x,y,dcm,hcm,px,o){
    o=o||{};var m=o.mode,r=dcm*px/2,b=hcm*px,e=r*0.32,col=o.col||'#9AA2AD';
    return '<path d="M'+(x-r)+' '+(y-b)+' V'+y+' A'+r+' '+n(e)+' 0 0 0 '+(x+r)+' '+y+' V'+(y-b)+'" fill="'+fill(m,col)+'" stroke="'+INK+'" stroke-width="2"/><ellipse cx="'+x+'" cy="'+(y-b)+'" rx="'+r+'" ry="'+n(e)+'" fill="'+fill(m,shade(col,.25))+'" stroke="'+INK+'" stroke-width="2"/>'+(o.conserve&&real(m)?'<rect x="'+(x-r)+'" y="'+n(y-b*0.7)+'" width="'+(2*r)+'" height="'+n(b*0.45)+'" fill="#D6542C" opacity=".85"/>':'');
  };
  /* cubes unités posés dans un pavé 4 × 3 × 2, couche par couche */
  D.cubesUnites=function(x,y,couches,px,o){
    o=o||{};var m=o.mode,s='',c,i,j,k=px*0.5;
    /* fond et parois du fond, puis les cubes de l'arrière vers l'avant, puis les arêtes avant (transparentes) */
    s+='<path d="M'+(x+3*k)+' '+(y-3*k)+' h'+(4*px)+' v-'+(2*px)+' h-'+(4*px)+' Z M'+x+' '+y+' l'+(3*k)+' -'+(3*k)+' M'+x+' '+(y-2*px)+' l'+(3*k)+' -'+(3*k)+'" fill="none" stroke="'+INK+'" stroke-width="1.4" stroke-dasharray="5 4"/>';
    for(c=0;c<couches;c++)for(j=2;j>=0;j--)for(i=0;i<4;i++)s+=D.pave(n(x+i*px+j*k),n(y-c*px-j*k),1,1,1,px,{mode:m,col:'#F0A23B'});
    s+=D.pave(x,y,4,3,2,px,{mode:m,col:'none'});
    return s;
  };

  /* ---------- masses marquées, boîte, pince ---------- */
  var DIM={200:[26,30],100:[22,26],50:[18,22],20:[15,18],10:[13,15],5:[11,12],2:[9,10],1:[8,9]};
  D.masse=function(x,yb,v,o){
    o=o||{};var m=o.mode,dd=DIM[v]||[10,10],w=dd[0],h=dd[1],s='<rect x="'+n(x-w/2)+'" y="'+n(yb-h)+'" width="'+w+'" height="'+h+'" rx="2.5" fill="'+fill(m,LAITON)+'" stroke="'+INK+'" stroke-width="1.5"/><rect x="'+n(x-w/5)+'" y="'+n(yb-h-5)+'" width="'+n(2*w/5)+'" height="5" rx="2" fill="'+fill(m,LAITON)+'" stroke="'+INK+'" stroke-width="1.2"/><circle cx="'+x+'" cy="'+n(yb-h-7)+'" r="'+n(Math.max(2,w/6))+'" fill="'+fill(m,LAITON)+'" stroke="'+INK+'" stroke-width="1.2"/>';
    if(v>=10)s+=T(x,yb-h/2+3.5,String(v),w>18?9:7.5,real(m)?'#4A3A06':INK,800);
    return s;
  };
  D.largeurMasse=function(v){return (DIM[v]||[10])[0];};
  D.boite=function(x,y,posees,o){
    o=o||{};var m=o.mode,s='<rect x="'+x+'" y="'+y+'" width="190" height="64" rx="6" fill="'+fill(m,'#7A4A22')+'" stroke="'+INK+'" stroke-width="2"/>',cx=x+12;
    Q.BOITE.forEach(function(v,i){var w=D.largeurMasse(v);if((posees||[]).indexOf(i)<0)s+=D.masse(cx+w/2,y+56,v,{mode:m});else s+='<rect x="'+(cx)+'" y="'+(y+40)+'" width="'+w+'" height="16" rx="3" fill="'+fill(m,'#4A2C12')+'"/>';cx+=w+3;});
    return s+'<path d="M'+(x+150)+' '+(y-6)+' l30 -22" stroke="'+INK+'" stroke-width="3"/>'+T(x+95,y+78,'boîte de masses marquées',10,INK,700);
  };

  /* ---------- objets posés sur un plateau (base en (x,y)) ---------- */
  var OBJ={
    mangue:function(x,y,m){return '<ellipse cx="'+x+'" cy="'+(y-16)+'" rx="26" ry="16" fill="'+fill(m,'#E9A23B')+'" stroke="'+INK+'" stroke-width="2"/>'+(real(m)?'<ellipse cx="'+(x-8)+'" cy="'+(y-22)+'" rx="12" ry="6" fill="#9CC35A" opacity=".8"/>':'')+'<path d="M'+(x+22)+' '+(y-26)+' q6 -6 10 -4" fill="none" stroke="'+INK+'" stroke-width="2"/>';},
    bois:function(x,y,m){return '<rect x="'+(x-24)+'" y="'+(y-22)+'" width="48" height="22" rx="2" fill="'+fill(m,'#B77A3E')+'" stroke="'+INK+'" stroke-width="2"/>'+(real(m)?'<path d="M'+(x-18)+' '+(y-14)+' q18 -6 36 0" fill="none" stroke="#8A5524"/>':'');},
    savon:function(x,y,m){return '<rect x="'+(x-22)+'" y="'+(y-16)+'" width="44" height="16" rx="6" fill="'+fill(m,'#E9E3C8')+'" stroke="'+INK+'" stroke-width="2"/>';},
    pile:function(x,y,m){return '<rect x="'+(x-7)+'" y="'+(y-30)+'" width="14" height="30" rx="3" fill="'+fill(m,'#3B4A7A')+'" stroke="'+INK+'" stroke-width="1.6"/><rect x="'+(x-3)+'" y="'+(y-34)+'" width="6" height="4" fill="'+fill(m,'#B9C2D6')+'" stroke="'+INK+'" stroke-width="1"/>';},
    caillou:function(x,y,m){return MD.solide('caillou',x,y,{mode:m,sc:.8});},
    beurre:function(x,y,m){return '<rect x="'+(x-18)+'" y="'+(y-14)+'" width="36" height="14" rx="2" fill="'+fill(m,'#F4D46B')+'" stroke="'+INK+'" stroke-width="2"/>'+(real(m)?'<path d="M'+(x-18)+' '+(y-14)+' l10 14 M'+(x+4)+' '+(y-14)+' l10 14" stroke="#E2C150"/>':'');},
    allumettes:function(x,y,m){return '<rect x="'+(x-20)+'" y="'+(y-14)+'" width="40" height="14" rx="1" fill="'+fill(m,'#E7D7B0')+'" stroke="'+INK+'" stroke-width="2"/><rect x="'+(x-20)+'" y="'+(y-14)+'" width="7" height="14" fill="'+fill(m,'#8E5A3A')+'"/>';},
    objet100:function(x,y,m){return '<rect x="'+(x-18)+'" y="'+(y-22)+'" width="36" height="22" rx="3" fill="'+fill(m,'#8FB8DE')+'" stroke="'+INK+'" stroke-width="2"/>'+T(x,y-7,'100 g',9,INK,800);},
    riz25:function(x,y,m){return '<path d="M'+(x-26)+' '+y+' V'+(y-44)+' q26 -10 52 0 V'+y+' Z" fill="'+fill(m,'#EFE7D2')+'" stroke="'+INK+'" stroke-width="2"/>'+T(x,y-18,'25 kg',10,INK,800);},
    tare:function(x,y,m){return '<path d="M'+(x-22)+' '+y+' q-4 -26 6 -34 h32 q10 8 6 34 Z" fill="'+fill(m,'#D9C08A')+'" stroke="'+INK+'" stroke-width="2"/><path d="M'+(x-10)+' '+(y-34)+' q10 -8 20 0" fill="none" stroke="'+INK+'" stroke-width="2"/>'+T(x,y-12,'tare',9,INK,800);},
    pate_boule:function(x,y,m){return '<circle cx="'+x+'" cy="'+(y-15)+'" r="15" fill="'+fill(m,'#4FA37A')+'" stroke="'+INK+'" stroke-width="2"/>';},
    pate_galette:function(x,y,m){return '<ellipse cx="'+x+'" cy="'+(y-5)+'" rx="30" ry="5" fill="'+fill(m,'#4FA37A')+'" stroke="'+INK+'" stroke-width="2"/>';},
    pate_morceaux:function(x,y,m){var s='';[-21,-7,7,21].forEach(function(dx){s+='<circle cx="'+(x+dx)+'" cy="'+(y-7)+'" r="7" fill="'+fill(m,'#4FA37A')+'" stroke="'+INK+'" stroke-width="1.6"/>';});return s;},
    coton:function(x,y,m){return '<path d="M'+(x-40)+' '+y+' q-8 -40 10 -58 q30 -14 60 0 q18 18 10 58 Z" fill="'+fill(m,'#FFFFFF')+'" stroke="'+INK+'" stroke-width="2"/><path d="M'+(x-24)+' '+(y-30)+' q8 -8 16 0 q8 -8 16 0 q8 -8 16 0" fill="none" stroke="'+(real(m)?'#C9CFDA':INK)+'" stroke-width="2"/>';},
    fer:function(x,y,m){return '<rect x="'+(x-9)+'" y="'+(y-14)+'" width="18" height="14" rx="1" fill="'+fill(m,'#7D8794')+'" stroke="'+INK+'" stroke-width="2"/>';},
    ecrous:function(x,y,m){var s='';[[-10,0],[0,0],[10,0],[-5,-8],[5,-8]].forEach(function(p){s+='<polygon points="'+hexa(x+p[0],y-5+p[1],5)+'" fill="'+fill(m,'#9AA2AD')+'" stroke="'+INK+'" stroke-width="1.2"/><circle cx="'+(x+p[0])+'" cy="'+(y-5+p[1])+'" r="1.8" fill="'+(real(m)?'#5D6673':'none')+'" stroke="'+INK+'" stroke-width=".8"/>';});return s;},
    sac_coton100:function(x,y,m){return '<path d="M'+(x-22)+' '+y+' q-6 -30 8 -42 q14 -8 28 0 q14 12 8 42 Z" fill="'+fill(m,'#FFFFFF')+'" stroke="'+INK+'" stroke-width="2"/>'+T(x,y-14,'100 g',8.5,INK,800);},
    jeton:function(x,y,m){return '<ellipse cx="'+x+'" cy="'+(y-4)+'" rx="12" ry="4" fill="'+fill(m,LAITON)+'" stroke="'+INK+'" stroke-width="1.5"/><path d="M'+(x-12)+' '+(y-4)+' v-3 a12 4 0 0 1 24 0 v3" fill="'+fill(m,LAITON)+'" stroke="'+INK+'" stroke-width="1.5"/>';}
  };
  function hexa(x,y,r){var p=[],i;for(i=0;i<6;i++)p.push(n(x+r*Math.cos(i*Math.PI/3))+','+n(y+r*Math.sin(i*Math.PI/3)));return p.join(' ');}
  D.objet=function(id,x,y,m){
    if(OBJ[id])return OBJ[id](x,y,m);
    if(id==='becher_vide'||id==='becher_eau'||id==='becher_huile')return MD.recipient('becher',x,y,{mode:m,sc:.5,niveau:id==='becher_vide'?0:.55,liq:id==='becher_huile'?'#E6B93C':EAU});
    if(id==='bocal_plein'||id==='bocal_vide')return MD.recipient('bocal',x,y,{mode:m,sc:.5,niveau:id==='bocal_plein'?.85:0,liq:EAU});
    if(id==='vide')return '';
    throw new Error('objet à dessiner inconnu : '+id);
  };
  D.OBJETS=Object.keys(OBJ);
  D.objetSvg=function(id,label,m){return D.vue(D.sol(m,100,8,112)+D.objet(id,60,98,m),label,'0 0 120 112');};

  /* ---------- balance de Roberval ----------
     (x,y) = milieu du socle (au sol). o : {penche:'gauche'|'droite'|'aucun', gauche:[ids], droite:[ids], masses:[valeurs], cote:'gauche'|'droite',
     bras:[g,d] (dixièmes), mode, legende} */
  D.roberval=function(x,y,o){
    o=o||{};var m=o.mode,b=o.bras||[10,10],R=110,Rg=R*b[0]/10,Rd=R*b[1]/10,tilt=o.penche==='gauche'?7:o.penche==='droite'?-7:0,t=tilt*Math.PI/180,yp=y-112,s='';
    s+='<rect x="'+(x-120)+'" y="'+(y-20)+'" width="240" height="20" rx="6" fill="'+fill(m,'#3D4B6B')+'" stroke="'+INK+'" stroke-width="2"/>';
    s+='<path d="M'+(x-12)+' '+(y-20)+' L'+(x-6)+' '+yp+' H'+(x+6)+' L'+(x+12)+' '+(y-20)+' Z" fill="'+fill(m,'#5A6B8C')+'" stroke="'+INK+'" stroke-width="2"/>';
    /* cadran et repère */
    s+='<path d="M'+(x-30)+' '+(yp-62)+' A70 70 0 0 1 '+(x+30)+' '+(yp-62)+'" fill="none" stroke="'+INK+'" stroke-width="2"/>';
    for(var k=-3;k<=3;k++){var a=k*6*Math.PI/180;s+='<line x1="'+n(x+68*Math.sin(a))+'" y1="'+n(yp-68*Math.cos(a))+'" x2="'+n(x+(k?60:56)*Math.sin(a))+'" y2="'+n(yp-(k?60:56)*Math.cos(a))+'" stroke="'+(k?INK:'#1B7F3B')+'" stroke-width="'+(k?1.2:3)+'"/>';}
    /* fléau */
    var Lx=x-Rg*Math.cos(t),Ly=yp+Rg*Math.sin(t),Rx=x+Rd*Math.cos(t),Ry=yp-Rd*Math.sin(t);
    s+='<line x1="'+n(Lx)+'" y1="'+n(Ly)+'" x2="'+n(Rx)+'" y2="'+n(Ry)+'" stroke="'+(real(m)?'#5A6B8C':INK)+'" stroke-width="8" stroke-linecap="round"/>';
    /* aiguille solidaire du fléau, vers le haut */
    s+='<line x1="'+x+'" y1="'+yp+'" x2="'+n(x-66*Math.sin(t))+'" y2="'+n(yp-66*Math.cos(t))+'" stroke="'+(real(m)?'#D6221C':INK)+'" stroke-width="3" stroke-linecap="round"/><circle cx="'+x+'" cy="'+yp+'" r="7" fill="'+fill(m,'#E7B93C')+'" stroke="'+INK+'" stroke-width="2"/>';
    /* plateaux, toujours horizontaux */
    function plateau(px,py){return '<line x1="'+n(px)+'" y1="'+n(py)+'" x2="'+n(px)+'" y2="'+n(py-26)+'" stroke="'+INK+'" stroke-width="4"/><path d="M'+n(px-50)+' '+n(py-26)+' Q'+n(px)+' '+n(py-16)+' '+n(px+50)+' '+n(py-26)+' Z" fill="'+fill(m,'#B9C2D0')+'" stroke="'+INK+'" stroke-width="2"/>';}
    s+=plateau(Lx,Ly)+plateau(Rx,Ry);
    /* charges et masses */
    function charger(px,py,ids,masses){var out='',items=[];(ids||[]).forEach(function(id){items.push({obj:id,w:id==='coton'?96:id==='riz25'||id==='mangue'?54:id==='pate_galette'?62:id==='pate_morceaux'?52:48});});
      (masses||[]).slice().sort(function(a,c){return c-a;}).forEach(function(v){items.push({masse:v,w:D.largeurMasse(v)+2});});
      var rows=[[]],wr=0;items.forEach(function(it){if(wr+it.w>100&&rows[rows.length-1].length){rows.push([]);wr=0;}rows[rows.length-1].push(it);wr+=it.w;});
      var base=py-26;rows.forEach(function(row,ri){var tot=row.reduce(function(a2,it){return a2+it.w;},0),cx=px-tot/2;row.forEach(function(it){var c=cx+it.w/2;out+=it.obj?D.objet(it.obj,n(c),n(base-ri*0),m):D.masse(n(c),n(base),it.masse,{mode:m});cx+=it.w;});base-=ri===0?Math.max.apply(null,row.map(function(it){return it.obj?(it.obj==='coton'?58:it.obj==='riz25'?44:30):(DIM[it.masse]||[0,10])[1]+8;})):32;});
      return out;}
    var mg=o.cote==='gauche'?o.masses:[],md=o.cote==='gauche'?[]:o.masses;
    s+=charger(Lx,Ly,o.gauche,mg)+charger(Rx,Ry,o.droite,md);
    if(m==='schema'&&!o.sansLegende){s+=T(x+70,yp-70,'aiguille',11,INK,700,'start')+T(x,y+16,'socle',11,INK,700)+T(n(Lx),n(Ly+22),'plateau',11,INK,700)+T(x+44,n(yp+20),'fléau',11,INK,700,'start')+T(x,yp-76,'repère',11,'#1B7F3B',800);}
    if(b[0]!==b[1])s+=T(n((Lx+x)/2),n((Ly+yp)/2+22),'bras plus long',10,'#D6221C',800);
    return s;
  };
  D.PARTIES_ROBERVAL=[['socle','Le socle'],['fleau','Le fléau'],['plateau','Un plateau'],['aiguille','L’aiguille'],['repere','Le repère (zéro du cadran)']];

  /* ---------- six types de balances (dessins génériques, sans marque) ---------- */
  var BAL={
    pese_lettre:'<rect x="-34" y="10" width="68" height="16" rx="4" fill="#DDE3EC"/><rect x="-22" y="-8" width="44" height="18" rx="3" fill="#E8ECF2"/><path d="M-30,-14 h60 l-6,6 h-48 Z" fill="#B9C2D0"/><rect x="-16" y="-36" width="32" height="20" fill="#fff"/><path d="M-16,-36 l16,10 l16,-10" fill="none"/><rect x="-10" y="14" width="20" height="8" rx="2" fill="#10212E"/>',
    monoplateau:'<rect x="-36" y="6" width="72" height="22" rx="5" fill="#E8ECF2"/><rect x="-14" y="12" width="28" height="10" rx="2" fill="#10212E"/><path d="M-30,-2 h60 l-4,8 h-52 Z" fill="#B9C2D0"/><path d="M-26,-2 q26,-26 52,0" fill="#C55A5A"/><rect x="18" y="-36" width="18" height="26" rx="3" fill="#E8ECF2"/><rect x="21" y="-32" width="12" height="8" fill="#10212E"/>',
    pese_personne:'<rect x="-34" y="-26" width="68" height="52" rx="10" fill="#E8ECF2"/><rect x="-14" y="-20" width="28" height="12" rx="2" fill="#10212E"/><path d="M-22,2 q-6,10 0,18 h8 q4,-10 0,-18 Z M22,2 q6,10 0,18 h-8 q-4,-10 0,-18 Z" fill="#9AA7BA"/>',
    romaine:'<path d="M-4,-40 v10" stroke-width="3"/><circle cx="-4" cy="-42" r="4" fill="none"/><line x1="-40" y1="-26" x2="40" y2="-26" stroke-width="4"/><path d="M-34,-26 v10 M-30,-26 v10" stroke-width="1.5"/><path d="M-36,-16 v28 q14,10 28,0 v-28" fill="#E9D27A"/><rect x="22" y="-24" width="10" height="16" rx="2" fill="#5A6B8C"/><path d="M27,-26 v2" />',
    electronique:'<rect x="-36" y="0" width="72" height="22" rx="6" fill="#DDE3EC"/><rect x="-26" y="-8" width="52" height="8" rx="3" fill="#9AA7BA"/><rect x="-18" y="5" width="36" height="12" rx="2" fill="#10212E"/><text x="0" y="14.5" font-size="8" font-weight="800" fill="#8DF7B1" text-anchor="middle" stroke="none">0,0 g</text>',
    pont_bascule:'<rect x="-46" y="14" width="92" height="10" fill="#8F99A8"/><rect x="-40" y="-8" width="56" height="22" rx="2" fill="#B7743A"/><path d="M16,-8 h14 l8,10 v12 h-22 Z" fill="#E24B2B"/><circle cx="-30" cy="16" r="6" fill="#2B2F36"/><circle cx="-6" cy="16" r="6" fill="#2B2F36"/><circle cx="26" cy="16" r="6" fill="#2B2F36"/><path d="M-40,-14 h56 M-40,-20 h56" stroke-width="3" stroke="#8A5524"/>'
  };
  D.balanceType=function(id,label){var ic=BAL[id];if(!ic)throw new Error('balance inconnue : '+id);return D.vue('<g transform="translate(60 64)" stroke="'+INK+'" stroke-width="2" stroke-linejoin="round">'+ic+'</g>',label,'0 0 120 124');};
  D.BALANCES=Object.keys(BAL);
  /* balance électronique du lot Matière avec un affichage donné et des objets sur le plateau (plateau à y-52) */
  D.electronique=function(x,y,texte,ids,m){var s=MD.balance(x,y,{mode:m,texte:texte}),c=(ids||[]).length,i;for(i=0;i<c;i++)s+=D.objet(ids[i],x+(i-(c-1)/2)*56,y-52,m);return s;};

  /* ---------- vase à trop-plein, lest, éprouvette retournée ---------- */
  D.tropPlein=function(x,y,o){
    o=o||{};var m=o.mode,s='<path d="M'+(x-40)+' '+(y-130)+' V'+y+' H'+(x+40)+' V'+(y-130)+'" fill="'+verre(m)+'" stroke="'+bord(m)+'" stroke-width="2.5"/><path d="M'+(x+40)+' '+(y-104)+' l34 18 l-4 6 l-30 -14" fill="'+verre(m)+'" stroke="'+bord(m)+'" stroke-width="2"/>';
    s+='<rect x="'+(x-38)+'" y="'+(y-104)+'" width="76" height="'+(104)+'" fill="'+liq(m)+'"'+(real(m)?' opacity=".7"':'')+'/>';
    if(o.objet)s+='<path d="M'+(x-28)+' '+(y-4)+' L'+(x-32)+' '+(y-30)+' L'+(x-14)+' '+(y-52)+' L'+(x+14)+' '+(y-56)+' L'+(x+30)+' '+(y-36)+' L'+(x+28)+' '+(y-4)+' Z" fill="'+fill(m,'#8E949D')+'" stroke="'+INK+'" stroke-width="2"/>';
    if(o.deborde)s+='<path d="M'+(x+74)+' '+(y-84)+' q6 20 4 40" fill="none" stroke="'+(real(m)?'#2D7CB8':INK)+'" stroke-width="3" stroke-dasharray="3 4"/>';
    return s;
  };
  D.ecrou=function(x,y,m){return '<polygon points="'+hexa(x,y,9)+'" fill="'+fill(m,'#7D8794')+'" stroke="'+INK+'" stroke-width="1.6"/><circle cx="'+x+'" cy="'+y+'" r="3.5" fill="'+(real(m)?'#4A525E':'none')+'" stroke="'+INK+'" stroke-width="1"/>';};
  D.bouchon=function(x,y,m){return '<path d="M'+(x-9)+' '+(y-8)+' h18 l-2 16 h-14 Z" fill="'+fill(m,'#C8935A')+'" stroke="'+INK+'" stroke-width="1.6"/>';};
  D.sucre=function(x,y,m,fondu){return '<rect x="'+(x-7)+'" y="'+(y-7)+'" width="14" height="14" rx="1.5" fill="'+fill(m,'#FFFFFF')+'" stroke="'+INK+'" stroke-width="1.5"'+(fondu?' opacity=".35" stroke-dasharray="2 2"':'')+'/>';};
  D.cle=function(x,y,m){return '<circle cx="'+x+'" cy="'+(y-16)+'" r="6" fill="none" stroke="'+(real(m)?'#B08A2E':INK)+'" stroke-width="3"/><path d="M'+x+' '+(y-10)+' V'+(y+8)+' M'+x+' '+(y+2)+' h5 M'+x+' '+(y+7)+' h4" stroke="'+(real(m)?'#B08A2E':INK)+'" stroke-width="3"/>';};

  window.NohobaMesures.dessin=D;
})();
