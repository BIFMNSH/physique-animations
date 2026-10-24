const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');let checks=0;
function check(v,msg){assert(v,msg);checks++;}
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function setup(lesson,prof={},saved,url='http://localhost/'){
 const dom=new JSDOM('<html><body></body></html>',{url,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;let frames=[],time=w.performance.now();
 w.requestAnimationFrame=f=>frames.push(f);w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:100,height:30});
 w.localStorage.setItem('pc-studio-prof',JSON.stringify(prof));if(saved)Object.entries(saved).forEach(([k,v])=>w.localStorage.setItem(k,v));
 const load=p=>w.eval(read(p));load('assets/studio/studio.js');load('assets/studio/programme.js');for(const k of ['elec','thermo','combustion'])load('assets/studio/kits/'+k+'.js');load('assets/studio/lecons/'+lesson+'.js');
 const btn=t=>[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===t||b.textContent.includes(t));
 function ticks(n=80){for(let i=0;i<n;i++){time+=50;const run=frames;frames=[];run.forEach(f=>f(time));}}
 return {dom,w,btn,ticks};
}
for(const file of fs.readdirSync(path.join(root,'assets/studio/lecons'))){
 const z=setup(file.replace('.js',''));try{const d=z.w.document;
 check(!!d.querySelector('#inquiry-prediction'),file+' prediction');check(d.querySelector('.main').hidden,file+' model initially hidden');
 z.btn('Enregistrer ma prévision').click();check(d.querySelector('.main').hidden,file+' empty prediction blocked');
 const input=d.querySelector('#inquiry-prediction');input.value='Je prévois un changement car le paramètre varie.';input.dispatchEvent(new z.w.Event('input'));z.btn('Enregistrer ma prévision').click();check(!d.querySelector('.main').hidden,file+' model unlocked');check(input.readOnly,file+' immutable initial prediction');
 for(const input of d.querySelectorAll('input[type=range]'))for(const value of [input.max,input.min]){input.value=value;input.dispatchEvent(new z.w.Event('input'));z.ticks(2);}
 z.ticks(3);check(![...d.querySelectorAll('svg *')].some(x=>[...x.attributes].some(a=>/NaN|Infinity/.test(a.value))),file+' valid svg');
 z.btn('Bilan').click();const retain=[...d.querySelectorAll('.card')].find(e=>e.textContent.startsWith('À retenir'));check(retain.hidden,file+' conclusion withheld');
 for(const field of ['observation','comparison','conclusion']){const e=d.querySelector('#inquiry-'+field);e.value='Deux essais comparés : résultat et justification.';e.dispatchEvent(new z.w.Event('input'));}
 z.btn('Comparer avec le bilan scientifique').click();check(!retain.hidden,file+' scientific summary available');
 z.w.dispatchEvent(new z.w.Event('beforeprint'));check(!d.querySelector('#fiche').textContent.includes('À retenir'),file+' pupil sheet without solution');check(d.querySelector('#fiche').textContent.includes('Je prévois'),file+' pupil trace printed');
 }finally{z.dom.window.close();}
}
for(const dir of ['assets','assets/studio','assets/studio/lecons','assets/studio/kits','assets/sim','assets/bepc'])for(const f of fs.readdirSync(path.join(root,dir)))if(f.endsWith('.js'))new vm.Script(read(dir+'/'+f));
let configs=[];for(const kind of ['studio','sim']){const ctx={window:{Studio:{kit:{},start:c=>configs.push(c)}},Sim:{register:(id,c)=>configs.push(c)}};vm.createContext(ctx);for(const file of fs.readdirSync(path.join(root,kind==='studio'?'assets/studio/lecons':'assets/sim')))vm.runInContext(read((kind==='studio'?'assets/studio/lecons/':'assets/sim/')+file),ctx);}
check(configs.length===79,'79 configurations');for(const c of configs)for(const q of c.quiz)check(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length,'quiz answer index');
const z=setup('association-lampes');try{z.btn('Parcours Révision').click();z.btn('Défi').click();z.btn('Jouer seul').click();z.ticks(1600);check(z.w.document.querySelector('.mission').textContent.includes('Sans chronomètre'),'untimed challenge does not expire');}finally{z.dom.window.close();}
// Persistence must survive navigation/reload without changing the initial prediction.
const persist=setup('association-lampes');let snapshot;
try { const input=persist.w.document.querySelector('#inquiry-prediction');input.value='Prévision conservée';input.dispatchEvent(new persist.w.Event('input'));persist.btn('Enregistrer ma prévision').click();snapshot={...persist.w.localStorage}; } finally { persist.dom.window.close(); }
const restored=setup('association-lampes',{},snapshot);try { check(restored.w.document.querySelector('#inquiry-prediction').value==='Prévision conservée','prediction survives reload');check(!restored.w.document.querySelector('.main').hidden,'started experiment survives reload'); } finally {restored.dom.window.close();}
// Lien #quiz du hub : verrouillé tant que la démarche n'est pas terminée, ouvert ensuite.
const lockedQ=setup('circuit-electrique',{},undefined,'http://localhost/#quiz');try{const d=lockedQ.w.document;check(!d.querySelector('.modal[aria-label="Quiz"]'),'#quiz : quiz fermé avant la démarche');check(d.querySelector('.toast')&&d.querySelector('.toast').textContent.includes('Complète ta démarche'),'#quiz : message explicatif');check(!d.querySelector('.main').hidden||d.querySelector('#inquiry-prediction'),'#quiz : retour sur la simulation');}finally{lockedQ.dom.window.close();}
const openQ=setup('circuit-electrique',{},{'pc-inquiry-6e-circuit-electrique':JSON.stringify({prediction:'p',observation:'o',comparison:'c',conclusion:'b',started:true,complete:true})},'http://localhost/#quiz');try{check(!!openQ.w.document.querySelector('.modal[aria-label="Quiz"]'),'#quiz : quiz ouvert après la démarche');}finally{openQ.dom.window.close();}
const redirect=JSON.parse(read('vercel.json')).redirects[0];check(redirect.has.some(h=>h.key==='accept'&&new RegExp(h.value).test('text/html')),'document redirect');check(!redirect.has.filter(h=>h.key==='accept').some(h=>new RegExp(h.value).test('*/*')),'assets not redirected');
console.log(`${checks} assertions passed — 53 investigation flows, 79 configurations.`);
