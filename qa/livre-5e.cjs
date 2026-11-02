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
 /* leçon en livre (tablette) */
 w=ouvre('http://localhost/livre/?l=dilatation-gaz');d=w.document;await attend();const $=s=>d.querySelector(s),pg=()=>[...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(',');
 assert.equal(pg(),'p1,p2');assert.match($('[data-pg="p1"]').textContent,/Pourquoi la lampe/);assert.ok($('#next').disabled);
 $('[data-commence]').click();$('[data-ecrire="rep"]').click();assert.ok(!$('#volet').hidden,'la feuille volante s’ouvre');
 $('#fTxt').value='a';$('[data-fok]').click();assert.match($('#fMsg').textContent,/quelques mots/);
 $('#fTxt').value='Ma réponse';$('[data-fok]').click();assert.equal(pg(),'p3,p4','le livre tourne vers l’hypothèse');assert.match($('[data-pg="p3"] .cite').textContent,/Ma réponse/);
 $('[data-ecrire="hyp"]').click();$('#fTxt').value='Mon hypothèse car';$('[data-fok]').click();
 assert.ok($('[data-pg="p3"] .ecrit'),'hypothèse écrite dans la page');assert.match($('[data-pg="p3"] .ecrit:last-of-type').className,/ecrit/);
 $('[data-labo]').click();assert.match($('#volet iframe').getAttribute('src'),/lecon\/\?l=dilatation-gaz&embed=sim/);$('[data-lfin]').click();assert.equal(pg(),'p5,p6');
 for(const k of ['obs','comp','bilan']){$(`[data-ecrire="${k}"]`).click();$('#fTxt').value='Texte '+k;$('[data-fok]').click();}
 assert.equal(pg(),'p7,p8');assert.ok($('.lang').classList.contains('up'),'le bilan scientifique se découvre');assert.match($('.bs').innerHTML,/<b>1<\/b>/);
 assert.ok($('[data-defi]').disabled);$('[data-cmp="1"]').click();$('[data-defi]').click();assert.equal(pg(),'p9a,p9b');
 for(let i=0;i<5;i++){assert.match($('[data-pg="p9b"]').textContent,new RegExp('Manche '+(i+1)+' sur 5'));$('[data-dq] [data-i="'+(i===4?0:1)+'"]').click();assert.match($('[data-dx]').textContent,/Parce que/);$('[data-dsv]').click();}
 assert.match($('[data-pg="p9b"]').textContent,/Défi terminé[\s\S]*4 manches réussies sur 5/);assert.match($('[data-pg="p9b"]').textContent,/★★★/);
 /* même travail en cahier */
 d.querySelector('#bar [data-vue="cahier"]').click();assert.ok($('#fit').hidden&&!$('#cahierVue').hidden);assert.equal(d.querySelectorAll('#cahierVue .flux').length,9);assert.match($('#cahierVue').textContent,/Texte bilan/);
 assert.equal(w.localStorage.getItem('pc-livre-vue'),'cahier');
 /* reprise et données abîmées ; téléphone en cahier */
 const st=w.localStorage.getItem('pc-livre-dilatation-gaz');w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':st,'pc-livre-vue':'livre'});d=w.document;await attend();
 assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'p9a,p9b','reprise à la dernière page');
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{'pc-livre-dilatation-gaz':'{cassé'});d=w.document;await attend();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'p1,p2');
 w=ouvre('http://localhost/livre/?l=dilatation-gaz',{},390);d=w.document;await attend();assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1);
 d.querySelector('[data-commence]').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'p2','téléphone : une page à la fois');
 w=ouvre('http://localhost/livre/?l=inconnue');assert.equal(w.document.querySelectorAll('.toc a').length,13,'leçon inconnue : sommaire');
 console.log('Livre de 5e : 13 leçons complètes, sommaire, neuf moments en livre et en cahier, feuille volante, laboratoire, défi et reprise contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
