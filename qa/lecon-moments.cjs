/* Leçon de 6e en neuf moments : conversion de la progression, parcours complet, garde-fous. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.resolve(root,f),'utf8');
const html=read('lecon-ci/index.html'),prog=read('assets/simple/moments-prog.js'),mom=read('assets/simple/moments.js');

function env(url,store={}){
  const w=new JSDOM(html.replace(/<script src[^>]*><\/script>/g,''),{url,runScripts:'outside-only'}).window;
  for(const[k,v]of Object.entries(store))w.localStorage.setItem(k,JSON.stringify(v));
  w.eval(prog);return w;
}
/* 1. conversion d'une progression enregistrée avant la refonte : aucune perte */
{const cas=[
 [{},1,false],
 [{'pc-inquiry-6e-x':{prediction:'a'}},3,false],
 [{'pc-inquiry-6e-x':{prediction:'a',started:true}},4,false],
 [{'pc-inquiry-6e-x':{prediction:'a',started:true,observation:'o'}},6,false],
 [{'pc-inquiry-6e-x':{prediction:'a',started:true,observation:'o',comparison:'c'}},7,false],
 [{'pc-inquiry-6e-x':{prediction:'a',started:true,observation:'o',comparison:'c',conclusion:'b'}},8,false],
 [{'pc-inquiry-6e-x':{started:true,complete:true},'pc-studio-prog':{'6e-x':{defi:true}}},9,true]];
 for(const[s,max,fini]of cas){const w=env('http://localhost/lecon-ci/?l=x',s),r=w.NohobaMoments.lire('x');assert.equal(r.max,max);assert.equal(r.fini,fini);assert.equal(w.NohobaMoments.faits('x'),fini?9:max-1);w.close();}
 const w=env('http://localhost/lecon-ci/?l=x',{'pc-lecon-ci-x':{max:5}});assert.equal(w.NohobaMoments.lire('x').max,5,'la nouvelle progression prime');w.close();}

