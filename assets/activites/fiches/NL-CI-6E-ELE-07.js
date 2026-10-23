/* NohobaLab · 6e Côte d'Ivoire · ELE-07 · Modèle qualitatif v1.
   Une lampe allumée indique une boucle fermée et un conducteur suffisant.
   Une lampe éteinte ne prouve pas à elle seule l'isolation : contacts et pile doivent être contrôlés. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const ORDRE=['gomme','clou','bois','cle','regle','piece','verre','mine','couteau','air','cuivre','fourchette'];
  function matieres(){const M=window.NohobaConductivite.materiaux;return ORDRE.map(id=>({id:id,nom:M[id].nom,conducteur:M[id].conducteur}));}
  function resultat(id,contact,pile){return window.NohobaConductivite.evaluer({id:id,contact:contact,pile:pile}).allumee;}
  function manip(panel,X){
    const MAT=matieres(),st=X.st(),section=h('div',{class:'card'},panel);
    let cur='cle';
    h('h3',{text:'Banc d’essai · pile de 4,5 V et lampe'},section);
    h('p',{text:'Choisis un objet : il se place entre les deux pinces. Contrôle les connexions avant de conclure. Utilise uniquement la pile fictive de la simulation.'},section);
    const wrap=h('div',{style:'display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start'},section);
    const palHost=h('div',{style:'flex:1 1 260px;max-width:340px'},wrap);
    const stage=h('div',{style:'flex:3 1 420px;min-width:0'},wrap);
    const svgHost=h('div',{},stage);
    const box=h('div',{class:'row'},stage);
    h('label',{class:'opt'},box,'<input id="ci-contact" type="checkbox" checked> Contacts correctement raccordés');
    h('label',{class:'opt'},box,'<input id="ci-pile" type="checkbox" checked> Pile fonctionnelle');
    const out=h('p',{'aria-live':'polite'},stage);
    const record=h('button',{type:'button',class:'btn primary',text:'Enregistrer mon observation'},stage);
    h('label',{for:'ci-observation',text:'Mon observation (écris ce que tu vois, sans conclure) :'},stage);
    const observation=h('textarea',{id:'ci-observation',rows:'2',placeholder:'J’observe que la lampe…'},stage);
    const msg=h('p',{class:'msg','aria-live':'polite'},stage);
    const results=h('div',{class:'card'},panel);
    h('h3',{text:'Mes observations'},results);
    const table=h('div',{},results);
    const ctrl={};
    function visual(){
      const m=MAT.find(x=>x.id===cur),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;
      const on=resultat(m.id,contact,pile);
      if(!window.NohobaCircuit){out.textContent='Le montage ne peut pas être chargé.';return;}
      if(!visual.circuit){visual.circuit=window.NohobaCircuit.create(svgHost,{});visual.pal=window.NohobaCircuit.palette(palHost,ORDRE,function(id){cur=id;visual();},cur);}
      visual.circuit.update({id:m.id,materiau:m.nom,conducteur:m.conducteur,contact:contact,pile:pile});
      out.textContent='Objet testé : '+m.nom+'. Observation : lampe '+(on?'allumée':'éteinte')+'. '+(!contact?'Un contact est ouvert.':!pile?'La pile ne fonctionne pas.':'Conditions de test contrôlées.');
    }
    function tablePaint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE07,window.FICHE_CI_ELE07.lignes(st),'Observations simulées : vérifier les conditions de chaque essai.');}
    section.querySelector('#ci-contact').onchange=visual;section.querySelector('#ci-pile').onchange=visual;
    record.onclick=function(){const m=MAT.find(x=>x.id===cur),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;const note=observation.value.trim();if(note.length<10){msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';observation.focus();return;}X.addEssai({materiau:m.nom,id:m.id,contact:contact,pile:pile,allumee:resultat(m.id,contact,pile),observation:note});tablePaint();msg.textContent='Observation enregistrée : '+m.nom+'.';observation.value='';};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){msg.textContent=X.aide();};
    visual();tablePaint();
  }
  window.FICHE_CI_ELE07={
    id:'NL-CI-6E-ELE-07',version:'1.0',modele:'conductivite-qualitative-v1',
    titre:'Quels matériaux laissent passer le courant électrique ?',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Identifier expérimentalement les matériaux conducteurs et isolants dans un circuit électrique simple, à partir d’observations réalisées dans des conditions contrôlées.',
    objectifsPedagogiques:[
      'Formuler une hypothèse sur le comportement électrique de différents matériaux.',
      'Réaliser plusieurs essais en maintenant la pile et les connexions fonctionnelles.',
      'Observer et consigner l’état de la lampe pour chaque matériau testé.',
      'Comparer les résultats, distinguer conducteurs et isolants et justifier une conclusion.',
      'Expliquer pourquoi un contact défectueux ne permet pas de classer un matériau.'
    ],
    situationEvaluation:'Awa doit réparer une lampe de poche. Elle hésite entre un fil de cuivre et un morceau de plastique pour rétablir la connexion. Quel matériau choisir et pourquoi ?',
    objectif:'Distinguer expérimentalement conducteurs et isolants dans un circuit simple.',
    objectifEleve:'Identifier les matériaux qui permettent le passage du courant dans des conditions contrôlées.',
    situation:'La lampe de poche d’Awa ne fonctionne plus parce qu’un fil de connexion est coupé. Elle dispose d’objets de tous les jours : une gomme, un clou, une clé, une pièce, un couteau, une fourchette, une baguette de bois sec, une règle en plastique, un tube en verre, une tige de cuivre et une mine de crayon. Elle peut aussi laisser un espace d’air entre les deux pinces. Comment savoir lesquels peuvent rétablir la connexion électrique ?',
    materiel:'Pile fictive 4,5 V, lampe, fils à pinces crocodiles, onze objets et un espace d’air, connexions virtuelles.',
    prevision:{consigne:'Avant les essais, choisis les objets qui devraient permettre à la lampe de s’allumer. Justifie ton hypothèse.',choix:[['metaux','Les objets en métal et la mine de crayon'],['tous','Tous les objets proposés'],['aucun','Aucun objet proposé'],['isolants','Gomme, bois sec, règle en plastique et verre seulement']]},
    protocole:['S’assurer que la pile est fonctionnelle et que les connexions sont correctes.','Choisir un objet dans la palette : il se place entre les deux pinces. Noter l’état de la lampe.','Recommencer avec les autres objets sans changer le reste du circuit.','Pour comprendre une lampe éteinte, vérifier la pile et les connexions.'],
    variable:'Nature de l’objet placé entre les pinces',maintenu:'Même lampe, même pile fonctionnelle, connexions correctes',
    colonnes:['Objet','Contacts','Pile','Lampe','Mon observation'],lignesVides:5,
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
    synthese:'Dans un circuit fermé et correctement alimenté, les métaux (cuivre, fer, acier de la clé, de la pièce, du couteau et de la fourchette) et le graphite de la mine de crayon sont conducteurs ; la gomme, le bois sec, le plastique, le verre et l’air sont isolants dans les conditions de cette expérience. Une lampe éteinte ne suffit pas à conclure si le circuit présente un défaut.',
    prof:{reference:'Avec une pile fonctionnelle et de bons contacts, les objets en métal et la mine de crayon (graphite) allument la lampe. La gomme, le bois sec, la règle en plastique, le verre et l’air n’allument pas la lampe dans ce modèle.',attendus:['Hypothèse formulée avant l’essai.','Contrôle de la pile et des connexions.','Comparaison d’au moins un conducteur et un isolant.','Conclusion argumentée à partir des observations.'],erreurs:['Confondre lampe éteinte et preuve systématique d’isolation.','Supposer que tous les objets métalliques se comportent comme des isolants.','Changer simultanément plusieurs paramètres expérimentaux.']},
    diagnostic:st=>{const valid=st.essais.filter(e=>e.contact&&e.pile),types=new Set(valid.map(e=>e.allumee));return valid.length<2?['Réalise au moins deux essais avec des contacts corrects et une pile fonctionnelle.']:types.size<2?['Teste également un matériau de comportement différent, dans les mêmes conditions.']:['Tu disposes d’observations de matériaux conducteurs et isolants en conditions contrôlées.'];}
  };
})();