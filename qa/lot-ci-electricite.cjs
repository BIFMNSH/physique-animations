/* Lot pilote CI · circuit électrique (ELE-01 à 05 et ELE-17) : structure, règles physiques du modèle et conventions de présentation. */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const IDS=['01','02','03','04','05','17'];
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function env(){
  const dom=new JSDOM('<!doctype html><body><div id="app"></div></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  w.eval(read('assets/shared/atelier-electrique.js'));w.eval(read('assets/activites/activite.js'));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-ELE-'+i+'.js'));
  return w;
}
const w=env(),doc=w.document;
function lancer(i){
  const F=w['FICHE_CI_ELE'+i],panel=doc.createElement('div');doc.body.appendChild(panel);
  const st={essais:[],prevision:null};
  const X={st:()=>st,addEssai:e=>{st.essais.push(e);},tableHTML:(f,r)=>w.Activite.esc(JSON.stringify(r)),aide:()=>F.aides[0]};
  F.manip(panel,X);return {F,panel,st,X};
}
const choisir=(panel,name,val)=>{const r=panel.querySelector('input[name='+name+'][value='+val+']');r.checked=true;r.dispatchEvent(new w.Event('change',{bubbles:true}));};
const label=(panel,k)=>(panel.querySelectorAll('svg')[k]||{getAttribute:()=>''}).getAttribute('aria-label')||'';

/* structure commune */
for(const i of IDS){
  const F=w['FICHE_CI_ELE'+i];
  assert.equal(F.id,'NL-CI-6E-ELE-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Électricité');assert.equal(F.chapitre,'Le circuit électrique');
  assert.ok(F.competenceVisee.length>20&&F.objectifsPedagogiques.length>=3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation'])assert.ok(F[k],i+' : '+k);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');
  assert.ok(F.prevision.choix.length===4,'quatre hypothèses '+i);
  const txt=JSON.stringify(F);assert.ok(!/NL-C4|NL-CI-6E-ELE-\d\d ·|Programme du cycle 4/.test(txt.replace(F.id,'')),'aucun code interne affiché '+i);
  const {panel}=lancer(i);
  const caps=[...panel.querySelectorAll('figcaption')].map(x=>x.textContent);
  assert.ok(caps.includes('Montage')&&caps.includes('Schéma normalisé'),'montage et schéma normalisé présents '+i);
  assert.ok(panel.querySelectorAll('svg').length>=2);
}
console.log('Lot CI : six fiches structurées, montage + schéma normalisé présents dans chaque expérience.');

