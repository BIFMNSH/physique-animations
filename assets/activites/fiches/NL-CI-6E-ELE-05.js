/* NohobaLab · 6e Côte d'Ivoire · ELE-05 · Schématiser un circuit électrique.
   Adapté de l'« Activité 1 – Schématiser un circuit électrique » de l'enseignant : symboles normalisés, méthode en trois étapes,
   trois règles, justification d'une erreur, circuit en série. Figures originales NohobaLab.
   Montage de référence : − de la pile → interrupteur → moteur → lampe → + de la pile. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const COTE=[['lampe','Lampe'],['moteur','Moteur'],['generateur','Générateur G'],['interOuvert','Interrupteur ouvert'],['interFerme','Interrupteur fermé'],['fil','Fil de connexion seul']];
  const PILE=[['normale','Pile : − à gauche, + à droite'],['inversee','Pile : + à gauche, − à droite'],['generateur','Générateur G']];
  const nomC=id=>(COTE.filter(x=>x[0]===id)[0]||['',id])[1];
  const ERR=[['','— je choisis —'],['aucune','Aucune erreur'],['symbole','Symbole faux : un dipôle qui n’est pas dans le montage'],['ordre','Ordre des dipôles non respecté'],['polarite','Polarités de la pile inversées'],['inter','Interrupteur mal placé']];
  const nomE=id=>(ERR.filter(x=>x[0]===id)[0]||['',id])[1];
  const DIAG={A:{pile:'normale',droite:'moteur',bas:'lampe',gauche:'interOuvert',rep:'ordre'},B:{pile:'inversee',droite:'lampe',bas:'moteur',gauche:'interOuvert',rep:'polarite'},C:{pile:'normale',droite:'lampe',bas:'generateur',gauche:'interOuvert',rep:'symbole'}};
  const sch=(o,leg)=>window.NohobaAtelier.schema({pile:o.pile,cotes:{droite:o.droite,bas:o.bas,gauche:o.gauche},legende:leg||'',label:'Schéma proposé'});
  /* contrôle d'un schéma par rapport à la consigne du montage */
  function controle(o,etat){
    const att={pile:'normale',droite:'lampe',bas:'moteur',gauche:etat==='ferme'?'interFerme':'interOuvert'},cote={droite:'à droite',bas:'en bas',gauche:'à gauche'},err=[];
    if(o.pile==='inversee')err.push('polarités inversées : le − de la pile doit être relié à l’interrupteur');
    if(o.pile==='generateur')err.push('symbole faux : le montage contient une pile, pas un générateur G');
    ['droite','bas','gauche'].forEach(k=>{const ch=o[k],ex=att[k];if(ch===ex)return;
      if(ch==='generateur')err.push('symbole faux : un générateur G '+cote[k]+' ne correspond à aucun dipôle du montage');
      else if(ch==='fil')err.push('dipôle manquant '+cote[k]+' : '+nomC(ex).toLowerCase());
      else if((ch==='interOuvert'||ch==='interFerme')&&(ex==='interOuvert'||ex==='interFerme'))err.push('interrupteur pas dans l’état demandé ('+(etat==='ferme'?'fermé':'ouvert')+')');
      else err.push('ordre non respecté '+cote[k]+' : '+nomC(ch).toLowerCase()+' au lieu de '+nomC(ex).toLowerCase());});
    return err.filter((e,i)=>err.indexOf(e)===i);
  }
  function symH(kind){
    const A=window.NohobaAtelier,w='fill="none" stroke="#243049" stroke-width="2.5"';let s='';
    if(kind==='pile')s='<path d="M8 40 H50 M58 40 H92" '+w+'/><path d="M50 30 V50" stroke="#243049" stroke-width="6"/><path d="M58 22 V58" '+w+'/>'+A.T(36,28,'−',15,'#2B5EA8',800)+A.T(72,28,'+',15,'#C03A2E',800);
    else if(kind==='generateur')s='<path d="M8 40 H33 M67 40 H92" '+w+'/><circle cx="50" cy="40" r="17" fill="#fff" stroke="#243049" stroke-width="2.5"/>'+A.T(50,46,'G',17,'#243049',800)+A.T(20,28,'−',15,'#2B5EA8',800)+A.T(80,28,'+',15,'#C03A2E',800);
    else if(kind==='fil')s='<path d="M8 40 H92" '+w+'/>';
    else if(kind==='interOuvert')s='<path d="M8 40 H28 M72 40 H92" '+w+'/><circle cx="28" cy="40" r="3.5" fill="#243049"/><circle cx="72" cy="40" r="3.5" fill="#243049"/><path d="M28 40 L64 20" '+w+'/>';
    else if(kind==='interFerme')s='<path d="M8 40 H92" '+w+'/><circle cx="28" cy="40" r="3.5" fill="#243049"/><circle cx="72" cy="40" r="3.5" fill="#243049"/>';
    else if(kind==='lampe')s='<path d="M8 40 H33 M67 40 H92" '+w+'/><circle cx="50" cy="40" r="17" fill="#fff" stroke="#243049" stroke-width="2.5"/><path d="M38 28 L62 52 M62 28 L38 52" '+w+'/>';
    else s='<path d="M8 40 H33 M67 40 H92" '+w+'/><circle cx="50" cy="40" r="17" fill="#fff" stroke="#243049" stroke-width="2.5"/>'+A.T(50,46,'M',17,'#243049',800);
    return '<svg viewBox="0 0 100 70" role="img" aria-label="Symbole : '+esc(kind)+'" style="display:block;width:100%;height:auto">'+s+'</svg>';
  }
  function selectGroup(parent,id,label,options,def){
    const w=h('div',{style:'flex:1 1 200px;min-width:0'},parent);h('label',{for:id,text:label,style:'font-weight:700'},w);
    return h('select',{id:id,style:'width:100%'},w,options.map(o=>'<option value="'+o[0]+'"'+(o[0]===def?' selected':'')+'>'+esc(o[1])+'</option>').join(''));
  }
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st();
    /* --- documents : symboles, méthode, règles, montage --- */
    const doc=h('div',{class:'card'},panel);
    h('h3',{text:'Documents de travail'},doc);
    h('h4',{text:'Document 1 · Les symboles normalisés'},doc);
    const tab=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px'},doc);
    [['pile','Pile'],['generateur','Générateur'],['fil','Fil de connexion'],['interOuvert','Interrupteur ouvert'],['interFerme','Interrupteur fermé'],['lampe','Lampe'],['moteur','Moteur']].forEach(c=>{
      h('figure',{style:'margin:0;background:#F7F8FB;border-radius:12px;padding:6px;color:#243049;text-align:center'},tab,symH(c[0])+'<figcaption style="font-weight:700;font-size:14px">'+esc(c[1])+'</figcaption>');});
    h('h4',{text:'Document 2 · La méthode pour schématiser'},doc);
    const met=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px'},doc);
    [[{rect:true},'Étape 1 · Je trace un rectangle pour chaque boucle du circuit.'],[{pointille:true,cotes:{droite:'lampe',gauche:'interOuvert',bas:'moteur'}},'Étape 2 · Je place chaque dipôle avec son symbole, dans l’ordre du montage.'],[{cotes:{droite:'lampe',gauche:'interOuvert',bas:'moteur'}},'Étape 3 · Je relie les symboles par des traits droits : ce sont les fils de connexion.']].forEach(c=>{
      h('figure',{style:'margin:0'},met,A.schema(Object.assign({label:c[1]},c[0]))+'<figcaption style="font-size:15px;margin-top:4px">'+esc(c[1])+'</figcaption>');});
    h('p',{},doc,'<b>Les 3 règles :</b> j’utilise une règle et un crayon à papier ; je repère chaque boucle du circuit ; je respecte l’ordre des dipôles et les polarités (+ et −) du générateur.');
    h('h4',{text:'Document 3 · Le montage à réaliser'},doc);
    const mont=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:center'},doc);
    h('figure',{style:'margin:0'},mont,A.montageSerie({inter:'ferme'}).svg);
    h('div',{},mont,'<p><b>Matériel :</b> une pile, une lampe, un moteur, un interrupteur, quatre fils de connexion, deux pinces crocodiles.</p><p><b>Consignes :</b> la borne − de la pile est reliée à l’interrupteur ; la borne + de la pile est reliée à la lampe ; le moteur est placé entre l’interrupteur et la lampe.</p><p><b>Vocabulaire :</b> un <i>circuit en série</i> est un circuit qui ne comporte qu’une seule boucle.</p><p><b>Sécurité :</b> en classe réelle, appelle le professeur avant de fermer l’interrupteur.</p>');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes réponses'},res);const table=h('div',{},res);
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE05,window.FICHE_CI_ELE05.lignes(st),'Mes schémas et mes analyses.');}
    /* --- partie 1 : je schématise --- */
    const b=h('div',{class:'card'},panel);h('h3',{text:'1 · Je schématise le montage du document 3'},b);
    h('p',{text:'Applique la méthode du document 2. Schématise d’abord avec l’interrupteur ouvert, puis avec l’interrupteur fermé.'},b);
    const fig=A.paire(b,h);
    const row=h('div',{style:'display:flex;flex-wrap:wrap;gap:12px;margin:10px 0'},b);
    const sP=selectGroup(row,'ci5-pile','Pile (en haut)',PILE,'normale'),sD=selectGroup(row,'ci5-d','Côté droit',COTE,'fil'),sB=selectGroup(row,'ci5-b','Côté du bas',COTE,'fil'),sG=selectGroup(row,'ci5-g','Côté gauche',COTE,'fil');
    const fe=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},b);h('legend',{style:'font-weight:700;width:100%;float:left'},fe,'Je schématise avec l’interrupteur…');
    [['ouvert','ouvert'],['ferme','fermé']].forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 160px;margin:0'},fe,'<input type="radio" name="ci5-etat" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+c[1]+'</span>'));
    const out=h('p',{'aria-live':'polite'},b),btn=h('button',{type:'button',class:'btn primary',text:'Vérifier mon schéma'},b),msg=h('div',{class:'msg','aria-live':'polite'},b);
    const cur=()=>({pile:sP.value,droite:sD.value,bas:sB.value,gauche:sG.value}),etat=()=>b.querySelector('input[name=ci5-etat]:checked').value;
    function maj(){const o=cur(),e=etat(),m=A.montageSerie({inter:e==='ferme'?'ferme':'ouvert'});fig.montage(m.svg);fig.schema(sch(o,e==='ferme'?'Interrupteur fermé':'Interrupteur ouvert'));}
    b.addEventListener('change',maj);
    btn.onclick=function(){const o=cur(),e=etat(),err=controle(o,e);
      X.addEssai({type:'schema',etat:e,ok:err.length===0,erreurs:err,observation:err.length?err.join(' ; '):'schéma conforme'});paint();
      msg.className='msg '+(err.length?'bad':'ok');msg.innerHTML=err.length?'<b>À corriger :</b> '+err.map(esc).join(' ; ')+'.':'<b>Schéma conforme au montage</b> avec l’interrupteur '+(e==='ferme'?'fermé':'ouvert')+'.';};
    /* --- partie 2 : j'identifie l'erreur --- */
    const c=h('div',{class:'card'},panel);h('h3',{text:'2 · Document 4 : quelle erreur dans chaque schéma ?'},c);
    h('p',{text:'Ces trois schémas veulent représenter le montage du document 3. Appuie-toi sur les consignes pour trouver l’erreur de chacun.'},c);
    const g3=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px'},c);
    const selE={};
    ['A','B','C'].forEach(k=>{const w=h('div',{},g3);h('figure',{style:'margin:0'},w,sch(DIAG[k])+'<figcaption style="font-weight:700">Schéma '+k+'</figcaption>');selE[k]=selectGroup(w,'ci5-e'+k,'Erreur du schéma '+k,ERR,'');});
    const bd=h('button',{type:'button',class:'btn primary',text:'Vérifier mes trois réponses'},c),md=h('div',{class:'msg','aria-live':'polite'},c);
    bd.onclick=function(){const lines=[];let all=true;['A','B','C'].forEach(k=>{const v=selE[k].value;if(!v){all=false;return;}const ok=v===DIAG[k].rep;X.addEssai({type:'erreur',schema:k,rep:v,ok:ok,observation:'schéma '+k+' : '+nomE(v)});lines.push('Schéma '+k+' : '+(ok?'exact — ':'pas tout à fait — ')+nomE(DIAG[k].rep).toLowerCase()+'.');});
      paint();md.className='msg '+(all?'ok':'bad');md.textContent=all?lines.join(' '):'Choisis une réponse pour chacun des trois schémas.';};
    /* --- partie 3 : circuit en série --- */
    const d=h('div',{class:'card'},panel);h('h3',{text:'3 · Document 5 : deux circuits en série'},d);
    const g2=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px'},d);
    h('figure',{style:'margin:0'},g2,A.schema({pile:'generateur',cotes:{gauche:'lampe',droite:'lampe',bas:'moteur'},label:'Circuit 1'})+'<figcaption style="font-weight:700">Circuit 1</figcaption>');
    h('figure',{style:'margin:0'},g2,A.schema({pile:'generateur',cotes:{gauche:'moteur',droite:'lampe',bas:'lampe'},label:'Circuit 2'})+'<figcaption style="font-weight:700">Circuit 2</figcaption>');
    const r2=h('div',{style:'display:flex;flex-wrap:wrap;gap:12px;margin:10px 0'},d);
    const sDiff=selectGroup(r2,'ci5-diff','La différence entre les deux circuits est…',[['','— je choisis —'],['ordre','l’ordre des dipôles'],['nombre','le nombre de boucles'],['dipoles','les dipôles utilisés']],''),
          sFonc=selectGroup(r2,'ci5-fonc','Changer l’ordre des dipôles d’un circuit en série change-t-il son fonctionnement ?',[['','— je choisis —'],['oui','Oui'],['non','Non']],'');
    const bs=h('button',{type:'button',class:'btn primary',text:'Vérifier'},d),ms=h('div',{class:'msg','aria-live':'polite'},d);
    bs.onclick=function(){if(!sDiff.value||!sFonc.value){ms.className='msg bad';ms.textContent='Réponds aux deux questions.';return;}const ok=sDiff.value==='ordre'&&sFonc.value==='non';
      X.addEssai({type:'serie',diff:sDiff.value,fonc:sFonc.value,ok:ok,observation:'ordre '+(sDiff.value==='ordre'?'différent':'identique')+' ; fonctionnement '+(sFonc.value==='non'?'inchangé':'modifié')});paint();
      ms.className='msg '+(ok?'ok':'bad');ms.textContent=ok?'Exact : les deux circuits ont les mêmes dipôles dans un autre ordre, et l’ordre ne change pas le fonctionnement d’un circuit en série.':'Pas tout à fait : compare les dipôles de chaque circuit et leur place.';};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){md.className='msg';md.textContent=X.aide();};
    maj();paint();
  }
  window.FICHE_CI_ELE05={
    id:'NL-CI-6E-ELE-05',version:'0.9',modele:'schematisation-serie-v1',
    titre:'Schématiser un circuit électrique',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Schématiser un circuit en série avec les symboles normalisés, en appliquant une méthode et trois règles, et justifier une erreur sur un schéma.',
    objectifsPedagogiques:['Reconnaître les symboles normalisés de la pile, de la lampe, du moteur et de l’interrupteur','Schématiser un circuit en appliquant la méthode en trois étapes','Justifier une erreur sur un schéma en l’appuyant sur les consignes du montage'],
    situationEvaluation:'Awa envoie à Kofi, par message, un schéma de son circuit pour qu’il le refasse. Quelles règles doit-elle respecter pour que Kofi comprenne son schéma, et pourquoi utiliser des symboles normalisés ?',
    objectif:'Schématiser un circuit en série avec les symboles normalisés et justifier une erreur.',
    objectifEleve:'Faire un schéma que tout le monde comprend.',
    situation:'Le professeur donne un montage : la borne − de la pile est reliée à l’interrupteur, la borne + de la pile est reliée à la lampe, et le moteur est placé entre l’interrupteur et la lampe. Comment représenter ce circuit pour que tout le monde le comprenne ?',
    materiel:'Pile plate fictive de 4,5 V, lampe, moteur, interrupteur, quatre fils de connexion, deux pinces crocodiles, tableau des symboles, règle et crayon à papier.',
    prevision:{consigne:'Avant de commencer, choisis comment représenter un circuit électrique pour que tout le monde le comprenne. Justifie ton hypothèse.',choix:[['symboles','Avec des symboles normalisés placés sur un rectangle et reliés par des traits droits'],['realiste','Avec un dessin réaliste de chaque objet'],['photo','Avec une photographie du montage'],['libre','Chacun invente ses propres symboles']]},
    protocole:['Nommer chaque dipôle du montage avec le document 1 et dessiner son symbole.','Tracer un rectangle pour la boucle, placer chaque dipôle avec son symbole dans l’ordre du montage, puis relier par des traits droits.','Schématiser une première fois avec l’interrupteur ouvert, puis avec l’interrupteur fermé.','Chercher l’erreur de chacun des trois schémas du document 4, puis comparer les deux circuits du document 5.'],
    variable:'Le schéma proposé (symboles, ordre, polarités, état de l’interrupteur)',maintenu:'Le même montage de référence',
    colonnes:['Partie','Ce que j’ai fait','Résultat'],lignesVides:6,
    lignes:st=>st.essais.map(e=>e.type==='schema'?['Schéma, interrupteur '+(e.etat==='ferme'?'fermé':'ouvert'),e.ok?'schéma conforme':(e.erreurs||[]).join(' ; '),e.ok?'Juste':'À corriger']:e.type==='erreur'?['Schéma '+e.schema,'Erreur choisie : '+nomE(e.rep),e.ok?'Juste':'À revoir']:['Circuits 1 et 2',e.observation||'—',e.ok?'Juste':'À revoir']),
    resume:e=>e.type==='schema'?'schéma avec interrupteur '+(e.etat==='ferme'?'fermé':'ouvert')+' : '+(e.ok?'conforme':'à corriger'):e.type==='erreur'?'schéma '+e.schema+' : '+nomE(e.rep).toLowerCase()+(e.ok?' (juste)':' (à revoir)'):'circuits en série : '+(e.ok?'compris':'à revoir'),
    confrontation:'1. Quelles étapes de la méthode as-tu appliquées ? 2. Quelles erreurs as-tu corrigées sur ton schéma ? 3. Quelle erreur contenait chacun des schémas A, B et C ? 4. Quelle différence y a-t-il entre les circuits 1 et 2, et change-t-elle leur fonctionnement ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une erreur de schéma que tu as trouvée et la consigne du montage qui l’explique.',
    transfert:{q:'Le schéma A permute le moteur et la lampe par rapport au montage. Peut-il représenter un circuit qui fonctionne ?',rep:'oui',expl:'Oui : dans un circuit en série, l’ordre des dipôles ne change pas le fonctionnement. Mais ce schéma ne respecte pas l’ordre du montage donné : il est donc faux comme représentation de ce montage.'},
    critere:'Produire un schéma conforme aux consignes et justifier au moins une erreur de schéma.',
    essaisMin:6,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne place pas correctement les symboles.'],['MF','Schématise avec des erreurs d’ordre ou de polarité qu’il ne sait pas justifier.'],['MS','Schématise correctement et identifie les erreurs des schémas A, B et C.'],['TBM','Schématise correctement, justifie chaque erreur et explique que l’ordre ne change pas le fonctionnement en série.']],
    peutConfronter:st=>{const e=st.essais;return e.some(x=>x.type==='schema'&&x.ok&&x.etat==='ouvert')&&e.some(x=>x.type==='schema'&&x.ok&&x.etat==='ferme')&&['A','B','C'].every(k=>e.some(x=>x.type==='erreur'&&x.schema===k))&&e.some(x=>x.type==='serie');},
    aides:['Repère d’abord la boucle : trace un rectangle avant de placer les symboles.','Suis le montage pas à pas en partant de la borne − de la pile : quel dipôle rencontre-t-on en premier ?','Compare le schéma avec la consigne du document 3 : symbole, ordre, polarité, interrupteur.'],
    synthese:'Pour représenter un circuit électrique, on utilise des symboles normalisés, compris par tous. Méthode : 1. je trace un rectangle pour chaque boucle ; 2. je place chaque dipôle avec son symbole, dans l’ordre du montage ; 3. je relie les symboles par des traits droits. Je respecte trois règles : une règle et un crayon à papier, je repère chaque boucle, je respecte l’ordre des dipôles et les polarités du générateur. Un circuit en série ne comporte qu’une seule boucle, et l’ordre des dipôles ne change pas son fonctionnement.',
    prof:{reference:'Schéma attendu : pile en haut avec le − à gauche, interrupteur à gauche, moteur en bas, lampe à droite, le + de la pile relié à la lampe. Schéma A : moteur et lampe permutés (ordre non respecté). Schéma B : polarités de la pile inversées. Schéma C : générateur G à la place du moteur (symbole faux). Les circuits 1 et 2 contiennent les mêmes dipôles dans un autre ordre : l’ordre ne change pas le fonctionnement en série.',attendus:['Hypothèse formulée avant l’essai.','Schéma conforme avec l’interrupteur ouvert, puis fermé.','Erreur correcte identifiée pour chacun des schémas A, B et C.','Compréhension du circuit en série : une seule boucle, ordre sans effet sur le fonctionnement.'],erreurs:['Utiliser le symbole du générateur à la place de celui de la pile ou du moteur.','Inverser les polarités de la pile.','Permuter des dipôles sans respecter l’ordre du montage.','Confondre schéma faux et circuit qui ne fonctionnerait pas.']},
    diagnostic:st=>{const s=st.essais.filter(e=>e.type==='schema'&&!e.ok);return s.length?['Un de tes schémas contenait une erreur : '+s[s.length-1].erreurs.join(' ; ')+'.']:['Tes schémas vérifiés sont conformes aux consignes.'];}
  };
})();
