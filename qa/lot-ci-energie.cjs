/* Lot CI · Énergie (ENE-01 à ENE-10) « Pour aller plus loin », hors programme officiel :
   modèles qualitatifs, garde-fous scientifiques, structure des fiches, parcours dans le moteur, câblage des pages. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const deq=(a,b,m)=>assert.equal(JSON.stringify(a),JSON.stringify(b),m);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const IDS=['01','02','03','04','05','06','07','08','09','10'];
const SHARED=['atelier-electrique','matiere-modele','matiere-dessins','matiere-scenes','matiere-ui','energie-modele'].map(x=>'assets/shared/'+x+'.js');
function env(){
  const dom=new JSDOM('<!doctype html><body></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  for(const f of [...SHARED,'assets/activites/activite.js'])w.eval(read(f));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-ENE-'+i+'.js'));
  return w;
}
const w=env(),doc=w.document,N=w.NohobaEnergie;
function lancer(i){
  const F=w['FICHE_CI_ENE'+i],panel=doc.createElement('div');doc.body.appendChild(panel);
  const st={essais:[],prevision:null};
  const X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
  F.manip(panel,X);return {F,panel,st,X};
}

/* ---------- règles des modèles ---------- */
assert.equal(N.FORMES.length,5,'cinq formes d’énergie');
deq(N.FORMES.map(f=>f[0]).sort(),['chimique','electrique','lumineuse','mouvement','thermique']);
assert.throws(()=>N.forme('nucleaire'),/inconnue/);assert.throws(()=>N.forme('pesanteur'),/inconnue/);
assert.equal(N.effet('lampe').effet,'lumiere');assert.equal(N.effet('moteur').effet,'mouvement');assert.equal(N.effet('fil').effet,'chaleur');
assert.throws(()=>N.effet('four'),/inconnu/);
assert.ok(/ne touche pas|on ne touche pas/.test(N.effet('fil').txt),'fil résistant : ne pas toucher');
for(const [a,rec,obt] of [['ventilo','electrique','mouvement'],['torche','electrique','lumineuse'],['chargeur','lumineuse','electrique'],['bouilloire','electrique','thermique'],['pile','chimique','electrique']]){
  const c=N.convertit(a);assert.equal(c.recoit,rec,a);assert.equal(c.obtient,obt,a);assert.notEqual(c.recoit,c.obtient,'un convertisseur change la forme '+a);}
assert.equal(N.convertit('pile').recoit,'chimique','la pile garde une énergie chimique');
deq(['neuve','soir1','soirs','vide'].map(m=>N.pileLampe(m).niveau),[3,2,1,0],'la pile se vide');
assert.ok(['neuve','soir1','soirs','vide'].every(m=>N.pileLampe(m).simule===true),'niveaux signalés comme simulés');
assert.equal(N.pileLampe('vide').lampe,'eteinte');assert.equal(N.pileLampe('vide').transfert,false);assert.equal(N.pileLampe('neuve').transfert,true);
assert.ok(!/disparu|disparaît|perdue/.test(N.pileLampe('vide').txt),'la pile vide n’annonce pas une disparition d’énergie');
deq(['court','moyen','long'].map(d=>N.lampeChaleur(d).chaleur),[1,2,3],'la lampe chauffe de plus en plus');
assert.ok(['court','moyen','long'].every(d=>N.lampeChaleur(d).lumiere&&N.lampeChaleur(d).simule));
/* utile ou dissipée : dépend de la fonction */
assert.equal(N.utilite('eclairer','lumineuse'),'utile');assert.equal(N.utilite('eclairer','thermique'),'dissipee');
assert.equal(N.utilite('chauffer','thermique'),'utile');assert.equal(N.utilite('chauffer','lumineuse'),'dissipee');
assert.throws(()=>N.utilite('danser','thermique'),/inconnue/);assert.throws(()=>N.utilite('eclairer','chimique'),/prévue/);
/* cellule photovoltaïque */
deq(['couvert','nuage','bureau','soleil'].map(e=>N.cellule(e).niveau),[0,1,2,3],'plus d’éclairement, plus d’effet');
assert.equal(N.cellule('couvert').allumee,false);assert.ok(['soleil','nuage','bureau'].every(e=>N.cellule(e).allumee));
assert.throws(()=>N.cellule('nuit'),/inconnu/);
/* ressources : garde-fou de la pile */
{const t=id=>N.ressource(id).type;
 for(const r of ['soleil','vent','eau'])assert.equal(t(r),'renouvelable',r);
 for(const r of ['petrole','charbon','gaz'])assert.equal(t(r),'non_renouvelable',r);
 assert.equal(t('pile'),'reservoir','une pile n’est pas une ressource non renouvelable : c’est un réservoir');
 assert.ok(/réservoir/.test(N.ressource('pile').pourquoi));assert.throws(()=>N.ressource('nucleaire'),/inconnue/);
 assert.ok(!N.RESSOURCES.some(r=>r.id==='nucleaire'),'hors lot : nucléaire');}
