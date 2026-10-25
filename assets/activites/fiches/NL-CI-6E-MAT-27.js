/* NohobaLab · 6e Côte d'Ivoire · MAT-27 · Matériaux : l'aimant (parcours « Matériaux, tri et déchets »).
   « La plupart des aciers » sont attirés par un aimant ; cuivre et aluminium ne le sont pas, même s'ils conduisent le courant. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const MAT=()=>Object.keys(M().MATERIAUX).map(k=>[k,M().MATERIAUX[k].nom]);
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    M().bloc(panel,X,{n:27,titre:'Atelier · l’aimant et les matériaux',
      intro:'J’approche un aimant d’un objet fait d’un seul matériau. Je choisis l’objet et j’observe s’il est attiré. Simulation.',
      controles:[{cle:'m',legende:'L’objet testé',items:MAT()}],
      saisie:'J’observe que l’aimant…',legendeTable:'Mes essais : objet et action de l’aimant.',F:()=>window.FICHE_CI_MAT27,
      render:v=>{const r=M().aimant(v.m),sc=M().scene.aimant({mat:v.m});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{mat:v.m,attire:r.attire}};}});
  }
  window.FICHE_CI_MAT27={
    id:'NL-CI-6E-MAT-27',version:'0.9',modele:'aimant-materiaux-v1',
    titre:'Tester l’action d’un aimant sur des matériaux',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Matériaux, tri et déchets',
    competenceVisee:'Tester l’action d’un aimant sur des matériaux pour les distinguer.',
    objectifsPedagogiques:['Dire quels matériaux sont attirés par un aimant','Dire que le cuivre et l’aluminium ne sont pas attirés','Utiliser l’aimant pour trier des objets'],
    situationEvaluation:'Au marché, Kofi veut séparer des clous en acier d’un tas de pièces en aluminium et en plastique. Quel outil simple utilise-t-il ? Explique ce qui se passe.',
    objectif:'Reconnaître les matériaux attirés par un aimant.',objectifEleve:'Savoir quels matériaux sont attirés par un aimant.',
    situation:'Peut-on reconnaître le matériau d’un objet sans le casser ? Awa approche un aimant de six objets du quotidien.',
    materiel:'Simulation : un aimant et six objets (acier, cuivre, aluminium, plastique, bois, verre).',
    prevision:{consigne:'Avant les essais, choisis le matériau qui sera attiré par l’aimant. Justifie ton hypothèse.',choix:[['acier','Le clou en acier'],['cuivre','Le fil de cuivre'],['alu','La feuille d’aluminium'],['tous','Tous les matériaux']]},
    protocole:['Choisir un objet.','Approcher l’aimant.','Noter si l’objet est attiré.','Tester les six objets.'],
    variable:'L’objet testé',maintenu:'Le même aimant',
    colonnes:['Objet','L’aimant l’attire ?','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[lib(MAT(),e.mat),e.attire?'Oui':'Non',e.observation||'—']),
    resume:e=>lib(MAT(),e.mat).toLowerCase()+' : '+(e.attire?'attiré':'pas attiré'),
    confrontation:'1. Quels objets sont attirés ? 2. Lesquels ne le sont pas ? 3. Le cuivre et l’aluminium sont-ils attirés, même s’ils conduisent le courant ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un objet attiré et un objet non attiré.',
    transfert:{q:'Un objet en aluminium est-il attiré par un aimant ?',rep:'non',expl:'Non : l’aluminium n’est pas attiré. C’est ce qui permet de le séparer de l’acier.'},
    critere:'Classer les matériaux attirés ou non, avec deux essais cités.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Teste sans conclure.'],['MF','Conclut sans exemples.'],['MS','Conclut avec deux exemples.'],['TBM','Conclut et utilise l’aimant pour trier.']],
    peutConfronter:st=>{const v=M().valides(st);return v.length>=4&&v.some(e=>e.attire)&&v.some(e=>!e.attire)&&M().distincts(v,'mat')>=4;},
    aides:['Teste au moins quatre objets différents.','Compare un métal attiré et un métal non attiré.','Conducteur d’électricité ne veut pas dire attiré.'],
    synthese:'La plupart des aciers sont attirés par un aimant. Le cuivre, l’aluminium, le plastique, le bois et le verre ne le sont pas. L’aimant permet donc de séparer l’acier des autres matériaux.',
    prof:{reference:'Acier attiré (la plupart des aciers) ; cuivre, aluminium, plastique, bois, verre non attirés.',attendus:['Tester quatre objets.','Conclure.','Citer l’acier.'],erreurs:['Dire que tous les métaux sont attirés.','Confondre conducteur et magnétique.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste un objet attiré et un objet non attiré.']:['Fais un premier essai.']
  };
})();
