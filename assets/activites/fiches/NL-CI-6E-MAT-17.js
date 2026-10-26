/* NohobaLab · 6e Côte d'Ivoire · MAT-17 · Repérer la température du corps humain.
   Relevés fictifs ; aucun diagnostic, aucun seuil de fièvre. En réel : thermomètres individuels ou désinfectés, élèves volontaires. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const SEC=[['oui','Thermomètre secoué avant'],['non','Thermomètre non secoué']];
  const DUR=[['courte','J’attends 30 secondes'],['longue','J’attends 2 à 3 minutes']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const fr=n=>String(n).replace('.',',');
  function manip(panel,X){
    M().bloc(panel,X,{n:17,titre:'Atelier · trois relevés fictifs',
      intro:'Je choisis un personnage, si le thermomètre est secoué et la durée d’attente. Relevés fictifs : on ne pose aucun diagnostic.',
      controles:[{cle:'p',legende:'Le personnage',items:M().PERSONNES},{cle:'s',legende:'Le thermomètre',items:SEC},{cle:'d',legende:'L’attente',items:DUR}],
      saisie:'J’observe que la colonne… et je lis…',legendeTable:'Mes relevés (fictifs).',F:()=>window.FICHE_CI_MAT17,
      render:v=>{const nom=lib(M().PERSONNES,v.p),r=M().corps(v.p,v.s==='oui',v.d==='courte'?'courte':'longue'),sc=M().scene.corps({pers:v.p,secoue:v.s==='oui',duree:v.d==='courte'?'courte':'longue',nom:nom});
        return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{pers:v.p,secoue:v.s==='oui',duree:v.d,valeur:r.valeur,fiable:r.fiable}};}});
  }
  window.FICHE_CI_MAT17={
    id:'NL-CI-6E-MAT-17',version:'0.9',modele:'temperature-corps-v1',
    titre:'Repérer la température du corps humain',niveau:'6e',theme:'Propriétés physiques de la matière',chapitre:'Température d’un corps',
    competenceVisee:'Utiliser le thermomètre médical pour repérer la température du corps.',
    objectifsPedagogiques:['Dire que la température normale du corps est voisine de 37 °C','Décrire la procédure : secouer, placer sous l’aisselle, attendre 2 à 3 minutes, lire','Écrire la valeur avec l’unité'],
    situationEvaluation:'Kofi lit 36,1 °C après 30 secondes seulement. Sa lecture est-elle fiable ? Décris la procédure complète.',
    objectif:'Repérer la température du corps avec la bonne procédure.',objectifEleve:'Savoir prendre une température avec un thermomètre médical.',
    situation:'La température de chacun est-elle exactement la même ? Trois personnages fictifs, Awa, Kofi et Mariam, prennent leur température.',
    materiel:'Simulation : thermomètre médical, trois personnages fictifs.',
    prevision:{consigne:'Avant les essais, choisis l’ordre de grandeur de la température du corps d’une personne en bonne santé. Justifie ton hypothèse.',choix:[['37','Voisine de 37 °C'],['20','Voisine de 20 °C'],['60','Voisine de 60 °C'],['100','Voisine de 100 °C']]},
    protocole:['Secouer le thermomètre.','Le placer sous l’aisselle.','Attendre 2 à 3 minutes.','Lire et écrire la valeur avec l’unité.'],
    variable:'La durée d’attente ou le secouage (un seul à la fois)',maintenu:'Le thermomètre et le personnage',
    colonnes:['Personnage','Secoué ?','Attente','Valeur (fictive)','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[lib(M().PERSONNES,e.pers),e.secoue?'Oui':'Non',lib(DUR,e.duree),fr(e.valeur)+' °C'+(e.fiable?'':' (à refaire)'),e.observation||'—']),
    resume:e=>lib(M().PERSONNES,e.pers)+' : '+fr(e.valeur)+' °C'+(e.fiable?' (lecture fiable)':' (à refaire)'),
    confrontation:'1. Quelles lectures sont fiables ? 2. Autour de quelle valeur sont-elles ? 3. Pourquoi refaire certaines lectures ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux relevés fiables avec leur valeur.',
    transfert:{q:'La température normale du corps est-elle voisine de 37 °C ?',rep:'oui',expl:'Oui : elle est voisine de 37 °C. Les petites différences entre personnes sont normales ; on ne pose pas de diagnostic ici.'},
    critere:'Énoncer environ 37 °C et la procédure en quatre étapes.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit sans secouer ni attendre.'],['MF','Applique une partie de la procédure.'],['MS','Applique la procédure et donne environ 37 °C.'],['TBM','Applique, justifie et refait une lecture non fiable.']],
    peutConfronter:st=>{const v=M().valides(st);return v.filter(e=>e.fiable).length>=2&&v.some(e=>!e.fiable);},
    aides:['Secoue d’abord, puis attends 2 à 3 minutes.','Une lecture trop tôt est à refaire.','Compare les valeurs fiables : elles sont voisines de 37 °C.'],
    synthese:'La température normale du corps est voisine de 37 °C. On secoue le thermomètre, on le place sous l’aisselle, on attend 2 à 3 minutes, puis on lit et on écrit la valeur avec l’unité.',
    prof:{reference:'Environ 37 °C ; secouer, placer, attendre 2 à 3 min, lire. Relevés fictifs, pas de diagnostic.',attendus:['Obtenir au moins deux lectures fiables.','Identifier les lectures à refaire.','Écrire la procédure.'],erreurs:['Poser un diagnostic.','Lire avant la stabilisation.']},
    diagnostic:st=>st.essais.length?['Indicatif : fais au moins deux lectures fiables et une lecture à refaire.']:['Fais un premier essai.']
  };
})();
