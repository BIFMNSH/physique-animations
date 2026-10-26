/* Lot CI · commande, court-circuit, protection et panne (ELE-06, ELE-08 à ELE-16) : modèle qualitatif, structure, parcours complets. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const IDS=['06','08','09','10','11','12','13','14','15','16'];
const CHAP={'06':'Le circuit électrique','08':'Commande d’un circuit','09':'Commande d’un circuit','10':'Commande d’un circuit','11':'Commande d’un circuit','12':'Court-circuit et protection','13':'Court-circuit et protection','14':'Court-circuit et protection','15':'Court-circuit et protection','16':'Court-circuit et protection'};
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function env(){
  const dom=new JSDOM('<!doctype html><body><div id="app"></div></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  for(const f of ['assets/shared/atelier-electrique.js','assets/shared/conductivite-modele.js','assets/shared/commande-protection.js','assets/activites/activite.js'])w.eval(read(f));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-ELE-'+i+'.js'));
  return w;
}
const w=env(),doc=w.document,C=w.NohobaCommande;
function lancer(i){
  const F=w['FICHE_CI_ELE'+i],panel=doc.createElement('div');doc.body.appendChild(panel);
  const st={essais:[],prevision:null};
  const X={st:()=>st,addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
  F.manip(panel,X);return {F,panel,st,X};
}
const choisir=(panel,name,val)=>{const r=panel.querySelector('input[name='+name+'][value="'+val+'"]');assert.ok(r,name+'/'+val);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));};
const label=(panel,k)=>(panel.querySelectorAll('svg')[k]||{getAttribute:()=>''}).getAttribute('aria-label')||'';
const saisir=(panel,txt)=>{panel.querySelector('textarea').value=txt;[...panel.querySelectorAll('button')].find(b=>/Enregistrer mon observation/.test(b.textContent)).click();};
const b=o=>C.etatBoucle(o);

/* ---------- règles physiques du modèle ---------- */
for(const sl of ['slot1','slot2'])for(const f of [true,false]){const o={pile:'ok',lampe:'ok',[sl]:'inter',[sl==='slot1'?'s1':'s2']:{ferme:f}};assert.equal(b(o).lampe,f?'actif':'inactif','ELE-08 '+sl+f);}
for(const [k,ap,att] of [['pousseNO',false,'inactif'],['pousseNO',true,'actif'],['pousseNF',false,'actif'],['pousseNF',true,'inactif']])assert.equal(b({pile:'ok',lampe:'ok',slot1:k,s1:{appui:ap}}).lampe,att,'ELE-09 '+k+ap);
assert.equal(C.etatCommut({pos:1}).L1,'actif');assert.equal(C.etatCommut({pos:1}).L2,'inactif');assert.equal(C.etatCommut({pos:2}).L2,'actif');assert.equal(C.etatCommut({pos:2}).L1,'inactif');
for(const p1 of [1,2])for(const p2 of [1,2])assert.equal(C.etatVV({p1,p2}).lampe,p1===p2?'actif':'inactif','ELE-11 '+p1+p2);
let e=b({pile:'ok',lampe:'ok',slot1:'inter',s1:{ferme:true},planche:true,pont:'fil'});assert.ok(e.courtCircuit&&e.lampe!=='actif'&&e.niveau===3&&e.echauffement==='fort','ELE-12 fil aux bornes de la lampe');
e=b({pile:'ok',lampe:'ok',slot1:'inter',s1:{ferme:true},courtPile:true});assert.ok(e.courtCircuit,'ELE-12 fil aux bornes de la pile');
e=b({pile:'ok',lampe:'ok',slot1:'inter',s1:{ferme:true}});assert.ok(!e.courtCircuit&&e.lampe==='actif'&&e.niveau===0);
for(const [id,cc] of [['clou',true],['piece',true],['cle',true],['mine',true],['fil',true],['gomme',false],['bois',false],['plastique',false],['regle',false],['air',false],[null,false]]){e=b({pile:'ok',lampe:'ok',slot1:'inter',s1:{ferme:true},planche:true,pont:id});assert.equal(e.courtCircuit,cc,'ELE-13 '+id);if(!cc)assert.equal(e.lampe,'actif','ELE-13 lampe '+id);}
for(const d of [1,2,3]){e=b({pile:'ok',lampe:'ok',slot1:'inter',s1:{ferme:true},courtPile:true,duree:d});assert.equal(e.niveau,d,'ELE-14 durée '+d);}
const P=C.protection;
let x=P('aucune','maintenu');assert.ok(x.courtCircuit&&!x.protection&&x.echauffement==='fort');
x=P('fusible','maintenu');assert.ok(!x.courtCircuit&&x.protection.type==='fusible'&&x.lampe!=='actif'&&x.echauffement==='coupe');
x=P('disj','maintenu');assert.ok(!x.courtCircuit&&x.protection.type==='disj'&&x.lampe!=='actif');
assert.equal(P('aucune','retire').lampe,'actif');assert.notEqual(P('fusible','retire').lampe,'actif');assert.notEqual(P('disj','retire').lampe,'actif');
assert.equal(P('fusible','remet').lampe,'actif');assert.equal(P('disj','remet').lampe,'actif');
for(const c of ['pile','lampe','inter','fil']){assert.equal(C.panne(c,'rien').allumee,false,'ELE-16 panne '+c);
  const fix={pile:'pileNeuve',lampe:'lampeNeuve',inter:'interNeuf',fil:'serrer'};
  for(const a of Object.values(fix))assert.equal(C.panne(c,a).allumee,fix[c]===a,'ELE-16 '+c+a);
  assert.equal(C.panne(c,'testLampe').testeur,c!=='lampe');assert.equal(C.panne(c,'testInter').testeur,c!=='inter');assert.equal(C.panne(c,'testFil').testeur,c!=='fil');assert.equal(C.panne(c,'testPile').temoin,c!=='pile');}
