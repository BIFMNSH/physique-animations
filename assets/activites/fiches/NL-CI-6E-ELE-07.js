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
  function resultat(id,contact,pile){const m=MAT.find(x=>x.id===id);return !!(m&&m.conducteur&&contact&&pile);}
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
    const msg=h('p',{class:'msg','aria-live':'polite'},section);
    const results=h('div',{class:'card'},panel);
    h('h3',{text:'Mes observations'},results);
    const table=h('div',{},results);
    function visual(){
      const m=MAT.find(x=>x.id===sel.value),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;
      const on=resultat(m.id,contact,pile);
      svgHost.innerHTML='<svg viewBox="0 0 520 270" role="img" aria-label="Circuit électrique '+(on?'fermé : lampe allumée':'sans éclairage : lampe éteinte')+' ; matériau '+esc(m.nom)+'"><rect x="2" y="2" width="516" height="266" rx="16" fill="#f8fafc"/><path d="M130 90 H330 V188 H275 M212 188 H130 V90" fill="none" stroke="'+(contact?'#697787':'#9aa7af')+'" stroke-width="5"/><path d="M131 90 H166" stroke="#bb304a" stroke-width="5"/><rect x="120" y="76" width="62" height="66" rx="8" fill="#7b438c"/><rect x="124" y="70" width="54" height="12" rx="3" fill="#b66fb7"/><text x="151" y="111" text-anchor="middle" fill="white" font-size="13">4,5 V</text><circle cx="330" cy="135" r="25" fill="'+(on?'#ffd75a':'#e8edf2')+'" stroke="#6e7784" stroke-width="3"/><path d="M315 120 L345 150 M345 120 L315 150" stroke="#6e7784" stroke-width="2"/><path d="M212 188 H275" stroke="'+m.couleur+'" stroke-width="13" stroke-linecap="round"/><circle cx="212" cy="188" r="6" fill="#52606c"/><circle cx="275" cy="188" r="6" fill="#52606c"/><text x="243" y="223" text-anchor="middle" fill="#17212e" font-size="14">'+esc(m.nom)+'</text><text x="330" y="180" text-anchor="middle" fill="#17212e" font-size="13">'+(on?'Allumée':'Éteinte')+'</text><text x="26" y="35" fill="#17212e" font-size="13">Circuit simplifié</text>'+(contact?'':'<path d="M275 182 l24 -15" stroke="#e63946" stroke-width="4"/>')+'</svg>';
      out.textContent='Observation : lampe '+(on?'allumée':'éteinte')+'. '+(!contact?'Un contact est ouvert.':!pile?'La pile ne fonctionne pas.':'Conditions de test contrôlées.');
    }
    function tablePaint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE07,window.FICHE_CI_ELE07.lignes(st),'Observations simulées : vérifier les conditions de chaque essai.');}
    sel.onchange=visual;section.querySelector('#ci-contact').onchange=visual;section.querySelector('#ci-pile').onchange=visual;
    record.onclick=function(){const m=MAT.find(x=>x.id===sel.value),contact=section.querySelector('#ci-contact').checked,pile=section.querySelector('#ci-pile').checked;X.addEssai({materiau:m.nom,id:m.id,contact:contact,pile:pile,allumee:resultat(m.id,contact,pile)});tablePaint();msg.textContent='Observation enregistrée : '+m.nom+'.';};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){msg.textContent=X.aide();};
    visual();tablePaint();
  }
  window.FICHE_CI_ELE07={
    id:'NL-CI-6E-ELE-07',version:'1.0',modele:'conductivite-qualitative-v1',
    titre:'Quels matériaux laissent passer le courant électrique ?',niveau:'6e',chapitre:'Le circuit électrique',
    objectif:'Distinguer expérimentalement conducteurs et isolants dans un circuit simple.',
    objectifEleve:'Identifier les matériaux qui permettent le passage du courant dans des conditions contrôlées.',
    situation:'Une lampe doit fonctionner avec plusieurs objets disponibles : cuivre, acier, aluminium, plastique et bois sec. Lesquels peuvent compléter un circuit électrique et faire briller la lampe ?',
    materiel:'Pile fictive 4,5 V, lampe, fils, échantillons de cinq matériaux, connexions virtuelles.',
    prevision:{consigne:'Prévois quels types de matériaux permettront à la lampe de s’allumer. Justifie ta réponse.',choix:[['metaux','Les trois métaux devraient permettre l’allumage'],['tous','Tous les matériaux devraient permettre l’allumage'],['aucun','Aucun matériau ne devrait permettre l’allumage']]},
    protocole:['S’assurer que la pile est fonctionnelle et que les connexions sont correctes.','Insérer un matériau et noter l’état de la lampe.','Recommencer avec les autres matériaux sans changer le reste du circuit.','Pour comprendre une lampe éteinte, vérifier la pile et les connexions.'],
    variable:'Nature du matériau inséré',maintenu:'Même lampe, même pile fonctionnelle, connexions correctes',
    colonnes:['Matériau','Contacts','Pile','Lampe'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[e.materiau,e.contact?'Corrects':'Ouverts',e.pile?'Fonctionnelle':'Défaillante',e.allumee?'Allumée':'Éteinte']),
    resume:e=>e.materiau+' : lampe '+(e.allumee?'allumée':'éteinte')+(e.contact&&e.pile?' (montage contrôlé)':' (montage non valide)'),
    confrontation:'Compare tes observations aux prévisions. Appuie ton interprétation uniquement sur les essais réalisés avec une pile et des connexions fonctionnelles.',
    retroaction:'Cite au moins un matériau conducteur et un matériau isolant, et précise les observations utilisées.',
    transfert:{q:'La lampe reste éteinte avec un clou en acier mais l’un des fils est détaché. Peut-on conclure que l’acier est isolant ?',rep:'non',expl:'Non : la connexion ouverte empêche le courant de circuler. Il faut rétablir les contacts avant de tester le matériau.'},
    critere:'Classer correctement les matériaux testés et distinguer une observation d’une interprétation.',
    essaisMin:2,manip:manip,
    aides:['Commence par vérifier la pile et les connexions avant de classer un matériau.','Une lampe allumée avec un matériau inséré indique que celui-ci laisse passer un courant suffisant.','Si la lampe est éteinte, vérifie d’abord le circuit ; compare les matériaux dans les mêmes conditions.'],
    synthese:'Dans un circuit fermé et correctement alimenté, le cuivre, l’aluminium et l’acier sont conducteurs ; le plastique et le bois sec sont isolants dans les conditions de cette expérience. Une lampe éteinte ne suffit pas à conclure si le circuit présente un défaut.',
    prof:{reference:'Avec une pile fonctionnelle et de bons contacts, les métaux testés allument la lampe. Le bois sec et le plastique n’allument pas la lampe dans ce modèle.',attendus:['Hypothèse formulée avant l’essai.','Contrôle de la pile et des connexions.','Comparaison d’au moins un conducteur et un isolant.','Conclusion argumentée à partir des observations.'],erreurs:['Confondre lampe éteinte et preuve systématique d’isolation.','Supposer que tous les objets métalliques se comportent comme des isolants.','Changer simultanément plusieurs paramètres expérimentaux.']},
    diagnostic:st=>{const valid=st.essais.filter(e=>e.contact&&e.pile),types=new Set(valid.map(e=>e.allumee));return valid.length<2?['Réalise au moins deux essais avec des contacts corrects et une pile fonctionnelle.']:types.size<2?['Teste également un matériau de comportement différent, dans les mêmes conditions.']:['Tu disposes d’observations de matériaux conducteurs et isolants en conditions contrôlées.'];}
  };
})();