/* NohobaLab · 5e · MAT-01 · Atomes et molécules.
   Modèle : molécules en boules aux couleurs CPK (NohobaMatiere5e.mol). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · lire une formule',idObs:'e-obs',placeholder:'J’observe que la formule…',
      intro:'Je choisis une molécule, je regarde son modèle en boules et je compte les atomes de chaque sorte.',
      fiche:()=>window.FICHE_5E_MAT01,
      groupes:[{legende:'Molécule',nom:'e-m',items:N.MOL.filter(m=>['h2','o2','h2o','co2','ch4','nh3'].includes(m[0])).map(m=>[m[0],m[1]]),def:'h2o'}],
      rendre:v=>{const m=N.mol(v['e-m']);return {montage:N.montageMol(m.id),schema:N.schemaMol(m.id,'total'),lecture:m.nom+' ('+m.f+') : '+m.total+' atome'+(m.total>1?'s':''),essai:{m:m.id,total:m.total,types:m.types}};}});
  }
  window.FICHE_5E_MAT01={
    id:'NL-5E-MAT-01',version:'0.9',modele:'molecules-formules-v1',
    titre:'Que disent les lettres et les chiffres d’une formule ?',niveau:'5e',
    theme:'Mélanges et réactions chimiques',chapitre:'Atomes et molécules',
    competenceVisee:'Relier la formule d’une molécule au nombre et à la nature de ses atomes.',
    objectifsPedagogiques:['Associer une lettre à un type d’atome','Lire l’indice comme un nombre d’atomes','Compter les atomes d’une molécule à partir de sa formule'],
    situationEvaluation:'Kofi lit « CH₄ » sur une bouteille de gaz de cuisine. Combien d’atomes contient une molécule de ce gaz ? Justifie avec la formule.',
    objectif:'Lire une formule chimique.',
    objectifEleve:'Savoir lire une formule et compter les atomes.',
    situation:'Sur l’affiche du laboratoire, Kofi voit « H₂O » et « CO₂ ». Awa se demande ce que signifient les lettres et les petits chiffres.',
    materiel:'Modèles moléculaires en boules (couleurs CPK : hydrogène blanc, carbone noir, oxygène rouge, azote bleu), simulation.',
    prevision:{consigne:'Avant d’observer, choisis ce que signifie une formule. Justifie ton hypothèse avec « car ».',choix:[
      ['indice','Les lettres sont les atomes et le petit chiffre dit combien il y en a'],['un','Une formule ne contient qu’un seul atome'],['nom','Chaque lettre est le nom complet de la molécule'],['ordre','L’ordre et les chiffres n’ont aucun sens']]},
    protocole:['Choisir une molécule et regarder son modèle en boules.','Compter les atomes de chaque couleur.','Comparer avec les lettres et les indices de la formule.','Observer au moins quatre molécules différentes.'],
    variable:'La molécule observée',maintenu:'Les couleurs CPK et la façon de compter',
    colonnes:['Molécule','Formule','Atomes en tout','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[M().mol(e.m).nom,M().mol(e.m).f,String(e.total),e.observation||'—']),
    resume:e=>M().mol(e.m).nom+' ('+M().mol(e.m).f+') : '+e.total+' atome'+(e.total>1?'s':''),
    confrontation:'1. Pour chaque molécule, compare les boules de chaque couleur à la formule. 2. Que signifie le petit chiffre ? 3. Que signifie une lettre sans chiffre ? Compare à ton hypothèse.',
    retroaction:'Cite une molécule, sa formule et le nombre d’atomes de chaque sorte.',
    transfert:{q:'Une molécule de méthane a pour formule CH₄. Elle contient :',rep:'cinq',options:[['un','un seul atome'],['quatre','quatre atomes d’hydrogène seulement'],['cinq','un atome de carbone et quatre atomes d’hydrogène'],['deux','deux atomes de carbone']],expl:'C : un atome de carbone ; H₄ : quatre atomes d’hydrogène. Cela fait cinq atomes en tout.'},
    critere:'Observer au moins quatre molécules et relier chaque formule au nombre et à la nature de ses atomes.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie pas la formule au modèle.'],['MF','Reconnaît les lettres sans lire les indices.'],['MS','Lit les lettres et les indices pour compter les atomes.'],['TBM','Compte les atomes, nomme chaque sorte d’atome et justifie avec la formule.']],
    peutConfronter:st=>{const v=E().valides(st),m=new Set(v.map(e=>e.m));return v.length>=4&&m.size>=4&&v.some(e=>e.total>3);},
    aides:['Compte les boules de chaque couleur.','Une lettre sans chiffre veut dire un seul atome.','As-tu observé au moins quatre molécules, dont une avec plus de trois atomes ?'],
    synthese:'La matière est formée d’atomes, représentés par des symboles (H, C, O, N…). Une molécule est un groupe d’atomes liés. Sa formule indique les atomes : la lettre donne le type d’atome et le petit chiffre en indice donne leur nombre. H₂O : deux atomes d’hydrogène et un atome d’oxygène.',
    prof:{reference:'H₂ : 2 atomes. O₂ : 2. H₂O : 3 (H, H, O). CO₂ : 3 (C, O, O). CH₄ : 5 (C, H×4). NH₃ : 4 (N, H×3). Couleurs CPK : H blanc, C noir, O rouge, N bleu.',attendus:['Hypothèse notée avant les observations.','Au moins quatre molécules avec formule et nombre d’atomes.','Phrase : lettre = type d’atome, indice = nombre.'],erreurs:['Oublier qu’une lettre seule vaut un atome.','Confondre atome et molécule.','Lire H₂O comme « H puis 2 puis O » sans le sens d’indice.']},
    diagnostic:st=>E().valides(st).some(e=>e.total>3)?['Compare chaque indice au nombre de boules de la même couleur.']:['Observe une molécule avec plus de trois atomes.']
  };
})();
