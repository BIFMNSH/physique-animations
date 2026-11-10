/* Lot CI · Matière (MAT-01 à MAT-21, MAT-23 à MAT-26) et parcours « Matériaux, tri et déchets » (MAT-27 à MAT-32) :
   modèles qualitatifs, structure des fiches, parcours complets dans le moteur, question 6 de MAT-06. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const IDS=[];for(let n=1;n<=33;n++)if(n!==22)IDS.push(String(n).padStart(2,'0'));
const SHARED=['atelier-electrique','matiere-modele','matiere-dessins','matiere-scenes','matiere-ui'].map(x=>'assets/shared/'+x+'.js');
function env(){
  const dom=new JSDOM('<!doctype html><body><div id="app"></div></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  for(const f of [...SHARED,'assets/activites/activite.js'])w.eval(read(f));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-MAT-'+i+'.js'));
  return w;
}
const w=env(),doc=w.document,M=w.NohobaMatiere;
const eq=(a,b,m)=>assert.equal(JSON.stringify(Object.entries(a).sort()),JSON.stringify(Object.entries(b).sort()),m);
function lancer(i){
  const F=w['FICHE_CI_MAT'+i],panel=doc.createElement('div');doc.body.appendChild(panel);
  const st={essais:[],prevision:null};
  const X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
  F.manip(panel,X);return {F,panel,st,X};
}

/* ---------- règles physiques des modèles ---------- */
assert.equal(M.PICTOS.length,9,'neuf pictogrammes SGH');
assert.equal(M.EPI.length,4,'quatre équipements de protection');
assert.ok(M.EPI.some(e=>e.id==='masque'),'le masque est un équipement distinct');
assert.ok(M.EPI_SOUDE.includes('masque')&&M.EPI_SOUDE.length===4,'pastilles de soude : les quatre équipements, masque compris');
assert.ok(M.PICTOS.every(p=>p.alt&&p.danger&&p.conduite),'chaque pictogramme a un nom accessible, un danger et une conduite');
for(const t of ['depart','refroidit','apparait','croit','solide'])assert.equal(M.solidification(t).palier,t==='apparait'||t==='croit','palier solidification '+t);
assert.equal(M.solidification('apparait').T,0);assert.ok(M.solidification('solide').T<0);
for(const t of ['debut','milieu','presque'])assert.equal(M.fusion(t).T,0,'fusion à 0 °C '+t);
assert.ok(M.fusion('fini').T>0&&!M.fusion('fini').glace&&M.fusion('plus_tard').T>M.fusion('fini').T,'la température remonte après la fusion');
assert.equal(M.volumeEau('solide').niv,2);assert.equal(M.volumeEau('fondue').niv,M.volumeEau('liquide').niv,'le niveau revient au départ');
assert.equal(M.masse('glace').m,M.masse('eau',true).m,'masse conservée (récipient couvert)');
assert.ok(M.masse('eau',false).m<M.masse('glace').m,'récipient ouvert : masse faussée');
assert.equal(M.vaporisation('ebullition','tard').T,100);assert.equal(M.vaporisation('ebullition','tard').bulles,true);assert.equal(M.vaporisation('evap_soleil','tard').bulles,false);
assert.equal(M.vaporisation('condensation','tard').gouttes,true);assert.equal(M.vaporisation('condensation','debut').gouttes,false);
assert.equal(M.vaporisation('evap_soleil','tard').niveau,'bas');assert.equal(M.vaporisation('evap_ombre','tard').niveau,'moyen','évaporation plus lente à l’ombre');
assert.equal(M.lectureLab(-50).valeur,M.LAB.min);assert.equal(M.lectureLab(500).valeur,M.LAB.max);assert.equal(M.LAB.min,-10);assert.equal(M.LAB.max,110);
assert.equal(M.MATERIAUX.fer.aimant,true);assert.equal(M.MATERIAUX.cuivre.aimant,false);assert.equal(M.MATERIAUX.aluminium.aimant,false);
assert.equal(M.chaleur('cuivre','court').conduit,true);assert.equal(M.chaleur('bois','long').conduit,false);
assert.equal(M.flotte('bouchon').flotte,true);assert.equal(M.flotte('bouteille').flotte,false);
assert.ok(/plus léger que l’eau/.test(M.flotte('bouchon').comparaison)&&/plus lourd que l’eau/.test(M.flotte('tuyau').comparaison));
assert.equal(M.ETAPES_CYCLE.length,4);assert.equal(M.CYCLE_NOMS.length,4);
assert.equal(M.THERMOS.length,6,'six types de thermomètres à reconnaître');
assert.equal(M.SITUATIONS_THERMO.length,6);assert.ok(M.SITUATIONS_THERMO.every(s=>M.THERMOS.some(t=>t.id===s.juste)));
assert.throws(()=>M.solidification('inconnu'));assert.throws(()=>M.aimant('inconnu'));
console.log('Lot Matière : règles physiques des modèles vérifiées.');

