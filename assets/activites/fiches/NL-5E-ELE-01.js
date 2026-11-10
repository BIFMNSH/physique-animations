/* NohobaLab · 5e · ELE-01 · L'intensité du courant en série : la lampe use-t-elle le courant ?
   Modèle : pile idéale de 4,5 V, lampes assimilées à des résistances constantes de 15 Ω, en série.
   Une vraie lampe n'a pas une résistance constante : les valeurs sont celles de la simulation. */
(function(){
  'use strict';
  const U=4.5,R=15,PTS=['A','B','C'];
  /* intensité en mA, identique en tout point d'un circuit en série */
  function intensite(n,ferme){return ferme?Math.round(U/(n*R)*1000):0;}
  window.NohobaIntensite={intensite:intensite};
  const SCH={A:[340,63],B:[292,160],C:[146,40]};
  const fmt=v=>v+' mA';
  function schema(n,ferme,pt){
    const A=window.NohobaAtelier,h=A.schema({cotes:{droite:'lampe',bas:n===2?'lampe':'fil',gauche:ferme?'interFerme':'interOuvert'},legende:'Schéma normalisé',label:'Schéma normalisé du montage en série'+(pt?', ampèremètre au point '+pt:'')+'.'});
    if(!pt)return h;const c=SCH[pt];
    return h.replace('</svg>','<circle cx="'+c[0]+'" cy="'+c[1]+'" r="14" fill="#fff" stroke="#243049" stroke-width="2.5"/>'+A.T(c[0],c[1]+6,'A',17,'#243049',800)+'</svg>');}
  function montage(n,ferme,pt){
    return window.NohobaAtelier.banc5e({n:n,on:ferme,k1:n===2?.5:1,k2:.5,pts:true,sel:pt,
      label:'Montage : pile de 4,5 V, '+(n===2?'deux lampes':'une lampe')+' et interrupteur '+(ferme?'fermé':'ouvert')+' en série, avec les points de mesure A, B et C'+(pt?' ; ampèremètre au point '+pt:'')+'.'}).svg;}
  function manip(panel,X){
    const A=window.NohobaAtelier,h=window.Activite.h,esc=window.Activite.esc,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier · mesurer l’intensité en trois points'},sec);
    h('p',{text:'La pile, l’interrupteur et les lampes sont en série. Je choisis le montage, je place l’ampèremètre en A, B ou C, puis je lis l’intensité.'},sec);
    const fig=A.paire(sec,h);
    function groupe(legende,nom,items,def){const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,legende);
      items.forEach(it=>h('label',{class:'opt',style:'flex:1 1 130px;margin:0'},f,'<input type="radio" name="'+nom+'" value="'+it[0]+'"'+(it[0]===def?' checked':'')+'><span>'+esc(it[1])+'</span>'));}
    groupe('Nombre de lampes','e-n',[['1','Une lampe'],['2','Deux lampes']],'1');
    groupe('Interrupteur','e-k',[['ferme','Fermé'],['ouvert','Ouvert']],'ferme');
    groupe('Je place l’ampèremètre en','e-p',PTS.map(p=>[p,'Point '+p]),'A');
    const lecture=h('p',{style:'font-weight:800;font-size:1.2em','aria-live':'polite'},sec);
    const S=A.saisie(sec,h,'e-obs','J’observe que l’intensité en A, B et C…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{style:'max-width:100%;overflow-x:auto'},res);
    const val=nom=>sec.querySelector('input[name='+nom+']:checked').value;
    function etat(){return {n:+val('e-n'),ferme:val('e-k')==='ferme',pt:val('e-p')};}
    function maj(){const e=etat(),i=intensite(e.n,e.ferme);fig.montage(montage(e.n,e.ferme,e.pt));fig.schema(schema(e.n,e.ferme,e.pt));
      lecture.textContent='Intensité lue en '+e.pt+' : '+fmt(i)+(e.ferme?'':' (circuit ouvert)');}
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_5E_ELE01,window.FICHE_5E_ELE01.lignes(st),'Mes essais.');}
    sec.addEventListener('change',maj);
    sec.addEventListener('click',ev=>{const g=ev.target.closest&&ev.target.closest('[data-p]');if(g){const r=sec.querySelector('input[name=e-p][value="'+g.getAttribute('data-p')+'"]');if(r){r.checked=true;maj();}}});
    S.btn.onclick=function(){if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      const e=etat();X.addEssai({n:e.n,ferme:e.ferme,pt:e.pt,i:intensite(e.n,e.ferme),observation:S.note()});S.vide();S.msg.textContent='Observation enregistrée.';paint();};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();
  }
  const valides=st=>st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10);
  window.FICHE_5E_ELE01={
    id:'NL-5E-ELE-01',version:'0.9',modele:'serie-intensite-v1',
    titre:'La lampe use-t-elle le courant ?',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'L’intensité du courant électrique',
    competenceVisee:'Mesurer une intensité en plusieurs points d’un circuit en série.',
    objectifsPedagogiques:['Brancher un ampèremètre en série pour mesurer une intensité','Comparer les intensités mesurées en plusieurs points d’un circuit en série','Conclure sur la conservation de l’intensité en série'],
    situationEvaluation:'Kofi lit 120 mA avant un moteur placé en série dans son montage. Que lira-t-il juste après le moteur ? Justifie avec tes mesures.',
    objectif:'Comparer l’intensité avant et après une lampe dans un circuit en série.',
    objectifEleve:'Savoir mesurer l’intensité en plusieurs points d’un circuit en série.',
    situation:'Awa remarque que la lampe de sa chambre chauffe. Elle pense que la lampe « use » le courant : pour elle, il en reste moins après la lampe qu’avant. Kofi n’est pas d’accord. Qui a raison ?',
    materiel:'Pile plate fictive de 4,5 V, interrupteur, une ou deux lampes, ampèremètre, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce que lira l’ampèremètre après la lampe, comparé à avant la lampe. Justifie ton hypothèse avec « car ».',choix:[
      ['meme','La même intensité avant et après la lampe'],['baisse','Une intensité plus petite après la lampe : la lampe use le courant'],['monte','Une intensité plus grande après la lampe'],['nulle','Plus aucun courant après la lampe']]},
    protocole:['Fermer l’interrupteur avec une lampe, placer l’ampèremètre en A, puis en B, puis en C.','Changer un seul élément : passer à deux lampes et mesurer de nouveau en A, B et C.','Ouvrir l’interrupteur et mesurer en A : que lit-on ?','Écrire une observation après chaque essai.'],
    variable:'Le nombre de lampes, puis la position de l’interrupteur',maintenu:'La pile et le circuit en série',
    colonnes:['Lampes','Interrupteur','Point','Intensité','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[String(e.n),e.ferme?'Fermé':'Ouvert',e.pt,fmt(e.i),e.observation||'—']),
    resume:e=>e.n+(e.n===1?' lampe':' lampes')+', interrupteur '+(e.ferme?'fermé':'ouvert')+', en '+e.pt+' : '+fmt(e.i),
    confrontation:'1. Compare les intensités en A, B et C pour une lampe. 2. Que se passe-t-il avec deux lampes ? 3. Que lit-on quand l’interrupteur est ouvert ? Compare ensuite à ton hypothèse : qui a raison, Awa ou Kofi ?',
    retroaction:'Cite les trois mesures d’une même série (A, B, C) avec leur valeur en mA.',
    transfert:{q:'Kofi lit 120 mA avant un moteur placé en série. Que lira-t-il juste après le moteur ?',rep:'120',options:[['0','0 mA'],['60','60 mA'],['120','120 mA'],['240','240 mA']],expl:'En série, l’intensité est la même en tout point : 120 mA. Le moteur reçoit de l’énergie de la pile, mais il n’use pas le courant.'},
    critere:'Mesurer en A, B et C et conclure que l’intensité est la même en tout point d’un circuit en série.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne compare pas les mesures entre elles.'],['MF','Relève les mesures sans conclure sur l’ensemble du circuit.'],['MS','Conclut que l’intensité est la même en A, B et C.'],['TBM','Conclut, cite les mesures avec l’unité et traite le cas de deux lampes et du circuit ouvert.']],
    peutConfronter:st=>{const v=valides(st).filter(e=>e.ferme);return v.filter(e=>e.n===1).map(e=>e.pt).filter((p,i,a)=>a.indexOf(p)===i).length>=3&&v.some(e=>e.n===2)&&valides(st).some(e=>!e.ferme);},
    aides:['Un ampèremètre se branche en série : le courant le traverse.','Compare la valeur lue en A, en B et en C : change-t-elle ?','As-tu essayé deux lampes et l’interrupteur ouvert ?'],
    synthese:'Dans un circuit en série, l’intensité du courant est la même en tout point : avant la lampe, après la lampe, partout. La lampe n’use pas le courant. Avec deux lampes identiques, l’intensité est plus petite, mais toujours la même en A, B et C. Circuit ouvert, l’intensité est nulle partout. La pile transfère de l’énergie à la lampe, qui la convertit en lumière et en chaleur.',
    prof:{reference:'Une lampe : 300 mA en A, B et C. Deux lampes identiques : 150 mA en A, B et C. Interrupteur ouvert : 0 mA. Awa se trompe : la lampe n’use pas le courant.',attendus:['Hypothèse notée avant les mesures.','Trois points mesurés pour une lampe.','Phrase : l’intensité est la même en tout point d’un circuit en série.'],erreurs:['Croire que le courant s’use dans la lampe.','Brancher l’ampèremètre en dérivation.','Oublier l’unité (mA).']},
    diagnostic:st=>valides(st).some(e=>e.n===2)?['Tu as testé deux lampes : que remarques-tu sur A, B et C ?']:['Passe à deux lampes et mesure de nouveau en A, B et C.']
  };
})();
