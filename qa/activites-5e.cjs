/* Fiche de 5e ELE-01 (intensité en série) sur le moteur des fiches : modèle, structure, manipulation, parcours, page, redirection de l'ancienne leçon d'essai. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/activites-5e/',runScripts:'outside-only'}),w=dom.window,doc=w.document;
w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};
for(const f of ['assets/shared/atelier-electrique.js','assets/shared/elec5e.js','assets/activites/activite.js',...['01','02','03','04'].map(n=>'assets/activites/fiches/NL-5E-ELE-'+n+'.js')])w.eval(read(f));
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

/* ---------- lot Électricité de 5e : ELE-02, 03, 04 ---------- */
const N=w.NohobaElec5e,eq=(a,b,m)=>assert.equal(JSON.stringify(a),JSON.stringify(b),m);
/* modèles */
eq(['off','low','ok','ok','high','burn'].join(),[1,3,6,7,8,12].map(u=>N.etat(u,'L6').k).join(),'lampe 6 V selon la tension');
assert.equal(N.etat(4.5,'L6').adapte,false);assert.equal(N.etat(6,'M6').adapte,true);assert.match(N.etat(4.5,'M6').txt,/lentement/);assert.throws(()=>N.rec('X'),/inconnu/);
assert.equal(N.etat(1.5,'L1').k,'ok');assert.equal(N.etat(12,'L1').k,'burn');
eq(N.etat3('serie','aucune').L1,{on:true,k:.5},'série : les lampes brillent moins');eq(N.etat3('serie','L2').L1.on,false,'série : une lampe dévissée éteint tout');
eq(N.etat3('derivation','L1').L2,{on:true,k:1},'dérivation : l’autre reste allumée');assert.equal(N.etat3('derivation','L1').L1.on,false);assert.throws(()=>N.etat3('x','aucune'),/inconnu/);assert.throws(()=>N.etat3('serie','L3'),/inconnue/);
assert.equal(N.total([{f:0}]),1.5);assert.equal(N.total([{f:0},{f:0},{f:0}]),4.5);assert.equal(N.total([{f:0},{f:1}]),0);assert.equal(N.total([{f:0},{f:0},{f:1}]),1.5);assert.throws(()=>N.total([]),/une à trois/);
/* structure commune des trois fiches */
function lancer(n){const F=w['FICHE_5E_ELE'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st={essais:[],prevision:null},X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X);return {F,panel,st};}
const choisir2=(panel,n,v)=>{const r=panel.querySelector('input[name="'+n+'"][value="'+v+'"]');assert.ok(r,n+'/'+v);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));};
const enreg2=(panel)=>{panel.querySelector('textarea').value='J’observe ce qui se passe dans ce montage.';[...panel.querySelectorAll('button')].find(b=>/Enregistrer/.test(b.textContent)).click();};
for(const n of ['02','03','04']){const {F,panel,st}=lancer(n);
  for(const k of ['titre','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','situation','materiel','prevision','protocole','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,n+' : champ '+k);
  assert.equal(F.niveau,'5e');assert.equal(F.theme,'Électricité');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+n);assert.equal(F.grilleMaitrise.map(x=>x[0]).join(),'MI,MF,MS,TBM');
  assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep),'transfert '+n);assert.ok(F.aides.length>=3&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2);
  assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation),'situation contextualisée '+n);
  assert.ok(!/NL-C4|NL-CI|NL-5E|ELE-\d\d|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+n);
  assert.ok(!/(?<![a-zé])joule|\bwatt|\brésistance\b|\bohm/i.test(JSON.stringify(F)),'aucune notion hors lot '+n);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'SVG nommés '+n);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma côte à côte '+n);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés '+n);
  panel.querySelector('textarea').value='court';[...panel.querySelectorAll('button')].find(b=>/Enregistrer/.test(b.textContent)).click();assert.equal(st.essais.length,0,'observation courte refusée '+n);
  assert.equal(F.peutConfronter({essais:[]}),false,'rien à confronter au départ '+n);
  const app2=doc.createElement('div');doc.body.appendChild(app2);w.Activite.run(F,app2);assert.ok(app2.textContent.includes('Communiquer')&&!/NL-5E/.test(app2.textContent),'six opérations '+n);}