e=b({pile:'ok',lampe:'ok',moteur:true,slot1:'inter',s1:{ferme:true}});assert.ok(e.moteur==='actif'&&e.lampe==='actif'&&e.sens===1);
e=b({pile:'ok',lampe:'ok',moteur:true,inverse:true,slot1:'inter',s1:{ferme:true}});assert.ok(e.moteur==='actif'&&e.lampe==='actif'&&e.sens===-1,'ELE-06 : la lampe reste allumée, le moteur tourne à l’envers');
console.log('Lot commande : règles du modèle vérifiées (ELE-06, 08 à 16).');

/* ---------- structure commune ---------- */
for(const i of IDS){
  const F=w['FICHE_CI_ELE'+i];
  assert.equal(F.id,'NL-CI-6E-ELE-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Électricité');assert.equal(F.chapitre,CHAP[i]);
  assert.ok(F.competenceVisee.length>20&&F.objectifsPedagogiques.length>=3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation','critere'])assert.ok(F[k],i+' : '+k);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+i);
  assert.ok(F.aides.length>=3&&F.transfert.expl&&F.prof.reference&&F.prof.attendus.length>=3&&F.prof.erreurs.length>=3);
  const txt=JSON.stringify(F);assert.ok(!/NL-C4|NL-CI-6E-ELE-\d\d ·|Programme du cycle 4/.test(txt.replace(F.id,'')),'aucun code interne '+i);
  assert.ok(!/\d+(,\d+)?\s?(A|mA|°C)\b/.test(F.synthese+F.confrontation),'aucune valeur chiffrée inventée '+i);
  const {panel}=lancer(i);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);
  assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma normalisé '+i);
  assert.ok(panel.querySelectorAll('svg[role=img][aria-label]').length>=2,'noms accessibles '+i);
  assert.ok([...panel.querySelectorAll('input[type=radio]')].every(r=>r.closest('label')&&r.closest('fieldset').querySelector('legend')),'étiquettes des contrôles '+i);
}
console.log('Lot commande : dix fiches structurées, montage et schéma normalisé présents.');

