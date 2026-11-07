/* Cartable (essai) : livre + cahier, neuf moments, mesures du livre vers le cahier, tiroir, reprise. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('lecon-essai/cartable/index.html'),at=read('assets/shared/atelier-electrique.js'),js=read('assets/simple/cartable.js'),css=read('assets/simple/cartable.css');
function ouvre(store,largeur){const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url:'http://localhost/lecon-essai/cartable/',runScripts:'outside-only'}).window;
 if(store)w.localStorage.setItem('pc-cartable-tension',store);if(largeur)Object.defineProperty(w,'innerWidth',{value:largeur,configurable:true});
 w.matchMedia=()=>({matches:true});w.eval(at);w.eval(js);return w;}
let w=ouvre(),d=w.document;const $=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)],T=w.NohobaCartable;
assert.equal(T.tension('L1',true)+T.tension('L2',true),T.tension('G',true),'U = U1 + U2');assert.equal(T.tension('K',false),4.5);assert.equal(T.tension('L2',false),0);
assert.ok(/noindex/.test(html)&&/Prototype/.test(html)&&!read('sitemap.xml').includes('lecon-essai'),'prototype hors référencement');
assert.ok(!/[؀-ۿ]/.test(html+js),'français uniquement');assert.ok(/@media print/.test(css)&&/prefers-reduced-motion|matchMedia/.test(js),'impression et mouvement réduit');
const pages=()=>$$('#book .page').map(p=>p.dataset.pg).join(','),act=()=>$('.en.actif h2').textContent;
/* tablette (1024 px) : livre double, cahier en tiroir */
assert.equal(pages(),'s1l,s1r');assert.ok(!d.body.classList.contains('desk'));assert.ok($('#next').disabled,'chapitre 2 fermé tant que le cahier n’avance pas');
assert.ok($('[data-m0] svg')&&$('[data-s0] svg'),'montage et schéma dès la situation');
$('[data-k0]').click();assert.match($('[data-m0] svg').getAttribute('aria-label'),/fermé/);
$('[data-ouvre]').click();assert.ok($('#cahier').classList.contains('open'));assert.match(act(),/Situation/);
$('#c1').click();const g=k=>$$('.g2')[k];g(0).querySelector('[data-i="2"]').click();assert.match(g(0).querySelector('.ex').textContent,/Pas encore/);
g(0).querySelector('[data-i="0"]').click();g(1).querySelector('[data-i="0"]').click();g(2).querySelector('[data-i="1"]').click();$('#c2').click();
$('[data-ch="hyp"] [data-i="0"]').click();$('#c3').click();
/* moment 4 : le livre tourne seul vers le laboratoire, le tiroir se ferme */
assert.equal(pages(),'s2l,s2r');assert.ok(!$('#cahier').classList.contains('open'));assert.ok($('[data-lmont] svg')&&$('[data-lsch] svg'));assert.ok(!$('#bProf').hidden);
const dip=x=>$(`#book [data-d="${x}"]`).click();
dip('L1');assert.equal($('#book [data-lv]').textContent,'1,5 V');assert.match($('#cb tr[data-k="L1"]').textContent,/1,5 V/,'la mesure s’écrit dans le cahier');
$('#book [data-ksw]').click();assert.equal($('#book [data-lv]').textContent,'0 V');assert.match($('#cb tr[data-k="L1"]').textContent,/1,5 V/,'0 V non retenu');
dip('K');assert.match($('#cb tr[data-k="Kouv"]').textContent,/4,5 V/);$('#book [data-ksw]').click();
assert.ok($('#c4').disabled);dip('L2');dip('G');assert.ok(!$('#c4').disabled);assert.ok(!$('#book [data-fait]').hidden,'bouton vers le cahier');
$('#bProf').click();assert.ok($('#prof').classList.contains('on'));$('#prof [data-d="L2"]').click();assert.equal($('#prof [data-lv]').textContent,'3 V');
d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.ok(!$('#prof').classList.contains('on'),'Échap');
$('#book [data-fait]').click();$('#c4').click();
/* 5, 6 */
$('#som').value='4,5';$('#f5').dispatchEvent(new w.Event('submit',{cancelable:true}));$('[data-ch="egal"] [data-i="1"]').click();$('#c5').click();
$('[data-ch="jug"] [data-i="1"]').click();assert.match($('#v6').textContent,/à corriger[\s\S]*4,5 V[\s\S]*juste/);$('#c6').click();
/* 7 : le livre passe à « Ce que disent tes mesures », le bilan scientifique reste couvert */
assert.equal(pages(),'s3l,s3r');assert.match($('[data-pg="s3l"] .barres').innerHTML,/1,5 V[\s\S]*3 V/);assert.ok(!$('.lang').classList.contains('up'),'bilan scientifique caché');
$('[data-pg="s3l"] [data-ouvre]').click();assert.ok($('#c7').disabled);$('#ajmes').click();$('#bilan').value+=' En série, U = U1 + U2.';$('#bilan').dispatchEvent(new w.Event('input'));$('#c7').click();
/* 8 : la languette se soulève */
assert.ok($('.lang').classList.contains('up'),'bilan scientifique découvert');$$('.chk input')[1].click();$('#c8').click();
/* 9 : défi dans le livre, score dans le cahier */
assert.equal(pages(),'s4l,s4r');
const rep=[()=>{$('[data-dv]').value='5,5';$('[data-dn]').dispatchEvent(new w.Event('submit',{cancelable:true}));},()=>$('[data-dq] [data-i="1"]').click(),()=>$('[data-dq] [data-i="1"]').click(),()=>$('[data-dq] [data-i="0"]').click(),()=>$('[data-dq] [data-i="1"]').click(),()=>{$('[data-dv]').value='0,25';$('[data-dn]').dispatchEvent(new w.Event('submit',{cancelable:true}));}];
for(let i=0;i<6;i++){assert.match($('[data-pg="s4r"]').textContent,new RegExp('Manche '+(i+1)+' sur 6'));rep[i]();assert.ok($('[data-dx]').textContent.length>10);$('[data-dsv]').click();assert.match($('#cb').textContent,new RegExp('Manches jouées : '+(i+1)+'|Mon cahier est terminé'));}
assert.ok($('#fin'));assert.match($('#fin').textContent,/★★★/);assert.match($('[data-pg="s4r"]').textContent,/Défi terminé/);assert.equal($$('.en').length,9);
assert.match($('#m7').textContent,/U = U1 \+ U2/);
/* reprise, navigation, données abîmées */
const st=w.localStorage.getItem('pc-cartable-tension');w=ouvre(st);d=w.document;
assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'s4l,s4r');assert.ok(d.querySelector('#fin'));
d.querySelector('#dots [data-c="1"]').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'s2l,s2r');
w=ouvre('{cassé');assert.equal(w.document.querySelectorAll('.en').length,1);
/* téléphone : une page à la fois, laboratoire regroupé */
w=ouvre(JSON.stringify({...JSON.parse(st),m:3,hyp:0,fini:false,rep:[],pos:0,mes:{}}),390);d=w.document;
assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1);d.querySelector('#c3').click();assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'lab','au moment 4, le téléphone ouvre le laboratoire');
assert.ok(d.querySelector('[data-pg="lab"] [data-lmont] svg')&&d.querySelector('[data-pg="lab"] [data-lsch] svg')&&d.querySelector('[data-pg="lab"] [data-d="L1"]'));
console.log('Cartable : livre et cahier liés, neuf moments, mesures transférées, tiroir, défi, reprise et téléphone contrôlés.');
