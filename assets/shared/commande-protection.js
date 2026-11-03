/* NohobaLab · commande, court-circuit, protection et panne d'un circuit (6e Côte d'Ivoire).
   Modèle QUALITATIF testable sans interface : un circuit est un ensemble de nœuds reliés par des conducteurs (fils, interrupteurs fermés, fusible intact…)
   et de charges (lampe, moteur). Les nœuds reliés par un conducteur n'en font qu'un (résistance négligeable). Une charge est active si elle se trouve
   sur un chemin fermé qui va de la borne + à la borne − de la pile ; elle est « shuntée » si ses deux bornes sont au même nœud.
   Si les deux bornes de la pile sont au même nœud, il y a court-circuit. Aucune intensité ni température chiffrée : limites du modèle dites aux élèves.
   Dessins originaux : montage réaliste et schéma normalisé, mis à jour ensemble. Plot et culot de la lampe sont les contacts ; le verre est isolant. */
(function(){
'use strict';
var A=window.NohobaAtelier,INK='#243049',OR='#F97316',BLK='#2E3138',RED='#E0342F';

/* ====================== 1. modèle ====================== */
function resoudre(c){
  var par={};
  function find(x){if(!(x in par))par[x]=x;while(par[x]!==x){par[x]=par[par[x]];x=par[x];}return x;}
  (c.conducteurs||[]).forEach(function(e){par[find(e[0])]=find(e[1]);});
  var res={alimente:c.pile.ok!==false,courtCircuit:false,charges:{}},P=find(c.pile.plus),M=find(c.pile.moins),edges=[];
  (c.charges||[]).forEach(function(ch){
    var a=find(ch.a),b=find(ch.b);res.charges[ch.id]='inactif';
    if(ch.ok===false)return;
    if(a===b){res.charges[ch.id]='shuntee';return;}
    edges.push({id:ch.id,a:a,b:b});});
  if(!res.alimente)return res;
  if(P===M){res.courtCircuit=true;return res;}
  var used={};
  (function dfs(node,seen,path){
    if(node===M){path.forEach(function(id){used[id]=true;});return;}
    edges.forEach(function(e){
      if(path.indexOf(e.id)>=0)return;
      var next=e.a===node?e.b:(e.b===node?e.a:null);
      if(next===null||seen[next])return;
      seen[next]=true;path.push(e.id);dfs(next,seen,path);path.pop();seen[next]=false;});
  })(P,(function(){var v={};v[P]=true;return v;})(),[]);
  Object.keys(used).forEach(function(id){res.charges[id]='actif';});
  return res;
}
/* organe à deux bornes : conduit-il ? (interrupteur, bouton poussoir, fusible, disjoncteur, fil) */
function conduit(kind,s){s=s||{};
  if(!kind||kind==='fil')return true;
  if(kind==='inter')return !!s.ferme&&!s.defaut;
  if(kind==='pousseNO')return !!s.appui;
  if(kind==='pousseNF')return !s.appui;
  if(kind==='fusible')return !s.fondu;
  if(kind==='disj')return !s.declenche;
  return false;}
function materiau(id){var M=window.NohobaConductivite&&window.NohobaConductivite.materiaux;return id==='fil'?{nom:'Fil de connexion en cuivre',conducteur:true,couleur:'#C0662B'}:(M&&M[id])||null;}
function pontConduit(p){var m=p?materiau(p):null;return !!(m&&m.conducteur);}

/* circuit « boucle » : pile, organe(s) de commande ou de protection, lampe (ou moteur), planche à bornes optionnelle avec un pont.
   o : pile 'ok'|'usee', inverse, slot1/slot2 (organes), s1/s2 (états), lampe 'ok'|'grillee', moteur bool, planche bool, pont (id de matériau ou 'fil'),
       courtPile bool, contactLache bool */
function reseau(o){
  var cond=[],ch=[],a='A',b='B';
  /* borne gauche TL, borne droite TR de la pile ; le moins est à gauche, sauf pile retournée */
  if(conduit(o.slot1,o.s1))cond.push(['TL','S1']);
  if(o.moteur){ch.push({id:'moteur',a:'S1',b:'A'});}else if(!o.contactLache)cond.push(['S1','A']);
  if(o.slot2){if(conduit(o.slot2,o.s2))cond.push(['TR','S2']);cond.push(['S2','B']);}else cond.push(['TR','B']);
  if(o.pont&&o.planche&&pontConduit(o.pont))cond.push([a,b]);
  if(o.courtPile)cond.push(['TL','TR']);
  if(o.lampe!=='absente')ch.push({id:'lampe',a:a,b:b,ok:o.lampe!=='grillee'});
  return {pile:{plus:o.inverse?'TL':'TR',moins:o.inverse?'TR':'TL',ok:o.pile!=='usee'},conducteurs:cond,charges:ch};
}
/* applique la protection : si un court-circuit passe par un fusible intact ou un disjoncteur enclenché, il s'ouvre, puis on recalcule */
function etatBoucle(o){
  var r=resoudre(reseau(o)),o2=o,prot=null;
  if(r.courtCircuit){
    ['slot1','slot2'].forEach(function(k){
      var kind=o[k],sk=k==='slot1'?'s1':'s2';
      if(prot||!(kind==='fusible'||kind==='disj'))return;
      var s=o[sk]||{};if(kind==='fusible'&&s.fondu||kind==='disj'&&s.declenche)return;
      var cp=JSON.parse(JSON.stringify(o)),st=cp[sk]||(cp[sk]={});
      if(kind==='fusible')st.fondu=true;else st.declenche=true;
      if(!resoudre(reseau(cp)).courtCircuit){prot={type:kind};o2=cp;r=resoudre(reseau(cp));}
    });}
  var lampe=r.charges.lampe||'absente',sens=o.inverse?-1:1;
  var chaud=r.courtCircuit?'fort':(prot?'coupe':'aucun'),niveau=r.courtCircuit?(o.duree?echauffement(true,o.duree):3):0;
  return {r:r,o:o2,lampe:lampe,moteur:r.charges.moteur||'absent',courtCircuit:r.courtCircuit,protection:prot,echauffement:chaud,niveau:niveau,sens:sens,
          boucleFermee:lampe==='actif'||r.charges.moteur==='actif'};
}
/* échelle qualitative d'échauffement d'un fil parcouru par un courant de défaut, selon la durée (1 brève, 2 moyenne, 3 longue). 0 = aucun. */
function echauffement(court,duree){return court?Math.max(1,Math.min(3,duree|0)):0;}

/* commutateur à deux lampes (ELE-10) */
function reseauCommut(o){
  return {pile:{plus:'TR',moins:'TL',ok:true},conducteurs:[['TL','C'],['C',o.pos===2?'T2':'T1'],['TR','B']],
    charges:[{id:'L1',a:'T1',b:'B'},{id:'L2',a:'T2',b:'B'}]};}
function etatCommut(o){var r=resoudre(reseauCommut(o));return {L1:r.charges.L1,L2:r.charges.L2,r:r};}
/* va-et-vient (ELE-11) : deux commutateurs reliés par deux fils */
function reseauVV(o){
  return {pile:{plus:'TR',moins:'TL',ok:true},conducteurs:[['TL','C1'],['C1',o.p1===2?'a2':'a1'],['a1','b1'],['a2','b2'],['C2',o.p2===2?'b2':'b1']],
    charges:[{id:'lampe',a:'C2',b:'TR'}]};}
function etatVV(o){var r=resoudre(reseauVV(o));return {lampe:r.charges.lampe,r:r};}

/* panne d'un circuit (ELE-16). causes : 'pile' | 'lampe' | 'inter' | 'fil'. actions : remplacements, retour à l'état initial, testeur */
var CAUSES={pile:'La pile est usée',lampe:'Le filament de la lampe est coupé',inter:'L’interrupteur est défectueux : son contact ne se ferme pas',fil:'Un fil est mal serré à la lampe'};
function optsPanne(cause,action){
  var o={pile:'ok',slot1:'inter',s1:{ferme:true,defaut:false},lampe:'ok',contactLache:false};
  if(cause==='pile')o.pile='usee';if(cause==='lampe')o.lampe='grillee';if(cause==='inter')o.s1.defaut=true;if(cause==='fil')o.contactLache=true;
  if(action==='pileNeuve')o.pile='ok';if(action==='lampeNeuve')o.lampe='ok';if(action==='interNeuf')o.s1.defaut=false;if(action==='serrer')o.contactLache=false;
  return o;}
/* résultat d'une action sur un circuit en panne. Remplacer ou serrer : on observe la lampe. Testeur de continuité : il dit si le courant peut passer
   dans l'élément testé (lampe, interrupteur fermé, fil). Lampe témoin : elle s'allume avec une pile en bon état. */
function panne(cause,action){
  var out={action:action,cause:cause};
  if(action==='testLampe'){out.testeur=cause!=='lampe';return out;}
  if(action==='testInter'){out.testeur=cause!=='inter';return out;}
  if(action==='testFil'){out.testeur=cause!=='fil';return out;}
  if(action==='testPile'){out.temoin=cause!=='pile';return out;}
  var e=etatBoucle(optsPanne(cause,action));out.allumee=e.lampe==='actif';return out;}

/* protection (ELE-15) : un défaut (fil sur la lampe) est appliqué ; on observe le dispositif choisi, puis la remise en service. */
function optsProtection(prot,remise){
  var o={pile:'ok',slot1:prot==='aucune'?null:prot,s1:{},lampe:'ok',planche:true,pont:'fil'};
  if(remise==='retire'||remise==='remet'){
    o.pont=null;
    if(prot==='fusible')o.s1.fondu=remise==='retire';
    if(prot==='disj')o.s1.declenche=remise==='retire';
  }
  return o;}
function protection(prot,remise){
  var e=etatBoucle(optsProtection(prot,remise));return {etat:e,lampe:e.lampe,courtCircuit:e.courtCircuit,protection:e.protection,echauffement:e.echauffement};}

/* ====================== 2. symboles et dessins ====================== */
function T(x,y,t,s,c,w,an){return A.T(x,y,t,s,c,w,an);}
/* ---- objets réalistes à deux contacts en (x±24,y) ---- */
function base2(x,y){return '<rect x="'+(x-34)+'" y="'+(y-10)+'" width="68" height="20" rx="8" fill="#EEF2FA" stroke="#9FB0C4"/><circle cx="'+(x-24)+'" cy="'+y+'" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="'+(x+24)+'" cy="'+y+'" r="6" fill="#B7BDC7" stroke="#6b7480"/>';}
function poussoirReel(x,y,type,appui){var closed=type==='pousseNF'?!appui:!!appui;
  return base2(x,y)+(closed?'<path d="M'+(x-24)+' '+y+' H'+(x+24)+'" stroke="#C99A1E" stroke-width="5" stroke-linecap="round"/>':'<path d="M'+(x-24)+' '+y+' L'+(x-2)+' '+(y-8)+'" stroke="#C99A1E" stroke-width="5" stroke-linecap="round"/>')
   +'<path d="M'+x+' '+(y-(appui?7:17))+' V'+(y-3)+'" stroke="#6b7480" stroke-width="3"/><rect x="'+(x-10)+'" y="'+(y-(appui?19:29))+'" width="20" height="12" rx="6" fill="#E0342F" stroke="#9C241F"/>'
   +T(x,y+27,type==='pousseNF'?'fermé au repos':'ouvert au repos',11,A.CLAIR,700);}
function fusibleReel(x,y,fondu){
  return base2(x,y)+'<rect x="'+(x-20)+'" y="'+(y-13)+'" width="40" height="26" rx="13" fill="#E8F4FB" fill-opacity=".85" stroke="#7FA6C4" stroke-width="2"/>'
   +(fondu?'<path d="M'+(x-20)+' '+y+' H'+(x-6)+' M'+(x+6)+' '+y+' H'+(x+20)+'" stroke="#C99A1E" stroke-width="3"/><circle cx="'+x+'" cy="'+y+'" r="7" fill="#5B534B" opacity=".55"/>'
          :'<path d="M'+(x-20)+' '+y+' H'+(x+20)+'" stroke="#C99A1E" stroke-width="2.2"/>')
   +T(x,y+27,fondu?'fusible fondu':'fusible',11,A.CLAIR,700);}
function disjReel(x,y,decl){
  return base2(x,y)+'<rect x="'+(x-20)+'" y="'+(y-28)+'" width="40" height="46" rx="7" fill="#F4F6FA" stroke="#7B8AA3" stroke-width="2"/><rect x="'+(x-6)+'" y="'+(decl?y-14:y-25)+'" width="12" height="16" rx="3" fill="'+(decl?'#E0342F':'#3A4560')+'"/>'
   +T(x,y+34,decl?'disjoncteur déclenché':'disjoncteur',11,A.CLAIR,700);}
/* commutateur : commun à gauche (flip : à droite), deux sorties en haut et en bas de l'autre côté ; pos = 1 ou 2 */
function commutReel(x,y,pos,flip,nom){var c=flip?24:-24,t=flip?-24:24,yy=pos===2?18:-18;
  return '<rect x="'+(x-30)+'" y="'+(y-30)+'" width="60" height="60" rx="10" fill="#EEF2FA" stroke="#9FB0C4"/><circle cx="'+(x+c)+'" cy="'+y+'" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="'+(x+t)+'" cy="'+(y-18)+'" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="'+(x+t)+'" cy="'+(y+18)+'" r="6" fill="#B7BDC7" stroke="#6b7480"/>'
   +'<path d="M'+(x+c)+' '+y+' L'+(x+t)+' '+(y+yy)+'" stroke="#C99A1E" stroke-width="5" stroke-linecap="round"/>'+(nom?T(x,y+46,nom,12,A.CLAIR,700):'');}
function organeReel(kind,s,x,y){s=s||{};
  if(kind==='inter')return A.interM(x,y,!!s.ferme,'').g;
  if(kind==='pousseNO'||kind==='pousseNF')return poussoirReel(x,y,kind,!!s.appui);
  if(kind==='fusible')return fusibleReel(x,y,!!s.fondu);
  if(kind==='disj')return disjReel(x,y,!!s.declenche);
  return '';}
/* module du banc pour un organe : douilles (x∓30, y) pour l'interrupteur, (x∓24, y) pour les autres */
function organeM(kind,st,x,y){var d=kind==='inter'?30:24;return {g:organeReel(kind,st,x,y),L:[x-d,y],R:[x+d,y]};}
/* planche d'essai branchée aux bornes de la lampe : deux douilles en (x∓22, y) ; l'objet posé ou le fil les relie */
function plancheM(x,y,pont){var m=pont?materiau(pont):null,g=A.douille?'':'';
  g='<ellipse cx="'+x+'" cy="'+(y+16)+'" rx="48" ry="6" fill="#1F2B44" opacity=".16"/><rect x="'+(x-35)+'" y="'+(y-13)+'" width="70" height="26" rx="5" fill="#E9EEF6" stroke="#9FB0C4" stroke-width="2"/>';
  if(m&&pont!=='fil')g+='<rect x="'+(x-22)+'" y="'+(y-5)+'" width="44" height="10" rx="4" fill="'+m.couleur+'" stroke="#1B2540" stroke-opacity=".45" stroke-width="1.5"/>';
  g+=A.douille(x-22,y)+A.douille(x+22,y);
  if(pont==='fil'){var k=A.cab([x-22,y],1,[x+22,y],-1,m.couleur,{k:30,sansA:true,sansB:true});g+=k.svg;}
  g+=T(x,y+34,m?m.nom:'bornes nues, rien entre elles',11,A.CLAIR,700);
  return {g:g,L:[x-22,y],R:[x+22,y]};}
var NIVEAUX=['aucun','chaud','très chaud','la gaine fond : danger'];
function jauge(x,y,n,txt){var cols=['#E0A800','#F97316','#E0342F'],g='<rect x="'+x+'" y="'+y+'" width="184" height="38" rx="9" fill="#fff" stroke="#9FB0C4"/>',i,h;
  for(i=0;i<3;i++){h=9+i*6;g+='<rect x="'+(x+10+i*14)+'" y="'+(y+30-h)+'" width="10" height="'+h+'" rx="2" fill="'+(i<n?cols[i]:'#E3E8F0')+'"/>';}
  return g+T(x+58,y+15,'Échauffement',11,'#46536B',700,'start')+T(x+58,y+30,txt,11,INK,800,'start');}

/* ---- montage réaliste en boucle ---- */
function montageBoucle(o,e){
  /* banc d'essai : modules à deux douilles en anneau (pile en haut, − à gauche, + à droite), reliés par des câbles à fiches */
  var s='',rev=!o.cache,inv=!!o.inverse,s1=o.slot1,s2=o.slot2,lampOn=e.lampe==='actif',oo=e.o,on1=oo.s1||{},on2=oo.s2||{},hot=e.courtCircuit,lache=!!(o.contactLache&&rev),
      defs=[{t:'pile'}],i;
  if(s1)defs.push({t:'s1'});if(o.moteur)defs.push({t:'moteur'});if(s2)defs.push({t:'s2'});defs.push({t:'lampe'});
  var pos=A.ring(defs.length,300,175,225,100),mods=[],P,lampM,planM=null,moteurPos=null;
  defs.forEach(function(d,k){var x=pos[k][0],y=pos[k][1],m;
    if(d.t==='pile')m=A.pileM(x,y,{inv:inv,fail:o.pile==='usee'&&rev});
    else if(d.t==='s1')m=organeM(s1,rev?on1:{ferme:on1.ferme,fondu:on1.fondu,declenche:on1.declenche,appui:on1.appui},x,y);
    else if(d.t==='s2')m=organeM(s2,on2,x,y);
    else if(d.t==='moteur'){m=A.moteurM(x,y,e.moteur==='actif',e.moteur==='actif'?e.sens:0);}
    else m=A.lampeM(x,y,lampOn,{grille:o.lampe==='grillee'&&rev});
    d.m=m;mods.push(m);if(d.t==='pile')P=m;if(d.t==='lampe')lampM=m;});
  if(o.planche)planM=plancheM(lampM.L[0]+22,lampM.L[1]+78,o.pont);
  var ch=A.chaine(mods).cables,cols=[],n=ch.length;
  for(i=0;i<n;i++)cols.push(i===0?(inv?A.CK:A.CR):i===n-1?(inv?A.CR:A.CK):(i%2?A.CK:A.CR));
  defs.forEach(function(d){if(d.t==='lampe'&&o.lampe==='absente')s+=A.absentM(d.m.L[0]+22,d.m.L[1]-20,90,100,'lampe absente');else s+=d.m.g;});
  if(planM)s+=planM.g;
  var cl=[];ch.forEach(function(k,j){var b=k.b,sansB=false;
    if(lache&&j===n-2){b=[k.b[0]+k.db*40,k.b[1]-36];sansB=true;}
    var c=A.cab(k.a,k.da,b,k.db,cols[j],{sansB:sansB});s+=c.svg;cl.push(c.d);});
  if(planM){s+=A.cab(lampM.L,-1,planM.L,-1,A.CK,{k:40}).svg+A.cab(lampM.R,1,planM.R,1,A.CR,{k:40}).svg;}
  if(o.courtPile){var a0=P.R,b0=P.L,dd='M'+a0[0]+' '+a0[1]+' C'+(a0[0]+10)+' '+(a0[1]-70)+' '+(b0[0]-10)+' '+(b0[1]-70)+' '+b0[0]+' '+b0[1];
    s+='<path d="'+dd+'" fill="none" stroke="#0A0F1A" stroke-opacity=".55" stroke-width="8" stroke-linecap="round" transform="translate(1.5 3)"/><path d="'+dd+'" fill="none" stroke="#F97316" stroke-width="5" stroke-linecap="round"/>';}
  if(lache){var kk=ch[n-2],bx=kk.b[0]+kk.db*40,by=kk.b[1]-36;s+='<path d="M'+(bx-8)+' '+(by-8)+' l16 16 M'+(bx+8)+' '+(by-8)+' l-16 16" stroke="#D9423B" stroke-width="3.5" stroke-linecap="round"/>'+T(bx+16,by+4,'fil mal serré',11,'#D9423B',700,'start');}
  if(o.pile==='usee'&&rev)s+=T(P.R[0]-8,P.R[1]-12,'pile usée',12,'#D9423B',800);
  if(hot)ch.forEach(function(k,j){s+='<path d="'+cl[j]+'" fill="none" stroke="#FF5A2E" stroke-width="13" opacity=".22" stroke-linecap="round"/>';});
  if(!o.cache)s+=jauge(352,6,e.niveau,e.echauffement==='coupe'?'évité : coupé':NIVEAUX[e.niveau]);
  var tot=o.moteur?'moteur '+(e.moteur==='actif'?'en marche':'à l’arrêt')+' et lampe '+(lampOn?'allumée':'éteinte'):'';
  var lab='Montage sur le banc : '+(e.courtCircuit?'court-circuit, la lampe est éteinte, échauffement fort':(o.moteur?tot:(o.lampe==='absente'?'sans lampe':(lampOn?'la lampe brille':'la lampe est éteinte'))))
    +(e.protection?' ; '+(e.protection.type==='fusible'?'le fusible a fondu, le circuit est coupé':'le disjoncteur s’est déclenché, le circuit est coupé'):'')
    +(o.pile==='usee'?' ; pile usée':'')+(o.lampe==='grillee'?' ; filament coupé':'');
  if(o.cache)lab='Montage sur le banc : '+(lampOn?'la lampe brille':'la lampe est éteinte');
  return A.svgBanc(s,'0 0 600 '+(planM?'420':'330'),lab);}

/* ---- symboles normalisés verticaux, centrés en (x,y), contacts en y±22 ---- */
function symV(kind,s,x,y){s=s||{};var d='<circle cx="'+x+'" cy="'+(y-22)+'" r="3.5" fill="'+INK+'"/><circle cx="'+x+'" cy="'+(y+22)+'" r="3.5" fill="'+INK+'"/>',st='stroke="'+INK+'" stroke-width="2.5" fill="none"';
  var ferme=conduit(kind,s);
  if(kind==='inter')return A.symbole(ferme?'interFerme':'interOuvert',x,y);
  if(kind==='pousseNO'||kind==='pousseNF'){var closed=ferme,pr=!!s.appui;
    return d+(closed?'<path d="M'+x+' '+(y+22)+' V'+(y-22)+'" '+st+'/>':'<path d="M'+x+' '+(y+22)+' L'+(x+16)+' '+(y-14)+'" '+st+'/>')
      +'<path d="M'+(x+8)+' '+(y+4)+' H'+(x+(pr?20:30))+'" '+st+'/><path d="M'+(x+(pr?20:30))+' '+(y-3)+' V'+(y+11)+'" '+st+'/>';}
  if(kind==='fusible')return '<path d="M'+x+' '+(y-22)+' V'+(y-16)+' M'+x+' '+(y+16)+' V'+(y+22)+'" '+st+'/><rect x="'+(x-8)+'" y="'+(y-16)+'" width="16" height="32" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'
      +(s.fondu?'<path d="M'+x+' '+(y-16)+' V'+(y-4)+' M'+x+' '+(y+4)+' V'+(y+16)+'" '+st+'/><path d="M'+(x-6)+' '+(y-3)+' L'+(x+6)+' '+(y+3)+'" stroke="#B33A2E" stroke-width="2.5"/>':'<path d="M'+x+' '+(y-16)+' V'+(y+16)+'" '+st+'/>');
  if(kind==='disj')return d+(ferme?'<path d="M'+x+' '+(y+22)+' V'+(y-22)+'" '+st+'/>':'<path d="M'+x+' '+(y+22)+' L'+(x+16)+' '+(y-14)+'" '+st+'/>')+'<rect x="'+(x+8)+'" y="'+(y-8)+'" width="16" height="16" fill="#fff" stroke="'+INK+'" stroke-width="2"/>'+T(x+16,y+5,'D',12,INK,800);
  return '';}
function rot(g,x,y){return '<g transform="rotate(90 '+x+' '+y+')">'+g+'</g>';}
function pileSym(inv){var X0=100,Y0=40,CX=220,l=inv?CX-8:CX+8,c=inv?CX+8:CX-8,g=inv?'+':'−',dr=inv?'−':'+';
  return '<path d="M'+l+' '+(Y0-16)+' V'+(Y0+16)+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+c+' '+(Y0-9)+' V'+(Y0+9)+'" stroke="'+INK+'" stroke-width="6"/>'
   +T(CX-22,Y0-12,g,16,g==='+'?'#C03A2E':'#2B5EA8',800)+T(CX+22,Y0-12,dr,16,dr==='+'?'#C03A2E':'#2B5EA8',800);}
function schemaBoucle(o,e){
  var prevu=!!o.cache;
  if(o.cache){var sain=JSON.parse(JSON.stringify(o));sain.cache=false;sain.pile='ok';sain.lampe='ok';sain.contactLache=false;sain.s1={ferme:true};e=etatBoucle(sain);o=sain;}
  var X0=100,X1=340,Y0=40,Y1=160,CX=220,st='fill="none" stroke="'+INK+'" stroke-width="2.5"',s='',oo=e.o,lampOn=e.lampe==='actif';
  s+='<path d="M'+X0+' '+Y0+' H'+(CX-20)+' M'+(CX+20)+' '+Y0+' H'+X1+'" '+st+'/>'+pileSym(o.inverse);
  /* gauche : organe 1 ou fil ; la boucle passe par S1 */
  if(o.slot1)s+='<path d="M'+X0+' '+Y0+' V78 M'+X0+' 122 V'+Y1+'" '+st+'/>'+symV(o.slot1,oo.s1,X0,100);else s+='<path d="M'+X0+' '+Y0+' V'+Y1+'" '+st+'/>';
  /* droite : lampe (cercle croisé) ; absente = pointillé */
  if(o.lampe==='absente')s+='<path d="M'+X1+' '+Y0+' V'+Y1+'" '+st+'/>';
  else s+='<path d="M'+X1+' '+Y0+' V83 M'+X1+' 117 V'+Y1+'" '+st+'/>'+(lampOn?'<circle cx="'+X1+'" cy="100" r="25" fill="#FFE27A" opacity=".55"/>':'')+A.symbole('lampe',X1,100)+(o.lampe==='grillee'?T(X1+30,104,'coupé',11,'#B33A2E',700,'start'):'');
  /* bas : fil, organe 2 ou moteur */
  if(o.moteur)s+='<path d="M'+X0+' '+Y1+' H'+(CX-17)+' M'+(CX+17)+' '+Y1+' H'+X1+'" '+st+'/>'+A.symbole('moteur',CX,Y1);
  else if(o.slot2)s+='<path d="M'+X0+' '+Y1+' H'+(CX-22)+' M'+(CX+22)+' '+Y1+' H'+X1+'" '+st+'/>'+rot(symV(o.slot2,oo.s2,CX,Y1),CX,Y1);
  else s+='<path d="M'+X0+' '+Y1+' H'+X1+'" '+st+'/>';
  if(o.pile==='usee')s+=T(CX,Y0-26,'pile usée',12,'#B33A2E',800);
  /* pont autour de la lampe : fil ou objet posé entre les deux bornes */
  if(o.planche){var m=o.pont?materiau(o.pont):null;
    s+='<circle cx="'+X1+'" cy="'+Y0+'" r="3.5" fill="'+INK+'"/><circle cx="'+X1+'" cy="'+Y1+'" r="3.5" fill="'+INK+'"/>';
    s+=m?'<path d="M'+X1+' '+Y0+' H'+(X1+52)+' V'+Y1+' H'+X1+'" fill="none" stroke="'+(m.conducteur?INK:'#9FB0C4')+'" stroke-width="'+(m.conducteur?3.5:2.5)+'" stroke-dasharray="'+(m.conducteur?'':'5 5')+'"/>'+T(X1+58,104,m.nom,11,'#46536B',700,'start'):T(X1+58,104,'bornes libres',11,'#46536B',700,'start');}
  if(o.courtPile)s+='<path d="M'+(CX-20)+' '+Y0+' V'+(Y0-24)+' H'+(CX+20)+' V'+Y0+'" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round"/><circle cx="'+(CX-20)+'" cy="'+Y0+'" r="3.5" fill="'+INK+'"/><circle cx="'+(CX+20)+'" cy="'+Y0+'" r="3.5" fill="'+INK+'"/>';
  var txt=prevu?'Montage prévu : pile, interrupteur fermé, lampe':e.courtCircuit?'Court-circuit : un chemin sans lampe relie les bornes de la pile':(e.protection?'La protection a coupé le circuit':(e.boucleFermee?'Boucle fermée':'Boucle ouverte'));
  var lab=prevu?'Schéma normalisé du montage prévu : pile, interrupteur fermé, lampe':'Schéma normalisé : '+(e.courtCircuit?'court-circuit':(e.boucleFermee?'boucle fermée':'boucle ouverte'))+(e.protection?', protection ouverte':'');
  return A.svg(s+T(CX,193,txt,13,'#46536B',700),'0 0 520 200',lab);}
/* sens de rotation du moteur (ELE-06) : la flèche courbe est dessinée sur le moteur du banc */
function montageMoteur(o,e){var svg=montageBoucle(o,e);
  if(e.moteur!=='actif')return svg;
  var sens=e.sens>0?'dans le sens des aiguilles d’une montre':'dans le sens inverse des aiguilles d’une montre';
  return svg.replace(/aria-label="Montage sur le banc : [^"]*"/,function(m){return m.slice(0,-1)+' ; le moteur tourne '+sens+'"';});}

/* ---- commutateur et deux lampes (ELE-10) ---- */
function montageCommut(o,e){var s='',p=o.pos===2?2:1,P=A.pileM(395,55),L1=A.lampeM(410,175,e.L1==='actif'),L2=A.lampeM(410,295,e.L2==='actif'),kx=95,ky=215,
      com=[kx-24,ky],o1=[kx+24,ky-18],o2=[kx+24,ky+18];
  /* banc : pile en haut ; commutateur à gauche ; lampe 1 et lampe 2 à droite */
  s+=L1.g+L2.g+P.g+commutReel(kx,ky,p,false,'commutateur')+T(410,175+36,'Lampe 1',12,A.CLAIR,700)+T(410,295+36,'Lampe 2',12,A.CLAIR,700);
  s+=A.cab(P.L,-1,com,-1,A.CK).svg+A.cab(o1,1,L1.L,-1,A.CK).svg+A.cab(o2,1,L2.L,-1,A.CK).svg+A.cab(L2.R,1,L1.R,1,A.CR,{k:50}).svg+A.cab(L1.R,1,P.R,1,A.CR).svg;
  var lab='Montage sur le banc : commutateur en position '+p+' ; '+(e.L1==='actif'?'la lampe 1 brille et la lampe 2 est éteinte':'la lampe 2 brille et la lampe 1 est éteinte');
  return A.svgBanc(s,'0 0 520 350',lab);}
function symCommut(x,y,pos,flip){var c=flip?x+40:x,t=flip?x:x+40,yy=pos===2?24:-24,dot=function(a,b){return '<circle cx="'+a+'" cy="'+b+'" r="3.5" fill="'+INK+'"/>';};
  return dot(c,y)+dot(t,y-24)+dot(t,y+24)+'<path d="M'+c+' '+y+' L'+t+' '+(y+yy)+'" stroke="'+INK+'" stroke-width="2.5" fill="none"/>';}
function schemaCommut(o,e){var st='fill="none" stroke="'+INK+'" stroke-width="2.5"',p=o.pos===2?2:1,X1=340,s='';
  s+='<path d="M100 40 H200 M240 40 H'+X1+' V70" '+st+'/>'+pileSym(false)+'<path d="M100 40 V100 H110" '+st+'/>'+symCommut(110,100,p,false);
  s+='<path d="M150 76 H225" '+st+'/><path d="M150 124 H225" '+st+'/>'+A.symbole('lampe',242,76)+A.symbole('lampe',242,124)+'<path d="M259 76 H'+X1+' M259 124 H'+X1+' M'+X1+' 70 V124" '+st+'/>';
  if(e.L1==='actif')s+='<circle cx="242" cy="76" r="25" fill="#FFE27A" opacity=".55"/>'+A.symbole('lampe',242,76);else s+='<circle cx="242" cy="124" r="25" fill="#FFE27A" opacity=".55"/>'+A.symbole('lampe',242,124);
  s+=T(190,69,'L1',12,'#46536B',700)+T(190,117,'L2',12,'#46536B',700);
  return A.svg(s+T(220,193,'Une seule boucle est fermée : position '+p,13,'#46536B',700),'0 0 440 200','Schéma normalisé : commutateur en position '+p+', '+(e.L1==='actif'?'boucle de la lampe 1 fermée':'boucle de la lampe 2 fermée'));}

/* ---- va-et-vient (ELE-11) ---- */
function montageVV(o,e){var s='',p1=o.p1===2?2:1,p2=o.p2===2?2:1,on=e.lampe==='actif',P=A.pileM(270,60),Lp=A.lampeM(125,185,on),
      k2x=450,k2y=185,k1x=270,k1y=290,c2=[k2x+24,k2y],a2=[k2x-24,k2y-18],b2=[k2x-24,k2y+18],c1=[k1x-24,k1y],a1=[k1x+24,k1y-18],b1=[k1x+24,k1y+18];
  /* banc : pile en haut, commutateur 2 à droite, commutateur 1 en bas, lampe à gauche */
  s+=Lp.g+P.g+commutReel(k2x,k2y,p2,true,'commutateur 2')+commutReel(k1x,k1y,p1,false,'commutateur 1');
  s+=A.cab(P.R,1,c2,1,A.CR).svg+A.cab(a2,-1,a1,1,A.CK).svg+A.cab(b2,-1,b1,1,A.CK).svg+A.cab(c1,-1,Lp.R,1,A.CK).svg+A.cab(Lp.L,-1,P.L,-1,A.CK).svg;
  return A.svgBanc(s,'0 0 540 360','Montage sur le banc : commutateur 1 en position '+p1+', commutateur 2 en position '+p2+' ; '+(on?'la lampe brille':'la lampe est éteinte'));}
function schemaVV(o,e){var st='fill="none" stroke="'+INK+'" stroke-width="2.5"',p1=o.p1===2?2:1,p2=o.p2===2?2:1,on=e.lampe==='actif',s='';
  s+='<path d="M100 40 H200 M240 40 H410 V54" '+st+'/>'+pileSym(false)+'<path d="M100 40 V100 H110" '+st+'/>'+symCommut(110,100,p1,false)
   +'<path d="M150 76 H290 M150 124 H290" '+st+'/>'+symCommut(290,100,p2,true)+'<path d="M330 100 H410 V87" '+st+'/>'
   +(on?'<circle cx="410" cy="70" r="25" fill="#FFE27A" opacity=".55"/>':'')+A.symbole('lampe',410,70)+T(130,58,'K1',12,'#46536B',700)+T(310,58,'K2',12,'#46536B',700);
  return A.svg(s+T(260,193,on?'Boucle fermée':'Boucle ouverte',13,'#46536B',700),'0 0 460 200','Schéma normalisé : K1 en position '+p1+', K2 en position '+p2+', '+(on?'boucle fermée':'boucle ouverte'));}

/* construit montage + schéma ensemble */
function boucle(o){var e=etatBoucle(o);return {etat:e,montage:o.moteur?montageMoteur(o,e):montageBoucle(o,e),schema:schemaBoucle(o,e)};}
function commut(o){var e=etatCommut(o);return {etat:e,montage:montageCommut(o,e),schema:schemaCommut(o,e)};}
function vaetvient(o){var e=etatVV(o);return {etat:e,montage:montageVV(o,e),schema:schemaVV(o,e)};}


/* ====================== 3. interface commune des fiches ======================
   bloc(panel,X,cfg) : montage + schéma côte à côte, contrôles à boutons radio (un seul changement à la fois), zone d'observation, table des essais.
   cfg : {n, titre, intro, controles:[{cle,legende,items:[[valeur,libellé]]}], render(v)→{montage,schema,txt,essai}, F:()=>fiche, legendeTable, saisie} */
function bloc(panel,X,cfg){
  var h=window.Activite.h,esc=window.Activite.esc,st=X.st(),sec=h('div',{class:'card'},panel),pre='ci'+cfg.n+'-';
  h('h3',{text:cfg.titre},sec);h('p',{text:cfg.intro},sec);
  var fig=A.paire(sec,h);
  cfg.controles.forEach(function(c){
    var f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;min-width:0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,esc(c.legende));
    c.items.forEach(function(it,i){h('label',{class:'opt',style:'flex:1 1 min(100%,230px);min-width:0;margin:0'},f,'<input type="radio" name="'+pre+c.cle+'" value="'+it[0]+'"'+(i===0?' checked':'')+'><span>'+esc(it[1])+'</span>');});});
  var S=A.saisie(sec,h,pre+'obs',cfg.saisie||'J’observe que…');
  var res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);var table=h('div',{style:'overflow-x:auto;max-width:100%'},res);
  function vals(){var v={};cfg.controles.forEach(function(c){var r=sec.querySelector('input[name='+pre+c.cle+']:checked');v[c.cle]=r?r.value:c.items[0][0];});return v;}
  var cur=null;
  function maj(){cur=cfg.render(vals());fig.montage(cur.montage);fig.schema(cur.schema);S.out.textContent=cur.txt;}
  function paint(){var F=cfg.F();table.innerHTML=X.tableHTML(F,F.lignes(st),cfg.legendeTable||'Mes essais.');}
  sec.addEventListener('change',maj);
  S.btn.onclick=function(){
    if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
    X.addEssai(Object.assign({},cur.essai,{observation:S.note()}));paint();S.msg.textContent='Observation enregistrée.';S.vide();};
  h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
  maj();paint();return {maj:maj,paint:paint};}
function valides(st){return st.essais.filter(function(e){return typeof e.observation==='string'&&e.observation.trim().length>=10;});}

window.NohobaCommande=Object.freeze({bloc:bloc,valides:valides,optsProtection:optsProtection,resoudre:resoudre,conduit:conduit,reseau:reseau,etatBoucle:etatBoucle,echauffement:echauffement,etatCommut:etatCommut,etatVV:etatVV,
  panne:panne,optsPanne:optsPanne,causes:CAUSES,protection:protection,materiau:materiau,pontConduit:pontConduit,boucle:boucle,commut:commut,vaetvient:vaetvient});
})();
