/* NohobaLab · 6e Côte d'Ivoire · MES-09 · Déterminer la masse d'un solide par la double pesée.
   Balance déréglée : bras gauche 1,1 fois plus long (exagéré et signalé comme un modèle ; aucune notion de moment de force). Tare 440 g, plus lourde que l'objet ;
   masses marquées sur le plateau de l'objet, comme le manuel. Convention : m = m₂ − m₁ pour le solide comme pour le liquide
   (correction de l'écart du TP 13, activité 2, validée le 27 octobre 2026). Mangue 300 g, bocal vide 150 g, eau 200 g (valeurs simulées). */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const ORDRE=['simple_dereglee','eq1','eq2','liq1','liq2'];
  const SIT=()=>ORDRE.map(id=>[id,Q().DOUBLE[id].titre]);
  const QUOI=[['solide','La mangue (solide)'],['liquide','L’eau du bocal (liquide)']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const COMP=[
    {id:'n_simple',q:'Simple pesée : nombre d’équilibres',juste:'1',options:[['1','Un seul'],['2','Deux']],pourquoi:'La simple pesée demande un seul équilibre : l’objet face aux masses marquées.'},
    {id:'n_double',q:'Double pesée : nombre d’équilibres',juste:'2',options:[['1','Un seul'],['2','Deux']],pourquoi:'La double pesée demande deux équilibres face à la même tare.'},
    {id:'tare',q:'Double pesée : rôle de la tare',juste:'reference',options:[['reference','Elle reste sur l’autre plateau aux deux équilibres'],['masse','On lit sa masse à la fin'],['aucun','Elle ne sert à rien']],pourquoi:'La tare reste à la même place : on remplace l’objet par des masses marquées face à elle.'},
    {id:'juste_simple',q:'Simple pesée sur une balance déréglée',juste:'fausse',options:[['fausse','Le résultat est faux'],['juste','Le résultat est juste']],pourquoi:'Avec des bras inégaux, la simple pesée donne une masse fausse (330 g au lieu de 300 g ici).'},
    {id:'juste_double',q:'Double pesée sur une balance déréglée',juste:'juste',options:[['juste','Le résultat est juste'],['fausse','Le résultat est faux']],pourquoi:'Les masses marquées prennent exactement la place de l’objet : la longueur des bras n’intervient pas.'}
  ];
  function manip(panel,X){
    Q().atelierPesee(panel,X,{id:'mes09',titre:'Atelier 1 · je pèse sur la balance déréglée',
      intro:'Cette balance a un bras gauche un peu plus long (exagéré pour être visible). Je fais d’abord une simple pesée de la mangue, puis la double pesée : équilibre 1 avec la mangue et des masses m₁ face à la tare, équilibre 2 avec des masses m₂ seules face à la même tare. Valeurs simulées.',
      legende:'L’étape de pesée',situations:ORDRE.map(id=>{const D=Q().DOUBLE[id];return {id:id,label:D.titre,gauche:D.gauche,droite:D.droite,cote:D.cote,bras:D.bras};}),
      question:'Somme des masses marquées posées (g)',F:()=>window.FICHE_CI_MES09,legendeTable:'Mes équilibres (valeurs simulées).',
      retour:(S,m)=>S.id==='simple_dereglee'?'Simple pesée : '+m+' g. Or la même mangue pèse 300 g sur une balance bien réglée : ce résultat est faux.':S.id==='eq1'||S.id==='liq1'?'Équilibre 1 : m₁ = '+m+' g.':'Équilibre 2 : m₂ = '+m+' g.'});
    Q().mesure(panel,X,{id:'mes09calc',titre:'Atelier 2 · je calcule la masse',
      intro:'Face à la même tare, la masse cherchée a été remplacée par des masses marquées : m = m₂ − m₁.',
      controles:[{cle:'quoi',legende:'Je calcule la masse de',items:QUOI}],
      champs:[{cle:'m1',label:'m₁ (équilibre 1)',unite:'g'},{cle:'m2',label:'m₂ (équilibre 2)',unite:'g'},{cle:'m',label:'m = m₂ − m₁',unite:'g'}],
      F:()=>window.FICHE_CI_MES09,legendeTable:'Mes calculs.',
      render:v=>{const D=Q().dessin,a=v.quoi==='liquide'?'liq1':'eq1',b=v.quoi==='liquide'?'liq2':'eq2',f=m=>D.vue(D.sol(m,240)+'<g transform="translate(0 0) scale(.5)">'+D.roberval(230,480,Object.assign({mode:m,masses:[],penche:'aucun'},Q().DOUBLE[a]))+'</g><g transform="translate(230 0) scale(.5)">'+D.roberval(230,480,Object.assign({mode:m,masses:[],penche:'aucun'},Q().DOUBLE[b]))+'</g>'+window.NohobaAtelier.T(115,30,'Équilibre 1 : m₁',13,'#243049',800)+window.NohobaAtelier.T(345,30,'Équilibre 2 : m₂',13,'#243049',800),'Les deux équilibres de la double pesée '+(v.quoi==='liquide'?'du liquide':'de la mangue'));return {montage:f('montage'),schema:f('schema'),txt:'Reprends m₁ et m₂ de l’atelier 1.'};},
      verifier:(v,s)=>{const r=Q().verifierDouble(v.quoi,s.m1,s.m2,s.m);return {juste:r.juste,retour:r.retour,essai:{quoi:v.quoi,m:r.attendu.m}};},
      attendu:v=>{const m1=Q().massesEquilibre(v.quoi==='liquide'?'liq1':'eq1'),m2=Q().massesEquilibre(v.quoi==='liquide'?'liq2':'eq2');return {m1:m1,m2:m2,m:m2-m1};}});
    M().tri(panel,X,{id:'mes09comp',titre:'Je compare la simple pesée et la double pesée',intro:'Je complète le tableau comparatif.',legende:'Je choisis',cats:[['x','x']],
      items:COMP.map(c=>({id:c.id,label:c.q,options:c.options,juste:c.juste,pourquoi:c.pourquoi,aide:'Repense à tes résultats sur la balance déréglée.'}))});
  }
  window.FICHE_CI_MES09={
    id:'NL-CI-6E-MES-09',version:'0.9',modele:'double-pesee-v1',
    titre:'Déterminer la masse d’un solide par la double pesée',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Mesurer une masse par double pesée et la comparer à la simple pesée.',
    objectifsPedagogiques:['Réaliser deux équilibres face à la même tare avec la balance de Roberval','Calculer la masse d’un solide ou d’un liquide : m = m₂ − m₁','Comparer simple pesée et double pesée','Expliquer pourquoi la double pesée reste juste quand la balance est déréglée'],
    situationEvaluation:'Au marché, la balance d’un vendeur de tomates semble déréglée. Kofi propose de faire une double pesée avec un sac de sable comme tare : équilibre 1 avec les tomates et 120 g de masses, équilibre 2 avec 870 g de masses seules. Quelle est la masse des tomates ? Pourquoi ce résultat est-il juste ?',
    objectif:'Peser juste avec une balance déréglée.',objectifEleve:'Savoir faire une double pesée.',
    situation:'Au marché, Aya accompagne sa mère chez le boucher : la viande pesée ne semble pas avoir la masse demandée. La balance est peut-être déréglée, avec un bras un peu plus long que l’autre. Comment peser juste quand même ?',
    materiel:'Simulation : une balance de Roberval déréglée (bras gauche plus long, exagéré), une tare (sachet de sable de 440 g), une boîte de masses marquées, une mangue, un bocal d’eau.',
    prevision:{consigne:'Avant les pesées, choisis ce que donne la simple pesée de la mangue, posée à gauche, sur cette balance déréglée. Justifie ton hypothèse.',choix:[['trop','Une masse trop grande'],['pas_assez','Une masse trop petite'],['juste','La bonne masse'],['rien','Aucun équilibre n’est possible']]},
    protocole:['Faire une simple pesée de la mangue sur la balance déréglée.','Équilibre 1 : la mangue et des masses m₁ sur un plateau, la tare sur l’autre.','Équilibre 2 : retirer la mangue et rééquilibrer avec des masses seules m₂.','Calculer m = m₂ − m₁.','Recommencer avec un bocal d’eau : plein puis vidé.'],
    variable:'L’étape de pesée',maintenu:'La même tare, à la même place, sur la même balance',
    colonnes:['Étape','Masses posées','Résultat','Verdict'],lignesVides:6,
    lignes:st=>Q().lignesPesee(st,'mes09',e=>[lib(SIT(),e.sit),e.masses.join(' + ')+' g',e.somme+' g',e.juste?'Juste':'Somme à revoir']).concat(Q().lignesMesure(st,'mes09calc',e=>['Masse : '+lib(QUOI,e.quoi).toLowerCase(),e.saisies.m2+' − '+e.saisies.m1,e.saisies.m+' g',e.juste?'Juste':'À revoir'])).concat(Q().lignesTri(st,'mes09comp',COMP).map(r=>[r[0],r[1],'—',r[2]])),
    resume:e=>e.pesee?lib(SIT(),e.sit).toLowerCase()+' : '+e.somme+' g':e.mesure?'masse '+(e.quoi==='liquide'?'de l’eau':'de la mangue')+' : '+e.saisies.m+' g':'comparaison '+(e.juste?'juste':'à revoir'),
    confrontation:'1. Que donne la simple pesée sur la balance déréglée ? 2. Que valent m₁ et m₂ ? 3. Pourquoi m₂ − m₁ donne-t-il la vraie masse ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite m₁, m₂ et la masse calculée.',
    transfert:{q:'Double pesée : équilibre 1 avec l’objet et 40 g de masses ; équilibre 2 avec 215 g de masses seules, face à la même tare. Quelle est la masse de l’objet ?',type:'nombre',unite:'g',rep:175,tol:0,expl:'m = m₂ − m₁ = 215 − 40 = 175 g.'},
    critere:'Réaliser les deux équilibres, calculer m = m₂ − m₁ et expliquer pourquoi la double pesée reste juste.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Confond m₁ et m₂.'],['MF','Fait les deux équilibres sans expliquer la méthode.'],['MS','Calcule m = m₂ − m₁ juste.'],['TBM','Calcule, compare à la simple pesée et explique le rôle de la tare.']],
    peutConfronter:st=>{const p=new Set(Q().justes(st,'pesee','mes09').map(e=>e.sit));return p.has('simple_dereglee')&&p.has('eq1')&&p.has('eq2')&&Q().justes(st,'mesure','mes09calc').some(e=>e.quoi==='solide');},
    aides:['Équilibre 1 : la mangue et les masses m₁ sont du même côté, face à la tare.','Équilibre 2 : on retire la mangue et on rééquilibre avec des masses seules.','Les masses ajoutées remplacent la mangue : m = m₂ − m₁.'],
    synthese:'Double pesée : on équilibre une tare d’abord avec l’objet et des masses m₁, puis avec des masses seules m₂, posées à la même place. Les masses ajoutées remplacent exactement l’objet : m = m₂ − m₁. Ce résultat reste juste même si la balance est déréglée (bras inégaux), alors que la simple pesée donne alors une masse fausse. Pour un liquide, on fait de même avec le récipient plein puis vidé.',
    prof:{reference:'Simple pesée déréglée : 330 g au lieu de 300 g ; mangue m₁ = 100 g, m₂ = 400 g, m = 300 g ; bocal : m₁ = 50 g, m₂ = 250 g, m = 200 g (valeurs simulées) ; transfert 175 g.',attendus:['Deux équilibres face à la même tare.','m = m₂ − m₁.','Comparaison avec la simple pesée.'],erreurs:['Calculer m₁ − m₂ (masse négative).','Déplacer la tare entre les deux équilibres.','Accuser le vendeur de tricher, au lieu de dire que la balance est déréglée.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais la simple pesée, puis les deux équilibres de la mangue.']:['Commence par la simple pesée de la mangue.']
  };
})();