/* ---------- manipulations ---------- */
{const {panel,st}=lancer('06');
  choisir(panel,'ci6-a','normal');assert.ok(label(panel,0).includes('sens des aiguilles d’une montre')&&label(panel,0).includes('lampe'));
  choisir(panel,'ci6-a','inverse');assert.ok(label(panel,0).includes('sens inverse'),'moteur inversé');assert.ok(label(panel,0).includes('allumée'),'lampe allumée');
  assert.ok(panel.querySelector('svg').outerHTML.includes('fill="#C03A2E"')&&label(panel,1).includes('boucle fermée'));
}
{const {panel}=lancer('08');
  for(const e of ['avant','apres'])for(const p of ['ferme','ouvert']){choisir(panel,'ci8-e',e);choisir(panel,'ci8-p',p);assert.ok(label(panel,0).includes(p==='ferme'?'brille':'éteinte'),'ELE-08 '+e+p);assert.ok(label(panel,1).includes(p==='ferme'?'fermée':'ouverte'));}
}
{const {panel}=lancer('09');
  const att={pousseNO:{repos:0,appui:1,relache:0},pousseNF:{repos:1,appui:0,relache:1},inter:{repos:0,appui:1,relache:1}};
  for(const t in att)for(const a in att[t]){choisir(panel,'ci9-t',t);choisir(panel,'ci9-a',a);assert.ok(label(panel,0).includes(att[t][a]?'brille':'éteinte'),'ELE-09 '+t+a);}
}
{const {panel}=lancer('10');
  choisir(panel,'ci10-p','1');assert.ok(label(panel,0).includes('lampe 1 brille')&&label(panel,1).includes('lampe 1'));
  choisir(panel,'ci10-p','2');assert.ok(label(panel,0).includes('lampe 2 brille')&&label(panel,1).includes('lampe 2'));
}
{const {panel}=lancer('11');
  for(const a of ['1','2'])for(const bb of ['1','2']){choisir(panel,'ci11-a',a);choisir(panel,'ci11-b',bb);assert.ok(label(panel,0).includes(a===bb?'brille':'éteinte'),'ELE-11 '+a+bb);assert.ok(label(panel,1).includes(a===bb?'fermée':'ouverte'));}
  assert.ok(!/1-1|2-2/.test(panel.textContent),'tableau non affiché d’avance');
}
{const {panel}=lancer('12');
  choisir(panel,'ci12-f','aucun');assert.ok(label(panel,0).includes('brille'));
  for(const f of ['lampe','pile']){choisir(panel,'ci12-f',f);assert.ok(label(panel,0).includes('court-circuit')&&label(panel,1).includes('court-circuit'),'ELE-12 '+f);}
}
{const {panel}=lancer('13');
  for(const [s,cc] of [['fils',1],['cle',1],['capuchon',0],['gomme',0],['bois',0],['plusieurs',0]]){choisir(panel,'ci13-s',s);assert.ok(label(panel,0).includes(cc?'court-circuit':'brille'),'ELE-13 '+s);}
}
{const {panel}=lancer('14');
  for(const [d,t] of [['0','aucun'],['1','chaud'],['2','très chaud'],['3','fond']]){choisir(panel,'ci14-d',d);assert.ok(panel.querySelector('p[aria-live]').textContent.toLowerCase().includes(t),'ELE-14 '+d);}
}
{const {panel}=lancer('15');
  choisir(panel,'ci15-p','aucune');choisir(panel,'ci15-s','defaut');assert.ok(label(panel,0).includes('court-circuit'));
  choisir(panel,'ci15-p','fusible');assert.ok(label(panel,0).includes('fusible a fondu'));
  choisir(panel,'ci15-p','disj');assert.ok(label(panel,0).includes('disjoncteur s’est déclenché'));
  choisir(panel,'ci15-s','remet');assert.ok(label(panel,0).includes('brille'));
}
{const {panel}=lancer('16');
  const fixe={A:'interNeuf',B:'serrer',C:'pileNeuve',D:'lampeNeuve'};
  for(const c in fixe)for(const a of ['pileNeuve','lampeNeuve','interNeuf','serrer']){choisir(panel,'ci16-c',c);choisir(panel,'ci16-a',a);assert.ok(label(panel,0).includes(a===fixe[c]?'brille':'éteinte'),'ELE-16 '+c+a);}
  choisir(panel,'ci16-c','C');choisir(panel,'ci16-a','testLampe');assert.ok(!/usée|coupé|mal serré|défectueux/.test(label(panel,0)+label(panel,1)),'cause cachée dans les noms accessibles');
  assert.ok(!/usée|coupé|mal serré/.test(panel.querySelector('svg').outerHTML.replace(/<text[^>]*>[^<]*<\/text>/g,'')+panel.querySelector('svg').innerHTML.match(/<text[^>]*>[^<]*<\/text>/g).join('')),'cause cachée dans le dessin');
}
console.log('Lot commande : manipulations contrôlées pour chaque fiche.');

