/* Comportement des catalogues 6e et Collections, sans réseau. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
function page(file,progress={}){
  const dom=new JSDOM(read(file),{url:'http://localhost/'+file,runScripts:'outside-only'}),w=dom.window;
  w.requestAnimationFrame=()=>0;
  w.localStorage.setItem('pc-studio-prog',JSON.stringify(progress));
  for(const script of w.document.querySelectorAll('script')){
    const src=script.getAttribute('src');
    if(src&&!src.startsWith('../assets/'))continue;
    w.eval(src?read(path.resolve(root,path.dirname(file),src)):script.textContent);
  }
  return w;
}
/* Pages de classe simplifiées : reprise, leçons par thème, classe mémorisée, thème. */
const w=page('6e/index.html',{'6e-circuit-electrique':{resume:true,sim:true},'6e-les-gaz':{resume:true,sim:true,defi:true,quiz:true},last:'6e-circuit-electrique'});
const d=w.document;
assert.equal(d.querySelectorAll('.sp-theme').length,4,'quatre thèmes en 6e');
assert.equal(d.querySelectorAll('#lecons a.sp-les').length,13,'treize leçons en 6e');
for(const a of d.querySelectorAll('#lecons a.sp-les'))assert.ok(a.getAttribute('href').startsWith('../parcours-ci/?l='));
const rep=d.querySelector('#reprise a.sp-resume');
assert.ok(rep&&rep.textContent.includes('Le circuit électrique')&&rep.textContent.includes('Continuer'),'reprise de la dernière leçon');
assert.equal(rep.getAttribute('href'),'../parcours-ci/?l=circuit-electrique');
assert.equal(rep.querySelectorAll('.sp-bar i.on').length,2,'deux étapes sur quatre');
assert.equal(d.querySelectorAll('.sp-les.done').length,1,'une leçon terminée');
assert.equal(d.querySelector('.sp-les[aria-current="step"]').getAttribute('href'),'../parcours-ci/?l=circuit-electrique');
assert.equal(w.localStorage.getItem('pc-classe'),'6e','classe mémorisée');
assert.ok(!/NL-C|ELE-|Studio/.test(d.body.textContent),'aucun code interne ni jargon');
w.localStorage.setItem('pc-studio-prog',JSON.stringify({'6e-circuit-electrique':{resume:true,sim:true,defi:true,quiz:true},last:'6e-circuit-electrique'}));
w.dispatchEvent(new w.PageTransitionEvent('pageshow',{persisted:true}));
assert.ok(!d.querySelector('#reprise').textContent.includes('Le circuit électrique'),'leçon terminée : on passe à la suivante');
d.querySelector('[data-sp-theme]').click();assert.equal(d.documentElement.dataset.theme,'light');
assert.equal(w.localStorage.getItem('pc-theme'),'light');
w.close();
for(const level of ['5e','4e','3e']){
  const other=page(level+'/index.html'),links=other.document.querySelectorAll('#lecons a.sp-les');
  assert.ok(links.length>0);
  for(const a of links)assert.ok(a.getAttribute('href').startsWith('../lecon/?l='),'navigation Studio conservée '+level);
  assert.ok(other.document.querySelector('#reprise .sp-btn').textContent.includes('Commencer'),'première visite : commencer '+level);
  other.close();
}
/* Accueil : une seule question, classe mémorisée proposée. */
function home(store){
  const hw=new JSDOM(read('index.html'),{url:'http://localhost/index.html',runScripts:'outside-only'}).window;
  for(const[k,v]of Object.entries(store))hw.localStorage.setItem(k,v);
  for(const s of hw.document.querySelectorAll('script')){const src=s.getAttribute('src');if(src&&src.startsWith('/'))continue;if(s.type==='application/ld+json')continue;hw.eval(src?read(src):s.textContent);}
  return hw;
}
const h=home({}),hd=h.document;
assert.equal(hd.querySelectorAll('.sp-class').length,4);
assert.ok(hd.getElementById('continuer').hidden,'pas de reprise à la première visite');
hd.querySelector('.sp-class[data-c="4e"]').dispatchEvent(new h.MouseEvent('click',{cancelable:true}));
assert.equal(h.localStorage.getItem('pc-classe'),'4e','choix de classe mémorisé');
h.close();
const h2=home({'pc-classe':'5e'});
const go=h2.document.getElementById('continuer');
assert.ok(!go.hidden&&go.getAttribute('href')==='5e/'&&go.textContent.includes('5e'),'reprise de la classe mémorisée');
assert.ok(h2.document.querySelector('.sp-class[data-c="5e"]').classList.contains('mine'));
h2.close();
assert.ok(fs.existsSync(path.join(root,'decouvrir/index.html')),'ancienne page d’accueil conservée pour profs et parents');
const c=page('collections/index.html'),cd=c.document;
assert.ok(cd.getElementById('ciTotal').textContent.includes('73'));
assert.ok(cd.getElementById('frTotal').textContent.includes('48'));
assert.equal(cd.querySelectorAll('.catalogue-group').length,4);
assert.equal(cd.querySelectorAll('.collection-lesson').length,13);
assert.equal(cd.querySelectorAll('.collection-activities>li').length,73);
assert.equal(cd.querySelectorAll('.collection-activities a').length,17,'seize prototypes et un pilote manipulables');
assert.ok(!/NL-CI|NL-C4|ELE-\d{2}/.test(cd.body.textContent),'aucun code interne affiché dans Collections');
c.localStorage.setItem('pc-act-NL-CI-6E-ELE-01',JSON.stringify({v:1,prevision:{choix:'signes'},essais:[]}));
c.dispatchEvent(new c.PageTransitionEvent('pageshow',{persisted:true}));
assert.ok(cd.body.textContent.includes('Mon parcours : hypothèse enregistrée'),'progression personnelle distincte et actualisée');
function filter(id,value){const input=cd.getElementById(id);input.value=value;input.dispatchEvent(new c.Event(id==='find'?'input':'change',{bubbles:true}));}
filter('status','prototype');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,16);
assert.ok([...cd.querySelectorAll('details')].every(x=>x.open),'les résultats filtrés sont directement visibles');
filter('find','lampe');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,3);
filter('find','introuvablexyz');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,0);
assert.ok(cd.getElementById('foldCollections').disabled);
filter('find','');filter('status','');filter('theme','Air et combustions');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,20);
assert.equal(cd.querySelector('.catalogue-group').style.getPropertyValue('--tc'),'var(--violet)','couleur du thème, pas position du catalogue');
filter('theme','Grandeurs et mesures physiques');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,10);
assert.equal(cd.querySelector('.catalogue-group').style.getPropertyValue('--tc'),'var(--green)');
filter('theme','');filter('status','conception');
assert.equal(cd.querySelectorAll('.collection-activities a').length,0,'aucun lien vers une activité en conception');
cd.getElementById('foldCollections').click();
assert.ok([...cd.querySelectorAll('details')].every(x=>!x.open));
cd.getElementById('foldCollections').click();
assert.ok([...cd.querySelectorAll('details')].every(x=>x.open));
cd.getElementById('themeButton').click();assert.equal(cd.documentElement.dataset.theme,'light');
c.close();
console.log('Catalogues : regroupement, progression, filtres combinés, liens, clavier natif et thèmes contrôlés.');
