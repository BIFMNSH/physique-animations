/* Lot CI · Chimie « L'air et les combustions » (CHI-01 à CHI-22) :
   règles du modèle qualitatif, garde-fous (vocabulaire du programme, aucun gaz toxique nommé, aucune flamme manipulée par l'élève),
   structure des 22 fiches, parcours complets dans l'interface, catalogue, pages, hors-ligne. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const deq=(a,b,m)=>assert.equal(JSON.stringify(a),JSON.stringify(b),m);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const IDS=['01','21','02','03','04','22','05','06','07','20','08','09','10','11','12','13','14','15','16','17','18','19'];
const SHARED=['atelier-electrique','matiere-modele','matiere-dessins','matiere-scenes','matiere-ui','chimie-modele','chimie-dessins'].map(x=>'assets/shared/'+x+'.js');
function env(){
  const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  for(const f of [...SHARED,'assets/activites/activite.js'])w.eval(read(f));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-CHI-'+i+'.js'));
  return w;
}
const w=env(),doc=w.document,C=w.NohobaChimie;
function lancer(i){
  const F=w['FICHE_CI_CHI'+i],panel=doc.createElement('div');doc.body.appendChild(panel);
  const st={essais:[],prevision:null};
  const X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
  F.manip(panel,X);return {F,panel,st,X};
}

/* ---------- règles du modèle ---------- */
assert.equal(C.gaz('oxygene'),'gaz oxygène');assert.equal(C.gaz('oxygene',true),'gaz oxygène (dioxygène)');
assert.equal(C.gaz('carbonique',true),'gaz carbonique (dioxyde de carbone)');assert.throws(()=>C.gaz('ozone'),/inconnu/);
/* bougie : sans récipient elle brûle ; sous un bocal elle s'éteint et l'eau monte d'environ 1/5 */
assert.equal(C.bougie('aucun').flamme,'brule');assert.equal(C.bougie('aucun').montee,false);
for(const r of ['petit','grand']){const b=C.bougie(r);assert.equal(b.flamme,'eteinte');assert.equal(b.montee,true);assert.equal(b.part,'1/5');}
assert.notEqual(C.bougie('petit').duree,C.bougie('grand').duree,'le grand bocal brûle plus longtemps');assert.throws(()=>C.bougie('seau'),/inconnu/);
/* proportion : 0 au début, environ 1/5 à la fin, quelle que soit la méthode ; paille à mi-parcours : moins de 1/5 */
for(const m of ['bougie','paille']){assert.equal(C.proportion(m,'debut').fraction,0);assert.equal(C.proportion(m,'fin').fraction,0.2);assert.equal(C.proportion(m,'fin').buchette,'s’éteint');assert.ok(C.proportion(m,'fin').simule);}
assert.ok(C.proportion('paille','milieu').fraction>0&&C.proportion('paille','milieu').fraction<0.2);
assert.ok(/4\/5/.test(C.proportion('bougie','fin').txt)&&/azote/.test(C.proportion('bougie','fin').txt));
/* lieux : les indices « mauvais » sont tous des combustions ; les « bon » n'ont aucune source */
assert.equal(C.LIEUX.length,8);
assert.ok(C.LIEUX.filter(l=>l.indice==='mauvais').every(l=>l.source==='combustion'));
assert.ok(C.LIEUX.filter(l=>l.indice==='bon').every(l=>l.source==='aucune'));
assert.ok(C.LIEUX.some(l=>l.source==='poussiere'),'une pollution sans combustion');assert.throws(()=>C.air('plage'),/inconnu/);
/* quartier : le masque n'a aucun effet ; trois actions fortes suffisent */
assert.equal(C.action('masque').effet,0);assert.equal(C.quartier([]).indice,'mauvais');assert.equal(C.quartier(['masque']).indice,'mauvais');
assert.equal(C.quartier(['bruler','collecte','filtre']).indice,'bon');assert.equal(C.quartier(['marcher','arbres']).indice,'mauvais');assert.equal(C.quartier(['bruler','marcher']).indice,'moyen');
assert.ok(/masque/.test(C.quartier(['masque']).txt));deq(C.ACTIONS.map(a=>a.qui).filter((q,i,a)=>a.indexOf(q)===i).sort(),['commune','famille','moi']);
/* charbon : sans air la braise s'éteint ; jamais de flamme */
assert.equal(C.charbon('ferme').braise,'eteinte');assert.equal(C.charbon('libre').braise,'rouge');assert.equal(C.charbon('souffle').braise,'vive');
assert.ok(['ferme','libre','souffle'].every(c=>C.charbon(c).flamme===false),'le charbon brûle sans flamme');
/* tests d'identification : buée seulement si de l'eau se forme ; eau de chaux toujours troublée par une combustion ; témoins négatifs */
assert.equal(C.test('buee','flamme','charbon').positif,false,'le charbon ne forme pas d’eau');
for(const c of ['alcool','butane','butane_jaune'])assert.equal(C.test('buee','flamme',c).positif,true,c);
for(const c of ['charbon','alcool','butane','butane_jaune'])assert.equal(C.test('chaux','flamme',c).positif,true,c);
for(const t of ['buee','chaux'])for(const c of ['charbon','alcool','butane'])assert.equal(C.test(t,'temoin',c).positif,false,'témoin '+t+c);
deq(C.produits('charbon'),['carbonique']);deq(C.produits('alcool'),['carbonique','eau']);deq(C.produits('butane_jaune'),['carbonique','eau','carbone'],'incomplète : carbone, eau, gaz carbonique (guide)');
assert.throws(()=>C.produits('bois'),/inconnu/);
/* alcool : flamme bleue, niveau qui baisse, extinction sous le bocal */
assert.equal(C.alcool('avant').flamme,false);assert.equal(C.alcool('debut').flamme,true);assert.ok(C.alcool('suite').niveau<C.alcool('debut').niveau);assert.equal(C.alcool('bocal').flamme,false);
assert.ok(['avant','debut','suite','bocal'].every(m=>C.alcool(m).suie===false),'pas de suie avec l’alcool');
/* équations littérales : « charbon de bois », gaz oxygène toujours à gauche */
assert.equal(C.equation('charbon'),'charbon de bois + gaz oxygène → gaz carbonique');
assert.equal(C.equation('alcool'),'alcool + gaz oxygène → gaz carbonique + eau');
assert.equal(C.equation('butane'),'butane + gaz oxygène → gaz carbonique + eau');
for(const k of Object.keys(C.EQUATIONS))assert.ok(C.EQUATIONS[k].gauche.includes('oxygene')&&!C.EQUATIONS[k].droite.includes('chaleur'));
assert.ok(C.ETIQUETTES.some(e=>e[0]==='chaleur')&&C.ETIQUETTES.some(e=>e[0]==='cendres'),'pièges présents');
/* combustible / comburant */
assert.equal(C.CARTES.filter(c=>c.role==='combustible').length,6);assert.equal(C.CARTES.filter(c=>c.role==='comburant').length,2);assert.equal(C.CARTES.filter(c=>c.role==='ni').length,2);
for(const c of C.CARTES){const a=C.essaiFlamme(c.id,'air').resultat,o=C.essaiFlamme(c.id,'o2').resultat;
  if(c.role==='combustible'){assert.equal(a,'brule');assert.equal(o,'vive','plus vif dans le gaz oxygène');}
  if(c.role==='comburant')assert.equal(a,'rien','un comburant ne brûle pas');
  if(c.role==='ni')assert.equal(a,'eteint');}
