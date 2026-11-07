/* Mesures de 5e : pression atmosphérique (NohobaMes5e). Modèles qualitatifs testables et dessins originaux (verre et carte, bouteille, ventouse, baromètre).
   Pression à l'altitude h (m) : atmosphère standard arrondie, comme la simulation du Studio. Valeurs de simulation. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,T=A.T,INK='#243049',BL='#2E7BD6',EAU='#A9DAF7',N={};
  function fh(x){return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' hPa';}
  N.fh=fh;
  /* ---------- MES-02 : pression et altitude ---------- */
  N.LIEUX=[['abidjan','Abidjan (niveau de la mer)',0],['tonkoui','Mont Tonkoui',1189],['nimba','Mont Nimba',1752],['kili','Kilimandjaro',5895],['everest','Everest',8849]];
  N.lieu=function(id){var l=N.LIEUX.filter(function(x){return x[0]===id;})[0];if(!l)throw new Error('lieu inconnu : '+id);return {id:l[0],nom:l[1],h:l[2]};};
  N.pression=function(h){if(h<0||h>9000)throw new Error('altitude hors du modèle : '+h);return Math.round(1013.25*Math.pow(1-2.25577e-5*h,5.25588));};
  function mh(h){return String(h).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' m';}
  N.mh=mh;
  N.montageAltitude=function(id){
    var l=N.lieu(id),P=N.pression(l.h),y=260-200*l.h/9000,x=60+380*l.h/9000,s='';
    s+='<path d="M20 260 L440 56 L480 260 Z" fill="#8DA68F" stroke="#5F7A63" stroke-width="2.5" stroke-linejoin="round"/><path d="M393 83 L440 56 L452 112 L420 98 Z" fill="#fff" opacity=".85"/><path d="M0 260 H500" stroke="'+INK+'" stroke-width="3"/>'
      +T(20,284,'niveau de la mer',12,INK,700,'start');
    [0,3000,6000,9000].forEach(function(h){var yy=260-200*h/9000;s+='<path d="M8 '+yy+' h14" stroke="#46536B" stroke-width="2"/>'+(h?T(28,yy+4,mh(h),11,'#46536B',700,'start'):'');});
    s+='<circle cx="'+x+'" cy="'+(y-12)+'" r="10" fill="#F97316" stroke="#fff" stroke-width="2.5"/><path d="M'+x+' '+(y-2)+' V'+(y+14)+'" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>'
      +'<rect x="'+Math.min(300,Math.max(70,x-60))+'" y="'+Math.max(6,y-62)+'" width="150" height="34" rx="8" fill="#fff" stroke="'+INK+'" stroke-width="1.8"/>'+T(Math.min(300,Math.max(70,x-60))+75,Math.max(6,y-62)+15,l.nom.split(' (')[0],12,INK,800)+T(Math.min(300,Math.max(70,x-60))+75,Math.max(6,y-62)+29,mh(l.h),12,'#46536B',700);
    return A.svg(s,'0 0 500 300','Scène : un randonneur au lieu « '+l.nom+' », à '+mh(l.h)+' d’altitude, sur le flanc d’une montagne.');};
  N.schemaBarometre=function(id){
    var l=N.lieu(id),P=N.pression(l.h),cx=220,cy=108,r=86,s='',a=function(p){return (-135+(p-300)/800*270)*Math.PI/180;},pt=function(p,rr){return [cx+rr*Math.sin(a(p)),cy-rr*Math.cos(a(p))];},i,q,q2;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+8)+'" fill="#E9EEF6" stroke="'+INK+'" stroke-width="3"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#fff" stroke="#9FB0C4" stroke-width="1.5"/>';
    for(i=300;i<=1100;i+=100){q=pt(i,r-4);q2=pt(i,r-16);s+='<path d="M'+q[0].toFixed(1)+' '+q[1].toFixed(1)+' L'+q2[0].toFixed(1)+' '+q2[1].toFixed(1)+'" stroke="'+INK+'" stroke-width="2.2"/>';q=pt(i,r-30);s+=T(q[0].toFixed(1),(q[1]+4).toFixed(1),String(i),11,INK,700);}
    q=pt(P,r-12);s+='<path d="M'+cx+' '+cy+' L'+q[0].toFixed(1)+' '+q[1].toFixed(1)+'" stroke="#D6221C" stroke-width="4" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="6" fill="'+INK+'"/>'+T(cx,cy+34,'hPa',12,'#46536B',800)+T(cx,229,fh(P),17,INK,800);
    return A.svg(s,'0 0 440 240','Baromètre à cadran, graduations de 300 à 1 100 hPa : l’aiguille indique '+fh(P)+' à '+bas0(l.nom)+'.');};
  function bas0(t){return t.charAt(0).toLowerCase()+t.slice(1);}
  /* ---------- MES-01 : effets de la pression atmosphérique ---------- */
  N.EXPS=[['verre-lisse','Verre retourné, carte lisse'],['verre-trou','Verre retourné, carte percée'],['bout-0','Bouteille : on ne retire pas d’air'],['bout-bcp','Bouteille : on retire beaucoup d’air'],['vent-ok','Ventouse bien appliquée'],['vent-trou','Ventouse percée']];
  /* effet : true quand l'air extérieur « agit » (l'eau reste, la bouteille est écrasée, la ventouse colle) ; dedans : 'autant' ou 'moins' d'air */
  N.exp=function(id){
    var T0={'verre-lisse':{effet:true,dedans:'moins',txt:'l’eau reste dans le verre : la carte tient'},'verre-trou':{effet:false,dedans:'autant',txt:'l’eau tombe : l’air entre aussi par le trou'},
      'bout-0':{effet:false,dedans:'autant',txt:'la bouteille garde sa forme'},'bout-bcp':{effet:true,dedans:'moins',txt:'la bouteille est écrasée'},
      'vent-ok':{effet:true,dedans:'moins',txt:'la ventouse colle au mur'},'vent-trou':{effet:false,dedans:'autant',txt:'la ventouse ne colle pas'}};
    var x=T0[id];if(!x)throw new Error('expérience inconnue : '+id);
    return {id:id,nom:N.EXPS.filter(function(e){return e[0]===id;})[0][1],effet:x.effet,dedans:x.dedans,txt:x.txt,type:id.split('-')[0]};};
  function fleche(x1,y1,x2,y2,col){var dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy),ux=dx/L,uy=dy/L,hx=x2-ux*12,hy=y2-uy*12;
    return '<path d="M'+x1+' '+y1+' L'+hx.toFixed(1)+' '+hy.toFixed(1)+'" stroke="'+col+'" stroke-width="4" stroke-linecap="round"/><path d="M'+x2+' '+y2+' L'+(hx-uy*7).toFixed(1)+' '+(hy+ux*7).toFixed(1)+' L'+(hx+uy*7).toFixed(1)+' '+(hy-ux*7).toFixed(1)+' Z" fill="'+col+'"/>';}
  N.montageExp=function(id){
    var e=N.exp(id),s='',t=e.type;
    if(t==='verre'){
      s+='<rect x="190" y="40" width="120" height="150" rx="10" fill="'+EAU+'" fill-opacity=".85" stroke="'+INK+'" stroke-width="3"/>';
      if(e.effet)s+='<rect x="180" y="190" width="140" height="8" rx="2" fill="#C9A66B" stroke="#8A6D3B" stroke-width="1.5"/>'+fleche(215,262,215,208,BL)+fleche(250,262,250,208,BL)+fleche(285,262,285,208,BL)+T(250,284,'l’air pousse la carte vers le haut',13,BL,800);
      else s+='<g transform="rotate(14 190 194)"><rect x="180" y="190" width="140" height="8" rx="2" fill="#C9A66B" stroke="#8A6D3B" stroke-width="1.5"/><circle cx="270" cy="194" r="5" fill="#fff" stroke="#8A6D3B"/></g><path d="M240 214 q-5 10 0 16 q5 -6 0 -16 M275 232 q-5 10 0 16 q5 -6 0 -16 M215 244 q-5 10 0 16 q5 -6 0 -16" fill="'+EAU+'" stroke="#4AA3DF" stroke-width="1.5"/>'+T(250,284,'la carte penche : l’eau tombe',13,'#46536B',800);
    }else if(t==='bout'){
      var body=e.effet?'M235 40 H265 V82 C300 92 270 130 262 165 C256 200 300 222 300 250 H200 C200 222 244 200 238 165 C230 130 200 92 235 82 Z':'M235 40 H265 V82 C300 92 300 110 300 140 V250 H200 V140 C200 110 200 92 235 82 Z';
      s+='<path d="'+body+'" fill="#DCEAF7" fill-opacity=".9" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/><rect x="230" y="30" width="40" height="12" rx="3" fill="#2E7BD6" stroke="'+INK+'" stroke-width="2"/>';
      if(e.effet)s+='<path d="M250 30 V10 H370" fill="none" stroke="#46536B" stroke-width="4"/><rect x="370" y="0" width="50" height="22" rx="6" fill="#8895A8" stroke="'+INK+'" stroke-width="2"/>'+T(395,15,'pompe',11,'#fff',800)+fleche(140,130,192,150,BL)+fleche(360,130,308,150,BL)+T(250,284,'l’air extérieur écrase la bouteille',13,BL,800);
      else s+=T(250,284,'même quantité d’air dedans et dehors',13,'#46536B',800);
    }else{
      s+='<rect x="40" y="40" width="30" height="220" rx="4" fill="#B9C0CC" stroke="'+INK+'" stroke-width="2.5"/>';
      if(e.effet)s+='<path d="M70 118 Q138 120 138 150 Q138 180 70 182 Z" fill="#D6221C" stroke="'+INK+'" stroke-width="2.5"/><rect x="136" y="144" width="60" height="12" rx="5" fill="#8895A8" stroke="'+INK+'" stroke-width="2"/>'+fleche(250,115,150,128,BL)+fleche(250,150,205,150,BL)+fleche(250,185,150,172,BL)+T(285,230,'l’air pousse la ventouse',13,BL,800)+T(285,246,'contre le mur',13,BL,800);
      else s+='<g transform="rotate(-12 150 150)"><path d="M100 118 Q168 120 168 150 Q168 180 100 182 Z" fill="#D6221C" stroke="'+INK+'" stroke-width="2.5"/><rect x="166" y="144" width="60" height="12" rx="5" fill="#8895A8" stroke="'+INK+'" stroke-width="2"/><circle cx="196" cy="150" r="3.5" fill="#fff" stroke="'+INK+'"/></g>'+T(285,230,'l’air passe par le trou :',13,'#46536B',800)+T(285,246,'la ventouse tombe',13,'#46536B',800);
    }
    return A.svg(s,'0 0 500 300','Expérience : '+e.nom.toLowerCase()+'. Résultat simulé : '+e.txt+'.');};
  N.schemaExp=function(id){
    var e=N.exp(id),L=e.dedans==='autant'?300:110,s='';
    s+=T(20,50,'Air dehors',14,INK,800,'start')+'<rect x="20" y="60" width="300" height="30" rx="7" fill="'+BL+'"/>'+T(330,81,'1 013 hPa',13,INK,800,'start')
      +T(20,130,'Air dedans',14,INK,800,'start')+'<rect x="20" y="140" width="'+L+'" height="30" rx="7" fill="'+(e.dedans==='autant'?BL:'#9FB0C4')+'"/>'+T(Math.min(330,L+30),161,e.dedans==='autant'?'autant d’air':'peu d’air',13,INK,800,'start')
      +T(220,194,e.effet?'Dehors pousse plus que dedans : effet visible':'Autant dehors que dedans : pas d’effet',13,'#46536B',700);
    return A.svg(s,'0 0 440 200','Schéma : l’air dehors pousse avec une pression de 1 013 hPa ; l’air dedans est '+(e.dedans==='autant'?'en même quantité':'en quantité réduite')+'. '+(e.effet?'Dehors pousse plus que dedans.':'Il n’y a pas de différence.'));};
  window.NohobaMes5e=N;
})();
