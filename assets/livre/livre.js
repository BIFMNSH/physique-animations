/* NOHOBA-Lab · Mon livre de physique-chimie (5e).
   Un seul moteur pour les 13 leçons : il lit les données de chaque leçon Studio (situation, hypothèse, critères, À retenir, quiz)
   et construit un livre 3D en neuf moments, ou le même contenu en cahier de labo, au choix de l'élève.
   La simulation et le résumé animé du site s'ouvrent en grand, « dépliés » hors du livre. Ce que l'élève écrit apparaît en écriture scolaire.
   Progression : « pc-livre-<slug> » ; choix Livre/Cahier : « pc-livre-vue ». Rien n'est envoyé. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lit(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function ecrit(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /* ---------- les 13 leçons de 5e (programme du site) ---------- */
  var LECONS = [], THEMES = [];
  ((window.PROGRAMME && window.PROGRAMME['5e']) || []).forEach(function (th) {
    var t = { nm: th.nm, les: [] }; THEMES.push(t);
    th.les.forEach(function (l) { if (l.ready) { var x = { slug: l.slug, t: l.t, th: th.nm, kit: l.kit }; LECONS.push(x); t.les.push(x); } });
  });
  var SLUG = ((/[?&]l=([a-z0-9-]+)/.exec(location.search) || [])[1]) || '';
  var LEC = LECONS.filter(function (x) { return x.slug === SLUG; })[0] || null;

  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var CHAP = ['La situation', 'Mon hypothèse et le laboratoire', 'Mes résultats', 'Mon bilan', 'Le défi'];
  var SP = [['p1', 'p2'], ['p3', 'p4'], ['p5', 'p6'], ['p7', 'p8'], ['p9a', 'p9b']];
  var SGL = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9b'];
  var MOM = { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6, p7: 7, p8: 8, p9a: 9, p9b: 9 };
  var CHAMPS = {
    rep: { m: 2, t: 'J’analyse et je réponds', c: function () { return '<b>' + (L.inquiry.situation || '') + '</b><br>Avec mes mots, je réponds à la question. Je peux me tromper : c’est le début de la recherche.'; } },
    hyp: { m: 3, t: 'Mon hypothèse', c: function () { return esc(L.inquiry.prediction || 'Je prévois ce qui va se passer et je justifie avec « car ».'); } },
    obs: { m: 5, t: 'Mes observations', c: function () { return 'Je note les réglages et ce que j’observe, essai par essai.'; } },
    comp: { m: 6, t: 'Je confronte', c: function () { return 'Mes résultats confirment-ils mon hypothèse ? Je justifie avec « car » ou « parce que ».'; } },
    bilan: { m: 7, t: 'Mon bilan', c: function () { return 'Quelle règle est-ce que je retiens ?<ul class="crit">' + crit().map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; } }
  };

  /* ---------- état ---------- */
  var L = null, S = null, mode = 'dbl', vue = 'livre', anim = true, son = true, busy = false, neuf = null;
  function cle(slug) { return 'pc-livre-' + slug; }
  function vierge() { return { m: 1, rep: '', hyp: '', obs: '', comp: '', bilan: '', cmp: null, q: [], fini: false, pos: 0, vuBilan: 0 }; }
  function charge(slug) { var v = lit(cle(slug)); if (!v || typeof v.m !== 'number' || !Array.isArray(v.q)) return vierge(); v.m = Math.min(9, Math.max(1, Math.round(v.m))); v.pos = Math.min(8, Math.max(0, v.pos | 0)); return v; }
  function sauve() { if (LEC) ecrit(cle(LEC.slug), S); }
  function crit() { return (L && L.inquiry && L.inquiry.criteria) || ['Je décris mes essais et leurs résultats.', 'Je compare mes résultats à mon hypothèse.', 'Je justifie mon bilan par mes observations.']; }
  function score() { return S.q.reduce(function (a, b) { return a + b; }, 0); }
  function etoiles() { var n = L.quiz.length, s = score(); return s >= n - 1 ? 3 : s >= Math.ceil(n / 2) ? 2 : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

  /* ---------- illustrations du laboratoire (une par thème) ---------- */
  function illustration() {
    var A = window.NohobaAtelier, th = LEC.th;
    if (/Électricité|Mesure/.test(th) && LEC.slug !== 'pression-atmospherique' && A && A.montageSerie) return A.montageSerie({ inter: 'ferme' }).svg;
    if (LEC.slug === 'pression-atmospherique') return '<svg viewBox="0 0 300 200" role="img" aria-label="Seringue bouchée et manomètre"><rect x="40" y="80" width="170" height="44" rx="8" fill="#DCEBFA" stroke="#243049" stroke-width="3"/><rect x="210" y="92" width="60" height="20" rx="4" fill="#243049"/><rect x="70" y="84" width="10" height="36" fill="#243049"/><circle cx="150" cy="50" r="30" fill="#fff" stroke="#243049" stroke-width="3"/><path d="M150 50 L170 34" stroke="#C2410C" stroke-width="4" stroke-linecap="round"/><path d="M150 80 V84" stroke="#243049" stroke-width="3"/></svg>';
    if (/Mélanges/.test(th)) return '<svg viewBox="0 0 300 200" role="img" aria-label="Bécher, flacon et flamme"><path d="M60 40 V170 a10 10 0 0 0 10 10 H150 a10 10 0 0 0 10 -10 V40" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><path d="M62 110 H158 V170 a8 8 0 0 1 -8 8 H70 a8 8 0 0 1 -8 -8z" fill="#7FB8E6"/><circle cx="90" cy="140" r="5" fill="#fff"/><circle cx="120" cy="125" r="4" fill="#fff"/><path d="M215 60 h30 v30 l20 70 a10 10 0 0 1 -10 12 h-50 a10 10 0 0 1 -10 -12 l20 -70z" fill="#FFF4E0" stroke="#243049" stroke-width="3"/><path d="M240 30 q12 14 0 26 q-12 -12 0 -26" fill="#F97316"/></svg>';
    return '<svg viewBox="0 0 300 200" role="img" aria-label="Thermomètre, ballon et bain"><rect x="30" y="110" width="200" height="70" rx="6" fill="#7FB8E6" stroke="#243049" stroke-width="3"/><circle cx="130" cy="120" r="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><rect x="122" y="56" width="16" height="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><ellipse cx="130" cy="44" rx="16" ry="18" fill="#E85A4F"/><rect x="250" y="30" width="16" height="130" rx="8" fill="#fff" stroke="#243049" stroke-width="3"/><rect x="254" y="90" width="8" height="64" fill="#E85A4F"/><circle cx="258" cy="164" r="13" fill="#E85A4F" stroke="#243049" stroke-width="3"/></svg>';
  }

  /* ---------- contenus des pages (livre et cahier partagent les mêmes) ---------- */
  function zone(champ, label, bouton) {
    var v = S[champ], h = '<div class="zone"><p class="zl">' + label + '</p>';
    if (v && v.trim()) h += '<p class="ecrit' + (neuf === champ ? ' neuf' : '') + '">' + esc(v) + '</p><button type="button" class="mini" data-ecrire="' + champ + '">Modifier</button>';
    else h += '<button type="button" class="btn large" data-ecrire="' + champ + '">' + bouton + '</button>';
    return h + '</div>';
  }
  function cite(titre, v) { return '<div class="cite"><b>' + titre + '</b><p class="ecrit">' + (v && v.trim() ? esc(v) : '…') + '</p></div>'; }
  function contenu(id) {
    var I = L.inquiry || {};
    switch (id) {
      case 'p1': return '<p class="th">' + esc(L.theme || LEC.th) + '</p><h1>' + esc(L.title || LEC.t) + '</h1><p class="hook">' + esc(I.situation || '') + '</p>'
        + '<div class="note">Ce livre est à toi : ce que tu écris s’ajoute dans ses pages, à l’encre bleue.</div>'
        + (S.m === 1 ? '<button type="button" class="go bas" data-commence>Je commence</button>' : '');
      case 'p2': return '<h2>' + TITRES[1] + '</h2><p>' + esc(I.situation || '') + '</p>' + zone('rep', 'Ma première réponse', 'Écrire ma réponse')
        + '<button type="button" class="btn large" data-resume>Besoin d’aide ? Le résumé animé (1 min)</button>';
      case 'p3': return '<h2>' + TITRES[2] + '</h2>' + cite('Ma première réponse', S.rep) + '<p>' + esc(I.prediction || '') + '</p>' + zone('hyp', 'Mon hypothèse', 'Écrire mon hypothèse');
      case 'p4': return '<h2>Le laboratoire</h2><div class="stage" data-pop><div class="psh"></div><div class="panel">' + illustration() + '</div></div>'
        + '<ol class="etapes"><li>Entre dans le laboratoire.</li><li>Fais au moins deux essais, avec des réglages différents.</li><li>Reviens au livre pour noter ce que tu as observé.</li></ol>'
        + '<button type="button" class="go bas" data-labo>' + (S.m <= 4 ? 'Entrer dans le laboratoire' : 'Retourner au laboratoire') + '</button>';
      case 'p5': return '<h2>' + TITRES[4] + '</h2>' + cite('Mon hypothèse', S.hyp) + zone('obs', 'Mes observations', 'Écrire mes observations') + '<button type="button" class="btn large" data-labo>Rouvrir le laboratoire</button>';
      case 'p6': return '<h2>' + TITRES[5] + '</h2>' + cite('Mon hypothèse', S.hyp) + cite('Mes observations', S.obs) + zone('comp', 'Ma confrontation', 'Écrire ma confrontation');
      case 'p7': return '<h2>' + TITRES[6] + '</h2><p><b>Pour réussir mon bilan :</b></p><ul class="crit">' + crit().map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' + zone('bilan', 'Mon bilan', 'Écrire mon bilan');
      case 'p8': return '<h2>Le bilan scientifique</h2><div class="tab"><div class="bs"><ul>' + (L.retiens || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>'
        + '<button type="button" class="lang' + (S.m >= 8 && S.vuBilan ? ' up' : '') + '"' + (S.m >= 8 && !S.vuBilan ? ' data-auto' : '') + ' disabled>Écris d’abord ton bilan. Cette page s’ouvrira ensuite.</button></div>'
        + (S.m >= 8 ? '<p><b>Je compare avec mon bilan :</b></p><div class="choix" role="group" aria-label="Mon bilan était"><button type="button" data-cmp="0" aria-pressed="' + (S.cmp === 0) + '">Il était complet</button><button type="button" data-cmp="1" aria-pressed="' + (S.cmp === 1) + '">Il est à compléter</button></div>' : '')
        + (S.m === 8 ? '<button type="button" class="go" data-defi' + (S.cmp == null ? ' disabled' : '') + '>Passer au défi</button>' : '');
      case 'p9a': return '<h1>Le défi</h1><p class="hook">' + L.quiz.length + ' manches, seul ou en équipe. Une erreur ne retire rien : chaque manche t’explique la réponse.</p><p class="stars" aria-label="' + (S.q.length ? etoiles() : 0) + ' étoiles sur 3">' + stars(S.q.length ? etoiles() : 0) + '</p><p>Score : ' + score() + ' sur ' + L.quiz.length + '.</p>';
      case 'p9b': return defi();
    }
    return '';
  }
  function defi() {
    var n = L.quiz.length, tete = (mode === 'sgl' || vue === 'cahier') ? '<h2>Le défi</h2>' : '';
    if (S.m < 9) return tete + '<p>Termine d’abord les moments précédents.</p>';
    if (S.fini) return '<h2>Défi terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p class="hook">' + score() + ' manches réussies sur ' + n + '.</p><div class="note">Ta leçon est complète : ton livre garde tout ce que tu as écrit.</div><a class="go bas" href="./" style="display:flex;align-items:center;justify-content:center;text-decoration:none">Retour au sommaire</a><button type="button" class="mini" data-again>Recommencer cette leçon</button>';
    var i = S.q.length, q = L.quiz[i];
    return tete + '<p class="tag"><span>Manche ' + (i + 1) + ' sur ' + n + '</span></p><h2>' + q.q + '</h2><div class="ch" data-dq role="group" aria-label="Réponses possibles">' + q.o.map(function (o, k) { return '<button type="button" data-i="' + k + '">' + o + '</button>'; }).join('') + '</div><div data-dx aria-live="polite"></div>';
  }
  function tag(id) { var m = MOM[id], c = Math.min(4, Math.ceil(m / 2) - 1); if (m === 9) c = 4; return '<div class="tag"><span>' + CHAP[c] + '</span><span>Moment ' + m + ' sur 9</span></div>'; }
  function page(id, side) { return '<div class="page ' + side + '" data-pg="' + id + '">' + tag(id) + contenu(id) + '</div>'; }
  function nu(id, side) { return page(id, side).replace(/ id="[^"]*"/g, ''); }

  /* ---------- progression ---------- */
  function cible(m) { return mode === 'sgl' ? m - 1 : (m === 9 ? 4 : Math.ceil(m / 2) - 1); }
  function avance() {
    S.m = Math.min(9, S.m + 1); sauve();
    if (vue === 'cahier') { rendreCahier(true); return; }
    var t = cible(S.m);
    if (t !== posCour()) aller(t); else monte();
  }
  function posCour() { return mode === 'sgl' ? S.pos : Math.floor(S.pos / 2); }
  function setPos(t) { S.pos = mode === 'sgl' ? t : Math.min(8, t * 2); sauve(); }
  function maxPos() { return mode === 'sgl' ? SGL.length - 1 : SP.length - 1; }
  function debloque(t) { if (t < 0 || t > maxPos()) return false; return (mode === 'sgl' ? MOM[SGL[t]] : MOM[SP[t][0]]) <= S.m; }
  function vus() { return mode === 'sgl' ? [SGL[S.pos]] : SP[Math.floor(S.pos / 2)]; }

  /* ---------- livre : montage et retournement ---------- */
  function monte() {
    var v = vus();
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(v[0], 'S'); } else { $('#sL').innerHTML = page(v[0], 'L'); $('#sR').innerHTML = page(v[1], 'R'); }
    var bk = $('#book'); lier(bk); deplie(bk); neuf = null; majNav();
  }
  function deplie(root) {
    $$('.stage', root).forEach(function (s) { if (!anim) s.classList.add('up'); else setTimeout(function () { s.classList.add('up'); }, 60); });
    var lg = $('.lang[data-auto]', root);
    if (lg) { var leve = function () { lg.classList.add('up'); S.vuBilan = 1; sauve(); }; if (anim) setTimeout(leve, 650); else leve(); }
  }
  function aller(t, direct) {
    if (busy) return;
    var de = posCour();
    if (t === de && !direct) return;
    if (!direct && !debloque(t)) return;
    if (direct || !anim) { setPos(t); monte(); return; }
    busy = true; $$('#book .stage').forEach(function (s) { s.classList.remove('up'); });
    setTimeout(function () { tourne(de, t, function () { setPos(t); busy = false; monte(); }); }, 300);
  }
  function tourne(de, vers, fin) {
    var av = vers > de, sh = $('#sheet'), N = 9, w = 480 / N, i, h = '', f, b;
    if (mode !== 'sgl') {
      var D = SP[de], V = SP[vers];
      f = av ? nu(D[1], 'R') : nu(V[1], 'R'); b = av ? nu(V[0], 'L') : nu(D[0], 'L');
      $('#sL').innerHTML = av ? page(D[0], 'L') : page(V[0], 'L'); $('#sR').innerHTML = av ? page(V[1], 'R') : page(D[1], 'R');
    } else { f = av ? nu(SGL[de], 'S') : nu(SGL[vers], 'S'); b = '<div class="page S"></div>'; $('#sR').innerHTML = page(av ? SGL[vers] : SGL[de], 'S'); }
    function cr(html, k, bk) { return '<div class="fc' + (bk ? ' bk' : '') + '"><div class="in" style="left:' + (bk ? -(N - 1 - k) * w : -k * w) + 'px">' + html + '</div><div class="shade"></div></div>'; }
    for (i = N - 1; i >= 0; i--) h = '<div class="str" style="left:' + (i ? w : 0) + 'px;width:' + (w + 0.6) + 'px">' + cr(f, i) + cr(b, i, true) + h + '</div>';
    sh.innerHTML = h; sh.style.display = 'block';
    var st = $$('.str', sh), sd = $$('.shade', sh);
    function pose(p) {
      var th = av ? -180 * p : -180 * (1 - p), bd = 62 * Math.sin(Math.PI * p) * (av ? 1 : -1), pas = 2 * bd / (N - 1);
      st.forEach(function (e, k) { e.style.transform = 'rotateY(' + (k === 0 ? (th - bd) : pas) + 'deg)'; });
      var o = 0.32 * Math.sin(Math.PI * p); sd.forEach(function (e) { e.style.opacity = o; });
    }
    pose(0); papier();
    var t0 = 0;
    (function s(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 850, 1), q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; pose(q); if (p < 1) requestAnimationFrame(s); else { sh.style.display = 'none'; sh.innerHTML = ''; fin(); } })(performance.now());
  }

  /* ---------- liens des pages (livre ou cahier) ---------- */
  function lier(root) {
    $$('[data-commence]', root).forEach(function (b) { b.onclick = function () { if (S.m === 1) avance(); }; });
    $$('[data-ecrire]', root).forEach(function (b) { b.onclick = function () { feuille(b.getAttribute('data-ecrire'), b); }; });
    $$('[data-resume]', root).forEach(function (b) { b.onclick = function () { cadre('resume', b); }; });
    $$('[data-labo]', root).forEach(function (b) { b.onclick = function () { cadre('sim', $('.panel', b.closest('.page,.flux')) || b); }; });
    $$('[data-cmp]', root).forEach(function (b) { b.onclick = function () { S.cmp = +b.getAttribute('data-cmp'); sauve(); $$('[data-cmp]', root).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); var d = $('[data-defi]', root); if (d) d.disabled = false; }; });
    $$('[data-defi]', root).forEach(function (b) { b.onclick = function () { if (S.m === 8 && S.cmp != null) avance(); }; });
    $$('[data-again]', root).forEach(function (b) { b.onclick = function () { S = vierge(); sauve(); if (vue === 'cahier') rendreCahier(false); else aller(0, true); }; });
    var d = $('[data-pg="p9b"]', root); if (d) liedefi(d);
  }
  function liedefi(r) {
    if (S.fini || S.m < 9) return;
    var i = S.q.length, q = L.quiz[i], g = $('[data-dq]', r), zone = $('[data-dx]', r);
    if (!g) return;
    g.onclick = function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      var k = +b.getAttribute('data-i'), ok = k === q.a; clic();
      $$('button', g).forEach(function (x, j) { x.disabled = true; if (j === q.a) x.classList.add('bon'); else if (j === k) x.classList.add('faux'); });
      zone.innerHTML = '<p class="ex"><b>' + (ok ? 'Exact.' : 'Pas encore.') + '</b> ' + (q.e || '') + '</p><button type="button" class="go" data-dsv style="width:100%;margin-top:8px">' + (i + 1 < L.quiz.length ? 'Manche suivante' : 'Voir mes étoiles') + '</button>';
      var n = $('[data-dsv]', r); n.focus();
      n.onclick = function () { S.q.push(ok ? 1 : 0); if (S.q.length >= L.quiz.length) S.fini = true; sauve(); if (vue === 'cahier') rendreCahier(false); else monte(); };
    };
  }

  /* ---------- volet : feuille volante, laboratoire, résumé ---------- */
  function ouvreVolet(html, src, cls) {
    var V = $('#volet'); V.innerHTML = html; V.hidden = false; document.body.classList.add('volet');
    var box = $('.' + cls, V);
    if (anim && src && src.getBoundingClientRect && box.getBoundingClientRect) {
      var a = src.getBoundingClientRect(), b = box.getBoundingClientRect();
      if (a.width && b.width) {
        box.style.transition = 'none';
        box.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + (a.width / b.width) + ',' + (a.height / b.height) + ')';
        void box.offsetWidth; box.style.transition = ''; box.style.transform = 'none';
      }
    }
    return V;
  }
  function fermeVolet() { var V = $('#volet'); V.hidden = true; V.innerHTML = ''; document.body.classList.remove('volet'); }
  function feuille(champ, src) {
    var C = CHAMPS[champ]; if (!C) return;
    var V = ouvreVolet('<div class="feuille" role="dialog" aria-modal="true" aria-labelledby="fT"><h2 id="fT">' + C.t + '</h2><div>' + C.c() + '</div><label class="sr" for="fTxt">' + C.t + '</label><textarea id="fTxt" maxlength="600">' + esc(S[champ]) + '</textarea><p class="msg" id="fMsg" aria-live="polite"></p><div class="row"><button type="button" class="btn" data-fx>Annuler</button><button type="button" class="go" data-fok>Écrire dans mon ' + (vue === 'cahier' ? 'cahier' : 'livre') + '</button></div></div>', src, 'feuille');
    var ta = $('#fTxt'); ta.focus();
    $('[data-fx]', V).onclick = fermeVolet;
    $('[data-fok]', V).onclick = function () {
      var v = ta.value.trim();
      if (v.length < 3) { $('#fMsg').textContent = 'Écris au moins quelques mots. Tu peux te tromper.'; ta.focus(); return; }
      S[champ] = v; neuf = champ; sauve(); fermeVolet(); clic();
      if (S.m === C.m) avance(); else if (vue === 'cahier') rendreCahier(false); else monte();
    };
  }
  function cadre(kind, src) {
    var sim = kind === 'sim', t = sim ? 'Laboratoire · ' + esc(L.title) : 'Résumé animé · ' + esc(L.title);
    var V = ouvreVolet('<div class="labo" role="dialog" aria-modal="true" aria-label="' + t + '"><div class="lh"><b>' + t + '</b>'
      + (sim ? '<button type="button" class="go" data-lfin>' + (S.m === 4 ? 'J’ai fini ma manipulation' : 'Revenir au livre') + '</button>' : '<button type="button" class="go" data-lfin>Revenir au livre</button>')
      + '</div><div class="lcorps"><iframe title="' + t + '" src="../lecon/?l=' + encodeURIComponent(LEC.slug) + '&embed=' + kind + '#' + kind + '" allow="fullscreen"></iframe></div></div>', src, 'labo');
    $('[data-lfin]', V).onclick = function () { fermeVolet(); if (sim && S.m === 4) avance(); };
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nohoba !== 'studio-h') return;
    var f = $('#volet iframe'); if (f && f.contentWindow === e.source) f.style.height = window.innerWidth < 1000 ? Math.max(560, Math.min(4000, +e.data.h || 0)) + 'px' : '';
  });

  /* ---------- vue cahier ---------- */
  function rendreCahier(defile) {
    var h = '<div class="cah-tete"><p class="th">' + esc(L.theme || LEC.th) + ' · 5e</p><h1 style="margin:0;font:800 30px/1.1 \'Bricolage Grotesque\',sans-serif">' + esc(L.title) + '</h1><p style="margin:0;color:inherit;opacity:.8">Mon cahier de labo · moment ' + S.m + ' sur 9</p></div>', m;
    for (m = 1; m <= S.m; m++) { var id = m === 9 ? 'p9b' : 'p' + m; h += '<section class="flux" id="c' + m + '" data-pg="' + id + '"><span class="no" aria-hidden="true">' + m + '</span>' + (m === 9 ? '' : '') + contenu(id).replace('class="go bas"', 'class="go bas"') + '</section>'; }
    var c = $('#cahierVue'); c.innerHTML = h; lier(c);
    $$('.stage', c).forEach(function (s) { s.classList.add('up'); });
    var lg = $('.lang[data-auto]', c); if (lg) { lg.classList.add('up'); S.vuBilan = 1; sauve(); }
    neuf = null; majNav();
    if (defile) { var el = $('#c' + S.m, c); if (el) { try { c.scrollTo({ top: el.offsetTop - 12, behavior: anim ? 'smooth' : 'auto' }); } catch (e) { c.scrollTop = el.offsetTop - 12; } } }
  }
  function changeVue(v) {
    vue = v; try { localStorage.setItem('pc-livre-vue', v); } catch (e) {}
    $$('[data-vue]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-vue') === v); });
    document.body.classList.toggle('cahier', v === 'cahier');
    if (!LEC) { sommaire(); return; }
    $('#fit').hidden = v === 'cahier'; $('#cahierVue').hidden = v !== 'cahier';
    if (v === 'cahier') rendreCahier(true); else { ajuste(); if (!debloque(posCour())) setPos(cible(S.m)); monte(); }
  }

  /* ---------- sommaire et couverture ---------- */
  function etat(slug) {
    var s = lit(cle(slug)); if (!s || typeof s.m !== 'number') return '<small>À découvrir</small>';
    if (s.fini) { var n = (s.q || []).reduce(function (a, b) { return a + b; }, 0); return '<small class="ok">Terminée · ' + n + '/' + (s.q || []).length + '</small>'; }
    return '<small>Moment ' + s.m + ' sur 9</small>';
  }
  function tocTheme(t, k) { return '<h2>' + (k + 1) + '. ' + esc(t.nm) + '</h2>' + t.les.map(function (l) { return '<a href="?l=' + l.slug + '"><span>' + esc(l.t) + '</span>' + etat(l.slug) + '</a>'; }).join(''); }
  function choixVue() { return '<p><b>Je lis en :</b></p><div class="vue2" role="group" aria-label="Je lis en"><button type="button" data-vue="livre" aria-pressed="' + (vue === 'livre') + '">Livre</button><button type="button" data-vue="cahier" aria-pressed="' + (vue === 'cahier') + '">Cahier</button></div>'; }
  function sommaire() {
    document.body.classList.add('somm');
    $('#fit').hidden = false; $('#cahierVue').hidden = true;
    var tete = '<div class="tag"><span>NOHOBA-Lab · Physique-chimie 5e</span><span>Prototype</span></div>';
    var p1 = tete + '<h1>Sommaire</h1><div class="toc">' + tocTheme(THEMES[0], 0) + tocTheme(THEMES[1], 1) + '</div>';
    var p2 = tete + '<div class="toc">' + tocTheme(THEMES[2], 2) + tocTheme(THEMES[3], 3) + '</div>' + choixVue() + '<div class="note">Livre ou cahier : c’est le même travail, tu peux changer à tout moment.</div>';
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = '<div class="page S" style="overflow:auto">' + tete + '<h1>Sommaire</h1>' + choixVue() + '<div class="toc">' + THEMES.map(tocTheme).join('') + '</div></div>'; }
    else { $('#sL').innerHTML = '<div class="page L">' + p1 + '</div>'; $('#sR').innerHTML = '<div class="page R">' + p2 + '</div>'; }
    $$('#book [data-vue]').forEach(function (b) { b.onclick = function () { vue = b.getAttribute('data-vue'); try { localStorage.setItem('pc-livre-vue', vue); } catch (e) {} sommaire(); }; });
    $$('#bar [data-vue]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-vue') === vue); });
  }
  function couverture() {
    var c = $('#couv'), bk = $('#book');
    c.innerHTML = '<div class="f"><span class="cv-k">NOHOBA-Lab</span><p class="cv-t">Mon livre de physique-chimie</p><span class="cv-n">5e</span><button type="button" class="cv-go" data-ouvrir>Ouvrir mon livre</button></div><div class="b"></div>';
    c.hidden = false; c.classList.remove('ouvert'); bk.classList.add('ferme');
    $('[data-ouvrir]', c).onclick = function () {
      audio(); papier();
      bk.classList.remove('ferme'); c.classList.add('ouvert');
      try { sessionStorage.setItem('pc-livre-ouvert', '1'); } catch (e) {}
      setTimeout(function () { c.hidden = true; }, anim ? 1100 : 0);
    };
  }

  /* ---------- barre, mise à l'échelle ---------- */
  function majNav() {
    if (!LEC || vue === 'cahier') return;
    var c = posCour(), ch0 = mode === 'sgl' ? (S.pos === 8 ? 4 : Math.floor(S.pos / 2)) : c;
    $('#dots').innerHTML = CHAP.map(function (t, i) { var ok = (i === 4 ? 9 : i * 2 + 1) <= S.m; return '<button type="button" data-c="' + i + '" aria-label="Chapitre ' + (i + 1) + ', ' + t + (ok ? '' : ', pas encore ouvert') + '"' + (ch0 === i ? ' aria-current="step"' : '') + (ok ? '' : ' disabled') + '>' + (i + 1) + '</button>'; }).join('');
    $('#prev').disabled = c === 0; $('#next').disabled = !debloque(c + 1);
  }
  function ajuste() {
    var W = window.innerWidth, old = mode;
    mode = W >= 760 ? 'dbl' : 'sgl';
    document.body.classList.toggle('sgl', mode === 'sgl'); document.body.classList.toggle('anim', anim);
    document.documentElement.style.setProperty('--tilt', mode === 'sgl' ? '0deg' : '10deg');
    var f = $('#fit'), s = $('#scale'), bw = mode === 'sgl' ? 510 : 1000, bh = mode === 'sgl' ? 875 : 905, k = Math.min(f.clientWidth / bw, f.clientHeight / bh) || 0.5;
    s.style.width = (mode === 'sgl' ? 480 : 960) + 'px'; s.style.height = '840px'; s.style.transform = 'scale(' + k + ')';
    var c = mode === 'sgl';
    $('#prev').textContent = c ? '←' : '← Précédent'; $('#next').textContent = c ? '→' : 'Suivant →';
    $('#bAnim').textContent = c ? (anim ? 'Anim.' : 'Figé') : (anim ? 'Animations' : 'Animations arrêtées');
    $('#bSon').textContent = son ? 'Son' : 'Muet'; var sm = $('#bSom'); sm.textContent = c ? '≡' : 'Sommaire'; sm.setAttribute('aria-label', 'Sommaire');
    return old !== mode;
  }
  function dec(d) { var c = posCour() + d; if (debloque(c)) aller(c); }

  /* ---------- sons (après un premier geste) ---------- */
  var AC = null;
  function audio() { if (!son) return null; try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
  function clic() { var a = audio(); if (!a) return; try { var o = a.createOscillator(), g = a.createGain(); o.frequency.value = 1300; g.gain.setValueAtTime(0.04, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.06); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.07); } catch (e) {} }
  function papier() { var a = AC && son ? AC : null; if (!a) return; try { var n = a.sampleRate * 0.28, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n); var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'highpass'; fl.frequency.value = 1800; g.gain.value = 0.05; s.buffer = b; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(); } catch (e) {} }

  /* ---------- chargement d'une leçon (données Studio) ---------- */
  function charger(fin) {
    if (!window.Studio) window.Studio = { s: function () { return {}; }, attr: function () {}, fmt: function (x) { return x; }, kit: {} };
    window.Studio.start = function (c) { L = c; };
    window.__momentsCapture = function (c) { L = c; };
    var files = [].concat(LEC.kit || []).map(function (k) { return '../assets/studio/kits/' + k + '.js'; }).concat('../assets/studio/lecons/' + LEC.slug + '.js');
    (function next(i) {
      if (i >= files.length) { fin(L && L.inquiry && L.quiz && L.quiz.length ? null : new Error('données')); return; }
      var sc = document.createElement('script'); sc.src = files[i];
      sc.onload = function () { next(i + 1); }; sc.onerror = function () { fin(new Error('chargement')); };
      document.body.appendChild(sc);
    })(0);
  }

  function init() {
    if (!$('#book')) return;
    if (calme()) anim = false;
    try { vue = localStorage.getItem('pc-livre-vue') === 'cahier' ? 'cahier' : 'livre'; } catch (e) {}
    ajuste();
    $('#prev').onclick = function () { dec(-1); }; $('#next').onclick = function () { dec(1); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var c = +b.getAttribute('data-c'); aller(mode === 'sgl' ? (c === 4 ? 8 : c * 2) : c); };
    $$('#bar [data-vue]').forEach(function (b) { b.onclick = function () { changeVue(b.getAttribute('data-vue')); }; });
    $('#bSon').onclick = function () { son = !son; this.setAttribute('aria-pressed', son); ajuste(); };
    $('#bAnim').onclick = function () { anim = !anim; this.setAttribute('aria-pressed', anim); ajuste(); };
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#volet').hidden) { fermeVolet(); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !$('#volet').hidden || !LEC || vue === 'cahier') return;
      if (e.key === 'ArrowRight') dec(1); if (e.key === 'ArrowLeft') dec(-1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null || !LEC) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) dec(d < 0 ? 1 : -1); x0 = null; }, { passive: true });
    var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var ch = ajuste(); if (ch && !busy) { if (!LEC) sommaire(); else if (vue === 'livre') monte(); } }, 120); });
    if (!LEC) {
      sommaire(); var dejaOuvert = false; try { dejaOuvert = sessionStorage.getItem('pc-livre-ouvert') === '1'; } catch (e) {}
      if (!dejaOuvert && anim) couverture();
      return;
    }
    document.title = LEC.t + ' · Mon livre de physique-chimie · NOHOBA-Lab';
    S = charge(LEC.slug);
    $('#sR').innerHTML = '<div class="page S"><p class="hook">Ouverture de la leçon…</p></div>';
    charger(function (err) {
      if (err) { $('#sR').innerHTML = '<div class="page S"><h2>Leçon indisponible</h2><p>Impossible de charger cette leçon.</p><a class="go bas" href="./">Retour au sommaire</a></div>'; return; }
      if (!debloque(posCour())) setPos(cible(S.m));
      changeVue(vue);
    });
  }
  window.NohobaLivre = { lecons: function () { return LECONS.map(function (l) { return l.slug; }); } };
  init();
})();
