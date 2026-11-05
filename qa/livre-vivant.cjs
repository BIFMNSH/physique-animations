/* Livre vivant (4 niveaux) : lois des leçons, structure des chapitres, sommaire, parcours (prédis puis révèle, vérification, laboratoire, défi), son plafonné, reprise. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('livre-vivant/index.html'),prog=read('assets/studio/programme.js'),eng=read('assets/vivant/vivant.js'),css=read('assets/vivant/vivant.css');
const SL=['changements-etat','dilatation-gaz','tension-sinusoidale','masse-poids','conducteur-ohmique'];
const MODS=Object.fromEntries(SL.map(s=>[s,read('assets/vivant/lecons/'+s+'.js')]));
assert.ok(/noindex/.test(html)&&!read('sitemap.xml').includes('/livre-vivant/'),'prototype hors référencement');
assert.ok(!/(src|href)="https?:/.test(html)&&!/@import|url\(https?:/.test(css),'aucune ressource externe');
assert.ok(/feTurbulence/.test(html)&&/perspective/.test(css)&&/preserve-3d/.test(css),'bois en feTurbulence, perspective 3D');
assert.ok(!/prefers-reduced-motion/.test(css+eng),'animations actives par défaut, même en réduction des mouvements');
assert.ok(!/[؀-ۿ]/.test(html+eng+css),'français uniquement (pas de section bilingue)');
for(const bad of ['opacity','overflow:hidden','filter'])for(const sel of ['.pop{','.pop .bk{','.pop .wl,.pop .wr{'])for(const m of css.matchAll(new RegExp(sel.replace(/[.{]/g,'\\$&')+'[^}]*}','g')))assert.ok(!new RegExp(bad).test(m[0]),'pas de '+bad+' sur '+sel);
const FAKE=(titre)=>({title:titre,theme:'T',inquiry:{situation:'S',prediction:'P'},retiens:['a','b','c'],quiz:[0,1,2,3,4].map(i=>({q:'Question '+i,o:['a','b','c'],a:1,e:'Parce que '+i}))});
let audio=null;
function ouvre(url,store,largeur){
 const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,'').replace('<script>Vivant.init();</script>',''),{url,runScripts:'outside-only'}).window;
 for(const[k,v]of Object.entries(store||{}))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
 if(largeur)Object.defineProperty(w,'innerWidth',{value:largeur,configurable:true});
 w.HTMLCanvasElement.prototype.getContext=()=>null;
 audio={ctx:0,osc:[],gains:[],master:null};
 w.AudioContext=function(){audio.ctx++;this.currentTime=0;this.state='running';this.destination={};this.createGain=()=>{const g={gain:{value:1,setTargetAtTime(v){this.value=v;this.last=v}},connect(){},disconnect(){}};audio.gains.push(g);return g};this.createOscillator=()=>{const o={frequency:{value:0,setTargetAtTime(v){this.value=v;this.n=(this.n||0)+1}},started:false,stopped:false,connect(){},disconnect(){},start(){o.started=true},stop(){o.stopped=true}};audio.osc.push(o);return o};this.resume=()=>{}};
 const ap=w.document.body.appendChild.bind(w.document.body);
 w.document.body.appendChild=x=>{if(x.tagName==='SCRIPT'){const m=/lecons\/([a-z-]+)\.js/.exec(x.src);w.Studio.start(FAKE(m?m[1]:'x'));setTimeout(()=>x.onload&&x.onload(),0);return x;}return ap(x);};
 w.eval(prog);w.eval(eng);for(const s of SL)w.eval(MODS[s]);w.Vivant.init();return w;}
const attend=(ms)=>new Promise(r=>setTimeout(r,ms||40));
(async()=>{
 let w=ouvre('http://localhost/livre-vivant/?n=x'),d=w.document,V=w.Vivant;
 /* 1. lois des leçons : chaque valeur affichée vient d'une loi */
 assert.equal(V.lois.poids(5,10),50);assert.ok(Math.abs(V.lois.poids(2,1.6)-3.2)<1e-9);
 assert.equal(V.lois.ohm(100,30),3);assert.ok(Math.abs(V.lois.ohm(470,50)-23.5)<1e-9);assert.equal(V.lois.periode(25),0.04);assert.ok(Math.abs(V.lois.ueff(10)-7.0711)<1e-3);assert.ok(Math.abs(220*Math.SQRT2-311.1)<0.1);
 assert.equal(V.lois.etatEau(10).n,'solide');assert.equal(V.lois.etatEau(30).n,'fusion');assert.equal(V.lois.etatEau(50).n,'liquide');assert.equal(V.lois.etatEau(70).n,'vaporisation');assert.equal(V.lois.etatEau(90).n,'gaz');
 assert.equal(V.lois.niveauTemp(25),0.25);assert.equal(V.lois.niveauTemp(35),0.25,'palier de fusion : température constante');assert.equal(V.lois.niveauTemp(70),0.75);assert.equal(V.lois.niveauTemp(80),0.75,'palier de vaporisation');
 assert.ok(V.lois.niveauTemp(50)>0.25&&V.lois.niveauTemp(50)<0.75&&V.lois.niveauTemp(100)===1);
 /* 2. structure de chaque module */
 for(const s of SL){const M=V.mods[s];assert.ok(M,s);assert.ok(M.chap.length>=2&&M.chap.length<=4,s+' : 3 à 5 chapitres avec le défi');
  M.chap.forEach((c,i)=>{assert.ok(c.cur&&c.paras.length>=1&&c.paras.every(p=>p.length<=200),s+' ch'+i+' : explication courte');assert.ok(c.loi&&c.loi.t&&c.note,s+' ch'+i+' : loi et note');
   assert.ok(c.predis.opts.length>=3&&c.predis.a>=0&&c.predis.a<c.predis.opts.length&&c.predis.rep,s+' ch'+i+' : prédis puis révèle');assert.ok(c.verif.o.length>=3&&c.verif.a<c.verif.o.length&&c.verif.e,s+' ch'+i+' : vérification');
   assert.ok(typeof c.lab.scene==='function'&&typeof c.lab.read==='function'&&c.lab.inputs.length>=1&&c.lab.alt,s+' ch'+i+' : laboratoire accessible');});
  if(s!=='dilatation-gaz')assert.ok(M.chap.some(c=>c.lab.sit&&c.lab.sit.length===2),s+' : une comparaison en alternance');assert.ok(M.chap[0].lab.sound,s+' : son');assert.equal(M.manches({}).length>=2,true,s+' : manches de laboratoire');}
 /* valeurs lues par défaut = lois */
 const rd=(s,i,v)=>V.mods[s].chap[i].lab.read(v,{}).join(' ');
 assert.match(rd('masse-poids',0,{m:2,g:'10'}),/2,0 kg × 10 N\/kg = 20 N/);assert.match(rd('masse-poids',0,{m:2,g:'1.6'}),/1,6 N\/kg = 3,2 N/);
 assert.match(rd('conducteur-ohmique',0,{R:'100',I:30}),/100 Ω × 0,030 A = 3,0 V/);assert.match(rd('tension-sinusoidale',0,{f:250,U:4}),/1 ÷ 250 Hz = 0,004 s = 4 ms[\s\S]*≈ 2,8 V/);
 assert.match(rd('changements-etat',0,{tau:30,sens:'chaud'}),/Fusion[\s\S]*Palier : la température reste à 0 °C/);assert.match(rd('changements-etat',0,{tau:75,sens:'chaud'}),/Palier[\s\S]*100 °C/);assert.match(rd('changements-etat',0,{tau:30,sens:'froid'}),/Liquéfaction/,'refroidissement : liquéfaction');
 assert.match(rd('dilatation-gaz',0,{T:80}),/plus gonflé[\s\S]*16/);
 /* 3. sommaire : quatre niveaux, 53 leçons, 5 ouvertes */
 w=ouvre('http://localhost/livre-vivant/');d=w.document;assert.equal(d.querySelectorAll('.niv button').length,4);
 let ouv=0,tot=0;for(const n of ['6e','5e','4e','3e']){d.querySelector('.niv button[data-n="'+n+'"]').click();tot+=d.querySelectorAll('.les > *').length;ouv+=d.querySelectorAll('.les a').length;}
 assert.equal(tot,53);assert.equal(ouv,5);d.querySelector('.niv button[data-n="3e"]').click();assert.match(d.body.textContent,/Masse et poids/);assert.equal(d.querySelector('.niv [aria-selected="true"]').textContent,'3e');assert.equal(w.localStorage.getItem('vv-niveau'),'3e','le niveau est retenu');
 /* 4. parcours d'une leçon (masse-poids, 3e) */
 w=ouvre('http://localhost/livre-vivant/?l=masse-poids');d=w.document;await attend();const $=s=>d.querySelector(s),pg=()=>[...d.querySelectorAll('#book .page')].map(p=>p.dataset.ci+p.dataset.sd).join(',');
 assert.equal(pg(),'0g,0d');assert.equal(audio.ctx,0,'aucun son avant la première interaction');assert.equal(d.querySelectorAll('#dots button').length,3);
 $('#bAnim').click();assert.ok(!d.body.classList.contains('anim'),'bouton « Animations » : arrêt');assert.ok(d.querySelector('.pop.up'),'sans animation, le modèle est dressé directement');
 /* prédis puis révèle */
 assert.ok($('[data-lg]').disabled,'languette bloquée avant la prédiction');assert.equal($('[data-ans]').getAttribute('aria-hidden'),'true');
 $('[data-p="0"]').click();assert.ok(!$('[data-lg]').disabled);$('[data-lg]').click();assert.ok($('[data-lg]').classList.contains('lift'));assert.match($('[data-ans]').textContent,/Surprenant[\s\S]*ne dépend pas du lieu/);assert.ok(!$('[data-ans]').hasAttribute('aria-hidden'));
 /* laboratoire : curseur, lieu, valeurs, son */
 const r=$('[data-in="m"]');r.value='5';r.dispatchEvent(new w.Event('input'));assert.match($('[data-rd]').textContent,/5,0 kg × 10 N\/kg = 50 N/);assert.equal(audio.ctx,1,'le son démarre au premier mouvement');assert.ok(audio.osc[0].started);
 assert.ok(audio.gains[0].gain.value<=0.1,'niveau maximal limité');assert.ok(audio.osc[0].frequency.value>0);
 $('[data-ch="g"][data-v="1.6"]').click();assert.match($('[data-rd]').textContent,/5,0 kg × 1,6 N\/kg = 8,0 N/);
 await attend(1850);assert.equal(w.Vivant.AU.osc,null,'le son s’arrête environ 1,5 s après le dernier mouvement');assert.ok(audio.osc[0].stopped);
 $('[data-ecoute]').click();assert.ok(w.Vivant.AU.osc,'« Écouter » maintient le son');await attend(1700);assert.ok(w.Vivant.AU.osc,'…sans arrêt automatique');
 $('#next').click();assert.equal(w.Vivant.AU.osc,null,'le son s’arrête au changement de page');
 $('#bSon').click();r.dispatchEvent(new w.Event('input'));assert.equal(audio.ctx,1);
 assert.equal(w.Vivant.AU.mute,true);assert.equal(audio.gains[0].gain.value,0,'sourdine');$('#bSon').click();
 /* chapitre 1 -> vérification */
 w=ouvre('http://localhost/livre-vivant/?l=masse-poids');d=w.document;await attend();const $2=s=>d.querySelector(s);$2('#bAnim').click();
 $2('[data-v="0"]').click();assert.match($2('[data-vx]').textContent,/Pas encore/);$2('[data-v="1"]').click();assert.match($2('[data-vx]').textContent,/Exact/);assert.match($2('#dots').textContent,/1✓/);
 /* comparaison en alternance */
 $2('#next').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.ci+p.dataset.sd).join(','),'1g,1d');
 assert.equal(d.querySelectorAll('.rd .ln').length,2,'deux situations : une ligne chacune');$2('[data-cmp]').click();assert.equal($2('[data-cmp]').getAttribute('aria-pressed'),'true');assert.ok(d.querySelectorAll('.rd .ln.dim').length===1,'situation inactive atténuée');$2('[data-cmp]').click();
 /* défi : 7 manches (5 du manuel + 2 de laboratoire) */
 $2('#next').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.ci+p.dataset.sd).join(','),'2g,2d');
 const n=w.Vivant.etat().dm.length;assert.equal(n,7);
 for(let i=0;i<n;i++){assert.match($2('[data-manche]').textContent,new RegExp('Manche '+(i+1)+' sur '+n));const m=w.Vivant.etat().dm[i];
  if(m.type==='qcm')$2('[data-k="'+m.a+'"]').click();else if(m.type==='calcul'){$2('#rep').value=String(m.ans).replace('.',',');$2('[data-val]').click();}else{$2('.z[data-z="'+m.a+'"]').dispatchEvent(new w.Event('click'));}
  assert.match($2('[data-mx]').textContent,/Exact\./,'manche '+(i+1)+' réussie ('+m.type+')');$2('[data-sv]').click();}
 assert.match($2('#book').textContent,/Défi terminé[\s\S]*7 manches réussies sur 7/);assert.match($2('#book').textContent,/★★★/);assert.match($2('#dots').textContent,/3✓/);
 /* le calcul lit le laboratoire : tolérance et mauvaise réponse sans punition */
 $2('[data-rejoue]').click();assert.equal(w.Vivant.etat().sv.q.length,0);const c0=w.Vivant.etat().dm[3];assert.equal(c0.type,'calcul');
 for(let i=0;i<3;i++){$2('[data-k="0"]').click();$2('[data-sv]').click();}
 $2('#rep').value='999';$2('[data-val]').click();assert.match($2('[data-mx]').textContent,/Pas encore\./);assert.ok(/P = m × g/.test($2('[data-mx]').textContent));
 /* reprise */
 const st=w.localStorage.getItem('vv-masse-poids');w=ouvre('http://localhost/livre-vivant/?l=masse-poids',{'vv-masse-poids':st});d=w.document;await attend();assert.match(d.querySelector('#dots').textContent,/1✓/,'progression retrouvée');
 w=ouvre('http://localhost/livre-vivant/?l=masse-poids',{'vv-masse-poids':'{cassé'});d=w.document;await attend();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.ci+p.dataset.sd).join(','),'0g,0d');
 /* téléphone : une seule page, six pages en séquence ; mode enseignant : laboratoire seul, Esc pour sortir */
 w=ouvre('http://localhost/livre-vivant/?l=tension-sinusoidale',{},390);d=w.document;await attend();assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1);d.querySelector('#bAnim').click();
 d.querySelector('#next').click();assert.equal(d.querySelector('#book .page').dataset.sd,'d');
 w=ouvre('http://localhost/livre-vivant/?l=tension-sinusoidale');d=w.document;await attend();d.querySelector('#bAnim').click();d.querySelector('#bEns').click();assert.ok(d.body.classList.contains('ens'));assert.equal(d.querySelectorAll('#book .page').length,1);assert.equal(d.querySelector('#book .page').dataset.sd,'d');assert.ok(!d.querySelector('#ensOut').hidden);
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.ok(!d.body.classList.contains('ens'));assert.equal(d.querySelectorAll('#book .page').length,2,'Esc quitte le mode enseignant');
 w=ouvre('http://localhost/livre-vivant/?l=tension-sinusoidale');d=w.document;await attend();d.querySelector('#bAnim').click();d.querySelector('#bEns').click();d.querySelector('#ensOut').click();assert.ok(!d.body.classList.contains('ens'),'le bouton de sortie fonctionne');
 /* clavier : flèches */
 w=ouvre('http://localhost/livre-vivant/?l=conducteur-ohmique');d=w.document;await attend();d.querySelector('#bAnim').click();d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight'}));assert.equal(d.querySelector('#book .page').dataset.ci,'1');d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft'}));assert.equal(d.querySelector('#book .page').dataset.ci,'0');
 console.log('Livre vivant : lois, structure des 5 leçons, sommaire des 4 niveaux (53 leçons), prédis puis révèle, vérification, laboratoire, son plafonné, défi à 7 manches, reprise, téléphone, mode enseignant et flèches contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
