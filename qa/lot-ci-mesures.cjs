/* Lot CI · Mesure de grandeurs physiques (MES-01 à MES-11) et bilans « L'essentiel » :
   règles des modèles, structure des fiches, parcours complets dans le moteur (classements, mesures saisies, pesées à la balance de Roberval),
   catalogue, pages, hors-ligne et garde-fous (aucun quotient masse ÷ volume, aucun code interne, aucun corrigé dans la trace). */
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const deq=(a,b,m)=>assert.equal(JSON.stringify(a),JSON.stringify(b),m); /* objets de jsdom : comparaison par valeur */
const IDS=[];for(let n=1;n<=11;n++)IDS.push(String(n).padStart(2,'0'));
const SHARED=['atelier-electrique','matiere-modele','matiere-dessins','matiere-scenes','matiere-ui','mesures-modele','mesures-dessins','mesures-scenes','mesures-ui'].map(x=>'assets/shared/'+x+'.js');
function env(){
  const dom=new JSDOM('<!doctype html><body><div id="app"></div></body>',{url:'http://localhost/',runScripts:'outside-only'});
  const w=dom.window;w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:true});
  for(const f of [...SHARED,'assets/activites/activite.js'])w.eval(read(f));
  for(const i of IDS)w.eval(read('assets/activites/fiches/NL-CI-6E-MES-'+i+'.js'));
  return w;
}
const w=env(),Q=w.NohobaMesures;

