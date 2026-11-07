/* NOHOBA-Lab · Mon cartable de physique-chimie (5e) : le parcours du cartable appliqué aux 13 leçons.
   Le livre raconte, ouvre la fiche d'investigation (six opérations) dans un volet, reprend en lecture seule ce que l'élève y a écrit,
   donne le bilan de chaque fiche, puis propose le défi. Il n'y a plus de cahier : la fiche est l'unique zone d'écriture (« pc-act-<id> »).
   La simulation d'origine reste accessible par « Explorer librement ». Après l'investigation (moment 8) et au défi, le « modèle vivant » du livre vivant
   (/livre-vivant/?l=<slug>&embed=1) s'ouvre dans le volet : un modèle à manipuler, « Prédis puis révèle » et une vérification par chapitre (progression « vv-<slug> »).
   Parcours allégé : les leçons sans fiche d'investigation (6e, 4e, 3e pour l'instant) suivent cinq étapes sans verrou : situation et résumé, modèle vivant, À retenir,
   vérification, défi. Dès qu'une leçon reçoit ses fiches (FICHES5E), elle passe au parcours à 9 moments.
   Progression du livre : « pc-livre-<slug> ». Rien n'est envoyé. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lit(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function ecrit(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /* ---------- les leçons prêtes de chaque niveau (6e, 5e, 4e, 3e) ---------- */
  var NIVEAUX = ['6e', '5e', '4e', '3e'], NIVS = {}, LECONS = [];
  NIVEAUX.forEach(function (n) {
    var themes = [];
    ((window.PROGRAMME && window.PROGRAMME[n]) || []).forEach(function (th) {
      var t = { nm: th.nm, les: [] };
      th.les.forEach(function (l) { if (l.ready) { var x = { slug: l.slug, t: l.t, th: th.nm, kit: l.kit, niv: n }; LECONS.push(x); t.les.push(x); } });
      if (t.les.length) themes.push(t);
    });
    NIVS[n] = themes;
  });
  var SLUG = ((/[?&]l=([a-z0-9-]+)/.exec(location.search) || [])[1]) || '';
  var LEC = LECONS.filter(function (x) { return x.slug === SLUG; })[0] || null;
  var NIV = LEC ? LEC.niv : ((/[?&]n=(6e|5e|4e|3e)(&|$)/.exec(location.search) || [])[1] || '5e');

  /* fiches d'investigation de 5e (page activites-5e) reliées au moment « laboratoire » */
  var FICHES5E = { 'intensite': [['NL-5E-ELE-01', 'La lampe use-t-elle le courant ?']], 'generateur-recepteur': [['NL-5E-ELE-02', 'Choisir un générateur']], 'association-lampes': [['NL-5E-ELE-03', 'Deux lampes, deux montages']], 'piles-serie': [['NL-5E-ELE-04', 'Associer des piles en série']], 'tension': [['NL-5E-ELE-05', 'Mesurer une tension']],
    'pression-atmospherique': [['NL-5E-MES-01', 'Trois expériences avec l’air'], ['NL-5E-MES-02', 'Pression et altitude']], 'melanges': [['NL-5E-MEL-01', 'Classer les mélanges'], ['NL-5E-MEL-02', 'Séparer un mélange hétérogène'], ['NL-5E-MEL-03', 'Séparer un mélange homogène']],
    'atomes-molecules': [['NL-5E-MAT-01', 'Lire une formule'], ['NL-5E-MAT-02', 'Corps simple, corps composé']], 'combustion-carbone': [['NL-5E-MAT-03', 'Brûler du carbone']], 'combustion-soufre': [['NL-5E-MAT-04', 'Brûler du soufre']],
    'dilatation-solides': [['NL-5E-DIL-01', 'Un solide chauffé'], ['NL-5E-DIL-02', 'Des métaux différents']], 'dilatation-liquides': [['NL-5E-DIL-03', 'Un liquide chauffé']], 'dilatation-gaz': [['NL-5E-DIL-04', 'Un gaz chauffé']] };
  /* parcours allégé : leçon sans fiche d'investigation */
  var ALG = !!LEC && !FICHES5E[LEC.slug];
  function fichesL() { return (LEC && FICHES5E[LEC.slug]) || []; }
  function cleFiche(id) { return 'FICHE_5E_' + id.slice(6, 9) + id.slice(-2); }
  function ficheEtat(id) {
    var t = lit('pc-act-' + id) || {}, e = Array.isArray(t.essais) ? t.essais.length : 0, c = typeof t.conclusion === 'string' ? t.conclusion.trim() : '';
    return { prev: t.prevision && t.prevision.raison ? t.prevision.raison : '', essais: e, concl: c, stade: c ? 6 : t.confront ? 5 : e ? 4 : t.prevision ? 3 : 0 };
  }
  /* progression du modèle vivant (écrite par /livre-vivant/ dans « vv-<slug> ») : vérifications réussies */
  function vivantEtat() { var v = LEC && lit('vv-' + LEC.slug), n = v && Array.isArray(v.ok) ? v.ok.filter(Boolean).length : 0; return n ? ' · ' + n + ' vérification' + (n > 1 ? 's' : '') + ' réussie' + (n > 1 ? 's' : '') : ''; }
  function btnVivant(txt) { return '<button type="button" class="btn large" data-vivant>' + txt + '</button><p class="sm">Un modèle se dresse sur la page : tu le manipules, tu l’écoutes, tu vérifies' + vivantEtat() + '.</p>'; }
  function statut(x) { var e = ficheEtat(x[0]); return e.concl ? ['Terminée ✓', 'ok'] : e.stade ? ['En cours', 'en'] : ['À faire', 'af']; }
  function nbFinies(slug) { return (FICHES5E[slug] || []).filter(function (x) { return ficheEtat(x[0]).concl; }).length; }
  var CHAP = ['Situation-problème et analyse', 'Investigation', 'Bilan scientifique', 'Défi'], NUMS = ['1-2', '3-7', '8', '9'];
  var SP = [['s1l', 's1r'], ['s2l', 's2r'], ['s3l', 's3r'], ['s4l', 's4r']];
  var SGL = ['s1l', 's1r', 's2l', 's2r', 's3l', 's3r', 's4r'], SGL2SP = [0, 0, 1, 1, 2, 2, 3], SP2SGL = [0, 2, 4, 6];
  var CH_OF = { s1l: 0, s1r: 0, s2l: 1, s2r: 1, s3l: 2, s3r: 2, s4l: 3, s4r: 3 };
  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var MOMS = { s1l: [1, 2], s1r: [1, 2], s2l: [3, 7], s2r: [3, 7], s3l: [8, 8], s3r: [8, 8], s4l: [9, 9], s4r: [9, 9] };
  /* nombre de moments terminés (1 à 9), déduit des fiches : la fiche porte les moments 3 à 7 */
  function faits() {
    if (!S || !S.start) return 0;
    if (ALG) return S.fini ? 5 : vvOk() ? 4 : 2;
    var mx = 0, n = fichesL(), fin = 0; n.forEach(function (x) { var e = ficheEtat(x[0]); if (e.concl) fin++; if (e.stade > mx) mx = e.stade; });
    if (S.fini) return 9;
    if (n.length && fin === n.length) return S.q.length ? 8 : 7;
    return mx >= 6 ? 7 : mx === 5 ? 6 : mx === 4 ? 4 : mx === 3 ? 3 : 2;
  }
  function frise(id) {
    var d = faits(), r = MO(id), h = '', N = ALG ? 5 : 9;
    for (var i = 1; i <= N; i++) h += '<i class="' + (i <= d ? 'ok' : '') + (i >= r[0] && i <= r[1] ? ' ici' : '') + '"></i>';
    return '<div class="frise" role="img" aria-label="' + d + (ALG ? ' étapes terminées sur 5' : ' moments terminés sur 9') + '">' + h + '</div>';
  }
  /* parcours allégé : cinq étapes */
  var CHAP_A = ['Situation et résumé', 'Manipulation', 'À retenir', 'Défi'], NUMS_A = ['1-2', '3', '4', '5'];
  var MOMS_A = { s1l: [1, 2], s1r: [1, 2], s2l: [3, 3], s2r: [3, 3], s3l: [4, 4], s3r: [4, 4], s4l: [5, 5], s4r: [5, 5] };
  var ETAPES = ['Je lis la situation', 'Je regarde le résumé animé', 'Je manipule le modèle vivant et je vérifie', 'Je lis ce qu’il faut retenir', 'Je relève le défi'];
  function CH() { return ALG ? CHAP_A : CHAP; }
  function NU() { return ALG ? NUMS_A : NUMS; }
  function MO(id) { return (ALG ? MOMS_A : MOMS)[id]; }
  function vvOk() { var v = LEC && lit('vv-' + LEC.slug); return v && Array.isArray(v.ok) ? v.ok.filter(Boolean).length : 0; }
  var MOML = { s1l: 'Moments 1 et 2', s1r: 'Moments 1 et 2', s2l: 'Moments 3 à 7', s2r: 'Moments 3 à 7', s3l: 'Moment 8', s3r: 'Moment 8', s4l: 'Moment 9', s4r: 'Moment 9' };

  /* ---------- état ---------- */
  var L = null, S = null, FI = {}, mode = 'dbl', anim = true, son = true, busy = false;
  function cle(slug) { return 'pc-livre-' + slug; }
  function vierge() { return { m: 1, start: 0, q: [], fini: false, pos: 0 }; }
  function charge(slug) { var v = lit(cle(slug)); if (!v || typeof v.m !== 'number' || !Array.isArray(v.q)) return vierge(); v.m = Math.min(9, Math.max(1, Math.round(v.m))); v.pos = Math.min(6, Math.max(0, v.pos | 0)); v.start = v.start || (v.m > 1 ? 1 : 0); return v; }
  function sauve() { if (LEC) ecrit(cle(LEC.slug), S); }
  function score() { return S.q.reduce(function (a, b) { return a + b; }, 0); }
  function etoiles() { var n = L.quiz.length, s = score(); return s >= n - 1 ? 3 : s >= Math.ceil(n / 2) ? 2 : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function spreadDe(m) { return m <= 2 ? 0 : m <= 7 ? 1 : m === 8 ? 2 : 3; }
  /* l'état du livre se déduit des fiches : rien à cocher à la main */
  function majEtat() {
    if (ALG) { S.m = S.start || S.fini ? 9 : 1; sauve(); return; }   /* sans fiche : rien n'est verrouillé une fois la situation lue */
    var f = fichesL(), fin = 0, mx = 0;
    f.forEach(function (x) { var e = ficheEtat(x[0]); if (e.concl) fin++; if (e.stade > mx) mx = e.stade; });
    var m = !S.start ? 1 : fin ? 8 : 3;
    if (S.start && f.length && fin === f.length) m = 9;
    if (S.fini) m = 9;
    S.m = m; sauve();
  }

  /* ---------- illustrations (une par thème) ---------- */
  function illustration() {
    if (ALG) return '<svg viewBox="0 0 300 200" role="img" aria-label="Un erlenmeyer et un atome : un modèle à manipuler"><path d="M120 30h40v50l40 70a12 12 0 0 1-10 18H90a12 12 0 0 1-10-18l40-70z" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><path d="M96 130h108l12 20a8 8 0 0 1-7 12H91a8 8 0 0 1-7-12z" fill="#7FB8E6"/><circle cx="140" cy="142" r="4" fill="#fff"/><circle cx="170" cy="150" r="3" fill="#fff"/><g transform="translate(235 60)" fill="none" stroke="#243049" stroke-width="2.5"><ellipse rx="34" ry="12"/><ellipse rx="34" ry="12" transform="rotate(60)"/><ellipse rx="34" ry="12" transform="rotate(-60)"/><circle r="6" fill="#C2410C" stroke="none"/></g></svg>';
    var A = window.NohobaAtelier, th = LEC.th;
    if (/Électricité|Mesure/.test(th) && LEC.slug !== 'pression-atmospherique' && A && A.montageSerie) return A.montageSerie({ inter: 'ferme' }).svg;
    if (LEC.slug === 'pression-atmospherique') return '<svg viewBox="0 0 300 200" role="img" aria-label="Seringue bouchée et manomètre"><rect x="40" y="80" width="170" height="44" rx="8" fill="#DCEBFA" stroke="#243049" stroke-width="3"/><rect x="210" y="92" width="60" height="20" rx="4" fill="#243049"/><rect x="70" y="84" width="10" height="36" fill="#243049"/><circle cx="150" cy="50" r="30" fill="#fff" stroke="#243049" stroke-width="3"/><path d="M150 50 L170 34" stroke="#C2410C" stroke-width="4" stroke-linecap="round"/><path d="M150 80 V84" stroke="#243049" stroke-width="3"/></svg>';
    if (/Mélanges/.test(th)) return '<svg viewBox="0 0 300 200" role="img" aria-label="Bécher, flacon et flamme"><path d="M60 40 V170 a10 10 0 0 0 10 10 H150 a10 10 0 0 0 10 -10 V40" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><path d="M62 110 H158 V170 a8 8 0 0 1 -8 8 H70 a8 8 0 0 1 -8 -8z" fill="#7FB8E6"/><circle cx="90" cy="140" r="5" fill="#fff"/><circle cx="120" cy="125" r="4" fill="#fff"/><path d="M215 60 h30 v30 l20 70 a10 10 0 0 1 -10 12 h-50 a10 10 0 0 1 -10 -12 l20 -70z" fill="#FFF4E0" stroke="#243049" stroke-width="3"/><path d="M240 30 q12 14 0 26 q-12 -12 0 -26" fill="#F97316"/></svg>';
    return '<svg viewBox="0 0 300 200" role="img" aria-label="Thermomètre, ballon et bain"><rect x="30" y="110" width="200" height="70" rx="6" fill="#7FB8E6" stroke="#243049" stroke-width="3"/><circle cx="130" cy="120" r="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><rect x="122" y="56" width="16" height="34" fill="#EEF5FF" stroke="#243049" stroke-width="3"/><ellipse cx="130" cy="44" rx="16" ry="18" fill="#E85A4F"/><rect x="250" y="30" width="16" height="130" rx="8" fill="#fff" stroke="#243049" stroke-width="3"/><rect x="254" y="90" width="8" height="64" fill="#E85A4F"/><circle cx="258" cy="164" r="13" fill="#E85A4F" stroke="#243049" stroke-width="3"/></svg>';
  }

  /* ---------- pages du livre ---------- */
  function pop(cls) { return '<div class="stage ' + (cls || '') + '"><div class="psh"></div><div class="panel">' + illustration() + '</div></div>'; }
  function cite(titre, v) { return '<div class="cite"><b>' + titre + '</b><p class="ecrit">' + (v && v.trim() ? esc(v) : '…') + '</p></div>'; }
  function listeFiches() {
    if (!S.start) return '<div class="note">Lis d’abord la situation, puis appuie sur « Je me mets au travail ».</div>';
    return '<ul class="fl">' + fichesL().map(function (x) { var st = statut(x); return '<li><a href="../activites-5e/?a=' + x[0] + '" data-fiche="' + x[0] + '" data-titre="' + esc(x[1]) + '"><span>' + esc(x[1]) + '</span><small class="' + st[1] + '">' + st[0] + '</small></a></li>'; }).join('') + '</ul>';
  }
  /* pages du parcours allégé (les pages non listées ici restent celles du livre) */
  function contenuA(id) {
    var I = L.inquiry || {};
    switch (id) {
      case 's1l': return '<p class="th">' + esc(L.theme || LEC.th) + '</p><h1>' + esc(L.title || LEC.t) + '</h1><p class="hook">' + esc(I.situation || '') + '</p>'
        + '<div class="note">Dans cette leçon, tu manipules un modèle, tu retiens l’essentiel, puis tu relèves un défi. Rien n’est verrouillé.</div>'
        + (S.start ? '' : '<button type="button" class="go bas" data-start>Je me mets au travail</button>');
      case 's2l': return '<h2>Le laboratoire</h2><p class="hook">Prédis, manipule, vérifie : un modèle se dresse sur la page.</p>' + pop('') + btnVivant('Ouvrir le modèle vivant') + '<button type="button" class="libre" data-labo>Explorer librement la simulation</button>';
      case 's2r': return '<h2>Mon parcours</h2><ol class="mom">' + ETAPES.map(function (t, k) { var n = k + 1, d = faits(), cl = n <= d ? 'ok' : n === d + 1 ? 'en' : '', det = n === 3 && vvOk() ? '<em>' + vvOk() + ' vérification' + (vvOk() > 1 ? 's' : '') + ' réussie' + (vvOk() > 1 ? 's' : '') + '</em>' : '';
          return '<li class="' + cl + '"><b>' + n + '. ' + esc(t) + '</b>' + det + '</li>'; }).join('') + '</ol><div class="note">Pas de fiche d’investigation pour cette leçon pour le moment : le modèle vivant sert de laboratoire.</div>';
      case 's3l': return '<h1>À retenir</h1><ul class="ret">' + (L.retiens || []).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul><button type="button" class="libre" data-resume>Revoir le résumé animé</button>';
      case 's3r': return '<h2>Je vérifie</h2><p class="hook">Reviens au modèle pour contrôler ce que tu retiens : prédis, regarde, réponds.</p>' + pop('') + btnVivant('Vérifier avec le modèle vivant');
    }
    return null;
  }
  function contenu(id) {
    if (ALG) { var a = contenuA(id); if (a != null) return a; }
    var I = L.inquiry || {}, F = fichesL();
    switch (id) {
      case 's1l': return '<p class="th">' + esc(L.theme || LEC.th) + '</p><h1>' + esc(L.title || LEC.t) + '</h1><p class="hook">' + esc(I.situation || '') + '</p>'
        + '<div class="note">Tu écris dans la fiche d’investigation : ton hypothèse, tes essais, ta conclusion. Le livre garde tout et te montre où tu en es.</div>'
        + (S.start ? '' : '<button type="button" class="go bas" data-start>Je me mets au travail</button>');
      case 's1r': return '<h2>Regarde avant de chercher</h2>' + pop('') + '<p>Un résumé animé d’une minute présente la situation. Tu peux le regarder maintenant ou plus tard.</p><button type="button" class="btn large" data-resume>Regarder le résumé animé</button>';
      case 's2l': return '<h2>Le laboratoire</h2><p class="hook">Mène l’investigation : la fiche te guide en six opérations.</p>' + pop('') + listeFiches() + '<button type="button" class="libre" data-labo>Explorer librement la simulation</button>';
      case 's2r': return '<h2>Mes 9 moments</h2><ol class="mom">' + TITRES.map(function (t, k) { var n = k + 1, d = faits(), cl = n <= d ? 'ok' : n === d + 1 ? 'en' : '', det = '';
          if (n === 3 && S.start) det = F.map(function (x) { var e = ficheEtat(x[0]); return e.prev ? '<em>' + esc(x[1]) + ' : ' + esc(e.prev) + '</em>' : ''; }).join('');
          if (n === 4 && S.start) det = F.map(function (x) { var e = ficheEtat(x[0]); return e.essais ? '<em>' + esc(x[1]) + ' : ' + e.essais + ' essai' + (e.essais > 1 ? 's' : '') + '</em>' : ''; }).join('');
          if (n === 7 && S.start) det = F.map(function (x) { var e = ficheEtat(x[0]); return e.concl ? '<em>' + esc(x[1]) + ' : ' + esc(e.concl) + '</em>' : ''; }).join('');
          return '<li class="' + cl + '"><b>' + n + '. ' + esc(t) + '</b>' + det + '</li>'; }).join('') + '</ol><div class="note">Les moments 3 à 7 se font dans la fiche. Ce que tu y écris apparaît ici.</div>';
      case 's3l': return '<h1>Ce que dit l’expérience</h1>' + (F.filter(function (x) { return ficheEtat(x[0]).concl; }).map(function (x) { return cite('Ma conclusion · ' + esc(x[1]), ficheEtat(x[0]).concl); }).join('') || '<div class="note">Termine une fiche : ta conclusion et son bilan apparaîtront ici.</div>') + btnVivant('Manipuler le modèle vivant') + '<button type="button" class="libre" data-resume>Revoir le résumé animé</button>';
      case 's3r': return '<h2>Le bilan scientifique</h2><div class="bs">' + F.map(function (x) { var e = ficheEtat(x[0]), f = FI[x[0]]; return '<div class="bsf"><b>' + esc(x[1]) + '</b><p>' + (e.concl ? esc((f && f.synthese) || 'Bilan à venir.') : 'Termine cette fiche pour lire son bilan.') + '</p></div>'; }).join('') + '</div>';
      case 's4l': return '<h1>Le défi</h1><p class="hook">' + L.quiz.length + ' manches, seul ou en équipe. Une erreur ne retire rien : chaque manche t’explique la réponse.</p><p class="stars" aria-label="' + (S.q.length ? etoiles() : 0) + ' étoiles sur 3">' + stars(S.q.length ? etoiles() : 0) + '</p><p>Score : ' + score() + ' sur ' + L.quiz.length + '.</p>' + (S.m < 9 ? '<div class="note">Le défi s’ouvre quand toutes les fiches de la leçon sont terminées.</div>' : '<button type="button" class="libre" data-vivant>Réviser avec le modèle vivant</button>');
      case 's4r': return defi();
    }
    return '';
  }
  function defi() {
    var n = L.quiz.length, tete = mode === 'sgl' ? '<h2>Le défi</h2>' : '';
    if (S.m < 9) return tete + '<p>Termine d’abord toutes les fiches de la leçon.</p>';
    if (S.fini) return '<h2>Défi terminé</h2><p class="stars" aria-label="' + etoiles() + ' étoiles sur 3">' + stars(etoiles()) + '</p><p class="hook">' + score() + ' manches réussies sur ' + n + '.</p><div class="note">' + (ALG ? 'Ta leçon est complète : tu peux la reprendre quand tu veux.' : 'Ta leçon est complète : le livre garde tout ce que tu as écrit dans tes fiches.') + '</div>' + '<a class="go bas" href="./" style="display:flex;align-items:center;justify-content:center;text-decoration:none">Retour au sommaire</a>';
    var i = S.q.length, q = L.quiz[i];
    return tete + '<p class="tag"><span>Manche ' + (i + 1) + ' sur ' + n + '</span></p><h2>' + q.q + '</h2><div class="ch" data-dq role="group" aria-label="Réponses possibles">' + q.o.map(function (o, k) { return '<button type="button" data-i="' + k + '">' + o + '</button>'; }).join('') + '</div><div data-dx aria-live="polite"></div>';
  }
  function tag(id) { var c = CH_OF[id], m = MO(id), w = ALG ? 'Étape' : 'Moment'; return '<div class="tag"><span>' + CH()[c] + '</span><span>' + (m[0] === m[1] ? w + ' ' + m[0] : w + 's ' + m[0] + ' à ' + m[1]) + '</span></div>' + frise(id); }
  function page(id, side) { return '<div class="page ' + side + '" data-pg="' + id + '">' + tag(id) + contenu(id) + '</div>'; }
  function nu(id, side) { return page(id, side).replace(/ id="[^"]*"/g, ''); }

  /* ---------- progression : le livre suit les fiches ---------- */
  function cible(m) { var c = m >= 9 ? 3 : m === 8 ? 2 : m >= 3 ? 1 : null; return c == null ? null : (mode === 'sgl' ? SP2SGL[c] : c); }
  function recommencer() { S = vierge(); sauve(); aller(0, true); }
  function posCour() { return mode === 'sgl' ? S.pos : SGL2SP[S.pos]; }
  function setPos(t) { S.pos = mode === 'sgl' ? t : SP2SGL[t]; sauve(); }
  function maxPos() { return mode === 'sgl' ? SGL.length - 1 : SP.length - 1; }
  function debloque(t) { return t >= 0 && t <= maxPos() && (mode === 'sgl' ? SGL2SP[t] : t) <= spreadDe(S.m); }
  function vus() { return mode === 'sgl' ? [SGL[S.pos]] : SP[SGL2SP[S.pos]]; }

  function monte() {
    var v = vus();
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(v[0], 'S'); } else { $('#sL').innerHTML = page(v[0], 'L'); $('#sR').innerHTML = page(v[1], 'R'); }
    var bk = $('#book'); lierPages(bk);
    $$('.stage', bk).forEach(function (s) { if (!anim) s.classList.add('up'); else setTimeout(function () { s.classList.add('up'); }, 60); });
    majNav();
  }
  function lierPages(root) {
    $$('[data-resume]', root).forEach(function (b) { b.onclick = function () { cadre('resume', b); }; });
    $$('[data-vivant]', root).forEach(function (b) { b.onclick = function () { cadre('vivant', $('.panel', b.closest('.page')) || b); }; });
    $$('[data-labo]', root).forEach(function (b) { b.onclick = function () { cadre('sim', $('.panel', b.closest('.page')) || b); }; });
    brancheFiches(root);
    $$('[data-start]', root).forEach(function (b) { b.onclick = function () { S.start = 1; majEtat(); var t = ALG ? (mode === 'sgl' ? SP2SGL[1] : 1) : cible(S.m); if (t != null) aller(t); else monte(); }; });
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
      n.onclick = function () { S.q.push(ok ? 1 : 0); if (S.q.length >= L.quiz.length) S.fini = true; sauve(); monte(); };
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
    var sim = kind === 'sim', viv = kind === 'vivant', t = (viv ? 'Modèle vivant · ' : sim ? 'Simulation · ' : 'Résumé animé · ') + esc(L.title);
    var V = ouvreVolet('<div class="labo" role="dialog" aria-modal="true" aria-label="' + t + '"><div class="lh"><b>' + t + '</b><button type="button" class="go" data-lfin>Revenir au livre</button></div>'
      + '<div class="lcorps"><iframe title="' + t + '" src="' + (viv ? '../livre-vivant/?l=' + encodeURIComponent(LEC.slug) + '&embed=1' : '../lecon/?l=' + encodeURIComponent(LEC.slug) + '&embed=' + kind + '#' + kind) + '" allow="fullscreen"></iframe></div></div>', src);
    $('[data-lfin]', V).onclick = viv ? retourVivant : fermeVolet;
  }
  /* au retour du modèle vivant, la page se réaffiche : le nombre de vérifications réussies se relit dans « vv-<slug> » */
  function retourVivant() { fermeVolet(); monte(); }
  function cadreFiche(id, titre, src) {
    var t = 'Investigation · ' + titre;
    var V = ouvreVolet('<div class="labo" role="dialog" aria-modal="true" aria-label="' + t + '"><div class="lh"><b>' + t + '</b><button type="button" class="go" data-lfin>Revenir au livre</button></div>'
      + '<div class="lcorps"><iframe title="' + t + '" src="../activites-5e/?a=' + encodeURIComponent(id) + '&embed=1&t=light"></iframe></div></div>', src);
    $('[data-lfin]', V).onclick = retourFiche;
  }
  /* au retour, l'état se relit dans les fiches ; la première conclusion ouvre « Ce que dit l'expérience » */
  function retourFiche() {
    var avant = S.m; fermeVolet(); majEtat();
    var t = mode === 'sgl' ? SP2SGL[2] : 2;
    monte();
    if (avant < 8 && S.m >= 8) { if (anim) setTimeout(function () { aller(t); }, 250); else aller(t); }
  }
  function brancheFiches(root) { $$('a[data-fiche]', root || document).forEach(function (a) { a.onclick = function (e) { e.preventDefault(); cadreFiche(a.getAttribute('data-fiche'), a.getAttribute('data-titre'), a); }; }); }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nohoba !== 'studio-h') return;
    var f = $('#volet iframe'); if (f && f.contentWindow === e.source) f.style.height = window.innerWidth < 1000 ? Math.max(560, Math.min(4000, +e.data.h || 0)) + 'px' : '';
  });

  /* ---------- sommaire et couverture ---------- */
  function etat(slug) {
    var s = lit(cle(slug)); if (!s || typeof s.m !== 'number') return '<small>À découvrir</small>';
    if (s.fini) { var n = (s.q || []).reduce(function (a, b) { return a + b; }, 0); return '<small class="ok">Terminée · ' + n + '/' + (s.q || []).length + '</small>'; }
    var tot = (FICHES5E[slug] || []).length;
    return '<small>' + (s.start && tot ? nbFinies(slug) + ' fiche' + (nbFinies(slug) > 1 ? 's' : '') + ' sur ' + tot : 'Commencée') + '</small>';
  }
  function tocTheme(t, k) { return '<h2>' + (k + 1) + '. ' + esc(t.nm) + '</h2>' + t.les.map(function (l) { return '<a href="?l=' + l.slug + '"><span>' + esc(l.t) + '</span>' + etat(l.slug) + '</a>'; }).join(''); }
  function sommaire() {
    document.body.classList.add('somm');
    var TH = NIVS[NIV] || [], tete = '<div class="tag"><span>NOHOBA-Lab · Physique-chimie ' + NIV + '</span><span>Prototype</span></div>';
    var niv = '<nav class="niv" aria-label="Choisir ma classe">' + NIVEAUX.map(function (n) { return '<a href="?n=' + n + '"' + (n === NIV ? ' aria-current="page"' : '') + ' aria-label="Classe de ' + n + '">' + n + '</a>'; }).join('') + '</nav>';
    var note = NIV === '5e' ? 'Dans chaque leçon, tu mènes ton investigation dans une fiche, et le livre garde ton avancée.' : 'Dans chaque leçon, tu regardes un résumé animé, tu manipules un modèle, tu retiens l’essentiel et tu relèves un défi. Les fiches d’investigation arrivent bientôt.';
    var h = Math.ceil(TH.length / 2);
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = '<div class="page S" style="overflow:auto">' + tete + '<h1>Sommaire</h1>' + niv + '<div class="toc">' + TH.map(tocTheme).join('') + '</div></div>'; }
    else {
      $('#sL').innerHTML = '<div class="page L">' + tete + '<h1>Sommaire</h1>' + niv + '<div class="toc">' + TH.slice(0, h).map(tocTheme).join('') + '</div></div>';
      $('#sR').innerHTML = '<div class="page R">' + tete + '<div class="toc">' + TH.slice(h).map(function (t, k) { return tocTheme(t, h + k); }).join('') + '</div><div class="note">' + note + '</div></div>';
    }
  }
  function couverture() {
    var c = $('#couv'), bk = $('#book');
    c.innerHTML = '<div class="f"><span class="cv-k">NOHOBA-Lab</span><p class="cv-t">Mon cartable de physique-chimie</p><span class="cv-n">' + NIV + '</span><button type="button" class="cv-go" data-ouvrir>Ouvrir mon livre</button></div><div class="b"></div>';
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
    var NM = NU(), w = ALG ? 'Étape' : 'Moment';
    $('#dots').innerHTML = CH().map(function (t, i) { var ok = i <= spreadDe(S.m); return '<button type="button" data-c="' + i + '" aria-label="' + w + (NM[i].length > 1 ? 's ' + NM[i].replace('-', ' à ') : ' ' + NM[i]) + ', ' + t + (ok ? '' : ', pas encore ouvert') + '"' + (ch0 === i ? ' aria-current="step"' : '') + (ok ? '' : ' disabled') + '>' + NM[i] + '</button>'; }).join('');
    $('#prev').disabled = c === 0; $('#next').disabled = !debloque(c + 1);
  }
  function ajuste() {
    var W = window.innerWidth, H = window.innerHeight, old = mode;
    mode = W >= 760 ? 'dbl' : 'sgl';
    var B = document.body; B.classList.toggle('sgl', mode === 'sgl'); B.classList.toggle('anim', anim);
    document.documentElement.style.setProperty('--tilt', mode === 'sgl' ? '0deg' : '10deg');
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
    var files = [].concat(LEC.kit || []).map(function (k) { return '../assets/studio/kits/' + k + '.js'; }).concat('../assets/studio/lecons/' + LEC.slug + '.js').concat(fichesL().map(function (x) { return '../assets/activites/fiches/' + x[0] + '.js'; }));
    (function next(i) {
      if (i >= files.length) { fichesL().forEach(function (x) { FI[x[0]] = window[cleFiche(x[0])]; }); fin(L && L.inquiry && L.quiz && L.quiz.length ? null : new Error('données')); return; }
      var sc = document.createElement('script'); sc.src = files[i];
      sc.onload = function () { next(i + 1); }; sc.onerror = function () { if (/fiches\//.test(files[i])) next(i + 1); else fin(new Error('chargement')); };
      document.body.appendChild(sc);
    })(0);
  }

  function init() {
    if (!$('#book')) return;
    if (calme()) anim = false;
    ajuste();
    $('#prev').onclick = function () { dec(-1); }; $('#next').onclick = function () { dec(1); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var c = +b.getAttribute('data-c'); aller(mode === 'sgl' ? SP2SGL[c] : c); };
    $('#bSon').onclick = function () { son = !son; this.setAttribute('aria-pressed', son); ajuste(); };
    $('#bAnim').onclick = function () { anim = !anim; this.setAttribute('aria-pressed', anim); ajuste(); };
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (!$('#volet').hidden) fermeVolet(); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !$('#volet').hidden || !LEC) return;
      if (e.key === 'ArrowRight') dec(1); if (e.key === 'ArrowLeft') dec(-1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null || !LEC) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) dec(d < 0 ? 1 : -1); x0 = null; }, { passive: true });
    var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var ch = ajuste(); ajuste(); if (ch && !busy) { if (!LEC) sommaire(); else monte(); } }, 120); });
    if (!LEC) {
      sommaire(); var deja = false; try { deja = sessionStorage.getItem('pc-livre-ouvert') === '1'; } catch (e) {}
      if (!deja && anim) couverture();
      return;
    }
    document.title = LEC.t + ' · Mon cartable de physique-chimie · NOHOBA-Lab';
    document.documentElement.setAttribute('data-parcours', ALG ? 'allege' : 'complet');
    S = charge(LEC.slug);
    $('#sR').innerHTML = '<div class="page S"><p class="hook">Ouverture de la leçon…</p></div>';
    charger(function (err) {
      if (err) { $('#sR').innerHTML = '<div class="page S"><h2>Leçon indisponible</h2><p>Impossible de charger cette leçon.</p><a class="go bas" href="./">Retour au sommaire</a></div>'; return; }
      ajuste(); ajuste(); majEtat();
      if (!debloque(posCour())) setPos(cible(S.m) != null ? cible(S.m) : 0);
      monte();
    });
  }
  window.NohobaLivre = { lecons: function () { return LECONS.filter(function (l) { return l.niv === '5e'; }).map(function (l) { return l.slug; }); }, toutes: function () { return LECONS.map(function (l) { return l.niv + ':' + l.slug; }); }, allege: function () { return ALG; } };
  init();
})();