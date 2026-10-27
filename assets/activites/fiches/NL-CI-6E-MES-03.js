/* NohobaLab · 6e Côte d'Ivoire · MES-03 · Mesurer le volume d'un solide à l'aide d'un récipient gradué.
   Déplacement d'eau, V = V₂ − V₁, éprouvette de 100 mL (1 mL par division) ; valeurs entières simulées. Cas ratés : sucre (soluble), bouchon (flotte), eau insuffisante.
   « Pour aller plus loin » (décision du 27 octobre 2026) : lest, vase à trop-plein, solide soluble, volume d'un gaz ; facultatif, hors programme et hors TP. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const SOL=()=>Q().SOLIDES.map(s=>[s.id,s.court]);
  const CAS=[{id:'sucre',label:'Le morceau de sucre',juste:'insoluble',pourquoi:'Le sucre se dissout : il disparaît dans l’eau et le niveau ne monte presque pas. Le solide doit être insoluble.'},
    {id:'bouchon',label:'Le bouchon de liège',juste:'coule',pourquoi:'Le bouchon flotte : il ne s’enfonce pas entièrement. Le solide doit couler.'},
    {id:'caillou_long',label:'Le long caillou dans très peu d’eau',juste:'immerge',pourquoi:'Le haut du caillou dépasse de l’eau : seule une partie est comptée. Le solide doit être entièrement immergé.'}];
  function manip(panel,X){
    Q().mesure(panel,X,{id:'mes03dep',titre:'Atelier · je plonge un solide dans l’eau de l’éprouvette',
      intro:'Je lis V₁ avant de plonger le solide, puis V₂ quand il est au fond, l’œil au bas du ménisque. J’incline l’éprouvette et je fais glisser le solide le long de la paroi. Valeurs simulées.',
      controles:[{cle:'solide',legende:'Le solide',items:SOL()}],
      champs:[{cle:'V1',label:'V₁ (avant)',unite:'mL'},{cle:'V2',label:'V₂ (après)',unite:'mL'},{cle:'V',label:'V = V₂ − V₁',unite:'mL'}],
      F:()=>window.FICHE_CI_MES03,legendeTable:'Mes mesures : V₁, V₂ et V (valeurs simulées).',
      render:v=>{const sc=Q().scene.deplacement(v),d=Q().deplacement(v.solide);return {montage:sc.montage,schema:sc.schema,txt:d.valable?'Lis V₁ et V₂, puis calcule.':'Regarde bien ce qui se passe dans l’éprouvette.'};},
      verifier:(v,s)=>{const r=Q().verifierDeplacement(v.solide,s.V1,s.V2,s.V);return {juste:r.juste,retour:r.retour,essai:{solide:v.solide,valable:r.valable,V:r.attendu.V}};},
      attendu:v=>{const d=Q().deplacement(v.solide);return {V1:d.V1,V2:d.V2,V:d.V};},
      aide:v=>'V₁ se lit avant de plonger le solide ; V₂ une fois le solide au fond. Le volume du solide est la différence.'});
    M().tri(panel,X,{id:'mes03cond',titre:'Je diagnostique les mesures ratées',intro:'Pour chaque cas, je choisis la condition de la méthode qui n’est pas respectée.',legende:'La condition non respectée',cats:Q().CONDITIONS,
      items:CAS.map(c=>({id:c.id,label:c.label,juste:c.juste,pourquoi:c.pourquoi,aide:'Repense à ce que tu as vu dans l’éprouvette pour ce solide.'}))});
    const pl=Activite.h('div',{class:'card',role:'note'},panel,'<h3 style="margin-top:0">Pour aller plus loin (facultatif)</h3><p>Ces prolongements ne sont ni dans le programme ni dans le TP. Ils ne changent pas la compétence de la fiche ni son évaluation.</p>');
    M().bloc(pl,X,{n:213,titre:'Et si le solide flotte, est trop grand ou se dissout ? Et un gaz ?',
      intro:'Méthode du lest pour le bouchon ; vase à trop-plein pour un solide trop grand ; huile pour le sucre ; air expiré recueilli sur l’eau (simulation seulement).',
      controles:[{cle:'exp',legende:'Le prolongement',items:Q().PLUS_LOIN}],
      saisie:'J’observe que…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES03,
      render:v=>{const r=Q().plusLoin(v.exp),sc=Q().scene.plusLoin(v);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{plusLoin:v.exp,V:r.V}};}});
  }
  function ligne(e){
    if(e.mesure)return [lib(SOL(),e.solide),e.saisies.V1+' / '+e.saisies.V2+' / '+e.saisies.V+' mL',e.juste?(e.valable?'Juste':'Calcul juste, mesure non valable'):'À revoir'];
    if(e.plusLoin)return ['Plus loin · '+lib(Q().PLUS_LOIN,e.plusLoin),e.V?e.V+' cm³':'—',e.observation||'—'];
    return null;
  }
  window.FICHE_CI_MES03={
    id:'NL-CI-6E-MES-03',version:'0.9',modele:'deplacement-eau-v1',
    titre:'Mesurer le volume d’un solide à l’aide d’un récipient gradué',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Volume d’un liquide et d’un solide',
    competenceVisee:'Mesurer le volume d’un solide insoluble par déplacement d’eau.',
    objectifsPedagogiques:['Lire V₁, immerger le solide, lire V₂','Calculer V = V₂ − V₁ et l’écrire en mL et en cm³','Donner les conditions de la méthode : solide insoluble, qui coule, entièrement immergé, introduit sans éclaboussure'],
    situationEvaluation:'Aya veut connaître le volume d’une bague en argent. Elle verse 30 mL d’eau dans une éprouvette, y fait glisser la bague et lit 32 mL. Quel est le volume de la bague ? Aurait-elle pu utiliser la même méthode pour un morceau de savon ? Justifie.',
    objectif:'Mesurer le volume d’un solide de forme quelconque.',objectifEleve:'Savoir mesurer le volume d’un caillou avec une éprouvette.',
    situation:'En TP, la classe doit trouver le volume d’un caillou et d’un morceau de pâte à modeler, dont la forme n’est pas régulière : on ne peut pas mesurer leurs côtés avec une règle. Comment faire ?',
    materiel:'Simulation : une éprouvette de 100 mL, de l’eau, un caillou, de la pâte à modeler, une clé, un morceau de sucre, un bouchon de liège.',
    prevision:{consigne:'Avant les essais, choisis ce que devient le niveau de l’eau quand on plonge le caillou au fond de l’éprouvette. Justifie ton hypothèse.',choix:[['monte','Le niveau monte'],['baisse','Le niveau baisse'],['reste','Le niveau ne change pas'],['deborde','L’eau déborde toujours']]},
    protocole:['Verser de l’eau dans l’éprouvette et lire V₁.','Incliner l’éprouvette et faire glisser le solide le long de la paroi.','Lire V₂ quand le solide est au fond et l’eau immobile.','Calculer V = V₂ − V₁.','Changer la forme de la pâte et recommencer.','Diagnostiquer les cas ratés.'],
    variable:'Le solide plongé',maintenu:'La même éprouvette et le même volume d’eau V₁',
    colonnes:['Solide','V₁ / V₂ / V','Résultat'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(ligne).filter(Boolean).concat(M().lignesTri(st,'mes03cond',i=>(CAS.filter(c=>c.id===i)[0]||{label:i}).label,c=>lib(Q().CONDITIONS,c))),
    resume:e=>e.tri?'diagnostic '+(e.juste?'juste':'à revoir'):e.mesure?lib(SOL(),e.solide).toLowerCase()+' : '+e.V+' mL'+(e.valable?'':' (non valable)'):'pour aller plus loin',
    confrontation:'1. Comment varie le niveau quand on plonge le solide ? 2. Le volume de la pâte change-t-il avec sa forme ? 3. Pourquoi les mesures du sucre, du bouchon et du long caillou sont-elles fausses ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite V₁, V₂ et le volume calculé pour un solide.',
    transfert:{q:'Dans une éprouvette, V₁ = 40 mL. Après avoir plongé une bille de verre, V₂ = 47 mL. Quel est le volume de la bille ?',type:'nombre',unite:'cm³',rep:7,tol:0,expl:'V = V₂ − V₁ = 47 − 40 = 7 mL, soit 7 cm³.'},
    critere:'Mesurer le volume de deux solides, constater que la forme de la pâte ne change pas son volume et nommer les conditions de la méthode.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit V₂ comme le volume du solide.'],['MF','Calcule V₂ − V₁ sans donner les conditions.'],['MS','Mesure juste et donne deux conditions.'],['TBM','Mesure juste, donne les conditions et explique chaque cas raté.']],
    peutConfronter:st=>{const j=Q().justes(st,'mesure','mes03dep'),s=new Set(j.map(e=>e.solide));return s.has('pate_boule')&&s.has('pate_galette')&&(s.has('caillou')||s.has('cle'))&&j.some(e=>!e.valable)&&M().triEtat(st,'mes03cond',CAS.map(c=>c.id)).repondus>=3;},
    aides:['Lis V₁ avant de plonger le solide.','Le volume du solide est la montée du niveau : V₂ − V₁.','Le sucre se dissout, le bouchon flotte, le long caillou dépasse : quelle condition manque à chaque fois ?'],
    synthese:'Pour mesurer le volume d’un solide qui ne se dissout pas et qui coule, on lit le volume d’eau V₁ dans une éprouvette, on fait glisser le solide le long de la paroi, on lit V₂ quand il est entièrement immergé, et on calcule V = V₂ − V₁ (1 mL = 1 cm³). La forme d’un solide ne change pas son volume.',
    prof:{reference:'Caillou 12 cm³, pâte 18 cm³ (boule ou galette), clé 4 cm³ (valeurs simulées) ; conditions : insoluble, coule, entièrement immergé, sans éclaboussure.',attendus:['Lire V₁ et V₂.','Calculer V = V₂ − V₁ avec l’unité.','Donner les conditions de la méthode.'],erreurs:['Prendre V₂ pour le volume du solide.','Laisser tomber le solide (casse, éclaboussures).','Croire que la galette a un volume plus grand que la boule.']},
    diagnostic:st=>st.essais.length?['Indicatif : mesure la pâte en boule puis en galette, et essaie un cas raté.']:['Plonge un premier solide.']
  };
})();