/* ---------- Q6 de MAT-06 : données ---------- */
assert.equal(M.DECHETS.length,5,'cinq déchets');
assert.equal(M.DESTINATIONS.length,3,'trois destinations');
assert.ok(M.DECHETS.some(d=>d.id==='pile')&&M.DECHETS.some(d=>d.id==='pesticide'),'pile et bidon de pesticide');
assert.equal(M.DESTINATIONS.map(d=>d[1]).join('|'),'Poubelle ordinaire|Recyclage|Collecte spécialisée');
for(const d of M.DECHETS){
  assert.equal(M.DESTINATIONS.filter(([c])=>M.verifierDechet(d.id,c).juste).length,1,'une seule bonne destination '+d.id);
  for(const [c] of M.DESTINATIONS){
    const v=M.verifierDechet(d.id,c);assert.ok(v.retour.length>40,'retour expliqué '+d.id+'/'+c);
    if(/évier|caniveau/.test(v.retour))assert.ok(/\bne\b|\bjamais\b|\bNon\b/.test(v.retour),'aucun conseil de verser un produit dangereux : '+d.id+'/'+c);
    assert.ok(!/jetez|jette-le|verse-le|versez/i.test(v.retour),'pas d’injonction de jeter '+d.id+'/'+c);
  }
}
assert.equal(M.verifierDechet('pile','specialisee').juste,true);
assert.equal(M.verifierDechet('pile','ordinaire').juste,false);
assert.equal(M.verifierDechet('pesticide','specialisee').juste,true);
assert.equal(M.verifierDechet('pesticide','recyclage').juste,false);
assert.ok(/ne se recycle pas avec les bouteilles ordinaires/.test(M.verifierDechet('pesticide','recyclage').retour),'le bidon de pesticide ne se recycle pas avec les bouteilles');
for(const id of ['pile','pesticide']){
  const r=M.verifierDechet(id,'specialisee').retour;
  assert.ok(/adulte/.test(r)&&/près de chez toi|localement/.test(r),'danger : un adulte et une filière disponible localement ('+id+')');
  assert.ok(!/caniveau|évier/.test(M.verifierDechet(id,'specialisee').retour)||/jamais|ne /.test(r));
}
assert.equal(M.verifierDechet('bouteille','recyclage').juste,true);assert.equal(M.verifierDechet('epluchures','ordinaire').juste,true);assert.equal(M.verifierDechet('canette','recyclage').juste,true);
assert.throws(()=>M.verifierDechet('pile','nature'),/destination/);assert.throws(()=>M.verifierDechet('inconnu','ordinaire'),/inconnu/);
{const rep={pile:'specialisee',pesticide:'specialisee',bouteille:'recyclage',epluchures:'ordinaire',canette:'recyclage'};
 const tent={pile:['ordinaire','specialisee'],pesticide:['recyclage','specialisee'],bouteille:['recyclage'],epluchures:['ordinaire'],canette:['recyclage']};
 eq(M.scoreTri(rep,tent),{premier:3,final:5,repondus:5,total:5});
 eq(M.scoreTri({},{}),{premier:0,final:0,repondus:0,total:5});}
