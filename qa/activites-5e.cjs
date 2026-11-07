/* Fiche de 5e ELE-01 (intensité en série) sur le moteur des fiches : modèle, structure, manipulation, parcours, page, redirection de l'ancienne leçon d'essai. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/activites-5e/',runScripts:'outside-only'}),w=dom.window,doc=w.document;
w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};
for(const f of ['assets/shared/atelier-electrique.js','assets/shared/elec5e.js','assets/shared/mesures5e.js','assets/shared/melanges5e.js','assets/shared/matiere5e.js','assets/shared/dilatation5e.js','assets/activites/activite.js',...['ELE-01','ELE-02','ELE-03','ELE-04','ELE-05','MES-01','MES-02','MEL-01','MEL-02','MEL-03','MAT-01','MAT-02','MAT-03','MAT-04','DIL-01','DIL-02','DIL-03','DIL-04'].map(n=>'assets/activites/fiches/NL-5E-'+n+'.js')])w.eval(read(f));
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

/* ---------- lot Mesures de 5e : ELE-05 (tension), MES-01 (effets de la pression), MES-02 (pression et altitude) ---------- */
const E5=w.NohobaElec5e,M5=w.NohobaMes5e;
assert.equal(E5.tension('G',true),4.5);assert.equal(E5.tension('L1',true),1.5);assert.equal(E5.tension('L2',true),3);assert.equal(E5.tension('K',true),0);assert.equal(E5.tension('K',false),4.5);assert.equal(E5.tension('L1',false),0);
assert.equal(E5.tension('L1',true)+E5.tension('L2',true),E5.tension('G',true),'U = U1 + U2');assert.throws(()=>E5.tension('X',true),/inconnu/);
assert.equal(M5.pression(0),1013);assert.ok(M5.pression(1752)>=815&&M5.pression(1752)<=825,'mont Nimba environ 820 hPa');
assert.ok(M5.pression(1189)>M5.pression(1752)&&M5.pression(1752)>M5.pression(5895)&&M5.pression(5895)>M5.pression(8849)&&M5.pression(8849)>0,'la pression diminue avec l’altitude sans s’annuler');
assert.throws(()=>M5.pression(-1),/hors/);assert.throws(()=>M5.pression(9500),/hors/);assert.throws(()=>M5.lieu('lune'),/inconnu/);assert.throws(()=>M5.exp('x'),/inconnue/);
assert.deepEqual(['verre-lisse','verre-trou','bout-0','bout-bcp','vent-ok','vent-trou'].map(i=>M5.exp(i).effet),[true,false,false,true,true,false]);
assert.ok(M5.exp('bout-bcp').dedans==='moins'&&M5.exp('bout-0').dedans==='autant');
for(const n of ['ELE05','MES01','MES02']){const F=w['FICHE_5E_'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st2={essais:[],prevision:null},X2={st:()=>st2,save:()=>{},addEssai:e=>{st2.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X2);
  for(const k of ['titre','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','situation','materiel','prevision','protocole','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,n+' : champ '+k);
  assert.equal(F.theme,'Mesure de grandeurs physiques');assert.equal(F.niveau,'5e');assert.equal(F.prevision.choix.length,4);assert.equal(F.grilleMaitrise.map(x=>x[0]).join(),'MI,MF,MS,TBM');
  assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep),'transfert '+n);assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation));
  assert.ok(!/NL-C4|NL-CI|NL-5E|ELE-\d\d|MES-\d\d|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+n);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'SVG nommés '+n);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma '+n);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés '+n);
  assert.equal(F.peutConfronter({essais:[]}),false,'rien à confronter '+n);
  const a=doc.createElement('div');doc.body.appendChild(a);w.Activite.run(F,a);assert.ok(a.textContent.includes('Communiquer')&&!/NL-5E/.test(a.textContent),'six opérations '+n);}
{const {F,panel,st}=lancer('05');
 for(const [d,k] of [['G','ferme'],['L1','ferme'],['L2','ferme']]){choisir2(panel,'e-d',d);choisir2(panel,'e-k',k);enreg2(panel);}
 assert.equal(F.peutConfronter(st),false);choisir2(panel,'e-d','K');choisir2(panel,'e-k','ouvert');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/4,5 V/);enreg2(panel);
 assert.equal(F.peutConfronter(st),true);assert.deepEqual(st.essais.map(e=>e.U),[4.5,1.5,3,4.5]);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/voltmètre est branché aux bornes de l’interrupteur K et indique 4,5 V/);}
{const F=w.FICHE_5E_MES01,panel=doc.createElement('div');doc.body.appendChild(panel);const st={essais:[],prevision:null},X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X);
 for(const x of ['verre-lisse','verre-trou','bout-bcp']){choisir2(panel,'e-x',x);enreg2(panel);}assert.equal(F.peutConfronter(st),false,'les trois expériences sont nécessaires');
 choisir2(panel,'e-x','vent-ok');enreg2(panel);assert.equal(F.peutConfronter(st),true);assert.match(panel.querySelector('p[aria-live=polite]').textContent,/colle au mur/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/ventouse bien appliquée/);
 assert.match([...panel.querySelectorAll('svg')][1].getAttribute('aria-label'),/Dehors pousse plus que dedans/);}
{const F=w.FICHE_5E_MES02,panel=doc.createElement('div');doc.body.appendChild(panel);const st={essais:[],prevision:null},X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X);
 for(const l of ['abidjan','tonkoui','nimba']){choisir2(panel,'e-l',l);enreg2(panel);}assert.equal(F.peutConfronter(st),false,'il faut un sommet très haut');
 choisir2(panel,'e-l','everest');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/Everest : 314 hPa/);enreg2(panel);assert.equal(F.peutConfronter(st),true);
 assert.deepEqual(st.essais.map(e=>e.P),[1013,M5.pression(1189),M5.pression(1752),314]);assert.match([...panel.querySelectorAll('svg')][1].getAttribute('aria-label'),/314 hPa/);}
