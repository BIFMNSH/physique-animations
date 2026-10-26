/* Vérification des deux catalogues pédagogiques distincts. Node.js, sans dépendance. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['assets/catalogues/6e-ci.js','assets/activites/catalogue.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const ci=ctx.window.NL_CATALOGUE_CI_6E,fr=ctx.window.ACTIVITES;
assert.equal(ci.length,73,'73 entrées Côte d’Ivoire');
assert.equal(fr.length,48,'48 entrées France cycle 4');
assert.equal(new Set(ci.map(x=>x.id)).size,73,'identifiants CI uniques');
assert.equal(new Set(fr.map(x=>x.id)).size,48,'identifiants France uniques');
assert.ok(ci.every(x=>x.programme==='CI'&&x.niveau==='6e'&&['conception','prototype','disponible'].includes(x.statut)&&x.id.startsWith('NL-CI-6E-')),'catalogue CI séparé');
assert.equal(ci.filter(x=>x.statut==='disponible').map(x=>x.id).join(','),'NL-CI-6E-ELE-07','seul pilote disponible');
assert.ok(fr.every(x=>['5e','4e','3e'].includes(x.niveau)),'niveaux du programme français');
assert.ok(ci.every(x=>!fr.some(y=>y.id===x.id)),'espaces d’identifiants distincts');
const totals={};for(const x of ci)totals[x.theme]=(totals[x.theme]||0)+1;
assert.equal(totals['Électricité'],17);
assert.equal(totals['Propriétés physiques de la matière'],26);
assert.equal(totals['Grandeurs et mesures physiques'],10);
assert.equal(totals['Air et combustions'],20);
assert.equal(new Set(ci.map(x=>x.theme+'|'+x.lecon)).size,13);
assert.ok(['MAT-26','CHI-20'].every(i=>ci.some(x=>x.sourceId===i&&x.statut==='conception'))&&ci.some(x=>x.sourceId==='ELE-17'),'trois fiches complémentaires décidées');
console.log('Catalogues vérifiés : 73 CI + 48 FR, 4 thèmes CI, 13 leçons CI.');

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
assert.equal(ele.colonnes.length,5,'tableau des essais avec observation élève');
assert.ok(ele.manip&&ele.lignes&&ele.prevision&&ele.prof&&ele.aides);
assert.ok(ele.protocole.length>=3);
assert.ok(fs.existsSync(path.join(root,'activites-ci/index.html')));
assert.ok(fs.readFileSync(path.join(root,'collections/index.html'),'utf8').includes('activites-ci/'));
console.log('Pilote CI ELE-07 : structure et route présentes.');

const valide=(id,contact,pile,allumee,observation='La lampe est '+(allumee?'allumée.':'éteinte.'))=>({id,contact,pile,allumee,observation});
assert.equal(ele.peutConfronter({essais:[]}),false,'sans essai');
assert.equal(ele.peutConfronter({essais:[valide('cuivre',true,true,true)]}),false,'un seul matériau');
assert.equal(ele.peutConfronter({essais:[valide('cuivre',true,true,true),valide('plastique',true,true,false)]}),true,'comparaison valide');
assert.equal(ele.peutConfronter({essais:[valide('cuivre',true,false,false),valide('plastique',true,true,false)]}),false,'pile défaillante exclue');
assert.equal(ele.peutConfronter({essais:[valide('cuivre',false,true,false),valide('plastique',true,true,false)]}),false,'contact ouvert exclu');
assert.ok(engine.includes('!readyForAnalysis()'),'blocage moteur avant analyse');
assert.ok(engine.includes('esc(F.resume(e))'),'échappement des observations dans la trace');
console.log('ELE-07 : conditions expérimentales et verrouillage de progression vérifiés.');

assert.equal(ele.peutConfronter({essais:[valide('cuivre',true,true,true,''),valide('plastique',true,true,false)]}),false,'observation écrite requise');
assert.equal(ele.colonnes.length,5,'colonne observation élève');
assert.ok(ele.situation.includes('Awa'),'situation contextualisée');
console.log('ELE-07 : traces rédigées et problème contextualisé contrôlés.');

assert.equal(ele.guidage,true,'deux modes prévus');
assert.equal(ele.grilleMaitrise.length,4,'quatre niveaux de maîtrise');
assert.equal(ele.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM','niveaux MI/MF/MS/TBM');
assert.ok(ele.situationEvaluation.includes('Awa'),'évaluation contextualisée');
assert.ok(engine.includes("st.guidage = gs.value"),'choix de guidage sauvegardé');
assert.ok(engine.includes("st.evaluation=ev.value.trim()"),'production d’évaluation sauvegardée');
assert.ok(engine.includes("field('Ma réponse argumentée :',filled?st.evaluation:''"),'trace imprimable de l’évaluation');
console.log('ELE-07 : modes différenciés, évaluation et indicateurs contrôlés.');

const hubHTML=fs.readFileSync(path.join(root,'parcours-ci/index.html'),'utf8'),etapesJS=fs.readFileSync(path.join(root,'assets/simple/etapes-ci.js'),'utf8');
assert.ok(hubHTML.includes('window.PROGRAMME'),'page de leçon reliée aux leçons 6e existantes');
assert.ok(etapesJS.includes('NL-CI-6E-ELE-07'),'pilote ELE-07 proposé même sans catalogue');
assert.ok(etapesJS.includes("L + '#sim'"),'lien vers la démarche Studio existante');
assert.ok(fs.readFileSync(path.join(root,'assets/simple/classe.js'),'utf8').includes('../parcours-ci/?l='),'page de leçon accessible depuis la classe 6e');
assert.ok(fs.readFileSync(path.join(root,'activites-ci/index.html'),'utf8').includes('Retour à la leçon'),'retour depuis la fiche investigation');
assert.ok(hubHTML.includes('imprimer=fiche')&&fs.readFileSync(path.join(root,'assets/studio/studio.js'),'utf8').includes('imprimer=fiche'),'impression de la fiche élève (espace prof)');
assert.ok(etapesJS.includes("pc-inquiry-6e-"),'étapes 2 à 4 fermées tant que la démarche n’est pas terminée');
assert.ok(!/ELE-\d|NL-CI|Studio|Prototype/.test(hubHTML.replace(/<script[\s\S]*?<\/script>/g,'')),'aucun code interne ni jargon à l’écran');
const studioSrc=fs.readFileSync(path.join(root,'assets/studio/studio.js'),'utf8');
assert.ok(studioSrc.includes("name !== 'sim' && name !== 'resume'"),'moteur : le résumé reste ouvert avant la démarche');
assert.ok(studioSrc.includes('regarde le résumé ou manipule la simulation, puis reviens'),'moteur : message clair si défi ou quiz trop tôt');
assert.ok(studioSrc.includes('Je ne sais pas encore : voir le résumé'),'moteur : sortie « je ne sais pas encore » dans la prévision');
console.log('Page de leçon 6e : quatre étapes, liens Studio et ELE-07 contrôlés statiquement.');

const sharedCircuit=fs.readFileSync(path.join(root,'assets/shared/conductivite-circuit.js'),'utf8');
assert.ok(sharedCircuit.includes('window.NohobaCircuit'),'composant circuit commun exporté');
assert.ok(sharedCircuit.includes('function update(values)'),'composant circuit pilotable par l’état expérimental');
assert.ok(modelSrc.includes('window.NohobaCircuit.create'),'ELE-07 utilise le composant réutilisable');
assert.ok(fs.readFileSync(path.join(root,'activites-ci/index.html'),'utf8').includes('../assets/shared/conductivite-circuit.js'),'script commun chargé avant ELE-07');
console.log('Composant électrique : rendu mutualisable et intégration ELE-07 contrôlés statiquement.');

const qualitativeSrc=fs.readFileSync(path.join(root,'assets/shared/conductivite-modele.js'),'utf8');
const commonCtx={window:{}};vm.createContext(commonCtx);vm.runInContext(qualitativeSrc,commonCtx);
for(const id of ['cuivre','acier','aluminium','graphite'])assert.equal(commonCtx.window.NohobaConductivite.evaluer({id,contact:true,pile:true}).allumee,true,'conducteur '+id);
for(const id of ['plastique','bois','air'])assert.equal(commonCtx.window.NohobaConductivite.evaluer({id,contact:true,pile:true}).allumee,false,'isolant '+id);
assert.equal(commonCtx.window.NohobaConductivite.evaluer({id:'cuivre',contact:false,pile:true}).valide,false,'contact ouvert non valide');
assert.equal(commonCtx.window.NohobaConductivite.evaluer({id:'cuivre',contact:true,pile:false}).allumee,false,'pile défaillante');
assert.ok(modelSrc.includes('window.NohobaConductivite.evaluer'),'ELE07 utilise modèle commun');
assert.ok(fs.readFileSync(path.join(root,'assets/studio/lecons/circuit-electrique.js'),'utf8').includes('window.NohobaConductivite.evaluer'),'Studio utilise modèle commun');
assert.ok(fs.readFileSync(path.join(root,'lecon/index.html'),'utf8').includes("l === 'circuit-electrique'"),'modèle chargé seulement pour Studio circuit');
console.log('Mutualisation des règles de conductivité entre Studio et ELE-07 vérifiée.');

assert.equal(ele.theme,'Électricité','thème du programme ivoirien');
assert.equal(ele.chapitre,'Le circuit électrique','chapitre');
assert.ok(ele.competenceVisee.includes('conducteurs et isolants'),'compétence explicite');
assert.equal(ele.objectifsPedagogiques.length,5,'cinq objectifs pédagogiques observables');
assert.ok(engine.includes("F.competenceVisee"),'encadré pédagogique dans activité');
assert.ok(engine.includes("compBox || pedagogiePrint"),'encadré pédagogique dans fiche imprimable');
console.log('ELE-07 : thème, chapitre, compétence et objectifs, écran et impression.');

assert.ok(!/esc\(F\.id\)\s*\+\s*' · '/.test(engine),'le code interne de la fiche ne s’imprime pas dans l’en-tête');
console.log('Impression : aucun code interne dans l’en-tête de la fiche.');

{
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<div id="s"></div><div id="p"></div>',{runScripts:'outside-only'});
const w=dom.window;
w.eval(fs.readFileSync(path.join(root,'assets/shared/conductivite-modele.js'),'utf8'));
w.eval(fs.readFileSync(path.join(root,'assets/shared/conductivite-circuit.js'),'utf8'));
const NC=w.NohobaCircuit,M=w.NohobaConductivite.materiaux;
assert.equal(NC.ordre.length,12,'douze objets dans la palette');
assert.ok(NC.ordre.every(id=>M[id]),'chaque objet de la palette a une règle');
const conducteurs=NC.ordre.filter(id=>M[id].conducteur);
assert.ok(conducteurs.length>=6&&conducteurs.length<=8,'palette équilibrée entre conducteurs et isolants');
assert.notEqual(NC.ordre.slice(0,6).filter(id=>M[id].conducteur).length,6,'palette mélangée, pas triée');
const sc=NC.create(w.document.getElementById('s'));
for(const id of NC.ordre){
  const c=M[id].conducteur;
  assert.equal(sc.update({id,contact:true,pile:true,conducteur:c}),c,'lampe '+id);
  assert.equal(sc.update({id,contact:false,pile:true,conducteur:c}),false,'contact ouvert '+id);
  assert.equal(sc.update({id,contact:true,pile:false,conducteur:c}),false,'pile défaillante '+id);
}
const picks=[];const pal=NC.palette(w.document.getElementById('p'),NC.ordre,id=>picks.push(id),'cle');
const btns=w.document.querySelectorAll('#p button');
assert.equal(btns.length,12,'douze boutons');
assert.equal(btns[3].getAttribute('aria-pressed'),'true','objet sélectionné annoncé');
btns[0].click();assert.equal(picks[0],NC.ordre[0],'clic sur un objet');
assert.equal(btns[0].getAttribute('aria-pressed'),'true');
assert.ok(!/conducteur|isolant/i.test(w.document.getElementById('p').textContent),'la palette ne donne pas la réponse');
console.log('Table d’essai : douze objets, états de la lampe, accessibilité de la palette et absence de réponse vérifiés.');
}
