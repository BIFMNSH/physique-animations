/* NohobaLab · 6e Côte d'Ivoire · MAT-18 · Associer un type de thermomètre à son usage.
   Six types à reconnaître ; six en approfondissement (lecture seule). Le pyromètre n’est pas illustré : aucune association visuelle n’est reprise de la source.
   Aucun thermomètre à mercure à manipuler. Dessins originaux. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const NOMS=()=>M().THERMOS.map(t=>[t.id,t.nom]);
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const ORDRE=['mural','medical','liquide','infrarouge','minmax','sonde'];
  const METHODE=['Choisir le thermomètre adapté.','Le placer : réservoir ou sonde dans le milieu, sans toucher le fond ni la paroi ; pour l’infrarouge, viser la surface.','Attendre que la valeur se stabilise.','Lire : liquide, œil à hauteur du sommet de la colonne ; numérique, valeur affichée.','Écrire la valeur avec l’unité et la précision (par exemple 23 °C, à 1 °C près).','Noter dans le tableau et recommencer si la valeur est douteuse.'];
  function manip(panel,X){
    const h=window.Activite.h,m=M();
    m.tri(panel,X,{id:'types',titre:'Je nomme chaque thermomètre',intro:'Pour chaque dessin, je choisis le type de thermomètre.',legende:'C’est',cats:NOMS(),
      items:ORDRE.map((id,i)=>{const t=m.THERMOS.filter(x=>x.id===id)[0];return {id:id,label:'Thermomètre n° '+(i+1),svg:m.dessin.thermoType(id,'Dessin du thermomètre n° '+(i+1)),juste:id,pourquoi:t.usage+' '+t.precaution,aide:'Regarde la forme : colonne de liquide, écran, pistolet, cadran, tube en U, tige très fine.'};})});
    m.tri(panel,X,{id:'usage',titre:'Je choisis le thermomètre adapté',intro:'Pour chaque situation de mesure, je choisis le type de thermomètre le plus adapté.',legende:'Je prends',cats:NOMS(),
      items:m.SITUATIONS_THERMO.map(s=>{const t=m.THERMOS.filter(x=>x.id===s.juste)[0];return {id:s.id,label:s.txt,juste:s.juste,pourquoi:t.nom+' : '+t.usage+' '+t.precaution,aide:'Pense à l’usage : contact ou non, extrêmes de la journée, corps, pièce, liquide.'};})});
    const c=h('div',{class:'card'},panel);h('h3',{text:'Fiche méthode · Lire une température'},c);
    h('ol',{},c,METHODE.map(s=>'<li>'+window.Activite.esc(s)+'</li>').join(''));
    h('button',{type:'button',class:'btn',text:'Imprimer la fiche méthode'},c).onclick=function(){
      m.imprimer('Lire une température','<ol>'+METHODE.map(s=>'<li>'+window.Activite.esc(s)+'</li>').join('')+'</ol><table class="sh-t"><thead><tr><th>Type</th><th>Usage</th><th>Précaution</th></tr></thead><tbody>'+m.THERMOS.map(t=>'<tr><td>'+window.Activite.esc(t.nom)+'</td><td>'+window.Activite.esc(t.usage)+'</td><td>'+window.Activite.esc(t.precaution)+'</td></tr>').join('')+'</tbody></table>');};
    const d=h('details',{class:'card'},panel);h('summary',{style:'font-weight:700;cursor:pointer'},d,'Pour aller plus loin (lecture seule, non évalué)');
    h('p',{},d,'D’autres instruments existent : '+m.APPROFONDISSEMENT_THERMO.join(', ')+'. Le pyromètre mesure à distance de très hautes températures. Ils ne sont pas à connaître en 6e.');
  }
  const itemSit=i=>(M().SITUATIONS_THERMO.filter(s=>s.id===i)[0]||{txt:i}).txt;
  window.FICHE_CI_MAT18={
    id:'NL-CI-6E-MAT-18',version:'0.9',modele:'types-thermometres-v1',
    titre:'Associer un type de thermomètre à son usage',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Associer un type de thermomètre à son usage.',
    objectifsPedagogiques:['Reconnaître six types de thermomètres','Choisir celui qui convient à une situation de mesure','Lire une température avec la méthode adaptée'],
    situationEvaluation:'Au centre de santé, à la cuisine, dans la cour et au laboratoire, on mesure des températures. Choisis un thermomètre pour chaque lieu et explique ton choix.',
    objectif:'Choisir le bon thermomètre selon la situation.',objectifEleve:'Savoir choisir et utiliser un thermomètre.',
    situation:'Pourquoi y a-t-il des thermomètres de formes si différentes (cuisine, météo, centre de santé, usine) ? Awa en observe six et cherche à quoi chacun sert.',
    materiel:'Six dessins originaux de thermomètres et six situations de mesure.',
    prevision:{consigne:'Avant le jeu, choisis le thermomètre le mieux adapté pour prendre la température d’un enfant malade. Justifie ton hypothèse.',choix:[['medical','Le thermomètre médical'],['mural','Le thermomètre mural'],['minmax','Le thermomètre à minimum et à maximum'],['infra','Le thermomètre infrarouge dirigé vers un mur']]},
    protocole:['Nommer chaque thermomètre.','Choisir le thermomètre pour chaque situation.','Lire les explications.','Suivre la fiche méthode pour lire une température.'],
    variable:'Le thermomètre choisi',maintenu:'La situation de mesure',
    colonnes:['Élément','Mon choix','Résultat'],lignesVides:6,
    lignes:st=>M().lignesTri(st,'types',i=>'Thermomètre « '+lib(NOMS(),i)+' »',c=>lib(NOMS(),c)).concat(M().lignesTri(st,'usage',itemSit,c=>lib(NOMS(),c))),
    resume:e=>(e.tri==='usage'?'usage : ':'nom : ')+lib(NOMS(),e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quels thermomètres as-tu reconnus ? 2. Quel critère te guide pour choisir (contact, extrêmes, corps, pièce) ? 3. Quelles précautions as-tu retenues ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une situation, le thermomètre choisi et la raison.',
    transfert:{q:'Un thermomètre infrarouge mesure-t-il la température à travers une vitre ?',rep:'non',expl:'Non : il mesure la surface visée ; une vitre fausse la mesure.'},
    critere:'Choisir le bon thermomètre dans les six situations et décrire la méthode de lecture.',
    essaisMin:12,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Reconnaît deux types.'],['MF','Reconnaît les types sans les relier aux usages.'],['MS','Relie types et usages et suit la méthode.'],['TBM','Relie, justifie et nomme les précautions.']],
    peutConfronter:st=>M().triEtat(st,'types',M().THERMOS.map(t=>t.id)).repondus>=6&&M().triEtat(st,'usage',M().SITUATIONS_THERMO.map(s=>s.id)).repondus>=6,
    aides:['Regarde la forme de l’appareil.','Certains thermomètres mesurent sans contact.','Le thermomètre médical sert pour le corps, de 35 °C à 42 °C.'],
    synthese:'Chaque thermomètre est adapté à un usage : liquide (laboratoire), numérique à sonde (cuisine, liquides), infrarouge (sans contact), mural ou à cadran (pièce), minimum et maximum (extrêmes de la journée), médical (corps).',
    prof:{reference:'Six types à reconnaître et leurs usages ; méthode de lecture en six étapes ; approfondissement non évalué.',attendus:['Nommer les six types.','Choisir le bon type dans six situations.','Appliquer la méthode.'],erreurs:['Utiliser l’infrarouge à travers une vitre.','Confondre numérique et à sonde.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis les explications des erreurs.']:['Nomme un premier thermomètre.']
  };
})();
