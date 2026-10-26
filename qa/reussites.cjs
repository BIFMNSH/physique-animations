const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');let checks=0;const check=(v,m)=>{assert(v,m);checks++;};
const R=require(path.join(root,'assets/reussites/regles.js')),P=require(path.join(root,'assets/reussites/pdf.js'));
const vm=require('node:vm');const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'assets/studio/programme.js'),'utf8'),ctx);
const PROG=ctx.window.PROGRAMME;
const L=R.lecons(PROG,'6e');check(L.length>3,'leçons de 6e en ligne');
const full=(f)=>Object.fromEntries(L.map(l=>[l.slug,f(l)]));
const done={resume:true,sim:true,defi:true};
const base={classe:'6e',programme:PROG,eleve:'Awa Koné',maintenant:new Date('2026-10-25T12:00:00Z')};
const code=(f)=>{try{f();}catch(e){return e.code;}return null;};
// 1. parcours incomplet : pas d'attestation de réussite ni de participation
const vide=R.evaluerParcours(L,{});check(vide.etat==='en_cours'&&vide.conditions.length===2,'parcours vide en cours, conditions expliquées');
check(code(()=>R.document('reussite',{...base,prog:{}}))==='NON_ELIGIBLE','1. incomplet : pas de réussite');
check(code(()=>R.document('participation',{...base,prog:{}}))==='NON_ELIGIBLE','incomplet : pas de participation');
const une={[L[0].slug]:{...done,quiz:true}};check(code(()=>R.document('reussite',{...base,prog:une}))==='NON_ELIGIBLE','une leçon réussie ne suffit pas');
// 2. terminé mais quiz non réussis : participation seulement
const fini=full(()=>({...done}));const ev2=R.evaluerParcours(L,fini);
check(ev2.etat==='participation','2. activités terminées, quiz non réussis = participation');
check(code(()=>R.document('reussite',{...base,prog:fini}))==='NON_ELIGIBLE','2. terminé non validé : pas présenté comme réussi');
const dp=R.document('participation',{...base,prog:fini});check(dp.nature==='Attestation de participation'&&!/réussi/.test(dp.nature),'participation : libellé adapté');
// quiz réussis mais activités manquantes
check(R.evaluerParcours(L,full(()=>({quiz:true}))).etat==='en_cours','quiz seuls sans activités : en cours');
// 3. parcours réussi
const reussi=full(()=>({...done,quiz:true}));check(R.evaluerParcours(L,reussi).etat==='reussite','3. réussite');
const dr=R.document('reussite',{...base,prog:reussi});check(dr.nature==='Attestation de réussite'&&dr.emetteur==='NohobaLab'&&dr.niveau==='6e','3. attestation de réussite');
// valeurs truthy non booléennes ne comptent pas (données altérées)
check(R.evaluerParcours(L,full(()=>({resume:'oui',sim:1,defi:'true',quiz:'true'}))).etat==='en_cours','valeurs non booléennes refusées');
// 4. certificat : seulement des validations explicites
check(R.certificat([]).etat==='indisponible'&&R.certificat(undefined).etat==='indisponible','4. aucune validation = indisponible');
check(code(()=>R.document('certificat',{...base,prog:reussi,validations:[]}))==='NON_VALIDE','4. parcours réussi mais aucune compétence validée : pas de certificat');
const val=[{competence:'Communiquer',niveau:'TB'},{competence:'Mesurer',niveau:'inventé'},{competence:'  '},null,{competence:'Communiquer',niveau:'F'}];
const ce=R.certificat(val);check(ce.competences.length===2&&ce.competences[0].niveauTexte==='très bonne maîtrise'&&ce.competences[1].niveau===null,'4. niveaux inventés ignorés, doublons retirés');
const dc=R.document('certificat',{...base,prog:{},validations:val});check(dc.competences.length===2&&dc.nature==='Certificat de compétences','4. certificat avec compétences validées');
// 5. identité
check(code(()=>R.document('reussite',{...base,prog:reussi,eleve:''}))==='NOM'&&code(()=>R.document('reussite',{...base,prog:reussi,classe:'2nde'}))==='CLASSE','5. nom et classe exigés');
check(R.document('reussite',{...base,prog:reussi,eleve:'  Awa   Koné '}).eleve==='Awa Koné','nom normalisé');
// 6. PDF
function pdfOK(b,nom){const s=Buffer.from(b).toString('latin1');check(s.startsWith('%PDF-1.4')&&s.trimEnd().endsWith('%%EOF'),nom+' en-tête et fin');
 const sx=+s.match(/startxref\n(\d+)/)[1];check(s.slice(sx,sx+4)==='xref',nom+' xref');
 const offs=[...s.slice(sx).matchAll(/(\d{10}) 00000 n/g)].map(m=>+m[1]);offs.forEach((o,i)=>check(s.slice(o).startsWith((i+1)+' 0 obj'),nom+' objet '+(i+1)));
 check(!/NaN|undefined|Infinity/.test(s),nom+' sans NaN');return s;}
