/* Hub d’un niveau : lit data-level sur <html> et la progression dans PROGRAMME. */
(function () {
  var S = window.Studio, P = S.progress, LV = document.documentElement.getAttribute('data-level') || '4e', PRG = window.PROGRAMME[LV] || [];
  var TH = PRG.map(function (t) { return { nm: t.nm, col: t.col, on: t.on, ic: t.ic, les: t.les.map(function (l) { return l.ready ? { t: l.t, id: LV + '-' + l.slug, href: (LV === '6e' ? '../parcours-ci/?l=' : '../lecon/?l=') + l.slug } : l.t; }) }; });
  function steps(id) { var p = P[id] || {}; return ['resume', 'sim', 'defi', 'quiz'].filter(function (k) { return p[k]; }).length; }
  function renderLevel() {
  P = S.store('pc-studio-prog', {});
  var box = document.getElementById('themes');
  var currentTheme = PRG.findIndex(function(t){return t.les.some(function(l){return LV+'-'+l.slug===P.last;});});
  box.innerHTML = TH.map(function (t, ti) {
    var avail = t.les.filter(function (l) { return typeof l === 'object'; }), done = avail.reduce(function (a, l) { return a + steps(l.id); }, 0), max = t.les.length * 4;
    if (LV === '6e') {
      return '<details class="catalogue-group" style="--tc:'+t.col+'"'+(ti===(currentTheme<0?0:currentTheme)?' open':'')+'><summary><span class="catalogue-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+t.ic+'</svg></span><span class="group-title"><b>'+t.nm+'</b><small>'+t.les.length+' leçons · '+avail.filter(function(l){return steps(l.id)===4;}).length+' terminées</small></span><span class="group-progress">'+done+' / '+max+' étapes Studio<span class="progress-track" aria-hidden="true"><i style="width:'+(done/max*100)+'%"></i></span></span><span class="catalogue-chevron" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg></span></summary><ul class="lesson-rail">'+t.les.map(function(l){
        if(typeof l!=='object')return '<li><div class="lesson-unready"><span class="rail-node" aria-hidden="true"></span><span class="lesson-name">'+l+'</span><span class="lesson-state">En préparation</span></div></li>';
        var n=steps(l.id);
        return '<li><a href="'+l.href+'"><span class="rail-node'+(n===4?' complete':n?' partial':'')+'" style="--p:'+(n*25)+'%" aria-hidden="true"></span><span class="lesson-name"><b>'+l.t+'</b><small>Leçon, simulation et investigations</small></span><span class="lesson-state">'+n+' / 4 étapes Studio</span></a></li>';
      }).join('')+'</ul></details>';
    }
    return '<article class="theme' + (avail.length ? ' cur' : '') + '"><div class="hd"><span class="ic" style="background:' + t.col + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + t.on + '" stroke-width="2.4" aria-hidden="true">' + t.ic + '</svg></span><div style="display:flex;flex-direction:column"><b style="font:800 18px var(--f-display)">' + t.nm + '</b><span style="font-size:12px;color:var(--muted)">' + t.les.length + ' leçon' + (t.les.length > 1 ? 's' : '') + (avail.length ? ' · ' + avail.length + ' en ligne' : ' · bientôt') + '</span></div></div>' +
      '<div class="bar"><i style="width:' + Math.round(done / max * 100) + '%;background:' + t.col + '"></i></div><div style="display:flex;flex-direction:column;gap:2px">' +
      t.les.map(function (l) {
        if (typeof l === 'object') { var n = steps(l.id); return '<a class="les" href="' + l.href + '"><span class="st" style="color:' + (n === 4 ? 'var(--green)' : 'var(--amber)') + '">' + (n === 4 ? '●' : '▸') + '</span><b style="color:var(--text)">' + l.t + '</b><span class="new">' + (n ? n + '/4' : 'Nouveau') + '</span></a>'; }
        return '<div class="les"><span class="st" style="color:var(--dim)">○</span>' + l + '<span class="soon">bientôt</span></div>';
      }).join('') + '</div></article>';
  }).join('');
  if (LV === '6e') {
    var fold=document.getElementById('foldThemes'),groups=Array.from(box.querySelectorAll('details.catalogue-group'));
    function paintFold(){fold.textContent=groups.every(function(d){return d.open;})?'Tout replier':'Tout déplier';}
    fold.onclick=function(){var open=!groups.every(function(d){return d.open;});groups.forEach(function(d){d.open=open;});paintFold();};
    groups.forEach(function(d){d.addEventListener('toggle',paintFold);});
    paintFold();
    document.getElementById('programmeProgress').textContent=TH.reduce(function(sum,t){return sum+t.les.reduce(function(n,l){return n+(typeof l==='object'?steps(l.id):0);},0);},0)+' / '+PRG.reduce(function(n,t){return n+t.les.length*4;},0)+' étapes Studio réalisées · progression conservée sur cet appareil.';
  }
  var all = [], total = 0; PRG.forEach(function (t) { t.les.forEach(function (l) { total++; if (l.ready) all.push(l); }); });
  var g = document.getElementById('greet');
  if (all.length) {
    var cur = all.filter(function (l) { return LV + '-' + l.slug === P.last; })[0], n = cur ? steps(LV + '-' + cur.slug) : 0;
    if (!cur || n === 4) { var nx = all.filter(function (l) { return steps(LV + '-' + l.slug) < 4; })[0]; if (nx) { cur = nx; n = steps(LV + '-' + nx.slug); } }
    cur = cur || all[0];
    if(LV==='6e')g.innerHTML='<span style="color:var(--muted)">Ta prochaine leçon</span><b class="resume-title">'+cur.t+'</b><p>'+(n===4?'Les quatre étapes Studio sont réalisées. Retrouve aussi les investigations.':n?n+' / 4 étapes Studio réalisées. Reprends à ton rythme.':'Ouvre la leçon, sa simulation et ses investigations.')+'</p><a class="btn primary" href="../parcours-ci/?l='+cur.slug+'">'+(n?'Retrouver la leçon →':'Explorer la leçon →')+'</a>';
    else g.innerHTML = S.lumi(96, 'happy2') + '<div style="display:flex;flex-direction:column;gap:6px"><b style="font:800 20px var(--f-display)">Salut, moi c’est Lumi !</b><span style="font-size:15px;line-height:1.4;color:var(--soft)">' + (n ? 'On reprend : <b style="color:var(--text)">' + cur.t + '</b> (' + n + '/4 étapes).' : 'Je te propose : <b style="color:var(--text)">' + cur.t + '</b>.') + '</span><a class="btn primary" style="align-self:flex-start" href="../lecon/?l=' + cur.slug + '">' + (n ? 'Continuer ▸' : 'Commencer ▸') + '</a></div>';
  } else g.innerHTML = S.lumi(96, 'think') + '<div><b style="font:800 20px var(--f-display)">Ça arrive !</b><br><span style="color:var(--soft)">Les premières leçons sont en préparation.</span></div>';
  var tail = ' a un résumé vidéo narré, une simulation à manipuler, un défi à relever seul ou en équipes, et un quiz.';
  document.querySelector('.hero p').textContent = (all.length >= total ? 'Les ' + total + ' leçons de la progression officielle sont en ligne. Chacune' : total + ' leçons de la progression officielle, ' + all.length + ' déjà en ligne. Chacune') + tail;
  }
  renderLevel();
  if(LV==='6e')window.addEventListener('pageshow',function(e){if(e.persisted)renderLevel();});
  var tb = document.getElementById('theme');
  function paint() { tb.textContent = S.settings.theme === 'light' ? 'Thème sombre' : 'Thème clair'; }
  tb.onclick = function () { S.settings.theme = S.settings.theme === 'light' ? 'dark' : 'light'; S.applySettings(); paint(); };
  S.applySettings(); paint();
  document.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { location.href = b.getAttribute('data-go'); }; });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('../sw.js').catch(function () {});
})();
