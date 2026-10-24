/* NohobaLab · 6e Côte d'Ivoire · ELE-03 · Réaliser un circuit électrique.
   Modèle qualitatif : la lampe brille si un fil relie une borne de la pile au plot, l'autre fil l'autre borne au culot.
   Le verre de la lampe est isolant : un fil qui y touche ne ferme pas le circuit. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const FIN=[['plot','le plot de la lampe'],['culot','le culot de la lampe'],['verre','le verre de la lampe'],['libre','rien (fil détaché)']];
  const nom=id=>(FIN.filter(x=>x[0]===id)[0]||['',''])[1];
  function allume(r,n){return (r==='plot'&&n==='culot')||(r==='culot'&&n==='plot');}
  const PT={plot:[360,158],culot:[344,139],verre:[340,84],libre:[290,190]};
  function chemin(base,cible,haut){
    const t=PT[cible];
    if(cible==='plot')return base+' V'+haut+' H'+t[0]+' V'+t[1];
    if(cible==='culot')return base+' V'+haut+' H320 V'+t[1]+' H'+t[0];
    if(cible==='verre')return base+' V'+haut+' H300 V'+t[1]+' H'+t[0];
    return base+' V'+haut+' H'+t[0]+' V'+t[1];
  }
  function dessin(r,n){
    const A=window.NohobaAtelier,on=allume(r,n);
    let s=A.pile45(30,96,.9)+A.lampe(360,100,on,1);
    /* fil rouge : borne + ; fil noir : borne − */
    const dR=chemin('M77.7 58.2 V14 H408',r,206),
          dN=chemin('M54.3 58.2 V46 H14',n,218);
    s+=A.fil(dR,'#E0342F')+A.fil(dN,'#2E3138');
    const ends=[PT[r],PT[n]];
    s+=A.broches(ends.map(p=>[p[0],p[1]]));
    if(r==='verre'||n==='verre')s+=A.pastille(390,28,'verre = isolant');
    return A.svg(s,'0 0 460 250','Pile, lampe et deux fils : '+(on?'la lampe brille':'la lampe est éteinte'));
  }
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier de montage · pile, lampe et deux fils'},sec);
    h('p',{text:'Le fil rouge part de la borne + de la pile, le fil noir part de la borne −. Choisis où relier l’autre bout de chaque fil.'},sec);
    const fig=A.paire(sec,h);
    const grp=(legend,name,def)=>{const f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f,legend);FIN.forEach(c=>h('label',{class:'opt',style:'flex:1 1 200px;margin:0'},f,'<input type="radio" name="'+name+'" value="'+c[0]+'"'+(c[0]===def?' checked':'')+'><span>'+esc(c[1])+'</span>'));};
    grp('Le fil rouge (borne +) est relié à…','ci3-r','verre');
    grp('Le fil noir (borne −) est relié à…','ci3-n','culot');
    const S=A.saisie(sec,h,'ci3-obs','J’observe que la lampe…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{},res);
    const val=n=>sec.querySelector('input[name='+n+']:checked').value;
    function maj(){
      const r=val('ci3-r'),n=val('ci3-n'),on=allume(r,n);
      fig.montage(dessin(r,n));
      fig.schema(A.schema({cotes:{droite:'lampe',bas:on?'fil':'vide'},legende:on?'Boucle fermée : la lampe brille':'Boucle ouverte : la lampe ne brille pas',label:'Schéma normalisé : pile et lampe, boucle '+(on?'fermée':'ouverte')}));
      S.out.textContent='Fil rouge sur '+nom(r)+', fil noir sur '+nom(n)+'. Observation : lampe '+(on?'allumée':'éteinte')+'.';
    }
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE03,window.FICHE_CI_ELE03.lignes(st),'Mes essais de montage.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){
      if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      const r=val('ci3-r'),n=val('ci3-n');X.addEssai({rouge:r,noir:n,allumee:allume(r,n),observation:S.note()});paint();S.msg.textContent='Observation enregistrée.';S.vide();
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();
  }
  window.FICHE_CI_ELE03={
    id:'NL-CI-6E-ELE-03',version:'0.9',modele:'circuit-simple-v1',
    titre:'Réaliser un circuit électrique',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Réaliser un circuit simple fermé avec une pile, une lampe et deux fils, et le définir.',
    objectifsPedagogiques:['Relier chaque borne de la pile à un contact de la lampe : le plot et le culot','Ne jamais relier un fil au verre de la lampe, qui est isolant','Définir un circuit électrique avec mes mots'],
    situationEvaluation:'Awa relie un fil de la pile au verre de la lampe et l’autre au culot. La lampe reste éteinte. Explique-lui son erreur et dis-lui comment corriger.',
    objectif:'Réaliser un circuit simple qui allume une lampe et le définir.',
    objectifEleve:'Relier la pile et la lampe avec deux fils pour que la lampe brille.',
    situation:'Awa veut allumer une petite lampe avec une pile plate de 4,5 V. Elle dispose de deux fils de connexion à pinces. Comment doit-elle les relier à la pile et à la lampe pour que la lampe brille ?',
    materiel:'Pile plate fictive de 4,5 V, lampe (plot, culot, verre), deux fils de connexion à pinces, simulation.',
    prevision:{consigne:'Avant les essais, choisis comment relier les deux fils à la lampe. Justifie ton hypothèse.',choix:[['plotculot','Un fil sur le plot et l’autre sur le culot'],['culot','Les deux fils sur le culot'],['verre','Un fil sur le verre et l’autre sur le culot'],['plot','Les deux fils sur le plot']]},
    protocole:['Le fil rouge part de la borne + de la pile, le fil noir part de la borne −.','Choisir où relier l’autre bout de chaque fil sur la lampe.','Observer la lampe et écrire ce que tu vois, avec le schéma normalisé du montage.','Changer un seul fil à la fois, puis recommencer.'],
    variable:'L’endroit de la lampe où chaque fil est relié',maintenu:'Même pile, même lampe, mêmes fils',
    colonnes:['Fil rouge (+) sur','Fil noir (−) sur','Lampe','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[nom(e.rouge),nom(e.noir),e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>'rouge sur '+nom(e.rouge)+', noir sur '+nom(e.noir)+' : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. Dans quels essais la lampe brille-t-elle ? 2. Où sont reliés les deux fils dans ces essais ? 3. Pourquoi la lampe reste-t-elle éteinte quand un fil touche le verre ? 4. Que remarques-tu sur le schéma normalisé quand la lampe brille ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite un montage qui allume la lampe et un montage qui ne l’allume pas, avec l’endroit où sont reliés les fils.',
    transfert:{q:'Un fil est relié au verre de la lampe et l’autre au culot. La lampe brille-t-elle ?',rep:'non',expl:'Non : le verre est un isolant, il ne ferme pas la boucle. Un fil doit être relié au plot et l’autre au culot.'},
    critere:'Réaliser un circuit fermé qui allume la lampe et expliquer pourquoi le verre ne convient pas.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne parvient pas à fermer la boucle.'],['MF','Allume la lampe sans pouvoir justifier le choix du plot et du culot.'],['MS','Allume la lampe et justifie : un fil sur le plot, un fil sur le culot.'],['TBM','Justifie, définit le circuit et explique pourquoi le verre isolant ne convient pas.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10);return v.length>=3&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee);},
    aides:['Combien de contacts la lampe a-t-elle pour relier les fils ? Lesquels ?','Regarde le schéma normalisé : la boucle est-elle fermée ?','Le verre laisse-t-il passer le courant ? Compare avec les isolants que tu connais.'],
    synthese:'Un circuit électrique simple est une boucle fermée : la pile et la lampe sont reliées par des fils. Chaque fil est relié à une borne de la pile et à un contact de la lampe, le plot ou le culot. Le verre de la lampe est isolant : un fil qui le touche ne ferme pas le circuit.',
    prof:{reference:'La lampe brille quand un fil relie une borne de la pile au plot et l’autre fil relie l’autre borne au culot. Si un fil touche le verre, ou reste détaché, ou si les deux fils vont au même contact, la boucle est ouverte et la lampe reste éteinte.',attendus:['Hypothèse formulée avant l’essai.','Un fil sur le plot et un fil sur le culot dans les essais allumés.','Explication de l’échec avec le verre ou un fil détaché.','Définition du circuit comme boucle fermée.'],erreurs:['Relier un fil au verre de la lampe.','Relier les deux fils au même contact.','Croire qu’une seule borne de la pile suffit.']},
    diagnostic:st=>st.essais.some(e=>e.allumee)?['Tu as obtenu un montage qui allume la lampe : indique où sont reliés les fils.']:['Aucun essai n’allume encore la lampe : regarde où sont reliés les fils.']
  };
})();
