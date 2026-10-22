/* NohobaLab · 6e Côte d'Ivoire · ELE-07 · Modèle qualitatif v1.
   Une lampe allumée indique une boucle fermée et un conducteur suffisant.
   Une lampe éteinte ne prouve pas à elle seule l'isolation : contacts et pile doivent être contrôlés. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const MAT=[
    {id:'cuivre',nom:'Cuivre',conducteur:true,couleur:'#bd7438'},
    {id:'acier',nom:'Acier',conducteur:true,couleur:'#8896a5'},
    {id:'aluminium',nom:'Aluminium',conducteur:true,couleur:'#bec9d6'},
    {id:'plastique',nom:'Plastique',conducteur:false,couleur:'#6bb6e7'},
    {id:'bois',nom:'Bois sec',conducteur:false,couleur:'#b38b56'}
  ];
  function resultat(id,contact,pile){return window.NohobaConductivite.evaluer({id:id,contact:contact,pile:pile}).allumee;}
  function manip(panel,X){
    const st=X.st(),section=h('div',{class:'card'},panel);
    h('h3',{text:'Banc d’essai · pile de 4,5 V et lampe'},section);
    h('p',{text:'Insère un seul matériau à la fois dans le circuit et contrôle les connexions. Utilise uniquement la pile fictive de la simulation.'},section);
    const lab=h('label',{for:'ci-matiere',text:'Matériau à insérer :'},section);
    const sel=h('select',{id:'ci-matiere'},section,MAT.map(m=>'<option value="'+m.id+'">'+esc(m.nom)+'</option>').join(''));
    const box=h('div',{class:'row'},section);
    const contactLabel=h('label',{class:'opt'},box,'<input id="ci-contact" type="checkbox" checked> Contacts correctement raccordés');
    const pileLabel=h('label',{class:'opt'},box,'<input id="ci-pile" type="checkbox" checked> Pile fonctionnelle');
    const svgHost=h('div',{style:'max-width:560px;margin:16px auto'},section);
    const out=h('p',{'aria-live':'polite'},section);
    const record=h('button',{type:'button',class:'btn primary',text:'Enregistrer mon observation'},section);
    const observationLabel=h('label',{for:'ci-observation',text:'Mon observation (écris ce que tu vois, sans conclure) :'},section);
    const observation=h('textarea',{id:'ci-observation',rows:'2',placeholder:'J’observe que la lampe…'},section);
    const msg=h('p',{class:'msg','aria-live':'polite'},section);
    const results=h('div',{class:'card'},panel);
    h('h3',{text:'Mes observations'},results);
    const table=h('div',{},results);
    function visual(){
      const m=MAT.find(x=>x.id===sel.value),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;
      const on=resultat(m.id,contact,pile);
      if(!window.NohobaCircuit){out.textContent='Le montage ne peut pas être chargé.';return;}
      if(!visual.circuit)visual.circuit=window.NohobaCircuit.create(svgHost,{});
      visual.circuit.update({materiau:m.nom,couleur:m.couleur,conducteur:m.conducteur,contact:contact,pile:pile});
      out.textContent='Observation : lampe '+(on?'allumée':'éteinte')+'. '+(!contact?'Un contact est ouvert.':!pile?'La pile ne fonctionne pas.':'Conditions de test contrôlées.');
    }
    function tablePaint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE07,window.FICHE_CI_ELE07.lignes(st),'Observations simulées : vérifier les conditions de chaque essai.');}
    sel.onchange=visual;section.querySelector('#ci-contact').onchange=visual;section.querySelector('#ci-pile').onchange=visual;
    record.onclick=function(){const m=MAT.find(x=>x.id===sel.value),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;const note=observation.value.trim();if(note.length<10){msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';observation.focus();return;}X.addEssai({materiau:m.nom,id:m.id,contact:contact,pile:pile,allumee:resultat(m.id,contact,pile),observation:note});tablePaint();msg.textContent='Observation enregistrée : '+m.nom+'.';observation.value='';};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){msg.textContent=X.aide();};
    visual();tablePaint();
  }
  window.FICHE_CI_ELE07={
    id:'NL-CI-6E-ELE-07',version:'1.0',modele:'conductivite-qualitative-v1',
    titre:'Quels matériaux laissent passer le courant électrique ?',niveau:'6e',chapitre:'Le circuit électrique',
    situationEvaluation:'Awa doit réparer une lampe de poche. Elle hésite entre un fil de cuivre et un morceau de plastique pour rétablir la connexion. Quel matériau choisir et pourquoi ?',
    objectif:'Distinguer expérimentalement conducteurs et isolants dans un circuit simple.',
    objectifEleve:'Identifier les matériaux qui permettent le passage du courant dans des conditions contrôlées.',
    situation:'La lampe de poche d’Awa ne fonctionne plus parce qu’un fil de connexion est coupé. Elle dispose de cuivre, d’acier, d’aluminium, de plastique et de bois sec. Comment déterminer quels matériaux peuvent rétablir la connexion électrique ?',
    materiel:'Pile fictive 4,5 V, lampe, fils, échantillons de cinq matériaux, connexions virtuelles.',
    prevision:{consigne:'Avant les essais, choisis les matériaux qui devraient permettre à la lampe de s’allumer. Justifie ton hypothèse.',choix:[['metaux','Cuivre, acier et aluminium'],['tous','Tous les matériaux proposés'],['aucun','Aucun matériau proposé'],['isolants','Plastique et bois sec']]},
    protocole:['S’assurer que la pile est fonctionnelle et que les connexions sont correctes.','Insérer un matériau et noter l’état de la lampe.','Recommencer avec les autres matériaux sans changer le reste du circuit.','Pour comprendre une lampe éteinte, vérifier la pile et les connexions.'],
    variable:'Nature du matériau inséré',maintenu:'Même lampe, même pile fonctionnelle, connexions correctes',
    colonnes:['Matériau','Contacts','Pile','Lampe','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[e.materiau,e.contact?'Corrects':'Ouverts',e.pile?'Fonctionnelle':'Défaillante',e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>e.materiau+' : lampe '+(e.allumee?'allumée':'éteinte')+(e.contact&&e.pile?' (montage contrôlé)':' (montage non valide)'),
    confrontation:'1. Quels matériaux allument la lampe lorsque les connexions et la pile fonctionnent ? 2. Quels matériaux ne l’allument pas dans les mêmes conditions ? 3. Quel point commun remarques-tu parmi les matériaux conducteurs ? 4. Si la pile est défaillante, peut-on classer le matériau ? Compare ensuite ces observations à ton hypothèse initiale.',
    retroaction:'Cite au moins un matériau conducteur et un matériau isolant, et précise les observations utilisées.',
    transfert:{q:'La lampe reste éteinte avec un clou en acier mais l’un des fils est détaché. Peut-on conclure que l’acier est isolant ?',rep:'non',expl:'Non : la connexion ouverte empêche le courant de circuler. Il faut rétablir les contacts avant de tester le matériau.'},
    critere:'Classer correctement les matériaux testés et distinguer une observation d’une interprétation.',
    essaisMin:2,manip:manip,guidage:true,
    grilleMaitrise:[
      ['MI','Ne parvient pas à classer les matériaux sur la base d’essais valides.'],
      ['MF','Classe certains matériaux mais sa justification reste incomplète.'],
      ['MS','Classe un conducteur et un isolant en s’appuyant sur des observations valides.'],
      ['TBM','Classe les matériaux, justifie ses choix et explique l’influence d’un contact défectueux.']
    ],
    peutConfronter:st=>{
      const valides=st.essais.filter(e=>e.contact&&e.pile&&typeof e.observation==='string'&&e.observation.trim().length>=10);
      return valides.length>=2 && valides.some(e=>e.allumee) && valides.some(e=>!e.allumee);
    },
    aides:['Commence par vérifier la pile et les connexions avant de classer un matériau.','Une lampe allumée avec un matériau inséré indique que celui-ci laisse passer un courant suffisant.','Si la lampe est éteinte, vérifie d’abord le circuit ; compare les matériaux dans les mêmes conditions.'],
    synthese:'Dans un circuit fermé et correctement alimenté, le cuivre, l’aluminium et l’acier sont conducteurs ; le plastique et le bois sec sont isolants dans les conditions de cette expérience. Une lampe éteinte ne suffit pas à conclure si le circuit présente un défaut.',
    prof:{reference:'Avec une pile fonctionnelle et de bons contacts, les métaux testés allument la lampe. Le bois sec et le plastique n’allument pas la lampe dans ce modèle.',attendus:['Hypothèse formulée avant l’essai.','Contrôle de la pile et des connexions.','Comparaison d’au moins un conducteur et un isolant.','Conclusion argumentée à partir des observations.'],erreurs:['Confondre lampe éteinte et preuve systématique d’isolation.','Supposer que tous les objets métalliques se comportent comme des isolants.','Changer simultanément plusieurs paramètres expérimentaux.']},
    diagnostic:st=>{const valid=st.essais.filter(e=>e.contact&&e.pile),types=new Set(valid.map(e=>e.allumee));return valid.length<2?['Réalise au moins deux essais avec des contacts corrects et une pile fonctionnelle.']:types.size<2?['Teste également un matériau de comportement différent, dans les mêmes conditions.']:['Tu disposes d’observations de matériaux conducteurs et isolants en conditions contrôlées.'];}
  };
})();