/* Lot 5e Intensité et tension (INT-01, INT-02, INT-04, TEN-01) : modèle NohobaIntensite5e, dessins, structure des fiches, parcours, page, hors-ligne et livre. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/activites-5e/',runScripts:'outside-only'}),w=dom.window,doc=w.document;
w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};
const IDS=['INT-01','INT-02','INT-04','TEN-01'];
for(const f of ['assets/shared/atelier-electrique.js','assets/shared/elec5e.js','assets/shared/intensite5e.js','assets/activites/activite.js',...IDS.map(n=>'assets/activites/fiches/NL-5E-'+n+'.js')])w.eval(read(f));
const M=w.NohobaIntensite5e;
/* modèle : notion d'intensité */
assert.deepEqual([1,2,3].map(n=>M.notion(n,'lampe').i),[50,100,150]);assert.deepEqual([1,2,3].map(n=>M.notion(n,'moteur').i),[60,120,180]);
assert.ok(M.notion(3,'lampe').i>M.notion(1,'lampe').i);assert.match(M.notion(1,'lampe').effet,/faiblement/);assert.match(M.notion(3,'moteur').effet,/vite/);
assert.throws(()=>M.notion(4,'lampe'));assert.throws(()=>M.notion(1,'radio'));
/* modèle : mesure en série, calibres, circuit ouvert, mauvais branchement */
for(const p of ['avantL1','entre','apresL2']){assert.equal(M.mesure(p,true,'200mA').i,60);assert.equal(M.mesure(p,true,'200mA').txt,'60 mA');assert.equal(M.mesure(p,true,'2A').txt,'0,06 A');assert.equal(M.mesure(p,false,'200mA').i,0);}
const err=M.mesure('derivation',true,'200mA');assert.equal(err.erreur,true);assert.equal(err.i,null);assert.throws(()=>M.mesure('ailleurs',true,'2A'));assert.throws(()=>M.mesure('entre',true,'20A'));
/* modèle : loi des intensités en dérivation */
const d=M.derivation('P',true,true);assert.deepEqual([d.I,d.I1,d.I2],[250,150,100]);assert.equal(d.I,d.I1+d.I2);
assert.equal(M.derivation('1',true,true).lu,150);assert.equal(M.derivation('2',true,true).lu,100);
const d2=M.derivation('P',true,false);assert.deepEqual([d2.I,d2.I1,d2.I2],[150,150,0]);assert.equal(M.derivation('P',false,true).lu,0);assert.throws(()=>M.derivation('X',true,true));
/* modèle : loi des tensions en dérivation */
for(const U of [4.5,3])for(const x of ['G','L1','L2'])assert.equal(M.tensionDeriv(x,U),U);assert.throws(()=>M.tensionDeriv('K',4.5));assert.throws(()=>M.tensionDeriv('G',9));
/* dessins : SVG nommés, zéros sans barre, lecture cohérente */
const nomme=s=>/^<svg[^>]*role="img"[^>]*aria-label="[^"]{20,}"/.test(s)||/aria-label="[^"]{20,}"[^>]*role="img"/.test(s.slice(0,600));
const tous=[];
for(const n of [1,2,3])for(const r of ['lampe','moteur'])for(const a of [true,false])tous.push(M.montageNotion(n,r,a),M.schemaNotion(n,r,a));
for(const p of M.POS.map(x=>x[0]))for(const f of [true,false])tous.push(M.montageMesure(p,f,'200mA'),M.schemaMesure(p,f));
for(const p of ['P','1','2'])for(const f of [true,false])for(const l of [true,false])tous.push(M.montageDeriv(p,f,l),M.schemaDeriv(p,f,l));
for(const x of ['G','L1','L2'])for(const U of [4.5,3])tous.push(M.montageTension(x,U),M.schemaTension(x));
for(const s of tous){assert.ok(nomme(s),'dessin nommé : '+s.slice(0,120));assert.ok(!/NaN|undefined/.test(s),'dessin sans valeur manquante');assert.ok(!/[Øø]/.test(s),'zéros sans barre');}
assert.match(M.montageNotion(2,'lampe',true),/100 mA/);assert.ok(!/Ampèremètre</.test(M.montageNotion(2,'lampe',false)),'pas d’appareil sans branchement');
assert.match(M.montageMesure('derivation',true,'200mA'),/ERREUR/);assert.match(M.montageMesure('entre',true,'2A'),/0,06 A/);
assert.match(M.montageDeriv('P',true,true),/250 mA/);assert.match(M.montageDeriv('2',true,false),/dévissée/);assert.match(M.montageTension('L2',3),/3 V/);
/* fiches : structure, une compétence, contexte, aucun code interne */
const CH=['id','titre','niveau','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','objectif','objectifEleve','situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'];
const F=n=>w['FICHE_5E_'+n.replace('-','')];
for(const n of IDS){const f=F(n);assert.ok(f,'fiche '+n);for(const k of CH)assert.ok(f[k]!=null,n+' champ '+k);
  assert.equal(f.id,'NL-5E-'+n);assert.equal(f.niveau,'5e');assert.equal(f.theme,'Mesure de grandeurs physiques');assert.equal(f.prevision.choix.length,4);
  assert.equal(f.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.ok(f.transfert.options.some(o=>o[0]===f.transfert.rep),n+' réponse du transfert');
  assert.ok(f.aides.length>=3&&f.prof.attendus.length>=2&&f.prof.erreurs.length>=2);assert.ok(/Awa|Kofi/.test(f.situation),n+' situation contextualisée');
  assert.ok(!/ et |,/.test(f.competenceVisee.replace(/entre l’intensité dans la branche principale et les intensités dans les branches dérivées/,'')),n+' une seule compétence');
  const txt=JSON.stringify(f).replace(f.id,'');assert.ok(!/NL-C4|NL-CI|NL-5E|(ELE|INT|TEN)-\d\d|Programme du cycle 4|loi d’Ohm/i.test(txt),n+' aucun code interne ni loi d’Ohm');}
/* parcours de manipulation */
function atelier(n){const panel=doc.createElement('div');doc.body.appendChild(panel);const f=F(n),st={essais:[],prevision:null};
  f.manip(panel,{st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(ff,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>f.aides[0]});
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),n+' SVG nommés');
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),n+' montage et schéma côte à côte');
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset').querySelector('legend')),n+' contrôles étiquetés');
  return {f,st,choisir:(k,v)=>{const r=panel.querySelector('input[name="'+k+'"][value="'+v+'"]');assert.ok(r,n+' choix '+k+'='+v);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));},
    lire:()=>panel.querySelector('p[aria-live=polite]').textContent,
    enreg:t=>{panel.querySelector('textarea').value=t==null?'J’observe la valeur lue sur l’appareil.':t;[...panel.querySelectorAll('button')].find(b=>/Enregistrer/.test(b.textContent)).click();}};}
