/* NohobaLab · 6e Côte d'Ivoire · CHI-03 · Proposer des actions à mener pour réduire la pollution de l'air.
   Simulation « quartier » : dix actions, jauge qualitative de l'air du quartier (effet fort, faible ou nul), puis qui peut agir. */
(function(){
  'use strict';
  const M=()=>window.NohobaMatiere,C=()=>window.NohobaChimie;
  const lib=(l,k)=>C().lib(l,k);
  function manip(panel,X){
    const h=window.Activite.h,esc=window.Activite.esc,st=X.st(),A=window.NohobaAtelier;
    const sec=h('div',{class:'card'},panel);
    h('h3',{text:'Simulation · le quartier respire-t-il mieux ?'},sec);
    h('p',{text:'Je coche jusqu’à cinq actions, je regarde la jauge de l’air du quartier (simulation qualitative), puis j’enregistre mon choix. Je peux recommencer avec d’autres actions.'},sec);
    const fig=h('div',{style:'max-width:520px'},sec);
    const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:6px'},sec);
    h('legend',{style:'font-weight:700'},f,'Les actions que je choisis (cinq au plus)');
    C().ACTIONS.forEach(a=>h('label',{class:'opt',style:'margin:0'},f,'<input type="checkbox" name="m3-a" value="'+a.id+'"><span>'+esc(a.nom)+'</span>'));
    const out=h('p',{'aria-live':'polite'},sec),msg=h('p',{class:'msg','aria-live':'polite'},sec);
    const btn=h('button',{type:'button',class:'btn primary',text:'Enregistrer mon choix d’actions'},sec);
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes essais'},res);const table=h('div',{style:'overflow-x:auto'},res);
    const sel=()=>[...f.querySelectorAll('input:checked')].map(i=>i.value);
    function jauge(q){const n=q.indice==='bon'?3:q.indice==='moyen'?2:1,col=q.indice==='bon'?'#2F855A':q.indice==='moyen'?'#F2B134':'#C2410C';
      return A.svg('<rect x="20" y="30" width="420" height="26" rx="13" fill="#E2E8F0"/><rect x="20" y="30" width="'+(140*n)+'" height="26" rx="13" fill="'+col+'"/>'+A.T(230,22,'Air du quartier (simulation) : '+lib(C().INDICES,q.indice).toLowerCase(),14,'#243049',800),'0 0 460 70','Jauge simulée de l’air du quartier : '+lib(C().INDICES,q.indice).toLowerCase()+'.');}
    function maj(){const s=sel();if(s.length>5){msg.textContent='Cinq actions au plus : décoche-en une.';}else msg.textContent='';const q=C().quartier(s);fig.innerHTML=jauge(q);out.textContent=q.txt;}
    function paint(){const F=window.FICHE_CI_CHI03;table.innerHTML=X.tableHTML(F,F.lignes(st),'Mes essais : actions choisies et air du quartier.');}
    f.addEventListener('change',maj);
    btn.onclick=()=>{const s=sel();if(!s.length){msg.textContent='Coche au moins une action avant d’enregistrer.';return;}if(s.length>5){msg.textContent='Cinq actions au plus.';return;}const q=C().quartier(s);X.addEssai({actions:s,indice:q.indice,points:q.points,observation:'Actions : '+s.map(id=>C().action(id).nom).join(' ; ')+'. Air du quartier : '+lib(C().INDICES,q.indice).toLowerCase()+'.'});paint();msg.textContent='Choix enregistré. Essaie une autre combinaison.';};
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=()=>{msg.textContent=X.aide();};
    maj();paint();
    const items=C().ACTIONS.map(a=>({id:a.id,label:a.nom,juste:a.qui,pourquoi:a.qui==='moi'?'Cette action dépend de moi, tous les jours.':a.qui==='famille'?'Cette action se décide en famille.':'Cette action demande la commune, l’usine ou une organisation.',aide:'Qui décide vraiment de cette action : moi, ma famille, ou la commune et l’usine ?'}));
    M().tri(panel,X,{id:'qui',titre:'Je classe · qui peut agir ?',intro:'Pour chaque action, je dis qui peut la mener.',legende:'Cette action dépend de',cats:C().QUI,items});
  }
  window.FICHE_CI_CHI03={
    id:'NL-CI-6E-CHI-03',version:'0.9',modele:'air-actions-qualitatif-v1',
    titre:'Que faire pour respirer mieux ?',niveau:'6e',theme:'Air et combustions',chapitre:'Les constituants de l’air',
    competenceVisee:'Proposer des actions à mener pour réduire la pollution de l’air et dire qui peut les mener.',
    objectifsPedagogiques:['Choisir des actions qui réduisent la pollution de l’air','Distinguer les actions à effet fort, faible ou nul sur l’air du quartier','Classer les actions selon qui peut agir : moi, ma famille, la commune ou l’usine'],
    situationEvaluation:'Le club environnement prépare une affiche pour les parents du quartier. Propose trois actions personnelles et deux actions collectives, en expliquant pour chacune pourquoi elle réduit la pollution de l’air.',
    objectif:'Proposer des actions efficaces contre la pollution de l’air.',objectifEleve:'Savoir proposer des actions et dire lesquelles dépendent de moi.',
    situation:'Après l’enquête, le club environnement d’Awa et Kofi veut agir. « On ne peut rien faire, c’est l’usine », dit un camarade. Vrai ou faux ? La simulation du quartier permet d’essayer des actions.',
    materiel:'Simulation : dix cartes d’action, jauge qualitative de l’air du quartier, cartes à classer (qui peut agir).',
    prevision:{consigne:'Avant les essais, choisis ce que tu penses. Justifie ton hypothèse.',choix:[['rien','On ne peut rien faire contre la pollution'],['chacun','Chacun peut agir : ne pas brûler les ordures, entretenir les moteurs, cuisiner en plein air, planter'],['etat','Seul l’État peut agir'],['masque','Il suffit de porter un masque']]},
    protocole:['Cocher jusqu’à cinq actions et lire la jauge.','Enregistrer le choix, puis essayer d’autres combinaisons (au moins trois).','Repérer les actions à effet nul ou faible.','Classer les dix actions selon qui peut agir.'],
    variable:'Les actions choisies',maintenu:'Le même quartier, la même jauge',
    colonnes:['Essai','Air du quartier','Mon observation'],lignesVides:4,
    lignes:st=>st.essais.filter(e=>!e.tri).map((e,i)=>['Essai '+(i+1)+' ('+e.actions.length+' actions)',lib(C().INDICES,e.indice),e.observation||'—']).concat(M().lignesTri(st,'qui',i=>C().action(i).nom,c=>lib(C().QUI,c)).map(r=>[r[0],'Classement : '+r[1],r[2]])),
    resume:e=>e.tri?'action classée : '+lib(C().QUI,e.choix).toLowerCase():e.actions.length+' actions : air '+lib(C().INDICES,e.indice).toLowerCase(),
    confrontation:'1. Quelle combinaison a donné le meilleur air ? 2. Quelle action n’a rien changé à la jauge, et pourquoi ? 3. Parmi tes actions efficaces, lesquelles dépendent de toi ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai : les actions cochées et l’indice obtenu.',
    transfert:{q:'Porter un masque réduit-il la pollution de l’air du quartier ?',rep:'non',expl:'Non : le masque protège une personne, mais il ne change pas l’air du quartier. Pour réduire la pollution, il faut agir sur les sources : feux d’ordures, moteurs, cuisine, poussière.'},
    critere:'Proposer au moins trois actions efficaces, écarter une action sans effet, et classer les actions selon qui peut agir.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Pense qu’on ne peut rien faire.'],['MF','Propose une action sans dire son effet.'],['MS','Propose plusieurs actions efficaces et écarte le masque.'],['TBM','Propose, hiérarchise et classe les actions selon qui agit.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>!e.tri);return v.length>=3&&v.some(e=>e.indice==='bon')&&M().triEtat(st,'qui',C().ACTIONS.map(a=>a.id)).repondus>=10;},
    aides:['Les actions qui suppriment une combustion (feux d’ordures, moteurs) ont l’effet le plus fort.','Une action qui protège une seule personne ne change pas l’air de tout le quartier.','Pour l’affiche : trois actions que je peux faire moi-même, deux pour la commune ou l’usine.'],
    synthese:'On peut réduire la pollution de l’air en agissant sur ses sources : ne plus brûler les ordures, organiser leur collecte, entretenir les moteurs, cuisiner en plein air ou avec un foyer amélioré, planter des arbres, ne rien jeter dans les caniveaux. Certaines actions dépendent de moi, d’autres de ma famille, de la commune ou de l’usine. Un masque protège une personne mais ne réduit pas la pollution.',
    prof:{reference:'Effet fort : ne plus brûler les ordures, collecte des déchets, filtre sur la cheminée. Effet faible : foyer amélioré, entretien des moteurs, marcher ou partager un véhicule, planter, caniveaux, arroser la piste. Effet nul : le masque. Jauge « bon » dès six points (simulation). Classement : moi (marcher, planter, caniveaux, masque), famille (ordures, foyer, moteurs), commune ou usine (collecte, filtre, arroser).',attendus:['Trois essais dont un à indice « bon ».','Masque reconnu sans effet sur le quartier.','Dix actions classées selon qui agit.'],erreurs:['Croire que seul l’État peut agir.','Croire que le masque réduit la pollution.','Oublier les actions collectives.']},
    diagnostic:st=>st.essais.length?['Indicatif : cherche une combinaison qui donne « bon ».']:['Coche quelques actions et enregistre un premier essai.']
  };
})();
