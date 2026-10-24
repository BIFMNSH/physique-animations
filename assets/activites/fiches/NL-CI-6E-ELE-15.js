/* NohobaLab · 6e Côte d'Ivoire · ELE-15 · Rôle du fusible et du disjoncteur.
   Modèle qualitatif : un fil entre les bornes de la lampe crée un court-circuit ; fusible et disjoncteur coupent le circuit. Aucun calibre chiffré. */
(function(){
  'use strict';
  const C=()=>window.NohobaCommande;
  const PR={aucune:'Aucune protection',fusible:'Un fusible',disj:'Un disjoncteur'};
  const SI={defaut:'Le fil est relié aux bornes de la lampe (défaut)',retire:'Je retire le fil, la protection reste coupée',remet:'Je retire le fil et je remets en service'};
  function manip(panel,X){
    C().bloc(panel,X,{n:15,titre:'Atelier · simulation : défaut avec et sans protection',
      intro:'Simulation qualitative : je choisis la protection, puis la situation. J’observe la lampe, le circuit et l’échauffement. On ne remplace jamais un fusible par un fil.',
      controles:[{cle:'p',legende:'Dans le circuit, il y a…',items:[['aucune',PR.aucune],['fusible',PR.fusible],['disj',PR.disj]]},{cle:'s',legende:'Situation',items:[['defaut',SI.defaut],['retire',SI.retire],['remet',SI.remet]]}],
      saisie:'J’observe que le circuit… et que l’échauffement…',legendeTable:'Mes essais : protection, situation et résultat.',
      F:()=>window.FICHE_CI_ELE15,
      render:v=>{const o=C().optsProtection(v.p,v.s==='defaut'?'maintenu':v.s),m=C().boucle(o),e=m.etat,coupe=!!e.protection;
        const res=e.courtCircuit?'court-circuit, échauffement fort':coupe?'la protection a coupé le circuit, échauffement évité':(e.lampe==='actif'?'la lampe brille':'la lampe est éteinte, le circuit est ouvert');
        return {montage:m.montage,schema:m.schema,txt:PR[v.p]+' · '+SI[v.s].toLowerCase()+' : '+res+'.',essai:{prot:v.p,sit:v.s,court:e.courtCircuit,coupe:coupe,allumee:e.lampe==='actif'}};}});
  }
  const RES=e=>e.court?'Court-circuit non coupé : échauffement fort':e.coupe?'Circuit coupé par la protection':e.allumee?'Circuit rétabli : la lampe brille':'Circuit ouvert : la lampe est éteinte';
  window.FICHE_CI_ELE15={
    id:'NL-CI-6E-ELE-15',version:'0.9',modele:'fusible-disjoncteur-qualitatif-v1',
    titre:'Découvrir le rôle du fusible et du disjoncteur dans une installation électrique domestique',niveau:'6e',
    theme:'Électricité',chapitre:'Court-circuit et protection',
    competenceVisee:'Expliquer que le fusible et le disjoncteur coupent le circuit en cas de courant trop grand.',
    objectifsPedagogiques:['Placer un fusible dans un circuit','Décrire ce que fait un fusible puis un disjoncteur','Dire pourquoi on ne remplace jamais un fusible par un fil'],
    situationEvaluation:'Dans le tableau de la maison de Kofi, un élément « saute » au lieu de laisser le fil chauffer. À quoi sert-il, et pourquoi ne faut-il pas le remplacer par un fil ?',
    objectif:'Expliquer le rôle du fusible et du disjoncteur.',
    objectifEleve:'Savoir à quoi servent le fusible et le disjoncteur.',
    situation:'Dans le tableau de la maison de Kofi, un élément « saute » quand il y a un problème. Kofi veut savoir à quoi il sert et pourquoi on ne le remplace pas par un simple fil.',
    materiel:'Pile plate fictive de 4,5 V, lampe, fusible, disjoncteur, fil de connexion, simulation. Aucune intervention sur une installation réelle : elle relève d’un électricien agréé (CIE).',
    prevision:{consigne:'Avant les essais, choisis ce que devient le circuit quand un court-circuit apparaît avec un fusible. Justifie ton hypothèse.',choix:[['coupe','Le fusible coupe le circuit et le fil ne chauffe plus'],['chauffe','Le fusible n’empêche pas le fil de chauffer'],['plus','Le fusible fait briller la lampe plus fort'],['rien','Le fusible n’a aucun effet']]},
    protocole:['Provoquer un défaut sans protection et observer.','Refaire le défaut avec un fusible, puis avec un disjoncteur.','Retirer le fil et remettre en service chaque protection.','Noter ce qui change et ce qui doit être remplacé ou réarmé.'],
    variable:'La protection placée dans le circuit',maintenu:'Pile, lampe et défaut',
    colonnes:['Protection','Situation','Résultat','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[PR[e.prot],SI[e.sit],RES(e),e.observation||'—']),
    resume:e=>PR[e.prot].toLowerCase()+' · '+SI[e.sit].toLowerCase()+' : '+RES(e).toLowerCase(),
    confrontation:'1. Que se passe-t-il sans protection quand un fil relie les bornes de la lampe ? 2. Avec un fusible ? 3. Avec un disjoncteur ? 4. Que faut-il faire après coup avec chacun ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai sans protection et un essai avec protection, avec ce que tu as observé.',
    transfert:{q:'Le fusible d’un circuit a fondu. Peut-on le remplacer par un simple fil pour que « ça marche » ?',rep:'non',expl:'Non : un fil ne fond pas et ne coupe pas le circuit. Le fil chaufferait et pourrait provoquer un incendie. On remplace le fusible par un fusible identique et on cherche d’abord la cause du problème.'},
    critere:'Expliquer ce que font fusible et disjoncteur et pourquoi on ne remplace jamais un fusible par un fil.',
    essaisMin:5,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas avec et sans protection.'],['MF','Décrit un dispositif sans le comparer à l’autre.'],['MS','Explique que fusible et disjoncteur coupent le circuit.'],['TBM','Compare les deux, explique remplacement ou réarmement et le danger du fil.']],
    peutConfronter:st=>{const v=C().valides(st);return v.length>=5&&['aucune','fusible','disj'].every(p=>v.some(e=>e.prot===p&&e.sit==='defaut'))&&v.some(e=>e.prot==='fusible'&&e.sit==='retire')&&v.some(e=>e.prot==='disj'&&e.sit==='remet');},
    aides:['Compare le défaut sans protection et avec une protection.','Que devient le fusible après le défaut ? et le disjoncteur ?','Un fusible fondu se remplace ; un disjoncteur déclenché se réarme.'],
    synthese:'Quand un courant trop grand apparaît, le fusible fond et coupe le circuit : il faut alors le remplacer. Le disjoncteur se déclenche et coupe aussi le circuit ; on peut le réarmer après avoir supprimé la cause. Tous deux évitent que les fils chauffent. On ne remplace jamais un fusible par un fil.',
    prof:{reference:'Sans protection : court-circuit, échauffement fort. Avec fusible ou disjoncteur : le circuit est coupé automatiquement. Fusible : filament fondu, à remplacer. Disjoncteur : déclenché, à réarmer. Modèle qualitatif, sans calibre ni mécanisme interne.',attendus:['Hypothèse notée avant l’essai.','Trois protections testées avec défaut.','Remplacement et réarmement distingués.','Message : jamais un fil à la place du fusible.'],erreurs:['Croire que le fusible empêche le court-circuit de se produire.','Remplacer un fusible par un fil.','Oublier de chercher la cause avant de remettre en service.']},
    diagnostic:st=>st.essais.some(e=>e.prot==='disj')?['Compare le disjoncteur et le fusible après le défaut.']:['Teste aussi le disjoncteur.']
  };
})();