console.log('Lot Matière : question 6 (cinq déchets, trois destinations, un seul bon choix, retours prudents) vérifiée.');

/* ---------- structure commune ---------- */
const CLASSEMENT=['05','06','11','18','26','29','31','32']; /* activités de classement : pas de montage expérimental */
for(const i of IDS){
  const F=w['FICHE_CI_MAT'+i];assert.ok(F,'fiche chargée '+i);
  assert.equal(F.id,'NL-CI-6E-MAT-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Propriétés physiques de la matière');
  assert.ok(F.chapitre&&F.competenceVisee.length>20&&F.objectifsPedagogiques.length>=3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation','critere','retroaction'])assert.ok(F[k],i+' : '+k);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+i);
  assert.ok(F.aides.length>=3&&F.transfert.expl&&F.prof.reference&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2,'aides et corrigé '+i);
  assert.ok(F.situation.length>40&&/Awa|Kofi|Mariam|Côte|Abidjan|marché|cour|classe|cuisine|famille|village|lagune/.test(F.situation+F.situationEvaluation),'situation contextualisée '+i);
  const txt=JSON.stringify(F);
  assert.ok(!/NL-C4|NL-CI-6E-(ELE|MAT)-\d\d ·|Programme du cycle 4/.test(txt.replace(F.id,'')),'aucun code interne '+i);
  assert.ok(!/densit/i.test(txt),'aucune notion de densité en 6e '+i);
  assert.ok(F.prevision.choix.every(c=>c.length===2),'choix de prévision bien formés '+i);
  const {panel}=lancer(i);
  assert.ok([...panel.querySelectorAll('input[type=radio],input[type=checkbox]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'étiquettes et légendes des contrôles '+i);
  assert.ok([...panel.querySelectorAll('select')].every(s=>s.id&&panel.querySelector('label[for="'+s.id+'"]')),'listes étiquetées '+i);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'chaque dessin est un SVG nommé '+i);
  {const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);
    if(!CLASSEMENT.includes(i))assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma normalisé '+i);
    else assert.ok(panel.querySelectorAll('[data-item]').length>=3,'classement interactif '+i);}
}
console.log('Lot Matière : '+IDS.length+' fiches structurées (cadre, contexte local, accessibilité, aucun code interne, aucune densité).');

/* ---------- MAT-06 : question 6 dans l'interface ---------- */
{const {panel,st,X,F}=lancer('06');
  const radio=(item,val)=>{const r=panel.querySelector('input[name="tdechets-'+item+'"][value="'+val+'"]');assert.ok(r,item+'/'+val);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));return r.closest('[data-item]');};
  const valider=(card)=>{const b=[...card.querySelectorAll('button')].find(x=>/^Valider/.test(x.textContent));assert.ok(b);b.click();return b;};
  const msg=card=>card.querySelector('.msg').textContent;
  assert.equal(panel.querySelectorAll('[data-item]').length>=5,true,'les cinq cartes de déchets existent');
  /* retour explicatif, nouvel essai après erreur */
  let card=radio('pile','ordinaire'),b=valider(card);
  assert.ok(/Ce n’est pas la bonne réponse/.test(msg(card))&&/polluent/.test(msg(card)),'retour pour la pile jetée à la poubelle ordinaire');
  assert.equal(b.textContent,'Valider ma nouvelle réponse');assert.equal(b.disabled,false,'nouvel essai possible');
  card=radio('pile','specialisee');valider(card);assert.ok(/Bonne réponse/.test(msg(card))&&/adulte/.test(msg(card)),'bonne réponse expliquée pour la pile');
  assert.ok(card.querySelectorAll('input:disabled').length>0,'réponse juste verrouillée');
  /* pesticide : jamais recyclable avec les bouteilles */
  card=radio('pesticide','recyclage');valider(card);assert.ok(/ne se recycle pas avec les bouteilles ordinaires/.test(msg(card)));
  card=radio('pesticide','specialisee');valider(card);assert.ok(/Bonne réponse/.test(msg(card))&&/l’élève ne le manipule pas/.test(msg(card)));
  /* aide contextuelle */
  card=panel.querySelector('[data-item="bouteille"]');[...card.querySelectorAll('button')].find(x=>/aide/i.test(x.textContent)).click();assert.ok(/Aide/.test(msg(card)),'aide contextuelle');
  card=radio('epluchures','recyclage');valider(card);card=radio('epluchures','ordinaire');valider(card);
  card=radio('bouteille','recyclage');valider(card);card=radio('canette','recyclage');valider(card);
  eq(st.tri.dechets.score,{premier:2,final:5,total:5,repondus:5},'score sur 5 enregistré dans la fiche');
  assert.equal(st.essais.filter(e=>e.tri==='dechets').length,8,'chaque validation est tracée');
  assert.ok(panel.textContent.includes('Score : 2 / 5'),'score affiché');
  /* sans validation, aucun choix : message et pas d'essai */
  const n=st.essais.length;card=panel.querySelector('[data-item="pile"]');
  const html=M.traceHTML(['dechets'],st);
  assert.ok(/Score :<\/b> 2 \/ 5/.test(html)&&html.includes('Collecte spécialisée')&&html.includes('Juste')&&html.includes('Ce que je retiens'),'trace imprimable élève');
  assert.ok(!/NL-CI|corrigé enseignant/i.test(html),'la trace élève ne contient ni code ni corrigé enseignant');
  assert.equal(st.essais.length,n);
  assert.ok(F.peutConfronter({essais:[],tri:{}})===false,'verrouillage tant que Q1 à Q6 ne sont pas faites');
}
console.log('Lot Matière : question 6 en interface (retour par choix, nouvel essai, aide, score /5 enregistré, trace imprimable).');

