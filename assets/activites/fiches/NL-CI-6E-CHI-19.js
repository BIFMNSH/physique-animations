/* NohobaLab · 6e Côte d'Ivoire · CHI-19 · Lire les pictogrammes de danger et de sécurité.
   Neuf pictogrammes GHS et quatre signaux de sécurité : sens, puis type. Pas d'expérience. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const SENS=()=>C().PICTOS.map(p=>[p.id,p.nom]);
  function manip(panel,X){
    const s=C().PICTOS.map(p=>({id:p.id,label:'Vu sur : '+p.ou,svg:C().vuePicto(p.id),juste:p.id,pourquoi:p.nom+' : '+p.alt.toLowerCase()+'.',aide:'Losange à bord rouge : danger du produit ; panneau de sécurité : consigne ou équipement.'}));
    M().tri(panel,X,{id:'sens',titre:'Les pictogrammes · que veulent-ils dire ?',intro:'Je lis les pictogrammes GHS et les signaux de sécurité représentés en SVG.',legende:'Ce pictogramme signifie',cats:SENS(),items:s});
    const t=C().PICTOS.map(p=>({id:'t_'+p.id,label:p.nom,svg:C().vuePicto(p.id),juste:p.type,pourquoi:p.type==='danger'?'Le losange rouge signale un danger associé au produit.':'Le panneau indique une consigne ou un équipement de sécurité.',aide:'Danger associé au produit, ou signal de sécurité ?'}));
    M().tri(panel,X,{id:'types',titre:'Je classe · danger du produit ou signal de sécurité ?',intro:'Je distingue les neuf pictogrammes de danger GHS des quatre signaux de sécurité.',legende:'Ce pictogramme',cats:C().TYPES_PICTO,items:t,impression:{titre:'Ma planche de pictogrammes'}});
  }
  window.FICHE_CI_CHI19={
    id:'NL-CI-6E-CHI-19',version:'1.0',modele:'pictogrammes-produits-securite-v2',
    titre:'Lire les pictogrammes',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Interpréter les pictogrammes GHS et les signaux de sécurité courants.',
    objectifsPedagogiques:['Reconnaître les neuf pictogrammes GHS et leur danger','Reconnaître les signaux de sécurité : extincteur, sortie de secours, flamme nue interdite et appel d’urgence','Distinguer un danger associé à un produit d’un signal de sécurité'],
    situationEvaluation:'Sur le bidon d’alcool à brûler acheté au marché, Awa voit un losange rouge avec une flamme. Que signifie-t-il ? Quelles précautions en déduit-elle pour le ranger ?',
    objectif:'Lire les pictogrammes de danger et les signaux de sécurité.',objectifEleve:'Reconnaître un danger sur une étiquette et un signal de sécurité dans un lieu.',
    situation:'Sur un bidon d’alcool à brûler, Awa voit un losange rouge avec une flamme. Au collège, elle remarque aussi des panneaux de sécurité. Que signifient ces images ?',
    materiel:'Simulation : neuf pictogrammes GHS et quatre signaux de sécurité dessinés en SVG.',
    prevision:{consigne:'Avant le classement, choisis ce que tu penses de ces dessins. Justifie ton hypothèse.',choix:[['deco','C’est une décoration'],['prix','Ils indiquent le prix'],['pictos','Ce sont des pictogrammes : danger du produit ou consigne de sécurité'],['chaud','Ils signalent que le produit est chaud']]},
    protocole:['Observer les pictogrammes simulés et les lieux où ils peuvent être affichés.','Choisir une signification et valider.','Classer chaque image : danger associé au produit ou signal de sécurité.','Dans la classe, repérer un panneau depuis sa place, sans toucher ni manipuler de produit.'],
    variable:'Le pictogramme',maintenu:'Les mêmes formes normalisées',
    colonnes:['Pictogramme','Ma réponse','Résultat'],lignesVides:13,
    lignes:st=>M().lignesTri(st,'sens',i=>C().picto(i).nom,c=>lib(SENS(),c)).concat(M().lignesTri(st,'types',i=>'Type : '+C().picto(i.slice(2)).nom,c=>lib(C().TYPES_PICTO,c))),
    resume:e=>e.tri==='sens'?'pictogramme lu : '+lib(SENS(),e.choix).toLowerCase():'type : '+lib(C().TYPES_PICTO,e.choix).toLowerCase(),
    confrontation:'1. Quelle forme ont les pictogrammes de danger ? et ceux de consigne ? 2. Quel pictogramme trouve-t-on sur la bouteille de gaz ? sur l’alcool à brûler ? 3. Que faire quand on voit « flamme nue interdite » ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un pictogramme de danger et un pictogramme de consigne, avec leur sens.',
    transfert:{q:'Un produit qui porte le pictogramme « comburant » brûle-t-il tout seul ?',rep:'non',expl:'Non : un comburant ne brûle pas lui-même, mais il rend une combustion plus vive et plus dangereuse. On le range loin des combustibles et des flammes.'},
    critere:'Interpréter les neuf pictogrammes GHS et les distinguer des quatre signaux de sécurité.',
    essaisMin:26,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne distingue pas encore les deux catégories.'],['MF','Reconnaît quelques pictogrammes de danger.'],['MS','Interprète les neuf pictogrammes GHS.'],['TBM','Interprète les pictogrammes et distingue les signaux de sécurité.']],
    peutConfronter:st=>M().triEtat(st,'sens',C().PICTOS.map(p=>p.id)).repondus>=13&&M().triEtat(st,'types',C().PICTOS.map(p=>'t_'+p.id)).repondus>=13,
    aides:['Les neuf pictogrammes GHS sont des losanges à bord rouge associés à des produits.','Les panneaux d’équipement et d’évacuation donnent des indications de sécurité.','Observer les étiquettes sans toucher ni ouvrir un produit.'],
    synthese:'Les neuf pictogrammes GHS dans un losange rouge signalent des dangers associés à un produit : inflammable, comburant, explosif, gaz sous pression, corrosif, toxicité aiguë, nocif ou irritant, danger grave pour la santé, danger pour l’environnement. Les panneaux de sécurité indiquent notamment un extincteur, une sortie, une interdiction de flamme nue ou un moyen d’appel. On observe les étiquettes sans manipuler les produits.',
    prof:{reference:'Les neuf pictogrammes GHS sont représentés par des dessins SVG réalisés pour cette activité, d’après les pictogrammes normalisés fournis en référence par le propriétaire ; aucune photographie ni image de manuel n’est reproduite. Les quatre signaux de sécurité sont également dessinés en SVG. Aucun numéro d’urgence n’est affiché.',attendus:['Neuf significations de pictogrammes GHS trouvées.','Neuf pictogrammes GHS distingués des quatre signaux de sécurité.','Observation sans manipulation de produit.'],erreurs:['Confondre inflammable et comburant.','Classer l’extincteur en danger associé au produit.','Confondre danger toxique et danger grave pour la santé.']},
    diagnostic:st=>st.essais.length?['Indicatif : compare la forme des losanges et des carrés.']:['Commence par le pictogramme de la bouteille de gaz.']
  };
})();
