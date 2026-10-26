/* NohobaLab · 6e Côte d'Ivoire · MAT-13 · Décrire un thermomètre de laboratoire.
   Décision du 25 octobre 2026 : échelle −10 °C à 110 °C, une graduation = 1 °C ; lecture « à 1 °C près ». Liquide non nommé ; thermomètre fragile. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const PARTIES=[['tube','Le tube de verre'],['liquide','Le liquide (colonne)'],['grad','Les graduations'],['reservoir','Le réservoir']];
  const T=[[0,'0 °C'],[23,'23 °C'],[37,'37 °C'],[60,'60 °C'],[100,'100 °C']];
  const lib=(l,k)=>(l.filter(x=>String(x[0])===String(k))[0]||['',k])[1];
  const ITEMS=[['A','tube'],['B','liquide'],['C','grad'],['D','reservoir']];
  function manip(panel,X){
    M().tri(panel,X,{id:'parties',titre:'Je nomme les parties du thermomètre',intro:'Sur le schéma, les lettres A à D marquent quatre parties. Je choisis le nom de chacune.',legende:'C’est',cats:PARTIES,
      items:ITEMS.map(i=>({id:i[1],label:'Partie '+i[0],juste:i[1],pourquoi:{tube:'Le tube de verre contient le liquide.',liquide:'Le liquide monte quand la température augmente.',grad:'Les graduations (traits) permettent la lecture : ici un trait vaut 1 °C.',reservoir:'Le réservoir est la partie qui plonge dans le milieu à mesurer.'}[i[1]],aide:'Le réservoir est en bas, la colonne monte dans le tube.'}))});
    M().bloc(panel,X,{n:13,titre:'Atelier · je lis un thermomètre de laboratoire',
      intro:'Je choisis une température illustrée (valeur simulée). Le thermomètre de gauche donne l’ensemble, celui de droite est un zoom : un trait = 1 °C. Je lis à hauteur du sommet de la colonne.',
      controles:[{cle:'t',legende:'Température illustrée',items:T}],
      saisie:'J’observe que le liquide est monté jusqu’au trait… donc je lis…',legendeTable:'Mes essais : température lue (simulée).',F:()=>window.FICHE_CI_MAT13,
      render:v=>{const t=Number(v.t),r=M().lectureLab(t),sc=M().scene.thermoLab({T:t});return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (valeur simulée)',essai:{T:r.valeur}};}});
  }
  window.FICHE_CI_MAT13={
    id:'NL-CI-6E-MAT-13',version:'0.9',modele:'thermometre-lecture-v1',
    titre:'Décrire un thermomètre de laboratoire',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Décrire les parties d’un thermomètre et sa graduation.',
    objectifsPedagogiques:['Nommer le réservoir, le tube, le liquide et les graduations','Dire que le thermomètre de laboratoire va de −10 °C à 110 °C','Lire un trait de graduation et écrire la valeur avec son unité'],
    situationEvaluation:'Kofi lit le thermomètre en regardant d’en haut et trouve 25 °C. Awa lit, l’œil à hauteur de la colonne, et trouve 23 °C. Qui lit bien ? Explique comment lire et comment écrire le résultat.',
    objectif:'Décrire et lire un thermomètre de laboratoire.',objectifEleve:'Savoir décrire et lire un thermomètre.',
    situation:'Comment un thermomètre « sait »-il quelle est la température ? Awa observe un thermomètre de laboratoire et cherche à comprendre ses parties et ses traits.',
    materiel:'Simulation : un thermomètre de laboratoire (−10 °C à 110 °C), un zoom sur les graduations.',
    prevision:{consigne:'Avant les essais, choisis ce que fait le liquide quand la température augmente. Justifie ton hypothèse.',choix:[['monte','Il monte dans le tube'],['descend','Il descend dans le tube'],['reste','Il reste en place'],['sort','Il sort du tube']]},
    protocole:['Nommer les quatre parties.','Choisir une température illustrée.','Repérer le trait atteint par le sommet de la colonne.','Écrire la valeur avec l’unité, à 1 °C près.'],
    variable:'La température illustrée',maintenu:'Le même thermomètre',
    colonnes:['Température lue','Précision de lecture','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[e.T+' °C','à 1 °C près (valeur simulée)',e.observation||'—']).concat(M().lignesTri(st,'parties',i=>'Partie « '+lib(PARTIES,i)+' »',c=>lib(PARTIES,c)).map(r=>[r[0],r[1],r[2]])),
    resume:e=>e.tri?'partie : '+lib(PARTIES,e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):'lecture : '+e.T+' °C',
    confrontation:'1. Que fait le liquide quand la température augmente ? 2. Comment lis-tu un trait ? 3. Comment écris-tu le résultat ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une valeur lue, avec son unité et sa précision.',
    transfert:{q:'Sur le zoom, le sommet de la colonne est exactement sur le trait 23. Comment écris-tu la température ?',rep:'23',type:'choix',options:[['23','23 °C, à 1 °C près'],['2,3','2,3 °C'],['23c','23 sans unité']],expl:'On écrit 23 °C, à 1 °C près : toujours l’unité et la précision.'},
    critere:'Nommer les parties et lire une température avec unité et précision.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Nomme moins de deux parties.'],['MF','Nomme les parties mais lit sans unité.'],['MS','Nomme les parties et lit avec unité et précision.'],['TBM','Décrit, lit, et explique la lecture à hauteur d’œil.']],
    peutConfronter:st=>{const v=M().valides(st),e=M().triEtat(st,'parties',PARTIES.map(p=>p[0]));return e.repondus>=4&&v.length>=3&&M().distincts(v,'T')>=3;},
    aides:['Le réservoir est la partie qui plonge dans le milieu.','Sur le zoom, compte les traits à partir du repère le plus proche.','On écrit la valeur, l’unité °C et la précision.'],
    synthese:'Un thermomètre de laboratoire comprend un réservoir, un tube, un liquide et des graduations. Il va de −10 °C à 110 °C (un trait = 1 °C). Le liquide monte quand la température augmente ; on lit au niveau du sommet de la colonne, l’œil à sa hauteur, et on écrit par exemple 23 °C, à 1 °C près.',
    prof:{reference:'Parties : réservoir, tube, liquide, graduations ; échelle −10 à 110 °C, 1 °C par trait ; lecture à hauteur d’œil.',attendus:['Nommer les quatre parties.','Lire correctement trois valeurs.','Écrire unité et précision.'],erreurs:['Lire en regardant d’en haut.','Oublier l’unité.','Utiliser le thermomètre pour remuer (fragile).']},
    diagnostic:st=>st.essais.length?['Indicatif : lis au moins trois températures différentes.']:['Nomme une première partie.']
  };
})();