/* 2. parcours complet avec une leçon simulée */
const FAKE={title:'Leçon d’essai',theme:'Électricité',level:'6e',inquiry:{situation:'Pourquoi la lampe reste-t-elle éteinte ?',prediction:'Prévois et justifie avec « car ».',criteria:['Je décris un essai.']},retiens:['Un circuit <b>fermé</b> laisse passer le courant.']};
function lecteur(store,url='http://localhost/lecon-ci/?l=circuit-electrique'){
  const w=env(url,store);
  w.PROGRAMME={'6e':[{nm:'Électricité',les:[{t:'Le circuit électrique',slug:'circuit-electrique',ready:true},{t:'Commande',slug:'commande-circuit',ready:true}]}]};
  w.NohobaSimple={bindTheme(){}};w.requestAnimationFrame=()=>0;
  const ap=w.document.body.appendChild.bind(w.document.body);
  w.document.body.appendChild=n=>{if(n.tagName==='SCRIPT'){w.__momentsCapture(FAKE);setTimeout(()=>n.onload&&n.onload(),0);return n;}return ap(n);};
  w.eval(mom);return w;
}
const wait=()=>new Promise(r=>setTimeout(r,40));
(async()=>{
 let w=lecteur({}),d=w.document;await wait();
 const T=()=>d.getElementById('mo-h1').textContent,ok=()=>d.getElementById('mo-ok'),t=()=>d.getElementById('mo-t');
 const type=(v)=>{t().value=v;t().dispatchEvent(new w.Event('input'));};
 assert.equal(T(),'Situation-problème');assert.ok(d.getElementById('mo-count').textContent==='Moment 1 sur 9');
 assert.equal(d.querySelectorAll('#mo-bar i').length,9,'neuf repères');
 assert.ok(!d.getElementById('mo-prev').offsetParent===false||d.getElementById('mo-prev').hidden,'pas de retour au premier moment');
 ok().click();assert.equal(T(),'J’analyse et je réponds');
 assert.equal(d.querySelectorAll('#mo-bottom .sp-btn').length,2,'deux entrées');
 assert.equal(d.getElementById('mo-aide').textContent,'J’ai besoin d’aide en regardant une courte vidéo, puis je continue');
 ok().click();assert.ok(d.getElementById('mo-msg').textContent.includes('réponse'),'réponse vide refusée');assert.equal(T(),'J’analyse et je réponds');
 d.getElementById('mo-aide').click();assert.equal(T(),'Une courte vidéo pour m’aider');assert.ok(d.querySelector('iframe.resume').src.includes('embed=resume'));
 ok().click();assert.equal(T(),'J’analyse et je réponds','retour à la réponse après la vidéo');
 type('Il faut fermer le circuit.');ok().click();
 assert.equal(T(),'Je formule mon hypothèse');assert.ok(d.querySelector('.mo-quote').textContent.includes('fermer le circuit'));
 ok().click();assert.equal(T(),'Je formule mon hypothèse','hypothèse vide refusée');
 type('La lampe brille car le circuit est fermé.');ok().click();
 assert.equal(T(),'Je réalise la manipulation');assert.ok(d.querySelector('iframe.sim').src.includes('embed=sim')&&!d.getElementById('hosts').hidden);
 ok().click();assert.equal(T(),'J’observe et j’analyse les résultats');assert.ok(!d.getElementById('hosts').hidden,'la simulation reste visible');
 const sim=d.querySelector('iframe.sim');
 type('Avec le clou, la lampe brille.');ok().click();
 assert.equal(T(),'Je confronte les résultats à mon hypothèse');assert.ok(d.getElementById('hosts').hidden,'simulation masquée hors manipulation');
 type('Hypothèse confirmée car la lampe brille.');ok().click();
 assert.equal(T(),'Je rédige mon bilan');assert.ok(d.querySelector('.mo-crit').textContent.includes('Je décris un essai.'));
 type('Un circuit fermé laisse passer le courant.');ok().click();
 assert.equal(T(),'Je compare avec le bilan scientifique');assert.ok(d.body.textContent.includes('Un circuit fermé laisse passer le courant.')&&d.querySelector('.mo-crit.sci li b'));
 const Q=()=>JSON.parse(w.localStorage.getItem('pc-inquiry-6e-circuit-electrique'));
 assert.ok(!Q().complete);ok().click();assert.ok(Q().complete);
 assert.equal(T(),'Je relève un défi, seul ou en équipe');assert.ok(d.querySelector('iframe.defi').src.includes('embed=defi'));assert.ok(d.querySelector('iframe.sim')===sim,'la simulation n’est pas rechargée');
 assert.equal(d.getElementById('mo-count').textContent,'Moment 9 sur 9');
 ok().click();assert.equal(T(),'Leçon terminée. Bravo !');assert.ok(d.querySelector('#mo-bottom a').textContent.includes('Commande'),'leçon suivante proposée');
 const s=JSON.parse(w.localStorage.getItem('pc-lecon-ci-circuit-electrique'));assert.equal(s.fini,true);assert.equal(w.NohobaMoments.faits('circuit-electrique'),9);
 assert.deepEqual(Object.keys(Q()).sort(),['comparison','complete','conclusion','observation','prediction','reponse','started'],'trace élève dans la clé d’origine');
 w.close();
 /* retour en arrière sans perte, reprise au bon moment */
 w=lecteur({'pc-inquiry-6e-circuit-electrique':{prediction:'p',started:true,observation:'o'}},'http://localhost/lecon-ci/?l=circuit-electrique');d=w.document;await wait();
 assert.equal(d.getElementById('mo-count').textContent,'Moment 6 sur 9','ancienne trace : reprise à la confrontation');
 d.getElementById('mo-prev').click();assert.equal(d.getElementById('mo-t').value,'o','observations conservées');
 w.close();
 /* aucun quiz, aucun code interne, aucun onglet Studio côté élève */
 const txt=mom+html+read('assets/simple/moments.css');
 assert.ok(!/quiz|Essaie|ELE-|NL-C|Programme du cycle 4/i.test(mom+html),'ni quiz ni étape Essaie ni code interne');
 assert.ok(read('assets/studio/studio.js').includes("embed=(resume|sim|defi)")&&read('assets/studio/studio.js').includes('top.hidden = true'),'mode intégré du Studio');
 const sw=read('sw.js');for(const f of ['lecon-ci/','assets/simple/moments.js','assets/simple/moments-prog.js','assets/simple/moments.css'])assert.ok(sw.includes(f),'hors-ligne : '+f);
 console.log('Leçon en neuf moments : conversion, parcours, reprise, cadres intégrés et vocabulaire contrôlés.');
})().catch(e=>{console.error(e);process.exit(1);});