/* ---------- progression ---------- */
const o='observation décrite en une phrase';
const ok=(F,essais)=>F.peutConfronter({essais:essais.map(e=>Object.assign({observation:o},e))});
{const F=w.FICHE_CI_ELE06;assert.equal(ok(F,[]),false);assert.equal(ok(F,[{pile:'normal'}]),false);assert.equal(ok(F,[{pile:'normal'},{pile:'inverse'}]),true);assert.equal(F.peutConfronter({essais:[{pile:'normal',observation:'x'},{pile:'inverse',observation:'x'}]}),false);}
{const F=w.FICHE_CI_ELE08;assert.equal(ok(F,[{emp:'avant',pos:'ferme',allumee:true},{emp:'avant',pos:'ouvert',allumee:false},{emp:'avant',pos:'ferme',allumee:true},{emp:'avant',pos:'ouvert',allumee:false}]),false,'les deux emplacements requis');
  assert.equal(ok(F,[{emp:'avant',allumee:true},{emp:'avant',allumee:false},{emp:'apres',allumee:true},{emp:'apres',allumee:false}]),true);}
{const F=w.FICHE_CI_ELE09;assert.equal(ok(F,[{type:'pousseNO',allumee:true},{type:'pousseNO',allumee:false},{type:'pousseNF',allumee:true},{type:'pousseNF',allumee:false},{type:'pousseNF',allumee:true}]),false,'interrupteur requis');
  assert.equal(ok(F,[{type:'pousseNO',allumee:true},{type:'pousseNO',allumee:false},{type:'pousseNF',allumee:true},{type:'inter',allumee:false},{type:'inter',allumee:true}]),true);}
{const F=w.FICHE_CI_ELE10;assert.equal(ok(F,[{pos:'1'},{pos:'1'},{pos:'1'}]),false);assert.equal(ok(F,[{pos:'1'},{pos:'2'},{pos:'1'}]),true);}
{const F=w.FICHE_CI_ELE11;const all=[['1','1'],['1','2'],['2','1'],['2','2']].map(([p1,p2])=>({p1,p2}));assert.equal(ok(F,all.slice(0,3)),false);assert.equal(ok(F,all),true);}
{const F=w.FICHE_CI_ELE12;assert.equal(ok(F,[{fil:'aucun'},{fil:'lampe'},{fil:'lampe'}]),false);assert.equal(ok(F,[{fil:'aucun'},{fil:'lampe'},{fil:'pile'}]),true);}
{const F=w.FICHE_CI_ELE13;assert.equal(ok(F,[{court:true},{court:true},{court:true},{court:true}]),false);assert.equal(ok(F,[{court:true},{court:false},{court:true},{court:false}]),true);}
{const F=w.FICHE_CI_ELE14;assert.equal(ok(F,[{duree:0},{duree:1},{duree:1}]),false);assert.equal(ok(F,[{duree:0},{duree:1},{duree:3}]),true);}
{const F=w.FICHE_CI_ELE15;const d=['aucune','fusible','disj'].map(prot=>({prot,sit:'defaut'}));assert.equal(ok(F,d.concat([{prot:'fusible',sit:'retire'},{prot:'fusible',sit:'retire'}])),false);assert.equal(ok(F,d.concat([{prot:'fusible',sit:'retire'},{prot:'disj',sit:'remet'}])),true);}
{const F=w.FICHE_CI_ELE16;assert.equal(ok(F,[{circuit:'A',action:'interNeuf',ok:true},{circuit:'A',action:'testPile',ok:true},{circuit:'A',action:'testLampe',ok:true},{circuit:'A',action:'serrer',ok:false}]),false,'une seule panne localisée');
  assert.equal(ok(F,[{circuit:'A',action:'interNeuf',ok:true},{circuit:'B',action:'serrer',ok:true},{circuit:'C',action:'testPile',ok:false},{circuit:'D',action:'testLampe',ok:false}]),true);
  assert.equal(ok(F,[{circuit:'A',action:'testPile',ok:true},{circuit:'B',action:'testLampe',ok:true},{circuit:'C',action:'testInter',ok:true},{circuit:'D',action:'testFil',ok:true}]),false,'un test seul ne localise pas');}
