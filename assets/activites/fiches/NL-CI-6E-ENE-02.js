/* NohobaLab · 6e Côte d'Ivoire · ENE-02 · Reconnaître des formes d'énergie. « Pour aller plus loin », hors programme officiel.
   Modèle qualitatif : cinq formes d'énergie (électrique, lumineuse, thermique, de mouvement, chimique) ; un appareil reçoit une forme et en donne une autre. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,NE=()=>window.NohobaEnergie;
  const APP=[['ventilo','Un ventilateur sur pile'],['torche','Une lampe torche'],['chargeur','Un chargeur solaire'],['bouilloire','Une bouilloire électrique'],['pile','Une pile neuve']];
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const CATS=()=>window.NohobaEnergie.FORMES;
  const SIT=[
    ['s1','Une pile neuve dans sa boîte','chimique','La pile garde de l’énergie sous forme chimique, prête à servir.'],
    ['s2','Le Soleil qui éclaire une cellule solaire','lumineuse','La lumière du Soleil transporte de l’énergie lumineuse.'],
    ['s3','Le courant qui circule dans les fils d’une lampe','electrique','Le courant transfère de l’énergie électrique.'],
    ['s4','L’eau d’une bouilloire qui chauffe','thermique','L’eau chaude a reçu de la chaleur : énergie thermique.'],
    ['s5','Les pales d’un ventilateur qui tournent','mouvement','Ce qui tourne ou se déplace possède de l’énergie de mouvement.'],
    ['s6','La lumière d’une lampe allumée','lumineuse','La lumière est une forme d’énergie : énergie lumineuse.']];
  function manip(panel,X){
    M().bloc(panel,X,{n:1,titre:'Atelier · je regarde ce que reçoit et ce que donne un appareil',
      intro:'Je choisis un appareil, je regarde son dessin et le schéma « forme reçue → forme obtenue », puis j’écris ce que je comprends. Simulation uniquement.',
      controles:[{cle:'a',legende:'L’appareil',items:APP}],
      saisie:'J’observe que l’appareil reçoit… et donne…',legendeTable:'Mes essais : appareil, forme reçue et forme obtenue.',F:()=>window.FICHE_CI_ENE02,
      render:v=>{const c=NE().convertit(v.a),sc=NE().sceneAppareil(v.a);return {montage:sc.montage,schema:sc.schema,txt:c.txt,essai:{app:v.a,recoit:c.recoit,obtient:c.obtient}};}});
    const items=SIT.map(s=>({id:s[0],label:s[1],juste:s[2],pourquoi:s[3],aide:'Demande-toi : de quoi s’agit-il ? de lumière, de chaleur, de mouvement, de courant ou d’énergie stockée dans la pile ?'}));
    M().tri(panel,X,{id:'formes',titre:'Je nomme la forme d’énergie',intro:'Dans chaque situation, une forme d’énergie est présente. Laquelle ?',legende:'La forme d’énergie est',cats:CATS(),items});
  }
  window.FICHE_CI_ENE02={
    id:'NL-CI-6E-ENE-02',version:'0.9',modele:'formes-energie-qualitatif-v1',
    titre:'Reconnaître des formes d’énergie',niveau:'6e',
    theme:'Énergie',chapitre:'L’énergie du circuit',
    competenceVisee:'Nommer la forme d’énergie présente dans une situation.',
    objectifsPedagogiques:['Nommer cinq formes d’énergie : électrique, lumineuse, thermique, de mouvement, chimique','Dire qu’un appareil reçoit une forme d’énergie et en donne une autre','Retrouver une même forme d’énergie dans des objets différents'],
    situationEvaluation:'Awa dit : « dans une lampe torche, il n’y a que de la lumière ». Nomme les formes d’énergie présentes dans la pile, dans les fils et dans la lampe allumée.',
    objectif:'Nommer les formes d’énergie dans des appareils du quotidien.',objectifEleve:'Savoir dire quelle forme d’énergie est présente.',
    situation:'Kofi regarde un ventilateur sur pile, une lampe torche, un chargeur solaire, une bouilloire et une pile. Il se demande quelles formes d’énergie sont présentes dans chacun.',
    materiel:'Simulation : cinq appareils ; cartes de six situations à classer.',
    prevision:{consigne:'Avant les essais, choisis ce que reçoit un ventilateur sur pile et ce qu’il donne. Justifie ton hypothèse.',choix:[['elec_mvt','Il reçoit de l’énergie électrique et donne de l’énergie de mouvement'],['mvt_elec','Il reçoit de l’énergie de mouvement et donne de l’énergie électrique'],['lum_chal','Il reçoit de la lumière et donne de la chaleur'],['rien','Il ne reçoit rien : il tourne tout seul']]},
    protocole:['Choisir un appareil et lire ce qu’il reçoit et ce qu’il donne.','Noter la forme d’énergie reçue et la forme d’énergie obtenue.','Refaire avec les autres appareils.','Nommer la forme d’énergie dans six situations.'],
    variable:'L’appareil',maintenu:'La façon de lire le schéma (forme reçue → forme obtenue)',
    colonnes:['Appareil','Forme reçue','Forme obtenue','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(APP,e.app),lib(NE().FORMES,e.recoit),lib(NE().FORMES,e.obtient),e.observation||'—']).concat(M().lignesTri(st,'formes',i=>SIT.filter(s=>s[0]===i)[0][1],c=>lib(NE().FORMES,c)).map(r=>[r[0],'Classement',r[1],r[2]])),
    resume:e=>e.tri?'situation classée : '+lib(NE().FORMES,e.choix).toLowerCase():lib(APP,e.app).toLowerCase()+' : '+lib(NE().FORMES,e.recoit).toLowerCase()+' → '+lib(NE().FORMES,e.obtient).toLowerCase(),
    confrontation:'1. Quelle forme reçoit le ventilateur ? Quelle forme donne-t-il ? 2. Quelle forme donne le chargeur solaire ? 3. Trouve-tu la même forme d’énergie dans deux appareils différents ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un appareil, la forme reçue et la forme obtenue.',
    transfert:{q:'Une pile neuve contient-elle de l’énergie électrique toute prête qui circule déjà quand elle est dans sa boîte ?',rep:'non',expl:'Non : dans la boîte, la pile garde de l’énergie sous forme chimique. Elle donne de l’énergie électrique seulement quand elle est branchée dans un circuit fermé.'},
    critere:'Nommer la forme d’énergie de chaque situation et la forme reçue / obtenue de deux appareils.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Parle d’énergie sans donner de forme.'],['MF','Nomme une forme pour un seul appareil.'],['MS','Nomme les formes reçue et obtenue pour plusieurs appareils.'],['TBM','Nomme, classe six situations et explique le cas de la pile.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>!e.tri),e=M().triEtat(st,'formes',SIT.map(s=>s[0]));return v.length>=3&&M().distincts(v,'obtient')>=3&&e.repondus>=6;},
    aides:['Un appareil reçoit une forme d’énergie et en donne une autre.','Cherche : lumière, chaleur, mouvement, courant ou énergie stockée dans la pile.','La pile garde son énergie sous forme chimique tant qu’elle n’est pas branchée.'],
    synthese:'On reconnaît cinq formes d’énergie : électrique (courant), lumineuse (lumière), thermique (chaleur), de mouvement (ce qui bouge) et chimique (stockée dans la pile). Un appareil reçoit une forme d’énergie et en donne une autre.',
    prof:{reference:'Ventilateur : électrique → mouvement. Lampe torche : électrique → lumineuse (la pile fournit l’énergie chimique). Chargeur solaire : lumineuse → électrique. Bouilloire : électrique → thermique. Pile : chimique → électrique.',attendus:['Nommer la forme reçue et la forme obtenue pour chaque appareil.','Classer les six situations.'],erreurs:['Dire que la pile « contient du courant ».','Confondre chaleur (énergie thermique) et température.']},
    diagnostic:st=>st.essais.length?['Indicatif : teste au moins trois appareils différents.']:['Fais un premier essai.']
  };
})();
