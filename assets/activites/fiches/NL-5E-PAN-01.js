/* NohobaLab · 5e · PAN-01 · Effet d'une lampe en panne dans un montage en série et dans un montage en dérivation (modèle NohobaPannes5e.panne). */
(function(){
  'use strict';
  const P=()=>window.NohobaPannes5e,E=()=>window.NohobaElec5e;
  const mode=m=>m==='serie'?'En série':'En dérivation';
  function manip(panel,X){const p=P();
    E().atelier(panel,X,{titre:'Atelier · une lampe tombe en panne',idObs:'e-obs',placeholder:'J’observe que l’autre lampe…',
      intro:'Je choisis le montage, puis la lampe dont le filament est coupé. J’observe l’autre lampe.',fiche:()=>window.FICHE_5E_PAN01,
      groupes:[{legende:'Montage des deux lampes',nom:'e-m',items:p.MODES,def:'serie'},{legende:'Lampe en panne',nom:'e-c',items:p.CIBLES,def:'aucune'}],
      rendre:v=>{const r=p.vuePanne(v['e-m'],v['e-c']);return {montage:r.montage,schema:r.schema,lecture:r.etat.txt,essai:{mode:v['e-m'],cible:v['e-c'],txt:r.etat.txt}};}});}
  const val=st=>E().valides(st);
  window.FICHE_5E_PAN01={
    id:'NL-5E-PAN-01',version:'0.9',modele:'panne-lampe-v1',
    titre:'Une lampe grille : et l’autre ?',niveau:'5e',theme:'Électricité',chapitre:'Association de lampes électriques',
    competenceVisee:'Prévoir l’effet d’une lampe en panne dans un montage en série ou en dérivation.',
    objectifsPedagogiques:['Observer l’effet d’une lampe en panne dans un montage en série','Observer l’effet d’une lampe en panne dans un montage en dérivation','Expliquer la différence avec le nombre de boucles'],
    situationEvaluation:'Dans le couloir de l’école de Kofi, quand une lampe grille, les autres restent allumées. Les lampes sont-elles montées en série ou en dérivation ? Justifie.',
    objectif:'Trouver ce que devient la seconde lampe quand la première tombe en panne, selon le montage.',
    objectifEleve:'Savoir prévoir ce qui se passe quand une lampe grille.',
    situation:'La guirlande d’Awa s’est éteinte d’un coup : une seule lampe a grillé. Chez Kofi, une lampe du salon a grillé, mais celle de la cuisine brille toujours. Pourquoi une panne n’a-t-elle pas le même effet dans les deux cas ?',
    materiel:'Pile plate fictive de 4,5 V, deux lampes identiques sur support, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui se passe quand une lampe grille. Justifie ton hypothèse avec « car ».',choix:[
      ['depend','En série l’autre lampe s’éteint ; en dérivation elle reste allumée'],['toujours','L’autre lampe s’éteint toujours'],['jamais','L’autre lampe reste toujours allumée'],['inverse','En série l’autre lampe reste allumée ; en dérivation elle s’éteint']]},
    protocole:['Montage en série, aucune panne : observer les deux lampes.','Changer un seul élément : mettre L1 en panne, puis L2.','Recommencer avec le montage en dérivation.','Écrire une observation après chaque essai.'],
    variable:'La lampe en panne, puis le montage',maintenu:'La pile et les deux lampes',
    colonnes:['Montage','Lampe en panne','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[mode(e.mode),e.cible==='aucune'?'Aucune':e.cible,e.txt,e.observation||'—']),
    resume:e=>mode(e.mode)+', '+(e.cible==='aucune'?'aucune panne':e.cible+' en panne')+' : '+e.txt,
    confrontation:'1. En série, que devient l’autre lampe quand une lampe grille ? 2. Et en dérivation ? 3. Combien de boucles contient chaque montage ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai en série et un essai en dérivation avec la lampe en panne et l’état de l’autre lampe.',
    transfert:{q:'Dans le couloir de l’école, une lampe grille et les autres restent allumées. Comment les lampes sont-elles montées ?',rep:'derivation',options:[['serie','En série'],['derivation','En dérivation'],['deux','L’un ou l’autre, on ne peut pas savoir'],['aucun','Elles ne sont pas reliées au même générateur']],expl:'En dérivation, chaque lampe est dans sa propre boucle avec le générateur : une lampe en panne n’ouvre que sa boucle.'},
    critere:'Prévoir et expliquer l’effet d’une lampe en panne dans les deux montages.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Décrit un essai sans comparer les montages.'],['MF','Compare les deux montages sans expliquer.'],['MS','Prévoit correctement l’effet de la panne dans les deux montages.'],['TBM','Prévoit et explique avec la boucle ouverte ou les boucles indépendantes.']],
    peutConfronter:st=>{const v=val(st);return ['serie','derivation'].every(m=>v.some(e=>e.mode===m&&e.cible!=='aucune'));},
    aides:['Une lampe grillée ne laisse plus passer le courant : elle ouvre la boucle où elle se trouve.','Suis la boucle avec ton doigt sur le schéma : passe-t-elle par la lampe en panne ?','As-tu essayé une panne dans chaque montage ?'],
    synthese:'En série, il n’y a qu’une seule boucle : si une lampe est en panne, la boucle est ouverte et toutes les lampes s’éteignent. En dérivation, chaque lampe forme sa propre boucle avec le générateur : si une lampe est en panne, les autres restent allumées. C’est pourquoi les lampes de la maison sont montées en dérivation.',
    prof:{reference:'Série : une lampe en panne, l’autre s’éteint. Dérivation : une lampe en panne, l’autre reste allumée normalement.',attendus:['Hypothèse notée avant les essais.','Une panne testée dans chaque montage.','Explication par la boucle.'],erreurs:['Croire que le courant « saute » la lampe grillée en série.','Confondre série et dérivation sur le schéma.','Changer deux éléments à la fois.']},
    diagnostic:st=>val(st).some(e=>e.mode==='derivation')?['Compare tes essais en série et en dérivation : qu’est-ce qui change ?']:['Passe au montage en dérivation et mets une lampe en panne.']
  };
})();
