/* NohobaLab · 6e Côte d'Ivoire · MES-02 · Mesurer le volume d'un liquide à l'aide d'un récipient gradué.
   Panneaux de lecture redessinés (valeurs différentes de celles du TP 12). Erreur de parallaxe exagérée (deux divisions) et signalée comme un modèle.
   Les traits du bécher sont indicatifs (cohérent avec MAT-05). Eau colorée seulement ; ménisque concave. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const EP=[['A','Éprouvette A (graduée en mL)'],['B','Éprouvette B (graduée en cm³)']];
  const NIV=[['0','Premier liquide'],['1','Deuxième liquide'],['2','Troisième liquide']];
  const vol=v=>Q().VOLUMES_LECTURE[v.ep][Number(v.niv)];
  const DEPART=()=>[
    {id:'biberon',q:'Volume de lait dans le biberon',juste:'120',options:[['120','120 mL'],['12','12 mL'],['102','102 mL']],pourquoi:'Entre 100 et 150 il y a 5 divisions : une division vaut 10 mL. Le lait arrive 2 divisions au-dessus de 100 : 120 mL.'},
    {id:'seringue',q:'Volume de sirop dans la seringue',juste:'3,4',options:[['3,4','3,4 mL'],['3,2','3,2 mL'],['34','34 mL']],pourquoi:'Entre 2 et 4 il y a 10 divisions : une division vaut 0,2 mL. Le joint du piston est 7 divisions au-dessus de 2 : 2 + 1,4 = 3,4 mL.'}
  ];
  function svgDepart(id){const D=Q().dessin,V=id==='biberon'?120:3.4;return D.vue(D.eprouvette(62,236,{id:id,V:V,mode:'montage',H:170,liq:id==='biberon'?'#F1EEE4':'#B2443A'}).svg,(id==='biberon'?'Biberon gradué contenant du lait':'Seringue graduée contenant du sirop')+' (valeur simulée)','0 0 150 250');}
  function manip(panel,X){
    M().tri(panel,X,{id:'mes02depart',titre:'Test de départ · je lis deux récipients gradués',intro:'Avant de manipuler, je lis le volume dans un biberon et dans une seringue. Leurs graduations ne sont pas les mêmes.',legende:'Je lis',cats:[['x','x']],
      items:DEPART().map((d,k)=>({id:d.id,label:d.q,svg:svgDepart(d.id),options:Q().place(d.options,d.juste,k+1),juste:d.juste,pourquoi:d.pourquoi,aide:'Cherche d’abord combien vaut une division : écart entre deux nombres écrits, divisé par le nombre de divisions.'}))});
    Q().mesure(panel,X,{id:'mes02lect',titre:'Atelier 1 · je lis une éprouvette graduée',
      intro:'Comme au panneau de lecture du TP : je relève l’unité, je trouve la valeur d’une division à partir des divisions entre deux nombres écrits, puis je lis le volume au bas du ménisque. Valeurs simulées.',
      controles:[{cle:'ep',legende:'L’éprouvette',items:EP},{cle:'niv',legende:'Le liquide',items:NIV}],
      champs:v=>[{cle:'division',label:'Valeur d’une division',unite:Q().EPROUVETTES[v.ep].unite},{cle:'volume',label:'Volume lu',unite:Q().EPROUVETTES[v.ep].unite}],
      F:()=>window.FICHE_CI_MES02,legendeTable:'Mes lectures (valeurs simulées).',
      render:v=>{const sc=Q().scene.lecture({id:v.ep,V:vol(v),oeil:'niveau'});return {montage:sc.montage,schema:sc.schema,txt:'Unité inscrite : '+Q().EPROUVETTES[v.ep].unite+'. À toi de lire.'};},
      verifier:(v,s)=>{const r=Q().verifierLecture(v.ep,vol(v),s.division,s.volume);return {juste:r.juste,retour:r.retour,essai:{atelier:'lecture',ep:v.ep,V:r.attendu.volume,division:r.attendu.division}};},
      attendu:v=>({division:Q().fr(Q().division(v.ep)),volume:Q().fr(Q().lecture(v.ep,vol(v),'niveau').valeur)}),
      aide:v=>'Entre deux nombres écrits il y a '+Q().EPROUVETTES[v.ep].ecart+' '+Q().EPROUVETTES[v.ep].unite+'. Compte les divisions entre eux.'});
    M().bloc(panel,X,{n:202,titre:'Atelier 2 · où placer mon œil ?',
      intro:'Kofi lit 64 mL dans l’éprouvette A. Je déplace son œil. Le zoom montre la ligne de visée (modèle exagéré pour être visible).',
      controles:[{cle:'oeil',legende:'Position de l’œil',items:Q().OEIL}],
      saisie:'J’observe que, l’œil …, on croit lire …',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES02,
      render:v=>{const r=Q().lecture('A',64,v.oeil),sc=Q().scene.lecture({id:'A',V:64,oeil:v.oeil});return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{atelier:'oeil',oeil:v.oeil,lu:r.valeur,juste:r.juste}};}});
    M().bloc(panel,X,{n:203,titre:'Atelier 3 · bécher, verre mesureur ou éprouvette ?',
      intro:'Kofi a prélevé un peu d’eau colorée (63 mL, valeur simulée). Je la mesure dans trois récipients gradués.',
      controles:[{cle:'rec',legende:'Le récipient',items:Q().RECIPIENTS_GRADUES.map(r=>[r.id,r.nom])}],
      saisie:'J’observe que, dans ce récipient, je peux lire…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES02,
      render:v=>{const r=Q().mesureRecipient(v.rec),sc=Q().scene.recipients(v);return {montage:sc.montage,schema:sc.schema,txt:Q().sim(r.txt),essai:{atelier:'recipient',rec:v.rec,pas:r.pas,min:r.min,max:r.max,valeur:r.valeur}};}});
  }
  function ligne(e){
    if(e.mesure)return ['Lecture · '+lib(EP,e.ep),'1 division = '+Q().fr(e.division)+' ; lu : '+e.saisies.volume,e.juste?'Juste':'À revoir'];
    if(e.atelier==='oeil')return ['Œil · '+lib(Q().OEIL,e.oeil),'on croit lire '+e.lu+' mL',e.observation||'—'];
    if(e.atelier==='recipient')return [lib(Q().RECIPIENTS_GRADUES.map(r=>[r.id,r.nom]),e.rec),e.pas===1?Q().V_KOFI+' mL':'entre '+e.min+' et '+e.max+' mL',e.observation||'—'];
    return null;
  }
  window.FICHE_CI_MES02={
    id:'NL-CI-6E-MES-02',version:'0.9',modele:'eprouvette-lecture-v1',
    titre:'Mesurer le volume d’un liquide à l’aide d’un récipient gradué',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Volume d’un liquide et d’un solide',
    competenceVisee:'Mesurer le volume d’un liquide avec une éprouvette graduée.',
    objectifsPedagogiques:['Choisir l’éprouvette adaptée et la poser sur un plan horizontal','Trouver la valeur d’une division','Placer l’œil à la hauteur du bas du ménisque','Écrire le volume avec son unité'],
    situationEvaluation:'Pour une expérience, Yao doit verser 60 mL d’eau. Il hésite entre un bécher et une éprouvette de 100 mL, et lit le volume en regardant d’en haut. Explique-lui quel récipient choisir et comment lire.',
    objectif:'Lire juste le volume d’un liquide dans une éprouvette graduée.',objectifEleve:'Savoir lire le volume d’un liquide dans une éprouvette.',
    situation:'En salle de TP, Kofi doit prélever 60 mL d’eau pour une expérience. Bécher, verre mesureur ou éprouvette : lequel choisir, et comment lire juste ?',
    materiel:'Simulation : une éprouvette de 100 mL graduée en mL, une éprouvette de 250 cm³ graduée en cm³, un bécher, un verre mesureur, un biberon et une seringue gradués, de l’eau colorée.',
    prevision:{consigne:'Avant les essais, choisis où placer ton œil pour lire juste. Justifie ton hypothèse.',choix:[['haut','Au-dessus, pour bien voir la surface du liquide'],['bas','En dessous du liquide'],['niveau','À la hauteur du bas du ménisque'],['importe','Peu importe : la lecture est toujours la même']]},
    protocole:['Poser l’éprouvette sur la paillasse horizontale.','Repérer l’unité, puis la valeur d’une division.','Placer l’œil à la hauteur du bas du ménisque.','Lire le volume et l’écrire avec son unité.','Comparer la lecture dans le bécher, le verre mesureur et l’éprouvette.'],
    variable:'La position de l’œil, puis le récipient gradué',maintenu:'Le même liquide et le même volume',
    colonnes:['Ce que je fais','Ce que je lis','Mon observation ou résultat'],lignesVides:6,
    lignes:st=>st.essais.filter(e=>!e.tri).map(ligne).filter(Boolean).concat(Q().lignesTri(st,'mes02depart',DEPART())),
    resume:e=>e.tri?'test de départ '+(e.juste?'juste':'à revoir'):e.mesure?'lecture '+e.ep+' : '+(e.juste?'juste':'à revoir'):e.atelier==='oeil'?'œil '+e.oeil+' : '+e.lu+' mL':'récipient '+e.rec,
    confrontation:'1. Comment trouves-tu la valeur d’une division ? 2. Que lis-tu quand l’œil est au-dessus, au niveau, en dessous du ménisque ? 3. Quel récipient permet la lecture la plus précise ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une lecture juste avec son unité et la valeur d’une division.',
    transfert:{q:'Entre les nombres 20 et 30 d’une éprouvette, il y a 10 divisions. Le bas du ménisque est sur la 4e division au-dessus de 20. Quel volume lis-tu ?',type:'nombre',unite:'mL',rep:24,tol:0,expl:'Une division vaut (30 − 20) ÷ 10 = 1 mL ; 20 + 4 × 1 = 24 mL.'},
    critere:'Lire deux volumes justes avec la valeur d’une division, l’œil au bas du ménisque, et choisir le récipient le plus précis.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Lit un nombre sans unité ni valeur de division.'],['MF','Lit juste une éprouvette mais oublie l’unité ou la position de l’œil.'],['MS','Trouve la division, lit au bas du ménisque et écrit l’unité.'],['TBM','Lit les deux éprouvettes, explique l’erreur de visée et choisit le récipient le plus précis.']],
    peutConfronter:st=>{const j=Q().justes(st,'mesure','mes02lect'),v=M().valides(st),oe=new Set(v.filter(e=>e.atelier==='oeil').map(e=>e.oeil)),rc=new Set(v.filter(e=>e.atelier==='recipient').map(e=>e.rec));return j.some(e=>e.ep==='A')&&j.some(e=>e.ep==='B')&&oe.has('niveau')&&oe.size>=2&&rc.has('eprouvette')&&rc.size>=2&&M().triEtat(st,'mes02depart',['biberon','seringue']).repondus>=2;},
    aides:['Une division = écart entre deux nombres écrits ÷ nombre de divisions entre eux.','Le ménisque est la surface courbée de l’eau : on lit au bas de la courbe.','Plus les traits sont serrés, plus la lecture est précise.'],
    synthese:'Pour mesurer le volume d’un liquide, on utilise de préférence une éprouvette graduée posée sur un plan horizontal. On cherche la valeur d’une division (écart entre deux nombres écrits divisé par le nombre de divisions), on place l’œil à la hauteur du bas du ménisque et on écrit le volume avec son unité (mL ou cm³). L’éprouvette est plus précise que le bécher, dont les traits sont seulement indicatifs.',
    prof:{reference:'A : 1 division = 1 mL ; B : 1 division = 5 cm³ ; œil au bas du ménisque ; éprouvette (1 mL) plus précise que bécher (25 mL) et verre mesureur (50 mL) ; 63 mL simulés.',attendus:['Trouver la valeur d’une division.','Lire au bas du ménisque, œil à sa hauteur.','Écrire l’unité.','Choisir l’éprouvette.'],erreurs:['Lire en regardant d’en haut.','Confondre une division et l’écart entre deux nombres.','Oublier l’unité ou confondre mL et cm³ (1 mL = 1 cm³).']},
    diagnostic:st=>st.essais.length?['Indicatif : lis les deux éprouvettes, puis teste les trois positions de l’œil et les trois récipients.']:['Commence par le test de départ.']
  };
})();
