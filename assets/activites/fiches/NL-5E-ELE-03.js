/* NohobaLab · 5e · ELE-03 · Association de lampes : série ou dérivation.
   Modèle qualitatif : en série (une seule boucle) une lampe dévissée coupe tout et les lampes brillent moins ; en dérivation chaque lampe est indépendante. */
(function(){
  'use strict';
  const E=()=>window.NohobaElec5e;
  const MODE={serie:'En série',derivation:'En dérivation'},DEV={aucune:'Aucune',L1:'L1',L2:'L2'};
  const ETAT=(e)=>e.on?(e.k<1?'Allumée, faible':'Allumée'):'Éteinte';
  function manip(panel,X){
    const N=E();
    N.atelier(panel,X,{titre:'Atelier · deux lampes, deux montages',idObs:'e-obs',placeholder:'J’observe que les lampes…',
      intro:'Je choisis le montage et la lampe que je dévisse, puis j’observe L1 et L2 et je compare avec le schéma normalisé.',
      fiche:()=>window.FICHE_5E_ELE03,
      groupes:[{legende:'Montage des lampes',nom:'e-m',items:N.MODES,def:'serie'},{legende:'Lampe dévissée',nom:'e-d',items:N.DEVISSEE,def:'aucune'}],
      rendre:v=>{const m=N.montage3(v['e-m'],v['e-d']);
        return {montage:m.montage,schema:m.schema,lecture:MODE[v['e-m']]+' : '+m.etat.txt,
          essai:{m:v['e-m'],d:v['e-d'],l1:m.etat.L1.on,l2:m.etat.L2.on,k:m.etat.L1.k,t1:ETAT(m.etat.L1),t2:ETAT(m.etat.L2)}};}});
  }
  window.FICHE_5E_ELE03={
    id:'NL-5E-ELE-03',version:'0.9',modele:'serie-derivation-v1',
    titre:'Associer des lampes : série ou dérivation ?',niveau:'5e',
    theme:'Électricité',chapitre:'Association de lampes électriques',
    competenceVisee:'Distinguer un montage en série d’un montage en dérivation à partir du comportement des lampes.',
    objectifsPedagogiques:['Reconnaître un montage en série et un montage en dérivation','Prévoir l’effet d’une lampe dévissée dans chaque montage','Choisir le montage adapté à un besoin'],
    situationEvaluation:'Dans la maison d’Awa, si l’ampoule du salon grille, celle de la chambre doit rester allumée. Quel montage faut-il utiliser ? Justifie avec tes essais.',
    objectif:'Choisir entre série et dérivation selon le besoin.',
    objectifEleve:'Savoir distinguer un montage en série d’un montage en dérivation.',
    situation:'Awa veut éclairer deux pièces avec deux lampes et une seule pile. Elle voudrait que, si une lampe est dévissée, l’autre reste allumée. Quel montage choisir ?',
    materiel:'Pile plate fictive de 4,5 V, deux lampes identiques, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis le montage où l’autre lampe reste allumée quand on dévisse une lampe. Justifie ton hypothèse avec « car ».',choix:[
      ['derivation','Le montage en dérivation : l’autre lampe reste allumée'],['serie','Le montage en série : l’autre lampe reste allumée'],['les2','Les deux montages conviennent'],['aucun','Aucun des deux montages ne convient']]},
    protocole:['Observer les deux lampes en série, toutes vissées.','Dévisser L1, puis L2, et observer.','Refaire les mêmes essais en dérivation.','Comparer l’éclat des lampes dans chaque montage.'],
    variable:'Le montage (série ou dérivation), puis la lampe dévissée',maintenu:'La pile et les deux lampes identiques',
    colonnes:['Montage','Dévissée','L1','L2','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.map(e=>[MODE[e.m],DEV[e.d],e.t1,e.t2,e.observation||'—']),
    resume:e=>MODE[e.m].toLowerCase()+', lampe dévissée : '+DEV[e.d].toLowerCase()+' → L1 '+e.t1.toLowerCase()+', L2 '+e.t2.toLowerCase(),
    confrontation:'1. En série, que se passe-t-il quand on dévisse une lampe ? 2. En dérivation ? 3. Compare l’éclat des lampes dans les deux montages. Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai en série et un essai en dérivation avec une lampe dévissée.',
    transfert:{q:'Dans la maison d’Awa (220 V), les appareils sont branchés :',rep:'derivation',options:[['serie','en série'],['derivation','en dérivation'],['aucun','ni en série ni en dérivation']],expl:'Les appareils d’une maison sont en dérivation : chacun fonctionne indépendamment des autres.'},
    critere:'Distinguer série et dérivation en s’appuyant sur ce que devient chaque lampe.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas les deux montages.'],['MF','Décrit les essais sans lien avec la boucle.'],['MS','Conclut : en série une seule boucle, en dérivation plusieurs boucles.'],['TBM','Conclut, compare l’éclat et applique à une installation.']],
    peutConfronter:st=>{const v=E().valides(st);return ['serie','derivation'].every(m=>v.some(e=>e.m===m&&e.d==='aucune')&&v.some(e=>e.m===m&&e.d!=='aucune'));},
    aides:['Combien de boucles forment le générateur et les lampes ?','Compare ce qui arrive à L2 quand on dévisse L1 dans chaque montage.','As-tu essayé les deux montages avec une lampe dévissée ?'],
    synthese:'Des lampes sont en série quand elles forment avec le générateur une seule boucle : elles brillent moins qu’une lampe seule et, si l’une est dévissée, toutes s’éteignent. Des lampes sont en dérivation quand elles forment plusieurs boucles avec le générateur : chacune brille normalement et fonctionne indépendamment des autres. Dans une maison, les appareils sont en dérivation.',
    prof:{reference:'Série, aucune dévissée : L1 et L2 allumées faiblement. Série, une dévissée : les deux éteintes. Dérivation, aucune dévissée : les deux normales. Dérivation, une dévissée : l’autre reste normale.',attendus:['Hypothèse notée avant les essais.','Les quatre cas testés.','Phrase : en dérivation, chaque lampe fonctionne indépendamment.'],erreurs:['Croire que l’autre lampe reste allumée en série.','Penser que la dérivation fait briller les lampes plus fort que la pile ne le permet.','Confondre le nombre de lampes et le nombre de boucles.']},
    diagnostic:st=>E().valides(st).some(e=>e.m==='derivation')?['Compare les deux montages : que devient L2 quand on dévisse L1 ?']:['Passe au montage en dérivation et dévisse une lampe.']
  };
})();