/* ---------- règles des modèles ---------- */
assert.equal(Q.convertir(1.5,'L','mL'),1500);assert.equal(Q.convertir(250,'mL','cL'),25);assert.equal(Q.convertir(1,'dm³','L'),1);assert.equal(Q.convertir(50,'cm³','mL'),50);assert.equal(Q.convertir(1,'m³','L'),1000);
for(const c of Q.CONVERSIONS_VOL){assert.equal(c.options.filter(o=>o[0]===c.juste).length,1,'une seule bonne conversion '+c.id);}
for(const c of Q.CONVERSIONS_MASSE){assert.equal(c.options.filter(o=>o[0]===c.juste).length,1,'une seule bonne conversion '+c.id);}
assert.equal(Q.convertirMasse(2.5,'kg','g'),2500);assert.equal(Q.convertirMasse(1,'q','kg'),100);assert.equal(Q.convertirMasse(1,'t','kg'),1000);assert.equal(Q.convertirMasse(350,'g','kg'),0.35);assert.equal(Q.convertirMasse(250,'mg','g'),0.25);
assert.ok(Q.capacite('large_mes').litres>Q.capacite('haute_mes').litres,'la bouteille large contient plus : la forme trompe');
assert.equal(Q.capacite('haute_gob').gobelets,3);assert.equal(Q.capacite('large_gob').gobelets,4);assert.equal(Q.capacite('cube_dm3').litres,1);
assert.equal(Q.division('A'),1);assert.equal(Q.division('B'),5);assert.equal(Q.division('biberon'),10);assert.equal(Q.division('seringue'),0.2);
assert.notEqual(Q.EPROUVETTES.A.unite,Q.EPROUVETTES.B.unite,'une éprouvette en mL, l’autre en cm³');
for(const id of ['A','B'])for(const V of Q.VOLUMES_LECTURE[id]){
  const r=Q.lecture(id,V,'niveau');assert.equal(r.valeur,V,'lecture au bas du ménisque '+id+' '+V);assert.ok(r.juste);
  assert.ok(Q.lecture(id,V,'haut').valeur>V&&Q.lecture(id,V,'bas').valeur<V,'parallaxe : trop haut au-dessus, trop bas en dessous');
  assert.ok(Q.verifierLecture(id,V,String(Q.division(id)).replace('.',','),String(V)).juste);
  assert.equal(Q.verifierLecture(id,V,'10',String(V)).division,Q.division(id)===10,'division fausse repérée');
}
assert.ok(Q.mesureRecipient('eprouvette').precis&&!Q.mesureRecipient('becher').precis&&Q.mesureRecipient('becher').min<=Q.V_KOFI&&Q.mesureRecipient('becher').max>=Q.V_KOFI);
for(const s of Q.SOLIDES){const d=Q.deplacement(s.id);assert.equal(d.V,d.V2-d.V1);assert.equal(d.valable,!s.soluble&&s.coule&&!s.peuEau,'validité '+s.id);if(d.valable)assert.equal(d.V,s.V,'V = V₂ − V₁ '+s.id);}
assert.equal(Q.deplacement('pate_boule').V,Q.deplacement('pate_galette').V,'la forme ne change pas le volume');
assert.equal(Q.deplacement('sucre').condition,'insoluble');assert.equal(Q.deplacement('bouchon').condition,'coule');assert.equal(Q.deplacement('caillou_long').condition,'immerge');
assert.ok(!Q.verifierDeplacement('caillou','50','62','10').juste&&Q.verifierDeplacement('caillou','50','62','12').juste);
assert.ok(/insoluble/.test(Q.verifierDeplacement('sucre','50','51','1').retour),'calcul juste mais mesure non valable expliquée');
assert.equal(Q.plusLoin('lest_bouchon').V,10);
assert.equal(Q.volumeForme('cube'),27);assert.equal(Q.volumeForme('pave'),24);assert.equal(Q.volumeForme('allumettes'),26.25);assert.equal(Q.volumeForme('cylindre'),62.8);assert.equal(Q.volumeForme('conserve'),502.4);
assert.equal(Q.cubesPave(2).total,Q.volumeForme('pave'),'nombre de cubes = L × ℓ × h');
assert.ok(/diamètre pour le rayon/.test(Q.verifierVolumeForme('cylindre',{d:'4',h:'5'},'251,2').retour),'erreur diamètre / rayon repérée');
assert.ok(Q.verifierVolumeForme('cylindre',{d:'4',h:'5'},'62,8').juste);
for(const id of ['pave','cylindre']){const c=Q.controleEau(id);assert.ok(c.possible&&Math.abs(c.V-c.calcul)<=c.precision/2+1e-9,'contrôle par l’eau concordant à la précision près '+id);assert.equal(c.V2%Q.division('B'),0,'lecture sur une division '+id);}
for(const id of ['allumettes','conserve'])assert.equal(Q.controleEau(id).possible,false,'pas de contrôle par l’eau '+id);
for(const id of ['boule','galette','morceaux'])assert.equal(Q.masseObjet(id).m,Q.PATE,'masse conservée '+id);
assert.equal(Q.masseObjet('coton').m,Q.masseObjet('fer').m,'un kilogramme est un kilogramme');
assert.equal(Q.somme(Q.BOITE),500);deq([...Q.BOITE].sort((a,b)=>a-b),[1,2,2,5,10,10,20,50,100,100,200],'boîte de 1 g à 200 g (décision du 27 octobre 2026)');
for(const [id,c] of Object.entries(Q.CHARGES))if(c.m<=500&&id!=='tare'){const d=Q.decroissante(c.m);assert.ok(d.possible&&Q.somme(d.masses)===c.m,'masses décroissantes pour '+id);deq(d.masses,[...d.masses].sort((a,b)=>b-a));}
assert.equal(Q.equilibre(100,100).equilibre,true);assert.equal(Q.equilibre(100,50).penche,'gauche');assert.equal(Q.equilibre(0,20).penche,'droite');
assert.ok(/retire/.test(Q.conseil(Q.equilibre(100,200),'droite'))&&/ajoute/.test(Q.conseil(Q.equilibre(100,50),'droite')),'conseils de la méthode des masses décroissantes');
assert.equal(Q.pesee({gauche:['riz25'],masses:[],cote:'droite'}).depasse,true,'portée dépassée refusée');
/* balance déréglée : la simple pesée est fausse, la double pesée est juste */
const md=Q.massesEquilibre('simple_dereglee');assert.equal(md,330);assert.notEqual(md,Q.charge('mangue').m,'simple pesée fausse sur la balance déréglée');
for(const s of Object.keys(Q.DOUBLE)){const m=Q.massesEquilibre(s);assert.ok(Number.isInteger(m)&&Q.decroissante(m).possible,'équilibre exact possible '+s);
  assert.equal(Q.pesee(Object.assign({},Q.DOUBLE[s],{masses:Q.decroissante(m).masses})).eq.equilibre,true,'équilibre atteint '+s);}
