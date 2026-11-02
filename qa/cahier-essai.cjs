/* Cahier de labo (essai) : modèle, neuf moments, reprise, mode enseignant, impression. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('lecon-essai/cahier/index.html'),sim=read('assets/simple/simple.js'),at=read('assets/shared/atelier-electrique.js'),js=read('assets/simple/cahier-essai.js'),css=read('assets/simple/cahier-essai.css');
function ouvre(store){const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url:'http://localhost/lecon-essai/cahier/',runScripts:'outside-only'}).window;
 if(store)w.localStorage.setItem('pc-cahier-tension',store);w.scrollTo=()=>{};w.eval(sim);w.eval(at);w.eval(js);return w;}
let w=ouvre(),d=w.document;const $=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)],T=w.NohobaCahierTension;
/* modèle : tensions calculées, loi des tensions */
assert.equal(T.tension('G',true),4.5);assert.equal(T.tension('L1',true),1.5);assert.equal(T.tension('L2',true),3);
assert.equal(T.tension('L1',true)+T.tension('L2',true),T.tension('G',true),'U = U1 + U2');
assert.equal(T.tension('K',true),0);assert.equal(T.tension('K',false),4.5);assert.equal(T.tension('L1',false),0);assert.equal(T.fv(4.5),'4,5 V');
assert.ok(/noindex/.test(html)&&/Prototype/.test(html)&&/lang="fr"/.test(html),'prototype hors référencement');
assert.ok(!read('sitemap.xml').includes('lecon-essai'),'hors sitemap');
assert.ok(!/[؀-ۿ]/.test(html+js),'interface en français uniquement');
assert.ok(/@media print/.test(css),'feuille d’impression');
const act=()=>$('.en.actif'),h2=()=>act().querySelector('h2').textContent;
/* 1 */
assert.equal($$('.en').length,1);assert.match(h2(),/Situation-problème/);assert.ok($('#cb-bar').children.length===9);
assert.ok($('#cb svg'),'schéma dès la situation');$('#c1').click();
/* 2 : erreurs sans pénalité, puis bonnes réponses */
assert.match(h2(),/J’analyse et je réponds/);assert.ok($('#c2').disabled);
const g=k=>$$('.g2')[k];g(0).querySelector('[data-i="1"]').click();assert.match(g(0).querySelector('.ex').textContent,/Pas encore/);
g(0).querySelector('[data-i="0"]').click();g(1).querySelector('[data-i="0"]').click();assert.ok($('#c2').disabled,'trois réponses requises');g(2).querySelector('[data-i="1"]').click();assert.ok(!$('#c2').disabled);$('#c2').click();
/* 3 */
assert.ok($('#c3').disabled);$('[data-ch="hyp"] [data-i="1"]').click();assert.ok(!$('#c3').disabled);$('#car').value='les deux lampes se partagent';$('#car').dispatchEvent(new w.Event('input'));$('#c3').click();
/* 4 : laboratoire */
assert.match(h2(),/manipulation/);assert.equal($('#lb-val').textContent,'— V');assert.ok($('#c4').disabled);assert.ok($('#lb-m svg')&&$('#lb-s svg'),'montage et schéma côte à côte');
const dip=x=>$(`.dips [data-d="${x}"]`).click();
dip('L1');assert.equal($('#lb-val').textContent,'1,5 V');assert.match($('#lb-s').innerHTML,/dérivation/);
$('#lb-k').click();assert.equal($('#lb-val').textContent,'0 V');assert.match($('#lb-msg').textContent,/non retenue/);assert.ok(/1,5 V/.test($('#lb-t').textContent),'mesure fermée conservée');
dip('K');assert.equal($('#lb-val').textContent,'4,5 V');assert.match($('#lb-t').textContent,/Interrupteur K ouvert[\s\S]*4,5 V/);
$('#lb-k').click();dip('K');assert.equal($('#lb-val').textContent,'0 V');assert.ok($('#c4').disabled,'il manque encore la pile et L2');
dip('L2');assert.equal($('#lb-val').textContent,'3 V');assert.ok($('#c4').disabled);dip('G');assert.equal($('#lb-val').textContent,'4,5 V');assert.ok(!$('#c4').disabled);
/* mode enseignant */
assert.ok(!$('#cb-prof').hidden);$('#cb-prof').click();assert.ok(d.body.classList.contains('prof'));d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.ok(!d.body.classList.contains('prof'),'Échap quitte le mode enseignant');
$('#c4').click();
/* 5 */
assert.match(h2(),/J’observe/);assert.ok($('#c5').disabled);$('#som').value='4';$('#f5').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match($('#x5a').textContent,/Pas encore/);
$('#som').value='4,5';$('#f5').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match($('#x5a').textContent,/Exact/);assert.ok($('#c5').disabled);
$('[data-ch="egal"] [data-i="0"]').click();assert.match($('#x5b').textContent,/Compare/);$('[data-ch="egal"] [data-i="1"]').click();assert.ok(!$('#c5').disabled);$('#c5').click();
/* 6 : hypothèse « moitié » à corriger */
assert.match(h2(),/confronte/);$('[data-ch="jug"] [data-i="1"]').click();assert.match($('#v6').textContent,/à corriger[\s\S]*moitié[\s\S]*Ton jugement est juste/);$('#c6').click();
/* 7 */
assert.ok($('#c7').disabled);$('#ajmes').click();assert.match($('#bilan').value,/U\(L1\) = 1,5 V ; U\(L2\) = 3 V/);assert.ok(!$('#c7').disabled);$('#bilan').value+=' En série, U = U1 + U2.';$('#bilan').dispatchEvent(new w.Event('input'));$('#c7').click();
/* 8 */
assert.match($('.mo-crit.sci').textContent,/U = U1 \+ U2/);$$('.chk input')[0].click();$$('.chk input')[1].click();assert.match($('#m8msg').textContent,/2 critère/);$('#c8').click();
/* 9 : défi, avec une erreur */
const rep=[()=>{$('#dv').value='5,5';$('#dn').dispatchEvent(new w.Event('submit',{cancelable:true}));},()=>$('[data-ch="dq"] [data-i="1"]').click(),()=>$('[data-ch="dq"] [data-i="1"]').click(),()=>$('[data-ch="dq"] [data-i="1"]').click(),()=>$('[data-ch="dq"] [data-i="0"]').click(),()=>{$('#dv').value='0,25';$('#dn').dispatchEvent(new w.Event('submit',{cancelable:true}));}];
for(let i=0;i<6;i++){assert.match(act().textContent,new RegExp('Manche '+(i+1)+' sur 6'));rep[i]();assert.ok($('#dx').textContent.length>10,'explication après chaque manche');if(i===4)assert.match($('#dx').textContent,/Pas encore/);$('#dsv').click();}
assert.ok($('#fin'),'cahier terminé');assert.match($('#fin').textContent,/★★★/,'5 sur 6 : trois étoiles');
/* le cahier garde tout : neuf entrées, bilan et mesures */
assert.equal($$('.en').length,9);assert.match($('#m7').textContent,/En série, U = U1 \+ U2/);assert.match($('#m4').textContent,/Lampe L2[\s\S]*3 V/);
/* reprise, données abîmées, recommencer */
const st=w.localStorage.getItem('pc-cahier-tension');w=ouvre(st);assert.ok(w.document.querySelector('#fin'),'reprise');assert.equal(w.document.querySelectorAll('.en').length,9);
w=ouvre('{cassé');assert.equal(w.document.querySelectorAll('.en').length,1);
w=ouvre(st);w.document.querySelector('#again').click();assert.equal(w.document.querySelectorAll('.en').length,1);
console.log('Cahier de labo : modèle, neuf moments, laboratoire, défi, reprise et mode enseignant contrôlés.');
