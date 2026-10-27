/* NohobaLab · 6e Côte d'Ivoire · MES-08 · Déterminer la masse d'un liquide par simple pesée.
   Différence de deux pesées sur la balance de Roberval : bécher vide 74 g, avec 100 mL d'eau 174 g, avec 100 mL d'huile 166 g (valeurs simulées).
   Ici m₂ > m₁ toujours ; comparaison eau / huile observée sans masse volumique ; la fonction « tare » est réservée à MES-10. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const SIT=[['becher_vide','Le bécher vide'],['becher_eau','Le bécher avec 100 mL d’eau'],['becher_huile','Le bécher avec 100 mL d’huile']];
  const LIQ=[['eau','L’eau'],['huile','L’huile']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    Q().atelierPesee(panel,X,{id:'mes08',titre:'Atelier 1 · je pèse le bécher vide, puis avec le liquide',
      intro:'Le bécher est sur le plateau de gauche ; je verse 100 mL de liquide mesurés à l’éprouvette (MES-02), jamais sur le plateau. Je pose les masses marquées à droite jusqu’à l’équilibre. Valeurs simulées.',
      legende:'Ce que je pèse',situations:SIT.map(s=>({id:s[0],label:s[1],gauche:[s[0]],droite:[],cote:'droite'})),
      F:()=>window.FICHE_CI_MES08,legendeTable:'Mes pesées (valeurs simulées).',
      retour:(S,m)=>Q().charge(S.id).nom.charAt(0).toUpperCase()+Q().charge(S.id).nom.slice(1)+' : '+m+' g.'});
    Q().mesure(panel,X,{id:'mes08calc',titre:'Atelier 2 · je calcule la masse du liquide',
      intro:'m₁ : masse du bécher vide ; m₂ : masse du bécher avec le liquide. La masse du liquide est m = m₂ − m₁.',
      controles:[{cle:'liq',legende:'Le liquide',items:LIQ}],
      champs:[{cle:'m1',label:'m₁',unite:'g'},{cle:'m2',label:'m₂',unite:'g'},{cle:'m',label:'m = m₂ − m₁',unite:'g'}],
      F:()=>window.FICHE_CI_MES08,legendeTable:'Mes calculs.',
      render:v=>{const D=Q().dessin,ids=['becher_vide',v.liq==='eau'?'becher_eau':'becher_huile'],f=m=>D.vue(D.sol(m,232)+D.objet(ids[0],140,214,m)+D.fleche(190,180,262,180,'#243049',2.5)+D.objet(ids[1],320,214,m)+window.NohobaAtelier.T(140,240,'m₁',14,'#243049',800)+window.NohobaAtelier.T(320,240,'m₂',14,'#243049',800),'Le bécher vide (m₁) puis avec 100 mL '+(v.liq==='eau'?'d’eau':'d’huile')+' (m₂)');return {montage:f('montage'),schema:f('schema'),txt:'Reprends tes pesées de l’atelier 1.'};},
      verifier:(v,s)=>{const r=Q().verifierDifference(v.liq,s.m1,s.m2,s.m);return {juste:r.juste,retour:r.retour,essai:{liq:v.liq,m:r.attendu.m}};},
      attendu:v=>{const L=Q().LIQUIDES_PESES[v.liq];return {m1:L.m1,m2:L.m2,m:L.m2-L.m1};}});
    const pl=Activite.h('div',{class:'card',role:'note'},panel,'<h3 style="margin-top:0">Pour aller plus loin (facultatif)</h3><p>Je pèse 10 mL, 20 mL puis 50 mL d’eau. Que devient la masse quand le volume double ?</p>');
    M().bloc(pl,X,{n:218,titre:'Masse de 10, 20 et 50 mL d’eau',intro:'Même bécher, même méthode : m = m₂ − m₁. Valeurs simulées.',
      controles:[{cle:'V',legende:'Volume d’eau versé',items:[['10','10 mL'],['20','20 mL'],['50','50 mL']]}],
      saisie:'J’observe que, quand le volume double, la masse…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES08,
      render:v=>{const r=Q().eauPlusLoin(Number(v.V)),sc=Q().scene.eauPlusLoin(v);return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{plusLoin:true,V:r.V,m:r.m}};}});
  }
  window.FICHE_CI_MES08={
    id:'NL-CI-6E-MES-08',version:'0.9',modele:'masse-liquide-v1',
    titre:'Déterminer la masse d’un liquide par simple pesée',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Mesurer la masse d’un liquide par différence de deux pesées.',
    objectifsPedagogiques:['Peser le récipient vide (m₁)','Peser le récipient avec le liquide (m₂)','Calculer la masse du liquide m = m₂ − m₁'],
    situationEvaluation:'Pour une recette de bouillie, Mariam doit connaître la masse de 200 mL de lait. Elle a un pot vide de 85 g. Avec le lait, le pot pèse 291 g. Quelle est la masse du lait ? Décris la méthode.',
    objectif:'Mesurer la masse d’un liquide.',objectifEleve:'Savoir peser un liquide sans le verser sur le plateau.',
    situation:'La recette du gâteau demande du lait. Mais Awa sait qu’on ne verse jamais un liquide sur le plateau d’une balance. Comment connaître la masse de 100 mL d’eau ou d’huile ?',
    materiel:'Simulation : une balance de Roberval, une boîte de masses marquées, un bécher, une éprouvette, de l’eau et de l’huile.',
    prevision:{consigne:'Avant de manipuler, choisis une méthode pour trouver la masse d’un liquide. Justifie ton hypothèse.',choix:[['difference','Peser le bécher vide, puis avec le liquide, et faire la différence'],['plateau','Verser le liquide directement sur le plateau'],['plein','Peser seulement le bécher plein'],['volume','Lire le volume : c’est la même chose que la masse']]},
    protocole:['Peser le bécher vide : m₁.','Mesurer 100 mL de liquide à l’éprouvette et les verser dans le bécher.','Peser le bécher avec le liquide : m₂.','Calculer m = m₂ − m₁.','Recommencer avec l’huile.'],
    variable:'Le liquide (eau, huile)',maintenu:'Le même bécher et le même volume (100 mL)',
    colonnes:['Ce que je pèse ou calcule','Masses','Masse (simulée)','Verdict ou observation'],lignesVides:6,
    lignes:st=>Q().lignesPesee(st,'mes08',e=>[lib(SIT,e.sit),e.masses.join(' + ')+' g',e.somme+' g',e.juste?'Juste':'Somme à revoir']).concat(Q().lignesMesure(st,'mes08calc',e=>['Masse de '+lib(LIQ,e.liq).toLowerCase(),e.saisies.m2+' − '+e.saisies.m1,e.saisies.m+' g',e.juste?'Juste':'À revoir'])).concat(st.essais.filter(e=>e.plusLoin).map(e=>['Plus loin · '+e.V+' mL d’eau','m₂ − m₁',e.m+' g',e.observation||'—'])),
    resume:e=>e.pesee?lib(SIT,e.sit).toLowerCase()+' : '+e.somme+' g':e.mesure?'masse de '+lib(LIQ,e.liq).toLowerCase()+' : '+e.saisies.m+' g':e.V+' mL d’eau : '+e.m+' g',
    confrontation:'1. Que valent m₁ et m₂ ? 2. Quelle est la masse de 100 mL d’eau et de 100 mL d’huile ? 3. Deux liquides de même volume ont-ils la même masse ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite m₁, m₂ et la masse calculée pour un liquide.',
    transfert:{q:'Un flacon vide a une masse de 60 g ; rempli de lait, 165 g. Quelle est la masse du lait ?',type:'nombre',unite:'g',rep:105,tol:0,expl:'m = m₂ − m₁ = 165 − 60 = 105 g.'},
    critere:'Peser le récipient vide et plein, calculer m = m₂ − m₁ pour deux liquides.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Donne la masse du bécher plein comme masse du liquide.'],['MF','Fait les deux pesées sans calculer la différence.'],['MS','Calcule m = m₂ − m₁ avec l’unité.'],['TBM','Calcule pour deux liquides et constate que des volumes égaux n’ont pas forcément la même masse.']],
    peutConfronter:st=>{const p=new Set(Q().justes(st,'pesee','mes08').map(e=>e.sit)),c=new Set(Q().justes(st,'mesure','mes08calc').map(e=>e.liq));return p.has('becher_vide')&&(p.has('becher_eau')||p.has('becher_huile'))&&c.has('eau')&&c.has('huile');},
    aides:['m₁ est la masse du bécher vide.','m₂ est la masse du bécher avec le liquide ; m₂ est plus grand que m₁.','La masse du liquide est m₂ − m₁.'],
    synthese:'On ne verse jamais un liquide sur le plateau d’une balance. On pèse le récipient vide (m₁), puis le récipient contenant le liquide (m₂) : la masse du liquide est m = m₂ − m₁. 100 mL d’eau et 100 mL d’huile n’ont pas la même masse.',
    prof:{reference:'m₁ = 74 g ; eau : m₂ = 174 g, m = 100 g ; huile : m₂ = 166 g, m = 92 g (valeurs simulées) ; lait : 105 g.',attendus:['Deux pesées.','Calcul m = m₂ − m₁.','Comparaison eau / huile.'],erreurs:['Verser le liquide sur le plateau.','Calculer m₁ − m₂.','Oublier de sécher l’extérieur du bécher.']},
    diagnostic:st=>st.essais.length?['Indicatif : pèse le bécher vide, puis avec l’eau et avec l’huile.']:['Pèse d’abord le bécher vide.']
  };
})();