/* ---------- parcours complets dans le moteur ---------- */
function parcours(i){
  const win=env(),document=win.document,F=win['FICHE_CI_MAT'+i],app=document.getElementById('app'),key='pc-act-'+F.id;
  const state=()=>JSON.parse(win.localStorage.getItem(key));
  const button=text=>{const bt=[...app.querySelectorAll('button')].find(x=>x.textContent.startsWith(text));assert.ok(bt,'bouton '+text+' '+i);assert.equal(bt.disabled,false,'bouton accessible '+text+' '+i);bt.click();return bt;};
  const radio=(name,value)=>{const r=app.querySelector('input[name="'+name+'"][value="'+value+'"]');assert.ok(r,name+'/'+value+' '+i);r.checked=true;r.dispatchEvent(new win.Event('change',{bubbles:true}));};
  const set=(id,value)=>{const el=document.getElementById(id);assert.ok(el,id+' '+i);el.value=value;};
  win.Activite.run(F,app);
  assert.equal(document.getElementById('tab2').disabled,true,'hypothèse requise '+i);
  button('Commencer : ma prévision');button('Enregistrer ma prévision');assert.ok(!state().prevision,'hypothèse vide refusée '+i);
  radio('pc',F.prevision.choix[0][0]);set('pr','Je propose cette hypothèse et je vais la vérifier.');
  button('Enregistrer ma prévision');button('Passer à la manipulation');
  assert.equal(document.getElementById('tab3').disabled,true,'essais requis '+i);
  /* classements : une erreur volontaire puis la bonne réponse */
  const cfgs=Object.values(win.NohobaMatiere.triCfg).filter(c=>app.querySelector('input[name^="t'+c.id+'-"],select[id^="t'+c.id+'-"]'));
  for(const c of cfgs)for(const [k,it] of c.items.entries()){
    const opts=(it.options||c.cats).map(x=>x[0]);
    const bonne=c.multi?it.juste:opts.find(o=>c.verifier(it.id,o).juste);assert.ok(bonne,'bonne réponse existante '+c.id+'/'+it.id);
    const carte=app.querySelector('[data-item="'+it.id+'"]:has([name="t'+c.id+'-'+it.id+'"], #t'+c.id+'-'+it.id+'-s)');assert.ok(carte,'carte '+c.id+'/'+it.id+' '+i);
    const poser=v=>{const vs=Array.isArray(v)?v:[v];const sel=carte.querySelector('select');if(sel){sel.value=vs[0];sel.dispatchEvent(new win.Event('change',{bubbles:true}));}else carte.querySelectorAll('input').forEach(x=>{x.checked=vs.includes(x.value);});};
    const val=[...carte.querySelectorAll('button')].find(x=>/^Valider/.test(x.textContent));
    if(k===0&&opts.length>1&&!c.multi){const faux=opts.find(o=>o!==bonne);poser(faux);val.click();assert.equal(val.textContent,'Valider ma nouvelle réponse','nouvel essai après erreur '+c.id);}
    poser(bonne);val.click();assert.ok(/Bonne réponse/.test(carte.querySelector('.msg').textContent),'bonne réponse '+c.id+'/'+it.id+' '+i);
  }
  /* blocs expérimentaux : balayage de toutes les combinaisons, une observation par essai */
  const prefixes=[...new Set([...app.querySelectorAll('input[name^="m"]')].map(x=>x.name.match(/^m\d+-/)[0]))];
  for(const pre of prefixes){
    const groupes={};app.querySelectorAll('input[name^="'+pre+'"]').forEach(x=>{(groupes[x.name]=groupes[x.name]||[]).push(x.value);});
    const noms=Object.keys(groupes).filter(n=>n!==pre+'obs');
    let combos=[{}];for(const n of noms)combos=combos.flatMap(c=>groupes[n].map(v=>Object.assign({},c,{[n]:v})));
    const carte=app.querySelector('textarea[id="'+pre+'obs"]').closest('.card');const enreg=[...carte.querySelectorAll('button')].find(x=>/Enregistrer mon observation/.test(x.textContent));
    enreg.click();assert.equal(state().essais.filter(e=>!e.tri).length,0,'observation vide refusée '+i);
    for(const c of combos){for(const [n,v] of Object.entries(c))radio(n,v);set(pre+'obs','Je décris ce que je vois sur le montage et le schéma.');enreg.click();}
  }
  assert.ok(F.peutConfronter(state()),'contraste suffisant '+i);
  assert.ok(state().essais.length>=F.essaisMin,'essais minimum atteints '+i);
  const essais=state().essais.length;
  button('J’ai assez d’essais');button('Enregistrer et passer au bilan');assert.equal(state().confront,null,'analyse vide refusée '+i);
  radio('vd','confirmee');set('pre','Je cite un essai précis et ce que j’ai observé dans le tableau.');set('mod','Je confronte mon hypothèse avec les essais.');button('Enregistrer et passer au bilan');
  set('cc','Je conclus à partir des observations de mes essais.');button('Valider ma conclusion');
  set('nl-eval','Je justifie ma réponse à partir des observations de la simulation.');button('Enregistrer ma réponse');
  radio('tr',String(F.transfert.rep));set('tj','Je justifie mon choix avec la simulation.');button('Vérifier ma réponse');
  assert.ok(app.textContent.includes('Exact.'),'transfert juste '+i);
  button('Voir ma trace');assert.ok(app.textContent.includes('Moment 9 sur 9 · Je relève un défi'),'trace '+i);
  assert.equal(state().essais.length,essais);assert.ok(!/NL-CI|NL-C4/.test(app.textContent),'aucun code interne affiché '+i);
  win.print=()=>{};button('Imprimer');const print=document.getElementById('print');
  assert.ok(print.textContent.includes('Je conclus à partir des observations de mes essais'),'conclusion dans la fiche remplie '+i);
  assert.ok(!print.querySelector('.sh-ref'),'corrigé absent de la trace élève '+i);
  app.replaceChildren();win.Activite.run(F,app);assert.ok(app.textContent.includes('Moment 9 sur 9 · Je relève un défi'),'reprise '+i);
  win.history.replaceState({},'','/?lecon=solides-liquides');app.replaceChildren();win.Activite.run(F,app);const dl=app.querySelector('a[href="../parcours-ci/?l=solides-liquides"]');assert.ok(dl&&dl.textContent.includes('Relever le défi'),'défi de la leçon '+i);win.history.replaceState({},'','/?lecon=energie-circuit');app.replaceChildren();win.Activite.run(F,app);assert.ok(!app.querySelector('a[href*="parcours-ci"]'),'pas de défi pour une leçon sans Studio '+i);win.history.replaceState({},'','/');app.replaceChildren();win.Activite.run(F,app);
  win.close();
}
for(const i of IDS)parcours(i);
console.log('Lot Matière : '+IDS.length+' parcours complets (hypothèse, essais, classements avec nouvel essai, analyse, conclusion, transfert, trace, impression, reprise).');

