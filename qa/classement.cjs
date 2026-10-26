// Client « classement » : invité, élève connecté (réponses simulées), aucune donnée perso affichée, texte inséré sans HTML.
const { JSDOM } = require('jsdom'); const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'); let ko = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  KO  ') + m); if (!c) ko++; };
async function page(connecte, routes) {
  const html = fs.readFileSync(path.join(root, 'reussites/index.html'), 'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://lab.nohaba.com/reussites/' }); const w = dom.window;
  w.NLCompte = { connecte: () => connecte, req: (p) => routes[p] ? Promise.resolve(routes[p]) : Promise.reject(Object.assign(new Error('x'), { status: 404 })) };
  w.eval(fs.readFileSync(path.join(root, 'assets/reussites/classement.js'), 'utf8'));
  await new Promise((r) => setTimeout(r, 50)); return w.document;
}
(async () => {
  let d = await page(false, {});
  ok(/Connecte-toi/.test(d.getElementById('gam-body').textContent), 'invité : invitation à se connecter, aucun appel');
  const me = { pseudo: 'Atome-Malin-42', optIn: true, under15: false, consent: 'inutile', xp: 100, week: 30, points: { resume: 10, sim: 20, defi: 20, quiz: 30 }, level: { num: 2, name: 'Expérimentateur', next: 'Chercheur', left: 140, pct: 11 },
    badges: [{ id: 'a', name: 'Premier défi', rule: 'Terminer un défi.', cur: 1, max: 1, got: true }, { id: 'b', name: '<img src=x onerror=alert(1)>', rule: 'r', cur: 0, max: 3, got: false }] };
  d = await page(true, { '/api/classement/me': me, '/api/classes': { owned: [], joined: [{ id: 5, name: '6e T', level: '6e' }] },
    '/api/classement/classes/5': { class: { id: 5, name: '6e T', students: 4 }, participants: 2, classWeek: 80, top: [{ rank: 1, pseudo: 'Quark-Vif-07', level: 'Chercheur', week: 50, me: false }, { rank: 2, pseudo: 'Atome-Malin-42', level: 'Expérimentateur', week: 30, me: true }], me: null } });
  const t = d.getElementById('gam-body').textContent;
  ok(/Niveau 2 · Expérimentateur/.test(t) && /encore 140/.test(t), 'niveau et points affichés');
  ok(d.querySelector('[role=progressbar]').getAttribute('aria-valuenow') === '11', 'barre accessible');
  ok(d.querySelectorAll('.rank li').length === 2 && /\(moi\)/.test(t), 'classement avec ma ligne');
  ok(!d.querySelector('#gam img'), 'texte du serveur inséré sans HTML');
  ok(/ne comptent pas dans le certificat/.test(d.getElementById('gam').textContent), 'mention : motivation seulement');
  d = await page(true, { '/api/classement/me': { ...me, under15: true, consent: 'requis', optIn: false }, '/api/classes': { owned: [], joined: [] } });
  ok(!!d.getElementById('ptel') && /parent/.test(d.getElementById('gam-body').textContent), 'moins de 15 ans : demande d’accord du parent');
  ok(d.querySelector('label[for=ptel]'), 'champ étiqueté');
  process.exit(ko ? 1 : 0);
})();
