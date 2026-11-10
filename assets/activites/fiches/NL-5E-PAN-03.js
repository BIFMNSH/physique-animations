/* NohobaLab · 5e · PAN-03 · Choisir un montage en série ou en dérivation selon un besoin (modèle NohobaPannes5e.convient et .panne). */
(function(){
  'use strict';
  const P=()=>window.NohobaPannes5e,E=()=>window.NohobaElec5e;
  const mode=m=>m==='serie'?'En série':'En dérivation',besoin=b=>P().BESOINS.filter(x=>x[0]===b)[0][1];
  function manip(panel,X){const p=P();
    E().atelier(panel,X,{titre:'Atelier · quel montage pour quel besoin ?',idObs:'e-obs',placeholder:'J’observe que ce montage…',
      intro:'Je choisis un besoin, puis un montage. Je teste le montage avec ou sans lampe en panne et je vérifie si le besoin est respecté.',fiche:()=>window.FICHE_5E_PAN03,
      groupes:[{legende:'Besoin',nom:'e-b',items:p.BESOINS,def:'independantes'},{legende:'Montage des deux lampes',nom:'e-m',items:p.MODES,def:'serie'},{legende:'Test : lampe en panne',nom:'e-c',items:[['aucune','Aucune'],['L1','L1']],def:'aucune'}],
      rendre:v=>{const r=p.vuePanne(v['e-m'],v['e-c']),ok=p.convient(v['e-b'],v['e-m']);
        return {montage:r.montage,schema:r.schema,lecture:r.etat.txt+' Ce montage '+(ok?'respecte':'ne respecte pas')+' le besoin choisi.',essai:{besoin:v['e-b'],mode:v['e-m'],cible:v['e-c'],ok:ok}};}});}
  const val=st=>E().valides(st);
  window.FICHE_5E_PAN03={
    id:'NL-5E-PAN-03',version:'0.9',modele:'choix-montage-v1',
    titre:'Série ou dérivation : quel montage choisir ?',niveau:'5e',theme:'Électricité',chapitre:'Association de lampes électriques',
    competenceVisee:'Choisir un montage en série ou en dérivation selon un besoin.',
    objectifsPedagogiques:['Lire un besoin','Tester un montage en série ou en dérivation','Justifier le choix du montage'],
    situationEvaluation:'Le papa d’Awa installe deux lampes dans sa boutique à Adjamé. Il veut que chaque lampe brille normalement et qu’une panne n’éteigne pas l’autre. Quel montage doit-il choisir ? Justifie.',
    objectif:'Trouver le montage qui respecte chaque besoin.',
    objectifEleve:'Savoir choisir entre série et dérivation.',
    situation:'Kofi aide son oncle électricien à Yopougon. Trois clients ont chacun un besoin différent pour leurs deux lampes. L’oncle demande à Kofi : « Pour chacun, je les monte en série ou en dérivation ? »',
    materiel:'Pile plate fictive de 4,5 V, deux lampes identiques sur support, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis le montage pour des lampes qui doivent rester indépendantes et briller normalement. Justifie avec « car ».',choix:[
      ['derivation','En dérivation'],['serie','En série'],['egal','L’un ou l’autre, cela ne change rien'],['aucun','Aucun des deux ne convient']]},
    protocole:['Choisir le premier besoin et tester le montage en série, sans panne puis avec L1 en panne.','Changer un seul élément : passer au montage en dérivation et refaire les tests.','Recommencer pour un autre besoin.','Écrire une observation après chaque essai.'],
    variable:'Le montage',maintenu:'Le besoin étudié, la pile et les deux lampes',
    colonnes:['Besoin','Montage','Lampe en panne','Besoin respecté ?','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[besoin(e.besoin),mode(e.mode),e.cible==='aucune'?'Aucune':e.cible,e.ok?'Oui':'Non',e.observation||'—']),
    resume:e=>mode(e.mode)+' : besoin '+(e.ok?'respecté':'non respecté'),
    confrontation:'1. Quel montage garde les lampes indépendantes ? 2. Quel montage donne un éclat normal ? 3. Dans quel cas le montage en série est-il utile ? Compare ensuite à ton hypothèse.',
    retroaction:'Pour un besoin, cite le montage qui convient et l’essai qui le prouve.',
    transfert:{q:'Dans la boutique, chaque lampe doit briller normalement et une panne ne doit pas éteindre l’autre. Quel montage choisir ?',rep:'derivation',options:[['serie','En série'],['derivation','En dérivation'],['egal','L’un ou l’autre'],['aucun','Aucun des deux']],expl:'En dérivation, chaque lampe reçoit la tension du générateur et forme sa propre boucle : éclat normal et lampes indépendantes.'},
    critere:'Associer chaque besoin au montage qui convient et le justifier par un essai.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Teste un montage sans le relier au besoin.'],['MF','Trouve le montage pour un besoin sans justifier.'],['MS','Choisit le bon montage pour deux besoins.'],['TBM','Choisit le bon montage pour chaque besoin et justifie par un essai.']],
    peutConfronter:st=>{const v=val(st);return P().BESOINS.filter(b=>['serie','derivation'].every(m=>v.some(e=>e.besoin===b[0]&&e.mode===m))).length>=2;},
    aides:['Lis le besoin : que doit faire l’autre lampe quand une lampe est en panne ?','Teste les deux montages pour le même besoin.','Compare l’éclat des lampes dans les deux montages, sans panne.'],
    synthese:'On choisit le montage selon le besoin. En dérivation, les lampes brillent normalement et restent indépendantes : c’est le montage des lampes de la maison. En série, les lampes brillent moins et une seule panne éteint tout : ce montage sert quand tout doit s’arrêter ensemble.',
    prof:{reference:'Lampes indépendantes : dérivation. Éclat normal : dérivation. L’autre lampe s’éteint pour signaler la panne : série.',attendus:['Hypothèse notée avant les essais.','Les deux montages testés pour un même besoin.','Choix justifié par un essai.'],erreurs:['Choisir sans tester avec une lampe en panne.','Confondre l’éclat faible en série avec une panne.','Répondre « dérivation » pour tous les besoins sans lire.']},
    diagnostic:st=>val(st).some(e=>e.besoin==='temoin')?['Pour le besoin « signaler la panne », quel montage convient ?']:['Essaie le troisième besoin : l’autre lampe doit s’éteindre pour signaler la panne.']
  };
})();
