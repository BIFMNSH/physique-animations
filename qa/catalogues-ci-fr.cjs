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
assert.equal(ci.filter(x=>x.statut==='disponible').map(x=>x.id).join(','),'NL-CI-6E-ELE-07','seul pilote disponible');
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

const hubHTML=fs.readFileSync(path.join(root,'parcours-ci/index.html'),'utf8');
assert.ok(hubHTML.includes('window.PROGRAMME'),'hub relié aux leçons 6e existantes');
assert.ok(hubHTML.includes('NL-CI-6E-ELE-07'),'hub relié au pilote ELE-07');
assert.ok(hubHTML.includes("../lecon/?l='+slug+'#sim"),'lien vers simulateur Studio existant');
assert.ok(fs.readFileSync(path.join(root,'assets/studio/hub.js'),'utf8').includes('../parcours-ci/?l=circuit-electrique'),'hub accessible depuis accueil 6e');
assert.ok(fs.readFileSync(path.join(root,'activites-ci/index.html'),'utf8').includes('Retour à la leçon'),'retour depuis la fiche investigation');
console.log('Hub de leçon : navigation 6e, Studio et ELE-07 contrôlée statiquement.');

assert.ok(hubHTML.includes('class="quicknav"'),'navigation rapide du hub');
assert.ok(hubHTML.includes("document.createElement('optgroup')"),'sélecteur de leçons par thème');
assert.ok(hubHTML.includes('prefers-reduced-motion'),'adaptation accessibilité animations');
assert.ok(hubHTML.includes('max-width:750px'),'présentation mobile prévue');
console.log('Ergonomie hub : navigation, regroupement, mobile et mouvements réduits couverts.');

const sharedCircuit=fs.readFileSync(path.join(root,'assets/shared/conductivite-circuit.js'),'utf8');
assert.ok(sharedCircuit.includes('window.NohobaCircuit'),'composant circuit commun exporté');
assert.ok(sharedCircuit.includes('function update(values)'),'composant circuit pilotable par l’état expérimental');
assert.ok(modelSrc.includes('window.NohobaCircuit.create'),'ELE-07 utilise le composant réutilisable');
assert.ok(fs.readFileSync(path.join(root,'activites-ci/index.html'),'utf8').includes('../assets/shared/conductivite-circuit.js'),'script commun chargé avant ELE-07');
console.log('Composant électrique : rendu mutualisable et intégration ELE-07 contrôlés statiquement.');

const qualitativeSrc=fs.readFileSync(path.join(root,'assets/shared/conductivite-modele.js'),'utf8');
const commonCtx={window:{}};vm.createContext(commonCtx);vm.runInContext(qualitativeSrc,commonCtx);
for(const id of ['cuivre','acier','aluminium'])assert.equal(commonCtx.window.NohobaConductivite.evaluer({id,contact:true,pile:true}).allumee,true,'conducteur '+id);
for(const id of ['plastique','bois'])assert.equal(commonCtx.window.NohobaConductivite.evaluer({id,contact:true,pile:true}).allumee,false,'isolant '+id);
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