for(const n of ['ELE-05','MES-01','MES-02'])assert.ok(read('sw.js').includes('NL-5E-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('mesures5e.js')&&read('activites-5e/index.html').includes('mesures5e.js'),'modèle de pression chargé et en cache');
assert.ok(/MES-0\[12\]/.test(read('activites-5e/index.html')),'liste blanche : pression');
/* ---------- lot Mélanges de 5e : MEL-01 (phases), MEL-02 (hétérogène), MEL-03 (homogène) ---------- */
const ML=w.NohobaMelanges5e;
assert.equal(ML.MIX1.map(m=>ML.mix1(m[0]).phases).join(),'2,1,2,1,2,1,2,1');assert.equal(ML.mix1('sel').famille,'homogène');assert.equal(ML.mix1('huile').famille,'hétérogène');assert.throws(()=>ML.mix1('x'),/inconnu/);
assert.equal(ML.res2('sable','filtration').sep,'oui');assert.equal(ML.res2('huile','filtration').sep,'non');assert.equal(ML.res2('huile','ampoule').sep,'oui');assert.equal(ML.res2('boue','decantation').sep,'partiel');assert.equal(ML.res2('sable','ampoule').sep,'non');
assert.throws(()=>ML.res2('x','filtration'),/inconnu/);assert.throws(()=>ML.res2('sable','x'),/inconnu/);
assert.equal(ML.res3('sel','filtration').recup,'rien');assert.equal(ML.res3('sucre','evaporation').recup,'solide');assert.equal(ML.res3('mer','distillation').recup,'distillat');assert.throws(()=>ML.res3('sel','x'),/inconnu/);
for(const m of ML.MIX2)for(const k of ML.METH2){assert.ok(/^<svg/.test(ML.montage2(m[0],k[0]))&&/^<svg/.test(ML.schema2(m[0],k[0])));}
for(const m of ML.MIX3)for(const k of ML.METH3){assert.ok(/^<svg/.test(ML.montage3(m[0],k[0]))&&/^<svg/.test(ML.schema3(m[0],k[0])));}
assert.ok(/chauffage réalisé par le professeur/.test(ML.montage3('mer','distillation')+ML.montage3('sel','evaporation')),'chauffage guidé');
for(const n of ['MEL01','MEL02','MEL03']){const F=w['FICHE_5E_'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st2={essais:[],prevision:null},X2={st:()=>st2,save:()=>{},addEssai:e=>{st2.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X2);
  for(const k of ['titre','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','situation','materiel','prevision','protocole','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,n+' : champ '+k);
  assert.equal(F.theme,'Mélanges et réactions chimiques');assert.equal(F.niveau,'5e');assert.equal(F.prevision.choix.length,4);assert.equal(F.grilleMaitrise.map(x=>x[0]).join(),'MI,MF,MS,TBM');assert.ok(F.aides.length>=3);
  assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep),'transfert '+n);assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation));
  assert.ok(!/NL-C4|NL-CI|NL-5E|MEL-\d\d|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+n);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'SVG nommés '+n);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma '+n);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés '+n);
  assert.equal(F.peutConfronter({essais:[]}),false,'rien à confronter '+n);
  const a=doc.createElement('div');doc.body.appendChild(a);w.Activite.run(F,a);assert.ok(a.textContent.includes('Communiquer')&&!/NL-5E/.test(a.textContent),'six opérations '+n);}