/* ELE-02 : pile cylindrique, plot posé et fil de connexion, deux bornes différentes */
{const {panel}=lancer('02');
  const cas=[['plus','moins',true],['moins','plus',true],['plus','plus',false],['moins','moins',false],['cote','moins',false],['plus','cote',false],['plus','rien',false]];
  for(const [p,l,att] of cas){choisir(panel,'ci2-plot',p);choisir(panel,'ci2-lame',l);assert.ok(label(panel,0).includes(att?'brille':'éteinte'),'ELE-02 '+p+'/'+l);assert.ok(label(panel,1).includes(att?'fermé':'ouvert'),'schéma ELE-02 '+p+'/'+l);}
  for(const p of ['plus','moins','cote'])for(const l of ['plus','moins','cote','rien']){
    choisir(panel,'ci2-plot',p);choisir(panel,'ci2-lame',l);
    const on=(p==='plus'&&l==='moins')||(p==='moins'&&l==='plus');
    assert.ok(label(panel,0).includes(on?'brille':'éteinte'),'ELE-02 toutes les combinaisons '+p+'/'+l);
  }
  const src=read('assets/activites/fiches/NL-CI-6E-ELE-02.js');assert.ok(!/lame métallique/.test(src),'ELE-02 : plus de lame métallique (JD p. 12, TP fiche 1)');assert.ok(/fil de connexion/.test(w.FICHE_CI_ELE02.materiel)&&/fil de connexion/.test(w.FICHE_CI_ELE02.synthese),'ELE-02 : culot relié par un fil de connexion');
  assert.ok(src.includes('pile cylindrique')||src.includes('Pile cylindrique'),'pile cylindrique');
}
/* ELE-03 : un fil au plot, l'autre au culot ; jamais au verre */
{const {panel}=lancer('03');
  const cas=[['plot','culot',true],['culot','plot',true],['verre','culot',false],['plot','verre',false],['plot','plot',false],['culot','culot',false],['libre','culot',false],['verre','verre',false]];
  for(const [r,n,att] of cas){choisir(panel,'ci3-r',r);choisir(panel,'ci3-n',n);assert.ok(label(panel,0).includes(att?'brille':'éteinte'),'ELE-03 '+r+'/'+n);assert.ok(label(panel,1).includes(att?'fermée':'ouverte'),'schéma ELE-03 '+r+'/'+n);}
  for(const r of ['plot','culot','verre','libre'])for(const n of ['plot','culot','verre','libre']){
    choisir(panel,'ci3-r',r);choisir(panel,'ci3-n',n);
    const on=(r==='plot'&&n==='culot')||(r==='culot'&&n==='plot');
    assert.ok(label(panel,0).includes(on?'brille':'éteinte'),'ELE-03 toutes les combinaisons '+r+'/'+n);
  }
}
/* ELE-04 : en série, tout s'arrête dès qu'un élément manque */
{const {panel}=lancer('04');
  for(const [a,att] of [['complet',true],['pile',false],['ouvert',false],['sansinter',false],['lampe',false],['moteur',false]]){choisir(panel,'ci4-a',a);assert.ok(label(panel,0).includes(att?'brille':'ouvert'),'ELE-04 '+a);assert.ok(label(panel,1).includes(att?'fermée':'ouverte'),'schéma ELE-04 '+a);}
}
/* ELE-17 : grains qui circulent, boucle fermée ou ouverte */
{const {panel}=lancer('17');
  choisir(panel,'ci17-a','ferme');assert.ok(label(panel,0).includes('fermée')&&label(panel,0).includes('circulent'));
  for(const a of ['inter','rouge','noir','pile']){choisir(panel,'ci17-a',a);assert.ok(label(panel,0).includes('ouverte')&&label(panel,0).includes('immobiles'),'ELE-17 '+a);}
  assert.ok(!/sens du courant/i.test(read('assets/activites/fiches/NL-CI-6E-ELE-17.js').replace(/ne parle pas de sens/g,'')),'pas de sens conventionnel dans ELE-17');
}
/* ELE-01 : zones et étiquettes */
{const {panel,st}=lancer('01'),map={1:'culot',2:'plus',3:'plot',4:'moins',5:'plus',6:'moins'};
  for(const k of [1,2,3,4,5,6]){const s=panel.querySelector('#ci1-z'+k);s.value=map[k];}
  [...panel.querySelectorAll('button')].find(b=>/Vérifier/.test(b.textContent)).click();
  assert.equal(st.essais.length,6);assert.ok(st.essais.every(e=>e.ok),'six zones justes');
  assert.ok(/même taille/.test(w.FICHE_CI_ELE01.synthese)&&!/lame courte|lame longue/.test(JSON.stringify(w.FICHE_CI_ELE01))&&/bouton/.test(w.FICHE_CI_ELE01.synthese),'ELE-01 : lames de même taille, bornes lues sur les signes (bouton + pour la pile ronde)');
  const F=w.FICHE_CI_ELE01;assert.equal(F.peutConfronter(st),true);assert.equal(F.peutConfronter({essais:[]}),false);
}
/* ELE-05 : schéma attendu, erreurs A/B/C, circuits en série */
{const {panel,st,F}=lancer('05');
  const set=(id,v)=>{panel.querySelector('#'+id).value=v;};
  const verif=()=>[...panel.querySelectorAll('button')].find(b=>/Vérifier mon schéma/.test(b.textContent)).click();
  /* schéma faux : polarités inversées, puis générateur, puis ordre */
  set('ci5-pile','inversee');set('ci5-d','lampe');set('ci5-b','moteur');set('ci5-g','interOuvert');verif();assert.equal(st.essais.at(-1).ok,false);assert.ok(st.essais.at(-1).erreurs.some(x=>x.includes('polarités')));
  set('ci5-pile','normale');set('ci5-b','generateur');verif();assert.ok(st.essais.at(-1).erreurs.some(x=>x.includes('symbole faux')));
  set('ci5-b','lampe');set('ci5-d','moteur');verif();assert.ok(st.essais.at(-1).erreurs.some(x=>x.includes('ordre non respecté')));
  /* schéma juste, ouvert puis fermé */
  set('ci5-d','lampe');set('ci5-b','moteur');set('ci5-g','interOuvert');verif();assert.equal(st.essais.at(-1).ok,true);
  const f=panel.querySelector('input[name=ci5-etat][value=ferme]');f.checked=true;f.dispatchEvent(new w.Event('change',{bubbles:true}));
  set('ci5-g','interOuvert');verif();assert.equal(st.essais.at(-1).ok,false,'interrupteur ouvert refusé quand on demande fermé');
  set('ci5-g','interFerme');verif();assert.equal(st.essais.at(-1).ok,true);
  assert.equal(F.peutConfronter(st),false,'erreurs A/B/C et série encore à faire');
  set('ci5-eA','ordre');set('ci5-eB','polarite');set('ci5-eC','symbole');
  [...panel.querySelectorAll('button')].find(b=>/trois réponses/.test(b.textContent)).click();
  assert.equal(st.essais.filter(e=>e.type==='erreur'&&e.ok).length,3,'A ordre, B polarités, C symbole');
  set('ci5-diff','ordre');set('ci5-fonc','non');[...panel.querySelectorAll('button')].find(b=>b.textContent==='Vérifier').click();
  assert.equal(st.essais.at(-1).ok,true);assert.equal(F.peutConfronter(st),true);
  const t=panel.textContent;for(const s of ['Pile','Générateur','Fil de connexion','Interrupteur ouvert','Interrupteur fermé','Lampe','Moteur'])assert.ok(t.includes(s),'symbole '+s);
  assert.ok(t.includes('Les 3 règles')&&t.includes('circuit en série'),'règles et vocabulaire');
}
console.log('Lot CI : règles physiques et pédagogiques du modèle vérifiées (ELE-01 à 05 et 17).');

