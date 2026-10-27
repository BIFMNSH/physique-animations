import { betterAuth } from 'better-auth';
import { phoneNumber } from 'better-auth/plugins';
import { pool } from './db.js';
import { cfg, origins } from './config.js';
import { sendSms, otpText, smsReady } from './sms.js';
import { mailReady, verifyMail, resetMail } from './mail.js';

const social = {};
if (cfg.google.id && cfg.google.secret) social.google = { clientId: cfg.google.id, clientSecret: cfg.google.secret };
if (cfg.facebook.id && cfg.facebook.secret) social.facebook = { clientId: cfg.facebook.id, clientSecret: cfg.facebook.secret };
if (cfg.twitter.id && cfg.twitter.secret) social.twitter = { clientId: cfg.twitter.id, clientSecret: cfg.twitter.secret };
if (cfg.apple.id && cfg.apple.secret) social.apple = { clientId: cfg.apple.id, clientSecret: cfg.apple.secret };

export const providers = () => ({ ...Object.fromEntries(Object.keys(social).map((k) => [k, true])), sms: smsReady(), email: mailReady() });

export const authOptions = {
  appName: 'NOHOBA-Lab',
  baseURL: cfg.apiUrl,
  secret: cfg.secret,
  database: pool,
  // Apple renvoie l'utilisateur par un formulaire POST depuis appleid.apple.com.
  trustedOrigins: [...origins(), ...(social.apple ? ['https://appleid.apple.com'] : [])],
  socialProviders: social,
  emailAndPassword: {
    enabled: mailReady(),
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: Boolean(cfg.mail.key),
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: ({ user, url }) => { resetMail(user, url).catch((err) => console.error('[mail]', err.message)); },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: ({ user, url }) => { verifyMail(user, url).catch((err) => console.error('[mail]', err.message)); },
  },
  plugins: [
    ...(smsReady() ? [phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      phoneNumberValidator: (n) => cfg.phoneRegex.test(n),
      // Ne pas attendre l'envoi (attaque par mesure du temps de réponse).
      sendOTP: ({ phoneNumber: n, code }) => { sendSms(n, otpText(code)).catch((err) => console.error('[sms]', err.message)); },
      signUpOnVerification: {
        getTempEmail: (n) => `${n.replace(/\D/g, '')}@sms.invalid`,
        getTempName: (n) => `Élève ${n.slice(-4)}`,
      },
    })] : []),
  ],
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 60,
    max: 60,
    customRules: {
      '/phone-number/send-otp': { window: 60, max: 3 },
      '/phone-number/verify': { window: 60, max: 10 },
      '/sign-up/email': { window: 60, max: 5 },
      '/sign-in/email': { window: 60, max: 10 },
      '/request-password-reset': { window: 60, max: 3 },
      '/send-verification-email': { window: 60, max: 3 },
    },
  },
  advanced: {
    skipTrailingSlashes: true, // Le proxy Vercel conserve les URL avec slash final.
    useSecureCookies: cfg.prod,
    ipAddress: { ipAddressHeaders: ['x-forwarded-for'] },
    ...(cfg.cookieDomain ? { crossSubDomainCookies: { enabled: true, domain: cfg.cookieDomain } } : {}),
  },
};

export const auth = betterAuth(authOptions);