assert.equal(Q.massesEquilibre('eq2')-Q.massesEquilibre('eq1'),Q.charge('mangue').m,'double pesée : m = m₂ − m₁ (mangue)');
assert.equal(Q.massesEquilibre('liq2')-Q.massesEquilibre('liq1'),Q.charge('bocal_plein').m-Q.charge('bocal_vide').m,'double pesée : m = m₂ − m₁ (liquide, correction du TP 13)');
assert.ok(Q.charge('tare').m>Q.charge('mangue').m,'la tare est plus lourde que l’objet');
assert.ok(Q.verifierDouble('solide','100','400','300').juste&&!Q.verifierDouble('liquide','50','250','-200').juste);
assert.ok(Q.verifierDifference('eau','74','174','100').juste&&Q.LIQUIDES_PESES.huile.m2-Q.LIQUIDES_PESES.huile.m1!==100,'eau et huile : même volume, masses différentes');
assert.equal(Q.BALANCES.length,6);assert.equal(Q.SITUATIONS_BALANCE.length,6);assert.ok(Q.SITUATIONS_BALANCE.every(s=>Q.BALANCES.some(b=>b.id===s.juste)));
assert.equal(Q.affichageTare('tare').affiche,0);assert.equal(Q.affichageTare('lait').affiche,Q.LAIT);
assert.equal(new Set(Q.CYLINDRES.map(c=>c.m)).size,5,'même volume, masses différentes');
assert.equal(Q.COTON_ECROUS.coton.m,Q.COTON_ECROUS.ecrous.m);assert.ok(Q.COTON_ECROUS.coton.V>50*Q.COTON_ECROUS.ecrous.V,'même masse, volumes différents');
assert.equal(Q.jetons(2).m,2*Q.jetons(1).m);assert.equal(Q.jetons(3).V,3*Q.jetons(1).V);
for(const k of Object.keys(Q.LIQ))assert.equal(Q.liquideMV(k,20).m,2*Q.liquideMV(k,10).m,'proportionnalité pour une même matière '+k);
for(const p of Q.PREVISIONS){assert.equal(p.juste,p.ref_m*p.coef,'coefficient multiplicateur '+p.id);assert.ok(Number.isInteger(p.coef));assert.ok(Q.verifierPrevision(p.id,String(p.juste)).juste);}
assert.ok(Q.PREVISIONS.find(p=>p.id==='sirop075').juste>Q.liquideMV('huile',10).m*100,'0,75 L de sirop a plus de masse que 1 L d’huile');
console.log('Lot Mesures : règles des modèles (unités, lecture, déplacement, formes, pesées, balance déréglée, proportionnalité) vérifiées.');

/* ---------- structure commune ---------- */
const LECON={'01':'Volume','02':'Volume','03':'Volume','04':'Volume'};
for(const i of IDS){
  const F=w['FICHE_CI_MES'+i];assert.ok(F,'fiche chargée '+i);
  assert.equal(F.id,'NL-CI-6E-MES-'+i);assert.equal(F.niveau,'6e');assert.equal(F.theme,'Mesure de grandeurs physiques');
  assert.equal(F.chapitre,LECON[i]?'Volume d’un liquide et d’un solide':'Masse d’un solide et d’un liquide','intitulé officiel de la leçon '+i);
  assert.ok(F.competenceVisee.length>20&&F.objectifsPedagogiques.length>=3,'cadre pédagogique '+i);
  for(const k of ['situation','materiel','prevision','protocole','variable','maintenu','colonnes','lignes','resume','confrontation','transfert','synthese','prof','aides','manip','peutConfronter','grilleMaitrise','situationEvaluation','critere','retroaction'])assert.ok(F[k],i+' : '+k);
  assert.equal(F.grilleMaitrise.map(x=>x[0]).join(','),'MI,MF,MS,TBM');assert.equal(F.prevision.choix.length,4,'quatre hypothèses '+i);
  assert.ok(F.aides.length>=3&&F.transfert.expl&&F.prof.reference&&F.prof.attendus.length>=2&&F.prof.erreurs.length>=2,'aides et corrigé '+i);
  assert.ok(F.situation.length>40&&/Awa|Kofi|Aya|Yao|Mariam|marché|TP|classe|maison/.test(F.situation)&&/Awa|Kofi|Aya|Yao|Mariam|Abidjan|marché|Treichville/.test(F.situation+F.situationEvaluation),'situation contextualisée '+i);
  const txt=JSON.stringify(F)+String(F.manip);
  assert.ok(!/NL-C4|NL-CI-6E-(ELE|MAT|MES)-\d\d ·|Programme du cycle 4/.test(JSON.stringify(F).replace(F.id,'')),'aucun code interne '+i);
  assert.ok(!/densit|masse volumique/i.test(txt),'ni densité ni masse volumique '+i);
  assert.ok(!/\bpoids\b/i.test(JSON.stringify(F)),'pas de poids en 6e '+i);
  assert.ok(!/truqu/i.test(txt),'on dit « déréglée », jamais « truquée » '+i);
}
console.log('Lot Mesures : '+IDS.length+' fiches structurées (cadre, intitulés officiels, contexte local, ni densité ni masse volumique, aucun code interne).');

