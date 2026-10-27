/* NohobaLab · 6e Côte d'Ivoire · modèles du thème « Mesure de grandeurs physiques » (lot MES).
   Fonctions pures, sans dessin, testées par qa/lot-ci-mesures.cjs.
   Toutes les valeurs de volume et de masse sont des illustrations simulées et réalistes, jamais des mesures réelles.
   Hors lot : poids, masse volumique, densité, mole. On ne calcule jamais de quotient masse ÷ volume. */
(function(){
  'use strict';
  var Q={};
  function r6(x){return Math.round(x*1e6)/1e6;}
  function fr(x){return String(r6(x)).replace('.',',');}
  function nombre(s){if(typeof s==='number')return s;var t=String(s==null?'':s).trim().replace(/\s/g,'').replace(',','.');return t===''||!/^[-+]?\d*\.?\d+$/.test(t)?NaN:parseFloat(t);}
  function egal(a,b,tol){return isFinite(a)&&Math.abs(a-b)<=(tol||1e-9);}
  Q.fr=fr;Q.nombre=nombre;Q.egal=egal;
  /* phrase suivie de la mention « (valeur simulée) », sans double point */
  /* place la bonne réponse au rang k (modulo le nombre d'options), pour qu'elle ne soit pas toujours la première */
  Q.place=function(options,juste,k){var o=options.slice(),i=o.map(function(x){return x[0];}).indexOf(juste);if(i<0)return o;var j=o.splice(i,1)[0];o.splice(k%options.length,0,j);return o;};
  Q.sim=function(t,pl){return String(t).replace(/\.\s*$/,'')+' ('+(pl?'valeurs simulées':'valeur simulée')+').';};
  function trouve(l,id,quoi){var x=l.filter(function(e){return e.id===id;})[0];if(!x)throw new Error((quoi||'élément')+' inconnu : '+id);return x;}

  /* ---------- MES-01 · unités de volume et de capacité ---------- */
  /* valeur de chaque unité exprimée en litres (1 dm³ = 1 L ; 1 cm³ = 1 mL) */
  Q.UNITES={'m³':1000,'dm³':1,'cm³':0.001,'mm³':0.000001,'kL':1000,'hL':100,'daL':10,'L':1,'dL':0.1,'cL':0.01,'mL':0.001};
  Q.UNITES_VOLUME=['m³','dm³','cm³','mm³'];Q.UNITES_CAPACITE=['kL','hL','daL','L','dL','cL','mL'];
  Q.convertir=function(v,de,vers){if(!(de in Q.UNITES)||!(vers in Q.UNITES))throw new Error('unité inconnue');return r6(v*Q.UNITES[de]/Q.UNITES[vers]);};
  /* récipients du marché : capacité réelle (simulée) et nombre de gobelets de 0,25 L */
  Q.GOBELET=0.25;
  Q.BOUTEILLES=[
    {id:'haute',nom:'la bouteille haute et étroite',court:'Bouteille haute',capacite:0.75},
    {id:'large',nom:'la bouteille large et basse',court:'Bouteille large',capacite:1}
  ];
  Q.EXP_CAPACITE=[['haute_mes','Je vide la bouteille haute dans le verre mesureur'],['large_mes','Je vide la bouteille large dans le verre mesureur'],['haute_gob','Je compte les gobelets de la bouteille haute'],['large_gob','Je compte les gobelets de la bouteille large'],['cube_dm3','Je remplis d’eau le cube creux de 1 dm³, puis je la verse dans le verre mesureur'],['cube_cm3','Je remplis d’eau le petit cube de 1 cm³, puis je l’aspire avec la seringue de 1 mL']];
  Q.capacite=function(exp){
    var b=exp.indexOf('haute')===0?trouve(Q.BOUTEILLES,'haute'):exp.indexOf('large')===0?trouve(Q.BOUTEILLES,'large'):null;
    if(b&&/_mes$/.test(exp))return {objet:b.id,litres:b.capacite,lu:b.capacite*1000+' mL',txt:'Le jus de '+b.nom+' arrive au trait '+fr(b.capacite*1000)+' mL du verre mesureur, soit '+fr(b.capacite)+' L.'};
    if(b&&/_gob$/.test(exp)){var n=Math.round(b.capacite/Q.GOBELET);return {objet:b.id,litres:b.capacite,gobelets:n,lu:n+' gobelets',txt:'On remplit '+n+' gobelets de 0,25 L avec '+b.nom+' : '+n+' × 0,25 L = '+fr(b.capacite)+' L.'};}
    if(exp==='cube_dm3')return {objet:'cube_dm3',litres:1,lu:'1 000 mL',txt:'L’eau du cube de 1 dm³ arrive juste au trait 1 000 mL, c’est-à-dire 1 L : 1 dm³ = 1 L.'};
    if(exp==='cube_cm3')return {objet:'cube_cm3',litres:0.001,lu:'1 mL',txt:'L’eau du petit cube de 1 cm³ remplit la seringue jusqu’au trait 1 mL : 1 cm³ = 1 mL.'};
    throw new Error('expérience inconnue');
  };
  /* quatre conversions corrigées (MES-01) */
  Q.CONVERSIONS_VOL=[
    {id:'c1',q:'1,5 L = … mL',juste:'1500',options:[['1500','1 500 mL'],['150','150 mL'],['15','15 mL']],pourquoi:'1 L = 1 000 mL, donc 1,5 L = 1 500 mL.'},
    {id:'c2',q:'250 mL = … cL',juste:'25',options:[['25','25 cL'],['2,5','2,5 cL'],['2500','2 500 cL']],pourquoi:'1 cL = 10 mL, donc 250 mL = 25 cL.'},
    {id:'c3',q:'1 dm³ = … L',juste:'1',options:[['1','1 L'],['10','10 L'],['1000','1 000 L']],pourquoi:'Un cube de 1 dm³ contient exactement 1 L.'},
    {id:'c4',q:'50 cm³ = … mL',juste:'50',options:[['50','50 mL'],['5','5 mL'],['500','500 mL']],pourquoi:'1 cm³ = 1 mL, donc 50 cm³ = 50 mL.'},
    {id:'c5',q:'Un bidon de 5 L = … dm³',juste:'5',options:[['5','5 dm³'],['500','500 dm³'],['0,5','0,5 dm³']],pourquoi:'1 L = 1 dm³, donc 5 L = 5 dm³.'}
  ];

  Q.CONVERSIONS_VOL.forEach(function(c,k){c.options=Q.place(c.options,c.juste,k+1);});

  /* ---------- MES-02 · lire une éprouvette graduée ---------- */
  /* écart entre deux nombres écrits, nombre de divisions entre ces nombres, capacité */
  Q.EPROUVETTES={
    A:{id:'A',nom:'Éprouvette A (100 mL)',cap:100,unite:'mL',ecart:10,divisions:10},
    B:{id:'B',nom:'Éprouvette B (250 cm³)',cap:250,unite:'cm³',ecart:50,divisions:10},
    biberon:{id:'biberon',nom:'Biberon gradué',cap:250,unite:'mL',ecart:50,divisions:5},
    seringue:{id:'seringue',nom:'Seringue graduée (10 mL)',cap:10,unite:'mL',ecart:2,divisions:10}
  };
  Q.division=function(id){var e=Q.EPROUVETTES[id];if(!e)throw new Error('éprouvette inconnue');return r6(e.ecart/e.divisions);};
  /* volumes illustrés proposés à la lecture (à la graduation près) */
  Q.VOLUMES_LECTURE={A:[37,64,82],B:[85,140,215],biberon:[120,180],seringue:[3.4,7.8]};
  /* lecture à l'œil : modèle exagéré de l'erreur de parallaxe (deux divisions), ménisque concave (eau) */
  Q.OEIL=[['haut','L’œil au-dessus du ménisque'],['niveau','L’œil à la hauteur du bas du ménisque'],['bas','L’œil en dessous du ménisque']];
  Q.lecture=function(id,V,oeil){
    var e=Q.EPROUVETTES[id];if(!e)throw new Error('éprouvette inconnue');var d=Q.division(id),dec=oeil==='haut'?2:oeil==='bas'?-2:0;
    if(['haut','niveau','bas'].indexOf(oeil||'niveau')<0)throw new Error('position de l’œil inconnue');
    var lu=r6(Math.round(V/d)*d+dec*d);
    return {valeur:lu,vrai:r6(Math.round(V/d)*d),juste:dec===0,division:d,unite:e.unite,
      txt:dec===0?'Œil à la hauteur du bas du ménisque : on lit '+fr(lu)+' '+e.unite+' (une division vaut '+fr(d)+' '+e.unite+').':
        'Œil '+(dec>0?'au-dessus':'en dessous')+' du ménisque : on croit lire '+fr(lu)+' '+e.unite+', ce qui est '+(dec>0?'trop':'pas assez')+'. La lecture est fausse.'};
  };
  /* contrôle d'une lecture de l'élève : valeur d'une division puis volume avec son unité */
  Q.verifierLecture=function(id,V,saisieDivision,saisieVolume){
    var d=Q.division(id),lu=Q.lecture(id,V,'niveau').valeur,e=Q.EPROUVETTES[id],sd=nombre(saisieDivision),sv=nombre(saisieVolume);
    var okD=egal(sd,d),okV=egal(sv,lu,d/2+1e-9);
    var retour=okD&&okV?'Oui : entre deux nombres écrits ('+e.ecart+' '+e.unite+' d’écart) il y a '+e.divisions+' divisions, donc une division vaut '+fr(d)+' '+e.unite+'. On lit '+fr(lu)+' '+e.unite+'.':
      !okD?'Compte les divisions entre deux nombres écrits : '+e.ecart+' '+e.unite+' partagés en '+e.divisions+' divisions. Une division vaut donc '+e.ecart+' ÷ '+e.divisions+'.':
      'La valeur d’une division est juste. Repère le dernier nombre écrit sous le bas du ménisque, puis compte les divisions jusqu’au bas du ménisque.';
    return {juste:okD&&okV,division:okD,volume:okV,attendu:{division:d,volume:lu},retour:retour};
  };
  /* le même liquide dans trois récipients : la finesse de la graduation donne la précision */
  Q.RECIPIENTS_GRADUES=[
    {id:'becher',nom:'Le bécher',pas:25,txt:'traits tous les 25 mL, indicatifs'},
    {id:'verre',nom:'Le verre mesureur',pas:50,txt:'traits tous les 50 mL'},
    {id:'eprouvette',nom:'L’éprouvette de 100 mL',pas:1,txt:'un trait par millilitre'}
  ];
  Q.V_KOFI=63; /* volume illustré du liquide prélevé, en mL (valeur simulée) */
  Q.mesureRecipient=function(id,V){
    var r=trouve(Q.RECIPIENTS_GRADUES,id,'récipient');V=V==null?Q.V_KOFI:V;var lo=Math.floor(V/r.pas)*r.pas,hi=lo+r.pas,lu=Math.round(V/r.pas)*r.pas;
    return {valeur:lu,min:lo,max:hi,pas:r.pas,precis:r.pas===1,txt:r.nom+' ('+r.txt+') : '+(r.pas===1?'on lit '+V+' mL, à 1 mL près.':'le niveau est entre les traits '+lo+' mL et '+hi+' mL ; on ne peut pas lire plus précisément.')};
  };

  /* ---------- MES-03 · volume d'un solide par déplacement d'eau ---------- */
  Q.SOLIDES=[
    {id:'caillou',nom:'un caillou',court:'Caillou',V:12,coule:true,soluble:false,haut:3},
    {id:'pate_boule',nom:'une boulette de pâte à modeler',court:'Pâte en boule',V:18,coule:true,soluble:false,haut:3},
    {id:'pate_galette',nom:'la même pâte aplatie en galette',court:'Pâte en galette',V:18,coule:true,soluble:false,haut:1},
    {id:'cle',nom:'une clé',court:'Clé',V:4,coule:true,soluble:false,haut:4},
    {id:'sucre',nom:'un morceau de sucre',court:'Sucre',V:6,coule:true,soluble:true,haut:2},
    {id:'bouchon',nom:'un bouchon de liège',court:'Bouchon de liège',V:10,coule:false,soluble:false,haut:3},
    {id:'caillou_long',nom:'un long caillou dans très peu d’eau',court:'Long caillou, peu d’eau',V:20,coule:true,soluble:false,haut:9,peuEau:true}
  ];
  Q.V1=50;
  /* hauteur d'eau disponible en « unités de hauteur » : 9 unités = solide non immergé quand l'eau est trop basse */
  Q.deplacement=function(id){
    var s=trouve(Q.SOLIDES,id,'solide'),V1=s.peuEau?10:Q.V1,V2,valable=true,condition=null,txt;
    if(s.soluble){V2=V1+1;valable=false;condition='insoluble';txt='Le sucre se dissout peu à peu : le niveau monte à peine puis ne bouge plus ('+V2+' mL). La mesure est fausse : le solide doit être insoluble dans l’eau.';}
    else if(!s.coule){V2=V1+3;valable=false;condition='coule';txt='Le bouchon flotte : seule une petite partie s’enfonce, le niveau monte peu ('+V2+' mL). La mesure est fausse : le solide doit couler.';}
    else if(s.peuEau){V2=V1+12;valable=false;condition='immerge';txt='Il y a trop peu d’eau : le haut du caillou dépasse. Le niveau monte jusqu’à '+V2+' mL, ce qui ne compte qu’une partie du caillou. Le solide doit être entièrement immergé.';}
    else{V2=V1+s.V;txt='Le niveau passe de '+V1+' mL à '+V2+' mL : le solide occupe '+(V2-V1)+' mL, soit '+(V2-V1)+' cm³.';}
    return {V1:V1,V2:V2,V:V2-V1,vrai:s.V,valable:valable,condition:condition,txt:txt};
  };
  Q.verifierDeplacement=function(id,sV1,sV2,sV){
    var d=Q.deplacement(id),a=nombre(sV1),b=nombre(sV2),c=nombre(sV),ok1=egal(a,d.V1),ok2=egal(b,d.V2),ok3=egal(c,b-a)&&ok1&&ok2;
    var cond={insoluble:'le sucre se dissout, alors que le solide doit être insoluble dans l’eau',coule:'le bouchon flotte, alors que le solide doit couler',immerge:'le caillou dépasse de l’eau, alors que le solide doit être entièrement immergé'};
    var retour=ok1&&ok2&&ok3?(d.valable?'Oui : V = V₂ − V₁ = '+d.V2+' − '+d.V1+' = '+d.V+' mL, soit '+d.V+' cm³.':'Ton calcul est juste ('+d.V+' mL), mais ce n’est pas le volume du solide : '+cond[d.condition]+'.'):
      !ok1?'Relis V₁ : le niveau de l’eau avant d’y plonger le solide.':!ok2?'Relis V₂ : le niveau une fois le solide au fond, l’œil au bas du ménisque.':'Le volume du solide est la différence V₂ − V₁.';
    return {juste:ok1&&ok2&&ok3,valable:d.valable,attendu:{V1:d.V1,V2:d.V2,V:d.V},retour:retour};
  };
  Q.CONDITIONS=[['insoluble','Le solide doit être insoluble dans l’eau'],['coule','Le solide doit couler'],['immerge','Le solide doit être entièrement immergé'],['eclabousse','Le solide doit être introduit sans éclaboussure']];
  /* pour aller plus loin (facultatif, hors programme et hors TP) */
  Q.PLUS_LOIN=[['lest_seul','Méthode du lest : le lest seul dans l’eau'],['lest_bouchon','Méthode du lest : le lest attaché au bouchon'],['trop_plein','Vase à trop-plein : une grosse pierre'],['huile_sucre','Sucre dans l’huile'],['gaz','Volume d’air expiré recueilli sur l’eau']];
  Q.plusLoin=function(id){
    var t={
      lest_seul:{V:null,txt:'Écrou seul : le niveau passe de 50 mL à 56 mL (V₂ = 56 mL).'},
      lest_bouchon:{V:10,txt:'Écrou attaché au bouchon : le niveau monte à 66 mL (V₃). Volume du bouchon : V₃ − V₂ = 66 − 56 = 10 mL, soit 10 cm³.'},
      trop_plein:{V:320,txt:'Le vase est rempli jusqu’au bec ; la grosse pierre, trop large pour l’éprouvette, fait déborder de l’eau, recueillie puis mesurée : 320 mL. La pierre occupe 320 cm³.'},
      huile_sucre:{V:6,txt:'Dans l’huile, le sucre ne se dissout pas : le niveau passe de 50 mL à 56 mL ; le morceau de sucre occupe 6 cm³.'},
      gaz:{V:400,txt:'Une expiration douce dans le tube chasse l’eau de l’éprouvette retournée : on lit environ 400 mL d’air (valeur simulée). Le même principe mesure le volume d’un gaz.'}
    }[id];if(!t)throw new Error('prolongement inconnu');return t;
  };

  /* ---------- MES-04 · volume d'un solide de forme simple ---------- */
  Q.PI=3.14;
  Q.FORMES=[
    {id:'cube',nom:'un cube de bois',court:'Cube',type:'cube',a:3},
    {id:'pave',nom:'un pavé de métal',court:'Pavé de métal',type:'pave',L:4,l:3,h:2,insoluble:true},
    {id:'allumettes',nom:'une boîte d’allumettes',court:'Boîte d’allumettes',type:'pave',L:5,l:3.5,h:1.5,insoluble:false},
    {id:'cylindre',nom:'un cylindre de métal',court:'Cylindre de métal',type:'cylindre',d:4,h:5,insoluble:true},
    {id:'conserve',nom:'une boîte de conserve',court:'Boîte de conserve',type:'cylindre',d:8,h:10,insoluble:false}
  ];
  Q.forme=function(id){return trouve(Q.FORMES,id,'forme');};
  Q.volumeForme=function(id){
    var f=Q.forme(id);
    if(f.type==='cube')return r6(f.a*f.a*f.a);
    if(f.type==='pave')return r6(f.L*f.l*f.h);
    return r6(Q.PI*(f.d/2)*(f.d/2)*f.h);
  };
  Q.formule=function(id){var f=Q.forme(id);return f.type==='cube'?'V = a × a × a':f.type==='pave'?'V = L × ℓ × h':'V = 3,14 × r × r × h';};
  Q.dimensions=function(id){var f=Q.forme(id);return f.type==='cube'?[['a','arête',f.a]]:f.type==='pave'?[['L','longueur',f.L],['l','largeur',f.l],['h','hauteur',f.h]]:[['d','diamètre',f.d],['h','hauteur',f.h]];};
  /* cubes unités dans le pavé 4 × 3 × 2 posés couche par couche */
  Q.cubesPave=function(couches){couches=Math.max(0,Math.min(2,couches|0));return {parCouche:12,couches:couches,total:12*couches,txt:couches?couches+' couche'+(couches>1?'s':'')+' de 4 × 3 = 12 cubes : '+(12*couches)+' cubes de 1 cm³.':'Le pavé est vide : aucun cube posé.'};};
  Q.verifierVolumeForme=function(id,dims,sV){
    var f=Q.forme(id),V=Q.volumeForme(id),v=nombre(sV),D=Q.dimensions(id),okDims=D.every(function(d){return egal(nombre(dims[d[0]]),d[2]);});
    var ok=okDims&&egal(v,V,f.type==='cylindre'?0.05:1e-6),retour;
    if(ok)retour='Oui : '+Q.formule(id)+(f.type==='cylindre'?', avec r = d ÷ 2 = '+fr(f.d/2)+' cm':'')+' ; V = '+fr(V)+' cm³.';
    else if(!okDims)retour='Relis les dimensions sur la règle : le zéro de la règle est au bord de l’objet, on lit au demi-centimètre près.';
    else if(f.type==='cylindre'&&egal(v,r6(Q.PI*f.d*f.d*f.h),0.05))retour='Tu as pris le diamètre pour le rayon. Le rayon est la moitié du diamètre : r = '+fr(f.d)+' ÷ 2 = '+fr(f.d/2)+' cm.';
    else retour='Les dimensions sont justes. Applique la formule '+Q.formule(id)+', toutes les longueurs en cm, et donne le résultat en cm³.';
    return {juste:ok,dims:okDims,attendu:V,retour:retour};
  };
  /* contrôle par l'eau : seulement pour un solide insoluble ; lecture à 1 mL près */
  Q.controleEau=function(id){
    var f=Q.forme(id);if(!f.insoluble)return {possible:false,txt:cap(f.nom)+' ne se plonge pas dans l’eau (carton, papier, conserve pleine) : on ne contrôle pas par l’eau.'};
    /* éprouvette B de 250 cm³ : une division = 5 cm³, lecture à la division la plus proche */
    var V=Q.volumeForme(id),d=Q.division('B'),V2=Math.round((Q.V1+V)/d)*d;return {possible:true,V1:Q.V1,V2:V2,V:V2-Q.V1,calcul:V,precision:d,txt:'Contrôle par l’eau : '+Q.V1+' cm³ → '+V2+' cm³, soit '+(V2-Q.V1)+' cm³ à '+d+' cm³ près ; le calcul donne '+fr(V)+' cm³.'};
  };

  /* ---------- MES-05 · masse ---------- */
  Q.TRANSFOS=[['boule','Une boule de pâte à modeler'],['galette','La même pâte aplatie en galette'],['morceaux','La même pâte coupée en quatre morceaux, tous sur le plateau'],['coton','Un kilogramme de coton'],['fer','Un kilogramme de fer']];
  Q.PATE=120;
  Q.masseObjet=function(id){
    if(id==='boule'||id==='galette'||id==='morceaux')return {m:Q.PATE,unite:'g',txt:'La balance indique '+Q.PATE+' g : '+(id==='boule'?'c’est la boule de départ.':id==='galette'?'la forme a changé, la masse est la même.':'tous les morceaux sont sur le plateau, rien n’est perdu : même masse.')};
    if(id==='coton')return {m:1000,unite:'g',txt:'Le gros sac de coton : la balance indique 1 000 g, soit 1 kg.'};
    if(id==='fer')return {m:1000,unite:'g',txt:'Le petit bloc de fer : la balance indique aussi 1 000 g, soit 1 kg. Il prend beaucoup moins de place que le coton, mais sa masse est la même.'};
    throw new Error('objet inconnu');
  };
  /* unités de masse, exprimées en grammes */
  Q.MASSES={t:1000000,q:100000,kg:1000,hg:100,dag:10,g:1,dg:0.1,cg:0.01,mg:0.001};
  Q.convertirMasse=function(v,de,vers){if(!(de in Q.MASSES)||!(vers in Q.MASSES))throw new Error('unité inconnue');return r6(v*Q.MASSES[de]/Q.MASSES[vers]);};
  Q.CONVERSIONS_MASSE=[
    {id:'m1',q:'2,5 kg = … g',juste:'2500',options:[['2500','2 500 g'],['250','250 g'],['25','25 g']],pourquoi:'1 kg = 1 000 g, donc 2,5 kg = 2 500 g.'},
    {id:'m2',q:'1 quintal (q) = … kg',juste:'100',options:[['100','100 kg'],['1000','1 000 kg'],['10','10 kg']],pourquoi:'Un quintal vaut 100 kg.'},
    {id:'m3',q:'1 tonne (t) = … kg',juste:'1000',options:[['1000','1 000 kg'],['100','100 kg'],['10000','10 000 kg']],pourquoi:'Une tonne vaut 1 000 kg, c’est-à-dire 10 quintaux.'},
    {id:'m4',q:'350 g = … kg',juste:'0,35',options:[['0,35','0,35 kg'],['3,5','3,5 kg'],['35','35 kg']],pourquoi:'1 g = 0,001 kg, donc 350 g = 0,35 kg.'},
    {id:'m5',q:'250 mg = … g',juste:'0,25',options:[['0,25','0,25 g'],['25','25 g'],['2,5','2,5 g']],pourquoi:'1 g = 1 000 mg, donc 250 mg = 0,25 g.'}
  ];
  Q.CONVERSIONS_MASSE.forEach(function(c,k){c.options=Q.place(c.options,c.juste,k+2);});
  Q.ORDRES=[['mg','Moins de 1 g'],['g','Entre 1 g et 1 kg'],['kg','Entre 1 kg et 100 kg'],['q','100 kg ou plus']];
  Q.OBJETS_MASSE=[
    {id:'riz',nom:'Un grain de riz',juste:'mg',pourquoi:'Un grain de riz a une masse de quelques centièmes de gramme : moins de 1 g.'},
    {id:'stylo',nom:'Un stylo à bille',juste:'g',pourquoi:'Un stylo a une masse de quelques grammes.'},
    {id:'sac_riz',nom:'Un sac de riz de 25 kg',juste:'kg',pourquoi:'25 kg est entre 1 kg et 100 kg.'},
    {id:'cacao',nom:'Un quintal de cacao',juste:'q',pourquoi:'Un quintal vaut 100 kg.'},
    {id:'grumier',nom:'Un grumier chargé de bois',juste:'q',pourquoi:'Un grumier chargé a une masse de plusieurs tonnes, bien plus que 100 kg.'}
  ];

  /* ---------- MES-06 à MES-09 · balance de Roberval et masses marquées ---------- */
  /* boîte de masses marquées (décision du 27 octobre 2026) : 1 g à 200 g, 500 g en tout */
  Q.BOITE=[200,100,100,50,20,10,10,5,2,2,1];
  Q.PORTEE=1000;
  /* bras : [gauche, droite] en dixièmes ; [10,10] = balance réglée ; [11,10] = balance déréglée (bras gauche plus long, exagéré pour être visible) */
  Q.equilibre=function(mG,mD,bras){
    bras=bras||[10,10];var c=mG*bras[0]-mD*bras[1];
    return {couple:c,penche:c>0?'gauche':c<0?'droite':'aucun',equilibre:c===0,aiguille:c>0?'gauche':c<0?'droite':'repere',
      txt:c===0?'L’aiguille est sur le repère : la balance est en équilibre.':'Le plateau '+(c>0?'de gauche':'de droite')+' descend : il porte la charge la plus lourde.'};
  };
  Q.somme=function(liste){return liste.reduce(function(a,b){return a+b;},0);};
  /* méthode des masses décroissantes : liste des masses retenues pour équilibrer une masse donnée */
  Q.decroissante=function(m){
    var reste=m,pris=[];Q.BOITE.forEach(function(x){if(x<=reste+1e-9){pris.push(x);reste=r6(reste-x);}});
    return {masses:pris,reste:reste,possible:reste===0&&m<=Q.somme(Q.BOITE)};
  };
  /* conseil après chaque masse posée, quand les masses sont du côté opposé à la charge */
  Q.conseil=function(eq,coteMasses){
    if(eq.equilibre)return 'Équilibre : l’aiguille est sur le repère. Additionne les masses posées.';
    var trop=eq.penche===coteMasses;
    return trop?'Le plateau des masses descend : retire la dernière masse posée et essaie la suivante, plus petite.':'Le plateau de la charge descend encore : ajoute une masse plus petite que la dernière posée.';
  };
  /* objets pesés (valeurs simulées) */
  Q.CHARGES={
    vide:{nom:'rien',m:0},
    objet100:{nom:'une boîte de 100 g',m:100},
    beurre:{nom:'le beurre du gâteau',m:50},
    bois:{nom:'un bloc de bois',m:137},
    mangue:{nom:'une mangue',m:300},
    savon:{nom:'un morceau de savon',m:125},
    pile:{nom:'une pile',m:23},
    caillou:{nom:'le caillou déjà plongé dans l’éprouvette',m:58},
    allumettes:{nom:'100 allumettes',m:10},
    riz25:{nom:'un sac de riz de 25 kg',m:25000},
    becher_vide:{nom:'le bécher vide',m:74},
    becher_eau:{nom:'le bécher avec 100 mL d’eau',m:174},
    becher_huile:{nom:'le bécher avec 100 mL d’huile',m:166},
    bocal_plein:{nom:'le bocal plein d’eau',m:350},
    bocal_vide:{nom:'le bocal vide',m:150},
    tare:{nom:'la tare (sachet de sable)',m:440}
  };
  Q.charge=function(id){var c=Q.CHARGES[id];if(!c)throw new Error('charge inconnue : '+id);return c;};
  Q.ALLUMETTE=0.1;
  /* une pesée : charges sur chaque plateau, masses marquées d'un côté */
  Q.pesee=function(o){
    var g=(o.gauche||[]).reduce(function(a,id){return a+Q.charge(id).m;},0),d=(o.droite||[]).reduce(function(a,id){return a+Q.charge(id).m;},0),ms=Q.somme(o.masses||[]);
    if(o.cote==='gauche')g+=ms;else d+=ms;
    var trop=Math.max(g,d)>Q.PORTEE;
    var eq=trop?{couple:g-d,penche:g>d?'gauche':'droite',equilibre:false,aiguille:g>d?'gauche':'droite',txt:'Trop lourd'}:Q.equilibre(g,d,o.bras);
    return {gauche:g,droite:d,masses:ms,eq:eq,depasse:trop,conseil:trop?'Cette charge dépasse la portée de la balance (1 kg) : on ne la pose pas, on prend une autre balance.':Q.conseil(eq,o.cote==='gauche'?'gauche':'droite')};
  };
  /* MES-08 : masse d'un liquide par différence de deux pesées */
  Q.LIQUIDES_PESES={eau:{nom:'l’eau',m1:74,m2:174},huile:{nom:'l’huile',m1:74,m2:166}};
  Q.verifierDifference=function(liq,s1,s2,s){
    var L=Q.LIQUIDES_PESES[liq];if(!L)throw new Error('liquide inconnu');var a=nombre(s1),b=nombre(s2),c=nombre(s),ok1=egal(a,L.m1),ok2=egal(b,L.m2),ok=ok1&&ok2&&egal(c,L.m2-L.m1);
    return {juste:ok,attendu:{m1:L.m1,m2:L.m2,m:L.m2-L.m1},retour:ok?'Oui : m = m₂ − m₁ = '+L.m2+' − '+L.m1+' = '+(L.m2-L.m1)+' g pour 100 mL de '+L.nom.replace('l’','')+'.':!ok1?'m₁ est la masse du bécher vide, trouvée à la première pesée.':!ok2?'m₂ est la masse du bécher avec 100 mL de '+L.nom.replace('l’','')+'.':'La masse du liquide est la différence m₂ − m₁ (m₂ est plus grand que m₁).'};
  };
  Q.EAU_PLUS_LOIN=[10,20,50];
  Q.eauPlusLoin=function(V){if(Q.EAU_PLUS_LOIN.indexOf(V)<0)throw new Error('volume non prévu');return {V:V,m1:74,m2:74+V,m:V,txt:V+' mL d’eau : m₁ = 74 g, m₂ = '+(74+V)+' g, donc m = '+V+' g. Environ 1 g pour 1 mL d’eau.'};};
  /* MES-09 : balance déréglée et double pesée */
  Q.BRAS_DEREGLE=[11,10];
  Q.DOUBLE={
    simple_dereglee:{gauche:['mangue'],droite:[],cote:'droite',bras:[11,10],titre:'Simple pesée de la mangue sur la balance déréglée'},
    eq1:{gauche:['mangue'],droite:['tare'],cote:'gauche',bras:[11,10],titre:'Équilibre 1 : mangue et masses m₁ face à la tare'},
    eq2:{gauche:[],droite:['tare'],cote:'gauche',bras:[11,10],titre:'Équilibre 2 : masses m₂ seules face à la même tare'},
    liq1:{gauche:['bocal_plein'],droite:['tare'],cote:'gauche',bras:[11,10],titre:'Liquide, équilibre 1 : bocal plein et masses m₁ face à la tare'},
    liq2:{gauche:['bocal_vide'],droite:['tare'],cote:'gauche',bras:[11,10],titre:'Liquide, équilibre 2 : bocal vidé et masses m₂ face à la tare'}
  };
  /* masses marquées qui donnent l'équilibre dans chaque situation (calcul de contrôle) */
  Q.massesEquilibre=function(sit){
    var S=Q.DOUBLE[sit]||sit,g=S.gauche.reduce(function(a,id){return a+Q.charge(id).m;},0),d=S.droite.reduce(function(a,id){return a+Q.charge(id).m;},0),b=S.bras||[10,10];
    var m=S.cote==='gauche'?(d*b[1]-g*b[0])/b[0]:(g*b[0]-d*b[1])/b[1];
    return r6(m);
  };
  Q.verifierDouble=function(quoi,s1,s2,s){
    var m1=Q.massesEquilibre(quoi==='liquide'?'liq1':'eq1'),m2=Q.massesEquilibre(quoi==='liquide'?'liq2':'eq2'),a=nombre(s1),b=nombre(s2),c=nombre(s),ok1=egal(a,m1),ok2=egal(b,m2),ok=ok1&&ok2&&egal(c,m2-m1);
    var nom=quoi==='liquide'?'de l’eau du bocal':'de la mangue';
    return {juste:ok,attendu:{m1:m1,m2:m2,m:m2-m1},retour:ok?'Oui : m = m₂ − m₁ = '+m2+' − '+m1+' = '+(m2-m1)+' g. C’est la masse '+nom+', même avec une balance déréglée.':!ok1?'m₁ : masses posées avec '+(quoi==='liquide'?'le bocal plein':'la mangue')+' à l’équilibre 1.':!ok2?'m₂ : masses posées à l’équilibre 2, '+(quoi==='liquide'?'avec le bocal vidé':'sans la mangue')+'.':'Face à la même tare, la masse cherchée a été remplacée par des masses marquées : m = m₂ − m₁.'};
  };

  /* ---------- MES-10 · types de balances ---------- */
  Q.BALANCES=[
    {id:'pese_lettre',nom:'Pèse-lettre',usage:'une lettre ou un petit colis',portee:'environ 500 g',precision:'quelques grammes'},
    {id:'monoplateau',nom:'Balance monoplateau du commerce',usage:'la viande ou les légumes au marché',portee:'environ 15 kg',precision:'environ 5 g'},
    {id:'pese_personne',nom:'Pèse-personne',usage:'une personne à l’infirmerie',portee:'environ 150 kg',precision:'environ 100 g'},
    {id:'romaine',nom:'Balance romaine',usage:'un régime de bananes ou un sac au champ',portee:'environ 100 kg',precision:'environ 500 g'},
    {id:'electronique',nom:'Balance électronique',usage:'les pesées du laboratoire et le lait du gâteau',portee:'environ 1 kg',precision:'0,1 g ou 1 g'},
    {id:'pont_bascule',nom:'Pont-bascule',usage:'un grumier chargé de bois',portee:'plusieurs dizaines de tonnes',precision:'environ 10 kg'}
  ];
  Q.SITUATIONS_BALANCE=[
    {id:'lettre',txt:'Peser une lettre avant de la poster',juste:'pese_lettre'},
    {id:'boucher',txt:'Peser 1 kg de viande chez le boucher',juste:'monoplateau'},
    {id:'enfant',txt:'Peser un enfant à l’infirmerie de l’école',juste:'pese_personne'},
    {id:'bananes',txt:'Peser un régime de bananes au champ',juste:'romaine'},
    {id:'lait',txt:'Peser le lait du gâteau dans un bécher',juste:'electronique'},
    {id:'grumier',txt:'Peser un grumier chargé de bois',juste:'pont_bascule'}
  ];
  /* balance électronique : la tare remet l'affichage à zéro avec le récipient posé */
  Q.TARE_ETAPES=[['vide','Rien sur le plateau'],['becher','Je pose le bécher vide'],['tare','J’appuie sur « tare »'],['lait','Je verse 100 mL de lait']];
  Q.BECHER_LAIT=74;Q.LAIT=103;
  Q.affichageTare=function(etape){
    var t={vide:{affiche:0,txt:'Plateau vide : l’écran affiche 0 g.'},becher:{affiche:Q.BECHER_LAIT,txt:'Le bécher vide est posé : l’écran affiche '+Q.BECHER_LAIT+' g.'},tare:{affiche:0,txt:'J’appuie sur « tare » : l’écran revient à 0 g alors que le bécher est toujours posé.'},lait:{affiche:Q.LAIT,txt:'Après la tare, on verse 100 mL de lait : l’écran affiche directement '+Q.LAIT+' g, la masse du lait seul.'}}[etape];
    if(!t)throw new Error('étape inconnue');return t;
  };

  /* ---------- MES-11 · relation entre masse et volume ---------- */
  /* cinq cylindres de même volume (20 cm³), valeurs simulées réalistes */
  Q.CYLINDRES=[
    {id:'pvc',nom:'PVC',m:28,flotte:false},
    {id:'bois',nom:'bois',m:12,flotte:true},
    {id:'aluminium',nom:'aluminium',m:54,flotte:false},
    {id:'fer',nom:'fer',m:157,flotte:false},
    {id:'laiton',nom:'laiton',m:170,flotte:false}
  ];
  Q.V_CYLINDRE=20;
  Q.cylindre=function(id){var c=trouve(Q.CYLINDRES,id,'cylindre');return {V:Q.V_CYLINDRE,m:c.m,lest:c.flotte,txt:'Cylindre de '+c.nom+' : '+Q.V_CYLINDRE+' cm³'+(c.flotte?' (mesuré avec un lest, car il flotte)':'')+', '+c.m+' g.'};};
  Q.COTON_ECROUS={coton:{m:100,V:2000},ecrous:{m:100,V:13}};
  /* jetons de laiton identiques : 6 cm³ et environ 51 g chacun */
  Q.JETON={V:6,m:51};
  Q.jetons=function(n){if([1,2,3].indexOf(n)<0)throw new Error('nombre de jetons non prévu');return {n:n,V:n*Q.JETON.V,m:n*Q.JETON.m,txt:n+' jeton'+(n>1?'s':'')+' : '+(n*Q.JETON.V)+' cm³ et '+(n*Q.JETON.m)+' g.'};};
  /* liquides : masse (g) de 10 mL ; deux mesures, 10 mL et 20 mL, après tare de l'éprouvette */
  Q.LIQ={
    eau:{nom:'eau',m10:10},
    huile:{nom:'huile',m10:9},
    sirop:{nom:'sirop',m10:13},
    vinaigre:{nom:'vinaigre',m10:10},
    javel:{nom:'eau de Javel diluée',m10:10}
  };
  Q.liquideMV=function(id,V){var L=Q.LIQ[id];if(!L||[10,20].indexOf(V)<0)throw new Error('mesure non prévue');return {V:V,m:L.m10*V/10,txt:V+' mL de '+L.nom+' : la balance tarée affiche '+(L.m10*V/10)+' g.'};};
  /* prévision avec un tableau de proportionnalité, pour une même matière : coefficient entier, jamais de quotient masse ÷ volume */
  Q.PREVISIONS=[
    {id:'jetons12',txt:'La masse d’un sac de 12 jetons de laiton',ref:'1 jeton : 51 g',coef:12,ref_m:51,unite:'g',juste:612},
    {id:'huile2L',txt:'La masse de 2 L d’huile (2 L = 2 000 mL)',ref:'10 mL d’huile : 9 g',coef:200,ref_m:9,unite:'g',juste:1800},
    {id:'sirop075',txt:'La masse de 0,75 L de sirop (0,75 L = 750 mL)',ref:'10 mL de sirop : 13 g',coef:75,ref_m:13,unite:'g',juste:975},
    {id:'vinaigre2L',txt:'La masse de 2 L de vinaigre',ref:'10 mL de vinaigre : 10 g',coef:200,ref_m:10,unite:'g',juste:2000}
  ];
  Q.verifierPrevision=function(id,s){
    var p=trouve(Q.PREVISIONS,id,'prévision'),v=nombre(s),ok=egal(v,p.juste);
    return {juste:ok,attendu:p.juste,retour:ok?'Oui : pour une même matière, la quantité est multipliée par '+p.coef+', la masse aussi : '+p.ref_m+' g × '+p.coef+' = '+p.juste+' g.':'Cherche par combien on multiplie la quantité de départ ('+p.ref+') pour obtenir la quantité demandée, puis multiplie la masse par le même nombre.'};
  };

  /* ---------- outils communs ---------- */
  function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
  Q.cap=cap;
  Q.valides=function(st){return st.essais.filter(function(e){return (typeof e.observation==='string'&&e.observation.trim().length>=10)||e.juste===true;});};
  window.NohobaMesures=Q;
})();