const longNom='Adjoua Marie-Constance Kouamé-N’Guessan épouse Traoré de la famille Yao';
const s1=pdfOK(P.creer(R.document('reussite',{...base,prog:reussi,eleve:longNom})),'attestation');
check(s1.includes('(Attestation de r\xe9ussite)')&&s1.includes('Kouam\xe9-N\x92Guessan')&&s1.includes('25 octobre 2026'),'6. accents WinAnsi et date réelle');
check(!/Replier|Télécharger|Télécharger/.test(s1),'6. aucun bouton dans le PDF');
for(const l of P.wrap(longNom,24,true,467))check(P.width(l,24,true)<=467,'6. nom long coupé');
check(P.wrap('A'.repeat(200),12,false,200).every(l=>P.width(l,12,false)<=200),'6. mot trop long coupé');
const many=Array.from({length:40},(_,i)=>({competence:'Compétence numéro '+i+' avec un intitulé assez long pour passer à la ligne dans le tableau du certificat',niveau:'S'}));
const s3=pdfOK(P.creer(R.document('certificat',{...base,prog:{},validations:many})),'certificat long');check((s3.match(/\/Type \/Page /g)||[]).length>=2,'6. certificat long sur plusieurs pages');
check(/Parcours de physique-chimie de la classe de 6e/.test(s1)&&/Classe de 6e/.test(s1),'5. parcours et niveau dans le PDF');
const txt1=[...s1.matchAll(/\((.*?)\) Tj/g)].map(m=>m[1]).join(' ');check(!/signature|accr\xe9ditation|agr\xe9\xe9/i.test(txt1)&&/pas \xe9t\xe9 v\xe9rifi\xe9 par un tiers/.test(txt1)&&/pas de valeur officielle/.test(txt1),'aucune fausse reconnaissance, limite indiquée');
// 7-9. page : jsdom
async function page(store,{validations,blobFail}={}){
 const html=fs.readFileSync(path.join(root,'reussites/index.html'),'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g,'');
 const dom=new JSDOM(html,{url:'http://localhost/reussites/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 Object.entries(store).forEach(([k,v])=>w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v)));
 const got=[];w.URL.createObjectURL=b=>{if(blobFail)throw new Error('x');got.push(b);return 'blob:x';};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){this._dl=this.download;got.push('dl:'+this.download);};
 ['assets/studio/programme.js','assets/reussites/regles.js','assets/reussites/pdf.js'].forEach(p=>w.eval(fs.readFileSync(path.join(root,p),'utf8')));
 if(validations)w.NLValidations={lire:()=>validations};
 w.eval(fs.readFileSync(path.join(root,'assets/reussites/page.js'),'utf8'));
 await new Promise(r=>setTimeout(r,40));
 return {w,got,d:w.document};
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const t=(p)=>p.d.body.textContent.replace(/\s+/g,' ');
 // incomplet
 let p=await page({'nl-classe':'6e','nl-eleve-nom':'Awa Koné','pc-studio-prog':{}});
 check(/Parcours en cours/.test(t(p))&&/Validation non disponible/.test(t(p)),'9. états parcours en cours / certificat non disponible');
 check(p.d.getElementById('att-btn').getAttribute('aria-disabled')==='true'&&p.d.getElementById('part-btn').hidden,'1. bouton attestation désactivé');
 p.d.getElementById('att-btn').click();await wait(80);check(p.got.length===0&&/ne sont pas remplies/.test(p.d.getElementById('att-msg').textContent),'1. clic refusé avec explication');
 // contournement : bouton réactivé à la main, la génération revérifie
 p.d.getElementById('att-btn').setAttribute('aria-disabled','false');p.d.getElementById('att-btn').click();await wait(120);
 check(p.got.length===0&&/ne sont pas remplies/.test(p.d.getElementById('att-msg').textContent),'éligibilité revérifiée à la génération');
 // terminé non validé
 p=await page({'nl-classe':'6e','nl-eleve-nom':'Awa Koné','pc-studio-prog':fini});
 check(/Validation en attente/.test(t(p))&&!p.d.getElementById('part-btn').hidden&&!/Document disponible/.test(t(p)),'2. terminé non validé : en attente, participation proposée');
 p.d.getElementById('part-btn').click();await wait(120);check(p.got.some(g=>g==='dl:NohobaLab-participation-6e.pdf'),'participation téléchargée');
 // réussi
 p=await page({'nl-classe':'6e','nl-eleve-nom':'Awa Koné','pc-studio-prog':reussi});
 check(/Document disponible/.test(t(p)),'3. réussite : document disponible');
 p.d.getElementById('att-btn').click();await wait(120);const blob=p.got.find(g=>typeof g!=='string');check(blob&&blob.size>800&&p.got.includes('dl:NohobaLab-reussite-6e.pdf')&&/Document téléchargé/.test(p.d.getElementById('att-msg').textContent),'3. attestation téléchargée');
 check(p.d.getElementById('cert-btn').getAttribute('aria-disabled')==='true','4. certificat toujours indisponible sans validation');
 // certificat avec validations injectées
 p=await page({'nl-classe':'6e','nl-eleve-nom':'Awa Koné','pc-studio-prog':{}},{validations:[{competence:'Communiquer',niveau:'S'}]});
 check(/maîtrise satisfaisante/.test(t(p))&&p.d.getElementById('cert-btn').getAttribute('aria-disabled')==='false','certificat : compétence et niveau affichés');
 p.d.getElementById('cert-btn').click();await wait(120);check(p.got.includes('dl:NohobaLab-certificat-6e.pdf'),'4. certificat téléchargé');
 check(/1/.test(p.d.getElementById('n-cp').textContent),'compétences validées comptées');
 // nom manquant
 p=await page({'nl-classe':'6e','pc-studio-prog':reussi});p.d.getElementById('att-btn').click();await wait(120);
 check(/nom et ton prénom/.test(p.d.getElementById('att-msg').textContent)&&p.got.length===0,'nom exigé, message clair');
 // 7. erreur de téléchargement
 p=await page({'nl-classe':'6e','nl-eleve-nom':'Awa Koné','pc-studio-prog':reussi},{blobFail:true});p.d.getElementById('att-btn').click();await wait(120);
 check(/a échoué/.test(p.d.getElementById('att-msg').textContent)&&p.d.getElementById('att-msg').className.includes('err'),'7. erreur de téléchargement gérée');
 // données corrompues
 p=await page({'nl-classe':'6e','pc-studio-prog':'{pas du json'});check(/Parcours en cours/.test(t(p)),'données illisibles ignorées');
 // classe : changement
 p.d.querySelector('[data-c="3e"]').click();check(/classe de 3e/.test(p.d.getElementById('parcours').textContent)&&p.w.localStorage.getItem('nl-classe')==='3e','classe mémorisée');
 // 8-9 accessibilité statique
 const h=fs.readFileSync(path.join(root,'reussites/index.html'),'utf8');check(/lang="fr"/.test(h)&&/aria-live="polite"/.test(h)&&/<label for="nom">/.test(h)&&/role="radiogroup" aria-labelledby/.test(h),'9. libellés et zones live');
 check(/viewport/.test(h)&&/max-width:640px/.test(h),'8. responsive');
 console.log(`${checks} assertions passed — Mes réussites : règles, PDF et page.`);
})().catch(e=>{console.error(e);process.exit(1);});