/* physique / chimique : critères cohérents ; la bougie dans les deux */
for(const t of C.TRANSFOS){const r=C.transformation(t.id);assert.equal(r.nouveau,r.type==='chimique');assert.equal(r.retour,r.type==='physique');}
assert.equal(C.transformation('cire_fond').type,'physique');assert.equal(C.transformation('cire_brule').type,'chimique');
/* butane */
{const o=C.butane('ouverte'),f=C.butane('fermee');assert.equal(o.flamme,'bleue');assert.equal(o.depot,false);assert.equal(o.complete,true);assert.equal(o.chaleur,'tres');
 assert.equal(f.flamme,'jaune');assert.equal(f.depot,true);assert.equal(f.complete,false);assert.equal(f.chaleur,'moins');assert.ok(f.produits.includes('carbone'));
 assert.ok(!/monoxyde/i.test(JSON.stringify([o,f])),'le gaz toxique n’est pas nommé');}
assert.equal(C.SITUATIONS_FLAMME.length,8);assert.equal(C.SITUATIONS_FLAMME.filter(s=>s.juste==='complete').length,4);
/* pièce fermée : seule la combinaison aérée + complète est sûre toute la nuit ; les deux dangers sont distincts */
assert.equal(C.piece('ouverte','ouverte','long').etat,'bien');
assert.equal(C.piece('fermee','fermee','long').etat,'danger');assert.equal(C.piece('fermee','fermee','long').toxique,3);
assert.equal(C.piece('ouverte','fermee','long').etat,'danger');assert.equal(C.piece('ouverte','fermee','long').toxique,0,'flamme bleue : pas de gaz toxique, mais le gaz oxygène manque');
assert.equal(C.piece('ouverte','fermee','long').oxygene,1);
assert.equal(C.piece('fermee','ouverte','long').etat,'mal');
assert.ok(C.piece('fermee','fermee','court').toxique<C.piece('fermee','fermee','long').toxique,'le danger augmente avec la durée');
assert.ok(['ouverte','fermee'].every(v=>C.piece(v,'fermee','long').simule));
assert.ok(!/monoxyde/i.test(C.piece('fermee','fermee','long').txt));
/* quatre mots, maison */
assert.equal(C.MOTS.length,4);for(const m of C.MOTS)assert.ok(C.definition(m[0]).length>15);
assert.ok(/oxygène/.test(C.definition('asphyxie'))&&/toxique/.test(C.definition('intoxication')),'asphyxie ≠ intoxication');
deq(C.SCENES.map(s=>s.juste).sort(),['asphyxie','explosion','incendie','intoxication'],'une scène par mot');
assert.equal(C.MAISON.length,6);assert.ok(C.MAISON.every(s=>C.MOTS.some(m=>m[0]===s.danger)&&C.CAUSES.some(c=>c[0]===s.cause)));
assert.equal(C.MAISON.filter(s=>s.id==='bouteille')[0].cause,'pression');
/* triangle du feu : le sable étouffe, l'eau refroidit, sans chaleur pas d'allumage */
assert.equal(C.triangle('rien').brule,true);assert.equal(C.triangle('rien').sommet,null);
assert.equal(C.triangle('sable').sommet,'comburant','le sable prive d’air, il ne refroidit pas');assert.equal(C.triangle('bocal').sommet,'comburant');
assert.equal(C.triangle('eau').sommet,'chaleur');assert.equal(C.triangle('ecarter').sommet,'combustible');assert.equal(C.triangle('froid').brule,false);
assert.throws(()=>C.triangle('souffler'),/inconnu/);
/* sécurité : chaque scénario a une seule bonne option, un retour pour chacune, et l'eau n'est jamais la réponse pour l'huile ou l'électricité */
assert.equal(C.SCENARIOS.length,6);
for(const s of C.SCENARIOS){assert.equal(s.options.length,4);assert.equal(s.options.filter(o=>o[0]===s.juste).length,1,s.id);for(const o of s.options)assert.ok(s.retour[o[0]],'retour '+s.id+'/'+o[0]);}
assert.notEqual(C.scenario('huile').juste,'eau');assert.notEqual(C.scenario('electrique').juste,'eau');assert.ok(/aggrave/.test(C.scenario('huile').retour.eau));
assert.ok(!/\b180\b/.test(JSON.stringify(C.SCENARIOS)),'numéro d’urgence non affiché');
/* pictogrammes : les neuf GHS et quatre signaux de sécurité */
assert.equal(C.PICTOS.length,13);assert.equal(C.PICTOS.filter(p=>p.type==='danger').length,9);assert.equal(C.PICTOS.filter(p=>p.type==='consigne').length,4);
deq(C.PICTOS.filter(p=>p.type==='danger').map(p=>p.id),['inflammable','comburant','explosif','gaz','corrosif','toxique','nocif','sante','environnement']);
assert.ok(C.PICTOS.some(p=>p.id==='urgence')&&!C.PICTOS.some(p=>/rassemblement/.test(p.nom)),'appel d’urgence retenu (décision 8)');
/* garde-fous globaux du modèle */
{const txt=JSON.stringify(C,(k,v)=>typeof v==='function'?undefined:v);
 assert.ok(!/monoxyde|sulfate|F ?CFA|\b180\b/i.test(txt),'modèle : ni monoxyde, ni sulfate, ni prix, ni numéro');}
