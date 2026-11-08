/* NOHOBA-Lab · client du serveur des comptes (api.lab.nohaba.com).
   N'appelle le serveur que si l'utilisateur s'est déjà connecté (indicateur local) : un visiteur anonyme ne déclenche aucune requête. */
(function () {
  var API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:3000' : ''; // Proxy de même origine défini dans vercel.json
  var FLAG = 'nl-compte';
  function flag(v) { try { if (v === undefined) return localStorage.getItem(FLAG) === '1'; if (v) localStorage.setItem(FLAG, '1'); else localStorage.removeItem(FLAG); } catch (e) {} return false; }
  function req(path, o) {
    o = o || {};
    var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},15000);
    return fetch(API + path, { signal: controller.signal, method: o.method || 'GET', credentials: 'include', headers: o.body ? { 'Content-Type': 'application/json' } : undefined, body: o.body ? JSON.stringify(o.body) : undefined })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) { var e = new Error((j && (j.error || j.message)) || ('Erreur ' + r.status)); e.status = r.status; e.code = j && j.code; throw e; }
          return j;
        });
      }).catch(function(e){if(e.name==='AbortError')throw new Error('Le service met trop de temps à répondre. Réessayez.');throw e;}).finally(function(){clearTimeout(timer);});
  }
  var C = {
    api: API, req: req, oublier: function(){flag(false);},
    providers: function () { return req('/api/providers'); },
    me: function () { return req('/api/me'); },
    signOut: function () { return req('/api/auth/sign-out', { method: 'POST', body: {} }).then(function (j) { flag(false); return j; }); },
    marquer: function () { flag(true); },
    connecte: function () { return flag(); }
  };
  window.NLCompte = C;
  // Lien « Se connecter » → « Mon compte » (pages qui portent [data-compte])
  function maj() {
    var els = document.querySelectorAll('[data-compte]'); if (!els.length || !flag()) return;
    C.me().then(function (m) {
      var n = (m.profile && m.profile.display_name) || (m.user && m.user.name) || '';
      els.forEach(function (a) { a.textContent = 'Mon compte'; a.setAttribute('aria-label', 'Mon compte' + (n ? ' : ' + n : '')); });
    }).catch(function (e) { if (e.status === 401) flag(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maj); else maj();
})();

