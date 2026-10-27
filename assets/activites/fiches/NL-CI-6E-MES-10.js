/* NohobaLab · 6e Côte d'Ivoire · MES-10 · Découvrir d'autres types de balances.
   Six balances (guide : pèse-lettre, pèse-personne, balance romaine, balance monoplateau ; manuel : balance électronique, pont-bascule), dessins génériques sans marque.
   Portées et précisions données comme ordres de grandeur. Pèse-personne gardé, sans parler de force. Fonction « tare » de la balance électronique. */
(function(){
  'use strict';
  const Q=()=>window.NohobaMesures,M=()=>window.NohobaMatiere;
  const lib=(l,k)=>(l.filter(x=>x[0]===k)[0]||['',k])[1];
  const BAL=()=>Q().BALANCES.map(b=>[b.id,b.nom]);
  function manip(panel,X){
    const h=Activite.h,E=Activite.esc,D=Q().dessin,gal=h('div',{class:'card'},panel);
    h('h3',{text:'Six balances, six portées'},gal);h('p',{},gal,'La <b>portée</b> est la plus grande masse que la balance peut mesurer ; la <b>précision</b> est le plus petit écart qu’elle peut indiquer. Valeurs données comme ordres de grandeur.');
    const g=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:10px'},gal);
    Q().BALANCES.forEach(b=>{const c=h('div',{class:'card',style:'margin:0'},g);h('div',{style:'max-width:120px'},c,D.balanceType(b.id,b.nom));h('p',{style:'font-weight:700;margin:4px 0'},c,E(b.nom));h('p',{style:'margin:2px 0'},c,'Portée : '+E(b.portee));h('p',{style:'margin:2px 0'},c,'Précision : '+E(b.precision));});
    M().tri(panel,X,{id:'mes10assoc',titre:'Quelle balance pour quelle pesée ?',intro:'Pour chaque situation, je choisis la balance la mieux adaptée, d’après sa portée et sa précision.',legende:'J’utilise',cats:BAL(),
      items:Q().SITUATIONS_BALANCE.map(s=>({id:s.id,label:s.txt,juste:s.juste,pourquoi:'Il faut '+lib(BAL(),s.juste).toLowerCase()+' : '+Q().BALANCES.filter(b=>b.id===s.juste)[0].usage+', portée '+Q().BALANCES.filter(b=>b.id===s.juste)[0].portee+'.',aide:'La masse à peser doit être inférieure à la portée, et la précision adaptée à ce qu’on pèse.'}))});
    M().bloc(panel,X,{n:210,titre:'Atelier · la fonction « tare » de la balance électronique',
      intro:'Je pèse le lait du gâteau sans calcul : je pose le bécher, j’appuie sur « tare », puis je verse le lait. Valeurs simulées.',
      controles:[{cle:'etape',legende:'L’étape',items:Q().TARE_ETAPES}],
      saisie:'J’observe que l’écran affiche…',legendeTable:'Mes essais.',F:()=>window.FICHE_CI_MES10,
      render:v=>{const t=Q().affichageTare(v.etape),sc=Q().scene.tare(v);return {montage:sc.montage,schema:sc.schema,txt:t.txt+' (valeur simulée)',essai:{etape:v.etape,affiche:t.affiche}};}});
    Q().mesure(panel,X,{id:'mes10lait',titre:'Je note la masse du lait',intro:'Après la tare et le versement des 100 mL de lait, je lis directement la masse du lait.',
      champs:[{cle:'m',label:'Masse du lait',unite:'g'}],F:()=>window.FICHE_CI_MES10,legendeTable:'Ma mesure.',
      render:()=>Object.assign(Q().scene.tare({etape:'lait'}),{txt:'Lis l’écran.'}),
      verifier:(v,s)=>{const x=Q().nombre(s.m),ok=Q().egal(x,Q().LAIT);return {juste:ok,retour:ok?'Oui : grâce à la tare, l’écran donne directement la masse du lait, '+Q().LAIT+' g, sans calculer m₂ − m₁.':'Lis l’écran après la tare et le versement du lait.',essai:{lait:true}};},
      attendu:()=>({m:Q().LAIT})});
  }
  window.FICHE_CI_MES10={
    id:'NL-CI-6E-MES-10',version:'0.9',modele:'types-balances-v1',
    titre:'Découvrir d’autres types de balances',niveau:'6e',theme:'Mesure de grandeurs physiques',chapitre:'Masse d’un solide et d’un liquide',
    competenceVisee:'Associer un type de balance à son usage et à sa précision.',
    objectifsPedagogiques:['Reconnaître six balances : pèse-lettre, balance monoplateau, pèse-personne, balance romaine, balance électronique, pont-bascule','Choisir une balance selon l’objet, la portée et la précision','Utiliser la fonction « tare » d’une balance électronique'],
    situationEvaluation:'Au port d’Abidjan, on doit peser un camion de fèves de cacao, puis un échantillon de 50 fèves au laboratoire. Quelles balances utiliser ? Justifie avec la portée et la précision.',
    objectif:'Choisir la balance adaptée à une pesée.',objectifEleve:'Savoir choisir une balance selon ce que je pèse.',
    situation:'Quelle balance utiliser pour une lettre, le lait du gâteau, un enfant à l’infirmerie, un régime de bananes au champ, la viande chez le boucher ou un grumier chargé de bois ? Kofi et Awa font l’inventaire des balances qu’ils connaissent.',
    materiel:'Simulation : six balances dessinées, une balance électronique avec la touche « tare », un bécher, du lait.',
    prevision:{consigne:'Avant les essais, choisis la balance qui convient pour peser un grumier chargé de bois. Justifie ton hypothèse.',choix:[['pont','Un pont-bascule'],['electronique','Une balance électronique de laboratoire'],['romaine','Une balance romaine'],['lettre','Un pèse-lettre']]},
    protocole:['Observer les six balances, leur portée et leur précision.','Associer chaque situation à une balance.','Poser un bécher sur la balance électronique et lire l’écran.','Appuyer sur « tare », verser le lait et lire sa masse.'],
    variable:'La situation de pesée, puis l’étape de la tare',maintenu:'Le même bécher et le même lait',
    colonnes:['Situation ou étape','Mon choix ou ma lecture','Verdict ou observation'],lignesVides:8,
    lignes:st=>M().lignesTri(st,'mes10assoc',i=>(Q().SITUATIONS_BALANCE.filter(s=>s.id===i)[0]||{txt:i}).txt,c=>lib(BAL(),c)).concat(st.essais.filter(e=>e.etape).map(e=>['Tare · '+lib(Q().TARE_ETAPES,e.etape),e.affiche+' g',e.observation||'—'])).concat(Q().lignesMesure(st,'mes10lait',e=>['Masse du lait',e.saisies.m+' g',e.juste?'Juste':'À revoir'])),
    resume:e=>e.tri?'association '+(e.juste?'juste':'à revoir'):e.etape?lib(Q().TARE_ETAPES,e.etape).toLowerCase()+' : '+e.affiche+' g':'masse du lait : '+e.saisies.m+' g',
    confrontation:'1. Quelle balance pour chaque situation, et pourquoi ? 2. Que fait la touche « tare » ? 3. Pourquoi évite-t-elle le calcul m₂ − m₁ ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite une association et la portée qui la justifie.',
    transfert:{q:'Awa doit peser 200 g de farine au gramme près. Quelle balance choisit-elle ?',rep:'electronique',options:[['electronique','Une balance électronique'],['pese_personne','Un pèse-personne'],['pont','Un pont-bascule']],expl:'La balance électronique a une portée suffisante (environ 1 kg) et une précision de 1 g ou mieux.'},
    critere:'Associer les six situations à la bonne balance et utiliser la tare.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Associe au hasard.'],['MF','Associe sans parler de portée ni de précision.'],['MS','Associe et justifie par la portée.'],['TBM','Associe, justifie par la portée et la précision, et explique la tare.']],
    peutConfronter:st=>{const v=M().valides(st).filter(e=>e.etape),t=new Set(v.map(e=>e.etape));return M().triEtat(st,'mes10assoc',Q().SITUATIONS_BALANCE.map(s=>s.id)).repondus>=6&&t.has('tare')&&t.has('lait');},
    aides:['La masse à peser doit rester sous la portée de la balance.','Un pont-bascule pèse des véhicules ; un pèse-lettre, du courrier.','La tare remet l’écran à zéro avec le récipient posé.'],
    synthese:'Il existe plusieurs balances : pèse-lettre, balance monoplateau du commerce, pèse-personne, balance romaine, balance électronique, pont-bascule. Chacune a une portée (masse maximale) et une précision ; on la choisit selon ce que l’on pèse. La touche « tare » d’une balance électronique remet l’affichage à zéro avec le récipient posé : on lit ensuite directement la masse du contenu.',
    prof:{reference:'Lettre → pèse-lettre ; viande → monoplateau ; enfant → pèse-personne ; bananes → romaine ; lait → électronique ; grumier → pont-bascule ; lait 103 g après tare (valeur simulée).',attendus:['Six associations justes.','Justification par la portée et la précision.','Utilisation de la tare.'],erreurs:['Choisir une balance dont la portée est trop faible.','Croire que la tare « efface » la masse du récipient de la réalité.','Confondre portée et précision.']},
    diagnostic:st=>st.essais.length?['Indicatif : associe les six situations, puis essaie la tare.']:['Associe une première situation.']
  };
})();
