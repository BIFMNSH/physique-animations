/* Leçon d'essai : « La lampe use-t-elle le courant ? » (5e), quatre étapes, une action principale par écran.
   Modèle : lampe assimilée à une résistance constante de 15 Ω, pile idéale de 4,5 V, en série.
   Une vraie lampe n'a pas une résistance constante : les valeurs sont celles de la simulation, et l'écran le dit.
   Progression dans « pc-essai-intensite ». Rien n'est envoyé. */
(function () {
  'use strict';
  var U = 4.5, R = 15, CLE = 'pc-essai-intensite', POINTS = ['A', 'B', 'C'];
  /* intensité en mA, identique en tout point du circuit en série */
  function intensite(nbLampes, ferme) { return ferme ? Math.round(U / (nbLampes * R) * 1000) : 0; }
  window.NohobaEssaiIntensite = { intensite: intensite };

  var A = window.NohobaAtelier, $ = function (id) { return document.getElementById(id); };
  var ETAPES = ['Essaie', 'Regarde', 'Enquête', 'Vérifie'];
  var QUESTIONS = [
    { q: 'À l’étape Essaie, quelle intensité as-tu mesurée en B, juste après la lampe ?', c: ['0 mA', '150 mA', '300 mA', '600 mA'], b: 2, e: 'Tu as lu 300 mA en B, comme en A : la lampe n’a pas réduit le courant qui la traverse.' },
    { q: 'Avec deux lampes, quelle intensité as-tu mesurée en C ?', c: ['0 mA', '150 mA', '300 mA', '600 mA'], b: 1, e: 'Tu as lu 150 mA en C, comme en A et en B.' },
    { q: 'Kofi lit 120 mA avant un moteur placé en série. Que lira-t-il juste après ?', c: ['0 mA', '60 mA', '120 mA', '240 mA'], b: 2, e: 'En série, l’intensité est la même en tout point : 120 mA.' },
    { q: '300 mA, cela fait :', c: ['0,03 A', '0,3 A', '3 A', '30 A'], b: 1, e: '1 A = 1 000 mA, donc 300 ÷ 1 000 = 0,3 A.' },
    { q: 'Awa ouvre l’interrupteur. Que lit-elle en A ?', c: ['0 mA', '150 mA', '300 mA', 'Rien ne change'], b: 0, e: 'Le circuit est ouvert : le courant ne circule plus, nulle part.' },
    { q: 'Comment branche-t-on un ampèremètre ?', c: ['En série', 'En dérivation', 'Sur le verre de la lampe', 'Sans le relier au circuit'], b: 0, e: 'Le courant doit traverser l’ampèremètre : il se branche en série.' },
    { q: 'La lampe n’use pas le courant. Que reçoit-elle de la pile ?', c: ['Des fils', 'De l’énergie', 'Du verre', 'Une tension de 0 V'], b: 1, e: 'La pile transfère de l’énergie à la lampe, qui la convertit en lumière et en chaleur.' }
  ];

  function neuf() { return { etape: 0, m1: {}, m2: {}, prevision: null, rep: [], fini: false }; }
  function lire() { try { var v = JSON.parse(localStorage.getItem(CLE)); return v && typeof v === 'object' && v.m1 && v.m2 ? v : neuf(); } catch (e) { return neuf(); } }
  function sauve() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {} }
  var S = neuf(), lab = { n: 1, ferme: true, pt: null }, raf = 0, prof = false;

  /* ---------- dessin ---------- */
  var SCH = { A: [340, 63], B: [292, 160], C: [146, 40] };
  /* banc : pile en haut, L1 à droite, K à gauche, L2 en bas ; les points A, B, C sont posés sur les câbles et les grains suivent la boucle */
  function montage() {
    var n = lab.n, on = lab.ferme;
    return A.banc5e({ n: n, on: on, k1: n === 2 ? .5 : 1, k2: .5, pts: true, sel: lab.pt, grains: { path: 'le-boucle', g: 'le-grains' }, interSansPop: true,
      label: 'Montage : pile de 4,5 V, ' + (n === 2 ? 'deux lampes' : 'une lampe') + ' et interrupteur ' + (on ? 'fermé' : 'ouvert') + ' en série, avec les points de mesure A, B et C. Touche l’interrupteur pour l’ouvrir ou le fermer.' }).svg;
  }
  function schema() {
    var h = A.schema({ cotes: { droite: 'lampe', bas: lab.n === 2 ? 'lampe' : 'fil', gauche: lab.ferme ? 'interFerme' : 'interOuvert' }, legende: 'Schéma normalisé', label: 'Schéma normalisé du montage en série' + (lab.pt ? ', ampèremètre au point ' + lab.pt : '') + '.' });
    if (!lab.pt) return h;
    var c = SCH[lab.pt];
    return h.replace('</svg>', '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="14" fill="#fff" stroke="#243049" stroke-width="2.5"/>' + A.T(c[0], c[1] + 6, 'A', 17, '#243049', 800) + '</svg>');
  }
  function grains() {
    cancelAnimationFrame(raf);
    var path = $('le-boucle'), g = $('le-grains');
    if (!path || !g || !path.getTotalLength) return;
    var L = path.getTotalLength(), nb = 18, i, c = [], d0 = window.__leD0 || 0, t0 = 0;
    for (i = 0; i < nb; i++) { var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); el.setAttribute('r', '5.5'); el.setAttribute('fill', '#F97316'); g.appendChild(el); c.push(el); }
    function pose(d) { c.forEach(function (el, k) { var p = path.getPointAtLength(((d + k * L / nb) % L + L) % L); el.setAttribute('cx', p.x); el.setAttribute('cy', p.y); }); }
    pose(d0);
    var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calme || !lab.ferme) return;
    var v = intensite(lab.n, true) * 0.3; /* px/s proportionnels à l'intensité */
    function pas(t) { if (!t0) t0 = t; var d = d0 + (t - t0) / 1000 * v; window.__leD0 = d % L; pose(d); raf = requestAnimationFrame(pas); }
    raf = requestAnimationFrame(pas);
  }

  /* ---------- laboratoire ---------- */
  function mesures() { return S.etape === 2 ? S.m2 : S.m1; }
  function peint() {
    $('le-montage').innerHTML = montage();
    $('le-schema').innerHTML = schema();
    var v = lab.pt ? intensite(lab.n, lab.ferme) + ' mA' : '— mA';
    $('le-val').textContent = v;
    $('le-pos').textContent = lab.pt ? 'Mesure en ' + lab.pt : 'Ampèremètre';
    POINTS.forEach(function (p) {
      var b = $('le-pt-' + p), m = mesures()[p];
      b.className = 'le-pt' + (lab.pt === p ? ' sel' : '');
      b.setAttribute('aria-pressed', lab.pt === p ? 'true' : 'false');
      b.querySelector('small').textContent = m == null ? 'à mesurer' : m + ' mA';
    });
    $('le-inter').textContent = lab.ferme ? 'Ouvrir l’interrupteur' : 'Fermer l’interrupteur';
    var nb = POINTS.filter(function (p) { return mesures()[p] != null; }).length;
    $('le-msg').textContent = !lab.ferme ? 'Le circuit est ouvert. Ferme-le pour mesurer.' : nb < 3 ? 'Touche ' + POINTS.filter(function (p) { return mesures()[p] == null; }).join(', puis ') + '.' : 'Les trois mesures sont faites.';
    $('le-go').hidden = nb < 3;
    grains();
  }
  function choisir(p) {
    lab.pt = p;
    if (lab.ferme) { mesures()[p] = intensite(lab.n, true); sauve(); }
    peint();
  }
  function basculer() { lab.ferme = !lab.ferme; if (lab.ferme && lab.pt) { mesures()[lab.pt] = intensite(lab.n, true); sauve(); } peint(); }
  function htmlLab(suite) {
    return '<div class="le-lab"><div class="le-montage" id="le-montage"></div><div class="le-instr">'
      + '<div class="le-ecran"><small id="le-pos">Ampèremètre</small><output id="le-val">— mA</output></div>'
      + '<div class="le-points">' + POINTS.map(function (p) { return '<button type="button" class="le-pt" id="le-pt-' + p + '" data-pt="' + p + '">' + p + '<small>à mesurer</small></button>'; }).join('') + '</div>'
      + '<button type="button" class="sp-btn ghost le-inter" id="le-inter">Ouvrir l’interrupteur</button>'
      + '<p class="mo-msg le-txt" id="le-msg"></p><button type="button" class="sp-btn le-txt" id="le-go" hidden>' + suite + '</button></div><div class="le-schema" id="le-schema"></div></div>';
  }
  function lierLab(suite) {
    var app = $('le-app');
    app.onclick = function (e) {
      var t = e.target, g = t.closest && t.closest('[data-p],[data-pt],[data-inter]');
      if (g && g.hasAttribute('data-inter')) basculer();
      else if (g) choisir(g.getAttribute('data-p') || g.getAttribute('data-pt'));
    };
    $('le-inter').onclick = function (e) { e.stopPropagation(); basculer(); };
    $('le-go').onclick = suite;
    peint();
  }
  function sansLab() { cancelAnimationFrame(raf); $('le-app').onclick = null; $('le-prof').hidden = true; if (prof) basculeProf(); }

  /* ---------- étapes ---------- */
  function aller(n) { S.etape = n; sauve(); rendre(); window.scrollTo && window.scrollTo(0, 0); }
  function essaie() {
    lab = { n: 1, ferme: true, pt: null };
    $('le-app').innerHTML = '<h1 class="sp-h1 mo-h1 le-txt">Mesure le courant autour de la lampe</h1>' + htmlLab('Continuer')
      + '<details class="le-comp le-txt"><summary>Ce que je vais apprendre</summary><p class="mo-theme"><b>Thème : Mesure de grandeurs physiques</b></p><p>Chapitre : L’intensité du courant électrique</p><p><b>Compétence visée :</b> mesurer une intensité en plusieurs points d’un circuit en série.</p><p>À la fin de cette partie, je dois être capable de dire que l’intensité est la même en tout point d’un circuit en série.</p></details>';
    $('le-prof').hidden = false;
    lierLab(function () { aller(1); });
  }
  function regarde() {
    sansLab();
    var m = S.m1;
    $('le-app').innerHTML = '<h1 class="sp-h1 mo-h1">Voici ce que tu as mesuré</h1>'
      + '<table class="le-table"><thead><tr><th scope="col">Point</th><th scope="col">Intensité</th></tr></thead><tbody>'
      + '<tr><td>A, avant la lampe</td><td>' + m.A + ' mA</td></tr><tr><td>B, après la lampe</td><td>' + m.B + ' mA</td></tr><tr><td>C, près de la pile</td><td>' + m.C + ' mA</td></tr></tbody></table>'
      + '<div class="le-box"><p class="le-loi">I<sub>A</sub> = I<sub>B</sub> = I<sub>C</sub> = ' + m.A + ' mA</p><p>Dans un circuit en série, l’intensité est la même en tout point.</p></div>'
      + '<p class="mo-lead">Pense à la chaîne d’un vélo : les maillons qui reviennent sont aussi nombreux que ceux qui partent, et pourtant ils font tourner la roue.</p>'
      + '<p class="sp-note">Ce sont les valeurs de la simulation. Une vraie lampe peut donner des valeurs un peu différentes.</p>'
      + '<button type="button" class="sp-btn mo-go" id="le-go">Continuer</button>';
    $('le-go').onclick = function () { aller(2); };
  }
  var OPTIONS = ['Le courant baisse après chaque lampe.', 'Le courant garde la même valeur partout.', 'Le courant augmente après chaque lampe.'];
  function enquete() {
    if (S.prevision == null) { sansLab(); return prevision(); }
    lab = { n: 2, ferme: true, pt: null };
    $('le-app').innerHTML = '<h1 class="sp-h1 mo-h1 le-txt">Vérifie avec deux lampes</h1>'
      + '<p class="mo-lead le-txt">Ta prévision : ' + OPTIONS[S.prevision].toLowerCase() + '</p>' + htmlLab('Voir le résultat')
      + '<div id="le-bilan" class="le-txt"></div>';
    $('le-prof').hidden = false;
    lierLab(function () {
      $('le-go').hidden = true;
      if (S.etape !== 2) return;
      var m = S.m2;
      $('le-bilan').innerHTML = '<div class="le-box ok"><p><b>' + (S.prevision === 1 ? 'Ta prévision était juste.' : 'C’est une idée très répandue, mais la mesure dit autre chose.') + '</b></p><p class="le-loi">I<sub>A</sub> = I<sub>B</sub> = I<sub>C</sub> = ' + m.A + ' mA</p><p>Avec deux lampes, le courant est plus faible, et il l’est dans tout le circuit. Les lampes le freinent, mais elles ne l’usent pas : ce qu’elles reçoivent de la pile, c’est de l’énergie.</p><button type="button" class="sp-btn mo-go" id="le-vers">Passer au défi</button></div>';
      $('le-vers').onclick = function () { aller(3); };
      $('le-bilan').scrollIntoView && $('le-bilan').scrollIntoView();
    });
  }
  function prevision() {
    $('le-app').innerHTML = '<h1 class="sp-h1 mo-h1">Awa ajoute une deuxième lampe</h1>'
      + '<p class="mo-big">« Chaque lampe use un peu de courant », dit Awa. « Après la deuxième, il en restera moins. »</p>'
      + '<p class="mo-lead">Et toi, que prévois-tu ?</p><div class="le-ch" id="le-ch">'
      + OPTIONS.map(function (o, i) { return '<button type="button" data-i="' + i + '">' + o + '</button>'; }).join('') + '</div>';
    $('le-ch').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.prevision = +b.getAttribute('data-i'); sauve(); rendre(); };
  }
  function verifie() {
    sansLab();
    var i = S.rep.length;
    if (i >= QUESTIONS.length) return fin();
    var q = QUESTIONS[i];
    $('le-app').innerHTML = '<p class="sp-note">Question ' + (i + 1) + ' sur ' + QUESTIONS.length + '</p><h1 class="sp-h2">' + q.q + '</h1><div class="le-ch" id="le-ch">'
      + q.c.map(function (o, k) { return '<button type="button" data-i="' + k + '">' + o + '</button>'; }).join('') + '</div><div id="le-exp"></div>';
    $('le-ch').onclick = function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      var k = +b.getAttribute('data-i'), bon = k === q.b;
      Array.prototype.forEach.call(this.children, function (x, j) { x.disabled = true; if (j === q.b) x.classList.add('bon'); else if (j === k) x.classList.add('faux'); });
      $('le-exp').innerHTML = '<div class="le-box' + (bon ? ' ok' : '') + '"><p><b>' + (bon ? 'Exact.' : 'Pas tout à fait.') + '</b> ' + q.e + '</p></div><p></p><button type="button" class="sp-btn mo-go" id="le-sv">' + (i + 1 < QUESTIONS.length ? 'Question suivante' : 'Voir mon résultat') + '</button>';
      $('le-sv').onclick = function () { S.rep.push(bon ? 1 : 0); if (S.rep.length === QUESTIONS.length) S.fini = true; sauve(); rendre(); };
    };
  }
  function fin() {
    var t = S.rep.reduce(function (a, b) { return a + b; }, 0);
    $('le-app').innerHTML = '<h1 class="sp-h1 mo-h1">Leçon terminée</h1><p class="le-score">' + t + ' sur ' + QUESTIONS.length + '</p>'
      + '<div class="le-box"><p><b>À retenir :</b> dans un circuit en série, l’intensité est la même en tout point. Une lampe n’use pas le courant : elle reçoit de l’énergie.</p></div>'
      + '<button type="button" class="sp-btn mo-go" id="le-re">Recommencer</button>';
    $('le-re').onclick = function () { S = neuf(); sauve(); rendre(); };
  }
  function rendre() {
    $('le-steps').innerHTML = ETAPES.map(function (t, i) { return '<li class="' + (i === S.etape ? 'on' : i < S.etape ? 'done' : '') + '"' + (i === S.etape ? ' aria-current="step"' : '') + '>' + t + '</li>'; }).join('');
    [essaie, regarde, enquete, verifie][S.etape]();
  }

  function basculeProf() {
    prof = !prof; document.body.classList.toggle('prof', prof);
    $('le-prof').textContent = prof ? 'Quitter le mode enseignant' : 'Mode enseignant';
  }
  function init() {
    if (!$('le-app')) return;
    S = lire();
    if (window.NohobaSimple) window.NohobaSimple.bindTheme();
    $('le-prof').onclick = basculeProf;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && prof) basculeProf(); });
    rendre();
  }
  init();
})();
