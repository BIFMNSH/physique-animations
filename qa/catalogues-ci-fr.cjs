/* Vérification des deux catalogues pédagogiques distincts. Node.js, sans dépendance. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['assets/catalogues/6e-ci.js','assets/activites/catalogue.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const ci=ctx.window.NL_CATALOGUE_CI_6E,fr=ctx.window.ACTIVITES;
assert.equal(ci.length,70,'70 entrées Côte d’Ivoire');
assert.equal(fr.length,48,'48 entrées France cycle 4');
assert.equal(new Set(ci.map(x=>x.id)).size,70,'identifiants CI uniques');
assert.equal(new Set(fr.map(x=>x.id)).size,48,'identifiants France uniques');
assert.ok(ci.every(x=>x.programme==='CI'&&x.niveau==='6e'&&['conception','disponible'].includes(x.statut)&&x.id.startsWith('NL-CI-6E-')),'catalogue CI séparé');
assert.deepEqual(ci.filter(x=>x.statut==='disponible').map(x=>x.id),['NL-CI-6E-ELE-07'],'seul pilote disponible');
assert.ok(fr.every(x=>['5e','4e','3e'].includes(x.niveau)),'niveaux du programme français');
assert.ok(ci.every(x=>!fr.some(y=>y.id===x.id)),'espaces d’identifiants distincts');
const totals={};for(const x of ci)totals[x.theme]=(totals[x.theme]||0)+1;
assert.equal(totals['Électricité'],16);
assert.equal(totals['Propriétés physiques de la matière'],25);
assert.equal(totals['Grandeurs et mesures physiques'],10);
assert.equal(totals['Air et combustions'],19);
assert.equal(new Set(ci.map(x=>x.theme+'|'+x.lecon)).size,13);
console.log('Catalogues vérifiés : 70 CI + 48 FR, 4 thèmes CI, 13 leçons CI.');

const engine=fs.readFileSync(path.join(root,'assets/activites/activite.js'),'utf8');
const scientific=['Problématiser','Émettre une hypothèse','Expérimenter / Investiguer','Analyser et interpréter','Conclure','Communiquer'];
const labels=engine.match(/var STEPS = \[([^\]]+)\]/);
assert.ok(labels,'table des six opérations présente');
for(const word of scientific)assert.ok(labels[1].includes("'"+word+"'"),'opération présente : '+word);
assert.ok(engine.includes('[sSituation, sPrevision, sManip, sConfront, sBilan, sTrace][view]()'),'six contrôleurs historiques conservés');
assert.ok(engine.includes("localStorage.setItem(key, JSON.stringify(st))"),'persistance historique conservée');
console.log('Moteur pédagogique : six opérations scientifiques et contrôleurs historiques préservés.');

for(const [index,title] of scientific.entries())assert.ok(engine.includes("sec("+(index+1)+", '"+title+"'"),'rubrique imprimée '+(index+1)+' : '+title);
console.log('Impression : six rubriques scientifiques distinctes vérifiées statiquement.');

const modelSrc=fs.readFileSync(path.join(root,'assets/activites/fiches/NL-CI-6E-ELE-07.js'),'utf8');
const fnctx={window:{},Activite:{h(){},esc:x=>String(x)}};vm.createContext(fnctx);vm.runInContext(modelSrc,fnctx);
const ele=fnctx.window.FICHE_CI_ELE07;assert.equal(ele.id,'NL-CI-6E-ELE-07');
assert.equal(ele.colonnes.length,4);
assert.ok(ele.manip&&ele.lignes&&ele.prevision&&ele.prof&&ele.aides);
assert.ok(ele.protocole.length>=3);
assert.ok(fs.existsSync(path.join(root,'activites-ci/index.html')));
assert.ok(fs.readFileSync(path.join(root,'collections/index.html'),'utf8').includes('activites-ci/'));
console.log('Pilote CI ELE-07 : structure et route présentes.');
