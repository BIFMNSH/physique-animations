const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname, '..');let checks=0;
function check(x,msg){assert(x,msg);checks++;}
function setup(lesson,prof={}){
 const dom=new JSDOM('<html><body></body></html>',{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;let frames=[],time=w.performance.now();
 w.requestAnimationFrame=f=>frames.push(f);w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});w.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:100,height:30});
 w.localStorage.setItem('pc-studio-prof',JSON.stringify(prof));
 const load=p=>w.eval(fs.readFileSync(path.join(root,p),'utf8'));
 load('assets/studio/studio.js');load('assets/studio/programme.js');for(const k of ['elec','thermo','combustion'])load('assets/studio/kits/'+k+'.js');load('assets/studio/lecons/'+lesson+'.js');
 const btn=t=>[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===t||b.textContent.includes(t));
 function ticks(n=80){for(let i=0;i<n;i++){time+=50;const run=frames;frames=[];run.forEach(f=>f(time));}}
 return {dom,w,btn,ticks};
}
{
 const {dom,w,btn,ticks}=setup('association-lampes',{timed:true,on:true});const d=w.document;
 check(d.querySelector('.main').hidden,'experiment hidden before prediction');
 btn('Enregistrer ma prévision').click();check(d.querySelector('.main').hidden,'blank prediction rejected');
 const pred=d.querySelector('#inquiry-prediction');pred.value='Je prévois deux lampes indépendantes en dérivation car elles ont deux branches.';pred.dispatchEvent(new w.Event('input'));btn('Enregistrer ma prévision').click();
 check(!d.querySelector('.main').hidden,'experiment unlocked');check(pred.readOnly,'initial prediction immutable');
 btn('Bilan').click();check(d.querySelector('.res').hidden,'scientific synthesis withheld');
 for(const id of ['observation','comparison','conclusion']){const x=d.querySelector('#inquiry-'+id);x.value='Réponse justifiée pour '+id;x.dispatchEvent(new w.Event('input'));}
 btn('Comparer avec le bilan scientifique').click();check(!d.querySelector('.res').hidden,'synthesis unlocked after confrontation');
 w.dispatchEvent(new w.Event('beforeprint'));check(!d.querySelector('#fiche').textContent.includes('Corrigé professeur'),'pupil print no answers');check(!d.querySelector('#fiche').textContent.includes('À retenir'),'pupil print no premade synthesis');check(d.querySelector('#fiche').textContent.includes(pred.value),'pupil prediction printed');
 d.querySelector('button[aria-label="Mode enseignant"]').focus();d.querySelector('button[aria-label="Mode enseignant"]').click();let modal=d.querySelector('.modal[aria-label="Mode enseignant"]');check(modal.contains(d.activeElement),'focus enters modal');d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));check(modal.hidden,'Escape closes teacher modal');check(d.activeElement.getAttribute('aria-label')==='Mode enseignant','focus restored');
 btn('Annoter').click();check(btn('Annoter').getAttribute('aria-pressed')==='true','annotation enabled');btn('Annoter').click();check(btn('Annoter').getAttribute('aria-pressed')==='false','annotation disabled');
 btn('Défi').click();btn('Jouer seul').click();const clock=()=>d.querySelector('.mission svg')?.getAttribute('aria-label');const before=clock();btn('Quiz').click();ticks();check(clock()===before,'clock paused under quiz');btn('Fermer le quiz').click();ticks();check(clock()!==before,'clock resumes after quiz');
 btn('Investigation').click();const paused=clock();ticks();check(clock()===paused,'clock paused outside challenge');btn('Défi').click();ticks();check(clock()!==paused,'challenge resumes on return');
 check(JSON.parse(w.localStorage.getItem('pc-inquiry-5e-association-lampes')).prediction===pred.value,'prediction persisted');
 dom.window.close();
}
for(const filename of fs.readdirSync(path.join(root,'assets/studio/lecons'))){const {dom,w,btn,ticks}=setup(filename.replace('.js',''));if(!w.document.querySelector('#inquiry-prediction'))btn('Simulation').click();for(const input of w.document.querySelectorAll('input[type=range]')){input.value=input.max;input.dispatchEvent(new w.Event('input'));input.value=input.min;input.dispatchEvent(new w.Event('input'));}ticks(3);check(!!w.document.querySelector('.stage'),'loaded '+filename);dom.window.close();}
const ph=fs.readFileSync(path.join(root,'assets/sim/ph.js'),'utf8');const classify=new Function('return '+ph.match(/function P\(t\)\{[^}]+\}/)[0])();check(classify(6.6)==='acide'&&classify(7)==='neutre'&&classify(7.4)==='basique','pH classification');
for(const dir of ['assets/studio','assets/studio/lecons','assets/studio/kits','assets/sim'])for(const f of fs.readdirSync(path.join(root,dir)))if(f.endsWith('.js'))new Function(fs.readFileSync(path.join(root,dir,f),'utf8'));
console.log(JSON.stringify({checks,studioModules:29,result:'PASS'}));
