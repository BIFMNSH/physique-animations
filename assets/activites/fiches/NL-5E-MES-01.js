/* NohobaLab · 5e · MES-01 · Mettre en évidence la pression atmosphérique.
   Modèle qualitatif : l'air extérieur pousse dans toutes les directions ; s'il y a moins d'air dedans que dehors, l'effet est visible. */
(function(){
  'use strict';
  const M=()=>window.NohobaMes5e,E=()=>window.NohobaElec5e;
  function manip(panel,X){
    const N=M();
    E().atelier(panel,X,{titre:'Atelier · trois expériences avec l’air',idObs:'e-obs',placeholder:'J’observe que…',
      intro:'Je choisis une expérience et sa variante, puis j’observe ce qui se passe et je regarde le schéma : qui pousse le plus, l’air dehors ou l’air dedans ?',
      fiche:()=>window.FICHE_5E_MES01,
      groupes:[{legende:'Expérience',nom:'e-x',items:N.EXPS,def:'verre-lisse'}],
      rendre:v=>{const e=N.exp(v['e-x']);return {montage:N.montageExp(e.id),schema:N.schemaExp(e.id),lecture:e.nom+' : '+e.txt+'.',essai:{x:e.id,type:e.type,effet:e.effet,txt:e.txt}};}});
  }
  window.FICHE_5E_MES01={
    id:'NL-5E-MES-01',version:'0.9',modele:'pression-effets-v1',
    titre:'Montrer que l’air exerce une pression',niveau:'5e',
    theme:'Mesure de grandeurs physiques',chapitre:'La pression atmosphérique',
    competenceVisee:'Mettre en évidence l’existence de la pression atmosphérique.',
    objectifsPedagogiques:['Observer les effets de la pression de l’air','Relier un effet à la différence entre l’air dehors et l’air dedans','Expliquer pourquoi l’eau reste dans un verre retourné'],
    situationEvaluation:'Kofi colle une ventouse sur le mur de sa chambre. Pourquoi tient-elle, et pourquoi tomberait-elle si elle était percée ? Justifie avec tes observations.',
    objectif:'Montrer que l’air exerce une pression sur tous les objets.',
    objectifEleve:'Savoir montrer que l’air exerce une pression.',
    situation:'Kofi remplit un verre d’eau, pose une carte dessus et le retourne : l’eau ne tombe pas. Il se demande pourquoi, et si l’air y est pour quelque chose.',
    materiel:'Verre, carte, bouteille en plastique, pompe, ventouse, simulation.',
    prevision:{consigne:'Avant les expériences, choisis ce qui retient l’eau dans le verre retourné. Justifie ton hypothèse avec « car ».',choix:[
      ['air','L’air pousse la carte vers le haut'],['colle','L’eau colle à la carte'],['poids','L’eau ne pèse plus quand on retourne le verre'],['carte','La carte est collée au verre par l’eau seulement']]},
    protocole:['Retourner le verre avec une carte lisse, puis avec une carte percée.','Retirer beaucoup d’air de la bouteille et comparer avec la bouteille sans pompage.','Appliquer la ventouse au mur, puis une ventouse percée.','Écrire ce que tu observes à chaque essai.'],
    variable:'La présence de l’air (carte percée, air retiré, ventouse percée)',maintenu:'Le même objet dans chaque expérience',
    colonnes:['Expérience','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[M().exp(e.x).nom,e.txt,e.observation||'—']),
    resume:e=>M().exp(e.x).nom.toLowerCase()+' : '+e.txt,
    confrontation:'1. Dans quelles expériences voit-on un effet ? 2. Que change-t-on quand l’effet disparaît (carte percée, bouteille sans pompage, ventouse percée) ? 3. Qui pousse le plus, l’air dehors ou l’air dedans ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une expérience avec effet et la même expérience sans effet, en disant ce qui change.',
    transfert:{q:'Pourquoi une ventouse colle-t-elle au mur ?',rep:'air',options:[['air','L’air extérieur la pousse contre le mur'],['colle','Elle est enduite de colle'],['aimant','Le mur est un aimant'],['poids','Elle est trop lourde pour tomber']],expl:'En appuyant, on chasse l’air sous la ventouse : l’air extérieur la pousse contre le mur.'},
    critere:'Observer trois effets de l’air et expliquer qu’il pousse sur les objets.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit les expériences sans parler de l’air.'],['MF','Dit que l’air intervient sans l’expliquer.'],['MS','Explique que l’air extérieur pousse sur les objets.'],['TBM','Explique avec l’air dehors et dedans et compare un essai avec effet et sans effet.']],
    peutConfronter:st=>{const v=E().valides(st);return ['verre','bout','vent'].every(t=>v.some(e=>e.type===t))&&v.some(e=>e.effet)&&v.some(e=>!e.effet);},
    aides:['Que pousse la carte vers le haut dans le verre retourné ?','Regarde le schéma : y a-t-il autant d’air dehors que dedans ?','As-tu essayé une variante sans effet pour chaque expérience ?'],
    synthese:'L’air qui nous entoure exerce sur tous les objets une pression, dans toutes les directions : c’est la pression atmosphérique. Le verre d’eau retourné reste plein grâce à la carte que l’air pousse vers le haut ; une bouteille dont on retire l’air est écrasée par l’air extérieur ; la ventouse colle au mur parce que l’air la pousse contre lui.',
    prof:{reference:'Verre retourné, carte lisse : l’eau reste. Carte percée : l’eau tombe. Bouteille sans pompage : intacte ; beaucoup d’air retiré : écrasée. Ventouse bien appliquée : colle ; ventouse percée : ne colle pas.',attendus:['Hypothèse notée avant les essais.','Une variante avec effet et une sans effet pour chaque expérience.','Phrase : l’air exerce une pression dans toutes les directions.'],erreurs:['Croire que l’eau colle à la carte.','Penser que l’air ne pousse que vers le bas.','Croire que la ventouse « aspire » le mur.']},
    diagnostic:st=>E().valides(st).some(e=>!e.effet)?['Tu as une variante sans effet : qu’est-ce qui a changé ?']:['Essaie la variante percée ou sans pompage.']
  };
})();
