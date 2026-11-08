/* Lecteur de leçons (studio) : cartes « À retenir » sans balises visibles, question flash fermable,
   pages d'application en prototype non indexées, cache hors-ligne renouvelé. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const js=read('assets/studio/studio.js'),css=read('assets/studio/studio.css');
/* cartes : la ligne secondaire interprète <b> comme le titre */
assert.ok(/t2\.innerHTML\s*=\s*c\[1\]\.replace\(\/<b>\/g/.test(js),'la ligne secondaire des cartes doit interpréter <b>');
assert.ok(!/text:\s*c\[1\]\s*\}/.test(js),'plus de texte brut pour la ligne secondaire des cartes');
/* question flash : croix, Échap, clic à côté, retour du focus */
assert.ok(js.includes("class: 'flash-x'")&&js.includes("'aria-label': 'Fermer la question flash'"),'bouton de fermeture accessible');
assert.ok(js.includes("e.key === 'Escape'"),'la touche Échap ferme la question flash');
assert.ok(js.includes('if (e.target === f) fermer()'),'un clic à côté ferme la question flash');
assert.equal((js.slice(js.indexOf('function flash()'),js.indexOf('seek(0);\n    return { enter')).match(/f\.remove\(\)/g)||[]).length,1,'toute sortie passe par fermer()');
assert.ok(/\.flash \.flash-x\{[^}]*width:44px;height:44px/.test(css),'cible tactile de 44 px');
/* pages d'application : prototypes non indexés */
['parcours-ci','activites-ci','lecon-ci','bilan-ci'].forEach(p=>assert.ok(/<meta name="robots" content="noindex/.test(read(p+'/index.html')),p+' doit rester non indexée'));
/* hors-ligne : version renouvelée */
assert.ok(+/pc-v(\d+)/.exec(read('sw.js'))[1]>=126,'cache du service worker renouvelé');
/* titres : 65 caractères au plus ; un seul h1 statique sur les pages de leçon et d'investigation */
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
['3e','4e','5e','6e','lecons','decouvrir'].flatMap(d=>walk(d)).filter(f=>f.endsWith('index.html')).forEach(f=>{
  const t=/<title[^>]*>(.*?)<\/title>/s.exec(read(f))[1];assert.ok(t.length<=65,f+' : titre de '+t.length+' caractères');});
assert.equal((read('lecon/index.html').match(/<h1[\s>]/g)||[]).length,1,'lecon : un seul h1');
assert.ok(/<noscript><h1(?:\s[^>]*)?>/.test(read('activites-ci/index.html')),'activites-ci : h1 statique de repli');
console.log('studio-lecteur : OK');
