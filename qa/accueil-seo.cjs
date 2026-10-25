const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),config=JSON.parse(read('vercel.json'));
const dom=new JSDOM(html,{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
try{
  for(const rule of config.headers){
    assert.equal(typeof rule.source,'string');
    for(const header of rule.headers){
      assert.deepEqual(Object.keys(header).sort(),['key','value'],'structure des en-têtes Vercel');
      assert.equal(typeof header.value,'string');
    }
  }
  const headers=source=>Object.fromEntries(config.headers.find(r=>r.source===source).headers.map(h=>[h.key,h.value]));
  const global=headers('/(.*)'),home=headers('/');
  assert.match(home['Content-Security-Policy'],/script-src 'self';/);
  assert.ok(!/script-src[^;]*unsafe-inline/.test(home['Content-Security-Policy']));
  assert.match(global['Content-Security-Policy'],/frame-ancestors 'self';/);
  assert.equal(global['X-Frame-Options'],'SAMEORIGIN');
  assert.match(headers('/assets/(.*)')['Cache-Control'],/max-age=0, must-revalidate/);
  assert.match(headers('/assets/fonts/:font.woff2')['Cache-Control'],/max-age=31536000, immutable/);
  assert.match(headers('/assets/brand/:image')['Cache-Control'],/max-age=3600/);
  assert.ok(config.headers.findIndex(r=>r.source==='/assets/fonts/:font.woff2')>config.headers.findIndex(r=>r.source==='/assets/(.*)'));
  assert.equal(headers('/sw.js')['Cache-Control'],'no-cache');
  for(const script of d.scripts){
    if(script.type==='application/ld+json'){JSON.parse(script.textContent);continue;}
    assert.ok(script.src,'aucun script exécutable inline sur l’accueil');
    if(script.getAttribute('src').startsWith('assets/'))assert.ok(fs.existsSync(path.join(root,script.getAttribute('src'))));
  }
  for(const el of d.querySelectorAll('*'))for(const a of el.attributes){
    assert.ok(!/^on/i.test(a.name),'aucun gestionnaire HTML inline');
    if(['href','src'].includes(a.name))assert.ok(!/^javascript:/i.test(a.value));
  }
  const description=d.querySelector('meta[name="description"]').content;
  assert.ok(description.length>=100&&description.length<=155,'description entre 100 et 155 caractères');
  assert.ok(d.title.length<=60,'titre concis');
  for(const attr of ['property="og:description"','name="twitter:description"'])assert.equal(d.querySelector('meta['+attr+']').content,description);
  const graph=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  for(const schema of graph)assert.ok(d.body.textContent.includes(schema.name),'nom JSON-LD présent dans le contenu');
  assert.ok(!JSON.stringify(graph).includes('PT53M'),'pas de durée de cours inventée');
  let level=0;
  for(const heading of d.querySelectorAll('h1,h2,h3,h4,h5,h6')){
    assert.ok(heading.textContent.trim(),'titres non vides, même avant exécution');
    const next=Number(heading.tagName.slice(1));assert.ok(next<=level+1,'hiérarchie des titres');level=next;
  }
  const skip=d.querySelector('.skip-link');
  assert.equal(d.querySelector(skip.getAttribute('href')).tagName,'MAIN');
  for(const file of ['accueil.css','accueil-theme.js','accueil.js'])assert.ok(read('sw.js').includes("'./assets/"+file+"'"),'accueil disponible hors ligne');

  w.matchMedia=query=>({matches:query.includes('reduced-motion')});
  const noop=()=>{},gradient={addColorStop:noop};
  w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||noop});
  w.eval(read('assets/accueil-theme.js'));w.eval(read('assets/accueil.js'));
  assert.equal(d.documentElement.dataset.theme,'dark');
  d.getElementById('tsw').click();
  assert.equal(d.documentElement.dataset.theme,'light');
  assert.equal(w.localStorage.getItem('pc-theme'),'light');
  assert.equal(d.getElementById('tsw').getAttribute('aria-checked'),'false');
  const ph=d.getElementById('ph');ph.value='3';ph.dispatchEvent(new w.Event('input'));
  assert.equal(ph.getAttribute('aria-valuetext'),'pH 3, solution acide');
  for(let i=1;i<=5;i++){
    d.querySelector('.tabs button[data-i="'+i+'"]').click();
    assert.equal(d.getElementById('reel').hidden,false);
    assert.ok(d.getElementById('rtit').textContent.trim());
    assert.equal(d.querySelectorAll('.tabs button[aria-pressed="true"]').length,1);
  }
  d.querySelector('.tabs button[data-i="0"]').click();assert.equal(d.getElementById('reel').hidden,true);
  d.querySelector('.cls button[data-c="6e"]').click();
  assert.equal(w.localStorage.getItem('nl-classe'),'6e');
  assert.ok(d.querySelector('#next a').href.includes('circuit-electrique'));
  const q=d.getElementById('q');q.value='circuit';q.dispatchEvent(new w.Event('input'));
  assert.ok(d.querySelector('#res a'),'recherche fonctionnelle après extraction');
  d.getElementById('proj').click();assert.ok(d.body.classList.contains('proj'));
  console.log('Accueil : SEO, titres, CSP, cache, scripts externes, pH, vitrine, thèmes et recherche vérifiés.');
}finally{w.close();}
