/* NohobaLab · 6e Côte d'Ivoire · ELE-02 · Allumer une lampe à l'aide d'une pile cylindrique.
   Modèle qualitatif : la lampe brille si le plot touche une borne de la pile et si le culot, par une lame métallique, touche l'autre borne.
   Pas de fils de connexion ici : les contacts sont directs. La lampe n'a pas de sens de branchement. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const PLOT=[['plus','la borne + (capuchon)'],['moins','la borne − (fond)'],['cote','le côté de la pile']];
  const LAME=[['moins','la borne −'],['plus','la borne +'],['cote','le côté de la pile'],['rien','nulle part']];
  const nom=(L,id)=>(L.filter(x=>x[0]===id)[0]||['',''])[1];
  /* règle du modèle : deux bornes différentes touchées par le plot et par le culot */
  function allume(plot,lame){return (plot==='plus'||plot==='moins')&&(lame==='plus'||lame==='moins')&&plot!==lame;}
  function dessin(plot,lame){
    const A=window.NohobaAtelier,on=allume(plot,lame),retourne=plot==='moins',cote=plot==='cote';
    const px=150,py=130; /* pile */
    let s='';
    if(retourne)s+='<g transform="translate('+px+' '+(py+52)+') scale(1 -1) translate('+(-px)+' '+(-(py+52))+')">'+A.pileCyl(px,py,1)+'</g>';else s+=A.pileCyl(px,py,1);
    /* positions des bornes selon l'orientation de la pile : haut y=py-10 ; bas y=py+114 */
    const haut={x:px,y:py-10},bas={x:px,y:py+114};
    const spot={plus:retourne?bas:haut,moins:retourne?haut:bas,cote:{x:px+30,y:py+60}};
    s+=A.pastille(px-80,haut.y+4,retourne?'borne −':'borne +')+A.pastille(px-80,bas.y,retourne?'borne +':'borne −');
    let lx,ly,culot;
    if(cote){lx=px+88;ly=py+60;culot={x:lx-39,y:ly-16};}
    else{lx=px;ly=py-68;culot={x:lx-16,y:ly+39};}
    if(cote)s+='<g transform="translate('+lx+' '+ly+') rotate(90) translate('+(-lx)+' '+(-ly)+')">'+A.lampe(lx,ly,on,1)+'</g>';else s+=A.lampe(lx,ly,on,1);
    /* lame métallique : du culot vers la cible */
    let c0=culot,d,t=spot[lame];
    const gold='#C99A1E';
    if(lame==='rien')d='M'+c0.x+' '+c0.y+' H'+(c0.x-46)+' V'+(c0.y+34);
    else if(lame==='cote')d='M'+c0.x+' '+c0.y+' H'+(cote?c0.x-8:px-44)+' V'+(py+120)+' H'+(px+44)+' V'+t.y+' H'+t.x;
    else d='M'+c0.x+' '+c0.y+' H'+(cote?px+44:px-44)+' V'+t.y+' H'+t.x;
    s+='<path d="'+d+'" fill="none" stroke="#1B2540" stroke-opacity=".15" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"/><path d="'+d+'" fill="none" stroke="'+gold+'" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
    return A.svg(s,'0 0 440 270','Pile cylindrique, lampe et lame métallique : '+(on?'la lampe brille':'la lampe est éteinte'));
  }
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier de contacts · pile cylindrique et lampe'},sec);
    h('p',{text:'Choisis où poser le plot de la lampe et où toucher le culot avec la lame métallique. Pas de fil de connexion : les contacts sont directs. Ne laisse jamais le contact longtemps.'},sec);
    const fig=A.paire(sec,h);
    const f1=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f1,'Le plot de la lampe est posé sur…');
    PLOT.forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 200px;margin:0'},f1,'<input type="radio" name="ci2-plot" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+esc(c[1])+'</span>'));
    const f2=h('fieldset',{style:'border:0;padding:0;margin:8px 0;display:flex;flex-wrap:wrap;gap:8px'},sec);h('legend',{style:'font-weight:700;width:100%;float:left'},f2,'La lame métallique relie le culot à…');
    LAME.forEach((c,i)=>h('label',{class:'opt',style:'flex:1 1 200px;margin:0'},f2,'<input type="radio" name="ci2-lame" value="'+c[0]+'"'+(i===0?' checked':'')+'><span>'+esc(c[1])+'</span>'));
    const S=A.saisie(sec,h,'ci2-obs','J’observe que la lampe…');
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);const table=h('div',{},res);
    const val=n=>sec.querySelector('input[name='+n+']:checked').value;
    function maj(){
      const p=val('ci2-plot'),l=val('ci2-lame'),on=allume(p,l);
      fig.montage(dessin(p,l));
      fig.schema(A.schema({cotes:{droite:'lampe',bas:on?'fil':'vide'},legende:on?'Circuit fermé : la lampe brille':'Circuit ouvert : la lampe ne brille pas',label:'Schéma normalisé : pile et lampe, circuit '+(on?'fermé':'ouvert')}));
      S.out.textContent='Plot sur '+nom(PLOT,p)+', lame sur '+nom(LAME,l)+'. Observation : lampe '+(on?'allumée':'éteinte')+'.';
    }
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE02,window.FICHE_CI_ELE02.lignes(st),'Mes essais de contacts.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){
      if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      const p=val('ci2-plot'),l=val('ci2-lame');
      X.addEssai({plot:p,lame:l,allumee:allume(p,l),observation:S.note()});paint();S.msg.textContent='Observation enregistrée.';S.vide();
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();
  }
  window.FICHE_CI_ELE02={
    id:'NL-CI-6E-ELE-02',version:'0.9',modele:'contacts-pile-lampe-v1',
    titre:'Allumer une lampe à l’aide d’une pile',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Allumer une lampe avec une pile cylindrique en réalisant les bons contacts entre la lampe et les deux bornes de la pile.',
    objectifsPedagogiques:['Poser le plot de la lampe sur une borne de la pile','Relier le culot à l’autre borne avec une lame métallique','Expliquer pourquoi la lampe reste éteinte quand les deux contacts touchent la même borne ou le côté de la pile'],
    situationEvaluation:'Kofi veut allumer une lampe avec une pile cylindrique, mais il touche deux fois la borne + . Que lui conseilles-tu, et pourquoi ?',
    objectif:'Réaliser les contacts qui allument une lampe avec une pile cylindrique.',
    objectifEleve:'Trouver où toucher la pile pour que la lampe brille.',
    situation:'Awa trouve dans un tiroir une lampe de poche et une pile cylindrique. Elle pose la lampe sur la pile, mais la lampe ne brille pas toujours. Où faut-il toucher la pile pour que la lampe s’allume ?',
    materiel:'Pile cylindrique fictive de 1,5 V, lampe (plot et culot), lame métallique, simulation. Pas de fil de connexion.',
    prevision:{consigne:'Avant les essais, choisis ce qu’il faut faire pour que la lampe brille. Justifie ton hypothèse.',choix:[['deux','Le plot et le culot doivent toucher les deux bornes de la pile'],['une','Il suffit de toucher une seule borne de la pile'],['cote','Il suffit de toucher la pile n’importe où'],['plus','Seule la borne + compte']]},
    protocole:['Poser le plot de la lampe sur la borne de ton choix.','Placer la lame métallique entre le culot et un endroit de la pile.','Observer la lampe et écrire ce que tu vois.','Changer un seul contact à la fois, puis recommencer.'],
    variable:'Les endroits touchés par le plot et par la lame',maintenu:'Même pile, même lampe, même lame',
    colonnes:['Plot sur','Lame sur','Lampe','Mon observation'],lignesVides:5,
    lignes:st=>st.essais.map(e=>[nom(PLOT,e.plot),nom(LAME,e.lame),e.allumee?'Allumée':'Éteinte',e.observation||'—']),
    resume:e=>'plot sur '+nom(PLOT,e.plot)+', lame sur '+nom(LAME,e.lame)+' : lampe '+(e.allumee?'allumée':'éteinte'),
    confrontation:'1. Dans quels essais la lampe est-elle allumée ? 2. Quels contacts ont été réalisés à chaque fois ? 3. Que se passe-t-il quand le plot et la lame touchent la même borne ? 4. Et quand l’un des deux touche le côté de la pile ? Compare ensuite ces observations à ton hypothèse.',
    retroaction:'Cite un essai qui allume la lampe et un essai qui ne l’allume pas, avec les contacts réalisés.',
    transfert:{q:'On pose le plot sur la borne − et la lame sur la borne + . La lampe brille-t-elle ?',rep:'oui',expl:'Oui : le plot et le culot touchent bien les deux bornes. La lampe n’a pas de sens de branchement, seul compte le fait de toucher les deux bornes.'},
    critere:'Réaliser deux contacts sur les deux bornes et expliquer les essais où la lampe reste éteinte.',
    essaisMin:3,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne réalise pas les contacts sur les deux bornes.'],['MF','Allume la lampe mais ne sait pas expliquer les échecs.'],['MS','Allume la lampe et explique pourquoi il faut toucher les deux bornes.'],['TBM','Allume la lampe dans les deux sens et généralise : deux bornes différentes, aucun sens imposé.']],
    peutConfronter:st=>{const v=st.essais.filter(e=>typeof e.observation==='string'&&e.observation.trim().length>=10);return v.length>=3&&v.some(e=>e.allumee)&&v.some(e=>!e.allumee);},
    aides:['Compte les bornes de la pile : combien y en a-t-il ? Et les contacts de la lampe ?','Si la lampe est éteinte, regarde si le plot et la lame touchent deux bornes différentes.','Essaie de changer un seul contact à la fois pour savoir lequel compte.'],
    synthese:'Pour allumer une lampe avec une pile, il faut toucher les deux bornes de la pile : le plot sur une borne et le culot, par une lame métallique, sur l’autre. Si les deux contacts touchent la même borne ou le côté de la pile, la lampe reste éteinte. La lampe brille quel que soit le côté où l’on met le plot.',
    prof:{reference:'La lampe brille lorsque le plot touche une borne de la pile et que le culot, par la lame, touche l’autre borne. Elle brille avec plot sur + et lame sur −, comme avec plot sur − et lame sur +. Elle reste éteinte si les deux contacts touchent la même borne, le côté de la pile ou si la lame ne touche rien.',attendus:['Hypothèse formulée avant l’essai.','Deux bornes différentes touchées dans les essais qui allument.','Au moins un essai éteint expliqué par le contact manquant.','Observation distincte de l’interprétation.'],erreurs:['Croire qu’il suffit de toucher une borne ou le côté de la pile.','Croire que la lampe ne brille que dans un sens.','Changer plusieurs contacts à la fois.']},
    diagnostic:st=>{const v=st.essais.filter(e=>e.allumee);return v.length?['Tu as obtenu au moins un essai où la lampe brille : indique les contacts réalisés.']:['Aucun essai n’allume encore la lampe : vérifie quelles bornes sont touchées.'];}
  };
})();