/* ---------- parcours complets dans le moteur ---------- */
function parcours(i){
  const win=env(),document=win.document,F=win['FICHE_CI_MES'+i],app=document.getElementById('app'),key='pc-act-'+F.id,QQ=win.NohobaMesures,MM=win.NohobaMatiere;
  const state=()=>JSON.parse(win.localStorage.getItem(key));
  const button=text=>{const bt=[...app.querySelectorAll('button')].find(x=>x.textContent.startsWith(text));assert.ok(bt,'bouton '+text+' '+i);assert.equal(bt.disabled,false,'bouton accessible '+text+' '+i);bt.click();return bt;};
  const radio=(name,value)=>{const r=app.querySelector('input[name="'+name+'"][value="'+value+'"]');assert.ok(r,name+'/'+value+' '+i);r.checked=true;r.dispatchEvent(new win.Event('change',{bubbles:true}));};
  const set=(id,value)=>{const el=document.getElementById(id);assert.ok(el,id+' '+i);el.value=value;};
  win.Activite.run(F,app);
  button('Commencer : ma prévision');button('Enregistrer ma prévision');assert.ok(!state().prevision,'hypothèse vide refusée '+i);
  radio('pc',F.prevision.choix[0][0]);set('pr','Je propose cette hypothèse et je vais la vérifier.');if(F.prevision.nombre)set('pn','120');
  button('Enregistrer ma prévision');button('Passer à la manipulation');
  assert.equal(document.getElementById('tab3').disabled,true,'essais requis '+i);
  /* contrôles accessibles */
  assert.ok([...app.querySelectorAll('input[type=radio],input[type=checkbox]')].every(r=>r.closest('label')&&r.closest('fieldset')&&r.closest('fieldset').querySelector('legend')),'étiquettes et légendes '+i);
  assert.ok([...app.querySelectorAll('select,input[type=text],textarea')].every(s=>s.id&&app.querySelector('label[for="'+s.id+'"]')),'champs étiquetés '+i);
  assert.ok([...app.querySelectorAll('svg')].every(s=>s.getAttribute('role')==='img'&&s.getAttribute('aria-label')&&!/NaN|undefined/.test(s.outerHTML)),'chaque dessin est un SVG nommé, sans valeur manquante '+i);
  assert.ok([...app.querySelectorAll('[data-mesure],[data-pesee],.card')].filter(c=>c.querySelector('figure')).every(c=>{const caps=[...c.querySelectorAll(':scope figcaption')].map(x=>x.textContent);return caps.includes('Montage')&&caps.includes('Schéma normalisé');}),'montage et schéma normalisé côte à côte '+i);
  /* classements : une erreur volontaire puis la bonne réponse */
  const cfgs=Object.values(MM.triCfg).filter(c=>app.querySelector('input[name^="t'+c.id+'-"],select[id^="t'+c.id+'-"]'));
  for(const c of cfgs)for(const [k,it] of c.items.entries()){
    const opts=(it.options||c.cats).map(x=>x[0]),bonne=opts.find(o=>c.verifier(it.id,o).juste);assert.ok(bonne,'bonne réponse existante '+c.id+'/'+it.id);
    assert.equal(opts.filter(o=>c.verifier(it.id,o).juste).length,1,'une seule bonne réponse '+c.id+'/'+it.id);
    const carte=[...app.querySelectorAll('[data-item="'+it.id+'"]')].find(x=>x.querySelector('[name="t'+c.id+'-'+it.id+'"], #t'+c.id+'-'+it.id+'-s'));assert.ok(carte,'carte '+c.id+'/'+it.id);
    const poser=v=>{const sel=carte.querySelector('select');if(sel){sel.value=v;sel.dispatchEvent(new win.Event('change',{bubbles:true}));}else carte.querySelectorAll('input').forEach(x=>{x.checked=x.value===v;});};
    const val=[...carte.querySelectorAll('button')].find(x=>/^Valider/.test(x.textContent));
    if(k===0){poser(opts.find(o=>o!==bonne));val.click();assert.equal(val.textContent,'Valider ma nouvelle réponse','nouvel essai après erreur '+c.id);}
    poser(bonne);val.click();assert.ok(/Bonne réponse/.test(carte.querySelector('.msg').textContent),'bonne réponse '+c.id+'/'+it.id);
  }
  /* blocs d'observation : toutes les combinaisons, une observation par essai */
  const prefixes=[...new Set([...app.querySelectorAll('input[name^="m2"]')].map(x=>x.name.match(/^m\d+-/)[0]))];
  for(const pre of prefixes){
    const groupes={};app.querySelectorAll('input[name^="'+pre+'"]').forEach(x=>{(groupes[x.name]=groupes[x.name]||[]).push(x.value);});
    let combos=[{}];for(const n of Object.keys(groupes))combos=combos.flatMap(c=>groupes[n].map(v=>Object.assign({},c,{[n]:v})));
    const carte=app.querySelector('textarea[id="'+pre+'obs"]').closest('.card'),enreg=[...carte.querySelectorAll('button')].find(x=>/Enregistrer mon observation/.test(x.textContent));
    const n0=state().essais.length;enreg.click();assert.equal(state().essais.length,n0,'observation vide refusée '+i);
    for(const c of combos){for(const [n,v] of Object.entries(c))radio(n,v);set(pre+'obs','Je décris ce que je vois sur le montage et le schéma.');enreg.click();}
  }
  /* mesures saisies : une valeur fausse, puis les valeurs justes, pour chaque combinaison */
  for(const sec of app.querySelectorAll('[data-mesure]')){
    const id=sec.getAttribute('data-mesure'),cfg=QQ.mesureCfg[id],pre='q'+id+'-',groupes={};
    sec.querySelectorAll('input[type=radio]').forEach(x=>{(groupes[x.name]=groupes[x.name]||[]).push(x.value);});
    let combos=[{}];for(const n of Object.keys(groupes))combos=combos.flatMap(c=>groupes[n].map(v=>Object.assign({},c,{[n]:v})));
    const vb=[...sec.querySelectorAll('button')].find(x=>/^Vérifier/.test(x.textContent)),msg=sec.querySelector('.msg');
    const n0=state().essais.length;vb.click();assert.equal(state().essais.length,n0,'saisie vide refusée '+id);assert.ok(/chaque case/.test(msg.textContent));
    for(const [k,c] of combos.entries()){
      for(const [n,v] of Object.entries(c))radio(n,v);
      const v={};Object.entries(c).forEach(([n,x])=>v[n.slice(pre.length)]=x);
      const att=cfg.attendu(v);
      for(const cle of Object.keys(att))assert.ok(document.getElementById(pre+cle),'champ '+cle+' '+id);
      if(k===0){for(const [cle,x] of Object.entries(att))set(pre+cle,String(Number(String(x).replace(',','.'))+7).replace('.',','));vb.click();assert.ok(/À revoir/.test(msg.textContent),'mesure fausse repérée '+id);assert.equal(state().essais.at(-1).juste,false);}
      for(const [cle,x] of Object.entries(att))set(pre+cle,String(x));vb.click();
      assert.ok(/Mesure juste/.test(msg.textContent),'mesure juste '+id+' '+JSON.stringify(c)+' : '+msg.textContent);
    }
  }
  /* pesées : équilibre à vide, refus d'une charge trop lourde, masses décroissantes, somme fausse puis juste */
  for(const sec of app.querySelectorAll('[data-pesee]')){
    const id=sec.getAttribute('data-pesee'),cfg=QQ.peseeCfg[id];
    const nb=[...sec.querySelectorAll('button')].find(x=>x.textContent==='Noter cette pesée'),msg=[...sec.querySelectorAll('.msg')].at(-1),inp=document.getElementById('p'+id+'-somme');
    assert.ok(sec.querySelectorAll('button[aria-pressed]').length===11,'onze masses marquées '+id);
    for(const [k,S] of cfg.situations.entries()){
      radio('p'+id+'-sit',S.id);
      const r=QQ.pesee({gauche:S.gauche,droite:S.droite,masses:[],cote:S.cote,bras:S.bras});
      if(r.depasse){assert.ok([...sec.querySelectorAll('button[aria-pressed]')].every(b=>b.disabled),'masses bloquées : portée dépassée '+S.id);assert.ok(/portée/.test(sec.textContent));continue;}
      const m=QQ.massesEquilibre(S),liste=QQ.decroissante(m).masses;
      if(liste.length){
        const b0=[...sec.querySelectorAll('button[aria-pressed]')].find(b=>b.textContent===liste[0]+' g');
        const avant=QQ.pesee({gauche:S.gauche,droite:S.droite,masses:[],cote:S.cote,bras:S.bras});assert.equal(avant.eq.equilibre,false);
        inp.value=String(m);nb.click();assert.ok(/pas en équilibre/.test(msg.textContent),'pesée refusée hors équilibre '+S.id);
        /* une masse trop grande d'abord : le conseil demande de la retirer */
        const trop=QQ.BOITE.find(x=>x>m&&x<=500);
        if(trop){const bt=[...sec.querySelectorAll('button[aria-pressed]')].find(b=>b.textContent===trop+' g');bt.click();assert.ok(/descend : retire/.test(sec.textContent),'conseil : retirer une masse trop grande '+S.id);bt.click();}
        b0.click();
      }
      /* pose de toutes les masses par les boutons, de la plus grande à la plus petite */
      const libres=[...sec.querySelectorAll('button[aria-pressed="false"]')];
      for(const x of liste.slice(1)){const b=libres.find(bb=>bb.textContent===x+' g'&&bb.getAttribute('aria-pressed')==='false');b.click();}
      assert.ok(/Équilibre/.test(sec.textContent),'équilibre atteint '+S.id);
      if(k===0){inp.value=String(m+1);nb.click();assert.ok(/À revoir/.test(msg.textContent),'somme fausse repérée '+S.id);}
      inp.value=String(m);nb.click();assert.ok(/Pesée notée/.test(msg.textContent),'pesée notée '+S.id);
      const e=state().essais.at(-1);assert.equal(e.somme,m);deq(e.masses,liste);assert.equal(e.juste,true);
    }
  }
  assert.ok(F.peutConfronter(state()),'contraste suffisant '+i);
  assert.ok(state().essais.length>=F.essaisMin,'essais minimum atteints '+i);
  const essais=state().essais.length;
  button('J’ai assez d’essais');button('Enregistrer et passer au bilan');assert.equal(state().confront,null,'analyse vide refusée '+i);
  radio('vd','confirmee');set('pre','Je cite un essai précis et ce que j’ai observé dans le tableau.');set('mod','Je confronte mon hypothèse avec les essais.');button('Enregistrer et passer au bilan');
  set('cc','Je conclus à partir des mesures de mes essais.');button('Valider ma conclusion');
  set('nl-eval','Je justifie ma réponse à partir des mesures de la simulation.');button('Enregistrer ma réponse');
  if(F.transfert.type==='nombre')set('tn',String(F.transfert.rep).replace('.',','));else radio('tr',String(F.transfert.rep));
  set('tj','Je justifie mon choix avec la simulation.');button('Vérifier ma réponse');
  assert.ok(app.textContent.includes('Exact.'),'transfert juste '+i);
  button('Voir ma trace');assert.ok(app.textContent.includes('Communiquer · Ma trace'),'trace '+i);
  assert.equal(state().essais.length,essais);assert.ok(!/NL-CI|NL-C4/.test(app.textContent),'aucun code interne affiché '+i);
  win.print=()=>{};button('Imprimer');const print=document.getElementById('print');
  assert.ok(print.textContent.includes('Je conclus à partir des mesures de mes essais'),'conclusion dans la fiche remplie '+i);
  assert.ok(!print.querySelector('.sh-ref'),'corrigé absent de la trace élève '+i);
  assert.ok(!/undefined|NaN/.test(print.textContent),'fiche imprimée complète '+i);
  app.replaceChildren();win.Activite.run(F,app);assert.ok(app.textContent.includes('Communiquer · Ma trace'),'reprise '+i);
  win.close();
}
for(const i of IDS)parcours(i);
console.log('Lot Mesures : '+IDS.length+' parcours complets (hypothèse, classements, mesures saisies, pesées à l’équilibre, analyse, conclusion, transfert, trace, impression, reprise).');