function lancerM(n){const F=w['FICHE_5E_'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st={essais:[],prevision:null},X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X);return {F,panel,st};}
{const {F,panel,st}=lancerM('MEL01');
 for(const m of ['sel','sucre','sirop','alcool','sel']){choisir2(panel,'e-m',m);enreg2(panel);}assert.equal(F.peutConfronter(st),false,'il faut un mélange à plusieurs phases');}
{const {F,panel,st}=lancerM('MEL01');
 for(const m of ['sel','sucre','sirop','alcool','terre']){choisir2(panel,'e-m',m);enreg2(panel);}assert.equal(F.peutConfronter(st),true);
 choisir2(panel,'e-m','huile');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/2 phases/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/huile/);}
{const {F,panel,st}=lancerM('MEL02');
 for(const [m,k] of [['sable','filtration'],['huile','filtration'],['huile','ampoule'],['boue','decantation'],['boue','filtration']]){choisir2(panel,'e-m',m);choisir2(panel,'e-k',k);if([['huile','filtration']].some(x=>x[0]===m&&x[1]===k))assert.match(panel.querySelector('p[aria-live=polite]').textContent,/rien n’est séparé|traversent/);enreg2(panel);}
 assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.map(e=>e.sep).join(),'oui,non,oui,partiel,oui');}
{const {F,panel,st}=lancerM('MEL03');
 for(const k of ['filtration','evaporation']){choisir2(panel,'e-m','mer');choisir2(panel,'e-k',k);enreg2(panel);}
 choisir2(panel,'e-m','sel');choisir2(panel,'e-k','filtration');enreg2(panel);choisir2(panel,'e-m','sucre');choisir2(panel,'e-k','evaporation');enreg2(panel);
 assert.equal(F.peutConfronter(st),false,'la distillation est nécessaire');choisir2(panel,'e-m','mer');choisir2(panel,'e-k','distillation');assert.match(panel.querySelector('svg').getAttribute('aria-label'),/chauffage réalisé par le professeur/);enreg2(panel);
 assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.map(e=>e.recup).join(),'rien,solide,rien,solide,distillat');}
