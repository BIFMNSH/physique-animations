/* NohobaLab · 6e Côte d'Ivoire · ELE-17 · Découvrir la notion de courant électrique.
   Modèle des grains : des charges électriques en mouvement dans la boucle fermée, immobiles dès que la boucle est ouverte.
   Les grains sont un modèle, pas une photo ; ils ne donnent pas la vitesse du courant. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const ACT=[['ferme','Je ne change rien (boucle fermée)'],['inter','J’ouvre l’interrupteur'],['rouge','Je détache le fil rouge de la lampe'],['noir','Je détache le fil noir de la lampe'],['pile','Je retire la pile']];
  const nom=id=>(ACT.filter(x=>x[0]===id)[0]||['',''])[1];
  const ferme=a=>a==='ferme';
  function dessin(a){
    const A=window.NohobaAtelier,on=ferme(a);
    const rFull='M218.4 104 H410 V146',nFull='M410 194 V236 H60 V104 H175.2';
    let s='';
    if(a==='pile')s+='<rect x="146" y="10" width="110" height="96" rx="10" fill="none" stroke="#9FB0C4" stroke-width="2" stroke-dasharray="6 5"/>'+A.T(201,62,'pile retirée',13,'#8895A8',700);else s+=A.pile45t(150,14,.9);
    s+=A.lampeV(343,170,on,1);
    s+=A.fil('M218.4 104 H296','#E0342F')+A.fil('M344 104 H410 V'+(a==='rouge'?'122':'146'),'#E0342F');
    s+=A.fil('M175.2 104 H60 V236 H410 V'+(a==='noir'?'220':'194'),'#2E3138');
    s+=A.interrupteur(320,104,a!=='inter');
    s+='<path data-w="r" d="'+rFull+'" fill="none" stroke="none"/><path data-w="n" d="'+nFull+'" fill="none" stroke="none"/><g data-g="m"></g>';
    s+=A.broches([[296,104],[344,104],[410,a==='rouge'?122:146],[410,a==='noir'?220:194]]);
    return A.svg(s,'0 0 500 260','Pile, interrupteur, lampe et fils montés en rectangle, avec des grains : '+(on?'la boucle est fermée, la lampe brille, les grains circulent':'la boucle est ouverte, la lampe est éteinte, les grains sont immobiles'));
  }
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier · le modèle des grains dans la boucle'},sec);
    h('p',{text:'Les petits grains jaunes sont un modèle : ils représentent les charges électriques. Ouvre la boucle à différents endroits et regarde ce que font les grains et la lampe. Ce modèle ne donne pas la vitesse du courant.'},sec);
    const fig=A.paire(sec,h);
    const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,'Je…');
    ACT.forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 230px;margin:0'},f,'<input type="radio" name="ci17-a" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+esc(c[1])+'</span>'));
    const S=A.saisie(sec,h,'ci17-obs','J’observe que les grains… et que la lampe…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{},res);
    const val=()=>sec.querySelector('input[name=ci17-a]:checked').value;
    let phase=0,courant=val(),reduit=false;try{reduit=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
    const NG=9;
    function grainsSVG(){const m=fig.hostM.querySelector('[data-g=m]'),pr=fig.hostM.querySelector('[data-w=r]'),pn=fig.hostM.querySelector('[data-w=n]'),sg=fig.hostS.querySelector('[data-g=s]');
      if(m&&pr&&pn&&pr.getTotalLength){const Lr=pr.getTotalLength(),Ln=pn.getTotalLength(),L=Lr+Ln;if(!m.children.length){for(let i=0;i<NG*2;i++){const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','5');c.setAttribute('fill','#FFB020');c.setAttribute('stroke','#B87400');m.appendChild(c);}}
        for(let i=0;i<m.children.length;i++){const d=((i/m.children.length+phase)%1)*L,p=d<Lr?pr.getPointAtLength(d):pn.getPointAtLength(d-Lr);m.children[i].setAttribute('cx',p.x.toFixed(1));m.children[i].setAttribute('cy',p.y.toFixed(1));}}
      if(sg){const pts=A.grains(16,phase);if(!sg.children.length){pts.forEach(()=>{const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','4.5');c.setAttribute('fill','#FFB020');c.setAttribute('stroke','#B87400');sg.appendChild(c);});}
        pts.forEach((p,i)=>{sg.children[i].setAttribute('cx',p[0]);sg.children[i].setAttribute('cy',p[1]);});}}
    function maj(){
      const a=val(),on=ferme(a);courant=a;
      fig.montage(dessin(a));
      fig.schema(A.schema({pile:a==='pile'?'absente':'normale',cotes:{droite:'lampe',gauche:a==='inter'?'interOuvert':'interFerme',bas:a==='rouge'||a==='noir'?'vide':'fil'},legende:on?'Boucle fermée : les grains circulent':'Boucle ouverte : les grains sont immobiles',label:'Schéma normalisé : boucle '+(on?'fermée':'ouverte')}).replace('</svg>','<g data-g="s"></g></svg>'));
      grainsSVG();
      S.out.textContent=nom(a)+'. Observation : lampe '+(on?'allumée, grains en mouvement':'éteinte, grains immobiles')+'.';
    }
    function tick(){if(!sec.isConnected)return;if(ferme(courant)&&!reduit){phase=(phase+0.003)%1;grainsSVG();}requestAnimationFrame(tick);}
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE17,window.FICHE_CI_ELE17.lignes(st),'Mes ouvertures de la boucle.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){
      if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      const a=val();X.addEssai({action:a,allumee:ferme(a),grains:ferme(a),observation:S.note()});paint();S.msg.textContent='Observation enregistrée.';S.vide();
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();if(typeof requestAnimationFrame==='function')requestAnimationFrame(tick);
  }
  window.FICHE_CI_ELE17={
    id:'NL-CI-6E-ELE-17',version:'0.9',modele:'grains-boucle-v1',
    titre:'Découvrir la notion de courant électrique',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Expliquer que le courant électrique est une circulation de charges électriques dans un circuit fermé.',
    objectifsPedagogiques:['Associer l’allumage de la lampe à une circulation dans la boucle fermée','Dire que la circulation s’arrête dès que la boucle est ouverte, où que ce soit','Distinguer ce que le modèle des grains montre de ce qu’il ne montre pas'],
    situationEvaluation:'Kofi dit : « Quand j’ouvre l’interrupteur, le courant continue dans les fils près de la lampe. » Que lui réponds-tu, et que peux-tu dire du modèle des grains ?',
    objectif:'Expliquer le courant électrique comme une circulation de charges dans une boucle fermée.',
    objectifEleve:'Comprendre ce qui circule dans les fils quand la lampe brille.',
    situation:'Quand Awa ferme l’interrupteur, la lampe s’allume aussitôt, même si elle est loin de la pile. Qu’est-ce qui circule dans les fils pour que cela arrive ?',
    materiel:'Pile plate fictive de 4,5 V, interrupteur, lampe, fils, modèle des grains (simulation).',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe dans les fils quand la lampe brille. Justifie ton hypothèse.',choix:[['charges','Des charges électriques se déplacent dans toute la boucle fermée'],['rien','Rien ne bouge : le fil sert seulement de support'],['arret','Quelque chose part de la pile et s’arrête dans la lampe'],['pile','La pile envoie tout dans les fils jusqu’à se vider']]},
    protocole:['Observer la boucle fermée : la lampe brille et les grains se déplacent.','Ouvrir la boucle à un endroit : interrupteur, fil rouge, fil noir ou pile retirée.','Observer la lampe et les grains, avec le schéma normalisé.','Refermer la boucle avant l’essai suivant.'],
    variable:'L’endroit où la boucle est ouverte',maintenu:'Même pile, même lampe, mêmes fils',
    colonnes:['Je…','Lampe','Grains du modèle','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[nom(e.action),e.allumee?'Allumée':'Éteinte',e.grains?'Ils circulent':'Ils s’arrêtent',e.observation||'—']),
    resume:e=>nom(e.action).toLowerCase()+' : lampe '+(e.allumee?'allumée, grains en mouvement':'éteinte, grains immobiles'),
    confrontation:'1. Que font les grains quand la lampe brille ? 2. Que font-ils quand tu ouvres la boucle à un endroit ? Cela dépend-il de l’endroit ? 3. Que montre le modèle, et que ne montre-t-il pas ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux ouvertures de la boucle et ce que tu as observé pour la lampe et pour les grains.',
    transfert:{q:'On ouvre la boucle avec l’interrupteur, près de la pile. Les charges continuent-elles à circuler dans le fil près de la lampe ?',rep:'non',expl:'Non : la boucle est ouverte, la circulation s’arrête dans tout le circuit, pas seulement à l’endroit où on a ouvert.'},
    critere:'Expliquer que la circulation s’arrête dans toute la boucle dès qu’elle est ouverte, et dire une limite du modèle.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas la lampe à une circulation.'],['MF','Dit que quelque chose circule mais pas pourquoi la lampe s’éteint.'],['MS','Explique que la boucle fermée permet la circulation et que l’ouvrir l’arrête.'],['TBM','Explique, généralise à tout point d’ouverture et nomme une limite du modèle.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10),ouv=new Set(v.filter(e=>!e.allumee).map(e=>e.action));return v.length>=3&&v.some(e=>e.allumee)&&ouv.size>=2;},
    aides:['Regarde les grains dans la boucle fermée : bougent-ils ?','Ouvre la boucle à un autre endroit : le résultat change-t-il ?','Les grains sont un modèle : ils aident à comprendre, ils ne sont pas une photo des fils.'],
    synthese:'Quand la boucle est fermée, des charges électriques se déplacent dans tout le circuit : c’est le courant électrique. Si on ouvre la boucle, où que ce soit, la circulation s’arrête dans tout le circuit et la lampe s’éteint. Le modèle des grains aide à comprendre, mais ce n’est pas une photo : il ne donne ni la vitesse ni la taille des charges.',
    prof:{reference:'Boucle fermée : la lampe brille et les grains circulent. Boucle ouverte n’importe où (interrupteur, fil détaché, pile retirée) : la lampe est éteinte et les grains s’immobilisent dans tout le circuit. Le modèle illustre la circulation ; il ne représente pas la vitesse réelle des charges.',attendus:['Hypothèse formulée avant l’essai.','Au moins deux endroits d’ouverture différents observés.','Conclusion : la circulation s’arrête partout quand la boucle est ouverte.','Limite du modèle citée.'],erreurs:['Croire que la circulation continue d’un côté de l’interrupteur ouvert.','Prendre le modèle des grains pour une photo.','Croire que le courant « s’use » dans la lampe.']},
    diagnostic:st=>{const ouv=new Set(st.essais.filter(e=>!e.allumee).map(e=>e.action));return ouv.size>=2?['Tu as ouvert la boucle à plusieurs endroits : compare les résultats.']:['Ouvre la boucle à un deuxième endroit pour comparer.'];}
  };
})();