/* ELE-02 : essais normal, sous-tension, surtension sur deux récepteurs */
{const {F,panel,st}=lancer('02');
 for(const [r,g] of [['L6','6'],['L6','4.5'],['L6','12'],['M6','6'],['M6','4.5']]){choisir2(panel,'e-r',r);choisir2(panel,'e-g',g);enreg2(panel);}
 assert.equal(st.essais.length,5);assert.equal(F.peutConfronter(st),true);eq(st.essais.map(e=>e.etat),['ok','low','burn','ok','low']);
 assert.equal(F.peutConfronter({essais:st.essais.slice(0,3)}),false,'deux récepteurs et cinq essais');
 assert.match(panel.querySelector('svg').getAttribute('aria-label'),/6 V/);}
/* ELE-03 : quatre cas */
{const {F,panel,st}=lancer('03');
 for(const [m,d] of [['serie','aucune'],['serie','L1'],['derivation','aucune']]){choisir2(panel,'e-m',m);choisir2(panel,'e-d',d);enreg2(panel);}
 assert.equal(F.peutConfronter(st),false);choisir2(panel,'e-m','derivation');choisir2(panel,'e-d','L1');enreg2(panel);
 assert.equal(F.peutConfronter(st),true);eq(st.essais.map(e=>[e.l1,e.l2]),[[true,true],[false,false],[true,true],[false,true]]);
 assert.match(st.essais[0].t1,/faible/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/dérivation/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/L1 est dévissée/);
 const sch=[...panel.querySelectorAll('svg')][1].getAttribute('aria-label');assert.match(sch,/deux boucles/);}
/* ELE-04 : une, deux, trois piles, puis une pile retournée */
{const {F,panel,st}=lancer('04');
 for(const a of ['1','2c','3c']){choisir2(panel,'e-a',a);enreg2(panel);}
 assert.equal(F.peutConfronter(st),false);choisir2(panel,'e-a','3o');enreg2(panel);
 assert.equal(F.peutConfronter(st),true);eq(st.essais.map(e=>e.U),[1.5,3,4.5,1.5]);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/1,5 V/);
 assert.match(panel.querySelector('p[aria-live=polite]').textContent,/Trois piles, une retournée : 1,5 V/);}
/* page et hors-ligne */
for(const n of ['02','03','04'])assert.ok(read('sw.js').includes('NL-5E-ELE-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('elec5e.js')&&read('activites-5e/index.html').includes('elec5e.js'),'modèle partagé chargé et en cache');
assert.ok(/ELE-0\[1-4\]/.test(read('activites-5e/index.html')),'liste blanche de la page');
/* page et redirection */
const page=read('activites-5e/index.html');assert.ok(/noindex/.test(page)&&/Prototype/.test(page)&&/FICHE_5E_/.test(page)&&/NL-5E-ELE-01/.test(page));assert.ok(!read('sitemap.xml').includes('activites-5e'),'prototype hors référencement');
const old=read('lecon-essai/index.html');assert.ok(/activites-5e\/\?a=NL-5E-ELE-01/.test(old)&&/noindex/.test(old),'l’ancienne leçon d’essai renvoie vers la fiche');
assert.ok(!fs.existsSync(path.join(root,'assets/simple/lecon-essai.js')),'ancien moteur de la leçon d’essai retiré');
assert.ok(read('sw.js').includes('NL-5E-ELE-01.js')&&read('sw.js').includes('./activites-5e/'),'hors-ligne');
console.log('Fiches de 5e (ELE-01 à ELE-04) : modèles, structure, manipulations, six opérations, page, hors-ligne et redirection contrôlés.');
