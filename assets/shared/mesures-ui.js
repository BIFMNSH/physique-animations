/* NohobaLab · 6e Côte d'Ivoire · composants d'interface du lot « Mesure de grandeurs physiques ».
   mesure(panel,X,cfg) : montage + schéma, choix par boutons radio, saisie de valeurs lues ou calculées, retour expliqué, nouvel essai.
   atelierPesee(panel,X,cfg) : balance de Roberval manipulable ; masses marquées posées une à une (boutons), aiguille, conseil de la méthode
                         des masses décroissantes, pesée notée seulement à l'équilibre. Accessible au clavier, utilisable sur mobile. */
(function(){
  'use strict';
  var Q=window.NohobaMesures,A=window.NohobaAtelier,D=Q.dessin;
  function H(){return window.Activite.h;}
  function E(s){return window.Activite.esc(s);}
  Q.mesureCfg={};Q.peseeCfg={};

  /* ---------- mesure : valeurs à lire ou à calculer ---------- */
  Q.mesure=function(panel,X,cfg){
    var h=H(),st=X.st(),sec=h('div',{class:'card','data-mesure':cfg.id},panel),pre='q'+cfg.id+'-';Q.mesureCfg[cfg.id]=cfg;
    h('h3',{text:cfg.titre},sec);if(cfg.intro)h('p',{text:cfg.intro},sec);
    var fig=A.paire(sec,h);
    (cfg.controles||[]).forEach(function(c){
      var f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;min-width:0;display:flex;flex-wrap:wrap;gap:8px'},sec);
      h('legend',{style:'font-weight:700;width:100%;float:left'},f,E(c.legende));
      c.items.forEach(function(it,i){h('label',{class:'opt',style:'flex:1 1 min(100%,210px);min-width:0;margin:0'},f,'<input type="radio" name="'+pre+c.cle+'" value="'+it[0]+'"'+(i===0?' checked':'')+'><span>'+E(it[1])+'</span>');});
    });
    var out=h('p',{'aria-live':'polite',style:'font-weight:700'},sec);
    var g=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:10px;align-items:end;margin:8px 0'},sec),inputs={},cles='';
    function champs(){return typeof cfg.champs==='function'?cfg.champs(vals()):cfg.champs;}
    function cases(){var C=champs(),k=C.map(function(c){return c.cle+'|'+c.label;}).join(';');if(k===cles)return;cles=k;g.innerHTML='';inputs={};
      C.forEach(function(c){var w=h('div',{style:'min-width:0'},g);h('label',{for:pre+c.cle,style:'display:block;font-weight:700'},w,E(c.label)+(c.unite?' ('+E(c.unite)+')':''));inputs[c.cle]=h('input',{type:'text',inputmode:'decimal',id:pre+c.cle,autocomplete:'off',style:'max-width:100%;width:100%'},w);});}
    var row=h('div',{class:'row'},sec),vb=h('button',{type:'button',class:'btn primary',text:cfg.bouton||'Vérifier et noter ma mesure'},row),ab=h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},row);
    var msg=h('div',{class:'msg','aria-live':'polite',role:'status'},sec);
    var res=h('div',{class:'card'},panel);h('h3',{text:cfg.titreTable||'Mes mesures'},res);var table=h('div',{style:'overflow-x:auto;max-width:100%'},res);
    function vals(){var v={};(cfg.controles||[]).forEach(function(c){var r=sec.querySelector('input[name="'+pre+c.cle+'"]:checked');v[c.cle]=r?r.value:c.items[0][0];});return v;}
    function maj(){var r=cfg.render(vals());fig.montage(r.montage);fig.schema(r.schema);out.textContent=r.txt||'';msg.className='msg';msg.textContent='';cases();}
    function paint(){var F=cfg.F();table.innerHTML=X.tableHTML(F,F.lignes(st),cfg.legendeTable||'Mes mesures.');}
    sec.addEventListener('change',function(e){if(e.target.type==='radio'){maj();Object.keys(inputs).forEach(function(k){inputs[k].value='';});}});
    vb.onclick=function(){
      var s={},vide=false;champs().forEach(function(c){s[c.cle]=inputs[c.cle].value.trim();if(!s[c.cle])vide=true;});
      if(vide){msg.className='msg bad';msg.textContent='Écris une valeur dans chaque case avant de vérifier.';return;}
      var v=vals(),r=cfg.verifier(v,s);
      X.addEssai(Object.assign({mesure:cfg.id},r.essai||{},{saisies:s,juste:!!r.juste}));
      msg.className='msg '+(r.juste?'ok':'bad');msg.innerHTML='<b>'+(r.juste?'Mesure juste.':'À revoir.')+'</b> '+E(r.retour)+(r.juste?'':' <i>Tu peux corriger et vérifier de nouveau.</i>');
      paint();if(cfg.onChange)cfg.onChange();
    };
    ab.onclick=function(){msg.className='msg';msg.textContent='Aide : '+(cfg.aide?cfg.aide(vals()):X.aide());};
    maj();paint();
    return {maj:maj,paint:paint,remplir:function(s){Object.keys(s).forEach(function(k){if(inputs[k])inputs[k].value=String(s[k]);});},valider:function(){vb.click();},message:function(){return msg.textContent;}};
  };

  /* ---------- pesée sur la balance de Roberval ---------- */
  Q.atelierPesee=function(panel,X,cfg){
    var h=H(),st=X.st(),sec=h('div',{class:'card','data-pesee':cfg.id},panel),pre='p'+cfg.id+'-';Q.peseeCfg[cfg.id]=cfg;
    var posees=[];
    h('h3',{text:cfg.titre},sec);if(cfg.intro)h('p',{text:cfg.intro},sec);
    var fig=A.paire(sec,h);
    var f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;min-width:0;display:flex;flex-wrap:wrap;gap:8px'},sec);
    h('legend',{style:'font-weight:700;width:100%;float:left'},f,E(cfg.legende||'Ce que je pèse'));
    cfg.situations.forEach(function(it,i){h('label',{class:'opt',style:'flex:1 1 min(100%,230px);min-width:0;margin:0'},f,'<input type="radio" name="'+pre+'sit" value="'+it.id+'"'+(i===0?' checked':'')+'><span>'+E(it.label)+'</span>');});
    var bx=h('div',{role:'group','aria-label':'Boîte de masses marquées : je pose ou je retire une masse avec la pince',style:'display:flex;flex-wrap:wrap;gap:6px;margin:8px 0'},sec);
    h('p',{style:'width:100%;margin:0;font-weight:700'},bx,'Boîte de masses marquées (je pose ou je retire avec la pince) :');
    var boutons=Q.BOITE.map(function(v,i){var b=h('button',{type:'button',class:'btn','aria-pressed':'false','data-i':String(i),text:v+' g',style:'min-width:64px'},bx);b.onclick=function(){bascule(i);};return b;});
    var rz=h('button',{type:'button',class:'btn',text:'Retirer toutes les masses'},bx);rz.onclick=function(){posees=[];maj();};
    var etat=h('p',{'aria-live':'polite',style:'font-weight:700'},sec),conseil=h('div',{class:'msg','aria-live':'polite',role:'status'},sec);
    var w=h('div',{style:'margin:8px 0;max-width:320px'},sec);
    h('label',{for:pre+'somme',style:'display:block;font-weight:700'},w,E(cfg.question||'Somme des masses marquées posées (g)'));var inp=h('input',{type:'text',inputmode:'decimal',id:pre+'somme',autocomplete:'off',style:'width:100%'},w);
    var row=h('div',{class:'row'},sec),nb=h('button',{type:'button',class:'btn primary',text:'Noter cette pesée'},row),ab=h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},row);
    var msg=h('div',{class:'msg','aria-live':'polite',role:'status'},sec);
    var res=h('div',{class:'card'},panel);h('h3',{text:cfg.titreTable||'Mes pesées'},res);var table=h('div',{style:'overflow-x:auto;max-width:100%'},res);
    function sit(){var r=sec.querySelector('input[name="'+pre+'sit"]:checked');return cfg.situations.filter(function(s){return s.id===(r?r.value:cfg.situations[0].id);})[0];}
    function masses(){return posees.map(function(i){return Q.BOITE[i];});}
    function calc(){var S=sit();return Q.pesee({gauche:S.gauche,droite:S.droite,masses:masses(),cote:S.cote||'droite',bras:S.bras});}
    function bascule(i){var k=posees.indexOf(i);if(k>=0)posees.splice(k,1);else posees.push(i);maj();}
    function maj(){
      var S=sit(),r=calc(),ms=masses();
      boutons.forEach(function(b,i){var on=posees.indexOf(i)>=0;b.setAttribute('aria-pressed',String(on));b.className='btn'+(on?' primary':'');b.disabled=r.depasse;b.setAttribute('aria-label',(on?'Retirer':'Poser')+' la masse de '+Q.BOITE[i]+' g');});
      var o={penche:r.depasse?'aucun':r.eq.penche,gauche:r.depasse?[]:S.gauche,droite:S.droite,masses:ms,cote:S.cote||'droite',bras:S.bras},lab='Balance de Roberval : '+S.label+' ; masses posées '+(ms.length?ms.join(' g + ')+' g':'aucune')+' ; '+(r.depasse?'charge refusée':r.eq.txt);
      fig.montage(D.vue(D.sol('montage',240)+D.roberval(230,240,Object.assign({mode:'montage'},o)),lab));
      fig.schema(D.vue(D.sol('schema',240)+D.roberval(230,240,Object.assign({mode:'schema'},o)),lab));
      etat.textContent=(ms.length?'Masses posées : '+ms.join(' g, ')+' g.':'Aucune masse posée.')+(r.depasse?'':' '+r.eq.txt);
      if(!ms.length&&!r.depasse&&!r.eq.equilibre&&r.eq.penche!==(S.cote||'droite'))r.conseil='Pose d’abord la plus grande masse marquée qui ne fait pas descendre le plateau des masses.';
      conseil.className='msg'+(r.eq.equilibre&&!r.depasse?' ok':'');conseil.textContent=r.depasse?r.conseil:(ms.length||S.gauche.length||S.droite.length?r.conseil:'Équilibre à vide : l’aiguille est sur le repère. La balance est prête.');
    }
    function paint(){var F=cfg.F();table.innerHTML=X.tableHTML(F,F.lignes(st),cfg.legendeTable||'Mes pesées.');}
    sec.addEventListener('change',function(e){if(e.target.name===pre+'sit'){posees=[];inp.value='';msg.className='msg';msg.textContent='';maj();}});
    nb.onclick=function(){
      var S=sit(),r=calc(),ms=masses(),somme=Q.somme(ms);
      if(r.depasse){msg.className='msg bad';msg.textContent='On ne pèse pas une charge qui dépasse la portée de la balance.';return;}
      if(!r.eq.equilibre){msg.className='msg bad';msg.textContent='La balance n’est pas en équilibre : l’aiguille doit être sur le repère avant de noter la pesée.';return;}
      var v=Q.nombre(inp.value);if(!isFinite(v)){msg.className='msg bad';msg.textContent='Écris la somme des masses marquées posées, en grammes.';inp.focus();return;}
      var ok=Q.egal(v,somme);
      X.addEssai({pesee:cfg.id,sit:S.id,masses:ms.slice().sort(function(a,b){return b-a;}),somme:somme,saisie:v,equilibre:true,juste:ok});
      msg.className='msg '+(ok?'ok':'bad');msg.innerHTML=ok?'<b>Pesée notée.</b> '+E(cfg.retour?cfg.retour(S,somme):'Masses posées : '+ms.join(' g + ')+' g = '+somme+' g.'):'<b>À revoir.</b> Additionne de nouveau les masses posées sur le plateau : '+E(ms.join(' g + ')+' g')+'. <i>Tu peux corriger et noter de nouveau.</i>';
      paint();if(cfg.onChange)cfg.onChange();
    };
    ab.onclick=function(){msg.className='msg';msg.textContent='Aide : '+X.aide();};
    maj();paint();
    return {poser:function(valeurs){posees=[];var libres=Q.BOITE.map(function(v,i){return i;});valeurs.forEach(function(v){var i=libres.filter(function(k){return Q.BOITE[k]===v&&posees.indexOf(k)<0;})[0];if(i==null)throw new Error('masse absente de la boîte : '+v);posees.push(i);});maj();},
      choisir:function(id){var r=sec.querySelector('input[name="'+pre+'sit"][value="'+id+'"]');r.checked=true;r.dispatchEvent(new r.ownerDocument.defaultView.Event('change',{bubbles:true}));},
      noter:function(v){inp.value=String(v);nb.click();},etat:calc,message:function(){return msg.textContent;},conseil:function(){return conseil.textContent;},boutons:boutons};
  };

  /* lignes de tableau communes */
  Q.lignesMesure=function(st,id,f){return st.essais.filter(function(e){return e.mesure===id;}).map(f);};
  Q.lignesPesee=function(st,id,f){return st.essais.filter(function(e){return e.pesee===id;}).map(f);};
  /* lignes d'un classement dont chaque question a ses propres options : [question, réponse choisie, Juste / À revoir] */
  Q.lignesTri=function(st,id,items){return st.essais.filter(function(e){return e.tri===id;}).map(function(e){var it=items.filter(function(x){return x.id===e.item;})[0]||{q:e.item,options:[]},o=(it.options||[]).filter(function(x){return x[0]===e.choix;})[0];return [it.q||it.label||e.item,o?o[1]:e.choix,e.juste?'Juste':'À revoir'];});};
  Q.justes=function(st,cle,id){return st.essais.filter(function(e){return e[cle]===id&&e.juste;});};
})();
