/* NohobaLab · 6e Côte d'Ivoire · composants d'interface du lot Matière.
   bloc(panel,X,cfg) : montage + schéma côte à côte, contrôles à boutons radio, zone d'observation, tableau des essais.
   tri(panel,X,cfg)  : composant réutilisable de classement (associer, trier) avec retour expliqué, nouvel essai, score, aide, impression.
   dechets(panel,X)  : tri des déchets de MAT-06 (question 6) construit sur tri(). Accessible au clavier, utilisable sur mobile. */
(function(){
  'use strict';
  var M=window.NohobaMatiere,A=window.NohobaAtelier;
  function H(){return window.Activite.h;}
  function E(s){return window.Activite.esc(s);}

  /* ---------- impression d'une trace (même mécanisme que les fiches : #print + window.print) ---------- */
  M.imprimer=function(titre,corps){
    var h=H(),P=document.getElementById('print');
    if(!P)P=h('div',{id:'print','aria-hidden':'true'},document.body);
    P.innerHTML='<div class="sheet"><div class="sh-page"><header class="sh-head"><span class="sh-brand">NOHOBA-Lab · 6e Côte d’Ivoire</span><span class="sh-tag">Ma trace</span></header><h1>'+E(titre)+'</h1>'+
      '<div class="sh-ident"><span>Nom : <i></i></span><span>Classe : <i></i></span><span>Date : <i></i></span></div>'+corps+'<footer class="sh-foot">NOHOBA-Lab · lab.nohaba.com · travail enregistré sur cet appareil seulement</footer></div></div>';
    var t0=document.title;document.title=titre+' - ma trace';
    var back=function(){document.title=t0;window.removeEventListener('afterprint',back);};window.addEventListener('afterprint',back);
    window.print();
  };

  /* ---------- bloc d'expérience ---------- */
  M.bloc=function(panel,X,cfg){
    var h=H(),st=X.st(),sec=h('div',{class:'card'},panel),pre='m'+cfg.n+'-';
    h('h3',{text:cfg.titre},sec);h('p',{text:cfg.intro},sec);
    var fig=A.paire(sec,h);
    cfg.controles.forEach(function(c){
      var f=h('fieldset',{style:'border:0;padding:0;margin:8px 0;min-width:0;display:flex;flex-wrap:wrap;gap:8px'},sec);
      h('legend',{style:'font-weight:700;width:100%;float:left'},f,E(c.legende));
      c.items.forEach(function(it,i){h('label',{class:'opt',style:'flex:1 1 min(100%,210px);min-width:0;margin:0'},f,'<input type="radio" name="'+pre+c.cle+'" value="'+it[0]+'"'+(i===0?' checked':'')+'><span>'+E(it[1])+'</span>');});
    });
    var S=A.saisie(sec,h,pre+'obs',cfg.saisie||'J’observe que…');
    var res=h('div',{class:'card'},panel);h('h3',{text:'Mes observations'},res);
    var table=h('div',{style:'overflow-x:auto;max-width:100%'},res);
    function vals(){var v={};cfg.controles.forEach(function(c){var r=sec.querySelector('input[name='+pre+c.cle+']:checked');v[c.cle]=r?r.value:c.items[0][0];});return v;}
    var cur=null;
    function maj(){cur=cfg.render(vals());fig.montage(cur.montage);fig.schema(cur.schema);S.out.textContent=cur.txt;}
    function paint(){var F=cfg.F();table.innerHTML=X.tableHTML(F,F.lignes(st),cfg.legendeTable||'Mes essais.');}
    sec.addEventListener('change',maj);
    S.btn.onclick=function(){
      if(!S.ok()){S.msg.textContent='Décris ton observation en une phrase avant de l’enregistrer.';S.ta.focus();return;}
      X.addEssai(Object.assign({},cur.essai,{observation:S.note()}));paint();S.msg.textContent='Observation enregistrée.';S.vide();
    };
    h('button',{type:'button',class:'btn',text:'Besoin d’une aide ?'},panel).onclick=function(){S.msg.textContent=X.aide();};
    maj();paint();return {maj:maj,paint:paint};
  };

  /* ---------- composant de classement ---------- */
  /* cfg : {id, titre, intro, vigilance, legende, cats:[[id,libellé]], items:[{id,label,svg,aide,juste,pourquoi,options?,retour?:{cat:texte}}],
            multi:true pour des cases à cocher (réponse = ensemble), verif(itemId,valeur)→{juste,retour}, onChange(), impression:{titre}}
     Plus de cinq choix : liste déroulante étiquetée. État enregistré dans la fiche : st.tri[id] = {tent:{item:[valeur…]}, ok:{item:true}, score:{premier,final,total}}.
     Une valeur multiple s’écrit « a,b,c » (identifiants triés). */
  M.triCfg=M.triCfg||{};
  M.tri=function(panel,X,cfg){
    var h=H(),st=X.st();st.tri=st.tri||{};M.triCfg[cfg.id]=cfg;
    var S=st.tri[cfg.id]=st.tri[cfg.id]||{tent:{},ok:{}},multi=!!cfg.multi,useSel=!multi&&cfg.cats.length>5;
    function nomCat(c,it){var l=(it&&it.options)||cfg.cats;return (l.filter(function(x){return x[0]===c;})[0]||[c,c])[1];}
    function nomVal(v,it){return v?String(v).split(',').map(function(c){return nomCat(c,it);}).join(', '):'—';}
    var verif=cfg.verif||function(id,val){
      var it=cfg.items.filter(function(x){return x.id===id;})[0],ok;
      if(multi){
        var sel=val?String(val).split(','):[],att=it.juste.slice(),manque=att.filter(function(a){return sel.indexOf(a)<0;}),trop=sel.filter(function(a){return att.indexOf(a)<0;});
        ok=!manque.length&&!trop.length;
        return {juste:ok,retour:ok?'Oui. '+(it.pourquoi||''):'Pas tout à fait. '+(manque.length?'Il manque : '+manque.map(function(c){return nomCat(c,it);}).join(', ')+'. ':'')+(trop.length?'En trop : '+trop.map(function(c){return nomCat(c,it);}).join(', ')+'. ':'')+(it.pourquoi||'')};
      }
      ok=val===it.juste;
      return {juste:ok,retour:it.retour&&it.retour[val]?it.retour[val]:(ok?'Oui. ':'Pas tout à fait. ')+(it.pourquoi||'')};
    };
    cfg.verifier=verif;cfg.nomVal=nomVal;
    var sec=h('div',{class:'card'},panel);
    h('h3',{text:cfg.titre},sec);
    if(cfg.intro)h('p',{text:cfg.intro},sec);
    if(cfg.vigilance)h('p',{class:'msg',role:'note'},sec,'<b>Attention.</b> '+E(cfg.vigilance));
    var bandeau=h('p',{class:'msg','aria-live':'polite',role:'status'},sec);
    var grid=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:14px;align-items:start'},sec);
    var pre='t'+cfg.id+'-';
    function score(){
      var premier=0,final=0,rep=0;
      cfg.items.forEach(function(it){
        var t=S.tent[it.id]||[];if(t.length)rep++;
        if(t.length&&verif(it.id,t[0]).juste)premier++;
        if(S.ok[it.id])final++;
      });
      S.score={premier:premier,final:final,total:cfg.items.length,repondus:rep};return S.score;
    }
    function maj(){
      var sc=score();
      bandeau.textContent=sc.repondus?'Score : '+sc.premier+' / '+sc.total+' réussis du premier coup · '+sc.final+' / '+sc.total+' réponses justes pour le moment.':'Réponds à chaque situation, puis valide : un retour t’explique chaque choix.';
      X.save();if(cfg.onChange)cfg.onChange();
    }
    cfg.items.forEach(function(it){
      var card=h('div',{class:'card',style:'margin:0;min-width:0','data-item':it.id},grid),opts=it.options||cfg.cats;
      if(it.svg)h('div',{style:'max-width:200px;margin:0 auto 8px'},card,it.svg);
      h('p',{style:'margin:4px 0;font-weight:700'},card,E(it.label));
      var f=h('fieldset',{style:'border:0;padding:0;margin:6px 0;min-width:0'},card),sel=null;
      h('legend',{style:'font-weight:700'},f,E(cfg.legende||'Je choisis'));
      if(useSel){
        h('label',{for:pre+it.id+'-s',class:'noprint',style:'display:block;margin-top:4px'},f,E(cfg.legende||'Je choisis'));
        sel=h('select',{id:pre+it.id+'-s',style:'max-width:100%'},f,'<option value="">— Choisir —</option>'+opts.map(function(c){return '<option value="'+c[0]+'">'+E(c[1])+'</option>';}).join(''));
      }else{
        opts.forEach(function(c){h('label',{class:'opt',style:'margin:6px 0'},f,'<input type="'+(multi?'checkbox':'radio')+'" name="'+pre+it.id+'" value="'+c[0]+'"><span>'+E(c[1])+'</span>');});
      }
      var inputs=[].slice.call(f.querySelectorAll('input,select'));
      function lire(){
        if(useSel)return sel.value;
        var v=[].slice.call(f.querySelectorAll('input:checked')).map(function(x){return x.value;}).sort();return multi?v.join(','):(v[0]||'');
      }
      function poser(val){
        if(useSel){sel.value=val||'';return;}
        var vs=val?String(val).split(','):[];inputs.forEach(function(r){r.checked=vs.indexOf(r.value)>=0;});
      }
      var row=h('div',{class:'row'},card),vb=h('button',{type:'button',class:'btn primary',text:'Valider ma réponse'},row),ab=h('button',{type:'button',class:'btn',text:'Besoin d’aide ?'},row);
      var msg=h('div',{class:'msg','aria-live':'polite',role:'status',style:'margin:8px 0 0'},card);
      function bloque(b){inputs.forEach(function(r){r.disabled=b;});vb.disabled=b;}
      function montre(v){msg.className='msg '+(v.juste?'ok':'bad');msg.innerHTML='<b>'+(v.juste?'Bonne réponse.':'Ce n’est pas la bonne réponse.')+'</b> '+E(v.retour)+(v.juste?'':' <i>Tu peux réessayer.</i>');}
      var t=S.tent[it.id]||[];
      if(t.length){
        var last=t[t.length-1];montre(verif(it.id,last));poser(last);
        if(S.ok[it.id])bloque(true);else vb.textContent='Valider ma nouvelle réponse';
      }
      ab.onclick=function(){msg.className='msg';msg.textContent='Aide : '+(it.aide||cfg.aide||'Relis la consigne et pense au danger éventuel.');};
      vb.onclick=function(){
        var val=lire();
        if(!val){msg.className='msg bad';msg.textContent='Fais un choix avant de valider.';return;}
        var v=verif(it.id,val);
        S.tent[it.id]=(S.tent[it.id]||[]).concat(val);
        montre(v);
        X.addEssai({tri:cfg.id,item:it.id,choix:val,juste:v.juste,tentative:S.tent[it.id].length});
        if(v.juste){S.ok[it.id]=true;bloque(true);}else{vb.textContent='Valider ma nouvelle réponse';if(!multi)poser('');}
        maj();
      };
    });
    var fin=h('div',{class:'row'},sec);
    var imp=h('button',{type:'button',class:'btn',text:'Imprimer ma trace'},fin);
    imp.onclick=function(){M.imprimer((cfg.impression&&cfg.impression.titre)||cfg.titre,M.traceHTML([cfg.id],st));};
    maj();
    return {score:score,complet:function(){return cfg.items.every(function(it){return S.ok[it.id];});},repondus:function(){return cfg.items.filter(function(it){return (S.tent[it.id]||[]).length;}).length;},total:cfg.items.length};
  };
  /* trace imprimable : score et explications pour un ou plusieurs classements enregistrés */
  M.traceHTML=function(ids,st){
    var out='';
    ids.forEach(function(id){
      var cfg=M.triCfg[id],S=(st.tri||{})[id];if(!cfg||!S)return;
      var tot=cfg.items.length,premier=0,final=0;
      var rows=cfg.items.map(function(it){
        var t=S.tent[it.id]||[],last=t[t.length-1],v=last?cfg.verifier(it.id,last):null;
        if(t.length&&cfg.verifier(it.id,t[0]).juste)premier++;if(S.ok[it.id])final++;
        return '<tr><td>'+E(it.label)+'</td><td>'+E(last?cfg.nomVal(last,it):'—')+'</td><td>'+(v?(v.juste?'Juste':'À revoir')+(t.length>1?' (après '+t.length+' essais)':''):'—')+'</td><td>'+E(v?v.retour:'')+'</td></tr>';
      }).join('');
      out+='<h2>'+E(cfg.titre)+'</h2><p class="sh-q"><b>Score :</b> '+premier+' / '+tot+' réussis du premier coup ; '+final+' / '+tot+' réponses justes.</p><table class="sh-t"><thead><tr><th>Situation</th><th>Ma réponse</th><th>Résultat</th><th>Explication</th></tr></thead><tbody>'+rows+'</tbody></table>';
    });
    return out+'<p class="sh-q"><b>Ce que je retiens :</b></p><div class="sh-line"></div><div class="sh-line"></div>';
  };
  /* état d'un classement dans une fiche (pour peutConfronter) */
  M.triEtat=function(st,id,items){
    var S=(st.tri||{})[id]||{tent:{},ok:{}};
    var rep=0,ok=0;(items||[]).forEach(function(i){if((S.tent[i]||[]).length)rep++;if(S.ok[i])ok++;});
    return {repondus:rep,justes:ok};
  };
  M.lignesTri=function(st,id,libelleItem,libelleCat){
    return st.essais.filter(function(e){return e.tri===id;}).map(function(e){return [libelleItem(e.item),libelleCat(e.choix),e.juste?'Juste':'À revoir'];});
  };

  /* ---------- planche des neuf pictogrammes et des quatre équipements (références de MAT-06) ---------- */
  M.planche=function(parent){
    var h=H(),D=M.dessin;
    var d=h('details',{class:'card'},parent);h('summary',{style:'font-weight:700;cursor:pointer'},d,'La planche des neuf pictogrammes et des quatre équipements (aide)');
    h('p',{},d,'Les pictogrammes sont losanges à bord rouge : ils signalent un danger. Les équipements de protection sont des cercles bleus : ils disent ce qu’il faut porter. Ce ne sont pas les mêmes signes.');
    var g=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px'},d);
    M.PICTOS.forEach(function(p){
      var c=h('div',{class:'card',style:'margin:0'},g);
      h('div',{style:'max-width:96px'},c,D.pictoSvg(p.id));
      h('p',{style:'font-weight:700;margin:4px 0'},c,E(p.nom));h('p',{style:'margin:2px 0'},c,'<b>Danger :</b> '+E(p.danger));h('p',{style:'margin:2px 0'},c,'<b>Conduite :</b> '+E(p.conduite));
    });
    h('h4',{},d,'Les quatre équipements de protection (obligation)');
    var g2=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px'},d);
    M.EPI.forEach(function(p){var c=h('div',{class:'card',style:'margin:0'},g2);h('div',{style:'max-width:72px'},c,D.epiSvg(p.id));h('p',{style:'font-weight:700;margin:4px 0'},c,E(p.nom));h('p',{style:'margin:2px 0'},c,E(p.role));});
    var b=h('button',{type:'button',class:'btn',text:'Imprimer la planche'},d);
    b.onclick=function(){
      var rows=M.PICTOS.map(function(p){return '<tr><td style="width:60pt">'+D.pictoSvg(p.id)+'</td><td><b>'+E(p.nom)+'</b></td><td>'+E(p.danger)+'</td><td>'+E(p.conduite)+'</td></tr>';}).join('');
      var epi=M.EPI.map(function(p){return '<tr><td style="width:44pt">'+D.epiSvg(p.id)+'</td><td><b>'+E(p.nom)+'</b></td><td colspan="2">'+E(p.role)+'</td></tr>';}).join('');
      M.imprimer('Les neuf pictogrammes de danger et les quatre équipements de protection','<table class="sh-t"><thead><tr><th>Pictogramme</th><th>Nom</th><th>Danger</th><th>Conduite à tenir</th></tr></thead><tbody>'+rows+'</tbody></table><h2>Équipements de protection individuelle</h2><table class="sh-t"><tbody>'+epi+'</tbody></table>');
    };
    return d;
  };
  /* ---------- jeu de paires (Memory) : pictogramme ↔ nom ---------- */
  M.DELAI_PAIRES=900;
  M.paires=function(parent){
    var h=H(),D=M.dessin,sec=h('div',{class:'card'},parent);
    h('h3',{text:'Pour réviser · le jeu de paires'},sec);
    h('p',{},sec,'Retourne deux cartes : un pictogramme et son nom. Si elles vont ensemble, elles restent visibles. Utilise la touche Tab et la touche Entrée pour jouer au clavier.');
    var etat=h('p',{class:'msg','aria-live':'polite',role:'status'},sec),grid=h('div',{style:'display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,92px),1fr));gap:8px'},sec);
    var row=h('div',{class:'row'},sec),again=h('button',{type:'button',class:'btn',text:'Rejouer'},row);
    var cartes,ouvertes,trouvees,coups,verrou,graine=0;
    function melange(a,seed){var r=a.slice(),i,j,t,x=seed*9301+49297;for(i=r.length-1;i>0;i--){x=(x*9301+49297)%233280;j=Math.floor(x/233280*(i+1));t=r[i];r[i]=r[j];r[j]=t;}return r;}
    function init(){
      var l=[];M.PICTOS.forEach(function(p){l.push({k:p.id,t:'p'});l.push({k:p.id,t:'n'});});
      cartes=melange(l,++graine);ouvertes=[];trouvees={};coups=0;verrou=false;dessiner();etat.textContent='Trouve les 9 paires.';
    }
    function pic(k){return M.PICTOS.filter(function(p){return p.id===k;})[0];}
    function dessiner(){
      grid.innerHTML='';
      cartes.forEach(function(c,i){
        var visible=ouvertes.indexOf(i)>=0||trouvees[c.k],p=pic(c.k);
        var b=h('button',{type:'button',class:'btn',style:'min-height:92px;padding:6px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13px;line-height:1.2','aria-label':visible?(c.t==='p'?'Pictogramme : '+p.alt:'Nom : '+p.nom)+(trouvees[c.k]?' (paire trouvée)':''):'Carte '+(i+1)+', face cachée'},grid);
        if(visible)b.innerHTML=c.t==='p'?D.pictoSvg(c.k):'<b>'+E(p.nom)+'</b>';else b.textContent='?';
        if(trouvees[c.k])b.disabled=true;
        b.onclick=function(){clic(i);};
      });
    }
    function clic(i){
      if(verrou||ouvertes.indexOf(i)>=0||trouvees[cartes[i].k])return;
      ouvertes.push(i);
      if(ouvertes.length<2){dessiner();return;}
      coups++;var a=cartes[ouvertes[0]],b=cartes[ouvertes[1]];
      if(a.k===b.k&&a.t!==b.t){trouvees[a.k]=true;ouvertes=[];var n=Object.keys(trouvees).length;dessiner();etat.textContent=n===9?'Bravo : les 9 paires en '+coups+' coups.':'Paire trouvée ('+n+' sur 9).';return;}
      verrou=true;dessiner();etat.textContent='Ce n’est pas une paire. Regarde bien, puis retourne deux autres cartes.';
      setTimeout(function(){ouvertes=[];verrou=false;dessiner();},M.DELAI_PAIRES);
    }
    again.onclick=init;init();
    return {cartes:function(){return cartes.slice();},trouvees:function(){return Object.keys(trouvees).length;},clic:clic,coups:function(){return coups;}};
  };
  /* ---------- carnet d'observation à la maison : emballages observés avec un adulte, sans rien ouvrir ---------- */
  M.carnetMaison=function(parent){
    var h=H(),sec=h('div',{class:'card'},parent);
    h('h3',{text:'À la maison · j’observe des emballages avec un adulte'},sec);
    h('p',{},sec,'Je regarde seulement les étiquettes, <b>sans ouvrir ni toucher les produits</b>. Je note le nom du produit, les pictogrammes que je vois et ce qu’ils me disent. Si un produit est dangereux, je le dis à un adulte.');
    h('button',{type:'button',class:'btn',text:'Imprimer le carnet d’observation'},sec).onclick=function(){
      var rows='',i;for(i=0;i<5;i++)rows+='<tr><td style="height:34pt"></td><td></td><td></td></tr>';
      M.imprimer('Mon carnet d’observation : les pictogrammes de ma maison','<p class="sh-q">J’observe avec un adulte. Je n’ouvre rien, je ne touche à aucun produit.</p><table class="sh-t"><thead><tr><th>Produit (nom de l’emballage)</th><th>Pictogrammes que je vois</th><th>Ce que je dois faire</th></tr></thead><tbody>'+rows+'</tbody></table>');
    };
    return sec;
  };

  /* ---------- tri des déchets (MAT-06, question 6) ---------- */
  M.dechets=function(panel,X,opt){
    var items=M.DECHETS.map(function(d){return {id:d.id,label:d.nom,svg:M.dessin.objetSvg(d.id==='epluchures'?'epluchures':d.id,d.nom),aide:d.aide};});
    return M.tri(panel,X,{
      id:'dechets',titre:'Question 6 · Où jeter un produit usagé ?',
      intro:'Pour chaque déchet, choisis où il doit aller : la poubelle ordinaire, le recyclage ou une collecte spécialisée. Tu ne touches à aucun déchet : c’est un jeu de classement.',
      vigilance:'Un déchet dangereux ne se jette jamais à la poubelle ordinaire, dans l’évier, dans le caniveau ni dans la nature, et un élève ne le manipule pas : c’est un adulte qui le confie à la collecte spécialisée disponible près de chez vous.',
      legende:'Je le range dans',
      cats:M.DESTINATIONS,items:items,
      verif:function(id,cat){return M.verifierDechet(id,cat);},
      onChange:opt&&opt.onChange,
      impression:{titre:'Question 6 · Où jeter un produit usagé ? Ma trace'}
    });
  };

  M.lignesDechets=function(st){
    return M.lignesTri(st,'dechets',function(i){return (M.DECHETS.filter(function(d){return d.id===i;})[0]||{nom:i}).nom;},function(c){return (M.DESTINATIONS.filter(function(d){return d[0]===c;})[0]||[c,c])[1];});
  };
})();
