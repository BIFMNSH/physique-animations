// Envoi d'e-mails (confirmation d'adresse, mot de passe oublié) via Resend (https://resend.com).
// Sans RESEND_API_KEY : en développement le message s'affiche dans la console ; en production la connexion par e-mail est désactivée.
import { cfg } from './config.js';

export const mailReady = () => Boolean(cfg.mail.key) || !cfg.prod;

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function sendMail(to, subject, text, buttonLabel, url) {
  if (!cfg.mail.key) { console.log(`[mail] à ${to} : ${subject}\n${text}\n${url}`); return; }
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;color:#0E162A;max-width:480px"><p>${esc(text)}</p><p><a href="${esc(url)}" style="display:inline-block;background:#C2410C;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">${esc(buttonLabel)}</a></p><p style="color:#46536B;font-size:14px">Si le bouton ne marche pas, copiez ce lien dans votre navigateur :<br>${esc(url)}</p><p style="color:#46536B;font-size:14px">Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p></div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.mail.key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: cfg.mail.from, to, subject, text: `${text}\n\n${url}`, html }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}`);
}

export const verifyMail = (user, url) => sendMail(user.email, 'Confirmez votre adresse e-mail · NOHOBA-Lab', 'Bienvenue sur NOHOBA-Lab. Confirmez votre adresse e-mail pour activer votre compte.', 'Confirmer mon adresse', url);
export const resetMail = (user, url) => sendMail(user.email, 'Nouveau mot de passe · NOHOBA-Lab', 'Vous avez demandé un nouveau mot de passe pour NOHOBA-Lab. Le lien est valable une heure.', 'Choisir un nouveau mot de passe', url);