console.log('Lot commande : verrouillage de progression contrôlé.');

/* ---------- parcours complets dans le moteur ---------- */
const TRIALS={'06':[{a:'normal'},{a:'inverse'}],
 '08':[{e:'avant',p:'ferme'},{e:'avant',p:'ouvert'},{e:'apres',p:'ferme'},{e:'apres',p:'ouvert'}],
 '09':[{t:'pousseNO',a:'repos'},{t:'pousseNO',a:'appui'},{t:'pousseNF',a:'appui'},{t:'inter',a:'appui'},{t:'inter',a:'relache'}],
 '10':[{p:'1'},{p:'2'},{p:'1'}],'11':[{a:'1',b:'1'},{a:'1',b:'2'},{a:'2',b:'2'},{a:'2',b:'1'}],
 '12':[{f:'aucun'},{f:'lampe'},{f:'pile'}],'13':[{s:'fils',c:'court'},{s:'cle',c:'court'},{s:'gomme',c:'pas'},{s:'plusieurs',c:'pas'}],
 '14':[{d:'0'},{d:'1'},{d:'3'}],'15':[{p:'aucune',s:'defaut'},{p:'fusible',s:'defaut'},{p:'disj',s:'defaut'},{p:'fusible',s:'retire'},{p:'disj',s:'remet'}],
 '16':[{c:'A',a:'interNeuf'},{c:'B',a:'serrer'},{c:'C',a:'testPile'},{c:'D',a:'testLampe'}]};
