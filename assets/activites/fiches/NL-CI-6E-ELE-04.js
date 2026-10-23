/* NohobaLab · 6e Côte d'Ivoire · ELE-04 · Découvrir le rôle de chaque élément du circuit.
   Modèle qualitatif en série : pile, interrupteur fermé, moteur et lampe présents → la lampe brille et le moteur tourne. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const ACT=[['complet','Je ne change rien (montage complet)'],['pile','Je retire la pile'],['ouvert','J’ouvre l’interrupteur'],['sansinter','Je retire l’interrupteur'],['lampe','Je retire la lampe'],['moteur','Je retire le moteur']];
  const nom=id=>(ACT.filter(x=>x[0]===id)[0]||['',''])[1];
  function etat(a){return {pile:a!=='pile',inter:a==='ouvert'?'ouvert':a==='sansinter'?'absent':'ferme',lampe:a!=='lampe',moteur:a!=='moteur'};}
  function marche(a){const e=etat(a);return e.pile&&e.inter==='ferme'&&e.lampe&&e.moteur;}
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier · je modifie un élément à la fois'},sec);
    h('p',{text:'Le montage est en série : pile, interrupteur, moteur et lampe. Choisis ce que tu changes, puis observe la lampe et le moteur.'},sec);
    const fig=A.paire(sec,h);
    const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,'Je change…');
    ACT.forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 230px;margin:0'},f,'<input type="radio" name="ci4-a" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+esc(c[1])+'</span>'));
    const S=A.saisie(sec,h,'ci4-obs','J’observe que la lampe… et que le moteur…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{},res);
    const val=()=>sec.querySelector('input[name=ci4-a]:checked').value;
    function maj(){
      const a=val(),e=etat(a),m=A.montageSerie({pile:e.pile,inter:e.inter,lampe:e.lampe,moteur:e.moteur}),on=marche(a);
      fig.montage(m.svg);
      fig.schema(A.schema({pile:e.pile?'normale':'absente',cotes:{droite:e.lampe?'lampe':'vide',bas:e.moteur?'moteur':'vide',gauche:e.inter==='ferme'?'interFerme':e.inter==='ouvert'?'interOuvert':'vide'},legende:on?'Boucle fermée : tout fonctionne':'Boucle ouverte : rien ne fonctionne',label:'Schéma normalisé du montage en série, boucle '+(on?'fermée':'ouverte')}));
      S.out.textContent=nom(a)+'. Observation : lampe '+(on?'allumée':'éteinte')+', moteur '+(on?'en marche':'à l’arrêt')+'.';
    }
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE04,window.FICHE_CI_ELE04.lignes(st),'Mes modifications du circuit.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){
      if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      const a=val();X.addEssai({action:a,allumee:marche(a),moteur:marche(a),observation:S.note()});paint();S.msg.textContent='Observation enregistrée.';S.vide();
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();
  }
  window.FICHE_CI_ELE04={
    id:'NL-CI-6E-ELE-04',version:'0.9',modele:'serie-pile-interrupteur-moteur-lampe-v1',
    titre:'Découvrir le rôle de chaque élément du circuit',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Expliquer le rôle de la pile, de la lampe, du moteur, des fils et de l’interrupteur dans un circuit simple.',
    objectifsPedagogiques:['Dire ce que fait la pile (générateur) et ce que font la lampe et le moteur (récepteurs)','Expliquer le rôle des fils et de l’interrupteur (organe de commande)','Prévoir ce qui arrive quand un élément est retiré'],
    situationEvaluation:'La lampe de la cuisine d’Awa ne s’allume plus et le ventilateur à pile est aussi à l’arrêt. Quels éléments peut-elle vérifier, et que fait chacun dans le circuit ?',
    objectif:'Expliquer le rôle de chaque élément d’un circuit en série.',
    objectifEleve:'Savoir ce que fait chaque élément du circuit.',
    situation:'Kofi a monté un circuit avec une pile, un interrupteur, un moteur et une lampe. Tout fonctionne. Il se demande ce qui arrive quand il retire ou change un élément, et à quoi sert chacun.',
    materiel:'Pile plate fictive de 4,5 V, interrupteur, moteur, lampe, fils de connexion, simulation.',
    prevision:{consigne:'Avant les essais, choisis ce qui arrive à la lampe et au moteur quand on retire un élément. Justifie ton hypothèse.',choix:[['tous','Dès qu’un élément manque, la lampe et le moteur s’arrêtent'],['seul','Seul l’élément retiré s’arrête, les autres continuent'],['pile','Seule la pile compte, les autres éléments n’ont aucun effet'],['rien','Rien ne change quand on retire un élément']]},
    protocole:['Observer le montage complet : lampe et moteur fonctionnent.','Changer un seul élément à la fois : retirer la pile, ouvrir l’interrupteur, retirer la lampe ou le moteur.','Observer la lampe et le moteur, avec le schéma normalisé.','Remettre le montage complet avant l’essai suivant.'],
    variable:'L’élément modifié du circuit',maintenu:'Les autres éléments et la pile en bon état',
    colonnes:['Je change','Lampe','Moteur','Mon observation'],lignesVides:6,
    lignes:st=>st.essais.map(e=>[nom(e.action),e.allumee?'Allumée':'Éteinte',e.allumee?'En marche':'À l’arrêt',e.observation||'—']),
    resume:e=>nom(e.action).toLowerCase()+' : lampe '+(e.allumee?'allumée':'éteinte')+', moteur '+(e.allumee?'en marche':'à l’arrêt'),
    confrontation:'1. Que se passe-t-il quand tu retires la pile ? 2. Quand tu ouvres l’interrupteur ? 3. Quand tu retires la lampe ou le moteur ? 4. Quel élément fournit l’énergie, lesquels l’utilisent, lequel permet de commander ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un essai et dis ce que tu as observé pour la lampe et pour le moteur.',
    transfert:{q:'On retire seulement la lampe d’un montage en série. Le moteur continue-t-il de tourner ?',rep:'non',expl:'Non : en série, il n’y a qu’une seule boucle. Si on retire un élément, la boucle est ouverte et plus rien ne fonctionne.'},
    critere:'Associer à chaque élément son rôle : générateur, récepteur, fil de connexion, interrupteur.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne relie aucun effet à un élément retiré.'],['MF','Décrit les effets sans nommer le rôle des éléments.'],['MS','Nomme générateur et récepteurs et explique un retrait.'],['TBM','Nomme les quatre rôles et explique que la boucle ouverte arrête tout.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10);return v.length>=4&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee);},
    aides:['Compare le montage complet avec le montage où il manque un élément.','Regarde sur le schéma normalisé : la boucle est-elle encore fermée ?','Quel élément fournit l’énergie ? Lesquels l’utilisent ? Lequel sert à commander ?'],
    synthese:'La pile est un générateur : elle fournit l’énergie. La lampe et le moteur sont des récepteurs : ils utilisent l’énergie. Les fils de connexion relient les éléments. L’interrupteur est un organe de commande : fermé, il laisse la boucle fermée ; ouvert, il l’ouvre. Dans un circuit en série, si un élément manque ou si l’interrupteur est ouvert, plus rien ne fonctionne.',
    prof:{reference:'Montage complet, interrupteur fermé : la lampe brille et le moteur tourne. Si on retire la pile, la lampe, le moteur ou l’interrupteur, ou si on ouvre l’interrupteur, la boucle est ouverte : la lampe est éteinte et le moteur à l’arrêt.',attendus:['Hypothèse formulée avant l’essai.','Au moins un retrait de récepteur et un retrait du générateur observés.','Rôles nommés : générateur, récepteur, conducteur, organe de commande.','Lien fait entre boucle ouverte et arrêt.'],erreurs:['Croire que seul l’élément retiré s’arrête.','Confondre récepteur et lampe uniquement.','Oublier que l’interrupteur ouvert ouvre la boucle.']},
    diagnostic:st=>{const g=st.essais.some(e=>e.action==='pile');return g?['Tu as testé le retrait de la pile : compare avec le retrait d’un récepteur.']:['Teste aussi le retrait de la pile pour voir le rôle du générateur.'];}
  };
})();
