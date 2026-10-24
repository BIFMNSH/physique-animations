/* NohobaLab · atelier d'électricité (6e Côte d'Ivoire) : dessins originaux partagés par les activités du circuit électrique.
   Montage réaliste (pile 4,5 V, pile cylindrique, lampe, interrupteur, moteur) et schéma normalisé (symboles du document de classe).
   Conventions : plot et culot de la lampe sont les deux contacts ; le verre est isolant ; la polarité est imprimée sur la pile. */
(function(){
'use strict';
var INK='#243049',OR='#F97316',FONT='Atkinson Hyperlegible,system-ui,sans-serif';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function T(x,y,t,size,col,w,anchor){return '<text x="'+x+'" y="'+y+'" fill="'+(col||INK)+'" font-size="'+(size||13)+'" font-weight="'+(w||700)+'" text-anchor="'+(anchor||'middle')+'" font-family="'+FONT+'">'+esc(t)+'</text>';}
function svg(inner,vb,label){return '<svg viewBox="'+vb+'" role="img" aria-label="'+esc(label)+'" style="display:block;width:100%;height:auto;border-radius:14px;background:#F7F8FB">'+inner+'</svg>';}
/* pile plate 4,5 V : bornes de même taille, + et − imprimés sur le corps. Bornes en haut : − à x+27*sc, + à x+53*sc, sommet y-42*sc. */
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
function lampe(x,y,on,sc){sc=sc||1;var g='<g transform="translate('+x+' '+y+') scale('+sc+')">',i,a;
  if(on){g+='<circle cx="0" cy="0" r="52" fill="#FFE27A" opacity=".45"/>';for(i=0;i<8;i++){a=i*Math.PI/4+0.39;g+='<line x1="'+(36*Math.cos(a)).toFixed(1)+'" y1="'+(36*Math.sin(a)).toFixed(1)+'" x2="'+(50*Math.cos(a)).toFixed(1)+'" y2="'+(50*Math.sin(a)).toFixed(1)+'" stroke="#F0B400" stroke-width="3" stroke-linecap="round"/>';}}
  g+='<circle cx="0" cy="0" r="26" fill="'+(on?'#FFE27A':'#EEF3F8')+'" stroke="#9FB0C4" stroke-width="2.5"/><path d="M-8 18 V8 M8 18 V8" stroke="#6b7480" stroke-width="2"/><path d="M-8 8 Q-4 -10 0 4 Q4 -10 8 8" fill="none" stroke="'+(on?'#FF8A00':'#8A94A4')+'" stroke-width="2.4"/>'
  +'<rect x="-16" y="26" width="32" height="26" rx="4" fill="#B7BDC7" stroke="#6b7480"/><path d="M-16 34 h32 M-16 42 h32" stroke="#6b7480"/><rect x="-6" y="52" width="12" height="6" rx="2" fill="#8A94A4"/></g>';return g;}
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
function montageSerie(o){
  var piece=o.pile!==false,lamp=o.lampe!==false,mot=o.moteur!==false,ix=o.inter||'ferme',coupe=!!o.filCoupe,
      on=piece&&lamp&&mot&&ix==='ferme'&&!coupe,s='';
  function absent(x,y,w,h,t){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="none" stroke="#9FB0C4" stroke-width="2" stroke-dasharray="6 5"/>'+T(x+w/2,y+h/2+5,t,13,'#8895A8',700);}
  /* Fils routés hors des objets, du sommet des bornes aux contacts de la lampe. */
  s+=fil('M64.3 112.2 V84 H22 V24 H152 V50 H176','#2E3138');
  s+=fil('M224 50 C270 50 290 66 330 66','#2E3138');
  s+=fil(coupe?'M390 66 C420 66 430 100 436 130':'M390 66 C430 66 430 219 454 219','#E0342F');
  s+=fil('M87.7 112.2 V84 H126 V284 H470 V238','#E0342F');
  if(piece)s+=pile45(40,150,.9);else s+=absent(30,100,90,120,'pile absente');
  if(ix==='absent')s+=absent(176,32,48,36,'');else s+=interrupteur(200,50,ix==='ferme');
  if(mot)s+=moteur(360,60,on);else s+=absent(322,28,76,52,'moteur absent');
  if(lamp)s+=lampe(470,180,on,1);else s+=absent(430,128,80,140,'lampe absente');
  s+=broches([[176,50],[224,50],[330,66],[390,66]]);
  if(lamp)s+=broches([[454,219],[470,238]]);
  return {svg:svg(s,'0 0 560 300','Montage en série : pile, interrupteur '+(ix==='ferme'?'fermé':ix==='ouvert'?'ouvert':'absent')+', moteur, lampe'+(on?' ; la lampe brille et le moteur tourne':' ; le circuit est ouvert')),allume:on};}
window.NohobaAtelier={esc:esc,T:T,svg:svg,pile45:pile45,pileCyl:pileCyl,lampe:lampe,interrupteur:interrupteur,moteur:moteur,fil:fil,broches:broches,pastille:pastille,numero:numero,schema:schema,grains:grains,montageSerie:montageSerie,symbole:symbole,
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