for(const i of IDS){
  const win=env(),document=win.document,F=win['FICHE_CI_ELE'+i],app=document.getElementById('app'),key='pc-act-'+F.id;
  const state=()=>JSON.parse(win.localStorage.getItem(key));
  const button=text=>{const bt=[...app.querySelectorAll('button')].find(x=>text==='Vérifier'?x.textContent===text:x.textContent.startsWith(text));assert.ok(bt,'bouton '+text+' '+i);assert.equal(bt.disabled,false,'bouton accessible '+text+' '+i);bt.click();return bt;};
  const radio=(name,value)=>{const r=app.querySelector('input[name="'+name+'"][value="'+value+'"]');assert.ok(r,name+'/'+value);r.checked=true;r.dispatchEvent(new win.Event('change',{bubbles:true}));};
  const set=(id,value)=>{const el=document.getElementById(id);assert.ok(el,id);el.value=value;};
  win.Activite.run(F,app);
  assert.equal(document.getElementById('tab2').disabled,true,'hypothèse requise '+i);
  button('Commencer : ma prévision');button('Enregistrer ma prévision');assert.ok(!state().prevision,'hypothèse vide refusée '+i);
  radio('pc',F.prevision.choix[0][0]);set('pr','Je propose cette hypothèse et je vais la vérifier.');
  button('Enregistrer ma prévision');button('Passer à la manipulation');
  assert.equal(document.getElementById('tab3').disabled,true,'essais requis '+i);
  button('Enregistrer mon observation');assert.equal(state().essais.length,0,'observation vide refusée '+i);
  const N=Number(i);
  for(const trial of TRIALS[i]){
    for(const [name,value] of Object.entries(trial))radio('ci'+N+'-'+name,value);
    set('ci'+N+'-obs','Je décris ce que je vois sur la lampe et sur le montage.');button('Enregistrer mon observation');
  }
  assert.equal(state().essais.length,TRIALS[i].length,'essais enregistrés '+i);
  assert.ok(F.peutConfronter(state()),'contraste suffisant '+i);
  const essais=state().essais.length;
  button('J’ai assez d’essais');button('Enregistrer et passer au bilan');assert.equal(state().confront,null,'analyse vide refusée '+i);
  radio('vd','confirmee');set('pre','Je cite un essai précis et ce que j’ai observé sur la lampe.');set('mod','Je confronte mon hypothèse avec les essais.');button('Enregistrer et passer au bilan');
  set('cc','Je conclus à partir des états observés dans mes essais.');button('Valider ma conclusion');
  set('nl-eval','Je justifie ma réponse à partir des observations du montage.');button('Enregistrer ma réponse');
  radio('tr',String(F.transfert.rep));set('tj','Je justifie mon choix avec le montage.');button('Vérifier ma réponse');
  assert.ok(app.textContent.includes('Exact.'),'transfert juste '+i);
  button('Voir ma trace');assert.ok(app.textContent.includes('Communiquer · Ma trace'),'trace '+i);
  assert.equal(state().essais.length,essais);assert.ok(!/NL-CI|NL-C4/.test(app.textContent),'aucun code interne affiché '+i);
  win.print=()=>{};button('Imprimer');const print=document.getElementById('print');
  assert.ok(print.textContent.includes('Je conclus à partir des états observés'),'conclusion dans la fiche remplie '+i);
  assert.ok(!print.querySelector('.sh-ref'),'corrigé absent de la trace élève '+i);
  app.replaceChildren();win.Activite.run(F,app);assert.ok(app.textContent.includes('Communiquer · Ma trace'),'reprise '+i);
  win.close();
}
console.log('Lot commande : dix parcours complets, saisies invalides, sauvegarde et reprise contrôlés.');

/* ---------- catalogue, pages, hors-ligne ---------- */
const cat=new JSDOM('',{runScripts:'outside-only'}).window;cat.eval(read('assets/catalogues/6e-ci.js'));
const items=cat.NL_CATALOGUE_CI_6E;
for(const i of IDS)assert.equal(items.find(x=>x.sourceId==='ELE-'+i).statut,'prototype','prototype ELE-'+i);
assert.equal(items.find(x=>x.sourceId==='ELE-07').statut,'disponible');
const page=read('activites-ci/index.html');assert.ok(page.includes('commande-protection.js')&&page.includes('ELE-(?:0[1-9]|1[0-7])'));
assert.ok(read('assets/simple/etapes-ci.js').includes('ELE-(?:0[1-9]|1[0-7])'),'page de leçon : mêmes fiches que activites-ci');
const sw=read('sw.js');for(const f of ['commande-protection.js','atelier-electrique.js','conductivite-modele.js','conductivite-circuit.js'])assert.ok(sw.includes(f),'hors-ligne '+f);
for(let n=1;n<=17;n++)assert.ok(sw.includes('NL-CI-6E-ELE-'+String(n).padStart(2,'0')+'.js'),'hors-ligne fiche '+n);
console.log('Lot commande : catalogue, pages et cache hors-ligne contrôlés.');
process.exit(0);
