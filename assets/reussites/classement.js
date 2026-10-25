/* NohobaLab · « Mes réussites » : niveau, badges et classement de classe (compte connecté).
   Motivation seulement : aucun point ni badge n'entre dans le certificat. Les points viennent du serveur. */
(function () {
  var C = window.NLCompte, $ = function (id) { return document.getElementById(id); };
  var root = $('gam'); if (!root) return;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function vider(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  var body = $('gam-body'), msg = $('gam-msg');
  function dire(t, ok) { msg.className = 'msg ' + (ok ? 'ok' : 'err'); msg.textContent = t || ''; }
  function req(p, o) { return C.req(p, o); }

  function invite(t, lien) {
    vider(body); body.appendChild(el('p', null, t));
    if (lien) { var a = el('a', 'btn', 'Se connecter'); a.href = '../connexion/'; body.appendChild(a); }
  }

  function niveau(me) {
    var s = el('div', 'lvl'), l = me.level;
    s.appendChild(el('h3', null, 'Niveau ' + l.num + ' · ' + l.name));
    var bar = el('div', 'bar'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.setAttribute('aria-valuenow', String(l.pct)); bar.setAttribute('aria-label', 'Progression vers le niveau suivant');
    var f = el('i'); f.style.width = l.pct + '%'; bar.appendChild(f); s.appendChild(bar);
    s.appendChild(el('p', 'note', me.xp + ' points d’expérience' + (l.next ? ' · encore ' + l.left + ' pour devenir ' + l.next : ' · dernier niveau atteint')));
    s.appendChild(el('p', 'note', 'Chaque étape terminée rapporte des points une seule fois : résumé ' + me.points.resume + ', simulation ' + me.points.sim + ', défi ' + me.points.defi + ', quiz réussi ' + me.points.quiz + '. Valeurs proposées, à valider par ton professeur.'));
    return s;
  }
  function badges(me) {
    var s = el('div'); s.appendChild(el('h3', null, 'Mes badges'));
    var ul = el('ul', 'bdg');
    me.badges.forEach(function (b) {
      var li = el('li', b.got ? 'got' : ''); li.appendChild(el('b', null, b.name));
      li.appendChild(el('span', null, b.got ? 'Obtenu' : b.cur + ' / ' + b.max)); li.appendChild(el('small', null, b.rule)); ul.appendChild(li);
    });
    s.appendChild(ul); return s;
  }

  function reglage(me, rafraichir) {
    var s = el('div', 'opt'); s.appendChild(el('h3', null, 'Classement de ma classe'));
    s.appendChild(el('p', 'note', 'Tu apparais sous un pseudo, jamais avec ton nom, ta photo ni ton numéro. Seuls les élèves de ta classe et ton professeur le voient. Tu peux te retirer à tout moment.'));
    var p = el('p'); p.appendChild(el('span', null, 'Mon pseudo : ')); p.appendChild(el('b', null, me.pseudo)); s.appendChild(p);
    var ch = el('button', 'btn sec', 'Choisir un autre pseudo'); ch.type = 'button';
    var zone = el('div', 'ps'); zone.setAttribute('aria-live', 'polite');
    ch.addEventListener('click', function () {
      req('/api/classement/pseudos').then(function (j) {
        vider(zone); zone.appendChild(el('p', 'note', 'Choisis un pseudo dans la liste :'));
        j.pseudos.forEach(function (x) { var b = el('button', 'btn sec', x); b.type = 'button'; b.addEventListener('click', function () { req('/api/classement/pseudo', { method: 'POST', body: { pseudo: x } }).then(function () { dire('Pseudo enregistré.', true); rafraichir(); }).catch(function (e) { dire(e.message); }); }); zone.appendChild(b); });
      }).catch(function (e) { dire(e.message); });
    });
    s.appendChild(ch); s.appendChild(zone);

    if (me.under15 === null) {
      var q = el('fieldset'); q.appendChild(el('legend', null, 'As-tu 15 ans ou plus ?'));
      [['Oui, 15 ans ou plus', false], ['Non, moins de 15 ans', true]].forEach(function (o) {
        var b = el('button', 'btn sec', o[0]); b.type = 'button';
        b.addEventListener('click', function () { req('/api/classement/optin', { method: 'POST', body: { optIn: false, under15: o[1] } }).then(rafraichir).catch(function (e) { dire(e.message); }); });
        q.appendChild(b);
      });
      s.appendChild(q); return s;
    }
    if (me.under15 && me.consent !== 'accorde' && !me.optIn) {
      var f = el('form'); f.noValidate = true;
      var lb = el('label', null, me.consent === 'en_attente' ? 'Un SMS a été envoyé. Pour renvoyer, saisis à nouveau le numéro du parent :' : 'Pour participer, un parent doit donner son accord. Numéro de téléphone du parent :'); lb.setAttribute('for', 'ptel');
      var inp = el('input'); inp.id = 'ptel'; inp.type = 'tel'; inp.autocomplete = 'off'; inp.placeholder = '+225 07 00 00 00 00';
      var go = el('button', 'btn', 'Envoyer la demande'); go.type = 'submit';
      f.appendChild(lb); f.appendChild(inp); f.appendChild(go);
      f.addEventListener('submit', function (ev) { ev.preventDefault(); req('/api/classement/consent/request', { method: 'POST', body: { parentPhone: inp.value } }).then(function () { dire('Demande envoyée au parent. Reviens ici après son accord.', true); }).catch(function (e) { dire(e.message); }); });
      s.appendChild(f);
      if (me.consent === 'en_attente') { var r = el('button', 'btn sec', 'J’ai l’accord, vérifier'); r.type = 'button'; r.addEventListener('click', rafraichir); s.appendChild(r); }
      return s;
    }
    var sw = el('button', 'btn' + (me.optIn ? ' sec' : ''), me.optIn ? 'Me retirer du classement' : 'Apparaître dans le classement'); sw.type = 'button';
    sw.addEventListener('click', function () {
      req('/api/classement/optin', { method: 'POST', body: { optIn: !me.optIn } }).then(function () { dire(me.optIn ? 'Tu n’apparais plus dans le classement.' : 'Tu apparais maintenant dans le classement.', true); rafraichir(); })
        .catch(function (e) { dire(e.code === 'consent_required' ? 'L’accord d’un parent est nécessaire.' : e.message); });
    });
    s.appendChild(sw); return s;
  }

  function tableau(d) {
    var s = el('div', 'lb2'); s.appendChild(el('h3', null, 'Classe « ' + d.class.name + ' » · cette semaine'));
    s.appendChild(el('p', 'note', d.participants + ' participant' + (d.participants > 1 ? 's' : '') + ' sur ' + d.class.students + ' élève' + (d.class.students > 1 ? 's' : '') + ' · ' + d.classWeek + ' points au total pour la classe. Le classement repart de zéro chaque lundi.'));
    if (!d.top.length) { s.appendChild(el('p', null, 'Personne n’apparaît encore. Sois le premier à rejoindre le classement.')); return s; }
    var ol = el('ol', 'rank');
    d.top.concat(d.me ? [d.me] : []).forEach(function (r) {
      var li = el('li', r.me ? 'me' : ''); li.value = r.rank;
      li.appendChild(el('span', 'rk', String(r.rank))); li.appendChild(el('b', null, r.pseudo + (r.me ? ' (moi)' : ''))); li.appendChild(el('span', 'lv', r.level)); li.appendChild(el('span', 'pt', r.week + ' pts'));
      ol.appendChild(li);
    });
    s.appendChild(ol); return s;
  }

  function charger() {
    req('/api/classement/me').then(function (me) {
      vider(body); body.appendChild(niveau(me)); body.appendChild(badges(me));
      var zone = el('div'); body.appendChild(reglage(me, charger)); body.appendChild(zone);
      req('/api/classes').then(function (cl) {
        var mine = (cl.joined || []).filter(function (c) { return true; })[0] || (cl.owned || [])[0];
        if (!mine) { zone.appendChild(el('p', 'note', 'Rejoins une classe avec le code de ton professeur (dans « Mon compte ») pour voir le classement.')); return; }
        if (me.optIn || cl.owned && cl.owned.length) req('/api/classement/classes/' + mine.id).then(function (d) { zone.appendChild(tableau(d)); }).catch(function () {});
        else zone.appendChild(el('p', 'note', 'Le classement de ta classe s’affiche dès que tu y participes.'));
      }).catch(function () {});
    }).catch(function (e) {
      if (e.status === 401) { try { localStorage.removeItem('nl-compte'); } catch (x) {} invite('Connecte-toi pour voir ton niveau, tes badges et le classement de ta classe. Sans compte, rien ne change : tes documents restent disponibles ci-dessus.', true); }
      else invite('Le classement est momentanément indisponible. Réessaie plus tard.');
    });
  }
  if (!C || !C.connecte || !C.connecte()) invite('Connecte-toi pour voir ton niveau, tes badges et le classement de ta classe. Sans compte, rien ne change : tes documents restent disponibles ci-dessus.', true);
  else charger();
})();
