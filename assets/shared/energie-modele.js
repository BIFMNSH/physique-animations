/* NohobaLab · 6e Côte d'Ivoire · lot Énergie (ENE-01 à ENE-10) · « Pour aller plus loin », hors programme officiel.
   Modèle QUALITATIF : formes d'énergie, effets du courant, pile qui se vide, lampe (utile / dissipée), cellule photovoltaïque,
   chaînes énergétiques. Aucun joule, watt, kWh ni rendement. Les niveaux dessinés sont simulés et signalés comme tels.
   Conventions de dessin : rectangle = réservoir ou source, ovale = convertisseur, flèche = transfert avec la forme d'énergie écrite dessus.
   Garde-fous : l'énergie dissipée n'est jamais « perdue » (elle passe au milieu extérieur) ; une pile n'est pas une ressource non renouvelable. */
(function(){
  'use strict';
  var A=window.NohobaAtelier,NE={},INK='#243049',OR='#C2410C';
  function E(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function T(x,y,t,s,c,w,a){return A.T(x,y,t,s,c,w,a);}

  /* ---------- formes d'énergie ---------- */
  NE.FORMES=[['electrique','Énergie électrique'],['lumineuse','Énergie lumineuse'],['thermique','Énergie thermique (chaleur)'],['mouvement','Énergie de mouvement'],['chimique','Énergie chimique']];
  NE.forme=function(id){var f=NE.FORMES.filter(function(x){return x[0]===id;})[0];if(!f)throw new Error('forme inconnue : '+id);return f[1];};
  var COURT={electrique:'énergie électrique',lumineuse:'énergie lumineuse',thermique:'énergie thermique',mouvement:'énergie de mouvement',chimique:'énergie chimique'};
  NE.formeCourte=function(id){if(!COURT[id])throw new Error('forme inconnue : '+id);return COURT[id];};

  /* ---------- ENE-01 : effets du courant (effet recherché de l'appareil) ---------- */
  NE.APPAREILS=[['lampe','Une lampe'],['moteur','Un petit moteur'],['fil','Un fil résistant']];
  var EFFETS={
    lampe:{effet:'lumiere',txt:'La lampe est allumée : le courant produit de la lumière.'},
    moteur:{effet:'mouvement',txt:'Le moteur tourne : le courant produit du mouvement.'},
    fil:{effet:'chaleur',txt:'Le fil devient chaud : le courant produit de la chaleur (simulation : on ne touche pas un fil qui chauffe).'}};
  NE.EFFETS_NOMS=[['lumiere','De la lumière'],['chaleur','De la chaleur'],['mouvement','Du mouvement']];
  NE.effet=function(app){var e=EFFETS[app];if(!e)throw new Error('appareil inconnu : '+app);return {effet:e.effet,txt:e.txt};};

  /* ---------- ENE-02 : formes d'énergie dans des appareils ---------- */
  NE.CONVERTISSEURS=[['ventilo','Un ventilateur sur pile'],['torche','Une lampe torche'],['chargeur','Un chargeur solaire'],['bouilloire','Une bouilloire électrique'],['pile','Une pile neuve']];
  var CONV={
    ventilo:{recoit:'electrique',obtient:'mouvement'},
    torche:{recoit:'electrique',obtient:'lumineuse'},
    chargeur:{recoit:'lumineuse',obtient:'electrique'},
    bouilloire:{recoit:'electrique',obtient:'thermique'},
    pile:{recoit:'chimique',obtient:'electrique'}};
  NE.convertit=function(app){var c=CONV[app];if(!c)throw new Error('appareil inconnu : '+app);
    return {recoit:c.recoit,obtient:c.obtient,txt:NE.forme(c.recoit)+' reçue → '+NE.forme(c.obtient)+' obtenue.'};};

  /* ---------- ENE-03 : la pile se vide, l'énergie passe à la lampe (niveaux simulés, qualitatifs) ---------- */
  NE.MOMENTS=[['neuve','Pile neuve'],['soir1','Après un soir'],['soirs','Après plusieurs soirées'],['vide','Pile usée']];
  var PILE={
    neuve:{niveau:3,pile:'pleine',lampe:'forte',txt:'La pile est pleine et la lampe éclaire bien.'},
    soir1:{niveau:2,pile:'à moitié pleine',lampe:'moyenne',txt:'La pile est à moitié pleine ; la lampe éclaire un peu moins.'},
    soirs:{niveau:1,pile:'presque vide',lampe:'faible',txt:'La pile est presque vide ; la lampe éclaire très peu.'},
    vide:{niveau:0,pile:'vide',lampe:'eteinte',txt:'La pile est vide : elle ne peut plus fournir d’énergie, la lampe ne s’allume plus.'}};
  NE.pileLampe=function(m){var p=PILE[m];if(!p)throw new Error('moment inconnu : '+m);
    return {niveau:p.niveau,pile:p.pile,lampe:p.lampe,txt:p.txt,transfert:p.niveau>0,simule:true};};

  /* ---------- ENE-04 : la lampe chauffe (niveaux qualitatifs simulés) ---------- */
  NE.DUREES=[['court','Allumée 1 minute'],['moyen','Allumée 10 minutes'],['long','Allumée 30 minutes']];
  var CHAUD={court:{n:1,mot:'tiède'},moyen:{n:2,mot:'chaude'},long:{n:3,mot:'très chaude'}};
  NE.lampeChaleur=function(d){var c=CHAUD[d];if(!c)throw new Error('durée inconnue : '+d);
    return {lumiere:true,chaleur:c.n,mot:c.mot,simule:true,txt:'La lampe éclaire et le verre est '+c.mot+'. La lampe donne de la lumière et de la chaleur.'};};
  /* utile ou dissipée : dépend de la fonction de l'appareil */
  NE.FONCTIONS=[['eclairer','éclairer une pièce'],['chauffer','chauffer des poussins sous une lampe chauffante']];
  NE.utilite=function(fonction,forme){
    if(fonction!=='eclairer'&&fonction!=='chauffer')throw new Error('fonction inconnue : '+fonction);
    if(forme!=='lumineuse'&&forme!=='thermique')throw new Error('forme non prévue : '+forme);
    var utile=(fonction==='eclairer')?'lumineuse':'thermique';
    return forme===utile?'utile':'dissipee';};

  /* ---------- ENE-06 : cellule photovoltaïque (éclairement qualitatif simulé) ---------- */
  NE.ECLAIREMENTS=[['soleil','Plein soleil'],['nuage','Ciel nuageux'],['bureau','Lampe de bureau allumée près de la cellule'],['couvert','Cellule couverte par un carton']];
  var ECL={soleil:{n:3,lampe:'forte',txt:'La cellule reçoit beaucoup de lumière : la lampe éclaire fort.'},
    nuage:{n:1,lampe:'faible',txt:'La cellule reçoit peu de lumière : la lampe éclaire faiblement.'},
    bureau:{n:2,lampe:'moyenne',txt:'La lampe de bureau éclaire la cellule : la petite lampe éclaire correctement.'},
    couvert:{n:0,lampe:'eteinte',txt:'La cellule ne reçoit pas de lumière : la lampe est éteinte.'}};
  NE.cellule=function(e){var c=ECL[e];if(!c)throw new Error('éclairement inconnu : '+e);
    return {niveau:c.n,lampe:c.lampe,txt:c.txt,allumee:c.n>0,simule:true};};

  /* ---------- ENE-08 : ressources ---------- */
  NE.RESSOURCES=[
    {id:'soleil',nom:'Le Soleil',type:'renouvelable',pourquoi:'Le Soleil brille chaque jour : cette ressource se renouvelle à l’échelle humaine.'},
    {id:'vent',nom:'Le vent',type:'renouvelable',pourquoi:'Le vent revient tout le temps : on ne l’épuise pas en l’utilisant.'},
    {id:'eau',nom:'Un cours d’eau (barrage)',type:'renouvelable',pourquoi:'L’eau des rivières se renouvelle avec le cycle de l’eau et les pluies.'},
    {id:'petrole',nom:'Le pétrole',type:'non_renouvelable',pourquoi:'Le pétrole s’est formé en millions d’années : on l’utilise bien plus vite qu’il ne se reforme.'},
    {id:'charbon',nom:'Le charbon',type:'non_renouvelable',pourquoi:'Le charbon s’est formé en millions d’années : le stock s’épuise.'},
    {id:'gaz',nom:'Le gaz naturel',type:'non_renouvelable',pourquoi:'Le gaz naturel s’est formé en millions d’années : le stock s’épuise.'},
    {id:'pile',nom:'Une pile',type:'reservoir',pourquoi:'Une pile n’est pas une ressource d’énergie de la nature : c’est un petit réservoir qui se vide quand on l’utilise.'}];
  NE.ressource=function(id){var r=NE.RESSOURCES.filter(function(x){return x.id===id;})[0];if(!r)throw new Error('ressource inconnue : '+id);return r;};

  /* ---------- ENE-09 : installations (scénarios fictifs d'école ; seuls les deux repères signés sont réels) ---------- */
  NE.INSTALLATIONS=[['solaire','Panneaux solaires'],['eolienne','Éolienne'],['gaz','Groupe électrogène à gaz']];
  NE.LIEUX=[
    ['A','École A : soleil toute l’année, vent faible, grande cour dégagée, aucun gaz livré'],
    ['B','École B : sur une colline très ventée, grande cour, soleil moyen, gaz non disponible'],
    ['C','École C : en ville, toit très petit, réseau de gaz à côté, bruit gênant pour les classes']];
  var INST={
    A:{solaire:{ok:true,txt:'Le soleil est abondant et la cour est grande : l’installation produit bien.'},
       eolienne:{ok:false,txt:'Le vent est faible : une éolienne tournerait peu.'},
       gaz:{ok:false,txt:'Aucun gaz n’est livré : le groupe ne peut pas fonctionner.'}},
    B:{solaire:{ok:false,txt:'Le soleil est moyen : les panneaux produiraient moins, mais ils fonctionnent. À comparer avec le vent.'},
       eolienne:{ok:true,txt:'Le vent est fort et régulier sur la colline : une éolienne produit bien.'},
       gaz:{ok:false,txt:'Le gaz n’est pas disponible : le groupe ne peut pas fonctionner.'}},
    C:{solaire:{ok:false,txt:'Le toit est très petit : peu de panneaux, peu d’énergie.'},
       eolienne:{ok:false,txt:'En ville, le vent est gêné par les bâtiments et le bruit gêne les classes.'},
       gaz:{ok:true,txt:'Le gaz est à côté, mais le groupe est bruyant et il brûle une ressource non renouvelable.'}}};
  NE.installation=function(lieu,inst){var l=INST[lieu];if(!l)throw new Error('lieu inconnu : '+lieu);var i=l[inst];if(!i)throw new Error('installation inconnue : '+inst);
    return {adaptee:i.ok,txt:i.txt,renouvelable:inst!=='gaz',emet:inst==='gaz'?'brûle du gaz en fonctionnant : il émet du dioxyde de carbone':'n’émet pas de gaz en fonctionnant',
      precision:'« n’émet pas » concerne le fonctionnement : fabriquer et installer le matériel a aussi un impact.'};};
  /* repères réels, datés, sourcés (à garder identiques dans le registre des écarts) */
  NE.REPERES=[
    {texte:'En Côte d’Ivoire, la production d’électricité vient en grande partie de centrales thermiques, notamment à gaz (environ trois quarts), puis des barrages hydroélectriques (environ un quart) ; le solaire reste encore très petit.',
     source:'Le360 Afrique, 2 mai 2026, d’après le ministère des Mines, du Pétrole et de l’Énergie',url:'https://afrique.le360.ma/economie/cote-divoire-le-gaz-naturel-un-pilier-de-la-production-electrique_VVVPA3IXVFGA5O63VSYW4F4A3Q/'},
    {texte:'À Boundiali, dans le nord, une centrale solaire de 68 000 panneaux sur 36 hectares fonctionne depuis juin 2023.',
     source:'AFP via Connaissance des énergies, 7 juin 2024',url:'https://www.connaissancedesenergies.org/afp/une-premiere-centrale-solaire-photovoltaique-en-cote-divoire-symbole-de-la-transition-energetique-240607'}];

  /* ---------- chaînes énergétiques : 4 blocs, 3 flèches, 7 repères ---------- */
  NE.ROLES=['reservoir','recue','convertisseur','utile','recepteur','dissipee','milieu'];
  NE.ROLES_NOMS={reservoir:'le réservoir ou la source d’énergie',recue:'la forme d’énergie reçue par le convertisseur',convertisseur:'le convertisseur (il change la forme de l’énergie)',
    utile:'la forme d’énergie utile (celle qu’on veut)',recepteur:'le récepteur de l’énergie utile',dissipee:'la forme d’énergie dissipée (non voulue)',milieu:'le milieu extérieur qui reçoit l’énergie dissipée'};
  NE.CHAINES={
    pileLampe:{titre:'Lampe de poche d’Awa',reservoir:'La pile',recue:'electrique',convertisseur:'La lampe',utile:'lumineuse',recepteur:'La pièce éclairée',dissipee:'thermique',milieu:'L’air autour de la lampe',
      faux:{reservoir:['La lampe','Le fil','L’air'],recue:['lumineuse','thermique','mouvement'],convertisseur:['La pile','L’interrupteur','L’air'],utile:['thermique','electrique','chimique'],
        recepteur:['La pile','La lampe','Le fil'],dissipee:['lumineuse','electrique','mouvement'],milieu:['La pile','Le fil','La pièce éclairée']}},
    panneau:{titre:'Panneau solaire de l’école',reservoir:'Le Soleil',recue:'lumineuse',convertisseur:'Le panneau photovoltaïque',utile:'electrique',recepteur:'La lampe de l’école',dissipee:'thermique',milieu:'L’air extérieur'},
    ventilateur:{titre:'Ventilateur solaire',reservoir:'Le Soleil',recue:'lumineuse',convertisseur:'Le ventilateur solaire (cellule et moteur)',utile:'mouvement',recepteur:'La personne rafraîchie',dissipee:'thermique',milieu:'L’air autour de l’appareil'},
    eolienne:{titre:'Éolienne de l’école',reservoir:'Le vent',recue:'mouvement',convertisseur:'L’éolienne',utile:'electrique',recepteur:'Les lampes de l’école',dissipee:'thermique',milieu:'L’air extérieur'},
    gaz:{titre:'Groupe électrogène à gaz',reservoir:'Le gaz (réserve)',recue:'chimique',convertisseur:'Le groupe électrogène',utile:'electrique',recepteur:'Les lampes de l’école',dissipee:'thermique',milieu:'L’air extérieur'},
    dynamo:{titre:'Lampe à dynamo',reservoir:'La personne qui tourne la manivelle',recue:'mouvement',convertisseur:'La lampe à dynamo',utile:'lumineuse',recepteur:'La pièce éclairée',dissipee:'thermique',milieu:'L’air autour de la lampe'}};
  var FAUX_GLOBAL=['La pile','Le fil','énergie chimique'];
  /* libellé d'un repère (bloc ou forme) */
  function nomRole(ch,r){var v=ch[r];return (r==='recue'||r==='utile'||r==='dissipee')?COURT[v]:v;}
  NE.nomRole=nomRole;
  /* options d'un repère : bonne réponse + 3 distracteurs, ordre stable (alphabétique pour ne pas révéler la bonne) */
  NE.optionsGuide=function(ch,r){
    var f=ch.faux&&ch.faux[r];if(!f)throw new Error('pas de distracteurs pour '+r);
    var isForme=(r==='recue'||r==='utile'||r==='dissipee'),l=[ch[r]].concat(f).map(function(x){return [x,isForme?COURT[x]:x];});
    return l.sort(function(a,b){return a[1].localeCompare(b[1],'fr');});};
  NE.banque=function(ch){
    var l=NE.ROLES.map(function(r){return nomRole(ch,r);}).concat(FAUX_GLOBAL.filter(function(x){return NE.ROLES.every(function(r){return nomRole(ch,r)!==x&&nomRole(ch,r)!==COURT[x];});}).map(function(x){return COURT[x]||x;}));
    var seen={};return l.filter(function(x){if(seen[x])return false;seen[x]=1;return true;}).sort(function(a,b){return a.localeCompare(b,'fr');}).map(function(x){return [x,x];});};

  /* ---------- dessins ---------- */
  function flecheV(x,y1,y2,col){return '<path d="M'+x+' '+y1+' V'+(y2-8)+'" stroke="'+col+'" stroke-width="3.5" fill="none"/><path d="M'+(x-8)+' '+(y2-12)+' L'+x+' '+y2+' L'+(x+8)+' '+(y2-12)+' Z" fill="'+col+'"/>';}
  function flecheH(x1,x2,y,col){return '<path d="M'+x1+' '+y+' H'+(x2-8)+'" stroke="'+col+'" stroke-width="3.5" fill="none"/><path d="M'+(x2-12)+' '+(y-8)+' L'+x2+' '+y+' L'+(x2-12)+' '+(y+8)+' Z" fill="'+col+'"/>';}
  function bloc(rect,cx,cy,w,h,txt,montre,n,tag){
    var s=rect?'<rect x="'+(cx-w/2)+'" y="'+(cy-h/2)+'" width="'+w+'" height="'+h+'" rx="8"':'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(w/2)+'" ry="'+(h/2)+'"';
    s+=' fill="'+(montre?'#fff':'#F1F4F9')+'" stroke="'+INK+'" stroke-width="2.5"'+(montre?'':' stroke-dasharray="6 5"')+'/>';
    if(montre){var mots=txt.split(' '),l1='',l2='',i;for(i=0;i<mots.length;i++){if((l1+' '+mots[i]).trim().length<=(rect?15:21)||!l1)l1=(l1+' '+mots[i]).trim();else l2=(l2+' '+mots[i]).trim();}
      s+=l2?T(cx,cy-3,l1,13,INK,700)+T(cx,cy+14,l2,13,INK,700):T(cx,cy+5,l1,14,INK,700);}
    else s+=T(cx,cy+7,'?',22,'#8A94A4',800);
    return s;}
  /* chaîne : montres = {role:true} pour les repères déjà donnés ; numeros = afficher les repères (niveau guidé) */
  NE.chaineSvg=function(ch,montres,numeros){
    montres=montres||{};var s='',m=function(r){return !!montres[r];};
    var lab=function(r,x,y,anchor){return m(r)?T(x,y,nomRole(ch,r),13,OR,800,anchor):(numeros?T(x,y,'?',16,'#8A94A4',800,anchor):'');};
    s+=bloc(true,115,38,190,52,ch.reservoir,m('reservoir'));
    s+=flecheV(115,66,128,INK)+lab('recue',128,100,'start');
    s+=bloc(false,115,170,210,84,ch.convertisseur,m('convertisseur'));
    s+=flecheV(115,214,282,INK)+lab('utile',128,252,'start');
    s+=bloc(true,115,312,190,52,ch.recepteur,m('recepteur'));
    s+=flecheH(222,318,170,'#7A5C00')+lab('dissipee',270,152,'middle');
    s+=bloc(true,385,170,120,64,ch.milieu,m('milieu'));
    if(numeros){s+=numero(30,38,1)+numero(190,100,2)+numero(30,170,3)+numero(190,252,4)+numero(30,312,5)+numero(270,196,6)+numero(385,120,7);}
    var etiq=NE.ROLES.map(function(r){return nomRole(ch,r);}).filter(function(x,i){return m(NE.ROLES[i]);});
    return A.svg(s,'0 0 460 350','Chaîne énergétique : '+ch.titre+'. '+(etiq.length?'Éléments donnés : '+etiq.join(', ')+'.':'Aucun élément n’est encore donné.')+' Rectangle : réservoir, récepteur ou milieu ; ovale : convertisseur ; flèche : transfert.');};
  function numero(x,y,n){return A.numero(x,y,n);}

  /* pile (boîte à niveau) : bornes à droite en (90,90) « + » et (90,118) « − » ; le niveau est un dessin qualitatif simulé */
  function pileBoite(niv){var h=niv*14;
    return '<g transform="translate(60 80)"><rect x="-30" y="-8" width="60" height="62" rx="8" fill="#EEF2FA" stroke="#9FB0C4" stroke-width="2.5"/><rect x="-22" y="'+(48-h)+'" width="44" height="'+h+'" fill="#F0B400"/>'+T(0,-16,'Pile',13,INK,700)+'<circle cx="30" cy="10" r="6" fill="#B7BDC7" stroke="#6b7480"/><circle cx="30" cy="38" r="6" fill="#B7BDC7" stroke="#6b7480"/></g>'+T(106,80,'+',16,'#C03A2E',800)+T(106,136,'−',16,'#2B5EA8',800);}
  /* fils reliant la pile à la lampe : culot (214,129) et plot (230,148) quand la lampe est en (230,90) */
  function filsLampe(){return A.fil('M90 90 H150 V129 H214','#6b7480')+A.fil('M90 118 V172 H230 V148','#6b7480');}
  function schemaLampe(){return A.schema({pile:'normale',cotes:{droite:'lampe',bas:'fil',gauche:'fil'},label:'Schéma normalisé : une pile et une lampe en série, circuit fermé',legende:'Pile + lampe (circuit fermé)'});}
  /* montage de pile et lampe pour ENE-03 : niveau de la pile et éclat de la lampe */
  NE.sceneMoment=function(m,sansFleche){
    var r=NE.pileLampe(m),s=pileBoite(r.niveau)+filsLampe()+A.lampe(230,90,r.lampe!=='eteinte',1)+(r.lampe==='faible'?'<circle cx="230" cy="90" r="52" fill="#fff" opacity=".55"/>':'');
    if(!sansFleche)s+=r.transfert?flecheH(112,190,62,OR)+T(150,30,'énergie',13,OR,800)+T(150,46,'électrique',13,OR,800):T(150,56,'plus de transfert',13,'#6B7480',800);
    return {montage:A.svg(s,'0 0 340 190','Montage : une pile dont le niveau est '+r.pile+' et une lampe '+(r.lampe==='eteinte'?'éteinte':'qui éclaire '+r.lampe+'ment')+'. Valeurs simulées.'),schema:schemaLampe()};};
  /* montage de la lampe et du thermomètre pour ENE-04 (niveaux qualitatifs) */
  NE.sceneChaleur=function(d){
    var r=NE.lampeChaleur(d),h=r.chaleur*22,s=pileBoite(3)+filsLampe()+A.lampe(230,90,true,1);
    s+='<g transform="translate(300 40)"><rect x="-8" y="0" width="16" height="96" rx="8" fill="#fff" stroke="#9FB0C4" stroke-width="2.5"/><rect x="-4" y="'+(92-h)+'" width="8" height="'+h+'" rx="3" fill="#D6221C"/></g>'+T(300,150,'Thermomètre',11,INK,700)+T(300,164,r.mot,12,INK,800);
    return {montage:A.svg(s,'0 0 340 190','Montage : une pile et une lampe allumée depuis '+(d==='court'?'une minute':d==='moyen'?'dix minutes':'trente minutes')+' ; un thermomètre simulé indique : '+r.mot+'.'),schema:schemaLampe()};};
  /* cellule photovoltaïque et lampe pour ENE-06 */
  NE.sceneCellule=function(e){
    var r=NE.cellule(e),s='',i,ray='';
    if(e==='soleil'||e==='nuage'){s+='<circle cx="52" cy="38" r="'+(e==='soleil'?20:12)+'" fill="#FFC857" stroke="#F0B400" stroke-width="2"/>';}
    if(e==='bureau'){s+='<path d="M20 30 h34 l6 -14 h-46 z" fill="#8A94A4"/><path d="M20 30 v40" stroke="#6b7480" stroke-width="3"/>';}
    for(i=0;i<r.niveau;i++)ray+='<path d="M'+(70+i*22)+' 52 L'+(105+i*22)+' 92" stroke="#F0B400" stroke-width="3" stroke-dasharray="4 5"/>';
    s+=ray;
    s+='<g transform="translate(130 120)"><rect x="-44" y="-16" width="88" height="46" rx="4" fill="#2B4C8C" stroke="'+INK+'" stroke-width="2.5" transform="skewX(-10)"/><path d="M-22 -14 v44 M0 -14 v44 M22 -14 v44 M-44 8 h88" stroke="#8FB0E6" stroke-width="1.5" transform="skewX(-10)"/>'+(e==='couvert'?'<rect x="-52" y="-24" width="104" height="62" fill="#B58B5A" stroke="#6B4F2A" stroke-width="2.5"/>':'')+T(0,52,'Cellule',12,INK,700)+'</g>';
    s+=A.fil('M170 125 H230 M170 140 H230','#6b7480')+A.lampe(268,120,r.allumee,0.9);
    var montage=A.svg(s,'0 0 340 205','Montage : une cellule photovoltaïque reliée à une lampe. '+r.txt+' Valeurs simulées.');
    var sch=A.schema({pile:'generateur',cotes:{droite:'lampe',bas:'fil',gauche:'fil'},label:'Schéma normalisé : une cellule photovoltaïque (symbole du générateur G) et une lampe',legende:'G : cellule photovoltaïque'});
    return {montage:montage,schema:sch};};
  /* appareil de ENE-02 : reçoit → obtient, en une image (texte lisible aussi par lecteur d'écran) */
  NE.sceneAppareil=function(app){
    var c=NE.convertit(app),nom=NE.CONVERTISSEURS.filter(function(x){return x[0]===app;})[0][1],g='';
    if(app==='ventilo')g='<g transform="translate(170 95) scale(2)">'+A.moteur(0,0,true)+'</g>';
    else if(app==='torche')g=A.lampe(170,60,true,1.1);
    else if(app==='chargeur')g='<circle cx="60" cy="40" r="18" fill="#FFC857" stroke="#F0B400" stroke-width="2"/><g transform="translate(170 85)"><rect x="-44" y="-16" width="88" height="46" rx="4" fill="#2B4C8C" stroke="'+INK+'" stroke-width="2.5"/><path d="M-22 -14 v44 M0 -14 v44 M22 -14 v44 M-44 8 h88" stroke="#8FB0E6" stroke-width="1.5"/></g>';
    else if(app==='bouilloire')g='<g transform="translate(170 85)"><path d="M-40 30 L-30 -26 H30 L40 30 Z" fill="#E8EDF4" stroke="'+INK+'" stroke-width="2.5"/><path d="M40 -10 q26 0 18 22" fill="none" stroke="'+INK+'" stroke-width="3"/><path d="M-30 -26 q-20 -8 -26 6" fill="none" stroke="'+INK+'" stroke-width="3"/><path d="M-12 -34 q-6 -10 0 -18 M6 -34 q-6 -10 0 -18" stroke="#9FB0C4" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
    else g=A.pile45(140,40,0.9);
    var montage=A.svg(g+T(170,184,nom,13,INK,700),'0 0 340 195','Montage : '+nom.toLowerCase()+'.');
    var s=bloc(true,85,70,140,64,COURT[c.recoit],true)+flecheH(160,230,70,OR)+T(195,54,'devient',12,OR,800)+bloc(true,305,70,140,64,COURT[c.obtient],true);
    return {montage:montage,schema:A.svg(s,'0 0 380 140','Schéma : '+nom.toLowerCase()+' reçoit de l’'+COURT[c.recoit]+' et donne de l’'+COURT[c.obtient]+'.')};};
  /* ---------- figure à deux colonnes pour les fiches de chaîne ---------- */
  NE.sceneChaine=function(chId,montres,numeros){var ch=NE.CHAINES[chId];return NE.chaineSvg(ch,montres,numeros);};

  /* ---------- composant : construire une chaîne (7 repères) avec M.tri ---------- */
  /* cfg : {id, chaine, niveau:'guide'|'libre', titre, intro, montage?:html} ; la figure se complète au fil des bonnes réponses */
  NE.chaineTri=function(panel,X,cfg){
    var M=window.NohobaMatiere,h=window.Activite.h,ch=NE.CHAINES[cfg.chaine],guide=cfg.niveau!=='libre',st=X.st();
    var card=h('div',{class:'card'},panel);h('h3',{text:cfg.figTitre||'La chaîne énergétique'},card);
    var grid=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start'},card);
    var fa=cfg.montage?h('figure',{style:'margin:0'},grid):null,fb=h('figure',{style:'margin:0;max-width:520px'},grid),ma=fa?h('div',{},fa):null,mb=h('div',{},fb);
    if(fa)h('figcaption',{text:'Le montage',style:'font-weight:700;margin-top:4px'},fa);h('figcaption',{text:'La chaîne énergétique',style:'font-weight:700;margin-top:4px'},fb);
    function dessiner(){var S=(st.tri||{})[cfg.id],ok={};NE.ROLES.forEach(function(r){if(S&&S.ok[r])ok[r]=true;});
      if(ma)ma.innerHTML=cfg.montage;mb.innerHTML=NE.chaineSvg(ch,ok,guide);}
    var bank=NE.banque(ch);
    var items=NE.ROLES.map(function(r,i){
      var it={id:r,label:guide?'Repère '+(i+1)+' : '+NE.ROLES_NOMS[r]:'Case '+(i+1)+' : que faut-il écrire ici ?',
        juste:nomRole(ch,r),
        pourquoi:'Dans « '+ch.titre+' », '+NE.ROLES_NOMS[r]+' est : '+nomRole(ch,r)+'.',
        aide:guide?'Pense à la méthode : réservoir → forme reçue → convertisseur → forme utile → récepteur, et la branche dissipée vers le milieu extérieur.':'Suis le chemin de l’énergie de la source au récepteur, puis cherche ce qui part vers l’extérieur.'};
      if(guide)it.options=NE.optionsGuide(ch,r).map(function(o){return [o[1],o[1]];});
      return it;});
    var tri=M.tri(panel,X,{id:cfg.id,titre:cfg.titre,intro:cfg.intro,vigilance:cfg.vigilance,legende:'Je choisis',cats:guide?[]:bank,items:items,onChange:dessiner,impression:{titre:cfg.titreImpression||cfg.titre}});
    dessiner();return tri;};

  /* ENE-01 : pile + appareil (lampe, moteur ou fil résistant) */
  NE.sceneEffet=function(app){
    var r=NE.effet(app),g=pileBoite(3),nom=NE.APPAREILS.filter(function(x){return x[0]===app;})[0][1];
    if(app==='lampe')g+=filsLampe()+A.lampe(230,90,true,1);
    else if(app==='moteur')g+=A.fil('M90 90 H200 V116','#6b7480')+A.fil('M90 118 V172 H260 V116','#6b7480')+A.moteur(230,110,true);
    else g+=A.fil('M90 90 H150 M280 90 H300 V172 H90 V118','#6b7480')+'<path d="M150 90 l12 -16 l14 32 l14 -32 l14 32 l14 -32 l12 16" fill="none" stroke="#D6221C" stroke-width="5" stroke-linejoin="round"/><path d="M150 90 l12 -16 l14 32 l14 -32 l14 32 l14 -32 l12 16" fill="none" stroke="#FFB38A" stroke-width="2" stroke-linejoin="round" opacity=".8"/>'+T(215,135,'Fil résistant (ne pas toucher)',12,INK,700);
    var sch=A.schema({pile:'normale',cotes:{droite:app==='lampe'?'lampe':app==='moteur'?'moteur':'fil',bas:'fil',gauche:'fil'},label:'Schéma normalisé : une pile et '+(app==='fil'?'une résistance':nom.toLowerCase()),legende:app==='fil'?'Résistance (fil résistant)':'Circuit fermé'});
    if(app==='fil')sch=sch.replace('</svg>','<rect x="326" y="82" width="28" height="36" rx="3" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/></svg>');
    return {montage:A.svg(g,'0 0 340 190','Montage : une pile reliée à '+nom.toLowerCase()+'. '+r.txt),schema:sch};};
  /* ENE-09 : une installation de production d'électricité pour l'école (dessin simple + schéma de la source G et d'une lampe) */
  NE.sceneInstallation=function(inst){
    NE.installation('A',inst);var g='';
    if(inst==='solaire')g='<circle cx="60" cy="40" r="20" fill="#FFC857" stroke="#F0B400" stroke-width="2"/><g transform="translate(180 105)"><rect x="-60" y="-24" width="120" height="58" rx="4" fill="#2B4C8C" stroke="'+INK+'" stroke-width="2.5" transform="skewX(-10)"/><path d="M-30 -22 v58 M0 -22 v58 M30 -22 v58 M-60 6 h120" stroke="#8FB0E6" stroke-width="1.5" transform="skewX(-10)"/></g>';
    else if(inst==='eolienne')g='<path d="M180 170 V80" stroke="'+INK+'" stroke-width="6"/><g transform="translate(180 76)"><path d="M0 0 L0 -52 M0 0 L45 26 M0 0 L-45 26" stroke="#2E7BD6" stroke-width="8" stroke-linecap="round"/><circle r="7" fill="'+INK+'"/></g><path d="M30 60 q20 -10 40 0 M30 90 q20 -10 40 0" stroke="#9FB0C4" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else g='<g transform="translate(180 105)"><rect x="-70" y="-30" width="140" height="70" rx="8" fill="#E8EDF4" stroke="'+INK+'" stroke-width="2.5"/><rect x="-54" y="-14" width="50" height="38" fill="#fff" stroke="'+INK+'" stroke-width="2"/><circle cx="34" cy="5" r="16" fill="#fff" stroke="'+INK+'" stroke-width="2.5"/><path d="M60 -30 v-16 h14" stroke="'+INK+'" stroke-width="4" fill="none"/></g>'+T(180,172,'Groupe électrogène (bruyant)',12,INK,700);
    var nom=NE.INSTALLATIONS.filter(function(x){return x[0]===inst;})[0][1];
    var montage=A.svg(g+T(180,188,nom,13,INK,700),'0 0 360 200','Montage : '+nom.toLowerCase()+'.');
    var sch=A.schema({pile:'generateur',cotes:{droite:'lampe',bas:'fil',gauche:'fil'},label:'Schéma normalisé : une source d’électricité (G) et une lampe',legende:'G : source d’électricité de l’école'});
    return {montage:montage,schema:sch,extra:'<h4 style="margin:10px 0 4px">La chaîne énergétique de cette installation (dessin séparé)</h4>'+NE.chaineSvg(NE.CHAINES[inst==='solaire'?'panneau':inst],{reservoir:1,recue:1,convertisseur:1,utile:1,recepteur:1,dissipee:1,milieu:1},false)};};
  window.NohobaEnergie=NE;
})();
