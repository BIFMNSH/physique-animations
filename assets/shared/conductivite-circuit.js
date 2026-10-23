/* NohobaLab · composant graphique partagé : table d'essai (pile plate, module lampe, objet entre deux pinces).
   Modèle qualitatif : état de la lampe = conducteur ET boucle complète ET pile valide.
   Dessin original NohobaLab. API : create(host) puis update(values), palette(host, ids, onPick, selected). */
(function(){
'use strict';
var OBJ={"gomme": {"w": 130, "h": 60, "nom": "Gomme", "svg": "<rect x=\"3\" y=\"4\" width=\"130\" height=\"62\" rx=\"7\" fill=\"#00000018\"/><rect x=\"0\" y=\"0\" width=\"130\" height=\"60\" rx=\"7\" fill=\"#ECEEF2\" stroke=\"#C5CAD3\" stroke-width=\"1.5\"/><path d=\"M66 0 H123 Q130 0 130 7 V53 Q130 60 123 60 H66 Z\" fill=\"#5BB5F0\"/>"}, "clou": {"w": 170, "h": 34, "nom": "Clou en fer", "svg": "<path d=\"M0 17 L14 12 H150 V22 H14 Z\" fill=\"#C2C7CE\"/><rect x=\"14\" y=\"13\" width=\"136\" height=\"3\" fill=\"#fff\" opacity=\".5\"/><ellipse cx=\"158\" cy=\"17\" rx=\"7\" ry=\"16\" fill=\"#9AA1AB\"/>"}, "bois": {"w": 200, "h": 22, "nom": "Baguette de bois sec", "svg": "<rect x=\"0\" y=\"0\" width=\"200\" height=\"22\" rx=\"5\" fill=\"#B38B56\"/><path d=\"M8 5 C60 2 130 8 192 5\" fill=\"none\" stroke=\"#7A5A30\" stroke-opacity=\".55\" stroke-width=\"1.3\"/><path d=\"M8 11 C60 8 130 14 192 11\" fill=\"none\" stroke=\"#7A5A30\" stroke-opacity=\".55\" stroke-width=\"1.3\"/><path d=\"M8 17 C60 14 130 20 192 17\" fill=\"none\" stroke=\"#7A5A30\" stroke-opacity=\".55\" stroke-width=\"1.3\"/>"}, "cle": {"w": 190, "h": 56, "nom": "Clé", "svg": "<rect x=\"0\" y=\"22\" width=\"132\" height=\"10\" rx=\"4\" fill=\"#F2B24C\"/><circle cx=\"160\" cy=\"28\" r=\"28\" fill=\"#F2B24C\"/><circle cx=\"168\" cy=\"22\" r=\"5\" fill=\"#fff\"/><rect x=\"8\" y=\"32\" width=\"10\" height=\"16\" rx=\"2\" fill=\"#F2B24C\"/><rect x=\"26\" y=\"32\" width=\"10\" height=\"11\" rx=\"2\" fill=\"#F2B24C\"/><rect x=\"44\" y=\"32\" width=\"10\" height=\"16\" rx=\"2\" fill=\"#F2B24C\"/>"}, "regle": {"w": 230, "h": 44, "nom": "Règle en plastique", "svg": "<rect x=\"0\" y=\"0\" width=\"230\" height=\"44\" rx=\"4\" fill=\"#BFE6FB\" stroke=\"#6BB6E7\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"0\" x2=\"10\" y2=\"12\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"20\" y1=\"0\" x2=\"20\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"30\" y1=\"0\" x2=\"30\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"40\" y1=\"0\" x2=\"40\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"50\" y1=\"0\" x2=\"50\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"0\" x2=\"60\" y2=\"12\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"70\" y1=\"0\" x2=\"70\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"80\" y1=\"0\" x2=\"80\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"90\" y1=\"0\" x2=\"90\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"100\" y1=\"0\" x2=\"100\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"110\" y1=\"0\" x2=\"110\" y2=\"12\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"120\" y1=\"0\" x2=\"120\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"130\" y1=\"0\" x2=\"130\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"140\" y1=\"0\" x2=\"140\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"150\" y1=\"0\" x2=\"150\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"160\" y1=\"0\" x2=\"160\" y2=\"12\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"170\" y1=\"0\" x2=\"170\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"180\" y1=\"0\" x2=\"180\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"190\" y1=\"0\" x2=\"190\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"200\" y1=\"0\" x2=\"200\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"210\" y1=\"0\" x2=\"210\" y2=\"12\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><line x1=\"220\" y1=\"0\" x2=\"220\" y2=\"7\" stroke=\"#2D6C94\" stroke-width=\"1.2\"/><rect x=\"8\" y=\"30\" width=\"214\" height=\"5\" rx=\"2\" fill=\"#fff\" opacity=\".6\"/>"}, "piece": {"w": 90, "h": 90, "nom": "Pièce de monnaie", "svg": "<circle cx=\"45\" cy=\"45\" r=\"45\" fill=\"#F7C948\" stroke=\"#E0A92A\" stroke-width=\"3\"/><circle cx=\"45\" cy=\"45\" r=\"35\" fill=\"none\" stroke=\"#E0A92A\" stroke-width=\"2\"/><path d=\"M45 28 L50 41 H64 L53 49 L57 63 L45 55 L33 63 L37 49 L26 41 H40 Z\" fill=\"#E0A92A\"/>"}, "verre": {"w": 160, "h": 34, "nom": "Tube en verre", "svg": "<rect x=\"0\" y=\"0\" width=\"160\" height=\"34\" rx=\"12\" fill=\"#DDF0F7\" stroke=\"#9FCBDD\" stroke-width=\"2\"/><rect x=\"12\" y=\"6\" width=\"130\" height=\"5\" rx=\"2.5\" fill=\"#fff\" opacity=\".85\"/><rect x=\"108\" y=\"4\" width=\"40\" height=\"26\" rx=\"8\" fill=\"#fff\" opacity=\".35\"/>"}, "mine": {"w": 190, "h": 22, "nom": "Mine de crayon", "svg": "<rect x=\"0\" y=\"6\" width=\"190\" height=\"10\" rx=\"5\" fill=\"#3A3E46\"/><path d=\"M0 11 L12 6 V16 Z\" fill=\"#C9A878\"/><rect x=\"14\" y=\"8\" width=\"170\" height=\"2.5\" rx=\"1\" fill=\"#fff\" opacity=\".3\"/>"}, "couteau": {"w": 220, "h": 34, "nom": "Couteau", "svg": "<path d=\"M0 28 C30 6 90 4 130 12 V24 C90 30 30 34 0 28 Z\" fill=\"#D3D7DD\"/><path d=\"M14 24 C40 12 80 10 118 14\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3\" opacity=\".6\"/><rect x=\"128\" y=\"10\" width=\"92\" height=\"16\" rx=\"8\" fill=\"#B4BAC3\"/>"}, "cuivre": {"w": 200, "h": 16, "nom": "Tige de cuivre", "svg": "<rect x=\"0\" y=\"0\" width=\"200\" height=\"16\" rx=\"8\" fill=\"#C97A3A\"/><rect x=\"8\" y=\"3\" width=\"184\" height=\"3.5\" rx=\"1.7\" fill=\"#fff\" opacity=\".4\"/>"}, "fourchette": {"w": 210, "h": 44, "nom": "Fourchette", "svg": "<rect x=\"0\" y=\"18\" width=\"120\" height=\"8\" rx=\"4\" fill=\"#C9CED5\"/><rect x=\"112\" y=\"4\" width=\"30\" height=\"36\" rx=\"10\" fill=\"#C9CED5\"/><rect x=\"136\" y=\"4\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#C9CED5\"/><rect x=\"136\" y=\"14\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#C9CED5\"/><rect x=\"136\" y=\"24\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#C9CED5\"/><rect x=\"136\" y=\"35\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#C9CED5\"/>"}, "air": {"w": 180, "h": 0, "nom": "Air (espace vide)", "svg": ""}};
var ORDRE=['gomme','clou','bois','cle','regle','piece','verre','mine','couteau','air','cuivre','fourchette'];
var S=1.1,CX=450,CY=430,seq=0;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function txt(x,y,t,size,col,w){return '<text x="'+x+'" y="'+y+'" fill="'+col+'" font-size="'+size+'" font-weight="'+w+'" text-anchor="middle" font-family="Atkinson Hyperlegible,system-ui,sans-serif">'+t+'</text>';}
function clip(x,y,ang,col){return '<g transform="translate('+x+' '+y+') rotate('+ang+')"><path d="M-20 -8 L3 -4 V0 L-20 -2 Z" fill="#CBD0D8" stroke="#7C8591" stroke-width="1.2"/><path d="M-20 8 L3 4 V0 L-20 2 Z" fill="#CBD0D8" stroke="#7C8591" stroke-width="1.2"/><rect x="-50" y="-8" width="34" height="16" rx="6" fill="'+col+'" stroke="#00000040" stroke-width="1"/><rect x="-44" y="-5" width="18" height="3" rx="1.5" fill="#fff" opacity=".4"/></g>';}
function plug(x,y,col){return '<ellipse cx="'+x+'" cy="'+y+'" rx="13" ry="6.5" fill="'+col+'" stroke="#00000040" stroke-width="1"/><ellipse cx="'+x+'" cy="'+y+'" rx="6" ry="3" fill="#00000055"/><rect x="'+(x-6)+'" y="'+(y-34)+'" width="12" height="34" rx="3" fill="'+col+'" stroke="#00000040" stroke-width="1"/><rect x="'+(x-3.5)+'" y="'+(y-30)+'" width="3" height="22" rx="1.5" fill="#fff" opacity=".35"/><rect x="'+(x-8)+'" y="'+(y-40)+'" width="16" height="8" rx="3" fill="#1b1d22"/>';}
function wire(r,col){return '<path data-r="'+r+'s" fill="none" stroke="#1B2540" stroke-opacity=".16" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 5)"/><path data-r="'+r+'" fill="none" stroke="'+col+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';}
function circuit(host,options){
var p='nb'+(++seq),q=function(n){return p+'-'+n;},rays='';
for(var i=0;i<8;i++){var a=i*Math.PI/4+0.39;rays+='<line x1="'+(733+36*Math.cos(a))+'" y1="'+(324+36*Math.sin(a))+'" x2="'+(733+52*Math.cos(a))+'" y2="'+(324+52*Math.sin(a))+'" stroke="#F0B400" stroke-width="3" stroke-linecap="round"/>';}
host.innerHTML='<svg viewBox="0 96 900 440" role="img" style="display:block;width:100%;height:auto;border-radius:16px"><title data-r="title">Table d’essai</title>'
+'<defs>'
+'<linearGradient id="'+q('bg')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFCFE"/><stop offset="1" stop-color="#EEF1F8"/></linearGradient>'
+'<linearGradient id="'+q('tt')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDF0F7"/><stop offset="1" stop-color="#DCE1EC"/></linearGradient>'
+'<linearGradient id="'+q('te')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B5E9B"/><stop offset="1" stop-color="#2B3A67"/></linearGradient>'
+'<linearGradient id="'+q('bat')+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2B3A67"/><stop offset=".5" stop-color="#3A4C82"/><stop offset="1" stop-color="#26335A"/></linearGradient>'
+'<linearGradient id="'+q('mod')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4C82"/><stop offset="1" stop-color="#26335A"/></linearGradient>'
+'<linearGradient id="'+q('top')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A7FB8"/><stop offset="1" stop-color="#4E62A0"/></linearGradient>'
+'<radialGradient id="'+q('glow')+'"><stop offset="0" stop-color="#FFE27A" stop-opacity=".95"/><stop offset=".55" stop-color="#FFE27A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient>'
+'<radialGradient id="'+q('gl')+'" cx=".38" cy=".32"><stop offset="0" stop-color="#FFFBE6"/><stop offset="1" stop-color="#FFD54A"/></radialGradient>'
+'<radialGradient id="'+q('glo')+'" cx=".38" cy=".32"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6DEE9"/></radialGradient>'
+'<linearGradient id="'+q('strip')+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FBE08A"/><stop offset=".5" stop-color="#E7B93C"/><stop offset="1" stop-color="#B98A16"/></linearGradient>'
+'</defs>'
+'<rect x="0" y="96" width="900" height="440" fill="url(#'+q('bg')+')"/>'
+'<path d="M150 250 H750 L850 480 H50 Z" fill="url(#'+q('tt')+')"/><path d="M150 250 H750" stroke="#fff" stroke-width="2" opacity=".8"/><rect x="40" y="480" width="820" height="24" rx="3" fill="url(#'+q('te')+')"/><rect x="52" y="504" width="796" height="12" rx="2" fill="#26335A"/><rect x="40" y="480" width="820" height="3" fill="#fff" opacity=".25"/>'
+'<g data-r="glow"><ellipse cx="733" cy="436" rx="150" ry="22" fill="#FFD54A" opacity=".28"/><circle cx="733" cy="324" r="130" fill="url(#'+q('glow')+')"/></g>'
+'<ellipse cx="310" cy="276" rx="66" ry="9" fill="#1B2540" opacity=".22"/>'
+'<rect x="270" y="168" width="80" height="104" rx="9" fill="url(#'+q('bat')+')"/><rect x="270" y="168" width="80" height="26" rx="9" fill="#5A6FA8"/><rect x="274" y="172" width="72" height="4" rx="2" fill="#fff" opacity=".25"/><rect x="282" y="208" width="56" height="32" rx="6" fill="#F97316"/>'+txt(310,231,'4,5 V',19,'#ffffff',800)
+'<rect x="291" y="126" width="12" height="44" rx="2" fill="url(#'+q('strip')+')" stroke="#9A7A12" stroke-width="1"/><rect x="333" y="126" width="12" height="44" rx="2" fill="url(#'+q('strip')+')" stroke="#9A7A12" stroke-width="1"/>'
+'<circle cx="297" cy="181" r="10" fill="#fff"/>'+txt(297,189,'−',20,'#2B5EA8',800)+'<circle cx="339" cy="181" r="10" fill="#fff"/>'+txt(339,189,'+',20,'#C03A2E',800)
+'<g data-r="bfail" visibility="hidden"><rect x="270" y="168" width="80" height="104" rx="9" fill="#fff" opacity=".6"/><path d="M280 180 L340 262 M340 180 L280 262" stroke="#E0342F" stroke-width="7" stroke-linecap="round"/>'+txt(310,292,'Pile défaillante',13,'#B3261E',800)+'</g>'
+'<ellipse cx="740" cy="426" rx="128" ry="12" fill="#1B2540" opacity=".22"/>'
+'<rect x="620" y="372" width="200" height="44" rx="4" fill="url(#'+q('mod')+')"/><path d="M620 372 H820 L846 350 H646 Z" fill="url(#'+q('top')+')"/><path d="M820 372 L846 350 V394 L820 416 Z" fill="#1E2A50"/><path d="M620 372 H820" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>'
+'<ellipse cx="733" cy="361" rx="17" ry="7" fill="#161922"/><rect x="725" y="342" width="16" height="18" rx="3" fill="#B7BDC7"/>'
+wire('lw','#2E3138')+'<path d="M380 142 C540 142 665 140 665 240 L665 324" fill="none" stroke="#1B2540" stroke-opacity=".16" stroke-width="7" stroke-linecap="round" transform="translate(2 5)"/><path d="M380 142 C540 142 665 140 665 240 L665 324" fill="none" stroke="#E0342F" stroke-width="4" stroke-linecap="round"/>'+wire('rw','#2E3138')
+plug(665,360,'#E0342F')+plug(790,360,'#2E3138')
+'<g data-r="rays">'+rays+'</g>'
+'<circle data-r="glass" cx="733" cy="324" r="26" stroke="#9FB0C4" stroke-width="2.5"/><path d="M725 342 V332 M741 342 V332" stroke="#6b7480" stroke-width="2"/><path data-r="fil" d="M725 332 Q729 314 733 328 Q737 314 741 332" fill="none" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="724" cy="312" rx="5" ry="9" fill="#fff" opacity=".7" transform="rotate(-25 724 312)"/>'
+'<ellipse data-r="oshadow" cy="470" rx="100" ry="5" fill="#1B2540" opacity=".16"/><g data-r="objw"><g data-r="obj"></g></g>'
+'<g data-r="air" visibility="hidden"><line data-r="airl" y1="430" y2="430" stroke="#8A96A8" stroke-width="2.5" stroke-dasharray="3 8"/>'+txt(CX,416,'espace d’air',14,'#5A6780',700)+'</g>'
+'<g data-r="cl"></g><g data-r="cr"></g>'+clip(300,142,0,'#2E3138')+clip(330,142,180,'#E0342F')
+'<g data-r="fault" visibility="hidden"><circle cx="822" cy="304" r="17" fill="none" stroke="#E0342F" stroke-width="2.5" stroke-dasharray="4 4"/>'+txt(822,274,'contact ouvert',14,'#B3261E',800)+'</g>'
+'</svg>';
function el(n){return host.querySelector('[data-r="'+n+'"]');}
function d(n,v){el(n).setAttribute('d',v);el(n+'s').setAttribute('d',v);}
var glass=el('glass'),fil=el('fil');
function update(values){
 var v=values||{},o=OBJ[v.id]||OBJ.air,id=OBJ[v.id]?v.id:'air',closed=v.contact!==false,pile=v.pile!==false,on=!!(closed&&pile&&v.conducteur);
 var w=(id==='air'?180:o.w*S),h=(id==='air'?0:o.h*S),L=CX-w/2,R=CX+w/2;
 el('obj').innerHTML=o.svg;
 el('objw').setAttribute('transform','translate('+(CX-o.w*S/2)+' '+(CY-o.h*S/2)+') scale('+S+')');
 el('objw').setAttribute('visibility',id==='air'?'hidden':'visible');
 el('air').setAttribute('visibility',id==='air'?'visible':'hidden');
 el('airl').setAttribute('x1',L);el('airl').setAttribute('x2',R);
 var os=el('oshadow');os.setAttribute('cx',CX);os.setAttribute('rx',w/2);os.setAttribute('cy',CY+h/2+7);os.setAttribute('visibility',id==='air'?'hidden':'visible');
 el('cl').innerHTML=clip(L+4,CY,0,'#2E3138');el('cr').innerHTML=clip(R-4,CY,180,'#2E3138');
 d('lw','M250 142 C165 142 118 200 118 300 C118 392 190 '+CY+' '+(L-46)+' '+CY);
 d('rw',closed?'M'+(R+46)+' '+CY+' C760 468 884 468 884 360 C884 292 790 284 790 324':'M'+(R+46)+' '+CY+' C760 468 884 468 884 360 C884 320 842 296 818 304');
 el('fault').setAttribute('visibility',closed?'hidden':'visible');
 el('bfail').setAttribute('visibility',pile?'hidden':'visible');
 el('glow').setAttribute('visibility',on?'visible':'hidden');el('rays').setAttribute('visibility',on?'visible':'hidden');
 glass.setAttribute('fill','url(#'+q(on?'gl':'glo')+')');fil.setAttribute('stroke',on?'#FF8A00':'#8A94A4');
 el('title').textContent='Table d’essai : pile 4,5 V, lampe '+(on?'allumée':'éteinte')+', objet '+(v.materiau||o.nom)+' ; '+(!closed?'contact ouvert':!pile?'pile défaillante':'montage contrôlé');
 return on;
}
return {update:update};
}
function thumb(id){var o=OBJ[id];if(id==='air')return '<svg viewBox="0 0 150 52" aria-hidden="true" style="display:block;width:100%;height:52px"><line x1="22" y1="26" x2="128" y2="26" stroke="#8A96A8" stroke-width="2.5" stroke-dasharray="3 7"/></svg>';
 var sc=Math.min(112/o.w,44/o.h);return '<svg viewBox="0 0 150 52" aria-hidden="true" style="display:block;width:100%;height:52px"><g transform="translate('+(75-o.w*sc/2)+' '+(26-o.h*sc/2)+') scale('+sc+')">'+o.svg+'</g></svg>';}
function palette(host,ids,onPick,selected){
 host.innerHTML='';var btns={};
 host.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px';
 function mark(id){Object.keys(btns).forEach(function(k){var on=k===id;btns[k].setAttribute('aria-pressed',on?'true':'false');btns[k].style.borderColor=on?'#F97316':'#E1E5EE';btns[k].style.background=on?'#FFF4EA':'#F8F9FC';btns[k].style.boxShadow=on?'0 0 0 2px #F97316':'none';});}
 (ids||ORDRE).forEach(function(id){var b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed','false');b.style.cssText='border:2px solid #E1E5EE;border-radius:14px;background:#F8F9FC;color:#243049;font:700 13px/1.2 Atkinson Hyperlegible,system-ui,sans-serif;padding:8px 6px 10px;min-height:88px;cursor:pointer;text-align:center';
  b.innerHTML=thumb(id)+'<span style="display:block;margin-top:6px">'+esc(OBJ[id].nom)+'</span>';
  b.onclick=function(){mark(id);if(onPick)onPick(id);};btns[id]=b;host.appendChild(b);});
 if(selected)mark(selected);
 return {select:mark};
}
window.NohobaCircuit=Object.freeze({create:circuit,palette:palette,ordre:ORDRE.slice(),objets:Object.freeze(Object.keys(OBJ))});
})();
