/* Cartable, parcours allégé (6e, 4e, 3e) : sommaire par classe, cinq étapes sans verrou, modèle vivant, À retenir, défi, reprise ; la 5e reste inchangée. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('livre/index.html'),prog=read('assets/studio/programme.js'),at=read('assets/shared/atelier-electrique.js'),js=read('assets/livre/livre.js');
const FAKE={title:'Leçon d’essai',theme:'Électricité',inquiry:{situation:'Pourquoi la lampe brille-t-elle moins ?',prediction:'Prévois.',criteria:['A','B','C']},retiens:['Règle <b>1</b>','Règle 2','Règle 3'],quiz:[0,1,2,3,4].map(i=>({q:'Question '+i,o:['a','b','c'],a:1,e:'Parce que '+i}))};
function ouvre(url,store){const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url,runScripts:'outside-only'}).window;
 for(const[k,v]of Object.entries(store||{}))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
 w.matchMedia=()=>({matches:true});const ap=w.document.body.appendChild.bind(w.document.body);
 w.document.body.appendChild=x=>{if(x.tagName==='SCRIPT'){w.Studio.start(FAKE);setTimeout(()=>x.onload&&x.onload(),0);return x;}return ap(x);};
 w.eval(prog);w.eval(at);w.eval(js);return w;}
const attend=()=>new Promise(r=>setTimeout(r,30)),pos=w=>[...w.document.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(',');
(async()=>{
 /* sommaire par classe */
 const compte={'6e':13,'5e':13,'4e':13,'3e':14};
 for(const[n,k]of Object.entries(compte)){const w=ouvre('http://localhost/livre/?n='+n),d=w.document;assert.equal(d.querySelectorAll('.toc a').length,k,n+' : '+k+' leçons');
  assert.equal(d.querySelectorAll('.niv a').length,4);assert.equal(d.querySelector('.niv a[aria-current="page"]').textContent,n);assert.ok(d.body.textContent.includes('Physique-chimie '+n),n+' : en-tête');}
 let w=ouvre('http://localhost/livre/'),d=w.document;assert.equal(d.querySelectorAll('.toc a').length,13,'5e par défaut');
 assert.deepEqual(w.NohobaLivre.lecons().length,13);assert.equal(w.NohobaLivre.toutes().length,53);
 w=ouvre('http://localhost/livre/?n=6e',{'pc-livre-circuit-electrique':{m:9,start:1,q:[]}});assert.match(w.document.querySelector('.toc a[href="?l=circuit-electrique"]').textContent,/Commencée|Terminée/);
 /* parcours allégé sur une leçon de 6e */
 w=ouvre('http://localhost/livre/?l=circuit-electrique');d=w.document;await attend();const $=s=>d.querySelector(s);
 assert.ok(w.NohobaLivre.allege());assert.equal(d.documentElement.getAttribute('data-parcours'),'allege');assert.equal(pos(w),'s1l,s1r');
 assert.match($('[data-pg="s1l"]').textContent,/Pourquoi la lampe/);assert.equal(d.querySelectorAll('#dots button').length,4);assert.match($('#dots button').getAttribute('aria-label'),/Étapes 1 à 2/);
 assert.ok(!/Moment/.test(d.body.textContent),'on parle d’étapes');assert.ok(!/NL-C4|NL-CI/.test(d.body.textContent),'aucun code interne');
 $('[data-start]').click();assert.equal(pos(w),'s2l,s2r','le départ ouvre la manipulation');assert.ok(!$('#next').disabled,'rien n’est verrouillé après le départ');assert.ok($('[data-pg="s2l"] [data-vivant]'),'bouton du modèle vivant');assert.equal(d.querySelectorAll('.mom li').length,5);assert.equal(d.querySelectorAll('.frise i').length,10);
 $('[data-pg="s2l"] [data-vivant]').click();assert.match($('#volet iframe').getAttribute('src'),/livre-vivant\/\?l=circuit-electrique&embed=1/);
 w.localStorage.setItem('vv-circuit-electrique',JSON.stringify({q:2,ok:[true,true],pos:0}));$('[data-lfin]').click();assert.ok($('#volet').hidden);
 $('#next').click();assert.equal(pos(w),'s3l,s3r');assert.equal(d.querySelectorAll('[data-pg="s3l"] .ret li').length,3);assert.match($('[data-pg="s3l"]').textContent,/Règle 1/);assert.ok($('[data-pg="s3r"] [data-vivant]'));
 $('#next').click();assert.equal(pos(w),'s4l,s4r');
 /* reprise */
 const s=JSON.parse(w.localStorage.getItem('pc-livre-circuit-electrique'));assert.equal(s.start,1);
 w=ouvre('http://localhost/livre/?l=circuit-electrique',{'pc-livre-circuit-electrique':s});await attend();assert.equal(pos(w),'s4l,s4r','reprise à la dernière page lue');assert.ok(!w.document.querySelector('#prev').disabled);
 /* 4e et 3e aussi, et la 5e garde ses verrous */
 for(const l of ['sources-recepteurs','masse-poids']){w=ouvre('http://localhost/livre/?l='+l);await attend();assert.ok(w.NohobaLivre.allege(),l);}
 w=ouvre('http://localhost/livre/?l=dilatation-gaz');await attend();assert.ok(!w.NohobaLivre.allege());assert.ok(w.document.querySelector('#next').disabled,'5e : moments 3 à 7 fermés');
 console.log('Cartable allégé : sommaire des 4 classes, cinq étapes sans verrou, modèle vivant, À retenir, reprise ; 5e inchangée.');
})().catch(e=>{console.error(e);process.exit(1)});
