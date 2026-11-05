/* Livre de physique-chimie 5e : données des 13 leçons, sommaire, parcours en neuf moments (livre et cahier), reprise. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('livre/index.html'),prog=read('assets/studio/programme.js'),at=read('assets/shared/atelier-electrique.js'),js=read('assets/livre/livre.js'),css=read('assets/livre/livre.css');
/* 1. les 13 leçons de 5e fournissent situation, hypothèse, critères, À retenir et quiz */
const P={};P.window=P;vm.createContext(P);vm.runInContext(prog,P);let n=0;
for(const th of P.PROGRAMME['5e'])for(const l of th.les){if(!l.ready)continue;n++;const c={};c.window=c;let L=null;c.Studio={s(){return{}},attr(){},fmt:x=>x,kit:{},start(x){L=x}};c.document={};vm.createContext(c);
 for(const k of [].concat(l.kit||[]))vm.runInContext(read('assets/studio/kits/'+k+'.js'),c);vm.runInContext(read('assets/studio/lecons/'+l.slug+'.js'),c);
 assert.ok(L&&L.inquiry&&L.inquiry.situation&&L.inquiry.prediction,l.slug+' : situation et hypothèse');assert.ok((L.retiens||[]).length>=3,l.slug+' : À retenir');
 assert.ok((L.quiz||[]).length>=5&&L.quiz.every(q=>q.q&&q.o.length>=2&&q.a>=0&&q.a<q.o.length),l.slug+' : quiz');}
assert.equal(n,13,'13 leçons de 5e');
assert.ok(/noindex/.test(html)&&!read('sitemap.xml').includes('/livre/'),'prototype hors référencement');
assert.ok(/Ecolier/.test(css)&&fs.existsSync(path.resolve(root,'assets/fonts/playwrite-fr-moderne-latin-400-normal.woff2'))&&fs.existsSync(path.resolve(root,'assets/fonts/LICENSE-playwrite-fr-moderne.txt')),'écriture scolaire auto-hébergée avec sa licence');
assert.ok(!/[؀-ۿ]/.test(html+js),'français uniquement');
/* 2. moteur avec une leçon simulée */
const FAKE={title:'Leçon d’essai',theme:'Électricité',inquiry:{situation:'Pourquoi la lampe brille-t-elle moins ?',prediction:'Prévois et justifie avec « car ».',criteria:['Critère A','Critère B','Critère C']},retiens:['Règle <b>1</b>','Règle 2','Règle 3'],quiz:[0,1,2,3,4].map(i=>({q:'Question '+i,o:['a','b','c'],a:1,e:'Parce que '+i}))};
function ouvre(url,store,largeur){const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url,runScripts:'outside-only'}).window;
 for(const[k,v]of Object.entries(store||{}))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));if(largeur)Object.defineProperty(w,'innerWidth',{value:largeur,configurable:true});
 w.matchMedia=()=>({matches:true});const ap=w.document.body.appendChild.bind(w.document.body);
 w.document.body.appendChild=x=>{if(x.tagName==='SCRIPT'){w.Studio.start(FAKE);setTimeout(()=>x.onload&&x.onload(),0);return x;}return ap(x);};
 w.eval(prog);w.eval(at);w.eval(js);return w;}
