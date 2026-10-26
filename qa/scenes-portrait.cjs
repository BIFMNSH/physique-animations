/* Scènes en portrait : les leçons de la 6e à la 3e déclarent des panneaux valides, le moteur les gère (vue par panneau, bouton Agrandir). */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const eng=fs.readFileSync(path.join(root,'assets/studio/studio.js'),'utf8'),css=fs.readFileSync(path.join(root,'assets/studio/studio.css'),'utf8');
assert.ok(eng.includes('function syncPanel')&&eng.includes("class: 'panels'"),'vue par panneau présente dans le moteur');
assert.ok(eng.includes("'Agrandir la simulation'"),'bouton Agrandir présent');
assert.ok(eng.includes('function wakeVoice'),'réveil de la voix par un geste présent');
assert.ok(css.includes('.app.portrait .scene>.panels'),'style des panneaux en portrait');
const LOT=['circuit-electrique','commande-circuit','court-circuit','solides-liquides','les-gaz','temperature','changements-etat','volume','masse','constituants-air','combustion-solide-liquide','combustion-gaz','dangers-combustions',
  'generateur-recepteur','association-lampes','piles-serie','intensite','tension','pression-atmospherique','melanges','atomes-molecules','combustion-carbone','combustion-soufre','dilatation-solides','dilatation-liquides','dilatation-gaz',
  'aimant-bobine','atomes-ions','dangers-secteur','lumiere-blanche','metal-ion','phases-eclipses','propagation-lumiere','qualite-eau','sources-recepteurs','tension-alternative','tension-sinusoidale','traitement-eau','transfo-redressement','alcanes','conducteur-ohmique','defauts-oeil','electrolyse-eau','energie-mecanique','equilibre-deux-forces','lentilles','les-forces','masse-poids','oxydation-corps-purs','puissance-energie-electriques','reduction-oxydes','solutions-acides-basiques','travail-puissance'];
for(const slug of LOT){
  const src=fs.readFileSync(path.join(root,'assets/studio/lecons/'+slug+'.js'),'utf8');
  const m=src.match(/panels:\s*\[((?:\{[^}]*\},?\s*)+)\]/);assert.ok(m,slug+' : panneaux déclarés');
  const items=[...m[1].matchAll(/\{ n: '([^']+)', r: \[(\d+), (\d+), (\d+), (\d+)\] \}/g)];
  assert.ok(items.length>=2,slug+' : au moins deux panneaux');
  for(const it of items){const [x,y,w,h]=it.slice(2).map(Number);assert.ok(x>=0&&y>=0&&x+w<=860&&y+h<=470&&w>=200&&h>=100,slug+' : panneau « '+it[1]+' » dans la scène 860 × 470');}
}
console.log('Scènes en portrait : panneaux des 53 leçons de 6e, 5e, 4e et 3e, moteur, bouton Agrandir et voix contrôlés.');