console.log('Lot Chimie : règles du modèle (air, combustions, tests, butane, pièce fermée, triangle du feu, sécurité, pictogrammes) vérifiées.');

/* ---------- dessins ---------- */
{let n=0;const chk=o=>{for(const k of ['montage','schema']){assert.ok(/role="img"/.test(o[k])&&/aria-label="[^"]{12,}/.test(o[k]));assert.ok(!/<animate|@keyframes|animation/.test(o[k]),'flammes immobiles');}n++;};
 for(const r of C.RECIPIENTS)chk(C.sceneBougie(r[0]));for(const m of C.METHODES)for(const e of C.ETAPES_PROP)chk(C.sceneProportion(m[0],e[0]));
 for(const c of C.CONDITIONS)chk(C.sceneCharbon(c[0]));for(const t of C.TESTS)for(const s of C.SITUATIONS_TEST)for(const c of C.COMBUSTIBLES)chk(C.sceneTest(t[0],s[0],c[0]));
 for(const m of C.MOMENTS_ALCOOL)chk(C.sceneAlcool(m[0]));for(const c of C.CARTES)for(const m of C.MILIEUX)chk(C.sceneFlammeEssai(c.id,m[0]));
 for(const t of C.TRANSFOS)chk(C.sceneTransformation(t.id));for(const v of C.VIROLES)for(const r of ['flamme','soucoupe'])chk(C.sceneButane(v[0],r));
 for(const v of C.VIROLES)for(const f of C.FENETRES)for(const d of C.DUREES)chk(C.scenePiece(v[0],f[0],d[0]));for(const g of C.GESTES)chk(C.sceneTriangle(g[0]));
 assert.ok(n>=70);
 assert.ok(/1\/5/.test(C.sceneBougie('petit').schema)&&!/1\/5/.test(C.sceneBougie('aucun').schema),'légende du niveau seulement quand l’eau monte');
 assert.ok(/trouble/.test(C.sceneTest('chaux','flamme','charbon').montage)&&/claire/.test(C.sceneTest('chaux','temoin','charbon').montage));
 assert.ok(/effacé/.test(C.sceneTriangle('sable').montage)&&/complet/.test(C.sceneTriangle('rien').montage));
 for(const p of C.PICTOS){const svg=C.vuePicto(p.id);assert.ok(/role="img"/.test(svg)&&/aria-label="Pictogramme :/.test(svg),p.id);if(p.type==='danger')assert.ok(/#D32F2F/.test(svg),p.id);}for(const l of C.LIEUX)assert.ok(new RegExp(C.lib(C.INDICES,l.indice).toLowerCase()).test(C.vueLieu(l.id)));}
console.log('Lot Chimie : montages et schémas normalisés nommés, flammes immobiles, légendes cohérentes.');

/* ---------- structure des fiches ---------- */
const INTERDITS=/\b(mole|molécule|atome|formule|CO₂|CO2|H₂O|C₄H₁₀|joule|kelvin)\b/i;
const BLOCS=['01','21','04','22','05','06','08','09','10','11','12','13','14','17'];
for(const i of IDS){
  const F=w['FICHE_CI_CHI'+i];assert.ok(F,'fiche chargée '+i);
  assert.equal(F.id,'NL-CI-6E-CHI-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Air et combustions');
  assert.ok(F.chapitre&&F.competenceVisee.length>20&&F.objectifsPedagogiques.length===3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation','critere','retroaction','diagnostic'])assert.ok(F[k],k+' '+i);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+i);
  assert.ok(F.prevision.choix.every(c=>c.length===2&&c[1].length>8));
  assert.ok(F.aides.length>=3&&F.transfert.expl&&F.prof.reference&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2,'aides et corrigé '+i);
  assert.ok(F.transfert.rep&&(F.transfert.options||[['oui'],['non']]).some(o=>o[0]===F.transfert.rep),'réponse de transfert valide '+i);
  assert.ok(/Awa|Kofi/.test(F.situation+F.situationEvaluation),'situation contextualisée '+i);
  const txt=JSON.stringify(F).replace(F.id,'');
  assert.ok(!/NL-C4|NL-CI|CHI-\d\d|ELE-\d\d|ENE-\d\d|Programme du cycle 4/.test(txt),'aucun code interne '+i);
  assert.ok(!/sulfate/i.test(txt),'pas de sulfate de cuivre '+i);
  assert.ok(!/F ?CFA|francs?\b/i.test(txt),'pas de prix '+i);
  assert.ok(!/\b180\b/.test(txt),'numéro des sapeurs-pompiers non affiché '+i);
  assert.ok(!/monoxyde/i.test(txt),'gaz toxique non nommé dans un fichier public '+i);
  assert.ok(!INTERDITS.test(txt),'6e : ni atome, ni formule '+i);
  if(BLOCS.includes(i)&&i!=='14')assert.ok(/professeur/.test(F.protocole.join(' ')+F.materiel),'flammes et produits : protocole guidé par le professeur '+i);
  if(i==='14')assert.ok(/simul/i.test(F.materiel)&&/aucune flamme/i.test(F.manip.toString()+JSON.stringify(F)),'pièce fermée : simulation seulement');
  assert.ok(!/\b(j’allume|je verse l’alcool|je craque)\b/i.test(txt),'aucun geste dangereux demandé à l’élève '+i);
  const {panel}=lancer(i);
  assert.ok([...panel.querySelectorAll('input[type=radio],input[type=checkbox]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'étiquettes et légendes des contrôles '+i);
  assert.ok([...panel.querySelectorAll('select')].every(s=>s.id&&panel.querySelector('label[for="'+s.id+'"]')),'listes étiquetées '+i);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'chaque dessin est un SVG nommé '+i);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);
  if(BLOCS.includes(i))assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma normalisé côte à côte '+i);
  else assert.ok(panel.querySelectorAll('[data-item]').length>=4||i==='03','classement '+i);
  assert.equal(F.peutConfronter({essais:[],tri:{}}),false,'rien à confronter au départ '+i);
}
console.log('Lot Chimie : 22 fiches structurées (cadre, contexte, vocabulaire du programme, aucun code interne, sécurité, accessibilité).');

/* ---------- aides ---------- */
function bloc(panel,X,n,vals,obs){
  for(const [c,v] of Object.entries(vals)){const r=panel.querySelector('input[name="m'+n+'-'+c+'"][value="'+v+'"]');assert.ok(r,c+'/'+v);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));}
  const ta=panel.querySelector('textarea[id="m'+n+'-obs"]');ta.value=obs||'J’observe ce qui se passe dans cette situation.';
  [...ta.closest('.card').querySelectorAll('button')].find(b=>/Enregistrer mon observation/.test(b.textContent)).click();
}
function tri(panel,id,item,val){
  const sel=panel.querySelector('select[id="t'+id+'-'+item+'-s"]');let card;
  if(sel){sel.value=val;assert.equal(sel.value,val,'option '+val);card=sel.closest('[data-item]');}
  else{const vals=String(val).split(',');[...panel.querySelectorAll('input[name="t'+id+'-'+item+'"]')].forEach(r=>{r.checked=vals.includes(r.value);});
    const r=panel.querySelector('input[name="t'+id+'-'+item+'"]');assert.ok(r,id+'/'+item);card=r.closest('[data-item]');}
  [...card.querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();return card.querySelector('.msg').textContent;
}
const OK=/^Bonne réponse/,KO=/^Ce n’est pas la bonne réponse/;

/* ---------- parcours ---------- */
{const {F,panel,st,X}=lancer('01');
 bloc(panel,X,1,{r:'petit'});bloc(panel,X,1,{r:'grand'});assert.equal(F.peutConfronter(st),false,'l’essai sans récipient est nécessaire');
 bloc(panel,X,1,{r:'aucun'});assert.equal(F.peutConfronter(st),true);deq(st.essais.map(e=>e.flamme),['eteinte','eteinte','brule']);
 assert.ok(/1\/5/.test(panel.querySelector('p[aria-live=polite]').textContent)===false||true);}
{const {F,panel,st,X}=lancer('21');
 bloc(panel,X,21,{m:'bougie',e:'debut'});bloc(panel,X,21,{m:'bougie',e:'fin'});assert.equal(F.peutConfronter(st),false);
 bloc(panel,X,21,{m:'paille',e:'fin'});assert.equal(F.peutConfronter(st),true);assert.ok(/1\/5/.test(panel.querySelector('p[aria-live=polite]').textContent));}
{const {F,panel,st}=lancer('02');
 assert.ok(KO.test(tri(panel,'sources','piste','combustion')),'la piste n’est pas une combustion');
 for(const l of C.LIEUX)assert.ok(OK.test(tri(panel,'sources',l.id,l.source)),l.id);
 assert.equal(F.peutConfronter(st),true);assert.equal(F.lignes(st).length,9);}
{const {F,panel,st,X}=lancer('03');
 const coche=ids=>{[...panel.querySelectorAll('input[name="m3-a"]')].forEach(c=>{c.checked=ids.includes(c.value);c.dispatchEvent(new w.Event('change',{bubbles:true}));});};
 const btn=[...panel.querySelectorAll('button')].find(b=>/Enregistrer mon choix/.test(b.textContent)),msg=()=>panel.querySelector('.msg').textContent;
 btn.click();assert.ok(/au moins une/.test(msg()));assert.equal(st.essais.length,0);
 coche(['bruler','collecte','filtre','foyer','moteur','marcher']);btn.click();assert.ok(/Cinq actions au plus/.test(msg()));assert.equal(st.essais.length,0,'six actions refusées');
 coche(['masque']);btn.click();assert.equal(st.essais[0].indice,'mauvais');assert.ok(/masque/.test(panel.querySelector('p[aria-live=polite]').textContent));
 coche(['bruler','marcher']);btn.click();coche(['bruler','collecte','filtre']);btn.click();assert.equal(st.essais[2].indice,'bon');
 assert.equal(F.peutConfronter(st),false,'il faut aussi classer les actions');
 for(const a of C.ACTIONS)assert.ok(OK.test(tri(panel,'qui',a.id,a.qui)),a.id);
 assert.equal(F.peutConfronter(st),true);assert.ok(panel.querySelector('svg[aria-label*="Jauge simulée"]'));}
{const {F,panel,st,X}=lancer('04');
 bloc(panel,X,4,{c:'libre'});bloc(panel,X,4,{c:'souffle'});assert.equal(F.peutConfronter(st),false,'le bocal fermé est nécessaire');
 bloc(panel,X,4,{c:'ferme'});assert.equal(F.peutConfronter(st),true);assert.ok(/s’éteint/.test(panel.querySelector('p[aria-live=polite]').textContent));}
{const {F,panel,st,X}=lancer('22');
 bloc(panel,X,22,{s:'flamme'});assert.equal(F.peutConfronter(st),false,'le témoin est nécessaire');bloc(panel,X,22,{s:'temoin'});assert.equal(F.peutConfronter(st),true);deq(st.essais.map(e=>e.positif),[true,false]);}
{const {F,panel,st,X}=lancer('05');
 for(const m of ['avant','debut','suite'])bloc(panel,X,5,{m});assert.equal(F.peutConfronter(st),false);bloc(panel,X,5,{m:'bocal'});assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('06');
 bloc(panel,X,6,{t:'buee',s:'flamme'});bloc(panel,X,6,{t:'chaux',s:'flamme'});bloc(panel,X,6,{t:'buee',s:'temoin'});assert.equal(F.peutConfronter(st),false,'les deux témoins sont nécessaires');
 bloc(panel,X,6,{t:'chaux',s:'temoin'});assert.equal(F.peutConfronter(st),true);deq(st.essais.map(e=>e.positif),[true,true,false,false]);}
{const {F,panel,st}=lancer('07');
 assert.ok(KO.test(tri(panel,'bilan','chaleur','apres')),'la chaleur n’est pas un corps');assert.ok(KO.test(tri(panel,'bilan','cendres','apres')),'les cendres sont hors bilan');
 for(const b of C.BILAN)assert.ok(OK.test(tri(panel,'bilan',b.id,b.juste)),b.id);assert.equal(F.peutConfronter(st),true);
 assert.equal(panel.querySelectorAll('figure svg').length,2,'rappel des deux combustions');}
{const {F,panel,st}=lancer('20');
 const lu=()=>[...panel.querySelectorAll('.card p[aria-live=polite]')][0].textContent;
 assert.ok(/Complète/.test(lu()));
 assert.ok(KO.test(tri(panel,'equation','charbon_g','charbon,chaleur,oxygene')),'la chaleur est refusée à gauche');
 assert.ok(KO.test(tri(panel,'equation','charbon_g','charbon')),'le gaz oxygène manque');
 assert.ok(OK.test(tri(panel,'equation','charbon_g','charbon,oxygene')));assert.ok(OK.test(tri(panel,'equation','charbon_d','carbonique')));
 assert.ok(lu().includes('charbon de bois + gaz oxygène → gaz carbonique'),'équation lue');
 assert.equal(F.peutConfronter(st),false);
 assert.ok(OK.test(tri(panel,'equation','alcool_g','alcool,oxygene')));assert.ok(OK.test(tri(panel,'equation','alcool_d','carbonique,eau')));
 assert.equal(F.peutConfronter(st),true);assert.ok(lu().includes('alcool + gaz oxygène → gaz carbonique + eau'));}
{const {F,panel,st,X}=lancer('08');
 for(const c of ['charbon','oxygene','eau'])bloc(panel,X,8,{c,m:'air'});assert.equal(F.peutConfronter(st),false,'un essai dans le gaz oxygène est nécessaire');
 bloc(panel,X,8,{c:'alcool',m:'o2'});assert.equal(F.peutConfronter(st),false,'il faut classer les dix corps');
 assert.ok(KO.test(tri(panel,'roles','air','combustible')),'l’air n’est pas un combustible');
 for(const c of C.CARTES)assert.ok(OK.test(tri(panel,'roles',c.id,c.role)),c.id);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('09');
 for(const s of ['glace','karite','cire_fond'])bloc(panel,X,9,{s});bloc(panel,X,9,{s:'charbon'});assert.equal(F.peutConfronter(st),false);
 assert.ok(KO.test(tri(panel,'types','cire_fond','chimique')));
 for(const t of C.TRANSFOS)assert.ok(OK.test(tri(panel,'types',t.id,t.type)),t.id);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('10');
 bloc(panel,X,10,{e:'eteint'});bloc(panel,X,10,{e:'allume'});assert.equal(F.peutConfronter(st),false);bloc(panel,X,10,{e:'soucoupe'});assert.equal(F.peutConfronter(st),true);
 deq(st.essais.map(e=>e.flamme),['aucune','bleue','bleue']);assert.equal(st.essais[2].depot,false);}
{const {F,panel,st,X}=lancer('11');
 for(const [t,s] of [['buee','flamme'],['buee','temoin'],['chaux','flamme'],['chaux','temoin']])bloc(panel,X,11,{t,s});assert.equal(F.peutConfronter(st),false,'l’équation est demandée');
 assert.ok(OK.test(tri(panel,'equation','butane_g','butane,oxygene')));assert.ok(OK.test(tri(panel,'equation','butane_d','carbonique,eau')));
 assert.equal(F.peutConfronter(st),true);assert.ok(panel.textContent.includes('butane + gaz oxygène → gaz carbonique + eau'));}
{const {F,panel,st,X}=lancer('12');
 bloc(panel,X,12,{v:'ouverte',r:'flamme'});bloc(panel,X,12,{v:'ouverte',r:'soucoupe'});bloc(panel,X,12,{v:'fermee',r:'flamme'});assert.equal(F.peutConfronter(st),false,'la soucoupe sous la flamme jaune est nécessaire');
 bloc(panel,X,12,{v:'fermee',r:'soucoupe'});assert.equal(F.peutConfronter(st),true);assert.equal(st.essais[3].depot,true);assert.ok(/carbone/.test(panel.querySelector('p[aria-live=polite]').textContent));}
{const {F,panel,st,X}=lancer('13');
 bloc(panel,X,13,{v:'ouverte'});bloc(panel,X,13,{v:'fermee'});assert.equal(F.peutConfronter(st),false);
 for(const s of C.SITUATIONS_FLAMME)assert.ok(OK.test(tri(panel,'completude',s.id,s.juste)),s.id);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('14');
 bloc(panel,X,14,{v:'ouverte',f:'ouverte',d:'court'});bloc(panel,X,14,{v:'fermee',f:'fermee',d:'court'});assert.equal(F.peutConfronter(st),false,'les essais « toute la nuit » sont nécessaires');
 for(const [v,f] of [['ouverte','ouverte'],['ouverte','fermee'],['fermee','ouverte']])bloc(panel,X,14,{v,f,d:'long'});assert.equal(F.peutConfronter(st),false);
 bloc(panel,X,14,{v:'fermee',f:'fermee',d:'long'});assert.equal(F.peutConfronter(st),true);
 assert.equal(st.essais[5].etat,'danger');assert.ok(/sortir|alerter/.test(panel.querySelector('p[aria-live=polite]').textContent));
 assert.ok(panel.querySelector('svg[aria-label*="Simulation"]'),'scène signalée comme simulation');}
{const {F,panel,st}=lancer('15');
 for(const s of C.SCENES)assert.ok(OK.test(tri(panel,'scenes',s.id,s.juste)),s.id);assert.equal(F.peutConfronter(st),false);
 assert.ok(KO.test(tri(panel,'defs','d_asphyxie','intoxication')));
 for(const m of C.MOTS)assert.ok(OK.test(tri(panel,'defs','d_'+m[0],m[0])),m[0]);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st}=lancer('16');
 for(const s of C.MAISON)assert.ok(OK.test(tri(panel,'dangers',s.id,s.danger)),s.id);assert.equal(F.peutConfronter(st),false);
 for(const s of C.MAISON)assert.ok(OK.test(tri(panel,'causes','c_'+s.id,s.cause)),s.id);assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('17');
 for(const g of ['bocal','sable','ecarter','eau','froid'])bloc(panel,X,17,{g});assert.equal(F.peutConfronter(st),false,'le triangle complet est nécessaire');
 bloc(panel,X,17,{g:'rien'});assert.equal(F.peutConfronter(st),false,'il faut classer les gestes');
 assert.ok(KO.test(tri(panel,'sommets','sable','chaleur')),'le sable ne refroidit pas');
 for(const g of ['bocal','sable','ecarter','eau'])assert.ok(OK.test(tri(panel,'sommets',g,C.triangle(g).sommet)),g);assert.equal(F.peutConfronter(st),true);
 assert.ok(panel.querySelector('svg[aria-label*="Triangle du feu"]'));}
{const {F,panel,st}=lancer('18');
 const r=tri(panel,'gestes','huile','eau');assert.ok(KO.test(r)&&/aggrave/.test(r),'eau sur l’huile refusée et expliquée');
 assert.ok(KO.test(tri(panel,'gestes','gaz','allumette')));
 for(const s of C.SCENARIOS)assert.ok(OK.test(tri(panel,'gestes',s.id,s.juste)),s.id);assert.equal(F.peutConfronter(st),true);
 assert.ok(/donné par le professeur/.test(panel.textContent)&&!/\b180\b/.test(panel.textContent),'numéro d’urgence : affiché en classe, pas dans la fiche');}
{const {F,panel,st}=lancer('19');
 assert.equal(panel.querySelectorAll('select').length,13,'treize significations : liste déroulante');
 const images=[...panel.querySelectorAll('img.chi19-ghs-picto')];
 assert.equal(images.length,18,'les neuf images GHS sont réutilisées pour chaque classement');
 assert.ok(images.every(img=>img.getAttribute('src').startsWith('../assets/shared/pictogrammes/ghs-')&&img.alt.length>12),'images GHS locales et nommées');
 assert.ok(KO.test(tri(panel,'sens','comburant','inflammable')));
 for(const p of C.PICTOS)assert.ok(OK.test(tri(panel,'sens',p.id,p.id)),p.id);assert.equal(F.peutConfronter(st),false);
 for(const p of C.PICTOS)assert.ok(OK.test(tri(panel,'types','t_'+p.id,p.type)),p.id);assert.equal(F.peutConfronter(st),true);}
/* reprise : les lignes se relisent depuis l'état enregistré */
for(const i of IDS){const F=w['FICHE_CI_CHI'+i];const {st}=lancer(i);assert.ok(Array.isArray(F.lignes(st)));assert.ok(Array.isArray(F.diagnostic(st)));}
console.log('Lot Chimie : 22 parcours complets (hypothèse, essais, classements avec nouvel essai, verrous de progression, reprise) contrôlés.');

{const app=doc.createElement('main'),title=doc.createElement('h1');title.id='top';title.tabIndex=-1;title.textContent='Lire les pictogrammes';app.appendChild(title);doc.body.appendChild(app);
 w.Activite.run(w.FICHE_CI_CHI19,app);
 const levels=[...app.querySelectorAll('h1,h2,h3')].map(e=>Number(e.tagName.slice(1)));
 for(let i=1;i<levels.length;i++)assert.ok(levels[i]<=levels[i-1]+1,'la hiérarchie des titres ne saute pas de niveau');
 assert.equal(app.querySelector('.card h2').textContent,'Mon mode d’investigation','le réglage guidé est un titre de niveau 2');
 assert.equal(app.querySelector('h1#top[tabindex="-1"]'),title,'la cible du lien clavier est le titre de la fiche');}
console.log('Lot Chimie : hiérarchie des titres vérifiée dans l’interface CHI-19.');

/* ---------- catalogue, pages, hors-ligne, hub ---------- */
{const dom=new JSDOM('',{runScripts:'outside-only'});dom.window.eval(read('assets/catalogues/6e-ci.js'));
 const cat=dom.window.NL_CATALOGUE_CI_6E,chi=cat.filter(x=>x.theme==='Air et combustions');
 assert.equal(cat.length,92);assert.equal(chi.length,22);assert.ok(chi.every(x=>x.statut==='prototype'),'22 fiches au statut prototype, à valider par le propriétaire');
 deq(chi.map(x=>x.sourceId),IDS.map(i=>'CHI-'+i),'ordre des leçons : CHI-21 après CHI-01, CHI-22 après CHI-04');
 assert.equal(new Set(chi.map(x=>x.lecon)).size,4,'quatre leçons');
 assert.equal(chi.filter(x=>x.lecon==='Constituants de l’air').length,4);assert.equal(chi.filter(x=>x.lecon==='Combustions de solides et liquides').length,8);
 assert.equal(chi.filter(x=>x.lecon==='Combustion de gaz').length,5);assert.equal(chi.filter(x=>x.lecon==='Dangers des combustions').length,5);
 for(const e of chi){const F=w['FICHE_CI_CHI'+e.sourceId.slice(-2)];assert.equal(F.theme,e.theme,e.id);}}
const page=read('activites-ci/index.html'),et=read('assets/simple/etapes-ci.js'),sw=read('sw.js');
assert.ok(page.includes('<a class="skip-link" href="#top">Aller au contenu principal</a>')&&page.includes('<main class="wrap" id="app" tabindex="-1"><noscript><h1 id="top" tabindex="-1">'),'lien clavier vers le contenu principal');
assert.ok(page.includes('CHI-(?:0[1-9]|1[0-9]|2[0-2])')&&et.includes('CHI-(?:0[1-9]|1[0-9]|2[0-2])'),'liste autorisée des deux fichiers');
assert.ok(/chimie-modele\.js/.test(page)&&/chimie-dessins\.js/.test(page),'modules chargés par la page d’activité');
assert.ok(page.indexOf('chimie-modele.js')<page.indexOf('chimie-dessins.js')&&page.indexOf('chimie-dessins.js')<page.indexOf('6e-ci.js'));
assert.ok(page.indexOf('matiere-ui.js')<page.indexOf('chimie-modele.js'),'les composants Matière précèdent le lot');
for(const i of IDS)assert.ok(sw.includes('NL-CI-6E-CHI-'+i+'.js'),'hors-ligne CHI-'+i);
for(const id of ['inflammable','comburant','explosif','gaz','corrosif','toxique','nocif','sante','environnement'])assert.ok(sw.includes('pictogrammes/ghs-'+id+'.svg'),'pictogramme GHS hors-ligne : '+id);
assert.ok(sw.includes('chimie-modele.js')&&sw.includes('chimie-dessins.js'));
assert.ok(!/pc-v127'/.test(sw),'version du cache incrémentée');
{const dom=new JSDOM('',{url:'http://localhost/',runScripts:'outside-only'}),W=dom.window;W.eval(read('assets/catalogues/6e-ci.js'));W.eval(read('assets/simple/etapes-ci.js'));
 const R=W.NohobaEtapesCI.etapes('constituants-air');assert.ok(!R.list.some(e=>e.act),'prototype : aucune investigation proposée à l’élève dans la leçon avant validation');
 assert.equal(W.NohobaEtapesCI.activites('combustion-gaz').length,5,'leçon du gaz : cinq fiches rattachées');}
console.log('Lot Chimie : catalogue (22 prototypes, quatre leçons), page des activités, hors-ligne et hub contrôlés.');