/* ---------- MES-11 : choix du groupe par le professeur ---------- */
{const win=env(),F=win.FICHE_CI_MES11,panel=win.document.createElement('div');win.document.body.appendChild(panel);
  const st={essais:[],prevision:null};const X={st:()=>st,save:()=>{},addEssai:e=>{st.essais.push(e);},tableHTML:()=>'' ,aide:()=>F.aides[0]};
  F.manip(panel,X);const sel=panel.querySelector('#mes11-groupe');assert.ok(sel&&panel.querySelector('label[for="mes11-groupe"]'));
  assert.equal(panel.querySelector('[data-groupe="liquides"]').hidden,true,'groupe 1 par défaut');
  sel.value='liquides';sel.dispatchEvent(new win.Event('change'));assert.equal(st.groupe,'liquides');assert.equal(panel.querySelector('[data-groupe="solides"]').hidden,true,'groupe 2 choisi');
  /* un seul groupe suffit pour conclure */
  const obs='Je décris ce que je vois sur la balance.';
  const liq=[{groupe:'liquides',liq:'eau',V:10,m:10,observation:obs},{groupe:'liquides',liq:'eau',V:20,m:20,observation:obs},{groupe:'liquides',liq:'huile',V:10,m:9,observation:obs},{mesure:'mes11prev',prevision:'huile2L',juste:true,saisies:{m:'1800'}}];
  assert.ok(F.peutConfronter({essais:liq}),'le groupe des liquides peut conclure seul');
  assert.ok(!F.peutConfronter({essais:liq.slice(0,3)}),'une prévision juste est demandée');
  win.close();}
