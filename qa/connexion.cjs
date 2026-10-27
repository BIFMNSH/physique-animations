const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync(require('node:path').join(__dirname, '../connexion/index.html'), 'utf8');
const tick = () => new Promise(r => setImmediate(r));
async function page(providers, query = '') {
  const calls=[];
  const dom = new JSDOM(html, {url:'https://example.com/connexion/'+query, runScripts:'outside-only'});
  const w=dom.window;
  w.NLCompte={providers:async()=>{if(providers instanceof Error)throw providers;return {providers};},me:async()=>{throw {status:401};},marquer(){},oublier(){},req:async(path,o)=>{calls.push({path,...o});return {};}};
  const scripts=[...w.document.querySelectorAll('script:not([src])')].filter(s=>s.type!=='application/ld+json');
  scripts.forEach(s=>w.eval(s.textContent));
  await tick();await tick();
  return {w,calls,$:id=>w.document.getElementById(id),close:()=>w.close()};
}
(async()=>{
  let p=await page(new Error('offline'));
  assert.equal(p.$('fTel').hidden,true);assert.equal(p.$('bRetry').hidden,false);p.close();
  p=await page({email:false,sms:false});
  assert.equal(p.$('fTel').hidden,true);assert.equal(p.$('fMail').hidden,true);assert.match(p.$('mTop').textContent,/configuration/);p.close();
  p=await page({email:true,sms:false},'?mode=creer');
  assert.equal(p.$('rowNom').hidden,false);assert.equal(p.$('mdp').autocomplete,'new-password');p.close();
  p=await page({google:true,facebook:true,apple:true,twitter:true,email:true});
  assert.equal(p.$('socialRow').hidden,false);
  const buttons=[...p.w.document.querySelectorAll('.sbtn')];
  assert.deepEqual(buttons.map(b=>b.textContent),['Continuer avec Google','Continuer avec Apple','Continuer avec Facebook','Continuer avec X']);
  for(const b of buttons){
    b.click();b.click();await tick();
    const call=p.calls.at(-1);
    assert.equal(call.path,'/api/auth/sign-in/social');
    assert.equal(call.body.provider,b.dataset.p);
    assert.equal(call.body.callbackURL,'https://example.com/connexion/');
    assert.equal(call.body.errorCallbackURL,'https://example.com/connexion/?error=oauth');
    assert.equal(b.disabled,false);
    assert.match(p.$('mTop').textContent,/n’a pas abouti/);
  }
  assert.equal(p.calls.length,4,'Un seul appel par fournisseur malgré les doubles clics');
  p.close();
  p=await page({google:true,facebook:false});
  assert.equal(p.w.document.querySelectorAll('.sbtn').length,1);
  assert.equal(p.w.document.querySelector('.sbtn').dataset.p,'google');p.close();
  p=await page({sms:true});
  const submit=()=>p.$('fTel').dispatchEvent(new p.w.Event('submit',{cancelable:true}));
  submit();assert.equal(p.$('tel').getAttribute('aria-invalid'),'true');assert.equal(p.calls.length,0);
  p.$('tel').value='07 12 34 56 78';submit();await tick();
  assert.equal(p.calls[0].body.phoneNumber,'+2250712345678');assert.equal(p.$('tel').disabled,true);assert.equal(p.$('ind').disabled,true);
  assert.equal(p.$('otpActions').hidden,false);assert.equal(p.$('bResend').disabled,true);
  p.w.Date.now=()=>Date.now()+61000;p.$('bResend').disabled=false;p.$('bResend').click();await tick();
  assert.equal(p.calls.length,2);assert.equal(p.calls[1].body.phoneNumber,'+2250712345678');
  p.$('bChange').click();assert.equal(p.$('tel').disabled,false);assert.equal(p.$('otpRow').hidden,true);
  p.$('ind').value='33';p.$('tel').value='06 12 34 56 78';submit();await tick();
  assert.equal(p.calls[2].body.phoneNumber,'+33612345678');
  p.$('otp').value='12x456';submit();assert.equal(p.calls.length,3);assert.equal(p.$('otp').getAttribute('aria-invalid'),'true');p.close();
  console.log('Connexion : panne, fournisseurs, création, validation, renvoi SMS, changement de numéro OK');
})().catch(e=>{console.error(e);process.exit(1);});
