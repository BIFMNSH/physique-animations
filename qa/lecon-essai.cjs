/* Leçon d'essai en quatre étapes : modèle, parcours complet, reprise, garde-fous. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('lecon-essai/index.html'),at=read('assets/shared/atelier-electrique.js'),sim=read('assets/simple/simple.js'),js=read('assets/simple/lecon-essai.js');
function ouvre(store){const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url:'http://localhost/lecon-essai/',runScripts:'outside-only'}).window;
 if(store)w.localStorage.setItem('pc-essai-intensite',store);w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.scrollTo=()=>{};w.eval(sim);w.eval(at);w.eval(js);return w;}
let w=ouvre(),d=w.document;const $=i=>d.getElementById(i),I=w.NohobaEssaiIntensite.intensite;
assert.equal(I(1,true),300);assert.equal(I(2,true),150);assert.equal(I(1,false),0);
assert.equal(d.querySelector('[aria-current="step"]').textContent,'Essaie','la leçon commence par Essaie');
assert.ok($('le-montage').querySelector('svg')&&$('le-schema').querySelector('svg'),'montage et schéma côte à côte');
assert.ok($('le-go').hidden,'pas de suite avant les mesures');
$('le-inter').click();$('le-pt-A').click();assert.equal($('le-val').textContent,'0 mA','circuit ouvert');assert.ok(!/300/.test($('le-pt-A').textContent),'mesure à vide non retenue');
$('le-inter').click();assert.equal($('le-val').textContent,'300 mA');
$('le-pt-B').click();$('le-pt-C').click();assert.ok(!$('le-go').hidden);$('le-go').click();
assert.equal(d.querySelector('[aria-current="step"]').textContent,'Regarde');assert.match($('le-app').textContent,/IA = IB = IC = 300 mA/);$('le-go').click();
assert.equal(d.querySelector('[aria-current="step"]').textContent,'Enquête');assert.equal(d.querySelectorAll('#le-ch button').length,3);
d.querySelector('#le-ch [data-i="0"]').click();
['A','B','C'].forEach(p=>{$('le-pt-'+p).click();assert.equal($('le-val').textContent,'150 mA');});
$('le-go').click();assert.match($('le-bilan').textContent,/idée très répandue/);assert.match($('le-bilan').textContent,/= 150 mA/);$('le-vers').click();
for(let i=0;i<7;i++){assert.match($('le-app').textContent,new RegExp('Question '+(i+1)+' sur 7'));d.querySelector('#le-ch [data-i="0"]').click();assert.ok($('le-exp').textContent.length>10,'explication');$('le-sv').click();}
assert.match($('le-app').textContent,/\d sur 7/);const st=JSON.parse(w.localStorage.getItem('pc-essai-intensite'));assert.ok(st.fini);
/* reprise, données abîmées, mode enseignant */
w=ouvre(JSON.stringify(st));assert.match(w.document.getElementById('le-app').textContent,/Leçon terminée/);
w=ouvre('{cassé');d=w.document;assert.equal(d.querySelector('[aria-current="step"]').textContent,'Essaie');
d.getElementById('le-prof').click();assert.ok(d.body.classList.contains('prof'));d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.ok(!d.body.classList.contains('prof'),'Échap');
assert.ok(/noindex/.test(html)&&!read('sitemap.xml').includes('lecon-essai'),'page d’essai hors référencement');
assert.ok(/Prototype/.test(html),'statut affiché');
console.log('Leçon d’essai : modèle, parcours, reprise et mode enseignant contrôlés.');
