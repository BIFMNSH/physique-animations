
(function(){
  var cv=document.getElementById('lab'),cx=cv.getContext('2d'),inp=document.getElementById('ph'),
      phv=document.getElementById('phv'),kind=document.getElementById('kind'),hint=document.getElementById('try'),
      hero=document.querySelector('.hero');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Indicateur universel (couleurs approchées)
  var STOPS=[[1,[229,56,59]],[4,[249,160,63]],[6,[233,210,59]],[7,[63,191,106]],[9,[46,156,219]],[11,[76,91,212]],[13,[142,63,208]]];
  function col(p){for(var i=0;i<STOPS.length-1;i++){var a=STOPS[i],b=STOPS[i+1];if(p<=b[0]){var t=(p-a[0])/(b[0]-a[0]);return a[1].map(function(v,k){return Math.round(v+(b[1][k]-v)*t);});}}return STOPS[STOPS.length-1][1];}
  function kindOf(p){var r=Math.round(p*10)/10;return r<7?'acide':r>7?'basique':'neutre';}
  var W=900,H=900,cur=7,target=7,parts=[],t0=performance.now(),touched=false;
  // Bécher
  var B={x:200,y:170,w:500,h:600,r:46};var level=0;
  for(var i=0;i<44;i++)parts.push({x:B.x+50+Math.random()*(B.w-100),y:B.y+190+Math.random()*(B.h-240),vx:(Math.random()-.5)*1.1,vy:(Math.random()-.5)*1.1,s:Math.random()});
  function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+h-r);cx.quadraticCurveTo(x,y+h,x+r,y+h);cx.lineTo(x+w-r,y+h);cx.quadraticCurveTo(x+w,y+h,x+w,y+h-r);cx.lineTo(x+w,y);}
  function draw(now){
    var c=col(cur),rgb='rgb('+c+')',ra=function(a){return 'rgba('+c+','+a+')';};
    cx.clearRect(0,0,W,H);
    // halo
    var g=cx.createRadialGradient(450,560,40,450,560,460);g.addColorStop(0,ra(.35));g.addColorStop(1,ra(0));cx.fillStyle=g;cx.fillRect(0,0,W,H);
    // graduations
    var LT=document.documentElement.getAttribute('data-theme')==='light';cx.strokeStyle=LT?'rgba(14,22,42,.35)':'rgba(164,176,204,.35)';cx.lineWidth=3;
    for(var k=0;k<6;k++){var yy=B.y+B.h-90-k*80;cx.beginPath();cx.moveTo(B.x+B.w-70,yy);cx.lineTo(B.x+B.w-20,yy);cx.stroke();}
    // liquide
    var top=B.y+B.h-(B.h-150)*level, wave=reduce?0:Math.sin(now/600)*6;
    cx.save();rr(B.x+8,B.y,B.w-16,B.h-8,B.r);cx.clip();
    var lg=cx.createLinearGradient(0,top,0,B.y+B.h);lg.addColorStop(0,ra(.95));lg.addColorStop(1,'rgba('+c.map(function(v){return Math.round(v*.45);})+',.95)');
    cx.fillStyle=lg;cx.beginPath();cx.moveTo(B.x,top+wave);
    for(var x=0;x<=B.w;x+=20)cx.lineTo(B.x+x,top+Math.sin((x/90)+(reduce?0:now/500))*7);
    cx.lineTo(B.x+B.w,B.y+B.h);cx.lineTo(B.x,B.y+B.h);cx.closePath();cx.fill();
    // ions : H+ (acide) et HO- (base)
    var acid=Math.max(0,7-cur)/6, base=Math.max(0,cur-7)/6;
    parts.forEach(function(p,i){
      if(!reduce){p.x+=p.vx+Math.sin(now/900+i)*.3;p.y+=p.vy+Math.cos(now/1100+i)*.3;var T=B.y+150;if(p.y<T+34){p.y=T+34;p.vy=Math.abs(p.vy);}if(p.y>B.y+B.h-40){p.y=B.y+B.h-40;p.vy=-Math.abs(p.vy);}if(p.x<B.x+40){p.x=B.x+40;p.vx=Math.abs(p.vx);}if(p.x>B.x+B.w-40){p.x=B.x+B.w-40;p.vx=-Math.abs(p.vx);}}
      if(p.y<top+20)return;
      var isA=i%2===0, a=isA?acid:base; if(a<.04&&p.s>.2)return;
      var show=Math.max(Math.min(1,a*1.6),(p.s<.22)?.6:0);
      cx.globalAlpha=Math.min(1,show*1.2);cx.fillStyle=LT?(isA?'#7A1F22':'#1F3F7A'):(isA?'#FFE0E0':'#DDEBFF');
      cx.beginPath();cx.arc(p.x,p.y,isA?22:26,0,7);cx.fill();
      if(show>.5){cx.fillStyle=LT?'#FFFFFF':'#0A1022';cx.font='800 24px Bricolage Grotesque, sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(isA?'H⁺':'HO⁻',p.x,p.y+1);}
      cx.globalAlpha=1;});
    // reflet
    var sh=cx.createLinearGradient(B.x,0,B.x+B.w,0);sh.addColorStop(0,'rgba(255,255,255,.12)');sh.addColorStop(.18,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(255,255,255,.05)');cx.fillStyle=sh;cx.fillRect(B.x,B.y,B.w,B.h);
    cx.restore();
    // verre
    cx.strokeStyle=LT?'rgba(30,45,80,.7)':'rgba(220,230,255,.75)';cx.lineWidth=7;rr(B.x+4,B.y,B.w-8,B.h-4,B.r);cx.stroke();
    cx.beginPath();cx.moveTo(B.x-24,B.y);cx.lineTo(B.x+40,B.y);cx.moveTo(B.x+B.w-40,B.y);cx.lineTo(B.x+B.w+10,B.y);cx.stroke();
  }
  function setUI(){var r=Math.round(cur*10)/10,k=kindOf(cur);
    phv.textContent='pH '+r.toLocaleString('fr-FR');kind.textContent=k==='neutre'?'neutre : ni acide ni basique':k;
    var c=col(cur);var LT=document.documentElement.getAttribute('data-theme')==='light';phv.style.color=LT?'rgb('+c.map(function(v){return Math.round(v*.6);})+')':'rgb('+c+')';hero.style.setProperty('--glow','rgba('+c+',.24)');
    inp.setAttribute('aria-valuetext','pH '+r.toLocaleString('fr-FR')+', solution '+k);}
  inp.addEventListener('input',function(){target=parseFloat(inp.value);if(reduce)cur=target;if(!touched){touched=true;hint.style.opacity=0;}setUI();});
  window.addEventListener('themechange',function(){setUI();draw(performance.now());});
  // Glisser directement sur le bécher
  function fromPointer(e){var r=cv.getBoundingClientRect();var p=1+12*Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));inp.value=p.toFixed(1);inp.dispatchEvent(new Event('input'));}
  cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);fromPointer(e);cv.onpointermove=fromPointer;});
  cv.addEventListener('pointerup',function(){cv.onpointermove=null;});
  // Ouverture : le bécher se remplit, puis l'indicateur parcourt l'échelle une fois et revient au neutre
  var intro=!reduce;
  function frame(now){
    var e=(now-t0)/1000;
    if(intro){level=Math.min(1,e/1.1);level=1-Math.pow(1-level,3);
      if(e>1.2&&e<3.4&&!touched){var u=(e-1.2)/2.2;target=7+6*Math.sin(u*Math.PI*2)*(1-u*.15);}
      if(e>=3.4){intro=false;if(!touched)target=7;}}
    else level=1;
    cur+= (target-cur)*(reduce?1:.12);
    setUI();draw(now);
    if(!reduce||intro)requestAnimationFrame(frame);
  }
  if(reduce){level=1;setUI();draw(0);inp.addEventListener('input',function(){draw(0);});}
  else requestAnimationFrame(frame);
})();

