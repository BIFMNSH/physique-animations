/* NohobaLab · 6e Côte d'Ivoire · dessins du lot « L'air et les combustions ».
   Dessins originaux : montage réaliste et schéma normalisé (verrerie en traits, légendes) côte à côte.
   Flammes immobiles (aucune animation : lisible avec « mouvement réduit », aucun scintillement). */
(function(){
  'use strict';
  var C=window.NohobaChimie,A=window.NohobaAtelier,D={};
  var INK='#243049',OR='#C2410C',BLEU='#2B6CB0',JAUNE='#F2B134',EAU='#8EC5F0',VERRE='#DCE8F4',GRIS='#9FB0C4';
  var T=A.T,esc=A.esc;
  function svg(inner,vb,label){return A.svg(inner,vb,label);}
  var S='stroke="'+INK+'" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  D.INK=INK;D.OR=OR;

  /* ---------- primitives réalistes ---------- */
  D.flamme=function(x,y,o){o=o||{};var h=o.h||40,c=o.couleur||'jaune',w=h*0.42;
    if(c==='bleue')return '<path d="M'+x+' '+(y-h)+' C'+(x+w)+' '+(y-h*0.55)+' '+(x+w*0.9)+' '+(y-h*0.1)+' '+x+' '+y+' C'+(x-w*0.9)+' '+(y-h*0.1)+' '+(x-w)+' '+(y-h*0.55)+' '+x+' '+(y-h)+'Z" fill="'+BLEU+'" opacity=".85"/><path d="M'+x+' '+(y-h*0.55)+' C'+(x+w*0.4)+' '+(y-h*0.3)+' '+(x+w*0.35)+' '+(y-h*0.05)+' '+x+' '+y+' C'+(x-w*0.35)+' '+(y-h*0.05)+' '+(x-w*0.4)+' '+(y-h*0.3)+' '+x+' '+(y-h*0.55)+'Z" fill="#7FB3E8"/>';
    return '<path d="M'+x+' '+(y-h)+' C'+(x+w*1.1)+' '+(y-h*0.5)+' '+(x+w)+' '+(y-h*0.1)+' '+x+' '+y+' C'+(x-w)+' '+(y-h*0.1)+' '+(x-w*0.8)+' '+(y-h*0.6)+' '+x+' '+(y-h)+'Z" fill="'+JAUNE+'"/><path d="M'+x+' '+(y-h*0.6)+' C'+(x+w*0.5)+' '+(y-h*0.35)+' '+(x+w*0.4)+' '+(y-h*0.05)+' '+x+' '+y+' C'+(x-w*0.4)+' '+(y-h*0.05)+' '+(x-w*0.5)+' '+(y-h*0.35)+' '+x+' '+(y-h*0.6)+'Z" fill="#F97316"/>'+(o.fumee?D.fumee(x,y-h-6,2):'');};
  D.fumee=function(x,y,k){var s='',i;for(i=0;i<k;i++)s+='<circle cx="'+(x+(i%2?10:-6))+'" cy="'+(y-i*16)+'" r="'+(8+i*2)+'" fill="#555" opacity=".35"/>';return s;};
  D.bougie=function(x,y,o){o=o||{};var h=o.h||54;return '<rect x="'+(x-9)+'" y="'+(y-h)+'" width="18" height="'+h+'" rx="3" fill="#FFF4D6" stroke="#D8C7A0"/><line x1="'+x+'" y1="'+(y-h)+'" x2="'+x+'" y2="'+(y-h-8)+'" stroke="#333" stroke-width="2"/>'+(o.allumee?D.flamme(x,y-h-8,{h:26}):'<circle cx="'+x+'" cy="'+(y-h-8)+'" r="2" fill="#777"/>');};
  D.cristallisoir=function(x,y,w,h,niveau){var s='<path d="M'+(x-w/2)+' '+(y-h)+' V'+y+' H'+(x+w/2)+' V'+(y-h)+'" fill="'+VERRE+'" stroke="'+GRIS+'" stroke-width="2.5"/>';
    if(niveau)s+='<rect x="'+(x-w/2+2)+'" y="'+(y-h*niveau)+'" width="'+(w-4)+'" height="'+(h*niveau-2)+'" fill="'+EAU+'" opacity=".8"/>';return s;};
  /* bocal retourné : eau montée de « montee » (fraction de la hauteur) */
  D.bocal=function(x,y,w,h,o){o=o||{};var s='<path d="M'+(x-w/2)+' '+y+' V'+(y-h+10)+' Q'+(x-w/2)+' '+(y-h)+' '+(x-w/2+10)+' '+(y-h)+' H'+(x+w/2-10)+' Q'+(x+w/2)+' '+(y-h)+' '+(x+w/2)+' '+(y-h+10)+' V'+y+'" fill="'+VERRE+'" fill-opacity=".55" stroke="'+GRIS+'" stroke-width="2.5"/>';
    if(o.montee||o.base)s+='<rect x="'+(x-w/2+2)+'" y="'+(y-(o.base||0)-h*(o.montee||0))+'" width="'+(w-4)+'" height="'+((o.base||0)+h*(o.montee||0))+'" fill="'+EAU+'" opacity=".85"/>';
    if(o.trouble)s+='<rect x="'+(x-w/2+2)+'" y="'+(y-h*0.3)+'" width="'+(w-4)+'" height="'+(h*0.3)+'" fill="#fff" opacity=".9"/>'+'<rect x="'+(x-w/2+2)+'" y="'+(y-h*0.3)+'" width="'+(w-4)+'" height="'+(h*0.3)+'" fill="'+EAU+'" opacity=".35"/>';
    else if(o.chaux)s+='<rect x="'+(x-w/2+2)+'" y="'+(y-h*0.3)+'" width="'+(w-4)+'" height="'+(h*0.3)+'" fill="'+EAU+'" opacity=".45"/>';
    return s;};
  D.eprouvette=function(x,y,w,h,o){o=o||{};var s='<path d="M'+(x-w/2)+' '+y+' V'+(y-h+6)+' Q'+(x-w/2)+' '+(y-h)+' '+(x-w/2+6)+' '+(y-h)+' H'+(x+w/2-6)+' Q'+(x+w/2)+' '+(y-h)+' '+(x+w/2)+' '+(y-h+6)+' V'+y+'" fill="'+VERRE+'" fill-opacity=".55" stroke="'+GRIS+'" stroke-width="2.5"/>',i;
    for(i=0;i<=5;i++)s+='<line x1="'+(x+w/2-10)+'" y1="'+(y-(o.base||0)-(h-(o.base||0))*i/5)+'" x2="'+(x+w/2-2)+'" y2="'+(y-(o.base||0)-(h-(o.base||0))*i/5)+'" stroke="'+INK+'" stroke-width="1.5"/>';
    if(o.montee||o.base)s+='<rect x="'+(x-w/2+2)+'" y="'+(y-(o.base||0)-h*(o.montee||0))+'" width="'+(w-4)+'" height="'+((o.base||0)+h*(o.montee||0))+'" fill="'+EAU+'" opacity=".85"/>';
    if(o.paille)s+='<path d="M'+(x-8)+' '+(y-h+12)+' q8 6 0 12 t0 12 t0 12 M'+(x+6)+' '+(y-h+10)+' q-8 7 0 14 t0 14" stroke="'+(o.rouille?'#B5651D':'#777')+'" stroke-width="3" fill="none"/>';
    return s;};
  D.soucoupe=function(x,y,noir){return '<path d="M'+(x-40)+' '+y+' q40 18 80 0" fill="#fff" stroke="'+GRIS+'" stroke-width="2.5"/><line x1="'+(x-40)+'" y1="'+y+'" x2="'+(x+40)+'" y2="'+y+'" stroke="'+GRIS+'" stroke-width="2.5"/>'+(noir?'<ellipse cx="'+x+'" cy="'+(y+7)+'" rx="18" ry="5" fill="#222" opacity=".85"/>':'');};
  D.coupelle=function(x,y,niveau,allumee){var s='<path d="M'+(x-34)+' '+(y-16)+' q34 30 68 0" fill="'+VERRE+'" stroke="'+GRIS+'" stroke-width="2.5"/><line x1="'+(x-34)+'" y1="'+(y-16)+'" x2="'+(x+34)+'" y2="'+(y-16)+'" stroke="'+GRIS+'" stroke-width="2.5"/>';
    if(niveau)s+='<path d="M'+(x-30+ (3-niveau)*5)+' '+(y-16+(3-niveau)*3)+' q'+(30-(3-niveau)*5)+' '+(22-(3-niveau)*6)+' '+(60-(3-niveau)*10)+' 0" fill="#C7E3F7" opacity=".9"/>';
    if(allumee)s+=D.flamme(x,y-18,{h:44,couleur:'bleue'});return s;};
  D.charbon=function(x,y,etat){var col=etat==='eteinte'?'#2b2b2b':etat==='vive'?'#FF6A00':'#C0392B';
    return '<path d="M'+(x-26)+' '+y+' l6 -18 l14 -8 l18 6 l10 14 l-8 10 l-30 2z" fill="#1f1f1f" stroke="#000"/>'+(etat!=='eteinte'?'<path d="M'+(x-14)+' '+(y-6)+' l8 -10 l14 4 l4 8z" fill="'+col+'" opacity=".9"/><circle cx="'+(x+4)+'" cy="'+(y-2)+'" r="'+(etat==='vive'?9:5)+'" fill="'+col+'" opacity=".5"/>':'')+(etat==='eteinte'?'<path d="M'+(x-30)+' '+(y+4)+' h60" stroke="#9a9a9a" stroke-width="3"/>':'');};
  D.verrePied=function(x,y,buee){var s='<path d="M'+(x-26)+' '+(y-70)+' q26 70 26 40 M'+(x+26)+' '+(y-70)+' q-26 70 -26 40 M'+(x-26)+' '+(y-70)+' h52 M'+x+' '+(y-30)+' V'+(y-6)+' M'+(x-18)+' '+y+' h36" fill="'+VERRE+'" fill-opacity=".5" stroke="'+GRIS+'" stroke-width="2.5"/>';
    if(buee){var i;for(i=0;i<9;i++)s+='<circle cx="'+(x-16+(i%3)*16+(i%2?3:0))+'" cy="'+(y-64+Math.floor(i/3)*10)+'" r="2.6" fill="#fff" stroke="#9FB0C4" stroke-width=".8"/>';}
    return s;};
  D.tube=function(x,y,h,o){o=o||{};var s='<path d="M'+(x-9)+' '+(y-h)+' V'+(y-10)+' q0 10 9 10 q9 0 9 -10 V'+(y-h)+'" fill="'+VERRE+'" fill-opacity=".55" stroke="'+GRIS+'" stroke-width="2.5"/>';
    if(o.chaux)s+='<path d="M'+(x-7)+' '+(y-h*0.5)+' V'+(y-10)+' q0 8 7 8 q7 0 7 -8 V'+(y-h*0.5)+'" fill="'+(o.trouble?'#fff':EAU)+'" opacity="'+(o.trouble?'.95':'.5')+'"/>';return s;};
  /* brûleur labogaz : cartouche, tube, virole (bague tournante) ; flamme bleue (virole ouverte) ou jaune (fermée) */
  D.bruleur=function(x,y,o){o=o||{};var v=o.virole,s='<rect x="'+(x-30)+'" y="'+(y-56)+'" width="60" height="56" rx="8" fill="#34457A"/><rect x="'+(x-30)+'" y="'+(y-56)+'" width="60" height="14" rx="7" fill="#5A6FA8"/>'+T(x,y-22,'gaz butane',10,'#fff',700)+
    '<rect x="'+(x-9)+'" y="'+(y-118)+'" width="18" height="62" fill="#B7BDC7" stroke="#6b7480"/><rect x="'+(x-13)+'" y="'+(y-100)+'" width="26" height="16" rx="3" fill="'+(v==='ouverte'?'#E7B93C':'#8A94A4')+'" stroke="#6b7480"/>'+
    (v==='ouverte'?'<circle cx="'+(x-6)+'" cy="'+(y-92)+'" r="2.5" fill="#333"/><circle cx="'+(x+6)+'" cy="'+(y-92)+'" r="2.5" fill="#333"/>':'')+T(x+40,y-90,'virole '+(v==='ouverte'?'ouverte':v==='fermee'?'fermée':''),10,INK,700,'start');
    if(o.flamme)s+=D.flamme(x,y-118,{h:o.h||(o.flamme==='bleue'?52:58),couleur:o.flamme,fumee:o.flamme==='jaune'&&!o.h});
    return s;};
  D.papier=function(x,y,o){o=o||{};var s=D.soucoupe(x,y+8,false)+'<path d="M'+(x-28)+' '+y+' l10 -22 h36 l-8 22z" fill="#FFF8E7" stroke="#C9B890"/>';
    if(o.brule)s+=D.flamme(x,y-20,{h:40});if(o.cendre)s+='<path d="M'+(x-20)+' '+y+' h40" stroke="#777" stroke-width="4"/>';
    if(o.bocal)s+=D.bocal(x,y+8,96,110,{});if(o.sable)s+='<ellipse cx="'+x+'" cy="'+(y-4)+'" rx="30" ry="9" fill="#D9B36C"/>';if(o.eau)s+='<ellipse cx="'+x+'" cy="'+(y-4)+'" rx="30" ry="9" fill="'+EAU+'" opacity=".9"/>';
    return s;};
  D.jauge=function(x,y,w,niveau,max,label){var s=T(x,y-6,label,11,INK,700,'start'),i;for(i=0;i<max;i++)s+='<rect x="'+(x+i*(w/max))+'" y="'+y+'" width="'+(w/max-3)+'" height="12" rx="3" fill="'+(i<niveau?(label.indexOf('toxique')>=0?OR:'#2F855A'):'#E2E8F0')+'"/>';return s;};
  D.triangle=function(x,y,r,manque){var p=[[x,y-r],[x+r*0.87,y+r*0.5],[x-r*0.87,y+r*0.5]],lab=['Chaleur','Comburant (air)','Combustible'],ids=['chaleur','comburant','combustible'],s='',i;
    for(i=0;i<3;i++){var a=p[i],b=p[(i+1)%3],efface=manque&&(ids[i]===manque||ids[(i+1)%3]===manque);s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(efface?'#CBD5E0':OR)+'" stroke-width="5" stroke-dasharray="'+(efface?'8 8':'0')+'" stroke-linecap="round"/>';}
    for(i=0;i<3;i++)s+=T(p[i][0],p[i][1]+(i===0?-12:22),lab[i]+(manque===ids[i]?' ✕':''),12,manque===ids[i]?'#A0AEC0':INK,800);
    return s+(manque?'':D.flamme(x,y+r*0.35,{h:34}));};

  /* ---------- schémas normalisés (traits) ---------- */
  var N={
    cristallisoir:function(x,y,w,h,niv){return '<path d="M'+(x-w/2)+' '+(y-h)+' V'+y+' H'+(x+w/2)+' V'+(y-h)+'" '+S+'/>'+(niv?'<line x1="'+(x-w/2)+'" y1="'+(y-h*niv)+'" x2="'+(x+w/2)+'" y2="'+(y-h*niv)+'" '+S+'/>':'');},
    bocalRenverse:function(x,y,w,h,niv,base){return '<path d="M'+(x-w/2)+' '+y+' V'+(y-h)+' H'+(x+w/2)+' V'+y+'" '+S+'/>'+(niv?'<line x1="'+(x-w/2)+'" y1="'+(y-(base||0)-h*niv)+'" x2="'+(x+w/2)+'" y2="'+(y-(base||0)-h*niv)+'" '+S+'/>':'');},
    bocal:function(x,y,w,h){return '<path d="M'+(x-w/2)+' '+(y-h)+' V'+y+' H'+(x+w/2)+' V'+(y-h)+'" '+S+'/>';},
    eprouvette:function(x,y,w,h,niv,base){base=base||0;var s='<path d="M'+(x-w/2)+' '+y+' V'+(y-h)+' H'+(x+w/2)+' V'+y+'" '+S+'/>',i;for(i=0;i<=5;i++)s+='<line x1="'+(x+w/2)+'" y1="'+(y-base-(h-base)*i/5)+'" x2="'+(x+w/2+8)+'" y2="'+(y-base-(h-base)*i/5)+'" '+S+'/>';return s+(niv?'<line x1="'+(x-w/2)+'" y1="'+(y-base-(h-base)*niv)+'" x2="'+(x+w/2)+'" y2="'+(y-base-(h-base)*niv)+'" '+S+'/>':'');},
    flamme:function(x,y,h){return h?'<path d="M'+x+' '+(y-h)+' q'+(h*0.45)+' '+(h*0.55)+' 0 '+h+' q-'+(h*0.45)+' -'+(h*0.45)+' 0 -'+h+'" '+S+'/>':'';},
    bougie:function(x,y,allumee){return '<rect x="'+(x-8)+'" y="'+(y-44)+'" width="16" height="44" '+S+'/><line x1="'+x+'" y1="'+(y-44)+'" x2="'+x+'" y2="'+(y-52)+'" '+S+'/>'+N.flamme(x,y-52,allumee?22:0);},
    tube:function(x,y,h,niv){return '<path d="M'+(x-8)+' '+(y-h)+' V'+(y-8)+' q0 8 8 8 q8 0 8 -8 V'+(y-h)+'" '+S+'/>'+(niv?'<line x1="'+(x-8)+'" y1="'+(y-h*niv)+'" x2="'+(x+8)+'" y2="'+(y-h*niv)+'" '+S+'/>':'');},
    coupelle:function(x,y,niv){return '<path d="M'+(x-30)+' '+(y-14)+' q30 26 60 0 M'+(x-30)+' '+(y-14)+' h60" '+S+'/>'+(niv?'<line x1="'+(x-22)+'" y1="'+(y-8)+'" x2="'+(x+22)+'" y2="'+(y-8)+'" '+S+'/>':'');},
    soucoupe:function(x,y){return '<path d="M'+(x-36)+' '+y+' q36 14 72 0 M'+(x-36)+' '+y+' h72" '+S+'/>';},
    verrePied:function(x,y){return '<path d="M'+(x-22)+' '+(y-60)+' h44 l-14 34 v20 M'+(x-8)+' '+(y-26)+' v20 M'+(x-16)+' '+y+' h32 M'+(x-22)+' '+(y-60)+' l14 34" '+S+'/>';},
    bruleur:function(x,y,flamme){return '<rect x="'+(x-22)+'" y="'+(y-40)+'" width="44" height="40" '+S+'/><path d="M'+(x-6)+' '+(y-40)+' V'+(y-92)+' H'+(x+6)+' V'+(y-40)+'" '+S+'/><circle cx="'+(x+16)+'" cy="'+(y-80)+'" r="4" '+S+'/>'+N.flamme(x,y-92,flamme?40:0);},
    charbon:function(x,y){return '<path d="M'+(x-20)+' '+y+' l6 -14 l14 -4 l14 8 l4 10z" '+S+'/>';},
    etiq:function(x,y,t,x2,y2){return (x2!=null?'<line x1="'+x+'" y1="'+y+'" x2="'+x2+'" y2="'+y2+'" stroke="'+INK+'" stroke-width="1.2"/>':'')+T(x,y+(x2!=null?-4:0),t,11,INK,600,'start');},
    support:function(x,y,w){return '<line x1="'+(x-w/2)+'" y1="'+y+'" x2="'+(x+w/2)+'" y2="'+y+'" stroke="'+INK+'" stroke-width="3"/>';}
  };
  D.N=N;
  function legende(t){return T(230,22,t,13,INK,800);}

  /* ---------- scènes : {montage, schema} ---------- */
  C.sceneBougie=function(r){
    var b=C.bougie(r),w=r==='grand'?130:r==='petit'?90:0,h=r==='grand'?150:110;
    var m=D.cristallisoir(230,220,260,40,0.6)+D.bougie(230,220,{allumee:b.flamme==='brule'});
    if(w)m=D.cristallisoir(230,220,260,40,0.6)+D.bocal(230,218,w,h,{montee:b.montee?0.2:0,base:22})+D.bougie(230,220,{allumee:false});
    var s=legende('Bougie dans un cristallisoir d’eau'+(w?', coiffée d’un bocal':''))+N.cristallisoir(230,220,240,40,0.6)+(w?N.bocalRenverse(230,218,w*0.9,h,b.montee?0.2:0,22):'')+N.bougie(230,220,b.flamme==='brule')+N.etiq(380,150,'eau colorée',355,205)+(w?N.etiq(60,100,'bocal',230-w*0.45,110):'')+(b.montee?N.etiq(60,150,'eau montée (environ 1/5)',230-w*0.45,218-22-h*0.2):'');
    return {montage:svg(m,'0 0 460 240','Montage : bougie dans un cristallisoir d’eau colorée'+(w?', coiffée d’un '+(r==='grand'?'grand':'petit')+' bocal ; flamme éteinte, eau montée d’environ un cinquième':' ; la bougie brûle, le niveau d’eau ne change pas')+'.'),schema:svg(s,'0 0 460 240','Schéma : '+(w?'bocal renversé sur une bougie dans un cristallisoir ; trait du niveau d’eau monté':'bougie allumée dans un cristallisoir')+'.')};
  };
  C.sceneProportion=function(m,e){
    var p=C.proportion(m,e),fin=p.fraction>=0.2;
    var mo=D.cristallisoir(230,220,260,40,0.6)+D.eprouvette(230,218,60,170,{montee:p.fraction*148/170,base:22,paille:m==='paille',rouille:m==='paille'&&p.fraction>0})+(m==='bougie'?D.bougie(230,220,{allumee:p.fraction===0,h:40}):'');
    var s=legende(m==='bougie'?'Bougie sous une éprouvette graduée':'Paille de fer dans une éprouvette graduée')+N.cristallisoir(230,220,240,40,0.6)+N.eprouvette(230,218,54,170,p.fraction,22)+(m==='bougie'?N.bougie(230,220,p.fraction===0):'')+N.etiq(330,120,'graduations',262,120)+(p.fraction?N.etiq(40,160-148*p.fraction,'niveau : '+p.lecture,203,218-22-148*p.fraction):'');
    return {montage:svg(mo,'0 0 460 240','Montage : '+(m==='bougie'?'bougie':'paille de fer')+' sous une éprouvette graduée renversée sur l’eau ; '+p.lecture+'.'),schema:svg(s,'0 0 460 240','Schéma : éprouvette graduée renversée dans un cristallisoir ; niveau d’eau : '+p.lecture+'.'),fin:fin};
  };
  C.sceneCharbon=function(c){
    var r=C.charbon(c),ferme=c==='ferme';
    var m=D.soucoupe(230,200,false)+D.charbon(230,196,r.braise)+(ferme?D.bocal(230,206,120,130,{}):'')+(c==='souffle'?'<path d="M90 150 q40 -10 80 6 M90 170 q40 -10 80 6" stroke="'+GRIS+'" stroke-width="3" fill="none" stroke-dasharray="6 6"/>'+T(80,140,'air soufflé',11,INK,700):'')+(r.cendres?'<ellipse cx="200" cy="202" rx="14" ry="4" fill="#9a9a9a"/>':'');
    var s=legende('Charbon de bois incandescent '+(ferme?'dans un bocal fermé':c==='souffle'?'à l’air libre, air soufflé':'à l’air libre'))+N.soucoupe(230,200)+N.charbon(230,196)+(ferme?N.bocal(230,206,110,130):'')+N.etiq(330,100,ferme?'bocal fermé':'air libre',ferme?285:260,ferme?110:150)+(c==='souffle'?'<path d="M110 150 h60" '+S+' marker-end="none"/>'+N.etiq(60,140,'air soufflé'):'');
    return {montage:svg(m,'0 0 460 240','Montage : charbon de bois '+(r.braise==='eteinte'?'éteint':r.braise==='vive'?'à incandescence vive':'rougeoyant')+' sur une soucoupe'+(ferme?', sous un bocal fermé':'')+'.'),schema:svg(s,'0 0 460 240','Schéma : charbon sur une soucoupe'+(ferme?', bocal fermé par-dessus':c==='souffle'?', flèche d’air soufflé':'')+'.')};
  };
  C.sceneTest=function(t,sit,comb){
    var r=C.test(t,sit,comb),flamme=sit==='flamme',bleue=comb==='butane',m,s,src=comb==='charbon'?'charbon':comb==='alcool'?'coupelle':'bruleur';
    function source(x,y,on){return src==='coupelle'?D.coupelle(x,y,2,on):src==='charbon'?D.soucoupe(x,y,false)+D.charbon(x,y-4,on?'rouge':'eteinte'):D.bruleur(x,y,{virole:comb==='butane_jaune'?'fermee':'ouverte',flamme:on?(bleue?'bleue':'jaune'):null});}
    function sourceN(x,y,on){return src==='coupelle'?N.coupelle(x,y,1)+N.flamme(x,y-16,on?30:0):src==='charbon'?N.soucoupe(x,y)+N.charbon(x,y-4):N.bruleur(x,y,on);}
    if(t==='buee'){m=source(150,220,flamme)+D.verrePied(150,flamme?120:150,r.positif)+(flamme?'':T(150,60,'témoin : sans flamme',11,INK,700));
      s=legende('Verre à pied froid et sec '+(flamme?'au-dessus de la flamme':'posé, sans flamme'))+sourceN(150,220,flamme)+N.verrePied(150,flamme?126:150)+N.etiq(260,90,r.positif?'buée (eau)':'verre sec',172,flamme?84:110);}
    else{m=source(130,220,false)+D.bocal(330,210,110,120,{trouble:r.positif,chaux:true})+T(330,70,flamme?'bocal où la flamme a brûlé':'témoin : bocal d’air',11,INK,700)+T(330,232,'+ eau de chaux agitée',11,INK,700);
      s=legende('Eau de chaux dans le bocal '+(flamme?'après la combustion':'témoin, air seul'))+sourceN(130,220,false)+N.bocal(330,210,100,120,0.3)+'<line x1="282" y1="174" x2="378" y2="174" '+S+'/>'+N.etiq(400,120,r.positif?'eau de chaux trouble':'eau de chaux claire',380,170);}
    return {montage:svg(m,'0 0 460 240','Montage : '+(t==='buee'?'verre à pied '+(flamme?'au-dessus de la flamme':'témoin')+' ; '+(r.positif?'buée':'verre sec'):'eau de chaux '+(flamme?'dans le bocal où la flamme a brûlé':'dans un bocal d’air (témoin)')+' ; '+(r.positif?'trouble':'claire'))+'.'),schema:svg(s,'0 0 460 240','Schéma : '+(t==='buee'?'verre à pied et flamme ; légende : '+(r.positif?'buée':'verre sec'):'bocal et eau de chaux ; légende : '+(r.positif?'trouble':'claire'))+'.')};
  };
  C.sceneAlcool=function(mo){
    var r=C.alcool(mo),m=D.coupelle(230,220,r.niveau,r.flamme)+(mo==='bocal'?D.bocal(230,224,120,130,{}):'')+(r.chaud?T(360,120,'thermomètre : chaud',11,OR,800):T(360,120,'thermomètre : froid',11,INK,700))+'<rect x="330" y="130" width="12" height="70" rx="6" fill="#fff" stroke="'+GRIS+'"/><rect x="333" y="'+(r.chaud?140:180)+'" width="6" height="'+(r.chaud?57:17)+'" fill="'+(r.chaud?OR:BLEU)+'"/>';
    var s=legende('Coupelle d’alcool '+(mo==='avant'?'avant l’allumage':mo==='bocal'?'coiffée d’un bocal':'allumée'))+N.coupelle(230,220,r.niveau)+N.flamme(230,206,r.flamme?34:0)+(mo==='bocal'?N.bocal(230,224,110,130):'')+N.etiq(330,200,'alcool (niveau '+(r.niveau===3?'plein':'baissé')+')',258,212)+(r.flamme?N.etiq(60,150,'flamme',226,180):'');
    return {montage:svg(m,'0 0 460 240','Montage : coupelle d’alcool '+(r.flamme?'avec une flamme bleue':'sans flamme')+', niveau '+(r.niveau===3?'plein':'baissé')+(mo==='bocal'?', sous un bocal':'')+' ; thermomètre simulé '+(r.chaud?'chaud':'froid')+'.'),schema:svg(s,'0 0 460 240','Schéma : coupelle d’alcool'+(r.flamme?' et flamme':'')+(mo==='bocal'?', bocal renversé':'')+'.')};
  };
  C.sceneFlammeEssai=function(id,mil){
    var r=C.essaiFlamme(id,mil),c=C.carte(id),brule=r.resultat==='brule'||r.resultat==='vive';
    var m='<rect x="150" y="150" width="160" height="60" rx="8" fill="#E8EDF4" stroke="'+GRIS+'"/>'+T(230,186,c.nom,12,INK,800)+(mil==='o2'?D.bocal(230,215,220,180,{})+T(230,60,'bocal de '+C.gaz('oxygene'),11,INK,700):'')+(brule?D.flamme(230,150,{h:r.resultat==='vive'?70:44,couleur:id==='alcool'||id==='butane'?'bleue':'jaune'}):r.resultat==='eteint'?'<path d="M200 150 h60" stroke="#777" stroke-width="4"/>'+T(230,130,'flamme d’essai éteinte',11,INK,700):T(230,130,'ne brûle pas',11,INK,700));
    var s=legende(c.nom+' '+(mil==='o2'?'dans un bocal de '+C.gaz('oxygene'):'dans l’air'))+'<rect x="170" y="160" width="120" height="50" '+S+'/>'+(mil==='o2'?N.bocal(230,215,200,180):'')+N.flamme(230,160,brule?(r.resultat==='vive'?60:36):0)+N.etiq(330,100,r.resultat==='brule'?'brûle':r.resultat==='vive'?'brûle vivement':r.resultat==='eteint'?'éteint la flamme':'ne brûle pas',250,130);
    return {montage:svg(m,'0 0 460 240','Montage : '+r.txt),schema:svg(s,'0 0 460 240','Schéma : '+c.nom.toLowerCase()+' '+(mil==='o2'?'dans un bocal de gaz oxygène':'dans l’air')+' ; légende : '+(brule?'brûle':r.resultat==='eteint'?'éteint la flamme':'ne brûle pas')+'.')};
  };
  C.sceneTransformation=function(id){
    var t=C.transformation(id),chim=t.type==='chimique',m,s;
    if(chim){m=D.soucoupe(140,220,false)+(id==='charbon'?D.charbon(140,216,'rouge'):D.flamme(140,214,{h:44,couleur:id==='alcool'?'bleue':'jaune'}))+'<path d="M200 170 h60" stroke="'+OR+'" stroke-width="4"/><path d="M252 162 l12 8 l-12 8" fill="none" stroke="'+OR+'" stroke-width="4"/>'+D.bocal(340,210,100,110,{trouble:true,chaux:true})+T(340,70,'eau de chaux troublée',11,INK,700)+T(230,150,'pas de retour',11,OR,800);
      s=legende('Réaction chimique : de nouveaux corps')+N.soucoupe(140,220)+(id==='charbon'?N.charbon(140,216):N.flamme(140,214,40))+'<path d="M200 170 h60 M250 162 l10 8 l-10 8" '+S+'/>'+N.bocal(340,210,90,110)+'<line x1="295" y1="178" x2="385" y2="178" '+S+'/>'+N.etiq(300,100,'corps nouveaux',345,120);}
    else{var liq=id==='ebullition';m=D.cristallisoir(140,220,110,60,0.7)+(id==='glace'?'<rect x="110" y="170" width="26" height="22" rx="4" fill="#fff" stroke="'+GRIS+'"/>':id==='karite'||id==='cire_fond'?'<ellipse cx="140" cy="192" rx="30" ry="8" fill="#F5E6B8"/>':'')+(liq?'<circle cx="130" cy="150" r="5" fill="#fff" stroke="'+GRIS+'"/><circle cx="150" cy="140" r="6" fill="#fff" stroke="'+GRIS+'"/>':'')+'<path d="M200 170 h60 M252 162 l12 8 l-12 8 M260 190 h-60 M208 182 l-12 8 l12 8" fill="none" stroke="#2F855A" stroke-width="4"/>'+T(230,150,'retour possible',11,'#2F855A',800)+D.cristallisoir(340,220,110,60,0.7)+T(340,80,'même corps',11,INK,700);
      s=legende('Transformation physique : même corps')+N.cristallisoir(140,220,100,60,0.7)+'<path d="M200 170 h60 M250 162 l10 8 l-10 8 M260 190 h-60 M210 182 l-10 8 l10 8" '+S+'/>'+N.cristallisoir(340,220,100,60,0.7)+N.etiq(300,100,'même corps',340,160);}
    return {montage:svg(m,'0 0 460 240','Montage : '+t.txt),schema:svg(s,'0 0 460 240','Schéma : '+(chim?'réaction chimique, flèche simple vers de nouveaux corps':'transformation physique, double flèche, même corps')+'.')};
  };
  C.sceneButane=function(v,regard){
    var r=C.butane(v),sou=regard==='soucoupe';
    var m=D.bruleur(150,220,{virole:v,flamme:r.flamme,h:sou?44:0})+(sou?D.soucoupe(150,52,r.depot)+T(150,30,r.depot?'dépôt noir de carbone':'soucoupe propre',11,INK,800):'')+'<rect x="330" y="110" width="12" height="90" rx="6" fill="#fff" stroke="'+GRIS+'"/><rect x="333" y="'+(r.chaleur==='tres'?118:150)+'" width="6" height="'+(r.chaleur==='tres'?79:47)+'" fill="'+OR+'"/>'+T(336,100,'chaleur simulée : '+(r.chaleur==='tres'?'très forte':'moins forte'),10,INK,700);
    var s=legende('Brûleur à butane, virole '+(v==='ouverte'?'ouverte':'fermée'))+N.bruleur(150,220,true)+(sou?N.soucoupe(150,70):'')+N.etiq(230,150,'flamme '+r.flamme,160,140)+N.etiq(230,190,'virole '+(v==='ouverte'?'ouverte : beaucoup d’air':'fermée : peu d’air'),168,140)+(sou?N.etiq(230,60,r.depot?'dépôt de carbone':'soucoupe propre',190,70):'');
    return {montage:svg(m,'0 0 460 240','Montage : brûleur à butane, virole '+(v==='ouverte'?'ouverte':'fermée')+', flamme '+r.flamme+(sou?' ; soucoupe '+(r.depot?'noircie par un dépôt de carbone':'restée propre'):'')+' ; chaleur simulée '+(r.chaleur==='tres'?'très forte':'moins forte')+'.'),schema:svg(s,'0 0 460 240','Schéma : brûleur, flamme '+r.flamme+(sou?', soucoupe au-dessus':'')+'.')};
  };
  C.sceneEtapeButane=function(e){
    if(e==='eteint'){var m0=D.bruleur(150,220,{virole:'ouverte',flamme:null})+T(300,120,'robinet fermé : pas de flamme',11,INK,700);
      return {montage:svg(m0,'0 0 460 240','Montage : brûleur à butane éteint, robinet fermé.'),schema:svg(legende('Brûleur à butane, robinet fermé')+N.bruleur(150,220,false)+N.etiq(230,150,'pas de flamme',160,140),'0 0 460 240','Schéma : brûleur sans flamme.')};}
    return C.sceneButane('ouverte',e==='soucoupe'?'soucoupe':'flamme');
  };
  C.scenePiece=function(v,f,d){
    var r=C.piece(v,f,d);
    var m='<rect x="20" y="30" width="300" height="190" fill="#FBF3E4" stroke="'+GRIS+'" stroke-width="2.5"/><rect x="240" y="60" width="60" height="70" fill="'+(f==='ouverte'?'#BEE3F8':'#E2E8F0')+'" stroke="'+GRIS+'"/>'+T(270,150,f==='ouverte'?'fenêtre ouverte':'fenêtre fermée',10,INK,700)+
      '<g transform="translate(90 190) scale(.7)">'+D.bruleur(0,0,{virole:v,flamme:C.butane(v).flamme})+'</g>'+(r.suie?'<rect x="22" y="32" width="296" height="40" fill="#333" opacity=".25"/>':'')+
      '<circle cx="190" cy="140" r="14" fill="'+(r.etat==='bien'?'#F6D5B8':r.etat==='mal'?'#E9C5A6':'#C9A890')+'" stroke="'+INK+'"/><rect x="176" y="156" width="28" height="50" rx="8" fill="'+(r.etat==='danger'?OR:'#4A5568')+'"/>'+T(190,230,C.lib(C.ETATS,r.etat),11,r.etat==='danger'?OR:INK,800)+
      D.jauge(340,60,100,r.oxygene,3,C.gaz('oxygene'))+D.jauge(340,110,100,r.toxique,3,'gaz toxique invisible')+T(340,160,'durée : '+C.lib(C.DUREES,d).toLowerCase(),11,INK,700,'start')+T(340,180,'jauges simulées',10,'#6b7480',600,'start');
    var s=legende('Pièce : réchaud, fenêtre, personne')+'<rect x="40" y="40" width="260" height="170" '+S+'/><rect x="230" y="60" width="50" height="60" '+S+'/>'+(f==='ouverte'?'<line x1="255" y1="60" x2="255" y2="120" '+S+'/>':'')+N.bruleur(90,200,true)+'<circle cx="190" cy="140" r="12" '+S+'/><line x1="190" y1="152" x2="190" y2="200" '+S+'/>'+N.etiq(320,70,f==='ouverte'?'fenêtre ouverte':'fenêtre fermée',280,80)+N.etiq(320,200,'réchaud, virole '+(v==='ouverte'?'ouverte':'fermée'),120,190);
    return {montage:svg(m,'0 0 460 240','Simulation : réchaud virole '+(v==='ouverte'?'ouverte':'fermée')+', fenêtre '+(f==='ouverte'?'ouverte':'fermée')+', '+C.lib(C.DUREES,d).toLowerCase()+'. '+r.txt),schema:svg(s,'0 0 460 240','Schéma : pièce avec réchaud, fenêtre '+(f==='ouverte'?'ouverte':'fermée')+' et personne.')};
  };
  C.sceneTriangle=function(g){
    var r=C.triangle(g);
    var m=D.papier(150,200,{brule:r.brule,cendre:!r.brule&&g!=='froid',bocal:g==='bocal',sable:g==='sable',eau:g==='eau'})+(g==='ecarter'?'<path d="M150 140 l50 -30" stroke="'+GRIS+'" stroke-width="3" stroke-dasharray="6 6"/><path d="M210 150 l10 -22 h36 l-8 22z" fill="#FFF8E7" stroke="#C9B890"/>':'')+'<g transform="translate(240 0)">'+D.triangle(100,130,70,r.sommet)+'</g>';
    var s=legende('Feuille de papier sur une soucoupe'+(g==='bocal'?', bocal par-dessus':''))+N.soucoupe(150,208)+'<path d="M126 200 l8 -18 h34 l-6 18z" '+S+'/>'+N.flamme(150,180,r.brule?36:0)+(g==='bocal'?N.bocal(150,208,96,110):'')+(g==='sable'||g==='eau'?'<line x1="120" y1="196" x2="180" y2="196" '+S+' stroke-dasharray="4 4"/>':'')+N.etiq(260,120,r.brule?'flamme':g==='froid'?'pas d’allumage':'éteint : '+(r.sommet?C.lib(C.SOMMETS,r.sommet).toLowerCase()+' supprimé':''),180,170);
    return {montage:svg(m,'0 0 460 240','Montage : '+r.txt+' Triangle du feu dessiné'+(r.sommet?', côté « '+C.lib(C.SOMMETS,r.sommet)+' » effacé':', complet')+'.'),schema:svg(s,'0 0 460 240','Schéma : papier sur une soucoupe'+(g==='bocal'?', bocal renversé':'')+' ; '+(r.brule?'flamme':'pas de flamme')+'.')};
  };

  /* ---------- vignettes pour les classements ---------- */
  function vue(inner,label,vb){return svg(inner,vb||'0 0 160 110',label);}
  C.vueLieu=function(id){
    var l=C.air(id),g='';
    if(id==='usine')g='<rect x="40" y="50" width="70" height="45" fill="#A0AEC0"/><rect x="100" y="20" width="14" height="75" fill="#718096"/>'+D.fumee(107,18,3);
    else if(id==='carrefour')g='<rect x="20" y="70" width="50" height="22" rx="6" fill="#E53E3E"/><rect x="85" y="68" width="55" height="24" rx="6" fill="#3182CE"/><circle cx="32" cy="94" r="6" fill="#222"/><circle cx="60" cy="94" r="6" fill="#222"/><circle cx="96" cy="94" r="6" fill="#222"/><circle cx="130" cy="94" r="6" fill="#222"/>'+D.fumee(12,70,2);
    else if(id==='ordures')g='<path d="M40 95 l10 -30 h60 l10 30z" fill="#8B5E3C"/>'+D.flamme(80,66,{h:30,fumee:true});
    else if(id==='fourneau')g='<rect x="60" y="60" width="40" height="35" rx="4" fill="#4A5568"/>'+D.charbon(80,62,'rouge')+D.fumee(80,40,2);
    else if(id==='piste')g='<rect x="0" y="80" width="160" height="20" fill="#D9B36C"/><circle cx="60" cy="60" r="18" fill="#D9B36C" opacity=".5"/><circle cx="95" cy="52" r="22" fill="#D9B36C" opacity=".45"/>';
    else if(id==='marche')g='<path d="M20 60 h120 l-15 -25 h-90z" fill="#2F855A"/><rect x="30" y="60" width="100" height="35" fill="#E2E8F0"/>';
    else if(id==='lagune')g='<path d="M0 80 q20 -10 40 0 t40 0 t40 0 t40 0 v30 h-160z" fill="'+EAU+'"/><circle cx="130" cy="30" r="12" fill="'+JAUNE+'"/>';
    else g='<circle cx="50" cy="55" r="22" fill="#2F855A"/><rect x="46" y="70" width="8" height="25" fill="#8B5E3C"/><circle cx="110" cy="50" r="24" fill="#38A169"/><rect x="106" y="70" width="8" height="25" fill="#8B5E3C"/>';
    var jauge='<rect x="10" y="6" width="140" height="10" rx="5" fill="#E2E8F0"/><rect x="10" y="6" width="'+(l.indice==='bon'?46:l.indice==='moyen'?92:140)+'" height="10" rx="5" fill="'+(l.indice==='bon'?'#2F855A':l.indice==='moyen'?JAUNE:OR)+'"/>'+T(150,28,'capteur : '+C.lib(C.INDICES,l.indice).toLowerCase(),10,INK,700,'end');
    return vue(g+jauge,l.nom+'. Capteur de qualité de l’air (simulé) : '+C.lib(C.INDICES,l.indice).toLowerCase()+'.');
  };
  C.vueScene=function(id){
    var g='';
    if(id==='sc_feu')g='<rect x="10" y="60" width="140" height="35" fill="#718096"/>'+D.flamme(40,60,{h:40})+D.flamme(80,60,{h:50,fumee:true})+D.flamme(120,60,{h:36});
    else if(id==='sc_bouteille')g='<rect x="60" y="40" width="40" height="55" rx="8" fill="#34457A"/><path d="M40 50 l-15 -10 M120 50 l15 -10 M50 30 l-8 -14 M110 30 l8 -14 M80 25 v-15" stroke="'+OR+'" stroke-width="4" stroke-linecap="round"/>';
    else if(id==='sc_piece')g='<rect x="10" y="20" width="140" height="80" fill="#FBF3E4" stroke="'+GRIS+'"/><rect x="110" y="35" width="25" height="30" fill="#E2E8F0" stroke="'+GRIS+'"/><g transform="translate(40 95) scale(.4)">'+D.charbon(0,0,'rouge')+'</g><circle cx="80" cy="60" r="9" fill="#E9C5A6" stroke="'+INK+'"/><rect x="72" y="70" width="16" height="25" rx="5" fill="#4A5568"/>';
    else g='<rect x="10" y="20" width="140" height="80" fill="#333" opacity=".35"/><circle cx="80" cy="55" r="10" fill="#E9C5A6" stroke="'+INK+'"/><rect x="71" y="66" width="18" height="28" rx="5" fill="#4A5568"/>'+D.fumee(40,90,3)+D.fumee(120,90,3);
    var sc=C.SCENES.filter(function(x){return x.id===id;})[0];return vue(g,'Scène : '+sc.label+'.');
  };
  C.vuePicto=function(id){
    var p=C.picto(id),g='';
    function losange(inner){return '<path d="M80 3 L133 55 L80 107 L27 55Z" fill="#fff" stroke="#D32F2F" stroke-width="6"/>'+inner;}
    function flammeN(x,y,h){return '<path d="M'+x+' '+(y-h)+' C'+(x+h*.08)+' '+(y-h*.55)+' '+(x+h*.55)+' '+(y-h*.42)+' '+(x+h*.28)+' '+(y-h*.08)+' C'+(x+h*.82)+' '+(y+h*.12)+' '+(x+h*.42)+' '+y+' '+x+' '+y+' C'+(x-h*.46)+' '+y+' '+(x-h*.5)+' '+(y-h*.37)+' '+(x-h*.14)+' '+(y-h*.62)+' C'+(x-h*.2)+' '+(y-h*.32)+' '+(x-h*.04)+' '+(y-h*.18)+' '+x+' '+(y-h)+'Z" fill="#111"/>';}
    if(id==='inflammable')g=losange(flammeN(80,79,43)+'<path d="M80 72 C75 79 75 83 80 85 C85 83 85 79 80 72Z" fill="#fff"/>');
    else if(id==='comburant')g=losange(flammeN(80,68,31)+'<circle cx="80" cy="78" r="14" fill="#111"/><circle cx="80" cy="78" r="8" fill="#fff"/>');
    else if(id==='explosif')g=losange('<circle cx="78" cy="62" r="12" fill="#111"/><path d="M84 52l8-10 3-10 M70 53l-7-8-7-3 M90 61h14 M66 64H52 M73 72l-8 9 M87 71l8 9" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/><path d="M93 37l4-5 M57 42l-5-3 M106 59h6" stroke="#111" stroke-width="3" stroke-linecap="round"/>');
    else if(id==='gaz')g=losange('<g transform="rotate(-25 80 59)"><rect x="54" y="49" width="50" height="20" rx="10" fill="#111"/><path d="M50 55h6m48 0h8v8h-8m-4-14v-5h8" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/></g>');
    else if(id==='corrosif')g=losange('<path d="M57 35l18 7-5 12-18-7zm29 11l18 7-5 12-18-7z" fill="#111"/><path d="M62 50l-5 10m35 0 5 8" stroke="#111" stroke-width="4" stroke-linecap="round"/><path d="M56 69c-7-1-12 2-14 7l12 9c6 4 14 4 20 1l8-5-5-7-9 4-5-6zM88 83h25v7H88z" fill="#111"/><path d="M47 77l6 4m8 1 4 2" stroke="#fff" stroke-width="2"/>');
    else if(id==='toxique')g=losange('<path d="M80 37c-13 0-20 9-20 21 0 8 4 12 9 15v7h22v-7c5-3 9-7 9-15 0-12-7-21-20-21z" fill="#111"/><circle cx="72" cy="57" r="4" fill="#fff"/><circle cx="88" cy="57" r="4" fill="#fff"/><path d="M77 65l3 5 3-5m-11 13v8m8-8v8m8-8v8M57 75l46 24m0-24L57 99" stroke="#111" stroke-width="5" stroke-linecap="round"/>');
    else if(id==='nocif')g=losange('<rect x="75" y="37" width="10" height="34" rx="5" fill="#111"/><circle cx="80" cy="82" r="6" fill="#111"/>');
    else if(id==='sante')g=losange('<circle cx="80" cy="40" r="9" fill="#111"/><path d="M66 54q14-9 28 0l8 30H58z" fill="#111"/><path d="M80 58l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff"/>');
    else if(id==='environnement')g=losange('<path d="M58 82V52m0 7-12-10m12 18 13-13m-13 25 14-9M58 53l-8-9 8 3 6-9 1 12 9-3-10 10" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M91 76q9-10 19 0-10 10-19 0zm19 0 8-7v14zM94 76h9m-6-3 7 6" fill="#111"/><circle cx="98" cy="74" r="1.5" fill="#fff"/><path d="M86 89h30" stroke="#111" stroke-width="4" stroke-linecap="round"/>');
    else if(id==='extincteur')g='<rect x="20" y="10" width="120" height="90" rx="8" fill="#D32F2F"/><rect x="50" y="40" width="30" height="50" rx="7" fill="#fff"/><rect x="60" y="31" width="10" height="10" fill="#fff"/><path d="M52 27h28v6H52z" fill="#fff"/><path d="M80 30c8 0 12 6 12 16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="56" y="54" width="18" height="14" fill="#D32F2F"/><path d="M98 90c-9-14 1-24 3-34 5 6 6 11 5 16 3-3 5-7 5-12 10 12 10 24 0 30z" fill="#fff"/>';
    else if(id==='sortie')g='<rect x="10" y="15" width="140" height="80" rx="6" fill="#2F855A"/><rect x="104" y="26" width="30" height="58" fill="#fff"/><circle cx="56" cy="34" r="7" fill="#fff"/><path d="M57 44l6 18m-6-14l-13 8m12-6l16-3m-9 21l-12 16m12-16l14 8l-3 10" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M88 55h10m-4-5l5 5-5 5" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>';
    else if(id==='flamme_interdite')g='<circle cx="80" cy="55" r="46" fill="#fff" stroke="#D32F2F" stroke-width="8"/><path d="M80 30C90 44 102 54 98 68C95 80 86 84 80 84C72 84 63 78 62 66C61 56 68 50 72 42C74 48 77 50 80 48C78 42 78 36 80 30Z" fill="#111"/><line x1="48" y1="23" x2="112" y2="87" stroke="#D32F2F" stroke-width="8"/>';
    else g='<rect x="20" y="10" width="120" height="90" rx="8" fill="#2F855A"/><path d="M50 40C50 34 56 30 62 32L70 36C73 38 74 41 72 44L68 50C72 58 78 64 86 68L92 64C95 62 98 63 100 66L104 74C106 80 102 86 96 86C70 86 48 64 50 40Z" fill="#fff"/>';
    return vue(g,'Pictogramme : '+p.alt+'. ',p.id==='flamme_interdite'?'0 0 160 110':'0 0 160 110');
  };
  C.vueMaison=function(id){
    var s=C.MAISON.filter(function(x){return x.id===id;})[0],g='';
    if(id==='rideau')g='<rect x="100" y="10" width="40" height="90" fill="#C53030" opacity=".7"/>'+D.bougie(70,95,{allumee:true,h:40});
    else if(id==='bouteille')g='<rect x="30" y="40" width="40" height="55" rx="8" fill="#34457A"/><rect x="90" y="60" width="50" height="35" rx="4" fill="#4A5568"/>'+D.charbon(115,62,'rouge');
    else if(id==='groupe')g='<rect x="10" y="20" width="140" height="80" fill="#FBF3E4" stroke="'+GRIS+'"/><rect x="50" y="55" width="60" height="35" rx="6" fill="#E53E3E"/><rect x="100" y="40" width="8" height="20" fill="#333"/>'+D.fumee(104,38,3);
    else if(id==='chambre')g='<rect x="10" y="20" width="140" height="80" fill="#FBF3E4" stroke="'+GRIS+'"/><rect x="20" y="60" width="60" height="30" rx="6" fill="#718096"/><rect x="105" y="70" width="30" height="25" rx="4" fill="#4A5568"/>'+D.charbon(120,72,'rouge');
    else if(id==='essence')g='<rect x="30" y="50" width="36" height="45" rx="6" fill="#E53E3E"/>'+T(48,78,'essence',9,'#fff',800)+D.flamme(115,95,{h:40});
    else g='<rect x="50" y="60" width="60" height="30" fill="#F6E05E" stroke="#B7791F"/><line x1="60" y1="60" x2="60" y2="40" stroke="#8B5E3C" stroke-width="4"/><circle cx="60" cy="38" r="5" fill="#C53030"/>';
    return vue(g,'Situation : '+s.nom+'.');
  };
  C.dessin=D;
})();
