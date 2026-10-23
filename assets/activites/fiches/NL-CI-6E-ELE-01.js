/* NohobaLab · 6e Côte d'Ivoire · ELE-01 · Identifier les bornes d'une pile et d'une lampe.
   La polarité est imprimée sur la pile (bornes de même taille). Les deux contacts de la lampe sont le plot (pointe) et le culot (filetage) ; le verre est isolant. */
(function(){
  'use strict';
  const h=Activite.h,esc=Activite.esc;
  const ETI=[['','— je choisis —'],['plus','borne +'],['moins','borne −'],['culot','culot de la lampe'],['plot','plot de la lampe']];
  const nom=id=>(ETI.filter(x=>x[0]===id)[0]||['',id])[1];
  const ZONES=[{n:1,att:'culot'},{n:2,att:'plus'},{n:3,att:'plot'},{n:4,att:'moins'}];
  function dessin(ok){
    const A=window.NohobaAtelier,sc=1.3;let s=A.pile45(70,110,1.2)+A.lampe(330,110,false,sc);
    /* zones numérotées : 1 culot, 2 borne +, 3 plot, 4 borne − */
    s+=A.numero(70+1.2*53,22,2)+A.numero(70+1.2*27,22,4);
    s+=A.numero(330+sc*16+34,110+sc*39,1)+A.numero(330+36,110+sc*58+8,3);
    s+='<path d="M'+(330+sc*16+20)+' '+(110+sc*39)+' H'+(330+sc*16+4)+'" stroke="#F97316" stroke-width="2" stroke-dasharray="3 3"/><path d="M'+(330+22)+' '+(110+sc*58+8)+' H'+(330+8)+'" stroke="#F97316" stroke-width="2" stroke-dasharray="3 3"/>';
    s+=A.pastille(330,28,'verre : isolant');
    return A.svg(s,'0 0 460 250','Pile 4,5 V et lampe, quatre zones numérotées de 1 à 4');
  }
  function symboles(ok){
    const A=window.NohobaAtelier,w='fill="none" stroke="#243049" stroke-width="2.5"';
    let s='<path d="M30 80 H180 M200 80 H240" '+w+'/><path d="M180 62 V98" stroke="#243049" stroke-width="6"/><path d="M200 50 V110" '+w+'/>';
    s+=A.T(165,48,'−',17,'#2B5EA8',800)+A.T(222,48,'+',17,'#C03A2E',800);
    s+='<path d="M300 80 H323 M357 80 H380" '+w+'/><circle cx="340" cy="80" r="17" fill="#fff" stroke="#243049" stroke-width="2.5"/><path d="M328 68 L352 92 M352 68 L328 92" '+w+'/>';
    if(ok){s+=A.pastille(172,130,'borne −')+A.pastille(228,162,'borne +')+A.pastille(312,130,'culot')+A.pastille(368,162,'plot')+A.T(220,198,'Les étiquettes se placent sur le schéma normalisé',13,'#46536B',700);}
    else s+=A.T(220,160,'Les étiquettes apparaissent quand tu as tout juste',13,'#46536B',700);
    return A.svg(s,'0 0 440 210','Schéma normalisé : symbole de la pile et de la lampe');
  }
  function manip(panel,X){
    const A=window.NohobaAtelier,st=X.st(),sec=h('div',{class:'card'},panel);
    h('h3',{text:'Atelier · je repère et je nomme chaque borne'},sec);
    h('p',{text:'Chaque zone numérotée de l’image est une borne ou un contact. Choisis son nom, puis vérifie. Repère les signes + et − écrits sur la pile.'},sec);
    const fig=A.paire(sec,h);fig.montage(dessin());fig.schema(symboles(false));
    const row=h('div',{style:'display:flex;flex-wrap:wrap;gap:12px;margin:10px 0'},sec),sel={};
    ZONES.forEach(z=>{const w=h('div',{style:'flex:1 1 200px;min-width:0'},row);h('label',{for:'ci1-z'+z.n,text:'Zone '+z.n,style:'font-weight:700'},w);sel[z.n]=h('select',{id:'ci1-z'+z.n,style:'width:100%'},w,ETI.map(o=>'<option value="'+o[0]+'">'+esc(o[1])+'</option>').join(''));});
    const btn=h('button',{type:'button',class:'btn primary',text:'Vérifier mes étiquettes'},sec),msg=h('div',{class:'msg','aria-live':'polite'},sec);
    const res=h('div',{class:'card'},panel);h('h3',{text:'Mes étiquettes'},res);const table=h('div',{},res);
    function paint(){table.innerHTML=X.tableHTML(window.FICHE_CI_ELE01,window.FICHE_CI_ELE01.lignes(st),'Mes étiquettes contrôlées.');}
    btn.onclick=function(){
      const faits=ZONES.filter(z=>sel[z.n].value);if(faits.length<4){msg.className='msg bad';msg.textContent='Choisis un nom pour chacune des quatre zones.';return;}
      let bon=0;const bad=[];ZONES.forEach(z=>{const ok=sel[z.n].value===z.att;if(ok)bon++;else bad.push(z.n);X.addEssai({zone:z.n,etiquette:sel[z.n].value,ok:ok});});
      paint();fig.schema(symboles(bon===4));
      msg.className='msg '+(bon===4?'ok':'bad');msg.textContent=bon===4?'Les quatre zones sont justes.':bon+' zone(s) juste(s) sur 4. À revoir : zone '+bad.join(', ')+'. Regarde les signes écrits sur la pile et la forme de la lampe.';
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){msg.className='msg';msg.textContent=X.aide();};
    paint();
  }
  window.FICHE_CI_ELE01={
    id:'NL-CI-6E-ELE-01',version:'0.9',modele:'reperage-bornes-v1',
    titre:'Identifier les bornes d’une pile et d’une lampe',niveau:'6e',
    theme:'Électricité',chapitre:'Le circuit électrique',
    competenceVisee:'Repérer et nommer les deux bornes d’une pile plate et les deux contacts d’une lampe.',
    objectifsPedagogiques:['Lire les signes + et − imprimés sur la pile et nommer chaque borne','Repérer le plot et le culot d’une lampe','Reconnaître les symboles normalisés de la pile et de la lampe'],
    situationEvaluation:'Awa veut brancher sa lampe sur une pile plate mais ne sait pas où sont les bornes. Explique-lui comment les reconnaître.',
    objectif:'Repérer et nommer les bornes d’une pile et les contacts d’une lampe.',
    objectifEleve:'Savoir où sont les bornes de la pile et les contacts de la lampe.',
    situation:'Awa veut brancher sa lampe de poche sur une pile plate de 4,5 V. Elle regarde la pile et la lampe, mais elle ne sait pas où sont les bornes. Comment les reconnaître et les nommer ?',
    materiel:'Pile plate fictive de 4,5 V (polarité imprimée), lampe (plot, culot, verre), simulation.',
    prevision:{consigne:'Avant de nommer les zones, choisis comment reconnaître les bornes. Justifie ton hypothèse.',choix:[['signes','Les signes + et − sont écrits sur la pile, et la lampe a un plot et un culot'],['identiques','Toutes les bornes se ressemblent, on ne peut pas les distinguer'],['verre','Les contacts de la lampe sont sur le verre'],['hasard','On les devine au hasard']]},
    protocole:['Regarder la pile : repérer les deux bornes et les signes + et − écrits dessus.','Regarder la lampe : repérer le plot (la pointe) et le culot (le filetage).','Choisir le nom de chaque zone numérotée, puis vérifier.','Observer le schéma normalisé : le symbole de la pile et celui de la lampe.'],
    variable:'Le nom donné à chaque zone',maintenu:'La même pile et la même lampe',
    colonnes:['Zone','Mon étiquette','Contrôle'],lignesVides:4,
    lignes:st=>st.essais.map(e=>['Zone '+e.zone,nom(e.etiquette),e.ok?'Juste':'À revoir']),
    resume:e=>'zone '+e.zone+' : '+nom(e.etiquette)+(e.ok?' (juste)':' (à revoir)'),
    confrontation:'1. Quelles zones as-tu nommées juste du premier coup ? 2. Quels indices t’ont aidé (signes + et −, forme du plot et du culot) ? 3. Le verre de la lampe est-il un contact ? 4. Quel symbole représente la pile, et lequel la lampe ? Compare ensuite à ton hypothèse.',
    retroaction:'Cite deux zones que tu as nommées et l’indice qui t’a aidé.',
    transfert:{q:'Le verre de la lampe est-il un contact électrique ?',rep:'non',expl:'Non : les deux contacts de la lampe sont le plot et le culot. Le verre est isolant.'},
    critere:'Nommer correctement les deux bornes de la pile et les deux contacts de la lampe.',
    essaisMin:4,manip:manip,guidage:true,
    grilleMaitrise:[['MI','Ne nomme aucune borne correctement.'],['MF','Nomme la pile mais confond les contacts de la lampe.'],['MS','Nomme les deux bornes de la pile et les deux contacts de la lampe.'],['TBM','Nomme tout, justifie avec les signes imprimés et reconnaît les symboles normalisés.']],
    peutConfronter:st=>ZONES.every(z=>st.essais.some(e=>e.zone===z.n&&e.ok)),
    aides:['Cherche les signes + et − sur le corps de la pile.','Le plot est la pointe en bas de la lampe, le culot est le filetage juste au-dessus.','Le verre n’est pas un contact : il protège le filament.'],
    synthese:'Une pile a deux bornes : la borne + et la borne −, repérées par les signes imprimés. Une lampe a deux contacts : le plot et le culot. Le verre n’est pas un contact. Dans un schéma, la pile et la lampe ont chacune leur symbole normalisé.',
    prof:{reference:'Zone 1 : culot de la lampe. Zone 2 : borne + de la pile. Zone 3 : plot de la lampe. Zone 4 : borne − de la pile. Le verre est isolant : ce n’est pas un contact.',attendus:['Hypothèse formulée avant l’essai.','Quatre zones nommées correctement.','Signes + et − utilisés comme indices.','Plot et culot distingués du verre.'],erreurs:['Prendre le verre pour un contact.','Confondre plot et culot.','Confondre les signes + et −.']},
    diagnostic:st=>{const n=ZONES.filter(z=>st.essais.some(e=>e.zone===z.n&&e.ok)).length;return n===4?['Les quatre zones ont été nommées correctement.']:['Il reste '+(4-n)+' zone(s) à nommer correctement.'];}
  };
})();