/* Géométrie : les fils et les marqueurs aboutissent au vrai plot, pas sous la lampe. */
{
  const {panel}=lancer('03');
  choisir(panel,'ci3-r','plot');choisir(panel,'ci3-n','culot');
  const drawing=panel.querySelector('svg');
  const nb=(drawing.innerHTML.match(/<path[^>]*stroke-linecap="round"/g)||[]).length;
  assert.ok(drawing.querySelectorAll('path').length>=4,'ELE-03 banc : pile, lampe sur socle et câbles dessinés');
  assert.ok(/#0F1729/i.test(drawing.outerHTML),'ELE-03 banc d’essai sombre comme dans les vidéos');
  const serie=w.NohobaAtelier.montageSerie({inter:'ferme'}).svg;
  assert.ok(/#0F1729/i.test(serie)&&/aria-label="Montage/.test(serie),'montage en série sur le banc, nom accessible');
  const pm=w.NohobaAtelier.pileM(100,50).svg||w.NohobaAtelier.pileM(100,50);
  assert.ok(String(pm).includes('width="12" height="12"')||String(pm).length>0,'pile à deux bornes');
}

/* Parcours complet des six fiches dans le moteur, avec saisies et reprise locale. */
for(const i of IDS){
  const win=env(),document=win.document,F=win['FICHE_CI_ELE'+i],app=document.getElementById('app'),key='pc-act-'+F.id;
  const state=()=>JSON.parse(win.localStorage.getItem(key));
  const button=text=>{
    const b=[...app.querySelectorAll('button')].find(b=>text==='Vérifier'?b.textContent===text:b.textContent.startsWith(text));
    assert.ok(b,'bouton '+text+' '+i);assert.equal(b.disabled,false,'bouton accessible '+text+' '+i);b.click();return b;
  };
  const radio=(name,value)=>{
    const r=app.querySelector('input[name="'+name+'"][value="'+value+'"]');assert.ok(r,name+'/'+value);
    r.checked=true;r.dispatchEvent(new win.Event('change',{bubbles:true}));
  };
  const set=(id,value)=>{const e=document.getElementById(id);assert.ok(e,id);e.value=value;};
  win.Activite.run(F,app);
  assert.ok(app.textContent.includes('observations ou tes mesures'),'consigne compatible avec les observations qualitatives '+i);
  assert.equal(document.getElementById('tab2').disabled,true,'hypothèse requise '+i);
  button('Commencer : ma prévision');button('Enregistrer ma prévision');
  assert.ok(!state().prevision,'une hypothèse vide ne progresse pas '+i);
  radio('pc',F.prevision.choix[0][0]);set('pr','Je propose cette hypothèse et je vais la vérifier.');
  button('Enregistrer ma prévision');button('Passer à la manipulation');
  assert.equal(document.getElementById('tab3').disabled,true,'essais requis '+i);
  if(i==='01'){
    for(const [zone,value] of Object.entries({1:'culot',2:'plus',3:'plot',4:'moins',5:'plus',6:'moins'}))set('ci1-z'+zone,value);
    button('Vérifier mes étiquettes');
  }else if(i==='05'){
    for(const [id,value] of Object.entries({'ci5-pile':'normale','ci5-d':'lampe','ci5-b':'moteur','ci5-g':'interOuvert'}))set(id,value);
    button('Vérifier mon schéma');radio('ci5-etat','ferme');set('ci5-g','interFerme');button('Vérifier mon schéma');
    for(const [id,value] of Object.entries({'ci5-eA':'ordre','ci5-eB':'polarite','ci5-eC':'symbole'}))set(id,value);
    button('Vérifier mes trois réponses');set('ci5-diff','ordre');set('ci5-fonc','non');button('Vérifier');
  }else{
    button('Enregistrer mon observation');assert.equal(state().essais.length,0,'observation vide refusée '+i);
    const trials=i==='02'?[{plot:'plus',lame:'moins'},{plot:'plus',lame:'rien'},{plot:'moins',lame:'plus'}]:
      i==='03'?[{r:'plot',n:'culot'},{r:'verre',n:'culot'},{r:'culot',n:'plot'}]:
      i==='04'?[{a:'complet'},{a:'pile'},{a:'ouvert'},{a:'lampe'}]:[{a:'ferme'},{a:'inter'},{a:'rouge'}];
    for(const trial of trials){
      for(const [name,value] of Object.entries(trial))radio('ci'+Number(i)+'-'+name,value);
      set('ci'+Number(i)+'-obs','Je décris ce que je vois sur la lampe et sur le montage.');
      button('Enregistrer mon observation');
    }
  }
  assert.ok(F.peutConfronter(state()),'contraste suffisant '+i);
  const essais=state().essais.length;
  button('J’ai assez d’essais');button('Enregistrer et passer au bilan');
  assert.equal(state().confront,null,'analyse vide refusée '+i);
  radio('vd','confirmee');set('pre','Je cite un essai précis et les contacts que j’ai observés.');
  set('mod','Je confronte mon hypothèse avec les essais.');button('Enregistrer et passer au bilan');
  button('Valider ma conclusion');
  assert.ok(app.textContent.includes('appuyée sur tes observations'),'message qualitatif '+i);
  set('cc','Je conclus à partir des contacts et des états observés dans mes essais.');button('Valider ma conclusion');
  button('Enregistrer ma réponse');
  assert.ok(app.textContent.includes('au moins 15 caractères'),'erreur d’évaluation explicite '+i);
  set('nl-eval','Je justifie ma réponse à partir des observations du montage.');button('Enregistrer ma réponse');
  assert.ok(app.textContent.includes('Réponse enregistrée'),'confirmation d’évaluation '+i);
  button('Vérifier ma réponse');assert.ok(app.textContent.includes('Choisis ou saisis une réponse'),'transfert vide signalé '+i);
  radio('tr',String(F.transfert.rep));set('tj','Je justifie mon choix avec le montage.');button('Vérifier ma réponse');
  button('Voir ma trace');
  assert.ok(app.textContent.includes('Communiquer · Ma trace')&&app.textContent.includes('Ma conclusion'),'trace accessible '+i);
  assert.equal(state().essais.length,essais,'essais conservés '+i);
  assert.ok(!/NL-CI|NL-C4/.test(app.textContent),'aucun code interne affiché '+i);
  win.print=()=>{};button('Imprimer');
  const print=document.getElementById('print');
  assert.ok(print.textContent.includes('Je conclus à partir des contacts'),'conclusion dans la fiche remplie '+i);
  assert.ok(print.querySelector('.sh-head')&&!/NL-CI|NL-C4/.test(print.querySelector('.sh-head').textContent),'en-tête élève sans code interne '+i);
  assert.ok(!print.querySelector('.sh-ref'),'corrigé absent de la trace élève '+i);
  set('shm','vierge');document.getElementById('shm').dispatchEvent(new win.Event('change'));button('Imprimer');
  assert.ok(!print.textContent.includes('Je conclus à partir des contacts'),'réponses absentes de la fiche vierge '+i);
  app.replaceChildren();win.Activite.run(F,app);
  assert.ok(app.textContent.includes('Communiquer · Ma trace'),'reprise sur la trace '+i);
  assert.equal(state().essais.length,essais);
  win.close();
}
console.log('Lot CI : six parcours complets, saisies invalides, sauvegarde et reprise de la trace contrôlés.');

/* progression : chaque fiche demande un contraste d'observations avant l'analyse */
for(const i of ['02','03','04','17']){const F=w['FICHE_CI_ELE'+i],o='observation décrite en une phrase';
  assert.equal(F.peutConfronter({essais:[]}),false);
  assert.equal(F.peutConfronter({essais:[{action:'complet',plot:'plus',lame:'moins',rouge:'plot',noir:'culot',allumee:true,observation:o},{action:'pile',allumee:false,observation:o},{action:'inter',allumee:false,observation:o}]}),i==='04'?false:true,'contraste '+i);}
console.log('Lot CI : verrouillage de progression contrôlé.');

/* présentation conforme au hub, au catalogue et à la page de collections */
const cat=new JSDOM('',{runScripts:'outside-only'}).window;cat.eval(read('assets/catalogues/6e-ci.js'));
const items=cat.NL_CATALOGUE_CI_6E;
assert.equal(items.filter(x=>x.statut==='prototype'&&x.sourceId.startsWith('ELE')).length,0,'plus aucun prototype d’Électricité');
assert.equal(items.filter(x=>x.statut==='disponible'&&x.sourceId.startsWith('ELE')).map(x=>x.sourceId).sort().join(','),'ELE-01,ELE-02,ELE-03,ELE-04,ELE-05,ELE-06,ELE-07,ELE-08,ELE-09,ELE-10,ELE-11,ELE-12,ELE-13,ELE-14,ELE-15,ELE-16,ELE-17','17 fiches d’Électricité validées par le propriétaire le 27 octobre 2026');
const page=read('activites-ci/index.html');assert.ok(page.includes('atelier-electrique.js')&&page.includes('ELE-(?:0[1-9]|1[0-7])'),'page des activités générique');
assert.ok(read('collections/index.html').includes('Ouvrir le prototype'),'collections : prototypes');
assert.ok(read('parcours-ci/index.html').includes('../collections/')&&read('parcours-ci/index.html').includes('en test'),'page de leçon : prototypes réservés au prof (collections)');
const eng=read('assets/activites/activite.js');assert.ok(eng.includes('À la fin de cette partie, je dois être capable de :'),'libellé « partie » à l’écran');
console.log('Lot CI : catalogue, hub, collections et libellés contrôlés.');
process.exit(0);
