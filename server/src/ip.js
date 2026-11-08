// Adresse du visiteur derrière Vercel puis Railway. Vercel place l'IP réelle dans x-vercel-forwarded-for ;
// x-forwarded-for reste le repli. CLIENT_IP_HEADER (optionnel) passe en premier si l'on change d'hébergeur.
export const IP_HEADERS = [...(process.env.CLIENT_IP_HEADER ? [process.env.CLIENT_IP_HEADER.toLowerCase()] : []), 'x-vercel-forwarded-for', 'x-real-ip', 'x-forwarded-for'];
export function clientIp(get) {
  for (const h of IP_HEADERS) {
    const v = (get(h) || '').split(',')[0].trim();
    if (v) return v;
  }
  return 'local';
}
