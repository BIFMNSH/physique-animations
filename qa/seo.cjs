/* Garde-fous SEO et sécurité : en-têtes, 404, longueurs, cohérence canonical / og:url. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const v=JSON.parse(read('vercel.json')),H=v.headers[0].headers.reduce((o,h)=>(o[h.key]=h.value,o),{});
assert.ok(/frame-ancestors 'self'/.test(H['Content-Security-Policy'])&&H['X-Frame-Options']==='SAMEORIGIN','anti-clickjacking');
assert.ok(/noindex/.test(read('404.html'))&&/<h1/.test(read('404.html')),'page 404 sur mesure');
const meta=(t,n)=>(new RegExp('<meta name="'+n+'" content="([^"]*)"').exec(t)||[])[1]||'';
const title=t=>(/<title>([^<]*)<\/title>/.exec(t)||[])[1]||'';
const home=read('index.html');assert.ok(title(home).length<=60&&meta(home,'description').length<=160,'accueil : titre et description courts');
for(const lv of['3e','4e','5e','6e']){const t=read(lv+'/index.html');assert.ok(meta(t,'description').length<=160,lv+' : description');const m=/<p class="sp-lead">([^<]*)<\/p>/.exec(t);assert.ok(m&&m[1].split(/\s+/).length>=45,lv+' : texte visible sans JavaScript');}
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!['node_modules','qa','docs','server','.git','assets'].includes(e.name)?walk(path.join(d,e.name)):/\.html$/.test(e.name)?[path.join(d,e.name)]:[]);
for(const f of walk('.')){const t=read(f),c=/<link rel="canonical" href="([^"]*)"/.exec(t),o=/<meta property="og:url" content="([^"]*)"/.exec(t);if(c&&o)assert.equal(o[1],c[1],f+' : og:url = canonical');if(/noindex/.test(t)&&c&&f!=='activites/index.html'&&f!=='lecon/index.html')continue;}
assert.ok(!/rel="canonical"/.test(read('lecon/index.html')),'page noindex sans canonical');
console.log('SEO : en-têtes anti-clickjacking, 404, longueurs, og:url et canonical contrôlés.');
