/* NohobaLab · 6e Côte d'Ivoire · CHI-19 · Identifier quelques pictogrammes liés aux incendies.
   Huit pictogrammes redessinés (quatre dangers, quatre consignes) : sens, puis type. Pas d'expérience. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const SENS=()=>C().PICTOS.map(p=>[p.id,p.nom]);
  function manip(panel,X){
    const s=C().PICTOS.map(p=>({id:p.id,label:'Vu sur : '+p.ou,svg:C().vuePicto(p.id),juste:p.id,pourquoi:p.nom+' : '+p.alt.toLowerCase()+'.',aide:'Regarde la forme et la couleur : losange rouge = danger ; carré rouge, rectangle vert ou cercle barré = consigne.'}));
    M().tri(panel,X,{id:'sens',titre:'Les pictogrammes · que veulent-ils dire ?',intro:'Pour chaque pictogramme (dessin original), je choisis sa signification dans la liste.',legende:'Ce pictogramme signifie',cats:SENS(),items:s});
    const t=C().PICTOS.map(p=>({id:'t_'+p.id,label:p.nom,svg:C().vuePicto(p.id),juste:p.type,pourquoi:p.type==='danger'?'Losange à bord rouge : il signale un danger du produit.':'Il indique une consigne ou un équipement de sécurité.',aide:'Danger du produit, ou consigne pour les personnes ?'}));
    M().tri(panel,X,{id:'types',titre:'Je classe · danger ou consigne ?',intro:'Je sépare les pictogrammes de danger des pictogrammes de consigne.',legende:'Ce pictogramme',cats:C().TYPES_PICTO,items:t,impression:{titre:'Ma planche de pictogrammes'}});
  }
  window.FICHE_CI_CHI19={
    id:'NL-CI-6E-CHI-19',version:'0.9',modele:'pictogrammes-incendie-v1',
    titre:'Lire les pictogrammes',niveau:'6e',theme:'Air et combustions',chapitre:'Dangers des combustions',
    competenceVisee:'Identifier quelques pictogrammes liés aux incendies et dire ce qu’ils signifient.',
    objectifsPedagogiques:['Reconnaître quatre pictogrammes de danger : inflammable, comburant, explosif, gaz sous pression','Reconnaître quatre pictogrammes de consigne : extincteur, sortie de secours, flamme nue interdite, appel d’urgence','Distinguer un pictogramme de danger d’un pictogramme de consigne'],
    situationEvaluation:'Sur le bidon d’alcool à brûler acheté au marché, Awa voit un losange rouge avec une flamme. Que signifie-t-il ? Quelles précautions en déduit-elle pour le ranger ?',
    objectif:'Lire les pictogrammes liés aux incendies.',objectifEleve:'Savoir lire un pictogramme avant d’utiliser ou de ranger un produit.',
    situation:'Sur la bouteille de gaz et sur le bidon d’alcool à brûler, Awa voit des losanges rouges avec une flamme. Dans le couloir du collège, des panneaux verts et rouges. Que veulent-ils dire ?',
    materiel:'Simulation : huit pictogrammes redessinés, objets et lieux où on les trouve.',
    prevision:{consigne:'Avant le classement, choisis ce que tu penses de ces dessins. Justifie ton hypothèse.',choix:[['deco','C’est une décoration'],['prix','Ils indiquent le prix'],['pictos','Ce sont des pictogrammes : danger du produit ou consigne de sécurité'],['chaud','Ils signalent que le produit est chaud']]},
    protocole:['Observer chaque pictogramme et l’objet ou le lieu où on le voit.','Choisir sa signification et valider.','Classer chaque pictogramme : danger ou consigne.','Chercher un pictogramme sur un objet de la classe ou de la maison (observation seulement).'],
    variable:'Le pictogramme',maintenu:'Les mêmes formes normalisées',
    colonnes:['Pictogramme','Ma réponse','Résultat'],lignesVides:8,
    lignes:st=>M().lignesTri(st,'sens',i=>C().picto(i).nom,c=>lib(SENS(),c)).concat(M().lignesTri(st,'types',i=>'Type : '+C().picto(i.slice(2)).nom,c=>lib(C().TYPES_PICTO,c))),
    resume:e=>e.tri==='sens'?'pictogramme lu : '+lib(SENS(),e.choix).toLowerCase():'type : '+lib(C().TYPES_PICTO,e.choix).toLowerCase(),
    confrontation:'1. Quelle forme ont les pictogrammes de danger ? et ceux de consigne ? 2. Quel pictogramme trouve-t-on sur la bouteille de gaz ? sur l’alcool à brûler ? 3. Que faire quand on voit « flamme nue interdite » ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un pictogramme de danger et un pictogramme de consigne, avec leur sens.',
    transfert:{q:'Un produit qui porte le pictogramme « comburant » brûle-t-il tout seul ?',rep:'non',expl:'Non : un comburant ne brûle pas lui-même, mais il rend une combustion plus vive et plus dangereuse. On le range loin des combustibles et des flammes.'},
    critere:'Identifier les huit pictogrammes et les classer en danger ou consigne.',
    essaisMin:16,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Prend les pictogrammes pour une décoration.'],['MF','Reconnaît « inflammable » seulement.'],['MS','Identifie les huit pictogrammes.'],['TBM','Les classe et en déduit une précaution.']],
    peutConfronter:st=>M().triEtat(st,'sens',C().PICTOS.map(p=>p.id)).repondus>=8&&M().triEtat(st,'types',C().PICTOS.map(p=>'t_'+p.id)).repondus>=8,
    aides:['Losange à bord rouge : danger du produit.','Carré rouge : équipement contre l’incendie ; rectangle vert : sortie de secours ; cercle rouge barré : interdiction.','Lire le pictogramme avant d’utiliser ou de ranger un produit.'],
    synthese:'Les pictogrammes de danger (losange à bord rouge) signalent un produit inflammable, comburant, explosif ou un gaz sous pression. Les pictogrammes de consigne indiquent l’extincteur (carré rouge), la sortie de secours (rectangle vert), l’interdiction de flamme nue (cercle barré) ou l’appel d’urgence. Lire le pictogramme avant d’utiliser ou de ranger un produit.',
    prof:{reference:'Dangers : inflammable (alcool, essence), comburant (bouteille d’oxygène), explosif (pétards), gaz sous pression (bouteille de butane). Consignes : extincteur, sortie de secours, flamme nue interdite, appel d’urgence. Dessins originaux reprenant les formes normalisées (décision du propriétaire).',attendus:['Huit significations trouvées.','Huit types classés.','Précaution déduite.'],erreurs:['Confondre inflammable et comburant.','Classer l’extincteur en danger.','Croire que « gaz sous pression » veut dire « gaz toxique ».']},
    diagnostic:st=>st.essais.length?['Indicatif : compare la forme des losanges et des carrés.']:['Commence par le pictogramme de la bouteille de gaz.']
  };
})();
