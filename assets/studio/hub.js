/* Hub d’un niveau : lit data-level sur <html> et la progression dans PROGRAMME.
   Thèmes pliables, rail de leçons avec nœuds de progression : même modèle que parcours-ci. */
(function () {
  var S = window.Studio, P = S.progress, LV = document.documentElement.getAttribute('data-level') || '4e', PRG = window.PROGRAMME[LV] || [];
  var CI = LV === '6e', UI_KEY = 'pc-hub-' + LV + '-ui';
  var TH = PRG.map(function (t) { return { nm: t.nm, col: t.col, on: t.on, ic: t.ic, les: t.les.map(function (l) { return l.ready ? { t: l.t, slug: l.slug, id: LV + '-' + l.slug, href: (CI ? '../parcours-ci/?l=' : '../lecon/?l=') + l.slug } : l.t; }) }; });
  /* parcours propre à la collection Côte d’Ivoire : sans étape Studio, hors du total de progression */
  if (CI) TH.forEach(function (t) { if (t.nm === 'Propriétés physiques de la matière') t.les.push({ t: 'Matériaux, tri et déchets', slug: 'materiaux-tri-dechets', id: LV + '-materiaux-tri-dechets', href: '../parcours-ci/?l=materiaux-tri-dechets', local: true }); });
  var CHEV = '<svg viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function plural(n, w) { return n + ' ' + w + (n > 1 ? 's' : ''); }
  function steps(id) { var p = P[id] || {}; return ['resume', 'sim', 'defi', 'quiz'].filter(function (k) { return p[k]; }).length; }
  /* volets ouverts : mémorisés sur cet appareil */
  var UI = S.store(UI_KEY, {}); UI.themes = UI.themes || {};
  function saveUI() { try { localStorage.setItem(UI_KEY, JSON.stringify(UI)); } catch (e) {} }
  var groups = [], fold = document.getElementById('foldThemes');
  function paintFold() { if (!fold) return; var all = groups.length && groups.every(function (d) { return d.open; }); fold.textContent = all ? 'Tout replier' : 'Tout déplier'; fold.setAttribute('aria-label', all ? 'Replier tous les thèmes' : 'Déplier tous les thèmes'); fold.setAttribute('aria-expanded', String(!!all)); }
  if (fold) fold.onclick = function () { var open = !groups.every(function (d) { return d.open; }); groups.forEach(function (d) { d.open = open; }); paintFold(); };
  function renderLevel() {
    P = S.store('pc-studio-prog', {});
    var box = document.getElementById('themes');
    var lastTheme = PRG.findIndex(function (t) { return t.les.some(function (l) { return LV + '-' + l.slug === P.last; }); });
    if (lastTheme < 0) lastTheme = Math.max(0, PRG.findIndex(function (t) { return t.les.some(function (l) { return l.ready; }); }));
    /* le thème de la dernière leçon ouverte s'ouvre quand cette leçon change ; sinon l'état mémorisé est repris */
    var lastChanged = UI.last !== (P.last || '');
    if (lastChanged) { UI.last = P.last || ''; UI.themes['t' + lastTheme] = true; saveUI(); }
    var total = 0, max = 0;
    box.innerHTML = TH.map(function (t, ti) {
      var avail = t.les.filter(function (l) { return typeof l === 'object'; }), done = avail.reduce(function (a, l) { return a + steps(l.id); }, 0), tmax = t.les.filter(function (l) { return !(l && l.local); }).length * 4, finished = avail.filter(function (l) { return steps(l.id) === 4; }).length;
      total += done; max += tmax;
      var open = ('t' + ti) in UI.themes ? UI.themes['t' + ti] : ti === lastTheme;
      var meta = plural(t.les.length, 'leçon') + (CI || avail.length === t.les.length ? '' : avail.length ? ' · ' + avail.length + ' en ligne' : ' · bientôt') + (done ? ' · ' + finished + ' terminée' + (finished > 1 ? 's' : '') : '');
      return '<details class="catalogue-group" data-ti="' + ti + '" style="--tc:' + t.col + '"' + (open ? ' open' : '') + '><summary><span class="catalogue-icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + t.ic + '</svg></span><span class="group-title"><b>' + esc(t.nm) + '</b><small>' + meta + '</small></span><span class="group-progress">' + done + ' / ' + tmax + ' étapes Studio<span class="progress-track" aria-hidden="true"><i style="width:' + (done / tmax * 100) + '%"></i></span></span><span class="catalogue-chevron" aria-hidden="true">' + CHEV + '</span></summary><ul class="lesson-rail">' + t.les.map(function (l) {
        if (typeof l !== 'object') return '<li><div class="lesson-unready"><span class="rail-node" aria-hidden="true"></span><span class="lesson-name"><b>' + esc(l) + '</b></span><span class="lesson-state">' + (CI ? 'En préparation' : 'Bientôt') + '</span></div></li>';
        var n = steps(l.id), last = P.last === l.id;
        return '<li><a class="les' + (last ? ' last' : '') + '" href="' + l.href + '"><span class="rail-node' + (n === 4 ? ' complete' : n ? ' partial' : '') + '" style="--p:' + (n * 25) + '%" aria-hidden="true"></span><span class="lesson-name"><b>' + esc(l.t) + (last ? '<span class="tag-last">Dernière ouverte</span>' : '') + '</b><small>' + (CI ? 'Leçon, simulation et investigations' : 'Résumé, simulation, défi et quiz') + '</small></span><span class="lesson-state' + (n === 4 ? ' done' : '') + '">' + (l.local ? 'Investigations' : n === 4 ? 'Terminée · 4 / 4' : n ? n + ' / 4 étapes Studio' : 'Pas encore commencée') + '</span></a></li>';
      }).join('') + '</ul></details>';
    }).join('');
    groups = Array.from(box.querySelectorAll('details.catalogue-group'));
    groups.forEach(function (d) { d.addEventListener('toggle', function () { if (!d.isConnected) return; UI.themes['t' + d.getAttribute('data-ti')] = d.open; saveUI(); paintFold(); }); });
    paintFold();
    var pp = document.getElementById('programmeProgress'), bar = document.getElementById('programmeBar');
    if (pp) pp.textContent = total + ' / ' + max + ' étapes Studio réalisées · progression conservée sur cet appareil.';
    if (bar) { var w = (max ? total / max * 100 : 0) + '%'; requestAnimationFrame(function () { bar.style.width = w; }); }
    var all = [], count = 0; PRG.forEach(function (t) { t.les.forEach(function (l) { count++; if (l.ready) all.push(l); }); });
    var g = document.getElementById('greet');
    g.classList.toggle('lumi', !CI);
    if (all.length) {
      var cur = all.filter(function (l) { return LV + '-' + l.slug === P.last; })[0], n = cur ? steps(LV + '-' + cur.slug) : 0;
      if (!cur || n === 4) { var nx = all.filter(function (l) { return steps(LV + '-' + l.slug) < 4; })[0]; if (nx) { cur = nx; n = steps(LV + '-' + nx.slug); } }
      cur = cur || all[0];
      if (CI) g.innerHTML = '<span style="color:var(--muted)">Ta prochaine leçon</span><b class="resume-title">' + cur.t + '</b><p>' + (n === 4 ? 'Les quatre étapes Studio sont réalisées. Retrouve aussi les investigations.' : n ? n + ' / 4 étapes Studio réalisées. Reprends à ton rythme.' : 'Ouvre la leçon, sa simulation et ses investigations.') + '</p><a class="btn primary" href="../parcours-ci/?l=' + cur.slug + '">' + (n ? 'Retrouver la leçon →' : 'Explorer la leçon →') + '</a>';
      else g.innerHTML = S.lumi(96, 'happy2') + '<div style="display:flex;flex-direction:column;gap:6px"><b style="font:800 20px var(--f-display)">Salut, moi c’est Lumi !</b><span style="font-size:15px;line-height:1.4;color:var(--soft)">' + (n ? 'On reprend : <b style="color:var(--text)">' + cur.t + '</b> (' + n + '/4 étapes).' : 'Je te propose : <b style="color:var(--text)">' + cur.t + '</b>.') + '</span><a class="btn primary" style="align-self:flex-start" href="../lecon/?l=' + cur.slug + '">' + (n ? 'Continuer ▸' : 'Commencer ▸') + '</a></div>';
    } else g.innerHTML = S.lumi(96, 'think') + '<div><b style="font:800 20px var(--f-display)">Ça arrive !</b><br><span style="color:var(--soft)">Les premières leçons sont en préparation.</span></div>';
    var tail = ' a un résumé vidéo narré, une simulation à manipuler, un défi à relever seul ou en équipes, et un quiz.';
    document.querySelector('.hero p').textContent = (all.length >= count ? 'Les ' + count + ' leçons de la progression officielle sont en ligne. Chacune' : count + ' leçons de la progression officielle, ' + all.length + ' déjà en ligne. Chacune') + tail;
  }
  renderLevel();
  window.addEventListener('pageshow', function (e) { if (e.persisted) renderLevel(); });
  var tb = document.getElementById('theme');
  function paint() { var light = S.settings.theme === 'light'; tb.textContent = light ? 'Thème sombre' : 'Thème clair'; tb.setAttribute('aria-label', light ? 'Passer en thème sombre' : 'Passer en thème clair'); }
  tb.onclick = function () { S.settings.theme = S.settings.theme === 'light' ? 'dark' : 'light'; S.applySettings(); paint(); };
  S.applySettings(); paint();
  document.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { location.href = b.getAttribute('data-go'); }; });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('../sw.js').catch(function () {});
})();
