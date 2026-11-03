/* NOHOBA-Lab · Le circuit électrique : livre 3D de 6e (Côte d'Ivoire), huit chapitres, la simulation dans la page.
   Un chapitre = une fiche d'investigation du catalogue (ELE-01 à ELE-07 et ELE-17), en trois doubles pages qui suivent les neuf moments :
     Je cherche (moments 1 à 3) · J'expérimente (4 à 6) · Je comprends et je relève un défi (7 à 9).
   L'élève écrit directement dans le livre, en écriture scolaire. Les fiches ne sont pas modifiées : le livre lit leurs données
   et écrit dans le même « pc-act-<id> » que la fiche complète (l'élève retrouve ses réponses des deux côtés).
   Brouillons, nom et chapitres réussis : « pc-livre-ci ». Rien n'est envoyé. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lit(k) { try { var v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } }
  function ecrit(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function calme() { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }

  var IDS = ['01', '02', '03', '04', '05', '17', '06', '07'], N = IDS.length;
  var TITRES = ['Situation-problème', 'J’analyse et je réponds', 'Je formule mon hypothèse', 'Je réalise la manipulation', 'J’observe et j’analyse les résultats', 'Je confronte les résultats à mon hypothèse', 'Je rédige mon bilan', 'Je compare avec le bilan scientifique', 'Je relève un défi, seul ou en équipe'];
  var MOM = ['Moments 1 à 3', 'Moments 4 à 6', 'Moments 7 à 9'];
  var KEY = 'pc-livre-ci';
  var B = null, mode = 'dbl', anim = true, son = true, busy = false;

  /* ---------- fiches et leur état (même clé que la fiche complète) ---------- */
  function F(c) { return window['FICHE_CI_ELE' + IDS[c]]; }
  function aid(c) { return 'NL-CI-6E-ELE-' + IDS[c]; }
  function act(c) { var v = lit('pc-act-' + aid(c)); if (v && v.v === 1 && Array.isArray(v.essais)) return v; return { v: 1, prevision: null, essais: [], confront: null, conclusion: '', transfert: null, aides: 0, step: 0 }; }
  function saveAct(c, a) { ecrit('pc-act-' + aid(c), a); }
  function fini(c) { var a = act(c); return !!(a.transfert && a.conclusion); }
  function nFinis() { var n = 0, c; for (c = 0; c < N; c++) if (fini(c)) n++; return n; }
  function pret(c) { var a = act(c), f = F(c); return f.peutConfronter ? !!f.peutConfronter(a) : a.essais.length > 0; }
  function transfertOk(c, rep) { return rep === F(c).transfert.rep; }
  function etoiles(c) { var n = B.tampon[c]; return n >= 1 && n <= 3 ? n : 1; }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

  /* ---------- état du livre ---------- */
  function vierge() { return { nom: '', c: -1, s: 0, h: 0, d: {}, cmp: {}, vu: {}, tampon: {} }; }
  function chargeB() {
    var v = lit(KEY), b = vierge(); if (!v) return b;
    if (typeof v.nom === 'string') b.nom = v.nom.slice(0, 40);
    if (typeof v.c === 'number' && v.c >= -1 && v.c < N) b.c = v.c | 0;
    if (typeof v.s === 'number' && v.s >= 0 && v.s <= 2) b.s = v.s | 0;
    if (v.h === 1) b.h = 1;
    ['d', 'cmp', 'vu', 'tampon'].forEach(function (k) { if (v[k] && typeof v[k] === 'object') b[k] = v[k]; });
    return b;
  }
  function sauveB() { ecrit(KEY, B); }
  function D(c) { return B.d[c] || (B.d[c] = {}); }
  function dv(c, k) { var v = D(c)[k]; return typeof v === 'string' ? v : ''; }

  /* ---------- positions : sommaire, puis trois doubles pages par chapitre ---------- */
  function slots() {
    var r = [], c, s, h;
    if (mode === 'sgl') { r.push({ c: -1, s: 0, h: 0 }, { c: -1, s: 0, h: 1 }); for (c = 0; c < N; c++) for (s = 0; s < 3; s++) for (h = 0; h < 2; h++) r.push({ c: c, s: s, h: h }); }
    else { r.push({ c: -1, s: 0, h: 0 }); for (c = 0; c < N; c++) for (s = 0; s < 3; s++) r.push({ c: c, s: s, h: 0 }); }
    return r;
  }
  function idxDe(c, s, h) { var L = slots(), i; for (i = 0; i < L.length; i++) if (L[i].c === c && L[i].s === s && (mode !== 'sgl' || L[i].h === (h | 0))) return i; return 0; }
  function posCour() { return idxDe(B.c, B.s, B.h); }
  function setPos(i) { var sl = slots()[i]; B.c = sl.c; B.s = sl.s; B.h = mode === 'sgl' ? sl.h : 0; sauveB(); }
  function pagesDe(sl) {
    if (sl.c < 0) return mode === 'sgl' ? [sl.h ? 'toc:r' : 'toc:l'] : ['toc:l', 'toc:r'];
    var b = sl.c + ':' + sl.s; return mode === 'sgl' ? [b + (sl.h ? 'r' : 'l')] : [b + 'l', b + 'r'];
  }
  function ouvert(sl) {
    if (!sl || sl.c < 0 || sl.s === 0) return !!sl;
    var a = act(sl.c); return sl.s === 1 ? !!a.prevision : !!a.confront;
  }
  function debloque(i) { var L = slots(); return i >= 0 && i < L.length && ouvert(L[i]); }

  /* ---------- dessins du pop-up : la lampe s'allume quand le chapitre est réussi ---------- */
  function ill(c, on) {
    var A = window.NohobaAtelier; if (!A) return '';
    if (c === 0) return A.svg(A.pile45(70, 110, 1.2) + A.pileCyl(232, 104, 0.9) + A.lampe(340, 110, on, 1.3), '0 0 460 252', 'Pile plate, pile cylindrique et lampe');
    if (c === 1) return A.svg(A.pileCyl(150, 130, 1) + A.lampe(150, 62, on, 1) + A.fil('M134 101 H106 V244 H150', '#2E3138'), '0 0 300 270', 'Une lampe posée sur une pile cylindrique et reliée par un fil');
    if (c === 2) return A.svg(A.pile45(30, 96, 0.9) + A.lampe(360, 100, on, 1) + A.fil('M77.7 58.2 V14 H408 V206 H360 V158', '#E0342F') + A.fil('M54.3 58.2 V46 H14 V218 H320 V139 H344', '#2E3138') + A.broches([[360, 158], [344, 139]]), '0 0 460 250', 'Pile plate, lampe et deux fils : ' + (on ? 'la lampe brille' : 'la lampe est éteinte'));
    return A.montageSerie({ inter: on ? 'ferme' : 'ouvert' }).svg;
  }
  function pop(c, cls) { return '<div class="stage ' + (cls || '') + (fini(c) ? ' allume' : '') + '"><div class="psh"></div><div class="panel">' + ill(c, fini(c)) + '</div></div>'; }

  /* ---------- briques de page ---------- */
  function tag(g, sl) { return '<div class="tag"><span>' + (sl.c < 0 ? 'NOHOBA-Lab · 6e Côte d’Ivoire' : 'Chapitre ' + (sl.c + 1) + ' sur ' + N) + '</span><span>' + (sl.c < 0 ? 'Prototype' : MOM[sl.s]) + '</span></div>'; }
  function momt(m) { return '<h2 class="momt"><i aria-hidden="true">' + m + '</i><span><span class="sr">Moment ' + m + ' sur 9 : </span>' + TITRES[m - 1] + '</span></h2>'; }
  function zone(id, champ, label, v, court, ph) { return '<label class="lab" for="' + id + '">' + label + '</label><textarea class="zone-e' + (court ? ' court' : '') + '" id="' + id + '" data-f="' + champ + '" maxlength="600" placeholder="' + esc(ph || '') + '">' + esc(v) + '</textarea>'; }
  function opts(name, liste, val, off, duo) { return '<div class="opts' + (duo ? ' duo' : '') + '" role="radiogroup">' + liste.map(function (o) { return '<label class="opt"><input type="radio" name="' + name + '" data-f="' + name.split(':')[0] + '" value="' + esc(o[0]) + '"' + (val === o[0] ? ' checked' : '') + (off ? ' disabled' : '') + '><span>' + esc(o[1]) + '</span></label>'; }).join('') + '</div>'; }
  function melange(c, liste) { var k = (c * 3 + 1) % liste.length; return liste.slice(k).concat(liste.slice(0, k)); }
  function cite(titre, v) { return '<div class="cite"><b>' + titre + '</b><p class="ecrit">' + (v && v.trim() ? esc(v) : '…') + '</p></div>'; }
  function tableau(f, a) {
    var rows = f.lignes(a);
    return '<div class="tbl" tabindex="0" role="region" aria-label="Mes essais"><table><thead><tr>' + f.colonnes.map(function (t) { return '<th scope="col">' + esc(t) + '</th>'; }).join('') + '</tr></thead><tbody>'
      + (rows.length ? rows.map(function (r) { return '<tr>' + r.map(function (t, k) { return k ? '<td>' + esc(t) + '</td>' : '<th scope="row">' + esc(t) + '</th>'; }).join('') + '</tr>'; }).join('') : '<tr><td class="vide" colspan="' + f.colonnes.length + '">Aucun essai pour l’instant</td></tr>') + '</tbody></table></div>';
  }
  /* situation très longue ou beaucoup de capacités : la page de gauche se resserre */
  function long(f) { return f.situation.length > 330 || f.objectifsPedagogiques.length > 3; }
  function choixTexte(f, id) { var ch = f.prevision.choix.filter(function (x) { return x[0] === id; })[0]; return ch ? ch[1] : ''; }

  /* ---------- guirlande du sommaire ---------- */
  function guirlande() {
    var s = '<svg class="guir" viewBox="0 0 420 120" role="img" aria-label="' + nFinis() + ' lampe' + (nFinis() > 1 ? 's' : '') + ' allumée' + (nFinis() > 1 ? 's' : '') + ' sur ' + N + '"><path d="M10 14 Q210 74 410 14" fill="none" stroke="#6B6354" stroke-width="3"/>', c, x, y, t;
    for (c = 0; c < N; c++) {
      x = 36 + c * 49.7; t = (x - 10) / 400; y = 14 + 60 * 2 * t * (1 - t) * 1 + 0;
      s += '<g transform="translate(' + x.toFixed(1) + ' ' + (y + 6).toFixed(1) + ')"><rect x="-5" y="0" width="10" height="9" fill="#6B6354"/><circle class="halo' + (fini(c) ? ' on' : '') + '" cx="0" cy="26" r="28"/><circle class="bulle' + (fini(c) ? ' on' : '') + '" cx="0" cy="26" r="17"/><text x="0" y="32" text-anchor="middle" font-size="16" font-weight="800" fill="#2A2620">' + (c + 1) + '</text></g>';
    }
    return s + '</svg>';
  }
  function etatChap(c) {
    var a = act(c); if (fini(c)) return '<small>Réussi · ' + stars(etoiles(c)) + '</small>';
    if (a.confront) return '<small>En cours · mon bilan</small>'; if (a.prevision) return '<small>En cours · le laboratoire</small>'; return '<small>À découvrir</small>';
  }

  /* ---------- contenu des pages ---------- */
  function contenu(id, sl) {
    if (id === 'toc:l') {
      var n = nFinis();
      return '<p class="th">Thème : Électricité · 6e Côte d’Ivoire</p><h1>Le circuit électrique</h1><p class="hook">Huit chapitres pour comprendre comment une lampe s’allume. Chaque chapitre réussi allume une lampe de la guirlande.</p>' + guirlande()
        + '<p class="hook" aria-live="polite">' + (n === N ? 'Les huit lampes brillent !' : n + ' lampe' + (n > 1 ? 's' : '') + ' allumée' + (n > 1 ? 's' : '') + ' sur ' + N + '.') + '</p>'
        + '<label class="nom-l" for="nom">Mon prénom<input id="nom" data-nom autocomplete="off" maxlength="40" value="' + esc(B.nom) + '"></label>'
        + (n === N ? '<div class="diplome"><span>Tu as réussi tous les chapitres.</span><button type="button" class="go" data-act="diplome">Voir mon diplôme</button></div>' : '<div class="note">Ce que tu écris reste sur cet appareil. Rien n’est envoyé.</div>');
    }
    if (id === 'toc:r') {
      var h = '<h2>Les chapitres</h2><div class="chaps">', c;
      for (c = 0; c < N; c++) h += '<button type="button" data-act="chap" data-c="' + c + '"' + (fini(c) ? ' class="ok"' : '') + '><span class="no" aria-hidden="true">' + (c + 1) + '</span><span>' + esc(F(c).titre) + etatChap(c) + '</span></button>';
      return h + '</div>';
    }
    var p = id.split(':'), c = +p[0], s = +p[1].charAt(0), g = p[1].charAt(1) === 'l', f = F(c), a = act(c), pv = a.prevision && a.prevision.initiale, cf = a.confront;
    if (s === 0 && g) {
      return '<p class="th">Thème : ' + esc(f.theme) + '</p><p class="chap">Chapitre : ' + esc(f.chapitre) + '</p><h1>' + esc(f.titre) + '</h1>'
        + '<p class="comp"><b>Compétence visée.</b> ' + esc(f.competenceVisee) + '</p><p class="comp"><b>À la fin de cette partie, je dois être capable de</b></p><ul class="cap">'
        + f.objectifsPedagogiques.map(function (o, i) { return '<li>' + esc(o.replace(/[.;\s]+$/, '')) + (i < f.objectifsPedagogiques.length - 1 ? ' ;' : '.') + '</li>'; }).join('') + '</ul>' + momt(1) + '<p class="sit">' + esc(f.situation) + '</p>' + pop(c, 'petit');
    }
    if (s === 0) {
      var sauve = !!a.prevision;
      return momt(2)
        + zone('rep' + c, 'rep', 'Avec mes mots, je réponds à la question. Je peux me tromper : c’est le début de la recherche.', dv(c, 'rep'), true, 'Je pense que…') + momt(3)
        + '<p class="comp">' + esc(f.prevision.consigne) + '</p>' + opts('hyp:' + c, melange(c, f.prevision.choix), sauve ? pv.choix : dv(c, 'hyp'), sauve)
        + (sauve ? '<p class="ecrit">' + esc(pv.raison) + '</p>' : zone('rai' + c, 'rai', 'Je justifie avec « car ».', dv(c, 'rai'), true, 'Je pense que… car…'))
        + '<p class="msg-l" data-m aria-live="polite"></p><button type="button" class="go bas" data-act="' + (sauve ? 'versb' : 'hyp') + '">' + (sauve ? 'Aller au laboratoire' : 'Je valide mon hypothèse') + '</button>';
    }
    if (s === 1 && g) {
      return momt(4) + pop(c, 'grand') + '<p class="comp"><b>Je fais varier :</b> ' + esc(f.variable) + '. <b>Je garde identique :</b> ' + esc(f.maintenu) + '.</p>'
        + '<ol class="etapes">' + f.protocole.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>'
        + '<button type="button" class="go bas" data-act="lab">' + (a.essais.length ? 'Retourner au laboratoire' : 'Entrer dans le laboratoire') + '</button>';
    }
    if (s === 1) {
      var ready = pret(c);
      return momt(5) + tableau(f, a) + zone('obs' + c, 'obs', 'Ce que je remarque dans mes résultats (sans conclure).', dv(c, 'obs'), true, 'Je remarque que…') + momt(6)
        + (pv ? cite('Mon hypothèse', choixTexte(f, pv.choix) + ' — ' + pv.raison) : '')
        + '<p class="lab">Ma prévision est…</p>' + opts('ver:' + c, [['confirmee', 'confirmée'], ['infirmee', 'infirmée'], ['partielle', 'partiellement confirmée'], ['non', 'impossible à conclure']], cf ? cf.verdict : dv(c, 'ver'), !!cf, true)
        + (cf ? cite('Ma preuve', cf.preuve) : zone('pre' + c, 'pre', esc(f.retroaction), dv(c, 'pre'), true, 'Je cite une observation précise.'))
        + '<p class="msg-l" data-m aria-live="polite">' + (!cf && !ready ? 'Termine d’abord ta manipulation dans le laboratoire.' : '') + '</p>'
        + '<button type="button" class="go bas" data-act="' + (cf ? 'versc' : 'conf') + '"' + (!cf && !ready ? ' disabled' : '') + '>' + (cf ? 'Passer au bilan' : 'Je confronte ma prévision') + '</button>';
    }
    if (s === 2 && g) {
      var vu = !!B.vu[c], ok = !!a.conclusion;
      return momt(7) + '<p class="comp"><b>Pour réussir mon bilan :</b> ' + esc(f.critere) + '</p>'
        + zone('bil' + c, 'bil', 'Quelle règle est-ce que je retiens ?', ok ? a.conclusion : dv(c, 'bil'), true, 'Je retiens que…')
        + '<p class="msg-l" data-m aria-live="polite">' + (ok ? 'Bilan enregistré.' : '') + '</p>' + (ok ? '' : '<button type="button" class="go" data-act="bil">J’écris mon bilan</button>')
        + momt(8) + '<div class="tab"><div class="bs"><p>' + esc(f.synthese) + '</p></div><button type="button" class="lang' + (ok && vu ? ' up' : '') + '"' + (ok && !vu ? ' data-auto' : '') + ' disabled>Écris d’abord ton bilan. Cette page s’ouvrira ensuite.</button></div>'
        + (ok ? '<div class="opts duo" role="group" aria-label="Mon bilan était"><button type="button" class="opt" data-act="cmp" data-v="0" aria-pressed="' + (B.cmp[c] === 0) + '">Il était complet</button><button type="button" class="opt" data-act="cmp" data-v="1" aria-pressed="' + (B.cmp[c] === 1) + '">Il est à compléter</button></div>' : '');
    }
    /* s === 2, page de droite : le défi */
    var T = f.transfert, ok2 = !!a.conclusion && B.cmp[c] != null, tr = a.transfert;
    if (!ok2) return momt(9) + '<div class="verr">Écris ton bilan, soulève le rabat et compare-le : le défi s’ouvre ensuite.</div>';
    var opt = T.options || [['oui', 'Oui'], ['non', 'Non']];
    return momt(9) + '<p class="hook">' + esc(T.q) + '</p>' + opts('def:' + c, opt, tr ? tr.rep : dv(c, 'def'), !!tr, true)
      + (tr ? cite('Je justifie', tr.just) : zone('jus' + c, 'jus', 'Je justifie :', dv(c, 'jus'), true, 'Je pense que… car…'))
      + (tr ? '<p class="ex"><b>' + (transfertOk(c, tr.rep) ? 'Exact.' : 'Pas tout à fait.') + '</b> ' + esc(T.expl) + '</p>'
        + '<div class="tampon' + (B.vu['t' + c] ? '' : ' neuf') + '" role="img" aria-label="Chapitre réussi, ' + etoiles(c) + ' étoile' + (etoiles(c) > 1 ? 's' : '') + ' sur 3"><svg viewBox="0 0 60 74" aria-hidden="true"><circle cx="30" cy="28" r="20" fill="#FFD54A" stroke="#B7860B" stroke-width="3"/><path d="M22 52 H38 V62 H22z" fill="#8C8470"/><path d="M24 26 L28 34 L32 22 L36 30" fill="none" stroke="#B7860B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Chapitre réussi<span class="stars" aria-hidden="true">' + stars(etoiles(c)) + '</span></div>'
        + '<div class="suite"><button type="button" class="go" data-act="suite">' + (c < N - 1 ? 'Chapitre suivant' : 'Retour au sommaire') + '</button></div>'
        : '<p class="msg-l" data-m aria-live="polite"></p><button type="button" class="go bas" data-act="def">Je vérifie ma réponse</button>');
  }
  function page(id, side, sl) { return '<div class="page ' + side + (sl && sl.c >= 0 && sl.s === 0 && long(F(sl.c)) ? ' dense' : '') + '" data-pg="' + id + '">' + (sl && sl.c >= 0 && side !== 'L' ? '<i class="ruban" aria-hidden="true"></i>' : '') + tag(id, sl) + contenu(id, sl) + '</div>'; }
  function nu(id, side, sl) { return page(id, side, sl).replace(/ id="[^"]*"/g, '').replace(/ for="[^"]*"/g, ''); }

  /* ---------- montage et retournement ---------- */
  function monte() {
    var sl = slots()[posCour()], ids = pagesDe(sl);
    if (mode === 'sgl') { $('#sL').innerHTML = ''; $('#sR').innerHTML = page(ids[0], 'S', sl); } else { $('#sL').innerHTML = page(ids[0], 'L', sl); $('#sR').innerHTML = page(ids[1], 'R', sl); }
    document.body.classList.toggle('somm', sl.c < 0);
    var bk = $('#book');
    $$('.stage', bk).forEach(function (s) { if (!anim) s.classList.add('up'); else setTimeout(function () { s.classList.add('up'); }, 60); });
    var lg = $('.lang[data-auto]', bk);
    if (lg) { var leve = function () { lg.classList.add('up'); B.vu[sl.c] = 1; sauveB(); }; if (anim) setTimeout(leve, 650); else leve(); }
    var cv = $('#couv'); if (cv) cv.style.setProperty('--allume', (nFinis() / N).toFixed(2));
    majNav();
  }
  function aller(t, direct) {
    if (busy) return;
    var de = posCour(); if (t === de && !direct) return; if (!debloque(t)) return;
    if (direct || !anim) { setPos(t); monte(); return; }
    busy = true; $$('#book .stage').forEach(function (s) { s.classList.remove('up'); });
    setTimeout(function () { tourne(de, t, function () { setPos(t); busy = false; monte(); }); }, 300);
  }
  function tourne(de, vers, fin) {
    var L = slots(), av = vers > de, sh = $('#sheet'), n = 9, w = 480 / n, i, h = '', f, b, D0 = pagesDe(L[de]), V = pagesDe(L[vers]);
    if (mode !== 'sgl') {
      f = av ? nu(D0[1], 'R', L[de]) : nu(V[1], 'R', L[vers]); b = av ? nu(V[0], 'L', L[vers]) : nu(D0[0], 'L', L[de]);
      $('#sL').innerHTML = av ? page(D0[0], 'L', L[de]) : page(V[0], 'L', L[vers]); $('#sR').innerHTML = av ? page(V[1], 'R', L[vers]) : page(D0[1], 'R', L[de]);
    } else { f = av ? nu(D0[0], 'S', L[de]) : nu(V[0], 'S', L[vers]); b = '<div class="page S"></div>'; $('#sR').innerHTML = page(av ? V[0] : D0[0], 'S', av ? L[vers] : L[de]); }
    function cr(html, k, bk) { return '<div class="fc' + (bk ? ' bk' : '') + '"><div class="in" style="left:' + (bk ? -(n - 1 - k) * w : -k * w) + 'px">' + html + '</div><div class="shade"></div></div>'; }
    for (i = n - 1; i >= 0; i--) h = '<div class="str" style="left:' + (i ? w : 0) + 'px;width:' + (w + 0.6) + 'px">' + cr(f, i) + cr(b, i, true) + h + '</div>';
    sh.innerHTML = h; sh.style.display = 'block';
    var st = $$('.str', sh), sd = $$('.shade', sh);
    function pose(p) {
      var th = av ? -180 * p : -180 * (1 - p), bd = 62 * Math.sin(Math.PI * p) * (av ? 1 : -1), pas = 2 * bd / (n - 1);
      st.forEach(function (e, k) { e.style.transform = 'rotateY(' + (k === 0 ? (th - bd) : pas) + 'deg)'; });
      var o = 0.32 * Math.sin(Math.PI * p); sd.forEach(function (e) { e.style.opacity = o; });
    }
    pose(0); papier();
    var t0 = 0;
    (function s(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 850, 1), q = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; pose(q); if (p < 1) requestAnimationFrame(s); else { sh.style.display = 'none'; sh.innerHTML = ''; fin(); } })(performance.now());
  }
  function versSpread(c, s) { aller(idxDe(c, s, 0)); }

  /* ---------- actions ---------- */
  function chap(el) { var p = el.closest('.page'); return +p.getAttribute('data-pg').split(':')[0]; }
  function msg(el, t, ok) { var m = $('[data-m]', el.closest('.page')); if (m) { m.textContent = t; m.classList.toggle('ok', !!ok); } }
  function agir(b) {
    var k = b.getAttribute('data-act'), c, a, f, d;
    if (k === 'chap') { c = +b.getAttribute('data-c'); clic(); aller(idxDe(c, 0, 0)); return; }
    if (k === 'diplome') { diplome(); return; }
    c = chap(b); f = F(c); a = act(c); d = D(c);
    if (k === 'hyp') {
      if (!d.hyp || dv(c, 'rai').trim().length < 3) { msg(b, 'Choisis une réponse et écris une justification, même courte.'); return; }
      var ts = Date.now(), raison = dv(c, 'rai').trim();
      if (!a.prevision) { a.prevision = { choix: d.hyp, raison: raison, inconnu: false, ts: ts, initiale: { choix: d.hyp, raison: raison, inconnu: false, ts: ts }, revisions: [] }; a.step = 2; saveAct(c, a); }
      clic(); versSpread(c, 1); return;
    }
    if (k === 'versb') { versSpread(c, 1); return; }
    if (k === 'lab') { labo(c, b); return; }
    if (k === 'conf') {
      if (!pret(c)) { msg(b, 'Fais d’abord des essais dans le laboratoire.'); return; }
      if (!d.ver || dv(c, 'pre').trim().length < 3) { msg(b, 'Choisis un verdict et cite une observation précise.'); return; }
      a.confront = { verdict: d.ver, preuve: dv(c, 'pre').trim(), modif: '', ts: Date.now() }; a.step = 4; saveAct(c, a); clic(); versSpread(c, 2); return;
    }
    if (k === 'versc') { versSpread(c, 2); return; }
    if (k === 'bil') {
      if (dv(c, 'bil').trim().length < 5) { msg(b, 'Écris ton bilan en une phrase complète, appuyée sur tes observations.'); return; }
      a.conclusion = dv(c, 'bil').trim(); a.step = 4; saveAct(c, a); clic(); monte(); return;
    }
    if (k === 'cmp') { B.cmp[c] = +b.getAttribute('data-v'); sauveB(); clic(); monte(); return; }
    if (k === 'def') {
      var T = f.transfert;
      if (!d.def) { msg(b, 'Choisis une réponse avant de vérifier.'); return; }
      var ok = transfertOk(c, d.def);
      a.transfert = { rep: d.def, just: dv(c, 'jus').trim(), ts: Date.now() }; a.step = 5; saveAct(c, a);
      B.tampon[c] = ok ? ((a.aides | 0) === 0 ? 3 : 2) : 1; sauveB(); monte(); celebre();
      B.vu['t' + c] = 1; sauveB(); return;
    }
    if (k === 'suite') { clic(); if (c < N - 1) aller(idxDe(c + 1, 0, 0)); else aller(0); }
  }

  /* ---------- fête : étincelles et carillon ---------- */
  function celebre() {
    carillon();
    if (!anim) return;
    var z = $('#fete'), t = $('.tampon'), r = t ? t.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }, cx = r.left + r.width / 2, cy = r.top + r.height / 2, i, e, col = ['#FFD54A', '#C2410C', '#17753A', '#1D4FA8', '#F6E2B0'];
    for (i = 0; i < 26; i++) {
      e = document.createElement('i'); var an = Math.random() * 6.283, di = 90 + Math.random() * 190;
      e.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;--c:' + col[i % col.length] + ';--dx:' + (Math.cos(an) * di).toFixed(0) + 'px;--dy:' + (Math.sin(an) * di - 60).toFixed(0) + 'px;--r:' + ((Math.random() * 720 - 360) | 0) + 'deg';
      z.appendChild(e);
    }
    setTimeout(function () { z.innerHTML = ''; }, 1300);
  }

  /* ---------- laboratoire dans la page ---------- */
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
  function fermeVolet() { var V = $('#volet'); V.hidden = true; V.innerHTML = ''; monte(); }
  function labo(c, src) {
    var th = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', t = 'Laboratoire · ' + esc(F(c).titre), st = $('.panel', src.closest('.page')) || src;
    var V = ouvreVolet('<div class="labo" role="dialog" aria-modal="true" aria-label="' + t + '"><div class="lh"><b>' + t + '</b><button type="button" class="go" data-lfin>Revenir au livre</button></div>'
      + '<div class="lcorps"><iframe title="' + t + '" src="../activites-ci/?a=' + aid(c) + '&embed=manip&t=' + th + '"></iframe></div></div>', st);
    $('[data-lfin]', V).onclick = fermeVolet; $('[data-lfin]', V).focus();
  }

  /* ---------- diplôme à partager ---------- */
  function diplomeSvg() {
    var nom = esc((B.nom || '').trim() || 'Élève'), tot = 0, c, lamp = '', date = '';
    for (c = 0; c < N; c++) { tot += fini(c) ? etoiles(c) : 0; lamp += '<g transform="translate(' + (210 + c * 111) + ' 560)"><circle r="40" fill="#FFD54A" opacity=".35"/><circle r="27" fill="#FFD54A" stroke="#B7860B" stroke-width="4"/><rect x="-11" y="26" width="22" height="16" fill="#8C8470"/><text y="9" text-anchor="middle" font-size="26" font-weight="700" fill="#2A2620">' + (c + 1) + '</text></g>'; }
    try { date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#17284B"/><rect x="26" y="26" width="1148" height="748" fill="none" stroke="#E8C77A" stroke-width="4"/><rect x="44" y="44" width="1112" height="712" fill="#FBF3DE"/>'
      + '<text x="600" y="130" text-anchor="middle" font-family="Georgia,serif" font-size="30" letter-spacing="8" fill="#9A3412">NOHOBA-LAB · PHYSIQUE-CHIMIE · 6e CÔTE D’IVOIRE</text>'
      + '<text x="600" y="235" text-anchor="middle" font-family="Georgia,serif" font-size="92" font-weight="700" fill="#17284B">Diplôme d’électricien·ne</text>'
      + '<text x="600" y="305" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#5E5546">décerné à</text>'
      + '<text x="600" y="400" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="84" fill="#1D4FA8">' + nom + '</text>'
      + '<text x="600" y="470" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#2A2620">pour avoir allumé les huit lampes du livre « Le circuit électrique »</text>' + lamp
      + '<text x="600" y="680" text-anchor="middle" font-family="Georgia,serif" font-size="36" fill="#C2410C">' + tot + ' étoiles sur ' + (N * 3) + '</text>'
      + '<text x="600" y="735" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#5E5546">' + esc(date) + '</text></svg>';
  }
  function diplome() {
    var svg = diplomeSvg(), url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    var V = ouvreVolet('<div class="labo clair" role="dialog" aria-modal="true" aria-label="Mon diplôme"><div class="lh"><b>Mon diplôme</b><button type="button" class="go" data-dl>Enregistrer l’image</button><button type="button" class="btn" data-lfin>Fermer</button></div><div class="lcorps" style="display:flex;align-items:center;justify-content:center;padding:12px"><img alt="Diplôme d’électricien·ne de ' + esc((B.nom || '').trim() || 'l’élève') + ', huit lampes allumées" src="' + url + '" style="max-width:100%;max-height:100%;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.4)"></div></div>', $('[data-act="diplome"]'));
    $('[data-lfin]', V).onclick = fermeVolet;
    $('[data-dl]', V).onclick = function () {
      try {
        var im = new Image(); im.onload = function () {
          var cv = document.createElement('canvas'); cv.width = 1200; cv.height = 800; cv.getContext('2d').drawImage(im, 0, 0);
          cv.toBlob(function (bl) { var u = URL.createObjectURL(bl), a = document.createElement('a'); a.href = u; a.download = 'diplome-circuit-electrique.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 2000); });
        }; im.src = url;
      } catch (e) {}
    };
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.nohoba !== 'livre-ci') return;
    var f = $('#volet iframe'); if (!f || f.contentWindow !== e.source) return;
    if (e.data.type === 'essai') { /* les essais sont déjà enregistrés par la fiche ; le tableau du livre se met à jour à la fermeture */ }
  });

  /* ---------- barre, échelle, couverture ---------- */
  function majNav() {
    var i = posCour(), L = slots(), sl = L[i];
    $('#dots').innerHTML = F(0) ? IDS.map(function (_, c) { return '<button type="button" data-c="' + c + '" class="' + (fini(c) ? 'ok' : '') + '" aria-label="Chapitre ' + (c + 1) + ', ' + esc(F(c).titre) + (fini(c) ? ', réussi' : '') + '"' + (sl.c === c ? ' aria-current="step"' : '') + '>' + (c + 1) + '</button>'; }).join('') : '';
    $('#prev').disabled = i === 0; $('#next').disabled = !debloque(i + 1);
  }
  function ajuste() {
    var W = window.innerWidth, old = mode;
    mode = W >= 760 ? 'dbl' : 'sgl';
    var Bd = document.body; Bd.classList.toggle('sgl', mode === 'sgl'); Bd.classList.toggle('anim', anim);
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
  function dec(d) { var i = posCour() + d; if (debloque(i)) aller(i); }
  function couverture() {
    var c = $('#couv'), bk = $('#book');
    c.innerHTML = '<div class="f"><span class="cv-k">NOHOBA-Lab · Côte d’Ivoire</span>'
      + '<svg class="cv-lampe" viewBox="0 0 150 190" aria-hidden="true"><circle class="v" cx="75" cy="68" r="52"/><path class="fl" d="M60 100 L68 62 L75 84 L83 62 L90 100"/><path class="fl" d="M60 100 V122 M90 100 V122"/><rect class="c" x="52" y="122" width="46" height="14" rx="3"/><rect class="c" x="56" y="140" width="38" height="12" rx="3"/><rect class="c" x="64" y="156" width="22" height="12" rx="6"/></svg>'
      + '<p class="cv-t">Le circuit électrique</p><p class="cv-s">Mon livre de physique-chimie</p><span class="cv-n">6e</span><p class="cv-p">Huit lampes à allumer</p><button type="button" class="cv-go" data-ouvrir>Ouvrir mon livre</button></div><div class="b"></div>';
    c.style.setProperty('--allume', (nFinis() / N).toFixed(2));
    c.hidden = false; c.classList.remove('ouvert'); bk.classList.add('ferme');
    $('[data-ouvrir]', c).onclick = function () {
      audio(); papier(); bk.classList.remove('ferme'); c.classList.add('ouvert');
      try { sessionStorage.setItem('pc-livre-ci-ouvert', '1'); } catch (e) {}
      setTimeout(function () { c.hidden = true; }, anim ? 1100 : 0);
    };
  }

  /* ---------- sons ---------- */
  var AC = null;
  function audio() { if (!son) return null; try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
  function bip(f, t0, d, g) { var a = AC, o = a.createOscillator(), v = a.createGain(); o.type = 'sine'; o.frequency.value = f; v.gain.setValueAtTime(g, a.currentTime + t0); v.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + d); o.connect(v); v.connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + d + 0.02); }
  function clic() { if (!audio()) return; try { bip(1300, 0, 0.06, 0.04); } catch (e) {} }
  function carillon() { if (!audio()) return; try { [523, 659, 784, 1047].forEach(function (f, i) { bip(f, i * 0.11, 0.5, 0.05); }); } catch (e) {} }
  function papier() {
    var a = AC && son ? AC : null; if (!a) return;
    try { var n = a.sampleRate * 0.28, b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0), i; for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n); var s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'highpass'; fl.frequency.value = 1800; g.gain.value = 0.05; s.buffer = b; s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(); } catch (e) {}
  }

  /* ---------- démarrage ---------- */
  function init() {
    if (!$('#book')) return;
    var ok = true, c; for (c = 0; c < N; c++) if (!F(c)) ok = false;
    if (calme()) anim = false;
    B = chargeB();
    ajuste();
    if (!ok) { $('#sR').innerHTML = '<div class="page S"><h2>Livre indisponible</h2><p>Impossible de charger les chapitres. Recharge la page pour réessayer.</p></div>'; return; }
    var q = /[?&]c=([1-8])(?:&s=([1-3]))?/.exec(location.search);
    if (q) { B.c = +q[1] - 1; B.s = q[2] ? +q[2] - 1 : 0; B.h = 0; if (!debloque(idxDe(B.c, B.s, 0))) B.s = 0; }
    if (!debloque(posCour())) { B.c = -1; B.s = 0; B.h = 0; }
    var bk = $('#book');
    bk.addEventListener('input', function (e) {
      var t = e.target; if (t.hasAttribute('data-nom')) { B.nom = t.value; sauveB(); return; }
      var f = t.getAttribute('data-f'); if (!f) return; D(chap(t))[f] = t.value; sauveB();
    });
    bk.addEventListener('change', function (e) {
      var t = e.target, f = t.getAttribute('data-f'); if (!f || t.type !== 'radio') return; D(chap(t))[f] = t.value; sauveB();
    });
    bk.addEventListener('click', function (e) { var b = e.target.closest('[data-act]'); if (b && !b.disabled) agir(b); });
    $('#prev').onclick = function () { dec(-1); }; $('#next').onclick = function () { dec(1); };
    $('#bSom').onclick = function () { aller(0); };
    $('#dots').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; aller(idxDe(+b.getAttribute('data-c'), 0, 0)); };
    $('#bSon').onclick = function () { son = !son; this.setAttribute('aria-pressed', son); ajuste(); };
    $('#bAnim').onclick = function () { anim = !anim; this.setAttribute('aria-pressed', anim); ajuste(); };
    $('#bTh').onclick = function () { var r = document.documentElement, n = r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', n); try { localStorage.setItem('pc-theme', n); } catch (e) {} };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#volet').hidden) { fermeVolet(); return; }
      var t = e.target; if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || !$('#volet').hidden) return;
      if (e.key === 'ArrowRight') dec(1); if (e.key === 'ArrowLeft') dec(-1);
    });
    var x0 = null, fit = $('#fit');
    fit.addEventListener('touchstart', function (e) { x0 = /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName) ? null : e.touches[0].clientX; }, { passive: true });
    fit.addEventListener('touchend', function (e) { if (x0 == null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 70) dec(d < 0 ? 1 : -1); x0 = null; }, { passive: true });
    var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(function () { var ch = ajuste(); ajuste(); if (ch && !busy) monte(); }, 120); });
    monte();
    var deja = false; try { deja = sessionStorage.getItem('pc-livre-ci-ouvert') === '1'; } catch (e) {}
    if (B.c < 0 && !deja && anim) couverture();
  }
  window.NohobaLivreCI = { chapitres: function () { return IDS.map(function (_, c) { return F(c).titre; }); } };
  init();
})();
