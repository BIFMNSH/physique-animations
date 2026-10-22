/* NohobaLab · composant graphique partagé : montage de test électrique.
   Modèle qualitatif : état de la lampe = conducteur ET boucle complète ET pile valide. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
function node(parent,name,attrs,text){var e=document.createElementNS(NS,name);Object.keys(attrs||{}).forEach(function(k){e.setAttribute(k,attrs[k]);});if(text!=null)e.textContent=text;parent.appendChild(e);return e;}
function circuit(host,options){
var opts=options||{},svg=node(host,'svg',{viewBox:'0 0 680 370',role:'img',style:'display:block;width:100%;height:auto;max-height:440px;background:#0d172a;border-radius:18px'});
var title=node(svg,'title',{},'Circuit de conductivité avec une pile, une lampe, un interrupteur et un échantillon testé');
node(svg,'rect',{x:22,y:20,width:636,height:326,rx:17,fill:'#14223a',stroke:'#3c516e','stroke-width':2});
function line(d,col,w){return node(svg,'path',{d:d,fill:'none',stroke:col||'#a8bfd9','stroke-width':w||5,'stroke-linecap':'round','stroke-linejoin':'round'});}
function label(x,y,t,fill,size){return node(svg,'text',{x:x,y:y,fill:fill||'#d5e4f6','font-size':size||15,'text-anchor':'middle','font-family':'system-ui, sans-serif'},t);}
label(340,47,'BANC D’ESSAI · CIRCUIT ÉLECTRIQUE','#eaf2ff',17);
line('M162 134 H260','#d84f55');line('M306 134 H422');line('M468 134 H523 V272 H401');
line('M280 272 H162 V241');line('M162 214 V190');line('M341 272 H401');
var battery=node(svg,'g',{},null);node(battery,'rect',{x:118,y:115,width:88,height:76,rx:9,fill:'#263855',stroke:'#b8c7dc','stroke-width':2});node(battery,'rect',{x:118,y:115,width:88,height:14,rx:5,fill:'#f8b74d'});node(battery,'text',{x:162,y:155,fill:'#fff','font-size':19,'font-weight':750,'text-anchor':'middle'},'4,5 V');label(142,109,'−','#91c5ff',17);label(185,109,'+','#ff9c90',17);
var switchGap=node(svg,'rect',{x:259,y:125,width:48,height:18,fill:'#14223a'});node(svg,'circle',{cx:260,cy:134,r:6,fill:'#e4ebf4'});node(svg,'circle',{cx:306,cy:134,r:6,fill:'#e4ebf4'});var lever=line('M260 134 L306 134','#f7c56a',4);label(285,103,'Interrupteur','#b7cce7',13);
var bulb=node(svg,'g',{},null);var halo=node(bulb,'circle',{cx:445,cy:134,r:51,fill:'#ffd666',opacity:0.05});var glass=node(bulb,'circle',{cx:445,cy:134,r:28,fill:'#33425b',stroke:'#d6e4f5','stroke-width':3});node(bulb,'path',{d:'M428 117 L462 151 M462 117 L428 151',stroke:'#e5e7eb','stroke-width':2.5});label(445,192,'Lampe','#d6e4f5',14);
var contactL=node(svg,'circle',{cx:280,cy:272,r:8,fill:'#e9655a'});var contactR=node(svg,'circle',{cx:401,cy:272,r:8,fill:'#9ec5ff'});var sample=node(svg,'rect',{x:284,y:264,width:113,height:16,rx:6,fill:'#c98a49',stroke:'#e7d9b1','stroke-width':1.4});var sampleText=label(340,313,'Cuivre','#e9f1fe',15);
var wireGap=node(svg,'path',{d:'M162 214 V241',stroke:'#a8bfd9','stroke-width':5,fill:'none'});var loose=line('M162 214 L139 194','#f48282',4);
var batFail=node(svg,'g',{visibility:'hidden'});node(batFail,'path',{d:'M123 115 L200 191 M200 115 L123 191',stroke:'#ff626e','stroke-width':7});label(162,210,'Pile défaillante','#ffacb3',12);
var state=label(340,337,'','#d9e6f4',13);
function update(values){var v=values||{},closed=v.contact!==false,pile=v.pile!==false,on=!!(closed&&pile&&v.conducteur);lever.setAttribute('d',closed?'M260 134 L306 134':'M260 134 L292 111');wireGap.style.display=closed?'':'none';loose.style.display=closed?'none':'';batFail.setAttribute('visibility',pile?'hidden':'visible');glass.setAttribute('fill',on?'#ffe082':'#33425b');halo.setAttribute('opacity',on?'0.35':'0.02');sample.setAttribute('fill',v.couleur||'#c98a49');sampleText.textContent=v.materiau||'Échantillon';state.textContent=!closed?'Circuit ouvert : connexion débranchée':!pile?'Pile non fonctionnelle':on?'La lampe s’allume':'La lampe reste éteinte';title.textContent='Pile 4,5 V, lampe '+(on?'allumée':'éteinte')+', matériau '+(v.materiau||'échantillon')+' ; '+(!closed?'connexion ouverte':!pile?'pile défaillante':'montage contrôlé');return on;}
update(opts);return{element:svg,update:update};
}
window.NohobaCircuit=Object.freeze({create:circuit});
})();