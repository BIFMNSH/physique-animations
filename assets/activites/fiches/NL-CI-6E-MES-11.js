/* NohobaLab · 6e Côte d'Ivoire · MES-11 · Relation entre masse et volume (ajout du 27 octobre 2026, idée du propriétaire).
   Deux parcours au choix du professeur : groupe 1 les solides, groupe 2 les liquides ; même conclusion.
   Garde-fous : aucun quotient masse ÷ volume, seulement des coefficients multiplicateurs dans un tableau de proportionnalité, toujours « pour une même matière ».
   Valeurs simulées réalistes : cylindres de 20 cm³ ; jeton de laiton 6 cm³ et 51 g ; 10 mL d'huile 9 g, de sirop 13 g. Liquides ménagers fermés ou en simulation. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>String(x[0])===String(k))[0]||['',k])[1];
  const CYL=()=>Q().CYLINDRES.map(c=>[c.id,'Cylindre de '+c.nom]);
  const LIQ=()=>Object.keys(Q().LIQ).map(k=>[k,Q().LIQ[k].nom.charAt(0).toUpperCase()+Q().LIQ[k].nom.slice(1)]);
  const PREV=()=>Q().PREVISIONS.map(p=>[p.id,p.txt]);
  function manip(panel,X){
    const h=Activite.h,st=X.st(),choix=h('div',{class:'card'},panel);
    h('h3',{text:'Mon parcours'},choix);
    h('label',{for:'mes11-groupe',style:'display:block;font-weight:700'},choix,'Le groupe choisi par le professeur');
    const sel=h('select',{id:'mes11-groupe'},choix,'<option value="solides">Groupe 1 · les solides</option><option value="liquides">Groupe 2 · les liquides</option>');
    h('p',{},choix,'Les deux groupes arrivent à la même conclusion. Le professeur peut faire présenter les résultats d’un groupe à l’autre.');
    sel.value=st.groupe||'solides';
    const g1=h('div',{'data-groupe':'solides'},panel),g2=h('div',{'data-groupe':'liquides'},panel);
    function montre(){g1.hidden=sel.value!=='solides';g2.hidden=sel.value!=='liquides';}
    sel.onchange=()=>{st.groupe=sel.value;X.save();montre();};
    M().bloc(g1,X,{n:211,titre:'Groupe 1 · cinq cylindres de même volume',
      intro:'Je vérifie que les cylindres ont le même volume (déplacement d’eau, avec un lest pour le bois qui flotte), puis je les pèse. Valeurs simulées.',
      controles:[{cle:'cyl',legende:'Le cylindre',items:CYL()}],
      saisie:'J’observe que ce cylindre a un volume de … et une masse de …',legendeTable:'Mes mesures.',F:()=>window.FICHE_CI_MES11,
      render:v=>{const c=Q().cylindre(v.cyl),sc=Q().scene.cylindre({id:v.cyl});return {montage:sc.montage,schema:sc.schema,txt:c.txt+' (valeurs simulées)',essai:{groupe:'solides',cyl:v.cyl,V:c.V,m:c.m}};}});
    M().bloc(g1,X,{n:212,titre:'Groupe 1 · même masse, même volume ?',
      intro:'J’équilibre 100 g de coton face à 100 g d’écrous sur la balance de Roberval.',
      controles:[{cle:'vue',legende:'L’expérience',items:[['coton_ecrous','100 g de coton face à 100 g d’écrous']]}],
      saisie:'J’observe que la balance… et que le coton et les écrous…',legendeTable:'Mes mesures.',F:()=>window.FICHE_CI_MES11,
      render:v=>{const sc=Q().scene.cotonEcrous({});return {montage:sc.montage,schema:sc.schema,txt:'Équilibre : même masse (100 g). Le coton occupe environ 2 000 cm³, les écrous environ 13 cm³ (valeurs simulées).',essai:{groupe:'solides',coton:true}};}});
    M().bloc(g1,X,{n:213,titre:'Groupe 1 · des jetons de laiton identiques',
      intro:'Je pèse 1, 2 puis 3 jetons et je mesure leur volume par déplacement d’eau.',
      controles:[{cle:'n',legende:'Nombre de jetons',items:[['1','1 jeton'],['2','2 jetons'],['3','3 jetons']]}],
      saisie:'J’observe que, avec deux fois plus de jetons…',legendeTable:'Mes mesures.',F:()=>window.FICHE_CI_MES11,
      render:v=>{const j=Q().jetons(Number(v.n)),sc=Q().scene.jetons(v);return {montage:sc.montage,schema:sc.schema,txt:j.txt+' (valeurs simulées)',essai:{groupe:'solides',jetons:j.n,V:j.V,m:j.m}};}});
    M().bloc(g2,X,{n:214,titre:'Groupe 2 · 10 mL puis 20 mL de chaque liquide',
      intro:'Je pose l’éprouvette sur la balance électronique, j’appuie sur « tare », puis je verse 10 mL, puis 20 mL de liquide. L’eau de Javel diluée et le vinaigre restent en simulation (pictogrammes, voir MAT-06). Valeurs simulées.',
      controles:[{cle:'liq',legende:'Le liquide',items:LIQ()},{cle:'V',legende:'Le volume versé',items:[['10','10 mL'],['20','20 mL']]}],
      saisie:'J’observe que la balance tarée affiche…',legendeTable:'Mes mesures.',F:()=>window.FICHE_CI_MES11,
      render:v=>{const r=Q().liquideMV(v.liq,Number(v.V)),sc=Q().scene.liquide(v);return {montage:sc.montage,schema:sc.schema,txt:r.txt+' (valeur simulée)',essai:{groupe:'liquides',liq:v.liq,V:r.V,m:r.m}};}});
    Q().mesure(panel,X,{id:'mes11prev',titre:'Pour tous · je prévois une masse avec un tableau de proportionnalité',
      intro:'Pour une même matière, si la quantité est multipliée par un nombre, la masse est multipliée par le même nombre. Je cherche ce nombre, puis je calcule.',
      controles:[{cle:'p',legende:'Ce que je prévois',items:PREV()}],
      champs:[{cle:'m',label:'Masse prévue',unite:'g'}],F:()=>window.FICHE_CI_MES11,legendeTable:'Mes prévisions.',
      render:v=>{const p=Q().PREVISIONS.filter(x=>x.id===v.p)[0],T=window.NohobaAtelier.T,f=m=>Q().dessin.vue('<rect x="60" y="60" width="340" height="120" rx="8" fill="'+(m==='schema'?'none':'#fff')+'" stroke="#243049" stroke-width="2"/><line x1="60" y1="120" x2="400" y2="120" stroke="#243049" stroke-width="2"/><line x1="230" y1="60" x2="230" y2="180" stroke="#243049" stroke-width="2"/>'+T(145,96,p.ref.split(' : ')[0],13,'#243049',800)+T(315,96,p.txt.replace(/^La masse (de |d’un sac de |d’)/,'').replace(/ \(.*\)$/,''),12,'#243049',800)+T(145,156,p.ref_m+' g',15,'#243049',800)+T(315,156,'? g',15,'#C2410C',800)+'<path d="M180 40 Q230 14 280 40" fill="none" stroke="#C2410C" stroke-width="2"/>'+T(230,28,'× ?',13,'#C2410C',800)+'<path d="M180 200 Q230 226 280 200" fill="none" stroke="#C2410C" stroke-width="2"/>'+T(230,232,'× ?',13,'#C2410C',800),'Tableau de proportionnalité : '+p.ref+' ; '+p.txt);return {montage:f('montage'),schema:f('schema'),txt:'Référence : '+p.ref+' (même matière).'};},
      verifier:(v,s)=>{const r=Q().verifierPrevision(v.p,s.m);return {juste:r.juste,retour:r.retour,essai:{prevision:v.p,m:r.attendu}};},
      attendu:v=>({m:Q().PREVISIONS.filter(x=>x.id===v.p)[0].juste})});
    montre();
  }
  function ligne(e){
    if(e.cyl)return ['Cylindre de '+Q().CYLINDRES.filter(c=>c.id===e.cyl)[0].nom,e.V+' cm³',e.m+' g',e.observation||'—'];
    if(e.coton)return ['Coton / écrous','≈ 2 000 cm³ / ≈ 13 cm³','100 g / 100 g',e.observation||'—'];
    if(e.jetons)return [e.jetons+' jeton'+(e.jetons>1?'s':'')+' de laiton',e.V+' cm³',e.m+' g',e.observation||'—'];
    if(e.liq)return [lib(LIQ(),e.liq),e.V+' mL',e.m+' g',e.observation||'—'];
    if(e.mesure)return ['Prévision · '+lib(PREV(),e.prevision),'—',e.saisies.m+' g',e.juste?'Juste':'À revoir'];
    return null;
  }
  window.FICHE_CI_MES11={
    id:'NL-CI-6E-MES-11',version:'0.9',modele:'masse-volume-v1',
    titre:'Relation entre masse et volume',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Établir la relation entre la masse et le volume d’un objet.',
    objectifsPedagogiques:['Dire que des objets de même volume mais de matières différentes ont des masses différentes','Dire que des objets de même masse peuvent avoir des volumes différents','Dire que, pour une même matière, la masse et le volume sont proportionnels','Prévoir la masse d’un objet d’une matière connue à partir de son volume, avec un tableau de proportionnalité'],
    situationEvaluation:'Un sachet de 10 billes d’acier identiques a une masse de 80 g. Quelle est la masse de 50 billes identiques ? Kofi dit : « le fer est plus lourd que le bois ». Corrige sa phrase.',
    objectif:'Relier la masse et le volume d’une même matière.',objectifEleve:'Savoir prévoir une masse à partir d’un volume, pour une même matière.',
    situation:'Awa et Kofi aident leur oncle à déménager. Dans le magasin, ils trouvent un sac de jetons d’awalé en laiton, tous pareils, et des bidons de liquides ménagers et alimentaires de capacités différentes. Pour préparer les cartons, ils se demandent : peut-on prévoir la masse d’un objet ou d’un liquide en connaissant son volume ?',
    materiel:'Simulation : cinq cylindres de même taille (PVC, bois, aluminium, fer, laiton), une éprouvette et un lest, une balance de Roberval, du coton et des écrous, des jetons de laiton, une balance électronique avec tare, cinq liquides (eau, huile, sirop, vinaigre, eau de Javel diluée).',
    prevision:{consigne:'Avant les essais : cinq cylindres de même taille, en PVC, bois, aluminium, fer et laiton, ont-ils la même masse ? Justifie ton hypothèse (« car… »).',choix:[['non','Non : à volume égal, la masse dépend de la matière'],['oui','Oui, puisqu’ils ont le même volume'],['bois','Le bois a la plus grande masse, car c’est une matière naturelle'],['taille','Seule la taille compte pour la masse']]},
    protocole:['Groupe 1 : vérifier que les cylindres ont le même volume, puis les peser ; équilibrer 100 g de coton et 100 g d’écrous ; peser 1, 2, 3 jetons et mesurer leur volume.','Groupe 2 : tarer l’éprouvette, verser 10 mL puis 20 mL de chaque liquide et relever la masse.','Pour tous : prévoir une masse avec un tableau de proportionnalité.'],
    variable:'La matière, puis la quantité d’une même matière',maintenu:'Le même volume (cylindres) ou la même matière (jetons, un liquide)',
    colonnes:['Ce que je mesure','Volume','Masse (simulée)','Mon observation ou verdict'],lignesVides:8,
    lignes:st=>st.essais.map(ligne).filter(Boolean),
    resume:e=>e.cyl?'cylindre de '+Q().CYLINDRES.filter(c=>c.id===e.cyl)[0].nom+' : '+e.m+' g':e.coton?'coton / écrous : même masse':e.jetons?e.jetons+' jeton(s) : '+e.V+' cm³, '+e.m+' g':e.liq?Q().LIQ[e.liq].nom+' '+e.V+' mL : '+e.m+' g':'prévision : '+e.saisies.m+' g',
    confrontation:'1. À volume égal, la masse dépend-elle de la matière ? 2. À masse égale, le volume dépend-il de la matière ? 3. Pour une même matière, que devient la masse quand le volume double ? 4. Peut-on prévoir une masse en connaissant seulement le volume ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux mesures qui montrent que la masse double quand le volume double, pour une même matière.',
    transfert:{q:'Un jeton de laiton a une masse de 51 g. Quelle est la masse de 5 jetons identiques ?',type:'nombre',unite:'g',rep:255,tol:0,expl:'Même matière : 5 fois plus de jetons, 5 fois plus de masse ; 51 × 5 = 255 g.'},
    critere:'Constater qu’à volume égal la masse dépend de la matière et, pour une même matière, prévoir une masse avec un tableau de proportionnalité.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Dit qu’un objet plus gros est toujours plus lourd.'],['MF','Constate des masses différentes sans conclure.'],['MS','Énonce les deux constats et la proportionnalité pour une même matière.'],['TBM','Prévoit une masse avec un tableau et précise toujours « pour une même matière ».']],
    peutConfronter:st=>{const v=M().valides(st),cy=new Set(v.filter(e=>e.cyl).map(e=>e.cyl)),jt=new Set(v.filter(e=>e.jetons).map(e=>e.jetons)),lq={};v.filter(e=>e.liq).forEach(e=>{(lq[e.liq]=lq[e.liq]||new Set()).add(e.V);});
      const solides=cy.size>=3&&v.some(e=>e.coton)&&jt.size>=2,liquides=Object.keys(lq).length>=2&&Object.keys(lq).some(k=>lq[k].size>=2);
      return (solides||liquides)&&Q().justes(st,'mesure','mes11prev').length>=1;},
    aides:['Compare des cylindres de même volume : ont-ils la même masse ?','Pour une même matière : 2 fois plus de volume, 2 fois plus de masse.','Dans le tableau, cherche par combien on multiplie la quantité, puis multiplie la masse par le même nombre.'],
    synthese:'Des objets de même volume mais de matières différentes n’ont pas la même masse ; des objets de même masse peuvent avoir des volumes très différents. Pour une même matière, la masse et le volume sont proportionnels : si le volume est multiplié par 2 (ou 3), la masse est multipliée par 2 (ou 3). On peut donc prévoir la masse d’un objet si l’on connaît sa matière et la masse d’un volume de référence ; le volume seul ne suffit pas. On ne dit pas « le fer est plus lourd que le bois » sans préciser « à volume égal ».',
    prof:{reference:'Cylindres de 20 cm³ : PVC 28 g, bois 12 g, aluminium 54 g, fer 157 g, laiton 170 g ; coton et écrous 100 g ; jetons 6 cm³ et 51 g chacun ; 12 jetons 612 g ; 2 L d’huile 1 800 g ; 0,75 L de sirop 975 g, plus que 1 L d’huile (900 g) ; 2 L de vinaigre 2 000 g ; 5 jetons 255 g (valeurs simulées).',attendus:['Deux constats (même volume, même masse).','Proportionnalité pour une même matière.','Une prévision juste avec un tableau.'],erreurs:['Dire que le plus gros est le plus lourd.','Oublier « pour une même matière ».','Additionner au lieu de multiplier dans le tableau.']},
    diagnostic:st=>st.essais.length?['Indicatif : termine les mesures de ton groupe, puis fais une prévision.']:['Commence les mesures de ton groupe.']
  };
})();