(function(){
var SM=[["etat-eau","5e","Courbe de chauffage de l’eau","Matière"],["solubilite","5e","Dissoudre jusqu’à saturation","Matière"],["circuits-lampes","5e","Lampes en série et en dérivation","Électricité"],["vitesse","5e","Mesurer une vitesse","Mouvement"],["phases-lune","5e","Les phases de la Lune","Univers"],["masse-volumique","4e","Masse volumique","Matière"],["mouvement-bille","4e","Chronophotographie d’un mouvement","Mouvement"],["ressort","4e","Allongement d’un ressort","Mouvement"],["additivite","4e","Intensité et tension : les lois d’additivité","Électricité"],["ohm","4e","La loi d’Ohm","Électricité"],["miroir","4e","Réflexion de la lumière sur un miroir","Signaux"],["vitesse-son","4e","La vitesse du son","Signaux"],["ph","3e","Acide ou basique : le pH","Matière"],["poids-masse","3e","Poids et masse","Mouvement"],["energie-chute","3e","Énergie cinétique et énergie de position","Énergie"],["puissance-energie","3e","Puissance, énergie et coût","Énergie"],["effet-serre","3e","Un modèle de l’effet de serre","Énergie"],["force-vecteur","3e","Représenter une force","Mouvement"],["equilibre-2forces","3e","Équilibre d’un solide soumis à deux forces","Mouvement"],["travail-puissance","3e","Travail et puissance d’une force","Énergie"],["electrolyse-eau","3e","L’électrolyse de l’eau","Matière"],["alcanes","3e","Les alcanes et leur combustion","Matière"],["combustions","3e","Combustions dans le dioxygène","Matière"],["reduction-cuo","3e","Réduction de l’oxyde de cuivre","Matière"],["lentille-image","3e","Image donnée par une lentille convergente","Signaux"],["oeil","3e","L’œil et la correction de la vision","Signaux"]];
var LS=[["sources-recepteurs","4e","Sources et récepteurs de lumière","Optique"],["propagation-lumiere","4e","Propagation de la lumière","Optique"],["phases-eclipses","4e","Les phases de la Lune et les éclipses","Optique"],["lumiere-blanche","4e","Analyse et synthèse de la lumière blanche","Optique"],["aimant-bobine","4e","Aimant et bobine","Courants et tensions alternatifs"],["tension-alternative","4e","Production d’une tension alternative","Courants et tensions alternatifs"],["tension-sinusoidale","4e","Tension alternative sinusoïdale","Courants et tensions alternatifs"],["dangers-secteur","4e","Dangers du courant du secteur","Courants et tensions alternatifs"],["transfo-redressement","4e","Transformation, redressement et lissage","Courants et tensions alternatifs"],["atomes-ions","4e","Atomes et ions","Les ions"],["metal-ion","4e","Transformation d’un métal en ion et inversement","Les ions"],["traitement-eau","4e","Traitement de l’eau","Eau potable"],["qualite-eau","4e","Qualité de l’eau","Eau potable"],["generateur-recepteur","5e","Adaptation d’un générateur à un récepteur","Électricité"],["association-lampes","5e","Association de lampes électriques","Électricité"],["piles-serie","5e","Association de piles en série","Électricité"],["intensite","5e","Intensité du courant électrique","Mesure de grandeurs physiques"],["tension","5e","Tension électrique","Mesure de grandeurs physiques"],["pression-atmospherique","5e","Pression atmosphérique","Mesure de grandeurs physiques"],["melanges","5e","Les mélanges","Mélanges et réactions chimiques"],["atomes-molecules","5e","Atomes et molécules","Mélanges et réactions chimiques"],["combustion-carbone","5e","Combustion du carbone","Mélanges et réactions chimiques"],["combustion-soufre","5e","Combustion du soufre","Mélanges et réactions chimiques"],["dilatation-solides","5e","Dilatation des solides","Propriétés physiques de la matière"],["dilatation-liquides","5e","Dilatation des liquides","Propriétés physiques de la matière"],["dilatation-gaz","5e","Dilatation des gaz","Propriétés physiques de la matière"],["circuit-electrique","6e","Le circuit électrique","Électricité"],["commande-circuit","6e","Commande d’un circuit électrique","Électricité"],["court-circuit","6e","Court-circuit et protection des installations électriques","Électricité"],["solides-liquides","6e","Solides et liquides","Propriétés physiques de la matière"],["les-gaz","6e","Les gaz","Propriétés physiques de la matière"],["temperature","6e","Température d’un corps","Propriétés physiques de la matière"],["changements-etat","6e","Les changements d’état de l’eau","Propriétés physiques de la matière"],["constituants-air","6e","Les constituants de l’air","Les combustions"],["combustion-solide-liquide","6e","Combustion d’un solide et d’un liquide","Les combustions"],["combustion-gaz","6e","Combustion d’un gaz : le butane","Les combustions"],["dangers-combustions","6e","Dangers des combustions","Les combustions"],["volume","6e","Volume d’un liquide et d’un solide","Mesure de grandeurs physiques"],["masse","6e","Masse d’un solide et d’un liquide","Mesure de grandeurs physiques"],["masse-poids","3e","Masse et poids d’un corps","Mécanique"],["les-forces","3e","Les forces","Mécanique"],["equilibre-deux-forces","3e","Équilibre d’un solide soumis à deux forces","Mécanique"],["travail-puissance","3e","Travail et puissance mécaniques","Mécanique"],["energie-mecanique","3e","Énergie mécanique","Mécanique"],["electrolyse-eau","3e","Électrolyse et synthèse de l’eau","Les réactions chimiques"],["alcanes","3e","Les alcanes","Les réactions chimiques"],["oxydation-corps-purs","3e","Oxydation des corps purs simples","Les réactions chimiques"],["reduction-oxydes","3e","Réduction des oxydes","Les réactions chimiques"],["solutions-acides-basiques","3e","Solutions acides, basiques et neutres","Les réactions chimiques"],["lentilles","3e","Les lentilles","Optique"],["defauts-oeil","3e","Les défauts de l’œil et leurs corrections","Optique"],["puissance-energie-electriques","3e","Puissance et énergie électriques","Électricité"],["conducteur-ohmique","3e","Le conducteur ohmique","Électricité"]];
function g(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function norm(t){return t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
var btns=document.querySelectorAll('.cls button'),nx=document.getElementById('next');
function url(id){return 'lecon/?l='+id;}
function paint(c){
  btns.forEach(function(b){b.setAttribute('aria-checked',b.dataset.c===c?'true':'false');});
  var P=g('pc-studio-prog')||{},last=P.last,out='';
  var mine=LS.filter(function(x){return x[1]===c;}),done=mine.filter(function(x){return P[x[0]]&&P[x[0]].quiz;}).length;
  var nxt=mine.filter(function(x){return !(P[x[0]]&&P[x[0]].quiz);})[0];
  nx.textContent='';
  function a(href,txt,cls){var e=document.createElement('a');e.href=href;e.className=cls;e.textContent=txt;nx.appendChild(e);}
  function sm(t){var e=document.createElement('small');e.textContent=t;nx.appendChild(e);}
  if(last){var L=LS.filter(function(x){return x[0]===last;})[0];if(L)a(url(L[0]),'Reprendre : '+L[2],'btn go');}
  if(nxt&&(!last||nxt[0]!==last))a(url(nxt[0]),(last?'Prochaine leçon : ':'Commencer : ')+nxt[2],last?'btn':'btn go');
  if(!nxt)sm('Bravo, tu as terminé toutes les leçons de '+c+' ! Essaie le BEPC ou une autre classe.');
  sm(done+' sur '+mine.length+' leçons terminées en '+c);
  var bar=document.createElement('div');bar.className='bar';bar.innerHTML='<i></i>';bar.firstChild.style.width=Math.round(100*done/mine.length)+'%';nx.appendChild(bar);
}
btns.forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('nl-classe',b.dataset.c);}catch(e){}paint(b.dataset.c);});});
var saved;try{saved=localStorage.getItem('nl-classe');}catch(e){}
if(saved){paint(saved);}else{var P0=g('pc-studio-prog');if(P0&&P0.last){var L0=LS.filter(function(x){return x[0]===P0.last;})[0];if(L0)paint(L0[1]);}}
// recherche
var q=document.getElementById('q'),res=document.getElementById('res');
q.addEventListener('input',function(){var t=norm(q.value.trim());res.textContent='';if(t.length<2)return;
  function f(A,k){return A.filter(function(x){return (' '+norm(x[2]+' '+x[3]).replace(/[^a-z0-9]+/g,' ')).indexOf(' '+t)>-1;}).map(function(x){return [x,k];});}
  var m=f(SM,1).concat(f(LS,0)).slice(0,8);
  if(!m.length){var li=document.createElement('li');li.style.color='var(--mist)';li.textContent='Aucune leçon trouvée. Essaie un autre mot.';res.appendChild(li);return;}
  m.forEach(function(y){var x=y[0],li=document.createElement('li'),a=document.createElement('a'),n=document.createElement('span'),s=document.createElement('small');a.href=y[1]?'simulateur/?s='+x[0]:url(x[0]);n.textContent=x[2];s.textContent=(y[1]?'Simulation · ':'Leçon · ')+x[1];a.appendChild(n);a.appendChild(s);li.appendChild(a);res.appendChild(li);});});
