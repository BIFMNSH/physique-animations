/* NOHOBA-Lab · Mon cartable de physique-chimie (5e) : le parcours du cartable appliqué aux 13 leçons.
   Le livre (à gauche) raconte, ouvre le laboratoire et garde le bilan scientifique sous un rabat ; le cahier de labo (à droite)
   recueille les neuf moments, écrits par l'élève en écriture scolaire. Le livre tourne seul quand le cahier avance.
   Un seul moteur : il lit les données de chaque leçon Studio (situation, hypothèse, critères, À retenir, quiz).
   La simulation et le résumé animé du site s'ouvrent en grand. Sur écran étroit, le cahier devient un tiroir.
   Progression : « pc-livre-<slug> ». Rien n'est envoyé. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lit(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function ecrit(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /* ---------- les 13 leçons de 5e ---------- */
  var LECONS = [], THEMES = [];
  ((window.PROGRAMME && window.PROGRAMME['5e']) || []).forEach(function (th) {
    var t = { nm: th.nm, les: [] }; THEMES.push(t);
    th.les.forEach(function (l) { if (l.ready) { var x = { slug: l.slug, t: l.t, th: th.nm, kit: l.kit }; LECONS.push(x); t.les.push(x); } });
  });
  var SLUG = ((/[?&]l=([a-z0-9-]+)/.exec(location.search) || [])[1]) || '';
  var LEC = LECONS.filter(function (x) { return x.slug === SLUG; })[0] || null;

  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var CHAP = ['La situation', 'Le laboratoire', 'Ce que dit l’expérience', 'Le défi'];
  var SP = [['s1l', 's1r'], ['s2l', 's2r'], ['s3l', 's3r'], ['s4l', 's4r']];
  var SGL = ['s1l', 's1r', 's2l', 's2r', 's3l', 's3r', 's4r'], SGL2SP = [0, 0, 1, 1, 2, 2, 3], SP2SGL = [0, 2, 4, 6];
  var CH_OF = { s1l: 0, s1r: 0, s2l: 1, s2r: 1, s3l: 2, s3r: 2, s4l: 3, s4r: 3 };
  var MOML = { s1l: 'Moments 1 à 3', s1r: 'Moments 1 à 3', s2l: 'Moments 4 à 6', s2r: 'Moments 4 à 6', s3l: 'Moment 7', s3r: 'Moment 8', s4l: 'Moment 9', s4r: 'Moment 9' };
  /* champs écrits dans le cahier : moment, consigne */
  var CHAMPS = { 2: 'rep', 3: 'hyp', 5: 'obs', 6: 'comp', 7: 'bilan' };

  /* ---------- état ---------- */
  var L = null, S = null, mode = 'dbl', anim = true, son = true, busy = false;
  function cle(slug) { return 'pc-livre-' + slug; }
  function vierge() { return { m: 1, rep: '', hyp: '', obs: '', comp: '', bilan: '', cmp: null, q: [], fini: false, pos: 0, vuBilan: 0, nom: '' }; }
  function charge(slug) { var v = lit(cle(slug)); if (!v || typeof v.m !== 'number' || !Array.isArray(v.q)) return vierge(); v.m = Math.min(9, Math.max(1, Math.round(v.m))); v.pos = Math.min(6, Math.max(0, v.pos | 0)); return v; }
  function sauve() { if (LEC) ecrit(cle(LEC.slug), S); }
  function crit() { return (L && L.inquiry && L.inquiry.criteria) || ['Je décris mes essais et leurs résultats.', 'Je compare mes résultats à mon hypothèse.', 'Je justifie mon bilan par mes observations.']; }
  function score() { return S.q.reduce(function (a, b) { return a + b; }, 0); }
  function etoiles() { var n = L.quiz.length, s = score(); return s >= n - 1 ? 3 : s >= Math.ceil(n / 2) ? 2 : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function spreadDe(m) { return m <= 3 ? 0 : m <= 6 ? 1 : m <= 8 ? 2 : 3; }

  /* ---------- illustrations (une par thème) ---------- */
  function illustration() {
    var A = window.NohobaAtelier, th = LEC.th;
    if (/Électricité|Mesure/.test(th) && LEC.slug !== 'pression-atmospherique' && A && A.montageSerie) return A.montageSerie({ inter: 'ferme' }).svg;
    if (LEC.slug === 'pression-atmospherique') return '<svg viewBox="0 0 300 200" role="img" aria-label="Seringue bouchée et manomètre"><rect x="40" y="80" width="170" height="44" rx="8" fill="#DCEBFA" stroke="#243049" stroke-width="3"/><rect x="210" y="92" width="60" height="20" rx="4" fill="#243049"/><rect x="70" y="84" width="10" height="36" fill="#243049"/><circle cx="150" cy="50" r="30" fill="#fff" stroke="#243049" stroke-width="3"/><path d="M150 50 L170 34" stroke="#C2410C" stroke-width="4" stroke-linecap="round"/><path d="M150 80 V84" stroke="#243049" stroke-width="3"/></svg>';
    if (/Mélanges/.test(th)) return '<svg viewBox="0 0 300 200" role="img" aria-label="Bécher, flacon et flamme"><path d="M60 40 V170 a10 10 0 0 0 10 10 H150 a10 10 0 0 0 10 -10 V40" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><path d="M62 110 H158 V170 a8 8 0 0 1 -8 8 H70 a8 8 0 0 1 -8 -8z" fill="#7FB8E6"/><circle cx="90" cy="140" r="5" fill="#fff"/><circle cx="120" cy="125" r="4" fill="#fff"/><path d="M215 60 h30 v30 l20 70 a10 10 0 0 1 -10 12 h-50 a10 10 0 0 1 -10 -12 l20 -70z" fill="#FFF4E0" stroke="#243049" stroke-width="3"/><path d="M240 30 q12 14 0 26 q-12 -12 0 -26" fill="#F97316"/></svg>';
    return '<svg viewBox="0 0 300 200" role="img" aria-label="Thermomètre, ballon et bain"><rect x="30" y="110" width="200" height="70" rx="6" fill="#7FB8E6" stroke="#243049" stroke-width="3"/><circle cx="130" cy="120" r="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><rect x="122" y="56" width="16" height="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><ellipse cx="130" cy="44" rx="16" ry="18" fill="#E85A4F"/><rect x="250" y="30" width="16" height="130" rx="8" fill="#fff" stroke="#243049" stroke-width="3"/><rect x="254" y="90" width="8" height="64" fill="#E85A4F"/><circle cx="258" cy="164" r="13" fill="#E85A4F" stroke="#243049" stroke-width="3"/></svg>';
  }

  /* ---------- pages du livre ---------- */
  function pop(cls) { return '<div class="stage ' + (cls || '') + '"><div class="psh"></div><div class="panel">' + illustration() + '</div></div>'; }
  function ouvre(txt) { return mode === 'desk' ? '' : '<button type="button" class="go bas" data-ouvre>' + txt + '</button>'; }
  function cite(titre, v) { return '<div class="cite"><b>' + titre + '</b><p class="ecrit">' + (v && v.trim() ? esc(v) : '…') + '</p></div>'; }
  function contenu(id) {
    var I = L.inquiry || {};
    switch (id) {
      case 's1l': return '<p class="th">' + esc(L.theme || LEC.th) + '</p><h1>' + esc(L.title || LEC.t) + '</h1><p class="hook">' + esc(I.situation || '') + '</p>'
        + '<div class="note">' + (mode === 'desk' ? 'Ton cahier de labo est posé à côté du livre : tu y écris tes idées, tes observations et ton bilan.' : 'Ton cahier de labo est dans le bouton « Mon cahier » : tu y écris tes idées, tes observations et ton bilan.') + '</div>';
      case 's1r': return '<h2>Regarde avant de chercher</h2>' + pop('') + '<p>Un résumé animé d’une minute présente la situation. Tu peux le regarder maintenant ou plus tard.</p><button type="button" class="btn large" data-resume>Regarder le résumé animé</button>' + ouvre('Ouvrir mon cahier');
      case 's2l': return '<h2>Le laboratoire</h2>' + pop('grand') + '<button type="button" class="go bas" data-labo>' + (S.m <= 4 ? 'Entrer dans le laboratoire' : 'Retourner au laboratoire') + '</button>';
      case 's2r': return '<h2>Ma manipulation</h2><ol class="etapes"><li>Entre dans le laboratoire.</li><li>Fais au moins deux essais, avec des réglages différents.</li><li>Note dans ton cahier ce que tu observes, essai par essai.</li></ol>'
        + cite('Mon hypothèse', S.hyp) + (S.obs ? cite('Mes observations', S.obs) : '') + '<div class="note">Chaque idée que tu écris dans ton cahier reste aussi dans ton livre.</div>' + ouvre('Écrire dans mon cahier');
      case 's3l': return '<h1>Ce que dit l’expérience</h1>' + cite('Mes observations', S.obs) + cite('Ma confrontation', S.comp) + '<button type="button" class="btn large" data-resume>Revoir le résumé animé</button>' + (S.m === 7 ? ouvre('Écrire mon bilan dans mon cahier') : '');
      case 's3r': return '<h2>Le bilan scientifique</h2><div class="tab"><div class="bs"><ul>' + (L.retiens || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>'
        + '<button type="button" class="lang' + (S.m >= 8 && S.vuBilan ? ' up' : '') + '"' + (S.m >= 8 && !S.vuBilan ? ' data-auto' : '') + ' disabled>Écris d’abord ton bilan dans ton cahier. Cette page s’ouvrira ensuite.</button></div>' + (S.m === 8 ? ouvre('Je compare dans mon cahier') : '');
      case 's4l': return '<h1>Le défi</h1><p class="hook">' + L.quiz.length + ' manches, seul ou en équipe. Une erreur ne retire rien : chaque manche t’explique la réponse.</p><p class="stars" aria-label="' + (S.q.length ? etoiles() : 0) + ' étoiles sur 3">' + stars(S.q.length ? etoiles() : 0) + '</p><p>Score : ' + score() + ' sur ' + L.quiz.length + '.</p><div class="note">Ton score s’écrit dans ton cahier.</div>';
      case 's4r': return defi();
    }
    return '';
  }
  function defi() {
    var n = L.quiz.length, tete = mode === 'sgl' ? '<h2>Le défi</h2>' : '';
    if (S.m < 9) return tete + '<p>Termine d’abord ton cahier.</p>';
    if (S.fini) return '<h2>Défi terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p class="hook">' + score() + ' manches réussies sur ' + n + '.</p><div class="note">Ta leçon est complète : ton cahier et ton livre gardent tout ce que tu as écrit.</div>' + ouvre('Voir mon cahier') + '<a class="go bas" href="./" style="display:flex;align-items:center;justify-content:center;text-decoration:none">Retour au sommaire</a>';
    var i = S.q.length, q = L.quiz[i];
    return tete + '<p class="tag"><span>Manche ' + (i + 1) + ' sur ' + n + '</span></p><h2>' + q.q + '</h2><div class="ch" data-dq role="group" aria-label="Réponses possibles">' + q.o.map(function (o, k) { return '<button type="button" data-i="' + k + '">' + o + '</button>'; }).join('') + '</div><div data-dx aria-live="polite"></div>';
  }
  function tag(id) { var c = CH_OF[id]; return '<div class="tag"><span>Chapitre ' + (c + 1) + ' · ' + CHAP[c] + '</span><span>' + MOML[id] + '</span></div>'; }
  function page(id, side) { return '<div class="page ' + side + '" data-pg="' + id + '">' + tag(id) + contenu(id) + '</div>'; }
  function nu(id, side) { return page(id, side).replace(/ id="[^"]*"/g, ''); }

  /* ---------- cahier ---------- */
  function bt(id, txt, dis) { return '<button type="button" class="bt go2" id="' + id + '"' + (dis ? ' disabled' : '') + '>' + txt + '</button>'; }
  function zoneEcrite(m, label, ph) { var c = CHAMPS[m]; return '<label class="lab" for="t' + c + '">' + label + '</label><textarea id="t' + c + '" maxlength="600" placeholder="' + esc(ph || '') + '">' + esc(S[c]) + '</textarea><p class="msg" id="msg' + m + '" aria-live="polite"></p>'; }
  var LIVRE = function () { return mode === 'desk' ? 'dans le livre, à gauche' : 'dans le livre'; };
  function actif(m) {
    var I = L.inquiry || {}, h = '';
    if (m === 1) h = '<p class="lead">Lis la situation ' + LIVRE() + '.</p><p class="pb"><b>Question :</b> ' + esc(I.situation || '') + '</p>' + bt('c1', 'Je me mets au travail');
    else if (m === 2) h = zoneEcrite(2, 'Avec mes mots, je réponds à la question. Je peux me tromper : c’est le début de la recherche.', 'Je pense que…') + '<button type="button" class="bt ghost" data-resume>Besoin d’aide ? Le résumé animé</button>' + bt('c2', 'J’écris ma réponse');
    else if (m === 3) h = cite('Ma première réponse', S.rep) + zoneEcrite(3, esc(I.prediction || 'Je prévois et je justifie avec « car ».'), 'Je prévois que… car…') + bt('c3', 'Je valide et je passe au laboratoire');
    else if (m === 4) h = '<p class="lead">Entre dans le laboratoire ' + LIVRE() + '. Fais au moins deux essais avec des réglages différents.</p><button type="button" class="bt ghost" data-labo>Ouvrir le laboratoire</button>' + bt('c4', 'J’ai fini ma manipulation', !S.labo);
    else if (m === 5) h = zoneEcrite(5, 'Je note les réglages et ce que j’observe, essai par essai.', 'Essai 1 : … J’observe que…') + '<button type="button" class="bt ghost" data-labo>Rouvrir le laboratoire</button>' + bt('c5', 'J’écris mes observations');
    else if (m === 6) h = cite('Mon hypothèse', S.hyp) + cite('Mes observations', S.obs) + zoneEcrite(6, 'Mes résultats confirment-ils mon hypothèse ? Je justifie avec « car ».', 'Mon hypothèse est… car…') + bt('c6', 'Je continue');
    else if (m === 7) h = '<p class="lead">Relis « Ce que dit l’expérience » ' + LIVRE() + '.</p><p><b>Pour réussir mon bilan :</b></p><ul class="crit">' + crit().map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' + zoneEcrite(7, 'Quelle règle est-ce que je retiens ?', 'Je retiens que…') + bt('c7', 'J’ouvre le bilan scientifique');
    else if (m === 8) h = '<p class="lead">Le bilan scientifique est ouvert ' + LIVRE() + '. Je le compare au mien.</p>' + cite('Mon bilan', S.bilan) + '<div class="choix" role="group" aria-label="Mon bilan était"><button type="button" data-cmp="0" aria-pressed="' + (S.cmp === 0) + '">Il était complet</button><button type="button" data-cmp="1" aria-pressed="' + (S.cmp === 1) + '">Il est à compléter</button></div>' + bt('c8', 'Passer au défi', S.cmp == null);
    else h = '<p class="lead">Relève le défi ' + LIVRE() + '. Ton score s’écrit ici.</p><p>Manches jouées : ' + S.q.length + ' sur ' + L.quiz.length + ' · réussies : ' + score() + '</p>';
    return entree(m, 'actif', h);
  }
  function recap(m) {
    var c = CHAMPS[m], h;
    if (m === 1) h = '<p class="rec">' + esc((L.inquiry || {}).situation || '') + '</p>';
    else if (c) h = '<p class="ecrit">' + esc(S[c]) + '</p>';
    else if (m === 4) h = '<p class="rec">Manipulation faite dans le laboratoire.</p>';
    else if (m === 8) h = '<p class="rec">Comparé au bilan scientifique : mon bilan ' + (S.cmp === 0 ? 'était complet' : 'est à compléter') + '.</p>';
    else h = '<p class="rec"><b>Défi :</b> ' + score() + ' manches réussies sur ' + L.quiz.length + '.</p>';
    return entree(m, 'fait', h);
  }
  function entree(m, etat, corps) { return '<section class="en ' + etat + '" id="m' + m + '" aria-labelledby="h' + m + '"><span class="no" aria-hidden="true">' + m + '</span><h2 id="h' + m + '"><span class="sr">Moment ' + m + ' sur 9 : </span>' + TITRES[m - 1] + '</h2>' + corps + '</section>'; }
  function fin() { return '<section class="fin" id="fin"><h2>Mon cahier est terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p><b>À retenir :</b></p><ul class="crit">' + (L.retiens || []).slice(0, 3).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul><button type="button" class="bt go2" id="imp">Imprimer mon cahier</button><button type="button" class="bt ghost" id="again">Recommencer la leçon</button></section>'; }
  function aFaire() { return !S.fini && S.m !== 9 && !(S.m === 4 && !S.labo); }
  function rendreCahier(defile) {
    var h = '', m;
    for (m = 1; m <= S.m; m++) h += (m === S.m && !(m === 9 && S.fini)) ? actif(m) : recap(m);
    if (S.fini) h += fin();
    var cb = $('#cb'); cb.innerHTML = h;
    $('#cbProg').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { return '<i' + (i <= S.m ? ' class="on"' : '') + '></i>'; }).join('');
    $('#cbProg').setAttribute('aria-label', 'Moment ' + S.m + ' sur 9'); $('#cbCount').textContent = 'Moment ' + S.m + ' sur 9';
    $('#cbKick').innerHTML = esc(L.title) + ' · 5e · <b>Prototype</b>';
    $('#bCahier').classList.toggle('afaire', aFaire());
    lierCahier(cb);
    if (defile) { var el = S.fini ? $('#fin') : $('#m' + S.m); if (el) { try { cb.scrollTo({ top: el.offsetTop - 12, behavior: anim ? 'smooth' : 'auto' }); } catch (e) { cb.scrollTop = el.offsetTop - 12; } } }
  }
  function lierCahier(r) {
    var m = S.m, c = CHAMPS[m];
    $$('[data-resume]', r).forEach(function (b) { b.onclick = function () { cadre('resume', b); }; });
    $$('[data-labo]', r).forEach(function (b) { b.onclick = function () { cadre('sim', b); }; });
    if (S.fini) { $('#imp').onclick = function () { window.print(); }; $('#again').onclick = recommencer; return; }
    var go = $('#c' + m);
    if (c) {
      var ta = $('#t' + c);
      ta.oninput = function () { S[c] = ta.value; sauve(); };
      go.onclick = function () {
        var v = ta.value.trim();
        if (v.length < 3) { $('#msg' + m).textContent = 'Écris au moins quelques mots. Tu peux te tromper.'; ta.focus(); return; }
        S[c] = v; sauve(); vole(ta, v); avance();
      };
    } else if (m === 1) go.onclick = avance;
    else if (m === 4) go.onclick = function () { if (S.labo) avance(); };
    else if (m === 8) {
      $$('[data-cmp]', r).forEach(function (b) { b.onclick = function () { S.cmp = +b.getAttribute('data-cmp'); sauve(); $$('[data-cmp]', r).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); go.disabled = false; }; });
      go.onclick = function () { if (S.cmp != null) avance(); };
    }
  }
  /* ce que l'élève écrit s'envole du cahier vers le livre */
  function vole(src, txt) {
    if (!anim || !window.requestAnimationFrame || mode !== 'desk') return;
    var a = src.getBoundingClientRect(), b = $('#fit').getBoundingClientRect(), e = document.createElement('div');
    e.className = 'vol'; e.textContent = txt.length > 90 ? txt.slice(0, 88) + '…' : txt; e.style.left = a.left + 'px'; e.style.top = a.top + 'px'; document.body.appendChild(e);
    requestAnimationFrame(function () { requestAnimationFrame(function () { e.style.transform = 'translate(' + (b.left + b.width * 0.55 - a.left) + 'px,' + (b.top + b.height * 0.35 - a.top) + 'px) rotate(-4deg) scale(.7)'; e.style.opacity = '0'; }); });
    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 850);
  }

  /* ---------- progression : le livre suit le cahier ---------- */
  function cible(m) { var t = { 4: [1, 2], 7: [2, 4], 8: [2, 5], 9: [3, 6] }[m]; return t ? (mode === 'sgl' ? t[1] : t[0]) : null; }
  function avance() {
    S.m = Math.min(9, S.m + 1); sauve(); rendreCahier(true);
    var t = cible(S.m);
    if (t != null && t !== posCour()) { fermeCahier(); if (anim) setTimeout(function () { aller(t); }, mode === 'desk' ? 250 : 420); else aller(t); }
    else monte();
  }
  function recommencer() { var nom = S.nom; S = vierge(); S.nom = nom; sauve(); rendreCahier(false); fermeCahier(); aller(0, true); }
  function posCour() { return mode === 'sgl' ? S.pos : SGL2SP[S.pos]; }
  function setPos(t) { S.pos = mode === 'sgl' ? t : SP2SGL[t]; sauve(); }
  function maxPos() { return mode === 'sgl' ? SGL.length - 1 : SP.length - 1; }
  function debloque(t) { return t >= 0 && t <= maxPos() && (mode === 'sgl' ? SGL2SP[t] : t) <= spreadDe(S.m); }
  function vus() { return mode === 'sgl' ? [SGL[S.pos]] : SP[SGL2SP[S.pos]]; }

  /* ---------- livre : montage et retournement ---------- */
  function monte() {
    var v = vus();
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(v[0], 'S'); } else { $('#sL').innerHTML = page(v[0], 'L'); $('#sR').innerHTML = page(v[1], 'R'); }
    var bk = $('#book'); lierPages(bk);
    $$('.stage', bk).forEach(function (s) { if (!anim) s.classList.add('up'); else setTimeout(function () { s.classList.add('up'); }, 60); });
    var lg = $('.lang[data-auto]', bk);
    if (lg) { var leve = function () { lg.classList.add('up'); S.vuBilan = 1; sauve(); }; if (anim) setTimeout(leve, 650); else leve(); }
    majNav();
  }
  function lierPages(root) {
    $$('[data-resume]', root).forEach(function (b) { b.onclick = function () { cadre('resume', b); }; });
    $$('[data-labo]', root).forEach(function (b) { b.onclick = function () { cadre('sim', $('.panel', b.closest('.page')) || b); }; });
    $$('[data-ouvre]', root).forEach(function (b) { b.onclick = ouvreCahier; });
    var d = $('[data-pg="s4r"]', root); if (d) liedefi(d);
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

  /* ---------- défi (dans le livre) ---------- */
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
      n.onclick = function () { S.q.push(ok ? 1 : 0); if (S.q.length >= L.quiz.length) S.fini = true; sauve(); rendreCahier(S.fini); monte(); };
    };
  }

  /* ---------- volet : laboratoire et résumé en grand ---------- */
  function ouvreVolet(html, src) {
    var V = $('#volet'); V.innerHTML = html; V.hidden = false;
    var box = $('.labo', V);
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
  function fermeVolet() { var V = $('#volet'); V.hidden = true; V.innerHTML = ''; }
  function cadre(kind, src) {
    var sim = kind === 'sim', t = (sim ? 'Laboratoire · ' : 'Résumé animé · ') + esc(L.title);
    var V = ouvreVolet('<div class="labo" role="dialog" aria-modal="true" aria-label="' + t + '"><div class="lh"><b>' + t + '</b><button type="button" class="go" data-lfin>' + (sim && S.m === 4 ? 'J’ai fini ma manipulation' : 'Revenir au livre') + '</button></div>'
      + '<div class="lcorps"><iframe title="' + t + '" src="../lecon/?l=' + encodeURIComponent(LEC.slug) + '&embed=' + kind + '#' + kind + '" allow="fullscreen"></iframe></div></div>', src);
    if (sim) { S.labo = 1; sauve(); if (S.m === 4) { var c4 = $('#c4'); if (c4) c4.disabled = false; $('#bCahier').classList.toggle('afaire', aFaire()); } }
    $('[data-lfin]', V).onclick = function () { fermeVolet(); if (sim && S.m === 4) avance(); };
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nohoba !== 'studio-h') return;
    var f = $('#volet iframe'); if (f && f.contentWindow === e.source) f.style.height = window.innerWidth < 1000 ? Math.max(560, Math.min(4000, +e.data.h || 0)) + 'px' : '';
  });

  /* ---------- tiroir ---------- */
  function ouvreCahier() { if (mode === 'desk') return; var c = $('#cahier'); c.classList.add('open'); c.inert = false; $('#bCahier').setAttribute('aria-expanded', 'true'); var el = S.fini ? $('#fin') : $('#m' + S.m); if (el) $('#cb').scrollTop = el.offsetTop - 12; setTimeout(function () { var f = $('#cbFerme'); if (f && f.focus) f.focus(); }, 50); }
  function fermeCahier() { if (mode === 'desk') return; var c = $('#cahier'); if (!c.classList.contains('open')) return; c.classList.remove('open'); c.inert = true; $('#bCahier').setAttribute('aria-expanded', 'false'); }

  /* ---------- sommaire et couverture ---------- */
  function etat(slug) {
    var s = lit(cle(slug)); if (!s || typeof s.m !== 'number') return '<small>À découvrir</small>';
    if (s.fini) { var n = (s.q || []).reduce(function (a, b) { return a + b; }, 0); return '<small class="ok">Terminée · ' + n + '/' + (s.q || []).length + '</small>'; }
    return '<small>Moment ' + s.m + ' sur 9</small>';
  }
  function tocTheme(t, k) { return '<h2>' + (k + 1) + '. ' + esc(t.nm) + '</h2>' + t.les.map(function (l) { return '<a href="?l=' + l.slug + '"><span>' + esc(l.t) + '</span>' + etat(l.slug) + '</a>'; }).join(''); }
  function sommaire() {
    document.body.classList.add('somm');
    var tete = '<div class="tag"><span>NOHOBA-Lab · Physique-chimie 5e</span><span>Prototype</span></div>';
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = '<div class="page S" style="overflow:auto">' + tete + '<h1>Sommaire</h1><div class="toc">' + THEMES.map(tocTheme).join('') + '</div></div>'; }
    else {
      $('#sL').innerHTML = '<div class="page L">' + tete + '<h1>Sommaire</h1><div class="toc">' + tocTheme(THEMES[0], 0) + tocTheme(THEMES[1], 1) + '</div></div>';
      $('#sR').innerHTML = '<div class="page R">' + tete + '<div class="toc">' + tocTheme(THEMES[2], 2) + tocTheme(THEMES[3], 3) + '</div><div class="note">Dans chaque leçon, le livre s’ouvre à gauche et ton cahier de labo se remplit à droite.</div></div>';
    }
  }
  function couverture() {
    var c = $('#couv'), bk = $('#book');
    c.innerHTML = '<div class="f"><span class="cv-k">NOHOBA-Lab</span><p class="cv-t">Mon cartable de physique-chimie</p><span class="cv-n">5e</span><button type="button" class="cv-go" data-ouvrir>Ouvrir mon livre</button></div><div class="b"></div>';
    c.hidden = false; c.classList.remove('ouvert'); bk.classList.add('ferme');
    $('[data-ouvrir]', c).onclick = function () {
      audio(); papier(); bk.classList.remove('ferme'); c.classList.add('ouvert');
      try { sessionStorage.setItem('pc-livre-ouvert', '1'); } catch (e) {}
      setTimeout(function () { c.hidden = true; }, anim ? 1100 : 0);
    };
  }

  /* ---------- barre et mise à l'échelle ---------- */
  function majNav() {
    if (!LEC) return;
    var c = posCour(), ch0 = SGL2SP[S.pos];
    $('#dots').innerHTML = CHAP.map(function (t, i) { var ok = i <= spreadDe(S.m); return '<button type="button" data-c="' + i + '" aria-label="Chapitre ' + (i + 1) + ', ' + t + (ok ? '' : ', pas encore ouvert') + '"' + (ch0 === i ? ' aria-current="step"' : '') + (ok ? '' : ' disabled') + '>' + (i + 1) + '</button>'; }).join('');
    $('#prev').disabled = c === 0; $('#next').disabled = !debloque(c + 1);
    $('#bCahier').classList.toggle('afaire', aFaire());
  }
  function ajuste() {
    var W = window.innerWidth, H = window.innerHeight, old = mode;
    mode = LEC && W >= 1100 && H >= 560 ? 'desk' : W >= 760 ? 'dbl' : 'sgl';
    var B = document.body; B.classList.toggle('desk', mode === 'desk'); B.classList.toggle('sgl', mode === 'sgl'); B.classList.toggle('anim', anim);
    document.documentElement.style.setProperty('--tilt', mode === 'sgl' ? '0deg' : '10deg');
    var cah = $('#cahier'); if (mode === 'desk') { cah.classList.remove('open'); cah.inert = false; } else if (!cah.classList.contains('open')) cah.inert = true;
    var f = $('#fit'), s = $('#scale'), bw = mode === 'sgl' ? 510 : 1000, bh = mode === 'sgl' ? 875 : 905, k = Math.min(f.clientWidth / bw, f.clientHeight / bh) || 0.5;
    s.style.width = (mode === 'sgl' ? 480 : 960) + 'px'; s.style.height = '840px'; s.style.transform = 'scale(' + k + ')';
    var c = mode === 'sgl';
    $('#prev').textContent = c ? '←' : '← Précédent'; $('#next').textContent = c ? '→' : 'Suivant →';
    $('#bAnim').textContent = c ? (anim ? 'Anim.' : 'Figé') : (anim ? 'Animations' : 'Animations arrêtées');
    $('#bSon').textContent = son ? 'Son' : 'Muet';
    var sm = $('#bSom'); sm.textContent = c ? '≡' : 'Sommaire'; sm.setAttribute('aria-label', 'Sommaire');
    return old !== mode;
  }
  function dec(d) { var c = posCour() + d; if (debloque(c)) aller(c); }

  /* ---------- sons ---------- */
  var AC = null;
  function audio() { if (!son) return null; try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
  function clic() { var a = audio(); if (!a) return; try { var o = a.createOscillator(), g = a.createGain(); o.frequency.value = 1300; g.gain.setValueAtTime(0.04, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.06); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.07); } catch (e) {} }
  function papier() { var a = AC && son ? AC : null; if (!a) return; try { var n = a.sampleRate * 0.28, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n); var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'highpass'; fl.frequency.value = 1800; g.gain.value = 0.05; s.buffer = b; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(); } catch (e) {} }

  /* ---------- chargement des données d'une leçon ---------- */
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
    ajuste();
    $('#prev').onclick = function () { dec(-1); }; $('#next').onclick = function () { dec(1); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var c = +b.getAttribute('data-c'); aller(mode === 'sgl' ? SP2SGL[c] : c); };
    $('#bCahier').onclick = function () { if ($('#cahier').classList.contains('open')) fermeCahier(); else ouvreCahier(); };
    $('#cbFerme').onclick = fermeCahier;
    $('#bSon').onclick = function () { son = !son; this.setAttribute('aria-pressed', son); ajuste(); };
    $('#bAnim').onclick = function () { anim = !anim; this.setAttribute('aria-pressed', anim); ajuste(); };
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (!$('#volet').hidden) fermeVolet(); else fermeCahier(); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !$('#volet').hidden || !LEC) return;
      if (e.key === 'ArrowRight') dec(1); if (e.key === 'ArrowLeft') dec(-1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null || !LEC) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) dec(d < 0 ? 1 : -1); x0 = null; }, { passive: true });
    var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var ch = ajuste(); ajuste(); if (ch && !busy) { if (!LEC) sommaire(); else { monte(); rendreCahier(false); } } }, 120); });
    if (!LEC) {
      sommaire(); var deja = false; try { deja = sessionStorage.getItem('pc-livre-ouvert') === '1'; } catch (e) {}
      if (!deja && anim) couverture();
      return;
    }
    document.title = LEC.t + ' · Mon cartable de physique-chimie · NOHOBA-Lab';
    S = charge(LEC.slug);
    var nom = $('#nom'); nom.value = S.nom || ''; nom.oninput = function () { S.nom = nom.value; sauve(); };
    try { $('#cbDate').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}
    $('#sR').innerHTML = '<div class="page S"><p class="hook">Ouverture de la leçon…</p></div>';
    charger(function (err) {
      if (err) { $('#sR').innerHTML = '<div class="page S"><h2>Leçon indisponible</h2><p>Impossible de charger cette leçon.</p><a class="go bas" href="./">Retour au sommaire</a></div>'; return; }
      ajuste(); ajuste();
      if (!debloque(posCour())) setPos(cible(S.m) != null ? cible(S.m) : 0);
      monte(); rendreCahier(S.m > 1);
    });
  }
  window.NohobaLivre = { lecons: function () { return LECONS.map(function (l) { return l.slug; }); } };
  init();
})();
