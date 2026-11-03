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
var CR='#D9423B',CK='#2B2F38',FD='#0F1729',CLAIR='#A9B4C7';
function r1(v){return Math.round(v*10)/10;}
function svgBanc(inner,vb,label){return '<svg viewBox="'+vb+'" role="img" aria-label="'+esc(label)+'" style="display:block;width:100%;height:auto;border-radius:14px;background:'+FD+'">'+inner+'</svg>';}
function fiche(pt,from,col){var a=Math.atan2(pt[1]-from[1],pt[0]-from[0])*180/Math.PI;
  return '<g transform="translate('+r1(pt[0])+' '+r1(pt[1])+') rotate('+r1(a)+')"><rect x="-15" y="-5.5" width="14" height="11" rx="3" fill="'+col+'" stroke="#0A0F1A" stroke-opacity=".5"/><rect x="-9" y="-5.5" width="2.2" height="11" fill="#fff" opacity=".25"/><rect x="-2" y="-2.6" width="7" height="5.2" rx="1.5" fill="#D9B44A" stroke="#8A6D12" stroke-width=".8"/></g>';}
/* câble entre deux douilles : il part de chacune horizontalement (da, db = ±1 : vers la gauche ou la droite) puis se courbe. Renvoie {d, svg}. */
function cab(a,da,b,db,col,o){o=o||{};var d=Math.hypot(b[0]-a[0],b[1]-a[1]),k=o.k||Math.max(34,Math.min(80,d*.4)),c1=[a[0]+da*k,a[1]],c2=[b[0]+db*k,b[1]],
  dd='M'+r1(a[0])+' '+r1(a[1])+' C'+r1(c1[0])+' '+r1(c1[1])+' '+r1(c2[0])+' '+r1(c2[1])+' '+r1(b[0])+' '+r1(b[1]),
  s='<path d="'+dd+'" fill="none" stroke="#0A0F1A" stroke-opacity=".55" stroke-width="7" stroke-linecap="round" transform="translate(1.5 3)"/>';
  if(col===CK)s+='<path d="'+dd+'" fill="none" stroke="#8FA0BF" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>';
  s+='<path d="'+dd+'" fill="none" stroke="'+col+'" stroke-width="4.2" stroke-linecap="round"/><path d="'+dd+'" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.4" stroke-linecap="round" transform="translate(0 -1.2)"/>';
  if(!o.sansA)s+=fiche(a,c1,col);if(!o.sansB)s+=fiche(b,c2,col);
  return {d:dd,svg:s};}