console.log('Lot Mesures : MES-11, deux parcours au choix du professeur, une même conclusion.');

/* ---------- catalogue, pages, hors-ligne, corrigés ---------- */
const cat=new JSDOM('',{runScripts:'outside-only'}).window;cat.eval(read('assets/catalogues/6e-ci.js'));
const items=cat.NL_CATALOGUE_CI_6E,mes=items.filter(x=>x.sourceId.startsWith('MES-'));
assert.equal(mes.length,11,'onze fiches MES (MES-11 ajoutée le 27 octobre 2026)');
assert.ok(mes.every(x=>x.theme==='Mesure de grandeurs physiques'),'intitulé officiel du thème');
deq([...new Set(mes.map(x=>x.lecon))],['Volume d’un liquide et d’un solide','Masse d’un solide et d’un liquide'],'intitulés officiels des leçons');
for(const i of IDS){const e=items.find(x=>x.sourceId==='MES-'+i);assert.equal(e.statut,'prototype','prototype jusqu’à validation du propriétaire : MES-'+i);assert.equal(e.titre.replace(/'/g,'’'),w['FICHE_CI_MES'+i].titre,'titre identique au catalogue MES-'+i);}
assert.ok(items.findIndex(x=>x.sourceId==='MES-11')===items.findIndex(x=>x.sourceId==='MES-10')+1,'MES-11 après MES-10');
const page=read('activites-ci/index.html');
for(const f of SHARED.slice(5))assert.ok(page.includes(f.replace('assets/','../assets/')),'page des activités charge '+f);
assert.ok(page.includes('MES-(?:0[1-9]|1[01])'),'page des activités : identifiants MES');
const etapes=read('assets/simple/etapes-ci.js');assert.ok(etapes.includes('MES-(?:0[1-9]|1[01])')&&etapes.includes("'Volume d’un liquide et d’un solide': 'volume'")&&etapes.includes("'Masse d’un solide et d’un liquide': 'masse'"),'leçons volume et masse reliées au hub');
const sw=read('sw.js');for(const f of SHARED.slice(5))assert.ok(sw.includes(f.replace('assets/','./assets/')),'hors-ligne '+f);
for(const i of IDS)assert.ok(sw.includes('NL-CI-6E-MES-'+i+'.js'),'hors-ligne fiche MES-'+i);
for(const f of fs.readdirSync(path.join(root,'assets/activites/fiches')).filter(x=>/MES/.test(x)))assert.ok(!/JD [ÉE]ditions|page\s*\d+\s*du manuel|Lelivrescolaire/i.test(read('assets/activites/fiches/'+f)),'aucune reprise de manuel dans '+f);
assert.ok(fs.existsSync(path.join(root,'server/private/corriges-ci/NL-CI-6E-MES.md')),'notes enseignant du lot rédigées hors des fichiers publics');
console.log('Lot Mesures : catalogue (prototypes, intitulés officiels), pages, hub et cache hors-ligne contrôlés.');
process.exit(0);