let a=atelier('INT-01');a.enreg('court');assert.equal(a.st.essais.length,0,'observation trop courte refusée');
for(const n of ['1','2','3']){a.choisir('e-n',n);a.enreg();}assert.equal(a.f.peutConfronter(a.st),false,'il faut une mesure à l’ampèremètre');
a.choisir('e-a','oui');assert.match(a.lire(),/150 mA/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);assert.deepEqual(a.st.essais.map(e=>e.i),[null,null,null,150]);
a.choisir('e-r','moteur');assert.match(a.lire(),/moteur tourne vite.*180 mA/);
a=atelier('INT-02');assert.match(a.lire(),/60 mA/);a.enreg();a.choisir('e-b','entre');a.enreg();assert.equal(a.f.peutConfronter(a.st),false);
a.choisir('e-b','derivation');assert.match(a.lire(),/court-circuit/);a.enreg();assert.equal(a.f.peutConfronter(a.st),false);
a.choisir('e-b','apresL2');a.choisir('e-k','ouvert');assert.match(a.lire(),/0 mA \(circuit ouvert\)/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);
a.choisir('e-k','ferme');a.choisir('e-c','2A');assert.match(a.lire(),/0,06 A/);
a=atelier('INT-04');for(const p of ['P','1','2']){a.choisir('e-p',p);a.enreg();}assert.deepEqual(a.st.essais.map(e=>e.i),[250,150,100]);assert.equal(a.f.peutConfronter(a.st),false,'il faut aussi L2 dévissée');
a.choisir('e-l','non');assert.match(a.lire(),/branche de l2 : 0 mA/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);
a=atelier('TEN-01');for(const x of ['G','L1','L2']){a.choisir('e-d',x);assert.match(a.lire(),/4,5 V/);a.enreg();}assert.equal(a.f.peutConfronter(a.st),false,'il faut un second générateur');
a.choisir('e-u','3');assert.match(a.lire(),/: 3 V/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);
/* moteur : écrans, cadre, aucun code interne */
for(const n of IDS){const app=doc.createElement('div');doc.body.appendChild(app);w.Activite.run(F(n),app);
  assert.equal(app.querySelectorAll('[role=tab]').length,6,n+' six écrans');assert.match(app.textContent,/Thème : Mesure de grandeurs physiques/);assert.match(app.textContent,/À la fin de cette partie, je dois être capable de/);
  assert.ok(!/NL-5E|NL-CI/.test(app.textContent),n+' aucun code interne à l’écran');}
/* page, hors-ligne, livre */
const page=read('activites-5e/index.html');assert.match(page,/intensite5e\.js/);const re=new RegExp(page.match(/if\(!\/(.+?)\/\.test\(id\)\)/)[1]);
for(const n of IDS)assert.ok(re.test('NL-5E-'+n),'page : '+n);assert.ok(!re.test('NL-5E-INT-03')&&!re.test('NL-5E-INT-05'),'page : liste blanche stricte');
const sw=read('sw.js');for(const f of ['assets/shared/intensite5e.js',...IDS.map(n=>'assets/activites/fiches/NL-5E-'+n+'.js')])assert.ok(sw.includes("'./"+f+"'"),'hors-ligne : '+f);
const livre=read('assets/livre/livre.js');for(const n of IDS)assert.ok(livre.includes("'NL-5E-"+n+"'"),'livre : '+n);
console.log('Lot 5e Intensité et tension : modèle (notion, mesure en série, lois en dérivation), '+tous.length+' dessins nommés, 4 fiches, parcours, page, hors-ligne et livre contrôlés.');
