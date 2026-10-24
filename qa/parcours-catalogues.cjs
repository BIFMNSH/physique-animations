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
const w=page('6e/index.html',{'6e-circuit-electrique':{resume:true,sim:true},'6e-les-gaz':{resume:true,sim:true,defi:true,quiz:true},last:'6e-circuit-electrique'});
const d=w.document,groups=[...d.querySelectorAll('.catalogue-group')];
assert.equal(groups.length,4);
assert.equal(d.querySelectorAll('.lesson-rail a').length,13);
assert.ok(d.querySelector('#programmeProgress').textContent.includes('6 / 52'));
assert.equal(groups.filter(x=>x.open).length,1);
assert.equal(d.querySelector('.rail-node.partial').style.getPropertyValue('--p'),'50%');
assert.equal(d.querySelectorAll('.rail-node.complete').length,1);
for(const a of d.querySelectorAll('.lesson-rail a'))assert.ok(a.getAttribute('href').startsWith('../parcours-ci/?l='));
d.getElementById('foldThemes').click();assert.ok(groups.every(g=>g.open));
d.getElementById('foldThemes').click();assert.ok(groups.every(g=>!g.open));
w.localStorage.setItem('pc-studio-prog',JSON.stringify({'6e-circuit-electrique':{resume:true,sim:true,defi:true,quiz:true}}));
w.dispatchEvent(new w.PageTransitionEvent('pageshow',{persisted:true}));
assert.ok(d.querySelector('#programmeProgress').textContent.includes('4 / 52'),'progression actualisée au retour');
d.getElementById('theme').click();assert.equal(d.documentElement.dataset.theme,'light');
w.close();
for(const level of ['5e','4e','3e']){
  const other=page(level+'/index.html'),links=other.document.querySelectorAll('.les[href]');
  assert.ok(links.length>0);
  for(const a of links)assert.ok(a.getAttribute('href').startsWith('../lecon/?l='),'navigation Studio conservée '+level);
  other.close();
}
const c=page('collections/index.html'),cd=c.document;
assert.ok(cd.getElementById('ciTotal').textContent.includes('73'));
assert.ok(cd.getElementById('frTotal').textContent.includes('48'));
assert.equal(cd.querySelectorAll('.catalogue-group').length,4);
assert.equal(cd.querySelectorAll('.collection-lesson').length,13);
assert.equal(cd.querySelectorAll('.collection-activities>li').length,73);
assert.equal(cd.querySelectorAll('.collection-activities a').length,7,'six prototypes et un pilote manipulables');
assert.ok(!/NL-CI|NL-C4|ELE-\d{2}/.test(cd.body.textContent),'aucun code interne affiché dans Collections');
c.localStorage.setItem('pc-act-NL-CI-6E-ELE-01',JSON.stringify({v:1,prevision:{choix:'signes'},essais:[]}));
c.dispatchEvent(new c.PageTransitionEvent('pageshow',{persisted:true}));
assert.ok(cd.body.textContent.includes('Mon parcours : hypothèse enregistrée'),'progression personnelle distincte et actualisée');
function filter(id,value){const input=cd.getElementById(id);input.value=value;input.dispatchEvent(new c.Event(id==='find'?'input':'change',{bubbles:true}));}
filter('status','prototype');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,6);
assert.ok([...cd.querySelectorAll('details')].every(x=>x.open),'les résultats filtrés sont directement visibles');
filter('find','lampe');
assert.equal(cd.querySelectorAll('.collection-activities>li').length,2);
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
