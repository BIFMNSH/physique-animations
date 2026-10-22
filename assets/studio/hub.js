/* Hub d’un niveau : lit data-level sur <html> et la progression dans PROGRAMME. */
(function () {
  var S = window.Studio, P = S.progress, LV = document.documentElement.getAttribute('data-level') || '4e', PRG = window.PROGRAMME[LV] || [];
  var TH = PRG.map(function (t) { return { nm: t.nm, col: t.col, on: t.on, ic: t.ic, les: t.les.map(function (l) { return l.ready ? { t: l.t, id: LV + '-' + l.slug, href: '../lecon/?l=' + l.slug } : l.t; }) }; });
  function steps(id) { var p = P[id] || {}; return ['resume', 'sim', 'defi', 'quiz'].filter(function (k) { return p[k]; }).length; }
  if(LV==='6e'){var hub=document.createElement('div');hub.style.cssText='margin:16px 0;padding:18px;border:1px solid var(--line,#536178);border-radius:16px;background:var(--card,#13243d)';hub.innerHTML='<b>Explorer une leçon, sa simulation et les activités associées</b><p style="margin:8px 0 12px">Un même espace pour comprendre et investiguer, en conservant les leçons Studio existantes.</p><a class="btn primary" href="../parcours-ci/?l=circuit-electrique">Ouvrir le hub pédagogique 6e →</a>';var themes=document.getElementById('themes');themes.parentNode.insertBefore(hub,themes);}
  var box = document.getElementById('themes');
  box.innerHTML = TH.map(function (t) {
    var avail = t.les.filter(function (l) { return typeof l === 'object'; }), done = avail.reduce(function (a, l) { return a + steps(l.id); }, 0), max = t.les.length * 4;
    return '<article class="theme' + (avail.length ? ' cur' : '') + '"><div class="hd"><span class="ic" style="background:' + t.col + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + t.on + '" stroke-width="2.4" aria-hidden="true">' + t.ic + '</svg></span><div style="display:flex;flex-direction:column"><b style="font:800 18px var(--f-display)">' + t.nm + '</b><span style="font-size:12px;color:var(--muted)">' + t.les.length + ' leçon' + (t.les.length > 1 ? 's' : '') + (avail.length ? ' · ' + avail.length + ' en ligne' : ' · bientôt') + '</span></div></div>' +
      '<div class="bar"><i style="width:' + Math.round(done / max * 100) + '%;background:' + t.col + '"></i></div><div style="display:flex;flex-direction:column;gap:2px">' +
      t.les.map(function (l) {
        if (typeof l === 'object') { var n = steps(l.id); return '<a class="les" href="' + l.href + '"><span class="st" style="color:' + (n === 4 ? 'var(--green)' : 'var(--amber)') + '">' + (n === 4 ? '●' : '▸') + '</span><b style="color:var(--text)">' + l.t + '</b><span class="new">' + (n ? n + '/4' : 'Nouveau') + '</span></a>'; }
        return '<div class="les"><span class="st" style="color:var(--dim)">○</span>' + l + '<span class="soon">bientôt</span></div>';
      }).join('') + '</div></article>';
  }).join('');
  var all = [], total = 0; PRG.forEach(function (t) { t.les.forEach(function (l) { total++; if (l.ready) all.push(l); }); });
  var g = document.getElementById('greet');
  if (all.length) {
    var cur = all.filter(function (l) { return LV + '-' + l.slug === P.last; })[0], n = cur ? steps(LV + '-' + cur.slug) : 0;
    if (!cur || n === 4) { var nx = all.filter(function (l) { return steps(LV + '-' + l.slug) < 4; })[0]; if (nx) { cur = nx; n = steps(LV + '-' + nx.slug); } }
    cur = cur || all[0];
    g.innerHTML = S.lumi(96, 'happy2') + '<div style="display:flex;flex-direction:column;gap:6px"><b style="font:800 20px var(--f-display)">Salut, moi c’est Lumi !</b><span style="font-size:15px;line-height:1.4;color:var(--soft)">' + (n ? 'On reprend : <b style="color:var(--text)">' + cur.t + '</b> (' + n + '/4 étapes).' : 'Je te propose : <b style="color:var(--text)">' + cur.t + '</b>.') + '</span><a class="btn primary" style="align-self:flex-start" href="../lecon/?l=' + cur.slug + '">' + (n ? 'Continuer ▸' : 'Commencer ▸') + '</a></div>';
  } else g.innerHTML = S.lumi(96, 'think') + '<div><b style="font:800 20px var(--f-display)">Ça arrive !</b><br><span style="color:var(--soft)">Les premières leçons sont en préparation.</span></div>';
  var tail = ' a un résumé vidéo narré, une simulation à manipuler, un défi à relever seul ou en équipes, et un quiz.';
  document.querySelector('.hero p').textContent = (all.length >= total ? 'Les ' + total + ' leçons de la progression officielle sont en ligne. Chacune' : total + ' leçons de la progression officielle, ' + all.length + ' déjà en ligne. Chacune') + tail;
  var tb = document.getElementById('theme');
  function paint() { tb.textContent = S.settings.theme === 'light' ? 'Thème sombre' : 'Thème clair'; }
  tb.onclick = function () { S.settings.theme = S.settings.theme === 'light' ? 'dark' : 'light'; S.applySettings(); paint(); };
  S.applySettings(); paint();
  document.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { location.href = b.getAttribute('data-go'); }; });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('../sw.js').catch(function () {});
})();
