/* NohobaLab · 6e Côte d'Ivoire · MES-07 · Déterminer la masse d'un solide par simple pesée.
   Balance de Roberval réglée, boîte de 1 g à 200 g (500 g en tout), portée 1 kg ; masses simulées choisies pour un équilibre exact au gramme.
   Masses divisionnaires « allumettes » (idée du guide) : 100 allumettes = 10 g, donc 0,1 g par allumette (valeurs simulées). */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures;
  const SIT=[['vide','À vide (rien sur les plateaux)'],['beurre','Le beurre du gâteau'],['bois','Un bloc de bois'],['mangue','Une mangue'],['savon','Un morceau de savon'],['pile','Une pile'],['caillou','Le caillou déjà plongé dans l’éprouvette'],['allumettes','100 allumettes'],['riz25','Un sac de riz de 25 kg']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    Q().atelierPesee(panel,X,{id:'mes07',titre:'Atelier · je pèse un solide par simple pesée',
      intro:'L’objet est sur le plateau de gauche. Je pose les masses marquées sur le plateau de droite, de la plus grande à la plus petite : si le plateau des masses descend, je retire la dernière masse posée et j’essaie la suivante. Je note la pesée à l’équilibre. Valeurs simulées.',
      legende:'Ce que je pèse',situations:SIT.map(s=>({id:s[0],label:s[1],gauche:s[0]==='vide'?[]:[s[0]],droite:[],cote:'droite'})),
      F:()=>window.FICHE_CI_MES07,legendeTable:'Mon carnet de pesée (valeurs simulées).',
      retour:(S,m)=>S.id==='vide'?'La balance est en équilibre à vide : on peut commencer.':'Masse de '+Q().charge(S.id).nom+' : '+m+' g, à 1 g près (la plus petite masse de la boîte).'});
    Q().mesure(panel,X,{id:'mes07allu',titre:'Des masses plus petites que 1 g : les allumettes',
      intro:'La boîte ne descend pas sous 1 g. Comme le propose le guide, je pèse 100 allumettes identiques, puis je calcule la masse d’une seule : elle servira de « masse divisionnaire ».',
      champs:[{cle:'une',label:'Masse d’une allumette',unite:'g'}],F:()=>window.FICHE_CI_MES07,legendeTable:'Mes calculs.',
      render:()=>{const D=Q().dessin;return {montage:D.vue(D.sol('montage',200)+D.objet('allumettes',230,198,'montage'),'Montage : une boîte de 100 allumettes','0 0 460 220'),schema:D.vue(D.sol('schema',200)+D.objet('allumettes',230,198,'schema')+window.NohobaAtelier.T(230,90,'100 allumettes',13,'#243049',800),'Schéma : une boîte de 100 allumettes','0 0 460 220'),txt:'Pèse d’abord les 100 allumettes dans l’atelier, puis divise par 100.'};},
      verifier:(v,s)=>{const x=Q().nombre(s.une),ok=Q().egal(x,Q().ALLUMETTE);return {juste:ok,retour:ok?'Oui : 100 allumettes = 10 g, donc une allumette = 10 ÷ 100 = 0,1 g.':'Pèse les 100 allumettes (10 g), puis divise par 100.',essai:{allumette:true}};},
      attendu:()=>({une:'0,1'})});
  }
  window.FICHE_CI_MES07={
    id:'NL-CI-6E-MES-07',version:'0.9',modele:'simple-pesee-v1',
    titre:'Déterminer la masse d’un solide par simple pesée',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Mesurer la masse d’un solide par simple pesée.',
    objectifsPedagogiques:['Vérifier l’équilibre à vide','Poser le solide sur un plateau et les masses marquées de la plus grande à la plus petite','Faire la somme des masses à l’équilibre','Écrire le résultat avec son unité et sa précision'],
    situationEvaluation:'Awa pèse un morceau de savon sur une balance de Roberval. À l’équilibre, elle a posé 100 g, 20 g et 5 g. Quelle est la masse du savon et à quelle précision ? Quelle erreur aurait-elle faite en commençant par les petites masses ?',
    objectif:'Peser un solide avec une balance de Roberval.',objectifEleve:'Savoir peser un solide par simple pesée.',
    situation:'Pour le gâteau, il faut 50 g de beurre. Awa et Kofi veulent aussi connaître la masse d’un bloc de bois, d’une mangue, d’un morceau de savon, d’une pile et d’un caillou. Ils ont une balance de Roberval et une boîte de masses marquées.',
    materiel:'Simulation : une balance de Roberval (portée 1 kg), une boîte de masses marquées de 1 g à 200 g et sa pince, des objets du quotidien, 100 allumettes.',
    prevision:{consigne:'Avant de peser, choisis comment poser les masses marquées, puis estime « à la main » la masse du bloc de bois. Justifie ton hypothèse.',choix:[['petites','D’abord les plus petites masses'],['hasard','Au hasard, jusqu’à l’équilibre'],['toutes','Toutes les masses d’un coup'],['decroissant','De la plus grande masse qui convient à la plus petite']],nombre:{label:'Mon estimation de la masse du bloc de bois',unite:'g'}},
    protocole:['Vérifier l’équilibre à vide.','Poser l’objet sur le plateau de gauche.','Poser la plus grande masse marquée qui convient sur le plateau de droite.','Si le plateau des masses descend, retirer la dernière masse et essayer la suivante ; sinon, ajouter une masse plus petite.','À l’équilibre, additionner les masses posées.'],
    variable:'L’objet pesé',maintenu:'La même balance et la même boîte de masses',
    colonnes:['Objet','Masses posées','Masse (simulée)','Verdict'],lignesVides:6,
    lignes:st=>Q().lignesPesee(st,'mes07',e=>[lib(SIT,e.sit),e.masses.length?e.masses.join(' + ')+' g':'aucune',e.somme+' g',e.juste?'Juste, à 1 g près':'Somme à revoir']).concat(Q().lignesMesure(st,'mes07allu',e=>['Une allumette','10 g ÷ 100',e.saisies.une+' g',e.juste?'Juste':'À revoir'])),
    resume:e=>e.pesee?lib(SIT,e.sit).toLowerCase()+' : '+e.somme+' g':'une allumette : '+e.saisies.une+' g',
    confrontation:'1. Quelle est la masse de chaque objet ? 2. Pourquoi commencer par la plus grande masse ? 3. Quelle est la précision de la pesée ? 4. Ton estimation à la main était-elle proche ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les masses posées et la masse trouvée pour un objet.',
    transfert:{q:'À l’équilibre, le plateau des masses porte 200 g, 50 g, 20 g, 5 g et 2 g. Quelle est la masse de l’objet ?',type:'nombre',unite:'g',rep:277,tol:0,expl:'200 + 50 + 20 + 5 + 2 = 277 g, à 1 g près.'},
    critere:'Peser trois objets en suivant la méthode des masses décroissantes et écrire la masse avec son unité et sa précision.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pose des masses sans atteindre l’équilibre.'],['MF','Atteint l’équilibre au hasard.'],['MS','Suit la méthode et écrit masse, unité et précision.'],['TBM','Suit la méthode, compare à l’estimation et explique les masses divisionnaires.']],
    peutConfronter:st=>{const j=Q().justes(st,'pesee','mes07'),s=new Set(j.map(e=>e.sit).filter(x=>x!=='vide'));return s.size>=3;},
    aides:['Commence par la plus grande masse qui ne fait pas descendre le plateau des masses.','Si le plateau des masses descend, retire la dernière masse posée.','La précision est la plus petite masse de la boîte : 1 g.'],
    synthese:'Simple pesée : après avoir vérifié l’équilibre à vide, on pose le solide sur un plateau et des masses marquées sur l’autre, de la plus grande à la plus petite ; si le plateau des masses descend, on retire la dernière masse posée et on essaie la suivante. À l’équilibre, la masse du solide est la somme des masses marquées, à la précision de la plus petite masse de la boîte (1 g ici).',
    prof:{reference:'Beurre 50 g ; bois 137 g ; mangue 300 g ; savon 125 g ; pile 23 g ; caillou 58 g ; 100 allumettes 10 g, soit 0,1 g par allumette (valeurs simulées) ; sac de 25 kg refusé (portée 1 kg).',attendus:['Vérifier l’équilibre à vide.','Suivre les masses décroissantes.','Écrire masse, unité et précision.'],erreurs:['Commencer par les petites masses.','Lire la masse sans atteindre l’équilibre.','Dépasser la portée de la balance.']},
    diagnostic:st=>st.essais.length?['Indicatif : pèse au moins trois objets différents.']:['Vérifie d’abord l’équilibre à vide.']
  };
})();
