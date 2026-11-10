/* NohobaLab · 6e Côte d'Ivoire · CHI-11 · Identifier les produits de la combustion complète du butane.
   Modèle qualitatif : buée et eau de chaux sur la flamme bleue, avec témoins ; puis l'équation littérale du butane (transfert, décision du propriétaire). */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  const SLOTS=[['butane_g','Combustion complète du butane : à gauche de la flèche (ce qui est consommé)','gauche'],['butane_d','Combustion complète du butane : à droite de la flèche (ce qui se forme)','droite']];
  function manip(panel,X){
    const h=window.Activite.h,st=X.st();
    M().bloc(panel,X,{n:11,titre:'Atelier · les deux tests sur la flamme bleue',
      intro:'Le brûleur est allumé par le professeur, virole ouverte. Je choisis le test et la situation, le professeur fait le geste, je regarde puis j’écris ce que je vois.',
      controles:[{cle:'t',legende:'Le test',items:C().TESTS},{cle:'s',legende:'La situation',items:C().SITUATIONS_TEST}],
      saisie:'J’observe que…',legendeTable:'Mes essais : test, situation, résultat.',F:()=>window.FICHE_CI_CHI11,
      render:v=>{const r=C().test(v.t,v.s,'butane'),sc=C().sceneTest(v.t,v.s,'butane');return {montage:sc.montage,schema:sc.schema,txt:r.txt,essai:{t:v.t,s:v.s,positif:r.positif}};}});
    const lu=h('div',{class:'card'},panel);h('h3',{text:'L’équation littérale du butane'},lu);const p=h('p',{'aria-live':'polite',style:'font-size:18px;font-weight:700'},lu);
    function maj(){const S=(st.tri||{}).equation||{ok:{}};p.textContent=S.ok.butane_g&&S.ok.butane_d?C().equation('butane'):'Complète les deux côtés pour lire l’équation.';}
    const items=SLOTS.map(s=>({id:s[0],label:s[1],juste:C().EQUATIONS.butane[s[2]].slice().sort(),pourquoi:s[2]==='gauche'?'À gauche : le butane et le gaz oxygène, consommés.':'À droite : l’eau et le gaz carbonique, prouvés par les tests.',aide:'Comme pour l’alcool : combustible + gaz oxygène → corps prouvés par les tests.'}));
    M().tri(panel,X,{id:'equation',titre:'Transfert · j’écris l’équation du butane',intro:'Avec mes tests, je place les étiquettes de chaque côté de la flèche.',legende:'Je coche les étiquettes',cats:C().ETIQUETTES.filter(e=>e[0]!=='charbon'&&e[0]!=='alcool'&&e[0]!=='cendres'),items,multi:true,onChange:maj});
    maj();
  }
  const RES=e=>e.t==='buee'?(e.positif?'Buée : eau':'Verre sec'):(e.positif?'Trouble : gaz carbonique':'Claire');
  window.FICHE_CI_CHI11={
    id:'NL-CI-6E-CHI-11',version:'0.9',modele:'produits-butane-tests-v1',
    titre:'Ce que la flamme bleue fabrique',niveau:'6e',theme:'Air et combustions',chapitre:'Combustion d’un gaz dans l’air',
    competenceVisee:'Identifier les produits de la combustion complète du butane et écrire son équation littérale.',
    objectifsPedagogiques:['Mettre en évidence l’eau (buée) et le gaz carbonique (eau de chaux) formés par la flamme bleue','Utiliser les témoins','Écrire : butane + gaz oxygène → gaz carbonique + eau'],
    situationEvaluation:'Awa pose une casserole froide sur la gazinière : le fond se couvre de gouttelettes avant de chauffer. Explique d’où vient cette eau, puis écris l’équation littérale de la combustion.',
    objectif:'Identifier les produits de la combustion complète du butane.',objectifEleve:'Savoir prouver ce que forme la flamme bleue et l’écrire en équation.',
    situation:'La flamme bleue ne laisse rien de visible sur la soucoupe. Le butane disparaît-il sans rien former ? Kofi se souvient des tests faits avec l’alcool.',
    materiel:'Simulation : brûleur à butane allumé par le professeur, verre à pied froid, bocal, eau de chaux (professeur), témoins, étiquettes d’équation.',
    prevision:{consigne:'Avant les tests, choisis ce que forme la flamme bleue. Justifie ton hypothèse.',choix:[['rien','Rien du tout : le butane disparaît'],['eauSeule','De l’eau seulement'],['suie','De la suie'],['eauCO2','De l’eau et du gaz carbonique']]},
    protocole:['Verre à pied froid au-dessus de la flamme bleue (professeur) : observer ; témoin sans flamme.','Bocal retourné sur la flamme, puis eau de chaux agitée (professeur) : observer ; témoin avec de l’air.','Placer les étiquettes de l’équation littérale.','Comparer avec la combustion de l’alcool.'],
    variable:'Le test et la situation',maintenu:'Le même brûleur, virole ouverte',
    colonnes:['Test','Situation','Résultat','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.filter(e=>!e.tri).map(e=>[lib(C().TESTS,e.t),e.s==='flamme'?'Flamme':'Témoin',RES(e),e.observation||'—']).concat(M().lignesTri(st,'equation',i=>SLOTS.filter(s=>s[0]===i)[0][1],c=>String(c).split(',').map(k=>lib(C().ETIQUETTES,k)).join(' + ')).map(r=>['Équation',r[0],r[1],r[2]])),
    resume:e=>e.tri?'côté placé : '+String(e.choix).split(',').map(k=>lib(C().ETIQUETTES,k)).join(' + '):lib(C().TESTS,e.t).toLowerCase()+', '+(e.s==='flamme'?'flamme':'témoin')+' : '+RES(e).toLowerCase(),
    confrontation:'1. Que montrent le verre froid et son témoin ? 2. Que montrent l’eau de chaux et son témoin ? 3. Écris l’équation littérale : qu’y a-t-il de commun avec l’alcool ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite les deux tests positifs et écris l’équation.',
    transfert:{q:'La combustion complète du butane forme-t-elle les mêmes produits que celle de l’alcool ?',rep:'oui',expl:'Oui : de l’eau et du gaz carbonique (dioxyde de carbone), prouvés par la buée et l’eau de chaux. Équation : butane + gaz oxygène → gaz carbonique + eau.'},
    critere:'Réaliser les deux tests avec témoins et écrire l’équation littérale complète.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense que la flamme bleue ne forme rien.'],['MF','Identifie un produit sur deux.'],['MS','Identifie les deux produits avec témoins.'],['TBM','Écrit l’équation et la compare à celle de l’alcool.']],
    peutConfronter:st=>{const v=C().valides(st).filter(e=>!e.tri);return v.length>=4&&['buee','chaux'].every(t=>v.some(e=>e.t===t&&e.s==='flamme')&&v.some(e=>e.t===t&&e.s==='temoin'))&&M().triEtat(st,'equation',SLOTS.map(s=>s[0])).justes>=2;},
    aides:['Buée sur le verre froid : de l’eau s’est formée.','Eau de chaux troublée : du gaz carbonique s’est formé.','À gauche : butane et gaz oxygène ; à droite : les deux corps prouvés.'],
    synthese:'La combustion complète du butane produit de l’eau (buée sur un verre froid) et du gaz carbonique (eau de chaux troublée), comme celle de l’alcool. Équation littérale : butane + gaz oxygène → gaz carbonique + eau.',
    prof:{reference:'Buée : positive sur la flamme, témoin sec. Eau de chaux : trouble, témoin clair. Équation : butane + gaz oxygène → gaz carbonique + eau (demandée par le TP ; placée ici en transfert, décision du propriétaire).',attendus:['Quatre essais avec témoins.','Deux produits nommés.','Équation complète.'],erreurs:['Oublier le gaz oxygène à gauche.','Prendre la buée pour du butane.','Croire que la flamme bleue ne forme rien.']},
    diagnostic:st=>st.essais.length?['Indicatif : n’oublie pas les témoins, puis l’équation.']:['Commence par le verre froid au-dessus de la flamme.']
  };
})();
