/* Livre 3D de 6e : « Le circuit électrique ». Huit chapitres (ELE-01 à 05, 17, 06, 07), trois doubles pages chacun, simulation dans la page,
   réponses partagées avec la fiche (« pc-act-<id> »), tampon, guirlande, reprise, téléphone, atelier seul (embed). */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('livre-ci/index.html'),js=read('assets/livre-ci/livre-ci.js'),css=read('assets/livre-ci/livre-ci.css');
const IDS=['01','02','03','04','05','17','06','07'];
const libs=['assets/shared/conductivite-modele.js','assets/shared/atelier-electrique.js','assets/shared/commande-protection.js','assets/activites/activite.js'].map(read);
const fiches=IDS.map(i=>read('assets/activites/fiches/NL-CI-6E-ELE-'+i+'.js'));
/* 1. prototype hors référencement, français, sans code interne affiché */
assert.ok(/noindex/.test(html)&&!read('sitemap.xml').includes('/livre-ci/'),'prototype hors référencement');
assert.ok(!/[؀-ۿ]/.test(html+js),'français uniquement');
assert.ok(!/NL-C4|Programme du cycle 4/.test(html+js),'aucun code interne ni cycle 4');
assert.ok(IDS.every(i=>html.includes('NL-CI-6E-ELE-'+i+'.js')),'les huit fiches sont chargées par la page');
/* 2. données des huit fiches */
function monde(url,store,largeur){
  const w=new JSDOM(html.replace(/<script[^>]*src[^>]*><\/script>/g,''),{url,runScripts:'outside-only',pretendToBeVisual:true}).window;
  for(const[k,v]of Object.entries(store||{}))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
  if(largeur)Object.defineProperty(w,'innerWidth',{value:largeur,configurable:true});
  w.matchMedia=()=>({matches:true});libs.forEach(s=>w.eval(s));fiches.forEach(s=>w.eval(s));return w;}
function lance(w){w.eval(js);}
const w0=monde('http://localhost/livre-ci/');
IDS.forEach(i=>{const f=w0['FICHE_CI_ELE'+i];assert.ok(f,'fiche '+i);
  assert.ok(f.competenceVisee&&f.objectifsPedagogiques.length>=3&&f.situation&&f.theme&&f.chapitre,i+' : cadre de la fiche');
  assert.ok(f.prevision.choix.length>=3&&f.prevision.choix.every(c=>c[0]&&c[1]),i+' : choix d’hypothèse');
  assert.ok(f.protocole.length>=3&&f.colonnes.length>=2&&typeof f.lignes==='function'&&typeof f.manip==='function',i+' : protocole, tableau, manipulation');
  assert.ok(f.confrontation&&f.retroaction&&f.synthese&&f.critere&&f.transfert.q&&f.transfert.expl&&f.transfert.rep,i+' : confrontation, bilan, défi');
  assert.ok(f.transfert.rep===(f.transfert.options||[['oui'],['non']]).map(o=>o[0]).filter(x=>x===f.transfert.rep)[0],i+' : bonne réponse du défi parmi les choix');});