const attend=()=>new Promise(r=>setTimeout(r,30));
(async()=>{
 /* sommaire */
 let w=ouvre('http://localhost/livre/',{'pc-livre-dilatation-gaz':{m:4,q:[]},'pc-livre-tension':{m:9,fini:true,q:[1,1,1,0,1]}}),d=w.document;
 assert.equal(d.querySelectorAll('.toc a').length,13,'13 leçons au sommaire');assert.match(d.querySelector('.toc a[href="?l=tension"]').textContent,/Terminée · 4\/5/);assert.match(d.querySelector('.toc a[href="?l=dilatation-gaz"]').textContent,/Moment 4 sur 9/);
 /* leçon (tablette : livre double, cahier en tiroir) */
 w=ouvre('http://localhost/livre/?l=dilatation-gaz');d=w.document;await attend();const $=s=>d.querySelector(s),pg=()=>[...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(',');
 assert.equal(pg(),'s1l,s1r');assert.match($('[data-pg="s1l"]').textContent,/Pourquoi la lampe/);assert.ok($('#next').disabled,'chapitre 2 fermé');assert.match($('#cb').textContent,/Situation-problème/);
 $('[data-ouvre]').click();assert.ok($('#cahier').classList.contains('open'),'le tiroir du cahier s’ouvre');
 $('#c1').click();$('#trep').value='a';$('#c2').click();assert.match($('#msg2').textContent,/quelques mots/);
 $('#trep').value='Ma réponse';$('#c2').click();assert.match($('#m2').textContent,/Ma réponse/,'la réponse reste écrite dans le cahier');
 $('#thyp').value='Mon hypothèse car';$('#c3').click();
 assert.equal(pg(),'s2l,s2r','le livre tourne vers le laboratoire');assert.ok(!$('#cahier').classList.contains('open'));assert.match($('[data-pg="s2r"]').textContent,/Mon hypothèse car/,'l’hypothèse apparaît dans le livre');
 assert.ok($('#c4').disabled,'manipulation requise');$('[data-pg="s2l"] [data-labo]').click();assert.match($('#volet iframe').getAttribute('src'),/lecon\/\?l=dilatation-gaz&embed=sim/);$('[data-lfin]').click();assert.ok($('#volet').hidden);
 for(const [c,m] of [['obs',5],['comp',6]]){$('#t'+c).value='Texte '+c;$('#c'+m).click();}
 assert.equal(pg(),'s3l,s3r','le livre passe à « Ce que dit l’expérience »');assert.match($('[data-pg="s3l"]').textContent,/Texte obs[\s\S]*Texte comp/);assert.ok(!$('.lang').classList.contains('up'),'bilan scientifique couvert');
 $('#tbilan').value='Texte bilan';$('#c7').click();assert.ok($('.lang').classList.contains('up'),'le rabat se soulève');assert.match($('.bs').innerHTML,/<b>1<\/b>/);
 assert.ok($('#c8').disabled);$('[data-cmp="1"]').click();$('#c8').click();assert.equal(pg(),'s4l,s4r');
 for(let i=0;i<5;i++){assert.match($('[data-pg="s4r"]').textContent,new RegExp('Manche '+(i+1)+' sur 5'));$('[data-dq] [data-i="'+(i===4?0:1)+'"]').click();assert.match($('[data-dx]').textContent,/Parce que/);$('[data-dsv]').click();}
 assert.match($('[data-pg="s4r"]').textContent,/Défi terminé[\s\S]*4 manches réussies sur 5/);assert.ok($('#fin'));assert.match($('#fin').textContent,/★★★/);assert.equal(d.querySelectorAll('#cb .en').length,9);
 /* reprise et données abîmées ; téléphone */
 const st=w.localStorage.getItem('pc-livre-dilatation-gaz');w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':st});d=w.document;await attend();
 assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'s4l,s4r','reprise au défi');assert.ok(d.querySelector('#fin'));
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':'{cassé'});d=w.document;await attend();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'s1l,s1r');
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':{m:3,rep:'r',hyp:'',q:[],pos:0}},390);d=w.document;await attend();assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1);
 d.querySelector('#thyp').value='Hyp';d.querySelector('#c3').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'s2l','téléphone : le livre ouvre le laboratoire');
 w=ouvre('http://localhost/livre/?l=inconnue');assert.equal(w.document.querySelectorAll('.toc a').length,13,'leçon inconnue : sommaire');
 {const att={intensite:1,'generateur-recepteur':1,'association-lampes':1,'piles-serie':1,tension:1,'pression-atmospherique':2,melanges:3,'atomes-molecules':2,'combustion-carbone':1,'combustion-soufre':1,'dilatation-solides':2,'dilatation-liquides':1,'dilatation-gaz':1};
  for(const [sl,n] of Object.entries(att)){const w2=ouvre('http://localhost/livre/?l='+sl);await attend();assert.equal(w2.document.querySelectorAll('a[href*="activites-5e/?a=NL-5E-"]').length,n,'fiches reliées au livre : '+sl);}}
 console.log('Cartable de 5e : 13 leçons complètes, sommaire, livre et cahier liés en neuf moments, laboratoire, rabat, défi, tiroir et reprise contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