for(const n of ['MEL-01','MEL-02','MEL-03'])assert.ok(read('sw.js').includes('NL-5E-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('melanges5e.js')&&read('activites-5e/index.html').includes('melanges5e.js'),'modèle des mélanges chargé et en cache');
assert.ok(/MEL-0\[1-3\]/.test(read('activites-5e/index.html')),'liste blanche : mélanges');
/* ---------- lot Matière de 5e : MAT-01 (formules), MAT-02 (corps simple/composé), MAT-03 (carbone), MAT-04 (soufre) ---------- */
const MT=w.NohobaMatiere5e;
assert.equal(MT.mol('h2o').f,'H₂O');assert.equal(MT.mol('ch4').total,5);assert.equal(MT.mol('nh3').total,4);assert.equal(MT.mol('co2').types,2);
assert.equal(['h2','o2','n2','cl2'].map(i=>MT.mol(i).classe).join(),'simple,simple,simple,simple');assert.equal(['h2o','co2','co','ch4','nh3','so2'].map(i=>MT.mol(i).classe).join(),'composé,composé,composé,composé,composé,composé');assert.throws(()=>MT.mol('x'),/inconnue/);
for(const m of MT.MOL){assert.ok(/^<svg/.test(MT.montageMol(m[0]))&&/^<svg/.test(MT.schemaMol(m[0],'total'))&&/^<svg/.test(MT.schemaMol(m[0],'classe')));}
assert.equal(MT.res3('n2').brule,'non');assert.equal(MT.res3('o2').brule,'vive');assert.equal(MT.res3('air').chaux,'trouble');assert.equal(MT.res3('n2').chaux,'limpide');assert.throws(()=>MT.res3('x'),/inconnu/);
assert.equal(MT.res4('o2','ph').pos,true);assert.equal(MT.res4('n2','kmno').pos,false);assert.throws(()=>MT.res4('o2','x'),/inconnu/);assert.throws(()=>MT.res4('x','ph'),/inconnu/);
for(const g of MT.GAZ){assert.ok(/chauffage réalisé par le professeur/.test(MT.montage3(g[0])));for(const t of MT.TESTS){assert.ok(/^<svg/.test(MT.montage4(g[0],t[0]))&&/^<svg/.test(MT.schema4(g[0],t[0]))&&/professeur/.test(MT.montage4(g[0],t[0])));}assert.ok(/^<svg/.test(MT.schema3(g[0])));}
for(const n of ['MAT01','MAT02','MAT03','MAT04']){const F=w['FICHE_5E_'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st2={essais:[],prevision:null},X2={st:()=>st2,save:()=>{},addEssai:e=>{st2.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X2);
  for(const k of ['titre','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','situation','materiel','prevision','protocole','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,n+' : champ '+k);
  assert.equal(F.theme,'Mélanges et réactions chimiques');assert.equal(F.niveau,'5e');assert.equal(F.prevision.choix.length,4);assert.equal(F.grilleMaitrise.map(x=>x[0]).join(),'MI,MF,MS,TBM');assert.ok(F.aides.length>=3);
  assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep),'transfert '+n);assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation));
  assert.ok(!/NL-C4|NL-CI|NL-5E|MAT-\d\d|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+n);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'SVG nommés '+n);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma '+n);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés '+n);
  assert.equal(F.peutConfronter({essais:[]}),false,'rien à confronter '+n);
  const a=doc.createElement('div');doc.body.appendChild(a);w.Activite.run(F,a);assert.ok(a.textContent.includes('Communiquer')&&!/NL-5E/.test(a.textContent),'six opérations '+n);}
{const {F,panel,st}=lancerM('MAT01');for(const m of ['h2','o2','h2o']){choisir2(panel,'e-m',m);enreg2(panel);}assert.equal(F.peutConfronter(st),false);
 choisir2(panel,'e-m','ch4');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/CH₄\) : 5 atomes/);assert.match(panel.querySelector('svg').getAttribute('aria-label'),/1 atome de carbone, 4 atomes de hydrogène|1 atome de carbone, 4 atomes d/);enreg2(panel);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st}=lancerM('MAT02');for(const m of ['h2','o2','n2','h2o','co2']){choisir2(panel,'e-m',m);enreg2(panel);}assert.equal(F.peutConfronter(st),false);
 choisir2(panel,'e-m','ch4');enreg2(panel);assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.map(e=>e.classe).join(),'simple,simple,simple,composé,composé,composé');assert.match([...panel.querySelectorAll('svg')][1].getAttribute('aria-label'),/corps composé/);}
{const {F,panel,st}=lancerM('MAT03');for(const g of ['air','o2']){choisir2(panel,'e-g',g);enreg2(panel);}assert.equal(F.peutConfronter(st),false,'le diazote est nécessaire');
 choisir2(panel,'e-g','n2');assert.match(panel.querySelector('svg').getAttribute('aria-label'),/chauffage réalisé par le professeur/);enreg2(panel);assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.map(e=>e.brule).join(),'lente,vive,non');}
{const {F,panel,st}=lancerM('MAT04');for(const [g,t] of [['o2','flamme'],['o2','ph'],['air','kmno'],['air','flamme']]){choisir2(panel,'e-g',g);choisir2(panel,'e-t',t);enreg2(panel);}assert.equal(F.peutConfronter(st),false);
 choisir2(panel,'e-g','n2');choisir2(panel,'e-t','ph');assert.match(panel.querySelector('svg').getAttribute('aria-label'),/hotte/);enreg2(panel);assert.equal(F.peutConfronter(st),false,'permanganate dans le dioxygène nécessaire');
 choisir2(panel,'e-g','o2');choisir2(panel,'e-t','kmno');enreg2(panel);assert.equal(F.peutConfronter(st),true);}
