/* Lot 5e Pannes et court-circuit (PAN-01 à 03) : modèle NohobaPannes5e, dessins, structure des fiches, parcours, page, hors-ligne et livre. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/activites-5e/',runScripts:'outside-only'}),w=dom.window,doc=w.document;
w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};
const IDS=['PAN-01','PAN-02','PAN-03'];
for(const f of ['assets/shared/atelier-electrique.js','assets/shared/elec5e.js','assets/shared/pannes5e.js','assets/activites/activite.js',...IDS.map(n=>'assets/activites/fiches/NL-5E-'+n+'.js')])w.eval(read(f));
const P=w.NohobaPannes5e;
/* modèle : panne */
let e=P.panne('serie','aucune');assert.ok(e.L1.on&&e.L2.on&&e.L1.k<1);e=P.panne('serie','L1');assert.ok(!e.L1.on&&!e.L2.on);assert.match(e.txt,/L1 : en panne ; L2 : éteinte/);
e=P.panne('derivation','L1');assert.ok(!e.L1.on&&e.L2.on&&e.L2.k===1);e=P.panne('derivation','L2');assert.ok(e.L1.on&&!e.L2.on);assert.throws(()=>P.panne('mixte','L1'));assert.throws(()=>P.panne('serie','L3'));
/* modèle : court-circuit */
e=P.courtCircuit('serie','L1');assert.ok(!e.L1.on&&e.L2.on&&e.L2.k===1&&!e.generateur);assert.ok(P.courtCircuit('serie','aucune').L2.k<e.L2.k,'l’autre lampe brille plus fort');
e=P.courtCircuit('derivation','L2');assert.ok(!e.L1.on&&!e.L2.on&&e.generateur);assert.match(e.txt,/danger/);e=P.courtCircuit('derivation','aucune');assert.ok(e.L1.on&&e.L2.on&&!e.generateur);
/* modèle : besoins */
assert.equal(P.convient('independantes','derivation'),true);assert.equal(P.convient('independantes','serie'),false);assert.equal(P.convient('eclat','derivation'),true);assert.equal(P.convient('temoin','serie'),true);assert.equal(P.convient('temoin','derivation'),false);assert.throws(()=>P.convient('autre','serie'));
/* dessins */
const tous=[];for(const m of ['serie','derivation'])for(const c of ['aucune','L1','L2']){const a=P.vuePanne(m,c),b=P.vueCC(m,c);tous.push(a.montage,a.schema,b.montage,b.schema);}
for(const s of tous){assert.ok(/role="img"/.test(s.slice(0,700))&&/aria-label="[^"]{20,}"/.test(s.slice(0,900)),'dessin nommé');assert.ok(!/NaN|undefined/.test(s));}
assert.match(P.vueCC('serie','L1').montage,/fil ajouté/);assert.match(P.vueCC('derivation','L1').montage,/Générateur en court-circuit/);assert.match(P.vuePanne('serie','L2').montage,/filament coupé/);
/* fiches */
const CH=['id','titre','niveau','theme','chapitre','competenceVisee','objectifsPedagogiques','situationEvaluation','objectif','objectifEleve','situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','retroaction','transfert','critere','manip','grilleMaitrise','peutConfronter','aides','synthese','prof','diagnostic'];
const F=n=>w['FICHE_5E_'+n.replace('-','')];
for(const n of IDS){const f=F(n);assert.ok(f,'fiche '+n);for(const k of CH)assert.ok(f[k]!=null,n+' champ '+k);
  assert.equal(f.id,'NL-5E-'+n);assert.equal(f.niveau,'5e');assert.equal(f.theme,'Électricité');assert.equal(f.prevision.choix.length,4);assert.equal(f.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');
  assert.ok(f.transfert.options.some(o=>o[0]===f.transfert.rep));assert.ok(f.aides.length>=3&&f.prof.attendus.length>=2&&f.prof.erreurs.length>=2);assert.ok(/Awa|Kofi/.test(f.situation));
  const txt=JSON.stringify(f).replace(f.id,'');assert.ok(!/NL-C4|NL-CI|NL-5E|(ELE|PAN)-\d\d|Programme du cycle 4/.test(txt),n+' aucun code interne');}
function atelier(n){const panel=doc.createElement('div');doc.body.appendChild(panel);const f=F(n),st={essais:[],prevision:null};
  f.manip(panel,{st:()=>st,save:()=>{},addEssai:x=>{st.essais.push(x);},tableHTML:(ff,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>f.aides[0]});
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),n+' SVG nommés');
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'));
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset').querySelector('legend')),n+' contrôles étiquetés');
  return {f,st,choisir:(k,v)=>{const r=panel.querySelector('input[name="'+k+'"][value="'+v+'"]');assert.ok(r,n+' '+k+'='+v);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));},
    lire:()=>panel.querySelector('p[aria-live=polite]').textContent,enreg:t=>{panel.querySelector('textarea').value=t==null?'J’observe l’état des deux lampes.':t;[...panel.querySelectorAll('button')].find(b=>/Enregistrer/.test(b.textContent)).click();}};}
let a=atelier('PAN-01');a.enreg('court');assert.equal(a.st.essais.length,0);a.choisir('e-c','L1');assert.match(a.lire(),/L2 : éteinte/);a.enreg();assert.equal(a.f.peutConfronter(a.st),false);
a.choisir('e-m','derivation');assert.match(a.lire(),/L2 : allumée, normalement/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);
a=atelier('PAN-02');a.choisir('e-c','L2');assert.match(a.lire(),/L1 : brille plus fort/);a.enreg();a.choisir('e-m','derivation');assert.match(a.lire(),/générateur est en court-circuit/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);assert.equal(a.st.essais[1].gen,true);
a=atelier('PAN-03');assert.match(a.lire(),/ne respecte pas/);a.enreg();a.choisir('e-m','derivation');assert.match(a.lire(),/respecte le besoin/);a.enreg();assert.equal(a.f.peutConfronter(a.st),false,'deux besoins nécessaires');
a.choisir('e-b','temoin');assert.match(a.lire(),/ne respecte pas/);a.enreg();a.choisir('e-m','serie');a.choisir('e-c','L1');assert.match(a.lire(),/L2 : éteinte\. Ce montage respecte/);a.enreg();assert.equal(a.f.peutConfronter(a.st),true);
for(const n of IDS){const app=doc.createElement('div');doc.body.appendChild(app);w.Activite.run(F(n),app);assert.equal(app.querySelectorAll('[role=tab]').length,6);assert.match(app.textContent,/Thème : Électricité/);assert.ok(!/NL-5E|NL-CI/.test(app.textContent));}
const page=read('activites-5e/index.html');assert.match(page,/pannes5e\.js/);const re=new RegExp(page.match(/if\(!\/(.+?)\/\.test\(id\)\)/)[1]);for(const n of IDS)assert.ok(re.test('NL-5E-'+n));assert.ok(!re.test('NL-5E-PAN-04'));
const sw=read('sw.js');for(const f of ['assets/shared/pannes5e.js',...IDS.map(n=>'assets/activites/fiches/NL-5E-'+n+'.js')])assert.ok(sw.includes("'./"+f+"'"),'hors-ligne : '+f);
const livre=read('assets/livre/livre.js');for(const n of IDS)assert.ok(livre.includes("'NL-5E-"+n+"'"));
console.log('Lot 5e Pannes et court-circuit : modèle (panne, court-circuit, besoins), '+tous.length+' dessins nommés, 3 fiches, parcours, page, hors-ligne et livre contrôlés.');
