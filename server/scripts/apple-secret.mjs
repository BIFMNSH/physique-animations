// Génère APPLE_CLIENT_SECRET (jeton JWT ES256, valable 180 jours : à régénérer avant la fin).
// Usage : node scripts/apple-secret.mjs <TEAM_ID> <SERVICES_ID> <KEY_ID> <chemin/AuthKey_XXXX.p8>
import { createPrivateKey, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';
const [team, client, kid, file] = process.argv.slice(2);
if (!team || !client || !kid || !file) { console.error('Usage : node scripts/apple-secret.mjs TEAM_ID SERVICES_ID KEY_ID AuthKey.p8'); process.exit(1); }
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64({ alg: 'ES256', kid });
const body = b64({ iss: team, iat: now, exp: now + 15552000, aud: 'https://appleid.apple.com', sub: client });
const sig = sign('sha256', Buffer.from(`${head}.${body}`), { key: createPrivateKey(readFileSync(file)), dsaEncoding: 'ieee-p1363' }).toString('base64url');
console.log(`${head}.${body}.${sig}`);