for(const n of ['MAT-01','MAT-02','MAT-03','MAT-04'])assert.ok(read('sw.js').includes('NL-5E-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('matiere5e.js')&&read('activites-5e/index.html').includes('matiere5e.js'),'modèle de la matière chargé et en cache');
assert.ok(/MAT-0\[1-4\]/.test(read('activites-5e/index.html')),'liste blanche : matière');
/* ---------- lot Dilatation de 5e : DIL-01 (solide), DIL-02 (métaux), DIL-03 (liquides), DIL-04 (gaz) ---------- */
const DL=w.NohobaDilatation5e;
assert.equal(DL.res1('froide').passe,true);assert.equal(DL.res1('chauffee').passe,false);assert.equal(DL.res1('refroidie').passe,true);assert.throws(()=>DL.res1('x'),/inconnu/);
assert.ok(DL.res2('fer','chaud').allong<DL.res2('cuivre','chaud').allong&&DL.res2('cuivre','chaud').allong<DL.res2('alu','chaud').allong,'fer < cuivre < aluminium');assert.equal(DL.res2('alu','ambiant').allong,0);assert.throws(()=>DL.res2('or','chaud'),/inconnu/);assert.throws(()=>DL.res2('fer','x'),/inconnu/);
assert.ok(DL.res3('eau','chaud').niv>0&&DL.res3('eau','glace').niv<0&&DL.res3('eau','ambiant').niv===0&&DL.res3('alcool','chaud').niv>DL.res3('huile','chaud').niv&&DL.res3('huile','chaud').niv>DL.res3('eau','chaud').niv,'alcool > huile > eau');assert.throws(()=>DL.res3('x','chaud'),/inconnu/);assert.throws(()=>DL.res3('eau','x'),/inconnu/);
assert.equal(['glace','ambiant','chaud','mains'].map(b=>DL.res4(b).etat).join(),'dégonflé,inchangé,gonflé,gonflé');assert.throws(()=>DL.res4('x'),/inconnu/);
for(const e of DL.ETATS)assert.ok(/^<svg/.test(DL.montage1(e[0]))&&/^<svg/.test(DL.schema1(e[0])));
for(const b of DL.BARRES)for(const s of DL.ETATS2)assert.ok(/^<svg/.test(DL.montage2(b[0],s[0]))&&/^<svg/.test(DL.schema2(b[0],s[0])));
for(const l of DL.LIQ)for(const b of DL.BAINS)assert.ok(/^<svg/.test(DL.montage3(l[0],b[0]))&&/^<svg/.test(DL.schema3(l[0],b[0])));
for(const b of DL.BAINS4)assert.ok(/^<svg/.test(DL.montage4(b[0]))&&/^<svg/.test(DL.schema4(b[0])));
assert.ok(/chauffage réalisé par le professeur/.test(DL.montage1('chauffee')+DL.montage2('fer','chaud')),'chauffage guidé');
for(const n of ['DIL01','DIL02','DIL03','DIL04']){const F=w['FICHE_5E_'+n],panel=doc.createElement('div');doc.body.appendChild(panel);const st2={essais:[],prevision:null},X2={st:()=>st2,save:()=>{},addEssai:e=>{st2.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};F.manip(panel,X2);
  for(const k of ['titre','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','situation','materiel','prevision','protocole','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'])assert.ok(F[k]!=null,n+' : champ '+k);
  assert.equal(F.theme,'Propriétés physiques de la matière');assert.equal(F.niveau,'5e');assert.equal(F.prevision.choix.length,4);assert.equal(F.grilleMaitrise.map(x=>x[0]).join(),'MI,MF,MS,TBM');assert.ok(F.aides.length>=3);
  assert.ok(F.transfert.options.some(o=>o[0]===F.transfert.rep),'transfert '+n);assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation));
  assert.ok(!/NL-C4|NL-CI|NL-5E|DIL-\d\d|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+n);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'SVG nommés '+n);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma '+n);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'contrôles étiquetés '+n);
  assert.equal(F.peutConfronter({essais:[]}),false,'rien à confronter '+n);
  const a=doc.createElement('div');doc.body.appendChild(a);w.Activite.run(F,a);assert.ok(a.textContent.includes('Communiquer')&&!/NL-5E/.test(a.textContent),'six opérations '+n);}
{const {F,panel,st}=lancerM('DIL01');for(const e of ['froide','chauffee']){choisir2(panel,'e-e',e);enreg2(panel);}assert.equal(F.peutConfronter(st),false);
 choisir2(panel,'e-e','refroidie');enreg2(panel);assert.equal(F.peutConfronter(st),true);assert.equal(st.essais.map(e=>e.passe).join(),'true,false,true');choisir2(panel,'e-e','chauffee');assert.match(panel.querySelector('svg').getAttribute('aria-label'),/reste bloquée/);}
{const {F,panel,st}=lancerM('DIL02');for(const b of ['fer','cuivre']){choisir2(panel,'e-b',b);choisir2(panel,'e-s','chaud');enreg2(panel);}choisir2(panel,'e-b','alu');choisir2(panel,'e-s','ambiant');enreg2(panel);choisir2(panel,'e-b','fer');choisir2(panel,'e-s','ambiant');enreg2(panel);
 assert.equal(F.peutConfronter(st),false,'l’aluminium chauffé est nécessaire');choisir2(panel,'e-b','alu');choisir2(panel,'e-s','chaud');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/beaucoup/);enreg2(panel);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st}=lancerM('DIL03');for(const [l,b] of [['eau','chaud'],['huile','chaud'],['alcool','chaud'],['eau','ambiant']]){choisir2(panel,'e-l',l);choisir2(panel,'e-b',b);enreg2(panel);}assert.equal(F.peutConfronter(st),false,'un bain de glace est nécessaire');
 choisir2(panel,'e-l','alcool');choisir2(panel,'e-b','glace');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/sous le repère/);enreg2(panel);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st}=lancerM('DIL04');for(const b of ['chaud','mains']){choisir2(panel,'e-b',b);enreg2(panel);}assert.equal(F.peutConfronter(st),false);choisir2(panel,'e-b','glace');assert.match(panel.querySelector('p[aria-live=polite]').textContent,/dégonfle/);enreg2(panel);assert.equal(F.peutConfronter(st),true);}
