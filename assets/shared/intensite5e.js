/* Intensité et tension de 5e (lot INT, fiches NL-5E-INT-01, 02, 04 et NL-5E-TEN-01) : modèle testable NohobaIntensite5e, montages au style banc d'essai et schémas normalisés.
   Valeurs de simulation : piles idéales, lampes assimilées à des résistances constantes (L1 30 Ω, L2 45 Ω, moteur 25 Ω). Une vraie lampe n'a pas une résistance constante.
   Aucun calcul par la loi d'Ohm n'est demandé à l'élève (programme de 3e) : il lit des mesures. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,CR=A.CR,CK=A.CK,INK='#243049',OR='#F97316',BL='#0B6FA8',GR='#46536B',M={};
  function mA(v){return v+' mA';}
  function enA(v){return String(v/1000).replace('.',',')+' A';}
  function fv(x){return String(Math.round(x*10)/10).replace('.',',')+' V';}
  function dans(l,v,quoi){if(l.indexOf(v)<0)throw new Error(quoi+' inconnu : '+v);}
  M.mA=mA;M.enA=enA;M.fv=fv;

  /* ---------- modèle ---------- */
  M.UP=1.5;M.UG=4.5;M.R1=30;M.R2=45;M.REC={lampe:30,moteur:25};
  M.EFFETS={lampe:['La lampe brille très faiblement','La lampe brille faiblement','La lampe brille normalement'],moteur:['Le moteur tourne lentement','Le moteur tourne plus vite','Le moteur tourne vite']};
  /* INT-01 : n piles de 1,5 V en série (même sens) et un récepteur */
  M.notion=function(n,rec){dans([1,2,3],n,'nombre de piles');dans(['lampe','moteur'],rec,'récepteur');
    return {i:Math.round(n*M.UP/M.REC[rec]*1000),niveau:n,effet:M.EFFETS[rec][n-1]};};
  /* INT-02 : pile 4,5 V, L1 et L2 en série ; l'ampèremètre est en série (trois places) ou, par erreur, en dérivation sur la pile */
  M.POS=[['avantL1','En série, entre la pile et L1'],['entre','En série, entre L1 et L2'],['apresL2','En série, après L2'],['derivation','En dérivation, aux bornes de la pile']];
  M.CAL=[['200mA','Calibre 200 mA'],['2A','Calibre 2 A']];
  M.mesure=function(pos,ferme,cal){dans(M.POS.map(function(p){return p[0];}),pos,'branchement');dans(['200mA','2A'],cal,'calibre');
    if(pos==='derivation')return {erreur:true,i:null,txt:'ERREUR'};
    var i=ferme?Math.round(M.UG/(M.R1+M.R2)*1000):0;return {erreur:false,i:i,txt:cal==='2A'?enA(i):mA(i)};};
  /* INT-04 : L1 et L2 en dérivation ; ampèremètre dans la branche principale (P), celle de L1 (1) ou celle de L2 (2) */
  M.PTS=[['P','Branche principale'],['1','Branche de L1'],['2','Branche de L2']];
  M.derivation=function(pt,ferme,l2){dans(['P','1','2'],pt,'point de mesure');
    var i1=ferme?Math.round(M.UG/M.R1*1000):0,i2=ferme&&l2?Math.round(M.UG/M.R2*1000):0;
    return {I:i1+i2,I1:i1,I2:i2,lu:pt==='P'?i1+i2:pt==='1'?i1:i2};};
  /* TEN-01 : tension aux bornes de la pile et de chaque lampe en dérivation */
  M.DIP=[['G','La pile'],['L1','La lampe L1'],['L2','La lampe L2']];M.GENS=[4.5,3];
  M.tensionDeriv=function(dip,U){dans(['G','L1','L2'],dip,'dipôle');dans(M.GENS,U,'générateur');return U;};

  /* ---------- dessins communs ---------- */
  function fil(d,col){return '<path d="'+d+'" fill="none" stroke="#1F2B44" stroke-opacity=".16" stroke-width="6" stroke-linecap="round" transform="translate(1.5 3)"/><path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="4.2" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.4" stroke-linecap="round" transform="translate(0 -1.2)"/>';}
  function bout(p,col){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+col+'" stroke="#1B2540" stroke-width="1.3"/>';}
  /* appareil de mesure sur socle noir, comme le voltmètre du banc : écran au centre, une borne de chaque côté (x∓70, y) */
  function bornesApp(x,y){var L=[x-70,y],R=[x+70,y];L.croc=R.croc=1;return {L:L,R:R};}
  function appareil(x,y,txt,nom,gl,dl,err){
    return '<ellipse cx="'+x+'" cy="'+(y+38)+'" rx="74" ry="6" fill="#1F2B44" opacity=".16"/><rect x="'+(x-70)+'" y="'+(y-34)+'" width="140" height="68" rx="12" fill="#2B3345" stroke="#1B2540" stroke-width="2"/>'
      +'<rect x="'+(x-54)+'" y="'+(y-25)+'" width="108" height="32" rx="6" fill="'+(err?'#3A1414':'#10241C')+'" stroke="'+(err?'#D9423B':'#2C5A47')+'"/>'+T(x,y-1,txt,21,err?'#FFB4AE':'#B9F6CE',800)
      +T(x,y+24,nom,11,'#C9D2E0',700)+T(x-62,y+25,gl,11,'#fff',800,'start')+T(x+62,y+25,dl,11,'#fff',800,'end');}
  var ST='fill="none" stroke="'+INK+'" stroke-width="2.5"';
  function sLampe(x,y,off){return '<circle cx="'+x+'" cy="'+y+'" r="17" fill="#fff" stroke="'+INK+'" stroke-width="2.5"'+(off?' stroke-dasharray="5 4"':'')+'/><path d="M'+(x-12)+' '+(y-12)+' L'+(x+12)+' '+(y+12)+' M'+(x+12)+' '+(y-12)+' L'+(x-12)+' '+(y+12)+'" '+ST+'/>';}
  function sApp(x,y,l,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||15)+'" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'+T(x,y+6,l,16,INK,800);}
  function sPt(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+INK+'"/>';}
  /* pile sur un fil horizontal, borne + à droite */
  function sPileH(c,y){return '<path d="M'+(c+8)+' '+(y-16)+' V'+(y+16)+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+(c-8)+' '+(y-9)+' V'+(y+9)+'" stroke="'+INK+'" stroke-width="6"/>'+T(c+18,y-11,'+',14,'#C03A2E',800);}
  /* pile sur un fil vertical, borne + en haut */
  function sPileV(x,y){return '<path d="M'+(x-16)+' '+(y-8)+' H'+(x+16)+'" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+(x-10)+' '+(y+8)+' H'+(x+10)+'" stroke="'+INK+'" stroke-width="6"/>'+T(x-28,y-6,'+',16,'#C03A2E',800)+T(x-28,y+20,'−',16,'#2B5EA8',800);}

  /* ---------- INT-01 ---------- */
  M.montageNotion=function(n,rec,amp){
    var e=M.notion(n,rec),x0=250-(n-1)*75,Ps=[],s='',i,R,ap,der;
    for(i=0;i<n;i++)Ps.push(A.pileM(x0+i*150,70,{txt:'1,5 V'}));
    R=rec==='lampe'?A.lampeM(amp?200:250,258,true,{k:[.3,.6,1][n-1]}):A.moteurM(amp?200:250,258,true,1);
    Ps.forEach(function(p){s+=p.g;});s+=R.g;der=Ps[n-1];
    for(i=0;i<n-1;i++)s+=A.cab(Ps[i].R,1,Ps[i+1].L,-1,CK,{k:34}).svg;
    if(amp){ap=bornesApp(470,215);s+=appareil(470,215,mA(e.i),'Ampèremètre','COM','mA');
      s+=A.cab(der.R,1,ap.R,1,CR).svg+A.cab(ap.L,-1,R.R,1,CR).svg;}
    else s+=A.cab(der.R,1,R.R,1,CR).svg;
    s+=A.cab(R.L,-1,Ps[0].L,-1,CK).svg+T(amp?200:250,316,rec==='lampe'?'Lampe':'Moteur',14,INK,800);
    return A.svgBanc(s,'0 0 660 335','Montage : '+n+(n===1?' pile':' piles')+' de 1,5 V en série et '+(rec==='lampe'?'une lampe':'un moteur')+(amp?', avec un ampèremètre en série qui indique '+mA(e.i):', sans ampèremètre')+'. '+e.effet+'.');};
  M.schemaNotion=function(n,rec,amp){
    var C=n===1?[220]:n===2?[170,270]:[130,220,310],d='M60 40',g='';
    C.forEach(function(c){d+=' H'+(c-8)+' M'+(c+8)+' 40';g+=sPileH(c,40);});
    d+=' H380'+(amp?' V85 M380 115':'')+' V160 H237 M203 160 H60 V40';
    g='<path d="'+d+'" '+ST+'/>'+g+(amp?sApp(380,100,'A'):'')+(rec==='lampe'?sLampe(220,160):sApp(220,160,'M',17))
      +T(220,193,n+(n===1?' pile':' piles')+' en série',13,GR,700);
    return A.svg(g,'0 0 440 200','Schéma normalisé : '+n+(n===1?' pile':' piles')+' en série, '+(rec==='lampe'?'une lampe':'un moteur')+(amp?' et un ampèremètre en série':'')+', une seule boucle.');};

  /* ---------- INT-02 ---------- */
  var SLOT=[[300,78],[510,195],[410,345],[190,345],[90,195]];
  M.montageMesure=function(pos,ferme,cal){
    var r=M.mesure(pos,ferme,cal),s='',P=A.pileM(300,78),nomPos=M.POS.filter(function(p){return p[0]===pos;})[0][1],mods,c,ap,L1,L2,K,noms,ja,gauche;
    if(pos==='derivation'){
      L1=A.lampeM(510,205,false,{});L2=A.lampeM(300,370,false,{});K=A.interM(90,205,ferme);ap=bornesApp(300,205);mods=[P,L1,L2,K];
      s+=P.g+L1.g+L2.g+K.g+appareil(300,205,'ERREUR','Ampèremètre','COM','mA',true);
      c=A.chaine(mods).cables;c.forEach(function(k,i){s+=A.cab(k.a,k.da,k.b,k.db,i===0?CR:CK).svg;});
      s+=A.cab(ap.R,1,P.R,1,OR).svg+A.cab(ap.L,-1,P.L,-1,BL).svg+T(510,262,'L1',18,INK,800)+T(300,427,'L2',18,INK,800);
    }else{
      noms=pos==='avantL1'?['P','A','L1','L2','K']:pos==='entre'?['P','L1','A','L2','K']:['P','L1','L2','A','K'];
      mods=noms.map(function(nm,i){var q=SLOT[i];
        if(nm==='P')return P;if(nm==='A'){ja=i;return bornesApp(q[0],q[1]);}
        if(nm==='K'){K=A.interM(q[0],q[1],ferme);return K;}
        var l=A.lampeM(q[0],q[1],ferme,{k:.6});if(nm==='L1')L1=l;else L2=l;s+=T(q[0],q[1]+57,nm,18,INK,800);return l;});
      c=A.chaine(mods).cables;gauche=c[ja-1].b===mods[ja].L;
      s+=P.g+L1.g+L2.g+K.g+appareil(SLOT[ja][0],SLOT[ja][1],r.txt,'Ampèremètre',gauche?'mA':'COM',gauche?'COM':'mA');
      c.forEach(function(k,i){s+=A.cab(k.a,k.da,k.b,k.db,i<ja?CR:CK).svg;});
    }
    return A.svgBanc(s,'-50 0 700 450','Montage : pile de 4,5 V, lampes L1 et L2 et interrupteur '+(ferme?'fermé':'ouvert')+' en série. Ampèremètre : '+nomPos.charAt(0).toLowerCase()+nomPos.slice(1)+'. '+(r.erreur?'Mauvais branchement : court-circuit signalé, aucune mesure.':'Il indique '+r.txt+'.'));};
  M.schemaMesure=function(pos,ferme){
    var der=pos==='derivation',d='M60 80 V40 H212 M228 40'+(pos==='avantL1'?' H295 M325 40':'')+' H380 V83 M380 117 V160'+(pos==='entre'?' H325 M295 160':'')+' H237 M203 160'+(pos==='apresL2'?' H145 M115 160':'')+' H60 V120',g;
    g='<path d="'+d+' '+(ferme?'M60 80 V120':'M60 120 L78 86')+'" '+ST+'/>'+sPt(60,80)+sPt(60,120)+sPileH(220,40)+sLampe(380,100)+sLampe(220,160)
      +T(352,105,'L1',13,INK,800,'end')+T(220,136,'L2',13,INK,800)+T(86,112,'K',13,INK,800,'start');
    if(pos==='avantL1')g+=sApp(310,40,'A');if(pos==='entre')g+=sApp(310,160,'A');if(pos==='apresL2')g+=sApp(130,160,'A');
    if(der)g+='<path d="M180 40 V-20 H205 M235 -20 H260 V40" fill="none" stroke="#D9423B" stroke-width="2.5"/>'+sPt(180,40)+sPt(260,40)+sApp(220,-20,'A');
    return A.svg(g,der?'0 -45 440 245':'0 0 440 200','Schéma normalisé : pile, lampes L1 et L2 et interrupteur K '+(ferme?'fermé':'ouvert')+' en série. '+(der?'L’ampèremètre est en dérivation aux bornes de la pile : mauvais branchement.':'L’ampèremètre est en série dans la boucle.'));};

  /* ---------- INT-04 ---------- */
  var PT4={P:[254,62],'1':[452,134],'2':[441,257]},NOM4={P:'A',1:'A1',2:'A2'};
  M.montageDeriv=function(pt,ferme,l2){
    var r=M.derivation(pt,ferme,l2),P=A.pileM(130,95),K=A.interM(330,110,ferme),L1=A.lampeM(500,200,ferme,{}),L2=A.lampeM(500,345,ferme&&l2,{devisse:!l2}),s=P.g+K.g+L1.g+L2.g;
    s+=fil('M522 345 C590 305 600 432 500 432 L110 432 C15 432 15 59 101 59',CK)+fil('M522 200 C575 150 580 295 522 345',CK)
      +fil('M169 59 C220 59 300 50 300 110',CR)+fil('M360 110 C360 50 478 120 478 200',CR)+fil('M360 110 C372 30 430 250 478 345',CR)
      +bout([101,59],CK)+bout([522,345],CK)+bout([522,200],CK)+bout([169,59],CR)+bout([300,110],CR)+bout([360,110],CR)+bout([478,200],CR)+bout([478,345],CR)
      +T(500,250,'L1',16,INK,800)+T(500,395,'L2',16,INK,800);
    ['P','1','2'].forEach(function(p){var c=PT4[p],sel=p===pt;
      s+='<g data-p="'+p+'"><circle cx="'+c[0]+'" cy="'+c[1]+'" r="24" fill="transparent"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="16" fill="'+(sel?'#C2410C':'#fff')+'" stroke="#C2410C" stroke-width="3"/>'+T(c[0],c[1]+5,NOM4[p],13,sel?'#fff':INK,800)+'</g>';
    });
    s+=appareil(210,290,mA(r.lu),'Ampèremètre en '+NOM4[pt],'','');
    var nom=M.PTS.filter(function(x){return x[0]===pt;})[0][1];
    return A.svgBanc(s,'0 0 620 455','Montage : pile de 4,5 V, interrupteur K '+(ferme?'fermé':'ouvert')+', lampes L1 et L2 en dérivation'+(l2?'':' ; la lampe L2 est dévissée')+'. L’ampèremètre est placé dans la '+nom.charAt(0).toLowerCase()+nom.slice(1)+' et indique '+mA(r.lu)+'.');};
  M.schemaDeriv=function(pt,ferme,l2){
    var d='M80 92 V40 H110 M150 40'+(pt==='P'?' H190 M220 40':'')+' H380 M260 40 V'+(pt==='1'?'57 M260 83 V98':'98')+' M260 132 V160 M380 40 V'+(pt==='2'?'57 M380 83 V98':'98')+' M380 132 V160 M80 108 V160 H380 '+(ferme?'M110 40 H150':'M110 40 L146 24'),
      g='<path d="'+d+'" '+ST+'/>'+sPileV(80,100)+sPt(110,40)+sPt(150,40)+sPt(260,40)+sPt(260,160)+sLampe(260,115)+sLampe(380,115,!l2)
        +T(288,120,'L1',13,INK,800,'start')+T(408,120,'L2',13,INK,800,'start')+T(130,64,'K',13,INK,800);
    if(pt==='P')g+=sApp(205,40,'A');if(pt==='1')g+=sApp(260,70,'A',13);if(pt==='2')g+=sApp(380,70,'A',13);
    return A.svg(g,'0 0 480 200','Schéma normalisé : pile, interrupteur K '+(ferme?'fermé':'ouvert')+' et lampes L1 et L2 en dérivation'+(l2?'':' (L2 dévissée)')+'. L’ampèremètre est en série dans la '+(pt==='P'?'branche principale':pt==='1'?'branche de L1':'branche de L2')+'.');};

  /* ---------- TEN-01 ---------- */
  var LEAD={G:['M260 330 C330 330 300 59 198 59','M120 330 C30 330 30 59 112 59',[198,59],[112,59]],
    L1:['M260 330 C400 330 520 120 462 166','M120 330 C40 330 60 215 200 205 C330 196 418 110 418 166',[462,166],[418,166]],
    L2:['M260 330 C330 330 330 262 400 258 C440 256 462 270 462 311','M120 330 C40 330 60 235 250 232 C380 230 418 250 418 311',[462,311],[418,311]]};
  M.montageTension=function(dip,U){
    M.tensionDeriv(dip,U);var k=U<4?.6:1,P=A.pileM(150,95,{txt:fv(U)}),L1=A.lampeM(440,200,true,{k:k}),L2=A.lampeM(440,345,true,{k:k*.8}),ld=LEAD[dip],
      s=P.g+L1.g+L2.g+A.cab(P.R,1,L1.R,1,CR).svg+A.cab(L1.R,1,L2.R,1,CR).svg+A.cab(P.L,-1,L1.L,-1,CK).svg+A.cab(L1.L,-1,L2.L,-1,CK).svg
        +T(505,206,'L1',18,INK,800,'start')+T(505,351,'L2',18,INK,800,'start')+appareil(190,330,fv(U),'Voltmètre','COM','V')
        +fil(ld[0],OR)+fil(ld[1],BL)+bout([260,330],OR)+bout([120,330],BL)+bout(ld[2],OR)+bout(ld[3],BL),
      nom=M.DIP.filter(function(x){return x[0]===dip;})[0][1];
    return A.svgBanc(s,'0 0 560 420','Montage : générateur de '+fv(U)+' et lampes L1 et L2 en dérivation, allumées. Le voltmètre est branché aux bornes de '+nom.charAt(0).toLowerCase()+nom.slice(1)+' et indique '+fv(U)+'.');};
  M.schemaTension=function(dip){
    var v={G:['M80 60 H20 V85 M20 115 V140 H80',[20,100],[80,60],[80,140]],L1:['M200 60 H260 V85 M260 115 V140 H200',[260,100],[200,60],[200,140]],L2:['M320 60 H380 V85 M380 115 V140 H320',[380,100],[320,60],[320,140]]}[dip];
    if(!v)throw new Error('dipôle inconnu : '+dip);
    var g='<path d="M80 92 V40 H320 M80 108 V160 H320 M200 40 V83 M200 117 V160 M320 40 V83 M320 117 V160" '+ST+'/>'+sPileV(80,100)+sLampe(200,100)+sLampe(320,100)
      +sPt(200,40)+sPt(200,160)+T(176,105,'L1',13,INK,800,'end')+T(296,105,'L2',13,INK,800,'end')
      +'<path d="'+v[0]+'" fill="none" stroke="'+OR+'" stroke-width="2.5"/>'+sPt(v[2][0],v[2][1])+sPt(v[3][0],v[3][1])+sApp(v[1][0],v[1][1],'V');
    return A.svg(g,'-20 0 440 200','Schéma normalisé : pile et lampes L1 et L2 en dérivation. Le voltmètre est en dérivation aux bornes de '+(dip==='G'?'la pile':'la lampe '+dip)+'.');};

  window.NohobaIntensite5e=M;
})();
