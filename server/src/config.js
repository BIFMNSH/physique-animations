// Configuration : tout vient des variables d'environnement (Railway → Variables).
const e = process.env;
const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

export const cfg = {
  prod: e.NODE_ENV === 'production',
  port: Number(e.PORT) || 3000,
  databaseUrl: e.DATABASE_URL || '',
  secret: e.BETTER_AUTH_SECRET || '',
  siteUrl: (e.SITE_URL || 'https://lab.nohaba.com').replace(/\/$/, ''),
  apiUrl: (e.BETTER_AUTH_URL || `http://localhost:${Number(e.PORT) || 3000}`).replace(/\/$/, ''),
  cookieDomain: e.COOKIE_DOMAIN || '', // ex. lab.nohaba.com : cookie partagé entre le site et api.lab.nohaba.com
  extraOrigins: list(e.EXTRA_ORIGINS),
  // Gratuité annoncée : tout le contenu reste ouvert jusqu'à cette date (incluse).
  freeUntil: e.FREE_UNTIL || '2026-12-31',
  phoneRegex: new RegExp(e.PHONE_REGEX || '^\\+(225(01|05|07)\\d{8}|33[67]\\d{8})$'),
  google: { id: e.GOOGLE_CLIENT_ID, secret: e.GOOGLE_CLIENT_SECRET },
  facebook: { id: e.FACEBOOK_CLIENT_ID, secret: e.FACEBOOK_CLIENT_SECRET },
  twitter: { id: e.TWITTER_CLIENT_ID, secret: e.TWITTER_CLIENT_SECRET },
  sms: {
    username: e.AT_USERNAME, apiKey: e.AT_API_KEY, from: e.AT_SENDER_ID || '',
    sandbox: e.AT_SANDBOX === '1',
  },
  cinetpay: { apiKey: e.CINETPAY_API_KEY, siteId: e.CINETPAY_SITE_ID },
  payMode: e.PAY_MODE || (e.CINETPAY_API_KEY ? 'cinetpay' : 'off'), // cinetpay | mock | off
};

export function checkConfig() {
  const problems = [];
  if (!cfg.databaseUrl) problems.push('DATABASE_URL manquant');
  if (cfg.secret.length < 32) problems.push('BETTER_AUTH_SECRET doit faire au moins 32 caractères (openssl rand -base64 32)');
  if (cfg.prod && cfg.payMode === 'mock') problems.push('PAY_MODE=mock est interdit en production');
  if (cfg.payMode === 'cinetpay' && !(cfg.cinetpay.apiKey && cfg.cinetpay.siteId)) problems.push('CINETPAY_API_KEY et CINETPAY_SITE_ID requis');
  return problems;
}

export const origins = () => [cfg.siteUrl, ...cfg.extraOrigins, ...(cfg.prod ? [] : ['http://localhost:8765', 'http://127.0.0.1:8765'])];
