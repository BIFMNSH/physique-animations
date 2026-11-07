/* Banc des leçons de 5e (boucle à une ou deux lampes, voltmètre au centre) : polarité, empilement des fiches,
   câbles hors des modules, points A, B, C, K sans fenêtre 3D dans la leçon, éclat des lampes, grains. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const src=fs.readFileSync(path.resolve(__dirname,'../assets/shared/atelier-electrique.js'),'utf8');
const w=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;w.eval(src);const A=w.NohobaAtelier;
assert.equal(typeof A.banc5e,'function');assert.equal(typeof A.ptCab,'function');

/* modules (rectangles et cercles de verre) dans le repère du banc */
const MOD=[['pile',243,46,327,114],['K',35,190,135,222],['L1',440,192,510,224],['L2',245,332,315,364]];
const VERRE=[[475,172,21],[280,312,21]];
const J=x=>JSON.stringify(Array.from(x));
const dedans=(p,r)=>p[0]>r[1]&&p[0]<r[3]&&p[1]>r[2]&&p[1]<r[4];
function horsModules(r,n,volt){
  const mods=MOD.filter(m=>n===2||m[0]!=='L2').concat(volt?[['voltmètre',210,150,350,218]]:[]);
  r.cables.forEach((c,i)=>{for(let u=.14;u<=.86;u+=.02){const p=A.ptCab(c[0],c[1],c[2],c[3],u);
    mods.forEach(m=>assert.ok(!dedans(p,m),'le câble '+i+' traverse '+m[0]+' en u='+u.toFixed(2)));
    VERRE.slice(0,n).forEach(v=>assert.ok(Math.hypot(p[0]-v[0],p[1]-v[1])>v[2],'le câble '+i+' traverse le verre d’une lampe'));}});
}

for(const n of [1,2]){
  const r=A.banc5e({n,on:true,pts:true,volt:n===2});
  /* la boucle part de la borne + de la pile, passe par chaque dipôle puis revient à la borne − */
  assert.equal(r.cables.length,n===2?4:3);
  assert.equal(r.cables[0][2],r.bornes.L1[0],'le câble de la borne + arrive sur le + de L1');
  assert.equal(r.cables[1][0],r.bornes.L1[1],'le câble suivant repart du − de L1');
  if(n===2){assert.equal(r.cables[1][2],r.bornes.L2[0]);assert.equal(r.cables[2][0],r.bornes.L2[1]);assert.equal(r.cables[2][2],r.bornes.K[0]);assert.equal(r.cables[3][0],r.bornes.K[1]);}
  else{assert.equal(r.cables[1][2],r.bornes.K[0]);assert.equal(r.cables[2][0],r.bornes.K[1]);}
  horsModules(r,n,n===2);
  /* points de mesure sur les câbles, dans le cadre, hors des modules */
  ['A','B','C'].forEach(p=>{const c=r.pos[p];assert.ok(c[0]>10&&c[0]<550&&c[1]>10&&c[1]<(n===2?415:280),'point '+p+' dans le cadre');
    MOD.filter(m=>n===2||m[0]!=='L2').forEach(m=>assert.ok(!dedans(c,m),'point '+p+' dans '+m[0]));
    assert.ok(new RegExp('data-p="'+p+'"').test(r.svg),'zone tactile du point '+p);});
  assert.ok(/role="img"/.test(r.svg)&&/aria-label="Montage/.test(r.svg),'nom accessible du montage');
}

/* voltmètre : fiche orange (V) sur le + du dipôle, fiche bleue (COM) sur le −, posées sur la fiche du circuit */
for(const d of ['L1','L2','K']){
  const r=A.banc5e({n:2,on:true,volt:true,dip:d,txt:'1,5 V'});
  assert.equal(J(r.fiches.v),J([r.bornes[d][0][0],r.bornes[d][0][1]-34]),d+' : V sur la borne +, fiche empilée');
  assert.equal(J(r.fiches.c),J([r.bornes[d][1][0],r.bornes[d][1][1]-34]),d+' : COM sur la borne −');
  assert.ok(r.fiches.v[0]>r.fiches.c[0],d+' : le + est du côté droit, comme la pile');
  assert.ok(/1,5 V/.test(r.svg)&&/Voltmètre/.test(r.svg));
}
{const r=A.banc5e({n:2,on:true,volt:true,dip:'G',txt:'4,5 V'});
 assert.ok(r.fiches.v[0]>r.fiches.c[0]&&r.fiches.v[1]===r.fiches.c[1],'pile : V sur la languette +, COM sur la languette −');
 assert.ok(r.svg.indexOf('>+<')>0&&r.svg.indexOf('>−<')>0,'bornes + et − imprimées sur la pile');}
{const r=A.banc5e({n:1,on:true,volt:true});assert.ok(!/Voltmètre/.test(r.svg),'pas de voltmètre avec une seule lampe');}
{const r=A.banc5e({n:2,on:true});assert.ok(!/Voltmètre/.test(r.svg),'voltmètre absent par défaut');}

/* K : fenêtre 3D par défaut, simple bascule quand la leçon le demande ; pile et lampes gardent la 3D */
{const a=A.banc5e({n:2,on:true}).svg,b=A.banc5e({n:2,on:true,interSansPop:true,pts:true}).svg;
 assert.ok(/data-pop="inter"/.test(a)&&!/data-inter/.test(a));
 assert.ok(!/data-pop="inter"/.test(b)&&/data-inter/.test(b),'leçon : un clic sur K le bascule, sans fenêtre 3D');
 assert.ok(/data-pop="pile"/.test(b)&&/data-pop="lampe"/.test(b),'pile et lampes gardent la fenêtre 3D');}

/* éclat : L1 moins vive que L2 (20 Ω contre 40 Ω), lampes éteintes sans halo */
{const s=A.banc5e({n:2,on:true,k1:.5,k2:1}).svg;
 assert.ok(/fill="#FFD27A" opacity="0.1"/.test(s)&&/fill="#FFD27A" opacity="0.2"/.test(s),'deux éclats différents');
 assert.ok(!/#FFD27A/.test(A.banc5e({n:2,on:false}).svg),'lampes éteintes : aucun halo');}

/* grains : le chemin porte les identifiants demandés et suit toute la boucle */
{const r=A.banc5e({n:1,on:true,grains:{path:'p1',g:'g1'}});
 assert.ok(/<path id="p1" d="M/.test(r.svg)&&/<g id="g1"><\/g>/.test(r.svg));assert.equal((r.boucle.match(/M/g)||[]).length,3);}

console.log('Banc des leçons de 5e : polarité, fiches, câbles, points, K, éclat et grains contrôlés.');
