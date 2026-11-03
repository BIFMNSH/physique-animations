/* NohobaLab · atelier d'électricité (6e Côte d'Ivoire) : dessins originaux partagés par les activités du circuit électrique.
   Montage réaliste (pile 4,5 V, pile cylindrique, lampe, interrupteur, moteur) et schéma normalisé (symboles du document de classe).
   Conventions : plot et culot de la lampe sont les deux contacts ; le verre est isolant ; dans un circuit, la lampe est montée sur un support à deux bornes (dipôle) ; pile plate : deux lames de même taille, + et − imprimés. */
(function(){
'use strict';
var INK='#243049',OR='#F97316',FONT='Atkinson Hyperlegible,system-ui,sans-serif';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function T(x,y,t,size,col,w,anchor){return '<text x="'+x+'" y="'+y+'" fill="'+(col||INK)+'" font-size="'+(size||13)+'" font-weight="'+(w||700)+'" text-anchor="'+(anchor||'middle')+'" font-family="'+FONT+'">'+esc(t)+'</text>';}
function svg(inner,vb,label){return '<svg viewBox="'+vb+'" role="img" aria-label="'+esc(label)+'" style="display:block;width:100%;height:auto;border-radius:14px;background:#F7F8FB">'+inner+'</svg>';}
/* pile plate 4,5 V : deux lames de même taille (même largeur, même hauteur) ; les bornes se reconnaissent aux signes + et − imprimés sur le corps. Accroches : − à x+27*sc, + à x+53*sc, hauteur y-42*sc. */
function pile45(x,y,sc,fail){sc=sc||1;
  var g='<g transform="translate('+x+' '+y+') scale('+sc+')"><ellipse cx="40" cy="108" rx="52" ry="7" fill="#1B2540" opacity=".2"/><rect x="0" y="0" width="80" height="104" rx="9" fill="#34457A"/><rect x="0" y="0" width="80" height="26" rx="9" fill="#5A6FA8"/><rect x="12" y="40" width="56" height="32" rx="6" fill="#F97316"/>'+T(40,63,'4,5 V',19,'#fff',800)
  +'<rect x="21" y="-42" width="12" height="44" rx="2" fill="#E7B93C" stroke="#9A7A12"/><rect x="47" y="-42" width="12" height="44" rx="2" fill="#E7B93C" stroke="#9A7A12"/>'
  +'<circle cx="27" cy="13" r="10" fill="#fff"/>'+T(27,21,'−',20,'#2B5EA8',800)+'<circle cx="53" cy="13" r="10" fill="#fff"/>'+T(53,21,'+',20,'#C03A2E',800);
  if(fail)g+='<rect x="0" y="0" width="80" height="104" rx="9" fill="#fff" opacity=".6"/>';
  return g+'</g>';}
/* pile cylindrique 1,5 V : borne + = capuchon en haut (y-10), borne − = fond (y+114) */
function pileCyl(x,y,sc){sc=sc||1;
  return '<g transform="translate('+x+' '+y+') scale('+sc+')"><ellipse cx="0" cy="118" rx="40" ry="6" fill="#1B2540" opacity=".2"/><rect x="-30" y="0" width="60" height="112" rx="10" fill="#34457A"/><rect x="-30" y="0" width="60" height="18" rx="9" fill="#5A6FA8"/><rect x="-22" y="34" width="44" height="40" rx="6" fill="#F97316"/>'+T(0,61,'1,5 V',15,'#fff',800)
  +'<rect x="-9" y="-10" width="18" height="12" rx="3" fill="#C9CED8" stroke="#6b7480"/><rect x="-26" y="108" width="52" height="6" rx="3" fill="#C9CED8" stroke="#6b7480"/>'
  +'</g>';}
/* lampe : verre (isolant) au-dessus ; culot (côté, filetage) ; plot (pointe en bas). Culot : (x-16,y+39) ; plot : (x,y+58) */
/* lampe ; support=true : lampe montée sur un support (douille) à deux bornes sur le socle, côte à côte.
   Accroches des fils (repère de la lampe) : borne gauche = culot en (x-24*sc, y+67*sc), borne droite = plot en (x+24*sc, y+67*sc). */
function lampe(x,y,on,sc,support){sc=sc||1;var g='<g transform="translate('+x+' '+y+') scale('+sc+')">',i,a;
  if(on){g+='<circle cx="0" cy="0" r="52" fill="#FFE27A" opacity=".45"/>';for(i=0;i<8;i++){a=i*Math.PI/4+0.39;g+='<line x1="'+(36*Math.cos(a)).toFixed(1)+'" y1="'+(36*Math.sin(a)).toFixed(1)+'" x2="'+(50*Math.cos(a)).toFixed(1)+'" y2="'+(50*Math.sin(a)).toFixed(1)+'" stroke="#F0B400" stroke-width="3" stroke-linecap="round"/>';}}
  g+='<circle cx="0" cy="0" r="26" fill="'+(on?'#FFE27A':'#EEF3F8')+'" stroke="#9FB0C4" stroke-width="2.5"/><path d="M-8 18 V8 M8 18 V8" stroke="#6b7480" stroke-width="2"/><path d="M-8 8 Q-4 -10 0 4 Q4 -10 8 8" fill="none" stroke="'+(on?'#FF8A00':'#8A94A4')+'" stroke-width="2.4"/>'
  +'<rect x="-16" y="26" width="32" height="26" rx="4" fill="#B7BDC7" stroke="#6b7480"/><path d="M-16 34 h32 M-16 42 h32" stroke="#6b7480"/><rect x="-6" y="52" width="12" height="6" rx="2" fill="#8A94A4"/>'
  +(support?'<rect x="-21" y="44" width="42" height="14" rx="4" fill="#D6DCE6" stroke="#9FB0C4" stroke-width="2"/><rect x="-38" y="56" width="76" height="22" rx="7" fill="#EEF2FA" stroke="#9FB0C4" stroke-width="2"/><path d="M-16 58 L-24 67 M0 58 L24 67" stroke="#6b7480" stroke-width="2" fill="none"/><circle cx="-24" cy="67" r="6" fill="#B7BDC7" stroke="#6b7480" stroke-width="2"/><circle cx="24" cy="67" r="6" fill="#B7BDC7" stroke="#6b7480" stroke-width="2"/>':'')+'</g>';return g;}
/* interrupteur sur socle : contacts en (x-24,y) et (x+24,y) */
function interrupteur(x,y,closed){return '<g transform="translate('+x+' '+y+')"><rect x="-34" y="-10" width="68" height="20" rx="8" fill="#EEF2FA" stroke="#9FB0C4"/><circle cx="-24" cy="0" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="24" cy="0" r="6" fill="#B7BDC7" stroke="#6b7480"/>'
  +(closed?'<path d="M-24 0 H24" stroke="#C99A1E" stroke-width="5" stroke-linecap="round"/>':'<path d="M-24 0 L18 -24" stroke="#C99A1E" stroke-width="5" stroke-linecap="round"/>')+'</g>';}
/* moteur sur socle : bornes en (x-30,y+6) et (x+30,y+6) */
function moteur(x,y,on){var b='',i;if(on){for(i=0;i<4;i++)b+='<path d="M0 0 L'+(20*Math.cos(i*Math.PI/2+.5)).toFixed(1)+' '+(20*Math.sin(i*Math.PI/2+.5)).toFixed(1)+'" stroke="#2E7BD6" stroke-width="7" stroke-linecap="round"/>';}else{for(i=0;i<4;i++)b+='<path d="M0 0 L'+(20*Math.cos(i*Math.PI/2)).toFixed(1)+' '+(20*Math.sin(i*Math.PI/2)).toFixed(1)+'" stroke="#2E7BD6" stroke-width="7" stroke-linecap="round"/>';}
  return '<g transform="translate('+x+' '+y+')"><rect x="-38" y="-28" width="76" height="46" rx="8" fill="#EEF2FA" stroke="#9FB0C4"/><circle cx="0" cy="-5" r="23" fill="#fff" stroke="#9FB0C4"/><g transform="translate(0 -5)">'+b+'</g><circle cx="0" cy="-5" r="4" fill="#243049"/><circle cx="-30" cy="6" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="30" cy="6" r="6" fill="#B7BDC7" stroke="#6b7480"/>'+(on?'<path d="M-30 -40 q30 -14 60 0" fill="none" stroke="#2E7BD6" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>':'')+'</g>';}
function fil(d,col){return '<path d="'+d+'" fill="none" stroke="#1B2540" stroke-opacity=".15" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 4)"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';}
function broches(pts){var s='';pts.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#fff" stroke="'+OR+'" stroke-width="2.5"/>';});return s;}
function pastille(x,y,t){var w=t.length*7.2+22;return '<rect x="'+(x-w/2)+'" y="'+(y-13)+'" width="'+w+'" height="26" rx="13" fill="#fff" stroke="'+OR+'" stroke-width="2"/>'+T(x,y+5,t,13,INK,800);}
function numero(x,y,n){return '<circle cx="'+x+'" cy="'+y+'" r="13" fill="'+OR+'"/>'+T(x,y+5,String(n),15,'#fff',800);}

/* ---- schéma normalisé ----
   Rectangle : pile en haut (− à gauche, + à droite), lampe à droite, moteur en bas, interrupteur à gauche.
   o.pile : 'normale' | 'inversee' | 'generateur' ; o.cotes : {droite,bas,gauche} ∈ 'lampe','moteur','generateur','interOuvert','interFerme','fil','vide'.
   Repères : − → interrupteur → moteur → lampe → +. */
var X0=100,X1=340,Y0=40,Y1=160,CX=220,DASH='';
function symbole(kind,x,y,vertical){
  var r=17,c;
  if(kind==='lampe')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+(x-12)+' '+(y-12)+' L'+(x+12)+' '+(y+12)+' M'+(x+12)+' '+(y-12)+' L'+(x-12)+' '+(y+12)+'" stroke="'+INK+'" stroke-width="2.5"/>';
  if(kind==='moteur')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'+T(x,y+6,'M',17,INK,800);
  if(kind==='generateur')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'+T(x,y+6,'G',17,INK,800);
  if(kind==='interFerme')return '<path d="M'+x+' '+(y-22)+' V'+(y+22)+'" stroke="'+INK+'" stroke-width="2.5"/><circle cx="'+x+'" cy="'+(y-22)+'" r="3.5" fill="'+INK+'"/><circle cx="'+x+'" cy="'+(y+22)+'" r="3.5" fill="'+INK+'"/>';
  if(kind==='interOuvert')return '<circle cx="'+x+'" cy="'+(y-22)+'" r="3.5" fill="'+INK+'"/><circle cx="'+x+'" cy="'+(y+22)+'" r="3.5" fill="'+INK+'"/><path d="M'+x+' '+(y+22)+' L'+(x+20)+' '+(y-14)+'" stroke="'+INK+'" stroke-width="2.5"/>';
  if(kind==='vide')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="#9FB0C4" stroke-width="2" stroke-dasharray="4 4"/>';
  return '';}
function cote(kind,side){ // fils d'un côté + symbole ; retourne le SVG
  var s='',st='fill="none" stroke="'+INK+'" stroke-width="2.5"'+DASH;
  if(side==='droite'){var half=kind==='interFerme'||kind==='interOuvert'?22:17;
    s+='<path d="M'+X1+' '+Y0+' V'+(100-half)+' M'+X1+' '+(100+half)+' V'+Y1+'" '+st+'/>'+(kind==='fil'?'<path d="M'+X1+' '+(100-half)+' V'+(100+half)+'" '+st+'/>':symbole(kind,X1,100));}
  if(side==='gauche'){var half2=kind==='interFerme'||kind==='interOuvert'?22:17;
    s+='<path d="M'+X0+' '+Y0+' V'+(100-half2)+' M'+X0+' '+(100+half2)+' V'+Y1+'" '+st+'/>'+(kind==='fil'?'<path d="M'+X0+' '+(100-half2)+' V'+(100+half2)+'" '+st+'/>':symbole(kind,X0,100));}
  if(side==='bas'){
    s+='<path d="M'+X0+' '+Y1+' H'+(CX-17)+' M'+(CX+17)+' '+Y1+' H'+X1+'" '+st+'/>'+(kind==='fil'?'<path d="M'+(CX-17)+' '+Y1+' H'+(CX+17)+'" '+st+'/>':symbole(kind,CX,Y1));}
  return s;}
function schema(o){o=o||{};DASH=o.pointille?' stroke-dasharray="6 5"':'';
  if(o.rect)return svg('<rect x="'+X0+'" y="'+Y0+'" width="'+(X1-X0)+'" height="'+(Y1-Y0)+'" fill="none" stroke="'+INK+'" stroke-width="2.5" stroke-dasharray="6 5"/>'+(o.legende?T(CX,193,o.legende,13,'#46536B',700):''),'0 0 440 200',o.label||'Rectangle');
  var c=o.cotes||{},st='fill="none" stroke="'+INK+'" stroke-width="2.5"'+DASH,s='',pk=o.pile||'normale';
  s+='<path d="M'+X0+' '+Y0+' H'+(CX-20)+' M'+(CX+20)+' '+Y0+' H'+X1+'" '+st+'/>';
  if(pk==='absente'){s+='<path d="M'+(CX-17)+' '+Y0+' H'+(CX-20)+' M'+(CX+17)+' '+Y0+' H'+(CX+20)+'" '+st+'/>'+symbole('vide',CX,Y0);}
  else if(pk==='generateur'){s+='<path d="M'+(CX-17)+' '+Y0+' H'+(CX-20)+' M'+(CX+17)+' '+Y0+' H'+(CX+20)+'" '+st+'/>'+symbole('generateur',CX,Y0)+T(CX-25,Y0-8,'−',16,'#2B5EA8',800)+T(CX+25,Y0-8,'+',16,'#C03A2E',800);}
  else{var gauche=pk==='inversee'?'+':'−';
    var longX=pk==='inversee'?CX-8:CX+8,courtX=pk==='inversee'?CX+8:CX-8;
    s+='<path d="M'+longX+' '+(Y0-16)+' V'+(Y0+16)+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+courtX+' '+(Y0-9)+' V'+(Y0+9)+'" stroke="'+INK+'" stroke-width="6"/>'
    +T(CX-22,Y0-12,gauche,16,gauche==='+'?'#C03A2E':'#2B5EA8',800)+T(CX+22,Y0-12,gauche==='+'?'−':'+',16,gauche==='+'?'#2B5EA8':'#C03A2E',800);}
  s+=cote(c.droite||'fil','droite')+cote(c.bas||'fil','bas')+cote(c.gauche||'fil','gauche');
  return svg(s+(o.legende?T(CX,193,o.legende,13,'#46536B',700):''),'0 0 440 200',o.label||'Schéma normalisé du montage');}
/* positions de grains le long du rectangle (phase 0..1), sens libre : c'est un modèle de circulation, pas un sens conventionnel */
function grains(n,phase,coupes){var L=2*(X1-X0)+2*(Y1-Y0),pts=[],i,d,x,y,per;
  for(i=0;i<n;i++){d=((i/n+phase)%1)*L;
    if(d<X1-X0){x=X0+d;y=Y0;}else if(d<X1-X0+Y1-Y0){x=X1;y=Y0+d-(X1-X0);}else if(d<2*(X1-X0)+Y1-Y0){x=X1-(d-(X1-X0)-(Y1-Y0));y=Y1;}else{x=X0;y=Y1-(d-2*(X1-X0)-(Y1-Y0));}
    pts.push([x,y]);}
  return pts;}
/* montage en série : pile 4,5 V, interrupteur, moteur, lampe, quatre fils (ordre : − → interrupteur → moteur → lampe → +).
   o : {inter:'ferme'|'ouvert'|'absent', moteur:bool, lampe:bool, pile:bool, filCoupe:bool} ; renvoie {svg, allume} */
/* ===== Banc d'essai : même style que les vidéos et les simulations (modules à deux douilles, câbles courbes à fiches) ===== */
var CR='#D9423B',CK='#2B2F38',FD='#0F1729',CLAIR='#3A4660';
function r1(v){return Math.round(v*10)/10;}
function svgBanc(inner,vb,label){return '<svg viewBox="'+vb+'" role="img" aria-label="'+esc(label)+'" style="display:block;width:100%;height:auto;border-radius:14px;background:#fff;border:1px solid #D5DCE8;box-sizing:border-box">'+inner+'</svg>';}
/* pince crocodile : gaine colorée puis mâchoires métalliques qui serrent la lame de la borne */
function pince(pt,from,col){var a=Math.atan2(pt[1]-from[1],pt[0]-from[0])*180/Math.PI;
  return '<g transform="translate('+r1(pt[0])+' '+r1(pt[1])+') rotate('+r1(a)+')"><rect x="-17" y="-5.5" width="12" height="11" rx="3" fill="'+col+'" stroke="#0A0F1A" stroke-opacity=".5"/><rect x="-12" y="-5.5" width="2" height="11" fill="#fff" opacity=".25"/><path d="M-5 -5 L12 -3 L12 -.6 L-5 -.6 Z M-5 5 L12 3 L12 .6 L-5 .6 Z" fill="#C9D2E3" stroke="#6B7480" stroke-width="1"/><path d="M5 -3 v2 M8 -3 v2 M11 -3 v2 M5 3 v-2 M8 3 v-2 M11 3 v-2" stroke="#6B7480" stroke-width=".9"/></g>';}
function fiche(pt,from,col){if(pt.croc)return pince(pt,from,col);var a=Math.atan2(pt[1]-from[1],pt[0]-from[0])*180/Math.PI;
  return '<g transform="translate('+r1(pt[0])+' '+r1(pt[1])+') rotate('+r1(a)+')"><rect x="-15" y="-5.5" width="14" height="11" rx="3" fill="'+col+'" stroke="#0A0F1A" stroke-opacity=".5"/><rect x="-9" y="-5.5" width="2.2" height="11" fill="#fff" opacity=".25"/><rect x="-2" y="-2.6" width="7" height="5.2" rx="1.5" fill="#D9B44A" stroke="#8A6D12" stroke-width=".8"/></g>';}
/* câble entre deux douilles : il part de chacune horizontalement (da, db = ±1 : vers la gauche ou la droite) puis se courbe. Renvoie {d, svg}. */
function ctrl(a,da,b,db,k){var d=Math.hypot(b[0]-a[0],b[1]-a[1]),h=0;k=k||Math.max(34,Math.min(80,d*.4));
  if(Math.abs(a[1]-b[1])<30&&((b[0]-a[0])*da<-4||(a[0]-b[0])*db<-4))h=64;
  return [[a[0]+da*k,a[1]+h],[b[0]+db*k,b[1]+h]];}
function cab(a,da,b,db,col,o){o=o||{};var cc=ctrl(a,da,b,db,o.k),c1=cc[0],c2=cc[1],
  dd='M'+r1(a[0])+' '+r1(a[1])+' C'+r1(c1[0])+' '+r1(c1[1])+' '+r1(c2[0])+' '+r1(c2[1])+' '+r1(b[0])+' '+r1(b[1]),
  s='<path d="'+dd+'" fill="none" stroke="#1F2B44" stroke-opacity=".16" stroke-width="6" stroke-linecap="round" transform="translate(1.5 3)"/>';
  if(col===CK)s+='<path d="'+dd+'" fill="none" stroke="#C9D2E3" stroke-opacity=".9" stroke-width="0" stroke-linecap="round"/>';
  s+='<path d="'+dd+'" fill="none" stroke="'+col+'" stroke-width="4.2" stroke-linecap="round"/><path d="'+dd+'" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.4" stroke-linecap="round" transform="translate(0 -1.2)"/>';
  if(!o.sansA)s+=fiche(a,[c1[0],a[1]],col);if(!o.sansB)s+=fiche(b,[c2[0],b[1]],col);
  return {d:dd,svg:s};}
function ring(m,cx,cy,rx,ry){var P=[],i,a;for(i=0;i<m;i++){a=(-90+i*360/m)*Math.PI/180;P.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}return P;}
/* boucle de modules à deux douilles : le premier (pile) sort par la droite (+) et revient par la gauche (−) ; mods[i]={L:[x,y],R:[x,y]} */
/* nombre de points du câble qui passent dans le verre ou le halo d'une lampe (avoid = [cx,cy,r]) */
function touche(a,da,b,db,mods){var cc=ctrl(a,da,b,db),c1=cc[0],c2=cc[1],n=0,i,j,u,x,y,q,v;
  for(i=1;i<16;i++){u=i/16;v=1-u;x=v*v*v*a[0]+3*v*v*u*c1[0]+3*v*u*u*c2[0]+u*u*u*b[0];y=v*v*v*a[1]+3*v*v*u*c1[1]+3*v*u*u*c2[1]+u*u*u*b[1];
    for(j=0;j<mods.length;j++){q=mods[j].av;if(q&&Math.hypot(x-q[0],y-q[1])<q[2])n++;}}
  return n;}
function chaine(mods){var m=mods.length,best=null,mask,i,inJ,cost,oj,a,b,da,db,out=[],j,ij;
  for(mask=0;mask<(1<<(m-1));mask++){inJ=['L'];cost=0;for(i=1;i<m;i++)inJ.push((mask>>(i-1))&1?'R':'L');
    for(i=0;i<m;i++){oj=i===0?'R':inJ[i]==='L'?'R':'L';a=mods[i][oj];b=mods[(i+1)%m][inJ[(i+1)%m]];da=oj==='L'?-1:1;db=inJ[(i+1)%m]==='L'?-1:1;
      cost+=touche(a,da,b,db,mods)*160+Math.hypot(a[0]-b[0],a[1]-b[1])+((b[0]-a[0])*da<-4?120:0)+((a[0]-b[0])*db<-4?120:0);}
    if(!best||cost<best.cost)best={cost:cost,inJ:inJ};}
  for(i=0;i<m;i++){oj=i===0?'R':best.inJ[i]==='L'?'R':'L';j=(i+1)%m;ij=best.inJ[j];out.push({a:mods[i][oj],da:oj==='L'?-1:1,b:mods[j][ij],db:ij==='L'?-1:1,i:i});}
  return {cables:out,inJ:best.inJ};}
function douille(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="6.5" fill="#C9CED8" stroke="#6B7480" stroke-width="1.6"/><circle cx="'+x+'" cy="'+y+'" r="2.6" fill="#2A2F38"/>';}
function socle(x,y){return '<ellipse cx="'+x+'" cy="'+(y+19)+'" rx="48" ry="6" fill="#1F2B44" opacity=".16"/><rect x="'+(x-35)+'" y="'+(y-3)+'" width="70" height="21" rx="5" fill="#2A3346"/><rect x="'+(x-35)+'" y="'+(y-13.2)+'" width="70" height="23" rx="5" fill="#E9EEF6" stroke="#9FB0C4" stroke-width="2"/>';}
/* pile plate : deux bornes de même taille aux extrémités, − à gauche et + à droite (inv : échangés) ; douilles (x∓53, y) */
/* borne de pile plate : lame de laiton arrondie avec plot central, identique des deux côtés (x0 = bord gauche de la lame) */
/* languette de laiton d'une pile plate 4,5 V : plaque droite posée sur le dessus, identique des deux côtés */
function languette(xt,y){return '<rect x="'+(xt-3.2)+'" y="'+(y-44)+'" width="6.4" height="19" rx="1.6" fill="#D9B44A" stroke="#8A6D12" stroke-width="1.2"/><rect x="'+(xt-1.9)+'" y="'+(y-42.5)+'" width="2" height="15" fill="#F6E49A" opacity=".8"/>';}
/* pile plate 4,5 V : bloc presque carré (face avant, dessus et côté), deux languettes de laiton identiques sur le dessus, − à gauche et + à droite (inv : échangés) ; pinces en (x-29, y-36) et (x+39, y-36) */
function pileM(x,y,o){o=o||{};var gs=o.inv?'+':'−',ds=o.inv?'−':'+',gc=o.inv?'#FF9A92':'#8FC0FF',dc=o.inv?'#8FC0FF':'#FF9A92',xl=x-17,xr=x+27;
  var g='<ellipse cx="'+(x+5)+'" cy="'+(y+39)+'" rx="50" ry="6" fill="#1F2B44" opacity=".16"/>'
   +'<path d="M'+(x+37)+' '+(y-24)+' L'+(x+47)+' '+(y-32)+' L'+(x+47)+' '+(y+28)+' L'+(x+37)+' '+(y+36)+' Z" fill="#141C30" stroke="#5B6680" stroke-width="1.6" stroke-linejoin="round"/>'
   +'<path d="M'+(x-37)+' '+(y-24)+' L'+(x-27)+' '+(y-32)+' L'+(x+47)+' '+(y-32)+' L'+(x+37)+' '+(y-24)+' Z" fill="#3A4660" stroke="#5B6680" stroke-width="1.6" stroke-linejoin="round"/>'
   +languette(xl,y-2)+languette(xr,y-2)
   +'<rect x="'+(x-37)+'" y="'+(y-24)+'" width="74" height="60" rx="4" fill="#1F2B44" stroke="#5B6680" stroke-width="2"/><rect x="'+(x-37)+'" y="'+(y-24)+'" width="74" height="13" rx="4" fill="#FFB547"/><rect x="'+(x-33)+'" y="'+(y+30)+'" width="66" height="2.4" rx="1.2" fill="#fff" opacity=".12"/>'
   +T(x,y+20,'4,5 V',15,'#EEF2F8',900)+T(x-26,y-1,gs,16,gc,900)+T(x+26,y-1,ds,15,dc,900);
  if(o.fail)g+='<rect x="'+(x-37)+'" y="'+(y-24)+'" width="74" height="60" rx="4" fill="#fff" opacity=".55"/>';
  var AL=[x-29,y-36],AR=[x+39,y-36];AL.croc=AR.croc=1;return {g:'<g data-pop="pile" style="cursor:pointer">'+g+'</g>',L:AL,R:AR};}
/* lampe sur son socle : le verre est isolant, les deux douilles du socle sont les bornes ; douilles (x∓22, y) ; verre en (x, y-33) */
function lampeM(x,y,on,o){o=o||{};var by=y-33,g='';
  if(on)g+='<circle cx="'+x+'" cy="'+by+'" r="46" fill="#FFD27A" opacity=".2"/><circle cx="'+x+'" cy="'+by+'" r="30" fill="#FFD27A" opacity=".3"/>';
  g+=socle(x,y)+'<path d="M'+(x-22)+' '+y+' H'+(x-9.2)+' M'+(x+9.2)+' '+y+' H'+(x+22)+'" stroke="#3A4660" stroke-width="1.6" fill="none"/><circle cx="'+x+'" cy="'+y+'" r="9.2" fill="#fff" stroke="#3A4660" stroke-width="1.8"/><path d="M'+(x-6.6)+' '+(y-6.6)+' L'+(x+6.6)+' '+(y+6.6)+' M'+(x+6.6)+' '+(y-6.6)+' L'+(x-6.6)+' '+(y+6.6)+'" stroke="#3A4660" stroke-width="1.8"/>'+douille(x-22,y)+douille(x+22,y);
  g+='<rect x="'+(x-8.8)+'" y="'+(y-24)+'" width="17.6" height="11" rx="3" fill="#8D96A8" stroke="#6B7480" stroke-width="1.2"/><circle cx="'+x+'" cy="'+by+'" r="19" fill="'+(on?'#FFE9A8':'#EEF2FA')+'" stroke="#9FB0C4" stroke-width="2.5"/>'
   +'<path d="M'+(x-9)+' '+(by+14)+' L'+(x-6)+' '+(by+2)+' l4 -6 l4 6 l4 -6 l4 6 L'+(x+9)+' '+(by+14)+'" fill="none" stroke="'+(on?'#FF8A00':'#8D96A8')+'" stroke-width="2.2" stroke-linejoin="round"/>';
  if(o.grille)g+='<path d="M'+(x-4)+' '+(by-6)+' l3 4 M'+(x+4)+' '+(by-6)+' l-3 4" stroke="#FF5A4E" stroke-width="2.5"/>'+T(x,by-27,'filament coupé',11,'#D9423B',800).replace('y="'+(by-27)+'"','y="'+(y+72)+'"');
  return {g:'<g data-pop="lampe" data-etat="'+(on?1:0)+'" style="cursor:pointer">'+g+'</g>',L:[x-22,y],R:[x+22,y],verre:[x,by],av:[x,by,50]};}
/* interrupteur sur socle : douilles (x∓30, y) ; la lame pivote autour de la douille de gauche */
function interM(x,y,closed,nom){var x1=x-30,x2=x+30,ex=closed?x2:x1+60*Math.cos(-32*Math.PI/180),ey=closed?y:y+60*Math.sin(-32*Math.PI/180);
  return {g:'<g data-pop="inter" data-etat="'+(closed?1:0)+'" style="cursor:pointer"><ellipse cx="'+x+'" cy="'+(y+18)+'" rx="76" ry="6" fill="#1F2B44" opacity=".14"/><rect x="'+(x1-20)+'" y="'+(y-15)+'" width="100" height="32" rx="6" fill="#C9D2E3"/><rect x="'+(x1-20)+'" y="'+(y-15)+'" width="100" height="28" rx="6" fill="#EEF2FA" stroke="#9FB0C4" stroke-width="1.5"/><rect x="'+(x1-15)+'" y="'+(y-11)+'" width="90" height="4" rx="2" fill="#fff" opacity=".8"/>'
   +douille(x1,y)+douille(x2,y)+'<line x1="'+x1+'" y1="'+y+'" x2="'+r1(ex)+'" y2="'+r1(ey)+'" stroke="#B98A16" stroke-width="5" stroke-linecap="round"/><circle cx="'+r1(ex)+'" cy="'+r1(ey)+'" r="6.5" fill="#2A2F38" stroke="#0A0F1A"/>'+T(x,y+33,nom||'K',12,CLAIR,800)+'</g>',L:[x1,y],R:[x2,y]};}
/* moteur sur socle : douilles (x∓22, y) ; hélice au-dessus */
function moteurM(x,y,on,sens){var cy=y-14,g=socle(x,y)+douille(x-22,y)+douille(x+22,y),i;
  g+=T(x-22,y-14,'A',10,'#3A4660',800)+T(x+22,y-14,'B',10,'#3A4660',800)+'<path d="M'+(x-22)+' '+y+' H'+(x-10.5)+' M'+(x+10.5)+' '+y+' H'+(x+22)+'" stroke="#3A4660" stroke-width="1.6" fill="none"/><circle cx="'+x+'" cy="'+y+'" r="10.5" fill="#fff" stroke="#3A4660" stroke-width="1.8"/>'+T(x,y+4.6,'M',13,'#1F2B44',900);
  g+='<line x1="'+x+'" y1="'+(y-13)+'" x2="'+x+'" y2="'+(y-38)+'" stroke="#7D89A3" stroke-width="3" stroke-linecap="round"/>';
  g+='<g transform="translate('+x+' '+(cy-26)+') rotate('+(on?25:0)+')">';for(i=0;i<3;i++)g+='<path d="M0 0 q5 -13 0 -22 q-5 8 0 22z" fill="#4FC3FF" transform="rotate('+(i*120)+')"/>';g+='<circle r="3" fill="#EEF2F8"/></g>';
  if(on&&sens)g+='<path d="'+(sens>0?'M'+(x-26)+' '+(cy-56)+' q26 -14 52 0':'M'+(x+26)+' '+(cy-56)+' q-26 -14 -52 0')+'" fill="none" stroke="#4FC3FF" stroke-width="3.5" stroke-linecap="round"/><path d="'+(sens>0?'M'+(x+22)+' '+(cy-64)+' l6 8 l-9 2':'M'+(x-22)+' '+(cy-64)+' l-6 8 l9 2')+'" fill="none" stroke="#4FC3FF" stroke-width="3.5" stroke-linecap="round"/>';
  else if(on)g+='<path d="M'+(x-26)+' '+(cy-56)+' q26 -14 52 0" fill="none" stroke="#4FC3FF" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>';
  return {g:'<g data-pop="moteur" data-etat="'+(on?1:0)+'" style="cursor:pointer">'+g+'</g>',L:[x-22,y],R:[x+22,y]};}
function absentM(x,y,w,h,t){return '<rect x="'+(x-w/2)+'" y="'+(y-h/2)+'" width="'+w+'" height="'+h+'" rx="10" fill="none" stroke="#5B6680" stroke-width="2" stroke-dasharray="6 5"/>'+T(x,y+5,t,13,'#8895A8',700);}
/* pile + lampe + deux fils : pile en haut, lampe en bas. r, n : où aboutissent le fil rouge (borne +) et le fil noir (borne −) : plot (douille de droite), culot (douille de gauche), verre ou libre */
function pileLampe(on,r,n){
  var P=pileM(250,52),Lp=lampeM(250,226,on),dest={plot:[Lp.R,1],culot:[Lp.L,-1]},vr={r:[[Lp.verre[0]+19,Lp.verre[1]],1],n:[[Lp.verre[0]-19,Lp.verre[1]],-1]},li={r:[[360,150],-1],n:[[140,150],1]};
  function cible(c,k){if(c==='verre')return vr[k];if(c==='libre')return li[k];return dest[c]||li[k];}
  var dr=cible(r,'r'),dn=cible(n,'n'),cR=cab(P.R,1,dr[0],dr[1],CR),cN=cab(P.L,-1,dn[0],dn[1],CK);
  return {inner:Lp.g+P.g+cN.svg+cR.svg,dR:cR.d,dN:cN.d,ends:[dr[0],dn[0]]};}
/* montage en série : pile, interrupteur, moteur, lampe en anneau */
function montageSerie(o){
  var piece=o.pile!==false,lamp=o.lampe!==false,mot=o.moteur!==false,ix=o.inter||'ferme',coupe=!!o.filCoupe,
      on=piece&&lamp&&mot&&ix==='ferme'&&!coupe,s='',P=pileM(270,64,{fail:false}),I=interM(450,170,ix==='ferme'),M=moteurM(270,262,on&&mot),Lp=lampeM(125,170,on,{});
  var mods=[P,I,M,Lp],c=chaine(mods).cables,cols=[CR,CK,CR,CK];
  if(!piece)s+=absentM(270,64,120,56,'pile absente');
  if(ix==='absent')s+=absentM(450,170,110,40,'');
  if(!mot)s+=absentM(270,248,96,60,'moteur absent');
  if(!lamp)s+=absentM(125,150,80,90,'lampe absente');
  if(piece)s+=P.g;if(ix!=='absent')s+=I.g;if(mot)s+=M.g;if(lamp)s+=Lp.g;
  c.forEach(function(k,i){var kk=cab(k.a,k.da,coupe&&i===2?[k.b[0]+(k.db>0?36:-36),k.b[1]-30]:k.b,k.db,cols[i],{sansB:coupe&&i===2});s+=kk.svg;});
  return {svg:svgBanc(s,'0 0 540 310','Montage en série : pile, interrupteur '+(ix==='ferme'?'fermé':ix==='ouvert'?'ouvert':'absent')+', moteur, lampe, reliés par des câbles'+(on?' ; la lampe brille et le moteur tourne':' ; le circuit est ouvert')),allume:on};}
window.NohobaAtelier={esc:esc,T:T,svg:svg,pile45:pile45,pileLampe:pileLampe,svgBanc:svgBanc,cab:cab,ring:ring,chaine:chaine,pileM:pileM,lampeM:lampeM,interM:interM,moteurM:moteurM,absentM:absentM,douille:douille,CR:CR,CK:CK,CLAIR:CLAIR,pileCyl:pileCyl,lampe:lampe,interrupteur:interrupteur,moteur:moteur,fil:fil,broches:broches,pastille:pastille,numero:numero,schema:schema,grains:grains,montageSerie:montageSerie,symbole:symbole,
  /* zone d'observation de l'élève + bouton d'enregistrement + messages */
  saisie:function(parent,h,id,placeholder){var out=h('p',{'aria-live':'polite'},parent),btn=h('button',{type:'button',class:'btn primary',text:'Enregistrer mon observation'},parent);
    h('label',{for:id,text:'Mon observation (j’écris ce que je vois, sans conclure) :'},parent);var ta=h('textarea',{id:id,rows:'2',placeholder:placeholder||'J’observe que…'},parent),msg=h('p',{class:'msg','aria-live':'polite'},parent);
    return {out:out,btn:btn,ta:ta,msg:msg,note:function(){return ta.value.trim();},ok:function(){return ta.value.trim().length>=10;},vide:function(){ta.value='';}};},
  /* deux colonnes : montage + schéma normalisé, mis à jour ensemble */
  paire:function(parent,h){var grid=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start'},parent);
    var a=h('figure',{style:'margin:0'},grid),b=h('figure',{style:'margin:0'},grid);
    var ma=h('div',{},a),mb=h('div',{},b);h('figcaption',{text:'Montage',style:'font-weight:700;margin-top:4px'},a);h('figcaption',{text:'Schéma normalisé',style:'font-weight:700;margin-top:4px'},b);
    return {montage:function(html){ma.innerHTML=html;},schema:function(html){mb.innerHTML=html;},hostM:ma,hostS:mb};}
};

/* ---- fenêtre 3D interactive : clic sur la pile, la lampe, le moteur ou l'interrupteur d'un montage ---- */
(function(){
  if(typeof document==='undefined'||window.NohobaPop3D)return;
  var PI=Math.PI;
  function hex(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
  function box(cx,cy,cz,w,h,d,col,rz){var s=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(function(p){var x=p[0]*w/2,y=p[1]*h/2,z=p[2]*d/2;if(rz){var c=Math.cos(rz),s2=Math.sin(rz);var nx=x*c-y*s2;y=x*s2+y*c;x=nx;}return [cx+x,cy+y,cz+z];});
    return [[0,1,2,3],[4,5,6,7],[0,1,5,4],[3,2,6,7],[0,3,7,4],[1,2,6,5]].map(function(f){return {p:f.map(function(i){return s[i];}),c:col};});}
  function cyl(cx,cy,cz,r,h,col,n){n=n||20;var out=[],i,a0,a1,top=[],bot=[];for(i=0;i<n;i++){a0=i/n*2*PI;a1=(i+1)/n*2*PI;
      out.push({p:[[cx+r*Math.cos(a0),cy,cz+r*Math.sin(a0)],[cx+r*Math.cos(a1),cy,cz+r*Math.sin(a1)],[cx+r*Math.cos(a1),cy+h,cz+r*Math.sin(a1)],[cx+r*Math.cos(a0),cy+h,cz+r*Math.sin(a0)]],c:col});
      top.push([cx+r*Math.cos(a0),cy+h,cz+r*Math.sin(a0)]);bot.push([cx+r*Math.cos(a0),cy,cz+r*Math.sin(a0)]);}
    out.push({p:top,c:col});out.push({p:bot,c:col});return out;}
  function sph(cx,cy,cz,r,col,n,emis){n=n||14;var out=[],i,j,P=function(a,b){return [cx+r*Math.sin(b)*Math.cos(a),cy+r*Math.cos(b),cz+r*Math.sin(b)*Math.sin(a)];};
    for(i=0;i<n;i++)for(j=0;j<n/2;j++)out.push({p:[P(i/n*2*PI,j/(n/2)*PI),P((i+1)/n*2*PI,j/(n/2)*PI),P((i+1)/n*2*PI,(j+1)/(n/2)*PI),P(i/n*2*PI,(j+1)/(n/2)*PI)],c:col,alpha:.55,emis:emis});return out;}
  function seg(a,b,col,w){return [{line:[a,b],c:col,w:w||3}];}
  function socle(w,d){return box(0,0,0,w,26,d,'#E9EEF6').map(function(f){f.base=1;return f;});}
  var DEF={
    pile:{titre:'Pile plate 4,5 V',sc:3.2,cy:330,vue:[.55,.5],build:function(){var q=function(F){return F.map(function(f){f.base=1;return f;});};
      return q(box(0,0,0,74,60,22,'#1F2B44')).concat(q(box(0,24,0,74.6,12,22.6,'#FFB547')),box(-20,35,0,6,15,10,'#D9B44A'),box(20,35,0,6,15,10,'#D9B44A'));},
      lab:[{p:[-20,42,0],t:'languette − (laiton)'},{p:[20,42,0],t:'languette + (même taille)'},{p:[0,6,11],t:'bande orange : pile plate 4,5 V'}],
      lg:['Pile plate : un bloc avec deux languettes de laiton identiques sur le dessus.','Le courant sort par la languette + et revient par la languette −.']},
    lampe:{titre:'Lampe sur son support (dipôle)',vue:[.5,.3],build:function(on,t,lift){lift=lift||0;var col=on?'#FF8A00':'#6B7480',dx=lift*105,dy=-lift*24;
      function mv(F){return F.map(function(q){if(q.line)q.line=q.line.map(function(p){return [p[0]+dx,p[1]+dy,p[2]+lift*18];});else q.p=q.p.map(function(p){return [p[0]+dx,p[1]+dy,p[2]+lift*18];});return q;});}
      var f=socle(70,40).concat(cyl(-22,13,0,6.5,3,'#C9CED8'),cyl(22,13,0,6.5,3,'#C9CED8'));
      if(lift>.05)f=f.concat(cyl(0,13,0,8.5,.6,'#0F1729'));
      var amp=cyl(0,13,0,8,12,'#8D96A8').concat(sph(0,45,0,19,on?'#FFE9A8':'#DCE4F2',14,on),seg([-9,34,0],[-6,44,0],col,3),seg([-6,44,0],[-2,50,0],col,3),seg([-2,50,0],[2,44,0],col,3),seg([2,44,0],[6,50,0],col,3),seg([6,50,0],[9,34,0],col,3));
      return f.concat(mv(amp));},
      lab:[{p:[-22,16,0],t:'borne (douille)'},{p:[22,16,0],t:'borne (douille)'},{p:[0,68,0],t:'verre : isolant',suit:1},{p:[0,48,0],t:'filament',suit:1}],
      lg:['La lampe est montée sur un support à deux bornes : c’est un dipôle.','Les deux bornes du support sont les contacts ; le verre est isolant.','Le courant traverse le filament seulement si les deux bornes sont reliées à la pile.'],on:true,devis:true,
      etat:function(st){return st.lift>.6?'Lampe dévissée : le circuit est ouvert, le courant ne passe plus.':'Lampe vissée : le circuit est fermé, si la pile et l’interrupteur le permettent.';}},
    moteur:{titre:'Moteur sur son support',vue:[.5,.3],build:function(on,t){var f=socle(70,40).concat(cyl(-22,13,0,6.5,3,'#C9CED8'),cyl(22,13,0,6.5,3,'#C9CED8'),cyl(0,13,0,10.5,6,'#FFFFFF'),cyl(0,19,0,2,28,'#7D89A3')),i,a;
      for(i=0;i<3;i++){a=(t||0)+i*2*PI/3;f.push({p:[[0,47,0],[34*Math.cos(a)-4*Math.sin(a),47,34*Math.sin(a)+4*Math.cos(a)],[34*Math.cos(a)+4*Math.sin(a),47,34*Math.sin(a)-4*Math.cos(a)]],c:'#4FC3FF',two:true});}
      return f;},
      glyph:{p:[0,19.2,6.5],t:'M'},lab:[{p:[-22,16,0],t:'borne (douille)'},{p:[22,16,0],t:'borne (douille)'},{p:[0,19,6],t:'symbole M sur le support'},{p:[30,50,0],t:'hélice (hors du support)'}],
      lg:['Le symbole du moteur est sur le support, entre les deux bornes.','Seule l’hélice dépasse du support : elle tourne quand le circuit est fermé.'],on:true,spin:true},
    inter:{titre:'Interrupteur',sc:4.6,cy:400,vue:[.5,.3],build:function(on){var f=socle(100,40).concat(cyl(-30,13,0,6.5,3,'#C9CED8'),cyl(30,13,0,6.5,3,'#C9CED8')),a=on?0:.55;
      f=f.concat(box(0,0,0,0,0,0,'#000').slice(0,0));f.push({line:[[-30,19,0],[-30+60*Math.cos(a),19+60*Math.sin(a),0]],c:'#B98A16',w:6});return f;},
      lab:[{p:[-30,16,0],t:'borne'},{p:[30,16,0],t:'borne'},{p:[0,22,0],t:'lame métallique (conductrice)'}],
      lg:['Fermé : la lame touche les deux bornes, le courant passe.','Ouvert : la lame est levée, le circuit est coupé.'],on:true,bascule:true}
  };
  var cur=null;
  function ouvrir(kind,etat){var d=DEF[kind];if(!d)return;if(cur)fermer();
    var st={lift:0,vis:0,yaw:d.vue[0]*.8,pit:d.vue[1],on:etat!=null?!!etat:true,auto:!window.matchMedia||!matchMedia('(prefers-reduced-motion: reduce)').matches,t:0},prev=document.activeElement;
    var ov=document.createElement('div');ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',d.titre+' en 3D');
    ov.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(15,23,41,.55);display:flex;align-items:center;justify-content:center;padding:12px;font-family:system-ui,sans-serif';
    var card=document.createElement('div');card.style.cssText='background:#fff;color:#1F2B44;border-radius:16px;max-width:560px;width:100%;max-height:96vh;overflow:auto;padding:14px 16px;box-shadow:0 20px 60px rgba(0,0,0,.4)';
    var h=document.createElement('h2');h.textContent=d.titre;h.style.cssText='margin:0 0 6px;font-size:18px';
    var cv=document.createElement('canvas');cv.width=1000;cv.height=640;cv.tabIndex=0;cv.setAttribute('role','img');cv.setAttribute('aria-label',d.titre+' en 3D. Glisser ou flèches du clavier pour tourner.');cv.style.cssText='width:100%;height:auto;border-radius:12px;background:#F4F7FB;touch-action:none;cursor:grab;display:block';
    var bar=document.createElement('div');bar.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:10px 0';
    function btn(t,fn){var b=document.createElement('button');b.type='button';b.textContent=t;b.style.cssText='padding:8px 12px;border-radius:10px;border:1px solid #9FB0C4;background:#fff;color:#1F2B44;font:600 14px system-ui;cursor:pointer;min-height:40px';b.onclick=fn;bar.appendChild(b);return b;}
    var bAuto=btn(st.auto?'Pause':'Tourner seul',function(){st.auto=!st.auto;bAuto.textContent=st.auto?'Pause':'Tourner seul';});
    btn('Vue de départ',function(){st.yaw=d.vue[0]*.8;st.pit=d.vue[1];});
    var bOn=null;if(d.bascule||d.on)bOn=btn('',function(){st.on=!st.on;maj();});
    function maj(){if(bOn)bOn.textContent=d.bascule?(st.on?'Ouvrir l’interrupteur':'Fermer l’interrupteur'):(kind==='moteur'?(st.on?'Arrêter':'Faire tourner'):(st.on?'Éteindre':'Allumer'));}maj();
    var bV=null,stat=null;if(d.devis){bV=btn('Dévisser la lampe',function(){st.vis=st.vis?0:1;bV.textContent=st.vis?'Revisser la lampe':'Dévisser la lampe';});stat=document.createElement('p');stat.setAttribute('aria-live','polite');stat.style.cssText='margin:0 0 8px;font:700 14px system-ui;color:#C2410C';}
    var bF=btn('Fermer',function(){fermer();});bF.style.background='#C2410C';bF.style.color='#fff';bF.style.borderColor='#C2410C';
    var ul=document.createElement('ul');ul.style.cssText='margin:0;padding-left:18px;font-size:14px;line-height:1.45';d.lg.forEach(function(t){var li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
    card.appendChild(h);card.appendChild(cv);card.appendChild(bar);if(stat)card.appendChild(stat);card.appendChild(ul);ov.appendChild(card);document.body.appendChild(ov);
    var g=cv.getContext('2d'),raf=0,drag=null;
    function proj(p){var cy=Math.cos(st.yaw),sy=Math.sin(st.yaw),cp=Math.cos(st.pit),sp=Math.sin(st.pit),x=p[0]*cy-p[2]*sy,z=p[0]*sy+p[2]*cy,y=p[1],y2=y*cp+z*sp,z2=-y*sp+z*cp,k=620/(620+z2);return [500+x*k*(d.sc||5.6),(d.cy||430)-y2*k*(d.sc||5.6),z2,x,y2];}
    function draw(){g.clearRect(0,0,cv.width,cv.height);var faces=d.build(st.on&&st.lift<.5,st.t,st.lift).map(function(f){if(f.line){var a=proj(f.line[0]),b=proj(f.line[1]);return {line:[a,b],c:f.c,w:f.w,z:(a[2]+b[2])/2};}var P=f.p.map(proj),z=P.reduce(function(s,q){return s+q[2];},0)/P.length;return {P:P,c:f.c,z:z,al:f.alpha,em:f.emis,base:f.base};});
      faces.sort(function(a,b){return (b.base?1:0)-(a.base?1:0)||b.z-a.z;});
      faces.forEach(function(f){if(f.line){g.strokeStyle=f.c;g.lineWidth=f.w*2.2;g.lineCap='round';g.beginPath();g.moveTo(f.line[0][0],f.line[0][1]);g.lineTo(f.line[1][0],f.line[1][1]);g.stroke();return;}
        var P=f.P,c=hex(f.c),A=[P[1][3]-P[0][3],P[1][4]-P[0][4],P[1][2]-P[0][2]],B=[P[2][3]-P[0][3],P[2][4]-P[0][4],P[2][2]-P[0][2]],n=[A[1]*B[2]-A[2]*B[1],A[2]*B[0]-A[0]*B[2],A[0]*B[1]-A[1]*B[0]],ln=Math.hypot(n[0],n[1],n[2])||1;
        if(n[2]>0)n=[-n[0],-n[1],-n[2]];var dot=(n[0]*-.35+n[1]*.85+n[2]*-.4)/ln,m=f.em?1.05:.62+.46*Math.max(0,dot);g.fillStyle='rgb('+Math.min(255,c[0]*m|0)+','+Math.min(255,c[1]*m|0)+','+Math.min(255,c[2]*m|0)+')';if(f.al)g.globalAlpha=f.al;g.beginPath();P.forEach(function(q,i){i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.closePath();g.fill();g.globalAlpha=1;g.strokeStyle='rgba(31,43,68,.28)';g.lineWidth=1.2;g.stroke();});
      if(d.glyph){var gq=proj(d.glyph.p);g.font='800 24px system-ui';g.fillStyle='#1F2B44';g.textAlign='center';g.textBaseline='middle';g.fillText(d.glyph.t,gq[0],gq[1]);}g.font='600 26px system-ui';g.textBaseline='middle';d.lab.forEach(function(l,i){var q=proj(l.suit&&st.lift?[l.p[0]+st.lift*105,l.p[1]-st.lift*24,l.p[2]+st.lift*18]:l.p),side=q[0]<500?-1:1,ex=side<0?60:cv.width-60,ey=70+i*52,w;g.strokeStyle='#C2410C';g.lineWidth=2;g.beginPath();g.moveTo(q[0],q[1]);w=g.measureText(l.t).width;g.lineTo(side<0?14+w+8:cv.width-14-w-8,ey);g.stroke();g.fillStyle='#C2410C';g.beginPath();g.arc(q[0],q[1],5,0,7);g.fill();g.fillStyle='#1F2B44';g.textAlign=side<0?'left':'right';g.fillText(l.t,side<0?14:cv.width-14,ey);});}
    var dernier='';function loop(){if(d.devis){var cible=st.vis,reduit=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;st.lift=reduit?cible:st.lift+(cible-st.lift)*.12;if(Math.abs(cible-st.lift)<.01)st.lift=cible;var e=d.etat(st);if(e!==dernier&&Math.abs(cible-st.lift)<.01){dernier=e;stat.textContent=e;}}if(st.auto&&!drag)st.yaw+=.008;if(d.spin&&st.on)st.t+=.18;draw();raf=requestAnimationFrame(loop);}
    cv.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';});
    cv.addEventListener('pointermove',function(e){if(!drag)return;st.yaw+=(e.clientX-drag.x)*.011;st.pit=Math.max(-.2,Math.min(1.35,st.pit+(e.clientY-drag.y)*.008));drag={x:e.clientX,y:e.clientY};});
    cv.addEventListener('pointerup',function(){drag=null;cv.style.cursor='grab';});
    cv.addEventListener('keydown',function(e){var k={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[e.key];if(k){e.preventDefault();st.yaw+=k[0];st.pit=Math.max(-.2,Math.min(1.35,st.pit+k[1]));}});
    function cle(e){if(e.key==='Escape'){fermer();}else if(e.key==='Tab'){var f=card.querySelectorAll('button,canvas'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}}
    ov.addEventListener('keydown',cle);ov.addEventListener('click',function(e){if(e.target===ov)fermer();});
    cur={ov:ov,raf:function(){cancelAnimationFrame(raf);},prev:prev};loop();cv.focus();}
  function fermer(){if(!cur)return;cur.raf();cur.ov.remove();if(cur.prev&&cur.prev.focus)try{cur.prev.focus();}catch(e){}cur=null;}
  document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-pop]');if(el&&!el.closest('[data-pop-off]'))ouvrir(el.getAttribute('data-pop'),el.getAttribute('data-etat')==null?null:el.getAttribute('data-etat')==='1');});
  window.NohobaPop3D={ouvrir:ouvrir,fermer:fermer,types:Object.keys(DEF)};
})();
})();
