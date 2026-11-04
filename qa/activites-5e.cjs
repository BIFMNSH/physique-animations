/* Fiche de 5e ELE-01 (intensité en série) sur le moteur des fiches : modèle, structure, manipulation, parcours, page, redirection de l'ancienne leçon d'essai. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/activites-5e/',runScripts:'outside-only'}),w=dom.window,doc=w.document;
w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};
for(const f of ['assets/shared/atelier-electrique.js','assets/activites/activite.js','assets/activites/fiches/NL-5E-ELE-01.js'])w.eval(read(f));
const F=w.FICHE_5E_ELE01,I=w.NohobaIntensite.intensite;
/* modèle */
assert.equal(I(1,true),300);assert.equal(I(2,true),150);assert.equal(I(1,false),0);assert.equal(I(2,false),0);
/* structure : une seule compétence, cadre, contexte local, aucun code interne ni « Programme du cycle 4 » */
for(const k of ['id','titre','niveau','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','objectif','objectifEleve','situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,'champ '+k);
assert.equal(F.niveau,'5e');assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4);
assert.ok(F.prevision.choix.some(c=>c[0]==='meme'));assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep));assert.ok(F.aides.length>=3&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2);
assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation),'situation contextualisée');
const txt=JSON.stringify(F).replace(F.id,'');assert.ok(!/NL-C4|NL-CI|NL-5E|ELE-\d\d|Programme du cycle 4/.test(txt),'aucun code interne');
/* manipulation */
const panel=doc.createElement('div');doc.body.appendChild(panel);
const st={essais:[],prevision:null},X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
F.manip(panel,X);
assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'chaque dessin est un SVG nommé');
const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma côte à côte');
assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés');
const choisir=(n,v)=>{const r=panel.querySelector('input[name="'+n+'"][value="'+v+'"]');r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));};
const lire=()=>panel.querySelector('p[aria-live=polite]').textContent;
const enreg=(t)=>{panel.querySelector('textarea').value=t||'J’observe la même valeur sur l’ampèremètre.';[...panel.querySelectorAll('button')].find(b=>/Enregistrer/.test(b.textContent)).click();};
enreg('court');assert.equal(st.essais.length,0,'observation trop courte refusée');
for(const p of ['A','B','C']){choisir('e-p',p);assert.match(lire(),new RegExp('en '+p+' : 300 mA'));enreg();}
assert.equal(F.peutConfronter(st),false,'il faut aussi deux lampes et le circuit ouvert');
choisir('e-n','2');assert.match(lire(),/150 mA/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/deux lampes/);enreg();
assert.equal(F.peutConfronter(st),false);
choisir('e-n','1');choisir('e-k','ouvert');assert.match(lire(),/0 mA \(circuit ouvert\)/);enreg();
assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.length,5);assert.deepEqual(st.essais.map(e=>e.i),[300,300,300,150,0]);
panel.querySelector('[data-p="B"]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));assert.equal(panel.querySelector('input[name="e-p"]:checked').value,'B','clic sur le point B du montage');
assert.equal(F.peutConfronter({essais:st.essais.map(e=>({...e,observation:''}))}),false,'observations nécessaires');
/* moteur : les six opérations et la marque 5e */
const app=doc.createElement('div');doc.body.appendChild(app);w.Activite.run(F,app);
for(const t of ['Problématiser','Émettre une hypothèse','Expérimenter / Investiguer','Analyser et interpréter','Conclure','Communiquer'])assert.ok(app.textContent.includes(t),'opération '+t);
assert.match(app.textContent,/Thème : Mesure de grandeurs physiques/);assert.match(app.textContent,/À la fin de cette partie, je dois être capable de/);
assert.ok(!/NL-5E|NL-CI/.test(app.textContent),'aucun code interne à l’écran');
/* page et redirection */
const page=read('activites-5e/index.html');assert.ok(/noindex/.test(page)&&/Prototype/.test(page)&&/FICHE_5E_/.test(page)&&/NL-5E-ELE-01/.test(page));assert.ok(!read('sitemap.xml').includes('activites-5e'),'prototype hors référencement');
const old=read('lecon-essai/index.html');assert.ok(/activites-5e\/\?a=NL-5E-ELE-01/.test(old)&&/noindex/.test(old),'l’ancienne leçon d’essai renvoie vers la fiche');
assert.ok(!fs.existsSync(path.join(root,'assets/simple/lecon-essai.js')),'ancien moteur de la leçon d’essai retiré');
assert.ok(read('sw.js').includes('NL-5E-ELE-01.js')&&read('sw.js').includes('./activites-5e/'),'hors-ligne');
console.log('Fiche de 5e ELE-01 : modèle, structure, manipulation, six opérations, page et redirection contrôlés.');
