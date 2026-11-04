/* Électricité de 5e : modèles qualitatifs testables (NohobaElec5e), dessins au style banc d'essai et atelier commun des fiches NL-5E-ELE-02 à 04.
   Valeurs de simulation : les lampes et les moteurs réels ont des seuils moins nets. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,CR=A.CR,CK=A.CK,INK='#243049',N={};
  function bas(t){return t.charAt(0).toLowerCase()+t.slice(1);}
  function r1(x){return Math.round(x*10)/10;}
  function fv(x){return String(r1(x)).replace('.',',')+' V';}
  N.fv=fv;N.bas=bas;
  /* ---------- ELE-02 : tension du générateur et tension nominale du récepteur ---------- */
  N.RECS=[['L1','Lampe 1,5 V',1.5,'lampe'],['L4','Lampe 4,5 V',4.5,'lampe'],['L6','Lampe 6 V',6,'lampe'],['L12','Lampe 12 V',12,'lampe'],['M6','Moteur 6 V',6,'moteur']];
  N.GENS=[1.5,4.5,6,9,12];
  N.rec=function(id){var r=N.RECS.filter(function(x){return x[0]===id;})[0];if(!r)throw new Error('récepteur inconnu : '+id);return {id:r[0],nom:r[1],Un:r[2],type:r[3]};};
  /* état selon le rapport U / Un : seuils 0,25 ; 0,8 ; 1,2 ; 1,5 */
  N.etat=function(U,id){var r=N.rec(id),q=U/r.Un,lamp=r.type==='lampe',k;
    if(q<.25)k='off';else if(q<.8)k='low';else if(q<=1.2)k='ok';else if(q<=1.5)k='high';else k='burn';
    var T0={lampe:{off:'ne brille pas',low:'brille faiblement (sous-tension)',ok:'brille normalement',high:'brille trop fort (surtension)',burn:'grille (forte surtension)'},
            moteur:{off:'ne tourne pas',low:'tourne lentement (sous-tension)',ok:'tourne normalement',high:'tourne trop vite (surtension)',burn:'est détérioré (forte surtension)'}};
    return {k:k,txt:T0[lamp?'lampe':'moteur'][k],adapte:k==='ok',q:q};};
  function banc(src,rec){var q1=A.cab(src.R,1,rec.R,1,CR),q2=A.cab(rec.L,-1,src.L,-1,CK);return src.g+rec.g+q1.svg+q2.svg;}
  N.montageGR=function(U,id){
    var r=N.rec(id),e=N.etat(U,id),src=A.pileM(250,80,{txt:fv(U)}),rec;
    if(r.type==='moteur')rec=A.moteurM(250,235,e.k!=='off'&&e.k!=='burn');
    else rec=A.lampeM(250,235,e.k==='low'||e.k==='ok'||e.k==='high',{k:e.k==='low'?.45:1,grille:e.k==='burn'});
    var s=banc(src,rec)+T(250,292,r.nom,13,INK,700);
    return {montage:A.svgBanc(s,'0 0 500 310','Montage : un générateur de '+fv(U)+' relié par deux câbles à un récepteur « '+bas(r.nom)+' ». Résultat simulé : '+bas(r.nom)+' '+e.txt+'.'),
      schema:A.schema({pile:'normale',cotes:{droite:r.type==='moteur'?'moteur':'lampe',bas:'fil',gauche:'fil'},legende:'Générateur '+fv(U)+' + '+bas(r.nom),label:'Schéma normalisé : un générateur de '+fv(U)+' et '+bas(r.nom)+' en série, circuit fermé'}),etat:e,rec:r};};
  /* ---------- ELE-03 : lampes en série ou en dérivation, une lampe pouvant être dévissée ---------- */
  N.MODES=[['serie','En série'],['derivation','En dérivation']];
  N.DEVISSEE=[['aucune','Aucune'],['L1','L1'],['L2','L2']];
  N.etat3=function(mode,dev){
    if(mode!=='serie'&&mode!=='derivation')throw new Error('montage inconnu : '+mode);
    if(['aucune','L1','L2'].indexOf(dev)<0)throw new Error('lampe inconnue : '+dev);
    var o={L1:{on:true,k:1},L2:{on:true,k:1}};
    if(mode==='serie'){var allume=dev==='aucune';o.L1={on:allume,k:.5};o.L2={on:allume,k:.5};}
    else{if(dev==='L1')o.L1.on=false;if(dev==='L2')o.L2.on=false;}
    function m(e,n){return !e.on?(dev===n?'dévissée':'éteinte'):mode==='serie'?'allumée, faiblement':'allumée, normalement';}
    o.txt='L1 : '+m(o.L1,'L1')+' ; L2 : '+m(o.L2,'L2')+'.';return o;};
  /* schéma normalisé de deux lampes en dérivation : pile à gauche, deux branches */
  function schemaDeriv(){var st='fill="none" stroke="'+INK+'" stroke-width="2.5"',g='',lampe=function(x,y){return '<circle cx="'+x+'" cy="'+y+'" r="17" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+(x-12)+' '+(y-12)+' L'+(x+12)+' '+(y+12)+' M'+(x+12)+' '+(y-12)+' L'+(x-12)+' '+(y+12)+'" '+st+'/>';};
    g+='<path d="M80 40 H340 M80 160 H340 M80 40 V92 M80 108 V160 M200 40 V83 M200 117 V160 M320 40 V83 M320 117 V160" '+st+'/>'
      +'<path d="M64 92 H96" stroke="'+INK+'" stroke-width="2.5"/><path d="M70 108 H90" stroke="'+INK+'" stroke-width="6"/>'+T(52,90,'+',16,'#C03A2E',800)+T(52,120,'−',16,'#2B5EA8',800)
      +lampe(200,100)+lampe(320,100)+T(228,104,'L1',13,INK,800,'start')+T(348,104,'L2',13,INK,800,'start')
      +'<circle cx="200" cy="40" r="4.5" fill="'+INK+'"/><circle cx="320" cy="40" r="4.5" fill="'+INK+'"/><circle cx="200" cy="160" r="4.5" fill="'+INK+'"/><circle cx="320" cy="160" r="4.5" fill="'+INK+'"/>'
      +T(220,193,'Deux boucles',13,'#46536B',700);
    return A.svg(g,'0 0 440 200','Schéma normalisé : pile et deux lampes en dérivation, deux boucles');}
  N.montage3=function(mode,dev){
    var e=N.etat3(mode,dev),P,L1,L2,cb,H=425,W=560;
    if(mode==='serie'){P=A.pileM(280,78);L1=A.lampeM(475,205,e.L1.on,{k:e.L1.k,devisse:dev==='L1'});L2=A.lampeM(280,345,e.L2.on,{k:e.L2.k,devisse:dev==='L2'});
      cb=[[P.R,1,L1.R,1,CR],[L1.L,-1,L2.R,1,CK],[L2.L,-1,P.L,-1,CK]];}
    else{P=A.pileM(150,95);L1=A.lampeM(440,200,e.L1.on,{k:1,devisse:dev==='L1'});L2=A.lampeM(440,340,e.L2.on,{k:1,devisse:dev==='L2'});
      cb=[[P.R,1,L1.R,1,CR],[L1.R,1,L2.R,1,CR],[P.L,-1,L1.L,-1,CK],[L1.L,-1,L2.L,-1,CK]];}
    var s=P.g+L1.g+L2.g+cb.map(function(k){return A.cab(k[0],k[1],k[2],k[3],k[4]).svg;}).join('');
    s+=mode==='serie'?T(475,262,'L1',20,INK,800)+T(280,402,'L2',20,INK,800):T(440,257,'L1',20,INK,800)+T(440,397,'L2',20,INK,800);
    var sch=mode==='serie'?A.schema({cotes:{droite:'lampe',bas:'lampe',gauche:'fil'},legende:'Une seule boucle',label:'Schéma normalisé : pile et deux lampes en série, une seule boucle'}):schemaDeriv();
    return {montage:A.svgBanc(s,'0 0 '+W+' '+H,'Montage : pile de 4,5 V et deux lampes '+(mode==='serie'?'en série':'en dérivation')+(dev==='aucune'?', toutes les lampes vissées':', la lampe '+dev+' est dévissée')+'. '+e.txt),schema:sch,etat:e};};
  /* ---------- ELE-04 : piles de 1,5 V associées en série, chacune dans un sens ---------- */
  /* schéma normalisé : n piles en série sur le côté haut, voltmètre V en dérivation sur le côté droit */
  function schemaPiles(piles,U){var n=piles.length,C=n===1?[220]:n===2?[160,280]:[130,220,310],st='fill="none" stroke="'+INK+'" stroke-width="2.5"',d='M60 40',g='';
    C.forEach(function(c){d+=' H'+(c-14)+' M'+(c+14)+' 40';});d+=' H380';
    g+='<path d="'+d+' M60 40 V160 H380 M380 40 V83 M380 117 V160" '+st+'/>';
    piles.forEach(function(p,i){var c=C[i],lg=p.f?c-8:c+8,cr=p.f?c+8:c-8;
      g+='<path d="M'+lg+' 24 V56" stroke="'+INK+'" stroke-width="2.5"/><path d="M'+cr+' 31 V49" stroke="'+INK+'" stroke-width="6"/>'+T(lg+(p.f?-8:8),20,'+',14,'#C03A2E',800);});
    g+='<circle cx="380" cy="100" r="17" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/>'+T(380,106,'V',17,INK,800)+T(220,193,'Association de '+n+(n===1?' pile':' piles')+' : '+fv(U).replace('-','−'),13,'#46536B',700);
    return A.svg(g,'0 0 440 200','Schéma normalisé : '+n+(n===1?' pile':' piles')+' de 1,5 V en série avec un voltmètre en dérivation, tension totale '+fv(U).replace('-','moins ')+'.');}
  N.UP=1.5;
  N.total=function(piles){if(!piles.length||piles.length>3)throw new Error('une à trois piles');return r1(piles.reduce(function(a,p){return a+(p.f?-1:1)*N.UP;},0));};
  N.montage4=function(piles){
    var U=N.total(piles),n=piles.length,x0=280-(n-1)*80,Ps=piles.map(function(p,i){return A.pileM(x0+i*160,70,{inv:!!p.f,txt:'1,5 V'});}),s='',bx=210,by=165,bw=140,bh=68,V=[bx+bw,by+34],C=[bx,by+34];
    V.croc=C.croc=1;
    Ps.forEach(function(p){s+=p.g;});
    for(var i=0;i<n-1;i++)s+=A.cab(Ps[i].R,1,Ps[i+1].L,-1,CK,{k:34}).svg;
    s+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="12" fill="#2B3345" stroke="#1B2540" stroke-width="2"/><rect x="'+(bx+16)+'" y="'+(by+9)+'" width="108" height="32" rx="6" fill="#10241C" stroke="#2C5A47"/>'
      +T(bx+70,by+33,fv(U).replace('-','−'),21,'#B9F6CE',800)+T(bx+70,by+58,'Voltmètre',11,'#C9D2E0',700)+T(bx+bw-8,by+59,'V',11,'#fff',800,'end')+T(bx+8,by+59,'COM',11,'#fff',800,'start');
    s+=A.cab(V,1,Ps[n-1].R,1,'#F97316').svg+A.cab(C,-1,Ps[0].L,-1,'#0B6FA8').svg;
    var etiq=piles.map(function(p){return p.f?'retournée':'dans le sens +';}).join(', ');
    return {montage:A.svgBanc(s,'0 0 560 255','Montage : '+n+(n===1?' pile':' piles')+' de 1,5 V en série ('+etiq+'). Le voltmètre, entre les extrémités, indique '+fv(U).replace('-','moins ')+'.'),
      schema:schemaPiles(piles,U),U:U};};
  /* ---------- atelier commun : groupes de choix, montage et schéma côte à côte, observation, tableau ---------- */
  /* cfg : {titre, intro, groupes:[{legende,nom,items:[[val,libellé]],def}], rendre(v)->{montage,schema,lecture,essai}, placeholder, fiche:()=>FICHE} */
  N.atelier=function(panel,X,cfg){
    var h=window.Activite.h,esc=window.Activite.esc,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:cfg.titre},sec);h('p',{text:cfg.intro},sec);
    var fig=A.paire(sec,h);
    cfg.groupes.forEach(function(g){var f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,g.legende);
      g.items.forEach(function(it){h('label',{class:'opt',style:'flex:1 1 130px;margin:0'},f,'<input type="radio" name="'+g.nom+'" value="'+it[0]+'"'+(String(it[0])===String(g.def)?' checked':'')+'><span>'+esc(it[1])+'</span>');});});
    var lecture=h('p',{style:'font-weight:800;font-size:1.2em','aria-live':'polite'},sec),S=A.saisie(sec,h,cfg.idObs||'e-obs',cfg.placeholder);
    var res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);var table=h('div',{style:'max-width:100%;overflow-x:auto'},res);
    function val(){var v={};cfg.groupes.forEach(function(g){v[g.nom]=sec.querySelector('input[name="'+g.nom+'"]:checked').value;});return v;}
    function maj(){var r=cfg.rendre(val());fig.montage(r.montage);fig.schema(r.schema);lecture.textContent=r.lecture;return r;}
    function paint(){var F=cfg.fiche();table.innerHTML=X.tableHTML(F,F.lignes(st),'Mes essais.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      var r=cfg.rendre(val());r.essai.observation=S.note();X.addEssai(r.essai);S.vide();S.msg.textContent='Observation enregistrée.';paint();};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();};
  N.valides=function(st){return st.essais.filter(function(e){return typeof e.observation==='string'&&e.observation.trim().length>=10;});};
  window.NohobaElec5e=N;
})();
