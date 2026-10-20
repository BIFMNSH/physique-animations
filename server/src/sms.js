import { cfg } from './config.js';

// Envoi du code SMS. Fournisseur : Africa's Talking (interchangeable : seule cette fonction change).
// Hors production et sans clés, le code est affiché dans les journaux (jamais en production).
export const outbox = []; // utilisé par les tests

export async function sendSms(to, text) {
  outbox.push({ to, text });
  const { username, apiKey, from, sandbox } = cfg.sms;
  if (!username || !apiKey) {
    if (cfg.prod) throw new Error('SMS non configuré (AT_USERNAME / AT_API_KEY)');
    console.log(`[sms:dev] ${to} : ${text}`);
    return;
  }
  const url = sandbox ? 'https://api.sandbox.africastalking.com/version1/messaging' : 'https://api.africastalking.com/version1/messaging';
  const body = new URLSearchParams({ username, to, message: text });
  if (from) body.set('from', from);
  const r = await fetch(url, { method: 'POST', headers: { apiKey, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!r.ok) throw new Error(`SMS refusé (${r.status})`);
  const j = await r.json().catch(() => ({}));
  const rec = j?.SMSMessageData?.Recipients?.[0];
  if (rec && !/success/i.test(rec.status || '')) throw new Error(`SMS non envoyé : ${rec.status}`);
}

export const otpText = (code) => `NOHOBA-Lab : ton code est ${code}. Il expire dans 5 minutes. Ne le donne à personne.`;