/* ---------- catalogue, hub, pages, hors-ligne ---------- */
const cat=new JSDOM('',{runScripts:'outside-only'}).window;cat.eval(read('assets/catalogues/6e-ci.js'));
const items=cat.NL_CATALOGUE_CI_6E;
const mat=items.filter(x=>x.sourceId.startsWith('MAT-'));
assert.equal(mat.length,32,'32 fiches Matière (26 du programme dont MAT-24 scindée en MAT-24 et MAT-33, + 6 du parcours matériaux)');
assert.ok(!items.some(x=>x.sourceId==='MAT-22'),'MAT-22 fusionnée dans MAT-21');
for(const i of IDS)assert.equal(items.find(x=>x.sourceId==='MAT-'+i).statut,'disponible','fiche validée par le propriétaire le 25 octobre 2026 : MAT-'+i);
assert.ok(mat.filter(x=>x.lecon==='Matériaux, tri et déchets').length===6,'six fiches du parcours matériaux');
assert.ok(items.find(x=>x.sourceId==='MAT-21').titre.includes('solidification et de la fusion'));
assert.equal(items.find(x=>x.sourceId==='MAT-24').titre,'Réaliser l’évaporation de l’eau','MAT-24 : évaporation seule');
assert.ok(items.find(x=>x.sourceId==='MAT-33').titre.includes('ébullition')&&items.find(x=>x.sourceId==='MAT-33').titre.includes('condensation'),'MAT-33 : ébullition et condensation');
const page=read('activites-ci/index.html');
for(const f of SHARED.slice(1))assert.ok(page.includes(f.replace('assets/','../assets/')),'page des activités charge '+f);
assert.ok(page.includes('MAT-(?:0[1-9]|[12][0-9]|3[0-3])'),'page des activités : identifiants MAT');
const hub=read('parcours-ci/index.html');
const etapes=read('assets/simple/etapes-ci.js'),classe=read('assets/simple/classe.js');
assert.ok(etapes.includes('MAT-(?:0[1-9]|[12][0-9]|3[0-3])')&&etapes.includes('materiaux-tri-dechets')&&hub.includes('Matériaux, tri et déchets')&&classe.includes('Matériaux, tri et déchets'),'pages simplifiées : leçon locale du parcours matériaux');
const sw=read('sw.js');for(const f of SHARED)assert.ok(sw.includes(f.replace('assets/','./assets/')),'hors-ligne '+f);
for(const i of IDS)assert.ok(sw.includes('NL-CI-6E-MAT-'+i+'.js'),'hors-ligne fiche MAT-'+i);
assert.ok(!sw.includes('MAT-22'),'MAT-22 absente du cache');
/* aucune donnée enseignante dans les fichiers publics */
assert.ok(fs.existsSync(path.join(root,'server/private/corriges-ci/NL-CI-6E-MAT-06-q6.md')),'corrigé enseignant MAT-06 rédigé hors des fichiers publics');
for(const f of fs.readdirSync(path.join(root,'assets/activites/fiches')).filter(x=>/MAT/.test(x)))assert.ok(!/JD [ÉE]ditions|page\s*\d+\s*du manuel/i.test(read('assets/activites/fiches/'+f)),'aucune reprise du manuel dans '+f);
console.log('Lot Matière : catalogue (prototypes), hub, page des activités et cache hors-ligne contrôlés.');
process.exit(0);