function ring(m,cx,cy,rx,ry){var P=[],i,a;for(i=0;i<m;i++){a=(-90+i*360/m)*Math.PI/180;P.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);}return P;}
/* boucle de modules à deux douilles : le premier (pile) sort par la droite (+) et revient par la gauche (−) ; mods[i]={L:[x,y],R:[x,y]} */
/* nombre de points du câble qui passent dans le verre ou le halo d'une lampe (avoid = [cx,cy,r]) */
function touche(a,da,b,db,mods){var d=Math.hypot(b[0]-a[0],b[1]-a[1]),k=Math.max(34,Math.min(80,d*.4)),c1=[a[0]+da*k,a[1]],c2=[b[0]+db*k,b[1]],n=0,i,j,u,x,y,q,v;
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
function socle(x,y){return '<ellipse cx="'+x+'" cy="'+(y+16)+'" rx="48" ry="6" fill="#05080F" opacity=".4"/><rect x="'+(x-35)+'" y="'+(y-13.2)+'" width="70" height="26.4" rx="5" fill="#E9EEF6" stroke="#9FB0C4" stroke-width="2"/>';}
/* pile plate : deux bornes de même taille aux extrémités, − à gauche et + à droite (inv : échangés) ; douilles (x∓53, y) */
function pileM(x,y,o){o=o||{};var gs=o.inv?'+':'−',ds=o.inv?'−':'+',gc=o.inv?'#FF8A80':'#80B8FF',dc=o.inv?'#80B8FF':'#FF8A80';
  var g='<ellipse cx="'+x+'" cy="'+(y+27)+'" rx="56" ry="7" fill="#05080F" opacity=".4"/><rect x="'+(x-58)+'" y="'+(y-6)+'" width="12" height="12" rx="2" fill="#D9B44A" stroke="#8A6D12"/><rect x="'+(x+46)+'" y="'+(y-6)+'" width="12" height="12" rx="2" fill="#D9B44A" stroke="#8A6D12"/>'
   +'<rect x="'+(x-48)+'" y="'+(y-23)+'" width="96" height="46" rx="7" fill="#1F2B44" stroke="#5B6680" stroke-width="2"/><rect x="'+(x-43)+'" y="'+(y+14)+'" width="86" height="3" rx="1.5" fill="#fff" opacity=".12"/><rect x="'+(x-48)+'" y="'+(y-23)+'" width="96" height="12" rx="6" fill="#FFB547"/>'
   +T(x,y+12,'4,5 V',15,'#EEF2F8',900)+T(x-34,y-29,gs,20,gc,900)+T(x+34,y-29,ds,18,dc,900);
  if(o.fail)g+='<rect x="'+(x-48)+'" y="'+(y-23)+'" width="96" height="46" rx="7" fill="'+FD+'" opacity=".6"/>';
  return {g:g,L:[x-53,y],R:[x+53,y]};}
/* lampe sur son socle : le verre est isolant, les deux douilles du socle sont les bornes ; douilles (x∓22, y) ; verre en (x, y-33) */
function lampeM(x,y,on,o){o=o||{};var by=y-33,g='';
  if(on)g+='<circle cx="'+x+'" cy="'+by+'" r="46" fill="#FFD27A" opacity=".2"/><circle cx="'+x+'" cy="'+by+'" r="30" fill="#FFD27A" opacity=".3"/>';
  g+=socle(x,y)+'<path d="M'+(x-22)+' '+y+' H'+(x-9.2)+' M'+(x+9.2)+' '+y+' H'+(x+22)+'" stroke="#3A4660" stroke-width="1.6" fill="none"/><circle cx="'+x+'" cy="'+y+'" r="9.2" fill="#fff" stroke="#3A4660" stroke-width="1.8"/><path d="M'+(x-6.6)+' '+(y-6.6)+' L'+(x+6.6)+' '+(y+6.6)+' M'+(x+6.6)+' '+(y-6.6)+' L'+(x-6.6)+' '+(y+6.6)+'" stroke="#3A4660" stroke-width="1.8"/>'+douille(x-22,y)+douille(x+22,y);
  g+='<rect x="'+(x-8.8)+'" y="'+(y-24)+'" width="17.6" height="11" rx="3" fill="#8D96A8" stroke="#6B7480" stroke-width="1.2"/><circle cx="'+x+'" cy="'+by+'" r="19" fill="'+(on?'#FFE9A8':'#2A3346')+'" stroke="#C9D2E3" stroke-width="2.5"/>'
   +'<path d="M'+(x-9)+' '+(by+14)+' L'+(x-6)+' '+(by+2)+' l4 -6 l4 6 l4 -6 l4 6 L'+(x+9)+' '+(by+14)+'" fill="none" stroke="'+(on?'#FF8A00':'#8D96A8')+'" stroke-width="2.2" stroke-linejoin="round"/>';
  if(o.grille)g+='<path d="M'+(x-4)+' '+(by-6)+' l3 4 M'+(x+4)+' '+(by-6)+' l-3 4" stroke="#FF5A4E" stroke-width="2.5"/>'+T(x,by-27,'filament coupé',11,'#FF8A80',800).replace('y="'+(by-27)+'"','y="'+(y+36)+'"');
  return {g:g,L:[x-22,y],R:[x+22,y],verre:[x,by],av:[x,by,50]};}
/* interrupteur sur socle : douilles (x∓30, y) ; la lame pivote autour de la douille de gauche */
function interM(x,y,closed,nom){var x1=x-30,x2=x+30,ex=closed?x2:x1+60*Math.cos(-32*Math.PI/180),ey=closed?y:y+60*Math.sin(-32*Math.PI/180);
  return {g:'<ellipse cx="'+x+'" cy="'+(y+18)+'" rx="76" ry="6" fill="#05080F" opacity=".35"/><rect x="'+(x1-20)+'" y="'+(y-15)+'" width="100" height="32" rx="6" fill="#C9D2E3"/><rect x="'+(x1-20)+'" y="'+(y-15)+'" width="100" height="28" rx="6" fill="#EEF2FA" stroke="#9FB0C4" stroke-width="1.5"/><rect x="'+(x1-15)+'" y="'+(y-11)+'" width="90" height="4" rx="2" fill="#fff" opacity=".8"/>'
   +douille(x1,y)+douille(x2,y)+'<line x1="'+x1+'" y1="'+y+'" x2="'+r1(ex)+'" y2="'+r1(ey)+'" stroke="#B98A16" stroke-width="5" stroke-linecap="round"/><circle cx="'+r1(ex)+'" cy="'+r1(ey)+'" r="6.5" fill="#2A2F38" stroke="#0A0F1A"/>'+T(x,y+33,nom||'K',12,CLAIR,800),L:[x1,y],R:[x2,y]};}
/* moteur sur socle : douilles (x∓22, y) ; hélice au-dessus */
function moteurM(x,y,on,sens){var cy=y-30,g=socle(x,y)+douille(x-22,y)+douille(x+22,y),i;
  g+='<line x1="'+x+'" y1="'+(cy-19)+'" x2="'+x+'" y2="'+(cy-31)+'" stroke="#7D89A3" stroke-width="3"/><circle cx="'+x+'" cy="'+cy+'" r="19" fill="#2A3346" stroke="#C9D2E3" stroke-width="2.5"/>'+T(x,cy+6,'M',17,'#EEF2F8',900);
  g+='<g transform="translate('+x+' '+(cy-38)+') rotate('+(on?25:0)+')">';for(i=0;i<3;i++)g+='<path d="M0 0 q5 -13 0 -22 q-5 8 0 22z" fill="#4FC3FF" transform="rotate('+(i*120)+')"/>';g+='<circle r="3" fill="#EEF2F8"/></g>';
  if(on&&sens)g+='<path d="'+(sens>0?'M'+(x-26)+' '+(cy-56)+' q26 -14 52 0':'M'+(x+26)+' '+(cy-56)+' q-26 -14 -52 0')+'" fill="none" stroke="#4FC3FF" stroke-width="3.5" stroke-linecap="round"/><path d="'+(sens>0?'M'+(x+22)+' '+(cy-64)+' l6 8 l-9 2':'M'+(x-22)+' '+(cy-64)+' l-6 8 l9 2')+'" fill="none" stroke="#4FC3FF" stroke-width="3.5" stroke-linecap="round"/>';
  else if(on)g+='<path d="M'+(x-26)+' '+(cy-56)+' q26 -14 52 0" fill="none" stroke="#4FC3FF" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>';
  return {g:g,L:[x-22,y],R:[x+22,y]};}
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
})();
