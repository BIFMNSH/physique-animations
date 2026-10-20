import { serve } from '@hono/node-server';
import { cfg, checkConfig } from './config.js';

const problems = checkConfig();
if (problems.length) { console.error('Configuration incomplète :\n- ' + problems.join('\n- ')); process.exit(1); }

const { migrate, pool } = await import('./db.js');
const { authOptions } = await import('./auth.js');
const { createApp } = await import('./app.js');
await migrate(authOptions);
const server = serve({ fetch: createApp().fetch, port: cfg.port }, (i) => console.log(`NOHOBA-Lab API prête sur :${i.port} (${cfg.prod ? 'production' : 'dev'}, paiement : ${cfg.payMode})`));
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => server.close(async () => { await pool.end(); process.exit(0); }));