for(const n of ['DIL-01','DIL-02','DIL-03','DIL-04'])assert.ok(read('sw.js').includes('NL-5E-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('dilatation5e.js')&&read('activites-5e/index.html').includes('dilatation5e.js'),'modèle de dilatation chargé et en cache');
assert.ok(/DIL-0\[1-4\]/.test(read('activites-5e/index.html')),'liste blanche : dilatation');
/* page et hors-ligne */
for(const n of ['02','03','04'])assert.ok(read('sw.js').includes('NL-5E-ELE-'+n+'.js'),'hors-ligne '+n);
assert.ok(read('sw.js').includes('elec5e.js')&&read('activites-5e/index.html').includes('elec5e.js'),'modèle partagé chargé et en cache');
assert.ok(/ELE-0\[1-5\]/.test(read('activites-5e/index.html')),'liste blanche de la page');
/* page et redirection */
const page=read('activites-5e/index.html');assert.ok(/embed=1/.test(page),'mode intégré au livre');assert.ok(/noindex/.test(page)&&/Prototype/.test(page)&&/FICHE_5E_/.test(page)&&/NL-5E-ELE-01/.test(page));assert.ok(!read('sitemap.xml').includes('activites-5e'),'prototype hors référencement');
const old=read('lecon-essai/index.html');assert.ok(/activites-5e\/\?a=NL-5E-ELE-01/.test(old)&&/noindex/.test(old),'l’ancienne leçon d’essai renvoie vers la fiche');
assert.ok(!fs.existsSync(path.join(root,'assets/simple/lecon-essai.js')),'ancien moteur de la leçon d’essai retiré');
assert.ok(read('sw.js').includes('NL-5E-ELE-01.js')&&read('sw.js').includes('./activites-5e/'),'hors-ligne');
console.log('Fiches de 5e (ELE-01 à ELE-05, MES-01, MES-02, MEL-01 à MEL-03, MAT-01 à MAT-04, DIL-01 à DIL-04) : modèles, structure, manipulations, six opérations, page, hors-ligne et redirection contrôlés.');