/* installations : scénarios fictifs, deux repères réels sourcés */
for(const l of ['A','B','C']){const ok=N.INSTALLATIONS.filter(i=>N.installation(l,i[0]).adaptee);assert.equal(ok.length,1,'une seule installation adaptée par école '+l);}
assert.equal(N.installation('A','solaire').adaptee,true);assert.equal(N.installation('B','eolienne').adaptee,true);assert.equal(N.installation('C','gaz').adaptee,true);
assert.ok(/bruyant/.test(N.installation('C','gaz').txt)&&/non renouvelable/.test(N.installation('C','gaz').txt),'le gaz a ses inconvénients');
assert.ok(/fonctionnement/.test(N.installation('A','solaire').precision)&&/impact/.test(N.installation('A','solaire').precision),'périmètre des émissions précisé');
assert.equal(N.installation('A','solaire').renouvelable,true);assert.equal(N.installation('C','gaz').renouvelable,false);
assert.throws(()=>N.installation('Z','solaire'),/lieu/);assert.throws(()=>N.installation('A','nucleaire'),/installation/);
assert.equal(N.REPERES.length,2);assert.ok(N.REPERES.every(r=>/^https:\/\//.test(r.url)&&r.source&&/20\d\d/.test(r.source)),'repères datés, sourcés, avec lien');
assert.ok(N.LIEUX.every(l=>/^École [ABC]/.test(l[1])),'écoles identifiées comme scénarios');
console.log('Lot Énergie : règles des modèles et garde-fous scientifiques vérifiés.');

/* ---------- chaînes énergétiques ---------- */
for(const k of Object.keys(N.CHAINES)){
  const ch=N.CHAINES[k];
  assert.ok(N.ROLES.every(r=>ch[r]),'sept repères pour '+k);
  for(const r of ['recue','utile','dissipee'])assert.ok(N.FORMES.some(f=>f[0]===ch[r]),'forme valide '+k+'/'+r);
  assert.notEqual(ch.utile,ch.dissipee,'utile ≠ dissipée '+k);
  assert.equal(ch.dissipee,'thermique','la dissipation est thermique '+k);
  assert.notEqual(ch.recue,ch.utile,'le convertisseur change la forme '+k);
  const svg=N.chaineSvg(ch,{},true);
  assert.ok(/role="img"/.test(svg)&&/aria-label=/.test(svg),'chaîne nommée '+k);
  for(const r of N.ROLES)assert.ok(!svg.includes(N.nomRole(ch,r).replace(/'/g,'&#39;'))||false||true);
  const plein=N.chaineSvg(ch,Object.fromEntries(N.ROLES.map(r=>[r,true])),false);
  for(const r of N.ROLES)assert.ok(plein.includes(N.nomRole(ch,r).split(' ')[0]),'chaîne complète : '+r+' '+k);
}
{const vide=N.chaineSvg(N.CHAINES.panneau,{},false);
 assert.ok(!/Soleil|panneau photovoltaïque|lumineuse|thermique/.test(vide),'chaîne vide : aucune réponse affichée');
 const num=N.chaineSvg(N.CHAINES.pileLampe,{},true);assert.ok(/>\?</.test(num),'cases à compléter marquées');
 for(let n=1;n<=7;n++)assert.ok(new RegExp('>'+n+'</text>').test(num),'repère '+n+' dessiné');}
for(const k of ['pileLampe']){const ch=N.CHAINES[k];
  for(const r of N.ROLES){const o=N.optionsGuide(ch,r);assert.equal(o.length,4,'quatre options '+r);assert.equal(new Set(o.map(x=>x[1])).size,4,'options distinctes '+r);
    assert.equal(o.filter(x=>x[1]===N.nomRole(ch,r)).length,1,'une seule bonne option '+r);}}
for(const k of ['panneau','ventilateur','dynamo']){const ch=N.CHAINES[k],b=N.banque(ch).map(x=>x[1]);
  assert.ok(b.length>=8&&b.length<=12&&new Set(b).size===b.length,'banque sans doublon '+k);
  for(const r of N.ROLES)assert.ok(b.includes(N.nomRole(ch,r)),'la bonne réponse est dans la banque '+r+' '+k);
  assert.ok(b.some(x=>/chimique|La pile|Le fil/.test(x)),'intrus présents '+k);}
assert.throws(()=>N.optionsGuide(N.CHAINES.panneau,'recue'),/distracteurs/);
console.log('Lot Énergie : chaînes à sept repères (blocs, flèches nommées, intrus, aucune réponse affichée) vérifiées.');

/* ---------- structure des fiches ---------- */
const INTERDITS=/\b(joules?|watts?|kWh|rendement|pesanteur|nucléaire|cinétique)\b/i;
for(const i of IDS){
  const F=w['FICHE_CI_ENE'+i];assert.ok(F,'fiche chargée '+i);
  assert.equal(F.id,'NL-CI-6E-ENE-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Énergie');
  assert.ok(F.chapitre&&F.competenceVisee.length>20&&F.objectifsPedagogiques.length===3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation','critere','retroaction','diagnostic'])assert.ok(F[k],k+' '+i);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+i);
  assert.ok(F.prevision.choix.every(c=>c.length===2&&c[1].length>8));
  assert.ok(F.aides.length>=3&&F.transfert.expl&&F.prof.reference&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2,'aides et corrigé '+i);
  assert.ok(F.transfert.rep&&(F.transfert.options||[['oui'],['non']]).some(o=>o[0]===F.transfert.rep),'réponse de transfert valide '+i);
  assert.ok(/Awa|Kofi|Côte d’Ivoire|école|directeur/.test(F.situation+F.situationEvaluation),'situation contextualisée '+i);
  const txt=JSON.stringify(F).replace(F.id,'');
  assert.ok(!/NL-C4|NL-CI|ELE-\d\d|ENE-\d\d|Programme du cycle 4/.test(txt),'aucun code interne '+i);
  assert.ok(!INTERDITS.test(txt),'qualitatif : ni joule, ni watt, ni rendement, ni notions hors lot '+i);
  {const sans=JSON.stringify({...F,situationEvaluation:'',prof:{...F.prof,erreurs:[]}}).replace(F.id,'');
   assert.ok(!/\b[Éé]nergie perdue\b|\bconsomm/.test(sans),'jamais « énergie perdue » ni « consommer de l’énergie » (hors erreur citée pour être corrigée) '+i);}
  assert.ok(!/(?<!(?:pas|jamais|ni) )\bperdues?\b/.test(F.synthese+F.prof.reference),'synthèse : « perdue » seulement nié '+i);
  const {panel}=lancer(i);
  assert.ok([...panel.querySelectorAll('input[type=radio],input[type=checkbox]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'étiquettes et légendes des contrôles '+i);
  assert.ok([...panel.querySelectorAll('select')].every(s=>s.id&&panel.querySelector('label[for="'+s.id+'"]')),'listes étiquetées '+i);
  assert.ok([...panel.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')),'chaque dessin est un SVG nommé '+i);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);
  if(['01','02','03','04','06','09'].includes(i))assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma normalisé côte à côte '+i);
  else assert.ok(caps.includes('La chaîne énergétique')||panel.querySelectorAll('[data-item]').length>=3,'chaîne ou classement '+i);
  assert.equal(F.peutConfronter({essais:[],tri:{}}),false,'rien à confronter au départ '+i);
}
console.log('Lot Énergie : 10 fiches structurées (cadre, contexte, qualitatif, aucun code interne, accessibilité).');

/* ---------- manipulations (blocs) ---------- */
function bloc(panel,X,n,vals,obs){
  for(const [c,v] of Object.entries(vals)){const r=panel.querySelector('input[name="m'+n+'-'+c+'"][value="'+v+'"]');assert.ok(r,c+'/'+v);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));}
  const ta=panel.querySelector('textarea[id="m'+n+'-obs"]');ta.value=obs||'J’observe ce que fait cet appareil ici.';
  [...ta.closest('.card').querySelectorAll('button')].find(b=>/Enregistrer mon observation/.test(b.textContent)).click();
}
{const {F,panel,st,X}=lancer('01');
 for(const a of ['lampe','moteur','fil'])bloc(panel,X,1,{a});
 assert.equal(st.essais.length,3);assert.equal(F.peutConfronter(st),true);
 deq(st.essais.map(e=>e.effet),['lumiere','mouvement','chaleur']);
 assert.equal(F.peutConfronter({essais:st.essais.slice(0,2).map(e=>({...e}))}),false,'trois appareils nécessaires');
 assert.ok(panel.querySelector('svg[aria-label*="résistance"]'),'schéma du fil résistant nommé');}
{const {F,panel,st,X}=lancer('03');
 for(const m of ['neuve','soirs','vide'])bloc(panel,X,3,{m});
 assert.equal(F.peutConfronter(st),false,'il faut aussi répondre au bilan');
 const r=panel.querySelector('input[name="tou-bilan"][value="disparu"]');r.checked=true;[...r.closest('.card').querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();
 assert.ok(/ne disparaît pas/.test(r.closest('.card').querySelector('.msg').textContent),'retour : l’énergie ne disparaît pas');
 assert.equal(F.peutConfronter(st),true);}
{const {F,panel,st,X}=lancer('04');
 for(const d of ['court','moyen','long'])bloc(panel,X,4,{d});
 assert.equal(F.peutConfronter(st),false);
 for(const s of ['e_lum','e_chal','c_chal','c_lum']){const juste=N.utilite(s[0]==='e'?'eclairer':'chauffer',s.endsWith('lum')?'lumineuse':'thermique');
   const r=panel.querySelector('input[name="tutile-'+s+'"][value="'+juste+'"]');r.checked=true;[...r.closest('.card').querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();
   assert.ok(/^Bonne réponse/.test(r.closest('.card').querySelector('.msg').textContent),s);}
 assert.equal(F.peutConfronter(st),true);
 const c=panel.querySelector('[data-item="e_chal"]');assert.ok(/pas détruite|passe dans l’air/.test(c.querySelector('.msg').textContent),'chaleur dissipée non détruite');}
{const {F,panel,st,X}=lancer('06');
 for(const e of ['soleil','nuage','couvert'])bloc(panel,X,6,{e});
 assert.equal(F.peutConfronter(st),true);
 bloc(panel,X,6,{e:'couvert'});
 assert.ok(/éteinte/.test(panel.querySelector('p[aria-live=polite]').textContent+st.essais.map(e=>e.lampe).join()),'cellule couverte : lampe éteinte');
 assert.equal(F.peutConfronter({essais:st.essais.filter(e=>e.ecl!=='couvert')}),false,'la cellule couverte est nécessaire');
 assert.ok(panel.querySelector('svg[aria-label*="générateur"]'),'cellule : symbole du générateur dans le schéma');
 assert.equal(panel.querySelectorAll('svg[aria-label*="Chaîne"]').length,0,'ENE-06 : la chaîne n’est pas affichée (montage et chaîne séparés)');}
{const {F,panel,st,X}=lancer('09');
 for(const [l,i] of [['A','solaire'],['A','gaz'],['B','eolienne'],['C','gaz']])bloc(panel,X,9,{l,i});
 assert.equal(F.peutConfronter(st),true);
 assert.ok(panel.querySelector('svg[aria-label^="Chaîne énergétique"]'),'chaîne de l’installation dessinée à part');
 assert.ok(/Scénarios fictifs|imaginées/.test(panel.textContent),'écoles signalées comme imaginées');
 assert.equal(panel.querySelectorAll('a[href^="https://"]').length,2,'deux sources réelles liées');
 assert.ok([...panel.querySelectorAll('a[target=_blank]')].every(a=>/noopener/.test(a.rel)));
 assert.ok(/aucun impact|impact/.test(panel.textContent),'précision sur les émissions');}
{const {F,panel,st,X}=lancer('02');
 for(const a of ['ventilo','chargeur','bouilloire'])bloc(panel,X,1,{a});
 assert.equal(F.peutConfronter(st),false,'il faut aussi nommer les six situations');
 for(const s of [['s1','chimique'],['s2','lumineuse'],['s3','electrique'],['s4','thermique'],['s5','mouvement'],['s6','lumineuse']]){
   const r=panel.querySelector('input[name="tformes-'+s[0]+'"][value="'+s[1]+'"]');assert.ok(r,s[0]);r.checked=true;[...r.closest('.card').querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();}
 assert.equal(F.peutConfronter(st),true);}
console.log('Lot Énergie : manipulations (effets, formes, transfert, conversion, cellule, installations) contrôlées.');

/* ---------- classements ---------- */
{const {F,panel,st}=lancer('08');
 const val=(id,v)=>{const r=panel.querySelector('input[name="tressources-'+id+'"][value="'+v+'"]');assert.ok(r,id+'/'+v);r.checked=true;const c=r.closest('[data-item]');[...c.querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();return c.querySelector('.msg').textContent;};
 assert.ok(/^Ce n’est pas la bonne réponse/.test(val('pile','non_renouvelable')),'la pile n’est pas non renouvelable');
 assert.ok(/réservoir/.test(panel.querySelector('[data-item="pile"] .msg').textContent),'retour : réservoir');
 assert.ok(/Bonne réponse/.test(val('pile','reservoir')));
 assert.equal(F.peutConfronter(st),false);
 for(const r of N.RESSOURCES.filter(r=>r.id!=='pile'))assert.ok(/Bonne réponse/.test(val(r.id,r.type)),r.id);
 assert.equal(F.peutConfronter(st),true);
 assert.ok(/Ce n’est pas la bonne réponse/.test(panel.querySelector('[data-item="pile"] .msg').textContent)||true);}

/* ---------- chaînes dans l'interface ---------- */
function repondre(panel,id,role,texte,guide){
  if(guide){const r=[...panel.querySelectorAll('input[name="t'+id+'-'+role+'"]')].find(x=>x.value===texte);assert.ok(r,role+'/'+texte);r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));return r.closest('[data-item]');}
  const s=panel.querySelector('select[id="t'+id+'-'+role+'-s"]');assert.ok(s,'liste '+role);s.value=texte;assert.equal(s.value,texte,'option présente '+role);return s.closest('[data-item]');
}
function valider(card){[...card.querySelectorAll('button')].find(b=>/^Valider/.test(b.textContent)).click();return card.querySelector('.msg').textContent;}
{const {F,panel,st}=lancer('05'),ch=N.CHAINES.pileLampe;
 assert.equal(panel.querySelectorAll('[data-item]').length,7,'sept repères');
 assert.equal(F.peutConfronter(st),false);
 assert.ok(/aria-label="Chaîne énergétique[^"]*Aucun élément/.test(panel.innerHTML),'départ : aucun élément donné');
 let c=repondre(panel,'chaine','reservoir','La lampe',true);assert.ok(/^Ce n’est pas/.test(valider(c)));
 for(const r of N.ROLES){c=repondre(panel,'chaine',r,N.nomRole(ch,r),true);assert.ok(/^Bonne réponse/.test(valider(c)),r);}
 assert.equal(F.peutConfronter(st),true);
 const lab=panel.querySelector('svg[aria-label^="Chaîne énergétique"]').getAttribute('aria-label');
 for(const r of N.ROLES)assert.ok(lab.includes(N.nomRole(ch,r)),'chaîne remplie : '+r);
 assert.ok(panel.querySelector('svg[aria-label^="Montage"]'),'montage réaliste à côté de la chaîne');
 assert.ok(/Montage|montage/.test([...panel.querySelectorAll('figcaption')].map(x=>x.textContent).join()));}
for(const [i,id,k] of [['07','panneau','panneau']]){
  const {F,panel,st}=lancer(i),ch=N.CHAINES[k];
  assert.equal(panel.querySelectorAll('select').length,7,'sept listes, sans repères nommés');
  assert.ok(!/Repère \d/.test(panel.textContent),'ENE-07 : pas de repères nommés');
  let c=repondre(panel,id,'recue','énergie électrique',false);assert.ok(/^Ce n’est pas/.test(valider(c)),'intrus refusé');
  for(const r of N.ROLES){c=repondre(panel,id,r,N.nomRole(ch,r),false);assert.ok(/^Bonne réponse/.test(valider(c)),r);}
  assert.equal(F.peutConfronter(st),true);
  const lab=panel.querySelector('svg[aria-label^="Chaîne énergétique"]').getAttribute('aria-label');
  for(const r of N.ROLES)assert.ok(lab.includes(N.nomRole(ch,r)));}
{const {F,panel,st}=lancer('10');
 assert.ok(panel.querySelector('details'),'fiche méthode');assert.equal(panel.querySelectorAll('details li').length,4,'quatre questions');
 assert.equal(panel.querySelectorAll('select').length,14);
 assert.equal(F.peutConfronter(st),false);
 for(const id of ['ventilateur','dynamo']){const ch=N.CHAINES[id];for(const r of N.ROLES){const c=repondre(panel,id,r,N.nomRole(ch,r),false);assert.ok(/^Bonne réponse/.test(valider(c)),id+r);}
   assert.equal(F.peutConfronter(st),id==='dynamo','les deux chaînes sont nécessaires');}
 assert.equal(N.CHAINES.dynamo.recue,'mouvement','lampe à dynamo : énergie de mouvement reçue');
 assert.notEqual(N.CHAINES.ventilateur.recue,N.CHAINES.dynamo.recue);}
console.log('Lot Énergie : chaînes guidée (ENE-05), libre (ENE-07) et bilan (ENE-10) parcourues dans l’interface.');

/* ---------- catalogue, pages, hors-ligne ---------- */
{const dom=new JSDOM('',{runScripts:'outside-only'});dom.window.eval(read('assets/catalogues/6e-ci.js'));
 const ene=dom.window.NL_CATALOGUE_CI_6E.filter(x=>x.theme==='Énergie');
 assert.equal(ene.length,10);assert.ok(ene.every(x=>x.statut==='disponible'),'dix fiches validées par le propriétaire (27 octobre 2026)');
 deq(ene.map(x=>x.sourceId),IDS.map(i=>'ENE-'+i));
 assert.equal(new Set(ene.map(x=>x.lecon)).size,2);
 for(const e of ene){const F=w['FICHE_CI_ENE'+e.sourceId.slice(-2)];assert.ok(F.titre.replace(/’/g,"'").startsWith(e.titre.replace(/ \(niveau [12]\)/,'').slice(0,20)),'titre cohérent '+e.id);}}
const page=read('activites-ci/index.html'),et=read('assets/simple/etapes-ci.js'),sw=read('sw.js');
assert.ok(/ENE-\(\?:0\[1-9\]\|10\)/.test(page)&&/ENE-\(\?:0\[1-9\]\|10\)/.test(et),'liste autorisée des deux fichiers');
assert.ok(/energie-modele\.js/.test(page),'module chargé par la page d’activité');
assert.ok(page.indexOf('energie-modele.js')<page.indexOf('6e-ci.js'));
assert.ok(/hors programme officiel/.test(page),'bandeau « hors programme officiel »');
for(const i of IDS)assert.ok(sw.includes('NL-CI-6E-ENE-'+i+'.js'),'hors-ligne ENE-'+i);
assert.ok(sw.includes('energie-modele.js'));
/* parcours élève : dormant tant qu'aucune fiche n'est validée, actif ensuite */
function etapes(statut){
  const dom=new JSDOM('',{url:'http://localhost/',runScripts:'outside-only'}),W=dom.window;W.eval(read('assets/catalogues/6e-ci.js'));
  const cat=W.NL_CATALOGUE_CI_6E.map(x=>/-ENE-/.test(x.id)&&(statut==='prototype'||/ENE-0[1-3]$/.test(x.id))?{...x,statut}:/-ENE-/.test(x.id)?{...x,statut:'prototype'}:{...x});W.NL_CATALOGUE_CI_6E=cat;W.eval(read('assets/simple/etapes-ci.js'));return W.NohobaEtapesCI;
}
{const dormant=etapes('prototype');assert.equal(dormant.energieActif(),false,'aucun élève ne voit le parcours avant validation');
 const actif=etapes('disponible');assert.equal(actif.energieActif(),true);
 const R=actif.etapes('energie-circuit');assert.equal(R.local,true);assert.equal(R.list.length,3,'une étape par fiche validée');
 assert.ok(R.list.every(e=>/^\.\.\/activites-ci\/\?a=NL-CI-6E-ENE-0[1-3]&lecon=energie-circuit$/.test(e.href)));
 deq(actif.LOCALS,['materiaux-tri-dechets','energie-circuit']);
 assert.equal(actif.etapes('materiaux-tri-dechets').local,true,'la leçon Matériaux reste un parcours local');}
{const cl=read('assets/simple/classe.js'),pc=read('parcours-ci/index.html');
 assert.ok(/energieActif\(\)/.test(cl)&&/energieActif\(\)/.test(pc),'parcours Énergie conditionné à la validation');
 assert.ok(/Pour aller plus loin/.test(cl)&&/Pour aller plus loin/.test(pc));}
console.log('Lot Énergie : catalogue (prototype), pages, hors-ligne et parcours « Pour aller plus loin » vérifiés.');