// mode projection
var pj=document.getElementById('proj');
pj.addEventListener('click',function(){var on=document.body.classList.toggle('proj');pj.setAttribute('aria-pressed',on?'true':'false');pj.textContent=on?'Quitter la projection':'Projeter en classe';});
// installation
var dp=null,inst=document.getElementById('inst'),note=document.getElementById('inote');
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;});
if(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)inst.style.display='none';
inst.addEventListener('click',function(){if(dp){dp.prompt();dp=null;}else{note.textContent='Ouvre le menu de ton navigateur (⋮ ou Partager), puis « Ajouter à l’écran d’accueil ».';}});
})();
(function(){var b=document.getElementById('tsw'),r=document.documentElement,m=document.querySelector('meta[name="theme-color"]');
function apply(t,save){r.setAttribute('data-theme',t);b.setAttribute('aria-checked',t==='dark'?'true':'false');if(m)m.setAttribute('content',t==='dark'?'#0A1226':'#F4F6FB');
if(save){try{localStorage.setItem('pc-theme',t);}catch(e){}}window.dispatchEvent(new Event('themechange'));}
apply(r.getAttribute('data-theme')==='light'?'light':'dark',false);
b.addEventListener('click',function(){apply(r.getAttribute('data-theme')==='light'?'dark':'light',true);});})();