/* 3. atelier seul : mêmes données que la fiche, sans onglets, essais signalés au livre */
{const w=monde('http://localhost/activites-ci/?a=NL-CI-6E-ELE-01&embed=manip'),d=w.document,div=d.body.appendChild(d.createElement('div'));let n=0;
 w.Activite.manip(w.FICHE_CI_ELE01,div,st=>{n=st.essais.length;});
 assert.ok(!div.querySelector('[role=tablist]')&&!div.querySelector('h1'),'atelier seul : ni onglets ni titre');assert.ok(div.querySelector('#ci1-z1'),'atelier seul : la simulation est là');
 [['1','culot'],['2','plus'],['3','plot'],['4','moins'],['5','plus'],['6','moins']].forEach(([z,v])=>{div.querySelector('#ci1-z'+z).value=v;});
 [...div.querySelectorAll('button')].find(b=>/Vérifier mes étiquettes/.test(b.textContent)).click();
 assert.equal(n,6,'six essais signalés');const st=JSON.parse(w.localStorage.getItem('pc-act-NL-CI-6E-ELE-01'));assert.equal(st.v,1);assert.equal(st.essais.length,6,'même clé que la fiche');
 const ci=read('activites-ci/index.html');assert.ok(/embed'\)==='manip'/.test(ci)&&/postMessage\(m,location\.origin\)/.test(ci),'page d’activité : mode livre limité à la même origine');}
const attend=()=>new Promise(r=>setTimeout(r,30));
(async()=>{
 /* sommaire */
 let w=monde('http://localhost/livre-ci/');lance(w);let d=w.document;const $=s=>d.querySelector(s),pg=()=>[...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(',');
 assert.equal(pg(),'toc:l,toc:r');assert.equal(d.querySelectorAll('.chaps button').length,8,'huit chapitres au sommaire');assert.match($('.guir').getAttribute('aria-label'),/0 lampe allumée sur 8/);
 assert.ok(/Thème : Électricité/.test($('[data-pg="toc:l"]').textContent));
 /* chapitre 1 : je cherche */
 $('.chaps [data-c="0"]').click();await attend();assert.equal(pg(),'0:0l,0:0r');
 const L=$('[data-pg="0:0l"]').textContent;assert.match(L,/Thème : Électricité/);assert.match(L,/Chapitre : Le circuit électrique/);assert.match(L,/Compétence visée/);assert.match(L,/À la fin de cette partie, je dois être capable de/);assert.match(L,/Awa veut brancher/);
 assert.ok(!/NL-CI|ELE-0|ELE-1/.test(d.body.textContent),'aucun code interne affiché');
 assert.ok($('#next').disabled,'la double page 2 est fermée tant qu’il n’y a pas d’hypothèse');
 $('[data-act="hyp"]').click();assert.match($('[data-pg="0:0r"] [data-m]').textContent,/Choisis une réponse/);
 const r=$('input[name="hyp:0"][value="signes"]');r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));
 const tr=$('#rep0');tr.value='Je pense que les bornes se voient.';tr.dispatchEvent(new w.Event('input',{bubbles:true}));
 const ra=$('#rai0');ra.value='car il y a des signes';ra.dispatchEvent(new w.Event('input',{bubbles:true}));
 $('[data-act="hyp"]').click();await attend();
 let a=JSON.parse(w.localStorage.getItem('pc-act-NL-CI-6E-ELE-01'));assert.equal(a.prevision.initiale.choix,'signes','hypothèse écrite dans la fiche');assert.match(a.prevision.initiale.raison,/signes/);
 assert.equal(pg(),'0:1l,0:1r','le livre tourne vers le laboratoire');assert.ok($('[data-pg="0:1r"] [data-act="conf"]').disabled,'confrontation fermée sans manipulation');
 /* laboratoire : la simulation s'ouvre dans la page */
 $('[data-act="lab"]').click();assert.match($('#volet iframe').getAttribute('src'),/activites-ci\/\?a=NL-CI-6E-ELE-01&embed=manip&t=light/);assert.ok($('#volet [role=dialog]'));
 const vol=d.createElement('div');w.Activite.manip(w.FICHE_CI_ELE01,vol);
 [['1','culot'],['2','plus'],['3','plot'],['4','moins'],['5','plus'],['6','moins']].forEach(([z,v])=>{vol.querySelector('#ci1-z'+z).value=v;});[...vol.querySelectorAll('button')].find(b=>/Vérifier mes étiquettes/.test(b.textContent)).click();
 $('[data-lfin]').click();assert.ok($('#volet').hidden);assert.equal(d.querySelectorAll('[data-pg="0:1r"] tbody tr').length,6,'les six essais apparaissent dans le livre');assert.ok(!$('[data-pg="0:1r"] [data-act="conf"]').disabled);
 /* confrontation, bilan, rabat, défi */
 $('input[name="ver:0"][value="confirmee"]').checked=true;$('input[name="ver:0"][value="confirmee"]').dispatchEvent(new w.Event('change',{bubbles:true}));
 const pre=$('#pre0');pre.value='Zone 2 : borne +';pre.dispatchEvent(new w.Event('input',{bubbles:true}));$('[data-act="conf"]').click();await attend();
 assert.equal(pg(),'0:2l,0:2r');a=JSON.parse(w.localStorage.getItem('pc-act-NL-CI-6E-ELE-01'));assert.equal(a.confront.verdict,'confirmee');
 assert.ok(!$('.lang').classList.contains('up'),'bilan scientifique couvert');assert.match($('[data-pg="0:2r"]').textContent,/le défi s’ouvre ensuite/);
 const bi=$('#bil0');bi.value='ab';bi.dispatchEvent(new w.Event('input',{bubbles:true}));$('[data-act="bil"]').click();assert.match($('[data-m]').textContent,/phrase complète/);
 bi.value='Une pile a une borne + et une borne −.';bi.dispatchEvent(new w.Event('input',{bubbles:true}));$('[data-act="bil"]').click();await new Promise(r=>setTimeout(r,80));
 assert.ok($('.lang').classList.contains('up'),'le rabat se soulève');assert.match($('.bs').textContent,/Une pile a deux bornes/);
 $('[data-act="cmp"][data-v="0"]').click();assert.match($('[data-pg="0:2r"]').textContent,/Le verre de la lampe est-il un contact/);
 $('[data-act="def"]').click();assert.match($('[data-pg="0:2r"] [data-m]').textContent,/Choisis une réponse/);
 const df=$('input[name="def:0"][value="non"]');df.checked=true;df.dispatchEvent(new w.Event('change',{bubbles:true}));$('[data-act="def"]').click();
 assert.ok($('.tampon'),'tampon de réussite');assert.match($('.tampon').getAttribute('aria-label'),/3 étoiles sur 3/);assert.match($('[data-pg="0:2r"] .ex').textContent,/Exact/);
 a=JSON.parse(w.localStorage.getItem('pc-act-NL-CI-6E-ELE-01'));assert.equal(a.transfert.rep,'non');assert.ok(a.conclusion&&a.prevision&&a.confront,'la fiche complète retrouve tout le travail');
 assert.ok($('#dots button.ok'),'la lampe du chapitre 1 s’allume dans la barre');
 $('[data-act="suite"]').click();await attend();assert.equal(pg(),'1:0l,1:0r','chapitre suivant');
 $('#bSom').click();await attend();assert.match($('.guir').getAttribute('aria-label'),/1 lampe allumée sur 8/);assert.match($('.chaps [data-c="0"]').textContent,/Réussi · ★★★/);
 /* reprise, données abîmées */
 const bk=w.localStorage.getItem('pc-livre-ci'),ac=w.localStorage.getItem('pc-act-NL-CI-6E-ELE-01');
 w=monde('http://localhost/livre-ci/',{'pc-livre-ci':bk,'pc-act-NL-CI-6E-ELE-01':ac});lance(w);d=w.document;await attend();assert.ok(d.querySelector('.chaps .ok'),'reprise : chapitre 1 réussi');
 w=monde('http://localhost/livre-ci/',{'pc-livre-ci':'{cassé','pc-act-NL-CI-6E-ELE-01':'{x'});lance(w);d=w.document;await attend();assert.equal(d.querySelectorAll('.chaps button').length,8,'données abîmées : le sommaire s’ouvre');
 /* lien direct vers un chapitre fermé : retour à la première double page ; téléphone : une page à la fois */
 w=monde('http://localhost/livre-ci/?c=3&s=3');lance(w);d=w.document;assert.equal([...d.querySelectorAll('#book .page')].map(p=>p.dataset.pg).join(','),'2:0l,2:0r','double page fermée : retour au début du chapitre');
 w=monde('http://localhost/livre-ci/?c=4',{},390);lance(w);d=w.document;await attend();assert.ok(d.body.classList.contains('sgl'));assert.equal(d.querySelectorAll('#book .page').length,1,'téléphone : une page');assert.equal(d.querySelector('#book .page').dataset.pg,'3:0l');
 d.querySelector('#next').click();await attend();assert.equal(d.querySelector('#book .page').dataset.pg,'3:0r','téléphone : page suivante');
 /* huit chapitres : diplôme */
 const full={};IDS.forEach((i,c)=>{full['pc-act-NL-CI-6E-ELE-'+i]={v:1,prevision:{choix:'x',raison:'r',initiale:{choix:'x',raison:'r'},revisions:[]},essais:[],confront:{verdict:'confirmee',preuve:'p'},conclusion:'Mon bilan',transfert:{rep:'non',just:''},aides:0,step:5};});
 full['pc-livre-ci']={nom:'Awa',c:-1,s:0,h:0,d:{},cmp:{},vu:{},tampon:{0:3,1:3,2:2,3:3,4:1,5:3,6:3,7:3}};
 w=monde('http://localhost/livre-ci/',full);lance(w);d=w.document;await attend();assert.match(d.querySelector('.guir').getAttribute('aria-label'),/8 lampes allumées sur 8/);
 d.querySelector('[data-act="diplome"]').click();assert.match(d.querySelector('#volet img').getAttribute('alt'),/Awa/);assert.match(decodeURIComponent(d.querySelector('#volet img').getAttribute('src')),/Diplôme d’électricien·ne[\s\S]*Awa[\s\S]*21 étoiles sur 24/,'diplôme avec le prénom et les étoiles');
 assert.ok(/Ecolier/.test(read('assets/livre/livre.css'))&&/\.zone-e\{[^}]*Ecolier/.test(css),'écriture scolaire pour les réponses de l’élève');
 assert.ok(/prefers-reduced-motion/.test(css)&&/calme\(\)/.test(js),'mouvement réduit respecté');
 console.log('Livre 3D du circuit électrique : huit chapitres, simulation dans la page, réponses partagées avec la fiche, rabat, défi, tampon, guirlande, diplôme, reprise et téléphone contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
