/* NohobaLab · 6e Côte d'Ivoire · MAT-05 · Reconnaître quelques éléments de la verrerie de laboratoire.
   Jeu d’association nom / dessin, puis choix du récipient pour trois situations. Aucun volume n’est lu ici (verrerie non graduée). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere;
  const NOMS=()=>M().VERRERIE.map(v=>[v.id,v.nom.charAt(0).toUpperCase()+v.nom.slice(1)]);
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  function manip(panel,X){
    const V=M().VERRERIE,ordre=['verre','flacon','cristallisoir','bocal','ballon','becher','tube'];
    const items=ordre.map((id,i)=>({id:id,label:'Récipient n° '+(i+1),svg:M().scene.verrerieSvg(id,'Dessin du récipient n° '+(i+1)),juste:id,
      pourquoi:V.filter(v=>v.id===id)[0].usage,aide:'Regarde la forme : col étroit, large ouverture, fond plat ou arrondi.'}));
    M().tri(panel,X,{id:'verrerie',titre:'Je nomme chaque récipient',intro:'Pour chaque dessin, je choisis son nom. Le verre non gradué ne sert pas à lire un volume.',legende:'C’est',cats:NOMS(),items:items});
    const sit=M().SITUATIONS_VERRERIE.map(s=>({id:s.id,label:s.txt,juste:s.juste,pourquoi:s.pourquoi,aide:'Pense à ce que le récipient doit faire : tenir debout, se fermer, être large.'}));
    M().tri(panel,X,{id:'usage',titre:'Je choisis le bon récipient',intro:'Pour chaque situation, je choisis le récipient le plus adapté.',legende:'Je prends',cats:NOMS().filter(c=>['ballon','flacon','cristallisoir'].indexOf(c[0])>=0),items:sit});
  }
  window.FICHE_CI_MAT05={
    id:'NL-CI-6E-MAT-05',version:'0.9',modele:'verrerie-association-v1',
    titre:'Reconnaître quelques éléments de la verrerie de laboratoire',niveau:'6e',
    theme:'Propriétés physiques de la matière',chapitre:'Solides et liquides',
    competenceVisee:'Nommer des récipients de laboratoire et dire à quoi ils servent.',
    objectifsPedagogiques:['Nommer le cristallisoir, le tube à essai, le ballon à fond plat, le flacon, le bécher, le verre et le bocal','Dire à quoi sert chaque récipient','Choisir un récipient selon l’usage'],
    situationEvaluation:'Le professeur prépare l’expérience de la semaine : chauffer de l’eau, conserver un liquide, installer une cuve à eau. Aide-le à choisir un récipient pour chacun de ces besoins et explique ton choix.',
    objectif:'Associer les noms de la verrerie à leur dessin et à leur usage.',objectifEleve:'Savoir nommer la verrerie et choisir un récipient.',
    situation:'Dans la salle de sciences, un technicien prépare l’expérience du jour. Il doit retrouver le bon récipient pour chaque besoin. Kofi et Awa l’aident.',
    materiel:'Simulation : cristallisoir, tube à essai, ballon à fond plat, flacon, bécher, verre, bocal.',
    prevision:{consigne:'Avant le jeu, choisis le récipient qui convient le mieux pour chauffer de l’eau. Justifie ton hypothèse.',choix:[['ballon','Le ballon à fond plat en verre résistant à la chaleur'],['flacon','Le flacon fermé par un bouchon'],['cristallisoir','Le cristallisoir large et peu profond'],['verre','N’importe quel verre du quotidien']]},
    protocole:['Associer chaque dessin à son nom.','Lire l’explication donnée pour chaque réponse.','Choisir un récipient pour chacune des trois situations.','Reprendre les erreurs avec l’explication.'],
    variable:'Le nom ou le récipient choisi',maintenu:'Les dessins de la paillasse virtuelle',
    colonnes:['Élément','Mon choix','Résultat'],lignesVides:7,
    lignes:st=>M().lignesTri(st,'verrerie',i=>'Dessin « '+lib(NOMS(),i)+' »',c=>lib(NOMS(),c)).concat(M().lignesTri(st,'usage',i=>(M().SITUATIONS_VERRERIE.filter(s=>s.id===i)[0]||{txt:i}).txt,c=>lib(NOMS(),c))),
    resume:e=>e.tri==='usage'?'usage : '+lib(NOMS(),e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'):'nom : '+lib(NOMS(),e.choix).toLowerCase()+(e.juste?' (juste)':' (à revoir)'),
    confrontation:'1. Quels noms as-tu bien associés du premier coup ? 2. Quelle forme aide à reconnaître un flacon, un ballon, un cristallisoir ? 3. Quel récipient chauffe-t-on ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un récipient, son usage et la forme qui le fait reconnaître.',
    transfert:{q:'Pour chauffer de l’eau avec le professeur, choisit-on un flacon fermé par un bouchon ?',rep:'non',expl:'Non : on chauffe dans un récipient en verre résistant à la chaleur, tenant debout (ballon à fond plat), jamais dans un flacon fermé.'},
    critere:'Nommer au moins cinq récipients et choisir le bon pour les trois situations.',
    essaisMin:10,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Nomme moins de trois récipients.'],['MF','Nomme cinq récipients sans dire leur usage.'],['MS','Nomme cinq récipients et choisit le bon pour les situations.'],['TBM','Nomme les sept récipients, justifie ses choix et repère le verre qui se chauffe.']],
    peutConfronter:st=>{const a=M().triEtat(st,'verrerie',M().VERRERIE.map(v=>v.id)),b=M().triEtat(st,'usage',M().SITUATIONS_VERRERIE.map(s=>s.id));return a.repondus>=7&&b.repondus>=3;},
    aides:['Regarde le col, le fond et l’ouverture.','Le ballon à fond plat est en verre résistant à la chaleur et tient debout.','Le flacon se ferme avec un bouchon : il sert à conserver.'],
    synthese:'Chaque récipient a une forme adaptée à son usage : le cristallisoir (cuve large), le tube à essai (petite quantité), le ballon à fond plat en verre résistant à la chaleur (chauffer), le flacon à bouchon (conserver), le bécher, le verre et le bocal.',
    prof:{reference:'Sept récipients à connaître ; le ballon à fond plat en verre résistant à la chaleur se chauffe sur un support stable ; le flacon conserve ; le cristallisoir sert de cuve à eau.',attendus:['Associer correctement au moins cinq noms.','Choisir ballon, flacon et cristallisoir selon les situations.','Dire qu’un verre non gradué ne sert pas à lire un volume.'],erreurs:['Confondre bécher et verre.','Chauffer dans un récipient fermé ou non résistant à la chaleur.']},
    diagnostic:st=>st.essais.length?['Indicatif : relis l’explication des réponses fausses.']:['Associe un premier récipient.']
  };
})();