(function(){
  var vit=document.getElementById('vit');if(!vit)return;
  var reel=document.getElementById('reel'),tabs=document.getElementById('tabs'),btns=tabs.querySelectorAll('button'),
      sc=document.getElementById('rsc'),tag=document.getElementById('rtag'),tit=document.getElementById('rtit'),des=document.getElementById('rdes'),go=document.getElementById('rgo');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T='font-family="sans-serif" font-weight="700" text-anchor="middle"';
  var D=[null,
   {u:'metal/',t:'Le courant électrique dans un métal',d:'Des électrons libres se déplacent entre les atomes. 6 étapes · environ 40 s',
    s:'<g fill="#C88033"><circle cx="90" cy="70" r="20"/><circle cx="215" cy="70" r="20"/><circle cx="340" cy="70" r="20"/><circle cx="90" cy="190" r="20"/><circle cx="215" cy="190" r="20"/><circle cx="340" cy="190" r="20"/></g><g fill="#7FD3FF"><circle cx="150" cy="130" r="8"/><circle cx="270" cy="125" r="8"/><circle cx="385" cy="135" r="8"/><circle cx="40" cy="132" r="8"/></g><path d="M80 238h270" stroke="#F97316" stroke-width="5"/><path d="M350 238l-14-9m14 9l-14 9" stroke="#F97316" stroke-width="5" fill="none"/>'},
   {u:'solutions/',t:'Le courant dans les solutions ioniques',d:'Les ions, positifs et négatifs, transportent le courant. 8 étapes · environ 50 s',
    s:'<rect x="85" y="50" width="260" height="170" rx="12" fill="#2E9CDB" opacity=".25" stroke="#5F6E96" stroke-width="4"/><rect x="135" y="20" width="12" height="130" fill="#C8CFDB"/><rect x="283" y="20" width="12" height="130" fill="#C8CFDB"/><g '+T+' font-size="13"><circle cx="175" cy="105" r="17" fill="#AB5CF2"/><text x="175" y="110" fill="#fff">Na⁺</text><circle cx="205" cy="180" r="17" fill="#AB5CF2"/><text x="205" y="185" fill="#fff">Na⁺</text><circle cx="250" cy="115" r="17" fill="#1FF01F"/><text x="250" y="120" fill="#0E162A">Cl⁻</text><circle cx="300" cy="185" r="17" fill="#1FF01F"/><text x="300" y="190" fill="#0E162A">Cl⁻</text></g>'},
   {u:'atome/',t:'L’atome et sa composition',d:'Noyau, protons, neutrons, électrons : qui est où ? 5 étapes · environ 35 s',
    s:'<g fill="none" stroke="#5F6E96" stroke-width="3"><ellipse cx="215" cy="130" rx="150" ry="55"/><ellipse cx="215" cy="130" rx="150" ry="55" transform="rotate(60 215 130)"/><ellipse cx="215" cy="130" rx="150" ry="55" transform="rotate(120 215 130)"/></g><circle cx="207" cy="124" r="15" fill="#E5383B"/><circle cx="224" cy="134" r="15" fill="#9AA3B5"/><circle cx="210" cy="142" r="15" fill="#E5383B"/><g fill="#7FD3FF"><circle cx="365" cy="130" r="8"/><circle cx="140" cy="68" r="8"/><circle cx="140" cy="192" r="8"/></g>'},
   {u:'ions/',t:'La formation des ions',d:'Un atome gagne ou perd des électrons et devient un ion. 7 étapes · environ 50 s',
    s:'<g '+T+' font-size="16"><circle cx="105" cy="130" r="48" fill="#AB5CF2"/><text x="105" y="136" fill="#fff">Na</text><path d="M175 130h60" stroke="#F97316" stroke-width="5"/><path d="M235 130l-14-9m14 9l-14 9" stroke="#F97316" stroke-width="5" fill="none"/><circle cx="305" cy="130" r="40" fill="#AB5CF2"/><text x="305" y="136" fill="#fff">Na⁺</text><circle cx="392" cy="85" r="10" fill="#7FD3FF"/></g>'},
   {u:'tests/',t:'Identifier des ions en solution',d:'Un réactif, un précipité : sa couleur donne l’ion. 8 étapes · environ 55 s',
    s:'<g stroke="#5F6E96" stroke-width="5" fill="none"><path d="M110 30v150a28 28 0 0 0 56 0V30"/><path d="M200 30v150a28 28 0 0 0 56 0V30"/><path d="M290 30v150a28 28 0 0 0 56 0V30"/></g><path d="M113 150h50v30a25 25 0 0 1-50 0z" fill="#3B82F6"/><path d="M203 150h50v30a25 25 0 0 1-50 0z" fill="#E8EEF9"/><path d="M293 150h50v30a25 25 0 0 1-50 0z" fill="#C2693A"/>'}
  ];
  var cur=0,timer=null,stopped=reduce,paused=false,DUR=12000,cycle=0;
  function show(i){
    cur=i;
    var cards=document.querySelectorAll('.xp.an a');for(var c=0;c<cards.length;c++){cards[c].classList.toggle('on',c===i-1);}
    for(var k=0;k<btns.length;k++){btns[k].setAttribute('aria-pressed',k===i?'true':'false');}
    if(i===0){reel.hidden=true;}
    else{var d=D[i];sc.innerHTML=d.s;tag.textContent='ANIMATION '+i+' SUR 5';tit.textContent=d.t;des.textContent=d.d;go.href=d.u;reel.hidden=false;}
    // relance la barre de progression
    tabs.classList.remove('still');var b=btns[i].querySelector('i');b.style.animation='none';void b.offsetWidth;b.style.animation='';
    if(stopped)tabs.classList.add('still');
  }
  function arm(){clearTimeout(timer);if(stopped)return;timer=setTimeout(tick,DUR);}
  function tick(){
    if(stopped)return;
    if(paused||document.hidden){arm();return;}
    if(cur===5){stopped=true;show(0);return;}  // un seul tour, puis retour au pH
    show(cur+1);arm();
  }
  function stop(){stopped=true;clearTimeout(timer);tabs.classList.add('still');}
  tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop();show(+b.dataset.i);});
  // pause au survol et au focus ; arrêt définitif dès qu'on touche au curseur ou à l'écran
  vit.addEventListener('mouseenter',function(){paused=true;tabs.classList.add('paused');});
  vit.addEventListener('mouseleave',function(){paused=false;tabs.classList.remove('paused');});
  vit.addEventListener('focusin',function(){paused=true;tabs.classList.add('paused');});
  vit.addEventListener('focusout',function(){paused=false;tabs.classList.remove('paused');});
  vit.addEventListener('pointerdown',function(e){if(e.pointerType==='touch'||e.target.closest('.bench'))stop();});
  document.getElementById('ph').addEventListener('input',stop);
  if(!reduce){
    // le premier changement n'arrive qu'après l'introduction du bécher
    timer=setTimeout(function(){if(!stopped){show(1);arm();}},9000);
    tabs.classList.add('still');
  }
})();

if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});