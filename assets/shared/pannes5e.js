/* Pannes et court-circuit de 5e (lot PAN, fiches NL-5E-PAN-01 à 03) : modèle qualitatif testable NohobaPannes5e, montages au style banc d'essai et schémas normalisés.
   Deux lampes identiques L1 et L2 sur une pile de 4,5 V. Valeurs et éclats de simulation : dans la réalité, un court-circuit fait chauffer les fils et use la pile très vite. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,CR=A.CR,CK=A.CK,INK='#243049',VT='#15803D',RG='#D9423B',N={};
  function dans(l,v,q){if(l.indexOf(v)<0)throw new Error(q+' inconnu : '+v);}
  N.MODES=[['serie','En série'],['derivation','En dérivation']];
  N.CIBLES=[['aucune','Aucune'],['L1','L1'],['L2','L2']];
  /* PAN-01 : une lampe en panne (filament coupé ou lampe dévissée) ouvre sa branche */
  N.panne=function(mode,cible){dans(['serie','derivation'],mode,'montage');dans(['aucune','L1','L2'],cible,'lampe');
    var s=mode==='serie',ok=cible==='aucune',o={L1:{on:s?ok:cible!=='L1',k:s?.5:1},L2:{on:s?ok:cible!=='L2',k:s?.5:1}};
    function m(n){return cible===n?'en panne':!o[n].on?'éteinte':s?'allumée, faiblement':'allumée, normalement';}
    o.txt='L1 : '+m('L1')+' ; L2 : '+m('L2')+'.';return o;};
  /* PAN-02 : un fil relie les deux bornes d'une lampe (court-circuit de la lampe) */
  N.courtCircuit=function(mode,cible){dans(['serie','derivation'],mode,'montage');dans(['aucune','L1','L2'],cible,'lampe');
    var s=mode==='serie',cc=cible!=='aucune',o={generateur:!s&&cc,L1:{on:s?cible!=='L1':!cc,k:s?(cc?1:.5):1},L2:{on:s?cible!=='L2':!cc,k:s?(cc?1:.5):1}};
    function m(n){return cible===n?'court-circuitée, éteinte':!o[n].on?'éteinte':s?(cc?'brille plus fort':'allumée, faiblement'):'allumée, normalement';}
    o.txt='L1 : '+m('L1')+' ; L2 : '+m('L2')+'.'+(o.generateur?' Le générateur est en court-circuit : danger.':'');return o;};
  /* PAN-03 : besoins et montage qui convient */
  N.BESOINS=[['independantes','Si une lampe tombe en panne, l’autre doit rester allumée'],['eclat','Les deux lampes doivent briller normalement'],['temoin','Si une lampe tombe en panne, l’autre doit s’éteindre pour signaler la panne']];
  N.convient=function(besoin,mode){dans(N.BESOINS.map(function(b){return b[0];}),besoin,'besoin');dans(['serie','derivation'],mode,'montage');return besoin==='temoin'?mode==='serie':mode==='derivation';};
  /* ---------- dessins ---------- */
  function fil(d,col){return '<path d="'+d+'" fill="none" stroke="#1F2B44" stroke-opacity=".16" stroke-width="6" stroke-linecap="round" transform="translate(1.5 3)"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="4.2" stroke-linecap="round"/>';}
  function bout(x,y,col){return '<circle cx="'+x+'" cy="'+y+'" r="6" fill="'+col+'" stroke="#1B2540" stroke-width="1.3"/>';}
  /* e : état {L1,L2,generateur} ; opt : {panne:'L1'|'L2', cc:'L1'|'L2'} */
  function montage(mode,e,opt,label){
    var s=mode==='serie',pos=s?{P:[280,78],L1:[475,205],L2:[280,345]}:{P:[150,95],L1:[440,200],L2:[440,340]},P=A.pileM(pos.P[0],pos.P[1]),L={},g,cb;
    ['L1','L2'].forEach(function(n){L[n]=A.lampeM(pos[n][0],pos[n][1],e[n].on,{k:e[n].k,grille:opt.panne===n});});
    cb=s?[[P.R,1,L.L1.R,1,CR],[L.L1.L,-1,L.L2.R,1,CK],[L.L2.L,-1,P.L,-1,CK]]:[[P.R,1,L.L1.R,1,CR],[L.L1.R,1,L.L2.R,1,CR],[P.L,-1,L.L1.L,-1,CK],[L.L1.L,-1,L.L2.L,-1,CK]];
    g=P.g+L.L1.g+L.L2.g+cb.map(function(k){return A.cab(k[0],k[1],k[2],k[3],k[4]).svg;}).join('');
    ['L1','L2'].forEach(function(n){var x=pos[n][0],y=pos[n][1];g+=T(x+58,y+6,n,18,INK,800,'start');
      if(opt.cc===n)g+=fil('M'+(x-22)+' '+y+' C'+(x-30)+' '+(y+62)+' '+(x+30)+' '+(y+62)+' '+(x+22)+' '+y,VT)+bout(x-22,y,VT)+bout(x+22,y,VT)+T(x,y+64,'fil ajouté',12,VT,800);});
    if(e.generateur)g+=T(pos.P[0],pos.P[1]+62,'Générateur en court-circuit',13,RG,800);
    return A.svgBanc(g,'0 0 560 425',label);}
  var ST='fill="none" stroke="'+INK+'" stroke-width="2.5"';
  function sLampe(x,y,n,panne,dx){return '<circle cx="'+x+'" cy="'+y+'" r="17" fill="#fff" stroke="'+INK+'" stroke-width="2.5"'+(panne?' stroke-dasharray="5 4"':'')+'/><path d="M'+(x-12)+' '+(y-12)+' L'+(x+12)+' '+(y+12)+' M'+(x+12)+' '+(y-12)+' L'+(x-12)+' '+(y+12)+'" '+ST+'/>'+T(x+(dx||0),y+(dx?5:-24),n,13,INK,800,dx?(dx<0?'end':'start'):'middle');}
  function pt(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+INK+'"/>';}
  function schema(mode,opt,label){
    var s=mode==='serie',g,sh='';
    if(s){g='<path d="M60 40 H212 M228 40 H380 V83 M380 117 V160 H237 M203 160 H60 V40" '+ST+'/><path d="M228 24 V56" stroke="'+INK+'" stroke-width="2.5"/><path d="M212 31 V49" stroke="'+INK+'" stroke-width="6"/>'+T(238,30,'+',14,'#C03A2E',800)
        +sLampe(380,100,'L1',opt.panne==='L1',-26)+sLampe(220,160,'L2',opt.panne==='L2');
      if(opt.cc==='L1')sh='M380 70 H424 V130 H380|380,70|380,130';if(opt.cc==='L2')sh='M180 160 V196 H260 V160|180,160|260,160';}
    else{g='<path d="M80 92 V40 H320 M80 108 V160 H320 M200 40 V83 M200 117 V160 M320 40 V83 M320 117 V160" '+ST+'/><path d="M64 92 H96" stroke="'+INK+'" stroke-width="2.5"/><path d="M70 108 H90" stroke="'+INK+'" stroke-width="6"/>'+T(52,90,'+',16,'#C03A2E',800)+T(52,120,'−',16,'#2B5EA8',800)
        +pt(200,40)+pt(200,160)+sLampe(200,100,'L1',opt.panne==='L1',-26)+sLampe(320,100,'L2',opt.panne==='L2',-26);
      if(opt.cc==='L1')sh='M200 66 H244 V134 H200|200,66|200,134';if(opt.cc==='L2')sh='M320 66 H364 V134 H320|320,66|320,134';}
    if(sh){sh=sh.split('|');g+='<path d="'+sh[0]+'" fill="none" stroke="'+VT+'" stroke-width="2.5"/>'+sh.slice(1).map(function(q){q=q.split(',');return pt(+q[0],+q[1]);}).join('');}
    return A.svg(g,'0 0 440 210',label);}
  function nomMode(m){return m==='serie'?'en série':'en dérivation';}
  N.vuePanne=function(mode,cible){var e=N.panne(mode,cible),o={panne:cible==='aucune'?null:cible};
    return {etat:e,montage:montage(mode,e,o,'Montage : pile de 4,5 V et deux lampes '+nomMode(mode)+(o.panne?' ; la lampe '+o.panne+' est en panne (filament coupé)':' ; aucune lampe en panne')+'. '+e.txt),
      schema:schema(mode,o,'Schéma normalisé : pile et deux lampes '+nomMode(mode)+(o.panne?' ; la lampe '+o.panne+', en panne, est en pointillés.':'.'))};};
  N.vueCC=function(mode,cible){var e=N.courtCircuit(mode,cible),o={cc:cible==='aucune'?null:cible};
    return {etat:e,montage:montage(mode,e,o,'Montage : pile de 4,5 V et deux lampes '+nomMode(mode)+(o.cc?' ; un fil relie les deux bornes de la lampe '+o.cc:' ; aucun fil ajouté')+'. '+e.txt),
      schema:schema(mode,o,'Schéma normalisé : pile et deux lampes '+nomMode(mode)+(o.cc?' ; un fil en dérivation aux bornes de '+o.cc+' la court-circuite.':'.'))};};
  window.NohobaPannes5e=N;
})();
