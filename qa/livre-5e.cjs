/* Livre de physique-chimie 5e : données des 13 leçons, sommaire, parcours sans cahier (fiche d'investigation dans un volet, bilan par fiche, défi), reprise. */
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
 w.document.body.appendChild=x=>{if(x.tagName==='SCRIPT'){w.Studio.start(FAKE);if(/fiches\//.test(x.src))w[(/NL-5E-(\w+)-(\d+)\.js/.exec(x.src)||[]).slice(1).reduce((a,b,k)=>k?a+b:'FICHE_5E_'+b,'')]={synthese:'Bilan de la fiche '+x.src.slice(-8)};setTimeout(()=>x.onload&&x.onload(),0);return x;}return ap(x);};
 w.eval(prog);w.eval(at);w.eval(js);return w;}
const attend=()=>new Promise(r=>setTimeout(r,30));
(async()=>{
 const F='pc-act-NL-5E-DIL-04',pos=w=>[...w.document.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(',');
 /* sommaire */
 let w=ouvre('http://localhost/livre/',{'pc-livre-dilatation-gaz':{m:3,start:1,q:[]},'pc-livre-melanges':{m:8,start:1,q:[]},'pc-act-NL-5E-MEL-01':{conclusion:'ok'},'pc-livre-tension':{m:9,fini:true,q:[1,1,1,0,1]}}),d=w.document;
 assert.equal(d.querySelectorAll('.toc a').length,13,'13 leçons au sommaire');assert.match(d.querySelector('.toc a[href="?l=tension"]').textContent,/Terminée · 4\/5/);
 assert.match(d.querySelector('.toc a[href="?l=dilatation-gaz"]').textContent,/0 fiche sur 1/);assert.match(d.querySelector('.toc a[href="?l=melanges"]').textContent,/1 fiche sur 3/);
 /* leçon : plus de cahier, une seule zone d'écriture (la fiche) */
 w=ouvre('http://localhost/livre/?l=dilatation-gaz');d=w.document;await attend();const $=s=>d.querySelector(s);
 assert.equal(pos(w),'s1l,s1r');assert.match($('[data-pg="s1l"]').textContent,/Pourquoi la lampe/);assert.ok($('#next').disabled,'chapitre 2 fermé');
 assert.ok(!$('#cahier')&&!$('#bCahier')&&!d.querySelector('textarea'),'ni cahier ni saisie dans le livre');assert.ok(!/cahier/i.test(d.body.textContent),'le mot « cahier » a disparu');
 $('[data-start]').click();assert.equal(pos(w),'s2l,s2r','le livre ouvre le laboratoire');
 assert.equal(d.querySelectorAll('.fl a').length,1);assert.match($('.fl a').textContent,/À faire/);
 $('[data-pg="s2l"] [data-labo]').click();assert.match($('#volet iframe').getAttribute('src'),/lecon\/\?l=dilatation-gaz&embed=sim/);assert.match($('#volet').textContent,/Simulation/);$('[data-lfin]').click();assert.ok($('#volet').hidden,'« Explorer librement » ne valide rien');
 $('.fl a').click();assert.match($('#volet iframe').getAttribute('src'),/activites-5e\/\?a=NL-5E-DIL-04&embed=1/);
 w.localStorage.setItem(F,JSON.stringify({prevision:{raison:'Mon hypothèse car'},essais:[{}]}));$('[data-lfin]').click();
 assert.ok($('#volet').hidden);assert.match($('[data-pg="s2r"]').textContent,/Mon hypothèse car[\s\S]*1 essai réalisé/,'ce que l’élève a écrit dans la fiche apparaît dans le livre');assert.match($('.fl a').textContent,/En cours/);assert.ok($('#next').disabled,'pas de bilan avant la conclusion');
 w.localStorage.setItem(F,JSON.stringify({prevision:{raison:'Mon hypothèse car'},essais:[{}],confront:{verdict:1},conclusion:'Le gaz se dilate.'}));$('.fl a').click();$('[data-lfin]').click();
 assert.equal(pos(w),'s3l,s3r','la conclusion ouvre « Ce que dit l’expérience »');assert.match($('[data-pg="s3l"]').textContent,/Le gaz se dilate/);assert.match($('[data-pg="s3r"]').textContent,/Bilan de la fiche/,'chaque fiche a son bilan');
 assert.ok(!$('#next').disabled,'une seule fiche, toutes terminées : le défi s’ouvre');$('#next').click();assert.equal(pos(w),'s4l,s4r');
 for(let i=0;i<5;i++){assert.match($('[data-pg="s4r"]').textContent,new RegExp('Manche '+(i+1)+' sur 5'));$('[data-dq] [data-i="'+(i===4?0:1)+'"]').click();assert.match($('[data-dx]').textContent,/Parce que/);$('[data-dsv]').click();}
 assert.match($('[data-pg="s4r"]').textContent,/Défi terminé[\s\S]*4 manches réussies sur 5/);assert.ok(!$('#fin'));
 /* leçon à trois fiches : une seule fiche terminée ouvre son bilan mais pas le défi */
 w=ouvre('http://localhost/livre/?l=melanges',{'pc-livre-melanges':{m:3,start:1,q:[],pos:2},'pc-act-NL-5E-MEL-01':{prevision:{raison:'x'},essais:[{}],confront:{},conclusion:'Fini 1'}});d=w.document;await attend();
 assert.equal(d.querySelectorAll('.fl a').length,3);assert.match($('.fl a').textContent,/Terminée/);
 d.querySelectorAll('.fl a')[1].click();assert.match($('#volet iframe').getAttribute('src'),/activites-5e\/\?a=NL-5E-MEL-02&embed=1/);$('[data-lfin]').click();
 $('#next').click();assert.equal(pos(w),'s3l,s3r');assert.match($('[data-pg="s3r"]').textContent,/Bilan de la fiche[\s\S]*Termine cette fiche/);assert.ok($('#next').disabled,'défi fermé tant que les 3 fiches ne sont pas terminées');
 /* reprise, données abîmées, téléphone */
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':{m:9,start:1,q:[1,1,1,1,1],fini:true,pos:6},[F]:{conclusion:'ok'}});d=w.document;await attend();assert.equal(pos(w),'s4l,s4r','reprise au défi');
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':'{cassé'});d=w.document;await attend();assert.equal(pos(w),'s1l,s1r');
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{},390);d=w.document;await attend();assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1);
 d.querySelector('[data-start]').click();assert.equal(pos(w),'s2l','téléphone : le livre ouvre le laboratoire');assert.ok(d.querySelector('.fl a'));
 w=ouvre('http://localhost/livre/?l=inconnue');assert.equal(w.document.querySelectorAll('.toc a').length,13,'leçon inconnue : sommaire');
 {const att={intensite:1,'generateur-recepteur':1,'association-lampes':1,'piles-serie':1,tension:1,'pression-atmospherique':2,melanges:3,'atomes-molecules':2,'combustion-carbone':1,'combustion-soufre':1,'dilatation-solides':2,'dilatation-liquides':1,'dilatation-gaz':1};
  for(const [sl,n] of Object.entries(att)){const w2=ouvre('http://localhost/livre/?l='+sl,{['pc-livre-'+sl]:{m:3,start:1,q:[],pos:2}});await attend();assert.equal(w2.document.querySelectorAll('a[href*="activites-5e/?a=NL-5E-"]').length,n,'fiches reliées au livre : '+sl);}}
 assert.ok(!/ouvreCahier|rendreCahier|bCahier/.test(js)&&!/#cahier|#cb\b/.test(css),'plus de code de cahier');
 console.log('Cartable de 5e : 13 leçons, sommaire, fiche dans le volet, état déduit des fiches, bilan par fiche, défi après toutes les fiches, reprise contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
